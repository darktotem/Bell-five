import ScoreGauge from '../components/scoreguage/ScoreGauge';
import { getScoreFactors, getScoreHistory, scoreFactors, scoreHistory } from '../data/mockLoans';
import StatCard from '../components/statcard/StatCard';
import type { Asset } from '../types/assets';
import { LOAN_STATUS_META, type Loan } from '../types/credit';
import type { User } from '../types/user';
import { formatDate, formatKES } from '../utils/formatters';
import { getTier, totalValue, weightedLiquidity } from '../utils/scoreCalculator';

interface CreditProfileViewProps {
  user: User;
  assets: Asset[];
  loans: Loan[];
}

const W = 300;
const H = 80;
const P = 8;

export default function CreditProfileView({ user, assets, loans }: CreditProfileViewProps) {
  const scoreFactors = getScoreFactors(user.profile);
  const scoreHistory = getScoreHistory(user.profile);
  const tier = getTier(user.creditScore);
  const total = totalValue(assets);
  const ratio = total ? Math.round((weightedLiquidity(assets) / total) * 100) : 0;

  const vals = scoreHistory.map((p) => p.score);
  const min = Math.min(...vals) - 10;
  const max = Math.max(...vals) + 10;
  const points = scoreHistory.map((p, i) => {
    const x = P + (i * (W - 2 * P)) / (scoreHistory.length - 1);
    const y = H - P - ((p.score - min) / (max - min)) * (H - 2 * P);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const delta = vals[vals.length - 1] - vals[0];

  return (
    <div className="view">
      <section className="hero">
        <ScoreGauge score={user.creditScore} />
        <p className="muted small" style={{ marginTop: 14 }}>{tier.description}</p>
      </section>

      <div className="stat-row">
        <StatCard label="Liquidity ratio" value={`${ratio}%`} hint="Weighted vs total assets" icon="trending" tone="green" />
        <StatCard label="6-month change" value={`${delta >= 0 ? '+' : ''}${delta} pts`} hint="Since May" icon="chart" tone="blue" />
      </div>

      <div className="grid-2">
        <section className="card">
          <h2 className="card-title">Score History</h2>
          <svg className="spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-label="Score history">
            <polyline points={points.join(' ')} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={points[points.length - 1].split(',')[0]} cy={points[points.length - 1].split(',')[1]} r="4" fill="#10b981" />
          </svg>
          <div className="spark-labels">
            {scoreHistory.map((p) => <span key={p.month}>{p.month}</span>)}
          </div>
        </section>

        <section className="card">
          <h2 className="card-title">What drives your score</h2>
          <div className="factors">
            {scoreFactors.map((f) => (
              <div key={f.id}>
                <div className="factor-head">
                  <span>{f.label} <span className="muted small">· {f.weight}%</span></span>
                  <strong>{f.score}</strong>
                </div>
                <div className={`bar ${f.score >= 70 ? 'bar-green' : 'bar-amber'}`}><span style={{ width: `${f.score}%` }} /></div>
                <p className="muted small">{f.note}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section>
        <div className="section-head"><h2>Loan History</h2></div>
        <div className="list">
          {loans.map((loan) => {
            const meta = LOAN_STATUS_META[loan.status];
            return (
              <div className="list-card" key={loan.id}>
                <div className="list-body">
                  <p className="list-title">{loan.lender} · {loan.purpose}</p>
                  <p className="list-sub">
                    Borrowed {formatKES(loan.principal)} · Outstanding {formatKES(loan.outstanding)}
                    {loan.nextDueDate ? ` · Due ${formatDate(loan.nextDueDate)}` : ''}
                  </p>
                </div>
                <span className={`pill pill-${meta.tone}`}><span className="dot" />{meta.label}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}