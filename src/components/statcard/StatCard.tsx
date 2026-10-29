import { Icon, type IconName } from '../Icons/Icons';
import './StatCard.css';

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: IconName;
  tone?: 'green' | 'blue' | 'amber';
  sensitive?: boolean;
}

export default function StatCard({ label, value, hint, icon, tone = 'blue', sensitive }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span className="stat-label">{label}</span>
        <span className={`stat-icon tone-${tone}`}>
          <Icon name={icon} size={16} />
        </span>
      </div>
      <p className={`stat-value ${sensitive ? 'sensitive' : ''}`}>{value}</p>
      {hint && <p className="stat-hint">{hint}</p>}
    </div>
  );
}