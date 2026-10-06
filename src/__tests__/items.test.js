import { describe, it, expect } from 'vitest';
import { hasCharges, chargesLeft, consumeOnce, setChargesUsed, restoreCharges, countRestorable } from '../utils/items.js';

const dagger = { id: 1, type: 'weapon', qty: '1', uses: { max: 3, used: 1, recharge: 'dawn' } };
const amulet = { id: 2, type: 'wondrous', qty: '1', uses: { max: 1, used: 1, recharge: 'long' } };
const ring   = { id: 3, type: 'wondrous', qty: '1', uses: { max: 2, used: 2, recharge: 'short' } };
const potion = { id: 4, type: 'consumable', qty: '2' };
const rope   = { id: 5, type: 'general', qty: '1' };

describe('charges', () => {
  it('reports charges left', () => {
    expect(hasCharges(dagger)).toBe(true);
    expect(chargesLeft(dagger)).toBe(2);
    expect(hasCharges(rope)).toBe(false);
    expect(chargesLeft({ uses: { max: 2, used: 9 } })).toBe(0);
  });
  it('uses one charge and stops at zero', () => {
    expect(consumeOnce(dagger).uses.used).toBe(2);
    expect(consumeOnce(ring)).toBe(ring);
  });
  it('uses one consumable by lowering quantity', () => {
    expect(consumeOnce(potion).qty).toBe('1');
    expect(consumeOnce({ ...potion, qty: '0' }).qty).toBe('0');
  });
  it('does nothing for plain items', () => {
    expect(consumeOnce(rope)).toBe(rope);
  });
  it('sets used charges within bounds', () => {
    expect(setChargesUsed(dagger, 5).uses.used).toBe(3);
    expect(setChargesUsed(dagger, -1).uses.used).toBe(0);
  });
});

describe('restoreCharges()', () => {
  const inv = [dagger, amulet, ring, potion, rope];
  it('short rest restores only short-rest items', () => {
    const r = restoreCharges(inv, 'short');
    expect(r.find(i => i.id === 3).uses.used).toBe(0);
    expect(r.find(i => i.id === 1).uses.used).toBe(1);
    expect(r.find(i => i.id === 2).uses.used).toBe(1);
    expect(countRestorable(inv, 'short')).toBe(1);
  });
  it('long rest restores short, long and dawn items', () => {
    const r = restoreCharges(inv, 'long');
    expect(r.filter(i => i.uses).every(i => i.uses.used === 0)).toBe(true);
    expect(countRestorable(inv, 'long')).toBe(3);
  });
  it('returns the same array when nothing changes', () => {
    expect(restoreCharges([rope, potion], 'long')).toEqual([rope, potion]);
  });
});
