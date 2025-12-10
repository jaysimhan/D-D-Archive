# D&D Omni-Archive - Data Structure Guide

## Overview

This guide explains the complete data structure used in the D&D Omni-Archive, helping you create compatible content for import.

## Core Types

### Source Types
```typescript
type Source = "Official" | "Homebrew" | "Unofficial";
```
- **Official**: SRD or licensed WotC content
- **Homebrew**: Your own creations
- **Unofficial**: Community content, third-party publishers

### Edition Types
```typescript
type Edition = "2014" | "2024" | "Both";
```
- **2014**: Legacy 5th Edition rules
- **2024**: Revised 5th Edition rules
- **Both**: Compatible with both editions

### Ability Scores
```typescript
type AbilityScore = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";
```

## Entity Structures

### Race

```typescript
interface Race {
  id: string;                    // "high-elf"
  name: string;                  // "High Elf"
  description: string;           // Full description
  source: Source;                // "Official" | "Homebrew" | "Unofficial"
  edition: Edition;              // "2014" | "2024" | "Both"
  version: number;               // 1, 2, 3...
  abilityScoreIncrease: {        // Ability score bonuses
    STR?: number;
    DEX?: number;
    CON?: number;
    INT?: number;
    WIS?: number;
    CHA?: number;
  };
  size: "Tiny" | "Small" | "Medium" | "Large";
  speed: number;                 // Movement speed in feet
  traits: string[];              // ["Darkvision", "Fey Ancestry"]
  languages: string[];           // ["Common", "Elvish"]
  subraces?: string[];           // IDs of subraces (optional)
}
```

**Example:**
```json
{
  "id": "dwarf",
  "name": "Dwarf",
  "description": "Bold and hardy, dwarves are known as skilled warriors...",
  "source": "Official",
  "edition": "Both",
  "version": 1,
  "abilityScoreIncrease": {
    "CON": 2
  },
  "size": "Medium",
  "speed": 25,
  "traits": ["Darkvision", "Dwarven Resilience", "Stonecunning"],
  "languages": ["Common", "Dwarvish"],
  "subraces": ["hill-dwarf", "mountain-dwarf"]
}
```

### Subrace

```typescript
interface Subrace {
  id: string;
  parentRaceId: string;          // ID of parent race
  name: string;
  description: string;
  source: Source;
  edition: Edition;
  version: number;
  abilityScoreIncrease: {
    [key in AbilityScore]?: number;
  };
  traits: string[];
}
```

### Class

```typescript
interface Class {
  id: string;
  name: string;
  description: string;
  source: Source;
  edition: Edition;
  version: number;
  hitDie: 4 | 6 | 8 | 10 | 12;   // Hit die size
  primaryAbility: AbilityScore[]; // ["INT"] or ["STR", "DEX"]
  savingThrows: AbilityScore[];  // Exactly 2
  spellcaster?: "full" | "half" | "third";
  spellcastingAbility?: AbilityScore;
  features: ClassFeature[];
  subclasses: string[];          // IDs of subclasses
}

interface ClassFeature {
  level: number;                 // 1-20
  name: string;
  description: string;
}
```

**Example:**
```json
{
  "id": "wizard",
  "name": "Wizard",
  "description": "Wizards are supreme magic-users...",
  "source": "Official",
  "edition": "Both",
  "version": 1,
  "hitDie": 6,
  "primaryAbility": ["INT"],
  "savingThrows": ["INT", "WIS"],
  "spellcaster": "full",
  "spellcastingAbility": "INT",
  "features": [
    {
      "level": 1,
      "name": "Spellcasting",
      "description": "You can cast wizard spells..."
    }
  ],
  "subclasses": ["school-of-evocation", "school-of-abjuration"]
}
```

### Spell

```typescript
interface Spell {
  id: string;
  name: string;
  level: number;                 // 0-9 (0 = cantrip)
  school: "Abjuration" | "Conjuration" | "Divination" | 
          "Enchantment" | "Evocation" | "Illusion" | 
          "Necromancy" | "Transmutation";
  castingTime: string;           // "1 action", "1 bonus action"
  range: string;                 // "60 feet", "Touch", "Self"
  components: {
    verbal: boolean;
    somatic: boolean;
    material: boolean;
    materialDescription?: string;
  };
  duration: string;              // "Instantaneous", "1 hour"
  concentration: boolean;
  ritual: boolean;
  description: string;
  higherLevels?: string;         // Effect when cast at higher levels
  classes: string[];             // Class IDs that can cast
  source: Source;
  edition: Edition;
  version: number;
}
```

**Example:**
```json
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
  "description": "A bright streak flashes from your pointing finger...",
  "higherLevels": "When you cast this spell using a spell slot of 4th level or higher...",
  "classes": ["wizard", "sorcerer"],
  "source": "Official",
  "edition": "Both",
  "version": 1
}
```

### Item

```typescript
interface Item {
  id: string;
  name: string;
  type: "Weapon" | "Armor" | "Potion" | "Scroll" | 
        "Wondrous Item" | "Ring" | "Rod" | "Staff" | 
        "Wand" | "Adventuring Gear";
  description: string;
  magical: boolean;
  rarity?: "Common" | "Uncommon" | "Rare" | 
           "Very Rare" | "Legendary" | "Artifact";
  requiresAttunement: boolean;
  cost?: {
    amount: number;
    currency: "cp" | "sp" | "ep" | "gp" | "pp";
  };
  weight?: number;               // In pounds
  properties?: string[];         // ["Versatile", "Finesse"]
  source: Source;
  edition: Edition;
  version: number;
}
```

**Example:**
```json
{
  "id": "longsword-+1",
  "name": "Longsword +1",
  "type": "Weapon",
  "description": "You have a +1 bonus to attack and damage rolls...",
  "magical": true,
  "rarity": "Uncommon",
  "requiresAttunement": false,
  "cost": {
    "amount": 500,
    "currency": "gp"
  },
  "weight": 3,
  "properties": ["Versatile"],
  "source": "Official",
  "edition": "Both",
  "version": 1
}
```

### Feat

```typescript
interface Feat {
  id: string;
  name: string;
  description: string;
  source: Source;
  edition: Edition;
  version: number;
  prerequisites?: {
    level?: number;
    abilityScore?: {
      [key in AbilityScore]?: number;
    };
    race?: string[];             // Race IDs
    class?: string[];            // Class IDs
  };
  benefits: {
    abilityScoreIncrease?: {
      [key in AbilityScore]?: number;
    };
    spells?: string[];           // Spell IDs granted
    features?: string[];         // Text descriptions
  };
}
```

**Example:**
```json
{
  "id": "war-caster",
  "name": "War Caster",
  "description": "You have practiced casting spells in the midst of combat...",
  "source": "Official",
  "edition": "Both",
  "version": 1,
  "prerequisites": {
    "class": ["wizard", "sorcerer", "cleric", "warlock"]
  },
  "benefits": {
    "features": [
      "Advantage on Constitution saves for concentration",
      "Can perform somatic components with weapons/shield",
      "Can cast spells as opportunity attacks"
    ]
  }
}
```

### Background

```typescript
interface Background {
  id: string;
  name: string;
  description: string;
  source: Source;
  edition: Edition;
  version: number;
  skillProficiencies: string[];  // Exactly 2
  toolProficiencies: string[];
  languages: number;             // Number of extra languages
  equipment: string[];
  feature: {
    name: string;
    description: string;
  };
}
```

**Example:**
```json
{
  "id": "soldier",
  "name": "Soldier",
  "description": "War has been your life for as long as you care to remember...",
  "source": "Official",
  "edition": "Both",
  "version": 1,
  "skillProficiencies": ["Athletics", "Intimidation"],
  "toolProficiencies": ["One type of gaming set", "Vehicles (land)"],
  "languages": 0,
  "equipment": ["Insignia of rank", "Trophy from fallen enemy"],
  "feature": {
    "name": "Military Rank",
    "description": "You have a military rank from your career..."
  }
}
```

### Monster

```typescript
interface Monster {
  id: string;
  name: string;
  size: "Tiny" | "Small" | "Medium" | "Large" | "Huge" | "Gargantuan";
  type: "Aberration" | "Beast" | "Celestial" | "Construct" | 
        "Dragon" | "Elemental" | "Fey" | "Fiend" | "Giant" | 
        "Humanoid" | "Monstrosity" | "Ooze" | "Plant" | "Undead";
  alignment: "LG" | "NG" | "CG" | "LN" | "N" | "CN" | 
             "LE" | "NE" | "CE" | "Unaligned";
  armorClass: number;
  hitPoints: number;
  hitDice: string;               // "2d6 + 4"
  speed: {
    walk?: number;
    fly?: number;
    swim?: number;
    burrow?: number;
    climb?: number;
  };
  abilityScores: {
    STR: number;
    DEX: number;
    CON: number;
    INT: number;
    WIS: number;
    CHA: number;
  };
  savingThrows?: {
    [key in AbilityScore]?: number;
  };
  skills?: { [key: string]: number };
  damageResistances?: string[];
  damageImmunities?: string[];
  conditionImmunities?: string[];
  senses?: { [key: string]: number };
  languages?: string[];
  challengeRating: number;       // 0.125, 0.25, 0.5, 1-30
  experiencePoints: number;
  traits?: { name: string; description: string }[];
  actions?: { name: string; description: string }[];
  reactions?: { name: string; description: string }[];
  legendaryActions?: { name: string; description: string }[];
  source: Source;
  edition: Edition;
  version: number;
}
```

## Import File Formats

### JSON Format

Arrays of entities:
```json
[
  {
    "id": "entity-1",
    "name": "Entity 1",
    ...
  },
  {
    "id": "entity-2",
    "name": "Entity 2",
    ...
  }
]
```

### CSV Format

Headers in first row, data in subsequent rows:
```csv
id,name,description,source,edition,version,size,speed,traits,languages
dwarf,Dwarf,"Bold and hardy...",Official,Both,1,Medium,25,"[""Darkvision""]","[""Common"",""Dwarvish""]"
```

**CSV Notes:**
- Arrays: Use JSON format in quotes: `"[""item1"",""item2""]"`
- Objects: Use JSON format in quotes: `"{""key"":""value""}"`
- Strings with commas: Wrap in quotes
- Escape quotes: Double them (`""`)

## Validation Rules

### Universal Rules
1. **ID**: Required, lowercase, hyphen-separated, unique
2. **Name**: Required, display-friendly
3. **Description**: Required, at least 50 characters recommended
4. **Source**: Must be Official, Homebrew, or Unofficial
5. **Edition**: Must be 2014, 2024, or Both
6. **Version**: Must be positive integer

### Entity-Specific Rules

**Races:**
- Speed must be positive number
- Size must be valid
- At least one language recommended
- At least one trait recommended

**Spells:**
- Level must be 0-9
- School must be valid
- Classes array should not be empty
- Components properly specified

**Items:**
- Type must be valid
- Magical items should have rarity
- Non-magical items should have cost
- Attunement only for magical items

**Classes:**
- Hit die must be 4, 6, 8, 10, or 12
- Exactly 2 saving throws
- Spellcasters need spellcasting ability
- Features for levels 1-20 recommended

**Backgrounds:**
- Exactly 2 skill proficiencies
- Feature with name and description required
- Equipment list recommended

## Best Practices

### Naming Conventions
- **IDs**: `ancient-red-dragon`, `fireball`, `longsword-+1`
- **Names**: "Ancient Red Dragon", "Fireball", "Longsword +1"

### Descriptions
- Be thorough but concise
- Follow official style when possible
- Include mechanical effects
- Note any exceptions or edge cases

### Version Control
- Start at version 1
- Increment for any changes
- Document changes in metadata
- Keep backwards compatibility when possible

### Homebrew Content
- Mark clearly as Homebrew
- Add creator information
- Tag appropriately
- Include balance notes
- Document playtesting

### Organization
- Group related content
- Use consistent naming
- Tag for easy searching
- Export regularly for backups

## Examples Repository

See the `/data/` folder for complete examples:

- **Races**: `/data/comprehensive-library.ts`
- **Classes**: `/data/mock-classes.ts`
- **Spells**: `/data/expanded-spells.ts`
- **Items**: `/data/expanded-items.ts`
- **Monsters**: `/data/monsters.ts`
- **Feats**: `/data/expanded-feats.ts`
- **Backgrounds**: `/data/mock-backgrounds.ts`

## Tools & Utilities

### Validation
```typescript
import { validateRace, validateSpell } from './utils/data-validation';

const result = validateRace(myRace);
if (!result.valid) {
  console.error(result.errors);
}
```

### Import/Export
```typescript
import { exportEntityToJSON, importFromJSON } from './utils/data-import-export';

// Export
exportEntityToJSON('races', myRaces);

// Import
const races = await importFromJSON(file);
```

## Schema Validation

All entities are TypeScript typed for compile-time validation. Runtime validation is performed on import through the validation utilities.

For complete type definitions, see `/types/dnd-types.ts`.

---

**Need Help?** Check `ADMIN_GUIDE.md` for usage instructions or the source code for implementation details.
