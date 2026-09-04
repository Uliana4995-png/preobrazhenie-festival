import type { Package } from '@/lib/content';
import Reveal from './visuals/Reveal';

export function Packages({ packages }: { packages: Package[] }) {
  return (
    <section id="packages" className="snap-page relative py-24 sm:py-32">
      <div className="relative z-[3] mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-sm text-gold mb-2">Пакеты участия</p>
          <h2 className="heading-loft text-3xl sm:text-4xl">Выберите формат участия</h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {packages.map((p) => (
            <div key={p.id} className="pearl-card tight flex flex-col">
              <p className="heading-loft text-base">{p.title}</p>
              <p className="mt-2 text-2xl font-semibold text-gradient normal-case">{p.priceLabel}</p>
              {p.unit && <p className="text-xs text-pearl/50">{p.unit}</p>}
              <p className="mt-3 text-sm text-pearl/65 flex-1 normal-case">{p.description}</p>
              <a
                href="#registration"
                className="mt-4 text-sm text-center px-4 py-2.5 rounded-full border border-turquoise/50 text-turquoise hover:bg-turquoise/10 transition-colors"
              >
                Выбрать
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
