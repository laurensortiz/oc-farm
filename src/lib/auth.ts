import { createHmac, timingSafeEqual } from 'crypto';

const SECRET = import.meta.env.SESSION_SECRET ?? process.env.SESSION_SECRET ?? 'oc-farm-dev-secret';
export const COOKIE_NAME = 'oc_session';
const SESSION_VALUE = 'authenticated';

export function createSessionToken(): string {
  const sig = createHmac('sha256', SECRET).update(SESSION_VALUE).digest('hex');
  return `${SESSION_VALUE}.${sig}`;
}

export function verifySessionToken(token: string): boolean {
  try {
    const dotIndex = token.lastIndexOf('.');
    if (dotIndex === -1) return false;
    const value = token.slice(0, dotIndex);
    const sig   = token.slice(dotIndex + 1);
    const expected = createHmac('sha256', SECRET).update(value).digest('hex');
    return timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

export function checkCredentials(username: string, password: string): boolean {
  const validUser = import.meta.env.ADMIN_USER ?? process.env.ADMIN_USER ?? 'admin';
  const validPass = import.meta.env.ADMIN_PASS ?? process.env.ADMIN_PASS ?? 'admin';
  return username === validUser && password === validPass;
}
