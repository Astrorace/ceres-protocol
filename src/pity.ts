export const APEX_SOFT_PITY_START = 41 as const;
export const APEX_HARD_PITY_LIMIT = 60 as const;
export const APEX_BASE_LEGENDARY_RATE = 0.025 as const;
export const APEX_SOFT_PITY_STEP = 0.04875 as const;

export function apexLegendaryProbability(openingNumber: number): number {
  if (openingNumber < 1) throw new RangeError('openingNumber must be >= 1');
  if (openingNumber >= APEX_HARD_PITY_LIMIT) return 1.0;
  if (openingNumber < APEX_SOFT_PITY_START) return APEX_BASE_LEGENDARY_RATE;
  const steps = openingNumber - APEX_SOFT_PITY_START + 1;
  return Math.min(1.0, Number((APEX_BASE_LEGENDARY_RATE + steps * APEX_SOFT_PITY_STEP).toFixed(6)));
}
