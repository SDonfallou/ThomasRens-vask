import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(sanityClient)
export const urlFor = (source: any) => builder.image(source)

// ── Queries ──────────────────────────────────────────────────────────────────

export async function getPriceList() {
  return sanityClient.fetch(`
    *[_type == "priceCategory"] | order(order asc) {
      title,
      "items": items[] {
        name,
        "lines": lines[] { service, price }
      }
    }
  `)
}

export async function getServices() {
  return sanityClient.fetch(`
    *[_type == "service"] | order(order asc) {
      number, title, description, priceFrom, linkTo
    }
  `)
}

export async function getReviews() {
  return sanityClient.fetch(`
    *[_type == "review"] | order(_createdAt desc) [0..5] {
      stars, text, author
    }
  `)
}

export async function getOpeningHours() {
  return sanityClient.fetch(`
    *[_type == "openingHours"][0] {
      "hours": days[] { day, opens, closes, closed }
    }
  `)
}
