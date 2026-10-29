export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: 'emergency' | 'investment' | 'asset_purchase';
}

export interface LiteracyTopic {
  id: string;
  title: string;
  category: 'credit_scoring' | 'mmfs' | 'good_vs_bad_debt' | 'saccos';
  summary: string;
  readTimeMinutes: number;
  contentMarkdown: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  limit: number;
  spent: number;
}

export interface Budget {
  income: number;
  categories: BudgetCategory[];
}