'use client';

import { useEffect, useState } from 'react';
import type { SiteConfig } from '@/lib/content';
import Phoenix from './visuals/Phoenix';
import { Volume2, VolumeX, X } from 'lucide-react';

const STORAGE_KEY = 'preobrazhenie_intro_seen';

/**
 * Полноэкранная страница-приглашение перед основным содержанием.
 * Не блокирует доступ к сайту: есть кнопка «Пропустить», выбор
 * запоминается (если config.rememberChoice), автоплей видео — только
 * без звука, с явной кнопкой включения звука.
 */
export default function IntroSplash({
  site,
  config
}: {
  site: SiteConfig;
  config: { enabled: boolean; skippable: boolean; rememberChoice: boolean };
}) {
  const [visible, setVisible] = useState(false);
  const [muted, setMuted] = useState(true);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (config.rememberChoice && typeof window !== 'undefined') {
      const seen = window.localStorage.getItem(STORAGE_KEY);
      if (!seen) setVisible(true);
    } else {
      setVisible(true);
    }
    setChecked(true);
  }, [config.rememberChoice]);

  const dismiss = () => {
    setVisible(false);
    if (config.rememberChoice && typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, '1');
    }
  };

  if (!checked || !visible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden" style={{ background: '#0a0413' }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(255,43,194,0.28), transparent 60%), radial-gradient(ellipse 60% 50% at 50% 80%, rgba(34,230,210,0.22), transparent 60%)'
        }}
      />
      <Phoenix className="fx-medium absolute w-[70vw] max-w-[620px] opacity-70 animate-drift" />

      {config.skippable && (
        <button
          onClick={dismiss}
          className="absolute top-5 right-5 z-10 flex items-center gap-2 text-sm text-pearl/80 px-4 py-2 rounded-full"
          style={{ background: 'rgba(248,244,255,0.08)', border: '1px solid rgba(255,217,120,0.3)' }}
        >
          Пропустить <X size={16} />
        </button>
      )}

      <button
        onClick={() => setMuted((m) => !m)}
        className="absolute bottom-6 right-6 z-10 flex items-center gap-2 text-xs text-pearl/70 px-3.5 py-2 rounded-full"
        style={{ background: 'rgba(248,244,255,0.08)', border: '1px solid rgba(255,217,120,0.3)' }}
        aria-label={muted ? 'Включить звук' : 'Выключить звук'}
      >
        {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        {muted ? 'Звук выключен' : 'Звук включён'}
      </button>

      <div className="relative z-10 max-w-2xl text-center px-6">
        <p className="heading-loft text-2xl sm:text-4xl mb-4">{site.title}</p>
        <p className="text-pearl/85 text-base sm:text-lg leading-relaxed mb-5">
          Десять дней среди гор, источников, водопадов и древней природы Абхазии. Пространство науки,
          культуры, творчества, музыки, семейных ценностей, диалога и созидательного образа будущего.
        </p>
        <p className="text-gold text-sm mb-8">
          {site.dates.display} · {site.location.area} · {site.location.place}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="#registration"
            onClick={dismiss}
            className="px-7 py-3 rounded-full font-bold text-sm"
            style={{ background: 'linear-gradient(90deg,#FF2BC2,#22E6D2)', color: '#120625' }}
          >
            Присоединяйтесь к Преображению
          </a>
          <button onClick={dismiss} className="px-7 py-3 rounded-full text-sm border border-gold/50 text-pearl">
            Смотреть программу
          </button>
        </div>
      </div>
    </div>
  );
}
