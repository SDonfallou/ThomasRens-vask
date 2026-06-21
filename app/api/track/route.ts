import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, buildTimeline } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q')?.trim()

  if (!query) {
    return NextResponse.json({ error: 'Mangler søkeparameter.' }, { status: 400 })
  }

  // Match by order ref (TR-XXXX) or phone number
  const isOrderRef = query.toUpperCase().startsWith('TR-')

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .eq(isOrderRef ? 'order_ref' : 'phone', isOrderRef ? query.toUpperCase() : query)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Ingen ordre funnet. Sjekk nummeret og prøv igjen.' }, { status: 404 })
  }

  return NextResponse.json({
    order_ref: data.order_ref,
    service: data.service,
    status: data.status,
    timeline: buildTimeline(data),
  })
}
