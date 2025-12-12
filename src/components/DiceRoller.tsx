import { useState } from "react";
import { X, ChevronDown, Minus, Plus, RotateCcw, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type DiceType = 4 | 6 | 8 | 10 | 12 | 20 | 100;
type RollMode = "normal" | "advantage" | "disadvantage";

interface Roll {
  id: string;
  dice: DiceType;
  count: number;
  result: number[];
  modifier: number;
  total: number;
  timestamp: Date;
  displayText: string;
  mode: RollMode;
}

export function DiceRoller() {
  const [isOpen, setIsOpen] = useState(false);
  const [modifier, setModifier] = useState(0);
  const [rollMode, setRollMode] = useState<RollMode>("normal");
  const [showHistory, setShowHistory] = useState(false);
  const [rollHistory, setRollHistory] = useState<Roll[]>([]);
  const [currentRoll, setCurrentRoll] = useState<Roll | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  // Custom stat roll settings
  const [statCount, setStatCount] = useState(4);
  const [statSides, setStatSides] = useState(6);
  const [statDrop, setStatDrop] = useState(1);

  const rollDice = (sides: DiceType, count: number = 1) => {
    setIsRolling(true);

    let counter = 0;
    const interval = setInterval(() => {
      const tempResults = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
      const tempSum = tempResults.reduce((a, b) => a + b, 0);
      setCurrentRoll({
        id: `temp-${Date.now()}`,
        dice: sides,
        count,
        result: tempResults,
        modifier,
        total: tempSum + modifier,
        timestamp: new Date(),
        displayText: `${count}d${sides}${modifier !== 0 ? ` ${modifier > 0 ? '+' : ''}${modifier}` : ''}`,
        mode: rollMode,
      });
      counter++;

      if (counter >= 10) {
        clearInterval(interval);
        const finalResults = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
        const sum = finalResults.reduce((a, b) => a + b, 0);
        const finalRoll: Roll = {
          id: `roll-${Date.now()}`,
          dice: sides,
          count,
          result: finalResults,
          modifier,
          total: sum + modifier,
          timestamp: new Date(),
          displayText: `${count}d${sides}${modifier !== 0 ? ` ${modifier > 0 ? '+' : ''}${modifier}` : ''}`,
          mode: rollMode,
        };
        setCurrentRoll(finalRoll);
        setRollHistory((prev) => [finalRoll, ...prev].slice(0, 50));
        setIsRolling(false);
      }
    }, 50);
  };

  const rollStatDice = () => {
    // Roll multiple dice and drop lowest
    const results = Array.from({ length: statCount }, () => Math.floor(Math.random() * statSides) + 1);
    const sorted = [...results].sort((a, b) => a - b);
    const dropped = sorted.slice(0, statDrop); // Drop n lowest
    const kept = sorted.slice(statDrop);
    const total = kept.reduce((a, b) => a + b, 0);

    // Create a roll entry for history/display (simplified for stats)
    const finalRoll: Roll = {
      id: `stat-${Date.now()}`,
      dice: statSides as DiceType,
      count: statCount,
      result: results, // Store original results
      modifier: 0,
      total: total,
      timestamp: new Date(),
      displayText: `Stat (${statCount}d${statSides} drop ${statDrop})`,
      mode: "normal",
    };
    setCurrentRoll(finalRoll);
    setRollHistory((prev) => [finalRoll, ...prev].slice(0, 50));
  };

  const getDiceGradient = (sides: DiceType): string => {
    switch (sides) {
      case 4: return "from-blue-600 to-cyan-700";
      case 6: return "from-green-600 to-emerald-700";
      case 8: return "from-yellow-600 to-orange-600";
      case 10: return "from-orange-600 to-red-600";
      case 12: return "from-red-600 to-pink-600";
      case 20: return "from-purple-600 to-indigo-600";
      case 100: return "from-pink-600 to-purple-600";
      default: return "from-gray-600 to-gray-700";
    }
  };

  const getDiceSvg = (sides: DiceType) => {
    // Existing paths from DiceIcons.tsx adapted here
    // We apply gradients to stroke (color) for wireframe style, or try to fill if possible.
    // Given the wireframe nature, stroke gradient often looks better or fill with thick stroke.
    // The user requested "inside dice icons", implying filled.
    // I will try to apply the gradient to the stroke to create a neon effect matching the requested style
    // but preserving the wireframe shapes which are standard. 

    // Gradient definitions are reused from the request but applied to stroke or fill as appropriate for the path.
    // Since these paths are strokes (lines), I will apply gradient to stroke.

    const commonProps = {
      fill: "none",
      strokeWidth: "1.5",
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const,
      className: "w-full h-full"
    };

    switch (sides) {
      case 4:
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <path
              d="M12 2L2 19h20L12 2zm0 0v17"
              stroke="url(#gradient-d4)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="gradient-d4" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#155DFC" />
                <stop offset="1" stopColor="#007595" />
              </linearGradient>
            </defs>
          </svg>
        );
      case 6:
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <g stroke="url(#gradient-d6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3.38L20.5 8.29V18.1L12 23.01L3.5 18.1V8.29L12 3.38Z" />
              <path d="M12 3.38V13.2" />
              <path d="M12 13.2L20.5 8.29" />
              <path d="M12 13.2L3.5 8.29" />
            </g>
            <defs>
              <linearGradient id="gradient-d6" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00A63E" />
                <stop offset="1" stopColor="#007A55" />
              </linearGradient>
            </defs>
          </svg>
        );
      case 8:
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <g stroke="url(#gradient-d8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 12l10 10 10-10L12 2z" />
              <path d="M2 12h20" />
              <path d="M12 2v20" />
              <path d="M12 12l7-4" />
              <path d="M12 12l-7-4" />
            </g>
            <defs>
              <linearGradient id="gradient-d8" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#D08700" />
                <stop offset="1" stopColor="#F54900" />
              </linearGradient>
            </defs>
          </svg>
        );
      case 10:
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <g stroke="url(#gradient-d10)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l8 11-8 9-8-9 8-11z" />
              <path d="M4 13l8-3 8 3" />
              <path d="M12 2v8" />
              <path d="M12 22v-9" />
            </g>
            <defs>
              <linearGradient id="gradient-d10" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F54900" />
                <stop offset="1" stopColor="#E7000B" />
              </linearGradient>
            </defs>
          </svg>
        );
      case 12:
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <g stroke="url(#gradient-d12)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2.5L20.66 7.5V17.5L12 22.5L3.34 17.5V7.5L12 2.5Z" />
              <path d="M12 7l4.7 3.4-1.8 5.6H9.1l-1.8-5.6L12 7z" />
              <path d="M12 2.5V7" />
              <path d="M20.66 7.5L16.7 10.4" />
              <path d="M20.66 17.5L14.9 16" />
              <path d="M12 22.5V16" />
              <path d="M3.34 17.5L9.1 16" />
              <path d="M3.34 7.5L7.3 10.4" />
            </g>
            <defs>
              <linearGradient id="gradient-d12" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E7000B" />
                <stop offset="1" stopColor="#E600A8" />
              </linearGradient>
            </defs>
          </svg>
        );
      case 20:
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <g stroke="url(#gradient-d20)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2.5L20.66 7.5V17.5L12 22.5L3.34 17.5V7.5L12 2.5Z" />
              <path d="M12 2.5v15" />
              <path d="M3.34 7.5L12 12l8.66-4.5" />
              <path d="M3.34 17.5L12 12l8.66 5.5" />
              <path d="M12 22.5v-5" />
            </g>
            <defs>
              <linearGradient id="gradient-d20" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#7C3AED" />
                <stop offset="1" stopColor="#4C1D95" />
              </linearGradient>
            </defs>
          </svg>
        );
      case 100:
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <g stroke="url(#gradient-d100)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              {/* Reuse d10 paths for d100 usually, or double it up. Using D10 path for now as per previous implementation logic */}
              <path d="M12 2l8 11-8 9-8-9 8-11z" />
              <path d="M4 13l8-3 8 3" />
              <path d="M12 2v8" />
              <path d="M12 22v-9" />
            </g>
            <defs>
              <linearGradient id="gradient-d100" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#EC4899" />
                <stop offset="1" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 w-20 h-20 hover:scale-110 transition-all z-50 group"
          style={{ filter: 'drop-shadow(0 20px 25px rgba(124, 51, 6, 0.5))' }}
        >
          <div className="relative w-full h-full group-hover:rotate-12 transition-transform">
            {/* Retaining the original complex floating button SVG as it was working and intricate */}
            <svg width="100%" height="100%" viewBox="0 0 73 73" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="path-1-inside-1_125_2124" fill="white">
                <path d="M0 36.3066C0 16.255 16.255 0 36.3066 0C56.3582 0 72.6133 16.255 72.6133 36.3066C72.6133 56.3582 56.3582 72.6133 36.3066 72.6133C16.255 72.6133 0 56.3582 0 36.3066Z" />
              </mask>
              <path d="M0 36.3066C0 16.255 16.255 0 36.3066 0C56.3582 0 72.6133 16.255 72.6133 36.3066C72.6133 56.3582 56.3582 72.6133 36.3066 72.6133C16.255 72.6133 0 56.3582 0 36.3066Z" fill="url(#paint0_linear_125_2124)" />
              <path d="M36.3066 72.6133V70.3441C17.5083 70.3441 2.26917 55.105 2.26917 36.3066H0H-2.26917C-2.26917 57.6115 15.0018 74.8824 36.3066 74.8824V72.6133ZM72.6133 36.3066H70.3441C70.3441 55.105 55.105 70.3441 36.3066 70.3441V72.6133V74.8824C57.6115 74.8824 74.8824 57.6115 74.8824 36.3066H72.6133ZM36.3066 0V2.26917C55.105 2.26917 70.3441 17.5083 70.3441 36.3066H72.6133H74.8824C74.8824 15.0018 57.6115 -2.26917 36.3066 -2.26917V0ZM36.3066 0V-2.26917C15.0018 -2.26917 -2.26917 15.0018 -2.26917 36.3066H0H2.26917C2.26917 17.5083 17.5083 2.26917 36.3066 2.26917V0Z" fill="#FE9A00" fillOpacity="0.5" mask="url(#path-1-inside-1_125_2124)" />
              <path d="M54.0658 46.6204C54.1081 46.578 54.1081 46.5357 54.1081 46.5357V46.4934V46.451V46.4087C54.1081 46.4087 54.1081 46.3664 54.1081 46.324V46.2817C54.1081 46.2394 54.1081 46.197 54.1081 46.197V26.5115C54.1081 26.5115 54.1081 26.5115 54.1081 26.4692V26.4269V26.3845C54.1081 26.3845 54.1081 26.3845 54.1081 26.3422C54.1081 26.3422 54.1081 26.3422 54.1081 26.2998V26.2575V26.2152C54.1081 26.1728 54.0658 26.1728 54.0658 26.1305C54.0658 26.1305 54.0658 26.1305 54.0658 26.0882C54.0658 26.0458 54.0235 26.0458 54.0235 26.0458C54.0235 26.0458 54.0235 26.0458 54.0235 26.0035L53.9811 25.9612C53.9811 25.9612 53.9388 25.9188 53.8964 25.9188C53.8964 25.9188 53.8964 25.9188 53.8541 25.9188L36.7087 15.9703C36.4547 15.8432 36.1583 15.8432 35.9467 15.9703L18.8859 25.8342C18.8436 25.8342 18.8436 25.8765 18.8012 25.8765C18.8012 25.8765 18.8012 25.8765 18.7589 25.8765L18.7166 25.9188C18.7166 25.9188 18.7166 25.9188 18.6742 25.9612L18.6319 26.0035C18.6319 26.0035 18.6319 26.0458 18.5896 26.0458C18.5896 26.0458 18.5896 26.0458 18.5472 26.0882V26.1305C18.5472 26.1305 18.5472 26.1728 18.5049 26.1728V26.2152V26.2575V26.2998V26.3422V26.3845V26.4269C18.5049 26.4269 18.5049 26.4269 18.5049 26.4692V46.1547C18.5049 46.197 18.5049 46.2394 18.5049 46.2817V46.324C18.5049 46.3664 18.5472 46.4087 18.5472 46.451C18.5472 46.4934 18.5896 46.5357 18.6319 46.578C18.6319 46.578 18.6319 46.578 18.6319 46.6204C18.6319 46.705 18.6742 46.7474 18.7166 46.7474C18.7589 46.7897 18.7589 46.7897 18.8012 46.832C18.8012 46.832 18.8012 46.832 18.8436 46.832C18.8436 46.832 18.8436 46.832 18.8859 46.832L35.9467 56.696C35.9467 56.696 35.989 56.696 35.989 56.7383H36.0313H36.0737H36.116H36.1583C36.1583 56.7383 36.1583 56.7383 36.2007 56.7383C36.243 56.7383 36.243 56.7383 36.2853 56.7383C36.3277 56.7383 36.3277 56.7383 36.37 56.7383C36.37 56.7383 36.37 56.7383 36.4123 56.7383C36.4547 56.7383 36.4547 56.7383 36.497 56.7383H36.5393H36.5817H36.624C36.624 56.7383 36.6663 56.7383 36.6663 56.696L53.7271 46.832C53.7271 46.832 53.7271 46.832 53.7694 46.832C53.7694 46.832 53.7694 46.832 53.8118 46.832C53.8118 46.832 53.8541 46.832 53.8541 46.7897L53.8964 46.7474C53.8964 46.7474 53.9388 46.7474 53.9388 46.705L53.9811 46.6627C53.9811 46.6627 53.9811 46.6204 54.0235 46.6204ZM20.1983 30.9143L24.9397 42.6833C24.982 42.8103 24.9397 42.9796 24.7704 43.0643L20.4099 44.8847C20.2406 44.9693 20.0289 44.8423 20.0289 44.6306V30.9566C20.0289 30.872 20.1559 30.8296 20.1983 30.9143ZM44.7522 42.5986H27.9031C27.6914 42.5986 27.5644 42.3446 27.6491 42.1752L36.0737 27.5699C36.2007 27.4005 36.4547 27.4005 36.5393 27.5699L44.9639 42.1752C45.0909 42.3869 44.9639 42.5986 44.7522 42.5986ZM25.9981 41.0746L20.5369 27.5699C20.4523 27.4005 20.5793 27.1889 20.7909 27.1889L34.4226 26.5115C34.6343 26.5115 34.8036 26.7232 34.6766 26.9349L26.4638 41.1169C26.3791 41.3286 26.0827 41.3286 25.9981 41.0746ZM44.5829 44.6306L36.5393 54.5369C36.4123 54.6639 36.2007 54.6639 36.116 54.5369L28.0725 44.6306C27.9455 44.4613 28.0725 44.165 28.2841 44.165H44.3712C44.5829 44.165 44.7099 44.4613 44.5829 44.6306ZM46.1916 41.1169L37.9787 26.9349C37.8517 26.7232 38.021 26.5115 38.2327 26.5115L51.8644 27.1889C52.0761 27.1889 52.1607 27.4005 52.1184 27.5699L46.6573 41.0746C46.5726 41.3286 46.2763 41.3286 46.1916 41.1169ZM37.0897 24.6488V18.468C37.0897 18.2563 37.3437 18.1293 37.513 18.214L49.8747 25.3685C49.9593 25.4108 49.917 25.5378 49.8323 25.5378L37.3437 24.9028C37.2167 24.9028 37.0897 24.7758 37.0897 24.6488ZM35.2693 24.9028L22.7807 25.5378C22.696 25.5378 22.6537 25.4108 22.7383 25.3685L35.1423 18.2563C35.3116 18.1293 35.5656 18.2986 35.5656 18.5103V24.6488C35.5656 24.7758 35.4386 24.9028 35.2693 24.9028ZM25.9557 44.5036L32.7716 52.9282C32.8139 53.0129 32.7292 53.0975 32.6446 53.0552L21.5106 46.6204C21.299 46.4934 21.3413 46.197 21.553 46.1124L25.6594 44.419C25.7441 44.3766 25.8711 44.419 25.9557 44.5036ZM46.9959 44.419L51.1024 46.1124C51.314 46.197 51.3564 46.4934 51.1447 46.6204L39.9684 53.0552C39.8838 53.0975 39.7991 53.0129 39.8414 52.9282L46.6573 44.5036C46.7843 44.419 46.9113 44.3766 46.9959 44.419ZM52.2454 44.8847L47.885 43.0643C47.758 43.0219 47.6733 42.8526 47.7156 42.6833L52.4571 30.9143C52.4994 30.8296 52.6264 30.872 52.6264 30.9566V44.6306C52.6264 44.8423 52.4147 44.9693 52.2454 44.8847Z" fill="white" />
              <defs>
                <linearGradient id="paint0_linear_125_2124" x1="0" y1="0" x2="72.6133" y2="72.6133" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#E17100" />
                  <stop offset="1" stopColor="#CA3500" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </motion.button>
      )}

      {/* Dice Roller Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-8 right-8 w-[320px] bg-white rounded-lg shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-700 px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Header Icon - using d6 path with white stroke */}
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                  <path d="M12 3.38L20.5 8.29V18.1L12 23.01L3.5 18.1V8.29L12 3.38Z" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 3.38V13.2" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-white text-[15px] font-normal">Dice Roller</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1 hover:bg-white/10 rounded transition-all">
                  <ChevronDown className="w-4 h-4 text-white" />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded transition-all">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {/* Roll Mode */}
              <div>
                <label className="block text-[13.7px] text-gray-700 mb-2">Roll Mode</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setRollMode("normal")}
                    className={`flex-1 px-2 py-1.5 rounded text-xs ${rollMode === "normal"
                      ? "bg-purple-100 text-purple-700 border border-purple-500"
                      : "bg-white text-gray-700 border border-gray-300"
                      }`}
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => setRollMode("advantage")}
                    className={`flex-1 px-2 py-1.5 rounded text-xs ${rollMode === "advantage"
                      ? "bg-purple-100 text-purple-700 border border-purple-500"
                      : "bg-white text-gray-700 border border-gray-300"
                      }`}
                  >
                    Advantage
                  </button>
                  <button
                    onClick={() => setRollMode("disadvantage")}
                    className={`flex-1 px-2 py-1.5 rounded text-xs ${rollMode === "disadvantage"
                      ? "bg-purple-100 text-purple-700 border border-purple-500"
                      : "bg-white text-gray-700 border border-gray-300"
                      }`}
                  >
                    Disadvantage
                  </button>
                </div>
              </div>

              {/* Custom Stat Roll */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-2">
                <h3 className="text-xs font-semibold text-amber-800 uppercase tracking-wide">Custom Stat Roll (Drop Lowest)</h3>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-[10px] text-gray-500 mb-1">Count</label>
                    <input
                      type="number"
                      value={statCount}
                      onChange={(e) => setStatCount(parseInt(e.target.value) || 4)}
                      className="w-full px-2 py-1 bg-white rounded text-sm border-0"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] text-gray-500 mb-1">Sides</label>
                    <select
                      value={`d${statSides}`}
                      onChange={(e) => setStatSides(parseInt(e.target.value.slice(1)))}
                      className="w-full px-2 py-1 bg-white rounded text-sm border-0"
                    >
                      <option>d4</option>
                      <option>d6</option>
                      <option>d8</option>
                      <option>d10</option>
                      <option>d12</option>
                      <option>d20</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] text-gray-500 mb-1">Drop</label>
                    <input
                      type="number"
                      value={statDrop}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setStatDrop(isNaN(val) ? 0 : val);
                      }}
                      className="w-full px-2 py-1 bg-white rounded text-sm border-0"
                    />
                  </div>
                </div>
                <button
                  onClick={rollStatDice}
                  className="w-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-semibold py-2 rounded hover:bg-amber-200 transition-all"
                >
                  Roll Stats ({statCount}d{statSides} drop {statDrop})
                </button>
              </div>

              {/* Modifier */}
              <div>
                <label className="block text-[13.7px] text-gray-700 mb-1">Modifier</label>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => setModifier(Math.max(-99, modifier - 1))}
                    className="p-2 bg-gray-200 hover:bg-gray-300 rounded transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={modifier}
                    onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-center"
                  />
                  <button
                    onClick={() => setModifier(Math.min(99, modifier + 1))}
                    className="p-2 bg-gray-200 hover:bg-gray-300 rounded transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Result Display */}
              <AnimatePresence mode="wait">
                {currentRoll && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="bg-gray-100 rounded-lg p-3 text-center mb-2 border border-gray-200"
                  >
                    <div className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold mb-1">
                      Result {currentRoll.mode !== "normal" && `(${currentRoll.mode})`}
                    </div>
                    <div className="text-3xl font-bold text-gray-800 font-['Cinzel',serif]">
                      {currentRoll.total}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {currentRoll.displayText}
                      {currentRoll.result.length > 1 && (
                        <span className="text-[10px] text-gray-400 block mt-0.5">
                          [{currentRoll.result.join(", ")}]
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dice Buttons Grid */}
              <div className="grid grid-cols-4 gap-2">
                {[4, 6, 8, 10, 12, 20, 100].map((dice) => (
                  <button
                    key={dice}
                    onClick={() => rollDice(dice as DiceType, 1)}
                    disabled={isRolling}
                    className="aspect-square bg-black rounded border-2 border-white/20 shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative p-1"
                  >
                    <div className="w-full h-full flex items-center justify-center scale-75">
                      {getDiceSvg(dice as DiceType)}
                    </div>
                    <span className="absolute bottom-1 right-1 text-[10px] text-white font-['Cinzel',serif]">
                      d{dice}
                    </span>
                  </button>
                ))}
              </div>

              {/* Show History Button */}
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full py-2 flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-50 rounded transition-all text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Show History ({rollHistory.length})
              </button>

              {/* History Section */}
              {showHistory && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="max-h-48 overflow-y-auto space-y-2 pt-2 border-t"
                >
                  {rollHistory.length > 0 && (
                    <button
                      onClick={() => setRollHistory([])}
                      className="w-full text-[10px] text-red-500 hover:text-red-700 hover:bg-red-50 py-1 rounded transition-colors flex items-center justify-center gap-1 mb-2"
                    >
                      <Trash2 className="w-3 h-3" />
                      Clear History
                    </button>
                  )}
                  {rollHistory.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No rolls yet</p>
                  ) : (
                    rollHistory.map((roll) => (
                      <div key={roll.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                        <span className="text-gray-600">{roll.displayText}</span>
                        <span className="font-semibold">{roll.total}</span>
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap');
      `}</style>
    </>
  );
}