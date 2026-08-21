import { getCliClient } from 'sanity/cli'

// The footer credit used to be a single string ("by Jaysimhan") rendered in
// uppercase Cinzel. It is now two fields so the lead-in word can carry its own
// typography, which means the stored value has to be split in two.
const client = getCliClient({ apiVersion: '2026-08-21' })
const APPLY = process.argv.includes('--apply')

type Homepage = { _id: string; footer?: { credits?: string; creditsPrefix?: string } }

async function run() {
  const docs = await client.fetch<Homepage[]>('*[_type == "homepage"]{_id, footer}')
  const plan = docs
    .map((doc) => {
      const credits = doc.footer?.credits?.trim()
      const match = credits?.match(/^(by)\s+(.+)$/i)
      if (!credits || !match) return null
      return { _id: doc._id, from: credits, prefix: match[1].toLowerCase(), name: match[2].trim() }
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)

  for (const entry of plan) {
    console.log(`${entry._id}: "${entry.from}" -> creditsPrefix "${entry.prefix}" + credits "${entry.name}"`)
  }
  if (!plan.length) {
    console.log('Nothing to split.')
    return
  }
  if (!APPLY) {
    console.log(`\nDry run — ${plan.length} document(s) would change. Re-run with --apply.`)
    return
  }

  let tx = client.transaction()
  for (const entry of plan) {
    tx = tx.patch(entry._id, (patch) =>
      patch.set({ 'footer.creditsPrefix': entry.prefix, 'footer.credits': entry.name }),
    )
  }
  await tx.commit()

  const after = await client.fetch<Homepage[]>('*[_type == "homepage"]{_id, footer}')
  console.log('\nAfter:', JSON.stringify(after.map((d) => d.footer), null, 2))
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
