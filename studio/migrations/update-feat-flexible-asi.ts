/**
 * Migration script to update unofficial 2024 feats with Flexible ASI data
 *
 * Usage:
 * cd studio
 * SANITY_AUTH_TOKEN=xxx npx sanity exec migrations/update-feat-flexible-asi.ts --with-user-token
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

interface FeatASI {
    name: string;
    asiLine: string;
}

const FEAT_ASIS: FeatASI[] = [
    { name: 'Agent of Order', asiLine: '+1 Strength, Constitution, Wisdom, or Charisma' },
    { name: 'Baleful Scion', asiLine: '+1 Strength, Constitution, or Charisma' },
    { name: 'Bloodlust', asiLine: '+1 Strength, Dexterity, or Constitution' },
    { name: 'Chef', asiLine: '+1 Constitution or Wisdom' },
    { name: 'Cloying Mists', asiLine: '+1 Intelligence, Wisdom, or Charisma' },
    { name: 'Cohort of Chaos', asiLine: '+1 Dexterity, Constitution, or Charisma' },
    { name: 'Cold Caster', asiLine: '+1 Intelligence, Wisdom, or Charisma' },
    { name: 'Crusher', asiLine: '+1 Strength or Constitution' },
    { name: 'Delicious Pain', asiLine: '+1 to any ability score' },
    { name: 'Dragon Fear', asiLine: '+1 Strength, Constitution, or Charisma' },
    { name: 'Dragon Hide', asiLine: '+1 Strength, Constitution, or Charisma' },
    { name: 'Ember of the Fire Giant', asiLine: '+1 Strength, Constitution, or Wisdom' },
    { name: 'Enclave Magic', asiLine: '+1 Intelligence, Wisdom, or Charisma' },
    { name: 'Fade Away', asiLine: '+1 Dexterity or Intelligence' },
    { name: 'Fairy Trickster', asiLine: '+1 to any ability score' },
    { name: 'Fey Teleportation', asiLine: '+1 Intelligence or Charisma' },
    { name: 'Flames of Phlegethos', asiLine: '+1 Intelligence or Charisma' },
    { name: 'Fury of the Frost Giant', asiLine: '+1 Strength, Constitution, or Wisdom' },
    { name: 'Gift of the Gem Dragon', asiLine: '+1 Intelligence, Wisdom, or Charisma' },
    { name: 'Guile of the Cloud Giant', asiLine: '+1 Strength, Constitution, or Charisma' },
    { name: 'Harper Teamwork', asiLine: '+1 to any ability score' },
    { name: 'Keenness of the Stone Giant', asiLine: '+1 Strength, Constitution, or Wisdom' },
    { name: 'Knight of the Crown', asiLine: '+1 Strength, Dexterity, or Constitution' },
    { name: 'Knight of the Rose', asiLine: '+1 Constitution, Wisdom, or Charisma' },
    { name: 'Knight of the Sword', asiLine: '+1 Intelligence, Wisdom, or Charisma' },
    { name: 'Light Bringer', asiLine: '+1 Intelligence, Wisdom, or Charisma' },
    { name: 'Lightly Armored', asiLine: '+1 Strength or Dexterity' },
    { name: 'Lordly Resolve', asiLine: '+1 Strength or Charisma' },
    { name: 'Love Bites', asiLine: '+1 to any ability score' },
    { name: 'Martial Weapon Training', asiLine: '+1 Strength or Dexterity' },
    { name: 'Mythal Touched', asiLine: '+1 to any ability score' },
    { name: 'Orcish Fury', asiLine: '+1 Strength or Constitution' },
    { name: 'Order\'s Resilience', asiLine: '+1 Strength, Wisdom, or Charisma' },
    { name: 'Outlands Envoy', asiLine: '+1 to any ability score' },
    { name: 'Piercer', asiLine: '+1 Strength or Dexterity' },
    { name: 'Purple Dragon Commandant', asiLine: '+1 Strength or Dexterity' },
    { name: 'Putrefy', asiLine: '+1 to any ability score' },
    { name: 'Rebuke', asiLine: '+1 to any ability score' },
    { name: 'Revenant Blade', asiLine: '+1 Strength or Dexterity' },
    { name: 'Righteous Heritor', asiLine: '+1 Strength, Constitution, or Charisma' },
    { name: 'Second Chance', asiLine: '+1 Dexterity, Constitution, or Charisma' },
    { name: 'Skill Expert', asiLine: '+1 to any ability score' },
    { name: 'Slasher', asiLine: '+1 Strength or Dexterity' },
    { name: 'Soul of the Storm Giant', asiLine: '+1 Strength, Wisdom, or Charisma' },
    { name: 'Speedy', asiLine: '+1 Dexterity or Constitution' },
    { name: 'Spellfire Adept', asiLine: '+1 to any ability score' },
    { name: 'Squat Nimbleness', asiLine: '+1 Strength or Dexterity' },
    { name: 'Street Justice', asiLine: '+1 Strength or Dexterity' },
    { name: 'Telepathic', asiLine: '+1 Intelligence, Wisdom, or Charisma' },
    { name: 'Treacherous Allure', asiLine: '+1 Intelligence, Wisdom, or Charisma' },
    { name: 'Vampire Touched', asiLine: '+1 Intelligence, Wisdom, or Charisma' },
    { name: 'Vigor of the Hill Giant', asiLine: '+1 Strength, Constitution, or Wisdom' },
    { name: 'Weapon Master', asiLine: '+1 Strength or Dexterity' },
    { name: 'Zhentarim Tactics', asiLine: '+1 to any ability score' },
];

function parseOptions(line: string): string[] {
    if (line.includes('any ability score')) {
        return [];
    }
    const options: string[] = [];
    if (line.includes('Strength')) options.push('STR');
    if (line.includes('Dexterity')) options.push('DEX');
    if (line.includes('Constitution')) options.push('CON');
    if (line.includes('Intelligence')) options.push('INT');
    if (line.includes('Wisdom')) options.push('WIS');
    if (line.includes('Charisma')) options.push('CHA');
    return options;
}

async function updateFeats() {
    console.log('🔄 Updating feats with Flexible ASI data...\n');

    const transaction = client.transaction();
    let count = 0;

    for (const feat of FEAT_ASIS) {
        const docId = `feat-${toSanityId(feat.name)}`;
        const options = parseOptions(feat.asiLine);

        transaction.patch(docId, (p) =>
            p.set({
                'benefits.flexibleAbilityIncrease': {
                    amount: 1,
                    options: options,
                }
            })
        );
        count++;
    }

    console.log(`Prepared updates for ${count} feats...`);
    console.log('\nCommitting to Sanity...');
    await transaction.commit();
    console.log(`\n✅ Successfully updated ${count} feats!`);
}

async function run() {
    console.log('🚀 Feat Flexible ASI Update');
    console.log('='.repeat(50) + '\n');

    try {
        await updateFeats();
        console.log('\n' + '='.repeat(50));
        console.log('🎉 Update complete!');
    } catch (error) {
        console.error('❌ Update failed:', error);
        process.exit(1);
    }
}

run();
