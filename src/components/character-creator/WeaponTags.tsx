import { Check, AlertTriangle } from "lucide-react";
import { sharedTags, weaponOptions, weaponProficiency, type WeaponLike, type WeaponProficiency } from "../../utils/weapon-proficiency";

const BADGES: Record<WeaponProficiency, { label: string; title: string; className: string }> = {
    proficient: {
        label: "Proficient",
        title: "You add your proficiency bonus to attacks with this weapon.",
        className: "border-green-700/60 bg-green-900/30 text-green-300",
    },
    partial: {
        label: "Proficient with some",
        title: "This can be one of several weapons; choose one you're trained with to add your proficiency bonus.",
        className: "border-amber-700/60 bg-amber-900/30 text-amber-300",
    },
    "not-proficient": {
        label: "Not proficient",
        title: "No proficiency bonus on attack rolls with this weapon.",
        className: "border-red-800/60 bg-red-950/40 text-red-300",
    },
};

/**
 * A weapon's group tags (Martial, Melee, Finesse …) and, given the
 * character's weapon training, whether they're proficient with it.
 * Renders nothing for an item that isn't a weapon.
 */
export function WeaponTags({ item, training }: { item: WeaponLike; training?: string[] }) {
    const options = weaponOptions(item);
    if (!options.length) return null;
    const tags = sharedTags(options);
    const proficiency = training ? weaponProficiency(item, training) : undefined;
    const badge = proficiency && BADGES[proficiency];

    return (
        <div className="flex flex-wrap items-center gap-1.5">
            {badge && (
                <span title={badge.title} className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${badge.className}`}>
                    {proficiency === "proficient" ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {badge.label}
                </span>
            )}
            {tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full border border-zinc-700 bg-zinc-800/60 text-gray-400">
                    {tag}
                </span>
            ))}
        </div>
    );
}
