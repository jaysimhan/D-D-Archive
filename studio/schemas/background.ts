import { sourceField, editionField, versionField, rulesetField, isHomebrewField, versionNotesField } from './common/source'

export default {
    name: 'background',
    title: 'Background',
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
        {
            name: 'skillProficiencies',
            title: 'Skill Proficiencies',
            type: 'array',
            of: [{ type: 'string' }],
            validation: (Rule: any) => Rule.required().min(2).max(2),
        },
        {
            name: 'toolProficiencies',
            title: 'Tool Proficiencies',
            type: 'array',
            of: [{ type: 'string' }],
        },
        {
            name: 'languages',
            title: 'Number of extra languages',
            type: 'number',
            initialValue: 0,
        },
        {
            name: 'proficiencies',
            title: 'Proficiencies (New)',
            type: 'array',
            of: [{ type: 'proficiencyRule' }],
            description: 'Replaces legacy skill/tool arrays.',
        },
        {
            name: 'equipment',
            title: 'Equipment',
            type: 'array',
            of: [{ type: 'string' }],
        },
        {
            name: 'feature',
            title: 'Feature',
            type: 'object',
            fields: [
                { name: 'name', title: 'Name', type: 'string', validation: (Rule: any) => Rule.required() },
                { name: 'description', title: 'Description', type: 'text', validation: (Rule: any) => Rule.required() },
            ],
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'abilityScoreIncrease',
            title: 'Ability Score Increase',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'abilityBonus',
                    title: 'Ability Bonus',
                    fields: [
                        {
                            name: 'ability',
                            title: 'Ability',
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
                            validation: (Rule: any) => Rule.required(),
                        },
                        {
                            name: 'bonus',
                            title: 'Bonus',
                            type: 'number',
                            initialValue: 1,
                            validation: (Rule: any) => Rule.required().min(1),
                        },
                    ],
                    preview: {
                        select: {
                            ability: 'ability',
                            bonus: 'bonus',
                        },
                        prepare(selection: any) {
                            const { ability, bonus } = selection
                            return {
                                title: `+${bonus} to ${ability || '?'}`
                            }
                        }
                    }
                }
            ],
            description: 'For 2024 ruleset compliance. Ability score increases are defined here.',
        },
        {
            name: 'feats',
            title: 'Starting Feats',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'feat' }] }],
            description: 'For 2024 ruleset compliance. Feats granted starting at level 1 by the background.',
        },
        sourceField,
        editionField,
        versionField,
        rulesetField,
        isHomebrewField,
        versionNotesField,
        {
            name: 'traits',
            title: 'Traits',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'trait' }] }],
            description: 'Reference traits from the centralized Trait library',
        },
    ],
}
