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
    title: 'Legacy Edition',
    type: 'string',
    options: {
        list: [
            { title: '2014', value: '2014' },
            { title: '2024', value: '2024' },
            { title: 'Both', value: 'Both' },
        ],
    },
    initialValue: 'Both',
    description: 'Kept for existing documents. Use Rulesets for all new editing.',
    hidden: true,
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
    title: 'Legacy Ruleset',
    type: 'reference',
    to: [{ type: 'ruleset' }],
    description: 'Kept for existing documents. Use Rulesets for all new editing.',
    hidden: true,
}

/** A document may apply to 2014, 2024, or both without being duplicated. */
export const rulesetsField = {
    name: 'rulesets',
    title: 'Rulesets',
    type: 'array',
    of: [{ type: 'reference', to: [{ type: 'ruleset' }] }],
    options: { layout: 'tags' },
    description: 'Choose D&D 2014, D&D 2024, or select both.',
    validation: (Rule: any) => Rule.required().min(1).unique(),
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
