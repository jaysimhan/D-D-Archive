import { useState, useRef, useEffect, useCallback, type CSSProperties, type ReactNode } from "react";
import { useMenuPlacement } from "./useMenuPlacement";

/** The menu's usual height, in design px, before the page edge trims it. */
const MENU_HEIGHT = 280;

/**
 * An autocomplete input that matches the CharacterSheetA4 field styling.
 * Shows a dropdown of filtered suggestions as the user types.
 *
 * Props:
 * - suggestions:   string[]        — full list of valid options
 * - className:     string          — forwarded to the <input>
 * - ariaLabel:     string          — accessibility label
 * - placeholder:   string          — optional placeholder text
 * - defaultValue:  string          — what the sheet fills in; the user may edit it
 * - sizer:         ReactNode       — hidden text that sizes the box, as the
 *                                    fixed A4 pages do for their own blanks.
 *                                    With one, the input is positioned over it.
 */
export function AutocompleteField({
    suggestions,
    className = "",
    ariaLabel,
    placeholder,
    defaultValue = "",
    wrapperClassName = "min-w-[1px] flex-[1_0_0]",
    wrapperStyle,
    sizer,
    sizerClassName = "",
    onSelect,
    clearOnSelect = false,
}: {
    suggestions: string[];
    className?: string;
    ariaLabel: string;
    placeholder?: string;
    defaultValue?: string;
    wrapperClassName?: string;
    wrapperStyle?: CSSProperties;
    sizer?: ReactNode;
    sizerClassName?: string;
    /** Called with the picked suggestion. */
    onSelect?: (value: string) => void;
    /** For a field that adds to something else and is then ready for the next. */
    clearOnSelect?: boolean;
}) {
    const [value, setValue] = useState(defaultValue);
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    // Filter suggestions based on current input
    const filtered = value.trim()
        ? suggestions.filter((s) =>
              s.toLowerCase().includes(value.toLowerCase())
          )
        : suggestions;

    const menu = useMenuPlacement(wrapperRef, open && filtered.length > 0, MENU_HEIGHT);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Scroll active item into view
    useEffect(() => {
        if (activeIndex >= 0 && listRef.current) {
            const item = listRef.current.children[activeIndex] as HTMLElement;
            item?.scrollIntoView({ block: "nearest" });
        }
    }, [activeIndex]);

    const select = useCallback(
        (val: string) => {
            setValue(clearOnSelect ? "" : val);
            onSelect?.(val);
            setOpen(false);
            setActiveIndex(-1);
        },
        [clearOnSelect, onSelect]
    );

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!open && e.key === "ArrowDown") {
            setOpen(true);
            setActiveIndex(0);
            e.preventDefault();
            return;
        }

        if (!open) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setActiveIndex((i) =>
                    i < filtered.length - 1 ? i + 1 : 0
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setActiveIndex((i) =>
                    i > 0 ? i - 1 : filtered.length - 1
                );
                break;
            case "Enter":
                e.preventDefault();
                if (activeIndex >= 0 && filtered[activeIndex]) {
                    select(filtered[activeIndex]);
                }
                break;
            case "Escape":
                e.preventDefault();
                setOpen(false);
                setActiveIndex(-1);
                break;
        }
    };

    /** Highlight the matching substring within a suggestion. */
    const renderHighlighted = (text: string) => {
        if (!value.trim()) return text;
        const idx = text.toLowerCase().indexOf(value.toLowerCase());
        if (idx === -1) return text;
        return (
            <>
                {text.slice(0, idx)}
                <span className="font-bold underline decoration-1 underline-offset-2">
                    {text.slice(idx, idx + value.length)}
                </span>
                {text.slice(idx + value.length)}
            </>
        );
    };

    return (
        <div ref={wrapperRef} className={`relative ${wrapperClassName}`} style={wrapperStyle}>
            {sizer !== undefined && (
                <span aria-hidden className={`block opacity-0 ${sizerClassName}`}>
                    {sizer}
                </span>
            )}
            <input
                type="text"
                role="combobox"
                aria-label={ariaLabel}
                aria-expanded={open}
                aria-autocomplete="list"
                aria-activedescendant={
                    activeIndex >= 0 ? `ac-option-${activeIndex}` : undefined
                }
                autoComplete="off"
                value={value}
                placeholder={placeholder}
                className={className}
                onFocus={() => setOpen(true)}
                onChange={(e) => {
                    setValue(e.target.value);
                    setOpen(true);
                    setActiveIndex(-1);
                }}
                onKeyDown={handleKeyDown}
            />

            {open && filtered.length > 0 && (
                <ul
                    ref={listRef}
                    role="listbox"
                    className={`absolute left-0 right-0 z-50 overflow-y-auto rounded-[12px] border-[2px] border-black/20 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.15)] ${
                        menu.side === "above" ? "bottom-full mb-[4px]" : "top-full mt-[4px]"
                    }`}
                    style={{ maxHeight: `${menu.maxHeight}px` }}
                >
                    {filtered.map((item, i) => (
                        <li
                            key={item}
                            id={`ac-option-${i}`}
                            role="option"
                            aria-selected={i === activeIndex}
                            className={`cursor-pointer select-none px-[20px] py-[12px] text-[28px] font-medium leading-[normal] text-black transition-colors
                                ${i === activeIndex
                                    ? "bg-black/8"
                                    : "hover:bg-black/5"
                                }
                                ${i === 0 ? "rounded-t-[10px]" : ""}
                                ${i === filtered.length - 1
                                    ? "rounded-b-[10px]"
                                    : "border-b border-black/5"
                                }`}
                            onMouseDown={(e) => {
                                e.preventDefault(); // prevent blur before click
                                select(item);
                            }}
                            onMouseEnter={() => setActiveIndex(i)}
                        >
                            {renderHighlighted(item)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
