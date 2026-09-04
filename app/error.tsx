'use client';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="ru">
      <body className="bg-void text-pearl font-body min-h-screen flex items-center justify-center">
        <div className="max-w-lg px-6 text-center">
          <p className="text-sm text-gold mb-3">Ошибка</p>
          <h1 className="font-display text-3xl mb-4">Что-то пошло не так</h1>
          <p className="text-pearl/70 mb-8">
            Попробуйте обновить страницу. Если проблема повторяется, свяжитесь с организатором через
            контакты в подвале сайта.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-fuchsia to-turquoise text-void font-semibold"
          >
            Попробовать снова
          </button>
        </div>
      </body>
    </html>
  );
}
