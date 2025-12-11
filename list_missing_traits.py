import re

filepath = "/Users/jaysimhan/Desktop/Works/D&D/d-and-d-gaming/src/data/mock-races.ts"

def list_missing_traits(filepath):
    print(f"Scanning {filepath}...")
    with open(filepath, 'r') as f:
        content = f.read()

    # Regex to find race objects (roughly) and then find traits within them
    # This is a bit naive regex parsing for nested JSON-like structure, but might work if structure is consistent
    # Let's try to just find the trait names close to the placeholder
    
    lines = content.split('\n')
    current_race = "Unknown"
    
    missing_map = {}
    
    for i, line in enumerate(lines):
        # Capture Race ID/Name
        id_match = re.search(r'^\s*id:\s*["\']([^"\']+)["\']', line) or re.search(r'^\s*"id":\s*["\']([^"\']+)["\']', line)
        if id_match:
            current_race = id_match.group(1)
            
        if "See official documentation for details." in line:
            # Look backwards for trait name
            name_found = False
            for j in range(i-1, i-10, -1):
                name_match = re.search(r'name:\s*["\']([^"\']+)["\']', lines[j]) or re.search(r'"name":\s*["\']([^"\']+)["\']', lines[j])
                if name_match:
                    trait_name = name_match.group(1)
                    if current_race not in missing_map:
                        missing_map[current_race] = []
                    missing_map[current_race].append(trait_name)
                    name_found = True
                    break
            if not name_found:
                print(f"Warning: Could not find trait name for placeholder in {current_race} at line {i+1}")

    for race, traits in missing_map.items():
        print(f"Race: {race}")
        for trait in traits:
            print(f"  - {trait}")
            
if __name__ == "__main__":
    list_missing_traits(filepath)
