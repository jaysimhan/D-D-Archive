import { ChevronDown, ChevronUp, Book } from "lucide-react";
import { useState } from "react";
import { Feat } from "../types/dnd-types";
import { EditionBadge, SourceBadge } from "./library/CardBadges";
import { CardTitle, ViewEntryLink } from "./library/ViewEntryLink";

interface FeatCardProps {
    feat: Feat;
    /** The feat's own page, when shown in the Library. */
    href?: string;
}

export function FeatCard({ feat, href }: FeatCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    // Some Archive feats (Mark of Storm) carry no benefits block at all.
    const benefits: Feat["benefits"] = feat.benefits ?? {};

    return (
        <div className="h-full flex flex-col border border-zinc-800 rounded-lg p-4 hover:shadow-lg hover:shadow-brand-900/20 transition-shadow bg-zinc-900/60">
            <div className="flex flex-col gap-2 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex justify-between items-start gap-3">
                    <h3 className="flex-1 min-w-0 text-gray-100 font-serif flex items-start gap-2 break-words">
                        <Book className="w-5 h-5 mt-0.5 shrink-0 text-amber-500" />
                        <CardTitle href={href}>{feat.name}</CardTitle>
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                        <EditionBadge edition={feat.edition} />
                        <button className="text-gray-500 hover:text-gray-300" aria-label={isExpanded ? "Collapse" : "Expand"}>
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
                <p className="text-sm text-gray-400">{feat.featCategory ?? "General"} Feat</p>
                <SourceBadge entity={feat} />
            </div>

            <div className={`mt-4 space-y-4 ${isExpanded ? "block" : "hidden"}`}>
                <div className="text-gray-300 text-sm">
                    <p>{feat.description}</p>
                </div>

                {/* Prerequisites */}
                {feat.prerequisites && (
                    <div className="bg-zinc-800/50 p-3 rounded-md text-sm border border-zinc-700">
                        <span className="font-semibold text-gray-200">Prerequisites: </span>
                        <ul className="list-disc list-inside mt-1 text-gray-400">
                            {feat.prerequisites.level && <li>Level {feat.prerequisites.level}</li>}
                            {feat.prerequisites.abilityScore && Object.entries(feat.prerequisites.abilityScore).map(([ability, score]) => (
                                <li key={ability}>{ability} {score} or higher</li>
                            ))}
                            {feat.prerequisites.race && <li>Race: {feat.prerequisites.race.join(", ")}</li>}
                            {feat.prerequisites.class && <li>Class: {feat.prerequisites.class.join(", ")}</li>}
                        </ul>
                        {(!feat.prerequisites.level && !feat.prerequisites.abilityScore && !feat.prerequisites.race && !feat.prerequisites.class) && (
                            <span className="text-gray-500 italic">None</span>
                        )}
                    </div>
                )}

                {/* Benefits */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-gray-200 border-b border-zinc-700 pb-1">Benefits</h4>

                    {benefits.abilityScoreIncrease && (
                        <div className="text-sm">
                            <span className="font-medium text-brand-400">Ability Score Increase: </span>
                            {Object.entries(benefits.abilityScoreIncrease).map(([ability, amount]) => (
                                <span key={ability} className="ml-1 text-gray-300">
                                    {ability} +{amount}
                                </span>
                            ))}
                        </div>
                    )}

                    {benefits.features && benefits.features.length > 0 && (
                        <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                            {benefits.features.map((feature, idx) => (
                                <li key={idx}>{feature}</li>
                            ))}
                        </ul>
                    )}

                    {benefits.spells && benefits.spells.length > 0 && (
                        <div className="text-sm">
                            <span className="font-medium text-brand-400">Spells: </span>
                            <span className="text-gray-400">{benefits.spells.join(", ")}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Short Description when collapsed */}
            {!isExpanded && (
                <div onClick={() => setIsExpanded(true)} className="cursor-pointer group">
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2 group-hover:text-gray-400 transition-colors">
                        {feat.description}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-brand-400 text-xs font-medium uppercase tracking-wide group-hover:text-brand-300 transition-colors">
                        <span>Show Details</span>
                        <ChevronDown className="w-3 h-3" />
                    </div>
                </div>
            )}
            <div className="flex-1" />
            <ViewEntryLink href={href} />
        </div>
    );
}
