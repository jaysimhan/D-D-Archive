/**
 * The choices a species makes inside itself: a dragonborn's ancestry, a 2024
 * elf's lineage, a tiefling's legacy. The Archive keeps the older subraces
 * (Hill Dwarf, High Elf, Lightfoot Halfling…) as species of their own, so this
 * only covers species whose documents describe a choice without offering it.
 *
 * Every option becomes the character's `subrace`: its traits join the
 * species' on the sheet, its spells are granted at the levels given, and its
 * proficiencies go through the same plan as everything else's.
 */

import type { CharacterRuleset } from "../types/dnd-types";
import type { SpeciesGrant } from "./proficiency-rules";

export interface SubspeciesSpell {
    name: string;
    /** The character level the spell arrives at. */
    level: number;
}

export interface SubspeciesOption {
    id: string;
    name: string;
    /** One line for the option card. */
    summary: string;
    traits: { name: string; description: string }[];
    spells?: SubspeciesSpell[];
    grants?: SpeciesGrant[];
}

export interface SubspeciesChoice {
    /** The trait the choice belongs to, e.g. "Draconic Ancestry". */
    feature: string;
    intro: string;
    options: SubspeciesOption[];
    /** The lineage's spells use Intelligence, Wisdom or Charisma, picked with it. */
    choosesSpellcastingAbility?: boolean;
    /**
     * Van Richten's lineages: a character who became one can keep the skill
     * proficiencies of the species they were before.
     */
    ancestralLegacy?: boolean;
}

// ===== Dragonborn =====

const DRAGONS_2014: [string, string, string][] = [
    ["Black", "Acid", "5 by 30 ft. line (Dex. save)"],
    ["Blue", "Lightning", "5 by 30 ft. line (Dex. save)"],
    ["Brass", "Fire", "5 by 30 ft. line (Dex. save)"],
    ["Bronze", "Lightning", "5 by 30 ft. line (Dex. save)"],
    ["Copper", "Acid", "5 by 30 ft. line (Dex. save)"],
    ["Gold", "Fire", "15 ft. cone (Dex. save)"],
    ["Green", "Poison", "15 ft. cone (Con. save)"],
    ["Red", "Fire", "15 ft. cone (Dex. save)"],
    ["Silver", "Cold", "15 ft. cone (Con. save)"],
    ["White", "Cold", "15 ft. cone (Con. save)"],
];

function draconicAncestry(ruleset: CharacterRuleset): SubspeciesChoice {
    return {
        feature: "Draconic Ancestry",
        intro: "Your lineage stems from a dragon progenitor. It sets your Breath Weapon's damage and the damage you resist.",
        options: DRAGONS_2014.map(([dragon, damage, area]) => ({
            id: dragon.toLowerCase(),
            name: `${dragon} Dragon`,
            summary: ruleset === "2014" ? `${damage} damage · ${area}` : `${damage} damage`,
            traits: [
                {
                    name: "Breath Weapon",
                    description: ruleset === "2014"
                        ? `Your breath weapon deals ${damage.toLowerCase()} damage in a ${area.replace(" (", ", ").replace(")", "")}.`
                        : `Your breath weapon deals ${damage} damage in a 15-foot Cone or a 30-foot Line (choose each time); Dexterity save.`,
                },
                { name: "Damage Resistance", description: `You have resistance to ${damage.toLowerCase()} damage.` },
            ],
        })),
    };
}

// ===== 2024 lineages and legacies =====

const ELVEN_LINEAGE: SubspeciesChoice = {
    feature: "Elven Lineage",
    intro: "Your lineage grants you a cantrip now, and a spell at character levels 3 and 5 you can cast once per Long Rest without a slot.",
    choosesSpellcastingAbility: true,
    options: [
        {
            id: "drow",
            name: "Drow",
            summary: "Darkvision 120 ft. · Dancing Lights, then Faerie Fire and Darkness",
            traits: [{ name: "Drow Lineage", description: "The range of your Darkvision increases to 120 feet. You know the Dancing Lights cantrip, and learn Faerie Fire at level 3 and Darkness at level 5." }],
            spells: [{ name: "Dancing Lights", level: 1 }, { name: "Faerie Fire", level: 3 }, { name: "Darkness", level: 5 }],
        },
        {
            id: "high-elf",
            name: "High Elf",
            summary: "Prestidigitation, then Detect Magic and Misty Step",
            traits: [{ name: "High Elf Lineage", description: "You know the Prestidigitation cantrip; whenever you finish a Long Rest you can replace it with another Wizard cantrip. You learn Detect Magic at level 3 and Misty Step at level 5." }],
            spells: [{ name: "Prestidigitation", level: 1 }, { name: "Detect Magic", level: 3 }, { name: "Misty Step", level: 5 }],
        },
        {
            id: "wood-elf",
            name: "Wood Elf",
            summary: "Speed 35 ft. · Druidcraft, then Longstrider and Pass without Trace",
            traits: [{ name: "Wood Elf Lineage", description: "Your Speed increases to 35 feet. You know the Druidcraft cantrip, and learn Longstrider at level 3 and Pass without Trace at level 5." }],
            spells: [{ name: "Druidcraft", level: 1 }, { name: "Longstrider", level: 3 }, { name: "Pass without Trace", level: 5 }],
        },
    ],
};

const GNOMISH_LINEAGE: SubspeciesChoice = {
    feature: "Gnomish Lineage",
    intro: "Your lineage grants you supernatural abilities.",
    choosesSpellcastingAbility: true,
    options: [
        {
            id: "forest-gnome",
            name: "Forest Gnome",
            summary: "Minor Illusion · Speak with Animals, Proficiency Bonus times per Long Rest",
            traits: [{ name: "Forest Gnome Lineage", description: "You know the Minor Illusion cantrip. You always have Speak with Animals prepared and can cast it without a slot a number of times equal to your Proficiency Bonus per Long Rest." }],
            spells: [{ name: "Minor Illusion", level: 1 }, { name: "Speak with Animals", level: 1 }],
        },
        {
            id: "rock-gnome",
            name: "Rock Gnome",
            summary: "Mending and Prestidigitation · clockwork devices",
            traits: [{ name: "Rock Gnome Lineage", description: "You know the Mending and Prestidigitation cantrips. You can spend 10 minutes casting Prestidigitation to build a Tiny clockwork device (AC 5, 1 HP) that reproduces one of its effects; up to three exist at a time, and each falls apart after 8 hours." }],
            spells: [{ name: "Mending", level: 1 }, { name: "Prestidigitation", level: 1 }],
        },
    ],
};

const FIENDISH_LEGACY: SubspeciesChoice = {
    feature: "Fiendish Legacy",
    intro: "Your legacy grants a resistance and a cantrip now, and a spell at character levels 3 and 5 you can cast once per Long Rest without a slot.",
    choosesSpellcastingAbility: true,
    options: [
        {
            id: "abyssal",
            name: "Abyssal",
            summary: "Poison resistance · Poison Spray, then Ray of Sickness and Hold Person",
            traits: [{ name: "Abyssal Legacy", description: "You have Resistance to Poison damage. You know the Poison Spray cantrip, and learn Ray of Sickness at level 3 and Hold Person at level 5." }],
            spells: [{ name: "Poison Spray", level: 1 }, { name: "Ray of Sickness", level: 3 }, { name: "Hold Person", level: 5 }],
        },
        {
            id: "chthonic",
            name: "Chthonic",
            summary: "Necrotic resistance · Chill Touch, then False Life and Ray of Enfeeblement",
            traits: [{ name: "Chthonic Legacy", description: "You have Resistance to Necrotic damage. You know the Chill Touch cantrip, and learn False Life at level 3 and Ray of Enfeeblement at level 5." }],
            spells: [{ name: "Chill Touch", level: 1 }, { name: "False Life", level: 3 }, { name: "Ray of Enfeeblement", level: 5 }],
        },
        {
            id: "infernal",
            name: "Infernal",
            summary: "Fire resistance · Fire Bolt, then Hellish Rebuke and Darkness",
            traits: [{ name: "Infernal Legacy", description: "You have Resistance to Fire damage. You know the Fire Bolt cantrip, and learn Hellish Rebuke at level 3 and Darkness at level 5." }],
            spells: [{ name: "Fire Bolt", level: 1 }, { name: "Hellish Rebuke", level: 3 }, { name: "Darkness", level: 5 }],
        },
    ],
};

const GIANT_ANCESTRY: SubspeciesChoice = {
    feature: "Giant Ancestry",
    intro: "A supernatural boon from your giant forebears, usable a number of times equal to your Proficiency Bonus per Long Rest.",
    options: [
        ["cloud", "Cloud's Jaunt", "Cloud Giant", "As a Bonus Action, you magically teleport up to 30 feet to an unoccupied space you can see."],
        ["fire", "Fire's Burn", "Fire Giant", "When you hit a target with an attack roll and deal damage to it, you can also deal 1d10 Fire damage to that target."],
        ["frost", "Frost's Chill", "Frost Giant", "When you hit a target with an attack roll and deal damage to it, you can also deal 1d6 Cold damage to it and reduce its Speed by 10 feet until the start of your next turn."],
        ["hill", "Hill's Tumble", "Hill Giant", "When you hit a Large or smaller creature with an attack roll and deal damage to it, you can give it the Prone condition."],
        ["stone", "Stone's Endurance", "Stone Giant", "When you take damage, you can take a Reaction to roll 1d12, add your Constitution modifier, and reduce the damage by that total."],
        ["storm", "Storm's Thunder", "Storm Giant", "When you take damage from a creature within 60 feet of you, you can take a Reaction to deal 1d8 Thunder damage to that creature."],
    ].map(([id, boon, giant, description]) => ({
        id,
        name: `${giant} (${boon})`,
        summary: description,
        traits: [{ name: boon, description }],
    })),
};

// ===== Van Richten's lineages =====

/**
 * Dhampir, hexblood and reborn are lineages a character can be born to or
 * become. Born to it, they gain two skills of their choice; having become it,
 * they can instead keep the skill proficiencies of the species they were.
 */
const ANCESTRAL_LEGACY: SubspeciesChoice = {
    feature: "Ancestral Legacy",
    intro: "Were you born to this lineage, or did you become it? A character who was once another species can keep that species' skill proficiencies.",
    ancestralLegacy: true,
    options: [
        {
            id: "born",
            name: "Born to the lineage",
            summary: "Proficiency in two skills of your choice",
            traits: [{ name: "Ancestral Legacy", description: "You gain proficiency in two skills of your choice." }],
            grants: [{ feature: "Ancestral Legacy", grant: { choices: [{ kind: "skill", count: 2 }] } }],
        },
        {
            id: "legacy",
            name: "Became this lineage",
            summary: "Keep the skill proficiencies (and any climbing, flying or swimming speed) of your former species",
            traits: [{
                name: "Ancestral Legacy",
                description: "You keep the skill proficiencies of your former species, along with any climbing, flying or swimming speed it gave you. If it gave no skills, you gain two of your choice.",
            }],
        },
    ],
};

const SUBSPECIES: Record<CharacterRuleset, Record<string, SubspeciesChoice>> = {
    "2014": {
        dragonborn: draconicAncestry("2014"),
        dhampir: ANCESTRAL_LEGACY,
        hexblood: ANCESTRAL_LEGACY,
        reborn: ANCESTRAL_LEGACY,
    },
    "2024": {
        dragonborn: draconicAncestry("2024"),
        elf: ELVEN_LINEAGE,
        gnome: GNOMISH_LINEAGE,
        tiefling: FIENDISH_LEGACY,
        goliath: GIANT_ANCESTRY,
        dhampir: ANCESTRAL_LEGACY,
        hexblood: ANCESTRAL_LEGACY,
        reborn: ANCESTRAL_LEGACY,
    },
};

export function subspeciesFor(speciesId: string | undefined, ruleset: CharacterRuleset = "2024"): SubspeciesChoice | undefined {
    return speciesId ? SUBSPECIES[ruleset][speciesId] : undefined;
}
