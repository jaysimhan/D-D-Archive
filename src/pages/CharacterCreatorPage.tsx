import { Navigate } from "react-router-dom";
import { CharacterCreator } from "../components/CharacterCreatorBeginner";
import { loadDraft } from "../lib/character-storage";

export function CharacterCreatorPage() {
    return (
        <div>
            <CharacterCreator />
        </div>
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
    const step = loadDraft()?.step ?? "race";
    return <Navigate to={`/creator/${step}`} replace />;
}
