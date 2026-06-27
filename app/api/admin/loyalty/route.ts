import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

type LoyaltyAction = 'earn' | 'redeem' | 'adjust'

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

function sanitizeOptional(value: unknown) {
  const s = String(value || '').trim()
  return s === '' ? null : s
}

export async function GET(req: NextRequest) {
  try {
    const pw = req.headers.get('x-admin-password') || ''
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''
    if (!ADMIN_PASSWORD || pw !== ADMIN_PASSWORD) return unauthorized()

    const url = new URL(req.url)
    const q = (url.searchParams.get('q') || '').trim().toLowerCase()

    const { data, error } = await supabaseAdmin
      .from('loyalty_customers')
      .select('id,name,phone,email,points_balance,lifetime_points,created_at')
      .order('points_balance', { ascending: false })
      .limit(200)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const customers = (data || []).filter((c: any) => {
      if (!q) return true
      return [c.name, c.phone, c.email].some((v: string | null) => String(v || '').toLowerCase().includes(q))
    })

    return NextResponse.json({ customers })
  } catch (err: any) {
    console.error('GET /api/admin/loyalty failed', err)
    return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const pw = req.headers.get('x-admin-password') || ''
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''
    if (!ADMIN_PASSWORD || pw !== ADMIN_PASSWORD) return unauthorized()

    const body = await req.json().catch(() => ({}))
    const action = String(body.action || '').trim()

    if (action === 'upsertCustomer') {
      const name = String(body.name || '').trim()
      const phone = sanitizeOptional(body.phone)
      const email = sanitizeOptional(body.email)

      if (!name) {
        return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
      }

      if (!phone && !email) {
        return NextResponse.json({ error: 'Phone or email is required.' }, { status: 400 })
      }

      let query = supabaseAdmin
        .from('loyalty_customers')
        .select('id,name,phone,email,points_balance,lifetime_points,created_at')
        .limit(1)

      if (phone) query = query.eq('phone', phone)
      else if (email) query = query.eq('email', email)

      const { data: existing, error: findErr } = await query.maybeSingle()
      if (findErr) return NextResponse.json({ error: findErr.message }, { status: 500 })

      if (existing) {
        const { data: updated, error: updateErr } = await supabaseAdmin
          .from('loyalty_customers')
          .update({ name, phone, email, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
          .select('id,name,phone,email,points_balance,lifetime_points,created_at')
          .single()
        if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 })
        return NextResponse.json({ customer: updated })
      }

      const { data: created, error: createErr } = await supabaseAdmin
        .from('loyalty_customers')
        .insert([{ name, phone, email }])
        .select('id,name,phone,email,points_balance,lifetime_points,created_at')
        .single()

      if (createErr) return NextResponse.json({ error: createErr.message }, { status: 500 })
      return NextResponse.json({ customer: created })
    }

    if (action === 'points') {
      const customerId = String(body.customerId || '').trim()
      const kind = String(body.kind || '').trim() as LoyaltyAction
      const pointsRaw = Number(body.points || 0)
      const orderRef = sanitizeOptional(body.orderRef)
      const note = sanitizeOptional(body.note)

      if (!customerId || !kind || !['earn', 'redeem', 'adjust'].includes(kind)) {
        return NextResponse.json({ error: 'Invalid loyalty action.' }, { status: 400 })
      }

      if (!Number.isFinite(pointsRaw) || pointsRaw <= 0) {
        return NextResponse.json({ error: 'Points must be greater than 0.' }, { status: 400 })
      }

      const points = Math.trunc(pointsRaw)

      const { data: customer, error: customerErr } = await supabaseAdmin
        .from('loyalty_customers')
        .select('id,points_balance,lifetime_points')
        .eq('id', customerId)
        .single()

      if (customerErr || !customer) return NextResponse.json({ error: customerErr?.message || 'Customer not found.' }, { status: 404 })

      const delta = kind === 'redeem' ? -points : points
      const nextBalance = customer.points_balance + delta
      if (nextBalance < 0) {
        return NextResponse.json({ error: 'Insufficient points for redemption.' }, { status: 400 })
      }

      const nextLifetime = kind === 'earn' ? customer.lifetime_points + points : customer.lifetime_points

      const { error: updateErr } = await supabaseAdmin
        .from('loyalty_customers')
        .update({
          points_balance: nextBalance,
          lifetime_points: nextLifetime,
          updated_at: new Date().toISOString(),
        })
        .eq('id', customerId)

      if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 })

      const { error: txnErr } = await supabaseAdmin
        .from('loyalty_transactions')
        .insert([{
          customer_id: customerId,
          kind,
          points: delta,
          note,
          order_ref: orderRef,
        }])

      if (txnErr) return NextResponse.json({ error: txnErr.message }, { status: 500 })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
  } catch (err: any) {
    console.error('POST /api/admin/loyalty failed', err)
    return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500 })
  }
}