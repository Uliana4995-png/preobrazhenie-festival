import { getSiteConfig, getLegal, getGallery } from '@/lib/content';
import SacredSigil from '@/components/visuals/SacredSigil';
import GalleryBook from '@/components/GalleryBook';
import { Phone, Mail, MapPin, Send } from 'lucide-react';

export const metadata = { title: '«Глубокая чаша» — Контакты — Форум-Фестиваль «Преображение»' };

export default async function ContactsPage() {
  const [site, legal, gallery] = await Promise.all([getSiteConfig(), getLegal(), getGallery()]);
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE || site.contacts.phone;
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || site.contacts.email;
  const telegram = process.env.NEXT_PUBLIC_TELEGRAM_URL || site.contacts.telegram;
  const vk = process.env.NEXT_PUBLIC_VK_URL || site.contacts.vk;
  const campImages = gallery.filter((g) => g.category === 'палаточный лагерь');

  return (
    <section className="relative py-24 sm:py-32">
      <SacredSigil type="shellspiral" size={420} className="absolute right-[2%] top-[6%] text-pearl fx-medium pointer-events-none z-[1]" />
      <div className="relative z-[3] mx-auto max-w-5xl px-5 sm:px-8">
        <p className="text-sm text-gold mb-2">Сакральное место «Глубокая чаша»</p>
        <h1 className="heading-loft text-3xl sm:text-5xl mb-3">Контакты и как добраться</h1>
        <p className="text-pearl/70 mb-10 max-w-2xl normal-case">
          {site.location.area}, {site.location.place}.
        </p>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="pearl-card p-6">
            <p className="heading-loft text-base mb-4">Контакты</p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-turquoise" />
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-turquoise">{phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-turquoise" />
                <a href={`mailto:${email}`} className="hover:text-turquoise">{email}</a>
              </li>
              <li className="flex items-center gap-3">
                <Send size={16} className="text-turquoise" />
                <a href={telegram} target="_blank" rel="noreferrer" className="hover:text-turquoise">Telegram-канал</a>
              </li>
              {vk && (
                <li className="flex items-center gap-3">
                  <Send size={16} className="text-turquoise" />
                  <a href={vk} target="_blank" rel="noreferrer" className="hover:text-turquoise">VK</a>
                </li>
              )}
              <li className="flex items-center gap-3">
                <MapPin size={16} className="text-turquoise" />
                <span>{legal.organizer.actualAddress}</span>
              </li>
            </ul>
            <div className="rule-gold my-5" />
            <p className="text-xs text-pearl/45 leading-relaxed">
              Другие каналы трансляции (радио, видео) — в разделе <a href="/online" className="text-turquoise">«Онлайн-трансляция»</a>.
            </p>
          </div>

          <div className="pearl-card p-6">
            <p className="heading-loft text-base mb-4">Условия проживания</p>
            <ul className="space-y-2 text-sm text-pearl/80">
              <li>— Кемпинг в горах, места ограничены, бронирование заранее</li>
              <li>— Место в палатке — 1 000 ₽ с человека</li>
              <li>— Своя палатка — без доплаты</li>
              <li>— Питание самостоятельно или по общему меню (отдельно)</li>
            </ul>
            <a href="/#registration" className="inline-block mt-5 px-5 py-2.5 rounded-full text-sm font-semibold" style={{ background: 'linear-gradient(90deg,#FF2BC2,#22E6D2)', color: '#120625' }}>
              Забронировать место
            </a>
          </div>
        </div>

        <div className="pearl-card overflow-hidden mb-12" style={{ aspectRatio: '16/6' }}>
          {site.location.mapEmbedUrl ? (
            <iframe src={site.location.mapEmbedUrl} className="w-full h-full border-0" loading="lazy" title="Карта" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-pearl/40 text-sm px-6 text-center">
              Карта появится после того, как организатор добавит ссылку в site.json → location.mapEmbedUrl
            </div>
          )}
        </div>

        {campImages.length > 0 && (
          <>
            <p className="text-sm text-gold mb-4">Фотогалерея лагеря</p>
            <GalleryBook images={campImages} />
          </>
        )}
      </div>
    </section>
  );
}
