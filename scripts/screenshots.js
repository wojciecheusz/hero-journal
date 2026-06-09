/**
 * Automatyczne screenshoty PWA na potrzeby manifestu / sklepu.
 *
 * Użycie:
 *   1. npm run dev  (w osobnym terminalu)
 *   2. node scripts/screenshots.js
 *
 * Skrypt otworzy przeglądarkę. Zaloguj się. Naciśnij Enter w terminalu.
 * Reszta dzieje się automatycznie — 10 plików trafia do public/screenshots/.
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __dir  = path.dirname(fileURLToPath(import.meta.url));
const OUT    = path.join(__dir, '..', 'public', 'screenshots');
const DEV    = 'http://localhost:5173';
const ID     = 'screenshot_demo';

/* ── Sample data ──────────────────────────────────────────────── */

const SAMPLE = {
  hj_profiles:       [{ id: ID, name: 'Aelindra', class: 'Wizard', level: 5 }],
  hj_active_profile: ID,
  hj_lang:           'en',
  hj_tutorial_seen:  '1',
  [`hj_char_${ID}`]: {
    name: 'Aelindra Moonweave', race: 'High Elf', background: 'Sage',
    alignment: 'Chaotic Good',
    classes: [{ name: 'Wizard', level: 5 }],
    stats: { STR: 8, DEX: 14, CON: 13, INT: 18, WIS: 12, CHA: 10 },
    profBonus: 3, hp: { current: 28, max: 32, temp: 0 }, ac: 13,
    xp: 6500, speed: 30, coins: { gold: 45, silver: 12, copper: 7 },
    spellcastingAbility: 'INT',
    hitDice: { type: 'd6', max: 5, used: 1 },
    spellSlots: { level1: { max: 4, used: 1 }, level2: { max: 3, used: 0 }, level3: { max: 2, used: 1 } },
    savingThrows: { int: true, wis: true }, savingThrowExp: {}, savingThrowOverride: {},
    skills: {}, skillExp: {}, conditions: {}, deathSaves: { successes: 0, failures: 0 },
    traits: {
      personality: 'Always calm, even in the most dangerous situations.',
      ideals: 'Knowledge is the greatest power.',
      bonds: 'I seek a lost tome of forbidden magic.',
      flaws: 'I am convinced no one can match my intellect.',
    },
    backstory: 'Born under the pale moonlight of the Elvish forests, Aelindra discovered her gift for magic early in life.',
    proficiencies: { weapons: 'Daggers, darts, quarterstaffs', armor: 'None', languages: 'Common, Elvish, Draconic', tools: '' },
  },
  [`hj_inventory_${ID}`]: [
    { id:1, name:'Arcane Focus (Crystal)', type:'wondrous',    qty:'1', equipped:true,  tags:['passive'], pinned:true,  effect:'+1 spell attacks',      note:'Heirloom from mentor' },
    { id:2, name:'Dagger of Returning',    type:'weapon',      qty:'1', equipped:true,  tags:['action'],  pinned:true,  damage:'1d4', damageType:'piercing', modifier:'2', note:'Returns to hand after throwing' },
    { id:3, name:'Potion of Healing',      type:'consumable',  qty:'3', equipped:false, tags:[],          pinned:false, charges:'1',  effect:'Restores 2d4+2 HP' },
    { id:4, name:'Spellbook',              type:'wondrous',    qty:'1', equipped:true,  tags:[],          pinned:false, effect:'Required for spell prep', note:'Contains 32 spells' },
    { id:5, name:'Mage Armor Scroll',      type:'spell_scroll',qty:'1', equipped:false, tags:[],          pinned:false, charges:'1',  effect:'Cast Mage Armor without a spell slot' },
    { id:6, name:'Rope, Hempen (50 ft)',   type:'general',     qty:'1', equipped:false, tags:[],          pinned:false },
  ],
  [`hj_spells_${ID}`]: [
    { id:1, name:'Fire Bolt',    level:'cantrip', school:'evocation',   castingTime:'1 action',       zakres:'120 ft', duration:'Instantaneous', components:'V, S',    inUse:true,  tags:['action'],       description:'A mote of fire hurls toward a creature within range.' },
    { id:2, name:'Mage Hand',    level:'cantrip', school:'conjuration', castingTime:'1 action',       zakres:'30 ft',  duration:'1 minute',      components:'V, S',    inUse:true,  tags:['action'],       description:'A spectral floating hand appears at a point you choose.' },
    { id:3, name:'Shield',       level:'level1',  school:'abjuration',  castingTime:'1 reaction',     zakres:'Self',   duration:'1 round',       components:'V, S',    inUse:true,  tags:['reaction'],     description:'+5 bonus to AC until the start of your next turn.' },
    { id:4, name:'Magic Missile',level:'level1',  school:'evocation',   castingTime:'1 action',       zakres:'120 ft', duration:'Instantaneous', components:'V, S',    inUse:false, tags:['action'],       description:'Three darts of magical force hit creatures of your choice.' },
    { id:5, name:'Misty Step',   level:'level2',  school:'conjuration', castingTime:'1 bonus action', zakres:'Self',   duration:'Instantaneous', components:'V',       inUse:true,  tags:['bonus action'], description:'Teleport up to 30 feet to an unoccupied space you can see.' },
    { id:6, name:'Web',          level:'level2',  school:'conjuration', castingTime:'1 action',       zakres:'60 ft',  duration:'1 hour',        components:'V, S, M', inUse:false, tags:['action'],       description:'Thick, sticky webbing fills a 20-foot cube.' },
    { id:7, name:'Fireball',     level:'level3',  school:'evocation',   castingTime:'1 action',       zakres:'150 ft', duration:'Instantaneous', components:'V, S, M', inUse:true,  tags:['action'],       description:'8d6 fire damage in a 20-foot radius sphere.', notes:'Upcast: +1d6 per slot level above 3rd' },
    { id:8, name:'Counterspell', level:'level3',  school:'abjuration',  castingTime:'1 reaction',     zakres:'60 ft',  duration:'Instantaneous', components:'S',       inUse:true,  tags:['reaction'],     description:'Interrupt a creature in the process of casting a spell.' },
  ],
  [`hj_skills_${ID}`]: [
    { id:1, name:'Arcane Recovery',       category:'feat',           description:'Once per day, recover expended spell slots totaling half wizard level.', inUse:true, tags:[],           pinned:true  },
    { id:2, name:'Portent',               category:'feat',           description:'Roll two d20s after a long rest. Replace any roll with one of these.',    inUse:true, tags:['passive'],  pinned:true  },
    { id:3, name:'Darkvision',            category:'racial_feature', description:'See in dim light within 60 ft as if bright light.',                       inUse:true, tags:['passive'],  pinned:false },
    { id:4, name:'Fey Ancestry',          category:'racial_feature', description:'Advantage on saves against being charmed. Cannot be magically slept.',    inUse:true, tags:['passive'],  pinned:false },
    { id:5, name:'Cantrip Formulas',      category:'feat',           description:'Change one wizard cantrip when finishing a long rest.',                   inUse:true, tags:['passive'],  pinned:false },
  ],
  [`hj_sessions_${ID}`]: [
    { id:1, number:12, title:'The Whispering Ruins',  date:'2024-06-01', xp:850,  pinned:true,  summary:'The party ventured into the ancient elvish ruins north of Silverdale. Aelindra deciphered arcane inscriptions revealing a connection to the Archmage Velaryn. A trap nearly ended Tormin — a timely Shield spell saved him. The vault held a fragment of the Codex of Eternity.', notes:'Gained: Codex Fragment I\nTormin trust +1\nVelaryn connection established' },
    { id:2, number:11, title:'Market Day Ambush',     date:'2024-05-25', xp:600,  pinned:false, summary:"While restocking in Silverdale, the party was ambushed by Shadow Conclave agents. Aelindra's Fireball turned the tide — though it also set the baker's stall ablaze.", notes:'Shadow Conclave now aware of party\nBaker demands 15gp reparations' },
    { id:3, number:10, title:'Secrets of Thornwood',  date:'2024-05-18', xp:750,  pinned:false, summary:'Exploration of the Thornwood revealed a hidden druid grove and an alliance with the Circle of Ash. The druids shared information about the Ley Lines beneath the forest.', notes:'Circle of Ash allied\nLey line map acquired' },
  ],
  [`hj_npcs_${ID}`]: [
    { id:1, name:'Tormin Ironforge',  relationship:'ally',    description:'Dwarven paladin, steadfast companion. Protective and occasionally overprotective.', notes:'Owes Aelindra a life debt (Session 12)', pinned:true,  tags:[] },
    { id:2, name:'Velaryn',           relationship:'unknown', description:'Ancient elvish archmage, supposedly dead for 300 years. Connected to the Codex of Eternity.',                                           notes:'His phylactery may still exist',           pinned:true,  tags:['archmage'] },
    { id:3, name:'Lady Seraphina',    relationship:'neutral', description:'Guild master of the Silverdale Merchant Alliance. Knows far more than she admits.',                                                    notes:'Useful but has her own agenda',            pinned:false, tags:[] },
    { id:4, name:'Kira',              relationship:'ally',    description:'Young half-elf rogue with quick fingers and quicker wit. Joined the party in Thornwood.',                                              notes:'',                                         pinned:false, tags:[] },
  ],
  [`hj_locations_${ID}`]: [
    { id:1, name:'Silverdale',         type:'settlement', notes:'Hub city. Population ~12,000. Ruled by the Council of Five Lanterns.',               tags:['city'],    pinned:true  },
    { id:2, name:'Whispering Ruins',   type:'ruins',      notes:'Ancient elvish structure. Vault partially explored. More levels below.',             tags:[],          pinned:true  },
    { id:3, name:'Thornwood',          type:'wilderness', notes:'Dense enchanted forest east of Silverdale. Home to the Circle of Ash druids.',       tags:[],          pinned:false },
    { id:4, name:'Circle of Ash Grove',type:'building',   notes:'Hidden druid sanctuary in Thornwood. Party is allied with them.',                    tags:[],          pinned:false },
  ],
  [`hj_quests_${ID}`]: [
    { id:1, name:'The Codex of Eternity',   status:'active',    reward:'Legendary tome, Velaryn\'s secrets', description:'Seek the three fragments of the Codex scattered across the realm. Fragment I retrieved from the Whispering Ruins.', steps:[ { id:1, text:'Find Fragment I — Whispering Ruins', done:true }, { id:2, text:'Find Fragment II — rumoured in the Sunken Library', done:false }, { id:3, text:'Find Fragment III — location unknown', done:false }, { id:4, text:'Reassemble the Codex', done:false } ], pinned:true  },
    { id:2, name:'Silence the Shadow Conclave', status:'active', reward:'500 gp bounty + guild contacts',   description:'The Shadow Conclave ambushed the party in Silverdale. Eliminate their local cell before they strike again.', steps:[ { id:1, text:'Identify the Conclave contact in Silverdale', done:true }, { id:2, text:'Track the cell to their hideout', done:false }, { id:3, text:'Neutralise the threat', done:false } ], pinned:true  },
    { id:3, name:'Baker\'s Reparations',    status:'active',    reward:'Good standing in Silverdale',        description:'Aelindra\'s Fireball destroyed the baker\'s stall. Pay 15 gp in reparations before the guards get involved.', steps:[ { id:1, text:'Pay 15 gp to Harwin the Baker', done:false } ], pinned:false },
    { id:4, name:'The Ley Line Convergence',status:'active',    reward:'Circle of Ash alliance strengthened',description:'The druids shared a map of ley lines beneath Thornwood. Investigate the convergence point before the next solstice.', steps:[ { id:1, text:'Receive the ley line map', done:true }, { id:2, text:'Locate the convergence point', done:false }, { id:3, text:'Perform the ritual at the convergence', done:false } ], pinned:false },
  ],
};

/* ── Helpers ──────────────────────────────────────────────────── */

function waitForEnter(msg) {
  return new Promise(resolve => {
    console.log(msg);
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question('', () => { rl.close(); resolve(); });
  });
}

async function seed(page) {
  await page.evaluate((data) => {
    Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, JSON.stringify(v)));
  }, SAMPLE);
}

// Desktop sidebar navigation — pewniejsze niż locator text=
async function desktopNav(page, tabText) {
  const clicked = await page.evaluate((text) => {
    for (const btn of document.querySelectorAll('.hj-sidebar-item')) {
      for (const span of btn.querySelectorAll('span')) {
        if (span.textContent.trim() === text) { btn.click(); return true; }
      }
    }
    return false;
  }, tabText);
  console.log(`    sidebar "${tabText}": ${clicked ? 'clicked' : 'NOT FOUND'}`);
  await page.waitForTimeout(500);
}

// Klik ogólny (przyciski subtabów w treści)
async function click(page, text, timeout = 4000) {
  try {
    await page.locator(`text="${text}"`).first().click({ timeout });
  } catch {
    // silently ignore
  }
}

// Mobile: bezpośrednie querySelector w przeglądarce — bardziej niezawodne niż locatory
async function mobileNav(page, groupLabel, tabLabel) {
  // Kliknij grupę (Hero / World / Journal)
  const groupClicked = await page.evaluate((label) => {
    for (const btn of document.querySelectorAll('.hj-nav-btn')) {
      const lbl = btn.querySelector('.hj-nav-label');
      if (lbl && lbl.textContent.trim() === label) { btn.click(); return true; }
    }
    return false;
  }, groupLabel);
  console.log(`    group "${groupLabel}": ${groupClicked ? 'clicked' : 'NOT FOUND'}`);
  await page.waitForTimeout(600);

  if (!tabLabel) return;

  // Sprawdź czy szuflada jest otwarta
  const drawerOpen = await page.evaluate(() => !!document.querySelector('.nav-drawer'));
  console.log(`    drawer open: ${drawerOpen}`);
  if (!drawerOpen) return;

  // Kliknij subtab w szufladzie
  const tabClicked = await page.evaluate((label) => {
    for (const item of document.querySelectorAll('.nav-drawer-item')) {
      const lbl = item.querySelector('.nav-drawer-label');
      if (lbl && lbl.textContent.trim() === label) { item.click(); return true; }
    }
    // fallback: loguj co jest dostępne
    const available = [...document.querySelectorAll('.nav-drawer-label')].map(l => l.textContent.trim());
    console.warn('drawer labels:', available);
    return false;
  }, tabLabel);
  console.log(`    tab "${tabLabel}": ${tabClicked ? 'clicked' : 'NOT FOUND'}`);
  await page.waitForTimeout(400);
}

// Rozwiń wszystkie wpisy na bieżącej stronie
async function expandAll(page) {
  // Czekaj aż elementy toggleable pojawią się w DOM (zamiast ślepego sleep)
  await page.waitForSelector('.entity-toggle, .sess-header', { timeout: 6000 }).catch(() => {});
  await page.waitForTimeout(400); // dodatkowy czas na pełny render
  const count = await page.evaluate(() => {
    let n = 0;
    // Entity listy: NPCs, Lokacje, Frakcje, Plecak, Czary, Zdolności, Zadania
    for (const btn of document.querySelectorAll('.entity-toggle')) {
      if (btn.textContent.trim() === '▼') { btn.click(); n++; }
    }
    // Sesje — toggle na nagłówku
    for (const hdr of document.querySelectorAll('.sess-header')) {
      if (hdr.textContent.includes('▼')) { hdr.click(); n++; }
    }
    return n;
  });
  console.log(`    expanded ${count} entries`);
  if (count > 0) await page.waitForTimeout(400);
}

async function shot(page, name) {
  await page.waitForTimeout(600);
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`  ✓ ${name}.png`);
}

/* ── Desktop tabs (sidebar navigation) ───────────────────────── */
const DESKTOP_SHOTS = [
  async (page) => {
    await desktopNav(page, 'Character');
    await shot(page, 'pc-character');
  },
  async (page) => {
    await desktopNav(page, 'Equipment');
    await click(page, 'Inventory', 3000);
    await shot(page, 'pc-inventory');
  },
  async (page) => {
    await desktopNav(page, 'Quests');
    await expandAll(page);
    await shot(page, 'pc-quests');
  },
  async (page) => {
    await desktopNav(page, 'World');
    await expandAll(page);
    await shot(page, 'pc-world');
  },
  async (page) => {
    await desktopNav(page, 'Chronicle');
    await expandAll(page);
    await shot(page, 'pc-sessions');
  },
];

/* ── Mobile tabs (bottom drawer navigation) ──────────────────── */
const MOBILE_SHOTS = [
  async (page) => { await mobileNav(page, 'Hero',    'Character'); await shot(page, 'mobile-character'); },
  async (page) => { await mobileNav(page, 'Hero',    'Inventory'); await shot(page, 'mobile-inventory'); },
  async (page) => { await mobileNav(page, 'Hero',    'Spells');    await shot(page, 'mobile-spells');    },
  async (page) => { await mobileNav(page, 'World', 'Characters'); await expandAll(page); await shot(page, 'mobile-world');    },
  async (page) => { await mobileNav(page, 'Journal', 'Chronicle'); await expandAll(page); await shot(page, 'mobile-sessions'); },
];

/* ── Main ─────────────────────────────────────────────────────── */

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  // Użyj zainstalowanego Chrome lub Edge zamiast pobierać osobne Chromium
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
  }).catch(() => chromium.launch({
    headless: false,
    channel: 'msedge',
  })).catch(() => chromium.launch({ headless: false })); // fallback: Playwright Chromium

  // -- Login phase (one-time, visible browser) --
  const setupCtx  = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const setupPage = await setupCtx.newPage();
  await setupPage.goto(DEV);
  await seed(setupPage);
  await setupPage.reload();
  await setupPage.waitForLoadState('networkidle');

  // Check if we landed on the login screen
  const needsLogin = await setupPage.locator('button:has-text("Google")').count() > 0;
  if (needsLogin) {
    await waitForEnter('\n👤  Zaloguj się w oknie przeglądarki, a następnie naciśnij ENTER...\n');
    await seed(setupPage);
    await setupPage.reload();
    await setupPage.waitForLoadState('networkidle');
  }

  // Save auth state so we don't need to log in again for each viewport
  const storageState = await setupCtx.storageState();
  await setupCtx.close();

  // -- Screenshot phase --
  for (const [vp, shots] of [
    [{ width: 1920, height: 1080 }, DESKTOP_SHOTS],
    [{ width: 390,  height: 844  }, MOBILE_SHOTS ],
  ]) {
    console.log(`\n📸  ${vp.width}×${vp.height}`);
    const ctx  = await browser.newContext({ viewport: vp, storageState });
    const page = await ctx.newPage();
    await page.goto(DEV);
    await seed(page);
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(800);

    for (const take of shots) await take(page);
    await ctx.close();
  }

  await browser.close();
  console.log(`\n✅  Gotowe! Pliki w public/screenshots/\n`);
}

main().catch(err => { console.error(err); process.exit(1); });
