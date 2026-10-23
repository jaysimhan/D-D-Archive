import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, ChevronRight, Loader2, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface Crumb {
  label: string;
  to?: string;
}

interface LibraryShellProps {
  title: string;
  subtitle?: ReactNode;
  icon?: LucideIcon;
  /** Where the back arrow goes; the last crumb with a link by default. */
  backTo?: string;
  crumbs?: Crumb[];
  /** Rendered under the header, full width, e.g. the category tabs. */
  toolbar?: ReactNode;
  children: ReactNode;
}

/** The dark backdrop, header and breadcrumb trail every Library page shares. */
export function LibraryShell({ title, subtitle, icon: Icon = BookOpen, backTo, crumbs = [], toolbar, children }: LibraryShellProps) {
  const back = backTo ?? [...crumbs].reverse().find((crumb) => crumb.to)?.to ?? "/";

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-brand-500/30">
      {/* Dark Fantasy Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-brand-950/20 to-zinc-950"></div>
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255, 0, 60, 0.3) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}></div>
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-900/10 to-transparent"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-brand-600/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-40 right-40 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header - connects seamlessly with navbar */}
        <div className="border-b border-zinc-800 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
            {crumbs.length > 0 && (
              <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-gray-500 mb-4">
                {crumbs.map((crumb, i) => (
                  <span key={i} className="flex items-center gap-1 min-w-0">
                    {i > 0 && <ChevronRight className="w-3 h-3 shrink-0" />}
                    {crumb.to ? (
                      <Link to={crumb.to} className="hover:text-brand-300 transition-colors truncate">{crumb.label}</Link>
                    ) : (
                      <span className="text-gray-300 truncate">{crumb.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            )}
            <div className="flex items-center gap-4">
              <Link to={back} aria-label="Back" className="p-2 rounded-lg bg-brand-900/30 hover:bg-brand-900/50 border border-brand-800/30 transition-colors shrink-0">
                <ArrowLeft className="w-5 h-5 text-brand-400" />
              </Link>
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-brand-500/20 blur-xl rounded-full"></div>
                  <div className="relative w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center border-2 border-brand-400/50 shadow-lg">
                    <Icon className="w-5 h-5 text-brand-100" />
                  </div>
                </div>
                <div className="min-w-0">
                  <h1 className="text-white text-2xl md:text-3xl font-serif tracking-wide break-words">{title}</h1>
                  {subtitle && <div className="text-brand-400/60 text-sm">{subtitle}</div>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {toolbar}

        <div className="max-w-7xl mx-auto px-4 py-8">{children}</div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap');
        .font-serif {
          font-family: 'Cinzel', serif;
        }
      `}</style>
    </div>
  );
}

export function LibraryLoading() {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center text-gray-500 gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      <p>Opening the archive...</p>
    </div>
  );
}
