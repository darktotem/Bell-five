import type { AllocationSlice, Asset, AssetType } from '../types/assets';
import { ASSET_TYPE_COLORS, ASSET_TYPE_LABELS } from '../types/assets';
import type { CreditTier } from '../types/credit';

export const MIN_SCORE = 300;
export const MAX_SCORE = 850;

export const LIQUIDITY_WEIGHTS: Record<AssetType, number> = {
  mobile_money: 1,
  mmf: 0.95,
  bank: 0.9,
  equity: 0.7,
  sacco: 0.6,
};

export function getTier(score: number): CreditTier {
  if (score >= 700) return { level: 1, label: 'Tier 1 (High)', description: 'Excellent standing. You qualify for the best lender terms.' };
  if (score >= 600) return { level: 2, label: 'Tier 2 (Good)', description: 'Good standing. Growing liquid assets will lift you to Tier 1.' };
  if (score >= 500) return { level: 3, label: 'Tier 3 (Fair)', description: 'Fair standing. Consistent repayments and savings will help.' };
  return { level: 4, label: 'Tier 4 (Building)', description: 'Still building. Link assets and repay on time to grow your score.' };
}

export const totalValue = (assets: Asset[]): number => assets.reduce((sum, a) => sum + a.value, 0);

export const weightedLiquidity = (assets: Asset[]): number =>
  assets.reduce((sum, a) => sum + a.value * LIQUIDITY_WEIGHTS[a.type], 0);

export function allocationByType(assets: Asset[]): AllocationSlice[] {
  const total = totalValue(assets);
  const byType = new Map<AssetType, number>();
  assets.forEach((a) => byType.set(a.type, (byType.get(a.type) ?? 0) + a.value));

  return [...byType.entries()]
    .map(([type, value]) => ({
      type,
      label: ASSET_TYPE_LABELS[type],
      value,
      pct: total ? (value / total) * 100 : 0,
      color: ASSET_TYPE_COLORS[type],
    }))
    .sort((a, b) => b.value - a.value);
}

/** Estimated score boost from a new MMF deposit (diminishing returns). */
export function estimateBoost(assets: Asset[], deposit: number, currentScore: number): number {
  const w = LIQUIDITY_WEIGHTS.mmf;
  const existingMmf = assets.filter((a) => a.type === 'mmf').reduce((s, a) => s + a.value, 0);
  const headroom = Math.exp(-(existingMmf * w) / 600000);
  const raw = 40 * headroom * (1 - Math.exp(-(deposit * w) / 150000));
  return Math.max(0, Math.min(Math.round(raw), MAX_SCORE - currentScore));
}