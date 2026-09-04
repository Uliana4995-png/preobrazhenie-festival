'use client';

import { useEffect, useState } from 'react';
import type { AppearanceConfig } from '@/lib/content';

/**
 * Единый многослойный космический фон для всего сайта (не пересоздаётся
 * между разделами — один непрерывный "рисунок" созвездий Млечного Пути,
 * как просили в ТЗ). Слои (снизу вверх):
 *  1. базовый градиент (CSS, рендерится сразу, без мигания при гидратации)
 *  2. дальние звёзды + Млечный Путь + созвездия (генерируются на клиенте)
 *  3. кристаллическая мандала по центру, медленно вращается
 *  4. диагональные световые волны фуксия/золото/бирюза
 *
 * Слои 2–4 подчиняются уровню эффектов (appearance.effectsLevel) и
 * настройкам stars/milkyWay/glowIntensity из /admin → «Внешний вид».
 */
export default function CosmosBackground({ appearance }: { appearance: AppearanceConfig }) {
  const [mounted, setMounted] = useState(false);
  const [starsSvg, setStarsSvg] = useState('');
  const [waveSvg, setWaveSvg] = useState('');

  useEffect(() => {
    setMounted(true);
    if (appearance.stars || appearance.milkyWay) {
      setStarsSvg(buildStarsAndMilkyWay(appearance));
    }
    setWaveSvg(buildWaveStreaks());
  }, [appearance]);

  const glow = appearance.glowIntensity ?? 1;
  const heavyOk = appearance.effectsLevel === 'full';

  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ ['--glow-intensity' as any]: glow }}
    >
      {/* базовый градиент неба — виден сразу, без ожидания клиентского рендера */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 65% 45% at 22% 18%, rgba(255,43,194,${0.4 * glow}), transparent 62%),
            radial-gradient(ellipse 45% 32% at 78% 10%, rgba(34,230,210,${0.14 * glow}), transparent 60%),
            radial-gradient(ellipse 60% 45% at 85% 55%, rgba(168,60,220,${0.36 * glow}), transparent 62%),
            radial-gradient(ellipse 50% 38% at 60% 30%, rgba(255,111,216,${0.16 * glow}), transparent 58%),
            radial-gradient(ellipse 60% 45% at 15% 72%, rgba(255,43,194,${0.24 * glow}), transparent 60%),
            radial-gradient(ellipse 45% 32% at 35% 85%, rgba(142,235,255,${0.1 * glow}), transparent 55%),
            linear-gradient(180deg, #0d0318 0%, #1c0a34 25%, #3a1257 55%, #29073f 80%, #0a0413 100%)
          `
        }}
      />

      {/* звёзды + Млечный Путь + созвездия */}
      {mounted && starsSvg && (
        <div
          className="absolute inset-0 fx-medium"
          dangerouslySetInnerHTML={{ __html: starsSvg }}
        />
      )}

      {/* кристаллическая мандала — самый тяжёлый слой, только на "full" */}
      {mounted && heavyOk && (
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 fx-heavy animate-spinSlow"
          style={{
            width: 'min(1100px, 140vw)',
            height: 'min(1100px, 140vw)',
            opacity: 0.16,
            filter: `drop-shadow(0 0 ${40 * glow}px rgba(255,43,194,0.3)) drop-shadow(0 0 ${70 * glow}px rgba(34,230,210,0.2))`
          }}
          dangerouslySetInnerHTML={{ __html: crystalMandalaSvg() }}
        />
      )}

      {/* диагональные световые волны */}
      {mounted && waveSvg && (
        <div
          className="absolute inset-0 fx-medium"
          style={{ mixBlendMode: 'screen', opacity: 0.6 * glow }}
          dangerouslySetInnerHTML={{ __html: waveSvg }}
        />
      )}

      {/* маленькие светящиеся феи — на всех страницах, сбоку */}
      {mounted && heavyOk && <FairySprites glow={glow} />}
    </div>
  );
}

/** Маленькие светящиеся частицы-феи, мягко парящие по краям экрана. */
function FairySprites({ glow }: { glow: number }) {
  const [positions] = useState(() =>
    Array.from({ length: 6 }).map((_, i) => ({
      left: i % 2 === 0 ? 2 + Math.random() * 6 : 90 + Math.random() * 6,
      top: 10 + Math.random() * 75,
      delay: Math.random() * 4,
      hue: ['#FF2BC2', '#22E6D2', '#FFD978'][i % 3]
    }))
  );

  return (
    <>
      {positions.map((p, i) => (
        <div
          key={i}
          className="absolute animate-drift"
          style={{ left: `${p.left}%`, top: `${p.top}%`, animationDelay: `${p.delay}s`, animationDuration: '7s' }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" style={{ filter: `drop-shadow(0 0 ${6 * glow}px ${p.hue})` }}>
            <circle cx="11" cy="11" r="2" fill="#fff" opacity="0.95" />
            <g stroke={p.hue} strokeWidth="0.8" opacity="0.8">
              <path d="M11 9 C6 6 3 8 2 11 C3 9 7 9 11 11" fill={`${p.hue}66`} />
              <path d="M11 9 C16 6 19 8 20 11 C19 9 15 9 11 11" fill={`${p.hue}66`} />
            </g>
          </svg>
        </div>
      ))}
    </>
  );
}

function buildStarsAndMilkyWay(appearance: AppearanceConfig): string {
  let defs = `<defs><radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#fff" stop-opacity="1"/><stop offset="100%" stop-color="#fff" stop-opacity="0"/>
  </radialGradient></defs>`;
  let content = defs;

  if (appearance.milkyWay) {
    content += `<rect x="-10%" y="30%" width="120%" height="24%" fill="rgba(234,220,247,0.06)"
      transform="rotate(-8 50 50)" style="filter:blur(30px)"/>`;
  }

  if (appearance.stars) {
    for (let band = 0; band < 8; band++) {
      const yOff = band * 380;
      const pts: [number, number][] = [];
      for (let i = 0; i < 7; i++) {
        pts.push([60 + Math.random() * 880, yOff + 30 + Math.random() * 320]);
      }
      if (appearance.milkyWay) {
        content += `<polyline points="${pts.map((p) => p.join(',')).join(' ')}" fill="none" stroke="rgba(255,217,120,0.16)" stroke-width="1"/>`;
      }
      pts.forEach(([x, y]) => {
        const r = Math.random() * 1.6 + 0.5;
        content += `<circle cx="${x}" cy="${y}" r="${r}" fill="#F8F4FF" opacity="${0.35 + Math.random() * 0.5}"/>`;
      });
      for (let i = 0; i < 2; i++) {
        const x = 80 + Math.random() * 840,
          y = yOff + 40 + Math.random() * 300;
        const c = ['#FF2BC2', '#22E6D2', '#FFD978'][Math.floor(Math.random() * 3)];
        content += `<g transform="translate(${x},${y})" opacity="0.8">
          <circle r="15" fill="url(#starGlow)" opacity="0.5"/>
          ${[0, 45, 90, 135]
            .map((a) => `<rect x="-1" y="-13" width="2" height="26" fill="${c}" transform="rotate(${a})"/>`)
            .join('')}
          <circle r="2.2" fill="#fff"/>
        </g>`;
      }
    }
  }

  return `<svg viewBox="0 0 1000 3040" preserveAspectRatio="none" style="width:100%;height:100%">${content}</svg>`;
}

function crystalMandalaSvg(): string {
  const colors = ['#FF2BC2', '#22E6D2', '#FFD978'];
  let g = `<circle cx="200" cy="200" r="20" fill="#F8F4FF" opacity="0.7"/>`;
  const rings = [
    { count: 6, r: 60, size: 34 },
    { count: 10, r: 110, size: 26 },
    { count: 14, r: 160, size: 20 },
    { count: 18, r: 195, size: 14 }
  ];
  rings.forEach((ring, ri) => {
    for (let i = 0; i < ring.count; i++) {
      const angle = (i / ring.count) * 2 * Math.PI + (ri % 2 ? Math.PI / ring.count : 0);
      const cx = 200 + ring.r * Math.cos(angle);
      const cy = 200 + ring.r * Math.sin(angle);
      const color = colors[(i + ri) % 3];
      const s = ring.size;
      g += `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)}) rotate(${(angle * 180 / Math.PI + 90).toFixed(1)})">
        <polygon points="0,${-s} ${s * 0.42},0 0,${s * 1.3} ${-s * 0.42},0" fill="${color}" opacity="0.55" stroke="${color}" stroke-width="0.6"/>
        <polygon points="0,${-s} ${s * 0.42},0 0,${s * 0.35}" fill="#ffffff" opacity="0.3"/>
      </g>`;
    }
    g += `<circle cx="200" cy="200" r="${ring.r}" fill="none" stroke="rgba(248,244,255,0.18)" stroke-width="0.5" stroke-dasharray="2 6"/>`;
  });
  return `<svg viewBox="0 0 400 400" style="width:100%;height:100%">${g}</svg>`;
}

function buildWaveStreaks(): string {
  const colors = [
    { c: '#FF2BC2', w: 2 },
    { c: '#B14BFF', w: 1.6 },
    { c: '#22E6D2', w: 1.8 },
    { c: '#FFD978', w: 1.2 },
    { c: '#FF6FD8', w: 1.4 },
    { c: '#8EEBFF', w: 1.1 },
    { c: '#FF2BC2', w: 1.3 }
  ];
  let defs = '<defs>';
  colors.forEach((c, i) => {
    defs += `<linearGradient id="waveGrad${i}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c.c}" stop-opacity="0"/>
      <stop offset="45%" stop-color="${c.c}" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="${c.c}" stop-opacity="0"/>
    </linearGradient>`;
  });
  defs += `<filter id="waveGlow"><feGaussianBlur stdDeviation="3"/></filter></defs>`;

  function wavePath(yStart: number, amp: number, freq: number) {
    let d = `M -200 ${yStart}`;
    for (let i = 0; i <= 24; i++) {
      const x = -200 + 1800 * (i / 24);
      const y = yStart + Math.sin(i * freq) * amp + (i / 24) * 260;
      d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    return d;
  }

  let paths = '';
  colors.forEach((c, i) => {
    const d = wavePath(80 + i * 140, 44 + i * 8, 0.55 + i * 0.05);
    paths += `<path d="${d}" fill="none" stroke="url(#waveGrad${i})" stroke-width="${c.w}" filter="url(#waveGlow)"/>`;
  });

  return `<svg viewBox="0 0 1000 1000" preserveAspectRatio="none" style="width:100%;height:100%">${defs}${paths}</svg>`;
}
