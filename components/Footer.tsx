import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[var(--dark)] px-10 pt-14 pb-7">
      <div className="max-w-[900px] mx-auto grid grid-cols-4 gap-8 pb-9 border-b border-white/[0.08] mb-7">
        <div>
          <div className="font-serif text-[16px] text-white tracking-widest">
            Thomas <span className="text-[var(--warm-light)]">Rens</span> & Vask
          </div>
          <p className="font-sans text-[12px] text-white/40 mt-3 leading-relaxed">
            Hesselbergs gate 7<br />0556 Oslo
          </p>
          <p className="font-sans text-[12px] text-white/40">22 71 78 70</p>
        </div>

        <div>
          <h4 className="font-sans text-[10px] tracking-[0.2em] uppercase text-[var(--warm-light)] mb-3">Sider</h4>
          {[['/', 'Hjem'], ['/prisliste', 'Prisliste'], ['/bestilling', 'Bestill henting'], ['/bestilling', 'Spor ordre']].map(([href, label]) => (
            <Link key={label} href={href} className="block font-sans text-[12px] text-white/40 hover:text-white/75 transition-colors leading-[2.1]">
              {label}
            </Link>
          ))}
        </div>

        <div>
          <h4 className="font-sans text-[10px] tracking-[0.2em] uppercase text-[var(--warm-light)] mb-3">Åpningstider</h4>
          <p className="font-sans text-[12px] text-white/40 leading-[2.1]">Man–Fre: 09:00 – 18:00</p>
          <p className="font-sans text-[12px] text-white/40 leading-[2.1]">Lørdag: 10:00 – 17:00</p>
          <p className="font-sans text-[12px] text-white/40 leading-[2.1]">Søndag: Stengt</p>
        </div>

        <div>
          <h4 className="font-sans text-[10px] tracking-[0.2em] uppercase text-[var(--warm-light)] mb-3">Finn oss</h4>
          {['Google Maps', 'Facebook', 'Instagram'].map((label) => (
            <a key={label} href="#" className="block font-sans text-[12px] text-white/40 hover:text-white/75 transition-colors leading-[2.1]">
              {label}
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-[900px] mx-auto flex justify-between font-sans text-[11px] text-white/20 flex-wrap gap-2">
        <p>© 2025 Thomas Rens og Vask</p>
        <p>Personvern · Vilkår</p>
      </div>
    </footer>
  )
}
