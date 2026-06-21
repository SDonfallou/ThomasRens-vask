import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Thomas Rens & Vask — Grünerløkka, Oslo',
  description: 'Kjemisk rens, skreddertjenester og skjorteservice siden 1995. Hesselbergs gate 7, Oslo.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body className="bg-white text-[#2C2C28] overflow-x-hidden">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
