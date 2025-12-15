// GROQ queries for fetching D&D data from Sanity

// ===== CLASSES =====
export const ALL_CLASSES_QUERY = `*[_type == "class"] | order(name asc) {
  "id": slug.current,
  name,
  description,
  image,
  source,
  edition,
  version,
  hitDie,
  primaryAbility,
  savingThrows,
  spellcaster,
  spellcastingAbility,
  features,
  traits[]->{name, description},
  subclasses
}`;

export const CLASS_BY_ID_QUERY = `*[_type == "class" && slug.current == $id][0] {
  "id": slug.current,
  name,
  description,
  image,
  source,
  edition,
  version,
  hitDie,
  primaryAbility,
  savingThrows,
  spellcaster,
  spellcastingAbility,
  features,
  traits[]->{name, description},
  subclasses
}`;

// ===== SUBCLASSES =====
export const ALL_SUBCLASSES_QUERY = `*[_type == "subclass"] | order(name asc) {
  "id": slug.current,
  parentClassId,
  name,
  description,
  image,
  source,
  edition,
  version,
  features,
  traits[]->{name, description}
}`;

export const SUBCLASSES_BY_CLASS_QUERY = `*[_type == "subclass" && parentClassId == $classId] | order(name asc) {
  "id": slug.current,
  parentClassId,
  name,
  description,
  image,
  source,
  edition,
  version,
  features,
  traits[]->{name, description}
}`;

// ===== RACES =====
export const ALL_RACES_QUERY = `*[_type == "race"] | order(name asc) {
  "id": slug.current,
  name,
  description,
  image,
  source,
  edition,
  version,
  abilityScoreIncrease,
  size,
  speed,
  traits[]->{name, description},
  languages,
  subraces,
  racialSpellChoices,
  racialKnownSpells
}`;

export const RACE_BY_ID_QUERY = `*[_type == "race" && slug.current == $id][0] {
  "id": slug.current,
  name,
  description,
  image,
  source,
  edition,
  version,
  abilityScoreIncrease,
  size,
  speed,
  traits[]->{name, description},
  languages,
  subraces,
  racialSpellChoices,
  racialKnownSpells
}`;

// ===== BACKGROUNDS =====
export const ALL_BACKGROUNDS_QUERY = `*[_type == "background"] | order(name asc) {
  "id": slug.current,
  name,
  description,
  image,
  source,
  edition,
  version,
  skillProficiencies,
  toolProficiencies,
  traits[]->{name, description},
  languages,
  equipment,
  feature
}`;

// ===== SPELLS =====
export const ALL_SPELLS_QUERY = `*[_type == "spell"] | order(name asc) {
  "id": slug.current,
  name,
  level,
  school,
  castingTime,
  range,
  components,
  duration,
  concentration,
  ritual,
  description,
  higherLevels,
  classes,
  image,
  source,
  edition,
  version
}`;

export const SPELLS_BY_CLASS_QUERY = `*[_type == "spell" && $classId in classes] | order(level asc, name asc) {
  "id": slug.current,
  name,
  level,
  school,
  castingTime,
  range,
  components,
  duration,
  concentration,
  ritual,
  description,
  higherLevels,
  classes,
  image,
  source,
  edition,
  version
}`;

export const SPELLS_BY_LEVEL_QUERY = `*[_type == "spell" && level == $level] | order(name asc) {
  "id": slug.current,
  name,
  level,
  school,
  castingTime,
  range,
  components,
  duration,
  concentration,
  ritual,
  description,
  higherLevels,
  classes,
  image,
  source,
  edition,
  version
}`;

// ===== FEATS =====
export const ALL_FEATS_QUERY = `*[_type == "feat"] | order(name asc) {
  "id": slug.current,
  name,
  description,
  image,
  source,
  edition,
  version,
  prerequisites,
  benefits
}`;

// ===== ITEMS =====
export const ALL_ITEMS_QUERY = `*[_type == "item"] | order(name asc) {
  "id": slug.current,
  name,
  type,
  description,
  image,
  magical,
  rarity,
  requiresAttunement,
  cost,
  weight,
  properties,
  source,
  edition,
  version
}`;

export const MAGIC_ITEMS_QUERY = `*[_type == "item" && magical == true] | order(name asc) {
  "id": slug.current,
  name,
  type,
  description,
  image,
  magical,
  rarity,
  requiresAttunement,
  cost,
  weight,
  properties,
  source,
  edition,
  version
}`;

// ===== MONSTERS =====
export const ALL_MONSTERS_QUERY = `*[_type == "monster"] | order(name asc) {
  "id": slug.current,
  name,
  size,
  type,
  alignment,
  armorClass,
  hitPoints,
  hitDice,
  speed,
  abilityScores,
  savingThrows,
  skills,
  damageResistances,
  damageImmunities,
  conditionImmunities,
  senses,
  languages,
  challengeRating,
  experiencePoints,
  traits,
  actions,
  legendaryActions,
  image,
  source,
  edition,
  version
}`;

