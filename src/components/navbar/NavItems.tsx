import type { IconName } from '../Icons/Icons';

export type TabKey = 'dashboard' | 'ledger' | 'credit' | 'literacy' | 'settings';

export const NAV_ITEMS: { key: TabKey; label: string; icon: IconName }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: 'home' },
  { key: 'ledger', label: 'Assets', icon: 'wallet' },
  { key: 'credit', label: 'Credit Profile', icon: 'shield' },
  { key: 'literacy', label: 'Literacy Hub', icon: 'book' },
  { key: 'settings', label: 'Settings', icon: 'sliders' },
];