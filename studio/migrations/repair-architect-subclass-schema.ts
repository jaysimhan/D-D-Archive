import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-08-21' }).withConfig({ perspective: 'raw' })

async function run() {
  const current = await client.fetch<any>(`*[_id == "subclass-architect-of-ruin-asmodeus"][0]{isSpellcaster, spellcaster, spellcastingAbility, magicType, magicAbility}`)
  if (!current || !current.isSpellcaster || current.spellcaster !== 'third' || current.spellcastingAbility !== 'CHA') {
    throw new Error(`Refusing to repair an unexpected Architect record: ${JSON.stringify(current)}`)
  }
  await client.patch('subclass-architect-of-ruin-asmodeus').set({
    magicType: 'Third-caster spell progression',
    magicAbility: 'Charisma',
    magicDescription: 'Charisma-based spellcasting layered onto the Illrigger martial chassis.',
  }).unset(['spellcaster', 'spellcastingAbility']).commit({ visibility: 'sync' })
  const audit = await client.fetch<any>(`*[_id == "subclass-architect-of-ruin-asmodeus"][0]{isSpellcaster, spellcaster, spellcastingAbility, magicType, magicAbility}`)
  if (!audit.isSpellcaster || audit.spellcaster != null || audit.spellcastingAbility != null || audit.magicType !== 'Third-caster spell progression' || audit.magicAbility !== 'Charisma') {
    throw new Error(`Architect schema repair failed: ${JSON.stringify(audit)}`)
  }
  console.log(`Architect subclass schema normalized: ${JSON.stringify(audit)}`)
}

run().catch((error) => { console.error(error); process.exit(1) })
