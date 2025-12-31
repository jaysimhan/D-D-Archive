import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { CharacterData } from "../../types/character-creator";
import { Class, Subclass, Background, ProficiencyRule } from "../../types/dnd-types";
import { useItems } from "../../hooks/useSanityData";

// Proficiency Step
export function ProficiencyStep({
    proficiencies,
    onProficienciesChange,
    race,
    classData,
    subclass,
    subrace,
    background,
    feats,
    abilityScores,
    racialBonusAllocation,
}: {
    proficiencies: {
        skills: { name: string; proficient: boolean; expertise: boolean }[];
        languages: string[];
        tools: string[];
        armor: string[];
        weapons: string[];
    };
    onProficienciesChange: (proficiencies: any) => void;
    race?: CharacterData['race'];
    classData?: Class;
    subclass?: Subclass;
    subrace?: CharacterData['subrace'];
    background?: Background;
    feats?: CharacterData['feats'];
    abilityScores?: CharacterData['abilityScores'];
    racialBonusAllocation?: CharacterData['racialBonusAllocation'];
}) {
    const SKILLS = [
        "Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History",
        "Insight", "Intimidation", "Investigation", "Medicine", "Nature", "Perception",
        "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival"
    ];

    // Helper to calculate modifier
    const getModifier = (score: number) => Math.floor((score - 10) / 2);
    const formatModifier = (mod: number) => mod >= 0 ? `+${mod}` : `${mod}`;

    // Helper to calculate final score
    const getFinalScore = (ability: string) => {
        if (!abilityScores) return 10;
        const key = ability as keyof typeof abilityScores;
        const base = abilityScores[key] || 10;

        // Racial Bonus
        let racialBonus = 0;
        if (race?.flexibleAbilityScores) {
            racialBonus = racialBonusAllocation?.[key] || 0;
        } else {
            // Fixed bonuses
            racialBonus = (race?.abilityScoreIncrease?.[key] || 0) +
                (subrace?.abilityScoreIncrease?.[key] || 0);
        }

        // Feat Bonus
        let featBonus = 0;
        feats?.forEach(f => {
            if (f.benefits?.abilityScoreIncrease?.[key]) {
                featBonus += f.benefits.abilityScoreIncrease[key] || 0;
            }
        });

        return base + racialBonus + featBonus;
    };

    // Point System Logic
    const totalPoints = useMemo(() => {
        const hasFeats = feats && feats.length > 0;
        return hasFeats ? 9 : 7;
    }, [feats]);

    // Calculate Spent Points
    const spentPoints = useMemo(() => {
        let spent = 0;
        proficiencies.skills?.forEach(s => {
            if (s.proficient) spent += 1;
            if (s.expertise) spent += 1;
        });
        return spent;
    }, [proficiencies.skills]);

    const remainingPoints = totalPoints - spentPoints;

    const toggleSkill = (skillName: string, type: 'proficient' | 'expertise') => {
        let currentSkills = proficiencies.skills || SKILLS.map(s => ({ name: s, proficient: false, expertise: false }));
        if (currentSkills.length === 0) currentSkills = SKILLS.map(s => ({ name: s, proficient: false, expertise: false }));

        const targetSkill = currentSkills.find(s => s.name === skillName);
        if (!targetSkill) return;

        if (type === 'proficient') {
            if (targetSkill.proficient) {
                const updated = currentSkills.map(s => {
                    if (s.name === skillName) {
                        return { ...s, proficient: false, expertise: false };
                    }
                    return s;
                });
                onProficienciesChange({ ...proficiencies, skills: updated });
            } else {
                if (remainingPoints >= 1) {
                    const updated = currentSkills.map(s => {
                        if (s.name === skillName) {
                            return { ...s, proficient: true };
                        }
                        return s;
                    });
                    onProficienciesChange({ ...proficiencies, skills: updated });
                }
            }
        } else if (type === 'expertise') {
            if (targetSkill.expertise) {
                const updated = currentSkills.map(s => {
                    if (s.name === skillName) {
                        return { ...s, expertise: false };
                    }
                    return s;
                });
                onProficienciesChange({ ...proficiencies, skills: updated });
            } else {
                if (targetSkill.proficient && remainingPoints >= 1) {
                    const updated = currentSkills.map(s => {
                        if (s.name === skillName) {
                            return { ...s, expertise: true };
                        }
                        return s;
                    });
                    onProficienciesChange({ ...proficiencies, skills: updated });
                }
            }
        }
    };

    const [newLang, setNewLang] = useState("");
    const addLanguage = () => {
        if (!newLang) return;
        if (race?.languages?.includes(newLang)) {
            setNewLang("");
            return;
        }
        if (!proficiencies.languages?.includes(newLang)) {
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

    // Item Search Logic
    const { data: allItems, loading: itemsLoading } = useItems();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState<"tools" | "armor" | "weapons">("tools");
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const filteredOptions = useMemo(() => {
        if (!allItems) return [];

        let typeFilter = "";
        if (searchType === "tools") typeFilter = "Tool";
        if (searchType === "armor") typeFilter = "Armor";
        if (searchType === "weapons") typeFilter = "Weapon";

        const typeFiltered = allItems.filter(item => item.type === typeFilter);

        if (!searchTerm) {
            // Limit to first 20 if no search term to avoid huge lists
            return typeFiltered.slice(0, 20).map(i => i.name);
        }

        return typeFiltered
            .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(item => item.name)
            .slice(0, 20); // Limit results
    }, [searchType, searchTerm, allItems]);

    const addItem = (item: string) => {
        const list = proficiencies[searchType] || [];
        if (!list.includes(item)) {
            onProficienciesChange({
                ...proficiencies,
                [searchType]: [...list, item]
            });
        }
        setSearchTerm("");
        setIsSearchOpen(false);
    };

    const removeItem = (type: "tools" | "armor" | "weapons", item: string) => {
        onProficienciesChange({
            ...proficiencies,
            [type]: (proficiencies[type] || []).filter(i => i !== item)
        });
    };

    return (
        <div>
            <div className="text-center mb-6">
                <h2 className="text-brand-400 text-2xl font-bold mb-2 font-serif">Proficiencies & Languages</h2>
                <p className="text-gray-400">Manage your skills, languages, and tool proficiencies.</p>

                {/* Point Display */}
                <div className="flex justify-center flex-col items-center gap-2 mt-4">
                    <div className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 shadow-md">
                        <span className="text-gray-300 mr-2">Proficiency Points:</span>
                        <span className={`font-bold text-xl ${remainingPoints === 0 ? 'text-green-500' : 'text-brand-400'}`}>
                            {remainingPoints} / {totalPoints}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500">
                        Cost: Proficiency (1), Expertise (1 + Prof). {feats && feats.length > 0 ? "Bonus points unlocked from Feats." : "Select a Feat to unlock more points."}
                    </p>
                </div>
            </div>

            <div className="space-y-8 max-w-4xl mx-auto">
                {/* Skills Section */}
                <div className="bg-zinc-900/60 p-6 rounded-xl border border-zinc-800">
                    <h3 className="text-lg font-bold text-gray-200 mb-4 border-b border-zinc-700 pb-2">Skills</h3>
                    <div className="space-y-6">
                        {[
                            { name: "Strength", key: "STR", skills: ["Athletics"] },
                            { name: "Dexterity", key: "DEX", skills: ["Acrobatics", "Sleight of Hand", "Stealth"] },
                            { name: "Intelligence", key: "INT", skills: ["Arcana", "History", "Investigation", "Nature", "Religion"] },
                            { name: "Wisdom", key: "WIS", skills: ["Animal Handling", "Insight", "Medicine", "Perception", "Survival"] },
                            { name: "Charisma", key: "CHA", skills: ["Deception", "Intimidation", "Performance", "Persuasion"] }
                        ].map((group) => {
                            const finalScore = getFinalScore(group.key);
                            const mod = getModifier(finalScore);
                            return (
                                <div key={group.name} className="bg-zinc-900/40 p-4 rounded-lg border border-zinc-800/50">
                                    <div className="flex items-center gap-3 mb-3 pl-1">
                                        <h4 className="text-zinc-500 text-sm font-bold uppercase tracking-wider">{group.name}</h4>
                                        <span className={`font-mono text-sm font-bold px-2 py-0.5 rounded border ${mod >= 0 ? "text-brand-400 bg-brand-900/20 border-brand-800/30" : "text-red-400 bg-red-900/20 border-red-800/30"}`}>
                                            {formatModifier(mod)}
                                        </span>

                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-6">
                                        {group.skills.map(skillName => {
                                            const skill = proficiencies.skills?.find(s => s.name === skillName) || { name: skillName, proficient: false, expertise: false };
                                            const profDisabled = !skill.proficient && remainingPoints < 1;
                                            const expDisabled = !skill.proficient || (!skill.expertise && remainingPoints < 1);

                                            return (
                                                <div key={skill.name} className="flex items-center justify-between p-2 hover:bg-zinc-800/50 rounded transition-colors group">
                                                    <span className={`font-medium w-32 transition-colors ${skill.proficient ? 'text-gray-200' : 'text-gray-500 group-hover:text-gray-400'}`}>{skill.name}</span>
                                                    <div className="flex items-center gap-3">
                                                        <label className={`flex items-center gap-1 ${profDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:text-brand-400'}`}>
                                                            <input
                                                                type="checkbox"
                                                                checked={skill.proficient}
                                                                onChange={() => toggleSkill(skill.name, 'proficient')}
                                                                disabled={profDisabled}
                                                                className="w-4 h-4 text-brand-600 bg-zinc-800 border-zinc-600 rounded focus:ring-brand-500 disabled:opacity-50"
                                                            />
                                                            <span className="text-xs">Prof.</span>
                                                        </label>
                                                        <label className={`flex items-center gap-1 ${expDisabled ? 'cursor-not-allowed opacity-30' : 'cursor-pointer hover:text-amber-400'}`}>
                                                            <input
                                                                type="checkbox"
                                                                checked={skill.expertise}
                                                                onChange={() => toggleSkill(skill.name, 'expertise')}
                                                                disabled={expDisabled}
                                                                className="w-4 h-4 text-amber-500 bg-zinc-800 border-zinc-600 rounded focus:ring-amber-500"
                                                            />
                                                            <span className="text-xs">Exp.</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Languages */}
                <div className="bg-zinc-900/60 p-6 rounded-xl border border-zinc-800">
                    <h3 className="text-lg font-bold text-gray-200 mb-4 border-b border-zinc-700 pb-2">Languages</h3>

                    {race && race.languages && race.languages.length > 0 && (
                        <div className="mb-4">
                            <h4 className="font-semibold text-gray-400 mb-2 text-sm uppercase">Known from Race ({race.name})</h4>
                            <div className="flex flex-wrap gap-2">
                                {race.languages.map(lang => (
                                    <span key={lang} className="bg-brand-900/50 text-brand-300 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-brand-700">
                                        {lang}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mb-2">
                        <h4 className="font-semibold text-gray-400 mb-2 text-sm uppercase">Additional Languages</h4>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={newLang}
                                onChange={(e) => setNewLang(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addLanguage()}
                                placeholder="Add a language..."
                                list="languages-list"
                                className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-brand-500 text-white placeholder-gray-500"
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
                            <button onClick={addLanguage} className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700">Add</button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {(proficiencies.languages || []).map(lang => (
                            <span key={lang} className="bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-blue-700">
                                {lang}
                                <button onClick={() => removeLanguage(lang)} className="hover:text-blue-100 font-bold">&times;</button>
                            </span>
                        ))}
                        {(!proficiencies.languages || proficiencies.languages.length === 0) && <span className="text-gray-500 text-sm italic">No additional languages added.</span>}
                    </div>
                </div>

                {/* Tools & Others */}
                <div className="bg-zinc-900/60 p-6 rounded-xl border border-zinc-800">
                    <h3 className="text-lg font-bold text-gray-200 mb-4 border-b border-zinc-700 pb-2">Tools, Armor & Weapons</h3>
                    <div className="flex gap-2 mb-4 relative z-20">
                        <select
                            value={searchType}
                            onChange={(e) => {
                                setSearchType(e.target.value as any);
                                setSearchTerm("");
                            }}
                            className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-brand-500 text-white"
                        >
                            <option value="tools">Tool</option>
                            <option value="armor">Armor</option>
                            <option value="weapons">Weapon</option>
                        </select>
                        <div className="relative flex-1">
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setIsSearchOpen(true);
                                    }}
                                    onFocus={() => setIsSearchOpen(true)}
                                    onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                                    placeholder={itemsLoading ? "Loading..." : `Search ${searchType}...`}
                                    disabled={itemsLoading}
                                    className="w-full pl-9 pr-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-brand-500 text-white placeholder-gray-500 disabled:opacity-50"
                                />
                            </div>

                            {/* Dropdown */}
                            {isSearchOpen && (searchTerm || filteredOptions.length > 0) && (
                                <div className="absolute top-full left-0 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50">
                                    {itemsLoading ? (
                                        <div className="px-4 py-2 text-gray-500 text-sm">Loading items...</div>
                                    ) : filteredOptions.length > 0 ? (
                                        filteredOptions.map(option => (
                                            <button
                                                key={option}
                                                onClick={() => addItem(option)}
                                                className="w-full text-left px-4 py-2 hover:bg-zinc-700 text-gray-200 transition-colors text-sm"
                                            >
                                                {option}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2 text-gray-500 text-sm">No results found</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <h4 className="font-semibold text-gray-400 mb-2 text-sm uppercase">Tools</h4>
                            <div className="flex flex-wrap gap-2">
                                {(proficiencies.tools || []).map(item => (
                                    <span key={item} className="bg-zinc-800 text-gray-300 px-2 py-1 rounded text-sm flex items-center gap-1 border border-zinc-700">
                                        {item}
                                        <button onClick={() => removeItem("tools", item)} className="hover:text-white">&times;</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-400 mb-2 text-sm uppercase">Armor</h4>
                            <div className="flex flex-wrap gap-2">
                                {(proficiencies.armor || []).map(item => (
                                    <span key={item} className="bg-zinc-800 text-gray-300 px-2 py-1 rounded text-sm flex items-center gap-1 border border-zinc-700">
                                        {item}
                                        <button onClick={() => removeItem("armor", item)} className="hover:text-white">&times;</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-400 mb-2 text-sm uppercase">Weapons</h4>
                            <div className="flex flex-wrap gap-2">
                                {(proficiencies.weapons || []).map(item => (
                                    <span key={item} className="bg-zinc-800 text-gray-300 px-2 py-1 rounded text-sm flex items-center gap-1 border border-zinc-700">
                                        {item}
                                        <button onClick={() => removeItem("weapons", item)} className="hover:text-white">&times;</button>
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
