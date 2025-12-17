/**
 * Migration script to add racial spells to existing races using the 'spells' field.
 * formatting matches the 'spellGrant' object in the schema.
 * 
 * Usage: npx sanity exec migrations/migrate-racial-spells.ts --with-user-token
 */

import { createClient } from '@sanity/client';

const client = createClient({
    projectId: 'ylk0tk34',
    dataset: 'production',
    useCdn: false,
    token: process.env.SANITY_AUTH_TOKEN,
    apiVersion: '2024-01-01',
});

// Helper to sanitize IDs
function toSanityId(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

interface SpellGrant {
    _key: string;
    _type: 'spellGrant';
    level: number; // Character level requirement
    mode: 'fixed' | 'choice' | 'access';
    count?: number; // For choice mode
    spellList?: string; // For choice/access mode (e.g. 'Wizard')
    specificSpells?: { _type: 'reference'; _ref: string; _key: string }[]; // For fixed/choice mode
    ability?: 'INT' | 'WIS' | 'CHA' | 'CON';
    recharge?: 'at-will' | 'short-rest' | 'long-rest' | 'day';
    spellLevel?: number; // 0 for cantrip, etc.
    notes?: string;
    name?: string;
}

// Data Definition
// Note: spellId maps to the slug of the spell (we will lookup _id)
const RACE_SPELLS: Record<string, Array<{
    charLevel: number;
    spellId?: string; // slug
    mode: 'fixed' | 'choice';
    recharge?: 'at-will' | 'day' | 'unlimited';
    ability?: 'CHA' | 'INT' | 'CON' | 'WIS';
    notes?: string;
    spellList?: string;
    count?: number;
    spellLevel?: number; // 0=cantrip
}>> = {
    'fairy': [
        { charLevel: 1, spellId: 'druidcraft', mode: 'fixed', recharge: 'at-will', ability: 'CHA' },
        { charLevel: 3, spellId: 'faerie-fire', mode: 'fixed', recharge: 'day', ability: 'CHA' },
        { charLevel: 5, spellId: 'enlarge-reduce', mode: 'fixed', recharge: 'day', ability: 'CHA' },
    ],
    'firbolg': [
        { charLevel: 1, spellId: 'detect-magic', mode: 'fixed', recharge: 'day', ability: 'WIS' }, // Defaulting WIS, typical for Firbolg
        { charLevel: 1, spellId: 'disguise-self', mode: 'fixed', recharge: 'day', ability: 'WIS' },
    ],
    'forest-gnome': [
        { charLevel: 1, spellId: 'minor-illusion', mode: 'fixed', recharge: 'at-will', ability: 'INT' },
    ],
    'genasi-air': [
        { charLevel: 1, spellId: 'shocking-grasp', mode: 'fixed', recharge: 'at-will', ability: 'CON' },
        { charLevel: 3, spellId: 'feather-fall', mode: 'fixed', recharge: 'day', ability: 'CON' },
        { charLevel: 5, spellId: 'levitate', mode: 'fixed', recharge: 'day', ability: 'CON' },
    ],
    'genasi-earth': [
        { charLevel: 1, spellId: 'blade-ward', mode: 'fixed', recharge: 'at-will', ability: 'CON' },
        { charLevel: 5, spellId: 'pass-without-trace', mode: 'fixed', recharge: 'day', ability: 'CON' },
    ],
    'genasi-fire': [
        { charLevel: 1, spellId: 'produce-flame', mode: 'fixed', recharge: 'at-will', ability: 'CON' },
        { charLevel: 3, spellId: 'burning-hands', mode: 'fixed', recharge: 'day', ability: 'CON' },
        { charLevel: 5, spellId: 'flame-blade', mode: 'fixed', recharge: 'day', ability: 'CON' },
    ],
    'genasi-water': [
        { charLevel: 1, spellId: 'acid-splash', mode: 'fixed', recharge: 'at-will', ability: 'CON' },
        { charLevel: 3, spellId: 'create-or-destroy-water', mode: 'fixed', recharge: 'day', ability: 'CON' },
        { charLevel: 5, spellId: 'water-walk', mode: 'fixed', recharge: 'day', ability: 'CON' },
    ],
    'githyanki': [
        { charLevel: 1, spellId: 'mage-hand', mode: 'fixed', recharge: 'at-will', ability: 'INT', notes: 'Invisible hand' },
        { charLevel: 3, spellId: 'jump', mode: 'fixed', recharge: 'day', ability: 'INT' },
        { charLevel: 5, spellId: 'misty-step', mode: 'fixed', recharge: 'day', ability: 'INT' },
    ],
    'githzerai': [
        { charLevel: 1, spellId: 'mage-hand', mode: 'fixed', recharge: 'at-will', ability: 'WIS', notes: 'Invisible hand' },
        { charLevel: 3, spellId: 'shield', mode: 'fixed', recharge: 'day', ability: 'WIS' },
        { charLevel: 5, spellId: 'detect-thoughts', mode: 'fixed', recharge: 'day', ability: 'WIS' },
    ],
    'half-elf-high-variant': [
        { charLevel: 1, mode: 'choice', spellList: 'Wizard', spellLevel: 0, count: 1, notes: 'Choice of one Wizard Cantrip', ability: 'INT' },
    ],
    'hexblood': [
        { charLevel: 1, spellId: 'disguise-self', mode: 'fixed', recharge: 'day', ability: 'INT' }, // Often choice, check if flexible
        { charLevel: 1, spellId: 'hex', mode: 'fixed', recharge: 'day', ability: 'INT' },
    ],
    'high-elf': [
        { charLevel: 1, mode: 'choice', spellList: 'Wizard', spellLevel: 0, count: 1, notes: 'Choice of one Wizard Cantrip', ability: 'INT' },
    ],
    'kobold': [
        { charLevel: 1, mode: 'choice', spellList: 'Sorcerer', spellLevel: 0, count: 1, notes: 'Choice of one Sorcerer Cantrip', ability: 'CHA' },
    ],
    'tiefling': [
        { charLevel: 1, spellId: 'thaumaturgy', mode: 'fixed', recharge: 'at-will', ability: 'CHA' },
        { charLevel: 3, spellId: 'hellish-rebuke', mode: 'fixed', recharge: 'day', ability: 'CHA' },
        { charLevel: 5, spellId: 'darkness', mode: 'fixed', recharge: 'day', ability: 'CHA' },
    ],
    'triton': [
        { charLevel: 1, spellId: 'fog-cloud', mode: 'fixed', recharge: 'day', ability: 'CHA' },
        { charLevel: 3, spellId: 'gust-of-wind', mode: 'fixed', recharge: 'day', ability: 'CHA' },
        { charLevel: 5, spellId: 'water-walk', mode: 'fixed', recharge: 'day', ability: 'CHA' },
    ],
    'yuan-ti': [
        { charLevel: 1, spellId: 'poison-spray', mode: 'fixed', recharge: 'at-will', ability: 'CHA' },
        { charLevel: 1, spellId: 'animal-friendship', mode: 'fixed', recharge: 'at-will', ability: 'CHA', notes: 'Unlimited on snakes' },
        { charLevel: 3, spellId: 'suggestion', mode: 'fixed', recharge: 'day', ability: 'CHA' },
    ],
};

async function migrate() {
    console.log('🔮 Migrating Racial Spells...');

    // 1. Fetch all spells to map slugs to IDs
    const allSpells = await client.fetch(`*[_type == "spell"]{_id, "slug": slug.current}`);
    const spellMap = new Map<string, string>();
    allSpells.forEach((s: any) => {
        if (s.slug) spellMap.set(s.slug, s._id);
    });
    console.log(`Loaded ${allSpells.length} spells.`);

    const transaction = client.transaction();

    // 2. Iterate through defined races
    for (const [raceSlug, spells] of Object.entries(RACE_SPELLS)) {
        // Fetch the race document
        const raceDoc = await client.fetch(`*[_type == "race" && (slug.current == $slug || name == $name)][0]`, {
            slug: raceSlug,
            name: raceSlug // Fallback if user used name as key, though I used slugs in map
        });

        if (!raceDoc) {
            console.log(`⚠️ Race not found: ${raceSlug} (Attempted slug match)`);

            // Try lenient match for names with spaces/parens e.g. "Geneasi (Air)" -> "genasi-air"
            // Actually, I should probably search by substring or just log it.
            // Let's rely on accurate slugs.
            continue;
        }

        console.log(`Processing ${raceDoc.name} (${raceSlug})...`);

        const newSpells: SpellGrant[] = [];

        for (const [idx, spellDef] of spells.entries()) {
            const grant: SpellGrant = {
                _key: `racial-spell-${idx}`,
                _type: 'spellGrant',
                level: spellDef.charLevel,
                mode: spellDef.mode,
                ability: spellDef.ability,
                recharge: spellDef.recharge === 'unlimited' ? 'at-will' : spellDef.recharge, // Map unlimited to at-will but keep note
                notes: spellDef.recharge === 'unlimited' ? (spellDef.notes ? `${spellDef.notes} (Unlimited)` : 'Unlimited uses') : spellDef.notes,
            };

            if (spellDef.mode === 'fixed' && spellDef.spellId) {
                const sanitySpellId = spellMap.get(spellDef.spellId);
                if (sanitySpellId) {
                    grant.specificSpells = [{
                        _type: 'reference',
                        _ref: sanitySpellId,
                        _key: `ref-${idx}`
                    }];
                } else {
                    console.error(`  ❌ Spell not found: ${spellDef.spellId} for ${raceSlug}`);
                    // Skip or add placeholder? Skipping to avoid broken refs.
                    continue;
                }
            } else if (spellDef.mode === 'choice') {
                grant.spellList = spellDef.spellList;
                grant.count = spellDef.count;
                grant.spellLevel = spellDef.spellLevel;
            }

            newSpells.push(grant);
        }

        // Apply update
        if (newSpells.length > 0) {
            // Unset the old field if it exists, set the new field
            transaction.patch(raceDoc._id, p =>
                p.unset(['racialKnownSpells']) // Clean up the forbidden field if I accidentally added it before
                    .set({ spells: newSpells })
            );
            console.log(`  ✓ Queued update for ${raceDoc.name}: ${newSpells.length} spells`);
        }
    }

    console.log('\nCommitting changes...');
    await transaction.commit();
    console.log('✅ Migration complete!');
}

migrate().catch(console.error);
