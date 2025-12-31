import { getCliClient } from 'sanity/cli'

const client = getCliClient()

const typesToMigrate = [
    'item',
    'background',
    'class',
    'feat',
    'monster',
    'race',
    'spell',
    'subclass',
    'trait',
]

async function migrate() {
    console.log('Starting migration...')

    // 1. Update defaults for missing fields
    for (const type of typesToMigrate) {
        console.log(`Checking defaults for type: ${type}`)
        const query = `*[_type == "${type}" && (!defined(source) || !defined(edition) || !defined(version))]`
        const docs = await client.fetch(query)

        console.log(`Found ${docs.length} documents of type ${type} missing fields.`)

        if (docs.length > 0) {
            const transaction = client.transaction()
            for (const doc of docs) {
                const patch = client.patch(doc._id)
                const updates: any = {}
                if (!doc.source) updates.source = 'Official'
                if (!doc.edition) updates.edition = 'Both'
                if (!doc.version) updates.version = 1

                patch.set(updates)
                transaction.patch(patch)
            }
            await transaction.commit()
            console.log(`Updated ${docs.length} documents of type ${type}.`)
        }
    }

    // 2. Update Tasha's Cauldron content
    console.log("Checking for Tasha's Cauldron content...")
    const tashaQuery = `*[source == "Tasha's Cauldron of Everything"]`
    const tashaDocs = await client.fetch(tashaQuery)
    console.log(`Found ${tashaDocs.length} documents with source "Tasha's Cauldron of Everything".`)

    if (tashaDocs.length > 0) {
        const transaction = client.transaction()
        for (const doc of tashaDocs) {
            transaction.patch(doc._id, p => p.set({ source: 'Unofficial' }))
        }
        await transaction.commit()
        console.log(`Updated ${tashaDocs.length} Tasha's documents to Unofficial.`)
    }

    console.log('Migration complete.')
}

migrate().catch((err) => {
    console.error('Migration failed:', err)
    process.exit(1)
})
