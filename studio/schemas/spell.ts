import { sourceField, editionField, versionField } from './common/source'

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
            type: 'string',
            options: {
                list: [
                    'Abjuration', 'Conjuration', 'Divination', 'Enchantment',
                    'Evocation', 'Illusion', 'Necromancy', 'Transmutation'
                ],
            },
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
            type: 'object',
            fields: [
                { name: 'verbal', title: 'Verbal', type: 'boolean', initialValue: false },
                { name: 'somatic', title: 'Somatic', type: 'boolean', initialValue: false },
                { name: 'material', title: 'Material', type: 'boolean', initialValue: false },
                { name: 'materialDescription', title: 'Material Description', type: 'string' },
            ],
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
    ],
}
