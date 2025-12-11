import json
import re
import os

def to_kebab_case(name):
    return name.lower().replace(" ", "-").replace("/", "-").replace("'", "")

def parse_classes_from_str(class_str):
    if not class_str:
        return []
    return [c.strip().lower() for c in class_str.split(",")]

def parse_components_5etools(comp_obj):
    # 5etools components: { "v": true, "s": true, "m": "stuff" }
    comps = {
        "verbal": False,
        "somatic": False,
        "material": False,
        "materialDescription": ""
    }
    if not comp_obj:
        return comps
    
    if comp_obj.get("v"):
        comps["verbal"] = True
    if comp_obj.get("s"):
        comps["somatic"] = True
    if comp_obj.get("m"):
        comps["material"] = True
        val = comp_obj.get("m")
        if isinstance(val, str):
            comps["materialDescription"] = val
        elif isinstance(val, dict):
             comps["materialDescription"] = val.get("text", str(val))
            
    return comps

def clean_description_5etools(entries):
    # entries is a list of strings or objects
    desc_lines = []
    for entry in entries:
        if isinstance(entry, str):
            desc_lines.append(entry)
        elif isinstance(entry, dict):
            if entry.get("type") == "entries":
                desc_lines.append(entry.get("name", "") + ":")
                desc_lines.extend(clean_description_5etools(entry.get("entries", [])))
            elif entry.get("type") == "list":
                items = entry.get("items", [])
                for i in items:
                     if isinstance(i, str):
                         desc_lines.append("- " + i)
                     else:
                        desc_lines.append("- " + str(i.get("name", "")))
            elif entry.get("type") == "table":
                 desc_lines.append("(Table included in full description)")
            # Add other types as needed
    
    full_text = "\n".join(desc_lines)
    # Remove {@tag content} -> content
    # Regex to match {@tag content} or {@tag content|args}
    # We want to keep 'content'.
    
    # Simple strategy: remove {@xxx } wrapper
    # {@spell burning hands} -> burning hands
    # {@damage 1d6} -> 1d6
    # {@condition charmed} -> charmed
    
    def replace_tag(match):
        content = match.group(1)
        # pipe check
        if "|" in content:
            parts = content.split("|")
            return parts[0] # Return text before pipe
        return content

    full_text = re.sub(r'\{@[a-z]+ ([^\}]+)\}', replace_tag, full_text)
    return full_text

# Manual map for some key expansion spells classes
EXPANSION_CLASSES = {
    "booming-blade": ["sorcerer", "warlock", "wizard"],
    "green-flame-blade": ["sorcerer", "warlock", "wizard"],
    "absorb-elements": ["druid", "ranger", "sorcerer", "wizard"],
    "toll-the-dead": ["cleric", "warlock", "wizard"],
    "healing-spirit": ["druid", "ranger"],
    "zephyr-strike": ["ranger"],
    "chaos-bolt": ["sorcerer"],
    "silvery-barbs": ["bard", "sorcerer", "wizard"],
    "mind-sliver": ["sorcerer", "warlock", "wizard"],
    "tashas-caustic-brew": ["sorcerer", "wizard", "artificer"],
    "summon-beast": ["druid", "ranger"],
    "summon-fey": ["druid", "ranger", "warlock", "wizard"],
    "summon-shadowspawn": ["warlock", "wizard"],
    "summon-undead": ["warlock", "wizard"],
    "summon-aberration": ["warlock", "wizard"],
    "summon-construct": ["wizard", "artificer"],
    "summon-elemental": ["druid", "ranger", "wizard"],
    "summon-fiend": ["warlock", "wizard"],
    "lightning-lure": ["sorcerer", "warlock", "wizard"],
    "sword-burst": ["sorcerer", "warlock", "wizard"],
    "thunderclap": ["bard", "druid", "sorcerer", "warlock", "wizard"],
    "create-bonfire": ["druid", "sorcerer", "warlock", "wizard"],
    "frostbite": ["druid", "sorcerer", "warlock", "wizard"],
    "gust": ["druid", "sorcerer", "wizard"],
    "magic-stone": ["druid", "warlock", "artificer"],
    "mold-earth": ["druid", "sorcerer", "wizard"],
    "shape-water": ["druid", "sorcerer", "wizard"],
    "control-flames": ["druid", "sorcerer", "wizard"],
    "infestation": ["druid", "sorcerer", "warlock", "wizard"],
    "primal-savagery": ["druid"],
    "word-of-radiance": ["cleric"],
    "ceremony": ["cleric", "paladin"],
    "catapult": ["sorcerer", "wizard", "artificer"],
    "ice-knife": ["druid", "sorcerer", "wizard"],
    "earth-tremor": ["bard", "druid", "sorcerer", "wizard"],
    "dragon-breath": ["sorcerer", "wizard"],
    "shadow-blade": ["sorcerer", "warlock", "wizard"],
    "maximilians-earthen-grasp": ["sorcerer", "wizard"],
    "wither-and-bloom": ["druid", "sorcerer", "wizard"],
    "vortex-warp": ["sorcerer", "wizard", "artificer"]
}

def main():
    # Load PHB classes lookup
    phb_classes_map = {}
    try:
        with open("src/data/temp_all_spells.json", "r") as f:
            phb_data = json.load(f).get("allSpells", [])
            for s in phb_data:
                sid = to_kebab_case(s.get("name", ""))
                phb_classes_map[sid] = parse_classes_from_str(s.get("classes", ""))
    except Exception as e:
        print(f"Warning: Could not load temp_all_spells.json: {e}")

    files = [
        "src/data/raw_spells/spells-phb.json", 
        "src/data/raw_spells/spells-xge.json", 
        "src/data/raw_spells/spells-tce.json"
    ]
    
    all_processed = []
    processed_ids = set()
    
    for fp in files:
        if not os.path.exists(fp):
            print(f"Skipping {fp}, not found")
            continue
            
        with open(fp, "r") as f:
            data = json.load(f)
            
        spells = data.get("spell", [])
        
        for spell in spells:
            # Filter Cantrip (0), Level 1, Level 2
            lvl = spell.get("level")
            if lvl not in [0, 1, 2]:
                continue
                
            name = spell.get("name")
            s_id = to_kebab_case(name)
            
            # De-dupe
            if s_id in processed_ids:
                continue
            processed_ids.add(s_id)
            
            # Map Schools
            school_map = {
                "A": "Abjuration", "C": "Conjuration", "D": "Divination", 
                "E": "Enchantment", "V": "Evocation", "I": "Illusion", 
                "N": "Necromancy", "T": "Transmutation"
            }
            school = school_map.get(spell.get("school"), "Abjuration")
            
            # Time
            time_obj = spell.get("time", [{}])[0]
            casting_time = f"{time_obj.get('number', 1)} {time_obj.get('unit', 'action')}"
            
            # Range
            range_obj = spell.get("range", {})
            dist = range_obj.get("distance", {})
            range_val = f"{dist.get('amount', '')} {dist.get('type', '')}".strip()
            if range_obj.get("type") == "point":
                range_val = f"{dist.get('amount', '')} {dist.get('type', '')}".strip()
            elif range_obj.get("type") == "self":
                range_val = "Self"
            
            # Components
            comps = parse_components_5etools(spell.get("components"))
            
            # Duration
            dur_obj = spell.get("duration", [{}])[0]
            concentration = dur_obj.get("concentration", False)
            ritual = spell.get("meta", {}).get("ritual", False)
            duration_text = ""
            if dur_obj.get("type") == "instant":
                duration_text = "Instantaneous"
            elif dur_obj.get("type") == "timed":
                 duration_text = f"{dur_obj.get('duration', {}).get('amount')} {dur_obj.get('duration', {}).get('type')}"
            if concentration:
                duration_text = "Concentration, " + duration_text
                
            # Description
            description = clean_description_5etools(spell.get("entries", []))
            
            # Classes
            classes = []
            if s_id in phb_classes_map:
                classes = phb_classes_map[s_id]
            elif s_id in EXPANSION_CLASSES:
                classes = EXPANSION_CLASSES[s_id]
            
            # Fallback source
            source_raw = spell.get("source", "Official")
            source = "Official" # Map all to Official for simplicity unless Homebrew
            
            # Formatting for TS
            desc_safe = description.replace('"', '\\"').replace('\n', '\\n')
            mat_desc_safe = comps["materialDescription"].replace('"', '\\"') if comps["materialDescription"] else ""
            
            ts_obj = f"""  {{
    id: "{s_id}",
    name: "{name}",
    level: {lvl},
    school: "{school}",
    castingTime: "{casting_time}",
    range: "{range_val}",
    components: {{
      verbal: {str(comps['verbal']).lower()},
      somatic: {str(comps['somatic']).lower()},
      material: {str(comps['material']).lower()},
      materialDescription: "{mat_desc_safe}"
    }},
    duration: "{duration_text}",
    concentration: {str(concentration).lower()},
    ritual: {str(ritual).lower()},
    description: "{desc_safe}",
    classes: {json.dumps(classes)},
    source: "{source}",
    edition: "Both",
    version: 1,
  }},"""
            all_processed.append(ts_obj)

    final_ts = 'import { Spell } from "../types/dnd-types";\n\nexport const comprehensiveSpellsGen: Spell[] = [\n' + "\n".join(all_processed) + "\n];\n"
    
    with open("src/data/comprehensive-spells-gen.ts", "w") as f:
        f.write(final_ts)
        
    print(f"Processed {len(all_processed)} spells.")

if __name__ == "__main__":
    main()
