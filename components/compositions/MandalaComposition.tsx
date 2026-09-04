'use client';

/**
 * Композиция «Кристаллическая мандала»: блоки расположены по кругу
 * вокруг центральной темы. Используется для программы дня, карты
 * направлений, структуры Центра Преображения.
 */
export default function MandalaComposition({
  centerLabel,
  items
}: {
  centerLabel: string;
  items: { title: string; description?: string }[];
}) {
  const n = items.length;
  const radius = 42;

  return (
    <div className="relative mx-auto" style={{ maxWidth: 640, height: 560 }}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pearl-card tight text-center" style={{ width: 150 }}>
        <p className="text-xs uppercase tracking-wide text-gold">{centerLabel}</p>
      </div>
      {items.map((item, i) => {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        return (
          <div
            key={item.title}
            className="circle-item pearl-card tight absolute text-center"
            style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)', width: 152 }}
          >
            <p className="text-xs font-semibold text-pearl">{item.title}</p>
            {item.description && <p className="text-[11px] text-pearl/55 mt-1">{item.description}</p>}
          </div>
        );
      })}
    </div>
  );
}
