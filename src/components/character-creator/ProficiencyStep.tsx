import { useState, useMemo } from "react";
import { Search } from "lucide-react"; // Search not used but kept if needed, though not in original.
import { CharacterData } from "../../types/character-creator";

// Proficiency Step
export function ProficiencyStep({
    proficiencies,
    onProficienciesChange,
}: {
    proficiencies: {
        skills: { name: string; proficient: boolean; expertise: boolean }[];
        languages: string[];
        tools: string[];
        armor: string[];
        weapons: string[];
    };
    onProficienciesChange: (proficiencies: any) => void;
}) {
    const SKILLS = [
        "Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History",
        "Insight", "Intimidation", "Investigation", "Medicine", "Nature", "Perception",
        "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival"
    ];

    // Initialize skills if empty
    useMemo(() => {
        if (!proficiencies.skills || proficiencies.skills.length === 0) {
            // We can't call onChange directly in render/memo, avoiding side effect here
            // The parent/initial state should handle this, or we handle it on toggle
        }
    }, []);

    const toggleSkill = (skillName: string, type: 'proficient' | 'expertise') => {
        let currentSkills = proficiencies.skills || SKILLS.map(s => ({ name: s, proficient: false, expertise: false }));
        // If fully empty array passed
        if (currentSkills.length === 0) currentSkills = SKILLS.map(s => ({ name: s, proficient: false, expertise: false }));

        const updated = currentSkills.map(s => {
            if (s.name === skillName) {
                if (type === 'proficient') {
                    // Toggle proficient. If turning off, auto-turn off expertise
                    const newVal = !s.proficient;
                    return { ...s, proficient: newVal, expertise: newVal ? s.expertise : false };
                } else {
                    // Toggle expertise. Only allow if proficient
                    if (!s.proficient) return s;
                    return { ...s, expertise: !s.expertise };
                }
            }
            return s;
        });
        onProficienciesChange({ ...proficiencies, skills: updated });
    };

    const [newLang, setNewLang] = useState("");
    const addLanguage = () => {
        if (newLang && !proficiencies.languages?.includes(newLang)) {
            onProficienciesChange({
                ...proficiencies,
                languages: [...(proficiencies.languages || []), newLang]
            });
            setNewLang("");
        }
    };
    const removeLanguage = (lang: string) => {
        onProficienciesChange({
            ...proficiencies,
            languages: (proficiencies.languages || []).filter(l => l !== lang)
        });
    };

    const [newItem, setNewItem] = useState("");
    const [itemType, setItemType] = useState<"tools" | "armor" | "weapons">("tools");
    const addItem = () => {
        if (newItem) {
            const list = proficiencies[itemType] || [];
            if (!list.includes(newItem)) {
                onProficienciesChange({
                    ...proficiencies,
                    [itemType]: [...list, newItem]
                });
            }
            setNewItem("");
        }
    };
    const removeItem = (type: "tools" | "armor" | "weapons", item: string) => {
        onProficienciesChange({
            ...proficiencies,
            [type]: (proficiencies[type] || []).filter(i => i !== item)
        });
    };

    // Ensure we have a renderable list even if props are undefined
    const skillList = (proficiencies.skills?.length ? proficiencies.skills : SKILLS.map(s => ({ name: s, proficient: false, expertise: false })));

    return (
        <div>
            <div className="text-center mb-6">
                <h2 className="text-gray-900 text-2xl font-bold mb-2">Proficiencies & Languages</h2>
                <p className="text-gray-600">Manage your skills, languages, and tool proficiencies.</p>
            </div>

            <div className="space-y-8 max-w-4xl mx-auto">
                {/* Skills Section */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Skills</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-6">
                        {skillList.map(skill => (
                            <div key={skill.name} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                <span className="font-medium text-gray-700 w-32">{skill.name}</span>
                                <div className="flex items-center gap-3">
                                    <label className="flex items-center gap-1 cursor-pointer" title="Proficiency">
                                        <input
                                            type="checkbox"
                                            checked={skill.proficient}
                                            onChange={() => toggleSkill(skill.name, 'proficient')}
                                            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                                        />
                                        <span className="text-xs text-gray-500">Prof.</span>
                                    </label>
                                    <label className={`flex items-center gap-1 cursor-pointer ${!skill.proficient ? 'opacity-50 cursor-not-allowed' : ''}`} title="Expertise">
                                        <input
                                            type="checkbox"
                                            checked={skill.expertise}
                                            onChange={() => toggleSkill(skill.name, 'expertise')}
                                            disabled={!skill.proficient}
                                            className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                                        />
                                        <span className="text-xs text-gray-500">Exp.</span>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Languages */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Languages</h3>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={newLang}
                            onChange={(e) => setNewLang(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addLanguage()}
                            placeholder="Add a language..."
                            list="languages-list"
                            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                        <datalist id="languages-list">
                            <option value="Common" />
                            <option value="Dwarvish" />
                            <option value="Elvish" />
                            <option value="Giant" />
                            <option value="Gnomish" />
                            <option value="Goblin" />
                            <option value="Halfling" />
                            <option value="Orc" />
                            <option value="Abyssal" />
                            <option value="Celestial" />
                            <option value="Draconic" />
                            <option value="Deep Speech" />
                            <option value="Infernal" />
                            <option value="Primordial" />
                            <option value="Sylvan" />
                            <option value="Undercommon" />
                        </datalist>
                        <button onClick={addLanguage} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {(proficiencies.languages || []).map(lang => (
                            <span key={lang} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                {lang}
                                <button onClick={() => removeLanguage(lang)} className="hover:text-blue-900 font-bold">&times;</button>
                            </span>
                        ))}
                        {(!proficiencies.languages || proficiencies.languages.length === 0) && <span className="text-gray-500 text-sm italic">No languages added.</span>}
                    </div>
                </div>

                {/* Tools & Others */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Tools, Armor & Weapons</h3>
                    <div className="flex gap-2 mb-4">
                        <select
                            value={itemType}
                            onChange={(e) => setItemType(e.target.value as any)}
                            className="px-3 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="tools">Tool</option>
                            <option value="armor">Armor</option>
                            <option value="weapons">Weapon</option>
                        </select>
                        <input
                            type="text"
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addItem()}
                            placeholder={`Add ${itemType}...`}
                            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                        <button onClick={addItem} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Add</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2 text-sm uppercase">Tools</h4>
                            <div className="flex flex-wrap gap-2">
                                {(proficiencies.tools || []).map(item => (
                                    <span key={item} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm flex items-center gap-1">
                                        {item}
                                        <button onClick={() => removeItem("tools", item)}>&times;</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2 text-sm uppercase">Armor</h4>
                            <div className="flex flex-wrap gap-2">
                                {(proficiencies.armor || []).map(item => (
                                    <span key={item} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm flex items-center gap-1">
                                        {item}
                                        <button onClick={() => removeItem("armor", item)}>&times;</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2 text-sm uppercase">Weapons</h4>
                            <div className="flex flex-wrap gap-2">
                                {(proficiencies.weapons || []).map(item => (
                                    <span key={item} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm flex items-center gap-1">
                                        {item}
                                        <button onClick={() => removeItem("weapons", item)}>&times;</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
