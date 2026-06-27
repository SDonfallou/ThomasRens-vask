'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

type Customer = {
  id: string
  name: string
  phone: string | null
  email: string | null
  points_balance: number
  lifetime_points: number
  created_at: string
}

export default function AdminLoyaltyPage() {
  const [password, setPassword] = useState('')
  const [query, setQuery] = useState('')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newEmail, setNewEmail] = useState('')

  const [selectedId, setSelectedId] = useState('')
  const [points, setPoints] = useState(100)
  const [kind, setKind] = useState<'earn' | 'redeem' | 'adjust'>('earn')
  const [note, setNote] = useState('')
  const [orderRef, setOrderRef] = useState('')

  const selected = useMemo(() => customers.find(c => c.id === selectedId) || null, [customers, selectedId])

  async function loadCustomers() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/loyalty?q=${encodeURIComponent(query)}`, {
        headers: { 'x-admin-password': password },
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to load customers')
      setCustomers(json.customers || [])
      if (!selectedId && json.customers?.length) setSelectedId(json.customers[0].id)
    } catch (err: any) {
      setError(err?.message || 'Failed to load customers')
    } finally {
      setLoading(false)
    }
  }

  async function saveCustomer() {
    setError('')
    try {
      const res = await fetch('/api/admin/loyalty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({
          action: 'upsertCustomer',
          name: newName,
          phone: newPhone,
          email: newEmail,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to save customer')
      setNewName('')
      setNewPhone('')
      setNewEmail('')
      await loadCustomers()
      if (json.customer?.id) setSelectedId(json.customer.id)
    } catch (err: any) {
      setError(err?.message || 'Failed to save customer')
    }
  }

  async function applyPoints() {
    if (!selectedId) return
    setError('')
    try {
      const res = await fetch('/api/admin/loyalty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({
          action: 'points',
          customerId: selectedId,
          kind,
          points,
          note,
          orderRef,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to update points')
      setNote('')
      setOrderRef('')
      await loadCustomers()
    } catch (err: any) {
      setError(err?.message || 'Failed to update points')
    }
  }

  return (
    <div className="min-h-[calc(100vh-62px)] bg-[var(--cream)] p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-[#D6E4FF] bg-[linear-gradient(135deg,rgba(8,30,66,0.98),rgba(17,52,110,0.95))] p-7 text-white">
          <p className="font-sans text-[10px] tracking-[0.28em] uppercase text-[var(--warm-light)]">Admin loyalty</p>
          <h1 className="mt-3 text-3xl font-normal">Digital loyalty program</h1>
          <p className="mt-2 text-sm text-white/70">Create customers, add points, and redeem rewards from one admin page.</p>
          <Link href="/admin" className="mt-4 inline-block rounded-full border border-white/15 px-4 py-2 text-sm text-white hover:border-[var(--warm-light)]">Back to admin</Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          <section className="rounded-3xl border border-[#D6E4FF] bg-[var(--cream-soft)] p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-semibold text-[var(--dark)]">Connection</h2>
            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[#D6E4FF] bg-[var(--cream)] px-3 py-2 outline-none focus:border-[var(--warm)]"
            />

            <div className="flex gap-2">
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by name, phone, email"
                className="flex-1 rounded-lg border border-[#D6E4FF] bg-[var(--cream)] px-3 py-2 outline-none focus:border-[var(--warm)]"
              />
              <button onClick={loadCustomers} disabled={loading} className="rounded-lg bg-[var(--dark)] px-4 py-2 text-white hover:bg-[var(--warm)] disabled:opacity-50">
                {loading ? 'Loadingâ€¦' : 'Load'}
              </button>
            </div>

            <div className="rounded-2xl border border-[#D6E4FF] bg-[var(--cream)] p-4">
              <h3 className="font-semibold text-[var(--dark)] mb-3">Add customer</h3>
              <div className="space-y-2">
                <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Name" className="w-full rounded-lg border border-[#D6E4FF] bg-[var(--cream-soft)] px-3 py-2 outline-none focus:border-[var(--warm)]" />
                <input value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="Phone" className="w-full rounded-lg border border-[#D6E4FF] bg-[var(--cream-soft)] px-3 py-2 outline-none focus:border-[var(--warm)]" />
                <input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Email" className="w-full rounded-lg border border-[#D6E4FF] bg-[var(--cream-soft)] px-3 py-2 outline-none focus:border-[var(--warm)]" />
              </div>
              <button onClick={saveCustomer} className="mt-3 w-full rounded-lg bg-[var(--dark)] px-4 py-2 text-white hover:bg-[var(--warm)]">
                Save customer
              </button>
            </div>

            {error && <p className="text-sm text-[#8B3E3E]">{error}</p>}
          </section>

          <section className="space-y-4">
            <div className="rounded-3xl border border-[#D6E4FF] bg-[var(--cream-soft)] p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[var(--dark)]">Points operation</h2>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <select value={selectedId} onChange={e => setSelectedId(e.target.value)} className="rounded-lg border border-[#D6E4FF] bg-[var(--cream)] px-3 py-2 outline-none focus:border-[var(--warm)]">
                  <option value="">Select customer</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.points_balance} pts)</option>
                  ))}
                </select>

                <select value={kind} onChange={e => setKind(e.target.value as any)} className="rounded-lg border border-[#D6E4FF] bg-[var(--cream)] px-3 py-2 outline-none focus:border-[var(--warm)]">
                  <option value="earn">Earn points</option>
                  <option value="redeem">Redeem points</option>
                  <option value="adjust">Adjust points</option>
                </select>

                <input type="number" min={1} value={points} onChange={e => setPoints(Number(e.target.value || 0))} className="rounded-lg border border-[#D6E4FF] bg-[var(--cream)] px-3 py-2 outline-none focus:border-[var(--warm)]" placeholder="Points" />
                <input value={orderRef} onChange={e => setOrderRef(e.target.value)} placeholder="Order ref (optional)" className="rounded-lg border border-[#D6E4FF] bg-[var(--cream)] px-3 py-2 outline-none focus:border-[var(--warm)]" />
              </div>
              <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Note (optional)" rows={2} className="mt-3 w-full rounded-lg border border-[#D6E4FF] bg-[var(--cream)] px-3 py-2 outline-none focus:border-[var(--warm)]" />
              <button onClick={applyPoints} disabled={!selectedId} className="mt-3 rounded-lg bg-[var(--dark)] px-4 py-2 text-white hover:bg-[var(--warm)] disabled:opacity-50">
                Apply
              </button>
            </div>

            <div className="rounded-3xl border border-[#D6E4FF] bg-[var(--cream-soft)] p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[var(--dark)]">Customers</h2>
              {!customers.length ? (
                <p className="mt-3 text-sm text-[#4B628A]">No loyalty customers loaded.</p>
              ) : (
                <div className="mt-3 overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#D6E4FF]">
                    <thead className="bg-[var(--cream)]">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.2em] text-[#4B628A]">Customer</th>
                        <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.2em] text-[#4B628A]">Contact</th>
                        <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.2em] text-[#4B628A]">Balance</th>
                        <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.2em] text-[#4B628A]">Lifetime</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D6E4FF]">
                      {customers.map(c => (
                        <tr key={c.id} className={selectedId === c.id ? 'bg-[rgba(59,130,246,0.18)]' : ''}>
                          <td className="px-3 py-2 text-sm text-[var(--dark)]">{c.name}</td>
                          <td className="px-3 py-2 text-sm text-[#2E4670]">{c.phone || c.email || '-'}</td>
                          <td className="px-3 py-2 text-sm font-semibold text-[var(--accent)]">{c.points_balance}</td>
                          <td className="px-3 py-2 text-sm text-[#2E4670]">{c.lifetime_points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {selected && (
              <div className="rounded-3xl border border-[#D6E4FF] bg-[rgba(59,130,246,0.10)] p-4 text-sm text-[#2E4670]">
                Selected: <strong>{selected.name}</strong> - Balance: <strong>{selected.points_balance}</strong> - Lifetime: <strong>{selected.lifetime_points}</strong>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

