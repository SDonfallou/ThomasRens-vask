'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const path = usePathname()

  return (
    <nav className="sticky top-0 z-50 h-[72px] border-b border-[#d7e6ff] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,248,255,0.95))] backdrop-blur">
      <div className="mx-auto flex h-full max-w-[1180px] items-center justify-between px-6">
      <Link href="/" className="font-serif text-[18px] text-[var(--dark)] tracking-[0.08em] font-normal">
        Thomas <span className="text-[var(--warm)]">Rens</span> & Vask
      </Link>

      <div className="flex gap-2 rounded-full border border-[#d6e4ff] bg-white p-1">
        {[
          { href: '/', label: 'Hjem' },
          { href: '/prisliste', label: 'Prisliste' },
          { href: '/bestilling', label: 'Bestilling' },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`rounded-full px-4 py-2 font-sans text-[11px] tracking-widest uppercase transition-colors ${
                path === href ? 'bg-[var(--dark)] text-white' : 'text-[var(--text-muted)] hover:text-[var(--dark)]'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <Link
        href="/bestilling"
        className="rounded-full bg-[var(--warm)] text-white px-5 py-2.5 font-sans text-[11px] tracking-widest uppercase font-bold hover:bg-[var(--accent)] transition-colors"
      >
        Bestill henting
      </Link>
      </div>
    </nav>
  )
}
