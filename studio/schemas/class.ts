import { sourceField, sourceBookField, editionField, versionField, rulesetField, rulesetsField, isHomebrewField, versionNotesField } from './common/source'

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
        sourceBookField,
        editionField,
        versionField,
        rulesetsField,
        rulesetField,
        isHomebrewField,
        versionNotesField,
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
            name: 'spellLists',
            title: 'Spell Lists',
            type: 'array',
            of: [{ type: 'string' }],
            hidden: ({ document }: any) => !document?.isSpellcaster,
            options: {
                list: [
                    { title: 'Artificer', value: 'artificer' },
                    { title: 'Bard', value: 'bard' },
                    { title: 'Cleric', value: 'cleric' },
                    { title: 'Druid', value: 'druid' },
                    { title: 'Paladin', value: 'paladin' },
                    { title: 'Ranger', value: 'ranger' },
                    { title: 'Sorcerer', value: 'sorcerer' },
                    { title: 'Warlock', value: 'warlock' },
                    { title: 'Wizard', value: 'wizard' },
                ],
            },
            description: 'Spell lists available to this class. If empty, the class slug is used.',
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
            of: [{ type: 'reference', to: [{ type: 'feature' }] }],
            description: 'References to feature documents representing the core progression track',
        },
        {
            name: 'progression',
            title: 'Class Progression Table',
            type: 'array',
            description: 'Structured level-by-level class table, including proficiency bonus, class resources, and feature summaries.',
            of: [
                {
                    type: 'object',
                    name: 'classProgressionRow',
                    fields: [
                        {
                            name: 'level',
                            title: 'Level',
                            type: 'number',
                            validation: (Rule: any) => Rule.required().integer().min(1).max(20),
                        },
                        {
                            name: 'proficiencyBonus',
                            title: 'Proficiency Bonus',
                            type: 'number',
                            validation: (Rule: any) => Rule.required().integer().min(2).max(6),
                        },
                        {
                            name: 'resources',
                            title: 'Class Resource Values',
                            type: 'array',
                            of: [
                                {
                                    type: 'object',
                                    fields: [
                                        { name: 'name', title: 'Column Name', type: 'string', validation: (Rule: any) => Rule.required() },
                                        { name: 'value', title: 'Value', type: 'string', validation: (Rule: any) => Rule.required() },
                                    ],
                                    preview: {
                                        select: { title: 'name', subtitle: 'value' },
                                    },
                                },
                            ],
                        },
                        {
                            name: 'featureNames',
                            title: 'Features at This Level',
                            type: 'array',
                            of: [{ type: 'string' }],
                            validation: (Rule: any) => Rule.required().min(1),
                        },
                    ],
                    preview: {
                        select: { level: 'level', features: 'featureNames' },
                        prepare({ level, features }: any) {
                            return { title: `Level ${level ?? '?'}`, subtitle: (features || []).join(', ') }
                        },
                    },
                },
            ],
        },
        {
            name: 'startingEquipment',
            title: 'Starting Equipment',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Equipment and equipment choices granted when a character starts in this class.',
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
                                filter: 'parentClassId == $classSlug || parentClass._ref == $classId || !defined(parentClassId)',
                                params: {
                                    classSlug: document.slug.current,
                                    classId: document._id
                                }
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
        {
            name: 'grants',
            title: 'Feature Grants',
            type: 'array',
            of: [{ type: 'featureGrant' }],
            description: 'Define specific spell, slot, or resource pool benefits granted by this class.',
        },
    ],
}
