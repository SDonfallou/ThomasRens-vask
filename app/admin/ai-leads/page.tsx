'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

type Lead = {
  name: string
  url: string
  snippet: string
  email: string
  phone: string
}

type ScanResponse = {
  query: string
  searchPlan: string[]
  leads: Lead[]
  note: string
}

export default function AiLeadFinderPage() {
  const [business, setBusiness] = useState('laundry or dry cleaning')
  const [location, setLocation] = useState('Oslo')
  const [limit, setLimit] = useState(12)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<ScanResponse | null>(null)

  const summary = useMemo(() => {
    return `${business.trim() || 'laundry'} in ${location.trim() || 'your area'}`
  }, [business, location])

  async function scan() {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin/lead-finder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({ business, location, limit }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Scan failed')
      setResult(data)
    } catch (err: any) {
      setError(err?.message || 'Unable to scan public results.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-62px)] bg-[var(--cream)] px-6 py-10 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="grid gap-6 rounded-[32px] border border-[#D6E4FF] bg-[linear-gradient(135deg,rgba(8,30,66,0.98),rgba(17,52,110,0.95))] p-8 text-white shadow-[0_30px_90px_rgba(8,30,66,0.16)] lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
          <div>
            <p className="font-sans text-[10px] tracking-[0.28em] uppercase text-[var(--warm-light)]">AI lead finder</p>
            <h1 className="mt-4 text-4xl font-normal leading-tight md:text-5xl">Public web search for laundry and dry-cleaning leads.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68">
              Use this tool to search public business pages for names, contact details, and websites. It is meant for public business information, not private personal data.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/70">
              <span className="rounded-full border border-white/10 bg-white/8 px-4 py-2">Search web results</span>
              <span className="rounded-full border border-white/10 bg-white/8 px-4 py-2">Find phone and email</span>
              <span className="rounded-full border border-white/10 bg-white/8 px-4 py-2">Build lead lists</span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--warm-light)]">Search brief</p>
            <div className="mt-3 space-y-3 text-sm leading-6 text-white/76">
              <div><span className="text-white">Target:</span> {summary}</div>
              <div><span className="text-white">Result cap:</span> {limit}</div>
              <div><span className="text-white">Focus:</span> address, phone, email, website</div>
            </div>
            <Link href="/admin" className="mt-5 inline-flex rounded-full border border-white/12 px-4 py-2 text-sm font-semibold text-white transition hover:border-[var(--warm-light)]">
              Back to admin home
            </Link>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
          <div className="rounded-3xl border border-[#D6E4FF] bg-[var(--cream-soft)] p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-[var(--dark)]">Scan settings</h2>
            <p className="mt-2 text-sm leading-6 text-[#4B628A]">Enter a business type and city, then the backend will search public web results and collect contact data when available.</p>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-[#2E4670]">Business type</span>
                <input className="w-full rounded-lg border border-[#D6E4FF] bg-[var(--cream)] px-3 py-2 outline-none focus:border-[var(--warm)]" value={business} onChange={e => setBusiness(e.target.value)} placeholder="laundry or dry cleaning" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-[#2E4670]">City or area</span>
                <input className="w-full rounded-lg border border-[#D6E4FF] bg-[var(--cream)] px-3 py-2 outline-none focus:border-[var(--warm)]" value={location} onChange={e => setLocation(e.target.value)} placeholder="Oslo" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-[#2E4670]">Max results</span>
                <input className="w-full rounded-lg border border-[#D6E4FF] bg-[var(--cream)] px-3 py-2 outline-none focus:border-[var(--warm)]" type="number" min={1} max={20} value={limit} onChange={e => setLimit(Number(e.target.value))} />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-[#2E4670]">Admin password</span>
                <input className="w-full rounded-lg border border-[#D6E4FF] bg-[var(--cream)] px-3 py-2 outline-none focus:border-[var(--warm)]" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Required for scanning" />
              </label>
            </div>

            <button onClick={scan} disabled={loading} className="mt-6 w-full rounded-2xl bg-[var(--dark)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--warm)] disabled:opacity-50">
              {loading ? 'Scanning public resultsâ€¦' : 'Scan public web'}
            </button>

            {error && <p className="mt-4 text-sm text-[#8B3E3E]">{error}</p>}

            <div className="mt-6 rounded-2xl border border-[#D6E4FF] bg-[rgba(59,130,246,0.10)] p-4 text-sm leading-6 text-[#4B628A]">
              This page searches public business information only. It now runs a few related public queries so you get more lead results on each scan.
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['Search engine', 'Public results'],
                ['Fields', 'Address, contact, website'],
                ['Output', 'Lead worksheet'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-3xl border border-[#D6E4FF] bg-[var(--cream-soft)] p-5 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--warm)]">{label}</p>
                  <p className="mt-3 text-lg font-semibold text-[var(--dark)]">{value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-[#D6E4FF] bg-[var(--cream-soft)] p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--warm)]">Search plan</p>
                  <h2 className="mt-2 text-2xl font-semibold text-[var(--dark)]">Suggested public queries</h2>
                </div>
                <p className="text-sm text-[#4B628A]">Generated from your inputs.</p>
              </div>

              {result?.searchPlan?.length ? (
                <div className="mt-5 grid gap-3">
                  {result.searchPlan.map((item) => (
                    <div key={item} className="rounded-2xl border border-[#D6E4FF] bg-[var(--cream)] px-4 py-3 text-sm text-[#2E4670]">{item}</div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-[#C9DCFF] bg-[var(--cream)] p-5 text-sm text-[#4B628A]">
                  Run a scan to generate search phrases and load public leads here.
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-[#D6E4FF] bg-[var(--cream-soft)] p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--warm)]">Leads</p>
                  <h2 className="mt-2 text-2xl font-semibold text-[var(--dark)]">Public contact results</h2>
                </div>
                <p className="text-sm text-[#4B628A]">{result?.leads?.length || 0} found</p>
              </div>

              {result?.leads?.length ? (
                <div className="mt-5 overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#D6E4FF]">
                    <thead className="bg-[var(--cream)]">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.2em] text-[#4B628A]">Business</th>
                        <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.2em] text-[#4B628A]">Contact</th>
                        <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.2em] text-[#4B628A]">Website</th>
                        <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.2em] text-[#4B628A]">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D6E4FF]">
                      {result.leads.map((lead) => (
                        <tr key={`${lead.name}-${lead.url}`} className="align-top hover:bg-[var(--cream)]">
                          <td className="px-3 py-3">
                            <div className="font-medium text-[var(--dark)]">{lead.name}</div>
                            <div className="mt-1 break-all text-xs text-[#4B628A]">{lead.url}</div>
                          </td>
                          <td className="px-3 py-3 text-sm text-[#2E4670]">
                            <div>{lead.phone || '-'}</div>
                            <div className="mt-1 break-all text-[#4B628A]">{lead.email || '-'}</div>
                          </td>
                          <td className="px-3 py-3 text-sm text-[#2E4670]">{lead.url}</td>
                          <td className="px-3 py-3 text-sm text-[#4B628A]">{lead.snippet || 'No snippet captured.'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-[#C9DCFF] bg-[var(--cream)] p-5 text-sm text-[#4B628A]">
                  No scan results yet.
                </div>
              )}

              {result?.note && <p className="mt-4 text-sm text-[#4B628A]">{result.note}</p>}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
