import Reveal from './visuals/Reveal';

export default function Practices({ items }: { items: { title: string; description: string }[] }) {
  return (
    <section id="practices" className="snap-page relative py-24 sm:py-32">
      <div className="relative z-[3] mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-sm text-gold mb-2">Практики и мероприятия</p>
          <h2 className="heading-loft text-3xl sm:text-4xl">Чем можно заняться на фестивале</h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {items.map((p) => (
            <div key={p.title} className="pearl-card tight">
              <p className="heading-loft text-base mb-2">{p.title}</p>
              <p className="text-sm text-pearl/65 normal-case">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
