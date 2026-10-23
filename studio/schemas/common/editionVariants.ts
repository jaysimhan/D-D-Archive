/** Reuse each document's real fields, including structured mechanics and refs.
 * Missing override fields inherit the shared value; arrays/objects replace it. */
export function withEditionVariants<T extends { name?: string; fields: any[] }>(schema: T): T {
    // The archive uses the same subclass in both editions by owner policy.
    if (schema.name === 'subclass') return schema;
    const shared = new Set(['name', 'slug', 'image', 'source', 'sourceBook', 'edition', 'version', 'rulesets', 'ruleset', 'isHomebrew', 'isCore', 'versionNotes', 'subclasses', 'parentClass', 'parentClassId']);
    const fields = schema.fields.filter(field => !shared.has(field.name)).map(field => ({
        ...field,
        validation: undefined,
        initialValue: undefined,
    }));
    return { ...schema, fields: [...schema.fields,
        {
            name: 'sameForBoth', title: 'Both are the same (2014 and 2024)', type: 'boolean', initialValue: false,
            description: 'Enable only after checking that description AND mechanics are identical. Shared fields above are used when enabled. When disabled, edition fields below override shared fields; omitted fields inherit them.',
        },
        ...(['2014', '2024'] as const).map(year => ({
            name: `rules${year}`, title: `${year} Description and Mechanics`, type: 'object',
            hidden: ({ document }: any) => document?.sameForBoth === true,
            fields,
        })),
    ] };
}
