import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
const SUPABASE_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)

// Server-side only (for API routes)
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE)

export type OrderStatus = 'received' | 'processing' | 'ready' | 'collected'

export interface Booking {
  id: string
  order_ref: string
  name: string
  phone: string
  email: string
  address: string
  service: string
  preferred_date: string
  description: string
  status: OrderStatus
  created_at: string
}

export interface StatusEvent {
  status: OrderStatus
  label: string
  time: string | null
  done: boolean
  active: boolean
}

export function buildTimeline(booking: Booking): StatusEvent[] {
  const steps: { status: OrderStatus; label: string }[] = [
    { status: 'received',   label: 'Mottatt av renseri' },
    { status: 'processing', label: 'Under behandling' },
    { status: 'ready',      label: 'Klar for henting' },
    { status: 'collected',  label: 'Hentet av kunde' },
  ]

  const statusOrder = steps.map(s => s.status)
  const currentIndex = statusOrder.indexOf(booking.status)

  return steps.map((step, i) => ({
    ...step,
    time: i <= currentIndex ? (i === 0 ? new Date(booking.created_at).toLocaleDateString('no-NO') : '—') : null,
    done: i < currentIndex,
    active: i === currentIndex,
  }))
}
