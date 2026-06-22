"use client"

import React, { useEffect, useState } from 'react'
import { useToast } from '@/components/Toast'

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ number: '', title: '', description: '', priceFrom: '', linkTo: '', order: 0 })
  const toast = useToast()
  const [password, setPassword] = useState('')
  const [editing, setEditing] = useState<any | null>(null)
  const [editForm, setEditForm] = useState({ number: '', title: '', description: '', priceFrom: '', linkTo: '', order: 0 })

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/services')
      const json = await res.json()
      setServices(json.services || [])
    } catch (err) {
      console.error(err)
      toast.show('Failed to load services', 'error')
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function create() {
    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password || (window as any).__ADMIN_PASSWORD || '' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed')
      toast.show('Service created', 'success')
      setForm({ number: '', title: '', description: '', priceFrom: '', linkTo: '', order: 0 })
      load()
    } catch (err: any) {
      console.error(err)
      toast.show(err.message || 'Failed to create', 'error')
    }
  }

  function startEdit(s: any) {
    setEditing(s)
    setEditForm({ number: s.number || '', title: s.title || '', description: s.description || '', priceFrom: s.priceFrom || '', linkTo: s.linkTo || '', order: s.order || 0 })
  }

  async function saveEdit() {
    if (!editing) return
    try {
      const res = await fetch(`/api/admin/services/${encodeURIComponent(editing._id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password || (window as any).__ADMIN_PASSWORD || '' },
        body: JSON.stringify(editForm),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed')
      toast.show('Service updated', 'success')
      setEditing(null)
      load()
    } catch (err: any) {
      console.error(err)
      toast.show(err.message || 'Failed to update', 'error')
    }
  }

  async function deleteService(id: string) {
    if (!confirm('Delete this service?')) return
    try {
      const res = await fetch(`/api/admin/services/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': password || (window as any).__ADMIN_PASSWORD || '' },
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed')
      toast.show('Service deleted', 'success')
      load()
    } catch (err: any) {
      console.error(err)
      toast.show(err.message || 'Failed to delete', 'error')
    }
  }

  return (
    <div className="p-6 space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Manage Services</h2>
          <p className="text-sm text-slate-600 mt-1">
            Create, edit and remove walk-in service entries stored in Sanity.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-[minmax(200px,1fr)_auto]">
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          />
          <button
            className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            onClick={load}
          >
            Refresh
          </button>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">New service</p>
            <h3 className="mt-3 text-xl font-semibold">Add service</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Number</label>
              <input
                placeholder="01"
                value={form.number}
                onChange={e => setForm(f => ({ ...f, number: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
              <input
                placeholder="Skjorteservice"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Price</label>
              <input
                placeholder="Fra 99 kr"
                value={form.priceFrom}
                onChange={e => setForm(f => ({ ...f, priceFrom: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Link</label>
              <input
                placeholder="/prisliste"
                value={form.linkTo}
                onChange={e => setForm(f => ({ ...f, linkTo: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
              <textarea
                placeholder="Kort beskrivelse av tjenesten"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={4}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </div>
          </div>
          <button
            className="mt-6 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700"
            onClick={create}
          >
            Create service
          </button>
        </section>

        <section className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Service list</p>
                <h3 className="mt-2 text-xl font-semibold">Available entries</h3>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                {services.length} items
              </span>
            </div>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-600">Loading services…</p>
            </div>
          ) : services.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
              <p className="text-lg font-medium">No services found</p>
              <p className="mt-2 text-sm text-slate-500">Add a service using the form on the left.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {services.map(s => (
                <article key={s._id || s.number} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {s.number && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-600">{s.number}</span>}
                        <h4 className="text-lg font-semibold">{s.title}</h4>
                      </div>
                      {s.priceFrom && <p className="text-sm text-slate-600">{s.priceFrom}</p>}
                      {s.linkTo && <p className="text-sm text-slate-500">Link: <span className="text-slate-700">{s.linkTo}</span></p>}
                    </div>
                    <div className="flex gap-2 text-sm">
                      <button
                        className="rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800"
                        onClick={() => startEdit(s)}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-rose-800"
                        onClick={() => deleteService(s._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{s.description || 'No description provided.'}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4 pb-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Edit service</p>
                <h3 className="mt-2 text-xl font-semibold">Update entry</h3>
              </div>
              <button className="text-slate-500 hover:text-slate-900" onClick={() => setEditing(null)}>
                Close
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Number</label>
                <input
                  value={editForm.number}
                  onChange={e => setEditForm(f => ({ ...f, number: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
                <input
                  value={editForm.title}
                  onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Price</label>
                <input
                  value={editForm.priceFrom}
                  onChange={e => setEditForm(f => ({ ...f, priceFrom: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Link</label>
                <input
                  value={editForm.linkTo}
                  onChange={e => setEditForm(f => ({ ...f, linkTo: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                  rows={4}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button className="rounded-2xl border border-slate-300 px-4 py-2 text-sm text-slate-700" onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700" onClick={saveEdit}>
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
