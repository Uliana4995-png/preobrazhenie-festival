import type { Speaker } from '@/lib/content';
import { CircleUser } from 'lucide-react';
import Reveal from './visuals/Reveal';

export default function Speakers({ speakers }: { speakers: Speaker[] }) {
  return (
    <section id="speakers" className="snap-page relative py-24 sm:py-32">
      <div className="relative z-[3] mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-sm text-gold mb-2">Спикеры и учёные</p>
          <h2 className="heading-loft text-3xl sm:text-4xl">Голоса фестиваля</h2>
          <p className="mt-3 text-pearl/70 max-w-xl">
            Список пополняется по мере подтверждения участия. Организатор добавляет спикеров через
            административную панель — вымышленные спикеры на сайте не публикуются.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {speakers.map((s) => (
            <div key={s.id} className="pearl-card tight">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-turquoise">
                  <CircleUser size={26} />
                </div>
                <div>
                  <p className="font-semibold text-pearl">{s.name}</p>
                  {(s.role || s.org) && <p className="text-xs text-pearl/50">{[s.role, s.org].filter(Boolean).join(', ')}</p>}
                </div>
              </div>
              {s.topic && <p className="text-sm text-pearl/80 mb-1">{s.topic}</p>}
              {s.description && <p className="text-sm text-pearl/60">{s.description}</p>}
              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full ${
                    s.status === 'подтверждён' ? 'bg-turquoise/20 text-turquoise' : 'bg-gold/15 text-gold'
                  }`}
                >
                  {s.status === 'подтверждён' ? 'Подтверждён' : 'Ожидается'}
                </span>
                {s.format && <span className="text-xs text-pearl/40">{s.format}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
