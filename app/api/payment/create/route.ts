import { NextResponse } from 'next/server';
import { paymentCreateSchema } from '@/lib/validation';
import { createPayment } from '@/lib/payment';
import { createSubmission } from '@/lib/storage';
import { checkRateLimit, getClientKey } from '@/lib/rateLimit';

export async function POST(request: Request) {
  const key = `payment:${getClientKey(request)}`;
  if (!checkRateLimit(key, 10, 60_000)) {
    return NextResponse.json({ error: 'Слишком много попыток. Попробуйте позже.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 });
  }

  const parsed = paymentCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Некорректные данные платежа' }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  try {
    const { id: orderId } = await createSubmission('orders', {
      registration_id: parsed.data.registrationId,
      package_id: parsed.data.packageId,
      amount: parsed.data.amount,
      description: parsed.data.description,
      payment_status: 'создан'
    });

    const payment = await createPayment({
      amount: parsed.data.amount,
      description: parsed.data.description,
      orderId,
      returnUrl: `${siteUrl}/payment/success`
    });

    return NextResponse.json({
      orderId,
      confirmationUrl: payment.confirmationUrl,
      isDemo: payment.isDemo,
      provider: payment.provider
    });
  } catch (e) {
    console.error('[payment/create]', e);
    return NextResponse.json({ error: 'Не удалось создать платёж. Попробуйте позже.' }, { status: 500 });
  }
}
