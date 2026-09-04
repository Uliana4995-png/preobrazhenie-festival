import { NextResponse } from 'next/server';
import { registrationSchema } from '@/lib/validation';
import { createSubmission } from '@/lib/storage';
import { checkRateLimit, getClientKey } from '@/lib/rateLimit';

export async function POST(request: Request) {
  const key = `registration:${getClientKey(request)}`;
  if (!checkRateLimit(key, 6, 60_000)) {
    return NextResponse.json({ error: 'Слишком много попыток. Попробуйте позже.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 });
  }

  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Проверьте правильность заполнения формы', issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // honeypot: если заполнено скрытое поле — это бот
  if (parsed.data.website) {
    return NextResponse.json({ id: 'ignored' }, { status: 200 });
  }

  const { website, ...payload } = parsed.data;
  const { id } = await createSubmission('registrations', payload);

  // TODO: подключить отправку email-подтверждения участнику и уведомления
  // организатору через EMAIL_API_KEY / ADMIN_EMAIL — см. README, раздел
  // "Уведомления по email".

  return NextResponse.json({ id }, { status: 201 });
}
