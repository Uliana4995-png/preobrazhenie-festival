import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { isAdminRequestAuthenticated } from '@/lib/adminAuth';
import { getSupabaseAdminClient } from '@/lib/supabase';

export async function POST(request: Request) {
  if (!isAdminRequestAuthenticated()) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase не настроен — загрузка фото недоступна' }, { status: 500 });
  }

  const formData = await request.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Файл не передан' }, { status: 400 });
  }
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Можно загружать только изображения' }, { status: 400 });
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'Файл слишком большой (максимум 10 МБ)' }, { status: 400 });
  }

  const ext = file.name.split('.').pop() || 'jpg';
  const path = `uploads/${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from('site-images').upload(path, buffer, {
    contentType: file.type,
    upsert: false
  });

  if (error) {
    return NextResponse.json({ error: `Ошибка загрузки: ${error.message}` }, { status: 500 });
  }

  const { data } = supabase.storage.from('site-images').getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
