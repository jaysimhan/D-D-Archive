import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-08-21' }).withConfig({ perspective: 'raw' })
const APPLY = process.argv.includes('--apply')
const RULESETS = [
  { _type: 'reference', _key: 'srd-2014', _ref: 'ruleset.srd-2014' },
  { _type: 'reference', _key: 'srd-2024', _ref: '86642d23-c52d-4577-adc1-214aab0f43e9' },
]
const ref = (id: string, key = id) => ({ _type: 'reference', _key: key, _ref: id })
type FeatureSeed = { level: number; name: string; description: string }

const progression = [
  [1, 2, '—', ['Companion', 'Natural Language']],
  [2, 2, '3', ['Primal Exploits', 'Superior Ferocity']],
  [3, 2, '3', ['Companion Bond', 'Master Caregiver']],
  [4, 2, '3', ['Ability Score Improvement']],
  [5, 3, '3', ['Beyond Instinct', 'Improved Signature Attack (1 die)']],
  [6, 3, '3', ['Faithful Companion', 'Rejuvenating Ferocity']],
  [7, 3, '3', ['Companion Bond feature']],
  [8, 3, '3', ['Ability Score Improvement', 'Primal Strike (1d8)']],
  [9, 4, '3', ['Mystic Connection']],
  [10, 4, '5', ['Beyond Instinct improvement']],
  [11, 4, '5', ['Improved Signature Attack (2 dice)', 'Companion Bond feature']],
  [12, 4, '5', ['Ability Score Improvement']],
  [13, 5, '5', ['Loyal to the End']],
  [14, 5, '5', ['Keen Senses', 'Primal Strike (2d8)']],
  [15, 5, '5', ['Beyond Instinct improvement', 'Companion Bond feature']],
  [16, 5, '5', ['Ability Score Improvement']],
  [17, 6, '7', ['Improved Signature Attack (3 dice)']],
  [18, 6, '7', ['Summon the Wilds']],
  [19, 6, '7', ['Ability Score Improvement']],
  [20, 6, '7', ['Unbreakable Friendship']],
].map(([level, proficiencyBonus, exploits, featureNames]) => ({
  _type: 'classProgressionRow',
  _key: `beastheart-level-${level}`,
  level,
  proficiencyBonus,
  resources: [{ _type: 'object', _key: 'primal-exploits', name: 'Primal Exploits Known', value: exploits }],
  featureNames,
}))

const coreFeatures: FeatureSeed[] = [
  { level: 1, name: 'Companion', description: 'You bond with a wild companion that adventures, fights, and develops ferocity alongside you. You can spend 1 minute meditating over an injured or dead companion; it returns to life if necessary and regains all hit points, while you gain one level of exhaustion. A destroyed body reforms within 5 feet of you. The first time you finish a long rest after gaining a Beastheart level, you may bond with a new eligible companion; your previous companion leaves when the new one arrives.' },
  { level: 1, name: 'Natural Language', description: 'You can comprehend and verbally communicate simple ideas with your companion and with Beasts and Monstrosities. Their knowledge remains limited by their intellect and disposition. When influencing such a creature through this feature, you may make Wisdom (Animal Handling) checks in place of Charisma checks.' },
  { level: 2, name: 'Primal Exploits', description: 'Learn three primal exploits, two more at 10th level, and two more at 17th level. When you gain a Beastheart level, you may replace one with another for which you qualify. Your companion must be within 60 feet and have enough ferocity; using an exploit spends its listed ferocity, and exploits cannot be used while the companion is rampaging. Exploit save DC = 8 + proficiency bonus + Wisdom modifier. 2nd-level exploits: Aid Us, Friend (3; during your Attack action, the companion uses Help as a bonus action); Bring Them Down (4; reaction after its signature hit to force a Strength save or knock prone); Drag Them (4; reaction after a signature hit to pull a Large or smaller target on a failed Strength save); Feral Reflexes (2; reaction for +2 AC against a triggering hit); Hurricane Blow (3; first weapon hit during the Attack action pushes 10 feet); No Escape (1+; spend up to Wisdom modifier to add 5 feet of speed per point for you or the companion); Primal Pounce (3; reaction after signature hit to grapple on failed Dexterity save); Quick Hide (2; after your first weapon hit, companion Hides as a reaction); Thrash (4; reaction after a melee signature hit to impose disadvantage on the target’s attacks and advantage on attacks against it until your next turn on a failed Wisdom save). 10th-level exploits: Crushing Charge (8; action to move through creatures, dealing 4d6 bludgeoning and knocking prone on failed Strength saves, 5d6 at level 17); Expanding Fury (6; reaction to expand a distance-based ferocity action by 10 feet); Furious Vengeance (5; reaction to a melee hit against either partner for 4d6 psychic damage, 5d6 at level 17); Marked Prey (4; reaction to impose disadvantage on a save against a ferocity action); Primal Shout (6; action to frighten chosen creatures within 15 feet on failed Wisdom saves); Wrath of the Pack (4; after your hit against a target beside the companion, it makes a signature attack and knocks prone). 17th-level exploits: Blood Sport (16; a chain of pushing melee attacks between partners, ending with +4d6 damage); Break the Earth (14; open a 10-foot-radius pit up to 50 feet deep); Bury the Dead (16; 8d6 bludgeoning plus prone and restrained on a failed Dexterity save); Imbue Projectile (14; ranged attack followed by a 20-foot, 10d6 force burst); Rend (12; both partners attack an adjacent target, adding 6d6 and knocking prone if both hit); Spirit Form (14; bonus action makes both partners incorporeal, resistant to common elemental and nonmagical weapon damage, and able to fly and move through creatures and objects until the end of your next turn).' },
  { level: 2, name: 'Superior Ferocity', description: 'When your companion uses a ferocity action that calls for an ability check or saving throw, it can use your primal exploit save DC instead of its normal DC.' },
  { level: 3, name: 'Companion Bond', description: 'Choose Ferocious Bond, Hunter Bond, Infernal Bond, Primordial Bond, or Protector Bond. Your Bond grants features at levels 3, 7, 11, and 15.' },
  { level: 3, name: 'Master Caregiver', description: 'Gain proficiency in Animal Handling. If already proficient, double your proficiency bonus on Animal Handling checks.' },
  { level: 4, name: 'Ability Score Improvement', description: 'Increase one ability score by 2 or two ability scores by 1, to a maximum of 20.' },
  { level: 5, name: 'Beyond Instinct', description: 'Whenever your companion gains ferocity at the start of your turn, it gains 1 additional ferocity. It gains proficiency in one saving throw and one chosen skill from Acrobatics, Animal Handling, Athletics, Intimidation, Investigation, Perception, Performance, Sleight of Hand, Stealth, or Survival. It may use Wisdom for Investigation and Strength or Dexterity for Intimidation or Performance.' },
  { level: 5, name: 'Improved Signature Attack', description: 'Your companion’s signature attack deals one additional weapon damage die. Its attacks and ferocity actions count as magical for overcoming resistance and immunity.' },
  { level: 6, name: 'Faithful Companion', description: 'You no longer need a bonus action to command your companion. While not incapacitated, you direct it with action-free verbal or physical signs. When it rampages while it can see or hear you, you choose its movement and signature-attack target instead of it automatically attacking the nearest creature.' },
  { level: 6, name: 'Rejuvenating Ferocity', description: 'As a bonus action, spend any amount of your companion’s ferocity to restore that many hit points to it. Use this a number of times equal to your Wisdom modifier (minimum once), regaining all uses after a long rest.' },
  { level: 7, name: 'Companion Bond Feature (7th Level)', description: 'You gain the 7th-level feature of your Companion Bond.' },
  { level: 8, name: 'Ability Score Improvement (8th Level)', description: 'Increase one ability score by 2 or two ability scores by 1, to a maximum of 20.' },
  { level: 8, name: 'Primal Strike', description: 'Once per turn when you hit with a weapon attack, deal an extra 1d8 acid, cold, fire, lightning, poison, or thunder damage, choosing the type when you gain this feature and allowing it to change whenever you gain a Beastheart level.' },
  { level: 9, name: 'Mystic Connection', description: 'Your connection grants a natural talent determined by your companion. If you bond with a new companion, its Mystic Connection replaces the old benefit.' },
  { level: 10, name: 'Beyond Instinct Improvement', description: 'The additional ferocity from Beyond Instinct becomes 3. Your companion gains proficiency in one additional saving throw and one additional eligible skill.' },
  { level: 11, name: 'Improved Signature Attack (Two Dice)', description: 'Your companion’s signature attack now deals two additional weapon damage dice.' },
  { level: 11, name: 'Companion Bond Feature (11th Level)', description: 'You gain the 11th-level feature of your Companion Bond.' },
  { level: 12, name: 'Ability Score Improvement (12th Level)', description: 'Increase one ability score by 2 or two ability scores by 1, to a maximum of 20.' },
  { level: 13, name: 'Loyal to the End', description: 'You and your companion cannot be charmed or frightened.' },
  { level: 14, name: 'Keen Senses', description: 'You have advantage on Wisdom (Perception) checks relying on hearing, sight, or smell, and may take the Search action as a bonus action.' },
  { level: 14, name: 'Primal Strike Improvement', description: 'The additional damage from Primal Strike becomes 2d8.' },
  { level: 15, name: 'Beyond Instinct Improvement (15th Level)', description: 'The additional ferocity from Beyond Instinct becomes 5. Your companion gains proficiency in another saving throw and another eligible skill.' },
  { level: 15, name: 'Companion Bond Feature (15th Level)', description: 'You gain the 15th-level feature of your Companion Bond.' },
  { level: 16, name: 'Ability Score Improvement (16th Level)', description: 'Increase one ability score by 2 or two ability scores by 1, to a maximum of 20.' },
  { level: 17, name: 'Improved Signature Attack (Three Dice)', description: 'Your companion’s signature attack now deals three additional weapon damage dice.' },
  { level: 18, name: 'Summon the Wilds', description: 'As an action, summon a distracting swarm into a 30-foot cube centered within 120 feet for 1 minute. As a bonus action each turn, move it up to 30 feet. Chosen creatures starting in it make a Wisdom save against your exploit save DC; on a failure, they have disadvantage on checks, attacks, and saves and take a −5 penalty to passive Perception until their next turn. Recharge after a short or long rest.' },
  { level: 19, name: 'Ability Score Improvement (19th Level)', description: 'Increase one ability score by 2 or two ability scores by 1, to a maximum of 20.' },
  { level: 20, name: 'Unbreakable Friendship', description: 'While you have at least 1 hit point and your companion can see or hear you, you automatically succeed on Animal Handling checks to prevent its rampage (though you may allow it), it drops to 1 hit point instead of 0 unless killed outright, and it gains 1d10 ferocity whenever you roll initiative.' },
]

const bonds: Record<string, { description: string; features: FeatureSeed[] }> = {
  'subclass-ferocious-bond': {
    description: 'You and your companion embrace instinct and rampage, each partner feeding the other’s battle fury.',
    features: [
      { level: 3, name: 'Frenzied Charge', description: 'When your companion enters a rampage, use your reaction to move up to your speed and make one melee weapon attack against a target at the end of that movement.' },
      { level: 3, name: 'Fury of the Wise', description: 'Gain Intimidation proficiency if needed, and add your Wisdom modifier to Charisma (Intimidation) checks.' },
      { level: 7, name: 'Energizing Rampage', description: 'When your companion ends a rampage, its ferocity falls to 4 instead of 0.' },
      { level: 11, name: 'Furious Rampage', description: 'During a rampage, the companion’s signature attack adds its full ferocity as damage instead of half. It has advantage against targets within 5 feet of you, and your Frenzied Charge attack has advantage against targets within 5 feet of it.' },
      { level: 15, name: 'Invigorated Rampage', description: 'When the companion hits with its signature attack during a rampage, or you hit with Frenzied Charge, choose to blind, deafen, or frighten the target of the attacker until the end of the target’s next turn.' },
    ],
  },
  'subclass-hunter-bond': {
    description: 'You and your companion become silent stalkers who identify, trap, and overwhelm chosen prey.',
    features: [
      { level: 3, name: 'Chosen Quarry', description: 'When the companion gains ferocity without rampaging, spend 4 ferocity without an action to mark a creature within 90 feet for 1 minute. Until you mark another, weapon attacks and ferocity actions from either partner deal an extra 1d6 damage to the quarry.' },
      { level: 3, name: 'Hunter’s Instincts', description: 'Gain Survival proficiency or expertise if already proficient. You may use Survival instead of Insight for Wisdom checks to read intentions or detect lies.' },
      { level: 7, name: 'Primal Warding', description: 'As an action, trap a 10-foot square within 30 feet for 8 hours or until triggered, exempting chosen creatures. Finding it requires Investigation against your exploit save DC. A creature entering makes a Constitution save, taking 4d8 force and becoming blinded for 1 minute on a failure, or half damage without blindness on a success. It repeats saves at turn end. You receive a mental alarm within 1 mile. Set a number of traps equal to Wisdom modifier per long rest.' },
      { level: 11, name: 'Synchronized Stealth', description: 'When either partner Hides, the other can Hide as a reaction. You have advantage on the Stealth check when Hiding within 5 feet of your companion.' },
      { level: 15, name: 'Unseen Hunters', description: 'As an action, make both partners invisible and untrackable by nonmagical means for 10 minutes. Either may end its own invisibility as a bonus action. Recharge after a long rest.' },
    ],
  },
  'subclass-infernal-bond': {
    description: 'Your bond channels the power of Hell through fiendish exploits and transformations.',
    features: [
      { level: 3, name: 'Devil’s Understanding', description: 'Speak, read, and write Infernal, and gain proficiency in Arcana or Religion.' },
      { level: 3, name: 'Infernal Exploits', description: 'Learn one infernal exploit now and another at 11th level, using normal primal-exploit rules and your exploit save DC. 3rd-level choices: Drain Them (4; reaction after signature hit heals companion for half damage); Hellish Wound (4; signature hit inflicts stacking 1d10 hit-point loss at turn start until magically healed or staunched with Medicine against exploit DC); Infernal Teleport (4; action teleports either partner up to 90 feet); Wicked Deception (3; action charms a hostile creature within 30 feet until your next turn on a failed Wisdom save, preventing it from harming either partner). 11th-level choices: Brimstone Teleport (8; 30-foot teleport dealing 4d6 fire around departure and arrival, 5d6 at level 17); Chains from Hell (8; up to three targets within 30 feet take 4d6 fire and are restrained on failed Dexterity saves, 5d6 at level 17); Dark of Hell (8; companion radiates 10-foot magical darkness both partners can see through); Infernal Flames (8; 20-foot burst around companion deals 4d10 fire, 5d10 at level 17); Poison Rain (8; 20-foot cube within 60 feet poisons creatures other than the partners on failed Constitution saves until your next turn).' },
      { level: 7, name: 'Hell’s Charmer', description: 'As an action, a creature within 30 feet that sees both partners makes a Wisdom save, with advantage if fighting you. On a failure it is charmed by both for 10 minutes or until harmed and afterward forgets the charmed period. Use this Wisdom modifier times per long rest (minimum once).' },
      { level: 11, name: 'Fiendish Traits', description: 'After each long rest, grant the companion one trait: Barbed Hide (nearby grapplers and melee attackers take 1d10 piercing), Fiendish Immunities (fire and poison immunity plus poisoned immunity), Fiery Weapons (+1d6 fire on signature attacks), or Wings (40-foot flying speed).' },
      { level: 15, name: 'Fiendish Form', description: 'As a bonus action, spend 6 ferocity to transform the companion for 1 minute. It becomes a Fiend, gains resistance to bludgeoning, piercing, and slashing damage, and has advantage on saves against spells and magical effects.' },
    ],
  },
  'subclass-primordial-bond': {
    description: 'Your bond channels elemental nature magic through specialized exploits and the land itself.',
    features: [
      { level: 3, name: 'Nature Exploits', description: 'Learn one nature exploit now and another at 11th level, using normal primal-exploit rules. 3rd-level choices: Elemental Shield (3; reaction grants resistance to triggering acid, cold, fire, lightning, or thunder damage through next turn); Freezing Strike (2; first weapon hit adds 1d6 cold and reduces speed 10 feet, scaling to 2d6/3d6/4d6 at levels 5/11/17); Sickening Strike (3; first weapon hit poisons until next turn on a failed Constitution save); Wings When I Need Them (5; after ferocity gain without rampage, either partner gains flying speed equal to walking speed until next turn). 11th-level choices: Lava Geyser (8; 10-foot-high, 5-foot-radius burst deals 4d6 fire and knocks prone, 5d6 at level 17); Lightning Eruption (8; weapon hit and a second target each take 5d6 lightning, 6d6 at level 17); Plant Prison (5; target within 30 feet takes 4d6 piercing and is restrained on failed Dexterity save, 5d6 at level 17); Stinging Swarm (6; 30-foot line deals 4d6 piercing on Constitution save, 5d6 at level 17); Thunderous Rebuke (6; reaction to nearby melee hit deals 3d6 thunder and pushes 10 feet on failed Constitution save, 4d6 at level 17).' },
      { level: 3, name: 'Primal Understanding', description: 'Speak, read, and write Primordial and Sylvan, and gain Nature proficiency.' },
      { level: 7, name: 'Allied Earth', description: 'While the companion has at least 1 ferocity, ground within 10 feet of it is difficult terrain for enemies.' },
      { level: 11, name: 'Spirit Stampede', description: 'When the companion rampages, chosen creatures within 30 feet take force damage equal to its ferocity.' },
      { level: 15, name: 'Allied Weather', description: 'While the companion has at least 1 ferocity, when a creature within 10 feet hits it with a melee attack, choose: the attacker makes a Strength save or falls prone, or makes a Dexterity save or takes lightning damage equal to the companion’s ferocity.' },
    ],
  },
  'subclass-protector-bond': {
    description: 'You and your companion form a defensive pack, controlling nearby foes and refusing to fall.',
    features: [
      { level: 3, name: 'Beast Vitality', description: 'Your hit point maximum increases by 3 and by 1 whenever you gain another Beastheart level.' },
      { level: 3, name: 'Pack Phalanx', description: 'While both partners are conscious and within 5 feet of a creature, that creature has disadvantage on attacks against targets other than you or your companion.' },
      { level: 7, name: 'Thickened Hide', description: 'Your companion’s Armor Class increases by 2.' },
      { level: 11, name: 'Sentinel Companion', description: 'When a creature within 5 feet of your companion attacks someone other than either partner, spend 2 ferocity to let the companion make a signature attack against it as a reaction.' },
      { level: 15, name: 'Undying Protector', description: 'If you see your companion when you drop to 0 hit points, spend 2 ferocity to drop to 1 instead. Each later use costs 2 more ferocity; the cost resets to 2 after a short or long rest.' },
    ],
  },
}

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
function featureDocument(owner: string, seed: FeatureSeed, index: number) {
  const id = `feature-${owner}-${seed.level}-${slugify(seed.name)}`
  return {
    document: {
      _id: id, _type: 'feature', name: seed.name,
      slug: { _type: 'slug', current: `${owner}-${seed.level}-${slugify(seed.name)}`.slice(0, 96) },
      acquiredAtLevel: seed.level, description: seed.description, rulesets: RULESETS,
      isHomebrew: false,
      versionNotes: 'Expanded from the matching MCDM Beastheart specification supplied by the archive owner.',
    },
    reference: ref(id, `${seed.level}-${slugify(seed.name)}-${index}`),
  }
}

async function run() {
  const current = await client.fetch<any>(`*[_id == "class-beastheart"][0]{source, sourceBook, isHomebrew, "subclassIds": subclasses[]._ref}`)
  const expectedSubclassIds = Object.keys(bonds).sort()
  if (!current || current.source !== 'Unofficial' || current.sourceBook !== 'MCDM Productions' || current.isHomebrew || [...current.subclassIds].sort().join(',') !== expectedSubclassIds.join(',')) {
    throw new Error(`Refusing to merge into an unexpected Beastheart record: ${JSON.stringify(current)}`)
  }

  let tx = client.transaction()
  const classRefs = coreFeatures.map((seed, index) => {
    const result = featureDocument('beastheart', seed, index)
    tx = tx.createOrReplace(result.document as any)
    return result.reference
  })

  for (const [subclassId, bond] of Object.entries(bonds)) {
    const owner = subclassId.replace(/^subclass-/, '')
    const featureRefs = bond.features.map((seed, index) => {
      const result = featureDocument(owner, seed, index)
      tx = tx.createOrReplace(result.document as any)
      return result.reference
    })
    tx = tx.patch(subclassId, (patch) => patch.set({
      description: bond.description, features: featureRefs, source: 'Unofficial', sourceBook: 'MCDM Productions',
      edition: 'Both', rulesets: RULESETS, isHomebrew: false,
      versionNotes: 'Placeholder mechanics replaced with the matching MCDM Beastheart Bond progression supplied by the archive owner.',
    }))
  }

  tx = tx.patch('class-beastheart', (patch) => patch.set({
    description: 'A Beastheart forms a supernatural friendship with a wild companion and turns that relationship into a coordinated combat style. The companion builds ferocity, risks entering a rampage, and fuels primal exploits, while both partners grow into an inseparable adventuring team.',
    hitDie: 8, savingThrows: ['STR', 'WIS'],
    proficiencies: [
      { _type: 'proficiencyRule', _key: 'beastheart-armor', type: 'armor', mode: 'fixed', armorOptions: ['Light Armor', 'Medium Armor', 'Shields'] },
      { _type: 'proficiencyRule', _key: 'beastheart-weapons', type: 'weapon', mode: 'fixed', weaponOptions: ['Simple Weapons', 'Battleaxe', 'Greataxe', 'Longbow', 'Net', 'Scimitar', 'Shortsword'] },
      { _type: 'proficiencyRule', _key: 'beastheart-tools', type: 'tool', mode: 'fixed', toolOptions: ["Healer's kit"] },
      { _type: 'proficiencyRule', _key: 'beastheart-skills', type: 'skill', mode: 'choice', count: 3, skillOptions: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Stealth', 'Survival'] },
    ],
    isSpellcaster: false, spellcaster: 'none', features: classRefs, progression, subclassLevel: 3,
    startingEquipment: ['Hide armor; or leather armor, a longbow, and 20 arrows', 'One martial weapon and a shield; or two martial weapons', 'Two handaxes or any simple weapon', 'Dungeoneer’s pack or explorer’s pack'],
    source: 'Unofficial', sourceBook: 'MCDM Productions', edition: 'Both', rulesets: RULESETS, isHomebrew: false,
    versionNotes: 'Expanded from the matching MCDM Beastheart specification supplied by the archive owner; complete ferocity, exploit, companion, and Bond progression added.',
  }).unset(['spellcastingAbility', 'spellLists', 'spells']))

  if (!APPLY) {
    console.log(`Dry run: ${coreFeatures.length} core features and ${Object.values(bonds).flatMap((bond) => bond.features).length} Bond features ready.`)
    return
  }

  const result = await tx.commit({ visibility: 'sync' })
  const audit = await client.fetch<any>(`*[_id == "class-beastheart"][0]{
    source, sourceBook, isHomebrew, isSpellcaster, hitDie, savingThrows,
    "featureCount": count(features), "progressionCount": count(progression),
    "progressionLevels": progression[].level, "exploitValues": progression[].resources[name == "Primal Exploits Known"][0].value,
    "brokenRefs": count(features[!defined(@->._id)]),
    "bonds": *[_id in [${expectedSubclassIds.map((id) => `"${id}"`).join(',')}]] | order(_id asc) {_id, sourceBook, isHomebrew, "featureCount": count(features), "brokenRefs": count(features[!defined(@->._id)])}
  }`)
  if (audit.sourceBook !== 'MCDM Productions' || audit.isHomebrew || audit.isSpellcaster || audit.hitDie !== 8 || audit.savingThrows.join(',') !== 'STR,WIS' || audit.featureCount !== coreFeatures.length || audit.progressionCount !== 20 || audit.progressionLevels.join(',') !== Array.from({ length: 20 }, (_, index) => index + 1).join(',') || audit.exploitValues.join(',') !== '—,3,3,3,3,3,3,3,3,5,5,5,5,5,5,5,7,7,7,7' || audit.brokenRefs || audit.bonds.length !== 5 || audit.bonds.some((bond: any) => bond.sourceBook !== 'MCDM Productions' || bond.isHomebrew || bond.featureCount !== 5 || bond.brokenRefs)) {
    throw new Error(`Beastheart audit failed: ${JSON.stringify(audit)}`)
  }
  console.log(`Applied ${result.results.length} mutations. Verification: ${JSON.stringify(audit)}`)
}

run().catch((error) => { console.error(error); process.exit(1) })
