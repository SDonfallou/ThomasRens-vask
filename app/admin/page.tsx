'use client'

import Link from 'next/link'

export default function AdminPage() {
  return (
    <div className="min-h-[calc(100vh-62px)] bg-[var(--cream)]">
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
        <section className="overflow-hidden rounded-[32px] border border-[#D6E4FF] bg-[linear-gradient(135deg,rgba(8,30,66,0.98),rgba(17,52,110,0.96))] text-white shadow-[0_30px_90px_rgba(8,30,66,0.18)]">
          <div className="grid gap-8 p-8 lg:grid-cols-[1.25fr_0.75fr] lg:p-10">
            <div>
              <p className="font-sans text-[10px] tracking-[0.28em] uppercase text-[var(--warm-light)]">Admin control room</p>
              <h1 className="mt-4 max-w-2xl text-4xl font-normal leading-tight md:text-5xl">
                A calmer dashboard for bookings, services, and lead discovery.
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/68">
                Manage the business from one place, then use the lead finder to research public laundry and dry-cleaning contacts by city or keyword.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/admin/bookings" className="rounded-full bg-[var(--warm-light)] px-5 py-3 text-sm font-semibold text-[var(--dark)] transition hover:translate-y-[-1px]">
                  Open bookings
                </Link>
                <Link href="/admin/ai-leads" className="rounded-full border border-white/15 bg-white/6 px-5 py-3 text-sm font-semibold text-white transition hover:border-[var(--warm-light)] hover:bg-white/10">
                  AI lead finder
                </Link>
              </div>
            </div>

            <div className="grid gap-3 self-end sm:grid-cols-2 lg:grid-cols-1">
              {[
                ['Bookings', 'Track orders, status, and customer details.'],
                ['Services', 'Edit service entries and price helpers.'],
                ['Lead finder', 'Search public contact details for laundry targets.'],
              ].map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur">
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-white/62">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { value: '3', label: 'Core workspaces', body: 'Bookings, services, and lead discovery.' },
            { value: '1 click', label: 'Fast access', body: 'Jump into the tool you need without friction.' },
            { value: 'Public data', label: 'Lead sourcing', body: 'Search public business info only.' },
          ].map(({ value, label, body }) => (
            <div key={label} className="rounded-3xl border border-[#D6E4FF] bg-[var(--cream-soft)] p-6 shadow-sm">
              <div className="text-3xl font-semibold text-[var(--dark)]">{value}</div>
              <p className="mt-2 text-sm font-semibold text-[var(--warm)]">{label}</p>
              <p className="mt-2 text-sm leading-6 text-[#4B628A]">{body}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          <Link href="/admin/bookings" className="rounded-3xl border border-[#D6E4FF] bg-[var(--cream-soft)] p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--warm-light)] lg:col-span-1">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--warm)]">Operations</p>
            <h2 className="mt-3 text-2xl font-semibold">Bookings</h2>
            <p className="mt-3 text-sm leading-6 text-[#4B628A]">Create, review, and update customer bookings in one place.</p>
          </Link>

          <Link href="/admin/services" className="rounded-3xl border border-[#D6E4FF] bg-[var(--cream-soft)] p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--warm-light)] lg:col-span-1">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--warm)]">Catalog</p>
            <h2 className="mt-3 text-2xl font-semibold">Services</h2>
            <p className="mt-3 text-sm leading-6 text-[#4B628A]">Manage the service list that powers the site and admin tools.</p>
          </Link>

          <Link href="/admin/loyalty" className="rounded-3xl border border-[#D6E4FF] bg-[var(--cream-soft)] p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--warm-light)] lg:col-span-1">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--warm)]">Retention</p>
            <h2 className="mt-3 text-2xl font-semibold">Loyalty</h2>
            <p className="mt-3 text-sm leading-6 text-[#4B628A]">Manage customers, points, and reward redemption.</p>
          </Link>

          <Link href="/admin/ai-leads" className="rounded-3xl border border-[#D6E4FF] bg-[linear-gradient(135deg,rgba(37,99,235,0.16),rgba(59,130,246,0.12))] p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--warm-light)] lg:col-span-1">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent)]">Research</p>
            <h2 className="mt-3 text-2xl font-semibold">AI lead finder</h2>
            <p className="mt-3 text-sm leading-6 text-[#4B628A]">Search public laundry and dry-cleaning contacts by city, area, or keyword.</p>
          </Link>
        </section>
      </div>
    </div>
  )
}

