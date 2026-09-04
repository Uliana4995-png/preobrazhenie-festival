import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center">
      <div className="mx-auto max-w-lg px-5 sm:px-8 text-center">
        <p className="text-sm text-gold mb-3">404</p>
        <h1 className="font-display text-3xl mb-4">Страница не найдена</h1>
        <p className="text-pearl/70 mb-8">
          Возможно, ссылка устарела или страница была перемещена. Вернитесь на главную и найдите нужный
          раздел через меню.
        </p>
        <Link href="/" className="px-6 py-3 rounded-full bg-gradient-to-r from-fuchsia to-turquoise text-void font-semibold">
          На главную
        </Link>
      </div>
    </section>
  );
}
