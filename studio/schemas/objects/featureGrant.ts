export const featureGrant = {
    name: 'featureGrant',
    title: 'Feature Grant',
    type: 'object',
    fields: [
        {
            name: 'grantType',
            title: 'Grant Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Specific Spell', value: 'Specific Spell' },
                    { title: 'Spell Slot', value: 'Spell Slot' },
                    { title: 'Resource Pool', value: 'Resource Pool' },
                ],
            },
            validation: (Rule: any) => Rule.required(),
        },
        // Specific Spell fields
        {
            name: 'grantedSpell',
            title: 'Granted Spell',
            type: 'reference',
            to: [{ type: 'spell' }],
            hidden: ({ parent }: any) => parent?.grantType !== 'Specific Spell',
        },
        // Spell Slot fields
        {
            name: 'slotLevel',
            title: 'Slot Level',
            type: 'number',
            validation: (Rule: any) => Rule.min(1).max(9),
            hidden: ({ parent }: any) => parent?.grantType !== 'Spell Slot',
        },
        {
            name: 'slotCount',
            title: 'Slot Count',
            type: 'number',
            initialValue: 1,
            validation: (Rule: any) => Rule.min(1),
            hidden: ({ parent }: any) => parent?.grantType !== 'Spell Slot',
        },
        {
            name: 'schoolRestriction',
            title: 'School Restriction',
            type: 'reference',
            to: [{ type: 'magicSchool' }],
            hidden: ({ parent }: any) => parent?.grantType !== 'Spell Slot',
            description: 'Optional school restriction (e.g. Illusion only)',
        },
        // Resource Pool fields
        {
            name: 'resourceName',
            title: 'Resource Name',
            type: 'string',
            placeholder: 'e.g. Sorcery Points, Ki Points',
            hidden: ({ parent }: any) => parent?.grantType !== 'Resource Pool',
        },
        {
            name: 'maxAmount',
            title: 'Max Amount',
            type: 'number',
            validation: (Rule: any) => Rule.min(1),
            hidden: ({ parent }: any) => parent?.grantType !== 'Resource Pool',
        },
        {
            name: 'resetCondition',
            title: 'Reset Condition',
            type: 'string',
            options: {
                list: [
                    { title: 'Short Rest', value: 'Short Rest' },
                    { title: 'Long Rest', value: 'Long Rest' },
                    { title: 'Dawn', value: 'Dawn' },
                ],
            },
            hidden: ({ parent }: any) => parent?.grantType !== 'Resource Pool',
        },
    ],
    preview: {
        select: {
            grantType: 'grantType',
            spellName: 'grantedSpell.name',
            slotLevel: 'slotLevel',
            slotCount: 'slotCount',
            resourceName: 'resourceName',
            maxAmount: 'maxAmount',
        },
        prepare(selection: any) {
            const { grantType, spellName, slotLevel, slotCount, resourceName, maxAmount } = selection
            let title = `Grant: ${grantType}`
            let subtitle = ''

            if (grantType === 'Specific Spell') {
                title = `Spell: ${spellName || 'None'}`
            } else if (grantType === 'Spell Slot') {
                title = `Slots: ${slotCount || 1}x Lvl ${slotLevel || 1}`
            } else if (grantType === 'Resource Pool') {
                title = `Resource: ${resourceName || 'Unnamed'}`
                subtitle = `Max: ${maxAmount || 0}`
            }

            return {
                title,
                subtitle: subtitle || grantType,
            }
        },
    },
}
