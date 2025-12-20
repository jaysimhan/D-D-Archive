import { createClient } from '@sanity/client';

const client = createClient({
    projectId: 'ylk0tk34',
    dataset: 'production',
    useCdn: false,
    token: process.env.SANITY_AUTH_TOKEN,
    apiVersion: '2024-01-01',
});

async function checkRaceStatus() {
    console.log('🚀 Checking Race Spellcaster Status...');

    const races = await client.fetch(`*[_type == "race"] { 
        name, 
        isSpellcaster,
        "bg_caster": isSpellcaster,
        spells,
        racialKnownSpells,
        racialSpellChoices
    }`);

    console.table(races.map((r: any) => ({
        name: r.name,
        isSpellcaster: r.isSpellcaster,
        hasSpells: (r.spells?.length || 0) + (r.racialKnownSpells?.length || 0) + (r.racialSpellChoices?.length || 0) > 0
    })));
}

checkRaceStatus();
