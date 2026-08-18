import { useState, useEffect } from 'react';
import { sanityClient } from '../lib/sanity';
import type { Class, Subclass, Race, Background, Spell, Feat, Item, HomepageData, CharacterRuleset } from '../types/dnd-types';

function rulesetFilter(ruleset?: CharacterRuleset): string {
    if (!ruleset) return '';
    return ` && (
        (defined(rulesets[0]) && $rulesetKey in rulesets[]->key.current) ||
        (!defined(rulesets[0]) && defined(ruleset) && ruleset->key.current == $rulesetKey) ||
        (!defined(rulesets[0]) && !defined(ruleset) && (edition == $edition || edition in ["Both", "5e"]))
    )`;
}

function rulesetParams(ruleset?: CharacterRuleset): Record<string, string> {
    return ruleset
        ? { rulesetKey: `srd-${ruleset}`, edition: ruleset }
        : {};
}

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
export function useClasses(ruleset?: CharacterRuleset) {
    return useSanityQuery<Class>(`*[_type == "class"${rulesetFilter(ruleset)}] {
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
        proficiencies,
        source,
        edition,
        "rulesetKeys": rulesets[]->key.current
    } | order(name asc)`, rulesetParams(ruleset));
}

// ===== SUBCLASSES =====
export function useSubclasses(ruleset?: CharacterRuleset) {
    return useSanityQuery<Subclass>(`*[_type == "subclass"${rulesetFilter(ruleset)}] {
        "id": slug.current,
        name,
        description,
        image {
            ...,
            asset->{ _id, url, metadata { lqip, dimensions } }
        },
        "parentClassId": coalesce(parentClass->slug.current, parentClassId),
        features,
        traits[]->{name, description},
        proficiencies,
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
                "school": coalesce(school->name, school),
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
        edition,
        "rulesetKeys": rulesets[]->key.current
    } | order(name asc)`, rulesetParams(ruleset));
}

export function useSubclassesByClass(classId: string, ruleset?: CharacterRuleset) {
    return useSanityQuery<Subclass>(
        `*[_type == "subclass" && (parentClassId == $classId || parentClass->slug.current == $classId)${rulesetFilter(ruleset)}] {
            "id": slug.current,
            name,
            description,
            image {
                ...,
                asset->{ _id, url, metadata { lqip, dimensions } }
            },
            "parentClassId": coalesce(parentClass->slug.current, parentClassId),
            features,
            traits[]->{name, description},
            proficiencies,
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
                    "school": coalesce(school->name, school),
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
        { classId, ...rulesetParams(ruleset) }
    );
}

// ===== RACES =====
export function useRaces(ruleset?: CharacterRuleset) {
    return useSanityQuery<Race>(`*[_type in ["race", "species"]${rulesetFilter(ruleset)}] {
        "id": slug.current,
        "contentType": _type,
        name,
        description,
        image {
            ...,
            asset->{ _id, url, metadata { lqip, dimensions } }
        },
        "abilityScoreIncrease": coalesce(abilityScoreIncrease, {}),
        "flexibleAbilityScores": coalesce(flexibleAbilityScores, false),
        size,
        speed,
        "traits": coalesce(select(_type == "race" => traits[]->{name, description}, traits[]{name, description}), []),
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
                "school": coalesce(school->name, school),
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
        "languages": coalesce(languages, []),
        "isSpellcaster": coalesce(
            isSpellcaster,
            count(grants[grantType in ["Specific Spell", "Spell Slot"]]) > 0
        ),
        subraces,
        "source": coalesce(source, select(isHomebrew => "Homebrew", "Official")),
        "edition": coalesce(edition, select(
            count(rulesets) > 1 => "Both",
            rulesets[0]->key.current == "srd-2014" => "2014",
            rulesets[0]->key.current == "srd-2024" => "2024",
            ruleset->key.current == "srd-2014" => "2014",
            ruleset->key.current == "srd-2024" => "2024",
            "Both"
        )),
        "rulesetKeys": rulesets[]->key.current
    } | order(name asc)`, rulesetParams(ruleset));
}

// ===== BACKGROUNDS =====
export function useBackgrounds(ruleset?: CharacterRuleset) {
    return useSanityQuery<Background>(`*[_type == "background"${rulesetFilter(ruleset)}] {
        "id": slug.current,
        name,
        description,
        image {
            ...,
            asset->{ _id, url, metadata { lqip, dimensions } }
        },
        skillProficiencies,
        toolProficiencies,
        proficiencies,
        traits[]->{name, description},
        languages,
        equipment,
        feature,
        source,
        edition,
        "rulesetKeys": rulesets[]->key.current
    } | order(name asc)`, rulesetParams(ruleset));
}

// ===== SPELLS =====
export function useSpells(ruleset?: CharacterRuleset) {
    return useSanityQuery<Spell>(`*[_type == "spell"${rulesetFilter(ruleset)}] {
        ...,
        "id": slug.current,
        "school": coalesce(school->name, school)
    } | order(name asc)`, rulesetParams(ruleset));
}

export function useSpellsByClass(classId: string, ruleset?: CharacterRuleset) {
    return useSanityQuery<Spell>(
        `*[_type == "spell" && $classId in classes${rulesetFilter(ruleset)}] {
            ...,
            "id": slug.current,
            "school": coalesce(school->name, school)
        } | order(level asc, name asc)`,
        { classId, ...rulesetParams(ruleset) }
    );
}

// ===== FEATS =====
export function useFeats(ruleset?: CharacterRuleset) {
    return useSanityQuery<Feat>(`*[_type == "feat"${rulesetFilter(ruleset)}] {
        ...,
        "id": slug.current,
        grants[]{
            ...,
            "grantedSpell": grantedSpell->{..., "id": slug.current, "school": coalesce(school->name, school)},
            "schoolRestrictions": coalesce(schoolRestrictions[]->name, select(defined(schoolRestriction) => [schoolRestriction->name], [])),
            "classRestrictions": classRestrictions[]->slug.current
        }
    } | order(name asc)`, rulesetParams(ruleset));
}

// ===== ITEMS =====
export function useItems(ruleset?: CharacterRuleset) {
    return useSanityQuery<Item>(`*[_type == "item"${rulesetFilter(ruleset)}] { ..., "id": slug.current } | order(name asc)`, rulesetParams(ruleset));
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
