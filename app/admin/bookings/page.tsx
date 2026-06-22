'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/Toast'

type OrderStatus = 'received' | 'processing' | 'ready' | 'collected'

interface Booking {
  id: string
  order_ref: string
  name: string
  phone?: string
  email?: string
  address?: string
  service?: string
  preferred_date?: string
  description?: string
  status: OrderStatus
  created_at: string
}

interface ServiceItem {
  _id?: string
  title?: string
  number?: string
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [services, setServices] = useState<ServiceItem[]>([])
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [filter, setFilter] = useState<'all' | OrderStatus | 'search'>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [total, setTotal] = useState(0)
  const [selected, setSelected] = useState<Booking | null>(null)
  const [bookingForm, setBookingForm] = useState({
    name: '', phone: '', email: '', address: '', service: '', preferred_date: '', description: ''
  })
  const [message, setMessage] = useState<string | null>(null)
  const [changing, setChanging] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const modalCloseRef = useRef<HTMLButtonElement | null>(null)
  const toast = useToast()

  async function loadBookings() {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/bookings?page=${page}&limit=${limit}`, { headers: { 'x-admin-password': password } })
      if (res.status === 401) {
        setAuthed(false)
        setBookings([])
        return
      }
      const json = await res.json()
      setBookings(json.bookings || [])
      setTotal(json.total || 0)
    } catch (err) {
      console.error('Failed to load bookings', err)
      toast.show('Failed to load bookings', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function loadServices() {
    try {
      const res = await fetch('/api/services')
      const json = await res.json()
      const list = Array.isArray(json.services) ? json.services : []
      setServices(list)
      if (!bookingForm.service && list.length) {
        setBookingForm(f => ({ ...f, service: list[0].title || list[0].number || '' }))
      }
    } catch (err) {
      console.error('Failed to load services', err)
    }
  }

  useEffect(() => { loadBookings() }, [page])

  useEffect(() => {
    loadServices()
  }, [])

  useEffect(() => {
    if (!authed) return
    const channel = supabase
      .channel('public:bookings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        loadBookings()
      })
      .subscribe()

    return () => {
      try { supabase.removeChannel(channel) } catch (e) { /* ignore */ }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, page, limit, password])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setSelected(null)
    }
    if (selected) {
      document.addEventListener('keydown', onKey)
      setTimeout(() => modalCloseRef.current?.focus(), 0)
    }
    return () => document.removeEventListener('keydown', onKey)
  }, [selected])

  async function updateStatus(order_ref: string, status: OrderStatus) {
    try {
      const res = await fetch('/api/booking-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ order_ref, status }),
      })
      if (!res.ok) throw new Error(`Status update failed: ${res.status}`)
      await loadBookings()
      toast.show(`Status updated: ${order_ref} → ${status}`, 'success')
    } catch (err) {
      console.error('Failed to update status', err)
      toast.show(`Failed to update ${order_ref}`, 'error')
    }
  }

  async function createBooking() {
    setCreating(true)
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingForm),
      })
      if (!res.ok) {
        const body = await res.text()
        throw new Error(body || `HTTP ${res.status}`)
      }
      setBookingForm({ name: '', phone: '', email: '', address: '', service: services[0]?.title || services[0]?.number || '', preferred_date: '', description: '' })
      toast.show('Booking created successfully', 'success')
      if (authed) await loadBookings()
    } catch (err) {
      console.error('Failed to create booking', err)
      toast.show('Failed to create booking', 'error')
    } finally {
      setCreating(false)
    }
  }

  function badgeClass(status: OrderStatus) {
    switch (status) {
      case 'received': return 'inline-block px-2 py-0.5 rounded text-xs text-white bg-gray-500'
      case 'processing': return 'inline-block px-2 py-0.5 rounded text-xs text-white bg-blue-600'
      case 'ready': return 'inline-block px-2 py-0.5 rounded text-xs text-white bg-green-600'
      case 'collected': return 'inline-block px-2 py-0.5 rounded text-xs text-white bg-gray-700'
    }
  }

  const visible = bookings
    .filter(b => (filter === 'all' ? true : filter === 'search' ? true : b.status === filter))
    .filter(b => {
      if (!search) return true
      const q = search.toLowerCase()
      return b.name.toLowerCase().includes(q) || b.order_ref.toLowerCase().includes(q) || (b.email || '').toLowerCase().includes(q)
    })

  return (
    <div className="p-6">
      {!authed && (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Admin password:</label>
            <input aria-label="Admin password" className="border px-2 py-1 rounded" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => { setAuthed(true); loadBookings() }}>Enter</button>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Admin — Bookings</h1>
          <p className="text-sm text-gray-600 mt-1">Manage incoming orders and create new bookings using service options from Sanity.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/services" className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">Manage services</Link>
          <Link href="/admin" className="rounded border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 hover:bg-slate-50">Admin home</Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_320px] mb-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <button aria-label="Refresh bookings" className="bg-gray-100 px-3 py-1 rounded flex items-center gap-2" onClick={() => loadBookings()}>
              <svg className={`${loading ? 'animate-spin' : ''} h-4 w-4 text-gray-600`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M12 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 18v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.93 4.93l2.83 2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.24 16.24l2.83 2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Refresh
            </button>
            <span className="text-sm text-gray-600">Page {page} of {Math.max(1, Math.ceil(total / limit))}</span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <select aria-label="Filter status" className="border px-2 py-1 rounded" value={filter} onChange={e => setFilter(e.target.value as any)}>
              <option value="all">All</option>
              <option value="received">Received</option>
              <option value="processing">Processing</option>
              <option value="ready">Ready</option>
              <option value="collected">Collected</option>
            </select>
            <input aria-label="Search bookings" className="flex-1 border px-3 py-1 rounded" placeholder="Search name, ref, email" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-gray-700">Service options loaded</p>
          <p className="text-sm text-gray-500 mt-2">{services.length ? `${services.length} services available` : 'No services loaded yet.'}</p>
        </div>
      </div>

      <div aria-live="polite" className="sr-only">{loading ? 'Loading bookings' : message || ''}</div>
      {loading && (
        <div className="py-6">
          <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-6 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      )}
      {!loading && visible.length === 0 && <p className="text-sm text-gray-500">No bookings found.</p>}

      {!loading && visible.length > 0 && (
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full divide-y divide-gray-200" role="table" aria-label="Bookings table">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 text-sm font-medium text-gray-600">Ref</th>
                <th className="text-left px-4 py-2 text-sm font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-2 text-sm font-medium text-gray-600">Email</th>
                <th className="text-left px-4 py-2 text-sm font-medium text-gray-600">Created</th>
                <th className="text-left px-4 py-2 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-2 text-sm font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {visible.map(b => (
                <tr key={b.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(b)}>
                  <td className="px-4 py-3 text-sm">{b.order_ref}</td>
                  <td className="px-4 py-3 text-sm">{b.name}</td>
                  <td className="px-4 py-3 text-sm">{b.email}</td>
                  <td className="px-4 py-3 text-sm">{new Date(b.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm"><span className={badgeClass(b.status)}>{b.status}</span></td>
                  <td className="px-4 py-3 text-sm" onClick={e => e.stopPropagation()}>
                    <select aria-label={`Change status for ${b.order_ref}`} className="border px-2 py-1 rounded" defaultValue={b.status} onChange={e => {
                      const v = e.target.value as OrderStatus
                      setChanging(b.order_ref)
                      updateStatus(b.order_ref, v).then(() => setChanging(null)).catch(() => setChanging(null))
                    }}>
                      <option value="received">received</option>
                      <option value="processing">processing</option>
                      <option value="ready">ready</option>
                      <option value="collected">collected</option>
                    </select>
                    {changing === b.order_ref && <span className="ml-2 text-sm text-gray-500">Updating…</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-gray-100 rounded" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</button>
          <button className="px-3 py-1 bg-gray-100 rounded" disabled={page >= Math.ceil(total / limit)} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
        <div className="text-sm text-gray-500">{total} bookings</div>
      </div>

      <section className="mt-10 rounded border border-gray-200 p-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Create booking</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Name</span>
            <input className="mt-1 w-full border rounded px-3 py-2" value={bookingForm.name} onChange={e => setBookingForm(f => ({ ...f, name: e.target.value }))} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Phone</span>
            <input className="mt-1 w-full border rounded px-3 py-2" value={bookingForm.phone} onChange={e => setBookingForm(f => ({ ...f, phone: e.target.value }))} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input className="mt-1 w-full border rounded px-3 py-2" type="email" value={bookingForm.email} onChange={e => setBookingForm(f => ({ ...f, email: e.target.value }))} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Address</span>
            <input className="mt-1 w-full border rounded px-3 py-2" value={bookingForm.address} onChange={e => setBookingForm(f => ({ ...f, address: e.target.value }))} />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-gray-700">Service</span>
            <select className="mt-1 w-full border rounded px-3 py-2" value={bookingForm.service} onChange={e => setBookingForm(f => ({ ...f, service: e.target.value }))}>
              {services.length ? services.map(s => (
                <option key={s._id || s.title || s.number} value={s.title || s.number || ''}>
                  {s.title || s.number}
                </option>
              )) : (
                <option value="">No services available</option>
              )}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Preferred date</span>
            <input className="mt-1 w-full border rounded px-3 py-2" type="date" value={bookingForm.preferred_date} onChange={e => setBookingForm(f => ({ ...f, preferred_date: e.target.value }))} />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-gray-700">Description</span>
            <textarea className="mt-1 w-full border rounded px-3 py-2" rows={3} value={bookingForm.description} onChange={e => setBookingForm(f => ({ ...f, description: e.target.value }))} />
          </label>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50" onClick={createBooking} disabled={creating || !bookingForm.name || !bookingForm.email || !bookingForm.service}>Create booking</button>
          {creating && <span className="text-sm text-gray-600">Creating booking…</span>}
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="booking-title" onClick={() => setSelected(null)}>
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 id="booking-title" className="text-lg font-semibold">{selected.order_ref} — {selected.name}</h3>
            <p className="text-sm"><strong>Email:</strong> {selected.email}</p>
            <p className="text-sm"><strong>Phone:</strong> {selected.phone}</p>
            <p className="text-sm"><strong>Address:</strong> {selected.address}</p>
            <p className="text-sm"><strong>Service:</strong> {selected.service}</p>
            <p className="text-sm"><strong>Preferred:</strong> {selected.preferred_date}</p>
            <p className="text-sm"><strong>Description:</strong> {selected.description}</p>
            <p className="text-sm"><strong>Status:</strong> <span className={badgeClass(selected.status)}>{selected.status}</span></p>
            <div className="mt-4 flex justify-end">
              <button ref={modalCloseRef} className="px-3 py-1 rounded bg-gray-100 focus:outline focus:outline-2 focus:outline-blue-200" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
