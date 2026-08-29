import { sourceField, sourceBookField, isCoreField, rulesetField, rulesetsField, isHomebrewField, versionNotesField } from './common/source'

export default {
    name: 'species',
    title: 'Species',
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
            options: {
                hotspot: true,
            },
        },
        sourceField,
        sourceBookField,
        isCoreField,
        rulesetsField,
        rulesetField,
        isHomebrewField,
        versionNotesField,
        {
            name: 'size',
            title: 'Size',
            type: 'string',
            options: {
                list: [
                    { title: 'Tiny', value: 'Tiny' },
                    { title: 'Small', value: 'Small' },
                    { title: 'Medium', value: 'Medium' },
                    { title: 'Large', value: 'Large' },
                ],
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'speed',
            title: 'Speed (ft)',
            type: 'number',
            validation: (Rule: any) => Rule.required().min(0),
        },
        {
            name: 'darkvision',
            title: 'Darkvision Range (ft)',
            type: 'number',
            initialValue: 0,
            validation: (Rule: any) => Rule.min(0),
        },
        {
            name: 'traits',
            title: 'Species Traits',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'speciesTrait',
                    title: 'Species Trait',
                    fields: [
                        { name: 'name', title: 'Name', type: 'string', validation: (Rule: any) => Rule.required() },
                        { name: 'description', title: 'Description', type: 'text', validation: (Rule: any) => Rule.required() },
                        {
                            name: 'type',
                            title: 'Type',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Speed', value: 'Speed' },
                                    { title: 'Darkvision', value: 'Darkvision' },
                                    { title: 'Action', value: 'Action' },
                                    { title: 'Passive', value: 'Passive' },
                                ],
                            },
                            initialValue: 'Passive',
                        },
                    ],
                },
            ],
            description: 'Define speeds, darkvision, and unique biological actions for this species.',
        },
        {
            name: 'grants',
            title: 'Feature Grants',
            type: 'array',
            of: [{ type: 'featureGrant' }],
            description: 'Define specific spell, slot, or pool benefits granted by this species.',
        },
    ],
    preview: {
        select: {
            title: 'name',
            rulesets: 'rulesets',
        },
        prepare(selection: any) {
            const { title, rulesets } = selection
            return {
                title,
                subtitle: `Species | ${rulesets?.length === 2 ? '2014 + 2024' : `${rulesets?.length || 0} ruleset${rulesets?.length === 1 ? '' : 's'}`}`,
            }
        },
    },
}
