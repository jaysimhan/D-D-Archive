import type { ReactNode } from "react";
import type { Spell } from "../../types/dnd-types";
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
}: {
    icon: ReactNode;
    label: string;
    height?: number;
    grow?: boolean;
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
                    <textarea
                        aria-label={label}
                        className="relative min-h-[1px] w-full flex-[1_0_0] rounded-[23.88px] bg-white px-[28px] py-[22px] text-[30px] font-medium not-italic leading-[1.35] text-black"
                    />
                </div>
            </div>
        </div>
    );
}

export function CharacterSheetA4Page4({
    spellcasting,
    spells,
}: { spellcasting?: SpellcastingSummary; spells?: Spell[] } = {}) {
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
                />
                <ProsePanel
                    label="Personality Traits"
                    grow
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
