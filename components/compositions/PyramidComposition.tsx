/**
 * Композиция «Две пирамиды»: карточки образуют ритм двух треугольников —
 * один направлен вверх, другой вниз, чередуясь. Используется, например,
 * для пар понятий (наука/культура, природа/технологии).
 */
export default function PyramidComposition({ items }: { items: { title: string; description?: string }[] }) {
  return (
    <div className="grid sm:grid-cols-3 gap-6">
      {items.map((item, i) => {
        const up = i % 2 === 0;
        return (
          <div
            key={item.title}
            className={`circle-item pearl-card p-6 ${up ? 'sm:-translate-y-4' : 'sm:translate-y-4'}`}
          >
            <span
              className="block w-0 h-0 mb-4"
              style={{
                borderLeft: '11px solid transparent',
                borderRight: '11px solid transparent',
                ...(up
                  ? { borderBottom: '18px solid #22E6D2' }
                  : { borderTop: '18px solid #FF2BC2' })
              }}
            />
            <p className="text-sm font-semibold text-pearl mb-1">{item.title}</p>
            {item.description && <p className="text-xs text-pearl/60">{item.description}</p>}
          </div>
        );
      })}
    </div>
  );
}
