import { sourceField, editionField, versionField, rulesetField, isHomebrewField, versionNotesField } from './common/source'

export default {
    name: 'subclass',
    title: 'Subclass',
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
            name: 'parentClassId',
            title: 'Parent Class ID (Legacy)',
            type: 'string',
            description: 'ID of the parent class (e.g., "wizard", "fighter")',
        },
        {
            name: 'parentClass',
            title: 'Parent Class',
            type: 'reference',
            to: [{ type: 'class' }],
            description: 'Reference linking back to the parent class.',
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
        rulesetField,
        isHomebrewField,
        versionNotesField,
        {
            name: 'proficiencies',
            title: 'Additional Proficiencies',
            type: 'array',
            of: [{ type: 'proficiencyRule' }],
            description: 'Proficiencies granted by this subclass (e.g. Hexblade armor).',
        },
        {
            name: 'isSpellcaster',
            title: 'Is Spellcaster?',
            type: 'boolean',
            description: 'Enable this if the subclass grants spellcasting abilities (e.g. Arcane Trickster, Eldritch Knight).',
            initialValue: false,
        },
        {
            name: 'spells',
            title: 'Additional Spells',
            type: 'array',
            of: [{ type: 'spellGrant' }],
            hidden: ({ document }: any) => !document?.isSpellcaster,
            description: 'Spells granted by this subclass (e.g. Domain spells).',
        },
        {
            name: 'magicType',
            title: 'Magic Type',
            type: 'string',
            hidden: ({ document }: any) => !document?.isSpellcaster,
            description: 'Type of magic for non-caster subclasses (e.g., "Spell Slots (Wizard List)", "Ki Spells")',
        },
        {
            name: 'magicAbility',
            title: 'Magic Ability',
            type: 'string',
            hidden: ({ document }: any) => !document?.isSpellcaster,
            description: 'Primary ability score for magic (e.g., "Intelligence", "Wisdom")',
        },
        {
            name: 'magicDescription',
            title: 'Magic Description',
            type: 'text',
            rows: 2,
            hidden: ({ document }: any) => !document?.isSpellcaster,
            description: 'Short description of how the magic works',
        },
        {
            name: 'extraLanguages',
            title: 'Number of extra languages',
            type: 'number',
            initialValue: 0,
        },
        {
            name: 'additionalProficiencies',
            title: 'Proficiencies (New)',
            type: 'array',
            of: [{ type: 'proficiencyRule' }],
            description: 'Replaces legacy skill/tool arrays.',
        },
        {
            name: 'features',
            title: 'Features',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'feature' }] }],
            description: 'References to feature documents representing the subclass progression track',
        },
        {
            name: 'traits',
            title: 'Traits',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'trait' }] }],
            description: 'Reference traits from the centralized Trait library',
        },
    ],
    preview: {
        select: {
            title: 'name',
            legacyParentId: 'parentClassId',
            parentClassName: 'parentClass.name',
        },
        prepare(selection: any) {
            const { title, legacyParentId, parentClassName } = selection
            const parentName = parentClassName || legacyParentId || 'Unknown'
            return {
                title: title,
                subtitle: `${parentName.charAt(0).toUpperCase() + parentName.slice(1)} Subclass`,
            }
        },
    },
}
