const SESSION_KEY = 'bandz_ortho_session';

export interface OrthoSession {
  id: number;
  name: string;
  email: string;
  practiceId: number;
  practiceName: string;
  practiceCode: string;
}

export function getSession(): OrthoSession | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function saveSession(session: OrthoSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
