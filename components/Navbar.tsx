'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const path = usePathname()

  return (
    <nav className="sticky top-0 z-50 bg-[#1A1A18] flex items-center justify-between px-9 h-[62px]">
      <Link href="/" className="font-serif text-[17px] text-white tracking-widest font-normal">
        Thomas <span className="text-[#C4A882]">Rens</span> & Vask
      </Link>

      <div className="flex gap-7">
        {[
          { href: '/', label: 'Hjem' },
          { href: '/prisliste', label: 'Prisliste' },
          { href: '/bestilling', label: 'Bestilling' },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`font-sans text-[11px] tracking-widest uppercase transition-colors ${
              path === href ? 'text-white' : 'text-white/50 hover:text-white'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <Link
        href="/bestilling"
        className="bg-[#C4A882] text-[#1A1A18] px-5 py-2 font-sans text-[11px] tracking-widest uppercase font-bold"
      >
        Bestill henting
      </Link>
    </nav>
  )
}
