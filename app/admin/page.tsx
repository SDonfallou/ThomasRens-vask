'use client'

import Link from 'next/link'

export default function AdminPage() {
  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-semibold">Admin dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">Use the links below to manage services and bookings.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/admin/bookings" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300">
            <h2 className="text-xl font-semibold">Bookings</h2>
            <p className="mt-2 text-sm text-slate-600">Create new bookings, view existing orders, and update status.</p>
          </Link>
          <Link href="/admin/services" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300">
            <h2 className="text-xl font-semibold">Services</h2>
            <p className="mt-2 text-sm text-slate-600">Manage walk-in service entries stored in Sanity.</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
