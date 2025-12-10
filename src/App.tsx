import { useState } from "react";
import type { Race, Class, Spell, Item, Feat, Background } from "./types/dnd-types";
import { RACES, SUBRACES, BACKGROUNDS, FEATS } from "./data/comprehensive-library";
import { combinedClasses as CLASSES } from "./data/mock-classes";
import { mockSubclasses as SUBCLASSES } from "./data/mock-subclasses";
import { comprehensiveSpells as SPELLS } from "./data/comprehensive-spells";
import { expandedItems as ITEMS } from "./data/expanded-items";
import { MONSTERS } from "./data/monsters";
import { Toaster, toast } from "sonner";
import { Home, BookOpen, Wand2, Settings } from "lucide-react";
import { LandingPage } from "./components/LandingPage";
import { Library } from "./components/Library";
import { CharacterCreator } from "./components/CharacterCreatorBeginner";
import { AdminPanel } from "./components/AdminPanel";
import { DiceRoller } from "./components/DiceRoller";
import { exportEntityToJSON } from "./utils/data-import-export";

type Page = "home" | "library" | "creator" | "admin";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  // Content management state
  const [races, setRaces] = useState<Race[]>(RACES);
  const [classes, setClasses] = useState<Class[]>(CLASSES);
  const [subclasses, setSubclasses] = useState(SUBCLASSES);
  const [spells, setSpells] = useState<Spell[]>(SPELLS);
  const [items, setItems] = useState<Item[]>(ITEMS);
  const [feats, setFeats] = useState<Feat[]>(FEATS);
  const [backgrounds, setBackgrounds] = useState<Background[]>(BACKGROUNDS);
  const [monsters, setMonsters] = useState<any[]>(MONSTERS);

  // Import/Export handlers
  const handleImportData = async (data: any, type: string) => {
    try {
      // Validate and normalize data based on type
      const normalizeData = (items: any[], entityType: string) => {
        return items.map((item, index) => {
          // Ensure unique ID
          if (!item.id) {
            item.id = `${entityType}-${Date.now()}-${index}`;
          }

          // Special handling for spells - ensure components structure exists
          if (entityType === 'spells' && !item.components) {
            item.components = {
              verbal: false,
              somatic: false,
              material: false
            };
          }

          // Special handling for races - ensure abilityScoreIncrease exists
          if (entityType === 'race' && !item.abilityScoreIncrease) {
            item.abilityScoreIncrease = {};
          }

          // Special handling for classes - ensure required arrays exist
          if (entityType === 'class') {
            if (!item.primaryAbility) item.primaryAbility = [];
            if (!item.savingThrows) item.savingThrows = [];
            if (!item.features) item.features = [];
            if (!item.subclasses) item.subclasses = [];
            if (!item.hitDie) item.hitDie = 8;
          }

          // Ensure arrays exist for common fields
          if (!item.classes && (entityType === 'spells')) {
            item.classes = [];
          }
          if (!item.languages && (entityType === 'race' || entityType === 'background')) {
            item.languages = entityType === 'race' ? [] : 0;
          }
          if (!item.traits && entityType === 'race') {
            item.traits = [];
          }

          return item;
        });
      };

      switch (type) {
        case "races":
          const normalizedRaces = normalizeData(data, "race");
          setRaces([...races, ...normalizedRaces]);
          toast.success(`Imported ${data.length} races`);
          break;
        case "classes":
          const normalizedClasses = normalizeData(data, "class");
          setClasses([...classes, ...normalizedClasses]);
          toast.success(`Imported ${data.length} classes`);
          break;
        case "spells":
          const normalizedSpells = normalizeData(data, "spell");
          setSpells([...spells, ...normalizedSpells]);
          toast.success(`Imported ${data.length} spells`);
          break;
        case "items":
          const normalizedItems = normalizeData(data, "item");
          setItems([...items, ...normalizedItems]);
          toast.success(`Imported ${data.length} items`);
          break;
        case "feats":
          const normalizedFeats = normalizeData(data, "feat");
          setFeats([...feats, ...normalizedFeats]);
          toast.success(`Imported ${data.length} feats`);
          break;
        case "backgrounds":
          const normalizedBackgrounds = normalizeData(data, "background");
          setBackgrounds([...backgrounds, ...normalizedBackgrounds]);
          toast.success(`Imported ${data.length} backgrounds`);
          break;
        case "monsters":
          const normalizedMonsters = normalizeData(data, "monster");
          setMonsters([...monsters, ...normalizedMonsters]);
          toast.success(`Imported ${data.length} monsters`);
          break;
        default:
          toast.error("Unknown entity type");
      }
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Failed to import data");
    }
  };

  const handleExportData = (type: string) => {
    try {
      switch (type) {
        case "races":
          exportEntityToJSON(type, races);
          toast.success("Races exported successfully");
          break;
        case "classes":
          exportEntityToJSON(type, classes);
          toast.success("Classes exported successfully");
          break;
        case "spells":
          exportEntityToJSON(type, spells);
          toast.success("Spells exported successfully");
          break;
        case "items":
          exportEntityToJSON(type, items);
          toast.success("Items exported successfully");
          break;
        case "feats":
          exportEntityToJSON(type, feats);
          toast.success("Feats exported successfully");
          break;
        case "backgrounds":
          exportEntityToJSON(type, backgrounds);
          toast.success("Backgrounds exported successfully");
          break;
        case "monsters":
          exportEntityToJSON(type, monsters);
          toast.success("Monsters exported successfully");
          break;
        default:
          toast.error("Unknown entity type");
      }
    } catch (error) {
      toast.error("Failed to export data");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar (only show when not on home page) */}
      {currentPage !== "home" && (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-8">
                <button
                  onClick={() => setCurrentPage("home")}
                  className="flex items-center gap-2 text-gray-900 hover:text-purple-700 transition-colors"
                >
                  <Home className="w-5 h-5" />
                  <span>D&D Omni-Archive</span>
                </button>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setCurrentPage("library")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${currentPage === "library"
                        ? "bg-red-100 text-red-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                  >
                    <BookOpen className="w-5 h-5" />
                    Library
                  </button>

                  <button
                    onClick={() => setCurrentPage("creator")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${currentPage === "creator"
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                  >
                    <Wand2 className="w-5 h-5" />
                    Character Creator
                  </button>

                  <button
                    onClick={() => setCurrentPage("admin")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${currentPage === "admin"
                        ? "bg-amber-100 text-amber-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                  >
                    <Settings className="w-5 h-5" />
                    Admin
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                {currentPage === "library" && "Browse the archives"}
                {currentPage === "creator" && "Build your character"}
                {currentPage === "admin" && "Manage content"}
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Page Content */}
      {currentPage === "home" && <LandingPage onNavigate={setCurrentPage} />}
      {currentPage === "library" && (
        <Library
          spells={spells}
          classes={classes}
          subclasses={subclasses}
          races={races}
          items={items}
          backgrounds={backgrounds}
        />
      )}
      {currentPage === "creator" && <CharacterCreator />}
      {currentPage === "admin" && (
        <AdminPanel
          onImportData={handleImportData}
          onExportData={handleExportData}
        />
      )}

      {/* Floating Dice Roller (always available) */}
      <DiceRoller />
      <Toaster />
    </div>
  );
}