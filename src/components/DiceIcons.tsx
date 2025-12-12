import React from "react";

interface DiceIconProps {
    color?: string;
    className?: string;
}

export const DiceD4 = ({ color = "currentColor", className }: DiceIconProps) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 2L2 19h20L12 2zm0 0v17" />
    </svg>
);

export const DiceD6 = ({ color = "currentColor", className }: DiceIconProps) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 3.38L20.5 8.29V18.1L12 23.01L3.5 18.1V8.29L12 3.38Z" />
        <path d="M12 3.38V13.2" />
        <path d="M12 13.2L20.5 8.29" />
        <path d="M12 13.2L3.5 8.29" />
    </svg>
);

export const DiceD8 = ({ color = "currentColor", className }: DiceIconProps) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 2L2 12l10 10 10-10L12 2z" />
        <path d="M2 12h20" />
        <path d="M12 2v20" />
        <path d="M12 12l7-4" />
        <path d="M12 12l-7-4" />
    </svg>
);

export const DiceD10 = ({ color = "currentColor", className }: DiceIconProps) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 2l8 11-8 9-8-9 8-11z" />
        <path d="M4 13l8-3 8 3" />
        <path d="M12 2v8" />
        <path d="M12 22v-9" />
    </svg>
);

export const DiceD12 = ({ color = "currentColor", className }: DiceIconProps) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        {/* Outer Hexagon shape approximation */}
        <path d="M12 2.5L20.66 7.5V17.5L12 22.5L3.34 17.5V7.5L12 2.5Z" />
        {/* Inner pentagon */}
        <path d="M12 7l4.7 3.4-1.8 5.6H9.1l-1.8-5.6L12 7z" />
        {/* Connecting lines */}
        <path d="M12 2.5V7" />
        <path d="M20.66 7.5L16.7 10.4" />
        <path d="M20.66 17.5L14.9 16" />
        <path d="M12 22.5V16" />
        <path d="M3.34 17.5L9.1 16" />
        <path d="M3.34 7.5L7.3 10.4" />
    </svg>
);

export const DiceD20 = ({ color = "currentColor", className }: DiceIconProps) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 2.5L20.66 7.5V17.5L12 22.5L3.34 17.5V7.5L12 2.5Z" />
        <path d="M12 2.5v15" />
        <path d="M3.34 7.5L12 12l8.66-4.5" />
        <path d="M3.34 17.5L12 12l8.66 5.5" />
        <path d="M12 22.5v-5" />
        <path d="M3.34 17.5l-3.34 0" fill="none" className="hidden" /> {/* Force bounding box */}
    </svg>
);

export const DiceD100 = ({ color = "currentColor", className }: DiceIconProps) => (
    <DiceD10 color={color} className={className} />
);
