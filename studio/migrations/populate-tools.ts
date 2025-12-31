import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from studio/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const client = createClient({
    projectId: 'ylk0tk34',
    dataset: 'production',
    useCdn: false,
    token: process.env.SANITY_AUTH_TOKEN,
    apiVersion: '2024-01-01',
});

// Helper to create slug
function slugify(text: string) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

const TOOLS = [
    // Artisan's Tools
    { name: "Alchemist's Supplies", category: "Artisan's Tools", cost: { amount: 50, currency: 'gp' }, weight: 8, description: "Includes two glass beakers, a metal frame to hold a beaker in place over an open flame, a glass stir rod, a small mortar and pestle, and a pouch of common alchemical ingredients." },
    { name: "Brewer's Supplies", category: "Artisan's Tools", cost: { amount: 20, currency: 'gp' }, weight: 9, description: "Includes a large glass jug, a quantity of hops, a siphon, and several feet of tubing." },
    { name: "Calligrapher's Supplies", category: "Artisan's Tools", cost: { amount: 10, currency: 'gp' }, weight: 5, description: "Includes ink, a dozen sheets of parchment, and three quills." },
    { name: "Carpenter's Tools", category: "Artisan's Tools", cost: { amount: 8, currency: 'gp' }, weight: 6, description: "Includes a saw, a hammer, nails, a hatchet, a square, a ruler, an adze, a plane, and a chisel." },
    { name: "Cartographer's Tools", category: "Artisan's Tools", cost: { amount: 15, currency: 'gp' }, weight: 6, description: "Includes a quill, ink, parchment, a pair of compasses, calipers, and a ruler." },
    { name: "Cobbler's Tools", category: "Artisan's Tools", cost: { amount: 5, currency: 'gp' }, weight: 5, description: "Includes a hammer, an awl, a knife, a shoe stand, a cutter, spare leather, and thread." },
    { name: "Cook's Utensils", category: "Artisan's Tools", cost: { amount: 1, currency: 'gp' }, weight: 8, description: "Includes a metal pot, knives, forks, a stirring spoon, and a ladle." },
    { name: "Glassblower's Tools", category: "Artisan's Tools", cost: { amount: 30, currency: 'gp' }, weight: 5, description: "Includes a blowpipe, a small marver, blocks, and tweezers. You need a source of heat to work glass." },
    { name: "Jeweler's Tools", category: "Artisan's Tools", cost: { amount: 25, currency: 'gp' }, weight: 2, description: "Includes a small saw and hammer, files, pliers, and tweezers." },
    { name: "Leatherworker's Tools", category: "Artisan's Tools", cost: { amount: 5, currency: 'gp' }, weight: 5, description: "Includes a knife, a small mallet, an edger, a hole punch, thread, and leather scraps." },
    { name: "Mason's Tools", category: "Artisan's Tools", cost: { amount: 10, currency: 'gp' }, weight: 8, description: "Includes a trowel, a hammer, a chisel, brushes, and a square." },
    { name: "Painter's Supplies", category: "Artisan's Tools", cost: { amount: 10, currency: 'gp' }, weight: 5, description: "Includes an easel, canvas, paints, brushes, charcoal sticks, and a palette." },
    { name: "Potter's Tools", category: "Artisan's Tools", cost: { amount: 10, currency: 'gp' }, weight: 3, description: "Includes potter's needles, ribs, scrapers, a knife, and wire." },
    { name: "Smith's Tools", category: "Artisan's Tools", cost: { amount: 20, currency: 'gp' }, weight: 8, description: "Includes hammers, tongs, charcoal, rags, and a whetstone." },
    { name: "Tinker's Tools", category: "Artisan's Tools", cost: { amount: 50, currency: 'gp' }, weight: 10, description: "Includes a variety of hand tools, thread, needles, a whetstone, scraps of cloth and leather, and a small pot of glue." },
    { name: "Weaver's Tools", category: "Artisan's Tools", cost: { amount: 1, currency: 'gp' }, weight: 5, description: "Includes thread, needles, and scraps of cloth." },
    { name: "Woodcarver's Tools", category: "Artisan's Tools", cost: { amount: 1, currency: 'gp' }, weight: 5, description: "Includes a knife, a gouge, and a small saw." },

    // Gaming Sets
    { name: "Dice Set", category: "Gaming Set", cost: { amount: 1, currency: 'sp' }, weight: 0, description: "A set of dice." },
    { name: "Dragonchess Set", category: "Gaming Set", cost: { amount: 1, currency: 'gp' }, weight: 0.5, description: "A set for playing Dragonchess." },
    { name: "Playing Card Set", category: "Gaming Set", cost: { amount: 5, currency: 'sp' }, weight: 0, description: "A standard deck of playing cards." },
    { name: "Three-Dragon Ante Set", category: "Gaming Set", cost: { amount: 1, currency: 'gp' }, weight: 0, description: "A deck of cards for playing Three-Dragon Ante." },

    // Musical Instruments
    { name: "Bagpipes", category: "Musical Instrument", cost: { amount: 30, currency: 'gp' }, weight: 6, description: "A musical instrument." },
    { name: "Drum", category: "Musical Instrument", cost: { amount: 6, currency: 'gp' }, weight: 3, description: "A musical instrument." },
    { name: "Dulcimer", category: "Musical Instrument", cost: { amount: 25, currency: 'gp' }, weight: 10, description: "A musical instrument." },
    { name: "Flute", category: "Musical Instrument", cost: { amount: 2, currency: 'gp' }, weight: 1, description: "A musical instrument." },
    { name: "Horn", category: "Musical Instrument", cost: { amount: 3, currency: 'gp' }, weight: 2, description: "A musical instrument." },
    { name: "Lute", category: "Musical Instrument", cost: { amount: 35, currency: 'gp' }, weight: 2, description: "A musical instrument." },
    { name: "Lyre", category: "Musical Instrument", cost: { amount: 30, currency: 'gp' }, weight: 2, description: "A musical instrument." },
    { name: "Pan Flute", category: "Musical Instrument", cost: { amount: 12, currency: 'gp' }, weight: 2, description: "A musical instrument." },
    { name: "Shawm", category: "Musical Instrument", cost: { amount: 2, currency: 'gp' }, weight: 1, description: "A musical instrument." },
    { name: "Viol", category: "Musical Instrument", cost: { amount: 30, currency: 'gp' }, weight: 1, description: "A musical instrument." },

    // Other
    { name: "Disguise Kit", category: "Other", cost: { amount: 25, currency: 'gp' }, weight: 3, description: "This pouch of cosmetics, hair dye, and small props lets you create disguises that change your physical appearance." },
    { name: "Forgery Kit", category: "Other", cost: { amount: 15, currency: 'gp' }, weight: 5, description: "This small box contains a variety of papers and parchments, pens and inks, seals and sealing wax, gold and silver leaf, and other supplies necessary to create convincing forgeries of physical documents." },
    { name: "Herbalism Kit", category: "Other", cost: { amount: 5, currency: 'gp' }, weight: 3, description: "This kit contains a variety of instruments such as clippers, mortar and pestle, and pouches and vials used by herbalists to create remedies and potions." },
    { name: "Navigator's Tools", category: "Other", cost: { amount: 25, currency: 'gp' }, weight: 2, description: "This set of instruments is used for navigation at sea." },
    { name: "Poisoner's Kit", category: "Other", cost: { amount: 50, currency: 'gp' }, weight: 2, description: "A poisoner's kit includes the vials, chemicals, and other equipment necessary for the creation of poisons." },
    { name: "Thieves' Tools", category: "Other", cost: { amount: 25, currency: 'gp' }, weight: 1, description: "This set of tools includes a small file, a set of lock picks, a small mirror mounted on a metal handle, a set of narrow-bladed scissors, and a pair of pliers." },
];

async function migrate() {
    console.log('🛠️ Adding Tools to Sanity...');
    const transaction = client.transaction();

    for (const tool of TOOLS) {
        const docId = `tool-${slugify(tool.name)}`;
        const doc = {
            _id: docId,
            _type: 'item',
            name: tool.name,
            slug: { _type: 'slug', current: slugify(tool.name) },
            type: 'Tool',
            toolCategory: tool.category,
            cost: tool.cost,
            weight: tool.weight,
            description: tool.description,
            source: 'phb5e', // Defaulting to PHB 5e
        };

        transaction.createOrReplace(doc);
        console.log(`  + Queued: ${tool.name}`);
    }

    console.log('Committing...');
    await transaction.commit();
    console.log('✅ Done!');
}

migrate().catch(console.error);
