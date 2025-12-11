import { sourceField, editionField, versionField } from './common/source'

export default {
    name: 'item',
    title: 'Item',
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
            name: 'type',
            title: 'Type',
            type: 'string',
            options: {
                list: [
                    'Weapon', 'Armor', 'Potion', 'Scroll', 'Wondrous Item',
                    'Ring', 'Rod', 'Staff', 'Wand', 'Adventuring Gear'
                ],
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
            name: 'magical',
            title: 'Magical',
            type: 'boolean',
            initialValue: false,
        },
        {
            name: 'rarity',
            title: 'Rarity',
            type: 'string',
            options: {
                list: [
                    'Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary', 'Artifact'
                ],
            },
        },
        {
            name: 'requiresAttunement',
            title: 'Requires Attunement',
            type: 'boolean',
            initialValue: false,
        },
        {
            name: 'cost',
            title: 'Cost',
            type: 'object',
            fields: [
                { name: 'amount', title: 'Amount', type: 'number' },
                {
                    name: 'currency',
                    title: 'Currency',
                    type: 'string',
                    options: { list: ['cp', 'sp', 'ep', 'gp', 'pp'] },
                    initialValue: 'gp'
                },
            ],
        },
        {
            name: 'weight',
            title: 'Weight (lbs)',
            type: 'number',
        },
        {
            name: 'properties',
            title: 'Properties',
            type: 'array',
            of: [{ type: 'string' }],
        },
        sourceField,
        editionField,
        versionField,
    ],
}
