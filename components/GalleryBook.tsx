'use client';

import { useState } from 'react';
import type { GalleryImage } from '@/lib/content';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const PALETTE = [
  ['#3a1a52', '#1a0a2e', '#FF2BC2'],
  ['#0e3b38', '#0a0413', '#22E6D2'],
  ['#4a2e10', '#120625', '#FFD978'],
  ['#2a1444', '#120625', '#8a4fd8'],
  ['#153a2a', '#0a0413', '#4fd88a'],
  ['#3a1030', '#120625', '#FF2BC2'],
  ['#123a3a', '#0a0413', '#22E6D2'],
  ['#453017', '#120625', '#FFD978']
];

export default function GalleryBook({ images }: { images: GalleryImage[] }) {
  const categories = ['все', ...Array.from(new Set(images.map((i) => i.category)))];
  const [category, setCategory] = useState('все');
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const filtered = category === 'все' ? images : images.filter((i) => i.category === category);
  const active = filtered[Math.min(activeIndex, filtered.length - 1)];

  const go = (dir: 1 | -1) => {
    setActiveIndex((i) => (i + dir + filtered.length) % filtered.length);
  };

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-3 mb-8">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => {
              setCategory(c);
              setActiveIndex(0);
            }}
            className="shrink-0 px-4 py-2 rounded-full text-xs font-semibold border"
            style={
              category === c
                ? { background: 'linear-gradient(90deg,#FF2BC2,#22E6D2)', color: '#120625', border: 'none' }
                : { borderColor: 'rgba(255,217,120,0.35)', color: 'rgba(248,244,255,0.75)' }
            }
          >
            {c}
          </button>
        ))}
      </div>

      {active && (
        <div className="relative pearl-card overflow-hidden mb-6" style={{ aspectRatio: '16/9' }}>
          {active.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={active.url} alt={active.caption} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(160deg, ${PALETTE[activeIndex % 8]![0]}, ${PALETTE[activeIndex % 8]![1]} 60%, ${PALETTE[activeIndex % 8]![2]})` }}
            />
          )}
          <div className="absolute inset-0 flex items-end p-6" style={{ background: 'linear-gradient(to top, rgba(10,4,19,0.65), transparent 50%)' }}>
            <div>
              <p className="heading-loft text-lg">{active.caption}</p>
              <p className="text-xs text-pearl/60 mt-1 normal-case">{active.imageType}</p>
            </div>
          </div>
          <button
            onClick={() => go(-1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full"
            style={{ background: 'rgba(18,6,37,0.5)' }}
            aria-label="Предыдущее фото"
          >
            <ChevronLeft className="text-pearl" />
          </button>
          <button
            onClick={() => go(1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full"
            style={{ background: 'rgba(18,6,37,0.5)' }}
            aria-label="Следующее фото"
          >
            <ChevronRight className="text-pearl" />
          </button>
          <button
            onClick={() => setFullscreen(true)}
            className="absolute top-3 right-3 text-xs px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(18,6,37,0.6)', color: 'var(--c-pearl)' }}
          >
            Во весь экран
          </button>
        </div>
      )}

      {/* лента миниатюр — перелистывание как страницы книги */}
      <div className="flex gap-4 overflow-x-auto pb-4" style={{ perspective: 1200 }}>
        {filtered.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setActiveIndex(i)}
            className="shrink-0 rounded-[4px_18px_4px_18px] overflow-hidden relative transition-transform"
            style={{
              width: 130,
              height: 90,
              transform: i === activeIndex ? 'translateY(-4px)' : 'none',
              border: i === activeIndex ? '2px solid #22E6D2' : '1px solid rgba(255,217,120,0.3)',
              background: `linear-gradient(160deg, ${PALETTE[i % 8]![0]}, ${PALETTE[i % 8]![1]} 60%, ${PALETTE[i % 8]![2]})`
            }}
          >
            <span className="absolute bottom-1 left-2 text-[10px] text-white/90" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}>
              {img.caption}
            </span>
          </button>
        ))}
      </div>

      {fullscreen && active && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6" style={{ background: 'rgba(10,4,19,0.94)' }}>
          <button onClick={() => setFullscreen(false)} className="absolute top-5 right-5 text-pearl" aria-label="Закрыть">
            <X size={28} />
          </button>
          <button onClick={() => go(-1)} className="absolute left-5 top-1/2 -translate-y-1/2 text-pearl" aria-label="Предыдущее">
            <ChevronLeft size={36} />
          </button>
          <div
            className="rounded-3xl w-full max-w-3xl aspect-video flex items-end p-8"
            style={{ background: `linear-gradient(160deg, ${PALETTE[activeIndex % 8]![0]}, ${PALETTE[activeIndex % 8]![1]} 60%, ${PALETTE[activeIndex % 8]![2]})` }}
          >
            <div>
              <p className="heading-loft text-2xl">{active.caption}</p>
              <p className="text-sm text-pearl/60 mt-1 normal-case">{active.imageType}</p>
            </div>
          </div>
          <button onClick={() => go(1)} className="absolute right-5 top-1/2 -translate-y-1/2 text-pearl" aria-label="Следующее">
            <ChevronRight size={36} />
          </button>
        </div>
      )}
    </div>
  );
}
