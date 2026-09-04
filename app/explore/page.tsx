import Link from 'next/link';
import { getTopicPages } from '@/lib/content';
import SacredSigil from '@/components/visuals/SacredSigil';

export const metadata = { title: 'Все разделы — Форум-Фестиваль «Преображение»' };

const CORE_LINKS = [
  { href: '/schedule', label: 'Расписание', description: 'Тайминг очной и онлайн-программы на двух площадках' },
  { href: '/online', label: 'Онлайн-трансляция', description: 'Прямой эфир, архив, чат' },
  { href: '/gallery', label: 'Галерея', description: 'Фотографии и концептуальные визуализации по категориям' },
  { href: '/contacts', label: '«Глубокая чаша»', description: 'Контакты, карта, условия проживания' }
];

export default async function ExplorePage() {
  const topics = await getTopicPages();

  return (
    <section className="relative py-24 sm:py-32">
      <SacredSigil type="dotcircle" size={420} className="absolute right-[2%] top-[8%] text-pearl fx-medium pointer-events-none z-[1]" />
      <div className="relative z-[3] mx-auto max-w-6xl px-5 sm:px-8">
        <p className="text-sm text-gold mb-2">Карта сайта</p>
        <h1 className="heading-loft text-3xl sm:text-5xl mb-10">Все пространства фестиваля</h1>

        <p className="text-sm text-gold mb-4">Основные разделы</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {CORE_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="pearl-card tight block hover:-translate-y-1 transition-transform">
              <p className="heading-loft text-base mb-2">{l.label}</p>
              <p className="text-xs text-pearl/60 normal-case">{l.description}</p>
            </Link>
          ))}
        </div>

        <p className="text-sm text-gold mb-4">Тематические пространства</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {topics.map((t) => (
            <Link key={t.slug} href={`/pages/${t.slug}`} className="pearl-card tight block hover:-translate-y-1 transition-transform">
              <p className="heading-loft text-base mb-2">{t.navLabel}</p>
              <p className="text-xs text-pearl/60 normal-case">{t.subtitle}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
