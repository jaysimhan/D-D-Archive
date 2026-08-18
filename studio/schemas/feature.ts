import { rulesetField, rulesetsField, isHomebrewField, versionNotesField } from './common/source'

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
        rulesetsField,
        rulesetField,
        isHomebrewField,
        versionNotesField,
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'acquiredAtLevel',
            rulesets: 'rulesets',
        },
        prepare(selection: any) {
            const { title, subtitle, rulesets } = selection
            return {
                title,
                subtitle: `Lvl ${subtitle || 1} | ${rulesets?.length === 2 ? '2014 + 2024' : `${rulesets?.length || 0} ruleset${rulesets?.length === 1 ? '' : 's'}`}`,
            }
        },
    },
}
