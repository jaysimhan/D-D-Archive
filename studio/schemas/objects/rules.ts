export const proficiencyRule = {
    name: 'proficiencyRule',
    title: 'Proficiency Rule',
    type: 'object',
    fields: [
        {
            name: 'type',
            title: 'Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Skill', value: 'skill' },
                    { title: 'Tool', value: 'tool' },
                    { title: 'Language', value: 'language' },
                    { title: 'Armor', value: 'armor' },
                    { title: 'Weapon', value: 'weapon' },
                    { title: 'Saving Throw', value: 'savingThrow' },
                ],
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'mode',
            title: 'Selection Mode',
            type: 'string',
            options: {
                list: [
                    { title: 'Fixed (Specific Options)', value: 'fixed' },
                    { title: 'Choice (Pick N from List)', value: 'choice' },
                ],
            },
            initialValue: 'fixed',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'count',
            title: 'Number to Choose',
            type: 'number',
            hidden: ({ parent }: any) => parent?.mode !== 'choice',
            initialValue: 1,
            validation: (Rule: any) => Rule.min(1),
        },
        {
            name: 'options',
            title: 'Options / Fixed Values',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'List of specific valid options (e.g. "Acrobatics", "Light Armor"). Leave empty for "Any".',
        },
        {
            name: 'description',
            title: 'Description',
            type: 'string',
            description: 'Optional override for display text (e.g. "Any artisan\'s tool")',
        },
    ],
    preview: {
        select: {
            type: 'type',
            mode: 'mode',
            count: 'count',
            options: 'options',
        },
        prepare(selection: any) {
            const { type, mode, count, options } = selection;
            const subtype = options && options.length > 0
                ? (options.length > 3 ? `${options.slice(0, 3).join(', ')}...` : options.join(', '))
                : 'Any';

            return {
                title: `${type} Proficiency`,
                subtitle: mode === 'fixed' ? `Fixed: ${subtype}` : `Choose ${count || 1}: ${subtype}`,
            };
        },
    },
};

export const spellGrant = {
    name: 'spellGrant',
    title: 'Spell Grant',
    type: 'object',
    fields: [
        {
            name: 'name',
            title: 'Name / Feature Source',
            type: 'string',
            description: 'e.g. "Drow Magic", "Ritual Casting"',
        },
        {
            name: 'level',
            title: 'Level Requirement',
            type: 'number',
            description: 'Character level required to use this (default 1)',
            initialValue: 1,
        },
        {
            name: 'mode',
            title: 'Grant Mode',
            type: 'string',
            options: {
                list: [
                    { title: 'Fixed (Specific Spell)', value: 'fixed' },
                    { title: 'Choice (Pick N from List)', value: 'choice' },
                    { title: 'List Access (Unlock Class List)', value: 'access' },
                ],
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'count',
            title: 'Number to Choose',
            type: 'number',
            hidden: ({ parent }: any) => parent?.mode !== 'choice',
            initialValue: 1,
        },
        {
            name: 'spellList',
            title: 'Source List / Class',
            type: 'string',
            description: 'e.g. "wizard", "cleric", "druid". Required for "Access" mode or "Choice" from class list.',
        },
        {
            name: 'specificSpells',
            title: 'Specific Spells',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'spell' }] }],
            hidden: ({ parent }: any) => parent?.mode === 'access',
            description: 'For Fixed mode (the spell you get) or Choice mode (the specific list to pick from).',
        },
        {
            name: 'ability',
            title: 'Spellcasting Ability',
            type: 'string',
            options: {
                list: [
                    { title: 'Intelligence', value: 'INT' },
                    { title: 'Wisdom', value: 'WIS' },
                    { title: 'Charisma', value: 'CHA' },
                    { title: 'Constitution', value: 'CON' },
                ],
            },
        },
        {
            name: 'recharge',
            title: 'Recharge Type',
            type: 'string',
            options: {
                list: [
                    { title: 'At-Will', value: 'at-will' },
                    { title: 'Short Rest', value: 'short-rest' },
                    { title: 'Long Rest', value: 'long-rest' },
                    { title: '1/Day', value: 'day' },
                ],
            },
        },
    ],
    preview: {
        select: {
            name: 'name',
            mode: 'mode',
            level: 'level',
        },
        prepare(selection: any) {
            return {
                title: selection.name || 'Spell Grant',
                subtitle: `Lvl ${selection.level || 1} - ${selection.mode}`,
            };
        },
    },
};
