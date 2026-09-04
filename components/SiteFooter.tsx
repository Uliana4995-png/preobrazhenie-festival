import Link from 'next/link';
import type { SiteConfig } from '@/lib/content';

export default function SiteFooter({ site }: { site: SiteConfig }) {
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE || site.contacts.phone;
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || site.contacts.email;
  const telegram = process.env.NEXT_PUBLIC_TELEGRAM_URL || site.contacts.telegram;

  return (
    <footer className="relative border-t border-gold/20" style={{ background: 'rgba(28,17,64,0.55)' }}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <p className="heading-loft text-lg">{site.title}</p>
          <p className="mt-2 text-sm text-pearl/70 normal-case">{site.slogan}</p>
          <p className="mt-4 text-sm text-pearl/60">
            {site.location.area}, {site.location.place}
          </p>
        </div>

        <div>
          <p className="text-sm uppercase tracking-wide text-gold mb-3">Контакты</p>
          <ul className="space-y-2 text-sm text-pearl/80">
            <li><a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-turquoise">{phone}</a></li>
            <li><a href={`mailto:${email}`} className="hover:text-turquoise">{email}</a></li>
            <li><a href={telegram} target="_blank" rel="noreferrer" className="hover:text-turquoise">Telegram</a></li>
          </ul>
        </div>

        <div>
          <p className="text-sm uppercase tracking-wide text-gold mb-3">Разделы</p>
          <ul className="space-y-2 text-sm text-pearl/80">
            <li><Link href="/schedule" className="hover:text-turquoise">Расписание</Link></li>
            <li><Link href="/online" className="hover:text-turquoise">Онлайн-трансляция</Link></li>
            <li><Link href="/gallery" className="hover:text-turquoise">Галерея</Link></li>
            <li><Link href="/contacts" className="hover:text-turquoise">«Глубокая чаша»</Link></li>
            <li><Link href="/explore" className="hover:text-turquoise">Все разделы →</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm uppercase tracking-wide text-gold mb-3">Документы</p>
          <ul className="space-y-2 text-sm text-pearl/80">
            <li><Link href="/oferta" className="hover:text-turquoise">Публичная оферта</Link></li>
            <li><Link href="/privacy" className="hover:text-turquoise">Политика конфиденциальности</Link></li>
            <li><Link href="/consent" className="hover:text-turquoise">Согласие на обработку персональных данных</Link></li>
            <li><Link href="/refund" className="hover:text-turquoise">Правила возврата</Link></li>
            <li><Link href="/rules" className="hover:text-turquoise">Правила участия</Link></li>
            <li><Link href="/safety" className="hover:text-turquoise">Техника безопасности</Link></li>
            <li><Link href="/disclaimer" className="hover:text-turquoise">Медицинский дисклеймер</Link></li>
          </ul>
        </div>
      </div>

      <div className="rule-gold" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-5 flex flex-col sm:flex-row justify-between gap-2 text-xs text-pearl/50">
        <p>© {site.year} Форум-Фестиваль «Преображение». Все права защищены.</p>
        <Link href="/admin" className="hover:text-turquoise">Вход для организатора</Link>
      </div>
    </footer>
  );
}
