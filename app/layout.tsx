import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ToastProvider } from '@/components/Toast'

export const metadata: Metadata = {
  title: 'Thomas Rens & Vask — Grünerløkka, Oslo',
  description: 'Kjemisk rens, skreddertjenester og skjorteservice siden 1995. Hesselbergs gate 7, Oslo.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body className="text-[var(--text)] overflow-x-hidden bg-[var(--cream)]">
        <Navbar />
        <ToastProvider>
          <main>{children}</main>
        </ToastProvider>
        <Footer />
      </body>
    </html>
  )
}
