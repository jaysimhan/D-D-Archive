import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'homepage',
    title: 'Homepage',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Hero Title',
            type: 'string',
            description: 'The main title displayed in the hero section',
            validation: Rule => Rule.required()
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
