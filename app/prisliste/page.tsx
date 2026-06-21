import Link from 'next/link'

const PRICES = [
  {
    category: 'Overdeler',
    items: [
      { name: 'Skjorte', lines: [['Rens (bomull)', '150 kr'], ['Rens (silke)', '225 kr'], ['Legge opp ermer', '350 kr']] },
      { name: 'Jakke', lines: [['Rens', '425 kr'], ['Glidelås én-veis', '650 kr'], ['Glidelås to-veis', '750 kr']] },
      { name: 'Dunjakke', lines: [['Rens', '625 kr'], ['Glidelås én-veis', '650 kr'], ['Glidelås to-veis', '750 kr']] },
      { name: 'Genser / Bluse', lines: [['Rens', '250 kr'], ['Legge opp/ned ermer', '400 kr'], ['Legge opp/ned lengde', '400 kr']] },
      { name: 'Kåpe / Frakk', lines: [['Rens', '600 kr'], ['Sy inn/ut ermer', '500 kr'], ['Sy inn/ut skuldre', '600 kr']] },
      { name: 'Skjerf', lines: [['Rens', '150 kr']] },
    ],
  },
  {
    category: 'Underdeler',
    items: [
      { name: 'Bukse / Jeans', lines: [['Rens', '250 kr'], ['Legge opp bukse', '290 kr'], ['Original fald', '350 kr']] },
      { name: 'Skjørt', lines: [['Rens (kort)', '265 kr'], ['Rens (lang)', '400 kr'], ['Legge opp', '550 kr']] },
      { name: 'Shorts', lines: [['Rens/vask', '175 kr'], ['Legge opp', '200 kr'], ['Legge ned', '250 kr']] },
    ],
  },
  {
    category: 'Kjole & Dress',
    items: [
      { name: 'Kjole', lines: [['Rens (kort)', '440 kr'], ['Rens (lang)', '675 kr'], ['Selskapskjole', '1 075 kr']] },
      { name: 'Brudekjole', lines: [['Rens', '2 750 kr'], ['Kjolelengde', '2 000 kr'], ['Ermer', '500 kr']] },
      { name: 'Dress', lines: [['Rens (komplett)', '590 kr'], ['Rens (smoking)', '620 kr']] },
      { name: 'Dressjakke', lines: [['Rens', '295 kr'], ['Legge opp/ned ermer', '750 kr'], ['Legge opp i lengden', '500 kr']] },
      { name: 'Dressbukse', lines: [['Rens', '295 kr'], ['Legge opp/ned', '290 kr'], ['Livvidde', '350 kr']] },
    ],
  },
  {
    category: 'Bunad',
    items: [
      { name: 'Bunad', lines: [['Damebunad', '1 400 kr'], ['Herrebunad', '1 400 kr'], ['Barn', '800 kr']] },
      { name: 'Bunaddeler', lines: [['Bunadsskjorte', '450 kr'], ['Bunadstakk', '750 kr'], ['Bunadsvest', '320 kr']] },
      { name: 'Andre bunaddeler', lines: [['Forkle', '330 kr'], ['Jal', '260 kr'], ['Veske', '250 kr']] },
    ],
  },
  {
    category: 'Interiør & Soverom',
    items: [
      { name: 'Dyne & Pute', lines: [['Enkeldyne', '650 kr'], ['Dobbeldyne', '840 kr'], ['Dunpute', '250 kr'], ['Silkepute', '400 kr']] },
      { name: 'Tepper & Pledd', lines: [['Sengeteppe (enkel)', '400 kr'], ['Sengeteppe (dobbel)', '600 kr'], ['Pledd', '500 kr'], ['Gulvteppe/m²', '250 kr']] },
      { name: 'Kilovask', lines: [['Vask per kg', '170 kr']] },
    ],
  },
]

export default function PrislistePage() {
  return (
    <div className="py-16 px-10 max-w-[900px] mx-auto">
      <div className="text-center mb-14">
        <h1 className="text-[34px] font-normal mb-2">Prisliste</h1>
        <p className="font-sans text-[13px] text-[#7A7468]">Prisene er veiledende. Ring oss på 22 71 78 70 for spesialtjenester.</p>
      </div>

      {PRICES.map(({ category, items }) => (
        <div key={category} className="mb-12">
          <div className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#8B7355] mb-5 pb-2 border-b border-[#E5E0D5]">
            {category}
          </div>
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
            {items.map(({ name, lines }) => (
              <div key={name} className="bg-[#FAF8F3] p-5">
                <h4 className="text-[15px] font-normal mb-3">{name}</h4>
                {lines.map(([service, price]) => (
                  <div key={service} className="flex justify-between py-1.5 border-b border-black/[0.06] last:border-b-0 font-sans text-[12px]">
                    <span className="text-[#7A7468]">{service}</span>
                    <span className="font-bold text-[#2C2C28]">{price}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="text-center mt-10">
        <Link href="/bestilling" className="bg-[#C4A882] text-[#1A1A18] px-8 py-3 font-sans text-[11px] tracking-widest uppercase font-bold inline-block">
          Bestill nå
        </Link>
      </div>
    </div>
  )
}
