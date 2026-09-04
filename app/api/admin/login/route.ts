import { NextResponse } from 'next/server';
import { verifyAdminPassword, buildSessionCookieValue, getAdminSessionCookieName, ADMIN_SESSION_MAX_AGE_SECONDS } from '@/lib/adminAuth';
import { checkRateLimit, getClientKey } from '@/lib/rateLimit';

export async function POST(request: Request) {
  const key = `admin-login:${getClientKey(request)}`;
  // Строгий лимит попыток входа — защита от перебора пароля.
  if (!checkRateLimit(key, 5, 5 * 60_000)) {
    return NextResponse.json({ error: 'Слишком много попыток входа. Попробуйте через несколько минут.' }, { status: 429 });
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 });
  }

  if (!body.password || !verifyAdminPassword(body.password)) {
    return NextResponse.json({ error: 'Неверный пароль' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(getAdminSessionCookieName(), buildSessionCookieValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS
  });
  return response;
}
