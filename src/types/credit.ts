
export type LoanStatus = 'repaid' | 'on_track' | 'due_soon' | 'overdue';


export interface ScorePillarBreakdown {
  score: number;                   // Final score between 300 and 850
  tier: CreditTier;                // Rating tier
  aumScore: number;                // Max 220 points from assets
  repaymentScore: number;          // Max 220 points from loan history
  diversityScore: number;          // Max 110 points from portfolio spread
  totalAUM: number;                // Total raw asset value
  weightedAUM: number;             // Liquidity-adjusted asset value
  activeDebt: number;              // Current total debt balance
}

export interface CreditProfileSummary {
  bell5Id: string;
  score: number;
  tier: CreditTier;
  verifiedAt: string;
}


export interface Loan {
  id: string;
  lender: string;
  purpose: string;
  principal: number;
  outstanding: number;
  status: LoanStatus;
  nextDueDate: string | null;
  updatedAt: string;
}

export interface CreditTier {
  level: 1 | 2 | 3 | 4;
  label: string;
  description: string;
}

export interface ScoreFactor {
  id: string;
  label: string;
  weight: number; // % of total score
  score: number; // 0-100
  note: string;
}

export interface ScorePoint {
  month: string;
  score: number;
}

export const LOAN_STATUS_META: Record<
  LoanStatus,
  { label: string; tone: 'green' | 'amber' | 'red' }
> = {
  repaid: { label: 'Repaid', tone: 'green' },
  on_track: { label: 'On track', tone: 'green' },
  due_soon: { label: 'Due soon', tone: 'amber' },
  overdue: { label: 'Overdue', tone: 'red' },
};