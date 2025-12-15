import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { Character, Class, Race, Subrace, Background, AbilityScores, Spell, Item, Subclass } from '../../types/dnd-types';

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
    personality?: {
        traits?: string;
        ideals?: string;
        bonds?: string;
        flaws?: string;
    };
    // Support the details object from CharacterSheet as well
    details?: {
        personalityTraits?: string;
        ideals?: string;
        bonds?: string;
        flaws?: string;
    };
    appearance?: string;
    backstory?: string;
}

// -----------------------------------------------------------------------------
// STYLES
// -----------------------------------------------------------------------------
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 25,
        fontFamily: 'Helvetica',
        fontSize: 9,
        lineHeight: 1.2,
    },
    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#E9E9E9',
        paddingBottom: 5,
    },
    headerLeft: { width: '40%' },
    headerRight: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '58%',
        justifyContent: 'flex-start',
        gap: 8
    },
    charName: {
        fontSize: 24,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    headerField: {
        width: '30%',
        marginBottom: 4,
        backgroundColor: '#F7F7F7',
        padding: 3,
        borderRadius: 3,
    },
    label: {
        fontSize: 6,
        color: '#666',
        textTransform: 'uppercase',
        marginBottom: 1,
    },
    value: {
        fontSize: 9,
        fontWeight: 'bold',
    },
    // Grid System
    grid3: {
        flexDirection: 'row',
        gap: 15,
        height: '90%',
    },
    col1: { width: '18%', gap: 10 },
    col2: { width: '41%', gap: 10 },
    col3: { width: '41%', gap: 10 },

    // Generic Box
    box: {
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 4,
        padding: 6,
        marginBottom: 5,
    },
    boxTitle: {
        fontSize: 8,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 3,
        backgroundColor: '#EFEFEF',
        paddingVertical: 1,
        textTransform: 'uppercase',
    },
    // Stats
    statBox: {
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 4,
        padding: 4,
        marginBottom: 8,
    },
    statScore: { fontSize: 8, color: '#666' },
    statMod: { fontSize: 16, fontWeight: 'bold' },

    // Lists
    row: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
    profDot: {
        width: 6, height: 6, borderRadius: 3,
        borderWidth: 1, borderColor: '#000',
        marginRight: 4,
    },
    proficient: { backgroundColor: '#000' },
    skillLine: {
        borderBottomWidth: 0.5, borderBottomColor: '#CCC',
        flexDirection: 'row', alignItems: 'center', flex: 1, paddingBottom: 1,
    },

    // Combat
    combatGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    combatBox: {
        width: '30%', alignItems: 'center',
        borderWidth: 1, borderColor: '#000', borderRadius: 4, padding: 4,
    },
    largeVal: { fontSize: 14, fontWeight: 'bold' },

    // Text Areas
    textArea: {
        height: 100,
        borderWidth: 1, borderColor: '#EEE',
        padding: 5, fontSize: 8,
        marginBottom: 10,
    },

    // Spells
    spellRow: {
        flexDirection: 'row', alignItems: 'center',
        borderBottomWidth: 0.5, borderBottomColor: '#EEE',
        paddingVertical: 2,
    },
    spellLevelHeader: {
        fontSize: 12, fontWeight: 'bold',
        marginTop: 10, marginBottom: 5,
        borderBottomWidth: 1, borderBottomColor: '#000',
    },

    // Footer
    footer: {
        position: 'absolute', bottom: 20, left: 0, right: 0,
        textAlign: 'center', fontSize: 7, color: '#999',
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

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------
export const PDFDocument = ({ character }: { character: CharacterData }) => {
    const profBonus = Math.ceil(character.level / 4) + 1;

    // Calculate Modifiers
    const mods: Record<string, number> = {};
    const scores: Record<string, number> = {};

    ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].forEach(abil => {
        let base = character.abilityScores[abil as keyof AbilityScores] || 10;

        // Sum racial bonuses
        const raceBonus = character.race?.abilityScoreIncrease?.[abil as keyof AbilityScores] || 0;
        const subraceBonus = character.subrace?.abilityScoreIncrease?.[abil as keyof AbilityScores] || 0;

        base += raceBonus + subraceBonus;
        scores[abil] = base;
        mods[abil] = getModifier(base);
    });

    // Calculate Skill Mod
    const getSkillMod = (skill: string, abil: string) => {
        const isProf = character.background?.skillProficiencies?.includes(skill);
        return mods[abil] + (isProf ? profBonus : 0);
    };

    // Calculate Save Mod
    const getSaveMod = (abil: string) => {
        const isProf = character.class?.savingThrows?.includes(abil as any);
        return mods[abil] + (isProf ? profBonus : 0);
    };

    const Header = () => (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <Text style={styles.charName}>{character.name || 'Unnamed'}</Text>
            </View>
            <View style={styles.headerRight}>
                <View style={styles.headerField}><Text style={styles.label}>Class & Level</Text><Text style={styles.value}>{character.class?.name} {character.level}</Text></View>
                <View style={styles.headerField}><Text style={styles.label}>Background</Text><Text style={styles.value}>{character.background?.name}</Text></View>
                <View style={styles.headerField}><Text style={styles.label}>Race</Text><Text style={styles.value}>{character.race?.name}</Text></View>
                <View style={styles.headerField}><Text style={styles.label}>Alignment</Text><Text style={styles.value}>—</Text></View>
                <View style={styles.headerField}><Text style={styles.label}>Experience Points</Text><Text style={styles.value}>0</Text></View>
            </View>
        </View>
    );

    return (
        <Document>
            {/* ------------------------------------------------------------------ */}
            {/* PAGE 1: CORE STATS */}
            {/* ------------------------------------------------------------------ */}
            <Page size="A4" style={styles.page}>
                <Header />

                <View style={styles.grid3}>

                    {/* COL 1: Stats / Skills */}
                    <View style={styles.col1}>
                        {/* Ability Scores */}
                        {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map(abil => (
                            <View key={abil} style={styles.statBox}>
                                <Text style={{ fontSize: 7 }}>{abil}</Text>
                                <Text style={styles.statMod}>{formatMod(mods[abil])}</Text>
                                <Text style={styles.statScore}>{scores[abil]}</Text>
                            </View>
                        ))}

                        {/* Inspiration / Prof */}
                        <View style={styles.box}>
                            <View style={[styles.row, { justifyContent: 'space-between' }]}>
                                <Text style={{ fontSize: 8 }}>Inspiration</Text>
                                <View style={{ width: 15, height: 15, borderWidth: 1, borderColor: '#CCC' }} />
                            </View>
                            <View style={[styles.row, { justifyContent: 'space-between', marginTop: 4 }]}>
                                <Text style={{ fontSize: 8 }}>Proficiency</Text>
                                <Text style={{ fontWeight: 'bold' }}>+{profBonus}</Text>
                            </View>
                        </View>

                        {/* Saves */}
                        <View style={styles.box}>
                            <Text style={styles.boxTitle}>Saving Throws</Text>
                            {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map(abil => {
                                const isProf = character.class?.savingThrows?.includes(abil as any);
                                return (
                                    <View key={abil} style={styles.row}>
                                        <View style={[styles.profDot, isProf ? styles.proficient : {}]} />
                                        <Text style={{ fontSize: 8, width: 15 }}>{formatMod(getSaveMod(abil))}</Text>
                                        <Text style={{ fontSize: 7 }}>{abil}</Text>
                                    </View>
                                );
                            })}
                        </View>

                        {/* Skills */}
                        <View style={styles.box}>
                            <Text style={styles.boxTitle}>Skills</Text>
                            {SKILLS.map(skill => {
                                const isProf = character.background?.skillProficiencies?.includes(skill.name);
                                return (
                                    <View key={skill.name} style={styles.row}>
                                        <View style={[styles.profDot, isProf ? styles.proficient : {}]} />
                                        <Text style={{ fontSize: 8, width: 15 }}>{formatMod(getSkillMod(skill.name, skill.ab))}</Text>
                                        <Text style={{ fontSize: 6.5, color: '#444' }}>{skill.name} ({skill.ab})</Text>
                                    </View>
                                );
                            })}
                        </View>

                        <View style={{ borderWidth: 1, borderRadius: 10, padding: 5, flexDirection: 'row', alignItems: 'center', borderColor: '#CCC' }}>
                            <Text style={{ fontSize: 10, fontWeight: 'bold', marginRight: 5 }}>{10 + getSkillMod("Perception", "WIS")}</Text>
                            <Text style={{ fontSize: 7 }}>Passive Perception</Text>
                        </View>
                    </View>

                    {/* COL 2: Combat */}
                    <View style={styles.col2}>
                        <View style={styles.combatGrid}>
                            <View style={styles.combatBox}><Text style={styles.label}>Armor Class</Text><Text style={styles.largeVal}>{10 + mods['DEX']}</Text></View>
                            <View style={styles.combatBox}><Text style={styles.label}>Initiative</Text><Text style={styles.largeVal}>{formatMod(mods['DEX'])}</Text></View>
                            <View style={styles.combatBox}><Text style={styles.label}>Speed</Text><Text style={styles.largeVal}>{character.race?.speed || 30}</Text></View>
                        </View>

                        <View style={styles.box}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.label}>Hit Point Maximum</Text>
                                <Text style={{ fontSize: 10 }}>{/* Calc max HP roughly */}
                                    {(character.class?.hitDie || 8) + mods['CON'] + ((character.class?.hitDie || 8) / 2 + 1 + mods['CON']) * (character.level - 1)}
                                </Text>
                            </View>
                            <Text style={{ fontSize: 24, textAlign: 'center', marginVertical: 10, color: '#CCC' }}>Current HP</Text>
                        </View>

                        <View style={styles.box}><Text style={{ fontSize: 10, textAlign: 'center', color: '#CCC' }}>Temporary HP</Text></View>

                        <View style={{ flexDirection: 'row', gap: 5 }}>
                            <View style={[styles.box, { flex: 1 }]}>
                                <Text style={styles.boxTitle}>Hit Dice</Text>
                                <Text style={{ textAlign: 'center' }}>{character.level}d{character.class?.hitDie}</Text>
                            </View>
                            <View style={[styles.box, { flex: 1 }]}>
                                <Text style={styles.boxTitle}>Death Saves</Text>
                                <View style={{ padding: 2 }}><Text style={{ fontSize: 7 }}>Succ: O O O</Text><Text style={{ fontSize: 7 }}>Fail: O O O</Text></View>
                            </View>
                        </View>

                        <View style={[styles.box, { flex: 1 }]}>
                            <Text style={styles.boxTitle}>Attacks & Spellcasting</Text>
                            <View style={[styles.row, { borderBottomWidth: 1, marginBottom: 4 }]}>
                                <Text style={{ width: '40%', fontSize: 7, fontWeight: 'bold' }}>Name</Text>
                                <Text style={{ width: '25%', fontSize: 7, fontWeight: 'bold' }}>Atk Bonus</Text>
                                <Text style={{ width: '35%', fontSize: 7, fontWeight: 'bold' }}>Damage</Text>
                            </View>

                            {/* Melee */}
                            <View style={styles.row}>
                                <Text style={{ width: '40%', fontSize: 8 }}>Unarmed</Text>
                                <Text style={{ width: '25%', fontSize: 8 }}>{formatMod(mods['STR'] + profBonus)}</Text>
                                <Text style={{ width: '35%', fontSize: 8 }}>1 + {mods['STR']} B</Text>
                            </View>

                            {/* Cantrips */}
                            {character.selectedSpells?.filter(s => s.level === 0).slice(0, 4).map((spell, i) => (
                                <View key={i} style={styles.row}>
                                    <Text style={{ width: '40%', fontSize: 8 }}>{spell.name}</Text>
                                    <Text style={{ width: '25%', fontSize: 8 }}>
                                        {character.class?.spellcastingAbility ? formatMod(mods[character.class.spellcastingAbility] + profBonus) : '-'}
                                    </Text>
                                    <Text style={{ width: '35%', fontSize: 8 }}>{spell.school.substring(0, 3)}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.box}>
                            <Text style={styles.boxTitle}>Equipment</Text>
                            <Text style={{ fontSize: 8, color: '#666', fontStyle: 'italic', marginBottom: 2 }}>
                                See Page 2 for full inventory.
                            </Text>
                            {character.equipment?.slice(0, 5).map((item, i) => (
                                <Text key={i} style={{ fontSize: 7 }}>• {item.name}</Text>
                            ))}
                        </View>
                    </View>

                    {/* COL 3: Traits */}
                    <View style={styles.col3}>
                        <View style={styles.box}>
                            <Text style={styles.boxTitle}>Personality Traits</Text>
                            <Text style={{ fontSize: 8, minHeight: 30 }}>{character.personality?.traits || character.details?.personalityTraits || ''}</Text>
                        </View>
                        <View style={styles.box}>
                            <Text style={styles.boxTitle}>Ideals</Text>
                            <Text style={{ fontSize: 8, minHeight: 20 }}>{character.personality?.ideals || character.details?.ideals || ''}</Text>
                        </View>
                        <View style={styles.box}>
                            <Text style={styles.boxTitle}>Bonds</Text>
                            <Text style={{ fontSize: 8, minHeight: 20 }}>{character.personality?.bonds || character.details?.bonds || ''}</Text>
                        </View>
                        <View style={styles.box}>
                            <Text style={styles.boxTitle}>Flaws</Text>
                            <Text style={{ fontSize: 8, minHeight: 20 }}>{character.personality?.flaws || character.details?.flaws || ''}</Text>
                        </View>

                        <View style={[styles.box, { flex: 1 }]}>
                            <Text style={styles.boxTitle}>Features & Traits</Text>
                            {character.race?.traits?.map((t, i) => (
                                <View key={i} style={{ marginBottom: 4 }}>
                                    <Text style={{ fontSize: 8, fontWeight: 'bold' }}>{t.name}</Text>
                                    <Text style={{ fontSize: 7 }}>{t.description.substring(0, 100)}...</Text>
                                </View>
                            ))}
                            {character.class?.features?.filter(f => f.level <= character.level).map((f, i) => (
                                <View key={`c-${i}`} style={{ marginBottom: 4 }}>
                                    <Text style={{ fontSize: 8, fontWeight: 'bold' }}>{f.name}</Text>
                                    <Text style={{ fontSize: 7 }}>{f.description.substring(0, 100)}...</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
                <Text style={styles.footer}>Page 1 of {character.class?.spellcaster ? 3 : 2} • {character.name}</Text>
            </Page>

            {/* ------------------------------------------------------------------ */}
            {/* PAGE 2: DETAILS */}
            {/* ------------------------------------------------------------------ */}
            <Page size="A4" style={styles.page}>
                <Header />

                <Text style={[styles.boxTitle, { textAlign: 'left', paddingLeft: 5 }]}>Character Appearence</Text>
                <View style={[styles.row, { height: 150, marginBottom: 15 }]}>
                    <View style={{ flex: 1, borderWidth: 1, borderColor: '#EEE', marginRight: 10, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 10, color: '#CCC' }}>Character Portrait</Text>
                    </View>
                    <View style={{ flex: 2 }}>
                        <Text style={{ fontSize: 9 }}>{character.appearance || 'No description provided.'}</Text>
                    </View>
                </View>

                <Text style={[styles.boxTitle, { textAlign: 'left', paddingLeft: 5 }]}>Backstory</Text>
                <View style={styles.textArea}>
                    <Text>{character.backstory}</Text>
                </View>

                <Text style={[styles.boxTitle, { textAlign: 'left', paddingLeft: 5 }]}>Allies & Organizations</Text>
                <View style={[styles.textArea, { height: 80 }]}>
                    <Text>Name: ______________________</Text>
                    <Text>Symbol: ____________________</Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 15, flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.boxTitle, { textAlign: 'left', paddingLeft: 5 }]}>Additional Features & Traits</Text>
                        <View style={[styles.box, { flex: 1, borderStyle: 'dashed' }]}>
                            {/* Full descriptions of features if needed, for now simplified */}
                            {character.subclass?.features?.filter(f => f.level <= character.level).map((f, i) => (
                                <View key={i} style={{ marginBottom: 8 }}>
                                    <Text style={{ fontSize: 9, fontWeight: 'bold' }}>{f.name} ({character.subclass?.name})</Text>
                                    <Text style={{ fontSize: 8 }}>{f.description}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={[styles.boxTitle, { textAlign: 'left', paddingLeft: 5 }]}>Treasure & Equipment</Text>
                        <View style={[styles.box, { flex: 1 }]}>
                            {character.equipment?.map((item, i) => (
                                <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                                    <Text style={{ fontSize: 8 }}>{item.name}</Text>
                                    <Text style={{ fontSize: 8, color: '#666' }}>{item.cost?.amount}{item.cost?.currency}</Text>
                                </View>
                            ))}

                            <View style={{ marginTop: 20, borderTopWidth: 1, borderColor: '#EEE', paddingTop: 5 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 8, marginBottom: 5 }}>Currency</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <View style={styles.statBox}><Text style={{ fontSize: 6 }}>CP</Text><Text style={{ fontSize: 10 }}>0</Text></View>
                                    <View style={styles.statBox}><Text style={{ fontSize: 6 }}>SP</Text><Text style={{ fontSize: 10 }}>0</Text></View>
                                    <View style={styles.statBox}><Text style={{ fontSize: 6 }}>EP</Text><Text style={{ fontSize: 10 }}>0</Text></View>
                                    <View style={styles.statBox}><Text style={{ fontSize: 6 }}>GP</Text><Text style={{ fontSize: 10 }}>0</Text></View>
                                    <View style={styles.statBox}><Text style={{ fontSize: 6 }}>PP</Text><Text style={{ fontSize: 10 }}>0</Text></View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <Text style={styles.footer}>Page 2 of {character.class?.spellcaster ? 3 : 2} • {character.name}</Text>
            </Page>

            {/* ------------------------------------------------------------------ */}
            {/* PAGE 3: SPELLS (Conditional) */}
            {/* ------------------------------------------------------------------ */}
            {(character.class?.spellcaster || character.selectedSpells?.length > 0) && (
                <Page size="A4" style={styles.page}>
                    <Header />

                    <View style={[styles.box, { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, marginBottom: 20 }]}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.label}>Spellcasting Class</Text>
                            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{character.class?.name}</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.label}>Spellcasting Ability</Text>
                            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{character.class?.spellcastingAbility || 'INT'}</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.label}>Spell Save DC</Text>
                            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                                {character.class?.spellcastingAbility
                                    ? 8 + profBonus + mods[character.class.spellcastingAbility]
                                    : 10}
                            </Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.label}>Spell Attack Bonus</Text>
                            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                                {character.class?.spellcastingAbility
                                    ? formatMod(profBonus + mods[character.class.spellcastingAbility])
                                    : '+0'}
                            </Text>
                        </View>
                    </View>

                    {/* Cantrips */}
                    <View style={{ marginBottom: 15 }}>
                        <Text style={styles.spellLevelHeader}>Cantrips (0 Level)</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                            {character.selectedSpells?.filter(s => s.level === 0).map((spell, i) => (
                                <View key={i} style={{ width: '30%', marginBottom: 5 }}>
                                    <Text style={{ fontSize: 9 }}>• {spell.name}</Text>
                                </View>
                            ))}
                            {(!character.selectedSpells?.some(s => s.level === 0)) && <Text style={{ fontSize: 9, color: '#999' }}>No cantrips known.</Text>}
                        </View>
                    </View>

                    {/* Spells 1-9 */}
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => {
                        const spells = character.selectedSpells?.filter(s => s.level === level) || [];
                        if (spells.length === 0) return null; // Only show levels with spells selected

                        return (
                            <View key={level} style={{ marginBottom: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#000', marginBottom: 5 }}>
                                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Level {level}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 8, marginRight: 5 }}>Slots Total:</Text>
                                        <View style={{ width: 30, height: 15, borderWidth: 1, borderColor: '#000' }} />
                                        <Text style={{ fontSize: 8, marginHorizontal: 5 }}>Expended:</Text>
                                        <View style={{ width: 60, height: 15, borderWidth: 1, borderColor: '#000' }} />
                                    </View>
                                </View>

                                {spells.map((spell, i) => (
                                    <View key={i} style={styles.spellRow}>
                                        <View style={{ width: 10, height: 10, borderWidth: 1, borderColor: '#CCC', marginRight: 8, borderRadius: 5 }} />
                                        <Text style={{ fontSize: 9, fontWeight: 'bold', width: '30%' }}>{spell.name}</Text>
                                        <Text style={{ fontSize: 8, width: '20%' }}>{spell.school}</Text>
                                        <Text style={{ fontSize: 8, width: '20%' }}>{spell.castingTime}</Text>
                                        <Text style={{ fontSize: 8, width: '25%' }}>{spell.duration}</Text>
                                    </View>
                                ))}
                            </View>
                        );
                    })}

                    <Text style={styles.footer}>Page 3 of 3 • {character.name}</Text>
                </Page>
            )}

        </Document>
    );
};
