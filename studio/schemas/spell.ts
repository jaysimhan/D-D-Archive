import { sourceField, editionField, versionField, rulesetField, isHomebrewField, versionNotesField } from './common/source'

export default {
    name: 'spell',
    title: 'Spell',
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
            name: 'level',
            title: 'Level',
            type: 'number',
            validation: (Rule: any) => Rule.required().min(0).max(9),
        },
        {
            name: 'school',
            title: 'School',
            type: 'reference',
            to: [{ type: 'magicSchool' }],
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'castingTime',
            title: 'Casting Time',
            type: 'string',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'range',
            title: 'Range',
            type: 'string',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'components',
            title: 'Components',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'Verbal (V)', value: 'V' },
                    { title: 'Somatic (S)', value: 'S' },
                    { title: 'Material (M)', value: 'M' },
                ],
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'materialCost',
            title: 'Material Component Details',
            type: 'text',
            rows: 2,
            hidden: ({ parent }: any) => !parent?.components?.includes('M'),
            description: 'Visible only when "Material (M)" is checked in components.',
        },
        {
            name: 'duration',
            title: 'Duration',
            type: 'string',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'concentration',
            title: 'Concentration',
            type: 'boolean',
            initialValue: false,
        },
        {
            name: 'ritual',
            title: 'Ritual',
            type: 'boolean',
            initialValue: false,
        },
        {
            name: 'description',
            title: 'Description',
            type: 'array',
            of: [{ type: 'block' }],
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
            name: 'higherLevels',
            title: 'At Higher Levels',
            type: 'text',
        },
        {
            name: 'classes',
            title: 'Classes',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'IDs of classes that can cast this spell',
        },
        sourceField,
        editionField,
        versionField,
        rulesetField,
        isHomebrewField,
        versionNotesField,
    ],
}
