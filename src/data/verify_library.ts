
import { CLASSES, SUBCLASSES } from "./comprehensive-library.ts";

console.log(`CLASSES length: ${CLASSES.length}`);
console.log(`SUBCLASSES length: ${SUBCLASSES.length}`);

// Check if any subclass is in CLASSES
const badClass = CLASSES.find(c => c.name === "Reanimator" || c.id === "reanimator");
if (badClass) {
    console.log("ERROR: Found Reanimator in CLASSES!");
    console.log(JSON.stringify(badClass, null, 2));
} else {
    console.log("Reanimator NOT found in CLASSES.");
}
