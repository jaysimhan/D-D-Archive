import { species } from "./src/data/mock-races.ts";
import { extraRaces } from "./src/data/extra-races.ts";
import { expandedRaces } from "./src/data/expanded-races.ts";
import { expandedSpells } from "./src/data/expanded-spells.ts";

console.log("Verifying Race Data...");

// Combine all race sources
// Note: species is Race[], extraRaces is Race[], expandedRaces is (Race | Subrace)[]
const RACES = [...species, ...extraRaces, ...expandedRaces];

const racesToCheck = [
    "triton-2", // Triton
    "drow",
    "duergar",
    "tiefling",
    "tiefling-asmodeus",
    "tiefling-zariel" // Spot check one variant
];

racesToCheck.forEach(id => {
    const race = RACES.find(r => r.id === id);
    if (!race) {
        console.error(`ERROR: Race ${id} not found!`);
        return;
    }

    console.log(`\nFound ${race.name} (${race.id})`);

    if (race.subraces && race.subraces.length > 0) {
        console.log(`  - Has subraces: ${race.subraces.join(", ")}`);
    }

    if (race.racialKnownSpells) {
        console.log(`  - Has ${race.racialKnownSpells.length} known spells:`);
        race.racialKnownSpells.forEach(s => {
            const spell = expandedSpells.find(es => es.id === s.spellId);
            if (!spell) console.error(`    ERROR: Spell ${s.spellId} not found in library!`);
            else console.log(`    - Verified spell: ${spell.name} (Level ${s.level})`);
        });
    } else {
        console.log(`  - No racialKnownSpells`);
    }
});

console.log("\nVerification checks complete.");
