import MandalaComposition from './compositions/MandalaComposition';
import Reveal from './visuals/Reveal';
import SectionBackdrop from './visuals/SectionBackdrop';
import type { AppearanceConfig } from '@/lib/content';

export default function Center({
  center,
  appearance
}: {
  center: {
    title: string;
    intro: string;
    features: string[];
    researchDisclaimer: string;
    vision: string;
  };
  appearance: AppearanceConfig;
}) {
  const items = center.features.slice(0, 10).map((f) => ({ title: f }));

  return (
    <section id="center" className="snap-page relative py-24 sm:py-32">
      <SectionBackdrop sigil={appearance.sectionSigils.program || 'mandala'} sigilPosition="left" />
      <div className="relative z-[3] mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="text-center mb-8">
          <p className="text-sm text-gold mb-2">Закладка первого комплекса</p>
          <h2 className="heading-loft text-3xl sm:text-4xl">{center.title}</h2>
          <p className="mt-3 text-pearl/70 max-w-xl mx-auto">{center.intro}</p>
        </Reveal>

        <MandalaComposition centerLabel="Центр Преображения" items={items} />

        <Reveal className="pearl-card p-6 max-w-2xl mx-auto mt-10">
          <p className="text-pearl/75 text-sm leading-relaxed">{center.vision}</p>
          <div className="rule-gold my-4" />
          <p className="text-xs text-pearl/50 leading-relaxed">{center.researchDisclaimer}</p>
        </Reveal>
      </div>
    </section>
  );
}
