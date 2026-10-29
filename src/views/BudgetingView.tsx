import { useEffect, useState } from 'react';
import type { Budget } from '../types/budget';
import { formatKES } from '../utils/formatters';
import { storage } from '../utils/storage';

const DEFAULT_BUDGET: Budget = {
  income: 85000,
  categories: [
    { id: 'rent', name: 'Rent & utilities', limit: 30000, spent: 28500 },
    { id: 'food', name: 'Food & groceries', limit: 15000, spent: 11200 },
    { id: 'transport', name: 'Transport', limit: 8000, spent: 6400 },
    { id: 'data', name: 'Airtime & data', limit: 3000, spent: 2100 },
    { id: 'savings', name: 'Savings & MMF', limit: 15000, spent: 15000 },
    { id: 'fun', name: 'Leisure', limit: 6000, spent: 7200 },
  ],
};

export default function BudgetingView() {
  const [budget, setBudget] = useState<Budget>(() => storage.get('budget', DEFAULT_BUDGET));

  useEffect(() => {
    storage.set('budget', budget);
  }, [budget]);

  const spent = budget.categories.reduce((s, c) => s + c.spent, 0);
  const left = budget.income - spent;

  const setSpent = (id: string, value: number) =>
    setBudget((b) => ({
      ...b,
      categories: b.categories.map((c) => (c.id === id ? { ...c, spent: value } : c)),
    }));

  return (
    <div className="view">
      <section className="card">
        <div className="budget-summary">
          <div><p className="muted small">Income</p><strong>{formatKES(budget.income)}</strong></div>
          <div><p className="muted small">Spent</p><strong>{formatKES(spent)}</strong></div>
          <div><p className="muted small">Left</p><strong className={left >= 0 ? 'text-green' : 'text-red'}>{formatKES(left)}</strong></div>
        </div>
      </section>

      <div className="list">
        {budget.categories.map((c) => {
          const ratio = c.limit ? c.spent / c.limit : 0;
          const tone = ratio > 1 ? 'red' : ratio >= 0.85 ? 'amber' : 'green';
          return (
            <div className="card" key={c.id}>
              <div className="factor-head">
                <span>{c.name}</span>
                <span className="muted small">limit {formatKES(c.limit)}</span>
              </div>
              <div className={`bar bar-${tone}`}><span style={{ width: `${Math.min(ratio * 100, 100)}%` }} /></div>
              <input
                className="input"
                style={{ marginTop: 10 }}
                type="number"
                inputMode="numeric"
                min={0}
                value={c.spent}
                aria-label={`${c.name} spent`}
                onChange={(e) => setSpent(c.id, Number(e.target.value) || 0)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}