import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function POST(req: NextRequest) {
  try {
    const pw = req.headers.get('x-admin-password') || ''
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''
    if (!ADMIN_PASSWORD || pw !== ADMIN_PASSWORD) return unauthorized()

    const body = await req.json()
    const { number, title, description, priceFrom, linkTo, order } = body

    // Basic server-side validation
    if (!title || String(title).trim() === '') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    if (order !== undefined && isNaN(Number(order))) {
      return NextResponse.json({ error: 'Order must be a number' }, { status: 400 })
    }

    const sanityToken = process.env.SANITY_API_TOKEN
    if (!sanityToken || sanityToken.trim() === '' || sanityToken === 'your-token') {
      return NextResponse.json({ error: 'SANITY_API_TOKEN is not configured. Set a valid token in environment variables.' }, { status: 500 })
    }

    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      apiVersion: '2025-01-01',
      token: sanityToken,
      useCdn: false,
    })

    const doc = {
      _type: 'service',
      number: number || '',
      title: title || '',
      description: description || '',
      priceFrom: priceFrom || '',
      linkTo: linkTo || '',
      order: order || 0,
    }

    const created = await client.create(doc)
    return NextResponse.json({ success: true, created })
  } catch (err: any) {
    console.error('POST /api/admin/services failed', err)
    const message = err?.response?.body?.message || err?.message || 'Internal server error'
    const status = err?.statusCode && typeof err.statusCode === 'number' ? err.statusCode : 500
    return NextResponse.json({ error: message }, { status })
  }
}
