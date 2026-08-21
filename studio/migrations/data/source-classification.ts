/**
 * Classification data for `link-source-labels.ts`.
 *
 * `source` is a three-value enum (Official | Unofficial | Homebrew) that the UI filters on;
 * see validateSource() in src/utils/data-validation.ts and searchSubclasses() in
 * src/utils/search-utils.ts. Book and publisher names had been written directly into that
 * field, which put official WotC content behind the "Unofficial" filter. The book name now
 * lives in `sourceBook`, leaving `source` free to mean what the filter expects:
 *
 *   Official    published by Wizards of the Coast
 *   Unofficial  third-party publishers, plus WotC playtest (Unearthed Arcana)
 *   Homebrew    created by a user of this site
 *
 * Entries marked NEEDS REVIEW below are the ones worth a second pair of eyes.
 */

export type SourceValue = 'Official' | 'Unofficial' | 'Homebrew'
export type Classification = { source: SourceValue; sourceBook?: string }

/**
 * Documents whose `source` already names its own book or publisher, so the mapping
 * is a lookup rather than a judgement. Keys are the exact strings found in the dataset.
 */
export const PUBLISHER_MAP: Record<string, Classification> = {
  // --- Wizards of the Coast ---
  'phb5e': { source: 'Official', sourceBook: "Player's Handbook" },
  "Dungeon Master's Guide": { source: 'Official', sourceBook: "Dungeon Master's Guide" },
  "Sword Coast Adventurer's Guide": { source: 'Official', sourceBook: "Sword Coast Adventurer's Guide" },
  'XGtE': { source: 'Official', sourceBook: "Xanathar's Guide to Everything" },
  "Xanathar's Guide to Everything": { source: 'Official', sourceBook: "Xanathar's Guide to Everything" },
  'TCoE': { source: 'Official', sourceBook: "Tasha's Cauldron of Everything" },
  "Tasha's Cauldron of Everything": { source: 'Official', sourceBook: "Tasha's Cauldron of Everything" },
  "Fizban's Treasury of Dragons": { source: 'Official', sourceBook: "Fizban's Treasury of Dragons" },
  "Explorer's Guide to Wildemount": { source: 'Official', sourceBook: "Explorer's Guide to Wildemount" },

  // --- WotC playtest: published by WotC but not released rules ---
  'Unearthed Arcana': { source: 'Unofficial', sourceBook: 'Unearthed Arcana' },

  // --- Third-party publishers ---
  'Adventures in Rokugan': { source: 'Unofficial', sourceBook: 'Adventures in Rokugan' },
  'Alligator Alley Entertainment': { source: 'Unofficial', sourceBook: 'Alligator Alley Entertainment' },
  'Braythe RPG': { source: 'Unofficial', sourceBook: 'Braythe RPG' },
  'Critical Role': { source: 'Unofficial', sourceBook: 'Critical Role' },
  'Cruor Games': { source: 'Unofficial', sourceBook: 'Cruor Games' },
  'Dream Realm Storytellers': { source: 'Unofficial', sourceBook: 'Dream Realm Storytellers' },
  'Esper Genesis Core Manual': { source: 'Unofficial', sourceBook: 'Esper Genesis Core Manual' },
  'Ghostfire Gaming': { source: 'Unofficial', sourceBook: 'Ghostfire Gaming' },
  'Haigo Dungeoncrafts': { source: 'Unofficial', sourceBook: 'Haigo Dungeoncrafts' },
  'Hit Point Press': { source: 'Unofficial', sourceBook: 'Hit Point Press' },
  'Kobold Press': { source: 'Unofficial', sourceBook: 'Kobold Press' },
  'Kobold Press / Mage Hand Press': { source: 'Unofficial', sourceBook: 'Kobold Press / Mage Hand Press' },
  'Lion Banner Games': { source: 'Unofficial', sourceBook: 'Lion Banner Games' },
  'Lone Colossus Games': { source: 'Unofficial', sourceBook: 'Lone Colossus Games' },
  'MCDM Productions': { source: 'Unofficial', sourceBook: 'MCDM Productions' },
  'Mage Hand Press': { source: 'Unofficial', sourceBook: 'Mage Hand Press' },
  "Sebastian Crowe's Guide to Drakkenheim": { source: 'Unofficial', sourceBook: "Sebastian Crowe's Guide to Drakkenheim" },
  'Sterling Vermin Adventuring Co.': { source: 'Unofficial', sourceBook: 'Sterling Vermin Adventuring Co.' },
  "The Ultimate Adventurer's Handbook": { source: 'Unofficial', sourceBook: "The Ultimate Adventurer's Handbook" },
  'This Mind of Mine': { source: 'Unofficial', sourceBook: 'This Mind of Mine' },
  "Valda's Spire of Secrets": { source: 'Unofficial', sourceBook: "Valda's Spire of Secrets" },
  'Vortex Verlag': { source: 'Unofficial', sourceBook: 'Vortex Verlag' },
}

/**
 * Documents marked `Unofficial` with no recorded provenance. The add-unofficial-*.ts
 * migrations blanket-tagged everything they inserted as Unofficial, which conflated
 * "not in the base SRD import" with "not published by WotC" — that is the bug being fixed.
 *
 * Only WotC titles are listed here; anything absent stays Unofficial. Name must match
 * the document `name` exactly.
 */
export const OFFICIAL_BY_NAME: Record<string, Record<string, string>> = {
  race: {
    'Astral Elf': 'Spelljammer: Adventures in Space',
    'Eladrin': 'Mordenkainen Presents: Monsters of the Multiverse',
    'Ghostwise Halfling': "Sword Coast Adventurer's Guide",
    'Giff': 'Spelljammer: Adventures in Space',
    'Githyanki': 'Mordenkainen Presents: Monsters of the Multiverse',
    'Githzerai': 'Mordenkainen Presents: Monsters of the Multiverse',
    'Grung': 'One Grung Above', // NEEDS REVIEW: WotC-published supplement, not a core book
    'Hadozee': 'Spelljammer: Adventures in Space',
    'Harengon': 'The Wild Beyond the Witchlight',
    'Kalashtar': 'Eberron: Rising from the Last War',
    'Kender': 'Dragonlance: Shadow of the Dragon Queen',
    'Kobold': 'Mordenkainen Presents: Monsters of the Multiverse',
    'Locathah': 'Locathah Rising',
    'Shifter (Longtooth)': 'Eberron: Rising from the Last War',
    'Shifter (Swiftstride)': 'Eberron: Rising from the Last War',
    'Shifter (Wildhunt)': 'Eberron: Rising from the Last War',
    'Simic Hybrid': "Guildmasters' Guide to Ravnica",
    'Vedalken': "Guildmasters' Guide to Ravnica",
    'Verdan': 'Acquisitions Incorporated',
  },

  background: {
    'Artisan': "Player's Handbook (2024)",
    'Astral Drifter': 'Spelljammer: Adventures in Space',
    'Athlete': "Player's Handbook (2024)",
    'Azorius Functionary': "Guildmasters' Guide to Ravnica",
    'Boros Legionnaire': "Guildmasters' Guide to Ravnica",
    "Celebrity Adventurer's Scion": 'Acquisitions Incorporated',
    'City Watch': "Sword Coast Adventurer's Guide",
    'Clan Crafter': "Sword Coast Adventurer's Guide",
    'Cloistered Scholar': "Sword Coast Adventurer's Guide",
    'Courtier': "Sword Coast Adventurer's Guide",
    'Dimir Operative': "Guildmasters' Guide to Ravnica",
    'Faceless': "Sword Coast Adventurer's Guide",
    'Failed Merchant': 'Keys from the Golden Vault',
    'Farmer': "Player's Handbook (2024)",
    'Feylost': 'The Wild Beyond the Witchlight',
    'Fisher': 'Ghosts of Saltmarsh',
    'Gambler': "Player's Handbook (2024)",
    'Gladiator': "Player's Handbook",
    'Golgari Agent': "Guildmasters' Guide to Ravnica",
    'Gruul Anarch': "Guildmasters' Guide to Ravnica",
    'Guard': "Player's Handbook (2024)",
    'Guide': "Player's Handbook (2024)",
    'House Agent': 'Eberron: Rising from the Last War',
    'Ice Fisher': 'Icewind Dale: Rime of the Frostmaiden',
    'Inheritor': "Sword Coast Adventurer's Guide",
    'Investigator': "Sword Coast Adventurer's Guide",
    'Izzet Engineer': "Guildmasters' Guide to Ravnica",
    'Knight of Solamnia': 'Dragonlance: Shadow of the Dragon Queen',
    'Knight of the Order': "Sword Coast Adventurer's Guide",
    'Lorehold Student': 'Strixhaven: A Curriculum of Chaos',
    'Mage of High Sorcery': 'Dragonlance: Shadow of the Dragon Queen',
    'Marine': 'Ghosts of Saltmarsh',
    'Merchant': "Player's Handbook (2024)",
    'Orzhov Representative': "Guildmasters' Guide to Ravnica",
    'Prismari Student': 'Strixhaven: A Curriculum of Chaos',
    'Quandrix Student': 'Strixhaven: A Curriculum of Chaos',
    'Rakdos Cultist': "Guildmasters' Guide to Ravnica",
    'Rival Intern': 'Acquisitions Incorporated',
    'Ruined': 'Acquisitions Incorporated',
    'Scribe': "Player's Handbook (2024)",
    'Selesnya Initiate': "Guildmasters' Guide to Ravnica",
    'Shipwright': 'Ghosts of Saltmarsh',
    'Silverquill Student': 'Strixhaven: A Curriculum of Chaos',
    'Simic Scientist': "Guildmasters' Guide to Ravnica",
    'Smuggler': 'Ghosts of Saltmarsh',
    'Uthgardt Tribe Member': "Sword Coast Adventurer's Guide",
    'Waterdhavian Noble': "Sword Coast Adventurer's Guide",
    'Wayfarer': "Player's Handbook (2024)",
    'Wildspacer': 'Spelljammer: Adventures in Space',
    'Witchlight Hand': 'The Wild Beyond the Witchlight',
  },

  feat: {
    'Aberrant Dragonmark': 'Eberron: Rising from the Last War',
    'Adept of the Black Robes': 'Dragonlance: Shadow of the Dragon Queen',
    'Adept of the Red Robes': 'Dragonlance: Shadow of the Dragon Queen',
    'Adept of the White Robes': 'Dragonlance: Shadow of the Dragon Queen',
    'Agent of Order': 'Planescape: Adventures in the Multiverse',
    'Artificer Initiate': "Tasha's Cauldron of Everything",
    'Bountiful Luck': "Xanathar's Guide to Everything",
    'Cohort of Chaos': 'Planescape: Adventures in the Multiverse',
    'Dragon Fear': "Xanathar's Guide to Everything",
    'Dragon Hide': "Xanathar's Guide to Everything",
    'Drow High Magic': "Xanathar's Guide to Everything",
    'Dungeon Delver': "Player's Handbook",
    'Dwarven Fortitude': "Xanathar's Guide to Everything",
    'Eldritch Adept': "Tasha's Cauldron of Everything",
    'Ember of the Fire Giant': "Bigby Presents: Glory of the Giants",
    'Fade Away': "Xanathar's Guide to Everything",
    'Fey Teleportation': "Xanathar's Guide to Everything",
    'Fighting Initiate': "Tasha's Cauldron of Everything",
    'Flames of Phlegethos': "Xanathar's Guide to Everything",
    'Fury of the Frost Giant': "Bigby Presents: Glory of the Giants",
    'Gift of the Chromatic Dragon': "Fizban's Treasury of Dragons",
    'Gift of the Gem Dragon': "Fizban's Treasury of Dragons",
    'Gift of the Metallic Dragon': "Fizban's Treasury of Dragons",
    'Guile of the Cloud Giant': "Bigby Presents: Glory of the Giants",
    'Gunner': "Tasha's Cauldron of Everything",
    'Infernal Constitution': "Xanathar's Guide to Everything",
    'Initiate of High Sorcery': 'Dragonlance: Shadow of the Dragon Queen',
    'Keenness of the Stone Giant': "Bigby Presents: Glory of the Giants",
    'Knight of the Crown': 'Dragonlance: Shadow of the Dragon Queen',
    'Knight of the Rose': 'Dragonlance: Shadow of the Dragon Queen',
    'Knight of the Sword': 'Dragonlance: Shadow of the Dragon Queen',
    'Linguist': "Player's Handbook",
    'Mark of Detection': 'Eberron: Rising from the Last War',
    'Martial Adept': "Player's Handbook",
    'Metamagic Initiate': "Tasha's Cauldron of Everything",
    'Orcish Fury': "Xanathar's Guide to Everything",
    'Outlands Envoy': 'Planescape: Adventures in the Multiverse',
    'Planar Wanderer': 'Planescape: Adventures in the Multiverse',
    'Prodigy': "Xanathar's Guide to Everything",
    'Revenant Blade': 'Eberron: Rising from the Last War',
    'Scion of the Outer Planes': 'Planescape: Adventures in the Multiverse',
    'Second Chance': "Xanathar's Guide to Everything",
    'Soul of the Storm Giant': "Bigby Presents: Glory of the Giants",
    'Squat Nimbleness': "Xanathar's Guide to Everything",
    'Squire of Solamnia': 'Dragonlance: Shadow of the Dragon Queen',
    'Strike of the Giants': "Bigby Presents: Glory of the Giants",
    'Svirfneblin Magic': "Xanathar's Guide to Everything",
    'Vigor of the Hill Giant': "Bigby Presents: Glory of the Giants",
    'Wood Elf Magic': "Xanathar's Guide to Everything",
  },

  spell: {
    'Intellect Fortress': "Tasha's Cauldron of Everything",
    "Tasha's Caustic Brew": "Tasha's Cauldron of Everything",
  },

  subclass: {
    'Bladesinging': "Sword Coast Adventurer's Guide",
    'Oath of Glory': 'Mythic Odysseys of Theros',
    'Oath of the Watchers': "Tasha's Cauldron of Everything",
    'Phantom': "Tasha's Cauldron of Everything",
    'Psi Warrior': "Tasha's Cauldron of Everything",
    'Rune Knight': "Tasha's Cauldron of Everything",
    'Soulknife': "Tasha's Cauldron of Everything",
    'Twilight Domain': "Tasha's Cauldron of Everything",
    'Way of the Astral Self': "Tasha's Cauldron of Everything",
  },
}

/**
 * Third-party content whose publisher is known well enough to record, even though the
 * document never carried it. Improves attribution; does not change `source`.
 */
export const THIRD_PARTY_BOOK_BY_NAME: Record<string, Record<string, string>> = {
  race: {
    'Bearfolk': 'Kobold Press', 'Dara': 'Kobold Press', 'Darakhul': 'Kobold Press',
    'Erina': 'Kobold Press', 'Ratatosk': 'Kobold Press', 'Satarre': 'Kobold Press',
    'Cervan': 'Humblewood', 'Gallus': 'Humblewood', 'Hedge': 'Humblewood',
    'Jerbeen': 'Humblewood', 'Luma': 'Humblewood', 'Mapach': 'Humblewood',
  },
}

/**
 * Names that are ambiguous enough to be worth confirming against the book before trusting.
 * Listing a name here does not change its handling; it only surfaces it in the dry run.
 */
export const NEEDS_REVIEW: Array<[string, string, string]> = [
  ['race', 'Grung', 'WotC-published ("One Grung Above") but not from a core rulebook.'],
  ['race', 'Shade', 'Treated as third-party; a Forgotten Realms Shade PC race is not in a WotC 5e book.'],
  ['race', 'Vanara', 'Treated as third-party; originates outside WotC 5e.'],
  ['race', 'Merrow (Lorwyn)', 'Lorwyn has no official WotC 5e release; treated as third-party conversion.'],
  ['race', 'Lorwyn-Shadowmoor Elf', 'Lorwyn has no official WotC 5e release; treated as third-party conversion.'],
  ['background', 'Carouser', 'Not matched to a WotC book; left Unofficial.'],
  ['background', 'Flaming Fist Mercenary', 'Baldur\'s Gate flavour but not matched to a WotC background; left Unofficial.'],
  ['background', 'Harper', 'Faction background; the WotC equivalent is "Faction Agent". Left Unofficial.'],
  ['background', 'Inquisitive', 'Close to SCAG "Investigator", which is classified Official separately. Left Unofficial.'],
  ['background', 'Dragon Cultist', 'Not matched to a WotC book; left Unofficial.'],
  ['feat', 'Baleful Scion', 'Not matched to a WotC book; left Unofficial.'],
  ['feat', 'Genie Magic', 'Not matched to a WotC book; left Unofficial.'],
  ['feat', 'Greater Aberrant Mark', 'Eberron flavour but not matched to a WotC feat; left Unofficial.'],
]
