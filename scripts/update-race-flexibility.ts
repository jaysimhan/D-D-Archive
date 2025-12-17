
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const projectId = process.env.SANITY_API_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_API_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
    console.error('Missing Sanity configuration. Please check .env file.');
    console.error({ projectId, dataset, token: token ? '***' : 'missing' });
    process.exit(1);
}

const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function main() {
    console.log('🔄 Starting race flexibility update...');

    try {
        // Fetch all races
        const races = await client.fetch<any[]>(`*[_type == "race"]{_id, name, flexibleAbilityScores}`);
        console.log(`📋 Found ${races.length} races.`);

        const transaction = client.transaction();
        let updateCount = 0;

        for (const race of races) {
            // Skip Human
            if (race.name === 'Human') {
                console.log(`ℹ️ Skipping ${race.name} (Human)`);
                continue;
            }

            // Skip if already true (optional, but good for idempotency)
            if (race.flexibleAbilityScores === true) {
                // console.log(`✓ ${race.name} already has flexible ability scores.`);
                // continue; 
                // Actually, user said "toggle ... to be on", so ensuring it is True is correct.
            }

            console.log(`➕ Enabling flexible ability scores for ${race.name}`);
            transaction.patch(race._id, p => p.set({ flexibleAbilityScores: true }));
            updateCount++;
        }

        if (updateCount > 0) {
            console.log(`💾 Committing updates for ${updateCount} races...`);
            await transaction.commit();
            console.log('✅ Update complete!');
        } else {
            console.log('✨ No updates needed.');
        }

    } catch (error) {
        console.error('❌ Error updating races:', error);
        process.exit(1);
    }
}

main();
