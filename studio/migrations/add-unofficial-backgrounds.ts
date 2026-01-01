/**
 * Migration script to add unofficial 2024 backgrounds to Sanity
 * 
 * Usage:
 * cd studio
 * SANITY_AUTH_TOKEN=xxx npx sanity exec migrations/add-unofficial-backgrounds.ts --with-user-token
 */

import { createClient } from '@sanity/client';

const client = createClient({
    projectId: 'ylk0tk34',
    dataset: 'production',
    useCdn: false,
    token: process.env.SANITY_AUTH_TOKEN,
    apiVersion: '2024-01-01',
});

function toSanityId(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

interface BackgroundDef {
    name: string;
    feature: string;
    featureDesc?: string;
    skills: string[];
}

// All unofficial 2024 backgrounds
const BACKGROUNDS: BackgroundDef[] = [
    // A - C
    { name: 'Aberrant Heir', feature: 'Feat: Aberrant Dragonmark', skills: ['History', 'Intimidation'] },
    { name: 'Anthropologist', feature: 'Adept Linguist', skills: ['Insight', 'Religion'] },
    { name: 'Archaeologist', feature: 'Historical Knowledge', skills: ['History', 'Survival'] },
    { name: 'Artisan', feature: 'Feat: Crafter', skills: ['Investigation', 'Persuasion'] },
    { name: 'Astral Drifter', feature: 'Divine Contact', skills: ['Insight', 'Religion'] },
    { name: 'Athlete', feature: 'Echoes of Victory', skills: ['Athletics', 'Acrobatics'] },
    { name: 'Azorius Functionary', feature: 'Legal Authority', skills: ['Insight', 'Intimidation'] },
    { name: 'Boros Legionnaire', feature: 'Legion Station', skills: ['Athletics', 'Intimidation'] },
    { name: 'Carouser', feature: 'Feat: Tireless Reveler', skills: ['Persuasion', 'Deception'] },
    { name: "Celebrity Adventurer's Scion", feature: 'Name Dropping', skills: ['Perception', 'Performance'] },
    { name: 'Chondathan Freebooter', feature: 'Feat: Skilled', skills: ['Athletics', 'Sleight of Hand'] },
    { name: 'City Watch', feature: "Watcher's Eye", skills: ['Athletics', 'Investigation'] },
    { name: 'Clan Crafter', feature: 'Respect of the Stout Folk', skills: ['History', 'Insight'] },
    { name: 'Cloistered Scholar', feature: 'Library Access', skills: ['History', 'Arcana'] },
    { name: 'Courtier', feature: 'Court Functionary', skills: ['Insight', 'Persuasion'] },

    // D - G
    { name: 'Dead Magic Dweller', feature: 'Feat: Healer', skills: ['Medicine', 'Survival'] },
    { name: 'Dimir Operative', feature: 'False Identity', skills: ['Deception', 'Stealth'] },
    { name: 'Dragon Cultist', feature: 'Feat: Cult of the Dragon Initiate', skills: ['Deception', 'Stealth'] },
    { name: 'Emerald Enclave Caretaker', feature: 'Feat: Emerald Enclave Fledgling', skills: ['Nature', 'Survival'] },
    { name: 'Faceless', feature: 'Dual Personalities', skills: ['Deception', 'Intimidation'] },
    { name: 'Faction Agent', feature: 'Safe Haven', skills: ['Insight', 'Investigation'] },
    { name: 'Failed Merchant', feature: 'Supply Chain', skills: ['Investigation', 'Persuasion'] },
    { name: 'Far Traveler', feature: 'All Eyes on You', skills: ['Insight', 'Perception'] },
    { name: 'Farmer', feature: 'Feat: Tough', skills: ['Animal Handling', 'Nature'] },
    { name: 'Feylost', feature: 'Feywild Connection', skills: ['Deception', 'Survival'] },
    { name: 'Fisher', feature: 'Harvest the Water', skills: ['History', 'Survival'] },
    { name: 'Flaming Fist Mercenary', feature: 'Feat: Tough', skills: ['Intimidation', 'Perception'] },
    { name: 'Gambler', feature: 'Never Tell Me the Odds', skills: ['Deception', 'Insight'] },
    { name: 'Gate Warden', feature: 'Planar Infusion', skills: ['Persuasion', 'Survival'] },
    { name: 'Genie Touched', feature: 'Feat: Magic Initiate (Wizard)', skills: ['Perception', 'Persuasion'] },
    { name: 'Giant Foundling', feature: 'Strike of the Giants', skills: ['Intimidation', 'Survival'] },
    { name: 'Gladiator', feature: 'By Popular Demand', skills: ['Acrobatics', 'Performance'] },
    { name: 'Golgari Agent', feature: 'Undercity Paths', skills: ['Nature', 'Survival'] },
    { name: 'Gruul Anarch', feature: 'Rubblebelt Refuge', skills: ['Animal Handling', 'Athletics'] },
    { name: 'Guard', feature: 'Feat: Alert', skills: ['Athletics', 'Perception'] },
    { name: 'Guide', feature: 'Feat: Magic Initiate (Druid)', skills: ['Stealth', 'Survival'] },

    // H - I
    { name: 'Harper', feature: 'Feat: Harper Agent', skills: ['Performance', 'Sleight of Hand'] },
    { name: 'House Agent', feature: 'House Connections', skills: ['Investigation', 'Persuasion'] },
    { name: 'House Cannith Heir', feature: 'Feat: Mark of Making', skills: ['Investigation', 'Sleight of Hand'] },
    { name: 'House Deneith Heir', feature: 'Feat: Mark of Sentinel', skills: ['Insight', 'Perception'] },
    { name: 'House Ghallanda Heir', feature: 'Feat: Mark of Hospitality', skills: ['Insight', 'Persuasion'] },
    { name: 'House Jorasco Heir', feature: 'Feat: Mark of Healing', skills: ['Medicine', 'Stealth'] },
    { name: 'House Kundarak Heir', feature: 'Feat: Mark of Warding', skills: ['Arcana', 'Investigation'] },
    { name: 'House Lyrandar Heir', feature: 'Feat: Mark of Storm', skills: ['Acrobatics', 'Nature'] },
    { name: 'House Medani Heir', feature: 'Feat: Mark of Detection', skills: ['Insight', 'Investigation'] },
    { name: 'House Orien Heir', feature: 'Feat: Mark of Passage', skills: ['Acrobatics', 'Athletics'] },
    { name: 'House Phiarlan Heir', feature: 'Feat: Mark of Shadow', skills: ['Deception', 'Stealth'] },
    { name: 'House Sivis Heir', feature: 'Feat: Mark of Scribing', skills: ['History', 'Perception'] },
    { name: 'House Tharashk Heir', feature: 'Feat: Mark of Finding', skills: ['Perception', 'Survival'] },
    { name: 'House Thuranni Heir', feature: 'Feat: Mark of Shadow', skills: ['Performance', 'Stealth'] },
    { name: 'House Vadalis Heir', feature: 'Feat: Mark of Handling', skills: ['Animal Handling', 'Nature'] },
    { name: 'Ice Fisher', feature: 'Feat: Alert', skills: ['Animal Handling', 'Athletics'] },
    { name: 'Inheritor', feature: 'Inheritance', skills: ['Survival', 'History'] },
    { name: 'Inquisitive', feature: 'Feat: Alert', skills: ['Insight', 'Investigation'] },
    { name: 'Investigator', feature: 'Official Inquiry', skills: ['Investigation', 'Insight'] },
    { name: 'Izzet Engineer', feature: 'Urban Infrastructure', skills: ['Arcana', 'Investigation'] },

    // K - M
    { name: 'Knight', feature: 'Retainers', skills: ['History', 'Persuasion'] },
    { name: 'Knight of Solamnia', feature: 'Squire of Solamnia', skills: ['Athletics', 'Survival'] },
    { name: 'Knight of the Gauntlet', feature: 'Feat: Tyro of the Gauntlet', skills: ['Athletics', 'Medicine'] },
    { name: 'Knight of the Order', feature: 'Knightly Regard', skills: ['Persuasion', 'History'] },
    { name: "Lords' Alliance Vassal", feature: "Feat: Lords' Alliance Agent", skills: ['Insight', 'Persuasion'] },
    { name: 'Lorehold Student', feature: 'Lorehold Initiate', skills: ['History', 'Religion'] },
    { name: 'Lorwyn Expert', feature: 'Feat: Child of the Sun', skills: ['Athletics', 'Nature'] },
    { name: 'Mage of High Sorcery', feature: 'Initiate of High Sorcery', skills: ['Arcana', 'History'] },
    { name: 'Marine', feature: 'Steady', skills: ['Athletics', 'Survival'] },
    { name: 'Mercenary Veteran', feature: 'Mercenary Life', skills: ['Athletics', 'Persuasion'] },
    { name: 'Merchant', feature: 'Feat: Lucky', skills: ['Animal Handling', 'Persuasion'] },
    { name: 'Moonwell Pilgrim', feature: 'Feat: Magic Initiate (Druid)', skills: ['Nature', 'Performance'] },
    { name: 'Mulhorandi Tomb Raider', feature: 'Feat: Lucky', skills: ['Investigation', 'Religion'] },
    { name: 'Mythalkeeper', feature: 'Feat: Crafter', skills: ['Arcana', 'History'] },

    // O - R
    { name: 'Orzhov Representative', feature: 'Leverage', skills: ['Intimidation', 'Religion'] },
    { name: 'Pirate', feature: 'Bad Reputation', skills: ['Athletics', 'Perception'] },
    { name: 'Plaintiff', feature: 'Legalese', skills: ['Medicine', 'Persuasion'] },
    { name: 'Planar Philosopher', feature: 'Conviction', skills: ['Arcana', 'Persuasion'] },
    { name: 'Prismari Student', feature: 'Prismari Initiate', skills: ['Acrobatics', 'Performance'] },
    { name: 'Purple Dragon Squire', feature: 'Feat: Purple Dragon Rook', skills: ['Animal Handling', 'Insight'] },
    { name: 'Quandrix Student', feature: 'Quandrix Initiate', skills: ['Arcana', 'Nature'] },
    { name: 'Rakdos Cultist', feature: 'Fearsome Reputation', skills: ['Acrobatics', 'Performance'] },
    { name: 'Rashemi Wanderer', feature: 'Feat: Tough', skills: ['Intimidation', 'Perception'] },
    { name: 'Rewarded', feature: "Fortune's Favor", skills: ['Insight', 'Persuasion'] },
    { name: 'Rival Intern', feature: 'Inside Informant', skills: ['History', 'Investigation'] },
    { name: 'Ruined', feature: 'Still Standing', skills: ['Stealth', 'Survival'] },
    { name: 'Rune Carver', feature: 'Rune Shaper', skills: ['History', 'Perception'] },

    // S - Z
    { name: 'Scribe', feature: 'Feat: Skilled', skills: ['Investigation', 'Perception'] },
    { name: 'Selesnya Initiate', feature: "Conclave's Shelter", skills: ['Nature', 'Persuasion'] },
    { name: 'Shadowmasters Exile', feature: 'Feat: Savage Attacker', skills: ['Acrobatics', 'Stealth'] },
    { name: 'Shadowmoor Expert', feature: 'Feat: Shadowmoor Hexer', skills: ['Acrobatics', 'Deception'] },
    { name: 'Shipwright', feature: "I'll Patch It!", skills: ['History', 'Perception'] },
    { name: 'Silverquill Student', feature: 'Silverquill Initiate', skills: ['Intimidation', 'Persuasion'] },
    { name: 'Simic Scientist', feature: 'Researcher', skills: ['Arcana', 'Medicine'] },
    { name: 'Smuggler', feature: 'Down Low', skills: ['Athletics', 'Deception'] },
    { name: 'Spellfire Initiate', feature: 'Feat: Spellfire Spark', skills: ['Arcana', 'Perception'] },
    { name: 'Urban Bounty Hunter', feature: 'Ear to the Ground', skills: ['Stealth', 'Insight'] },
    { name: 'Uthgardt Tribe Member', feature: 'Uthgardt Heritage', skills: ['Athletics', 'Survival'] },
    { name: 'Vampire Devotee', feature: "Feat: Vampire's Plaything", skills: ['Persuasion', 'Stealth'] },
    { name: 'Vampire Survivor', feature: 'Feat: Vampire Hunter', skills: ['Insight', 'Religion'] },
    { name: 'Waterdhavian Noble', feature: 'Kept in Style', skills: ['History', 'Persuasion'] },
    { name: 'Wayfarer', feature: 'Feat: Lucky', skills: ['Insight', 'Stealth'] },
    { name: 'Wildspacer', feature: 'Wildspace Adaptation', skills: ['Athletics', 'Survival'] },
    { name: 'Witchlight Hand', feature: 'Carnival Fixture', skills: ['Performance', 'Sleight of Hand'] },
    { name: 'Witherbloom Student', feature: 'Witherbloom Initiate', skills: ['Nature', 'Survival'] },
    { name: 'Zhentarim Mercenary', feature: 'Feat: Zhentarim Ruffian', skills: ['Intimidation', 'Perception'] },
];

// Generate descriptions based on name
function generateDescription(bg: BackgroundDef): string {
    const descriptions: Record<string, string> = {
        'Aberrant Heir': 'You bear an aberrant dragonmark, a twisted magical sigil that grants you strange powers but marks you as an outsider among the dragonmarked houses.',
        'Anthropologist': 'You have spent years studying the cultures and customs of distant lands, learning to adapt to any society you encounter.',
        'Archaeologist': 'You have delved into ancient ruins and unearthed relics of civilizations long forgotten, gaining expertise in historical artifacts.',
        'Artisan': 'You are a skilled craftsperson who takes pride in creating items of quality and beauty with your own hands.',
        'Astral Drifter': 'You have traveled the Astral Plane, experiencing the timeless void between worlds and gaining divine insight.',
        'Athlete': 'You are a trained competitor who has dedicated your life to physical excellence and sporting achievement.',
        'Azorius Functionary': 'You serve the Azorius Senate, upholding law and order through bureaucratic precision and legal authority.',
        'Boros Legionnaire': 'You are a soldier of the Boros Legion, sworn to protect the innocent and punish the wicked.',
        'Carouser': 'You are the life of every party, a social butterfly who thrives on revelry and making connections over drinks.',
        "Celebrity Adventurer's Scion": 'You are the child of a famous adventurer, and their reputation precedes you wherever you go.',
        'Chondathan Freebooter': 'You hail from the Sword Coast, where you learned to survive by your wits and quick hands.',
        'City Watch': 'You served as a guard or investigator in a city, learning to spot trouble and maintain order.',
        'Clan Crafter': 'You trained among dwarven artisans, earning their respect through dedication to your craft.',
        'Cloistered Scholar': 'You spent years in a library or university, gaining access to vast stores of knowledge.',
        'Courtier': 'You navigated the treacherous politics of noble courts, learning to read people and influence decisions.',
        'Dead Magic Dweller': 'You grew up in a region where magic does not function, learning to rely on mundane skills.',
        'Dimir Operative': 'You serve House Dimir, the guild of secrets, gathering information through deception and stealth.',
        'Dragon Cultist': 'You once served in the Cult of the Dragon, learning dark secrets before escaping or being cast out.',
        'Emerald Enclave Caretaker': 'You work with the Emerald Enclave to protect the natural world from those who would harm it.',
        'Faceless': 'You maintain a secret identity, hiding your true self beneath a carefully crafted persona.',
        'Faction Agent': 'You serve a powerful faction, carrying out their agenda across the land.',
        'Failed Merchant': 'Your business venture collapsed, but you learned valuable lessons about trade and negotiation.',
        'Far Traveler': 'You come from a distant land, and your exotic ways draw attention wherever you go.',
        'Farmer': 'You worked the land, developing resilience through hard labor and connection to the earth.',
        'Feylost': 'You spent time lost in the Feywild, and its magic has left its mark upon you.',
        'Fisher': 'You made your living from the waters, learning patience and the ways of aquatic life.',
        'Flaming Fist Mercenary': 'You served with the Flaming Fist, the renowned mercenary company of Baldur\'s Gate.',
        'Gambler': 'You live for the thrill of chance, reading odds and bluffing your way through life.',
        'Gate Warden': 'You guard portals to other planes, blessed with extraplanar energy from your duties.',
        'Genie Touched': 'A genie has blessed you with magical aptitude, granting you arcane potential.',
        'Giant Foundling': 'You were raised among giants or in their shadow, learning their ways and gaining their favor.',
        'Gladiator': 'You fought for entertainment in the arena, winning fame through combat prowess.',
        'Golgari Agent': 'You serve the Golgari Swarm, working in the undercity where death feeds new life.',
        'Gruul Anarch': 'You belong to the Gruul Clans, embracing primal chaos and rejecting civilization.',
        'Guard': 'Your vigilant nature was honed through years of keeping watch over people and places.',
        'Guide': 'You know the wilderness like the back of your hand and help others navigate dangerous terrain.',
        'Harper': 'You work with the Harpers, a network of spies dedicated to promoting good across the land.',
        'House Agent': 'You serve one of the dragonmarked houses, leveraging their connections for your missions.',
        'House Cannith Heir': 'You bear the Mark of Making, granting you exceptional crafting abilities.',
        'House Deneith Heir': 'You bear the Mark of Sentinel, granting you protective abilities.',
        'House Ghallanda Heir': 'You bear the Mark of Hospitality, granting you abilities related to comfort and sustenance.',
        'House Jorasco Heir': 'You bear the Mark of Healing, granting you restorative abilities.',
        'House Kundarak Heir': 'You bear the Mark of Warding, granting you protective abilities.',
        'House Lyrandar Heir': 'You bear the Mark of Storm, granting you weather-related abilities.',
        'House Medani Heir': 'You bear the Mark of Detection, granting you enhanced perception.',
        'House Orien Heir': 'You bear the Mark of Passage, granting you enhanced mobility.',
        'House Phiarlan Heir': 'You bear the Mark of Shadow, granting you abilities of stealth and illusion.',
        'House Sivis Heir': 'You bear the Mark of Scribing, granting you abilities related to communication.',
        'House Tharashk Heir': 'You bear the Mark of Finding, granting you tracking abilities.',
        'House Thuranni Heir': 'You bear the Mark of Shadow, granting you abilities of stealth and performance.',
        'House Vadalis Heir': 'You bear the Mark of Handling, granting you abilities with animals.',
        'Ice Fisher': 'You made your living fishing in frozen waters, developing alertness to survive the harsh conditions.',
        'Inheritor': 'You have inherited something of great value—an item, a title, or a destiny.',
        'Inquisitive': 'Your keen mind and attention to detail make you an excellent detective and investigator.',
        'Investigator': 'You have authority to conduct official investigations, opening doors others cannot.',
        'Izzet Engineer': 'You work with the Izzet League, combining magic and science in explosive ways.',
        'Knight': 'You are a knight, sworn to a code of honor and attended by loyal retainers.',
        'Knight of Solamnia': 'You are training to become a Knight of Solamnia, upholding the Measure and the Oath.',
        'Knight of the Gauntlet': 'You serve the Order of the Gauntlet, fighting evil with martial prowess.',
        'Knight of the Order': 'You belong to a knightly order, gaining respect and recognition from its members.',
        "Lords' Alliance Vassal": 'You serve the Lords\' Alliance, working to maintain peace between civilized nations.',
        'Lorehold Student': 'You study at Strixhaven\'s Lorehold college, exploring history through magic.',
        'Lorwyn Expert': 'You hail from the plane of Lorwyn, touched by its eternal daylight.',
        'Mage of High Sorcery': 'You are initiated into the Mages of High Sorcery, following one of the three moons.',
        'Marine': 'You served as a soldier aboard ships, learning to fight on rolling decks.',
        'Mercenary Veteran': 'You fought for coin, learning the brutal realities of war for hire.',
        'Merchant': 'You are a trader blessed with good fortune in your business dealings.',
        'Moonwell Pilgrim': 'You have visited the sacred moonwells, gaining druidic insight.',
        'Mulhorandi Tomb Raider': 'You explore the ancient tombs of Mulhorand, seeking treasure and knowledge.',
        'Mythalkeeper': 'You are trained in the creation and maintenance of mythals and other magical constructs.',
        'Orzhov Representative': 'You serve the Orzhov Syndicate, using debt and obligation as weapons.',
        'Pirate': 'You sailed the seas as a pirate, earning a fearsome reputation.',
        'Plaintiff': 'You have experience navigating legal systems and advocating for causes.',
        'Planar Philosopher': 'You study the planes and their interconnections, developing strong convictions.',
        'Prismari Student': 'You study at Strixhaven\'s Prismari college, expressing magic through art and motion.',
        'Purple Dragon Squire': 'You serve the Purple Dragons, Cormyr\'s elite military force.',
        'Quandrix Student': 'You study at Strixhaven\'s Quandrix college, exploring the mathematics of magic.',
        'Rakdos Cultist': 'You belong to the Cult of Rakdos, embracing chaos and dark entertainment.',
        'Rashemi Wanderer': 'You hail from Rashemen, toughened by its harsh climate and fierce traditions.',
        'Rewarded': 'Fortune has smiled upon you, granting you unexpected blessings.',
        'Rival Intern': 'You worked for a rival organization, gaining inside knowledge of their operations.',
        'Ruined': 'You lost everything but survived, emerging stronger from the devastation.',
        'Rune Carver': 'You have learned the ancient art of carving magical runes.',
        'Scribe': 'You are skilled in writing and research, able to find information others miss.',
        'Selesnya Initiate': 'You serve the Selesnya Conclave, seeking harmony with nature and community.',
        'Shadowmasters Exile': 'You were exiled from the Shadowmasters, but retain your combat training.',
        'Shadowmoor Expert': 'You hail from the plane of Shadowmoor, touched by its eternal twilight.',
        'Shipwright': 'You build and repair vessels, able to fix almost anything with the right materials.',
        'Silverquill Student': 'You study at Strixhaven\'s Silverquill college, wielding words as weapons.',
        'Simic Scientist': 'You work with the Simic Combine, researching the boundaries of life itself.',
        'Smuggler': 'You move contraband past authorities, knowing all the secret routes.',
        'Spellfire Initiate': 'You have been touched by spellfire, the raw essence of magic itself.',
        'Urban Bounty Hunter': 'You track quarry through city streets, knowing how to find anyone.',
        'Uthgardt Tribe Member': 'You belong to one of the Uthgardt barbarian tribes, following ancient traditions.',
        'Vampire Devotee': 'You serve a vampire willingly, gaining favor in exchange for your devotion.',
        'Vampire Survivor': 'You survived a vampire attack and dedicated yourself to hunting the undead.',
        'Waterdhavian Noble': 'You are a noble of Waterdeep, accustomed to wealth and influence.',
        'Wayfarer': 'You are a wanderer blessed with good fortune on your travels.',
        'Wildspacer': 'You have traveled the void between worlds, adapting to life in Wildspace.',
        'Witchlight Hand': 'You worked at the Witchlight Carnival, performing for wonderstruck audiences.',
        'Witherbloom Student': 'You study at Strixhaven\'s Witherbloom college, exploring life and death magic.',
        'Zhentarim Mercenary': 'You work with the Zhentarim, using ruthless methods to achieve your goals.',
    };
    return descriptions[bg.name] || `You have the ${bg.name} background, granting you unique skills and experiences.`;
}

// Generate feature description
function generateFeatureDesc(bg: BackgroundDef): string {
    if (bg.feature.startsWith('Feat:')) {
        return `You gain the ${bg.feature.replace('Feat: ', '')} feat as part of this background.`;
    }
    const featureDescs: Record<string, string> = {
        'Adept Linguist': 'You can communicate with humanoids who don\'t share your language through gestures and pantomime.',
        'Historical Knowledge': 'You have expertise in identifying the age and origins of ruins, cultures, and artifacts.',
        'Divine Contact': 'A god or powerful celestial has taken interest in you, occasionally providing guidance.',
        'Echoes of Victory': 'Your athletic achievements have earned you recognition and admiration.',
        'Legal Authority': 'You can invoke the law to gain cooperation from citizens and minor officials.',
        'Legion Station': 'You can find shelter at Boros outposts and gain assistance from Legion members.',
        'Name Dropping': 'Your famous parent\'s name opens doors and gains you favors.',
        "Watcher's Eye": 'You can easily spot signs of criminal activity and know the local criminal elements.',
        'Respect of the Stout Folk': 'Dwarves treat you as an honored friend and guest.',
        'Library Access': 'You have access to a library and can research there freely.',
        'Court Functionary': 'You understand the intricacies of noble courts and bureaucracies.',
        'False Identity': 'You have a second identity complete with documentation and contacts.',
        'Dual Personalities': 'You maintain two distinct personas that others believe are different people.',
        'Safe Haven': 'You can find a safe place to rest provided by your faction.',
        'Supply Chain': 'You know how to find goods and can get discounts from merchants.',
        'All Eyes on You': 'Your exotic appearance draws attention and curiosity.',
        'Feywild Connection': 'You can sense portals to the Feywild and fey creatures.',
        'Harvest the Water': 'You know how to find food and fresh water near bodies of water.',
        'Never Tell Me the Odds': 'You have an uncanny ability to size up games of chance.',
        'Planar Infusion': 'Exposure to planar energy has given you minor magical abilities.',
        'Strike of the Giants': 'You have learned to channel giant magic in your strikes.',
        'By Popular Demand': 'Your fame as a gladiator can gain you free lodging and favors.',
        'Undercity Paths': 'You know secret paths through the undercity and sewers.',
        'Rubblebelt Refuge': 'You can find shelter in the rubblebelt and gain help from Gruul members.',
        'House Connections': 'You can leverage your house\'s resources and contacts.',
        'Inheritance': 'You possess a valuable item or title that defines part of your identity.',
        'Official Inquiry': 'You can demand cooperation during investigations.',
        'Urban Infrastructure': 'You know the layout of cities and can find ways through buildings.',
        'Retainers': 'You have loyal servants who attend to your needs.',
        'Squire of Solamnia': 'You are training under the Knights of Solamnia.',
        'Knightly Regard': 'Members of your order recognize and respect you.',
        'Lorehold Initiate': 'You can summon minor spirits to help with historical research.',
        'Initiate of High Sorcery': 'You have been initiated into the magic of Krynn.',
        'Steady': 'You remain calm in dangerous situations aboard ships.',
        'Mercenary Life': 'You can find work and information in mercenary circles.',
        'Leverage': 'You can use debts and contracts as leverage over others.',
        'Bad Reputation': 'Your fearsome reputation causes people to avoid crossing you.',
        'Legalese': 'You can navigate legal systems and find loopholes.',
        'Conviction': 'Your philosophical beliefs grant you certainty in your actions.',
        'Prismari Initiate': 'You can create minor artistic magical effects.',
        'Quandrix Initiate': 'You can perform minor mathematical magic.',
        'Fearsome Reputation': 'Your association with Rakdos causes fear in others.',
        "Fortune's Favor": 'Good fortune seems to follow you wherever you go.',
        'Inside Informant': 'You have contacts who share information from your former employer.',
        'Still Standing': 'You\'ve survived disaster and can endure hardship.',
        'Rune Shaper': 'You can inscribe temporary magical runes.',
        "Conclave's Shelter": 'Selesnya members provide you with shelter and aid.',
        "I'll Patch It!": 'You can repair vehicles and structures with available materials.',
        'Silverquill Initiate': 'You can create minor magical effects with your words.',
        'Researcher': 'You know where to find information and who to ask.',
        'Down Low': 'You know smuggling routes and can move goods secretly.',
        'Ear to the Ground': 'You have contacts in the criminal underworld.',
        'Uthgardt Heritage': 'You can find shelter with Uthgardt tribes and invoke their traditions.',
        'Kept in Style': 'Your noble status provides you with comfortable lodging.',
        'Wildspace Adaptation': 'You can survive in the void of Wildspace.',
        'Carnival Fixture': 'You can gain free admission and aid at the Witchlight Carnival.',
        'Witherbloom Initiate': 'You can create minor life and death magical effects.',
    };
    return featureDescs[bg.feature] || `Feature: ${bg.feature}`;
}

async function migrateBackgrounds() {
    console.log('📚 Adding unofficial 2024 backgrounds to Sanity...\n');

    const transaction = client.transaction();
    let count = 0;

    for (const bg of BACKGROUNDS) {
        const doc = {
            _id: `background-${toSanityId(bg.name)}`,
            _type: 'background',
            name: bg.name,
            slug: { _type: 'slug', current: toSanityId(bg.name) },
            description: generateDescription(bg),
            source: 'Unofficial',
            edition: '2024',
            version: 1,
            skillProficiencies: bg.skills,
            feature: {
                name: bg.feature,
                description: generateFeatureDesc(bg),
            },
        };

        transaction.createOrReplace(doc as Parameters<typeof transaction.createOrReplace>[0]);
        count++;
    }

    console.log(`Prepared ${count} backgrounds for migration...`);
    console.log('\nCommitting to Sanity...');
    await transaction.commit();
    console.log(`\n✅ Successfully added ${count} unofficial backgrounds!`);
}

async function run() {
    console.log('🚀 Unofficial Backgrounds Migration (2024 Edition)');
    console.log('='.repeat(50) + '\n');

    try {
        await migrateBackgrounds();
        console.log('\n' + '='.repeat(50));
        console.log('🎉 Migration complete!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

run();
