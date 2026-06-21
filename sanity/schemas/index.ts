export const service = {
  name: 'service',
  title: 'Tjeneste',
  type: 'document',
  fields: [
    { name: 'number', title: 'Nummer (01, 02...)', type: 'string' },
    { name: 'title', title: 'Tittel', type: 'string' },
    { name: 'description', title: 'Beskrivelse', type: 'text' },
    { name: 'priceFrom', title: 'Fra pris (eks: Fra 150 kr)', type: 'string' },
    { name: 'linkTo', title: 'Lenker til (prisliste/booking)', type: 'string' },
    { name: 'order', title: 'Rekkefølge', type: 'number' },
  ],
}

export const review = {
  name: 'review',
  title: 'Anmeldelse',
  type: 'document',
  fields: [
    { name: 'stars', title: 'Stjerner (1–5)', type: 'number' },
    { name: 'text', title: 'Tekst', type: 'text' },
    { name: 'author', title: 'Forfatter', type: 'string' },
  ],
}

export const openingHours = {
  name: 'openingHours',
  title: 'Åpningstider',
  type: 'document',
  fields: [{
    name: 'days',
    title: 'Dager',
    type: 'array',
    of: [{
      type: 'object',
      fields: [
        { name: 'day', title: 'Dag', type: 'string' },
        { name: 'opens', title: 'Åpner (HH:MM)', type: 'string' },
        { name: 'closes', title: 'Stenger (HH:MM)', type: 'string' },
        { name: 'closed', title: 'Stengt denne dagen', type: 'boolean' },
      ],
    }],
  }],
}
