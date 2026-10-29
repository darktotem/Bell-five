export type AssetType = 'mobile_money' | 'bank' | 'mmf' | 'sacco' | 'equity';



export interface Asset {
  id: string;
  name: string;
  provider: string;
  type: AssetType;
  value: number;
  verified: boolean;
  lastSynced: string; // ISO date
}

export interface Loan {
  id: string;
  lender: string;
  principalAmount: number;
  remainingBalance: number;
  status: 'active' | 'fully_paid' | 'defaulted';
  totalInstallments: number;
  onTimePayments: number;
  latePayments: number;
}

export const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  mobile_money: 'Mobile Money',
  bank: 'Bank',
  mmf: 'MMFs',
  sacco: 'SACCO Shares',
  equity: 'Equities',
}

export const ASSET_TYPE_COLORS: Record<AssetType, string> = {
  mobile_money: '#10b981',
  mmf: '#3b82f6',
  sacco: '#f59e0b',
  equity: '#8b5cf6',
  bank: '#06b6d4',
}

export interface AllocationSlice {
  type: AssetType;
  label: string;
  value: number;
  pct: number;
  color: string;
}