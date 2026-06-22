import { NextResponse } from 'next/server'
import { getServices } from '@/lib/sanity'

export async function GET() {
  try {
    const services = await getServices()
    return NextResponse.json({ services })
  } catch (err) {
    console.error('GET /api/services failed', err)
    return NextResponse.json({ services: [] }, { status: 500 })
  }
}
