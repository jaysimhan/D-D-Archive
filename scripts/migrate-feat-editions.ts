/**
 * Gives every Player's Handbook feat the right mechanics for each ruleset.
 *
 * The Archive stored most PHB feats once, as "Both", carrying the 2024 rewrite:
 * a 2014 character saw Great Weapon Master hand out +1 Strength, and every 2024
 * General feat claimed it could be taken at level 1. The 2024 Handbook turned
 * nearly every General feat into a half feat (+1 to an ability, level 4+), kept
 * a few as Origin feats with no increase, and moved Fighting Styles and Epic
 * Boons into feat categories of their own.
 *
 * This writes, per feat:
 *   - feats in both Handbooks: `sameForBoth: false` plus `rules2014` and
 *     `rules2024` overlays (description, category, prerequisites, benefits)
 *   - feats in only one Handbook: their ruleset narrowed to that edition and
 *     the mechanics set on the document itself
 *   - supplement feats with a wrong or missing increase/prerequisite: fixed in place
 *
 * Usage:  npx tsx scripts/migrate-feat-editions.ts            (dry run)
 *         npx tsx scripts/migrate-feat-editions.ts --apply    (write)
 */
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const client = createClient({
    projectId: process.env.SANITY_API_PROJECT_ID || 'ylk0tk34',
    dataset: process.env.SANITY_API_DATASET || 'production',
    token: process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

type Ability = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';
type Category = 'Origin' | 'General' | 'Fighting Style' | 'Epic Boon';

interface Version {
    category: Category;
    description: string;
    features: string[];
    level?: number;
    /** Ability score minimums. With `anyOf`, one of them is enough ("Str or Dex 13+"). */
    scores?: Partial<Record<Ability, number>>;
    anyOf?: boolean;
    needs?: string[];
    race?: string[];
    /** A fixed +1, e.g. Durable's Constitution. */
    fixed?: Ability;
    /** A +1 the player places; an empty list means any ability. */
    half?: Ability[];
}

const RULESETS = {
    '2014': { _key: 'srd-2014', _ref: 'ruleset.srd-2014', _type: 'reference' },
    '2024': { _key: 'srd-2024', _ref: '86642d23-c52d-4577-adc1-214aab0f43e9', _type: 'reference' },
};

const ANY: Ability[] = [];
const PHYSICAL: Ability[] = ['STR', 'DEX'];
const MENTAL: Ability[] = ['INT', 'WIS', 'CHA'];

/** Sanity's shape for one version's mechanics. */
function fields(version: Version) {
    const prerequisites: Record<string, unknown> = {};
    if (version.level) prerequisites.level = version.level;
    if (version.scores) prerequisites.abilityScore = version.scores;
    if (version.anyOf) prerequisites.abilityScoreAnyOf = true;
    if (version.needs) prerequisites.features = version.needs;
    if (version.race) prerequisites.race = version.race;

    const benefits: Record<string, unknown> = { features: version.features };
    if (version.fixed) benefits.abilityScoreIncrease = { [version.fixed]: 1 };
    if (version.half) benefits.flexibleAbilityIncrease = { amount: 1, maxPerAbility: 1, options: version.half };

    return { description: version.description, featCategory: version.category, prerequisites, benefits };
}

// ===== Feats printed in both Handbooks (or Tasha's, reprinted in 2024) =====

const BOTH: Record<string, { y2014: Version; y2024: Version }> = {
    'feat-actor': {
        y2014: {
            category: 'General', fixed: 'CHA',
            description: '+1 Charisma. You have Advantage on Deception and Performance checks when passing yourself off as someone else, and you can mimic the speech of a person or the sounds of a creature you have heard.',
            features: ['+1 Charisma', 'Advantage on Deception and Performance checks while impersonating someone', 'Mimic speech and creature sounds you have heard'],
        },
        y2024: {
            category: 'General', level: 4, scores: { CHA: 13 }, fixed: 'CHA',
            description: '+1 Charisma. While disguised as a real or fictional person you have Advantage on Deception and Performance checks to convince others you are that person, and you can mimic sounds and speech you have heard.',
            features: ['+1 Charisma, to a maximum of 20', 'Advantage on Deception and Performance checks while disguised', 'Mimic sounds and speech you have heard for at least 1 minute'],
        },
    },
    'feat-athlete': {
        y2014: {
            category: 'General', half: PHYSICAL,
            description: '+1 Strength or Dexterity. Standing up from Prone costs only 5 feet of movement, climbing costs no extra movement, and a running jump needs only a 5-foot run-up.',
            features: ['+1 Strength or Dexterity', 'Stand up from Prone using 5 feet of movement', 'Climbing costs no extra movement', 'Running jump after moving only 5 feet'],
        },
        y2024: {
            category: 'General', level: 4, scores: { STR: 13, DEX: 13 }, anyOf: true, half: PHYSICAL,
            description: '+1 Strength or Dexterity. You gain a Climb Speed equal to your Speed, stand up from Prone using only 5 feet of movement, and make running jumps after moving only 5 feet.',
            features: ['+1 Strength or Dexterity, to a maximum of 20', 'Climb Speed equal to your Speed', 'Stand up from Prone using 5 feet of movement', 'Running jump after moving only 5 feet'],
        },
    },
    'feat-charger': {
        y2014: {
            category: 'General',
            description: 'When you take the Dash action, you can use a bonus action to make one melee weapon attack or shove a creature. If you moved at least 10 feet in a straight line first, the attack deals +5 damage or the shove pushes the target up to 10 feet.',
            features: ['Bonus action attack or shove after you Dash', '+5 damage or a 10-foot shove after moving 10 feet in a straight line'],
        },
        y2024: {
            category: 'General', level: 4, scores: { STR: 13, DEX: 13 }, anyOf: true, half: PHYSICAL,
            description: '+1 Strength or Dexterity. Dashing increases your Speed by 10 feet, and once per turn, after moving 10 feet in a straight line toward a target, a melee hit deals an extra 1d8 damage or pushes it 10 feet.',
            features: ['+1 Strength or Dexterity, to a maximum of 20', 'Dash increases your Speed by 10 feet', 'Charge Attack: +1d8 damage or a 10-foot push after moving 10 feet straight'],
        },
    },
    'feat-chef': {
        y2014: {
            category: 'General', half: ['CON', 'WIS'],
            description: '+1 Constitution or Wisdom and proficiency with Cook\'s Utensils. Cooking during a short rest lets allies regain an extra 1d8 hit points, and you can bake treats that grant temporary hit points equal to your proficiency bonus.',
            features: ['+1 Constitution or Wisdom', 'Proficiency with Cook\'s Utensils', 'Short rest meal: extra 1d8 hit points for those who spend Hit Dice', 'Treats grant temporary hit points equal to your proficiency bonus'],
        },
        y2024: {
            category: 'General', level: 4, half: ['CON', 'WIS'],
            description: '+1 Constitution or Wisdom and proficiency with Cook\'s Utensils. You can cook food that speeds recovery on a Short Rest or grants Temporary Hit Points.',
            features: ['+1 Constitution or Wisdom, to a maximum of 20', 'Proficiency with Cook\'s Utensils', 'Replenishing Meal: an extra 1d8 Hit Points on a Short Rest', 'Bolstering Treats grant Temporary Hit Points equal to your Proficiency Bonus'],
        },
    },
    'feat-crossbow-expert': {
        y2014: {
            category: 'General',
            description: 'You ignore the loading property of crossbows you are proficient with, being within 5 feet of a hostile creature doesn\'t impose Disadvantage on your ranged attacks, and attacking with a one-handed weapon lets you fire a hand crossbow as a bonus action.',
            features: ['Ignore the loading property of crossbows', 'No Disadvantage on ranged attacks within 5 feet of an enemy', 'Bonus action hand crossbow attack'],
        },
        y2024: {
            category: 'General', level: 4, scores: { DEX: 13 }, half: ['DEX'],
            description: '+1 Dexterity. You ignore the Loading property of crossbows, being within 5 feet of an enemy doesn\'t impose Disadvantage on your ranged attacks, and you add your ability modifier to the extra Light-weapon attack made with a crossbow.',
            features: ['+1 Dexterity, to a maximum of 20', 'Ignore the Loading property of crossbows', 'No Disadvantage on ranged attacks within 5 feet', 'Add your modifier to the extra Light attack with a crossbow'],
        },
    },
    'feat-crusher': {
        y2014: {
            category: 'General', half: ['STR', 'CON'],
            description: '+1 Strength or Constitution. Once per turn, a hit that deals bludgeoning damage can move the target 5 feet, and a bludgeoning critical hit gives attacks against the target Advantage until your next turn.',
            features: ['+1 Strength or Constitution', 'Move a creature 5 feet on a bludgeoning hit, once per turn', 'Bludgeoning critical hits grant Advantage on attacks against the target'],
        },
        y2024: {
            category: 'General', level: 4, half: ['STR', 'CON'],
            description: '+1 Strength or Constitution. Once per turn, a hit that deals Bludgeoning damage can push the target 5 feet, and your Bludgeoning critical hits give attacks against the target Advantage.',
            features: ['+1 Strength or Constitution, to a maximum of 20', 'Push a creature 5 feet on a Bludgeoning hit, once per turn', 'Critical hits give attackers Advantage against that creature'],
        },
    },
    'feat-defensive-duelist': {
        y2014: {
            category: 'General', scores: { DEX: 13 },
            description: 'When you are wielding a finesse weapon you are proficient with and a creature hits you with a melee attack, you can use your reaction to add your proficiency bonus to your AC for that attack.',
            features: ['Reaction adds your proficiency bonus to AC against one melee attack'],
        },
        y2024: {
            category: 'General', level: 4, scores: { DEX: 13 }, half: ['DEX'],
            description: '+1 Dexterity. While holding a Finesse weapon, you can take a Reaction when hit by a melee attack to add your Proficiency Bonus to your AC until the start of your next turn.',
            features: ['+1 Dexterity, to a maximum of 20', 'Parry: Reaction adds your Proficiency Bonus to AC'],
        },
    },
    'feat-dual-wielder': {
        y2014: {
            category: 'General',
            description: 'You gain +1 AC while wielding a separate melee weapon in each hand, you can fight with two weapons even when they aren\'t light, and you can draw or stow two one-handed weapons at once.',
            features: ['+1 AC while wielding two melee weapons', 'Two-weapon fighting with any one-handed melee weapons', 'Draw or stow two weapons at once'],
        },
        y2024: {
            category: 'General', level: 4, scores: { STR: 13, DEX: 13 }, anyOf: true, half: PHYSICAL,
            description: '+1 Strength or Dexterity. When you attack with a Light weapon, your Bonus Action attack can use a different weapon that lacks the Two-Handed property, and you can draw or stow two weapons at once.',
            features: ['+1 Strength or Dexterity, to a maximum of 20', 'Enhanced Dual Wielding with non-Light one-handed weapons', 'Quick Draw: draw or stow two weapons at once'],
        },
    },
    'feat-durable': {
        y2014: {
            category: 'General', fixed: 'CON',
            description: '+1 Constitution. When you roll a Hit Die to regain hit points, the minimum you regain equals twice your Constitution modifier (minimum 2).',
            features: ['+1 Constitution', 'Hit Dice restore at least twice your Constitution modifier'],
        },
        y2024: {
            category: 'General', level: 4, fixed: 'CON',
            description: '+1 Constitution. You have Advantage on Death Saving Throws, and you can spend a Hit Die as a Bonus Action to heal.',
            features: ['+1 Constitution, to a maximum of 20', 'Defy Death: Advantage on Death Saving Throws', 'Speedy Recovery: spend a Hit Die as a Bonus Action'],
        },
    },
    'feat-elemental-adept': {
        y2014: {
            category: 'General', needs: ['Spellcasting or Pact Magic'],
            description: 'Choose acid, cold, fire, lightning or thunder. Your spells ignore resistance to that damage type, and you treat any 1 rolled on its damage dice as a 2. You can take this feat more than once.',
            features: ['Spells ignore resistance to the chosen damage type', 'Treat 1s on that damage as 2s'],
        },
        y2024: {
            category: 'General', level: 4, needs: ['Spellcasting or Pact Magic'], half: MENTAL,
            description: '+1 Intelligence, Wisdom or Charisma. Choose Acid, Cold, Fire, Lightning or Thunder: your spells ignore Resistance to it, and you treat any 1 rolled for that damage as a 2. Repeatable.',
            features: ['+1 Intelligence, Wisdom or Charisma, to a maximum of 20', 'Spells ignore Resistance to the chosen damage type', 'Treat 1s on that damage as 2s'],
        },
    },
    'feat-feat-fey-touched-15': {
        y2014: {
            category: 'General', half: MENTAL,
            description: '+1 Intelligence, Wisdom or Charisma. You learn Misty Step and one 1st-level divination or enchantment spell; each can be cast once per long rest without a spell slot, and with your slots.',
            features: ['+1 Intelligence, Wisdom or Charisma', 'Learn Misty Step', 'Learn one 1st-level divination or enchantment spell', 'Cast each once per long rest without a slot'],
        },
        y2024: {
            category: 'General', level: 4, half: MENTAL,
            description: '+1 Intelligence, Wisdom or Charisma. You learn Misty Step plus one level-1 Divination or Enchantment spell, each castable once per Long Rest for free.',
            features: ['+1 Intelligence, Wisdom or Charisma, to a maximum of 20', 'Learn Misty Step', 'Learn one level-1 Divination or Enchantment spell', 'Cast each once per Long Rest without a slot'],
        },
    },
    'feat-feat-great-weapon-master-4': {
        y2014: {
            category: 'General',
            description: 'When you score a critical hit or reduce a creature to 0 hit points with a melee weapon, you can make one melee weapon attack as a bonus action. Before attacking with a heavy weapon you are proficient with, you can take -5 to hit for +10 damage.',
            features: ['Bonus action attack after a melee critical hit or kill', '-5 to hit for +10 damage with heavy weapons'],
        },
        y2024: {
            category: 'General', level: 4, scores: { STR: 13 }, half: ['STR'],
            description: '+1 Strength. When you hit with a Heavy weapon as part of the Attack action, add your Proficiency Bonus to the damage, and a critical hit or a kill with a melee weapon grants a Bonus Action attack.',
            features: ['+1 Strength, to a maximum of 20', 'Heavy Weapon Mastery: add your Proficiency Bonus to damage', 'Hew: Bonus Action attack after a critical hit or kill'],
        },
    },
    'feat-heavily-armored': {
        y2014: {
            category: 'General', needs: ['Proficiency with medium armor'], fixed: 'STR',
            description: '+1 Strength and proficiency with heavy armor.',
            features: ['+1 Strength', 'Proficiency with heavy armor'],
        },
        y2024: {
            category: 'General', level: 4, needs: ['Medium Armor training'], half: ['CON', 'STR'],
            description: '+1 Constitution or Strength and training with Heavy armor.',
            features: ['+1 Constitution or Strength, to a maximum of 20', 'Training with Heavy armor'],
        },
    },
    'feat-heavy-armor-master': {
        y2014: {
            category: 'General', needs: ['Proficiency with heavy armor'], fixed: 'STR',
            description: '+1 Strength. While you wear heavy armor, bludgeoning, piercing and slashing damage from nonmagical weapons is reduced by 3.',
            features: ['+1 Strength', 'Reduce nonmagical bludgeoning, piercing and slashing damage by 3 in heavy armor'],
        },
        y2024: {
            category: 'General', level: 4, needs: ['Heavy Armor training'], half: ['CON', 'STR'],
            description: '+1 Constitution or Strength. While you wear Heavy armor, Bludgeoning, Piercing and Slashing damage you take from attacks is reduced by your Proficiency Bonus.',
            features: ['+1 Constitution or Strength, to a maximum of 20', 'Reduce Bludgeoning, Piercing and Slashing damage by your Proficiency Bonus in Heavy armor'],
        },
    },
    'feat-inspiring-leader': {
        y2014: {
            category: 'General', scores: { CHA: 13 },
            description: 'You can spend 10 minutes inspiring up to six friendly creatures, including yourself. Each gains temporary hit points equal to your level + your Charisma modifier, once per short or long rest.',
            features: ['10-minute speech grants temporary hit points to up to six creatures'],
        },
        y2024: {
            category: 'General', level: 4, scores: { WIS: 13, CHA: 13 }, anyOf: true, half: ['WIS', 'CHA'],
            description: '+1 Wisdom or Charisma. When you finish a Short or Long Rest, you can give up to six allies Temporary Hit Points equal to your character level plus the modifier of the ability this feat increased.',
            features: ['+1 Wisdom or Charisma, to a maximum of 20', 'Bolstering Performance after a rest grants Temporary Hit Points to up to six creatures'],
        },
    },
    'feat-feat-keen-mind-20': {
        y2014: {
            category: 'General', fixed: 'INT',
            description: '+1 Intelligence. You always know which way is north and how many hours remain until sunrise or sunset, and you can accurately recall anything you have seen or heard within the past month.',
            features: ['+1 Intelligence', 'Always know north and the hours until sunrise or sunset', 'Perfect recall of the past month'],
        },
        y2024: {
            category: 'General', level: 4, scores: { INT: 13 }, fixed: 'INT',
            description: '+1 Intelligence. You gain proficiency (or Expertise) in one Intelligence skill, and you can take the Study action as a Bonus Action.',
            features: ['+1 Intelligence, to a maximum of 20', 'Proficiency or Expertise in Arcana, History, Investigation, Nature or Religion', 'Study as a Bonus Action'],
        },
    },
    'feat-lightly-armored': {
        y2014: {
            category: 'General', half: PHYSICAL,
            description: '+1 Strength or Dexterity and proficiency with light armor.',
            features: ['+1 Strength or Dexterity', 'Proficiency with light armor'],
        },
        y2024: {
            category: 'General', level: 4, half: PHYSICAL,
            description: '+1 Strength or Dexterity and training with Light armor and Shields.',
            features: ['+1 Strength or Dexterity, to a maximum of 20', 'Training with Light armor and Shields'],
        },
    },
    'feat-mage-slayer': {
        y2014: {
            category: 'General',
            description: 'When a creature within 5 feet of you casts a spell, you can use your reaction to make a melee weapon attack against it. Creatures you damage have Disadvantage on concentration saves, and you have Advantage on saves against spells cast within 5 feet of you.',
            features: ['Reaction attack against a nearby spellcaster', 'Your damage imposes Disadvantage on concentration saves', 'Advantage on saves against spells cast within 5 feet'],
        },
        y2024: {
            category: 'General', level: 4, half: PHYSICAL,
            description: '+1 Strength or Dexterity. A concentrating creature you damage has Disadvantage on its save to keep concentrating, and once per Long Rest you can turn a failed Intelligence, Wisdom or Charisma save into a success.',
            features: ['+1 Strength or Dexterity, to a maximum of 20', 'Concentration Breaker', 'Guarded Mind: succeed on a failed mental save once per Long Rest'],
        },
    },
    'feat-medium-armor-master': {
        y2014: {
            category: 'General', needs: ['Proficiency with medium armor'],
            description: 'Medium armor no longer imposes Disadvantage on your Stealth checks, and you can add up to 3 (rather than 2) from Dexterity to your AC in medium armor.',
            features: ['No Stealth Disadvantage in medium armor', 'Add up to 3 from Dexterity to AC in medium armor'],
        },
        y2024: {
            category: 'General', level: 4, needs: ['Medium Armor training'], half: PHYSICAL,
            description: '+1 Strength or Dexterity. While wearing Medium armor with a Dexterity of 16 or higher, you add 3 rather than 2 to your AC.',
            features: ['+1 Strength or Dexterity, to a maximum of 20', 'Dexterous Wearer: add up to 3 from Dexterity to AC in Medium armor'],
        },
    },
    'feat-moderately-armored': {
        y2014: {
            category: 'General', needs: ['Proficiency with light armor'], half: PHYSICAL,
            description: '+1 Strength or Dexterity and proficiency with medium armor and shields.',
            features: ['+1 Strength or Dexterity', 'Proficiency with medium armor and shields'],
        },
        y2024: {
            category: 'General', level: 4, needs: ['Light Armor training'], half: PHYSICAL,
            description: '+1 Strength or Dexterity and training with Medium armor and Shields.',
            features: ['+1 Strength or Dexterity, to a maximum of 20', 'Training with Medium armor and Shields'],
        },
    },
    'feat-mounted-combatant': {
        y2014: {
            category: 'General',
            description: 'While mounted you have Advantage on melee attacks against unmounted creatures smaller than your mount, you can redirect attacks on your mount to yourself, and your mount takes no damage on a successful Dexterity save (half on a failure).',
            features: ['Advantage on melee attacks against smaller unmounted creatures', 'Redirect an attack from your mount to yourself', 'Mount takes no damage on a successful Dexterity save'],
        },
        y2024: {
            category: 'General', level: 4, half: ['STR', 'DEX', 'WIS'],
            description: '+1 Strength, Dexterity or Wisdom. You strike more accurately from the saddle, can shield your mount with Evasion, and can redirect attacks from your mount to yourself.',
            features: ['+1 Strength, Dexterity or Wisdom, to a maximum of 20', 'Mounted Strike: Advantage against smaller unmounted creatures', 'Leap Aside: your mount gains Evasion', 'Veer: redirect an attack from your mount'],
        },
    },
    'feat-feat-observant-21': {
        y2014: {
            category: 'General', half: ['INT', 'WIS'],
            description: '+1 Intelligence or Wisdom. You can read lips, and you gain +5 to your passive Perception and passive Investigation.',
            features: ['+1 Intelligence or Wisdom', 'Read lips', '+5 to passive Perception and passive Investigation'],
        },
        y2024: {
            category: 'General', level: 4, scores: { INT: 13, WIS: 13 }, anyOf: true, half: ['INT', 'WIS'],
            description: '+1 Intelligence or Wisdom. You gain proficiency (or Expertise) in Insight, Investigation or Perception, and you can take the Search action as a Bonus Action.',
            features: ['+1 Intelligence or Wisdom, to a maximum of 20', 'Proficiency or Expertise in Insight, Investigation or Perception', 'Search as a Bonus Action'],
        },
    },
    'feat-piercer': {
        y2014: {
            category: 'General', half: PHYSICAL,
            description: '+1 Strength or Dexterity. Once per turn you can reroll one piercing damage die, and a piercing critical hit rolls one additional damage die.',
            features: ['+1 Strength or Dexterity', 'Reroll one piercing damage die once per turn', 'Piercing critical hits roll one extra damage die'],
        },
        y2024: {
            category: 'General', level: 4, half: PHYSICAL,
            description: '+1 Strength or Dexterity. Once per turn you can reroll one Piercing damage die, and a Piercing critical hit rolls one additional damage die.',
            features: ['+1 Strength or Dexterity, to a maximum of 20', 'Puncture: reroll one Piercing damage die once per turn', 'Enhanced Critical: one extra damage die'],
        },
    },
    'feat-poisoner': {
        y2014: {
            category: 'General',
            description: 'Your damage rolls ignore resistance to poison damage, you can coat a weapon or ammunition with poison as a bonus action, and you gain proficiency with the poisoner\'s kit and can brew potent poisons during a rest.',
            features: ['Ignore resistance to poison damage', 'Apply poison as a bonus action', 'Proficiency with the poisoner\'s kit; brew potent poison'],
        },
        y2024: {
            category: 'General', level: 4, half: ['DEX', 'INT'],
            description: '+1 Dexterity or Intelligence and proficiency with the Poisoner\'s Kit. Your poison damage ignores Resistance, and you can brew potent poison doses.',
            features: ['+1 Dexterity or Intelligence, to a maximum of 20', 'Proficiency with the Poisoner\'s Kit', 'Potent Poison ignores Resistance to Poison damage', 'Brew poison during a Long Rest'],
        },
    },
    'feat-feat-polearm-master-8': {
        y2014: {
            category: 'General',
            description: 'When you attack with a glaive, halberd, quarterstaff or spear, you can make a bonus action attack with the opposite end (1d4 bludgeoning), and creatures entering your reach provoke an opportunity attack.',
            features: ['Bonus action attack with the butt end (1d4)', 'Opportunity attack when a creature enters your reach'],
        },
        y2024: {
            category: 'General', level: 4, scores: { STR: 13, DEX: 13 }, anyOf: true, half: PHYSICAL,
            description: '+1 Strength or Dexterity. After attacking with a Quarterstaff, Spear or Heavy Reach weapon you can strike with the butt end as a Bonus Action, and creatures entering your reach provoke a Reaction attack.',
            features: ['+1 Strength or Dexterity, to a maximum of 20', 'Pole Strike: Bonus Action attack for 1d4', 'Reactive Strike when a creature enters your reach'],
        },
    },
    'feat-feat-resilient-10': {
        y2014: {
            category: 'General', half: ANY,
            description: 'Choose one ability score. It increases by 1, and you gain proficiency in saving throws using that ability.',
            features: ['+1 to the chosen ability score', 'Saving throw proficiency with that ability'],
        },
        y2024: {
            category: 'General', level: 4, half: ANY,
            description: 'Choose an ability in which you lack saving throw proficiency. It increases by 1, and you gain proficiency in saving throws using it.',
            features: ['+1 to the chosen ability, to a maximum of 20', 'Saving throw proficiency with that ability'],
        },
    },
    'feat-ritual-caster': {
        y2014: {
            category: 'General', scores: { INT: 13, WIS: 13 }, anyOf: true,
            description: 'Choose bard, cleric, druid, sorcerer, warlock or wizard. You gain a ritual book holding two 1st-level ritual spells from that list, and you can copy further ritual spells of that class into it.',
            features: ['Ritual book with two 1st-level ritual spells', 'Copy further ritual spells you find into the book'],
        },
        y2024: {
            category: 'General', level: 4, scores: { INT: 13, WIS: 13, CHA: 13 }, anyOf: true, half: MENTAL,
            description: '+1 Intelligence, Wisdom or Charisma. You always have a number of level-1 Ritual spells prepared equal to your Proficiency Bonus, and once per Long Rest you can cast one without the extra 10 minutes.',
            features: ['+1 Intelligence, Wisdom or Charisma, to a maximum of 20', 'Ritual spells prepared equal to your Proficiency Bonus', 'Quick Ritual once per Long Rest'],
        },
    },
    'feat-feat-sentinel-7': {
        y2014: {
            category: 'General',
            description: 'Creatures you hit with an opportunity attack have speed 0 for the turn, the Disengage action doesn\'t protect them from you, and you can use your reaction to attack a creature within 5 feet that attacks someone other than you.',
            features: ['Opportunity attack hits reduce speed to 0', 'Disengage doesn\'t avoid your opportunity attacks', 'Reaction attack when a nearby creature attacks someone else'],
        },
        y2024: {
            category: 'General', level: 4, scores: { STR: 13, DEX: 13 }, anyOf: true, half: PHYSICAL,
            description: '+1 Strength or Dexterity. Your Opportunity Attacks stop creatures in their tracks and ignore Disengage, and you can strike a creature that attacks someone other than you.',
            features: ['+1 Strength or Dexterity, to a maximum of 20', 'Halt: Opportunity Attack reduces Speed to 0', 'Guardian: Reaction attack against a creature that attacks an ally'],
        },
    },
    'feat-feat-shadow-touched-16': {
        y2014: {
            category: 'General', half: MENTAL,
            description: '+1 Intelligence, Wisdom or Charisma. You learn Invisibility and one 1st-level illusion or necromancy spell; each can be cast once per long rest without a spell slot, and with your slots.',
            features: ['+1 Intelligence, Wisdom or Charisma', 'Learn Invisibility', 'Learn one 1st-level illusion or necromancy spell', 'Cast each once per long rest without a slot'],
        },
        y2024: {
            category: 'General', level: 4, half: MENTAL,
            description: '+1 Intelligence, Wisdom or Charisma. You learn Invisibility plus one level-1 Illusion or Necromancy spell, each castable once per Long Rest for free.',
            features: ['+1 Intelligence, Wisdom or Charisma, to a maximum of 20', 'Learn Invisibility', 'Learn one level-1 Illusion or Necromancy spell', 'Cast each once per Long Rest without a slot'],
        },
    },
    'feat-feat-sharpshooter-5': {
        y2014: {
            category: 'General',
            description: 'Long range doesn\'t impose Disadvantage on your ranged weapon attacks, they ignore half and three-quarters cover, and before attacking with a ranged weapon you are proficient with you can take -5 to hit for +10 damage.',
            features: ['No Disadvantage at long range', 'Ignore half and three-quarters cover', '-5 to hit for +10 damage with ranged weapons'],
        },
        y2024: {
            category: 'General', level: 4, scores: { DEX: 13 }, half: ['DEX'],
            description: '+1 Dexterity. Your ranged weapon attacks ignore Half and Three-Quarters Cover, and neither long range nor an enemy within 5 feet imposes Disadvantage on them.',
            features: ['+1 Dexterity, to a maximum of 20', 'Bypass Cover', 'Firing in Melee: no Disadvantage within 5 feet', 'Long Shots: no Disadvantage at long range'],
        },
    },
    'feat-shield-master': {
        y2014: {
            category: 'General',
            description: 'After taking the Attack action you can shove with your shield as a bonus action, you add its AC bonus to Dexterity saves against effects that target only you, and you can use your reaction to take no damage on a successful Dexterity save.',
            features: ['Bonus action shield shove after the Attack action', 'Shield bonus applies to single-target Dexterity saves', 'Reaction: no damage on a successful Dexterity save'],
        },
        y2024: {
            category: 'General', level: 4, needs: ['Shield training'], half: ['STR'],
            description: '+1 Strength. Once per turn, a melee hit lets you bash with your shield to push the target or knock it Prone, and you can interpose your shield to take no damage on a successful Dexterity save.',
            features: ['+1 Strength, to a maximum of 20', 'Shield Bash: push 5 feet or knock Prone', 'Interpose Shield: no damage on a successful Dexterity save'],
        },
    },
    'feat-skill-expert': {
        y2014: {
            category: 'General', half: ANY,
            description: '+1 to one ability score of your choice, proficiency in one skill, and Expertise in one skill you are proficient with.',
            features: ['+1 to one ability score', 'Proficiency in one skill', 'Expertise in one skill'],
        },
        y2024: {
            category: 'General', level: 4, half: ANY,
            description: '+1 to one ability score of your choice, proficiency in one skill, and Expertise in one skill you are proficient with.',
            features: ['+1 to one ability score, to a maximum of 20', 'Proficiency in one skill', 'Expertise in one skill'],
        },
    },
    'feat-skulker': {
        y2014: {
            category: 'General', scores: { DEX: 13 },
            description: 'You can hide when only lightly obscured, missing with a ranged weapon attack while hidden doesn\'t reveal your position, and dim light doesn\'t impose Disadvantage on your Perception checks.',
            features: ['Hide while only lightly obscured', 'Missing a ranged attack doesn\'t reveal you', 'Dim light doesn\'t hinder your Perception'],
        },
        y2024: {
            category: 'General', level: 4, scores: { DEX: 13 }, half: ['DEX'],
            description: '+1 Dexterity. You have Blindsight out to 10 feet, Advantage on Stealth checks to Hide in combat, and missing an attack while hidden doesn\'t reveal you.',
            features: ['+1 Dexterity, to a maximum of 20', 'Blindsight 10 feet', 'Fog of War: Advantage on Stealth to Hide in combat', 'Sniper: a miss doesn\'t reveal you'],
        },
    },
    'feat-slasher': {
        y2014: {
            category: 'General', half: PHYSICAL,
            description: '+1 Strength or Dexterity. Once per turn a slashing hit reduces the target\'s speed by 10 feet, and a slashing critical hit gives the target Disadvantage on attacks until your next turn.',
            features: ['+1 Strength or Dexterity', 'Slashing hits reduce speed by 10 feet, once per turn', 'Slashing critical hits impose Disadvantage on the target\'s attacks'],
        },
        y2024: {
            category: 'General', level: 4, half: PHYSICAL,
            description: '+1 Strength or Dexterity. Once per turn a Slashing hit reduces the target\'s Speed by 10 feet, and a Slashing critical hit gives the target Disadvantage on attack rolls.',
            features: ['+1 Strength or Dexterity, to a maximum of 20', 'Hamstring: reduce Speed by 10 feet', 'Enhanced Critical: Disadvantage on the target\'s attacks'],
        },
    },
    'feat-spell-sniper': {
        y2014: {
            category: 'General', needs: ['Spellcasting or Pact Magic'],
            description: 'Spells that require an attack roll have double range and ignore half and three-quarters cover, and you learn one attack-roll cantrip from a class spell list of your choice.',
            features: ['Double range for attack-roll spells', 'Ignore half and three-quarters cover', 'Learn one attack-roll cantrip'],
        },
        y2024: {
            category: 'General', level: 4, needs: ['Spellcasting or Pact Magic'], half: MENTAL,
            description: '+1 Intelligence, Wisdom or Charisma. Being within 5 feet of an enemy doesn\'t impose Disadvantage on your spell attacks, they ignore Half and Three-Quarters Cover, and their range increases by 60 feet.',
            features: ['+1 Intelligence, Wisdom or Charisma, to a maximum of 20', 'Bypass Cover', 'Casting in Melee', 'Increased Range: +60 feet'],
        },
    },
    'feat-feat-telekinetic-17': {
        y2014: {
            category: 'General', half: MENTAL,
            description: '+1 Intelligence, Wisdom or Charisma. You learn an invisible Mage Hand with 30 feet more range, and as a bonus action you can shove a creature within 30 feet 5 feet (Strength save).',
            features: ['+1 Intelligence, Wisdom or Charisma', 'Invisible Mage Hand, +30 feet range', 'Bonus action telekinetic shove'],
        },
        y2024: {
            category: 'General', level: 4, half: MENTAL,
            description: '+1 Intelligence, Wisdom or Charisma. You learn Mage Hand (invisible, no components) and can telekinetically shove a creature 5 feet as a Bonus Action.',
            features: ['+1 Intelligence, Wisdom or Charisma, to a maximum of 20', 'Minor Telekinesis: Mage Hand', 'Telekinetic Shove as a Bonus Action'],
        },
    },
    'feat-telepathic': {
        y2014: {
            category: 'General', half: MENTAL,
            description: '+1 Intelligence, Wisdom or Charisma. You can speak telepathically to a creature within 60 feet, and you can cast Detect Thoughts once per long rest without a slot.',
            features: ['+1 Intelligence, Wisdom or Charisma', 'Telepathic speech within 60 feet', 'Detect Thoughts once per long rest'],
        },
        y2024: {
            category: 'General', level: 4, half: MENTAL,
            description: '+1 Intelligence, Wisdom or Charisma. You can speak telepathically to a creature within 60 feet and cast Detect Thoughts once per Long Rest for free.',
            features: ['+1 Intelligence, Wisdom or Charisma, to a maximum of 20', 'Telepathic Utterance within 60 feet', 'Detect Thoughts once per Long Rest'],
        },
    },
    'feat-feat-war-caster-3': {
        y2014: {
            category: 'General', needs: ['Spellcasting or Pact Magic'],
            description: 'You have Advantage on Constitution saves to maintain concentration, can perform somatic components with weapons or a shield in hand, and can cast a spell in place of an opportunity attack.',
            features: ['Advantage on concentration saves', 'Somatic components with your hands full', 'Cast a spell as an opportunity attack'],
        },
        y2024: {
            category: 'General', level: 4, needs: ['Spellcasting or Pact Magic'], half: MENTAL,
            description: '+1 Intelligence, Wisdom or Charisma. You have Advantage on saves to maintain Concentration, can cast with your hands full, and can answer a fleeing enemy with a spell.',
            features: ['+1 Intelligence, Wisdom or Charisma, to a maximum of 20', 'Concentration: Advantage on saves', 'Reactive Spell instead of an Opportunity Attack', 'Somatic Components with hands full'],
        },
    },
    'feat-weapon-master': {
        y2014: {
            category: 'General', half: PHYSICAL,
            description: '+1 Strength or Dexterity and proficiency with four weapons of your choice.',
            features: ['+1 Strength or Dexterity', 'Proficiency with four weapons of your choice'],
        },
        y2024: {
            category: 'General', level: 4, half: PHYSICAL,
            description: '+1 Strength or Dexterity, and you can use the Mastery property of one kind of weapon you are proficient with, changing it after a Long Rest.',
            features: ['+1 Strength or Dexterity, to a maximum of 20', 'Mastery property of one kind of weapon'],
        },
    },
    'feat-grappler': {
        y2014: {
            category: 'General', scores: { STR: 13 },
            description: 'You have Advantage on attack rolls against a creature you are grappling, and you can use your action to try to pin it: on a successful grapple check, you and the creature are both Restrained until the grapple ends.',
            features: ['Advantage on attacks against a creature you are grappling', 'Pin a grappled creature (both Restrained)'],
        },
        y2024: {
            category: 'General', level: 4, scores: { STR: 13, DEX: 13 }, anyOf: true, half: PHYSICAL,
            description: '+1 Strength or Dexterity. An Unarmed Strike can both damage and grapple, you have Advantage on attacks against a creature you are grappling, and moving it costs no extra movement.',
            features: ['+1 Strength or Dexterity, to a maximum of 20', 'Punch and Grab', 'Attack Advantage against a creature you grapple', 'Fast Wrestler'],
        },
    },
};

// ===== Feats printed in only one Handbook =====

const ONLY_2014: Record<string, Version> = {
    'feat-alert': {
        category: 'General',
        description: 'Always on the lookout for danger: +5 to initiative, you can\'t be surprised while conscious, and creatures you can\'t see don\'t gain Advantage on attacks against you for being unseen.',
        features: ['+5 bonus to initiative', 'Can\'t be surprised while conscious', 'Unseen attackers don\'t gain Advantage against you'],
    },
    'feat-tavern-brawler': {
        category: 'General', half: ['STR', 'CON'],
        description: '+1 Strength or Constitution. You are proficient with improvised weapons, your unarmed strike deals 1d4, and after hitting with an unarmed strike or improvised weapon you can try to grapple as a bonus action.',
        features: ['+1 Strength or Constitution', 'Proficiency with improvised weapons', 'Unarmed strike deals 1d4', 'Bonus action grapple after a hit'],
    },
    'feat-dungeon-delver': {
        category: 'General',
        description: 'You have Advantage on checks to detect secret doors and on saves against traps, resistance to trap damage, and you can search for traps while travelling at a normal pace.',
        features: ['Advantage to find secret doors', 'Advantage on saves against traps and resistance to their damage', 'Search for traps at a normal pace'],
    },
    'feat-linguist': {
        category: 'General', fixed: 'INT',
        description: '+1 Intelligence. You learn three languages of your choice and can create written ciphers.',
        features: ['+1 Intelligence', 'Learn three languages', 'Create written ciphers'],
    },
    'feat-martial-adept': {
        category: 'General',
        description: 'You learn two maneuvers from the Battle Master archetype and gain one superiority die (d6), regained on a short or long rest.',
        features: ['Learn two Battle Master maneuvers', 'One d6 superiority die per short rest'],
    },
    'feat-mobile': {
        category: 'General',
        description: 'Your speed increases by 10 feet, difficult terrain doesn\'t slow your Dash, and a creature you make a melee attack against can\'t make opportunity attacks against you for the rest of the turn.',
        features: ['+10 feet speed', 'Dash ignores difficult terrain', 'No opportunity attacks from creatures you attacked in melee'],
    },
};

const ONLY_2024: Record<string, Partial<Version> & { level?: number }> = {
    // Origin feats carry no increase in 2024.
    'feat-alert-2024': {
        category: 'Origin', level: 1,
        description: 'Add your Proficiency Bonus to Initiative. Immediately after rolling Initiative, you may swap it with one willing ally in the same combat.',
        features: ['Initiative Proficiency', 'Initiative Swap with a willing ally'],
    },
    'feat-tavern-brawler-2024': {
        category: 'Origin', level: 1,
        description: 'Your Unarmed Strike deals 1d4 damage, you reroll 1s on its damage dice, you are proficient with improvised weapons, and once per turn you can push a creature you hit 5 feet.',
        features: ['Enhanced Unarmed Strike: 1d4', 'Damage Rerolls on 1s', 'Improvised Weaponry', 'Push 5 feet once per turn'],
    },
    'feat-martial-weapon-training': {
        category: 'General', level: 4, half: PHYSICAL,
        description: '+1 Strength or Dexterity and proficiency with Martial weapons.',
        features: ['+1 Strength or Dexterity, to a maximum of 20', 'Proficiency with Martial weapons'],
    },
    'feat-speedy': {
        category: 'General', level: 4, scores: { DEX: 13, CON: 13 }, anyOf: true, half: ['DEX', 'CON'],
        description: '+1 Dexterity or Constitution. Your Speed increases by 10 feet, Dashing ignores Difficult Terrain, and Opportunity Attacks against you have Disadvantage.',
        features: ['+1 Dexterity or Constitution, to a maximum of 20', 'Speed Increase: +10 feet', 'Dash over Difficult Terrain', 'Agile Movement: Opportunity Attacks against you have Disadvantage'],
    },
    // Fighting Styles are class features in 2014, feats only from 2024.
    'feat-blind-fighting': { category: 'Fighting Style', level: undefined },
    'feat-dueling': { category: 'Fighting Style', level: undefined },
    'feat-interception': { category: 'Fighting Style', level: undefined },
    'feat-protection': { category: 'Fighting Style', level: undefined },
    'feat-thrown-weapon-fighting': { category: 'Fighting Style', level: undefined },
    'feat-unarmed-fighting': { category: 'Fighting Style', level: undefined },
    // The 2014 DMG's boons are DM rewards, not feats a player picks.
    'feat-boon-of-fortitude-2024': { category: 'Epic Boon', level: 19, half: ANY },
    'feat-boon-of-recovery-2024': { category: 'Epic Boon', level: 19, half: ANY },
    'feat-boon-of-skill-2024': { category: 'Epic Boon', level: 19, half: ANY },
    'feat-boon-of-speed-2024': { category: 'Epic Boon', level: 19, half: ANY },
};

/** The rest of the 2024 Epic Boons; each raises one score (up to 30). */
const EPIC_BOONS_2024: Record<string, string[]> = {
    'feat-boon-of-combat-prowess-2024': [],
    'feat-boon-of-dimensional-travel-2024': [],
    'feat-boon-of-fate-2024': [],
    'feat-boon-of-irresistible-offense-2024': ['STR', 'DEX'],
    'feat-boon-of-truesight-2024': [],
    'feat-boon-of-the-night-spirit-2024': [],
};

const NEW_BOONS = [
    {
        _id: 'feat-boon-of-energy-resistance-2024',
        name: 'Boon of Energy Resistance',
        options: [] as string[],
        needs: undefined as string[] | undefined,
        description: '+1 to one ability score (to a maximum of 30). You gain Resistance to two damage types of your choice from Acid, Cold, Fire, Lightning, Necrotic, Poison, Psychic, Radiant and Thunder, and when you take damage of one of them you can use your Reaction to force a nearby creature to save or take 2d12 + your Constitution modifier of that type.',
        features: ['+1 to one ability score, to a maximum of 30', 'Energy Resistances: two damage types', 'Energy Redirection as a Reaction'],
    },
    {
        _id: 'feat-boon-of-spell-recall-2024',
        name: 'Boon of Spell Recall',
        options: ['INT', 'WIS', 'CHA'],
        needs: ['Spellcasting feature'],
        description: '+1 Intelligence, Wisdom or Charisma (to a maximum of 30). Once per Long Rest, you can cast a prepared spell using a level 1-4 spell slot without expending the slot.',
        features: ['+1 Intelligence, Wisdom or Charisma, to a maximum of 30', 'Free Casting: one level 1-4 slot spell per Long Rest without expending the slot'],
    },
];

/** Supplement feats (Xanathar's, Tasha's, Eberron) that are the same in both rulesets but stored wrong. */
const SUPPLEMENT_FIXES: Record<string, Record<string, unknown>> = {
    'feat-dwarven-fortitude': { 'benefits.abilityScoreIncrease': { CON: 1 }, 'prerequisites.race': ['dwarf'] },
    'feat-infernal-constitution': { 'benefits.abilityScoreIncrease': { CON: 1 }, 'prerequisites.race': ['tiefling'] },
    'feat-gunner': { 'benefits.abilityScoreIncrease': { DEX: 1 } },
    'feat-bountiful-luck': { 'prerequisites.race': ['halfling'] },
    'feat-dragon-fear': { 'prerequisites.race': ['dragonborn'] },
    'feat-dragon-hide': { 'prerequisites.race': ['dragonborn'] },
    'feat-drow-high-magic': { 'prerequisites.race': ['drow'] },
    'feat-fade-away': { 'prerequisites.race': ['gnome'] },
    'feat-fey-teleportation': { 'prerequisites.race': ['high elf'] },
    'feat-flames-of-phlegethos': { 'prerequisites.race': ['tiefling'] },
    'feat-orcish-fury': { 'prerequisites.race': ['half-orc', 'orc'] },
    'feat-prodigy': { 'prerequisites.race': ['half-elf', 'half-orc', 'human'] },
    'feat-second-chance': { 'prerequisites.race': ['halfling'] },
    'feat-squat-nimbleness': { 'prerequisites.race': ['dwarf', 'gnome', 'halfling'] },
    'feat-svirfneblin-magic': { 'prerequisites.race': ['deep gnome', 'svirfneblin'] },
    'feat-wood-elf-magic': { 'prerequisites.race': ['wood elf'] },
    'feat-revenant-blade': { 'prerequisites.race': ['elf'] },
};

// ===== Writing =====

const apply = process.argv.includes('--apply');

async function main() {
    const ids = [
        ...Object.keys(BOTH), ...Object.keys(ONLY_2014), ...Object.keys(ONLY_2024),
        ...Object.keys(EPIC_BOONS_2024), ...Object.keys(SUPPLEMENT_FIXES),
    ];
    const docs = await client.fetch<{ _id: string; _rev: string; name: string; prerequisites?: any; benefits?: any }[]>(
        '*[_id in $ids]{_id, _rev, name, prerequisites, benefits}', { ids },
    );
    const byId = new Map(docs.map((doc) => [doc._id, doc]));
    const missing = ids.filter((id) => !byId.has(id));
    if (missing.length) throw new Error(`Missing feat documents: ${missing.join(', ')}`);

    let transaction = client.transaction();
    const log: string[] = [];

    for (const [id, { y2014, y2024 }] of Object.entries(BOTH)) {
        const doc = byId.get(id)!;
        transaction = transaction.patch(id, (p) => p.ifRevisionId(doc._rev).set({
            // The shared fields mirror 2024, so a view without a ruleset still reads current rules.
            ...fields(y2024),
            edition: 'Both',
            sameForBoth: false,
            rulesets: [RULESETS['2014'], RULESETS['2024']],
            rules2014: fields(y2014),
            rules2024: fields(y2024),
        }));
        log.push(`both   ${doc.name}: 2014 ${weight(y2014)} / 2024 ${weight(y2024)}`);
    }

    for (const [id, version] of Object.entries(ONLY_2014)) {
        const doc = byId.get(id)!;
        transaction = transaction.patch(id, (p) => p.ifRevisionId(doc._rev)
            .set({ ...fields(version), edition: '2014', sameForBoth: true, rulesets: [RULESETS['2014']] })
            .unset(['rules2014', 'rules2024', 'ruleset']));
        log.push(`2014   ${doc.name}: ${weight(version)}`);
    }

    for (const [id, change] of Object.entries(ONLY_2024)) {
        const doc = byId.get(id)!;
        const set: Record<string, unknown> = {
            edition: '2024', sameForBoth: true, rulesets: [RULESETS['2024']], featCategory: change.category,
        };
        if (change.description) set.description = change.description;
        if (change.features) set['benefits.features'] = change.features;
        if (change.level !== undefined) set['prerequisites.level'] = change.level;
        if (change.scores) set['prerequisites.abilityScore'] = change.scores;
        if (change.anyOf) set['prerequisites.abilityScoreAnyOf'] = true;
        if (change.half) set['benefits.flexibleAbilityIncrease'] = { amount: 1, maxPerAbility: 1, options: change.half };
        const unset = ['rules2014', 'rules2024', 'ruleset'];
        // Origin feats lose the +1 the old record gave them.
        if (change.category === 'Origin') unset.push('benefits.flexibleAbilityIncrease', 'benefits.abilityScoreIncrease');
        // A Fighting Style feat has no level requirement, only the class feature.
        if (change.category === 'Fighting Style') unset.push('prerequisites.level');
        transaction = transaction.patch(id, (p) => p.ifRevisionId(doc._rev).set(set).unset(unset));
        log.push(`2024   ${doc.name}: ${change.category}${change.half ? ', half feat' : ''}`);
    }

    for (const [id, options] of Object.entries(EPIC_BOONS_2024)) {
        const doc = byId.get(id)!;
        transaction = transaction.patch(id, (p) => p.ifRevisionId(doc._rev).set({
            featCategory: 'Epic Boon',
            'prerequisites.level': 19,
            'benefits.flexibleAbilityIncrease': { amount: 1, maxPerAbility: 1, options },
        }));
        log.push(`boon   ${doc.name}`);
    }

    for (const boon of NEW_BOONS) {
        transaction = transaction.createIfNotExists({
            _id: boon._id,
            _type: 'feat',
            name: boon.name,
            slug: { _type: 'slug', current: boon._id.replace(/^feat-/, '') },
            description: boon.description,
            featCategory: 'Epic Boon',
            prerequisites: { level: 19, ...(boon.needs ? { features: boon.needs } : {}) },
            benefits: { features: boon.features, flexibleAbilityIncrease: { amount: 1, maxPerAbility: 1, options: boon.options } },
            source: 'Official',
            edition: '2024',
            sameForBoth: true,
            version: 1,
            rulesets: [RULESETS['2024']],
        });
        log.push(`new    ${boon.name}`);
    }

    for (const [id, set] of Object.entries(SUPPLEMENT_FIXES)) {
        const doc = byId.get(id)!;
        transaction = transaction.patch(id, (p) => p.ifRevisionId(doc._rev).set(set));
        log.push(`fix    ${doc.name}: ${Object.keys(set).join(', ')}`);
    }

    console.log(log.join('\n'));
    console.log(`\n${log.length} feat changes.`);
    if (!apply) {
        console.log('Dry run — pass --apply to write.');
        return;
    }
    await transaction.commit();
    console.log('Applied.');
}

function weight(version: Version): string {
    if (version.half) return `half feat (+1 ${version.half.length ? version.half.join('/') : 'any'})`;
    if (version.fixed) return `half feat (+1 ${version.fixed})`;
    return 'full feat';
}

main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
});
