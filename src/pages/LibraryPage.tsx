import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import { Library, filterCategory } from "../components/Library";
import { LIBRARY_CATEGORIES, categoryById } from "../components/library/categories";
import { LibraryShell, LibraryEntrySkeleton } from "../components/library/LibraryShell";
import { LibraryEntry, findEntry } from "../components/library/LibraryEntry";
import { editionsDiffer } from "../components/library/edition-content";
import { useLibraryData } from "../components/library/useLibraryData";

/** /library — one tile per section, with how many entries each holds. */
export function LibraryPage() {
    const data = useLibraryData();

    return (
        <LibraryShell
            title="The Universal Library"
            subtitle="Every spell, class, ancestry, feat, background, and item in the archive"
            icon={BookOpen}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {LIBRARY_CATEGORIES.map((category) => {
                    const Icon = category.icon;
                    const count = filterCategory(category.id, data, { query: "" }).length;
                    return (
                        <Link
                            key={category.id}
                            to={`/library/${category.id}`}
                            className="group relative flex flex-col gap-3 p-5 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:border-brand-600/60 hover:shadow-lg hover:shadow-brand-900/20 transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div className="w-10 h-10 rounded-lg bg-brand-900/40 border border-brand-800/40 flex items-center justify-center">
                                    <Icon className="w-5 h-5 text-brand-400" />
                                </div>
                                <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300 tabular-nums">
                                    {data.loading && count === 0 ? "…" : count}
                                </span>
                            </div>
                            <div>
                                <h2 className="font-serif text-lg text-gray-100 group-hover:text-brand-300 transition-colors">{category.label}</h2>
                                <p className="text-sm text-gray-400 mt-1">{category.blurb}</p>
                            </div>
                            <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-brand-400 group-hover:text-brand-300">
                                Browse
                                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                            </span>
                        </Link>
                    );
                })}
            </div>
            <p className="mt-10 text-xs text-gray-600 max-w-3xl">
                Equipment, magic items and rules reference include material from the System Reference Document 5.2.1 and 5.1
                by Wizards of the Coast LLC, licensed under{" "}
                <a href="https://creativecommons.org/licenses/by/4.0/legalcode" target="_blank" rel="noreferrer" className="underline hover:text-gray-400">CC BY 4.0</a>.
            </p>
        </LibraryShell>
    );
}

/** /library/:category — the searchable list for one section. */
export function LibraryCategoryPage() {
    const { category: categoryId } = useParams();
    const category = categoryById(categoryId);
    const data = useLibraryData();

    if (!category) return <Navigate to="/library" replace />;
    // Keyed so each section starts from its own saved filters.
    return <Library key={category.id} category={category} data={data} />;
}

/** /library/:category/:id — one entry, in full. */
export function LibraryEntryPage() {
    const { category: categoryId, id } = useParams();
    const category = categoryById(categoryId);
    const shared = useLibraryData();
    const legacy = useLibraryData("2014");
    const modern = useLibraryData("2024");
    const [params, setParams] = useSearchParams();

    if (!category || !id) return <Navigate to="/library" replace />;
    const oldEntry = findEntry(category, id, legacy);
    const newEntry = findEntry(category, id, modern);
    const ready = !legacy.loading && !modern.loading;
    const year = params.get("edition") === "2014" ? "2014" : "2024";
    const selected = year === "2014" ? legacy : modern;
    const data = findEntry(category, id, selected) ? selected : newEntry ? modern : oldEntry ? legacy : shared;
    const differs = category.id !== "subclasses" && editionsDiffer(oldEntry, newEntry);
    const control = ready && differs ? (
        <div className="mb-6 flex items-center gap-3" role="group" aria-label="Rules version">
            <span className="text-sm text-gray-400">Rules version</span>
            {(["2014", "2024"] as const).map((edition) => (
                <button key={edition} type="button" aria-pressed={year === edition}
                    className={`rounded-lg border px-3 py-2 text-sm ${year === edition ? "border-brand-500 bg-brand-900/50 text-white" : "border-zinc-700 text-gray-300 hover:bg-zinc-800"}`}
                    onClick={() => setParams(previous => { const next = new URLSearchParams(previous); next.set("edition", edition); return next; })}>
                    {edition === "2014" ? "5e · 2014" : "5.5e · 2024"}
                </button>
            ))}
        </div>
    ) : null;
    if (!ready) return <LibraryEntrySkeleton category={category} />;
    return <LibraryEntry category={category} id={id} data={data} editionControl={control} />;
}
