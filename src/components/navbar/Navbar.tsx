import { useState } from 'react';
import type { User } from '../../types/user';
import { Icon } from '../Icons/Icons';
import { NAV_ITEMS, type TabKey } from '../navbar/NavItems';
import './Navbar.css';

interface NavbarProps {
  user: User;
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

export default function Navbar({ user, active, onChange }: NavbarProps) {
  const [copied, setCopied] = useState(false);

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(user.bell5Id);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <>
      <header className="topbar">
        <div className="brand" aria-label="Bell 5">
          BELL <span>5</span>
        </div>

        <button className="id-pill" onClick={copyId} title={copied ? 'Copied!' : 'Copy Bell 5 ID'} aria-label="Copy Bell 5 ID">
          <span>ID: {user.bell5Id}</span>
          <Icon name={copied ? 'check' : 'copy'} size={14} />
        </button>

        <div className="topbar-actions">
          <button className="icon-btn" aria-label="Notifications">
            <Icon name="bell" size={20} />
            <span className="notif-dot" />
          </button>
          <button className="avatar" onClick={() => onChange('settings')} aria-label="Open settings">
            {user.initials}
          </button>
        </div>
      </header>

      <nav className="bottom-nav" aria-label="Primary">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`bottom-nav-item ${active === item.key ? 'active' : ''}`}
            onClick={() => onChange(item.key)}
            aria-current={active === item.key ? 'page' : undefined}
          >
            <Icon name={item.icon} size={22} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}