import { NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/payment';
import { updateSubmissionStatus } from '@/lib/storage';

/**
 * Обработчик webhook от платёжного провайдера.
 *
 * Защита от повторной обработки: используем orderId/paymentId как
 * идемпотентный ключ и переводим заказ в статус "оплачен" только один раз
 * (updateSubmissionStatus идемпотентен по своей природе — повторный
 * такой же статус не создаёт побочных эффектов).
 *
 * Для ЮKassa: настройте в личном кабинете URL
 * `${NEXT_PUBLIC_SITE_URL}/api/payment/webhook` для событий
 * payment.succeeded и payment.canceled.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-signature') || request.headers.get('content-signature');

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Недействительная подпись' }, { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Некорректное тело запроса' }, { status: 400 });
  }

  // Формат события ЮKassa: { event: 'payment.succeeded', object: { id, metadata: { orderId } } }
  const eventType: string = payload.event || payload.type || 'unknown';
  const orderId: string | undefined = payload.object?.metadata?.orderId || payload.orderId;

  if (!orderId) {
    return NextResponse.json({ error: 'orderId не найден в событии' }, { status: 400 });
  }

  if (eventType === 'payment.succeeded') {
    await updateSubmissionStatus('orders', orderId, 'оплачен');
    // TODO: отправить подтверждение участнику и уведомление организатору
    // (см. README, раздел "Уведомления по email").
  } else if (eventType === 'payment.canceled') {
    await updateSubmissionStatus('orders', orderId, 'отменён');
  }

  return NextResponse.json({ received: true });
}
