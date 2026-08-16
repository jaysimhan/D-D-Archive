export default {
    name: 'character',
    title: 'Character Sheet',
    type: 'document',
    groups: [
        { name: 'identity', title: 'Identity' },
        { name: 'stats', title: 'Stats' },
        { name: 'progression', title: 'Progression' },
        { name: 'combatSpells', title: 'Combat & Spells' },
        { name: 'inventory', title: 'Inventory' },
    ],
    fieldsets: [
        {
            name: 'abilityScores',
            title: 'Ability Scores',
            options: {
                collapsible: true,
                collapsed: false,
                columns: 2,
            },
        },
        {
            name: 'deathSaves',
            title: 'Death Saves',
            options: {
                collapsible: true,
                collapsed: true,
            },
        },
        {
            name: 'currency',
            title: 'Currency',
            options: {
                collapsible: true,
                collapsed: true,
                columns: 5,
            },
        },
    ],
    fields: [
        // IDENTITY
        {
            name: 'name',
            title: 'Name',
            type: 'string',
            group: 'identity',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'avatar',
            title: 'Avatar Image',
            type: 'image',
            group: 'identity',
            options: { hotspot: true },
        },
        {
            name: 'alignment',
            title: 'Alignment',
            type: 'string',
            group: 'identity',
            options: {
                list: [
                    'Lawful Good', 'Neutral Good', 'Chaotic Good',
                    'Lawful Neutral', 'True Neutral', 'Chaotic Neutral',
                    'Lawful Evil', 'Neutral Evil', 'Chaotic Evil',
                ],
            },
        },
        {
            name: 'species',
            title: 'Species / Race',
            type: 'reference',
            to: [{ type: 'species' }, { type: 'race' }],
            group: 'identity',
            description: 'Link to character biological species (2024) or race (2014)',
        },
        {
            name: 'background',
            title: 'Background',
            type: 'reference',
            to: [{ type: 'background' }],
            group: 'identity',
        },

        // STATS
        {
            name: 'strength',
            title: 'Strength',
            type: 'number',
            fieldset: 'abilityScores',
            group: 'stats',
            validation: (Rule: any) => Rule.required().min(1).max(30),
        },
        {
            name: 'dexterity',
            title: 'Dexterity',
            type: 'number',
            fieldset: 'abilityScores',
            group: 'stats',
            validation: (Rule: any) => Rule.required().min(1).max(30),
        },
        {
            name: 'constitution',
            title: 'Constitution',
            type: 'number',
            fieldset: 'abilityScores',
            group: 'stats',
            validation: (Rule: any) => Rule.required().min(1).max(30),
        },
        {
            name: 'intelligence',
            title: 'Intelligence',
            type: 'number',
            fieldset: 'abilityScores',
            group: 'stats',
            validation: (Rule: any) => Rule.required().min(1).max(30),
        },
        {
            name: 'wisdom',
            title: 'Wisdom',
            type: 'number',
            fieldset: 'abilityScores',
            group: 'stats',
            validation: (Rule: any) => Rule.required().min(1).max(30),
        },
        {
            name: 'charisma',
            title: 'Charisma',
            type: 'number',
            fieldset: 'abilityScores',
            group: 'stats',
            validation: (Rule: any) => Rule.required().min(1).max(30),
        },
        {
            name: 'hitPoints',
            title: 'Hit Points',
            type: 'object',
            group: 'stats',
            fields: [
                { name: 'current', title: 'Current HP', type: 'number', validation: (Rule: any) => Rule.required().min(0) },
                { name: 'max', title: 'Max HP', type: 'number', validation: (Rule: any) => Rule.required().min(1) },
                { name: 'temporary', title: 'Temporary HP', type: 'number', initialValue: 0 },
            ],
        },
        {
            name: 'armorClass',
            title: 'Armor Class',
            type: 'number',
            group: 'stats',
            validation: (Rule: any) => Rule.required().min(1),
        },
        {
            name: 'speed',
            title: 'Movement Speed (ft)',
            type: 'number',
            group: 'stats',
            validation: (Rule: any) => Rule.required().min(0),
        },
        {
            name: 'deathSaveSuccesses',
            title: 'Successes',
            type: 'number',
            fieldset: 'deathSaves',
            group: 'stats',
            validation: (Rule: any) => Rule.min(0).max(3),
            initialValue: 0,
        },
        {
            name: 'deathSaveFailures',
            title: 'Failures',
            type: 'number',
            fieldset: 'deathSaves',
            group: 'stats',
            validation: (Rule: any) => Rule.min(0).max(3),
            initialValue: 0,
        },

        // PROGRESSION
        {
            name: 'progression',
            title: 'Class Progression',
            type: 'array',
            group: 'progression',
            description: 'Add class and subclass details to support multiclassing.',
            of: [
                {
                    type: 'object',
                    name: 'classLevel',
                    title: 'Class & Level',
                    fields: [
                        {
                            name: 'classRef',
                            title: 'Class',
                            type: 'reference',
                            to: [{ type: 'class' }],
                            validation: (Rule: any) => Rule.required(),
                        },
                        {
                            name: 'subclassRef',
                            title: 'Subclass',
                            type: 'reference',
                            to: [{ type: 'subclass' }],
                        },
                        {
                            name: 'level',
                            title: 'Level',
                            type: 'number',
                            initialValue: 1,
                            validation: (Rule: any) => Rule.required().min(1).max(20).integer(),
                        },
                    ],
                    preview: {
                        select: {
                            className: 'classRef.name',
                            subclassName: 'subclassRef.name',
                            level: 'level',
                        },
                        prepare(selection: any) {
                            const { className, subclassName, level } = selection
                            return {
                                title: `${className || 'Unnamed Class'} (Level ${level})`,
                                subtitle: subclassName ? `Subclass: ${subclassName}` : 'No subclass chosen yet',
                            }
                        },
                    },
                },
            ],
        },
        {
            name: 'experiencePoints',
            title: 'Experience Points',
            type: 'number',
            group: 'progression',
            initialValue: 0,
            validation: (Rule: any) => Rule.min(0),
        },

        // COMBAT & SPELLS
        {
            name: 'equippedItems',
            title: 'Equipped Items',
            type: 'array',
            group: 'combatSpells',
            of: [{ type: 'reference', to: [{ type: 'item' }] }],
        },
        {
            name: 'spellbook',
            title: 'Inscribed Spells',
            type: 'array',
            group: 'combatSpells',
            of: [{ type: 'reference', to: [{ type: 'spell' }] }],
        },
        {
            name: 'spellSlots',
            title: 'Expended Spell Slots',
            type: 'array',
            group: 'combatSpells',
            of: [
                {
                    type: 'object',
                    name: 'slotState',
                    title: 'Slot State',
                    fields: [
                        { name: 'level', title: 'Spell Level', type: 'number', validation: (Rule: any) => Rule.required().min(1).max(9) },
                        { name: 'max', title: 'Total Slots', type: 'number', validation: (Rule: any) => Rule.required().min(0) },
                        { name: 'expended', title: 'Expended Slots', type: 'number', validation: (Rule: any) => Rule.required().min(0) },
                    ],
                    preview: {
                        select: {
                            level: 'level',
                            max: 'max',
                            expended: 'expended',
                        },
                        prepare(selection: any) {
                            const { level, max, expended } = selection
                            return {
                                title: `Level ${level} Slots`,
                                subtitle: `Used: ${expended || 0} / Total: ${max || 0}`,
                            }
                        },
                    },
                },
            ],
        },
        {
            name: 'resourcePools',
            title: 'Resource Pools (Ki, Sorcery Points, etc.)',
            type: 'array',
            group: 'combatSpells',
            of: [
                {
                    type: 'object',
                    name: 'resourceState',
                    title: 'Resource State',
                    fields: [
                        { name: 'name', title: 'Resource Name', type: 'string', validation: (Rule: any) => Rule.required() },
                        { name: 'max', title: 'Max Amount', type: 'number', validation: (Rule: any) => Rule.required().min(0) },
                        { name: 'current', title: 'Current Amount', type: 'number', validation: (Rule: any) => Rule.required().min(0) },
                    ],
                    preview: {
                        select: {
                            name: 'name',
                            max: 'max',
                            current: 'current',
                        },
                        prepare(selection: any) {
                            const { name, max, current } = selection
                            return {
                                title: name,
                                subtitle: `${current || 0} / ${max || 0} remaining`,
                            }
                        },
                    },
                },
            ],
        },

        // INVENTORY
        {
            name: 'inventory',
            title: 'Inventory',
            type: 'array',
            group: 'inventory',
            of: [
                {
                    type: 'object',
                    name: 'inventoryItem',
                    title: 'Inventory Item',
                    fields: [
                        {
                            name: 'item',
                            title: 'Canonical Item',
                            type: 'reference',
                            to: [{ type: 'item' }],
                            validation: (Rule: any) => Rule.required(),
                        },
                        {
                            name: 'quantity',
                            title: 'Quantity',
                            type: 'number',
                            initialValue: 1,
                            validation: (Rule: any) => Rule.required().min(1),
                        },
                        {
                            name: 'isEquipped',
                            title: 'Equipped?',
                            type: 'boolean',
                            initialValue: false,
                        },
                        {
                            name: 'customName',
                            title: 'Custom Name (e.g. Orc-Cleaver)',
                            type: 'string',
                        },
                    ],
                    preview: {
                        select: {
                            itemName: 'item.name',
                            quantity: 'quantity',
                            isEquipped: 'isEquipped',
                            customName: 'customName',
                        },
                        prepare(selection: any) {
                            const { itemName, quantity, isEquipped, customName } = selection
                            const name = customName || itemName || 'Unnamed Item'
                            return {
                                title: `${name} (x${quantity})`,
                                subtitle: isEquipped ? '🛡️ Equipped' : '🎒 Carried',
                            }
                        },
                    },
                },
            ],
        },
        // Currency
        {
            name: 'cp',
            title: 'Copper (cp)',
            type: 'number',
            fieldset: 'currency',
            group: 'inventory',
            initialValue: 0,
            validation: (Rule: any) => Rule.min(0),
        },
        {
            name: 'sp',
            title: 'Silver (sp)',
            type: 'number',
            fieldset: 'currency',
            group: 'inventory',
            initialValue: 0,
            validation: (Rule: any) => Rule.min(0),
        },
        {
            name: 'ep',
            title: 'Electrum (ep)',
            type: 'number',
            fieldset: 'currency',
            group: 'inventory',
            initialValue: 0,
            validation: (Rule: any) => Rule.min(0),
        },
        {
            name: 'gp',
            title: 'Gold (gp)',
            type: 'number',
            fieldset: 'currency',
            group: 'inventory',
            initialValue: 0,
            validation: (Rule: any) => Rule.min(0),
        },
        {
            name: 'pp',
            title: 'Platinum (pp)',
            type: 'number',
            fieldset: 'currency',
            group: 'inventory',
            initialValue: 0,
            validation: (Rule: any) => Rule.min(0),
        },
    ],
    preview: {
        select: {
            title: 'name',
            speciesName: 'species.name',
            avatar: 'avatar',
        },
        prepare(selection: any) {
            const { title, speciesName, avatar } = selection
            return {
                title: title || 'Unnamed Character',
                subtitle: speciesName ? `Species: ${speciesName}` : 'No species/race',
                media: avatar,
            }
        },
    },
}
