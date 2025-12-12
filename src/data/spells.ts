import { Spell } from "../types/dnd-types";

export const SPELLS: Spell[] = [
  {
    "id": "a-distant-cry",
    "name": "A Distant Cry",
    "level": 3,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true
    },
    "duration": "Concentration, up to 1 hour You are surrounded by a haunting, voiceless voice from the Plane of Darkness that whispers cold secrets in your ears",
    "concentration": true,
    "ritual": false,
    "description": "3rd-level Conjuration Range: Self Components: V, S, M Duration: Concentration, up to 1 hour You are surrounded by a haunting, voiceless voice from the Plane of Darkness that whispers cold secrets in your ears. For the duration of the spell you have disadvantage on Perception checks that rely on your sense of hearing; you deal an extra 2d6 cold damage to a target whenever you hit it with an attack; and you gain the benefit of half cover against any attack, spell or effect targeting you.",
    "higherLevels": "When you cast this spell using a spell slot of 4th level, you can maintain your concentration on the spell for up to 8 hours. When you use a spell slot of 5th level or higher, you can maintain your concentration on the spell for up to 24 hours.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Lion Banner Games",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "abberate",
    "name": "Abberate",
    "level": 2,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "1 minute This spell causes your anatomy to become fluid, constantly refreshing into new and more terrible shapes",
    "concentration": false,
    "ritual": false,
    "description": "2nd-level transmutation Casting Time: 1 action Range: Self Components: V, S Duration: 1 minute This spell causes your anatomy to become fluid, constantly refreshing into new and more terrible shapes. For the duration, you do not take extra damage from critical hits. Additionally, your body adapts to threats as it warps. Immediately after you take damage while this spell is active, you can use your reaction to gain resistance to that damage type until this spell ends or until you use this ability again to gain resistance to a different damage type. This resistance doesn’t apply to the triggering damage.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Mage Hand Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "abduct",
    "name": "Abduct",
    "level": 7,
    "school": "Conjuration",
    "castingTime": "1 minute",
    "range": "1 mile",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true
    },
    "duration": "1 hour This spell teleports a creature to your location",
    "concentration": false,
    "ritual": false,
    "description": "7th-level conjuration Casting Time: 1 minute Range: 1 mile Components: V, S, M (a silver saucer) Duration: 1 hour This spell teleports a creature to your location. Choose a creature within range that is known to you as the target of this spell. An unwilling creature can make a Charisma saving throw to resist this effect. The target is placed at a location of your choice within 30 feet of you. You choose if the target is sitting, standing, prone, or bound with nearby restraints. At the end of the spell’s duration, you can choose whether the target remains at your location or is teleported back to the location from which it was abducted.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Mage Hand Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "aberrate",
    "name": "Aberrate",
    "level": 2,
    "school": "Transmutation",
    "castingTime": "3 minutes",
    "range": "15 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true
    },
    "duration": "24 hours This spell can only be cast in moonlight",
    "concentration": false,
    "ritual": false,
    "description": "2nd-level (hag) transmutation Casting Time: 3 minutes Range: 15 feet Components: V, S, M (large pregnant herbivore, such as an cow, horse, or ox, which is ritually killed) Duration: 24 hours This spell can only be cast in moonlight. A hag will cast this spell on two of her minions or slaves who must be restrained, willing, or otherwise forced to keep within five feet of the sacrifice during the duration of the casting of aberrate. A hag will sometimes cast this on a captive as a form of punishment or short-term curse, as was seen in the story of Prince Vilhelm “Drippy” whose womanizing and carousing convinced his third wife to make a deal with the hag Broomhill; she captured Vilhelm and turned him into a grotesque mix of human and boar for a day. When this spell is cast, two creatures no larger than Medium in size merge together to create a grotesque creature as hideous as it is violent and deadly. An example of a bugbear and ettercap transformed into a grotesque can be found in the bestiary. Any two Medium sized creatures can be turned into a grotesque by using the spell aberrate. Grotesque Statistics To create your own grotesque, choose the more powerful creature as the base creature, then combine their Str and Con bonus modifiers into a new ability (Str 15 and Str 13 have the bonuses +2 and +1. When combined you need a stat that gives a +3: either Str 16 or Str 17). Combine Con the same way and use the worst ability choice for Dex, Int, Wis, and Chr. Then take creative license with the rest. The combined creature should be +1 CR of whichever creature was strongest. The grotesque in the bestiary was created using these guidelines.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Cruor Games",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "abeyed-discharge",
    "name": "Abeyed Discharge",
    "level": 4,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "120 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Concentration, up to 1 minute You conjure an eruption of force in the future",
    "concentration": true,
    "ritual": false,
    "description": "4th-level evocation Casting Time: 1 action Range: 120 feet Components: V, S Duration: Concentration, up to 1 minute You conjure an eruption of force in the future. Choose a point within range to be the center of the explosion, which can’t be detected. When your concentration on this spell ends, a 30-foot-radius sphere centered on the chosen point erupts with power. Each creature in the area must make a Constitution saving throw. A creature takes 5d8 force damage on a failed save, or half as much on a successful one.",
    "higherLevels": "When you cast this spell using a spell slot of 5th level or higher, the damage increases by 1d8 for each slot level above 4th.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Sterling Vermin Adventuring Co.",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "abhorrence",
    "name": "Abhorrence",
    "level": 0,
    "school": "Enchantment",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You temporarily make a creature within range less appealing to others. The target makes a Wisdom saving throw against your spell. On a successful save, the spell is ineffective. On a failed save, the next time the creature makes a Charisma check before the spell ends, roll a d6 and subtract the result from the roll. The spell then ends.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Kobold Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "abhorrent-apparition",
    "name": "Abhorrent Apparition",
    "level": 4,
    "school": "Illusion",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": false,
      "somatic": false,
      "material": true
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You imbue a terrifying visage onto a gourd and toss it ahead of you to a spot of your choosing within range. Each creature within 15 feet of that spot takes 6d8 psychic damage and becomes frightened of you for 1 minute; a successful Wisdom saving throw halves the damage and negates the fright. A creature frightened in this way repeats the saving throw at the end of each of its turns, ending the effect on itself on a success.",
    "higherLevels": "If you cast this spell using a spell slot of 5th level or higher, the damage increases by 1d8 for each slot level above 4th.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Kobold Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "abi-dalzims-horrid-wilting",
    "name": "Abi-Dalzim's Horrid Wilting",
    "level": 8,
    "school": "Necromancy",
    "castingTime": "1 action",
    "range": "150 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "8th-Level Necromancy Casting Time : 1 action Rang e: 15 0 feet Components: V, S, M (a bit of sponge) Duration : Instantaneous You draw the moisture from every creature in a 30-foot cube centered on a point you choose within range. Each creature in that area must make a Constitution saving throw. Constructs and undead aren’t affected, and plants and water elementals make this saving throw with disadvantage. A creature takes 10d8 necrotic damage on a failed save, or half as much damage on a successful one.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Official",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "abrupt-hug",
    "name": "Abrupt Hug",
    "level": 1,
    "school": "Transmutation",
    "castingTime": "1 reaction, which you take when you or a creature within 30 feet of you takes an Attack action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You or the creature taking the Attack action can immediately make an unarmed strike. In addition to dealing damage with the unarmed strike, the target can grapple the creature it hit with the unarmed strike.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Kobold Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "absolute-command",
    "name": "Absolute Command",
    "level": 4,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You can control a construct you have built with a challenge rating of 6 or less. You can manipulate objects with your construct as precisely as its construction allows, and you perceive its surroundings through its sensory inputs as if you inhabited its body. The construct uses the caster's Proficiency bonus (modified by the construct's Strength and Dexterity scores). You can use the manipulators of the construct to perform any number of skill-based tasks, using the construct's Strength and Dexterity modifiers when using skills based on those particular abilities. Your body remains immobile, as if paralyzed, for the duration of the spell. The construct must remain within 100 feet of you. If it moves beyond this distance, the spell immediately ends and the caster's mind returns to his body.",
    "higherLevels": "When you cast this spell using higher-level spell slots, you may control a construct with a challenge rating 2 higher for each slot level you use above 4th. The construct’s range also increases by 10 feet for each slot level.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Kobold Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "absorb-elements",
    "name": "Absorb Elements",
    "level": 1,
    "school": "Abjuration",
    "castingTime": "1 reaction, which you take when you take acid, cold, fire, lightning, or thunder damage",
    "range": "Self",
    "components": {
      "verbal": false,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "1st-Level Abjuration Casting Time : 1 reaction, which you take when you take acid, cold, fire, lightning, or thunder damage Rang e: Self Components: S Duration : 1 round The spell captures some of the incoming energy, lessening its effect on you and storing it for your next melee attack. You have resistance to the triggering damage type until the start of your next turn. Also, the first time you hit with a melee attack on your next turn, the target takes an extra 1d6 damage of the triggering type, and the spell ends.",
    "higherLevels": "When you cast this spell using a spell slot of 2nd level or higher, the extra damage increases by 1d6 for each slot level above 1st.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Official",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "absorb-light",
    "name": "Absorb Light",
    "level": 1,
    "school": "Abjuration",
    "castingTime": "1 action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "This spell was developed by a thieves’ guild in Heartforge, home of the Flamegazer Halflings. Their natural glow makes it hard for them to hide in the shadows, and this spell offers a solution to the problem. It can be used by other races, too, as long as the caster has a source of light. Any light emitted by one object the caster has on their body (or the body itself, if it emits light) is instantly suppressed. A torch’s flame still burns, and can set other items on fire, but it radiates no light anymore. Once per turn, as a bonus action, the caster can switch this effect on or off without ending the spell. If the spell has absorbed light for at least ten rounds (one minute), the caster can release this energy in one sudden flash as a bonus action. One target standing no more than five feet away has to succeed on a Constitution Saving Throw, or be blinded until the end of their next turn. Releasing the energy in this way instantly ends the spell.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Braythe RPG",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "absorb-material",
    "name": "Absorb Material",
    "level": 4,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Dream Realm Storytellers",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "absorbing-field",
    "name": "Absorbing Field",
    "level": 6,
    "school": "Abjuration",
    "castingTime": "1 action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You cloak yourself in a protective field that absorbs incoming magic, rejuvenating your spell slots. When you are the target of a spell (including spells that affect multiple targets, but not area spells such as fireball), make an ability check using your spellcasting ability. The DC equals 10 + the spell’s level. On a successful check, the spell has no effect on you and is absorbed by the field. You regain a spell slot of the same level as the spell that was cast against you. If you have no expended spell slots of that level, you don’t regain a spell slot, but this spell remains in effect. Even if the spell manages to bypass the field, you gain advantage on your saving throw.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Kobold Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "absorption",
    "name": "Absorption",
    "level": 3,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": false,
      "somatic": false,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You touch a willing creature and create a thin energy field around their body that sheds no light. For the duration, that creature has resistance to one elemental damage type of your choice: acid, cold, fire, lightning, or thunder.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Alligator Alley Entertainment",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "accelerate",
    "name": "Accelerate",
    "level": 3,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "Choose up to three willing creatures within range, which can include you. For the duration of the spell, each target’s walking speed is doubled. Each target can also use a bonus action on each of its turns to take the Dash action, and it has advantage on Dexterity saving throws.",
    "higherLevels": "When you cast this spell using a spell slot of 4th level or higher, you can affect one additional creature for each slot level above 3rd.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Kobold Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "accelerate-decelerate",
    "name": "Accelerate Decelerate",
    "level": 1,
    "school": "Transmutation",
    "castingTime": "1 reaction",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true
    },
    "duration": "Instantaneous This spell speeds up or slows down an attack the instant before it strikes, lessening or multiplying its force",
    "concentration": false,
    "ritual": false,
    "description": "1st-level transmutation (chronomancy) Casting Time: 1 reaction, which you take when a creature you can see within 60 feet is hit with an attack Range: 60 feet Components: V, S, M (a drop of oil or a drop of molasses) Duration: Instantaneous This spell speeds up or slows down an attack the instant before it strikes, lessening or multiplying its force. Accelerate. Increase the damage the target takes by 1d6 + your spellcasting ability modifier. Decelerate. Reduce the damage the target takes by 1d6 + your spellcasting ability modifier (to a minimum of 0 damage).",
    "higherLevels": "When you cast this spell using a spell slot of 2nd level or higher, the change in damage increases by 1d6 for each slot level above 1st.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Mage Hand Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "acceptance-in-the-world",
    "name": "Acceptance in the World",
    "level": 6,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "sight",
    "components": {
      "verbal": false,
      "somatic": false,
      "material": true
    },
    "duration": "2 hours Cost: 6 WP Cloaked in the mantle of the World’s Weave, the philosopher can fit in anywhere, making him or her the ultimate infiltrator",
    "concentration": false,
    "ritual": false,
    "description": "Acceptance in the World Requirements: Level 11 Casting Time: 1 action Range: sight Duration: 2 hours Cost: 6 WP Cloaked in the mantle of the World’s Weave, the philosopher can fit in anywhere, making him or her the ultimate infiltrator. As long as he doesn’t give himself away by offensive action or thoughtless speech to arouse suspicion, he will be accepted in any group’s midst as a matter of course, unquestioned. Should he draw attention to himself, matters change, granting another saving throw for each eligible target. A saving throw only applies if the infiltrated group has members of equal or higher level than the philosopher, otherwise acceptance will be automatic. Normally, each target with the required level is allowed a saving throw, though in those rare cases where that might be impractical (due to too many eligible targets) the GM can decide to just make one roll for the target group.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Vortex Verlag",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "accursed-act",
    "name": "Accursed Act",
    "level": 1,
    "school": "Enchantment",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true
    },
    "duration": "Concentration, up to 1 minute Lighting a candle, you speak dark curses in a lost tongue, directed at one creature you can see within range",
    "concentration": true,
    "ritual": false,
    "description": "1st-level enchantment Casting Time: 1 action Range: 60 feet Components: V, S, M (incense or a black candle) Duration: Concentration, up to 1 minute Lighting a candle, you speak dark curses in a lost tongue, directed at one creature you can see within range. That creature must make a Wisdom saving throw or be cursed for the duration. While cursed, the creature takes psychic damage once per turn equal to 1d8 + your spellcasting ability modifier whenever it attacks or casts a spell. If the target doesn’t attack or cast a spell on its turn, it can repeat its saving throw at the end of its turn, ending the effect on a success. A remove curse spell ends this curse early.",
    "higherLevels": "When you cast this spell using a spell slot of 2nd level or higher, you deal an additional 1d8 psychic damage for each slot level above 1st.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Mage Hand Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "acid-arrow",
    "name": "Acid Arrow",
    "level": 2,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "90 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "2nd level evocation Casting Time: 1 action Range: 90 feet Components: V, S, M (Powdered rhubarb leaf and an adder's stomach) Duration: Instantaneous Classes: Wizard A shimmering green arrow streaks toward a target within range and bursts in a spray of acid. Make a ranged spell attack against the target. On a hit, the target takes 4d4 acid damage immediately and 2d4 acid damage at the end of its next turn. On a miss, the arrow splashes the target with acid for half as much of the initial damage and no damage at the end of its next turn.",
    "higherLevels": "When you cast this spell using a spell slot of 3rd level or higher, the damage (both initial and later) increases by 1d4 for each slot level above 2nd.",
    "classes": [
      "wizard"
    ],
    "source": "Official",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "acid-barb",
    "name": "Acid Barb",
    "level": 0,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You launch bolt of acid at an object or creature within range. On a hit, the target takes 1d4 acid damage. At the beginning of your next turn the target takes an additional 1d4 acid damage. Damage dealt with this spell against an object is doubled. Both the initial and secondary damage increase by 1d4 when you reach 5th level (2d4/2d4), 11th level (3d4/3d4), and 17th level (4d4/4d4).",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "This Mind of Mine",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "acid-burn",
    "name": "Acid Burn",
    "level": 0,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "Self (15 ft ▽)",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You magically produce a spray of acidic formula in a 15-foot cone in front of you. All creatures in the cone must succeed on a Dexterity saving throw or take 1d6 acid damage. This spell's damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Ghostfire Gaming",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "acid-gate",
    "name": "Acid Gate",
    "level": 7,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You create a portal of swirling, acidic green vapor in an unoccupied space you can see. This portal connects with a target destination within 100 miles that you are personally familiar with and have seen with your own eyes, such as your wizard’s tower or an inn you have stayed at. You and up to three creatures of your choice can enter the portal and pass through it, arriving at the target destination (or within 10 feet of it, if it is currently occupied). If the target destination doesn’t exist or is inaccessible, the spell automatically fails and the gate doesn’t form. Any creature that tries to move through the gate, other than those selected by you when the spell was cast, takes 10d6 acid damage and is teleported 1d100 × 10 feet in a random, horizontal direction. If the creature makes a successful Intelligence saving throw, it can’t be teleported by this portal, but it still takes acid damage when it enters the acid-filled portal and every time it ends its turn in contact with it.",
    "higherLevels": "When you cast this spell using a spell slot of 8th level or higher, you can allow one additional creature to use the gate for each slot level above 7th.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Kobold Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "acid-rain",
    "name": "Acid Rain",
    "level": 5,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You unleash a storm of swirling acid in a cylinder 20 feet wide and 30 feet high, centered on a point you can see. The area is heavily obscured by the driving acidfall. A creature that starts its turn in the area or that enters the area for the first time on its turn takes 6d6 acid damage, or half as much damage if it makes a successful Dexterity saving throw. A creature takes half as much damage from the acid (as if it had made a successful saving throw) at the start of its first turn after leaving the affected area.",
    "higherLevels": "When you cast this spell using a spell slot of 6th level or higher, the damage increases by 1d6 for each slot level above 5th.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Kobold Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "acid-splash",
    "name": "Acid Splash",
    "level": 0,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You hurl a bubble of acid. Choose one creature within range, or choose two creatures within range that are within 5 feet of each other. A target must succeed on a Dexterity saving throw or take 1d6 acid damage.",
    "higherLevels": "This spell's damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).",
    "classes": [
      "sorcerer",
      "wizard",
      "artificer",
      "warmage",
      "apothecary",
      "blood-mage"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "acid-spray",
    "name": "Acid Spray",
    "level": 0,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "10 feet",
    "components": {
      "verbal": false,
      "somatic": false,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You spray a quick stream of acid toward a creature within range. The creature must succeed on a Dexterity saving throw or suffer 1d10 acid damage. This power’s damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Alligator Alley Entertainment",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "acrid-orb",
    "name": "Acrid Orb",
    "level": 1,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "60 feet ",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You create an orb of acid gel and fling it at one creature within range. Make a ranged spell attack against the target. On a hit, the target takes 2d6 acid damage. Whether the attack hits or misses, the orb explodes. The target and each creature within 5 feet of it must succeed on a Dexterity saving throw or take 2d6 acid damage.",
    "higherLevels": "When you cast this spell using a spell slot of 2nd level or higher, the exploding acid damage increases by 1d6 for each slot level above 1st.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Ghostfire Gaming",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "action",
    "name": "Action",
    "level": 1,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true
    },
    "duration": "1 round Choose a willing creature that you can see within range",
    "concentration": false,
    "ritual": false,
    "description": "1st-level transmutation (chronomancy) Casting Time: 1 action Range: 30 feet Components: V, S, M (a shaving of licorice root) Duration: 1 round Choose a willing creature that you can see within range. During its next turn, the target gains an additional action. That action can be used only to take the Attack (one weapon attack only), Dash, Disengage, Hide, or Use an Object action.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Mage Hand Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "acumen",
    "name": "Acumen",
    "level": 0,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You touch a willing creature. Once before the spell ends, the target can roll a d6 and add the result to one Wisdom check of its choice. It can roll the die before or after making the check. The spell then ends.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Kobold Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "adjust-position",
    "name": "Adjust Position",
    "level": 1,
    "school": "Transmutation",
    "castingTime": "1 bonus action",
    "range": "30 ft.",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You adjust the location of an ally to a better tactical position. You move one willing creature within range 5 feet. This movement does not provoke opportunity attacks. The creature moves bodily through the intervening space (as opposed to teleporting), so there can be no physical obstacle (such as a wall or a door) in the path.",
    "higherLevels": "When you cast this spell using a spell slot of 2nd level or higher, you can target an additional willing creature for each slot level above 1st.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Kobold Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "adjust-positioning",
    "name": "Adjust Positioning",
    "level": 1,
    "school": "Transmutation",
    "castingTime": "1 bonus action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Kobold Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "aegis",
    "name": "Aegis",
    "level": 0,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": false,
      "somatic": false,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You create a kinetic barrier around yourself to impair the impact from physical attacks. Until the end of your next turn, you have resistance against bludgeoning, piercing, and slashing damage dealt by weapon attacks. You also receive a +2 bonus to your Burst Save.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Alligator Alley Entertainment",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "aegis-of-honor",
    "name": "Aegis of Honor",
    "level": 1,
    "school": "Abjuration",
    "castingTime": "1 reaction, which you take when a friendly creature you can see within 30 feet of you takes damage from an attack",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false
    },
    "duration": "instantaneous You reach out toward the friendly target, placing a brief barrier between the target and the target’s attacker",
    "concentration": false,
    "ritual": false,
    "description": "1st-level abjuration Casting time: 1 reaction, which you take when a friendly creature you can see within 30 feet of you takes damage from an attack Range: 30 feet Components: v Duration: instantaneous You reach out toward the friendly target, placing a brief barrier between the target and the target’s attacker. The damage the target takes is reduced by 1d6 + your spellcasting ability modifier. If this effect reduces the damage to 0, you can turn the damage back on the attacker. Make a ranged spell attack against the attacker. On a hit, the attacker takes force damage equal to the amount of damage you reduced. At higher levels. When you cast this spell using a spell slot of 2nd level or higher, the damage the target takes is reduced by an additional 1d6 for each slot level above 1st.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Kobold Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "aerial-alacrity",
    "name": "Aerial Alacrity",
    "level": 2,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true
    },
    "duration": "10 minutes Target a willing creature you can see within range that has a flying speed (including one with a temporary or magically bestowed flying speed)",
    "concentration": false,
    "ritual": false,
    "description": "2nd-level transmutation Casting Time: 1 action Range: 60 feet Components: V, S, M (a feather from a bird of prey) Duration: 10 minutes Target a willing creature you can see within range that has a flying speed (including one with a temporary or magically bestowed flying speed). That creature gains the following benefits for the duration: The target can take the Dash action as a bonus action. The target can hover. The target has advantage on Dexterity (Acrobatics) checks. The target doesn’t provoke opportunity attacks when it flies out of an enemy’s reach.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Mage Hand Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "aether-shroud",
    "name": "Aether Shroud",
    "level": 0,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Ghostfire Gaming",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "aether-soul-link",
    "name": "Aether Soul-Link",
    "level": 2,
    "school": "Necromancy",
    "castingTime": "Reaction",
    "range": "Self",
    "components": {
      "verbal": false,
      "somatic": false,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Ghostfire Gaming",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "aetherial-rift",
    "name": "Aetherial Rift",
    "level": 6,
    "school": "Conjuration",
    "castingTime": "1 minute",
    "range": "10 miles",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Ghostfire Gaming",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "aetheric-adaptation",
    "name": "Aetheric Adaptation",
    "level": 2,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Ghostfire Gaming",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "aetheric-bedlam",
    "name": "Aetheric Bedlam",
    "level": 4,
    "school": "Abjuration",
    "castingTime": "1 action ",
    "range": "Self (60 ft ○)",
    "components": {
      "verbal": false,
      "somatic": true,
      "material": true
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Ghostfire Gaming",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "aetheric-communion",
    "name": "Aetheric Communion",
    "level": 3,
    "school": "Divination",
    "castingTime": "1 minute",
    "range": "Unlimited in the Aetherial Expanse",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Ghostfire Gaming",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "afflict-line",
    "name": "Afflict Line",
    "level": 9,
    "school": "Necromancy",
    "castingTime": "1 hour",
    "range": "1 mile",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": true,
    "description": "You invoke the darkest curses upon your victim and his or her descendants. This spell does not require that you have a clear path to your target, only that your target is within range. Your target must make a successful Wisdom saving throw or be cursed until the magic is dispelled. The victim has disadvantage on ability checks and saving throws made with the ability score that you choose when you cast the spell. In addition, the target's firstborn offspring is also targeted by the curse. The firstborn is allowed a saving throw of their own if they currently live, or they make one upon their birth if they're not yet born when the spell is cast. If the target's firstborn has already died, the curse passes to their next oldest offspring. Ritual Focus. If you expend your ritual focus, the curse becomes hereditary, passing from firstborn to firstborn for the entire length of the family's lineage until one of them successfully saves against the curse and throws off your dark magic.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Kobold Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "after-image",
    "name": "After Image",
    "level": 3,
    "school": "Illusion",
    "castingTime": "1 action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true
    },
    "duration": "10 minutes You create an illusory duplicate of yourself which follows your every movement",
    "concentration": false,
    "ritual": false,
    "description": "3rd-level illusion Casting Time: 1 action Range: Self Components: V, S, M (a silver hand mirror worth 50 gp) Duration: 10 minutes You create an illusory duplicate of yourself which follows your every movement. When you are hit by an attack during the spell’s duration, roll any die. On an odd roll, the attack targets and hits the duplicate instead of you. The duplicate vanishes, reappearing after you move 10 feet or more or take the Dodge action. On an even roll, the attack targets you as normal.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Mage Hand Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "aganazzars-scorcher",
    "name": "Aganazzar's Scorcher",
    "level": 2,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true
    },
    "duration": "Instantaneous A line of roaring flame 30 feet long and 5 feet wide emanates from you in a direction you choose",
    "concentration": false,
    "ritual": false,
    "description": "2nd-Level Evocation Casting Time: 1 action Range: 30 feet Components: V, S, M (A red dragon's scale) Duration: Instantaneous A line of roaring flame 30 feet long and 5 feet wide emanates from you in a direction you choose. Each creature in the line must make a Dexterity saving throw. A creature takes 3d8 fire damage on a failed save, or half as much damage on a successful one.",
    "higherLevels": "When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d8 for each slot level above 2nd.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Official",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "agglutination",
    "name": "Agglutination",
    "level": 0,
    "school": "Conjuration",
    "castingTime": "1 bonus action",
    "range": "60 feet",
    "components": {
      "verbal": false,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Dream Realm Storytellers",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "agility",
    "name": "Agility",
    "level": 8,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false
    },
    "duration": "1 hour Until the spell ends, when you make a Dexterity check, you can replace the number you roll with a 15",
    "concentration": false,
    "ritual": false,
    "description": "8th-level transmutation Casting Time: 1 action Range: Self Components: V Duration: 1 hour Until the spell ends, when you make a Dexterity check, you can replace the number you roll with a 15. Additionally, moving through any form of difficult terrain costs you no extra movement.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Sterling Vermin Adventuring Co.",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "agonizing-eternity",
    "name": "Agonizing Eternity",
    "level": 9,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Concentration, up to 1 minute (special) You point at a creature in range, twisting and warping its body",
    "concentration": true,
    "ritual": false,
    "description": "9th-level transmutation Casting Time: 1 action Range: 60 feet Components: V, S Duration: Concentration, up to 1 minute (special) You point at a creature in range, twisting and warping its body. The target must make a Constitution saving throw or be trapped for an eternity, wracked forever with excruciating pain. The target is rendered helpless, but has no need to eat, drink, or sleep, and ceases to age. Until the spell ends, the creature is considered incapacitated. If you maintain concentration for the full duration, the spell becomes permanent. For each day the target remains in the spell, each of its ability scores decrease by 1 until all scores are reduced to 0, except for Constitution, which is held at 1. The subject is unable to heal or regenerate, and becomes completely unaware of its surroundings as it becomes incapable of comprehending anything beyond its excruciating existence. On a successful saving throw, or if the spell ends before it is made permanent, the creature instead takes 5d6 points of psychic damage, and takes a -2 penalty to attack rolls, saving throws, skill checks, and ability checks for 1 minute. This penalty is considered an Injury of Deadly IIII severity.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Lone Colossus Games",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "agonizing-mark",
    "name": "Agonizing Mark",
    "level": 1,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": false,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You choose a creature you can see within range to mark as your prey, and a jagged ray of black energy issues forth from you. Until the spell ends, each time you deal damage to the target it must make a Charisma saving throw. On a failed save, it falls prone as its body is filled with torturous agony.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Kobold Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "aid",
    "name": "Aid",
    "level": 2,
    "school": "Abjuration",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a tiny strip of white cloth"
    },
    "duration": "8 hours",
    "concentration": false,
    "ritual": false,
    "description": "Your spell bolsters your allies with toughness and resolve. Choose up to three creatures within range. Each target's hit point maximum and current hit points increase by 5 for the duration.",
    "higherLevels": "When you cast this spell using a spell slot of 3rd level or higher, a target's hit points increase by an additional 5 for each slot level above 2nd.",
    "classes": [
      "cleric",
      "paladin",
      "artificer"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "air-bubble",
    "name": "Air Bubble",
    "level": 2,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": false,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "2nd-Level Conjuration Casting Time : 1 action Rang e: 60 feet Components: S Duration : 24 hours You create a spectral globe around the head of a willing creature you can see within range. The globe is filled with fresh air that lasts until the spell ends. If the creature has more than one head, the globe of air appears around only one of its heads (which is all the creature needs to avoid suffocation, assuming that all its heads share the same respiratory system).",
    "higherLevels": "When you cast this spell using a spell slot of 3rd level or higher, you can create two additional globes of fresh air for each slot level above 2nd.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Official",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "alabasters-adaptation-for-the-world-below",
    "name": "Alabaster's Adaptation for the World Below",
    "level": 6,
    "school": "Transmutation",
    "castingTime": "1 hour",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "I have made numerous adaptation spells, each for a different locale, but this one is the newest and so—I hope—the most reliable! Heading to the World Below to find a purple worm nest or trade with deep gnomes? Be sure to prepare accordingly! You adapt the physiology of a willing creature you touch to the dangers of the World Below, altering the creature so they can traverse the plane more safely. The spell reprograms nerves, grows a lining of lead in the skull, changes body chemistry, and more. It can also create up to three cosmetic changes determined by the caster, such as pointed ears, plaid skin, or sharp teeth. For the duration, the creature gains the following benefits: The creature gains darkvision out to a range of 120 feet and tremorsense to a range of 60 feet. The creature has advantage on Wisdom (Perception) and Dexterity (Stealth) checks. The creature gains immunity to poison damage and the poisoned condition, and resistance to psychic damage. The creature gains a climbing speed equal to its walking speed and can move up, down, and across vertical surfaces and upside down along ceilings, while leaving its hands free. The creature can sweat acid. As an action, the creature can expend a Hit Die by rolling it, (and doesn’t add its Constitution modifier). The creature takes acid damage equal to the result, and any other creatures or nonmagical objects touching it take twice that amount of acid damage. The acid evaporates after this damage is dealt. This acid instantly destroys any web it touches, such as those created by the web spell. In addition, the acid corrodes any nonmagical armor worn by the creature, which takes a permanent and cumulative −1 penalty to the AC it offers. The armor is destroyed if the penalty reduces its AC to 10. However, the creature can produce this acid selectively on its body, i.e., only around its wrists and ankles. Another creature or object only takes acid damage if they are in contact with where the creature produces the acid.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "MCDM Productions",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "alabasters-adjacent-acquisition",
    "name": "Alabaster's Adjacent Acquisition",
    "level": 1,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "One of my first spells, and I believe still one of my best. Originally devised as a method to retrieve tea from my study without getting up, I’ve found that adjacent acquisition is more useful than it has any right to be. Things I have used this spell to retrieve include an enchanted tiara, a kobold egg, a half-digested book, and a stray fingerbone. One Tiny object within range teleports directly into your hand, even if that object is carried or worn by another creature. If you can’t see the object, there is a 50% chance that you conjure a different object within range by mistake, chosen by the GM. The spell is not without a sense of irony. If you attempt to conjure an object that is physically connected to another object—such as a cog within a complex machine or the deadlock off a door—there is only a 5% chance that the spell is able to break the object free of its surroundings and successfully conjure it. If you’re using the Avarice domain or Oath of Acquisitions from “Goldmonger Subclasses” in this issue, this spell makes a great addition to their spell lists as well.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "MCDM Productions",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "alarm",
    "name": "Alarm",
    "level": 1,
    "school": "Abjuration",
    "castingTime": "1 minute",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a tiny bell and a piece of fine silver wire"
    },
    "duration": "8 hours",
    "concentration": false,
    "ritual": true,
    "description": "You set an alarm against unwanted intrusion. Choose a door, a window, or an area within range that is no larger than a 20-foot cube. Until the spell ends, an alarm alerts you whenever a tiny or larger creature touches or enters the warded area. When you cast the spell, you can designate creatures that won’t set off the alarm. You also choose whether the alarm is mental or audible.",
    "classes": [
      "ranger",
      "wizard",
      "artificer",
      "warmage"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "alchemical-form",
    "name": "Alchemical Form",
    "level": 6,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You transform into an amoebic form composed of highly acidic and poisonous alchemical jelly. While in this form: you are immune to acid and poison damage and to the poisoned and stunned conditions; you have resistance to nonmagical fire, piercing, and slashing damage; you can’t speak, cast spells, use items or weapons, or manipulate objects; your gear melds into your body and reappears when the spell ends; you don't need to breathe; your speed is 20 feet; your size doesn’t change, but you can move through and between obstructions as if you were two size categories smaller; and you gain the following action: Melee Weapon Attack: spellcasting ability modifier + proficiency bonus to hit, range 5 ft., one target; Hit: 4d6 acid or poison damage (your choice), and the target must make a successful Constitution saving throw or be poisoned until the start of your next turn.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Kobold Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "ale-dritch-blast",
    "name": "Ale-Dritch Blast",
    "level": 0,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "60 ft.",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Kobold Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "allure",
    "name": "Allure",
    "level": 0,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You touch a willing creature. Once before the spell ends, the target can roll a d6 and add the result to one Charisma check of its choice. It can roll the die before or after making the check. The spell then ends.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Kobold Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "ally-aegis",
    "name": "Ally Aegis",
    "level": 6,
    "school": "Abjuration",
    "castingTime": "1 reaction, which you take when your ally is hit by an attack or is targeted by a spell that deals damage other than psychic damage.",
    "range": "60 ft.",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "When you see an ally within range in imminent danger, you can use your reaction to protect that creature with a shield of magical force. Until the start of your next turn, your ally has a +5 bonus to AC, including against the triggering attack. In addition, if your ally must make a saving throw against an enemy’s spell that deals damage, the ally takes half as much damage on a failed saving throw and no damage on a successful save. Ally aegis offers no protection, however, against psychic damage from any source.",
    "higherLevels": "When you cast this spell using a spell slot of 7th level or higher, you can target one additional ally for each slot level above 6th.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Kobold Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "alone",
    "name": "Alone",
    "level": 3,
    "school": "Enchantment",
    "castingTime": "1 action",
    "range": "30 ft.",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You cause a creature within range to believe its allies have been banished to a different realm. The target must succeed on a Wisdom saving throw, or it treats its allies as if they were invisible and silenced. The affected creature cannot target, perceive, or otherwise interact with its allies for the duration of the spell. If one of its allies hits it with a melee attack, the affected creature can make another Wisdom saving throw. On a successful save, the spell ends.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Kobold Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "alter-arrows-fortune",
    "name": "Alter Arrow's Fortune",
    "level": 1,
    "school": "Divination",
    "castingTime": "1 reaction, when an enemy makes a ranged attack that hit",
    "range": "100 feet",
    "components": {
      "verbal": false,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "1st-level divination (bard, cleric, druid, ranger, sorcerer, wizard) Casting Time : 1 reaction, when an enemy makes a ranged attack that hits Range : 100 feet Components : S Duration : Instantaneous You clap your hands, setting off a chain of tiny events that culminate in throwing off an enemy’s aim. When an enemy makes a ranged attack (weapon or spell) that hits one of your allies, this spell causes the enemy to repeat the attack roll unless the enemy makes a successful Charisma saving throw. The attack is resolved using the lower of the two rolls (effectively giving the enemy disadvantage on the attack).",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Kobold Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "alter-form",
    "name": "Alter Form",
    "level": 2,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "Self",
    "components": {
      "verbal": false,
      "somatic": false,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You assume a different form. When you activate this power, choose one of the following options, the effects of which last for the duration. While the effect lasts, you can end one option as an action to gain the benefits of a different one. Aquatic Adaptation. You adapt your body to an aquatic environment, sprouting gills and growing webbing between your fingers. You can breathe underwater and gain a swimming speed equal to your walking speed. Change Appearance. You transform your appearance. You decide what you look like, including your height, weight, facial features, sound of your voice, hair length, coloration, and distinguishing characteristics, if any. You can make yourself appear as a member of another species, though none of your statistics change. You also can’t appear as a creature of a different size than you, and your basic shape stays the same; if you’re bipedal, you can’t use this power to become quadrupedal, for instance. At any time for the duration of the talent, you can use your action to change your appearance in this way again. Low-Gravity Adaptation. You adapt your body to function in little to no gravity, becoming a lithe, malleable shape with webbed hands and feet. While in Zero-G, if you are wearing light or no armor, you gain a fly speed equal to your walking speed. This form does not enable you to survive in the vacuum of space. Natural Weapons. You grow claws, fangs, spines, horns, or a different natural weapon of your choice. Your unarmed strikes deal 1d6 bludgeoning, piercing, or slashing damage, as appropriate to the natural weapon you chose, and you are proficient with your unarmed strikes. Finally, the natural weapon is considered to be forge enhanced and you have a +1 bonus to the attack and damage rolls you make using it.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Alligator Alley Entertainment",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "alter-self",
    "name": "Alter Self",
    "level": 2,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Concentration, up to 1 hour",
    "concentration": true,
    "ritual": false,
    "description": "You assume a different form. When you cast the spell, choose one of the following options, the effects of which last for the duration of the spell. Aquatic Adaptation: You adapt your body to an aquatic environment, sprouting gills and growing webbing between your fingers. You can breathe underwater and gain a swimming speed equal to your walking speed. Change Appearance: You transform your appearance. You decide what you look like, including your height, weight, facial features, sound of your voice, hair length, coloration, and distinguishing characteristics. Natural Weapons: You grow claws, fangs, spines, horns, or a different natural weapon of your choice. Your unarmed strikes deal 1d6 bludgeoning, piercing, or slashing damage, as appropriate to the natural weapon you chose, and you are proficient with your unarmed strikes.",
    "classes": [
      "sorcerer",
      "wizard",
      "artificer"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "alter-time-flow",
    "name": "Alter Time Flow",
    "level": 7,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "Self (30 ○)",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You control the currents of time, affecting all creatures within 30 feet of yourself. You can choose to deliver either a haste or slow effect (as the spell) to each creature in the area. An unwilling creature makes a Constitution saving throw, avoiding the effect on a success. Each unwilling creature must make a new saving throw if it remains in the affected area at the end of its turn. Any affected creature returns to normal if it exits the area, but if a creature reenters the area while the spell is still active, it is subject to the effect of the spell (and receives another saving throw, if unwilling).",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Kobold Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "altheas-travel-tent",
    "name": "Althea's Travel Tent",
    "level": 2,
    "school": "Conjuration",
    "castingTime": "5 minutes",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You touch an ordinary, properly pitched canvas tent to create a space where you and a companion can sleep in comfort. From the outside, the tent appears normal, but inside it has a small foyer and a larger bedchamber. The foyer contains a writing desk with a chair; the bedchamber holds a soft bed large enough to sleep two, a small nightstand with a candle, and a small clothes rack. The floor of both rooms is a clean, dry, hard-packed version of the local ground. When the spell ends, the tent and the ground return to normal, and any creatures inside the tent are expelled to the nearest unoccupied spaces.",
    "higherLevels": "When the spell is cast using a 3rd-level slot, the foyer becomes a dining area with seats for six and enough floor space for six people to sleep, if they bring their own bedding. The sleeping room is unchanged. With a 4th-level slot, the temperature inside the tent is comfortable regardless of the outside temperature, and the dining area includes a small kitchen. With a 5th-level slot, an unseen servant is conjured to prepare and serve food (from your supplies). With a 6th-level slot, a third room is added that has three two-person beds. With a slot of 7th level or higher, the dining area and second sleeping area can each accommodate eight persons.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Kobold Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "altruistic-sacrifice",
    "name": "Altruistic Sacrifice",
    "level": 1,
    "school": "Necromancy",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true
    },
    "duration": "Instantaneous You touch a creature that has died within the last minute and transfer your own life force into it",
    "concentration": false,
    "ritual": false,
    "description": "1st-level necromancy Casting Time: 1 action Range: Touch Components: V, S, M (a ritual dagger, which you plunge into your own heart) Duration: Instantaneous You touch a creature that has died within the last minute and transfer your own life force into it. You immediately die, and that creature returns to life with a number of hit points equal to the hit points you had when you cast this spell. This spell can’t return a creature to life that has died of old age, nor can it restore any missing body parts.",
    "higherLevels": "If you cast this spell using a spell slot of 5th through 8th level, you can choose to drop to 0 hit points and begin making death saving throws instead of immediately dying. If you cast this spell using a 9th level spell slot, the spell’s range changes to 30 feet, and you can target any number of creatures you can see within range.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Sterling Vermin Adventuring Co.",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "amanuensis",
    "name": "Amanuensis",
    "level": 1,
    "school": "Conjuration",
    "castingTime": "1 minute",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You cause the writing or illustrations from one source such as a book, scroll, map, or tablet to appear copied onto a piece of parchment (the spell's material component). This spell copies up to 250 words of text, enough to fill one page with text. A copied illustration counts as a number of words proportional to the amount of the page it requires. If this spell is used to copy a scroll or page from a spellbook, it copies the exact text but not the magical nature of the copied text.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "This Mind of Mine",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "ambush",
    "name": "Ambush",
    "level": 1,
    "school": "Illusion",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": false,
      "somatic": true,
      "material": true
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "The forest floor swirls and shifts around you to welcome you into its embrace. While in a forest, you have advantage on Dexterity (Stealth) checks to Hide. While hidden in a forest, you have advantage on your next Initiative check. The spell ends if you attack or cast a spell.",
    "higherLevels": "When you cast this spell using a spell slot of 2nd-level or higher, you can affect one additional creature for each slot level above 1st. The spell ends if you or any target of this spell attacks or casts a spell.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Kobold Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "ambush-chute",
    "name": "Ambush Chute",
    "level": 3,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You touch a wooden, plaster, or stone surface and create a passage with two trapdoors. The first trapdoor appears where you touch the surface, and the other appears at a point you can see up to 30 feet away. The two trapdoors can be wooden with a metal ring handle, or they can match the surrounding surfaces, each with a small notch for opening the door. The two trapdoors are connected by an extradimensional passage that is up to 5 feet wide, up to 5 feet tall, and up to 30 feet long. The trapdoors don’t need to be on the same surface, allowing the passage to connect two separated locations, such as the two sides of a chasm or river. The passage is always straight and level for creatures inside it, and the creatures exit the tunnel in such a way that allows them to maintain the same orientation as when they entered the passage. No more than five creatures can transit the passage at the same time. When the spell ends and the trapdoors disappear, any creatures or objects still in the passage created by the spell are safely ejected to an unoccupied space nearest the end of the passage closest to them.",
    "higherLevels": "When you cast this spell using a spell slot of 4th level or higher, the length of the passage and the distance you can place the second trapdoor increases by 10 feet for each slot level above 3rd.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Kobold Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "ambush-prey",
    "name": "Ambush Prey",
    "level": 2,
    "school": "Illusion",
    "castingTime": "1 action",
    "range": "Self",
    "components": {
      "verbal": false,
      "somatic": true,
      "material": true
    },
    "duration": "1 hour You channel primal predatory energies to perfectly conceal your presence in order to surprise your target",
    "concentration": false,
    "ritual": false,
    "description": "2nd-level illusion Casting Time: 1 action Range: Self Components: S, M (a broken twig) Duration: 1 hour You channel primal predatory energies to perfectly conceal your presence in order to surprise your target. You become invisible for the spell’s duration, granting advantage on all Dexterity (Stealth) checks to remain hidden. The invisibility will last for the duration of the spell, however, moving 5 feet or more from your position when you cast the spell will end the effect. As long as you remain invisible, the first attack you make against any target who is unaware of your presence deals an additional 1d6 points of damage. This attack ends the spell.",
    "higherLevels": "When you cast this spell using a spell slot above 2nd level, the damage of your first attack increases by 1d6 for every slot level above 2nd.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Hit Point Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "ambushers-regret",
    "name": "Ambusher's Regret",
    "level": 1,
    "school": "Evocation",
    "castingTime": "1 reaction, which you take when you are hit by a ranged attack from an attacker you can’t see",
    "range": "120 feet",
    "components": {
      "verbal": false,
      "somatic": true,
      "material": false
    },
    "duration": "1 round You release an arcane arrow that traces the path of the triggering attack back to your unseen attacker, provided the attacker is in range",
    "concentration": false,
    "ritual": false,
    "description": "1st-level evocation Casting time: 1 reaction, which you take when you are hit by a ranged attack from an attacker you can’t see Range: 120 feet Components: s Duration: 1 round You release an arcane arrow that traces the path of the triggering attack back to your unseen attacker, provided the attacker is in range. That creature must succeed on a dexterity saving throw or be outlined in light until the end of your next turn. While outlined in light, the creature sheds dim light in a 10-foot radius, any attack roll against it is made with advantage if the attacker can see the creature, and the creature can’t benefit from being invisible.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Kobold Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "ameliorate",
    "name": "Ameliorate",
    "level": 1,
    "school": "Abjuration",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Dream Realm Storytellers",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "ammunition-retrieval",
    "name": "Ammunition Retrieval",
    "level": 0,
    "school": "Transmutation",
    "castingTime": "1 reaction, which you take when you miss a ranged weapon attack with a weapon with the ammunition tag",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": true
    },
    "duration": "10 minutes The piece of ammunition from the missed attack falls on the ground upright and remains intact",
    "concentration": false,
    "ritual": false,
    "description": "Transmutation cantrip Casting Time: 1 reaction, which you take when you miss a ranged weapon attack with a weapon with the ammunition tag Range: Self Components: V, M (one piece of ammunition) Duration: 10 minutes The piece of ammunition from the missed attack falls on the ground upright and remains intact. If you look for it before the spell ends, you can immediately sense its location in a 500-foot radius. If you cast this spell multiple times, you can have up to three pieces of ammunition affected at a time.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Cruor Games",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "amplify-ability",
    "name": "Amplify Ability",
    "level": 0,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": false,
      "somatic": false,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You inject a booster into one willing creature. Once during the duration, the target can roll a d4 and add the number rolled to one ability check of its choice. It can roll the die before or after making the ability check. The effect then ends.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Alligator Alley Entertainment",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "amplify-gravity",
    "name": "Amplify Gravity",
    "level": 7,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "100 ft.",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "This spell intensifies gravity in a 50-foot-radius area within range. Inside the area, damage from falling is quadrupled (2d6 per 5 feet fallen) and maximum damage from falling is 40d6. Any creature on the ground in the area when the spell is cast must make a successful Strength saving throw or be knocked prone; the same applies to a creature that enters the area or ends its turn in the area. A prone creature in the area must make a successful Strength saving throw to stand up. A creature on the ground in the area moves at half speed and has disadvantage on Dexterity checks and ranged attack rolls.",
    "classes": [
      "wizard",
      "sorcerer"
    ],
    "source": "Kobold Press",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "animal-friendship",
    "name": "Animal Friendship",
    "level": 1,
    "school": "Enchantment",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a morsel of food"
    },
    "duration": "24 hours",
    "concentration": false,
    "ritual": false,
    "description": "This spell lets you convince a beast that you mean it no harm. Choose a beast that you can see within range. It must see and hear you. If the beast’s Intelligence is 4 or higher, the spell fails. Otherwise, the beast must succeed on a Wisdom saving throw or be charmed by you for the spell’s duration. If you or one of your companions harms the target, the spell ends.",
    "higherLevels": "When you cast this spell using a spell slot of 2nd level or higher, you can affect one additional beast for each slot level above 1st.",
    "classes": [
      "bard",
      "druid",
      "ranger",
      "witch"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "animal-messenger",
    "name": "Animal Messenger",
    "level": 2,
    "school": "Enchantment",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a morsel of food"
    },
    "duration": "24 hours",
    "concentration": false,
    "ritual": true,
    "description": "By means of this spell, you use an animal to deliver a message. Choose a Tiny beast you can see within range, such as a squirrel, a blue jay, or a bat. You specify a location, which you must have visited, and a recipient who matches a general description. You scream a message of twenty-five words or less, and the beast travels for the duration of the spell toward the specified location, covering about 50 miles per 24 hours for a flying messenger, or 25 miles for other animals.",
    "higherLevels": "If you cast this spell using a spell slot of 3rd level or higher, the duration of the spell increases by 48 hours for each slot level above 2nd.",
    "classes": [
      "bard",
      "druid",
      "ranger"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "animate-dead",
    "name": "Animate Dead",
    "level": 3,
    "school": "Necromancy",
    "castingTime": "1 minute",
    "range": "10 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a drop of blood, a piece of flesh, and a pinch of bone dust"
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "This spell creates an undead servant. Choose a pile of bones or a corpse of a Medium or Small humanoid within range. Your spell imbues the target with a foul mimicry of life, raising it as an undead creature. The target becomes a skeleton if you chose bones or a zombie if you chose a corpse (the DM has the creature's game statistics). On each of your turns, you can use a bonus action to mentally command any creature you made with this spell if the creature is within 60 feet of you (if you control multiple creatures, you can command any or all of them at the same time, issuing the same command to each one). You decide what action the creature will take and where it will move during its next turn, or you can issue a general command, such as to guard a particular chamber or corridor. If you issue no commands, the creature only defends itself against hostile creatures. Once given an order, the creature continues to follow it until its task is complete. The creature is under your control for 24 hours, after which it stops obeying any command you've given it. To maintain control of the creature for another 24 hours, you must cast this spell on the creature again before the current 24-hour period ends. This use of the spell reasserts your control over up to four creatures you have animated with this spell, rather than animating a new one.",
    "higherLevels": "When you cast this spell using a spell slot of 4th level or higher, you animate or reassert control over two additional undead creatures for each slot level above 3rd. Each of the creatures must come from a different corpse or pile of bones.",
    "classes": [
      "cleric",
      "wizard",
      "necromancer",
      "apothecary"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "arcane-lock",
    "name": "Arcane Lock",
    "level": 2,
    "school": "Abjuration",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true
    },
    "duration": "Until dispelled",
    "concentration": false,
    "ritual": false,
    "description": "You touch a closed door, window, gate, chest, or other entryway, and it becomes locked for the duration. You and the creatures you designate when you cast this spell can open the object normally. You can also set a password that, when spoken within 5 feet of the object, suppresses this spell for 1 minute. Otherwise, it is impassable until it is broken or the spell is dispelled or suppressed. Casting knock on the object suppresses arcane lock for 10 minutes. While affected by this spell, the object is more difficult to break or force open; the DC to break it or pick any locks on it increases by 10.",
    "classes": [
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "arcanists-magic-aura",
    "name": "Arcanist's Magic Aura",
    "level": 2,
    "school": "Illusion",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a small square of silk"
    },
    "duration": "24 hours",
    "concentration": false,
    "ritual": false,
    "description": "You place an illusion on a creature or an object you touch so that divination spells reveal false information about it. The target can be a willing creature or an object that isn’t being carried or worn by another creature. When you cast the spell, choose one or both of the following effects. False Aura: You change the way the target appears to spells and magical effects that detect creature types or remove information. Mask: You change the way the target appears to spells and magical effects that detect creature types, such as a paladin’s Divine Sense or the trigger of a symbol spell.",
    "classes": [
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "armor-of-agathys",
    "name": "Armor of Agathys",
    "level": 1,
    "school": "Abjuration",
    "castingTime": "1 action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true
    },
    "duration": "1 hour",
    "concentration": false,
    "ritual": false,
    "description": "A protective magical force surrounds you, manifesting as a spectral frost that covers you and your gear. You gain 5 temporary hit points for the duration. If a creature hits you with a melee attack while you have these hit points, the creature takes 5 cold damage.",
    "higherLevels": "When you cast this spell using a spell slot of 2nd level or higher, both the temporary hit points and the cold damage increase by 5 for each slot level above 1st.",
    "classes": [
      "warlock"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "arms-of-hadar",
    "name": "Arms of Hadar",
    "level": 1,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "10 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false,
      "materialDescription": ""
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You invoke the power of Hadar, the Dark Hunger. Tendrils of dark energy erupt from you and batter all creatures within 10 feet of you. Each creature in that area must make a Strength saving throw. On a failed save, a target takes 2d6 necrotic damage and can't take reactions until its next turn. On a successful save, the creature takes half damage, but suffers no other effect.",
    "classes": [
      "warlock"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "augury",
    "name": "Augury",
    "level": 2,
    "school": "Divination",
    "castingTime": "1 minute",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "specially marked sticks, bones, or similar tokens worth at least 25 gp"
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": true,
    "description": "By casting gem-inlaid sticks, rolling dragon bones, laying out ornate cards, or employing some other divining tool, you receive an omen from an otherworldly entity about the results of a specific course of action that you plan to take within the next 30 minutes. The DM chooses from the following possible omens: Weal (good results), Woe (bad results), Weal and woe (both good and bad results), Nothing (results that aren’t especially good or bad).",
    "classes": [
      "cleric",
      "druid"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "bane",
    "name": "Bane",
    "level": 1,
    "school": "Enchantment",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a drop of blood"
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "Up to three creatures of your choice that you can see within range must make Charisma saving throws. Whenever a target that fails this saving throw makes an attack roll or a saving throw before the spell ends, the target must roll a d4 and subtract the number rolled from the attack roll or saving throw.",
    "higherLevels": "When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st.",
    "classes": [
      "bard",
      "cleric",
      "witch",
      "blood-mage",
      "illrigger",
      "necromancer"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "banishment",
    "name": "Banishment",
    "level": 4,
    "school": "Abjuration",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "an item distasteful to the target"
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "You attempt to send one creature that you can see within range to another plane of existence. The target must succeed on a Charisma saving throw or be banished. If the target is native to the plane of existence you're on, you banish the target to a harmless demiplane. If the target is native to a different plane of existence than the one you're on, the target is banished with a faint popping noise, returning to its home plane.",
    "higherLevels": "When you cast this spell using a spell slot of 5th level or higher, you can target one additional creature for each slot level above 4th.",
    "classes": [
      "cleric",
      "paladin",
      "sorcerer",
      "warlock",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "barkskin",
    "name": "Barkskin",
    "level": 2,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a handful of oak bark"
    },
    "duration": "Concentration, up to 1 hour",
    "concentration": true,
    "ritual": false,
    "description": "You touch a willing creature. Until the spell ends, the target's skin has a rough, bark-like appearance, and the target's AC can't be less than 16, regardless of what kind of armor it is wearing.",
    "classes": [
      "druid",
      "ranger"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "beacon-of-hope",
    "name": "Beacon of Hope",
    "level": 3,
    "school": "Abjuration",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "This spell bestows hope and vitality. Choose any number of creatures within range. For the duration, each target has advantage on Wisdom saving throws and death saving throws, and regains the maximum number of hit points possible from any healing.",
    "classes": [
      "cleric"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "beast-bond",
    "name": "Beast Bond",
    "level": 1,
    "school": "Divination",
    "castingTime": "1 action",
    "range": "touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a bit of fur wrapped in a cloth"
    },
    "duration": "Concentration, 10 minute",
    "concentration": true,
    "ritual": false,
    "description": "You establish a telepathic link with one beast you touch that is friendly to you or charmed by you. The spell fails if the beast's Intelligence score is 4 or higher. Until the spell ends, the link is active while you and the beast are within line of sight of each other. Through the link, the beast can understand your telepathic messages to it, and it can telepathically communicate simple emotions and concepts back to you. While the link is active, the beast gains advantage on attack rolls against any creature within 5 feet of you that you can see.",
    "classes": [],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "beast-sense",
    "name": "Beast Sense",
    "level": 2,
    "school": "Divination",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Concentration, up to 1 hour",
    "concentration": true,
    "ritual": true,
    "description": "You touch a willing beast. For the duration of the spell, you can use your action to see through the beast’s eyes and hear what it hears, and continue to do so until you use your action to return to your normal senses.",
    "classes": [
      "druid",
      "ranger"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "bestow-curse",
    "name": "Bestow Curse",
    "level": 3,
    "school": "Necromancy",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "You touch a creature, and that creature must succeed on a Wisdom saving throw or become cursed for the duration of the spell. When you cast this spell, choose the nature of the curse from the following options: Choose one ability score. While cursed, the target has disadvantage on ability checks and saving throws made with that ability score. While cursed, the target has disadvantage on attack rolls against you. While cursed, the target must make a Wisdom saving throw at the start of each of its turns. If it fails, it wastes its action that turn doing nothing. While the target is cursed, your attacks and spells deal an extra 1d8 necrotic damage to the target.",
    "higherLevels": "If you cast this spell using a spell slot of 4th level or higher, the duration is concentration, up to 10 minutes. If you use a spell slot of 5th level or higher, the duration is 8 hours. If you use a spell slot of 7th level or higher, the duration is 24 hours. If you use a 9th level spell slot, the spell lasts until it is dispelled. Using a spell slot of 5th level or higher grants a duration that doesn't require concentration.",
    "classes": [
      "bard",
      "cleric",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "blade-ward",
    "name": "Blade Ward",
    "level": 0,
    "school": "Abjuration",
    "castingTime": "1 action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "1 round",
    "concentration": false,
    "ritual": false,
    "description": "You extend your hand and trace a sigil of warding in the air. Until the end of your next turn, you have resistance against bludgeoning, piercing, and slashing damage dealt by weapon attacks.",
    "classes": [
      "bard",
      "sorcerer",
      "warlock",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "bless",
    "name": "Bless",
    "level": 1,
    "school": "Enchantment",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a sprinkling of holy water"
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "You bless up to three creatures of your choice within range. Whenever a target makes an attack roll or a saving throw before the spell ends, the target can roll a d4 and add the number rolled to the attack roll or saving throw.",
    "higherLevels": "When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st.",
    "classes": [
      "cleric",
      "paladin",
      "martyr",
      "necromancer",
      "apothecary",
      "witch"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "blindness-deafness",
    "name": "Blindness/Deafness",
    "level": 2,
    "school": "Necromancy",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false
    },
    "duration": "1 minute",
    "concentration": false,
    "ritual": false,
    "description": "You can blind or deafen a foe. Choose one creature that you can see within range to make a Constitution saving throw. If it fails, the target is either blinded or deafened (your choice) for the duration. At the end of each of its turns, the target can make a Constitution saving throw. On a success, the spell ends.",
    "higherLevels": "When you cast this spell using a spell slot of 3rd level or higher, you can target one additional creature for each slot level above 2nd.",
    "classes": [
      "bard",
      "cleric",
      "sorcerer",
      "wizard",
      "necromancer",
      "witch",
      "blood-mage"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "blink",
    "name": "Blink",
    "level": 3,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "1 minute",
    "concentration": false,
    "ritual": false,
    "description": "Roll a d20 at the end of each of your turns for the duration of the spell. On a roll of 11 or higher, you vanish from your current plane of existence and appear in the Ethereal Plane (the spell fails and the casting is wasted if you were already on that plane). At the start of your next turn, and when the spell ends if you are on the Ethereal Plane, you return to an unoccupied space of your choice that you can see within 10 feet of the space you vanished from. If no unoccupied space is available within that range, you appear in the nearest unoccupied space (chosen at random if more than one space is equally near). You can dismiss this spell as an action. While on the Ethereal Plane, you can see and hear the plane you originated from, which is cast in shades of gray, and you can't see anything there more than 60 feet away. You can only affect and be affected by other creatures on the Ethereal Plane. Creatures that aren't there can't perceive you or interact with you, unless they have the ability to do so.",
    "classes": [
      "sorcerer",
      "wizard",
      "artificer"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "blur",
    "name": "Blur",
    "level": 2,
    "school": "Illusion",
    "castingTime": "1 action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "Your body becomes blurred, shifting and wavering to all who can see you. For the duration, any creature has disadvantage on attack rolls against you. An attacker is immune to this effect if it doesn't rely on sight, as with blindsight, or can see through illusions, as with truesight.",
    "classes": [
      "sorcerer",
      "wizard",
      "artificer"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "booming-blade",
    "name": "Booming Blade",
    "level": 0,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "Self (5-foot radius)",
    "components": {
      "verbal": false,
      "somatic": true,
      "material": true
    },
    "duration": "1 round",
    "concentration": false,
    "ritual": false,
    "description": "You brandish the weapon used in the spell's casting and make a melee attack with it against one creature within 5 feet of you. On a hit, the target suffers the weapon attack's normal effects and then becomes sheathed in booming energy until the start of your next turn. If the target willingly moves 5 feet or more before then, the target takes 1d8 thunder damage, and the spell ends.",
    "higherLevels": "At 5th level, the melee attack deals an extra 1d8 thunder damage to the target on a hit, and the damage the target takes for moving increases to 2d8. Both damage rolls increase by 1d8 at 11th level (2d8 and 3d8) and 17th level (3d8 and 4d8).",
    "classes": [
      "sorcerer",
      "warlock",
      "wizard",
      "artificer"
    ],
    "subclasses": [
      "Arcane Trickster",
      "Eldritch Knight"
    ],
    "source": "TCoE",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "branding-smite",
    "name": "Branding Smite",
    "level": 2,
    "school": "Evocation",
    "castingTime": "1 bonus action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "The next time you hit a creature with a weapon attack before this spell ends, the weapon gleams with astral radiance as you strike. The attack deals an extra 2d6 radiant damage to the target, which becomes visible if it's invisible, and the target sheds dim light in a 5-foot radius and can't become invisible until the spell ends.",
    "higherLevels": "When you cast this spell using a spell slot of 3rd level or higher, the extra damage increases by 1d6 for each slot level above 2nd.",
    "classes": [
      "paladin"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "burning-hands",
    "name": "Burning Hands",
    "level": 1,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "Self (15-foot cone)",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "As you hold your hands with thumbs touching and fingers spread, a thin sheet of flames shoots forth from your outstretched fingertips. Each creature in a 15-foot cone must make a Dexterity saving throw. A creature takes 3d6 fire damage on a failed save, or half as much damage on a successful one. The fire ignites any flammable objects in the area that aren't being worn or carried.",
    "higherLevels": "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.",
    "classes": [
      "sorcerer",
      "wizard",
      "warmage",
      "blood-mage",
      "illrigger"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "call-lightning",
    "name": "Call Lightning",
    "level": 3,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "120 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Concentration, up to 10 minutes",
    "concentration": true,
    "ritual": false,
    "description": "A storm cloud appears in the shape of a cylinder that is 10 feet tall with a 60-foot radius, centered on a point you can see 100 feet directly above you. The spell fails if you can't see a point in the air where the storm cloud could appear (for example, if you are in a room that can't accommodate the cloud). When you cast the spell, choose a point you can see within range. A bolt of lightning flashes down from the cloud to that point. Each creature within 5 feet of that point must make a Dexterity saving throw. A creature takes 3d10 lightning damage on a failed save, or half as much damage on a successful one. On each of your turns until the spell ends, you can use your action to call down lightning in this way again, targeting the same point or a different one. If you are outdoors in stormy conditions when you cast this spell, the spell gives you control over the existing storm instead of creating a new one. Under such conditions, the spell's damage increases by 1d10.",
    "higherLevels": "When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d10 for each slot level above 3rd.",
    "classes": [
      "druid"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "calm-emotions",
    "name": "Calm Emotions",
    "level": 2,
    "school": "Enchantment",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "You attempt to suppress strong emotions in a group of people. Each humanoid in a 20-foot-radius sphere centered on a point you choose within range must make a Charisma saving throw a creature can choose to fail this saving throw if it wishes. If a creature fails its saving throw, choose one of the following two effects. You can suppress any effect causing a target to be charmed or frightened. Alternatively, you can make a target indifferent about creatures of your choice that it is hostile toward.",
    "classes": [
      "bard",
      "cleric"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "catapult",
    "name": "Catapult",
    "level": 1,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": false,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "Choose one object weighing 1 to 5 pounds within range that isn’t being worn or carried. The object flies in a straight line up to 90 feet in a direction you choose before falling to the ground, stopping early if it impacts against a solid surface. If the object would strike a creature, that creature must make a Dexterity saving throw. On a failed save, the object strikes the target and stops moving. When the object strikes something, the object and what it strikes each take 3d8 bludgeoning damage.",
    "higherLevels": "When you cast this spell using a spell slot of 2nd level or higher, the maximum weight of objects that you can target with this spell increases by 5 pounds, and the damage increases by 1d8, for each slot level above 1st.",
    "classes": [
      "artificer",
      "sorcerer",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "catnap",
    "name": "Catnap",
    "level": 3,
    "school": "Enchantment",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": false,
      "somatic": true,
      "material": true,
      "materialDescription": "a pinch of sand"
    },
    "duration": "10 minutes",
    "concentration": false,
    "ritual": false,
    "description": "You make a calming gesture, and up to three willing creatures of your choice that you can see within range fall unconscious for the spell's duration. The spell ends on a target early if it takes damage or someone uses an action to shake or slap it awake. If a target remains unconscious for the full duration, that target gains the benefit of a short rest, and it can't be affected by this spell again until it finishes a long rest.",
    "higherLevels": "When you cast this spell using a spell slot of 4th level or higher, you can target one additional willing creature for each slot level above 3rd.",
    "classes": [
      "artificer",
      "bard",
      "sorcerer",
      "wizard"
    ],
    "source": "Xanathar's Guide to Everything",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "cause-fear",
    "name": "Cause Fear",
    "level": 1,
    "school": "Necromancy",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false,
      "materialDescription": ""
    },
    "duration": "Concentration, 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "You awaken the sense of mortality in one creature you can see within range. A construct or an undead is immune to this effect. The target must succeed on a Wisdom saving throw or become frightened of you until the spell ends. The frightened target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.",
    "classes": [],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "ceremony",
    "name": "Ceremony",
    "level": 1,
    "school": "Abjuration",
    "castingTime": "1 hour",
    "range": "touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "25 gp worth of powdered silver, which the spell consumes"
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": true,
    "description": "You perform a special religious ceremony that is infused with magic. When you cast the spell, choose one of the following rites, the target of which must be within 10 feet of you throughout the casting.\nAtonement:\nY\no\nu\n \nt\no\nu\nc\nh\n \no\nn\ne\n \nw\ni\nl\nl\ni\nn\ng\n \nc\nr\ne\na\nt\nu\nr\ne\n \nw\nh\no\ns\ne\n \na\nl\ni\ng\nn\nm\ne\nn\nt\n \nh\na\ns\n \nc\nh\na\nn\ng\ne\nd\n,\n \na\nn\nd\n \ny\no\nu\n \nm\na\nk\ne\n \na\n \n2\n0\n \nW\ni\ns\nd\no\nm\n \n(\nI\nn\ns\ni\ng\nh\nt\n)\n \nc\nh\ne\nc\nk\n.\n \nO\nn\n \na\n \ns\nu\nc\nc\ne\ns\ns\nf\nu\nl\n \nc\nh\ne\nc\nk\n,\n \ny\no\nu\n \nr\ne\ns\nt\no\nr\ne\n \nt\nh\ne\n \nt\na\nr\ng\ne\nt\n \nt\no\n \ni\nt\ns\n \no\nr\ni\ng\ni\nn\na\nl\n \na\nl\ni\ng\nn\nm\ne\nn\nt\n.\nBless Water:\nY\no\nu\n \nt\no\nu\nc\nh\n \no\nn\ne\n \nv\ni\na\nl\n \no\nf\n \nw\na\nt\ne\nr\n \na\nn\nd\n \nc\na\nu\ns\ne\n \ni\nt\n \nt\no\n \nb\ne\nc\no\nm\ne\n \nH\no\nl\ny\n \nW\na\nt\ne\nr\n \n(\nf\nl\na\ns\nk\n)\n.\nComing of Age:\nY\no\nu\n \nt\no\nu\nc\nh\n \no\nn\ne\n \nh\nu\nm\na\nn\no\ni\nd\n \nw\nh\no\n \ni\ns\n \na\n \ny\no\nu\nn\ng\n \na\nd\nu\nl\nt\n.\n \nF\no\nr\n \nt\nh\ne\n \nn\ne\nx\nt\n \n2\n4\n \nh\no\nu\nr\ns\n,\n \nw\nh\ne\nn\ne\nv\ne\nr\n \nt\nh\ne\n \nt\na\nr\ng\ne\nt\n \nm\na\nk\ne\ns\n \na\nn\n \na\nb\ni\nl\ni\nt\ny\n \nc\nh\ne\nc\nk\n,\n \ni\nt\n \nc\na\nn\n \nr\no\nl\nl\n \na\n \nd\n4\n \na\nn\nd\n \na\nd\nd\n \nt\nh\ne\n \nn\nu\nm\nb\ne\nr\n \nr\no\nl\nl\ne\nd\n \nt\no\n \nt\nh\ne\n \na\nb\ni\nl\ni\nt\ny\n \nc\nh\ne\nc\nk\n.\n \nA\n \nc\nr\ne\na\nt\nu\nr\ne\n \nc\na\nn\n \nb\ne\nn\ne\nf\ni\nt\n \nf\nr\no\nm\n \nt\nh\ni\ns\n \nr\ni\nt\ne\n \no\nn\nl\ny\n \no\nn\nc\ne\n.\nDedication:\nY\no\nu\n \nt\no\nu\nc\nh\n \no\nn\ne\n \nh\nu\nm\na\nn\no\ni\nd\n \nw\nh\no\n \nw\ni\ns\nh\ne\ns\n \nt\no\n \nb\ne\n \nd\ne\nd\ni\nc\na\nt\ne\nd\n \nt\no\n \ny\no\nu\nr\n \ng\no\nd\n'\ns\n \ns\ne\nr\nv\ni\nc\ne\n.\n \nF\no\nr\n \nt\nh\ne\n \nn\ne\nx\nt\n \n2\n4\n \nh\no\nu\nr\ns\n,\n \nw\nh\ne\nn\ne\nv\ne\nr\n \nt\nh\ne\n \nt\na\nr\ng\ne\nt\n \nm\na\nk\ne\ns\n \na\n \ns\na\nv\ni\nn\ng\n \nt\nh\nr\no\nw\n,\n \ni\nt\n \nc\na\nn\n \nr\no\nl\nl\n \na\n \nd\n4\n \na\nn\nd\n \na\nd\nd\n \nt\nh\ne\n \nn\nu\nm\nb\ne\nr\n \nr\no\nl\nl\ne\nd\n \nt\no\n \nt\nh\ne\n \ns\na\nv\ne\n.\n \nA\n \nc\nr\ne\na\nt\nu\nr\ne\n \nc\na\nn\n \nb\ne\nn\ne\nf\ni\nt\n \nf\nr\no\nm\n \nt\nh\ni\ns\n \nr\ni\nt\ne\n \no\nn\nl\ny\n \no\nn\nc\ne\n.\nFuneral Rite:\nY\no\nu\n \nt\no\nu\nc\nh\n \no\nn\ne\n \nc\no\nr\np\ns\ne\n,\n \na\nn\nd\n \nf\no\nr\n \nt\nh\ne\n \nn\ne\nx\nt\n \n7\n \nd\na\ny\ns\n,\n \nt\nh\ne\n \nt\na\nr\ng\ne\nt\n \nc\na\nn\n'\nt\n \nb\ne\nc\no\nm\ne\n \nu\nn\nd\ne\na\nd\n \nb\ny\n \na\nn\ny\n \nm\ne\na\nn\ns\n \ns\nh\no\nr\nt\n \no\nf\n \na\n \nw\ni\ns\nh\n \ns\np\ne\nl\nl\n.\nWedding:\nY\no\nu\n \nt\no\nu\nc\nh\n \na\nd\nu\nl\nt\n \nh\nu\nm\na\nn\no\ni\nd\ns\n \nw\ni\nl\nl\ni\nn\ng\n \nt\no\n \nb\ne\n \nb\no\nn\nd\ne\nd\n \nt\no\ng\ne\nt\nh\ne\nr\n \ni\nn\n \nm\na\nr\nr\ni\na\ng\ne\n.\n \nF\no\nr\n \nt\nh\ne\n \nn\ne\nx\nt\n \n7\n \nd\na\ny\ns\n,\n \ne\na\nc\nh\n \nt\na\nr\ng\ne\nt\n \ng\na\ni\nn\ns\n \na\n \n+\n2\n \nb\no\nn\nu\ns\n \nt\no\n \nA\nC\n \nw\nh\ni\nl\ne\n \nt\nh\ne\ny\n \na\nr\ne\n \nw\ni\nt\nh\ni\nn\n \n3\n0\n \nf\ne\ne\nt\n \no\nf\n \ne\na\nc\nh\n \no\nt\nh\ne\nr\n.\n \nA\n \nc\nr\ne\na\nt\nu\nr\ne\n \nc\na\nn\n \nb\ne\nn\ne\nf\ni\nt\n \nf\nr\no\nm\n \nt\nh\ni\ns\n \nr\ni\nt\ne\n \na\ng\na\ni\nn\n \no\nn\nl\ny\n \ni\nf\n \nw\ni\nd\no\nw\ne\nd\n.",
    "classes": [
      "cleric",
      "paladin"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "chaos-bolt",
    "name": "Chaos Bolt",
    "level": 1,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "120 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false,
      "materialDescription": ""
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You hurl an undulating, warbling mass of chaotic energy at one creature in range. Make a ranged spell attack against the target. On a hit, the target takes 2d8 + 1d6 damage. Choose one of the d8s. The number rolled on that die determines the attack's damage type, as shown below.\n(Table included in full description)\nIf you roll the same number on both d8s, the chaotic energy leaps from the target to a different creature of your choice within 30 feet of it. Make a new attack roll against the new target, and make a new damage roll, which could cause the chaotic energy to leap again.\nA creature can be targeted only once by each casting of this spell.",
    "classes": [
      "sorcerer"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "charm-person",
    "name": "Charm Person",
    "level": 1,
    "school": "Enchantment",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "1 hour",
    "concentration": false,
    "ritual": false,
    "description": "You attempt to charm a humanoid you can see within range. It must make a Wisdom saving throw, and does so with advantage if you or your companions are fighting it. If it fails the saving throw, it is charmed by you until the spell ends or until you or your companions do anything harmful to it. The charmed creature regards you as a friendly acquaintance. When the spell ends, the creature knows it was charmed by you.",
    "higherLevels": "When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st. The creatures must be within 30 feet of each other when you target them.",
    "classes": [
      "bard",
      "druid",
      "sorcerer",
      "warlock",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "chill-touch",
    "name": "Chill Touch",
    "level": 0,
    "school": "Necromancy",
    "castingTime": "1 action",
    "range": "120 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "1 round",
    "concentration": false,
    "ritual": false,
    "description": "You create a ghostly, skeletal hand in the space of a creature within range. Make a ranged spell attack. On a hit, the target takes 1d8 necrotic damage, and it can't regain hit points until the start of your next turn. Until then, the hand clings to the target. If you hit an undead target, it also has disadvantage on attack rolls against you until the end of your next turn.",
    "higherLevels": "This spell's damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).",
    "classes": [
      "sorcerer",
      "warlock",
      "wizard",
      "illrigger",
      "necromancer",
      "blood-mage",
      "witch"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "chromatic-orb",
    "name": "Chromatic Orb",
    "level": 1,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "90 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a diamond worth at least 50 gp"
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You hurl a 4-inch-diameter sphere of energy at a creature that you can see within range. You choose acid, cold, fire, lightning, poison, or thunder for the type of orb you create, and then make a ranged spell attack against the target. If the attack hits, the creature takes 3d8 damage of the type you chose.",
    "classes": [
      "sorcerer",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "clairvoyance",
    "name": "Clairvoyance",
    "level": 3,
    "school": "Divination",
    "castingTime": "10 minutes",
    "range": "1 mile",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a focus worth at least 100 gp, either a jeweled horn for hearing or a glass eye for seeing"
    },
    "duration": "Concentration, up to 10 minutes",
    "concentration": true,
    "ritual": false,
    "description": "You create an invisible sensor within range in a location familiar to you (a place you have visited or seen before) or in an obvious location that is unfamiliar to you (such as behind a door, around a corner, or in a grove of trees). The sensor remains in place for for the duration, and it can't be attacked or otherwise interacted with. When you cast the spell, you choose seeing or hearing. You can use the chosen sense through the sensor as if you were in its space. As your action, you can switch between seeing and hearing. A creature that can see the sensor (such as a creature benefiting from see invisibility or truesight) sees a luminous, intangible orb about the size of your fist.",
    "classes": [
      "bard",
      "cleric",
      "druid",
      "sorcerer",
      "wizard",
      "illrigger",
      "witch"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "cloud-of-daggers",
    "name": "Cloud of Daggers",
    "level": 2,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a sliver of glass"
    },
    "duration": "Concentration, 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "You fill the air with spinning daggers in a cube 5 feet on each side, centered on a point you choose within range. A creature takes 4d4 slashing damage when it enters the spell's area for the first time on a turn or starts its turn there.",
    "classes": [
      "sorcerer",
      "warlock",
      "wizard",
      "bard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "color-spray",
    "name": "Color Spray",
    "level": 1,
    "school": "Illusion",
    "castingTime": "1 action",
    "range": "15 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a pinch of powder or sand that is colored red, yellow, and blue"
    },
    "duration": "1 round",
    "concentration": false,
    "ritual": false,
    "description": "A dazzling array of flashing, colored light springs from your hand. Roll 6d10; the total is how many hit points of creatures this spell can effect. Creatures in a 15-foot cone originating from you are affected in ascending order of their current hit points (ignoring unconscious creatures and creatures that can't see).\nStarting with the creature that has the lowest current hit points, each creature affected by this spell is blinded until the end of your next turn. Subtract each creature's hit points from the total before moving on to the creature with the next lowest hit points. A creature's hit points must be equal to or less than the remaining total for that creature to be affected.",
    "classes": [
      "sorcerer",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "command",
    "name": "Command",
    "level": 1,
    "school": "Enchantment",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false
    },
    "duration": "1 round",
    "concentration": false,
    "ritual": false,
    "description": "You speak a one-word command to a creature you can see within range. The target must succeed on a Wisdom saving throw or follow the command on its next turn. The spell has no effect if the target is undead, if it doesn’t understand your language, or if your command is directly harmful to it.",
    "higherLevels": "When you cast this spell using a spell slot of 2nd level or higher, you can affect one additional creature for each slot level above 1st.",
    "classes": [
      "bard",
      "cleric",
      "paladin",
      "illrigger",
      "witch"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "compelled-duel",
    "name": "Compelled Duel",
    "level": 1,
    "school": "Enchantment",
    "castingTime": "1 bonus",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false,
      "materialDescription": ""
    },
    "duration": "Concentration, 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "You attempt to compel a creature into a duel. One creature that you can see within range must make a Wisdom saving throw. On a failed save, the creature is drawn to you, compelled by your divine demand. For the duration, it has disadvantage on attack rolls against creatures other than you, and must make a Wisdom saving throw each time it attempts to move to a space that is more than 30 feet away from you; if it succeeds on this saving throw, this spell doesn't restrict the target's movement for that turn.\nThe spell ends if you attack any other creature, if you cast a spell that targets a hostile creature other than the target, if a creature friendly to you damages the target or casts a harmful spell on it, or if you end your turn more than 30 feet away from the target.",
    "classes": [
      "paladin"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "comprehend-languages",
    "name": "Comprehend Languages",
    "level": 1,
    "school": "Divination",
    "castingTime": "1 action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a pinch of soot and salt"
    },
    "duration": "1 hour",
    "concentration": false,
    "ritual": true,
    "description": "For the duration, you understand the literal meaning of any spoken language that you hear. You also understand any written language that you see, but you must be touching the surface on which the words are written. It takes about 1 minute to read one page of text.",
    "classes": [
      "bard",
      "sorcerer",
      "warlock",
      "wizard",
      "artificer",
      "apothecary"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "cone-of-cold",
    "name": "Cone of Cold",
    "level": 5,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "Self (60-foot cone)",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a small crystal or glass cone"
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "A blast of cold air erupts from your hands. Each creature in a 60-foot cone must make a Constitution saving throw. A creature takes 8d8 cold damage on a failed save, or half as much damage on a successful one. A creature killed by this spell becomes a frozen statue until it thaws.",
    "higherLevels": "When you cast this spell using a spell slot of 6th level or higher, the damage increases by 1d8 for each slot level above 5th.",
    "classes": [
      "sorcerer",
      "wizard",
      "warmage",
      "blood-mage"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "conjure-animals",
    "name": "Conjure Animals",
    "level": 3,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Concentration, up to 1 hour",
    "concentration": true,
    "ritual": false,
    "description": "You summon fey spirits that take the form of beasts and appear in unoccupied spaces that you can see within range. Choose one of the following options for what appears: One beast of challenge rating 2 or lower, Two beasts of challenge rating 1 or lower, Four beasts of challenge rating 1/2 or lower, Eight beasts of challenge rating 1/4 or lower. Each beast is also considered fey, and it disappears when it drops to 0 hit points or when the spell ends. The summoned creatures are friendly to you and your companions. Roll initiative for the summoned creatures as a group, which has its own turns. They obey any verbal commands that you issue to them (no action required by you). If you don't issue any commands to them, they defend themselves from hostile creatures, but otherwise take no actions. The DM has the creatures' statistics.",
    "higherLevels": "When you cast this spell using a spell slot of 5th level or higher, you choose one of the summoning options above, and more creatures appear: twice as many with a 5th-level slot, three times as many with a 7th-level slot, and four times as many with a 9th-level slot.",
    "classes": [
      "druid",
      "ranger"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "conjure-barrage",
    "name": "Conjure Barrage",
    "level": 3,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "Self (60-foot cone)",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "one piece of ammunition or a thrown weapon"
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You throw a nonmagical weapon or fire a piece of nonmagical ammunition into the air to create a cone of identical weapons that shoot forward and then disappear. Each creature in a 60-foot cone must succeed on a Dexterity saving throw. A creature takes 3d8 damage on a failed save, or half as much damage on a successful one. The damage type is the same as that of the weapon or ammunition used to cast the spell.",
    "classes": [
      "ranger"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "continual-flame",
    "name": "Continual Flame",
    "level": 2,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "ruby dust worth 50 gp, which the spell consumes"
    },
    "duration": "Until dispelled",
    "concentration": false,
    "ritual": false,
    "description": "A flame, equivalent in brightness to a torch, springs forth from an object that you touch. The effect looks like a regular flame, but it creates no heat and doesn't use oxygen. A continual flame can be covered or hidden but not smothered or quenched.",
    "classes": [
      "cleric",
      "wizard",
      "artificer",
      "apothecary",
      "warmage"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "control-flames",
    "name": "Control Flames",
    "level": 0,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": false,
      "somatic": true,
      "material": false,
      "materialDescription": ""
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You choose nonmagical flame that you can see within range and that fits within a 5-foot cube. You affect it in one of the following ways:\n- You instantaneously expand the flame 5 feet in one direction, provided that wood or other fuel is present in the new location.\n- You instantaneously extinguish the flames within the cube.\n- You double or halve the area of bright light and dim light cast by the flame, change its color, or both. The change lasts for 1 hour.\n- You cause simple shapes—such as the vague form of a creature, an inanimate object, or a location—to appear within the flames and animate as you like. The shapes last for 1 hour.\nIf you cast this spell multiple times, you can have up to three non-instantaneous effects created by it active at a time, and you can dismiss such an effect as an action.",
    "classes": [
      "druid",
      "sorcerer",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "cordon-of-arrows",
    "name": "Cordon of Arrows",
    "level": 2,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "5 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "four or more arrows or bolts"
    },
    "duration": "8 hours",
    "concentration": false,
    "ritual": false,
    "description": "You plant four pieces of nonmagical ammunition—arrows or crossbow bolts—in the ground within range and lay magic upon them to protect an area. Until the spell ends, whenever a creature other than you comes within 30 feet of the ammunition for the first time on a turn or ends its turn there, one of the pieces of ammunition flies up to strike it. The creature must succeed on a Dexterity saving throw or take 1d6 piercing damage. The piece of ammunition is then destroyed. The spell ends when no ammunition remains.",
    "higherLevels": "When you cast this spell using a spell slot of 3rd level or higher, the amount of ammunition that can be affected increases by two for each slot level above 2nd.",
    "classes": [
      "ranger"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "counterspell",
    "name": "Counterspell",
    "level": 3,
    "school": "Abjuration",
    "castingTime": "1 reaction",
    "range": "60 feet",
    "components": {
      "verbal": false,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You attempt to interrupt a creature in the process of casting a spell. If the creature is casting a spell of 3rd level or lower, its spell fails and has no effect. If it is casting a spell of 4th level or higher, make an ability check using your spellcasting ability. The DC equals 10 + the spell's level. On a success, the creature's spell fails and has no effect.",
    "higherLevels": "When you cast this spell using a spell slot of 4th level or higher, the interrupted spell has no effect if its level is less than or equal to the level of the spell slot you used.",
    "classes": [
      "sorcerer",
      "warlock",
      "wizard",
      "warmage",
      "witch"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "create-bonfire",
    "name": "Create Bonfire",
    "level": 0,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false,
      "materialDescription": ""
    },
    "duration": "Concentration, 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "You create a bonfire on ground that you can see within range. Until the spell ends, the magic bonfire fills a 5-foot cube. Any creature in the bonfire's space when you cast the spell must succeed on a Dexterity saving throw or take 1d8 fire damage. A creature must also make the saving throw when it moves into the bonfire's space for the first time on a turn or ends its turn there.\nThe bonfire ignites flammable objects in its area that aren't being worn or carried.\nThe spell's damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).",
    "classes": [
      "druid",
      "sorcerer",
      "warlock",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "create-food-and-water",
    "name": "Create Food and Water",
    "level": 3,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You create up to 45 pounds of food and 30 gallons of water on the ground or in containers within range, enough to sustain up to fifteen humanoids or five steeds for 24 hours. The food is bland but nourishing, and spoils if uneaten after 24 hours. The water is clean and doesn't go bad.",
    "classes": [
      "cleric",
      "paladin",
      "artificer"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "create-or-destroy-water",
    "name": "Create or Destroy Water",
    "level": 1,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a drop of water if creating water or a few grains of sand if destroying it"
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You either create or destroy water. Create Water: You create up to 10 gallons of clean water within range in an open container. Alternatively, the water falls as rain in a 30-foot cube within range, extinguishing exposed flames in the area. Destroy Water: You destroy up to 10 gallons of water in an open container within range. Alternatively, you destroy fog in a 30-foot cube within range.",
    "higherLevels": "When you cast this spell using a spell slot of 2nd level or higher, you create or destroy 10 additional gallons of water, or the size of the cube increases by 5 feet, for each slot level above 1st.",
    "classes": [
      "cleric",
      "druid"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "crown-of-madness",
    "name": "Crown of Madness",
    "level": 2,
    "school": "Enchantment",
    "castingTime": "1 action",
    "range": "120 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "One humanoid of your choice that you can see within range must succeed on a Wisdom saving throw or become charmed by you for the duration. While the target is charmed in this way, a twisted crown of jagged iron appears on its head, and a madness glows in its eyes. The charmed target must use its action before moving on each of its turns to make a melee attack against a creature other than itself that you mentally choose. The target can act normally on its turn if you choose no creature or if none are within its reach. On your subsequent turns, you must use your action to maintain control over the target, or the spell ends. The target can make a Wisdom saving throw at the end of each of its turns. On a success, the spell ends.",
    "classes": [
      "bard",
      "sorcerer",
      "warlock",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "cure-wounds",
    "name": "Cure Wounds",
    "level": 1,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs.",
    "higherLevels": "When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d8 for each slot level above 1st.",
    "classes": [
      "bard",
      "cleric",
      "druid",
      "paladin",
      "ranger",
      "artificer",
      "martyr",
      "blood-mage",
      "apothecary",
      "witch"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "dancing-lights",
    "name": "Dancing Lights",
    "level": 0,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "120 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "You create up to four torch-sized lights within range, making them appear as torches, lanterns, or glowing orbs that hover in the air for the duration. You can also combine the four lights into one glowing vaguely humanoid form of Medium size.",
    "classes": [
      "bard",
      "sorcerer",
      "wizard",
      "artificer"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "darkness",
    "name": "Darkness",
    "level": 2,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": true,
      "materialDescription": "bat fur and a drop of pitch or piece of coal"
    },
    "duration": "Concentration, up to 10 minutes",
    "concentration": true,
    "ritual": false,
    "description": "Magical darkness spreads from a point you choose within range to fill a 15-foot-radius sphere for the duration. The darkness spreads around corners. A creature with darkvision can't see through this darkness, and nonmagical light can't illuminate it. If the point you choose is on an object you are holding or one that isn't being worn or carried, the darkness emanates from the object and moves with it.",
    "classes": [
      "sorcerer",
      "warlock",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "darkvision",
    "name": "Darkvision",
    "level": 2,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "either a pinch of dried carrot or an agate"
    },
    "duration": "8 hours",
    "concentration": false,
    "ritual": false,
    "description": "You touch a willing creature to grant it the ability to see in the dark. For the duration, that creature has darkvision out to a range of 60 feet.",
    "classes": [
      "druid",
      "ranger",
      "sorcerer",
      "wizard",
      "artificer"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "daylight",
    "name": "Daylight",
    "level": 3,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "1 hour",
    "concentration": false,
    "ritual": false,
    "description": "A 60-foot-radius sphere of light spreads out from a point you choose within range. The sphere is bright light and sheds dim light for an additional 60 feet. If you chose a point on an object you are holding or one that isn't being worn or carried, the light shines from the object and moves with it. Completely covering the affected object with an opaque object, such as a bowl or a helm, blocks the light. If any of this spell's area overlaps with an area of darkness created by a spell of 3rd level or lower, the spell that created the darkness is dispelled.",
    "classes": [
      "cleric",
      "druid",
      "paladin",
      "ranger",
      "sorcerer"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "detect-evil-and-good",
    "name": "Detect Evil and Good",
    "level": 1,
    "school": "Divination",
    "castingTime": "1 action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Concentration, up to 10 minutes",
    "concentration": true,
    "ritual": false,
    "description": "For the duration, you know if there is an aberration, celestial, elemental, fey, fiend, or undead within 30 feet of you, as well as where the creature is located. Similarly, you know if there is a place or object within 30 feet of you that has been magically consecrated or desecrated.",
    "classes": [
      "cleric",
      "paladin",
      "martyr",
      "witch"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "detect-magic",
    "name": "Detect Magic",
    "level": 1,
    "school": "Divination",
    "castingTime": "1 action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Concentration, up to 10 minutes",
    "concentration": true,
    "ritual": true,
    "description": "For the duration, you sense the presence of magic within 30 feet of you. If you sense magic in this way, you can use your action to see a faint aura around any visible creature or object in the area that bears magic, and you learn its school of magic, if any.",
    "classes": [
      "bard",
      "cleric",
      "druid",
      "paladin",
      "ranger",
      "sorcerer",
      "wizard",
      "artificer",
      "witch",
      "apothecary",
      "warmage"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "detect-poison-and-disease",
    "name": "Detect Poison and Disease",
    "level": 1,
    "school": "Divination",
    "castingTime": "1 action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a yew leaf"
    },
    "duration": "Concentration, up to 10 minutes",
    "concentration": true,
    "ritual": true,
    "description": "For the duration, you can sense the presence and location of poisons, poisonous creatures, and diseases within 30 feet of you. You also identify the kind of poison, poisonous creature, or disease in each case.",
    "classes": [
      "cleric",
      "druid",
      "paladin",
      "ranger"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "detect-thoughts",
    "name": "Detect Thoughts",
    "level": 2,
    "school": "Divination",
    "castingTime": "1 action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a copper piece"
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "For the duration, you can read the thoughts of certain creatures. When you cast the spell and as your action on each turn until the spell ends, you can focus your mind on any one creature that you can see within 30 feet of you. If the creature you choose has an Intelligence of 3 or lower or doesn't speak any language, the creature is unaffected.",
    "classes": [
      "bard",
      "sorcerer",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "dimension-door",
    "name": "Dimension Door",
    "level": 4,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "500 feet",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You teleport yourself from your current location to any other spot within range. You arrive at exactly the spot desired. It can be a place you can see, one you can visualize, or one you can describe by stating distance and direction. You can bring along objects as long as their weight doesn't exceed what you can carry. You can also bring one willing creature of your size or smaller who is carrying gear up to its carrying capacity.",
    "classes": [
      "bard",
      "sorcerer",
      "warlock",
      "wizard",
      "witch"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "disguise-self",
    "name": "Disguise Self",
    "level": 1,
    "school": "Illusion",
    "castingTime": "1 action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "1 hour",
    "concentration": false,
    "ritual": false,
    "description": "You make yourself—including your clothing, armor, weapons, and other belongings on your person—look different until the spell ends or until you use your action to dismiss it. You can seem 1 foot shorter or taller and can appear thin, fat, or in between. You can't change your body type, so you must adopt a form that has the same basic arrangement of limbs. Otherwise, the extent of the illusion is up to you.",
    "classes": [
      "bard",
      "sorcerer",
      "wizard",
      "artificer",
      "witch",
      "apothecary"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "dispel-magic",
    "name": "Dispel Magic",
    "level": 3,
    "school": "Abjuration",
    "castingTime": "1 action",
    "range": "120 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "Choose one creature, object, or magical effect within range. Any spell of 3rd level or lower on the target ends. For each spell of 4th level or higher on the target, make an ability check using your spellcasting ability. The DC equals 10 + the spell's level. On a successful check, the spell ends.",
    "higherLevels": "When you cast this spell using a spell slot of 4th level or higher, you automatically end the effects of a spell on the target if the spell's level is equal to or less than the level of the spell slot you used.",
    "classes": [
      "bard",
      "cleric",
      "druid",
      "paladin",
      "sorcerer",
      "warlock",
      "wizard",
      "artificer",
      "witch",
      "martyr",
      "apothecary",
      "blood-mage"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "dissonant-whispers",
    "name": "Dissonant Whispers",
    "level": 1,
    "school": "Enchantment",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false,
      "materialDescription": ""
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You whisper a discordant melody that only one creature of your choice within range can hear, wracking it with terrible pain. The target must make a Wisdom saving throw. On a failed save, it takes 3d6 psychic damage and must immediately use its reaction, if available, to move as far as its speed allows away from you. The creature doesn't move into obviously dangerous ground, such as a fire or a pit. On a successful save, the target takes half as much damage and doesn't have to move away. A deafened creature automatically succeeds on the save.",
    "classes": [
      "bard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "divine-favor",
    "name": "Divine Favor",
    "level": 1,
    "school": "Evocation",
    "castingTime": "1 bonus action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "Your prayer empowers you with divine radiance. Until the spell ends, your weapon attacks deal an extra 1d4 radiant damage on a hit.",
    "classes": [
      "paladin"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "dragons-breath",
    "name": "Dragon's Breath",
    "level": 2,
    "school": "Transmutation",
    "castingTime": "1 bonus",
    "range": "touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a hot pepper"
    },
    "duration": "Concentration, 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "You touch one willing creature and imbue it with the power to spew magical energy from its mouth, provided it has one. Choose acid, cold, fire, lightning, or poison. Until the spell ends, the creature can use an action to exhale energy of the chosen type in a 15-foot cone. Each creature in that area must make a Dexterity saving throw, taking 3d6 damage of the chosen type on a failed save, or half as much damage on a successful one.",
    "classes": [],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "druidcraft",
    "name": "Druidcraft",
    "level": 0,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "Whispering to the spirits of nature, you create one of the following effects within range: you create a tiny, harmless sensory effect that predicts the weather, you instantly make a flower blossom, a seed pod open, or a leaf bud bloom, you create an instantaneous, harmless sensory effect, such as falling leaves, a puff of wind, the sound of a small animal, or the faint odor of skunk. The effect fits in a 5-foot cube. You instantly light or snuff out a candle, a torch, or a small campfire.",
    "classes": [
      "druid"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "dust-devil",
    "name": "Dust Devil",
    "level": 2,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a pinch of dust"
    },
    "duration": "Concentration, 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "Choose an unoccupied 5-foot cube of air that you can see within range. An elemental force that resembles a dust devil appears in the cube and lasts for the spell's duration.\nAny creature that ends its turn within 5 feet of the dust devil must make a Strength saving throw. On a failed save, the creature takes 1d8 bludgeoning damage and is pushed 10 feet away from the dust devil. On a successful save, the creature takes half as much damage and isn't pushed.\nAs a bonus action, you can move the dust devil up to 30 feet in any direction. If the dust devil moves over sand, dust, loose dirt, or light gravel, it sucks up the material and forms a 10-foot-radius cloud of debris around itself that lasts until the start of your next turn. The cloud heavily obscures its area.",
    "classes": [],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "earth-tremor",
    "name": "Earth Tremor",
    "level": 1,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "10 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false,
      "materialDescription": ""
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You cause a tremor in the ground within range. Each creature other than you in that area must make a Dexterity saving throw. On a failed save, a creature takes 1d6 bludgeoning damage and is knocked prone. If the ground in that area is loose earth or stone, it becomes difficult terrain until cleared, with each 5-foot-diameter portion requiring at least 1 minute to clear by hand.",
    "classes": [
      "bard",
      "druid",
      "sorcerer",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "earthbind",
    "name": "Earthbind",
    "level": 2,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "300 feet",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false,
      "materialDescription": ""
    },
    "duration": "Concentration, 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "Choose one creature you can see within range. Yellow strips of magical energy loop around the creature. The target must succeed on a Strength saving throw, or its flying speed (if any) is reduced to 0 feet for the spell's duration. An airborne creature affected by this spell safely descends at 60 feet per round until it reaches the ground or the spell ends.",
    "classes": [],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "eldritch-blast",
    "name": "Eldritch Blast",
    "level": 0,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "120 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "A beam of crackling energy streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 force damage.",
    "higherLevels": "The spell creates more than one beam when you reach higher levels: two beams at 5th level, three beams at 11th level, and four beams at 17th level. You can direct the beams at the same target or at different ones. Make a separate attack roll for each beam.",
    "classes": [
      "warlock",
      "illrigger"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "elemental-weapon",
    "name": "Elemental Weapon",
    "level": 3,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Concentration, up to 1 hour",
    "concentration": true,
    "ritual": false,
    "description": "A nonmagical weapon you touch becomes a magic weapon. Choose one of the following damage types: acid, cold, fire, lightning, or thunder. For the duration, the weapon has a +1 bonus to attack rolls and deals an extra 1d4 damage of the chosen type when it hits.",
    "higherLevels": "When you cast this spell using a spell slot of 5th or 6th level, the bonus to attack rolls increases to +2 and the extra damage increases to 2d4. When you use a spell slot of 7th level or higher, the bonus increases to +3 and the extra damage increases to 3d4.",
    "classes": [
      "artificer",
      "druid",
      "paladin"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "enhance-ability",
    "name": "Enhance Ability",
    "level": 2,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "fur or a feather from a beast"
    },
    "duration": "Concentration, up to 1 hour",
    "concentration": true,
    "ritual": false,
    "description": "You touch a creature and bestow upon it a magical enhancement. Choose one of the following effects; the target gains that effect until the spell ends. Bear's Endurance: The target has advantage on Constitution checks. It also gains 2d6 temporary hit points, which are lost when the spell ends. Bull's Strength: The target has advantage on Strength checks, and his or her carrying capacity doubles. Cat's Grace: The target has advantage on Dexterity checks. It also doesn't take damage from falling 20 feet or less if it isn't incapacitated. Eagle's Splendor: The target has advantage on Charisma checks. Fox's Cunning: The target has advantage on Intelligence checks. Owl's Wisdom: The target has advantage on Wisdom checks.",
    "higherLevels": "When you cast this spell using a spell slot of 3rd level or higher, you can target one additional creature for each slot level above 2nd.",
    "classes": [
      "bard",
      "cleric",
      "druid",
      "sorcerer",
      "artificer"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "enlarge-reduce",
    "name": "Enlarge/Reduce",
    "level": 2,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a pinch of powdered iron"
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "You cause a creature or an object you can see within range to grow larger or smaller for the duration. Choose either a creature or an object that is neither worn nor carried. If the target is unwilling, it can make a Constitution saving throw. On a success, the spell has no effect. The target's size doubles in all dimensions, and its weight is multiplied by eight for Enlarge. This growth increases its size by one category. The target's size is halved in all dimensions, and its weight is reduced to one-eighth of normal for Reduce.",
    "classes": [
      "sorcerer",
      "wizard",
      "artificer"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "ensnaring-strike",
    "name": "Ensnaring Strike",
    "level": 1,
    "school": "Conjuration",
    "castingTime": "1 bonus",
    "range": "self",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false,
      "materialDescription": ""
    },
    "duration": "Concentration, 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "The next time you hit a creature with a weapon attack before this spell ends, a writhing mass of thorny vines appears at the point of impact, and the target must succeed on a Strength saving throw or be restrained by the magical vines until the spell ends. A Large or larger creature has advantage on this saving throw. If the target succeeds on the save, the vines shrivel away.\nWhile restrained by this spell, the target takes 1d6 piercing damage at the start of each of its turns. A creature restrained by the vines or one that can touch the creature can use its action to make a Strength check against your spell save DC. On a success, the target is freed.",
    "classes": [
      "ranger"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "entangle",
    "name": "Entangle",
    "level": 1,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "90 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "Grasping weeds and vines sprout from the ground in a 20-foot square starting from a point within range. For the duration, these plants turn the ground in the area into difficult terrain. A creature in the area when you cast the spell must succeed on a Strength saving throw or be restrained by the entangling plants until the spell ends. A creature restrained by the plants can use its action to make a Strength check against your spell save DC. On a success, it frees itself.",
    "classes": [
      "druid"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "enthrall",
    "name": "Enthrall",
    "level": 2,
    "school": "Enchantment",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "1 minute",
    "concentration": false,
    "ritual": false,
    "description": "You weave a distracting string of words, causing creatures of your choice that you can see within range and that can hear and understand you to make a Wisdom saving throw. Any creature that can't be charmed succeeds on this saving throw automatically, and if you or your companions are fighting a creature, it has advantage on the save. On a failed save, the target has disadvantage on Wisdom (Perception) checks made to perceive any creature other than you until the spell ends or until the target can no longer hear you.",
    "classes": [
      "bard",
      "warlock"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "expeditious-retreat",
    "name": "Expeditious Retreat",
    "level": 1,
    "school": "Transmutation",
    "castingTime": "1 bonus action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Concentration, up to 10 minutes",
    "concentration": true,
    "ritual": false,
    "description": "This spell allows you to move at an incredible pace. When you cast this spell, and then as a bonus action on each of your turns until the spell ends, you can take the Dash action.",
    "classes": [
      "sorcerer",
      "warlock",
      "wizard",
      "artificer"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "faerie-fire",
    "name": "Faerie Fire",
    "level": 1,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "Each object in a 20-foot cube within range is outlined in blue, green, or violet light (your choice). Any creature in the area when the spell is cast is also outlined in light if it fails a Dexterity saving throw. For the duration, objects and affected creatures shed dim light in a 10-foot radius. Any attack roll against an affected creature or object has advantage if the attacker can see it, and the affected creature or object can't benefit from being invisible.",
    "classes": [
      "bard",
      "druid",
      "artificer",
      "witch"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "false-life",
    "name": "False Life",
    "level": 1,
    "school": "Necromancy",
    "castingTime": "1 action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a small amount of alcohol or distilled spirits"
    },
    "duration": "1 hour",
    "concentration": false,
    "ritual": false,
    "description": "Bolstering yourself with a necromantic facsimile of life, you gain 1d4 + 4 temporary hit points for the duration.",
    "higherLevels": "When you cast this spell using a spell slot of 2nd level or higher, you gain 5 additional temporary hit points for each slot level above 1st.",
    "classes": [
      "sorcerer",
      "wizard",
      "artificer",
      "blood-mage",
      "necromancer",
      "apothecary"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "fear",
    "name": "Fear",
    "level": 3,
    "school": "Illusion",
    "castingTime": "1 action",
    "range": "Self (30-foot cone)",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a white feather or the heart of a hen"
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "You project a phantasmal image of a creature's worst fears. Each creature in a 30-foot cone must succeed on a Wisdom saving throw or drop whatever it is holding and become frightened for the duration. While frightened by this spell, a creature must take the Dash action and move away from you by the safest available route on each of its turns, unless there is nowhere to move. If the creature ends its turn in a location where it doesn't have line of sight to you, the creature can make a Wisdom saving throw. On a successful save, the spell ends for that creature.",
    "classes": [
      "bard",
      "sorcerer",
      "warlock",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "feather-fall",
    "name": "Feather Fall",
    "level": 1,
    "school": "Transmutation",
    "castingTime": "1 reaction",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": true,
      "materialDescription": "a small feather or piece of down"
    },
    "duration": "1 minute",
    "concentration": false,
    "ritual": false,
    "description": "Choose up to five falling creatures within range. A falling creature's rate of descent slows to 60 feet per round until the spell ends. If the creature lands before the spell ends, it takes no falling damage and can land on its feet, and the spell ends for that creature.",
    "classes": [
      "bard",
      "sorcerer",
      "wizard",
      "artificer",
      "apothecary"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "feign-death",
    "name": "Feign Death",
    "level": 3,
    "school": "Necromancy",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a pinch of graveyard dirt"
    },
    "duration": "1 hour",
    "concentration": false,
    "ritual": true,
    "description": "You touch a willing creature and put it into a cataleptic state that is indistinguishable from death. For the spell's duration, or until you use an action to touch the target and dismiss the spell, the target appears dead to all outward inspection and to spells used to determine the target's status. The target is blinded and incapacitated, and its speed is 0. The target has resistance to all damage except psychic damage. If the target is diseased or poisoned when you cast the spell, or becomes diseased or poisoned while under the spell's effect, the disease and poison have no effect until the spell ends.",
    "classes": [
      "bard",
      "cleric",
      "druid",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "find-familiar",
    "name": "Find Familiar",
    "level": 1,
    "school": "Conjuration",
    "castingTime": "1 hour",
    "range": "10 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "10 gp worth of charcoal, incense, and herbs that must be consumed by fire in a brass brazier"
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": true,
    "description": "You gain the service of a familiar, a spirit that takes an animal form you choose: bat, cat, crab, frog (toad), hawk, lizard, octopus, owl, poisonous snake, fish (quipper), rat, raven, sea horse, spider, or weasel. Appearing in an unoccupied space within range, the familiar has the statistics of the chosen form, though it is a celestial, fey, or fiend (your choice) instead of a beast.\nAdditional {@filter animal form choices may be available at the DM's discretion.}\nYour familiar acts independently of you, but it always obeys your commands. In combat, it rolls its own initiative and acts on its own turn. A familiar can't attack, but it can take other actions as normal.\nWhen the familiar drops to 0 hit points, it disappears, leaving behind no physical form. It reappears after you cast this spell again. As an action, you can temporarily dismiss the familiar to a pocket dimension. Alternatively, you can dismiss it forever. As an action while it is temporarily dismissed, you can cause it to reappear in any unoccupied space within 30 feet of you. Whenever the familiar drops to 0 hit points or disappears into the pocket dimension, it leaves behind in its space anything it was wearing or carrying.\nWhile your familiar is within 100 feet of you, you can communicate with it telepathically. Additionally, as an action, you can see through your familiar's eyes and hear what it hears until the start of your next turn, gaining the benefits of any special senses that the familiar has. During this time, you are deafened and blinded with regard to your own senses.\nYou can't have more than one familiar at a time. If you cast this spell while you already have a familiar, you instead cause it to adopt a new form. Choose one of the forms from the above list. Your familiar transforms into the chosen creature.\nFinally, when you cast a spell with a range of touch, your familiar can deliver the spell as if it had cast the spell. Your familiar must be within 100 feet of you, and it must use its reaction to deliver the spell when you cast it. If the spell requires an attack roll, you use your attack modifier for the roll.",
    "classes": [
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "find-steed",
    "name": "Find Steed",
    "level": 2,
    "school": "Conjuration",
    "castingTime": "10 minutes",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You summon a spirit that assumes the form of an unusually intelligent, strong, and loyal steed, creating a long-lasting bond with it. Appearing in an unoccupied space within range, the steed takes on a form that you choose: a warhorse, a pony, a camel, an elk, or a mastiff. (Your DM might allow other animals to be summoned as steeds.) The steed has the statistics of the chosen form, though it is a celestial, fey, or fiend (your choice) instead of its normal type.",
    "classes": [
      "paladin"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "find-the-path",
    "name": "Find the Path",
    "level": 6,
    "school": "Divination",
    "castingTime": "1 minute",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a set of divinatory tools worth 100 gp"
    },
    "duration": "Concentration, up to 1 day",
    "concentration": true,
    "ritual": false,
    "description": "This spell allows you to find the shortest, most direct physical route to a specific fixed location that you are familiar with on the same plane of existence. If you name a destination on another plane of existence, a destination that moves (such as a mobile fortress), or a destination that isn't specific (such as 'a green dragon's lair'), the spell fails. For the duration, as long as you are on the same plane of existence as the destination, you know how far it is and in what direction it lies.",
    "classes": [
      "bard",
      "cleric",
      "druid"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "find-traps",
    "name": "Find Traps",
    "level": 2,
    "school": "Divination",
    "castingTime": "1 action",
    "range": "120 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You sense the presence of any trap within range that is within line of sight. A trap, for the purpose of this spell, includes anything that would inflict a sudden or unexpected effect you consider harmful or undesirable, which was specifically intended as such by its creator.",
    "classes": [
      "cleric",
      "druid",
      "ranger",
      "martyr",
      "witch",
      "apothecary"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "fire-bolt",
    "name": "Fire Bolt",
    "level": 0,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "120 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You hurl a mote of fire at a creature or object within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 fire damage. A flammable object hit by this spell ignites if it isn't being worn or carried.",
    "higherLevels": "This spell's damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).",
    "classes": [
      "sorcerer",
      "wizard",
      "artificer",
      "warmage",
      "blood-mage",
      "illrigger"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "fireball",
    "name": "Fireball",
    "level": 3,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "150 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a tiny ball of bat guano and sulfur"
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame. Each creature in a 20-foot-radius sphere centered on that point must make a Dexterity saving throw. A target takes 8d6 fire damage on a failed save, or half as much damage on a successful one. The fire spreads around corners. It ignites flammable objects in the area that aren't being worn or carried.",
    "higherLevels": "When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd.",
    "classes": [
      "sorcerer",
      "wizard",
      "warmage",
      "blood-mage",
      "illrigger"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "flame-arrows",
    "name": "Flame Arrows",
    "level": 3,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Concentration, up to 1 hour",
    "concentration": true,
    "ritual": false,
    "description": "You touch a quiver containing arrows or bolts. When a target is hit by a ranged weapon attack using a piece of ammunition drawn from the quiver, the target takes an extra 1d6 fire damage. The spell's magic ends on the piece of ammunition when it hits or misses, and the spell ends when twelve pieces of ammunition have been drawn from the quiver.",
    "higherLevels": "When you cast this spell using a spell slot of 4th level or higher, the number of pieces of ammunition you can affect with this spell increases by two for each slot level above 3rd.",
    "classes": [
      "artificer",
      "druid",
      "ranger",
      "sorcerer",
      "wizard"
    ],
    "source": "Xanathar's Guide to Everything",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "flame-blade",
    "name": "Flame Blade",
    "level": 2,
    "school": "Evocation",
    "castingTime": "1 bonus action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "leaf of sumac"
    },
    "duration": "Concentration, up to 10 minutes",
    "concentration": true,
    "ritual": false,
    "description": "You evoke a fiery blade in your free hand. The blade is similar in size and shape to a scimitar, and it lasts for the duration. If you let go of the blade, it disappears, but you can evoke the blade again as a bonus action. You can use your action to make a melee spell attack with the fiery blade. On a hit, the target takes 3d6 fire damage.",
    "higherLevels": "When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for every two slot levels above 2nd.",
    "classes": [
      "druid"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "flaming-sphere",
    "name": "Flaming Sphere",
    "level": 2,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a bit of tallow, a pinch of brimstone, and a dusting of powdered iron"
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "A 5-foot-diameter sphere of fire appears in an unoccupied space of your choice within range and lasts for the duration. Any creature that ends its turn within 5 feet of the sphere must make a Dexterity saving throw. The creature takes 2d6 fire damage on a failed save, or half as much damage on a successful one.",
    "higherLevels": "When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d6 for each slot level above 2nd.",
    "classes": [
      "druid",
      "wizard",
      "warmage",
      "blood-mage",
      "witch"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "fly",
    "name": "Fly",
    "level": 3,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a wing feather from any bird"
    },
    "duration": "Concentration, up to 10 minutes",
    "concentration": true,
    "ritual": false,
    "description": "You touch a willing creature. The target gains a flying speed of 60 feet for the duration. When the spell ends, the target falls if it is still aloft, unless it can stop the fall.",
    "higherLevels": "When you cast this spell using a spell slot of 4th level or higher, you can target one additional creature for each slot level above 3rd.",
    "classes": [
      "sorcerer",
      "warlock",
      "wizard",
      "artificer",
      "blood-mage",
      "witch",
      "warmage"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "fog-cloud",
    "name": "Fog Cloud",
    "level": 1,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "120 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Concentration, up to 1 hour",
    "concentration": true,
    "ritual": false,
    "description": "You create a 20-foot-radius sphere of fog centered on a point within range. The sphere spreads around corners, and its area is heavily obscured. It lasts for the duration or until a wind of moderate or greater speed (at least 10 miles per hour) disperses it.",
    "higherLevels": "When you cast this spell using a spell slot of 2nd level or higher, the radius of the fog increases by 20 feet for each slot level above 1st.",
    "classes": [
      "druid",
      "ranger",
      "sorcerer",
      "wizard",
      "witch",
      "apothecary",
      "warmage"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "friends",
    "name": "Friends",
    "level": 0,
    "school": "Enchantment",
    "castingTime": "1 action",
    "range": "Self",
    "components": {
      "verbal": false,
      "somatic": true,
      "material": true
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "For the duration, you have advantage on all Charisma checks directed at one creature of your choice that isn't hostile toward you. When the spell ends, the creature realizes that you used magic to influence its mood and becomes hostile toward you. A creature prone to violence might attack you. Another creature might seek retribution in other ways (at the DM's discretion), depending on the nature of your interaction with it.",
    "classes": [
      "bard",
      "sorcerer",
      "warlock",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "frostbite",
    "name": "Frostbite",
    "level": 0,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false,
      "materialDescription": ""
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You cause numbing frost to form on one creature that you can see within range. The target must make a Constitution saving throw. On a failed save, the target takes 1d6 cold damage, and it has disadvantage on the next weapon attack roll it makes before the end of its next turn.\nThe spell's damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).",
    "classes": [
      "druid",
      "sorcerer",
      "warlock",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "gaseous-form",
    "name": "Gaseous Form",
    "level": 3,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a bit of gauze and a wisp of smoke"
    },
    "duration": "Concentration, up to 1 hour",
    "concentration": true,
    "ritual": false,
    "description": "You transform a willing creature you touch, along with everything it's wearing and carrying, into a misty cloud for the duration. The spell ends if the creature drops to 0 hit points. An incorporeal creature isn't affected. While in this form, the target's only method of movement is a flying speed of 10 feet. The target can enter and occupy the space of another creature. The target has resistance to nonmagical damage, and it has advantage on Strength, Dexterity, and Constitution saving throws. The target can pass through small holes, narrow openings, and even mere cracks, though it treats liquids as though they were solid surfaces. The target can't fall and remains hovering in the air even when stunned or otherwise incapacitated. While in the form of a misty cloud, the target can't talk or manipulate objects, and any objects it was carrying or holding can't be dropped, used, or otherwise interacted with. The target can't attack or cast spells.",
    "classes": [
      "sorcerer",
      "warlock",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "gentle-repose",
    "name": "Gentle Repose",
    "level": 2,
    "school": "Necromancy",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a pinch of salt and one copper piece placed on each of the corpse's eyes, which must remain there for the duration"
    },
    "duration": "10 days",
    "concentration": false,
    "ritual": true,
    "description": "You touch a corpse or other remains. For the duration, the target is protected from decay and can't become undead. The spell also effectively extends the time limit on raising the target from the dead, since days spent under the influence of this spell don't count against the time limit of spells such as raise dead.",
    "classes": [
      "cleric",
      "wizard",
      "necromancer",
      "apothecary",
      "witch"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "glyph-of-warding",
    "name": "Glyph of Warding",
    "level": 3,
    "school": "Abjuration",
    "castingTime": "1 hour",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "incense and powdered diamond worth at least 200 gp, which the spell consumes"
    },
    "duration": "Until dispelled",
    "concentration": false,
    "ritual": false,
    "description": "When you cast this spell, you inscribe a glyph that later unleashes a magical effect. You can inscribe it on a surface (such as a table or a section of floor or wall) or within an object that can be closed (such as a book, a scroll, or a treasure chest) to conceal the glyph. If the object is moved more than 10 feet from where you cast this spell, the glyph is broken and the spell ends without being triggered. The glyph is nearly invisible and requires a successful Intelligence (Investigation) check against your spell save DC to be found. You decide what triggers the glyph when you cast the spell. You can store a prepared spell of 3rd level or lower in the glyph by casting it as part of creating the glyph. The spell must target a single creature or an area. The spell being stored has no immediate effect when cast in this way. When the glyph is triggered, the stored spell is cast. If the spell has a target, it targets the creature that triggered the glyph. If the spell affects an area, the area is centered on that creature. If the spell summons hostile creatures or creates harmful objects or traps, they appear as close as possible to the intruder and attack it. If the spell requires concentration, it lasts until the end of its full duration. Explosive Runes: When triggered, the glyph erupts with magical energy in a 20-foot-radius sphere centered on the glyph. The sphere spreads around corners. Each creature in the area must make a Dexterity saving throw. A creature takes 5d8 acid, cold, fire, lightning, or thunder damage on a failed save (your choice when you create the glyph), or half as much damage on a successful one.",
    "higherLevels": "When you cast this spell using a spell slot of 4th level or higher, the damage of an explosive runes glyph increases by 1d8 for each slot level above 3rd. If you create a spell glyph, you can store any spell of up to the same level as the slot you use for the glyph of warding.",
    "classes": [
      "bard",
      "cleric",
      "wizard",
      "artificer"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "goodberry",
    "name": "Goodberry",
    "level": 1,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a sprig of mistletoe"
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "Up to ten berries appear in your hand and are infused with magic for the duration. A creature can use its action to eat one berry. Eating a berry restores 1 hit point, and the berry provides enough nourishment to sustain a creature for one day. The berries lose their potency if they have not been consumed within 24 hours of the casting of this spell.",
    "classes": [
      "druid",
      "ranger",
      "witch"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "grease",
    "name": "Grease",
    "level": 1,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a bit of pork rind or butter"
    },
    "duration": "1 minute",
    "concentration": false,
    "ritual": false,
    "description": "Slick grease covers the ground in a 10-foot square centered on a point within range and turns it into difficult terrain for the duration. When the grease appears, each creature standing in its area must succeed on a Dexterity saving throw or fall prone. A creature that enters the area or ends its turn there must also succeed on a Dexterity saving throw or fall prone.",
    "classes": [
      "wizard",
      "artificer",
      "apothecary",
      "witch"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "greater-invisibility",
    "name": "Greater Invisibility",
    "level": 4,
    "school": "Illusion",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "You or a creature you touch becomes invisible until the spell ends. Anything the target is wearing or carrying is invisible as long as it is on the target's person.",
    "classes": [
      "bard",
      "sorcerer",
      "wizard",
      "warmage",
      "witch"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "green-flame-blade",
    "name": "Green-Flame Blade",
    "level": 0,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "Self (5-foot radius)",
    "components": {
      "verbal": false,
      "somatic": true,
      "material": true
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You brandish the weapon used in the spell's casting and make a melee attack with it against one creature within 5 feet of you. On a hit, the target suffers the weapon attack's normal effects, and you can cause green fire to leap from the target to a different creature of your choice that you can see within 5 feet of it. The second creature takes fire damage equal to your spellcasting ability modifier.",
    "higherLevels": "At 5th level, the melee attack deals an extra 1d8 fire damage to the target on a hit, and the fire damage to the second creature increases to 1d8 + your spellcasting ability modifier. Both damage rolls increase by 1d8 at 11th level (2d8 and 2d8) and 17th level (3d8 and 3d8).",
    "classes": [
      "sorcerer",
      "warlock",
      "wizard",
      "artificer"
    ],
    "subclasses": [
      "Arcane Trickster",
      "Eldritch Knight"
    ],
    "source": "TCoE",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "guidance",
    "name": "Guidance",
    "level": 0,
    "school": "Divination",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one ability check of its choice. It can roll the die before or after making the ability check. The spell then ends.",
    "classes": [
      "cleric",
      "druid",
      "artificer",
      "witch",
      "apothecary"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "guiding-bolt",
    "name": "Guiding Bolt",
    "level": 1,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "120 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "1 round",
    "concentration": false,
    "ritual": false,
    "description": "A flash of light streaks toward a creature of your choice within range. Make a ranged spell attack against the target. On a hit, the target takes 4d6 radiant damage, and the next attack roll made against this target before the end of your next turn has advantage, thanks to the mystical dim light glittering on the target until then.",
    "higherLevels": "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.",
    "classes": [
      "cleric",
      "druid",
      "artificer",
      "witch",
      "martyr",
      "apothecary"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "gust",
    "name": "Gust",
    "level": 0,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false,
      "materialDescription": ""
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You seize the air and compel it to create one of the following effects at a point you can see within range:\n- One Medium or smaller creature that you choose must succeed on a Strength saving throw or be pushed up to 5 feet away from you.\n- You create a small blast of air capable of moving one object that is neither held nor carried and that weighs no more than 5 pounds. The object is pushed up to 10 feet away from you. It isn't pushed with enough force to cause damage.\n- You create a harmless sensory effect using air, such as causing leaves to rustle, wind to slam shutters closed, or your clothing to ripple in a breeze.",
    "classes": [
      "druid",
      "sorcerer",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "gust-of-wind",
    "name": "Gust of Wind",
    "level": 2,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "Self (60-foot line)",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "A line of strong wind 60 feet long and 10 feet wide blasts from you in a direction you choose for the spell's duration. Each creature that starts its turn in the line must succeed on a Strength saving throw or be pushed 15 feet away from you in a direction following the line. Any creature in the line must spend 2 feet of movement for every 1 foot it moves when moving closer to you. The gust disperses gas or vapor, and it extinguishes candles, torches, and similar unprotected flames in the area. It causes protected flames, such as those of lanterns, to dance wildly and has a 50 percent chance to extinguish them. As a bonus action on each of your turns before the spell ends, you can change the direction in which the line blasts from you.",
    "classes": [
      "druid",
      "ranger",
      "sorcerer",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "hail-of-thorns",
    "name": "Hail of Thorns",
    "level": 1,
    "school": "Conjuration",
    "castingTime": "1 bonus",
    "range": "self",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false,
      "materialDescription": ""
    },
    "duration": "Concentration, 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "The next time you hit a creature with a ranged weapon attack before the spell ends, this spell creates a rain of thorns that sprouts from your ranged weapon or ammunition. In addition to the normal effect of the attack, the target of the attack and each creature within 5 feet of it must make a Dexterity saving throw. A creature takes 1d10 piercing damage on a failed save, or half as much damage on a successful one.",
    "classes": [
      "ranger"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "haste",
    "name": "Haste",
    "level": 3,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a shaving of licorice root"
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "Choose a willing creature that you can see within range. Until the spell ends, the target's speed is doubled, it gains a +2 bonus to AC, it has advantage on Dexterity saving throws, and it gains an additional action on each of its turns. That action can be used only to take the Attack (one weapon attack only), Dash, Disengage, Hide, or Use an Object action. When the spell ends, the target can't move or take actions until after its next turn, as a wave of lethargy sweeps over it.",
    "classes": [
      "sorcerer",
      "wizard",
      "artificer",
      "warmage",
      "blood-mage"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "healing-spirit",
    "name": "Healing Spirit",
    "level": 2,
    "school": "Conjuration",
    "castingTime": "1 bonus",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false,
      "materialDescription": ""
    },
    "duration": "Concentration, 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "You call forth a nature spirit to soothe the wounded. The intangible spirit appears in a space that is a 5-foot cube you can see within range. The spirit looks like a transparent beast or fey (your choice).\nUntil the spell ends, whenever you or a creature you can see moves into the spirit's space for the first time on a turn or starts its turn there, you can cause the spirit to restore 1d6 hit points to that creature (no action required). The spirit can't heal constructs or undead. The spirit can heal a number of times equal to 1 + your spellcasting ability modifier (minimum of twice). After healing that number of times, the spirit disappears.\nAs a bonus action on your turn, you can move the spirit up to 30 feet to a space you can see.",
    "classes": [
      "druid",
      "ranger"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "healing-word",
    "name": "Healing Word",
    "level": 1,
    "school": "Evocation",
    "castingTime": "1 bonus action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "A creature of your choice that you can see within range regains hit points equal to 1d4 + your spellcasting ability modifier. This spell has no effect on undead or constructs.",
    "higherLevels": "When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d4 for each slot level above 1st.",
    "classes": [
      "bard",
      "cleric",
      "druid"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "heat-metal",
    "name": "Heat Metal",
    "level": 2,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a piece of iron and a flame"
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "Choose a manufactured metal object, such as a metal weapon or a suit of heavy or medium metal armor, that you can see within range. You cause the object to glow red-hot. Any creature in physical contact with the object takes 2d8 fire damage when you cast the spell. Until the spell ends, you can use a bonus action on each of your subsequent turns to cause this damage again.",
    "higherLevels": "When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d8 for each slot level above 2nd.",
    "classes": [
      "bard",
      "druid",
      "artificer",
      "warmage"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "hellish-rebuke",
    "name": "Hellish Rebuke",
    "level": 1,
    "school": "Evocation",
    "castingTime": "1 reaction",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false,
      "materialDescription": ""
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You point your finger, and the creature that damaged you is momentarily surrounded by hellish flames. The creature must make a Dexterity saving throw. It takes 2d10 fire damage on a failed save, or half as much damage on a successful one.",
    "classes": [
      "warlock"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "heroism",
    "name": "Heroism",
    "level": 1,
    "school": "Enchantment",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "A willing creature you touch is imbued with bravery. Until the spell ends, the creature is immune to being frightened and gains temporary hit points equal to your spellcasting ability modifier at the start of each of its turns. When the spell ends, the target loses any remaining temporary hit points from this spell.",
    "higherLevels": "When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st.",
    "classes": [
      "bard",
      "paladin",
      "martyr"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "hex",
    "name": "Hex",
    "level": 1,
    "school": "Enchantment",
    "castingTime": "1 bonus",
    "range": "90 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "the petrified eye of a newt"
    },
    "duration": "Concentration, 1 hour",
    "concentration": true,
    "ritual": false,
    "description": "You place a curse on a creature that you can see within range. Until the spell ends, you deal an extra 1d6 necrotic damage to the target whenever you hit it with an attack. Also, choose one ability when you cast the spell. The target has disadvantage on ability checks made with the chosen ability.\nIf the target drops to 0 hit points before this spell ends, you can use a bonus action on a subsequent turn of yours to curse a new creature.\nA remove curse cast on the target ends this spell early.",
    "classes": [
      "warlock"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "hold-person",
    "name": "Hold Person",
    "level": 2,
    "school": "Enchantment",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a small, straight piece of iron"
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "Choose a humanoid that you can see within range. The target must succeed on a Wisdom saving throw or be paralyzed for the duration. At the end of each of its turns, the target can make another Wisdom saving throw. On a success, the spell ends on the target.",
    "higherLevels": "When you cast this spell using a spell slot of 3rd level or higher, you can target one additional humanoid for each slot level above 2nd.",
    "classes": [
      "bard",
      "cleric",
      "druid",
      "sorcerer",
      "warlock",
      "wizard",
      "artificer",
      "witch",
      "blood-mage",
      "necromancer",
      "apothecary"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "hunters-mark",
    "name": "Hunter's Mark",
    "level": 1,
    "school": "Divination",
    "castingTime": "1 bonus action",
    "range": "90 feet",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false
    },
    "duration": "Concentration, up to 1 hour",
    "concentration": true,
    "ritual": false,
    "description": "You choose a creature you can see within range and mystically mark it as your quarry. Until the spell ends, you deal an extra 1d6 damage to the target whenever you hit it with a weapon attack, and you have advantage on any Wisdom (Perception) or Wisdom (Survival) check you make to find it. If the target drops to 0 hit points before this spell ends, you can use a bonus action on a subsequent turn of yours to mark a new creature.",
    "higherLevels": "When you cast this spell using a spell slot of 3rd or 4th level, you can maintain your concentration on the spell for up to 8 hours. When you use a spell slot of 5th level or higher, you can maintain your concentration on the spell for up to 24 hours.",
    "classes": [
      "ranger",
      "paladin"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "hypnotic-pattern",
    "name": "Hypnotic Pattern",
    "level": 3,
    "school": "Illusion",
    "castingTime": "1 action",
    "range": "120 feet",
    "components": {
      "verbal": false,
      "somatic": true,
      "material": true,
      "materialDescription": "a glowing stick of incense or a crystal vial filled with phosphorescent material"
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "You create a twisting pattern of colors that weaves through the air inside a 30-foot cube within range. The pattern appears for a moment and vanishes. Each creature in the area who sees the pattern must make a Wisdom saving throw. On a failed save, the creature becomes charmed for the duration. While charmed by this spell, the creature is incapacitated and has a speed of 0.",
    "classes": [
      "bard",
      "sorcerer",
      "warlock",
      "wizard",
      "illrigger",
      "witch"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "ice-knife",
    "name": "Ice Knife",
    "level": 1,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": false,
      "somatic": true,
      "material": true,
      "materialDescription": "a drop of water or piece of ice"
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You create a shard of ice and fling it at one creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 piercing damage. Hit or miss, the shard then explodes. The target and each creature within 5 feet of it must succeed on a Dexterity saving throw or take 2d6 cold damage.",
    "classes": [
      "druid",
      "sorcerer",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "identify",
    "name": "Identify",
    "level": 1,
    "school": "Divination",
    "castingTime": "1 minute",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a pearl worth at least 100 gp and an owl feather"
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": true,
    "description": "You choose one object that you must touch throughout the casting of the spell. If it is a magic item or some other magic-imbued object, you learn its properties and how to use them, whether it requires attunement to use, and how many charges it has, if any. You learn whether any spells are affecting the item and what they are. If the item was created by a spell, you learn which spell created it.",
    "classes": [
      "bard",
      "wizard",
      "artificer",
      "apothecary",
      "witch"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "illusory-script",
    "name": "Illusory Script",
    "level": 1,
    "school": "Illusion",
    "castingTime": "1 minute",
    "range": "touch",
    "components": {
      "verbal": false,
      "somatic": true,
      "material": true,
      "materialDescription": "a lead-based ink worth at least 10 gp, which the spell consumes"
    },
    "duration": "10 day",
    "concentration": false,
    "ritual": true,
    "description": "You write on parchment, paper, or some other suitable writing material and imbue it with a potent illusion that lasts for the duration.\nTo you and any creatures you designate when you cast the spell, the writing appears normal, written in your hand, and conveys whatever meaning you intended when you wrote the text. To all others, the writing appears as if it were written in an unknown or magical script that is unintelligible. Alternatively, you can cause the writing to appear to be an entirely different message, written in a different hand and language, though the language must be one you know.\nShould the spell be dispelled, the original script and the illusion both disappear.\nA creature with truesight can read the hidden message.",
    "classes": [
      "warlock",
      "wizard",
      "bard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "infestation",
    "name": "Infestation",
    "level": 0,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a living flea"
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You cause a cloud of mites, fleas, and other parasites to appear momentarily on one creature you can see within range. The target must succeed on a Constitution saving throw, or it takes 1d6 poison damage and moves 5 feet in a random direction if it can move and its speed is at least 5 feet. Roll a d4 for the direction: 1, north; 2, south; 3, east; or 4, west. This movement doesn't provoke opportunity attacks, and if the direction rolled is blocked, the target doesn't move.\nThe spell's damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).",
    "classes": [
      "druid",
      "sorcerer",
      "warlock",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "inflict-wounds",
    "name": "Inflict Wounds",
    "level": 1,
    "school": "Necromancy",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "Make a melee spell attack against a creature you can reach. On a hit, the target takes 3d10 necrotic damage.",
    "higherLevels": "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st.",
    "classes": [
      "cleric",
      "necromancer",
      "blood-mage",
      "witch",
      "illrigger"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "intellect-fortress",
    "name": "Intellect Fortress",
    "level": 3,
    "school": "Abjuration",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Concentration, up to 1 hour",
    "concentration": true,
    "ritual": false,
    "description": "For the duration, you or one willing creature you can see within range has resistance to psychic damage, as well as advantage on Intelligence, Wisdom, and Charisma saving throws.",
    "higherLevels": "When you cast this spell using a spell slot of 4th level or higher, you can target one additional creature for each slot level above 3rd. The creatures must be within 30 feet of each other when you target them.",
    "classes": [
      "artificer",
      "bard",
      "sorcerer",
      "warlock",
      "wizard"
    ],
    "source": "Tasha's Cauldron of Everything",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "invisibility",
    "name": "Invisibility",
    "level": 2,
    "school": "Illusion",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "an eyelash encased in gum arabic"
    },
    "duration": "Concentration, up to 1 hour",
    "concentration": true,
    "ritual": false,
    "description": "A creature you touch becomes invisible until the spell ends. Anything the target is wearing or carrying is invisible as long as it is on the target's person. The spell ends for a target that attacks or casts a spell.",
    "higherLevels": "When you cast this spell using a spell slot of 3rd level or higher, you can target one additional creature for each slot level above 2nd.",
    "classes": [
      "bard",
      "sorcerer",
      "warlock",
      "wizard",
      "artificer"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "jump",
    "name": "Jump",
    "level": 1,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a grasshopper's hind leg"
    },
    "duration": "1 minute",
    "concentration": false,
    "ritual": false,
    "description": "You touch a creature. The creature's jump distance is tripled until the spell ends.",
    "classes": [
      "druid",
      "ranger",
      "sorcerer",
      "wizard",
      "artificer",
      "apothecary",
      "warmage"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "knock",
    "name": "Knock",
    "level": 2,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "Choose an object that you can see within range. The object can be a door, a box, a chest, a set of manacles, a padlock, or another object that contains a mundane or magical means that prevents access. A target that is held shut by a mundane lock or that is stuck or barred becomes unlocked, unstuck, or unbarred. If the object has multiple locks, only one of them is unlocked. If you choose a target that is held shut with arcane lock, that spell is suppressed for 10 minutes, during which time the target can be opened and shut normally.",
    "classes": [
      "bard",
      "sorcerer",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "lesser-restoration",
    "name": "Lesser Restoration",
    "level": 2,
    "school": "Abjuration",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You touch a creature and can end either one disease or one condition afflicting it. The condition can be blinded, deafened, paralyzed, or poisoned.",
    "classes": [
      "bard",
      "cleric",
      "druid",
      "paladin",
      "ranger",
      "artificer",
      "apothecary",
      "witch",
      "martyr"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "levitate",
    "name": "Levitate",
    "level": 2,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a small leather loop or a piece of golden wire bent into a cup shape with a long shank"
    },
    "duration": "Concentration, up to 10 minutes",
    "concentration": true,
    "ritual": false,
    "description": "One creature or loose object of your choice that you can see within range rises vertically, up to 20 feet, and remains suspended there for the duration. The spell can levitate a target that weighs up to 500 pounds. An unwilling creature that succeeds on a Constitution saving throw is unaffected.",
    "classes": [
      "sorcerer",
      "wizard",
      "artificer"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "light",
    "name": "Light",
    "level": 0,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": true,
      "materialDescription": "a firefly or phosphorescent moss"
    },
    "duration": "1 hour",
    "concentration": false,
    "ritual": false,
    "description": "You touch one object that is no larger than 10 feet in any dimension. Until the spell ends, the object sheds bright light in a 20-foot radius and dim light for an additional 20 feet. The light can be colored as you like. Completely covering the object with something opaque blocks the light. The spell ends if you cast it again or dismiss it as an action.",
    "classes": [
      "bard",
      "druid",
      "sorcerer",
      "wizard",
      "artificer",
      "witch",
      "warmage",
      "martyr"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "lightning-arrow",
    "name": "Lightning Arrow",
    "level": 3,
    "school": "Transmutation",
    "castingTime": "1 bonus action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "The next time you make a ranged weapon attack during the spell's duration, the weapon's ammunition, or the weapon itself if it's a thrown weapon, transforms into a bolt of lightning. Make the attack roll as normal. The target takes 4d8 lightning damage on a hit, or half as much damage on a miss, instead of the weapon's normal damage. Whether you hit or miss, each creature within 10 feet of the target must make a Dexterity saving throw. Each of these creatures takes 2d8 lightning damage on a failed save, or half as much damage on a successful one. The piece of ammunition or weapon then returns to its normal form.",
    "higherLevels": "When you cast this spell using a spell slot of 4th level or higher, the damage for both effects of the spell increases by 1d8 for each slot level above 3rd.",
    "classes": [
      "ranger"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "lightning-bolt",
    "name": "Lightning Bolt",
    "level": 3,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "Self (100-foot line)",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a bit of fur and a rod of amber, crystal, or glass"
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "A stroke of lightning forming a line 100 feet long and 5 feet wide blasts out from you in a direction you choose. Each creature in the line must make a Dexterity saving throw. A creature takes 8d6 lightning damage on a failed save, or half as much damage on a successful one. The lightning ignites flammable objects in the area that aren't being worn or carried.",
    "higherLevels": "When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd.",
    "classes": [
      "sorcerer",
      "wizard",
      "warmage",
      "illrigger",
      "blood-mage"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "lightning-lure",
    "name": "Lightning Lure",
    "level": 0,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "15 feet",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false,
      "materialDescription": ""
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You create a lash of lightning energy that strikes at one creature of your choice that you can see within 15 feet of you. The target must succeed on a Strength saving throw or be pulled up to 10 feet in a straight line toward you and then take 1d8 lightning damage if it is within 5 feet of you.\nThis spell's damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).",
    "classes": [
      "sorcerer",
      "warlock",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "locate-animals-or-plants",
    "name": "Locate Animals or Plants",
    "level": 2,
    "school": "Divination",
    "castingTime": "1 action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a bit of fur from a bloodhound"
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": true,
    "description": "Describe or name a specific kind of beast or plant. Concentrating on the voice of nature in your surroundings, you learn the direction and distance to the closest creature or plant of that kind within 5 miles, if any are present.",
    "classes": [
      "bard",
      "druid",
      "ranger"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "locate-creature",
    "name": "Locate Creature",
    "level": 4,
    "school": "Divination",
    "castingTime": "1 action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a bit of fur from a bloodhound"
    },
    "duration": "Concentration, up to 1 hour",
    "concentration": true,
    "ritual": false,
    "description": "Describe or name a creature that is familiar to you. You sense the direction to the creature's location, as long as that creature is within 1,000 feet of you. If the creature is moving, you know the direction of its movement.",
    "classes": [
      "bard",
      "cleric",
      "druid",
      "paladin",
      "ranger",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "locate-object",
    "name": "Locate Object",
    "level": 2,
    "school": "Divination",
    "castingTime": "1 action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a forked twig"
    },
    "duration": "Concentration, up to 10 minutes",
    "concentration": true,
    "ritual": false,
    "description": "Describe or name an object that is familiar to you. You sense the direction to the object's location, as long as that object is within 1,000 feet of you. If the object is in motion, you know the direction of its movement.",
    "classes": [
      "bard",
      "cleric",
      "druid",
      "paladin",
      "ranger",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "longstrider",
    "name": "Longstrider",
    "level": 1,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a pinch of dirt"
    },
    "duration": "1 hour",
    "concentration": false,
    "ritual": false,
    "description": "You touch a creature. The target's speed increases by 10 feet until the spell ends.",
    "higherLevels": "When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st.",
    "classes": [
      "bard",
      "druid",
      "ranger",
      "wizard",
      "artificer",
      "apothecary",
      "warmage"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "mage-armor",
    "name": "Mage Armor",
    "level": 1,
    "school": "Abjuration",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a piece of cured leather"
    },
    "duration": "8 hours",
    "concentration": false,
    "ritual": false,
    "description": "You touch a willing creature who isn't wearing armor, and a protective magical force surrounds it until the spell ends. The target's base AC becomes 13 + its Dexterity modifier. The spell ends if the target dons armor or if you dismiss the spell as an action.",
    "classes": [
      "sorcerer",
      "wizard",
      "warmage"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "mage-hand",
    "name": "Mage Hand",
    "level": 0,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "1 minute",
    "concentration": false,
    "ritual": false,
    "description": "A spectral, floating hand appears at a point you choose within range. The hand lasts for the duration or until you dismiss it as an action. The hand vanishes if it is ever more than 30 feet away from you or if you cast this spell again. You can use your action to control the hand. You can use the hand to manipulate an object, open an unlocked door or container, stow or retrieve an item from an open container, or pour the contents out of a vial.",
    "classes": [
      "bard",
      "sorcerer",
      "warlock",
      "wizard",
      "artificer",
      "warmage",
      "witch",
      "apothecary",
      "blood-mage"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "magic-circle",
    "name": "Magic Circle",
    "level": 3,
    "school": "Abjuration",
    "castingTime": "1 minute",
    "range": "10 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "holy water or powdered silver and iron worth at least 100 gp, which the spell consumes"
    },
    "duration": "1 hour",
    "concentration": false,
    "ritual": false,
    "description": "You create a 10-foot-radius, 20-foot-tall cylinder of magical energy centered on a point on the ground that you can see within range. Glowing runes appear wherever the cylinder intersects with the floor or other surface. Choose one or more of the following types of creatures: celestials, elementals, fey, fiends, or undead. The circle affects a creature of the chosen type in the following ways. The creature can't willingly enter the cylinder by nonmagical means. If the creature tries to use teleportation or interplanar travel to do so, it must first succeed on a Charisma saving throw. The creature has disadvantage on attack rolls against targets within the cylinder. Targets within the cylinder can't be charmed, frightened, or possessed by the creature. When you cast this spell, you can elect to cause its magic to operate in the reverse direction, preventing a creature of the specified type from leaving the cylinder and protecting targets outside it.",
    "higherLevels": "When you cast this spell using a spell slot of 4th level or higher, the duration increases by 1 hour for each slot level above 3rd.",
    "classes": [
      "cleric",
      "paladin",
      "warlock",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "magic-missile",
    "name": "Magic Missile",
    "level": 1,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "120 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range. A dart deals 1d4 + 1 force damage to its target. The darts all strike simultaneously, and you can direct them to hit one creature or several.",
    "higherLevels": "When you cast this spell using a spell slot of 2nd level or higher, the spell creates one more dart for each slot level above 1st.",
    "classes": [
      "sorcerer",
      "wizard",
      "warmage",
      "force-mage"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "magic-mouth",
    "name": "Magic Mouth",
    "level": 2,
    "school": "Illusion",
    "castingTime": "1 minute",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a small bit of honeycomb and jade dust worth at least 10 gp, which the spell consumes"
    },
    "duration": "Until dispelled",
    "concentration": false,
    "ritual": true,
    "description": "You implant a message within an object in range, a message that is uttered when a trigger condition is met. Choose an object that you can see and that isn't being worn or carried by another creature. Then speak the message, which must be 25 words or less, though it can be delivered over as long as 10 minutes. Finally, determine the circumstance that will trigger the spell to deliver your message.",
    "classes": [
      "bard",
      "wizard",
      "artificer"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "magic-stone",
    "name": "Magic Stone",
    "level": 0,
    "school": "Transmutation",
    "castingTime": "1 bonus",
    "range": "touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false,
      "materialDescription": ""
    },
    "duration": "1 minute",
    "concentration": false,
    "ritual": false,
    "description": "You touch one to three pebbles and imbue them with magic. You or someone else can make a ranged spell attack with one of the pebbles by throwing it or hurling it with a sling. If thrown, a pebble has a range of 60 feet. If someone else attacks with a pebble, that attacker adds your spellcasting ability modifier, not the attacker's, to the attack roll. On a hit, the target takes bludgeoning damage equal to 1d6 + your spellcasting ability modifier. Whether the attack hits or misses, the spell then ends on the stone.\nIf you cast this spell again, the spell ends on any pebbles still affected by your previous casting.",
    "classes": [
      "druid",
      "warlock",
      "artificer"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "magic-weapon",
    "name": "Magic Weapon",
    "level": 2,
    "school": "Transmutation",
    "castingTime": "1 bonus action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Concentration, up to 1 hour",
    "concentration": true,
    "ritual": false,
    "description": "You touch a nonmagical weapon. Until the spell ends, that weapon becomes a magic weapon with a +1 bonus to attack rolls and damage rolls.",
    "higherLevels": "When you cast this spell using a spell slot of 4th level or higher, the bonus increases to +2. When you use a spell slot of 6th level or higher, the bonus increases to +3.",
    "classes": [
      "paladin",
      "wizard",
      "artificer",
      "warmage",
      "blood-mage"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "major-image",
    "name": "Major Image",
    "level": 3,
    "school": "Illusion",
    "castingTime": "1 action",
    "range": "120 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a bit of fleece"
    },
    "duration": "Concentration, up to 10 minutes",
    "concentration": true,
    "ritual": false,
    "description": "You create the image of an object, a creature, or some other visible phenomenon that is no larger than a 20-foot cube. The image appears at a spot that you can see within range and lasts for the duration. It seems completely real, including sounds, smells, and temperature appropriate to the thing depicted. You can't create sufficient heat or cold to cause damage, a sound loud enough to deal thunder damage or deafen a creature, or a smell that might sicken a creature (like a troglodyte's stench). As long as you are within range of the illusion, you can use your action to cause the image to move to any other spot within range. As the image changes location, you can alter its appearance so that its movements appear natural for the image. For example, if you create an image of a creature and move it, you can alter the image so that it appears to be walking. Physical interaction with the image reveals it to be an illusion, because things can pass through it. A creature that uses its action to examine the image can determine that it is an illusion with a successful Intelligence (Investigation) check against your spell save DC. If a creature discerns the illusion for what it is, the creature can see through the image, and its other sensory qualities become faint to the creature.",
    "higherLevels": "When you cast this spell using a spell slot of 6th level or higher, the spell lasts until dispelled, without requiring your concentration.",
    "classes": [
      "bard",
      "sorcerer",
      "warlock",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "mass-healing-word",
    "name": "Mass Healing Word",
    "level": 3,
    "school": "Evocation",
    "castingTime": "1 bonus action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "As you call out words of restoration, up to six creatures of your choice that you can see within range regain hit points equal to 1d4 + your spellcasting ability modifier. This spell has no effect on undead or constructs.",
    "higherLevels": "When you cast this spell using a spell slot of 4th level or higher, the healing increases by 1d4 for each slot level above 3rd.",
    "classes": [
      "cleric",
      "martyr",
      "apothecary"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "maximilians-earthen-grasp",
    "name": "Maximilian's Earthen Grasp",
    "level": 2,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a miniature hand sculpted from clay"
    },
    "duration": "Concentration, 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "You choose a 5-foot-square unoccupied space on the ground that you can see within range. A Medium hand made from compacted soil rises there and reaches for one creature you can see within 5 feet of it. The target must make a Strength saving throw. On a failed save, the target takes 2d6 bludgeoning damage and is restrained for the spell's duration.\nAs an action, you can cause the hand to crush the restrained target, which must make a Strength saving throw. The target takes 2d6 bludgeoning damage on a failed save, or half as much damage on a successful one.\nTo break out, the restrained target can use its action to make a Strength check against your spell save DC. On a success, the target escapes and is no longer restrained by the hand.\nAs an action, you can cause the hand to reach for a different creature or to move to a different unoccupied space within range. The hand releases a restrained target if you do either.",
    "classes": [
      "sorcerer",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "meld-into-stone",
    "name": "Meld into Stone",
    "level": 3,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "8 hours",
    "concentration": false,
    "ritual": true,
    "description": "You step into a stone object or surface large enough to fully contain your body, melding yourself and all the equipment you carry with the stone for the duration. Using your movement, you step into the stone at a point you can touch. Nothing of your presence remains visible or otherwise detectable by nonmagical senses. While merged with the stone, you can't see what occurs outside it, and any Wisdom (Perception) checks you make to hear sounds outside it are made with disadvantage. You remain aware of the passage of time and can cast spells on yourself while merged in the stone. You can use your movement to leave the stone where you entered it, which ends the spell. You otherwise can't move. Minor physical damage to the stone doesn't harm you, but its partial destruction or a change in its shape (to the extent that you no longer fit within it) expels you and deals 6d6 bludgeoning damage to you. The stone's complete destruction (or transmutation into a different substance) expels you and deals 50 bludgeoning damage to you. If expelled, you fall prone in an unoccupied space closest to where you first entered.",
    "classes": [
      "cleric",
      "druid"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "melfs-acid-arrow",
    "name": "Melf's Acid Arrow",
    "level": 2,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "90 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "powdered rhubarb leaf and an adder's stomach"
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "A shimmering green arrow streaks toward a target within range and bursts in a spray of acid. Make a ranged spell attack against the target. On a hit, the target takes 4d4 acid damage immediately and 2d4 acid damage at the end of its next turn. On a miss, the arrow splashes the target with acid for half as much of the initial damage and no damage at the end of its next turn.",
    "classes": [
      "druid",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "mending",
    "name": "Mending",
    "level": 0,
    "school": "Transmutation",
    "castingTime": "1 minute",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "two lodestones"
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "This spell repairs a single break or tear in an object you touch, such as a broken chain link, two halves of a broken key, a torn cloak, or a leaking wineskin. As long as the break or tear is no larger than 1 foot in any dimension, you mend it, leaving no trace of the former damage.",
    "classes": [
      "bard",
      "cleric",
      "druid",
      "sorcerer",
      "wizard",
      "artificer",
      "apothecary",
      "warmage"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "message",
    "name": "Message",
    "level": 0,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "120 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a short piece of copper wire"
    },
    "duration": "1 round",
    "concentration": false,
    "ritual": false,
    "description": "You point your finger toward a creature within range and whisper a message. The target (and only the target) hears the message and can reply in a whisper that only you can hear. You can cast this spell through solid objects if you are familiar with the target and know it is beyond the barrier.",
    "classes": [
      "bard",
      "sorcerer",
      "wizard",
      "artificer"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "mind-sliver",
    "name": "Mind Sliver",
    "level": 0,
    "school": "Enchantment",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false
    },
    "duration": "1 round",
    "concentration": false,
    "ritual": false,
    "description": "You drive a disorienting spike of psychic energy into the mind of one creature you can see within range. The target must succeed on an Intelligence saving throw or take 1d6 psychic damage and subtract 1d4 from the next saving throw it makes before the end of your next turn.",
    "higherLevels": "This spell's damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).",
    "classes": [
      "sorcerer",
      "warlock",
      "wizard"
    ],
    "subclasses": [
      "Arcane Trickster",
      "Eldritch Knight",
      "Aberrant Mind"
    ],
    "source": "TCoE",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "mind-spike",
    "name": "Mind Spike",
    "level": 2,
    "school": "Divination",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": false,
      "somatic": true,
      "material": false
    },
    "duration": "Concentration, up to 1 hour",
    "concentration": true,
    "ritual": false,
    "description": "You reach into the mind of one creature you can see within range. The target must make a Wisdom saving throw, taking 3d8 psychic damage on a failed save, or half as much damage on a successful one. On a failed save, you also always know the target's location until the spell ends, but only while the two of you are on the same plane of existence. While you have this knowledge, the target can't become hidden from you, and if it's invisible, it gains no benefit from that condition against you.",
    "higherLevels": "When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d8 for each slot level above 2nd.",
    "classes": [
      "sorcerer",
      "warlock",
      "wizard"
    ],
    "source": "Xanathar's Guide to Everything",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "minor-illusion",
    "name": "Minor Illusion",
    "level": 0,
    "school": "Illusion",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": false,
      "somatic": true,
      "material": true
    },
    "duration": "1 minute",
    "concentration": false,
    "ritual": false,
    "description": "You create a sound or an image of an object within range that lasts for the duration. The illusion also ends if you dismiss it as an action or cast this spell again. If you create a sound, its volume can range from a whisper to a scream. It can be your voice, someone else's voice, a lion's roar, a beating of drums, or any other sound you choose. The sound continues unabated throughout the duration, or you can make discrete sounds at different times before the spell ends. If you create an image of an object—such as a chair, muddy footprints, or a small chest—it must be no larger than a 5-foot cube. The image can't create sound, light, smell, or any other sensory effect. Physical interaction with the image reveals it to be an illusion, because things can pass through it. If a creature uses its action to examine the sound or image, the creature can determine that it is an illusion with a successful Intelligence (Investigation) check against your spell save DC. If a creature discerns the illusion for what it is, the illusion becomes faint to the creature.",
    "classes": [
      "bard",
      "sorcerer",
      "warlock",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "mirror-image",
    "name": "Mirror Image",
    "level": 2,
    "school": "Illusion",
    "castingTime": "1 action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "1 minute",
    "concentration": false,
    "ritual": false,
    "description": "Three illusory duplicates of yourself appear in your space. Until the spell ends, the duplicates move with you and mimic your actions, shifting position so it's impossible to track which image is real. You can use your action to dismiss the illusory duplicates. Each time a creature targets you with an attack during the spell's duration, roll a d20 to determine whether the attack instead targets one of your duplicates.",
    "classes": [
      "sorcerer",
      "warlock",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "misty-step",
    "name": "Misty Step",
    "level": 2,
    "school": "Conjuration",
    "castingTime": "1 bonus action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "Briefly surrounded by silvery mist, you teleport up to 30 feet to an unoccupied space that you can see.",
    "classes": [
      "sorcerer",
      "warlock",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "mold-earth",
    "name": "Mold Earth",
    "level": 0,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": false,
      "somatic": true,
      "material": false,
      "materialDescription": ""
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You choose a portion of dirt or stone that you can see within range and that fits within a 5-foot cube. You manipulate it in one of the following ways:\n- If you target an area of loose earth, you can instantaneously excavate it, move it along the ground, and deposit it up to 5 feet away. This movement doesn't involve enough force to cause damage.\n- You cause shapes, colors, or both to appear on the dirt or stone, spelling out words, creating images, or shaping patterns. The changes last for 1 hour.\n- If the dirt or stone you target is on the ground, you cause it to become difficult terrain. Alternatively, you can cause the ground to become normal terrain if it is already difficult terrain. This change lasts for 1 hour.\nIf you cast this spell multiple times, you can have no more than two of its non-instantaneous effects active at a time, and you can dismiss such an effect as an action.",
    "classes": [
      "druid",
      "sorcerer",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "moonbeam",
    "name": "Moonbeam",
    "level": 2,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "120 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "several seeds of any moonseed plant and a piece of opalescent feldspar"
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "A silvery beam of pale light shines down in a 5-foot-radius, 40-foot-high cylinder centered on a point within range. Until the spell ends, dim light fills the cylinder. When a creature enters the spell's area for the first time on a turn or starts its turn there, it is engulfed in ghostly flames that cause searing pain, and it must make a Constitution saving throw. It takes 2d10 radiant damage on a failed save, or half as much damage on a successful one. A shapechanger makes its saving throw with disadvantage. If it fails, it also instantly reverts to its original form and can't assume a different form until it leaves the spell's light.",
    "higherLevels": "When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d10 for each slot level above 2nd.",
    "classes": [
      "druid"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "nondetection",
    "name": "Nondetection",
    "level": 3,
    "school": "Abjuration",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a pinch of diamond dust worth 25 gp sprinkled over the target, which the spell consumes"
    },
    "duration": "8 hours",
    "concentration": false,
    "ritual": false,
    "description": "For the duration, you hide a target that you touch from divination magic. The target can be a willing creature or a place or an object no larger than 10 feet in any dimension. The target can't be targeted by any divination magic or perceived through magical scrying sensors.",
    "classes": [
      "bard",
      "ranger",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "nystuls-magic-aura",
    "name": "Nystul's Magic Aura",
    "level": 2,
    "school": "Illusion",
    "castingTime": "1 action",
    "range": "touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a small square of silk"
    },
    "duration": "24 hour",
    "concentration": false,
    "ritual": false,
    "description": "You place an illusion on a creature or an object you touch so that divination spells reveal false information about it. The target can be a willing creature or an object that isn't being carried or worn by another creature.\nWhen you cast the spell, choose one or both of the following effects. The effect lasts for the duration. If you cast this spell on the same creature or object every day for 30 days, placing the same effect on it each time, the illusion lasts until it is dispelled.\nFalse Aura:\nY\no\nu\n \nc\nh\na\nn\ng\ne\n \nt\nh\ne\n \nw\na\ny\n \nt\nh\ne\n \nt\na\nr\ng\ne\nt\n \na\np\np\ne\na\nr\ns\n \nt\no\n \ns\np\ne\nl\nl\ns\n \na\nn\nd\n \nm\na\ng\ni\nc\na\nl\n \ne\nf\nf\ne\nc\nt\ns\n,\n \ns\nu\nc\nh\n \na\ns\n \nd\ne\nt\ne\nc\nt\n \nm\na\ng\ni\nc\n,\n \nt\nh\na\nt\n \nd\ne\nt\ne\nc\nt\n \nm\na\ng\ni\nc\na\nl\n \na\nu\nr\na\ns\n.\n \nY\no\nu\n \nc\na\nn\n \nm\na\nk\ne\n \na\n \nn\no\nn\nm\na\ng\ni\nc\na\nl\n \no\nb\nj\ne\nc\nt\n \na\np\np\ne\na\nr\n \nm\na\ng\ni\nc\na\nl\n,\n \na\n \nm\na\ng\ni\nc\na\nl\n \no\nb\nj\ne\nc\nt\n \na\np\np\ne\na\nr\n \nn\no\nn\nm\na\ng\ni\nc\na\nl\n,\n \no\nr\n \nc\nh\na\nn\ng\ne\n \nt\nh\ne\n \no\nb\nj\ne\nc\nt\n'\ns\n \nm\na\ng\ni\nc\na\nl\n \na\nu\nr\na\n \ns\no\n \nt\nh\na\nt\n \ni\nt\n \na\np\np\ne\na\nr\ns\n \nt\no\n \nb\ne\nl\no\nn\ng\n \nt\no\n \na\n \ns\np\ne\nc\ni\nf\ni\nc\n \ns\nc\nh\no\no\nl\n \no\nf\n \nm\na\ng\ni\nc\n \nt\nh\na\nt\n \ny\no\nu\n \nc\nh\no\no\ns\ne\n.\n \nW\nh\ne\nn\n \ny\no\nu\n \nu\ns\ne\n \nt\nh\ni\ns\n \ne\nf\nf\ne\nc\nt\n \no\nn\n \na\nn\n \no\nb\nj\ne\nc\nt\n,\n \ny\no\nu\n \nc\na\nn\n \nm\na\nk\ne\n \nt\nh\ne\n \nf\na\nl\ns\ne\n \nm\na\ng\ni\nc\n \na\np\np\na\nr\ne\nn\nt\n \nt\no\n \na\nn\ny\n \nc\nr\ne\na\nt\nu\nr\ne\n \nt\nh\na\nt\n \nh\na\nn\nd\nl\ne\ns\n \nt\nh\ne\n \ni\nt\ne\nm\n.\nMask:\nY\no\nu\n \nc\nh\na\nn\ng\ne\n \nt\nh\ne\n \nw\na\ny\n \nt\nh\ne\n \nt\na\nr\ng\ne\nt\n \na\np\np\ne\na\nr\ns\n \nt\no\n \ns\np\ne\nl\nl\ns\n \na\nn\nd\n \nm\na\ng\ni\nc\na\nl\n \ne\nf\nf\ne\nc\nt\ns\n \nt\nh\na\nt\n \nd\ne\nt\ne\nc\nt\n \nc\nr\ne\na\nt\nu\nr\ne\n \nt\ny\np\ne\ns\n,\n \ns\nu\nc\nh\n \na\ns\n \na\n \np\na\nl\na\nd\ni\nn\n'\ns\n \n{\n@\nc\nl\na\ns\ns\nF\ne\na\nt\nu\nr\ne\n \nD\ni\nv\ni\nn\ne\n \nS\ne\nn\ns\ne\n|\nP\na\nl\na\nd\ni\nn\n|\nP\nH\nB\n|\n1\n}\n \no\nr\n \nt\nh\ne\n \nt\nr\ni\ng\ng\ne\nr\n \no\nf\n \na\n \ns\ny\nm\nb\no\nl\n \ns\np\ne\nl\nl\n.\n \nY\no\nu\n \nc\nh\no\no\ns\ne\n \na\n \nc\nr\ne\na\nt\nu\nr\ne\n \nt\ny\np\ne\n \na\nn\nd\n \no\nt\nh\ne\nr\n \ns\np\ne\nl\nl\ns\n \na\nn\nd\n \nm\na\ng\ni\nc\na\nl\n \ne\nf\nf\ne\nc\nt\ns\n \nt\nr\ne\na\nt\n \nt\nh\ne\n \nt\na\nr\ng\ne\nt\n \na\ns\n \ni\nf\n \ni\nt\n \nw\ne\nr\ne\n \na\n \nc\nr\ne\na\nt\nu\nr\ne\n \no\nf\n \nt\nh\na\nt\n \nt\ny\np\ne\n \no\nr\n \no\nf\n \nt\nh\na\nt\n \na\nl\ni\ng\nn\nm\ne\nn\nt\n.",
    "classes": [
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "pass-without-trace",
    "name": "Pass Without Trace",
    "level": 2,
    "school": "Abjuration",
    "castingTime": "1 action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "ashes from a burned leaf of mistletoe and a sprig of spruce"
    },
    "duration": "Concentration, up to 1 hour",
    "concentration": true,
    "ritual": false,
    "description": "A veil of shadows and silence radiates from you, masking you and your companions from detection. For the duration, each creature you choose within 30 feet of you (including you) has a +10 bonus to Dexterity (Stealth) checks and can't be tracked except by magical means. A creature that receives this bonus leaves behind no tracks or other traces of its passage.",
    "classes": [
      "druid",
      "ranger"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "phantasmal-force",
    "name": "Phantasmal Force",
    "level": 2,
    "school": "Illusion",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a bit of fleece"
    },
    "duration": "Concentration, 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "You craft an illusion that takes root in the mind of a creature that you can see within range. The target must make an Intelligence saving throw. On a failed save, you create a phantasmal object, creature, or other visible phenomenon of your choice that is no larger than a 10-foot cube and that is perceivable only to the target for the duration. This spell has no effect on undead or constructs.\nThe phantasm includes sound, temperature, and other stimuli, also evident only to the creature.\nThe target can use its action to examine the phantasm with an Intelligence (Investigation) check against your spell save DC. If the check succeeds, the target realizes that the phantasm is an illusion, and the spell ends.\nWhile a target is affected by the spell, the target treats the phantasm as if it were real. The target rationalizes any illogical outcomes from interacting with the phantasm. For example, a target attempting to walk across a phantasmal bridge that spans a chasm falls once it steps onto the bridge. If the target survives the fall, it still believes that the bridge exists and comes up with some other explanation for its fall—it was pushed, it slipped, or a strong wind might have knocked it off.\nAn affected target is so convinced of the phantasm's reality that it can even take damage from the illusion. A phantasm created to appear as a creature can attack the target. Similarly, a phantasm created to appear as fire, a pool of acid, or lava can burn the target. Each round on your turn, the phantasm can deal 1d6 psychic damage to the target if it is in the phantasm's area or within 5 feet of the phantasm, provided that the illusion is of a creature or hazard that could logically deal damage, such as by attacking. The target perceives the damage as a type appropriate to the illusion.",
    "classes": [
      "bard",
      "sorcerer",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "phantom-steed",
    "name": "Phantom Steed",
    "level": 3,
    "school": "Illusion",
    "castingTime": "1 minute",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "1 hour",
    "concentration": false,
    "ritual": true,
    "description": "A large quasi-real, horse-like creature appears on the ground in an unoccupied space of your choice within range. You decide the creature's appearance, but it is equipped with a saddle, bit, and bridle. Any of the equipment created by the spell vanishes in a puff of smoke if it is carried more than 10 feet away from the steed. For the duration, you or a creature you choose can ride the steed. The creature uses the statistics for a riding horse, except it has a speed of 100 feet and can travel 10 miles in an hour, or 13 miles at a fast pace. When the spell ends, the steed gradually fades, giving the rider 1 minute to dismount. The spell ends if you use an action to dismiss it or if the steed takes any damage.",
    "classes": [
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "plant-growth",
    "name": "Plant Growth",
    "level": 3,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "150 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "This spell channels vitality into plants within a specific area. There are two possible uses for the spell, granting either immediate or long-term benefits. If you cast this spell using 1 action, choose a point within range. All normal plants in a 100-foot radius centered on that point become thick and overgrown. A creature moving through the area must spend 4 feet of movement for every 1 foot it moves. You have an 8-hour casting time if you traverse the land within a 1 mile radius. All plants in a half-mile radius centered on a point within range become enriched for 1 year. The plants yield twice the normal amount of food when harvested.",
    "classes": [
      "bard",
      "druid",
      "ranger"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "poison-spray",
    "name": "Poison Spray",
    "level": 0,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "10 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You extend your hand toward a creature you can see within range and project a puff of noxious gas from your palm. The creature must succeed on a Constitution saving throw or take 1d12 poison damage.",
    "higherLevels": "This spell's damage increases by 1d12 when you reach 5th level (2d12), 11th level (3d12), and 17th level (4d12).",
    "classes": [
      "druid",
      "sorcerer",
      "warlock",
      "wizard",
      "artificer"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "polymorph",
    "name": "Polymorph",
    "level": 4,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a caterpillar cocoon"
    },
    "duration": "Concentration, up to 1 hour",
    "concentration": true,
    "ritual": false,
    "description": "This spell transforms a creature that you can see within range into a new form. An unwilling creature must make a Wisdom saving throw to avoid the effect. The spell has no effect on a shapechanger or a creature with 0 hit points. The transformation lasts for the duration, or until the target drops to 0 hit points or dies. The new form can be any beast whose challenge rating is equal to or less than the target's (or the target's level, if it doesn't have a challenge rating).",
    "classes": [
      "bard",
      "druid",
      "sorcerer",
      "wizard",
      "witch",
      "apothecary"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "prayer-of-healing",
    "name": "Prayer of Healing",
    "level": 2,
    "school": "Evocation",
    "castingTime": "10 minutes",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "Up to six creatures of your choice that you can see within range each regain hit points equal to 2d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs.",
    "higherLevels": "When you cast this spell using a spell slot of 3rd level or higher, the healing increases by 1d8 for each slot level above 2nd.",
    "classes": [
      "cleric"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "prestidigitation",
    "name": "Prestidigitation",
    "level": 0,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "10 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Up to 1 hour",
    "concentration": false,
    "ritual": false,
    "description": "This spell is a minor magical trick that novice spellcasters use for practice. You create one of the following magical effects within range: a harmless sensory effect, light/snuff a candle or torch, clean/soil an object, chill/warm/flavor material, make a mark appear, or create a trinket or illusion that fits in your hand.",
    "classes": [
      "bard",
      "sorcerer",
      "warlock",
      "wizard",
      "artificer"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "primal-savagery",
    "name": "Primal Savagery",
    "level": 0,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "self",
    "components": {
      "verbal": false,
      "somatic": true,
      "material": false,
      "materialDescription": ""
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You channel primal magic to cause your teeth or fingernails to sharpen, ready to deliver a corrosive attack. Make a melee spell attack against one creature within 5 feet of you. On a hit, the target takes 1d10 acid damage. After you make the attack, your teeth or fingernails return to normal.\nThe spell's damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).",
    "classes": [
      "druid"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "produce-flame",
    "name": "Produce Flame",
    "level": 0,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "10 minutes",
    "concentration": false,
    "ritual": false,
    "description": "A flickering flame appears in your hand. The flame remains there for the duration and harms neither you nor your equipment. The flame sheds bright light in a 10-foot radius and dim light for an additional 10 feet. The spell ends if you dismiss it as an action or if you cast it again. You can also attack with the flame as a ranged spell attack.",
    "higherLevels": "This spell's damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).",
    "classes": [
      "druid"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "protection-from-energy",
    "name": "Protection from Energy",
    "level": 3,
    "school": "Abjuration",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Concentration, up to 1 hour",
    "concentration": true,
    "ritual": false,
    "description": "For the duration, the willing creature you touch has resistance to one damage type of your choice: acid, cold, fire, lightning, or thunder.",
    "classes": [
      "bard",
      "druid",
      "ranger",
      "sorcerer",
      "wizard",
      "witch",
      "apothecary",
      "artificer"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "protection-from-evil-and-good",
    "name": "Protection from Evil and Good",
    "level": 1,
    "school": "Abjuration",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "holy water or powdered silver and iron, which the spell consumes"
    },
    "duration": "Concentration, up to 10 minutes",
    "concentration": true,
    "ritual": false,
    "description": "Until the spell ends, one willing creature you touch is protected against certain types of creatures: aberrations, celestials, elementals, fey, fiends, and undead. The protection grants several benefits. Creatures of those types have disadvantage on attack rolls against the target. The target also can’t be charmed, frightened, or possessed by them. If the target is already charmed, frightened, or possessed by such a creature, the target has advantage on any new saving throw against the relevant effect.",
    "classes": [
      "cleric",
      "druid",
      "paladin",
      "warlock",
      "wizard",
      "martyr",
      "witch"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "protection-from-poison",
    "name": "Protection from Poison",
    "level": 2,
    "school": "Abjuration",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "1 hour",
    "concentration": false,
    "ritual": false,
    "description": "You touch a creature. If it is poisoned, you neutralize the poison. If more than one poison afflicts the target, you neutralize one poison that you know is present, or you neutralize one at random. For the duration, the target has advantage on saving throws against being poisoned, and it has resistance to poison damage.",
    "classes": [
      "cleric",
      "druid",
      "paladin",
      "ranger",
      "artificer"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "purify-food-and-drink",
    "name": "Purify Food and Drink",
    "level": 1,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "10 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": true,
    "description": "All nonmagical food and drink within a 5-foot-radius sphere centered on a point of your choice within range is purified and rendered free of poison and disease.",
    "classes": [
      "cleric",
      "druid",
      "paladin",
      "artificer",
      "apothecary",
      "witch"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "pyrotechnics",
    "name": "Pyrotechnics",
    "level": 2,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "Choose an area of nonmagical flame that you can see and that fits within a 5-foot cube within range. You can extinguish the fire in that area, and you create either fireworks or smoke when you do so.",
    "classes": [
      "artificer",
      "bard",
      "sorcerer",
      "wizard"
    ],
    "source": "Xanathar's Guide to Everything",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "ray-of-enfeeblement",
    "name": "Ray of Enfeeblement",
    "level": 2,
    "school": "Necromancy",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "A black beam of enervating energy springs from your finger toward a creature within range. Make a ranged spell attack against the target. On a hit, the target deals only half damage with weapon attacks that use Strength until the spell ends. At the end of each of the target's turns, it can make a Constitution saving throw against the spell. On a success, the spell ends.",
    "classes": [
      "warlock",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "ray-of-frost",
    "name": "Ray of Frost",
    "level": 0,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "A frigid beam of blue-white light streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, it takes 1d8 cold damage, and its speed is reduced by 10 feet until the start of your next turn.",
    "higherLevels": "The spell's damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).",
    "classes": [
      "artificer",
      "sorcerer",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "ray-of-sickness",
    "name": "Ray of Sickness",
    "level": 1,
    "school": "Necromancy",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "A ray of sickening greenish energy lashes out toward a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 2d8 poison damage and must make a Constitution saving throw. On a failed save, it is also poisoned until the end of your next turn.",
    "higherLevels": "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st.",
    "classes": [
      "sorcerer",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "remove-curse",
    "name": "Remove Curse",
    "level": 3,
    "school": "Abjuration",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "At your touch, all curses affecting one creature or object end. If the object is a cursed magic item, its curse remains, but the spell breaks its owner's attunement to the object so it can be removed or discarded.",
    "classes": [
      "cleric",
      "paladin",
      "warlock",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "resistance",
    "name": "Resistance",
    "level": 0,
    "school": "Abjuration",
    "castingTime": "1 action",
    "range": "touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a miniature cloak"
    },
    "duration": "Concentration, 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one saving throw of its choice. It can roll the die before or after making the saving throw. The spell then ends.",
    "classes": [
      "druid",
      "cleric"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "revivify",
    "name": "Revivify",
    "level": 3,
    "school": "Necromancy",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "diamonds worth 300 gp, which the spell consumes"
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You touch a creature that has died within the last minute. That creature returns to life with 1 hit point. This spell can't return to life a creature that has died of old age, nor can it restore any missing body parts.",
    "classes": [
      "cleric",
      "paladin",
      "artificer",
      "martyr",
      "apothecary"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "rope-trick",
    "name": "Rope Trick",
    "level": 2,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "powdered corn extract and a twisted loop of parchment"
    },
    "duration": "1 hour",
    "concentration": false,
    "ritual": false,
    "description": "You touch a length of rope that is up to 60 feet long. One end of the rope then rises into the air until the whole rope hangs perpendicular to the ground. At the upper end of the rope, an invisible entrance opens to an extradimensional space that lasts until the spell ends. The extradimensional space can be reached by climbing to the top of the rope. The space can hold as many as eight Medium or smaller creatures.",
    "classes": [
      "wizard",
      "artificer"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "sacred-flame",
    "name": "Sacred Flame",
    "level": 0,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "Flame-like radiance descends on a creature that you can see within range. The target must succeed on a Dexterity saving throw or take 1d8 radiant damage. The target gains no benefit from cover for this saving throw.",
    "higherLevels": "The spell's damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).",
    "classes": [
      "cleric"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "sanctuary",
    "name": "Sanctuary",
    "level": 1,
    "school": "Abjuration",
    "castingTime": "1 bonus action",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a small silver mirror"
    },
    "duration": "1 minute",
    "concentration": false,
    "ritual": false,
    "description": "You ward a creature within range against attack. Until the spell ends, any creature who targets the warded creature with an attack or a harmful spell must first make a Wisdom saving throw. On a failed save, the creature must choose a new target or lose the attack or spell. This spell doesn’t protect the warded creature from area effects, such as the explosion of a fireball. If the warded creature makes an attack, casts a spell that affects an enemy, or deals damage to another creature, this spell ends.",
    "classes": [
      "cleric",
      "artificer",
      "martyr"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "scorching-ray",
    "name": "Scorching Ray",
    "level": 2,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "120 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You create three rays of fire and hurl them at targets within range. You can hurl them at one target or several. Make a ranged spell attack for each ray. On a hit, the target takes 2d6 fire damage.",
    "higherLevels": "When you cast this spell using a spell slot of 3rd level or higher, you create one additional ray for each slot level above 2nd.",
    "classes": [
      "sorcerer",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "scrying",
    "name": "Scrying",
    "level": 5,
    "school": "Divination",
    "castingTime": "10 minutes",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a focus worth at least 1,000 gp, such as a crystal ball"
    },
    "duration": "Concentration, up to 10 minutes",
    "concentration": true,
    "ritual": false,
    "description": "You can see and hear a particular creature you choose that is on the same plane of existence as you. The target must make a Wisdom saving throw, which is modified by how well you know the target and the sort of physical connection you have to it. If a target knows you're casting this spell, it can fail the saving throw voluntarily if it wants to be observed.",
    "classes": [
      "bard",
      "cleric",
      "druid",
      "warlock",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "searing-smite",
    "name": "Searing Smite",
    "level": 1,
    "school": "Evocation",
    "castingTime": "1 bonus action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "The next time you hit a creature with a melee weapon attack during the spell's duration, your weapon flares with white-hot intensity, and the attack deals an extra 1d6 fire damage to the target and causes the target to ignite. At the start of each of its turns until the spell ends, the target must make a Constitution saving throw. On a failed save, it takes 1d6 fire damage. On a successful save, the spell ends. If the target or a creature within 5 feet of it uses an action to put out the flames, or if some other effect douses the flames (such as the target being submerged in water), the spell ends.",
    "higherLevels": "When you cast this spell using a spell slot of 2nd level or higher, the initial extra damage dealt by the attack increases by 1d6 for each slot level above 1st.",
    "classes": [
      "paladin"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "see-invisibility",
    "name": "See Invisibility",
    "level": 2,
    "school": "Divination",
    "castingTime": "1 action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a pinch of talc and a small sprinkling of powdered silver"
    },
    "duration": "1 hour",
    "concentration": false,
    "ritual": false,
    "description": "For the duration, you see invisible creatures and objects as if they were visible, and you can see into the Ethereal Plane. Ethereal creatures and objects appear ghostly and translucent.",
    "classes": [
      "bard",
      "sorcerer",
      "wizard",
      "artificer"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "sending",
    "name": "Sending",
    "level": 3,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "Unlimited",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a short piece of fine copper wire"
    },
    "duration": "1 round",
    "concentration": false,
    "ritual": false,
    "description": "You send a short message of twenty-five words or less to a creature with which you are familiar. The creature hears the message in its mind, recognizes you as the sender if it knows you, and can answer in a like manner immediately. The spell enables creatures with Intelligence scores of at least 1 to understand the meaning of your message. You can send the message across any distance and even to other planes of existence, but if the target is on a different plane than you, there is a 5 percent chance that the message doesn't arrive.",
    "classes": [
      "bard",
      "cleric",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "shadow-blade",
    "name": "Shadow Blade",
    "level": 2,
    "school": "Illusion",
    "castingTime": "1 bonus",
    "range": "self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false,
      "materialDescription": ""
    },
    "duration": "Concentration, 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "You weave together threads of shadow to create a sword of solidified gloom in your hand. This magic sword lasts until the spell ends. It counts as a simple melee weapon with which you are proficient. It deals 2d8 psychic damage on a hit and has the finesse, light, and thrown properties (range 20/60). In addition, when you use the sword to attack a target that is in dim light or darkness, you make the attack roll with advantage.\nIf you drop the weapon or throw it, it dissipates at the end of the turn. Thereafter, while the spell persists, you can use a bonus action to cause the sword to reappear in your hand.",
    "classes": [
      "sorcerer",
      "warlock",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "shape-water",
    "name": "Shape Water",
    "level": 0,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": false,
      "somatic": true,
      "material": false,
      "materialDescription": ""
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You choose an area of water that you can see within range and that fits within a 5-foot cube. You manipulate it in one of the following ways:\n- You instantaneously move or otherwise change the flow of the water as you direct, up to 5 feet in any direction. This movement doesn't have enough force to cause damage.\n- You cause the water to form into simple shapes and animate at your direction. This change lasts for 1 hour.\n- You change the water's color or opacity. The water must be changed in the same way throughout. This change lasts for 1 hour.\n- You freeze the water, provided that there are no creatures in it. The water unfreezes in 1 hour.\nIf you cast this spell multiple times, you can have no more than two of its non-instantaneous effects active at a time, and you can dismiss such an effect as an action.",
    "classes": [
      "druid",
      "sorcerer",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "shatter",
    "name": "Shatter",
    "level": 2,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a chip of mica"
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "A sudden loud ringing noise, painfully intense, erupts from a point of your choice within range. Each creature in a 10-foot-radius sphere centered on that point must make a Constitution saving throw. A creature takes 3d8 thunder damage on a failed save, or half as much damage on a successful one. A creature made of inorganic material such as stone, crystal, or metal has disadvantage on this saving throw.",
    "higherLevels": "When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d8 for each slot level above 2nd.",
    "classes": [
      "bard",
      "sorcerer",
      "warlock",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "shield",
    "name": "Shield",
    "level": 1,
    "school": "Abjuration",
    "castingTime": "1 reaction",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "1 round",
    "concentration": false,
    "ritual": false,
    "description": "An invisible barrier of magical force appears and protects you. Until the start of your next turn, you have a +5 bonus to AC, including against the triggering attack, and you take no damage from magic missile.",
    "classes": [
      "sorcerer",
      "wizard",
      "warmage"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "shield-of-faith",
    "name": "Shield of Faith",
    "level": 1,
    "school": "Abjuration",
    "castingTime": "1 bonus action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a small parchment with holy text"
    },
    "duration": "Concentration, up to 10 minutes",
    "concentration": true,
    "ritual": false,
    "description": "A shimmering field appears and surrounds a creature of your choice within range, granting it a +2 bonus to AC for the duration.",
    "classes": [
      "cleric",
      "paladin",
      "martyr",
      "healer"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "shillelagh",
    "name": "Shillelagh",
    "level": 0,
    "school": "Transmutation",
    "castingTime": "1 bonus action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "mistletoe, a shamrock leaf, and a club or quarterstaff"
    },
    "duration": "1 minute",
    "concentration": false,
    "ritual": false,
    "description": "The wood of a club or quarterstaff you are holding is imbued with nature’s power. For the duration, you can use your spellcasting ability instead of Strength for the attack and damage rolls of melee attacks using that weapon, and the weapon’s damage die becomes a d8. The weapon also becomes magical, if it isn’t already. The spell ends if you cast it again or if you let go of the weapon.",
    "classes": [
      "druid"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "shocking-grasp",
    "name": "Shocking Grasp",
    "level": 0,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "Lightning springs from your hand to deliver a shock to a creature you try to touch. Make a melee spell attack against the target. You have advantage on the attack roll if the target is wearing armor made of metal. On a hit, the target takes 1d8 lightning damage, and it can't take reactions until the start of its next turn.",
    "higherLevels": "The spell's damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).",
    "classes": [
      "sorcerer",
      "wizard",
      "artificer"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "silence",
    "name": "Silence",
    "level": 2,
    "school": "Illusion",
    "castingTime": "1 action",
    "range": "120 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Concentration, up to 10 minutes",
    "concentration": true,
    "ritual": true,
    "description": "For the duration, no sound can be created within or pass through a 20-foot-radius sphere centered on a point you choose within range. Any creature or object entirely inside the sphere is immune to thunder damage, and creatures are deafened while entirely inside it. Casting a spell that includes a verbal component is impossible there.",
    "classes": [
      "bard",
      "cleric",
      "ranger"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "silent-image",
    "name": "Silent Image",
    "level": 1,
    "school": "Illusion",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a bit of fleece"
    },
    "duration": "Concentration, up to 10 minutes",
    "concentration": true,
    "ritual": false,
    "description": "You create the image of an object, a creature, or some other visible phenomenon that is no larger than a 15-foot cube. The image appears at a spot within range and lasts for the duration. The image is purely visual; it isn’t accompanied by sound, smell, or other sensory effects. You can use your action to cause the image to move to any spot within range. As the image changes location, you can alter its appearance so that its movements appear natural for the image.",
    "classes": [
      "bard",
      "sorcerer",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "skywrite",
    "name": "Skywrite",
    "level": 2,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "Sight",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Concentration, up to 1 hour",
    "concentration": true,
    "ritual": true,
    "description": "You cause up to ten words to form in a part of the sky you can see. The words appear to be made of cloud and remain in place for the spell's duration. The words dissipate when the spell ends. A strong wind can disperse the clouds and end the spell early.",
    "classes": [
      "artificer",
      "bard",
      "druid",
      "wizard",
      "witch"
    ],
    "source": "Xanathar's Guide to Everything",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "sleep",
    "name": "Sleep",
    "level": 1,
    "school": "Enchantment",
    "castingTime": "1 action",
    "range": "90 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a pinch of fine sand, rose petals, or a cricket"
    },
    "duration": "1 minute",
    "concentration": false,
    "ritual": false,
    "description": "This spell sends creatures into a magical slumber. Roll 5d8; the total is how many hit points of creatures this spell can affect. Creatures within 20 feet of a point you choose within range are affected in ascending order of their current hit points (ignoring unconscious creatures). Starting with the creature that has the lowest current hit points, each creature affected by this spell falls unconscious until the spell ends, the sleeper takes damage, or someone uses an action to shake or slap the sleeper awake.",
    "higherLevels": "When you cast this spell using a spell slot of 2nd level or higher, roll an additional 2d8 for each slot level above 1st.",
    "classes": [
      "bard",
      "sorcerer",
      "wizard",
      "witch"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "sleet-storm",
    "name": "Sleet Storm",
    "level": 3,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "150 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a pinch of dust and a few drops of water"
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "Until the spell ends, freezing rain and sleet fall in a 20-foot-tall cylinder with a 40-foot radius centered on a point you choose within range. The area is heavily obscured, and exposed flames in the area are doused. The ground in the area is covered with slick ice, making it difficult terrain. When a creature enters the spell's area for the first time on a turn or starts its turn there, it must make a Dexterity saving throw. On a failed save, it falls prone.",
    "classes": [
      "druid",
      "sorcerer",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "slow",
    "name": "Slow",
    "level": 3,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "120 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a drop of molasses"
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "You alter time around up to six creatures of your choice in a 40-foot cube within range. Each target must succeed on a Wisdom saving throw or be affected by this spell for the duration. An affected target's speed is halved, it takes a −2 penalty to AC and Dexterity saving throws, and it can't use reactions. On its turn, it can use either an action or a bonus action, not both.",
    "classes": [
      "sorcerer",
      "wizard",
      "warmage",
      "witch"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "snare",
    "name": "Snare",
    "level": 1,
    "school": "Abjuration",
    "castingTime": "1 minute",
    "range": "Touch",
    "components": {
      "verbal": false,
      "somatic": true,
      "material": true,
      "materialDescription": "25 feet of rope, which the spell consumes"
    },
    "duration": "8 hours",
    "concentration": false,
    "ritual": false,
    "description": "As you cast this spell, you use the rope to create a circle with a 5-foot radius on the ground or the floor. When you finish casting, the rope disappears and the circle becomes a magic trap. This trap is nearly invisible, requiring a successful Intelligence (Investigation) check against your spell save DC to be found. The trap triggers when a Small, Medium, or Large creature moves onto the ground or the floor in the circle. That creature must succeed on a Dexterity saving throw or be magically hoisted into the air, leaving it hanging upside down 3 feet above the ground or the floor. The creature is restrained there until the spell ends.",
    "classes": [
      "artificer",
      "druid",
      "ranger",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "snillocs-snowball-swarm",
    "name": "Snilloc's Snowball Swarm",
    "level": 2,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "90 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a piece of ice or a small white rock chip"
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "A flurry of magic snowballs erupts from a point you choose within range. Each creature in a 5-foot-radius sphere centered on that point must make a Dexterity saving throw. A creature takes 3d6 cold damage on a failed save, or half as much damage on a successful one.",
    "classes": [],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "spare-the-dying",
    "name": "Spare the Dying",
    "level": 0,
    "school": "Necromancy",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You touch a living creature that has 0 hit points. The creature becomes stable. This spell has no effect on undead or constructs.",
    "classes": [
      "cleric",
      "artificer",
      "martyr",
      "apothecary"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "speak-with-animals",
    "name": "Speak with Animals",
    "level": 1,
    "school": "Divination",
    "castingTime": "1 action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "10 minutes",
    "concentration": false,
    "ritual": true,
    "description": "You gain the ability to comprehend and verbally communicate with beasts for the duration. The knowledge and awareness of many beasts is limited by their intelligence, but at minimum, beasts can give you information about nearby locations and monsters, including whatever they can perceive or have perceived within the past day.",
    "classes": [
      "bard",
      "druid",
      "ranger",
      "witch"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "speak-with-dead",
    "name": "Speak with Dead",
    "level": 3,
    "school": "Necromancy",
    "castingTime": "1 action",
    "range": "10 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "burning incense"
    },
    "duration": "10 minutes",
    "concentration": false,
    "ritual": false,
    "description": "You grant the semblance of life and intelligence to a corpse of your choice within range, allowing it to answer the questions you pose. The corpse must still have a mouth and can't be undead. The spell fails if the corpse was the target of this spell within the last 10 days. Until the spell ends, you can ask the corpse up to five questions. The corpse knows only what it knew in life, including the languages it knew. Answers are usually brief, cryptic, or repetitive, and the corpse is under no compulsion to offer a truthful answer if you are hostile to it or it recognizes you as an enemy.",
    "classes": [
      "bard",
      "cleric"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "speak-with-plants",
    "name": "Speak with Plants",
    "level": 3,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "Self (30-foot radius)",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "10 minutes",
    "concentration": false,
    "ritual": false,
    "description": "You imbue plants within 30 feet of you with limited sentience and animation, giving them the ability to communicate with you and follow your simple commands. You can question plants about events in the spell's area within the past day, gaining information about creatures that have passed, weather, and other circumstances. You can also turn difficult terrain caused by plant growth (such as thickets and undergrowth) into ordinary terrain that lasts for the duration. Or you can turn ordinary terrain where plants are present into difficult terrain that lasts for the duration, causing vines and branches to hinder mobile creatures. Plants might be able to perform other tasks on your behalf, at the DM's discretion.",
    "classes": [
      "bard",
      "druid",
      "ranger"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "spider-climb",
    "name": "Spider Climb",
    "level": 2,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a drop of bitumen and a spider"
    },
    "duration": "Concentration, up to 1 hour",
    "concentration": true,
    "ritual": false,
    "description": "Until the spell ends, one willing creature you touch gains the ability to move up, down, and across vertical surfaces and upside down along ceilings, while leaving its hands free. The target also gains a climbing speed equal to its walking speed.",
    "classes": [
      "sorcerer",
      "warlock",
      "wizard",
      "artificer"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "spike-growth",
    "name": "Spike Growth",
    "level": 2,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "150 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "seven sharp thorns or seven small twigs, each sharpened to a point"
    },
    "duration": "Concentration, up to 10 minutes",
    "concentration": true,
    "ritual": false,
    "description": "The ground in a 20-foot radius centered on a point within range twists and sprouts hard spikes and thorns. The area becomes difficult terrain for the duration. When a creature moves into or within the area, it takes 2d4 piercing damage for every 5 feet it travels. The transformation of the ground is camouflaged to look natural. Any creature that can't see the area at the time the spell is cast must make a Wisdom (Perception) check against your spell save DC to recognize the terrain as hazardous before entering it.",
    "classes": [
      "druid",
      "ranger"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "spirit-guardians",
    "name": "Spirit Guardians",
    "level": 3,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "Self (15-foot radius)",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a holy symbol"
    },
    "duration": "Concentration, up to 10 minutes",
    "concentration": true,
    "ritual": false,
    "description": "You call forth spirits to protect you. They flit around you to a distance of 15 feet for the duration. If you are good or neutral, their spectral form appears angelic or fey (your choice). If you are evil, they appear fiendish. When you cast this spell, you can designate any number of creatures you can see to be unaffected by it. An affected creature's speed is halved in the area, and when the creature enters the area for the first time on a turn or starts its turn there, it must make a Wisdom saving throw. On a failed save, the creature takes 3d8 radiant damage (if you are good or neutral) or 3d8 necrotic damage (if you are evil). On a successful save, the creature takes half as much damage.",
    "higherLevels": "When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d8 for each slot level above 3rd.",
    "classes": [
      "cleric",
      "martyr",
      "angel"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "spiritual-weapon",
    "name": "Spiritual Weapon",
    "level": 2,
    "school": "Evocation",
    "castingTime": "1 bonus action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "1 minute",
    "concentration": false,
    "ritual": false,
    "description": "You create a floating, spectral weapon within range that lasts for the duration or until you cast this spell again. When you cast the spell, you can make a melee spell attack against a creature within 5 feet of the weapon. On a hit, the target takes force damage equal to 1d8 + your spellcasting ability modifier. As a bonus action on your turn, you can move the weapon up to 20 feet and repeat the attack against a creature within 5 feet of it.",
    "higherLevels": "When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d8 for every two slot levels above 2nd.",
    "classes": [
      "cleric"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "stinking-cloud",
    "name": "Stinking Cloud",
    "level": 3,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "90 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a rotten egg or several skunk cabbage leaves"
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "You create a 20-foot-radius sphere of yellow, nauseating gas centered on a point within range. The cloud spreads around corners, and its area is heavily obscured. The cloud lingers in the air for the duration. Each creature that is completely within the cloud at the start of its turn must make a Constitution saving throw against poison. On a failed save, the creature spends its action that turn retching and reeling. Creatures that don't need to breathe or are immune to poison automatically succeed on this saving throw. A moderate wind (at least 10 miles per hour) disperses the cloud after 4 rounds. A strong wind (at least 20 miles per hour) disperses it after 1 round.",
    "classes": [
      "bard",
      "sorcerer",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "suggestion",
    "name": "Suggestion",
    "level": 2,
    "school": "Enchantment",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": true
    },
    "duration": "Concentration, up to 8 hours",
    "concentration": true,
    "ritual": false,
    "description": "You suggest a course of activity (limited to a sentence or two) and magically influence a creature you can see within range that can hear and understand you. Creatures that can't be charmed are immune to this effect. The suggestion must be worded in such a manner as to make the course of action sound reasonable. Asking the creature to stab itself, throw itself onto a spear, immolate itself, or do some other obviously harmful act ends the spell. The target must make a Wisdom saving throw. On a failed save, it pursues the course of action you described to the best of its ability. The suggested course of action can continue for the entire duration. If the suggested activity can be completed in a shorter time, the spell ends when the subject finishes what it was asked to do. You can also specify conditions that will trigger a special activity during the duration. For example, you might suggest that a knight give her warhorse to the first beggar she meets. If the condition isn't met before the spell expires, the activity isn't performed. If you or any of your companions damage the target, the spell ends.",
    "classes": [
      "bard",
      "sorcerer",
      "warlock",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "summon-beast",
    "name": "Summon Beast",
    "level": 2,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "90 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a feather, tuft of fur, and fish tail inside a gilded acorn worth at least 200 gp"
    },
    "duration": "Concentration, 1 hour",
    "concentration": true,
    "ritual": false,
    "description": "You call forth a bestial spirit. It manifests in an unoccupied space that you can see within range. This corporeal form uses the Bestial Spirit stat block. When you cast the spell, choose an environment: Air, Land, or Water. The creature resembles an animal of your choice that is native to the chosen environment, which determines certain traits in its stat block. The creature disappears when it drops to 0 hit points or when the spell ends.\nThe creature is an ally to you and your companions. In combat, the creature shares your initiative count, but it takes its turn immediately after yours. It obeys your verbal commands (no action required by you). If you don't issue any, it takes the Dodge action and uses its move to avoid danger.",
    "classes": [
      "druid",
      "ranger"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "sword-burst",
    "name": "Sword Burst",
    "level": 0,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "5 feet",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false,
      "materialDescription": ""
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You create a momentary circle of spectral blades that sweep around you. All other creatures within 5 feet of you must succeed on a Dexterity saving throw or take 1d6 force damage.\nThis spell's damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).",
    "classes": [
      "sorcerer",
      "warlock",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "tashas-caustic-brew",
    "name": "Tasha's Caustic Brew",
    "level": 1,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "Self (30-foot line)",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a bit of rotten food"
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "A stream of acid emanates from you in a line 30 feet long and 5 feet wide in a direction you choose. Each creature in the line must succeed on a Dexterity saving throw or be covered in acid for the spell's duration or until a creature uses its action to scrape or wash the acid off itself or another creature. A creature covered in the acid takes 2d4 acid damage at the start of each of its turns.",
    "higherLevels": "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 2d4 for each slot level above 1st.",
    "classes": [
      "artificer",
      "sorcerer",
      "wizard"
    ],
    "source": "Tasha's Cauldron of Everything",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "tashas-hideous-laughter",
    "name": "Tasha's Hideous Laughter",
    "level": 1,
    "school": "Enchantment",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "tiny tarts and a feather that is waved in the air"
    },
    "duration": "Concentration, 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "A creature of your choice that you can see within range perceives everything as hilariously funny and falls into fits of laughter if this spell affects it. The target must succeed on a Wisdom saving throw or fall prone, becoming incapacitated and unable to stand up for the duration. A creature with an Intelligence score of 4 or less isn't affected.\nAt the end of each of its turns, and each time it takes damage, the target can make another Wisdom saving throw. The target has advantage on the saving throw if it's triggered by damage. On a success, the spell ends.",
    "classes": [],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "tashas-mind-whip",
    "name": "Tasha's Mind Whip",
    "level": 2,
    "school": "Enchantment",
    "castingTime": "1 action",
    "range": "90 feet",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false,
      "materialDescription": ""
    },
    "duration": "1 round",
    "concentration": false,
    "ritual": false,
    "description": "You psychically lash out at one creature you can see within range. The target must make an Intelligence saving throw. On a failed save, the target takes 3d6 psychic damage, and it can't take a reaction until the end of its next turn. Moreover, on its next turn, it must choose whether it gets a move, an action, or a bonus action; it gets only one of the three. On a successful save, the target takes half as much damage and suffers none of the spell's other effects.",
    "classes": [],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "teleportation-circle",
    "name": "Teleportation Circle",
    "level": 5,
    "school": "Conjuration",
    "castingTime": "1 minute",
    "range": "10 feet",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": true,
      "materialDescription": "rare chalks and inks infused with precious gems worth 50 gp, which the spell consumes"
    },
    "duration": "1 round",
    "concentration": false,
    "ritual": false,
    "description": "As you cast the spell, you draw a 10-foot-diameter circle on the ground inscribed with sigils that link your location to a permanent teleportation circle of your choice whose sigil sequence you know and that is on the same plane of existence as you.",
    "classes": [
      "bard",
      "sorcerer",
      "wizard",
      "witch"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "tensers-floating-disk",
    "name": "Tenser's Floating Disk",
    "level": 1,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true
    },
    "duration": "1 hour",
    "concentration": false,
    "ritual": true,
    "description": "This spell creates a circular, horizontal plane of force, 3 feet in diameter and 1 inch thick, that floats 3 feet above the ground in an unoccupied space of your choice that you can see within range. The disk remains for the duration, and can hold up to 500 pounds. If more weight is placed on it, the spell ends, and everything on the disk falls to the ground. The disk follows you so that it remains within 20 feet of you. It can move across uneven terrain, up or down stairs, slopes and the like, but it can't cross an elevation change of 10 feet or more. For example, it can't move across a 10-foot-deep pit, nor could it leave such a pit if it was created at the bottom. If you move more than 20 feet away from it, the disk follows you so that it remains within 20 feet of you. It can move across uneven terrain, up or down stairs, slopes and the like, but it can't cross an elevation change of 10 feet or more. For example, it can't move across a 10-foot-deep pit, nor could it leave such a pit if it was created at the bottom. If you move more than 100 feet from the disk (typically because it can't move around an obstacle to follow you), the spell ends.",
    "classes": [
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "thaumaturgy",
    "name": "Thaumaturgy",
    "level": 0,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false
    },
    "duration": "Up to 1 minute",
    "concentration": false,
    "ritual": false,
    "description": "You manifest a minor wonder, a sign of supernatural power, within range. You create one of the following magical effects within range: your voice booms, you cause flames to flicker, you cause harmless tremors, you create an instantaneous sound, you instantaneously open/close an unlocked door or window, or you alter the appearance of your eyes.",
    "classes": [
      "cleric"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "thorn-whip",
    "name": "Thorn Whip",
    "level": 0,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "the stem of a plant with thorns"
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You create a long, vine-like whip covered in thorns that lashes out at your command toward a creature in range. Make a melee spell attack against the target. If the attack hits, the creature takes 1d6 piercing damage, and if the creature is Large or smaller, you pull the creature up to 10 feet closer to you.",
    "higherLevels": "This spell's damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).",
    "classes": [
      "druid",
      "artificer"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "thunderclap",
    "name": "Thunderclap",
    "level": 0,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "5 feet",
    "components": {
      "verbal": false,
      "somatic": true,
      "material": false,
      "materialDescription": ""
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You create a burst of thunderous sound that can be heard up to 100 feet away. Each creature within range, other than you, must make a Constitution saving throw or take 1d6 thunder damage.\nThe spell's damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).",
    "classes": [
      "bard",
      "druid",
      "sorcerer",
      "warlock",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "thunderous-smite",
    "name": "Thunderous Smite",
    "level": 1,
    "school": "Evocation",
    "castingTime": "1 bonus",
    "range": "self",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false,
      "materialDescription": ""
    },
    "duration": "Concentration, 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "The first time you hit with a melee weapon attack during this spell's duration, your weapon rings with thunder that is audible within 300 feet of you, and the attack deals an extra 2d6 thunder damage to the target. Additionally, if the target is a creature, it must succeed on a Strength saving throw or be pushed 10 feet away from you and knocked prone.",
    "classes": [
      "paladin"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "thunderwave",
    "name": "Thunderwave",
    "level": 1,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "Self (15-foot cube)",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "A wave of thunderous force sweeps out from you. Each creature in a 15-foot cube originating from you must make a Constitution saving throw. On a failed save, a creature takes 2d8 thunder damage and is pushed 10 feet away from you. On a successful save, the creature takes half as much damage and isn't pushed. In addition, unsecured objects that are completely within the area of effect are automatically pushed 10 feet away from you by the spell's effect, and the spell emits a thunderous boom audible out to 300 feet.",
    "higherLevels": "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st.",
    "classes": [
      "bard",
      "druid",
      "sorcerer",
      "wizard",
      "witch",
      "apothecary"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "tiny-servant",
    "name": "Tiny Servant",
    "level": 3,
    "school": "Transmutation",
    "castingTime": "1 minute",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "8 hours",
    "concentration": false,
    "ritual": false,
    "description": "You touch one Tiny, nonmagical object that isn't attached to another object or a surface and that isn't being carried by another creature. The target animates and sprouts little arms and legs, becoming a creature under your control until the spell ends or the creature drops to 0 hit points.",
    "higherLevels": "When you cast this spell using a spell slot of 4th level or higher, you can animate two additional objects for each slot level above 3rd.",
    "classes": [
      "artificer",
      "wizard"
    ],
    "source": "Xanathar's Guide to Everything",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "toll-the-dead",
    "name": "Toll the Dead",
    "level": 0,
    "school": "Necromancy",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You point at one creature you can see within range, and the sound of a dolorous bell fills the air around it for a moment. The target must succeed on a Wisdom saving throw or take 1d8 necrotic damage. If the target is missing any of its hit points, it instead takes 1d12 necrotic damage.",
    "higherLevels": "The spell's damage increases by one die when you reach 5th level (2d8 or 2d12), 11th level (3d8 or 3d12), and 17th level (4d8 or 4d12).",
    "classes": [
      "cleric",
      "warlock",
      "wizard"
    ],
    "subclasses": [
      "Divine Soul"
    ],
    "source": "XGtE",
    "edition": "5e",
    "version": 1
  },
  {
    "id": "tongues",
    "name": "Tongues",
    "level": 3,
    "school": "Divination",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a small clay model of a ziggurat"
    },
    "duration": "1 hour",
    "concentration": false,
    "ritual": false,
    "description": "This spell grants the creature you touch the ability to understand any spoken language it hears. Moreover, when the target speaks, any creature that knows at least one language and can hear the target understands what it says.",
    "classes": [
      "bard",
      "cleric",
      "paladin",
      "sorcerer",
      "warlock",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "true-strike",
    "name": "True Strike",
    "level": 0,
    "school": "Divination",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": false,
      "somatic": true,
      "material": false
    },
    "duration": "Concentration, up to 1 round",
    "concentration": true,
    "ritual": false,
    "description": "You extend your hand and point a finger at a target in range. Your magic grants you a brief insight into the target's defenses. On your next turn, you gain advantage on your first attack roll against the target, provided that this spell hasn't ended.",
    "classes": [
      "bard",
      "sorcerer",
      "warlock",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "unseen-servant",
    "name": "Unseen Servant",
    "level": 1,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a piece of string and a bit of wood"
    },
    "duration": "1 hour",
    "concentration": false,
    "ritual": true,
    "description": "This spell creates an invisible, mindless, shapeless force that performs simple tasks at your command until the spell ends. The servant springs into existence in an unoccupied space on the ground within range. It has AC 10, 1 hit point, and a Strength of 2, and it can’t attack. If it drops to 0 hit points, the spell ends. Once on each of your turns as a bonus action, you can mentally command the servant to move up to 15 feet and interact with an object. The servant can perform simple tasks that a human servant could do, such as fetching things, cleaning, mending, folding clothes, lighting fires, serving food, and pouring wine.",
    "classes": [
      "bard",
      "warlock",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "vampiric-touch",
    "name": "Vampiric Touch",
    "level": 3,
    "school": "Necromancy",
    "castingTime": "1 action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "The touch of your shadow-wreathed hand can siphon the life force from others to heal your wounds. Make a melee spell attack against a creature within your reach. On a hit, the target takes 3d6 necrotic damage, and you regain hit points equal to half the amount of necrotic damage dealt. Until the spell ends, you can make the attack again on each of your turns as an action.",
    "higherLevels": "When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd.",
    "classes": [
      "warlock",
      "wizard",
      "necromancer",
      "blood-mage",
      "witch"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "vicious-mockery",
    "name": "Vicious Mockery",
    "level": 0,
    "school": "Enchantment",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You unleash a string of insults laced with subtle enchantments at a creature you can see within range. If the target can hear you (though it need not understand you), it must succeed on a Wisdom saving throw or take 1d4 psychic damage and have disadvantage on the next attack roll it makes before the end of its next turn.",
    "higherLevels": "This spell's damage increases by 1d4 when you reach 5th level (2d4), 11th level (3d4), and 17th level (4d4).",
    "classes": [
      "bard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "wall-of-fire",
    "name": "Wall of Fire",
    "level": 4,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "120 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a small piece of phosphorus"
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "You create a wall of fire on a solid surface within range. You can make the wall up to 60 feet long, 20 feet high, and 1 foot thick, or a ringed wall up to 20 feet in diameter, 20 feet high, and 1 foot thick. The wall is opaque and lasts for the duration. When the wall appears, each creature within its area must make a Dexterity saving throw. On a failed save, a creature takes 5d8 fire damage, or half as much damage on a successful save.",
    "higherLevels": "When you cast this spell using a spell slot of 5th level or higher, the damage increases by 1d8 for each slot level above 4th.",
    "classes": [
      "druid",
      "sorcerer",
      "wizard",
      "warmage",
      "blood-mage",
      "illrigger"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "warding-bond",
    "name": "Warding Bond",
    "level": 2,
    "school": "Abjuration",
    "castingTime": "1 action",
    "range": "Touch",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a pair of platinum rings worth at least 50 gp each, which you and the target must wear for the duration"
    },
    "duration": "1 hour",
    "concentration": false,
    "ritual": false,
    "description": "This spell wards a willing creature you touch and creates a mystic connection between you and the target until the spell ends. While the target is within 60 feet of you, it gains a +1 bonus to AC and saving throws, and it has resistance to all damage. Also, each time it takes damage, you take the same amount of damage. The spell ends if you drop to 0 hit points or if you and the target become separated by more than 60 feet.",
    "classes": [
      "cleric"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "warding-wind",
    "name": "Warding Wind",
    "level": 2,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "self",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false,
      "materialDescription": ""
    },
    "duration": "Concentration, 10 minute",
    "concentration": true,
    "ritual": false,
    "description": "A strong wind (20 miles per hour) blows around you in a 10-foot radius and moves with you, remaining centered on you. The wind lasts for the spell's duration.\nThe wind has the following effects:\n- It deafened you and other creatures in its area.\n- It extinguishes unprotected flames in its area that are torch-sized or smaller.\n- It hedges out vapor, gas, and fog that can be dispersed by strong wind.\n- The area is difficult terrain for creatures other than you.\n- The attack rolls of ranged weapon attacks have disadvantage if the attacks pass in or out of the wind.",
    "classes": [],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "water-breathing",
    "name": "Water Breathing",
    "level": 3,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a short reed or piece of straw"
    },
    "duration": "24 hours",
    "concentration": false,
    "ritual": true,
    "description": "This spell grants up to ten willing creatures you can see within range the ability to breathe underwater until the spell ends. Affected creatures also retain their normal mode of respiration.",
    "classes": [
      "druid",
      "ranger",
      "sorcerer",
      "wizard",
      "artificer"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "water-walk",
    "name": "Water Walk",
    "level": 3,
    "school": "Transmutation",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a piece of cork"
    },
    "duration": "1 hour",
    "concentration": false,
    "ritual": true,
    "description": "This spell grants the ability to move across any liquid surface—such as water, acid, mud, snow, quicksand, or lava—as if it were harmless solid ground (creatures crossing molten lava can still take damage from the heat). Up to ten willing creatures you can see within range gain this ability for the duration.",
    "classes": [
      "cleric",
      "druid",
      "ranger",
      "sorcerer",
      "artificer"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "web",
    "name": "Web",
    "level": 2,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a bit of spiderweb"
    },
    "duration": "Concentration, up to 1 hour",
    "concentration": true,
    "ritual": false,
    "description": "You conjure a mass of thick, sticky webbing at a point of your choice within range. The webs fill a 20-foot cube from that point for the duration. The webs are difficult terrain and lightly obscure their area. Each creature that starts its turn in the webs or that enters them during its turn must make a Dexterity saving throw. On a failed save, the creature is restrained as long as it remains in the webs or until it breaks free.",
    "classes": [
      "sorcerer",
      "wizard",
      "artificer"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "wind-wall",
    "name": "Wind Wall",
    "level": 3,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "120 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a tiny fan and a feather of exotic origin"
    },
    "duration": "Concentration, up to 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "A wall of strong wind rises from the ground at a point you choose within range. You can make the wall up to 50 feet long, 15 feet high, and 1 foot thick. You can shape the wall in any way you choose as long as it makes a continuous path along the ground. The wall lasts for the duration. When the wall appears, each creature within its area must make a Strength saving throw. A creature takes 3d8 bludgeoning damage on a failed save, or half as much damage on a successful one. The strong wind keeps fog, smoke, and other gases at bay. Small or smaller flying creatures or objects can't pass through the wall. Loose, lightweight materials brought into the wall fly upward. Arrows, bolts, and other ordinary projectiles launched at targets behind the wall are deflected upward and automatically miss. (Boulders hurled by giants or siege engines, and similar projectiles, are unaffected.) Creatures in gaseous form can't pass through it.",
    "classes": [
      "druid",
      "ranger"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "wish",
    "name": "Wish",
    "level": 9,
    "school": "Conjuration",
    "castingTime": "1 action",
    "range": "Self",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "Wish is the mightiest spell a mortal creature can cast. By simply speaking aloud, you can alter the very foundations of reality in accord with your desires. The basic use of this spell is to duplicate any other spell of 8th level or lower. You don't need to meet any requirements in that spell, including costly components. The spell simply takes effect. Alternatively, you can create one of several other effects.",
    "classes": [
      "sorcerer",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "witch-bolt",
    "name": "Witch Bolt",
    "level": 1,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "30 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a twig from a tree that has been struck by lightning"
    },
    "duration": "Concentration, 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "A beam of crackling, blue energy lances out toward a creature within range, forming a sustained arc of lightning between you and the target. Make a ranged spell attack against that creature. On a hit, the target takes 1d12 lightning damage, and on each of your turns for the duration, you can use your action to deal 1d12 lightning damage to the target automatically. The spell ends if you use your action to do anything else. The spell also ends if the target is ever outside the spell's range or if it has Cover from you.",
    "classes": [
      "sorcerer",
      "warlock",
      "wizard"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "word-of-radiance",
    "name": "Word of Radiance",
    "level": 0,
    "school": "Evocation",
    "castingTime": "1 action",
    "range": "5 feet",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": true,
      "materialDescription": "a holy symbol"
    },
    "duration": "Instantaneous",
    "concentration": false,
    "ritual": false,
    "description": "You utter a divine word, and burning radiance erupts from you. Each creature of your choice that you can see within range must succeed on a Constitution saving throw or take 1d6 radiant damage.\nThe spell's damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).",
    "classes": [
      "cleric"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "wrathful-smite",
    "name": "Wrathful Smite",
    "level": 1,
    "school": "Evocation",
    "castingTime": "1 bonus",
    "range": "self",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false,
      "materialDescription": ""
    },
    "duration": "Concentration, 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "The next time you hit with a melee weapon attack during this spell's duration, your attack deals an extra 1d6 psychic damage. Additionally, if the target is a creature, it must make a Wisdom saving throw or be frightened of you until the spell ends. As an action, the creature can make a Wisdom check against your spell save DC to steel its resolve and end this spell.",
    "classes": [
      "paladin"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "zephyr-strike",
    "name": "Zephyr Strike",
    "level": 1,
    "school": "Transmutation",
    "castingTime": "1 bonus",
    "range": "self",
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false,
      "materialDescription": ""
    },
    "duration": "Concentration, 1 minute",
    "concentration": true,
    "ritual": false,
    "description": "You move like the wind. Until the spell ends, your movement doesn't provoke opportunity attacks.\nOnce before the spell ends, you can give yourself advantage on one weapon attack roll on your turn. That attack deals an extra 1d8 force damage on a hit. Whether you hit or miss, your walking speed increases by 30 feet until the end of that turn.",
    "classes": [
      "ranger"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  },
  {
    "id": "zone-of-truth",
    "name": "Zone of Truth",
    "level": 2,
    "school": "Enchantment",
    "castingTime": "1 action",
    "range": "60 feet",
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": "10 minutes",
    "concentration": false,
    "ritual": false,
    "description": "You create a magical zone that guards against deception in a 15-foot-radius sphere centered on a point of your choice within range. Until the spell ends, a creature that enters the spell's area for the first time on a turn or starts its turn there must make a Charisma saving throw. On a failed save, a creature can't speak a deliberate lie while in the radius. You know whether each creature succeeds or fails on its saving throw. An affected creature is aware of the spell and can thus avoid answering questions to which it would normally respond with a lie.",
    "classes": [
      "bard",
      "cleric",
      "paladin",
      "illrigger",
      "martyr"
    ],
    "source": "Official",
    "edition": "Both",
    "version": 1
  }
];
