import { Race } from "../types/dnd-types";

export const species: Race[] = [
  {
    "id": "aarakocra-1",
    "name": "Aarakocra",
    "description": "Many people across Wildemount consider the winged aarakocra to be a myth, so infrequently do they descend from their lofty aeries to deal with wingless folk. Where they are known, the aarakocra rarely engage with the land-bound societies of Wildemount, though some take great pleasure in traveling on the open ocean with Concord sailors and Revelry pirates. Some legends say that Melora the Wild Mother created the aarakocra as storm herders who drive the clouds across the sky, and some aarakocra tribes play a sport called h’aara-shie , or “cloud chasing,” that reflects this ancient tale.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "DEX": 2,
      "WIS": 1
    },
    "size": "Medium",
    "speed": 25,
    "traits": [
      {
        name: "Flight",
        description: "You have a flying speed of 50 feet. To use this speed, you can't be wearing medium or heavy armor."
      },
      {
        name: "Talons",
        description: "Your talons are natural weapons, which you can use to make unarmed strikes. If you hit with them, you deal slashing damage equal to 1d4 + your Strength modifier, instead of the bludgeoning damage normal for an unarmed strike."
      }
    ],
    "languages": [
      "Aarakocra",
      "Auran",
      "Common"
    ]
  },
  {
    "id": "aasimar",
    "name": "Aasimar",
    "description": "Whereas tieflings have fiendish blood in their veins, aasimar are the descendants of celestial beings. These folk generally appear as glorious humans with lustrous hair, flawless skin, and piercing eyes. Aasimar often attempt to pass as humans in order to right wrongs and defend goodness on the Material Plane without drawing undue attention to their celestial heritage. They strive to fit into society, although they usually rise to the top, becoming revered leaders and honorable heroes.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Dungeon Master's Guide",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "WIS": 1,
      "CHA": 2
    },
    "size": "Medium",
    "speed": 30,
    "traits": [
      {
        name: "Darkvision",
        description: "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray."
      },
      {
        name: "Resistance",
        description: "You have resistance to necrotic damage and radiant damage."
      },
      {
        name: "Celestial Legacy",
        description: "You know the light cantrip. Once you reach 3rd level, you can cast the lesser restoration spell once with this trait, and you regain the ability to do so when you finish a long rest. Once you reach 5th level, you can cast the daylight spell once with this trait as a 3rd-level spell, and you regain the ability to do so when you finish a long rest. Charisma is your spellcasting ability for these spells."
      },
      {
        name: "Celestial Resistance",
        description: "You have resistance to necrotic damage and radiant damage."
      }
    ],
    "languages": [
      "Common",
      "Celestial"
    ]
  },
  {
    "id": "aasimar-1",
    "name": "Aasimar",
    "description": "Aasimar bear within their souls the light of the heavens. They are descended from humans with a touch of the power of Mount Celestia, the divine realm of many lawful good deities. Aasimar are born to serve as champions of the gods, their births hailed as blessed events. They are a people of otherworldly visages, with luminous features that reveal their celestial heritage.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "CHA": 2,
      "WIS": 1,
      "CON": 1,
      "STR": 1
    },
    "size": "Medium",
    "speed": 30,
    "traits": [
      {
        name: "Darkvision",
        description: "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray."
      },
      {
        name: "Radiant Soul",
        description: "Starting at 3rd level, you can use your action to unleash the divine energy within yourself, causing your eyes to glimmer and two luminous, incorporeal wings to sprout from your back. Your transformation lasts for 1 minute or until you end it as a bonus action. During it, you have a flying speed of 30 feet, and once on each of your turns, you can deal extra radiant damage to one target when you deal damage to it with an attack or a spell. The extra radiant damage equals your level."
      },
      {
        name: "Light Bearer",
        description: "You know the Light cantrip. Charisma is your spellcasting ability for it."
      },
      {
        name: "Necrotic Shroud",
        description: "Starting at 3rd level, you can use your action to unleash the divine energy within yourself, causing your eyes to turn into pools of darkness and two skeletal, ghostly, flightless wings to sprout from your back. The instant you transform, other creatures within 10 feet of you that can see you must each succeed on a Charisma saving throw (DC 8 + your proficiency bonus + your Charisma modifier) or become frightened of you until the end of your next turn. Your transformation lasts for 1 minute or until you end it as a bonus action. During it, once on each of your turns, you can deal extra necrotic damage to one target when you deal damage to it with an attack or a spell. The extra necrotic damage equals your level."
      },
      {
        name: "Radiant Consumption",
        description: "Starting at 3rd level, you can use your action to unleash the divine energy within yourself, causing a searing light to radiate from you, pour out of your eyes and mouth, and threaten to char you. Your transformation lasts for 1 minute or until you end it as a bonus action. During it, you shed bright light in a 10-foot radius and dim light for an additional 10 feet, and at the end of each of your turns, you and each creature within 10 feet of you take radiant damage equal to half your level (rounded up). In addition, once on each of your turns, you can deal extra radiant damage to one target when you deal damage to it with an attack or a spell. The extra radiant damage equals your level."
      },
      {
        name: "Healing Hands",
        description: "As an action, you can touch a creature and cause it to regain a number of hit points equal to your level. Once you use this trait, you can't use it again until you finish a long rest."
      },
      {
        name: "Resistance",
        description: "You have resistance to necrotic damage and radiant damage."
      },
      {
        name: "Celestial Resistance",
        description: "You have resistance to necrotic damage and radiant damage."
      }
    ],
    "languages": [
      "Common",
      "Celestial"
    ]
  },
  {
    "id": "aasimar-3",
    "name": "Aasimar",
    "description": "The light of the gods still shines upon Exandria, even from behind the Divine Gate. Aasimar are the purest expression of that divine light as it burns within every mortal soul, for the souls of those blessed with an angelic ancestor blaze brighter than any other. Even rarer than the tieflings with whom they share a commonality of ancestry, aasimar are mortal, and yet are understood to be destined for a grander cosmic purpose than others around them.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "CHA": 2
    },
    "size": "Medium",
    "speed": 30,
    "traits": [
      {
        name: "Darkvision",
        description: "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray."
      },
      {
        name: "Light Bearer",
        description: "You know the Light cantrip. Charisma is your spellcasting ability for it."
      },
      {
        name: "Healing Hands",
        description: "As an action, you can touch a creature and cause it to regain a number of hit points equal to your level. Once you use this trait, you can't use it again until you finish a long rest."
      },
      {
        name: "Resistance",
        description: "You have resistance to necrotic damage and radiant damage."
      },
      {
        name: "Celestial Resistance",
        description: "You have resistance to necrotic damage and radiant damage."
      }
    ],
    "languages": [
      "Common"
    ]
  },
  {
    "id": "bugbear",
    "name": "Bugbear",
    "description": "Bugbears are hairy goblinoids born for battle and mayhem. They survive by raiding and hunting, but they are fond of setting ambushes and fleeing when outmatched. Their bodies are covered in coarse hair, ranging from brown to brick red, and they have sharp claws and teeth. Despite their formidable build, bugbears are surprisingly stealthy.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "STR": 2,
      "DEX": 1
    },
    "size": "Medium",
    "speed": 30,
    "traits": [
      {
        name: "Darkvision",
        description: "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray."
      },
      {
        name: "Surprise Attack",
        description: "If you surprise a creature and hit it with an attack on your first turn in combat, the attack deals an extra 2d6 damage to it. You can use this trait only once per combat."
      },
      {
        name: "Powerful Build",
        description: "You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift."
      }
    ],
    "languages": [
      "Common",
      "Goblin"
    ]
  },
  {
    "id": "bugbear-2",
    "name": "Bugbear",
    "description": "Though bugbears are generally viewed with disdain by the folk of the Dwendalian Empire and the Menagerie Coast, the Kryn Dynasty has welcomed them into the fold. The bugbears\u2019 monstrous strength and silent movement make them excellent shock troops in the war against the empire, and their sincere pragmatism fits in well with the followers of the Luxon.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "STR": 2,
      "DEX": 1
    },
    "size": "Medium",
    "speed": 30,
    "traits": [
      {
        name: "Darkvision",
        description: "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray."
      },
      {
        name: "Surprise Attack",
        description: "If you surprise a creature and hit it with an attack on your first turn in combat, the attack deals an extra 2d6 damage to it. You can use this trait only once per combat."
      },
      {
        name: "Powerful Build",
        description: "You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift."
      }
    ],
    "languages": [
      "Common",
      "Goblin"
    ]
  },
  {
    "id": "centaur",
    "name": "Centaur",
    "description": "A centaur has the body of a great horse topped by a humanoid torso, head, and arms. Reclusive wanderers and omen-readers of the wild, centaurs avoid conflict but fight fiercely when pressed. They roam the semi-arid Paleo-pampas in the Karkk region of the Guildmasters\u2019 Guide to Ravnica setting.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Guildmasters' Guide to Ravnica",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "STR": 2,
      "WIS": 1
    },
    "size": "Medium",
    "speed": 40,
    "traits": [
      {
        name: "Fey Ancestry",
        description: "You have advantage on saving throws against being charmed, and magic can't put you to sleep."
      },
      {
        name: "Charge",
        description: "If you move at least 30 feet straight toward a target and then hit it with a melee weapon attack on the same turn, you can immediately follow that attack with a bonus action to make one attack against the target with your hooves."
      }
    ],
    "languages": [
      "Common",
      "Sylvan"
    ]
  },
  {
    "id": "centaur-1",
    "name": "Centaur",
    "description": "Centaurs gallop throughout the multiverse and trace their origins to many different realms. The centaurs of Theros, for example, are known to be children of the sun god, Heliod. Centaurs have the upper bodies, down to the waist, of muscular humans, displaying all the human variety of skin tones and features. Their ears are slightly pointed, but their faces are wider and squarer than those of elves. Below the waist, they have the bodies of horses, with coats ranging from chestnut brown to slate gray or pitch black.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "STR": 2,
      "WIS": 1
    },
    "size": "Medium",
    "speed": 40,
    "traits": [
      {
        name: "Fey Ancestry",
        description: "You have advantage on saving throws against being charmed, and magic can't put you to sleep."
      },
      {
        name: "Charge",
        description: "If you move at least 30 feet straight toward a target and then hit it with a melee weapon attack on the same turn, you can immediately follow that attack with a bonus action to make one attack against the target with your hooves."
      }
    ],
    "languages": [
      "Common",
      "Sylvan"
    ]
  },
  {
    "id": "changeling",
    "name": "Changeling",
    "description": "Changelings are subtle shapeshifters capable of disguising their appearance. They evolved from doppelgangers and eventually became their own distinct race. Their ability to adopt other forms makes them consummate spies and criminals.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Eberron: Rising from the Last War",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "CHA": 2
    },
    "size": "Medium",
    "speed": 30,
    "traits": [
      {
        name: "Shapechanger",
        description: "As an action, you can change your appearance and your voice. You determine the specifics of the changes, including your coloration, hair length, and sex. You can also adjust your height and weight, but not so much that your size changes. You can make yourself appear as a member of another race, though none of your game statistics change. You can't duplicate the appearance of a creature you've never seen, and you must adopt a form that has the same basic arrangement of limbs that you have. Your clothing and equipment aren't changed by this trait. You stay in the new form until you use an action to revert to your true form or until you die."
      }
    ],
    "languages": [
      "Common"
    ]
  },
  {
    "id": "dragonborn",
    "name": "Dragonborn",
    "description": "Born of dragons, as their name proclaims, the dragonborn walk proudly through a world that greets them with fearful incomprehension. Shaped by draconic gods or the dragons themselves, dragonborn originally hatched from dragon eggs as a unique race, combining the best attributes of dragons and humanoids. Some dragonborn are faithful servants to true dragons, others form the ranks of soldiers in great wars, and still others find themselves adrift, with no clear calling in life.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Player's Handbook",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "STR": 2,
      "CHA": 1
    },
    "size": "Medium",
    "speed": 30,
    "traits": [
      {
        name: "Resistance",
        description: "You have resistance to the damage type associated with your draconic ancestry."
      },
      {
        name: "Breath Weapon",
        description: "You can use your action to exhale destructive energy."
      },
      {
        name: "Damage Resistance",
        description: "You have resistance to the damage type associated with your ancestry."
      }
    ],
    "languages": [
      "Common",
      "Draconic"
    ]
  },
  {
    "id": "dragonborn-2",
    "name": "Dragonborn",
    "description": "Draconians are the dragonborn of the Dragonlance setting. Created from the eggs of metallic dragons, draconians were bred to be super soldiers for the Dragon Armies. They are reptilian humanoids with scales, snouts, and tails. There are five types of draconians, each corresponding to a metallic dragon type: baaz (brass), kapak (copper), bozak (bronze), sivak (silver), and aurak (gold).",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "STR": 2,
      "CHA": 1
    },
    "size": "Medium",
    "speed": 30,
    "traits": [
      {
        name: "Resistance",
        description: "You have resistance to the damage type associated with your draconic ancestry."
      },
      {
        name: "Breath Weapon",
        description: "You can use your action to exhale destructive energy."
      },
      {
        name: "Damage Resistance",
        description: "You have resistance to the damage type associated with your ancestry."
      }
    ],
    "languages": [
      "Common",
      "Draconic"
    ]
  },
  {
    "id": "dwarf",
    "name": "Dwarf",
    "description": "Bold and hardy, dwarves are known as skilled warriors, miners, and workers of stone and metal. Though they stand well under 5 feet tall, dwarves are so broad and compact that they can weigh as much as a human standing nearly two feet taller. Their courage and endurance are also easily a match for any of the larger folk.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Player's Handbook",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "CON": 2
    },
    "size": "Medium",
    "speed": 25,
    "traits": [
      {
        name: "Darkvision",
        description: "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray."
      },
      {
        name: "Stonecunning",
        description: "Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient in the History skill and add double your proficiency bonus to the check."
      },
      {
        name: "Dwarven Resilience",
        description: "You have advantage on saving throws against poison, and you have resistance against poison damage."
      },
      {
        name: "Dwarven Combat Training",
        description: "You have proficiency with the battleaxe, handaxe, light hammer, and warhammer."
      }
    ],
    "languages": [
      "Common",
      "Dwarvish"
    ]
  },
  {
    "id": "elf",
    "name": "Elf",
    "description": "Elves are a magical people of otherworldly grace, living in the world but not entirely part of it. They live in places of ethereal beauty, in the midst of ancient forests or in silvery spires glittering with faerie light, where soft music drifts through the air and gentle fragrances waft on the breeze. Elves love nature and magic, art and artistry, music and poetry, and the good things of the world.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Player's Handbook",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "DEX": 2
    },
    "size": "Medium",
    "speed": 30,
    "traits": [
      {
        name: "Darkvision",
        description: "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray."
      },
      {
        name: "Fey Ancestry",
        description: "You have advantage on saving throws against being charmed, and magic can't put you to sleep."
      },
      {
        name: "Trance",
        description: "Elves don't need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day."
      },
      {
        name: "Keen Senses",
        description: "You have proficiency in the Perception skill."
      }
    ],
    "languages": [
      "Common",
      "Elvish"
    ]
  },
  {
    "id": "firbolg",
    "name": "Firbolg",
    "description": "Firbolg tribes cloister in remote forest strongholds, preferring to spend their days in quiet harmony with the woods. When provoked, firbolgs demonstrate formidable skills with weapons and druidic magic.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "WIS": 2,
      "STR": 1
    },
    "size": "Medium",
    "speed": 30,
    "traits": [
      {
        name: "Speech of Beast and Leaf",
        description: "You have the ability to communicate in a limited manner with beasts and plants. They can understand the meaning of your words, though you have no special ability to understand them in return. You have advantage on all Charisma checks you make to influence them."
      },
      {
        name: "Firbolg Magic",
        description: "You can cast detect magic and disguise self with this trait, using Wisdom as your spellcasting ability for them. Once you cast either spell, you can't cast it again with this trait until you finish a short or long rest. When you use this version of disguise self, you can seem up to 3 feet shorter than you are, allowing you to more easily blend in with humans and elves."
      },
      {
        name: "Hidden Step",
        description: "As a bonus action, you can magically turn invisible until the start of your next turn or until you attack, make a damage roll, or force someone to make a saving throw. Once you use this trait, you can't use it again until you finish a short or long rest."
      },
      {
        name: "Powerful Build",
        description: "You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift."
      }
    ],
    "languages": [
      "Common",
      "Elvish",
      "Giant"
    ]
  },
  {
    "id": "firbolg-2",
    "name": "Firbolg",
    "description": "The forests of the Greying Wildlands are home to the largest populations of firbolgs in Wildemount. These reclusive forest guardians live in harmony with the natural world, and they are often the first to notice when something is amiss in the ecosystem. Firbolgs are also found in the Savalirwood and the Quoraska Jungle, though in smaller numbers.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "WIS": 2,
      "STR": 1
    },
    "size": "Medium",
    "speed": 30,
    "traits": [
      {
        name: "Speech of Beast and Leaf",
        description: "You have the ability to communicate in a limited manner with beasts and plants. They can understand the meaning of your words, though you have no special ability to understand them in return. You have advantage on all Charisma checks you make to influence them."
      },
      {
        name: "Firbolg Magic",
        description: "You can cast detect magic and disguise self with this trait, using Wisdom as your spellcasting ability for them. Once you cast either spell, you can't cast it again with this trait until you finish a short or long rest. When you use this version of disguise self, you can seem up to 3 feet shorter than you are, allowing you to more easily blend in with humans and elves."
      },
      {
        name: "Hidden Step",
        description: "As a bonus action, you can magically turn invisible until the start of your next turn or until you attack, make a damage roll, or force someone to make a saving throw. Once you use this trait, you can't use it again until you finish a short or long rest."
      },
      {
        name: "Powerful Build",
        description: "You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift."
      }
    ],
    "languages": [
      "Common",
      "Elvish",
      "Giant"
    ]
  },
  {
    "id": "genasi-air",
    "name": "Genasi (Air)",
    "description": "Air genasi are descended from djinn, the genies of the Elemental Plane of Air. Embodying many of the airy traits of their otherworldly ancestors, air genasi can draw upon their connection to the winds.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "CON": 2,
      "DEX": 1
    },
    "racialKnownSpells": [
      { "level": 1, "spellId": "shocking-grasp", "abilityScore": "CON", "type": "at-will" },
      { "level": 3, "spellId": "feather-fall", "abilityScore": "CON", "type": "1/day" },
      { "level": 5, "spellId": "levitate", "abilityScore": "CON", "type": "1/day" }
    ],
    "size": "Medium",
    "speed": 30,
    "traits": [
      {
        name: "Unending Breath",
        description: "You can hold your breath indefinitely while you're not incapacitated."
      },
      {
        name: "Mingle with the Wind",
        description: "You can cast the levitate spell once with this trait, requiring no material components, and you regain the ability to cast it this way when you finish a long rest. Constitution is your spellcasting ability for this spell."
      }
    ],
    "languages": [
      "Common",
      "Primordial"
    ]
  },
  {
    "id": "genasi-earth",
    "name": "Genasi (Earth)",
    "description": "Earth genasi are descended from the cruel and greedy dao, though they aren\u2019t evil by nature. They inherit some measure of control over earth, reveling in superior strength and solid power.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "CON": 2,
      "STR": 1
    },
    "racialKnownSpells": [
      { "level": 1, "spellId": "blade-ward", "abilityScore": "CON", "type": "at-will" },
      { "level": 5, "spellId": "pass-without-trace", "abilityScore": "CON", "type": "1/day" }
    ],
    "size": "Medium",
    "speed": 30,
    "traits": [
      {
        name: "Earth Walk",
        description: "You can move across difficult terrain made of earth or stone without expending extra movement."
      },
      {
        name: "Merge with Stone",
        description: "You can cast the pass without trace spell once with this trait, requiring no material components, and you regain the ability to cast it this way when you finish a long rest. Constitution is your spellcasting ability for this spell."
      }
    ],
    "languages": [
      "Common",
      "Primordial"
    ]
  },
  {
    "id": "genasi-fire",
    "name": "Genasi (Fire)",
    "description": "Fire genasi are descended from efreet, the genies of the Elemental Plane of Fire. They inherit the volatile mood and destructive power of their ancestors.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "CON": 2,
      "INT": 1
    },
    "racialKnownSpells": [
      { "level": 1, "spellId": "produce-flame", "abilityScore": "CON", "type": "at-will" },
      { "level": 3, "spellId": "burning-hands", "abilityScore": "CON", "type": "1/day" },
      { "level": 5, "spellId": "flame-blade", "abilityScore": "CON", "type": "1/day" }
    ],

    "size": "Medium",
    "speed": 30,
    "traits": [
      {
        name: "Darkvision",
        description: "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray."
      },
      {
        name: "Reach to the Blaze",
        description: "You know the produce flame cantrip. When you reach 3rd level, you can cast the burning hands spell once with this trait as a 1st-level spell, and you regain the ability to cast it this way when you finish a long rest. Constitution is your spellcasting ability for these spells."
      },
      {
        name: "Resistance",
        description: "You have resistance to acid damage."
      }
    ],
    "languages": [
      "Common",
      "Primordial"
    ]
  },
  {
    "id": "genasi-water",
    "name": "Genasi (Water)",
    "description": "Water genasi are descended from marids, the genies of the Elemental Plane of Water. They are most comfortable in the water and have some control over it.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "CON": 2,
      "WIS": 1
    },
    "racialKnownSpells": [
      { "level": 1, "spellId": "acid-splash", "abilityScore": "CON", "type": "at-will" },
      { "level": 3, "spellId": "create-or-destroy-water", "abilityScore": "CON", "type": "1/day" },
      { "level": 5, "spellId": "water-walk", "abilityScore": "CON", "type": "1/day" }
    ],
    "size": "Medium",
    "speed": 30,
    "traits": [
      {
        name: "Resistance",
        description: "You have resistance to acid damage."
      },
      {
        name: "Call to the Wave",
        description: "You know the shape water cantrip. When you reach 3rd level, you can cast the create or destroy water spell as a 2nd-level spell once with this trait, and you regain the ability to cast it this way when you finish a long rest. Constitution is your spellcasting ability for these spells."
      },
      {
        name: "Amphibious",
        description: "You can breathe air and water."
      }
    ],
    "languages": [
      "Common",
      "Primordial"
    ]
  },
  {
    "id": "gnome",
    "name": "Gnome",
    "description": "A constant hum of busy activity pervades the warrens and neighborhoods where gnomes form their close-knit communities. Louder sounds punctuate the hum: a crunch of grinding gears here, a minor explosion there, a yelp of surprise or triumph, and especially bursts of laughter. Gnomes take delight in life, enjoying every moment of invention, exploration, investigation, creation, and play.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Player's Handbook",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "INT": 2
    },
    "size": "Small",
    "speed": 25,
    "traits": [
      {
        name: "Darkvision",
        description: "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray."
      },
      {
        name: "Gnome Cunning",
        description: "You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic."
      }
    ],
    "languages": [
      "Common",
      "Gnomish"
    ]
  },
  {
    "id": "goblin",
    "name": "Goblin",
    "description": "Goblins are small, black-hearted humanoids that lair in despoiled dungeons and other dismal settings. Individually weak, they gather in large numbers to torment other creatures.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "DEX": 2,
      "CON": 1
    },
    "size": "Small",
    "speed": 30,
    "traits": [
      {
        name: "Darkvision",
        description: "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray."
      },
      {
        name: "Nimble Escape",
        description: "You can take the Disengage or Hide action as a bonus action on each of your turns."
      },
      {
        name: "Fury of the Small",
        description: "When you damage a creature with an attack or a spell and the creature's size is larger than yours, you can cause the attack or spell to deal extra damage to the creature. The extra damage equals your level. Once you use this trait, you can't use it again until you finish a short or long rest."
      }
    ],
    "languages": [
      "Common",
      "Goblin"
    ]
  },
  {
    "id": "goblin-2",
    "name": "Goblin",
    "description": "Many goblins on the continent of Wildemount have been freed from the curse of Strife, which makes them violent and cruel. These goblins are known as the Dranassar, and they are a peaceful people who live in harmony with nature.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "DEX": 2,
      "CON": 1
    },
    "size": "Small",
    "speed": 30,
    "traits": [
      {
        name: "Darkvision",
        description: "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray."
      },
      {
        name: "Nimble Escape",
        description: "You can take the Disengage or Hide action as a bonus action on each of your turns."
      },
      {
        name: "Fury of the Small",
        description: "When you damage a creature with an attack or a spell and the creature's size is larger than yours, you can cause the attack or spell to deal extra damage to the creature. The extra damage equals your level. Once you use this trait, you can't use it again until you finish a short or long rest."
      }
    ],
    "languages": [
      "Common",
      "Goblin"
    ]
  },
  {
    "id": "goliath",
    "name": "Goliath",
    "description": "Goliaths are massive, mountain-dwelling people who are known for their strength and endurance. They are often found in the highest peaks of the world, where they live in tribes and compete in contests of strength and skill.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "STR": 2,
      "CON": 1
    },
    "size": "Medium",
    "speed": 30,
    "traits": [
      {
        name: "Stone's Endurance",
        description: "You can focus yourself to occasionally shrug off injury. When you take damage, you can use your reaction to roll a d12. Add your Constitution modifier to the number rolled, and reduce the damage by that total. After you use this trait, you can't use it again until you finish a short or long rest."
      },
      {
        name: "Powerful Build",
        description: "You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift."
      },
      {
        name: "Mountain Born",
        description: "You have resistance to cold damage. You're also acclimated to high altitude, including elevations above 20,000 feet."
      },
      {
        name: "Natural Athlete",
        description: "You have proficiency in the Athletics skill."
      }
    ],
    "languages": [
      "Common",
      "Giant"
    ]
  },
  {
    "id": "goliath-2",
    "name": "Goliath",
    "description": "Goliaths are massive, mountain-dwelling people who are known for their strength and endurance. They are often found in the highest peaks of the world, where they live in tribes and compete in contests of strength and skill.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "STR": 2,
      "CON": 1
    },
    "size": "Medium",
    "speed": 30,
    "traits": [
      {
        name: "Stone's Endurance",
        description: "You can focus yourself to occasionally shrug off injury. When you take damage, you can use your reaction to roll a d12. Add your Constitution modifier to the number rolled, and reduce the damage by that total. After you use this trait, you can't use it again until you finish a short or long rest."
      },
      {
        name: "Powerful Build",
        description: "You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift."
      },
      {
        name: "Mountain Born",
        description: "You have resistance to cold damage. You're also acclimated to high altitude, including elevations above 20,000 feet."
      },
      {
        name: "Natural Athlete",
        description: "You have proficiency in the Athletics skill."
      }
    ],
    "languages": [
      "Common",
      "Giant"
    ]
  },
  {
    "id": "half-elf",
    "name": "Half-Elf",
    "description": "Walking in two worlds but truly belonging to neither, half-elves combine what some say are the best qualities of their elf and human parents: human curiosity, inventiveness, and ambition tempered by the refined senses, love of nature, and artistic tastes of the elves. Some half-elves live among humans, set apart by their emotional and physical differences, watching friends and loved ones age while time barely touches them. Others live with the elves, growing restless as they reach adulthood in the timeless elven realms, while their peers continue to live as children. Many half-elves, unable to fit into either society, choose lives of wandering adventure or join other misfits and outcasts in the adventuring life.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Player's Handbook",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "CHA": 2
    },
    "size": "Medium",
    "speed": 30,
    "traits": [
      {
        name: "Darkvision",
        description: "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray."
      },
      {
        name: "Fey Ancestry",
        description: "You have advantage on saving throws against being charmed, and magic can't put you to sleep."
      }
    ],
    "subraces": [
      "half-elf-standard",
      "half-elf-high-variant"
    ],
    "languages": [
      "Common",
      "Elvish"
    ]
  },
  {
    "id": "half-orc",
    "name": "Half-Orc",
    "description": "Whether united under the leadership of a mighty warlock or having fought to a standstill after years of conflict, orc and human tribes sometimes form alliances, joining forces into a larger horde to the terror of civilized lands nearby. When these alliances are sealed by marriages, half-orcs are born. Some half-orcs rise to become proud chiefs of orc tribes, their human blood giving them an edge over their full-blooded orc rivals. Some venture into the world to prove their worth among humans and other more civilized races. Many of these become adventurers, achieving greatness for their mighty deeds and notoriety for their barbaric customs and savage fury.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Player's Handbook",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "STR": 2,
      "CON": 1
    },
    "size": "Medium",
    "speed": 30,
    "traits": [
      {
        name: "Darkvision",
        description: "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray."
      },
      {
        name: "Savage Attacks",
        description: "When you score a critical hit with a melee weapon attack, you can roll one of the weapon's damage dice one additional time and add it to the extra damage of the critical hit."
      },
      {
        name: "Menacing",
        description: "You gain proficiency in the Intimidation skill."
      },
      {
        name: "Relentless Endurance",
        description: "When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. You can't use this feature again until you finish a long rest."
      }
    ],
    "languages": [
      "Common",
      "Orc"
    ]
  },
  {
    "id": "halfling",
    "name": "Halfling",
    "description": "The comforts of home are the goals of most halflings\u2019 lives: a place to settle in peace and quiet, far from marauding monsters and clashing armies; a blazing fire and a generous meal; fine drink and fine conversation. Though some halflings live out their days in remote agricultural communities, others form nomadic bands that travel constantly, lured by the open road and the wide horizon to discover the wonders of new lands and peoples. But even these wanderers love peace, food, hearth, and home, though home might be a wagon jostling along an dirt road or a raft floating downriver.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Player's Handbook",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "DEX": 2
    },
    "size": "Small",
    "speed": 25,
    "traits": [
      {
        name: "Lucky",
        description: "When you roll a 1 on the d20 for an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll."
      },
      {
        name: "Brave",
        description: "You have advantage on saving throws against being frightened."
      },
      {
        name: "Nimbleness",
        description: "You can move through the space of any creature that is of a size larger than yours."
      },
      {
        name: "Halfling Nimbleness",
        description: "You can move through the space of any creature that is of a size larger than yours."
      }
    ],
    "languages": [
      "Common",
      "Halfling"
    ]
  },
  {
    "id": "hobgoblin",
    "name": "Hobgoblin",
    "description": "War is the lifeblood of hobgoblins. Their glories are the glories of battle, their achievements the achievements of war. Hobgoblins are disciplined, martial people who live for conquest and domination.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "CON": 2,
      "INT": 1
    },
    "size": "Medium",
    "speed": 30,
    "traits": [
      {
        name: "Darkvision",
        description: "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray."
      },
      {
        name: "Saving Face",
        description: "Hobgoblins are careful not to show weakness in front of their allies, for fear of losing status. If you miss with an attack roll or fail an ability check or a saving throw, you can gain a bonus to the roll equal to the number of allies you can see within 30 feet of you (maximum bonus of +5). Once you use this trait, you can't use it again until you finish a short or long rest."
      },
      {
        name: "Martial Training",
        description: "You are proficient with two martial weapons of your choice and with light armor."
      }
    ],
    "languages": [
      "Common",
      "Goblin"
    ]
  },
  {
    "id": "hobgoblin-2",
    "name": "Hobgoblin",
    "description": "The hobgoblins of the Dwendalian Empire have long been at odds with the imperial military, but the Kryn Dynasty has welcomed them with open arms. Hobgoblins are known for their discipline and martial prowess, and they make excellent soldiers and tacticians.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "CON": 2,
      "INT": 1
    },
    "size": "Medium",
    "speed": 30,
    "traits": [
      {
        name: "Darkvision",
        description: "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray."
      },
      {
        name: "Saving Face",
        description: "Hobgoblins are careful not to show weakness in front of their allies, for fear of losing status. If you miss with an attack roll or fail an ability check or a saving throw, you can gain a bonus to the roll equal to the number of allies you can see within 30 feet of you (maximum bonus of +5). Once you use this trait, you can't use it again until you finish a short or long rest."
      },
      {
        name: "Martial Training",
        description: "You are proficient with two martial weapons of your choice and with light armor."
      }
    ],
    "languages": [
      "Common",
      "Goblin"
    ]
  },
  {
    "id": "human",
    "name": "Human",
    "description": "Humans are the most adaptable and ambitious people among the common races. They have widely varying tastes, morals, and customs in the many different lands where they have settled. When they settle, though, they stay: they build cities to last for the ages, and great kingdoms that can persist for long centuries. An individual human might have a relatively short life span, but a human nation or culture preserves traditions with origins far beyond the reach of any single human\u2019s memory. They live fully in the present\u2014making them well suited to the adventuring life\u2014but also plan for the future, striving to leave a lasting legacy. Individually and as a group, humans are adaptable opportunists, and they stay alert to changing political and social dynamics.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Player's Handbook",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "STR": 1,
      "DEX": 1,
      "CON": 1,
      "INT": 1,
      "WIS": 1,
      "CHA": 1
    },
    "size": "Medium",
    "speed": 30,
    "traits": [],
    "languages": [
      "Common"
    ]
  },
  {
    "id": "kenku",
    "name": "Kenku",
    "description": "Haunted by an ancient crime that robbed them of their wings, the kenku wander the world as vagabonds and burglars who live at the edge of human society. Kenku suffer from a sinister reputation that is not wholly unearned, but they can prove to be valuable allies.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "DEX": 2,
      "WIS": 1
    },
    "size": "Medium",
    "speed": 30,
    "traits": [
      {
        name: "Expert Forgery",
        description: "You can duplicate other creatures' handwriting and craftwork. You have advantage on all checks made to produce forgeries or duplicates of existing objects."
      },
      {
        name: "Kenku Training",
        description: "You are proficient in your choice of two of the following skills: Acrobatics, Deception, Stealth, and Sleight of Hand."
      },
      {
        name: "Mimicry",
        description: "You can mimic sounds you have heard, including voices. A creature that hears the sounds you make can tell they are imitations with a successful Wisdom (Insight) check opposed by your Charisma (Deception) check."
      }
    ],
    "languages": [
      "Common",
      "Auran"
    ]
  },
  {
    "id": "kenku-2",
    "name": "Kenku",
    "description": "Kenku are avian humanoids found in many of the cities of the Dwendalian Empire and the Menagerie Coast. They are often employed by criminal syndicates as thieves, scouts, and spies, though many make an honest living as artisans and scribes.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "DEX": 2,
      "WIS": 1
    },
    "size": "Medium",
    "speed": 30,
    "traits": [
      {
        name: "Expert Forgery",
        description: "You can duplicate other creatures' handwriting and craftwork. You have advantage on all checks made to produce forgeries or duplicates of existing objects."
      },
      {
        name: "Kenku Training",
        description: "You are proficient in your choice of two of the following skills: Acrobatics, Deception, Stealth, and Sleight of Hand."
      },
      {
        name: "Mimicry",
        description: "You can mimic sounds you have heard, including voices. A creature that hears the sounds you make can tell they are imitations with a successful Wisdom (Insight) check opposed by your Charisma (Deception) check."
      }
    ],
    "languages": [
      "Common",
      "Auran"
    ]
  },
  {
    "id": "lizardfolk",
    "name": "Lizardfolk",
    "description": "Lizardfolk possess an alien and inscrutable mindset, their desires and thoughts driven by a different set of basic principles than those of warm-blooded creatures. Their dismal swamp homes might lie hundreds of miles from the nearest human settlement, but the gap between their way of thinking and that of the smooth-skins is far greater.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "CON": 2,
      "WIS": 1
    },
    "size": "Medium",
    "speed": 30,
    "traits": [
      {
        name: "Bite",
        description: "Your fanged maw is a natural weapon, which you can use to make unarmed strikes. If you hit with it, you deal piercing damage equal to 1d6 + your Strength modifier, instead of the bludgeoning damage normal for an unarmed strike."
      },
      {
        name: "Cunning Artisan",
        description: "As part of a short rest, you can harvest bone and hide from a slain beast, construct, dragon, monstrosity, or plant creature of size Small or larger to create one of the following items: a shield, a club, a javelin, or 1d4 darts or blowgun needles. To use this trait, you need a blade, such as a dagger, or appropriate artisan's tools, such as leatherworker's tools."
      },
      {
        name: "Hold Breath",
        description: "You can hold your breath for up to 15 minutes at a time."
      },
      {
        name: "Hunter's Lore",
        description: "You gain proficiency with two of the following skills of your choice: Animal Handling, Nature, Perception, Stealth, and Survival."
      },
      {
        name: "Natural Armor",
        description: "You have tough, scaly skin. When you aren't wearing armor, your AC is 13 + your Dexterity modifier. You can use your natural armor to determine your AC if the armor you wear would leave you with a lower AC. A shield's benefits apply as normal while you use your natural armor."
      },
      {
        name: "Hungry Jaws",
        description: "In battle, you can throw yourself into a vicious feeding frenzy. As a bonus action, you can make a special attack with your bite. If the attack hits, it deals its normal damage, and you gain temporary hit points (minimum of 1) equal to your Constitution modifier. You can use this trait a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest."
      }
    ],
    "languages": [
      "Common",
      "Draconic"
    ]
  },
  {
    "id": "orc",
    "name": "Orc",
    "description": "Orcs are savage humanoids with stooped postures, piggish faces, and prominent teeth that resemble tusks. They gather in tribes that satisfy their bloodlust by slaying any humanoids that stand against them.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "STR": 2,
      "CON": 1
    },
    "size": "Medium",
    "speed": 30,
    "traits": [
      {
        name: "Darkvision",
        description: "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray."
      },
      {
        name: "Aggressive",
        description: "As a bonus action, you can move up to your speed toward an enemy of your choice that you can see or hear. You must end this move closer to the enemy than you started."
      },
      {
        name: "Primal Intuition",
        description: "You have proficiency in two of the following skills of your choice: Animal Handling, Insight, Intimidation, Medicine, Nature, Perception, and Survival."
      },
      {
        name: "Powerful Build",
        description: "You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift."
      }
    ],
    "languages": [
      "Common",
      "Orc"
    ]
  },
  {
    "id": "orc-3",
    "name": "Orc",
    "description": "The orcs of Wildemount are a diverse people with a complex history. Many orcs live in the clans of Xhorhas, where they are valued members of the Kryn Dynasty. Others live in the Dwendalian Empire or the Menagerie Coast, where they often face prejudice and discrimination.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "STR": 2,
      "CON": 1
    },
    "size": "Medium",
    "speed": 30,
    "traits": [
      {
        name: "Darkvision",
        description: "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray."
      },
      {
        name: "Aggressive",
        description: "As a bonus action, you can move up to your speed toward an enemy of your choice that you can see or hear. You must end this move closer to the enemy than you started."
      },
      {
        name: "Primal Intuition",
        description: "You have proficiency in two of the following skills of your choice: Animal Handling, Insight, Intimidation, Medicine, Nature, Perception, and Survival."
      },
      {
        name: "Powerful Build",
        description: "You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift."
      }
    ],
    "languages": [
      "Common",
      "Orc"
    ]
  },
  {
    "id": "tabaxi",
    "name": "Tabaxi",
    "description": "Hailing from a strange and distant land, wandering tabaxi are catlike humanoids driven by curiosity to collect interesting artifacts, gather tales and stories, and lay eyes on all the world\u2019s wonders. Ultimate travelers, the inquisitive tabaxi rarely stay in one place for long. Their innate nature pushes them to leave no secrets uncovered, no treasures or legends lost.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "DEX": 2,
      "CHA": 1
    },
    "size": "Medium",
    "speed": 30,
    "traits": [
      {
        name: "Darkvision",
        description: "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray."
      },
      {
        name: "Feline Agility",
        description: "Your reflexes and agility allow you to move with a burst of speed. When you move on your turn in combat, you can double your speed until the end of the turn. Once you use this trait, you can't use it again until you move 0 feet on one of your turns."
      },
      {
        name: "Cat's Claws",
        description: "Because of your claws, you have a climbing speed of 20 feet. In addition, your claws are natural weapons, which you can use to make unarmed strikes. If you hit with them, you deal slashing damage equal to 1d4 + your Strength modifier, instead of the bludgeoning damage normal for an unarmed strike."
      },
      {
        name: "Cat's Talent",
        description: "Because of your claws, you have a climbing speed of 20 feet. In addition, your claws are natural weapons, which you can use to make unarmed strikes. If you hit with them, you deal slashing damage equal to 1d4 + your Strength modifier, instead of the bludgeoning damage normal for an unarmed strike."
      }
    ],
    "languages": [
      "Common"
    ]
  },
  {
    "id": "tabaxi-2",
    "name": "Tabaxi",
    "description": "Tabaxi are catlike humanoids found throughout the Menagerie Coast. They are known for their curiosity and their love of travel. Many tabaxi are merchants, sailors, or bards, and they are often found in the company of other travelers.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "DEX": 2,
      "CHA": 1
    },
    "size": "Medium",
    "speed": 30,
    "traits": [
      {
        name: "Darkvision",
        description: "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray."
      },
      {
        name: "Feline Agility",
        description: "Your reflexes and agility allow you to move with a burst of speed. When you move on your turn in combat, you can double your speed until the end of the turn. Once you use this trait, you can't use it again until you move 0 feet on one of your turns."
      },
      {
        name: "Cat's Claws",
        description: "Because of your claws, you have a climbing speed of 20 feet. In addition, your claws are natural weapons, which you can use to make unarmed strikes. If you hit with them, you deal slashing damage equal to 1d4 + your Strength modifier, instead of the bludgeoning damage normal for an unarmed strike."
      },
      {
        name: "Cat's Talent",
        description: "Because of your claws, you have a climbing speed of 20 feet. In addition, your claws are natural weapons, which you can use to make unarmed strikes. If you hit with them, you deal slashing damage equal to 1d4 + your Strength modifier, instead of the bludgeoning damage normal for an unarmed strike."
      }
    ],
    "languages": [
      "Common"
    ]
  },
  {
    "id": "tiefling",
    "name": "Tiefling",
    "description": "To be greeted with stares and whispers, to suffer violence and insult on the street, to see mistrust and fear in every eye: this is the lot of the tiefling. And to twist the knife, tieflings know that this is because a pact struck generations ago infused the essence of Asmodeus\u2014overlord of the Nine Hells\u2014into their bloodline. Their appearance and their nature are not their fault but the result of an ancient sin, for which they and their children and their children\u2019s children will always be held accountable.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Player's Handbook",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {},
    "size": "Medium",
    "speed": 30,
    "traits": [
      {
        name: "Darkvision",
        description: "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray."
      },
      {
        name: "Hellish Resistance",
        description: "You have resistance to fire damage."
      }
    ],
    "languages": [
      "Common",
      "Infernal"
    ],
    "subraces": [
      "tiefling-asmodeus",
      "tiefling-baalzebul",
      "tiefling-dispater",
      "tiefling-fierna",
      "tiefling-glasya",
      "tiefling-levistus",
      "tiefling-mammon",
      "tiefling-mephistopheles",
      "tiefling-zariel"
    ]
  },
  {
    "id": "tortle-1",
    "name": "Tortle",
    "description": "Tortles are turtle-like humanoids who live on the Menagerie Coast. They are known for their wisdom and their love of the sea. Many tortles are druids or clerics of Melora the Wild Mother.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "STR": 2,
      "WIS": 1
    },
    "size": "Medium",
    "speed": 30,
    "traits": [
      {
        name: "Hold Breath",
        description: "You can hold your breath for up to 1 hour at a time. Tortles aren't natural swimmers, but they can remain underwater for some time before needing to come up for air."
      },
      {
        name: "Natural Armor",
        description: "Due to your shell and the shape of your body, you are ill-suited to wearing armor. Your shell provides ample protection, however; it gives you a base AC of 17 (your Dexterity modifier doesn't affect this number). You gain no benefit from wearing armor, but if you are using a shield, you can apply the shield's bonus as normal."
      },
      {
        name: "Shell Defense",
        description: "You can withdraw into your shell as an action. Until you emerge, you gain a +4 bonus to AC, and you have advantage on Strength and Constitution saving throws. While in your shell, you are prone, your speed is 0 and can't increase, you have disadvantage on Dexterity saving throws, you can't take reactions, and the only action you can take is a bonus action to emerge from your shell."
      },
      {
        name: "Claws",
        description: "Your claws are natural weapons, which you can use to make unarmed strikes. If you hit with them, you deal slashing damage equal to 1d4 + your Strength modifier, instead of the bludgeoning damage normal for an unarmed strike."
      },
      {
        name: "Survival Instinct",
        description: "You gain proficiency in the Survival skill."
      }
    ],
    "languages": [
      "Common",
      "Aquan"
    ]
  },
  {
    "id": "triton",
    "name": "Triton",
    "description": "Tritons guard the ocean depths, building small settlements beside deep trenches, portals to the elemental planes, and other dangerous spots far from the eyes of land-bound folk. Long-established guardians of the deep ocean floor, in recent years the noble tritons have become increasingly active in the world above.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "STR": 1,
      "CON": 1,
      "CHA": 1
    },
    "size": "Medium",
    "speed": 30,
    "traits": [
      {
        name: "Darkvision",
        description: "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray."
      },
      {
        name: "Control Air and Water",
        description: "A child of the sea, you can call on the magic of air and water. You can cast fog cloud with this trait. Starting at 3rd level, you can cast gust of wind with it, and starting at 5th level, you can also cast wall of water with it. Once you cast a spell with this trait, you can't do so again until you finish a long rest. Charisma is your spellcasting ability for these spells."
      },
      {
        name: "Amphibious",
        description: "You can breathe air and water."
      },
      {
        name: "Emissary of the Sea",
        description: "Aquatic beasts have an extraordinary affinity with your people. You can communicate simple ideas with beasts that can breathe water. They can understand the meaning of your words, though you have no special ability to understand them in return."
      },
      {
        name: "Guardians of the Depths",
        description: "Adapted to even the most extreme ocean depths, you have resistance to cold damage."
      }
    ],
    racialKnownSpells: [
      { level: 1, spellId: "fog-cloud", abilityScore: "CHA", type: "recharge" },
      { level: 3, spellId: "gust-of-wind", abilityScore: "CHA", type: "recharge" },
      { level: 5, spellId: "wall-of-water", abilityScore: "CHA", type: "recharge" }
    ],
    "languages": [
      "Common",
      "Primordial"
    ]
  },
  {
    "id": "triton-2",
    "name": "Triton",
    "description": "Tritons are a common sight in the coastal settlements of the Menagerie Coast. They are known for their arrogance and their belief in their own superiority, but they are also respected for their skill as sailors and warriors.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "STR": 1,
      "CON": 1,
      "CHA": 1
    },
    "size": "Medium",
    "speed": 30,
    "traits": [
      {
        name: "Darkvision",
        description: "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray."
      },
      {
        name: "Control Air and Water",
        description: "A child of the sea, you can call on the magic of air and water. You can cast fog cloud with this trait. Starting at 3rd level, you can cast gust of wind with it, and starting at 5th level, you can also cast wall of water with it. Once you cast a spell with this trait, you can't do so again until you finish a long rest. Charisma is your spellcasting ability for these spells."
      },
      {
        name: "Amphibious",
        description: "You can breathe air and water."
      },
      {
        name: "Emissary of the Sea",
        description: "Aquatic beasts have an extraordinary affinity with your people. You can communicate simple ideas with beasts that can breathe water. They can understand the meaning of your words, though you have no special ability to understand them in return."
      },
      {
        name: "Guardians of the Depths",
        description: "Adapted to even the most extreme ocean depths, you have resistance to cold damage."
      }
    ],
    "languages": [
      "Common",
      "Primordial"
    ]
  },
  {
    "id": "yuan-ti-pureblood",
    "name": "Yuan-ti Pureblood",
    "description": "The serpent creatures known as yuan-ti are all that remains of an ancient, decadent human empire. Centuries ago, their days as a great civilization ended when the serpent gods they worshiped demanded a foul sacrifice: the yuan-ti\u2019s humanity. Through a ritual that warped their bodies and minds, the people of this empire became snake-like monstrosities. Purebloods are the most human-seeming of all yuan-ti breeds, often blending into human society to further the goals of their kind.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "abilityScoreIncrease": {
      "INT": 1,
      "CHA": 2
    },
    "size": "Medium",
    "speed": 30,
    "traits": [
      {
        name: "Darkvision",
        description: "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray."
      },
      {
        name: "Magic Resistance",
        description: "You have advantage on saving throws against spells and other magical effects."
      },
      {
        name: "Poison Immunity",
        description: "You are immune to poison damage and the poisoned condition."
      }
    ],
    "languages": [
      "Common",
      "Abyssal",
      "Draconic"
    ]
  },
  {
    id: "lorwyn-elf",
    name: "Lorwyn-Shadowmoor Elf",
    description: "In the sun-dappled realm of Lorwyn, elves are superficial, defining worth by physical beauty. In the dusky realm of Shadowmoor, they are humble protectors of the fading light. Lorwyn elves are rulers of the plane, while Shadowmoor elves are beleaguered wardens.",
    source: "Plane Shift: Lorwyn-Shadowmoor (Unofficial)",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { DEX: 2, CHA: 1 },
    size: "Medium",
    speed: 30,
    traits: [
      { name: "Darkvision", description: "60 ft." },
      { name: "Keen Senses", description: "Proficiency in Perception." },
      { name: "Fey Ancestry", description: "Advantage against charm, no sleep magic." },
      { name: "Mask of the Wild", description: "You can attempt to hide even when you are only lightly obscured by foliage, heavy rain, falling snow, mist, and other natural phenomena." },
      { name: "Perfect Observation", description: "Proficiency in Investigation." }
    ],
    languages: ["Common", "Elvish", "Sylvan"]
  },
  {
    id: "dhampir",
    name: "Dhampir",
    description: "Poised between the worlds of the living and the dead, dhampirs retain their grip on life yet are endlessly tested by vicious hungers. Their ties to the undead grant them a taste of a vampire's deathless prowess in the form of increased speed, darkvision, and a life-draining bite.",
    source: "Van Richten's Guide to Ravenloft",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { CON: 2, DEX: 1 },
    size: "Medium",
    speed: 35,
    traits: [
      { name: "Darkvision", description: "60 ft." },
      { name: "Spider Climb", description: "Climb speed equal to walking speed. At 3rd level, move up, down, across vertical surfaces and ceilings hands-free." },
      { name: "Vampiric Bite", description: "Natural weapon (1d4 piercing). Advantage on attack if under half HP. Empower self on hit." },
      { name: "Deathless Nature", description: "Don't need to breathe." }
    ],
    languages: ["Common", "one other"]
  },
  {
    id: "reborn",
    name: "Reborn",
    description: "Death isn't always the end. The reborn exemplify this, having died and returned to life, but with their memories and previous lives faded or lost. They are individuals who have been constructed, resurrected, or otherwise returned to a semblance of life.",
    source: "Van Richten's Guide to Ravenloft",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { CON: 2, STR: 1 },
    size: "Medium",
    speed: 30,
    traits: [
      { name: "Deathless Nature", description: "Advantage on saves vs disease/poison, resistance to poison. No sleep, eat, drink, breathe." },
      { name: "Constructed Resilience", description: "Advantage on death saving throws." },
      { name: "Knowledge from a Past Life", description: "Add d6 to skill check (proficiency times/long rest)." }
    ],
    languages: ["Common", "one other"]
  },
  {
    id: "hexblood",
    name: "Hexblood",
    description: "Where wishing wells and old wives\u2019 tales are true, hexbloods are the result of hags' magic or faerie bargains. They are changelings of a sort, imbued with eldritch magic that alters their form and grants them powers of hags.",
    source: "Van Richten's Guide to Ravenloft",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { WIS: 2, CHA: 1 },
    size: "Medium",
    speed: 30,
    traits: [
      { name: "Darkvision", description: "60 ft." },
      { name: "Eerie Token", description: "Remove a lock of hair or fingernail to create a telepathic token." },
      { name: "Hex Magic", description: "Cast Disguise Self and Hex with this trait. Intelligence, Wisdom, or Charisma is your spellcasting ability." },
      { name: "Fey Ancestry", description: "Advantage against charm, no sleep magic." }
    ],
    languages: ["Common", "one other"]
  }
];