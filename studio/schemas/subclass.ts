import { sourceField, editionField, versionField } from './common/source'

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
            title: 'Parent Class ID',
            type: 'string',
            description: 'ID of the parent class (e.g., "wizard", "fighter")',
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
            name: 'proficiencies',
            title: 'Additional Proficiencies',
            type: 'array',
            of: [{ type: 'proficiencyRule' }],
            description: 'Proficiencies granted by this subclass (e.g. Hexblade armor).',
        },
        {
            name: 'spells',
            title: 'Additional Spells',
            type: 'array',
            of: [{ type: 'spellGrant' }],
            description: 'Spells granted by this subclass (e.g. Domain spells).',
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
            of: [
                {
                    type: 'object',
                    name: 'subclassFeature',
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
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'parentClassId',
        },
        prepare(selection: any) {
            const { title, subtitle } = selection;
            return {
                title: title,
                subtitle: `${subtitle ? subtitle.charAt(0).toUpperCase() + subtitle.slice(1) : 'Unknown'} Subclass`,
            };
        },
    },
}
