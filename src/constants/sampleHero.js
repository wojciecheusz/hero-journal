/**
 * Sample hero — John Silverblade, Paladin level 5.
 * All tabs filled with at least 3 entries.
 * Session notes contain NPC names and location names
 * that automatically become hyperlinks in the chronicle view.
 */
export function createSampleHero() {
  const id = "sample_" + Date.now();

  /* ── CHARACTER SHEET ─────────────────────────────── */
  const char = {
    name: "John Silverblade",
    race: "Human",
    classes: [{ name: "Paladin", level: 5 }],
    stats: { STR: 18, DEX: 10, CON: 16, INT: 10, WIS: 12, CHA: 14 },
    profBonus: 3,
    hp: { current: 44, max: 52, temp: 0 },
    ac: 18,
    speed: 30,
    initiativeBonus: undefined,
    xp: 8500,
    savingThrows: { wis: true, cha: true },
    savingThrowExp: {}, savingThrowOverride: {},
    skills: { athletics: true, intimidation: true, perception: true, persuasion: true },
    skillExp: { perception: true },
    alignment: "LG",
    background: "Soldier",
    traits: {
      personality: "I always keep my word. My oath is my weapon, and my weapon never lies.",
      ideals: "Justice must prevail. Even an enemy deserves a fair trial — but not mercy without merit.",
      bonds: "I swore to protect the innocent from the powers of darkness. I will not break that oath, whatever the cost.",
      flaws: "I act recklessly when I see suffering. I don't ask the price — I just strike.",
    },
    personalNotes: "// Ritual of the White Oak: an unknown ritual that may seal the Lord Gnicia.\n// Leaden Sky: something like an 'entity', a pupil of Lord Gnicia\n// Echo of the First Oak: key to the Ritual of the White Oak",
    backstory: "John Silverblade grew up in a small village on the kingdom's outskirts. As a young boy, he survived a demon-cult raid that reduced his home to ashes. Saved by a wandering paladin, he swore to dedicate his life to fighting evil. After years of service in the Order of the Silver Flame, he set out alone to face the growing threat of the Dragon Blood Cult — an organization that stole the Order's holy relic.",
    spellSlots: {
      "1. poziom": { max: 4, used: 2 },
      "2. poziom": { max: 2, used: 0 },
    },
    spellcastingAbility: "CHA",
    hitDice: { type: "d10", max: 5, used: 2 },
    deathSaves: { successes: 0, failures: 0 },
    proficiencies: {
      weapons: "Simple weapons, martial weapons",
      armor: "All armor, shields",
      languages: "Common, Celestial",
      tools: "Gaming set (dice)",
    },
    appearance: { age: "32", height: "185 cm", weight: "90 kg", eyes: "Gray", skin: "Tanned", hair: "Dark brown" },
    conditions: {},
    coins: { gold: 45, silver: 12, copper: 8 },
  };

  /* ── INVENTORY ─────────────────────────────────── */
  const inventory = [
    {
      id: 101, name: "Longsword +1", type: "Broń", qty: "1",
      damage: "1d8", damageType: "Slashing", modifier: "1",
      charges: "", effect: "",
      note: "Found in the Shadow Cave. Glows faintly in darkness — a sign of an ancient consecration spell.",
      equipped: true, tags: ["magic"],
    },
    {
      id: 102, name: "Plate Armor", type: "Pancerz", qty: "1",
      damage: "", damageType: "", modifier: "", charges: "", effect: "",
      note: "Well-fitted. AC 18. Polished to a mirror shine — John's mark on the battlefield.",
      equipped: true, tags: [],
    },
    {
      id: 103, name: "Heraldic Shield", type: "Pancerz", qty: "1",
      damage: "", damageType: "", modifier: "", charges: "", effect: "",
      note: "Bears the symbol of the Order of the Silver Flame — a silver flame on black.",
      equipped: true, tags: ["order"],
    },
    {
      id: 104, name: "Healing Potion", type: "Jednorazowy", qty: "3",
      damage: "", damageType: "", modifier: "",
      charges: "3", effect: "Restores 2d4+2 HP",
      note: "Purchased at the Temple of Mystra from Elara Moonwhisper.",
      equipped: false, tags: ["medicine"],
    },
    {
      id: 105, name: "Scroll — Detect Evil and Good", type: "Zwój z czarem", qty: "1",
      damage: "", damageType: "", modifier: "",
      charges: "1", effect: "Detect Evil and Good, range 30 ft, duration 10 min.",
      note: "Given by Elara before the Shadow Cave expedition.",
      equipped: false, tags: ["magic", "scouting"],
    },
    {
      id: 106, name: "Silk Rope 50 ft", type: "Narzędzie", qty: "1",
      damage: "", damageType: "", modifier: "", charges: "", effect: "",
      note: "Essential for dungeon exploration. Has saved lives more than once.",
      equipped: false, tags: [],
    },
  ];

  /* ── SPELLS ────────────────────────────────────── */
  const spells = [
    {
      id: 201, name: "Cure Wounds", level: "1. poziom", school: "Przywoływanie",
      castingTime: "1 action", zakres: "Touch", duration: "Instantaneous",
      components: "V, S",
      description: "A creature you touch regains HP equal to 1d8 + your spellcasting modifier (CHA). Has no effect on undead or constructs.",
      notes: "At Higher Levels: +1d8 per slot level above 1st.",
      tags: ["healing"], pinned: false, inUse: true,
    },
    {
      id: 202, name: "Divine Smite", level: "1. poziom", school: "Wywoływanie",
      castingTime: "1 bonus action", zakres: "Self", duration: "Concentration, up to 1 minute",
      components: "V",
      description: "Your next weapon hit deals an extra 2d8 radiant damage. Against undead or fiends — 3d8.",
      notes: "At Higher Levels: +1d8 per slot level above 1st.",
      tags: ["damage", "combat"], pinned: false, inUse: true,
    },
    {
      id: 203, name: "Protection from Evil and Good", level: "1. poziom", school: "Odrzucanie",
      castingTime: "1 action", zakres: "Touch", duration: "Concentration, up to 10 minutes",
      components: "V, S, M (holy water)",
      description: "One willing creature is protected from aberrations, celestials, fiends, undead, and fey. Attacks by those creature types are made with disadvantage.",
      notes: "",
      tags: ["protection"], pinned: false, inUse: true,
    },
    {
      id: 204, name: "Command", level: "1. poziom", school: "Surogacja",
      castingTime: "1 action", zakres: "60 ft", duration: "1 round",
      components: "V",
      description: "You speak a one-word command to a creature you can see. The target makes a WIS saving throw. On a failure, it follows the command (e.g., Flee!, Grovel!, Approach!, Halt!).",
      notes: "Useful for splitting enemies or stopping escapes.",
      tags: ["control", "enchantment"], pinned: false, inUse: false,
    },
  ];

  /* ── ABILITIES / FEATURES ──────────────────────── */
  const skills = [
    {
      id: 301, name: "Extra Attack", category: "Umiejętność",
      description: "When you take the Attack action, you can make one additional weapon attack as a bonus action on the same turn.",
      level: 3, tags: ["combat", "bonus-action"], pinned: false, inUse: true,
    },
    {
      id: 302, name: "Lay on Hands", category: "Cecha rasowa",
      description: "You have a pool of 25 HP per day. As an action, touch a creature to restore any number of HP from the pool. Alternatively, spend 5 HP to cure one disease or poison.",
      level: 2, tags: ["healing", "paladin"], pinned: false, inUse: true,
    },
    {
      id: 303, name: "Divine Sense", category: "Cecha rasowa",
      description: "As an action, you open your awareness to higher powers. Until the end of your next turn, you know the location of any undead, fiend, or celestial within 60 ft — even through walls.",
      level: 1, tags: ["detection", "paladin"], pinned: false, inUse: false,
    },
    {
      id: 304, name: "Aura of Courage", category: "Atut",
      description: "Friendly creatures within 10 ft of you can't be frightened while you are conscious. (Available from 10th level — John's goal)",
      level: 0, tags: ["aura", "goal"], pinned: false, inUse: false,
    },
  ];

  /* ── NPCS ──────────────────────────────────────── */
  const npcs = [
    {
      id: 401, name: "Elara Moonwhisper", role: "Priest of Mystra",
      relation: "ally", affiliation: "Temple of Mystra",
      metAt: "Baldur's Gate — The Golden Horseshoe Tavern",
      connections: "Informant, ally, potion supplier",
      notes: "An elf with silver hair and piercing violet eyes. Has extensive knowledge of the cult — studying their rituals for years. Completely trustworthy. Currently at the Temple of Mystra in Baldur's Gate. Mentioned tunnels under the Old District.",
      tags: ["priest", "elf", "ally"], pinned: true,
    },
    {
      id: 402, name: "Mrak Thornwood", role: "Dark Knight of the Cult",
      relation: "hostile", affiliation: "Dragon Blood Cult",
      metAt: "Shadow Cave",
      connections: "Local cult leader, wanted by the Guard",
      notes: "Tall man in black armor bearing a demoness symbol. Defeated in the Shadow Cave but escaped through a hidden exit. Likely seeking revenge. DANGEROUS — fights without honor.",
      tags: ["cult", "enemy", "wanted"], pinned: false,
    },
    {
      id: 403, name: "Barlin Copperbeard", role: "Innkeeper",
      relation: "neutral", affiliation: "The Golden Horseshoe Tavern",
      metAt: "Baldur's Gate — The Golden Horseshoe Tavern",
      connections: "Source of rumors, message relay",
      notes: "A stout dwarf with a silver braided beard. Friendly and discreet — shares information about travelers for the right coin. Hates trouble. Knows everyone in town.",
      tags: ["innkeeper", "dwarf", "informant"], pinned: false,
    },
    {
      id: 404, name: "Sir Aldric Vance", role: "Commander of the Eastern Guard",
      relation: "ally", affiliation: "Baldur's Gate City Watch",
      metAt: "East Gate, Baldur's Gate",
      connections: "Official city support, issues passes",
      notes: "An older knight with a tired but noble gaze. Helped during entry to the city. Believes the cult still operates underground. The Watch is overstretched and can't act outside the walls.",
      tags: ["knight", "guard", "official"], pinned: false,
    },
  ];

  /* ── LOCATIONS ─────────────────────────────────── */
  const locations = [
    {
      id: 501, name: "Baldur's Gate", type: "Osada",
      notes: "A great port city — a bustling marketplace and political center of the region. Home to the Temple of Mystra, the Merchant Guild, and the City Watch. The Dragon Blood Cult reportedly operates in the Old District underground. A safe place to rest.",
      tags: ["city", "port", "base"], pinned: false,
    },
    {
      id: 502, name: "Shadow Cave", type: "Podziemia",
      notes: "A dark cave 3 days east of Baldur's Gate, hidden behind a waterfall in Cloak Wood. Was the cult's base. During session 3 found a Longsword +1 and a Detect Evil scroll. Mrak Thornwood escaped through a secret eastern exit.",
      tags: ["cave", "cult", "exploration"], pinned: true,
    },
    {
      id: 503, name: "The Golden Horseshoe Tavern", type: "Budynek",
      notes: "A cozy tavern in central Baldur's Gate, run by Barlin Copperbeard. Good food, cheap rooms — 5 sp/night. A regular meeting spot. Barlin always knows what's happening in town.",
      tags: ["tavern", "base", "rest"], pinned: false,
    },
    {
      id: 504, name: "Temple of Mystra", type: "Budynek",
      notes: "A grand temple in Baldur's Gate's western district — white and gold architecture, always open to the faithful. Elara Moonwhisper's base. Safe haven, large library with cult information. Can buy potions and scrolls here.",
      tags: ["temple", "safe", "shopping"], pinned: false,
    },
  ];

  /* ── SESSIONS ──────────────────────────────────── */
  const sessions = [
    {
      id: 601, number: 1,
      date: "2025-03-15",
      title: "Arrival in Baldur's Gate",
      notes: "John Silverblade arrived in Baldur's Gate after a week-long journey from the north. At The Golden Horseshoe Tavern he met Elara Moonwhisper — an elven priestess who warned him of increased Dragon Blood Cult activity near the city. Barlin Copperbeard over a pint told him about missing cargo from port warehouses and a group of strangers in black cloaks who stayed three nights ago.",
    },
    {
      id: 602, number: 2,
      date: "2025-03-22",
      title: "Caravan Ambush",
      notes: "The party accepted a Merchant Guild caravan escort. Halfway between Baldur's Gate and Forest Gate, cultists attacked from the woods. John Silverblade stopped Mrak Thornwood from escaping with a valuable parchment — a list of cult agents in the city. Elara Moonwhisper identified the symbol on their armor as the Dragon Blood Cult mark. Sir Aldric Vance, after our report, ordered increased patrols at East Gate.",
    },
    {
      id: 603, number: 3,
      date: "2025-04-05",
      title: "Assault on the Shadow Cave",
      notes: "Using the map from Mrak, we reached the Shadow Cave. John led the party past the entrance traps. We defeated the cult guards and reached the main chamber — found an altar and a chest of scrolls. Mrak Thornwood escaped through a hidden eastern exit. Acquired a Longsword +1 and the Detect Evil scroll. Elara Moonwhisper confirmed the Order's relic wasn't stored here — search continues.",
    },
  ];

  /* ── QUESTS ────────────────────────────────────── */
  const quests = [
    {
      id: 701,
      name: "Recover the Holy Relic",
      description: "The Dragon Blood Cult stole the Order's relic. A copy found in the Shadow Cave suggests the original is deeper in the cult's organization.",
      reward: "Order's Blessing + 5000 gp",
      status: "Aktywne",
      kroks: [
        { id: 7011, text: "Reach the Shadow Cave", done: true },
        { id: 7012, text: "Defeat the cult guards", done: true },
        { id: 7013, text: "Find the map of the cult's main base", done: false },
        { id: 7014, text: "Recover the relic from the cult", done: false },
      ],
    },
    {
      id: 702,
      name: "Eliminate Mrak Thornwood",
      description: "The Dark Knight escaped and is seeking revenge. He knows our faces and our route.",
      reward: "800 gp bounty from the City Watch + personal vendetta resolved",
      status: "Aktywne",
      kroks: [
        { id: 7021, text: "Track Mrak's whereabouts", done: false },
        { id: 7022, text: "Confront and neutralize Mrak", done: false },
      ],
    },
    {
      id: 703,
      name: "Find the Cult's City Agents",
      description: "The parchment taken from Mrak contains a list of cult agents operating in Baldur's Gate. Sir Aldric needs this decoded.",
      reward: "City Watch commendation + free lodging at the barracks",
      status: "Ukończone",
      kroks: [
        { id: 7031, text: "Deliver the parchment to Sir Aldric Vance", done: true },
        { id: 7032, text: "Work with Elara Moonwhisper to decode the list", done: true },
      ],
    },
  ];

  /* ── FACTIONS ──────────────────────────────────── */
  const factions = [
    {
      id: 801, name: "Order of the Silver Flame", type: "Zakon",
      rank: "Oficer", leader: "High Commander Yriel Dawnblade",
      headquarters: "Silver Citadel, northern mountains",
      goal: "Protect the innocent and destroy supernatural evil across the realm",
      notes: "John's home order. They sent him on this mission to recover the stolen relic. They have resources but are spread thin across the continent. Contact: send a silver raven to the Citadel.",
      tags: ["order", "home", "paladin"], pinned: true, reputation: 80,
    },
    {
      id: 802, name: "Dragon Blood Cult", type: "Kult",
      rank: "Wróg", leader: "Unknown supreme leader",
      headquarters: "Unknown — likely underground",
      goal: "Summon a dragon god through stolen sacred artifacts",
      notes: "Enemy faction. Operates in cells — each cell knows little of the others. Mrak Thornwood is their regional leader. Members identified by a demoness tattoo on the left wrist.",
      tags: ["cult", "enemy", "dangerous"], pinned: false, reputation: -90,
    },
    {
      id: 803, name: "Baldur's Gate City Watch", type: "Armia",
      rank: "Sojusznik", leader: "Sir Aldric Vance",
      headquarters: "East Gate Barracks, Baldur's Gate",
      goal: "Maintain law and order in the city",
      notes: "Useful allies within the city. Overstretched — can't act outside the walls. Help with passes and official backing. Sir Aldric trusts John after the caravan report.",
      tags: ["guard", "official", "ally"], pinned: false, reputation: 40,
    },
  ];

  const profile = {
    id, name: char.name,
    class: char.classes[0]?.name || "",
    level: char.classes[0]?.level || 1,
    created: Date.now(),
  };

  return { id, profile, char, inventory, spells, skills, npcs, locations, sessions, quests, factions };
}
