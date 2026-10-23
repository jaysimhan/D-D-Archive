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
 * documents record features but not their proficiency lines. Classes keep one
 * kit per ruleset — the 2014 Handbook (SRD 5.1) and the 2024 one (SRD 5.2) —
 * and subclasses note where the 2024 version changed what they grant.
 */

import type { CharacterRuleset } from "../types/dnd-types";

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
const LIGHT_MARTIAL_WEAPONS = ["Hand Crossbow", "Scimitar", "Shortsword"];

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

/** One road a class feature offers, e.g. the cleric's Protector order. */
export interface FeatureOption {
    name: string;
    /** What the option does, in a line, for the class step. */
    summary: string;
    grant?: RuleGrant;
    /** The option teaches one extra cantrip from the class's list. */
    bonusCantrip?: boolean;
}

/**
 * A class feature that makes the player pick one of a few packages — the 2024
 * cleric's Divine Order, the druid's Primal Order. The pick is stored on the
 * character under the feature's name.
 */
export interface FeatureChoice {
    feature: string;
    level: number;
    options: FeatureOption[];
}

export interface ClassRules {
    /** The kit every member of the class starts with. */
    base: RuleGrant;
    /** Features that only arrive at a later level. */
    byLevel?: LeveledGrant[];
    featureChoice?: FeatureChoice;
}

// ===== Classes =====

const DRUIDIC: LeveledGrant = { level: 1, feature: "Druidic", grant: { languages: ["Druidic"] } };

/**
 * The 2024 Player's Handbook (SRD 5.2) kits, keyed by the class document's
 * slug. Only the official classes are listed: every other class in the Archive
 * is read from its own `proficiencies` rules, and the step says plainly when a
 * class records none.
 */
const CLASS_RULES_2024: Record<string, ClassRules> = {
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
        base: {
            armor: ["Light Armor"],
            weapons: ["Simple Weapons"],
            choices: [
                { kind: "skill", count: 3 },
                { kind: "tool", count: 3, options: MUSICAL_INSTRUMENTS, optionsLabel: "musical instruments" },
            ],
        },
        byLevel: [
            { level: 2, feature: "Expertise", grant: { choices: [{ kind: "expertise", count: 2 }] } },
            { level: 9, feature: "Expertise", grant: { choices: [{ kind: "expertise", count: 2 }] } },
        ],
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
        featureChoice: {
            feature: "Divine Order",
            level: 1,
            options: [
                {
                    name: "Protector",
                    summary: "Trained for battle: Martial weapons and Heavy armor.",
                    grant: { armor: ["Heavy Armor"], weapons: ["Martial Weapons"] },
                },
                {
                    name: "Thaumaturge",
                    summary: "One extra Cleric cantrip, and your Wisdom modifier added to Arcana and Religion checks.",
                    bonusCantrip: true,
                },
            ],
        },
    },
    druid: {
        base: {
            armor: ["Light Armor", "Shields"],
            weapons: ["Simple Weapons"],
            tools: ["Herbalism Kit"],
            choices: [{
                kind: "skill",
                count: 2,
                options: [
                    "Animal Handling", "Arcana", "Insight", "Medicine", "Nature", "Perception",
                    "Religion", "Survival",
                ],
            }],
        },
        // A 1st-level feature rather than a starting proficiency, so a druid
        // by multiclass learns it too.
        byLevel: [DRUIDIC],
        featureChoice: {
            feature: "Primal Order",
            level: 1,
            options: [
                {
                    name: "Magician",
                    summary: "One extra Druid cantrip, and your Wisdom modifier added to Arcana and Nature checks.",
                    bonusCantrip: true,
                },
                {
                    name: "Warden",
                    summary: "Trained for battle: Martial weapons and Medium armor.",
                    grant: { armor: ["Medium Armor"], weapons: ["Martial Weapons"] },
                },
            ],
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
        // Simple weapons plus martial weapons with the Light property.
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
        }, { level: 9, feature: "Expertise", grant: { choices: [{ kind: "expertise", count: 2 }] } }],
    },
    rogue: {
        // Simple weapons plus martial weapons with Finesse or Light.
        base: {
            armor: ["Light Armor"],
            weapons: ["Simple Weapons", ...FINESSE_OR_LIGHT_MARTIAL_WEAPONS],
            tools: ["Thieves' Tools"],
            choices: [{
                kind: "skill",
                count: 4,
                options: [
                    "Acrobatics", "Athletics", "Deception", "Insight", "Intimidation",
                    "Investigation", "Perception", "Persuasion", "Sleight of Hand", "Stealth",
                ],
            }],
        },
        byLevel: [
            { level: 1, feature: "Expertise", grant: { choices: [{ kind: "expertise", count: 2 }] } },
            { level: 6, feature: "Expertise", grant: { choices: [{ kind: "expertise", count: 2 }] } },
            {
                level: 1,
                feature: "Thieves' Cant",
                grant: { languages: ["Thieves' Cant"], choices: [{ kind: "language", count: 1 }] },
            },
        ],
    },
    sorcerer: {
        base: {
            weapons: ["Simple Weapons"],
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
            weapons: ["Simple Weapons"],
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
        // Tasha's Cauldron of Everything; the kit is the same under either ruleset.
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

/** The 2014 Player's Handbook (SRD 5.1) kits, where they differ from 2024. */
const CLASS_RULES_2014: Record<string, ClassRules> = {
    ...CLASS_RULES_2024,
    bard: {
        base: {
            armor: ["Light Armor"],
            weapons: ["Simple Weapons", "Hand Crossbow", "Longsword", "Rapier", "Shortsword"],
            choices: CLASS_RULES_2024.bard.base.choices,
        },
        byLevel: [
            { level: 3, feature: "Expertise", grant: { choices: [{ kind: "expertise", count: 2 }] } },
            { level: 10, feature: "Expertise", grant: { choices: [{ kind: "expertise", count: 2 }] } },
        ],
    },
    cleric: { base: CLASS_RULES_2024.cleric.base },
    druid: {
        byLevel: [DRUIDIC],
        base: {
            ...CLASS_RULES_2024.druid.base,
            // Druids will not wear armour or use shields made of metal.
            armor: ["Light Armor", "Medium Armor", "Shields"],
            weapons: [
                "Club", "Dagger", "Dart", "Javelin", "Mace", "Quarterstaff", "Scimitar",
                "Sickle", "Sling", "Spear",
            ],
        },
    },
    fighter: {
        base: {
            ...CLASS_RULES_2024.fighter.base,
            choices: [{
                kind: "skill",
                count: 2,
                options: [
                    "Acrobatics", "Animal Handling", "Athletics", "History", "Insight",
                    "Intimidation", "Perception", "Survival",
                ],
            }],
        },
    },
    monk: {
        base: { ...CLASS_RULES_2024.monk.base, weapons: ["Simple Weapons", "Shortsword"] },
    },
    ranger: {
        base: CLASS_RULES_2024.ranger.base,
        byLevel: [{
            level: 1,
            feature: "Favored Enemy",
            grant: {
                choices: [{
                    kind: "language",
                    count: 1,
                    note: "One spoken by your favored enemies, if they speak one at all.",
                }],
            },
        }],
    },
    rogue: {
        base: {
            armor: ["Light Armor"],
            weapons: ["Simple Weapons", "Hand Crossbow", "Longsword", "Rapier", "Shortsword"],
            tools: ["Thieves' Tools"],
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
        // The Handbook also allows one skill plus thieves' tools; the step only
        // doubles skills, so that pairing is left to the sheet.
        byLevel: [
            { level: 1, feature: "Expertise", grant: { choices: [{ kind: "expertise", count: 2 }] } },
            { level: 6, feature: "Expertise", grant: { choices: [{ kind: "expertise", count: 2 }] } },
            { level: 1, feature: "Thieves' Cant", grant: { languages: ["Thieves' Cant"] } },
        ],
    },
    sorcerer: {
        base: {
            ...CLASS_RULES_2024.sorcerer.base,
            weapons: ["Dagger", "Dart", "Sling", "Quarterstaff", "Light Crossbow"],
        },
    },
    wizard: {
        base: {
            weapons: ["Dagger", "Dart", "Sling", "Quarterstaff", "Light Crossbow"],
            choices: [{
                kind: "skill",
                count: 2,
                options: ["Arcana", "History", "Insight", "Investigation", "Medicine", "Religion"],
            }],
        },
    },
};

/** The official kit for a class under a ruleset, if the class is an official one. */
export function classRulesFor(
    classData: { id: string; name: string },
    ruleset: CharacterRuleset = "2024",
): ClassRules | undefined {
    const table = ruleset === "2014" ? CLASS_RULES_2014 : CLASS_RULES_2024;
    return table[classData.id] ?? table[classData.name.toLowerCase()];
}

// ===== Species =====

/** A species trait that hands out proficiencies, named for the step and the sheet. */
export interface SpeciesGrant {
    feature: string;
    grant: RuleGrant;
}

const ELF_WEAPONS = ["Longsword", "Shortsword", "Shortbow", "Longbow"];
const DWARF_WEAPONS = ["Battleaxe", "Handaxe", "Light Hammer", "Warhammer"];
const DWARF_TOOLS: RuleChoice = {
    kind: "tool",
    count: 1,
    options: ["Smith's Tools", "Brewer's Supplies", "Mason's Tools"],
    optionsLabel: "smith's tools, brewer's supplies or mason's tools",
};
const KEEN_SENSES_CHOICE: RuleChoice = { kind: "skill", count: 1, options: ["Insight", "Perception", "Survival"] };

/**
 * Official species whose proficiencies the Archive's documents leave in trait
 * text, record incompletely, or record wrongly. Keyed by the species slug; a
 * species listed here is read from this table rather than its document.
 * Species documents are shared by both rulesets, so this is how they read
 * under either one unless `SPECIES_RULES_2024` says otherwise.
 */
const SPECIES_RULES: Record<string, SpeciesGrant[]> = {
    "astral-elf": [
        { feature: "Keen Senses", grant: { choices: [KEEN_SENSES_CHOICE] } },
        {
            feature: "Astral Trance",
            grant: {
                choices: [
                    { kind: "skill", count: 1, note: "You can change it each time you finish a Long Rest." },
                    { kind: "tool", count: 1, note: "Or a weapon instead. You can change it each time you finish a Long Rest." },
                ],
            },
        },
    ],
    autognome: [{ feature: "Specialized Design", grant: { choices: [{ kind: "tool", count: 2 }] } }],
    centaur: [{
        feature: "Natural Affinity",
        grant: { choices: [{ kind: "skill", count: 1, options: ["Animal Handling", "Medicine", "Nature", "Survival"] }] },
    }],
    changeling: [{
        feature: "Changeling Instincts",
        grant: {
            choices: [{
                kind: "skill",
                count: 2,
                options: ["Deception", "Insight", "Intimidation", "Performance", "Persuasion"],
            }],
        },
    }],
    drow: [
        { feature: "Keen Senses", grant: { skills: ["Perception"] } },
        { feature: "Drow Weapon Training", grant: { weapons: ["Rapier", "Shortsword", "Hand Crossbow"] } },
    ],
    eladrin: [{ feature: "Keen Senses", grant: { choices: [KEEN_SENSES_CHOICE] } }],
    giff: [{ feature: "Firearms Mastery", grant: { weapons: ["Firearms"] } }],
    githyanki: [
        {
            feature: "Martial Prodigy",
            grant: { armor: ["Light Armor", "Medium Armor"], weapons: ["Shortsword", "Longsword", "Greatsword"] },
        },
        {
            feature: "Decadent Mastery",
            grant: { choices: [{ kind: "language", count: 1 }, { kind: "skillOrTool", count: 1, optionsLabel: "any skill or tool" }] },
        },
    ],
    goliath: [{ feature: "Natural Athlete", grant: { skills: ["Athletics"] } }],
    "half-elf": [{ feature: "Skill Versatility", grant: { choices: [{ kind: "skill", count: 2 }] } }],
    "half-orc": [{ feature: "Menacing", grant: { skills: ["Intimidation"] } }],
    "high-elf": [
        { feature: "Keen Senses", grant: { skills: ["Perception"] } },
        { feature: "Elf Weapon Training", grant: { weapons: ELF_WEAPONS } },
    ],
    "hill-dwarf": [
        { feature: "Dwarven Combat Training", grant: { weapons: DWARF_WEAPONS } },
        { feature: "Tool Proficiency", grant: { choices: [DWARF_TOOLS] } },
    ],
    hobgoblin: [{
        feature: "Martial Training",
        grant: {
            armor: ["Light Armor"],
            choices: [{ kind: "weapon", count: 2, options: MARTIAL_WEAPONS, optionsLabel: "martial weapons" }],
        },
    }],
    kenku: [{
        feature: "Kenku Training",
        grant: { choices: [{ kind: "skill", count: 2, options: ["Acrobatics", "Deception", "Stealth", "Sleight of Hand"] }] },
    }],
    khoravar: [{ feature: "Skill Versatility", grant: { choices: [{ kind: "skill", count: 2 }] } }],
    leonin: [{
        feature: "Hunter's Instincts",
        grant: { choices: [{ kind: "skill", count: 1, options: ["Athletics", "Intimidation", "Perception", "Survival"] }] },
    }],
    lizardfolk: [{
        feature: "Hunter's Lore",
        grant: {
            choices: [{
                kind: "skill",
                count: 2,
                options: ["Animal Handling", "Nature", "Perception", "Stealth", "Survival"],
            }],
        },
    }],
    "mountain-dwarf": [
        { feature: "Dwarven Combat Training", grant: { weapons: DWARF_WEAPONS } },
        { feature: "Tool Proficiency", grant: { choices: [DWARF_TOOLS] } },
        { feature: "Dwarven Armor Training", grant: { armor: ["Light Armor", "Medium Armor"] } },
    ],
    relicborn: [{
        feature: "Soul of Revelry",
        grant: {
            choices: [{
                kind: "skillOrTool",
                count: 1,
                options: ["Performance", ...MUSICAL_INSTRUMENTS],
                optionsLabel: "Performance or a musical instrument",
            }],
        },
    }],
    satyr: [{
        feature: "Reveler",
        grant: {
            skills: ["Performance", "Persuasion"],
            choices: [{ kind: "tool", count: 1, options: MUSICAL_INSTRUMENTS, optionsLabel: "a musical instrument" }],
        },
    }],
    "sea-elf": [
        { feature: "Keen Senses", grant: { skills: ["Perception"] } },
        { feature: "Sea Elf Training", grant: { weapons: ["Spear", "Trident", "Light Crossbow", "Net"] } },
    ],
    tabaxi: [{ feature: "Cat's Talent", grant: { skills: ["Perception", "Stealth"] } }],
    tarandus: [
        { feature: "Student of History", grant: { skills: ["History"] } },
        { feature: "Born to Navigate", grant: { tools: ["Navigator's Tools"] } },
    ],
    tortle: [{ feature: "Survival Instinct", grant: { skills: ["Survival"] } }],
    warforged: [{
        feature: "Specialized Design",
        grant: { choices: [{ kind: "skill", count: 1 }, { kind: "tool", count: 1 }] },
    }],
    "wood-elf": [
        { feature: "Keen Senses", grant: { skills: ["Perception"] } },
        { feature: "Elf Weapon Training", grant: { weapons: ELF_WEAPONS } },
    ],
};

/** The 2024 Handbook's species, where they differ; an empty list grants nothing. */
const SPECIES_RULES_2024: Record<string, SpeciesGrant[]> = {
    elf: [{ feature: "Keen Senses", grant: { choices: [KEEN_SENSES_CHOICE] } }],
    goliath: [],
    human: [{ feature: "Skillful", grant: { choices: [{ kind: "skill", count: 1 }] } }],
};

export function speciesRulesFor(speciesId: string, ruleset: CharacterRuleset = "2024"): SpeciesGrant[] | undefined {
    if (ruleset === "2024" && speciesId in SPECIES_RULES_2024) return SPECIES_RULES_2024[speciesId];
    return SPECIES_RULES[speciesId];
}

// ===== Subclasses =====

/**
 * Subclass grants, keyed by the subclass document's slug and gated on the level
 * the feature arrives at. Only subclasses whose features actually hand out a
 * proficiency are listed. The Archive shares its subclasses between rulesets,
 * so this is the 2014 reading; `SUBCLASS_RULES_2024` overrides the few the 2024
 * Handbook reprinted with different grants.
 */
const SUBCLASS_RULES: Record<string, LeveledGrant[]> = {
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

    // Monster Hunter has no subclasses: the supplied class text has none, and the four
    // invented "Guild" subclasses that once stood in for them are retired by
    // `studio/migrations/merge-pasted-monster-hunter.ts`. Its own proficiencies —
    // cook's utensils plus one of alchemist's supplies, a poisoner's kit,
    // woodcarver's tools, or leatherworker's tools — come from the Sanity document's
    // `proficiencies` rules, which this file defers to for the Archive's own classes.
};

/** 2024 reprints whose grants changed; an empty list means the grant is gone. */
const SUBCLASS_RULES_2024: Record<string, LeveledGrant[]> = {
    // Heavy armour moved to the cleric's Divine Order.
    "life-domain": [],
    "war-domain": [],
    "battle-master": [{
        level: 3,
        feature: "Student of War",
        grant: {
            choices: [
                { kind: "tool", count: 1, options: ARTISAN_TOOLS, optionsLabel: "artisan's tools" },
                {
                    kind: "skill",
                    count: 1,
                    options: [
                        "Acrobatics", "Animal Handling", "Athletics", "History", "Insight",
                        "Intimidation", "Perception", "Persuasion", "Survival",
                    ],
                    optionsLabel: "the Fighter's skills",
                },
            ],
        },
    }],
};

export function subclassRulesFor(subclassId: string, ruleset: CharacterRuleset = "2024"): LeveledGrant[] | undefined {
    if (ruleset === "2024" && subclassId in SUBCLASS_RULES_2024) return SUBCLASS_RULES_2024[subclassId];
    return SUBCLASS_RULES[subclassId];
}

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
    // ===== 2024 Player's Handbook =====
    "Keen Mind": {
        choices: [{
            kind: "skill",
            count: 1,
            options: ["Arcana", "History", "Investigation", "Nature", "Religion"],
            optionsLabel: "Intelligence skills",
        }],
    },
    Observant: {
        choices: [{ kind: "skill", count: 1, options: ["Insight", "Investigation", "Perception"] }],
    },
    "Tavern Brawler": { weapons: ["Improvised Weapons"] },
    // The Epic Boon hands over every skill outright, then doubles two of them.
    "Boon of Skill": {
        skills: SKILL_GROUPS.flatMap((group) => group.skills),
        choices: [{ kind: "expertise", count: 2 }],
    },
};

/**
 * Where a feat grants something different under one ruleset. `null` means it
 * grants no proficiency there at all: the 2014 Keen Mind and Observant teach
 * no skill, and the 2024 Weapon Master grants a weapon's Mastery instead of
 * proficiencies.
 */
const FEAT_RULES_BY_EDITION: Record<CharacterRuleset, Record<string, RuleGrant | null>> = {
    "2014": {
        "Keen Mind": null,
        Observant: null,
    },
    "2024": {
        "Lightly Armored": { armor: ["Light Armor", "Shields"] },
        "Weapon Master": null,
    },
};

/**
 * What a feat grants under the character's ruleset: `undefined` when the
 * tables don't know the feat, `null` when they know it grants nothing.
 */
export function featRulesFor(name: string, ruleset: CharacterRuleset = "2024"): RuleGrant | null | undefined {
    const editionRules = FEAT_RULES_BY_EDITION[ruleset];
    if (name in editionRules) return editionRules[name];
    return FEAT_RULES[name];
}

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
