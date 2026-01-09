
import { User } from "lucide-react";
import { CharacterData } from "../../types/character-creator";

// Name Step Component
export function NameStep({
    characterData,
    setCharacterData,
}: {
    characterData: CharacterData;
    setCharacterData: (data: CharacterData) => void;
}) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
                <User className="w-16 h-16 text-brand-500 mx-auto mb-4" />
                <h2 className="text-brand-400 text-2xl font-bold mb-2 font-serif">Name Your Character</h2>
                <p className="text-gray-400">Choose a memorable name for your hero</p>
            </div>

            <div className="max-w-md mx-auto">
                <label className="block text-gray-300 font-medium mb-3">
                    Character Name
                </label>
                <input
                    type="text"
                    value={characterData.name}
                    onChange={(e) =>
                        setCharacterData({ ...characterData, name: e.target.value })
                    }
                    placeholder="e.g., Aragorn, Gandalf, Legolas..."
                    className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-lg text-white placeholder-gray-500"
                    autoFocus
                />
            </div>
        </div>
    );
}
