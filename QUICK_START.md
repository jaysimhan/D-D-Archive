# D&D Omni-Archive - Quick Start Guide

## Getting Started in 5 Minutes

### 1. Access Admin Panel
1. Launch the application
2. Click "Manage Content" on home page, or
3. Click "Admin" in the navigation bar

### 2. Browse Existing Content
- Click tabs to view: Races, Classes, Spells, Items, Feats, Backgrounds, Monsters
- Current content is mock/example data
- Ready to be replaced with your own!

### 3. Create Your First Entry

**Example: Adding a Homebrew Race**

1. Go to Admin Panel → Races tab
2. Click "Create New" button
3. Fill in the form:
   ```
   Name: Catfolk
   Description: Agile feline humanoids with keen senses
   Source: Homebrew
   Edition: Both
   Size: Medium
   Speed: 35
   Traits: Darkvision, Feline Agility, Cat's Claws
   Languages: Common, Catfolk
   ```
4. Click "Create"
5. Done! Your race is added

### 4. Import Bulk Data

**Option A: JSON Import**
1. Prepare JSON file:
   ```json
   [
     {
       "id": "my-custom-race",
       "name": "My Custom Race",
       "description": "Description here",
       "source": "Homebrew",
       "edition": "Both",
       "version": 1,
       "size": "Medium",
       "speed": 30,
       "traits": ["Trait 1"],
       "languages": ["Common"]
     }
   ]
   ```
2. Admin Panel → Click "Import JSON"
3. Select your file
4. System validates and imports

**Option B: CSV Import**
1. Admin Panel → Select entity type
2. Click dropdown next to "Import JSON"
3. Download CSV template
4. Open in Excel/Google Sheets
5. Fill in your data
6. Save and import

### 5. Export for Backup
1. Go to any entity tab
2. Click "Export JSON"
3. File downloads: `dnd-races-2025-12-09.json`
4. Save this file as backup!

## Common Tasks

### Add a Homebrew Spell
```typescript
Admin Panel → Spells Tab → Create New

Name: Shadow Bolt
Level: 2
School: Evocation
Casting Time: 1 action
Range: 60 feet
Duration: Instantaneous
Components: V, S
Concentration: No
Ritual: No
Description: You hurl a bolt of shadow energy...
Classes: Warlock, Wizard
Source: Homebrew
Edition: Both
```

### Import Multiple Items
1. Create CSV file with items:
   ```csv
   id,name,type,description,magical,rarity,source,edition
   magic-sword,Magic Sword,Weapon,A glowing sword,true,Rare,Homebrew,Both
   healing-ring,Healing Ring,Ring,Restores health,true,Uncommon,Homebrew,Both
   ```
2. Import through admin panel
3. Review validation results

### Share Your Homebrew
1. Create your content in admin panel
2. Export to JSON
3. Share file with friends
4. They import into their archive
5. Everyone has same content!

## Important Validation Rules

### Every Entity Needs:
- ✅ Unique ID (lowercase-with-hyphens)
- ✅ Name (display name)
- ✅ Description (detailed)
- ✅ Source (Official/Homebrew/Unofficial)
- ✅ Edition (2014/2024/Both)
- ✅ Version (start with 1)

### Common Mistakes:
- ❌ IDs with spaces: "my race" → ✅ "my-race"
- ❌ Invalid source: "Custom" → ✅ "Homebrew"
- ❌ Wrong edition: "5e" → ✅ "Both"
- ❌ Missing description → ✅ Add detailed description
- ❌ Empty arrays for important fields → ✅ Fill in data

## Where to Get Legal Content

### ✅ Safe Sources:
1. **Official SRD** - https://dnd.wizards.com/resources/systems-reference-document
   - Free to use under OGL
   - Basic classes, races, spells
   - Foundation content

2. **Your Creations**
   - Homebrew content you design
   - Campaign-specific content
   - Your intellectual property

3. **Community Homebrew** (with permission)
   - D&D Wiki community creations
   - Homebrew subreddits
   - Creator-shared content
   - Always credit creators!

### ❌ Don't Use:
- D&D Beyond database (proprietary)
- Non-SRD official books (copyrighted)
- Scraped website data
- Paid content without license

## File Naming Best Practice

```
# Entity IDs (in your data):
ancient-red-dragon
fireball
longsword-+1
school-of-evocation
protector-aasimar

# Export Filenames (automatic):
dnd-races-2025-12-09.json
dnd-spells-2025-12-09.csv
dnd-monsters-2025-12-09.json
```

## Tips & Tricks

### Organize Your Content
1. Use consistent ID prefixes:
   - `homebrew-race-catfolk`
   - `campaign-spell-shadow-bolt`
   - `custom-item-sword-of-legends`

2. Tag liberally:
   - `["balanced", "playtested", "approved"]`
   - `["combat-heavy", "spellcaster"]`
   - `["beginner-friendly"]`

3. Version carefully:
   - Start at version 1
   - Increment for changes
   - Keep old versions as backup

### Backup Strategy
1. Export all content weekly
2. Name with dates: `backup-2025-12-09.json`
3. Store in cloud drive
4. Keep multiple versions

### Sharing Strategy
1. Export specific content
2. Include README with attribution
3. Note balance considerations
4. Include playtesting feedback
5. Request community input

## Quick Reference: Entity Types

| Type | Key Fields | Example ID |
|------|------------|------------|
| Race | Size, Speed, Traits | `hill-dwarf` |
| Class | Hit Die, Spellcaster | `wizard` |
| Spell | Level, School, Classes | `fireball` |
| Item | Type, Rarity, Magical | `bag-of-holding` |
| Feat | Prerequisites, Benefits | `war-caster` |
| Background | Skills, Feature | `soldier` |
| Monster | CR, Stats, Actions | `ancient-dragon` |

## Troubleshooting

### "Import Failed"
- Check file format (JSON or CSV)
- Validate JSON syntax online
- Ensure arrays use proper format
- Check for required fields

### "Validation Error"
- Read error message carefully
- Check field types (number vs string)
- Ensure enums are correct values
- Review entity-specific requirements

### "Can't Find My Content"
- Check current tab
- Use search/filter (when added)
- Verify import succeeded
- Check console for errors

### "Lost My Data"
- Data is in browser state only
- Refreshing page clears data
- **Always export for backup!**
- Backend will add persistence

## Next Steps

1. **Explore Examples** - Check `/data/` folder for properly formatted examples
2. **Read Full Guides** - See `ADMIN_GUIDE.md` and `DATA_STRUCTURE_GUIDE.md`
3. **Start Creating** - Add your first homebrew content
4. **Share & Enjoy** - Export and share with your group

## Need Help?

### Documentation
- `ADMIN_GUIDE.md` - Complete admin guide
- `DATA_STRUCTURE_GUIDE.md` - All data formats
- `IMPLEMENTATION_SUMMARY.md` - Technical details

### Code References
- `/types/dnd-types.ts` - TypeScript definitions
- `/data/*.ts` - Example data files
- `/utils/data-validation.ts` - Validation rules

---

**You're ready to start managing your D&D content!**

Just remember:
1. 🎯 Create or import content
2. 💾 Export regularly for backup
3. ⚖️ Stay legal (SRD + Homebrew only)
4. 🎲 Have fun with your campaigns!
