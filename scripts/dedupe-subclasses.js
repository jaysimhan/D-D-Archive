const fs = require('fs');
const content = fs.readFileSync('src/data/subclasses.ts', 'utf8');

// Extract array content from the file
const match = content.match(/export const SUBCLASSES: Subclass\[\] = \[([\s\S]*)\];/);
if (!match) {
    console.error('Could not find SUBCLASSES array');
    process.exit(1);
}

const arrayContent = match[1];

// Find each object by matching opening brace to its level
const subclasses = [];
let depth = 0;
let start = -1;
for (let i = 0; i < arrayContent.length; i++) {
    const char = arrayContent[i];
    if (char === '{') {
        if (depth === 0) start = i;
        depth++;
    } else if (char === '}') {
        depth--;
        if (depth === 0 && start !== -1) {
            const objStr = arrayContent.slice(start, i + 1);
            // Extract id using regex
            const idMatch = objStr.match(/["']?id["']?:\s*["']([^"']+)["']/);
            if (idMatch) {
                subclasses.push({
                    id: idMatch[1],
                    str: objStr,
                    hasMagicType: objStr.includes('magicType'),
                    hasDetailedFeatures: !objStr.includes('You gain a feature specific to this subclass')
                });
            }
            start = -1;
        }
    }
}

// Find duplicates - prefer entries with magicType or detailed features
const seen = new Map();
const removed = [];

for (const sub of subclasses) {
    if (seen.has(sub.id)) {
        const existing = seen.get(sub.id);
        // Prefer entry with magicType OR detailed features
        if ((sub.hasMagicType && !existing.hasMagicType) ||
            (sub.hasDetailedFeatures && !existing.hasDetailedFeatures)) {
            removed.push({ id: existing.id, reason: 'replaced by better version' });
            seen.set(sub.id, sub);
        } else {
            removed.push({ id: sub.id, reason: 'duplicate, keeping earlier version' });
        }
    } else {
        seen.set(sub.id, sub);
    }
}

// Reconstruct the file
const uniqueSubclasses = Array.from(seen.values()).map(s => s.str).join(',\n');
const newContent = content.replace(
    /export const SUBCLASSES: Subclass\[\] = \[([\s\S]*)\];/,
    `export const SUBCLASSES: Subclass[] = [\n${uniqueSubclasses}\n];`
);

// Write back
fs.writeFileSync('src/data/subclasses.ts', newContent);

console.log('Total subclasses found:', subclasses.length);
console.log('Duplicates removed:', removed.length);
console.log('Unique kept:', seen.size);
console.log('Sample removed:', removed.slice(0, 10).map(r => r.id).join(', '));
