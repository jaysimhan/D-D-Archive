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

    let effectiveCount = count;
    let effectiveTitle = `${count}d${sides}`;

    // Handle Advantage/Disadvantage
    // Normally applies to 1d20, but the logic requested is "roll 2 number of same dice"
    // So if rollMode is active, we force rolling 2 dice for the calculation logic.
    if (rollMode === 'advantage') {
      effectiveCount = 2;
      effectiveTitle = `Advantage (2d${sides})`;
    } else if (rollMode === 'disadvantage') {
      effectiveCount = 2;
      effectiveTitle = `Disadvantage (2d${sides})`;
    }

    let counter = 0;
    const interval = setInterval(() => {
      // Animation shuffle (just visual random numbers)
      const tempResults = Array.from({ length: effectiveCount }, () => Math.floor(Math.random() * sides) + 1);

      let tempTotal = 0;
      if (rollMode === 'normal') {
        tempTotal = tempResults.reduce((a, b) => a + b, 0);
      } else if (rollMode === 'advantage') {
        tempTotal = Math.max(...tempResults);
      } else if (rollMode === 'disadvantage') {
        tempTotal = Math.min(...tempResults);
      }

      setCurrentRoll({
        id: `temp-${Date.now()}`,
        dice: sides,
        count: effectiveCount,
        result: tempResults,
        modifier,
        total: tempTotal + modifier,
        timestamp: new Date(),
        displayText: `${effectiveTitle}${modifier !== 0 ? ` ${modifier > 0 ? '+' : ''}${modifier}` : ''}`,
        mode: rollMode,
      });
      counter++;

      if (counter >= 10) {
        clearInterval(interval);
        // Final Roll
        const finalResults = Array.from({ length: effectiveCount }, () => Math.floor(Math.random() * sides) + 1);

        let sum = 0;
        let droppedIndex = -1;

        if (rollMode === 'normal') {
          sum = finalResults.reduce((a, b) => a + b, 0);
        } else if (rollMode === 'advantage') {
          sum = Math.max(...finalResults);
          // Just for display logic if we wanted to show dropped, but simple max is fine
        } else if (rollMode === 'disadvantage') {
          sum = Math.min(...finalResults);
        }

        const finalRoll: Roll = {
          id: `roll-${Date.now()}`,
          dice: sides,
          count: effectiveCount,
          result: finalResults,
          modifier,
          total: sum + modifier,
          timestamp: new Date(),
          displayText: `${effectiveTitle}${modifier !== 0 ? ` ${modifier > 0 ? '+' : ''}${modifier}` : ''}`,
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
    const kept = sorted.slice(statDrop);
    const total = kept.reduce((a, b) => a + b, 0);

    const finalRoll: Roll = {
      id: `stat-${Date.now()}`,
      dice: statSides as DiceType,
      count: statCount,
      result: results,
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
          <svg width="45" height="44" viewBox="0 0 45 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M22.6665 0.718355L22.0769 0L21.4872 0.718355L0.507257 26.2758L0 26.8936L0.640918 27.3715L21.6209 43.0111L22.0769 43.351L22.5329 43.0111L43.5128 27.3715L44.1538 26.8936L43.6465 26.2758L22.6665 0.718355ZM21.314 40.8792L2.19382 26.6259L21.314 3.33414V40.8792ZM22.8398 40.8792L41.9599 26.6259L22.8398 3.33414V40.8792Z" fill="white" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M22.6665 0.718355L22.0769 0L21.4872 0.718355L0.507257 26.2758L0 26.8936L0.640918 27.3715L21.6209 43.0111L22.0769 43.351L22.5329 43.0111L43.5128 27.3715L44.1538 26.8936L43.6465 26.2758L22.6665 0.718355ZM21.314 40.8792L2.19382 26.6259L21.314 3.33414V40.8792ZM22.8398 40.8792L41.9599 26.6259L22.8398 3.33414V40.8792Z" fill="url(#paint0_linear_133_6338)" />
            <defs>
              <linearGradient id="paint0_linear_133_6338" x1="0" y1="0" x2="43.3437" y2="44.1463" gradientUnits="userSpaceOnUse">
                <stop stop-color="#155DFC" />
                <stop offset="1" stop-color="#007595" />
              </linearGradient>
            </defs>
          </svg>

        );
      case 6:
        return (
          <svg width="39" height="45" viewBox="0 0 39 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M2.17658 11.6307L19.2999 1.74462L36.4231 11.6307L19.2999 21.4154L2.17658 11.6307ZM1.51088 12.9905V32.556L18.5444 42.3902V22.7239L1.51088 12.9905ZM20.0553 42.3902L37.0888 32.556V12.9905L20.0553 22.7239V42.3902ZM19.2999 0L38.5996 11.1428V33.4283L19.2999 44.571L0 33.4283V11.1428L19.2999 0Z" fill="white" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M2.17658 11.6307L19.2999 1.74462L36.4231 11.6307L19.2999 21.4154L2.17658 11.6307ZM1.51088 12.9905V32.556L18.5444 42.3902V22.7239L1.51088 12.9905ZM20.0553 42.3902L37.0888 32.556V12.9905L20.0553 22.7239V42.3902ZM19.2999 0L38.5996 11.1428V33.4283L19.2999 44.571L0 33.4283V11.1428L19.2999 0Z" fill="url(#paint0_linear_133_6343)" />
            <defs>
              <linearGradient id="paint0_linear_133_6343" x1="0" y1="0" x2="44.1139" y2="38.2037" gradientUnits="userSpaceOnUse">
                <stop stop-color="#00A63E" />
                <stop offset="1" stop-color="#007A55" />
              </linearGradient>
            </defs>
          </svg>

        );
      case 8:
        return (
          <svg width="45" height="44" viewBox="0 0 45 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M23.4373 0.545281L22.8867 0L22.326 0.534998L0.604432 21.262L0 21.8388L0.604432 22.4155L22.326 43.1426L22.8867 43.6776L23.4373 43.1323L44.3656 22.4052L44.9375 21.8388L44.3656 21.2723L23.4373 0.545281ZM2.33745 21.8654L2.30955 21.8388L2.38656 21.7652L2.33745 21.8654ZM4.17953 23.6232L22.0674 40.692L22.2729 32.4924L4.17953 23.6232ZM22.2726 30.7167L22.1283 2.92746L2.93814 21.239L22.2726 30.7167ZM23.663 40.6649L40.1771 24.3094L23.8725 32.3018L23.663 40.6649ZM23.8661 30.5294L42.3152 21.4857L23.7235 3.07271L23.8661 30.5294Z" fill="url(#paint0_linear_133_6348)" />
            <defs>
              <linearGradient id="paint0_linear_133_6348" x1="0" y1="0" x2="43.6599" y2="44.9194" gradientUnits="userSpaceOnUse">
                <stop stop-color="#D08700" />
                <stop offset="1" stop-color="#F54900" />
              </linearGradient>
            </defs>
          </svg>

        );
      case 10:
        return (
          <svg width="44" height="45" viewBox="0 0 44 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M21.6053 0L22.1942 0.640333L43.0859 23.3605L43.6348 23.9573L43.0363 24.5035L22.1446 43.5721L21.6058 44.0639L21.0717 43.5669L0.58173 24.4983L0 23.9569L0.532709 23.3662L21.0226 0.64604L21.6053 0ZM3.34849 22.6309L18.6988 5.60982L10.1271 19.8306L3.34849 22.6309ZM21.0161 41.3294L2.96157 24.5274L10.6378 21.3561L21.0161 26.5964V41.3294ZM22.6077 40.983L40.6446 24.52L32.9861 21.3561L22.6077 26.5964V40.983ZM21.8119 25.2012L11.8001 20.1461L21.8119 3.53638L31.8236 20.1461L21.8119 25.2012ZM25.559 6.66169L33.4967 19.8306L40.2234 22.6095L25.559 6.66169Z" fill="url(#paint0_linear_133_6353)" />
            <defs>
              <linearGradient id="paint0_linear_133_6353" x1="0" y1="0" x2="44.0618" y2="43.6327" gradientUnits="userSpaceOnUse">
                <stop stop-color="#F54900" />
                <stop offset="1" stop-color="#E7000B" />
              </linearGradient>
            </defs>
          </svg>

        );
      case 12:
        return (
          <svg width="44" height="42" viewBox="0 0 44 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M28.1433 0H28.1274H27.8979H15.4992H15.2696H15.2538V0.00970735L15.0738 0.11967L7.73206 4.60628L7.55578 4.71404L7.45201 4.89277L0.110289 17.5368L0 17.7268V17.9464V25.2882V25.5207L0.122688 25.7184L7.46441 37.5467L7.58612 37.7428L7.79267 37.8461L14.3186 41.1091L14.4908 41.1952H14.6834H15.2538H28.1433H28.7136H28.9062L29.0784 41.1091L35.6044 37.8461L35.811 37.7428L35.9328 37.5467L43.2745 25.7184L43.3971 25.5207V25.2882V17.9464V17.7268L43.2868 17.5368L35.9451 4.89277L35.8413 4.71404L35.665 4.60628L28.3233 0.11967L28.1433 0.00970735V0ZM27.6684 1.63149H15.7287L10.4896 4.83322L21.6173 6.91966L32.8694 4.80989L27.6684 1.63149ZM22.433 20.3367V8.42658L34.7675 6.11386L41.3513 17.4525L32.5009 26.3029L22.433 20.3367ZM33.6059 27.5051L41.7656 19.3454V25.0556L34.6683 36.4902L30.3552 38.6467L33.8164 27.5709L33.6059 27.5051ZM32.0029 27.9042L21.6173 21.7498L11.5759 27.7002L15.2832 39.5637H28.1433H28.3593L32.0029 27.9042ZM20.8015 8.42658V20.3367L10.7337 26.3029L1.98618 17.5553L8.61356 6.14135L20.8015 8.42658ZM13.3327 38.7921L9.88596 27.7624L1.63149 19.5079V25.0556L8.72882 36.4902L13.3327 38.7921Z" fill="black" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M28.1433 0H28.1274H27.8979H15.4992H15.2696H15.2538V0.00970735L15.0738 0.11967L7.73206 4.60628L7.55578 4.71404L7.45201 4.89277L0.110289 17.5368L0 17.7268V17.9464V25.2882V25.5207L0.122688 25.7184L7.46441 37.5467L7.58612 37.7428L7.79267 37.8461L14.3186 41.1091L14.4908 41.1952H14.6834H15.2538H28.1433H28.7136H28.9062L29.0784 41.1091L35.6044 37.8461L35.811 37.7428L35.9328 37.5467L43.2745 25.7184L43.3971 25.5207V25.2882V17.9464V17.7268L43.2868 17.5368L35.9451 4.89277L35.8413 4.71404L35.665 4.60628L28.3233 0.11967L28.1433 0.00970735V0ZM27.6684 1.63149H15.7287L10.4896 4.83322L21.6173 6.91966L32.8694 4.80989L27.6684 1.63149ZM22.433 20.3367V8.42658L34.7675 6.11386L41.3513 17.4525L32.5009 26.3029L22.433 20.3367ZM33.6059 27.5051L41.7656 19.3454V25.0556L34.6683 36.4902L30.3552 38.6467L33.8164 27.5709L33.6059 27.5051ZM32.0029 27.9042L21.6173 21.7498L11.5759 27.7002L15.2832 39.5637H28.1433H28.3593L32.0029 27.9042ZM20.8015 8.42658V20.3367L10.7337 26.3029L1.98618 17.5553L8.61356 6.14135L20.8015 8.42658ZM13.3327 38.7921L9.88596 27.7624L1.63149 19.5079V25.0556L8.72882 36.4902L13.3327 38.7921Z" fill="url(#paint0_linear_133_6358)" />
            <defs>
              <linearGradient id="paint0_linear_133_6358" x1="0" y1="0" x2="41.1394" y2="43.3383" gradientUnits="userSpaceOnUse">
                <stop stop-color="#E7000B" />
                <stop offset="1" stop-color="#E60076" />
              </linearGradient>
            </defs>
          </svg>

        );
      case 20:
        return (
          <svg width="40" height="45" viewBox="0 0 40 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.0465109 11.1158C1.24628e-06 11.1623 1.95168e-06 11.2088 1.95168e-06 11.2088L1.93948e-06 11.3483C1.93948e-06 11.3483 1.93542e-06 11.3949 1.93135e-06 11.4414L1.92729e-06 11.4879C1.92322e-06 11.5344 1.91915e-06 11.5809 1.91915e-06 11.5809L2.84634e-08 33.2079C2.84634e-08 33.2079 2.84637e-08 33.2079 2.43977e-08 33.2544L1.62662e-08 33.3474C1.62662e-08 33.3474 1.62648e-08 33.3474 1.21988e-08 33.3939C1.21988e-08 33.3939 1.21991e-08 33.3939 8.13308e-09 33.4404L0 33.5334C-4.06444e-09 33.5799 0.0465089 33.5799 0.0465089 33.6265C0.0465089 33.6265 0.0465089 33.6265 0.0465089 33.673C0.0465089 33.7195 0.0930178 33.7195 0.0930178 33.7195C0.0930178 33.7195 0.0930178 33.7195 0.0930178 33.766L0.13953 33.8125C0.13953 33.8125 0.186038 33.859 0.232548 33.859C0.232548 33.859 0.232547 33.859 0.279057 33.859L19.1155 44.7888C19.3945 44.9283 19.7201 44.9283 19.9526 44.7888L38.696 33.952C38.7425 33.952 38.7425 33.9055 38.789 33.9055C38.789 33.9055 38.789 33.9055 38.8355 33.9055L38.882 33.859C38.882 33.859 38.882 33.859 38.9285 33.8125L38.9751 33.766C38.9751 33.766 38.9751 33.7195 39.0216 33.7195C39.0216 33.7195 39.0216 33.7195 39.0681 33.673V33.6265C39.0681 33.6265 39.0681 33.5799 39.1146 33.5799V33.3009C39.1146 33.3009 39.1146 33.3009 39.1146 33.2544L39.1146 11.6274C39.1146 11.5809 39.1146 11.5344 39.1146 11.4879V11.4414C39.1146 11.3949 39.0681 11.3483 39.0681 11.3018C39.0681 11.2553 39.0216 11.2088 38.9751 11.1623C38.9751 11.1623 38.9751 11.1623 38.9751 11.1158C38.9751 11.0228 38.9286 10.9763 38.882 10.9763C38.8355 10.9298 38.8355 10.9298 38.789 10.8833C38.789 10.8833 38.789 10.8833 38.7425 10.8833C38.7425 10.8833 38.7425 10.8833 38.696 10.8833L19.9526 0.046509C19.9526 0.046509 19.9061 0.0465097 19.9061 6.09895e-08L19.7201 4.47249e-08C19.7201 4.47249e-08 19.7201 4.47252e-08 19.6736 4.06592e-08C19.6271 3.65932e-08 19.6271 3.65936e-08 19.5806 3.25276e-08C19.534 2.84616e-08 19.534 2.84621e-08 19.4875 2.43961e-08C19.4875 2.43961e-08 19.4875 2.43948e-08 19.441 2.03288e-08C19.3945 1.62628e-08 19.3945 1.62633e-08 19.348 1.21973e-08L19.2085 0C19.2085 0 19.162 -7.14447e-07 19.162 0.0465089L0.418589 10.8832C0.418589 10.8832 0.41859 10.8832 0.37208 10.8832C0.37208 10.8832 0.372077 10.8832 0.325568 10.8832C0.325568 10.8832 0.279059 10.8832 0.279059 10.9298L0.23255 10.9763C0.23255 10.9763 0.186041 10.9763 0.186041 11.0228L0.139532 11.0693C0.139532 11.0693 0.139529 11.1158 0.0930198 11.1158C0.0930198 11.0693 0.0930205 11.1158 0.0465109 11.1158ZM37.2542 28.3709L32.0451 15.4412C31.9986 15.3017 32.0451 15.1156 32.2312 15.0226L37.0217 13.0227C37.2077 12.9297 37.4402 13.0692 37.4402 13.3018L37.4402 28.3244C37.4402 28.4174 37.3007 28.4639 37.2542 28.3709ZM10.2786 15.5342L28.7895 15.5342C29.022 15.5342 29.1615 15.8133 29.0685 15.9993L19.8131 32.0451C19.6736 32.2312 19.3945 32.2312 19.3015 32.0451L10.0461 15.9993C9.90655 15.7668 10.0461 15.5342 10.2786 15.5342ZM30.8824 17.2086L36.8821 32.0451C36.9751 32.2312 36.8356 32.4637 36.6031 32.4637L21.627 33.2079C21.3944 33.2079 21.2084 32.9753 21.3479 32.7428L30.3708 17.162C30.4638 16.9295 30.7894 16.9295 30.8824 17.2086ZM10.4647 13.3017L19.3015 2.4185C19.441 2.27897 19.6736 2.27897 19.7666 2.4185L28.6034 13.3018C28.7429 13.4878 28.6034 13.8134 28.3709 13.8134L10.6972 13.8134C10.4647 13.8134 10.3251 13.4878 10.4647 13.3017ZM8.6973 17.162L17.7202 32.7428C17.8597 32.9753 17.6737 33.2079 17.4411 33.2079L2.46501 32.4637C2.23246 32.4637 2.13944 32.2312 2.18595 32.0451L8.18569 17.2086C8.27871 16.9295 8.60428 16.9295 8.6973 17.162ZM18.6969 35.2543L18.6969 42.0447C18.6969 42.2772 18.4178 42.4168 18.2318 42.3238L4.65096 34.4636C4.55794 34.4171 4.60445 34.2776 4.69747 34.2776L18.4178 34.9752C18.5573 34.9752 18.6969 35.1148 18.6969 35.2543ZM20.6968 34.9752L34.4171 34.2776C34.5101 34.2776 34.5566 34.4171 34.4636 34.4636L20.8363 42.2772C20.6503 42.4168 20.3712 42.2307 20.3712 41.9982V35.2543C20.3712 35.1148 20.5107 34.9752 20.6968 34.9752ZM30.9289 13.4413L23.4408 4.18587C23.3943 4.09285 23.4874 3.99983 23.5804 4.04634L35.8124 11.1158C36.045 11.2553 35.9984 11.5809 35.7659 11.6739L31.2545 13.5343C31.1614 13.5808 31.0219 13.5343 30.9289 13.4413ZM7.81362 13.5343L3.30218 11.6739C3.06964 11.5809 3.02313 11.2553 3.25568 11.1158L15.5342 4.04633C15.6272 3.99983 15.7203 4.09285 15.6737 4.18586L8.18569 13.4413C8.04616 13.5343 7.90664 13.5808 7.81362 13.5343ZM2.04643 13.0227L6.83691 15.0226C6.97644 15.0691 7.06946 15.2552 7.02295 15.4412L1.81388 28.3709C1.76737 28.4639 1.62784 28.4174 1.62784 28.3244L1.62784 13.3017C1.62784 13.0692 1.86039 12.9297 2.04643 13.0227Z" fill="white" />
            <path d="M0.0465109 11.1158C1.24628e-06 11.1623 1.95168e-06 11.2088 1.95168e-06 11.2088L1.93948e-06 11.3483C1.93948e-06 11.3483 1.93542e-06 11.3949 1.93135e-06 11.4414L1.92729e-06 11.4879C1.92322e-06 11.5344 1.91915e-06 11.5809 1.91915e-06 11.5809L2.84634e-08 33.2079C2.84634e-08 33.2079 2.84637e-08 33.2079 2.43977e-08 33.2544L1.62662e-08 33.3474C1.62662e-08 33.3474 1.62648e-08 33.3474 1.21988e-08 33.3939C1.21988e-08 33.3939 1.21991e-08 33.3939 8.13308e-09 33.4404L0 33.5334C-4.06444e-09 33.5799 0.0465089 33.5799 0.0465089 33.6265C0.0465089 33.6265 0.0465089 33.6265 0.0465089 33.673C0.0465089 33.7195 0.0930178 33.7195 0.0930178 33.7195C0.0930178 33.7195 0.0930178 33.7195 0.0930178 33.766L0.13953 33.8125C0.13953 33.8125 0.186038 33.859 0.232548 33.859C0.232548 33.859 0.232547 33.859 0.279057 33.859L19.1155 44.7888C19.3945 44.9283 19.7201 44.9283 19.9526 44.7888L38.696 33.952C38.7425 33.952 38.7425 33.9055 38.789 33.9055C38.789 33.9055 38.789 33.9055 38.8355 33.9055L38.882 33.859C38.882 33.859 38.882 33.859 38.9285 33.8125L38.9751 33.766C38.9751 33.766 38.9751 33.7195 39.0216 33.7195C39.0216 33.7195 39.0216 33.7195 39.0681 33.673V33.6265C39.0681 33.6265 39.0681 33.5799 39.1146 33.5799V33.3009C39.1146 33.3009 39.1146 33.3009 39.1146 33.2544L39.1146 11.6274C39.1146 11.5809 39.1146 11.5344 39.1146 11.4879V11.4414C39.1146 11.3949 39.0681 11.3483 39.0681 11.3018C39.0681 11.2553 39.0216 11.2088 38.9751 11.1623C38.9751 11.1623 38.9751 11.1623 38.9751 11.1158C38.9751 11.0228 38.9286 10.9763 38.882 10.9763C38.8355 10.9298 38.8355 10.9298 38.789 10.8833C38.789 10.8833 38.789 10.8833 38.7425 10.8833C38.7425 10.8833 38.7425 10.8833 38.696 10.8833L19.9526 0.046509C19.9526 0.046509 19.9061 0.0465097 19.9061 6.09895e-08L19.7201 4.47249e-08C19.7201 4.47249e-08 19.7201 4.47252e-08 19.6736 4.06592e-08C19.6271 3.65932e-08 19.6271 3.65936e-08 19.5806 3.25276e-08C19.534 2.84616e-08 19.534 2.84621e-08 19.4875 2.43961e-08C19.4875 2.43961e-08 19.4875 2.43948e-08 19.441 2.03288e-08C19.3945 1.62628e-08 19.3945 1.62633e-08 19.348 1.21973e-08L19.2085 0C19.2085 0 19.162 -7.14447e-07 19.162 0.0465089L0.418589 10.8832C0.418589 10.8832 0.41859 10.8832 0.37208 10.8832C0.37208 10.8832 0.372077 10.8832 0.325568 10.8832C0.325568 10.8832 0.279059 10.8832 0.279059 10.9298L0.23255 10.9763C0.23255 10.9763 0.186041 10.9763 0.186041 11.0228L0.139532 11.0693C0.139532 11.0693 0.139529 11.1158 0.0930198 11.1158C0.0930198 11.0693 0.0930205 11.1158 0.0465109 11.1158ZM37.2542 28.3709L32.0451 15.4412C31.9986 15.3017 32.0451 15.1156 32.2312 15.0226L37.0217 13.0227C37.2077 12.9297 37.4402 13.0692 37.4402 13.3018L37.4402 28.3244C37.4402 28.4174 37.3007 28.4639 37.2542 28.3709ZM10.2786 15.5342L28.7895 15.5342C29.022 15.5342 29.1615 15.8133 29.0685 15.9993L19.8131 32.0451C19.6736 32.2312 19.3945 32.2312 19.3015 32.0451L10.0461 15.9993C9.90655 15.7668 10.0461 15.5342 10.2786 15.5342ZM30.8824 17.2086L36.8821 32.0451C36.9751 32.2312 36.8356 32.4637 36.6031 32.4637L21.627 33.2079C21.3944 33.2079 21.2084 32.9753 21.3479 32.7428L30.3708 17.162C30.4638 16.9295 30.7894 16.9295 30.8824 17.2086ZM10.4647 13.3017L19.3015 2.4185C19.441 2.27897 19.6736 2.27897 19.7666 2.4185L28.6034 13.3018C28.7429 13.4878 28.6034 13.8134 28.3709 13.8134L10.6972 13.8134C10.4647 13.8134 10.3251 13.4878 10.4647 13.3017ZM8.6973 17.162L17.7202 32.7428C17.8597 32.9753 17.6737 33.2079 17.4411 33.2079L2.46501 32.4637C2.23246 32.4637 2.13944 32.2312 2.18595 32.0451L8.18569 17.2086C8.27871 16.9295 8.60428 16.9295 8.6973 17.162ZM18.6969 35.2543L18.6969 42.0447C18.6969 42.2772 18.4178 42.4168 18.2318 42.3238L4.65096 34.4636C4.55794 34.4171 4.60445 34.2776 4.69747 34.2776L18.4178 34.9752C18.5573 34.9752 18.6969 35.1148 18.6969 35.2543ZM20.6968 34.9752L34.4171 34.2776C34.5101 34.2776 34.5566 34.4171 34.4636 34.4636L20.8363 42.2772C20.6503 42.4168 20.3712 42.2307 20.3712 41.9982V35.2543C20.3712 35.1148 20.5107 34.9752 20.6968 34.9752ZM30.9289 13.4413L23.4408 4.18587C23.3943 4.09285 23.4874 3.99983 23.5804 4.04634L35.8124 11.1158C36.045 11.2553 35.9984 11.5809 35.7659 11.6739L31.2545 13.5343C31.1614 13.5808 31.0219 13.5343 30.9289 13.4413ZM7.81362 13.5343L3.30218 11.6739C3.06964 11.5809 3.02313 11.2553 3.25568 11.1158L15.5342 4.04633C15.6272 3.99983 15.7203 4.09285 15.6737 4.18586L8.18569 13.4413C8.04616 13.5343 7.90664 13.5808 7.81362 13.5343ZM2.04643 13.0227L6.83691 15.0226C6.97644 15.0691 7.06946 15.2552 7.02295 15.4412L1.81388 28.3709C1.76737 28.4639 1.62784 28.4174 1.62784 28.3244L1.62784 13.3017C1.62784 13.0692 1.86039 12.9297 2.04643 13.0227Z" fill="url(#paint0_linear_133_6363)" />
            <defs>
              <linearGradient id="paint0_linear_133_6363" x1="39.1146" y1="44.8937" x2="-5.3559" y2="6.14754" gradientUnits="userSpaceOnUse">
                <stop stop-color="#9810FA" />
                <stop offset="1" stop-color="#4F39F6" />
              </linearGradient>
            </defs>
          </svg>

        );
      case 100:
        return (
          <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M22.4729 44.513L0 20.3115L22.4724 0L44.5131 20.312L22.4729 44.513ZM41.0972 21.6514L25.4379 38.846L34.1822 24.4803L41.0972 21.6514ZM23.074 2.76239L41.4919 19.7357L33.6612 22.9392L23.074 17.6456V2.76239ZM21.4503 3.11236L3.05033 19.7431L10.8631 22.9392L21.4503 17.6456L21.4503 3.11236ZM22.2622 19.055L32.4754 24.1616L22.2622 40.9406L12.0489 24.1616L22.2622 19.055ZM18.4396 37.7835L10.3421 24.4803L3.48003 21.6731L18.4396 37.7835Z" fill="url(#paint0_linear_133_6368)" />
            <defs>
              <linearGradient id="paint0_linear_133_6368" x1="44.5132" y1="44.5132" x2="0.000198341" y2="0.000120042" gradientUnits="userSpaceOnUse">
                <stop stop-color="#E60076" />
                <stop offset="1" stop-color="#9810FA" />
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
              <path d="M36.3066 72.6133V70.3441C17.5083 70.3441 2.26917 55.105 2.26917 36.3066H0H-2.26917C-2.26917 57.6115 15.0018 74.8824 36.3066 74.8824V72.6133ZM72.6133 36.3066H70.3441C70.3441 55.105 55.105 70.3441 36.3066 70.3441V72.6133V74.8824C57.6115 74.8824 74.8824 57.6115 74.8824 36.3066H72.6133ZM36.3066 0V2.26917C55.105 2.26917 70.3441 17.5083 70.3441 36.3066H72.6133H74.8824C74.8824 15.0018 57.6115 -2.26917 36.3066 -2.26917V0ZM36.3066 0V-2.26917C15.0018 -2.26917 -2.26917 15.0018 -2.26917 36.3066H0H2.26917C2.26917 17.5083 17.5083 2.26917 36.3066 2.26917V0Z" fill="#FF003C" fillOpacity="0.5" mask="url(#path-1-inside-1_125_2124)" />
              <path d="M54.0658 46.6204C54.1081 46.578 54.1081 46.5357 54.1081 46.5357V46.4934V46.451V46.4087C54.1081 46.4087 54.1081 46.3664 54.1081 46.324V46.2817C54.1081 46.2394 54.1081 46.197 54.1081 46.197V26.5115C54.1081 26.5115 54.1081 26.5115 54.1081 26.4692V26.4269V26.3845C54.1081 26.3845 54.1081 26.3845 54.1081 26.3422C54.1081 26.3422 54.1081 26.3422 54.1081 26.2998V26.2575V26.2152C54.1081 26.1728 54.0658 26.1728 54.0658 26.1305C54.0658 26.1305 54.0658 26.1305 54.0658 26.0882C54.0658 26.0458 54.0235 26.0458 54.0235 26.0458C54.0235 26.0458 54.0235 26.0458 54.0235 26.0035L53.9811 25.9612C53.9811 25.9612 53.9388 25.9188 53.8964 25.9188C53.8964 25.9188 53.8964 25.9188 53.8541 25.9188L36.7087 15.9703C36.4547 15.8432 36.1583 15.8432 35.9467 15.9703L18.8859 25.8342C18.8436 25.8342 18.8436 25.8765 18.8012 25.8765C18.8012 25.8765 18.8012 25.8765 18.7589 25.8765L18.7166 25.9188C18.7166 25.9188 18.7166 25.9188 18.6742 25.9612L18.6319 26.0035C18.6319 26.0035 18.6319 26.0458 18.5896 26.0458C18.5896 26.0458 18.5896 26.0458 18.5472 26.0882V26.1305C18.5472 26.1305 18.5472 26.1728 18.5049 26.1728V26.2152V26.2575V26.2998V26.3422V26.3845V26.4269C18.5049 26.4269 18.5049 26.4269 18.5049 26.4692V46.1547C18.5049 46.197 18.5049 46.2394 18.5049 46.2817V46.324C18.5049 46.3664 18.5472 46.4087 18.5472 46.451C18.5472 46.4934 18.5896 46.5357 18.6319 46.578C18.6319 46.578 18.6319 46.578 18.6319 46.6204C18.6319 46.705 18.6742 46.7474 18.7166 46.7474C18.7589 46.7897 18.7589 46.7897 18.8012 46.832C18.8012 46.832 18.8012 46.832 18.8436 46.832C18.8436 46.832 18.8436 46.832 18.8859 46.832L35.9467 56.696C35.9467 56.696 35.989 56.696 35.989 56.7383H36.0313H36.0737H36.116H36.1583C36.1583 56.7383 36.1583 56.7383 36.2007 56.7383C36.243 56.7383 36.243 56.7383 36.2853 56.7383C36.3277 56.7383 36.3277 56.7383 36.37 56.7383C36.37 56.7383 36.37 56.7383 36.4123 56.7383C36.4547 56.7383 36.4547 56.7383 36.497 56.7383H36.5393H36.5817H36.624C36.624 56.7383 36.6663 56.7383 36.6663 56.696L53.7271 46.832C53.7271 46.832 53.7271 46.832 53.7694 46.832C53.7694 46.832 53.7694 46.832 53.8118 46.832C53.8118 46.832 53.8541 46.832 53.8541 46.7897L53.8964 46.7474C53.8964 46.7474 53.9388 46.7474 53.9388 46.705L53.9811 46.6627C53.9811 46.6627 53.9811 46.6204 54.0235 46.6204ZM20.1983 30.9143L24.9397 42.6833C24.982 42.8103 24.9397 42.9796 24.7704 43.0643L20.4099 44.8847C20.2406 44.9693 20.0289 44.8423 20.0289 44.6306V30.9566C20.0289 30.872 20.1559 30.8296 20.1983 30.9143ZM44.7522 42.5986H27.9031C27.6914 42.5986 27.5644 42.3446 27.6491 42.1752L36.0737 27.5699C36.2007 27.4005 36.4547 27.4005 36.5393 27.5699L44.9639 42.1752C45.0909 42.3869 44.9639 42.5986 44.7522 42.5986ZM25.9981 41.0746L20.5369 27.5699C20.4523 27.4005 20.5793 27.1889 20.7909 27.1889L34.4226 26.5115C34.6343 26.5115 34.8036 26.7232 34.6766 26.9349L26.4638 41.1169C26.3791 41.3286 26.0827 41.3286 25.9981 41.0746ZM44.5829 44.6306L36.5393 54.5369C36.4123 54.6639 36.2007 54.6639 36.116 54.5369L28.0725 44.6306C27.9455 44.4613 28.0725 44.165 28.2841 44.165H44.3712C44.5829 44.165 44.7099 44.4613 44.5829 44.6306ZM46.1916 41.1169L37.9787 26.9349C37.8517 26.7232 38.021 26.5115 38.2327 26.5115L51.8644 27.1889C52.0761 27.1889 52.1607 27.4005 52.1184 27.5699L46.6573 41.0746C46.5726 41.3286 46.2763 41.3286 46.1916 41.1169ZM37.0897 24.6488V18.468C37.0897 18.2563 37.3437 18.1293 37.513 18.214L49.8747 25.3685C49.9593 25.4108 49.917 25.5378 49.8323 25.5378L37.3437 24.9028C37.2167 24.9028 37.0897 24.7758 37.0897 24.6488ZM35.2693 24.9028L22.7807 25.5378C22.696 25.5378 22.6537 25.4108 22.7383 25.3685L35.1423 18.2563C35.3116 18.1293 35.5656 18.2986 35.5656 18.5103V24.6488C35.5656 24.7758 35.4386 24.9028 35.2693 24.9028ZM25.9557 44.5036L32.7716 52.9282C32.8139 53.0129 32.7292 53.0975 32.6446 53.0552L21.5106 46.6204C21.299 46.4934 21.3413 46.197 21.553 46.1124L25.6594 44.419C25.7441 44.3766 25.8711 44.419 25.9557 44.5036ZM46.9959 44.419L51.1024 46.1124C51.314 46.197 51.3564 46.4934 51.1447 46.6204L39.9684 53.0552C39.8838 53.0975 39.7991 53.0129 39.8414 52.9282L46.6573 44.5036C46.7843 44.419 46.9113 44.3766 46.9959 44.419ZM52.2454 44.8847L47.885 43.0643C47.758 43.0219 47.6733 42.8526 47.7156 42.6833L52.4571 30.9143C52.4994 30.8296 52.6264 30.872 52.6264 30.9566V44.6306C52.6264 44.8423 52.4147 44.9693 52.2454 44.8847Z" fill="white" />
              <defs>
                <linearGradient id="paint0_linear_125_2124" x1="0" y1="0" x2="72.6133" y2="72.6133" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF003C" />
                  <stop offset="1" stopColor="#990024" />
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
            <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-white text-[15px] font-normal">Dice Roller</span>
              </div>
              <div className="flex items-center gap-2">

                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded transition-all">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {/* Result Display - MOVED TO TOP */}
              <div className="min-h-[0px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {currentRoll && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="w-full mb-3"
                    >
                      {/* Inner container filters fade-in to happen AFTER expand */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className={`rounded-lg p-4 text-center border w-full flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500
                          ${(currentRoll.result.length === 1 && currentRoll.result[0] === currentRoll.dice)
                            ? "bg-green-50 border-green-200"
                            : (currentRoll.result.length === 1 && currentRoll.result[0] === 1)
                              ? "bg-red-50 border-red-200"
                              : "bg-gray-100 border-gray-200"
                          }
                        `}
                      >
                        <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1 z-10 relative">
                          {(currentRoll.result.length === 1 && currentRoll.result[0] === currentRoll.dice)
                            ? "CRITICAL SUCCESS!"
                            : (currentRoll.result.length === 1 && currentRoll.result[0] === 1)
                              ? "CRITICAL FAILURE!"
                              : "RESULT"
                          }
                        </div>
                        <motion.div
                          animate={(currentRoll.result.length === 1 && currentRoll.result[0] === currentRoll.dice)
                            ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }
                            : (currentRoll.result.length === 1 && currentRoll.result[0] === 1)
                              ? { x: [0, -5, 5, -5, 5, 0] }
                              : {}
                          }
                          transition={{ duration: 0.5 }}
                          className={`text-4xl font-bold font-['Cinzel',serif] mb-1 z-10 relative
                            ${(currentRoll.result.length === 1 && currentRoll.result[0] === currentRoll.dice)
                              ? "text-green-600 drop-shadow-[0_2px_4px_rgba(22,163,74,0.3)]"
                              : (currentRoll.result.length === 1 && currentRoll.result[0] === 1)
                                ? "text-red-600 drop-shadow-[0_2px_4px_rgba(220,38,38,0.3)]"
                                : "text-gray-800"
                            }
                          `}
                        >
                          {currentRoll.total}
                        </motion.div>
                        <div className="text-xs text-brand-600 font-medium z-10 relative">
                          {currentRoll.displayText}
                        </div>
                        {currentRoll.result.length > 1 && (
                          <div className="text-xs text-gray-400 mt-1 z-10 relative">
                            [{currentRoll.result.join(", ")}]
                          </div>
                        )}

                        {/* Background Effects for Criticals */}
                        {(currentRoll.result.length === 1 && currentRoll.result[0] === currentRoll.dice) && (
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-200/50 via-transparent to-transparent opacity-50 pointer-events-none" />
                        )}
                        {(currentRoll.result.length === 1 && currentRoll.result[0] === 1) && (
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-200/50 via-transparent to-transparent opacity-50 pointer-events-none" />
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Modifier */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Modifier</label>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => setModifier(Math.max(-99, modifier - 1))}
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded transition-all text-gray-800"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9-]*"
                    value={modifier}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '-' || val === '') {
                        // Allow typing negative sign or clearing
                        // We need to cast carefully for state which expects number
                        // But since we can't store '-' in a number state, we might need a separate display state
                        // OR just stick to simple number input but fix the styling first as priority.
                        // For modifier, let's just fix styling and keep simple number behavior for now unless requested.
                        // Reverting to simple number logic but with text color fix.
                        setModifier(parseInt(val) || 0);
                      } else {
                        setModifier(parseInt(val) || 0);
                      }
                    }}
                    className="flex-1 px-3 py-1.5 bg-white border border-gray-300 rounded text-center text-lg text-gray-900"
                  />
                  <button
                    onClick={() => setModifier(Math.min(99, modifier + 1))}
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded transition-all text-gray-800"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Roll Mode */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Roll Mode</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setRollMode("normal")}
                    className={`flex-1 px-2 py-1.5 rounded text-xs transition-all ${rollMode === "normal"
                      ? "bg-brand-50 text-brand-700 border border-brand-500 font-medium"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => setRollMode("advantage")}
                    className={`flex-1 px-2 py-1.5 rounded text-xs transition-all ${rollMode === "advantage"
                      ? "bg-brand-50 text-brand-700 border border-brand-500 font-medium"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    Advantage
                  </button>
                  <button
                    onClick={() => setRollMode("disadvantage")}
                    className={`flex-1 px-2 py-1.5 rounded text-xs transition-all ${rollMode === "disadvantage"
                      ? "bg-brand-50 text-brand-700 border border-brand-500 font-medium"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    Disadvantage
                  </button>
                </div>
              </div>

              {/* Dice Buttons Grid */}
              <div className="grid grid-cols-4 gap-2">
                {[4, 6, 8, 10, 12, 20, 100].map((dice) => (
                  <button
                    key={dice}
                    onClick={() => rollDice(dice as DiceType, 1)}
                    disabled={isRolling}
                    className="aspect-square bg-black rounded-lg border border-white/20 shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                  >
                    {/* Glossy Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>

                    <div className="w-full h-full flex items-center justify-center p-1.5">
                      {getDiceSvg(dice as DiceType)}
                    </div>
                    <span className="absolute bottom-0.5 right-1 text-xs text-white/80 font-['Cinzel',serif] uppercase tracking-wider">
                      D{dice}
                    </span>
                  </button>
                ))}
              </div>

              {/* Custom Stat Roll */}
              <div className="bg-brand-50 border border-brand-200 rounded-lg p-3 space-y-2">
                <h3 className="text-xs font-semibold text-brand-800 uppercase tracking-wide">Custom Stat Roll (Drop Lowest)</h3>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Count</label>
                    <input
                      type="number"
                      value={statCount}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        // Default to 0 instead of 4 to allow clearing and typing smaller numbers
                        setStatCount(isNaN(val) ? 0 : val);
                      }}
                      className="w-full px-2 py-1 bg-white rounded text-sm border-0 text-gray-900"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Sides</label>
                    <select
                      value={`d${statSides}`}
                      onChange={(e) => setStatSides(parseInt(e.target.value.slice(1)))}
                      className="w-full px-2 py-1 bg-white rounded text-sm border-0 text-gray-900"
                    >
                      <option className="bg-white text-gray-900">d4</option>
                      <option className="bg-white text-gray-900">d6</option>
                      <option className="bg-white text-gray-900">d8</option>
                      <option className="bg-white text-gray-900">d10</option>
                      <option className="bg-white text-gray-900">d12</option>
                      <option className="bg-white text-gray-900">d20</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Drop</label>
                    <input
                      type="number"
                      value={statDrop}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setStatDrop(isNaN(val) ? 0 : val);
                      }}
                      className="w-full px-2 py-1 bg-white rounded text-sm border-0 text-gray-900"
                    />
                  </div>
                </div>
                <button
                  onClick={rollStatDice}
                  className="w-full bg-brand-100 border border-brand-300 text-brand-800 text-xs font-semibold py-2 rounded hover:bg-brand-200 transition-all"
                >
                  Roll Stats ({statCount}d{statSides} drop {statDrop})
                </button>
              </div>

              {/* Show History Button - AT BOTTOM */}
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full py-2 flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 text-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Show History ({rollHistory.length})
              </button>

              {/* History Section */}
              {showHistory && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="max-h-40 overflow-y-auto space-y-1.5 pt-2 border-t border-gray-100"
                >
                  {rollHistory.length > 0 && (
                    <button
                      onClick={() => {
                        setRollHistory([]);
                        setCurrentRoll(null);
                      }}
                      className="w-full text-xs text-red-500 hover:text-red-700 hover:bg-red-50 py-1 rounded transition-colors flex items-center justify-center gap-1 mb-2"
                    >
                      <Trash2 className="w-3 h-3" />
                      Clear History
                    </button>
                  )}
                  {rollHistory.length === 0 ? (
                    <p className="text-xs text-center text-gray-400 py-2">No rolls yet</p>
                  ) : (
                    rollHistory.map((roll) => (
                      <div key={roll.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs border border-gray-100">
                        <span className="text-gray-600 truncate max-w-[140px]">{roll.displayText}</span>
                        <span className="font-semibold text-gray-800">{roll.total}</span>
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