import ShellComposition from './compositions/ShellComposition';
import PyramidComposition from './compositions/PyramidComposition';
import Reveal from './visuals/Reveal';
import SectionBackdrop from './visuals/SectionBackdrop';
import type { AppearanceConfig } from '@/lib/content';

const VALUES = [
  { title: 'Русский язык и смыслы' },
  { title: 'Наука и философия' },
  { title: 'Музыка новых смыслов' },
  { title: 'Природоподобные технологии' },
  { title: 'Бионическая архитектура' },
  { title: 'Сакральная геометрия' },
  { title: 'Свободное образование' },
  { title: 'Семейные ценности' },
  { title: 'Крепкие союзы' },
  { title: 'Телесные практики' },
  { title: 'Чистое питание' },
  { title: 'Центры Преображения' }
];

const PAIRS = [
  { title: 'Наука', description: 'Исследования и знание' },
  { title: 'Культура', description: 'Смыслы и традиция' },
  { title: 'Природа', description: 'Живое пространство' },
  { title: 'Технологии', description: 'Природоподобные решения' },
  { title: 'Личное', description: 'Внутреннее преображение' },
  { title: 'Общественное', description: 'Совместное созидание' }
];

export default function Mission({ appearance }: { appearance: AppearanceConfig }) {
  return (
    <section id="mission" className="snap-page relative py-24 sm:py-32">
      <SectionBackdrop sigil={appearance.sectionSigils.mission || 'flower'} sigilPosition="center" />
      <div className="relative z-[3] mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-sm text-gold mb-2">Миссия и ценности</p>
          <h2 className="heading-loft text-3xl sm:text-4xl text-center">Чему посвящён фестиваль</h2>
        </Reveal>
        <ShellComposition items={VALUES} />

        <Reveal className="mt-16">
          <p className="text-sm text-gold mb-2 text-center">Единство направлений</p>
          <h3 className="heading-loft text-2xl sm:text-3xl mb-8 text-center">Наука и культура, природа и технологии</h3>
          <PyramidComposition items={PAIRS} />
        </Reveal>
      </div>
    </section>
  );
}
