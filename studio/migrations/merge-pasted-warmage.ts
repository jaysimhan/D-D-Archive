import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-08-21' }).withConfig({ perspective: 'raw' })
const APPLY = process.argv.includes('--apply')
const RULESETS = [
  { _type: 'reference', _key: 'srd-2014', _ref: 'ruleset.srd-2014' },
  { _type: 'reference', _key: 'srd-2024', _ref: '86642d23-c52d-4577-adc1-214aab0f43e9' },
]
const ref = (id: string, key = id) => ({ _type: 'reference', _key: key, _ref: id })
type FeatureSeed = { level: number; name: string; description: string }
type ExistingFeature = { _key: string; _ref: string; level: number }

// This source is a distinct Charisma/Mana martial class, not Valda's
// Intelligence/cantrip Warmage. Its chassis is retained as an explicitly
// optional, protected variant instead of overwriting the canonical class.
const supplements: FeatureSeed[] = [
  { level: 1, name: 'Elemental War Variant: Mana Pool', description: 'Optional Elemental War chassis. Use Charisma as its spellcasting ability and the following Mana Point maximum by Warmage level: 4 at levels 1–2, 8 at 3–4, 16 at 5–6, 24 at 7–8, 28 at 9–10, 36 at 11–12, 40 at 13–14, 57 at 15–16, 64 at 17–18, and 80 at 19–20. Restore all points after a long rest. Mana spent on one feature cannot exceed 2 through level 4, 3 through level 8, 5 through level 12, 6 through level 16, or 7 thereafter.' },
  { level: 1, name: 'Elemental War Variant: Spellcasting', description: 'Create spell slots by spending Mana Points: 2 for 1st level, 3 for 2nd, 5 for 3rd, 6 for 4th, or 7 for 5th. Maximum spell level is 1st through level 4, 2nd through level 8, 3rd through level 12, 4th through level 16, and 5th thereafter. Spells known are 1 at level 1, 2 at 2, 3 at 3–4, 4 at 5–6, 5 at 7–8, 6 at 9–10, 7 at 11–12, 8 at 13–14, 9 at 15–16, 10 at 17–18, and 11 at 19–20. Use Charisma (save DC 8 + proficiency bonus + Charisma modifier) and an arcane focus. The supplied list emphasizes elemental damage, battlefield control, mobility, weapon enhancement, and defense.' },
  { level: 1, name: 'Elemental War Variant: Magic Attunement', description: 'After a 1-hour ritual during a rest, attune to one element. Fire grants fire bolt, control flames, and +2 fire weapon damage (+4 at level 10). Force grants eldritch blast, mage hand, and +1 weapon attack and damage (+2 at level 10). Frost grants frostbite, shape water, +1 AC, and reduces a weapon-hit target’s speed by 5 feet (+2 AC and 10 feet at level 10). Lightning grants shocking grasp, gust, +1 lightning weapon damage, and makes a critical-hit target incapacitated until your next turn (+2 damage and stunned at level 10). At level 6, know two attunements and switch the active one as a bonus action.' },
  { level: 2, name: 'Elemental War Variant: Eldritch Strike', description: 'As a bonus action, spend Mana Points up to your Mana Limit to empower melee weapon attacks for the turn. A successful hit deals an extra 1d6 damage per point spent, to a maximum of 5d6; its type is fire, force, cold, or lightning according to your active attunement.' },
  { level: 2, name: 'Elemental War Variant: Fighting Style', description: 'Choose Archery, Dueling, Great Weapon Fighting, Two-Weapon Fighting, or Spell Combat. Spell Combat lets you use a bonus action after attacking with a light melee weapon held in one hand while the other is free to make a melee spell attack for attunement damage: 1d4, becoming 1d6 at level 5, 1d8 at 11, and 1d10 at 17.' },
  { level: 3, name: 'Elemental War Variant: Life Path', description: 'If using the Elemental War chassis, choose Path of War, Path of Arcane, or Path of the Eldritch Scout. It grants features at levels 3, 7, 11, and 15. This optional Life Path is used in place of, not in addition to, a Valda Warmage House.' },
  { level: 5, name: 'Elemental War Variant: Extra Attack', description: 'Attack twice instead of once whenever you take the Attack action.' },
  { level: 6, name: 'Elemental War Variant: Defensive Attunement', description: 'Your active element grants resistance to its damage type. Fire lets you react after a nearby melee hit, spending Mana for 1d8 fire per point on a failed Dexterity save and a repeating 1d8 burn. Force lets you react to reduce damage by 1d4 + 1 per point. Frost lets you react when hit to gain +2 AC per point, up to +10, until your next turn. Lightning lets you react after a Dexterity save roll and spend 2 Mana for +4 to that save.' },
  { level: 10, name: 'Elemental War Variant: Aura of Attunement', description: 'Conscious allies within 10 feet gain resistance to your active element and its level-1 attunement benefits with weapon and unarmed attacks: Fire +2 fire damage, Force +1 attack and damage, Frost +1 AC and 5-foot speed reduction on hits, or Lightning +1 damage and incapacitation on critical hits. At level 18, the aura becomes 20 feet and uses each attunement’s improved values.' },
  { level: 14, name: 'Elemental War Variant: Dispelling Touch', description: 'As an action, end one spell on yourself or a willing creature you touch. Uses equal your Charisma modifier (minimum one) per long rest.' },
  { level: 18, name: 'Elemental War Variant: Attunement Mastery', description: 'Switch your active known attunement as a reaction, complete the attunement ritual in 1 minute, and improve Aura of Attunement to a 20-foot radius with the enhanced elemental benefits.' },
  { level: 20, name: 'Elemental War Variant: Avatar of War', description: 'As an action, transform for 1 minute, sprouting spectral wings that grant 40-foot flight, gaining resistance to all damage, and gaining the ability to make one melee weapon attack as a bonus action whenever you cast a Warmage spell with a casting time of one action.' },
]

const paths: Record<string, { name: string; description: string; features: FeatureSeed[] }> = {
  'subclass-elemental-path-of-war': { name: 'Elemental Path of War', description: 'Optional Elemental War Life Path. A heavily armored battle-mage who turns elemental attunement into waves of destructive martial force. Path spells: compelled duel, spiritual weapon, elemental weapon, fire shield, and destructive wave.', features: [
    { level: 3, name: 'Heavy Armor Training', description: 'Gain proficiency with heavy armor.' },
    { level: 3, name: 'Wave of Power', description: 'Twice per short or long rest as a bonus action, project a 15-foot cone. Fire deals 2d6 fire on a failed Dexterity save and can ignite for 1d6 each turn until a Constitution save or an action extinguishes it. Frost deals 2d6 cold on a failed Constitution save and imposes disadvantage on the next weapon attack. Lightning deals 2d6 lightning on a failed Dexterity save and removes reactions. Force deals 2d6 force on a failed Constitution save and pushes 10 feet. Successful saves halve damage and avoid the rider. Damage becomes 3d6 at level 11 and 4d6 at 17.' },
    { level: 7, name: 'Overwhelming Presence', description: 'A hostile creature within 10 feet subtracts half your Charisma modifier, rounded up (minimum 1), from saving throws while you are conscious.' },
    { level: 11, name: 'Improved Eldritch Strike', description: 'Every melee weapon hit deals an additional 1d8 damage of your active attunement’s type.' },
    { level: 15, name: 'Blessing of War', description: 'Gain resistance to piercing and slashing damage from nonmagical weapons.' },
  ] },
  'subclass-elemental-path-of-arcane': { name: 'Elemental Path of Arcane', description: 'Optional Elemental War Life Path. A scholar of the artificial arcane bloodline who expands Mana, steals secrets from every tradition, and teleports through battle. Path spells: detect magic, misty step, counterspell, dimension door, and telekinesis.', features: [
    { level: 3, name: 'Magical Secrets', description: 'Learn one cantrip and one spell from any class; the spell must be of a level your Elemental War spellcasting can create. Learn another cantrip and spell this way at levels 9 and 17. They count as Warmage spells without counting against spells known.' },
    { level: 3, name: 'Magical Training', description: 'Increase maximum Mana and Mana recovered at each short rest by 2 at level 3, 4 at level 5, 6 at level 9, 10 at level 13, and 12 at level 19.' },
    { level: 7, name: 'Arcana of the Ancients', description: 'Gain Arcana proficiency, or expertise if already proficient.' },
    { level: 11, name: 'Arcane Strike', description: 'Before each attack made as part of the Attack action, teleport up to 10 feet to a visible destination. If you attack at least two different creatures with the action, make one additional attack against a third creature.' },
    { level: 15, name: 'Knowledge of Forgotten Ages', description: 'Cast a spell from any class that is of a level you can create. After use, make a Charisma save with DC 10 + spell level or the spell fails and its slot is lost; spend additional Mana equal to its level to succeed automatically. Uses equal 1 + Charisma modifier per long rest.' },
  ] },
  'subclass-elemental-path-of-eldritch-scout': { name: 'Elemental Path of the Eldritch Scout', description: 'Optional Elemental War Life Path. An invisible arcane scout and deadly ranged combatant. Path spells: hunter’s mark, invisibility, flame arrows, arcane eye, and swift quiver.', features: [
    { level: 3, name: 'Eldritch Shot', description: 'Use Elemental War Eldritch Strike with ranged weapons.' },
    { level: 3, name: "Archer's Lore", description: 'Gain proficiency in Nature, Perception, Stealth, or Survival, or expertise if already proficient. Gain another such proficiency at level 7.' },
    { level: 3, name: 'Sworn Enemy', description: 'As a bonus action once per short or long rest, vow hostility against a visible creature within 120 feet. Gain advantage on ranged weapon attacks against it for 1 minute or until it drops to 0 hit points or becomes unconscious.' },
    { level: 7, name: 'Windy Steps', description: 'Spend 1 Mana Point to Dash as a bonus action; opportunity attacks against you during that Dash have disadvantage.' },
    { level: 11, name: 'Mystic Shot', description: 'Whenever you hit with a ranged weapon, deal extra force damage equal to your Charisma modifier.' },
    { level: 15, name: 'Eldritch Retreat', description: 'Once per short or long rest when hit by an attack, use your reaction to become invisible and teleport up to 60 feet to a visible space. Invisibility lasts until your next turn ends or until you attack, deal damage, or force a saving throw.' },
  ] },
}

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
function featureDocument(owner: string, seed: FeatureSeed, index: number) {
  const slug = slugify(seed.name)
  const id = `feature-${owner}-${seed.level}-${slug}`
  return { document: { _id: id, _type: 'feature', name: seed.name, slug: { _type: 'slug', current: `${owner}-${seed.level}-${slug}`.slice(0, 96) }, acquiredAtLevel: seed.level, description: seed.description, rulesets: RULESETS, isHomebrew: true, versionNotes: 'Protected optional mechanic adapted from the owner-supplied Elemental War Warmage.' }, reference: ref(id, `${seed.level}-${slug}-${index}`) }
}

async function run() {
  const current = await client.fetch<any>(`*[_id == "class-warmage"][0]{source,sourceBook,isHomebrew,isSpellcaster,spellcaster,spellcastingAbility,hitDie,"subclassIds":subclasses[]._ref,"features":features[]{_key,_ref,"level":@->acquiredAtLevel}}`)
  const canonicalIds = ['subclass-house-of-bishops', 'subclass-house-of-cards', 'subclass-house-of-dice', 'subclass-house-of-kings', 'subclass-house-of-knights', 'subclass-house-of-lancers', 'subclass-house-of-rooks']
  const pathIds = Object.keys(paths)
  const allowedIds = [...canonicalIds, ...pathIds]
  if (!current || current.source !== 'Unofficial' || current.sourceBook !== "Valda's Spire of Secrets" || current.isHomebrew || !current.isSpellcaster || current.spellcaster !== 'special' || current.spellcastingAbility !== 'INT' || current.hitDie !== 8 || canonicalIds.some((id) => !current.subclassIds.includes(id)) || current.subclassIds.some((id: string) => !allowedIds.includes(id))) throw new Error(`Refusing to merge into an unexpected Warmage record: ${JSON.stringify(current)}`)

  let tx = client.transaction()
  const additions = supplements.map((seed, index) => { const built = featureDocument('warmage-elemental-war-variant', seed, index); tx = tx.createOrReplace(built.document as any); return { ...built.reference, level: seed.level } })
  const retained = (current.features as ExistingFeature[]).filter((item) => !item._ref.startsWith('feature-warmage-elemental-war-variant-')).map((item) => ({ _type: 'reference', _key: item._key, _ref: item._ref, level: item.level }))
  const classRefs = [...retained, ...additions].sort((a, b) => a.level - b.level).map(({ level: _level, ...reference }) => reference)
  for (const [subclassId, path] of Object.entries(paths)) {
    const owner = subclassId.replace(/^subclass-/, '')
    const featureRefs = path.features.map((seed, index) => { const built = featureDocument(owner, seed, index); tx = tx.createOrReplace(built.document as any); return built.reference })
    tx = tx.createOrReplace({ _id: subclassId, _type: 'subclass', version: 1, name: path.name, slug: { _type: 'slug', current: owner }, parentClassId: 'warmage', parentClass: ref('class-warmage', 'warmage'), description: path.description, features: featureRefs, source: 'Homebrew', sourceBook: 'Owner-supplied Elemental War Warmage', edition: 'Both', rulesets: RULESETS, isHomebrew: true, isSpellcaster: true, magicType: 'Elemental War Mana Casting', magicAbility: 'Charisma', magicDescription: 'Optional Charisma-based martial spellcasting using Mana Points instead of Valda Warmage cantrip progression.', versionNotes: 'Protected alternate Life Path; does not replace a canonical Valda Warmage House.' } as any)
  }
  tx = tx.patch('class-warmage', (patch) => patch.set({
    features: classRefs, subclasses: allowedIds.map((id) => ref(id, id.replace(/^subclass-/, ''))),
    versionNotes: 'Preserves the canonical Valda Intelligence-based cantrip Warmage and seven Houses. Adds the distinct owner-supplied Charisma/Mana Elemental War chassis and three Life Paths as protected optional homebrew variants.',
  }))

  if (!APPLY) { console.log(`Dry run: retain ${retained.length} canonical features and 7 Houses; add ${supplements.length} protected variant features and ${pathIds.length} alternate Life Paths.`); return }
  const result = await tx.commit({ visibility: 'sync' })
  const audit = await client.fetch<any>(`*[_id == "class-warmage"][0]{sourceBook,isHomebrew,isSpellcaster,spellcaster,spellcastingAbility,"featureCount":count(features),"variantCount":count(features[@->_id match "feature-warmage-elemental-war-variant-*"]),"subclassCount":count(subclasses),"brokenRefs":count(features[!defined(@->._id)])+count(subclasses[!defined(@->._id)]),"paths":*[_id in [${pathIds.map((id) => `"${id}"`).join(',')}]]|order(_id asc){_id,isHomebrew,isSpellcaster,magicAbility,"featureCount":count(features),"brokenRefs":count(features[!defined(@->._id)])}}`)
  if (audit.sourceBook !== "Valda's Spire of Secrets" || audit.isHomebrew || !audit.isSpellcaster || audit.spellcaster !== 'special' || audit.spellcastingAbility !== 'INT' || audit.featureCount !== retained.length + supplements.length || audit.variantCount !== supplements.length || audit.subclassCount !== 10 || audit.brokenRefs || audit.paths.length !== 3 || audit.paths.some((path: any) => !path.isHomebrew || !path.isSpellcaster || path.magicAbility !== 'Charisma' || path.featureCount !== paths[path._id].features.length || path.brokenRefs)) throw new Error(`Warmage additive merge audit failed: ${JSON.stringify(audit)}`)
  console.log(`Applied ${result.results.length} mutations. Verification: ${JSON.stringify(audit)}`)
}

run().catch((error) => { console.error(error); process.exit(1) })
