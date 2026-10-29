import { Icon } from '../Icons/Icons';
import { NAV_ITEMS, type TabKey } from '../navbar/NavItems';
import './SideBar.css';

interface SidebarProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

export default function Sidebar({ active, onChange }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div>
        <div className="brand brand-lg">
          BELL <span>5</span>
        </div>
        <p className="sidebar-tag">Asset-backed credit scoring</p>
      </div>

      <nav className="sidebar-nav" aria-label="Primary">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`sidebar-item ${active === item.key ? 'active' : ''}`}
            onClick={() => onChange(item.key)}
          >
            <Icon name={item.icon} size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <p className="sidebar-foot">Build credit with what you own.</p>
    </aside>
  );
}