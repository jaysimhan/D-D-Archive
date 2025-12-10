import { Subclass } from "../types/dnd-types";

export const mockSubclasses: Subclass[] = [
  // WIZARD SUBCLASSES
  {
    id: "evocation",
    parentClassId: "wizard",
    name: "School of Evocation",
    description:
      "You focus your study on magic that creates powerful elemental effects such as bitter cold, searing flame, rolling thunder, crackling lightning, and burning acid.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 2,
        name: "Evocation Savant",
        description:
          "The gold and time you must spend to copy an evocation spell into your spellbook is halved.",
      },
      {
        level: 2,
        name: "Sculpt Spells",
        description:
          "When you cast an evocation spell that affects other creatures, you can choose a number of them equal to 1 + the spell's level to automatically succeed on their saving throws.",
      },
      {
        level: 6,
        name: "Potent Cantrip",
        description:
          "Your damaging cantrips affect even creatures that avoid the brunt of the effect.",
      },
      {
        level: 10,
        name: "Empowered Evocation",
        description:
          "You can add your Intelligence modifier to one damage roll of any wizard evocation spell you cast.",
      },
      {
        level: 14,
        name: "Overchannel",
        description:
          "You can increase the power of your simpler spells to deal maximum damage.",
      },
    ],
  },
  {
    id: "abjuration",
    parentClassId: "wizard",
    name: "School of Abjuration",
    description:
      "The School of Abjuration emphasizes magic that blocks, banishes, or protects. Detractors of this school say that its tradition is about denial, negation rather than positive assertion.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 2,
        name: "Abjuration Savant",
        description:
          "The gold and time you must spend to copy an abjuration spell into your spellbook is halved.",
      },
      {
        level: 2,
        name: "Arcane Ward",
        description:
          "You can weave magic around yourself for protection. When you cast an abjuration spell, you create a magical ward.",
      },
      {
        level: 6,
        name: "Projected Ward",
        description:
          "When a creature you can see within 30 feet takes damage, you can use your reaction to cause your Arcane Ward to absorb that damage.",
      },
      {
        level: 10,
        name: "Improved Abjuration",
        description:
          "When you cast an abjuration spell that requires you to make an ability check, you add your proficiency bonus to that check.",
      },
      {
        level: 14,
        name: "Spell Resistance",
        description: "You have advantage on saving throws against spells.",
      },
    ],
  },
  {
    id: "necromancy",
    parentClassId: "wizard",
    name: "School of Necromancy",
    description:
      "The School of Necromancy explores the cosmic forces of life, death, and undeath. As you focus your studies in this tradition, you learn to manipulate the energy that animates all living things.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 2,
        name: "Necromancy Savant",
        description:
          "The gold and time you must spend to copy a necromancy spell into your spellbook is halved.",
      },
      {
        level: 2,
        name: "Grim Harvest",
        description:
          "Once per turn when you kill a creature with a spell, you regain hit points.",
      },
      {
        level: 6,
        name: "Undead Thralls",
        description:
          "You add the Animate Dead spell to your spellbook if it's not there already. When you cast it, you can target one additional corpse or pile of bones.",
      },
      {
        level: 10,
        name: "Inured to Undeath",
        description:
          "You have resistance to necrotic damage, and your hit point maximum can't be reduced.",
      },
      {
        level: 14,
        name: "Command Undead",
        description:
          "You can use magic to bring undead under your control, even those created by other wizards.",
      },
    ],
  },
  {
    id: "illusion",
    parentClassId: "wizard",
    name: "School of Illusion",
    description:
      "You focus your studies on magic that dazzles the senses, befuddles the mind, and tricks even the wisest folk.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 2,
        name: "Illusion Savant",
        description:
          "The gold and time you must spend to copy an illusion spell into your spellbook is halved.",
      },
      {
        level: 2,
        name: "Improved Minor Illusion",
        description:
          "You learn the Minor Illusion cantrip. You can create both a sound and an image with a single casting of the spell.",
      },
      {
        level: 6,
        name: "Malleable Illusions",
        description:
          "When you cast an illusion spell with a duration of 1 minute or longer, you can use your action to change the nature of that illusion.",
      },
      {
        level: 10,
        name: "Illusory Self",
        description:
          "When a creature makes an attack roll against you, you can use your reaction to interpose an illusory duplicate.",
      },
      {
        level: 14,
        name: "Illusory Reality",
        description:
          "You can choose one inanimate, nonmagical object that is part of an illusion spell and make that object real.",
      },
    ],
  },

  // FIGHTER SUBCLASSES
  {
    id: "champion",
    parentClassId: "fighter",
    name: "Champion",
    description:
      "The archetypal Champion focuses on the development of raw physical power honed to deadly perfection.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Improved Critical",
        description: "Your weapon attacks score a critical hit on a roll of 19 or 20.",
      },
      {
        level: 7,
        name: "Remarkable Athlete",
        description:
          "You can add half your proficiency bonus to any Strength, Dexterity, or Constitution check you make that doesn't already use your proficiency bonus.",
      },
      {
        level: 10,
        name: "Additional Fighting Style",
        description: "You can choose a second option from the Fighting Style class feature.",
      },
      {
        level: 15,
        name: "Superior Critical",
        description: "Your weapon attacks score a critical hit on a roll of 18-20.",
      },
      {
        level: 18,
        name: "Survivor",
        description:
          "At the start of each of your turns, you regain hit points if you have no more than half your hit points left.",
      },
    ],
  },
  {
    id: "battle-master",
    parentClassId: "fighter",
    name: "Battle Master",
    description:
      "Those who emulate the archetypal Battle Master employ martial techniques passed down through generations.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Combat Superiority",
        description:
          "You learn maneuvers that are fueled by special dice called superiority dice.",
      },
      {
        level: 3,
        name: "Student of War",
        description: "You gain proficiency with one type of artisan's tools.",
      },
      {
        level: 7,
        name: "Know Your Enemy",
        description:
          "If you spend at least 1 minute observing or interacting with another creature, you can learn certain information about its capabilities.",
      },
      {
        level: 10,
        name: "Improved Combat Superiority",
        description: "Your superiority dice turn into d10s.",
      },
      {
        level: 15,
        name: "Relentless",
        description:
          "When you roll initiative and have no superiority dice remaining, you regain 1 superiority die.",
      },
    ],
  },
  {
    id: "eldritch-knight",
    parentClassId: "fighter",
    name: "Eldritch Knight",
    description:
      "The archetypal Eldritch Knight combines the martial mastery common to all fighters with a careful study of magic.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Spellcasting",
        description:
          "You augment your martial prowess with the ability to cast spells from the wizard spell list.",
      },
      {
        level: 3,
        name: "Weapon Bond",
        description:
          "You learn a ritual that creates a magical bond between yourself and one weapon.",
      },
      {
        level: 7,
        name: "War Magic",
        description:
          "When you use your action to cast a cantrip, you can make one weapon attack as a bonus action.",
      },
      {
        level: 10,
        name: "Eldritch Strike",
        description:
          "When you hit a creature with a weapon attack, that creature has disadvantage on the next saving throw it makes against a spell you cast.",
      },
      {
        level: 15,
        name: "Arcane Charge",
        description:
          "When you use your Action Surge, you can teleport up to 30 feet to an unoccupied space you can see.",
      },
    ],
  },

  // CLERIC SUBCLASSES
  {
    id: "life-domain",
    parentClassId: "cleric",
    name: "Life Domain",
    description:
      "The Life domain focuses on the vibrant positive energy that sustains all life.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 1,
        name: "Bonus Proficiency",
        description: "You gain proficiency with heavy armor.",
      },
      {
        level: 1,
        name: "Disciple of Life",
        description:
          "Your healing spells are more effective. Whenever you use a spell to restore hit points, the creature regains additional hit points.",
      },
      {
        level: 2,
        name: "Channel Divinity: Preserve Life",
        description:
          "You can use your Channel Divinity to heal the badly injured.",
      },
      {
        level: 6,
        name: "Blessed Healer",
        description:
          "The healing spells you cast on others heal you as well.",
      },
      {
        level: 8,
        name: "Divine Strike",
        description:
          "You gain the ability to infuse your weapon strikes with divine energy.",
      },
      {
        level: 17,
        name: "Supreme Healing",
        description:
          "When you would normally roll one or more dice to restore hit points with a spell, you instead use the highest number possible for each die.",
      },
    ],
  },
  {
    id: "light-domain",
    parentClassId: "cleric",
    name: "Light Domain",
    description:
      "Gods of light promote the ideals of rebirth and renewal, truth, vigilance, and beauty.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 1,
        name: "Bonus Cantrip",
        description: "You gain the Light cantrip.",
      },
      {
        level: 1,
        name: "Warding Flare",
        description:
          "You can interpose divine light between yourself and an attacking enemy.",
      },
      {
        level: 2,
        name: "Channel Divinity: Radiance of the Dawn",
        description:
          "You can use your Channel Divinity to harness sunlight, banishing darkness and dealing radiant damage.",
      },
      {
        level: 6,
        name: "Improved Flare",
        description:
          "You can use your Warding Flare feature to protect someone else when a creature you can see attacks them.",
      },
      {
        level: 8,
        name: "Potent Spellcasting",
        description:
          "You add your Wisdom modifier to the damage you deal with any cleric cantrip.",
      },
      {
        level: 17,
        name: "Corona of Light",
        description:
          "You can use your action to activate an aura of sunlight.",
      },
    ],
  },
  {
    id: "war-domain",
    parentClassId: "cleric",
    name: "War Domain",
    description:
      "War has many manifestations. It can make heroes of ordinary people. It can be desperate and horrific, with acts of cruelty and cowardice.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 1,
        name: "Bonus Proficiencies",
        description: "You gain proficiency with martial weapons and heavy armor.",
      },
      {
        level: 1,
        name: "War Priest",
        description:
          "When you use the Attack action, you can make one weapon attack as a bonus action.",
      },
      {
        level: 2,
        name: "Channel Divinity: Guided Strike",
        description:
          "You can use your Channel Divinity to strike with supernatural accuracy.",
      },
      {
        level: 6,
        name: "Channel Divinity: War God's Blessing",
        description:
          "When a creature within 30 feet makes an attack roll, you can use your reaction to grant a +10 bonus.",
      },
      {
        level: 8,
        name: "Divine Strike",
        description:
          "You gain the ability to infuse your weapon strikes with divine energy.",
      },
      {
        level: 17,
        name: "Avatar of Battle",
        description: "You gain resistance to bludgeoning, piercing, and slashing damage from nonmagical weapons.",
      },
    ],
  },

  // ROGUE SUBCLASSES
  {
    id: "thief",
    parentClassId: "rogue",
    name: "Thief",
    description:
      "You hone your skills in the larcenous arts. Burglars, bandits, cutpurses, and other criminals typically follow this archetype.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Fast Hands",
        description:
          "You can use the bonus action granted by your Cunning Action to make a Sleight of Hand check, use your thieves' tools, or take the Use an Object action.",
      },
      {
        level: 3,
        name: "Second-Story Work",
        description:
          "You gain the ability to climb faster than normal.",
      },
      {
        level: 9,
        name: "Supreme Sneak",
        description:
          "You have advantage on Dexterity (Stealth) checks if you move no more than half your speed on the same turn.",
      },
      {
        level: 13,
        name: "Use Magic Device",
        description:
          "You ignore all class, race, and level requirements on the use of magic items.",
      },
      {
        level: 17,
        name: "Thief's Reflexes",
        description: "You can take two turns during the first round of any combat.",
      },
    ],
  },
  {
    id: "assassin",
    parentClassId: "rogue",
    name: "Assassin",
    description:
      "You focus your training on the grim art of death. Those who adhere to this archetype are diverse: hired killers, spies, bounty hunters.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Bonus Proficiencies",
        description: "You gain proficiency with the disguise kit and the poisoner's kit.",
      },
      {
        level: 3,
        name: "Assassinate",
        description:
          "You have advantage on attack rolls against any creature that hasn't taken a turn in combat yet.",
      },
      {
        level: 9,
        name: "Infiltration Expertise",
        description:
          "You can unfailingly create false identities for yourself.",
      },
      {
        level: 13,
        name: "Impostor",
        description:
          "You gain the ability to unerringly mimic another person's speech, writing, and behavior.",
      },
      {
        level: 17,
        name: "Death Strike",
        description:
          "When you attack and hit a creature that is surprised, it must make a Constitution saving throw or double the damage of your attack.",
      },
    ],
  },
  {
    id: "arcane-trickster",
    parentClassId: "rogue",
    name: "Arcane Trickster",
    description:
      "Some rogues enhance their fine-honed skills of stealth and agility with magic, learning tricks of enchantment and illusion.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Spellcasting",
        description:
          "You gain the ability to cast spells from the wizard spell list, focusing on enchantment and illusion.",
      },
      {
        level: 3,
        name: "Mage Hand Legerdemain",
        description:
          "When you cast Mage Hand, you can make the spectral hand invisible, and you can perform additional tasks with it.",
      },
      {
        level: 9,
        name: "Magical Ambush",
        description:
          "If you are hidden from a creature when you cast a spell on it, the creature has disadvantage on any saving throw it makes against the spell.",
      },
      {
        level: 13,
        name: "Versatile Trickster",
        description:
          "You gain the ability to distract targets with your Mage Hand.",
      },
      {
        level: 17,
        name: "Spell Thief",
        description:
          "You gain the ability to magically steal the knowledge of how to cast a spell from another spellcaster.",
      },
    ],
  },

  // BARD SUBCLASSES
  {
    id: "lore",
    parentClassId: "bard",
    name: "College of Lore",
    description:
      "Bards of the College of Lore know something about most things, collecting bits of knowledge from sources as diverse as scholarly tomes and peasant tales.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Bonus Proficiencies",
        description: "You gain proficiency with three skills of your choice.",
      },
      {
        level: 3,
        name: "Cutting Words",
        description:
          "You learn how to use your wit to distract, confuse, and otherwise sap the confidence and competence of others.",
      },
      {
        level: 6,
        name: "Additional Magical Secrets",
        description:
          "You learn two spells of your choice from any class.",
      },
      {
        level: 14,
        name: "Peerless Skill",
        description:
          "When you make an ability check, you can expend one use of Bardic Inspiration to add the Bardic Inspiration die to your ability check.",
      },
    ],
  },
  {
    id: "valor",
    parentClassId: "bard",
    name: "College of Valor",
    description:
      "Bards of the College of Valor are daring skalds whose tales keep alive the memory of the great heroes of the past.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Bonus Proficiencies",
        description: "You gain proficiency with medium armor, shields, and martial weapons.",
      },
      {
        level: 3,
        name: "Combat Inspiration",
        description:
          "A creature that has a Bardic Inspiration die can use it to add to a weapon damage roll or to AC.",
      },
      {
        level: 6,
        name: "Extra Attack",
        description:
          "You can attack twice, instead of once, whenever you take the Attack action on your turn.",
      },
      {
        level: 14,
        name: "Battle Magic",
        description:
          "When you use your action to cast a bard spell, you can make one weapon attack as a bonus action.",
      },
    ],
  },

  // PALADIN SUBCLASSES
  {
    id: "devotion",
    parentClassId: "paladin",
    name: "Oath of Devotion",
    description:
      "The Oath of Devotion binds a paladin to the loftiest ideals of justice, virtue, and order.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Sacred Weapon",
        description:
          "As an action, you can imbue one weapon with positive energy. For 1 minute, you add your Charisma modifier to attack rolls made with that weapon.",
      },
      {
        level: 3,
        name: "Turn the Unholy",
        description:
          "As an action, you present your holy symbol and speak a prayer censuring fiends and undead.",
      },
      {
        level: 7,
        name: "Aura of Devotion",
        description:
          "You and friendly creatures within 10 feet can't be charmed while you are conscious.",
      },
      {
        level: 15,
        name: "Purity of Spirit",
        description: "You are always under the effects of a Protection from Evil and Good spell.",
      },
      {
        level: 20,
        name: "Holy Nimbus",
        description:
          "As an action, you can emanate an aura of sunlight.",
      },
    ],
  },
  {
    id: "vengeance",
    parentClassId: "paladin",
    name: "Oath of Vengeance",
    description:
      "The Oath of Vengeance is a solemn commitment to punish those who have committed a grievous sin.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Abjure Enemy",
        description:
          "As an action, you present your holy symbol and speak a prayer of denunciation.",
      },
      {
        level: 3,
        name: "Vow of Enmity",
        description:
          "As a bonus action, you can utter a vow of enmity against a creature you can see within 10 feet.",
      },
      {
        level: 7,
        name: "Relentless Avenger",
        description:
          "When you hit a creature with an opportunity attack, you can move up to half your speed as part of the same reaction.",
      },
      {
        level: 15,
        name: "Soul of Vengeance",
        description:
          "When a creature under the effect of your Vow of Enmity makes an attack, you can use your reaction to make a melee weapon attack against that creature.",
      },
      {
        level: 20,
        name: "Avenging Angel",
        description:
          "You can assume the form of an angelic avenger.",
      },
    ],
  },

  // RANGER SUBCLASSES
  {
    id: "hunter",
    parentClassId: "ranger",
    name: "Hunter",
    description:
      "Emulating the Hunter archetype means accepting your place as a bulwark between civilization and the terrors of the wilderness.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Hunter's Prey",
        description:
          "You gain one of several features: Colossus Slayer, Giant Killer, or Horde Breaker.",
      },
      {
        level: 7,
        name: "Defensive Tactics",
        description:
          "You gain one of several features: Escape the Horde, Multiattack Defense, or Steel Will.",
      },
      {
        level: 11,
        name: "Multiattack",
        description:
          "You gain one of several features: Volley or Whirlwind Attack.",
      },
      {
        level: 15,
        name: "Superior Hunter's Defense",
        description:
          "You gain one of several features: Evasion, Stand Against the Tide, or Uncanny Dodge.",
      },
    ],
  },
  {
    id: "beast-master",
    parentClassId: "ranger",
    name: "Beast Master",
    description:
      "The Beast Master archetype embodies a friendship between the civilized races and the beasts of the wild.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Ranger's Companion",
        description:
          "You gain a beast companion that accompanies you on your adventures.",
      },
      {
        level: 7,
        name: "Exceptional Training",
        description:
          "On any of your turns when your beast companion doesn't attack, you can use a bonus action to command the beast to take the Dash, Disengage, or Help action.",
      },
      {
        level: 11,
        name: "Bestial Fury",
        description:
          "When you command your beast companion to take the Attack action, the beast can make two attacks.",
      },
      {
        level: 15,
        name: "Share Spells",
        description:
          "When you cast a spell targeting yourself, you can also affect your beast companion with the spell.",
      },
    ],
  },

  // SORCERER SUBCLASSES
  {
    id: "draconic-bloodline",
    parentClassId: "sorcerer",
    name: "Draconic Bloodline",
    description:
      "Your innate magic comes from draconic magic that was mingled with your blood or that of your ancestors.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 1,
        name: "Dragon Ancestor",
        description:
          "You choose one type of dragon as your ancestor. You can speak, read, and write Draconic.",
      },
      {
        level: 1,
        name: "Draconic Resilience",
        description:
          "Your hit point maximum increases by 1 per sorcerer level, and you have natural armor.",
      },
      {
        level: 6,
        name: "Elemental Affinity",
        description:
          "When you cast a spell that deals damage of the type associated with your draconic ancestry, you can add your Charisma modifier to that damage.",
      },
      {
        level: 14,
        name: "Dragon Wings",
        description: "You gain the ability to sprout a pair of dragon wings from your back.",
      },
      {
        level: 18,
        name: "Draconic Presence",
        description:
          "You can channel the dread presence of your dragon ancestor.",
      },
    ],
  },
  {
    id: "wild-magic",
    parentClassId: "sorcerer",
    name: "Wild Magic",
    description:
      "Your innate magic comes from the wild forces of chaos that underlie the order of creation.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 1,
        name: "Wild Magic Surge",
        description:
          "Your spellcasting can unleash surges of untamed magic.",
      },
      {
        level: 1,
        name: "Tides of Chaos",
        description:
          "You can manipulate the forces of chance and chaos to gain advantage on one attack roll, ability check, or saving throw.",
      },
      {
        level: 6,
        name: "Bend Luck",
        description:
          "You can twist fate using your wild magic. When another creature you can see makes an attack roll, ability check, or saving throw, you can use your reaction and spend 2 sorcery points to roll 1d4 and apply the number rolled as a bonus or penalty.",
      },
      {
        level: 14,
        name: "Controlled Chaos",
        description:
          "Whenever you roll on the Wild Magic Surge table, you can roll twice and use either number.",
      },
      {
        level: 18,
        name: "Spell Bombardment",
        description:
          "When you roll damage for a spell and roll the highest number possible on any of the dice, choose one of those dice, roll it again, and add that roll to the damage.",
      },
    ],
  },

  // WARLOCK SUBCLASSES
  {
    id: "the-fiend",
    parentClassId: "warlock",
    name: "The Fiend",
    description:
      "You have made a pact with a fiend from the lower planes of existence, a being whose aims are evil.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 1,
        name: "Dark One's Blessing",
        description:
          "When you reduce a hostile creature to 0 hit points, you gain temporary hit points.",
      },
      {
        level: 6,
        name: "Dark One's Own Luck",
        description:
          "You can call on your patron to alter fate in your favor. When you make an ability check or saving throw, you can use this feature to add a d10 to your roll.",
      },
      {
        level: 10,
        name: "Fiendish Resilience",
        description:
          "You can choose one damage type when you finish a short or long rest. You gain resistance to that damage type.",
      },
      {
        level: 14,
        name: "Hurl Through Hell",
        description:
          "When you hit a creature with an attack, you can use this feature to instantly transport the target through the lower planes.",
      },
    ],
  },
  {
    id: "the-archfey",
    parentClassId: "warlock",
    name: "The Archfey",
    description:
      "Your patron is a lord or lady of the fey, a creature of legend who holds secrets that were forgotten before the mortal races were born.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 1,
        name: "Fey Presence",
        description:
          "As an action, you can cause each creature in a 10-foot cube originating from you to make a Wisdom saving throw against your warlock spell save DC.",
      },
      {
        level: 6,
        name: "Misty Escape",
        description:
          "When you take damage, you can use your reaction to turn invisible and teleport.",
      },
      {
        level: 10,
        name: "Beguiling Defenses",
        description:
          "You are immune to being charmed, and when another creature attempts to charm you, you can use your reaction to attempt to turn the charm back on that creature.",
      },
      {
        level: 14,
        name: "Dark Delirium",
        description:
          "You can plunge a creature into an illusory realm.",
      },
    ],
  },
  {
    id: "the-hexblade",
    parentClassId: "warlock",
    name: "The Hexblade",
    description:
      "You have made your pact with a mysterious entity from the Shadowfell - a force that manifests in sentient magic weapons carved from the stuff of shadow.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 1,
        name: "Hexblade's Curse",
        description:
          "As a bonus action, you place a curse on a creature you can see within 30 feet of you.",
      },
      {
        level: 1,
        name: "Hex Warrior",
        description:
          "You gain proficiency with medium armor, shields, and martial weapons.",
      },
      {
        level: 6,
        name: "Accursed Specter",
        description:
          "When you slay a humanoid, you can cause its spirit to rise from its corpse as a specter.",
      },
      {
        level: 10,
        name: "Armor of Hexes",
        description:
          "Your hex grows more powerful. If the target cursed by your Hexblade's Curse hits you with an attack roll, roll a d6.",
      },
      {
        level: 14,
        name: "Master of Hexes",
        description:
          "When the creature cursed by your Hexblade's Curse dies, you can apply the curse to a different creature.",
      },
    ],
  },

  // BARBARIAN SUBCLASSES
  {
    id: "berserker",
    parentClassId: "barbarian",
    name: "Path of the Berserker",
    description:
      "For some barbarians, rage is a means to an end - that end being violence.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Frenzy",
        description:
          "You can go into a frenzy when you rage. While raging, you can make a single melee weapon attack as a bonus action on each of your turns.",
      },
      {
        level: 6,
        name: "Mindless Rage",
        description:
          "You can't be charmed or frightened while raging.",
      },
      {
        level: 10,
        name: "Intimidating Presence",
        description:
          "You can use your action to frighten someone with your menacing presence.",
      },
      {
        level: 14,
        name: "Retaliation",
        description:
          "When you take damage from a creature that is within 5 feet of you, you can use your reaction to make a melee weapon attack against that creature.",
      },
    ],
  },
  {
    id: "totem-warrior",
    parentClassId: "barbarian",
    name: "Path of the Totem Warrior",
    description:
      "The Path of the Totem Warrior is a spiritual journey, as the barbarian accepts a spirit animal as guide, protector, and inspiration.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Spirit Seeker",
        description:
          "Yours is a path that seeks attunement with the natural world, giving you a kinship with beasts.",
      },
      {
        level: 3,
        name: "Totem Spirit",
        description:
          "You choose a totem spirit and gain its feature. You must make or acquire a physical totem object.",
      },
      {
        level: 6,
        name: "Aspect of the Beast",
        description:
          "You gain a magical benefit based on the totem animal of your choice.",
      },
      {
        level: 10,
        name: "Spirit Walker",
        description:
          "You can cast the Commune with Nature spell, but only as a ritual.",
      },
      {
        level: 14,
        name: "Totemic Attunement",
        description:
          "You gain a magical benefit based on a totem animal of your choice.",
      },
    ],
  },

  // MONK SUBCLASSES
  {
    id: "open-hand",
    parentClassId: "monk",
    name: "Way of the Open Hand",
    description:
      "Monks of the Way of the Open Hand are the ultimate masters of martial arts combat.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Open Hand Technique",
        description:
          "Whenever you hit a creature with one of the attacks granted by your Flurry of Blows, you can impose one of several effects on that target.",
      },
      {
        level: 6,
        name: "Wholeness of Body",
        description:
          "You gain the ability to heal yourself. As an action, you can regain hit points.",
      },
      {
        level: 11,
        name: "Tranquility",
        description:
          "You can enter a special meditation that surrounds you with an aura of peace.",
      },
      {
        level: 17,
        name: "Quivering Palm",
        description:
          "You gain the ability to set up lethal vibrations in someone's body.",
      },
    ],
  },
  {
    id: "shadow",
    parentClassId: "monk",
    name: "Way of Shadow",
    description:
      "Monks of the Way of Shadow follow a tradition that values stealth and subterfuge.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Shadow Arts",
        description:
          "You can use ki to duplicate the effects of certain spells.",
      },
      {
        level: 6,
        name: "Shadow Step",
        description:
          "You gain the ability to step from one shadow into another.",
      },
      {
        level: 11,
        name: "Cloak of Shadows",
        description:
          "You can use your action to become invisible in dim light or darkness.",
      },
      {
        level: 17,
        name: "Opportunist",
        description:
          "You can exploit a creature's momentary distraction when it is hit by an attack.",
      },
    ],
  },

  // DRUID SUBCLASSES
  {
    id: "land",
    parentClassId: "druid",
    name: "Circle of the Land",
    description:
      "The Circle of the Land is made up of mystics and sages who safeguard ancient knowledge and rites.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 2,
        name: "Bonus Cantrip",
        description: "You learn one additional druid cantrip of your choice.",
      },
      {
        level: 2,
        name: "Natural Recovery",
        description:
          "During a short rest, you can recover some of your magical energy.",
      },
      {
        level: 3,
        name: "Circle Spells",
        description:
          "Your mystical connection to the land infuses you with the ability to cast certain spells.",
      },
      {
        level: 6,
        name: "Land's Stride",
        description:
          "Moving through nonmagical difficult terrain costs you no extra movement.",
      },
      {
        level: 10,
        name: "Nature's Ward",
        description:
          "You can't be charmed or frightened by elementals or fey.",
      },
      {
        level: 14,
        name: "Nature's Sanctuary",
        description:
          "Creatures of the natural world sense your connection to nature and become hesitant to attack you.",
      },
    ],
  },
  {
    id: "moon",
    parentClassId: "druid",
    name: "Circle of the Moon",
    description:
      "Druids of the Circle of the Moon are fierce guardians of the wilds.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 2,
        name: "Combat Wild Shape",
        description:
          "You gain the ability to use Wild Shape on your turn as a bonus action, rather than as an action.",
      },
      {
        level: 2,
        name: "Circle Forms",
        description:
          "The rites of your circle grant you the ability to transform into more dangerous animal forms.",
      },
      {
        level: 6,
        name: "Primal Strike",
        description:
          "Your attacks in beast form count as magical for the purpose of overcoming resistance.",
      },
      {
        level: 10,
        name: "Elemental Wild Shape",
        description:
          "You can expend two uses of Wild Shape to transform into an air elemental, earth elemental, fire elemental, or water elemental.",
      },
      {
        level: 14,
        name: "Thousand Forms",
        description:
          "You can cast the Alter Self spell at will.",
      },
    ],
  },

  // ARTIFICER SUBCLASSES
  {
    id: "alchemist",
    parentClassId: "artificer",
    name: "Alchemist",
    description:
      "An Alchemist is an expert at combining reagents to produce mystical effects.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Tool Proficiency",
        description: "You gain proficiency with alchemist's supplies.",
      },
      {
        level: 3,
        name: "Alchemist Spells",
        description:
          "You always have certain spells prepared that don't count against your prepared spells.",
      },
      {
        level: 3,
        name: "Experimental Elixir",
        description:
          "When you finish a long rest, you can magically produce an experimental elixir in an empty flask.",
      },
      {
        level: 5,
        name: "Alchemical Savant",
        description:
          "You've developed masterful command of magical chemicals. Whenever you cast a spell using alchemist's supplies, you gain a bonus to spell damage or healing rolls.",
      },
      {
        level: 9,
        name: "Restorative Reagents",
        description:
          "You can incorporate restorative reagents into some of your works.",
      },
      {
        level: 15,
        name: "Chemical Mastery",
        description:
          "You have been exposed to so many chemicals that they pose little risk to you.",
      },
    ],
  },
  {
    id: "artillerist",
    parentClassId: "artificer",
    name: "Artillerist",
    description:
      "An Artillerist specializes in using magic to hurl energy, projectiles, and explosions.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Tool Proficiency",
        description: "You gain proficiency with woodcarver's tools.",
      },
      {
        level: 3,
        name: "Artillerist Spells",
        description:
          "You always have certain spells prepared that don't count against your prepared spells.",
      },
      {
        level: 3,
        name: "Eldritch Cannon",
        description:
          "You've learned how to create a magical cannon. You can use an action to magically summon the cannon in an unoccupied space.",
      },
      {
        level: 5,
        name: "Arcane Firearm",
        description:
          "You know how to turn a wand, staff, or rod into an arcane firearm.",
      },
      {
        level: 9,
        name: "Explosive Cannon",
        description:
          "Every eldritch cannon you create is more destructive.",
      },
      {
        level: 15,
        name: "Fortified Position",
        description:
          "You're a master at forming well-defended emplacements using Eldritch Cannon.",
      },
    ],
  },
  {
    id: "battle-smith",
    parentClassId: "artificer",
    name: "Battle Smith",
    description:
      "Armies require protection, and someone has to put things back together if defenses fail. A combination of protector and medic, a Battle Smith is an expert at defending others and repairing both materiel and personnel.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Tool Proficiency",
        description: "You gain proficiency with smith's tools.",
      },
      {
        level: 3,
        name: "Battle Smith Spells",
        description:
          "You always have certain spells prepared that don't count against your prepared spells.",
      },
      {
        level: 3,
        name: "Battle Ready",
        description:
          "Your combat training and experiments with magic have paid off. You gain proficiency with martial weapons and can use Intelligence for attack and damage rolls.",
      },
      {
        level: 3,
        name: "Steel Defender",
        description:
          "Your tinkering has borne you a faithful companion, a steel defender.",
      },
      {
        level: 9,
        name: "Arcane Jolt",
        description:
          "You learn new ways to channel arcane energy through your weapon attacks and your steel defender.",
      },
      {
        level: 15,
        name: "Improved Defender",
        description:
          "Your Arcane Jolt and steel defender become more powerful.",
      },
    ],
  },

  // ADDITIONAL WIZARD SUBCLASSES
  {
    id: "divination",
    parentClassId: "wizard",
    name: "School of Divination",
    description: "The counsel of a diviner is sought by royalty and commoners alike, for all seek a clearer understanding of the past, present, and future. As a diviner, you strive to part the veils of space, time, and consciousness.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      { level: 2, name: "Divination Savant", description: "The gold and time you must spend to copy a divination spell into your spellbook is halved." },
      { level: 2, name: "Portent", description: "Glimpses of the future begin to press in on your awareness. When you finish a long rest, roll two d20s and record the numbers rolled." },
      { level: 6, name: "Expert Divination", description: "Casting divination spells comes so easily to you that it expends only a fraction of your spellcasting efforts." },
      { level: 10, name: "The Third Eye", description: "You can use your action to increase your powers of perception." },
      { level: 14, name: "Greater Portent", description: "The visions in your dreams intensify and paint a more accurate picture in your mind of what is to come. You roll three d20s for your Portent feature." },
    ],
  },
  {
    id: "enchantment",
    parentClassId: "wizard",
    name: "School of Enchantment",
    description: "You have honed your ability to magically entrance and beguile other people and monsters. Some enchanters are peacemakers who bewitch the violent to lay down their arms.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      { level: 2, name: "Enchantment Savant", description: "The gold and time you must spend to copy an enchantment spell into your spellbook is halved." },
      { level: 2, name: "Hypnotic Gaze", description: "Your soft words and enchanting gaze can magically enthrall another creature." },
      { level: 6, name: "Instinctive Charm", description: "When a creature you can see within 30 feet makes an attack roll against you, you can use your reaction to divert the attack." },
      { level: 10, name: "Split Enchantment", description: "When you cast an enchantment spell of 1st level or higher that targets only one creature, you can have it target a second creature." },
      { level: 14, name: "Alter Memories", description: "You gain the ability to make a creature unaware of your magical influence on it." },
    ],
  },
  {
    id: "conjuration",
    parentClassId: "wizard",
    name: "School of Conjuration",
    description: "You focus your studies on magic that produces objects and creatures out of thin air. You can conjure billowing clouds of killing fog or summon creatures from elsewhere to fight on your behalf.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      { level: 2, name: "Conjuration Savant", description: "The gold and time you must spend to copy a conjuration spell into your spellbook is halved." },
      { level: 2, name: "Minor Conjuration", description: "You can use your action to conjure up an inanimate object in your hand or on the ground in an unoccupied space." },
      { level: 6, name: "Benign Transposition", description: "You can use your action to teleport up to 30 feet to an unoccupied space that you can see." },
      { level: 10, name: "Focused Conjuration", description: "While you are concentrating on a conjuration spell, your concentration can't be broken as a result of taking damage." },
      { level: 14, name: "Durable Summons", description: "Any creature that you summon or create with a conjuration spell has 30 temporary hit points." },
    ],
  },
  {
    id: "transmutation",
    parentClassId: "wizard",
    name: "School of Transmutation",
    description: "You are a student of spells that modify energy and matter. To you, the world is not a fixed thing, but eminently mutable.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      { level: 2, name: "Transmutation Savant", description: "The gold and time you must spend to copy a transmutation spell into your spellbook is halved." },
      { level: 2, name: "Minor Alchemy", description: "You can temporarily alter the physical properties of one nonmagical object." },
      { level: 6, name: "Transmuter's Stone", description: "You can spend 8 hours creating a transmuter's stone that stores transmutation magic." },
      { level: 10, name: "Shapechanger", description: "You add the Polymorph spell to your spellbook. You can cast it on yourself without expending a spell slot." },
      { level: 14, name: "Master Transmuter", description: "You can use your action to consume the reserve of transmutation magic stored within your transmuter's stone." },
    ],
  },

  // ADDITIONAL CLERIC SUBCLASSES
  {
    id: "knowledge-domain",
    parentClassId: "cleric",
    name: "Knowledge Domain",
    description: "The gods of knowledge value learning and understanding above all. Some teach that knowledge is to be gathered and shared in libraries and universities.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      { level: 1, name: "Blessings of Knowledge", description: "You learn two languages of your choice and gain proficiency in two skills of your choice." },
      { level: 2, name: "Channel Divinity: Knowledge of the Ages", description: "You can use your Channel Divinity to tap into a divine well of knowledge." },
      { level: 6, name: "Channel Divinity: Read Thoughts", description: "You can use your Channel Divinity to read a creature's thoughts." },
      { level: 8, name: "Potent Spellcasting", description: "You add your Wisdom modifier to the damage you deal with any cleric cantrip." },
      { level: 17, name: "Visions of the Past", description: "You can call up visions of the past that relate to an object or location." },
    ],
  },
  {
    id: "tempest-domain",
    parentClassId: "cleric",
    name: "Tempest Domain",
    description: "Gods whose portfolios include the Tempest domain govern storms, sea, and sky. They include gods of lightning and thunder, gods of earthquakes, and some gods of violence.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      { level: 1, name: "Bonus Proficiencies", description: "You gain proficiency with martial weapons and heavy armor." },
      { level: 1, name: "Wrath of the Storm", description: "When a creature within 5 feet hits you with an attack, you can use your reaction to cause the creature to make a Dexterity saving throw." },
      { level: 2, name: "Channel Divinity: Destructive Wrath", description: "You can use your Channel Divinity to wield the power of the storm with unchecked ferocity." },
      { level: 6, name: "Thunderbolt Strike", description: "When you deal lightning damage to a Large or smaller creature, you can also push it up to 10 feet away from you." },
      { level: 8, name: "Divine Strike", description: "You gain the ability to infuse your weapon strikes with divine energy." },
      { level: 17, name: "Stormborn", description: "You have a flying speed equal to your current walking speed whenever you are not underground or indoors." },
    ],
  },
  {
    id: "trickery-domain",
    parentClassId: "cleric",
    name: "Trickery Domain",
    description: "Gods of trickery are mischief-makers and instigators who stand as a constant challenge to the accepted order among both gods and mortals.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      { level: 1, name: "Blessing of the Trickster", description: "You can use your action to touch a willing creature other than yourself to give it advantage on Dexterity (Stealth) checks." },
      { level: 2, name: "Channel Divinity: Invoke Duplicity", description: "You can use your Channel Divinity to create an illusory duplicate of yourself." },
      { level: 6, name: "Channel Divinity: Cloak of Shadows", description: "You can use your Channel Divinity to vanish." },
      { level: 8, name: "Divine Strike", description: "You gain the ability to infuse your weapon strikes with poison." },
      { level: 17, name: "Improved Duplicity", description: "You can create up to four duplicates of yourself, instead of one." },
    ],
  },
  {
    id: "nature-domain",
    parentClassId: "cleric",
    name: "Nature Domain",
    description: "Gods of nature are as varied as the natural world itself. They are patrons of druids and worship the forces of nature itself.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      { level: 1, name: "Acolyte of Nature", description: "You learn one druid cantrip of your choice and gain proficiency in one skill of your choice." },
      { level: 1, name: "Bonus Proficiency", description: "You gain proficiency with heavy armor." },
      { level: 2, name: "Channel Divinity: Charm Animals and Plants", description: "You can use your Channel Divinity to charm animals and plants." },
      { level: 6, name: "Dampen Elements", description: "When you or a creature within 30 feet takes acid, cold, fire, lightning, or thunder damage, you can use your reaction to grant resistance to that damage." },
      { level: 8, name: "Divine Strike", description: "You gain the ability to infuse your weapon strikes with divine energy." },
      { level: 17, name: "Master of Nature", description: "You gain the ability to command animals and plant creatures." },
    ],
  },

  // ADDITIONAL FIGHTER SUBCLASSES
  {
    id: "samurai",
    parentClassId: "fighter",
    name: "Samurai",
    description: "The Samurai is a fighter who draws on an implacable fighting spirit to overcome enemies. A samurai's resolve is nearly unbreakable.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      { level: 3, name: "Bonus Proficiency", description: "You gain proficiency in one skill of your choice." },
      { level: 3, name: "Fighting Spirit", description: "As a bonus action, you can give yourself advantage on weapon attack rolls until the end of your turn." },
      { level: 7, name: "Elegant Courtier", description: "Your discipline and attention to detail allow you to excel in social situations." },
      { level: 10, name: "Tireless Spirit", description: "When you roll initiative and have no uses of Fighting Spirit remaining, you regain one use." },
      { level: 15, name: "Rapid Strike", description: "You learn to trade accuracy for swift strikes." },
      { level: 18, name: "Strength Before Death", description: "If you take damage that reduces you to 0 hit points, you can delay falling unconscious." },
    ],
  },
  {
    id: "arcane-archer",
    parentClassId: "fighter",
    name: "Arcane Archer",
    description: "An Arcane Archer studies a unique elven method of archery that weaves magic into attacks to produce supernatural effects.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      { level: 3, name: "Arcane Archer Lore", description: "You learn magical theory or some of the secrets of nature." },
      { level: 3, name: "Arcane Shot", description: "You learn to unleash special magical effects with some of your shots." },
      { level: 7, name: "Magic Arrow", description: "You gain the ability to infuse arrows with magic." },
      { level: 10, name: "Curving Shot", description: "You learn how to direct an errant arrow toward a new target." },
      { level: 15, name: "Ever-Ready Shot", description: "Your magical archery is available whenever battle starts." },
      { level: 18, name: "Improved Arcane Shot", description: "Your Arcane Shot options become more powerful." },
    ],
  },

  // ADDITIONAL ROGUE SUBCLASSES
  {
    id: "swashbuckler",
    parentClassId: "rogue",
    name: "Swashbuckler",
    description: "You focus your training on the art of the blade, relying on speed, elegance, and charm in equal parts.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      { level: 3, name: "Fancy Footwork", description: "During your turn, if you make a melee attack against a creature, that creature can't make opportunity attacks against you for the rest of your turn." },
      { level: 3, name: "Rakish Audacity", description: "You add your Charisma modifier to your initiative rolls and you don't need advantage on your attack roll to use Sneak Attack." },
      { level: 9, name: "Panache", description: "You can make a Charisma (Persuasion) check to charm a humanoid." },
      { level: 13, name: "Elegant Maneuver", description: "You can use a bonus action to gain advantage on the next Dexterity (Acrobatics) or Strength (Athletics) check." },
      { level: 17, name: "Master Duelist", description: "If you miss with an attack roll, you can choose to roll it again with advantage." },
    ],
  },
  {
    id: "inquisitive",
    parentClassId: "rogue",
    name: "Inquisitive",
    description: "You excel at rooting out secrets and unraveling mysteries. You rely on your sharp eye for detail.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      { level: 3, name: "Ear for Deceit", description: "You develop a talent for picking out lies." },
      { level: 3, name: "Eye for Detail", description: "You can use a bonus action to make a Wisdom (Perception) check or Intelligence (Investigation) check." },
      { level: 3, name: "Insightful Fighting", description: "You can use a bonus action to make a Wisdom (Insight) check against a creature you can see." },
      { level: 9, name: "Steady Eye", description: "You have advantage on Wisdom (Perception) or Intelligence (Investigation) checks if you move no more than half your speed." },
      { level: 13, name: "Unerring Eye", description: "You can sense the presence of illusions, shapechangers, and magic." },
      { level: 17, name: "Eye for Weakness", description: "You learn to exploit a creature's weaknesses." },
    ],
  },

  // ADDITIONAL PALADIN SUBCLASSES
  {
    id: "ancients",
    parentClassId: "paladin",
    name: "Oath of the Ancients",
    description: "The Oath of the Ancients is as old as the race of elves and the rituals of the druids. Paladins who swear this oath cast their lot with the side of the light in the cosmic struggle against darkness.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      { level: 3, name: "Nature's Wrath", description: "You can use your Channel Divinity to invoke primeval forces to ensnare a foe." },
      { level: 3, name: "Turn the Faithless", description: "You can use your Channel Divinity to utter ancient words that are painful for fey and fiends to hear." },
      { level: 7, name: "Aura of Warding", description: "Ancient magic lies so heavily upon you that it forms an eldritch ward." },
      { level: 15, name: "Undying Sentinel", description: "When you are reduced to 0 hit points, you can choose to drop to 1 hit point instead." },
      { level: 20, name: "Elder Champion", description: "You can assume the form of an ancient force of nature." },
    ],
  },
  {
    id: "conquest",
    parentClassId: "paladin",
    name: "Oath of Conquest",
    description: "The Oath of Conquest calls to paladins who seek glory in battle and the subjugation of their enemies.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      { level: 3, name: "Conquering Presence", description: "You can use your Channel Divinity to exude a terrifying presence." },
      { level: 3, name: "Guided Strike", description: "You can use your Channel Divinity to strike with supernatural accuracy." },
      { level: 7, name: "Aura of Conquest", description: "You constantly emanate a menacing aura while you're not incapacitated." },
      { level: 15, name: "Scornful Rebuke", description: "Those who dare to strike you are punished for their audacity." },
      { level: 20, name: "Invincible Conqueror", description: "You gain the ability to harness extraordinary martial prowess." },
    ],
  },

  // ADDITIONAL WARLOCK SUBCLASSES
  {
    id: "great-old-one",
    parentClassId: "warlock",
    name: "The Great Old One",
    description: "Your patron is a mysterious entity whose nature is utterly foreign to the fabric of reality. It might come from the Far Realm, or it could be one of the elder gods.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      { level: 1, name: "Awakened Mind", description: "You can communicate telepathically with any creature you can see within 30 feet of you." },
      { level: 6, name: "Entropic Ward", description: "You learn to magically ward yourself against attack and to turn an enemy's failed strike into good luck." },
      { level: 10, name: "Thought Shield", description: "Your thoughts can't be read by telepathy or other means unless you allow it." },
      { level: 14, name: "Create Thrall", description: "You gain the ability to infect a humanoid's mind with the alien magic of your patron." },
    ],
  },
  {
    id: "celestial",
    parentClassId: "warlock",
    name: "The Celestial",
    description: "Your patron is a powerful being of the Upper Planes. You have bound yourself to an ancient empyrean, solar, ki-rin, unicorn, or other entity.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      { level: 1, name: "Bonus Cantrips", description: "You learn the Light and Sacred Flame cantrips." },
      { level: 1, name: "Healing Light", description: "You gain the ability to channel celestial energy to heal wounds." },
      { level: 6, name: "Radiant Soul", description: "Your link to the Celestial allows you to serve as a conduit for radiant energy." },
      { level: 10, name: "Celestial Resilience", description: "You gain temporary hit points whenever you finish a short or long rest." },
      { level: 14, name: "Searing Vengeance", description: "The radiant energy you channel allows you to resist death." },
    ],
  },

  // ADDITIONAL DRUID SUBCLASSES
  {
    id: "dreams",
    parentClassId: "druid",
    name: "Circle of Dreams",
    description: "Druids who are members of the Circle of Dreams hail from regions that have strong ties to the Feywild. The druids' guardianship of the natural world makes for a natural alliance between them and good-aligned fey.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      { level: 2, name: "Balm of the Summer Court", description: "You become imbued with the blessings of the Summer Court." },
      { level: 6, name: "Hearth of Moonlight and Shadow", description: "Home can be wherever you are." },
      { level: 10, name: "Hidden Paths", description: "You can use the hidden, magical pathways of the Feywild." },
      { level: 14, name: "Walker in Dreams", description: "The magic of the Feywild grants you the ability to travel mentally or physically through dreamlands." },
    ],
  },
  {
    id: "wildfire",
    parentClassId: "druid",
    name: "Circle of Wildfire",
    description: "Druids within the Circle of Wildfire understand that destruction is sometimes the precursor of creation, such as when a forest fire promotes later growth.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      { level: 2, name: "Summon Wildfire Spirit", description: "You can summon the primal spirit bound to your soul." },
      { level: 6, name: "Enhanced Bond", description: "The bond with your wildfire spirit enhances your destructive and restorative spells." },
      { level: 10, name: "Cauterizing Flames", description: "You gain the ability to turn death into magical flames that can heal or incinerate." },
      { level: 14, name: "Blazing Revival", description: "The bond with your wildfire spirit can save you from death." },
    ],
  },

  // ADDITIONAL MONK SUBCLASSES
  {
    id: "four-elements",
    parentClassId: "monk",
    name: "Way of the Four Elements",
    description: "You follow a monastic tradition that teaches you to harness the elements. When you focus your ki, you can align yourself with the forces of creation.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      { level: 3, name: "Disciple of the Elements", description: "You learn magical disciplines that harness the power of the four elements." },
      { level: 6, name: "Extra Elemental Discipline", description: "You learn one additional elemental discipline of your choice." },
      { level: 11, name: "Extra Elemental Discipline", description: "You learn one additional elemental discipline of your choice." },
      { level: 17, name: "Extra Elemental Discipline", description: "You learn one additional elemental discipline of your choice." },
    ],
  },
  {
    id: "kensei",
    parentClassId: "monk",
    name: "Way of the Kensei",
    description: "Monks of the Way of the Kensei train relentlessly with their weapons, to the point where the weapon becomes an extension of the body.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      { level: 3, name: "Path of the Kensei", description: "You learn to extend your ki into your kensei weapons." },
      { level: 6, name: "One with the Blade", description: "You gain the ability to augment your weapons further with your ki." },
      { level: 11, name: "Sharpen the Blade", description: "You gain the ability to augment your weapons further with your ki." },
      { level: 17, name: "Unerring Accuracy", description: "Your mastery of weapons grants you extraordinary accuracy." },
    ],
  },

  // ADDITIONAL BARBARIAN SUBCLASSES
  {
    id: "zealot",
    parentClassId: "barbarian",
    name: "Path of the Zealot",
    description: "Some deities inspire their followers to pitch themselves into a ferocious battle fury. These barbarians are zealots.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      { level: 3, name: "Divine Fury", description: "You can channel divine fury into your weapon strikes." },
      { level: 3, name: "Warrior of the Gods", description: "Your soul is marked for endless battle." },
      { level: 6, name: "Fanatical Focus", description: "The divine power that fuels your rage can protect you." },
      { level: 10, name: "Zealous Presence", description: "You learn to channel divine fury to inspire zealotry in others." },
      { level: 14, name: "Rage Beyond Death", description: "The divine power that fuels your rage allows you to shrug off fatal blows." },
    ],
  },
  {
    id: "ancestral-guardian",
    parentClassId: "barbarian",
    name: "Path of the Ancestral Guardian",
    description: "Some barbarians hail from cultures that revere their ancestors. These tribes teach that the warriors of the past linger in the world as mighty spirits.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      { level: 3, name: "Ancestral Protectors", description: "Spectral warriors appear when you enter your rage." },
      { level: 6, name: "Spirit Shield", description: "The guardian spirits that aid you can provide supernatural protection to those you defend." },
      { level: 10, name: "Consult the Spirits", description: "You gain the ability to consult with your ancestral spirits." },
      { level: 14, name: "Vengeful Ancestors", description: "Your ancestral spirits grow powerful enough to retaliate." },
    ],
  },

  // ADDITIONAL RANGER SUBCLASSES
  {
    id: "gloom-stalker",
    parentClassId: "ranger",
    name: "Gloom Stalker",
    description: "Gloom Stalkers are at home in the darkest places. They venture boldly into the unknown, hunting down threats in the deepest shadows.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      { level: 3, name: "Dread Ambusher", description: "You master the art of the ambush." },
      { level: 3, name: "Umbral Sight", description: "You gain darkvision and become invisible to creatures that rely on darkvision." },
      { level: 7, name: "Iron Mind", description: "You hone your ability to resist the mind-altering powers of your prey." },
      { level: 11, name: "Stalker's Flurry", description: "You learn to attack with such unexpected speed that you can turn a miss into another strike." },
      { level: 15, name: "Shadowy Dodge", description: "You can dodge in unforeseen ways, with wisps of supernatural shadow around you." },
    ],
  },
  {
    id: "fey-wanderer",
    parentClassId: "ranger",
    name: "Fey Wanderer",
    description: "A fey mystique surrounds you, thanks to the boon of an archfey, the shining fruit you ate from a talking tree, or a midnight stroll through the Feywild.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      { level: 3, name: "Dreadful Strikes", description: "You augment your attacks with mind-scarring magic." },
      { level: 3, name: "Otherworldly Glamour", description: "Your fey qualities give you a supernatural charm." },
      { level: 7, name: "Beguiling Twist", description: "The magic of the Feywild guards your mind." },
      { level: 11, name: "Fey Reinforcements", description: "You can summon fey beings to aid you." },
      { level: 15, name: "Misty Wanderer", description: "You can slip in and out of the Feywild to move in a blink of an eye." },
    ],
  },

  // ADDITIONAL BARD SUBCLASSES
  {
    id: "glamour",
    parentClassId: "bard",
    name: "College of Glamour",
    description: "The College of Glamour is the home of bards who mastered their craft in the vibrant realm of the Feywild. These bards use their magic to delight and captivate others.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      { level: 3, name: "Mantle of Inspiration", description: "You gain the ability to weave a song of fey magic that imbues your allies with vigor." },
      { level: 3, name: "Enthralling Performance", description: "You can charge your performance with seductive fey magic." },
      { level: 6, name: "Mantle of Majesty", description: "You gain the ability to cloak yourself in a fey magic that makes others want to serve you." },
      { level: 14, name: "Unbreakable Majesty", description: "Your appearance permanently gains an otherworldly aspect that makes you look more lovely." },
    ],
  },
  {
    id: "whispers",
    parentClassId: "bard",
    name: "College of Whispers",
    description: "Most folk are happy to welcome a bard into their midst. Bards of the College of Whispers use this to their advantage. They appear to be like other bards, but they secretly excel at espionage and deception.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      { level: 3, name: "Psychic Blades", description: "You gain the ability to make your weapon attacks magically toxic to a creature's mind." },
      { level: 3, name: "Words of Terror", description: "You learn to infuse innocent-seeming words with an insidious magic." },
      { level: 6, name: "Mantle of Whispers", description: "You gain the ability to adopt a humanoid's persona." },
      { level: 14, name: "Shadow Lore", description: "You gain the ability to weave dark magic into your words." },
    ],
  },

  // ADDITIONAL SORCERER SUBCLASSES
  {
    id: "divine-soul",
    parentClassId: "sorcerer",
    name: "Divine Soul",
    description: "Sometimes the spark of magic that fuels a sorcerer comes from a divine source that glimmers within the soul.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      { level: 1, name: "Divine Magic", description: "Your link to the divine allows you to learn spells from the cleric spell list." },
      { level: 1, name: "Favored by the Gods", description: "Divine power guards your destiny." },
      { level: 6, name: "Empowered Healing", description: "The divine energy coursing through you can empower healing spells." },
      { level: 14, name: "Otherworldly Wings", description: "You can use a bonus action to manifest a pair of spectral wings from your back." },
      { level: 18, name: "Unearthly Recovery", description: "You gain the ability to overcome grievous injuries." },
    ],
  },
  {
    id: "shadow-magic",
    parentClassId: "sorcerer",
    name: "Shadow Magic",
    description: "You are a creature of shadow, for your innate magic comes from the Shadowfell itself.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      { level: 1, name: "Eyes of the Dark", description: "You have darkvision with a range of 120 feet." },
      { level: 1, name: "Strength of the Grave", description: "Your existence in a twilight state between life and death makes you difficult to defeat." },
      { level: 6, name: "Hound of Ill Omen", description: "You gain the ability to call forth a howling creature of darkness." },
      { level: 14, name: "Shadow Walk", description: "You gain the ability to step from one shadow into another." },
      { level: 18, name: "Umbral Form", description: "You can spend 6 sorcery points as a bonus action to transform yourself into a shadowy form." },
    ],
  },
];
