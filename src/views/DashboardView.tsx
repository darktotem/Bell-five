import { useState } from 'react';
import ScoreGauge from '../components/scoreguage/ScoreGauge';
import DonutChart from '../components/donutChart/DonutChart';
import StatCard from '../components/statcard/StatCard';
import { Icon } from '../components/Icons/Icons';
import type { TabKey } from '../components/navbar/NavItems';
import type { Asset } from '../types/assets';
import { LOAN_STATUS_META, type Loan } from '../types/credit';
import type { User } from '../types/user';
import { formatDate, formatKES } from '../utils/formatters';
import { allocationByType, totalValue, weightedLiquidity } from '../utils/scoreCalculator';

interface DashboardViewProps {
  user: User;
  assets: Asset[];
  loans: Loan[];
  onNavigate: (tab: TabKey) => void;
}

export default function DashboardView({ user, assets, loans, onNavigate }: DashboardViewProps) {
  const [toast, setToast] = useState('');

  const total = totalValue(assets);
  const weighted = weightedLiquidity(assets);
  const slices = allocationByType(assets);
  const activeLoans = loans.filter((l) => l.status !== 'repaid');
  const outstanding = activeLoans.reduce((s, l) => s + l.outstanding, 0);
  const hasDue = activeLoans.some((l) => l.status === 'due_soon' || l.status === 'overdue');
  const recent = [...loans].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 4);

  const shareProfile = async () => {
    const url = `${window.location.origin}/p/${user.bell5Id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'My Bell 5 Credit Profile', text: `Verify my Bell 5 badge: ${user.bell5Id}`, url });
      } else {
        await navigator.clipboard.writeText(url);
        setToast('Profile link copied');
        window.setTimeout(() => setToast(''), 2000);
      }
    } catch {
      /* share cancelled */
    }
  };

  return (
    <div className="view">
      <div className="grid-2">
        <section className="hero" aria-label="Public credit badge">
          <div className="hero-head">
            <h2 className="card-title">Public Credit Badge</h2>
            <span className="pill pill-blue">Verified</span>
          </div>
          <ScoreGauge score={user.creditScore} />
          <div className="networth">
            <p className="muted small">Net Worth / AUM</p>
            <p className="networth-value sensitive">{formatKES(total)}</p>
          </div>
        </section>

        <section className="card">
          <h2 className="card-title">Asset Breakdown</h2>
          <DonutChart slices={slices} total={total} />
        </section>
      </div>

      <section>
        <div className="section-head"><h2>Quick Actions</h2></div>
        <div className="quick-actions">
          <button className="qa-btn qa-primary" onClick={() => onNavigate('ledger')}>
            <Icon name="plus" size={22} /> Link Asset
          </button>
          <button className="qa-btn" onClick={() => onNavigate('ledger')}>
            <Icon name="upload" size={22} /> Upload Statement
          </button>
          <button className="qa-btn" onClick={shareProfile}>
            <Icon name="share" size={22} /> Share Bell 5 Profile
          </button>
        </div>
        {toast && <p className="toast" role="status">{toast}</p>}
      </section>

      <div className="stat-row">
        <StatCard
          label="Liquidity-weighted"
          value={formatKES(weighted)}
          hint={total ? `${Math.round((weighted / total) * 100)}% of portfolio` : undefined}
          icon="trending"
          tone="green"
          sensitive
        />
        <StatCard
          label="Active loans"
          value={String(activeLoans.length)}
          hint={`${formatKES(outstanding)} outstanding`}
          icon="bank"
          tone={hasDue ? 'amber' : 'blue'}
        />
      </div>

      <section>
        <div className="section-head">
          <h2>Recent Credit Activity</h2>
          <button className="link-btn" onClick={() => onNavigate('credit')}>View all</button>
        </div>
        <div className="list">
          {recent.map((loan) => {
            const meta = LOAN_STATUS_META[loan.status];
            return (
              <div className="list-card" key={loan.id}>
                <span className="list-icon"><Icon name="bank" size={20} /></span>
                <div className="list-body">
                  <p className="list-title">{loan.lender}</p>
                  <p className="list-sub">
                    {loan.purpose} · {loan.nextDueDate ? `Due ${formatDate(loan.nextDueDate)}` : `Closed ${formatDate(loan.updatedAt)}`}
                  </p>
                </div>
                <div className="list-end">
                  <span className="amount">{formatKES(loan.principal)}</span>
                  <span className={`pill pill-${meta.tone}`}><span className="dot" />{meta.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}