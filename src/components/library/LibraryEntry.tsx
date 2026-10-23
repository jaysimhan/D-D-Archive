import { Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import type { Race, Class, Spell, Item, Background, Subclass, Feat } from "../../types/dnd-types";
import type { LibraryCategory } from "./categories";
import type { LibraryData } from "./useLibraryData";
import { LibraryShell, LibraryLoading } from "./LibraryShell";
import { SpellEntry } from "./entries/SpellEntry";
import { ClassEntry } from "./entries/ClassEntry";
import { SubclassEntry } from "./entries/SubclassEntry";
import { RaceEntry } from "./entries/RaceEntry";
import { FeatEntry } from "./entries/FeatEntry";
import { BackgroundEntry } from "./entries/BackgroundEntry";
import { ItemEntry } from "./entries/ItemEntry";
import { RuleEntryView } from "./entries/RuleEntryView";
import type { RuleEntry } from "../../data/srd-rules-reference";

interface LibraryEntryProps {
  category: LibraryCategory;
  id: string;
  data: LibraryData;
}

type Entry = { id: string; name: string; description?: string };

export function findEntry(category: LibraryCategory, id: string, data: LibraryData): Entry | undefined {
  const pool: Entry[] = {
    spells: data.spells,
    classes: data.classes,
    subclasses: data.subclasses,
    races: data.races,
    feats: data.feats,
    backgrounds: data.backgrounds,
    equipment: data.items,
    "magic-items": data.items,
    rules: data.rules.map((rule) => ({ ...rule, description: rule.summary })),
  }[category.id];
  return pool.find((entry) => entry.id === id);
}

export function LibraryEntry({ category, id, data, editionControl }: LibraryEntryProps & { editionControl?: React.ReactNode }) {
  const entry = findEntry(category, id, data);
  const spellIndex = useMemo(() => new Map(data.spells.map((spell) => [spell.id, spell])), [data.spells]);
  const listPath = `/library/${category.id}`;

  // A new entry should open at its top, not where the last one was scrolled to.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category.id, id]);

  if (!entry) {
    return (
      <LibraryShell
        title={data.loading ? "Loading…" : "Entry not found"}
        icon={category.icon}
        crumbs={[{ label: "Library", to: "/library" }, { label: category.label, to: listPath }]}
      >
        {data.loading ? (
          <LibraryLoading />
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>There is no {category.singular.toLowerCase()} called “{id}” in the archive.</p>
            <Link to={listPath} className="text-brand-400 hover:text-brand-300 mt-4 inline-block">
              Browse all {category.label.toLowerCase()}
            </Link>
          </div>
        )}
      </LibraryShell>
    );
  }

  return (
    <LibraryShell
      title={entry.name}
      subtitle={category.singular}
      icon={category.icon}
      crumbs={[{ label: "Library", to: "/library" }, { label: category.label, to: listPath }, { label: entry.name }]}
    >
      {editionControl}
      {category.id === "spells" && <SpellEntry spell={entry as Spell} data={data} />}
      {category.id === "classes" && <ClassEntry classData={entry as Class} data={data} spellIndex={spellIndex} />}
      {category.id === "subclasses" && <SubclassEntry subclass={entry as Subclass} data={data} spellIndex={spellIndex} />}
      {category.id === "races" && <RaceEntry race={entry as Race} data={data} spellIndex={spellIndex} />}
      {category.id === "feats" && <FeatEntry feat={entry as Feat} data={data} spellIndex={spellIndex} />}
      {category.id === "backgrounds" && <BackgroundEntry background={entry as Background} />}
      {(category.id === "equipment" || category.id === "magic-items") && <ItemEntry item={entry as Item} data={data} />}
      {category.id === "rules" && <RuleEntryView rule={entry as unknown as RuleEntry} data={data} />}
    </LibraryShell>
  );
}
