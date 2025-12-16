import { Subclass } from "../types/dnd-types";

export const SUBCLASSES: Subclass[] = [
  {
    "id": "evocation",
    "parentClassId": "wizard",
    "name": "School of Evocation",
    "description": "You focus your study on magic that creates powerful elemental effects such as bitter cold, searing flame, rolling thunder, crackling lightning, and burning acid.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 2,
        "name": "Evocation Savant",
        "description": "The gold and time you must spend to copy an evocation spell into your spellbook is halved."
      },
      {
        "level": 2,
        "name": "Sculpt Spells",
        "description": "When you cast an evocation spell that affects other creatures, you can choose a number of them equal to 1 + the spell's level to automatically succeed on their saving throws."
      },
      {
        "level": 6,
        "name": "Potent Cantrip",
        "description": "Your damaging cantrips affect even creatures that avoid the brunt of the effect."
      },
      {
        "level": 10,
        "name": "Empowered Evocation",
        "description": "You can add your Intelligence modifier to one damage roll of any wizard evocation spell you cast."
      },
      {
        "level": 14,
        "name": "Overchannel",
        "description": "You can increase the power of your simpler spells to deal maximum damage."
      }
    ]
  },
  {
    "id": "abjuration",
    "parentClassId": "wizard",
    "name": "School of Abjuration",
    "description": "The School of Abjuration emphasizes magic that blocks, banishes, or protects. Detractors of this school say that its tradition is about denial, negation rather than positive assertion.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 2,
        "name": "Abjuration Savant",
        "description": "The gold and time you must spend to copy an abjuration spell into your spellbook is halved."
      },
      {
        "level": 2,
        "name": "Arcane Ward",
        "description": "You can weave magic around yourself for protection. When you cast an abjuration spell, you create a magical ward."
      },
      {
        "level": 6,
        "name": "Projected Ward",
        "description": "When a creature you can see within 30 feet takes damage, you can use your reaction to cause your Arcane Ward to absorb that damage."
      },
      {
        "level": 10,
        "name": "Improved Abjuration",
        "description": "When you cast an abjuration spell that requires you to make an ability check, you add your proficiency bonus to that check."
      },
      {
        "level": 14,
        "name": "Spell Resistance",
        "description": "You have advantage on saving throws against spells."
      }
    ]
  },
  {
    "id": "necromancy",
    "parentClassId": "wizard",
    "name": "School of Necromancy",
    "description": "The School of Necromancy explores the cosmic forces of life, death, and undeath. As you focus your studies in this tradition, you learn to manipulate the energy that animates all living things.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 2,
        "name": "Necromancy Savant",
        "description": "The gold and time you must spend to copy a necromancy spell into your spellbook is halved."
      },
      {
        "level": 2,
        "name": "Grim Harvest",
        "description": "Once per turn when you kill a creature with a spell, you regain hit points."
      },
      {
        "level": 6,
        "name": "Undead Thralls",
        "description": "You add the Animate Dead spell to your spellbook if it's not there already. When you cast it, you can target one additional corpse or pile of bones."
      },
      {
        "level": 10,
        "name": "Inured to Undeath",
        "description": "You have resistance to necrotic damage, and your hit point maximum can't be reduced."
      },
      {
        "level": 14,
        "name": "Command Undead",
        "description": "You can use magic to bring undead under your control, even those created by other wizards."
      }
    ]
  },
  {
    "id": "illusion",
    "parentClassId": "wizard",
    "name": "School of Illusion",
    "description": "You focus your studies on magic that dazzles the senses, befuddles the mind, and tricks even the wisest folk.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 2,
        "name": "Illusion Savant",
        "description": "The gold and time you must spend to copy an illusion spell into your spellbook is halved."
      },
      {
        "level": 2,
        "name": "Improved Minor Illusion",
        "description": "You learn the Minor Illusion cantrip. You can create both a sound and an image with a single casting of the spell."
      },
      {
        "level": 6,
        "name": "Malleable Illusions",
        "description": "When you cast an illusion spell with a duration of 1 minute or longer, you can use your action to change the nature of that illusion."
      },
      {
        "level": 10,
        "name": "Illusory Self",
        "description": "When a creature makes an attack roll against you, you can use your reaction to interpose an illusory duplicate."
      },
      {
        "level": 14,
        "name": "Illusory Reality",
        "description": "You can choose one inanimate, nonmagical object that is part of an illusion spell and make that object real."
      }
    ]
  },
  {
    "id": "circle-of-stars",
    "parentClassId": "druid",
    "name": "Circle of Stars",
    "description": "The Circle of Stars allows druids to draw on the power of starlight, observing the cosmos and harnessing the energy of constellations.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Tasha's Cauldron of Everything",
    "edition": "2024",
    "version": 1,
    "features": [
      {
        "level": 2,
        "name": "Star Map",
        "description": "You have created a star chart as part of your heavenly studies. You gain the Guidance cantrip and can cast Guiding Bolt without expending a spell slot a number of times equal to your proficiency bonus."
      },
      {
        "level": 2,
        "name": "Starry Form",
        "description": "As a bonus action, you can expend a use of your Wild Shape to take on a starry form, gaining benefits based on the constellation you choose (Archer, Chalice, or Dragon)."
      },
      {
        "level": 6,
        "name": "Cosmic Omen",
        "description": "Whenever you finish a long rest, you can consult your Star Map to gain a reaction to aid allies or hinder foes based on the roll of a d6 (Weal or Woe)."
      },
      {
        "level": 10,
        "name": "Twinkling Constellations",
        "description": "Your Starry Form improves. The Archer and Chalice constellations deal more damage/healing, and Dragon grants flight speed."
      },
      {
        "level": 14,
        "name": "Full of Stars",
        "description": "While in your Starry Form, you become partially incorporeal, gaining resistance to bludgeoning, piercing, and slashing damage."
      }
    ]
  },
  {
    "id": "champion",
    "parentClassId": "fighter",
    "name": "Champion",
    "description": "The archetypal Champion focuses on the development of raw physical power honed to deadly perfection.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Improved Critical",
        "description": "Your weapon attacks score a critical hit on a roll of 19 or 20."
      },
      {
        "level": 7,
        "name": "Remarkable Athlete",
        "description": "You can add half your proficiency bonus to any Strength, Dexterity, or Constitution check you make that doesn't already use your proficiency bonus."
      },
      {
        "level": 10,
        "name": "Additional Fighting Style",
        "description": "You can choose a second option from the Fighting Style class feature."
      },
      {
        "level": 15,
        "name": "Superior Critical",
        "description": "Your weapon attacks score a critical hit on a roll of 18-20."
      },
      {
        "level": 18,
        "name": "Survivor",
        "description": "At the start of each of your turns, you regain hit points if you have no more than half your hit points left."
      }
    ]
  },
  {
    "id": "battle-master",
    "parentClassId": "fighter",
    "name": "Battle Master",
    "description": "Those who emulate the archetypal Battle Master employ martial techniques passed down through generations.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Combat Superiority",
        "description": "You learn maneuvers that are fueled by special dice called superiority dice."
      },
      {
        "level": 3,
        "name": "Student of War",
        "description": "You gain proficiency with one type of artisan's tools."
      },
      {
        "level": 7,
        "name": "Know Your Enemy",
        "description": "If you spend at least 1 minute observing or interacting with another creature, you can learn certain information about its capabilities."
      },
      {
        "level": 10,
        "name": "Improved Combat Superiority",
        "description": "Your superiority dice turn into d10s."
      },
      {
        "level": 15,
        "name": "Relentless",
        "description": "When you roll initiative and have no superiority dice remaining, you regain 1 superiority die."
      }
    ]
  },
  {
    "id": "eldritch-knight",
    "parentClassId": "fighter",
    "name": "Eldritch Knight",
    "description": "The archetypal Eldritch Knight combines the martial mastery common to all fighters with a careful study of magic.",
    "spellcaster": true,
    "spellcastingAbility": "INT",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "magicType": "Spell Slots (Wizard List)",
    "magicAbility": "Intelligence",
    "magicDescription": "You learn a small number of Wizard spells (mostly Abjuration and Evocation schools) and gain spell slots. Key Feature: You can eventually attack with a weapon and cast a cantrip/spell in the same turn.",
    "features": [
      {
        "level": 3,
        "name": "Spellcasting",
        "description": "You augment your martial prowess with the ability to cast spells from the wizard spell list."
      },
      {
        "level": 3,
        "name": "Weapon Bond",
        "description": "You learn a ritual that creates a magical bond between yourself and one weapon."
      },
      {
        "level": 7,
        "name": "War Magic",
        "description": "When you use your action to cast a cantrip, you can make one weapon attack as a bonus action."
      },
      {
        "level": 10,
        "name": "Eldritch Strike",
        "description": "When you hit a creature with a weapon attack, that creature has disadvantage on the next saving throw it makes against a spell you cast."
      },
      {
        "level": 15,
        "name": "Arcane Charge",
        "description": "When you use your Action Surge, you can teleport up to 30 feet to an unoccupied space you can see."
      }
    ]
  },
  {
    "id": "life-domain",
    "parentClassId": "cleric",
    "name": "Life Domain",
    "description": "The Life domain focuses on the vibrant positive energy that sustains all life.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 1,
        "name": "Bonus Proficiency",
        "description": "You gain proficiency with heavy armor."
      },
      {
        "level": 1,
        "name": "Disciple of Life",
        "description": "Your healing spells are more effective. Whenever you use a spell to restore hit points, the creature regains additional hit points."
      },
      {
        "level": 2,
        "name": "Channel Divinity: Preserve Life",
        "description": "You can use your Channel Divinity to heal the badly injured."
      },
      {
        "level": 6,
        "name": "Blessed Healer",
        "description": "The healing spells you cast on others heal you as well."
      },
      {
        "level": 8,
        "name": "Divine Strike",
        "description": "You gain the ability to infuse your weapon strikes with divine energy."
      },
      {
        "level": 17,
        "name": "Supreme Healing",
        "description": "When you would normally roll one or more dice to restore hit points with a spell, you instead use the highest number possible for each die."
      }
    ]
  },
  {
    "id": "light-domain",
    "parentClassId": "cleric",
    "name": "Light Domain",
    "description": "Gods of light promote the ideals of rebirth and renewal, truth, vigilance, and beauty.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 1,
        "name": "Bonus Cantrip",
        "description": "You gain the Light cantrip."
      },
      {
        "level": 1,
        "name": "Warding Flare",
        "description": "You can interpose divine light between yourself and an attacking enemy."
      },
      {
        "level": 2,
        "name": "Channel Divinity: Radiance of the Dawn",
        "description": "You can use your Channel Divinity to harness sunlight, banishing darkness and dealing radiant damage."
      },
      {
        "level": 6,
        "name": "Improved Flare",
        "description": "You can use your Warding Flare feature to protect someone else when a creature you can see attacks them."
      },
      {
        "level": 8,
        "name": "Potent Spellcasting",
        "description": "You add your Wisdom modifier to the damage you deal with any cleric cantrip."
      },
      {
        "level": 17,
        "name": "Corona of Light",
        "description": "You can use your action to activate an aura of sunlight."
      }
    ]
  },
  {
    "id": "war-domain",
    "parentClassId": "cleric",
    "name": "War Domain",
    "description": "War has many manifestations. It can make heroes of ordinary people. It can be desperate and horrific, with acts of cruelty and cowardice.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 1,
        "name": "Bonus Proficiencies",
        "description": "You gain proficiency with martial weapons and heavy armor."
      },
      {
        "level": 1,
        "name": "War Priest",
        "description": "When you use the Attack action, you can make one weapon attack as a bonus action."
      },
      {
        "level": 2,
        "name": "Channel Divinity: Guided Strike",
        "description": "You can use your Channel Divinity to strike with supernatural accuracy."
      },
      {
        "level": 6,
        "name": "Channel Divinity: War God's Blessing",
        "description": "When a creature within 30 feet makes an attack roll, you can use your reaction to grant a +10 bonus."
      },
      {
        "level": 8,
        "name": "Divine Strike",
        "description": "You gain the ability to infuse your weapon strikes with divine energy."
      },
      {
        "level": 17,
        "name": "Avatar of Battle",
        "description": "You gain resistance to bludgeoning, piercing, and slashing damage from nonmagical weapons."
      }
    ]
  },
  {
    "id": "thief",
    "parentClassId": "rogue",
    "name": "Thief",
    "description": "You hone your skills in the larcenous arts. Burglars, bandits, cutpurses, and other criminals typically follow this archetype.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Fast Hands",
        "description": "You can use the bonus action granted by your Cunning Action to make a Sleight of Hand check, use your thieves' tools, or take the Use an Object action."
      },
      {
        "level": 3,
        "name": "Second-Story Work",
        "description": "You gain the ability to climb faster than normal."
      },
      {
        "level": 9,
        "name": "Supreme Sneak",
        "description": "You have advantage on Dexterity (Stealth) checks if you move no more than half your speed on the same turn."
      },
      {
        "level": 13,
        "name": "Use Magic Device",
        "description": "You ignore all class, race, and level requirements on the use of magic items."
      },
      {
        "level": 17,
        "name": "Thief's Reflexes",
        "description": "You can take two turns during the first round of any combat."
      }
    ]
  },
  {
    "id": "assassin",
    "parentClassId": "rogue",
    "name": "Assassin",
    "description": "You focus your training on the grim art of death. Those who adhere to this archetype are diverse: hired killers, spies, bounty hunters.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Bonus Proficiencies",
        "description": "You gain proficiency with the disguise kit and the poisoner's kit."
      },
      {
        "level": 3,
        "name": "Assassinate",
        "description": "You have advantage on attack rolls against any creature that hasn't taken a turn in combat yet."
      },
      {
        "level": 9,
        "name": "Infiltration Expertise",
        "description": "You can unfailingly create false identities for yourself."
      },
      {
        "level": 13,
        "name": "Impostor",
        "description": "You gain the ability to unerringly mimic another person's speech, writing, and behavior."
      },
      {
        "level": 17,
        "name": "Death Strike",
        "description": "When you attack and hit a creature that is surprised, it must make a Constitution saving throw or double the damage of your attack."
      }
    ]
  },
  {
    "id": "arcane-trickster",
    "parentClassId": "rogue",
    "name": "Arcane Trickster",
    "description": "Arcane Tricksters combine their maneuverability and precision with exactingly applied magic.",
    "spellcaster": true,
    "spellcastingAbility": "INT",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "magicType": "Spell Slots (Wizard List)",
    "magicAbility": "Intelligence",
    "magicDescription": "You learn a small number of Wizard spells (mostly Enchantment and Illusion schools) and gain spell slots. Key Feature: You gain a magical Mage Hand that is invisible and can pick pockets or disarm traps from a distance.",
    "features": [
      {
        "level": 3,
        "name": "Spellcasting",
        "description": "You gain the ability to cast spells from the wizard spell list, focusing on enchantment and illusion."
      },
      {
        "level": 3,
        "name": "Mage Hand Legerdemain",
        "description": "When you cast Mage Hand, you can make the spectral hand invisible, and you can perform additional tasks with it."
      },
      {
        "level": 9,
        "name": "Magical Ambush",
        "description": "If you are hidden from a creature when you cast a spell on it, the creature has disadvantage on any saving throw it makes against the spell."
      },
      {
        "level": 13,
        "name": "Versatile Trickster",
        "description": "You gain the ability to distract targets with your Mage Hand."
      },
      {
        "level": 17,
        "name": "Spell Thief",
        "description": "You gain the ability to magically steal the knowledge of how to cast a spell from another spellcaster."
      }
    ]
  },
  {
    "id": "lore",
    "parentClassId": "bard",
    "name": "College of Lore",
    "description": "Bards of the College of Lore know something about most things, collecting bits of knowledge from sources as diverse as scholarly tomes and peasant tales.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Bonus Proficiencies",
        "description": "You gain proficiency with three skills of your choice."
      },
      {
        "level": 3,
        "name": "Cutting Words",
        "description": "You learn how to use your wit to distract, confuse, and otherwise sap the confidence and competence of others."
      },
      {
        "level": 6,
        "name": "Additional Magical Secrets",
        "description": "You learn two spells of your choice from any class."
      },
      {
        "level": 14,
        "name": "Peerless Skill",
        "description": "When you make an ability check, you can expend one use of Bardic Inspiration to add the Bardic Inspiration die to your ability check."
      }
    ]
  },
  {
    "id": "valor",
    "parentClassId": "bard",
    "name": "College of Valor",
    "description": "Bards of the College of Valor are daring skalds whose tales keep alive the memory of the great heroes of the past.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Bonus Proficiencies",
        "description": "You gain proficiency with medium armor, shields, and martial weapons."
      },
      {
        "level": 3,
        "name": "Combat Inspiration",
        "description": "A creature that has a Bardic Inspiration die can use it to add to a weapon damage roll or to AC."
      },
      {
        "level": 6,
        "name": "Extra Attack",
        "description": "You can attack twice, instead of once, whenever you take the Attack action on your turn."
      },
      {
        "level": 14,
        "name": "Battle Magic",
        "description": "When you use your action to cast a bard spell, you can make one weapon attack as a bonus action."
      }
    ]
  },
  {
    "id": "devotion",
    "parentClassId": "paladin",
    "name": "Oath of Devotion",
    "description": "The Oath of Devotion binds a paladin to the loftiest ideals of justice, virtue, and order.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Sacred Weapon",
        "description": "As an action, you can imbue one weapon with positive energy. For 1 minute, you add your Charisma modifier to attack rolls made with that weapon."
      },
      {
        "level": 3,
        "name": "Turn the Unholy",
        "description": "As an action, you present your holy symbol and speak a prayer censuring fiends and undead."
      },
      {
        "level": 7,
        "name": "Aura of Devotion",
        "description": "You and friendly creatures within 10 feet can't be charmed while you are conscious."
      },
      {
        "level": 15,
        "name": "Purity of Spirit",
        "description": "You are always under the effects of a Protection from Evil and Good spell."
      },
      {
        "level": 20,
        "name": "Holy Nimbus",
        "description": "As an action, you can emanate an aura of sunlight."
      }
    ]
  },
  {
    "id": "vengeance",
    "parentClassId": "paladin",
    "name": "Oath of Vengeance",
    "description": "The Oath of Vengeance is a solemn commitment to punish those who have committed a grievous sin.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Abjure Enemy",
        "description": "As an action, you present your holy symbol and speak a prayer of denunciation."
      },
      {
        "level": 3,
        "name": "Vow of Enmity",
        "description": "As a bonus action, you can utter a vow of enmity against a creature you can see within 10 feet."
      },
      {
        "level": 7,
        "name": "Relentless Avenger",
        "description": "When you hit a creature with an opportunity attack, you can move up to half your speed as part of the same reaction."
      },
      {
        "level": 15,
        "name": "Soul of Vengeance",
        "description": "When a creature under the effect of your Vow of Enmity makes an attack, you can use your reaction to make a melee weapon attack against that creature."
      },
      {
        "level": 20,
        "name": "Avenging Angel",
        "description": "You can assume the form of an angelic avenger."
      }
    ]
  },
  {
    "id": "hunter",
    "parentClassId": "ranger",
    "name": "Hunter",
    "description": "Emulating the Hunter archetype means accepting your place as a bulwark between civilization and the terrors of the wilderness.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Hunter's Prey",
        "description": "You gain one of several features: Colossus Slayer, Giant Killer, or Horde Breaker."
      },
      {
        "level": 7,
        "name": "Defensive Tactics",
        "description": "You gain one of several features: Escape the Horde, Multiattack Defense, or Steel Will."
      },
      {
        "level": 11,
        "name": "Multiattack",
        "description": "You gain one of several features: Volley or Whirlwind Attack."
      },
      {
        "level": 15,
        "name": "Superior Hunter's Defense",
        "description": "You gain one of several features: Evasion, Stand Against the Tide, or Uncanny Dodge."
      }
    ]
  },
  {
    "id": "beast-master",
    "parentClassId": "ranger",
    "name": "Beast Master",
    "description": "The Beast Master archetype embodies a friendship between the civilized races and the beasts of the wild.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Ranger's Companion",
        "description": "You gain a beast companion that accompanies you on your adventures."
      },
      {
        "level": 7,
        "name": "Exceptional Training",
        "description": "On any of your turns when your beast companion doesn't attack, you can use a bonus action to command the beast to take the Dash, Disengage, or Help action."
      },
      {
        "level": 11,
        "name": "Bestial Fury",
        "description": "When you command your beast companion to take the Attack action, the beast can make two attacks."
      },
      {
        "level": 15,
        "name": "Share Spells",
        "description": "When you cast a spell targeting yourself, you can also affect your beast companion with the spell."
      }
    ]
  },
  {
    "id": "draconic-bloodline",
    "parentClassId": "sorcerer",
    "name": "Draconic Bloodline",
    "description": "Your innate magic comes from draconic magic that was mingled with your blood or that of your ancestors.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 1,
        "name": "Dragon Ancestor",
        "description": "You choose one type of dragon as your ancestor. You can speak, read, and write Draconic."
      },
      {
        "level": 1,
        "name": "Draconic Resilience",
        "description": "Your hit point maximum increases by 1 per sorcerer level, and you have natural armor."
      },
      {
        "level": 6,
        "name": "Elemental Affinity",
        "description": "When you cast a spell that deals damage of the type associated with your draconic ancestry, you can add your Charisma modifier to that damage."
      },
      {
        "level": 14,
        "name": "Dragon Wings",
        "description": "You gain the ability to sprout a pair of dragon wings from your back."
      },
      {
        "level": 18,
        "name": "Draconic Presence",
        "description": "You can channel the dread presence of your dragon ancestor."
      }
    ]
  },
  {
    "id": "wild-magic",
    "parentClassId": "sorcerer",
    "name": "Wild Magic",
    "description": "Your innate magic comes from the wild forces of chaos that underlie the order of creation.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 1,
        "name": "Wild Magic Surge",
        "description": "Your spellcasting can unleash surges of untamed magic."
      },
      {
        "level": 1,
        "name": "Tides of Chaos",
        "description": "You can manipulate the forces of chance and chaos to gain advantage on one attack roll, ability check, or saving throw."
      },
      {
        "level": 6,
        "name": "Bend Luck",
        "description": "You can twist fate using your wild magic. When another creature you can see makes an attack roll, ability check, or saving throw, you can use your reaction and spend 2 sorcery points to roll 1d4 and apply the number rolled as a bonus or penalty."
      },
      {
        "level": 14,
        "name": "Controlled Chaos",
        "description": "Whenever you roll on the Wild Magic Surge table, you can roll twice and use either number."
      },
      {
        "level": 18,
        "name": "Spell Bombardment",
        "description": "When you roll damage for a spell and roll the highest number possible on any of the dice, choose one of those dice, roll it again, and add that roll to the damage."
      }
    ]
  },
  {
    "id": "the-fiend",
    "parentClassId": "warlock",
    "name": "The Fiend",
    "description": "You have made a pact with a fiend from the lower planes of existence, a being whose aims are evil.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 1,
        "name": "Dark One's Blessing",
        "description": "When you reduce a hostile creature to 0 hit points, you gain temporary hit points."
      },
      {
        "level": 6,
        "name": "Dark One's Own Luck",
        "description": "You can call on your patron to alter fate in your favor. When you make an ability check or saving throw, you can use this feature to add a d10 to your roll."
      },
      {
        "level": 10,
        "name": "Fiendish Resilience",
        "description": "You can choose one damage type when you finish a short or long rest. You gain resistance to that damage type."
      },
      {
        "level": 14,
        "name": "Hurl Through Hell",
        "description": "When you hit a creature with an attack, you can use this feature to instantly transport the target through the lower planes."
      }
    ]
  },
  {
    "id": "the-archfey",
    "parentClassId": "warlock",
    "name": "The Archfey",
    "description": "Your patron is a lord or lady of the fey, a creature of legend who holds secrets that were forgotten before the mortal races were born.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 1,
        "name": "Fey Presence",
        "description": "As an action, you can cause each creature in a 10-foot cube originating from you to make a Wisdom saving throw against your warlock spell save DC."
      },
      {
        "level": 6,
        "name": "Misty Escape",
        "description": "When you take damage, you can use your reaction to turn invisible and teleport."
      },
      {
        "level": 10,
        "name": "Beguiling Defenses",
        "description": "You are immune to being charmed, and when another creature attempts to charm you, you can use your reaction to attempt to turn the charm back on that creature."
      },
      {
        "level": 14,
        "name": "Dark Delirium",
        "description": "You can plunge a creature into an illusory realm."
      }
    ]
  },
  {
    "id": "the-hexblade",
    "parentClassId": "warlock",
    "name": "The Hexblade",
    "description": "You have made your pact with a mysterious entity from the Shadowfell - a force that manifests in sentient magic weapons carved from the stuff of shadow.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 1,
        "name": "Hexblade's Curse",
        "description": "As a bonus action, you place a curse on a creature you can see within 30 feet of you."
      },
      {
        "level": 1,
        "name": "Hex Warrior",
        "description": "You gain proficiency with medium armor, shields, and martial weapons."
      },
      {
        "level": 6,
        "name": "Accursed Specter",
        "description": "When you slay a humanoid, you can cause its spirit to rise from its corpse as a specter."
      },
      {
        "level": 10,
        "name": "Armor of Hexes",
        "description": "Your hex grows more powerful. If the target cursed by your Hexblade's Curse hits you with an attack roll, roll a d6."
      },
      {
        "level": 14,
        "name": "Master of Hexes",
        "description": "When the creature cursed by your Hexblade's Curse dies, you can apply the curse to a different creature."
      }
    ]
  },
  {
    "id": "berserker",
    "parentClassId": "barbarian",
    "name": "Path of the Berserker",
    "description": "For some barbarians, rage is a means to an end - that end being violence.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Frenzy",
        "description": "You can go into a frenzy when you rage. While raging, you can make a single melee weapon attack as a bonus action on each of your turns."
      },
      {
        "level": 6,
        "name": "Mindless Rage",
        "description": "You can't be charmed or frightened while raging."
      },
      {
        "level": 10,
        "name": "Intimidating Presence",
        "description": "You can use your action to frighten someone with your menacing presence."
      },
      {
        "level": 14,
        "name": "Retaliation",
        "description": "When you take damage from a creature that is within 5 feet of you, you can use your reaction to make a melee weapon attack against that creature."
      }
    ]
  },
  {
    "id": "totem-warrior",
    "parentClassId": "barbarian",
    "name": "Path of the Totem Warrior",
    "description": "The Path of the Totem Warrior is a spiritual journey, as the barbarian accepts a spirit animal as a guide, protector, and inspiration. In battle, your totem spirit fills you with supernatural might.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "magicType": "Rituals Only",
    "magicAbility": "Wisdom (for DC)",
    "magicDescription": "You can cast Beast Sense and Speak with Animals, but only as rituals (takes 10 minutes to cast). This adds utility without using spell slots.",
    "features": [
      {
        "level": 3,
        "name": "Spirit Seeker",
        "description": "Yours is a path that seeks attunement with the natural world, giving you a kinship with beasts."
      },
      {
        "level": 3,
        "name": "Totem Spirit",
        "description": "You choose a totem spirit and gain its feature. You must make or acquire a physical totem object."
      },
      {
        "level": 6,
        "name": "Aspect of the Beast",
        "description": "You gain a magical benefit based on the totem animal of your choice."
      },
      {
        "level": 10,
        "name": "Spirit Walker",
        "description": "You can cast the Commune with Nature spell, but only as a ritual."
      },
      {
        "level": 14,
        "name": "Totemic Attunement",
        "description": "You gain a magical benefit based on a totem animal of your choice."
      }
    ]
  },
  {
    "id": "open-hand",
    "parentClassId": "monk",
    "name": "Way of the Open Hand",
    "description": "Monks of the Way of the Open Hand are the ultimate masters of martial arts combat.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Open Hand Technique",
        "description": "Whenever you hit a creature with one of the attacks granted by your Flurry of Blows, you can impose one of several effects on that target."
      },
      {
        "level": 6,
        "name": "Wholeness of Body",
        "description": "You gain the ability to heal yourself. As an action, you can regain hit points."
      },
      {
        "level": 11,
        "name": "Tranquility",
        "description": "You can enter a special meditation that surrounds you with an aura of peace."
      },
      {
        "level": 17,
        "name": "Quivering Palm",
        "description": "You gain the ability to set up lethal vibrations in someone's body."
      }
    ]
  },
  {
    "id": "shadow",
    "parentClassId": "monk",
    "name": "Way of Shadow",
    "description": "Monks of the Way of Shadow follow a tradition that values stealth and subterfuge.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "magicType": "Ki Spells (Stealth)",
    "magicAbility": "Wisdom",
    "magicDescription": "Stealth spells using Ki",
    "features": [
      {
        "level": 3,
        "name": "Shadow Arts",
        "description": "You can use ki to duplicate the effects of certain spells."
      },
      {
        "level": 6,
        "name": "Shadow Step",
        "description": "You gain the ability to step from one shadow into another."
      },
      {
        "level": 11,
        "name": "Cloak of Shadows",
        "description": "You can use your action to become invisible in dim light or darkness."
      },
      {
        "level": 17,
        "name": "Opportunist",
        "description": "You can exploit a creature's momentary distraction when it is hit by an attack."
      }
    ]
  },
  {
    "id": "land",
    "parentClassId": "druid",
    "name": "Circle of the Land",
    "description": "The Circle of the Land is made up of mystics and sages who safeguard ancient knowledge and rites.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 2,
        "name": "Bonus Cantrip",
        "description": "You learn one additional druid cantrip of your choice."
      },
      {
        "level": 2,
        "name": "Natural Recovery",
        "description": "During a short rest, you can recover some of your magical energy."
      },
      {
        "level": 3,
        "name": "Circle Spells",
        "description": "Your mystical connection to the land infuses you with the ability to cast certain spells."
      },
      {
        "level": 6,
        "name": "Land's Stride",
        "description": "Moving through nonmagical difficult terrain costs you no extra movement."
      },
      {
        "level": 10,
        "name": "Nature's Ward",
        "description": "You can't be charmed or frightened by elementals or fey."
      },
      {
        "level": 14,
        "name": "Nature's Sanctuary",
        "description": "Creatures of the natural world sense your connection to nature and become hesitant to attack you."
      }
    ]
  },
  {
    "id": "moon",
    "parentClassId": "druid",
    "name": "Circle of the Moon",
    "description": "Druids of the Circle of the Moon are fierce guardians of the wilds.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 2,
        "name": "Combat Wild Shape",
        "description": "You gain the ability to use Wild Shape on your turn as a bonus action, rather than as an action."
      },
      {
        "level": 2,
        "name": "Circle Forms",
        "description": "The rites of your circle grant you the ability to transform into more dangerous animal forms."
      },
      {
        "level": 6,
        "name": "Primal Strike",
        "description": "Your attacks in beast form count as magical for the purpose of overcoming resistance."
      },
      {
        "level": 10,
        "name": "Elemental Wild Shape",
        "description": "You can expend two uses of Wild Shape to transform into an air elemental, earth elemental, fire elemental, or water elemental."
      },
      {
        "level": 14,
        "name": "Thousand Forms",
        "description": "You can cast the Alter Self spell at will."
      }
    ]
  },
  {
    "id": "alchemist",
    "parentClassId": "artificer",
    "name": "Alchemist",
    "description": "An Alchemist is an expert at combining reagents to produce mystical effects.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Tool Proficiency",
        "description": "You gain proficiency with alchemist's supplies."
      },
      {
        "level": 3,
        "name": "Alchemist Spells",
        "description": "You always have certain spells prepared that don't count against your prepared spells."
      },
      {
        "level": 3,
        "name": "Experimental Elixir",
        "description": "When you finish a long rest, you can magically produce an experimental elixir in an empty flask."
      },
      {
        "level": 5,
        "name": "Alchemical Savant",
        "description": "You've developed masterful command of magical chemicals. Whenever you cast a spell using alchemist's supplies, you gain a bonus to spell damage or healing rolls."
      },
      {
        "level": 9,
        "name": "Restorative Reagents",
        "description": "You can incorporate restorative reagents into some of your works."
      },
      {
        "level": 15,
        "name": "Chemical Mastery",
        "description": "You have been exposed to so many chemicals that they pose little risk to you."
      }
    ]
  },
  {
    "id": "artillerist",
    "parentClassId": "artificer",
    "name": "Artillerist",
    "description": "An Artillerist specializes in using magic to hurl energy, projectiles, and explosions.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Tool Proficiency",
        "description": "You gain proficiency with woodcarver's tools."
      },
      {
        "level": 3,
        "name": "Artillerist Spells",
        "description": "You always have certain spells prepared that don't count against your prepared spells."
      },
      {
        "level": 3,
        "name": "Eldritch Cannon",
        "description": "You've learned how to create a magical cannon. You can use an action to magically summon the cannon in an unoccupied space."
      },
      {
        "level": 5,
        "name": "Arcane Firearm",
        "description": "You know how to turn a wand, staff, or rod into an arcane firearm."
      },
      {
        "level": 9,
        "name": "Explosive Cannon",
        "description": "Every eldritch cannon you create is more destructive."
      },
      {
        "level": 15,
        "name": "Fortified Position",
        "description": "You're a master at forming well-defended emplacements using Eldritch Cannon."
      }
    ]
  },
  {
    "id": "battle-smith",
    "parentClassId": "artificer",
    "name": "Battle Smith",
    "description": "Armies require protection, and someone has to put things back together if defenses fail. A combination of protector and medic, a Battle Smith is an expert at defending others and repairing both materiel and personnel.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Tool Proficiency",
        "description": "You gain proficiency with smith's tools."
      },
      {
        "level": 3,
        "name": "Battle Smith Spells",
        "description": "You always have certain spells prepared that don't count against your prepared spells."
      },
      {
        "level": 3,
        "name": "Battle Ready",
        "description": "Your combat training and experiments with magic have paid off. You gain proficiency with martial weapons and can use Intelligence for attack and damage rolls."
      },
      {
        "level": 3,
        "name": "Steel Defender",
        "description": "Your tinkering has borne you a faithful companion, a steel defender."
      },
      {
        "level": 9,
        "name": "Arcane Jolt",
        "description": "You learn new ways to channel arcane energy through your weapon attacks and your steel defender."
      },
      {
        "level": 15,
        "name": "Improved Defender",
        "description": "Your Arcane Jolt and steel defender become more powerful."
      }
    ]
  },
  {
    "id": "divination",
    "parentClassId": "wizard",
    "name": "School of Divination",
    "description": "The counsel of a diviner is sought by royalty and commoners alike, for all seek a clearer understanding of the past, present, and future. As a diviner, you strive to part the veils of space, time, and consciousness.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 2,
        "name": "Divination Savant",
        "description": "The gold and time you must spend to copy a divination spell into your spellbook is halved."
      },
      {
        "level": 2,
        "name": "Portent",
        "description": "Glimpses of the future begin to press in on your awareness. When you finish a long rest, roll two d20s and record the numbers rolled."
      },
      {
        "level": 6,
        "name": "Expert Divination",
        "description": "Casting divination spells comes so easily to you that it expends only a fraction of your spellcasting efforts."
      },
      {
        "level": 10,
        "name": "The Third Eye",
        "description": "You can use your action to increase your powers of perception."
      },
      {
        "level": 14,
        "name": "Greater Portent",
        "description": "The visions in your dreams intensify and paint a more accurate picture in your mind of what is to come. You roll three d20s for your Portent feature."
      }
    ]
  },
  {
    "id": "enchantment",
    "parentClassId": "wizard",
    "name": "School of Enchantment",
    "description": "You have honed your ability to magically entrance and beguile other people and monsters. Some enchanters are peacemakers who bewitch the violent to lay down their arms.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 2,
        "name": "Enchantment Savant",
        "description": "The gold and time you must spend to copy an enchantment spell into your spellbook is halved."
      },
      {
        "level": 2,
        "name": "Hypnotic Gaze",
        "description": "Your soft words and enchanting gaze can magically enthrall another creature."
      },
      {
        "level": 6,
        "name": "Instinctive Charm",
        "description": "When a creature you can see within 30 feet makes an attack roll against you, you can use your reaction to divert the attack."
      },
      {
        "level": 10,
        "name": "Split Enchantment",
        "description": "When you cast an enchantment spell of 1st level or higher that targets only one creature, you can have it target a second creature."
      },
      {
        "level": 14,
        "name": "Alter Memories",
        "description": "You gain the ability to make a creature unaware of your magical influence on it."
      }
    ]
  },
  {
    "id": "conjuration",
    "parentClassId": "wizard",
    "name": "School of Conjuration",
    "description": "You focus your studies on magic that produces objects and creatures out of thin air. You can conjure billowing clouds of killing fog or summon creatures from elsewhere to fight on your behalf.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 2,
        "name": "Conjuration Savant",
        "description": "The gold and time you must spend to copy a conjuration spell into your spellbook is halved."
      },
      {
        "level": 2,
        "name": "Minor Conjuration",
        "description": "You can use your action to conjure up an inanimate object in your hand or on the ground in an unoccupied space."
      },
      {
        "level": 6,
        "name": "Benign Transposition",
        "description": "You can use your action to teleport up to 30 feet to an unoccupied space that you can see."
      },
      {
        "level": 10,
        "name": "Focused Conjuration",
        "description": "While you are concentrating on a conjuration spell, your concentration can't be broken as a result of taking damage."
      },
      {
        "level": 14,
        "name": "Durable Summons",
        "description": "Any creature that you summon or create with a conjuration spell has 30 temporary hit points."
      }
    ]
  },
  {
    "id": "transmutation",
    "parentClassId": "wizard",
    "name": "School of Transmutation",
    "description": "You are a student of spells that modify energy and matter. To you, the world is not a fixed thing, but eminently mutable.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 2,
        "name": "Transmutation Savant",
        "description": "The gold and time you must spend to copy a transmutation spell into your spellbook is halved."
      },
      {
        "level": 2,
        "name": "Minor Alchemy",
        "description": "You can temporarily alter the physical properties of one nonmagical object."
      },
      {
        "level": 6,
        "name": "Transmuter's Stone",
        "description": "You can spend 8 hours creating a transmuter's stone that stores transmutation magic."
      },
      {
        "level": 10,
        "name": "Shapechanger",
        "description": "You add the Polymorph spell to your spellbook. You can cast it on yourself without expending a spell slot."
      },
      {
        "level": 14,
        "name": "Master Transmuter",
        "description": "You can use your action to consume the reserve of transmutation magic stored within your transmuter's stone."
      }
    ]
  },
  {
    "id": "knowledge-domain",
    "parentClassId": "cleric",
    "name": "Knowledge Domain",
    "description": "The gods of knowledge value learning and understanding above all. Some teach that knowledge is to be gathered and shared in libraries and universities.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 1,
        "name": "Blessings of Knowledge",
        "description": "You learn two languages of your choice and gain proficiency in two skills of your choice."
      },
      {
        "level": 2,
        "name": "Channel Divinity: Knowledge of the Ages",
        "description": "You can use your Channel Divinity to tap into a divine well of knowledge."
      },
      {
        "level": 6,
        "name": "Channel Divinity: Read Thoughts",
        "description": "You can use your Channel Divinity to read a creature's thoughts."
      },
      {
        "level": 8,
        "name": "Potent Spellcasting",
        "description": "You add your Wisdom modifier to the damage you deal with any cleric cantrip."
      },
      {
        "level": 17,
        "name": "Visions of the Past",
        "description": "You can call up visions of the past that relate to an object or location."
      }
    ]
  },
  {
    "id": "tempest-domain",
    "parentClassId": "cleric",
    "name": "Tempest Domain",
    "description": "Gods whose portfolios include the Tempest domain govern storms, sea, and sky. They include gods of lightning and thunder, gods of earthquakes, and some gods of violence.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 1,
        "name": "Bonus Proficiencies",
        "description": "You gain proficiency with martial weapons and heavy armor."
      },
      {
        "level": 1,
        "name": "Wrath of the Storm",
        "description": "When a creature within 5 feet hits you with an attack, you can use your reaction to cause the creature to make a Dexterity saving throw."
      },
      {
        "level": 2,
        "name": "Channel Divinity: Destructive Wrath",
        "description": "You can use your Channel Divinity to wield the power of the storm with unchecked ferocity."
      },
      {
        "level": 6,
        "name": "Thunderbolt Strike",
        "description": "When you deal lightning damage to a Large or smaller creature, you can also push it up to 10 feet away from you."
      },
      {
        "level": 8,
        "name": "Divine Strike",
        "description": "You gain the ability to infuse your weapon strikes with divine energy."
      },
      {
        "level": 17,
        "name": "Stormborn",
        "description": "You have a flying speed equal to your current walking speed whenever you are not underground or indoors."
      }
    ]
  },
  {
    "id": "trickery-domain",
    "parentClassId": "cleric",
    "name": "Trickery Domain",
    "description": "Gods of trickery are mischief-makers and instigators who stand as a constant challenge to the accepted order among both gods and mortals.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 1,
        "name": "Blessing of the Trickster",
        "description": "You can use your action to touch a willing creature other than yourself to give it advantage on Dexterity (Stealth) checks."
      },
      {
        "level": 2,
        "name": "Channel Divinity: Invoke Duplicity",
        "description": "You can use your Channel Divinity to create an illusory duplicate of yourself."
      },
      {
        "level": 6,
        "name": "Channel Divinity: Cloak of Shadows",
        "description": "You can use your Channel Divinity to vanish."
      },
      {
        "level": 8,
        "name": "Divine Strike",
        "description": "You gain the ability to infuse your weapon strikes with poison."
      },
      {
        "level": 17,
        "name": "Improved Duplicity",
        "description": "You can create up to four duplicates of yourself, instead of one."
      }
    ]
  },
  {
    "id": "nature-domain",
    "parentClassId": "cleric",
    "name": "Nature Domain",
    "description": "Gods of nature are as varied as the natural world itself. They are patrons of druids and worship the forces of nature itself.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 1,
        "name": "Acolyte of Nature",
        "description": "You learn one druid cantrip of your choice and gain proficiency in one skill of your choice."
      },
      {
        "level": 1,
        "name": "Bonus Proficiency",
        "description": "You gain proficiency with heavy armor."
      },
      {
        "level": 2,
        "name": "Channel Divinity: Charm Animals and Plants",
        "description": "You can use your Channel Divinity to charm animals and plants."
      },
      {
        "level": 6,
        "name": "Dampen Elements",
        "description": "When you or a creature within 30 feet takes acid, cold, fire, lightning, or thunder damage, you can use your reaction to grant resistance to that damage."
      },
      {
        "level": 8,
        "name": "Divine Strike",
        "description": "You gain the ability to infuse your weapon strikes with divine energy."
      },
      {
        "level": 17,
        "name": "Master of Nature",
        "description": "You gain the ability to command animals and plant creatures."
      }
    ]
  },
  {
    "id": "samurai",
    "parentClassId": "fighter",
    "name": "Samurai",
    "description": "The Samurai is a fighter who draws on an implacable fighting spirit to overcome enemies. A samurai's resolve is nearly unbreakable.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Bonus Proficiency",
        "description": "You gain proficiency in one skill of your choice."
      },
      {
        "level": 3,
        "name": "Fighting Spirit",
        "description": "As a bonus action, you can give yourself advantage on weapon attack rolls until the end of your turn."
      },
      {
        "level": 7,
        "name": "Elegant Courtier",
        "description": "Your discipline and attention to detail allow you to excel in social situations."
      },
      {
        "level": 10,
        "name": "Tireless Spirit",
        "description": "When you roll initiative and have no uses of Fighting Spirit remaining, you regain one use."
      },
      {
        "level": 15,
        "name": "Rapid Strike",
        "description": "You learn to trade accuracy for swift strikes."
      },
      {
        "level": 18,
        "name": "Strength Before Death",
        "description": "If you take damage that reduces you to 0 hit points, you can delay falling unconscious."
      }
    ]
  },
  {
    "id": "arcane-archer",
    "parentClassId": "fighter",
    "name": "Arcane Archer",
    "description": "An Arcane Archer studies a unique elven method of archery that weaves magic into attacks to produce supernatural effects.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "magicType": "Arcane Shots",
    "magicAbility": "Intelligence",
    "magicDescription": "You gain one cantrip (Druidcraft or Prestidigation), but your main magic comes from 'Arcane Shots which are magical effects applied to your arrows, rather than actual spells.",
    "features": [
      {
        "level": 3,
        "name": "Arcane Archer Lore",
        "description": "You learn magical theory or some of the secrets of nature."
      },
      {
        "level": 3,
        "name": "Arcane Shot",
        "description": "You learn to unleash special magical effects with some of your shots."
      },
      {
        "level": 7,
        "name": "Magic Arrow",
        "description": "You gain the ability to infuse arrows with magic."
      },
      {
        "level": 10,
        "name": "Curving Shot",
        "description": "You learn how to direct an errant arrow toward a new target."
      },
      {
        "level": 15,
        "name": "Ever-Ready Shot",
        "description": "Your magical archery is available whenever battle starts."
      },
      {
        "level": 18,
        "name": "Improved Arcane Shot",
        "description": "Your Arcane Shot options become more powerful."
      }
    ]
  },
  {
    "id": "swashbuckler",
    "parentClassId": "rogue",
    "name": "Swashbuckler",
    "description": "You focus your training on the art of the blade, relying on speed, elegance, and charm in equal parts.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Fancy Footwork",
        "description": "During your turn, if you make a melee attack against a creature, that creature can't make opportunity attacks against you for the rest of your turn."
      },
      {
        "level": 3,
        "name": "Rakish Audacity",
        "description": "You add your Charisma modifier to your initiative rolls and you don't need advantage on your attack roll to use Sneak Attack."
      },
      {
        "level": 9,
        "name": "Panache",
        "description": "You can make a Charisma (Persuasion) check to charm a humanoid."
      },
      {
        "level": 13,
        "name": "Elegant Maneuver",
        "description": "You can use a bonus action to gain advantage on the next Dexterity (Acrobatics) or Strength (Athletics) check."
      },
      {
        "level": 17,
        "name": "Master Duelist",
        "description": "If you miss with an attack roll, you can choose to roll it again with advantage."
      }
    ]
  },
  {
    "id": "inquisitive",
    "parentClassId": "rogue",
    "name": "Inquisitive",
    "description": "You excel at rooting out secrets and unraveling mysteries. You rely on your sharp eye for detail.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Ear for Deceit",
        "description": "You develop a talent for picking out lies."
      },
      {
        "level": 3,
        "name": "Eye for Detail",
        "description": "You can use a bonus action to make a Wisdom (Perception) check or Intelligence (Investigation) check."
      },
      {
        "level": 3,
        "name": "Insightful Fighting",
        "description": "You can use a bonus action to make a Wisdom (Insight) check against a creature you can see."
      },
      {
        "level": 9,
        "name": "Steady Eye",
        "description": "You have advantage on Wisdom (Perception) or Intelligence (Investigation) checks if you move no more than half your speed."
      },
      {
        "level": 13,
        "name": "Unerring Eye",
        "description": "You can sense the presence of illusions, shapechangers, and magic."
      },
      {
        "level": 17,
        "name": "Eye for Weakness",
        "description": "You learn to exploit a creature's weaknesses."
      }
    ]
  },
  {
    "id": "ancients",
    "parentClassId": "paladin",
    "name": "Oath of the Ancients",
    "description": "The Oath of the Ancients is as old as the race of elves and the rituals of the druids. Paladins who swear this oath cast their lot with the side of the light in the cosmic struggle against darkness.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Nature's Wrath",
        "description": "You can use your Channel Divinity to invoke primeval forces to ensnare a foe."
      },
      {
        "level": 3,
        "name": "Turn the Faithless",
        "description": "You can use your Channel Divinity to utter ancient words that are painful for fey and fiends to hear."
      },
      {
        "level": 7,
        "name": "Aura of Warding",
        "description": "Ancient magic lies so heavily upon you that it forms an eldritch ward."
      },
      {
        "level": 15,
        "name": "Undying Sentinel",
        "description": "When you are reduced to 0 hit points, you can choose to drop to 1 hit point instead."
      },
      {
        "level": 20,
        "name": "Elder Champion",
        "description": "You can assume the form of an ancient force of nature."
      }
    ]
  },
  {
    "id": "conquest",
    "parentClassId": "paladin",
    "name": "Oath of Conquest",
    "description": "The Oath of Conquest calls to paladins who seek glory in battle and the subjugation of their enemies.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Conquering Presence",
        "description": "You can use your Channel Divinity to exude a terrifying presence."
      },
      {
        "level": 3,
        "name": "Guided Strike",
        "description": "You can use your Channel Divinity to strike with supernatural accuracy."
      },
      {
        "level": 7,
        "name": "Aura of Conquest",
        "description": "You constantly emanate a menacing aura while you're not incapacitated."
      },
      {
        "level": 15,
        "name": "Scornful Rebuke",
        "description": "Those who dare to strike you are punished for their audacity."
      },
      {
        "level": 20,
        "name": "Invincible Conqueror",
        "description": "You gain the ability to harness extraordinary martial prowess."
      }
    ]
  },
  {
    "id": "great-old-one",
    "parentClassId": "warlock",
    "name": "The Great Old One",
    "description": "Your patron is a mysterious entity whose nature is utterly foreign to the fabric of reality. It might come from the Far Realm, or it could be one of the elder gods.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 1,
        "name": "Awakened Mind",
        "description": "You can communicate telepathically with any creature you can see within 30 feet of you."
      },
      {
        "level": 6,
        "name": "Entropic Ward",
        "description": "You learn to magically ward yourself against attack and to turn an enemy's failed strike into good luck."
      },
      {
        "level": 10,
        "name": "Thought Shield",
        "description": "Your thoughts can't be read by telepathy or other means unless you allow it."
      },
      {
        "level": 14,
        "name": "Create Thrall",
        "description": "You gain the ability to infect a humanoid's mind with the alien magic of your patron."
      }
    ]
  },
  {
    "id": "celestial",
    "parentClassId": "warlock",
    "name": "The Celestial",
    "description": "Your patron is a powerful being of the Upper Planes. You have bound yourself to an ancient empyrean, solar, ki-rin, unicorn, or other entity.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 1,
        "name": "Bonus Cantrips",
        "description": "You learn the Light and Sacred Flame cantrips."
      },
      {
        "level": 1,
        "name": "Healing Light",
        "description": "You gain the ability to channel celestial energy to heal wounds."
      },
      {
        "level": 6,
        "name": "Radiant Soul",
        "description": "Your link to the Celestial allows you to serve as a conduit for radiant energy."
      },
      {
        "level": 10,
        "name": "Celestial Resilience",
        "description": "You gain temporary hit points whenever you finish a short or long rest."
      },
      {
        "level": 14,
        "name": "Searing Vengeance",
        "description": "The radiant energy you channel allows you to resist death."
      }
    ]
  },
  {
    "id": "dreams",
    "parentClassId": "druid",
    "name": "Circle of Dreams",
    "description": "Druids who are members of the Circle of Dreams hail from regions that have strong ties to the Feywild. The druids' guardianship of the natural world makes for a natural alliance between them and good-aligned fey.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 2,
        "name": "Balm of the Summer Court",
        "description": "You become imbued with the blessings of the Summer Court."
      },
      {
        "level": 6,
        "name": "Hearth of Moonlight and Shadow",
        "description": "Home can be wherever you are."
      },
      {
        "level": 10,
        "name": "Hidden Paths",
        "description": "You can use the hidden, magical pathways of the Feywild."
      },
      {
        "level": 14,
        "name": "Walker in Dreams",
        "description": "The magic of the Feywild grants you the ability to travel mentally or physically through dreamlands."
      }
    ]
  },
  {
    "id": "wildfire",
    "parentClassId": "druid",
    "name": "Circle of Wildfire",
    "description": "Druids within the Circle of Wildfire understand that destruction is sometimes the precursor of creation, such as when a forest fire promotes later growth.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 2,
        "name": "Summon Wildfire Spirit",
        "description": "You can summon the primal spirit bound to your soul."
      },
      {
        "level": 6,
        "name": "Enhanced Bond",
        "description": "The bond with your wildfire spirit enhances your destructive and restorative spells."
      },
      {
        "level": 10,
        "name": "Cauterizing Flames",
        "description": "You gain the ability to turn death into magical flames that can heal or incinerate."
      },
      {
        "level": 14,
        "name": "Blazing Revival",
        "description": "The bond with your wildfire spirit can save you from death."
      }
    ]
  },
  {
    "id": "four-elements",
    "parentClassId": "monk",
    "name": "Way of the Four Elements",
    "description": "You follow a monastic tradition that teaches you to harness the elements. When you focus your ki, you can align yourself with the forces of creation and bend the four elements to your will.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "magicType": "Spells using Ki",
    "magicAbility": "Wisdom",
    "magicDescription": "You learn 'Elemental Disciplines' that allow you to spend Ki to cast spells like Burning Hands, Fly, or Fireball.",
    "features": [
      {
        "level": 3,
        "name": "Disciple of the Elements",
        "description": "You learn magical disciplines that harness the power of the four elements."
      },
      {
        "level": 6,
        "name": "Extra Elemental Discipline",
        "description": "You learn one additional elemental discipline of your choice."
      },
      {
        "level": 11,
        "name": "Extra Elemental Discipline",
        "description": "You learn one additional elemental discipline of your choice."
      },
      {
        "level": 17,
        "name": "Extra Elemental Discipline",
        "description": "You learn one additional elemental discipline of your choice."
      }
    ]
  },
  {
    "id": "kensei",
    "parentClassId": "monk",
    "name": "Way of the Kensei",
    "description": "Monks of the Way of the Kensei train relentlessly with their weapons, to the point where the weapon becomes an extension of the body.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Path of the Kensei",
        "description": "You learn to extend your ki into your kensei weapons."
      },
      {
        "level": 6,
        "name": "One with the Blade",
        "description": "You gain the ability to augment your weapons further with your ki."
      },
      {
        "level": 11,
        "name": "Sharpen the Blade",
        "description": "You gain the ability to augment your weapons further with your ki."
      },
      {
        "level": 17,
        "name": "Unerring Accuracy",
        "description": "Your mastery of weapons grants you extraordinary accuracy."
      }
    ]
  },
  {
    "id": "zealot",
    "parentClassId": "barbarian",
    "name": "Path of the Zealot",
    "description": "Some deities inspire their followers to pitch themselves into a ferocious battle fury. These barbarians are zealots.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Divine Fury",
        "description": "You can channel divine fury into your weapon strikes."
      },
      {
        "level": 3,
        "name": "Warrior of the Gods",
        "description": "Your soul is marked for endless battle."
      },
      {
        "level": 6,
        "name": "Fanatical Focus",
        "description": "The divine power that fuels your rage can protect you."
      },
      {
        "level": 10,
        "name": "Zealous Presence",
        "description": "You learn to channel divine fury to inspire zealotry in others."
      },
      {
        "level": 14,
        "name": "Rage Beyond Death",
        "description": "The divine power that fuels your rage allows you to shrug off fatal blows."
      }
    ]
  },
  {
    "id": "ancestral-guardian",
    "parentClassId": "barbarian",
    "name": "Path of the Ancestral Guardian",
    "description": "Some barbarians hail from cultures that revere their ancestors. These tribes teach that the warriors of the past linger in the world as mighty spirits.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Ancestral Protectors",
        "description": "Spectral warriors appear when you enter your rage."
      },
      {
        "level": 6,
        "name": "Spirit Shield",
        "description": "The guardian spirits that aid you can provide supernatural protection to those you defend."
      },
      {
        "level": 10,
        "name": "Consult the Spirits",
        "description": "You gain the ability to consult with your ancestral spirits."
      },
      {
        "level": 14,
        "name": "Vengeful Ancestors",
        "description": "Your ancestral spirits grow powerful enough to retaliate."
      }
    ]
  },
  {
    "id": "gloom-stalker",
    "parentClassId": "ranger",
    "name": "Gloom Stalker",
    "description": "Gloom Stalkers are at home in the darkest places. They venture boldly into the unknown, hunting down threats in the deepest shadows.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Dread Ambusher",
        "description": "You master the art of the ambush."
      },
      {
        "level": 3,
        "name": "Umbral Sight",
        "description": "You gain darkvision and become invisible to creatures that rely on darkvision."
      },
      {
        "level": 7,
        "name": "Iron Mind",
        "description": "You hone your ability to resist the mind-altering powers of your prey."
      },
      {
        "level": 11,
        "name": "Stalker's Flurry",
        "description": "You learn to attack with such unexpected speed that you can turn a miss into another strike."
      },
      {
        "level": 15,
        "name": "Shadowy Dodge",
        "description": "You can dodge in unforeseen ways, with wisps of supernatural shadow around you."
      }
    ]
  },
  {
    "id": "fey-wanderer",
    "parentClassId": "ranger",
    "name": "Fey Wanderer",
    "description": "A fey mystique surrounds you, thanks to the boon of an archfey, the shining fruit you ate from a talking tree, or a midnight stroll through the Feywild.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Dreadful Strikes",
        "description": "You augment your attacks with mind-scarring magic."
      },
      {
        "level": 3,
        "name": "Otherworldly Glamour",
        "description": "Your fey qualities give you a supernatural charm."
      },
      {
        "level": 7,
        "name": "Beguiling Twist",
        "description": "The magic of the Feywild guards your mind."
      },
      {
        "level": 11,
        "name": "Fey Reinforcements",
        "description": "You can summon fey beings to aid you."
      },
      {
        "level": 15,
        "name": "Misty Wanderer",
        "description": "You can slip in and out of the Feywild to move in a blink of an eye."
      }
    ]
  },
  {
    "id": "glamour",
    "parentClassId": "bard",
    "name": "College of Glamour",
    "description": "The College of Glamour is the home of bards who mastered their craft in the vibrant realm of the Feywild. These bards use their magic to delight and captivate others.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Mantle of Inspiration",
        "description": "You gain the ability to weave a song of fey magic that imbues your allies with vigor."
      },
      {
        "level": 3,
        "name": "Enthralling Performance",
        "description": "You can charge your performance with seductive fey magic."
      },
      {
        "level": 6,
        "name": "Mantle of Majesty",
        "description": "You gain the ability to cloak yourself in a fey magic that makes others want to serve you."
      },
      {
        "level": 14,
        "name": "Unbreakable Majesty",
        "description": "Your appearance permanently gains an otherworldly aspect that makes you look more lovely."
      }
    ]
  },
  {
    "id": "whispers",
    "parentClassId": "bard",
    "name": "College of Whispers",
    "description": "Most folk are happy to welcome a bard into their midst. Bards of the College of Whispers use this to their advantage. They appear to be like other bards, but they secretly excel at espionage and deception.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Psychic Blades",
        "description": "You gain the ability to make your weapon attacks magically toxic to a creature's mind."
      },
      {
        "level": 3,
        "name": "Words of Terror",
        "description": "You learn to infuse innocent-seeming words with an insidious magic."
      },
      {
        "level": 6,
        "name": "Mantle of Whispers",
        "description": "You gain the ability to adopt a humanoid's persona."
      },
      {
        "level": 14,
        "name": "Shadow Lore",
        "description": "You gain the ability to weave dark magic into your words."
      }
    ]
  },
  {
    "id": "shadow-magic",
    "parentClassId": "sorcerer",
    "name": "Shadow Magic",
    "description": "You are a creature of shadow, for your innate magic comes from the Shadowfell itself.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 1,
        "name": "Eyes of the Dark",
        "description": "You have darkvision with a range of 120 feet."
      },
      {
        "level": 1,
        "name": "Strength of the Grave",
        "description": "Your existence in a twilight state between life and death makes you difficult to defeat."
      },
      {
        "level": 6,
        "name": "Hound of Ill Omen",
        "description": "You gain the ability to call forth a howling creature of darkness."
      },
      {
        "level": 14,
        "name": "Shadow Walk",
        "description": "You gain the ability to step from one shadow into another."
      },
      {
        "level": 18,
        "name": "Umbral Form",
        "description": "You can spend 6 sorcery points as a bonus action to transform yourself into a shadowy form."
      }
    ]
  },
  {
    "id": "warrior-of-the-elements",
    "parentClassId": "monk",
    "name": "Warrior of the Elements",
    "description": "You follow a monastic tradition that teaches you to harness the elements. When you focus your ki, you can align yourself with the forces of creation.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "2024",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Elemental Attunement",
        "description": "You can expend Focus Points to imbue yourself with elemental energy, gaining Reach and dealing elemental damage."
      },
      {
        "level": 3,
        "name": "Manipulate Elements",
        "description": "You know the Elementalism spell."
      },
      {
        "level": 6,
        "name": "Elemental Burst",
        "description": "You can expend Focus Points to cause elemental energy to burst in a sphere."
      },
      {
        "level": 11,
        "name": "Stride of the Elements",
        "description": "While Elemental Attunement is active, you have a Fly Speed and Swim Speed."
      },
      {
        "level": 17,
        "name": "Elemental Epitome",
        "description": "You gain resistance to damage and destructive benefits while Elemental Attunement is active."
      }
    ]
  },
  {
    "id": "warrior-of-shadow",
    "parentClassId": "monk",
    "name": "Warrior of Shadow",
    "description": "Monks of the Warrior of Shadow follow a tradition that values stealth and subterfuge.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "2024",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Shadow Arts",
        "description": "You gain Darkness, Darkvision, and Shadowy Figments."
      },
      {
        "level": 6,
        "name": "Shadow Step",
        "description": "You can teleport between patches of darkness or dim light."
      },
      {
        "level": 11,
        "name": "Improved Shadow Step",
        "description": "You can suffer no restrictions on where you teleport for a cost."
      },
      {
        "level": 17,
        "name": "Cloak of Shadows",
        "description": "You can shroud yourself in shadows to become reduced to a partial incorporeal state."
      }
    ]
  },
  {
    "id": "warrior-of-mercy",
    "parentClassId": "monk",
    "name": "Warrior of Mercy",
    "description": "Monks of the Warrior of Mercy manipulate the life force of others to bring aid to those in need or an end to those who are suffering.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "2024",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Hand of Harm",
        "description": "You can use your Focus Points to deal extra necrotic damage."
      },
      {
        "level": 3,
        "name": "Hand of Healing",
        "description": "You can use your Focus Points to heal creatures."
      },
      {
        "level": 3,
        "name": "Implements of Mercy",
        "description": "You gain proficiency in Insight, Medicine, and the Herbalism Kit."
      },
      {
        "level": 6,
        "name": "Physician's Touch",
        "description": "Your healing and harm abilities improve to cure conditions or poison foes."
      },
      {
        "level": 11,
        "name": "Flurry of Healing and Harm",
        "description": "You can weave your healing and harming techniques into your Flurry of Blows."
      },
      {
        "level": 17,
        "name": "Hand of Ultimate Mercy",
        "description": "You can bring the dead back to life."
      }
    ]
  },
  {
    "id": "warrior-of-the-open-hand",
    "parentClassId": "monk",
    "name": "Warrior of the Open Hand",
    "description": "Monks of the Warrior of the Open Hand are the ultimate masters of martial arts combat.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "2024",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Open Hand Technique",
        "description": "You can manipulate your enemy's ki when you hit them with Flurry of Blows."
      },
      {
        "level": 6,
        "name": "Wholeness of Body",
        "description": "You can heal yourself as a bonus action."
      },
      {
        "level": 11,
        "name": "Fleet Step",
        "description": "You can use Step of the Wind immediately after another Bonus Action."
      },
      {
        "level": 17,
        "name": "Quivering Palm",
        "description": "You can set up lethal vibrations in a creature's body."
      }
    ]
  },
  {
    "id": "path-of-the-world-tree",
    "parentClassId": "barbarian",
    "name": "Path of the World Tree",
    "description": "Your Rage taps into the life force of the World Tree.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "2024",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Vitality of the Tree",
        "description": "Your Rage grants temporary hit points to you and allies."
      },
      {
        "level": 6,
        "name": "Branches of the Tree",
        "description": "You can use your reaction to teleport enemies."
      },
      {
        "level": 10,
        "name": "Battering Roots",
        "description": "Your reach increases and your weapons gain mastery properties."
      },
      {
        "level": 14,
        "name": "Travel along the Tree",
        "description": "You can teleport yourself and allies."
      }
    ]
  },
  {
    "id": "college-of-dance",
    "parentClassId": "bard",
    "name": "College of Dance",
    "description": "Bards of the College of Dance know that the world is a stage and that everyone is a dancer.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "2024",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Dazzling Footwork",
        "description": "You gain benefits while not wearing armor, including Agile Strikes and Unarmored Defense."
      },
      {
        "level": 6,
        "name": "Inspiring Movement",
        "description": "You can move allies when enemies approach."
      },
      {
        "level": 6,
        "name": "Tandem Footwork",
        "description": "You can boost your party's initiative."
      },
      {
        "level": 14,
        "name": "Leading Evasion",
        "description": "You can share Evasion with nearby allies."
      }
    ]
  },
  {
    "id": "circle-of-the-sea",
    "parentClassId": "druid",
    "name": "Circle of the Sea",
    "description": "Druids of the Circle of the Sea draw on the tempestuous power of the oceans.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "2024",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Circle of the Sea Spells",
        "description": "You always have certain spells prepared."
      },
      {
        "level": 3,
        "name": "Wrath of the Sea",
        "description": "You can manifest an aura of ocean spray that damages enemies."
      },
      {
        "level": 6,
        "name": "Aquatic Affinity",
        "description": "Your aura grows and you gain a swim speed."
      },
      {
        "level": 10,
        "name": "Stormborn",
        "description": "You gain a fly speed and resistances."
      },
      {
        "level": 14,
        "name": "Oceanic Gift",
        "description": "You can share your aura with a willing creature."
      }
    ]
  },
  {
    "id": "banneret",
    "parentClassId": "fighter",
    "name": "Banneret (Purple Dragon Knight)",
    "description": "A Banneret inspires greatness in others by committing deeds of glory on the battlefield, serving as a beacon for their allies.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Sword Coast Adventurer's Guide",
    "edition": "2024",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Rallying Cry",
        "description": "When you use your Second Wind feature, you can choose up to three creatures within 60 feet. They regain hit points equal to your fighter level."
      },
      {
        "level": 7,
        "name": "Royal Envoy",
        "description": "You gain proficiency in Persuasion. If you are already proficient, you gain double proficiency bonus."
      },
      {
        "level": 10,
        "name": "Inspiring Surge",
        "description": "When you use your Action Surge feature, you can choose one creature within 60 feet. That creature can make one melee or ranged weapon attack as a reaction."
      },
      {
        "level": 15,
        "name": "Bulwark",
        "description": "When you use Indomitable to reroll a saving throw, you can choose one ally within 60 feet who also failed the save against the same effect to reroll theirs."
      }
    ]
  },
  {
    "id": "psi-warrior",
    "parentClassId": "fighter",
    "name": "Psi Warrior",
    "description": "Psi Warriors harness the power of their mind to augment their physical prowess, infusing their weapons with psionic energy and moving objects with thought.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Tasha's Cauldron of Everything",
    "edition": "2024",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Psionic Power",
        "description": "You harbor a wellspring of psionic energy represented by Psionic Energy dice. You can use these dice to fuel various psionic powers like Protective Field, Psionic Strike, and Telekinetic Movement."
      },
      {
        "level": 7,
        "name": "Telekinetic Adept",
        "description": "You master new ways to use your telekinesis, gaining the Psi-Powered Leap and Telekinetic Thrust features."
      },
      {
        "level": 10,
        "name": "Guarded Mind",
        "description": "The psionic energy flowing through you bolsters your mind. You have resistance to psychic damage and if you start your turn charmed or frightened, you can end the effect."
      },
      {
        "level": 15,
        "name": "Bulwark of Force",
        "description": "You can shield yourself and others with telekinetic force, granting half cover to yourself and allies within 30 feet."
      },
      {
        "level": 18,
        "name": "Telekinetic Master",
        "description": "You can cast the Telekinesis spell. While concentrating on it, you can make a weapon attack as a bonus action."
      }
    ]
  },
  {
    "id": "tranquility",
    "parentClassId": "monk",
    "name": "Way of Tranquility",
    "description": "Monks who seek to end conflict through peace and diplomacy.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Unearthed Arcana",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Path of Tranquility",
        "description": "You can cast Sanctuary on yourself and have advantage on charisma checks to calm emotions."
      },
      {
        "level": 6,
        "name": "Healing Hands",
        "description": "You have a pool of healing power to restore hit points."
      },
      {
        "level": 11,
        "name": "Emissary of Peace",
        "description": "You gain +2 to Charisma checks and proficient in Peace."
      },
      {
        "level": 17,
        "name": "Anger of a Gentle Soul",
        "description": "You gain a massive damage boost against creatures that hurt your allies."
      }
    ]
  },
  {
    "id": "crown",
    "parentClassId": "paladin",
    "name": "Oath of the Crown",
    "description": "The Oath of the Crown is sworn to the ideals of civilization, be it the spirit of a nation, fealty to a sovereign, or service to a deity of law and ruling.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Sword Coast Adventurer's Guide",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Champion Challenge",
        "description": "You compel creatures to do battle with you."
      },
      {
        "level": 3,
        "name": "Turn the Tide",
        "description": "You can bolster injured creatures with your Channel Divinity."
      },
      {
        "level": 7,
        "name": "Divine Allegiance",
        "description": "You can use your reaction to take damage intended for another creature."
      },
      {
        "level": 15,
        "name": "Unyielding Saint",
        "description": "You have advantage on saving throws to avoid being paralyzed or stunned."
      },
      {
        "level": 20,
        "name": "Exalted Champion",
        "description": "You become an avatar of war, resistant to damage."
      }
    ]
  },
  {
    "id": "glory",
    "parentClassId": "paladin",
    "name": "Oath of Glory",
    "description": "Paladins who swear the Oath of Glory believe they and their companions are destined to achieve glory through deeds of heroism.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Tasha's Cauldron of Everything",
    "edition": "2024",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Peerless Athlete",
        "description": "You can use Channel Divinity to augment your athleticism."
      },
      {
        "level": 3,
        "name": "Inspiring Smite",
        "description": "You can distribute temporary hit points after a Divine Smite."
      },
      {
        "level": 7,
        "name": "Aura of Alacrity",
        "description": "You and your allies gain increased movement speed."
      },
      {
        "level": 15,
        "name": "Glorious Defense",
        "description": "You can turn a miss into a hit or grant AC to an ally."
      },
      {
        "level": 20,
        "name": "Living Legend",
        "description": "You can gain advantage on charisma checks and reroll saving throws."
      }
    ]
  },
  {
    "id": "redemption",
    "parentClassId": "paladin",
    "name": "Oath of Redemption",
    "description": "The Oath of Redemption sets a paladin on a difficult path, one that requires a holy warrior to use violence only as a last resort.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Xanathar's Guide to Everything",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Emissary of Peace",
        "description": "You gain a bonus to Persuasion checks."
      },
      {
        "level": 3,
        "name": "Rebuke the Violent",
        "description": "You can damage attackers who hurt your allies using Channel Divinity."
      },
      {
        "level": 7,
        "name": "Aura of the Guardian",
        "description": "You can take damage intended for your allies."
      },
      {
        "level": 15,
        "name": "Protective Spirit",
        "description": "You regain hit points at the end of your turn if you are below half health."
      },
      {
        "level": 20,
        "name": "Emissary of Redemption",
        "description": "You have resistance to all damage dealt by other creatures."
      }
    ]
  },
  {
    "id": "watchers",
    "parentClassId": "paladin",
    "name": "Oath of the Watchers",
    "description": "The Oath of the Watchers binds paladins to protect mortal realms from the predations of extraplanar creatures.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Tasha's Cauldron of Everything",
    "edition": "2024",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Watcher's Will",
        "description": "You can grant advantage on mental saving throws."
      },
      {
        "level": 3,
        "name": "Abjure the Extraplanar",
        "description": "You can turn elementals, fey, fiends, and aberrations."
      },
      {
        "level": 7,
        "name": "Aura of the Sentinel",
        "description": "You and your allies gain a bonus to initiative."
      },
      {
        "level": 15,
        "name": "Vigilant Rebuke",
        "description": "You can deal damage to creatures that succeed on saving throws against your allies."
      },
      {
        "level": 20,
        "name": "Mortal Bulwark",
        "description": "You gain truesight and advantage on attacks against extraplanar creatures."
      }
    ]
  },
  {
    "id": "oathbreaker",
    "parentClassId": "paladin",
    "name": "Oathbreaker",
    "description": "An Oathbreaker is a paladin who breaks their sacred oaths to pursue some dark ambition or serve an evil power.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Dungeon Master's Guide",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Control Undead",
        "description": "You can use Channel Divinity to control an undead creature."
      },
      {
        "level": 3,
        "name": "Dreadful Aspect",
        "description": "You can frighten nearby creatures."
      },
      {
        "level": 7,
        "name": "Aura of Hate",
        "description": "You and fiends/undead gain a bonus to melee damage rolls."
      },
      {
        "level": 15,
        "name": "Supernatural Resistance",
        "description": "You have resistance to bludgeoning, piercing, and slashing damage from nonmagical weapons."
      },
      {
        "level": 20,
        "name": "Dread Lord",
        "description": "You can surround yourself with an aura of gloom that damages foes."
      }
    ]
  },
  {
    "id": "circle-of-the-shepherd",
    "parentClassId": "druid",
    "name": "Circle of the Shepherd",
    "description": "Druids of the Circle of the Shepherd commune with the spirits of nature, especially the spirits of beasts and the fey, and call to those spirits for aid.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Xanathar's Guide to Everything",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 2,
        "name": "Speech of the Woods",
        "description": "You learn Sylvan and can speak with animals."
      },
      {
        "level": 2,
        "name": "Spirit Totem",
        "description": "You can call forth nature spirits to influence the world around you."
      },
      {
        "level": 6,
        "name": "Mighty Summoner",
        "description": "Beasts and fey that you conjure are more resilient."
      },
      {
        "level": 10,
        "name": "Guardian Spirit",
        "description": "Your Spirit Totem protects you and your allies."
      },
      {
        "level": 14,
        "name": "Faithful Summons",
        "description": "If you are incapacitated, nature spirits appear to protect you."
      }
    ]
  },
  {
    "id": "bladesinging",
    "parentClassId": "wizard",
    "name": "Bladesinging",
    "description": "Bladesingers master a tradition of wizardry that incorporates swordplay and dance.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Tasha's Cauldron of Everything",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 2,
        "name": "Training in War and Song",
        "description": "You gain proficiency with light armor, and you gain proficiency with one type of one-handed melee weapon."
      },
      {
        "level": 2,
        "name": "Bladesong",
        "description": "You can invoke a secret elven magic called the Bladesong, provided that you aren't wearing medium or heavy armor or using a shield."
      },
      {
        "level": 6,
        "name": "Extra Attack",
        "description": "You can attack twice, instead of once, whenever you take the Attack action on your turn."
      },
      {
        "level": 10,
        "name": "Song of Defense",
        "description": "You can direct your magic to absorb damage while your Bladesong is active."
      },
      {
        "level": 14,
        "name": "Song of Victory",
        "description": "You add your Intelligence modifier to the damage of your melee weapon attacks while your Bladesong is active."
      }
    ]
  },
  {
    "id": "rune-knight",
    "parentClassId": "fighter",
    "name": "Rune Knight",
    "description": "Rune Knights enhance their martial prowess using the supernatural power of runes, an ancient practice of giants.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Tasha's Cauldron of Everything",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Bonus Proficiencies",
        "description": "You gain proficiency with smith's tools, and you learn to speak, read, and write Giant."
      },
      {
        "level": 3,
        "name": "Rune Carver",
        "description": "You can use magic runes to enhance your gear."
      },
      {
        "level": 3,
        "name": "Giant's Might",
        "description": "You can imbue yourself with the might of giants."
      },
      {
        "level": 7,
        "name": "Runic Shield",
        "description": "You can force an attacker to reroll an attack roll against an ally."
      },
      {
        "level": 10,
        "name": "Great Stature",
        "description": "You grow in height and your Giant's Might damage increases."
      },
      {
        "level": 15,
        "name": "Master of Runes",
        "description": "You can invoke each rune you know twice, rather than once, before you finish a short or long rest."
      },
      {
        "level": 18,
        "name": "Runic Juggernaut",
        "description": "Your Giant's Might damage increases and your size can become Huge."
      }
    ]
  },
  {
    "id": "twilight-domain",
    "parentClassId": "cleric",
    "name": "Twilight Domain",
    "description": "The Twilight Domain governs the transition and blending of light into darkness. It is a time of rest and comfort, but also a threshold between safety and the unknown.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Tasha's Cauldron of Everything",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 1,
        "name": "Bonus Proficiencies",
        "description": "You gain proficiency with heavy armor and martial weapons."
      },
      {
        "level": 1,
        "name": "Eyes of Night",
        "description": "You can see through the deepest gloom. You have darkvision with no limit on its range."
      },
      {
        "level": 1,
        "name": "Vigilant Blessing",
        "description": "You can give a creature advantage on initiative rolls."
      },
      {
        "level": 2,
        "name": "Channel Divinity: Twilight Sanctuary",
        "description": "You can use your Channel Divinity to refresh your allies with soothing twilight."
      },
      {
        "level": 6,
        "name": "Steps of Night",
        "description": "You can draw on the mystical power of night to rise into the air."
      },
      {
        "level": 8,
        "name": "Divine Strike",
        "description": "You gain the ability to infuse your weapon strikes with radiant damage."
      },
      {
        "level": 17,
        "name": "Twilight Shroud",
        "description": "The twilight that you summon offers half cover to you and your allies."
      }
    ]
  },
  {
    "id": "soulknife",
    "parentClassId": "rogue",
    "name": "Soulknife",
    "description": "Soulknives strike with the speed of thought, infiltrating the minds of their enemies and cutting them down with psychic energy.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Tasha's Cauldron of Everything",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Psionic Power",
        "description": "You harbor a wellspring of psionic energy represented by Psionic Energy dice."
      },
      {
        "level": 3,
        "name": "Psychic Blades",
        "description": "You can manifest shimmering blades of psychic energy."
      },
      {
        "level": 9,
        "name": "Soul Blades",
        "description": "You can use your Psychic Blades to teleport or find your target."
      },
      {
        "level": 13,
        "name": "Psychic Veil",
        "description": "You can weave a veil of psychic static to mask yourself."
      },
      {
        "level": 17,
        "name": "Rend Mind",
        "description": "You can sweep your Psychic Blades through a creature's mind."
      }
    ]
  },
  {
    "id": "astral-self",
    "parentClassId": "monk",
    "name": "Way of the Astral Self",
    "description": "A monk of the Way of the Astral Self believes their body is an illusion. They see their ki as a representation of their true form: an astral self. This true form has the capacity to be a force of order or disorder, with some monasteries training students to use their power to protect the weak and others instructing aspirants in how to manifest their true selves in service to the mighty.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Tasha's Cauldron of Everything",
    "edition": "2024",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Arms of the Astral Self",
        "description": "As a bonus action, you can spend 1 ki point to summon the arms of your astral self. You can use your Wisdom modifier in place of your Strength modifier when making Strength checks and saving throws. You can use the spectral arms to make unarmed strikes."
      },
      {
        "level": 6,
        "name": "Visage of the Astral Self",
        "description": "You can summon the visage of your astral self. You gain advantage on Insight and Intimidation checks, and can see in magical and nonmagical darkness to a distance of 120 feet."
      },
      {
        "level": 11,
        "name": "Body of the Astral Self",
        "description": "You can summon the body of your astral self. You can deflect energy using your reaction to reduce acid, cold, fire, force, lightning, or thunder damage."
      },
      {
        "level": 17,
        "name": "Awakened Astral Self",
        "description": "Your connection to your astral self is complete, allowing you to unleash its full potential. You gain +2 AC while your astral self is present, and you can make extra attacks."
      }
    ]
  },
  {
    "id": "chronurgy",
    "parentClassId": "wizard",
    "name": "Chronurgy Magic",
    "description": "Focusing on the manipulation of time, those who follow the Chronurgy tradition learn to alter the pace of reality to their liking. Using the rampaging energy of time, they can step around instantaneous effects, or momentarily halt the flow of time for others.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Explorer's Guide to Wildemount",
    "edition": "2024",
    "version": 1,
    "features": [
      {
        "level": 2,
        "name": "Chronal Shift",
        "description": "You can magically exert limited control over the flow of time around a creature. As a reaction, you can force a creature to reroll an attack roll, ability check, or saving throw."
      },
      {
        "level": 2,
        "name": "Temporal Awareness",
        "description": "You can add your Intelligence modifier to your initiative rolls."
      },
      {
        "level": 6,
        "name": "Momentary Stasis",
        "description": "As an action, you can magically force a Large or smaller creature to make a Constitution saving throw. On a failure, the creature is incapacitated and has a speed of 0 until the end of your next turn."
      },
      {
        "level": 10,
        "name": "Arcane Abeyance",
        "description": "When you cast a spell using a spell slot of 4th level or lower, you can condense the spell's magic into a mote. The spell is frozen in time at the moment of casting and held within a gray bead for 1 hour."
      },
      {
        "level": 14,
        "name": "Convergent Future",
        "description": "You can peer through possible futures and magically pull one of them into events around you, ensuring a particular outcome. You can use your reaction to ignore a die roll and decide whether the number rolled is the minimum needed to succeed or one less than that number."
      }
    ]
  },
  {
    "id": "phantom",
    "parentClassId": "rogue",
    "name": "Phantom",
    "description": "Many rogues walk a fine line between life and death, but a Phantom walks that line daily. When taking a life, a Phantom can capture a sliver of the soul to fuel their magic, becoming like a ghost themselves.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Tasha's Cauldron of Everything",
    "edition": "2024",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Whispers of the Dead",
        "description": "Echoes of those who have died cling to you. Whenever you finish a short or long rest, you can choose one skill or tool proficiency that you lack and gain it until you choose another."
      },
      {
        "level": 3,
        "name": "Wails from the Grave",
        "description": "As you nudge someone closer to the grave, you can channel the power of death to harm someone else as well. Immediately after you deal Sneak Attack damage to a creature on your turn, you can target a second creature that you can see to take necrotic damage equal to half your Sneak Attack dice."
      },
      {
        "level": 9,
        "name": "Tokens of the Departed",
        "description": "When a life ends in your presence, you're able to snatch a token from the departing soul, a sliver of its life essence that takes physical form."
      },
      {
        "level": 13,
        "name": "Ghost Walk",
        "description": "You can phase partially into the realm of the dead, becoming like a ghost. As a bonus action, you assume a spectral form."
      },
      {
        "level": 17,
        "name": "Death's Friend",
        "description": "Your association with death has become so close that you gain special benefits, including increased Wails from the Grave damage."
      }
    ]
  },
  {
    "id": "divine-soul",
    "parentClassId": "sorcerer",
    "name": "Divine Soul",
    "description": "Sometimes the spark of magic that fuels a sorcerer comes from a divine source that glimmers within the soul. Having such a blessed soul is a sign that your innate magic might come from a distant but powerful familial connection to a divine being.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Xanathar's Guide to Everything",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 1,
        "name": "Divine Magic",
        "description": "Your link to the divine allows you to learn spells from the cleric class. When your Spellcasting feature lets you learn or replace a sorcerer cantrip or a sorcerer spell of 1st level or higher, you can choose the new spell from the cleric spell list or the sorcerer spell list."
      },
      {
        "level": 1,
        "name": "Favored by the Gods",
        "description": "If you fail a saving throw or miss with an attack roll, you can use each die to add 2d4 to the total, possibly changing the outcome."
      },
      {
        "level": 6,
        "name": "Empowered Healing",
        "description": "Whenever you or an ally within 5 feet of you rolls dice to determine the number of hit points a spell restores, you can spend 1 sorcery point to reroll any number of those dice once."
      },
      {
        "level": 14,
        "name": "Otherworldly Wings",
        "description": "You can use a bonus action to manifest a pair of spectral wings from your back. While the wings are present, you have a flying speed of 30 feet."
      },
      {
        "level": 18,
        "name": "Unearthly Recovery",
        "description": "You gain the ability to overcome grievous injuries. As a bonus action when you have fewer than half of your hit points remaining, you can regain a number of hit points equal to half your hit point maximum."
      }
    ]
  },
  {
    "id": "college-of-lore",
    "parentClassId": "bard",
    "name": "College of Lore",
    "description": "Bards of the College of Lore know something about most things, collecting bits of knowledge.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Bonus Proficiencies",
        "description": "Gain 3 skill proficiencies."
      },
      {
        "level": 3,
        "name": "Cutting Words",
        "description": "Use Bardic Inspiration to reduce enemy rolls."
      },
      {
        "level": 6,
        "name": "Additional Magical Secrets",
        "description": "Learn 2 spells from any class."
      }
    ]
  },
  {
    "id": "college-of-valor",
    "parentClassId": "bard",
    "name": "College of Valor",
    "description": "Bards of the College of Valor are daring skalds whose tales keep alive the memory of great heroes.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Bonus Proficiencies",
        "description": "Gain armor and weapon proficiencies."
      },
      {
        "level": 3,
        "name": "Combat Inspiration",
        "description": "Bardic Inspiration can be used for damage or AC."
      },
      {
        "level": 6,
        "name": "Extra Attack",
        "description": "Attack twice per action."
      }
    ]
  },
  {
    "id": "circle-of-the-land",
    "parentClassId": "druid",
    "name": "Circle of the Land",
    "description": "The Circle of the Land is made up of mystics and sages who safeguard ancient knowledge.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 2,
        "name": "Bonus Cantrip",
        "description": "Learn one additional druid cantrip."
      },
      {
        "level": 2,
        "name": "Natural Recovery",
        "description": "Recover spell slots during short rest."
      },
      {
        "level": 3,
        "name": "Circle Spells",
        "description": "Gain additional spells based on terrain."
      }
    ]
  },
  {
    "id": "circle-of-the-moon",
    "parentClassId": "druid",
    "name": "Circle of the Moon",
    "description": "Druids of the Circle of the Moon are fierce guardians of the wilds.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 2,
        "name": "Combat Wild Shape",
        "description": "Use Wild Shape as a bonus action and transform into higher CR beasts."
      },
      {
        "level": 2,
        "name": "Circle Forms",
        "description": "Access more powerful beast forms."
      },
      {
        "level": 6,
        "name": "Primal Strike",
        "description": "Attacks count as magical in beast form."
      }
    ]
  },
  {
    "id": "way-of-the-open-hand",
    "parentClassId": "monk",
    "name": "Way of the Open Hand",
    "description": "Monks of the Way of the Open Hand are the ultimate masters of martial arts combat.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Open Hand Technique",
        "description": "Add special effects to Flurry of Blows."
      },
      {
        "level": 6,
        "name": "Wholeness of Body",
        "description": "Heal yourself as an action."
      },
      {
        "level": 11,
        "name": "Tranquility",
        "description": "Cast Sanctuary on yourself."
      }
    ]
  },
  {
    "id": "way-of-shadow",
    "parentClassId": "monk",
    "name": "Way of Shadow",
    "description": "Monks of the Way of Shadow follow a tradition that values stealth and subterfuge. These monks might be called ninjas or shadowdancers, and they serve as spies and assassins.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "magicType": "Stealth Spells using Ki",
    "magicAbility": "Wisdom",
    "magicDescription": "At Level 3, you can spend 2 Ki points to cast stealth-themed spells: Darkness, Darkvision, Pass Without Trace, or Silence. You also get the Minor Illusion cantrip for free.",
    "features": [
      {
        "level": 3,
        "name": "Shadow Arts",
        "description": "Cast certain spells using Ki."
      },
      {
        "level": 6,
        "name": "Shadow Step",
        "description": "Teleport between shadows."
      },
      {
        "level": 11,
        "name": "Cloak of Shadows",
        "description": "Become invisible in dim light."
      }
    ]
  },
  {
    "id": "oath-of-devotion",
    "parentClassId": "paladin",
    "name": "Oath of Devotion",
    "description": "The Oath of Devotion binds a paladin to the loftiest ideals of justice, virtue, and order.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Sacred Weapon",
        "description": "Empower your weapon with radiant energy."
      },
      {
        "level": 3,
        "name": "Turn the Unholy",
        "description": "Turn fiends and undead."
      },
      {
        "level": 7,
        "name": "Aura of Devotion",
        "description": "You and allies can't be charmed."
      }
    ]
  },
  {
    "id": "oath-of-the-ancients",
    "parentClassId": "paladin",
    "name": "Oath of the Ancients",
    "description": "The Oath of the Ancients is as old as the race of elves and the rituals of druids.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Nature's Wrath",
        "description": "Restrain enemies with spectral vines."
      },
      {
        "level": 3,
        "name": "Turn the Faithless",
        "description": "Turn fey and fiends."
      },
      {
        "level": 7,
        "name": "Aura of Warding",
        "description": "Resistance to spell damage for you and allies."
      }
    ]
  },
  {
    "id": "oath-of-vengeance",
    "parentClassId": "paladin",
    "name": "Oath of Vengeance",
    "description": "The Oath of Vengeance is a solemn commitment to punish those who have committed grievous sins.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Abjure Enemy",
        "description": "Frighten and slow a creature."
      },
      {
        "level": 3,
        "name": "Vow of Enmity",
        "description": "Gain advantage on attacks against one enemy."
      },
      {
        "level": 7,
        "name": "Relentless Avenger",
        "description": "Move toward fleeing enemies."
      }
    ]
  },
  {
    "id": "the-great-old-one",
    "parentClassId": "warlock",
    "name": "The Great Old One",
    "description": "Your patron is a mysterious entity whose nature is utterly foreign to the fabric of reality.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 1,
        "name": "Awakened Mind",
        "description": "Telepathically communicate with creatures."
      },
      {
        "level": 6,
        "name": "Entropic Ward",
        "description": "Impose disadvantage on attacks and gain advantage on your next attack."
      },
      {
        "level": 10,
        "name": "Thought Shield",
        "description": "Resistance to psychic damage and reflect damage."
      }
    ]
  },
  {
    "id": "school-of-evocation",
    "parentClassId": "wizard",
    "name": "School of Evocation",
    "description": "You focus your study on magic that creates powerful elemental effects.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 2,
        "name": "Evocation Savant",
        "description": "Evocation spells cost half gold and time to copy."
      },
      {
        "level": 2,
        "name": "Sculpt Spells",
        "description": "Protect allies from your area spells."
      },
      {
        "level": 6,
        "name": "Potent Cantrip",
        "description": "Cantrips deal half damage on saves."
      }
    ]
  },
  {
    "id": "school-of-abjuration",
    "parentClassId": "wizard",
    "name": "School of Abjuration",
    "description": "You focus your study on magic that blocks, banishes, or protects.",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "features": [
      {
        "level": 2,
        "name": "Abjuration Savant",
        "description": "Abjuration spells cost half gold and time to copy."
      },
      {
        "level": 2,
        "name": "Arcane Ward",
        "description": "Create a magical ward that absorbs damage."
      },
      {
        "level": 6,
        "name": "Projected Ward",
        "description": "Use your ward to protect others."
      }
    ]
  },
  {
    "id": "armorer",
    "parentClassId": "artificer",
    "name": "Armorer",
    "description": "An Armorer specializes in using magic to create a suit of powerful armor.",
    "source": "Official",
    "edition": "2024",
    "version": 1,
    "features": [
      {
        "level": 3,
        "name": "Tools of the Trade",
        "description": "Gain proficiency with smith's tools."
      },
      {
        "level": 3,
        "name": "Armorer Spells",
        "description": "Gain additional spells."
      },
      {
        "level": 3,
        "name": "Arcane Armor",
        "description": "Transform a suit of armor into magical armor."
      }
    ]
  },


  // --- BLOOD MAGE SUBCLASSES ---
  {
    id: "haemomancer",
    parentClassId: "blood-mage",
    name: "Haemomancer",
    description: "Haemomancers focus on the raw manipulation of blood.",
    imageUrl: "https://placehold.co/600x400",
    source: "Haigo Dungeoncrafts",
    edition: "5e",
    version: 1,
    features: [
      {
        level: 2,
        name: "Blood Manipulation",
        description: "You gain the ability to shape and control blood."
      }
    ]
  },
  {
    id: "sacrificial-preserver",
    parentClassId: "blood-mage",
    name: "Sacrificial Preserver",
    description: "Preservers focus on using blood magic to protect and heal.",
    imageUrl: "https://placehold.co/600x400",
    source: "Haigo Dungeoncrafts",
    edition: "5e",
    version: 1,
    features: [
      {
        level: 2,
        name: "Vitality Transference",
        description: "You can transfer your own vitality to others."
      }
    ]
  },
  {
    id: "sanguine-supplementer",
    parentClassId: "blood-mage",
    name: "Sanguine Supplementer",
    description: "Supplementers use blood to enhance their physical capabilities.",
    imageUrl: "https://placehold.co/600x400",
    source: "Haigo Dungeoncrafts",
    edition: "5e",
    version: 1,
    features: [
      {
        level: 2,
        name: "Crimson Might",
        description: "You can use your blood to fuel your physical strength."
      }
    ]
  },

  // --- ILLRIGGER SUBCLASSES ---
  {
    id: "painkiller-dispater",
    parentClassId: "illrigger",
    name: "Painkiller (Dispater)",
    description: "Illriggers sworn to Dispater, the Iron Duke. They are heavily armored shock troopers.",
    imageUrl: "https://placehold.co/600x400",
    source: "MCDM Productions",
    edition: "5e",
    version: 1,
    features: [
      {
        level: 3,
        name: "Invoke Authority",
        description: "You can use your reaction to command an ally to attack."
      }
    ]
  },
  {
    id: "shadowmaster-moloch",
    parentClassId: "illrigger",
    name: "Shadowmaster (Moloch)",
    description: "Illriggers sworn to Moloch. They are stealthy assassins.",
    imageUrl: "https://placehold.co/600x400",
    source: "MCDM Productions",
    edition: "5e",
    version: 1,
    features: [
      {
        level: 3,
        name: "Shadow Form",
        description: "You can become invisible in dim light or darkness."
      }
    ]
  },
  {
    id: "architect-of-ruin-asmodeus",
    parentClassId: "illrigger",
    name: "Architect of Ruin (Asmodeus)",
    description: "Illriggers sworn to Asmodeus. They are master spellcasters.",
    imageUrl: "https://placehold.co/600x400",
    source: "MCDM Productions",
    edition: "5e",
    version: 1,
    features: [
      {
        level: 3,
        name: "Spellcasting",
        description: "You gain the ability to cast spells."
      }
    ]
  },

  // --- MARTYR SUBCLASSES ---
  {
    id: "burden-of-atonement",
    parentClassId: "martyr",
    name: "Burden of Atonement",
    description: "You seek to make up for a past sin.",
    imageUrl: "https://placehold.co/600x400",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "burden-of-discord",
    parentClassId: "martyr",
    name: "Burden of Discord",
    description: "You are destined to bring chaos and strife.",
    imageUrl: "https://placehold.co/600x400",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "burden-of-mercy",
    parentClassId: "martyr",
    name: "Burden of Mercy",
    description: "You suffer so that others may live.",
    imageUrl: "https://placehold.co/600x400",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "burden-of-revolution",
    parentClassId: "martyr",
    name: "Burden of Revolution",
    description: "You will die overturning the established order.",
    imageUrl: "https://placehold.co/600x400",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "burden-of-truth",
    parentClassId: "martyr",
    name: "Burden of Truth",
    description: "You are fated to reveal a terrible truth.",
    imageUrl: "https://placehold.co/600x400",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "burden-of-tyranny",
    parentClassId: "martyr",
    name: "Burden of Tyranny",
    description: "You are destined to rule with an iron fist.",
    imageUrl: "https://placehold.co/600x400",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },

  // --- NECROMANCER SUBCLASSES ---
  {
    id: "blood-ascendant",
    parentClassId: "necromancer",
    name: "Blood Ascendant",
    description: "You use blood magic to fuel your necromancy.",
    imageUrl: "https://placehold.co/600x400",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "death-knight",
    parentClassId: "necromancer",
    name: "Death Knight",
    description: "You combine martial prowess with necromantic power.",
    imageUrl: "https://placehold.co/600x400",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "overlord",
    parentClassId: "necromancer",
    name: "Overlord",
    description: "You focus on controlling powerful undead.",
    imageUrl: "https://placehold.co/600x400",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "pale-master",
    parentClassId: "necromancer",
    name: "Pale Master",
    description: "You have embraced the undead state yourself.",
    imageUrl: "https://placehold.co/600x400",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "pharaoh",
    parentClassId: "necromancer",
    name: "Pharaoh",
    description: "You draw power from ancient desert rituals.",
    imageUrl: "https://placehold.co/600x400",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "plague-lord",
    parentClassId: "necromancer",
    name: "Plague Lord",
    description: "You specialize in disease and decay.",
    imageUrl: "https://placehold.co/600x400",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "reanimator",
    parentClassId: "necromancer",
    name: "Reanimator",
    description: "You are a scientist of death, stitching together new life.",
    imageUrl: "https://placehold.co/600x400",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "reaper",
    parentClassId: "necromancer",
    name: "Reaper",
    description: "You are an agent of death itself.",
    imageUrl: "https://placehold.co/600x400",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },

  // --- WARMAGE SUBCLASSES ---
  {
    id: "house-of-bishops",
    parentClassId: "warmage",
    name: "House of Bishops",
    description: "Tacticians who control the battlefield.",
    imageUrl: "https://placehold.co/600x400",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "house-of-cards",
    parentClassId: "warmage",
    name: "House of Cards",
    description: "Gamblers who manipulate luck.",
    imageUrl: "https://placehold.co/600x400",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "house-of-dice",
    parentClassId: "warmage",
    name: "House of Dice",
    description: "Masters of chaos and randomness.",
    imageUrl: "https://placehold.co/600x400",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "house-of-kings",
    parentClassId: "warmage",
    name: "House of Kings",
    description: "Leaders who inspire their allies.",
    imageUrl: "https://placehold.co/600x400",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "house-of-knights",
    parentClassId: "warmage",
    name: "House of Knights",
    description: "Warrior-mages who fight on the front lines.",
    imageUrl: "https://placehold.co/600x400",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "house-of-lancers",
    parentClassId: "warmage",
    name: "House of Lancers",
    description: "Skirmishers who strike hard and fast.",
    imageUrl: "https://placehold.co/600x400",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "house-of-rooks",
    parentClassId: "warmage",
    name: "House of Rooks",
    description: "Spies and assassins who strike from the shadows.",
    imageUrl: "https://placehold.co/600x400",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },

  // --- WITCH SUBCLASSES ---
  {
    id: "black-magic",
    parentClassId: "witch",
    name: "Black Magic",
    description: "Magic of death, shadows, and curses.",
    imageUrl: "https://placehold.co/600x400",
    source: "Kobold Press / Mage Hand Press",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "blood-magic",
    parentClassId: "witch",
    name: "Blood Magic",
    description: "Magic fueled by life essence.",
    imageUrl: "https://placehold.co/600x400",
    source: "Kobold Press / Mage Hand Press",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "green-magic",
    parentClassId: "witch",
    name: "Green Magic",
    description: "Magic of nature, plants, and beasts.",
    imageUrl: "https://placehold.co/600x400",
    source: "Kobold Press / Mage Hand Press",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "purple-magic",
    parentClassId: "witch",
    name: "Purple Magic",
    description: "Magic of illusions, dreams, and the mind.",
    imageUrl: "https://placehold.co/600x400",
    source: "Kobold Press / Mage Hand Press",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "red-magic",
    parentClassId: "witch",
    name: "Red Magic",
    description: "Magic of fire, destruction, and chaos.",
    imageUrl: "https://placehold.co/600x400",
    source: "Kobold Press / Mage Hand Press",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "steel-magic",
    parentClassId: "witch",
    name: "Steel Magic",
    description: "Magic of metal, weapons, and war.",
    imageUrl: "https://placehold.co/600x400",
    source: "Kobold Press / Mage Hand Press",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "white-magic",
    parentClassId: "witch",
    name: "White Magic",
    description: "Magic of healing, protection, and light.",
    imageUrl: "https://placehold.co/600x400",
    source: "Kobold Press / Mage Hand Press",
    edition: "5e",
    version: 1,
    features: []
  },

  // --- APOTHECARY SUBCLASSES ---
  {
    id: "alienist",
    parentClassId: "apothecary",
    name: "Alienist",
    description: "You study the Far Realm and aberrant biology.",
    imageUrl: "https://placehold.co/600x400",
    source: "Sebastian Crowe's Guide to Drakkenheim",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "chemist",
    parentClassId: "apothecary",
    name: "Chemist",
    description: "You specialize in volatile chemical reactions.",
    imageUrl: "https://placehold.co/600x400",
    source: "Sebastian Crowe's Guide to Drakkenheim",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "exorcist",
    parentClassId: "apothecary",
    name: "Exorcist",
    description: "You study the undead and how to destroy them.",
    imageUrl: "https://placehold.co/600x400",
    source: "Sebastian Crowe's Guide to Drakkenheim",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "mutagenist",
    parentClassId: "apothecary",
    name: "Mutagenist",
    description: "You transform your own body with mutagens.",
    imageUrl: "https://placehold.co/600x400",
    source: "Sebastian Crowe's Guide to Drakkenheim",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "pathogenist",
    parentClassId: "apothecary",
    name: "Pathogenist",
    description: "You wield disease as a weapon.",
    imageUrl: "https://placehold.co/600x400",
    source: "Sebastian Crowe's Guide to Drakkenheim",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "reanimator",
    parentClassId: "apothecary",
    name: "Reanimator",
    description: "You stitch together dead flesh to create life.",
    imageUrl: "https://placehold.co/600x400",
    source: "Sebastian Crowe's Guide to Drakkenheim",
    edition: "5e",
    version: 1,
    features: []
  },
  // --- ACCURSED SUBCLASSES ---
  {
    id: "curse-of-animation",
    parentClassId: "accursed",
    name: "Curse of Animation",
    description: "Your curse brings objects to life around you.",
    source: "The Ultimate Adventurer's Handbook",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "curse-of-the-armament",
    parentClassId: "accursed",
    name: "Curse of the Armament",
    description: "You are cursed to be a living weapon.",
    source: "The Ultimate Adventurer's Handbook",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "curse-of-lycanthropy",
    parentClassId: "accursed",
    name: "Curse of Lycanthropy",
    description: "You struggle against the beast within.",
    source: "The Ultimate Adventurer's Handbook",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "curse-of-the-fiend",
    parentClassId: "accursed",
    name: "Curse of the Fiend",
    description: "A fiendish entity has laid claim to your soul.",
    source: "The Ultimate Adventurer's Handbook",
    edition: "5e",
    version: 1,
    features: []
  },

  // --- ALCHEMIST SUBCLASSES ---
  {
    id: "amorist",
    parentClassId: "alchemist",
    name: "Amorist",
    description: "You specialize in charm and enchantment potions.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "alchemist-apothecary",
    parentClassId: "alchemist",
    name: "Apothecary",
    description: "You are a master of healing and restoration.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "dynamo-engineer",
    parentClassId: "alchemist",
    name: "Dynamo Engineer",
    description: "You harness electricity and energy.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "mad-bomber",
    parentClassId: "alchemist",
    name: "Mad Bomber",
    description: "You are obsessed with explosions.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "alchemist-mutagenist",
    parentClassId: "alchemist",
    name: "Mutagenist",
    description: "You alter your body with experimental concoctions.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "ooze-rancher",
    parentClassId: "alchemist",
    name: "Ooze Rancher",
    description: "You breed and control oozes.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "venomsmith",
    parentClassId: "alchemist",
    name: "Venomsmith",
    description: "You are a master of poisons.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "xenoalchemist",
    parentClassId: "alchemist",
    name: "Xenoalchemist",
    description: "You graft monster parts onto yourself or others.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },

  // --- BEASTHEART SUBCLASSES ---
  {
    id: "ferocious-bond",
    parentClassId: "beastheart",
    name: "Ferocious Bond",
    description: "You and your companion share a bond of fury.",
    source: "MCDM Productions",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "hunter-bond",
    parentClassId: "beastheart",
    name: "Hunter Bond",
    description: "You cooperate to track and bring down prey.",
    source: "MCDM Productions",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "infernal-bond",
    parentClassId: "beastheart",
    name: "Infernal Bond",
    description: "Your companion has a touch of fiendish power.",
    source: "MCDM Productions",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "primordial-bond",
    parentClassId: "beastheart",
    name: "Primordial Bond",
    description: "Your companion is connected to elemental forces.",
    source: "MCDM Productions",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "protector-bond",
    parentClassId: "beastheart",
    name: "Protector Bond",
    description: "You fight to defend each other and your allies.",
    source: "MCDM Productions",
    edition: "5e",
    version: 1,
    features: []
  },

  // --- CAPTAIN SUBCLASSES ---
  {
    id: "dragon-banner",
    parentClassId: "captain",
    name: "Dragon Banner",
    description: "You inspire fear and awe in your enemies.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "eagle-banner",
    parentClassId: "captain",
    name: "Eagle Banner",
    description: "You lead with speed and precision.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "lion-banner",
    parentClassId: "captain",
    name: "Lion Banner",
    description: "You are a beacon of courage.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "ram-banner",
    parentClassId: "captain",
    name: "Ram Banner",
    description: "You break through enemy lines.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "raven-banner",
    parentClassId: "captain",
    name: "Raven Banner",
    description: "You use tactics and manipulation.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "turtle-banner",
    parentClassId: "captain",
    name: "Turtle Banner",
    description: "You prioritize defense and protection.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },

  // --- CRAFTSMAN SUBCLASSES ---
  {
    id: "armigers-guild",
    parentClassId: "craftsman",
    name: "Armigers' Guild",
    description: "Specialists in armor smithing.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "bladeworkers-guild",
    parentClassId: "craftsman",
    name: "Bladeworkers' Guild",
    description: "Masters of creating bladed weapons.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "calibarons-guild",
    parentClassId: "craftsman",
    name: "Calibarons' Guild",
    description: "Experts in firearms and ballistics.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "forgeknights-guild",
    parentClassId: "craftsman",
    name: "Forgeknights' Guild",
    description: "Crafters who fight on the front lines.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "mechanauts-guild",
    parentClassId: "craftsman",
    name: "Mechanauts' Guild",
    description: "Inventors of mechanical marvels.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "thunderlords-guild",
    parentClassId: "craftsman",
    name: "Thunderlords' Guild",
    description: "Harnessers of elemental power.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "trappers-guild",
    parentClassId: "craftsman",
    name: "Trappers' Guild",
    description: "Experts in traps and mechanisms.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },

  // --- GUNSLINGER SUBCLASSES ---
  {
    id: "gun-tank",
    parentClassId: "gunslinger",
    name: "Gun Tank",
    description: "A heavily armored gunner.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "gun-ko-master",
    parentClassId: "gunslinger",
    name: "Gun-Ko Master",
    description: "You combine firearms with martial arts.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "high-roller",
    parentClassId: "gunslinger",
    name: "High Roller",
    description: "You rely on luck and gambling in combat.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "musketeer",
    parentClassId: "gunslinger",
    name: "Musketeer",
    description: "A disciplined soldier with a firearm.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "pistolero",
    parentClassId: "gunslinger",
    name: "Pistolero",
    description: "A master of speed and dual-wielding pistols.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "sharpshooter",
    parentClassId: "gunslinger",
    name: "Sharpshooter",
    description: "You specialize in long-range precision.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "spellslinger",
    parentClassId: "gunslinger",
    name: "Spellslinger",
    description: "You infuse your shots with magic.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },

  // --- INVESTIGATOR SUBCLASSES ---
  {
    id: "antiquarian",
    parentClassId: "investigator",
    name: "Antiquarian",
    description: "You use ancient artifacts to fight evil.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "archivist",
    parentClassId: "investigator",
    name: "Archivist",
    description: "You maintain a collection of forbidden knowledge.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "detective",
    parentClassId: "investigator",
    name: "Detective",
    description: "You are a master of deduction.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "exterminator",
    parentClassId: "investigator",
    name: "Exterminator",
    description: "You specialize in purging vermin and monsters.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "inquisitor",
    parentClassId: "investigator",
    name: "Inquisitor",
    description: "You root out heresy and corruption.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "medium",
    parentClassId: "investigator",
    name: "Medium",
    description: "You commune with spirits to solve crimes.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "occultist",
    parentClassId: "investigator",
    name: "Occultist",
    description: "You dabble in the dark arts to fight them.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "spy",
    parentClassId: "investigator",
    name: "Spy",
    description: "You operate undercover to gather intelligence.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },

  // --- PUGILIST SUBCLASSES ---
  {
    id: "arena-royale",
    parentClassId: "pugilist",
    name: "Arena Royale",
    description: "You are a gladiator and performer.",
    source: "Sterling Vermin Adventuring Co.",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "bloodhound-bruisers",
    parentClassId: "pugilist",
    name: "Bloodhound Bruisers",
    description: "You are a bounty hunter and street fighter.",
    source: "Sterling Vermin Adventuring Co.",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "dog-and-hound",
    parentClassId: "pugilist",
    name: "Dog & Hound",
    description: "You fight alongside a loyal canine companion.",
    source: "Sterling Vermin Adventuring Co.",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "piss-and-vinegar",
    parentClassId: "pugilist",
    name: "Piss & Vinegar",
    description: "You fight with dirty tactics and insults.",
    source: "Sterling Vermin Adventuring Co.",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "squared-circle",
    parentClassId: "pugilist",
    name: "Squared Circle",
    description: "You are a grappler and wrestler.",
    source: "Sterling Vermin Adventuring Co.",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "sweet-science",
    parentClassId: "pugilist",
    name: "Sweet Science",
    description: "You are a tactical boxer.",
    source: "Sterling Vermin Adventuring Co.",
    edition: "5e",
    version: 1,
    features: []
  },

  // --- WARDEN SUBCLASSES ---
  {
    id: "bloodwrath-guardian",
    parentClassId: "warden",
    name: "Bloodwrath Guardian",
    description: "You channel rage to protect your charge.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "grey-watchman",
    parentClassId: "warden",
    name: "Grey Watchman",
    description: "You are a vigilant sentry.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "nightgaunt",
    parentClassId: "warden",
    name: "Nightgaunt",
    description: "You use fear and darkness as weapons.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "soulblood-shaman",
    parentClassId: "warden",
    name: "Soulblood Shaman",
    description: "You call upon spirits for aid.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "stoneheart-defender",
    parentClassId: "warden",
    name: "Stoneheart Defender",
    description: "You align yourself with the endurance of stone.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "storm-sentinel",
    parentClassId: "warden",
    name: "Storm Sentinel",
    description: "You wield the power of storms.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "verdant-protector",
    parentClassId: "warden",
    name: "Verdant Protector",
    description: "You are a guardian of nature.",
    source: "Valda's Spire of Secrets",
    edition: "5e",
    version: 1,
    features: []
  },

  // --- ACOLYTE SUBCLASSES ---
  {
    id: "acolyte-of-togashi",
    parentClassId: "acolyte",
    name: "Acolyte of Togashi",
    description: "Followers of the Dragon Kami, seeking enlightenment.",
    source: "Adventures in Rokugan",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "acolyte-of-shadows",
    parentClassId: "acolyte",
    name: "Acolyte of Shadows",
    description: "Those who serve furtive and mysterious causes.",
    source: "Adventures in Rokugan",
    edition: "5e",
    version: 1,
    features: []
  },

  // --- ADEPT SUBCLASSES ---
  {
    id: "animota",
    parentClassId: "adept",
    name: "Animota",
    description: "Adepts who focus on channeling energy into objects.",
    source: "Esper Genesis Core Manual",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "battlemind",
    parentClassId: "adept",
    name: "Battlemind",
    description: "Psionic warriors who dominate the battlefield.",
    source: "Esper Genesis Core Manual",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "dreamshaper",
    parentClassId: "adept",
    name: "Dreamshaper",
    description: "Adepts who manipulate the fabric of reality and dreams.",
    source: "Esper Genesis Core Manual",
    edition: "5e",
    version: 1,
    features: []
  },
  {
    id: "berserker",
    parentClassId: "barbarian",
    name: "Berserker",
    description: "A specialized archetype for the Official Barbarian.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Berserker Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "wild-heart",
    parentClassId: "barbarian",
    name: "Wild Heart",
    description: "A specialized archetype for the Official Barbarian.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Wild Heart Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "path-of-the-world-tree",
    parentClassId: "barbarian",
    name: "Path Of The World Tree",
    description: "A specialized archetype for the Official Barbarian.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Path Of The World Tree Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "zealot",
    parentClassId: "barbarian",
    name: "Zealot",
    description: "A specialized archetype for the Official Barbarian.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Zealot Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "college-of-dance",
    parentClassId: "bard",
    name: "College Of Dance",
    description: "A specialized archetype for the Official Bard.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "College Of Dance Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "glamour",
    parentClassId: "bard",
    name: "Glamour",
    description: "A specialized archetype for the Official Bard.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Glamour Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "lore",
    parentClassId: "bard",
    name: "Lore",
    description: "A specialized archetype for the Official Bard.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Lore Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "valor",
    parentClassId: "bard",
    name: "Valor",
    description: "A specialized archetype for the Official Bard.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Valor Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "life",
    parentClassId: "cleric",
    name: "Life",
    description: "A specialized archetype for the Official Cleric.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Life Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "light",
    parentClassId: "cleric",
    name: "Light",
    description: "A specialized archetype for the Official Cleric.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Light Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "trickery",
    parentClassId: "cleric",
    name: "Trickery",
    description: "A specialized archetype for the Official Cleric.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Trickery Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "war",
    parentClassId: "cleric",
    name: "War",
    description: "A specialized archetype for the Official Cleric.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "War Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "land",
    parentClassId: "druid",
    name: "Land",
    description: "A specialized archetype for the Official Druid.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Land Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "moon",
    parentClassId: "druid",
    name: "Moon",
    description: "A specialized archetype for the Official Druid.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Moon Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "circle-of-the-sea",
    parentClassId: "druid",
    name: "Circle Of The Sea",
    description: "A specialized archetype for the Official Druid.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Circle Of The Sea Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "stars",
    parentClassId: "druid",
    name: "Stars",
    description: "A specialized archetype for the Official Druid.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Stars Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "champion",
    parentClassId: "fighter",
    name: "Champion",
    description: "A specialized archetype for the Official Fighter.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Champion Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "battle-master",
    parentClassId: "fighter",
    name: "Battle Master",
    description: "A specialized archetype for the Official Fighter.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Battle Master Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "eldritch-knight",
    parentClassId: "fighter",
    name: "Eldritch Knight",
    description: "A specialized archetype for the Official Fighter.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Eldritch Knight Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "psi-warrior",
    parentClassId: "fighter",
    name: "Psi Warrior",
    description: "A specialized archetype for the Official Fighter.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Psi Warrior Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "warrior-of-mercy",
    parentClassId: "monk",
    name: "Warrior Of Mercy",
    description: "A specialized archetype for the Official Monk.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Warrior Of Mercy Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "warrior-of-shadow",
    parentClassId: "monk",
    name: "Warrior Of Shadow",
    description: "A specialized archetype for the Official Monk.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Warrior Of Shadow Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "warrior-of-the-elements",
    parentClassId: "monk",
    name: "Warrior Of The Elements",
    description: "A specialized archetype for the Official Monk.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Warrior Of The Elements Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "warrior-of-the-open-hand",
    parentClassId: "monk",
    name: "Warrior Of The Open Hand",
    description: "A specialized archetype for the Official Monk.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Warrior Of The Open Hand Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "astral-self",
    parentClassId: "monk",
    name: "Astral Self",
    description: "A specialized archetype for the Official Monk.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Astral Self Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "ascendant-dragon",
    parentClassId: "monk",
    name: "Ascendant Dragon",
    description: "A specialized archetype for the Official Monk.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Ascendant Dragon Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "drunken-master",
    parentClassId: "monk",
    name: "Drunken Master",
    description: "A specialized archetype for the Official Monk.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Drunken Master Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "four-elements",
    parentClassId: "monk",
    name: "Four Elements",
    description: "A specialized archetype for the Official Monk.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Four Elements Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "kensei",
    parentClassId: "monk",
    name: "kensei",
    description: "A specialized archetype for the Official Monk.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "kensei Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "long-death",
    parentClassId: "monk",
    name: "Long Death",
    description: "A specialized archetype for the Official Monk.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Long Death Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "mercy-5e",
    parentClassId: "monk",
    name: "Mercy 5E",
    description: "A specialized archetype for the Official Monk.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Mercy 5E Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "open-hand",
    parentClassId: "monk",
    name: "Open Hand",
    description: "A specialized archetype for the Official Monk.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Open Hand Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "shadow",
    parentClassId: "monk",
    name: "shadow",
    description: "A specialized archetype for the Official Monk.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "shadow Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "sun-soul",
    parentClassId: "monk",
    name: "Sun Soul",
    description: "A specialized archetype for the Official Monk.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    magicType: "Radiant Abilities",
    magicAbility: "Wisdom",
    magicDescription: "Radiant attacks & spells",
    features: [
      {
        level: 3,
        name: "Sun Soul Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "tranquility",
    parentClassId: "monk",
    name: "tranquility",
    description: "A specialized archetype for the Official Monk.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "tranquility Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "devotion",
    parentClassId: "paladin",
    name: "devotion",
    description: "A specialized archetype for the Official Paladin.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "devotion Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "glory",
    parentClassId: "paladin",
    name: "glory",
    description: "A specialized archetype for the Official Paladin.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "glory Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "ancients",
    parentClassId: "paladin",
    name: "ancients",
    description: "A specialized archetype for the Official Paladin.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "ancients Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "vengeance",
    parentClassId: "paladin",
    name: "vengeance",
    description: "A specialized archetype for the Official Paladin.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "vengeance Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "conquest",
    parentClassId: "paladin",
    name: "conquest",
    description: "A specialized archetype for the Official Paladin.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "conquest Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "crown",
    parentClassId: "paladin",
    name: "crown",
    description: "A specialized archetype for the Official Paladin.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "crown Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "redemption",
    parentClassId: "paladin",
    name: "redemption",
    description: "A specialized archetype for the Official Paladin.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "redemption Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "watchers",
    parentClassId: "paladin",
    name: "watchers",
    description: "A specialized archetype for the Official Paladin.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "watchers Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "oathbreaker",
    parentClassId: "paladin",
    name: "oathbreaker",
    description: "A specialized archetype for the Official Paladin.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "oathbreaker Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "beast-master",
    parentClassId: "ranger",
    name: "Beast Master",
    description: "A specialized archetype for the Official Ranger.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Beast Master Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "fey-wanderer",
    parentClassId: "ranger",
    name: "Fey Wanderer",
    description: "A specialized archetype for the Official Ranger.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Fey Wanderer Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "gloom-stalker",
    parentClassId: "ranger",
    name: "Gloom Stalker",
    description: "A specialized archetype for the Official Ranger.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Gloom Stalker Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "hunter",
    parentClassId: "ranger",
    name: "Hunter",
    description: "A specialized archetype for the Official Ranger.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Hunter Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "arcane-trickster",
    parentClassId: "rogue",
    name: "Arcane Trickster",
    description: "A specialized archetype for the Official Rogue.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Arcane Trickster Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "assassin",
    parentClassId: "rogue",
    name: "Assassin",
    description: "A specialized archetype for the Official Rogue.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Assassin Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "soulknife",
    parentClassId: "rogue",
    name: "Soulknife",
    description: "A specialized archetype for the Official Rogue.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Soulknife Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "thief",
    parentClassId: "rogue",
    name: "Thief",
    description: "A specialized archetype for the Official Rogue.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Thief Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "aberrant-sorcery",
    parentClassId: "sorcerer",
    name: "Aberrant Sorcery",
    description: "A specialized archetype for the Official Sorcerer.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Aberrant Sorcery Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "clockwork-sorcery",
    parentClassId: "sorcerer",
    name: "Clockwork Sorcery",
    description: "A specialized archetype for the Official Sorcerer.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Clockwork Sorcery Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "draconic-sorcery",
    parentClassId: "sorcerer",
    name: "Draconic Sorcery",
    description: "A specialized archetype for the Official Sorcerer.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Draconic Sorcery Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "wild-magic-sorcery",
    parentClassId: "sorcerer",
    name: "Wild Magic Sorcery",
    description: "A specialized archetype for the Official Sorcerer.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Wild Magic Sorcery Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "archfey",
    parentClassId: "warlock",
    name: "Archfey",
    description: "A specialized archetype for the Official Warlock.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Archfey Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "celestial",
    parentClassId: "warlock",
    name: "Celestial",
    description: "A specialized archetype for the Official Warlock.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Celestial Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "fiend",
    parentClassId: "warlock",
    name: "Fiend",
    description: "A specialized archetype for the Official Warlock.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Fiend Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "great-old-one",
    parentClassId: "warlock",
    name: "Great Old One",
    description: "A specialized archetype for the Official Warlock.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Great Old One Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "abjurer",
    parentClassId: "wizard",
    name: "Abjurer",
    description: "A specialized archetype for the Official Wizard.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Abjurer Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "diviner",
    parentClassId: "wizard",
    name: "Diviner",
    description: "A specialized archetype for the Official Wizard.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Diviner Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "evoker",
    parentClassId: "wizard",
    name: "Evoker",
    description: "A specialized archetype for the Official Wizard.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Evoker Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "illusionist",
    parentClassId: "wizard",
    name: "Illusionist",
    description: "A specialized archetype for the Official Wizard.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Illusionist Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "alchemist",
    parentClassId: "artificer",
    name: "Alchemist",
    description: "A specialized archetype for the Official Artificer.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Alchemist Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "armorer",
    parentClassId: "artificer",
    name: "Armorer",
    description: "A specialized archetype for the Official Artificer.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Armorer Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "artillerist",
    parentClassId: "artificer",
    name: "Artillerist",
    description: "A specialized archetype for the Official Artificer.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Artillerist Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "battle-smith",
    parentClassId: "artificer",
    name: "Battle Smith",
    description: "A specialized archetype for the Official Artificer.",
    imageUrl: "https://placehold.co/600x400",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Battle Smith Feature",
        description: "You gain a feature specific to this subclass."
      }
    ]
  },
  {
    id: "order-of-the-ghostslayer",
    parentClassId: "blood-hunter",
    name: "Order of the Ghostslayer",
    description: "The 'Classic' Witch Hunter. Focuses on killing Undead and rapid damage.",
    imageUrl: "https://placehold.co/600x400",
    source: "Critical Role",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Rite of the Dawn",
        description: "You gain the Rite of the Dawn (Radiant damage). It does extra damage to Undead."
      },
      {
        level: 7,
        name: "Hallowed Veins",
        description: "Blood Curses work on creatures normally immune to blood magic (like ghosts)."
      },
      {
        level: 11,
        name: "Supernal Surge",
        description: "You can turn ghost-like for a short time (pass through enemies, make extra attacks)."
      },
      {
        level: 15,
        name: "Gravesight",
        description: "You can see invisible creatures out to 60 feet."
      }
    ]
  },
  {
    id: "order-of-the-lycan",
    parentClassId: "blood-hunter",
    name: "Order of the Lycan",
    description: "The Werewolf Hybrid. Focuses on tanking and melee unarmed strikes.",
    imageUrl: "https://placehold.co/600x400",
    source: "Critical Role",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Hybrid Transformation",
        description: "You can transform into a werewolf hybrid for 1 hour. You gain resistance to non-magical damage, +1 AC, and your unarmed strikes do significant damage."
      },
      {
        level: 3,
        name: "Bloodlust",
        description: "If you take damage while transformed, you must make a Save or attack the nearest creature."
      },
      {
        level: 7,
        name: "Stalker's Prowess",
        description: "Your speed increases, and you jump further."
      },
      {
        level: 11,
        name: "Advanced Transformation",
        description: "Your unarmed strikes become magical, and you regenerate HP if you are below half health."
      },
      {
        level: 15,
        name: "Hybrid Howl",
        description: "You can howl to frighten enemies and stun them."
      }
    ]
  },
  {
    id: "order-of-the-mutant",
    parentClassId: "blood-hunter",
    name: "Order of the Mutant",
    description: "The Alchemist/Witcher. Focuses on flexibility and preparation.",
    imageUrl: "https://placehold.co/600x400",
    source: "Critical Role",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Mutagencraft",
        description: "You can brew Mutagens. Drinking one gives you a powerful buff but also a side effect."
      },
      {
        level: 7,
        name: "Strange Metabolism",
        description: "You gain immunity to poison. You can ignore the side effect of a mutagen for 1 minute."
      },
      {
        level: 11,
        name: "Brand of Axiom",
        description: "Your Brand prevents shape-shifters from changing form."
      },
      {
        level: 15,
        name: "Exalted Mutation",
        description: "Your mutagens become stronger (e.g., gain flight, or resistance to all physical damage)."
      }
    ]
  },
  {
    id: "order-of-the-profane-soul",
    parentClassId: "blood-hunter",
    name: "Order of the Profane Soul",
    description: "The Warlock Hybrid. Focuses on spellcasting utility.",
    imageUrl: "https://placehold.co/600x400",
    source: "Critical Role",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Pact Magic",
        description: "You gain Warlock spell slots and Cantrips. Your patron gives you a specific bonus feature."
      },
      {
        level: 7,
        name: "Rite Focus",
        description: "You can cast a spell as a bonus action when you take the Attack action."
      },
      {
        level: 11,
        name: "Brand of the Sapping Scar",
        description: "Your Brand disrupts the enemy's magic (they have Disadvantage on saves against your spells)."
      },
      {
        level: 15,
        name: "Unsealed Arcana",
        description: "You can cast one high-level Warlock spell once per long rest without using a slot."
      }
    ]
  },
  {
    "id": "path-of-wild-magic",
    "parentClassId": "barbarian",
    "name": "Path of Wild Magic",
    "description": "Many places in the multiverse abound with beauty, intense emotion, and rampant magic; the Feywild, the Upper Planes, and other realms of supernatural power radiate with such forces.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "magicType": "Magical Effects",
    "magicAbility": "Constitution",
    "magicDescription": "You can cast Detect Magic at will without using a spell slot. (Your primary feature creates random magical effects when you rage, but these are not technically 'spells').",
    "features": [
      {
        "level": 3,
        "name": "Magic Awareness",
        "description": "You can seek out magical energy."
      },
      {
        "level": 3,
        "name": "Wild Surge",
        "description": "The magic that roils inside you erupts."
      },
      {
        "level": 6,
        "name": "Bolstering Magic",
        "description": "You can infuse a creature or yourself with magic."
      },
      {
        "level": 10,
        "name": "Unstable Backlash",
        "description": "When you are in danger, the magic within you lashes out."
      },
      {
        "level": 14,
        "name": "Controlled Surge",
        "description": "You can exercise some control over your wild surges."
      }
    ]
  },
  {
    "id": "way-of-the-sun-soul",
    "parentClassId": "monk",
    "name": "Way of the Sun Soul",
    "description": "Monks of the Way of the Sun Soul learn to channel their own life energy into searing bolts of light. They teach that meditation can unlock the ability to unleash the indomitable light shed by the soul of every living creature.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "magicType": "Radiant Abilities & Spells",
    "magicAbility": "Wisdom",
    "magicDescription": "You gain a radiant ranged attack. Later, you can spend Ki to cast Burning Hands (radiant version) and Sunbeam.",
    "features": [
      {
        "level": 3,
        "name": "Radiant Sun Bolt",
        "description": "You can hurl searing bolts of magical radiance."
      },
      {
        "level": 6,
        "name": "Searing Arc Strike",
        "description": "You can channel your ki into searing waves of energy."
      },
      {
        "level": 11,
        "name": "Searing Sunburst",
        "description": "You can create an orb of light that erupts into a devastating explosion."
      },
      {
        "level": 17,
        "name": "Sun Shield",
        "description": "You become wreathed in a luminous, magical aura."
      }
    ]
  }
];