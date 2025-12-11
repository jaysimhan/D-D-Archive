import { sourceField, editionField, versionField } from './common/source'

export default {
    name: 'race',
    title: 'Race',
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
            description: 'Minimum 300x300px, Maximum 2000x2000px',
            options: {
                hotspot: true,
            },
        },
        sourceField,
        editionField,
        versionField,
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
            name: 'size',
            title: 'Size',
            type: 'string',
            options: {
                list: [
                    { title: 'Tiny', value: 'Tiny' },
                    { title: 'Small', value: 'Small' },
                    { title: 'Medium', value: 'Medium' },
                    { title: 'Large', value: 'Large' },
                ],
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'speed',
            title: 'Speed (ft)',
            type: 'number',
            validation: (Rule: any) => Rule.required().min(0),
        },
        {
            name: 'traits',
            title: 'Traits',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'trait',
                    title: 'Trait',
                    fields: [
                        { name: 'name', title: 'Name', type: 'string', validation: (Rule: any) => Rule.required() },
                        { name: 'description', title: 'Description', type: 'text', validation: (Rule: any) => Rule.required() },
                    ],
                    preview: {
                        select: {
                            title: 'name',
                            subtitle: 'description',
                        },
                    },
                },
            ],
        },
        {
            name: 'languages',
            title: 'Languages',
            type: 'array',
            of: [{ type: 'string' }],
        },
        {
            name: 'subraces',
            title: 'Subraces',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'IDs of subraces',
        },
        {
            name: 'racialSpellChoices',
            title: 'Racial Spell Choices',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'racialSpellChoice',
                    title: 'Spell Choice',
                    fields: [
                        { name: 'choose', title: 'Number to Choose', type: 'number', validation: (Rule: any) => Rule.required().min(1) },
                        { name: 'name', title: 'Choice Name', type: 'string', validation: (Rule: any) => Rule.required() },
                        { name: 'list', title: 'Spell IDs', type: 'array', of: [{ type: 'string' }] },
                        { name: 'school', title: 'School Restriction', type: 'string' },
                        { name: 'level', title: 'Max Spell Level', type: 'number', description: '0 for cantrips' },
                    ],
                    preview: {
                        select: {
                            title: 'name',
                            subtitle: 'choose',
                        },
                    },
                },
            ],
        },
        {
            name: 'racialKnownSpells',
            title: 'Racial Known Spells',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'racialKnownSpell',
                    title: 'Known Spell',
                    fields: [
                        { name: 'level', title: 'Character Level Required', type: 'number', validation: (Rule: any) => Rule.required().min(1) },
                        { name: 'spellId', title: 'Spell ID', type: 'string', validation: (Rule: any) => Rule.required() },
                        {
                            name: 'abilityScore',
                            title: 'Casting Ability',
                            type: 'string',
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
                        {
                            name: 'type',
                            title: 'Usage Type',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'At-Will', value: 'at-will' },
                                    { title: '1/Day', value: '1/day' },
                                    { title: 'Recharge', value: 'recharge' },
                                ],
                            },
                        },
                        { name: 'spellName', title: 'Display Name Override', type: 'string' },
                    ],
                    preview: {
                        select: {
                            title: 'spellId',
                            subtitle: 'type',
                        },
                    },
                },
            ],
        },
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'source',
        },
    },
}
