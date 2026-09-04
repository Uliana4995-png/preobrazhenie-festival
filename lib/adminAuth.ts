import 'server-only';
import { createHmac, timingSafeEqual, randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';

/**
 * Механизм входа в /admin.
 *
 * Это НЕ имитация авторизации: пароль сверяется на сервере через
 * timing-safe сравнение, а сессия — это подписанный HMAC-токен
 * (секрет ADMIN_SESSION_SECRET), который нельзя подделать без
 * знания секрета, с ограниченным временем жизни и httpOnly-cookie.
 *
 * Это простое, но реальное решение для одного администратора,
 * подходящее для запуска. Как только подключается Supabase
 * (см. README), рекомендуется перейти на Supabase Auth с
 * email/паролем и таблицей ролей — тогда достаточно заменить
 * функции verifyAdminPassword/createAdminSession/isAdminSession
 * на вызовы supabase.auth, не меняя остальной код админки.
 */

const COOKIE_NAME = 'preobrazhenie_admin_session';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 часов

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      'ADMIN_SESSION_SECRET не задан или слишком короткий. Задайте случайную строку не короче 32 символов в .env.local.'
    );
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('hex');
}

export function verifyAdminPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;

  const candidateBuf = Buffer.from(candidate.padEnd(128, '\0'));
  const expectedBuf = Buffer.from(expected.padEnd(128, '\0'));
  return timingSafeEqual(candidateBuf, expectedBuf) && candidate.length === expected.length;
}

export function buildSessionCookieValue(): string {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const nonce = randomUUID();
  const payload = `${expiresAt}.${nonce}`;
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function isValidSessionCookieValue(value: string | undefined): boolean {
  if (!value) return false;
  const parts = value.split('.');
  if (parts.length !== 3) return false;
  const [expiresAtStr, nonce, signature] = parts as [string, string, string];
  const payload = `${expiresAtStr}.${nonce}`;
  const expectedSignature = sign(payload);

  const sigBuf = Buffer.from(signature.padEnd(64, '0'));
  const expectedBuf = Buffer.from(expectedSignature.padEnd(64, '0'));
  const validSignature = signature.length === expectedSignature.length && timingSafeEqual(sigBuf, expectedBuf);

  const expiresAt = Number(expiresAtStr);
  const notExpired = Number.isFinite(expiresAt) && expiresAt > Date.now();

  return validSignature && notExpired;
}

export function getAdminSessionCookieName() {
  return COOKIE_NAME;
}

export function isAdminRequestAuthenticated(): boolean {
  const cookieStore = cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  return isValidSessionCookieValue(value);
}

export const ADMIN_SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;
