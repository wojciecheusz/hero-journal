
export const clamp = (n, lo, hi) => {
  return Math.max(lo, Math.min(hi, n));
};

export const statMod = (v) => {
  const m = Math.floor((v - 10) / 2);
  return m >= 0 ? `+${m}` : String(m);
};

export const numMod = (v) => {
  return v >= 0 ? `+${v}` : String(v);
};
