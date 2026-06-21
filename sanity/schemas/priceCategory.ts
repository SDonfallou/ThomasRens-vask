export default {
  name: 'priceCategory',
  title: 'Priskategori',
  type: 'document',
  fields: [
    { name: 'title', title: 'Kategori', type: 'string' },
    { name: 'order', title: 'Rekkefølge', type: 'number' },
    {
      name: 'items',
      title: 'Plagg',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'name', title: 'Plaggtype', type: 'string' },
          {
            name: 'lines',
            title: 'Prislinjer',
            type: 'array',
            of: [{
              type: 'object',
              fields: [
                { name: 'service', title: 'Tjeneste', type: 'string' },
                { name: 'price', title: 'Pris (kr)', type: 'string' },
              ],
            }],
          },
        ],
      }],
    },
  ],
}
