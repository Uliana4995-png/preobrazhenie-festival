'use client';

/**
 * Композиция «Раковина»: карточки расходятся мягкой спиралью от
 * центрального образа перламутровой раковины. На мобильных — обычная
 * вертикальная последовательность карточек (см. .circle-item в CSS).
 */
export default function ShellComposition({ items }: { items: { title: string; description?: string }[] }) {
  const n = items.length;

  return (
    <div className="relative mx-auto" style={{ maxWidth: 720, height: 640 }}>
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 130,
          height: 130,
          background: 'radial-gradient(circle, rgba(248,244,255,0.4), rgba(255,43,194,0.12) 60%, transparent 70%)',
          filter: 'blur(2px)'
        }}
      />
      {items.map((item, i) => {
        const t = i / n;
        const angle = t * Math.PI * 2.4 - Math.PI / 2; // спираль чуть больше круга
        const radius = 90 + t * 180;
        const x = 50 + (radius * Math.cos(angle)) / 6.4;
        const y = 50 + (radius * Math.sin(angle)) / 6.4;
        return (
          <div
            key={item.title}
            className="circle-item pearl-card tight absolute"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%,-50%)',
              width: 168
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
