import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-08-18' })
const APPLY = process.argv.includes('--apply')
const BATCH_SIZE = 100

type ClassDocument = { _id: string; name: string; slug: string | null }
type SubclassDocument = { _id: string; name: string; parentClassId: string | null; ref: string | null }

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

async function run() {
  const classes = await client.fetch<ClassDocument[]>(
    '*[_type == "class"]{_id, name, "slug": slug.current}',
  )
  if (!classes.length) throw new Error('No class documents found; refusing to run.')

  // Subclasses reference their parent by slug ("blood-hunter"), but fall back to the
  // normalized name so a class whose slug was never filled in still resolves.
  const classIds = new Map<string, string>()
  for (const { _id, name, slug } of classes) {
    if (slug) classIds.set(normalize(slug), _id)
    classIds.set(normalize(name), _id)
  }

  const subclasses = await client.fetch<SubclassDocument[]>(
    '*[_type == "subclass" && !(_id in path("drafts.**"))]{_id, name, parentClassId, "ref": parentClass._ref}',
  )

  const orphans: SubclassDocument[] = []
  const conflicts: Array<{ subclass: SubclassDocument; expected: string }> = []
  const pending: Array<{ subclass: SubclassDocument; classId: string }> = []

  for (const subclass of subclasses) {
    const classId = subclass.parentClassId ? classIds.get(normalize(subclass.parentClassId)) : undefined

    if (subclass.ref) {
      // Already linked: only report if the legacy id disagrees with the reference.
      if (classId && classId !== subclass.ref) conflicts.push({ subclass, expected: classId })
      continue
    }
    if (!classId) {
      orphans.push(subclass)
      continue
    }
    pending.push({ subclass, classId })
  }

  for (const { subclass, expected } of conflicts) {
    console.warn(`Conflict: ${subclass.name} (${subclass._id}) references ${subclass.ref} but parentClassId "${subclass.parentClassId}" resolves to ${expected}.`)
  }
  if (orphans.length) {
    for (const subclass of orphans) {
      console.error(`Unresolved: ${subclass.name} (${subclass._id}) has parentClassId ${JSON.stringify(subclass.parentClassId)}, which matches no class document.`)
    }
    throw new Error(`${orphans.length} subclass(es) could not be linked; fix them before applying.`)
  }

  const perClass = new Map<string, number>()
  for (const { classId } of pending) perClass.set(classId, (perClass.get(classId) || 0) + 1)
  for (const [classId, count] of Array.from(perClass).sort(([a], [b]) => a.localeCompare(b))) {
    console.log(`  ${classId}: ${count}`)
  }
  console.log(`${APPLY ? 'Linking' : 'Would link'} ${pending.length} of ${subclasses.length} subclasses (${subclasses.length - pending.length} already linked).`)

  let transaction = client.transaction()
  let batched = 0
  for (const { subclass, classId } of pending) {
    // parentClassId is left in place: queries in src/ still coalesce over both fields.
    transaction.patch(subclass._id, (patch) => patch.set({
      parentClass: { _type: 'reference', _ref: classId },
    }))
    batched += 1
    if (batched === BATCH_SIZE) {
      if (APPLY) await transaction.commit()
      transaction = client.transaction()
      batched = 0
    }
  }
  if (APPLY && batched > 0) await transaction.commit()

  console.log(APPLY ? 'Parent-class linking complete; parentClassId was preserved.' : 'Dry run complete; no data was changed.')
}

run().catch((error) => {
  console.error('Subclass parent-class migration failed:', error)
  process.exit(1)
})
