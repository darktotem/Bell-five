import { useState } from 'react';
import { Icon } from '../components/Icons/Icons';
import type { SecuritySettings, User } from '../types/user';
import { formatDate } from '../utils/formatters';

interface SettingsViewProps {
  user: User;
  settings: SecuritySettings;
  onSettingsChange: (s: SecuritySettings) => void;
  onSignOut: () => void;
  onDeleteAccount: () => void;
}

type SettingsTab = 'public' | 'private';
type LockState = 'locked' | 'verifying' | 'unlocked';

function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button className="switch" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} />
  );
}

export default function SettingsView({ user, settings, onSettingsChange, onSignOut, onDeleteAccount }: SettingsViewProps) {
  const [tab, setTab] = useState<SettingsTab>('public');
  const [lock, setLock] = useState<LockState>('locked');
  const [confirming, setConfirming] = useState(false);

 const selectTab = (t: SettingsTab) => {
  setTab(t);
  setLock('locked');
  setRevealed({});
};

  const verify = () => {
    setLock('verifying');
    window.setTimeout(() => setLock('unlocked'), 900);
  };
const [revealed, setRevealed] = useState<Record<string, boolean>>({});
const toggleField = (key: string) => setRevealed((r) => ({ ...r, [key]: !r[key] }));
const privateFields = [
  { key: 'email', label: 'Email', value: user.email },
  { key: 'nid', label: 'National ID', value: user.nationalId },
  { key: 'kra', label: 'KRA PIN', value: user.kraPin },
  { key: 'phone', label: 'Phone', value: user.phone },
];
  return (
    <div className="view">
      <div className="segmented" role="tablist">
        <button className={tab === 'public' ? 'active' : ''} onClick={() => selectTab('public')}>Public Info</button>
        <button className={tab === 'private' ? 'active' : ''} onClick={() => selectTab('private')}>Private Info</button>
      </div>

      {tab === 'public' ? (
        <section className="card">
          <div className="field-row"><span className="field-label">Bell 5 ID</span><span className="field-value">{user.bell5Id}</span></div>
          <div className="field-row"><span className="field-label">Display name</span><span className="field-value">{user.displayName}</span></div>
          <div className="field-row"><span className="field-label">Member since</span><span className="field-value">{formatDate(user.memberSince)}</span></div>
          <p className="muted small">Lenders you share your badge with see only these details and your tier.</p>
        </section>
      ) : lock === 'unlocked' ? (
        <section className="card">
      {privateFields.map((f) => (
        <div className="field-row" key={f.key}>
            <span className="field-label">{f.label}</span>
            <span className="field-actions">
            <span className={`field-value pii ${revealed[f.key] ? 'shown' : ''}`}>{f.value}</span>
                <button className="link-btn" onClick={() => toggleField(f.key)}>
                  {revealed[f.key] ? 'Hide' : 'Show'}
                </button>
            </span>
        </div>
  ))}
</section>
      ) : (
        <section className="card lock-card">
          <span className="dropzone-icon"><Icon name="lock" size={26} /></span>
          <strong>Private details are protected</strong>
          <p className="muted small">Verify it&apos;s you to view your masked personal information.</p>
          <button className="btn btn-primary" onClick={verify} disabled={lock === 'verifying'}>
            {lock === 'verifying' ? 'Verifying…' : settings.biometric ? 'Verify with biometrics' : 'Verify with PIN'}
          </button>
        </section>
      )}

      <section className="card">
        <h2 className="card-title">Security</h2>
        <div className="field-row">
          <div>
            <p className="field-value">Biometric authentication</p>
            <p className="muted small">Use fingerprint or face to unlock</p>
          </div>
          <Switch label="Biometric authentication" checked={settings.biometric} onChange={(v) => onSettingsChange({ ...settings, biometric: v })} />
        </div>
        <div className="field-row">
          <div>
            <p className="field-value">Privacy mode</p>
            <p className="muted small">Blur balances across the app</p>
          </div>
          <Switch label="Privacy mode" checked={settings.privacyMode} onChange={(v) => onSettingsChange({ ...settings, privacyMode: v })} />
        </div>
      </section>

      <button className="btn btn-ghost" onClick={onSignOut}><Icon name="logout" size={18} /> Sign out</button>

      {confirming ? (
        <section className="card danger-card">
          <strong>Delete your account?</strong>
          <p className="muted small">This permanently removes your linked assets, score and settings from this device.</p>
          <div className="row-actions">
            <button className="btn btn-ghost" onClick={() => setConfirming(false)}>Cancel</button>
            <button className="btn btn-danger" onClick={onDeleteAccount}>Yes, delete</button>
          </div>
        </section>
      ) : (
        <button className="btn btn-danger" onClick={() => setConfirming(true)}>
          <Icon name="trash" size={18} /> Delete account
        </button>
      )}
    </div>
  );
}