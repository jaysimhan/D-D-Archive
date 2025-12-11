import { Spell } from "../types/dnd-types";
import { expandedSpells } from "./expanded-spells";
import { comprehensiveSpellsGen } from "./comprehensive-spells-gen";

// Deduplicate spells by ID
const spellMap = new Map<string, Spell>();

// Add expanded spells first
expandedSpells.forEach(spell => {
    spellMap.set(spell.id, spell);
});

// Add comprehensive/generated spells (overwriting or appending)
// We prioritize comprehensiveSpellsGen if we trust it more, OR expandedSpells.
// Since comprehensiveSpellsGen has TCoE/XGtE recent updates, maybe priority?
// But expandedSpells might have manual polishes.
// Let's stick with: if ID exists, keep existing (expanded), else add.
comprehensiveSpellsGen.forEach(spell => {
    if (!spellMap.has(spell.id)) {
        spellMap.set(spell.id, spell);
    } else {
        // Optional: Update classes if missing in existing but present in new?
        const existing = spellMap.get(spell.id)!;
        if ((!existing.classes || existing.classes.length === 0) && (spell.classes && spell.classes.length > 0)) {
            existing.classes = spell.classes;
        }
    }
});

export const allSpells: Spell[] = Array.from(spellMap.values()).sort((a, b) => a.name.localeCompare(b.name));
