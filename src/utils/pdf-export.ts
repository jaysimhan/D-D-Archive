import { jsPDF } from "jspdf";
import { Character } from "../types/dnd-types";
import { getAbilityModifier, getProficiencyBonus } from "./character-utils";

export function exportCharacterToPDF(character: Partial<Character>) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;
  const leftMargin = 20;
  const rightMargin = pageWidth - 20;
  const lineHeight = 7;

  // Helper function to add text
  const addText = (
    text: string,
    x: number,
    y: number,
    size: number = 10,
    style: "normal" | "bold" = "normal"
  ) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", style);
    doc.text(text, x, y);
  };

  // Helper function to add a box
  const addBox = (x: number, y: number, width: number, height: number) => {
    doc.rect(x, y, width, height);
  };

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
    }
  };

  // Title
  doc.setFillColor(139, 0, 0); // Dark red
  doc.rect(0, 0, pageWidth, 15, "F");
  addText("DUNGEONS & DRAGONS CHARACTER SHEET", leftMargin, 10, 16, "bold");
  doc.setTextColor(255, 255, 255);
  addText("DUNGEONS & DRAGONS CHARACTER SHEET", leftMargin, 10, 16, "bold");
  doc.setTextColor(0, 0, 0);

  yPosition = 25;

  // Character Name and Basic Info
  addText(character.name || "Unnamed Character", leftMargin, yPosition, 18, "bold");
  yPosition += 10;

  const basicInfo = [
    `${character.race?.name || ""}${character.subrace ? ` (${character.subrace.name})` : ""
    }`,
    `${character.class?.name || ""} Level ${character.level || 1}`,
    character.background?.name || "",
    `Edition: ${character.edition || ""}`,
  ].filter(Boolean);

  basicInfo.forEach((info) => {
    addText(info, leftMargin, yPosition, 11);
    yPosition += lineHeight;
  });

  yPosition += 5;

  // Ability Scores Section
  checkPageBreak(50);
  addText("ABILITY SCORES", leftMargin, yPosition, 12, "bold");
  yPosition += 8;

  if (character.abilityScores) {
    const abilities = ["STR", "DEX", "CON", "INT", "WIS", "CHA"] as const;
    const boxWidth = 25;
    const boxHeight = 20;
    const spacing = 5;

    abilities.forEach((ability, index) => {
      const xPos = leftMargin + index * (boxWidth + spacing);
      const score = character.abilityScores![ability];
      const modifier = character.abilityScoreModifiers
        ? character.abilityScoreModifiers[ability]
        : getAbilityModifier(score);

      // Box
      addBox(xPos, yPosition, boxWidth, boxHeight);

      // Ability name
      addText(ability, xPos + boxWidth / 2 - 4, yPosition + 5, 9, "bold");

      // Score
      addText(
        score.toString(),
        xPos + boxWidth / 2 - 3,
        yPosition + 12,
        11,
        "bold"
      );

      // Modifier
      addText(
        `${modifier >= 0 ? "+" : ""}${modifier}`,
        xPos + boxWidth / 2 - 3,
        yPosition + 18,
        9
      );
    });

    yPosition += boxHeight + 10;
  }

  // Combat Stats
  checkPageBreak(40);
  addText("COMBAT STATS", leftMargin, yPosition, 12, "bold");
  yPosition += 8;

  const profBonus = character.proficiencyBonus || getProficiencyBonus(character.level || 1);

  const combatStats = [
    `Proficiency Bonus: +${profBonus}`,
    `Armor Class: ${character.armorClass || "—"}`,
    `Initiative: ${(character.initiative ?? 0) >= 0 ? "+" : ""}${character.initiative ?? 0}`,
    `Speed: ${character.speed || character.race?.speed || "—"} ft`,
    `Hit Points: ${character.hitPoints?.current || "—"} / ${character.hitPoints?.max || "—"
    }`,
    `Hit Dice: ${character.hitDice?.current || "—"}d${character.class?.hitDie || "—"
    } (${character.hitDice?.total || "—"} total)`,
  ];

  combatStats.forEach((stat) => {
    addText(stat, leftMargin, yPosition, 10);
    yPosition += lineHeight;
  });

  yPosition += 5;

  // Proficiencies
  checkPageBreak(30);
  addText("PROFICIENCIES", leftMargin, yPosition, 12, "bold");
  yPosition += 8;

  if (character.savingThrows) {
    addText(
      `Saving Throws: ${character.savingThrows.join(", ")}`,
      leftMargin,
      yPosition,
      10
    );
    yPosition += lineHeight;
  }

  if (character.languages) {
    addText(
      `Languages: ${character.languages.join(", ")}`,
      leftMargin,
      yPosition,
      10
    );
    yPosition += lineHeight;
  }

  yPosition += 5;

  // Features & Traits
  checkPageBreak(40);
  addText("FEATURES & TRAITS", leftMargin, yPosition, 12, "bold");
  yPosition += 8;

  if (character.racialTraits && character.racialTraits.length > 0) {
    addText("Racial Traits:", leftMargin, yPosition, 10, "bold");
    yPosition += lineHeight;
    character.racialTraits.forEach((trait) => {
      checkPageBreak(lineHeight);
      addText(`• ${trait}`, leftMargin + 5, yPosition, 9);
      yPosition += lineHeight;
    });
    yPosition += 3;
  }

  if (character.classFeatures && character.classFeatures.length > 0) {
    addText("Class Features:", leftMargin, yPosition, 10, "bold");
    yPosition += lineHeight;
    character.classFeatures.forEach((feature) => {
      checkPageBreak(lineHeight);
      addText(`• ${feature}`, leftMargin + 5, yPosition, 9);
      yPosition += lineHeight;
    });
    yPosition += 3;
  }

  // Spellcasting
  if (character.spellcasting && character.class?.spellcaster) {
    checkPageBreak(50);
    addText("SPELLCASTING", leftMargin, yPosition, 12, "bold");
    yPosition += 8;

    addText(
      `Spellcasting Ability: ${character.spellcasting.spellcastingAbility}`,
      leftMargin,
      yPosition,
      10
    );
    yPosition += lineHeight;

    addText(
      `Spell Save DC: ${character.spellcasting.spellSaveDC}`,
      leftMargin,
      yPosition,
      10
    );
    yPosition += lineHeight;

    addText(
      `Spell Attack Bonus: +${character.spellcasting.spellAttackBonus}`,
      leftMargin,
      yPosition,
      10
    );
    yPosition += lineHeight + 3;

    // Spell Slots
    addText("Spell Slots:", leftMargin, yPosition, 10, "bold");
    yPosition += lineHeight;

    for (let level = 1; level <= 9; level++) {
      const slots = character.spellcasting.spellSlots[level as keyof typeof character.spellcasting.spellSlots];
      if (slots && slots.max > 0) {
        checkPageBreak(lineHeight);
        addText(
          `Level ${level}: ${slots.current} / ${slots.max}`,
          leftMargin + 5,
          yPosition,
          9
        );
        yPosition += lineHeight;
      }
    }

    yPosition += 3;

    // Known/Prepared Spells
    const spells = character.spellcasting.knownSpells || character.spellcasting.preparedSpells || [];
    if (spells.length > 0) {
      addText("Spells:", leftMargin, yPosition, 10, "bold");
      yPosition += lineHeight;

      // Group by level
      const spellsByLevel: { [key: number]: typeof spells } = {};
      spells.forEach((spell) => {
        if (!spellsByLevel[spell.level]) {
          spellsByLevel[spell.level] = [];
        }
        spellsByLevel[spell.level].push(spell);
      });

      Object.keys(spellsByLevel)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .forEach((levelStr) => {
          const level = parseInt(levelStr);
          checkPageBreak(lineHeight * (spellsByLevel[level].length + 1) + 5);

          addText(
            level === 0 ? "Cantrips:" : `Level ${level}:`,
            leftMargin + 5,
            yPosition,
            9,
            "bold"
          );
          yPosition += lineHeight;

          spellsByLevel[level].forEach((spell) => {
            checkPageBreak(lineHeight);
            addText(`• ${spell.name}`, leftMargin + 10, yPosition, 8);
            yPosition += lineHeight;
          });

          yPosition += 2;
        });
    }
  }

  // Equipment
  if (character.equipment && character.equipment.length > 0) {
    checkPageBreak(30);
    addText("EQUIPMENT", leftMargin, yPosition, 12, "bold");
    yPosition += 8;

    character.equipment.forEach((item) => {
      checkPageBreak(lineHeight);
      addText(`• ${item.name}`, leftMargin + 5, yPosition, 9);
      yPosition += lineHeight;
    });

    yPosition += 5;
  }

  // Currency
  if (character.currency) {
    checkPageBreak(15);
    addText("CURRENCY", leftMargin, yPosition, 12, "bold");
    yPosition += 8;

    const coins = [
      `${character.currency.cp} cp`,
      `${character.currency.sp} sp`,
      `${character.currency.ep} ep`,
      `${character.currency.gp} gp`,
      `${character.currency.pp} pp`,
    ].join(", ");

    addText(coins, leftMargin, yPosition, 10);
    yPosition += lineHeight + 5;
  }

  // Personality (if on a new page or enough space)
  if (
    character.personalityTraits ||
    character.ideals ||
    character.bonds ||
    character.flaws
  ) {
    checkPageBreak(60);
    addText("PERSONALITY", leftMargin, yPosition, 12, "bold");
    yPosition += 8;

    if (character.personalityTraits) {
      addText("Personality Traits:", leftMargin, yPosition, 10, "bold");
      yPosition += lineHeight;
      const lines = doc.splitTextToSize(
        character.personalityTraits,
        rightMargin - leftMargin - 10
      );
      lines.forEach((line: string) => {
        checkPageBreak(lineHeight);
        addText(line, leftMargin + 5, yPosition, 9);
        yPosition += lineHeight;
      });
      yPosition += 3;
    }

    if (character.ideals) {
      checkPageBreak(15);
      addText("Ideals:", leftMargin, yPosition, 10, "bold");
      yPosition += lineHeight;
      const lines = doc.splitTextToSize(character.ideals, rightMargin - leftMargin - 10);
      lines.forEach((line: string) => {
        checkPageBreak(lineHeight);
        addText(line, leftMargin + 5, yPosition, 9);
        yPosition += lineHeight;
      });
      yPosition += 3;
    }

    if (character.bonds) {
      checkPageBreak(15);
      addText("Bonds:", leftMargin, yPosition, 10, "bold");
      yPosition += lineHeight;
      const lines = doc.splitTextToSize(character.bonds, rightMargin - leftMargin - 10);
      lines.forEach((line: string) => {
        checkPageBreak(lineHeight);
        addText(line, leftMargin + 5, yPosition, 9);
        yPosition += lineHeight;
      });
      yPosition += 3;
    }

    if (character.flaws) {
      checkPageBreak(15);
      addText("Flaws:", leftMargin, yPosition, 10, "bold");
      yPosition += lineHeight;
      const lines = doc.splitTextToSize(character.flaws, rightMargin - leftMargin - 10);
      lines.forEach((line: string) => {
        checkPageBreak(lineHeight);
        addText(line, leftMargin + 5, yPosition, 9);
        yPosition += lineHeight;
      });
    }
  }

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Created with D&D Omni-Archive • Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  // Save the PDF
  const fileName = `${character.name || "Character"}_Sheet.pdf`.replace(
    /[^a-z0-9_\-\.]/gi,
    "_"
  );
  doc.save(fileName);
}
