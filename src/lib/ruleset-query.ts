/** Resolve edition overrides before projections, so references and derived fields
 * (spell grants, class tables, armor stats) see the selected mechanics too. */
export const RULESET_OVERLAY = `{..., ...select(_type != "subclass" && coalesce(sameForBoth, false) == false && $edition == "2014" => rules2014, _type != "subclass" && coalesce(sameForBoth, false) == false && $edition == "2024" => rules2024, {}), "_type": _type, "_id": _id}`;

export const RULESET_AVAILABILITY = `_type == "subclass" || (!defined(rulesets) && !defined(ruleset) && !defined(edition)) ||
    $rulesetKey in rulesets[]._key || $rulesetKey in rulesets[]->key.current ||
    ruleset._key == $rulesetKey || ruleset->key.current == $rulesetKey ||
    ((!defined(rulesets) || count(rulesets) == 0) && !defined(ruleset) && edition in [$edition, "Both", "5e"])`;

export function editionQuery(query: string, edition?: string): string {
    // Each document lookup is resolved before filtering. Track nested [] and
    // quoted strings because filters can themselves contain arrays/traversals.
    let result = '';
    for (let i = 0; i < query.length; i++) {
        if (query.slice(i, i + 2) !== '*[') { result += query[i]; continue; }
        let depth = 1, quote = '', end = i + 2;
        for (; end < query.length && depth; end++) {
            const c = query[end];
            if (quote) { if (c === quote && query[end - 1] !== '\\') quote = ''; }
            else if (c === '"' || c === "'") quote = c;
            else if (c === '[') depth++;
            else if (c === ']') depth--;
        }
        const filter = query.slice(i + 2, end - 1);
        const visible = '_id in path("**") && !(_id in path("drafts.**"))';
        result += edition
            ? `*[${visible} && (${RULESET_AVAILABILITY})] ${RULESET_OVERLAY}[${filter}]`
            : `*[${visible} && (${filter})]`;
        i = end - 1;
    }
    if (!edition) return result;
    // Dereferenced objects must be resolved before their projection as well.
    result = result.replace(/->\s*\{/g, `->${RULESET_OVERLAY}{`);
    result = result.replace(/@->(name|description|acquiredAtLevel)/g,
        (_, field: string) => `@->${RULESET_OVERLAY}.${field}`);
    return result;
}
