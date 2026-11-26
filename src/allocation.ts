export interface AllocationPool {
  readonly id: string;
  readonly label: string;
  readonly sharePercent: number;
  readonly totalTokens: number;
  readonly tgeUnlockPercent: number;
  readonly tgeTokens: number;
  readonly cliffMonths: number;
  readonly linearVestingMonths: number;
}

export const ATRC_CHAIN = 'BNB Chain (BEP-20)' as const;
export const ATRC_MAX_SUPPLY = 200_000_000 as const;
export const ATRC_INITIAL_CIRCULATING_SUPPLY = 20_600_000 as const;
export const ATRC_MINTING_DISABLED = true as const;
export const ATRC_GAMEPLAY_INFLATION_RATE = 0 as const;

export const ATRC_ALLOCATION_POOLS: readonly AllocationPool[] = [
  { id: 'community_ecosystem', label: 'Community & Ecosystem Incentives', sharePercent: 40, totalTokens: 80_000_000, tgeUnlockPercent: 5, tgeTokens: 4_000_000, cliffMonths: 0, linearVestingMonths: 48 },
  { id: 'treasury_reserve', label: 'Treasury & Ceres Reserve Vault', sharePercent: 20, totalTokens: 40_000_000, tgeUnlockPercent: 0, tgeTokens: 0, cliffMonths: 6, linearVestingMonths: 36 },
  { id: 'core_team', label: 'Core Team & Contributors', sharePercent: 15, totalTokens: 30_000_000, tgeUnlockPercent: 0, tgeTokens: 0, cliffMonths: 12, linearVestingMonths: 36 },
  { id: 'strategic_round', label: 'Strategic / Pre-TGE Round', sharePercent: 8, totalTokens: 16_000_000, tgeUnlockPercent: 10, tgeTokens: 1_600_000, cliffMonths: 3, linearVestingMonths: 18 },
  { id: 'community_airdrop', label: 'Community Airdrop & Early Pilots', sharePercent: 5, totalTokens: 10_000_000, tgeUnlockPercent: 100, tgeTokens: 10_000_000, cliffMonths: 0, linearVestingMonths: 0 },
  { id: 'liquidity_mm', label: 'Liquidity & Market Making (DEX/CEX)', sharePercent: 5, totalTokens: 10_000_000, tgeUnlockPercent: 50, tgeTokens: 5_000_000, cliffMonths: 0, linearVestingMonths: 24 },
  { id: 'advisors', label: 'Advisors & Industry Partners', sharePercent: 4, totalTokens: 8_000_000, tgeUnlockPercent: 0, tgeTokens: 0, cliffMonths: 6, linearVestingMonths: 24 },
  { id: 'security_bounty', label: 'Bug Bounty & Security Reserve', sharePercent: 3, totalTokens: 6_000_000, tgeUnlockPercent: 0, tgeTokens: 0, cliffMonths: 1, linearVestingMonths: 12 }
] as const;

export function unlockedTokensAtMonth(pool: AllocationPool, monthPostTge: number): number {
  if (monthPostTge <= 0) return pool.tgeTokens;
  const remaining = pool.totalTokens - pool.tgeTokens;
  if (remaining === 0 || pool.linearVestingMonths === 0) return pool.totalTokens;
  if (monthPostTge <= pool.cliffMonths) return pool.tgeTokens;
  const elapsed = Math.min(pool.linearVestingMonths, monthPostTge - pool.cliffMonths);
  return pool.tgeTokens + Math.floor((remaining * elapsed) / pool.linearVestingMonths);
}
