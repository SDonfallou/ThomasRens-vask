import { Resend } from 'resend'
import nodemailer from 'nodemailer'
import type { Booking } from '@/lib/supabase'

function getEnvVar(name: string) {
  const value = process.env[name]
  if (!value) return undefined
  return value.split('//')[0].split('#')[0].trim()
}

const API_KEY = getEnvVar('RESEND_API_KEY') || ''
const resend = new Resend(API_KEY || undefined)
const GMAIL_USER = getEnvVar('GMAIL_USER')
const GMAIL_PASS = getEnvVar('GMAIL_PASS')

function getShopEmail() {
  return getEnvVar('SHOP_EMAIL') || 'dfallou7@gmail.com'
}

function getSender() {
  const sender = getEnvVar('SENDER_EMAIL') || getShopEmail()
  const display = getEnvVar('SENDER_NAME') || 'Thomas Rens & Vask'
  if (!isValidEmail(sender)) {
    throw new Error(`Invalid sender email: ${sender}`)
  }
  return `${display} <${sender}>`
}

function isValidEmail(email?: string) {
  return !!email && /.+@.+\..+/.test(email)
}

function parseEmailAddress(value: string) {
  const match = value.match(/<([^>]+)>$/)
  return match ? match[1] : value
}

function isGmailAddress(email: string) {
  return email.toLowerCase().endsWith('@gmail.com')
}

function ensureConfig() {
  if (!API_KEY && !(GMAIL_USER && GMAIL_PASS)) {
    console.error('Resend API key or Gmail SMTP credentials are missing. Set RESEND_API_KEY or GMAIL_USER and GMAIL_PASS.')
  }
  const shopEmail = getShopEmail()
  if (!isValidEmail(shopEmail)) {
    console.warn(`SHOP_EMAIL is missing or invalid; shop notifications may fail. Parsed value: ${shopEmail}`)
  }
}

async function createGmailTransport() {
  if (!GMAIL_USER || !GMAIL_PASS) {
    throw new Error('Gmail SMTP credentials are required for Gmail fallback.')
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS,
    },
  })
}

async function sendViaGmail(payload: { from: string; to: string | string[]; subject: string; html: string }) {
  const transporter = await createGmailTransport()
  return transporter.sendMail({
    from: payload.from,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  })
}

async function sendEmail(payload: { from: string; to: string | string[]; subject: string; html: string }) {
  ensureConfig()
  const fromEmail = parseEmailAddress(payload.from)
  const useGmail = isGmailAddress(fromEmail) && GMAIL_USER && GMAIL_PASS

  if (useGmail) {
    console.debug('Mail: sending via Gmail SMTP', { from: payload.from, to: payload.to, subject: payload.subject })
    return sendViaGmail(payload)
  }

  if (!API_KEY) {
    throw new Error('RESEND_API_KEY is missing and Gmail SMTP is unavailable.')
  }

  console.debug('Mail: sending via Resend', { from: payload.from, to: payload.to, subject: payload.subject })
  return resend.emails.send(payload)
}

function customerCollectedHtml(booking: Booking) {
  return `
    <h2>Ordren din er hentet</h2>
    <p>Hei ${booking.name},</p>
    <p>Din bestilling <strong>${booking.order_ref}</strong> er nå hentet.</p>
    <p>Detaljer:</p>
    <ul>
      <li><strong>Tjeneste:</strong> ${booking.service}</li>
      <li><strong>Henteadresse:</strong> ${booking.address}</li>
      <li><strong>Ønsket dato:</strong> ${booking.preferred_date || 'Ikke spesifisert'}</li>
      <li><strong>Beskrivelse:</strong> ${booking.description || '—'}</li>
    </ul>
    <p>Takk for at du valgte Thomas Rens & Vask.</p>
  `
}

function customerReadyHtml(booking: Booking) {
  return `
    <h2>Ordren din er klar for henting</h2>
    <p>Hei ${booking.name},</p>
    <p>Din bestilling <strong>${booking.order_ref}</strong> er ferdig og klar for henting.</p>
    <p>Detaljer:</p>
    <ul>
      <li><strong>Tjeneste:</strong> ${booking.service}</li>
      <li><strong>Henteadresse:</strong> ${booking.address}</li>
      <li><strong>Ønsket dato:</strong> ${booking.preferred_date || 'Ikke spesifisert'}</li>
      <li><strong>Beskrivelse:</strong> ${booking.description || '—'}</li>
    </ul>
    <p>Du kan hente den når som helst i våre åpningstider.</p>
  `
}

function shopStatusHtml(booking: Booking, status: string) {
  const label = status === 'ready' ? 'klar for henting' : 'hentet'
  return `
    <h2>Ordre oppdatert</h2>
    <p>Ordren <strong>${booking.order_ref}</strong> er markert som ${label}.</p>
    <p>Detaljer:</p>
    <ul>
      <li><strong>Kunde:</strong> ${booking.name}</li>
      <li><strong>Telefon:</strong> ${booking.phone}</li>
      <li><strong>E-post:</strong> ${booking.email}</li>
      <li><strong>Tjeneste:</strong> ${booking.service}</li>
      <li><strong>Status:</strong> ${status}</li>
    </ul>
  `
}

export { sendEmail, getSender, getShopEmail }

export async function sendStatusChangeEmails(booking: Booking, status: string) {
  ensureConfig()
  if (status === 'ready') {
    const payload = {
      from: getSender(),
      to: booking.email,
      subject: `Din bestilling ${booking.order_ref} er klar for henting`,
      html: customerReadyHtml(booking),
    }
    try {
      console.debug('Mail: sending ready->customer', { to: booking.email, order_ref: booking.order_ref })
      const res = await sendEmail(payload)
      console.debug('Mail response:', res)
    } catch (err: any) {
      console.error('Mail error (ready->customer):', err?.message || err)
      console.error('Mail error details:', err?.response || err)
    }
  }

  if (status === 'collected') {
    const payload = {
      from: getSender(),
      to: booking.email,
      subject: `Din bestilling ${booking.order_ref} er hentet`,
      html: customerCollectedHtml(booking),
    }
    try {
      console.debug('Mail: sending collected->customer', { to: booking.email, order_ref: booking.order_ref })
      const res = await sendEmail(payload)
      console.debug('Mail response:', res)
    } catch (err: any) {
      console.error('Mail error (collected->customer):', err?.message || err)
      console.error('Mail error details:', err?.response || err)
    }
  }

  if (status === 'ready' || status === 'collected') {
    const payload = {
      from: getSender(),
      to: getShopEmail(),
      subject: `Ordre ${booking.order_ref} er ${status === 'ready' ? 'klar for henting' : 'hentet'}`,
      html: shopStatusHtml(booking, status),
    }
    try {
      console.debug('Mail: sending shop notification', { to: getShopEmail(), order_ref: booking.order_ref, status })
      const res = await sendEmail(payload)
      console.debug('Mail response:', res)
    } catch (err: any) {
      console.error('Mail error (shop notification):', err?.message || err)
      console.error('Mail error details:', err?.response || err)
    }
  }
}
