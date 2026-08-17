/**
 * Saves the sheet as a standalone HTML file.
 *
 * The file is the pages as they stand — every value written into the markup, so
 * it opens showing exactly what was on screen — and it stays a sheet rather than
 * a picture of one: the blanks are still blanks, the markers still click, the
 * spell cards still open, and the arithmetic between them still runs.
 *
 * Three things make that possible without shipping the app:
 *
 *  - The pages are cloned from the live DOM, so the layout needs no second
 *    implementation and cannot drift from the one on screen.
 *  - Every marker is rendered here in each of its states and the markup
 *    harvested, so the file can swap states in without React.
 *  - `public/character-sheet/exported-sheet.js` is inlined as the runtime. It is
 *    a public asset rather than a bundled module precisely so that nothing a
 *    build does can rename what it reaches for.
 *
 * What does not survive is the Archive: a standalone file has nothing to search,
 * so the suggestion menus are stripped and the fields the sheet had looked up
 * are frozen as written — and, like everything else, left editable. The one
 * Archive-shaped thing that is carried is the level table page 1 bakes into
 * `data-cs-derived`, which is what keeps hit dice, hit points, the class
 * resource and the spell slots honest when the Level blank is edited.
 */
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { createElement, type ReactNode } from "react";
import type { SheetSpell } from "../../hooks/useSheetSuggestions";
import { SHEET_HEIGHT, SHEET_WIDTH } from "./CharacterSheetA4";
import { PASSIVE_PERCEPTION_FEATS } from "./CharacterSheetA4Page2";
import { SpellDetails } from "./CharacterSheetA4Page3";
import { MARKER_VARIANTS } from "./markers";
import { removeScreenOnlyControls } from "./pdf-fields";

/** The markup one marker wears in one of its states. */
interface MarkerTemplate {
    className: string;
    pressed: string;
    stateLabel: string;
    html: string;
}

/**
 * Renders a handful of React nodes and hands back their markup.
 *
 * Off to the side of the page and torn down straight after: nothing here is
 * ever shown, it exists only to be read.
 */
function renderToMarkup<T>(read: (render: (node: ReactNode) => Element | null) => T): T {
    const host = document.createElement("div");
    host.style.cssText = "position:fixed;left:-99999px;top:0;width:0;height:0;overflow:hidden";
    document.body.appendChild(host);
    const root = createRoot(host);

    try {
        return read((node) => {
            flushSync(() => root.render(node));
            return host.firstElementChild;
        });
    } finally {
        root.unmount();
        host.remove();
    }
}

/** Every marker kind, in the order its states cycle through. */
function harvestMarkers(): Record<string, MarkerTemplate[]> {
    return renderToMarkup((render) => {
        const harvested: Record<string, MarkerTemplate[]> = {};
        for (const variant of MARKER_VARIANTS) {
            harvested[variant.kind] = variant.states.map((state) => {
                const button = render(state);
                return {
                    className: button?.className ?? "",
                    pressed: button?.getAttribute("aria-pressed") ?? "false",
                    stateLabel: button?.getAttribute("data-cs-state-label") ?? "",
                    html: button?.innerHTML ?? "",
                };
            });
        }
        return harvested;
    });
}

/**
 * The hover card for each spell the sheet has written down, ready to be hung
 * off the row that names it.
 *
 * Rendered here rather than rebuilt by the runtime so the card in the file is
 * the card from the sheet, down to the last class name.
 */
function harvestSpellCards(spells: SheetSpell[]): Map<string, Element> {
    if (!spells.length) return new Map();

    return renderToMarkup((render) => {
        const cards = new Map<string, Element>();
        for (const spell of spells) {
            const card = render(
                createElement(SpellDetails, { spell, anchorRef: { current: null }, open: true }),
            );
            if (!card) continue;
            const detached = card.cloneNode(true) as Element;
            detached.setAttribute("data-cs-card", "");
            detached.setAttribute("hidden", "");
            cards.set(spell.name.trim().toLowerCase(), detached);
        }
        return cards;
    });
}

/**
 * Writes each field's value into the markup, so the file opens on the sheet as
 * it stood rather than on a blank one.
 *
 * A value React holds as a property leaves no trace in the markup, which is
 * what makes this necessary: a clone of a filled-in sheet serialises empty.
 * Cloning preserves document order, so the live fields and their copies line up
 * one for one.
 */
function bakeFieldValues(live: Element, clone: Element) {
    const selector = "input, textarea";
    const liveFields = live.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(selector);
    const clonedFields = clone.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(selector);

    liveFields.forEach((field, index) => {
        const copy = clonedFields[index];
        if (!copy) return;

        if (copy.tagName === "TEXTAREA") copy.textContent = field.value;
        else copy.setAttribute("value", field.value);

        // Every blank is the player's, including the ones the sheet would only
        // let itself write — a single class's Hit Die among them.
        copy.removeAttribute("readonly");
    });
}

/**
 * Takes out what only existed to search the Archive: the panels' lookup fields,
 * any menu that happened to be open, and the combobox roles on blanks that no
 * longer have a menu to open.
 */
function removeSearchAffordances(root: Element) {
    removeScreenOnlyControls(root);
    root.querySelectorAll('[role="listbox"]').forEach((menu) => menu.remove());
    root.querySelectorAll('[role="combobox"]').forEach((field) => {
        field.removeAttribute("role");
        field.removeAttribute("aria-expanded");
        field.removeAttribute("aria-autocomplete");
        field.removeAttribute("aria-activedescendant");
    });
}

/** Hangs each filled spell row's card off the row, for the runtime to open. */
function attachSpellCards(root: Element, cards: Map<string, Element>) {
    root.querySelectorAll('[data-cs="spell-name"]').forEach((anchor) => {
        const name = anchor.querySelector("input")?.getAttribute("value")?.trim().toLowerCase();
        const card = name ? cards.get(name) : undefined;
        if (card) anchor.appendChild(card.cloneNode(true));
    });
}

/**
 * The page's own styles, inlined so the file stands alone.
 *
 * Two kinds of rule cannot simply be copied across. A cross-origin stylesheet
 * cannot be read at all — the webfonts are served from Google — and an `@import`
 * is only honoured at the top of a stylesheet, so one carried over from the
 * middle of the third sheet would be silently dropped. Both become links in the
 * head instead.
 *
 * Either way the sheet names a system fallback, and the runtime re-fits every
 * blank once the fonts settle, so a file opened with no connection is laid out
 * correctly rather than overflowing its boxes.
 */
function collectStyles() {
    const inline: string[] = [];
    const links: string[] = [];

    for (const sheet of Array.from(document.styleSheets)) {
        let rules: CSSRule[];
        try {
            rules = Array.from(sheet.cssRules);
        } catch {
            if (sheet.href) links.push(sheet.href);
            continue;
        }

        for (const rule of rules) {
            if (rule instanceof CSSImportRule) {
                if (rule.href) links.push(new URL(rule.href, sheet.href ?? location.href).href);
            } else {
                inline.push(rule.cssText);
            }
        }
    }

    return { css: inline.join("\n"), links: Array.from(new Set(links)) };
}

/** An empty image, so an icon painted by a rule never flashes a broken glyph. */
const BLANK_IMAGE = "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'/%3E";

const ASSET_PATTERN = /src="(\/[^"]+)"/g;

/**
 * Every icon the file needs, inlined once each and painted from a stylesheet.
 *
 * The sheet draws the same rings, dividers and component glyphs over and over —
 * better than a thousand images across the four pages, out of seventy-nine
 * files. Writing a data URI into each `src` spent a megabyte and a half saying
 * the same seventy-nine things, so each is written once as a rule instead. The
 * markup stays as declarative as it was: nothing has to run for the file to
 * look right, which matters because these are what the sheet is drawn with.
 *
 * Every image on the sheet is sized by its own box rather than by the file
 * behind it, which is what makes a painted background an exact stand-in.
 */
class AssetLibrary {
    private readonly ids = new Map<string, number>();
    private readonly rules: string[] = [];

    /** Reads the icons out of live markup and out of harvested markup alike. */
    static collect(roots: Element[], markup: string[]) {
        const urls = new Set<string>();
        for (const root of roots) {
            root.querySelectorAll("img[src^='/']").forEach((image) => {
                urls.add(image.getAttribute("src")!);
            });
        }
        for (const html of markup) {
            for (const [, url] of html.matchAll(ASSET_PATTERN)) urls.add(url);
        }
        return urls;
    }

    async load(urls: Iterable<string>) {
        await Promise.all(
            Array.from(urls).map(async (url) => {
                try {
                    const response = await fetch(url);
                    if (!response.ok) return;
                    // SVG stays text: as a URI component it is barely larger
                    // than the file, where base64 would add a third.
                    const body = encodeURIComponent(await response.text());
                    const id = this.rules.length;
                    this.ids.set(url, id);
                    this.rules.push(
                        `img[data-cs-asset="${id}"]{background-image:url("data:image/svg+xml,${body}")}`,
                    );
                } catch (cause) {
                    // A missing icon is worth carrying on without: the blanks
                    // and the sums are what the file is for.
                    console.warn(`Could not inline ${url} into the HTML sheet`, cause);
                }
            }),
        );
        return this;
    }

    get css() {
        return [
            "img[data-cs-asset]{background-size:100% 100%;background-repeat:no-repeat}",
            ...this.rules,
        ].join("\n");
    }

    /** Points the images in a cloned page at their rules. */
    paint(root: Element) {
        root.querySelectorAll("img[src^='/']").forEach((image) => {
            const id = this.ids.get(image.getAttribute("src")!);
            if (id === undefined) return;
            image.setAttribute("data-cs-asset", String(id));
            image.setAttribute("src", BLANK_IMAGE);
        });
    }

    /** The same, for markup held as a string rather than as elements. */
    rewrite(html: string) {
        return html.replace(ASSET_PATTERN, (match, url: string) => {
            const id = this.ids.get(url);
            return id === undefined ? match : `src="${BLANK_IMAGE}" data-cs-asset="${id}"`;
        });
    }
}

/** Safe to sit inside a <script> block, and inside HTML generally. */
function embedJson(value: unknown) {
    return JSON.stringify(value).replace(/</g, "\\u003c");
}

function escapeHtml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

/**
 * The shell around the pages: a dark ground to read them against, the
 * fit-to-width boxes the runtime scales, and an A4 page each when printed.
 */
const SHELL_STYLES = `
:root { --cs-print-scale: 0.32; }
html { background: #18181b; }
body {
    margin: 0;
    background: #18181b;
    color: #a1a1aa;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, sans-serif;
}
.cs-download-note {
    margin: 0;
    padding: 14px 16px;
    text-align: center;
    font-size: 13px;
    line-height: 1.5;
}
.cs-download-pages {
    display: flex;
    max-width: 1700px;
    margin: 0 auto;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    padding-bottom: 32px;
}
.cs-download-stage { position: relative; overflow: hidden; }
.cs-download-scaler {
    transform-origin: top left;
    width: ${SHEET_WIDTH}px;
    height: ${SHEET_HEIGHT}px;
}
@media print {
    @page { size: A4 portrait; margin: 0; }
    html, body { background: #fff; }
    .cs-download-note { display: none; }
    .cs-download-pages { max-width: none; gap: 0; padding: 0; }
    .cs-download-stage { width: 210mm !important; height: 297mm !important; }
    .cs-download-stage + .cs-download-stage { break-before: page; page-break-before: always; }
    .cs-download-scaler { transform: scale(var(--cs-print-scale)) !important; }
}
`;

export interface HtmlExportOptions {
    /** The scaler around each page, in the order the sheet reads. */
    pages: HTMLElement[];
    /** The Archive's spells, for the cards the filled rows carry. */
    spells: SheetSpell[];
    /** Titles the file; the character's name where the sheet has one. */
    title: string;
}

/**
 * Builds the file and hands it to the browser. Everything it fetches — the
 * runtime and the icons — is same-origin, and it never touches the live sheet:
 * only clones of it.
 */
export async function downloadSheetHtml({ pages, spells, title }: HtmlExportOptions) {
    await document.fonts?.ready;

    const runtime = await fetch("/character-sheet/exported-sheet.js").then((response) => {
        if (!response.ok) throw new Error(`Sheet runtime unavailable (${response.status})`);
        return response.text();
    });
    // The runtime is inlined into a <script> block, where this sequence would
    // close it early and leave the rest of it on the page as text. Nothing in
    // the runtime needs to write it, so refusing is better than mangling it.
    if (/<\/script/i.test(runtime)) {
        throw new Error("The sheet runtime cannot contain a closing script tag");
    }

    const roots = pages
        .map((page) => page.querySelector(".cs-root") ?? page.firstElementChild)
        .filter((root): root is Element => Boolean(root));
    if (!roots.length) throw new Error("There is no sheet on the page to download");

    // Only the spells actually written down need a card, so a sheet with three
    // spells on it does not carry the whole library.
    const written = new Set<string>();
    for (const root of roots) {
        root.querySelectorAll('[data-cs="spell-name"] input').forEach((field) => {
            const name = (field as HTMLInputElement).value.trim().toLowerCase();
            if (name) written.add(name);
        });
    }
    const cards = harvestSpellCards(
        spells.filter((spell) => written.has(spell.name.trim().toLowerCase())),
    );
    const markers = harvestMarkers();

    const clones = roots.map((root) => {
        const clone = root.cloneNode(true) as Element;
        bakeFieldValues(root, clone);
        removeSearchAffordances(clone);
        attachSpellCards(clone, cards);
        return clone;
    });

    // The markers' harvested markup carries icons of its own, and it is a string
    // by the time it reaches the file, so the library reads both.
    const markerMarkup = Object.values(markers).flatMap((states) =>
        states.map((state) => state.html),
    );
    const assets = await new AssetLibrary().load(
        AssetLibrary.collect(clones, markerMarkup),
    );

    const stages = clones.map((clone) => {
        assets.paint(clone);

        const scaler = document.createElement("div");
        scaler.className = "cs-download-scaler";
        scaler.appendChild(clone);

        const stage = document.createElement("div");
        stage.className = "cs-download-stage";
        stage.appendChild(scaler);
        return stage.outerHTML;
    });

    const { css, links } = collectStyles();
    const exportData = {
        markers: Object.fromEntries(
            Object.entries(markers).map(([kind, states]) => [
                kind,
                states.map((state) => ({ ...state, html: assets.rewrite(state.html) })),
            ]),
        ),
        passivePerceptionFeats: PASSIVE_PERCEPTION_FEATS,
        sheetWidth: SHEET_WIDTH,
    };

    const document_ = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
${links.map((href) => `<link rel="stylesheet" href="${escapeHtml(href)}">`).join("\n")}
<style>${css}</style>
<style>${SHELL_STYLES}</style>
<style>${assets.css}</style>
</head>
<body>
<p class="cs-download-note">
    Your character sheet, saved on ${escapeHtml(new Date().toLocaleDateString())}. Every blank is
    still yours to change and the sheet keeps its sums — but nothing here is saved, so download
    again to keep what you write.
</p>
<div class="cs-download-pages">
${stages.join("\n")}
</div>
<script type="application/json" id="cs-export-data">${embedJson(exportData)}</script>
<script>${runtime}</script>
</body>
</html>
`;

    const url = URL.createObjectURL(new Blob([document_], { type: "text/html" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "dnd-character-sheet.html";
    link.click();
    // Long enough for the browser to have taken the blob off the link.
    window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
