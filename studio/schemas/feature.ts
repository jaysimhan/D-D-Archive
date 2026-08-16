import { rulesetField, isHomebrewField, versionNotesField } from './common/source'

export default {
    name: 'feature',
    title: 'Feature',
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
            name: 'acquiredAtLevel',
            title: 'Acquired At Level',
            type: 'number',
            validation: (Rule: any) => Rule.required().min(1).max(20).integer(),
        },
        {
            name: 'replacementFeature',
            title: 'Replacement Feature',
            type: 'reference',
            to: [{ type: 'feature' }],
            description: 'For handling 2024 revisions of 2014 features. Points to the feature this replaces or revision of this feature.',
        },
        rulesetField,
        isHomebrewField,
        versionNotesField,
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'acquiredAtLevel',
            ruleset: 'ruleset.name',
        },
        prepare(selection: any) {
            const { title, subtitle, ruleset } = selection
            return {
                title,
                subtitle: `Lvl ${subtitle || 1} | Ruleset: ${ruleset || 'Generic'}`,
            }
        },
    },
}
