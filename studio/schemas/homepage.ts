import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'homepage',
    title: 'Homepage',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Hero Title (Deprecated)',
            type: 'string',
            description: 'Deprecated. Use Hero Title Line 1 and 2 instead.',
            hidden: true,
            validation: Rule => Rule.warning('This field is deprecated.')
        }),
        defineField({
            name: 'heroTitleLine1',
            title: 'Hero Title Line 1',
            type: 'object',
            fields: [
                defineField({ name: 'text', type: 'string', title: 'Text' }),
                defineField({ name: 'fontSize', type: 'string', title: 'Font Size (e.g. 7xl)', initialValue: '7xl' }),
                defineField({ name: 'letterSpacing', type: 'string', title: 'Letter Spacing', initialValue: 'normal' }),
                defineField({
                    name: 'style',
                    type: 'string',
                    title: 'Style',
                    options: {
                        list: [
                            { title: 'Default (Cream/White)', value: 'default' },
                            { title: 'Glow (Amber)', value: 'glow' },
                            { title: 'Gradient (Amber/Orange)', value: 'gradient' }
                        ]
                    },
                    initialValue: 'glow'
                }),
            ]
        }),
        defineField({
            name: 'heroTitleLine2',
            title: 'Hero Title Line 2',
            type: 'object',
            fields: [
                defineField({ name: 'text', type: 'string', title: 'Text' }),
                defineField({ name: 'fontSize', type: 'string', title: 'Font Size (e.g. 9xl)', initialValue: '9xl' }),
                defineField({ name: 'letterSpacing', type: 'string', title: 'Letter Spacing', initialValue: 'normal' }),
                defineField({
                    name: 'style',
                    type: 'string',
                    title: 'Style',
                    options: {
                        list: [
                            { title: 'Default (Cream/White)', value: 'default' },
                            { title: 'Glow (Amber)', value: 'glow' },
                            { title: 'Gradient (Amber/Orange)', value: 'gradient' }
                        ]
                    },
                    initialValue: 'gradient'
                }),
            ]
        }),
        defineField({
            name: 'subtitle',
            title: 'Hero Subtitle',
            type: 'text',
            description: 'The subtitle or description displayed below the title',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'heroImage',
            title: 'Hero Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'footer',
            title: 'Footer',
            type: 'object',
            fields: [
                defineField({
                    name: 'text',
                    title: 'Left Text',
                    type: 'string',
                    description: 'e.g. "Educational Demo"'
                }),
                defineField({
                    name: 'disclaimer',
                    title: 'Middle Text (Disclaimer)',
                    type: 'string',
                    description: 'e.g. "Not affiliated with..."'
                }),
                defineField({
                    name: 'credits',
                    title: 'Right Text (Credits)',
                    type: 'string',
                    description: 'e.g. "Powered by React & Tailwind"'
                }),
            ]
        }),
        defineField({
            name: 'features',
            title: 'Features',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({ name: 'title', type: 'string', title: 'Feature Title' }),
                        defineField({ name: 'description', type: 'text', title: 'Feature Description' }),
                        defineField({
                            name: 'icon',
                            type: 'string',
                            title: 'Icon Name',
                            description: 'Lucide icon name (e.g., "BookOpen", "Wand2")'
                        }),
                    ]
                }
            ]
        })
    ],
    preview: {
        select: {
            title: 'title',
        },
        prepare(selection) {
            return { ...selection, title: 'Homepage Content' }
        }
    }
})
