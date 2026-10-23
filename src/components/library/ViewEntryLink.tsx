import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

/** A card's name, linked to its full entry when the card has one. */
export function CardTitle({ href, children }: { href?: string; children: ReactNode }) {
  if (!href) return <>{children}</>;
  return (
    <Link to={href} className="hover:text-brand-300 transition-colors">
      {children}
    </Link>
  );
}

/** The "open the full page" link at the foot of a Library card. */
export function ViewEntryLink({ href }: { href?: string }) {
  if (!href) return null;
  return (
    <Link
      to={href}
      onClick={(event) => event.stopPropagation()}
      className="mt-3 flex w-fit items-center gap-1 text-xs font-medium uppercase tracking-wide text-brand-400 hover:text-brand-300 transition-colors"
    >
      View full entry
      <ArrowRight className="w-3 h-3" />
    </Link>
  );
}
