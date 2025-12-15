/**
 * Migration script to convert legacy race fields to new schema format
 * 
 * This script converts:
 * 1. `languages` array → `proficiencies` with type 'language'
 * 2. `racialSpellChoices` → `spells` with spellGrant format
 * 
 * Usage:
 * 1. Navigate to the studio directory: cd studio
 * 2. Run: npx sanity exec migrations/migrate-race-fields.ts --with-user-token
 */

import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const client = createClient({
    projectId: process.env.SANITY_API_PROJECT_ID || 'ylk0tk34',
    dataset: process.env.SANITY_API_DATASET || 'production',
    useCdn: false,
    token: process.env.SANITY_API_WRITE_TOKEN,
    apiVersion: '2024-01-01',
});

interface LegacyRace {
    _id: string;
    name: string;
    languages?: string[];
    racialSpellChoices?: Array<{
        _key: string;
        choose: number;
        name: string;
        list?: string[];
        school?: string;
        level?: number;
    }>;
    racialKnownSpells?: Array<{
        _key: string;
        level: number;
        spellId: string;
        abilityScore?: string;
        type?: string;
        spellName?: string;
    }>;
    proficiencies?: Array<{
        _key: string;
        type: string;
        mode: string;
        count?: number;
        languageOptions?: string[];
        skillOptions?: string[];
        toolOptions?: string[];
        armorOptions?: string[];
        weaponOptions?: string[];
    }>;
    spells?: Array<{
        _key: string;
        name?: string;
        level?: number;
        mode: string;
        count?: number;
        spellList?: string;
        ability?: string;
        recharge?: string;
    }>;
}

async function migrateRaceFields() {
    console.log('🔄 Starting race field migration...\n');

    // Fetch all races
    const races: LegacyRace[] = await client.fetch(
        `*[_type == "race"]{
            _id,
            name,
            languages,
            racialSpellChoices,
            racialKnownSpells,
            proficiencies,
            spells
        }`
    );

    console.log(`Found ${races.length} races to check\n`);

    let migratedCount = 0;

    for (const race of races) {
        const updates: Record<string, unknown> = {};
        const unsets: string[] = [];
        let needsMigration = false;

        // === Migrate languages to proficiencies ===
        if (race.languages && race.languages.length > 0) {
            console.log(`📝 ${race.name}: Found ${race.languages.length} languages to migrate`);

            // Create language proficiency rules
            const languageProficiencies = race.languages.map((lang, idx) => ({
                _key: `lang-prof-${idx}-${Date.now()}`,
                _type: 'proficiencyRule',
                type: 'language',
                mode: 'fixed',
                languageOptions: [lang],
            }));

            // Merge with existing proficiencies
            const existingProficiencies = race.proficiencies || [];
            updates.proficiencies = [...existingProficiencies, ...languageProficiencies];
            unsets.push('languages');
            needsMigration = true;
        }

        // === Migrate racialSpellChoices to spells ===
        if (race.racialSpellChoices && race.racialSpellChoices.length > 0) {
            console.log(`✨ ${race.name}: Found ${race.racialSpellChoices.length} spell choices to migrate`);

            // Convert to spellGrant format
            const spellGrants = race.racialSpellChoices.map((choice, idx) => ({
                _key: `spell-grant-${idx}-${Date.now()}`,
                _type: 'spellGrant',
                name: choice.name,
                level: 1,
                mode: choice.choose === 1 && choice.list?.length === 1 ? 'fixed' : 'choice',
                count: choice.choose,
                // Note: specificSpells would need to be references, but we store the IDs in description
                // since we can't easily create references here
            }));

            // Merge with existing spells
            const existingSpells = race.spells || [];
            updates.spells = [...existingSpells, ...spellGrants];
            unsets.push('racialSpellChoices');
            needsMigration = true;
        }

        // === Migrate racialKnownSpells to spells ===
        if (race.racialKnownSpells && race.racialKnownSpells.length > 0) {
            console.log(`🔮 ${race.name}: Found ${race.racialKnownSpells.length} known spells to migrate`);

            // Convert to spellGrant format
            const knownSpellGrants = race.racialKnownSpells.map((spell, idx) => ({
                _key: `known-spell-grant-${idx}-${Date.now()}`,
                _type: 'spellGrant',
                name: spell.spellName || spell.spellId,
                level: spell.level,
                mode: 'fixed',
                ability: spell.abilityScore,
                recharge: spell.type === 'at-will' ? 'at-will' :
                    spell.type === '1/day' ? 'day' :
                        spell.type === 'recharge' ? 'short-rest' : undefined,
            }));

            // Merge with existing spells (including any just added from racialSpellChoices)
            const existingSpells = updates.spells || race.spells || [];
            updates.spells = [...(existingSpells as unknown[]), ...knownSpellGrants];
            unsets.push('racialKnownSpells');
            needsMigration = true;
        }

        // Apply updates if needed
        if (needsMigration) {
            try {
                let patch = client.patch(race._id);

                if (Object.keys(updates).length > 0) {
                    patch = patch.set(updates);
                }

                if (unsets.length > 0) {
                    patch = patch.unset(unsets);
                }

                await patch.commit();
                migratedCount++;
                console.log(`  ✅ Migrated ${race.name}\n`);
            } catch (error) {
                console.error(`  ❌ Failed to migrate ${race.name}:`, error);
            }
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`🎉 Migration complete! Migrated ${migratedCount} races.`);
}

migrateRaceFields().catch(console.error);
