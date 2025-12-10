import { useState, useEffect } from "react";
import { Dices, History, X, Minus, Plus, ChevronDown, ChevronUp, Trash2, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type DiceType = 4 | 6 | 8 | 10 | 12 | 20 | 100;

interface Roll {
  id: string;
  dice: DiceType;
  count: number;
  result: number[];
  modifier: number;
  total: number;
  timestamp: Date;
  displayText: string;
}

export function DiceRoller() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [modifier, setModifier] = useState(0);
  const [customRollInput, setCustomRollInput] = useState("");
  const [currentRoll, setCurrentRoll] = useState<Roll | null>(null);
  const [rollHistory, setRollHistory] = useState<Roll[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const diceTypes: DiceType[] = [4, 6, 8, 10, 12, 20, 100];

  const rollDice = (sides: DiceType, count: number = 1) => {
    setIsRolling(true);

    // Simulate rolling animation
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
      });
      counter++;

      if (counter >= 10) {
        clearInterval(interval);
        // Final roll
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
        };
        setCurrentRoll(finalRoll);
        setRollHistory((prev) => [finalRoll, ...prev].slice(0, 50)); // Keep last 50 rolls
        setIsRolling(false);
      }
    }, 50);
  };

  const handleCustomRoll = () => {
    // Parse input like "2d6", "3d20", etc.
    const match = customRollInput.match(/^(\d+)d(\d+)$/i);
    if (match) {
      const count = parseInt(match[1]);
      const sides = parseInt(match[2]);

      if (count > 0 && count <= 100 && sides > 0 && sides <= 1000) {
        rollDice(sides as DiceType, count);
        setCustomRollInput("");
      }
    }
  };

  const clearHistory = () => {
    setRollHistory([]);
  };

  const getDiceColor = (sides: DiceType): string => {
    switch (sides) {
      case 4:
        return "#3b82f6"; // blue
      case 6:
        return "#10b981"; // green
      case 8:
        return "#eab308"; // yellow
      case 10:
        return "#f97316"; // orange
      case 12:
        return "#ef4444"; // red
      case 20:
        return "#a855f7"; // purple
      case 100:
        return "#ec4899"; // pink
      default:
        return "#6b7280"; // gray
    }
  };

  const getDiceSVG = (sides: DiceType, color: string): JSX.Element => {
    const strokeWidth = 1.5;
    const opacity = 0.8;

    switch (sides) {
      case 4: // Tetrahedron
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Front face */}
            <polygon points="50,20 85,80 15,80" fill="none" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />
            {/* Back edges */}
            <line x1="50" y1="20" x2="50" y2="65" stroke={color} strokeWidth={strokeWidth} opacity={opacity * 0.5} />
            <line x1="50" y1="65" x2="15" y2="80" stroke={color} strokeWidth={strokeWidth} opacity={opacity * 0.5} />
            <line x1="50" y1="65" x2="85" y2="80" stroke={color} strokeWidth={strokeWidth} opacity={opacity * 0.5} />
            <text x="50" y="70" textAnchor="middle" fill={color} fontSize="16" fontWeight="bold">d4</text>
          </svg>
        );

      case 6: // Cube
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Front face */}
            <polygon points="30,55 30,85 60,85 60,55" fill="none" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />
            {/* Top face */}
            <polygon points="30,55 45,45 75,45 60,55" fill="none" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />
            {/* Right face */}
            <polygon points="60,55 75,45 75,75 60,85" fill="none" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />
            {/* Internal edges */}
            <line x1="30" y1="55" x2="45" y2="45" stroke={color} strokeWidth={strokeWidth} opacity={opacity * 0.6} />
            <line x1="60" y1="55" x2="75" y2="45" stroke={color} strokeWidth={strokeWidth} opacity={opacity * 0.6} />
            <text x="50" y="75" textAnchor="middle" fill={color} fontSize="16" fontWeight="bold">d6</text>
          </svg>
        );

      case 8: // Octahedron
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Top pyramid */}
            <line x1="50" y1="15" x2="25" y2="50" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />
            <line x1="50" y1="15" x2="75" y2="50" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />
            <line x1="50" y1="15" x2="50" y2="50" stroke={color} strokeWidth={strokeWidth} opacity={opacity * 0.5} />
            {/* Middle diamond */}
            <polygon points="25,50 50,35 75,50 50,65" fill="none" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />
            {/* Bottom pyramid */}
            <line x1="50" y1="85" x2="25" y2="50" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />
            <line x1="50" y1="85" x2="75" y2="50" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />
            <line x1="50" y1="85" x2="50" y2="65" stroke={color} strokeWidth={strokeWidth} opacity={opacity * 0.5} />
            <text x="50" y="55" textAnchor="middle" fill={color} fontSize="16" fontWeight="bold">d8</text>
          </svg>
        );

      case 10: // Pentagonal Trapezohedron
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Top point */}
            <line x1="50" y1="15" x2="35" y2="40" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />
            <line x1="50" y1="15" x2="65" y2="40" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />
            <line x1="50" y1="15" x2="50" y2="40" stroke={color} strokeWidth={strokeWidth} opacity={opacity * 0.4} />
            {/* Middle pentagon */}
            <polygon points="35,40 65,40 75,55 50,70 25,55" fill="none" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />
            {/* Bottom point */}
            <line x1="50" y1="85" x2="25" y2="55" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />
            <line x1="50" y1="85" x2="75" y2="55" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />
            <line x1="50" y1="85" x2="50" y2="70" stroke={color} strokeWidth={strokeWidth} opacity={opacity * 0.5} />
            {/* Internal edges */}
            <line x1="35" y1="40" x2="25" y2="55" stroke={color} strokeWidth={strokeWidth} opacity={opacity * 0.4} />
            <line x1="65" y1="40" x2="75" y2="55" stroke={color} strokeWidth={strokeWidth} opacity={opacity * 0.4} />
            <text x="50" y="58" textAnchor="middle" fill={color} fontSize="15" fontWeight="bold">d10</text>
          </svg>
        );

      case 12: // Dodecahedron
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Front pentagon */}
            <polygon points="50,45 65,52 58,68 42,68 35,52" fill="none" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />
            {/* Top edges */}
            <line x1="50" y1="45" x2="50" y2="25" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />
            <line x1="35" y1="52" x2="25" y2="38" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />
            <line x1="65" y1="52" x2="75" y2="38" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />
            {/* Top pentagon outline */}
            <line x1="50" y1="25" x2="25" y2="38" stroke={color} strokeWidth={strokeWidth} opacity={opacity * 0.5} />
            <line x1="50" y1="25" x2="75" y2="38" stroke={color} strokeWidth={strokeWidth} opacity={opacity * 0.5} />
            <line x1="25" y1="38" x2="30" y2="50" stroke={color} strokeWidth={strokeWidth} opacity={opacity * 0.5} />
            <line x1="75" y1="38" x2="70" y2="50" stroke={color} strokeWidth={strokeWidth} opacity={opacity * 0.5} />
            {/* Bottom edges */}
            <line x1="42" y1="68" x2="35" y2="80" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />
            <line x1="58" y1="68" x2="65" y2="80" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />
            <line x1="35" y1="80" x2="65" y2="80" stroke={color} strokeWidth={strokeWidth} opacity={opacity * 0.6} />
            <text x="50" y="60" textAnchor="middle" fill={color} fontSize="15" fontWeight="bold">d12</text>
          </svg>
        );

      case 20: // Icosahedron
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Center pentagon */}
            <polygon points="50,40 65,45 60,60 40,60 35,45" fill="none" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />
            {/* Top triangles */}
            <line x1="50" y1="40" x2="50" y2="20" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />
            <line x1="35" y1="45" x2="30" y2="30" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />
            <line x1="65" y1="45" x2="70" y2="30" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />
            <line x1="50" y1="20" x2="30" y2="30" stroke={color} strokeWidth={strokeWidth} opacity={opacity * 0.5} />
            <line x1="50" y1="20" x2="70" y2="30" stroke={color} strokeWidth={strokeWidth} opacity={opacity * 0.5} />
            {/* Side edges */}
            <line x1="35" y1="45" x2="20" y2="50" stroke={color} strokeWidth={strokeWidth} opacity={opacity * 0.6} />
            <line x1="65" y1="45" x2="80" y2="50" stroke={color} strokeWidth={strokeWidth} opacity={opacity * 0.6} />
            <line x1="20" y1="50" x2="30" y2="65" stroke={color} strokeWidth={strokeWidth} opacity={opacity * 0.5} />
            <line x1="80" y1="50" x2="70" y2="65" stroke={color} strokeWidth={strokeWidth} opacity={opacity * 0.5} />
            {/* Bottom triangles */}
            <line x1="40" y1="60" x2="30" y2="75" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />
            <line x1="60" y1="60" x2="70" y2="75" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />
            <line x1="50" y1="60" x2="50" y2="80" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />
            <line x1="30" y1="75" x2="50" y2="80" stroke={color} strokeWidth={strokeWidth} opacity={opacity * 0.6} />
            <line x1="70" y1="75" x2="50" y2="80" stroke={color} strokeWidth={strokeWidth} opacity={opacity * 0.6} />
            <text x="50" y="55" textAnchor="middle" fill={color} fontSize="15" fontWeight="bold">d20</text>
          </svg>
        );

      case 100: // Percentile (similar to d10 but distinguished)
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Top point */}
            <line x1="50" y1="15" x2="35" y2="40" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />
            <line x1="50" y1="15" x2="65" y2="40" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />
            <line x1="50" y1="15" x2="50" y2="40" stroke={color} strokeWidth={strokeWidth} opacity={opacity * 0.4} />
            {/* Middle section - wider */}
            <polygon points="30,40 70,40 75,55 50,72 25,55" fill="none" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />
            {/* Bottom point */}
            <line x1="50" y1="85" x2="25" y2="55" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />
            <line x1="50" y1="85" x2="75" y2="55" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />
            <line x1="50" y1="85" x2="50" y2="72" stroke={color} strokeWidth={strokeWidth} opacity={opacity * 0.5} />
            {/* Internal edges */}
            <line x1="30" y1="40" x2="25" y2="55" stroke={color} strokeWidth={strokeWidth} opacity={opacity * 0.4} />
            <line x1="70" y1="40" x2="75" y2="55" stroke={color} strokeWidth={strokeWidth} opacity={opacity * 0.4} />
            <text x="50" y="56" textAnchor="middle" fill={color} fontSize="13" fontWeight="bold">d100</text>
          </svg>
        );

      default:
        return <div />;
    }
  };

  const Dice2D = ({ sides, count = 1, onClick, disabled }: { sides: DiceType; count?: number; onClick: () => void; disabled: boolean }) => {
    const color = getDiceColor(sides);

    return (
      <motion.button
        onClick={onClick}
        disabled={disabled}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          relative w-full aspect-square rounded-lg bg-gray-900
          shadow-md hover:shadow-lg transition-all
          flex items-center justify-center
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          border border-gray-700
        `}
      >
        {getDiceSVG(sides, color)}
      </motion.button>
    );
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all z-50 flex items-center justify-center"
        >
          <Dices className="w-6 h-6" />
        </motion.button>
      )}

      {/* Dice Roller Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-80 bg-white rounded-lg shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dices className="w-5 h-5" />
                <span>Dice Roller</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  {isMinimized ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <div className="p-4">
                {/* Current Roll Display */}
                {currentRoll && (
                  <motion.div
                    key={currentRoll.id}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15
                    }}
                    className={`mb-4 p-6 rounded-lg text-center overflow-hidden ${isRolling
                        ? "bg-gradient-to-br from-gray-100 to-gray-200"
                        : currentRoll.result.every(r => r === currentRoll.dice)
                          ? "bg-gradient-to-br from-green-100 to-green-200"
                          : currentRoll.result.every(r => r === 1)
                            ? "bg-gradient-to-br from-red-100 to-red-200"
                            : "bg-gradient-to-br from-blue-100 to-blue-200"
                      }`}
                  >
                    <div className="text-sm text-gray-600 mb-2">
                      {currentRoll.displayText}
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
                      {currentRoll.result.map((r, idx) => (
                        <motion.span
                          key={idx}
                          className="text-2xl text-gray-900 font-semibold"
                          animate={isRolling ? {
                            scale: [1, 1.2, 1],
                          } : {}}
                          transition={{ duration: 0.5, repeat: isRolling ? Infinity : 0 }}
                        >
                          {r}
                        </motion.span>
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">
                      Sum: {currentRoll.result.reduce((a, b) => a + b, 0)}
                      {currentRoll.modifier !== 0 && (
                        <span> {currentRoll.modifier > 0 ? '+' : ''}{currentRoll.modifier}</span>
                      )}
                    </div>
                    {currentRoll.modifier !== 0 && (
                      <div className="text-3xl text-gray-900 mt-2">
                        Total: {currentRoll.total}
                      </div>
                    )}
                    {!isRolling && (
                      <>
                        <motion.div
                          className="text-xs text-gray-500 mt-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          {currentRoll.result.every(r => r === currentRoll.dice) && "🎉 All Max Rolls!"}
                          {currentRoll.result.every(r => r === 1) && "💀 All Ones!"}
                        </motion.div>
                        <motion.button
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          onClick={() => rollDice(currentRoll.dice, currentRoll.count)}
                          className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto text-sm"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Reroll
                        </motion.button>
                      </>
                    )}
                  </motion.div>
                )}

                {/* Custom Roll Input */}
                <div className="mb-4">
                  <label className="block text-sm text-gray-700 mb-2">
                    Custom Roll (e.g., 2d6, 3d20)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customRollInput}
                      onChange={(e) => setCustomRollInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCustomRoll()}
                      placeholder="2d6"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      disabled={isRolling}
                    />
                    <button
                      onClick={handleCustomRoll}
                      disabled={isRolling}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Roll
                    </button>
                  </div>
                </div>

                {/* Modifier Input */}
                <div className="mb-4">
                  <label className="block text-sm text-gray-700 mb-2">
                    Modifier
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setModifier(Math.max(-99, modifier - 1))}
                      className="p-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={modifier}
                      onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => setModifier(Math.min(99, modifier + 1))}
                      className="p-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 2D Dice Buttons */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {diceTypes.map((dice) => (
                    <Dice2D
                      key={dice}
                      sides={dice}
                      onClick={() => rollDice(dice, 1)}
                      disabled={isRolling}
                    />
                  ))}
                </div>

                {/* History Controls */}
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm text-gray-700"
                  >
                    <History className="w-4 h-4" />
                    {showHistory ? "Hide" : "Show"} History ({rollHistory.length})
                  </button>
                  {rollHistory.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors text-sm flex items-center gap-2"
                      title="Clear History"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear
                    </button>
                  )}
                </div>

                {/* Roll History */}
                <AnimatePresence>
                  {showHistory && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="max-h-64 overflow-y-auto"
                    >
                      <div className="space-y-2">
                        {rollHistory.length === 0 ? (
                          <p className="text-sm text-gray-500 text-center py-4">
                            No rolls yet
                          </p>
                        ) : (
                          rollHistory.map((roll) => (
                            <motion.div
                              key={roll.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600">
                                  {roll.displayText}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                  {roll.result.map((r, idx) => (
                                    <span key={idx} className="text-gray-900">[{r}]</span>
                                  ))}
                                </div>
                                <span className="text-gray-900 ml-2">
                                  = {roll.total}
                                </span>
                                {roll.result.every(r => r === roll.dice) && (
                                  <span className="text-green-600 text-xs">⭐</span>
                                )}
                                {roll.result.every(r => r === 1) && (
                                  <span className="text-red-600 text-xs">💀</span>
                                )}
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}