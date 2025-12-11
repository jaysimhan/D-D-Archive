import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { Home, BookOpen, Wand2 } from "lucide-react";
import { HomePage } from "./pages/HomePage";
import { LibraryPage } from "./pages/LibraryPage";
import { CharacterCreatorPage } from "./pages/CharacterCreatorPage";
import { DiceRoller } from "./components/DiceRoller";

function Navigation() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  if (isHome) return null;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-900 hover:text-purple-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>D&D Omni-Archive</span>
            </Link>

            <div className="flex items-center gap-4">
              <Link
                to="/library"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${location.pathname === "/library"
                  ? "bg-red-100 text-red-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
              >
                <BookOpen className="w-5 h-5" />
                Library
              </Link>

              <Link
                to="/creator"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${location.pathname === "/creator"
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
              >
                <Wand2 className="w-5 h-5" />
                Character Creator
              </Link>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            {location.pathname === "/library" && "Browse the archives"}
            {location.pathname === "/creator" && "Build your character"}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/creator" element={<CharacterCreatorPage />} />
        </Routes>

        {/* Floating Dice Roller (always available) */}
        <DiceRoller />
        <Toaster />
      </div>
    </BrowserRouter>
  );
}