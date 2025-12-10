# D&D Omni-Archive - Admin Panel Guide

## Overview

The Admin Panel is your comprehensive content management system for the D&D Omni-Archive. Use it to add, edit, import, and export all types of D&D content including races, classes, spells, items, feats, backgrounds, and monsters.

## Features

### 1. Content Management Interface
- **Create**: Add new content entries through intuitive forms
- **Edit**: Modify existing content with full field validation
- **Delete**: Remove unwanted entries (with confirmation)
- **View**: Browse all content in organized tables

### 2. Import Tools

#### JSON Import
Import structured data in JSON format:

```json
[
  {
    "id": "example-race",
    "name": "Example Race",
    "description": "Description here",
    "source": "Homebrew",
    "edition": "Both",
    "version": 1,
    "size": "Medium",
    "speed": 30,
    "traits": ["Trait 1", "Trait 2"],
    "languages": ["Common"]
  }
]
```

**Steps:**
1. Click "Import JSON" button
2. Select your JSON file
3. System validates all entries
4. Valid entries are imported, invalid ones are reported

#### CSV Import
Import bulk data from spreadsheets:

**Steps:**
1. Download CSV template for your entity type
2. Fill in the template with your data
3. Click "Import JSON" and select your CSV file
4. System parses and validates entries

**CSV Tips:**
- Keep one header row
- Use quotes for fields containing commas
- Arrays should be in JSON format: `["item1","item2"]`
- Objects should be in JSON format: `{"key":"value"}`

### 3. Export Tools

#### JSON Export
- Click "Export JSON" to download current data
- File format: `dnd-{type}-{date}.json`
- Perfect for backups and sharing

#### CSV Export
- Export data to spreadsheet format
- File format: `dnd-{type}-{date}.csv`
- Great for bulk editing in Excel/Google Sheets

### 4. Data Validation System

The system automatically validates all content:

#### Required Fields
- **ID**: Unique identifier (lowercase, hyphen-separated)
- **Name**: Display name
- **Description**: Detailed description
- **Source**: Official, Homebrew, or Unofficial
- **Edition**: 2014, 2024, or Both
- **Version**: Version number (1, 2, 3...)

#### Entity-Specific Validation

**Races:**
- Size: Tiny, Small, Medium, or Large
- Speed: Number (feet per turn)
- Ability Score Increases
- Traits and languages

**Spells:**
- Level: 0-9 (0 = cantrip)
- School: Valid spell school
- Components: Verbal, Somatic, Material
- Duration, Range, Casting Time
- Class availability

**Items:**
- Type: Weapon, Armor, Potion, etc.
- Rarity: Common through Artifact (for magical items)
- Cost and weight
- Magical properties

**Classes:**
- Hit Die: 4, 6, 8, 10, or 12
- Primary Abilities
- Saving Throws (exactly 2)
- Spellcasting info (if applicable)

**Feats:**
- Prerequisites (if any)
- Benefits and features

**Backgrounds:**
- Skill Proficiencies (exactly 2)
- Tool Proficiencies
- Starting Equipment
- Background Feature

### 5. Homebrew Content

#### Creating Homebrew
1. Set Source to "Homebrew"
2. Fill in all required fields
3. Add creator information
4. Tag appropriately

#### Homebrew Metadata
- Creator name
- Creation date
- Custom tags for organization
- Balance rating (optional)
- Playtest status
- Community feedback

#### Best Practices
- Use clear, descriptive IDs
- Write comprehensive descriptions
- Follow official content structure
- Include balance considerations
- Test in actual gameplay
- Document changes between versions

### 6. Version Control

Every entity tracks:
- Current version number
- Last updated date
- Change history
- Previous versions (when available)

**Incrementing Versions:**
1. Edit existing content
2. System auto-increments version
3. Saves snapshot of previous version
4. Records changes made

### 7. SRD Content Import

#### What is SRD?
The System Reference Document (SRD) is official D&D content released under the Open Game License by Wizards of the Coast.

#### Importing SRD Content
1. Download SRD JSON from official sources
2. Use "Import JSON" feature
3. System validates against SRD schema
4. Mark as "Official" source

#### Legal Notes
- ✅ SRD content is freely usable
- ❌ Non-SRD official content requires licensing
- ❌ Do not copy from D&D Beyond or other proprietary sources
- ✅ Homebrew content is your own creation

### 8. Data Organization

#### ID Naming Convention
```
entity-type-name
wizard
fireball
longsword-+1
ancient-red-dragon
```

**Rules:**
- All lowercase
- Use hyphens, not spaces
- Be descriptive but concise
- Must be unique

#### Tagging System
Tag your homebrew content for easy filtering:
- `balanced`, `untested`, `overpowered`, `underpowered`
- `combat`, `exploration`, `social`
- `beginner-friendly`, `advanced`
- Campaign-specific tags

### 9. Bulk Operations

#### Batch Import
1. Prepare multiple entries in JSON/CSV
2. Import entire file at once
3. Review validation report
4. Fix any errors
5. Re-import if needed

#### Batch Export
- Export all content of one type
- Use for backups
- Share with community
- Transfer between instances

### 10. Common Workflows

#### Adding a New Race
1. Click "Create New"
2. Fill in basic info (name, description, source, edition)
3. Set size and speed
4. Add ability score increases
5. List racial traits
6. Specify languages
7. Add subraces (if any)
8. Save and validate

#### Creating a Spell Collection
1. Download spell template CSV
2. Fill spreadsheet with spell data
3. Import CSV file
4. Review validation results
5. Fix any errors
6. Export final JSON for backup

#### Managing Homebrew Campaigns
1. Tag all homebrew content with campaign name
2. Export campaign-specific content
3. Share JSON with players
4. Players import to their archives
5. Update and re-export as needed

## Troubleshooting

### Import Fails
- Check file format (JSON or CSV)
- Validate JSON syntax
- Ensure all required fields present
- Check data types match schema

### Validation Errors
- Read error messages carefully
- Check field requirements
- Review examples in templates
- Ensure IDs are unique

### Export Issues
- Check browser download settings
- Ensure sufficient content exists
- Try different format (JSON vs CSV)

## Security Notes

- Admin panel is client-side only
- All data stored in browser state
- No server-side persistence yet
- Use export feature for backups
- Data lost on page refresh (until backend added)

## Future Enhancements

When backend is added:
- Persistent database storage
- User authentication
- Content approval workflows
- Community ratings and reviews
- Automated balance checking
- Integration with character creator
- Real-time collaboration

## Support Resources

### Templates
Download CSV templates from Admin Panel for each entity type.

### Validation Reference
See `/utils/data-validation.ts` for complete validation rules.

### Example Data
Check `/data/` folder for properly formatted examples:
- `/data/comprehensive-library.ts` - Races, backgrounds, feats
- `/data/expanded-spells.ts` - Spell examples
- `/data/expanded-items.ts` - Item examples
- `/data/monsters.ts` - Monster examples

### Data Types
See `/types/dnd-types.ts` for complete TypeScript interfaces.

## Legal Compliance

### ✅ You CAN:
- Create original homebrew content
- Use SRD content (Open Game License)
- Share your own creations
- Import community homebrew (with permission)

### ❌ You CANNOT:
- Copy non-SRD content from D&D Beyond
- Scrape proprietary databases
- Redistribute copyrighted material
- Use without respecting OGL terms

### Recommended Sources:
- Official SRD: https://dnd.wizards.com/resources/systems-reference-document
- Open Game License content
- Your own creative work
- Community content with proper attribution

---

**Remember:** This archive is a tool for organizing YOUR content legally. Always respect copyright and licensing terms.
