import { StructureResolver } from 'sanity/structure'

const RULE_CONTENT = [
  { title: 'Classes', types: ['class'] },
  { title: 'Subclasses', types: ['subclass'] },
  { title: 'Ancestries (Races & Species)', types: ['race', 'species'] },
  { title: 'Backgrounds', types: ['background'] },
  { title: 'Feats', types: ['feat'] },
  { title: 'Spells', types: ['spell'] },
  { title: 'Items', types: ['item'] },
  { title: 'Features', types: ['feature'] },
  { title: 'Traits', types: ['trait'] },
  { title: 'Monsters', types: ['monster'] },
  { title: 'Magic Schools', types: ['magicSchool'] },
  { title: 'Weapon Properties', types: ['weaponProperty'] },
  { title: 'Weapon Masteries', types: ['weaponMastery'] },
]

function contentFilter(types: string[], key: 'srd-2014' | 'srd-2024') {
  const edition = key === 'srd-2014' ? '2014' : '2024'
  return `_type in [${types.map((type) => `"${type}"`).join(', ')}] && (` +
    `(defined(rulesets[0]) && "${key}" in rulesets[]->key.current) || ` +
    `(!defined(rulesets[0]) && defined(ruleset) && ruleset->key.current == "${key}") || ` +
    `(!defined(rulesets[0]) && !defined(ruleset) && (edition == "${edition}" || edition in ["Both", "5e"]))` +
    `)`
}

export const structure: StructureResolver = (S) => {
  const rulesetSection = (title: string, key: 'srd-2014' | 'srd-2024') =>
    S.listItem()
      .title(title)
      .child(
        S.list()
          .title(title)
          .items(
            RULE_CONTENT.map(({ title: contentTitle, types }) =>
              S.listItem()
                .title(contentTitle)
                .child(
                  S.documentList()
                    .id(`${types.join('-')}-${key}`)
                    .title(`${title}: ${contentTitle}`)
                    .filter(contentFilter(types, key)),
                ),
            ),
          ),
      )

  return S.list()
    .title('D&D Archive Studio')
    .items([
      S.listItem()
        .title('Active Campaigns')
        .child(S.documentTypeList('campaign').title('Active Campaigns')),
      S.listItem()
        .title('Player Characters')
        .child(S.documentTypeList('character').title('Player Characters')),
      S.divider(),
      rulesetSection('Rules 2024 (SRD 5.2)', 'srd-2024'),
      rulesetSection('Rules 2014 (SRD 5.1)', 'srd-2014'),
      S.divider(),
      S.listItem()
        .title('All Content (Admin)')
        .child(S.list().title('All Content Types').items(S.documentTypeListItems())),
    ])
}
