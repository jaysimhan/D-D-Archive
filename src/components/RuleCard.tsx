import type { RuleEntry } from "../data/srd-rules-reference";
import { CardTitle, ViewEntryLink } from "./library/ViewEntryLink";

const KIND_STYLE: Record<RuleEntry["kind"], string> = {
  Condition: "bg-amber-900/40 text-amber-300 border-amber-700",
  "Weapon Property": "bg-blue-900/50 text-blue-300 border-blue-700",
  "Weapon Mastery": "bg-brand-900/50 text-brand-300 border-brand-700",
  "Damage Type": "bg-zinc-800 text-gray-300 border-zinc-700",
};

interface RuleCardProps {
  rule: RuleEntry;
  /** The rule's own page, when shown in the Library. */
  href?: string;
}

export function RuleCard({ rule, href }: RuleCardProps) {
  return (
    <div className="border border-zinc-800 rounded-lg p-4 hover:shadow-lg hover:shadow-brand-900/20 transition-shadow bg-zinc-900/60">
      <div className="flex justify-between items-start gap-3 mb-2">
        <h3 className="text-gray-100 font-serif"><CardTitle href={href}>{rule.name}</CardTitle></h3>
        <span className={`text-[11px] px-2 py-0.5 rounded-full border shrink-0 ${KIND_STYLE[rule.kind]}`}>{rule.kind}</span>
      </div>
      <p className="text-sm text-gray-300">{rule.summary}</p>
      <ViewEntryLink href={href} />
    </div>
  );
}
