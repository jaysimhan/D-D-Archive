import re
import os

filepath = "/Users/jaysimhan/Desktop/Works/D&D/d-and-d-gaming/src/data/mock-races.ts"

# Data dictionary: Race ID (partial match or exact) -> { Trait Name -> Description }
# Note: I'm mapping specific IDs from the file to these generic descriptions where applicable.

trait_data = {
    "aarakocra": {
        "Flight": "You have a flying speed of 50 feet. To use this speed, you can't be wearing medium or heavy armor.",
        "Talons": "Your talons are natural weapons, which you can use to make unarmed strikes. If you hit with them, you deal slashing damage equal to 1d4 + your Strength modifier, instead of the bludgeoning damage normal for an unarmed strike.",
        "Wind Caller": "Starting at 3rd level, you can cast the gust of wind spell with this trait, without requiring a material component. Once you cast that spell with this trait, you can't do so again until you finish a long rest. Constitution is your spellcasting ability for this spell."
    },
    "aasimar": {
        "Resistance": "You have resistance to necrotic damage and radiant damage.",
        "Celestial Legacy": "You know the light cantrip. Once you reach 3rd level, you can cast the lesser restoration spell once with this trait, and you regain the ability to do so when you finish a long rest. Once you reach 5th level, you can cast the daylight spell once with this trait as a 3rd-level spell, and you regain the ability to do so when you finish a long rest. Charisma is your spellcasting ability for these spells.",
        "Celestial Resistance": "You have resistance to necrotic damage and radiant damage.",
        "Darkvision": "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray.", # Already present often, but good to have
        "Radiant Soul": "Starting at 3rd level, you can use your action to unleash the divine energy within yourself, causing your eyes to glimmer and two luminous, incorporeal wings to sprout from your back. Your transformation lasts for 1 minute or until you end it as a bonus action. During it, you have a flying speed of 30 feet, and once on each of your turns, you can deal extra radiant damage to one target when you deal damage to it with an attack or a spell. The extra radiant damage equals your level.",
        "Light Bearer": "You know the Light cantrip. Charisma is your spellcasting ability for it.",
        "Necrotic Shroud": "Starting at 3rd level, you can use your action to unleash the divine energy within yourself, causing your eyes to turn into pools of darkness and two skeletal, ghostly, flightless wings to sprout from your back. The instant you transform, other creatures within 10 feet of you that can see you must each succeed on a Charisma saving throw (DC 8 + your proficiency bonus + your Charisma modifier) or become frightened of you until the end of your next turn. Your transformation lasts for 1 minute or until you end it as a bonus action. During it, once on each of your turns, you can deal extra necrotic damage to one target when you deal damage to it with an attack or a spell. The extra necrotic damage equals your level.",
        "Radiant Consumption": "Starting at 3rd level, you can use your action to unleash the divine energy within yourself, causing a searing light to radiate from you, pour out of your eyes and mouth, and threaten to char you. Your transformation lasts for 1 minute or until you end it as a bonus action. During it, you shed bright light in a 10-foot radius and dim light for an additional 10 feet, and at the end of each of your turns, you and each creature within 10 feet of you take radiant damage equal to half your level (rounded up). In addition, once on each of your turns, you can deal extra radiant damage to one target when you deal damage to it with an attack or a spell. The extra radiant damage equals your level.",
        "Healing Hands": "As an action, you can touch a creature and cause it to regain a number of hit points equal to your level. Once you use this trait, you can't use it again until you finish a long rest."
    },
    "bugbear": {
        "Surprise Attack": "If you surprise a creature and hit it with an attack on your first turn in combat, the attack deals an extra 2d6 damage to it. You can use this trait only once per combat.",
        "Powerful Build": "You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift.",
        "Long-Limbed": "When you make a melee attack on your turn, your reach for it is 5 feet greater than normal.",
        "Sneaky": "You are proficient in the Stealth skill.",
        "Fey Ancestry": "You have advantage on saving throws against being charmed, and magic can't put you to sleep."
    },
    "centaur": {
        "Fey Ancestry": "You have advantage on saving throws against being charmed, and magic can't put you to sleep.",
        "Charge": "If you move at least 30 feet straight toward a target and then hit it with a melee weapon attack on the same turn, you can immediately follow that attack with a bonus action to make one attack against the target with your hooves.",
        "Hooves": "Your hooves are natural melee weapons, which you can use to make unarmed strikes. If you hit with them, you deal bludgeoning damage equal to 1d4 + your Strength modifier, instead of the bludgeoning damage normal for an unarmed strike.",
        "Equine Build": "You count as one size larger when determining your carrying capacity and the weight you can push or drag. In addition, any climb that requires hands and feet is especially difficult for you because of your equine legs. When you make such a climb, each foot of movement costs you 4 extra feet, instead of the normal 1 extra foot.",
        "Survivor": "You have proficiency in one of the following skills of your choice: Animal Handling, Medicine, Nature, or Survival."
    },
    "changeling": {
        "Shapechanger": "As an action, you can change your appearance and your voice. You determine the specifics of the changes, including your coloration, hair length, and sex. You can also adjust your height and weight, but not so much that your size changes. You can make yourself appear as a member of another race, though none of your game statistics change. You can't duplicate the appearance of a creature you've never seen, and you must adopt a form that has the same basic arrangement of limbs that you have. Your clothing and equipment aren't changed by this trait. You stay in the new form until you use an action to revert to your true form or until you die.",
        "Changeling Instincts": "You gain proficiency with two of the following skills of your choice: Deception, Insight, Intimidation, and Persuasion."
    },
    "deep-gnome": {
        "Gnome Cunning": "You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.",
        "Svirfneblin Camouflage": "You have advantage on Dexterity (Stealth) checks to hide in rocky terrain.",
        "Stone Camouflage": "You have advantage on Dexterity (Stealth) checks to hide in rocky terrain." 
    },
    "dragonborn": {
        "Breath Weapon": "You can use your action to exhale destructive energy. Your draconic ancestry determines the size, shape, and damage type of the exhalation. When you use your breath weapon, each creature in the area of the exhalation must make a saving throw, the type of which is determined by your draconic ancestry. The DC for this saving throw equals 8 + your Constitution modifier + your proficiency bonus. A creature takes 2d6 damage on a failed save, and half as much damage on a successful one. The damage increases to 3d6 at 6th level, 4d6 at 11th level, and 5d6 at 16th level. After you use your breath weapon, you can't use it again until you complete a short or long rest.",
        "Damage Resistance": "You have resistance to the damage type associated with your draconic ancestry.",
        "Draconic Ancestry": "You have draconic ancestry. Choose one type of dragon from the Draconic Ancestry table. Your breath weapon and damage resistance are determined by the dragon type, as shown in the table."
    },
    "duergar": {
        "Psionic Fortitude": "You have advantage on saving throws you make to avoid or end the charmed or stunned condition on yourself.",
        "Duergar Magic": "Starting at 3rd level, you can cast the enlarge/reduce spell on yourself once with this trait, using only the spell's enlarge option. When you reach 5th level, you can cast the invisibility spell on yourself once with this trait. You don't need material components for either spell, and you can't cast them while you're distinct sunlight, although they do effectively turn you invisible. You regain the ability to cast these spells with this trait when you finish a long rest. Intelligence is your spellcasting ability for these spells.",
        "Sunlight Sensitivity": "You have disadvantage on attack rolls and Wisdom (Perception) checks that rely on sight when you, the target of your attack, or whatever you are trying to perceive is in direct sunlight." 
    },
    "dwarf": {
        "Dwarven Resilience": "You have advantage on saving throws against poison, and you have resistance against poison damage.",
        "Dwarven Combat Training": "You have proficiency with the battleaxe, handaxe, light hammer, and warhammer.",
        "Dwarven Toughness": "Your hit point maximum increases by 1, and it increases by 1 every time you gain a level."
    },
    "eladrin": {
        "Fey Step": "As a bonus action, you can magically teleport up to 30 feet to an unoccupied space you can see. Once you use this trait, you can't do so again until you finish a short or long rest."
    },
    "firbolg": {
        "Firbolg Magic": "You can cast detect magic and disguise self with this trait, using Wisdom as your spellcasting ability for them. Once you cast either spell, you can't cast it again with this trait until you finish a short or long rest. When you use this version of disguise self, you can seem up to 3 feet shorter than you are, allowing you to more easily blend in with humans and elves.",
        "Hidden Step": "As a bonus action, you can magically turn invisible until the start of your next turn or until you attack, make a damage roll, or force someone to make a saving throw. Once you use this trait, you can't use it again until you finish a short or long rest.",
        "Powerful Build": "You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift.",
        "Speech of Beast and Leaf": "You have the ability to communicate in a limited manner with beasts and plants. They can understand the meaning of your words, though you have no special ability to understand them in return. You have advantage on all Charisma checks you make to influence them."
    },
    "genasi": {
         "Unending Breath": "You can hold your breath indefinitely while you're not incapacitated.",
         "Mingle with the Wind": "You can cast the levitate spell once with this trait, requiring no material components, and you regain the ability to cast it this way when you finish a long rest. Constitution is your spellcasting ability for this spell.",
         "Earth Walk": "You can move across difficult terrain made of earth or stone without expending extra movement.",
         "Merge with Stone": "You can cast the pass without trace spell once with this trait, requiring no material components, and you regain the ability to cast it this way when you finish a long rest. Constitution is your spellcasting ability for this spell.",
         "Reach to the Blaze": "You know the produce flame cantrip. When you reach 3rd level, you can cast the burning hands spell once with this trait as a 1st-level spell, and you regain the ability to cast it this way when you finish a long rest. Constitution is your spellcasting ability for these spells.",
         "Call to the Wave": "You know the shape water cantrip. When you reach 3rd level, you can cast the create or destroy water spell as a 2nd-level spell once with this trait, and you regain the ability to cast it this way when you finish a long rest. Constitution is your spellcasting ability for these spells.",
         "Acid Resistance": "You have resistance to acid damage.",
         "Fire Resistance": "You have resistance to fire damage.",
         "Amphibious": "You can breathe air and water." 
    },
    "gnome": {
        "Gnome Cunning": "You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.",
        "Natural Illusionist": "You know the minor illusion cantrip. Intelligence is your spellcasting ability for it.",
        "Speak with Small Beasts": "Through sounds and gestures, you can communicate simple ideas with Small or smaller beasts. Forest gnomes love animals and often keep squirrels, badgers, rabbits, moles, woodpeckers, and other creatures as beloved pets.",
        "Artificer's Lore": "Whenever you make an Intelligence (History) check related to magic items, alchemical objects, or technological devices, you can add twice your proficiency bonus, instead of any proficiency bonus you normally apply.",
        "Tinker": "You have proficiency with artisan's tools (tinker's tools). Using those tools, you can spend 1 hour and 10 gp worth of materials to construct a Tiny clockwork device (AC 5, 1 hp). The device ceases to function after 24 hours (unless you spend 1 hour repairing it to keep the device functioning), or when you use your action to dismantle it; at that time, you can reclaim the materials used to create it. You can have up to three such devices active at a time."
    },
    "goblin": {
        "Nimble Escape": "You can take the Disengage or Hide action as a bonus action on each of your turns.",
        "Fury of the Small": "When you damage a creature with an attack or a spell and the creature's size is larger than yours, you can cause the attack or spell to deal extra damage to the creature. The extra damage equals your level. Once you use this trait, you can't use it again until you finish a short or long rest."
    },
    "goliath": {
        "Natural Athlete": "You have proficiency in the Athletics skill.",
        "Stone's Endurance": "You can focus yourself to occasionally shrug off injury. When you take damage, you can use your reaction to roll a d12. Add your Constitution modifier to the number rolled, and reduce the damage by that total. After you use this trait, you can't use it again until you finish a short or long rest.",
        "Powerful Build": "You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift.",
        "Mountain Born": "You have resistance to cold damage. You're also acclimated to high altitude, including elevations above 20,000 feet.",
        "Stone": "You can focus yourself to occasionally shrug off injury. When you take damage, you can use your reaction to roll a d12. Add your Constitution modifier to the number rolled, and reduce the damage by that total. After you use this trait, you can't use it again until you finish a short or long rest." # Mapping 'Stone' to Stone's Endurance description as fallback
    },
    "half-elf": {
        "Skill Versatility": "You gain proficiency in two skills of your choice."
    },
    "half-orc": {
        "Menacing": "You gain proficiency in the Intimidation skill.",
        "Relentless Endurance": "When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. You can't use this feature again until you finish a long rest.",
        "Savage Attacks": "When you score a critical hit with a melee weapon attack, you can roll one of the weapon's damage dice one additional time and add it to the extra damage of the critical hit."
    },
    "halfling": {
        "Lucky": "When you roll a 1 on the d20 for an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.",
        "Brave": "You have advantage on saving throws against being frightened.",
        "Halfling Nimbleness": "You can move through the space of any creature that is of a size larger than yours.",
        "Nimbleness": "You can move through the space of any creature that is of a size larger than yours.",
        "Naturally Stealthy": "You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you.",
        "Stout Resilience": "You have advantage on saving throws against poison, and you have resistance against poison damage."
    },
    "hobgoblin": {
        "Martial Training": "You are proficient with two martial weapons of your choice and with light armor.",
        "Saving Face": "Hobgoblins are careful not to show weakness in front of their allies, for fear of losing status. If you miss with an attack roll or fail an ability check or a saving throw, you can gain a bonus to the roll equal to the number of allies you can see within 30 feet of you (maximum bonus of +5). Once you use this trait, you can't use it again until you finish a short or long rest."
    },
    "kenku": {
        "Expert Forgery": "You can duplicate other creatures' handwriting and craftwork. You have advantage on all checks made to produce forgeries or duplicates of existing objects.",
        "Kenku Training": "You are proficient in your choice of two of the following skills: Acrobatics, Deception, Stealth, and Sleight of Hand.",
        "Mimicry": "You can mimic sounds you have heard, including voices. A creature that hears the sounds you make can tell they are imitations with a successful Wisdom (Insight) check opposed by your Charisma (Deception) check."
    },
    "kobold": {
        "Grovel, Cower, and Beg": "As an action on your turn, you can cower pathetically to distract nearby foes. Until the end of your next turn, your allies gain advantage on attack rolls against enemies within 10 feet of you that can see you. Once you use this trait, you can't use it again until you finish a short or long rest.",
        "Pack Tactics": "You have advantage on an attack roll against a creature if at least one of your allies is within 5 feet of the creature and the ally isn't incapacitated.",
        "Sunlight Sensitivity": "You have disadvantage on attack rolls and on Wisdom (Perception) checks that rely on sight when you, the target of your attack, or whatever you are trying to perceive is in direct sunlight."
    },
    "lizardfolk": {
        "Bite": "Your fanged maw is a natural weapon, which you can use to make unarmed strikes. If you hit with it, you deal piercing damage equal to 1d6 + your Strength modifier, instead of the bludgeoning damage normal for an unarmed strike.",
        "Cunning Artisan": "As part of a short rest, you can harvest bone and hide from a slain beast, construct, dragon, monstrosity, or plant creature of size Small or larger to create one of the following items: a shield, a club, a javelin, or 1d4 darts or blowgun needles. To use this trait, you need a blade, such as a dagger, or appropriate artisan's tools, such as leatherworker's tools.",
        "Hold Breath": "You can hold your breath for up to 15 minutes at a time.",
        "Hunter": "You gain proficiency with two of the following skills of your choice: Animal Handling, Nature, Perception, Stealth, and Survival.",
        "Hunter's Lore": "You gain proficiency with two of the following skills of your choice: Animal Handling, Nature, Perception, Stealth, and Survival.",
        "Natural Armor": "You have tough, scaly skin. When you aren't wearing armor, your AC is 13 + your Dexterity modifier. You can use your natural armor to determine your AC if the armor you wear would leave you with a lower AC. A shield's benefits apply as normal while you use your natural armor.",
        "Hungry Jaws": "In battle, you can throw yourself into a vicious feeding frenzy. As a bonus action, you can make a special attack with your bite. If the attack hits, it deals its normal damage, and you gain temporary hit points (minimum of 1) equal to your Constitution modifier. You can use this trait a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest."
    },
    "orc": {
        "Aggressive": "As a bonus action, you can move up to your speed toward an enemy of your choice that you can see or hear. You must end this move closer to the enemy than you started.",
        "Primal Intuition": "You have proficiency in two of the following skills of your choice: Animal Handling, Insight, Intimidation, Medicine, Nature, Perception, and Survival.",
        "Powerful Build": "You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift."
    },
    "tabaxi": {
        "Feline Agility": "Your reflexes and agility allow you to move with a burst of speed. When you move on your turn in combat, you can double your speed until the end of the turn. Once you use this trait, you can't use it again until you move 0 feet on one of your turns.",
        "Cat's Claws": "Because of your claws, you have a climbing speed of 20 feet. In addition, your claws are natural weapons, which you can use to make unarmed strikes. If you hit with them, you deal slashing damage equal to 1d4 + your Strength modifier, instead of the bludgeoning damage normal for an unarmed strike.",
        "Cat's Talent": "You have proficiency in the Perception and Stealth skills.",
        "Cat": "You have proficiency in the Perception and Stealth skills." # Mapping 'Cat' to Cat's Talent
    },
    "tortle": {
        "Claws": "Your claws are natural weapons, which you can use to make unarmed strikes. If you hit with them, you deal slashing damage equal to 1d4 + your Strength modifier, instead of the bludgeoning damage normal for an unarmed strike.",
        "Hold Breath": "You can hold your breath for up to 1 hour at a time. Tortles aren't natural swimmers, but they can remain underwater for some time before needing to come up for air.",
        "Natural Armor": "Due to your shell and the shape of your body, you are ill-suited to wearing armor. Your shell provides ample protection, however; it gives you a base AC of 17 (your Dexterity modifier doesn't affect this number). You gain no benefit from wearing armor, but if you are using a shield, you can apply the shield's bonus as normal.",
        "Shell Defense": "You can withdraw into your shell as an action. Until you emerge, you gain a +4 bonus to AC, and you have advantage on Strength and Constitution saving throws. While in your shell, you are prone, your speed is 0 and can't increase, you have disadvantage on Dexterity saving throws, you can't take reactions, and the only action you can take is a bonus action to emerge from your shell.",
        "Survival Instinct": "You gain proficiency in the Survival skill."
    },
    "triton": {
        "Control Air and Water": "A child of the sea, you can call on the magic of air and water. You can cast fog cloud with this trait. Starting at 3rd level, you can cast gust of wind with it, and starting at 5th level, you can also cast wall of water with it. Once you cast a spell with this trait, you can't do so again until you finish a long rest. Charisma is your spellcasting ability for these spells.",
        "Emissary of the Sea": "Aquatic beasts have an extraordinary affinity with your people. You can communicate simple ideas with beasts that can breathe water. They can understand the meaning of your words, though you have no special ability to understand them in return.",
        "Guardians of the Depths": "Adapted to even the most extreme ocean depths, you have resistance to cold damage.",
        "Amphibious": "You can breathe air and water." 
    },
    "yuan-ti": {
        "Magic Resistance": "You have advantage on saving throws against spells and other magical effects.",
        "Poison Immunity": "You are immune to poison damage and the poisoned condition."
    }
}

# Helper to normalize keys
def normalize_key(race_id):
    # Strip suffixes like -1, -2, -pureblood, etc. to match generic keys
    # Fix for half-elf, half-orc
    lower_id = race_id.lower()
    if lower_id.startswith("half-elf"):
        return "half-elf"
    if lower_id.startswith("half-orc"):
        return "half-orc"
    if "genasi" in lower_id:
        return "genasi"
    
    base = lower_id.split('-')[0]
    return base


def update_file(filepath):
    print(f"Reading {filepath}...")
    with open(filepath, 'r') as f:
        lines = f.readlines()
        
    new_lines = []
    current_race_base = None
    
    # Simple regexes
    id_pattern = re.compile(r'^\s*(?:"id"|id)\s*:\s*["\']([^"\']+)["\']')
    name_pattern = re.compile(r'^\s*(?:"name"|name)\s*:\s*["\']([^"\']+)["\']')
    desc_pattern = re.compile(r'^\s*(?:"description"|description)\s*:\s*["\']See official documentation for details\.["\']')
    
    for line in lines:
        # Detect ID of race
        id_match = id_pattern.search(line)
        if id_match:
            current_race_id = id_match.group(1)
            current_race_base = normalize_key(current_race_id)
            # Handle special cases where base logic fails or needs specific mapping
            if "yuan-ti" in current_race_id:
                current_race_base = "yuan-ti"
            if "genasi" in current_race_id:
                current_race_base = "genasi"
        
        # Detect trait name to know what we are looking at (we need to buffer lines to be sure)
        # Actually, reading line by line is hard because we need context of which trait we are in.
        # But in the file format, trait name comes before description usually.
        # Format:
        # {
        #   name: "Trait Name",
        #   description: "See official..."
        # }
        
        # Let's rely on finding `name: "Trait Name"` slightly before `description`.
        # Since I am processing line by line, I can remember the last seen trait name.
        
        trait_name_match = name_pattern.search(line)
        if trait_name_match:
            last_trait_name = trait_name_match.group(1)
            
        if "See official documentation for details." in line and current_race_base:
            # Check if we have data for this race and trait
            if current_race_base in trait_data:
                race_traits = trait_data[current_race_base]
                # Try exact match or partial match
                found_desc = None
                
                # Check exact match
                if last_trait_name in race_traits:
                    found_desc = race_traits[last_trait_name]
                else:
                    # Fallback: check if any key in trait_data is in last_trait_name properties
                    # e.g. "Cat's Claws" vs "Cat"
                    for t_key, t_desc in race_traits.items():
                        if t_key in last_trait_name or last_trait_name in t_key:
                             found_desc = t_desc
                             break
                
                if found_desc:
                    # Replace
                    # Careful with indentation and trailing commas
                    indent = line.split("description")[0]
                    # Check if line ends with comma
                    comma = "," if line.strip().endswith(",") else ""
                    # Escape quotes in description
                    safe_desc = found_desc.replace('"', '\\"')
                    new_line = f'{indent}description: "{safe_desc}"{comma}\n'
                    new_lines.append(new_line)
                    print(f"Updated {current_race_base} - {last_trait_name}")
                else:
                    new_lines.append(line)
                    print(f"Skipping {current_race_base} - {last_trait_name}: No data found")
            else:
                new_lines.append(line)
                print(f"Skipping {current_race_base}: No race data found")
        else:
            new_lines.append(line)
            
    with open(filepath, 'w') as f:
        f.writelines(new_lines)
    print("Done.")

if __name__ == "__main__":
    update_file(filepath)
