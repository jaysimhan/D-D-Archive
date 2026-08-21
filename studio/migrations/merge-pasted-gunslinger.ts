import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-08-21' }).withConfig({ perspective: 'raw' })
const APPLY = process.argv.includes('--apply')
const RULESETS = [
  { _type: 'reference', _key: 'srd-2014', _ref: 'ruleset.srd-2014' },
  { _type: 'reference', _key: 'srd-2024', _ref: '86642d23-c52d-4577-adc1-214aab0f43e9' },
]
const ref = (id: string, key = id) => ({ _type: 'reference', _key: key, _ref: id })
type FeatureSeed = { level: number; name: string; description: string }

const progressionRows: Array<[number, number, string, string, string[]]> = [
  [1, 2, '—', '2', ['Fighting Style', 'Quick Draw', 'Weapon Mastery']],
  [2, 2, '4d8', '2', ['Critical Shot', 'Risk']],
  [3, 2, '4d8', '2', ['Gunslinger Subclass']],
  [4, 2, '4d8', '3', ['Ability Score Improvement']],
  [5, 3, '4d8', '3', ['Extra Attack', 'Gut Shot']],
  [6, 3, '5d8', '3', ['Subclass feature']],
  [7, 3, '5d8', '3', ['Evasion']],
  [8, 3, '5d8', '3', ['Ability Score Improvement']],
  [9, 4, '5d8', '3', ['Critical Shot improvement']],
  [10, 4, '5d10', '4', ['Subclass feature']],
  [11, 4, '5d10', '4', ['Overkill']],
  [12, 4, '5d10', '4', ['Ability Score Improvement']],
  [13, 5, '5d10', '4', ['Cheat Death']],
  [14, 5, '6d10', '4', ['Subclass feature']],
  [15, 5, '6d10', '4', ['Dire Gambit']],
  [16, 5, '6d10', '4', ['Ability Score Improvement']],
  [17, 6, '6d10', '4', ['Critical Shot improvement']],
  [18, 6, '6d12', '4', ['Deft Maneuver']],
  [19, 6, '6d12', '4', ['Epic Boon']],
  [20, 6, '6d12', '4', ['Headshot']],
]
const progression = progressionRows.map(([level, proficiencyBonus, riskDice, mastery, featureNames]) => ({
  _type: 'classProgressionRow', _key: `gunslinger-level-${level}`, level, proficiencyBonus,
  resources: [
    { _type: 'object', _key: 'risk-dice', name: 'Risk Dice', value: riskDice },
    { _type: 'object', _key: 'weapon-mastery', name: 'Weapon Mastery', value: mastery },
  ], featureNames,
}))

const coreFeatures: FeatureSeed[] = [
  { level: 1, name: 'Fighting Style', description: 'Gain a Fighting Style feat of your choice. A style that normally requires holding a melee weapon in one or two hands can instead be used with ranged weapons. Whenever you gain a Gunslinger level, you may replace this style with another Fighting Style feat.' },
  { level: 1, name: 'Quick Draw', description: 'You have advantage on Initiative rolls. Whenever you could normally draw or stow one weapon, you may draw or stow two weapons that lack the Two-Handed property.' },
  { level: 1, name: 'Weapon Mastery', description: 'Choose two kinds of Simple or Martial Ranged weapons and use their mastery properties. After each long rest, you may replace one choice. Your number of mastered weapon kinds becomes three at level 4 and four at level 10.' },
  { level: 2, name: 'Critical Shot', description: 'Your ranged weapon attacks score critical hits on a d20 roll of 19–20. The range expands to 18–20 at Gunslinger level 9 and 17–20 at level 17.' },
  { level: 2, name: 'Risk', description: 'You have four d8 Risk Dice, expended to use Gunslinger maneuvers and restored after a short or long rest. The pool becomes five dice at level 6 and six at level 14; the dice become d10s at level 10 and d12s at level 18. A maneuver save DC equals 8 + your Dexterity modifier + proficiency bonus.' },
  { level: 2, name: 'Risk Maneuvers', description: 'Bite the Bullet: bonus action, spend a die for temporary hit points equal to its roll + Gunslinger level. Blindfire: bonus action, gain 30-foot blindsight for the turn. Dodge Roll: bonus action, move 15 feet without opportunity attacks or difficult-terrain cost and reload a held ranged weapon. Grazing Shot: after a ranged weapon miss, deal the die + Dexterity modifier as the weapon’s damage once per turn. Maverick Spirit: add a die to a failed Intelligence, Wisdom, or Charisma check or save, once per turn. Skin of Your Teeth: as a reaction when hit, add the die to AC against that attack.' },
  { level: 3, name: 'Gunslinger Subclass', description: 'Choose a Gunslinger specialization. It grants features at Gunslinger levels 3, 6, 10, and 14.' },
  { level: 4, name: 'Ability Score Improvement', description: 'Gain the Ability Score Improvement feat or another feat for which you qualify. You gain this feature again at levels 8, 12, and 16.' },
  { level: 5, name: 'Extra Attack', description: 'Attack twice instead of once whenever you take the Attack action.' },
  { level: 5, name: 'Gut Shot', description: 'When a ranged weapon attack critically hits a Large or smaller creature, its speed is halved and it has disadvantage on attacks for 1 minute. It may replace one of its attacks to dislodge the projectile and end the effect.' },
  { level: 7, name: 'Evasion', description: 'When an effect permits a Dexterity save for half damage, take no damage on a success and half on a failure. You gain no benefit while incapacitated.' },
  { level: 8, name: 'Ability Score Improvement (8th Level)', description: 'Gain the Ability Score Improvement feat or another feat for which you qualify.' },
  { level: 11, name: 'Overkill', description: 'When a ranged weapon’s damage does not add your ability modifier, add it. If the modifier is already added, deal an extra 1d8 damage of the weapon’s type instead. Firearm-property weapons normally do not add the ability modifier.' },
  { level: 12, name: 'Ability Score Improvement (12th Level)', description: 'Gain the Ability Score Improvement feat or another feat for which you qualify.' },
  { level: 13, name: 'Cheat Death', description: 'When reduced to 0 hit points without being killed outright, drop to 1 hit point instead and regain hit points equal to your Gunslinger level. Recharge after a short or long rest.' },
  { level: 15, name: 'Dire Gambit', description: 'Whenever you roll Initiative or score a critical hit, regain one expended Risk Die.' },
  { level: 16, name: 'Ability Score Improvement (16th Level)', description: 'Gain the Ability Score Improvement feat or another feat for which you qualify.' },
  { level: 18, name: 'Deft Maneuver', description: 'You gain one additional bonus action on each of your turns. This special bonus action can be used only for a Risk maneuver.' },
  { level: 19, name: 'Epic Boon', description: 'Gain an Epic Boon feat or another feat for which you qualify. Boon of Irresistible Offense is recommended.' },
  { level: 20, name: 'Headshot', description: 'When you critically hit with a ranged weapon, declare a Headshot. A target below 100 hit points dies; otherwise it takes an extra 10d10 damage of the weapon’s type. Recharge after a short or long rest, or restore the use immediately by spending three Risk Dice.' },
]

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
function featureDocument(seed: FeatureSeed, index: number) {
  const slug = slugify(seed.name)
  const id = `feature-gunslinger-${seed.level}-${slug}`
  return {
    document: {
      _id: id, _type: 'feature', name: seed.name,
      slug: { _type: 'slug', current: `gunslinger-${seed.level}-${slug}`.slice(0, 96) },
      acquiredAtLevel: seed.level, description: seed.description, rulesets: RULESETS, isHomebrew: false,
      versionNotes: 'Restored from the matching 2024 Valda’s Spire Gunslinger specification supplied by the archive owner.',
    },
    reference: ref(id, `${seed.level}-${slug}-${index}`),
  }
}

async function run() {
  const current = await client.fetch<any>(`*[_id == "class-gunslinger"][0]{source, sourceBook, isHomebrew, hitDie, "subclassIds": subclasses[]._ref}`)
  const expectedSubclassIds = ['subclass-gun-ko-master', 'subclass-gun-tank', 'subclass-high-roller', 'subclass-musketeer', 'subclass-pistolero', 'subclass-sharpshooter', 'subclass-spellslinger'].sort().join(',')
  if (!current || current.source !== 'Unofficial' || current.sourceBook !== "Valda's Spire of Secrets" || current.isHomebrew || current.hitDie !== 8 || [...current.subclassIds].sort().join(',') !== expectedSubclassIds) {
    throw new Error(`Refusing to merge into an unexpected Gunslinger record: ${JSON.stringify(current)}`)
  }

  let tx = client.transaction()
  const featureRefs = coreFeatures.map((seed, index) => {
    const built = featureDocument(seed, index)
    tx = tx.createOrReplace(built.document as any)
    return built.reference
  })
  tx = tx.patch('class-gunslinger', (patch) => patch.set({
    description: 'A bold renegade who masters volatile black-powder weapons through split-second timing, nerve, and luck. Gunslingers remain mobile in a shootout, fuel daring maneuvers with Risk Dice, and turn precision into devastating critical shots.',
    hitDie: 8, primaryAbility: ['DEX'], savingThrows: ['DEX', 'CHA'],
    proficiencies: [
      { _type: 'proficiencyRule', _key: 'gunslinger-armor', type: 'armor', mode: 'fixed', armorOptions: ['Light Armor'] },
      { _type: 'proficiencyRule', _key: 'gunslinger-weapons', type: 'weapon', mode: 'fixed', weaponOptions: ['Simple Weapons', 'Martial Ranged Weapons'] },
      { _type: 'proficiencyRule', _key: 'gunslinger-skills', type: 'skill', mode: 'choice', count: 2, skillOptions: ['Acrobatics', 'Animal Handling', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Perception', 'Persuasion', 'Sleight of Hand', 'Stealth'] },
    ],
    startingEquipment: ['Option A: Leather armor, 2 daggers, a revolver, 50 bullets, an explorer’s pack, and 11 GP', 'Option B: 175 GP'],
    isSpellcaster: false, spellcaster: 'none', features: featureRefs, progression, subclassLevel: 3,
    source: 'Unofficial', sourceBook: "Valda's Spire of Secrets", edition: 'Both', rulesets: RULESETS, isHomebrew: false,
    versionNotes: 'Core class upgraded to the matching supplied 2024 Valda’s Spire revision with full Risk Dice, Weapon Mastery, maneuvers, and progression. All seven existing subclass tracks retained because the supplied excerpt contains subclass summaries but no subclass mechanics.',
  }).unset(['spellcastingAbility', 'spellLists', 'spells']))

  if (!APPLY) {
    console.log(`Dry run: replace 3 abbreviated core features with ${coreFeatures.length} complete features, add ${progression.length} progression rows, and retain all 7 subclass tracks.`)
    return
  }

  const result = await tx.commit({ visibility: 'sync' })
  const audit = await client.fetch<any>(`*[_id == "class-gunslinger"][0]{source, sourceBook, isHomebrew, isSpellcaster, spellcaster, hitDie, primaryAbility, savingThrows, "featureCount": count(features), "progressionCount": count(progression), "subclassCount": count(subclasses), "brokenRefs": count(features[!defined(@->._id)]) + count(subclasses[!defined(@->._id)]), "riskDice": progression[].resources[name == "Risk Dice"][0].value, "mastery": progression[].resources[name == "Weapon Mastery"][0].value}`)
  if (audit.source !== 'Unofficial' || audit.sourceBook !== "Valda's Spire of Secrets" || audit.isHomebrew || audit.isSpellcaster || audit.spellcaster !== 'none' || audit.hitDie !== 8 || audit.primaryAbility.join(',') !== 'DEX' || audit.savingThrows.join(',') !== 'DEX,CHA' || audit.featureCount !== coreFeatures.length || audit.progressionCount !== 20 || audit.subclassCount !== 7 || audit.brokenRefs || audit.riskDice.join(',') !== progressionRows.map((row) => row[2]).join(',') || audit.mastery.join(',') !== progressionRows.map((row) => row[3]).join(',')) {
    throw new Error(`Gunslinger merge audit failed: ${JSON.stringify(audit)}`)
  }
  console.log(`Applied ${result.results.length} mutations. Verification: ${JSON.stringify(audit)}`)
}

run().catch((error) => { console.error(error); process.exit(1) })
