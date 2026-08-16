export default {
    name: 'weaponProperty',
    title: 'Weapon Property',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
            description: 'e.g., Finesse, Heavy, Light, Two-Handed, etc.',
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
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'description',
        },
    },
}
