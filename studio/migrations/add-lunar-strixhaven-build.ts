import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-08-18' })
const APPLY = process.argv.includes('--apply')
const RULESET_2014 = { _type: 'reference', _key: 'srd-2014', _ref: 'ruleset.srd-2014' }
const ref = (id: string, key = id) => ({ _type: 'reference', _key: key, _ref: id })
const spellRef = (slug: string) => ref(`spell-${slug}`, slug)
const classRef = (slug: string) => ref(`class-${slug}`, slug)

const colleges = [
  {
    slug: 'lorehold',
    name: 'Lorehold',
    cantrips: ['light', 'sacred-flame', 'thaumaturgy'],
    classes: ['cleric', 'wizard'],
  },
  {
    slug: 'prismari',
    name: 'Prismari',
    cantrips: ['fire-bolt', 'prestidigitation', 'ray-of-frost'],
    classes: ['druid', 'sorcerer'],
  },
  {
    slug: 'quandrix',
    name: 'Quandrix',
    cantrips: ['druidcraft', 'guidance', 'mage-hand'],
    classes: ['druid', 'wizard'],
  },
  {
    slug: 'silverquill',
    name: 'Silverquill',
    cantrips: ['sacred-flame', 'thaumaturgy', 'vicious-mockery'],
    classes: ['bard', 'cleric'],
  },
  {
    slug: 'witherbloom',
    name: 'Witherbloom',
    cantrips: ['chill-touch', 'druidcraft', 'spare-the-dying'],
    classes: ['druid', 'wizard'],
  },
]

const common = {
  source: 'Official',
  edition: '2014',
  version: 1,
  rulesets: [RULESET_2014],
  isHomebrew: false,
}

const feats = colleges.map((college) => ({
  _id: `feat-strixhaven-initiate-${college.slug}`,
  _type: 'feat',
  name: `Strixhaven Initiate (${college.name})`,
  slug: { _type: 'slug', current: `strixhaven-initiate-${college.slug}` },
  description: `Magical study at ${college.name} grants two college cantrips and one 1st-level spell from an associated class list. The 1st-level spell can be cast once per long rest without a slot.`,
  benefits: {
    features: [
      'Choose two of the three listed college cantrips',
      'Choose one 1st-level spell from either associated class list',
      'Choose Intelligence, Wisdom, or Charisma as the spellcasting ability',
    ],
  },
  grants: [
    {
      _type: 'featureGrant',
      _key: 'college-cantrips',
      grantType: 'Spell Slot',
      slotLevel: 0,
      slotCount: 2,
      spellRestrictions: college.cantrips.map(spellRef),
    },
    {
      _type: 'featureGrant',
      _key: 'college-level-1',
      grantType: 'Spell Slot',
      slotLevel: 1,
      slotCount: 1,
      classRestrictions: college.classes.map(classRef),
    },
  ],
  ...common,
}))

const features = [
  {
    _id: 'feature-lunar-embodiment',
    _type: 'feature',
    name: 'Lunar Embodiment',
    slug: { _type: 'slug', current: 'lunar-embodiment' },
    acquiredAtLevel: 1,
    description: 'Choose Full Moon, New Moon, or Crescent Moon after a long rest. You know the lunar spells your Sorcerer level has unlocked, and can cast the 1st-level spell associated with the active phase once per long rest without a spell slot.',
    rulesets: [RULESET_2014],
    isHomebrew: false,
    versionNotes: 'Dragonlance: Shadow of the Dragon Queen.',
  },
  {
    _id: 'feature-moon-fire',
    _type: 'feature',
    name: 'Moon Fire',
    slug: { _type: 'slug', current: 'moon-fire' },
    acquiredAtLevel: 1,
    description: 'You learn Sacred Flame; it counts as a Sorcerer spell for you and does not count against your cantrips known.',
    rulesets: [RULESET_2014],
    isHomebrew: false,
    versionNotes: 'Dragonlance: Shadow of the Dragon Queen.',
  },
]

const lunarSorcery = {
  _id: 'subclass-lunar-sorcery',
  _type: 'subclass',
  name: 'Lunar Sorcery',
  slug: { _type: 'slug', current: 'lunar-sorcery' },
  parentClassId: 'sorcerer',
  parentClass: ref('class-sorcerer', 'sorcerer'),
  description: 'A Sorcerous Origin that channels the changing phases of the moon, granting phase-linked spells and magical benefits.',
  isSpellcaster: true,
  magicType: 'Full Spellcasting (Sorcerer List)',
  magicAbility: 'Charisma',
  magicDescription: 'Lunar spells count as Sorcerer spells and do not count against spells known.',
  features: features.map((feature) => ref(feature._id, feature.slug.current)),
  spells: [
    {
      _type: 'spellGrant', _key: 'moon-fire', name: 'Moon Fire', level: 1, mode: 'fixed',
      specificSpells: [spellRef('sacred-flame')], ability: 'CHA', recharge: 'at-will',
    },
    {
      _type: 'spellGrant', _key: 'lunar-level-1', name: 'Lunar Embodiment — 1st-level phase spells', level: 1, mode: 'fixed',
      specificSpells: ['shield', 'ray-of-sickness', 'color-spray'].map(spellRef), ability: 'CHA',
      notes: 'The spell matching the active phase can be cast once per long rest without a slot.',
    },
    {
      _type: 'spellGrant', _key: 'lunar-level-3', name: 'Lunar Embodiment — 2nd-level phase spells', level: 3, mode: 'fixed',
      specificSpells: ['lesser-restoration', 'blindness-deafness', 'alter-self'].map(spellRef), ability: 'CHA',
    },
  ],
  ...common,
  versionNotes: 'Dragonlance: Shadow of the Dragon Queen.',
}

const bloodwellVial = {
  _id: 'item-bloodwell-vial-1',
  _type: 'item',
  name: 'Bloodwell Vial, +1',
  slug: { _type: 'slug', current: 'bloodwell-vial-1' },
  itemCategory: 'Wondrous Item',
  type: 'Wondrous Item',
  description: 'An attunement-required Sorcerer spellcasting focus. It grants +1 to Sorcerer spell attack rolls and spell save DCs. When you spend Hit Dice to recover hit points while carrying it, you can regain up to 5 spent Sorcery Points; this recovery recharges at the next dawn.',
  magical: true,
  magicBonus: 1,
  rarity: 'Uncommon',
  requiresAttunement: true,
  grants: [{
    _type: 'featureGrant',
    _key: 'bloodwell-sorcery-points',
    grantType: 'Resource Pool',
    resourceName: 'Sorcery Points recovered',
    maxAmount: 5,
    resetCondition: 'Dawn',
  }],
  ...common,
  versionNotes: "Tasha's Cauldron of Everything.",
}

const requiredIds = [
  ...new Set([
    ...colleges.flatMap((college) => college.cantrips.map((slug) => `spell-${slug}`)),
    ...['sacred-flame', 'shield', 'ray-of-sickness', 'color-spray', 'lesser-restoration', 'blindness-deafness', 'alter-self'].map((slug) => `spell-${slug}`),
    ...colleges.flatMap((college) => college.classes.map((slug) => `class-${slug}`)),
    'class-sorcerer',
  ]),
]

async function main() {
  const existing = await client.fetch<string[]>(`*[_id in $ids]._id`, { ids: requiredIds })
  const missing = requiredIds.filter((id) => !existing.includes(id))
  if (missing.length) throw new Error(`Missing required references: ${missing.join(', ')}`)

  const documents = [...features, ...feats, lunarSorcery, bloodwellVial]
  const alreadyThere = await client.fetch<string[]>(`*[_id in $ids]._id`, { ids: documents.map((doc) => doc._id) })
  console.log(`${APPLY ? 'Applying' : 'Dry run'}: ${documents.length - alreadyThere.length} new documents; ${alreadyThere.length} already present.`)
  if (!APPLY) return

  let transaction = client.transaction()
  for (const document of documents) transaction = transaction.createIfNotExists(document as any)
  await transaction.commit()

  const sorcerer = await client.fetch<any>(`*[_id == "class-sorcerer"][0]{edition, rulesets}`)
  const rulesets = [...(sorcerer?.rulesets ?? [])]
  if (!rulesets.some((entry: any) => entry?._key === 'srd-2014' || entry?._ref === 'ruleset.srd-2014')) {
    rulesets.push(RULESET_2014)
  }
  await client.patch('class-sorcerer').set({ edition: 'Both', rulesets }).commit()
  console.log('Lunar Sorcery build data applied; Sorcerer enabled for 2014 without removing existing rulesets.')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
