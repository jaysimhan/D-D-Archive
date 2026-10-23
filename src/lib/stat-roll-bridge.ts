/**
 * The creator's "Rolled" ability scores are rolled in the floating dice
 * roller, which lives outside the creator's tree. The two talk over window
 * events: the creator asks for a stat array, and the roller answers with the
 * six totals once every one of its stat lines has been rolled.
 */

const REQUEST = "dnd-archive:stat-roll-request";
const RESULT = "dnd-archive:stat-roll-result";

export interface StatRollRequest {
    /** Roll straight away (a reroll), rather than only setting the lines up. */
    roll: boolean;
}

export function requestStatRoll(request: StatRollRequest): void {
    window.dispatchEvent(new CustomEvent<StatRollRequest>(REQUEST, { detail: request }));
}

export function onStatRollRequest(handler: (request: StatRollRequest) => void): () => void {
    const listener = (event: Event) => handler((event as CustomEvent<StatRollRequest>).detail);
    window.addEventListener(REQUEST, listener);
    return () => window.removeEventListener(REQUEST, listener);
}

export function announceStatRoll(totals: number[]): void {
    window.dispatchEvent(new CustomEvent<number[]>(RESULT, { detail: totals }));
}

export function onStatRollResult(handler: (totals: number[]) => void): () => void {
    const listener = (event: Event) => handler((event as CustomEvent<number[]>).detail);
    window.addEventListener(RESULT, listener);
    return () => window.removeEventListener(RESULT, listener);
}
