//Temporary untill the reviews are there


// single function (deterministic, seeded from input)
export function seededValueInRange(input, { min = 3, max = 5, decimals = 2 } = {}) {
  // 1) create a 32-bit seed from the input using FNV-1a hash (works for numbers or strings)
  const s = String(input);
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  const seed = h >>> 0;

  // 2) mulberry32 PRNG (fast, small and deterministic)
  function mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const rnd = mulberry32(seed)(); // value in [0, 1)
  const value = min + rnd * (max - min);
  // round to requested decimals and return number
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
