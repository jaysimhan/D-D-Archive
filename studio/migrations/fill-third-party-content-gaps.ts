import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-08-21' })
const APPLY = process.argv.includes('--apply')

type Role = 'assault' | 'companion' | 'control' | 'curse' | 'defense' | 'healing' | 'magic' | 'mobility' | 'support' | 'utility'
type Subclass = {
  _id: string
  name: string
  parentClassId: string
  description: string
  rulesets?: Array<{ _type: 'reference'; _key: string; _ref: string }>
  ruleset?: { _type: 'reference'; _ref: string }
  isHomebrew?: boolean
}
type FeatureSeed = { level: number; name: string; description: string }

// These are concise, original 5e-compatible mechanics written from each record's
// existing theme. They are not transcriptions of the publishers' rules text.
const subclassIds = [
  'subclass-curse-of-animation', 'subclass-curse-of-lycanthropy', 'subclass-curse-of-the-armament', 'subclass-curse-of-the-fiend',
  'subclass-acolyte-of-shadows', 'subclass-acolyte-of-togashi',
  'subclass-animota', 'subclass-battlemind', 'subclass-dreamshaper',
  'subclass-amorist', 'subclass-alchemist-apothecary', 'subclass-dynamo-engineer', 'subclass-mad-bomber', 'subclass-alchemist-mutagenist', 'subclass-ooze-rancher', 'subclass-venomsmith', 'subclass-xenoalchemist',
  'subclass-alienist', 'subclass-chemist', 'subclass-exorcist', 'subclass-pathogenist',
  'subclass-ferocious-bond', 'subclass-hunter-bond', 'subclass-infernal-bond', 'subclass-primordial-bond', 'subclass-protector-bond',
  'subclass-dragon-banner', 'subclass-eagle-banner', 'subclass-lion-banner', 'subclass-ram-banner', 'subclass-raven-banner', 'subclass-turtle-banner',
  'subclass-armigers-guild', 'subclass-bladeworkers-guild', 'subclass-calibarons-guild', 'subclass-forgeknights-guild', 'subclass-mechanauts-guild', 'subclass-thunderlords-guild', 'subclass-trappers-guild',
  'subclass-gun-tank', 'subclass-gun-ko-master', 'subclass-high-roller', 'subclass-musketeer', 'subclass-pistolero', 'subclass-sharpshooter', 'subclass-spellslinger',
  'subclass-antiquarian', 'subclass-archivist', 'subclass-detective', 'subclass-exterminator', 'subclass-inquisitor', 'subclass-medium', 'subclass-occultist', 'subclass-spy',
  'subclass-burden-of-atonement', 'subclass-burden-of-discord', 'subclass-burden-of-mercy', 'subclass-burden-of-revolution', 'subclass-burden-of-truth', 'subclass-burden-of-tyranny',
  'subclass-blood-ascendant', 'subclass-death-knight', 'subclass-overlord', 'subclass-pale-master', 'subclass-pharaoh', 'subclass-plague-lord', 'subclass-reanimator', 'subclass-reaper',
  'subclass-arena-royale', 'subclass-bloodhound-bruisers', 'subclass-dog-and-hound', 'subclass-piss-and-vinegar', 'subclass-squared-circle', 'subclass-sweet-science',
  'subclass-bloodwrath-guardian', 'subclass-grey-watchman', 'subclass-nightgaunt', 'subclass-soulblood-shaman', 'subclass-stoneheart-defender', 'subclass-storm-sentinel', 'subclass-verdant-protector',
  'subclass-house-of-bishops', 'subclass-house-of-cards', 'subclass-house-of-dice', 'subclass-house-of-kings', 'subclass-house-of-knights', 'subclass-house-of-lancers', 'subclass-house-of-rooks',
  'subclass-black-magic', 'subclass-blood-magic', 'subclass-green-magic', 'subclass-purple-magic', 'subclass-red-magic', 'subclass-steel-magic', 'subclass-white-magic',
] as const

const roles: Partial<Record<(typeof subclassIds)[number], Role>> = {
  'subclass-curse-of-animation': 'companion', 'subclass-curse-of-lycanthropy': 'curse', 'subclass-curse-of-the-armament': 'assault', 'subclass-curse-of-the-fiend': 'magic',
  'subclass-acolyte-of-shadows': 'mobility', 'subclass-acolyte-of-togashi': 'magic',
  'subclass-animota': 'magic', 'subclass-battlemind': 'assault', 'subclass-dreamshaper': 'control',
  'subclass-amorist': 'control', 'subclass-alchemist-apothecary': 'healing', 'subclass-dynamo-engineer': 'assault', 'subclass-mad-bomber': 'assault', 'subclass-alchemist-mutagenist': 'defense', 'subclass-ooze-rancher': 'companion', 'subclass-venomsmith': 'assault', 'subclass-xenoalchemist': 'defense',
  'subclass-alienist': 'magic', 'subclass-chemist': 'assault', 'subclass-exorcist': 'support', 'subclass-pathogenist': 'control',
  'subclass-ferocious-bond': 'assault', 'subclass-hunter-bond': 'utility', 'subclass-infernal-bond': 'magic', 'subclass-primordial-bond': 'magic', 'subclass-protector-bond': 'companion',
  'subclass-dragon-banner': 'control', 'subclass-eagle-banner': 'mobility', 'subclass-lion-banner': 'support', 'subclass-ram-banner': 'assault', 'subclass-raven-banner': 'utility', 'subclass-turtle-banner': 'defense',
  'subclass-armigers-guild': 'defense', 'subclass-bladeworkers-guild': 'assault', 'subclass-calibarons-guild': 'utility', 'subclass-forgeknights-guild': 'defense', 'subclass-mechanauts-guild': 'companion', 'subclass-thunderlords-guild': 'magic', 'subclass-trappers-guild': 'control',
  'subclass-gun-tank': 'defense', 'subclass-gun-ko-master': 'mobility', 'subclass-high-roller': 'utility', 'subclass-musketeer': 'support', 'subclass-pistolero': 'assault', 'subclass-sharpshooter': 'utility', 'subclass-spellslinger': 'magic',
  'subclass-antiquarian': 'utility', 'subclass-archivist': 'magic', 'subclass-detective': 'utility', 'subclass-exterminator': 'assault', 'subclass-inquisitor': 'control', 'subclass-medium': 'support', 'subclass-occultist': 'magic', 'subclass-spy': 'mobility',
  'subclass-burden-of-atonement': 'defense', 'subclass-burden-of-discord': 'control', 'subclass-burden-of-mercy': 'healing', 'subclass-burden-of-revolution': 'support', 'subclass-burden-of-truth': 'utility', 'subclass-burden-of-tyranny': 'control',
  'subclass-blood-ascendant': 'magic', 'subclass-death-knight': 'assault', 'subclass-overlord': 'companion', 'subclass-pale-master': 'defense', 'subclass-pharaoh': 'control', 'subclass-plague-lord': 'control', 'subclass-reanimator': 'companion', 'subclass-reaper': 'assault',
  'subclass-arena-royale': 'support', 'subclass-bloodhound-bruisers': 'utility', 'subclass-dog-and-hound': 'companion', 'subclass-piss-and-vinegar': 'control', 'subclass-squared-circle': 'control', 'subclass-sweet-science': 'assault',
  'subclass-bloodwrath-guardian': 'defense', 'subclass-grey-watchman': 'utility', 'subclass-nightgaunt': 'control', 'subclass-soulblood-shaman': 'support', 'subclass-stoneheart-defender': 'defense', 'subclass-storm-sentinel': 'magic', 'subclass-verdant-protector': 'healing',
  'subclass-house-of-bishops': 'control', 'subclass-house-of-cards': 'utility', 'subclass-house-of-dice': 'magic', 'subclass-house-of-kings': 'support', 'subclass-house-of-knights': 'defense', 'subclass-house-of-lancers': 'mobility', 'subclass-house-of-rooks': 'mobility',
  'subclass-black-magic': 'curse', 'subclass-blood-magic': 'magic', 'subclass-green-magic': 'healing', 'subclass-purple-magic': 'control', 'subclass-red-magic': 'assault', 'subclass-steel-magic': 'defense', 'subclass-white-magic': 'support',
}

const damageTypes: Partial<Record<(typeof subclassIds)[number], string>> = {
  'subclass-curse-of-the-armament': 'force', 'subclass-curse-of-the-fiend': 'fire', 'subclass-acolyte-of-shadows': 'necrotic', 'subclass-acolyte-of-togashi': 'force',
  'subclass-animota': 'force', 'subclass-battlemind': 'psychic', 'subclass-dynamo-engineer': 'lightning', 'subclass-mad-bomber': 'fire', 'subclass-venomsmith': 'poison',
  'subclass-alienist': 'psychic', 'subclass-chemist': 'acid', 'subclass-infernal-bond': 'fire', 'subclass-primordial-bond': 'elemental', 'subclass-ram-banner': 'bludgeoning',
  'subclass-bladeworkers-guild': 'slashing', 'subclass-thunderlords-guild': 'thunder', 'subclass-gun-ko-master': 'force', 'subclass-pistolero': 'piercing', 'subclass-spellslinger': 'force',
  'subclass-exterminator': 'acid', 'subclass-occultist': 'psychic', 'subclass-blood-ascendant': 'necrotic', 'subclass-death-knight': 'necrotic', 'subclass-reaper': 'necrotic',
  'subclass-sweet-science': 'bludgeoning', 'subclass-storm-sentinel': 'lightning', 'subclass-house-of-dice': 'force', 'subclass-red-magic': 'fire',
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function featureSeeds(subclass: Subclass, role: Role): FeatureSeed[] {
  const theme = subclass.name
  const damage = damageTypes[subclass._id as keyof typeof damageTypes] || 'force'
  const save = '8 + your proficiency bonus + your primary class ability modifier'
  const byRole: Record<Role, FeatureSeed[]> = {
    assault: [
      { level: 3, name: `${theme} Technique`, description: `Once on each of your turns when you hit with an attack, you can deal an extra 1d6 ${damage} damage. You can add this damage a number of times equal to your proficiency bonus, regaining all uses when you finish a long rest.` },
      { level: 6, name: 'Press the Advantage', description: `When you deal the extra damage from your ${theme} Technique, the target cannot take reactions until the start of its next turn, and you can move up to 10 feet without provoking opportunity attacks from it.` },
      { level: 10, name: `${theme} Hardening`, description: `You gain resistance to ${damage === 'elemental' ? 'one of acid, cold, fire, lightning, or thunder damage, chosen after each long rest' : `${damage} damage`}. When you roll initiative, you regain one expended use of your ${theme} Technique.` },
      { level: 14, name: `${theme} Mastery`, description: `Once per long rest, as an action, you unleash your discipline in a 20-foot-radius area centered on a point you can see within 60 feet. Chosen creatures there make a Dexterity saving throw (DC ${save}), taking 6d6 ${damage === 'elemental' ? 'damage of a type you choose from acid, cold, fire, lightning, or thunder' : `${damage} damage`} on a failure or half as much on a success.` },
    ],
    companion: [
      { level: 3, name: `${theme} Companion`, description: `Your subclass's creature or animated ally becomes a dependable partner. It adds your proficiency bonus to its Armor Class and damage rolls, acts on your initiative, and can move and take reactions on its own; it takes other actions when you command it as a bonus action.` },
      { level: 6, name: 'Coordinated Assault', description: `Once per turn when you or your companion hits a creature within 5 feet of the other, the attack deals an extra 1d8 damage of the attack's type. Your companion's attacks count as magical for overcoming resistance and immunity.` },
      { level: 10, name: 'Protective Bond', description: `When you or your companion takes damage while within 30 feet of the other, either of you can use a reaction to reduce that damage by 1d10 + your proficiency bonus. You can do so a number of times equal to your proficiency bonus per long rest.` },
      { level: 14, name: 'Perfect Partnership', description: `Once per long rest, as a bonus action, you empower your bond for 1 minute. You and your companion gain 10 temporary hit points at the start of each of your turns, have advantage on saving throws, and can each make one attack when the other takes the Attack action.` },
    ],
    control: [
      { level: 3, name: `${theme} Influence`, description: `Once per turn when you hit a creature or it fails a saving throw against one of your abilities, you can reduce its speed by 10 feet and prevent it from taking reactions until the start of your next turn. You can do so a number of times equal to your proficiency bonus per long rest.` },
      { level: 6, name: 'Compelling Position', description: `When a creature you can see within 60 feet fails a saving throw, you can use your reaction to move it up to 10 feet to an unoccupied space you can see. This movement does not provoke opportunity attacks.` },
      { level: 10, name: 'Denial Field', description: `Ground within 10 feet of you is difficult terrain for hostile creatures. A hostile creature that enters the area for the first time on a turn must succeed on a Strength saving throw (DC ${save}) or have its speed become 0 for the rest of that turn.` },
      { level: 14, name: 'Master of the Field', description: `Once per long rest, as an action, choose a point within 60 feet. For 1 minute, a 20-foot-radius zone there is difficult terrain for your enemies. When an enemy starts its turn in the zone, you can force it to make a Wisdom saving throw (DC ${save}); on a failure, it is frightened or restrained (your choice) until the start of its next turn.` },
    ],
    curse: [
      { level: 3, name: `${theme} Manifestation`, description: `As a bonus action, mark one creature you can see within 60 feet for 1 minute. Once per turn when you damage it, deal an extra 1d6 necrotic damage. You can mark a creature a number of times equal to your proficiency bonus per long rest.` },
      { level: 6, name: 'Feed the Curse', description: `When a creature marked by your ${theme} Manifestation misses you or fails a saving throw, you gain temporary hit points equal to 1d6 + your proficiency bonus and can move up to 10 feet without provoking opportunity attacks.` },
      { level: 10, name: 'Cursed Resilience', description: `You gain resistance to necrotic damage and advantage on saving throws against being charmed or frightened. When you finish a short rest, you regain one expended use of your ${theme} Manifestation.` },
      { level: 14, name: 'Curse Unbound', description: `Once per long rest, you can manifest your curse for 1 minute without marking a single target. During that time, the extra necrotic damage applies to any creature you damage, and a creature damaged by it has disadvantage on its next saving throw before the start of your next turn.` },
    ],
    defense: [
      { level: 3, name: `${theme} Guard`, description: `As a bonus action, enter a guarded stance until the start of your next turn. You gain a +2 bonus to Armor Class and cannot be moved against your will. You can use this stance a number of times equal to your proficiency bonus per long rest.` },
      { level: 6, name: 'Interposing Defense', description: `When you or a creature within 30 feet takes damage, you can use your reaction to reduce it by 1d10 + your proficiency bonus. If the protected creature is within 5 feet, you may also swap places with it.` },
      { level: 10, name: 'Unyielding', description: `You have advantage on checks and saving throws made to avoid or end the grappled, prone, or restrained condition. Whenever you use ${theme} Guard, you also gain temporary hit points equal to twice your proficiency bonus.` },
      { level: 14, name: 'Living Bulwark', description: `Once per long rest, as a bonus action, you project a 10-foot protective aura for 1 minute. You and allies in it have resistance to bludgeoning, piercing, and slashing damage, and hostile creatures treat the aura as difficult terrain.` },
    ],
    healing: [
      { level: 3, name: `${theme} Remedy`, description: `As an action, restore hit points to a creature you touch equal to 2d6 + your primary class ability modifier. You can use this remedy a number of times equal to your proficiency bonus per long rest.` },
      { level: 6, name: 'Rapid Treatment', description: `You can use your ${theme} Remedy as a bonus action. A creature healed by it can immediately stand from prone without spending movement and gains advantage on its next saving throw before the start of your next turn.` },
      { level: 10, name: 'Purging Practice', description: `When you use your remedy, you can also end one of these conditions on the target: blinded, charmed, deafened, frightened, or poisoned. Alternatively, reduce the target's exhaustion level by one; a creature can receive this exhaustion benefit only once per long rest.` },
      { level: 14, name: 'Master Restoration', description: `Once per long rest, as an action, choose up to six creatures within 30 feet. Each regains 4d8 + your primary class ability modifier hit points and can immediately repeat one saving throw against an effect currently causing it to be charmed, frightened, paralyzed, or stunned.` },
    ],
    magic: [
      { level: 3, name: `${theme} Working`, description: `You learn to release this tradition's power. As an action, make a spell attack against a creature within 60 feet; on a hit it takes 2d6 ${damage === 'elemental' ? 'acid, cold, fire, lightning, or thunder damage (your choice)' : `${damage} damage`}. You can use this working a number of times equal to your proficiency bonus per long rest.` },
      { level: 6, name: 'Focused Channeling', description: `Whenever you cast a spell or use your ${theme} Working, you can teleport up to 10 feet to an unoccupied space you can see and gain temporary hit points equal to your proficiency bonus.` },
      { level: 10, name: `${theme} Ward`, description: `You have advantage on Constitution saving throws made to maintain concentration and gain resistance to ${damage === 'elemental' ? 'one of acid, cold, fire, lightning, or thunder damage, chosen after each long rest' : `${damage} damage`}.` },
      { level: 14, name: 'Supreme Working', description: `Once per long rest, as an action, choose a point within 120 feet. Creatures you choose in a 20-foot-radius sphere make a Dexterity saving throw (DC ${save}), taking 8d6 ${damage === 'elemental' ? 'acid, cold, fire, lightning, or thunder damage (your choice)' : `${damage} damage`} on a failure or half as much on a success.` },
    ],
    mobility: [
      { level: 3, name: `${theme} Footwork`, description: `Your walking speed increases by 10 feet. Once on each of your turns after you make an attack or use a class feature, you can move 5 feet without provoking opportunity attacks.` },
      { level: 6, name: 'Hit and Run', description: `As a bonus action, take the Dash or Disengage action. You can do so a number of times equal to your proficiency bonus per long rest; when you do, nonmagical difficult terrain costs you no extra movement that turn.` },
      { level: 10, name: 'Evasive Rhythm', description: `When an effect allows a Dexterity saving throw for half damage, you instead take no damage on a success and half damage on a failure. Standing from prone costs you only 5 feet of movement.` },
      { level: 14, name: 'Uncatchable', description: `Once per long rest, as a bonus action, enter a heightened state for 1 minute. Your speed doubles, you can move across liquids and vertical surfaces during your turn, and opportunity attacks against you automatically miss.` },
    ],
    support: [
      { level: 3, name: `${theme} Rally`, description: `As a bonus action, choose a creature other than yourself within 60 feet. It gains temporary hit points equal to 1d8 + your proficiency bonus and can move up to 10 feet without provoking opportunity attacks. You can rally a creature a number of times equal to your proficiency bonus per long rest.` },
      { level: 6, name: 'Coordinated Aid', description: `When a creature you can see within 60 feet makes an attack roll, ability check, or saving throw, you can use your reaction to add your proficiency bonus to the roll after seeing it but before the outcome is declared.` },
      { level: 10, name: 'Renewed Resolve', description: `Creatures that gain temporary hit points from you have advantage on their next saving throw against being charmed or frightened. When you roll initiative, you regain one expended use of your ${theme} Rally.` },
      { level: 14, name: 'Inspiring Presence', description: `Once per long rest, as a bonus action, inspire allies within 30 feet for 1 minute. At the start of each of their turns, chosen creatures gain 5 temporary hit points and may move 5 feet; once during the effect, each may turn a missed attack or failed saving throw into a success.` },
    ],
    utility: [
      { level: 3, name: `${theme} Expertise`, description: `Gain proficiency in two skills or tools appropriate to this specialty; if already proficient, double your proficiency bonus for checks with that choice. As a bonus action, study a creature or object within 60 feet and add 1d4 to your next related attack roll or ability check within 1 minute.` },
      { level: 6, name: 'Prepared Countermeasure', description: `When you or an ally within 30 feet fails an ability check or saving throw, you can use your reaction to add your proficiency bonus, potentially turning failure into success. You can do so a number of times equal to your proficiency bonus per long rest.` },
      { level: 10, name: 'Unerring Method', description: `You cannot be surprised while conscious, have advantage on initiative rolls, and detect hidden creatures and objects within 10 feet as though you had made a successful search for them.` },
      { level: 14, name: 'Grand Insight', description: `Once per long rest, as a bonus action, enter a state of perfect focus for 1 minute. You have advantage on attack rolls, ability checks, and saving throws, and creatures have disadvantage on attack rolls against you.` },
    ],
  }
  return byRole[role]
}

const spellRepairs: Record<string, Record<string, unknown>> = {
  'spell-absorb-material': {
    duration: 'Concentration, up to 1 hour', concentration: true,
    description: 'You touch an unattended, nonmagical object no larger than a 5-foot cube and draw a portion of its substance into yourself. The object loses no structural integrity. Choose a material that makes up most of it: wood grants advantage on Dexterity (Stealth) checks in natural terrain; stone grants a +2 bonus to AC; or metal grants resistance to nonmagical slashing damage. The benefit lasts until the spell ends, after which the absorbed matter returns to the object.',
    higherLevels: 'When cast using a 6th-level or higher spell slot, you can absorb two different materials and gain both benefits.',
  },
  'spell-adjust-positioning': {
    description: 'Choose two willing creatures you can see within range. Each creature teleports to the space occupied by the other. Both destinations must be able to support the arriving creature, and a creature cannot be transported into a space too small for it. This movement does not provoke opportunity attacks.',
    higherLevels: 'When cast using a 2nd-level or higher spell slot, you can exchange the positions of one additional pair of willing creatures for each slot level above 1st.',
  },
  'spell-aether-shroud': {
    description: 'You wrap one creature you can see within range in flickering aether. Make a ranged spell attack against the target. On a hit, it takes 1d8 force damage and cannot make opportunity attacks until the start of your next turn.',
    higherLevels: 'The damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).',
  },
  'spell-aether-soul-link': {
    castingTime: '1 reaction, taken when a creature you can see within 30 feet takes damage', range: '30 feet',
    description: 'You catch part of an ally’s pain in an aetheric bond. Reduce the triggering damage by 2d8 + your spellcasting ability modifier, and you take force damage equal to half the amount reduced. This force damage cannot be reduced or prevented. If the reduction lowers the triggering damage to 0, the protected creature may move up to 10 feet without provoking opportunity attacks.',
    higherLevels: 'The damage reduction increases by 1d8 for each slot level above 2nd.',
  },
  'spell-aetherial-rift': {
    duration: 'Concentration, up to 1 minute', concentration: true,
    components: { verbal: true, somatic: true, material: true, materialDescription: 'two matching silver rings worth at least 250 gp each, which the spell does not consume' },
    description: 'Choose two unoccupied spaces you have seen within range. A shimmering, 10-foot-diameter portal appears at each point, and the two portals are linked. A creature or object entering one portal exits the other after spending 5 feet of movement. The portals face directions you choose, cannot appear inside solid matter, and close when the spell ends.',
  },
  'spell-aetheric-adaptation': {
    duration: '1 hour',
    description: 'You alter a willing creature to survive unstable aetheric conditions. Choose acid, cold, fire, lightning, or thunder. The target has resistance to the chosen damage type, can breathe in airless environments, and ignores the harmful effects of extreme heat, extreme cold, and high altitude for the duration.',
    higherLevels: 'When cast using a 4th-level or higher spell slot, you can target one additional creature for every two slot levels above 2nd.',
  },
  'spell-aetheric-bedlam': {
    castingTime: '1 action', range: 'Self (60-foot radius)',
    components: { verbal: false, somatic: true, material: true, materialDescription: 'a cracked prism' },
    description: 'You discharge a wave of disruptive aether. Each creature of your choice within 60 feet must make a Charisma saving throw. On a failed save, a creature takes 6d6 force damage, loses concentration, and cannot take reactions until the end of its next turn. On a successful save, it takes half as much damage and suffers no other effect. Unattended magical effects of 3rd level or lower in the area are suppressed until the start of your next turn.',
    higherLevels: 'The damage increases by 1d6 for each slot level above 4th.',
  },
  'spell-aetheric-communion': {
    components: { verbal: true, somatic: true, material: true, materialDescription: 'a crystal pendulum suspended on silver wire worth at least 25 gp' },
    description: 'You attune your mind to the currents and inhabitants of the Aetherial Expanse. Ask up to three questions concerning locations, routes, creatures, or events in that realm. For each question, you receive a truthful brief answer—such as yes, no, unclear, or a short phrase—from a nearby aetheric intelligence. Repeated castings before a long rest carry a cumulative 25 percent chance after the first that no answer is received.',
  },
  'spell-agglutination': {
    duration: '1 round',
    description: 'You conjure a knot of adhesive aether beneath one creature you can see within range. The target must succeed on a Dexterity saving throw or its speed is reduced by 10 feet and it cannot benefit from increases to its speed until the start of your next turn. A creature whose speed is reduced to 0 by this spell is also unable to take reactions for the duration.',
  },
  'spell-ale-dritch-blast': {
    description: 'A frothing bolt streaks toward one creature within range. Make a ranged spell attack. On a hit, the target takes 1d8 force damage and must succeed on a Constitution saving throw or stumble 5 feet in a direction you choose. This forced movement does not provoke opportunity attacks.',
    higherLevels: 'The spell creates one additional bolt at 5th level (two bolts), 11th level (three), and 17th level (four). Make a separate attack for each bolt; multiple bolts can target the same creature, but a creature can be moved only once per casting.',
  },
  'spell-ameliorate': {
    description: 'You ease a creature’s immediate suffering. Touch one willing creature and end one of these conditions affecting it: charmed, frightened, or poisoned. If none applies, the target instead gains 2d6 temporary hit points that last for 1 hour.',
    higherLevels: 'When cast using a 2nd-level or higher spell slot, you can target one additional willing creature within 10 feet of the first for each slot level above 1st.',
  },
}

async function buildTransaction() {
  const subclasses = await client.fetch<Subclass[]>(`*[_type == "subclass" && _id in $ids]{
    _id, name, parentClassId, description, rulesets, ruleset, isHomebrew
  }`, { ids: subclassIds })
  const found = new Set(subclasses.map(({ _id }) => _id))
  const missing = subclassIds.filter((id) => !found.has(id))
  if (missing.length) throw new Error(`Missing ${missing.length} expected subclasses: ${missing.join(', ')}`)
  if (subclasses.length !== 95) throw new Error(`Expected 95 subclasses, found ${subclasses.length}`)

  const spells = await client.fetch<Array<{ _id: string; description?: string }>>(
    '*[_type == "spell" && _id in $ids]{_id, description}',
    { ids: Object.keys(spellRepairs) },
  )
  if (spells.length !== 11) throw new Error(`Expected 11 spells, found ${spells.length}`)

  let tx = client.transaction()
  let featureCount = 0
  for (const subclass of subclasses) {
    const role = roles[subclass._id as keyof typeof roles]
    if (!role) throw new Error(`No feature role configured for ${subclass._id}`)
    const refs = featureSeeds(subclass, role).map((seed) => {
      const featureId = `feature-${subclass._id.replace(/^subclass-/, '')}-${seed.level}-${slugify(seed.name)}`
      tx = tx.createOrReplace({
        _id: featureId,
        _type: 'feature',
        name: seed.name,
        slug: { _type: 'slug', current: featureId.replace(/^feature-/, '') },
        acquiredAtLevel: seed.level,
        description: seed.description,
        rulesets: subclass.rulesets,
        ruleset: subclass.ruleset,
        isHomebrew: subclass.isHomebrew ?? false,
        versionNotes: `Original archive completion for ${subclass.name}; compatible mechanics inferred from the subclass theme.`,
      } as any)
      featureCount += 1
      return { _type: 'reference', _key: `${seed.level}-${slugify(seed.name)}`, _ref: featureId }
    })
    tx = tx.patch(subclass._id, (patch) => patch.set({ features: refs }))
  }

  for (const [spellId, repair] of Object.entries(spellRepairs)) {
    tx = tx.patch(spellId, (patch) => patch.set(repair))
  }
  return { tx, featureCount }
}

async function verify() {
  const result = await client.fetch<{
    subclassCount: number
    populatedSubclassCount: number
    linkedFeatureCount: number
    emptySpellCount: number
  }>(`{
    "subclassCount": count(*[_type == "subclass" && _id in $subclassIds]),
    "populatedSubclassCount": count(*[_type == "subclass" && _id in $subclassIds && count(features) == 4]),
    "linkedFeatureCount": count(*[_type == "subclass" && _id in $subclassIds].features[]),
    "emptySpellCount": count(*[_type == "spell" && _id in $spellIds && (!defined(description) || description == "")])
  }`, { subclassIds, spellIds: Object.keys(spellRepairs) })
  return result
}

async function run() {
  const { tx, featureCount } = await buildTransaction()
  if (!APPLY) {
    console.log(`Dry run ready: ${subclassIds.length} subclasses, ${featureCount} feature documents, and ${Object.keys(spellRepairs).length} spells. Add --apply to commit.`)
    return
  }
  const result = await tx.commit({ visibility: 'sync' })
  const audit = await verify()
  if (audit.subclassCount !== 95 || audit.populatedSubclassCount !== 95 || audit.linkedFeatureCount !== 380 || audit.emptySpellCount !== 0) {
    throw new Error(`Post-migration verification failed: ${JSON.stringify(audit)}`)
  }
  console.log(`Applied ${result.results.length} document mutations. Verification: ${JSON.stringify(audit)}`)
}

run().catch((error) => { console.error(error); process.exit(1) })
