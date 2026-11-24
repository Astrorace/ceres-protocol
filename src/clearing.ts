export const M11_TOTAL_FEE_BPS = 500n;       // 5.00%
export const M11_PERMANENT_BURN_BPS = 250n;  // 2.50% burned to dead address
export const M11_CLAN_VAULT_BPS = 250n;      // 2.50% routed to Seasonal Clan Championship Vault
export const M11_SELLER_PAYOUT_BPS = 9500n;  // 95.00% instant payout to seller
export const BPS_DENOMINATOR = 10_000n;
export const M11_MIN_LOT_ATRC = 10n;

export interface ClearingSettlement {
  readonly grossAmountUnits: bigint;
  readonly sellerNetUnits: bigint;
  readonly burnedUnits: bigint;
  readonly clanVaultUnits: bigint;
}

/**
 * Computes exact atomic M11 marketplace clearing without floating-point rounding drift.
 * Lot amounts must be divisible by 40 atomic units so 2.5% splits remain integer-exact.
 */
export function computeM11Settlement(grossAmountUnits: bigint): ClearingSettlement {
  if (grossAmountUnits <= 0n || grossAmountUnits % 40n !== 0n) {
    throw new RangeError('Gross trade amount must be positive and divisible by 40 atomic units');
  }
  const burnedUnits = (grossAmountUnits * M11_PERMANENT_BURN_BPS) / BPS_DENOMINATOR;
  const clanVaultUnits = (grossAmountUnits * M11_CLAN_VAULT_BPS) / BPS_DENOMINATOR;
  const sellerNetUnits = grossAmountUnits - burnedUnits - clanVaultUnits;
  return { grossAmountUnits, sellerNetUnits, burnedUnits, clanVaultUnits };
}

export function washTradeResidualRatio(roundTrips: number): number {
  return Math.pow(0.95, roundTrips);
}
