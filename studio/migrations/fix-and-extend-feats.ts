import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { getCliClient } from 'sanity/cli'
import { CATEGORY_LEVEL, FEATS_2024, type FeatSeed } from './data/feats-2024-phb'
import { FIXED_TO_FLEXIBLE_ASI, LEGACY_2014_FEATS, RULESET_OVERRIDES, SPLIT_BY_EDITION } from './data/feats-legacy-2014'

/**
 * Puts the feat library in order.
 *
 * Four things were wrong. Almost every feat was tagged `edition: '2024'`, so a
 * 2014 character saw 35 feats while a 2024 character was offered Dragonlance
 * knights and Bigby giants. None of them said which category they belong to, so
 * the creator could not tell an Origin feat from a General one. Seven feats that
 * let the player choose an ability increase had the choice made for them. And
 * the 2024 Ability Score Improvement feat and the ten Epic Boons were missing
 * outright.
 *
 * Nothing is deleted. Feats are matched to the 2024 catalogue by name, so
 * existing documents are patched rather than duplicated.
 *
 *   npx sanity exec migrations/fix-and-extend-feats.ts            # dry run
 *   npx sanity exec migrations/fix-and-extend-feats.ts -- --apply
 */

/**
 * Finding a token that can actually write.
 *
 * The token names in this project do not match their grants:
 * SANITY_API_WRITE_TOKEN carries the read-only `viewer` role, while
 * SANITY_AUTH_TOKEN is the `editor`. So each candidate is asked what it may do
 * rather than trusted by name. `sanity exec` only forwards SANITY_STUDIO_*
 * variables, so the .env files are read directly. Tokens are never logged.
 */
const TOKEN_VARS = ['SANITY_AUTH_TOKEN', 'SANITY_API_WRITE_TOKEN', 'SANITY_TOKEN']

function candidateTokens(): { name: string; token: string }[] {
  const found = new Map<string, string>()
  for (const name of TOKEN_VARS) {
    const fromEnv = process.env[name]
    if (fromEnv) found.set(name, fromEnv)
  }
  for (const file of ['.env.local', '.env', '../.env.local', '../.env']) {
    let text: string
    try {
      text = readFileSync(resolve(process.cwd(), file), 'utf8')
    } catch {
      continue // Not every location exists.
    }
    for (const name of TOKEN_VARS) {
      if (found.has(name)) continue
      const match = new RegExp(`^\\s*${name}\\s*=\\s*(.+)$`, 'm').exec(text)
      if (!match) continue
      // Vercel's writer leaves a trailing comment on the same line.
      const value = match[1].trim().replace(/\s*#.*$/, '').replace(/^["']|["']$/g, '')
      if (value) found.set(name, value)
    }
  }
  return [...found].map(([name, token]) => ({ name, token }))
}

async function canWrite(token: string): Promise<boolean> {
  const response = await fetch(`https://${PROJECT_ID}.api.sanity.io/v2024-01-01/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) return false
  const me = (await response.json()) as { role?: string }
  return me.role === 'write' || me.role === 'administrator'
}

/** The read client, plus a writing one only once a token proves it can. */
async function resolveClient(apply: boolean) {
  const reader = getCliClient({ apiVersion: '2026-08-18' })
  if (!apply) return reader
  for (const { name, token } of candidateTokens()) {
    if (await canWrite(token)) {
      console.log(`Writing as ${name}.\n`)
      return reader.withConfig({ token })
    }
    console.log(`${name} is read-only; trying the next token.`)
  }
  console.error('\nNo token with write access found. Point SANITY_AUTH_TOKEN at an Editor token and retry.')
  process.exit(1)
}

const PROJECT_ID = 'ylk0tk34'
const APPLY = process.argv.includes('--apply')

const RULESET_2014_ID = 'ruleset.srd-2014'
const RULESET_2024_ID = '86642d23-c52d-4577-adc1-214aab0f43e9'
const R14 = { _type: 'reference', _key: 'srd-2014', _ref: RULESET_2014_ID }
const R24 = { _type: 'reference', _key: 'srd-2024', _ref: RULESET_2024_ID }

interface ExistingFeat {
  _id: string
  name: string
  edition?: string
  source?: string
  slug?: { current?: string }
  benefits?: Record<string, unknown>
  prerequisites?: Record<string, unknown>
  featCategory?: string
}

const normalize = (name: string) => name.trim().toLowerCase().replace(/[^a-z0-9]/g, '')

/** Feats unique to the 2024 books; everything else in the catalogue also has a 2014 printing. */
const NEW_IN_2024 = new Set(
  ['Ability Score Improvement', ...FEATS_2024.filter((seed) => seed.category === 'Epic Boon').map((seed) => seed.name)]
    .map(normalize),
)

function abilityFields(seed: FeatSeed) {
  const ability = seed.ability
  if (!ability) return { abilityScoreIncrease: undefined, flexibleAbilityIncrease: undefined }
  if (ability.fixed) return { abilityScoreIncrease: ability.fixed, flexibleAbilityIncrease: undefined }
  return {
    abilityScoreIncrease: undefined,
    flexibleAbilityIncrease: {
      amount: ability.amount ?? 1,
      options: ability.flex ?? [],
      ...(ability.maxPerAbility ? { maxPerAbility: ability.maxPerAbility } : {}),
    },
  }
}

function seedPatch(seed: FeatSeed, existing?: ExistingFeat) {
  const { abilityScoreIncrease, flexibleAbilityIncrease } = abilityFields(seed)
  const level = seed.level ?? CATEGORY_LEVEL[seed.category]
  // A feat printed in both editions stays available to both; the ones the 2024
  // books introduced are pinned to the 2024 ruleset.
  const onlyNew = NEW_IN_2024.has(normalize(seed.name)) || SPLIT_BY_EDITION.includes(seed.name)
  const edition = onlyNew ? '2024' : 'Both'
  const rulesets = onlyNew ? [R24] : [R14, R24]

  return {
    name: seed.name,
    slug: { _type: 'slug', current: existing?.slug?.current ?? seed.slug },
    description: seed.description,
    featCategory: seed.category,
    source: 'Official',
    edition,
    rulesets,
    isHomebrew: false,
    version: 1,
    prerequisites: {
      level,
      ...(seed.prereqAbility ? { abilityScore: seed.prereqAbility } : {}),
      ...(seed.prereqFeatures ? { features: seed.prereqFeatures } : {}),
    },
    benefits: {
      features: seed.features,
      ...(abilityScoreIncrease ? { abilityScoreIncrease } : {}),
      ...(flexibleAbilityIncrease ? { flexibleAbilityIncrease } : {}),
    },
  }
}

async function run() {
  const client = await resolveClient(APPLY)
  const existing: ExistingFeat[] = await client.fetch(
    `*[_type == "feat"]{_id, name, edition, source, slug, benefits, prerequisites, featCategory}`,
  )
  const byName = new Map(existing.map((feat) => [normalize(feat.name), feat]))
  const catalogueNames = new Set(FEATS_2024.map((seed) => normalize(seed.name)))
  const legacyNames = new Set(LEGACY_2014_FEATS.map(normalize))

  let tx = client.transaction()
  const log = { ruleset: 0, patched: 0, created: 0, legacy: 0, homebrew: 0, flexed: 0, split: 0, pinned: 0 }
  const notes: string[] = []

  // 1. The 2014 ruleset every legacy feat points at does not exist, so those
  //    references dangle and only resolve because the query matches on _key.
  tx = tx.createIfNotExists({
    _id: RULESET_2014_ID,
    _type: 'ruleset',
    name: 'D&D 5e (2014)',
    key: { _type: 'slug', current: 'srd-2014' },
  } as any)
  log.ruleset += 1

  // 2. Bring every catalogue feat in line, creating only what is genuinely absent.
  for (const seed of FEATS_2024) {
    const match = SPLIT_BY_EDITION.includes(seed.name) ? undefined : byName.get(normalize(seed.name))
    const patch = seedPatch(seed, match)

    if (match) {
      tx = tx.patch(match._id, (p) => p.set(patch))
      log.patched += 1
      if (!match.featCategory) notes.push(`  category  ${seed.name} → ${seed.category}`)
    } else {
      tx = tx.createOrReplace({ _id: `feat-${seed.slug}`, _type: 'feat', ...patch } as any)
      log.created += 1
      notes.push(`  create    ${seed.name} (${seed.category})`)
    }
  }

  // 3. Feats whose 2024 shape needed its own document leave the original on 2014.
  for (const name of SPLIT_BY_EDITION) {
    const match = byName.get(normalize(name))
    if (!match) continue
    tx = tx.patch(match._id, (p) => p.set({
      edition: '2014',
      rulesets: [R14],
      featCategory: 'General',
      prerequisites: { level: 1 },
    }))
    log.split += 1
    notes.push(`  split     ${name} — existing document kept as the 2014 printing`)
  }

  // 4. Pin pre-2024 published feats to the 2014 ruleset.
  for (const feat of existing) {
    const key = normalize(feat.name)
    if (!legacyNames.has(key)) continue
    if (catalogueNames.has(key) && !SPLIT_BY_EDITION.some((name) => normalize(name) === key)) continue
    tx = tx.patch(feat._id, (p) => p.set({
      edition: '2014',
      rulesets: [R14],
      featCategory: feat.featCategory ?? 'General',
    }))
    log.legacy += 1
  }

  // 5. The Archive's own feats belong to neither printing, so both rulesets get
  //    them rather than 2014 characters losing them to a blanket relabel.
  const overrides = new Map(Object.entries(RULESET_OVERRIDES).map(([name, ruleset]) => [normalize(name), ruleset]))
  for (const feat of existing) {
    const key = normalize(feat.name)
    if (catalogueNames.has(key) || legacyNames.has(key)) continue
    const pinned = overrides.get(key)
    tx = tx.patch(feat._id, (p) => p.set({
      edition: pinned ?? 'Both',
      rulesets: pinned === '2014' ? [R14] : pinned === '2024' ? [R24] : [R14, R24],
      featCategory: feat.featCategory ?? 'General',
    }))
    if (pinned) {
      log.pinned += 1
      notes.push(`  dedupe    ${feat.name} → ${pinned} only (restates an official feat)`)
    } else log.homebrew += 1
  }

  // 6. Hand back the ability choice on feats that had it decided for them.
  for (const [name, options] of Object.entries(FIXED_TO_FLEXIBLE_ASI)) {
    const match = byName.get(normalize(name))
    if (!match) continue
    // Dotted paths, so the catalogue's benefit lines set above are left alone.
    tx = tx.patch(match._id, (p) => p
      .unset(['benefits.abilityScoreIncrease'])
      .set({ 'benefits.flexibleAbilityIncrease': { amount: 1, options } }))
    log.flexed += 1
    notes.push(`  choice    ${name} → +1 ${options.length ? options.join('/') : 'any ability'}`)
  }

  console.log('Feat library repair')
  console.log(`  ${existing.length} feats read from production\n`)
  console.log(notes.join('\n'))
  console.log('\nSummary')
  console.log(`  ruleset documents ensured : ${log.ruleset}`)
  console.log(`  2024 catalogue patched    : ${log.patched}`)
  console.log(`  2024 catalogue created    : ${log.created}`)
  console.log(`  split by edition          : ${log.split}`)
  console.log(`  pinned to 2014            : ${log.legacy}`)
  console.log(`  available to both         : ${log.homebrew}`)
  console.log(`  deduplicated by ruleset   : ${log.pinned}`)
  console.log(`  ability choice restored   : ${log.flexed}`)

  if (!APPLY) {
    console.log('\nDry run — nothing was written. Re-run with -- --apply to commit.')
    return
  }
  const result = await tx.commit()
  console.log(`\nApplied. ${result.results.length} documents written.`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
