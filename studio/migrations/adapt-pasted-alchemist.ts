import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-08-21' }).withConfig({ perspective: 'raw' })
const APPLY = process.argv.includes('--apply')
const R14 = { _type: 'reference', _key: 'srd-2014', _ref: 'ruleset.srd-2014' }
const R24 = { _type: 'reference', _key: 'srd-2024', _ref: '86642d23-c52d-4577-adc1-214aab0f43e9' }
const RULESETS = [R14, R24]
const ref = (id: string, key = id) => ({ _type: 'reference', _key: key, _ref: id })

type FeatureSeed = { level: number; name: string; description: string }

const classFeatures: FeatureSeed[] = [
  { level: 1, name: 'Portable Station', description: "You carry a compact alchemical station containing beakers, flasks, phials, bandages, tongs, a metal work plate, and a solstone that produces heat when exposed to water. Choose the station's form with your GM, such as a reinforced coat or enchanted satchel; it lets you prepare and use your Alchemist features while adventuring." },
  { level: 1, name: 'Volatile Mixtures', description: 'After a long rest, create a number of volatile mixtures equal to your Intelligence modifier (minimum one). As an action, throw one with a normal range of 20 feet and long range of 60 feet. On a hit, the target takes 1d8 + your Intelligence modifier acid or fire damage, chosen when the mixture is made. Creatures within 5 feet of the target make a Dexterity saving throw against your spell save DC, taking damage equal to your Intelligence modifier (minimum one) on a failure or half as much on a success. Unused mixtures become inert at your next long rest.' },
  { level: 1, name: 'Elixirs', description: 'You are an Intelligence-based full spellcaster, but you store spells in prepared elixirs instead of casting them directly. After a long rest, expend your spell slots to bottle spells from the Druid or Wizard spell lists. A creature can drink or throw an elixir as appropriate for the stored spell, allowing allies to use your preparations. Elixirs not used before your next long rest become inert. Your spell save DC is 8 + your proficiency bonus + your Intelligence modifier, and your spell attack modifier is your proficiency bonus + your Intelligence modifier.' },
  { level: 2, name: 'Discovery', description: 'Choose two alchemical Discoveries, gaining two more choices whenever this feature appears again. Available basic Discoveries include Flesh-Eating Bomb (volatile mixtures may deal necrotic damage, increase their damage die one step against unarmored organic creatures, and deal half damage to inorganic creatures), Poisoned Flesh (a creature that bites or ingests part of you is poisoned for 1 minute), Chameleon Ink (1 minute to apply; grants advantage on Stealth checks for 1 hour or until the wearer is hit), and Cognitive Mutagen (Mutagenist only; for 10 minutes grants advantage on Intelligence, Wisdom, and Charisma checks and saves but disadvantage on Strength and Constitution checks and saves).' },
  { level: 3, name: 'Alchemical School', description: 'Choose an Alchemical School. Mad Bomber develops destructive mixtures, Mutagenist transforms living bodies, and Venomsmith develops toxins. Your school grants features now and again at levels 9, 13, and 17.' },
  { level: 4, name: 'Ability Score Improvement', description: 'Increase one ability score by 2, increase two ability scores by 1, or choose a feat for which you qualify.' },
  { level: 5, name: 'Complex Compounds', description: 'When you create a volatile mixture or damaging elixir, choose acid, cold, fire, lightning, or poison for its damage type. You also designate one spell you can prepare as a ritual formula, plus one additional spell at every Alchemist level after 5th. Given the spell’s ritual casting time, you can brew such an elixir without expending a spell slot, but you can have no more than two ritual elixirs at once; they still become inert at your next long rest.' },
  { level: 6, name: 'Discovery (6th Level)', description: 'Make two additional Discovery choices for which you meet the prerequisites.' },
  { level: 7, name: 'Swift Alchemy', description: 'After you use an elixir or throw a volatile mixture, you can make one weapon attack as a bonus action. You no longer take damage from your own volatile mixtures.' },
  { level: 8, name: 'Ability Score Improvement (8th Level)', description: 'Increase one ability score by 2, increase two ability scores by 1, or choose a feat for which you qualify.' },
  { level: 9, name: 'Alchemical School Feature (9th Level)', description: 'You gain the 9th-level feature of your chosen Alchemical School.' },
  { level: 10, name: 'Discovery (10th Level)', description: 'Make two additional Discovery choices for which you meet the prerequisites.' },
  { level: 11, name: 'Self-Experimentation', description: 'Repeated exposure to your own compounds grants resistance to acid and poison damage and immunity to the poisoned condition.' },
  { level: 12, name: 'Ability Score Improvement (12th Level)', description: 'Increase one ability score by 2, increase two ability scores by 1, or choose a feat for which you qualify.' },
  { level: 13, name: 'Alchemical School Feature (13th Level)', description: 'You gain the 13th-level feature of your chosen Alchemical School.' },
  { level: 14, name: 'Discovery (14th Level)', description: 'Make two additional Discovery choices for which you meet the prerequisites.' },
  { level: 15, name: 'Perfected Self-Experimentation', description: 'Your resistance matures into immunity to acid and poison damage. You remain immune to the poisoned condition.' },
  { level: 16, name: 'Discovery (16th Level)', description: 'Make two additional Discovery choices for which you meet the prerequisites.' },
  { level: 16, name: 'Ability Score Improvement (16th Level)', description: 'Increase one ability score by 2, increase two ability scores by 1, or choose a feat for which you qualify.' },
  { level: 17, name: 'Alchemical School Feature (17th Level)', description: 'You gain the 17th-level feature of your chosen Alchemical School.' },
  { level: 18, name: 'Discovery (18th Level)', description: 'Make two additional Discovery choices for which you meet the prerequisites.' },
  { level: 19, name: 'Ability Score Improvement (19th Level)', description: 'Increase one ability score by 2, increase two ability scores by 1, or choose a feat for which you qualify.' },
  { level: 20, name: 'Eclectic', description: 'Choose a second Alchemical School. You gain that school’s 3rd- and 9th-level features.' },
  { level: 20, name: 'Discovery (20th Level)', description: 'Make two final Discovery choices for which you meet the prerequisites.' },
]

const subclassFeatures: Record<string, FeatureSeed[]> = {
  'subclass-mad-bomber': [
    { level: 3, name: 'Throw Anything', description: 'You are proficient with improvised weapons when you throw them.' },
    { level: 3, name: 'Bombard', description: 'Whenever you throw volatile mixtures, you can throw two instead of one. Your elixirs and volatile mixtures no longer damage you or your allies.' },
    { level: 9, name: 'Alchemical Bombs', description: 'Your volatile mixture damage becomes 2d6, increasing to 2d8 at 13th level and 3d8 at 17th level. When you would prepare an elixir, you can instead prepare a number of bombs equal to that elixir’s spell level. You can carry additional bombs equal to half your Alchemist level.' },
    { level: 13, name: 'Fallout', description: 'When preparing bombs, designate up to your Intelligence modifier as fallout bombs. A fire bomb leaves a 5-foot burning patch for 1 round that deals 1d8 fire damage when entered or when a creature starts or ends there; poison creates a 5-foot cloud whose creatures save against being poisoned; acid forces a Dexterity save or damages one random piece of metal equipment; cold coats a 5-foot space in difficult-terrain ice; and lightning prevents the initial target from taking reactions until the start of your next turn.' },
    { level: 17, name: 'Artillery', description: 'Your bomb range increases to 40/120 feet. Every enemy caught in a volatile mixture’s blast takes the mixture’s full damage rather than damage equal to your Intelligence modifier.' },
  ],
  'subclass-alchemist-mutagenist': [
    { level: 3, name: 'Mutagen', description: 'Once per long rest, create one mutagen, which becomes inert at your next long rest. A creature that drinks it has advantage on Strength, Dexterity, and Constitution saving throws for 10 minutes, increases its Strength score by 4, and decreases its Intelligence score by 4 (to a minimum of 3). It has disadvantage on Intelligence saving throws. You can hold two mutagens at 9th level and three at 13th. Drinking a second mutagen cancels both.' },
    { level: 3, name: 'Flush Out', description: 'You can end the effects of a mutagen affecting you at any time, requiring no action.' },
    { level: 9, name: 'Unflinching Mutagen', description: 'A creature affected by one of your mutagens cannot be frightened and has advantage on saving throws against being charmed.' },
    { level: 13, name: 'Rapid Growth', description: 'A creature affected by your mutagen grows by one size category and gains 2d10 temporary hit points for the mutagen’s duration.' },
    { level: 17, name: 'Perfected Mutagen', description: 'Once per long rest, create a perfected mutagen that lasts 1 hour. A creature cannot benefit from a normal and perfected mutagen simultaneously; combining them cancels both and gives the creature two levels of exhaustion.' },
  ],
  'subclass-venomsmith': [
    { level: 3, name: 'Poison Application', description: 'You can apply poison to one weapon or piece of ammunition as a bonus action without risking poisoning yourself. The poison remains until that weapon or ammunition hits.' },
    { level: 3, name: 'Toxin Production', description: 'Once per long rest, when preparing elixirs, replace up to your Intelligence modifier of them (minimum one) with toxins. On a hit with a poisoned weapon, the target takes 1d4 poison damage per spell level of the replaced elixir and makes a Constitution save against your spell save DC. On a failure it is poisoned for 1 minute and takes another 1d4 poison damage at the end of each turn; it repeats the save at the start of each turn, ending the effect on a success.' },
    { level: 9, name: 'Advanced Toxicology', description: 'Learn two advanced toxin effects, one more at 13th level, and the final effect at 17th: Anesthesia puts a target to sleep for 1 minute until damaged; Paralysis uses a Strength save and paralyzes for up to 1 minute; Wilting Toxin halves the target’s weapon damage for up to 1 minute; Blinding Toxin blinds for up to 1 minute. Each permits a new save at the start of the target’s turn.' },
    { level: 13, name: 'Potency', description: 'When preparing a toxin, you may remove all of its damage. If you do, its target has disadvantage on saving throws against that toxin’s effects.' },
    { level: 17, name: 'Plague', description: 'When preparing a toxin, you can apply two secondary toxin effects to it. A toxin prepared this way deals no damage.' },
  ],
}

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

function featureDocument(owner: string, seed: FeatureSeed, index: number) {
  const id = `feature-${owner}-${seed.level}-${slugify(seed.name)}`
  return {
    document: {
      _id: id, _type: 'feature', name: seed.name,
      slug: { _type: 'slug', current: `${owner}-${seed.level}-${slugify(seed.name)}`.slice(0, 96) },
      acquiredAtLevel: seed.level, description: seed.description,
      rulesets: RULESETS, isHomebrew: true,
      versionNotes: 'Adapted from the Alchemist specification supplied by the archive owner.',
    },
    reference: ref(id, `${seed.level}-${slugify(seed.name)}-${index}`),
  }
}

async function run() {
  let tx = client.transaction()
  const classFeatureRefs = classFeatures.map((seed, index) => {
    const result = featureDocument('alchemist', seed, index)
    tx = tx.createOrReplace(result.document as any)
    return result.reference
  })

  for (const [subclassId, seeds] of Object.entries(subclassFeatures)) {
    const owner = subclassId.replace(/^subclass-/, '')
    const featureRefs = seeds.map((seed, index) => {
      const result = featureDocument(owner, seed, index)
      tx = tx.createOrReplace(result.document as any)
      return result.reference
    })
    const name = subclassId === 'subclass-mad-bomber' ? 'Mad Bomber' : subclassId === 'subclass-alchemist-mutagenist' ? 'Mutagenist' : 'Venomsmith'
    const description = subclassId === 'subclass-mad-bomber'
      ? 'An Alchemical School devoted to demolitions, powerful bombs, and elemental fallout.'
      : subclassId === 'subclass-alchemist-mutagenist'
        ? 'An Alchemical School that transforms living bodies through increasingly powerful mutagens.'
        : 'The archive’s School of Toxicology, devoted to poison application and debilitating engineered toxins.'
    tx = tx.patch(subclassId, (patch) => patch.set({
      name, description, features: featureRefs, source: 'Homebrew', edition: 'Both', rulesets: RULESETS,
      isHomebrew: true, versionNotes: 'Mechanics adapted from the Alchemist specification supplied by the archive owner.',
    }).unset(['sourceBook']))
  }

  tx = tx.patch('class-alchemist', (patch) => patch.set({
    description: 'Alchemists are traveling researchers who combine mundane reagents, arcane channeling, and portable laboratories to create volatile bombs, restorative or destructive spell-elixirs, mutagens, and toxins for themselves and their allies.',
    hitDie: 8,
    primaryAbility: ['INT'],
    savingThrows: ['CON', 'INT'],
    proficiencies: [
      { _type: 'proficiencyRule', _key: 'alchemist-armor', type: 'armor', mode: 'fixed', armorOptions: ['Light Armor'] },
      { _type: 'proficiencyRule', _key: 'alchemist-weapons', type: 'weapon', mode: 'fixed', weaponOptions: ['Simple Weapons', 'Blowgun', 'Light Crossbow', 'Hand Crossbow', 'Heavy Crossbow', 'Firearms'] },
      { _type: 'proficiencyRule', _key: 'alchemist-tools', type: 'tool', mode: 'fixed', toolOptions: ["Alchemist's supplies", "Poisoner's kit", 'Herbalism kit'] },
      { _type: 'proficiencyRule', _key: 'alchemist-skills', type: 'skill', mode: 'choice', count: 3, skillOptions: ['Sleight of Hand', 'Insight', 'Investigation', 'Medicine', 'Nature', 'Perception', 'Survival', 'Persuasion', 'Arcana'] },
    ],
    isSpellcaster: true,
    spellcaster: 'full',
    spellcastingAbility: 'INT',
    spellLists: ['druid', 'wizard'],
    features: classFeatureRefs,
    subclasses: [ref('subclass-mad-bomber', 'mad-bomber'), ref('subclass-alchemist-mutagenist', 'mutagenist'), ref('subclass-venomsmith', 'venomsmith')],
    subclassLevel: 3,
    startingEquipment: ['One simple weapon or one firearm', "Dungeoneer's Pack or Explorer's Pack", "Alchemist's Supplies", 'Leather Armor', 'Dagger', 'Portable Station'],
    source: 'Homebrew', edition: 'Both', rulesets: RULESETS, isHomebrew: true,
    versionNotes: 'Rebuilt from the Alchemist specification supplied by the archive owner; Mad Bomber, Mutagenist, and Venomsmith carry the Bomber, Mutator, and Toxicology mechanics.',
  }).unset(['sourceBook']))

  if (!APPLY) return console.log(`Dry run: ${classFeatures.length} class features and ${Object.values(subclassFeatures).flat().length} subclass features ready.`)
  const result = await tx.commit({ visibility: 'sync' })
  const audit = await client.fetch<{
    classFeatures: number; subclasses: Array<{ _id: string; featureCount: number }>;
    hitDie: number; savingThrows: string[]; spellLists: string[];
    isSpellcaster: boolean; isHomebrew: boolean; startingEquipment: string[]; brokenRefs: number
  }>(`*[_id == "class-alchemist"][0]{
    "classFeatures": count(features), hitDie, savingThrows, spellLists, isSpellcaster, isHomebrew, startingEquipment,
    "subclasses": *[_id in ["subclass-mad-bomber", "subclass-alchemist-mutagenist", "subclass-venomsmith"]] | order(_id asc) {_id, "featureCount": count(features)},
    "brokenRefs": count(features[!defined(@->._id)]) + count(*[_id in ["subclass-mad-bomber", "subclass-alchemist-mutagenist", "subclass-venomsmith"]].features[!defined(@->._id)])
  }`)
  if (audit.classFeatures !== classFeatures.length || audit.subclasses.length !== 3 || audit.subclasses.some((item) => item.featureCount !== 5) || audit.hitDie !== 8 || audit.savingThrows.join(',') !== 'CON,INT' || audit.spellLists.join(',') !== 'druid,wizard' || !audit.isSpellcaster || !audit.isHomebrew || audit.brokenRefs) {
    throw new Error(`Alchemist audit failed: ${JSON.stringify(audit)}`)
  }
  console.log(`Applied ${result.results.length} mutations. Verification: ${JSON.stringify(audit)}`)
}

run().catch((error) => { console.error(error); process.exit(1) })
