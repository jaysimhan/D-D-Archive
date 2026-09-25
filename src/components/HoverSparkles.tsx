import { motion } from "framer-motion";

const sparklePath = "M6.657 1.247C6.767.917 7.233.917 7.343 1.247l.645 1.937a3.27 3.27 0 0 0 2.012 2.012l1.753.461c.33.11.33.576 0 .686l-1.937.645a3.27 3.27 0 0 0-2.012 2.012l-.461 1.753c-.11.33-.576.33-.686 0l-.645-1.937A3.27 3.27 0 0 0 4 6.804l-1.753-.461c-.33-.11-.33-.576 0-.686l1.937-.645A3.27 3.27 0 0 0 6.196 3z";

const sparkles = Array.from({ length: 18 }, (_, index) => ({
    top: 18 + ((index * 29) % 65),
    left: 18 + ((index * 47) % 65),
    size: 3 + ((index * 7) % 6),
    opacity: 0.18 + ((index * 13) % 24) / 100,
    duration: 1.8 + ((index * 17) % 15) / 10,
    delay: -((index * 11) % 20) / 10,
    originX: (index % 2 === 0 ? -1 : 1) * (300 + ((index * 31) % 500)),
    originY: (index % 3 === 0 ? -1 : 1) * (300 + ((index * 19) % 500)),
    rotation: index % 2 === 0 ? 360 : -360,
}));

const strokeTail = [
    { width: 1.15, opacity: 0.68 },
    { width: 0.92, opacity: 0.54 },
    { width: 0.7, opacity: 0.41 },
    { width: 0.48, opacity: 0.29 },
    { width: 0.27, opacity: 0.17 },
    { width: 0.08, opacity: 0.04 },
];

export function HoverSparkles({ active }: { active: boolean }) {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[200%] -translate-x-1/2 -translate-y-1/2 overflow-hidden [mask-image:radial-gradient(white,transparent_65%)]"
        >
            {sparkles.map((sparkle, index) => (
                <motion.svg
                    key={index}
                    viewBox="0 0 12 13"
                    className="absolute overflow-visible text-brand-100"
                    style={{
                        top: `${sparkle.top}%`,
                        left: `${sparkle.left}%`,
                        width: sparkle.size,
                        transformOrigin: `${sparkle.originX}% ${sparkle.originY}%`,
                    }}
                    initial={false}
                    animate={active ? {
                        opacity: sparkle.opacity,
                        scale: 1,
                        rotate: sparkle.rotation,
                    } : {
                        opacity: 0,
                        scale: 0,
                        rotate: 0,
                    }}
                    transition={active ? {
                        opacity: { duration: 1, ease: "anticipate" },
                        scale: { duration: 2, ease: "anticipate" },
                        rotate: {
                            duration: sparkle.duration,
                            delay: sparkle.delay,
                            ease: "linear",
                            repeat: Infinity,
                        },
                    } : { duration: 0.3 }}
                >
                    <path d={sparklePath} fill="currentColor" />
                </motion.svg>
            ))}
        </div>
    );
}

export function HoverEdgeHighlight({
    active,
    roundedClassName = "rounded-[inherit]",
}: {
    active: boolean;
    roundedClassName?: string;
}) {
    const isCircle = roundedClassName === "rounded-full";

    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className={`pointer-events-none absolute inset-0 z-30 h-full w-full overflow-visible text-brand-100 ${roundedClassName}`}
        >
            {strokeTail.map((segment, index) => {
                const segmentLength = 0.025;
                const offset = index * segmentLength;

                return (
                    <motion.rect
                        key={index}
                        x="0"
                        y="0"
                        width="100"
                        height="100"
                        rx={isCircle ? 50 : 1}
                        ry={isCircle ? 50 : 5}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={segment.width}
                        strokeLinecap={index === 0 ? "round" : "butt"}
                        strokeDasharray={`${segmentLength} ${1 - segmentLength}`}
                        vectorEffect="non-scaling-stroke"
                        pathLength="1"
                        initial={false}
                        animate={active ? {
                            opacity: segment.opacity,
                            strokeDashoffset: [offset, offset - 1],
                        } : {
                            opacity: 0,
                            strokeDashoffset: offset,
                        }}
                        transition={active
                            ? {
                                opacity: { duration: 0.2 },
                                strokeDashoffset: { duration: 1.9, ease: "linear", repeat: Infinity },
                            }
                            : { duration: 0.2 }}
                        style={index === 0
                            ? { filter: "drop-shadow(0 0 1.5px rgba(255, 0, 60, 0.4))" }
                            : undefined}
                    />
                );
            })}
        </svg>
    );
}
