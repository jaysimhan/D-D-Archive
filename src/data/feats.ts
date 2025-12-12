import { Feat } from "../types/dnd-types";

export const FEATS: Feat[] = [
  {
    "id": "feat-alert",
    "name": "Alert",
    "description": "Always on the lookout for danger, you gain the following benefits: You can't be surprised while you are conscious. You gain a +5 bonus to initiative. Other creatures don't gain advantage on attack rolls against you as a result of being unseen by you.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "features": [
        "Can't be surprised while conscious",
        "+5 bonus to initiative",
        "No advantage for unseen attackers"
      ]
    }
  },
  {
    "id": "feat-athlete",
    "name": "Athlete",
    "description": "You have undergone extensive physical training to gain the following benefits: Increase your Strength or Dexterity score by 1, to a maximum of 20. When you are prone, standing up uses only 5 feet of your movement. Climbing doesn't cost you extra movement. You can make a running long jump or a running high jump after moving only 5 feet on foot, rather than 10 feet.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "abilityScoreIncrease": {
        "STR": 1
      },
      "features": [
        "Standing from prone uses only 5 feet of movement",
        "Climbing doesn't cost extra movement",
        "Running jump after only 5 feet of movement"
      ]
    }
  },
  {
    "id": "feat-actor",
    "name": "Actor",
    "description": "Skilled at mimicry and dramatics, you gain the following benefits: Increase your Charisma score by 1, to a maximum of 20. You have advantage on Charisma (Deception) and Charisma (Performance) checks when trying to pass yourself off as a different person. You can mimic the speech of another person or the sounds made by other creatures.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "abilityScoreIncrease": {
        "CHA": 1
      },
      "features": [
        "Advantage on Deception and Performance checks for disguise",
        "Can mimic speech and sounds"
      ]
    }
  },
  {
    "id": "feat-war-caster",
    "name": "War Caster",
    "description": "You have practiced casting spells in the midst of combat, learning techniques that grant you the following benefits: You have advantage on Constitution saving throws that you make to maintain your concentration on a spell when you take damage. You can perform the somatic components of spells even when you have weapons or a shield in one or both hands. When a hostile creature's movement provokes an opportunity attack from you, you can use your reaction to cast a spell at the creature, rather than making an opportunity attack.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "prerequisites": {
      "class": [
        "wizard",
        "sorcerer",
        "cleric",
        "druid",
        "bard",
        "warlock",
        "artificer",
        "paladin",
        "ranger"
      ]
    },
    "benefits": {
      "features": [
        "Advantage on Constitution saves to maintain concentration",
        "Can perform somatic components with weapons/shield in hand",
        "Can cast a spell as an opportunity attack"
      ]
    }
  },
  {
    "id": "feat-great-weapon-master",
    "name": "Great Weapon Master",
    "description": "You've learned to put the weight of a weapon to your advantage, letting its momentum empower your strikes. You gain the following benefits: On your turn, when you score a critical hit with a melee weapon or reduce a creature to 0 hit points with one, you can make one melee weapon attack as a bonus action. Before you make a melee attack with a heavy weapon that you are proficient with, you can choose to take a -5 penalty to the attack roll. If the attack hits, you add +10 to the attack's damage.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "features": [
        "Bonus action attack on critical hit or kill with melee weapon",
        "Can take -5 to hit for +10 damage with heavy weapons"
      ]
    }
  },
  {
    "id": "feat-sharpshooter",
    "name": "Sharpshooter",
    "description": "You have mastered ranged weapons and can make shots that others find impossible. You gain the following benefits: Attacking at long range doesn't impose disadvantage on your ranged weapon attack rolls. Your ranged weapon attacks ignore half cover and three-quarters cover. Before you make an attack with a ranged weapon that you are proficient with, you can choose to take a -5 penalty to the attack roll. If the attack hits, you add +10 to the attack's damage.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "features": [
        "No disadvantage at long range",
        "Ignore half and three-quarters cover",
        "Can take -5 to hit for +10 damage"
      ]
    }
  },
  {
    "id": "feat-lucky",
    "name": "Lucky",
    "description": "You have inexplicable luck that seems to kick in at just the right moment. You have 3 luck points. Whenever you make an attack roll, an ability check, or a saving throw, you can spend one luck point to roll an additional d20. You can choose to spend one of your luck points after you roll the die, but before the outcome is determined. You choose which of the d20s is used for the attack roll, ability check, or saving throw. You can also spend one luck point when an attack roll is made against you. Roll a d20, and then choose whether the attack uses the attacker's roll or yours. If more than one creature spends a luck point to influence the outcome of a roll, the points cancel each other out; no additional dice are rolled. You regain your expended luck points when you finish a long rest.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "features": [
        "3 luck points that recharge on long rest",
        "Spend a luck point to roll additional d20 on attacks, checks, or saves",
        "Can also use when attacked"
      ]
    }
  },
  {
    "id": "feat-sentinel",
    "name": "Sentinel",
    "description": "You have mastered techniques to take advantage of every drop in any enemy's guard, gaining the following benefits: When you hit a creature with an opportunity attack, the creature's speed becomes 0 for the rest of the turn. Creatures provoke opportunity attacks from you even if they take the Disengage action before leaving your reach. When a creature within 5 feet of you makes an attack against a target other than you (and that target doesn't have this feat), you can use your reaction to make a melee weapon attack against the attacking creature.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "features": [
        "Opportunity attacks reduce creature speed to 0",
        "Attack creatures that Disengage",
        "Reaction attack when ally is attacked"
      ]
    }
  },
  {
    "id": "feat-polearm-master",
    "name": "Polearm Master",
    "description": "You can keep your enemies at bay with reach weapons. You gain the following benefits: When you take the Attack action and attack with only a glaive, halberd, quarterstaff, or spear, you can use a bonus action to make a melee attack with the opposite end of the weapon. While you are wielding a glaive, halberd, pike, quarterstaff, or spear, other creatures provoke an opportunity attack from you when they enter your reach.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "features": [
        "Bonus action melee attack with polearm butt end",
        "Opportunity attacks when creatures enter reach"
      ]
    }
  },
  {
    "id": "feat-magic-initiate",
    "name": "Magic Initiate",
    "description": "Choose a class: bard, cleric, druid, sorcerer, warlock, or wizard. You learn two cantrips of your choice from that class's spell list. In addition, choose one 1st-level spell from that same list. You learn that spell and can cast it at its lowest level. Once you cast it, you must finish a long rest before you can cast it again using this feat. Your spellcasting ability for these spells depends on the class you chose: Charisma for bard, sorcerer, or warlock; Wisdom for cleric or druid; or Intelligence for wizard.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "features": [
        "Learn 2 cantrips from chosen class",
        "Learn 1 first-level spell (once per long rest)"
      ]
    }
  },
  {
    "id": "feat-resilient",
    "name": "Resilient",
    "description": "Choose one ability score. You gain the following benefits: Increase the chosen ability score by 1, to a maximum of 20. You gain proficiency in saving throws using the chosen ability.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "abilityScoreIncrease": {
        "STR": 1
      },
      "features": [
        "Gain proficiency in chosen ability's saving throw"
      ]
    }
  },
  {
    "id": "feat-tough",
    "name": "Tough",
    "description": "Your hit point maximum increases by an amount equal to twice your level when you gain this feat. Whenever you gain a level thereafter, your hit point maximum increases by an additional 2 hit points.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "features": [
        "+2 HP per level (retroactive and ongoing)"
      ]
    }
  },
  {
    "id": "feat-elven-accuracy",
    "name": "Elven Accuracy",
    "description": "The accuracy of elves is legendary. You have uncanny aim with attacks that rely on precision rather than brute force. You gain the following benefits: Increase your Dexterity, Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20. Whenever you have advantage on an attack roll using Dexterity, Intelligence, Wisdom, or Charisma, you can reroll one of the dice once.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "prerequisites": {
      "race": [
        "elf",
        "half-elf"
      ]
    },
    "benefits": {
      "abilityScoreIncrease": {
        "DEX": 1
      },
      "features": [
        "Reroll one die when you have advantage on DEX/INT/WIS/CHA attacks"
      ]
    }
  },
  {
    "id": "feat-metamagic-initiate",
    "name": "Metamagic Initiate",
    "description": "You've learned how to exert your will on your spells to alter how they function. You gain the following benefits: You learn two Metamagic options of your choice from the sorcerer class. You have 2 sorcery points to spend on Metamagic. You regain all spent sorcery points when you finish a long rest.",
    "source": "Tasha's Cauldron of Everything",
    "edition": "2024",
    "version": 1,
    "benefits": {
      "features": [
        "Learn 2 Metamagic options",
        "2 Sorcery Points (recharge on long rest)"
      ]
    }
  },
  {
    "id": "feat-aberrant-dragonmark",
    "name": "Aberrant Dragonmark",
    "description": "You have manifested an aberrant dragonmark. You gain the following benefits: Increase your Constitution score by 1, to a maximum of 20. You learn a cantrip and a 1st-level spell from the sorcerer spell list (+CON is spellcasting mod). You can cast the 1st-level spell once without a spell slot (short/long rest). casting the spell has a random effect.",
    "source": "Eberron: Rising from the Last War",
    "edition": "2024",
    "version": 1,
    "benefits": {
      "abilityScoreIncrease": {
        "CON": 1
      },
      "features": [
        "Learn Sorcerer cantrip",
        "Learn 1st-level Sorcerer spell (cast once free/rest)",
        "Random effect when casting 1st-level spell"
      ]
    }
  },
  {
    "id": "feat-fey-touched",
    "name": "Fey Touched",
    "description": "Your exposure to the Feywild's magic has changed you. Increase your Int, Wis, or Cha by 1. You learn the Misty Step spell and one 1st-level spell of your choice from the Divination or Enchantment school.",
    "source": "Tasha's Cauldron of Everything",
    "edition": "2024",
    "version": 1,
    "benefits": {
      "abilityScoreIncrease": {
        "INT": 1
      },
      "features": [
        "Learn Misty Step",
        "Learn 1st-level Divination or Enchantment spell",
        "Can cast each once without spell slot per long rest"
      ]
    }
  },
  {
    "id": "feat-shadow-touched",
    "name": "Shadow Touched",
    "description": "Your exposure to the Shadowfell's magic has changed you. Increase your Int, Wis, or Cha by 1. You learn the Invisibility spell and one 1st-level spell of your choice from the Illusion or Necromancy school.",
    "source": "Tasha's Cauldron of Everything",
    "edition": "2024",
    "version": 1,
    "benefits": {
      "abilityScoreIncrease": {
        "INT": 1
      },
      "features": [
        "Learn Invisibility",
        "Learn 1st-level Illusion or Necromancy spell",
        "Can cast each once without spell slot per long rest"
      ]
    }
  },
  {
    "id": "feat-telekinetic",
    "name": "Telekinetic",
    "description": "You learn to move things with your mind. Increase your Int, Wis, or Cha by 1. You learn the Mage Hand cantrip (invisible, 60ft range). As a bonus action, you can try to shove a creature within 30 feet of you using your mind.",
    "source": "Tasha's Cauldron of Everything",
    "edition": "2024",
    "version": 1,
    "benefits": {
      "abilityScoreIncrease": {
        "INT": 1
      },
      "features": [
        "Improved Mage Hand (invisible, 60ft range)",
        "Bonus action telekinetic shove (5ft push/pull, STR save)"
      ]
    }
  },
  {
    "id": "feat-crossbow-expert",
    "name": "Crossbow Expert",
    "description": "Thanks to extensive practice with the crossbow, you gain the following benefits: You ignore the loading quality of crossbows with which you are proficient. Being within 5 feet of a hostile creature doesn't impose disadvantage on your ranged attack rolls. When you use the Attack action and attack with a one-handed weapon, you can use a bonus action to attack with a hand crossbow you are holding.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "features": [
        "Ignore loading quality of crossbows",
        "No disadvantage on ranged attacks in melee",
        "Bonus action attack with hand crossbow"
      ]
    }
  },
  {
    "id": "feat-healer",
    "name": "Healer",
    "description": "You are an able physician, allowing you to mend wounds quickly and get your allies back in the fight. You gain the following benefits: When you use a healer's kit to stabilize a dying creature, that creature also regains 1 hit point. As an action, you can spend one use of a healer's kit to tend to a creature and restore 1d6 + 4 hit points to it, plus additional hit points equal to the creature's maximum number of Hit Dice. The creature can't regain hit points from this feat again until it finishes a short or long rest.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "features": [
        "Stabilize dying creature to 1 HP",
        "Restore 1d6 + 4 + max Hit Dice HP (once per rest per creature)"
      ]
    }
  },
  {
    "id": "feat-keen-mind",
    "name": "Keen Mind",
    "description": "You have a mind that can track time, direction, and detail with uncanny precision. You gain the following benefits: Increase your Intelligence score by 1, to a maximum of 20. You always know which way is north. You always know the number of hours left before the next sunrise or sunset. You can accurately recall anything you have seen or heard within the past month.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "abilityScoreIncrease": {
        "INT": 1
      },
      "features": [
        "Always know North",
        "Always know time until sunrise/sunset",
        "Perfect recall for 1 month"
      ]
    }
  },
  {
    "id": "feat-observant",
    "name": "Observant",
    "description": "Quick to notice details of your environment, you gain the following benefits: Increase your Intelligence or Wisdom score by 1, to a maximum of 20. If you can see a creature's mouth while it is speaking a language you understand, you can interpret what it's saying by reading its lips. You have a +5 bonus to your passive Wisdom (Perception) and passive Intelligence (Investigation) scores.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "abilityScoreIncrease": {
        "WIS": 1
      },
      "features": [
        "Read lips",
        "+5 to Passive Perception and Passive Investigation"
      ]
    }
  },
  {
    "id": "alert",
    "name": "Alert",
    "description": "Always on the lookout for danger, you gain the following benefits: You gain a +5 bonus to initiative. You can't be surprised while you are conscious. Other creatures don't gain advantage on attack rolls against you as a result of being hidden from you.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "features": [
        "+5 to initiative",
        "Can't be surprised while conscious",
        "No advantage from hidden attackers"
      ]
    }
  },
  {
    "id": "athlete",
    "name": "Athlete",
    "description": "You have undergone extensive physical training to gain the following benefits: Increase your Strength or Dexterity score by 1, to a maximum of 20. When you are prone, standing up uses only 5 feet of your movement. Climbing doesn't cost you extra movement. You can make a running long jump or a running high jump after moving only 5 feet on foot, rather than 10 feet.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "abilityScoreIncrease": {
        "STR": 1
      },
      "features": [
        "Stand from prone for 5 ft",
        "Climb without extra movement",
        "Running jump after 5 ft"
      ]
    }
  },
  {
    "id": "lucky",
    "name": "Lucky",
    "description": "You have inexplicable luck that seems to kick in at just the right moment. You have 3 luck points. Whenever you make an attack roll, an ability check, or a saving throw, you can spend one luck point to roll an additional d20. You can choose to spend one of your luck points after you roll the die, but before the outcome is determined. You choose which of the d20s is used for the attack roll, ability check, or saving throw. You can also spend one luck point when an attack roll is made against you. Roll a d20, and then choose whether the attack uses the attacker's roll or yours. You regain your expended luck points when you finish a long rest.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "features": [
        "3 luck points per long rest",
        "Reroll attack/check/save",
        "Force reroll on incoming attacks"
      ]
    }
  },
  {
    "id": "great-weapon-master",
    "name": "Great Weapon Master",
    "description": "You've learned to put the weight of a weapon to your advantage, letting its momentum empower your strikes. You gain the following benefits: On your turn, when you score a critical hit with a melee weapon or reduce a creature to 0 hit points with one, you can make one melee weapon attack as a bonus action. Before you make a melee attack with a heavy weapon that you are proficient with, you can choose to take a -5 penalty to the attack roll. If the attack hits, you add +10 to the attack's damage.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "features": [
        "Bonus attack on crit or kill",
        "Trade -5 to hit for +10 damage"
      ]
    }
  },
  {
    "id": "sharpshooter",
    "name": "Sharpshooter",
    "description": "You have mastered ranged weapons and can make shots that others find impossible. You gain the following benefits: Attacking at long range doesn't impose disadvantage on your ranged weapon attack rolls. Your ranged weapon attacks ignore half cover and three-quarters cover. Before you make an attack with a ranged weapon that you are proficient with, you can choose to take a -5 penalty to the attack roll. If the attack hits, you add +10 to the attack's damage.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "features": [
        "No disadvantage at long range",
        "Ignore half and 3/4 cover",
        "Trade -5 to hit for +10 damage"
      ]
    }
  },
  {
    "id": "war-caster",
    "name": "War Caster",
    "description": "You have practiced casting spells in the midst of combat, learning techniques that grant you the following benefits: You have advantage on Constitution saving throws that you make to maintain your concentration on a spell when you take damage. You can perform the somatic components of spells even when you have weapons or a shield in one or both hands. When a hostile creature's movement provokes an opportunity attack from you, you can use your reaction to cast a spell at the creature, rather than making an opportunity attack. The spell must have a casting time of 1 action and must target only that creature.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "features": [
        "Advantage on concentration saves",
        "Cast with weapons/shield in hand",
        "Cast spell as opportunity attack"
      ]
    }
  },
  {
    "id": "polearm-master",
    "name": "Polearm Master",
    "description": "You can keep your enemies at bay with reach weapons. You gain the following benefits: When you take the Attack action and attack with only a glaive, halberd, quarterstaff, or spear, you can use a bonus action to make a melee attack with the opposite end of the weapon. This attack uses the same ability modifier as the primary attack. The weapon's damage die for this attack is a d4, and it deals bludgeoning damage. While you are wielding a glaive, halberd, pike, quarterstaff, or spear, other creatures provoke an opportunity attack from you when they enter your reach.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "features": [
        "Bonus action attack with polearm",
        "Opportunity attack when enemies enter reach"
      ]
    }
  },
  {
    "id": "sentinel",
    "name": "Sentinel",
    "description": "You have mastered techniques to take advantage of every drop in any enemy's guard, gaining the following benefits: When you hit a creature with an opportunity attack, the creature's speed becomes 0 for the rest of the turn. Creatures provoke opportunity attacks from you even if they take the Disengage action before leaving your reach. When a creature within 5 feet of you makes an attack against a target other than you (and that target doesn't have this feat), you can use your reaction to make a melee weapon attack against the attacking creature.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "features": [
        "Opportunity attacks reduce speed to 0",
        "Attack Disengaging enemies",
        "Reaction attack when ally is attacked"
      ]
    }
  },
  {
    "id": "mobile",
    "name": "Mobile",
    "description": "You are exceptionally speedy and agile. You gain the following benefits: Your speed increases by 10 feet. When you use the Dash action, difficult terrain doesn't cost you extra movement on that turn. When you make a melee attack against a creature, you don't provoke opportunity attacks from that creature for the rest of the turn, whether you hit or not.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "features": [
        "+10 ft speed",
        "Dash ignores difficult terrain",
        "No opportunity attacks after melee attack"
      ]
    }
  },
  {
    "id": "resilient",
    "name": "Resilient",
    "description": "Choose one ability score. You gain the following benefits: Increase the chosen ability score by 1, to a maximum of 20. You gain proficiency in saving throws using the chosen ability.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "abilityScoreIncrease": {
        "STR": 1
      },
      "features": [
        "Proficiency in chosen ability's saving throws"
      ]
    }
  },
  {
    "id": "tough",
    "name": "Tough",
    "description": "Your hit point maximum increases by an amount equal to twice your level when you gain this feat. Whenever you gain a level thereafter, your hit point maximum increases by an additional 2 hit points.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "features": [
        "+2 HP per level (retroactive and ongoing)"
      ]
    }
  },
  {
    "id": "magic-initiate",
    "name": "Magic Initiate",
    "description": "Choose a class: bard, cleric, druid, sorcerer, warlock, or wizard. You learn two cantrips of your choice from that class's spell list. In addition, choose one 1st-level spell from that same list. You learn that spell and can cast it at its lowest level. Once you cast it, you must finish a long rest before you can cast it again using this feat. Your spellcasting ability for these spells depends on the class you chose: Charisma for bard, sorcerer, or warlock; Wisdom for cleric or druid; or Intelligence for wizard.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "features": [
        "2 cantrips from chosen class",
        "1 1st-level spell (1/long rest)"
      ]
    }
  },
  {
    "id": "spell-sniper",
    "name": "Spell Sniper",
    "description": "You have learned techniques to enhance your attacks with certain kinds of spells, gaining the following benefits: When you cast a spell that requires you to make an attack roll, the spell's range is doubled. Your ranged spell attacks ignore half cover and three-quarters cover. You learn one cantrip that requires an attack roll. Choose the cantrip from the bard, cleric, druid, sorcerer, warlock, or wizard spell list. Your spellcasting ability for this cantrip depends on the spell list you chose from.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "prerequisites": {
      "class": [
        "bard",
        "cleric",
        "druid",
        "sorcerer",
        "warlock",
        "wizard"
      ]
    },
    "benefits": {
      "features": [
        "Double spell range for attack spells",
        "Ignore cover with spell attacks",
        "1 attack cantrip"
      ]
    }
  },
  {
    "id": "elemental-adept",
    "name": "Elemental Adept",
    "description": "When you gain this feat, choose one of the following damage types: acid, cold, fire, lightning, or thunder. Spells you cast ignore resistance to damage of the chosen type. In addition, when you roll damage for a spell you cast that deals damage of that type, you can treat any 1 on a damage die as a 2. You can select this feat multiple times. Each time you do so, you must choose a different damage type.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "prerequisites": {
      "class": [
        "sorcerer",
        "wizard",
        "druid",
        "warlock"
      ]
    },
    "benefits": {
      "features": [
        "Ignore resistance to chosen element",
        "Treat 1s as 2s on damage dice"
      ]
    }
  },
  {
    "id": "dual-wielder",
    "name": "Dual Wielder",
    "description": "You master fighting with two weapons, gaining the following benefits: You gain a +1 bonus to AC while you are wielding a separate melee weapon in each hand. You can use two-weapon fighting even when the one-handed melee weapons you are wielding aren't light. You can draw or stow two one-handed weapons when you would normally be able to draw or stow only one.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "features": [
        "+1 AC when dual wielding",
        "Dual wield non-light weapons",
        "Draw/stow 2 weapons at once"
      ]
    }
  },
  {
    "id": "defensive-duelist",
    "name": "Defensive Duelist",
    "description": "When you are wielding a finesse weapon with which you are proficient and another creature hits you with a melee attack, you can use your reaction to add your proficiency bonus to your AC for that attack, potentially causing the attack to miss you.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "prerequisites": {
      "abilityScore": {
        "DEX": 13
      }
    },
    "benefits": {
      "features": [
        "Reaction: +proficiency to AC vs one melee attack"
      ]
    }
  },
  {
    "id": "heavily-armored",
    "name": "Heavily Armored",
    "description": "You have trained to master the use of heavy armor, gaining the following benefits: Increase your Strength score by 1, to a maximum of 20. You gain proficiency with heavy armor.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "prerequisites": {
      "abilityScore": {
        "STR": 13
      }
    },
    "benefits": {
      "abilityScoreIncrease": {
        "STR": 1
      },
      "features": [
        "Heavy armor proficiency"
      ]
    }
  },
  {
    "id": "moderately-armored",
    "name": "Moderately Armored",
    "description": "You have trained to master the use of medium armor and shields, gaining the following benefits: Increase your Strength or Dexterity score by 1, to a maximum of 20. You gain proficiency with medium armor and shields.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "abilityScoreIncrease": {
        "STR": 1
      },
      "features": [
        "Medium armor and shield proficiency"
      ]
    }
  },
  {
    "id": "crossbow-expert",
    "name": "Crossbow Expert",
    "description": "Thanks to extensive practice with the crossbow, you gain the following benefits: You ignore the loading quality of crossbows with which you are proficient. Being within 5 feet of a hostile creature doesn't impose disadvantage on your ranged attack rolls. When you use the Attack action and attack with a one-handed weapon, you can use a bonus action to attack with a hand crossbow you are holding.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "features": [
        "Ignore crossbow loading",
        "No disadvantage in melee range",
        "Bonus crossbow attack"
      ]
    }
  },
  {
    "id": "observant",
    "name": "Observant",
    "description": "Quick to notice details of your environment, you gain the following benefits: Increase your Intelligence or Wisdom score by 1, to a maximum of 20. If you can see a creature's mouth while it is speaking a language you understand, you can interpret what it's saying by reading its lips. You have a +5 bonus to your passive Wisdom (Perception) and passive Intelligence (Investigation) scores.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "abilityScoreIncrease": {
        "WIS": 1
      },
      "features": [
        "Read lips",
        "+5 passive Perception and Investigation"
      ]
    }
  },
  {
    "id": "savage-attacker",
    "name": "Savage Attacker",
    "description": "Once per turn when you roll damage for a melee weapon attack, you can reroll the weapon's damage dice and use either total.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "features": [
        "Reroll melee damage once per turn"
      ]
    }
  },
  {
    "id": "ritual-caster",
    "name": "Ritual Caster",
    "description": "You have learned a number of spells that you can cast as rituals. These spells are written in a ritual book, which you must have in hand while casting one of them. When you choose this feat, you acquire a ritual book holding two 1st-level spells of your choice. Choose one of the following classes: bard, cleric, druid, sorcerer, warlock, or wizard. You must choose your spells from that class's spell list, and the spells you choose must have the ritual tag. The class you choose also determines your spellcasting ability for these spells.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "prerequisites": {
      "abilityScore": {
        "INT": 13
      }
    },
    "benefits": {
      "features": [
        "Ritual book with 2 ritual spells",
        "Can learn more rituals"
      ]
    }
  },
  {
    "id": "skulker",
    "name": "Skulker",
    "description": "You are expert at slinking through shadows. You gain the following benefits: You can try to hide when you are lightly obscured from the creature from which you are hiding. When you are hidden from a creature and miss it with a ranged weapon attack, making the attack doesn't reveal your position. Dim light doesn't impose disadvantage on your Wisdom (Perception) checks relying on sight.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "prerequisites": {
      "abilityScore": {
        "DEX": 13
      }
    },
    "benefits": {
      "features": [
        "Hide when lightly obscured",
        "Missed ranged attacks don't reveal position",
        "See normally in dim light"
      ]
    }
  },
  {
    "id": "tavern-brawler",
    "name": "Tavern Brawler",
    "description": "Accustomed to rough-and-tumble fighting using whatever weapons happen to be at hand, you gain the following benefits: Increase your Strength or Constitution score by 1, to a maximum of 20. You are proficient with improvised weapons. Your unarmed strike uses a d4 for damage. When you hit a creature with an unarmed strike or an improvised weapon on your turn, you can use a bonus action to attempt to grapple the target.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "abilityScoreIncrease": {
        "STR": 1
      },
      "features": [
        "Improvised weapon proficiency",
        "1d4 unarmed strike",
        "Bonus grapple after hit"
      ]
    }
  },
  {
    "id": "healer",
    "name": "Healer",
    "description": "You are an able physician, allowing you to mend wounds quickly and get your allies back in the fight. You gain the following benefits: When you use a healer's kit to stabilize a dying creature, that creature also regains 1 hit point. As an action, you can spend one use of a healer's kit to tend to a creature and restore 1d6 + 4 hit points to it, plus additional hit points equal to the creature's maximum number of Hit Dice. The creature can't regain hit points from this feat again until it finishes a short or long rest.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "benefits": {
      "features": [
        "Stabilize grants 1 HP",
        "Heal 1d6+4+HD with healer's kit"
      ]
    }
  },
  {
    "id": "inspiring-leader",
    "name": "Inspiring Leader",
    "description": "You can spend 10 minutes inspiring your companions, shoring up their resolve to fight. When you do so, choose up to six friendly creatures (which can include yourself) within 30 feet of you who can see or hear you and who can understand you. Each creature can gain temporary hit points equal to your level + your Charisma modifier. A creature can't gain temporary hit points from this feat again until it has finished a short or long rest.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "prerequisites": {
      "abilityScore": {
        "CHA": 13
      }
    },
    "benefits": {
      "features": [
        "Grant temp HP = level + CHA to 6 allies (10 min speech)"
      ]
    }
  }
];
