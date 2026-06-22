import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function PATCH(req: NextRequest, context: { params: { id: string } | Promise<{ id: string }> }) {
  try {
    const pw = req.headers.get('x-admin-password') || ''
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''
    if (!ADMIN_PASSWORD || pw !== ADMIN_PASSWORD) return unauthorized()

    const params = await context.params
    const id = params.id
    const body = await req.json()
    const { number, title, description, priceFrom, linkTo, order } = body

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

    const patchData: any = {}
    if (number !== undefined) patchData.number = number
    if (title !== undefined) patchData.title = title
    if (description !== undefined) patchData.description = description
    if (priceFrom !== undefined) patchData.priceFrom = priceFrom
    if (linkTo !== undefined) patchData.linkTo = linkTo
    if (order !== undefined) patchData.order = order

    // Basic validation
    if (title !== undefined && String(title).trim() === '') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const updated = await client.patch(id).set(patchData).commit()
    return NextResponse.json({ success: true, updated })
  } catch (err: any) {
    console.error('PATCH /api/admin/services/[id] failed', err)
    const message = err?.response?.body?.message || err?.message || 'Internal server error'
    const status = err?.statusCode && typeof err.statusCode === 'number' ? err.statusCode : 500
    return NextResponse.json({ error: message }, { status })
  }
}

export async function DELETE(req: NextRequest, context: { params: { id: string } | Promise<{ id: string }> }) {
  try {
    const pw = req.headers.get('x-admin-password') || ''
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''
    if (!ADMIN_PASSWORD || pw !== ADMIN_PASSWORD) return unauthorized()

    const params = await context.params
    const id = params.id
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

    await client.delete(id)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('DELETE /api/admin/services/[id] failed', err)
    const message = err?.response?.body?.message || err?.message || 'Internal server error'
    const status = err?.statusCode && typeof err.statusCode === 'number' ? err.statusCode : 500
    return NextResponse.json({ error: message }, { status })
  }
}
