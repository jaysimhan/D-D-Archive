import { sourceField, editionField, versionField } from './common/source'

export default {
    name: 'class',
    title: 'Class',
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
            name: 'hitDie',
            title: 'Hit Die',
            type: 'number',
            options: {
                list: [4, 6, 8, 10, 12],
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'primaryAbility',
            title: 'Primary Ability',
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
        {
            name: 'savingThrows',
            title: 'Saving Throws',
            type: 'array',
            of: [{ type: 'string' }],
            validation: (Rule: any) => Rule.required().min(2).max(2),
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
            name: 'proficiencies',
            title: 'Proficiencies (Armor, Weapons, Skills)',
            type: 'array',
            of: [{ type: 'proficiencyRule' }],
            description: 'Define initial proficiencies and choices (e.g. "Choose 2 from...")',
        },
        {
            name: 'isSpellcaster',
            title: 'Is Spellcaster?',
            type: 'boolean',
            description: 'Enable this if the class grants spellcasting abilities.',
            initialValue: false,
        },
        {
            name: 'spellcaster',
            title: 'Spellcaster Type',
            type: 'string',
            hidden: ({ document }: any) => !document?.isSpellcaster,
            options: {
                list: [
                    { title: 'Full Caster', value: 'full' },
                    { title: 'Half Caster', value: 'half' },
                    { title: 'Third Caster', value: 'third' },
                    { title: 'Pact Magic', value: 'pact' },
                    { title: 'Special', value: 'special' },
                    { title: 'None', value: 'none' },
                ],
            },
        },
        {
            name: 'spellcastingAbility',
            title: 'Spellcasting Ability',
            type: 'string',
            hidden: ({ document }: any) => !document?.isSpellcaster,
            options: {
                list: [
                    { title: 'Intelligence', value: 'INT' },
                    { title: 'Wisdom', value: 'WIS' },
                    { title: 'Charisma', value: 'CHA' },
                ],
            },
        },
        {
            name: 'spells',
            title: 'Spells (New)',
            type: 'array',
            of: [{ type: 'spellGrant' }],
            hidden: ({ document }: any) => !document?.isSpellcaster,
            description: 'Spells specifically granted by class features (not general spellcasting).',
        },
        {
            name: 'features',
            title: 'Features',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'classFeature',
                    title: 'Feature',
                    fields: [
                        { name: 'level', title: 'Level', type: 'number', validation: (Rule: any) => Rule.required().min(1).max(20) },
                        { name: 'name', title: 'Name', type: 'string', validation: (Rule: any) => Rule.required() },
                        { name: 'description', title: 'Description', type: 'text', validation: (Rule: any) => Rule.required() },
                    ],
                    preview: {
                        select: {
                            title: 'name',
                            subtitle: 'level',
                        },
                        prepare(selection: any) {
                            return {
                                title: selection.title,
                                subtitle: `Level ${selection.subtitle}`,
                            };
                        },
                    },
                },
            ],
        },
        {
            name: 'subclasses',
            title: 'Subclasses',
            type: 'array',
            of: [
                {
                    type: 'reference',
                    to: [{ type: 'subclass' }],
                    options: {
                        filter: ({ document }: any) => {
                            if (!document.slug?.current) {
                                return {
                                    filter: '!defined(parentClassId)',
                                }
                            }
                            return {
                                filter: 'parentClassId == $classSlug || !defined(parentClassId)',
                                params: { classSlug: document.slug.current }
                            }
                        }
                    }
                }
            ],
            description: 'References to subclasses belonging to this class',
        },
        {
            name: 'traits',
            title: 'Traits',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'trait' }] }],
            description: 'Reference traits from the centralized Trait library',
        },
        {
            name: 'subclassLevel',
            title: 'Subclass Activation Level',
            type: 'number',
            description: 'Level at which subclass is selected (1-3)',
            initialValue: 3,
            validation: (Rule: any) => Rule.min(1).max(3),
        },
    ],
}
