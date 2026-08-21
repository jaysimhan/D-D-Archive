import { sourceField, sourceBookField, editionField, versionField, rulesetField, rulesetsField, isHomebrewField, versionNotesField } from './common/source'

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
            name: 'itemCategory',
            title: 'Item Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Weapon', value: 'Weapon' },
                    { title: 'Armor', value: 'Armor' },
                    { title: 'Potion', value: 'Potion' },
                    { title: 'Gear', value: 'Gear' },
                    { title: 'Tool', value: 'Tool' },
                    { title: 'Wondrous Item', value: 'Wondrous Item' },
                    { title: 'Ring', value: 'Ring' },
                    { title: 'Rod', value: 'Rod' },
                    { title: 'Staff', value: 'Staff' },
                    { title: 'Wand', value: 'Wand' },
                    { title: 'Scroll', value: 'Scroll' },
                ],
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'type',
            title: 'Legacy / Public Item Type',
            type: 'string',
            options: {
                list: ['Weapon', 'Armor', 'Tool', 'Potion', 'Scroll', 'Wondrous Item', 'Ring', 'Rod', 'Staff', 'Wand', 'Adventuring Gear'],
            },
            description: 'Kept in sync with Item Category for compatibility with existing records and the public app.',
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
            name: 'magical',
            title: 'Magical',
            type: 'boolean',
            initialValue: false,
        },
        {
            name: 'magicBonus',
            title: 'Magic Bonus',
            type: 'number',
            description: 'The numerical bonus of the magic item (e.g., 1, 2, 3), if applicable.',
            hidden: ({ document }: any) => !document?.magical,
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
                {
                    name: 'amount',
                    title: 'Amount',
                    type: 'number',
                    description: 'Public-app cost value used by existing item records.',
                },
                { name: 'quantity', title: 'Quantity', type: 'number' },
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
            title: 'Properties (Legacy / Display)',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Human-readable properties consumed by the public item cards.',
        },
        {
            name: 'toolCategory',
            title: 'Tool Category',
            type: 'string',
            hidden: ({ parent }: any) => parent?.itemCategory !== 'Tool',
            options: {
                list: ["Artisan's Tools", 'Gaming Set', 'Musical Instrument', 'Other'],
            },
        },
        // Weapon Specific Fields
        {
            name: 'weaponProperties',
            title: 'Weapon Properties',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'weaponProperty' }] }],
            hidden: ({ parent }: any) => parent?.itemCategory !== 'Weapon',
            description: 'For weapons only. Links to weaponProperty documents (e.g., Finesse, Heavy, Two-Handed).',
        },
        {
            name: 'damage',
            title: 'Weapon Damage',
            type: 'object',
            hidden: ({ parent }: any) => parent?.itemCategory !== 'Weapon',
            fields: [
                { name: 'diceCount', title: 'Dice Count', type: 'number', initialValue: 1 },
                {
                    name: 'diceType',
                    title: 'Dice Type',
                    type: 'string',
                    options: { list: ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'] },
                    initialValue: 'd6',
                },
                {
                    name: 'damageType',
                    title: 'Damage Type',
                    type: 'string',
                    options: {
                        list: [
                            'Slashing', 'Piercing', 'Bludgeoning', 'Fire', 'Cold', 'Lightning',
                            'Acid', 'Thunder', 'Poison', 'Necrotic', 'Radiant', 'Force', 'Psychic'
                        ],
                    },
                    initialValue: 'Slashing',
                },
            ],
        },
        {
            name: 'mastery',
            title: 'Weapon Mastery',
            type: 'reference',
            to: [{ type: 'weaponMastery' }],
            hidden: ({ parent }: any) => parent?.itemCategory !== 'Weapon',
            description: 'For 2024 ruleset compliance. Links to Weapon Mastery definitions.',
        },
        // Armor Specific Fields
        {
            name: 'armorClass',
            title: 'Armor Class Details',
            type: 'object',
            hidden: ({ parent }: any) => parent?.itemCategory !== 'Armor',
            fields: [
                { name: 'base', title: 'Base AC', type: 'number', validation: (Rule: any) => Rule.min(0) },
                {
                    name: 'dexterityModifier',
                    title: 'Dexterity Modifier Limit',
                    type: 'string',
                    options: {
                        list: [
                            { title: 'Full Dex Modifier Added', value: 'full' },
                            { title: 'Max Dex Modifier of +2', value: 'max2' },
                            { title: 'No Dex Modifier Added', value: 'none' },
                        ],
                    },
                    initialValue: 'full',
                },
                { name: 'stealthDisadvantage', title: 'Stealth Disadvantage?', type: 'boolean', initialValue: false },
            ],
        },
        // Polymorphic Grants
        {
            name: 'grants',
            title: 'Feature Grants',
            type: 'array',
            of: [{ type: 'featureGrant' }],
            description: 'Define specific spell, slot, or resource pool benefits granted by this item.',
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
