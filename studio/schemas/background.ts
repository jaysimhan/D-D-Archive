import { sourceField, editionField, versionField } from './common/source'

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
        sourceField,
        editionField,
        versionField,
        {
            name: 'traits',
            title: 'Traits',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'trait' }] }],
            description: 'Reference traits from the centralized Trait library',
        },
    ],
}
