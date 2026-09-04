import Link from 'next/link';

export default function LegalPage({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Link href="/" className="text-sm text-turquoise hover:underline">
          ← Вернуться на главную
        </Link>
        <h1 className="font-display text-3xl sm:text-4xl mt-6 mb-8">{title}</h1>
        <div className="prose-legal space-y-4 text-pearl/80 text-sm leading-relaxed">{children}</div>
      </div>
    </section>
  );
}
