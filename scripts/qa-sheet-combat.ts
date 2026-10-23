import assert from "node:assert/strict";
import {
    armorClass,
    buildSheetRules,
    resolveArmor,
    resolveWeapon,
    skillSaveDc,
    spellAction,
    unarmedAction,
    weaponAction,
    type RulesInput,
} from "../src/utils/sheet-combat";

/** Ability scores as modifiers, the way page 1 holds them. */
const mods = (scores: Record<string, number>) =>
    Object.fromEntries(Object.entries(scores).map(([key, score]) => [key, Math.floor((score - 10) / 2)]));

const base = (overrides: Partial<RulesInput>): RulesInput => ({
    totalLevel: 3,
    modifiers: mods({ STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 }),
    classes: [],
    subclasses: [],
    species: [],
    feats: [],
    ...overrides,
});

const monkClass = {
    id: "monk",
    name: "Monk",
    level: 3,
    weaponProficiencies: ["Simple Weapons", "Scimitar", "Shortsword"],
    unarmedDice: [{ level: 1, die: "1d6" }, { level: 5, die: "1d8" }],
    features: [
        { level: 1, name: "Unarmored Defense", description: "While wearing no armor and wielding no Shield, your base Armor Class equals 10 + your Dexterity modifier + your Wisdom modifier." },
        { level: 2, name: "Monk's Focus", description: "Focus save DC = 8 + Wisdom modifier + proficiency bonus." },
    ],
};

// The sheet from the request: a level 3 monk, DEX 16, WIS 16.
{
    const rules = buildSheetRules(base({ classes: [monkClass], modifiers: mods({ STR: 10, DEX: 16, CON: 12, INT: 10, WIS: 16, CHA: 8 }) }));
    const context = { rules, proficiencyBonus: 2 };

    assert.deepEqual(weaponAction("Spear (Monk Weapon)", context), {
        attack: "+5",
        damage: "1d6+3 / 1d8+3 Piercing",
        range: "5 ft · 20/60 ft",
    }, "a monk weapon uses Dexterity and the parenthetical is ignored");
    assert.deepEqual(weaponAction("Dart (x5)", context), {
        attack: "+5",
        damage: "1d4+3 Piercing",
        range: "20/60 ft",
    }, "darts are finesse");
    assert.deepEqual(unarmedAction(context), { attack: "+5", damage: "1d6+3 Bludgeoning", range: "5 ft" },
        "Martial Arts: Dexterity and the class table's die");
    assert.equal(armorClass(rules, "", "").value, "16", "Unarmored Defense: 10 + DEX + WIS");
    assert.equal(armorClass(rules, "", "Shield").value, "15", "a shield turns Unarmored Defense off");
    assert.equal(skillSaveDc(rules, 2).value, "13", "Focus DC off Wisdom");
    assert.equal(weaponAction("Greatsword", context)?.attack, "+0", "untrained: no proficiency bonus");
}

// Finesse takes the better of Strength and Dexterity.
{
    const strong = buildSheetRules(base({ modifiers: mods({ STR: 18, DEX: 12 }) }));
    assert.equal(weaponAction("Rapier", { rules: strong, proficiencyBonus: 2 })?.attack, "+6");
    const nimble = buildSheetRules(base({ modifiers: mods({ STR: 8, DEX: 16 }) }));
    assert.equal(weaponAction("Rapier", { rules: nimble, proficiencyBonus: 2 })?.attack, "+5");
    assert.equal(weaponAction("Longbow", { rules: strong, proficiencyBonus: 2 })?.attack, "+3", "ranged is Dexterity");
    assert.equal(unarmedAction({ rules: strong, proficiencyBonus: 2 }).damage, "5 Bludgeoning", "1 + STR");
}

// Fighting styles, magic weapons, feats.
{
    const rules = buildSheetRules(base({
        modifiers: mods({ STR: 16, DEX: 14 }),
        feats: [{ name: "Dueling" }, { name: "Archery" }],
    }));
    const context = { rules, proficiencyBonus: 2 };
    assert.equal(weaponAction("Longsword", context)?.damage, "1d8+5 / 1d10+3 Slashing", "Dueling is one-handed only");
    assert.equal(weaponAction("Longbow", context)?.attack, "+6", "Archery");
    assert.deepEqual(weaponAction("+1 Longsword", context)?.attack, "+6");
    assert.equal(weaponAction("Flame Tongue", context)?.damage, "1d8+5 / 1d10+3 Slashing + 2d6 Fire");
    assert.equal(resolveWeapon("Thorn Whip ritual")?.name, "Whip", "names containing a weapon still resolve");
    assert.equal(resolveWeapon("Bag of Holding"), undefined);
}

// Armor Class from what is worn.
{
    const rules = buildSheetRules(base({
        modifiers: mods({ STR: 15, DEX: 16, CON: 14 }),
        feats: [{ name: "Defense" }],
        magicItems: [{ name: "Ring of Protection", attuned: true }, { name: "Cloak of Protection", attuned: false }],
    }));
    assert.equal(armorClass(rules, "Chain Mail", "Shield").value, "20", "16 + shield 2 + Defense 1 + ring 1; the cloak isn't attuned");
    assert.equal(armorClass(rules, "Half Plate", "").value, "19", "15 + DEX (max 2) + 1 + 1");
    assert.equal(armorClass(rules, "Studded Leather +1", "Shield, +1").value, "21", "12 + 1 + 3 + shield 3 + 1 + 1");
    assert.equal(resolveArmor("Elven Chain")?.base, 13);
    assert.equal(resolveArmor("Breastplate")?.name, "Breastplate", "'plate' inside 'Breastplate' isn't Plate");

    const mam = buildSheetRules(base({ modifiers: mods({ DEX: 18 }), feats: [{ name: "Medium Armor Master" }] }));
    assert.equal(armorClass(mam, "Breastplate", "").value, "17", "Medium Armor Master lets 3 from Dexterity in");

    const barbarian = buildSheetRules(base({ classes: [{ id: "barbarian", name: "Barbarian", level: 3 }], modifiers: mods({ DEX: 14, CON: 16 }) }));
    assert.equal(armorClass(barbarian, "", "Shield").value, "17", "Barbarians keep the shield");
}

// Species natural armor, read from the Archive's prose.
{
    const rules = buildSheetRules(base({
        modifiers: mods({ DEX: 18 }),
        species: [{ name: "Lizardfolk", traits: [{ name: "Natural Armor", description: "AC 13 + Dex (max 2)." }] }],
    }));
    assert.equal(armorClass(rules, "", "").value, "15");
    const warforged = buildSheetRules(base({
        modifiers: mods({ DEX: 12 }),
        species: [{ name: "Warforged", traits: [{ name: "Integrated Protection", description: "+1 to Armor Class; armor must be incorporated into your body." }] }],
    }));
    assert.equal(armorClass(warforged, "Leather Armor", "").value, "13");
    const gnome = buildSheetRules(base({
        modifiers: mods({ DEX: 12 }),
        species: [{ name: "Rock Gnome", traits: [{ name: "Tinker", description: "Construct a Tiny clockwork device (AC 5, 1 hp)." }] }],
    }));
    assert.equal(armorClass(gnome, "", "").value, "11", "a device's AC is not the character's");
}

// Weapon abilities from subclasses and their prose.
{
    const hexblade = buildSheetRules(base({
        classes: [{ id: "warlock", name: "Warlock", level: 3, spellcastingAbility: "CHA" }],
        subclasses: [{ name: "The Hexblade", parentClassId: "warlock", level: 3 }],
        modifiers: mods({ STR: 8, DEX: 12, CHA: 18 }),
    }));
    assert.equal(weaponAction("Longsword", { rules: hexblade, proficiencyBonus: 2 })?.attack, "+6", "Hex Warrior");

    const maester = buildSheetRules(base({
        subclasses: [{ name: "Arcane Maesters' Guild", level: 3, features: [{ level: 3, name: "Enchanted", description: "You use your Intelligence, instead of Strength or Dexterity, for this weapon's attack and damage rolls." }] }],
        modifiers: mods({ STR: 8, INT: 18 }),
    }));
    assert.equal(weaponAction("Mace", { rules: maester, proficiencyBonus: 2 })?.attack, "+6");
}

// Spellcasting: classes, feats, backgrounds' origin feats and items.
{
    const rules = buildSheetRules(base({
        totalLevel: 5,
        classes: [{ id: "warlock", name: "Warlock", level: 5, spellcastingAbility: "CHA" }],
        feats: [{ name: "Magic Initiate (Cleric)", grantsSpells: true, fromBackground: "Acolyte" }],
        species: [{ name: "High Elf", traits: [{ name: "Cantrip", description: "You know one cantrip. Intelligence is your spellcasting ability for it." }] }],
        magicItems: [{ name: "Rod of the Pact Keeper +2", attuned: true }],
        modifiers: mods({ INT: 12, WIS: 14, CHA: 18 }),
    }));
    assert.deepEqual(rules.casting.map((entry) => entry.ability), ["CHA", "INT", "WIS"]);
    assert.deepEqual(rules.spellBonuses, { dc: { CHA: 2 }, attack: { CHA: 2 } }, "the rod is the warlock's alone");

    const fireBolt = spellAction(
        {
            level: 0,
            range: "120 feet",
            description: "Make a ranged spell attack against the target. On a hit, the target takes 1d10 fire damage.",
            higherLevels: "This spell's damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).",
        },
        { rules, proficiencyBonus: 3 },
        { attack: "+9", dc: "17" },
    );
    assert.deepEqual(fireBolt, { attack: "+9", damage: "2d10 Fire", range: "120 feet" }, "cantrips scale with level");
}

// Several class-feature DCs are labelled by ability.
{
    const rules = buildSheetRules(base({
        classes: [monkClass],
        species: [{ name: "Dragonborn", traits: [{ name: "Breath Weapon", description: "Each creature makes a Dexterity saving throw (DC equals 8 + your Constitution modifier + your proficiency bonus)." }] }],
        modifiers: mods({ WIS: 16, CON: 14 }),
    }));
    assert.deepEqual(skillSaveDc(rules, 2), { value: "13 WIS / 12 CON", tokens: "WIS / CON" });
}

console.log("sheet combat QA passed");
