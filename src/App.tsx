import { useEffect, useState } from 'react';
import Navbar from './components/navbar/Navbar';
import type { TabKey } from './components/navbar/NavItems';
import Sidebar from './components/sidebar/SideBar';
import { linkableAssets, mockAssets } from './data/mockAssets';
import { loansByUser } from './data/mockLoans';
import { defaultSettings } from './data/mockUser';
import type { Asset } from './types/assets';
import type { SecuritySettings, User } from './types/user';
import { storage } from './utils/storage';
import { getAccounts, removeAccount, toUser } from './utils/auth';
import AuthView from './views/AuthView';
import CreditProfileView from './views/CreditProfileView';
import DashboardView from './views/DashboardView';
import LedgerView from './views/LedgerView';
import LiteracyHubView from './views/LiteracyHubView';
import SettingsView from './views/SettingsView';
import './App.css';

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const id = storage.get<string | null>('userId', null);
    const account = getAccounts().find((account) => account.id === id);
    return account ? toUser(account) : null;
  });

  const [settings, setSettings] = useState<SecuritySettings>(() =>
    storage.get('settings', defaultSettings),
  );

  useEffect(() => {
    storage.set('userId', user?.id ?? null);
  }, [user]);

  useEffect(() => {
    storage.set('settings', settings);
  }, [settings]);

  const deleteAccount = () => {
    if (user) removeAccount(user.id);
    setUser(null);
  };

  if (!user) {
    return <AuthView onLogin={setUser} />;
  }

  return (
    <Workspace
      key={user.id}
      user={user}
      settings={settings}
      onSettingsChange={setSettings}
      onSignOut={() => setUser(null)}
      onDeleteAccount={deleteAccount}
    />
  );
}

type WorkspaceProps = {
  user: User;
  settings: SecuritySettings;
  onSettingsChange: (settings: SecuritySettings) => void;
  onSignOut: () => void;
  onDeleteAccount: () => void;
};

function Workspace({
  user,
  settings,
  onSettingsChange,
  onSignOut,
  onDeleteAccount,
}: WorkspaceProps) {
  const [tab, setTab] = useState<TabKey>('dashboard');
  const [assets, setAssets] = useState<Asset[]>(() =>
    storage.get('assets', mockAssets),
  );

  const loans = loansByUser[user.profile] ?? [];

  useEffect(() => {
    storage.set('assets', assets);
  }, [assets]);

  const changeTab = (next: TabKey) => {
    setTab(next);
    window.scrollTo({ top: 0 });
  };

  const linkAsset = (templateId: string) => {
    const template = linkableAssets.find((asset) => asset.id === templateId);
    if (!template) return;

    setAssets((currentAssets) =>
      currentAssets.some((asset) => asset.id === templateId)
        ? currentAssets
        : [...currentAssets, template],
    );
  };

  const renderView = () => {
    switch (tab) {
      case 'ledger':
        return <LedgerView assets={assets} onLinkAsset={linkAsset} />;
      case 'credit':
        return <CreditProfileView user={user} assets={assets} loans={loans} />;
      case 'literacy':
        return <LiteracyHubView user={user} assets={assets} />;
      case 'settings':
        return (
          <SettingsView
            user={user}
            settings={settings}
            onSettingsChange={onSettingsChange}
            onSignOut={onSignOut}
            onDeleteAccount={onDeleteAccount}
          />
        );
      default:
        return (
          <DashboardView
            user={user}
            assets={assets}
            loans={loans}
            onNavigate={changeTab}
          />
        );
    }
  };

  return (
    <div className={`app-shell ${settings.privacyMode ? 'privacy' : ''}`}>
      <Sidebar active={tab} onChange={changeTab} />
      <div className="app-column">
        <Navbar user={user} active={tab} onChange={changeTab} />
        <main className="app-main" key={tab}>
          {renderView()}
        </main>
      </div>
    </div>
  );
}