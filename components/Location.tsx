import type { SiteConfig, AppearanceConfig } from '@/lib/content';
import Reveal from './visuals/Reveal';
import SectionBackdrop from './visuals/SectionBackdrop';
import NatureVignette from './visuals/NatureVignette';

export default function Location({ site, appearance }: { site: SiteConfig; appearance: AppearanceConfig }) {
  return (
    <section id="location" className="snap-page relative py-24 sm:py-32">
      <SectionBackdrop sigil={appearance.sectionSigils.location || 'shellspiral'} sigilPosition="left" />
      <NatureVignette />
      <div className="relative z-[3] mx-auto max-w-7xl px-5 sm:px-8 grid lg:grid-cols-2 gap-10 items-center">
        <Reveal>
          <p className="text-sm text-gold mb-2">Место проведения</p>
          <h2 className="heading-loft text-3xl sm:text-4xl">{site.location.area}</h2>
          <p className="mt-3 text-pearl/70 max-w-lg">
            Сакральное природное место «{site.location.place.replace('сакральное место ', '').replace(/«|»/g, '')}» —
            горы, пещера с кристаллами, семь источников, водопад, мох, папоротники и древние деревья.
          </p>
          <ul className="mt-6 space-y-3 text-pearl/75">
            <li>— Гора с пещерой и кристаллами</li>
            <li>— Семь природных источников</li>
            <li>— Водопад и папоротниковые заросли</li>
            <li>— Покрытые мхом камни и вековые деревья</li>
          </ul>
        </Reveal>
        <Reveal className="relative rounded-[42px_26px_46px_24px/26px_42px_24px_46px] overflow-hidden pearl-card h-72 lg:h-96 flex items-center justify-center">
          {site.location.mapEmbedUrl ? (
            <iframe src={site.location.mapEmbedUrl} className="w-full h-full border-0" loading="lazy" title="Карта места проведения" />
          ) : (
            <p className="text-pearl/50 text-sm px-6 text-center">
              Здесь появится карта проезда после того, как организатор добавит ссылку в административной панели
              (site.json → location.mapEmbedUrl).
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
