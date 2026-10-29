import bcrypt from 'bcryptjs';
import { mockUsers } from '../data/mockUser';
import type { Account, User } from '../types/user';
import { storage } from './storage';

const ACCOUNTS_KEY = 'accounts';
const RESET_KEY = 'reset';
// Compared against when the email is unknown, so timing doesn't reveal which emails exist
const DUMMY_HASH = '$2b$10$bn3fKnTQAp3Zk/APrx29auxI59LD6f9AwtG.ebT0teXXZTcwdqMRe';

interface ResetRequest {
  email: string;
  code: string;
  expires: number;
}

type Result = { ok: true; user: User } | { ok: false; error: string };

const rnd = (n: number): string =>
  Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join('');
const letter = (): string => String.fromCharCode(65 + Math.floor(Math.random() * 26));
const normalizeEmail = (e: string): string => e.trim().toLowerCase();

export const getAccounts = (): Account[] => storage.get<Account[]>(ACCOUNTS_KEY, []);
const saveAccounts = (list: Account[]) => storage.set(ACCOUNTS_KEY, list);

export const toUser = (account: Account): User => {
  const { passwordHash: _hash, ...user } = account;
  return user;
};

export async function signUp(displayName: string, email: string, password: string): Promise<Result> {
  const accounts = getAccounts();
  const em = normalizeEmail(email);
  if (accounts.some((a) => a.email === em)) {
    return { ok: false, error: 'An account with this email already exists.' };
  }

  // Each new account gets the next mock profile in turn (740, 655, 520, then repeats)
  const template = mockUsers[accounts.length % mockUsers.length];
  const parts = displayName.trim().split(/\s+/);
  const initials = (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();

  const account: Account = {
    ...template,
    id: `usr-${Date.now()}`,
    profile: template.profile,
    displayName: displayName.trim(),
    email: em,
    initials,
    bell5Id: `B5-${rnd(4)}-${new Date().getFullYear()}`,
    nationalId: `•••• ${rnd(4)}`,
    kraPin: `A${rnd(3)}••••${rnd(1)}${letter()}`,
    phone: `+254 7•• ••• ${rnd(3)}`,
    memberSince: new Date().toISOString().slice(0, 10),
    passwordHash: await bcrypt.hash(password, 10),
  };

  saveAccounts([...accounts, account]);
  return { ok: true, user: toUser(account) };
}

export async function signIn(email: string, password: string): Promise<User | null> {
  const account = getAccounts().find((a) => a.email === normalizeEmail(email));
  const ok = await bcrypt.compare(password, account?.passwordHash ?? DUMMY_HASH);
  return account && ok ? toUser(account) : null;
}

/** Returns the demo code, or null when no such account exists. */
export function requestReset(email: string): string | null {
  const em = normalizeEmail(email);
  if (!getAccounts().some((a) => a.email === em)) return null;
  const code = rnd(6);
  storage.set<ResetRequest>(RESET_KEY, { email: em, code, expires: Date.now() + 10 * 60 * 1000 });
  return code;
}

export async function resetPassword(email: string, code: string, newPassword: string): Promise<boolean> {
  const em = normalizeEmail(email);
  const req = storage.get<ResetRequest | null>(RESET_KEY, null);
  if (!req || req.email !== em || req.code !== code.trim() || Date.now() > req.expires) return false;

  const accounts = getAccounts();
  const idx = accounts.findIndex((a) => a.email === em);
  if (idx < 0) return false;

  accounts[idx] = { ...accounts[idx], passwordHash: await bcrypt.hash(newPassword, 10) };
  saveAccounts(accounts);
  storage.set<ResetRequest | null>(RESET_KEY, null);
  return true;
}

export function removeAccount(id: string): void {
  saveAccounts(getAccounts().filter((a) => a.id !== id));
  try {
    localStorage.removeItem(`bell5.assets.${id}`);
  } catch {
    /* storage unavailable */
  }
}