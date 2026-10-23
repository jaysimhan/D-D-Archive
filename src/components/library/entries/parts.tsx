import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import type { ProficiencyRule, SpellGrant, Feature, Spell, SanityImage as SanityImageType } from "../../../types/dnd-types";
import SanityImage from "../../SanityImage";
import { sourceLabel, sourceBadgeColor, type HasSource } from "../../../utils/source-label";
import { entryPath } from "../categories";

/* Shared pieces for the Library's entry pages. Each entry page is a column of
 * Sections; these keep their look consistent across spells, classes and items. */

/**
 * An entry's artwork, uncropped: shown at its own aspect ratio up to 70% of the
 * viewport's height, centred over a blurred copy of itself so portrait art
 * doesn't leave bare bars at the sides.
 */
export function HeroImage({ image, alt }: { image?: SanityImageType; alt: string }) {
  if (!image?.asset) return null;
  const blur = image.asset.metadata?.lqip;
  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-zinc-800 bg-black/40 flex justify-center">
      {blur && (
        <div
          aria-hidden
          className="absolute inset-0 scale-110 blur-2xl opacity-40"
          style={{ backgroundImage: `url(${blur})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
      )}
      <SanityImage
        imageAsset={image}
        alt={alt}
        width={1400}
        objectFit="contain"
        className="relative"
        style={{ width: "auto", maxWidth: "100%", maxHeight: "70vh" }}
      />
    </div>
  );
}

export function Section({ title, children, aside }: { title: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
      <div className="flex items-baseline justify-between gap-3 mb-3 border-b border-zinc-800 pb-2">
        <h2 className="font-serif text-lg text-brand-300">{title}</h2>
        {aside && <div className="text-xs text-gray-500">{aside}</div>}
      </div>
      {children}
    </section>
  );
}

/** Long-form rules text. Sanity stores it as plain text with blank-line paragraphs. */
export function Prose({ text, className = "" }: { text?: string; className?: string }) {
  if (!text?.trim()) return null;
  return <p className={`text-gray-300 leading-relaxed whitespace-pre-line ${className}`}>{text}</p>;
}

export interface StatEntry {
  label: string;
  value: ReactNode;
}

/** The at-a-glance block under an entry's title. Empty values are skipped. */
export function StatGrid({ stats }: { stats: StatEntry[] }) {
  const shown = stats.filter((stat) => stat.value !== undefined && stat.value !== null && stat.value !== "");
  if (shown.length === 0) return null;
  return (
    <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px overflow-hidden rounded-xl border border-zinc-800 bg-zinc-800">
      {shown.map((stat) => (
        <div key={stat.label} className="bg-zinc-900 p-3">
          <dt className="text-[11px] uppercase tracking-wider text-gray-500">{stat.label}</dt>
          <dd className="mt-1 text-sm text-gray-100">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Tag({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "brand" | "blue" | "amber" | "green" }) {
  const tones = {
    neutral: "bg-zinc-800 text-gray-300 border-zinc-700",
    brand: "bg-brand-900/50 text-brand-300 border-brand-700",
    blue: "bg-blue-900/50 text-blue-300 border-blue-700",
    amber: "bg-amber-900/40 text-amber-300 border-amber-700",
    green: "bg-green-900/40 text-green-300 border-green-700",
  };
  return <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full border ${tones[tone]}`}>{children}</span>;
}

/** Edition and source, as every entry page shows them under the title. */
export function SourceTags({ entity }: { entity: HasSource & { edition?: string } }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`text-xs px-3 py-1 rounded-full ${sourceBadgeColor(entity.source)}`}>{sourceLabel(entity)}</span>
      {entity.edition && <Tag>{entity.edition === "Both" ? "2014 & 2024" : entity.edition}</Tag>}
    </div>
  );
}

/** A link to another Library entry, or plain text when the archive has no such entry. */
export function EntryLink({ category, id, children }: { category: Parameters<typeof entryPath>[0]; id?: string; children: ReactNode }) {
  if (!id) return <>{children}</>;
  return (
    <Link to={entryPath(category, id)} className="text-brand-300 hover:text-brand-200 underline decoration-brand-800 underline-offset-2">
      {children}
    </Link>
  );
}

export function LinkChips({ links }: { links: { key: string; label: string; to?: string }[] }) {
  if (links.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) =>
        link.to ? (
          <Link key={link.key} to={link.to} className="text-sm px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800/60 text-gray-200 hover:border-brand-600 hover:text-brand-200 transition-colors">
            {link.label}
          </Link>
        ) : (
          <span key={link.key} className="text-sm px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-gray-400">{link.label}</span>
        ),
      )}
    </div>
  );
}

/** Features grouped under the level they arrive at, in level order. */
export function FeaturesByLevel({ features }: { features?: Feature[] }) {
  const sorted = [...(features || [])].filter((feature) => feature?.name).sort((a, b) => (a.level || 0) - (b.level || 0));
  if (sorted.length === 0) return <p className="text-sm text-gray-500 italic">No features are recorded yet.</p>;
  return (
    <ol className="space-y-3">
      {sorted.map((feature, i) => (
        <li key={`${feature.name}-${i}`} id={featureAnchor(feature)} className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-4 scroll-mt-32">
          <div className="flex items-baseline justify-between gap-3 mb-1">
            <h3 className="font-semibold text-gray-100">{feature.name}</h3>
            {feature.level ? <span className="text-xs text-gray-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-700 shrink-0">Level {feature.level}</span> : null}
          </div>
          <Prose text={feature.description} className="text-sm" />
        </li>
      ))}
    </ol>
  );
}

export function featureAnchor(feature: { name: string; level?: number }): string {
  return `feature-${feature.level ?? 0}-${feature.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

const RULE_TYPE_LABEL: Record<ProficiencyRule["type"], string> = {
  skill: "Skills",
  tool: "Tools",
  language: "Languages",
  armor: "Armor",
  weapon: "Weapons",
  savingThrow: "Saving Throws",
};

function ruleOptions(rule: ProficiencyRule): string[] {
  return [
    ...(rule.skillOptions || []),
    ...(rule.toolOptions || []),
    ...(rule.languageOptions || []),
    ...(rule.armorOptions || []),
    ...(rule.weaponOptions || []),
    ...(rule.options || []),
  ];
}

/** Sanity proficiency rules, read out as "Skills: choose 2 from …". */
export function ProficiencyRules({ rules }: { rules?: ProficiencyRule[] }) {
  const shown = (rules || []).filter((rule) => rule?.type);
  if (shown.length === 0) return null;
  return (
    <ul className="space-y-1.5 text-sm text-gray-300">
      {shown.map((rule, i) => {
        const options = ruleOptions(rule);
        const list = options.length ? options.join(", ") : rule.description || "any";
        return (
          <li key={i}>
            <span className="text-brand-300">{RULE_TYPE_LABEL[rule.type] ?? rule.type}: </span>
            {rule.mode === "choice" ? `Choose ${rule.count ?? 1} from ${list}` : list}
            {rule.mode !== "choice" && rule.description && options.length > 0 && (
              <span className="text-gray-500"> — {rule.description}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

const RECHARGE_LABEL: Record<string, string> = {
  "at-will": "At will",
  "short-rest": "Once per short rest",
  "long-rest": "Once per long rest",
  day: "Once per day",
};

function spellLevelLabel(level?: number): string | undefined {
  if (level === undefined || level === null) return undefined;
  return level === 0 ? "Cantrip" : `Level ${level} spell`;
}

/** Spells handed out by a race, subclass or feat, linked to their spell pages. */
export function SpellGrants({ grants, spellIndex }: { grants?: SpellGrant[]; spellIndex: Map<string, Spell> }) {
  const shown = (grants || []).filter(Boolean);
  if (shown.length === 0) return null;
  return (
    <ul className="space-y-3">
      {shown.map((grant, i) => {
        const specific = (grant.specificSpells || []).filter((spell) => spell?.name);
        const details = [
          grant.level ? `From level ${grant.level}` : undefined,
          grant.mode === "choice" ? `Choose ${grant.count ?? 1}${grant.spellList ? ` from the ${grant.spellList} list` : ""}` : undefined,
          spellLevelLabel(grant.spellLevel),
          grant.ability ? `${grant.ability} casting` : undefined,
          grant.recharge ? RECHARGE_LABEL[grant.recharge] ?? grant.recharge : undefined,
        ].filter(Boolean);
        return (
          <li key={i} className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
            {grant.name && <p className="font-medium text-gray-100">{grant.name}</p>}
            {details.length > 0 && <p className="text-xs text-gray-400 mt-0.5">{details.join(" · ")}</p>}
            {specific.length > 0 && (
              <p className="text-sm text-gray-300 mt-2">
                {specific.map((spell, j) => (
                  <span key={spell.id ?? j}>
                    {j > 0 && ", "}
                    <EntryLink category="spells" id={spellIndex.has(spell.id) ? spell.id : undefined}>{spell.name}</EntryLink>
                  </span>
                ))}
              </p>
            )}
            {grant.notes && <p className="text-sm text-gray-400 mt-1">{grant.notes}</p>}
          </li>
        );
      })}
    </ul>
  );
}

export function titleCase(slug: string): string {
  return slug.split(/[-_\s]+/).filter(Boolean).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

export function ordinal(n: number): string {
  const suffix = n % 100 >= 11 && n % 100 <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th";
  return `${n}${suffix}`;
}
