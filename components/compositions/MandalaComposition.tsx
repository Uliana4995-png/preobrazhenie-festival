'use client';

/**
 * Композиция «Кристаллическая мандала»: блоки равномерно распределены
 * по кругу вокруг центральной темы. Радиус подобран с запасом на
 * диагональное перекрытие (карточки — прямоугольники, а не точки).
 */
export default function MandalaComposition({
  centerLabel,
  items
}: {
  centerLabel: string;
  items: { title: string; description?: string }[];
}) {
  const n = items.length;
  const cardWidth = 140;
  const margin = 20;
  const minRadiusPx = (cardWidth * Math.SQRT2) / (2 * Math.sin(Math.PI / n)) + margin;
  const containerSize = Math.min(920, minRadiusPx / 0.4);
  const radiusPct = (minRadiusPx / containerSize) * 100;

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
