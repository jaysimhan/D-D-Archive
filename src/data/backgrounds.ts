import { Background } from "../types/dnd-types";

export const BACKGROUNDS: Background[] = [
  {
    "id": "acolyte",
    "name": "Acolyte",
    "description": "You have spent your life in the service of a temple to a specific god or pantheon of gods.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "skillProficiencies": [
      "Insight",
      "Religion"
    ],
    "toolProficiencies": [],
    "languages": 2,
    "equipment": [
      "A holy symbol",
      "A prayer book or prayer wheel",
      "5 sticks of incense",
      "Vestments",
      "A set of common clothes",
      "15 gp"
    ],
    "feature": {
      "name": "Shelter of the Faithful",
      "description": "You and your companions can expect to receive free healing and care at a temple, shrine, or other established presence of your faith. Those who share your religion will support you at a modest lifestyle."
    }
  },
  {
    "id": "criminal",
    "name": "Criminal",
    "description": "You are an experienced criminal with a history of breaking the law.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "skillProficiencies": [
      "Deception",
      "Stealth"
    ],
    "toolProficiencies": [
      "One type of gaming set",
      "Thieves' tools"
    ],
    "languages": 0,
    "equipment": [
      "A crowbar",
      "A set of dark common clothes including a hood",
      "15 gp"
    ],
    "feature": {
      "name": "Criminal Contact",
      "description": "You have a reliable and trustworthy contact who acts as your liaison to a network of other criminals. You know how to get messages to and from your contact."
    }
  },
  {
    "id": "folk-hero",
    "name": "Folk Hero",
    "description": "You come from a humble social rank, but you are destined for so much more. The people of your home village regard you as their champion.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "skillProficiencies": [
      "Animal Handling",
      "Survival"
    ],
    "toolProficiencies": [
      "One type of artisan's tools",
      "Vehicles (land)"
    ],
    "languages": 0,
    "equipment": [
      "A set of artisan's tools",
      "A shovel",
      "An iron pot",
      "A set of common clothes",
      "10 gp"
    ],
    "feature": {
      "name": "Rustic Hospitality",
      "description": "Since you come from the ranks of the common folk, you fit in among them with ease. You can find a place to hide, rest, or recuperate among other commoners."
    }
  },
  {
    "id": "noble",
    "name": "Noble",
    "description": "You understand wealth, power, and privilege. You carry a noble title.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "skillProficiencies": [
      "History",
      "Persuasion"
    ],
    "toolProficiencies": [
      "One type of gaming set"
    ],
    "languages": 1,
    "equipment": [
      "A set of fine clothes",
      "A signet ring",
      "A scroll of pedigree",
      "25 gp"
    ],
    "feature": {
      "name": "Position of Privilege",
      "description": "Thanks to your noble birth, people are inclined to think the best of you. You are welcome in high society, and people assume you have the right to be wherever you are."
    }
  },
  {
    "id": "sage",
    "name": "Sage",
    "description": "You spent years learning the lore of the multiverse. You scoured manuscripts, studied scrolls, and listened to the greatest experts.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "skillProficiencies": [
      "Arcana",
      "History"
    ],
    "toolProficiencies": [],
    "languages": 2,
    "equipment": [
      "A bottle of black ink",
      "A quill",
      "A small knife",
      "A letter from a dead colleague",
      "A set of common clothes",
      "10 gp"
    ],
    "feature": {
      "name": "Researcher",
      "description": "When you attempt to learn or recall a piece of lore, if you do not know that information, you often know where and from whom you can obtain it."
    }
  },
  {
    "id": "soldier",
    "name": "Soldier",
    "description": "War has been your life for as long as you care to remember. You trained as a youth, studied the use of weapons and armor.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "skillProficiencies": [
      "Athletics",
      "Intimidation"
    ],
    "toolProficiencies": [
      "One type of gaming set",
      "Vehicles (land)"
    ],
    "languages": 0,
    "equipment": [
      "An insignia of rank",
      "A trophy from a fallen enemy",
      "A set of bone dice or deck of cards",
      "A set of common clothes",
      "10 gp"
    ],
    "feature": {
      "name": "Military Rank",
      "description": "You have a military rank from your career as a soldier. Soldiers loyal to your former military organization still recognize your authority and influence."
    }
  },
  {
    "id": "charlatan",
    "name": "Charlatan",
    "description": "You have always had a way with people. You know what makes them tick and can tease out their hearts' desires.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "skillProficiencies": [
      "Deception",
      "Sleight of Hand"
    ],
    "toolProficiencies": [
      "Disguise kit",
      "Forgery kit"
    ],
    "languages": 0,
    "equipment": [
      "A set of fine clothes",
      "A disguise kit",
      "Tools of your con of choice",
      "15 gp"
    ],
    "feature": {
      "name": "False Identity",
      "description": "You have created a second identity that includes documentation, established acquaintances, and disguises. You can adopt this persona whenever you choose."
    }
  },
  {
    "id": "outlander",
    "name": "Outlander",
    "description": "You grew up in the wilds, far from civilization and the comforts of town and technology.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "skillProficiencies": [
      "Athletics",
      "Survival"
    ],
    "toolProficiencies": [
      "One type of musical instrument"
    ],
    "languages": 1,
    "equipment": [
      "A staff",
      "A hunting trap",
      "A trophy from an animal you killed",
      "A set of traveler's clothes",
      "10 gp"
    ],
    "feature": {
      "name": "Wanderer",
      "description": "You have an excellent memory for maps and geography, and you can always recall the general layout of terrain, settlements, and other features around you."
    }
  },
  {
    "id": "guild-artisan",
    "name": "Guild Artisan",
    "description": "You are a member of an artisan's guild, skilled in a particular field and closely associated with other artisans.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "skillProficiencies": [
      "Insight",
      "Persuasion"
    ],
    "toolProficiencies": [
      "One type of artisan's tools"
    ],
    "languages": 1,
    "equipment": [
      "A set of artisan's tools",
      "A letter of introduction from your guild",
      "A set of traveler's clothes",
      "15 gp"
    ],
    "feature": {
      "name": "Guild Membership",
      "description": "As an established member of a guild, you can rely on certain benefits that membership provides. Your fellow guild members will provide you with lodging and food if necessary."
    }
  },
  {
    "id": "entertainer",
    "name": "Entertainer",
    "description": "You thrive in front of an audience. You know how to entrance them, entertain them, and even inspire them.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "skillProficiencies": [
      "Acrobatics",
      "Performance"
    ],
    "toolProficiencies": [
      "Disguise kit",
      "One type of musical instrument"
    ],
    "languages": 0,
    "equipment": [
      "A musical instrument",
      "The favor of an admirer",
      "A costume",
      "15 gp"
    ],
    "feature": {
      "name": "By Popular Demand",
      "description": "You can always find a place to perform, where you receive free lodging and food of a modest or comfortable standard."
    }
  },
  {
    "id": "urchin",
    "name": "Urchin",
    "description": "You grew up on the streets alone, orphaned, and poor. You had no one to watch over you or to provide for you, so you learned to provide for yourself.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "skillProficiencies": [
      "Sleight of Hand",
      "Stealth"
    ],
    "toolProficiencies": [
      "Disguise kit",
      "Thieves' tools"
    ],
    "languages": 0,
    "equipment": [
      "A small knife",
      "A map of the city you grew up in",
      "A pet mouse",
      "A token to remember your parents by",
      "A set of common clothes",
      "10 gp"
    ],
    "feature": {
      "name": "City Secrets",
      "description": "You know the secret patterns and flow of cities and can find passages through the urban sprawl that others would miss."
    }
  },
  {
    "id": "hermit",
    "name": "Hermit",
    "description": "You lived in seclusion—either in a sheltered community or entirely alone—for a formative part of your life.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "skillProficiencies": [
      "Medicine",
      "Religion"
    ],
    "toolProficiencies": [
      "Herbalism kit"
    ],
    "languages": 1,
    "equipment": [
      "A scroll case stuffed with notes",
      "A winter blanket",
      "A set of common clothes",
      "An herbalism kit",
      "5 gp"
    ],
    "feature": {
      "name": "Discovery",
      "description": "The quiet seclusion of your extended hermitage gave you access to a unique and powerful discovery."
    }
  },
  {
    "id": "sailor",
    "name": "Sailor",
    "description": "You sailed on a seagoing vessel for years. In that time, you faced down mighty storms, monsters of the deep, and those who wanted to sink your craft.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "skillProficiencies": [
      "Athletics",
      "Perception"
    ],
    "toolProficiencies": [
      "Navigator's tools",
      "Vehicles (water)"
    ],
    "languages": 0,
    "equipment": [
      "A belaying pin (club)",
      "50 feet of silk rope",
      "A lucky charm",
      "A set of common clothes",
      "10 gp"
    ],
    "feature": {
      "name": "Ship's Passage",
      "description": "When you need to, you can secure free passage on a sailing ship for yourself and your companions."
    }
  },
  {
    "id": "haunted-one",
    "name": "Haunted One",
    "description": "You are haunted by something so terrible that you dare not speak of it. You've tried to bury it and run away from it, to no avail.",
    "imageUrl": "https://placehold.co/600x400",
    "source": "Official",
    "edition": "Both",
    "version": 1,
    "skillProficiencies": [
      "Investigation",
      "Survival"
    ],
    "toolProficiencies": [],
    "languages": 2,
    "equipment": [
      "A monster hunter's pack",
      "A set of common clothes",
      "One trinket of special significance",
      "1 gp"
    ],
    "feature": {
      "name": "Heart of Darkness",
      "description": "Those who look into your eyes can see that you have faced unimaginable horror. Common folk are reluctant to cross you."
    }
  }
];
