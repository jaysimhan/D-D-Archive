import { Link } from "react-router-dom";
import { Swords, BookOpen, Flame, Crown } from "lucide-react";
import { useHomepage } from "../hooks/useSanityData";
import { urlFor } from "../lib/sanity";



export function LandingPage() {
  const { data: homepageData } = useHomepage();
  const content = homepageData?.[0];
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Dark Fantasy Background */}
      <div className="absolute inset-0">
        {/* Deep gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-brand-950/20 to-zinc-950">
          {content && content.heroImage && (
            <img
              src={urlFor(content.heroImage!)?.url()}
              alt="Hero Background"
              className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
            />
          )}
        </div>

        {/* Ornate pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255, 0, 60, 0.3) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}></div>

        {/* Vignette effect */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black"></div>

        {/* Animated ambient glows */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-brand-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-40 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Fire spark particles (smaller) */}
        <div className="absolute top-1/4 left-1/4 w-0.5 h-0.5 bg-brand-400/80 rounded-full animate-spark-float blur-[0.5px]"></div>
        <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-brand-500/70 rounded-full animate-spark-float blur-[0.5px]" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/3 left-1/2 w-px h-px bg-brand-300/60 rounded-full animate-spark-float blur-[0.5px]" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-2/3 right-1/4 w-0.5 h-0.5 bg-brand-300/80 rounded-full animate-spark-float blur-[0.5px]" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-px h-px bg-brand-500/70 rounded-full animate-spark-float blur-[0.5px]" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/5 right-1/2 w-0.5 h-0.5 bg-brand-400/60 rounded-full animate-spark-float blur-[0.5px]" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute bottom-1/4 left-2/3 w-px h-px bg-brand-500/70 rounded-full animate-spark-float blur-[0.5px]" style={{ animationDelay: '3s' }}></div>

        {/* Dust particles (very small, subtle) */}
        <div className="absolute top-1/6 left-1/5 w-px h-px bg-brand-200/20 rounded-full animate-dust-drift"></div>
        <div className="absolute top-2/5 right-1/6 w-px h-px bg-brand-300/15 rounded-full animate-dust-drift" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-2/5 left-3/4 w-px h-px bg-brand-200/20 rounded-full animate-dust-drift" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-3/4 right-2/5 w-px h-px bg-brand-100/15 rounded-full animate-dust-drift" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/6 w-px h-px bg-brand-200/20 rounded-full animate-dust-drift" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-1/5 right-1/3 w-px h-px bg-brand-200/15 rounded-full animate-dust-drift" style={{ animationDelay: '5s' }}></div>
        <div className="absolute top-3/5 left-2/5 w-px h-px bg-brand-300/20 rounded-full animate-dust-drift" style={{ animationDelay: '6s' }}></div>
        <div className="absolute bottom-2/6 right-1/5 w-px h-px bg-brand-100/15 rounded-full animate-dust-drift" style={{ animationDelay: '7s' }}></div>
        <div className="absolute top-4/5 left-3/5 w-px h-px bg-brand-200/20 rounded-full animate-dust-drift" style={{ animationDelay: '8s' }}></div>
        <div className="absolute top-1/3 right-3/5 w-px h-px bg-brand-200/15 rounded-full animate-dust-drift" style={{ animationDelay: '9s' }}></div>

        {/* Moving gradient orbs */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-brand-500/20 rounded-full blur-2xl animate-drift"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-brand-500/20 rounded-full blur-2xl animate-drift-reverse"></div>
        </div>


      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-center">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-500/20 blur-xl rounded-full"></div>
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center border-2 border-brand-400/50 shadow-lg">
                <Crown className="w-5 h-5 sm:w-7 sm:h-7 text-brand-100" />
              </div>
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-serif tracking-wide">
                <span className="text-brand-200">THE D&D</span>{" "}
                <span className="text-brand-500">OMNI-ARCHIVE</span>
              </h1>
              <p className="text-[10px] sm:text-xs text-brand-600/80 tracking-widest">MASTER YOUR DESTINY</p>
            </div>
          </div>
        </header>

        {/* Main Content - Centered */}
        <main className="flex-1 px-4 sm:px-8 py-8 sm:py-12 flex items-center justify-center">
          <div className="max-w-4xl w-full flex flex-col items-center text-center space-y-6 sm:space-y-10">
            {/* Decorative Line */}
            <div className="flex items-center gap-3 sm:gap-4 w-full max-w-2xl">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand-700/50 to-transparent"></div>
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-brand-500 animate-pulse" />
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand-700/50 to-transparent"></div>
            </div>

            {/* Title */}
            <div className="space-y-3 sm:space-y-4">
              <h2 className="font-serif leading-none flex flex-col items-center">
                <span className={`block font-bold ${content?.heroTitleLine1?.fontSize ? `text-${content.heroTitleLine1.fontSize}` : 'text-5xl sm:text-7xl md:text-8xl lg:text-9xl'
                  } ${content?.heroTitleLine1?.letterSpacing ? `tracking-${content.heroTitleLine1.letterSpacing}` : ''
                  } ${(content?.heroTitleLine1?.style || 'glow') === 'gradient'
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-500 to-brand-600 drop-shadow-[0_0_50px_rgba(255,0,60,0.5)] animate-glow-intense'
                    : (content?.heroTitleLine1?.style || 'glow') === 'glow'
                      ? 'text-brand-100 drop-shadow-[0_0_30px_rgba(255,0,60,0.3)] animate-glow'
                      : 'text-brand-100'
                  }`}>
                  {content?.heroTitleLine1?.text || (content?.title ? content.title.split(' ')[0] : "Forge")}
                </span>

                <span className={`block font-bold ${content?.heroTitleLine2?.fontSize ? `text-${content.heroTitleLine2.fontSize}` : 'text-5xl sm:text-7xl md:text-8xl lg:text-9xl'
                  } ${content?.heroTitleLine2?.letterSpacing ? `tracking-${content.heroTitleLine2.letterSpacing}` : ''
                  } ${(content?.heroTitleLine2?.style || 'gradient') === 'gradient'
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-500 to-brand-600 drop-shadow-[0_0_50px_rgba(255,0,60,0.5)] animate-glow-intense'
                    : (content?.heroTitleLine2?.style || 'gradient') === 'glow'
                      ? 'text-brand-100 drop-shadow-[0_0_30px_rgba(255,0,60,0.3)] animate-glow'
                      : 'text-brand-100'
                  }`}>
                  {content?.heroTitleLine2?.text || (content?.title ? content.title.split(' ').slice(1).join(' ') : "Your Legend")}
                </span>
              </h2>
              <p className="text-base sm:text-xl md:text-2xl text-brand-200/60 max-w-3xl mx-auto leading-relaxed font-light tracking-wide px-4">
                {content?.subtitle || "Enter the archives of power. Build legendary heroes. Master the ancient arts of Dungeons & Dragons."}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center w-full sm:w-auto">
              <Link to="/creator" className="group relative px-6 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-brand-600 to-brand-800 rounded overflow-hidden border-2 border-brand-500/50 shadow-lg shadow-brand-900/50 hover:shadow-brand-900/80 transition-all hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                <div className="relative flex items-center justify-center gap-2 sm:gap-3">
                  <Swords className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="font-serif tracking-wider text-base sm:text-lg">Create Character</span>
                </div>
              </Link>

              <Link to="/library" className="group relative px-6 sm:px-10 py-4 sm:py-5 bg-black/40 backdrop-blur-sm rounded overflow-hidden border-2 border-brand-700/30 hover:border-brand-600/50 transition-all hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-500/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                <div className="relative flex items-center justify-center gap-2 sm:gap-3">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-brand-400" />
                  <span className="text-brand-200 font-serif tracking-wider text-base sm:text-lg">Explore Library</span>
                </div>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-8 pt-4 sm:pt-8 w-full max-w-3xl px-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-transparent rounded-lg blur-sm group-hover:blur-md transition-all"></div>
                <div className="relative p-3 sm:p-6 bg-black/40 backdrop-blur-sm border border-red-900/30 rounded-lg hover:border-red-800/50 transition-all">
                  <div className="text-2xl sm:text-4xl md:text-5xl font-serif text-red-300 mb-1 sm:mb-2 drop-shadow-lg">30+</div>
                  <div className="text-[10px] sm:text-sm text-red-400/60 uppercase tracking-widest">Classes</div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent rounded-lg blur-sm group-hover:blur-md transition-all"></div>
                <div className="relative p-3 sm:p-6 bg-black/40 backdrop-blur-sm border border-blue-900/30 rounded-lg hover:border-blue-800/50 transition-all">
                  <div className="text-2xl sm:text-4xl md:text-5xl font-serif text-blue-300 mb-1 sm:mb-2 drop-shadow-lg">50+</div>
                  <div className="text-[10px] sm:text-sm text-blue-400/60 uppercase tracking-widest">Races</div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-transparent rounded-lg blur-sm group-hover:blur-md transition-all"></div>
                <div className="relative p-3 sm:p-6 bg-black/40 backdrop-blur-sm border border-purple-900/30 rounded-lg hover:border-purple-800/50 transition-all">
                  <div className="text-2xl sm:text-4xl md:text-5xl font-serif text-purple-300 mb-1 sm:mb-2 drop-shadow-lg">300+</div>
                  <div className="text-[10px] sm:text-sm text-purple-400/60 uppercase tracking-widest">Spells</div>
                </div>
              </div>
            </div>

            {/* Decorative Bottom Line */}
            <div className="flex items-center gap-3 sm:gap-4 w-full max-w-2xl">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand-700/50 to-transparent"></div>
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-brand-500 animate-pulse" />
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand-700/50 to-transparent"></div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-4 sm:px-8 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs">
            <span className="text-brand-600/60 tracking-wider">
              {content?.footer?.text || "Educational Demo"}
            </span>
            <span className="text-brand-900/50">•</span>
            <span className="text-brand-700/40">
              {content?.footer?.disclaimer || "Not affiliated with Wizards of the Coast"}
            </span>
            <span className="text-brand-900/50">•</span>
            <span className="text-brand-500/80 font-serif uppercase drop-shadow-[0_0_8px_rgba(255,0,60,0.6)]">
              {content?.footer?.credits || "Powered by React & Tailwind"}
            </span>
          </div>
        </footer>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&display=swap');
        
        .font-serif {
          font-family: 'Cinzel', serif;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
        
        @keyframes spark-float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.4;
          }
          25% {
            transform: translateY(-15px) translateX(5px);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-8px) translateX(-3px);
            opacity: 0.6;
          }
          75% {
            transform: translateY(-20px) translateX(2px);
            opacity: 0.9;
          }
        }
        
        @keyframes dust-drift {
          0%, 100% {
            transform: translate(0, 0);
            opacity: 0.05;
          }
          20% {
            opacity: 0.25;
          }
          40% {
            transform: translate(-15px, -30px);
            opacity: 0.15;
          }
          60% {
            transform: translate(10px, -50px);
            opacity: 0.3;
          }
          80% {
            opacity: 0.1;
          }
        }
        
        @keyframes drift {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(30px, -30px);
          }
          50% {
            transform: translate(-20px, -60px);
          }
          75% {
            transform: translate(-40px, -30px);
          }
        }
        
        @keyframes drift-reverse {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(-30px, 30px);
          }
          50% {
            transform: translate(20px, 60px);
          }
          75% {
            transform: translate(40px, 30px);
          }
        }
        
          @keyframes glow {
          0%, 100% {
          0%, 100% {
            filter: drop-shadow(0 0 40px rgba(255, 0, 60, 0.4));
          }
          50% {
            filter: drop-shadow(0 0 50px rgba(255, 0, 60, 0.6));
          }
        }
        
        @keyframes glow-intense {
          0%, 100% {
            filter: drop-shadow(0 0 50px rgba(255, 0, 60, 0.5));
          }
          50% {
            filter: drop-shadow(0 0 70px rgba(255, 0, 60, 0.7));
          }
        }
        
        .animate-spark-float {
          animation: spark-float 3s ease-in-out infinite;
        }
        
        .animate-dust-drift {
          animation: dust-drift 15s ease-in-out infinite;
        }
        
        .animate-drift {
          animation: drift 20s ease-in-out infinite;
        }
        
        .animate-drift-reverse {
          animation: drift-reverse 25s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
        
        .animate-glow-intense {
          animation: glow-intense 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
