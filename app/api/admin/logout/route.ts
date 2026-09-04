import { NextResponse } from 'next/server';
import { getAdminSessionCookieName } from '@/lib/adminAuth';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(getAdminSessionCookieName(), '', { path: '/', maxAge: 0 });
  return response;
}
