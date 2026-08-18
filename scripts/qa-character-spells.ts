import assert from "node:assert/strict";
import { createClient } from "@sanity/client";
import {
  collectCharacterSpells,
  refreshCharacterSpellData,
  withoutSpellSource,
} from "../src/utils/character-spells";
import {
  loadCompletedSheet,
  loadDraft,
  saveCompletedSheet,
  saveDraft,
} from "../src/lib/character-storage";
import type { CharacterData } from "../src/types/character-creator";
import type { Background, Class, Feat, Item, Race, Spell, Subclass } from "../src/types/dnd-types";
import { finalAbilityScores, pointBuyCost } from "../src/utils/ability-scores";
import { calculateArmorClass } from "../src/utils/armor-class";
import {
  alertInitiativeBonus,
  classPointAmount,
  featResourceAmount,
  monkUnarmoredMovementBonus,
  metamagicChoiceLimit,
  walkingSpeed,
} from "../src/utils/combat-progression";

const client = createClient({
  projectId: "ylk0tk34",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

const spellProjection = `{
  ...,
  "id": slug.current,
  "school": coalesce(school->name, legacySchoolName, "Unknown"),
  "subclasses": subclasses[]->slug.current
}`;

const [spells, feats, races, subclasses, items, backgrounds] = await Promise.all([
  client.fetch<Spell[]>(`*[_type == "spell"]${spellProjection}`),
  client.fetch<Feat[]>(`*[_type == "feat"]{
    ...,
    "id": slug.current,
    grants[]{
      ...,
      "grantedSpell": grantedSpell->${spellProjection},
      "schoolRestrictions": coalesce(schoolRestrictionNames, schoolRestrictions[]->name, []),
      "classRestrictions": classRestrictions[]->slug.current,
      "spellRestrictions": spellRestrictions[]->${spellProjection}
    }
  }`),
  client.fetch<Race[]>(`*[_type in ["race", "species"]]{
    ...,
    "id": slug.current,
    spells[]{..., "replacesSpellId":replacesSpell->slug.current, specificSpells[]->${spellProjection}}
  }`),
  client.fetch<Subclass[]>(`*[_type == "subclass"]{
    ...,
    "id": slug.current,
    spells[]{..., "replacesSpellId":replacesSpell->slug.current, specificSpells[]->${spellProjection}}
  }`),
  client.fetch<Item[]>(`*[_type == "item"]{..., "id": slug.current, "type": coalesce(type, itemCategory)}`),
  client.fetch<Background[]>(`*[_type == "background"]{
    ..., "id": slug.current,
    feats[]->{..., "id": slug.current, grants[]{..., "classRestrictions":classRestrictions[]->slug.current, "spellRestrictions":spellRestrictions[]->${spellProjection}}},
    expandedSpells[]->${spellProjection}
  }`),
]);

const rulesetCount = async (key: string) => client.fetch<number>(
  `count(*[_type == "spell" && (
    $key in rulesets[]._key || $key in rulesets[]->key.current ||
    ruleset._key == $key || ruleset->key.current == $key ||
    edition == $edition || edition in ["Both", "5e"]
  )])`,
  { key, edition: key === "srd-2014" ? "2014" : "2024" },
);
const [spells2014, spells2024] = await Promise.all([
  rulesetCount("srd-2014"),
  rulesetCount("srd-2024"),
]);

assert.equal(new Set(spells.map((spell) => spell.id)).size, spells.length, "duplicate spell slugs");
assert.equal(new Set(spells.map((spell) => spell.name.toLowerCase())).size, spells.length, "duplicate spell names");
assert.ok(spells2014 > 300 && spells2024 > 300, "one ruleset has an implausibly small spell library");
assert.ok(spells.every((spell) => spell.school && spell.school !== "Unknown"), "spell with missing school");
assert.ok(spells.every((spell) => Array.isArray(spell.classes) && spell.classes.length > 0), "spell with no class list");

for (const item of feats) {
  for (const grant of item.grants ?? []) {
    if (grant.grantType === "Specific Spell") {
      assert.ok(grant.grantedSpell?.id, `${item.name} has an unresolved fixed spell`);
    }
    if (grant.grantType === "Spell Slot") {
      const eligible = spells.filter((spell) =>
        spell.level === (grant.slotLevel ?? 1) &&
        (!grant.spellRestrictions?.length || grant.spellRestrictions.some((option) => option.id === spell.id)) &&
        (!grant.schoolRestrictions?.length || grant.schoolRestrictions.includes(spell.school)) &&
        (!grant.classRestrictions?.length || grant.classRestrictions.some((id) => spell.classes.includes(id)))
      );
      assert.ok(eligible.length >= (grant.slotCount ?? 1), `${item.name} has too few eligible spell choices`);
    }
  }
}

const strixhavenFeats = feats.filter((item) => item.name.startsWith("Strixhaven Initiate ("));
assert.equal(strixhavenFeats.length, 5, "not all Strixhaven colleges are selectable");
for (const item of strixhavenFeats) {
  const cantripGrant = item.grants?.find((grant) => grant.slotLevel === 0);
  const leveledGrant = item.grants?.find((grant) => grant.slotLevel === 1);
  assert.equal(cantripGrant?.slotCount, 2, `${item.name} does not grant two cantrip choices`);
  assert.equal(cantripGrant?.spellRestrictions?.length, 3, `${item.name} cantrip list is incomplete`);
  assert.equal(leveledGrant?.slotCount, 1, `${item.name} does not grant a 1st-level choice`);
  assert.equal(leveledGrant?.classRestrictions?.length, 2, `${item.name} class lists are incomplete`);
}
for (const owner of [...races, ...subclasses]) {
  for (const grant of owner.spells ?? []) {
    if (grant.mode === "fixed") {
      assert.ok(grant.specificSpells?.length, `${owner.name} has an unresolved fixed spell grant`);
    }
    if (grant.mode === "choice" && grant.specificSpells?.length) {
      assert.ok(grant.specificSpells.length >= (grant.count ?? 1), `${owner.name} choice has too few spells`);
    }
  }
}

const feat = (name: string) => {
  const value = feats.find((item) => item.name === name);
  assert.ok(value, `${name} missing`);
  return value;
};
const feyTouched = feat("Fey Touched");
const shadowTouched = feat("Shadow Touched");
const feyChoice = feyTouched.grants?.find((grant) => grant.grantType === "Spell Slot");
const shadowChoice = shadowTouched.grants?.find((grant) => grant.grantType === "Spell Slot");
assert.deepEqual(new Set(feyChoice?.schoolRestrictions), new Set(["Divination", "Enchantment"]));
assert.deepEqual(new Set(shadowChoice?.schoolRestrictions), new Set(["Necromancy", "Illusion"]));
assert.ok(spells.some((spell) => spell.name === "Hex" && feyChoice?.schoolRestrictions?.includes(spell.school)), "Hex unavailable to Fey Touched");
assert.ok(spells.some((spell) => spell.name === "Cause Fear" && shadowChoice?.schoolRestrictions?.includes(spell.school)), "valid Shadow Touched choice unavailable");

const astralElf = races.find((race) => race.name === "Astral Elf");
assert.ok(astralElf, "Astral Elf missing");
const eldritchKnight = subclasses.find((item) => item.id === "eldritch-knight");
assert.ok(eldritchKnight, "Eldritch Knight subclass missing");
const byName = (name: string) => {
  const value = spells.find((spell) => spell.name === name);
  assert.ok(value, `${name} missing`);
  return value;
};

// Stress case: class spell, racial choice, Fey Touched choice, fixed feat,
// fixed racial and fixed subclass grants, including Misty Step from two sources.
const character = {
  name: "QA Arcanist",
  ruleset: "2024",
  level: 3,
  race: astralElf,
  subclass: eldritchKnight,
  feats: [feyTouched],
  selectedSpells: [
    { ...byName("Magic Missile"), selectionSlotId: "class-lvl1-0", selectionSource: "Class" },
    { ...byName("Hex"), selectionSlotId: "feat-choice-fey-0", selectionSource: "Feat" },
    { ...byName("Sacred Flame"), selectionSlotId: "race-0-0", selectionSource: "Racial" },
  ],
  abilityScores: { STR: 8, DEX: 14, CON: 14, INT: 18, WIS: 12, CHA: 10 },
  equipment: [],
  magicItems: [],
  personality: {},
  proficiencies: { skills: [], languages: [], tools: [], armor: [], weapons: [] },
} as CharacterData;

const finalSpells = collectCharacterSpells(character);
for (const name of ["Magic Missile", "Hex", "Sacred Flame", "Misty Step"]) {
  assert.ok(finalSpells.some((spell) => spell.name === name), `${name} missing from completed sheet`);
}
assert.equal(finalSpells.filter((spell) => spell.name === "Misty Step").length, 1, "duplicate fixed spell on sheet");
assert.ok(
  withoutSpellSource(character.selectedSpells, "Feat").every((spell) => spell.name !== "Hex"),
  "removed feat left its spell choice behind",
);
assert.ok(
  withoutSpellSource(character.selectedSpells, "Class").some((spell) => spell.name === "Hex"),
  "class swap removed an unrelated feat choice",
);

const refreshedDraft = refreshCharacterSpellData({
  ...character,
  race: { ...astralElf, spells: [] },
  feats: [{ ...feyTouched, grants: [] }],
  selectedSpells: [{ ...byName("Hex"), school: "Unknown", selectionSource: "Feat" }],
}, {
  classes: [],
  races,
  subclasses,
  feats,
  spells,
  backgrounds,
});
assert.equal(refreshedDraft.selectedSpells[0]?.school, "Enchantment", "resumed spell was not refreshed");
assert.ok(refreshedDraft.feats[0]?.grants?.length, "resumed feat grants were not refreshed");
assert.ok(refreshedDraft.race?.spells?.length, "resumed racial grants were not refreshed");

const shadowCharacter = {
  ...character,
  race: undefined,
  subclass: undefined,
  feats: [shadowTouched],
  selectedSpells: [{ ...byName("Cause Fear"), selectionSlotId: "feat-choice-shadow-0", selectionSource: "Feat" }],
} as CharacterData;
assert.deepEqual(
  collectCharacterSpells(shadowCharacter).map((spell) => spell.name).sort(),
  ["Cause Fear", "Invisibility"],
  "Shadow Touched spells did not reach the sheet",
);

const wildMagic = subclasses.find((item) => item.name.includes("Wild Magic"));
assert.ok(wildMagic, "Wild Magic subclass missing");
assert.ok(
  collectCharacterSpells({ ...character, race: undefined, feats: [], subclass: wildMagic, selectedSpells: [] })
    .some((spell) => spell.name === "Detect Magic"),
  "fixed subclass spell did not reach the sheet",
);
const fixedClass = {
  id: "qa-fixed-class",
  name: "QA Fixed Class",
  spells: [{ level: 1, mode: "fixed", specificSpells: [byName("Shield")] }],
} as Class;
assert.ok(
  collectCharacterSpells({ ...character, class: fixedClass, race: undefined, feats: [], subclass: undefined, selectedSpells: [] })
    .some((spell) => spell.name === "Shield"),
  "fixed class spell did not reach the sheet",
);

const githzerai = races.find((race) => race.id === "githzerai");
const lunarSorcery = subclasses.find((item) => item.id === "lunar-sorcery");
const lorehold = feats.find((item) => item.id === "strixhaven-initiate-lorehold");
const bloodwell = items.find((item) => item.id === "bloodwell-vial-1");
assert.ok(githzerai && lunarSorcery && lorehold && bloodwell, "requested Lunar Sorcerer build data is incomplete");
const requestedBuild = {
  ...character,
  race: githzerai,
  class: { id: "sorcerer", name: "Sorcerer", spells: [] } as Class,
  subclass: lunarSorcery,
  feats: [lorehold],
  magicItems: [bloodwell],
  selectedSpells: [
    "Fire Bolt", "Prestidigitation", "Ray of Frost", "Chill Touch",
    "Magic Missile", "Chromatic Orb", "Sleep", "Scorching Ray",
    "Light", "Thaumaturgy", "Cure Wounds",
  ].map((name, index) => ({ ...byName(name), selectionSlotId: `requested-${index}`, selectionSource: index < 8 ? "Class" : "Feat" })),
} as CharacterData;
const requestedBuildSpells = collectCharacterSpells(requestedBuild);
for (const name of [
  "Mage Hand", "Shield", "Sacred Flame", "Ray of Sickness", "Color Spray",
  "Lesser Restoration", "Blindness/Deafness", "Alter Self", "Cure Wounds",
]) {
  assert.ok(requestedBuildSpells.some((spell) => spell.name === name), `${name} missing from requested build sheet`);
}
assert.ok(!requestedBuildSpells.some((spell) => spell.name === "Detect Thoughts"), "level-5 Githzerai spell leaked into level 3");
assert.equal(requestedBuildSpells.filter((spell) => spell.name === "Shield").length, 1, "overlapping racial/Lunar Shield duplicated");

const mountainDwarf = races.find((race) => race.id === "mountain-dwarf");
const clockworkSoul = subclasses.find((item) => item.id === "clockwork-sorcery");
const witherbloomStudent = backgrounds.find((item) => item.id === "witherbloom-student");
const witherbloomInitiate = feats.find((item) => item.id === "strixhaven-initiate-witherbloom");
const scaleMail = items.find((item) => item.id === "scale-mail");
assert.ok(mountainDwarf && clockworkSoul && witherbloomStudent && witherbloomInitiate && scaleMail, "Ironclad Time-Mage data is incomplete");
assert.equal(mountainDwarf.flexibleAbilityScores, false, "Mountain Dwarf fixed +2/+2 was replaced by flexible +3");
assert.deepEqual(mountainDwarf.abilityScoreIncrease, { STR: 2, CON: 2 });
assert.ok(mountainDwarf.proficiencies?.some((rule) => rule.armorOptions?.includes("Medium Armor")), "Mountain Dwarf lacks medium armor");
assert.ok(mountainDwarf.proficiencies?.some((rule) => rule.weaponOptions?.includes("Warhammer")), "Mountain Dwarf lacks warhammer");
assert.ok(witherbloomStudent.feats?.some((item) => item.id === witherbloomInitiate.id), "Witherbloom Student did not grant its feat");
assert.ok(witherbloomStudent.expandedSpells?.some((spell) => spell.id === "cure-wounds"), "Cure Wounds not added to the class list");
assert.ok(!witherbloomInitiate.grants?.find((grant) => grant.slotLevel === 1)?.classRestrictions?.some((id) => byName("Inflict Wounds").classes.includes(id)), "illegal Inflict Wounds feat loophole opened");
const clockworkSwap = clockworkSoul.spells?.find((grant) => grant.mode === "choice" && grant.name?.includes("replace Alarm"));
assert.ok(clockworkSwap?.specificSpells?.some((spell) => spell.id === "armor-of-agathys"), "Armor of Agathys unavailable for Clockwork replacement");
const ironclad = {
  ...character,
  ruleset: "2014",
  race: mountainDwarf,
  subclass: clockworkSoul,
  background: witherbloomStudent,
  feats: [witherbloomInitiate],
  abilityScores: { STR: 8, DEX: 14, CON: 14, INT: 8, WIS: 10, CHA: 15 },
  equipment: [scaleMail, items.find((item) => item.id === "warhammer")!],
  metamagicChoices: ["Twinned Spell", "Subtle Spell"],
  selectedSpells: [
    { ...byName("Armor of Agathys"), selectionSlotId: "subclass-choice-0-0", selectionSource: "Subclass", replacesSpellId: "alarm" },
    { ...byName("Cure Wounds"), selectionSlotId: "class-lvl1-0", selectionSource: "Class" },
    { ...byName("Spare the Dying"), selectionSlotId: "feat-choice-0-0", selectionSource: "Feat" },
    { ...byName("Chill Touch"), selectionSlotId: "feat-choice-0-1", selectionSource: "Feat" },
  ],
} as CharacterData;
assert.equal(pointBuyCost(ironclad.abilityScores), 25, "documented Ironclad base scores changed");
assert.deepEqual(finalAbilityScores(ironclad), { STR: 10, DEX: 14, CON: 16, INT: 8, WIS: 10, CHA: 15 });
assert.equal(calculateArmorClass(ironclad.equipment, 2), 16, "Scale Mail AC is not 16");
for (const name of ["Armor of Agathys", "Cure Wounds", "Protection from Evil and Good", "Aid", "Lesser Restoration"]) {
  assert.ok(collectCharacterSpells(ironclad).some((spell) => spell.name === name), `${name} missing from Ironclad sheet`);
}
assert.ok(!collectCharacterSpells(ironclad).some((spell) => spell.name === "Alarm"), "replaced Clockwork spell remained on the sheet");

const alert2014 = feats.find((item) => item.name === "Alert" && item.edition === "2014");
const alert2024 = feats.find((item) => item.name === "Alert" && item.edition === "2024");
const metamagicAdept = feats.find((item) => item.name === "Metamagic Adept");
assert.ok(alert2014 && alert2024 && metamagicAdept, "Alert versions or Metamagic Adept missing");
assert.equal(alertInitiativeBonus([alert2014], "2014", 3), 5, "2014 Alert initiative bonus is not +5");
assert.equal(alertInitiativeBonus([alert2024], "2024", 3), 2, "2024 Alert does not add proficiency at level 3");
assert.equal(alertInitiativeBonus([alert2024], "2024", 5), 3, "2024 Alert does not scale at level 5");
assert.ok(alert2024.description.includes("swap"), "2024 Alert initiative swap missing from sheet text");
assert.ok(!alert2014.benefits?.features?.some((feature) => /perception/i.test(feature)), "Alert still modifies Passive Perception");

assert.deepEqual([1, 2, 6, 10, 14, 18].map(monkUnarmoredMovementBonus), [0, 10, 15, 20, 25, 30]);
assert.equal(walkingSpeed(30, 3, []), 40, "unarmored level-3 Monk speed is not 40");
assert.equal(walkingSpeed(30, 18, []), 60, "level-18 Monk speed did not scale to 60");
assert.equal(walkingSpeed(30, 18, [scaleMail]), 30, "Monk movement incorrectly works in armor");
assert.equal(classPointAmount("monk", 1), 0, "level-1 Monk incorrectly has Focus/Ki points");
assert.equal(classPointAmount("monk", 3), 3, "level-3 Monk point pool is wrong");

assert.equal(metamagicAdept.source, "Official");
assert.equal(metamagicAdept.edition, "2014");
assert.equal(featResourceAmount([metamagicAdept], "Sorcery Points"), 2, "Metamagic Adept did not grant 2 Sorcery Points");
assert.equal(classPointAmount("sorcerer", 3) + featResourceAmount([metamagicAdept], "Sorcery Points"), 5, "Sorcerer 3 + Metamagic Adept sheet pool is not 5");
assert.ok(metamagicAdept.grants?.some((grant) => grant.resetCondition === "Long Rest"), "Metamagic Adept recovery missing");
assert.equal(metamagicChoiceLimit("wizard", 3, [metamagicAdept]), 2, "Metamagic Adept does not offer two choices to a non-Sorcerer caster");
assert.equal(metamagicChoiceLimit("sorcerer", 3, [metamagicAdept]), 4, "Sorcerer + Metamagic Adept does not offer four distinct choices");

// Exercise the actual persistence boundary used by /creator and
// /character-sheet, including a malformed school value saved by the old query.
const memory = new Map<string, string>();
Object.defineProperty(globalThis, "window", {
  configurable: true,
  value: {
    localStorage: {
      getItem: (key: string) => memory.get(key) ?? null,
      setItem: (key: string, value: string) => memory.set(key, value),
      removeItem: (key: string) => memory.delete(key),
    },
  },
});
const malformedDraft = {
  ...character,
  selectedSpells: [{ ...byName("Magic Missile"), school: { name: "Evocation" } }],
} as unknown as CharacterData;
saveDraft(malformedDraft, "spells");
const resumed = loadDraft();
assert.equal(resumed?.step, "spells", "draft did not resume on its saved step");
assert.equal(resumed?.character.selectedSpells[0]?.school, "Evocation", "stale school object was not repaired");

saveCompletedSheet({ ...character, selectedSpells: finalSpells });
const reopenedSheet = loadCompletedSheet();
assert.ok(reopenedSheet, "completed character did not survive the sheet handoff");
for (const name of ["Magic Missile", "Hex", "Sacred Flame", "Misty Step"]) {
  assert.ok(
    collectCharacterSpells(reopenedSheet).some((spell) => spell.name === name),
    `${name} was lost between creator storage and the character sheet`,
  );
}

console.log(JSON.stringify({
  spells: spells.length,
  spells2014,
  spells2024,
  featsChecked: [feyTouched.name, shadowTouched.name],
  stressCharacterSheetSpells: finalSpells.map((spell) => spell.name),
  requestedBuildSpellCount: requestedBuildSpells.length,
  alertInitiative: { level3_2014: 7, level3_2024: 4, level5_2024: 5 },
  monkWalkingSpeed: { level1: 30, level3: 40, level18: 60, armoredLevel18: 30 },
  metamagicAdept: { featChoices: 2, sorcerer3Choices: 4, sorcerer3Points: 5, reset: "Long Rest" },
  assertions: "passed",
}, null, 2));
