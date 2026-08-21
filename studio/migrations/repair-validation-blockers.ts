import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-08-21' }).withConfig({ perspective: 'raw' })
const APPLY = process.argv.includes('--apply')

type Trait = { _id: string; name: string; ownerTypes: string[] }
type Item = { _id: string; name: string; type?: string }

const ITEM_CATEGORIES = new Set(['Weapon', 'Armor', 'Potion', 'Gear', 'Tool', 'Wondrous Item', 'Ring', 'Rod', 'Staff', 'Wand', 'Scroll'])
const CLASS_SAVES: Record<string, string[]> = {
  'class-acolyte': ['DEX', 'WIS'],
  'class-animal-master': ['DEX', 'WIS'],
}

async function run() {
  const [traits, items] = await Promise.all([
    client.fetch<Trait[]>(`*[_type == "trait" && !defined(tags)]{
      _id, name,
      "ownerTypes": array::unique(*[_type in ["race", "class", "subclass", "background"] && references(^._id)]._type)
    }`),
    client.fetch<Item[]>('*[_type == "item" && !defined(itemCategory)]{_id, name, type}'),
  ])

  const traitPatches = traits.map((trait) => {
    const tags = trait.ownerTypes.length ? trait.ownerTypes : ['race']
    const invalid = tags.filter((tag) => !['race', 'class', 'subclass', 'background'].includes(tag))
    if (invalid.length) throw new Error(`${trait._id} has unsupported owner types: ${invalid.join(', ')}`)
    return { _id: trait._id, tags }
  })

  const itemPatches = items.map((item) => {
    const itemCategory = item.type === 'Adventuring Gear' ? 'Gear' : item.type
    if (!itemCategory || !ITEM_CATEGORIES.has(itemCategory)) {
      throw new Error(`${item._id} (${item.name}) has no valid category source; legacy type is ${JSON.stringify(item.type)}`)
    }
    return { _id: item._id, itemCategory }
  })

  const invalidClasses = await client.fetch<Array<{ _id: string }>>('*[_type == "class" && count(savingThrows) < 2]{_id}')
  for (const { _id } of invalidClasses) {
    if (!CLASS_SAVES[_id]) throw new Error(`No saving-throw repair configured for ${_id}`)
  }

  console.log(`Validation repairs: ${traitPatches.length} trait tags, ${itemPatches.length} item categories, ${invalidClasses.length} class saving-throw arrays.`)
  if (!APPLY) return console.log('Dry run complete; add --apply to commit.')

  let tx = client.transaction()
  for (const { _id, tags } of traitPatches) tx = tx.patch(_id, (patch) => patch.set({ tags }))
  for (const { _id, itemCategory } of itemPatches) tx = tx.patch(_id, (patch) => patch.set({ itemCategory }))
  for (const { _id } of invalidClasses) tx = tx.patch(_id, (patch) => patch.set({ savingThrows: CLASS_SAVES[_id] }))
  await tx.commit({ visibility: 'sync' })

  const audit = await client.fetch<{
    missingTraitTags: number
    missingItemCategories: number
    invalidClassSavingThrows: number
  }>(`{
    "missingTraitTags": count(*[_type == "trait" && (!defined(tags) || count(tags) == 0)]),
    "missingItemCategories": count(*[_type == "item" && !defined(itemCategory)]),
    "invalidClassSavingThrows": count(*[_type == "class" && count(savingThrows) < 2])
  }`)
  if (Object.values(audit).some((count) => count !== 0)) {
    throw new Error(`Validation repair audit failed: ${JSON.stringify(audit)}`)
  }
  console.log(`Validation repair complete: ${JSON.stringify(audit)}`)
}

run().catch((error) => {
  console.error('Validation repair failed:', error)
  process.exit(1)
})
