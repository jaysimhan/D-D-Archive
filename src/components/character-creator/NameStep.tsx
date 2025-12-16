
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
        <div>
            <div className="text-center mb-8">
                <User className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                <h2 className="text-gray-900 text-2xl font-bold mb-2">Name Your Character</h2>
                <p className="text-gray-600">Choose a memorable name for your hero</p>
            </div>

            <div className="max-w-md mx-auto">
                <label className="block text-gray-700 font-medium mb-3">
                    Character Name
                </label>
                <input
                    type="text"
                    value={characterData.name}
                    onChange={(e) =>
                        setCharacterData({ ...characterData, name: e.target.value })
                    }
                    placeholder="e.g., Aragorn, Gandalf, Legolas..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                    autoFocus
                />
            </div>
        </div>
    );
}
