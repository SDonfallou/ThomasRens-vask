import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function GET(req: NextRequest) {
  try {
    const pw = req.headers.get('x-admin-password') || ''
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''
    if (!ADMIN_PASSWORD || pw !== ADMIN_PASSWORD) return unauthorized()
    const url = new URL(req.url)
    const page = Math.max(1, Number(url.searchParams.get('page') || '1'))
    const limit = Math.max(1, Math.min(100, Number(url.searchParams.get('limit') || '20')))
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await supabaseAdmin
      .from('bookings')
      .select('id,order_ref,name,phone,email,address,service,preferred_date,description,status,created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      console.error('Supabase list error', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ bookings: data || [], page, limit, total: count || 0 })
  } catch (err) {
    console.error('GET /api/admin/bookings failed', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
