import { chromium } from 'file:///C:/Users/mwoj/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { createSampleHero } from './src/constants/sampleHero.js';

const hero = createSampleHero();
const { id, profile, char, inventory, npcs, locations, skills, spells, sessions, quests, factions } = hero;
const slots = { char, inventory, npcs, locations, skills, spells, sessions, quests, factions };

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 480, height: 1000 }, deviceScaleFactor: 2 });
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
for (let i=0;i<8;i++){
  const btn = page.locator('button', { hasText: /DALEJ|Zamknij|Rozpocznij|POMIŃ|Zaczynamy/i });
  if (await btn.count()>0){ try{ await btn.first().click({timeout:1500}); await page.waitForTimeout(400);}catch{break;} } else break;
}
await page.waitForTimeout(500);

// find bottom nav, click Wyposażenie
const navBtn = page.locator('button:visible', { hasText: /Wyposażenie|Plecak/i });
console.log('nav count', await navBtn.count());
if (await navBtn.count()) { await navBtn.first().click(); await page.waitForTimeout(700); }
await page.screenshot({ path: '__m_equip.png' });
await browser.close();
