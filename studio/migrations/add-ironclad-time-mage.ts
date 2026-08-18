import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-08-18' })
const APPLY = process.argv.includes('--apply')
const R14 = { _type: 'reference', _key: 'srd-2014', _ref: 'ruleset.srd-2014' }
const R24 = { _type: 'reference', _key: 'srd-2024', _ref: '86642d23-c52d-4577-adc1-214aab0f43e9' }
const ref = (id: string, key = id) => ({ _type: 'reference', _key: key, _ref: id })
const spellRef = (slug: string) => ref(`spell-${slug}`, slug)

const witherbloom = [
  'cure-wounds', 'inflict-wounds', 'lesser-restoration', 'wither-and-bloom',
  'revivify', 'vampiric-touch', 'blight', 'death-ward', 'antilife-shell', 'greater-restoration',
]

const features = [
  {
    _id: 'feature-clockwork-magic', _type: 'feature', name: 'Clockwork Magic',
    slug: { _type: 'slug', current: 'clockwork-magic' }, acquiredAtLevel: 1,
    description: 'You learn additional Clockwork spells. Whenever you gain a Sorcerer level, you may replace one with an Abjuration or Transmutation spell of the same level from the Sorcerer, Warlock, or Wizard list.',
    rulesets: [R14], isHomebrew: false,
  },
  {
    _id: 'feature-restore-balance', _type: 'feature', name: 'Restore Balance',
    slug: { _type: 'slug', current: 'restore-balance' }, acquiredAtLevel: 1,
    description: 'When a creature you can see within 60 feet is about to roll with advantage or disadvantage, you can use your reaction to prevent advantage and disadvantage from affecting the roll.',
    rulesets: [R14], isHomebrew: false,
  },
]

async function transaction() {
  const candidates = await client.fetch<Array<{ slug: string; school: string; classes: string[]; source: string; edition: string }>>(`
    *[_type == "spell" && level == 1]{
      "slug": slug.current,
      "school": coalesce(school->name, legacySchoolName),
      classes, source, edition
    }
  `)
  const replacements = candidates
    .filter((spell) => ['Abjuration', 'Transmutation'].includes(spell.school))
    .filter((spell) => spell.source === 'Official' && ['2014', 'Both', '5e'].includes(spell.edition))
    .filter((spell) => spell.classes?.some((id) => ['sorcerer', 'warlock', 'wizard'].includes(id)))
    .map((spell) => spell.slug)
  if (!replacements.includes('armor-of-agathys')) replacements.push('armor-of-agathys')

  let tx = client.transaction()
  for (const feature of features) tx = tx.createOrReplace(feature as any)
  tx = tx.createOrReplace({
    _id: 'spell-wither-and-bloom', _type: 'spell', name: 'Wither and Bloom',
    slug: { _type: 'slug', current: 'wither-and-bloom' }, level: 2,
    school: ref('magicSchool.necromancy', 'necromancy'), legacySchoolName: 'Necromancy',
    castingTime: '1 action', range: '60 feet', duration: 'Instantaneous',
    components: { verbal: true, somatic: true, material: true, materialDescription: 'a withered vine twisted into a loop' },
    concentration: false, ritual: false,
    description: 'Necromantic energy fills a 10-foot-radius sphere. Creatures you choose in the area make Constitution saves, taking 2d6 necrotic damage on a failure or half on a success. One creature you choose in the area may spend and roll one Hit Die, regaining that roll plus your spellcasting modifier in hit points.',
    higherLevels: 'Damage increases by 1d6 for each slot level above 2nd, and the healing creature may spend one additional Hit Die for each slot level above 2nd.',
    classes: ['druid', 'sorcerer', 'wizard'], source: 'Official', edition: '2014', version: 1,
    rulesets: [R14], isHomebrew: false,
  } as any)
  tx = tx.patch('race-mountain-dwarf', (p) => p.set({
    source: 'Official', edition: '2014', flexibleAbilityScores: false,
    abilityScoreIncrease: { STR: 2, CON: 2 }, rulesets: [R14],
    proficiencies: [
      { _type: 'proficiencyRule', _key: 'dwarven-armor', type: 'armor', mode: 'fixed', armorOptions: ['Light Armor', 'Medium Armor'] },
      { _type: 'proficiencyRule', _key: 'dwarven-weapons', type: 'weapon', mode: 'fixed', weaponOptions: ['Battleaxe', 'Handaxe', 'Light Hammer', 'Warhammer'] },
    ],
  }))
  tx = tx.patch('background-witherbloom-student', (p) => p.set({
    source: 'Official', edition: '2014', rulesets: [R14], isHomebrew: false,
    feats: [ref('feat-strixhaven-initiate-witherbloom', 'strixhaven-initiate-witherbloom')],
    expandedSpells: witherbloom.map(spellRef),
    feature: {
      name: 'Witherbloom Spells',
      description: 'The Witherbloom spells are added to the spell list of your spellcasting class. They remain normal spells-known or prepared choices.',
    },
  }))
  tx = tx.createOrReplace({
    _id: 'item-scale-mail', _type: 'item', name: 'Scale Mail',
    slug: { _type: 'slug', current: 'scale-mail' }, itemCategory: 'Armor', type: 'Armor',
    description: 'Medium armor made from overlapping metal scales. It imposes disadvantage on Dexterity (Stealth) checks.',
    armorClass: { base: 14, dexterityModifier: 'max2', stealthDisadvantage: true },
    cost: { amount: 50, currency: 'gp' }, weight: 45,
    properties: ['Medium Armor', 'Stealth Disadvantage'], magical: false, requiresAttunement: false,
    source: 'Official', edition: 'Both', version: 1, rulesets: [R14, R24], isHomebrew: false,
  } as any)
  tx = tx.patch('subclass-clockwork-sorcery', (p) => p.set({
    name: 'Clockwork Soul', source: 'Official', edition: '2014', rulesets: [R14], isSpellcaster: true,
    parentClassId: 'sorcerer', parentClass: ref('class-sorcerer', 'sorcerer'),
    description: 'A Sorcerous Origin whose magic is shaped by the perfect order of Mechanus.',
    features: features.map((feature) => ref(feature._id, feature.slug.current)),
    spells: [
      { _type: 'spellGrant', _key: 'clockwork-level-1', name: 'Clockwork Magic', level: 1, mode: 'fixed', specificSpells: [spellRef('alarm'), spellRef('protection-from-evil-and-good')], ability: 'CHA' },
      { _type: 'spellGrant', _key: 'clockwork-alarm-swap', name: 'Clockwork Magic — replace Alarm', level: 2, mode: 'choice', count: 1, spellLevel: 1, replacesSpell: spellRef('alarm'), specificSpells: replacements.sort().map(spellRef), ability: 'CHA', notes: 'Choose a same-level Abjuration or Transmutation spell from the Sorcerer, Warlock, or Wizard list.' },
      { _type: 'spellGrant', _key: 'clockwork-level-3', name: 'Clockwork Magic', level: 3, mode: 'fixed', specificSpells: [spellRef('aid'), spellRef('lesser-restoration')], ability: 'CHA' },
    ],
  }))
  return { tx, replacements }
}

async function run() {
  const { tx, replacements } = await transaction()
  if (!APPLY) return console.log(`Dry run: ${replacements.length} Clockwork replacement choices; add --apply to commit.`)
  const result = await tx.commit()
  console.log(`Applied Ironclad Time-Mage support (${result.results.length} documents).`)
}

run().catch((error) => { console.error(error); process.exit(1) })
