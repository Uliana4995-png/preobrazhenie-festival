'use client';

/**
 * Композиция «Кристаллическая мандала»: блоки равномерно распределены
 * по кругу вокруг центральной темы. Радиус подобран так, чтобы карточки
 * не перекрывали друг друга даже при большом числе элементов.
 */
export default function MandalaComposition({
  centerLabel,
  items
}: {
  centerLabel: string;
  items: { title: string; description?: string }[];
}) {
  const n = items.length;
  const cardWidth = 152;
  const containerSize = 760;
  const minRadiusPx = cardWidth / (2 * Math.sin(Math.PI / n)) + 16;
  const radiusPct = Math.min(40, (minRadiusPx / containerSize) * 100);

  return (
    <div className="relative mx-auto" style={{ maxWidth: containerSize, aspectRatio: '1 / 1' }}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pearl-card tight text-center" style={{ width: 150 }}>
        <p className="text-xs uppercase tracking-wide text-gold">{centerLabel}</p>
      </div>
      {items.map((item, i) => {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        const x = 50 + radiusPct * Math.cos(angle);
        const y = 50 + radiusPct * Math.sin(angle);
        return (
          <div
            key={item.title}
            className="circle-item pearl-card tight absolute text-center"
            style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)', width: cardWidth }}
          >
            <p className="text-xs font-semibold text-pearl">{item.title}</p>
            {item.description && <p className="text-[11px] text-pearl/55 mt-1">{item.description}</p>}
          </div>
        );
      })}
    </div>
  );
}
