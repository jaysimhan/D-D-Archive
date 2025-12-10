// Data Import/Export Utilities for Admin Panel
import type {
  Race,
  Class,
  Spell,
  Item,
  Feat,
  Background,
  Subrace,
  Subclass
} from "../types/dnd-types";
import { Monster } from "../data/monsters";

export type EntityType = "races" | "classes" | "spells" | "items" | "feats" | "backgrounds" | "monsters" | "subraces" | "subclasses";

// ===== JSON Export Functions =====

export function exportToJSON<T>(data: T[], filename: string) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportEntityToJSON(entityType: EntityType, data: any[]) {
  const timestamp = new Date().toISOString().split("T")[0];
  const filename = `dnd-${entityType}-${timestamp}.json`;
  exportToJSON(data, filename);
}

// ===== CSV Export Functions =====

export function convertToCSV(data: any[]): string {
  if (data.length === 0) return "";

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Add headers
  csvRows.push(headers.join(","));

  // Add data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header];
      // Handle complex objects
      if (typeof value === "object" && value !== null) {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      }
      // Handle strings with commas
      if (typeof value === "string" && value.includes(",")) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value ?? "";
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
}

export function exportToCSV(data: any[], filename: string) {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportEntityToCSV(entityType: EntityType, data: any[]) {
  const timestamp = new Date().toISOString().split("T")[0];
  const filename = `dnd-${entityType}-${timestamp}.csv`;
  exportToCSV(data, filename);
}

// ===== JSON Import Functions =====

export async function importFromJSON<T>(file: File): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (Array.isArray(data)) {
          resolve(data);
        } else {
          reject(new Error("Invalid JSON format. Expected an array."));
        }
      } catch (error) {
        reject(new Error("Error parsing JSON file"));
      }
    };
    reader.onerror = () => reject(new Error("Error reading file"));
    reader.readAsText(file);
  });
}

// ===== CSV Import Functions =====

export function parseCSV(csvText: string): any[] {
  const lines = csvText.split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim());
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line);
    const obj: any = {};

    headers.forEach((header, index) => {
      let value: any = values[index];

      // Try to parse JSON objects
      if (value && value.startsWith("{") && value.endsWith("}")) {
        try {
          value = JSON.parse(value);
        } catch (e) {
          // Keep as string if parsing fails
        }
      }

      // Try to parse arrays
      if (value && value.startsWith("[") && value.endsWith("]")) {
        try {
          value = JSON.parse(value);
        } catch (e) {
          // Keep as string if parsing fails
        }
      }

      // Convert numbers
      if (value && !isNaN(Number(value))) {
        value = Number(value);
      }

      // Convert booleans
      if (value === "true") value = true;
      if (value === "false") value = false;

      obj[header] = value;
    });

    result.push(obj);
  }

  return result;
}

function parseCSVLine(line: string): string[] {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

export async function importFromCSV<T>(file: File): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvText = event.target?.result as string;
        const data = parseCSV(csvText);
        resolve(data);
      } catch (error) {
        reject(new Error("Error parsing CSV file"));
      }
    };
    reader.onerror = () => reject(new Error("Error reading file"));
    reader.readAsText(file);
  });
}

// ===== Validation Functions =====

export function validateRace(data: any): data is Race {
  return (
    typeof data.id === "string" &&
    typeof data.name === "string" &&
    typeof data.description === "string" &&
    ["Official", "Homebrew", "Unofficial"].includes(data.source) &&
    ["2014", "2024", "Both"].includes(data.edition) &&
    typeof data.version === "number" &&
    ["Tiny", "Small", "Medium", "Large"].includes(data.size) &&
    typeof data.speed === "number"
  );
}

export function validateSpell(data: any): data is Spell {
  return (
    typeof data.id === "string" &&
    typeof data.name === "string" &&
    typeof data.level === "number" &&
    data.level >= 0 &&
    data.level <= 9 &&
    [
      "Abjuration",
      "Conjuration",
      "Divination",
      "Enchantment",
      "Evocation",
      "Illusion",
      "Necromancy",
      "Transmutation"
    ].includes(data.school)
  );
}

export function validateItem(data: any): data is Item {
  return (
    typeof data.id === "string" &&
    typeof data.name === "string" &&
    [
      "Weapon",
      "Armor",
      "Potion",
      "Scroll",
      "Wondrous Item",
      "Ring",
      "Rod",
      "Staff",
      "Wand",
      "Adventuring Gear"
    ].includes(data.type)
  );
}

// ===== Bulk Import with Validation =====

export async function importEntityData<T>(
  file: File,
  entityType: EntityType,
  validator?: (data: any) => boolean
): Promise<{ valid: T[]; invalid: any[]; errors: string[] }> {
  const isJSON = file.name.endsWith(".json");
  const isCSV = file.name.endsWith(".csv");

  if (!isJSON && !isCSV) {
    throw new Error("Unsupported file format. Please use JSON or CSV.");
  }

  const data = isJSON ? await importFromJSON(file) : await importFromCSV(file);

  const valid: T[] = [];
  const invalid: any[] = [];
  const errors: string[] = [];

  data.forEach((item, index) => {
    if (!validator || validator(item)) {
      valid.push(item as any);
    } else {
      invalid.push(item);
      errors.push(`Row ${index + 1}: Invalid data structure`);
    }
  });

  return { valid, invalid, errors };
}

// ===== Template Generation =====

export function generateCSVTemplate(entityType: EntityType): string {
  const templates: Record<EntityType, any> = {
    races: {
      id: "example-race",
      name: "Example Race",
      description: "Description here",
      source: "Homebrew",
      edition: "Both",
      version: 1,
      size: "Medium",
      speed: 30,
      traits: "[]",
      languages: "[]"
    },
    classes: {
      id: "example-class",
      name: "Example Class",
      description: "Description here",
      source: "Homebrew",
      edition: "Both",
      version: 1,
      hitDie: 8,
      primaryAbility: "[]",
      savingThrows: "[]"
    },
    spells: {
      id: "example-spell",
      name: "Example Spell",
      level: 1,
      school: "Evocation",
      castingTime: "1 action",
      range: "60 feet",
      duration: "Instantaneous",
      concentration: false,
      ritual: false,
      description: "Description here",
      classes: "[]",
      source: "Homebrew",
      edition: "Both",
      version: 1
    },
    items: {
      id: "example-item",
      name: "Example Item",
      type: "Weapon",
      description: "Description here",
      magical: false,
      rarity: "Common",
      requiresAttunement: false,
      source: "Homebrew",
      edition: "Both",
      version: 1
    },
    feats: {
      id: "example-feat",
      name: "Example Feat",
      description: "Description here",
      source: "Homebrew",
      edition: "Both",
      version: 1
    },
    backgrounds: {
      id: "example-background",
      name: "Example Background",
      description: "Description here",
      source: "Homebrew",
      edition: "Both",
      version: 1,
      skillProficiencies: "[]",
      toolProficiencies: "[]",
      languages: 0
    },
    monsters: {
      id: "example-monster",
      name: "Example Monster",
      size: "Medium",
      type: "Beast",
      alignment: "N",
      armorClass: 12,
      hitPoints: 20,
      hitDice: "3d8 + 6",
      challengeRating: 1,
      experiencePoints: 200,
      source: "Homebrew",
      edition: "Both",
      version: 1
    },
    subraces: {
      id: "example-subrace",
      parentRaceId: "parent-race-id",
      name: "Example Subrace",
      description: "Description here",
      source: "Homebrew",
      edition: "Both",
      version: 1,
      traits: "[]"
    },
    subclasses: {
      id: "example-subclass",
      parentClassId: "parent-class-id",
      name: "Example Subclass",
      description: "Description here",
      source: "Homebrew",
      edition: "Both",
      version: 1
    }
  };

  const template = templates[entityType];
  return convertToCSV([template]);
}

export function downloadCSVTemplate(entityType: EntityType) {
  const csv = generateCSVTemplate(entityType);
  const filename = `dnd-${entityType}-template.csv`;
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
