# ThomasRens-vask

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font) fonts.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
## Environment variables

This app uses secret environment variables for Supabase, Sanity, and Resend. Local env files like `.env.local` are ignored by Git, so you can keep keys private.

Add the following variables to your local `.env.local` and to Vercel project settings:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
NEXT_PUBLIC_SANITY_PROJECT_ID=<your-sanity-project-id>
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=<your-sanity-server-token>
RESEND_API_KEY=<your-resend-api-key>
SHOP_EMAIL=thomas@example.com
```

On Vercel, make sure `SUPABASE_SERVICE_ROLE_KEY`, `SANITY_API_TOKEN`, and `RESEND_API_KEY` are set as protected secrets and not exposed to the browser.
