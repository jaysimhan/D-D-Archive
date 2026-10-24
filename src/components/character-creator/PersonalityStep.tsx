import type { CharacterData } from "../../types/character-creator";

type Personality = CharacterData["personality"];

const ALIGNMENTS = [
    "Lawful Good",
    "Neutral Good",
    "Chaotic Good",
    "Lawful Neutral",
    "True Neutral",
    "Chaotic Neutral",
    "Lawful Evil",
    "Neutral Evil",
    "Chaotic Evil",
];

const TEXT_FIELDS: { key: keyof Personality; label: string; placeholder: string; rows: number }[] = [
    { key: "traits", label: "Personality Traits", placeholder: "How does your character act and think?", rows: 3 },
    { key: "ideals", label: "Ideals", placeholder: "What principles guide your character?", rows: 3 },
    { key: "bonds", label: "Bonds", placeholder: "What ties bind your character to others?", rows: 3 },
    { key: "flaws", label: "Flaws", placeholder: "What weaknesses does your character have?", rows: 3 },
    {
        key: "appearance",
        label: "Appearance",
        placeholder: "Height, build, hair, eyes, scars, clothing, how they carry themselves...",
        rows: 4,
    },
    {
        key: "backstory",
        label: "Backstory",
        placeholder: "Where did your character come from, and what set them on the road to adventure?",
        rows: 8,
    },
];

// Personality Step
export function PersonalityStep({
    personality,
    onPersonalityChange,
}: {
    personality: Personality;
    onPersonalityChange: (personality: Personality) => void;
}) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-6">
                <h2 className="text-brand-400 text-2xl font-bold mb-2 font-serif">Define Your Personality</h2>
                <p className="text-gray-400">Bring your character to life (optional)</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-gray-300 font-medium mb-2">Alignment</label>
                    <div className="grid grid-cols-3 gap-2">
                        {ALIGNMENTS.map((alignment) => {
                            const selected = personality.alignment === alignment;
                            return (
                                <button
                                    key={alignment}
                                    type="button"
                                    aria-pressed={selected}
                                    // Clicking the chosen alignment again clears it.
                                    onClick={() =>
                                        onPersonalityChange({
                                            ...personality,
                                            alignment: selected ? undefined : alignment,
                                        })
                                    }
                                    className={`px-2 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                                        selected
                                            ? "bg-brand-600/20 border-brand-500 text-white"
                                            : "bg-zinc-800 border-zinc-700 text-gray-300 hover:border-zinc-500"
                                    }`}
                                >
                                    {alignment}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {TEXT_FIELDS.map(({ key, label, placeholder, rows }) => (
                    <div key={key}>
                        <label className="block text-gray-300 font-medium mb-2">{label}</label>
                        <textarea
                            value={personality[key] || ""}
                            onChange={(e) =>
                                onPersonalityChange({ ...personality, [key]: e.target.value })
                            }
                            placeholder={placeholder}
                            className={`w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-white placeholder-gray-500 ${
                                key === "backstory" ? "resize-y" : "resize-none"
                            }`}
                            rows={rows}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
