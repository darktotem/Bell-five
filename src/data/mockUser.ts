import type { SecuritySettings, User } from '../types/user';

// Templates only. New accounts copy one of these profiles (score, assets, loans).
export const mockUsers: User[] = [
  { id: 'usr-001', profile: 'usr-001', displayName: 'Amina Wekesa', email: 'amina@bell5.demo', initials: 'AW', bell5Id: 'B5-9081-2026', creditScore: 740, nationalId: '•••• 2019', kraPin: 'A001••••4F', phone: '+254 7•• ••• 678', memberSince: '2025-11-03' },
  { id: 'usr-002', profile: 'usr-002', displayName: 'Brian Otieno', email: 'brian@bell5.demo', initials: 'BO', bell5Id: 'B5-4417-2026', creditScore: 655, nationalId: '•••• 4471', kraPin: 'A002••••7K', phone: '+254 7•• ••• 789', memberSince: '2026-02-14' },
  { id: 'usr-003', profile: 'usr-003', displayName: 'Grace Njeri', email: 'grace@bell5.demo', initials: 'GN', bell5Id: 'B5-2730-2026', creditScore: 520, nationalId: '•••• 8836', kraPin: 'A003••••2M', phone: '+254 7•• ••• 890', memberSince: '2026-07-21' },
];

export const mockUser: User = mockUsers[0];

export const defaultSettings: SecuritySettings = {
  biometric: true,
  privacyMode: false,
};