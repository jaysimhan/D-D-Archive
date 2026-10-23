/**
 * Magic items from the System Reference Document 5.2 (and 5.1 for the few it
 * dropped), CC-BY-4.0. Descriptions are condensed from the SRD rules text.
 * The Library merges these under the Archive's own item documents: a Sanity
 * item of the same name wins, and these fill in the rest.
 */
import type { ItemRarity, ItemType } from "../types/dnd-types";

export interface SrdMagicItem {
  name: string;
  type: ItemType;            // one of: "Weapon" | "Armor" | "Potion" | "Scroll" | "Wondrous Item" | "Ring" | "Rod" | "Staff" | "Wand"
  rarity: ItemRarity;        // "Common" | "Uncommon" | "Rare" | "Very Rare" | "Legendary" | "Artifact"
  /** true, or the restriction text e.g. "by a Wizard", "by a Cleric or Paladin". Omit when no attunement. */
  attunement?: true | string;
  /** "Any Sword", "Longsword", "Any Medium or Heavy Armor", "Shield", "Any Ammunition" … for weapon/armor items */
  baseItem?: string;
  magicBonus?: number;
  /** Variable rarity items: e.g. "Rarity varies: +1 uncommon, +2 rare, +3 very rare" — only when useful */
  note?: string;
  description: string;
}

export const SRD_MAGIC_ITEMS: SrdMagicItem[] = [
  // ───────────────────────────── Armor & Shields ─────────────────────────────
  {
    name: "Adamantine Armor",
    type: "Armor",
    rarity: "Uncommon",
    baseItem: "Any Medium or Heavy Armor (except Hide)",
    description:
      "This suit of armor is reinforced with adamantine, one of the hardest substances in existence. While you're wearing it, any Critical Hit against you becomes a normal hit.",
  },
  {
    name: "Animated Shield",
    type: "Armor",
    rarity: "Very Rare",
    attunement: true,
    baseItem: "Shield",
    description:
      "While holding this shield, you can take a Bonus Action to speak its command word and cause it to animate. The shield leaps into the air and hovers in your space to protect you as if you were wielding it, leaving your hands free. It stays animated for 1 minute, until you end the effect as a Bonus Action, or until you are Incapacitated or die, at which point it falls to the ground or into a free hand.",
  },
  {
    name: "Armor of Invulnerability",
    type: "Armor",
    rarity: "Legendary",
    attunement: true,
    baseItem: "Plate Armor",
    description:
      "You have Resistance to Bludgeoning, Piercing, and Slashing damage from nonmagical sources while you wear this armor. As an action you can make yourself Immune to that damage for 10 minutes or until you are no longer wearing the armor. Once this immunity is used, it can't be used again until the next dawn.",
  },
  {
    name: "Armor of Resistance",
    type: "Armor",
    rarity: "Rare",
    attunement: true,
    baseItem: "Any Light, Medium, or Heavy Armor",
    description:
      "You have Resistance to one type of damage while you wear this armor. The GM chooses the type or rolls a d10: Acid, Cold, Fire, Force, Lightning, Necrotic, Poison, Psychic, Radiant, or Thunder.",
  },
  {
    name: "Armor of Vulnerability",
    type: "Armor",
    rarity: "Rare",
    attunement: true,
    baseItem: "Plate Armor",
    description:
      "While wearing this armor, you have Resistance to one of Bludgeoning, Piercing, or Slashing damage (chosen by the GM or rolled). Curse: the armor also gives you Vulnerability to the other two of those damage types. You can't doff the armor or end your attunement to it unless you are targeted by Remove Curse or similar magic.",
  },
  {
    name: "Armor, +1",
    type: "Armor",
    rarity: "Rare",
    baseItem: "Any Light, Medium, or Heavy Armor",
    magicBonus: 1,
    description: "You have a +1 bonus to Armor Class while wearing this armor.",
  },
  {
    name: "Armor, +2",
    type: "Armor",
    rarity: "Very Rare",
    baseItem: "Any Light, Medium, or Heavy Armor",
    magicBonus: 2,
    description: "You have a +2 bonus to Armor Class while wearing this armor.",
  },
  {
    name: "Armor, +3",
    type: "Armor",
    rarity: "Legendary",
    baseItem: "Any Light, Medium, or Heavy Armor",
    magicBonus: 3,
    description: "You have a +3 bonus to Armor Class while wearing this armor.",
  },
  {
    name: "Arrow-Catching Shield",
    type: "Armor",
    rarity: "Rare",
    attunement: true,
    baseItem: "Shield",
    description:
      "You gain a +2 bonus to AC against ranged attacks while you wield this shield, in addition to the shield's normal bonus. Whenever an attacker makes a ranged attack against a target within 5 feet of you, you can take a Reaction to become the target of the attack instead.",
  },
  {
    name: "Demon Armor",
    type: "Armor",
    rarity: "Very Rare",
    attunement: true,
    baseItem: "Plate Armor",
    magicBonus: 1,
    description:
      "While wearing this armor, you gain a +1 bonus to AC and can understand and speak Abyssal. Its clawed gauntlets turn your Unarmed Strikes with your hands into magic weapons that deal 1d8 Slashing damage, with a +1 bonus to attack and damage rolls. Curse: you can't doff the armor unless targeted by Remove Curse or similar magic, and while wearing it you have Disadvantage on attack rolls against demons and on saving throws against their spells and special abilities.",
  },
  {
    name: "Dragon Scale Mail",
    type: "Armor",
    rarity: "Very Rare",
    attunement: true,
    baseItem: "Scale Mail",
    magicBonus: 1,
    description:
      "Made from the scales of one kind of dragon, this armor grants a +1 bonus to AC, Advantage on saving throws against the Frightful Presence and breath weapons of dragons, and Resistance to the damage type of the dragon that provided the scales. As an action you can discern the distance and direction to the closest dragon of that kind within 30 miles; this can't be used again until the next dawn.",
  },
  {
    name: "Dwarven Plate",
    type: "Armor",
    rarity: "Very Rare",
    baseItem: "Plate Armor",
    magicBonus: 2,
    description:
      "While wearing this armor, you gain a +2 bonus to AC. In addition, if an effect moves you against your will along the ground, you can take a Reaction to reduce the distance you are moved by up to 10 feet.",
  },
  {
    name: "Efreeti Chain",
    type: "Armor",
    rarity: "Legendary",
    attunement: true,
    baseItem: "Chain Mail",
    magicBonus: 3,
    description:
      "While wearing this armor, you gain a +3 bonus to AC, you are Immune to Fire damage, and you can understand and speak Primordial (Ignan). You can also stand on and walk across molten rock as if it were solid ground.",
  },
  {
    name: "Elven Chain",
    type: "Armor",
    rarity: "Rare",
    baseItem: "Chain Shirt",
    magicBonus: 1,
    description:
      "You gain a +1 bonus to AC while you wear this armor. You are considered proficient with this armor even if you lack proficiency with Medium armor.",
  },
  {
    name: "Glamoured Studded Leather",
    type: "Armor",
    rarity: "Rare",
    baseItem: "Studded Leather Armor",
    magicBonus: 1,
    description:
      "While wearing this armor, you gain a +1 bonus to AC. As a Bonus Action you can make the armor assume the appearance of a normal set of clothing or some other kind of armor, choosing its color, style, and accessories; it keeps its normal bulk and weight. The illusion lasts until you use this property again or remove the armor.",
  },
  {
    name: "Mariner's Armor",
    type: "Armor",
    rarity: "Uncommon",
    baseItem: "Any Light, Medium, or Heavy Armor",
    description:
      "Blue and green, this armor is decorated with fish and shell motifs. While wearing it, you have a Swim Speed equal to your Speed. In addition, whenever you start your turn underwater with 0 Hit Points, the armor causes you to rise 60 feet toward the surface.",
  },
  {
    name: "Mithral Armor",
    type: "Armor",
    rarity: "Uncommon",
    baseItem: "Any Medium or Heavy Armor (except Hide)",
    description:
      "Mithral is a light, flexible metal. If the armor normally imposes Disadvantage on Dexterity (Stealth) checks or has a Strength requirement, the mithral version of the armor doesn't.",
  },
  {
    name: "Plate Armor of Etherealness",
    type: "Armor",
    rarity: "Legendary",
    attunement: true,
    baseItem: "Plate Armor",
    description:
      "While you're wearing this armor, you can take an action to speak its command word and gain the effect of the Etherealness spell. The effect lasts for 10 minutes, until you remove the armor, or until you speak the command word again as an action. This property can't be used again until the next dawn.",
  },
  {
    name: "Shield of Missile Attraction",
    type: "Armor",
    rarity: "Rare",
    attunement: true,
    baseItem: "Shield",
    description:
      "While holding this shield, you have Resistance to damage from ranged weapon attacks. Curse: whenever a ranged weapon attack is made against a target within 10 feet of you, you become the target instead. You can't end your attunement to the shield unless you are targeted by Remove Curse or similar magic.",
  },
  {
    name: "Shield, +1",
    type: "Armor",
    rarity: "Uncommon",
    baseItem: "Shield",
    magicBonus: 1,
    description:
      "While holding this shield, you have a +1 bonus to Armor Class, in addition to the shield's normal bonus to AC.",
  },
  {
    name: "Shield, +2",
    type: "Armor",
    rarity: "Rare",
    baseItem: "Shield",
    magicBonus: 2,
    description:
      "While holding this shield, you have a +2 bonus to Armor Class, in addition to the shield's normal bonus to AC.",
  },
  {
    name: "Shield, +3",
    type: "Armor",
    rarity: "Very Rare",
    baseItem: "Shield",
    magicBonus: 3,
    description:
      "While holding this shield, you have a +3 bonus to Armor Class, in addition to the shield's normal bonus to AC.",
  },
  {
    name: "Spellguard Shield",
    type: "Armor",
    rarity: "Very Rare",
    attunement: true,
    baseItem: "Shield",
    description:
      "While holding this shield, you have Advantage on saving throws against spells and other magical effects, and spell attack rolls have Disadvantage against you.",
  },

  // ─────────────────────────── Weapons & Ammunition ──────────────────────────
  {
    name: "Ammunition, +1",
    type: "Weapon",
    rarity: "Uncommon",
    baseItem: "Any Ammunition",
    magicBonus: 1,
    description:
      "You have a +1 bonus to attack and damage rolls made with this piece of magic ammunition. Once it hits a target, the ammunition is no longer magical.",
  },
  {
    name: "Ammunition, +2",
    type: "Weapon",
    rarity: "Rare",
    baseItem: "Any Ammunition",
    magicBonus: 2,
    description:
      "You have a +2 bonus to attack and damage rolls made with this piece of magic ammunition. Once it hits a target, the ammunition is no longer magical.",
  },
  {
    name: "Ammunition, +3",
    type: "Weapon",
    rarity: "Very Rare",
    baseItem: "Any Ammunition",
    magicBonus: 3,
    description:
      "You have a +3 bonus to attack and damage rolls made with this piece of magic ammunition. Once it hits a target, the ammunition is no longer magical.",
  },
  {
    name: "Arrow of Slaying",
    type: "Weapon",
    rarity: "Very Rare",
    baseItem: "Any Ammunition",
    note: "Ammunition of Slaying in SRD 5.2 (any ammunition); Arrow of Slaying in SRD 5.1.",
    description:
      "This ammunition is keyed to one type, race, or group of creature, such as dragons, fiends, or elves. If a creature of that kind takes damage from it, the creature makes a DC 17 Constitution saving throw, taking an extra 6d10 Piercing damage on a failed save or half as much on a success. Once it deals its extra damage, the ammunition becomes nonmagical.",
  },
  {
    name: "Berserker Axe",
    type: "Weapon",
    rarity: "Rare",
    attunement: true,
    baseItem: "Any Axe",
    magicBonus: 1,
    description:
      "You gain a +1 bonus to attack and damage rolls made with this magic axe, and while attuned your Hit Point maximum increases by 1 for each level you have. Curse: you are unwilling to part with the axe and have Disadvantage on attack rolls with other weapons unless no foe is within 60 feet. Whenever a hostile creature damages you while you have the axe, you must succeed on a DC 15 Wisdom saving throw or go berserk, attacking the nearest creature with the axe each turn until you start a turn with no creatures within 60 feet that you can see or hear.",
  },
  {
    name: "Dagger of Venom",
    type: "Weapon",
    rarity: "Rare",
    baseItem: "Dagger",
    magicBonus: 1,
    description:
      "You gain a +1 bonus to attack and damage rolls made with this magic dagger. As an action you can coat the blade in thick black poison for 1 minute or until you hit with it. A creature hit by the poisoned blade must succeed on a DC 15 Constitution saving throw or take 2d10 Poison damage and have the Poisoned condition for 1 minute. This property can't be used again until the next dawn.",
  },
  {
    name: "Dancing Sword",
    type: "Weapon",
    rarity: "Very Rare",
    attunement: true,
    baseItem: "Any Sword",
    description:
      "As a Bonus Action you can toss this sword into the air and speak its command word, causing it to hover. While hovering, as a Bonus Action you can have it fly up to 30 feet and attack one creature within 5 feet of it, using your attack roll and ability modifier for damage. After the hovering sword attacks for the fourth time, it flies back up to 30 feet to return to your hand; if you have no free hand, it falls to the ground. The sword stops hovering if you grasp it or move more than 30 feet from it.",
  },
  {
    name: "Defender",
    type: "Weapon",
    rarity: "Legendary",
    attunement: true,
    baseItem: "Any Sword",
    magicBonus: 3,
    description:
      "You gain a +3 bonus to attack and damage rolls made with this magic weapon. The first time you attack with it on each of your turns, you can transfer some or all of the bonus to your Armor Class instead. The adjusted bonuses remain in effect until the start of your next turn, though you must hold the weapon to gain the AC bonus.",
  },
  {
    name: "Dragon Slayer",
    type: "Weapon",
    rarity: "Rare",
    baseItem: "Any Simple or Martial Weapon",
    magicBonus: 1,
    description:
      "You gain a +1 bonus to attack and damage rolls made with this magic weapon. When you hit a Dragon with it, the Dragon takes an extra 3d6 damage of the weapon's type.",
  },
  {
    name: "Dwarven Thrower",
    type: "Weapon",
    rarity: "Very Rare",
    attunement: "by a Dwarf or a creature attuned to a Belt of Dwarvenkind",
    baseItem: "Warhammer",
    magicBonus: 3,
    description:
      "You gain a +3 bonus to attack and damage rolls made with this magic weapon. It has the Thrown property with a normal range of 20 feet and a long range of 60 feet. When you hit with a ranged attack using it, it deals an extra 1d8 Bludgeoning damage, or 2d8 if the target is a Giant. Immediately after the attack, the weapon flies back to your hand.",
  },
  {
    name: "Flame Tongue",
    type: "Weapon",
    rarity: "Rare",
    attunement: true,
    baseItem: "Any Melee Weapon",
    description:
      "While holding this weapon, you can take a Bonus Action to speak its command word, causing flames to erupt from it. The flames shed Bright Light in a 40-foot radius and Dim Light for an additional 40 feet, and the weapon deals an extra 2d6 Fire damage on a hit. The flames last until you take a Bonus Action to speak the command word again or until you drop, stow, or sheathe the weapon.",
  },
  {
    name: "Frost Brand",
    type: "Weapon",
    rarity: "Very Rare",
    attunement: true,
    baseItem: "Any Sword",
    description:
      "When you hit with an attack using this magic sword, the target takes an extra 1d6 Cold damage, and while you hold the sword you have Resistance to Fire damage. In freezing temperatures the blade sheds Bright Light in a 10-foot radius and Dim Light for an additional 10 feet. When you draw the weapon, you can extinguish all nonmagical flames within 30 feet of you; this property can be used no more than once per hour.",
  },
  {
    name: "Giant Slayer",
    type: "Weapon",
    rarity: "Rare",
    baseItem: "Any Axe or Sword",
    magicBonus: 1,
    description:
      "You gain a +1 bonus to attack and damage rolls made with this magic weapon. When you hit a Giant with it, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.",
  },
  {
    name: "Hammer of Thunderbolts",
    type: "Weapon",
    rarity: "Legendary",
    attunement: "by a creature wearing a Belt of Giant Strength and Gauntlets of Ogre Power",
    baseItem: "Maul",
    magicBonus: 1,
    description:
      "You gain a +1 bonus to attack and damage rolls made with this magic maul. While attuned and holding it, your Strength increases by 4 (to a maximum of 30), and when you roll a 20 on an attack roll with it against a Giant, the Giant must succeed on a DC 17 Constitution saving throw or die. The hammer has 5 charges: expend 1 to hurl it (range 20/60 feet); on a hit it releases a thunderclap audible out to 300 feet, and the target and every creature within 30 feet of it must succeed on a DC 17 Constitution saving throw or be Stunned until the end of your next turn. It regains 1d4 + 1 expended charges daily at dawn.",
  },
  {
    name: "Holy Avenger",
    type: "Weapon",
    rarity: "Legendary",
    attunement: "by a Paladin",
    baseItem: "Any Sword",
    magicBonus: 3,
    description:
      "You gain a +3 bonus to attack and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage. While you hold the drawn sword, it creates an aura in a 10-foot Emanation around you (30 feet if you are a level 17+ Paladin); you and all creatures friendly to you in the aura have Advantage on saving throws against spells and other magical effects.",
  },
  {
    name: "Javelin of Lightning",
    type: "Weapon",
    rarity: "Uncommon",
    baseItem: "Javelin",
    description:
      "When you hurl this javelin and speak its command word, it becomes a bolt of lightning, forming a 5-foot-wide Line from you to a target within 120 feet. Each creature in the line other than you and the target makes a DC 13 Dexterity saving throw, taking 4d6 Lightning damage on a failed save or half as much on a success. The javelin then becomes a javelin again; make a ranged attack against the target, which on a hit takes the javelin's damage plus 4d6 Lightning damage. This property can't be used again until the next dawn.",
  },
  {
    name: "Luck Blade",
    type: "Weapon",
    rarity: "Legendary",
    attunement: true,
    baseItem: "Any Sword",
    magicBonus: 1,
    description:
      "You gain a +1 bonus to attack and damage rolls made with this magic weapon, and while it is on your person you gain a +1 bonus to saving throws. Luck: once per dawn, while it is on your person, you can call on its luck to reroll one attack roll, ability check, or saving throw you dislike, and you must use the second roll. Wish: the sword has 1d4 - 1 charges; while holding it you can expend 1 charge to cast Wish from it. The sword doesn't regain charges.",
  },
  {
    name: "Mace of Disruption",
    type: "Weapon",
    rarity: "Rare",
    attunement: true,
    baseItem: "Mace",
    description:
      "When you hit a Fiend or an Undead with this magic weapon, that creature takes an extra 2d6 Radiant damage. If the target has 25 Hit Points or fewer after taking this damage, it must succeed on a DC 15 Wisdom saving throw or be destroyed; on a success it has the Frightened condition until the end of your next turn. While you hold the weapon, it sheds Bright Light in a 20-foot radius and Dim Light for an additional 20 feet.",
  },
  {
    name: "Mace of Smiting",
    type: "Weapon",
    rarity: "Rare",
    baseItem: "Mace",
    magicBonus: 1,
    description:
      "You gain a +1 bonus to attack and damage rolls made with this magic weapon; the bonus increases to +3 against Constructs. When you roll a 20 on an attack roll with it, the target takes an extra 2d6 Bludgeoning damage, or 4d6 if it is a Construct. If a Construct has 25 Hit Points or fewer after taking this damage, it is destroyed.",
  },
  {
    name: "Mace of Terror",
    type: "Weapon",
    rarity: "Rare",
    attunement: true,
    baseItem: "Mace",
    description:
      "This magic weapon has 3 charges. While holding it, you can take an action and expend 1 charge to release a wave of terror: each creature of your choice within 30 feet of you must succeed on a DC 15 Wisdom saving throw or have the Frightened condition for 1 minute. A frightened creature spends its turns moving as far from you as it can, can't take Reactions, and can only Dash or try to escape; it repeats the save at the end of each of its turns. The mace regains 1d3 expended charges daily at dawn.",
  },
  {
    name: "Nine Lives Stealer",
    type: "Weapon",
    rarity: "Very Rare",
    attunement: true,
    baseItem: "Any Sword",
    magicBonus: 2,
    description:
      "You gain a +2 bonus to attack and damage rolls made with this magic weapon. It has 1d8 + 1 charges. When you score a Critical Hit against a creature that has fewer than 100 Hit Points, it must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears out its life force (Constructs and Undead are immune), expending 1 charge. When it has no charges left, it loses this property but remains a +2 weapon.",
  },
  {
    name: "Oathbow",
    type: "Weapon",
    rarity: "Very Rare",
    attunement: true,
    baseItem: "Longbow",
    description:
      "When you make a ranged attack with this bow, you can speak its command phrase to make the target your sworn enemy until it dies or until dawn seven days later; you can have only one sworn enemy at a time. Your ranged attack rolls with the bow against your sworn enemy have Advantage, ignore cover other than Total Cover, and suffer no Disadvantage from long range, and a hit deals an extra 3d6 Piercing damage. While your sworn enemy lives, you have Disadvantage on attack rolls with all other weapons.",
  },
  {
    name: "Scimitar of Speed",
    type: "Weapon",
    rarity: "Very Rare",
    attunement: true,
    baseItem: "Scimitar",
    magicBonus: 2,
    description:
      "You gain a +2 bonus to attack and damage rolls made with this magic weapon. In addition, you can make one attack with it as a Bonus Action on each of your turns.",
  },
  {
    name: "Sun Blade",
    type: "Weapon",
    rarity: "Rare",
    attunement: true,
    baseItem: "Longsword",
    magicBonus: 2,
    description:
      "This item appears to be a sword hilt. As a Bonus Action you can make a blade of pure radiance spring from it or vanish. While the blade exists, the weapon has the Finesse property, you are proficient with it if you are proficient with Shortswords or Longswords, and you gain a +2 bonus to attack and damage rolls; it deals Radiant damage instead of Slashing, and an extra 1d8 Radiant damage to Undead. The blade sheds sunlight as Bright Light in a 15-foot radius and Dim Light for an additional 15 feet; as an action you can expand or reduce each radius by 5 feet (10 to 30 feet).",
  },
  {
    name: "Sword of Life Stealing",
    type: "Weapon",
    rarity: "Rare",
    attunement: true,
    baseItem: "Any Sword",
    description:
      "When you attack a creature with this magic weapon and roll a 20 on the attack roll, that target takes an extra 3d6 Necrotic damage, provided it isn't a Construct or an Undead. You gain Temporary Hit Points equal to the extra damage dealt.",
  },
  {
    name: "Sword of Sharpness",
    type: "Weapon",
    rarity: "Very Rare",
    attunement: true,
    baseItem: "Any Sword That Deals Slashing Damage",
    description:
      "When you attack an object with this magic sword and hit, maximize your weapon damage dice. When you roll a 20 on an attack roll against a creature, it takes an extra 4d6 Slashing damage; then roll another d20, and on a 20 you lop off one of the target's limbs (if it has any). In addition, you can speak the command word to make the blade shed Bright Light in a 10-foot radius and Dim Light for an additional 10 feet.",
  },
  {
    name: "Sword of Wounding",
    type: "Weapon",
    rarity: "Rare",
    attunement: true,
    baseItem: "Any Sword",
    description:
      "Hit Points lost to this weapon's damage can be regained only through a Short or Long Rest. Once per turn when you hit a creature with it, you can wound the target: at the start of each of its turns, it takes 1d4 Necrotic damage for each time you've wounded it, then makes a DC 15 Constitution saving throw, ending all such wounds on a success. A creature within 5 feet can also end the wounds with a successful DC 15 Wisdom (Medicine) check as an action.",
  },
  {
    name: "Trident of Fish Command",
    type: "Weapon",
    rarity: "Uncommon",
    attunement: true,
    baseItem: "Trident",
    description:
      "This trident has 3 charges. While you carry it, you can take an action and expend 1 charge to cast Dominate Beast (save DC 15) from it on a Beast that has an innate Swim Speed. The trident regains 1d3 expended charges daily at dawn.",
  },
  {
    name: "Vicious Weapon",
    type: "Weapon",
    rarity: "Rare",
    baseItem: "Any Simple or Martial Weapon",
    description:
      "When you roll a 20 on your attack roll with this magic weapon, the target takes an extra 7 damage of the weapon's type.",
  },
  {
    name: "Vorpal Sword",
    type: "Weapon",
    rarity: "Legendary",
    attunement: true,
    baseItem: "Any Sword That Deals Slashing Damage",
    magicBonus: 3,
    description:
      "You gain a +3 bonus to attack and damage rolls made with this magic weapon, and it ignores Resistance to Slashing damage. When you attack a creature that has at least one head and roll a 20 on the attack roll, you cut off one of its heads; it dies if it can't survive without that head. A creature that is immune to Slashing damage, has no head or doesn't need one, has Legendary Actions, or is too big for its head to be cut off instead takes an extra 6d8 Slashing damage from the hit.",
  },
  {
    name: "Weapon of Warning",
    type: "Weapon",
    rarity: "Uncommon",
    attunement: true,
    baseItem: "Any Simple or Martial Weapon",
    description:
      "This magic weapon warns you of danger. While it is on your person, you have Advantage on Initiative rolls, and you and your companions within 30 feet of you can't be surprised, except when Incapacitated by something other than nonmagical sleep. The weapon magically awakens you and your companions within range if any of you are sleeping naturally when combat begins.",
  },
  {
    name: "Weapon, +1",
    type: "Weapon",
    rarity: "Uncommon",
    baseItem: "Any Simple or Martial Weapon",
    magicBonus: 1,
    description: "You have a +1 bonus to attack and damage rolls made with this magic weapon.",
  },
  {
    name: "Weapon, +2",
    type: "Weapon",
    rarity: "Rare",
    baseItem: "Any Simple or Martial Weapon",
    magicBonus: 2,
    description: "You have a +2 bonus to attack and damage rolls made with this magic weapon.",
  },
  {
    name: "Weapon, +3",
    type: "Weapon",
    rarity: "Very Rare",
    baseItem: "Any Simple or Martial Weapon",
    magicBonus: 3,
    description: "You have a +3 bonus to attack and damage rolls made with this magic weapon.",
  },

  // ───────────────────────────── Potions & Oils ──────────────────────────────
  {
    name: "Oil of Etherealness",
    type: "Potion",
    rarity: "Rare",
    description:
      "Beads of this cloudy gray oil form on the outside of its container and quickly evaporate. The oil can cover a Medium or smaller creature along with the equipment it is wearing and carrying (one additional vial is needed for each size category above Medium). Applying the oil takes 10 minutes, after which the creature gains the effect of the Etherealness spell for 1 hour.",
  },
  {
    name: "Oil of Sharpness",
    type: "Potion",
    rarity: "Very Rare",
    description:
      "This clear, gelatinous oil sparkles with tiny, ultrathin silver shards. It can coat one Slashing or Piercing weapon or up to 5 pieces of Slashing or Piercing ammunition. Applying the oil takes 1 minute, and for 1 hour the coated item is magical and has a +3 bonus to attack and damage rolls.",
  },
  {
    name: "Oil of Slipperiness",
    type: "Potion",
    rarity: "Uncommon",
    description:
      "This sticky black unguent can cover a Medium or smaller creature along with its gear (one additional vial per size category above Medium). Applying it takes 10 minutes, after which the creature gains the effect of Freedom of Movement for 8 hours. Alternatively, the oil can be poured on the ground as an action, covering a 10-foot square and duplicating the Grease spell there for 8 hours.",
  },
  {
    name: "Philter of Love",
    type: "Potion",
    rarity: "Uncommon",
    description:
      "The next time you see a creature within 10 minutes after drinking this philter, you have the Charmed condition with respect to that creature for 1 hour. If the creature is of a kind you are normally attracted to, you regard it as your true love while you are charmed.",
  },
  {
    name: "Potion of Animal Friendship",
    type: "Potion",
    rarity: "Uncommon",
    description:
      "When you drink this potion, you can cast the Animal Friendship spell (save DC 13) at will for 1 hour.",
  },
  {
    name: "Potion of Clairvoyance",
    type: "Potion",
    rarity: "Rare",
    description:
      "When you drink this potion, you gain the effect of the Clairvoyance spell (no Concentration required). An eyeball bobs in the yellowish liquid but vanishes when the potion is opened.",
  },
  {
    name: "Potion of Climbing",
    type: "Potion",
    rarity: "Common",
    description:
      "When you drink this potion, you gain a Climb Speed equal to your Speed for 1 hour. During this time, you have Advantage on Strength (Athletics) checks you make to climb.",
  },
  {
    name: "Potion of Cloud Giant Strength",
    type: "Potion",
    rarity: "Very Rare",
    description:
      "When you drink this potion, your Strength score becomes 27 for 1 hour. The potion has no effect on you if your Strength is already equal to or greater than that score.",
  },
  {
    name: "Potion of Diminution",
    type: "Potion",
    rarity: "Rare",
    description:
      "When you drink this potion, you gain the Reduce effect of the Enlarge/Reduce spell for 1d4 hours (no Concentration required).",
  },
  {
    name: "Potion of Fire Giant Strength",
    type: "Potion",
    rarity: "Rare",
    description:
      "When you drink this potion, your Strength score becomes 25 for 1 hour. The potion has no effect on you if your Strength is already equal to or greater than that score.",
  },
  {
    name: "Potion of Flying",
    type: "Potion",
    rarity: "Very Rare",
    description:
      "When you drink this potion, you gain a Fly Speed equal to your Speed for 1 hour and can hover. If you're in the air when the potion wears off, you fall unless you have some other means of staying aloft.",
  },
  {
    name: "Potion of Frost Giant Strength",
    type: "Potion",
    rarity: "Rare",
    description:
      "When you drink this potion, your Strength score becomes 23 for 1 hour. The potion has no effect on you if your Strength is already equal to or greater than that score.",
  },
  {
    name: "Potion of Gaseous Form",
    type: "Potion",
    rarity: "Rare",
    description:
      "When you drink this potion, you gain the effect of the Gaseous Form spell for 1 hour (no Concentration required) or until you end the effect as a Bonus Action.",
  },
  {
    name: "Potion of Greater Healing",
    type: "Potion",
    rarity: "Uncommon",
    description:
      "You regain 4d4 + 4 Hit Points when you drink this potion. Drinking or administering a potion takes a Bonus Action.",
  },
  {
    name: "Potion of Growth",
    type: "Potion",
    rarity: "Uncommon",
    description:
      "When you drink this potion, you gain the Enlarge effect of the Enlarge/Reduce spell for 1d4 hours (no Concentration required).",
  },
  {
    name: "Potion of Healing",
    type: "Potion",
    rarity: "Common",
    description:
      "You regain 2d4 + 2 Hit Points when you drink this potion. The potion's red liquid glimmers when agitated. Drinking or administering a potion takes a Bonus Action.",
  },
  {
    name: "Potion of Heroism",
    type: "Potion",
    rarity: "Rare",
    description:
      "For 1 hour after drinking this potion, you have 10 Temporary Hit Points and are under the effect of the Bless spell (no Concentration required).",
  },
  {
    name: "Potion of Hill Giant Strength",
    type: "Potion",
    rarity: "Uncommon",
    description:
      "When you drink this potion, your Strength score becomes 21 for 1 hour. The potion has no effect on you if your Strength is already equal to or greater than that score.",
  },
  {
    name: "Potion of Invisibility",
    type: "Potion",
    rarity: "Very Rare",
    description:
      "When you drink this potion, you have the Invisible condition for 1 hour, and anything you wear or carry is invisible with you. The effect ends early if you make an attack roll, deal damage, or cast a spell.",
  },
  {
    name: "Potion of Mind Reading",
    type: "Potion",
    rarity: "Rare",
    description:
      "When you drink this potion, you gain the effect of the Detect Thoughts spell (save DC 13, no Concentration required).",
  },
  {
    name: "Potion of Poison",
    type: "Potion",
    rarity: "Uncommon",
    description:
      "This concoction looks, smells, and tastes like a Potion of Healing or another beneficial potion. If you drink it, you take 3d6 Poison damage and must succeed on a DC 13 Constitution saving throw or have the Poisoned condition. While poisoned this way, you take 3d6 Poison damage at the start of each of your turns; at the end of each of your turns you repeat the save, and each success reduces the damage on later turns by 1d6. The poison ends when the damage decreases to 0.",
  },
  {
    name: "Potion of Resistance",
    type: "Potion",
    rarity: "Uncommon",
    description:
      "When you drink this potion, you have Resistance to one type of damage for 1 hour. The GM chooses the type or rolls a d10: Acid, Cold, Fire, Force, Lightning, Necrotic, Poison, Psychic, Radiant, or Thunder.",
  },
  {
    name: "Potion of Speed",
    type: "Potion",
    rarity: "Very Rare",
    description:
      "When you drink this potion, you gain the effect of the Haste spell for 1 minute (no Concentration required), without suffering the wave of lethargy that typically occurs when the effect ends.",
  },
  {
    name: "Potion of Stone Giant Strength",
    type: "Potion",
    rarity: "Rare",
    description:
      "When you drink this potion, your Strength score becomes 23 for 1 hour. The potion has no effect on you if your Strength is already equal to or greater than that score.",
  },
  {
    name: "Potion of Storm Giant Strength",
    type: "Potion",
    rarity: "Legendary",
    description:
      "When you drink this potion, your Strength score becomes 29 for 1 hour. The potion has no effect on you if your Strength is already equal to or greater than that score.",
  },
  {
    name: "Potion of Superior Healing",
    type: "Potion",
    rarity: "Rare",
    description:
      "You regain 8d4 + 8 Hit Points when you drink this potion. Drinking or administering a potion takes a Bonus Action.",
  },
  {
    name: "Potion of Supreme Healing",
    type: "Potion",
    rarity: "Very Rare",
    description:
      "You regain 10d4 + 20 Hit Points when you drink this potion. Drinking or administering a potion takes a Bonus Action.",
  },
  {
    name: "Potion of Water Breathing",
    type: "Potion",
    rarity: "Uncommon",
    description:
      "You can breathe underwater for 1 hour after drinking this potion. Its cloudy green fluid smells of the sea and has a jellyfish-like bubble floating in it.",
  },

  // ────────────────────────────────── Rings ──────────────────────────────────
  {
    name: "Ring of Animal Influence",
    type: "Ring",
    rarity: "Rare",
    description:
      "This ring has 3 charges and regains 1d3 expended charges daily at dawn. While wearing it, you can expend 1 charge to cast one of the following spells (save DC 13): Animal Friendship; Fear, targeting only Beasts that have an Intelligence of 3 or lower; or Speak with Animals.",
  },
  {
    name: "Ring of Djinni Summoning",
    type: "Ring",
    rarity: "Legendary",
    attunement: true,
    description:
      "While wearing this ring, you can take an action to speak its command word and summon a particular djinni from the Elemental Plane of Air into an unoccupied space within 120 feet of you. It remains as long as you concentrate (as if on a spell), up to 1 hour, or until it drops to 0 Hit Points. The djinni is friendly to you and your companions and obeys your commands in any language. After it departs, it can't be summoned again for 24 hours, and the ring becomes nonmagical if the djinni dies.",
  },
  {
    name: "Ring of Elemental Command",
    type: "Ring",
    rarity: "Legendary",
    attunement: true,
    note: "Four varieties, each linked to one elemental plane: Air, Earth, Fire, or Water.",
    description:
      "Each ring is linked to one of the four Elemental Planes. While wearing it, you have Advantage on attack rolls against Elementals from the linked plane, and they have Disadvantage on attack rolls against you. The ring has 5 charges and regains 1d4 + 1 expended charges daily at dawn; you can expend 2 charges to cast Dominate Monster on an Elemental native to the linked plane. Each ring also grants its own benefits, such as a Resistance or Immunity, the ability to speak that plane's elemental language, special movement, and further spells cast with its charges.",
  },
  {
    name: "Ring of Evasion",
    type: "Ring",
    rarity: "Rare",
    attunement: true,
    description:
      "This ring has 3 charges and regains 1d3 expended charges daily at dawn. When you fail a Dexterity saving throw while wearing it, you can take a Reaction to expend 1 charge and succeed on that saving throw instead.",
  },
  {
    name: "Ring of Feather Falling",
    type: "Ring",
    rarity: "Rare",
    attunement: true,
    description:
      "When you fall while wearing this ring, you descend 60 feet per round and take no damage from falling.",
  },
  {
    name: "Ring of Free Action",
    type: "Ring",
    rarity: "Rare",
    attunement: true,
    description:
      "While you wear this ring, Difficult Terrain doesn't cost you extra movement. In addition, magic can neither reduce your Speed nor cause you to have the Paralyzed or Restrained condition.",
  },
  {
    name: "Ring of Invisibility",
    type: "Ring",
    rarity: "Legendary",
    attunement: true,
    description:
      "While wearing this ring, you can take an action to turn Invisible. You remain invisible until the ring is removed, until you attack or cast a spell, or until you take a Bonus Action to become visible again.",
  },
  {
    name: "Ring of Jumping",
    type: "Ring",
    rarity: "Uncommon",
    attunement: true,
    description:
      "While wearing this ring, you can cast the Jump spell from it as a Bonus Action at will, but can target only yourself when you do so.",
  },
  {
    name: "Ring of Mind Shielding",
    type: "Ring",
    rarity: "Uncommon",
    attunement: true,
    description:
      "While wearing this ring, you are immune to magic that allows other creatures to read your thoughts, determine whether you are lying, know your alignment, or know your creature type, and creatures can communicate with you telepathically only if you allow it. As an action you can make the ring Invisible until you use another action to make it visible, remove it, or die. If you die while wearing it, your soul can enter the ring (unless it already houses one) and communicate telepathically with whoever wears it.",
  },
  {
    name: "Ring of Protection",
    type: "Ring",
    rarity: "Rare",
    attunement: true,
    description: "You gain a +1 bonus to Armor Class and saving throws while wearing this ring.",
  },
  {
    name: "Ring of Regeneration",
    type: "Ring",
    rarity: "Very Rare",
    attunement: true,
    description:
      "While wearing this ring, you regain 1d6 Hit Points every 10 minutes, provided that you have at least 1 Hit Point. If you lose a body part, the ring causes the missing part to regrow and return to full functionality after 1d6 + 1 days if you have at least 1 Hit Point the whole time.",
  },
  {
    name: "Ring of Resistance",
    type: "Ring",
    rarity: "Rare",
    attunement: true,
    description:
      "You have Resistance to one damage type while wearing this ring. The gem in the ring indicates the type, which the GM chooses or rolls: Acid, Cold, Fire, Force, Lightning, Necrotic, Poison, Psychic, Radiant, or Thunder.",
  },
  {
    name: "Ring of Shooting Stars",
    type: "Ring",
    rarity: "Very Rare",
    attunement: "outdoors at night",
    description:
      "While wearing this ring in Dim Light or Darkness, you can cast Dancing Lights and Light from it at will, and Faerie Fire once per dawn. The ring has 6 charges and regains 1d6 expended charges daily at dawn. Ball Lightning (2 charges): create one to four glowing spheres that each deal 4d12 Lightning damage, DC 15 Dexterity save for half, divided among them. Shooting Stars (1 to 3 charges): for each charge, launch a mote that showers a 15-foot Cube with sparks; each creature there makes a DC 15 Dexterity saving throw, taking 5d4 Fire damage on a failure or half on a success.",
  },
  {
    name: "Ring of Spell Storing",
    type: "Ring",
    rarity: "Rare",
    attunement: true,
    description:
      "This ring stores spells cast into it, holding up to 5 levels' worth of spells at a time; when found it contains 1d6 - 1 levels chosen by the GM. Any creature can cast a level 1 to 5 spell into the ring by touching it as the spell is cast. While wearing the ring, you can cast any spell stored in it, using the slot level, save DC, attack bonus, and spellcasting ability of the original caster, which frees that space in the ring.",
  },
  {
    name: "Ring of Spell Turning",
    type: "Ring",
    rarity: "Legendary",
    attunement: true,
    description:
      "While wearing this ring, you have Advantage on saving throws against any spell that targets only you (not an area of effect). If you roll a 20 on the save and the spell is level 7 or lower, the spell has no effect on you and instead targets its caster, using the original slot level, save DC, attack bonus, and spellcasting ability.",
  },
  {
    name: "Ring of Swimming",
    type: "Ring",
    rarity: "Uncommon",
    description: "You have a Swim Speed of 40 feet while wearing this ring.",
  },
  {
    name: "Ring of Telekinesis",
    type: "Ring",
    rarity: "Very Rare",
    attunement: true,
    description:
      "While wearing this ring, you can cast the Telekinesis spell at will, but you can target only objects that aren't being worn or carried.",
  },
  {
    name: "Ring of the Ram",
    type: "Ring",
    rarity: "Rare",
    attunement: true,
    description:
      "This ring has 3 charges and regains 1d3 expended charges daily at dawn. As an action you can expend 1 to 3 charges to make a spectral ram's head attack one creature you can see within 60 feet, with a +7 attack bonus; on a hit, for each charge spent, the target takes 2d10 Force damage and is pushed 5 feet away. Alternatively, you can expend 1 to 3 charges to try to break an object within 60 feet that isn't worn or carried; the ring makes a Strength check with a +5 bonus per charge spent.",
  },
  {
    name: "Ring of Three Wishes",
    type: "Ring",
    rarity: "Legendary",
    description:
      "While wearing this ring, you can take an action to expend 1 of its 3 charges to cast the Wish spell from it. The ring becomes nonmagical when you use the last charge.",
  },
  {
    name: "Ring of Warmth",
    type: "Ring",
    rarity: "Uncommon",
    attunement: true,
    description:
      "While wearing this ring, you have Resistance to Cold damage. In addition, you and everything you wear and carry are unharmed by temperatures as low as -50 degrees Fahrenheit.",
  },
  {
    name: "Ring of Water Walking",
    type: "Ring",
    rarity: "Uncommon",
    description:
      "While wearing this ring, you can stand on and move across any liquid surface as if it were solid ground.",
  },
  {
    name: "Ring of X-ray Vision",
    type: "Ring",
    rarity: "Rare",
    attunement: true,
    description:
      "While wearing this ring, you can take an action to speak its command word and see into and through solid matter for 1 minute, within 30 feet. Solid objects within that radius appear transparent and don't block light; the vision can penetrate 1 foot of stone, 1 inch of common metal, or up to 3 feet of wood or dirt, and is blocked by a thin sheet of lead. Whenever you use the ring again before finishing a Long Rest, you must succeed on a DC 15 Constitution saving throw or gain 1 level of Exhaustion.",
  },

  // ────────────────────────────────── Rods ───────────────────────────────────
  {
    name: "Immovable Rod",
    type: "Rod",
    rarity: "Uncommon",
    description:
      "This flat iron rod has a button on one end. As an action you can press the button, which magically fixes the rod in place; it doesn't move, even defying gravity, until a creature presses the button again. The rod can hold up to 8,000 pounds; more weight deactivates it and it falls. A creature can take an action to make a DC 30 Strength check, moving the fixed rod up to 10 feet on a success.",
  },
  {
    name: "Rod of Absorption",
    type: "Rod",
    rarity: "Very Rare",
    attunement: true,
    description:
      "While holding this rod, you can take a Reaction to absorb a spell that targets only you and doesn't have an area of effect; the spell is canceled and its energy, equal to its level, is stored in the rod. The rod can absorb up to 50 levels of energy over its existence. If you are a spellcaster, you can convert stored energy into spell slots to cast spells you have prepared, creating slots no higher than your own highest slot and no higher than level 5.",
  },
  {
    name: "Rod of Alertness",
    type: "Rod",
    rarity: "Very Rare",
    attunement: true,
    description:
      "While holding this rod, you have Advantage on Wisdom (Perception) checks and Initiative rolls, and as an action you can cast Detect Evil and Good, Detect Magic, Detect Poison and Disease, or See Invisibility from it. Once per dawn, you can plant it in the ground as an action: it sheds Bright Light in a 60-foot radius and Dim Light for an additional 60 feet for 10 minutes. While in the bright light, you and friendly creatures gain a +1 bonus to AC and saving throws and can sense the location of any Invisible hostile creature also in the light.",
  },
  {
    name: "Rod of Lordly Might",
    type: "Rod",
    rarity: "Legendary",
    attunement: true,
    magicBonus: 3,
    description:
      "This rod functions as a +3 Mace and has three properties usable once each per dawn: Drain Life (on a hit, DC 17 Constitution save or the target takes an extra 4d6 Necrotic damage and you regain half), Paralyze (on a hit, DC 17 Strength save or Paralyzed for 1 minute, repeating the save each turn), and Terrify (as an action, creatures within 30 feet make a DC 17 Wisdom save or are Frightened for 1 minute). Its six buttons transform it into a flaming blade, a +3 Battleaxe or Spear, a 50-foot climbing pole that holds 4,000 pounds, a battering ram granting +10 to Strength checks to break barriers, or a rod that points to magnetic north and reveals depth or height.",
  },
  {
    name: "Rod of Resurrection",
    type: "Rod",
    rarity: "Legendary",
    attunement: "by a Cleric, Druid, or Paladin",
    description:
      "This rod has 5 charges. While you hold it, you can take an action to cast Heal (1 charge) or Resurrection (5 charges) from it. The rod regains 1 expended charge daily at dawn. If you expend its last charge, roll a d20; on a 1, the rod disappears in a flash of radiance.",
  },
  {
    name: "Rod of Rulership",
    type: "Rod",
    rarity: "Rare",
    attunement: true,
    description:
      "As an action you can present this rod and command obedience from each creature of your choice that you can see within 120 feet. Each target must succeed on a DC 15 Wisdom saving throw or have the Charmed condition for 8 hours, regarding you as its trusted leader. The charm ends early if you or your companions harm the target or command it to act against its nature. The rod can't be used again until the next dawn.",
  },
  {
    name: "Rod of Security",
    type: "Rod",
    rarity: "Very Rare",
    description:
      "As an action you can activate this rod to transport yourself and up to 199 other willing creatures you can see to a paradise demiplane. You can stay for 200 days divided by the number of creatures present (round down); creatures there don't age, eat, or drink, and hurtful effects are suspended. When the time ends or you use an action to end it, everyone returns to the space they left or the nearest unoccupied space. The rod can't be used again until ten days have passed.",
  },

  // ───────────────────────────────── Scrolls ─────────────────────────────────
  {
    name: "Spell Scroll (Cantrip)",
    type: "Scroll",
    rarity: "Common",
    description:
      "This scroll bears the words of a single cantrip. If the cantrip is on your class's spell list, you can read the scroll and cast the cantrip without Material components, using its normal casting time; otherwise the scroll is unintelligible. The scroll disintegrates when the casting is complete. Its save DC is 13 and its attack bonus is +5.",
  },
  {
    name: "Spell Scroll (Level 1)",
    type: "Scroll",
    rarity: "Common",
    description:
      "This scroll bears the words of a single level 1 spell. If the spell is on your class's spell list, you can read the scroll and cast it without Material components; otherwise the scroll is unintelligible. If the spell's level is higher than you can normally cast, you must succeed on an ability check using your spellcasting ability (DC 11) or the spell fails. The scroll disintegrates after use. Save DC 13, attack bonus +5.",
  },
  {
    name: "Spell Scroll (Level 2)",
    type: "Scroll",
    rarity: "Uncommon",
    description:
      "This scroll bears the words of a single level 2 spell. If the spell is on your class's spell list, you can read the scroll and cast it without Material components; otherwise the scroll is unintelligible. If the spell's level is higher than you can normally cast, you must succeed on an ability check using your spellcasting ability (DC 12) or the spell fails. The scroll disintegrates after use. Save DC 13, attack bonus +5.",
  },
  {
    name: "Spell Scroll (Level 3)",
    type: "Scroll",
    rarity: "Uncommon",
    description:
      "This scroll bears the words of a single level 3 spell. If the spell is on your class's spell list, you can read the scroll and cast it without Material components; otherwise the scroll is unintelligible. If the spell's level is higher than you can normally cast, you must succeed on an ability check using your spellcasting ability (DC 13) or the spell fails. The scroll disintegrates after use. Save DC 15, attack bonus +7.",
  },
  {
    name: "Spell Scroll (Level 4)",
    type: "Scroll",
    rarity: "Rare",
    description:
      "This scroll bears the words of a single level 4 spell. If the spell is on your class's spell list, you can read the scroll and cast it without Material components; otherwise the scroll is unintelligible. If the spell's level is higher than you can normally cast, you must succeed on an ability check using your spellcasting ability (DC 14) or the spell fails. The scroll disintegrates after use. Save DC 15, attack bonus +7.",
  },
  {
    name: "Spell Scroll (Level 5)",
    type: "Scroll",
    rarity: "Rare",
    description:
      "This scroll bears the words of a single level 5 spell. If the spell is on your class's spell list, you can read the scroll and cast it without Material components; otherwise the scroll is unintelligible. If the spell's level is higher than you can normally cast, you must succeed on an ability check using your spellcasting ability (DC 15) or the spell fails. The scroll disintegrates after use. Save DC 17, attack bonus +9.",
  },
  {
    name: "Spell Scroll (Level 6)",
    type: "Scroll",
    rarity: "Very Rare",
    description:
      "This scroll bears the words of a single level 6 spell. If the spell is on your class's spell list, you can read the scroll and cast it without Material components; otherwise the scroll is unintelligible. If the spell's level is higher than you can normally cast, you must succeed on an ability check using your spellcasting ability (DC 16) or the spell fails. The scroll disintegrates after use. Save DC 17, attack bonus +9.",
  },
  {
    name: "Spell Scroll (Level 7)",
    type: "Scroll",
    rarity: "Very Rare",
    description:
      "This scroll bears the words of a single level 7 spell. If the spell is on your class's spell list, you can read the scroll and cast it without Material components; otherwise the scroll is unintelligible. If the spell's level is higher than you can normally cast, you must succeed on an ability check using your spellcasting ability (DC 17) or the spell fails. The scroll disintegrates after use. Save DC 18, attack bonus +10.",
  },
  {
    name: "Spell Scroll (Level 8)",
    type: "Scroll",
    rarity: "Very Rare",
    description:
      "This scroll bears the words of a single level 8 spell. If the spell is on your class's spell list, you can read the scroll and cast it without Material components; otherwise the scroll is unintelligible. If the spell's level is higher than you can normally cast, you must succeed on an ability check using your spellcasting ability (DC 18) or the spell fails. The scroll disintegrates after use. Save DC 18, attack bonus +10.",
  },
  {
    name: "Spell Scroll (Level 9)",
    type: "Scroll",
    rarity: "Legendary",
    description:
      "This scroll bears the words of a single level 9 spell. If the spell is on your class's spell list, you can read the scroll and cast it without Material components; otherwise the scroll is unintelligible. If the spell's level is higher than you can normally cast, you must succeed on an ability check using your spellcasting ability (DC 19) or the spell fails. The scroll disintegrates after use. Save DC 19, attack bonus +11.",
  },

  // ───────────────────────────────── Staffs ──────────────────────────────────
  {
    name: "Staff of Charming",
    type: "Staff",
    rarity: "Rare",
    attunement: "by a Bard, Cleric, Druid, Sorcerer, Warlock, or Wizard",
    description:
      "This staff has 10 charges and regains 1d8 + 2 expended charges daily at dawn. While holding it, you can expend 1 charge to cast Charm Person, Command, or Comprehend Languages, using your spell save DC. If you succeed on a saving throw against an enchantment spell that targets only you, you can take a Reaction and expend 1 charge to turn the spell back on its caster. If you expend the last charge, roll a d20; on a 1, the staff becomes a nonmagical Quarterstaff.",
  },
  {
    name: "Staff of Fire",
    type: "Staff",
    rarity: "Very Rare",
    attunement: "by a Druid, Sorcerer, Warlock, or Wizard",
    description:
      "You have Resistance to Fire damage while you hold this staff. It has 10 charges and regains 1d6 + 4 expended charges daily at dawn. While holding it, you can expend charges to cast Burning Hands (1 charge), Fireball (3 charges), or Wall of Fire (4 charges), using your spell save DC. If you expend the last charge, roll a d20; on a 1, the staff blackens, crumbles into cinders, and is destroyed.",
  },
  {
    name: "Staff of Frost",
    type: "Staff",
    rarity: "Very Rare",
    attunement: "by a Druid, Sorcerer, Warlock, or Wizard",
    description:
      "You have Resistance to Cold damage while you hold this staff. It has 10 charges and regains 1d6 + 4 expended charges daily at dawn. While holding it, you can expend charges to cast Cone of Cold (5 charges), Fog Cloud (1 charge), Ice Storm (4 charges), or Wall of Ice (4 charges), using your spell save DC. If you expend the last charge, roll a d20; on a 1, the staff turns to water and is destroyed.",
  },
  {
    name: "Staff of Healing",
    type: "Staff",
    rarity: "Rare",
    attunement: "by a Bard, Cleric, or Druid",
    description:
      "This staff has 10 charges and regains 1d6 + 4 expended charges daily at dawn. While holding it, you can expend charges to cast Cure Wounds (1 charge per spell level, up to level 4), Lesser Restoration (2 charges), or Mass Cure Wounds (5 charges), using your spellcasting ability modifier. If you expend the last charge, roll a d20; on a 1, the staff vanishes in a flash of light, lost forever.",
  },
  {
    name: "Staff of Power",
    type: "Staff",
    rarity: "Very Rare",
    attunement: "by a Sorcerer, Warlock, or Wizard",
    magicBonus: 2,
    description:
      "This staff is a +2 Quarterstaff, and while holding it you gain a +2 bonus to AC, saving throws, and spell attack rolls. It has 20 charges and regains 2d8 + 4 daily at dawn; on a hit you can expend 1 charge to deal an extra 1d6 Force damage. You can expend charges to cast Cone of Cold (5), Fireball at level 5 (5), Globe of Invulnerability (6), Hold Monster (5), Levitate (2), Lightning Bolt at level 5 (5), Magic Missile (1), Ray of Enfeeblement (1), or Wall of Force (5). As an action you can break it for a Retributive Strike, an explosion that harms everything within 30 feet, including you.",
  },
  {
    name: "Staff of Striking",
    type: "Staff",
    rarity: "Very Rare",
    attunement: true,
    magicBonus: 3,
    description:
      "This staff can be wielded as a magic Quarterstaff that grants a +3 bonus to attack and damage rolls. It has 10 charges and regains 1d6 + 4 expended charges daily at dawn. When you hit with a melee attack using it, you can expend up to 3 charges; for each charge, the target takes an extra 1d6 Force damage. If you expend the last charge, roll a d20; on a 1, the staff becomes a nonmagical Quarterstaff.",
  },
  {
    name: "Staff of Swarming Insects",
    type: "Staff",
    rarity: "Rare",
    attunement: "by a Bard, Cleric, Druid, Sorcerer, Warlock, or Wizard",
    description:
      "This staff has 10 charges and regains 1d6 + 4 expended charges daily at dawn. You can expend charges to cast Giant Insect (4 charges) or Insect Plague (5 charges) using your spell save DC. As an action you can expend 1 charge to fill a 30-foot radius around you with a swarm of harmless flying insects for 10 minutes, making the area Heavily Obscured; it moves with you and a wind of at least 10 miles per hour disperses it. If you expend the last charge, roll a d20; on a 1, the insects consume and destroy the staff.",
  },
  {
    name: "Staff of the Magi",
    type: "Staff",
    rarity: "Legendary",
    attunement: "by a Sorcerer, Warlock, or Wizard",
    magicBonus: 2,
    description:
      "This staff is a +2 Quarterstaff that gives you Advantage on saving throws against spells. It has 50 charges and regains 4d6 + 2 daily at dawn. As a Reaction it can absorb a spell targeting only you, canceling it and gaining charges equal to the spell's level. It casts many spells for charges, including Conjure Elemental (7), Dispel Magic (3), Fireball at level 7 (7), Flaming Sphere (2), Ice Storm (4), Invisibility (2), Knock (2), Lightning Bolt at level 7 (7), Passwall (5), Plane Shift (7), Telekinesis (5), Wall of Fire (4), and Web (2), plus Arcane Lock, Detect Magic, Enlarge/Reduce, Light, Mage Hand, and Protection from Evil and Good at will. Breaking it unleashes a devastating Retributive Strike.",
  },
  {
    name: "Staff of the Python",
    type: "Staff",
    rarity: "Uncommon",
    attunement: "by a Cleric, Druid, or Warlock",
    description:
      "As an action you can speak this staff's command word and throw it on the ground within 10 feet of you, where it becomes a Giant Constrictor Snake under your control that acts on its own initiative. You can mentally command it while it is within 60 feet and you aren't Incapacitated, and as a Bonus Action you can speak the command word again to return it to staff form. If the snake drops to 0 Hit Points, it dies, reverts to staff form, and the staff shatters; if it reverts before that, it regains all its Hit Points.",
  },
  {
    name: "Staff of the Woodlands",
    type: "Staff",
    rarity: "Rare",
    attunement: "by a Druid",
    magicBonus: 2,
    description:
      "This staff can be wielded as a magic Quarterstaff that grants a +2 bonus to attack and damage rolls, and you gain a +2 bonus to spell attack rolls while holding it. It has 10 charges (regains 1d6 + 4 daily at dawn) for Animal Friendship (1), Awaken (5), Barkskin (2), Locate Animals or Plants (2), Speak with Animals (1), Speak with Plants (3), or Wall of Thorns (6), and you can cast Pass without Trace at will. As an action you can plant it in fertile earth to turn it into a 60-foot tree until you touch it and speak the command word again.",
  },
  {
    name: "Staff of Thunder and Lightning",
    type: "Staff",
    rarity: "Very Rare",
    attunement: true,
    magicBonus: 2,
    description:
      "This staff can be wielded as a magic Quarterstaff with a +2 bonus to attack and damage rolls. Each of its properties can be used once per dawn: Lightning (a hit deals an extra 2d6 Lightning damage), Thunder (a hit forces a DC 17 Constitution save or the target is Stunned until the end of your next turn), Lightning Strike (a 5-foot-wide, 120-foot Line; DC 17 Dexterity save, 9d6 Lightning damage, half on a success), Thunderclap (each creature within 60 feet makes a DC 17 Constitution save, taking 2d6 Thunder damage and becoming Deafened for 1 minute on a failure), and Thunder and Lightning (use Lightning Strike and Thunderclap together without expending their daily uses).",
  },
  {
    name: "Staff of Withering",
    type: "Staff",
    rarity: "Rare",
    attunement: "by a Cleric, Druid, or Warlock",
    description:
      "This staff has 3 charges and regains 1d3 expended charges daily at dawn. It can be wielded as a magic Quarterstaff. On a hit, you can expend 1 charge to deal an extra 2d10 Necrotic damage, and the target must succeed on a DC 15 Constitution saving throw or have Disadvantage for 1 hour on any ability check or saving throw that uses Strength or Constitution.",
  },

  // ────────────────────────────────── Wands ──────────────────────────────────
  {
    name: "Wand of Binding",
    type: "Wand",
    rarity: "Rare",
    attunement: "by a Spellcaster",
    description:
      "This wand has 7 charges and regains 1d6 + 1 expended charges daily at dawn. While holding it, you can expend charges to cast Hold Monster (5 charges) or Hold Person (2 charges), save DC 17. As a Reaction you can expend 1 charge to gain Advantage on a saving throw to avoid being Paralyzed or Restrained, or on a check to escape a grapple. If you expend the last charge, roll a d20; on a 1, the wand crumbles into ashes and is destroyed.",
  },
  {
    name: "Wand of Enemy Detection",
    type: "Wand",
    rarity: "Rare",
    attunement: true,
    description:
      "This wand has 7 charges and regains 1d6 + 1 expended charges daily at dawn. While holding it, you can take an action and expend 1 charge; for the next minute, you know the direction of the nearest creature hostile to you within 60 feet, but not its distance. The wand senses hostile creatures that are ethereal, invisible, disguised, or hidden, as well as those in plain sight. If you expend the last charge, roll a d20; on a 1, the wand crumbles into ashes.",
  },
  {
    name: "Wand of Fear",
    type: "Wand",
    rarity: "Rare",
    attunement: true,
    description:
      "This wand has 7 charges and regains 1d6 + 1 expended charges daily at dawn. You can expend 1 charge to cast Command (save DC 15), limited to the commands flee or grovel. Or you can expend 2 charges to emit a 60-foot Cone; each creature in it must succeed on a DC 15 Wisdom saving throw or have the Frightened condition for 1 minute, moving away from you on its turns and repeating the save at the end of each turn. If you expend the last charge, roll a d20; on a 1, the wand crumbles into ashes.",
  },
  {
    name: "Wand of Fireballs",
    type: "Wand",
    rarity: "Rare",
    attunement: "by a Spellcaster",
    description:
      "This wand has 7 charges and regains 1d6 + 1 expended charges daily at dawn. While holding it, you can expend 1 or more charges to cast Fireball (save DC 15) from it. For 1 charge you cast the level 3 version; the spell's level increases by 1 for each additional charge. If you expend the last charge, roll a d20; on a 1, the wand crumbles into ashes and is destroyed.",
  },
  {
    name: "Wand of Lightning Bolts",
    type: "Wand",
    rarity: "Rare",
    attunement: "by a Spellcaster",
    description:
      "This wand has 7 charges and regains 1d6 + 1 expended charges daily at dawn. While holding it, you can expend 1 or more charges to cast Lightning Bolt (save DC 15) from it. For 1 charge you cast the level 3 version; the spell's level increases by 1 for each additional charge. If you expend the last charge, roll a d20; on a 1, the wand crumbles into ashes and is destroyed.",
  },
  {
    name: "Wand of Magic Detection",
    type: "Wand",
    rarity: "Uncommon",
    description:
      "This wand has 3 charges and regains 1d3 expended charges daily at dawn. While holding it, you can expend 1 charge as an action to cast Detect Magic from it.",
  },
  {
    name: "Wand of Magic Missiles",
    type: "Wand",
    rarity: "Uncommon",
    description:
      "This wand has 7 charges and regains 1d6 + 1 expended charges daily at dawn. While holding it, you can expend 1 or more charges to cast Magic Missile from it. For 1 charge you cast the level 1 version; the spell's level increases by 1 for each additional charge. If you expend the last charge, roll a d20; on a 1, the wand crumbles into ashes and is destroyed.",
  },
  {
    name: "Wand of Paralysis",
    type: "Wand",
    rarity: "Rare",
    attunement: "by a Spellcaster",
    description:
      "This wand has 7 charges and regains 1d6 + 1 expended charges daily at dawn. While holding it, you can take an action and expend 1 charge to fire a thin blue ray at a creature you can see within 60 feet. The target must succeed on a DC 15 Constitution saving throw or have the Paralyzed condition for 1 minute, repeating the save at the end of each of its turns. If you expend the last charge, roll a d20; on a 1, the wand crumbles into ashes.",
  },
  {
    name: "Wand of Polymorph",
    type: "Wand",
    rarity: "Very Rare",
    attunement: "by a Spellcaster",
    description:
      "This wand has 7 charges and regains 1d6 + 1 expended charges daily at dawn. While holding it, you can expend 1 charge to cast Polymorph (save DC 15) from it. If you expend the last charge, roll a d20; on a 1, the wand crumbles into ashes and is destroyed.",
  },
  {
    name: "Wand of Secrets",
    type: "Wand",
    rarity: "Uncommon",
    description:
      "This wand has 3 charges and regains 1d3 expended charges daily at dawn. While holding it, you can take an action and expend 1 charge; if a secret door or trap is within 30 feet of you, the wand pulses and points at the one nearest to you.",
  },
  {
    name: "Wand of the War Mage, +1",
    type: "Wand",
    rarity: "Uncommon",
    attunement: "by a Spellcaster",
    magicBonus: 1,
    description:
      "While holding this wand, you gain a +1 bonus to spell attack rolls. In addition, you ignore Half Cover when making a spell attack.",
  },
  {
    name: "Wand of the War Mage, +2",
    type: "Wand",
    rarity: "Rare",
    attunement: "by a Spellcaster",
    magicBonus: 2,
    description:
      "While holding this wand, you gain a +2 bonus to spell attack rolls. In addition, you ignore Half Cover when making a spell attack.",
  },
  {
    name: "Wand of the War Mage, +3",
    type: "Wand",
    rarity: "Very Rare",
    attunement: "by a Spellcaster",
    magicBonus: 3,
    description:
      "While holding this wand, you gain a +3 bonus to spell attack rolls. In addition, you ignore Half Cover when making a spell attack.",
  },
  {
    name: "Wand of Web",
    type: "Wand",
    rarity: "Uncommon",
    attunement: "by a Spellcaster",
    description:
      "This wand has 7 charges and regains 1d6 + 1 expended charges daily at dawn. While holding it, you can expend 1 charge to cast Web (save DC 15) from it. If you expend the last charge, roll a d20; on a 1, the wand crumbles into ashes and is destroyed.",
  },
  {
    name: "Wand of Wonder",
    type: "Wand",
    rarity: "Rare",
    attunement: "by a Spellcaster",
    description:
      "This wand has 7 charges and regains 1d6 + 1 expended charges daily at dawn. While holding it, you can take an action to expend 1 charge and choose a creature, object, or point within 120 feet, then roll a d100 for a random effect: anything from Slow, Faerie Fire, Lightning Bolt, Fireball, or Invisibility to a storm of butterflies, sprouting grass, a torrent of gems, or turning the target's skin blue. If you expend the last charge, roll a d20; on a 1, the wand crumbles into dust and is destroyed.",
  },

  // ───────────────────────────── Wondrous Items ──────────────────────────────
  {
    name: "Alchemy Jug",
    type: "Wondrous Item",
    rarity: "Uncommon",
    description:
      "This ceramic jug weighs 12 pounds whether full or empty. As an action you can name one liquid and the jug produces it, pouring up to 2 gallons per minute: acid (8 ounces), basic poison (1/2 ounce), beer (4 gallons), honey (1 gallon), mayonnaise (2 gallons), oil (1 quart), vinegar (2 gallons), fresh water (8 gallons), salt water (12 gallons), or wine (1 gallon). Once the jug starts producing a liquid, it can't produce a different one, or more of one that reached its maximum, until the next dawn.",
  },
  {
    name: "Amulet of Health",
    type: "Wondrous Item",
    rarity: "Rare",
    attunement: true,
    description:
      "Your Constitution score is 19 while you wear this amulet. It has no effect on you if your Constitution is already 19 or higher.",
  },
  {
    name: "Amulet of Proof against Detection and Location",
    type: "Wondrous Item",
    rarity: "Uncommon",
    attunement: true,
    description:
      "While wearing this amulet, you are hidden from Divination magic. You can't be targeted by such magic or perceived through magical scrying sensors.",
  },
  {
    name: "Amulet of the Planes",
    type: "Wondrous Item",
    rarity: "Very Rare",
    attunement: true,
    description:
      "While wearing this amulet, you can take an action to name a location you are familiar with on another plane of existence, then make a DC 15 Intelligence check. On a success, you cast Plane Shift. On a failure, you and each creature and object within 15 feet of you travel to a random destination: roll a d100, and on 1 to 60 you arrive at a random location on the plane you named, while on 61 to 100 you arrive on a randomly determined plane.",
  },
  {
    name: "Apparatus of the Crab",
    type: "Wondrous Item",
    rarity: "Legendary",
    description:
      "This item first appears to be a sealed iron barrel weighing 500 pounds; a DC 20 Intelligence (Investigation) check finds the hidden catch that opens a hatch. Up to two Medium or smaller creatures can crew it, working its ten levers to walk (Speed 30 feet, Swim 30 feet), light its eyes, open and close the hatch, and attack with its pincers (+8 to hit, 2d6 Bludgeoning damage, grappled on a hit, escape DC 15). It is a Large object with AC 20, 200 Hit Points, and Immunity to Poison and Psychic damage.",
  },
  {
    name: "Bag of Beans",
    type: "Wondrous Item",
    rarity: "Rare",
    description:
      "This bag holds 3d4 dry beans. If you dump them out on the ground, they explode in a 10-foot radius; each creature in the area, including you, makes a DC 15 Dexterity saving throw, taking 5d4 Fire damage on a failure or half on a success. If you instead plant and water a single bean, it produces a random effect from a d100 table 1 minute later, ranging from a cluster of mushrooms or a pond to a beanstalk that reaches into the sky or a hostile creature.",
  },
  {
    name: "Bag of Devouring",
    type: "Wondrous Item",
    rarity: "Very Rare",
    description:
      "This bag resembles a Bag of Holding but is a feeding orifice for a gigantic extradimensional creature. Animal or vegetable matter placed wholly in the bag is devoured and lost forever. When a creature reaches inside, there is a 50 percent chance it is pulled in; a creature inside can escape with a DC 15 Strength check as an action, another creature can pull it out with a DC 20 Strength check, and any creature that starts its turn inside is devoured. Once each day the bag spits any inanimate objects inside it out onto another plane.",
  },
  {
    name: "Bag of Holding",
    type: "Wondrous Item",
    rarity: "Uncommon",
    description:
      "This bag has an interior space considerably larger than its outside dimensions. It can hold up to 500 pounds, not exceeding a volume of 64 cubic feet, and always weighs 15 pounds. A breathing creature inside can survive for 10 minutes divided by the number of creatures inside (minimum 1 minute). If the bag is overloaded, pierced, or torn, it ruptures and its contents are scattered in the Astral Plane; placing it inside another extradimensional space destroys both items and opens a gate to the Astral Plane.",
  },
  {
    name: "Bag of Tricks",
    type: "Wondrous Item",
    rarity: "Uncommon",
    note: "Comes in gray, rust, and tan varieties, each with its own table of creatures.",
    description:
      "This bag appears empty, but reaching inside reveals a small fuzzy object. As an action you can pull out the object and throw it up to 20 feet, where it becomes a creature determined by rolling a d8 on the table for the bag's color. The creature is friendly to you and your companions, acts on your turn, and can be commanded as a Bonus Action; it vanishes at the next dawn or when reduced to 0 Hit Points. Once three objects have been pulled from the bag, it can't be used again until the next dawn.",
  },
  {
    name: "Bead of Force",
    type: "Wondrous Item",
    rarity: "Rare",
    description:
      "This small black sphere can be thrown up to 60 feet as an action. It explodes on impact; each creature within a 10-foot radius must succeed on a DC 15 Dexterity saving throw or take 5d4 Force damage. A sphere of transparent force then encloses the area for 1 minute, trapping any creature that failed the save and is wholly inside; only breathable air can pass through its wall. An enclosed creature can use its action to push the sphere up to half its Speed.",
  },
  {
    name: "Belt of Cloud Giant Strength",
    type: "Wondrous Item",
    rarity: "Legendary",
    attunement: true,
    description:
      "While wearing this belt, your Strength score is 27. The belt has no effect on you if your Strength is already equal to or greater than that score.",
  },
  {
    name: "Belt of Dwarvenkind",
    type: "Wondrous Item",
    rarity: "Rare",
    attunement: true,
    description:
      "While wearing this belt, your Constitution increases by 2 (to a maximum of 20), you have Advantage on Charisma (Persuasion) checks made to interact with dwarves, and you have Advantage on saving throws against poison and Resistance to Poison damage. You also have Darkvision out to 60 feet and can speak, read, and write Dwarvish. Each dawn there is a 50 percent chance you grow a full beard, if you are capable of growing one.",
  },
  {
    name: "Belt of Fire Giant Strength",
    type: "Wondrous Item",
    rarity: "Very Rare",
    attunement: true,
    description:
      "While wearing this belt, your Strength score is 25. The belt has no effect on you if your Strength is already equal to or greater than that score.",
  },
  {
    name: "Belt of Frost Giant Strength",
    type: "Wondrous Item",
    rarity: "Very Rare",
    attunement: true,
    description:
      "While wearing this belt, your Strength score is 23. The belt has no effect on you if your Strength is already equal to or greater than that score.",
  },
  {
    name: "Belt of Hill Giant Strength",
    type: "Wondrous Item",
    rarity: "Rare",
    attunement: true,
    description:
      "While wearing this belt, your Strength score is 21. The belt has no effect on you if your Strength is already equal to or greater than that score.",
  },
  {
    name: "Belt of Stone Giant Strength",
    type: "Wondrous Item",
    rarity: "Very Rare",
    attunement: true,
    description:
      "While wearing this belt, your Strength score is 23. The belt has no effect on you if your Strength is already equal to or greater than that score.",
  },
  {
    name: "Belt of Storm Giant Strength",
    type: "Wondrous Item",
    rarity: "Legendary",
    attunement: true,
    description:
      "While wearing this belt, your Strength score is 29. The belt has no effect on you if your Strength is already equal to or greater than that score.",
  },
  {
    name: "Boots of Elvenkind",
    type: "Wondrous Item",
    rarity: "Uncommon",
    description:
      "While you wear these boots, your steps make no sound, regardless of the surface you are moving across. You also have Advantage on Dexterity (Stealth) checks that rely on moving silently.",
  },
  {
    name: "Boots of Levitation",
    type: "Wondrous Item",
    rarity: "Rare",
    attunement: true,
    description:
      "While you wear these boots, you can cast the Levitate spell on yourself at will.",
  },
  {
    name: "Boots of Speed",
    type: "Wondrous Item",
    rarity: "Rare",
    attunement: true,
    description:
      "While you wear these boots, you can take a Bonus Action to click their heels together, doubling your Speed, and any creature that makes an Opportunity Attack against you has Disadvantage on the attack roll. Clicking your heels again ends the effect. When the property has been used for a total of 10 minutes, it stops functioning until you finish a Long Rest.",
  },
  {
    name: "Boots of Striding and Springing",
    type: "Wondrous Item",
    rarity: "Uncommon",
    attunement: true,
    description:
      "While you wear these boots, your Speed becomes 30 feet unless it is higher, and it isn't reduced by encumbrance or by wearing heavy armor. In addition, you can jump three times the normal distance, though you can't jump farther than your remaining movement allows.",
  },
  {
    name: "Boots of the Winterlands",
    type: "Wondrous Item",
    rarity: "Uncommon",
    attunement: true,
    description:
      "While you wear these furred boots, you have Resistance to Cold damage and ignore Difficult Terrain created by ice or snow. You can tolerate temperatures as low as -50 degrees Fahrenheit without additional protection, or as low as -100 degrees Fahrenheit if you wear heavy clothes.",
  },
  {
    name: "Bowl of Commanding Water Elementals",
    type: "Wondrous Item",
    rarity: "Rare",
    description:
      "While this bowl, about 1 foot across and holding about 3 gallons, is filled with water, you can take an action to speak its command word and summon a water elemental, as if you had cast the Conjure Elemental spell. The bowl can't be used this way again until the next dawn.",
  },
  {
    name: "Bracers of Archery",
    type: "Wondrous Item",
    rarity: "Uncommon",
    attunement: true,
    description:
      "While wearing these bracers, you have proficiency with the Longbow and Shortbow, and you gain a +2 bonus to damage rolls on ranged attacks made with such weapons.",
  },
  {
    name: "Bracers of Defense",
    type: "Wondrous Item",
    rarity: "Rare",
    attunement: true,
    description:
      "While wearing these bracers, you gain a +2 bonus to Armor Class if you are wearing no armor and using no Shield.",
  },
  {
    name: "Brazier of Commanding Fire Elementals",
    type: "Wondrous Item",
    rarity: "Rare",
    description:
      "While a fire burns in this 5-pound brass brazier, you can take an action to speak its command word and summon a fire elemental, as if you had cast the Conjure Elemental spell. The brazier can't be used this way again until the next dawn.",
  },
  {
    name: "Brooch of Shielding",
    type: "Wondrous Item",
    rarity: "Uncommon",
    attunement: true,
    description:
      "While wearing this brooch, you have Resistance to Force damage, and you have Immunity to damage from the Magic Missile spell.",
  },
  {
    name: "Broom of Flying",
    type: "Wondrous Item",
    rarity: "Uncommon",
    description:
      "This 3-pound broom functions like a mundane broom until you stand astride it and speak its command word. It then hovers beneath you and has a Fly Speed of 50 feet, carrying up to 400 pounds, though its speed drops to 30 feet while carrying over 200 pounds. You can send it alone to a familiar destination within 1 mile, and another command word calls it back if it is still within 1 mile.",
  },
  {
    name: "Candle of Invocation",
    type: "Wondrous Item",
    rarity: "Very Rare",
    attunement: true,
    description:
      "This taper is dedicated to a deity and shares its alignment. Lighting it takes an action; it burns for a total of 4 hours (in 1-minute increments if snuffed) and sheds Dim Light in a 30-foot radius. Creatures in that light whose alignment matches the candle's have Advantage on attack rolls, saving throws, and ability checks, and a Cleric or Druid of matching alignment can cast level 1 spells they have prepared without expending spell slots. Alternatively, when you first light it, you can cast Gate with it, which destroys the candle.",
  },
  {
    name: "Cap of Water Breathing",
    type: "Wondrous Item",
    rarity: "Uncommon",
    description:
      "While wearing this cap underwater, you can take an action to speak its command word and create a bubble of air around your head that lets you breathe normally underwater. The bubble stays with you until you speak the command word again, the cap is removed, or you are no longer underwater.",
  },
  {
    name: "Cape of the Mountebank",
    type: "Wondrous Item",
    rarity: "Rare",
    description:
      "This cape smells faintly of brimstone. While wearing it, you can use it to cast the Dimension Door spell as an action; this property can't be used again until the next dawn. You vanish and reappear in clouds of smoke that Lightly Obscure the spaces you left and arrive in until the end of your next turn; a light or stronger wind disperses the smoke.",
  },
  {
    name: "Carpet of Flying",
    type: "Wondrous Item",
    rarity: "Very Rare",
    description:
      "You can speak this carpet's command word to make it hover and fly at your direction. Its size determines its capacity and Fly Speed: 3 by 5 feet (200 pounds, 80 feet), 4 by 6 feet (400 pounds, 60 feet), 5 by 7 feet (600 pounds, 40 feet), or 6 by 9 feet (800 pounds, 30 feet). It can carry up to twice its normal capacity, but flies at half speed if it carries more than that.",
  },
  {
    name: "Censer of Controlling Air Elementals",
    type: "Wondrous Item",
    rarity: "Rare",
    description:
      "While incense burns in this 1-pound censer, you can take an action to speak its command word and summon an air elemental, as if you had cast the Conjure Elemental spell. The censer can't be used this way again until the next dawn.",
  },
  {
    name: "Chime of Opening",
    type: "Wondrous Item",
    rarity: "Rare",
    description:
      "This 1-foot hollow metal tube can be struck as an action while pointed at an object within 120 feet that can be opened, such as a door, lid, or lock. One lock or latch on the object opens unless the sound can't reach it; if no locks or latches remain, the object itself opens. The chime can be used ten times, after which it cracks and becomes useless.",
  },
  {
    name: "Circlet of Blasting",
    type: "Wondrous Item",
    rarity: "Uncommon",
    description:
      "While wearing this circlet, you can take an action to cast the Scorching Ray spell with it, making the spell's attacks with an attack bonus of +5. The circlet can't be used this way again until the next dawn.",
  },
  {
    name: "Cloak of Arachnida",
    type: "Wondrous Item",
    rarity: "Very Rare",
    attunement: true,
    description:
      "While wearing this cloak, you have Resistance to Poison damage, a Climb Speed equal to your Speed, and the ability to move along vertical surfaces and upside down on ceilings with your hands free. You can't be caught in webs of any sort and can move through them as if they were Difficult Terrain. As an action you can cast Web (save DC 13) from the cloak, filling twice the normal area; this property can't be used again until the next dawn.",
  },
  {
    name: "Cloak of Displacement",
    type: "Wondrous Item",
    rarity: "Rare",
    attunement: true,
    description:
      "While you wear this cloak, it projects an illusion that makes you appear to be standing near your actual location, so any creature has Disadvantage on attack rolls against you. If you take damage, the property ceases to function until the start of your next turn. It is suppressed while you are Incapacitated, Restrained, or otherwise unable to move.",
  },
  {
    name: "Cloak of Elvenkind",
    type: "Wondrous Item",
    rarity: "Uncommon",
    attunement: true,
    description:
      "While you wear this cloak with its hood up, Wisdom (Perception) checks made to see you have Disadvantage, and you have Advantage on Dexterity (Stealth) checks, as the cloak's color shifts to camouflage you. Pulling the hood up or down takes an action.",
  },
  {
    name: "Cloak of Protection",
    type: "Wondrous Item",
    rarity: "Uncommon",
    attunement: true,
    description: "You gain a +1 bonus to Armor Class and saving throws while you wear this cloak.",
  },
  {
    name: "Cloak of the Bat",
    type: "Wondrous Item",
    rarity: "Rare",
    attunement: true,
    description:
      "While wearing this cloak, you have Advantage on Dexterity (Stealth) checks. In Dim Light or Darkness, you can grip its edges with both hands to fly at a Speed of 40 feet, losing the speed if you let go or leave the dim light or darkness. While in Dim Light or Darkness, you can also take an action to cast Polymorph on yourself, becoming a Bat while keeping your Intelligence, Wisdom, and Charisma; this property can't be used again until the next dawn.",
  },
  {
    name: "Cloak of the Manta Ray",
    type: "Wondrous Item",
    rarity: "Uncommon",
    description:
      "While wearing this cloak with its hood up, you can breathe underwater, and you have a Swim Speed of 60 feet. Pulling the hood up or down takes an action.",
  },
  {
    name: "Crystal Ball",
    type: "Wondrous Item",
    rarity: "Very Rare",
    attunement: true,
    description:
      "This crystal sphere is about 6 inches in diameter. While touching it, you can cast the Scrying spell (save DC 17) with it.",
  },
  {
    name: "Crystal Ball of Mind Reading",
    type: "Wondrous Item",
    rarity: "Legendary",
    attunement: true,
    description:
      "While touching this crystal ball, you can cast Scrying (save DC 17) with it. While scrying, you can take an action to cast Detect Thoughts (save DC 17) on creatures you can see within 30 feet of the spell's sensor. You don't need to concentrate on Detect Thoughts, but it ends if the Scrying ends.",
  },
  {
    name: "Crystal Ball of Telepathy",
    type: "Wondrous Item",
    rarity: "Legendary",
    attunement: true,
    description:
      "While touching this crystal ball, you can cast Scrying (save DC 17) with it. While scrying, you can communicate telepathically with creatures you can see within 30 feet of the spell's sensor, and you can take an action to cast Suggestion (save DC 17) through the sensor on one of them, without Concentration, though it ends if the Scrying ends. The Suggestion power can't be used again until the next dawn.",
  },
  {
    name: "Crystal Ball of True Seeing",
    type: "Wondrous Item",
    rarity: "Legendary",
    attunement: true,
    description:
      "While touching this crystal ball, you can cast Scrying (save DC 17) with it. While scrying, you have Truesight with a radius of 120 feet centered on the spell's sensor.",
  },
  {
    name: "Cube of Force",
    type: "Wondrous Item",
    rarity: "Rare",
    attunement: true,
    description:
      "This cube has 36 charges and regains 1d20 expended charges daily at dawn. As an action you can press one of its faces to create a 15-foot Cube barrier centered on you that moves with you and lasts 1 minute. Face 1 (1 charge) blocks gases, wind, and fog; face 2 (2 charges) blocks nonliving matter; face 3 (3 charges) blocks living matter; face 4 (4 charges) blocks spell effects; face 5 (5 charges) blocks everything; face 6 deactivates the barrier. Certain spells and effects that strike the barrier drain additional charges.",
  },
  {
    name: "Cubic Gate",
    type: "Wondrous Item",
    rarity: "Legendary",
    description:
      "This 3-inch cube has six sides, each keyed to a different plane of existence, one of which is the Material Plane. It has 3 charges and regains 1d3 expended charges daily at dawn. As an action you can expend 1 charge by pressing a side to cast Gate, opening a portal to that side's plane, or press a side twice to cast Plane Shift (save DC 17) and transport the targets to that plane.",
  },
  {
    name: "Decanter of Endless Water",
    type: "Wondrous Item",
    rarity: "Uncommon",
    description:
      "As an action you can remove this flask's stopper and speak one of three command words to pour fresh or salt water until the start of your next turn: Stream (1 gallon), Fountain (5 gallons), or Geyser (30 gallons in a 30-foot-long, 1-foot-wide jet). As a Bonus Action you can aim the geyser at a creature within 30 feet, which must succeed on a DC 13 Strength saving throw or take 1d4 Bludgeoning damage and fall Prone, or at an unattended object weighing up to 200 pounds to knock it over or push it up to 15 feet.",
  },
  {
    name: "Deck of Illusions",
    type: "Wondrous Item",
    rarity: "Uncommon",
    description:
      "This box holds up to 34 parchment cards (often missing 1d20 - 1). As an action you can draw a random card and throw it to a point within 30 feet, where an illusion of one or more creatures forms over it and remains until dispelled or the card is moved. The illusion looks real but can do no harm; while within 120 feet you can take an action to move it anywhere within 30 feet of its card. Physical interaction reveals it, as does a DC 15 Intelligence (Investigation) check, and a used card's image disappears for good.",
  },
  {
    name: "Deck of Many Things",
    type: "Wondrous Item",
    rarity: "Legendary",
    description:
      "This deck of ivory or vellum cards usually holds 13 cards, though some hold 22. Before drawing, you must declare how many cards you will draw, then draw them randomly, each no more than 1 hour after the previous one. Each card's magic takes effect as soon as it is drawn and can be wondrous or ruinous: granting wishes, fortunes, allies, or levels, or summoning death, imprisoning your soul, stripping your possessions, or cursing you. Unless the card is the Fool or the Jester, it reappears in the deck after being drawn.",
  },
  {
    name: "Dimensional Shackles",
    type: "Wondrous Item",
    rarity: "Rare",
    description:
      "As an action you can place these shackles on an Incapacitated creature; they adjust to fit a creature of Small to Large size. They act as mundane manacles and also prevent the shackled creature from using any method of extradimensional movement, including teleportation or travel to a different plane. You and any creature you designate can remove them as an action. Once every 30 days, the shackled creature can make a DC 30 Strength (Athletics) check, breaking free and destroying the shackles on a success.",
  },
  {
    name: "Driftglobe",
    type: "Wondrous Item",
    rarity: "Uncommon",
    description:
      "This small glass sphere weighs 1 pound. If you are within 60 feet of it, you can speak its command word to make it emanate the Light spell, or the Daylight spell, which can't be used again until the next dawn. Another command word makes the lit globe rise and float no more than 5 feet off the ground; it hovers until grasped and follows you to stay within 60 feet of you.",
  },
  {
    name: "Dust of Disappearance",
    type: "Wondrous Item",
    rarity: "Uncommon",
    description:
      "Found in a small packet, this powder is enough for one use. When you take an action to throw it into the air, you and each creature and object within 10 feet of you become Invisible for 2d4 minutes. If an affected creature attacks or casts a spell, the invisibility ends for that creature.",
  },
  {
    name: "Dust of Dryness",
    type: "Wondrous Item",
    rarity: "Uncommon",
    description:
      "This packet holds 1d6 + 4 pinches of dust. As an action you can sprinkle a pinch over water, turning a 15-foot Cube of water into a marble-sized pellet; smashing the pellet releases the water. An Elemental composed mostly of water that is exposed to a pinch must make a DC 13 Constitution saving throw, taking 10d6 Necrotic damage on a failure or half as much on a success.",
  },
  {
    name: "Dust of Sneezing and Choking",
    type: "Wondrous Item",
    rarity: "Uncommon",
    description:
      "This powder looks like Dust of Disappearance, and the Identify spell reveals it to be such. When you take an action to throw it into the air, you and each creature that needs to breathe within 30 feet of you must succeed on a DC 15 Constitution saving throw or become unable to breathe while sneezing uncontrollably, which leaves it Incapacitated and suffocating. An affected creature repeats the save at the end of each of its turns, and Lesser Restoration also ends the effect.",
  },
  {
    name: "Efficient Quiver",
    type: "Wondrous Item",
    rarity: "Uncommon",
    description:
      "Each of this quiver's three compartments connects to an extradimensional space, and the quiver never weighs more than 2 pounds. The shortest compartment holds up to sixty arrows or bolts, the midsize one up to eighteen javelins, and the longest up to six long objects such as bows, quarterstaffs, or spears. You can draw any item it holds as if from a regular quiver or scabbard.",
  },
  {
    name: "Efreeti Bottle",
    type: "Wondrous Item",
    rarity: "Very Rare",
    description:
      "When you take an action to remove this brass bottle's stopper, an efreeti appears in an unoccupied space within 30 feet of you. Roll a d100: on 01 to 10 it attacks you and leaves after 5 rounds; on 11 to 90 it serves you for 1 hour and then returns to the bottle, which can't be opened for 24 hours (this repeats the next two times, and the fourth time it escapes and the bottle loses its magic); on 91 to 100 it grants you three wishes, as the Wish spell, and then departs.",
  },
  {
    name: "Elemental Gem",
    type: "Wondrous Item",
    rarity: "Uncommon",
    description:
      "This gem contains a mote of elemental energy. When you take an action to break it, an elemental is summoned as if you had cast Conjure Elemental, and the gem's magic is lost. The gem determines the elemental: blue sapphire (air), yellow diamond (earth), red corundum (fire), or emerald (water).",
  },
  {
    name: "Eversmoking Bottle",
    type: "Wondrous Item",
    rarity: "Uncommon",
    description:
      "When you take an action to remove this brass bottle's stopper, thick smoke pours out in a 60-foot radius, Heavily Obscuring the area; each minute the bottle stays open within the cloud, the radius grows by 10 feet, to a maximum of 120 feet. Closing the bottle requires speaking its command word as an action, after which the cloud disperses in 10 minutes. A moderate wind disperses the smoke after 1 minute, and a strong wind after 1 round.",
  },
  {
    name: "Eyes of Charming",
    type: "Wondrous Item",
    rarity: "Uncommon",
    attunement: true,
    description:
      "These crystal lenses have 3 charges. While wearing them, you can expend 1 charge as an action to cast Charm Person (save DC 13) on a Humanoid within 30 feet, provided you and the target can see each other. The lenses regain all expended charges daily at dawn.",
  },
  {
    name: "Eyes of Minute Seeing",
    type: "Wondrous Item",
    rarity: "Uncommon",
    description:
      "While wearing these crystal lenses, you can see much better than normal out to a range of 1 foot. You have Advantage on Intelligence (Investigation) checks that rely on sight while searching an area or studying an object within that range.",
  },
  {
    name: "Eyes of the Eagle",
    type: "Wondrous Item",
    rarity: "Uncommon",
    attunement: true,
    description:
      "While wearing these crystal lenses, you have Advantage on Wisdom (Perception) checks that rely on sight. In conditions of clear visibility, you can make out details of even extremely distant creatures and objects as small as 2 feet across.",
  },
  {
    name: "Feather Token",
    type: "Wondrous Item",
    rarity: "Rare",
    note: "Varieties: Anchor, Bird, Fan, Swan Boat, Tree, and Whip.",
    description:
      "This tiny object looks like a feather and has a single-use effect determined by its type. Anchor stops a vessel in place for 24 hours. Bird becomes a huge bird that can carry you and others on a long flight. Fan creates a magical wind that drives a sailing ship for 8 hours. Swan Boat becomes a large swan-shaped boat for 24 hours. Tree becomes a nonmagical oak 60 feet tall. Whip becomes a floating whip that attacks your foes for 1 hour.",
  },
  {
    name: "Figurine of Wondrous Power",
    type: "Wondrous Item",
    rarity: "Rare",
    note: "Rarity by figurine: Bronze Griffon (rare), Ebony Fly (rare), Golden Lions (rare), Ivory Goats (rare), Marble Elephant (rare), Obsidian Steed (very rare), Onyx Dog (rare), Serpentine Owl (rare), Silver Raven (uncommon).",
    description:
      "This statuette of a beast fits in a pocket. As an action you can speak its command word and throw it to a point on the ground within 60 feet, where it becomes a living creature that is friendly to you, understands your languages, and obeys your commands. It lasts for a duration set by the figurine, reverting early if it drops to 0 Hit Points or you speak the command word again while touching it, and it can't be used again until a set period (from days to a week) has passed.",
  },
  {
    name: "Folding Boat",
    type: "Wondrous Item",
    rarity: "Rare",
    description:
      "This wooden box measures 12 by 6 by 6 inches. One command word unfolds it into a 10-foot rowboat with oars, an anchor, a mast, and a sail that holds four Medium creatures; a second unfolds it into a 24-foot ship with a deck, rowing seats, five sets of oars, a deck cabin, and a square sail that holds fifteen Medium creatures. A third command word folds it back into a box, provided no creatures are aboard, and anything stored in the box stays in the vessel.",
  },
  {
    name: "Gauntlets of Ogre Power",
    type: "Wondrous Item",
    rarity: "Uncommon",
    attunement: true,
    description:
      "Your Strength score is 19 while you wear these gauntlets. They have no effect on you if your Strength is already 19 or higher.",
  },
  {
    name: "Gem of Brightness",
    type: "Wondrous Item",
    rarity: "Uncommon",
    description:
      "This prism has 50 charges. As an action you can speak one of three command words: the first makes it shed Bright Light in a 30-foot radius and Dim Light for an additional 30 feet (no charge); the second expends 1 charge to fire a beam at a creature within 60 feet, which must succeed on a DC 15 Constitution saving throw or be Blinded for 1 minute; the third expends 5 charges to flare in a 30-foot Cone, with the same save against blindness for each creature in it. When all charges are spent, it becomes a nonmagical gem worth 50 GP.",
  },
  {
    name: "Gem of Seeing",
    type: "Wondrous Item",
    rarity: "Rare",
    attunement: true,
    description:
      "This gem has 3 charges and regains 1d3 expended charges daily at dawn. As an action you can speak its command word and expend 1 charge; for the next 10 minutes, you have Truesight out to 120 feet when you peer through the gem.",
  },
  {
    name: "Gloves of Missile Snaring",
    type: "Wondrous Item",
    rarity: "Uncommon",
    attunement: true,
    description:
      "When a ranged weapon attack hits you while you're wearing these gloves, you can take a Reaction to reduce the damage by 1d10 + your Dexterity modifier, provided you have a free hand. If you reduce the damage to 0, you can catch the missile if it is small enough to hold in that hand.",
  },
  {
    name: "Gloves of Swimming and Climbing",
    type: "Wondrous Item",
    rarity: "Uncommon",
    attunement: true,
    description:
      "While wearing these gloves, climbing and swimming don't cost you extra movement, and you gain a +5 bonus to Strength (Athletics) checks made to climb or swim.",
  },
  {
    name: "Goggles of Night",
    type: "Wondrous Item",
    rarity: "Uncommon",
    description:
      "While wearing these dark lenses, you have Darkvision out to 60 feet. If you already have Darkvision, wearing the goggles increases its range by 60 feet.",
  },
  {
    name: "Handy Haversack",
    type: "Wondrous Item",
    rarity: "Rare",
    description:
      "This backpack has a central pouch and two side pouches, each an extradimensional space; it always weighs 5 pounds. Each side pouch holds up to 20 pounds (2 cubic feet), and the central pouch holds up to 80 pounds (8 cubic feet). Retrieving an item takes an action, and the item you want is always magically on top. Like a Bag of Holding, it ruptures if overloaded, pierced, or torn, and putting it inside another extradimensional space destroys both and opens a gate to the Astral Plane.",
  },
  {
    name: "Hat of Disguise",
    type: "Wondrous Item",
    rarity: "Uncommon",
    attunement: true,
    description:
      "While wearing this hat, you can take an action to cast the Disguise Self spell from it at will. The spell ends if the hat is removed.",
  },
  {
    name: "Headband of Intellect",
    type: "Wondrous Item",
    rarity: "Uncommon",
    attunement: true,
    description:
      "Your Intelligence score is 19 while you wear this headband. It has no effect on you if your Intelligence is already 19 or higher.",
  },
  {
    name: "Helm of Brilliance",
    type: "Wondrous Item",
    rarity: "Very Rare",
    attunement: true,
    description:
      "This helm is set with 1d10 diamonds, 2d10 rubies, 3d10 fire opals, and 4d10 opals. As an action you can expend a gem to cast Daylight (opal), Fireball (fire opal), Prismatic Spray (diamond), or Wall of Fire (ruby), save DC 18. While it has a diamond, it glows when Undead are within 30 feet and deals them 1d6 Radiant damage each turn; with a ruby you have Resistance to Fire damage; with a fire opal you can wreathe a held weapon in flames that deal an extra 1d6 Fire damage. If you fail a save against a fire spell and roll a 1 on a d20, the helm bursts in beams of light and is destroyed.",
  },
  {
    name: "Helm of Comprehending Languages",
    type: "Wondrous Item",
    rarity: "Uncommon",
    description:
      "While wearing this helm, you can cast the Comprehend Languages spell from it at will.",
  },
  {
    name: "Helm of Telepathy",
    type: "Wondrous Item",
    rarity: "Uncommon",
    attunement: true,
    description:
      "While wearing this helm, you can cast Detect Thoughts (save DC 13) from it. While concentrating on the spell, you can send a telepathic message as a Bonus Action to a creature you are focused on, and it can reply the same way. While focusing on a creature with Detect Thoughts, you can also take an action to cast Suggestion (save DC 13) on it; this property can't be used again until the next dawn.",
  },
  {
    name: "Helm of Teleportation",
    type: "Wondrous Item",
    rarity: "Rare",
    attunement: true,
    description:
      "This helm has 3 charges. While wearing it, you can take an action and expend 1 charge to cast the Teleport spell from it. The helm regains 1d3 expended charges daily at dawn.",
  },
  {
    name: "Horn of Blasting",
    type: "Wondrous Item",
    rarity: "Rare",
    description:
      "As an action you can speak this horn's command word and blow it, emitting a thunderous blast in a 30-foot Cone audible 600 feet away. Each creature in the cone makes a DC 15 Constitution saving throw, taking 5d6 Thunder damage and becoming Deafened for 1 minute on a failure, or half damage and no deafness on a success. Glass or crystal creatures and objects have Disadvantage on the save and take 10d6 Thunder damage instead. Each use has a 20 percent chance of making the horn explode, dealing 10d6 Fire damage to the blower and destroying the horn.",
  },
  {
    name: "Horn of Valhalla",
    type: "Wondrous Item",
    rarity: "Rare",
    note: "Rarity varies: silver (rare, 2d4 spirits), brass (rare, 3d4), bronze (very rare, 4d4), iron (legendary, 5d4).",
    description:
      "As an action you can blow this horn to summon warrior spirits from Ysgard, which appear within 60 feet of you as Berserkers; the number depends on the horn's metal. They return after 1 hour or when they drop to 0 Hit Points, and the horn can't be used again until 7 days have passed. Brass, bronze, and iron horns require the blower to have proficiency with all Simple weapons, Medium armor, or all Martial weapons respectively; if you blow a horn without meeting its requirement, the berserkers attack you, otherwise they are friendly and follow your commands.",
  },
  {
    name: "Horseshoes of a Zephyr",
    type: "Wondrous Item",
    rarity: "Very Rare",
    description:
      "These iron horseshoes come in a set of four. While all four are affixed to the hooves of a horse or similar creature, it moves normally while floating 4 inches above the ground, so it can cross or stand above water, lava, and other nonsolid surfaces. The creature leaves no tracks, ignores Difficult Terrain, and can move at normal speed for up to 12 hours a day without suffering Exhaustion from a forced march.",
  },
  {
    name: "Horseshoes of Speed",
    type: "Wondrous Item",
    rarity: "Rare",
    description:
      "These iron horseshoes come in a set of four. While all four are affixed to the hooves of a horse or similar creature, they increase the creature's Speed by 30 feet.",
  },
  {
    name: "Instant Fortress",
    type: "Wondrous Item",
    rarity: "Rare",
    description:
      "As an action you can place this 1-inch metal cube on the ground and speak its command word, and it grows into an adamantine tower 20 feet on a side and 30 feet high, with arrow slits, a battlement, two floors, and a door that opens only at your command. Each creature in the area where it appears makes a DC 15 Dexterity saving throw, taking 10d10 Bludgeoning damage on a failure or half on a success. The roof, door, and walls each have 100 Hit Points, Immunity to damage from nonmagical weapons other than siege weapons, and Resistance to all other damage. Another command word shrinks it back, but only if it is empty.",
  },
  {
    name: "Ioun Stone (Absorption)",
    type: "Wondrous Item",
    rarity: "Very Rare",
    attunement: true,
    description:
      "While this pale lavender ellipsoid orbits your head, you can take a Reaction to cancel a spell of level 4 or lower cast by a creature you can see and targeting only you. Once the stone has canceled 20 levels of spells, it burns out, turns dull gray, and loses its magic. An Ioun stone orbits 1d3 feet from your head; another creature must hit AC 24 or succeed on a DC 24 Dexterity (Acrobatics) check to snatch it.",
  },
  {
    name: "Ioun Stone (Agility)",
    type: "Wondrous Item",
    rarity: "Very Rare",
    attunement: true,
    description:
      "Your Dexterity score increases by 2, to a maximum of 20, while this deep red sphere orbits your head. An Ioun stone orbits 1d3 feet from your head; you can seize and stow it as an action, ending its effect.",
  },
  {
    name: "Ioun Stone (Awareness)",
    type: "Wondrous Item",
    rarity: "Rare",
    attunement: true,
    description:
      "You can't be surprised while this dark blue rhomboid orbits your head. An Ioun stone orbits 1d3 feet from your head; you can seize and stow it as an action, ending its effect.",
  },
  {
    name: "Ioun Stone (Fortitude)",
    type: "Wondrous Item",
    rarity: "Very Rare",
    attunement: true,
    description:
      "Your Constitution score increases by 2, to a maximum of 20, while this pink rhomboid orbits your head. An Ioun stone orbits 1d3 feet from your head; you can seize and stow it as an action, ending its effect.",
  },
  {
    name: "Ioun Stone (Greater Absorption)",
    type: "Wondrous Item",
    rarity: "Legendary",
    attunement: true,
    description:
      "While this marbled lavender and green ellipsoid orbits your head, you can take a Reaction to cancel a spell of level 8 or lower cast by a creature you can see and targeting only you. Once the stone has canceled 50 levels of spells, it burns out, turns dull gray, and loses its magic.",
  },
  {
    name: "Ioun Stone (Insight)",
    type: "Wondrous Item",
    rarity: "Very Rare",
    attunement: true,
    description:
      "Your Wisdom score increases by 2, to a maximum of 20, while this incandescent blue sphere orbits your head. An Ioun stone orbits 1d3 feet from your head; you can seize and stow it as an action, ending its effect.",
  },
  {
    name: "Ioun Stone (Intellect)",
    type: "Wondrous Item",
    rarity: "Very Rare",
    attunement: true,
    description:
      "Your Intelligence score increases by 2, to a maximum of 20, while this marbled scarlet and blue sphere orbits your head. An Ioun stone orbits 1d3 feet from your head; you can seize and stow it as an action, ending its effect.",
  },
  {
    name: "Ioun Stone (Leadership)",
    type: "Wondrous Item",
    rarity: "Very Rare",
    attunement: true,
    description:
      "Your Charisma score increases by 2, to a maximum of 20, while this marbled pink and green sphere orbits your head. An Ioun stone orbits 1d3 feet from your head; you can seize and stow it as an action, ending its effect.",
  },
  {
    name: "Ioun Stone (Mastery)",
    type: "Wondrous Item",
    rarity: "Legendary",
    attunement: true,
    description:
      "Your Proficiency Bonus increases by 1 while this pale green prism orbits your head. An Ioun stone orbits 1d3 feet from your head; you can seize and stow it as an action, ending its effect.",
  },
  {
    name: "Ioun Stone (Protection)",
    type: "Wondrous Item",
    rarity: "Rare",
    attunement: true,
    description:
      "You gain a +1 bonus to Armor Class while this dusty rose prism orbits your head. An Ioun stone orbits 1d3 feet from your head; you can seize and stow it as an action, ending its effect.",
  },
  {
    name: "Ioun Stone (Regeneration)",
    type: "Wondrous Item",
    rarity: "Legendary",
    attunement: true,
    description:
      "You regain 15 Hit Points at the end of each hour this pearly white spindle orbits your head, provided you have at least 1 Hit Point. An Ioun stone orbits 1d3 feet from your head; you can seize and stow it as an action, ending its effect.",
  },
  {
    name: "Ioun Stone (Reserve)",
    type: "Wondrous Item",
    rarity: "Rare",
    attunement: true,
    description:
      "This vibrant purple prism stores spells cast into it, holding up to 3 levels' worth at a time (it is found with 1d4 - 1 levels stored). Any creature can cast a level 1 to 3 spell into it by touching it as the spell is cast. While the stone orbits your head, you can cast any spell stored in it, using the original caster's slot level, save DC, attack bonus, and spellcasting ability.",
  },
  {
    name: "Ioun Stone (Strength)",
    type: "Wondrous Item",
    rarity: "Very Rare",
    attunement: true,
    description:
      "Your Strength score increases by 2, to a maximum of 20, while this pale blue rhomboid orbits your head. An Ioun stone orbits 1d3 feet from your head; you can seize and stow it as an action, ending its effect.",
  },
  {
    name: "Ioun Stone (Sustenance)",
    type: "Wondrous Item",
    rarity: "Rare",
    attunement: true,
    description:
      "You don't need to eat or drink while this clear spindle orbits your head. An Ioun stone orbits 1d3 feet from your head; you can seize and stow it as an action, ending its effect.",
  },
  {
    name: "Iron Bands",
    type: "Wondrous Item",
    rarity: "Rare",
    note: "Named Iron Bands of Binding in SRD 5.1.",
    description:
      "As an action you can speak this 3-inch iron sphere's command word and throw it at a Huge or smaller creature you can see within 60 feet, making a ranged attack with a bonus equal to your Dexterity modifier plus your Proficiency Bonus. On a hit, the sphere opens into metal bands and the target has the Restrained condition until you take a Bonus Action to speak the command word again. A creature can take an action to make a DC 20 Strength check to break the bands, destroying them on a success; a failed creature can't try again for 24 hours. The bands can't be used again until the next dawn.",
  },
  {
    name: "Iron Flask",
    type: "Wondrous Item",
    rarity: "Legendary",
    description:
      "As an action you can speak this brass-stoppered flask's command word and target a creature you can see within 60 feet. If the target is native to a plane other than the one you're on, it must succeed on a DC 17 Wisdom saving throw (with Advantage if it has been trapped before) or be trapped in the flask, which holds one creature at a time. As an action you can release the creature, which is friendly to you and your companions and obeys your commands for 1 hour, then acts according to its nature.",
  },
  {
    name: "Lantern of Revealing",
    type: "Wondrous Item",
    rarity: "Uncommon",
    description:
      "While lit, this hooded lantern burns for 6 hours on 1 pint of oil, shedding Bright Light in a 30-foot radius and Dim Light for an additional 30 feet. Invisible creatures and objects are visible as long as they are in the lantern's bright light. As an action you can lower the hood, reducing the light to Dim Light in a 5-foot radius.",
  },
  {
    name: "Mantle of Spell Resistance",
    type: "Wondrous Item",
    rarity: "Rare",
    attunement: true,
    description: "You have Advantage on saving throws against spells while you wear this cloak.",
  },
  {
    name: "Manual of Bodily Health",
    type: "Wondrous Item",
    rarity: "Very Rare",
    description:
      "This book contains health and diet tips. If you spend 48 hours over a period of 6 days or fewer studying its contents and practicing its guidelines, your Constitution score increases by 2, as does your maximum for that score. The manual then loses its magic, but regains it in a century.",
  },
  {
    name: "Manual of Gainful Exercise",
    type: "Wondrous Item",
    rarity: "Very Rare",
    description:
      "This book describes fitness exercises. If you spend 48 hours over a period of 6 days or fewer studying its contents and practicing its guidelines, your Strength score increases by 2, as does your maximum for that score. The manual then loses its magic, but regains it in a century.",
  },
  {
    name: "Manual of Golems",
    type: "Wondrous Item",
    rarity: "Very Rare",
    description:
      "This tome contains the information and incantations needed to make one kind of golem. Only a spellcaster with at least two level 5 spell slots can decipher it; any other creature that reads it takes 6d6 Psychic damage. Creating the golem requires uninterrupted work and costly supplies: clay (30 days, 65,000 GP), flesh (60 days, 50,000 GP), iron (120 days, 100,000 GP), or stone (90 days, 80,000 GP). When the golem is finished, the book is consumed in eldritch flames, and sprinkling its ashes on the golem animates it under your control.",
  },
  {
    name: "Manual of Quickness of Action",
    type: "Wondrous Item",
    rarity: "Very Rare",
    description:
      "This book contains coordination and balance exercises. If you spend 48 hours over a period of 6 days or fewer studying its contents and practicing its guidelines, your Dexterity score increases by 2, as does your maximum for that score. The manual then loses its magic, but regains it in a century.",
  },
  {
    name: "Marvelous Pigments",
    type: "Wondrous Item",
    rarity: "Very Rare",
    description:
      "Typically found as 1d4 pots in a wooden box with a brush, these pigments let you create three-dimensional objects by painting them in two dimensions. Each pot covers 1,000 square feet, enough to create inanimate objects or terrain features such as a door, pit, tree, or room of up to 10,000 cubic feet; painting 100 square feet takes 10 minutes. Nothing created can be worth more than 25 GP, and painted energy such as fire or lightning dissipates harmlessly as soon as the painting is done.",
  },
  {
    name: "Medallion of Thoughts",
    type: "Wondrous Item",
    rarity: "Uncommon",
    attunement: true,
    description:
      "This medallion has 3 charges. While wearing it, you can take an action and expend 1 charge to cast Detect Thoughts (save DC 13) from it. The medallion regains 1d3 expended charges daily at dawn.",
  },
  {
    name: "Mirror of Life Trapping",
    type: "Wondrous Item",
    rarity: "Very Rare",
    description:
      "This 4-foot mirror (50 pounds; AC 11, 10 Hit Points, Vulnerability to Bludgeoning damage) has twelve extradimensional cells. While it hangs on a vertical surface and you are within 5 feet, you can activate it with its command word as an action. Any creature other than you that sees its reflection in the active mirror within 30 feet must succeed on a DC 15 Charisma saving throw (with Advantage if it knows the mirror's nature; Constructs succeed automatically) or be trapped in an empty cell with all its gear. You can call out or free trapped creatures with command words, and breaking the mirror releases them all.",
  },
  {
    name: "Necklace of Adaptation",
    type: "Wondrous Item",
    rarity: "Uncommon",
    attunement: true,
    description:
      "While wearing this necklace, you can breathe normally in any environment, and you have Advantage on saving throws made against harmful gases and vapors, such as Cloudkill and Stinking Cloud effects, inhaled poisons, and the breath weapons of some dragons.",
  },
  {
    name: "Necklace of Fireballs",
    type: "Wondrous Item",
    rarity: "Rare",
    description:
      "This necklace has 1d6 + 3 beads hanging from it. As an action you can detach a bead and throw it up to 60 feet; it detonates as a level 3 Fireball (save DC 15). You can hurl multiple beads, or the whole necklace, as one action, increasing the Fireball's level by 1 for each bead beyond the first.",
  },
  {
    name: "Necklace of Prayer Beads",
    type: "Wondrous Item",
    rarity: "Rare",
    attunement: "by a Cleric, Druid, or Paladin",
    description:
      "This necklace has 1d4 + 2 magic beads, each of which lets you cast a spell as a Bonus Action using your spell save DC: Blessing (Bless), Curing (Cure Wounds at level 2 or Lesser Restoration), Favor (Greater Restoration), Smiting (Branding Smite), Summons (Planar Ally), or Wind Walking (Wind Walk). Once a bead's spell is cast, that bead can't be used again until the next dawn. If you remove a bead from the necklace, it loses its magic.",
  },
  {
    name: "Pearl of Power",
    type: "Wondrous Item",
    rarity: "Uncommon",
    attunement: "by a Spellcaster",
    description:
      "While this pearl is on your person, you can take an action to speak its command word and regain one expended spell slot of level 3 or lower (a higher-level slot comes back as a level 3 slot). Once you use the pearl, it can't be used again until the next dawn.",
  },
  {
    name: "Periapt of Health",
    type: "Wondrous Item",
    rarity: "Uncommon",
    description:
      "You are immune to contracting any disease while you wear this pendant. If you are already infected with a disease, the effects of the disease are suppressed while you wear it.",
  },
  {
    name: "Periapt of Proof against Poison",
    type: "Wondrous Item",
    rarity: "Rare",
    description:
      "This delicate silver chain has a brilliant-cut black gem pendant. While you wear it, poisons have no effect on you: you are immune to the Poisoned condition and have Immunity to Poison damage.",
  },
  {
    name: "Periapt of Wound Closure",
    type: "Wondrous Item",
    rarity: "Uncommon",
    attunement: true,
    description:
      "While you wear this pendant, you stabilize whenever you are dying at the start of your turn. In addition, whenever you roll a Hit Die to regain Hit Points, double the number of Hit Points it restores.",
  },
  {
    name: "Pipes of Haunting",
    type: "Wondrous Item",
    rarity: "Uncommon",
    description:
      "You must be proficient with wind instruments to use these pipes. They have 3 charges and regain 1d3 expended charges daily at dawn. As an action you can play them and expend 1 charge: each creature within 30 feet that hears you must succeed on a DC 15 Wisdom saving throw or have the Frightened condition for 1 minute, repeating the save at the end of each of its turns (non-hostile creatures can be allowed to succeed automatically). A creature that succeeds is immune to the pipes for 24 hours.",
  },
  {
    name: "Pipes of the Sewers",
    type: "Wondrous Item",
    rarity: "Uncommon",
    attunement: true,
    description:
      "You must be proficient with wind instruments to use these pipes. While attuned, ordinary rats and giant rats are indifferent toward you unless you threaten them. The pipes have 3 charges (regaining 1d3 daily at dawn): if you play them as an action, you can take a Bonus Action to expend 1 to 3 charges, calling one Swarm of Rats per charge from within half a mile. While you play the pipes, you can sway a swarm within 30 feet with a Charisma check contested by its Wisdom check, making it friendly for as long as you keep playing.",
  },
  {
    name: "Portable Hole",
    type: "Wondrous Item",
    rarity: "Rare",
    description:
      "This fine black cloth unfolds into a circular sheet 6 feet in diameter. As an action you can place it on a solid surface to create an extradimensional hole 10 feet deep, and as an action you can fold it up again, leaving anything inside in the extradimensional space; the hole weighs next to nothing. A creature trapped inside a folded hole can escape with a DC 10 Strength check, and a breathing creature inside can survive for up to 10 minutes before suffocating. Placing it inside a Bag of Holding or similar space destroys both and opens a gate to the Astral Plane.",
  },
  {
    name: "Robe of Eyes",
    type: "Wondrous Item",
    rarity: "Rare",
    attunement: true,
    description:
      "This robe is adorned with eyelike patterns. While you wear it, you have Advantage on Wisdom (Perception) checks that rely on sight, Darkvision out to 120 feet, and you can see Invisible creatures and objects and into the Ethereal Plane out to 120 feet; you can see in all directions and are never considered to have your eyes closed or averted. A Light spell cast on the robe or a Daylight spell within 5 feet of it Blinds you for 1 minute, with a Constitution save (DC 11 for Light, DC 15 for Daylight) at the end of each of your turns to end it.",
  },
  {
    name: "Robe of Scintillating Colors",
    type: "Wondrous Item",
    rarity: "Very Rare",
    attunement: true,
    description:
      "This robe has 3 charges and regains 1d3 expended charges daily at dawn. As an action you can expend 1 charge to make it display a shifting pattern of dazzling hues until the end of your next turn, shedding Bright Light in a 30-foot radius and Dim Light for an additional 30 feet. Creatures that can see you have Disadvantage on attack rolls against you, and any creature in the bright light that can see you when the power activates must succeed on a DC 15 Wisdom saving throw or have the Stunned condition until the effect ends.",
  },
  {
    name: "Robe of Stars",
    type: "Wondrous Item",
    rarity: "Very Rare",
    attunement: true,
    description:
      "You gain a +1 bonus to saving throws while you wear this black or dark blue robe. Six large stars embroidered on it can each be pulled off as an action to cast Magic Missile as a level 5 spell; daily at dusk, 1d6 removed stars reappear. As an action you can also enter the Astral Plane with everything you are wearing and carrying, remaining there until you take an action to return to the space you left (or the nearest unoccupied space).",
  },
  {
    name: "Robe of the Archmagi",
    type: "Wondrous Item",
    rarity: "Legendary",
    attunement: "by a Sorcerer, Warlock, or Wizard",
    description:
      "This elegant garment is made from exquisite cloth and adorned with runes. While wearing it, if you aren't wearing armor, your base Armor Class is 15 + your Dexterity modifier. You have Advantage on saving throws against spells and other magical effects, and your spell save DC and spell attack bonus each increase by 2.",
  },
  {
    name: "Robe of Useful Items",
    type: "Wondrous Item",
    rarity: "Uncommon",
    description:
      "This robe has cloth patches of various shapes and colors. While wearing it, you can take an action to detach one patch, causing it to become the object or creature it represents; once the last patch is removed, the robe becomes ordinary clothing. Every robe has two each of a Dagger, a lit Bullseye Lantern, a steel Mirror, a 10-foot Pole, 50 feet of Hempen Rope, and a Sack, plus 4d4 other patches rolled on a table that includes bags of gold, a door, gems, a ladder, a riding horse, a pit, Potions of Healing, a rowboat, a spell scroll, mastiffs, a window, and a portable ram.",
  },
  {
    name: "Rope of Climbing",
    type: "Wondrous Item",
    rarity: "Uncommon",
    description:
      "This 60-foot silk rope weighs 3 pounds and can hold up to 3,000 pounds. Holding one end, you can take an action to speak its command word to animate it; as a Bonus Action you can command the other end to move 10 feet per turn toward a destination, and to fasten or unfasten, knot or unknot, or coil itself. While knotted at 1-foot intervals, it shortens to 50 feet and grants Advantage on checks to climb it. The rope has AC 20 and 20 Hit Points and regains 1 Hit Point every 5 minutes while it has at least 1.",
  },
  {
    name: "Rope of Entanglement",
    type: "Wondrous Item",
    rarity: "Rare",
    description:
      "This rope is 30 feet long and weighs 3 pounds. Holding one end, you can take an action to speak its command word, and the other end darts forward to entangle a creature you can see within 20 feet, which must succeed on a DC 15 Dexterity saving throw or have the Restrained condition. You release it with a Bonus Action command word, and the target can take an action to make a DC 15 Strength or Dexterity check to escape. The rope has AC 20 and 20 Hit Points and regains 1 Hit Point every 5 minutes while it has at least 1.",
  },
  {
    name: "Scarab of Protection",
    type: "Wondrous Item",
    rarity: "Legendary",
    attunement: true,
    description:
      "If you hold this beetle-shaped medallion in your hand for 1 round, an inscription appears revealing its magical nature. While it is on your person, you have Advantage on saving throws against spells. It has 12 charges: if you fail a saving throw against a Necromancy spell or a harmful effect originating from an Undead, you can take a Reaction to expend 1 charge and succeed instead. When its last charge is expended, the scarab crumbles into powder and is destroyed.",
  },
  {
    name: "Slippers of Spider Climbing",
    type: "Wondrous Item",
    rarity: "Uncommon",
    attunement: true,
    description:
      "While you wear these light shoes, you can move up, down, and across vertical surfaces and upside down along ceilings, while leaving your hands free, and you have a Climb Speed equal to your Speed. The slippers don't allow you to move this way on a slippery surface, such as one covered by ice or oil.",
  },
  {
    name: "Sovereign Glue",
    type: "Wondrous Item",
    rarity: "Legendary",
    description:
      "This viscous, milky-white substance forms a permanent adhesive bond between any two objects. It must be stored in a container coated inside with Oil of Slipperiness, and a container holds 1d6 + 1 ounces when found. One ounce covers a 1-foot square surface and takes 1 minute to set. Once set, the bond can be broken only by Universal Solvent, Oil of Etherealness, or a Wish spell.",
  },
  {
    name: "Sphere of Annihilation",
    type: "Wondrous Item",
    rarity: "Legendary",
    description:
      "This 2-foot black sphere is a hole in the multiverse that obliterates all matter it passes through and that passes through it, except Artifacts; anything that touches it without being wholly engulfed takes 4d10 Force damage. It is stationary until controlled: if you are within 60 feet, you can take an action to make a DC 25 Intelligence (Arcana) check, moving it up to 5 times your Intelligence modifier in feet (minimum 5) on a success, or 10 feet toward you on a failure. A creature whose space the sphere enters must succeed on a DC 13 Dexterity saving throw or be touched by it and take 4d10 Force damage.",
  },
  {
    name: "Stone of Controlling Earth Elementals",
    type: "Wondrous Item",
    rarity: "Rare",
    description:
      "If this 5-pound stone is touching the ground, you can take an action to speak its command word and summon an earth elemental, as if you had cast the Conjure Elemental spell. The stone can't be used this way again until the next dawn.",
  },
  {
    name: "Stone of Good Luck (Luckstone)",
    type: "Wondrous Item",
    rarity: "Uncommon",
    attunement: true,
    description:
      "While this polished agate is on your person, you gain a +1 bonus to ability checks and saving throws.",
  },
  {
    name: "Talisman of Pure Good",
    type: "Wondrous Item",
    rarity: "Legendary",
    attunement: "by a creature of good alignment",
    description:
      "A good Cleric or Paladin can use this talisman as a Holy Symbol and gains a +2 bonus to spell attack rolls while wearing or holding it. It has 7 charges: as an action you can expend 1 charge and choose a creature on the ground within 120 feet; if the target is evil, a flaming fissure opens beneath it, and it must succeed on a DC 20 Dexterity saving throw or fall in and be destroyed, leaving no remains. A neutral creature that touches the talisman takes 6d6 Radiant damage, and an evil one takes 8d6, each time it ends its turn holding it. When the last charge is spent, the talisman disperses into golden light.",
  },
  {
    name: "Talisman of the Sphere",
    type: "Wondrous Item",
    rarity: "Legendary",
    attunement: true,
    description:
      "When you make an Intelligence (Arcana) check to control a Sphere of Annihilation while holding this talisman, you double your Proficiency Bonus on the check. In addition, when you start your turn with control over a sphere, you can take an action to levitate it 10 feet plus a number of additional feet equal to 10 times your Intelligence modifier.",
  },
  {
    name: "Talisman of Ultimate Evil",
    type: "Wondrous Item",
    rarity: "Legendary",
    attunement: "by a creature of evil alignment",
    description:
      "An evil Cleric or Paladin can use this item as a Holy Symbol and gains a +2 bonus to spell attack rolls while wearing or holding it. It has 6 charges: as an action you can expend 1 charge and choose a creature on the ground within 120 feet; if the target is good, a flaming fissure opens beneath it, and it must succeed on a DC 20 Dexterity saving throw or fall in and be destroyed, leaving no remains. A neutral creature that touches the talisman takes 6d6 Necrotic damage, and a good one takes 8d6, each time it ends its turn holding it. When the last charge is spent, the talisman dissolves into foul-smelling slime.",
  },
  {
    name: "Tome of Clear Thought",
    type: "Wondrous Item",
    rarity: "Very Rare",
    description:
      "This book contains memory and logic exercises. If you spend 48 hours over a period of 6 days or fewer studying its contents and practicing its guidelines, your Intelligence score increases by 2, as does your maximum for that score. The tome then loses its magic, but regains it in a century.",
  },
  {
    name: "Tome of Leadership and Influence",
    type: "Wondrous Item",
    rarity: "Very Rare",
    description:
      "This book contains guidelines for influencing and charming others. If you spend 48 hours over a period of 6 days or fewer studying its contents and practicing its guidelines, your Charisma score increases by 2, as does your maximum for that score. The tome then loses its magic, but regains it in a century.",
  },
  {
    name: "Tome of Understanding",
    type: "Wondrous Item",
    rarity: "Very Rare",
    description:
      "This book contains intuition and insight exercises. If you spend 48 hours over a period of 6 days or fewer studying its contents and practicing its guidelines, your Wisdom score increases by 2, as does your maximum for that score. The tome then loses its magic, but regains it in a century.",
  },
  {
    name: "Universal Solvent",
    type: "Wondrous Item",
    rarity: "Legendary",
    description:
      "This tube holds milky liquid with a strong alcohol smell. As an action you can pour its contents onto a surface within reach, and the liquid instantly dissolves up to 1 square foot of adhesive it touches, including Sovereign Glue.",
  },
  {
    name: "Well of Many Worlds",
    type: "Wondrous Item",
    rarity: "Legendary",
    description:
      "This fine black cloth unfolds into a circular sheet 6 feet in diameter. As an action you can place it on a solid surface, whereupon it creates a two-way portal to another world or plane of existence, chosen by the GM each time. As an action you can close the portal by folding the cloth up. Once it has opened a portal, it can't do so again for 1d8 hours.",
  },
  {
    name: "Wind Fan",
    type: "Wondrous Item",
    rarity: "Uncommon",
    description:
      "While holding this fan, you can take an action to cast the Gust of Wind spell (save DC 13) from it. Once used, the fan shouldn't be used again until the next dawn; each time it is used again before then, it has a cumulative 20 percent chance of not working and tearing into useless, nonmagical tatters.",
  },
  {
    name: "Winged Boots",
    type: "Wondrous Item",
    rarity: "Uncommon",
    attunement: true,
    description:
      "While you wear these boots, you have a Fly Speed equal to your Speed. You can fly for up to 4 hours, all at once or in several shorter flights each using at least 1 minute of the duration; if you are flying when the time runs out, you descend at 30 feet per round until you land. The boots regain 2 hours of flying capability for every 12 hours they aren't in use.",
  },
  {
    name: "Wings of Flying",
    type: "Wondrous Item",
    rarity: "Rare",
    attunement: true,
    description:
      "While wearing this cloak, you can take an action to speak its command word, turning it into a pair of bat or bird wings on your back for 1 hour or until you repeat the command word as an action. The wings give you a Fly Speed of 60 feet. When they disappear, you can't use them again for 1d12 hours.",
  },
];
