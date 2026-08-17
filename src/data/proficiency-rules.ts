/**
 * The rules behind the creator's Proficiencies & Languages step.
 *
 * A character never picks proficiencies from a pool of points: every skill,
 * tool, language, armour and weapon proficiency is handed out by a species,
 * class, subclass, background or feat — some fixed, some as "choose N from
 * this list". Expertise is rarer still, and only a handful of features grant
 * it. This file records those grants; `utils/proficiency-plan.ts` turns them
 * into the list of things a particular character is given and still has to
 * choose.
 *
 * The Archive's own documents come first wherever they carry the data: a class
 * or species with a `proficiencies` rule array in Sanity is read straight from
 * there. These tables cover the official classes and subclasses, whose
 * documents record features but not their proficiency lines, and follow the
 * 2024 Player's Handbook — the edition nearly every official class document in
 * the Archive is tagged with. Where the 2024 and 2014 kits differ the comment
 * says so.
 */

// ===== Skills =====

export const SKILLS = [
    "Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History",
    "Insight", "Intimidation", "Investigation", "Medicine", "Nature", "Perception",
    "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival",
] as const;

export type AbilityKey = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";

/** The skills of each ability, in the order the step lists them. */
export const SKILL_GROUPS: { ability: AbilityKey; label: string; skills: string[] }[] = [
    { ability: "STR", label: "Strength", skills: ["Athletics"] },
    { ability: "DEX", label: "Dexterity", skills: ["Acrobatics", "Sleight of Hand", "Stealth"] },
    { ability: "INT", label: "Intelligence", skills: ["Arcana", "History", "Investigation", "Nature", "Religion"] },
    { ability: "WIS", label: "Wisdom", skills: ["Animal Handling", "Insight", "Medicine", "Perception", "Survival"] },
    { ability: "CHA", label: "Charisma", skills: ["Deception", "Intimidation", "Performance", "Persuasion"] },
];

/** Every skill an "academic" feature will accept, used by the wizard's Scholar. */
const ACADEMIC_SKILLS = ["Arcana", "History", "Investigation", "Medicine", "Nature", "Religion"];

// ===== Languages =====

/** The Standard Languages table: free to pick whenever a feature grants one. */
export const STANDARD_LANGUAGES = [
    "Common", "Common Sign Language", "Draconic", "Dwarvish", "Elvish", "Giant",
    "Gnomish", "Goblin", "Halfling", "Orc",
];

/**
 * The Rare Languages table. The Handbook hands these out through features
 * rather than free choice, so the step offers them separately.
 */
export const RARE_LANGUAGES = [
    "Abyssal", "Aquan", "Auran", "Celestial", "Deep Speech", "Ignan", "Infernal",
    "Primordial", "Sylvan", "Terran", "Undercommon",
];

/**
 * Languages a class alone teaches, kept out of every choice list: no feature
 * lets you simply pick up Druidic or Thieves' Cant.
 */
export const SECRET_LANGUAGES = ["Druidic", "Thieves' Cant"];

/**
 * Species and backgrounds record languages and skills as free text, and some
 * write the choice the rules give them as a placeholder among the fixed entries
 * — "one other", "any one skill". Anything matching this becomes a choice the
 * player makes rather than a proficiency they are handed.
 */
export const CHOICE_PLACEHOLDER = /^(one|two|three)\b|^any\b|of your choice|other language/i;

// ===== Armour, weapons and tools =====

export const ARMOR_CATEGORIES = ["Light Armor", "Medium Armor", "Heavy Armor", "Shields"];

export const WEAPON_CATEGORIES = ["Simple Weapons", "Martial Weapons"];

export const SIMPLE_WEAPONS = [
    "Club", "Dagger", "Dart", "Greatclub", "Handaxe", "Javelin", "Light Crossbow",
    "Light Hammer", "Mace", "Quarterstaff", "Shortbow", "Sickle", "Sling", "Spear",
];

export const MARTIAL_WEAPONS = [
    "Battleaxe", "Blowgun", "Flail", "Glaive", "Greataxe", "Greatsword", "Halberd",
    "Hand Crossbow", "Heavy Crossbow", "Lance", "Longbow", "Longsword", "Maul",
    "Morningstar", "Net", "Pike", "Rapier", "Scimitar", "Shortsword", "Trident",
    "War Pick", "Warhammer", "Whip",
];

/** Martial weapons with the Light property, which is what a monk trains with. */
const LIGHT_MARTIAL_WEAPONS = ["Scimitar", "Shortsword"];

/** Martial weapons with Finesse or Light, which is what a rogue trains with. */
const FINESSE_OR_LIGHT_MARTIAL_WEAPONS = ["Hand Crossbow", "Rapier", "Scimitar", "Shortsword", "Whip"];

/** Melee weapons a single hand can hold, for features that grant one. */
const ONE_HANDED_MELEE_WEAPONS = [
    "Battleaxe", "Club", "Dagger", "Flail", "Handaxe", "Javelin", "Light Hammer",
    "Longsword", "Mace", "Morningstar", "Rapier", "Scimitar", "Shortsword", "Sickle",
    "Spear", "Trident", "War Pick", "Warhammer", "Whip",
];

export const ARTISAN_TOOLS = [
    "Alchemist's Supplies", "Brewer's Supplies", "Calligrapher's Supplies",
    "Carpenter's Tools", "Cartographer's Tools", "Cobbler's Tools", "Cook's Utensils",
    "Glassblower's Tools", "Jeweler's Tools", "Leatherworker's Tools", "Mason's Tools",
    "Painter's Supplies", "Potter's Tools", "Smith's Tools", "Tinker's Tools",
    "Weaver's Tools", "Woodcarver's Tools",
];

export const MUSICAL_INSTRUMENTS = [
    "Bagpipes", "Drum", "Dulcimer", "Flute", "Horn", "Lute", "Lyre", "Pan Flute",
    "Shawm", "Viol",
];

export const GAMING_SETS = [
    "Dice Set", "Dragonchess Set", "Playing Card Set", "Three-Dragon Ante Set",
];

export const OTHER_TOOLS = [
    "Disguise Kit", "Forgery Kit", "Herbalism Kit", "Navigator's Tools",
    "Poisoner's Kit", "Thieves' Tools", "Vehicles (Land)", "Vehicles (Water)",
];

export const ALL_TOOLS = [
    ...ARTISAN_TOOLS,
    ...MUSICAL_INSTRUMENTS.map((i) => `${i} (Musical Instrument)`),
    ...GAMING_SETS,
    ...OTHER_TOOLS,
].sort((a, b) => a.localeCompare(b));

/** Every name the rules use, for tidying up what documents record. */
const CANONICAL_LOOKUP = new Map<string, string>(
    [
        ...SKILLS,
        ...ARTISAN_TOOLS, ...MUSICAL_INSTRUMENTS, ...GAMING_SETS, ...OTHER_TOOLS,
        ...ARMOR_CATEGORIES, ...WEAPON_CATEGORIES, ...SIMPLE_WEAPONS, ...MARTIAL_WEAPONS,
        ...STANDARD_LANGUAGES, ...RARE_LANGUAGES, ...SECRET_LANGUAGES,
    ].map((name) => [name.toLowerCase(), name]),
);

/**
 * Documents were written by hand over a long time, so the same tool turns up as
 * "Thieves' tools", "Thieves' Tools" and "thieves tools". Names are matched
 * loosely and answered with the spelling the rules use, so a proficiency from a
 * background and the same one from a class are recognised as one.
 */
export function canonicalName(raw: string): string {
    const trimmed = raw.trim();
    if (!trimmed) return trimmed;
    const direct = CANONICAL_LOOKUP.get(trimmed.toLowerCase());
    if (direct) return direct;

    // Fall back to a looser match that ignores apostrophes and punctuation.
    const loose = trimmed.toLowerCase().replace(/[^a-z0-9]/g, "");
    for (const [key, value] of CANONICAL_LOOKUP) {
        if (key.replace(/[^a-z0-9]/g, "") === loose) return value;
    }
    return trimmed;
}

/** The free-text tool choices backgrounds write instead of a single tool. */
export const TOOL_CHOICE_PHRASES: { pattern: RegExp; options: string[]; label: string }[] = [
    { pattern: /artisan'?s?\s+tools?/i, options: ARTISAN_TOOLS, label: "artisan's tools" },
    { pattern: /musical\s+instrument/i, options: MUSICAL_INSTRUMENTS, label: "musical instrument" },
    { pattern: /gaming\s+set/i, options: GAMING_SETS, label: "gaming set" },
];

// ===== Grant shapes =====

export type ChoiceKind =
    | "skill"
    | "tool"
    | "language"
    | "armor"
    | "weapon"
    | "expertise"
    | "skillOrTool";

export interface RuleChoice {
    kind: ChoiceKind;
    count: number;
    /** Left out for "any of that kind". */
    options?: string[];
    /** Names the pool in the step, e.g. "artisan's tools". */
    optionsLabel?: string;
    /**
     * Set on a skill choice whose picks also come with the proficiency bonus
     * doubled — the cleric's Blessings of Knowledge works that way, rather than
     * doubling any two skills the character happens to have.
     */
    withExpertise?: boolean;
    /** An aside for the step, e.g. why this choice exists. */
    note?: string;
}

/** What one source — a class, a subclass, a feat — hands a character. */
export interface RuleGrant {
    skills?: string[];
    tools?: string[];
    languages?: string[];
    armor?: string[];
    weapons?: string[];
    /** Skills whose proficiency bonus this source doubles outright. */
    expertise?: string[];
    choices?: RuleChoice[];
}

export interface LeveledGrant {
    level: number;
    feature: string;
    grant: RuleGrant;
}

export interface ClassRules {
    /** The kit every member of the class starts with. */
    base: RuleGrant;
    /** Features that only arrive at a later level. */
    byLevel?: LeveledGrant[];
}

// ===== Classes =====

/**
 * Keyed by the class document's slug. Only the official classes are listed:
 * every other class in the Archive is read from its own `proficiencies` rules,
 * and the step says plainly when a class records none.
 */
export const CLASS_RULES: Record<string, ClassRules> = {
    barbarian: {
        base: {
            armor: ["Light Armor", "Medium Armor", "Shields"],
            weapons: ["Simple Weapons", "Martial Weapons"],
            choices: [{
                kind: "skill",
                count: 2,
                options: ["Animal Handling", "Athletics", "Intimidation", "Nature", "Perception", "Survival"],
            }],
        },
    },
    bard: {
        // 2014 also granted hand crossbows, longswords, rapiers and shortswords.
        base: {
            armor: ["Light Armor"],
            weapons: ["Simple Weapons"],
            choices: [
                { kind: "skill", count: 3 },
                { kind: "tool", count: 3, options: MUSICAL_INSTRUMENTS, optionsLabel: "musical instruments" },
            ],
        },
        // 2014 held Expertise back to level 3.
        byLevel: [{ level: 2, feature: "Expertise", grant: { choices: [{ kind: "expertise", count: 2 }] } }],
    },
    cleric: {
        base: {
            armor: ["Light Armor", "Medium Armor", "Shields"],
            weapons: ["Simple Weapons"],
            choices: [{
                kind: "skill",
                count: 2,
                options: ["History", "Insight", "Medicine", "Persuasion", "Religion"],
            }],
        },
    },
    druid: {
        // 2024 trains druids in light armour and shields only; 2014 added
        // medium armour, with the caveat that none of it be metal.
        base: {
            armor: ["Light Armor", "Shields"],
            weapons: [
                "Club", "Dagger", "Dart", "Javelin", "Mace", "Quarterstaff", "Scimitar",
                "Sickle", "Sling", "Spear",
            ],
            tools: ["Herbalism Kit"],
            languages: ["Druidic"],
            choices: [{
                kind: "skill",
                count: 2,
                options: [
                    "Animal Handling", "Arcana", "Insight", "Medicine", "Nature", "Perception",
                    "Religion", "Survival",
                ],
            }],
        },
    },
    fighter: {
        base: {
            armor: ["Light Armor", "Medium Armor", "Heavy Armor", "Shields"],
            weapons: ["Simple Weapons", "Martial Weapons"],
            choices: [{
                kind: "skill",
                count: 2,
                options: [
                    "Acrobatics", "Animal Handling", "Athletics", "History", "Insight",
                    "Intimidation", "Perception", "Persuasion", "Survival",
                ],
            }],
        },
    },
    monk: {
        // 2024: simple weapons plus martial weapons with the Light property.
        base: {
            weapons: ["Simple Weapons", ...LIGHT_MARTIAL_WEAPONS],
            choices: [
                {
                    kind: "skill",
                    count: 2,
                    options: ["Acrobatics", "Athletics", "History", "Insight", "Religion", "Stealth"],
                },
                {
                    kind: "tool",
                    count: 1,
                    options: [...ARTISAN_TOOLS, ...MUSICAL_INSTRUMENTS],
                    optionsLabel: "artisan's tools or a musical instrument",
                },
            ],
        },
    },
    paladin: {
        base: {
            armor: ["Light Armor", "Medium Armor", "Heavy Armor", "Shields"],
            weapons: ["Simple Weapons", "Martial Weapons"],
            choices: [{
                kind: "skill",
                count: 2,
                options: ["Athletics", "Insight", "Intimidation", "Medicine", "Persuasion", "Religion"],
            }],
        },
    },
    ranger: {
        base: {
            armor: ["Light Armor", "Medium Armor", "Shields"],
            weapons: ["Simple Weapons", "Martial Weapons"],
            choices: [{
                kind: "skill",
                count: 3,
                options: [
                    "Animal Handling", "Athletics", "Insight", "Investigation", "Nature",
                    "Perception", "Stealth", "Survival",
                ],
            }],
        },
        byLevel: [{
            level: 2,
            feature: "Deft Explorer",
            grant: {
                choices: [
                    { kind: "expertise", count: 1 },
                    { kind: "language", count: 2 },
                ],
            },
        }],
    },
    rogue: {
        // 2024: simple weapons plus martial weapons with Finesse or Light.
        base: {
            armor: ["Light Armor"],
            weapons: ["Simple Weapons", ...FINESSE_OR_LIGHT_MARTIAL_WEAPONS],
            tools: ["Thieves' Tools"],
            languages: ["Thieves' Cant"],
            choices: [{
                kind: "skill",
                count: 4,
                options: [
                    "Acrobatics", "Athletics", "Deception", "Insight", "Intimidation",
                    "Investigation", "Perception", "Performance", "Persuasion",
                    "Sleight of Hand", "Stealth",
                ],
            }],
        },
        // A second pair of skills follows at level 6, past this creator's cap.
        byLevel: [{ level: 1, feature: "Expertise", grant: { choices: [{ kind: "expertise", count: 2 }] } }],
    },
    sorcerer: {
        base: {
            weapons: ["Dagger", "Dart", "Sling", "Quarterstaff"],
            choices: [{
                kind: "skill",
                count: 2,
                options: ["Arcana", "Deception", "Insight", "Intimidation", "Persuasion", "Religion"],
            }],
        },
    },
    warlock: {
        base: {
            armor: ["Light Armor"],
            weapons: ["Simple Weapons"],
            choices: [{
                kind: "skill",
                count: 2,
                options: [
                    "Arcana", "Deception", "History", "Intimidation", "Investigation",
                    "Nature", "Religion",
                ],
            }],
        },
    },
    wizard: {
        base: {
            weapons: ["Dagger", "Dart", "Sling", "Quarterstaff"],
            choices: [{
                kind: "skill",
                count: 2,
                options: ["Arcana", "History", "Insight", "Investigation", "Medicine", "Nature", "Religion"],
            }],
        },
        byLevel: [{
            level: 2,
            feature: "Scholar",
            grant: {
                choices: [{
                    kind: "expertise",
                    count: 1,
                    options: ACADEMIC_SKILLS,
                    optionsLabel: "an academic skill",
                }],
            },
        }],
    },
    artificer: {
        // Tasha's Cauldron of Everything; there is no 2024 artificer.
        base: {
            armor: ["Light Armor", "Medium Armor", "Shields"],
            weapons: ["Simple Weapons"],
            tools: ["Thieves' Tools", "Tinker's Tools"],
            choices: [
                {
                    kind: "skill",
                    count: 2,
                    options: [
                        "Arcana", "History", "Investigation", "Medicine", "Nature",
                        "Perception", "Sleight of Hand",
                    ],
                },
                { kind: "tool", count: 1, options: ARTISAN_TOOLS, optionsLabel: "artisan's tools" },
            ],
        },
    },
};

// ===== Subclasses =====

/**
 * Subclass grants, keyed by the subclass document's slug and gated on the level
 * the feature arrives at. Only subclasses whose features actually hand out a
 * proficiency are listed.
 */
export const SUBCLASS_RULES: Record<string, LeveledGrant[]> = {
    // Artificer
    alchemist: [{ level: 3, feature: "Tool Proficiency", grant: { tools: ["Alchemist's Supplies"] } }],
    armorer: [{ level: 3, feature: "Tools of the Trade", grant: { tools: ["Smith's Tools"] } }],
    artillerist: [{ level: 3, feature: "Tool Proficiency", grant: { tools: ["Woodcarver's Tools"] } }],
    "battle-smith": [{
        level: 3,
        feature: "Tool Proficiency & Battle Ready",
        grant: { tools: ["Smith's Tools"], weapons: ["Martial Weapons"] },
    }],

    // Bard
    "college-of-lore": [{
        level: 3,
        feature: "Bonus Proficiencies",
        grant: { choices: [{ kind: "skill", count: 3 }] },
    }],
    "college-of-valor": [{
        level: 3,
        feature: "Bonus Proficiencies",
        grant: { armor: ["Medium Armor", "Shields"], weapons: ["Martial Weapons"] },
    }],

    // Cleric
    "knowledge-domain": [{
        level: 1,
        feature: "Blessings of Knowledge",
        grant: {
            choices: [
                { kind: "language", count: 2 },
                // These two arrive with the proficiency bonus already doubled.
                {
                    kind: "skill",
                    count: 2,
                    options: ["Arcana", "History", "Nature", "Religion"],
                    withExpertise: true,
                    note: "Your proficiency bonus is doubled for both.",
                },
            ],
        },
    }],
    "life-domain": [{ level: 1, feature: "Bonus Proficiency", grant: { armor: ["Heavy Armor"] } }],
    "nature-domain": [{
        level: 1,
        feature: "Acolyte of Nature & Bonus Proficiency",
        grant: {
            armor: ["Heavy Armor"],
            choices: [{ kind: "skill", count: 1, options: ["Animal Handling", "Nature", "Survival"] }],
        },
    }],
    "tempest-domain": [{
        level: 1,
        feature: "Bonus Proficiencies",
        grant: { armor: ["Heavy Armor"], weapons: ["Martial Weapons"] },
    }],
    "twilight-domain": [{
        level: 1,
        feature: "Bonus Proficiencies",
        grant: { armor: ["Heavy Armor"], weapons: ["Martial Weapons"] },
    }],
    "war-domain": [{
        level: 1,
        feature: "Bonus Proficiencies",
        grant: { armor: ["Heavy Armor"], weapons: ["Martial Weapons"] },
    }],

    // Fighter
    "battle-master": [{
        level: 3,
        feature: "Student of War",
        grant: { choices: [{ kind: "tool", count: 1, options: ARTISAN_TOOLS, optionsLabel: "artisan's tools" }] },
    }],
    "rune-knight": [{
        level: 3,
        feature: "Bonus Proficiencies",
        grant: { tools: ["Smith's Tools"], languages: ["Giant"] },
    }],
    samurai: [{
        level: 3,
        feature: "Bonus Proficiency",
        grant: {
            choices: [{
                kind: "skill",
                count: 1,
                options: ["History", "Insight", "Performance", "Persuasion"],
            }],
        },
    }],

    // Monk
    "warrior-of-mercy": [{
        level: 3,
        feature: "Implements of Mercy",
        grant: { skills: ["Insight", "Medicine"], tools: ["Herbalism Kit"] },
    }],

    // Rogue
    assassin: [{
        level: 3,
        feature: "Bonus Proficiencies",
        grant: { tools: ["Disguise Kit", "Poisoner's Kit"] },
    }],

    // Warlock
    "the-hexblade": [{
        level: 1,
        feature: "Hex Warrior",
        grant: { armor: ["Medium Armor", "Shields"], weapons: ["Martial Weapons"] },
    }],

    // Wizard
    bladesinging: [{
        level: 2,
        feature: "Training in War and Song",
        grant: {
            armor: ["Light Armor"],
            choices: [{
                kind: "weapon",
                count: 1,
                options: ONE_HANDED_MELEE_WEAPONS,
                optionsLabel: "a one-handed melee weapon",
            }],
        },
    }],

    // Monster Hunter (the Archive's own class)
    "the-carver-guild": [{ level: 3, feature: "Bonus Proficiency", grant: { armor: ["Heavy Armor"] } }],
    "the-devourer-guild": [{
        level: 3,
        feature: "Alchemical Gastronomy",
        grant: { tools: ["Alchemist's Supplies", "Cook's Utensils"] },
    }],
    "the-occultist-guild": [{ level: 3, feature: "Acolyte of the Occult", grant: { skills: ["Arcana"] } }],
    "the-trapper-guild": [{
        level: 3,
        feature: "Sneaky and Crafty",
        grant: { tools: ["Thieves' Tools", "Tinker's Tools"] },
    }],
};

// ===== Feats =====

/**
 * Feats that hand out proficiencies, keyed by name.
 *
 * The Archive summarises a feat's benefits in a line or two and often leaves
 * the proficiency out — Chef reads as extra healing, Musician as inspiration —
 * so these follow the printed feats rather than the summary.
 */
export const FEAT_RULES: Record<string, RuleGrant> = {
    Skilled: {
        choices: [{ kind: "skillOrTool", count: 3, optionsLabel: "any skill or tool" }],
    },
    "Skill Expert": {
        choices: [
            { kind: "skill", count: 1 },
            { kind: "expertise", count: 1 },
        ],
    },
    Prodigy: {
        choices: [
            { kind: "skill", count: 1 },
            { kind: "tool", count: 1 },
            { kind: "language", count: 1 },
            { kind: "expertise", count: 1 },
        ],
    },
    Linguist: {
        choices: [{ kind: "language", count: 3 }],
    },
    "Weapon Master": {
        choices: [{
            kind: "weapon",
            count: 4,
            options: [...SIMPLE_WEAPONS, ...MARTIAL_WEAPONS],
            optionsLabel: "weapons",
        }],
    },
    "Martial Weapon Training": { weapons: ["Martial Weapons"] },
    "Lightly Armored": { armor: ["Light Armor"] },
    "Moderately Armored": { armor: ["Medium Armor", "Shields"] },
    "Heavily Armored": { armor: ["Heavy Armor"] },
    Crafter: {
        choices: [{ kind: "tool", count: 3, options: ARTISAN_TOOLS, optionsLabel: "artisan's tools" }],
    },
    Musician: {
        choices: [{ kind: "tool", count: 3, options: MUSICAL_INSTRUMENTS, optionsLabel: "musical instruments" }],
    },
    "Artificer Initiate": {
        choices: [{ kind: "tool", count: 1, options: ARTISAN_TOOLS, optionsLabel: "artisan's tools" }],
    },
    Chef: { tools: ["Cook's Utensils"] },
    Poisoner: { tools: ["Poisoner's Kit"] },
    "Squat Nimbleness": {
        choices: [{ kind: "skill", count: 1, options: ["Acrobatics", "Athletics"] }],
    },
};

/**
 * A last resort for feats the table above does not name — most of the Archive's
 * feats are homebrew. Only phrasings that say plainly what they grant are read;
 * anything else is left alone rather than guessed at.
 */
export function grantFromFeatText(lines: string[]): RuleGrant | null {
    const grant: RuleGrant = {};
    const choices: RuleChoice[] = [];

    for (const line of lines) {
        const text = line.toLowerCase();

        const expertise = /expertise in (one|a|two|three|\d+)?\s*skill/.exec(text);
        if (expertise) {
            choices.push({ kind: "expertise", count: wordCount(expertise[1]) });
            continue;
        }
        const skills = /(?:gain|learn)\s+(\d+|one|two|three)\s+skills?\s+or\s+tools?/.exec(text);
        if (skills) {
            choices.push({ kind: "skillOrTool", count: wordCount(skills[1]), optionsLabel: "any skill or tool" });
            continue;
        }
        const weapons = /(\d+|one|two|three|four)\s+weapon\s+proficienc/.exec(text);
        if (weapons) {
            choices.push({
                kind: "weapon",
                count: wordCount(weapons[1]),
                options: [...SIMPLE_WEAPONS, ...MARTIAL_WEAPONS],
                optionsLabel: "weapons",
            });
            continue;
        }
        for (const category of ARMOR_CATEGORIES) {
            const word = category.replace(" Armor", "").toLowerCase();
            if (new RegExp(`${word}\\s+armor`).test(text) && /proficien/.test(text)) {
                grant.armor = [...(grant.armor ?? []), category];
            }
        }
        if (/martial weapons?/.test(text) && /proficien/.test(text)) {
            grant.weapons = [...(grant.weapons ?? []), "Martial Weapons"];
        }
    }

    if (choices.length) grant.choices = choices;
    return Object.keys(grant).length ? grant : null;
}

function wordCount(word: string | undefined): number {
    if (!word) return 1;
    const numeric = Number.parseInt(word, 10);
    if (!Number.isNaN(numeric)) return numeric;
    return { one: 1, two: 2, three: 3, four: 4 }[word] ?? 1;
}
