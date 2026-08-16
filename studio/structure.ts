import { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('D&D Archive Studio')
    .items([
      S.listItem()
        .title('Active Campaigns')
        .child(
          S.documentTypeList('campaign')
            .title('Active Campaigns')
        ),
      S.listItem()
        .title('Player Characters')
        .child(
          S.documentTypeList('character')
            .title('Player Characters')
        ),
      S.divider(),
      S.listItem()
        .title('Rules 2024 (SRD 5.2)')
        .child(
          S.list()
            .title('Rules 2024 (SRD 5.2)')
            .items([
              S.listItem()
                .title('Classes')
                .child(
                  S.documentList()
                    .id('classes-2024')
                    .title('2024 Classes')
                    .filter('_type == "class" && ruleset->key.current == "srd-2024"')
                ),
              S.listItem()
                .title('Subclasses')
                .child(
                  S.documentList()
                    .id('subclasses-2024')
                    .title('2024 Subclasses')
                    .filter('_type == "subclass" && ruleset->key.current == "srd-2024"')
                ),
              S.listItem()
                .title('Features')
                .child(
                  S.documentList()
                    .id('features-2024')
                    .title('2024 Features')
                    .filter('_type == "feature" && ruleset->key.current == "srd-2024"')
                ),
              S.listItem()
                .title('Spells')
                .child(
                  S.documentList()
                    .id('spells-2024')
                    .title('2024 Spells')
                    .filter('_type == "spell" && ruleset->key.current == "srd-2024"')
                ),
              S.listItem()
                .title('Items')
                .child(
                  S.documentList()
                    .id('items-2024')
                    .title('2024 Items')
                    .filter('_type == "item" && ruleset->key.current == "srd-2024"')
                ),
              S.listItem()
                .title('Feats')
                .child(
                  S.documentList()
                    .id('feats-2024')
                    .title('2024 Feats')
                    .filter('_type == "feat" && ruleset->key.current == "srd-2024"')
                ),
              S.listItem()
                .title('Backgrounds')
                .child(
                  S.documentList()
                    .id('backgrounds-2024')
                    .title('2024 Backgrounds')
                    .filter('_type == "background" && ruleset->key.current == "srd-2024"')
                ),
              S.listItem()
                .title('Species')
                .child(
                  S.documentList()
                    .id('species-2024')
                    .title('2024 Species')
                    .filter('_type == "species" && ruleset->key.current == "srd-2024"')
                ),
            ])
        ),
      S.listItem()
        .title('Rules 2014 (SRD 5.1)')
        .child(
          S.list()
            .title('Rules 2014 (SRD 5.1)')
            .items([
              S.listItem()
                .title('Classes')
                .child(
                  S.documentList()
                    .id('classes-2014')
                    .title('2014 Classes')
                    .filter('_type == "class" && ruleset->key.current == "srd-2014"')
                ),
              S.listItem()
                .title('Subclasses')
                .child(
                  S.documentList()
                    .id('subclasses-2014')
                    .title('2014 Subclasses')
                    .filter('_type == "subclass" && ruleset->key.current == "srd-2014"')
                ),
              S.listItem()
                .title('Spells')
                .child(
                  S.documentList()
                    .id('spells-2014')
                    .title('2014 Spells')
                    .filter('_type == "spell" && ruleset->key.current == "srd-2014"')
                ),
              S.listItem()
                .title('Items')
                .child(
                  S.documentList()
                    .id('items-2014')
                    .title('2014 Items')
                    .filter('_type == "item" && ruleset->key.current == "srd-2014"')
                ),
              S.listItem()
                .title('Feats')
                .child(
                  S.documentList()
                    .id('feats-2014')
                    .title('2014 Feats')
                    .filter('_type == "feat" && ruleset->key.current == "srd-2014"')
                ),
              S.listItem()
                .title('Backgrounds')
                .child(
                  S.documentList()
                    .id('backgrounds-2014')
                    .title('2014 Backgrounds')
                    .filter('_type == "background" && ruleset->key.current == "srd-2014"')
                ),
              S.listItem()
                .title('Races (Legacy)')
                .child(
                  S.documentList()
                    .id('races-2014')
                    .title('2014 Races')
                    .filter('_type == "race" && ruleset->key.current == "srd-2014"')
                ),
            ])
        ),
      S.divider(),
      S.listItem()
        .title('All Content (Admin)')
        .child(
          S.list()
            .title('All Content Types')
            .items([
              ...S.documentTypeListItems()
            ])
        ),
    ])
