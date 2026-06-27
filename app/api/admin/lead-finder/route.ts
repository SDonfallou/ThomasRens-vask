import { NextRequest, NextResponse } from 'next/server'

type Lead = {
  name: string
  url: string
  snippet: string
  email: string
  phone: string
}

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

function stripHtml(input: string) {
  return input.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function decodeEntities(input: string) {
  return input
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function pickSearchPlan(business: string, location: string) {
  const target = `${business} ${location}`.trim()
  return [
    `${target} contact`,
    `${target} phone email address`,
    `${target} laundry dry cleaning`,
    `${target} reviews`,
    `${target} opening hours`,
  ]
}

async function fetchWithTimeout(url: string, timeoutMs = 8000) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    })
  } finally {
    clearTimeout(timeout)
  }
}

async function fetchPageContactHints(url: string) {
  const phoneRegex = /(?:\+?\d[\d\s().-]{6,}\d)/g
  const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
  try {
    const response = await fetchWithTimeout(url, 7000)
    if (!response.ok) return { phone: '', email: '' }
    const html = await response.text()
    const phone = (html.match(phoneRegex) || []).map(item => item.replace(/\s+/g, ' ').trim()).find(Boolean) || ''
    const email = (html.match(emailRegex) || [])[0] || ''
    return { phone, email }
  } catch {
    return { phone: '', email: '' }
  }
}

async function fetchSearchResults(query: string, limit: number) {
  const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`
  const response = await fetchWithTimeout(searchUrl, 8000)
  if (!response.ok) {
    throw new Error('Search engine request failed')
  }

  const html = await response.text()
  const linkPattern = /<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/a>/gi
  const leads: Lead[] = []
  const seen = new Set<string>()
  let match: RegExpExecArray | null

  while ((match = linkPattern.exec(html)) && leads.length < limit) {
    const rawUrl = decodeEntities(match[1])
    const title = decodeEntities(stripHtml(match[2]))
    const snippet = decodeEntities(stripHtml(match[3]))
    const url = rawUrl.startsWith('//') ? `https:${rawUrl}` : rawUrl
    if (!/^https?:\/\//i.test(url) || seen.has(url)) continue
    seen.add(url)

    const hints = await fetchPageContactHints(url)
    leads.push({
      name: title || url,
      url,
      snippet,
      email: hints.email,
      phone: hints.phone,
    })
  }

  return leads
}

async function fetchSearchResultsFromPlan(searchPlan: string[], limit: number) {
  const leads: Lead[] = []
  const seen = new Set<string>()

  for (const query of searchPlan) {
    if (leads.length >= limit) break

    const remaining = limit - leads.length
    const batch = await fetchSearchResults(query, remaining)

    for (const lead of batch) {
      const key = lead.url || lead.name
      if (!key || seen.has(key)) continue
      seen.add(key)
      leads.push(lead)
      if (leads.length >= limit) break
    }
  }

  return leads
}

export async function POST(req: NextRequest) {
  try {
    const pw = req.headers.get('x-admin-password') || ''
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''
    if (!ADMIN_PASSWORD || pw !== ADMIN_PASSWORD) return unauthorized()

    const body = await req.json().catch(() => ({}))
    const business = String(body.business || '').trim()
    const location = String(body.location || '').trim()
    const limit = Math.max(1, Math.min(20, Number(body.limit || 12)))

    if (!business || !location) {
      return NextResponse.json({ error: 'Business type and location are required.' }, { status: 400 })
    }

    const query = `${business} ${location} phone address email`
    const searchPlan = pickSearchPlan(business, location)
    const leads = await fetchSearchResultsFromPlan([query, ...searchPlan], limit)

    return NextResponse.json({
      query,
      searchPlan,
      leads,
      note: leads.length
        ? 'Results come from public web pages and search snippets. Verify contact details before outreach.'
        : 'No results were parsed from the current search source. Try a broader query or connect a search API later.',
    })
  } catch (err: any) {
    console.error('POST /api/admin/lead-finder failed', err)
    return NextResponse.json({ error: err?.message || 'Lead finder failed.' }, { status: 500 })
  }
}