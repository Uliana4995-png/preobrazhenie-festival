import { NextResponse } from 'next/server';
import { partnerApplicationSchema } from '@/lib/validation';
import { createSubmission } from '@/lib/storage';
import { checkRateLimit, getClientKey } from '@/lib/rateLimit';

export async function POST(request: Request) {
  const key = `partner:${getClientKey(request)}`;
  if (!checkRateLimit(key, 6, 60_000)) {
    return NextResponse.json({ error: 'Слишком много попыток. Попробуйте позже.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 });
  }

  const parsed = partnerApplicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Проверьте правильность заполнения формы', issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ id: 'ignored' }, { status: 200 });
  }

  const { website, ...payload } = parsed.data;
  const { id } = await createSubmission('partner_applications', payload);

  return NextResponse.json({ id }, { status: 201 });
}
