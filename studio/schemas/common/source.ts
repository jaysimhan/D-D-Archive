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

export const rulesetField = {
    name: 'ruleset',
    title: 'Ruleset',
    type: 'reference',
    to: [{ type: 'ruleset' }],
    description: 'Points to a ruleset document (e.g., srd-2014 or srd-2024) dictating which mechanical rules apply.',
    validation: (Rule: any) => Rule.required(),
}

export const isHomebrewField = {
    name: 'isHomebrew',
    title: 'Is Homebrew?',
    type: 'boolean',
    initialValue: false,
    description: 'Flags if the content was created by a user, protecting it from being overwritten during routine API synchronizations.',
    validation: (Rule: any) => Rule.required(),
}

export const versionNotesField = {
    name: 'versionNotes',
    title: 'Version Notes',
    type: 'text',
    rows: 3,
    description: 'Provides editors with a brief summary of what changed between the 2014 and 2024 versions of the entity.',
}

