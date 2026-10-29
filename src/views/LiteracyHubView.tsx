import { useState, type CSSProperties } from 'react';
import type { Asset } from '../types/assets';
import type { User } from '../types/user';
import { formatKES } from '../utils/formatters';
import { MAX_SCORE, estimateBoost, getTier } from '../utils/scoreCalculator';
import BudgetingView from './BudgetingView';

interface LiteracyHubViewProps {
  user: User;
  assets: Asset[];
}

const LESSONS = [
  { id: 'l1', tag: 'Basics', accent: '#10b981', title: 'Good Debt vs Bad Debt', time: '3 min', summary: 'Borrowing that builds assets or income is good debt. Borrowing for things that lose value fast is bad debt.', body: 'Before you borrow, ask: will this put money back in my pocket or grow in value? A loan for stock or school fees usually pays you back. A loan for a gadget you will replace in a year usually does not.' },
  { id: 'l2', tag: 'Investing', accent: '#3b82f6', title: 'Why MMFs Outperform Savings', time: '4 min', summary: 'Money market funds typically pay more than a standard savings account and stay easy to withdraw.', body: 'MMFs pool your money into short-term, low-risk instruments. Returns are usually higher than bank savings rates, and withdrawals are often processed within a day or two, which keeps them highly liquid.' },
  { id: 'l3', tag: 'Your score', accent: '#f59e0b', title: 'How Asset Liquidity Boosts Your Score', time: '3 min', summary: 'Lenders trust assets they can turn into cash quickly. Bell 5 weights each asset by how liquid it is.', body: 'M-Pesa balances count fully (1.0x). MMFs count at 0.95x, equities at 0.7x and SACCO shares at 0.6x. Moving idle cash into MMFs raises your weighted liquidity.' },
  { id: 'l4', tag: 'Habits', accent: '#8b5cf6', title: 'The 50/30/20 Budget', time: '2 min', summary: 'Split income into needs, wants and savings to stay in control every month.', body: 'Aim for about half of your income on needs, thirty percent on wants, and twenty percent on savings or debt repayment. Adjust the ratios to fit your life, but always pay yourself first.' },
  { id: 'l5', tag: 'Credit', accent: '#06b6d4', title: 'Repay Early, Build Faster', time: '3 min', summary: 'On-time and early repayments are the strongest signal of reliability.', body: 'Repayment history is a major part of your Bell 5 score. Even one missed instalment can slow progress, so set reminders a few days before each due date.' },
  { id: 'l6', tag: 'Safety', accent: '#ef4444', title: 'Spotting Predatory Lenders', time: '3 min', summary: 'High fees, hidden charges and aggressive recovery tactics are red flags.', body: 'Always check the full cost of a loan, including fees. Use only lenders that are regulated, share terms clearly in writing, and let you repay early without penalties.' },
];

export default function LiteracyHubView({ user, assets }: LiteracyHubViewProps) {
  const [mode, setMode] = useState<'learn' | 'budget'>('learn');
  const [openId, setOpenId] = useState<string | null>(null);
  const [deposit, setDeposit] = useState(50000);

  const boost = estimateBoost(assets, deposit, user.creditScore);
  const newScore = user.creditScore + boost;
  const before = getTier(user.creditScore);
  const after = getTier(newScore);

  return (
    <div className="view">
      <div className="segmented" role="tablist">
        <button className={mode === 'learn' ? 'active' : ''} onClick={() => setMode('learn')}>Learn</button>
        <button className={mode === 'budget' ? 'active' : ''} onClick={() => setMode('budget')}>Budgeting</button>
      </div>

      {mode === 'budget' ? (
        <BudgetingView />
      ) : (
        <>
          <section>
            <div className="section-head"><h2>Learn &amp; Grow</h2><span className="muted small">Swipe →</span></div>
            <div className="carousel">
              {LESSONS.map((l) => (
                <article key={l.id} className="edu-card" style={{ '--accent': l.accent } as CSSProperties}>
                  <div className="edu-meta">
                    <span className="edu-tag">{l.tag}</span>
                    <span className="muted small">{l.time}</span>
                  </div>
                  <h3>{l.title}</h3>
                  <p className="muted">{openId === l.id ? l.body : l.summary}</p>
                  <button className="link-btn" onClick={() => setOpenId(openId === l.id ? null : l.id)}>
                    {openId === l.id ? 'Show less' : 'Read more'}
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="card">
            <h2 className="card-title">Score Boost Calculator</h2>
            <p className="muted small">See how a new MMF deposit could lift your Bell 5 score.</p>

            <div className="calc-deposit">
              <span className="muted small">If I deposit</span>
              <strong>{formatKES(deposit)}</strong>
            </div>
            <input
              type="range"
              min={0}
              max={500000}
              step={5000}
              value={deposit}
              onChange={(e) => setDeposit(Number(e.target.value))}
              aria-label="MMF deposit amount"
            />

            <div className="calc-result">
              <div>
                <p className="muted small">Estimated score</p>
                <p className="calc-score">{newScore}<span className="muted small"> / {MAX_SCORE}</span></p>
              </div>
              <span className={`pill ${boost > 0 ? 'pill-green' : 'pill-blue'}`}>+{boost} pts</span>
            </div>
            <p className="muted small">
              {before.label}{before.level !== after.level ? ` → ${after.label}` : ''}. Estimates only; actual scores depend on lender checks.
            </p>
          </section>
        </>
      )}
    </div>
  );
}