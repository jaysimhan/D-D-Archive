import { expandedSpells } from "./src/data/expanded-spells.ts";

const getRacialOptions = (list: string[]) => {
    return expandedSpells.filter(spell => {
        // Check if ID is in list
        if (list.includes(spell.id)) return true;

        // Check "cantrip:class" format
        for (const item of list) {
            if (item.startsWith("cantrip:")) {
                const className = item.split(":")[1];
                if (spell.level === 0 && spell.classes.includes(className)) return true;
            }
            if (item.startsWith("any:")) {
                const className = item.split(":")[1];
                // Assuming cantrip if not specified, matching logic in component
                if (spell.classes.includes(className)) return true;
            }
        }
        return false;
    });
};

console.log("Testing generic racial spell selection...");
const koboldList = ["cantrip:sorcerer"];
const options = getRacialOptions(koboldList);

console.log(`Found ${options.length} options for 'cantrip:sorcerer'`);
if (options.length > 0) {
    console.log("First 5 options:");
    options.slice(0, 5).forEach(s => console.log(`- ${s.name} (${s.id})`));
} else {
    console.error("ERROR: No options found!");
}

const highElfList = ["cantrip:wizard"];
const elfOptions = getRacialOptions(highElfList);
console.log(`\nFound ${elfOptions.length} options for 'cantrip:wizard'`);

const specificList = ["burning-hands"];
const specificOptions = getRacialOptions(specificList);
console.log(`\nFound ${specificOptions.length} options for 'burning-hands'`);
if (specificOptions.length > 0 && specificOptions[0].id === 'burning-hands') {
    console.log("Verified specific spell selection works.");
} else {
    console.error("ERROR: Specific spell selection failed.");
}
