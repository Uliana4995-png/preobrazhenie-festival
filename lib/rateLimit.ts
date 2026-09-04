/**
 * Простой rate limiter в памяти процесса — защита форм от спама и перебора.
 * Для serverless-хостинга с несколькими инстансами рекомендуется заменить
 * на Redis/Upstash, но для старта этого достаточно как базовая защита
 * в дополнение к honeypot-полю и серверной валидации Zod.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count += 1;
  return true;
}

export function getClientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || 'unknown';
}
