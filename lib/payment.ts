import 'server-only';
import { randomUUID, createHmac } from 'node:crypto';

/**
 * Абстракция платёжного провайдера.
 *
 * PAYMENT_PROVIDER=demo (по умолчанию) — безопасный тестовый режим:
 *   деньги не списываются, оплата "успешна" сразу, страница явно
 *   помечена как демонстрационная. Это позволяет проверить весь
 *   путь пользователя (форма → расчёт → оплата → подтверждение)
 *   до подключения реального эквайринга.
 *
 * PAYMENT_PROVIDER=yookassa — структура готова для ЮKassa:
 *   заполните PAYMENT_SHOP_ID и PAYMENT_SECRET_KEY и раскомментируйте/
 *   реализуйте вызов реального API ЮKassa в createYookassaPayment().
 *
 * PAYMENT_PROVIDER=cloudpayments — аналогично для CloudPayments.
 *
 * Секретные ключи никогда не передаются в клиентский код: вся логика
 * находится в серверных API-маршрутах (app/api/payment/*).
 */

export interface CreatePaymentParams {
  amount: number;
  description: string;
  orderId: string;
  returnUrl: string;
}

export interface CreatePaymentResult {
  paymentId: string;
  confirmationUrl: string;
  provider: string;
  isDemo: boolean;
}

export async function createPayment(params: CreatePaymentParams): Promise<CreatePaymentResult> {
  const provider = process.env.PAYMENT_PROVIDER || 'demo';

  if (provider === 'yookassa') {
    return createYookassaPayment(params);
  }
  if (provider === 'cloudpayments') {
    return createCloudPaymentsPayment(params);
  }
  return createDemoPayment(params);
}

function createDemoPayment(params: CreatePaymentParams): CreatePaymentResult {
  const paymentId = `demo_${randomUUID()}`;
  const confirmationUrl = `${params.returnUrl}?demo=1&payment_id=${paymentId}&order_id=${params.orderId}&amount=${params.amount}`;
  return { paymentId, confirmationUrl, provider: 'demo', isDemo: true };
}

async function createYookassaPayment(params: CreatePaymentParams): Promise<CreatePaymentResult> {
  const shopId = process.env.PAYMENT_SHOP_ID;
  const secretKey = process.env.PAYMENT_SECRET_KEY;

  if (!shopId || !secretKey) {
    throw new Error(
      'PAYMENT_PROVIDER=yookassa, но PAYMENT_SHOP_ID / PAYMENT_SECRET_KEY не заданы в переменных окружения.'
    );
  }

  const idempotenceKey = randomUUID();
  const auth = Buffer.from(`${shopId}:${secretKey}`).toString('base64');

  const response = await fetch('https://api.yookassa.ru/v3/payments', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Idempotence-Key': idempotenceKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: { value: params.amount.toFixed(2), currency: 'RUB' },
      confirmation: { type: 'redirect', return_url: params.returnUrl },
      capture: true,
      description: params.description,
      metadata: { orderId: params.orderId }
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ошибка создания платежа ЮKassa: ${response.status} ${text}`);
  }

  const data = await response.json();
  return {
    paymentId: data.id,
    confirmationUrl: data.confirmation?.confirmation_url,
    provider: 'yookassa',
    isDemo: false
  };
}

async function createCloudPaymentsPayment(params: CreatePaymentParams): Promise<CreatePaymentResult> {
  // CloudPayments обычно интегрируется через виджет на клиенте (Checkout.js),
  // а не через server-side redirect. Здесь создаётся только запись заказа —
  // фактический вызов виджета CloudPayments должен быть добавлен на
  // странице оплаты с использованием PAYMENT_SHOP_ID в качестве Public ID.
  const paymentId = `cp_${randomUUID()}`;
  return {
    paymentId,
    confirmationUrl: `${params.returnUrl}?provider=cloudpayments&order_id=${params.orderId}`,
    provider: 'cloudpayments',
    isDemo: false
  };
}

/** Проверка подписи webhook (для реальных провайдеров). */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  const provider = process.env.PAYMENT_PROVIDER || 'demo';
  if (provider === 'demo') return true;

  const secretKey = process.env.PAYMENT_SECRET_KEY;
  if (!secretKey || !signature) return false;

  const expected = createHmac('sha256', secretKey).update(rawBody).digest('hex');
  return expected === signature;
}
