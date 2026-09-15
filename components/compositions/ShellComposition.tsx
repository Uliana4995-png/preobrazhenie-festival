'use client';

/**
 * Композиция «Раковина»: карточки равномерно распределены по кругу
 * вокруг центрального перламутрового свечения. Радиус подобран с запасом
 * на диагональное перекрытие (карточки — прямоугольники, а не точки,
 * поэтому одного «расстояния по дуге» недостаточно — нужно, чтобы
 * соседние карточки не пересекались даже когда смещение разложено
 * пополам между горизонталью и вертикалью). На мобильных — обычная
 * вертикальная последовательность карточек (см. .circle-item в CSS).
 */
export default function ShellComposition({ items }: { items: { title: string; description?: string }[] }) {
  const n = items.length;
  const cardWidth = 148;
  const margin = 24;
  // запас на диагональ (√2) — гарантирует зазор по обеим осям одновременно
  const minRadiusPx = (cardWidth * Math.SQRT2) / (2 * Math.sin(Math.PI / n)) + margin;
  const containerSize = Math.min(1040, minRadiusPx / 0.4);
  const radiusPct = (minRadiusPx / containerSize) * 100;

  return (
    <div className="relative mx-auto" style={{ maxWidth: containerSize, aspectRatio: '1 / 1' }}>
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 130,
          height: 130,
          background: 'radial-gradient(circle, rgba(248,244,255,0.4), rgba(47,143,224,0.12) 60%, transparent 70%)',
          filter: 'blur(2px)'
        }}
      />
      {items.map((item, i) => {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2; // ровный круг, старт сверху
        const x = 50 + radiusPct * Math.cos(angle);
        const y = 50 + radiusPct * Math.sin(angle);
        return (
          <div
            key={item.title}
            className="circle-item pearl-card tight absolute"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%,-50%)',
              width: cardWidth
            }}
          >
            <p className="text-sm font-semibold text-pearl">{item.title}</p>
            {item.description && <p className="text-xs text-pearl/60 mt-1">{item.description}</p>}
          </div>
        );
      })}
    </div>
  );
}
