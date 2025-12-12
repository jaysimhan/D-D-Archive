
import re

with open('src/data/classes.ts', 'r') as f:
    content = f.read()
    
    # Try to find all name: "..." pattern inside the objects
    names = re.findall(r'name:\s*"([^"]+)"', content)
    print(f"Found {len(names)} names.")
    for name in names:
        if "Reanimator" in name:
            print(f"FOUND MATCH: {name}")
    
    # Check if "Reanimator" appears as a value for name anywhere
    if 'name: "Reanimator"' in content:
        print("Literal 'name: \"Reanimator\"' found in file!")
