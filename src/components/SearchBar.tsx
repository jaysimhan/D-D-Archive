import { useState, type ReactNode } from "react";
import { Search, X, Coins, Weight, ChevronDown } from "lucide-react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { SearchFilters, Edition, Source, SpellSchool, FEAT_CATEGORIES, FeatCategory } from "../types/dnd-types";
import { RULE_KINDS } from "../data/srd-rules-reference";
import { CASTER_TYPE_LABELS } from "../utils/search-utils";
import type { LibraryCategoryId } from "./library/categories";

const EQUIPMENT_TYPES = ["Weapon", "Armor", "Adventuring Gear", "Tool", "Mount & Vehicle"];
const MAGIC_ITEM_TYPES = ["Armor", "Weapon", "Potion", "Ring", "Rod", "Scroll", "Staff", "Wand", "Wondrous Item"];
const SCHOOLS: SpellSchool[] = ["Abjuration", "Conjuration", "Divination", "Enchantment", "Evocation", "Illusion", "Necromancy", "Transmutation"];
const RARITIES = ["Common", "Uncommon", "Rare", "Very Rare", "Legendary", "Artifact"];
const SIZES = ["Tiny", "Small", "Medium", "Large"];
const COMPONENTS = [
  { id: "verbal", short: "V", label: "Verbal" },
  { id: "somatic", short: "S", label: "Somatic" },
  { id: "material", short: "M", label: "Material" },
] as const;

const EDITION_LABELS: Record<string, string> = { "2014": "2014 rules", "2024": "2024 rules", Both: "Universal only" };

export interface FilterOption {
  value: string;
  label: string;
}

interface SearchBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  /** Which section's filters to show. */
  filterSet: LibraryCategoryId;
  /** Choices drawn from the data itself. */
  options?: {
    /** Classes with a spell list, for spells. */
    spellClasses?: FilterOption[];
    /** Classes that have subclasses, for subclasses. */
    parentClasses?: FilterOption[];
    /** The books this section's entries come from. */
    books?: string[];
    /** Where the equipment sliders end, in gp and lb. */
    highestPrice?: number;
    highestWeight?: number;
    /** Narrower rarity and +N choices, when only some are allowed. */
    rarities?: string[];
    bonuses?: number[];
  };
}

const CONTROL = "h-10 w-full px-3 bg-zinc-900/50 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent";

function Field({ label, icon, className = "w-[calc(50%-0.375rem)] sm:w-40", children }: { label: string; icon?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <div className="flex items-center gap-1.5 mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
        {icon}
        {label}
      </div>
      {children}
    </div>
  );
}

function SelectFilter({ label, value, onChange, anyLabel, options, className }: {
  label: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  anyLabel: string;
  options: (string | FilterOption)[];
  className?: string;
}) {
  return (
    <Field label={label} className={className}>
      <select value={value ?? ""} onChange={(e) => onChange(e.target.value || undefined)} className={CONTROL}>
        <option value="">{anyLabel}</option>
        {options.map((option) => {
          const { value: v, label: l } = typeof option === "string" ? { value: option, label: option } : option;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
    </Field>
  );
}

function Chip({ active, onClick, title, children }: { active: boolean; onClick: () => void; title?: string; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={`h-10 px-3 rounded-lg text-sm border transition-colors whitespace-nowrap ${active
        ? "bg-brand-900/50 border-brand-500/60 text-brand-200 font-medium"
        : "bg-zinc-900/50 border-zinc-700 text-gray-400 hover:bg-zinc-800 hover:text-gray-200"
        }`}
    >
      {children}
    </button>
  );
}

/**
 * Prices run from a copper to an airship, so the sliders step through these
 * stops rather than a straight line, which would crowd nearly everything into
 * the first few pixels.
 */
const PRICE_LADDER = [0, 0.1, 0.5, 1, 2, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000];
const WEIGHT_LADDER = [0, 0.5, 1, 2, 5, 10, 15, 20, 30, 50, 75, 100, 250, 500, 1000, 2500, 5000, 10000];

/** The ladder up to the first stop that covers the dearest (or heaviest) entry. */
function stopsUpTo(ladder: number[], highest: number | undefined): number[] {
  const end = ladder.findIndex((stop) => stop >= (highest ?? Infinity));
  return end === -1 ? ladder : ladder.slice(0, Math.max(end, 1) + 1);
}

/** Whole gold pieces, or silver below one gold: "5 sp", "25 gp", "1,000 gp". */
export function priceText(gp: number): string {
  return gp > 0 && gp < 1 ? `${Math.round(gp * 10)} sp` : `${gp.toLocaleString("en-US")} gp`;
}

export function weightText(lb: number): string {
  return `${lb.toLocaleString("en-US")} lb`;
}

/** Short enough for the filter button: "25k gp", "5 sp", "500 lb". */
function shortText(format: (value: number) => string) {
  return (value: number) => (value >= 1000 ? format(value).replace(/^([\d,.]+)/, `${Number((value / 1000).toFixed(1))}k`) : format(value));
}

/** The button's label: "5 – 50 gp" rather than the chip's "5 gp – 50 gp". */
function buttonText(lo: number | undefined, hi: number | undefined, format: (value: number) => string): string {
  const short = shortText(format);
  if (lo !== undefined && hi !== undefined) return `${short(lo)} – ${short(hi)}`;
  if (lo !== undefined) return `${short(lo)}+`;
  if (hi !== undefined) return `Up to ${short(hi)}`;
  return "Any";
}

function rangeText(lo: number | undefined, hi: number | undefined, format: (value: number) => string): string {
  if (lo !== undefined && hi !== undefined) return `${format(lo)} – ${format(hi)}`;
  if (lo !== undefined) return `${format(lo)} or more`;
  if (hi !== undefined) return `Up to ${format(hi)}`;
  return "Any";
}

/**
 * A dropdown holding a two-thumb slider over `stops` and exact Min/Max boxes.
 * Nothing filters until OK; closing any other way drops the edit. A thumb
 * parked at either end, or an empty box, leaves that side unbounded.
 */
function RangeDropdown({ label, icon, unit, stops, format, min, max, onChange }: {
  label: string;
  icon: ReactNode;
  unit: string;
  stops: number[];
  format: (value: number) => string;
  min: number | undefined;
  max: number | undefined;
  onChange: (min: number | undefined, max: number | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  const [minText, setMinText] = useState("");
  const [maxText, setMaxText] = useState("");

  const last = stops.length - 1;
  const parse = (text: string) => (text.trim() === "" || Number.isNaN(Number(text)) ? undefined : Math.max(0, Number(text)));
  const nearest = (value: number) => stops.reduce((best, stop, i) => (Math.abs(stop - value) < Math.abs(stops[best] - value) ? i : best), 0);
  const draftMin = parse(minText);
  const draftMax = parse(maxText);
  const sliderValue = [draftMin === undefined ? 0 : nearest(draftMin), draftMax === undefined ? last : nearest(draftMax)];
  const active = min !== undefined || max !== undefined;

  const openChange = (next: boolean) => {
    if (next) {
      setMinText(min === undefined ? "" : String(min));
      setMaxText(max === undefined ? "" : String(max));
    }
    setOpen(next);
  };
  const apply = () => {
    const [lo, hi] = draftMin !== undefined && draftMax !== undefined && draftMin > draftMax ? [draftMax, draftMin] : [draftMin, draftMax];
    onChange(lo || undefined, hi);
    setOpen(false);
  };

  const thumb = "block w-4 h-4 rounded-full bg-white border-2 border-brand-500 shadow cursor-grab active:cursor-grabbing focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/40";
  const box = "h-9 w-full min-w-0 pl-2 pr-8 bg-zinc-950 border border-zinc-700 rounded-md text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

  return (
    <Field label={label} icon={icon}>
      <PopoverPrimitive.Root open={open} onOpenChange={openChange}>
        <PopoverPrimitive.Trigger className={`${CONTROL} flex items-center justify-between gap-2 text-left ${active ? "border-brand-500/60 text-brand-200" : ""}`}>
          <span className="truncate" title={rangeText(min, max, format)}>{buttonText(min, max, format)}</span>
          <ChevronDown className="w-4 h-4 shrink-0 text-gray-400" />
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={6}
            className="z-50 w-72 rounded-lg border border-zinc-700 bg-zinc-900 p-4 shadow-xl shadow-black/50"
          >
            <form onSubmit={(e) => { e.preventDefault(); apply(); }} className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-200">{label}</span>
                <span className="tabular-nums text-brand-300">{rangeText(draftMin || undefined, draftMax, format)}</span>
              </div>

              <div>
                <SliderPrimitive.Root
                  min={0}
                  max={last}
                  step={1}
                  minStepsBetweenThumbs={1}
                  value={sliderValue}
                  onValueChange={([lo, hi]) => {
                    setMinText(lo === 0 ? "" : String(stops[lo]));
                    setMaxText(hi === last ? "" : String(stops[hi]));
                  }}
                  className="relative flex w-full touch-none select-none items-center h-5"
                >
                  <SliderPrimitive.Track className="relative h-1.5 grow rounded-full bg-zinc-700">
                    <SliderPrimitive.Range className="absolute h-full rounded-full bg-brand-500" />
                  </SliderPrimitive.Track>
                  <SliderPrimitive.Thumb className={thumb} aria-label={`Minimum ${label.toLowerCase()}`} />
                  <SliderPrimitive.Thumb className={thumb} aria-label={`Maximum ${label.toLowerCase()}`} />
                </SliderPrimitive.Root>
                <div className="flex justify-between mt-1 text-[11px] text-gray-500 tabular-nums">
                  <span>{format(stops[0])}</span>
                  <span>{format(stops[last])}+</span>
                </div>
              </div>

              <div className="flex items-end gap-2">
                {([["Min", minText, setMinText, "0"], ["Max", maxText, setMaxText, "Any"]] as const).map(([name, text, setText, placeholder]) => (
                  <label key={name} className="flex-1 text-xs text-gray-500">
                    {name}
                    <span className="relative mt-1 block">
                      <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="any"
                        placeholder={placeholder}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className={box}
                      />
                      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">{unit}</span>
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => { setMinText(""); setMaxText(""); }}
                  className="text-xs text-gray-400 hover:text-brand-300 underline underline-offset-2"
                >
                  Reset
                </button>
                <div className="flex gap-2">
                  <PopoverPrimitive.Close type="button" className="h-8 px-3 rounded-md text-sm text-gray-300 border border-zinc-700 hover:bg-zinc-800">
                    Cancel
                  </PopoverPrimitive.Close>
                  <button type="submit" className="h-8 px-4 rounded-md text-sm font-medium bg-brand-600 text-white hover:bg-brand-500">
                    OK
                  </button>
                </div>
              </div>
            </form>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </Field>
  );
}

/** Every filter in use, each with a readable label and what clears it. */
function activeFilters(filters: SearchFilters, options: SearchBarProps["options"]): { label: string; clear: Partial<SearchFilters> }[] {
  const nameOf = (list: FilterOption[] | undefined, value: string) => list?.find((o) => o.value === value)?.label ?? value;
  const chips: { label: string; clear: Partial<SearchFilters> }[] = [];
  const add = (show: unknown, label: string, clear: Partial<SearchFilters>) => {
    if (show !== undefined && show !== "" && show !== null) chips.push({ label, clear });
  };

  add(filters.edition, EDITION_LABELS[filters.edition ?? ""] ?? "", { edition: undefined });
  add(filters.source, `Source: ${filters.source}`, { source: undefined });
  add(filters.sourceBook, `Book: ${filters.sourceBook}`, { sourceBook: undefined });
  add(filters.level, filters.level === 0 ? "Cantrips" : `Level ${filters.level}`, { level: undefined });
  add(filters.school, filters.school ?? "", { school: undefined });
  add(filters.class, `Class list: ${nameOf(options?.spellClasses, filters.class ?? "")}`, { class: undefined });
  for (const comp of filters.components ?? []) {
    add(comp, `Needs ${COMPONENTS.find((c) => c.id === comp)?.label}`, { components: filters.components?.filter((c) => c !== comp) });
  }
  add(filters.concentration || undefined, "Concentration", { concentration: undefined });
  add(filters.ritual || undefined, "Ritual", { ritual: undefined });
  add(filters.casterType, CASTER_TYPE_LABELS[filters.casterType as keyof typeof CASTER_TYPE_LABELS] ?? "", { casterType: undefined });
  add(filters.parentClass, `Class: ${nameOf(options?.parentClasses, filters.parentClass ?? "")}`, { parentClass: undefined });
  add(filters.size, `Size: ${filters.size}`, { size: undefined });
  add(filters.featCategory, `${filters.featCategory} feats`, { featCategory: undefined });
  add(filters.itemType, filters.itemType ?? "", { itemType: undefined });
  if (filters.minCost !== undefined || filters.maxCost !== undefined) {
    add(true, `Price: ${rangeText(filters.minCost, filters.maxCost, priceText)}`, { minCost: undefined, maxCost: undefined });
  }
  if (filters.minWeight !== undefined || filters.maxWeight !== undefined) {
    add(true, `Weight: ${rangeText(filters.minWeight, filters.maxWeight, weightText)}`, { minWeight: undefined, maxWeight: undefined });
  }
  add(filters.rarity, filters.rarity ?? "", { rarity: undefined });
  add(filters.attunement, filters.attunement ? "Needs attunement" : "No attunement", { attunement: undefined });
  add(filters.magicBonus, `+${filters.magicBonus} items`, { magicBonus: undefined });
  add(filters.ruleKind, filters.ruleKind ?? "", { ruleKind: undefined });
  return chips;
}

export function SearchBar({ filters, onFiltersChange, filterSet, options }: SearchBarProps) {
  const set = (patch: Partial<SearchFilters>) => onFiltersChange({ ...filters, ...patch });
  const toggleComponent = (comp: (typeof COMPONENTS)[number]["id"]) => {
    const current = filters.components ?? [];
    set({ components: current.includes(comp) ? current.filter((c) => c !== comp) : [...current, comp] });
  };

  const isItems = filterSet === "equipment" || filterSet === "magic-items";
  const showBooks = ["classes", "subclasses", "races", "feats", "backgrounds"].includes(filterSet) && (options?.books?.length ?? 0) > 1;
  const chips = activeFilters(filters, options);

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by name or text..."
          value={filters.query}
          onChange={(e) => set({ query: e.target.value })}
          className="w-full pl-10 pr-10 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-white placeholder-gray-500"
        />
        {filters.query && (
          <button type="button" onClick={() => set({ query: "" })} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-200">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        {filterSet === "rules" ? (
          <SelectFilter label="Kind" value={filters.ruleKind} onChange={(ruleKind) => set({ ruleKind })} anyLabel="All rules" options={RULE_KINDS} />
        ) : (
          <>
            <SelectFilter
              label="Edition"
              value={filters.edition}
              onChange={(edition) => set({ edition: edition as Edition | undefined })}
              anyLabel="All editions"
              options={Object.entries(EDITION_LABELS).map(([value, label]) => ({ value, label }))}
            />
            <SelectFilter
              label="Source"
              value={filters.source}
              onChange={(source) => set({ source: source as Source | undefined })}
              anyLabel="All sources"
              options={[{ value: "Official", label: "Official" }, { value: "Unofficial", label: "Third-party" }, { value: "Homebrew", label: "Homebrew" }]}
            />
          </>
        )}

        {showBooks && (
          <SelectFilter label="Book" value={filters.sourceBook} onChange={(sourceBook) => set({ sourceBook })} anyLabel="All books" options={options!.books!} className="w-full sm:w-60" />
        )}

        {filterSet === "spells" && (
          <>
            <SelectFilter
              label="Spell level"
              value={filters.level?.toString()}
              onChange={(level) => set({ level: level === undefined ? undefined : Number(level) })}
              anyLabel="All levels"
              options={[{ value: "0", label: "Cantrip" }, ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((l) => ({ value: String(l), label: `Level ${l}` }))]}
            />
            <SelectFilter label="School" value={filters.school} onChange={(school) => set({ school: school as SpellSchool | undefined })} anyLabel="All schools" options={SCHOOLS} />
            <SelectFilter label="Class list" value={filters.class} onChange={(cls) => set({ class: cls })} anyLabel="All classes" options={options?.spellClasses ?? []} />
            <Field label="Components" className="w-auto">
              <div className="flex gap-1.5">
                {COMPONENTS.map((comp) => (
                  <Chip key={comp.id} active={filters.components?.includes(comp.id) ?? false} onClick={() => toggleComponent(comp.id)} title={`Only spells that need a ${comp.label.toLowerCase()} component`}>
                    {comp.short}
                  </Chip>
                ))}
              </div>
            </Field>
            <Field label="Only" className="w-auto">
              <div className="flex gap-1.5">
                <Chip active={filters.concentration === true} onClick={() => set({ concentration: filters.concentration ? undefined : true })}>Concentration</Chip>
                <Chip active={filters.ritual === true} onClick={() => set({ ritual: filters.ritual ? undefined : true })}>Ritual</Chip>
              </div>
            </Field>
          </>
        )}

        {filterSet === "classes" && (
          <SelectFilter
            label="Spellcasting"
            value={filters.casterType}
            onChange={(casterType) => set({ casterType })}
            anyLabel="Any"
            options={Object.entries(CASTER_TYPE_LABELS).map(([value, label]) => ({ value, label }))}
          />
        )}

        {filterSet === "subclasses" && (
          <SelectFilter label="Class" value={filters.parentClass} onChange={(parentClass) => set({ parentClass })} anyLabel="All classes" options={options?.parentClasses ?? []} />
        )}

        {filterSet === "races" && (
          <SelectFilter label="Size" value={filters.size} onChange={(size) => set({ size })} anyLabel="Any size" options={SIZES} />
        )}

        {filterSet === "feats" && (
          <SelectFilter
            label="Category"
            value={filters.featCategory}
            onChange={(featCategory) => set({ featCategory: featCategory as FeatCategory | undefined })}
            anyLabel="All categories"
            options={FEAT_CATEGORIES}
          />
        )}

        {isItems && (
          <SelectFilter
            label="Type"
            value={filters.itemType}
            onChange={(itemType) => set({ itemType })}
            anyLabel="All types"
            options={filterSet === "equipment" ? EQUIPMENT_TYPES : MAGIC_ITEM_TYPES}
          />
        )}

        {filterSet === "equipment" && (
          <>
            <RangeDropdown
              label="Price"
              unit="gp"
              icon={<Coins className="w-3.5 h-3.5 text-yellow-500" />}
              stops={stopsUpTo(PRICE_LADDER, options?.highestPrice)}
              format={priceText}
              min={filters.minCost}
              max={filters.maxCost}
              onChange={(minCost, maxCost) => set({ minCost, maxCost })}
            />
            <RangeDropdown
              label="Weight"
              unit="lb"
              icon={<Weight className="w-3.5 h-3.5" />}
              stops={stopsUpTo(WEIGHT_LADDER, options?.highestWeight)}
              format={weightText}
              min={filters.minWeight}
              max={filters.maxWeight}
              onChange={(minWeight, maxWeight) => set({ minWeight, maxWeight })}
            />
          </>
        )}

        {filterSet === "magic-items" && (
          <>
            <SelectFilter label="Rarity" value={filters.rarity} onChange={(rarity) => set({ rarity })} anyLabel="Any rarity" options={options?.rarities ?? RARITIES} />
            <SelectFilter
              label="Attunement"
              value={filters.attunement === undefined ? undefined : filters.attunement ? "yes" : "no"}
              onChange={(value) => set({ attunement: value === undefined ? undefined : value === "yes" })}
              anyLabel="Any"
              options={[{ value: "yes", label: "Required" }, { value: "no", label: "Not required" }]}
            />
            <Field label="Bonus" className="w-auto">
              <div className="flex gap-1.5">
                {(options?.bonuses ?? [1, 2, 3]).map((bonus) => (
                  <Chip key={bonus} active={filters.magicBonus === bonus} onClick={() => set({ magicBonus: filters.magicBonus === bonus ? undefined : bonus })} title={`Only +${bonus} items`}>
                    +{bonus}
                  </Chip>
                ))}
              </div>
            </Field>
          </>
        )}
      </div>

      {/* What's filtering the list right now, each removable on its own */}
      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500">Filtered by:</span>
          {chips.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => set(chip.clear)}
              className="inline-flex items-center gap-1 text-xs pl-2.5 pr-1.5 py-1 rounded-full bg-brand-900/40 border border-brand-800/60 text-brand-200 hover:bg-brand-900/70 transition-colors"
            >
              {chip.label}
              <X className="w-3 h-3" aria-label="Remove" />
            </button>
          ))}
          <button
            type="button"
            onClick={() => onFiltersChange({ query: "", itemCategory: filters.itemCategory })}
            className="text-xs text-gray-400 hover:text-brand-300 underline underline-offset-2 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
