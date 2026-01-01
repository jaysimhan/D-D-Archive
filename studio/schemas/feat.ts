import { sourceField, editionField, versionField } from './common/source'

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
        sourceField,
        editionField,
        versionField,
    ],
}
