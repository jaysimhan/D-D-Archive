import type { CharacterRuleset } from "../types/dnd-types";

/** The ten Sorcerer Metamagic options; both editions offer the same list. */
export const METAMAGIC_OPTIONS = [
    "Careful Spell",
    "Distant Spell",
    "Empowered Spell",
    "Extended Spell",
    "Heightened Spell",
    "Quickened Spell",
    "Seeking Spell",
    "Subtle Spell",
    "Transmuted Spell",
    "Twinned Spell",
];

export type MetamagicDetail = {
    /** What a use costs, phrased for display rather than as a bare number. */
    cost: string;
    description: string;
};

const POINT = "1 Sorcery Point";
const POINTS = (count: number) => `${count} Sorcery Points`;

/**
 * The list of options survived the 2024 revision intact, but the rules behind
 * several of them did not: Heightened dropped to 2 points, Seeking to 1, and
 * Twinned stopped scaling with spell level. Each option therefore carries text
 * per ruleset, with `unchanged` marking the four that were left alone.
 */
const unchanged = (detail: MetamagicDetail): Record<CharacterRuleset, MetamagicDetail> => ({
    "2014": detail,
    "2024": detail,
});

const METAMAGIC_RULES: Record<string, Record<CharacterRuleset, MetamagicDetail>> = {
    "Careful Spell": {
        "2014": {
            cost: POINT,
            description: "When you cast a spell that forces other creatures to make a saving throw, choose up to your Charisma modifier of them (minimum of one). Each chosen creature automatically succeeds on its saving throw against the spell.",
        },
        "2024": {
            cost: POINT,
            description: "When you cast a spell that forces other creatures to make a saving throw, choose up to your Charisma modifier of them (minimum of one). Each chosen creature automatically succeeds on its save, and takes no damage where it would normally take half.",
        },
    },
    "Distant Spell": unchanged({
        cost: POINT,
        description: "Double the range of a spell that has a range of 5 feet or more. A spell with a range of touch instead reaches 30 feet.",
    }),
    "Empowered Spell": unchanged({
        cost: POINT,
        description: "When you roll damage for a spell, reroll up to your Charisma modifier of the damage dice (minimum of one) and use the new rolls. This one stacks: you may use it even after another Metamagic option on the same casting.",
    }),
    "Extended Spell": {
        "2014": {
            cost: POINT,
            description: "Double the duration of a spell that lasts 1 minute or longer, up to a maximum of 24 hours.",
        },
        "2024": {
            cost: POINT,
            description: "Double the duration of a spell that lasts 1 minute or longer, up to a maximum of 24 hours. If the spell needs Concentration, you also gain Advantage on Constitution saves to keep it.",
        },
    },
    "Heightened Spell": {
        "2014": {
            cost: POINTS(3),
            description: "When you cast a spell that forces a saving throw, one target of your choice has disadvantage on its first saving throw against that spell.",
        },
        "2024": {
            cost: POINTS(2),
            description: "When you cast a spell that forces a saving throw, one target of your choice has Disadvantage on every save it makes against that spell.",
        },
    },
    "Quickened Spell": {
        "2014": {
            cost: POINTS(2),
            description: "Change a spell's casting time from 1 action to 1 bonus action for this casting.",
        },
        "2024": {
            cost: POINTS(2),
            description: "Change a spell's casting time from an action to a Bonus Action for this casting. You can't do so if you have already cast a level 1+ spell this turn, and you can't cast another level 1+ spell later in the same turn.",
        },
    },
    "Seeking Spell": {
        "2014": {
            cost: POINTS(2),
            description: "If you miss with a spell attack roll, reroll the d20 and use the new roll. This one stacks: you may use it even after another Metamagic option on the same casting.",
        },
        "2024": {
            cost: POINT,
            description: "If you miss with a spell attack roll, reroll the d20 and use the new roll. This one stacks: you may use it even after another Metamagic option on the same casting.",
        },
    },
    "Subtle Spell": {
        "2014": {
            cost: POINT,
            description: "Cast a spell without any verbal or somatic components — no words, no gestures, and nothing for onlookers to notice.",
        },
        "2024": {
            cost: POINT,
            description: "Cast a spell without Verbal, Somatic, or Material components, except Material components that the spell consumes or that list a cost.",
        },
    },
    "Transmuted Spell": unchanged({
        cost: POINT,
        description: "When you cast a spell that deals acid, cold, fire, lightning, poison, or thunder damage, swap that damage for another type on the same list.",
    }),
    "Twinned Spell": {
        "2014": {
            cost: "Sorcery Points equal to the spell's level (1 for a cantrip)",
            description: "When you cast a spell that targets only one creature and does not have a range of self, target a second creature in range with the same spell.",
        },
        "2024": {
            cost: POINT,
            description: "When you cast a spell that could target an extra creature by using a higher-level slot — Charm Person, for instance — raise the spell's effective level by 1.",
        },
    },
};

export function metamagicDetail(option: string, ruleset: CharacterRuleset): MetamagicDetail | undefined {
    return METAMAGIC_RULES[option]?.[ruleset];
}
