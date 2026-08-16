export default {
    name: 'campaign',
    title: 'Campaign',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
        },
        {
            name: 'characters',
            title: 'Characters',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'character' }] }],
        },
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'description',
        },
    },
}
