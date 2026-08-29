import React from 'react';
import { Page, Text, View, Document, StyleSheet, Svg, Path, Circle, Rect, Line } from '@react-pdf/renderer';
import { Race, Class, Background, Spell, Item, AbilityScores, Subrace, Subclass, Feat } from '../../types/dnd-types';

interface CharacterData {
    name: string;
    race?: Race;
    subrace?: Subrace;
    class?: Class;
    subclass?: Subclass;
    level: number;
    background?: Background;
    abilityScores: AbilityScores;
    selectedSpells: Spell[];
    equipment: Item[];
    feats: Feat[];
    proficiencies: {
        skills: string[];
        tools: string[];
        languages: string[];
    };
    expertise: string[];
    details: {
        gender?: string;
        age?: number;
        height?: string;
        weight?: string;
        appearance?: string;
        backstory?: string;
        personalityTraits?: string;
        ideals?: string;
        bonds?: string;
        flaws?: string;
        allies?: string;
        additionalFeatures?: string;
        alignment?: string;
    };
    racialBonusAllocation?: Record<string, number>;
    hpMax?: number;
}

// -----------------------------------------------------------------------------
// STYLING - High-fidelity Figma matching
// -----------------------------------------------------------------------------
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 24,
        fontFamily: 'Helvetica',
        fontSize: 8,
        color: '#1F2937', // gray-800
    },
    // Page Header
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottomWidth: 1.5,
        borderBottomColor: '#111827',
        paddingBottom: 8,
        marginBottom: 12,
    },
    headerLeft: {
        flexDirection: 'column',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
        letterSpacing: 0.5,
    },
    headerSub: {
        fontSize: 7,
        color: '#4B5563',
        marginTop: 2,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    headerPageNumber: {
        fontSize: 7,
        color: '#9CA3AF',
        alignSelf: 'flex-end',
    },

    // Personal Details Header Block
    personalInfoGrid: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    charNameBox: {
        flex: 2,
        borderWidth: 1,
        borderColor: '#9CA3AF',
        borderRadius: 4,
        padding: 6,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
    },
    classBox: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#9CA3AF',
        borderRadius: 4,
        padding: 6,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
    },
    infoStackBox: {
        flex: 1.8,
        flexDirection: 'column',
        gap: 4,
    },
    infoStackRow: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 4,
        padding: 4,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    infoStackLabel: {
        fontSize: 6,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
        color: '#6B7280',
        width: 48,
        textTransform: 'uppercase',
    },
    infoStackValue: {
        fontSize: 8,
        color: '#1F2937',
        flex: 1,
    },
    infoLabel: {
        fontSize: 6,
        color: '#6B7280',
        textTransform: 'uppercase',
        marginBottom: 2,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
        letterSpacing: 0.5,
    },
    infoValue: {
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
        color: '#111827',
    },

    // 2-Column Core Layout
    columnsContainer: {
        flexDirection: 'row',
        gap: 12,
        flex: 1,
    },
    leftColumn: {
        width: '40%', // approx 827 wide in Figma scale
        flexDirection: 'column',
        gap: 8,
    },
    rightColumn: {
        width: '60%', // approx 1373 wide in Figma scale
        flexDirection: 'column',
        gap: 8,
    },

    // Section Box
    sectionBox: {
        borderWidth: 1,
        borderColor: '#9CA3AF',
        borderRadius: 4,
        padding: 6,
        backgroundColor: '#FFFFFF',
    },
    sectionBoxTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 4,
        marginBottom: 6,
    },
    sectionBoxTitle: {
        fontSize: 8,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
        color: '#111827',
        textTransform: 'uppercase',
        marginLeft: 4,
    },

    // Prof / Insp Row
    profInspRow: {
        flexDirection: 'row',
        gap: 8,
    },
    profInspBox: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#9CA3AF',
        borderRadius: 4,
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    profInspValueBox: {
        width: 22,
        height: 22,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        marginRight: 6,
    },
    profInspValueText: {
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
    },
    profInspLabel: {
        fontSize: 7,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
        color: '#4B5563',
        textTransform: 'uppercase',
    },

    // Sub-Column Layout for Abilities
    abilitiesSubContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    abilitiesSubColumn: {
        flex: 1,
        flexDirection: 'column',
        gap: 8,
    },

    // Ability Score Card
    abilityCard: {
        borderWidth: 1,
        borderColor: '#9CA3AF',
        borderRadius: 4,
        padding: 5,
        backgroundColor: '#FFFFFF',
    },
    abilityHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 3,
        marginBottom: 4,
    },
    abilityHeaderLeft: {
        flexDirection: 'column',
    },
    abilityNameLabel: {
        fontSize: 8,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
        color: '#111827',
    },
    abilityFullName: {
        fontSize: 5,
        color: '#6B7280',
        textTransform: 'uppercase',
        marginTop: 1,
    },
    abilityHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    abilityScoreText: {
        fontSize: 8,
        color: '#6B7280',
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
    },
    abilityModBadge: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    abilityModText: {
        fontSize: 9,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
        color: '#111827',
    },
    abilityList: {
        flexDirection: 'column',
        gap: 2.5,
    },
    abilityRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    abilityRowMod: {
        fontSize: 7.5,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
        width: 14,
        color: '#1F2937',
    },
    abilityRowLabel: {
        fontSize: 7,
        color: '#4B5563',
        flex: 1,
        textOverflow: 'ellipsis',
    },

    // Proficiencies Block
    proficienciesBox: {
        borderWidth: 1,
        borderColor: '#9CA3AF',
        borderRadius: 4,
        padding: 6,
        backgroundColor: '#FFFFFF',
        flex: 1,
    },
    profGroup: {
        marginBottom: 6,
    },
    profGroupTitle: {
        fontSize: 6.5,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
        color: '#6B7280',
        textTransform: 'uppercase',
        marginBottom: 2,
        letterSpacing: 0.5,
    },
    profGroupList: {
        fontSize: 7.5,
        color: '#1F2937',
        lineHeight: 1.2,
    },

    // Combat Stats Header (AC, Speed, Initiative)
    combatHeaderRow: {
        flexDirection: 'row',
        gap: 8,
    },
    combatHeaderBox: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#9CA3AF',
        borderRadius: 4,
        padding: 5,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        height: 48,
        justifyContent: 'center',
    },
    combatHeaderValue: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
        color: '#111827',
    },
    combatHeaderLabel: {
        fontSize: 6,
        color: '#6B7280',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
        marginTop: 2,
    },

    // Passive Stats Row
    passivesRow: {
        flexDirection: 'row',
        gap: 8,
    },
    passiveBox: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 4,
        padding: 4,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
    passiveValueBox: {
        width: 14,
        height: 14,
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 4,
    },
    passiveValueText: {
        fontSize: 8,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
    },
    passiveLabel: {
        fontSize: 6,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
        color: '#4B5563',
        textTransform: 'uppercase',
    },

    // HP Box
    hpCard: {
        borderWidth: 1,
        borderColor: '#9CA3AF',
        borderRadius: 4,
        padding: 6,
        backgroundColor: '#FFFFFF',
    },
    hpCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 3,
        marginBottom: 6,
    },
    hpTitle: {
        fontSize: 8,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
        color: '#111827',
        textTransform: 'uppercase',
    },
    hpMaxLabel: {
        fontSize: 7,
        color: '#6B7280',
    },
    hpGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
    },
    hpBigValueBox: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '35%',
    },
    hpBigValueText: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
        color: '#111827',
    },
    hpSubStats: {
        width: '60%',
        flexDirection: 'column',
        gap: 4,
    },
    hpSubRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 2,
    },
    hpSubLabel: {
        fontSize: 7,
        color: '#4B5563',
    },
    hpSubValue: {
        fontSize: 8,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
        color: '#111827',
    },

    // Actions & Spells Casting
    actionsBox: {
        borderWidth: 1,
        borderColor: '#9CA3AF',
        borderRadius: 4,
        padding: 6,
        backgroundColor: '#FFFFFF',
    },
    tableHeaderRow: {
        flexDirection: 'row',
        borderBottomWidth: 1.5,
        borderBottomColor: '#1F2937',
        paddingBottom: 3,
        marginBottom: 4,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
    },
    tableHeaderCell: {
        fontSize: 6.5,
        color: '#4B5563',
        textTransform: 'uppercase',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: '#E5E7EB',
        paddingVertical: 3.5,
        alignItems: 'center',
    },
    tableCellName: {
        fontSize: 7.5,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
        color: '#111827',
    },
    tableCellVal: {
        fontSize: 7.5,
        color: '#1F2937',
    },

    // Class & Subclass Features
    featuresBox: {
        borderWidth: 1,
        borderColor: '#9CA3AF',
        borderRadius: 4,
        padding: 6,
        backgroundColor: '#FFFFFF',
        flex: 1,
    },
    featureItem: {
        marginBottom: 6,
        borderBottomWidth: 0.5,
        borderBottomColor: '#F3F4F6',
        paddingBottom: 4,
    },
    featureHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 1,
    },
    featureName: {
        fontSize: 7.5,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
        color: '#111827',
    },
    featureLevel: {
        fontSize: 6,
        color: '#6B7280',
    },
    featureDesc: {
        fontSize: 6.5,
        color: '#4B5563',
        lineHeight: 1.2,
    },

    // Page 2 Columns (3-Column Layout)
    explorationColumns: {
        flexDirection: 'row',
        gap: 10,
        flex: 1,
    },
    explColLeft: {
        width: '30%',
        flexDirection: 'column',
        gap: 8,
    },
    explColMiddle: {
        width: '40%',
        flexDirection: 'column',
        gap: 8,
    },
    explColRight: {
        width: '30%',
        flexDirection: 'column',
        gap: 8,
    },

    // Allies & Organizations Box
    alliesBox: {
        borderWidth: 1,
        borderColor: '#9CA3AF',
        borderRadius: 4,
        padding: 6,
        backgroundColor: '#FFFFFF',
        height: 160,
    },
    alliesText: {
        fontSize: 7,
        color: '#374151',
        lineHeight: 1.25,
    },

    // Symbols / Coat of Arms
    symbolBox: {
        borderWidth: 1,
        borderColor: '#9CA3AF',
        borderRadius: 4,
        padding: 6,
        backgroundColor: '#FFFFFF',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Currency Box
    currencyCard: {
        borderWidth: 1,
        borderColor: '#9CA3AF',
        borderRadius: 4,
        padding: 5,
        backgroundColor: '#FFFFFF',
    },
    currencyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: '#E5E7EB',
        paddingVertical: 3,
    },
    currencyLabel: {
        fontSize: 7,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
        color: '#4B5563',
        width: 24,
    },
    currencyValue: {
        fontSize: 8,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
        color: '#111827',
    },

    // Magic Items List
    magicItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        borderBottomColor: '#E5E7EB',
        paddingVertical: 4,
    },
    magicItemName: {
        fontSize: 7.5,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
        color: '#111827',
    },
    magicItemRarity: {
        fontSize: 6,
        color: '#6B7280',
        textTransform: 'uppercase',
    },

    // Backstory Text
    backstoryBox: {
        borderWidth: 1,
        borderColor: '#9CA3AF',
        borderRadius: 4,
        padding: 6,
        backgroundColor: '#FFFFFF',
        flex: 1,
    },
    backstoryText: {
        fontSize: 7,
        color: '#374151',
        lineHeight: 1.3,
    },

    // Spell Page Layout
    spellHeaderBox: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#9CA3AF',
        borderRadius: 4,
        padding: 6,
        backgroundColor: '#F9FAFB',
        marginBottom: 10,
        gap: 12,
    },
    spellHeaderItem: {
        flex: 1,
        alignItems: 'center',
    },
    spellHeaderVal: {
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
        color: '#111827',
    },
    spellHeaderLabel: {
        fontSize: 6,
        color: '#6B7280',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
        marginTop: 1,
    },
    spellsGridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        flex: 1,
    },
    spellLevelBox: {
        width: '48.5%',
        borderWidth: 1,
        borderColor: '#9CA3AF',
        borderRadius: 4,
        padding: 6,
        backgroundColor: '#FFFFFF',
        height: 235,
    },
    spellLevelHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1.5,
        borderBottomColor: '#111827',
        paddingBottom: 3,
        marginBottom: 4,
    },
    spellLevelTitle: {
        fontSize: 8.5,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
        color: '#111827',
        textTransform: 'uppercase',
    },
    spellLevelSlots: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    spellLevelSlotCircle: {
        width: 7,
        height: 7,
        borderRadius: 3.5,
        borderWidth: 0.8,
        borderColor: '#4B5563',
    },
    spellRowName: {
        fontSize: 7.5,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
        color: '#111827',
        width: '32%',
    },
    spellRowText: {
        fontSize: 6.5,
        color: '#374151',
        width: '17%',
    },
    spellRowComponents: {
        fontSize: 6,
        color: '#6B7280',
        width: '17%',
        textAlign: 'right',
    },

    // Page 4 Lore Layout
    loreContainer: {
        flexDirection: 'row',
        gap: 10,
        height: 250,
        marginTop: 10,
    },
    loreBoxHalf: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#9CA3AF',
        borderRadius: 4,
        padding: 6,
        backgroundColor: '#FFFFFF',
    },
    personalityTraitsGrid: {
        flexDirection: 'column',
        gap: 6,
        flex: 1,
    },
    personalityTraitItem: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 4,
    },
    personalityTraitLabel: {
        fontSize: 6,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
        color: '#6B7280',
        textTransform: 'uppercase',
        marginBottom: 1,
    },
    personalityTraitVal: {
        fontSize: 7,
        color: '#374151',
        lineHeight: 1.2,
    },
});

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------
const formatMod = (mod: number) => (mod >= 0 ? `+${mod}` : `${mod}`);
const getModifier = (score: number) => Math.floor((score - 10) / 2);

const ABILITY_NAMES: Record<string, string> = {
    STR: 'Strength',
    DEX: 'Dexterity',
    CON: 'Constitution',
    INT: 'Intelligence',
    WIS: 'Wisdom',
    CHA: 'Charisma',
};

const CLASS_PROFICIENCIES: Record<string, { armor: string; weapons: string; shields: string }> = {
    Barbarian: { armor: "Light armor, medium armor", weapons: "Simple weapons, martial weapons", shields: "Shields" },
    Bard: { armor: "Light armor", weapons: "Simple weapons, hand crossbows, longswords, rapiers, shortswords", shields: "None" },
    Cleric: { armor: "Light armor, medium armor", weapons: "Simple weapons", shields: "Shields" },
    Druid: { armor: "Light armor, medium armor (non-metal)", weapons: "Clubs, daggers, darts, javelins, maces, quarterstaffs, scimitars, sickles, slings, spears", shields: "Shields (non-metal)" },
    Fighter: { armor: "All armor", weapons: "Simple weapons, martial weapons", shields: "Shields" },
    Monk: { armor: "None", weapons: "Simple weapons, shortswords", shields: "None" },
    Paladin: { armor: "All armor", weapons: "Simple weapons, martial weapons", shields: "Shields" },
    Ranger: { armor: "Light armor, medium armor", weapons: "Simple weapons, martial weapons", shields: "Shields" },
    Rogue: { armor: "Light armor", weapons: "Simple weapons, hand crossbows, longswords, rapiers, shortswords", shields: "None" },
    Sorcerer: { armor: "None", weapons: "Daggers, darts, slings, quarterstaffs, light crossbows", shields: "None" },
    Warlock: { armor: "Light armor", weapons: "Simple weapons", shields: "None" },
    Wizard: { armor: "None", weapons: "Daggers, darts, slings, quarterstaffs, light crossbows", shields: "None" }
};

const SPELL_SLOTS_BY_LEVEL: Record<string, Record<number, number[]>> = {
    full: {
        1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
        2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
        3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
        4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
        5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
        6: [4, 3, 3, 0, 0, 0, 0, 0, 0],
        7: [4, 3, 3, 1, 0, 0, 0, 0, 0],
        8: [4, 3, 3, 2, 0, 0, 0, 0, 0],
        9: [4, 3, 3, 3, 1, 0, 0, 0, 0],
        10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
        11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
        12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
        13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
        14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
        15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
        16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
        17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
        18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
        19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
        20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
    },
    half: {
        1: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        2: [2, 0, 0, 0, 0, 0, 0, 0, 0],
        3: [3, 0, 0, 0, 0, 0, 0, 0, 0],
        4: [3, 0, 0, 0, 0, 0, 0, 0, 0],
        5: [4, 2, 0, 0, 0, 0, 0, 0, 0],
        6: [4, 2, 0, 0, 0, 0, 0, 0, 0],
        7: [4, 3, 0, 0, 0, 0, 0, 0, 0],
        8: [4, 3, 0, 0, 0, 0, 0, 0, 0],
        9: [4, 3, 2, 0, 0, 0, 0, 0, 0],
        10: [4, 3, 2, 0, 0, 0, 0, 0, 0],
        11: [4, 3, 3, 0, 0, 0, 0, 0, 0],
        12: [4, 3, 3, 0, 0, 0, 0, 0, 0],
        13: [4, 3, 3, 1, 0, 0, 0, 0, 0],
        14: [4, 3, 3, 1, 0, 0, 0, 0, 0],
        15: [4, 3, 3, 2, 0, 0, 0, 0, 0],
        16: [4, 3, 3, 2, 0, 0, 0, 0, 0],
        17: [4, 3, 3, 3, 1, 0, 0, 0, 0],
        18: [4, 3, 3, 3, 1, 0, 0, 0, 0],
        19: [4, 3, 3, 3, 2, 0, 0, 0, 0],
        20: [4, 3, 3, 3, 2, 0, 0, 0, 0],
    },
    third: {
        1: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        2: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        3: [2, 0, 0, 0, 0, 0, 0, 0, 0],
        4: [3, 0, 0, 0, 0, 0, 0, 0, 0],
        5: [3, 0, 0, 0, 0, 0, 0, 0, 0],
        6: [3, 0, 0, 0, 0, 0, 0, 0, 0],
        7: [4, 2, 0, 0, 0, 0, 0, 0, 0],
        8: [4, 2, 0, 0, 0, 0, 0, 0, 0],
        9: [4, 2, 0, 0, 0, 0, 0, 0, 0],
        10: [4, 3, 0, 0, 0, 0, 0, 0, 0],
        11: [4, 3, 0, 0, 0, 0, 0, 0, 0],
        12: [4, 3, 0, 0, 0, 0, 0, 0, 0],
        13: [4, 3, 2, 0, 0, 0, 0, 0, 0],
        14: [4, 3, 2, 0, 0, 0, 0, 0, 0],
        15: [4, 3, 2, 0, 0, 0, 0, 0, 0],
        16: [4, 3, 3, 0, 0, 0, 0, 0, 0],
        17: [4, 3, 3, 0, 0, 0, 0, 0, 0],
        18: [4, 3, 3, 0, 0, 0, 0, 0, 0],
        19: [4, 3, 3, 1, 0, 0, 0, 0, 0],
        20: [4, 3, 3, 1, 0, 0, 0, 0, 0],
    }
};

// -----------------------------------------------------------------------------
// SVG COMPONENTS
// -----------------------------------------------------------------------------
const CheckboxDot = ({ checked }: { checked: boolean }) => (
    <Svg width={6} height={6} viewBox="0 0 10 10" style={{ marginRight: 4, marginTop: 1 }}>
        <Circle cx="5" cy="5" r="4.5" stroke="#4B5563" strokeWidth="1" fill={checked ? "#1F2937" : "none"} />
    </Svg>
);

const ACShieldSvg = () => (
    <Svg width={36} height={42} viewBox="0 0 40 45" style={{ position: 'absolute', top: 0, left: 0 }}>
        <Path
            d="M 20,2 L 36,6 C 36,20 31,34 20,43 C 9,34 4,20 4,6 Z"
            fill="#FFFFFF"
            stroke="#1F2937"
            strokeWidth="1.5"
        />
    </Svg>
);

const HPHeartSvg = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24" style={{ marginRight: 4 }}>
        <Path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="#FEE2E2"
            stroke="#EF4444"
            strokeWidth="1.5"
        />
    </Svg>
);

const CoatOfArmsSvg = () => (
    <Svg width={40} height={48} viewBox="0 0 40 50">
        <Path
            d="M 20,2 C 32,2 38,10 38,20 C 38,36 20,48 20,48 C 20,48 2.0,36 2.0,20 C 2.0,10 8.0,2 20,2 Z"
            fill="none"
            stroke="#9CA3AF"
            strokeWidth="1.5"
        />
        <Line x1="20" y1="2" x2="20" y2="48" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="2,2" />
        <Line x1="2" y1="20" x2="38" y2="20" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="2,2" />
    </Svg>
);

// -----------------------------------------------------------------------------
// MAIN COMPONENT
// -----------------------------------------------------------------------------
export const PDFDocument = ({ character }: { character: CharacterData }) => {
    const profBonus = Math.ceil(character.level / 4) + 1;

    // Calculate base + racial bonuses
    const scores: Record<string, number> = {};
    const mods: Record<string, number> = {};

    ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].forEach(abil => {
        let base = character.abilityScores[abil as keyof AbilityScores] || 10;
        if (character.race?.flexibleAbilityScores && character.racialBonusAllocation) {
            base += character.racialBonusAllocation[abil] || 0;
        } else {
            const raceBonus = character.race?.abilityScoreIncrease?.[abil as keyof AbilityScores] || 0;
            const subraceBonus = character.subrace?.abilityScoreIncrease?.[abil as keyof AbilityScores] || 0;
            base += raceBonus + subraceBonus;
        }
        scores[abil] = base;
        mods[abil] = getModifier(base);
    });

    const isSkillProficient = (skillName: string) => {
        const bgProfs = character.background?.skillProficiencies || [];
        return bgProfs.includes(skillName) || character.proficiencies?.skills?.includes(skillName);
    };

    const isSkillExpert = (skillName: string) => {
        return character.expertise?.includes(skillName);
    };

    const getSkillMod = (skillName: string, abil: string) => {
        const hasProf = isSkillProficient(skillName);
        const hasExpert = isSkillExpert(skillName);
        let bonus = 0;
        if (hasExpert) bonus = profBonus * 2;
        else if (hasProf) bonus = profBonus;
        return mods[abil] + bonus;
    };

    const getSaveMod = (abil: string) => {
        const isProf = character.class?.savingThrows?.includes(abil as any);
        return mods[abil] + (isProf ? profBonus : 0);
    };

    const maxHP = character.hpMax || (character.class?.hitDie
        ? (character.class.hitDie + mods['CON']) + Math.floor((character.class.hitDie / 2 + 1 + mods['CON']) * (character.level - 1))
        : 10);

    const getArmorClass = () => {
        const armor = character.equipment?.find(item => item.type === 'Armor');
        const hasShield = character.equipment?.some(item => item.name.toLowerCase().includes('shield'));
        let baseAC = 10;
        const dexBonus = mods['DEX'];

        if (armor) {
            const name = armor.name.toLowerCase();
            if (name.includes('leather')) baseAC = 11 + dexBonus;
            else if (name.includes('studded')) baseAC = 12 + dexBonus;
            else if (name.includes('hide')) baseAC = 12 + Math.min(dexBonus, 2);
            else if (name.includes('chain shirt')) baseAC = 13 + Math.min(dexBonus, 2);
            else if (name.includes('scale mail')) baseAC = 14 + Math.min(dexBonus, 2);
            else if (name.includes('breastplate')) baseAC = 14 + Math.min(dexBonus, 2);
            else if (name.includes('half plate')) baseAC = 15 + Math.min(dexBonus, 2);
            else if (name.includes('ring mail')) baseAC = 14;
            else if (name.includes('chain mail')) baseAC = 16;
            else if (name.includes('splint')) baseAC = 17;
            else if (name.includes('plate')) baseAC = 18;
            else baseAC = 10 + dexBonus;
        } else {
            baseAC = 10 + dexBonus;
        }
        if (hasShield) baseAC += 2;
        return baseAC;
    };

    const getWeaponActions = () => {
        const weapons = character.equipment?.filter(item => item.type === 'Weapon') || [];
        const actions = weapons.map(w => {
            const name = w.name.toLowerCase();
            let atkBonus = mods['STR'] + profBonus;
            let damage = `1d4+${mods['STR']}`;
            let range = '5 ft';

            const isFinesse = name.includes('rapier') || name.includes('dagger') || name.includes('shortsword') || name.includes('scimitar');
            const isRanged = name.includes('bow') || name.includes('crossbow') || name.includes('dart') || name.includes('sling');

            if (isRanged || (isFinesse && mods['DEX'] > mods['STR'])) {
                atkBonus = mods['DEX'] + profBonus;
            }

            const activeMod = (isRanged || (isFinesse && mods['DEX'] > mods['STR'])) ? mods['DEX'] : mods['STR'];

            if (name.includes('dagger')) {
                damage = `1d4${formatMod(activeMod)} P`;
                range = '20/60';
            } else if (name.includes('shortsword')) {
                damage = `1d6${formatMod(activeMod)} P`;
            } else if (name.includes('rapier')) {
                damage = `1d8${formatMod(activeMod)} P`;
            } else if (name.includes('scimitar')) {
                damage = `1d6${formatMod(activeMod)} S`;
            } else if (name.includes('longsword')) {
                damage = `1d8${formatMod(activeMod)} S`;
            } else if (name.includes('greatsword')) {
                damage = `2d6${formatMod(activeMod)} S`;
            } else if (name.includes('halberd')) {
                damage = `1d10${formatMod(activeMod)} S`;
                range = '10 ft';
            } else if (name.includes('shortbow')) {
                damage = `1d6${formatMod(activeMod)} P`;
                range = '80/320';
            } else if (name.includes('longbow')) {
                damage = `1d8${formatMod(activeMod)} P`;
                range = '150/600';
            } else if (name.includes('light crossbow')) {
                damage = `1d8${formatMod(activeMod)} P`;
                range = '80/320';
            } else if (name.includes('hand crossbow')) {
                damage = `1d6${formatMod(activeMod)} P`;
                range = '30/120';
            } else if (name.includes('quarterstaff')) {
                damage = `1d6${formatMod(activeMod)} B`;
            } else if (name.includes('mace')) {
                damage = `1d6${formatMod(activeMod)} B`;
            } else if (name.includes('handaxe')) {
                damage = `1d6${formatMod(activeMod)} S`;
                range = '20/60';
            } else {
                damage = `1d4${formatMod(activeMod)}`;
            }

            return { name: w.name, atkBonus: formatMod(atkBonus), damage: damage, range: range };
        });

        // Add standard spell actions/cantrips if any
        character.selectedSpells?.filter(s => s.level === 0).slice(0, 3).forEach(spell => {
            const castingAbility = character.class?.spellcastingAbility || 'INT';
            const spellAtk = mods[castingAbility] + profBonus;
            const range = spell.range;
            let damage = '—';
            const spellName = spell.name.toLowerCase();

            if (spellName.includes('bolt') || spellName.includes('blast') || spellName.includes('ray')) {
                damage = `1d10 ${spell.school.substring(0, 3)}`;
            } else if (spellName.includes('sacred flame')) {
                damage = `1d8 Rad (DC ${8 + profBonus + mods[castingAbility]} Save)`;
            }

            actions.push({
                name: spell.name,
                atkBonus: formatMod(spellAtk),
                damage: damage,
                range: range
            });
        });

        return actions.slice(0, 6);
    };

    const getSpellSlots = (level: number) => {
        const type = character.class?.spellcaster || 'none';
        if (type === 'none') return 0;
        const table = SPELL_SLOTS_BY_LEVEL[type];
        if (table) {
            const slots = table[character.level];
            if (slots) return slots[level - 1] || 0;
        }
        if (type === 'pact') {
            const slotLevel = Math.min(5, Math.ceil(character.level / 2));
            if (level === slotLevel) {
                if (character.level >= 17) return 4;
                if (character.level >= 11) return 3;
                if (character.level >= 2) return 2;
                return 1;
            }
        }
        return 0;
    };

    // Wis, Int, Con Configuration
    const WIS_SKILLS = [
        { name: 'Animal Handling', ab: 'WIS' },
        { name: 'Insight', ab: 'WIS' },
        { name: 'Medicine', ab: 'WIS' },
        { name: 'Perception', ab: 'WIS' },
        { name: 'Survival', ab: 'WIS' },
    ];
    const INT_SKILLS = [
        { name: 'Arcana', ab: 'INT' },
        { name: 'History', ab: 'INT' },
        { name: 'Investigation', ab: 'INT' },
        { name: 'Nature', ab: 'INT' },
        { name: 'Religion', ab: 'INT' },
    ];
    const STR_SKILLS = [
        { name: 'Athletics', ab: 'STR' },
    ];
    const DEX_SKILLS = [
        { name: 'Acrobatics', ab: 'DEX' },
        { name: 'Sleight of Hand', ab: 'DEX' },
        { name: 'Stealth', ab: 'DEX' },
    ];
    const CHA_SKILLS = [
        { name: 'Deception', ab: 'CHA' },
        { name: 'Intimidation', ab: 'CHA' },
        { name: 'Performance', ab: 'CHA' },
        { name: 'Persuasion', ab: 'CHA' },
    ];

    const abilityCardRender = (abilKey: string, name: string, skills: { name: string; ab: string }[]) => {
        const score = scores[abilKey];
        const modifier = mods[abilKey];
        const isSaveProf = character.class?.savingThrows?.includes(abilKey as any) || false;
        const saveMod = getSaveMod(abilKey);

        return (
            <View style={styles.abilityCard} key={abilKey}>
                <View style={styles.abilityHeader}>
                    <View style={styles.abilityHeaderLeft}>
                        <Text style={styles.abilityNameLabel}>{abilKey}</Text>
                        <Text style={styles.abilityFullName}>{name}</Text>
                    </View>
                    <View style={styles.abilityHeaderRight}>
                        <Text style={styles.abilityScoreText}>{score}</Text>
                        <View style={styles.abilityModBadge}>
                            <Text style={styles.abilityModText}>{formatMod(modifier)}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.abilityList}>
                    <View style={styles.abilityRow}>
                        <CheckboxDot checked={isSaveProf} />
                        <Text style={styles.abilityRowMod}>{formatMod(saveMod)}</Text>
                        <Text style={[styles.abilityRowLabel, isSaveProf ? { fontFamily: 'Helvetica-Bold' } : {}]}>Saving Throw</Text>
                    </View>
                    {skills.map(s => {
                        const isProf = isSkillProficient(s.name);
                        const isExp = isSkillExpert(s.name);
                        const skillMod = getSkillMod(s.name, s.ab);
                        return (
                            <View key={s.name} style={styles.abilityRow}>
                                <CheckboxDot checked={isProf} />
                                <Text style={styles.abilityRowMod}>{formatMod(skillMod)}</Text>
                                <Text style={[styles.abilityRowLabel, isExp ? { fontFamily: 'Helvetica-Bold' } : {}]}>
                                    {s.name} {isExp && '*'}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            </View>
        );
    };

    const weaponsList = getWeaponActions();
    const profs = CLASS_PROFICIENCIES[character.class?.name || ''] || { armor: 'None', weapons: 'Simple weapons', shields: 'None' };

    return (
        <Document>
            {/* PAGE 1: CORE STATS & ATTACKS */}
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.headerContainer}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.headerTitle}>CHARACTER SHEET FOR D&D</Text>
                        <Text style={styles.headerSub}>Minimal Character Sheet — Core Stats</Text>
                    </View>
                    <Text style={styles.headerPageNumber}>PAGE 1 OF 4</Text>
                </View>

                {/* Personal Information */}
                <View style={styles.personalInfoGrid}>
                    <View style={styles.charNameBox}>
                        <Text style={styles.infoLabel}>Character Name</Text>
                        <Text style={styles.infoValue}>{character.name || 'Unnamed Character'}</Text>
                    </View>
                    <View style={styles.classBox}>
                        <Text style={styles.infoLabel}>Class & Level</Text>
                        <Text style={styles.infoValue}>{character.class?.name || 'Adventurer'} {character.level}</Text>
                    </View>
                    <View style={styles.infoStackBox}>
                        <View style={styles.infoStackRow}>
                            <Text style={styles.infoStackLabel}>Species</Text>
                            <Text style={styles.infoStackValue}>{character.race?.name || '—'}</Text>
                        </View>
                        <View style={styles.infoStackRow}>
                            <Text style={styles.infoStackLabel}>Background</Text>
                            <Text style={styles.infoStackValue}>{character.background?.name || '—'}</Text>
                        </View>
                        <View style={styles.infoStackRow}>
                            <Text style={styles.infoStackLabel}>Alignment</Text>
                            <Text style={styles.infoStackValue}>{character.details?.alignment || '—'}</Text>
                        </View>
                    </View>
                </View>

                {/* 2-Column Core Stats Layout */}
                <View style={styles.columnsContainer}>
                    {/* Left Column (WIS, INT, CON, Proficiencies) */}
                    <View style={styles.leftColumn}>
                        {/* Prof / Insp Row */}
                        <View style={styles.profInspRow}>
                            <View style={styles.profInspBox}>
                                <View style={styles.profInspValueBox}>
                                    <Text style={styles.profInspValueText}>+{profBonus}</Text>
                                </View>
                                <Text style={styles.profInspLabel}>Proficiency Bonus</Text>
                            </View>
                            <View style={styles.profInspBox}>
                                <View style={styles.profInspValueBox}>
                                    {/* Empty for Inspiration */}
                                </View>
                                <Text style={styles.profInspLabel}>Inspiration</Text>
                            </View>
                        </View>

                        {/* Ability Cards */}
                        <View style={{ gap: 8 }}>
                            {abilityCardRender('WIS', 'Wisdom', WIS_SKILLS)}
                            {abilityCardRender('INT', 'Intelligence', INT_SKILLS)}
                            {abilityCardRender('CON', 'Constitution', [])}
                        </View>

                        {/* Equipment Training & Proficiencies */}
                        <View style={styles.proficienciesBox}>
                            <Text style={[styles.sectionBoxTitle, { marginBottom: 6, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingBottom: 2 }]}>
                                Training & Proficiencies
                            </Text>
                            <View style={styles.profGroup}>
                                <Text style={styles.profGroupTitle}>Armor Type</Text>
                                <Text style={styles.profGroupList}>{profs.armor}</Text>
                            </View>
                            <View style={styles.profGroup}>
                                <Text style={styles.profGroupTitle}>Shield</Text>
                                <Text style={styles.profGroupList}>{profs.shields}</Text>
                            </View>
                            <View style={styles.profGroup}>
                                <Text style={styles.profGroupTitle}>Weapons</Text>
                                <Text style={styles.profGroupList}>{profs.weapons}</Text>
                            </View>
                            <View style={styles.profGroup}>
                                <Text style={styles.profGroupTitle}>Tools</Text>
                                <Text style={styles.profGroupList}>{character.proficiencies?.tools?.join(', ') || 'None'}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Right Column (STR, DEX, CHA, Combat Stats, Actions, Features) */}
                    <View style={styles.rightColumn}>
                        {/* Abilities Column 2 */}
                        <View style={styles.abilitiesSubContainer}>
                            <View style={styles.abilitiesSubColumn}>
                                {abilityCardRender('STR', 'Strength', STR_SKILLS)}
                            </View>
                            <View style={styles.abilitiesSubColumn}>
                                {abilityCardRender('DEX', 'Dexterity', DEX_SKILLS)}
                            </View>
                            <View style={styles.abilitiesSubColumn}>
                                {abilityCardRender('CHA', 'Charisma', CHA_SKILLS)}
                            </View>
                        </View>

                        {/* Combat stats header */}
                        <View style={styles.combatHeaderRow}>
                            <View style={styles.combatHeaderBox}>
                                <Text style={styles.combatHeaderValue}>{getArmorClass()}</Text>
                                <Text style={styles.combatHeaderLabel}>Armor Class</Text>
                            </View>
                            <View style={styles.combatHeaderBox}>
                                <Text style={styles.combatHeaderValue}>{character.race?.speed || 30}ft</Text>
                                <Text style={styles.combatHeaderLabel}>Speed</Text>
                            </View>
                            <View style={styles.combatHeaderBox}>
                                <Text style={styles.combatHeaderValue}>{formatMod(mods['DEX'])}</Text>
                                <Text style={styles.combatHeaderLabel}>Initiative</Text>
                            </View>
                        </View>

                        {/* Passives Row */}
                        <View style={styles.passivesRow}>
                            <View style={styles.passiveBox}>
                                <View style={styles.passiveValueBox}>
                                    <Text style={styles.passiveValueText}>{10 + getSkillMod('Perception', 'WIS')}</Text>
                                </View>
                                <Text style={styles.passiveLabel}>Passive Perception (WIS)</Text>
                            </View>
                            <View style={styles.passiveBox}>
                                <View style={styles.passiveValueBox}>
                                    <Text style={styles.passiveValueText}>{10 + getSkillMod('Investigation', 'INT')}</Text>
                                </View>
                                <Text style={styles.passiveLabel}>Passive Investigation (INT)</Text>
                            </View>
                            <View style={styles.passiveBox}>
                                <View style={styles.passiveValueBox}>
                                    <Text style={styles.passiveValueText}>{10 + getSkillMod('Insight', 'WIS')}</Text>
                                </View>
                                <Text style={styles.passiveLabel}>Passive Insight (WIS)</Text>
                            </View>
                        </View>

                        {/* Hit Points Card */}
                        <View style={styles.hpCard}>
                            <View style={styles.hpCardHeader}>
                                <Text style={styles.hpTitle}>Hit Points</Text>
                                <Text style={styles.hpMaxLabel}>MAX HP: {maxHP}</Text>
                            </View>
                            <View style={styles.hpGrid}>
                                <View style={styles.hpBigValueBox}>
                                    <Text style={styles.hpBigValueText}>{maxHP}</Text>
                                    <Text style={{ fontSize: 6, color: '#6B7280', textTransform: 'uppercase' }}>Current HP</Text>
                                </View>
                                <View style={styles.hpSubStats}>
                                    <View style={styles.hpSubRow}>
                                        <Text style={styles.hpSubLabel}>Temporary HP</Text>
                                        <Text style={styles.hpSubValue}>—</Text>
                                    </View>
                                    <View style={styles.hpSubRow}>
                                        <Text style={styles.hpSubLabel}>Hit Dice (Total)</Text>
                                        <Text style={styles.hpSubValue}>{character.level}d{character.class?.hitDie || 8}</Text>
                                    </View>
                                    <View style={[styles.hpSubRow, { borderBottomWidth: 0 }]}>
                                        <Text style={styles.hpSubLabel}>Death Saves</Text>
                                        <View style={{ flexDirection: 'column', gap: 2 }}>
                                            <View style={{ flexDirection: 'row', gap: 3, alignItems: 'center' }}>
                                                <Text style={{ fontSize: 5, color: '#4B5563', width: 22 }}>SUCCESS</Text>
                                                {[1, 2, 3].map(i => <Svg key={i} width={5} height={5} viewBox="0 0 10 10"><Circle cx="5" cy="5" r="4.5" stroke="#9CA3AF" strokeWidth="1.5" fill="none" /></Svg>)}
                                            </View>
                                            <View style={{ flexDirection: 'row', gap: 3, alignItems: 'center' }}>
                                                <Text style={{ fontSize: 5, color: '#4B5563', width: 22 }}>FAILURE</Text>
                                                {[1, 2, 3].map(i => <Svg key={i} width={5} height={5} viewBox="0 0 10 10"><Circle cx="5" cy="5" r="4.5" stroke="#9CA3AF" strokeWidth="1.5" fill="none" /></Svg>)}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Actions & Spells Casting */}
                        <View style={styles.actionsBox}>
                            <Text style={[styles.sectionBoxTitle, { marginBottom: 6 }]}>Actions & Spells Casting</Text>
                            <View style={styles.tableHeaderRow}>
                                <Text style={[styles.tableHeaderCell, { width: '38%' }]}>Action / Weapon / Spell</Text>
                                <Text style={[styles.tableHeaderCell, { width: '18%', textAlign: 'center' }]}>Atk Bonus</Text>
                                <Text style={[styles.tableHeaderCell, { width: '28%', textAlign: 'center' }]}>Damage / Type</Text>
                                <Text style={[styles.tableHeaderCell, { width: '16%', textAlign: 'right' }]}>Range</Text>
                            </View>
                            {weaponsList.map((w, idx) => (
                                <View key={idx} style={styles.tableRow}>
                                    <Text style={[styles.tableCellName, { width: '38%' }]}>{w.name}</Text>
                                    <Text style={[styles.tableCellVal, { width: '18%', textAlign: 'center', fontWeight: 'bold' }]}>{w.atkBonus}</Text>
                                    <Text style={[styles.tableCellVal, { width: '28%', textAlign: 'center' }]}>{w.damage}</Text>
                                    <Text style={[styles.tableCellVal, { width: '16%', textAlign: 'right' }]}>{w.range}</Text>
                                </View>
                            ))}
                            {/* Fill empty slots up to 6 */}
                            {Array.from({ length: Math.max(0, 6 - weaponsList.length) }).map((_, idx) => (
                                <View key={`empty-${idx}`} style={[styles.tableRow, { borderBottomColor: idx === 5 - weaponsList.length ? '#9CA3AF' : '#E5E7EB' }]}>
                                    <Text style={[styles.tableCellName, { width: '38%', color: '#D1D5DB' }]}></Text>
                                    <Text style={[styles.tableCellVal, { width: '18%' }]}></Text>
                                    <Text style={[styles.tableCellVal, { width: '28%' }]}></Text>
                                    <Text style={[styles.tableCellVal, { width: '16%' }]}></Text>
                                </View>
                            ))}
                        </View>

                        {/* Class & Subclass Features */}
                        <View style={styles.featuresBox}>
                            <Text style={[styles.sectionBoxTitle, { marginBottom: 6, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingBottom: 2 }]}>
                                Class & Subclass Features
                            </Text>
                            <View style={{ flexDirection: 'column', gap: 4 }}>
                                {character.class?.features?.filter(f => f.level <= character.level).slice(0, 4).map((f, i) => (
                                    <View key={i} style={styles.featureItem}>
                                        <View style={styles.featureHeader}>
                                            <Text style={styles.featureName}>{f.name}</Text>
                                            <Text style={styles.featureLevel}>LVL {f.level}</Text>
                                        </View>
                                        <Text style={styles.featureDesc}>{f.description}</Text>
                                    </View>
                                ))}
                                {character.subclass?.features?.filter(f => f.level <= character.level).slice(0, 2).map((f, i) => (
                                    <View key={`sub-${i}`} style={styles.featureItem}>
                                        <View style={styles.featureHeader}>
                                            <Text style={[styles.featureName, { color: '#6B21A8' }]}>{f.name} ({character.subclass?.name})</Text>
                                            <Text style={styles.featureLevel}>LVL {f.level}</Text>
                                        </View>
                                        <Text style={styles.featureDesc}>{f.description}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>
            </Page>

            {/* PAGE 2: EXPLORATION & SOCIAL */}
            <Page size="A4" style={styles.page}>
                <View style={styles.headerContainer}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.headerTitle}>{character.name || 'Unnamed Character'}</Text>
                        <Text style={styles.headerSub}>Minimal Character Sheet — Exploration & Lore</Text>
                    </View>
                    <Text style={styles.headerPageNumber}>PAGE 2 OF 4</Text>
                </View>

                <View style={styles.explorationColumns}>
                    {/* Left Column: Passives, Language, Allies, Symbol, Currency */}
                    <View style={styles.explColLeft}>
                        <View style={[styles.sectionBox, { gap: 6 }]}>
                            <View style={styles.passiveBox}>
                                <View style={styles.passiveValueBox}>
                                    <Text style={styles.passiveValueText}>{10 + getSkillMod('Perception', 'WIS')}</Text>
                                </View>
                                <Text style={styles.passiveLabel}>Passive Perception</Text>
                            </View>
                            <View style={styles.passiveBox}>
                                <View style={styles.passiveValueBox}>
                                    <Text style={styles.passiveValueText}>{10 + getSkillMod('Investigation', 'INT')}</Text>
                                </View>
                                <Text style={styles.passiveLabel}>Passive Investigation</Text>
                            </View>
                            <View style={styles.passiveBox}>
                                <View style={styles.passiveValueBox}>
                                    <Text style={styles.passiveValueText}>{10 + getSkillMod('Insight', 'WIS')}</Text>
                                </View>
                                <Text style={styles.passiveLabel}>Passive Insight</Text>
                            </View>
                        </View>

                        <View style={styles.sectionBox}>
                            <Text style={styles.infoLabel}>Languages</Text>
                            <Text style={{ fontSize: 8, color: '#1F2937', lineHeight: 1.3 }}>
                                {character.proficiencies?.languages?.join(', ') || 'Common'}
                            </Text>
                        </View>

                        <View style={styles.alliesBox}>
                            <Text style={[styles.sectionBoxTitle, { marginBottom: 6 }]}>Allies & Organizations</Text>
                            <Text style={styles.alliesText}>{character.details?.allies || 'None documented.'}</Text>
                        </View>

                        <View style={styles.symbolBox}>
                            <CoatOfArmsSvg />
                            <Text style={{ fontSize: 5, color: '#9CA3AF', textTransform: 'uppercase', marginTop: 4 }}>Coat of Arms</Text>
                        </View>

                        <View style={styles.currencyCard}>
                            <Text style={[styles.sectionBoxTitle, { marginBottom: 4 }]}>Currency</Text>
                            <View style={styles.currencyRow}>
                                <Text style={[styles.currencyLabel, { color: '#B45309' }]}>CP</Text>
                                <Text style={styles.currencyValue}>—</Text>
                            </View>
                            <View style={styles.currencyRow}>
                                <Text style={[styles.currencyLabel, { color: '#6B7280' }]}>SP</Text>
                                <Text style={styles.currencyValue}>—</Text>
                            </View>
                            <View style={styles.currencyRow}>
                                <Text style={[styles.currencyLabel, { color: '#D97706' }]}>GP</Text>
                                <Text style={styles.currencyValue}>—</Text>
                            </View>
                            <View style={styles.currencyRow}>
                                <Text style={[styles.currencyLabel, { color: '#374151', borderBottomWidth: 0 }]}>PP</Text>
                                <Text style={styles.currencyValue}>—</Text>
                            </View>
                        </View>
                    </View>

                    {/* Middle Column: Traits, Feats, Magic Items, Treasure */}
                    <View style={styles.explColMiddle}>
                        <View style={styles.sectionBox}>
                            <Text style={[styles.sectionBoxTitle, { marginBottom: 6 }]}>Species Traits</Text>
                            <View style={{ flexDirection: 'column', gap: 5 }}>
                                {character.race?.traits?.slice(0, 4).map((t, idx) => (
                                    <View key={idx}>
                                        <Text style={{ fontSize: 7.5, fontWeight: 'bold', fontFamily: 'Helvetica-Bold', color: '#111827' }}>{t.name}</Text>
                                        <Text style={{ fontSize: 6.5, color: '#4B5563', lineHeight: 1.25, marginTop: 1 }}>{t.description}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View style={styles.sectionBox}>
                            <Text style={[styles.sectionBoxTitle, { marginBottom: 6 }]}>Character Feats</Text>
                            <View style={{ flexDirection: 'column', gap: 5 }}>
                                {character.feats && character.feats.length > 0 ? (
                                    character.feats.slice(0, 3).map((f, idx) => (
                                        <View key={idx}>
                                            <Text style={{ fontSize: 7.5, fontWeight: 'bold', fontFamily: 'Helvetica-Bold', color: '#B45309' }}>{f.name}</Text>
                                            <Text style={{ fontSize: 6.5, color: '#4B5563', lineHeight: 1.25, marginTop: 1 }}>{f.description}</Text>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={{ fontSize: 7, color: '#9CA3AF', fontStyle: 'italic' }}>No feats selected.</Text>
                                )}
                            </View>
                        </View>

                        <View style={styles.sectionBox}>
                            <Text style={[styles.sectionBoxTitle, { marginBottom: 4 }]}>Magic Items</Text>
                            {character.equipment?.filter(i => i.magical).slice(0, 4).map((item, idx) => (
                                <View key={idx} style={styles.magicItemRow}>
                                    <Text style={styles.magicItemName}>{item.name}</Text>
                                    <Text style={styles.magicItemRarity}>{item.rarity || 'Common'}</Text>
                                </View>
                            ))}
                            {/* Empty slots for magic items */}
                            {Array.from({ length: Math.max(0, 4 - (character.equipment?.filter(i => i.magical).length || 0)) }).map((_, idx) => (
                                <View key={`empty-magic-${idx}`} style={styles.magicItemRow}>
                                    <Text style={{ fontSize: 7.5, color: '#D1D5DB' }}>Empty attunement slot</Text>
                                    <Text style={{ fontSize: 6, color: '#D1D5DB' }}>—</Text>
                                </View>
                            ))}
                        </View>

                        <View style={[styles.sectionBox, { flex: 1 }]}>
                            <Text style={[styles.sectionBoxTitle, { marginBottom: 6 }]}>Treasure / Log</Text>
                            <Text style={{ fontSize: 7, color: '#6B7280' }}>Notes on coins, gems, valuables, and quest items.</Text>
                        </View>
                    </View>

                    {/* Right Column: Inventory, Backstory */}
                    <View style={styles.explColRight}>
                        <View style={[styles.sectionBox, { height: 350 }]}>
                            <Text style={[styles.sectionBoxTitle, { marginBottom: 6 }]}>Inventory</Text>
                            <View style={[styles.tableHeaderRow, { borderBottomColor: '#9CA3AF' }]}>
                                <Text style={{ fontSize: 6.5, color: '#4B5563', width: '75%' }}>Item Name</Text>
                                <Text style={{ fontSize: 6.5, color: '#4B5563', width: '25%', textAlign: 'right' }}>Qty</Text>
                            </View>
                            {character.equipment?.slice(0, 12).map((item, idx) => (
                                <View key={idx} style={[styles.tableRow, { borderBottomColor: '#F3F4F6' }]}>
                                    <Text style={{ fontSize: 7.5, color: '#1F2937', width: '75%' }}>{item.name}</Text>
                                    <Text style={{ fontSize: 7.5, color: '#6B7280', width: '25%', textAlign: 'right' }}>1</Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.backstoryBox}>
                            <Text style={[styles.sectionBoxTitle, { marginBottom: 6 }]}>Backstory</Text>
                            <Text style={styles.backstoryText}>{character.details?.backstory || 'No backstory documented.'}</Text>
                        </View>
                    </View>
                </View>
            </Page>

            {/* PAGE 3: SPELLS (CANTRIPS TO LEVEL 5) */}
            <Page size="A4" style={styles.page}>
                <View style={styles.headerContainer}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.headerTitle}>{character.name || 'Unnamed Character'}</Text>
                        <Text style={styles.headerSub}>Minimal Character Sheet — Spellcasting (Lvl 0 - 5)</Text>
                    </View>
                    <Text style={styles.headerPageNumber}>PAGE 3 OF 4</Text>
                </View>

                {/* Spellcaster stats */}
                <View style={styles.spellHeaderBox}>
                    <View style={styles.spellHeaderItem}>
                        <Text style={styles.spellHeaderVal}>{character.class?.spellcastingAbility || '—'}</Text>
                        <Text style={styles.spellHeaderLabel}>Casting Ability</Text>
                    </View>
                    <View style={styles.spellHeaderItem}>
                        <Text style={styles.spellHeaderVal}>
                            {character.class?.spellcastingAbility
                                ? 8 + profBonus + mods[character.class.spellcastingAbility]
                                : '—'}
                        </Text>
                        <Text style={styles.spellHeaderLabel}>Spell Save DC</Text>
                    </View>
                    <View style={styles.spellHeaderItem}>
                        <Text style={styles.spellHeaderVal}>
                            {character.class?.spellcastingAbility
                                ? formatMod(profBonus + mods[character.class.spellcastingAbility])
                                : '—'}
                        </Text>
                        <Text style={styles.spellHeaderLabel}>Spell Attack Bonus</Text>
                    </View>
                </View>

                {/* Spells Grid Level 0 to 5 */}
                <View style={styles.spellsGridContainer}>
                    {/* Cantrips */}
                    <View style={styles.spellLevelBox}>
                        <View style={styles.spellLevelHeader}>
                            <Text style={styles.spellLevelTitle}>Cantrips (0)</Text>
                        </View>
                        {character.selectedSpells?.filter(s => s.level === 0).slice(0, 7).map((spell, i) => (
                            <View key={i} style={styles.tableRow}>
                                <Text style={styles.spellRowName}>{spell.name}</Text>
                                <Text style={styles.spellRowText}>{spell.castingTime}</Text>
                                <Text style={styles.spellRowText}>{spell.range}</Text>
                                <Text style={styles.spellRowText}>{spell.school.substring(0, 4)}</Text>
                                <Text style={styles.spellRowComponents}>{spell.components?.verbal ? 'V' : ''}{spell.components?.somatic ? 'S' : ''}{spell.components?.material ? 'M' : ''}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Level 1 to 5 */}
                    {[1, 2, 3, 4, 5].map(lvl => {
                        const levelSpells = character.selectedSpells?.filter(s => s.level === lvl) || [];
                        const maxSlots = getSpellSlots(lvl);

                        return (
                            <View key={lvl} style={styles.spellLevelBox}>
                                <View style={styles.spellLevelHeader}>
                                    <Text style={styles.spellLevelTitle}>Level {lvl}</Text>
                                    {maxSlots > 0 && (
                                        <View style={styles.spellLevelSlots}>
                                            <Text style={{ fontSize: 6, color: '#6B7280' }}>SLOTS: {maxSlots}</Text>
                                            {Array.from({ length: maxSlots }).map((_, sIdx) => (
                                                <View key={sIdx} style={styles.spellLevelSlotCircle} />
                                            ))}
                                        </View>
                                    )}
                                </View>
                                {levelSpells.slice(0, 7).map((spell, i) => (
                                    <View key={i} style={styles.tableRow}>
                                        <Text style={styles.spellRowName}>{spell.name}</Text>
                                        <Text style={styles.spellRowText}>{spell.castingTime}</Text>
                                        <Text style={styles.spellRowText}>{spell.range}</Text>
                                        <Text style={styles.spellRowText}>{spell.school.substring(0, 4)}</Text>
                                        <Text style={styles.spellRowComponents}>{spell.components?.verbal ? 'V' : ''}{spell.components?.somatic ? 'S' : ''}{spell.components?.material ? 'M' : ''}</Text>
                                    </View>
                                ))}
                            </View>
                        );
                    })}
                </View>
            </Page>

            {/* PAGE 4: SPELLS (LEVEL 6 TO 9) & APPEARANCE / PERSONALITY */}
            <Page size="A4" style={styles.page}>
                <View style={styles.headerContainer}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.headerTitle}>{character.name || 'Unnamed Character'}</Text>
                        <Text style={styles.headerSub}>Minimal Character Sheet — Spellcasting (Lvl 6 - 9) & Lore</Text>
                    </View>
                    <Text style={styles.headerPageNumber}>PAGE 4 OF 4</Text>
                </View>

                {/* Spellcaster stats */}
                <View style={styles.spellHeaderBox}>
                    <View style={styles.spellHeaderItem}>
                        <Text style={styles.spellHeaderVal}>{character.class?.spellcastingAbility || '—'}</Text>
                        <Text style={styles.spellHeaderLabel}>Casting Ability</Text>
                    </View>
                    <View style={styles.spellHeaderItem}>
                        <Text style={styles.spellHeaderVal}>
                            {character.class?.spellcastingAbility
                                ? 8 + profBonus + mods[character.class.spellcastingAbility]
                                : '—'}
                        </Text>
                        <Text style={styles.spellHeaderLabel}>Spell Save DC</Text>
                    </View>
                    <View style={styles.spellHeaderItem}>
                        <Text style={styles.spellHeaderVal}>
                            {character.class?.spellcastingAbility
                                ? formatMod(profBonus + mods[character.class.spellcastingAbility])
                                : '—'}
                        </Text>
                        <Text style={styles.spellHeaderLabel}>Spell Attack Bonus</Text>
                    </View>
                </View>

                {/* Spells Grid Level 6 to 9 */}
                <View style={[styles.spellsGridContainer, { flex: 0, height: 490 }]}>
                    {[6, 7, 8, 9].map(lvl => {
                        const levelSpells = character.selectedSpells?.filter(s => s.level === lvl) || [];
                        const maxSlots = getSpellSlots(lvl);

                        return (
                            <View key={lvl} style={styles.spellLevelBox}>
                                <View style={styles.spellLevelHeader}>
                                    <Text style={styles.spellLevelTitle}>Level {lvl}</Text>
                                    {maxSlots > 0 && (
                                        <View style={styles.spellLevelSlots}>
                                            <Text style={{ fontSize: 6, color: '#6B7280' }}>SLOTS: {maxSlots}</Text>
                                            {Array.from({ length: maxSlots }).map((_, sIdx) => (
                                                <View key={sIdx} style={styles.spellLevelSlotCircle} />
                                            ))}
                                        </View>
                                    )}
                                </View>
                                {levelSpells.slice(0, 7).map((spell, i) => (
                                    <View key={i} style={styles.tableRow}>
                                        <Text style={styles.spellRowName}>{spell.name}</Text>
                                        <Text style={styles.spellRowText}>{spell.castingTime}</Text>
                                        <Text style={styles.spellRowText}>{spell.range}</Text>
                                        <Text style={styles.spellRowText}>{spell.school.substring(0, 4)}</Text>
                                        <Text style={styles.spellRowComponents}>{spell.components?.verbal ? 'V' : ''}{spell.components?.somatic ? 'S' : ''}{spell.components?.material ? 'M' : ''}</Text>
                                    </View>
                                ))}
                            </View>
                        );
                    })}
                </View>

                {/* Appearance & Personality */}
                <View style={styles.loreContainer}>
                    <View style={styles.loreBoxHalf}>
                        <Text style={[styles.sectionBoxTitle, { marginBottom: 6, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingBottom: 2 }]}>
                            Character Appearance
                        </Text>
                        <Text style={{ fontSize: 7.5, color: '#374151', lineHeight: 1.3 }}>
                            {character.details?.appearance || 'No appearance description provided.'}
                        </Text>
                    </View>
                    <View style={styles.loreBoxHalf}>
                        <Text style={[styles.sectionBoxTitle, { marginBottom: 6, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingBottom: 2 }]}>
                            Personality & Traits
                        </Text>
                        <View style={styles.personalityTraitsGrid}>
                            <View style={styles.personalityTraitItem}>
                                <Text style={styles.personalityTraitLabel}>Personality Traits</Text>
                                <Text style={styles.personalityTraitVal}>{character.details?.personalityTraits || '—'}</Text>
                            </View>
                            <View style={styles.personalityTraitItem}>
                                <Text style={styles.personalityTraitLabel}>Ideals</Text>
                                <Text style={styles.personalityTraitVal}>{character.details?.ideals || '—'}</Text>
                            </View>
                            <View style={styles.personalityTraitItem}>
                                <Text style={styles.personalityTraitLabel}>Bonds</Text>
                                <Text style={styles.personalityTraitVal}>{character.details?.bonds || '—'}</Text>
                            </View>
                            <View style={[styles.personalityTraitItem, { borderBottomWidth: 0 }]}>
                                <Text style={styles.personalityTraitLabel}>Flaws</Text>
                                <Text style={styles.personalityTraitVal}>{character.details?.flaws || '—'}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};
