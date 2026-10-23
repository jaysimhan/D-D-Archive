/**
 * Opens fifteen spells to 2014 characters.
 *
 * These spells were stored with the 2024 ruleset only, so a 2014 character
 * never saw them — Hex, for one, was missing from Fey Touched and the warlock
 * list. Each was printed for 2014 too (Player's Handbook, Xanathar's Guide or
 * the Elemental Evil Player's Companion), often with different mechanics, so
 * like the Archive's other two-edition spells each gets `sameForBoth: false`,
 * a `rules2024` overlay copied from the document as it stands and a
 * `rules2014` overlay with the 2014 version. Text is summarised.
 *
 * Usage:  npx tsx scripts/add-2014-spell-versions.ts            (dry run)
 *         npx tsx scripts/add-2014-spell-versions.ts --apply    (write)
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
const XGE = "Xanathar's Guide to Everything";

/** The fields an edition overlay carries, as on the Archive's other spells. */
const MECHANICS = [
    'castingTime', 'classes', 'components', 'concentration', 'description', 'duration',
    'higherLevels', 'legacySchoolName', 'level', 'range', 'ritual', 'school',
] as const;

type School = 'Abjuration' | 'Conjuration' | 'Divination' | 'Enchantment' | 'Evocation' | 'Illusion' | 'Necromancy' | 'Transmutation';

interface Version2014 {
    level: number;
    school: School;
    castingTime: string;
    range: string;
    duration: string;
    concentration?: boolean;
    /** "V", "VS", "S", with any material after a colon: "VSM:a hot pepper". */
    components: string;
    classes: string[];
    description: string;
    higherLevels?: string;
    sourceBook?: string;
}

const SPELLS: Record<string, Version2014> = {
    'spell-chromatic-orb': {
        level: 1, school: 'Evocation', castingTime: '1 action', range: '90 feet', duration: 'Instantaneous',
        components: 'VSM:a diamond worth at least 50 gp', classes: ['sorcerer', 'wizard'],
        description: 'You hurl a 4-inch-diameter sphere of energy at a creature you can see within range, choosing acid, cold, '
            + 'fire, lightning, poison, or thunder for its type. Make a ranged spell attack against the target. On a hit, the '
            + 'creature takes 3d8 damage of the chosen type.',
        higherLevels: 'The damage increases by 1d8 for each slot level above 1st.',
    },
    'spell-dissonant-whispers': {
        level: 1, school: 'Enchantment', castingTime: '1 action', range: '60 feet', duration: 'Instantaneous',
        components: 'V', classes: ['bard'],
        description: 'You whisper a discordant melody that only one creature of your choice within range can hear. The target '
            + 'makes a Wisdom saving throw. On a failed save, it takes 3d6 psychic damage and must immediately use its reaction, '
            + 'if available, to move as far as its speed allows away from you, avoiding obviously dangerous ground such as a fire '
            + 'or a pit. On a successful save, it takes half as much damage and doesn\'t have to move. A deafened creature '
            + 'automatically succeeds on the save.',
        higherLevels: 'The damage increases by 1d6 for each slot level above 1st.',
    },
    'spell-ensnaring-strike': {
        level: 1, school: 'Conjuration', castingTime: '1 bonus action', range: 'Self', duration: 'up to 1 minute',
        concentration: true, components: 'V', classes: ['ranger'],
        description: 'The next time you hit a creature with a weapon attack before this spell ends, writhing thorny vines appear '
            + 'at the point of impact, and the target must succeed on a Strength saving throw or be restrained by the vines until '
            + 'the spell ends. A Large or larger creature has advantage on this save. If the target succeeds, the vines shrivel away. '
            + 'While restrained, the target takes 1d6 piercing damage at the start of each of its turns. The target, or a creature '
            + 'that can reach it, can use its action to make a Strength check against your spell save DC; on a success, the target '
            + 'is freed.',
        higherLevels: 'The damage increases by 1d6 for each slot level above 1st.',
    },
    'spell-hex': {
        level: 1, school: 'Enchantment', castingTime: '1 bonus action', range: '90 feet', duration: 'up to 1 hour',
        concentration: true, components: 'VSM:the petrified eye of a newt', classes: ['warlock'],
        description: 'You place a curse on a creature that you can see within range. Until the spell ends, you deal an extra 1d6 '
            + 'necrotic damage to the target whenever you hit it with an attack. Also choose one ability when you cast the spell; '
            + 'the target has disadvantage on ability checks made with that ability. If the target drops to 0 hit points before '
            + 'the spell ends, you can use a bonus action on a later turn to curse a new creature. A remove curse cast on the '
            + 'target ends this spell early.',
        higherLevels: 'With a 3rd- or 4th-level slot, you can maintain concentration on the spell for up to 8 hours; with a '
            + '5th-level or higher slot, for up to 24 hours.',
    },
    'spell-ice-knife': {
        level: 1, school: 'Conjuration', castingTime: '1 action', range: '60 feet', duration: 'Instantaneous',
        components: 'SM:a drop of water or piece of ice', classes: ['druid', 'sorcerer', 'wizard'], sourceBook: XGE,
        description: 'You create a shard of ice and fling it at one creature within range. Make a ranged spell attack against the '
            + 'target; on a hit, it takes 1d10 piercing damage. Hit or miss, the shard then explodes: the target and each creature '
            + 'within 5 feet of it must succeed on a Dexterity saving throw or take 2d6 cold damage.',
        higherLevels: 'The cold damage increases by 1d6 for each slot level above 1st.',
    },
    'spell-ray-of-sickness': {
        level: 1, school: 'Necromancy', castingTime: '1 action', range: '60 feet', duration: 'Instantaneous',
        components: 'VS', classes: ['sorcerer', 'wizard'],
        description: 'A ray of sickening greenish energy lashes out toward a creature within range. Make a ranged spell attack '
            + 'against the target. On a hit, the target takes 2d8 poison damage and must make a Constitution saving throw; on a '
            + 'failed save, it is also poisoned until the end of your next turn.',
        higherLevels: 'The damage increases by 1d8 for each slot level above 1st.',
    },
    'spell-searing-smite': {
        level: 1, school: 'Evocation', castingTime: '1 bonus action', range: 'Self', duration: 'up to 1 minute',
        concentration: true, components: 'V', classes: ['paladin'],
        description: 'The next time you hit a creature with a melee weapon attack during the spell\'s duration, your weapon flares '
            + 'with white-hot intensity: the attack deals an extra 1d6 fire damage and the target ignites. At the start of each of '
            + 'its turns until the spell ends, the target makes a Constitution saving throw, taking 1d6 fire damage on a failure; '
            + 'on a success, the spell ends. If the target or a creature within 5 feet of it uses an action to put out the flames, '
            + 'or something else douses them, the spell ends.',
        higherLevels: 'The initial extra damage dealt by the attack increases by 1d6 for each slot level above 1st.',
    },
    'spell-dragons-breath': {
        level: 2, school: 'Transmutation', castingTime: '1 bonus action', range: 'Touch', duration: 'up to 1 minute',
        concentration: true, components: 'VSM:a hot pepper', classes: ['sorcerer', 'wizard'], sourceBook: XGE,
        description: 'You touch one willing creature and imbue it with the power to spew magical energy from its mouth, choosing '
            + 'acid, cold, fire, lightning, or poison. Until the spell ends, the creature can use an action to exhale a 15-foot cone '
            + 'of that energy. Each creature in the cone makes a Dexterity saving throw, taking 3d6 damage of the chosen type on a '
            + 'failed save, or half as much on a successful one.',
        higherLevels: 'The damage increases by 1d6 for each slot level above 2nd.',
    },
    'spell-mind-spike': {
        level: 2, school: 'Divination', castingTime: '1 action', range: '60 feet', duration: 'up to 1 hour',
        concentration: true, components: 'S', classes: ['sorcerer', 'warlock', 'wizard'], sourceBook: XGE,
        description: 'You reach into the mind of one creature you can see within range. The target makes a Wisdom saving throw, '
            + 'taking 3d8 psychic damage on a failed save, or half as much on a successful one. On a failed save, you also always '
            + 'know the target\'s location until the spell ends, but only while you are both on the same plane of existence. While '
            + 'you have this knowledge, the target can\'t become hidden from you, and if it is invisible, it gains no benefit from '
            + 'that condition against you.',
        higherLevels: 'The damage increases by 1d8 for each slot level above 2nd.',
    },
    'spell-phantasmal-force': {
        level: 2, school: 'Illusion', castingTime: '1 action', range: '60 feet', duration: 'up to 1 minute',
        concentration: true, components: 'VSM:a bit of fleece', classes: ['bard', 'sorcerer', 'wizard'],
        description: 'You craft an illusion in the mind of a creature you can see within range. The target makes an Intelligence '
            + 'saving throw. On a failed save, you create a phantasmal object, creature, or other visible phenomenon of your choice, '
            + 'no larger than a 10-foot cube, that only the target perceives. The target treats the phantasm as real and '
            + 'rationalizes any illogical outcome of interacting with it. The phantasm can deal 1d6 psychic damage to the target if '
            + 'it is in the phantasm\'s area or within 5 feet of it, provided the illusion could logically deal damage; the target '
            + 'perceives the damage as a type suited to the illusion. The target can use its action to examine the phantasm with an '
            + 'Intelligence (Investigation) check against your spell save DC; on a success, it realizes the phantasm is an illusion '
            + 'and the spell ends.',
    },
    'spell-aura-of-life': {
        level: 4, school: 'Abjuration', castingTime: '1 action', range: 'Self (30-foot radius)', duration: 'up to 10 minutes',
        concentration: true, components: 'V', classes: ['paladin'],
        description: 'Life-preserving energy radiates from you in a 30-foot-radius aura that moves with you. Each nonhostile '
            + 'creature in the aura, including you, has resistance to necrotic damage, and its hit point maximum can\'t be reduced. '
            + 'A nonhostile, living creature that starts its turn in the aura with 0 hit points regains 1 hit point.',
    },
    'spell-charm-monster': {
        level: 4, school: 'Enchantment', castingTime: '1 action', range: '30 feet', duration: '1 hour',
        components: 'VS', classes: ['bard', 'druid', 'sorcerer', 'warlock', 'wizard'], sourceBook: XGE,
        description: 'You attempt to charm a creature you can see within range. It makes a Wisdom saving throw, with advantage if '
            + 'you or your companions are fighting it. On a failed save, it is charmed by you until the spell ends or until you or '
            + 'your companions do anything harmful to it, and it regards you as a friendly acquaintance. When the spell ends, the '
            + 'creature knows it was charmed by you.',
        higherLevels: 'You can target one additional creature for each slot level above 4th. The creatures must be within 30 feet '
            + 'of each other when you target them.',
    },
    'spell-vitriolic-sphere': {
        level: 4, school: 'Evocation', castingTime: '1 action', range: '150 feet', duration: 'Instantaneous',
        components: 'VSM:a drop of giant slug bile', classes: ['sorcerer', 'wizard'], sourceBook: XGE,
        description: 'You point at a location within range, and a 1-foot ball of emerald acid streaks there and explodes in a '
            + '20-foot-radius sphere. Each creature in that area makes a Dexterity saving throw. On a failed save, a creature takes '
            + '10d4 acid damage and another 5d4 acid damage at the end of its next turn. On a successful save, it takes half the '
            + 'initial damage and no damage at the end of its next turn.',
        higherLevels: 'The initial damage increases by 2d4 for each slot level above 4th.',
    },
    'spell-tsunami': {
        level: 8, school: 'Conjuration', castingTime: '1 minute', range: 'Sight', duration: 'up to 6 rounds',
        concentration: true, components: 'VS', classes: ['druid'],
        description: 'A wall of water springs into existence at a point you choose within range, up to 300 feet long, 300 feet '
            + 'high, and 50 feet thick, lasting for the duration. When it appears, each creature within its area makes a Strength '
            + 'saving throw, taking 6d10 bludgeoning damage on a failed save, or half as much on a successful one. At the start of '
            + 'each of your turns after that, the wall and any creatures in it move 50 feet away from you. Any Huge or smaller '
            + 'creature inside the wall, or whose space the wall enters as it moves, must succeed on a Strength saving throw or take '
            + '5d10 bludgeoning damage, at most once per round. At the end of each turn, the wall\'s height drops by 50 feet and the '
            + 'damage on later rounds drops by 1d10; the spell ends when the wall reaches 0 feet. A creature caught in the wall can '
            + 'move only by swimming, and must succeed on a Strength (Athletics) check against your spell save DC to move at all. '
            + 'A creature that moves out of the wall falls to the ground.',
    },
    'spell-power-word-heal': {
        level: 9, school: 'Evocation', castingTime: '1 action', range: 'Touch', duration: 'Instantaneous',
        components: 'VS', classes: ['bard'],
        description: 'A wave of healing energy washes over the creature you touch. The target regains all its hit points. If the '
            + 'creature is charmed, frightened, paralyzed, or stunned, the condition ends. If the creature is prone, it can use its '
            + 'reaction to stand up. This spell has no effect on undead or constructs.',
    },
};

function overlay2014(version: Version2014, schoolIds: Record<string, string>) {
    const [flags, material] = version.components.split(':');
    // Most school documents are `magicSchool.<name>`, but not all of them.
    const key = schoolIds[version.school];
    if (!key) throw new Error(`No school document named ${version.school}`);
    return {
        castingTime: version.castingTime,
        classes: version.classes,
        components: {
            verbal: flags.includes('V'),
            somatic: flags.includes('S'),
            material: material !== undefined,
            materialDescription: material ?? '',
        },
        concentration: version.concentration ?? false,
        description: version.description,
        duration: version.duration,
        higherLevels: version.higherLevels ?? '',
        legacySchoolName: version.school,
        level: version.level,
        range: version.range,
        ritual: false,
        school: { _type: 'reference', _key: key, _ref: key },
        ...(version.sourceBook ? { sourceBook: version.sourceBook } : {}),
    };
}

/** JSON with sorted keys, so field order doesn't count as a difference. */
const canonical = (value: unknown): string => JSON.stringify(value, (_, inner) =>
    inner && typeof inner === 'object' && !Array.isArray(inner)
        ? Object.fromEntries(Object.entries(inner).sort(([a], [b]) => a.localeCompare(b)))
        : inner);

async function main() {
    const ids = Object.keys(SPELLS);
    const docs = await client.fetch<Record<string, unknown>[]>(`*[_id in $ids]`, { ids });
    const schools = await client.fetch<{ _id: string; name: string }[]>(
        `*[_type == "magicSchool" && !(_id in path("drafts.**"))]{_id, name}`,
    );
    const schoolIds = Object.fromEntries(schools.map((school) => [school.name, school._id]));
    const missing = ids.filter((id) => !docs.some((doc) => doc._id === id));
    if (missing.length) throw new Error(`Not found: ${missing.join(', ')}`);

    const already = docs.filter((doc) => (doc.rulesets as { _ref: string }[] | undefined)?.some((ref) => ref._ref === R14._ref));
    if (already.length) throw new Error(`Already open to 2014, re-check by hand: ${already.map((doc) => doc._id).join(', ')}`);

    console.log(`${APPLY ? 'Updating' : 'Would update'} ${docs.length} spells:`);
    let tx = client.transaction();
    for (const doc of docs) {
        const version = SPELLS[doc._id as string];
        const rules2024 = Object.fromEntries(MECHANICS.filter((field) => doc[field] !== undefined).map((field) => [field, doc[field]]));
        const rules2014 = overlay2014(version, schoolIds);
        const changed = MECHANICS.filter((field) => canonical(rules2014[field]) !== canonical(rules2024[field]));
        console.log(`  ${doc.name}: 2014 differs in ${changed.join(', ') || 'nothing'}`);
        tx = tx.patch(doc._id as string, (patch) => patch
            .ifRevisionId(doc._rev as string)
            .set({ rulesets: [R14, R24], edition: 'Both', sameForBoth: false, rules2014, rules2024 }));
    }
    if (!APPLY) {
        console.log('Dry run. Re-run with --apply to write.');
        return;
    }
    const result = await tx.commit();
    console.log(`Committed transaction ${result.transactionId}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
