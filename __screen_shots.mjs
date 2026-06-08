import { chromium } from 'file:///C:/Users/mwoj/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { createSampleHero } from './src/constants/sampleHero.js';

const hero = createSampleHero();
const { id, profile, char, inventory, npcs, locations, skills, spells, sessions, quests, factions } = hero;
const slots = { char, inventory, npcs, locations, skills, spells, sessions, quests, factions };

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1500, height: 1100 }, deviceScaleFactor: 4 });
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

await page.locator('button', { hasText: '🎒Wyposażenie' }).first().click();
await page.waitForTimeout(800);
let el = page.locator('.pack-item-header').first();
await el.scrollIntoViewIfNeeded();
await el.screenshot({ path: '__z_equip_header.png' });

await page.locator('button', { hasText: '🌍Świat' }).first().click();
await page.waitForTimeout(800);
el = page.locator('.rel-badge').first();
await el.scrollIntoViewIfNeeded();
await el.screenshot({ path: '__z_rel_badge.png' });

const locTab = page.locator('button', { hasText: /Lokacje/i });
if (await locTab.count()>0){ await locTab.first().click(); await page.waitForTimeout(600);
  el = page.locator('.loc-type').first();
  await el.scrollIntoViewIfNeeded();
  await el.screenshot({ path: '__z_loc_type.png' });
}

const facTab = page.locator('button', { hasText: /Frakcje/i });
if (await facTab.count()>0){ await facTab.first().click(); await page.waitForTimeout(600);
  el = page.locator('button[aria-label^="Change rank"]').first();
  await el.scrollIntoViewIfNeeded();
  await el.screenshot({ path: '__z_fac_rank.png' });
}

await browser.close();
