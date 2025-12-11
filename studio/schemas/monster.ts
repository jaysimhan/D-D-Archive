import { sourceField, editionField, versionField } from './common/source'

export default {
    name: 'monster',
    title: 'Monster',
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
            name: 'size',
            title: 'Size',
            type: 'string',
            options: {
                list: ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'],
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'type',
            title: 'Type',
            type: 'string',
            options: {
                list: [
                    'Aberration', 'Beast', 'Celestial', 'Construct', 'Dragon',
                    'Elemental', 'Fey', 'Fiend', 'Giant', 'Humanoid',
                    'Monstrosity', 'Ooze', 'Plant', 'Undead'
                ],
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'alignment',
            title: 'Alignment',
            type: 'string',
            options: {
                list: [
                    'LG', 'NG', 'CG', 'LN', 'N', 'CN', 'LE', 'NE', 'CE', 'Unaligned'
                ],
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'armorClass',
            title: 'Armor Class',
            type: 'number',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'hitPoints',
            title: 'Hit Points',
            type: 'number',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'hitDice',
            title: 'Hit Dice',
            type: 'string', // e.g. "2d6 + 4"
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'speed',
            title: 'Speed',
            type: 'object',
            fields: [
                { name: 'walk', title: 'Walk', type: 'number' },
                { name: 'fly', title: 'Fly', type: 'number' },
                { name: 'swim', title: 'Swim', type: 'number' },
                { name: 'burrow', title: 'Burrow', type: 'number' },
                { name: 'climb', title: 'Climb', type: 'number' },
            ],
        },
        {
            name: 'abilityScores',
            title: 'Ability Scores',
            type: 'object',
            fields: [
                { name: 'STR', title: 'Strength', type: 'number', validation: (Rule: any) => Rule.required() },
                { name: 'DEX', title: 'Dexterity', type: 'number', validation: (Rule: any) => Rule.required() },
                { name: 'CON', title: 'Constitution', type: 'number', validation: (Rule: any) => Rule.required() },
                { name: 'INT', title: 'Intelligence', type: 'number', validation: (Rule: any) => Rule.required() },
                { name: 'WIS', title: 'Wisdom', type: 'number', validation: (Rule: any) => Rule.required() },
                { name: 'CHA', title: 'Charisma', type: 'number', validation: (Rule: any) => Rule.required() },
            ],
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'savingThrows',
            title: 'Saving Throws',
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
            name: 'skills',
            title: 'Skills',
            type: 'object',
            fields: [
                { name: 'acrobatics', title: 'Acrobatics', type: 'number' },
                { name: 'animalHandling', title: 'Animal Handling', type: 'number' },
                { name: 'arcana', title: 'Arcana', type: 'number' },
                { name: 'athletics', title: 'Athletics', type: 'number' },
                { name: 'deception', title: 'Deception', type: 'number' },
                { name: 'history', title: 'History', type: 'number' },
                { name: 'insight', title: 'Insight', type: 'number' },
                { name: 'intimidation', title: 'Intimidation', type: 'number' },
                { name: 'investigation', title: 'Investigation', type: 'number' },
                { name: 'medicine', title: 'Medicine', type: 'number' },
                { name: 'nature', title: 'Nature', type: 'number' },
                { name: 'perception', title: 'Perception', type: 'number' },
                { name: 'performance', title: 'Performance', type: 'number' },
                { name: 'persuasion', title: 'Persuasion', type: 'number' },
                { name: 'religion', title: 'Religion', type: 'number' },
                { name: 'sleightOfHand', title: 'Sleight of Hand', type: 'number' },
                { name: 'stealth', title: 'Stealth', type: 'number' },
                { name: 'survival', title: 'Survival', type: 'number' },
            ],
            description: 'Skill bonuses (e.g. +5)',
        },
        {
            name: 'damageResistances',
            title: 'Damage Resistances',
            type: 'array',
            of: [{ type: 'string' }],
        },
        {
            name: 'damageImmunities',
            title: 'Damage Immunities',
            type: 'array',
            of: [{ type: 'string' }],
        },
        {
            name: 'conditionImmunities',
            title: 'Condition Immunities',
            type: 'array',
            of: [{ type: 'string' }],
        },
        {
            name: 'senses',
            title: 'Senses',
            type: 'string', // Usually a string like "Darkvision 60ft., passive Perception 12" or could be object. Using string for simplicity to match common inputs or object map. Guide says object {key: number} but CSV says traits/languages? 
            // Guide says `senses?: { [key: string]: number };`
            // Let's make it an array of strings or object. Object is harder to dynamic key in Sanity without predefined fields or JSON plugin.
            // I'll stick to a simple object with common senses if possible, or just a text field / tags.
            // Given the guide: { [key: string]: number }, let's use an array of objects for flexibility?
            // Or just hardcode common ones. "passivePerception" is most common.
            // Let's follow the guide strictly: "senses?: { [key: string]: number };"
            // In Sanity, a dynamic object is best represented as an array of Key-Value pairs if keys are arbitrary.
            // But usually senses are standard.
            // Let's use an array of strings for simplicity as that's often easier for "Darkvision 60ft".
            // Wait, the guide type is `{ [key: string]: number }`. E.g. { "darkvision": 60 }.
            // Let's implement as an object with common fields + custom array?
            // Simpler: Just an object with common senses
            type: 'object',
            fields: [
                { name: 'passivePerception', title: 'Passive Perception', type: 'number' },
                { name: 'darkvision', title: 'Darkvision (ft)', type: 'number' },
                { name: 'blindsight', title: 'Blindsight (ft)', type: 'number' },
                { name: 'tremorsense', title: 'Tremorsense (ft)', type: 'number' },
                { name: 'truesight', title: 'Truesight (ft)', type: 'number' },
            ]
        },
        {
            name: 'languages',
            title: 'Languages',
            type: 'array',
            of: [{ type: 'string' }],
        },
        {
            name: 'challengeRating',
            title: 'Challenge Rating',
            type: 'number',
            validation: (Rule: any) => Rule.required().min(0).max(30),
        },
        {
            name: 'experiencePoints',
            title: 'Experience Points',
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
                    fields: [
                        { name: 'name', title: 'Name', type: 'string', validation: (Rule: any) => Rule.required() },
                        { name: 'description', title: 'Description', type: 'text', validation: (Rule: any) => Rule.required() },
                    ],
                },
            ],
        },
        {
            name: 'actions',
            title: 'Actions',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'name', title: 'Name', type: 'string', validation: (Rule: any) => Rule.required() },
                        { name: 'description', title: 'Description', type: 'text', validation: (Rule: any) => Rule.required() },
                    ],
                },
            ],
        },
        {
            name: 'legendaryActions',
            title: 'Legendary Actions',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'name', title: 'Name', type: 'string', validation: (Rule: any) => Rule.required() },
                        { name: 'description', title: 'Description', type: 'text', validation: (Rule: any) => Rule.required() },
                    ],
                },
            ],
        },
        sourceField,
        editionField,
        versionField,
    ],
}
