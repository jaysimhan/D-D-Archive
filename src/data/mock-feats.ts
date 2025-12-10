import { Feat } from "../types/dnd-types";

export const MOCK_FEATS: Feat[] = [
  {
    id: "feat-alert",
    name: "Alert",
    description: "Always on the lookout for danger, you gain the following benefits: You can't be surprised while you are conscious. You gain a +5 bonus to initiative. Other creatures don't gain advantage on attack rolls against you as a result of being unseen by you.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: [
        "Can't be surprised while conscious",
        "+5 bonus to initiative",
        "No advantage for unseen attackers"
      ]
    }
  },
  {
    id: "feat-athlete",
    name: "Athlete",
    description: "You have undergone extensive physical training to gain the following benefits: Increase your Strength or Dexterity score by 1, to a maximum of 20. When you are prone, standing up uses only 5 feet of your movement. Climbing doesn't cost you extra movement. You can make a running long jump or a running high jump after moving only 5 feet on foot, rather than 10 feet.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      abilityScoreIncrease: { STR: 1 }, // Or DEX: 1
      features: [
        "Standing from prone uses only 5 feet of movement",
        "Climbing doesn't cost extra movement",
        "Running jump after only 5 feet of movement"
      ]
    }
  },
  {
    id: "feat-actor",
    name: "Actor",
    description: "Skilled at mimicry and dramatics, you gain the following benefits: Increase your Charisma score by 1, to a maximum of 20. You have advantage on Charisma (Deception) and Charisma (Performance) checks when trying to pass yourself off as a different person. You can mimic the speech of another person or the sounds made by other creatures.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      abilityScoreIncrease: { CHA: 1 },
      features: [
        "Advantage on Deception and Performance checks for disguise",
        "Can mimic speech and sounds"
      ]
    }
  },
  {
    id: "feat-war-caster",
    name: "War Caster",
    description: "You have practiced casting spells in the midst of combat, learning techniques that grant you the following benefits: You have advantage on Constitution saving throws that you make to maintain your concentration on a spell when you take damage. You can perform the somatic components of spells even when you have weapons or a shield in one or both hands. When a hostile creature's movement provokes an opportunity attack from you, you can use your reaction to cast a spell at the creature, rather than making an opportunity attack.",
    source: "Official",
    edition: "Both",
    version: 1,
    prerequisites: {
      class: ["wizard", "sorcerer", "cleric", "druid", "bard", "warlock", "artificer", "paladin", "ranger"]
    },
    benefits: {
      features: [
        "Advantage on Constitution saves to maintain concentration",
        "Can perform somatic components with weapons/shield in hand",
        "Can cast a spell as an opportunity attack"
      ]
    }
  },
  {
    id: "feat-great-weapon-master",
    name: "Great Weapon Master",
    description: "You've learned to put the weight of a weapon to your advantage, letting its momentum empower your strikes. You gain the following benefits: On your turn, when you score a critical hit with a melee weapon or reduce a creature to 0 hit points with one, you can make one melee weapon attack as a bonus action. Before you make a melee attack with a heavy weapon that you are proficient with, you can choose to take a -5 penalty to the attack roll. If the attack hits, you add +10 to the attack's damage.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: [
        "Bonus action attack on critical hit or kill with melee weapon",
        "Can take -5 to hit for +10 damage with heavy weapons"
      ]
    }
  },
  {
    id: "feat-sharpshooter",
    name: "Sharpshooter",
    description: "You have mastered ranged weapons and can make shots that others find impossible. You gain the following benefits: Attacking at long range doesn't impose disadvantage on your ranged weapon attack rolls. Your ranged weapon attacks ignore half cover and three-quarters cover. Before you make an attack with a ranged weapon that you are proficient with, you can choose to take a -5 penalty to the attack roll. If the attack hits, you add +10 to the attack's damage.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: [
        "No disadvantage at long range",
        "Ignore half and three-quarters cover",
        "Can take -5 to hit for +10 damage"
      ]
    }
  },
  {
    id: "feat-lucky",
    name: "Lucky",
    description: "You have inexplicable luck that seems to kick in at just the right moment. You have 3 luck points. Whenever you make an attack roll, an ability check, or a saving throw, you can spend one luck point to roll an additional d20. You can choose to spend one of your luck points after you roll the die, but before the outcome is determined. You choose which of the d20s is used for the attack roll, ability check, or saving throw. You can also spend one luck point when an attack roll is made against you. Roll a d20, and then choose whether the attack uses the attacker's roll or yours. If more than one creature spends a luck point to influence the outcome of a roll, the points cancel each other out; no additional dice are rolled. You regain your expended luck points when you finish a long rest.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: [
        "3 luck points that recharge on long rest",
        "Spend a luck point to roll additional d20 on attacks, checks, or saves",
        "Can also use when attacked"
      ]
    }
  },
  {
    id: "feat-sentinel",
    name: "Sentinel",
    description: "You have mastered techniques to take advantage of every drop in any enemy's guard, gaining the following benefits: When you hit a creature with an opportunity attack, the creature's speed becomes 0 for the rest of the turn. Creatures provoke opportunity attacks from you even if they take the Disengage action before leaving your reach. When a creature within 5 feet of you makes an attack against a target other than you (and that target doesn't have this feat), you can use your reaction to make a melee weapon attack against the attacking creature.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: [
        "Opportunity attacks reduce creature speed to 0",
        "Attack creatures that Disengage",
        "Reaction attack when ally is attacked"
      ]
    }
  },
  {
    id: "feat-polearm-master",
    name: "Polearm Master",
    description: "You can keep your enemies at bay with reach weapons. You gain the following benefits: When you take the Attack action and attack with only a glaive, halberd, quarterstaff, or spear, you can use a bonus action to make a melee attack with the opposite end of the weapon. While you are wielding a glaive, halberd, pike, quarterstaff, or spear, other creatures provoke an opportunity attack from you when they enter your reach.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: [
        "Bonus action melee attack with polearm butt end",
        "Opportunity attacks when creatures enter reach"
      ]
    }
  },
  {
    id: "feat-magic-initiate",
    name: "Magic Initiate",
    description: "Choose a class: bard, cleric, druid, sorcerer, warlock, or wizard. You learn two cantrips of your choice from that class's spell list. In addition, choose one 1st-level spell from that same list. You learn that spell and can cast it at its lowest level. Once you cast it, you must finish a long rest before you can cast it again using this feat. Your spellcasting ability for these spells depends on the class you chose: Charisma for bard, sorcerer, or warlock; Wisdom for cleric or druid; or Intelligence for wizard.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: [
        "Learn 2 cantrips from chosen class",
        "Learn 1 first-level spell (once per long rest)"
      ]
    }
  },
  {
    id: "feat-resilient",
    name: "Resilient",
    description: "Choose one ability score. You gain the following benefits: Increase the chosen ability score by 1, to a maximum of 20. You gain proficiency in saving throws using the chosen ability.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      abilityScoreIncrease: { STR: 1 }, // Or any ability score
      features: [
        "Gain proficiency in chosen ability's saving throw"
      ]
    }
  },
  {
    id: "feat-tough",
    name: "Tough",
    description: "Your hit point maximum increases by an amount equal to twice your level when you gain this feat. Whenever you gain a level thereafter, your hit point maximum increases by an additional 2 hit points.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: [
        "+2 HP per level (retroactive and ongoing)"
      ]
    }
  },
  {
    id: "feat-elven-accuracy",
    name: "Elven Accuracy",
    description: "The accuracy of elves is legendary. You have uncanny aim with attacks that rely on precision rather than brute force. You gain the following benefits: Increase your Dexterity, Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20. Whenever you have advantage on an attack roll using Dexterity, Intelligence, Wisdom, or Charisma, you can reroll one of the dice once.",
    source: "Official",
    edition: "Both",
    version: 1,
    prerequisites: {
      race: ["elf", "half-elf"]
    },
    benefits: {
      abilityScoreIncrease: { DEX: 1 }, // Or INT, WIS, or CHA
      features: [
        "Reroll one die when you have advantage on DEX/INT/WIS/CHA attacks"
      ]
    }
  }
];
