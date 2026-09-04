/**
 * Феникс — благородный, современный силуэт (без мультяшной стилистики).
 * Оперение переливается фуксией, золотом, бирюзой и перламутром.
 * Если организатор загрузит собственное изображение феникса через
 * /admin → «Внешний вид», оно подменит этот SVG (см. imageUrl).
 */
export default function Phoenix({ className = '', imageUrl }: { className?: string; imageUrl?: string }) {
  if (imageUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={imageUrl} alt="" className={className} aria-hidden="true" />;
  }

  return (
    <svg viewBox="0 0 640 520" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="phBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF2BC2" />
          <stop offset="45%" stopColor="#FFD978" />
          <stop offset="100%" stopColor="#22E6D2" />
        </linearGradient>
        <linearGradient id="phWingL" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22E6D2" />
          <stop offset="100%" stopColor="#FF2BC2" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="phWingR" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFD978" />
          <stop offset="100%" stopColor="#FF2BC2" stopOpacity="0.7" />
        </linearGradient>
        <filter id="phGlow"><feGaussianBlur stdDeviation="5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>

      <g filter="url(#phGlow)" opacity="0.94">
        {/* левое крыло — слоистые перья */}
        <g opacity="0.9">
          <path d="M320 210 C230 190 140 205 60 260 C150 262 220 285 270 320 C230 300 200 300 170 320 C230 320 270 340 300 370 C280 350 320 340 340 340 Z" fill="url(#phWingL)" />
        </g>
        {/* правое крыло */}
        <g opacity="0.9">
          <path d="M320 210 C410 190 500 205 580 260 C490 262 420 285 370 320 C410 300 440 300 470 320 C410 320 370 340 340 370 C360 350 320 340 300 340 Z" fill="url(#phWingR)" />
        </g>
        {/* хвост */}
        <path
          d="M320 360 C300 420 260 460 210 490 C260 470 300 460 320 430 C330 465 370 480 410 490 C360 460 330 420 320 360 Z"
          fill="url(#phBody)"
          opacity="0.85"
        />
        {/* тело */}
        <path
          d="M320 130 C355 175 365 225 340 270 C325 300 320 335 320 365 C300 335 295 300 300 270 C275 225 285 175 320 130 Z"
          fill="url(#phBody)"
        />
        {/* голова и клюв */}
        <circle cx="320" cy="118" r="17" fill="url(#phBody)" />
        <path d="M320 108 L338 100 L322 118 Z" fill="#FFD978" />
      </g>
    </svg>
  );
}
