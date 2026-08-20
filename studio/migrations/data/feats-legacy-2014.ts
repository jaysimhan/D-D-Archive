/**
 * Feats that were published before the 2024 revision and not reprinted in the
 * 2024 Player's Handbook — Xanathar's, Tasha's, Fizban's, Bigby's, Strixhaven,
 * Dragonlance, Eberron, Planescape and the rest.
 *
 * Everything here is pinned to the 2014 ruleset. The Archive had them all
 * tagged `edition: '2024'`, which put Dragonlance knights and giant feats in
 * front of 2024 characters while leaving 2014 characters with almost nothing to
 * choose from.
 */
export const LEGACY_2014_FEATS = [
  'Aberrant Dragonmark',
  'Adept of the Black Robes',
  'Adept of the Red Robes',
  'Adept of the White Robes',
  'Agent of Order',
  'Artificer Initiate',
  'Baleful Scion',
  'Bountiful Luck',
  'Cartomancer',
  'Cohort of Chaos',
  'Cult of the Dragon Initiate',
  'Dragon Fear',
  'Dragon Hide',
  'Dragonscarred',
  'Drow High Magic',
  'Dungeon Delver',
  'Dwarven Fortitude',
  'Eldritch Adept',
  'Elven Accuracy',
  'Ember of the Fire Giant',
  'Fade Away',
  'Fey Teleportation',
  'Fighting Initiate',
  'Flames of Phlegethos',
  'Fury of the Frost Giant',
  'Genie Magic',
  'Gift of the Chromatic Dragon',
  'Gift of the Gem Dragon',
  'Gift of the Metallic Dragon',
  'Greater Aberrant Mark',
  'Guile of the Cloud Giant',
  'Gunner',
  'Infernal Constitution',
  'Initiate of High Sorcery',
  'Keenness of the Stone Giant',
  'Knight of the Crown',
  'Knight of the Rose',
  'Knight of the Sword',
  'Linguist',
  'Mark of Detection',
  'Martial Adept',
  'Metamagic Adept',
  'Mobile',
  'Orcish Fury',
  'Planar Wanderer',
  'Prodigy',
  'Revenant Blade',
  'Rune Shaper',
  'Scion of the Outer Planes',
  'Second Chance',
  'Soul of the Storm Giant',
  'Squat Nimbleness',
  'Squire of Solamnia',
  'Strike of the Giants',
  'Strixhaven Initiate (Lorehold)',
  'Strixhaven Initiate (Prismari)',
  'Strixhaven Initiate (Quandrix)',
  'Strixhaven Initiate (Silverquill)',
  'Strixhaven Initiate (Witherbloom)',
  'Svirfneblin Magic',
  'Tireless Reveler',
  'Vigor of the Hill Giant',
  'Wood Elf Magic',
]

/**
 * Fixed ability increases that should have been a choice. Each of these feats
 * lets the player pick, but the Archive had the pick already made for them —
 * mostly to Strength, which is wrong for all but Heavily Armored.
 */
export const FIXED_TO_FLEXIBLE_ASI: Record<string, string[]> = {
  Athlete: ['STR', 'DEX'],
  'Elven Accuracy': ['DEX', 'INT', 'WIS', 'CHA'],
  'Moderately Armored': ['STR', 'DEX'],
  Observant: ['INT', 'WIS'],
  // Resilient raises whichever score the player wants, then grants the matching
  // saving throw proficiency, so it takes the "any ability" empty list.
  Resilient: [],
  'Tavern Brawler': ['STR', 'CON'],
  Telekinetic: ['INT', 'WIS', 'CHA'],
}

/**
 * Feats whose 2024 shape differs enough from the 2014 printing that one
 * document cannot describe both. The 2024 version is created alongside, and the
 * existing document keeps the 2014 rules — the same split `Alert` already uses.
 */
export const SPLIT_BY_EDITION = ['Tavern Brawler']

/**
 * Unofficial feats that restate an official one under another name. Pinning
 * them to the ruleset the official version does not cover keeps both usable
 * without a 2014 character being offered the same feat twice — nothing is
 * deleted, so a merge remains a separate decision.
 */
export const RULESET_OVERRIDES: Record<string, '2014' | '2024'> = {
  // "Metamagic Initiate" is Tasha's "Metamagic Adept" renamed. Adept covers
  // 2014, so the Initiate wording is left to serve 2024.
  'Metamagic Initiate': '2024',
}
