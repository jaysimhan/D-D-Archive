import { sourceField, sourceBookField, editionField, versionField, rulesetField, rulesetsField, isHomebrewField, versionNotesField } from './common/source'

export default {
    name: 'feat',
    title: 'Feat',
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
            title: 'Slug (ID)',
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
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        },
        {
            name: 'featCategory',
            title: 'Category',
            description: 'How the feat may be taken. Origin feats are level-1 picks (2024 backgrounds and Humans); General feats are taken in place of an Ability Score Improvement at level 4+; Epic Boons at level 19 (2024). In 2014 every feat is General. A feat with an ability increase under Benefits is a half feat; one without is a full feat.',
            type: 'string',
            options: {
                list: [
                    { title: 'Origin', value: 'Origin' },
                    { title: 'General', value: 'General' },
                    { title: 'Fighting Style', value: 'Fighting Style' },
                    { title: 'Epic Boon', value: 'Epic Boon' },
                    { title: 'Dragonmark', value: 'Dragonmark' },
                ],
                layout: 'radio',
            },
            initialValue: 'General',
        },
        {
            name: 'prerequisites',
            title: 'Prerequisites',
            type: 'object',
            fields: [
                { name: 'level', title: 'Level', type: 'number' },
                {
                    name: 'abilityScore',
                    title: 'Ability Score',
                    type: 'object',
                    fields: [
                        { name: 'STR', title: 'Strength', type: 'number' },
                        { name: 'DEX', title: 'Dexterity', type: 'number' },
                        { name: 'CON', title: 'Constitution', type: 'number' },
                        { name: 'INT', title: 'Intelligence', type: 'number' },
                        { name: 'WIS', title: 'Wisdom', type: 'number' },
                        { name: 'CHA', title: 'Charisma', type: 'number' },
                    ]
                },
                {
                    name: 'abilityScoreAnyOf',
                    title: 'Any One Ability Score Is Enough',
                    description: 'On for prerequisites like "Strength or Dexterity 13+". Off means every score listed above is required.',
                    type: 'boolean',
                },
                {
                    name: 'race',
                    title: 'Race IDs',
                    type: 'array',
                    of: [{ type: 'string' }]
                },
                {
                    name: 'class',
                    title: 'Class IDs',
                    type: 'array',
                    of: [{ type: 'string' }]
                },
                {
                    name: 'features',
                    title: 'Required Features',
                    description: 'Printed feature prerequisites, e.g. "Spellcasting or Pact Magic".',
                    type: 'array',
                    of: [{ type: 'string' }]
                },
            ],
        },
        {
            name: 'benefits',
            title: 'Benefits',
            type: 'object',
            fields: [
                {
                    name: 'abilityScoreIncrease',
                    title: 'Ability Score Increase',
                    type: 'object',
                    fields: [
                        { name: 'STR', title: 'Strength', type: 'number' },
                        { name: 'DEX', title: 'Dexterity', type: 'number' },
                        { name: 'CON', title: 'Constitution', type: 'number' },
                        { name: 'INT', title: 'Intelligence', type: 'number' },
                        { name: 'WIS', title: 'Wisdom', type: 'number' },
                        { name: 'CHA', title: 'Charisma', type: 'number' },
                    ],
                },
                {
                    name: 'flexibleAbilityIncrease',
                    title: 'Flexible Ability Increase',
                    type: 'object',
                    fields: [
                        {
                            name: 'amount',
                            title: 'Amount',
                            type: 'number',
                            initialValue: 1,
                        },
                        {
                            name: 'maxPerAbility',
                            title: 'Max Per Ability',
                            description: 'Most half feats cap one score at +1; the Ability Score Improvement feat allows 2.',
                            type: 'number',
                            initialValue: 1,
                        },
                        {
                            name: 'options',
                            title: 'Allowed Ability Options',
                            description: 'Leave empty for "Any Ability Score"',
                            type: 'array',
                            of: [{ type: 'string' }],
                            options: {
                                list: [
                                    { title: 'Strength', value: 'STR' },
                                    { title: 'Dexterity', value: 'DEX' },
                                    { title: 'Constitution', value: 'CON' },
                                    { title: 'Intelligence', value: 'INT' },
                                    { title: 'Wisdom', value: 'WIS' },
                                    { title: 'Charisma', value: 'CHA' },
                                ],
                            },
                        },
                    ],
                },
                {
                    name: 'spells',
                    title: 'Spells (IDs)',
                    type: 'array',
                    of: [{ type: 'string' }],
                },
                {
                    name: 'features',
                    title: 'Features',
                    type: 'array',
                    of: [{ type: 'string' }],
                },
            ],
        },
        {
            name: 'proficiencies',
            title: 'Proficiencies Granted',
            type: 'array',
            of: [{ type: 'proficiencyRule' }],
        },
        {
            name: 'spells',
            title: 'Spells Granted',
            type: 'array',
            of: [{ type: 'spellGrant' }],
        },
        {
            name: 'grants',
            title: 'Feature Grants',
            type: 'array',
            of: [{ type: 'featureGrant' }],
            description: 'Define specific spell, slot, or resource pool benefits granted by this feat.',
        },
        sourceField,
        sourceBookField,
        editionField,
        versionField,
        rulesetsField,
        rulesetField,
        isHomebrewField,
        versionNotesField,
    ],
}
