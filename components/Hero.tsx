import type { SiteConfig, AppearanceConfig } from '@/lib/content';
import Phoenix from './visuals/Phoenix';
import SacredSigil from './visuals/SacredSigil';
import FernFrame from './visuals/FernFrame';

export default function Hero({ site, appearance }: { site: SiteConfig; appearance: AppearanceConfig }) {
  return (
    <section id="top" className="snap-page relative min-h-screen flex items-end overflow-hidden">
      <FernFrame position="bottom" />
      <SacredSigil
        type={appearance.sectionSigils.hero || 'crystalstar'}
        size={560}
        className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 text-pearl fx-medium pointer-events-none z-[1] animate-spinSlow"
      />
      <Phoenix
        imageUrl={appearance.images.phoenix || undefined}
        className="fx-medium absolute right-[-4%] top-[8%] w-[62vw] max-w-[560px] opacity-90 animate-drift"
      />

      {/* силуэт гор Абхазии */}
      <svg viewBox="0 0 1200 260" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-[26vh] z-[2]" aria-hidden="true">
        <path d="M0 260 L0 160 L150 60 L280 150 L420 40 L560 140 L700 70 L860 170 L1000 80 L1200 160 L1200 260 Z" fill="#1C1140" opacity="0.9" />
        <path d="M0 260 L0 200 L200 120 L380 190 L560 110 L760 200 L960 130 L1200 210 L1200 260 Z" fill="#120625" />
      </svg>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 pb-24 pt-40 w-full">
        <div className="max-w-2xl">
          <p className="text-sm tracking-wide text-gold mb-4">
            {site.dates.display} · {site.location.region}
          </p>
          <h1 className="heading-loft text-3xl sm:text-5xl">{site.title}</h1>
          <p className="mt-5 heading-loft text-xl sm:text-2xl text-gradient normal-case" style={{ letterSpacing: 0 }}>
            «{site.slogan}»
          </p>
          <p className="mt-4 text-pearl/80 text-base sm:text-lg max-w-xl">{site.subtitle}</p>
          <p className="mt-6 text-pearl/55 text-sm sm:text-base">
            {site.location.area}, {site.location.place}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#registration"
              className="px-6 py-3.5 rounded-full font-bold text-sm"
              style={{ background: 'linear-gradient(90deg,#FF2BC2,#22E6D2)', color: '#120625' }}
            >
              {site.cta.participate}
            </a>
            <a href="#program" className="px-6 py-3.5 rounded-full text-sm border border-gold/50 text-pearl">
              {site.cta.program}
            </a>
            <a href="#speakers-form" className="px-6 py-3.5 rounded-full text-sm border border-gold/50 text-pearl">
              Стать спикером
            </a>
            <a href="/online" className="px-6 py-3.5 rounded-full text-sm border border-turquoise/60 text-turquoise">
              Смотреть онлайн
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
