import { BookOpen, Check } from "lucide-react";
import type { CharacterRuleset } from "../../types/dnd-types";

const OPTIONS: Array<{
    value: CharacterRuleset;
    title: string;
    subtitle: string;
    description: string;
}> = [
    {
        value: "2024",
        title: "2024 Rules",
        subtitle: "SRD 5.2",
        description: "Build with the revised 2024 classes, species, backgrounds, feats, spells, and equipment.",
    },
    {
        value: "2014",
        title: "2014 Rules",
        subtitle: "SRD 5.1",
        description: "Build with the original fifth-edition races, classes, backgrounds, feats, spells, and equipment.",
    },
];

export function RulesetStep({
    selected,
    onSelect,
}: {
    selected?: CharacterRuleset;
    onSelect: (ruleset: CharacterRuleset) => void;
}) {
    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
                <BookOpen className="w-12 h-12 text-brand-500 mx-auto mb-4" />
                <h2 className="text-white text-3xl font-bold mb-3 font-serif">Choose Your Ruleset</h2>
                <p className="text-gray-400">Every option in this character build will follow this ruleset.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
                {OPTIONS.map((option) => {
                    const active = selected === option.value;
                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onSelect(option.value)}
                            className={`relative text-left p-6 rounded-xl border-2 transition-all ${active
                                ? "border-brand-500 bg-brand-950/60 shadow-[0_0_24px_rgba(220,38,38,0.2)]"
                                : "border-zinc-700 bg-zinc-900/60 hover:border-brand-700 hover:bg-zinc-900"
                            }`}
                        >
                            {active && (
                                <span className="absolute right-4 top-4 w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white" />
                                </span>
                            )}
                            <div className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-2">{option.subtitle}</div>
                            <h3 className="text-2xl text-white font-bold font-serif mb-3">{option.title}</h3>
                            <p className="text-sm leading-relaxed text-gray-400 pr-4">{option.description}</p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
