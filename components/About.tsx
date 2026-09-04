import Reveal from './visuals/Reveal';
import SectionBackdrop from './visuals/SectionBackdrop';
import type { AppearanceConfig } from '@/lib/content';

export default function About({ appearance }: { appearance: AppearanceConfig }) {
  return (
    <section id="about" className="snap-page relative py-24 sm:py-32">
      <SectionBackdrop sigil={appearance.sectionSigils.about || 'twotriangles'} sigilPosition="right" />
      <div className="relative z-[3] mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-sm text-gold mb-2">О фестивале</p>
          <h2 className="heading-loft text-3xl sm:text-4xl">Пространство диалога культуры, науки и природы</h2>
          <div className="rule-gold mt-6 w-24" />
        </Reveal>
        <Reveal className="grid md:grid-cols-2 gap-8 text-pearl/80 leading-relaxed mt-8">
          <p>
            Форум-Фестиваль «Преображение» объединяет учёных, мыслителей, исследователей, мастеров, художников,
            музыкантов, представителей общественных организаций, экологических инициатив и природоподобных
            технологий.
          </p>
          <p>
            Главная задача фестиваля — соединить разные концепции и мировоззрения в диалоге, сформировать общий
            созидательный образ будущего и создать пространство сотрудничества, культуры, просвещения, любви,
            взаимопомощи и ответственного отношения к природе.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
