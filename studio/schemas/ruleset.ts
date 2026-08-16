export default {
    name: 'ruleset',
    title: 'Ruleset',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
            description: 'e.g., D&D 5e (2014) or D&D 5e (2024)',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'key',
            title: 'Key',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
            },
            description: 'Unique key, e.g., srd-2014 or srd-2024',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
        },
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'key.current',
        },
    },
}
