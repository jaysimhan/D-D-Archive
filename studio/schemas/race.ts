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
            of: [{ type: 'reference', to: [{ type: 'trait' }] }],
            description: 'Reference traits from the centralized Trait library',
        },
        {
            name: 'proficiencies',
            title: 'Proficiencies & Languages',
            type: 'array',
            of: [{ type: 'proficiencyRule' }],
            description: 'Skills, Tools, Languages, Armor, Weapons granted by this race.',
        },
        {
            name: 'subraces',
            title: 'Subraces',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'IDs of subraces',
        },
        {
            name: 'spells',
            title: 'Spells',
            type: 'array',
            of: [{ type: 'spellGrant' }],
            description: 'Spells known or choices granted by this race.',
        },
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'source',
        },
    },
}
