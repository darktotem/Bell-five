export interface UserProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  bell5Id: string;
  nationalId: string;
  memberSince: string;
}

export interface SecuritySettings {
  biometric: boolean;
  privacyMode: boolean;
}

export interface User {
  id: string;
  profile: string;
  displayName: string;
  initials: string;
  email: string;
  bell5Id: string;
  creditScore: number;
  nationalId: string; // stored already masked
  kraPin: string;
  phone: string;
  memberSince: string;
}

export interface Account extends User {
  passwordHash: string;
}