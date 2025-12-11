import { useState } from "react";
import type { Race, Class, Spell, Item, Feat, Background } from "../types/dnd-types";
import { RACES, BACKGROUNDS, FEATS } from "../data/comprehensive-library";
import { combinedClasses as CLASSES } from "../data/mock-classes";
import { mockSubclasses as SUBCLASSES } from "../data/mock-subclasses";
import { allSpells as SPELLS } from "../data/all-spells";
import { expandedItems as ITEMS } from "../data/expanded-items";
import { Library } from "../components/Library";

export function LibraryPage() {
    // Content management state - initializing with imported data
    // In a real app this might come from an API, but here we mirror App.tsx behavior
    const [races] = useState<Race[]>(RACES);
    const [classes] = useState<Class[]>(CLASSES);
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
