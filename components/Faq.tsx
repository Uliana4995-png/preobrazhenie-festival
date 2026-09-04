'use client';

import { useState } from 'react';
import type { FaqItem, AppearanceConfig } from '@/lib/content';
import { ChevronDown } from 'lucide-react';
import SectionBackdrop from './visuals/SectionBackdrop';
import Reveal from './visuals/Reveal';

export default function Faq({ items, appearance }: { items: FaqItem[]; appearance: AppearanceConfig }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="snap-page relative py-24 sm:py-32">
      <SectionBackdrop sigil={appearance.sectionSigils.faq || 'sun'} sigilPosition="right" />
      <div className="relative z-[3] mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal>
          <p className="text-sm text-gold mb-2">Частые вопросы</p>
          <h2 className="heading-loft text-3xl sm:text-4xl mb-6">Ответы на частые вопросы</h2>
        </Reveal>
        <div className="pearl-card divide-y divide-white/10 px-6">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  className="w-full flex items-center justify-between py-4 text-left"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <span className="text-pearl font-semibold pr-4">{item.q}</span>
                  <ChevronDown size={20} className={`shrink-0 text-turquoise transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && <p className="pb-4 text-pearl/70 text-sm leading-relaxed">{item.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
