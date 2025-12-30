
// Personality Step
export function PersonalityStep({
    personality,
    onPersonalityChange,
}: {
    personality: {
        traits?: string;
        ideals?: string;
        bonds?: string;
        flaws?: string;
    };
    onPersonalityChange: (personality: any) => void;
}) {
    return (
        <div>
            <div className="text-center mb-6">
                <h2 className="text-brand-400 text-2xl font-bold mb-2 font-serif">Define Your Personality</h2>
                <p className="text-gray-400">Bring your character to life (optional)</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-gray-300 font-medium mb-2">Personality Traits</label>
                    <textarea
                        value={personality.traits || ""}
                        onChange={(e) =>
                            onPersonalityChange({ ...personality, traits: e.target.value })
                        }
                        placeholder="How does your character act and think?"
                        className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none text-white placeholder-gray-500"
                        rows={3}
                    />
                </div>

                <div>
                    <label className="block text-gray-300 font-medium mb-2">Ideals</label>
                    <textarea
                        value={personality.ideals || ""}
                        onChange={(e) =>
                            onPersonalityChange({ ...personality, ideals: e.target.value })
                        }
                        placeholder="What principles guide your character?"
                        className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none text-white placeholder-gray-500"
                        rows={3}
                    />
                </div>

                <div>
                    <label className="block text-gray-300 font-medium mb-2">Bonds</label>
                    <textarea
                        value={personality.bonds || ""}
                        onChange={(e) =>
                            onPersonalityChange({ ...personality, bonds: e.target.value })
                        }
                        placeholder="What ties bind your character to others?"
                        className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none text-white placeholder-gray-500"
                        rows={3}
                    />
                </div>

                <div>
                    <label className="block text-gray-300 font-medium mb-2">Flaws</label>
                    <textarea
                        value={personality.flaws || ""}
                        onChange={(e) =>
                            onPersonalityChange({ ...personality, flaws: e.target.value })
                        }
                        placeholder="What weaknesses does your character have?"
                        className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none text-white placeholder-gray-500"
                        rows={3}
                    />
                </div>
            </div>
        </div>
    );
}
