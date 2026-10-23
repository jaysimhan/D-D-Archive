import { ChevronDown, ChevronUp, User } from "lucide-react";
import { useState } from "react";
import { Background } from "../types/dnd-types";
import { EditionBadge, SourceBadge } from "./library/CardBadges";
import { CardTitle, ViewEntryLink } from "./library/ViewEntryLink";

interface BackgroundCardProps {
    background: Background;
    /** The background's own page, when shown in the Library. */
    href?: string;
}

export function BackgroundCard({ background, href }: BackgroundCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="h-full flex flex-col border border-zinc-800 rounded-lg p-4 transition-all bg-zinc-900/60 hover:shadow-lg hover:shadow-brand-900/20">
            <div className="flex flex-col gap-2 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex justify-between items-start gap-3">
                    <h3 className="flex-1 min-w-0 text-white font-medium font-serif flex items-start gap-2 break-words">
                        <User className="w-5 h-5 mt-0.5 shrink-0 text-brand-400" />
                        <CardTitle href={href}>{background.name}</CardTitle>
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                        <EditionBadge edition={background.edition} />
                        <button className="text-gray-500 hover:text-gray-300" aria-label={isExpanded ? "Collapse" : "Expand"}>
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
                <p className="text-sm text-gray-400">
                    Skills: {background.skillProficiencies?.join(", ") || "None"}
                </p>
                <SourceBadge entity={background} />
            </div>

            {/* Expanded Details */}
            <div className={`mt-4 space-y-4 ${isExpanded ? "block" : "hidden"}`}>
                {/* Description */}
                <div className="text-gray-300 text-sm">
                    <p>{background.description}</p>
                </div>

                {/* Proficiencies */}
                <div className="bg-zinc-800/50 p-3 rounded-md text-sm border border-zinc-700">
                    <h4 className="font-semibold text-gray-200 mb-2">Proficiencies</h4>
                    <div className="space-y-1 text-gray-400">
                        {background.skillProficiencies && background.skillProficiencies.length > 0 && (
                            <p><span className="text-brand-400">Skills:</span> {background.skillProficiencies.join(", ")}</p>
                        )}
                        {background.toolProficiencies && background.toolProficiencies.length > 0 && (
                            <p><span className="text-brand-400">Tools:</span> {background.toolProficiencies.join(", ")}</p>
                        )}
                        {background.languages > 0 && (
                            <p><span className="text-brand-400">Languages:</span> {background.languages} of your choice</p>
                        )}
                    </div>
                </div>

                {/* Equipment */}
                {background.equipment && background.equipment.length > 0 && (
                    <div className="bg-zinc-800/50 p-3 rounded-md text-sm border border-zinc-700">
                        <h4 className="font-semibold text-gray-200 mb-2">Equipment</h4>
                        <ul className="list-disc list-inside text-gray-400 space-y-1">
                            {background.equipment.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Feature */}
                {background.feature && (
                    <div className="pt-3 border-t border-brand-900/30">
                        <h4 className="font-semibold text-brand-400 mb-1">{background.feature.name}</h4>
                        <p className="text-sm text-gray-300">{background.feature.description}</p>
                    </div>
                )}

                {/* Traits */}
                {background.traits && background.traits.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-gray-200 border-b border-zinc-700 pb-1">Traits</h4>
                        {background.traits.map((trait, idx) => (
                            <div key={idx} className="bg-zinc-800/30 p-2 rounded border border-zinc-700/50">
                                <span className="font-medium text-brand-400">{trait.name}:</span>
                                <span className="text-gray-400 ml-1">{trait.description}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Collapsed Preview */}
            {!isExpanded && (
                <div onClick={() => setIsExpanded(true)} className="cursor-pointer group">
                    <p className="text-sm text-gray-300 mt-3 line-clamp-2">{background.description}</p>
                    <div className="pt-3 border-t border-brand-900/30 mt-3">
                        <p className="text-sm text-white">{background.feature?.name}</p>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                            {background.feature?.description}
                        </p>
                    </div>
                    <div className="flex items-center gap-1 mt-3 text-brand-400 text-xs font-medium uppercase tracking-wide group-hover:text-brand-300 transition-colors">
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
