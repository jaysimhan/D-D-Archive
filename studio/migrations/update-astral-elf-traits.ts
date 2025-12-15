/**
 * Script to add/update Astral Elf traits with official descriptions
 * 
 * Usage:
 * cd studio
 * SANITY_AUTH_TOKEN=xxx npx sanity exec migrations/update-astral-elf-traits.ts --with-user-token
 */

import { createClient } from '@sanity/client';

const client = createClient({
    projectId: 'ylk0tk34',
    dataset: 'production',
    useCdn: false,
    token: process.env.SANITY_AUTH_TOKEN,
    apiVersion: '2024-01-01',
});

function toSanityId(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

// Official Astral Elf traits from Astral Adventurer's Guide
const ASTRAL_ELF_TRAITS = [
    {
        name: 'Astral Fire',
        description: 'You know one of the following cantrips of your choice: Dancing Lights, Light, or Sacred Flame. Intelligence, Wisdom, or Charisma is your spellcasting ability for it (choose when you select this race).',
        tags: ['race'],
    },
    {
        name: 'Starlight Step',
        description: "As a bonus action, you can magically teleport up to 30 feet to an unoccupied space you can see. You can use this trait a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
        tags: ['race'],
    },
    {
        name: 'Astral Trance',
        description: "You don't need to sleep, and magic can't put you to sleep. You can finish a long rest in 4 hours if you spend those hours in a trancelike meditation, during which you remain conscious. Whenever you finish this trance, you gain proficiency in one skill of your choice and with one weapon or tool of your choice, selected from the Player's Handbook. You magically acquire these proficiencies by drawing them from shared elven memory and the experiences of entities on the Astral Plane, and you retain them until you finish your next long rest.",
        tags: ['race'],
    },
];

async function updateAstralElfTraits() {
    console.log('🌟 Adding/Updating Astral Elf Traits...\n');

    // Create or update traits
    const transaction = client.transaction();

    for (const trait of ASTRAL_ELF_TRAITS) {
        const doc = {
            _id: `trait-${toSanityId(trait.name)}`,
            _type: 'trait',
            name: trait.name,
            slug: { _type: 'slug', current: toSanityId(trait.name) },
            description: trait.description,
            tags: trait.tags,
            level: 1,
            source: "Astral Adventurer's Guide",
            edition: 'Both',
            version: 1,
        };
        transaction.createOrReplace(doc);
        console.log(`  📝 ${trait.name}`);
    }

    await transaction.commit();
    console.log(`\n✅ Created/updated ${ASTRAL_ELF_TRAITS.length} Astral Elf traits`);

    // Now link these traits to Astral Elf race
    console.log('\n🔗 Linking traits to Astral Elf race...');

    // Get Astral Elf races
    const astralElves = await client.fetch(`*[_type == "race" && name match "Astral Elf*"]{ _id, name, traits }`);
    console.log(`Found ${astralElves.length} Astral Elf race(s)`);

    // Trait IDs to add
    const newTraitIds = ASTRAL_ELF_TRAITS.map(t => `trait-${toSanityId(t.name)}`);

    for (const race of astralElves) {
        // Get existing trait refs
        const existingRefs = race.traits || [];
        const existingIds = existingRefs
            .filter((r: any) => r._ref)
            .map((r: any) => r._ref);

        // Add new refs that don't exist
        const newRefs = [...existingRefs];
        for (const traitId of newTraitIds) {
            if (!existingIds.includes(traitId)) {
                newRefs.push({
                    _type: 'reference',
                    _ref: traitId,
                    _key: `ref-${toSanityId(traitId)}`,
                });
            }
        }

        await client.patch(race._id).set({ traits: newRefs }).commit();
        console.log(`✅ Updated ${race.name}: now has ${newRefs.length} traits`);
    }
}

async function run() {
    console.log('🚀 Updating Astral Elf Traits');
    console.log('='.repeat(50));

    try {
        await updateAstralElfTraits();
        console.log('\n🎉 Done!');
    } catch (error) {
        console.error('❌ Failed:', error);
        process.exit(1);
    }
}

run();
