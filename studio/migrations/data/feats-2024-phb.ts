/**
 * The 2024 Player's Handbook feat list, as the Archive stores it.
 *
 * Kept as data rather than inline in the migration so the catalogue can be read
 * and corrected on its own. Descriptions are deliberately short — the Archive
 * shows them as a summary line — and `features` carries the mechanical bullets
 * the character sheet prints.
 *
 * `ability` is how the feat raises a score:
 *   { fixed: { CHA: 1 } }                        one named score
 *   { flex: ['STR', 'DEX'] }                     +1 to one of these
 *   { flex: [], amount: 2, maxPerAbility: 2 }    the Ability Score Improvement feat
 */

export type FeatCategory = 'Origin' | 'General' | 'Fighting Style' | 'Epic Boon'

export interface FeatSeed {
  name: string
  slug: string
  category: FeatCategory
  /** Minimum character level. Defaults per category: Origin 1, General 4, Epic Boon 19. */
  level?: number
  ability?: {
    fixed?: Record<string, number>
    flex?: string[]
    amount?: number
    maxPerAbility?: number
  }
  /** Ability score prerequisite, e.g. { DEX: 13 }. */
  prereqAbility?: Record<string, number>
  /** Feature prerequisites in print, e.g. 'Spellcasting or Pact Magic'. */
  prereqFeatures?: string[]
  /** True for feats the rules allow taking more than once. */
  repeatable?: boolean
  features: string[]
  description: string
}

const ORIGIN: FeatSeed[] = [
  {
    name: 'Alert', slug: 'alert-2024', category: 'Origin',
    features: ['Add Proficiency Bonus to Initiative', 'Swap Initiative with a willing ally'],
    description: 'Add your Proficiency Bonus to Initiative. Immediately after rolling Initiative, you may swap it with one willing, non-incapacitated ally in the same combat.',
  },
  {
    name: 'Crafter', slug: 'crafter-2024', category: 'Origin',
    features: ["Proficiency with 3 Artisan's Tools", '20% discount on nonmagical purchases', 'Fast Crafting once per Long Rest'],
    description: "You gain proficiency with three Artisan's Tools of your choice, buy nonmagical items at a discount, and can craft simple gear quickly after a Long Rest.",
  },
  {
    name: 'Healer', slug: 'healer-2024', category: 'Origin',
    features: ["Battle Medic: Healer's Kit heals 1d6 + Proficiency Bonus + target's Hit Dice", 'Reroll any 1 on a healing die'],
    description: "You can use a Healer's Kit as a Utilize action to restore Hit Points, and you reroll any 1 you roll on a die that restores Hit Points.",
  },
  {
    name: 'Lucky', slug: 'lucky-2024', category: 'Origin',
    features: ['Luck Points equal to Proficiency Bonus', 'Spend a point for Advantage, or to impose Disadvantage', 'Points return on a Long Rest'],
    description: 'You have Luck Points equal to your Proficiency Bonus, spendable to give yourself Advantage on a D20 Test or to impose Disadvantage on an attack against you. They return after a Long Rest.',
  },
  {
    name: 'Magic Initiate', slug: 'magic-initiate', category: 'Origin', repeatable: true,
    features: ['2 cantrips from the chosen class list', '1 level-1 spell, castable once per Long Rest', 'Choose Cleric, Druid or Wizard'],
    description: 'You learn two cantrips and one level-1 spell from the Cleric, Druid or Wizard list. The level-1 spell can be cast once per Long Rest without a slot.',
  },
  {
    name: 'Musician', slug: 'musician-2024', category: 'Origin',
    features: ['Proficiency with 3 Musical Instruments', 'Encouraging Song grants Heroic Inspiration after a Rest'],
    description: 'You gain proficiency with three Musical Instruments, and playing one at the end of a Short or Long Rest grants Heroic Inspiration to allies who hear it.',
  },
  {
    name: 'Savage Attacker', slug: 'savage-attacker-2024', category: 'Origin',
    features: ['Once per turn, reroll a weapon attack’s damage dice and use either total'],
    description: "Once per turn when you hit with a weapon, you can roll the weapon's damage dice twice and use either roll.",
  },
  {
    name: 'Skilled', slug: 'skilled-2024', category: 'Origin', repeatable: true,
    features: ['3 proficiencies from any mix of skills and tools'],
    description: 'You gain proficiency in any combination of three skills or tools of your choice.',
  },
  {
    name: 'Tavern Brawler', slug: 'tavern-brawler-2024', category: 'Origin',
    features: ['Unarmed Strike deals 1d4', 'Reroll a damage die of 1 once per turn', 'Improvised weapon proficiency', 'Push a Large or smaller creature 5 feet'],
    description: 'Your Unarmed Strike uses a d4 for damage, you reroll a 1 on a damage die once per turn, you are proficient with improvised weapons, and you can push a creature you hit.',
  },
  {
    name: 'Tough', slug: 'tough-2024', category: 'Origin',
    features: ['Hit Point maximum increases by twice your character level'],
    description: 'Your Hit Point maximum increases by an amount equal to twice your character level, and by 2 again each level thereafter.',
  },
]

const GENERAL: FeatSeed[] = [
  {
    name: 'Ability Score Improvement', slug: 'ability-score-improvement-2024', category: 'General', repeatable: true,
    ability: { flex: [], amount: 2, maxPerAbility: 2 },
    features: ['Increase one score by 2, or two scores by 1 each', 'Cannot raise a score above 20'],
    description: 'Increase one ability score by 2, or two ability scores by 1 each. You can take this feat more than once.',
  },
  {
    name: 'Actor', slug: 'actor-2024', category: 'General', ability: { fixed: { CHA: 1 } },
    features: ['Advantage on Deception and Performance when passing as someone else', 'Mimicry of voices and sounds'],
    description: 'You have Advantage on Charisma (Deception and Performance) checks when trying to pass as someone else, and you can mimic voices and sounds you have heard.',
  },
  {
    name: 'Athlete', slug: 'athlete-2024', category: 'General', ability: { flex: ['STR', 'DEX'] },
    features: ['Stand up from Prone using 5 feet of movement', 'Climbing costs no extra movement', 'Running long jump after 5 feet of movement'],
    description: 'You gain +1 Strength or Dexterity, stand up from Prone more quickly, climb without the extra cost, and make a running jump after only 5 feet of movement.',
  },
  {
    name: 'Charger', slug: 'charger-2024', category: 'General', ability: { flex: ['STR', 'DEX'] },
    features: ['Dash as a Bonus Action', 'Charge Attack adds 1d8 damage after moving 10 feet'],
    description: 'You can Dash as a Bonus Action, and once per turn a melee attack made after moving at least 10 feet in a straight line deals extra damage.',
  },
  {
    name: 'Chef', slug: 'chef-2024', category: 'General', ability: { flex: ['CON', 'WIS'] },
    features: ["Proficiency with Cook's Utensils", 'Replenishing Meal grants extra Hit Points on a Short Rest', 'Bolstering Treats grant Temporary Hit Points'],
    description: "You gain +1 Constitution or Wisdom, proficiency with Cook's Utensils, and can cook food that speeds recovery or grants Temporary Hit Points.",
  },
  {
    name: 'Crossbow Expert', slug: 'crossbow-expert-2024', category: 'General', ability: { flex: ['STR', 'DEX'] },
    features: ['Ignore the Loading property', 'No Disadvantage on ranged attacks within 5 feet'],
    description: 'You ignore the Loading property of crossbows, and being within 5 feet of an enemy does not impose Disadvantage on your ranged attacks.',
  },
  {
    name: 'Crusher', slug: 'crusher-2024', category: 'General', ability: { flex: ['STR', 'CON'] },
    features: ['Push a creature 5 feet on a Bludgeoning hit, once per turn', 'Critical hits give attackers Advantage against that creature'],
    description: 'You gain +1 Strength or Constitution, can push a creature you hit with Bludgeoning damage, and your critical hits leave the target easier to strike.',
  },
  {
    name: 'Defensive Duelist', slug: 'defensive-duelist-2024', category: 'General',
    prereqAbility: { DEX: 13 },
    features: ['Reaction adds your Proficiency Bonus to AC against one melee attack'],
    description: 'When wielding a Finesse weapon and hit by a melee attack, you can take a Reaction to add your Proficiency Bonus to your AC, possibly turning the hit into a miss.',
  },
  {
    name: 'Dual Wielder', slug: 'dual-wielder-2024', category: 'General', ability: { flex: ['STR', 'DEX'] },
    features: ['Two-Weapon Fighting works with any one-handed weapon', 'Quick Draw lets you stow or draw two weapons'],
    description: 'You gain +1 Strength or Dexterity, can use Two-Weapon Fighting with any one-handed weapons, and can draw or stow two weapons at once.',
  },
  {
    name: 'Durable', slug: 'durable-2024', category: 'General', ability: { fixed: { CON: 1 } },
    features: ['Defy Death: regain 1 Hit Point on a successful Death Save', 'Speedy Recovery: Hit Dice as a Bonus Action on a Short Rest'],
    description: 'You gain +1 Constitution, come back at 1 Hit Point when you succeed on a Death Saving Throw, and can spend Hit Dice as a Bonus Action during a Short Rest.',
  },
  {
    name: 'Elemental Adept', slug: 'elemental-adept-2024', category: 'General', repeatable: true,
    prereqFeatures: ['Spellcasting or Pact Magic'],
    features: ['Spells of the chosen damage type ignore Resistance', 'Treat any 1 rolled on that damage as a 2'],
    description: 'Choose a damage type: Acid, Cold, Fire, Lightning or Thunder. Your spells ignore Resistance to it, and you treat any 1 rolled for that damage as a 2.',
  },
  {
    name: 'Fey Touched', slug: 'fey-touched-2024', category: 'General', ability: { flex: ['INT', 'WIS', 'CHA'] },
    features: ['Learn Misty Step', 'Learn one level-1 Divination or Enchantment spell', 'Cast each once per Long Rest without a slot'],
    description: 'You gain +1 Intelligence, Wisdom or Charisma, and learn Misty Step plus one level-1 Divination or Enchantment spell, each castable once per Long Rest for free.',
  },
  {
    name: 'Grappler', slug: 'grappler-2024', category: 'General', ability: { flex: ['STR', 'DEX'] },
    features: ['Punch and Grab: Unarmed Strike damage and Grapple together', 'Advantage on attacks against a creature you grapple', 'Move at full speed while dragging it'],
    description: 'You gain +1 Strength or Dexterity, can damage and Grapple with one Unarmed Strike, attack a grappled creature with Advantage, and move it without being slowed.',
  },
  {
    name: 'Great Weapon Master', slug: 'great-weapon-master-2024', category: 'General', ability: { flex: ['STR', 'DEX'] },
    features: ['Heavy weapon hits add your Proficiency Bonus to damage', 'A critical hit or kill grants a Bonus Action attack'],
    description: 'You gain +1 Strength or Dexterity, add your Proficiency Bonus to damage with Heavy weapons, and get a Bonus Action attack after a critical hit or a kill.',
  },
  {
    name: 'Heavily Armored', slug: 'heavily-armored-2024', category: 'General', ability: { fixed: { STR: 1 } },
    prereqFeatures: ['Proficiency with Medium armor'],
    features: ['Proficiency with Heavy armor'],
    description: 'You gain +1 Strength and proficiency with Heavy armor.',
  },
  {
    name: 'Heavy Armor Master', slug: 'heavy-armor-master-2024', category: 'General', ability: { fixed: { STR: 1 } },
    prereqFeatures: ['Proficiency with Heavy armor'],
    features: ['Reduce Bludgeoning, Piercing and Slashing damage by twice your Proficiency Bonus'],
    description: 'You gain +1 Strength, and while wearing Heavy armor you reduce Bludgeoning, Piercing and Slashing damage by an amount equal to twice your Proficiency Bonus.',
  },
  {
    name: 'Inspiring Leader', slug: 'inspiring-leader-2024', category: 'General', ability: { flex: ['WIS', 'CHA'] },
    features: ['Grant Temporary Hit Points to up to 6 creatures after a Rest'],
    description: 'You gain +1 Wisdom or Charisma, and can spend 10 minutes inspiring allies to grant them Temporary Hit Points equal to your character level plus your modifier.',
  },
  {
    name: 'Keen Mind', slug: 'keen-mind-2024', category: 'General', ability: { fixed: { INT: 1 } },
    features: ['Proficiency in one Intelligence-based skill', 'Study as a Bonus Action'],
    description: 'You gain +1 Intelligence, proficiency in one skill that uses Intelligence, and can take the Study action as a Bonus Action.',
  },
  {
    name: 'Lightly Armored', slug: 'lightly-armored-2024', category: 'General', ability: { flex: ['STR', 'DEX'] },
    features: ['Proficiency with Light armor and Shields'],
    description: 'You gain +1 Strength or Dexterity and proficiency with Light armor and Shields.',
  },
  {
    name: 'Mage Slayer', slug: 'mage-slayer-2024', category: 'General', ability: { flex: ['STR', 'DEX'] },
    features: ['Advantage on saves against spells cast within 30 feet', 'Force Disadvantage on a Concentration save once per turn'],
    description: 'You gain +1 Strength or Dexterity, have Advantage on saves against nearby spells, and can make a spellcaster you damage roll their Concentration save with Disadvantage.',
  },
  {
    name: 'Martial Weapon Training', slug: 'martial-weapon-training-2024', category: 'General', ability: { flex: ['STR', 'DEX'] },
    features: ['Proficiency with Martial weapons'],
    description: 'You gain +1 Strength or Dexterity and proficiency with all Martial weapons.',
  },
  {
    name: 'Medium Armor Master', slug: 'medium-armor-master-2024', category: 'General', ability: { flex: ['STR', 'DEX'] },
    prereqFeatures: ['Proficiency with Medium armor'],
    features: ['Medium armor never imposes Disadvantage on Stealth', 'Add up to 3 (not 2) from Dexterity to AC'],
    description: 'You gain +1 Strength or Dexterity, Medium armor no longer hampers your Stealth, and you may add up to 3 from Dexterity to your Armor Class.',
  },
  {
    name: 'Moderately Armored', slug: 'moderately-armored-2024', category: 'General', ability: { flex: ['STR', 'DEX'] },
    prereqFeatures: ['Proficiency with Light armor'],
    features: ['Proficiency with Medium armor and Shields'],
    description: 'You gain +1 Strength or Dexterity and proficiency with Medium armor and Shields.',
  },
  {
    name: 'Mounted Combatant', slug: 'mounted-combatant-2024', category: 'General', ability: { flex: ['STR', 'DEX', 'WIS'] },
    features: ['Advantage on melee attacks against unmounted smaller creatures', 'Redirect an attack from your mount to yourself', 'Mount takes no damage on a successful Dexterity save'],
    description: 'You gain +1 Strength, Dexterity or Wisdom, strike more accurately from the saddle, and can shield your mount from harm.',
  },
  {
    name: 'Observant', slug: 'observant-2024', category: 'General', ability: { flex: ['INT', 'WIS'] },
    features: ['Proficiency in Insight, Investigation or Perception', 'Search as a Bonus Action'],
    description: 'You gain +1 Intelligence or Wisdom, proficiency in Insight, Investigation or Perception, and can take the Search action as a Bonus Action.',
  },
  {
    name: 'Piercer', slug: 'piercer-2024', category: 'General', ability: { flex: ['STR', 'DEX'] },
    features: ['Reroll one Piercing damage die once per turn', 'Critical hits add one extra damage die'],
    description: 'You gain +1 Strength or Dexterity, may reroll one Piercing damage die each turn, and add an extra damage die on a critical hit.',
  },
  {
    name: 'Poisoner', slug: 'poisoner-2024', category: 'General', ability: { flex: ['DEX', 'INT'] },
    features: ["Proficiency with the Poisoner's Kit", 'Your poisons ignore Resistance to Poison damage', 'Craft potent poison during a Long Rest'],
    description: "You gain +1 Dexterity or Intelligence, proficiency with the Poisoner's Kit, and can brew a potent poison whose damage ignores Poison Resistance.",
  },
  {
    name: 'Polearm Master', slug: 'polearm-master-2024', category: 'General', ability: { flex: ['STR', 'DEX'] },
    features: ['Bonus Action attack with the weapon’s butt end for 1d4', 'Reactive strike when a creature enters your reach'],
    description: 'You gain +1 Strength or Dexterity, can strike with the blunt end of a polearm as a Bonus Action, and make an Opportunity Attack when a creature enters your reach.',
  },
  {
    name: 'Resilient', slug: 'resilient-2024', category: 'General', ability: { flex: [] },
    features: ['+1 to the chosen ability score', 'Saving throw proficiency in that same ability'],
    description: 'Choose one ability score. You gain +1 to it and proficiency in saving throws using it.',
  },
  {
    name: 'Ritual Caster', slug: 'ritual-caster-2024', category: 'General',
    prereqFeatures: ['Spellcasting or Pact Magic'],
    features: ['Ritual spellbook holding two level-1 ritual spells', 'Add rituals you find to the book'],
    description: 'You gain a ritual book containing two level-1 spells with the Ritual tag, and can copy further ritual spells you find into it.',
  },
  {
    name: 'Sentinel', slug: 'sentinel-2024', category: 'General', ability: { flex: ['STR', 'DEX'] },
    features: ['Opportunity Attack reduces the target’s Speed to 0', 'Reactive strike when a nearby creature attacks someone else'],
    description: 'You gain +1 Strength or Dexterity, stop creatures you hit with an Opportunity Attack, and can strike enemies who attack your allies instead of you.',
  },
  {
    name: 'Shadow Touched', slug: 'shadow-touched-2024', category: 'General', ability: { flex: ['INT', 'WIS', 'CHA'] },
    features: ['Learn Invisibility', 'Learn one level-1 Illusion or Necromancy spell', 'Cast each once per Long Rest without a slot'],
    description: 'You gain +1 Intelligence, Wisdom or Charisma, and learn Invisibility plus one level-1 Illusion or Necromancy spell, each castable once per Long Rest for free.',
  },
  {
    name: 'Sharpshooter', slug: 'sharpshooter-2024', category: 'General', ability: { flex: ['STR', 'DEX'] },
    features: ['No Disadvantage at long range', 'Ranged attacks ignore Half and Three-Quarters Cover', 'Add Proficiency Bonus to damage once per turn'],
    description: 'You gain +1 Strength or Dexterity, shoot at long range without penalty, ignore most cover, and can add your Proficiency Bonus to one ranged hit each turn.',
  },
  {
    name: 'Shield Master', slug: 'shield-master-2024', category: 'General', ability: { flex: ['STR', 'DEX'] },
    prereqFeatures: ['Proficiency with Shields'],
    features: ['Bonus Action shield bash to knock a creature Prone', 'Interpose the shield to halve damage to an ally', 'Add the shield’s AC to Dexterity saves'],
    description: 'You gain +1 Strength or Dexterity and turn your shield into a weapon and a wall: bash creatures Prone, cover allies, and add its bonus to Dexterity saves.',
  },
  {
    name: 'Skill Expert', slug: 'skill-expert-2024', category: 'General', ability: { flex: [] },
    features: ['+1 to one ability score of your choice', 'Proficiency in one skill', 'Expertise in one skill you are proficient with'],
    description: 'You gain +1 to an ability score of your choice, proficiency in one skill, and Expertise in one skill you are already proficient with.',
  },
  {
    name: 'Skulker', slug: 'skulker-2024', category: 'General',
    prereqAbility: { DEX: 13 },
    features: ['Hide as a Bonus Action', 'Missing a ranged attack from Hiding does not reveal you', 'Dim light does not impose Disadvantage on Perception'],
    description: 'You can Hide as a Bonus Action, stay concealed when a ranged attack from hiding misses, and see clearly enough in dim light to search without penalty.',
  },
  {
    name: 'Slasher', slug: 'slasher-2024', category: 'General', ability: { flex: ['STR', 'DEX'] },
    features: ['Reduce a creature’s Speed by 10 feet on a Slashing hit', 'Critical hits impose Disadvantage on the target’s attacks'],
    description: 'You gain +1 Strength or Dexterity, slow creatures you cut, and leave them fighting at a disadvantage after a critical hit.',
  },
  {
    name: 'Speedy', slug: 'speedy-2024', category: 'General', ability: { flex: ['DEX', 'CON'] },
    features: ['Speed increases by 10 feet', 'Dash through Difficult Terrain without extra cost', 'Opportunity Attacks against you have Disadvantage after you Dash'],
    description: 'You gain +1 Dexterity or Constitution, your Speed increases by 10 feet, and Dashing carries you through difficult ground and past reaching enemies.',
  },
  {
    name: 'Spell Sniper', slug: 'spell-sniper-2024', category: 'General',
    prereqFeatures: ['Spellcasting or Pact Magic'],
    features: ['Double the range of your attack-roll spells', 'Those spells ignore Half and Three-Quarters Cover'],
    description: 'The range of your spells that require an attack roll doubles, and they ignore Half and Three-Quarters Cover.',
  },
  {
    name: 'Telekinetic', slug: 'telekinetic-2024', category: 'General', ability: { flex: ['INT', 'WIS', 'CHA'] },
    features: ['Learn the Mage Hand cantrip, cast without components', 'Shove a creature 5 feet as a Bonus Action'],
    description: 'You gain +1 Intelligence, Wisdom or Charisma, learn Mage Hand, and can telekinetically shove a creature 5 feet as a Bonus Action.',
  },
  {
    name: 'Telepathic', slug: 'telepathic-2024', category: 'General', ability: { flex: ['INT', 'WIS', 'CHA'] },
    features: ['Speak telepathically to a creature within 60 feet', 'Cast Detect Thoughts once per Long Rest without a slot'],
    description: 'You gain +1 Intelligence, Wisdom or Charisma, can speak mind to mind at 60 feet, and cast Detect Thoughts once per Long Rest for free.',
  },
  {
    name: 'War Caster', slug: 'war-caster-2024', category: 'General', ability: { flex: ['INT', 'WIS', 'CHA'] },
    prereqFeatures: ['Spellcasting or Pact Magic'],
    features: ['Advantage on Constitution saves to maintain Concentration', 'Perform somatic components with hands full', 'Cast a spell as an Opportunity Attack'],
    description: 'You gain +1 Intelligence, Wisdom or Charisma, hold Concentration more surely, cast with your hands full, and can answer a fleeing enemy with a spell.',
  },
  {
    name: 'Weapon Master', slug: 'weapon-master-2024', category: 'General', ability: { flex: ['STR', 'DEX'] },
    features: ['Use the Mastery property of one kind of weapon', 'Change that weapon after a Long Rest'],
    description: 'You gain +1 Strength or Dexterity and can use the Mastery property of one weapon you are proficient with, changing your choice after each Long Rest.',
  },
]

const FIGHTING_STYLE: { name: string; slug: string; features: string[]; description: string }[] = [
  { name: 'Archery', slug: 'fighting-style-archery-2024', features: ['+2 to attack rolls with Ranged weapons'], description: 'You gain a +2 bonus to attack rolls you make with Ranged weapons.' },
  { name: 'Blind Fighting', slug: 'fighting-style-blind-fighting-2024', features: ['Blindsight out to 10 feet'], description: 'You have Blindsight with a range of 10 feet, seeing anything not behind Total Cover even if Blinded or in Darkness.' },
  { name: 'Defense', slug: 'fighting-style-defense-2024', features: ['+1 AC while wearing armor'], description: 'While wearing Light, Medium or Heavy armor, you gain a +1 bonus to Armor Class.' },
  { name: 'Dueling', slug: 'fighting-style-dueling-2024', features: ['+2 damage with a single one-handed weapon'], description: 'When wielding a melee weapon in one hand and no other weapons, you gain +2 to damage rolls with that weapon.' },
  { name: 'Great Weapon Fighting', slug: 'fighting-style-great-weapon-fighting-2024', features: ['Treat a 1 or 2 on damage as a 3 with Two-Handed weapons'], description: 'When you roll damage with a weapon you are holding with two hands, you treat a 1 or 2 on any damage die as a 3.' },
  { name: 'Interception', slug: 'fighting-style-interception-2024', features: ['Reaction reduces damage to a nearby creature'], description: 'When a creature you can see hits another within 5 feet of you, you can reduce the damage by 1d10 plus your Proficiency Bonus.' },
  { name: 'Protection', slug: 'fighting-style-protection-2024', features: ['Reaction imposes Disadvantage on an attack against a nearby ally'], description: 'When a creature you can see attacks someone other than you within 5 feet, you can use a Reaction to impose Disadvantage on the attack roll.' },
  { name: 'Thrown Weapon Fighting', slug: 'fighting-style-thrown-weapon-fighting-2024', features: ['Draw a thrown weapon as part of the attack', '+2 damage on thrown weapon hits'], description: 'You can draw a weapon with the Thrown property as part of the attack, and such hits deal +2 damage.' },
  { name: 'Two-Weapon Fighting', slug: 'fighting-style-two-weapon-fighting-2024', features: ['Add the ability modifier to the second attack’s damage'], description: 'When you make an extra attack from Two-Weapon Fighting, you add your ability modifier to that attack’s damage.' },
  { name: 'Unarmed Fighting', slug: 'fighting-style-unarmed-fighting-2024', features: ['Unarmed Strike deals 1d6, or 1d8 with both hands free', 'Deal 1d4 to a creature you grapple'], description: 'Your Unarmed Strike deals 1d6 Bludgeoning damage, or 1d8 with nothing in either hand, and you damage creatures you grapple.' },
]

const EPIC_BOONS: { name: string; slug: string; features: string[]; description: string }[] = [
  { name: 'Boon of Combat Prowess', slug: 'boon-of-combat-prowess-2024', features: ['Turn one miss per turn into a hit'], description: 'When you miss with an attack, you can choose to hit instead, once per turn.' },
  { name: 'Boon of Dimensional Travel', slug: 'boon-of-dimensional-travel-2024', features: ['Teleport 30 feet as part of the Attack or Magic action'], description: 'As part of taking the Attack or Magic action, you can teleport up to 30 feet to an unoccupied space you can see.' },
  { name: 'Boon of Fate', slug: 'boon-of-fate-2024', features: ['Add 2d4 to a D20 Test once per Short Rest'], description: 'Once per Short or Long Rest, you can add 2d4 to a D20 Test made by you or a creature within 60 feet.' },
  { name: 'Boon of Fortitude', slug: 'boon-of-fortitude-2024', features: ['Hit Point maximum increases by 40', 'Regain extra Hit Points when you spend Hit Dice'], description: 'Your Hit Point maximum increases by 40, and you regain extra Hit Points whenever you spend Hit Dice.' },
  { name: 'Boon of Irresistible Offense', slug: 'boon-of-irresistible-offense-2024', features: ['Attacks ignore Resistance and Immunity to Bludgeoning, Piercing and Slashing', 'Add your Strength or Dexterity score to a roll of 20'], description: 'Your attacks overcome Resistance and Immunity to physical damage, and a natural 20 adds your Strength or Dexterity score to the damage.' },
  { name: 'Boon of Recovery', slug: 'boon-of-recovery-2024', features: ['Regain half your Hit Point maximum as a Bonus Action', 'Extra Hit Dice on a Long Rest'], description: 'As a Bonus Action you can regain Hit Points equal to half your Hit Point maximum, once per Long Rest.' },
  { name: 'Boon of Skill', slug: 'boon-of-skill-2024', features: ['Proficiency in all skills', 'Expertise in two skills of your choice'], description: 'You gain proficiency in all skills, and Expertise in two skills of your choice.' },
  { name: 'Boon of Speed', slug: 'boon-of-speed-2024', features: ['Speed increases by 30 feet', 'Ignore Difficult Terrain', 'Disengage as a Bonus Action'], description: 'Your Speed increases by 30 feet, Difficult Terrain no longer slows you, and you can Disengage as a Bonus Action.' },
  { name: 'Boon of the Night Spirit', slug: 'boon-of-the-night-spirit-2024', features: ['Become Invisible in Dim Light or Darkness as a Bonus Action', 'Resistance to all damage but Psychic and Radiant while there'], description: 'While in Dim Light or Darkness you can become Invisible as a Bonus Action, and you have Resistance to all damage except Psychic and Radiant.' },
  { name: 'Boon of Truesight', slug: 'boon-of-truesight-2024', features: ['Truesight out to 60 feet'], description: 'You have Truesight with a range of 60 feet.' },
]

/** Epic Boons all raise one ability score, to a maximum of 30. */
const EPIC_BOON_ABILITY = { flex: [] as string[], amount: 1 }

/**
 * The Archive draws no line between Origin feats and the rest, so every feat
 * competes for the same slot. Printed as-is, a feat with no ability increase is
 * plainly weaker than a half feat, so each one also grants +1 to an ability of
 * the player's choice — the "make it a half feat" house rule.
 *
 * Fighting Style feats are deliberately left out: they stand in for a class
 * feature rather than a free pick, and an increase would make taking one as a
 * feat better than the feature it copies.
 */
const HALF_FEAT_ABILITY = { flex: [] as string[], amount: 1 }

/** Gives any feat that raises no ability score the house-rule +1. */
const asHalfFeat = (seed: FeatSeed): FeatSeed => seed.ability
  ? seed
  : {
    ...seed,
    ability: HALF_FEAT_ABILITY,
    features: [...seed.features, '+1 to an ability score of your choice'],
  }

export const FEATS_2024: FeatSeed[] = [
  ...ORIGIN.map(asHalfFeat),
  ...GENERAL.map(asHalfFeat),
  ...FIGHTING_STYLE.map((style): FeatSeed => ({
    name: style.name,
    slug: style.slug,
    category: 'Fighting Style',
    level: 1,
    prereqFeatures: ['Fighting Style feature'],
    features: style.features,
    description: style.description,
  })),
  ...EPIC_BOONS.map((boon): FeatSeed => ({
    name: boon.name,
    slug: boon.slug,
    category: 'Epic Boon',
    level: 19,
    ability: EPIC_BOON_ABILITY,
    features: [...boon.features, 'Increase one ability score by 1, to a maximum of 30'],
    description: boon.description,
  })),
]

/** Default minimum level for each category, used when a seed names none. */
/**
 * Minimum level per category. General feats are level 1 rather than 4: the
 * Archive lets any feat be taken at level 1 in both rulesets, and the creator
 * stops at level 3, so a level-4 gate would have hidden most of the library.
 * Epic Boons keep their gate — they are explicitly endgame rewards.
 */
export const CATEGORY_LEVEL: Record<FeatCategory, number> = {
  Origin: 1,
  General: 1,
  'Fighting Style': 1,
  'Epic Boon': 19,
}
