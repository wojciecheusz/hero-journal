import { chromium } from 'file:///C:/Users/mwoj/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { createSampleHero } from './src/constants/sampleHero.js';

const hero = createSampleHero();
const { id, profile, char, inventory, npcs, locations, skills, spells, sessions, quests, factions } = hero;
const slots = { char, inventory, npcs, locations, skills, spells, sessions, quests, factions };

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
await page.goto('http://localhost:5178/');

await page.evaluate(({ id, profile, slots }) => {
  for (const [slot, val] of Object.entries(slots)) {
    localStorage.setItem(`hj_${slot}_${id}`, JSON.stringify(val));
  }
  localStorage.setItem('hj_profiles', JSON.stringify([profile]));
  localStorage.setItem('hj_active_profile', JSON.stringify(id));
}, { id, profile, slots });

await page.reload();
await page.waitForTimeout(1500);
await page.screenshot({ path: '__s_app.png' });

await browser.close();
console.log('seeded id', id);
