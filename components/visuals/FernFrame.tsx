'use client';

import { useEffect, useState } from 'react';

/**
 * Природное обрамление краёв секции: белые камни со мхом и сверкающие
 * капли воды. Размещается только по краям (верх/низ), центр остаётся
 * свободным для текста. Папоротники намеренно убраны из всех разделов
 * сайта по решению организатора — векторный силуэт не выглядел
 * достаточно правдоподобно.
 */
export default function FernFrame({ position }: { position: 'top' | 'bottom' }) {
  const [svg, setSvg] = useState('');

  useEffect(() => {
    setSvg(buildFrame());
  }, []);

  return (
    <div
      className={`fern-mobile-thin pointer-events-none absolute left-0 right-0 z-[2] h-[150px] overflow-visible fx-medium ${
        position === 'top' ? 'top-[-6px]' : 'bottom-[-6px] scale-y-[-1]'
      }`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

function stone(x: number, y: number, r: number, idx: number, big: boolean) {
  const gid = `stoneG${idx}-${Math.round(x)}`;
  const detail = big
    ? `<path d="M ${x - r * 0.3} ${y - r * 0.5} Q ${x} ${y - r * 0.65} ${x + r * 0.25} ${y - r * 0.45}" stroke="rgba(10,4,20,0.25)" stroke-width="1" fill="none"/>
       <path d="M ${x - r * 0.5} ${y - r * 0.1} Q ${x - r * 0.1} ${y - r * 0.25} ${x + r * 0.3} ${y - r * 0.05}" stroke="rgba(10,4,20,0.18)" stroke-width="1" fill="none"/>`
    : '';
  return `<defs><radialGradient id="${gid}" cx="35%" cy="30%" r="75%">
      <stop offset="0%" stop-color="rgba(248,244,255,0.6)"/>
      <stop offset="45%" stop-color="rgba(220,215,230,0.34)"/>
      <stop offset="100%" stop-color="rgba(120,105,140,0.2)"/>
    </radialGradient></defs>
    <ellipse cx="${x}" cy="${y + r * 0.66}" rx="${r * 1.15}" ry="${r * 0.24}" fill="rgba(10,4,20,0.4)"/>
    <path d="M ${x - r} ${y + r * 0.32} Q ${x - r * 0.95} ${y - r * 0.75} ${x - r * 0.1} ${y - r * 0.6}
             Q ${x + r * 0.95} ${y - r * 0.8} ${x + r} ${y + r * 0.22}
             Q ${x + r * 0.5} ${y + r * 0.58} ${x} ${y + r * 0.52}
             Q ${x - r * 0.6} ${y + r * 0.58} ${x - r} ${y + r * 0.32} Z"
      fill="url(#${gid})" stroke="rgba(255,255,255,0.42)" stroke-width="0.7"/>
    ${detail}
    <path d="M ${x - r * 0.5} ${y - r * 0.05} Q ${x - r * 0.1} ${y - r * 0.32} ${x + r * 0.35} ${y - r * 0.05}
             Q ${x + r * 0.15} ${y + r * 0.22} ${x - r * 0.2} ${y + r * 0.22} Z" fill="rgba(72,106,80,0.55)"/>
    <path d="M ${x + r * 0.15} ${y + r * 0.18} Q ${x + r * 0.45} ${y + r * 0.06} ${x + r * 0.6} ${y + r * 0.28}
             Q ${x + r * 0.4} ${y + r * 0.38} ${x + r * 0.18} ${y + r * 0.33} Z" fill="rgba(60,95,70,0.45)"/>`;
}

function dew(x: number, y: number, hue: string) {
  return `<circle cx="${x}" cy="${y}" r="2.2" fill="#F8F4FF" opacity="0.9">
    <animate attributeName="opacity" values="0.3;1;0.3" dur="${(2 + Math.random() * 2).toFixed(1)}s" repeatCount="indefinite"/>
  </circle>
  <circle cx="${x}" cy="${y}" r="4.5" fill="${hue}" opacity="0.2"/>`;
}

// четыре разных расстановки камней — чередуются между разделами
const TEMPLATES: Array<() => { positions: [number, number, number, boolean][] }> = [
  () => ({ positions: [[500, 140, 26, true], [210, 142, 13, false], [800, 142, 15, false]] }),
  () => ({ positions: [[150, 142, 17, false], [340, 142, 20, true], [560, 140, 15, false], [720, 142, 22, true]] }),
  () => ({
    positions: [180, 400, 620, 840].map((x) => [x, 142, 14 + Math.random() * 10, Math.random() > 0.5] as [number, number, number, boolean])
  }),
  () => ({ positions: [[120, 142, 24, true], [880, 142, 24, true], [500, 144, 16, false]] })
];

let callCount = 0;

function buildFrame(): string {
  const dewHues = ['#22E6D2', '#FFD978', '#FF2BC2'];
  const template = TEMPLATES[callCount % TEMPLATES.length]!;
  callCount++;

  let g = '';
  let stoneCounter = 0;
  template().positions.forEach(([x, y, r, big]) => {
    g += stone(x, y, r, stoneCounter++, big);
  });
  for (let i = 0; i < 12; i++) {
    g += dew(60 + Math.random() * 900, 60 + Math.random() * 70, dewHues[i % dewHues.length]!);
  }
  return `<svg viewBox="0 0 1000 150" preserveAspectRatio="none" style="width:100%;height:100%">${g}</svg>`;
}
