import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-08-21' }).withConfig({ perspective: 'raw' })
const APPLY = process.argv.includes('--apply')
const RULESETS = [
  { _type: 'reference', _key: 'srd-2014', _ref: 'ruleset.srd-2014' },
  { _type: 'reference', _key: 'srd-2024', _ref: '86642d23-c52d-4577-adc1-214aab0f43e9' },
]
const ref = (id: string, key = id) => ({ _type: 'reference', _key: key, _ref: id })
type FeatureSeed = { level: number; name: string; description: string }

// Masterwork property catalogues, transcribed by tier from the Craftsman PDF.
const APPRENTICE_WEAPON = 'Aerodynamic, Automatic, Balanced, Blaster, Concealable, Elegant, Exotic, Extended Magazine, Finesse, Firearm, Fist, Foregrip, Heavy, Light, Loading, Martial, Parrying, Reach, Reload, Returning, Scatter, Sighted, Superheavy, Switch, Thrown, Trip, Two-Handed, Variable, and Versatile'
const APPRENTICE_ARMOR = 'Cleated, Climbing, Comfortable, Environmental, Exotic, Integrated, Quick-Change, Retractable, Scaled, and Spiked'
const JOURNEYMAN_WEAPON = 'Counterweighted, Double, Explosive, Heat, Magical, Massive, Mounted, Overheat, Precision, Rocket, Sniper, Tension, and Twinshot'
const JOURNEYMAN_ARMOR = 'Adamantine, Arcane, Arrow-Catching, Diving, Juggernaut, Maneuvering, Mithral, and Resistance'
const MASTER_WEAPON = 'Adamantine, Blessed, Earthshatter, Elemental, Keen, Magical, Mithral, Serrated, Slaying, Vampiric, and Venom'
const MASTER_ARMOR = 'Animated, Cloaking, Clockwork, Glamoured, Trollskin, and Winged'
const LEGENDARY_WEAPON = 'Crushing, Deadly, Magical, Penetrating, Seeking, Swift, Threatening, and Vorpal'
const LEGENDARY_ARMOR = 'Colossal, Etherealness, Fleet, Immortal, Mirrored, Spellguard, and Warding'

const coreFeatures: FeatureSeed[] = [
  { level: 1, name: 'Exotic Proficiencies', description: 'You gain proficiency in exotic weapons and exotic armor, unconventional yet effective items that no other class gains proficiency with. If a feature or effect grants proficiency with a weapon or suit of armor, it does not grant proficiency with exotic weapons or exotic armor unless otherwise stated.' },
  { level: 1, name: 'Active Crafting', description: "You can craft one item each day when you take a long rest, without losing the benefits of a long rest. You pay half the item's gold piece cost in materials, up to 25 gp; if an item costs more than that in materials, you finish it by working on it for multiple days, spending up to your daily allowance each day. As you gain levels your crafting speed increases, as shown in the Active Crafting column of the Craftsman table, from 25 gp at 1st level to 500 gp at 20th. Items you craft with this feature are worth half their gold piece cost when sold, so you can sell an item to refund its cost in materials but not to make a profit. You also carry a set of craftsman's tools (75 gp), a combined toolkit you can use for any ability check you would make with any set of artisan's tools. In downtime, any character makes 5 gp of crafting progress per day; as a craftsman you make 10 gp per day." },
  { level: 2, name: 'Masterwork', description: `You can create weapons and armor of the utmost quality, known as masterwork items. To create a masterwork version of an item, add 50 gp to the cost in materials you pay to craft it. Masterwork weapons you create have a +1 bonus to attack rolls; a magic weapon that adds a bonus to your attack and damage rolls does not add this bonus to attack rolls. Masterwork properties come in four tiers, each requiring a level in this class and a cost: Apprentice (2nd level, no cost), Journeyman (5th level, 100 gp), Master (11th level, 250 gp), and Legendary (17th level, 400 gp). When you learn a new tier you can apply one property from it to a masterwork item at no cost. You can apply any number of Apprentice properties to a masterwork weapon, or three Apprentice properties to a masterwork suit of armor, plus one Journeyman, one Master, and one Legendary property to each masterwork item; if you add a Master or Legendary property to an item, only you can use it. Using Active Crafting during a long rest you can make any nonmagical weapon or suit of armor masterwork for 50 gp in materials, add properties, or remove them. You cannot remove a property that is a prerequisite for another of the item's properties, and replacing a Journeyman-or-higher property with another of the same tier over the same long rest costs no additional materials. Whenever you modify a masterwork weapon's properties you can change its damage type to bludgeoning, piercing, or slashing if its damage was already one of those types. Properties that raise or lower damage move it one step along 1d4, 1d6, 1d8, 1d10, 1d12 or 2d6 (minimum 1d4), with further increases adding a +1 bonus; two-dice weapons use 2d4, 2d4+1, 2d6, 2d6+1, 2d8, 2d8+1, 2d10, 2d10+1, 2d12. Intelligence is the primary ability you use when crafting, and your masterwork save DC = 8 + your proficiency bonus + your Intelligence modifier. Apprentice weapon properties are ${APPRENTICE_WEAPON}. Apprentice armor properties are ${APPRENTICE_ARMOR}.` },
  { level: 2, name: 'Tool Belt', description: "You always have the right tool at hand. You can use your action to retrieve a piece of nonmagical gear worth up to 50 gp from your belt, apron, pack, cart, or wherever you keep your tools, even if you did not have it in your inventory before. You cannot use this feature to produce a weapon, suit of armor, shield, or potion. An item retrieved this way becomes lost in your inventory and vanishes when you take a long rest. You can use this ability a number of times equal to your Intelligence modifier and regain all expended uses when you finish a long rest." },
  { level: 3, name: "Artisans' Guild", description: "You join an Artisans' Guild, a formalized fellowship where craftsmen compare notes and schematics, acquire resources, and ply their trade. Select one of the Guilds - Arcane Maesters', Armigers', Bladeworkers', Calibarons', Forgeknights', Mechanauts', Thunderlords', or Trappers' - and gain its 3rd-level ability. You gain an additional Guild ability at 7th, 10th, 14th, and 18th level." },
  { level: 4, name: 'Ability Score Improvement', description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you cannot increase an ability score above 20 using this feature.' },
  { level: 5, name: 'Extra Attack', description: 'You can attack twice, instead of once, whenever you take the Attack action on your turn.' },
  { level: 5, name: 'Masterwork (Journeyman properties)', description: `You unlock Journeyman masterwork properties, which cost 100 gp to apply, and you can apply one of them to a masterwork item at no cost. You can apply only one Journeyman property to an item at a time, and cannot apply one to an item that already has one. Journeyman weapon properties are ${JOURNEYMAN_WEAPON}. Journeyman armor properties are ${JOURNEYMAN_ARMOR}.` },
  { level: 6, name: 'Folded Steel', description: 'You discover or create new processes for making your masterwork gear even stronger than before. Masterwork weapons crafted or modified by you count as magical for the purposes of overcoming damage resistance and immunity.' },
  { level: 7, name: "Artisans' Guild Feature (7th Level)", description: "You gain the 7th-level ability of your Artisans' Guild." },
  { level: 8, name: 'Ability Score Improvement (8th Level)', description: 'You can increase one ability score of your choice by 2, or two ability scores of your choice by 1, to a maximum of 20.' },
  { level: 9, name: 'Eye for Quality', description: 'You can cast the spell identify at will, without using a spell slot or spell components. Additionally, when you cast the spell you also appraise the target item, learning its market value in gold pieces.' },
  { level: 10, name: "Artisans' Guild Feature (10th Level)", description: "You gain the 10th-level ability of your Artisans' Guild." },
  { level: 11, name: 'Masterwork (Master properties)', description: `You unlock Master masterwork properties, which cost 250 gp to apply, and you can apply one of them to a masterwork item at no cost. You can apply only one Master property to an item at a time, and an item bearing one can be used only by you. Master weapon properties are ${MASTER_WEAPON}. Master armor properties are ${MASTER_ARMOR}.` },
  { level: 12, name: 'Ability Score Improvement (12th Level)', description: 'You can increase one ability score of your choice by 2, or two ability scores of your choice by 1, to a maximum of 20.' },
  { level: 13, name: 'Flawless Construction', description: 'Masterwork items you create do not rust, pit, fray at the edges, or otherwise show signs of aging. Additionally, they have resistance to all damage. An effect which would destroy an item you have created only does so if it could destroy a magic item.' },
  { level: 14, name: "Artisans' Guild Feature (14th Level)", description: "You gain the 14th-level ability of your Artisans' Guild." },
  { level: 15, name: 'Uncanny Tool Belt', description: 'You have a knack for finding the most useful things buried away in your cart. You can produce a single common or uncommon magic item from your tool belt. The item becomes lost in your inventory and vanishes when you finish a long rest. Once you use this ability, you cannot use it again until you finish a long rest.' },
  { level: 16, name: 'Ability Score Improvement (16th Level)', description: 'You can increase one ability score of your choice by 2, or two ability scores of your choice by 1, to a maximum of 20.' },
  { level: 17, name: 'Masterwork (Legendary properties)', description: `You unlock Legendary masterwork properties, which cost 400 gp to apply, and you can apply one of them to a masterwork item at no cost. You can apply only one Legendary property to an item at a time, and an item bearing one can be used only by you. Legendary weapon properties are ${LEGENDARY_WEAPON}. Legendary armor properties are ${LEGENDARY_ARMOR}.` },
  { level: 18, name: "Artisans' Guild Feature (18th Level)", description: "You gain the 18th-level ability of your Artisans' Guild." },
  { level: 19, name: 'Ability Score Improvement (19th Level)', description: 'You can increase one ability score of your choice by 2, or two ability scores of your choice by 1, to a maximum of 20.' },
  { level: 20, name: 'Magnum Opus', description: 'You complete an object of unparalleled majesty. You work feverishly for a period of 30 days to create a single magic item of very rare or legendary rarity. This item is tied to your very soul: regardless of type, you are always considered attuned to it, and no other creature can attune to it while you are alive. It does not count against your maximum number of attuned items, and you ignore all attunement requirements for it. As long as you are on the same plane of existence as your item, you can call it to your hand or onto your body, as appropriate. You can only craft a Magnum Opus once.' },
]

// [level, proficiency bonus, Active Crafting, feature names] - transcribed from the Craftsman table.
const progressionRows: Array<[number, number, string, string[]]> = [
  [1, 2, '25 gp', ['Exotic Proficiencies', 'Active Crafting']],
  [2, 2, '25 gp', ['Masterwork (Apprentice properties)', 'Tool Belt']],
  [3, 2, '50 gp', ["Artisans' Guild"]],
  [4, 2, '75 gp', ['Ability Score Improvement']],
  [5, 3, '100 gp', ['Extra Attack', 'Masterwork (Journeyman properties)']],
  [6, 3, '125 gp', ['Folded Steel']],
  [7, 3, '150 gp', ["Artisans' Guild feature"]],
  [8, 3, '175 gp', ['Ability Score Improvement']],
  [9, 4, '200 gp', ['Eye for Quality']],
  [10, 4, '225 gp', ["Artisans' Guild feature"]],
  [11, 4, '250 gp', ['Masterwork (Master properties)']],
  [12, 4, '275 gp', ['Ability Score Improvement']],
  [13, 5, '300 gp', ['Flawless Construction']],
  [14, 5, '325 gp', ["Artisans' Guild feature"]],
  [15, 5, '350 gp', ['Uncanny Tool Belt']],
  [16, 5, '375 gp', ['Ability Score Improvement']],
  [17, 6, '400 gp', ['Masterwork (Legendary properties)']],
  [18, 6, '425 gp', ["Artisans' Guild feature"]],
  [19, 6, '450 gp', ['Ability Score Improvement']],
  [20, 6, '500 gp', ['Magnum Opus']],
]
const progression = progressionRows.map(([level, proficiencyBonus, activeCrafting, featureNames]) => ({
  _type: 'classProgressionRow', _key: `craftsman-level-${level}`, level, proficiencyBonus,
  resources: [{ _type: 'object', _key: 'active-crafting', name: 'Active Crafting', value: activeCrafting }],
  featureNames,
}))

type Guild = { name: string; slug: string; description: string; features: FeatureSeed[] }
const guilds: Record<string, Guild> = {
  'subclass-arcane-maesters-guild': { name: "Arcane Maesters' Guild", slug: 'arcane-maesters-guild', description: 'Artisans who seek to become true masters of magic item creation, laden with rings, wands, and relics of their own forging.', features: [
    { level: 3, name: 'Magic Item Crafting', description: 'You unlock the secrets of crafting items infused with magical energy. The Magic Item Crafting sidebar details the magic items you can create, the level you must have in this class to create each, and the cost in materials it requires; you can craft one by spending multiple days working on it, as per the Active Crafting feature. From among those you can craft at 3rd level, you can craft 5 magic items. You can craft 3 from among those you can craft at 7th, 3 from among those at 10th, and 2 from among those you can craft at 14th. In the process of creating a new magic item, you can dismantle a magic item you have created in order to build a new one from the same category.' },
    { level: 3, name: 'Apprentice Property: Enchanted', description: "You learn to apply the following masterwork property to your equipment. Enchanted (Apprentice weapon property; components: masterwork weapon): this weapon is interwoven with strong magical enchantments. You use your Intelligence, instead of Strength or Dexterity, for this weapon's attack and damage rolls." },
    { level: 7, name: 'Instant Attunement', description: 'Your experience in creating magic items allows you to quickly bond with them. You can use your action to attune to a magic item, and can end an attunement to an item as part of the action. You can use this ability a number of times equal to your Intelligence modifier, and regain all expended uses when you finish a short or long rest.' },
    { level: 10, name: 'Ephemeral Enchantment', description: 'You can spend 10 minutes to lay an enchantment on a nonmagical weapon, enchanting up to 6 during a short or long rest. For the next 8 hours, this weapon counts as magical for the purposes of overcoming damage resistance and immunity.' },
    { level: 14, name: 'Sever Connection', description: 'You can break the connection that binds you to your magic items and repurpose that magic to protect yourself. As a reaction when a creature you can see makes an attack against you or when you make a saving throw, you can end your attunement to one magic item. Until the start of your next turn, you gain a bonus to your Armor Class and saving throws equal to your Intelligence modifier. The total number of magic items you can attune to is reduced by 1 until you finish a short or long rest. Once you use this ability, you cannot use it again until you finish a short or long rest.' },
    { level: 18, name: 'Legendary Property: Resonant', description: "You reach the peak of your craft, learning a Legendary masterwork property you can immediately apply to a suit of masterwork armor. Resonant (Legendary armor property; components: suit of exotic masterwork armor): by spending a short rest focusing on a magic item while wearing this armor, you can attune the item directly to the armor and use it as though you were attuned to it while you are wearing the armor. You can attune up to two items to the armor, and can end an item's attunement to the armor by spending another short rest focused on the item." },
  ] },
  'subclass-armigers-guild': { name: "Armigers' Guild", slug: 'armigers-guild', description: 'Armor smiths who hold that the right plate in the right place can make a warrior invincible.', features: [
    { level: 3, name: 'Fighting Style', description: 'You not only learn to forge powerful armor, but can wear it with skill. Choose Defense (while you are wearing armor, you gain a +1 bonus to AC) or Protection (when a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll; you must be wielding a shield). You cannot take a Fighting Style option more than once, even if you later get to choose again.' },
    { level: 7, name: 'Shining Steel', description: 'Your imposing, shining armor makes you a clear target for your foes. When you roll initiative and are not surprised, you can challenge any creature within 60 feet that can see you to battle. Each affected creature must make a Wisdom save against your masterwork save DC or have disadvantage on any attack roll that does not target you on the first round of combat. A creature with Intelligence 3 or less automatically succeeds on this saving throw.' },
    { level: 10, name: 'Armor Reinforcement', description: 'You can spend 10 minutes to reinforce a suit of armor, or reinforce up to 6 during a short or long rest. Armor retains its reinforcement until the creature wearing it is hit, after which it is no longer fortified. Reinforced armor gains one of the following properties of your choice: Adamant (when a creature wearing this armor takes damage, it reduces the amount it takes by 1d8) or Banded (a creature wearing this armor has a +1 bonus to Armor Class).' },
    { level: 14, name: 'Fortify', description: 'As a bonus action, you can gain resistance to all damage until the end of your next turn. Once you use this ability, you cannot use it again until you finish a short or long rest.' },
    { level: 18, name: 'Legendary Property: Invincible', description: 'You reach the peak of your craft, learning a Legendary masterwork property you can immediately apply to a suit of masterwork armor. Invincible (Legendary armor property; components: suit of exotic masterwork armor): while you are wearing this armor, bludgeoning, piercing, and slashing damage that you take from nonmagical weapons is reduced by 5.' },
  ] },
  'subclass-bladeworkers-guild': { name: "Bladeworkers' Guild", slug: 'bladeworkers-guild', description: 'Weaponsmiths who believe the right blade in the right hand can make a warrior unstoppable.', features: [
    { level: 3, name: 'Fighting Style', description: 'You not only forge great weapons, you fight with them as well. Choose Dueling (when wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon), Great Weapon Fighting (when you roll a 1 or 2 on a damage die for an attack with a melee weapon you are wielding with two hands, you can reroll the die and must use the new roll; the weapon must have the Two-Handed or Versatile property), Hand-and-a-Half (while wielding a versatile weapon in two hands, you gain a +1 bonus to attack and damage rolls with it), or Two-Weapon Fighting (when you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack). You cannot take a Fighting Style option more than once.' },
    { level: 7, name: 'Sabotaging Strike', description: 'You can use your knowledge of armament construction to disarm your foes and crush their armor. Once on each of your turns when you take the Attack action, you can replace one of your attacks with one of the following special melee attacks. Disarm: the target makes a Strength saving throw against your masterwork save DC; on a failure it drops an item of your choice that it is holding or carrying, and the object lands at its feet. Sunder: a target within your reach that is wearing armor or carrying a shield must make a Dexterity saving throw against your masterwork save DC; on a failure, its armor or shield takes a permanent and cumulative -1 penalty to the AC it offers. Armor reduced to an AC of 10 or a shield that drops to a +0 bonus is destroyed; damaged but undestroyed armor or shields can be repaired over the course of a short or long rest.' },
    { level: 10, name: 'Honed Weapons', description: 'You can spend 10 minutes to fortify a weapon, or fortify up to 6 during a short or long rest. A weapon retains its fortification until it hits a target. A fortified weapon gains one of the following properties of your choice: Honed (this weapon has a +2 bonus on attack rolls) or Sharpened (this weapon deals an additional 1d8 damage on a hit).' },
    { level: 14, name: 'Versatile Weapon Master', description: 'You can wield all manner of weapons in rapid succession. Once on each of your turns when you attack with a weapon you have drawn on the same turn, you can gain advantage on the attack roll. You cannot use this ability with a weapon if you have disadvantage, cannot see the target, or have used this ability with that weapon within the last minute. You can use this ability once each with a ranged weapon, a two-handed melee weapon, a one-handed melee weapon, and a thrown weapon.' },
    { level: 18, name: 'Legendary Property: Devastating', description: 'You reach the peak of your craft, learning a Legendary masterwork property you can immediately apply to a masterwork weapon. Devastating (Legendary weapon property; components: masterwork exotic weapon): this weapon scores a critical hit on a roll of 18, 19, or 20.' },
  ] },
  'subclass-calibarons-guild': { name: "Calibarons' Guild", slug: 'calibarons-guild', description: 'Gunsmiths who hold that gunpowder is the greatest invention of mortals - the tool that lets a common man put a dragon in its place.', features: [
    { level: 3, name: 'Fighting Style', description: "You adopt a particular style of gunfighting as your specialty. Choose Akimbo (when you engage in two-weapon fighting with firearms, you do not take a penalty to the damage of the second attack), Bullseye (+2 bonus to ranged attack rolls with firearms; the weapon must have the Sighted property or a normal range of 80 feet or longer, and this does not stack with the Archery fighting style), Duelist (while wielding a firearm in one hand and nothing in the other, if a ranged weapon attack exceeds the target's AC by 5 or more you deal an additional die of weapon damage, once per round), or Shotgunner (when you hit with a ranged weapon attack using a firearm that has the Scatter property, you can reroll the lowest damage die and must use the new roll, even if it is worse). You cannot take a Fighting Style option more than once." },
    { level: 7, name: 'Apprentice Property: Suppressor', description: 'You can add the following special property to your firearms. Suppressor (Apprentice weapon property; components: martial masterwork ranged weapon with the Firearm property): attacks with this weapon make only a low thud or a quiet clink, audible out to 10 feet, and release a puff of smoke to mask the light given off by the blast.' },
    { level: 10, name: 'Ballistic Calibration', description: 'You can spend 10 minutes to calibrate and reinforce a ranged weapon, or calibrate up to 6 during a short or long rest. A weapon retains its calibration until it hits a target. A calibrated ranged weapon gains one of the following properties of your choice: Ballistic (this weapon deals an additional die of damage on a hit) or Calibrated (this weapon deals a critical hit on a roll of 18-20).' },
    { level: 14, name: 'Underbarrel Grenade Launcher', description: 'You construct the ultimate firearm attachment: an underbarrel grenade launcher. You can use your action to attach it to a two-handed ranged weapon with the Firearm property or remove it from one. If the launcher is ever lost or stolen, you can construct a new one over the course of a long rest with 100 gp in materials. You can use your action to fire the launcher at a point you can see within 60 feet; each creature in a 10-foot radius sphere centered on that point must make a Dexterity saving throw against your masterwork save DC, taking 8d6 fire damage, or half as much on a successful save. Once you fire the launcher, you cannot do so again until you finish a short or long rest.' },
    { level: 18, name: 'Legendary Property: Burst Fire', description: 'You reach the peak of your craft, learning a Legendary masterwork property you can immediately apply to a masterwork weapon. Burst Fire (Legendary weapon property; components: masterwork exotic firearm with the Automatic property): when you take the Attack action to make an attack with this firearm, you can use your bonus action to make a single additional attack with it.' },
  ] },
  'subclass-forgeknights-guild': { name: "Forgeknights' Guild", slug: 'forgeknights-guild', description: 'Smiths who treat the heat of the forge as a weapon, storing it in their armor and building it up in their weapons before unleashing it in a scorching blast.', features: [
    { level: 3, name: 'Portable Forge', description: 'You construct a portable forge which allows you to heat objects you are forging without a specially-constructed shop or foundry. If your forge is ever lost or damaged, you can repair or replace it over the course of a long rest with 100 gp of materials. While you are carrying your forge, weapons you wield can deal fire damage instead of their normal damage type, you have resistance to fire damage, and you can cast the cantrips mending and produce flame, using Intelligence as your spellcasting ability for each.' },
    { level: 7, name: 'Forgefired Armory', description: 'You can add the Explosive and Heat properties to your melee weapons. When you hit a target with an explosive melee weapon, it creates an explosion at the point of impact, as per the Explosive property, which does not harm you or the weapon.' },
    { level: 10, name: 'Superheated Weapons', description: 'You can plunge melee weapons or pieces of ammunition into an active forge or your own forge, heating them to white-hot temperatures. Weapons and ammunition placed in the forge must be made of metal, and remain heated for 10 minutes. You can heat one weapon or 2 pieces of ammunition as an action, or up to 10 weapons or 20 pieces of ammunition over the course of a minute. A heated weapon or piece of ammunition deals fire damage instead of its normal type and ignites flammable objects it hits that are not being worn or carried. The first time a heated weapon or piece of ammunition hits a target, it deals an additional 1d6 fire damage.' },
    { level: 14, name: 'Fire Burst', description: 'You can release the heat of your portable forge in a colossal burst, casting the spell fireball without using a spell slot or material components, centered on yourself, using your masterwork save DC. You take no damage from this spell. Once you use this ability, you cannot use it again until you finish a short or long rest.' },
    { level: 18, name: 'Legendary Property: Forge Plate', description: 'You reach the peak of your craft, learning a Legendary masterwork property you can immediately apply to a suit of masterwork armor. Forge Plate (Legendary armor property; components: suit of exotic masterwork heavy armor): you build a miniature furnace into this armor, along with layers of heat dispersing materials. While wearing it you have immunity to fire damage. Additionally, as an action you can take the Dash action and cast the spell wall of fire without using a spell slot or spell components. The wall appears at the end of your turn and, instead of forming a straight or ringed wall, follows the path along the ground over which you moved on your turn, up to a distance of 60 feet. Once you use this ability, you cannot use it again until you finish a short or long rest.' },
  ] },
  'subclass-mechanauts-guild': { name: "Mechanauts' Guild", slug: 'mechanauts-guild', description: 'Engineers who build a walking tank - a customizable successor to the apparatus of the crab, with savage fists, scuttling legs, and climate control.', features: [
    { level: 3, name: "Mechanaut's Apparatus", description: "You complete the frame of a Mechanaut's Apparatus, with ample room for upgrades and improvements. Its blueprints are based on the apparatus of the crab, but you can model it to appear as any beast or as a humanoid figure. Its statistics are given in the Mechanaut's Apparatus stat block: its Armor Class is based on your Intelligence modifier and its hit points on your craftsman level. It comes with two installed masterwork melee weapons, which you can modify with masterwork properties or replace with different melee weapons when you finish a long rest; it is always proficient with its installed weapons and can use masterwork weapons with Master and Legendary properties. When the apparatus drops to 0 hit points it cannot move or act, but can be repaired: spending 1 minute restores its ability to move at half speed (lost again if it takes damage before being repaired), spending Hit Dice at the end of a short rest causes it to regain hit points as if it had taken a short rest, and finishing a long rest repairs it to full. You are always considered to have enough material to repair it; a lost apparatus can be rebuilt for 400 gp. A creature that is not wearing armor can use half its movement to enter or exit the apparatus. Only one Medium or Small creature can be inside at a time; while inside, a creature has total cover from effects originating outside it and takes half the damage the apparatus takes. The apparatus acts on your turn, though it does not take actions unless you are piloting it: any creature inside can command it to move (no action required), but only you can use your action to pilot it, commanding it to take the Attack, Dash, Disengage, or Dodge action. When you command it to Attack, it makes the same number of attacks you would make using the Attack action, using your Dexterity or Intelligence modifier (your choice) for its attack and damage rolls. While you are outside the apparatus you can command it to wait or follow you; while following, it moves on its turn to remain within 30 feet of you." },
    { level: 3, name: 'Cockpit Upgrade', description: 'You can customize your apparatus by upgrading its piloting compartment. Choose Comfortable Amenities (the interior is particularly cozy, and you can sleep within the apparatus without ill effect), Ejector Seat (an emergency ejection system, so exiting this apparatus costs no movement), or Loudspeaker (a system that magnifies your voice up to three times as loud as normal).' },
    { level: 7, name: 'Limb Upgrade', description: "You have redesigned your apparatus's legs to achieve better mobility. Choose Arachnotron Legs (the apparatus can move up, down, and across vertical surfaces and ceilings, and gains a climb speed equal to its movement speed), Heavy Suspension (its jump distance triples and it takes no damage from falling a distance of less than 100 feet), or Telescopic Frame (while no one is inside, you can use your bonus action to command it to collapse down to Medium size or return to Large size; while reduced it cannot be entered)." },
    { level: 10, name: 'Passenger Seat', description: 'You have installed a second seat inside the cockpit. A character cannot pilot the apparatus or command it to move from this second seat, but they do benefit from total cover from outside effects and take half the damage taken by the apparatus.' },
    { level: 14, name: 'Attachment Upgrade', description: 'You have installed an external attachment to your apparatus; once you use the installed upgrade, you must finish a short or long rest before using it again. Choose Abjuration Generator (a magical shield generator you activate as a bonus action, granting your apparatus temporary hit points equal to your craftsman level), Flak Cannon (a single-shot shrapnel cannon you fire at a creature you can see within 120 feet, which must make a Dexterity saving throw against your masterwork save DC, taking 6d6 slashing damage on a failed save or half as much on a success), or Rocket Engine (you can use your bonus action to light it, propelling you up to 30 feet in a straight line in any direction; a melee attack made immediately after this movement has advantage and, on a hit, knocks the target prone or pushes it up to 10 feet away from you, your choice).' },
    { level: 18, name: 'Legendary Property: Pneumatic', description: "You reach the peak of your craft, learning a Legendary masterwork property you can immediately apply to a masterwork weapon. Pneumatic (Legendary weapon property; components: masterwork exotic melee weapon): if this weapon is installed in a mechanaut's apparatus and deals more than one die of damage on a hit, then whenever you roll damage you can maximize one of the weapon's damage dice instead of rolling it." },
  ] },
  'subclass-thunderlords-guild': { name: "Thunderlords' Guild", slug: 'thunderlords-guild', description: 'Inventors who capture lightning in a bottle, drawing on a conduit-linked power cell to electrify their weapons and armor.', features: [
    { level: 3, name: 'Power Cell', description: 'You construct a lightning-generating power cell connected to a set of conduit gauntlets. If these are lost or damaged, you can replace them over the course of a long rest with 100 gp of materials. Your power cell gives you charge points equal to half your craftsman level, rounded up, and you regain all expended charge points when you finish a short or long rest. Once per turn when you hit a creature with an attack that deals lightning damage, you can spend 1 or more charge points, up to a maximum of your proficiency bonus, to choose one effect. Arc: choose a number of creatures within 15 feet of the creature you hit, up to the number of charge points expended, each of which makes a Dexterity saving throw against your masterwork save DC, taking lightning damage equal to 1d6 + your Intelligence modifier on a failure. Discharge: deal an additional 1d6 lightning damage to the target for each charge point expended. Jolt: the creature you hit cannot take reactions until the start of your next turn.' },
    { level: 3, name: 'Shock', description: 'While you are carrying your power cell and it has at least 1 unspent charge point, weapons you wield can deal lightning damage instead of their normal damage type, and you know the cantrips shocking grasp and spare the dying, using Intelligence as your spellcasting modifier for these spells.' },
    { level: 7, name: 'Lightning Rod', description: 'While you are carrying your power cell, you gain resistance to lightning damage. Additionally, whenever you take lightning damage from a hostile creature while wearing your gauntlets, you can use your reaction to regain 2 expended charge points.' },
    { level: 10, name: 'Static Charge', description: 'You can spend 10 minutes to store an electric charge in a weapon or suit of armor, or store up to 6 charges in different weapons and suits of armor during a short or long rest. Unexpended charges dissipate after 1 hour. Charged Armor: when you take damage from a melee attack, you can use your reaction to expend the charge, dealing 1d8 lightning damage to the creature that struck you. Charged Weapon: when you hit a creature with an attack using this weapon, you can expend the charge to deal an additional 1d6 lightning damage to the target.' },
    { level: 14, name: 'High Voltage', description: 'While carrying your power cell, you can spend 5 charge points to cast the spell lightning bolt without using a spell slot or material components. This spell uses your masterwork save DC.' },
    { level: 18, name: 'Legendary Property: Electroshock', description: "You reach the peak of your craft, learning a Legendary masterwork property you can immediately apply to a masterwork weapon. Electroshock (Legendary weapon property; components: masterwork exotic weapon): when you hit a creature with this weapon, you can expend the weapon's built-in power cell to shock the target, which must make a Constitution saving throw against your masterwork save DC. On a failed save, the target is stunned until the end of your next turn. Once you use this property, you cannot use it again with this weapon until you finish a short or long rest." },
  ] },
  'subclass-trappers-guild': { name: "Trappers' Guild", slug: 'trappers-guild', description: 'Trapsmiths who blanket a room with lethal clockwork implements and let their designs do the dirty work.', features: [
    { level: 3, name: 'Danger Sense', description: 'Your experience with traps gives you an edge when escaping danger. You have advantage on Dexterity saving throws against effects that you can see, such as traps and spells. To gain this benefit, you cannot be blinded, deafened, or incapacitated.' },
    { level: 3, name: 'Traps', description: "You are an expert in designing ingenious and lethal traps, crafting traps designed for quick deployment. When you take the Attack action, you can forgo one or more of your attacks to deploy a trap. You can deploy a number of traps equal to your Intelligence modifier (minimum of 1), and regain all expended deployments when you finish a short or long rest. You can use an action to disarm and recover a trap that has not been triggered, which also restores one use of your trap deployments. Ballista Trap: loaded in an unoccupied space within 5 feet of you and aimed in a direction you choose, it triggers whenever a creature enters a 5-foot wide, 30-foot long line extending from its front, firing automatically with a ranged attack bonus equal to your Intelligence modifier + your proficiency bonus for 2d8 piercing damage on a hit. Man-Trap: affixed to an unoccupied 5-foot square within 5 feet of you; when a creature of Small size or larger moves within its area, the creature makes a Dexterity saving throw against your masterwork save DC, taking 2d8 slashing damage and being unable to move on a failure, or half damage and no trapping on a success. The trapped creature or another creature within 5 feet can use its action to make a Strength check against your masterwork save DC to free it; trapped creatures of Huge size and larger move normally, ripping the trap from its mounting. Razor Wire: deployed into up to four unoccupied, contiguous 5-foot squares within 10 feet of you, making each difficult terrain and dealing 2d4 piercing damage for every 5 feet a creature travels into or within the area; once deployed it cannot be recovered. Trigger Bomb: tossed to an unoccupied space within 30 feet; as a reaction when a creature moves within 5 feet of the bomb you can detonate it in a 15-foot diameter sphere, with each creature in the area making a Dexterity saving throw against your masterwork save DC for 2d6 fire damage on a failure or half as much on a success, igniting flammable objects in the area that are not being worn or carried." },
    { level: 7, name: 'Booby Trap', description: 'You take 1 minute to conceal one of your traps from an unsuspecting target. A creature can detect a concealed trap by using its action to make an Intelligence (Investigation) or Wisdom (Perception) check against your masterwork save DC, or by having a passive Perception score higher than that DC. The first time this trap activates, it deals twice as many damage dice.' },
    { level: 10, name: 'Ambush Modification', description: 'You can spend 10 minutes to modify a ranged weapon, or modify up to 6 ranged weapons during a short or long rest, each of which gains the Hair-Trigger property: this weapon has advantage on the first attack it makes using the Readied action.' },
    { level: 14, name: 'Rapid Setup', description: 'As an action, you can deploy up to four traps. Once you use this ability, you cannot use it again until you finish a short or long rest.' },
    { level: 18, name: 'Legendary Property: Net', description: "You reach the peak of your craft, learning a Legendary masterwork property you can immediately apply to a masterwork weapon. Net (Legendary weapon property; components: masterwork exotic ranged weapon that does not have the Firearm property): when you hit a Large or smaller creature with this weapon's projectile, it also deploys a net which automatically hits the creature." },
  ] },
}

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
function featureDocument(owner: string, seed: FeatureSeed, index: number) {
  const id = `feature-${owner}-${seed.level}-${slugify(seed.name)}`
  return { id, document: {
    _id: id, _type: 'feature', name: seed.name,
    slug: { _type: 'slug', current: `${owner}-${seed.level}-${slugify(seed.name)}`.slice(0, 96) },
    acquiredAtLevel: seed.level, description: seed.description, rulesets: RULESETS, isHomebrew: false,
    versionNotes: 'Transcribed from the Valda’s Spire Craftsman PDF supplied by the archive owner.',
  }, reference: ref(id, `${seed.level}-${slugify(seed.name)}-${index}`) }
}

const GUILD_IDS = Object.keys(guilds)
const NEW_GUILD_ID = 'subclass-arcane-maesters-guild'

async function run() {
  const current = await client.fetch<any>(`*[_id == "class-craftsman"][0]{source, sourceBook, isHomebrew, "subclassIds": subclasses[]._ref}`)
  if (!current || current.source !== 'Unofficial' || current.sourceBook !== "Valda's Spire of Secrets" || current.isHomebrew) {
    throw new Error(`Refusing to merge into an unexpected Craftsman record: ${JSON.stringify(current)}`)
  }
  const unexpected = (current.subclassIds ?? []).filter((id: string) => !GUILD_IDS.includes(id))
  if (unexpected.length) throw new Error(`Craftsman has unexpected subclasses: ${unexpected.join(', ')}`)

  const priorRefs: string[] = await client.fetch(
    `array::unique(coalesce(*[_id == "class-craftsman"][0].features[]._ref, []) + coalesce(*[_id in $ids].features[]._ref, []))`,
    { ids: GUILD_IDS },
  )
  const ownedIds: string[] = await client.fetch(`*[_type == "feature" && _id match "feature-craftsman-*"]._id`)
  const ownerPrefixes = ['feature-craftsman-', 'feature-class-craftsman-']
  const candidates = new Set<string>([
    ...(priorRefs ?? []),
    ...(ownedIds ?? []).filter((id) => ownerPrefixes.some((p) => id.startsWith(p))),
  ])

  let tx = client.transaction()
  const newIds = new Set<string>()

  const classRefs = coreFeatures.map((seed, index) => {
    const result = featureDocument('craftsman', seed, index)
    newIds.add(result.id)
    tx = tx.createOrReplace(result.document as any)
    return result.reference
  })

  for (const [subclassId, guild] of Object.entries(guilds)) {
    const owner = subclassId.replace(/^subclass-/, '')
    const featureRefs = guild.features.map((seed, index) => {
      const result = featureDocument(owner, seed, index)
      newIds.add(result.id)
      tx = tx.createOrReplace(result.document as any)
      return result.reference
    })
    const document = {
      name: guild.name, slug: { _type: 'slug', current: guild.slug },
      parentClassId: 'craftsman', parentClass: ref('class-craftsman', 'craftsman'),
      description: guild.description, features: featureRefs,
      source: 'Unofficial', sourceBook: "Valda's Spire of Secrets", edition: 'Both',
      rulesets: RULESETS, isHomebrew: false,
      versionNotes: 'Placeholder mechanics replaced with the authentic Artisans’ Guild progression from the Craftsman PDF supplied by the archive owner.',
    }
    tx = subclassId === NEW_GUILD_ID
      ? tx.createOrReplace({ _id: subclassId, _type: 'subclass', version: 1, isSpellcaster: false, ...document } as any)
      : tx.patch(subclassId, (patch) => patch.set(document))
  }

  tx = tx.patch('class-craftsman', (patch) => patch.set({
    description: 'Craftsmen are virtuoso artisans and genius inventors who turn metallurgy, smelting, and construction into masterwork arms and armor. Rather than settling for fine equipment, they engineer exotic weapons and singular suits of armor, prototyping ingenious devices in the field and refining them into legendary works.',
    hitDie: 10, primaryAbility: ['STR', 'DEX', 'INT'], savingThrows: ['CON', 'INT'],
    proficiencies: [
      { _type: 'proficiencyRule', _key: 'craftsman-armor', type: 'armor', mode: 'fixed', armorOptions: ['Light Armor', 'Medium Armor', 'Heavy Armor', 'Shields'], description: 'All armor and shields, plus exotic armor from Exotic Proficiencies' },
      { _type: 'proficiencyRule', _key: 'craftsman-weapons', type: 'weapon', mode: 'fixed', weaponOptions: ['Simple Weapons', 'Martial Weapons'], description: 'Simple and martial weapons, plus exotic weapons from Exotic Proficiencies' },
      { _type: 'proficiencyRule', _key: 'craftsman-tools', type: 'tool', mode: 'fixed', description: "All artisan's tools (covered by a single set of craftsman's tools)", toolOptions: [
        "Alchemist's supplies", "Brewer's supplies", "Calligrapher's supplies", "Carpenter's tools",
        "Cartographer's tools", "Cobbler's tools", "Cook's utensils", "Glassblower's tools",
        "Jeweler's tools", "Leatherworker's tools", "Mason's tools", "Painter's supplies",
        "Potter's tools", "Smith's tools", "Tinker's tools", "Weaver's tools", "Woodcarver's tools",
      ] },
      { _type: 'proficiencyRule', _key: 'craftsman-skills', type: 'skill', mode: 'choice', count: 2, skillOptions: ['Arcana', 'Athletics', 'History', 'Investigation', 'Medicine', 'Perception', 'Persuasion'] },
    ],
    isSpellcaster: false, spellcaster: 'none', features: classRefs, progression, subclassLevel: 3,
    subclasses: Object.entries(guilds).map(([id, guild]) => ref(id, guild.slug)),
    startingEquipment: [
      "A set of craftsman's tools",
      'A shield and chain mail, leather armor, or scale mail',
      'A dagger and a warhammer or any simple weapon',
      'A light crossbow and 20 bolts or a shortbow and 20 arrows',
      "A dungeoneer's pack",
    ],
    source: 'Unofficial', sourceBook: "Valda's Spire of Secrets", edition: 'Both', rulesets: RULESETS, isHomebrew: false,
    versionNotes: 'Rebuilt from the Valda’s Spire Craftsman PDF: full chassis, all 20 levels of class features, the masterwork property catalogue by tier, the Active Crafting table, and authentic tracks for all eight Artisans’ Guilds (Arcane Maesters’ Guild added).',
  }).unset(['spellcastingAbility', 'spellLists', 'spells']))

  const stale = [...candidates].filter((id) => !newIds.has(id)).sort()
  for (const id of stale) tx = tx.delete(id)

  const subclassFeatureCount = Object.values(guilds).reduce((sum, g) => sum + g.features.length, 0)
  if (!APPLY) {
    console.log(`Dry run: ${coreFeatures.length} class features, ${subclassFeatureCount} guild features across ${GUILD_IDS.length} guilds, ${progression.length} progression rows.`)
    console.log(`Would delete ${stale.length} superseded feature docs.`)
    return
  }

  const result = await tx.commit({ visibility: 'sync' })
  const audit = await client.fetch<any>(`*[_id == "class-craftsman"][0]{
    sourceBook, isHomebrew, isSpellcaster, hitDie, savingThrows, startingEquipment,
    "featureCount": count(features), "progressionCount": count(progression),
    "activeCrafting": progression[].resources[name == "Active Crafting"][0].value,
    "levels": progression[].level,
    "brokenRefs": count(features[!defined(@->._id)]) + count(subclasses[!defined(@->._id)]),
    "guilds": *[_id in $ids] | order(_id asc) {_id, name, sourceBook, isHomebrew, "featureCount": count(features), "levels": features[]->acquiredAtLevel, "brokenRefs": count(features[!defined(@->._id)])}
  }`, { ids: GUILD_IDS })

  const expectedCrafting = progressionRows.map((row) => row[2]).join(',')
  const problems: string[] = []
  if (audit.sourceBook !== "Valda's Spire of Secrets" || audit.isHomebrew || audit.isSpellcaster) problems.push('source/flags')
  if (audit.hitDie !== 10 || audit.savingThrows?.join(',') !== 'CON,INT') problems.push('hitDie/saves')
  if (audit.featureCount !== coreFeatures.length) problems.push(`featureCount=${audit.featureCount}`)
  if (audit.progressionCount !== 20 || audit.levels?.join(',') !== progressionRows.map((r) => r[0]).join(',')) problems.push('progression')
  if (audit.activeCrafting?.join(',') !== expectedCrafting) problems.push('activeCrafting')
  if (audit.startingEquipment?.length !== 5) problems.push('startingEquipment')
  if (audit.brokenRefs) problems.push(`brokenRefs=${audit.brokenRefs}`)
  if (audit.guilds?.length !== GUILD_IDS.length) problems.push(`guildCount=${audit.guilds?.length}`)
  for (const g of audit.guilds ?? []) {
    const expected = guilds[g._id]
    if (!expected) { problems.push(`unknown guild ${g._id}`); continue }
    if (g.featureCount !== expected.features.length) problems.push(`${g._id} features=${g.featureCount}`)
    if (g.brokenRefs) problems.push(`${g._id} brokenRefs`)
    if (g.sourceBook !== "Valda's Spire of Secrets" || g.isHomebrew) problems.push(`${g._id} source`)
    const wantLevels = expected.features.map((f) => f.level).sort((a, b) => a - b).join(',')
    if ([...(g.levels ?? [])].sort((a: number, b: number) => a - b).join(',') !== wantLevels) problems.push(`${g._id} levels`)
  }
  if (problems.length) throw new Error(`Craftsman audit failed: ${problems.join('; ')} :: ${JSON.stringify(audit)}`)
  console.log(`Applied ${result.results.length} mutations (deleted ${stale.length} superseded features). Verification OK.`)
  console.log(JSON.stringify((audit.guilds ?? []).map((g: any) => `${g.name}=${g.featureCount}`)))
}

run().catch((error) => { console.error(error); process.exit(1) })
