import 'server-only';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Клиент Supabase создаётся только если заданы переменные окружения.
 * Пока Supabase не подключён, сайт работает на локальном JSON-хранилище
 * (см. lib/storage.ts), и весь остальной код продолжает работать без изменений —
 * это позволяет запустить сайт сразу и подключить базу данных позже.
 */
let cachedClient: SupabaseClient | null = null;

export function getSupabaseAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = createClient(url, serviceKey, {
      auth: { persistSession: false }
    });
  }

  return cachedClient;
}

export const isSupabaseConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
