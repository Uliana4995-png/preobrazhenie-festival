'use client';

import { useEffect, useState } from 'react';

/**
 * Отдельная, единичная иллюстрированная сцена "камни со мхом и кусты
 * папоротника" — не путать с общими рамками страниц (папоротники там
 * убраны по отдельному запросу). Эта композиция выплывает на пару
 * секунд и снова скрывается, как короткий акцентный кадр — только
 * в одном месте сайта (раздел "Место проведения").
 */
export default function NatureVignette() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = () => {
      setVisible(true);
      setTimeout(() => setVisible(false), 3200);
    };
    const first = setTimeout(show, 1200);
    const interval = setInterval(show, 11000);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className="pointer-events-none absolute right-4 bottom-4 w-40 sm:w-52 transition-opacity duration-[1200ms] fx-medium"
      style={{ opacity: visible ? 0.9 : 0 }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 240 180">
        <defs>
          <radialGradient id="nvStone" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="rgba(248,244,255,0.6)" />
            <stop offset="100%" stopColor="rgba(120,105,140,0.2)" />
          </radialGradient>
        </defs>
        {/* камни со мхом */}
        <ellipse cx="70" cy="145" rx="46" ry="11" fill="rgba(10,4,20,0.4)" />
        <path d="M30 130 Q40 95 80 100 Q120 95 110 130 Q90 148 70 145 Q45 148 30 130 Z" fill="url(#nvStone)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        <path d="M45 108 Q60 96 75 108 Q64 116 52 114 Z" fill="rgba(72,106,80,0.55)" />
        <ellipse cx="170" cy="150" rx="34" ry="9" fill="rgba(10,4,20,0.35)" />
        <path d="M140 138 Q148 112 178 116 Q205 112 198 138 Q182 150 170 148 Q152 150 140 138 Z" fill="url(#nvStone)" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />

        {/* куст папоротника вокруг камней — единичная декоративная сцена */}
        {[
          [30, 108, -22, '#22E6D2'],
          [55, 100, -6, '#6fe0a8'],
          [90, 96, 10, '#8fd6c9'],
          [130, 102, -8, '#3fbfa0'],
          [160, 108, 12, '#22E6D2'],
          [195, 112, 24, '#4fd0a8']
        ].map(([x, y, rot, hue], i) => (
          <g key={i} transform={`translate(${x},${y}) rotate(${rot})`} opacity="0.8">
            <path d="M0 0 Q6 -30 0 -58" fill="none" stroke={hue as string} strokeWidth="1.4" />
            {Array.from({ length: 7 }).map((_, j) => {
              const t = (j + 1) / 7;
              const ly = -t * 58;
              const len = (1 - t * 0.5) * 9;
              return (
                <g key={j}>
                  <path d={`M0 ${ly} q ${len} -3 ${len * 1.2} 4`} stroke={hue as string} strokeWidth="1" fill="none" />
                  <path d={`M0 ${ly} q ${-len} -3 ${-len * 1.2} 4`} stroke={hue as string} strokeWidth="1" fill="none" />
                </g>
              );
            })}
          </g>
        ))}

        {/* сверкающие капли */}
        <circle cx="60" cy="112" r="2" fill="#F8F4FF">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="150" cy="120" r="1.8" fill="#F8F4FF">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" />
        </circle>
      </svg>
      <p className="text-[10px] text-pearl/40 text-right mt-1 normal-case">Абхазский природный сюжет</p>
    </div>
  );
}
