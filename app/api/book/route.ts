import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendEmail, getShopEmail, getSender } from '@/lib/resend'

function getEnvVar(name: string) {
  const value = process.env[name]
  if (!value) return undefined
  return value.split('//')[0].split('#')[0].trim()
}

function isValidEmail(email?: string) {
  return !!email && /.+@.+\..+/.test(email)
}

function generateOrderRef() {
  return 'TR-' + Math.floor(1000 + Math.random() * 9000)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, email, address, service, preferred_date, description } = body

    if (!name || !phone || !email || !address || !service) {
      return NextResponse.json({ error: 'Mangler påkrevde felt.' }, { status: 400 })
    }

    const order_ref = generateOrderRef()

    const { data, error } = await supabaseAdmin
      .from('bookings')
      .insert([{ order_ref, name, phone, email, address, service, preferred_date, description, status: 'received' }])
      .select()
      .single()

    if (error) throw error

    // Respond early so booking isn't lost if email sending fails.
    // Send emails in background and log any errors.
    ;(async () => {
      try {
        await sendEmail({
          from: getSender(),
          to: email,
          subject: `Bestilling mottatt — ${order_ref}`,
          html: `<h2>Takk, ${name}!</h2><p>Vi har mottatt din bestilling og vil kontakte deg innen 2 timer for å bekrefte henting.</p><p><strong>Ordrenummer:</strong> ${order_ref}</p><p><strong>Tjeneste:</strong> ${service}</p><p><strong>Henteadresse:</strong> ${address}</p><p>Thomas Rens & Vask · Hesselbergs gate 7, Oslo · 22 71 78 70</p>`,
        })

        await sendEmail({
          from: getSender(),
          to: getShopEmail(),
          subject: `Ny bestilling ${order_ref} — ${service}`,
          html: `<h2>Ny bestilling: ${order_ref}</h2><p><strong>Kunde:</strong> ${name}</p><p><strong>Telefon:</strong> ${phone}</p><p><strong>E-post:</strong> ${email}</p><p><strong>Henteadresse:</strong> ${address}</p><p><strong>Tjeneste:</strong> ${service}</p><p><strong>Ønsket dato:</strong> ${preferred_date || 'Ikke spesifisert'}</p><p><strong>Beskrivelse:</strong> ${description || '—'}</p>`,
        })
      } catch (emailErr) {
        console.error('Email send error:', emailErr)
      }
    })()

    return NextResponse.json({ success: true, order_ref })
  } catch (err: any) {
    console.error('Booking error:', err)
    return NextResponse.json({ error: 'Noe gikk galt. Prøv igjen.' }, { status: 500 })
  }
}
