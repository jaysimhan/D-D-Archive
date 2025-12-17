import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local or .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

if (!process.env.SANITY_STUDIO_PROJECT_ID || !process.env.SANITY_STUDIO_DATASET || !process.env.SANITY_AUTH_TOKEN) {
    console.error('Missing required environment variables: SANITY_STUDIO_PROJECT_ID, SANITY_STUDIO_DATASET, SANITY_AUTH_TOKEN');
    process.exit(1);
}

const client = createClient({
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
    apiVersion: '2024-03-12', // use current date
    token: process.env.SANITY_AUTH_TOKEN,
    useCdn: false, // Always use fresh data for mutations
})

const DRY_RUN = process.argv.includes('--dry-run')
const TYPES_TO_CHECK = ['spell', 'subclass', 'item', 'feat']

// --- Levenshtein Distance Implementation ---
function getLevenshteinDistance(a: string, b: string): number {
    const matrix = []
    let i, j

    if (a.length == 0) return b.length
    if (b.length == 0) return a.length

    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i]
    }

    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j
    }

    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1]
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    Math.min(
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    )
                )
            }
        }
    }

    return matrix[b.length][a.length]
}

function getSimilarity(s1: string, s2: string): number {
    if (!s1 || !s2) return 0
    const longer = s1.length > s2.length ? s1 : s2
    if (longer.length == 0) return 1.0
    return (longer.length - getLevenshteinDistance(s1, s2)) / longer.length
}

// --- Merging Logic ---
function mergeDocuments(master: any, duplicate: any): any {
    const merged = { ...master }
    let patches: any = {}
    let hasChanges = false;

    for (const key of Object.keys(duplicate)) {
        // Skip system fields
        if (['_id', '_type', '_rev', '_createdAt', '_updatedAt'].includes(key)) continue

        const masterValue = master[key]
        const duplicateValue = duplicate[key]

        // If master is empty but duplicate has value, take it
        if ((masterValue === undefined || masterValue === null) && (duplicateValue !== undefined && duplicateValue !== null)) {
            merged[key] = duplicateValue
            patches[key] = duplicateValue
            hasChanges = true
            continue
        }

        // Special handling for Arrays (Union)
        if (Array.isArray(masterValue) && Array.isArray(duplicateValue)) {
            // Basic union for primitives or simple objects would be complex.
            // For simplicity in this script, we'll assume string arrays or just keeping master if populated.
            // Let's try to union strings/IDs if it's a string array.
            if (masterValue.length > 0 && typeof masterValue[0] === 'string') {
                const uniqueSet = new Set([...masterValue, ...duplicateValue])
                if (uniqueSet.size > masterValue.length) {
                    const newValue = Array.from(uniqueSet);
                    merged[key] = newValue
                    patches[key] = newValue
                    hasChanges = true
                }
            }
            // For object arrays (like Features), merging is too risky/complex automatically.
            // We keep Master's version unless Master is empty.
        }
    }
    return { merged, patches, hasChanges }
}

async function run() {
    console.log(`Starting deduplication process... (DRY RUN: ${DRY_RUN})`)

    for (const type of TYPES_TO_CHECK) {
        console.log(`\n--- Processing Type: ${type} ---`)
        const docs = await client.fetch(`*[_type == "${type}"]`)
        console.log(`Fetched ${docs.length} documents.`)

        const processedIds = new Set()
        const groups: { master: any, duplicates: any[], similarity: number, reason: string }[] = []

        for (let i = 0; i < docs.length; i++) {
            if (processedIds.has(docs[i]._id)) continue

            const currentDoc = docs[i]
            const currentName = currentDoc.name?.toLowerCase().trim()

            // Find matches for this doc
            const duplicates = []

            for (let j = i + 1; j < docs.length; j++) {
                if (processedIds.has(docs[j]._id)) continue

                const compareDoc = docs[j]
                const compareName = compareDoc.name?.toLowerCase().trim()

                // Check 1: Exact Name Match
                if (currentName === compareName) {
                    duplicates.push({ doc: compareDoc, similarity: 1.0, reason: 'Exact Name Match' })
                    processedIds.add(compareDoc._id)
                    continue
                }

                // Check 2: Similarity > 85%
                const similarity = getSimilarity(currentName, compareName)
                if (similarity > 0.85) {
                    duplicates.push({ doc: compareDoc, similarity: similarity, reason: `Similar Name (${(similarity * 100).toFixed(1)}%)` })
                    // Don't auto-add to processedIds for similarity check to allow finding best cluster, 
                    // but for simplicity in this script we will treat them as a group now.
                    processedIds.add(compareDoc._id)
                }
            }

            if (duplicates.length > 0) {
                processedIds.add(currentDoc._id)
                // Determine Master: Prefer one with most fields populated, or oldest
                const cluster = [currentDoc, ...duplicates.map(d => d.doc)]

                // Sort by number of keys (approximation of completeness) descending
                cluster.sort((a, b) => Object.keys(b).length - Object.keys(a).length)

                const master = cluster[0]
                const dups = cluster.slice(1)

                groups.push({
                    master,
                    duplicates: dups,
                    similarity: duplicates[0].similarity, // approx
                    reason: duplicates[0].reason
                })
            }
        }

        console.log(`Found ${groups.length} duplicate groups for ${type}.`)

        // Processing Groups
        let transaction = client.transaction()
        let operationCount = 0

        for (const group of groups) {
            console.log(`\nGroup: Master "${group.master.name}" (${group.master._id})`)

            for (const dup of group.duplicates) {
                console.log(`  - Duplicate: "${dup.name}" (${dup._id})`)

                // Merge Logic
                const { patches, hasChanges } = mergeDocuments(group.master, dup)

                if (hasChanges) {
                    console.log(`    Merges fields: ${Object.keys(patches).join(', ')}`)
                    if (!DRY_RUN) {
                        transaction.patch(group.master._id, (p: any) => p.set(patches))
                        operationCount++
                    }
                }

                if (!DRY_RUN) {
                    // Find documents referencing this duplicate
                    const references = await client.fetch(`*[references("${dup._id}")] { _id }`)
                    if (references.length > 0) {
                        console.log(`    Re-pointing ${references.length} references from ${dup._id} to ${group.master._id}`)
                        for (const ref of references) {
                            // We need to find *where* the reference is in the document.
                            // Since we can't easily know the path, we can try to do a robust replace of the string ID in the whole document?
                            // Sanity doesn't support "replace all references" easily in a single patch operation if paths vary.
                            // BUT, we can fetch the doc, find the paths, and patch them.
                            // For simplicity and performance in a migration script:
                            // We can use a stronger approach: client.fetch to get the full doc, traversal, then patch.
                            // Or, we can blindly patch common array fields if we know schema? No, that's brittle.

                            // Better approach: Use Sanity's "set" or "unset" logic isn't enough for nested arrays easily without paths.
                            // Let's do a fetch-and-patch for referencing docs.
                            const refDoc = await client.getDocument(ref._id)
                            if (!refDoc) continue

                            // Traverse and replace
                            const updateReference = (obj: any): boolean => {
                                let changed = false
                                if (Array.isArray(obj)) {
                                    for (let i = 0; i < obj.length; i++) {
                                        if (updateReference(obj[i])) changed = true
                                        // Handle direct array of references (weak or strong)
                                        if (obj[i]?._ref === dup._id) {
                                            obj[i]._ref = group.master._id
                                            changed = true
                                        }
                                        // Handle string references (if likely in this schema, e.g. ids array)
                                        if (typeof obj[i] === 'string' && obj[i] === dup._id) {
                                            obj[i] = group.master._id
                                            changed = true
                                        }
                                    }
                                } else if (typeof obj === 'object' && obj !== null) {
                                    for (const k in obj) {
                                        if (obj[k]?._ref === dup._id) {
                                            obj[k]._ref = group.master._id
                                            changed = true
                                        } else if (typeof obj[k] === 'string' && obj[k] === dup._id) {
                                            // Careful with just replacing strings, but for known ID formats it's likely safe-ish
                                            obj[k] = group.master._id
                                            changed = true
                                        } else {
                                            if (updateReference(obj[k])) changed = true
                                        }
                                    }
                                }
                                return changed
                            }

                            if (updateReference(refDoc)) {
                                // Commit reference update IMMEDIATELY to clear the link before deletion
                                await client.createOrReplace(refDoc)
                                console.log(`      Updated reference in ${refDoc._id}`)
                            }
                        }
                    }

                    transaction.delete(dup._id)
                    operationCount++
                } else {
                    console.log(`    [DRY RUN] Would update references and merge fields and DELETE ${dup._id}`)
                }

                // Batch Commit if pending operations exist
                if (!DRY_RUN && operationCount >= 20) {
                    console.log(`  Committing batch of ${operationCount} operations...`)
                    await transaction.commit()
                    transaction = client.transaction()
                    operationCount = 0
                }
            }
        }

        if (!DRY_RUN && operationCount > 0) {
            console.log(`Committing final transactions for ${type}...`)
            await transaction.commit()
            console.log(`Committed.`)
        }
    }

    console.log('\nDone.')
}

run()
