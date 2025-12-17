import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { Character, Class, Race, Subrace, Background, AbilityScores, Spell, Item, Subclass, Feat } from '../../types/dnd-types';

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
    feats?: Feat[];
    personality?: {
        traits?: string;
        ideals?: string;
        bonds?: string;
        flaws?: string;
    };
    details?: {
        personalityTraits?: string;
        ideals?: string;
        bonds?: string;
        flaws?: string;
    };
    appearance?: string;
    backstory?: string;
    proficiencies?: {
        skills?: string[];
        tools?: string[];
        languages?: string[];
    };
    racialBonusAllocation?: Record<string, number>;
}

// -----------------------------------------------------------------------------
// STYLES - Clean minimal design matching Figma
// -----------------------------------------------------------------------------
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Helvetica',
        fontSize: 9,
    },
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 10,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    // Personal Info Row
    personalInfoRow: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 20,
    },
    infoField: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 10,
        borderRadius: 8,
    },
    infoLabel: {
        fontSize: 7,
        color: '#666',
        textTransform: 'uppercase',
        marginBottom: 3,
    },
    infoValue: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    // Main Content Grid
    mainGrid: {
        flexDirection: 'row',
        gap: 20,
        flex: 1,
    },
    leftColumn: {
        width: '35%',
        gap: 15,
    },
    rightColumn: {
        width: '65%',
        gap: 15,
    },
    // Section Box
    sectionBox: {
        backgroundColor: '#FAFAFA',
        borderRadius: 12,
        padding: 12,
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    // Ability Scores
    abilityScoresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'space-between',
    },
    abilityBox: {
        width: '30%',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    abilityName: {
        fontSize: 8,
        color: '#666',
        marginBottom: 4,
    },
    abilityModifier: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    abilityScore: {
        fontSize: 9,
        color: '#999',
        marginTop: 2,
    },
    // Saving Throws
    savingThrowRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        gap: 6,
    },
    profDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#333',
    },
    profDotFilled: {
        backgroundColor: '#333',
    },
    saveMod: {
        fontSize: 10,
        fontWeight: 'bold',
        width: 20,
    },
    saveName: {
        fontSize: 9,
    },
    // Skills
    skillRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
        gap: 5,
    },
    skillMod: {
        fontSize: 9,
        fontWeight: 'bold',
        width: 18,
    },
    skillName: {
        fontSize: 8,
        flex: 1,
    },
    skillAbility: {
        fontSize: 7,
        color: '#999',
    },
    // Combat Stats
    combatGrid: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 15,
    },
    combatBox: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    combatLabel: {
        fontSize: 7,
        color: '#666',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    combatValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    // HP Box
    hpBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginBottom: 15,
    },
    hpHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    hpLabel: {
        fontSize: 9,
        fontWeight: 'bold',
    },
    hpMax: {
        fontSize: 9,
        color: '#666',
    },
    hpCurrent: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    // Proficiencies
    proficiencySection: {
        marginBottom: 10,
    },
    proficiencyLabel: {
        fontSize: 8,
        fontWeight: 'bold',
        marginBottom: 3,
    },
    proficiencyList: {
        fontSize: 8,
        color: '#444',
    },
    // Attacks
    attackRow: {
        flexDirection: 'row',
        marginBottom: 4,
        paddingBottom: 4,
        borderBottomWidth: 0.5,
        borderBottomColor: '#EEE',
    },
    attackName: {
        flex: 2,
        fontSize: 9,
    },
    attackBonus: {
        flex: 1,
        fontSize: 9,
        textAlign: 'center',
    },
    attackDamage: {
        flex: 1,
        fontSize: 9,
        textAlign: 'right',
    },
    // Feats
    featBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 8,
        marginBottom: 6,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    featName: {
        fontSize: 9,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    featDesc: {
        fontSize: 7,
        color: '#666',
    },
    // Footer
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 7,
        color: '#999',
    },
});

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------
const formatMod = (mod: number) => (mod >= 0 ? `+${mod}` : `${mod}`);
const getModifier = (score: number) => Math.floor((score - 10) / 2);

const SKILLS = [
    { name: "Acrobatics", ab: "DEX" }, { name: "Animal Handling", ab: "WIS" },
    { name: "Arcana", ab: "INT" }, { name: "Athletics", ab: "STR" },
    { name: "Deception", ab: "CHA" }, { name: "History", ab: "INT" },
    { name: "Insight", ab: "WIS" }, { name: "Intimidation", ab: "CHA" },
    { name: "Investigation", ab: "INT" }, { name: "Medicine", ab: "WIS" },
    { name: "Nature", ab: "INT" }, { name: "Perception", ab: "WIS" },
    { name: "Performance", ab: "CHA" }, { name: "Persuasion", ab: "CHA" },
    { name: "Religion", ab: "INT" }, { name: "Sleight of Hand", ab: "DEX" },
    { name: "Stealth", ab: "DEX" }, { name: "Survival", ab: "WIS" },
] as const;

const ABILITY_NAMES: Record<string, string> = {
    STR: 'Strength',
    DEX: 'Dexterity',
    CON: 'Constitution',
    INT: 'Intelligence',
    WIS: 'Wisdom',
    CHA: 'Charisma',
};

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------
export const PDFDocument = ({ character }: { character: CharacterData }) => {
    const profBonus = Math.ceil(character.level / 4) + 1;

    // Calculate Modifiers with racial bonuses
    const mods: Record<string, number> = {};
    const scores: Record<string, number> = {};

    ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].forEach(abil => {
        let base = character.abilityScores[abil as keyof AbilityScores] || 10;

        // Check for flexible ability score allocation
        if (character.race?.flexibleAbilityScores && character.racialBonusAllocation) {
            base += character.racialBonusAllocation[abil] || 0;
        } else {
            // Fixed racial bonuses
            const raceBonus = character.race?.abilityScoreIncrease?.[abil as keyof AbilityScores] || 0;
            const subraceBonus = character.subrace?.abilityScoreIncrease?.[abil as keyof AbilityScores] || 0;
            base += raceBonus + subraceBonus;
        }

        scores[abil] = base;
        mods[abil] = getModifier(base);
    });

    // Get Skill Mod
    const getSkillMod = (skill: string, abil: string) => {
        const bgProfs = character.background?.skillProficiencies || [];
        const isProf = bgProfs.includes(skill) || character.proficiencies?.skills?.includes(skill);
        return mods[abil] + (isProf ? profBonus : 0);
    };

    const isSkillProficient = (skill: string) => {
        const bgProfs = character.background?.skillProficiencies || [];
        return bgProfs.includes(skill) || character.proficiencies?.skills?.includes(skill);
    };

    // Get Save Mod
    const getSaveMod = (abil: string) => {
        const isProf = character.class?.savingThrows?.includes(abil as any);
        return mods[abil] + (isProf ? profBonus : 0);
    };

    // Calculate HP
    const maxHP = character.class?.hitDie
        ? (character.class.hitDie + mods['CON']) + Math.floor((character.class.hitDie / 2 + 1 + mods['CON']) * (character.level - 1))
        : 10;

    return (
        <Document>
            {/* PAGE 1: NEW MINIMAL DESIGN */}
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Character Sheet for D&D</Text>
                </View>

                {/* Personal Info Row */}
                <View style={styles.personalInfoRow}>
                    <View style={[styles.infoField, { flex: 2 }]}>
                        <Text style={styles.infoLabel}>Character Name</Text>
                        <Text style={styles.infoValue}>{character.name || 'Unnamed'}</Text>
                    </View>
                    <View style={styles.infoField}>
                        <Text style={styles.infoLabel}>Level</Text>
                        <Text style={styles.infoValue}>{character.level}</Text>
                    </View>
                    <View style={styles.infoField}>
                        <Text style={styles.infoLabel}>Race</Text>
                        <Text style={styles.infoValue}>{character.race?.name || '—'}</Text>
                    </View>
                    <View style={[styles.infoField, { flex: 2 }]}>
                        <Text style={styles.infoLabel}>Class / Subclass</Text>
                        <Text style={styles.infoValue}>
                            {character.class?.name || '—'}{character.subclass ? ` / ${character.subclass.name}` : ''}
                        </Text>
                    </View>
                    <View style={styles.infoField}>
                        <Text style={styles.infoLabel}>Background</Text>
                        <Text style={styles.infoValue}>{character.background?.name || '—'}</Text>
                    </View>
                </View>

                {/* Main Content Grid */}
                <View style={styles.mainGrid}>
                    {/* Left Column */}
                    <View style={styles.leftColumn}>
                        {/* Ability Scores */}
                        <View style={styles.sectionBox}>
                            <Text style={styles.sectionTitle}>Ability Scores</Text>
                            <View style={styles.abilityScoresGrid}>
                                {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map(abil => (
                                    <View key={abil} style={styles.abilityBox}>
                                        <Text style={styles.abilityName}>{ABILITY_NAMES[abil]}</Text>
                                        <Text style={styles.abilityModifier}>{formatMod(mods[abil])}</Text>
                                        <Text style={styles.abilityScore}>{scores[abil]}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Saving Throws */}
                        <View style={styles.sectionBox}>
                            <Text style={styles.sectionTitle}>Saving Throws</Text>
                            {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map(abil => {
                                const isProf = character.class?.savingThrows?.includes(abil as any);
                                return (
                                    <View key={abil} style={styles.savingThrowRow}>
                                        <View style={[styles.profDot, isProf ? styles.profDotFilled : {}]} />
                                        <Text style={styles.saveMod}>{formatMod(getSaveMod(abil))}</Text>
                                        <Text style={styles.saveName}>{ABILITY_NAMES[abil]}</Text>
                                    </View>
                                );
                            })}
                        </View>

                        {/* Skills */}
                        <View style={styles.sectionBox}>
                            <Text style={styles.sectionTitle}>Skills</Text>
                            {SKILLS.map(skill => {
                                const isProf = isSkillProficient(skill.name);
                                return (
                                    <View key={skill.name} style={styles.skillRow}>
                                        <View style={[styles.profDot, isProf ? styles.profDotFilled : {}]} />
                                        <Text style={styles.skillMod}>{formatMod(getSkillMod(skill.name, skill.ab))}</Text>
                                        <Text style={styles.skillName}>{skill.name}</Text>
                                        <Text style={styles.skillAbility}>({skill.ab})</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    {/* Right Column */}
                    <View style={styles.rightColumn}>
                        {/* Proficiency Bonus & Passive Perception */}
                        <View style={[styles.sectionBox, { flexDirection: 'row', gap: 15, justifyContent: 'center' }]}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={styles.combatLabel}>Proficiency Bonus</Text>
                                <Text style={styles.combatValue}>+{profBonus}</Text>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={styles.combatLabel}>Passive Perception</Text>
                                <Text style={styles.combatValue}>{10 + getSkillMod('Perception', 'WIS')}</Text>
                            </View>
                        </View>

                        {/* Combat Stats */}
                        <View style={styles.combatGrid}>
                            <View style={styles.combatBox}>
                                <Text style={styles.combatLabel}>Armor Class</Text>
                                <Text style={styles.combatValue}>{10 + mods['DEX']}</Text>
                            </View>
                            <View style={styles.combatBox}>
                                <Text style={styles.combatLabel}>Speed</Text>
                                <Text style={styles.combatValue}>{character.race?.speed || 30}</Text>
                            </View>
                            <View style={styles.combatBox}>
                                <Text style={styles.combatLabel}>Initiative</Text>
                                <Text style={styles.combatValue}>{formatMod(mods['DEX'])}</Text>
                            </View>
                        </View>

                        {/* HP */}
                        <View style={styles.hpBox}>
                            <View style={styles.hpHeader}>
                                <Text style={styles.hpLabel}>Hit Points</Text>
                                <Text style={styles.hpMax}>Max: {maxHP}</Text>
                            </View>
                            <Text style={styles.hpCurrent}>{maxHP}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 }}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ fontSize: 7, color: '#666' }}>Temp HP</Text>
                                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>—</Text>
                                </View>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ fontSize: 7, color: '#666' }}>Hit Dice</Text>
                                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{character.level}d{character.class?.hitDie || 8}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Proficiencies */}
                        <View style={styles.sectionBox}>
                            <Text style={styles.sectionTitle}>Proficiencies</Text>
                            <View style={styles.proficiencySection}>
                                <Text style={styles.proficiencyLabel}>Languages</Text>
                                <Text style={styles.proficiencyList}>
                                    {character.race?.languages?.join(', ') || character.proficiencies?.languages?.join(', ') || 'Common'}
                                </Text>
                            </View>
                            {character.proficiencies?.tools && character.proficiencies.tools.length > 0 && (
                                <View style={styles.proficiencySection}>
                                    <Text style={styles.proficiencyLabel}>Tools</Text>
                                    <Text style={styles.proficiencyList}>{character.proficiencies.tools.join(', ')}</Text>
                                </View>
                            )}
                            <View style={styles.proficiencySection}>
                                <Text style={styles.proficiencyLabel}>Armor & Weapons</Text>
                                <Text style={styles.proficiencyList}>See class proficiencies</Text>
                            </View>
                        </View>

                        {/* Attacks */}
                        <View style={styles.sectionBox}>
                            <Text style={styles.sectionTitle}>Attacks & Spellcasting</Text>
                            <View style={[styles.attackRow, { borderBottomWidth: 1, fontWeight: 'bold' }]}>
                                <Text style={[styles.attackName, { fontWeight: 'bold' }]}>Name</Text>
                                <Text style={[styles.attackBonus, { fontWeight: 'bold' }]}>Atk Bonus</Text>
                                <Text style={[styles.attackDamage, { fontWeight: 'bold' }]}>Damage</Text>
                            </View>
                            <View style={styles.attackRow}>
                                <Text style={styles.attackName}>Unarmed Strike</Text>
                                <Text style={styles.attackBonus}>{formatMod(mods['STR'] + profBonus)}</Text>
                                <Text style={styles.attackDamage}>1 + {mods['STR']} B</Text>
                            </View>
                            {character.selectedSpells?.filter(s => s.level === 0).slice(0, 3).map((spell, i) => (
                                <View key={i} style={styles.attackRow}>
                                    <Text style={styles.attackName}>{spell.name}</Text>
                                    <Text style={styles.attackBonus}>
                                        {character.class?.spellcastingAbility ? formatMod(mods[character.class.spellcastingAbility] + profBonus) : '—'}
                                    </Text>
                                    <Text style={styles.attackDamage}>{spell.school.substring(0, 3)}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Feats */}
                        {character.feats && character.feats.length > 0 && (
                            <View style={styles.sectionBox}>
                                <Text style={styles.sectionTitle}>Character Feats</Text>
                                {character.feats.slice(0, 4).map((feat, i) => (
                                    <View key={i} style={styles.featBox}>
                                        <Text style={styles.featName}>{feat.name}</Text>
                                        <Text style={styles.featDesc}>{feat.description.substring(0, 80)}...</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </View>

                <Text style={styles.footer}>Page 1 of {character.class?.spellcaster ? 3 : 2} • {character.name} • D&D Omni-Archive</Text>
            </Page>

            {/* PAGE 2: DETAILS */}
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{character.name} - Details</Text>
                </View>

                {/* Traits & Features */}
                <View style={[styles.sectionBox, { marginBottom: 15 }]}>
                    <Text style={styles.sectionTitle}>Racial Traits</Text>
                    {character.race?.traits?.map((t, i) => (
                        <View key={i} style={{ marginBottom: 8 }}>
                            <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{t.name}</Text>
                            <Text style={{ fontSize: 8, color: '#444' }}>{t.description}</Text>
                        </View>
                    ))}
                </View>

                <View style={[styles.sectionBox, { marginBottom: 15 }]}>
                    <Text style={styles.sectionTitle}>Class Features</Text>
                    {character.class?.features?.filter(f => f.level <= character.level).map((f, i) => (
                        <View key={i} style={{ marginBottom: 8 }}>
                            <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{f.name} (Lv {f.level})</Text>
                            <Text style={{ fontSize: 8, color: '#444' }}>{f.description}</Text>
                        </View>
                    ))}
                </View>

                {/* Personality */}
                <View style={{ flexDirection: 'row', gap: 15 }}>
                    <View style={[styles.sectionBox, { flex: 1 }]}>
                        <Text style={styles.sectionTitle}>Personality Traits</Text>
                        <Text style={{ fontSize: 8 }}>{character.personality?.traits || character.details?.personalityTraits || '—'}</Text>
                    </View>
                    <View style={[styles.sectionBox, { flex: 1 }]}>
                        <Text style={styles.sectionTitle}>Ideals</Text>
                        <Text style={{ fontSize: 8 }}>{character.personality?.ideals || character.details?.ideals || '—'}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 15, marginTop: 15 }}>
                    <View style={[styles.sectionBox, { flex: 1 }]}>
                        <Text style={styles.sectionTitle}>Bonds</Text>
                        <Text style={{ fontSize: 8 }}>{character.personality?.bonds || character.details?.bonds || '—'}</Text>
                    </View>
                    <View style={[styles.sectionBox, { flex: 1 }]}>
                        <Text style={styles.sectionTitle}>Flaws</Text>
                        <Text style={{ fontSize: 8 }}>{character.personality?.flaws || character.details?.flaws || '—'}</Text>
                    </View>
                </View>

                {/* Equipment */}
                <View style={[styles.sectionBox, { marginTop: 15 }]}>
                    <Text style={styles.sectionTitle}>Equipment</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
                        {character.equipment?.map((item, i) => (
                            <Text key={i} style={{ fontSize: 8, backgroundColor: '#EEE', padding: 4, borderRadius: 4 }}>
                                {item.name}
                            </Text>
                        ))}
                    </View>
                </View>

                <Text style={styles.footer}>Page 2 of {character.class?.spellcaster ? 3 : 2} • {character.name}</Text>
            </Page>

            {/* PAGE 3: SPELLS (Conditional) */}
            {(character.class?.spellcaster || character.selectedSpells?.length > 0) && (
                <Page size="A4" style={styles.page}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>{character.name} - Spellcasting</Text>
                    </View>

                    {/* Spellcasting Info */}
                    <View style={[styles.sectionBox, { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }]}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.combatLabel}>Spellcasting Ability</Text>
                            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{character.class?.spellcastingAbility || 'INT'}</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.combatLabel}>Spell Save DC</Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                                {character.class?.spellcastingAbility ? 8 + profBonus + mods[character.class.spellcastingAbility] : 10}
                            </Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.combatLabel}>Spell Attack Bonus</Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                                {character.class?.spellcastingAbility ? formatMod(profBonus + mods[character.class.spellcastingAbility]) : '+0'}
                            </Text>
                        </View>
                    </View>

                    {/* Cantrips */}
                    <View style={[styles.sectionBox, { marginBottom: 15 }]}>
                        <Text style={styles.sectionTitle}>Cantrips</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                            {character.selectedSpells?.filter(s => s.level === 0).map((spell, i) => (
                                <View key={i} style={{ backgroundColor: '#EEE', padding: 6, borderRadius: 6 }}>
                                    <Text style={{ fontSize: 9, fontWeight: 'bold' }}>{spell.name}</Text>
                                    <Text style={{ fontSize: 7, color: '#666' }}>{spell.school}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Leveled Spells */}
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => {
                        const spells = character.selectedSpells?.filter(s => s.level === level) || [];
                        if (spells.length === 0) return null;

                        return (
                            <View key={level} style={[styles.sectionBox, { marginBottom: 10 }]}>
                                <Text style={styles.sectionTitle}>Level {level} Spells</Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                    {spells.map((spell, i) => (
                                        <View key={i} style={{ backgroundColor: '#EEE', padding: 6, borderRadius: 6 }}>
                                            <Text style={{ fontSize: 9, fontWeight: 'bold' }}>{spell.name}</Text>
                                            <Text style={{ fontSize: 7, color: '#666' }}>{spell.school}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        );
                    })}

                    <Text style={styles.footer}>Page 3 of 3 • {character.name}</Text>
                </Page>
            )}
        </Document>
    );
};
