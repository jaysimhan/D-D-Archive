import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function checkTasha() {
    const query = `*[source match "Tasha*"] { _id, _type, source }`
    const docs = await client.fetch(query)
    console.log('Documents with source matching "Tasha*":')
    docs.forEach((doc: any) => {
        console.log(`${doc._id} [${doc._type}]: "${doc.source}"`)
    })
}

checkTasha().catch(console.error)
