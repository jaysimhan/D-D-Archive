/**
 * Script to add missing traits based on wikidot reference and link them to races
 * 
 * Usage:
 * cd studio
 * SANITY_AUTH_TOKEN=xxx npx sanity exec migrations/add-missing-traits.ts --with-user-token
 */

import { createClient } from '@sanity/client';

const client = createClient({
    projectId: 'ylk0tk34',
    dataset: 'production',
    useCdn: false,
    token: process.env.SANITY_AUTH_TOKEN,
    apiVersion: '2024-01-01',
});

function toSanityId(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

// Missing traits based on wikidot/D&D Beyond reference
const MISSING_TRAITS = [
    // Dragonborn
    {
        name: 'Draconic Ancestry',
        description: 'You are distantly related to a particular kind of dragon. Choose a type of dragon from the Draconic Ancestry table; this determines the damage and area of your breath weapon, and the type of resistance you gain.',
        tags: ['race'],
    },
    // Dwarf
    {
        name: 'Dwarven Combat Training',
        description: 'You have proficiency with the battleaxe, handaxe, light hammer, and warhammer.',
        tags: ['race'],
    },
    {
        name: 'Tool Proficiency',
        description: "You gain proficiency with the artisan's tools of your choice: smith's tools, brewer's supplies, or mason's tools.",
        tags: ['race'],
    },
    // Bugbear
    {
        name: 'Long-Limbed',
        description: 'When you make a melee attack on your turn, your reach for it is 5 feet greater than normal.',
        tags: ['race'],
    },
    {
        name: 'Sneaky',
        description: 'You are proficient in the Stealth skill.',
        tags: ['race'],
    },
    // Aarakocra
    {
        name: 'Wind Caller',
        description: 'Starting at 3rd level, you can cast the gust of wind spell with this trait, without requiring a material component. Once you cast the spell with this trait, you cannot do so again until you finish a long rest. You can also cast the spell using any spell slots you have of 2nd level or higher. Intelligence, Wisdom, or Charisma is your spellcasting ability for it when you cast it with this trait (choose when you select this race).',
        tags: ['race'],
    },
    // Aasimar
    {
        name: 'Celestial Revelation',
        description: "When you reach 3rd level, choose one of the revelation options below. Thereafter, you can use a bonus action to unleash the celestial energy within yourself, gaining the benefits of that revelation. Your transformation lasts for 1 minute or until you end it as a bonus action. Once you transform, you can't do so again until you finish a long rest.",
        tags: ['race'],
    },
    // Elf subraces
    {
        name: 'Elf Weapon Training',
        description: 'You have proficiency with the longsword, shortsword, shortbow, and longbow.',
        tags: ['race'],
    },
    {
        name: 'Cantrip',
        description: 'You know one cantrip of your choice from the wizard spell list. Intelligence is your spellcasting ability for it.',
        tags: ['race'],
    },
    {
        name: 'Extra Language',
        description: 'You can speak, read, and write one extra language of your choice.',
        tags: ['race'],
    },
    {
        name: 'Fleet of Foot',
        description: 'Your base walking speed increases to 35 feet.',
        tags: ['race'],
    },
    {
        name: 'Mask of the Wild',
        description: 'You can attempt to hide even when you are only lightly obscured by foliage, heavy rain, falling snow, mist, and other natural phenomena.',
        tags: ['race'],
    },
    // Drow traits
    {
        name: 'Superior Darkvision',
        description: 'Your darkvision has a radius of 120 feet.',
        tags: ['race'],
    },
    {
        name: 'Sunlight Sensitivity',
        description: 'You have disadvantage on attack rolls and on Wisdom (Perception) checks that rely on sight when you, the target of your attack, or whatever you are trying to perceive is in direct sunlight.',
        tags: ['race'],
    },
    {
        name: 'Drow Magic',
        description: 'You know the dancing lights cantrip. When you reach 3rd level, you can cast the faerie fire spell once with this trait; you regain the ability to cast it when you finish a long rest. When you reach 5th level, you can also cast the darkness spell once with this trait; you regain the ability to cast it when you finish a long rest. Charisma is your spellcasting ability for these spells.',
        tags: ['race'],
    },
    {
        name: 'Drow Weapon Training',
        description: 'You have proficiency with rapiers, shortswords, and hand crossbows.',
        tags: ['race'],
    },
    // Dwarf subraces
    {
        name: 'Dwarven Toughness',
        description: 'Your hit point maximum increases by 1, and it increases by 1 every time you gain a level.',
        tags: ['race'],
    },
    {
        name: 'Dwarven Armor Training',
        description: 'You have proficiency with light and medium armor.',
        tags: ['race'],
    },
    // Gnome subraces
    {
        name: 'Artificer\'s Lore',
        description: 'Whenever you make an Intelligence (History) check related to magic items, alchemical objects, or technological devices, you can add twice your proficiency bonus, instead of any proficiency bonus you normally apply.',
        tags: ['race'],
    },
    {
        name: 'Tinker',
        description: "Using tinker's tools, you can spend 1 hour and 10 gp worth of materials to construct a Tiny clockwork device (AC 5, 1 hp). The device ceases to function after 24 hours unless you spend 1 hour repairing it.",
        tags: ['race'],
    },
    {
        name: 'Natural Illusionist',
        description: 'You know the minor illusion cantrip. Intelligence is your spellcasting ability for it.',
        tags: ['race'],
    },
    {
        name: 'Speak with Small Beasts',
        description: 'Through sounds and gestures, you can communicate simple ideas with Small or smaller beasts.',
        tags: ['race'],
    },
    // Halfling
    {
        name: 'Lucky',
        description: 'When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.',
        tags: ['race'],
    },
    {
        name: 'Halfling Nimbleness',
        description: "You can move through the space of any creature that is of a size larger than yours.",
        tags: ['race'],
    },
    // Halfling subraces
    {
        name: 'Naturally Stealthy',
        description: 'You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you.',
        tags: ['race'],
    },
    {
        name: 'Stout Resilience',
        description: 'You have advantage on saving throws against poison, and you have resistance against poison damage.',
        tags: ['race'],
    },
    // Half-Elf
    {
        name: 'Skill Versatility',
        description: 'You gain proficiency in two skills of your choice.',
        tags: ['race'],
    },
    // Half-Orc
    {
        name: 'Menacing',
        description: 'You gain proficiency in the Intimidation skill.',
        tags: ['race'],
    },
    {
        name: 'Relentless Endurance',
        description: "When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. You can't use this feature again until you finish a long rest.",
        tags: ['race'],
    },
    {
        name: 'Savage Attacks',
        description: 'When you score a critical hit with a melee weapon attack, you can roll one of the weapon\'s damage dice one additional time and add it to the extra damage of the critical hit.',
        tags: ['race'],
    },
    // Human
    {
        name: 'Skill Proficiency',
        description: 'You gain proficiency in one skill of your choice.',
        tags: ['race'],
    },
    {
        name: 'Feat',
        description: 'You gain one feat of your choice.',
        tags: ['race'],
    },
    // Tiefling
    {
        name: 'Hellish Resistance',
        description: 'You have resistance to fire damage.',
        tags: ['race'],
    },
    {
        name: 'Infernal Legacy',
        description: 'You know the thaumaturgy cantrip. When you reach 3rd level, you can cast the hellish rebuke spell as a 2nd-level spell once with this trait; you regain the ability to cast it when you finish a long rest. When you reach 5th level, you can also cast the darkness spell once with this trait; you regain the ability to cast it when you finish a long rest. Charisma is your spellcasting ability for these spells.',
        tags: ['race'],
    },
    // Goliath
    {
        name: "Stone's Endurance",
        description: "You can focus yourself to occasionally shrug off injury. When you take damage, you can use your reaction to roll a d12. Add your Constitution modifier to the number rolled, and reduce the damage by that total. After you use this trait, you can't use it again until you finish a short or long rest.",
        tags: ['race'],
    },
    {
        name: 'Mountain Born',
        description: "You have resistance to cold damage. You're also acclimated to high altitude, including elevations above 20,000 feet.",
        tags: ['race'],
    },
    // Tabaxi
    {
        name: 'Feline Agility',
        description: "Your reflexes and agility allow you to move with a burst of speed. When you move on your turn in combat, you can double your speed until the end of the turn. Once you use this trait, you can't use it again until you move 0 feet on one of your turns.",
        tags: ['race'],
    },
    // Kenku
    {
        name: 'Expert Duplication',
        description: "When you copy writing or craftwork produced by yourself or someone else, you have advantage on any ability checks you make to produce an exact duplicate.",
        tags: ['race'],
    },
    {
        name: 'Mimicry',
        description: "You can accurately mimic sounds you have heard, including voices. A creature that hears the sounds you make can tell they are imitations with a successful Wisdom (Insight) check opposed by your Charisma (Deception) check.",
        tags: ['race'],
    },
    // Lizardfolk
    {
        name: 'Cunning Artisan',
        description: "As part of a short rest, you can harvest bone and hide from a slain beast, construct, dragon, monstrosity, or plant creature of size Small or larger to create one of the following items: a shield, a club, a javelin, or 1d4 darts or blowgun needles.",
        tags: ['race'],
    },
    {
        name: "Hungry Jaws",
        description: "In battle, you can throw yourself into a vicious feeding frenzy. As a bonus action, you can make a special attack with your bite. If the attack hits, it deals its normal damage, and you gain temporary hit points equal to your Constitution modifier (minimum of 1). You can't use this trait again until you finish a short or long rest.",
        tags: ['race'],
    },
    // Tortle
    {
        name: 'Shell Defense',
        description: "You can withdraw into your shell as an action. Until you emerge, you gain a +4 bonus to AC, and you have advantage on Strength and Constitution saving throws. While in your shell, you are prone, your speed is 0 and can't increase, you have disadvantage on Dexterity saving throws, you can't take reactions, and the only action you can take is a bonus action to emerge from your shell.",
        tags: ['race'],
    },
    {
        name: 'Survival Instinct',
        description: 'You gain proficiency in the Survival skill.',
        tags: ['race'],
    },
    // Triton
    {
        name: 'Control Air and Water',
        description: 'You can cast fog cloud with this trait. Starting at 3rd level, you can cast gust of wind with it, and starting at 5th level, you can also cast wall of water with it. Once you cast a spell with this trait, you can\'t cast that spell with it again until you finish a long rest. Charisma is your spellcasting ability for these spells.',
        tags: ['race'],
    },
    {
        name: 'Emissary of the Sea',
        description: 'Aquatic beasts have an extraordinary affinity with your people. You can communicate simple ideas with beasts that can breathe water. They can understand the meaning of your words, though you have no special ability to understand them in return.',
        tags: ['race'],
    },
    {
        name: 'Guardian of the Depths',
        description: 'Adapted to even the most extreme ocean depths, you have resistance to cold damage.',
        tags: ['race'],
    },
    // Firbolg updated
    {
        name: 'Firbolg Magic',
        description: 'You can cast detect magic and disguise self with this trait, using Wisdom as your spellcasting ability for them. Once you cast either spell, you can\'t cast it again with this trait until you finish a short or long rest.',
        tags: ['race'],
    },
    // Warforged
    {
        name: 'Constructed Resilience',
        description: "You were created to have remarkable fortitude, represented by the following benefits: You have advantage on saving throws against being poisoned, and you have resistance to poison damage. You don't need to eat, drink, or breathe. You are immune to disease. You don't need to sleep, and magic can't put you to sleep.",
        tags: ['race'],
    },
    {
        name: 'Sentry\'s Rest',
        description: "When you take a long rest, you must spend at least six hours in an inactive, motionless state, rather than sleeping. In this state, you appear inert, but it doesn't render you unconscious, and you can see and hear as normal.",
        tags: ['race'],
    },
    {
        name: 'Integrated Protection',
        description: "Your body has built-in defensive layers, which can be enhanced with armor. You gain a +1 bonus to Armor Class. You can don only armor with which you have proficiency.",
        tags: ['race'],
    },
    {
        name: 'Specialized Design',
        description: "You gain one skill proficiency and one tool proficiency of your choice.",
        tags: ['race'],
    },
    // Harengon (Wild Beyond the Witchlight)
    {
        name: 'Hare-Trigger',
        description: 'You can add your proficiency bonus to your initiative rolls.',
        tags: ['race'],
    },
    {
        name: 'Leporine Senses',
        description: 'You have proficiency in the Perception skill.',
        tags: ['race'],
    },
    {
        name: 'Lucky Footwork',
        description: 'When you fail a Dexterity saving throw, you can use your reaction to roll a d4 and add it to the save, potentially turning the failure into a success. You can use this trait a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
        tags: ['race'],
    },
    {
        name: 'Rabbit Hop',
        description: 'As a bonus action, you can jump a number of feet equal to five times your proficiency bonus, without provoking opportunity attacks. You can use this trait a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
        tags: ['race'],
    },
    // Owlin (Strixhaven)
    {
        name: 'Silent Feathers',
        description: 'You have proficiency in the Stealth skill.',
        tags: ['race'],
    },
    // Minotaur (GGR)
    {
        name: 'Horns',
        description: 'Your horns are natural melee weapons, which you can use to make unarmed strikes. When you hit with them, you deal piercing damage equal to 1d6 + your Strength modifier.',
        tags: ['race'],
    },
    {
        name: 'Goring Rush',
        description: 'Immediately after you use the Dash action on your turn and move at least 20 feet, you can make one melee attack with your horns as a bonus action.',
        tags: ['race'],
    },
    {
        name: 'Hammering Horns',
        description: 'Immediately after you hit a creature with a melee attack as part of the Attack action on your turn, you can use a bonus action to attempt to shove that target with your horns. The target must be no more than one size larger than you and within 5 feet of you. Unless it succeeds on a Strength saving throw against a DC equal to 8 + your proficiency bonus + your Strength modifier, you push it up to 10 feet away from you.',
        tags: ['race'],
    },
    {
        name: 'Labyrinthine Recall',
        description: 'You can perfectly recall any path you have traveled.',
        tags: ['race'],
    },
    {
        name: 'Imposing Presence',
        description: 'You have proficiency in one of the following skills of your choice: Intimidation or Persuasion.',
        tags: ['race'],
    },
    // Shifter (Eberron)
    {
        name: 'Shifting',
        description: "As a bonus action, you can assume a more bestial appearance. This transformation lasts for 1 minute, until you die, or until you revert to your normal appearance as a bonus action. When you shift, you gain temporary hit points equal to your level + your Constitution modifier (minimum of 1). Once you shift, you can't do so again until you finish a short or long rest.",
        tags: ['race'],
    },
    {
        name: 'Beasthide Shifting Feature',
        description: 'While shifted, you gain an additional 1d6 temporary hit points and +1 AC.',
        tags: ['race'],
    },
    {
        name: 'Natural Athlete',
        description: 'You have proficiency in the Athletics skill.',
        tags: ['race'],
    },
    {
        name: 'Longtooth Shifting Feature',
        description: 'While shifted, you can use your elongated fangs to make an unarmed strike as a bonus action. If you hit with your fangs, you deal piercing damage equal to 1d6 + your Strength modifier.',
        tags: ['race'],
    },
    {
        name: 'Fierce',
        description: 'You have proficiency in the Intimidation skill.',
        tags: ['race'],
    },
    {
        name: 'Swiftstride Shifting Feature',
        description: "While shifted, your walking speed increases by 10 feet. Additionally, you can move up to 10 feet as a reaction when a creature ends its turn within 5 feet of you. This movement doesn't provoke opportunity attacks.",
        tags: ['race'],
    },
    {
        name: 'Graceful',
        description: 'You have proficiency in the Acrobatics skill.',
        tags: ['race'],
    },
    {
        name: 'Wildhunt Shifting Feature',
        description: "While shifted, you have advantage on Wisdom checks, and no creature within 30 feet of you can make an attack roll with advantage against you, unless you're incapacitated.",
        tags: ['race'],
    },
    {
        name: 'Natural Tracker',
        description: 'You have proficiency in the Survival skill.',
        tags: ['race'],
    },
    // Kalashtar (Eberron)
    {
        name: 'Dual Mind',
        description: 'You have advantage on all Wisdom saving throws.',
        tags: ['race'],
    },
    {
        name: 'Mind Link',
        description: "You can speak telepathically to any creature you can see within 60 feet of you. You don't need to share a language with the creature for it to understand your telepathic messages, but the creature must be able to understand at least one language. As a bonus action when you're speaking to a creature telepathically, you can give that creature the ability to speak telepathically back to you until the start of your next turn.",
        tags: ['race'],
    },
    {
        name: 'Severed from Dreams',
        description: "Kalashtar sleep, but they don't connect to the plane of dreams as other creatures do. Instead, their minds draw from the memories of their otherworldly spirit while they sleep. As such, you are immune to spells and other magical effects that require you to dream, like the dream spell, but not to spells and effects that put you to sleep, like the sleep spell.",
        tags: ['race'],
    },
    // Fairy (Wild Beyond the Witchlight)
    {
        name: 'Fairy Magic',
        description: "You know the druidcraft cantrip. Starting at 3rd level, you can cast the faerie fire spell with this trait. Starting at 5th level, you can also cast the enlarge/reduce spell with this trait. Once you cast faerie fire or enlarge/reduce with this trait, you can't cast that spell with it again until you finish a long rest. You can also cast either of those spells using any spell slots you have of the appropriate level. Intelligence, Wisdom, or Charisma is your spellcasting ability for these spells (choose when you select this race).",
        tags: ['race'],
    },
    // Eladrin (MPMM)
    {
        name: 'Fey Step',
        description: "As a bonus action, you can magically teleport up to 30 feet to an unoccupied space you can see. You can use this trait a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest. When you reach 3rd level, your Fey Step gains an additional effect based on your season; if the effect requires a saving throw, the DC equals 8 + your proficiency bonus + your Intelligence, Wisdom, or Charisma modifier (choose when you select this race).",
        tags: ['race'],
    },
    // Deep Gnome (MPMM)
    {
        name: 'Stone Camouflage',
        description: 'You have advantage on Dexterity (Stealth) checks made to hide in rocky terrain.',
        tags: ['race'],
    },
    {
        name: 'Svirfneblin Magic',
        description: "Starting at 3rd level, you can cast the disguise self spell with this trait. Starting at 5th level, you can also cast the nondetection spell with this trait, without requiring a material component. Once you cast either of these spells with this trait, you can't cast that spell with it again until you finish a long rest. You can also cast these spells using spell slots you have of the appropriate level. Intelligence, Wisdom, or Charisma is your spellcasting ability for these spells (choose when you select this race).",
        tags: ['race'],
    },
    // Duergar (MPMM)
    {
        name: 'Duergar Resilience',
        description: 'You have advantage on saving throws against illusions and against being charmed or paralyzed.',
        tags: ['race'],
    },
    {
        name: 'Duergar Magic',
        description: "Starting at 3rd level, you can cast the enlarge/reduce spell on yourself (enlarge only), without requiring a material component. Starting at 5th level, you can also cast the invisibility spell (self only). Once you cast either of these spells with this trait, you can't cast that spell with it again until you finish a long rest. You can also cast these spells using spell slots you have of the appropriate level. Intelligence, Wisdom, or Charisma is your spellcasting ability for these spells (choose when you select this race).",
        tags: ['race'],
    },
    {
        name: 'Psionic Fortitude',
        description: 'You have advantage on saving throws against being stunned.',
        tags: ['race'],
    },
    // Core Dwarf traits
    {
        name: 'Stonecunning',
        description: 'Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient in the History skill and add double your proficiency bonus to the check.',
        tags: ['race'],
    },
    // Core Elf traits
    {
        name: 'Keen Senses',
        description: 'You have proficiency in the Perception skill.',
        tags: ['race'],
    },
    {
        name: 'Trance',
        description: "Elves don't need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day. After resting in this way, you gain the same benefit that a human does from 8 hours of sleep.",
        tags: ['race'],
    },
    // Core Halfling traits
    {
        name: 'Brave',
        description: 'You have advantage on saving throws against being frightened.',
        tags: ['race'],
    },
    // Ghostwise Halfling
    {
        name: 'Silent Speech',
        description: 'You can speak telepathically to any creature within 30 feet of you. The creature understands you only if the two of you share a language. You can speak telepathically in this way to one creature at a time.',
        tags: ['race'],
    },
    // Sea Elf traits
    {
        name: 'Sea Elf Training',
        description: 'You have proficiency with the spear, trident, light crossbow, and net.',
        tags: ['race'],
    },
    {
        name: 'Child of the Sea',
        description: 'You have a swimming speed of 30 feet, and you can breathe air and water.',
        tags: ['race'],
    },
    {
        name: 'Friend of the Sea',
        description: 'Using gestures and sounds, you can communicate simple ideas with any beast that has an innate swimming speed.',
        tags: ['race'],
    },
    // Shadar-kai traits
    {
        name: 'Necrotic Resistance',
        description: 'You have resistance to necrotic damage.',
        tags: ['race'],
    },
    {
        name: 'Blessing of the Raven Queen',
        description: "As a bonus action, you can magically teleport up to 30 feet to an unoccupied space you can see. Once you use this trait, you can't do so again until you finish a long rest. Starting at 3rd level, you also gain resistance to all damage when you teleport using this trait. The resistance lasts until the start of your next turn.",
        tags: ['race'],
    },
    // ===== AUTOGNOME (Spelljammer) =====
    {
        name: 'Armored Casing',
        description: 'You are encased in thin metal or some other durable material. While you are not wearing armor, your base Armor Class is 13 + your Dexterity modifier.',
        tags: ['race'],
    },
    {
        name: 'Built for Success',
        description: "You can add a d4 to one attack roll, ability check, or saving throw you make, and you can do so after seeing the d20 roll but before the effects of the roll are resolved. You can use this trait a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
        tags: ['race'],
    },
    {
        name: 'Mechanical Nature',
        description: "You have resistance to poison damage and immunity to disease, and you have advantage on saving throws against being paralyzed or poisoned. You don't need to eat, drink, or breathe.",
        tags: ['race'],
    },
    {
        name: 'True Life',
        description: "If the mending spell is cast on you, you can expend a Hit Die, roll it, and regain a number of hit points equal to the roll plus your Constitution modifier (minimum of 1 hit point). In addition, your creator designed you to benefit from common spells that preserve life but that normally don't affect Constructs: cure wounds, healing word, mass cure wounds, mass healing word, and spare the dying.",
        tags: ['race'],
    },
    // ===== GIFF (Spelljammer) =====
    {
        name: 'Astral Spark',
        description: "Your psychic connection to the Astral Plane enables you to mystically access a spark of divine power, which you can channel through your weapons. When you hit a target with a simple or martial weapon, you can cause the target to take extra force damage equal to your proficiency bonus. You can use this trait a number of times equal to your proficiency bonus, but you can use it no more than once per turn. You regain all expended uses when you finish a long rest.",
        tags: ['race'],
    },
    {
        name: 'Firearms Mastery',
        description: "You have a mystical connection to firearms that traces back to the gods of the giff, who delighted in such weapons. You have proficiency with all firearms and ignore the loading property of any firearm. In addition, attacking at long range with a firearm doesn't impose disadvantage on your attack roll.",
        tags: ['race'],
    },
    {
        name: 'Hippo Build',
        description: "You have advantage on Strength-based ability checks and Strength saving throws. In addition, you count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift.",
        tags: ['race'],
    },
    // ===== GRUNG (One Grung Above) =====
    {
        name: 'Amphibious',
        description: 'You can breathe air and water.',
        tags: ['race'],
    },
    {
        name: 'Poison Immunity',
        description: 'You are immune to poison damage and the poisoned condition.',
        tags: ['race'],
    },
    {
        name: 'Poisonous Skin',
        description: "Any creature that grapples you or otherwise comes into direct contact with your skin must succeed on a DC 12 Constitution saving throw or become poisoned for 1 minute. A poisoned creature no longer in direct contact with you can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. You can also apply this poison to any piercing weapon as part of an attack with that weapon, though the poison loses its potency 1 minute after being applied. On a hit with that weapon, the target must succeed on a DC 12 Constitution saving throw or take 2d4 poison damage.",
        tags: ['race'],
    },
    {
        name: 'Standing Leap',
        description: 'Your long jump is up to 25 feet and your high jump is up to 15 feet, with or without a running start.',
        tags: ['race'],
    },
    {
        name: 'Water Dependency',
        description: "If you fail to immerse yourself in water for at least 1 hour during a day, you suffer 1 level of exhaustion at the end of that day. You can recover from this exhaustion only through magic or by immersing yourself in water for at least 1 hour.",
        tags: ['race'],
    },
    {
        name: 'Arboreal Alertness',
        description: 'You have proficiency in the Perception skill.',
        tags: ['race'],
    },
    // ===== HADOZEE (Spelljammer) =====
    {
        name: 'Dexterous Feet',
        description: "As a bonus action, you can use your feet to manipulate an object, open or close a door or container, or pick up or set down a Tiny object.",
        tags: ['race'],
    },
    {
        name: 'Glide',
        description: "If you are not incapacitated or wearing heavy armor, you can extend your skin membranes and glide. When you do so, you can perform the following aerial maneuvers: When you fall at least 10 feet above the ground, you can move up to a number of feet horizontally equal to your walking speed, and you take 0 damage from the fall. When you would take damage from a fall, you can use your reaction to reduce the fall damage you take by an amount equal to your level.",
        tags: ['race'],
    },
    {
        name: 'Hadozee Resilience',
        description: "The magic that created hadozees gave them a resilient life force. When you take damage, you can use your reaction to roll a d6. Add your proficiency bonus to the number rolled, and reduce the damage you take by an amount equal to that total (minimum of 0 damage). You can use this trait a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
        tags: ['race'],
    },
    // ===== KENDER (Dragonlance) =====
    {
        name: 'Fearless',
        description: "You have advantage on saving throws you make to avoid or end the frightened condition on yourself. When you fail a saving throw against the frightened condition, you can choose to succeed instead. Once you succeed on a saving throw against the frightened condition using this trait (including the optional success), you can't do so again until you finish a long rest.",
        tags: ['race'],
    },
    {
        name: 'Kender Aptitude',
        description: 'You have proficiency in one of the following skills of your choice: Insight, Investigation, Sleight of Hand, Stealth, or Survival.',
        tags: ['race'],
    },
    {
        name: 'Taunt',
        description: "You have an extraordinary ability to fluster creatures. As a bonus action, you can unleash a string of provoking words at a creature within 60 feet of you that can hear and understand you. The target must succeed on a Wisdom saving throw, or it has disadvantage on attack rolls against targets other than you until the start of your next turn. The DC equals 8 + your proficiency bonus + your Intelligence, Wisdom, or Charisma modifier (choose when you select this race). You can use this bonus action a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
        tags: ['race'],
    },
    // ===== LOCATHAH (Locathah Rising) =====
    {
        name: 'Natural Armor',
        description: "You have tough, scaly skin. When you aren't wearing armor, your AC is 12 + your Dexterity modifier. You can use your natural armor to determine your AC if the armor you wear would leave you with a lower AC. A shield's benefits apply as normal while you use your natural armor.",
        tags: ['race'],
    },
    {
        name: 'Observant and Athletic',
        description: 'You have proficiency in the Athletics and Perception skills.',
        tags: ['race'],
    },
    {
        name: 'Leviathan Will',
        description: 'You have advantage on saving throws against being charmed, frightened, paralyzed, poisoned, stunned, or put to sleep.',
        tags: ['race'],
    },
    {
        name: 'Limited Amphibiousness',
        description: 'You can breathe air and water, but you need to be submerged at least once every 4 hours to avoid suffocating outside of water.',
        tags: ['race'],
    },
    // ===== SIMIC HYBRID (Ravnica) =====
    {
        name: 'Animal Enhancement',
        description: "Your body has been altered to incorporate certain animal characteristics. You choose one animal enhancement now and a second enhancement at 5th level. At 1st level, choose one of the following options: Manta Glide, Nimble Climber, or Underwater Adaptation. At 5th level, your body develops another feature based on your choice: Grappling Appendages or Carapace.",
        tags: ['race'],
    },
    {
        name: 'Manta Glide',
        description: "You have ray-like fins that you can use as wings to slow your fall or allow you to glide. When you fall and aren't incapacitated, you can subtract up to 100 feet from the fall when calculating falling damage, and you can move up to 2 feet horizontally for every 1 foot you descend.",
        tags: ['race'],
    },
    {
        name: 'Nimble Climber',
        description: 'You have a climbing speed equal to your walking speed.',
        tags: ['race'],
    },
    {
        name: 'Underwater Adaptation',
        description: 'You can breathe air and water, and you have a swimming speed equal to your walking speed.',
        tags: ['race'],
    },
    {
        name: 'Grappling Appendages',
        description: "You have two special appendages growing alongside your arms. Choose whether they're both claws or tentacles. As an action, you can use one of them to try to grapple a creature. Each one is also a natural weapon, which you can use to make an unarmed strike. If you hit with it, the target takes bludgeoning damage equal to 1d6 + your Strength modifier. Immediately after hitting, you can try to grapple the target as a bonus action. These appendages can't precisely manipulate anything and can't wield weapons, magic items, or other specialized equipment.",
        tags: ['race'],
    },
    {
        name: 'Carapace',
        description: 'Your skin in places is as hard as shell. While you are not wearing armor, your base Armor Class is 13 + your Dexterity modifier.',
        tags: ['race'],
    },
    // ===== THRI-KREEN (Spelljammer) =====
    {
        name: 'Chameleon Carapace',
        description: "While you aren't wearing armor, your carapace gives you a base Armor Class of 13 + your Dexterity modifier. As an action, you can change the color of your carapace to match the color and texture of your surroundings, giving you advantage on Dexterity (Stealth) checks made to hide in those surroundings.",
        tags: ['race'],
    },
    {
        name: 'Secondary Arms',
        description: "You have two slightly smaller secondary arms below your primary pair of arms. The secondary arms can manipulate an object, open or close a door or container, pick up or set down a Tiny object, or wield a weapon that has the light property.",
        tags: ['race'],
    },
    {
        name: 'Sleepless',
        description: "You do not require sleep and can choose to remain conscious during a long rest, though you must still refrain from strenuous activity to gain the benefit of the rest.",
        tags: ['race'],
    },
    {
        name: 'Thri-kreen Telepathy',
        description: "Without the assistance of magic, you can't speak the non-thri-kreen languages you know. Instead you use telepathy to convey your thoughts. You have the magical ability to transmit your thoughts mentally to willing creatures you can see within 120 feet of you. A contacted creature doesn't need to share a language with you, but it must be able to understand at least one language. Your telepathic link to a creature is broken if you and the creature move more than 120 feet apart, if either of you is incapacitated, or if either of you mentally breaks the contact (no action required).",
        tags: ['race'],
    },
    // ===== VEDALKEN (Ravnica) =====
    {
        name: 'Vedalken Dispassion',
        description: 'You have advantage on all Intelligence, Wisdom, and Charisma saving throws.',
        tags: ['race'],
    },
    {
        name: 'Tireless Precision',
        description: "You are proficient in one of the following skills of your choice: Arcana, History, Investigation, Medicine, Performance, or Sleight of Hand. You are also proficient with one tool of your choice. Whenever you make an ability check with the chosen skill or tool, roll a d4 and add the number rolled to the check's total.",
        tags: ['race'],
    },
    {
        name: 'Partially Amphibious',
        description: "By absorbing oxygen through your skin, you can breathe underwater for up to 1 hour. Once you've reached that limit, you can't use this trait again until you finish a long rest.",
        tags: ['race'],
    },
    // ===== VERDAN (Acquisitions Incorporated) =====
    {
        name: 'Black Blood Healing',
        description: 'When you roll a 1 or 2 on any Hit Die you spend at the end of a short rest, you can reroll the die and must use the new roll.',
        tags: ['race'],
    },
    {
        name: 'Limited Telepathy',
        description: "You can telepathically speak to any creature you can see within 30 feet of you. You don't need to share a language with the creature for it to understand your telepathic messages, but the creature must be able to understand at least one language. Your communication doesn't give the creature the ability to respond to you telepathically.",
        tags: ['race'],
    },
    {
        name: 'Persuasive',
        description: 'You have proficiency in the Persuasion skill.',
        tags: ['race'],
    },
    {
        name: 'Telepathic Insight',
        description: 'You have advantage on Wisdom and Charisma saving throws.',
        tags: ['race'],
    },
];

async function addMissingTraits() {
    console.log('🔍 Checking for existing traits...');

    // Get existing traits
    const existingTraits = await client.fetch(`*[_type == "trait"]{name}`);
    const existingNames = new Set(existingTraits.map((t: { name: string }) => t.name.toLowerCase()));

    // Filter to only new traits
    const newTraits = MISSING_TRAITS.filter(t => !existingNames.has(t.name.toLowerCase()));

    console.log(`Found ${existingTraits.length} existing traits`);
    console.log(`Adding ${newTraits.length} new traits\n`);

    if (newTraits.length === 0) {
        console.log('No new traits to add!');
        return;
    }

    const documents = newTraits.map(trait => ({
        _id: `trait-${toSanityId(trait.name)}`,
        _type: 'trait',
        name: trait.name,
        slug: { _type: 'slug', current: toSanityId(trait.name) },
        description: trait.description,
        tags: trait.tags,
        level: 1,
        source: 'Official',
        edition: 'Both',
        version: 1,
    }));

    // Batch create
    const transaction = client.transaction();
    for (const doc of documents) {
        transaction.createOrReplace(doc);
    }
    await transaction.commit();

    console.log(`✅ Created ${documents.length} new traits:`);
    for (const trait of newTraits) {
        console.log(`  - ${trait.name}`);
    }
}

async function run() {
    console.log('🚀 Adding Missing Race Traits');
    console.log('='.repeat(50));

    try {
        await addMissingTraits();
        console.log('\n🎉 Done!');
    } catch (error) {
        console.error('❌ Failed:', error);
        process.exit(1);
    }
}

run();
