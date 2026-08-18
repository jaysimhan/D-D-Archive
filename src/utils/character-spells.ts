import type { CharacterData } from "../types/character-creator";
import type { Background, Class, Feat, Race, Spell, SpellGrant, Subclass } from "../types/dnd-types";

const spellKey = (spell: Pick<Spell, "id" | "name">): string =>
  (spell.id || spell.name).trim().toLowerCase();

function fixedSpells(grants: SpellGrant[] | undefined, characterLevel: number): Spell[] {
  return (grants ?? [])
    .filter((grant) => grant.mode === "fixed" && grant.level <= characterLevel)
    .flatMap((grant) => grant.specificSpells ?? []);
}

/**
 * Produces the canonical list consumed by the character sheet and downloads.
 * User picks come first, followed by fixed feat/species/subclass grants. A spell
 * granted by several sources is deliberately shown once.
 */
export function collectAutomaticSpells(
  character: Pick<CharacterData, "feats" | "race" | "subrace" | "class" | "subclass" | "level" | "selectedSpells">,
): Spell[] {
  const replaced = new Set(character.selectedSpells.map((spell) => spell.replacesSpellId).filter(Boolean));
  const automatic: Spell[] = [
    ...character.feats.flatMap((feat) =>
      (feat.grants ?? [])
        .filter((grant) => grant.grantType === "Specific Spell" && grant.grantedSpell)
        .map((grant) => grant.grantedSpell!),
    ),
    ...character.feats.flatMap((feat) => fixedSpells(feat.spells, character.level)),
    ...fixedSpells(character.race?.spells, character.level),
    ...fixedSpells(character.subrace?.spells, character.level),
    ...fixedSpells(character.class?.spells, character.level),
    ...fixedSpells(character.subclass?.spells, character.level),
  ].filter((spell) => !replaced.has(spell.id)).map((spell) => ({ ...spell, selectionSource: "Automatic" as const }));

  const result: Spell[] = [];
  const seen = new Set<string>();
  for (const spell of automatic) {
    const key = spellKey(spell);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(spell);
  }
  return result;
}

export function collectCharacterSpells(character: CharacterData): Spell[] {
  const automatic = collectAutomaticSpells(character);

  const result: Spell[] = [];
  const seen = new Set<string>();
  for (const spell of [...character.selectedSpells, ...automatic]) {
    const key = spellKey(spell);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(spell);
  }
  return result;
}

export function withoutSpellSource(
  spells: Spell[],
  ...sources: NonNullable<Spell["selectionSource"]>[]
): Spell[] {
  const removed = new Set(sources);
  return spells.filter((spell) => !spell.selectionSource || !removed.has(spell.selectionSource));
}

type SpellArchives = {
  classes: Class[];
  races: Race[];
  subclasses: Subclass[];
  feats: Feat[];
  spells: Spell[];
  backgrounds: Background[];
};

const latest = <T extends { id: string }>(current: T | undefined, archive: T[]): T | undefined => {
  if (!current) return undefined;
  const replacement = archive.find((item) => item.id === current.id);
  // Some focused projections intentionally omit fields. Merge so refreshing a
  // fixed grant never erases unrelated draft data.
  return replacement ? { ...current, ...replacement } : current;
};

/** Refreshes a resumed draft without discarding anything the archive no longer has. */
export function refreshCharacterSpellData(character: CharacterData, archive: SpellArchives): CharacterData {
  const background = latest(character.background, archive.backgrounds);
  const refreshedFeats = character.feats.map((feat) => latest(feat, archive.feats)!);
  const feats = [...refreshedFeats, ...(background?.feats ?? [])].filter(
    (feat, index, list) => list.findIndex((candidate) => candidate.id === feat.id) === index,
  );
  return {
    ...character,
    class: latest(character.class, archive.classes),
    race: latest(character.race, archive.races),
    subclass: latest(character.subclass, archive.subclasses),
    background,
    feats,
    selectedSpells: character.selectedSpells.map((saved) => {
      const current = archive.spells.find((spell) => spell.id === saved.id);
      return current
        ? {
            ...saved,
            ...current,
            selectionSlotId: saved.selectionSlotId,
            selectionSource: saved.selectionSource,
            freeCastReset: saved.freeCastReset,
            canUseSpellSlots: saved.canUseSpellSlots,
            replacesSpellId: saved.replacesSpellId,
          }
        : saved;
    }),
  };
}
