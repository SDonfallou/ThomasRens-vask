'use client'
import { useState } from 'react'

type TrackResult = {
  order_ref: string
  service: string
  status: string
  timeline: { status: string; label: string; done: boolean; active: boolean; time: string | null }[]
}

export default function BestillingPage() {
  // Booking form state
  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: '',
    service: 'Kjemisk rens', preferred_date: '', description: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [confirmed, setConfirmed] = useState<string | null>(null)
  const [bookingError, setBookingError] = useState<string | null>(null)

  // Tracking state
  const [trackQuery, setTrackQuery] = useState('')
  const [tracking, setTracking] = useState(false)
  const [trackResult, setTrackResult] = useState<TrackResult | null>(null)
  const [trackError, setTrackError] = useState<string | null>(null)

  async function handleSubmit() {
    setSubmitting(true)
    setBookingError(null)
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setConfirmed(data.order_ref)
    } catch (e: any) {
      setBookingError(e.message || 'Noe gikk galt.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleTrack() {
    if (!trackQuery.trim()) return
    setTracking(true)
    setTrackError(null)
    setTrackResult(null)
    try {
      const res = await fetch(`/api/track?q=${encodeURIComponent(trackQuery.trim())}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setTrackResult(data)
    } catch (e: any) {
      setTrackError(e.message || 'Ingen ordre funnet.')
    } finally {
      setTracking(false)
    }
  }

  const field = (label: string, key: keyof typeof form, type = 'text', placeholder = '') => (
    <div className="flex flex-col gap-1">
      <label className="font-sans text-[10px] tracking-widest uppercase text-[#7A7468]">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className="bg-white border border-[#E5E0D5] px-3 py-3 font-sans text-[13px] text-[#2C2C28] outline-none focus:border-[#8B7355]"
      />
    </div>
  )

  return (
    <div className="py-16 px-10 max-w-[680px] mx-auto">
      <h1 className="text-[32px] font-normal text-center mb-2">Bestill & spor</h1>
      <p className="font-sans text-[13px] text-[#7A7468] text-center mb-11">
        Fyll ut skjemaet så kontakter vi deg for å bekrefte henting.
      </p>

      {/* BOOKING FORM */}
      {confirmed ? (
        <div className="bg-[#FAF8F3] p-10 text-center">
          <div className="text-[#5C6E50] text-2xl mb-3">✓</div>
          <h2 className="text-[20px] font-normal mb-2">Bestilling mottatt</h2>
          <p className="font-sans text-[13px] text-[#7A7468] mb-1">Ditt ordrenummer: <strong className="text-[#2C2C28]">{confirmed}</strong></p>
          <p className="font-sans text-[13px] text-[#7A7468]">Vi kontakter deg innen 2 timer for å bekrefte henting.</p>
          <p className="font-sans text-[12px] text-[#7A7468] mt-4">Bruk ordrenummeret nedenfor for å spore ordren din.</p>
        </div>
      ) : (
        <div className="bg-[#FAF8F3] p-10">
          <div className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#8B7355] mb-4">Din informasjon</div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {field('Navn', 'name', 'text', 'Ditt fulle navn')}
            {field('Telefon', 'phone', 'tel', '+47 xxx xx xxx')}
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {field('E-post', 'email', 'email', 'din@epost.no')}
            {field('Adresse (henting)', 'address', 'text', 'Gate og nummer')}
          </div>
          <hr className="border-none border-t border-[#E5E0D5] my-6" />
          <div className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#8B7355] mb-4">Om plagget</div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="flex flex-col gap-1">
              <label className="font-sans text-[10px] tracking-widest uppercase text-[#7A7468]">Tjeneste</label>
              <select
                value={form.service}
                onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                className="bg-white border border-[#E5E0D5] px-3 py-3 font-sans text-[13px] text-[#2C2C28] outline-none focus:border-[#8B7355]"
              >
                {['Kjemisk rens','Skjorteservice','Skreddertjeneste','Bunad','Interiør / soverom','Ekspress 24t (+50 kr)','Annet'].map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            {field('Ønsket dato', 'preferred_date', 'date')}
          </div>
          <div className="flex flex-col gap-1 mb-6">
            <label className="font-sans text-[10px] tracking-widest uppercase text-[#7A7468]">Beskrivelse (valgfri)</label>
            <textarea
              placeholder="F.eks: 1 dress + 2 skjorter, ekspresslevering til fredag..."
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3}
              className="bg-white border border-[#E5E0D5] px-3 py-3 font-sans text-[13px] text-[#2C2C28] outline-none focus:border-[#8B7355] resize-y"
            />
          </div>
          {bookingError && <p className="font-sans text-[12px] text-red-600 mb-4">{bookingError}</p>}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-[#1A1A18] text-white py-4 font-sans text-[11px] tracking-widest uppercase font-bold hover:bg-[#8B7355] transition-colors disabled:opacity-50"
          >
            {submitting ? 'Sender…' : 'Send bestilling'}
          </button>
        </div>
      )}

      {/* ORDER TRACKER */}
      <div className="mt-14 text-center">
        <h2 className="text-[22px] font-normal mb-2">Spor din ordre</h2>
        <p className="font-sans text-[13px] text-[#7A7468] mb-5">Skriv inn ditt telefonnummer eller ordrenummer (TR-XXXX).</p>
        <div className="flex gap-2 max-w-[420px] mx-auto">
          <input
            type="text"
            placeholder="Telefon eller ordrenummer"
            value={trackQuery}
            onChange={e => setTrackQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleTrack()}
            className="flex-1 bg-[#FAF8F3] border border-[#E5E0D5] px-4 py-3 font-sans text-[13px] outline-none focus:border-[#8B7355]"
          />
          <button
            onClick={handleTrack}
            disabled={tracking}
            className="bg-[#1A1A18] text-white px-5 py-3 font-sans text-[11px] tracking-widest uppercase hover:bg-[#8B7355] transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {tracking ? '…' : 'Søk'}
          </button>
        </div>

        {trackError && (
          <p className="font-sans text-[12px] text-red-600 mt-4">{trackError}</p>
        )}

        {trackResult && (
          <div className="max-w-[420px] mx-auto bg-[#FAF8F3] p-6 mt-5 text-left">
            <div className="font-sans text-[10px] tracking-widest uppercase text-[#8B7355] mb-4">
              Ordre {trackResult.order_ref} — {trackResult.service}
            </div>
            {trackResult.timeline.map(({ label, done, active, time }) => (
              <div key={label} className="flex items-center gap-3 py-2 border-b border-[#E5E0D5] last:border-b-0 font-sans text-[13px]">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${done ? 'bg-[#5C6E50]' : active ? 'bg-[#C4A882]' : 'bg-[#E5E0D5]'}`} />
                <span className={`flex-1 ${active ? 'font-bold' : ''}`}>{label}{active ? ' ← nå' : ''}</span>
                <span className="text-[11px] text-[#7A7468]">{time || '—'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
