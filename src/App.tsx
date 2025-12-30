import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { Home, BookOpen, Wand2, Menu, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { DiceRoller } from "./components/DiceRoller";
import NProgress from "nprogress";

// Lazy load pages
const HomePage = lazy(() => import("./pages/HomePage").then(module => ({ default: module.HomePage })));
const LibraryPage = lazy(() => import("./pages/LibraryPage").then(module => ({ default: module.LibraryPage })));
const CharacterCreatorPage = lazy(() => import("./pages/CharacterCreatorPage").then(module => ({ default: module.CharacterCreatorPage })));


function Navigation() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isHome = location.pathname === "/";

  if (isHome) return null;

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2 text-white hover:text-brand-400 transition-colors z-50 relative"
            onClick={closeMenu}
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">D&D Omni-Archive</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/library"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${location.pathname === "/library"
                ? "bg-brand-900/50 text-brand-400"
                : "text-gray-400 hover:text-white hover:bg-zinc-800"
                }`}
            >
              <BookOpen className="w-5 h-5" />
              Library
            </Link>

            <Link
              to="/creator"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${location.pathname === "/creator"
                ? "bg-brand-900/50 text-brand-400"
                : "text-gray-400 hover:text-white hover:bg-zinc-800"
                }`}
            >
              <Wand2 className="w-5 h-5" />
              Character Creator
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white z-50 relative"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Mobile Navigation Overlay */}
          {isMenuOpen && (
            <div className="fixed inset-0 bg-zinc-950 z-40 md:hidden pt-20 px-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-5 duration-200">
              <Link
                to="/library"
                onClick={closeMenu}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-lg transition-colors ${location.pathname === "/library"
                  ? "bg-brand-900/50 text-brand-400"
                  : "bg-zinc-900 text-gray-300"
                  }`}
              >
                <BookOpen className="w-6 h-6" />
                Library
              </Link>
              <Link
                to="/creator"
                onClick={closeMenu}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-lg transition-colors ${location.pathname === "/creator"
                  ? "bg-brand-900/50 text-brand-400"
                  : "bg-zinc-900 text-gray-300"
                  }`}
              >
                <Wand2 className="w-6 h-6" />
                Character Creator
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function LoadingSpinner() {
  useEffect(() => {
    NProgress.start();
    return () => {
      NProgress.done();
    };
  }, []);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-gray-500 gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      <p>Loading...</p>
    </div>
  );
}

function ContentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-950">
        <Navigation />

        <ContentWrapper>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/creator" element={<CharacterCreatorPage />} />
            </Routes>
          </Suspense>

          {/* Floating Dice Roller (always available) */}
          <DiceRoller />
          <Toaster />
        </ContentWrapper>
      </div>
    </BrowserRouter>
  );
}