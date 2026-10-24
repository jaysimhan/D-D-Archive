import { SheetTextArea, useSheetState } from "./sheet-state";
import { useRef, useState, type ChangeEvent, type DragEvent, type ReactNode } from "react";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import type { Spell } from "../../types/dnd-types";
import type { CharacterData } from "../../types/character-creator";
import type { SpellcastingSummary } from "./CharacterSheetA4";
import {
    Icon,
    SPELL_BLOCK,
    SPELL_BLOCK_TOP,
    SPELL_BLUE,
    SpellBlock,
    SpellColumn,
    SpellPage,
    spellAsset,
    spellSlotsAt,
    useSpellsByLevel,
} from "./CharacterSheetA4Page3";
import "./character-sheet.css";

/**
 * Minimal Character Sheet for D&D — A4 page 4, implemented 1:1 from Figma
 * (Simhan – Workspace, node 1780:3791). The spellbook continues from page 3,
 * so the canvas, header row and spell blocks come from that module; the two
 * blue writing panels below Level 9 are the only shapes unique to this page.
 */

/** Appearance / Personality Traits — a titled panel over a large blank. */
function ProsePanel({
    icon,
    label,
    height,
    grow = false,
    defaultText,
    children,
}: {
    icon: ReactNode;
    label: string;
    height?: number;
    grow?: boolean;
    /** What the blank starts out holding, before anything is written in it. */
    defaultText?: string;
    children?: ReactNode;
}) {
    return (
        <div
            className={`relative flex w-full items-start rounded-[22.795px] border-[4.144px] border-solid p-[12.547px] ${
                grow ? "min-h-[1px] flex-[1_0_0]" : "shrink-0"
            }`}
            style={{ borderColor: SPELL_BLUE, ...(height ? { height: `${height}px` } : {}) }}
        >
            <div className="relative flex h-full min-w-[1px] flex-[1_0_0] flex-col items-start overflow-clip rounded-[15.396px] bg-[#f8f8f8] p-[19.245px]">
                <div className="relative flex min-h-[1px] w-full flex-[1_0_0] flex-col items-start gap-[7.698px]">
                    <div className="relative flex w-full shrink-0 items-center gap-[19.569px] rounded-[19.569px] bg-[#f8f8f8] py-[19.569px] pl-[3px] pr-[39.139px]">
                        {icon}
                        <p className="relative shrink-0 whitespace-nowrap text-[29.354px] font-semibold not-italic leading-[normal] text-black">
                            {label}
                        </p>
                    </div>
                    {children ?? (
                        <SheetTextArea
                            aria-label={label}
                            defaultValue={defaultText}
                            className="relative min-h-[1px] w-full flex-[1_0_0] rounded-[23.88px] bg-white px-[28px] py-[22px] text-[30px] font-medium not-italic leading-[1.35] text-black"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * The appearance blank accepts prose or one embedded character image. Images
 * are read as data URLs, so the exact picture is already part of the DOM that
 * both download paths capture; no local-file or server URL can go stale.
 */
function AppearanceField({ defaultText = "" }: { defaultText?: string }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [appearance, setAppearance] = useSheetState("appearance", { text: defaultText, image: "" });
    const { text, image } = appearance;
    const [dragging, setDragging] = useState(false);
    const [error, setError] = useState("");

    const applyImage = (file?: File) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setError("Choose or paste an image file.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result !== "string") return;
            // Appearance is intentionally either prose or a picture. Replacing
            // prose with a picture clears it instead of keeping hidden text.
            setAppearance({ text: "", image: reader.result });
            setError("");
        };
        reader.onerror = () => setError("That image could not be read. Please try another.");
        reader.readAsDataURL(file);
    };

    const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        applyImage(event.target.files?.[0]);
        // Allows choosing the same file again after it has been removed.
        event.target.value = "";
    };

    const onDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragging(false);
        applyImage(Array.from(event.dataTransfer.files).find((file) => file.type.startsWith("image/")));
    };

    return (
        <div
            className={`relative min-h-[1px] w-full flex-[1_0_0] overflow-hidden rounded-[23.88px] bg-white ${
                dragging ? "outline outline-[5px] outline-offset-[-5px] outline-[#118eeb]" : ""
            }`}
            onDragEnter={(event) => {
                event.preventDefault();
                setDragging(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setDragging(false);
                }
            }}
            onDrop={onDrop}
            onPaste={(event) => {
                const file = Array.from(event.clipboardData.items)
                    .find((item) => item.type.startsWith("image/"))
                    ?.getAsFile();
                if (file) {
                    event.preventDefault();
                    applyImage(file);
                }
            }}
            tabIndex={image ? 0 : undefined}
            aria-label={image ? "Character appearance image" : undefined}
        >
            {image ? (
                <img
                    src={image}
                    alt="Character appearance"
                    className="absolute inset-0 size-full object-contain"
                />
            ) : (
                <textarea
                    aria-label="Appearance"
                    value={text}
                    onChange={(event) => setAppearance({ text: event.target.value, image: "" })}
                    data-cs-export-padding-top="22px"
                    className="absolute inset-0 size-full bg-white px-[28px] pb-[22px] pt-[82px] text-[30px] font-medium not-italic leading-[1.35] text-black"
                />
            )}

            <div
                data-screen-only
                className="absolute right-[20px] top-[18px] z-10 flex items-center gap-[12px]"
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    aria-label="Upload character appearance image"
                    onChange={onFileChange}
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-[9px] rounded-[12px] border-[2px] border-[#118eeb] bg-white/95 px-[16px] py-[10px] text-[22px] font-semibold leading-none text-[#0879c9] shadow-sm"
                    title={image ? "Replace character image" : "Upload character image"}
                >
                    {image ? <ImagePlus className="size-[24px]" /> : <Upload className="size-[24px]" />}
                    {image ? "Replace" : "Add image"}
                </button>
                {image && (
                    <button
                        type="button"
                        onClick={() => {
                            setAppearance({ text: "", image: "" });
                            setError("");
                        }}
                        className="inline-flex items-center gap-[9px] rounded-[12px] border-[2px] border-red-300 bg-white/95 px-[16px] py-[10px] text-[22px] font-semibold leading-none text-red-700 shadow-sm"
                        title="Remove character image and use text"
                    >
                        <Trash2 className="size-[24px]" />
                        Remove
                    </button>
                )}
            </div>

            {!image && !text && (
                <p
                    data-screen-only
                    className="pointer-events-none absolute inset-x-[28px] bottom-[25px] text-center text-[22px] font-medium text-black/40"
                >
                    Type a description, or drag, paste, or upload a character image
                </p>
            )}
            {dragging && (
                <div
                    data-screen-only
                    className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-[#118eeb]/10 text-[28px] font-semibold text-[#0879c9]"
                >
                    Drop the character image here
                </div>
            )}
            {error && (
                <p
                    data-screen-only
                    role="alert"
                    className="absolute bottom-[22px] left-[28px] right-[28px] z-10 rounded-[10px] bg-red-50 px-[14px] py-[9px] text-center text-[20px] font-semibold text-red-700"
                >
                    {error}
                </p>
            )}
        </div>
    );
}

/**
 * The creator asks for traits, ideals, bonds and flaws apart; the sheet has
 * one Personality Traits blank, so the last three follow the traits, named.
 */
function personalityText(personality?: CharacterData["personality"]) {
    return [
        personality?.traits?.trim(),
        ...(
            [
                ["Ideals", personality?.ideals],
                ["Bonds", personality?.bonds],
                ["Flaws", personality?.flaws],
            ] as const
        ).map(([label, text]) => (text?.trim() ? `${label}: ${text.trim()}` : undefined)),
    ]
        .filter(Boolean)
        .join("\n\n");
}

export function CharacterSheetA4Page4({
    spellcasting,
    spells,
    personality,
}: {
    spellcasting?: SpellcastingSummary;
    spells?: Spell[];
    /** The creator's answers, written into Appearance and Personality Traits. */
    personality?: CharacterData["personality"];
} = {}) {
    const spellsAt = useSpellsByLevel(spells);
    const slotsAt = spellSlotsAt(spellcasting);
    return (
        <SpellPage spellcasting={spellcasting}>
            <SpellColumn>
                <SpellBlock
                    title="Level 6"
                    level={6}
                    height={SPELL_BLOCK_TOP}
                    slotTotal={slotsAt(6)}
                    spells={spellsAt(6)}
                />
                <SpellBlock
                    title="Level 7"
                    level={7}
                    height={SPELL_BLOCK}
                    slotTotal={slotsAt(7)}
                    spells={spellsAt(7)}
                />
                <SpellBlock
                    title="Level 8"
                    level={8}
                    height={SPELL_BLOCK}
                    slotTotal={slotsAt(8)}
                    spells={spellsAt(8)}
                />
            </SpellColumn>
            <SpellColumn>
                <SpellBlock
                    title="Level 9"
                    level={9}
                    height={SPELL_BLOCK_TOP}
                    slotTotal={slotsAt(9)}
                    spells={spellsAt(9)}
                />
                <ProsePanel
                    label="Appearance"
                    height={1240}
                    icon={
                        // Figma mirrors this glyph horizontally (rotate-180 + flip-y).
                        <Icon
                            src={spellAsset("appearance")}
                            w={49.812}
                            h={47.985}
                            className="-scale-x-100"
                        />
                    }
                >
                    <AppearanceField defaultText={personality?.appearance?.trim()} />
                </ProsePanel>
                <ProsePanel
                    label="Personality Traits"
                    grow
                    defaultText={personalityText(personality)}
                    icon={
                        <Icon
                            src={spellAsset("personality-traits")}
                            w={37.505}
                            h={46.882}
                            inset="-3.2% -4%"
                        />
                    }
                />
            </SpellColumn>
        </SpellPage>
    );
}
