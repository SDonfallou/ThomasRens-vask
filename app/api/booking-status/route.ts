import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendStatusChangeEmails } from '@/lib/resend'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { order_ref, status } = body

    if (!order_ref || !status) {
      return NextResponse.json({ error: 'order_ref og status kreves.' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('bookings')
      .update({ status })
      .eq('order_ref', order_ref)
      .select()
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Fant ikke bokingen.' }, { status: 404 })
    }

    if (status === 'ready' || status === 'collected') {
      sendStatusChangeEmails(data, status).catch(err => {
        console.error('Failed to send status change emails:', err)
      })
    }

    return NextResponse.json({ success: true, booking: data })
  } catch (err: any) {
    console.error('Booking status update error:', err)
    return NextResponse.json({ error: 'Noe gikk galt.' }, { status: 500 })
  }
}
