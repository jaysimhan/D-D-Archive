/** The parts of @3d-dice/dice-box-threejs the tray uses; it ships no types. */
declare module "@3d-dice/dice-box-threejs" {
    interface ColorSet {
        name: string;
        foreground: string;
        background: string;
        outline?: string;
        texture?: string;
        material?: "none" | "metal" | "wood" | "glass" | "plastic";
    }

    export default class DiceBox {
        constructor(selector: string, options?: {
            assetPath?: string;
            sounds?: boolean;
            shadows?: boolean;
            color_spotlight?: number;
            theme_customColorset?: ColorSet | null;
            theme_material?: ColorSet["material"];
            gravity_multiplier?: number;
            light_intensity?: number;
            baseScale?: number;
            strength?: number;
        });
        initialize(): Promise<void>;
        /** "1d20+2d6@19,4,3": the dice, then the face each one lands on, in order. */
        roll(notation: string): Promise<unknown>;
        clearDice(): void;
    }
}
