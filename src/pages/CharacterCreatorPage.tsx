import { Component, type ErrorInfo, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { CharacterCreator } from "../components/CharacterCreatorBeginner";
import { clearDraft, loadDraft } from "../lib/character-storage";

class CreatorRecoveryBoundary extends Component<
    { children: ReactNode },
    { failed: boolean }
> {
    state = { failed: false };

    static getDerivedStateFromError() {
        return { failed: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error("Character creator could not render", error, info);
    }

    render() {
        if (!this.state.failed) return this.props.children;
        return (
            <div className="min-h-[70vh] bg-zinc-950 px-6 py-20 text-center text-gray-200">
                <div className="mx-auto max-w-xl rounded-xl border border-red-900/50 bg-zinc-900 p-8">
                    <h1 className="text-2xl font-bold">This saved step could not be opened</h1>
                    <p className="mt-3 text-gray-400">
                        Your draft is still saved. Review it from the beginning, or explicitly start over.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => window.location.assign("/creator/ruleset")}
                            className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700"
                        >
                            Review saved character
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                if (!window.confirm("Discard this character and start over?")) return;
                                clearDraft();
                                window.location.assign("/creator/ruleset");
                            }}
                            className="rounded-lg border border-white/20 px-4 py-2 font-semibold text-gray-300 hover:bg-white/10"
                        >
                            Start over
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export function CharacterCreatorPage() {
    return (
        <CreatorRecoveryBoundary>
            <CharacterCreator />
        </CreatorRecoveryBoundary>
    );
}

/**
 * /creator itself holds no step. It hands off to the step a saved draft was
 * left on — so "Create Character" and the sheet's Edit button both resume
 * rather than restart — and to the first step when there is nothing saved.
 * The creator re-checks the step it lands on and moves back if the draft no
 * longer supports it.
 */
export function CharacterCreatorEntry() {
    const draft = loadDraft();
    const step = draft?.character.ruleset ? draft.step : "ruleset";
    return <Navigate to={`/creator/${step}`} replace />;
}
