import { sourceField, editionField, versionField } from './common/source'

export default {
    name: 'trait',
    title: 'Trait',
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
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'Race', value: 'race' },
                    { title: 'Class', value: 'class' },
                    { title: 'Subclass', value: 'subclass' },
                    { title: 'Background', value: 'background' },
                ],
            },
            description: 'Categorize this trait for easy filtering in Sanity Studio',
            validation: (Rule: any) => Rule.required().min(1),
        },
        {
            name: 'level',
            title: 'Level Requirement',
            type: 'number',
            description: 'Character level required to gain this trait (for class/subclass features)',
            initialValue: 1,
        },
        sourceField,
        editionField,
        versionField,
    ],
    orderings: [
        {
            title: 'Name',
            name: 'nameAsc',
            by: [{ field: 'name', direction: 'asc' }],
        },
        {
            title: 'Level',
            name: 'levelAsc',
            by: [{ field: 'level', direction: 'asc' }],
        },
    ],
    preview: {
        select: {
            title: 'name',
            tags: 'tags',
            level: 'level',
        },
        prepare(selection: any) {
            const { title, tags, level } = selection;
            const tagDisplay = tags?.length > 0 ? tags.join(', ') : 'No tags';
            return {
                title: title,
                subtitle: `${tagDisplay}${level > 1 ? ` | Lvl ${level}` : ''}`,
            };
        },
    },
}
