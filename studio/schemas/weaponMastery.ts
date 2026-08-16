export default {
    name: 'weaponMastery',
    title: 'Weapon Mastery',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
            description: 'e.g., Nick, Vex, Cleave, Graze, Slow, Topple, etc.',
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
