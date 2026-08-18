import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-08-18' })
const APPLY = process.argv.includes('--apply')
const R14 = { _type: 'reference', _key: 'srd-2014', _ref: 'ruleset.srd-2014' }
const R24 = { _type: 'reference', _key: 'srd-2024', _ref: '86642d23-c52d-4577-adc1-214aab0f43e9' }

async function run() {
  let tx = client.transaction()
  tx = tx.patch('feat-alert', (patch) => patch.set({
    name: 'Alert', slug: { _type: 'slug', current: 'feat-alert' }, source: 'Official', edition: '2014',
    rulesets: [R14], isHomebrew: false,
    description: 'Always on the lookout for danger, you gain a +5 bonus to initiative, cannot be surprised while conscious, and unseen attackers do not gain advantage against you merely for being unseen.',
    benefits: { features: ["Can't be surprised while conscious", '+5 bonus to initiative', 'No advantage for unseen attackers'] },
  }))
  tx = tx.createOrReplace({
    _id: 'feat-alert-2024', _type: 'feat', name: 'Alert',
    slug: { _type: 'slug', current: 'alert-2024' }, source: 'Official', edition: '2024', version: 1,
    rulesets: [R24], isHomebrew: false,
    description: 'Add your Proficiency Bonus to Initiative. Immediately after rolling Initiative, you may swap it with one willing, non-incapacitated ally in the same combat.',
    benefits: { features: ['Add Proficiency Bonus to initiative', 'Initiative Swap with a willing ally'] },
  } as any)
  tx = tx.patch('feat-metamagic-adept', (patch) => patch.set({
    name: 'Metamagic Adept', slug: { _type: 'slug', current: 'metamagic-adept' },
    source: 'Official', edition: '2014', rulesets: [R14], isHomebrew: false,
    description: 'Prerequisite: Spellcasting or Pact Magic. Learn two Metamagic options and gain 2 Sorcery Points. These points can be used only on Metamagic and return after a long rest.',
    prerequisites: { level: 1, features: ['Spellcasting or Pact Magic'] },
    benefits: { features: ['Choose 2 Metamagic options', '2 Sorcery Points (Metamagic only)', 'Sorcery Points return on a Long Rest'] },
    grants: [{
      _type: 'featureGrant', _key: 'metamagic-adept-points', grantType: 'Resource Pool',
      resourceName: 'Sorcery Points', maxAmount: 2, resetCondition: 'Long Rest',
    }],
  }))

  if (!APPLY) return console.log('Dry run: Alert 2014/2024 and Metamagic Adept repairs ready; add --apply.')
  const result = await tx.commit()
  console.log(`Applied Alert/Monk/Metamagic support data (${result.results.length} documents).`)
}

run().catch((error) => { console.error(error); process.exit(1) })
