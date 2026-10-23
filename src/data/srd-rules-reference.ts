/**
 * The rules glossary the Library's Rules Reference section shows: conditions,
 * weapon properties, weapon masteries and damage types. Condensed from the SRD
 * 5.2 (CC-BY-4.0), with the 2014 rule noted where it differs.
 */

export type RuleKind = "Condition" | "Weapon Property" | "Weapon Mastery" | "Damage Type";

export const RULE_KINDS: RuleKind[] = ["Condition", "Weapon Property", "Weapon Mastery", "Damage Type"];

export interface RuleEntry {
  id: string;
  name: string;
  kind: RuleKind;
  /** One line for the list card. */
  summary: string;
  /** Each string is a separate rule or paragraph. */
  rules: string[];
  /** How the 2014 rules differ, when they do. */
  note2014?: string;
  /** The WEAPONS flag or mastery name this entry matches, for listing weapons. */
  weaponKey?: string;
  /** Words that find this entry in spell descriptions, e.g. "frighten". */
  keywords?: string[];
}

const condition = (name: string, summary: string, rules: string[], note2014?: string, keywords?: string[]): RuleEntry => ({
  id: name.toLowerCase(),
  name,
  kind: "Condition",
  summary,
  rules,
  note2014,
  keywords: keywords ?? [name.toLowerCase()],
});

export const CONDITIONS: RuleEntry[] = [
  condition("Blinded", "Can't see; attacks against you have advantage.", [
    "You can't see and automatically fail any ability check that requires sight.",
    "Attack rolls against you have advantage, and your attack rolls have disadvantage.",
  ], undefined, ["blinded", "blind"]),
  condition("Charmed", "Can't harm the charmer, who has advantage socially.", [
    "You can't attack the charmer or target them with damaging abilities or magical effects.",
    "The charmer has advantage on any ability check to interact with you socially.",
  ], undefined, ["charmed", "charm"]),
  condition("Deafened", "Can't hear.", [
    "You can't hear and automatically fail any ability check that requires hearing.",
  ], undefined, ["deafened", "deaf"]),
  condition("Exhaustion", "Cumulative levels that weaken every d20 roll.", [
    "Exhaustion is cumulative. Each time you receive it you gain 1 level; you die if your level reaches 6.",
    "When you make a d20 Test, the roll is reduced by 2 times your Exhaustion level.",
    "Your speed is reduced by a number of feet equal to 5 times your Exhaustion level.",
    "Finishing a long rest removes 1 level of Exhaustion.",
  ], "Six levels with escalating effects: 1 disadvantage on ability checks; 2 speed halved; 3 disadvantage on attack rolls and saving throws; 4 hit point maximum halved; 5 speed reduced to 0; 6 death.", ["exhaustion"]),
  condition("Frightened", "Disadvantage while the source of fear is in sight; can't move closer.", [
    "You have disadvantage on ability checks and attack rolls while the source of fear is within line of sight.",
    "You can't willingly move closer to the source of fear.",
  ], undefined, ["frightened", "frighten"]),
  condition("Grappled", "Speed 0; disadvantage attacking anyone but the grappler.", [
    "Your speed is 0 and can't increase.",
    "You have disadvantage on attack rolls against any target other than the grappler.",
    "The grappler can drag or carry you when it moves, but every foot costs it 1 extra foot unless you are Tiny or two or more sizes smaller.",
    "The condition ends if the grappler is Incapacitated or you are moved out of its reach.",
  ], "Only the speed 0 rule applied; there was no attack penalty and escaping used an action contested by Athletics or Acrobatics.", ["grappled", "grapple"]),
  condition("Incapacitated", "No actions, bonus actions or reactions; concentration breaks.", [
    "You can't take any action, bonus action, or reaction.",
    "Your concentration is broken, and you can't speak.",
    "If you're Incapacitated when you roll Initiative, you have disadvantage on the roll.",
  ], "Only the first rule applied.", ["incapacitated"]),
  condition("Invisible", "Unseen; your attacks have advantage, attacks on you have disadvantage.", [
    "If you're Invisible when you roll Initiative, you have advantage on the roll.",
    "You aren't affected by any effect that requires its target to be seen, unless its creator can somehow see you. Equipment you wear or carry is also concealed.",
    "Attack rolls against you have disadvantage, and your attack rolls have advantage, unless the attacker can somehow see you.",
  ], "You were impossible to see without special senses and counted as heavily obscured for hiding; the attack rules were the same.", ["invisible", "invisibility"]),
  condition("Paralyzed", "Incapacitated, can't move; hits from within 5 feet are critical.", [
    "You have the Incapacitated condition, and your speed is 0 and can't increase.",
    "You automatically fail Strength and Dexterity saving throws.",
    "Attack rolls against you have advantage, and any attack that hits you is a critical hit if the attacker is within 5 feet of you.",
  ], undefined, ["paralyzed", "paralysis"]),
  condition("Petrified", "Turned to stone: incapacitated, resistant to all damage.", [
    "You are transformed, along with any nonmagical objects you are wearing and carrying, into a solid inanimate substance (usually stone). Your weight increases by a factor of ten, and you cease aging.",
    "You have the Incapacitated condition, your speed is 0, and you are unaware of your surroundings.",
    "Attack rolls against you have advantage, and you automatically fail Strength and Dexterity saving throws.",
    "You have resistance to all damage and immunity to the Poisoned condition.",
  ], undefined, ["petrified", "petrify"]),
  condition("Poisoned", "Disadvantage on attack rolls and ability checks.", [
    "You have disadvantage on attack rolls and ability checks.",
  ], undefined, ["poisoned"]),
  condition("Prone", "Crawl or stand up; attacks within 5 feet have advantage against you.", [
    "Your only movement options are to crawl or to spend half your speed to stand up.",
    "You have disadvantage on attack rolls.",
    "An attack roll against you has advantage if the attacker is within 5 feet of you; otherwise it has disadvantage.",
  ], undefined, ["prone"]),
  condition("Restrained", "Speed 0; disadvantage on attacks and Dexterity saves.", [
    "Your speed is 0 and can't increase.",
    "Attack rolls against you have advantage, and your attack rolls have disadvantage.",
    "You have disadvantage on Dexterity saving throws.",
  ], undefined, ["restrained", "restrain"]),
  condition("Stunned", "Incapacitated; fail Strength and Dexterity saves.", [
    "You have the Incapacitated condition.",
    "You automatically fail Strength and Dexterity saving throws.",
    "Attack rolls against you have advantage.",
  ], "You also couldn't move and could speak only falteringly.", ["stunned", "stun"]),
  condition("Unconscious", "Incapacitated and Prone; unaware; hits within 5 feet are critical.", [
    "You have the Incapacitated and Prone conditions, and you drop whatever you're holding. When this condition ends, you remain Prone.",
    "Your speed is 0 and can't increase, and you're unaware of your surroundings.",
    "Attack rolls against you have advantage.",
    "You automatically fail Strength and Dexterity saving throws.",
    "Any attack roll that hits you is a critical hit if the attacker is within 5 feet of you.",
  ], undefined, ["unconscious"]),
];

const property = (name: string, weaponKey: string, summary: string, rules: string[], note2014?: string): RuleEntry => ({
  id: `property-${name.toLowerCase().replace(/[^a-z]+/g, "-")}`,
  name,
  kind: "Weapon Property",
  summary,
  rules,
  note2014,
  weaponKey,
});

export const WEAPON_PROPERTIES: RuleEntry[] = [
  property("Ammunition", "ammunition", "Needs ammunition to make a ranged attack.", [
    "You can use a weapon that has this property to make a ranged attack only if you have ammunition to fire from it. The type of ammunition required is specified with the weapon's range.",
    "Each attack expends one piece of ammunition. Drawing the ammunition is part of the attack (you need a free hand to load a one-handed weapon).",
    "After a fight, you can spend 1 minute to recover half the ammunition (round down) you used in the fight; the rest is lost.",
  ]),
  property("Finesse", "finesse", "Use Strength or Dexterity for attack and damage.", [
    "When making an attack with a Finesse weapon, use your choice of your Strength or Dexterity modifier for the attack and damage rolls. You must use the same modifier for both rolls.",
  ]),
  property("Heavy", "heavy", "Small creatures and weak wielders fight it at a disadvantage.", [
    "You have disadvantage on attack rolls with a Heavy weapon if it's a melee weapon and your Strength score isn't at least 13, or if it's a ranged weapon and your Dexterity score isn't at least 13.",
  ], "Small creatures had disadvantage on attack rolls with Heavy weapons instead."),
  property("Light", "light", "Make an extra attack with a second Light weapon.", [
    "When you take the Attack action on your turn and attack with a Light weapon, you can make one extra attack as a bonus action later on the same turn. That extra attack must be made with a different Light weapon, and you don't add your ability modifier to its damage unless that modifier is negative.",
  ], "This was two-weapon fighting: the bonus-action attack needed a Light weapon in each hand."),
  property("Loading", "loading", "Fire only one piece of ammunition per action, bonus action or reaction.", [
    "You can fire only one piece of ammunition from a Loading weapon when you use an action, a bonus action, or a reaction to fire it, regardless of the number of attacks you can normally make.",
  ]),
  property("Range", "range", "Normal range, then long range at disadvantage.", [
    "A Range weapon has a range in parentheses after the Ammunition or Thrown property. The range lists two numbers: the first is the weapon's normal range in feet, and the second is its long range.",
    "When attacking a target beyond normal range, you have disadvantage on the attack roll. You can't attack a target beyond the long range.",
  ]),
  property("Reach", "reach", "Adds 5 feet to your reach.", [
    "A Reach weapon adds 5 feet to your reach when you attack with it, as well as when determining your reach for Opportunity Attacks with it.",
  ]),
  property("Thrown", "thrown", "Throw it for a ranged attack using the same modifier.", [
    "If a weapon has the Thrown property, you can throw the weapon to make a ranged attack, and you can draw that weapon as part of the attack.",
    "If the weapon is a melee weapon, use the same ability modifier for the attack and damage rolls that you use for a melee attack with that weapon.",
  ]),
  property("Two-Handed", "twoHanded", "Requires two hands when you attack with it.", [
    "A Two-Handed weapon requires two hands when you attack with it.",
  ]),
  property("Versatile", "versatile", "Deals more damage when used with two hands.", [
    "A Versatile weapon can be used with one or two hands. A damage value in parentheses appears with the property; the weapon deals that damage when used with two hands to make a melee attack.",
  ]),
];

const mastery = (name: string, summary: string, rules: string[]): RuleEntry => ({
  id: `mastery-${name.toLowerCase()}`,
  name,
  kind: "Weapon Mastery",
  summary,
  rules,
  weaponKey: name,
  note2014: "Weapon mastery is a 2024 rule; the 2014 rules have no equivalent.",
});

export const WEAPON_MASTERIES: RuleEntry[] = [
  mastery("Cleave", "Hit a second creature next to the first.", [
    "If you hit a creature with a melee attack roll using this weapon, you can make a melee attack roll with the weapon against a second creature within 5 feet of the first that is also within your reach.",
    "On a hit, the second creature takes the weapon's damage, but don't add your ability modifier to that damage unless that modifier is negative. You can make this extra attack only once per turn.",
  ]),
  mastery("Graze", "Deal damage even on a miss.", [
    "If your attack roll with this weapon misses a creature, you can deal damage to that creature equal to the ability modifier you used to make the attack roll. This damage is the same type dealt by the weapon, and it can be increased only by increasing the ability modifier.",
  ]),
  mastery("Nick", "Make the Light extra attack as part of the Attack action.", [
    "When you make the extra attack of the Light property, you can make it as part of the Attack action instead of as a bonus action. You can make this extra attack only once per turn.",
  ]),
  mastery("Push", "Push a Large or smaller creature 10 feet away.", [
    "If you hit a creature with this weapon, you can push the creature up to 10 feet straight away from yourself if it is Large or smaller.",
  ]),
  mastery("Sap", "The target has disadvantage on its next attack.", [
    "If you hit a creature with this weapon, that creature has disadvantage on its next attack roll before the start of your next turn.",
  ]),
  mastery("Slow", "Reduce the target's speed by 10 feet.", [
    "If you hit a creature with this weapon and deal damage to it, you can reduce its speed by 10 feet until the start of your next turn. If the creature is hit more than once by weapons that have this property, the speed reduction doesn't exceed 10 feet.",
  ]),
  mastery("Topple", "Force a Constitution save or knock the target Prone.", [
    "If you hit a creature with this weapon, you can force the creature to make a Constitution saving throw (DC 8 plus the ability modifier used to make the attack roll and your Proficiency Bonus). On a failed save, the creature has the Prone condition.",
  ]),
  mastery("Vex", "Gain advantage on your next attack against the target.", [
    "If you hit a creature with this weapon and deal damage to the creature, you have advantage on your next attack roll against that creature before the end of your next turn.",
  ]),
];

const damage = (name: string, summary: string, example: string): RuleEntry => ({
  id: `damage-${name.toLowerCase()}`,
  name,
  kind: "Damage Type",
  summary,
  rules: [summary, `Examples: ${example}.`],
  weaponKey: name,
  keywords: [`${name.toLowerCase()} damage`],
});

export const DAMAGE_TYPES: RuleEntry[] = [
  damage("Acid", "Corrosive liquids, digestive enzymes.", "a black dragon's breath, dissolving ooze"),
  damage("Bludgeoning", "Blunt force — hammers, falling, constriction.", "a club, a giant's fist, a fall"),
  damage("Cold", "Freezing water, icy blasts.", "a white dragon's breath, Cone of Cold"),
  damage("Fire", "Flames, unbearable heat.", "a red dragon's breath, Fireball"),
  damage("Force", "Pure magical energy.", "Magic Missile, Spiritual Weapon"),
  damage("Lightning", "Electricity.", "a blue dragon's breath, Lightning Bolt"),
  damage("Necrotic", "Life-draining energy.", "a wraith's touch, Chill Touch"),
  damage("Piercing", "Fangs, puncturing objects.", "an arrow, a spear, a monster's bite"),
  damage("Poison", "Toxic gas, venom.", "a green dragon's breath, a spider's bite"),
  damage("Psychic", "Rending energy that assails the mind.", "a mind flayer's blast, Vicious Mockery"),
  damage("Radiant", "Holy energy, searing radiation.", "Guiding Bolt, an angel's weapon"),
  damage("Slashing", "Claws, cutting objects.", "a greatsword, a beast's claws"),
  damage("Thunder", "Concussive sound.", "Shatter, Thunderwave"),
];

export const RULES_REFERENCE: RuleEntry[] = [...CONDITIONS, ...WEAPON_PROPERTIES, ...WEAPON_MASTERIES, ...DAMAGE_TYPES];
