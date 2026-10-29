import type { Loan, ScoreFactor, ScorePoint } from '../types/credit';

export const mockLoans: Loan[] = [
  { id: 'ln-001', 
    lender: 'Umoja SACCO', 
    purpose: 'Emergency loan', principal: 60000, 
    outstanding: 24000, 
    status: 'on_track', 
    nextDueDate: '2026-11-05', 
    updatedAt: '2026-10-25' 
  },
  { id: 'ln-002', 
    lender: 'PesaFast', 
    purpose: 'Working capital', 
    principal: 20000, 
    outstanding: 20000, 
    status: 'due_soon', 
    nextDueDate: '2026-11-02', 
    updatedAt: '2026-10-22' },
  { id: 'ln-003', 
    lender: 'Umoja SACCO', 
    purpose: 'School fees', 
    principal: 45000, 
    outstanding: 0, 
    status: 'repaid', 
    nextDueDate: null, 
    updatedAt: '2026-09-28' 
  },
  { id: 'ln-004', 
    lender: 'PesaFast', 
    purpose: 'Stock purchase', 
    principal: 8000, 
    outstanding: 0, 
    status: 'repaid', 
    nextDueDate: null, 
    updatedAt: '2026-08-14' },
];


export const scoreFactors: ScoreFactor[] = [
  { id: 'f1', 
    label: 'Asset liquidity', 
    weight: 35, 
    score: 88, 
    note: 'Strong share of cash-like assets (M-Pesa, MMFs).' 
  },
  { id: 'f2', 
    label: 'Repayment history', 
    weight: 30, score: 92, 
    note: 'Two loans fully repaid on time.' 
  },
  { id: 'f3', 
    label: 'Diversification', 
    weight: 20, score: 72, 
    note: 'Spread across 4 asset classes.' 
  },
  { id: 'f4', 
    label: 'Account age', 
    weight: 15, score: 55, 
    note: 'Profile is under 12 months old.' 
  },
];

export const scoreHistory: ScorePoint[] = [
  { month: 'May', 
    score: 682 
  },
  { month: 'Jun', 
    score: 696 
  },
  { month: 'Jul', 
    score: 705 
  },
  { month: 'Aug', 
    score: 718 
  },
  { month: 'Sep', 
    score: 729 
  },
  { month: 'Oct', 
    score: 740 
  },
];

export const loansByUser: Record<string, Loan[]> = {
  'usr-001': mockLoans,
  'usr-002': [
    { id: 'ln-b1', lender: 'Harambee SACCO', purpose: 'Biashara loan', principal: 80000, outstanding: 52000, status: 'on_track', nextDueDate: '2026-11-10', updatedAt: '2026-10-20' },
    { id: 'ln-b2', lender: 'PesaFast', purpose: 'Rent top-up', principal: 15000, outstanding: 15000, status: 'due_soon', nextDueDate: '2026-11-01', updatedAt: '2026-10-18' },
    { id: 'ln-b3', lender: 'PesaFast', purpose: 'Airtime float', principal: 5000, outstanding: 0, status: 'repaid', nextDueDate: null, updatedAt: '2026-10-02' },
  ],
  'usr-003': [
    { id: 'ln-g1', lender: 'PesaFast', purpose: 'Emergency', principal: 10000, outstanding: 10000, status: 'overdue', nextDueDate: '2026-10-25', updatedAt: '2026-10-26' },
    { id: 'ln-g2', lender: 'Umoja SACCO', purpose: 'School fees', principal: 30000, outstanding: 22000, status: 'due_soon', nextDueDate: '2026-11-03', updatedAt: '2026-10-22' },
    { id: 'ln-g3', lender: 'PesaFast', purpose: 'Stock purchase', principal: 4000, outstanding: 0, status: 'repaid', nextDueDate: null, updatedAt: '2026-09-05' },
  ],
};

const factorsByUser: Record<string, ScoreFactor[]> = {
  'usr-001': scoreFactors,
  'usr-002': [
    { id: 'f1', label: 'Asset liquidity', weight: 35, score: 70, note: 'Moderate share of cash-like assets.' },
    { id: 'f2', label: 'Repayment history', weight: 30, score: 78, note: 'One loan repaid, one due soon.' },
    { id: 'f3', label: 'Diversification', weight: 20, score: 60, note: 'Four asset classes, small balances.' },
    { id: 'f4', label: 'Account age', weight: 15, score: 48, note: 'Profile is under 9 months old.' },
  ],
  'usr-003': [
    { id: 'f1', label: 'Asset liquidity', weight: 35, score: 52, note: 'Low balances in liquid assets.' },
    { id: 'f2', label: 'Repayment history', weight: 30, score: 40, note: 'One overdue instalment.' },
    { id: 'f3', label: 'Diversification', weight: 20, score: 38, note: 'Only three small holdings.' },
    { id: 'f4', label: 'Account age', weight: 15, score: 30, note: 'Newest profile on the platform.' },
  ],
};

const historyByUser: Record<string, ScorePoint[]> = {
  'usr-001': scoreHistory,
  'usr-002': [
    { month: 'May', score: 610 }, { month: 'Jun', score: 622 }, { month: 'Jul', score: 631 },
    { month: 'Aug', score: 640 }, { month: 'Sep', score: 648 }, { month: 'Oct', score: 655 },
  ],
  'usr-003': [
    { month: 'May', score: 545 }, { month: 'Jun', score: 541 }, { month: 'Jul', score: 530 },
    { month: 'Aug', score: 528 }, { month: 'Sep', score: 524 }, { month: 'Oct', score: 520 },
  ],
};

export const getScoreFactors = (userId: string): ScoreFactor[] => factorsByUser[userId] ?? scoreFactors;
export const getScoreHistory = (userId: string): ScorePoint[] => historyByUser[userId] ?? scoreHistory;