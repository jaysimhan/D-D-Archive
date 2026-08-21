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
  [1, 2, '1d6', '—', ['Fisticuffs', 'Iron Chin']],
  [2, 2, '1d6', '2', ['Moxie', 'Street Smart']],
  [3, 2, '1d6', '2', ['Bloodied but Unbowed', 'Fight Club']],
  [4, 2, '1d6', '3', ['Ability Score Improvement', 'Dig Deep']],
  [5, 3, '1d8', '3', ['Extra Attack', 'Haymaker']],
  [6, 3, '1d8', '4', ['Fight Club feature', 'Moxie-Fueled Fists']],
  [7, 3, '1d8', '4', ['Fancy Footwork', 'Shake It Off']],
  [8, 3, '1d8', '5', ['Ability Score Improvement']],
  [9, 4, '1d8', '5', ['Down but Not Out']],
  [10, 4, '1d8', '6', ['School of Hard Knocks']],
  [11, 4, '1d10', '6', ['Fight Club feature']],
  [12, 4, '1d10', '7', ['Ability Score Improvement']],
  [13, 5, '1d10', '7', ['Rabble Rouser']],
  [14, 5, '1d10', '8', ['Unbreakable']],
  [15, 5, '1d10', '8', ['Herculean']],
  [16, 5, '1d10', '9', ['Ability Score Improvement']],
  [17, 6, '1d12', '9', ['Fight Club feature']],
  [18, 6, '1d12', '10', ['Fighting Spirit']],
  [19, 6, '1d12', '10', ['Ability Score Improvement']],
  [20, 6, '1d12', '12', ['Peak Physical Condition']],
]
const progression = progressionRows.map(([level, proficiencyBonus, fisticuffs, moxie, featureNames]) => ({
  _type: 'classProgressionRow', _key: `pugilist-level-${level}`, level, proficiencyBonus,
  resources: [
    { _type: 'object', _key: 'fisticuffs', name: 'Fisticuffs', value: fisticuffs },
    { _type: 'object', _key: 'moxie-points', name: 'Moxie Points', value: moxie },
  ], featureNames,
}))

const coreFeatures: FeatureSeed[] = [
  { level: 1, name: 'Fisticuffs', description: 'Pugilist weapons are simple melee weapons without the Two-Handed property, whips, and improvised weapons; you cannot use their Finesse property. While unarmed or using only pugilist weapons, wearing light or no armor, and not using a shield, use the Fisticuffs die in place of an unarmed strike or pugilist weapon’s normal damage. After taking the Attack action with one, you may make one unarmed strike or grapple as a bonus action.' },
  { level: 1, name: 'Iron Chin', description: 'While wearing light or no armor and not wielding a shield, your Armor Class equals 12 + your Constitution modifier.' },
  { level: 2, name: 'Moxie', description: 'You have the Moxie Points shown in the Pugilist table and regain all expended points after a short or long rest. Brace Up: spend 1 as a bonus action and gain temporary hit points equal to your Fisticuffs die + Pugilist level + Constitution modifier. The Old One-Two: after the Attack action, spend 1 to make two unarmed strikes as a bonus action. Stick and Move: spend 1 as a bonus action to shove or Dash.' },
  { level: 2, name: 'Street Smart', description: 'Carousing, shadowboxing, and sparring count as light activity while resting. After carousing in a settlement for at least 8 hours, you know its public locations and cannot become lost there by nonmagical means.' },
  { level: 3, name: 'Bloodied But Unbowed', description: 'When damage reduces you to half your hit point maximum or lower, use your reaction to gain temporary hit points equal to your Pugilist level + Constitution modifier and regain all expended Moxie Points. Recharge after a short or long rest.' },
  { level: 3, name: 'Fight Club', description: 'Choose Arena Royale, Bloodhound Bruisers, Dog & Hound, Hand of Dread, Piss & Vinegar, the Squared Circle, or the Sweet Science. Your Fight Club grants features at levels 3, 6, 11, and 17.' },
  { level: 4, name: 'Ability Score Improvement', description: 'Increase one ability score by 2 or two ability scores by 1, to a maximum of 20. You gain this feature again at Pugilist levels 8, 12, 16, and 19.' },
  { level: 4, name: 'Dig Deep', description: 'As a bonus action, gain resistance to bludgeoning, piercing, and slashing damage for 1 minute. At the end of that minute, gain one level of exhaustion.' },
  { level: 5, name: 'Extra Attack', description: 'Attack twice instead of once whenever you take the Attack action.' },
  { level: 5, name: 'Haymaker', description: 'Before making an attack that does not already have disadvantage, declare haymakers. All your weapon attacks have disadvantage until the end of the turn, but an unarmed strike or pugilist weapon deals the maximum result of its damage die instead of rolling it.' },
  { level: 6, name: 'Moxie-Fueled Fists', description: 'Your unarmed strikes count as magical for overcoming resistance and immunity to nonmagical attacks and damage.' },
  { level: 7, name: 'Fancy Footwork', description: 'Gain proficiency in Dexterity saving throws.' },
  { level: 7, name: 'Shake It Off', description: 'Use your action to end one effect on yourself that is causing you to be charmed or frightened.' },
  { level: 8, name: 'Ability Score Improvement (8th Level)', description: 'Increase one ability score by 2 or two ability scores by 1, to a maximum of 20.' },
  { level: 9, name: 'Down But Not Out', description: 'When you use Bloodied But Unbowed, you may also add your proficiency bonus to damage with unarmed strikes and pugilist weapons for 1 minute. Recharge after a long rest.' },
  { level: 10, name: 'School of Hard Knocks', description: 'Gain resistance to psychic damage and advantage on saving throws against effects that would make you stunned or unconscious.' },
  { level: 12, name: 'Ability Score Improvement (12th Level)', description: 'Increase one ability score by 2 or two ability scores by 1, to a maximum of 20.' },
  { level: 13, name: 'Rabble Rouser', description: 'After taking a long rest by carousing in a settlement, you have advantage on Charisma (Persuasion) and Charisma (Intimidation) checks against its residents.' },
  { level: 14, name: 'Unbreakable', description: 'You have advantage on Strength, Dexterity, and Constitution saving throws. When you fail any saving throw, you may spend 1 Moxie Point to reroll it and must use the second result.' },
  { level: 15, name: 'Herculean', description: 'Double your carrying capacity and damage to inanimate objects with melee weapons and unarmed strikes. Your standing jump distance equals your running-start jump distance.' },
  { level: 16, name: 'Ability Score Improvement (16th Level)', description: 'Increase one ability score by 2 or two ability scores by 1, to a maximum of 20.' },
  { level: 18, name: 'Fighting Spirit', description: 'When you have four or fewer exhaustion levels and are reduced to 0 hit points, regain half your hit point maximum and half your maximum Moxie Points, then gain one exhaustion level. Recharge after a long rest.' },
  { level: 19, name: 'Ability Score Improvement (19th Level)', description: 'Increase one ability score by 2 or two ability scores by 1, to a maximum of 20.' },
  { level: 20, name: 'Peak Physical Condition', description: 'Your Strength and Constitution scores each increase by 2, to a maximum of 22. A long rest removes two exhaustion levels and restores all expended Hit Dice.' },
]

const clubs: Record<string, { name: string; description: string; features: FeatureSeed[] }> = {
  'subclass-arena-royale': { name: 'Arena Royale', description: 'A traveling gladiator and performer who turns theatrical bravado, a masked persona, and crowd work into fighting power.', features: [
    { level: 3, name: 'Bonus Proficiency', description: 'Gain proficiency in Performance. If already proficient, gain proficiency in Intimidation or Persuasion instead.' },
    { level: 3, name: 'Persona Libre', description: 'Create an alternate persona you can adopt or discard as a bonus action. It has persona points equal to 3 + Charisma modifier (minimum 1), restored after a long rest. While adopted, spend persona points in place of Moxie Points, or spend one before a Charisma check to add your Strength modifier.' },
    { level: 6, name: 'Work the Crowd', description: 'As an action while in your persona, creatures within 30 feet that can see you make a Wisdom save (DC 8 + proficiency bonus + Strength modifier) or become charmed or frightened, your choice, for 1 minute. Affected creatures repeat the save after taking damage. Recharge after a long rest.' },
    { level: 11, name: 'High Flyer', description: 'Increase your speed by 10 feet, double your jump distance, and you may Dash as a bonus action.' },
    { level: 17, name: 'Signature Move', description: 'While in your persona, replace one attack with a named signature move: jump in any direction up to your speed and make an advantaged attack against a creature in reach. On a hit it is a critical hit and stuns the target through the end of your next turn. A hit recharges after a long rest; a miss recharges after 1 minute.' },
  ] },
  'subclass-bloodhound-bruisers': { name: 'Bloodhound Bruisers', description: 'An observant urban investigator who reads opponents, physical evidence, and the living rhythms of a city.', features: [
    { level: 3, name: 'Ever Vigilant', description: 'You have advantage on initiative. During the first combat round, you have advantage on attacks against creatures that have not acted.' },
    { level: 3, name: 'Detective Work', description: 'Gain proficiency in two of Insight, Investigation, and Perception. Spend 1 Moxie Point to gain advantage on a check using any of those skills.' },
    { level: 6, name: 'Scrap Like a Sleuth', description: 'As a bonus action, spend 2 Moxie Points and choose a creature you see within 30 feet. For 1 minute or until you use this again, you have advantage on weapon attacks against it and add your proficiency bonus to AC against its attacks.' },
    { level: 11, name: 'Heart of the City', description: 'After a long rest in a settlement, make it your familiar settlement. There you cannot be surprised, add proficiency to initiative, have 120-foot darkvision, double proficiency on proficient Insight, Investigation, and Perception checks, cannot become lost by any means, and travel twice as fast outside combat.' },
    { level: 17, name: 'Eyes Wide Open', description: 'As a bonus action, spend 1 Moxie Point to gain advantage on saves against blindness and deafness and gain 30-foot truesight for 1 minute.' },
  ] },
  'subclass-dog-and-hound': { name: 'Dog & Hound', description: 'A pugilist whose loyal canine companion shares their danger, Moxie, and victories.', features: [
    { level: 3, name: 'Bonus Proficiency', description: 'Gain proficiency in Animal Handling. If already proficient, gain proficiency in Perception or Survival instead.' },
    { level: 3, name: 'Brawler’s Best Friend', description: 'Gain a hound using wolf statistics. Add your proficiency bonus to its AC, saves, attacks, and damage; it gains one d8 Hit Die for every Pugilist level after 3rd. Command Attack, Dash, Disengage, Dodge, or Help as a bonus action. Replace a dead hound by bonding with a nonhostile canine for 8 hours.' },
    { level: 3, name: 'Mutt With Moxie', description: 'Brace Up grants your hound the same temporary hit points; the hound can make one or both attacks from The Old One-Two in your place; and Stick and Move can let your hound Dash.' },
    { level: 6, name: 'Arcanine Bite and Coordinated Attack', description: 'Your hound’s attacks count as magical. When you take the Attack action and the hound can see you, it may use its reaction to make a melee attack.' },
    { level: 11, name: 'Hound’s Best Friend', description: 'When an attack damages your hound, use your reaction to make an opportunity attack against the attacker if it is within your reach.' },
    { level: 17, name: 'Dire Hound', description: 'Your hound uses dire wolf statistics, remains Medium, and retains the modifications from Brawler’s Best Friend.' },
  ] },
  'subclass-hand-of-dread': { name: 'Hand of Dread', description: 'A desperate brawler empowered by a dark pact whose transformed limb, invocations, and grotesque growth exact a terrible price.', features: [
    { level: 3, name: 'Black Magic', description: 'Learn blade ward, eldritch blast, and prestidigitation, using Constitution as your spellcasting ability. Learn Abyssal, Infernal, or Sylvan, or another language appropriate to your dread power with the GM’s permission.' },
    { level: 3, name: 'Dread Hand', description: 'As a bonus action once per short or long rest, transform a limb for 1 minute. Reroll 1s on unarmed damage dice; after your first unarmed miss each turn make one additional unarmed strike as part of the action; after the Attack action, spend 2 Moxie Points to make three unarmed strikes as a bonus action.' },
    { level: 6, name: 'Deal With the Devil', description: 'Gain two warlock Eldritch Invocations for which you qualify. Whenever you gain a Pugilist level, you may replace one with another eligible invocation.' },
    { level: 11, name: 'Grotesque Growth', description: 'When activating Dread Hand, you may grow one size category for its duration. You have advantage on Strength checks and saves, 10-foot reach, and deal 1d4 extra melee weapon damage. When it ends, gain one exhaustion level.' },
    { level: 17, name: 'Fountain of Viscera', description: 'As an action, spend 6 Moxie Points; a creature in reach makes a Dexterity save (DC 8 + proficiency bonus + Strength modifier), taking 100 piercing damage on failure or 50 on success. If killed, creatures within 30 feet that see the execution make a Wisdom save or are frightened for 1 minute, repeating at turn end. Recharge after a long rest.' },
  ] },
  'subclass-piss-and-vinegar': { name: 'Piss & Vinegar', description: 'A notorious heel who weaponizes insults, dirty tricks, and a talent for making every foe furious.', features: [
    { level: 3, name: 'Bonus Proficiency', description: 'Gain proficiency in Intimidation.' },
    { level: 3, name: 'Salty Salute', description: 'As a bonus action, provoke a creature within 60 feet that can see or hear you. On a failed Wisdom save (DC 8 + proficiency bonus + Charisma modifier), it takes your Fisticuffs die + Charisma modifier psychic damage and has disadvantage on attacks that do not include you until your next turn.' },
    { level: 6, name: 'Dirty Tricks', description: 'Each trick is usable once per short or long rest. After an unarmed hit, Heelstomper forces a Dexterity save or halves speed for 1 minute; Low Blow forces a Strength save or knocks prone. As a bonus action within 5 feet, Pocket Sand forces a Constitution save or blinds until the end of the target’s next turn. Each failed save restores 1 Moxie Point, up to your maximum.' },
    { level: 11, name: 'Mean Old Cuss', description: 'Use your reaction and spend 1 Moxie Point to gain advantage on an Intimidation check, or to impose disadvantage on a creature’s save against one of your Piss & Vinegar features.' },
    { level: 17, name: 'The Uncouth Art', description: 'When using Salty Salute, target up to your Pugilist level in creatures within 60 feet. Regain 1 Moxie Point the first time each target hits you before your next turn. Recharge after a long rest.' },
  ] },
  'subclass-squared-circle': { name: 'The Squared Circle', description: 'A wrestler who masters locks, pins, throws, and using one opponent as cover against another.', features: [
    { level: 3, name: 'Groundwork', description: 'Gain three Moxie techniques. Compression Lock: when a creature escapes your grapple, react and spend 1 Moxie Point to force a reroll. Quick Pin: when movement provokes your opportunity attack, react and spend 1 to grapple instead. To the Mat: as a bonus action, spend 1 to grapple; on success the target is also prone.' },
    { level: 6, name: 'Meat Shield', description: 'While grappling an enemy, gain half cover against attacks by creatures you are not grappling. When such an attack misses you, react and spend 1 Moxie Point to redirect a newly rolled version of it against an enemy you grapple.' },
    { level: 11, name: 'Heavyweight', description: 'Count as one size larger for grappling and move at full speed while dragging or carrying a grappled creature of your size or smaller.' },
    { level: 17, name: 'Clean Finish', description: 'You have advantage on attacks against creatures you grapple. Your unarmed strikes and pugilist weapon attacks against them score critical hits on 19–20.' },
  ] },
  'subclass-sweet-science': { name: 'The Sweet Science', description: 'A disciplined boxer who blocks, counters, builds combinations, and ends a bout with one perfect knockout.', features: [
    { level: 3, name: 'Cross Counter', description: 'As a reaction when hit by a melee weapon attack, spend 2 Moxie Points to reduce damage by 1d10 + Strength modifier + Pugilist level. If reduced to 0, make an unarmed strike or pugilist weapon attack against a creature in reach as part of the reaction.' },
    { level: 6, name: 'One, Two, Three, Floor', description: 'When both attacks from The Old One-Two hit the same creature, spend 1 Moxie Point to make another unarmed strike in the same bonus action; on a hit it also knocks the creature prone.' },
    { level: 11, name: 'Float Like a Butterfly, Sting Like a Bee', description: 'When Cross Counter reduces damage to 0 and your counterattack hits, regain 1 Moxie Point, up to your maximum.' },
    { level: 17, name: 'Knock Out', description: 'On an unarmed strike or pugilist weapon hit, spend one or more Moxie Points instead of dealing damage. Roll 3d12 + 2d12 for each point after the first and add your Pugilist level; if the result meets or exceeds the target’s remaining hit points, it is unconscious for 10 minutes.' },
  ] },
}

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
function featureDocument(owner: string, seed: FeatureSeed, index: number) {
  const slug = slugify(seed.name)
  const id = `feature-${owner}-${seed.level}-${slug}`
  return {
    document: { _id: id, _type: 'feature', name: seed.name, slug: { _type: 'slug', current: `${owner}-${seed.level}-${slug}`.slice(0, 96) }, acquiredAtLevel: seed.level, description: seed.description, rulesets: RULESETS, isHomebrew: false, versionNotes: 'Restored from the matching Pugilist specification supplied by the archive owner.' },
    reference: ref(id, `${seed.level}-${slug}-${index}`),
  }
}

async function run() {
  const current = await client.fetch<any>(`*[_id == "class-pugilist"][0]{source,sourceBook,isHomebrew,hitDie,"subclassIds":subclasses[]._ref}`)
  const knownIds = Object.keys(clubs)
  const expectedExisting = knownIds.filter((id) => id !== 'subclass-hand-of-dread')
  if (!current || current.source !== 'Unofficial' || current.sourceBook !== 'Sterling Vermin Adventuring Co.' || current.isHomebrew || current.hitDie !== 8 || current.subclassIds.some((id: string) => !knownIds.includes(id)) || expectedExisting.some((id) => !current.subclassIds.includes(id))) {
    throw new Error(`Refusing to merge into an unexpected Pugilist record: ${JSON.stringify(current)}`)
  }

  let tx = client.transaction()
  const classRefs = coreFeatures.map((seed, index) => { const built = featureDocument('pugilist', seed, index); tx = tx.createOrReplace(built.document as any); return built.reference })
  for (const [subclassId, club] of Object.entries(clubs)) {
    const owner = subclassId.replace(/^subclass-/, '')
    const featureRefs = club.features.map((seed, index) => { const built = featureDocument(owner, seed, index); tx = tx.createOrReplace(built.document as any); return built.reference })
    tx = tx.createOrReplace({
      _id: subclassId, _type: 'subclass', version: 1, name: club.name, slug: { _type: 'slug', current: owner }, parentClassId: 'pugilist', parentClass: ref('class-pugilist', 'pugilist'),
      description: club.description, features: featureRefs, source: 'Unofficial', sourceBook: 'Sterling Vermin Adventuring Co.', edition: 'Both', rulesets: RULESETS, isHomebrew: false,
      isSpellcaster: subclassId === 'subclass-hand-of-dread',
      versionNotes: 'Generic placeholder mechanics replaced with the matching Fight Club progression from the supplied Pugilist text.',
    } as any)
  }
  tx = tx.patch('class-pugilist', (patch) => patch.set({
    description: 'A rough-and-tumble brawler who survives through grit, bare-knuckle technique, and Moxie forged by hardship. Pugilists turn punishment into resolve and pursue highly individual fighting traditions called Fight Clubs.',
    hitDie: 8, primaryAbility: ['STR', 'CON'], savingThrows: ['STR', 'CON'],
    proficiencies: [
      { _type: 'proficiencyRule', _key: 'pugilist-armor', type: 'armor', mode: 'fixed', armorOptions: ['Light Armor'] },
      { _type: 'proficiencyRule', _key: 'pugilist-weapons', type: 'weapon', mode: 'fixed', weaponOptions: ['Simple Weapons', 'Improvised Weapons', 'Whip', 'Derringer'] },
      { _type: 'proficiencyRule', _key: 'pugilist-tools', type: 'tool', mode: 'choice', count: 1, toolOptions: ['Artisan’s Tools', 'Gaming Set', 'Thieves’ Tools'] },
      { _type: 'proficiencyRule', _key: 'pugilist-skills', type: 'skill', mode: 'choice', count: 2, skillOptions: ['Acrobatics', 'Athletics', 'Deception', 'Intimidation', 'Perception', 'Sleight of Hand', 'Stealth'] },
    ],
    startingEquipment: ['Leather armor or any simple weapon', 'A dungeoneer’s pack or explorer’s pack', 'One set of artisan’s tools, a gaming set, or thieves’ tools'],
    isSpellcaster: false, spellcaster: 'none', features: classRefs, progression, subclassLevel: 3, subclasses: knownIds.map((id) => ref(id, id.replace(/^subclass-/, ''))),
    source: 'Unofficial', sourceBook: 'Sterling Vermin Adventuring Co.', edition: 'Both', rulesets: RULESETS, isHomebrew: false,
    versionNotes: 'Restored from the matching owner-supplied Pugilist text: complete 1–20 Fisticuffs and Moxie progression plus all seven Fight Clubs, including the previously missing Hand of Dread.',
  }).unset(['spellcastingAbility', 'spellLists', 'spells']))

  if (!APPLY) { console.log(`Dry run: ${coreFeatures.length} core features, ${Object.values(clubs).flatMap((club) => club.features).length} Fight Club features, ${progression.length} progression rows, and all 7 Fight Clubs.`); return }
  const result = await tx.commit({ visibility: 'sync' })
  const ids = Object.keys(clubs)
  const audit = await client.fetch<any>(`*[_id == "class-pugilist"][0]{sourceBook,isHomebrew,isSpellcaster,spellcaster,hitDie,primaryAbility,savingThrows,"featureCount":count(features),"progressionCount":count(progression),"subclassCount":count(subclasses),"brokenRefs":count(features[!defined(@->._id)])+count(subclasses[!defined(@->._id)]),"fisticuffs":progression[].resources[name=="Fisticuffs"][0].value,"moxie":progression[].resources[name=="Moxie Points"][0].value,"clubs":*[_id in [${ids.map((id) => `"${id}"`).join(',')}]]|order(_id asc){_id,isHomebrew,"featureCount":count(features),"brokenRefs":count(features[!defined(@->._id)])}}`)
  if (audit.sourceBook !== 'Sterling Vermin Adventuring Co.' || audit.isHomebrew || audit.isSpellcaster || audit.spellcaster !== 'none' || audit.hitDie !== 8 || audit.primaryAbility.join(',') !== 'STR,CON' || audit.savingThrows.join(',') !== 'STR,CON' || audit.featureCount !== coreFeatures.length || audit.progressionCount !== 20 || audit.subclassCount !== 7 || audit.brokenRefs || audit.fisticuffs.join(',') !== progressionRows.map((row) => row[2]).join(',') || audit.moxie.join(',') !== progressionRows.map((row) => row[3]).join(',') || audit.clubs.length !== 7 || audit.clubs.some((club: any) => club.isHomebrew || club.featureCount !== clubs[club._id].features.length || club.brokenRefs)) throw new Error(`Pugilist merge audit failed: ${JSON.stringify(audit)}`)
  console.log(`Applied ${result.results.length} mutations. Verification: ${JSON.stringify(audit)}`)
}

run().catch((error) => { console.error(error); process.exit(1) })
