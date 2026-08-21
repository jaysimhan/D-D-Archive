import { getCliClient } from 'sanity/cli'

// PROVENANCE: structure taken from RPGBOT's "MCDM's Illrigger Class Optimization Guide",
// which is commentary rather than the MCDM rules text. Feature names, levels, subclass
// rosters, Interdict Boon tiers and the seal scaling are stated outright in that guide;
// the descriptions below summarise only what it asserts and must be replaced with the
// official rules text when the MCDM PDF is available.
const client = getCliClient({ apiVersion: '2026-08-21' }).withConfig({ perspective: 'raw' })
const APPLY = process.argv.includes('--apply')
const RULESETS = [
  { _type: 'reference', _key: 'srd-2014', _ref: 'ruleset.srd-2014' },
  { _type: 'reference', _key: 'srd-2024', _ref: '86642d23-c52d-4577-adc1-214aab0f43e9' },
]
const ref = (id: string, key = id) => ({ _type: 'reference', _key: key, _ref: id })
const NOTE = 'Structure from RPGBOT’s Illrigger optimization guide; description summarises that guide’s commentary and awaits the official MCDM rules text.'
type FeatureSeed = { level: number; name: string; description: string }

const BOONS_2 = 'Abating Seal, Bedevil, Soul Eater, Styx’s Apathy, and Swift Retribution'
const BOONS_7 = 'Acheron’s Chain, Conflagrant Channel, Eyes of the Gate, Shadow Shroud, Unleash Hell, and Vengeful Shot'
const BOONS_13 = 'Dis’s Onslaught, Flash of Brimstone, Hellish Frenzy, Hellsight, Impaling Shot, Iron Gaol, Last Word, and Soul’s Doom'

const coreFeatures: FeatureSeed[] = [
  { level: 1, name: 'Baleful Interdict', description: 'You gain a pool of seals, the resource at the centre of the Illrigger’s features. You have 3 seals per rest at 1st level, rising to a maximum of 7 per rest by 18th level. You place a seal on a creature within 30 feet as a bonus action, and can place only one seal on a given creature per turn. Burning a seal deals extra damage: 1d6 per seal, increasing to 2d6 at 5th level, 3d6 at 11th level, and 4d6 at 20th level. Because a burned seal deals damage separately from the triggering effect, that damage is not multiplied on a critical hit, but it does force its own Concentration saving throw. Saving throws against your seal effects use a Charisma-based Interdict save DC.' },
  { level: 1, name: 'Forked Tongue', description: 'You gain Infernal along with additional spoken languages, but this feature does not grant the ability to read or write the languages it gives you. You can change the languages gained from this feature, other than Infernal, keeping them relevant to the creatures you expect to face. The feature improves at 9th level.' },
  { level: 2, name: 'Combat Mastery', description: 'You choose a combat specialty, functioning much like a Fighting Style. The options are Bravado (supports stealth), Brutal (forcibly moves enemies around the battlefield, stacking with effects like Crusher), Inexorable (rewards aggressive melee against grouped enemies), Lies (lets you attack using Charisma, comparable to Shillelagh), Lissome (supports hit-and-run attacks), and Unfettered (supports ranged attacks).' },
  { level: 2, name: 'Interdiction', description: `You gain Interdict Boons, which work much like the Warlock’s Eldritch Invocations, letting you pick class features that suit your play style. You gain boons at 2nd, 7th, 13th, and 18th level, for four in total, and can retrain one boon each time you gain a level. Level 2 boons are ${BOONS_2}. Level 7 boons are ${BOONS_7}. Level 13 boons are ${BOONS_13}. Your Diabolic Contract grants further boons of its own at 7th, 13th, and 18th level.` },
  { level: 3, name: 'Diabolic Contract', description: 'You swear an oath of service to a major devil, choosing one of five Diabolic Contracts: Architect of Ruin (Asmodeus), Hellspeaker (Moloch), Painkiller (Dispater), Sanguine Knight (Sutekh), or Shadowmaster (Belial). Your contract grants features at 3rd, 7th, 11th, and 15th level, and grants its own Interdict Boons at 7th, 13th, and 18th level.' },
  { level: 3, name: 'Invoke Hell', description: 'You can call directly on your patron for a potent effect, recovering uses on a rest much as Channel Divinity does. The available effects are determined entirely by your Diabolic Contract, which grants two options to choose between.' },
  { level: 4, name: 'Ability Score Improvement', description: 'You can increase one ability score of your choice by 2, or two ability scores of your choice by 1, to a maximum of 20.' },
  { level: 5, name: 'Extra Attack', description: 'You can attack twice, instead of once, whenever you take the Attack action on your turn. Your seal damage also increases to 2d6 at this level.' },
  { level: 6, name: 'Infernal Conduit', description: 'You gain a pool of dice that channel life force, spent on one of two effects. Invigorate donates your own hit points to heal an ally, which pairs well with temporary hit points from sources such as the Soul Eater Interdict Boon. Devour drains hit points from an enemy on a failed Constitution saving throw, comparable in concept to vampiric touch. The dice scale slowly as you gain levels.' },
  { level: 7, name: 'Diabolic Contract Feature (7th Level)', description: 'You gain the 7th-level feature of your Diabolic Contract, which is the contract’s Interdiction feature and unlocks that contract’s own Interdict Boons.' },
  { level: 7, name: 'Interdict Boon (7th Level)', description: `You gain another Interdict Boon, and can now select from the level 7 boons: ${BOONS_7}.` },
  { level: 8, name: 'Ability Score Improvement (8th Level)', description: 'You can increase one ability score of your choice by 2, or two ability scores of your choice by 1, to a maximum of 20.' },
  { level: 9, name: 'Forked Tongue Improvement', description: 'Forked Tongue improves, granting a third spoken language.' },
  { level: 10, name: 'Blood Price', description: 'You can pay for success with your own vitality, expending a Hit Die to add 1d10 to a saving throw. The bonus does not include your Constitution modifier. Because this competes with spending Hit Dice on a short rest, it rewards finding other sources of healing.' },
  { level: 11, name: 'Terrorizing Force', description: 'Your attacks carry infernal dread, boosting your damage output. You choose a damage type from a listed set, of which necrotic is the least commonly resisted. Your seal damage also increases to 3d6 at this level.' },
  { level: 11, name: 'Diabolic Contract Feature (11th Level)', description: 'You gain the 11th-level feature of your Diabolic Contract.' },
  { level: 12, name: 'Ability Score Improvement (12th Level)', description: 'You can increase one ability score of your choice by 2, or two ability scores of your choice by 1, to a maximum of 20.' },
  { level: 13, name: 'Interdict Boon (13th Level)', description: `You gain another Interdict Boon, and can now select from the level 13 boons: ${BOONS_13}.` },
  { level: 14, name: 'Superior Interdict', description: 'Damage from burning your seals ignores damage resistances, and you gain one additional seal per day.' },
  { level: 15, name: 'Diabolic Contract Feature (15th Level)', description: 'You gain the 15th-level feature of your Diabolic Contract.' },
  { level: 16, name: 'Ability Score Improvement (16th Level)', description: 'You can increase one ability score of your choice by 2, or two ability scores of your choice by 1, to a maximum of 20.' },
  { level: 17, name: 'Infernal Majesty', description: 'Once per day you assume a terrible infernal form for the duration of a combat, gaining flight, resistance to damage, and additional damage output. Because activating it competes with placing a seal, it is best used before combat begins.' },
  { level: 18, name: 'Interdict Boon (18th Level)', description: 'You gain your fourth and final Interdict Boon, selected from any tier you qualify for. Your seal pool also reaches its maximum of 7 seals per rest at this level.' },
  { level: 19, name: 'Ability Score Improvement (19th Level)', description: 'You can increase one ability score of your choice by 2, or two ability scores of your choice by 1, to a maximum of 20. Under the 2024 rules this is commonly replaced with an Epic Boon.' },
  { level: 20, name: 'Master of Hell', description: 'Once per day you unleash a devastating area effect at long range with a very large radius, choosing one of three forms. Inferno deals fire damage plus ongoing damage that forces repeated Concentration saves. Pestilence targets Constitution saves and can leave targets poisoned. Darkness deals cold damage and blinds those caught in it, with the blindness applying regardless of the saving throw against the cold damage. Your seal damage also increases to 4d6 at this level.' },
]

const progressionRows: Array<[number, number, string[]]> = [
  [1, 2, ['Baleful Interdict', 'Forked Tongue']],
  [2, 2, ['Combat Mastery', 'Interdiction']],
  [3, 2, ['Diabolic Contract', 'Invoke Hell']],
  [4, 2, ['Ability Score Improvement']],
  [5, 3, ['Extra Attack']],
  [6, 3, ['Infernal Conduit']],
  [7, 3, ['Diabolic Contract feature', 'Interdict Boon']],
  [8, 3, ['Ability Score Improvement']],
  [9, 4, ['Forked Tongue Improvement']],
  [10, 4, ['Blood Price']],
  [11, 4, ['Terrorizing Force', 'Diabolic Contract feature']],
  [12, 4, ['Ability Score Improvement']],
  [13, 5, ['Interdict Boon']],
  [14, 5, ['Superior Interdict']],
  [15, 5, ['Diabolic Contract feature']],
  [16, 5, ['Ability Score Improvement']],
  [17, 6, ['Infernal Majesty']],
  [18, 6, ['Interdict Boon']],
  [19, 6, ['Ability Score Improvement']],
  [20, 6, ['Master of Hell']],
]
const SEAL_DAMAGE = (level: number) => (level >= 20 ? '4d6' : level >= 11 ? '3d6' : level >= 5 ? '2d6' : '1d6')
const progression = progressionRows.map(([level, proficiencyBonus, featureNames]) => ({
  _type: 'classProgressionRow', _key: `illrigger-level-${level}`, level, proficiencyBonus,
  resources: [{ _type: 'object', _key: 'seal-damage', name: 'Seal Damage', value: SEAL_DAMAGE(level) }],
  featureNames,
}))

type Contract = { name: string; slug: string; description: string; isSpellcaster?: boolean; features: FeatureSeed[] }
const contracts: Record<string, Contract> = {
  'subclass-architect-of-ruin-asmodeus': { name: 'Architect of Ruin (Asmodeus)', slug: 'architect-of-ruin-asmodeus', isSpellcaster: true, description: 'Illriggers sworn to Asmodeus, who graft spellcasting onto a martial chassis much as an Eldritch Knight does, and who benefit enormously from building around Charisma.', features: [
    { level: 3, name: "Asmodeus's Blessing", description: 'You gain an additional skill proficiency and an improvement to Forked Tongue. The skills this grants are Intelligence-based.' },
    { level: 3, name: 'Spellcasting', description: 'You gain third-caster spellcasting using Charisma, on the same progression as the Eldritch Knight. The Illrigger spell list sits between the Eldritch Knight and the Paladin, focusing on combat options with a few utilities, and includes contract-specific cantrips such as hellfire and vengeful blade. The list is closed and is not expanded by later official supplements.' },
    { level: 3, name: 'Invoke Hell: Architect of Ruin', description: 'Choose Enervating Spell, which imposes weakness to your spell’s damage and thereby ignores existing resistances and immunities, or Spellblade, which grants the Eldritch Knight’s War Magic once per rest and works with your leveled spells as well as cantrips.' },
    { level: 7, name: 'Hellish Versatility', description: 'You can substitute an Illrigger cantrip for a weapon attack, which often out-damages a single attack as cantrip damage scales. Charisma-based builds favour fire bolt or hellfire for reliable damage and ray of frost for control, while Strength- or Dexterity-based builds favour vengeful blade, which does not rely on your spellcasting ability. The cantrip must be an Illrigger cantrip, so it cannot come from Magic Initiate.' },
    { level: 7, name: "Asmodeus's Interdiction", description: 'You unlock this contract’s own Interdict Boons: Axiomatic Seals at 7th level, which substantially increases the damage from burning seals and rewards a Charisma-based build; Spellbreaker at 13th level, which counters enemy spellcasters at low resource cost and can have its Counterspell level raised by spending additional seals; and Hell Mage at 18th level, which lets you apply six seals at once instead of the usual one per turn, so they can all be burned on a following turn.' },
    { level: 11, name: 'Submit', description: 'You impose disadvantage on a saving throw made against one of your spells. The wording specifies a single saving throw, so it is generally read as applying to the first save against the spell rather than to repeated saves from effects like hold person.' },
    { level: 15, name: 'Vile Transmogrification', description: 'You can convert resources between seals and spell slots in either direction. Trading spell slots for seals is considerably more efficient. Because you can never hold more than 7 seals, this cannot be used to recover spell slots above 2nd level, and you cannot gain a seal beyond your capacity.' },
  ] },
  'subclass-hellspeaker-moloch': { name: 'Hellspeaker (Moloch)', slug: 'hellspeaker-moloch', description: 'Illriggers sworn to Moloch, focused almost entirely on social manipulation and the charmed condition, making them formidable faces and controllers.', features: [
    { level: 3, name: "Moloch's Blessing", description: 'You gain proficiency or expertise in either Persuasion or Deception. You also gain advantage on Charisma checks made while speaking one of the languages granted by Forked Tongue, which rewards speaking in anything other than Common and keeping those languages relevant to the creatures you face.' },
    { level: 3, name: 'Charm Enemy', description: 'You can charm a creature by placing a seal on it as a bonus action, which carries no audible or visible indicator and so can be used mid-conversation; the target resists with a Charisma saving throw, which many creatures are poor at even at high level. If the conversation goes badly you enter combat with the target already interdicted. The second half of the feature charms multiple creatures at once after you damage them by burning seals, using the same Charisma save, and those creatures do not gain the usual advantage on the save for being in combat.' },
    { level: 3, name: 'Invoke Hell: Hellspeaker', description: 'Choose Honey-Sweet Blades, which grants one guaranteed critical hit per short rest, noting that seal damage is not multiplied on a critical hit; or Turncoat, which turns an enemy against its allies, forcing enemies to damage each other and consuming their reactions.' },
    { level: 7, name: "Moloch's Interdiction", description: 'You unlock this contract’s own Interdict Boons: Red Cant at 7th level, insurance in social situations against creatures you have not charmed; Slippery Ploy at 13th level, a strong defense that redirects attacks toward your allies; and Incontrovertible at 18th level, which makes Charm Enemy and Slippery Ploy highly reliable.' },
    { level: 11, name: 'Intransigent', description: 'You gain protection against effects that charm you and the additional conditions such effects often apply while a target is charmed.' },
    { level: 11, name: "Let's Make a Deal", description: 'You strike a bargain with a creature, making the roll with advantage and adding your proficiency bonus, so success is very likely. On a success the target also gains temporary hit points.' },
    { level: 15, name: 'Quid Pro Quo', description: 'Once per day you banish an enemy and summon a horned devil (challenge rating 11) in the exchange.' },
  ] },
  'subclass-painkiller-dispater': { name: 'Painkiller (Dispater)', slug: 'painkiller-dispater', description: 'Illriggers sworn to Dispater, the Iron Duke: the simplest contract, a heavily armored shock trooper that commands allies to strike and punishes those who strike back.', features: [
    { level: 3, name: "Dispater's Blessing", description: 'You gain proficiency with heavy armor, which lets you build effectively around Strength without sacrificing Armor Class.' },
    { level: 3, name: 'Devastator', description: 'Once per rest you command your allies to attack. Provided at least two allies who make effective weapon attacks are affected, this is almost always more impactful than attacking alone, and it is particularly strong alongside a Rogue.' },
    { level: 3, name: 'Invoke Hell: Painkiller', description: 'Choose Grand Strategist, which grants your allies free movement at no action cost to anyone, for repositioning out of danger or into better attack positions; or Punishment, a retaliation usable against any kind of attack, best saved for when you suffer a critical hit.' },
    { level: 7, name: "Dispater's Interdiction", description: 'You unlock this contract’s own Interdict Boons: Telekinetic Seal at 7th level, which knocks a foe prone or pushes it, on a Wisdom save; By The Throat at 13th level, which restrains the target until the end of its turn, imposing disadvantage on its attacks, reducing its speed to 0, and granting advantage on attacks against it; and Dispater’s Supremacy at 18th level, which widens your critical hit range.' },
    { level: 11, name: 'You Die on My Command!', description: 'Once per rest you can save a dying ally, a strong protection for the whole party.' },
    { level: 15, name: 'Deathstrike', description: 'You score guaranteed critical hits a limited number of times per long rest, scaling with your proficiency bonus (five uses at 15th level and six at 17th). Combined with seals accumulated on the target, burning them for double damage is a substantial spike.' },
  ] },
  'subclass-sanguine-knight-sutekh': { name: 'Sanguine Knight (Sutekh)', slug: 'sanguine-knight-sutekh', description: 'Illriggers sworn to Sutekh, who take vitality from their enemies and give it to their allies, adding healing and condition removal to the class’s strengths.', features: [
    { level: 3, name: 'Exsanguinate', description: 'You drain an enemy to grant temporary hit points to your allies. The temporary hit points have no listed expiration, so they persist until a long rest, and the feature does not appear to let you grant them to yourself.' },
    { level: 3, name: "Sutekh's Blessing", description: 'You gain an additional skill proficiency. The skills this grants are Intelligence-based.' },
    { level: 3, name: 'Invoke Hell: Sanguine Knight', description: 'Choose Embolden Allies, which heals a large amount as a bonus action — comparable to a Paladin’s entire Lay on Hands pool, but far faster to deliver; or Vitalize, a substantial buff for your whole party lasting 1 minute.' },
    { level: 7, name: "Sutekh's Interdiction", description: 'You unlock this contract’s own Interdict Boons: Foul Interchange at 7th level, which works like lesser restoration and can additionally shunt the condition onto another creature; Sanguine Fist at 13th level, a highly efficient source of healing; and Blood for Blood at 18th level, which rewards placing a seal on every enemy you meet.' },
    { level: 11, name: 'Bloodstroke', description: 'You deal a large amount of damage that scales well, and which is strongest when your allies are carrying temporary hit points, so it rewards refreshing those regularly.' },
    { level: 15, name: 'Haemal Exchange', description: 'As a reaction, you impose a d8 penalty on a creature and grant a matching d8 to an ally. The granted die has no listed expiration and the feature does not say the dice cannot stack, so a 10-minute limit and a one-die-per-creature cap are commonly recommended. The source prints this name inconsistently, also spelling it "Haemel Exchange".' },
  ] },
  'subclass-shadowmaster-moloch': { name: 'Shadowmaster (Belial)', slug: 'shadowmaster-belial', description: 'Illriggers sworn to Belial, the contract closest to the Rogue: infiltration, darkness, and enormous damage from a single strike. The only contract that does not depend on Charisma.', features: [
    { level: 3, name: 'Marked for Death', description: 'You spend a seal to gain advantage on your first attack each turn, which is reliable enough to apply almost every turn. Because it is once per turn rather than once on each of your turns, it also works with opportunity attacks.' },
    { level: 3, name: 'Strike from the Dark', description: 'You deal extra damage once per turn, on mechanics very similar to Sneak Attack, and so it likewise works with opportunity attacks. The damage scales with your proficiency bonus, and the dice become d8s at 15th level.' },
    { level: 3, name: 'Invoke Hell: Shadowmaster', description: 'Choose Master of Disguise, a situational but strongly thematic disguise effect; or No Escape, which locks a creature into melee with you within 30 feet. No Escape has no listed expiration, so it persists so long as you do not move more than 30 feet away.' },
    { level: 7, name: "Belial's Interdiction", description: 'You unlock this contract’s own Interdict Boons: Veil of Lies at 7th level, effectively invisibility as a bonus action; Hell’s Assassin at 13th level, which rerolls damage dice from your weapon attacks, including extra damage such as Strike from the Dark or Sneak Attack; and Dark Malediction at 18th level, a magical darkness that suppresses mundane light but which darkvision sees through, granting another die of Strike from the Dark damage and imposing disadvantage on saves against No Escape. It is suppressed by any magical or psionic light, including a cantrip.' },
    { level: 11, name: 'Umbral Killer', description: 'You gain an assortment of benefits suited to a stealthy character which, while not individually decisive, are consistently useful.' },
    { level: 15, name: 'Doomed to the Shadows', description: 'Your Strike from the Dark dice become d8s, and burning a seal on a marked creature can blind it for 1 minute with no saving throw. Because this combines with Marked for Death and Strike from the Dark in a single round, adding a Charisma saving throw against your Interdict DC and repeated saves at the end of the target’s turns is commonly recommended.' },
  ] },
}

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
function featureDocument(owner: string, seed: FeatureSeed, index: number) {
  const id = `feature-${owner}-${seed.level}-${slugify(seed.name)}`
  return { id, document: {
    _id: id, _type: 'feature', name: seed.name,
    slug: { _type: 'slug', current: `${owner}-${seed.level}-${slugify(seed.name)}`.slice(0, 96) },
    acquiredAtLevel: seed.level, description: seed.description, rulesets: RULESETS, isHomebrew: false,
    versionNotes: NOTE,
  }, reference: ref(id, `${seed.level}-${slugify(seed.name)}-${index}`) }
}

const CONTRACT_IDS = Object.keys(contracts)
const NEW_CONTRACT_IDS = ['subclass-hellspeaker-moloch', 'subclass-sanguine-knight-sutekh']

async function run() {
  const current = await client.fetch<any>(`*[_id == "class-illrigger"][0]{source, sourceBook, isHomebrew, "subclassIds": subclasses[]._ref}`)
  if (!current || current.source !== 'Unofficial' || current.sourceBook !== 'MCDM Productions' || current.isHomebrew) {
    throw new Error(`Refusing to merge into an unexpected Illrigger record: ${JSON.stringify(current)}`)
  }
  const unexpected = (current.subclassIds ?? []).filter((id: string) => !CONTRACT_IDS.includes(id))
  if (unexpected.length) throw new Error(`Illrigger has unexpected subclasses: ${unexpected.join(', ')}`)

  const priorRefs: string[] = await client.fetch(
    `array::unique(coalesce(*[_id == "class-illrigger"][0].features[]._ref, []) + coalesce(*[_id in $ids].features[]._ref, []))`,
    { ids: CONTRACT_IDS },
  )
  const ownedIds: string[] = await client.fetch(`*[_type == "feature" && _id match "*illrigger*"]._id`)
  const candidates = new Set<string>([
    ...(priorRefs ?? []),
    ...(ownedIds ?? []).filter((id) => id.startsWith('feature-illrigger-') || id.startsWith('feature-class-illrigger-')),
  ])

  let tx = client.transaction()
  const newIds = new Set<string>()

  const classRefs = coreFeatures.map((seed, index) => {
    const result = featureDocument('illrigger', seed, index)
    newIds.add(result.id)
    tx = tx.createOrReplace(result.document as any)
    return result.reference
  })

  for (const [subclassId, contract] of Object.entries(contracts)) {
    const owner = contract.slug
    const featureRefs = contract.features.map((seed, index) => {
      const result = featureDocument(owner, seed, index)
      newIds.add(result.id)
      tx = tx.createOrReplace(result.document as any)
      return result.reference
    })
    const document: Record<string, unknown> = {
      name: contract.name, slug: { _type: 'slug', current: contract.slug },
      parentClassId: 'illrigger', parentClass: ref('class-illrigger', 'illrigger'),
      description: contract.description, features: featureRefs,
      source: 'Unofficial', sourceBook: 'MCDM Productions', edition: 'Both',
      rulesets: RULESETS, isHomebrew: false, isSpellcaster: contract.isSpellcaster ?? false,
      versionNotes: NOTE,
    }
    if (contract.isSpellcaster) {
      document.magicType = 'Third-caster spell progression'
      document.magicAbility = 'Charisma'
      document.magicDescription = 'Charisma-based spellcasting layered onto the Illrigger martial chassis.'
    }
    tx = NEW_CONTRACT_IDS.includes(subclassId)
      ? tx.createOrReplace({ _id: subclassId, _type: 'subclass', version: 1, ...document } as any)
      : tx.patch(subclassId, (patch) => patch.set(document).unset(['spellcaster', 'spellcastingAbility']))
  }

  // Only the Architect of Ruin casts, so the base class is not a spellcaster. The dataset
  // holds no character documents, so this changes no saved characters.
  tx = tx.patch('class-illrigger', (patch) => patch.set({
    isSpellcaster: false,
    description: 'Illriggers are knights of Hell: martial champions who trade an oath of service to a major devil for infernal power. They mark enemies with seals and burn them for sudden, brutal bursts of damage, shaping their role through Interdict Boons and the Diabolic Contract they sign.',
    hitDie: 10, primaryAbility: ['DEX', 'CHA'], savingThrows: ['CON', 'CHA'],
    proficiencies: [
      { _type: 'proficiencyRule', _key: 'illrigger-armor', type: 'armor', mode: 'fixed', armorOptions: ['Light Armor', 'Medium Armor', 'Shields'], description: 'Light armor, medium armor, and shields; the Painkiller adds heavy armor' },
      { _type: 'proficiencyRule', _key: 'illrigger-weapons', type: 'weapon', mode: 'fixed', weaponOptions: ['Martial Weapons'] },
      { _type: 'proficiencyRule', _key: 'illrigger-skills', type: 'skill', mode: 'choice', count: 2, skillOptions: ['Arcana', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Persuasion', 'Religion', 'Stealth'] },
    ],
    features: classRefs, progression, subclassLevel: 3,
    subclasses: Object.entries(contracts).map(([id, contract]) => ref(id, contract.slug)),
    source: 'Unofficial', sourceBook: 'MCDM Productions', edition: 'Both', rulesets: RULESETS, isHomebrew: false,
    versionNotes: 'Base class marked non-spellcasting (only the Architect of Ruin casts). Structure rebuilt from RPGBOT’s Illrigger optimization guide: corrected feature levels (Baleful Interdict to 1st, Infernal Conduit to 6th), all 20 levels of class features, the Interdict Boon tiers, and all five Diabolic Contracts (Hellspeaker and Sanguine Knight added; Shadowmaster re-attributed from Moloch to Belial). Feature descriptions summarise that guide’s commentary and MUST be replaced with the official MCDM rules text. Starting equipment, seals-per-rest by level, the Interdict save DC formula, and the Architect of Ruin spell list are still outstanding.',
  }).unset(['spellcaster', 'spellcastingAbility', 'spellLists', 'spells']))

  const stale = [...candidates].filter((id) => !newIds.has(id)).sort()
  for (const id of stale) tx = tx.delete(id)

  const contractFeatureCount = Object.values(contracts).reduce((sum, c) => sum + c.features.length, 0)
  if (!APPLY) {
    console.log(`Dry run: ${coreFeatures.length} class features, ${contractFeatureCount} contract features across ${CONTRACT_IDS.length} contracts, ${progression.length} progression rows.`)
    console.log(`Would create: ${NEW_CONTRACT_IDS.join(', ')}`)
    console.log(`Would delete ${stale.length} superseded feature docs: ${stale.join(', ') || '(none)'}`)
    return
  }

  const result = await tx.commit({ visibility: 'sync' })
  const audit = await client.fetch<any>(`*[_id == "class-illrigger"][0]{
    sourceBook, isHomebrew, hitDie, savingThrows, primaryAbility,
    isSpellcaster, spellcaster, spellcastingAbility,
    "featureCount": count(features), "progressionCount": count(progression),
    "levels": progression[].level, "sealDamage": progression[].resources[name == "Seal Damage"][0].value,
    "brokenRefs": count(features[!defined(@->._id)]) + count(subclasses[!defined(@->._id)]),
    "contracts": *[_id in $ids] | order(_id asc) {_id, name, sourceBook, isHomebrew, isSpellcaster, magicType, magicAbility, spellcaster, spellcastingAbility, "featureCount": count(features), "brokenRefs": count(features[!defined(@->._id)])}
  }`, { ids: CONTRACT_IDS })

  const problems: string[] = []
  if (audit.sourceBook !== 'MCDM Productions' || audit.isHomebrew) problems.push('source/flags')
  if (audit.isSpellcaster !== false || audit.spellcaster != null || audit.spellcastingAbility != null) problems.push('class spellcasting not cleared')
  if (audit.hitDie !== 10 || audit.savingThrows?.join(',') !== 'CON,CHA') problems.push('hitDie/saves')
  if (audit.featureCount !== coreFeatures.length) problems.push(`featureCount=${audit.featureCount}`)
  if (audit.progressionCount !== 20 || audit.levels?.join(',') !== progressionRows.map((r) => r[0]).join(',')) problems.push('progression')
  if (audit.sealDamage?.join(',') !== progressionRows.map((r) => SEAL_DAMAGE(r[0])).join(',')) problems.push('sealDamage')
  if (audit.brokenRefs) problems.push(`brokenRefs=${audit.brokenRefs}`)
  if (audit.contracts?.length !== CONTRACT_IDS.length) problems.push(`contractCount=${audit.contracts?.length}`)
  for (const c of audit.contracts ?? []) {
    const expected = contracts[c._id]
    if (!expected) { problems.push(`unknown contract ${c._id}`); continue }
    if (c.featureCount !== expected.features.length) problems.push(`${c._id} features=${c.featureCount}`)
    if (c.brokenRefs) problems.push(`${c._id} brokenRefs`)
    if (c.name !== expected.name) problems.push(`${c._id} name=${c.name}`)
    if (c.spellcaster != null || c.spellcastingAbility != null) problems.push(`${c._id} off-schema spellcaster fields`)
    if (expected.isSpellcaster && (!c.isSpellcaster || c.magicType !== 'Third-caster spell progression' || c.magicAbility !== 'Charisma')) problems.push(`${c._id} magic fields`)
  }
  if (problems.length) throw new Error(`Illrigger audit failed: ${problems.join('; ')} :: ${JSON.stringify(audit)}`)
  console.log(`Applied ${result.results.length} mutations (deleted ${stale.length} superseded features). Verification OK.`)
  console.log(JSON.stringify((audit.contracts ?? []).map((c: any) => `${c.name}=${c.featureCount}`)))
}

run().catch((error) => { console.error(error); process.exit(1) })
