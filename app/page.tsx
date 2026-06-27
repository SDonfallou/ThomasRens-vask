import Link from 'next/link'
import Image from 'next/image'

const SERVICES = [
  { n: '01', title: 'Kjemisk rens', desc: 'Dresser, kåper, dunjakker, silke og alle typer delikate plagg', price: 'Fra 150 kr', href: '/prisliste' },
  { n: '02', title: 'Skjorteservice', desc: 'Vask, stryking og pakking av skjorter — skarpe og klare', price: 'Fra 99 kr', href: '/prisliste' },
  { n: '03', title: 'Skreddertjenester', desc: 'Innsying, legge opp bukse, glidelås og alle typer reparasjoner', price: 'Fra 290 kr', href: '/prisliste' },
  { n: '04', title: 'Bunad', desc: 'Forsiktig og respektfull rens av norske nasjonaldrakter', price: 'Fra 800 kr', href: '/prisliste' },
  { n: '05', title: 'Interiør & soverom', desc: 'Dyner, puter, sengetøy, tepper og gardiner', price: 'Fra 250 kr', href: '/prisliste' },
  { n: '06', title: 'Ekspresslevering', desc: 'Klar på 24 timer ved behov. Book i dag, klar i morgen.', price: '+50 kr tillegg', href: '/bestilling' },
]

const REVIEWS = [
  { stars: 5, text: 'Dressen var klar dagen etter — ren, pen og klar til bruk. Hyggelige og hjelpsomme folk.', author: 'Google-anmeldelse' },
  { stars: 5, text: 'Vinterjakken ser ut som ny, og de fikset glidelåsen i tillegg. Vil alltid komme tilbake!', author: 'Google-anmeldelse' },
  { stars: 5, text: 'Brukt dem på skreddertjenester i årevis. Veldig fornøyd. Alltid levert i tide.', author: 'Google-anmeldelse' },
]

const HOURS = [
  'Mandag','Tirsdag','Onsdag','Torsdag','Fredag','Lørdag','Søndag'
]
const TIMES = ['09:00 – 18:00','09:00 – 18:00','09:00 – 18:00','09:00 – 18:00','09:00 – 18:00','10:00 – 17:00','Stengt']
const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[560px] flex items-center overflow-hidden border-b border-[#d6e4ff]">
        <Image src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80" alt="Elegante plagg" fill className="object-cover object-center" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,0,0,0.72)] via-[rgba(0,0,0,0.46)] to-[rgba(0,0,0,0.22)]" />
        <div className="relative z-10 px-14 py-16 max-w-[580px]">
          <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/80 mb-4">Grünerløkka · Oslo · Hesselbergs gate 7</p>
          <h1 className="text-[40px] text-white font-normal leading-tight mb-3">Vi tar vare på<br />plaggene du er <em className="italic text-white/95">glad i</em></h1>
          <p className="font-sans text-[13px] text-white/75 mb-8 leading-loose">Kjemisk rens · Skreddertjenester · Skjorteservice<br />Rask og pålitelig — klar på 24 timer.</p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/bestilling" className="rounded-full bg-[#8cbcff] text-[var(--dark)] px-7 py-3 font-sans text-[11px] tracking-widest uppercase font-bold">Bestill henting</Link>
            <Link href="/prisliste" className="rounded-full border border-white/40 bg-white/10 text-white px-7 py-3 font-sans text-[11px] tracking-widest uppercase">Se prisliste</Link>
          </div>
        </div>
      </section>

      {/* INFO STRIP */}
      <div className="grid grid-cols-4 bg-[var(--dark2)] border-t border-white/[0.06]">
        {[['22 71 78 70','Ring oss'],['Man–Fre 09–18','Åpningstider'],['24 timer','Ekspresslevering'],['4,1 ★ · 35 omtaler','Google']].map(([val,lbl]) => (
          <div key={lbl} className="py-5 px-6 border-r border-white/[0.06] last:border-r-0 text-center">
            <div className="font-serif text-[15px] text-white mb-1">{val}</div>
            <div className="font-sans text-[10px] tracking-widest uppercase text-white/30">{lbl}</div>
          </div>
        ))}
      </div>

      {/* PHOTO GRID */}
      <div className="grid grid-cols-3 gap-[3px]" style={{gridTemplateRows:'260px 260px'}}>
        <div className="relative overflow-hidden row-span-2 group">
          <Image src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" alt="Garment care" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[rgba(0,0,0,0.62)] to-transparent font-sans text-[11px] tracking-widest uppercase text-white/90">Kjemisk rens</div>
        </div>
        {[['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80','Skjorteservice'],['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80','Skreddertjenester'],['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80','Delikate plagg'],['https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80','Bunad & selskapstøy']].map(([src,label]) => (
          <div key={label} className="relative overflow-hidden group">
            <Image src={src} alt={label} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[rgba(0,0,0,0.62)] to-transparent font-sans text-[11px] tracking-widest uppercase text-white/90">{label}</div>
          </div>
        ))}
      </div>

      {/* SERVICES */}
      <section className="py-[72px] px-10 max-w-[960px] mx-auto">
        <p className="font-sans text-[10px] tracking-[0.22em] uppercase text-[var(--warm)] mb-2 text-center">Hva vi tilbyr</p>
        <h2 className="text-[30px] font-normal text-center mb-2">Våre tjenester</h2>
        <p className="font-sans text-[13px] text-[#4B628A] text-center max-w-[500px] mx-auto mb-12 leading-loose">Siden 1995 har vi levert tjenester av høy kvalitet på Grünerløkka. Vi behandler hvert plagg som vårt eget.</p>
        <div className="grid grid-cols-3 gap-[3px] bg-[#D6E4FF] border border-[#D6E4FF]">
          {SERVICES.map(({n,title,desc,price,href}) => (
            <Link key={n} href={href} className="bg-[var(--cream-soft)] p-8 hover:bg-[var(--cream)] transition-colors block">
              <div className="font-sans text-[10px] tracking-widest text-[var(--warm-light)] mb-3">{n}</div>
              <h3 className="text-[16px] font-normal mb-2 tracking-wide">{title}</h3>
              <p className="font-sans text-[12px] text-[#4B628A] leading-relaxed mb-3">{desc}</p>
              <div className="font-sans text-[11px] text-[var(--accent)] tracking-wide uppercase border-t border-[#D6E4FF] pt-3">{price} →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* DARK FEATURES */}
      <section className="bg-[var(--dark)] py-[72px] px-10">
        <div className="max-w-[900px] mx-auto grid grid-cols-3 gap-12">
          {[['Praktisk','Henting & levering','Vi henter og leverer direkte til deg. Bestill på nett — vi fikser resten.'],['Garanti','Alltid fornøyd','Vi er ikke fornøyd med arbeidet vårt før du er det. Fullt ansvar for hvert plagg.'],['Erfaring','30 år i bransjen','Thomas Rens og Vask har betjent Grünerløkka siden 1995. Din tillit er vår viktigste verdi.']].map(([n,title,body]) => (
            <div key={n} className="border-t border-white/10 pt-6">
              <div className="font-sans text-[10px] tracking-widest uppercase text-[var(--warm-light)] mb-3">{n}</div>
              <h3 className="text-[17px] text-white font-normal mb-2">{title}</h3>
              <p className="font-sans text-[12px] text-white/40 leading-loose">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PHOTO + TEXT */}
      <section className="grid grid-cols-2 min-h-[420px]">
        <div className="relative overflow-hidden">
          <Image src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&q=80" alt="Atelier" fill className="object-cover" />
        </div>
        <div className="bg-[var(--cream-soft)] px-14 py-16 flex flex-col justify-center">
          <p className="font-sans text-[10px] tracking-[0.22em] uppercase text-[var(--warm)] mb-3">Om oss</p>
          <h2 className="text-[28px] font-normal mb-4 leading-snug">Et renseri bygget<br />på faglig stolthet</h2>
          <p className="font-sans text-[13px] text-[#4B628A] leading-loose mb-3">Thomas Rens og Vask har holdt til på Hesselbergs gate siden 1995. Et lokalt renseri med dyp respekt for hvert plagg vi tar imot.</p>
          <p className="font-sans text-[13px] text-[#4B628A] leading-loose mb-4">Faglig stolthet og teknisk innsikt sikrer at kjemisk rens alltid utføres etter de strengeste bransjestandarder.</p>
          <Link href="/bestilling" className="inline-block border border-[var(--dark)] text-[var(--dark)] px-6 py-3 font-sans text-[11px] tracking-widest uppercase hover:bg-[var(--dark)] hover:text-white transition-all w-fit">Book time nå</Link>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-[72px] px-10 bg-[var(--cream)]">
        <div className="max-w-[900px] mx-auto">
          <p className="font-sans text-[10px] tracking-[0.22em] uppercase text-[var(--warm)] mb-3 text-center">Hva kundene sier</p>
          <div className="flex items-baseline gap-4 justify-center mb-2">
            <span className="font-serif text-[54px] leading-none">4,1</span>
            <span className="text-[22px] text-[var(--warm)] tracking-[3px]">★★★★☆</span>
          </div>
          <p className="font-sans text-[12px] text-[#4B628A] text-center mb-11">35 anmeldelser på Google</p>
          <div className="grid grid-cols-3 gap-5">
            {REVIEWS.map(({stars,text,author},i) => (
              <div key={i} className="bg-[var(--cream-soft)] p-7">
                <div className="text-[var(--warm)] text-[13px] tracking-[2px] mb-2">{'★'.repeat(stars)}</div>
                <p className="font-serif text-[13px] leading-loose italic mb-4">"{text}"</p>
                <p className="font-sans text-[11px] text-[#4B628A] tracking-wide">— {author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOURS */}
      <section className="grid grid-cols-2 min-h-[380px]">
        <div className="relative overflow-hidden">
          <Image src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=900&q=80" alt="Renseri" fill className="object-cover" />
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.30)]" />
        </div>
        <div className="bg-[var(--dark2)] px-14 py-14 flex flex-col justify-center">
          <p className="font-sans text-[10px] tracking-[0.22em] uppercase text-[var(--warm-light)] mb-3">Åpningstider</p>
          <h2 className="text-[26px] text-white font-normal mb-7">Kom og besøk oss</h2>
          {HOURS.map((day,i) => (
            <div key={day} className={`flex justify-between py-2 border-b border-white/[0.07] font-sans text-[13px] ${i===todayIndex?'text-[var(--warm-light)] font-bold':''}`}>
              <span className={i===todayIndex?'text-[var(--warm-light)]':'text-white/45'}>{day}{i===todayIndex?' ← i dag':''}</span>
              <span className={i===todayIndex?'text-[var(--warm-light)]':'text-white/85'}>{TIMES[i]}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
