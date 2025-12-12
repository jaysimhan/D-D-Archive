import { useState } from "react";
import type { Race, Class, Spell, Item, Feat, Background } from "../types/dnd-types";
import {
    RACES,
    BACKGROUNDS,
    FEATS,
    CLASSES,
    SUBCLASSES,
    SPELLS,
    ITEMS
} from "../data/comprehensive-library";
import { Library } from "../components/Library";

export function LibraryPage() {
    // Content management state - initializing with imported data
    // In a real app this might come from an API, but here we mirror App.tsx behavior
    const [races] = useState<Race[]>(RACES);
    const [classes] = useState<Class[]>(CLASSES.filter(c => !((c as any).parentClassId)));
    const [subclasses] = useState(SUBCLASSES);
    const [spells] = useState<Spell[]>(SPELLS);
    const [items] = useState<Item[]>(ITEMS);
    const [feats] = useState<Feat[]>(FEATS);
    const [backgrounds] = useState<Background[]>(BACKGROUNDS);

    return (
        <Library
            spells={spells}
            classes={classes}
            subclasses={subclasses}
            races={races}
            items={items}
            backgrounds={backgrounds}
            feats={feats}
        />
    );
}
