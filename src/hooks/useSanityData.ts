import { editionQuery } from '../lib/ruleset-query';
import { useState, useEffect } from 'react';
import { sanityClient } from '../lib/sanity';
import type { Class, Subclass, Race, Background, Spell, Feat, Item, HomepageData, CharacterRuleset } from '../types/dnd-types';

function rulesetFilter(ruleset?: CharacterRuleset): string {
    if (!ruleset) return '';
    return ''; // Edition availability is applied centrally before projection.
}

function rulesetParams(ruleset?: CharacterRuleset): Record<string, string> {
    return ruleset
        ? { rulesetKey: `srd-${ruleset}`, edition: ruleset }
        : {};
}

/**
 * Results kept for the life of the tab, keyed by query and params. The Library
 * moves between a hub, list pages and detail pages that all read the same
 * collections, and refetching hundreds of documents on every click would make
 * each page flash a spinner. Failed fetches are dropped so they can retry.
 */
const queryCache = new Map<string, Promise<unknown>>();
const resolvedCache = new Map<string, unknown>();

function cachedFetch<T>(key: string, query: string, params: Record<string, any>): Promise<T> {
    let pending = queryCache.get(key) as Promise<T> | undefined;
    if (!pending) {
        pending = sanityClient.fetch<T>(query, params).then((result) => {
            resolvedCache.set(key, result);
            return result;
        });
        pending.catch(() => queryCache.delete(key));
        queryCache.set(key, pending);
    }
    return pending;
}

// Helper hook for Sanity queries
function useSanityQuery<T>(query: string, params: Record<string, any> = {}) {
    query = editionQuery(query, params.edition);
    const cacheKey = `${query}::${JSON.stringify(params)}`;
    const cached = resolvedCache.get(cacheKey) as T[] | undefined;
    const [resultState, setResultState] = useState({ key: cacheKey, data: cached ?? [] });
    const data = resultState.key === cacheKey ? resultState.data : cached ?? [];
    const [loading, setLoading] = useState(!cached);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            if (!resolvedCache.has(cacheKey)) setLoading(true);
            try {
                const result = await cachedFetch<T[]>(cacheKey, query, params);
                if (isMounted) {
                    setResultState({ key: cacheKey, data: result });
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
    }, [cacheKey]);

    return { data, loading: loading || (resultState.key !== cacheKey && !cached), error, refetch: () => { /* Logic to trigger re-fetch could be added here */ } };
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
        spellLists,
        progression,
        startingEquipment,
        spells[]{
            name,
            level,
            mode,
            count,
            spellList,
            specificSpells[]->{
                ...,
                "id": slug.current,
                "school": coalesce(school->name, legacySchoolName, "Unknown"),
                "subclasses": subclasses[]->slug.current
            },
            ability,
            recharge,
            spellLevel,
            notes
            ,"replacesSpellId": replacesSpell->slug.current
        },
        features[]{
            "level": coalesce(level, acquiredAtLevel, @->acquiredAtLevel),
            "name": coalesce(name, @->name),
            "description": coalesce(description, @->description)
        },
        traits[]->{name, description},
        proficiencies,
        source,
        sourceBook,
        edition,
        subclassLevel,
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
        features[]{
            "level": coalesce(level, acquiredAtLevel, @->acquiredAtLevel),
            "name": coalesce(name, @->name),
            "description": coalesce(description, @->description)
        },
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
                ...,
                name,
                "id": slug.current,
                level,
                "school": coalesce(school->name, legacySchoolName, "Unknown"),
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
            ,"replacesSpellId": replacesSpell->slug.current
        },
        source,
        sourceBook,
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
            features[]{
                "level": coalesce(level, acquiredAtLevel, @->acquiredAtLevel),
                "name": coalesce(name, @->name),
                "description": coalesce(description, @->description)
            },
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
                    ...,
                    name,
                    "id": slug.current,
                    level,
                    "school": coalesce(school->name, legacySchoolName, "Unknown"),
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
                ,"replacesSpellId": replacesSpell->slug.current
            },
            source,
            sourceBook,
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
                ...,
                name,
                "id": slug.current,
                level,
                "school": coalesce(school->name, legacySchoolName, "Unknown"),
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
                ,"replacesSpellId": replacesSpell->slug.current
        },
        "languages": coalesce(languages, []),
        "isSpellcaster": coalesce(
            isSpellcaster,
            count(grants[grantType in ["Specific Spell", "Spell Slot"]]) > 0
        ),
        subraces,
        "source": coalesce(source, select(isHomebrew => "Homebrew", "Official")),
        "isCore": coalesce(isCore, false),
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
        abilityScoreOptions,
        originFeatSpellList,
        toolProficiencies,
        proficiencies,
        traits[]->{name, description},
        languages,
        equipment,
        feature,
        feats[]->{
            ...,
            "id": slug.current,
            grants[]{
                ...,
                "grantedSpell": grantedSpell->{..., "id": slug.current, "school": coalesce(school->name, legacySchoolName, "Unknown")},
                "schoolRestrictions": coalesce(schoolRestrictionNames, schoolRestrictions[]->name, select(defined(schoolRestriction) => [schoolRestriction->name], [])),
                "classRestrictions": classRestrictions[]->slug.current,
                "spellRestrictions": spellRestrictions[]->{..., "id": slug.current, "school": coalesce(school->name, legacySchoolName, "Unknown")}
            }
        },
        expandedSpells[]->{
            ...,
            "id": slug.current,
            "school": coalesce(school->name, legacySchoolName, "Unknown"),
            "subclasses": subclasses[]->slug.current
        },
        source,
        sourceBook,
        edition,
        "rulesetKeys": rulesets[]->key.current
    } | order(name asc)`, rulesetParams(ruleset));
}

// ===== SPELLS =====
export function useSpells(ruleset?: CharacterRuleset) {
    return useSanityQuery<Spell>(`*[_type == "spell"${rulesetFilter(ruleset)}] {
        ...,
        "id": slug.current,
        "school": coalesce(school->name, legacySchoolName, "Unknown"),
        "subclasses": subclasses[]->slug.current
    } | order(name asc)`, rulesetParams(ruleset));
}

export function useSpellsByClass(classId: string, ruleset?: CharacterRuleset) {
    return useSanityQuery<Spell>(
        `*[_type == "spell" && $classId in classes${rulesetFilter(ruleset)}] {
            ...,
            "id": slug.current,
            "school": coalesce(school->name, legacySchoolName, "Unknown"),
            "subclasses": subclasses[]->slug.current
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
            "grantedSpell": grantedSpell->{..., "id": slug.current, "school": coalesce(school->name, legacySchoolName, "Unknown")},
            "schoolRestrictions": coalesce(schoolRestrictionNames, schoolRestrictions[]->name, select(defined(schoolRestriction) => [schoolRestriction->name], [])),
            "classRestrictions": classRestrictions[]->slug.current,
            "spellRestrictions": spellRestrictions[]->{..., "id": slug.current, "school": coalesce(school->name, legacySchoolName, "Unknown")}
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
