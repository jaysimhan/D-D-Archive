import {getCliClient} from 'sanity/cli'
import {writeFileSync} from 'node:fs'
import {resolve} from 'node:path'
const client=getCliClient({apiVersion:'2024-01-01'})
async function run(){
 const docs=await client.fetch(`*[_id in path("**") && !(_id in path("drafts.**")) && _type in ["item","species","race","spell","feat","background","class","subclass","feature","trait","ruleset","magicSchool","weaponMastery"]]`)
 writeFileSync(resolve(process.cwd(),'../tmp/edition-research/live-before.json'),JSON.stringify(docs,null,2))
 console.log(`Snapshot includes ${docs.length} documents, including namespaced IDs.`)
}
run().catch(error=>{console.error(error.message);process.exitCode=1})
