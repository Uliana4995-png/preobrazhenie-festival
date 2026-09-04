import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function PaymentSuccessPage({
  searchParams
}: {
  searchParams: { demo?: string; free?: string; order_id?: string; amount?: string };
}) {
  const isDemo = searchParams.demo === '1';
  const isFree = searchParams.free === '1';

  return (
    <section className="min-h-[70vh] flex items-center">
      <div className="mx-auto max-w-lg px-5 sm:px-8 text-center">
        <CheckCircle2 size={48} className="mx-auto text-turquoise mb-4" />
        <h1 className="font-display text-3xl mb-3">
          {isFree ? 'Заявка отправлена' : 'Оплата прошла успешно'}
        </h1>
        {isDemo && (
          <p className="mb-4 text-sm px-4 py-2 rounded-full bg-gold/15 text-gold inline-block">
            Демонстрационный режим оплаты — реальное списание средств не производилось
          </p>
        )}
        <p className="text-pearl/70 mb-2">
          Организатор получил вашу заявку{!isFree && ' и подтверждение оплаты'}. Подтверждение придёт на
          указанный email.
        </p>
        {searchParams.order_id && (
          <p className="text-xs text-pearl/40 mb-6 font-mono">Заказ: {searchParams.order_id}</p>
        )}
        <Link href="/" className="inline-block mt-4 px-6 py-3 rounded-full bg-gradient-to-r from-fuchsia to-turquoise text-void font-semibold">
          Вернуться на сайт
        </Link>
      </div>
    </section>
  );
}
