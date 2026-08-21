import { useState, useEffect } from 'react';
import { sanityClient } from '../lib/sanity';
import type { Class, Subclass, Race, Background, Spell, Feat, Item, HomepageData, CharacterRuleset } from '../types/dnd-types';

function rulesetFilter(ruleset?: CharacterRuleset): string {
    if (!ruleset) return '';
    return ` && (
        $rulesetKey in rulesets[]._key ||
        $rulesetKey in rulesets[]->key.current ||
        ruleset._key == $rulesetKey ||
        ruleset->key.current == $rulesetKey ||
        edition == $edition || edition in ["Both", "5e"]
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
