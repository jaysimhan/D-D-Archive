import { useState, useEffect } from 'react';
import { sanityClient } from '../lib/sanity';
import type { Class, Subclass, Race, Background, Spell, Feat, Item, HomepageData } from '../types/dnd-types';

// Helper hook for Sanity queries
function useSanityQuery<T>(query: string, params: Record<string, any> = {}) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            setLoading(true);
            try {
                const result = await sanityClient.fetch<T[]>(query, params);
                if (isMounted) {
                    setData(result);
                    setError(null);
                }
            } catch (err) {
                console.error("Sanity fetch error:", err);
                if (isMounted) {
                    setError(err instanceof Error ? err : new Error('Unknown Sanity error'));
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [query, JSON.stringify(params)]);

    return { data, loading, error, refetch: () => { /* Logic to trigger re-fetch could be added here */ } };
}

// ===== CLASSES =====
export function useClasses() {
    return useSanityQuery<Class>(`*[_type == "class"] {
        "id": slug.current,
        name,
        description,
        image {
            ...,
            asset->{ _id, url, metadata { lqip, dimensions } }
        },
        hitDie,
        primaryAbility,
        savingThrows,
        spellcaster,
        isSpellcaster,
        spellcastingAbility,
        features,
        traits[]->{name, description},
        source,
        edition
    } | order(name asc)`);
}

// ===== SUBCLASSES =====
export function useSubclasses() {
    return useSanityQuery<Subclass>(`*[_type == "subclass"] {
        "id": slug.current,
        name,
        description,
        image {
            ...,
            asset->{ _id, url, metadata { lqip, dimensions } }
        },
        parentClassId,
        features,
        traits[]->{name, description},
        magicType,
        magicAbility,
        magicDescription,
        isSpellcaster,
        spellcaster,
        spells[]{
            name,
            level,
            mode,
            count,
            spellList,
            specificSpells[]->{
                name,
                "id": slug.current,
                level,
                school,
                castingTime,
                range,
                duration,
                description,
                image {
                    ...,
                    asset->{ _id, url, metadata { lqip, dimensions } }
                }
            },
            ability,
            recharge,
            spellLevel,
            notes
        },
        source,
        edition
    } | order(name asc)`);
}

export function useSubclassesByClass(classId: string) {
    return useSanityQuery<Subclass>(
        `*[_type == "subclass" && parentClassId == $classId] {
            "id": slug.current,
            name,
            description,
            image {
                ...,
                asset->{ _id, url, metadata { lqip, dimensions } }
            },
            parentClassId,
            features,
            traits[]->{name, description},
            magicType,
            magicAbility,
            magicDescription,
            isSpellcaster,
            spellcaster,
            spells[]{
                name,
                level,
                mode,
                count,
                spellList,
                specificSpells[]->{
                    name,
                    "id": slug.current,
                    level,
                    school,
                    castingTime,
                    range,
                    duration,
                    description,
                    image {
                        ...,
                        asset->{ _id, url, metadata { lqip, dimensions } }
                    }
                },
                ability,
                recharge,
                spellLevel,
                notes
            },
            source,
            edition
        } | order(name asc)`,
        { classId }
    );
}

// ===== RACES =====
export function useRaces() {
    return useSanityQuery<Race>(`*[_type == "race"] {
        "id": slug.current,
        name,
        description,
        image {
            ...,
            asset->{ _id, url, metadata { lqip, dimensions } }
        },
        abilityScoreIncrease,
        flexibleAbilityScores,
        size,
        speed,
        traits[]->{name, description},
        proficiencies,
        spells[]{
            name,
            level,
            mode,
            count,
            spellList,
            specificSpells[]->{
                name,
                "id": slug.current,
                level,
                school,
                castingTime,
                range,
                duration,
                description,
                image {
                    ...,
                    asset->{ _id, url, metadata { lqip, dimensions } }
                }
            },
            ability,
            recharge,
            spellLevel,
            notes
        },
        languages,
        isSpellcaster,
        subraces,
        source,
        edition
    } | order(name asc)`);
}

// ===== BACKGROUNDS =====
export function useBackgrounds() {
    return useSanityQuery<Background>(`*[_type == "background"] {
        "id": slug.current,
        name,
        description,
        image {
            ...,
            asset->{ _id, url, metadata { lqip, dimensions } }
        },
        skillProficiencies,
        toolProficiencies,
        traits[]->{name, description},
        languages,
        equipment,
        feature,
        source,
        edition
    } | order(name asc)`);
}

// ===== SPELLS =====
export function useSpells() {
    return useSanityQuery<Spell>('*[_type == "spell"] { ..., "id": slug.current } | order(name asc)');
}

export function useSpellsByClass(classId: string) {
    return useSanityQuery<Spell>(
        '*[_type == "spell" && $classId in classes] { ..., "id": slug.current } | order(level asc, name asc)',
        { classId }
    );
}

// ===== FEATS =====
export function useFeats() {
    return useSanityQuery<Feat>('*[_type == "feat"] { ..., "id": slug.current } | order(name asc)');
}

// ===== ITEMS =====
export function useItems() {
    return useSanityQuery<Item>('*[_type == "item"] { ..., "id": slug.current } | order(name asc)');
}

// ===== MONSTERS =====
export function useMonsters() {
    return useSanityQuery<any>('*[_type == "monster"] | order(name asc)');
}

// ===== HOMEPAGE =====
// ===== HOMEPAGE =====
export function useHomepage() {
    return useSanityQuery<HomepageData>(`*[_type == "homepage"] {
        title,
        heroTitleLine1,
        heroTitleLine2,
        subtitle,
        heroImage {
            ...,
            asset->{ _id, url, metadata { lqip, dimensions } }
        },
        features,
        footer
    }`);
}

