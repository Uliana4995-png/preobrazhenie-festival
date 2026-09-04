'use client';

import { useState } from 'react';
import type { ProgramDay, TimingItem, AppearanceConfig } from '@/lib/content';
import AddToCalendarButton from './AddToCalendarButton';
import SectionBackdrop from './visuals/SectionBackdrop';
import Reveal from './visuals/Reveal';

function Block({ title, items }: { title: string; items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-turquoise mb-2">{title}</p>
      <ul className="space-y-1.5 text-sm text-pearl/80">
        {items.map((item) => (
          <li key={item}>— {item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function ProgramTimeline({
  days,
  timing,
  appearance
}: {
  days: ProgramDay[];
  timing: { baseOffline: TimingItem[]; baseOnline: TimingItem[] };
  appearance: AppearanceConfig;
}) {
  const [activeId, setActiveId] = useState(days[0]?.id);
  const active = days.find((d) => d.id === activeId) ?? days[0];

  return (
    <section id="program" className="snap-page relative py-24 sm:py-32">
      <SectionBackdrop sigil={appearance.sectionSigils.program || 'mandala'} sigilPosition="right" />
      <div className="relative z-[3] mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-sm text-gold mb-2">Программа</p>
          <h2 className="heading-loft text-3xl sm:text-4xl">Десять дней Преображения</h2>
          <p className="mt-3 text-pearl/70 max-w-xl">
            Выберите день, чтобы увидеть подробную программу. Время и события можно изменить в административной
            панели.
          </p>
        </Reveal>

        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 mt-8 -mx-1 px-1" role="tablist" aria-label="Дни фестиваля">
          {days.map((d) => (
            <button
              key={d.id}
              role="tab"
              aria-selected={d.id === active?.id}
              onClick={() => setActiveId(d.id)}
              className={`shrink-0 px-4 py-2.5 rounded-full text-sm font-semibold border transition-colors ${
                d.id === active?.id
                  ? 'bg-gradient-to-r from-fuchsia to-turquoise text-void border-transparent'
                  : 'border-gold/30 text-pearl/70 hover:bg-white/5'
              }`}
            >
              {d.dateLabel}
            </button>
          ))}
        </div>

        {active && (
          <div className="pearl-card p-6 sm:p-10">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-sm text-gold mb-1">{active.dateLabel}</p>
                <h3 className="heading-loft text-2xl sm:text-3xl">{active.title}</h3>
                {active.theme && <p className="text-pearl/60 text-sm mt-1 normal-case">{active.theme}</p>}
              </div>
              <AddToCalendarButton date={active.date} title={active.title} description={active.theme} />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Block title="Утро" items={active.morning} />
              <Block title="День" items={active.day} />
              {active.roundtable && <Block title="Круглый стол" items={[active.roundtable]} />}
              <Block title="Онлайн-программа" items={active.online} />
              <Block title="Вечер" items={active.evening} />
            </div>

            {active.practicalInfo && (
              <p className="mt-8 text-sm text-pearl/60 border-t border-white/10 pt-5">{active.practicalInfo}</p>
            )}

            {active.usesBaseTiming && (
              <details className="mt-6">
                <summary className="cursor-pointer text-sm text-turquoise">Базовый тайминг очной программы этого дня</summary>
                <ul className="mt-3 space-y-1.5 text-sm text-pearl/70">
                  {timing.baseOffline.map((t) => (
                    <li key={t.time} className="flex gap-3">
                      <span className="text-gold w-28 shrink-0">{t.time}</span>
                      <span>{t.title}</span>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
