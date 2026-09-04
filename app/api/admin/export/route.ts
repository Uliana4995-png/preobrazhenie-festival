import { NextResponse } from 'next/server';
import { isAdminRequestAuthenticated } from '@/lib/adminAuth';
import { listSubmissions, type SubmissionTable } from '@/lib/storage';

const ALLOWED_TABLES: SubmissionTable[] = ['registrations', 'speaker_applications', 'partner_applications', 'orders'];

function toCsv(records: Record<string, unknown>[]): string {
  if (records.length === 0) return '';
  const headers = Array.from(records.reduce((set, r) => { Object.keys(r).forEach((k) => set.add(k)); return set; }, new Set<string>()));
  const escape = (val: unknown) => {
    const str = val === null || val === undefined ? '' : String(val);
    return `"${str.replace(/"/g, '""')}"`;
  };
  const lines = [headers.join(',')];
  for (const r of records) {
    lines.push(headers.map((h) => escape(r[h])).join(','));
  }
  return '\uFEFF' + lines.join('\r\n'); // BOM для корректного открытия кириллицы в Excel
}

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
  const csv = toCsv(records);
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${table}.csv"`
    }
  });
}
