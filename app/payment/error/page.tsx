import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function PaymentErrorPage() {
  return (
    <section className="min-h-[70vh] flex items-center">
      <div className="mx-auto max-w-lg px-5 sm:px-8 text-center">
        <XCircle size={48} className="mx-auto text-fuchsia mb-4" />
        <h1 className="font-display text-3xl mb-3">Не удалось завершить оплату</h1>
        <p className="text-pearl/70 mb-6">
          Платёж не был проведён. Попробуйте ещё раз или свяжитесь с организатором — заявка сохранена.
        </p>
        <Link href="/#registration" className="inline-block px-6 py-3 rounded-full border border-gold/50 text-pearl">
          Попробовать снова
        </Link>
      </div>
    </section>
  );
}
