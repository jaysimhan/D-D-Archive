import { useRaces, useClasses, useSubclasses, useSpells, useItems, useFeats, useBackgrounds } from "../hooks/useSanityData";
import { Library } from "../components/Library";

export function LibraryPage() {
    const { data: races } = useRaces();
    const { data: classes } = useClasses();
    const { data: subclasses } = useSubclasses();
    const { data: spells } = useSpells();
    const { data: items } = useItems();
    const { data: feats } = useFeats();
    const { data: backgrounds } = useBackgrounds();

    // Filter classes to only main ones if needed, though hook likely returns all. 
    // The previous logic filtered classes without parentClassId. 
    // Sanity 'class' documents likely don't have parentClassId (only subclasses do).
    // So 'classes' should be fine.

    return (
        <Library
            spells={spells || []}
            classes={classes || []}
            subclasses={subclasses || []}
            races={races || []}
            items={items || []}
            backgrounds={backgrounds || []}
            feats={feats || []}
        />
    );
}
