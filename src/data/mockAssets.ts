import type { Asset } from '../types/assets';


export const mockAssets: Asset[] = [
  { id: 'as-mpesa', 
    name: 'M-Pesa Wallet', 
    provider: 'Safaricom', 
    type: 'mobile_money', 
    value: 98200, verified: true, 
    lastSynced: '2026-10-29' 
  },
  { id: 'as-cic', 
    name: 'CIC Money Market Fund', 
    provider: 'CIC Asset Management', 
    type: 'mmf', 
    value: 130000, 
    verified: true, 
    lastSynced: '2026-10-29' 
  },
  { id: 'as-sanlam', 
    name: 'Sanlam Money Market Fund', 
    provider: 'Sanlam Investments', 
    type: 'mmf', value: 80000, 
    verified: true, 
    lastSynced: '2026-10-28' 
  },
  { id: 'as-sacco', 
    name: 'SACCO Share Capital', 
    provider: 'Umoja SACCO', 
    type: 'sacco', 
    value: 168500, 
    verified: true, 
    lastSynced: '2026-10-27' 
  },
  { id: 'as-scom', 
    name: 'Safaricom (SCOM) Shares', 
    provider: 'NSE · CDS Account', 
    type: 'equity', 
    value: 98700, 
    verified: true, 
    lastSynced: '2026-10-29' 
  },
];

// Assets the user can "link" from the Ledger screen
export const linkableAssets: Asset[] = [
  { id: 'link-bank', 
    name: 'Savings Account', 
    provider: 'Linked Bank', type: 'bank', 
    value: 42300, 
    verified: true, 
    lastSynced: '2026-10-30' 
  },
  { id: 'link-cds', 
    name: 'NSE CDS Holdings', 
    provider: 'NSE · CDS Account', 
    type: 'equity', value: 36000, 
    verified: true, 
    lastSynced: '2026-10-30' 
  },
  { id: 'link-sacco', 
    name: 'SACCO Deposits', 
    provider: 'Stima SACCO', 
    type: 'sacco', value: 28000, 
    verified: true, 
    lastSynced: '2026-10-30' },
];
