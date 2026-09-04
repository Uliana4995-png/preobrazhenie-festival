type SigilType =
  | 'infinity' | 'flower' | 'mandala' | 'triquetra' | 'lotus'
  | 'dotcircle' | 'twotriangles' | 'crystalstar' | 'shellspiral' | 'sun';

/**
 * Оригинальные абстрактные сакрально-геометрические знаки (не официальная
 * символика религиозных организаций). Один раздел — один ведущий символ,
 * назначается через content/appearance.json → sectionSigils, редактируется
 * в /admin → «Внешний вид».
 */
export default function SacredSigil({
  type,
  className = '',
  size = 420
}: {
  type: string;
  className?: string;
  size?: number;
}) {
  const stroke = 'currentColor';
  const common = { fill: 'none', stroke, strokeWidth: 1.2 } as const;

  const inner: Record<SigilType, JSX.Element> = {
    infinity: (
      <path
        d="M60 100 C60 60 120 60 140 100 C160 140 220 140 220 100 C220 60 160 60 140 100 C120 140 60 140 60 100 Z"
        {...common}
      />
    ),
    flower: (
      <g {...common}>
        {Array.from({ length: 6 }).map((_, i) => (
          <circle key={i} cx={140 + 44 * Math.cos((i * Math.PI) / 3)} cy={140 + 44 * Math.sin((i * Math.PI) / 3)} r={44} />
        ))}
        <circle cx="140" cy="140" r="44" />
      </g>
    ),
    mandala: (
      <g {...common}>
        {[26, 58, 90, 122].map((r) => (
          <circle key={r} cx="140" cy="140" r={r} />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1="140"
            y1="140"
            x2={140 + 122 * Math.cos((i * Math.PI) / 6)}
            y2={140 + 122 * Math.sin((i * Math.PI) / 6)}
          />
        ))}
      </g>
    ),
    triquetra: (
      <g {...common} strokeWidth={2.4}>
        {[0, 120, 240].map((a) => (
          <path key={a} d="M140 80 A56 56 0 1 1 84 168" transform={`rotate(${a} 140 140)`} />
        ))}
      </g>
    ),
    lotus: (
      <g {...common}>
        {Array.from({ length: 8 }).map((_, i) => (
          <path
            key={i}
            d="M140 140 Q 175 100 140 40 Q 105 100 140 140 Z"
            transform={`rotate(${i * 45} 140 140)`}
          />
        ))}
        <circle cx="140" cy="140" r="18" />
      </g>
    ),
    dotcircle: (
      <g {...common}>
        <circle cx="140" cy="140" r="96" />
        <circle cx="140" cy="140" r="8" fill={stroke} />
      </g>
    ),
    twotriangles: (
      <g {...common} strokeWidth={1.6}>
        <path d="M140 30 L230 190 L50 190 Z" />
        <path d="M140 250 L50 90 L230 90 Z" />
      </g>
    ),
    crystalstar: (
      <g {...common} strokeWidth={1.4}>
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4;
          return <line key={i} x1="140" y1="140" x2={140 + 118 * Math.cos(a)} y2={140 + 118 * Math.sin(a)} />;
        })}
        <circle cx="140" cy="140" r="30" />
      </g>
    ),
    shellspiral: (
      <path
        {...common}
        strokeWidth={1.6}
        d="M140 140 m0,0 a4,4 0 1,1 8,0 a12,12 0 1,1 -24,0 a24,24 0 1,1 48,0 a40,40 0 1,1 -80,0 a60,60 0 1,1 120,0 a84,84 0 1,1 -168,0"
      />
    ),
    sun: (
      <g {...common}>
        <circle cx="140" cy="140" r="44" />
        {Array.from({ length: 16 }).map((_, i) => {
          const a = (i * Math.PI) / 8;
          const r1 = 56,
            r2 = i % 2 === 0 ? 110 : 84;
          return (
            <line
              key={i}
              x1={140 + r1 * Math.cos(a)}
              y1={140 + r1 * Math.sin(a)}
              x2={140 + r2 * Math.cos(a)}
              y2={140 + r2 * Math.sin(a)}
            />
          );
        })}
      </g>
    )
  };

  const el = inner[type as SigilType] ?? inner.dotcircle;

  return (
    <svg
      viewBox="0 0 280 280"
      width={size}
      height={size}
      className={className}
      style={{ opacity: 0.07 }}
      aria-hidden="true"
    >
      {el}
    </svg>
  );
}
