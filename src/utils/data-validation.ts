// Data Validation & Version Control System
import type {
  Race,
  Class,
  Spell,
  Item,
  Feat,
  Background,
  Subrace,
  Subclass,
  Edition,
  Source,
  AbilityScore,
  SpellSchool,
  ItemType,
  ItemRarity
} from "../types/dnd-types";

// ===== Validation Results =====

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: "error" | "warning";
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

// ===== Core Validation Functions =====

export function validateSource(source: any): source is Source {
  return ["Official", "Homebrew", "Unofficial"].includes(source);
}

export function validateEdition(edition: any): edition is Edition {
  return ["2014", "2024", "Both"].includes(edition);
}

export function validateAbilityScore(score: any): score is AbilityScore {
  return ["STR", "DEX", "CON", "INT", "WIS", "CHA"].includes(score);
}

export function validateSpellSchool(school: any): school is SpellSchool {
  return [
    "Abjuration",
    "Conjuration",
    "Divination",
    "Enchantment",
    "Evocation",
    "Illusion",
    "Necromancy",
    "Transmutation"
  ].includes(school);
}

export function validateItemType(type: any): type is ItemType {
  return [
    "Weapon",
    "Armor",
    "Potion",
    "Scroll",
    "Wondrous Item",
    "Ring",
    "Rod",
    "Staff",
    "Wand",
    "Adventuring Gear"
  ].includes(type);
}

export function validateItemRarity(rarity: any): rarity is ItemRarity {
  return ["Common", "Uncommon", "Rare", "Very Rare", "Legendary", "Artifact"].includes(rarity);
}

// ===== Entity Validation Functions =====

export function validateRace(race: any): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Required fields
  if (!race.id || typeof race.id !== "string") {
    errors.push({ field: "id", message: "ID is required and must be a string", severity: "error" });
  }

  if (!race.name || typeof race.name !== "string") {
    errors.push({ field: "name", message: "Name is required and must be a string", severity: "error" });
  }

  if (!race.description || typeof race.description !== "string") {
    errors.push({
      field: "description",
      message: "Description is required and must be a string",
      severity: "error"
    });
  }

  if (!validateSource(race.source)) {
    errors.push({
      field: "source",
      message: 'Source must be "Official", "Homebrew", or "Unofficial"',
      severity: "error"
    });
  }

  if (!validateEdition(race.edition)) {
    errors.push({
      field: "edition",
      message: 'Edition must be "2014", "2024", or "Both"',
      severity: "error"
    });
  }

  if (typeof race.version !== "number" || race.version < 1) {
    errors.push({
      field: "version",
      message: "Version must be a positive number",
      severity: "error"
    });
  }

  if (!["Tiny", "Small", "Medium", "Large"].includes(race.size)) {
    errors.push({
      field: "size",
      message: 'Size must be "Tiny", "Small", "Medium", or "Large"',
      severity: "error"
    });
  }

  if (typeof race.speed !== "number" || race.speed < 0) {
    errors.push({
      field: "speed",
      message: "Speed must be a non-negative number",
      severity: "error"
    });
  }

  // Warnings
  if (race.description && race.description.length < 50) {
    warnings.push({
      field: "description",
      message: "Description is quite short",
      suggestion: "Consider adding more detail to help players understand the race"
    });
  }

  if (!race.traits || race.traits.length === 0) {
    warnings.push({
      field: "traits",
      message: "No racial traits specified",
      suggestion: "Add at least one racial trait"
    });
  }

  if (!race.languages || race.languages.length === 0) {
    warnings.push({
      field: "languages",
      message: "No languages specified",
      suggestion: "Most races should know at least Common"
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

export function validateSpell(spell: any): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Required fields
  if (!spell.id || typeof spell.id !== "string") {
    errors.push({ field: "id", message: "ID is required and must be a string", severity: "error" });
  }

  if (!spell.name || typeof spell.name !== "string") {
    errors.push({ field: "name", message: "Name is required and must be a string", severity: "error" });
  }

  if (typeof spell.level !== "number" || spell.level < 0 || spell.level > 9) {
    errors.push({
      field: "level",
      message: "Level must be a number between 0 (cantrip) and 9",
      severity: "error"
    });
  }

  if (!validateSpellSchool(spell.school)) {
    errors.push({
      field: "school",
      message: "Invalid spell school",
      severity: "error"
    });
  }

  if (!spell.castingTime || typeof spell.castingTime !== "string") {
    errors.push({
      field: "castingTime",
      message: "Casting time is required",
      severity: "error"
    });
  }

  if (!spell.range || typeof spell.range !== "string") {
    errors.push({ field: "range", message: "Range is required", severity: "error" });
  }

  if (!spell.duration || typeof spell.duration !== "string") {
    errors.push({ field: "duration", message: "Duration is required", severity: "error" });
  }

  if (typeof spell.concentration !== "boolean") {
    errors.push({
      field: "concentration",
      message: "Concentration must be true or false",
      severity: "error"
    });
  }

  if (typeof spell.ritual !== "boolean") {
    errors.push({ field: "ritual", message: "Ritual must be true or false", severity: "error" });
  }

  if (!spell.description || typeof spell.description !== "string") {
    errors.push({
      field: "description",
      message: "Description is required",
      severity: "error"
    });
  }

  if (!validateSource(spell.source)) {
    errors.push({
      field: "source",
      message: 'Source must be "Official", "Homebrew", or "Unofficial"',
      severity: "error"
    });
  }

  if (!validateEdition(spell.edition)) {
    errors.push({
      field: "edition",
      message: 'Edition must be "2014", "2024", or "Both"',
      severity: "error"
    });
  }

  // Warnings
  if (!spell.classes || spell.classes.length === 0) {
    warnings.push({
      field: "classes",
      message: "No classes can cast this spell",
      suggestion: "Add at least one class to the spell's class list"
    });
  }

  if (spell.concentration && spell.duration === "Instantaneous") {
    warnings.push({
      field: "duration",
      message: "Concentration spells typically don't have instantaneous duration",
      suggestion: "Review the spell's mechanics"
    });
  }

  if (spell.level > 0 && !spell.higherLevels) {
    warnings.push({
      field: "higherLevels",
      message: "Consider adding description for casting at higher levels"
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

export function validateItem(item: any): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Required fields
  if (!item.id || typeof item.id !== "string") {
    errors.push({ field: "id", message: "ID is required and must be a string", severity: "error" });
  }

  if (!item.name || typeof item.name !== "string") {
    errors.push({ field: "name", message: "Name is required and must be a string", severity: "error" });
  }

  if (!validateItemType(item.type)) {
    errors.push({ field: "type", message: "Invalid item type", severity: "error" });
  }

  if (!item.description || typeof item.description !== "string") {
    errors.push({
      field: "description",
      message: "Description is required",
      severity: "error"
    });
  }

  if (typeof item.magical !== "boolean") {
    errors.push({
      field: "magical",
      message: "Magical must be true or false",
      severity: "error"
    });
  }

  if (typeof item.requiresAttunement !== "boolean") {
    errors.push({
      field: "requiresAttunement",
      message: "RequiresAttunement must be true or false",
      severity: "error"
    });
  }

  if (item.magical && item.rarity && !validateItemRarity(item.rarity)) {
    errors.push({
      field: "rarity",
      message: "Invalid item rarity",
      severity: "error"
    });
  }

  if (!validateSource(item.source)) {
    errors.push({
      field: "source",
      message: 'Source must be "Official", "Homebrew", or "Unofficial"',
      severity: "error"
    });
  }

  if (!validateEdition(item.edition)) {
    errors.push({
      field: "edition",
      message: 'Edition must be "2014", "2024", or "Both"',
      severity: "error"
    });
  }

  // Warnings
  if (item.magical && !item.rarity) {
    warnings.push({
      field: "rarity",
      message: "Magical items should have a rarity",
      suggestion: "Add a rarity (Common, Uncommon, Rare, etc.)"
    });
  }

  if (item.requiresAttunement && !item.magical) {
    warnings.push({
      field: "requiresAttunement",
      message: "Non-magical items typically don't require attunement",
      suggestion: "Review item properties"
    });
  }

  if (!item.cost && !item.magical) {
    warnings.push({
      field: "cost",
      message: "Non-magical items should have a cost",
      suggestion: "Add a cost in gold pieces"
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

export function validateClass(classData: any): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Required fields
  if (!classData.id || typeof classData.id !== "string") {
    errors.push({ field: "id", message: "ID is required and must be a string", severity: "error" });
  }

  if (!classData.name || typeof classData.name !== "string") {
    errors.push({ field: "name", message: "Name is required and must be a string", severity: "error" });
  }

  if (!classData.description || typeof classData.description !== "string") {
    errors.push({
      field: "description",
      message: "Description is required",
      severity: "error"
    });
  }

  if (![4, 6, 8, 10, 12].includes(classData.hitDie)) {
    errors.push({
      field: "hitDie",
      message: "Hit die must be 4, 6, 8, 10, or 12",
      severity: "error"
    });
  }

  if (!Array.isArray(classData.primaryAbility) || classData.primaryAbility.length === 0) {
    errors.push({
      field: "primaryAbility",
      message: "At least one primary ability is required",
      severity: "error"
    });
  }

  if (!Array.isArray(classData.savingThrows) || classData.savingThrows.length !== 2) {
    errors.push({
      field: "savingThrows",
      message: "Exactly two saving throw proficiencies are required",
      severity: "error"
    });
  }

  if (
    classData.spellcaster &&
    !["full", "half", "third"].includes(classData.spellcaster)
  ) {
    errors.push({
      field: "spellcaster",
      message: 'Spellcaster type must be "full", "half", or "third"',
      severity: "error"
    });
  }

  if (classData.spellcaster && !validateAbilityScore(classData.spellcastingAbility)) {
    errors.push({
      field: "spellcastingAbility",
      message: "Spellcasting classes must have a spellcasting ability",
      severity: "error"
    });
  }

  // Warnings
  if (!classData.features || classData.features.length === 0) {
    warnings.push({
      field: "features",
      message: "No class features defined",
      suggestion: "Add class features for levels 1-20"
    });
  }

  if (!classData.subclasses || classData.subclasses.length === 0) {
    warnings.push({
      field: "subclasses",
      message: "No subclasses defined",
      suggestion: "Consider adding at least one subclass"
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

export function validateFeat(feat: any): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Required fields
  if (!feat.id || typeof feat.id !== "string") {
    errors.push({ field: "id", message: "ID is required and must be a string", severity: "error" });
  }

  if (!feat.name || typeof feat.name !== "string") {
    errors.push({ field: "name", message: "Name is required and must be a string", severity: "error" });
  }

  if (!feat.description || typeof feat.description !== "string") {
    errors.push({
      field: "description",
      message: "Description is required",
      severity: "error"
    });
  }

  if (!validateSource(feat.source)) {
    errors.push({
      field: "source",
      message: 'Source must be "Official", "Homebrew", or "Unofficial"',
      severity: "error"
    });
  }

  if (!validateEdition(feat.edition)) {
    errors.push({
      field: "edition",
      message: 'Edition must be "2014", "2024", or "Both"',
      severity: "error"
    });
  }

  // Warnings
  if (!feat.benefits || Object.keys(feat.benefits).length === 0) {
    warnings.push({
      field: "benefits",
      message: "No benefits defined for this feat",
      suggestion: "Add feat benefits such as ability score increases or features"
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

export function validateBackground(background: any): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Required fields
  if (!background.id || typeof background.id !== "string") {
    errors.push({ field: "id", message: "ID is required and must be a string", severity: "error" });
  }

  if (!background.name || typeof background.name !== "string") {
    errors.push({ field: "name", message: "Name is required and must be a string", severity: "error" });
  }

  if (!background.description || typeof background.description !== "string") {
    errors.push({
      field: "description",
      message: "Description is required",
      severity: "error"
    });
  }

  if (!Array.isArray(background.skillProficiencies) || background.skillProficiencies.length !== 2) {
    errors.push({
      field: "skillProficiencies",
      message: "Backgrounds must provide exactly 2 skill proficiencies",
      severity: "error"
    });
  }

  if (!background.feature || !background.feature.name || !background.feature.description) {
    errors.push({
      field: "feature",
      message: "Background feature is required with name and description",
      severity: "error"
    });
  }

  // Warnings
  if (!background.equipment || background.equipment.length === 0) {
    warnings.push({
      field: "equipment",
      message: "No starting equipment defined",
      suggestion: "Add starting equipment for this background"
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

// ===== Version Control =====

export interface VersionMetadata {
  version: number;
  createdAt: Date;
  createdBy: string;
  changes: string[];
  previousVersion?: number;
}

export function incrementVersion(entity: any): any {
  return {
    ...entity,
    version: (entity.version || 1) + 1,
    updatedAt: new Date()
  };
}

export function createVersionSnapshot(entity: any, changes: string[]): any {
  return {
    ...entity,
    versionMetadata: {
      version: entity.version,
      createdAt: new Date(),
      createdBy: "admin",
      changes,
      previousVersion: entity.version - 1
    }
  };
}

// ===== Homebrew Tagging =====

export interface HomebrewMetadata {
  creator: string;
  createdAt: Date;
  tags: string[];
  balanceRating?: number; // 1-5 scale
  playtested: boolean;
  communityRating?: number;
  comments?: string[];
}

export function addHomebrewMetadata(
  entity: any,
  creator: string,
  tags: string[]
): any {
  return {
    ...entity,
    source: "Homebrew" as Source,
    homebrewMetadata: {
      creator,
      createdAt: new Date(),
      tags,
      playtested: false,
      comments: []
    }
  };
}

export function isBalanced(entity: any): boolean {
  if (!entity.homebrewMetadata?.balanceRating) return true;
  return entity.homebrewMetadata.balanceRating >= 3;
}

// ===== Batch Validation =====

export function validateBatch<T>(
  entities: T[],
  validator: (entity: T) => ValidationResult
): {
  validEntities: T[];
  invalidEntities: Array<{ entity: T; validation: ValidationResult }>;
  summary: { total: number; valid: number; invalid: number; warnings: number };
} {
  const validEntities: T[] = [];
  const invalidEntities: Array<{ entity: T; validation: ValidationResult }> = [];
  let totalWarnings = 0;

  entities.forEach((entity) => {
    const validation = validator(entity);
    totalWarnings += validation.warnings.length;

    if (validation.valid) {
      validEntities.push(entity);
    } else {
      invalidEntities.push({ entity, validation });
    }
  });

  return {
    validEntities,
    invalidEntities,
    summary: {
      total: entities.length,
      valid: validEntities.length,
      invalid: invalidEntities.length,
      warnings: totalWarnings
    }
  };
}
