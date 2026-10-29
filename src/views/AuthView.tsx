import { useState, type FormEvent } from 'react';
import type { User } from '../types/user';
import { requestReset, resetPassword, signIn, signUp } from '../utils/auth';

type Mode = 'signin' | 'signup' | 'forgot';

interface AuthViewProps {
  onLogin: (user: User) => void;
}

export default function AuthView({ onLogin }: AuthViewProps) {
  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const go = (next: Mode) => {
    setMode(next);
    setError('');
    setNotice('');
    setPassword('');
    setConfirm('');
    setCode('');
    setCodeSent(false);
    setDemoCode(null);
  };

  const checkPassword = (): string => {
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (password !== confirm) return 'Passwords do not match.';
    return '';
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (mode === 'signin') {
      setBusy(true);
      const user = await signIn(email, password);
      setBusy(false);
      if (!user) return setError('Incorrect email or password.');
      return onLogin(user);
    }

    if (mode === 'signup') {
      if (name.trim().length < 2) return setError('Enter your full name.');
      const problem = checkPassword();
      if (problem) return setError(problem);
      setBusy(true);
      const result = await signUp(name, email, password);
      setBusy(false);
      if (!result.ok) return setError(result.error);
      return onLogin(result.user);
    }

    // forgot password
    if (!codeSent) {
      setDemoCode(requestReset(email));
      setCodeSent(true);
      return setNotice('If an account exists for that email, a 6-digit code has been sent.');
    }
    const problem = checkPassword();
    if (problem) return setError(problem);
    setBusy(true);
    const ok = await resetPassword(email, code, password);
    setBusy(false);
    if (!ok) return setError('Invalid or expired code.');
    go('signin');
    setNotice('Password updated. Sign in with your new password.');
  };

  const title = mode === 'signin' ? 'Sign in to your Bell 5 account.' : mode === 'signup' ? 'Create your Bell 5 account.' : 'Reset your password.';
  const button = mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create account' : codeSent ? 'Reset password' : 'Send reset code';

  return (
    <main className="auth">
      <div className="auth-card">
        <div className="brand brand-xl">
          BELL <span>5</span>
        </div>
        <h1>Build credit with what you own.</h1>
        <p className="muted">{title}</p>

        <form onSubmit={submit} className="auth-form">
          {mode === 'signup' && (
            <input className="input" type="text" autoComplete="name" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
          )}

          <input
            className="input"
            type="email"
            autoComplete="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={mode === 'forgot' && codeSent}
            required
          />

          {mode === 'forgot' && codeSent && (
            <input className="input" type="text" inputMode="numeric" maxLength={6} placeholder="6-digit code" value={code} onChange={(e) => setCode(e.target.value)} required />
          )}

          {(mode !== 'forgot' || codeSent) && (
            <input
              className="input"
              type="password"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              placeholder={mode === 'forgot' ? 'New password' : 'Password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          )}

          {(mode === 'signup' || (mode === 'forgot' && codeSent)) && (
            <input className="input" type="password" autoComplete="new-password" placeholder="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          )}

          {demoCode && (
            <p className="demo-code">
              Demo mode, no email is sent. Your code: <strong>{demoCode}</strong>
            </p>
          )}
          {notice && <p className="notice" role="status">{notice}</p>}
          {error && <p className="form-error" role="alert">{error}</p>}

          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? 'Please wait…' : button}
          </button>
        </form>

        <div className="auth-links">
          {mode === 'signin' && (
            <>
              <button type="button" className="link-btn" onClick={() => go('forgot')}>Forgot password?</button>
              <button type="button" className="link-btn" onClick={() => go('signup')}>Create account</button>
            </>
          )}
          {mode === 'signup' && (
            <button type="button" className="link-btn" onClick={() => go('signin')}>Already have an account? Sign in</button>
          )}
          {mode === 'forgot' && (
            <button type="button" className="link-btn" onClick={() => go('signin')}>Back to sign in</button>
          )}
        </div>
      </div>
    </main>
  );
}