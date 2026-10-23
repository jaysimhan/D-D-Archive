# Edition content audit

## Applied to Sanity

The researched catalogue migration created 622 records: 439 items (245 magic, 194 mundane), 170 core class features, nine species traits, and four generic core species records. It updated 773 existing records: 338 spells, 224 subclasses, 79 items, 72 features, 22 feats, 21 backgrounds, 12 classes, and five species. Existing duplicate documents were preserved. An additional migration linked 26 explicit background feat grants to their existing feats. A final supplemental migration adds Mark of Storm and Greater Mark of Storm from the publisher’s public preview and links House Lyrandar Heir.

The core backgrounds already existed; their edition-specific descriptions, ability choices and granted feats were updated rather than creating duplicates. Core SRD spell coverage was already present; this pass corrected edition descriptions, mechanics and component flags and retained custom class spell-list links. Only source-verified identical content uses the shared toggle.

## Editor and application model

Shared fields are the baseline. `sameForBoth` enables “Both are the same (2014 and 2024)” after descriptions and mechanics have been checked. With it off, `rules2014` and `rules2024` override shared fields. Omitted fields inherit; arrays and objects replace the entire shared value. Empty arrays/text explicitly remove baseline values. Rulesets independently control availability.

Classes, races/species, spells, feats, items, backgrounds and linked features/traits support these fields. All 224 subclasses remain shared and available in both editions, without edition override fields. Core class features and progressions select by year. Queries resolve overrides before projecting fields and referenced documents, include namespaced IDs, and use edition-specific caches.

The sheet and creator receive resolved content. The creator uses background ability increases in 2024 and species increases in 2014, displays granted background feats, respects fixed Magic Initiate spell lists and calculates HP from the resulting Constitution. Resumed drafts refresh that background spell-list selection. Existing manually edited sheet text remains manual.

## Sources

- [Official SRD resources](https://www.dndbeyond.com/srd), SRD 5.1 and SRD 5.2.1; attribution is in Attributions.md.
- [2014 structured SRD data, pinned revision](https://github.com/5e-bits/5e-database/tree/bfd3db4bcc31699cce703b46feb9af3f0ff08999/src/2014/en).
- Spell JSON sources pinned in studio/migrations/sync-srd-spells.ts.
- [2024 backgrounds and Origin feats](https://www.dndbeyond.com/posts/1785-the-backgrounds-and-origin-feats-in-the-2024).
- [Publisher Dragonmark preview](https://www.dndbeyond.com/posts/2112-choose-your-dragonmark-28-new-feats-that-explore): original concise summaries for the two Storm feats.

Downloaded source PDFs, extracted lines, the pre-write snapshot, plans and verification receipts remain in tmp/edition-research. scripts/extract-edition-srd.py extracts source sections; scripts/prepare-catalogue-research.ts prepares the plan; studio/migrations/complete-researched-catalogue.ts applies revision-guarded updates. Do not rerun an applied plan: refresh the snapshot and inspect the next plan first. Supplemental background links are in studio/migrations/link-background-feats.ts and Storm feats in add-storm-dragonmarks.ts.

## Validation and limits

The application production build, edition-resolution tests, catalogue-plan checks, sheet combat and sheet-session QA pass. Sanity schema validation passed without errors or warnings. Live verification confirmed every field of all 1,395 main migration writes; edition queries returned 224 subclasses each, 484 items in 2014 and 463 in 2024, with class/background/spell differences checked. Supplemental background links were also verified.

The broader character-spells regression suite currently fails at its pre-existing expectation that Metamagic Adept is labelled 2014: the preserved catalogue record is labelled Both. It is not reported as passing.

This is not a complete audit of every published supplement. 540 existing records with populated descriptions have no verified replacement in the researched SRDs and were retained, not certified identical. Ten missing Dragonmark feats still affect eleven House backgrounds (the two Shadow houses share one feat). The machine-readable audit lists these records. Storm feat rules are represented in descriptions; their spell-list expansion and casting-ability choice are not yet automated. Other setting-specific feat choices and species lineage choices also require further structured automation.

Sanity data writes are live. Application and Studio changes are local and have not been deployed.
