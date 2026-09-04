import { notFound } from 'next/navigation';
import { getTopicPages, getSpeakers } from '@/lib/content';
import SacredSigil from '@/components/visuals/SacredSigil';
import { CircleUser } from 'lucide-react';

export async function generateStaticParams() {
  const pages = await getTopicPages();
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const pages = await getTopicPages();
  const page = pages.find((p) => p.slug === params.slug);
  return { title: page ? `${page.title} — Форум-Фестиваль «Преображение»` : 'Раздел не найден' };
}

export default async function TopicPage({ params }: { params: { slug: string } }) {
  const [pages, speakers] = await Promise.all([getTopicPages(), getSpeakers()]);
  const page = pages.find((p) => p.slug === params.slug);
  if (!page) notFound();

  return (
    <section className="relative py-24 sm:py-32">
      <SacredSigil type={page.sigil} size={420} className="absolute right-[2%] top-[8%] text-pearl fx-medium pointer-events-none z-[1]" />
      <div className="relative z-[3] mx-auto max-w-4xl px-5 sm:px-8">
        <p className="text-sm text-gold mb-2">Пространство фестиваля</p>
        <h1 className="heading-loft text-3xl sm:text-5xl mb-3">{page.title}</h1>
        <p className="text-pearl/70 text-lg mb-10 normal-case">{page.subtitle}</p>

        {(page.imageUrl !== undefined || page.videoUrl !== undefined) && (
          <div className={`grid gap-5 mb-10 ${page.imageUrl !== undefined && page.videoUrl !== undefined ? 'sm:grid-cols-2' : ''}`}>
            {page.imageUrl !== undefined &&
              (page.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={page.imageUrl} alt={page.title} className="rounded-3xl w-full object-cover" style={{ aspectRatio: '4/3' }} />
              ) : (
                <div className="pearl-card tight flex items-center justify-center text-center text-sm text-pearl/40" style={{ aspectRatio: '4/3' }}>
                  Изображение появится здесь после загрузки организатором
                </div>
              ))}
            {page.videoUrl !== undefined &&
              (page.videoUrl ? (
                <video src={page.videoUrl} controls className="rounded-3xl w-full" style={{ aspectRatio: '4/3' }} />
              ) : (
                <div className="pearl-card tight flex items-center justify-center text-center text-sm text-pearl/40" style={{ aspectRatio: '4/3' }}>
                  Видео появится здесь после загрузки организатором
                </div>
              ))}
          </div>
        )}

        <div className="space-y-8">
          {page.sections.map((s) => (
            <div key={s.title} className="pearl-card p-6 sm:p-8">
              <p className="text-xs uppercase text-turquoise mb-2">{s.title}</p>
              <p className="text-pearl/80 leading-relaxed normal-case">{s.body}</p>
            </div>
          ))}
        </div>

        {page.roundtables && page.roundtables.length > 0 && (
          <div className="mt-10">
            <p className="text-sm text-gold mb-4">Круглые столы</p>
            <div className="grid sm:grid-cols-3 gap-5 mb-6">
              {page.roundtables.map((rt) => (
                <div key={rt.title} className="pearl-card tight">
                  <p className="heading-loft text-base mb-2">{rt.title}</p>
                  <p className="text-sm text-pearl/65 normal-case">{rt.description}</p>
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {speakers.slice(0, 3).map((s) => (
                <div key={s.id} className="pearl-card tight flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-white/5 flex items-center justify-center text-turquoise shrink-0">
                    <CircleUser size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-pearl">{s.name}</p>
                    <p className="text-xs text-pearl/50">{s.status === 'подтверждён' ? 'Подтверждён' : 'Ожидается'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {page.items && page.items.length > 0 && (
          <div className="mt-10">
            <p className="text-sm text-gold mb-4">{page.itemsLabel || 'Материалы раздела'}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {page.items.map((item) => (
                <div key={item.title} className="pearl-card tight">
                  <p className="heading-loft text-base mb-1">{item.title}</p>
                  {item.subtitle && <p className="text-xs text-turquoise mb-2 normal-case">{item.subtitle}</p>}
                  {item.description && <p className="text-sm text-pearl/65 normal-case">{item.description}</p>}
                  {item.url && (
                    <a href={item.url} className="text-xs text-turquoise mt-2 inline-block">
                      Открыть →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {page.note && <p className="mt-10 text-xs text-pearl/45 leading-relaxed border-t border-white/10 pt-5">{page.note}</p>}
      </div>
    </section>
  );
}
