import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ATRC_ALLOCATION_POOLS,
  ATRC_MAX_SUPPLY,
  ATRC_INITIAL_CIRCULATING_SUPPLY,
  unlockedTokensAtMonth,
  computeM11Settlement,
  washTradeResidualRatio,
  apexLegendaryProbability
} from '../src/index.ts';

test('ATRC supply sums to 200M with exact 20.6M (10.30%) TGE float', () => {
  const sumShares = ATRC_ALLOCATION_POOLS.reduce((acc, p) => acc + p.sharePercent, 0);
  const sumTotal = ATRC_ALLOCATION_POOLS.reduce((acc, p) => acc + p.totalTokens, 0);
  const sumTge = ATRC_ALLOCATION_POOLS.reduce((acc, p) => acc + p.tgeTokens, 0);
  assert.equal(sumShares, 100);
  assert.equal(sumTotal, ATRC_MAX_SUPPLY);
  assert.equal(sumTge, ATRC_INITIAL_CIRCULATING_SUPPLY);

  const team = ATRC_ALLOCATION_POOLS.find(p => p.id === 'core_team')!;
  assert.equal(unlockedTokensAtMonth(team, 0), 0);
  assert.equal(unlockedTokensAtMonth(team, 12), 0);
  assert.equal(unlockedTokensAtMonth(team, 48), 30_000_000);
});

test('M11 clearing splits 95% seller, 2.5% permanent burn, 2.5% clan vault atomically', () => {
  const res = computeM11Settlement(1000n * 40n);
  assert.equal(res.sellerNetUnits + res.burnedUnits + res.clanVaultUnits, 40_000n);
  assert.equal(res.sellerNetUnits, 38_000n);
  assert.equal(res.burnedUnits, 1_000n);
  assert.equal(res.clanVaultUnits, 1_000n);
  assert.ok(washTradeResidualRatio(14) < 0.49);
});

test('PRD soft and hard pity enforce 100% Legendary at container 60', () => {
  assert.equal(apexLegendaryProbability(1), 0.025);
  assert.ok(apexLegendaryProbability(41) > 0.07);
  assert.equal(apexLegendaryProbability(60), 1.0);
});
