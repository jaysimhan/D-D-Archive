import { getCliClient } from 'sanity/cli'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
const client = getCliClient({ apiVersion: '2024-01-01' })
const plan = JSON.parse(readFileSync(resolve(process.cwd(), '../tmp/edition-content-plan.json'), 'utf8'))
async function run() {
 console.log(`${plan.length} edition patches; existing duplicate documents are untouched.`)
 if (!process.argv.includes('--apply')) return
 for (let i = 0; i < plan.length; i += 25) {
  let transaction = client.transaction()
  for (const patch of plan.slice(i, i + 25)) transaction = transaction.patch(patch.id, p => p.ifRevisionId(patch.revision).set(patch.set))
  await transaction.commit()
 }
 console.log('Edition patches applied.')
}
run().catch(error => { console.error(error.message); process.exitCode = 1 })
