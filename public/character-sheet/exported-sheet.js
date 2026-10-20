/**
 * The character sheet once it has been downloaded as a standalone HTML file.
 *
 * The download carries the four pages exactly as they were on screen, with
 * every value written into the markup, and this brings back the parts of the
 * sheet that were React: the markers you click, the blanks that shrink to fit,
 * the spell cards that open on hover, and the arithmetic between them.
 *
 * What it deliberately does not bring back is the Archive. There is nothing to
 * search a standalone file against, so the fields the sheet had *looked up* —
 * class features, species traits, a spell's time and range — are frozen as they
 * were written and simply stay editable. What is recomputed is what follows
 * from the numbers on the page, plus the level table the download was handed:
 * see `derived` below.
 *
 * Plain ES5-flavoured JavaScript, served as a public asset rather than bundled,
 * so it is inlined into the download verbatim and no build step can rename
 * anything it depends on.
 */
(function () {
    "use strict";

    var data = {};
    try {
        var blob = document.getElementById("cs-export-data");
        data = blob ? JSON.parse(blob.textContent) : {};
    } catch (cause) {
        console.error("Could not read this sheet's export data", cause);
    }

    var markers = data.markers || {};
    var passivePerceptionFeats = data.passivePerceptionFeats || {};
    var sheetWidth = data.sheetWidth || 2480;

    /**
     * The level-driven values the page was handed at download: for every level
     * 1-20, the proficiency bonus, hit dice, class resource, spell slots and
     * maximum hit points by Constitution modifier. Absent when the sheet named
     * no class, which leaves all of those fields alone.
     */
    var derived = null;
    var derivedNode = document.querySelector("[data-cs-derived]");
    if (derivedNode) {
        try {
            derived = JSON.parse(derivedNode.getAttribute("data-cs-derived"));
        } catch (cause) {
            console.error("Could not read this sheet's level table", cause);
        }
    }

    function all(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    /* -------------------------------------------------------------- */
    /* Fit to width                                                    */
    /* -------------------------------------------------------------- */

    /**
     * Each page is drawn at its designed 2480px and scaled down to whatever
     * width the window gives it, exactly as the site does — so the layout is
     * identical at every size rather than reflowing.
     */
    function fitPages() {
        all(".cs-download-stage").forEach(function (stage) {
            var scaler = stage.firstElementChild;
            if (!scaler) return;
            var available = stage.parentNode.clientWidth;
            var scale = available / sheetWidth;
            scaler.style.transform = "scale(" + scale + ")";
            stage.style.width = available + "px";
            stage.style.height = scaler.offsetHeight * scale + "px";
        });
    }

    /**
     * A4 is 210mm wide however many pixels that is on the machine doing the
     * printing, so the print scale is measured rather than assumed.
     */
    function setPrintScale() {
        var probe = document.createElement("div");
        probe.style.cssText = "position:absolute;visibility:hidden;width:210mm";
        document.body.appendChild(probe);
        var millimetres = probe.offsetWidth;
        document.body.removeChild(probe);
        if (millimetres) {
            document.documentElement.style.setProperty(
                "--cs-print-scale",
                String(millimetres / sheetWidth),
            );
        }
    }

    /* -------------------------------------------------------------- */
    /* Shrink to fit                                                   */
    /* -------------------------------------------------------------- */

    /** Floor on the shrink, as a share of the designed size. */
    var MIN_FIT_SCALE = 0.35;
    /** Room left for the caret and for sub-pixel rounding, in design px. */
    var FIT_PADDING = 4;

    var fitContext = null;

    function measureText(text, style, fontSize) {
        if (!fitContext) {
            var canvas = document.createElement("canvas");
            fitContext = canvas.getContext("2d");
        }
        if (!fitContext) return 0;
        fitContext.font =
            style.fontStyle + " " + style.fontWeight + " " + fontSize + "px " + style.fontFamily;
        var spacing = parseFloat(style.letterSpacing);
        return (
            fitContext.measureText(text).width + (isNaN(spacing) ? 0 : spacing * text.length)
        );
    }

    /**
     * Keeps a value inside the box the design drew for it. The sheet is a fixed
     * A4 canvas, so a blank cannot grow to meet its contents: a long value
     * steps down a size instead of being clipped.
     *
     * The designed size is whatever the field's own stylesheet gives it, read
     * once before any fitted size is written over the top — which is why the
     * download strips the fitted sizes it was carrying on the way out.
     */
    function fitField(field) {
        if (!field.dataset.csDesignSize) {
            field.style.fontSize = "";
            field.dataset.csDesignSize = String(
                parseFloat(window.getComputedStyle(field).fontSize) || 0,
            );
        }
        var design = Number(field.dataset.csDesignSize);
        var available = field.clientWidth - FIT_PADDING;
        if (!design || available <= 0) return;

        var text = "value" in field ? field.value : field.textContent;
        var needed = measureText(text || "", window.getComputedStyle(field), design);
        var scale = needed > available ? Math.max(MIN_FIT_SCALE, available / needed) : 1;
        field.style.fontSize = scale < 1 ? design * scale + "px" : "";
    }

    function fitAllFields() {
        all("[data-cs-fit]").forEach(fitField);
    }

    /* -------------------------------------------------------------- */
    /* Markers                                                         */
    /* -------------------------------------------------------------- */

    /**
     * The markers cycle through markup the download harvested from the sheet
     * itself, one entry per state, so a clicked marker looks exactly as it
     * would have on the site.
     */
    function applyMarkerState(button, state) {
        var states = markers[button.getAttribute("data-cs-marker")];
        if (!states || !states.length) return;
        var template = states[((state % states.length) + states.length) % states.length];
        if (!template) return;

        button.setAttribute("data-cs-state", String(state));
        button.setAttribute("data-cs-state-label", template.stateLabel);
        button.className = template.className;
        button.setAttribute("aria-pressed", template.pressed);
        button.title = (button.getAttribute("data-cs-label") || "") + ": " + template.stateLabel;
        button.innerHTML = template.html;
    }

    function markerState(button) {
        return Number(button.getAttribute("data-cs-state")) || 0;
    }

    document.addEventListener("click", function (event) {
        var target = event.target;
        var button = target && target.closest ? target.closest("[data-cs-marker]") : null;
        if (!button) return;
        var states = markers[button.getAttribute("data-cs-marker")];
        if (!states || !states.length) return;
        applyMarkerState(button, (markerState(button) + 1) % states.length);
        recompute();
    });

    /* -------------------------------------------------------------- */
    /* Fields                                                          */
    /* -------------------------------------------------------------- */

    function fieldIn(container) {
        return container ? container.querySelector("input, textarea") : null;
    }

    function fieldValue(container) {
        var field = fieldIn(container);
        return field ? field.value : "";
    }

    /**
     * Writes a value the sheet derives into a blank that is still the player's
     * to change.
     *
     * An edit stands for as long as the derived value behind it stands: the
     * moment the sheet works out something new — a score changed, a level was
     * raised — the new answer wins, which is how the same fields behave on the
     * site. `data-cs-auto` carries the derived value the field was last
     * written against, and the download seeds it from the live sheet so an
     * edit made before downloading is not undone on opening the file.
     */
    function applyDerived(container, next) {
        if (!container) return;
        if (container.getAttribute("data-cs-auto") === next) return;
        container.setAttribute("data-cs-auto", next);

        var field = fieldIn(container);
        if (!field || field.value === next) return;
        field.value = next;
        if (field.hasAttribute("data-cs-fit")) fitField(field);
    }

    /** Read-only text the sheet works out, such as a skill's total. */
    function applyOutput(element, next) {
        if (!element || element.textContent === next) return;
        element.textContent = next;
        if (element.hasAttribute("data-cs-fit")) fitField(element);
    }

    /* -------------------------------------------------------------- */
    /* The rules the sheet keeps applying                              */
    /* -------------------------------------------------------------- */

    /** PHB: modifier = (score − 10) ÷ 2, rounded down. */
    function abilityModifier(score) {
        return Math.floor((score - 10) / 2);
    }

    /** Modifiers are always written with their sign, "+0" included. */
    function formatModifier(modifier) {
        return modifier >= 0 ? "+" + modifier : String(modifier);
    }

    /** Appended into one list, blanks and repeats dropped. */
    function appendList(entries) {
        var seen = {};
        var out = [];
        entries.forEach(function (entry) {
            String(entry == null ? "" : entry)
                .split("/")
                .forEach(function (part) {
                    var trimmed = part.trim();
                    if (!trimmed) return;
                    var key = trimmed.toLowerCase();
                    if (seen[key]) return;
                    seen[key] = true;
                    out.push(trimmed);
                });
        });
        return out.join(" / ");
    }

    /** The name a panel line stands for; "Name: notes" is read by its name. */
    function lineName(line) {
        return String(line || "").split(":")[0].trim();
    }

    /** The names out of a panel, one per line — how the sheet fills them in. */
    function entryNames(text) {
        return String(text || "")
            .split("\n")
            .map(lineName)
            .filter(Boolean);
    }

    function parseWholeNumber(value) {
        var trimmed = String(value || "").trim();
        return /^\+?\d+$/.test(trimmed) ? parseInt(trimmed, 10) : null;
    }

    /** Everything the sheet re-derives, in the order the values depend on. */
    function recompute() {
        var levelAt = derived && derived.byLevel;
        var level = parseWholeNumber(fieldValue(document.querySelector('[data-cs="level"]')));
        var atLevel = level && levelAt ? levelAt[level] : null;

        // Proficiency bonus, from the level. The table holds it where a class
        // was named; the rule behind it holds either way.
        var profBonusBox = document.querySelector('[data-cs="prof-bonus"]');
        applyDerived(
            profBonusBox,
            level
                ? atLevel
                    ? atLevel.proficiencyBonus
                    : formatModifier(2 + Math.floor((level - 1) / 4))
                : "",
        );
        var profBonus = parseWholeNumber(fieldValue(profBonusBox));

        // Ability scores and the modifiers the rules take from them.
        var modifiers = {};
        all('[data-cs="ability"]').forEach(function (card) {
            var ability = card.getAttribute("data-cs-ability");
            var score = parseWholeNumber(fieldValue(card));
            var modifier = score === null ? null : abilityModifier(score);
            modifiers[ability] = modifier;
            applyOutput(
                card.querySelector("output"),
                modifier === null ? "" : formatModifier(modifier),
            );
        });

        function modifierFor(ability) {
            var modifier = modifiers[String(ability || "").trim().toUpperCase()];
            return typeof modifier === "number" ? modifier : null;
        }

        // Skills: the ability's modifier, plus the proficiency bonus once for a
        // filled ring and twice for expertise.
        var perceptionLevel = 0;
        all('[data-cs="skill"]').forEach(function (row) {
            var ring = row.querySelector("[data-cs-marker]");
            var rank = ring ? markerState(ring) : 0;
            var modifier = modifierFor(row.getAttribute("data-cs-ability"));
            if (
                rank > 0 &&
                row.getAttribute("data-cs-ability") === "WIS" &&
                row.getAttribute("data-cs-skill") === "Perception"
            ) {
                perceptionLevel = rank;
            }
            applyOutput(
                row.querySelector("output"),
                rank > 0 && modifier !== null && profBonus !== null
                    ? formatModifier(modifier + profBonus * rank)
                    : "",
            );
        });

        // Armor Class and Initiative, both off Dexterity.
        var dexterity = modifierFor("DEX");
        applyDerived(
            document.querySelector('[data-cs="armor-class"]'),
            dexterity === null ? "" : String(10 + dexterity),
        );
        applyDerived(
            document.querySelector('[data-cs="initiative"]'),
            dexterity === null ? "" : formatModifier(dexterity),
        );

        // Passive Perception: ten plus the Perception modifier, and whatever the
        // feats named on page 2 add to it. The panel is read by its own element
        // rather than through fieldIn, which would have found the lookup field
        // beside it on a sheet that still had one.
        var wisdom = modifierFor("WIS");
        var featsPanel = document.querySelector('[data-cs="feats"] textarea');
        var featBonus = 0;
        entryNames(featsPanel ? featsPanel.value : "").forEach(function (feat) {
            featBonus += passivePerceptionFeats[feat.toLowerCase()] || 0;
        });
        applyDerived(
            document.querySelector('[data-cs="passive-perception"]'),
            wisdom === null
                ? ""
                : String(10 + wisdom + (profBonus || 0) * perceptionLevel + featBonus),
        );

        // The class-feature save DC, off whichever ability the sheet named.
        var skillSaveBox = document.querySelector('[data-cs="skill-save-dc"]');
        if (skillSaveBox) {
            var saveModifier = modifierFor(skillSaveBox.getAttribute("data-cs-abilities"));
            applyDerived(
                skillSaveBox,
                profBonus !== null && saveModifier !== null
                    ? String(8 + profBonus + saveModifier)
                    : "",
            );
        }

        // The spellbook's own two numbers, one entry per casting ability so a
        // multiclassed caster keeps both.
        all('[data-cs="spell-save-dc"], [data-cs="spell-attack-bonus"]').forEach(function (tile) {
            var attack = tile.getAttribute("data-cs") === "spell-attack-bonus";
            var castingModifiers = String(tile.getAttribute("data-cs-abilities") || "")
                .split("/")
                .map(modifierFor)
                .filter(function (modifier) {
                    return modifier !== null;
                });
            applyDerived(
                tile,
                profBonus === null
                    ? ""
                    : appendList(
                          castingModifiers.map(function (modifier) {
                              return attack
                                  ? formatModifier(profBonus + modifier)
                                  : String(8 + profBonus + modifier);
                          }),
                      ),
            );
        });

        // What the level table answers: hit dice, the class resource, maximum
        // hit points and the spell slots each block is headed with.
        //
        // The table splits a multiclassed character's levels evenly, as the
        // sheet does when it first writes them, so hand-editing the Hit Die
        // field here changes that field alone.
        if (atLevel) {
            applyDerived(document.querySelector('[data-cs="hit-dice"]'), atLevel.hitDice);
            applyDerived(document.querySelector('[data-cs="class-points"]'), atLevel.points);

            var constitution = modifierFor("CON");
            var maximum = atLevel.maxHitPoints[constitution === null ? 0 : constitution];
            applyDerived(
                document.querySelector('[data-cs="max-hit-points"]'),
                maximum ? String(maximum) : "",
            );

            all('[data-cs="slot-total"]').forEach(function (box) {
                var slots = atLevel.slots[box.getAttribute("data-cs-level")];
                applyDerived(box, slots ? String(slots) : "");
            });
        }
    }

    /* -------------------------------------------------------------- */
    /* Spell cards                                                     */
    /* -------------------------------------------------------------- */

    /** How tall a card would like to be, and the margin it keeps, in design px. */
    var DETAILS_HEIGHT = 620;
    var PAGE_MARGIN = 12;

    /**
     * Which side of its row a card opens on. Mirrors the site: stay below
     * unless flipping actually buys room, and never run past the page edge —
     * each page is clipped to its own A4 box.
     */
    function placeCard(anchor, card) {
        var page = anchor.closest(".cs-root");
        if (!page) return;

        var pageBox = page.getBoundingClientRect();
        var scale = page.offsetWidth ? pageBox.width / page.offsetWidth : 0;
        if (!scale) return;

        var anchorBox = anchor.getBoundingClientRect();
        var below = (pageBox.bottom - anchorBox.bottom) / scale - PAGE_MARGIN;
        var above = (anchorBox.top - pageBox.top) / scale - PAGE_MARGIN;
        var openBelow = below >= DETAILS_HEIGHT || below >= above;

        // The two placements SpellDetails draws itself with.
        card.classList.toggle("top-full", openBelow);
        card.classList.toggle("mt-[10px]", openBelow);
        card.classList.toggle("bottom-full", !openBelow);
        card.classList.toggle("mb-[10px]", !openBelow);
        card.style.maxHeight =
            Math.max(0, Math.min(DETAILS_HEIGHT, openBelow ? below : above)) + "px";
    }

    /* -------------------------------------------------------------- */
    /* Long press                                                      */
    /* -------------------------------------------------------------- */

    /** How long a finger rests before a card opens, and how far it may drift. */
    var LONG_PRESS_MS = 450;
    var LONG_PRESS_SLOP = 10;

    /**
     * A touch screen's hover: a finger held still on the element calls
     * onPress with where it rests, and the next touch anywhere calls onRelease.
     * A press that drifts, or that the browser takes over to scroll, is let go.
     */
    function onLongPress(element, onPress, onRelease) {
        var timer = null;
        var start = null;
        var fired = false;

        function cancel() {
            window.clearTimeout(timer);
            timer = null;
            start = null;
        }

        element.addEventListener("pointerdown", function (event) {
            fired = false;
            if (event.pointerType === "mouse") return;
            cancel();
            var point = { clientX: event.clientX, clientY: event.clientY };
            start = { x: event.clientX, y: event.clientY };
            timer = window.setTimeout(function () {
                fired = true;
                start = null;
                if (onPress(point) === false) return;
                window.setTimeout(function () {
                    document.addEventListener("pointerdown", onRelease, { once: true });
                }, 0);
            }, LONG_PRESS_MS);
        });
        element.addEventListener("pointermove", function (event) {
            if (!start) return;
            if (
                Math.abs(event.clientX - start.x) > LONG_PRESS_SLOP ||
                Math.abs(event.clientY - start.y) > LONG_PRESS_SLOP
            ) {
                cancel();
            }
        });
        element.addEventListener("pointerup", cancel);
        element.addEventListener("pointercancel", cancel);
        // Android opens the text menu on the same press; the card answers it.
        element.addEventListener("contextmenu", function (event) {
            if (fired) event.preventDefault();
        });
    }

    /**
     * A row's own spell card, held back while the blank is being typed into so
     * the card never sits over the value being written — unless a long press
     * asked for it.
     */
    function wireSpellCards() {
        all("[data-cs-card]").forEach(function (card) {
            var anchor = card.parentNode;
            var field = anchor.querySelector("input");
            var editing = false;
            var hovered = false;
            var pressed = false;

            function sync() {
                var open = pressed || (hovered && !editing);
                card.hidden = !open;
                if (open) placeCard(anchor, card);
            }

            anchor.addEventListener("pointerenter", function (event) {
                if (event.pointerType !== "mouse") return;
                hovered = true;
                sync();
            });
            anchor.addEventListener("pointerleave", function (event) {
                if (event.pointerType !== "mouse") return;
                hovered = false;
                sync();
            });
            onLongPress(
                anchor,
                function () {
                    pressed = true;
                    sync();
                },
                function () {
                    pressed = false;
                    sync();
                },
            );
            if (field) {
                field.addEventListener("focus", function () {
                    editing = true;
                    sync();
                });
                field.addEventListener("blur", function () {
                    editing = false;
                    sync();
                });
            }
        });
    }

    /* -------------------------------------------------------------- */
    /* Feature, trait and feat cards                                   */
    /* -------------------------------------------------------------- */

    var NOTE_CARD_HEIGHT = 620;
    var NOTE_CARD_WIDTH = 760;
    var NOTE_CARD_GAP = 10;

    var MIRRORED_PROPERTIES = [
        "boxSizing",
        "paddingTop",
        "paddingRight",
        "paddingBottom",
        "paddingLeft",
        "borderTopWidth",
        "borderRightWidth",
        "borderBottomWidth",
        "borderLeftWidth",
        "borderStyle",
        "fontFamily",
        "fontSize",
        "fontWeight",
        "fontStyle",
        "lineHeight",
        "letterSpacing",
        "textTransform",
    ];

    /**
     * The line under a point, found by laying the panel's text out again in an
     * unseen copy of it — the only way to know where a wrapped line falls. The
     * same measure as entry-notes.tsx on the site.
     */
    function lineAtPoint(field, clientY) {
        var page = field.closest(".cs-root");
        if (!page) return null;
        var pageBox = page.getBoundingClientRect();
        var scale = page.offsetWidth ? pageBox.width / page.offsetWidth : 0;
        if (!scale) return null;

        var fieldBox = field.getBoundingClientRect();
        var y = (clientY - fieldBox.top) / scale + field.scrollTop;

        var style = window.getComputedStyle(field);
        var mirror = document.createElement("div");
        MIRRORED_PROPERTIES.forEach(function (property) {
            mirror.style[property] = style[property];
        });
        mirror.style.position = "absolute";
        mirror.style.visibility = "hidden";
        mirror.style.left = "-99999px";
        mirror.style.top = "0";
        mirror.style.whiteSpace = "pre-wrap";
        mirror.style.overflowWrap = "break-word";
        mirror.style.width = field.offsetWidth + "px";

        var lines = field.value.split("\n");
        var rows = lines.map(function (line) {
            var row = document.createElement("div");
            row.textContent = line || "\u200b";
            mirror.appendChild(row);
            return row;
        });
        document.body.appendChild(mirror);

        var hit = null;
        for (var index = 0; index < rows.length; index++) {
            var row = rows[index];
            if (y >= row.offsetTop && y < row.offsetTop + row.offsetHeight) {
                if (lineName(lines[index])) {
                    var fieldTop = (fieldBox.top - pageBox.top) / scale - field.scrollTop;
                    hit = {
                        line: lines[index],
                        top: fieldTop + row.offsetTop,
                        bottom: fieldTop + row.offsetTop + row.offsetHeight,
                        left: (fieldBox.left - pageBox.left) / scale,
                    };
                }
                break;
            }
        }
        document.body.removeChild(mirror);
        return hit;
    }

    /** Below the line unless above buys more room, and never past the page. */
    function placeNoteCard(card, hit, page) {
        var below = page.offsetHeight - hit.bottom - NOTE_CARD_GAP - PAGE_MARGIN;
        var above = hit.top - NOTE_CARD_GAP - PAGE_MARGIN;
        var openBelow = below >= NOTE_CARD_HEIGHT || below >= above;
        card.style.left =
            Math.max(
                PAGE_MARGIN,
                Math.min(hit.left, page.offsetWidth - NOTE_CARD_WIDTH - PAGE_MARGIN),
            ) + "px";
        card.style.top = openBelow ? hit.bottom + NOTE_CARD_GAP + "px" : "";
        card.style.bottom = openBelow ? "" : page.offsetHeight - hit.top + NOTE_CARD_GAP + "px";
        card.style.maxHeight =
            Math.max(0, Math.min(NOTE_CARD_HEIGHT, openBelow ? below : above)) + "px";
    }

    /**
     * The Class & Subclass Features, Species Traits and Feats panels list
     * names; each carries its descriptions as `data-cs-notes`, and the line
     * under the pointer — or under a held finger — opens its own.
     */
    function wireNoteCards() {
        if (!data.noteCard) return;
        var template = document.createElement("div");
        template.innerHTML = data.noteCard;
        template = template.firstElementChild;
        if (!template) return;

        all("textarea[data-cs-notes]").forEach(function (field) {
            var notes = {};
            try {
                notes = JSON.parse(field.getAttribute("data-cs-notes")) || {};
            } catch (cause) {
                return;
            }
            var page = field.closest(".cs-root");
            if (!page) return;

            var card = null;
            var shownTop = null;
            var pressed = false;
            var editing = false;

            function close() {
                if (card && card.parentNode) card.parentNode.removeChild(card);
                card = null;
                shownTop = null;
            }

            function openAt(clientY) {
                var hit = lineAtPoint(field, clientY);
                var name = hit ? lineName(hit.line) : "";
                var description = name ? notes[name.toLowerCase()] : "";
                if (!description) {
                    close();
                    return false;
                }
                if (card && shownTop === hit.top) return true;
                close();
                card = template.cloneNode(true);
                card.querySelector("[data-cs-note-name]").textContent = name;
                card.querySelector("[data-cs-note-description]").textContent = description;
                placeNoteCard(card, hit, page);
                page.appendChild(card);
                shownTop = hit.top;
                return true;
            }

            field.addEventListener("pointermove", function (event) {
                if (event.pointerType !== "mouse" || pressed) return;
                if (editing) close();
                else openAt(event.clientY);
            });
            field.addEventListener("pointerleave", function (event) {
                if (event.pointerType === "mouse" && !pressed) close();
            });
            field.addEventListener("scroll", function () {
                if (!pressed) close();
            });
            field.addEventListener("focus", function () {
                editing = true;
                if (!pressed) close();
            });
            field.addEventListener("blur", function () {
                editing = false;
            });
            onLongPress(
                field,
                function (point) {
                    pressed = openAt(point.clientY);
                    return pressed;
                },
                function () {
                    pressed = false;
                    close();
                },
            );
        });
    }

    /* -------------------------------------------------------------- */
    /* Start                                                           */
    /* -------------------------------------------------------------- */

    document.addEventListener("input", function (event) {
        var field = event.target;
        if (!field || !field.tagName) return;
        if (field.hasAttribute && field.hasAttribute("data-cs-fit")) fitField(field);
        recompute();
    });

    window.addEventListener("resize", fitPages);

    setPrintScale();
    fitPages();
    fitAllFields();
    wireSpellCards();
    wireNoteCards();
    recompute();

    // A webfont landing after first paint changes every measurement.
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () {
            fitAllFields();
            fitPages();
        });
    }
})();
