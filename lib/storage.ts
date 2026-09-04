import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { getSupabaseAdminClient, isSupabaseConfigured } from './supabase';

/**
 * Хранилище заявок (регистрация, спикеры, партнёры) и заказов на оплату.
 *
 * По умолчанию (без Supabase) записи сохраняются в JSON-файлы в /data —
 * этого достаточно для запуска и тестирования формы, но НЕ рассчитано
 * на высокую нагрузку и не переживает пересборку на некоторых хостингах
 * (например, serverless-функции Vercel имеют временную файловую систему).
 *
 * Как только заданы переменные окружения Supabase (NEXT_PUBLIC_SUPABASE_URL,
 * SUPABASE_SERVICE_ROLE_KEY), запись автоматически идёт в таблицы Supabase —
 * см. README, раздел "Подключение Supabase", и файл supabase/schema.sql.
 */

const DATA_DIR = path.join(process.cwd(), 'data', 'submissions');

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function appendJsonRecord(table: string, record: Record<string, unknown>) {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, `${table}.json`);
  let records: Record<string, unknown>[] = [];
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    records = JSON.parse(raw);
  } catch {
    records = [];
  }
  records.push(record);
  await fs.writeFile(filePath, JSON.stringify(records, null, 2), 'utf-8');
}

async function readJsonRecords(table: string): Promise<Record<string, unknown>[]> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, `${table}.json`);
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export type SubmissionTable = 'registrations' | 'speaker_applications' | 'partner_applications' | 'orders';

export async function createSubmission(
  table: SubmissionTable,
  payload: Record<string, unknown>
): Promise<{ id: string }> {
  const id = randomUUID();
  const record = {
    id,
    status: 'новая',
    created_at: new Date().toISOString(),
    ...payload
  };

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    const { error } = await supabase.from(table).insert(record);
    if (error) {
      // Не роняем заявку пользователя из-за проблем с БД — дублируем в локальный файл
      // и логируем ошибку для администратора.
      console.error(`[storage] Supabase insert failed for ${table}:`, error.message);
      await appendJsonRecord(table, record);
    }
  } else {
    await appendJsonRecord(table, record);
  }

  return { id };
}

export async function listSubmissions(table: SubmissionTable): Promise<Record<string, unknown>[]> {
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false });
    if (!error && data) return data;
    console.error(`[storage] Supabase select failed for ${table}:`, error?.message);
  }
  const records = await readJsonRecords(table);
  return records.reverse();
}

export async function updateSubmissionStatus(
  table: SubmissionTable,
  id: string,
  status: string
): Promise<void> {
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    const { error } = await supabase.from(table).update({ status }).eq('id', id);
    if (!error) return;
    console.error(`[storage] Supabase update failed for ${table}:`, error.message);
  }
  const records = await readJsonRecords(table);
  const updated = records.map((r) => (r.id === id ? { ...r, status } : r));
  await ensureDataDir();
  await fs.writeFile(path.join(DATA_DIR, `${table}.json`), JSON.stringify(updated, null, 2), 'utf-8');
}

export const storageBackend = () => (isSupabaseConfigured() ? 'supabase' : 'local-json');
