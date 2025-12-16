// Standard D&D 5e Lists
const SKILLS = [
    'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception',
    'History', 'Insight', 'Intimidation', 'Investigation', 'Medicine',
    'Nature', 'Perception', 'Performance', 'Persuasion', 'Religion',
    'Sleight of Hand', 'Stealth', 'Survival'
];

const LANGUAGES = [
    'Common', 'Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin', 'Halfling', 'Orc',
    'Abyssal', 'Celestial', 'Draconic', 'Deep Speech', 'Infernal', 'Primordial', 'Sylvan', 'Undercommon'
];

const TOOLS = [
    // Artisan's Tools
    "Alchemist's supplies", "Brewer's supplies", "Calligrapher's supplies", "Carpenter's tools",
    "Cartographer's tools", "Cobbler's tools", "Cook's utensils", "Glassblower's tools",
    "Jeweler's tools", "Leatherworker's tools", "Mason's tools", "Painter's supplies",
    "Potter's tools", "Smith's tools", "Tinker's tools", "Weaver's tools", "Woodcarver's tools",
    // Gaming Sets
    "Dice set", "Dragonchess set", "Playing card set", "Three-Dragon Ante set",
    // Musical Instruments
    "Bagpipes", "Drum", "Dulcimer", "Flute", "Lute", "Lyre", "Horn", "Pan flute", "Shawm", "Viol",
    // Other
    "Disguise kit", "Forgery kit", "Herbalism kit", "Navigator's tools", "Poisoner's kit", "Thieves' tools"
];

const ARMOR = ['Light Armor', 'Medium Armor', 'Heavy Armor', 'Shields'];

const WEAPONS = ['Simple Weapons', 'Martial Weapons', 'Club', 'Dagger', 'Greatclub', 'Handaxe', 'Javelin', 'Light Hammer', 'Mace', 'Quarterstaff', 'Sickle', 'Spear', 'Light Crossbow', 'Dart', 'Shortbow', 'Sling', 'Battleaxe', 'Flail', 'Glaive', 'Greataxe', 'Greatsword', 'Halberd', 'Lance', 'Longsword', 'Maul', 'Morningstar', 'Pike', 'Rapier', 'Scimitar', 'Shortsword', 'Trident', 'War Pick', 'Warhammer', 'Whip', 'Blowgun', 'Hand Crossbow', 'Heavy Crossbow', 'Longbow', 'Net'];

const CLASS_SPELL_LISTS = [
    'Artificer', 'Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Warlock', 'Wizard'
];

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
        // Conditional Lists
        {
            name: 'skillOptions',
            title: 'Skills',
            type: 'array',
            of: [{ type: 'string' }],
            options: { list: SKILLS },
            hidden: ({ parent }: any) => parent?.type !== 'skill',
        },
        {
            name: 'toolOptions',
            title: 'Tools',
            type: 'array',
            of: [{ type: 'string' }],
            options: { list: TOOLS },
            hidden: ({ parent }: any) => parent?.type !== 'tool',
        },
        {
            name: 'languageOptions',
            title: 'Languages',
            type: 'array',
            of: [{ type: 'string' }],
            options: { list: LANGUAGES },
            hidden: ({ parent }: any) => parent?.type !== 'language',
        },
        {
            name: 'armorOptions',
            title: 'Armor',
            type: 'array',
            of: [{ type: 'string' }],
            options: { list: ARMOR },
            hidden: ({ parent }: any) => parent?.type !== 'armor',
        },
        {
            name: 'weaponOptions',
            title: 'Weapons',
            type: 'array',
            of: [{ type: 'string' }],
            options: { list: WEAPONS },
            hidden: ({ parent }: any) => parent?.type !== 'weapon',
        },
        // Fallback for custom/other
        {
            name: 'options',
            title: 'Custom Options',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Use valid IDs/Names. Only use if the dropdowns above are insufficient.',
            hidden: ({ parent }: any) => ['skill', 'tool', 'language', 'armor', 'weapon'].includes(parent?.type),
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
            skill: 'skillOptions',
            tool: 'toolOptions',
            lang: 'languageOptions',
            armor: 'armorOptions',
            weapon: 'weaponOptions',
            other: 'options',
        },
        prepare(selection: any) {
            const { type, mode, count, skill, tool, lang, armor, weapon, other } = selection;
            const options = skill || tool || lang || armor || weapon || other || [];

            const subtype = options.length > 0
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
            options: {
                list: CLASS_SPELL_LISTS,
            },
            description: 'Required for "Access" mode or "Choice" from class list.',
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
        {
            name: 'spellLevel',
            title: 'Spell Level (for Choices)',
            type: 'number',
            description: '0 for Cantrip, 1-9 for leveled spells. Used when "spellList" is set.',
            initialValue: 0,
        },
        {
            name: 'notes',
            title: 'Notes / Description',
            type: 'text',
            rows: 3,
            description: 'Specific details (e.g. "Healing Hands variant", "No components required").',
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
