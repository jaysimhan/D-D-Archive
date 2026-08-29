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

/** The specific book or publisher the entry came from. `source` stays the filterable
 *  Official/Unofficial/Homebrew enum; this records the attribution behind it. */
export const sourceBookField = {
    name: 'sourceBook',
    title: 'Source Book / Publisher',
    type: 'string',
    description: 'Book or publisher this entry comes from, e.g. "Xanathar\'s Guide to Everything" or "Kobold Press". Leave blank for user homebrew.',
}

/** Core is a narrower cut than `source`, and deliberately independent of it: the
 *  Player's Handbook line-up plus its long-standing subraces. An entry can be Official
 *  and still non-core — Owlin, Plasmoid and Thri-kreen are all WotC-published but come
 *  from setting books. The character creator's "non-core" toggle filters on this field;
 *  `source` stays the Official/Unofficial/Homebrew provenance label. */
export const isCoreField = {
    name: 'isCore',
    title: 'Core?',
    type: 'boolean',
    initialValue: false,
    description: 'Part of the core line-up the character creator shows when "non-core" is switched off. Independent of Source — an Official entry from a setting book is still non-core.',
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
    title: 'Rulesets (2014 and 2024)',
    type: 'array',
    of: [{ type: 'reference', to: [{ type: 'ruleset' }] }],
    options: { layout: 'tags' },
    initialValue: [
        { _type: 'reference', _key: 'srd-2014', _ref: 'ruleset.srd-2014' },
        { _type: 'reference', _key: 'srd-2024', _ref: '86642d23-c52d-4577-adc1-214aab0f43e9' },
    ],
    description: 'Content applies to both D&D 5e (2014) and D&D 5e (2024). Core/non-core classification is managed separately by Source.',
    validation: (Rule: any) => Rule.required().length(2).unique(),
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
