import { NextResponse } from 'next/server';
import { isAdminRequestAuthenticated } from '@/lib/adminAuth';
import { listSubmissions, updateSubmissionStatus, type SubmissionTable } from '@/lib/storage';

const ALLOWED_TABLES: SubmissionTable[] = ['registrations', 'speaker_applications', 'partner_applications', 'orders'];

export async function GET(request: Request) {
  if (!isAdminRequestAuthenticated()) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const table = searchParams.get('table') as SubmissionTable | null;
  if (!table || !ALLOWED_TABLES.includes(table)) {
    return NextResponse.json({ error: 'Неизвестная таблица' }, { status: 400 });
  }
  const records = await listSubmissions(table);
  return NextResponse.json({ table, records });
}

export async function PATCH(request: Request) {
  if (!isAdminRequestAuthenticated()) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }
  let body: { table?: SubmissionTable; id?: string; status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 });
  }
  if (!body.table || !ALLOWED_TABLES.includes(body.table) || !body.id || !body.status) {
    return NextResponse.json({ error: 'Не хватает данных' }, { status: 400 });
  }
  await updateSubmissionStatus(body.table, body.id, body.status);
  return NextResponse.json({ ok: true });
}
