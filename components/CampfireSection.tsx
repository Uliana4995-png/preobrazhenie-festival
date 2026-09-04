import type { AppearanceConfig } from '@/lib/content';
import { getActiveTier } from '@/lib/content';
import SacredSigil from './visuals/SacredSigil';
import FernFrame from './visuals/FernFrame';
import Phoenix from './visuals/Phoenix';

/**
 * Самая яркая тематическая страница — атмосфера кемпинга и костра.
 * По требованиям правдоподобия: если сцена не является реальной
 * фотографией, страница явно помечена как концептуальная визуализация.
 */
export default function CampfireSection({
  pricing,
  appearance
}: {
  pricing: {
    headline: string;
    originalPrice: number;
    tiers: { label: string; until: string; price: number }[];
    notes: string[];
    disclaimers: string[];
  };
  appearance: AppearanceConfig;
}) {
  const activeTier = getActiveTier(pricing.tiers);
  return (
    <section
      id="campfire"
      className="snap-page relative py-24 sm:py-32 overflow-hidden"
      style={{ background: 'radial-gradient(circle at 50% 78%, rgba(255,170,60,0.22), transparent 55%)' }}
    >
      <FernFrame position="top" />
      <FernFrame position="bottom" />
      <SacredSigil
        type={appearance.sectionSigils.campfire || 'infinity'}
        className="absolute left-[4%] top-[10%] text-pearl fx-medium pointer-events-none z-[1]"
        size={320}
      />

      {appearance.images.dove ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={appearance.images.dove} alt="" className="absolute top-[12%] right-[10%] w-24 opacity-85 animate-drift fx-medium" />
      ) : (
        <svg viewBox="0 0 110 70" className="absolute top-[12%] right-[10%] w-24 opacity-85 animate-drift fx-medium" aria-hidden="true">
          <g fill="rgba(248,244,255,0.92)">
            <path d="M55 38 C50 24 40 16 26 14 C34 22 38 28 38 34 C24 26 12 26 2 32 C14 30 24 34 32 42 C20 42 10 46 2 54 C16 50 28 48 38 52 C36 58 36 62 40 68 C42 60 46 54 52 50 Z" />
            <path d="M55 38 C60 24 70 16 84 14 C76 22 72 28 72 34 C86 26 98 26 108 32 C96 30 86 34 78 42 C90 42 100 46 108 54 C94 50 82 48 72 52 C74 58 74 62 70 68 C68 60 64 54 58 50 Z" />
          </g>
        </svg>
      )}

      <div className="fx-heavy absolute bottom-[70px] left-1/2 -translate-x-1/2 z-[3]" style={{ filter: 'drop-shadow(0 0 40px rgba(255,150,40,0.75))' }}>
        <svg width="140" height="190" viewBox="0 0 140 190">
          <defs>
            <linearGradient id="fgOuter2" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#c23a1a" />
              <stop offset="35%" stopColor="#ff6a1a" />
              <stop offset="70%" stopColor="#ffb347" />
              <stop offset="100%" stopColor="#ffe9a8" />
            </linearGradient>
            <linearGradient id="fgMid2" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#ff7a1a" />
              <stop offset="50%" stopColor="#ffcf4d" />
              <stop offset="100%" stopColor="#fff6d6" />
            </linearGradient>
            <linearGradient id="fgInner2" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#ffdd7a" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
          </defs>
          <g stroke="#3a2114" strokeWidth="1">
            <rect x="26" y="162" width="66" height="11" rx="5" fill="#5a3420" transform="rotate(-6 59 167)" />
            <rect x="46" y="164" width="70" height="11" rx="5" fill="#6b3f26" transform="rotate(8 81 169)" />
          </g>
          <path
            className="animate-flicker"
            style={{ transformOrigin: 'bottom center' }}
            d="M70 178 C34 178 18 138 34 104 C30 122 42 124 44 108 C46 78 62 58 56 30 C86 48 96 82 82 108 C96 100 100 84 98 70 C112 96 106 138 70 178 Z"
            fill="url(#fgOuter2)"
            opacity="0.95"
          />
          <path
            className="animate-flicker"
            style={{ transformOrigin: 'bottom center', animationDelay: '.25s' }}
            d="M70 176 C48 176 38 150 46 126 C44 138 52 140 54 128 C56 106 66 92 62 70 C80 84 86 106 78 126 C88 120 90 108 88 98 C98 116 96 148 70 176 Z"
            fill="url(#fgMid2)"
            opacity="0.95"
          />
          <path
            className="animate-flicker"
            style={{ transformOrigin: 'bottom center', animationDelay: '.45s' }}
            d="M70 172 C58 172 52 156 57 140 C56 148 61 149 62 142 C63 128 69 118 66 104 C77 114 81 128 76 142 C82 138 83 130 82 124 C88 136 87 156 70 172 Z"
            fill="url(#fgInner2)"
          />
        </svg>
      </div>

      <div className="fx-medium absolute bottom-[60px] left-0 right-0 flex justify-center gap-10 opacity-75 z-[2]">
        {['#FF2BC2', '#22E6D2', '#FFD978'].map((c, i) => (
          <svg key={i} width="90" height="70" viewBox="0 0 90 70">
            <path d="M5 65 L45 10 L85 65 Z" fill={`${c}55`} stroke="rgba(255,217,120,0.7)" strokeWidth="2" />
          </svg>
        ))}
      </div>

      <div className="relative z-[4] mx-auto max-w-3xl px-5 sm:px-8 text-center">
        <p className="text-sm text-gold mb-2">Кемпинг в горах</p>
        <h2 className="heading-loft text-3xl sm:text-5xl" style={{ textShadow: '0 0 20px rgba(255,170,60,0.85), 0 0 40px rgba(255,43,194,0.4)' }}>
          Костёр единения
        </h2>
        <p className="mt-4 text-pearl/80 max-w-xl mx-auto">
          Ночлег под звёздным небом, тёплый костёр и пространство для тишины и общения.
        </p>
        <p className="mt-3 text-xs text-pearl/40">Концептуальная визуализация атмосферы фестиваля</p>

        <div className="mt-10 pearl-card p-6 sm:p-8 text-left">
          <div className="flex flex-wrap items-baseline gap-3 mb-5">
            <span className="text-2xl text-pearl/40 line-through">{pricing.originalPrice.toLocaleString('ru-RU')} ₽</span>
            <span className="heading-loft text-2xl text-gradient normal-case">
              {activeTier ? activeTier.price.toLocaleString('ru-RU') : pricing.tiers[0]?.price.toLocaleString('ru-RU')} ₽
            </span>
            <span className="text-sm text-pearl/60">за день{activeTier ? ` · действует ${activeTier.label}` : ''}</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {pricing.tiers.map((tier) => {
              const isActive = activeTier?.label === tier.label;
              return (
                <div
                  key={tier.label}
                  className="rounded-2xl px-4 py-3 text-sm flex items-center justify-between"
                  style={
                    isActive
                      ? { background: 'linear-gradient(90deg, rgba(255,43,194,0.25), rgba(34,230,210,0.2))', border: '1px solid rgba(34,230,210,0.5)' }
                      : { border: '1px solid rgba(255,217,120,0.2)' }
                  }
                >
                  <span className="text-pearl/75">{tier.label}</span>
                  <span className={isActive ? 'font-bold text-turquoise' : 'text-pearl/60'}>{tier.price.toLocaleString('ru-RU')} ₽</span>
                </div>
              );
            })}
          </div>

          <ul className="space-y-2">
            {pricing.notes.map((n) => (
              <li key={n} className="text-sm text-pearl/80">
                {n}
              </li>
            ))}
          </ul>
          <div className="rule-gold my-5" />
          <ul className="space-y-1.5">
            {pricing.disclaimers.map((d) => (
              <li key={d} className="text-xs text-pearl/50">
                — {d}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="#registration"
            className="px-6 py-3.5 rounded-full font-bold text-sm"
            style={{ background: 'linear-gradient(90deg,#FF2BC2,#22E6D2)', color: '#120625' }}
          >
            Забронировать место
          </a>
          <a href="#pricing" className="px-6 py-3.5 rounded-full text-sm border border-gold/50 text-pearl">
            Узнать об условиях
          </a>
          <a href="#registration" className="px-6 py-3.5 rounded-full text-sm border border-turquoise/60 text-turquoise">
            Перейти к оплате
          </a>
        </div>
      </div>
    </section>
  );
}
