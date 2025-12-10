import { Race, Subrace } from "../types/dnd-types";

// Comprehensive race database with SRD and common races
export const expandedRaces: Race[] = [
  {
    id: "human",
    name: "Human",
    description:
      "Humans are the most adaptable and ambitious people among the common races. They have widely varying tastes, morals, and customs in the many different lands where they have settled.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },
    size: "Medium",
    speed: 30,
    traits: ["Extra Language", "Versatile"],
    languages: ["Common", "One additional language of your choice"],
  },
  {
    id: "elf",
    name: "Elf",
    description:
      "Elves are a magical people of otherworldly grace, living in the world but not entirely part of it. They live in places of ethereal beauty, in the midst of ancient forests or in silvery spires glittering with faerie light.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { DEX: 2 },
    size: "Medium",
    speed: 30,
    traits: [
      "Darkvision (60 ft.)",
      "Keen Senses (Proficiency in Perception)",
      "Fey Ancestry (Advantage against being charmed, magic can't put you to sleep)",
      "Trance (4 hours instead of 8 for long rest)",
    ],
    languages: ["Common", "Elvish"],
    subraces: ["high-elf", "wood-elf", "drow"],
  },
  {
    id: "dwarf",
    name: "Dwarf",
    description:
      "Bold and hardy, dwarves are known as skilled warriors, miners, and workers of stone and metal. Though they stand well under 5 feet tall, dwarves are so broad and compact that they can weigh as much as a human.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { CON: 2 },
    size: "Medium",
    speed: 25,
    traits: [
      "Darkvision (60 ft.)",
      "Dwarven Resilience (Advantage on saving throws against poison)",
      "Dwarven Combat Training (Proficiency with battleaxe, handaxe, light hammer, warhammer)",
      "Tool Proficiency (One artisan's tool of your choice)",
      "Stonecunning (Add double proficiency to History checks related to stone)",
    ],
    languages: ["Common", "Dwarvish"],
    subraces: ["hill-dwarf", "mountain-dwarf"],
  },
  {
    id: "halfling",
    name: "Halfling",
    description:
      "The diminutive halflings survive in a world full of larger creatures by avoiding notice or, barring that, avoiding offense. They are inclined to be affable and get along well with others.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { DEX: 2 },
    size: "Small",
    speed: 25,
    traits: [
      "Lucky (Reroll 1s on d20 rolls)",
      "Brave (Advantage on saving throws against being frightened)",
      "Halfling Nimbleness (Move through space of larger creatures)",
    ],
    languages: ["Common", "Halfling"],
    subraces: ["lightfoot-halfling", "stout-halfling"],
  },
  {
    id: "dragonborn",
    name: "Dragonborn",
    description:
      "Born of dragons, as their name proclaims, the dragonborn walk proudly through a world that greets them with fearful incomprehension. Shaped by draconic gods or the dragons themselves, dragonborn originally hatched from dragon eggs as a unique race.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { STR: 2, CHA: 1 },
    size: "Medium",
    speed: 30,
    traits: [
      "Draconic Ancestry (Choose a dragon type)",
      "Breath Weapon (Exhale destructive energy)",
      "Damage Resistance (Resistance to your draconic ancestry damage type)",
    ],
    languages: ["Common", "Draconic"],
  },
  {
    id: "gnome",
    name: "Gnome",
    description:
      "A gnome's energy and enthusiasm for living shines through every inch of his or her tiny body. Gnomes average slightly over 3 feet tall and weigh 40 to 45 pounds. Their tan or brown faces are usually adorned with broad smiles.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { INT: 2 },
    size: "Small",
    speed: 25,
    traits: [
      "Darkvision (60 ft.)",
      "Gnome Cunning (Advantage on INT, WIS, CHA saves against magic)",
    ],
    languages: ["Common", "Gnomish"],
    subraces: ["forest-gnome", "rock-gnome"],
  },
  {
    id: "half-elf",
    name: "Half-Elf",
    description:
      "Walking in two worlds but truly belonging to neither, half-elves combine what some say are the best qualities of their elf and human parents: human curiosity, inventiveness, and ambition tempered by the refined senses, love of nature, and artistic tastes of the elves.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { CHA: 2 },
    size: "Medium",
    speed: 30,
    traits: [
      "Darkvision (60 ft.)",
      "Fey Ancestry",
      "Skill Versatility (Proficiency in two skills of your choice)",
      "Ability Score Increase (Two different ability scores increase by 1)",
    ],
    languages: ["Common", "Elvish", "One additional language"],
  },
  {
    id: "half-orc",
    name: "Half-Orc",
    description:
      "Whether united under the leadership of a mighty warlock or having fought to a standstill after years of conflict, orc and human tribes sometimes form alliances, joining forces into a larger horde to the terror of civilized lands nearby.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { STR: 2, CON: 1 },
    size: "Medium",
    speed: 30,
    traits: [
      "Darkvision (60 ft.)",
      "Menacing (Proficiency in Intimidation)",
      "Relentless Endurance (Drop to 1 HP instead of 0, once per long rest)",
      "Savage Attacks (Extra damage die on critical hits)",
    ],
    languages: ["Common", "Orc"],
  },
  {
    id: "tiefling",
    name: "Tiefling",
    description:
      "To be greeted with stares and whispers, to suffer violence and insult on the street, to see mistrust and fear in every eye: this is the lot of the tiefling. Tieflings are derived from human bloodlines, and in the broadest possible sense, they still look human.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { CHA: 2, INT: 1 },
    size: "Medium",
    speed: 30,
    traits: [
      "Darkvision (60 ft.)",
      "Hellish Resistance (Resistance to fire damage)",
      "Infernal Legacy (Know thaumaturgy cantrip, cast hellish rebuke and darkness)",
    ],
    languages: ["Common", "Infernal"],
  },
  {
    id: "goliath",
    name: "Goliath",
    description:
      "At the highest mountain peaks dwell the reclusive goliaths, wandering a bleak realm of rock, wind, and cold. Their bodies look as if they are carved from mountain stone and give them great physical power.",
    source: "Official",
    edition: "2024",
    version: 1,
    abilityScoreIncrease: { STR: 2, CON: 1 },
    size: "Medium",
    speed: 30,
    traits: [
      "Natural Athlete (Proficiency in Athletics)",
      "Stone's Endurance (Reduce damage taken once per short rest)",
      "Powerful Build (Count as one size larger for carry capacity)",
      "Mountain Born (Acclimated to high altitude and cold climate)",
    ],
    languages: ["Common", "Giant"],
  },
  {
    id: "aasimar",
    name: "Aasimar",
    description:
      "Aasimar bear within their souls the light of the heavens. They are descended from humans with a touch of the power of Mount Celestia, the divine realm of many lawful good deities.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { CHA: 2 },
    size: "Medium",
    speed: 30,
    traits: [
      "Darkvision (60 ft.)",
      "Celestial Resistance (Resistance to necrotic and radiant damage)",
      "Healing Hands (Heal HP equal to your level)",
      "Light Bearer (Know the light cantrip)",
    ],
    languages: ["Common", "Celestial"],
    subraces: ["protector-aasimar", "scourge-aasimar", "fallen-aasimar"],
  },
  {
    id: "genasi",
    name: "Genasi",
    description:
      "Those who think of other planes at all consider them remote, distant realms, but planar influence can be felt throughout the world. Genasi are one example of such influence, mortals who are infused with elemental power.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { CON: 2 },
    size: "Medium",
    speed: 30,
    traits: ["Elemental Heritage"],
    languages: ["Common", "Primordial"],
    subraces: ["air-genasi", "earth-genasi", "fire-genasi", "water-genasi"],
  },
];

export const expandedSubraces: Subrace[] = [
  // Elf Subraces
  {
    id: "high-elf",
    parentRaceId: "elf",
    name: "High Elf",
    description:
      "As a high elf, you have a keen mind and a mastery of at least the basics of magic. In many fantasy gaming worlds, there are two kinds of high elves.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { INT: 1 },
    traits: [
      "Elf Weapon Training (Proficiency with longsword, shortsword, shortbow, longbow)",
      "Cantrip (One wizard cantrip of your choice)",
      "Extra Language (One additional language)",
    ],
  },
  {
    id: "wood-elf",
    parentRaceId: "elf",
    name: "Wood Elf",
    description:
      "As a wood elf, you have keen senses and intuition, and your fleet feet carry you quickly and stealthily through your native forests.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { WIS: 1 },
    traits: [
      "Elf Weapon Training",
      "Fleet of Foot (Base speed 35 ft.)",
      "Mask of the Wild (Hide in light natural phenomena)",
    ],
  },
  {
    id: "drow",
    parentRaceId: "elf",
    name: "Drow (Dark Elf)",
    description:
      "Descended from an earlier subrace of dark-skinned elves, the drow were banished from the surface world for following the goddess Lolth down the path to evil and corruption.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { CHA: 1 },
    traits: [
      "Superior Darkvision (120 ft.)",
      "Sunlight Sensitivity (Disadvantage in bright light)",
      "Drow Magic (Dancing lights cantrip, faerie fire, darkness)",
      "Drow Weapon Training",
    ],
  },

  // Dwarf Subraces
  {
    id: "hill-dwarf",
    parentRaceId: "dwarf",
    name: "Hill Dwarf",
    description:
      "As a hill dwarf, you have keen senses, deep intuition, and remarkable resilience.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { WIS: 1 },
    traits: ["Dwarven Toughness (+1 HP per level)"],
  },
  {
    id: "mountain-dwarf",
    parentRaceId: "dwarf",
    name: "Mountain Dwarf",
    description:
      "As a mountain dwarf, you're strong and hardy, accustomed to a difficult life in rugged terrain.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { STR: 2 },
    traits: ["Dwarven Armor Training (Proficiency with light and medium armor)"],
  },

  // Halfling Subraces
  {
    id: "lightfoot-halfling",
    parentRaceId: "halfling",
    name: "Lightfoot Halfling",
    description:
      "As a lightfoot halfling, you can easily hide from notice, even using other people as cover.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { CHA: 1 },
    traits: ["Naturally Stealthy (Hide behind creatures one size larger)"],
  },
  {
    id: "stout-halfling",
    parentRaceId: "halfling",
    name: "Stout Halfling",
    description:
      "As a stout halfling, you're hardier than average and have some resistance to poison.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { CON: 1 },
    traits: ["Stout Resilience (Advantage on saves against poison, resistance to poison damage)"],
  },

  // Gnome Subraces
  {
    id: "forest-gnome",
    parentRaceId: "gnome",
    name: "Forest Gnome",
    description:
      "As a forest gnome, you have a natural knack for illusion and inherent quickness and stealth.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { DEX: 1 },
    traits: [
      "Natural Illusionist (Minor illusion cantrip)",
      "Speak with Small Beasts (Communicate simple ideas with small animals)",
    ],
  },
  {
    id: "rock-gnome",
    parentRaceId: "gnome",
    name: "Rock Gnome",
    description:
      "As a rock gnome, you have a natural inventiveness and hardiness beyond that of other gnomes.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { CON: 1 },
    traits: [
      "Artificer's Lore (Add double proficiency to History checks related to magic items, alchemical objects, or tech devices)",
      "Tinker (Create tiny clockwork devices)",
    ],
  },

  // Genasi Subraces
  {
    id: "air-genasi",
    parentRaceId: "genasi",
    name: "Air Genasi",
    description:
      "As an air genasi, you are descended from the djinn. As changeable as the weather, your moods shift from calm to wild and violent with little warning.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { DEX: 1 },
    traits: [
      "Unending Breath (Can hold breath indefinitely)",
      "Mingle with the Wind (Cast levitate once per long rest)",
    ],
  },
  {
    id: "earth-genasi",
    parentRaceId: "genasi",
    name: "Earth Genasi",
    description:
      "As an earth genasi, you are descended from the cruel and greedy dao. You possess the power of stone.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { STR: 1 },
    traits: [
      "Earth Walk (Move across difficult terrain made of earth or stone without extra movement)",
      "Merge with Stone (Cast pass without trace once per long rest)",
    ],
  },
  {
    id: "fire-genasi",
    parentRaceId: "genasi",
    name: "Fire Genasi",
    description:
      "As a fire genasi, you have inherited the volatile mood and keen mind of the efreet.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { INT: 1 },
    traits: [
      "Darkvision (60 ft.)",
      "Fire Resistance",
      "Reach to the Blaze (Produce flame cantrip, burning hands once per long rest)",
    ],
  },
  {
    id: "water-genasi",
    parentRaceId: "genasi",
    name: "Water Genasi",
    description:
      "The lapping of waves, the spray of sea foam on the wind, the ocean depths—all of these things call to your heart.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { WIS: 1 },
    traits: [
      "Acid Resistance",
      "Amphibious (Breathe air and water)",
      "Swim (30 ft. swim speed)",
      "Call to the Wave (Shape water cantrip, create or destroy water once per long rest)",
    ],
  },

  // Aasimar Subraces
  {
    id: "protector-aasimar",
    parentRaceId: "aasimar",
    name: "Protector Aasimar",
    description:
      "Protector aasimar are charged by the powers of good to guard the weak, to strike at evil wherever it arises, and to stand vigilant against the darkness.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { WIS: 1 },
    traits: [
      "Radiant Soul (Once per long rest, sprout wings and fly 30 ft., deal extra radiant damage)",
    ],
  },
  {
    id: "scourge-aasimar",
    parentRaceId: "aasimar",
    name: "Scourge Aasimar",
    description:
      "Scourge aasimar are imbued with a divine energy that blazes intensely within them. It feeds a powerful desire to destroy evil.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { CON: 1 },
    traits: [
      "Radiant Consumption (Once per long rest, emit radiant light dealing damage to nearby creatures and yourself)",
    ],
  },
  {
    id: "fallen-aasimar",
    parentRaceId: "aasimar",
    name: "Fallen Aasimar",
    description:
      "An aasimar who was touched by dark powers as a youth or who turns to evil in early adulthood can become one of the fallen.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { STR: 1 },
    traits: [
      "Necrotic Shroud (Once per long rest, frighten nearby creatures and deal extra necrotic damage)",
    ],
  },
];
