import { useEffect, useState } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { cn } from "./utils";

// Tailwind only emits classes it can see, so the clamp utilities are spelled out.
const CLAMP: Record<number, string> = {
    1: "truncate",
    2: "line-clamp-2",
    3: "line-clamp-3",
    4: "line-clamp-4",
    5: "line-clamp-5",
};

/**
 * A blurb that clamps to `lines` and hands the rest over on hover. The tooltip
 * only exists when the text is actually cut off, so short entries stay quiet
 * instead of repeating themselves under the pointer.
 */
export function ClampedText({
    text,
    lines = 2,
    className,
    side = "top",
}: {
    text?: string;
    lines?: number;
    className?: string;
    side?: "top" | "right" | "bottom" | "left";
}) {
    // A state ref rather than useRef: swapping the plain paragraph for the
    // tooltip-wrapped one mounts a new node, and the measurement has to follow it.
    const [node, setNode] = useState<HTMLParagraphElement | null>(null);
    const [clipped, setClipped] = useState(false);

    useEffect(() => {
        if (!node) return;
        const measure = () => setClipped(
            node.scrollHeight > node.clientHeight + 1 || node.scrollWidth > node.clientWidth + 1
        );
        measure();
        if (typeof ResizeObserver === "undefined") return;
        const observer = new ResizeObserver(measure);
        observer.observe(node);
        return () => observer.disconnect();
    }, [node, text, lines]);

    const body = (
        <p ref={setNode} className={cn(CLAMP[lines] ?? CLAMP[2], className)}>
            {text}
        </p>
    );

    if (!text || !clipped) return body;

    return (
        <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>{body}</TooltipTrigger>
            <TooltipContent
                side={side}
                sideOffset={6}
                collisionPadding={12}
                className="max-w-sm border border-amber-900/50 bg-zinc-950/95 px-3 py-2 text-left text-xs leading-relaxed text-gray-200 shadow-xl shadow-black/60"
                arrowClassName="bg-zinc-950 fill-zinc-950"
            >
                {text}
            </TooltipContent>
        </Tooltip>
    );
}
