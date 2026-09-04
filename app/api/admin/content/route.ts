import { NextResponse } from 'next/server';
import { isAdminRequestAuthenticated } from '@/lib/adminAuth';
import { readContent, writeContent } from '@/lib/content';

const ALLOWED_FILES = new Set([
  'site.json',
  'program.json',
  'timing.json',
  'speakers.json',
  'pricing.json',
  'packages.json',
  'faq.json',
  'legal.json',
  'practices.json',
  'center.json',
  'appearance.json',
  'online.json',
  'gallery.json',
  'topic-pages.json'
]);

export async function GET(request: Request) {
  if (!isAdminRequestAuthenticated()) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const file = searchParams.get('file');
  if (!file || !ALLOWED_FILES.has(file)) {
    return NextResponse.json({ error: 'Неизвестный файл контента' }, { status: 400 });
  }

  const data = await readContent(file);
  return NextResponse.json({ file, data });
}

export async function PUT(request: Request) {
  if (!isAdminRequestAuthenticated()) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  let body: { file?: string; data?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 });
  }

  if (!body.file || !ALLOWED_FILES.has(body.file)) {
    return NextResponse.json({ error: 'Неизвестный файл контента' }, { status: 400 });
  }
  if (body.data === undefined) {
    return NextResponse.json({ error: 'Данные не переданы' }, { status: 400 });
  }

  try {
    await writeContent(body.file, body.data);
  } catch (e) {
    return NextResponse.json({ error: 'Не удалось сохранить файл' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
