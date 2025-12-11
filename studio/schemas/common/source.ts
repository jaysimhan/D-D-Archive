export const sourceField = {
    name: 'source',
    title: 'Source',
    type: 'string',
    options: {
        list: [
            { title: 'Official', value: 'Official' },
            { title: 'Homebrew', value: 'Homebrew' },
            { title: 'Unofficial', value: 'Unofficial' },
        ],
    },
    initialValue: 'Homebrew',
    validation: (Rule: any) => Rule.required(),
}

export const editionField = {
    name: 'edition',
    title: 'Edition',
    type: 'string',
    options: {
        list: [
            { title: '2014', value: '2014' },
            { title: '2024', value: '2024' },
            { title: 'Both', value: 'Both' },
        ],
    },
    initialValue: 'Both',
    validation: (Rule: any) => Rule.required(),
}

export const versionField = {
    name: 'version',
    title: 'Version',
    type: 'number',
    initialValue: 1,
    validation: (Rule: any) => Rule.required().min(1).integer(),
}
