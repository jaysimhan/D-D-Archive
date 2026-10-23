/**
 * Adds the Echo Knight fighter subclass (Explorer's Guide to Wildemount).
 *
 * There is no 2024 reprint, so like the Archive's other supplement subclasses
 * it is one document shared by both rulesets: a 2024 fighter takes it at level
 * 3 with the same features, as the 2024 Handbook allows for older subclasses.
 * Feature text is summarised, as elsewhere in the Archive.
 *
 * Usage:  npx tsx scripts/add-echo-knight.ts            (dry run)
 *         npx tsx scripts/add-echo-knight.ts --apply    (write)
 */
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const client = createClient({
    projectId: process.env.SANITY_API_PROJECT_ID || 'ylk0tk34',
    dataset: process.env.SANITY_API_DATASET || 'production',
    token: process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
    apiVersion: '2026-08-18',
    useCdn: false,
});

const APPLY = process.argv.includes('--apply');
const R14 = { _type: 'reference', _key: 'srd-2014', _ref: 'ruleset.srd-2014' };
const R24 = { _type: 'reference', _key: 'srd-2024', _ref: '86642d23-c52d-4577-adc1-214aab0f43e9' };
const RULESETS = [R14, R24];
const NOTE = "Explorer's Guide to Wildemount; no 2024 reprint, so the same features apply under both rulesets.";

const FEATURES: { level: number; slug: string; name: string; description: string }[] = [
    {
        level: 3,
        slug: 'manifest-echo',
        name: 'Manifest Echo',
        description:
            'As a bonus action, you create a translucent gray echo of yourself in an unoccupied space you can see within 15 feet. '
            + 'It has AC 14 + your proficiency bonus, 1 hit point, and immunity to all conditions; it lasts until destroyed, '
            + 'until you dismiss it as a bonus action, until you make another, or until you are incapacitated, and it is destroyed '
            + 'if it ends your turn more than 30 feet from you. On your turn you can mentally move it up to 30 feet in any direction '
            + '(no action). As a bonus action you can swap places with it, costing 15 feet of your movement. When you take the Attack '
            + 'action, any attack you make can originate from your space or the echo\'s, and you can make opportunity attacks from the '
            + 'echo\'s position.',
    },
    {
        level: 3,
        slug: 'unleash-incarnation',
        name: 'Unleash Incarnation',
        description:
            'Whenever you take the Attack action, you can make one additional melee attack from the echo\'s position. '
            + 'You can do this a number of times equal to your Constitution modifier (minimum of once), regaining all uses '
            + 'when you finish a long rest.',
    },
    {
        level: 7,
        slug: 'echo-avatar',
        name: 'Echo Avatar',
        description:
            'As an action, you can temporarily transfer your consciousness to your echo for up to 10 minutes, seeing and hearing '
            + 'through its eyes and ears while you are deafened and blinded. The echo can then be up to 1,000 feet away without '
            + 'being destroyed. You can end the effect at any time (no action).',
    },
    {
        level: 10,
        slug: 'shadow-martyr',
        name: 'Shadow Martyr',
        description:
            'When a creature you can see makes an attack roll against a target other than you, you can use your reaction before the '
            + 'roll to teleport the echo to an unoccupied space within 5 feet of the target; the attack is made against the echo '
            + 'instead. Once you use this feature, you can\'t use it again until you finish a short or long rest.',
    },
    {
        level: 15,
        slug: 'reclaim-potential',
        name: 'Reclaim Potential',
        description:
            'When an echo of yours is destroyed by taking damage, you can gain temporary hit points equal to 2d6 + your Constitution '
            + 'modifier, provided you don\'t already have temporary hit points. You can do this a number of times equal to your '
            + 'Constitution modifier (minimum of once), regaining all uses when you finish a long rest.',
    },
    {
        level: 18,
        slug: 'legion-of-one',
        name: 'Legion of One',
        description:
            'You can use a bonus action to create two echoes with Manifest Echo, and they can coexist. If you try to create a third, '
            + 'the previous two are destroyed. Anything you can do from one echo\'s position can be done from the other\'s. '
            + 'In addition, when you roll initiative and have no uses of Unleash Incarnation left, you regain one use.',
    },
];

const featureId = (feature: (typeof FEATURES)[number]) => `feature-subclass-echo-knight-${feature.level}-${feature.slug}`;

const featureDocs = FEATURES.map((feature) => ({
    _id: featureId(feature),
    _type: 'feature',
    name: feature.name,
    slug: { _type: 'slug', current: `echo-knight-${feature.slug}` },
    acquiredAtLevel: feature.level,
    description: feature.description,
    rulesets: RULESETS,
    isHomebrew: false,
    versionNotes: NOTE,
}));

const subclassDoc = {
    _id: 'subclass-echo-knight',
    _type: 'subclass',
    name: 'Echo Knight',
    slug: { _type: 'slug', current: 'echo-knight' },
    parentClassId: 'fighter',
    parentClass: { _type: 'reference', _ref: 'class-fighter' },
    description:
        'A mysterious and feared frontline warrior of the Kryn Dynasty, the Echo Knight has mastered the art of using dunamis '
        + 'to summon the fading shades of unrealized timelines to aid them in battle.',
    source: 'Official',
    sourceBook: "Explorer's Guide to Wildemount",
    edition: 'Both',
    rulesets: RULESETS,
    sameForBoth: true,
    isHomebrew: false,
    isSpellcaster: false,
    version: 1,
    features: FEATURES.map((feature) => ({
        _type: 'reference',
        _key: `${feature.level}-${feature.slug}`,
        _ref: featureId(feature),
    })),
    versionNotes: NOTE,
};

async function main() {
    const existing = await client.fetch<string[]>(
        `*[_id in $ids]._id`,
        { ids: [subclassDoc._id, ...featureDocs.map((doc) => doc._id)] },
    );
    const clash = await client.fetch<{ _id: string } | null>(
        `*[_type == "subclass" && slug.current == "echo-knight" && _id != $id][0]{_id}`,
        { id: subclassDoc._id },
    );
    if (clash) throw new Error(`Another subclass already uses the echo-knight slug: ${clash._id}`);

    console.log(`${APPLY ? 'Writing' : 'Would write'} 1 subclass and ${featureDocs.length} features`
        + (existing.length ? ` (replacing ${existing.length} existing: ${existing.join(', ')})` : ' (all new)'));
    for (const doc of featureDocs) console.log(`  L${doc.acquiredAtLevel} ${doc.name}`);
    if (!APPLY) {
        console.log('Dry run. Re-run with --apply to write.');
        return;
    }

    let tx = client.transaction();
    for (const doc of featureDocs) tx = tx.createOrReplace(doc);
    tx = tx.createOrReplace(subclassDoc);
    const result = await tx.commit();
    console.log(`Committed transaction ${result.transactionId}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
