'use client';

import { useEffect, useState } from 'react';
import type { AppearanceConfig } from '@/lib/content';

const SIGIL_OPTIONS = ['infinity', 'flower', 'mandala', 'triquetra', 'lotus', 'dotcircle', 'twotriangles', 'crystalstar', 'shellspiral', 'sun'];
const SECTION_LABELS: Record<string, string> = {
  hero: 'Главный экран',
  about: 'О фестивале',
  location: 'Место проведения',
  mission: 'Миссия',
  program: 'Программа / Центр Преображения',
  campfire: 'Кемпинг',
  online: 'Трансляция',
  pricing: 'Стоимость',
  gallery: 'Галерея',
  faq: 'Вопросы'
};

/**
 * Раздел «Внешний вид»: организатор меняет фон, звёзды, свечение,
 * символы разделов, цвета и изображения без редактирования кода.
 * Изменения сохраняются в content/appearance.json через тот же API,
 * что и остальной контент.
 */
export default function AppearanceEditor() {
  const [data, setData] = useState<AppearanceConfig | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'saving' | 'saved' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/content?file=appearance.json')
      .then((res) => res.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        setData(json.data);
        setStatus('idle');
      })
      .catch((e) => {
        setError(e.message);
        setStatus('error');
      });
  }, []);

  const save = async () => {
    if (!data) return;
    setStatus('saving');
    setError('');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: 'appearance.json', data })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Не удалось сохранить');
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка сохранения');
      setStatus('error');
    }
  };

  if (status === 'loading' || !data) return <p className="text-pearl/50 text-sm">Загрузка…</p>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-pearl/60">Внешний вид сайта — фон, эффекты, символы разделов</p>
        <button
          onClick={save}
          disabled={status === 'saving'}
          className="px-4 py-2 rounded-full text-sm font-semibold disabled:opacity-60"
          style={{ background: 'linear-gradient(90deg,#FF2BC2,#22E6D2)', color: '#120625' }}
        >
          {status === 'saving' ? 'Сохранение…' : status === 'saved' ? 'Сохранено ✓' : 'Сохранить'}
        </button>
      </div>
      {error && <p className="error">{error}</p>}

      <section className="pearl-card tight">
        <p className="text-xs uppercase text-turquoise mb-3">Уровень визуальных эффектов</p>
        <div className="flex gap-2">
          {(['full', 'optimized', 'minimal'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setData({ ...data, effectsLevel: lvl })}
              className="px-4 py-2 rounded-full text-xs border"
              style={
                data.effectsLevel === lvl
                  ? { background: 'linear-gradient(90deg,#FF2BC2,#22E6D2)', color: '#120625', border: 'none' }
                  : { borderColor: 'rgba(255,217,120,0.35)', color: 'rgba(248,244,255,0.7)' }
              }
            >
              {lvl === 'full' ? 'Полный' : lvl === 'optimized' ? 'Оптимизированный' : 'Минимальный'}
            </button>
          ))}
        </div>
      </section>

      <section className="pearl-card tight grid sm:grid-cols-2 gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="checkbox" checked={data.stars} onChange={(e) => setData({ ...data, stars: e.target.checked })} />
          Звёзды на фоне
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="checkbox" checked={data.milkyWay} onChange={(e) => setData({ ...data, milkyWay: e.target.checked })} />
          Млечный Путь
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="checkbox"
            checked={data.mobileLiteMode}
            onChange={(e) => setData({ ...data, mobileLiteMode: e.target.checked })}
          />
          Облегчённый мобильный режим
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="checkbox"
            checked={data.introSplash.enabled}
            onChange={(e) => setData({ ...data, introSplash: { ...data.introSplash, enabled: e.target.checked } })}
          />
          Вступительная заставка
        </label>
      </section>

      <section className="pearl-card tight">
        <p className="text-xs uppercase text-turquoise mb-3">Интенсивность свечения ({data.glowIntensity.toFixed(1)})</p>
        <input
          type="range"
          min={0.3}
          max={1.8}
          step={0.1}
          value={data.glowIntensity}
          onChange={(e) => setData({ ...data, glowIntensity: Number(e.target.value) })}
          className="w-full"
        />
        <p className="text-xs uppercase text-turquoise mt-5 mb-3">Прозрачность карточек ({data.cardOpacity.toFixed(2)})</p>
        <input
          type="range"
          min={0.05}
          max={0.35}
          step={0.01}
          value={data.cardOpacity}
          onChange={(e) => setData({ ...data, cardOpacity: Number(e.target.value) })}
          className="w-full"
        />
      </section>

      <section className="pearl-card tight grid sm:grid-cols-3 gap-4">
        {(['fuchsia', 'gold', 'turquoise'] as const).map((c) => (
          <label key={c} className="block">
            <span className="block text-xs text-pearl/60 mb-1.5 capitalize">{c === 'fuchsia' ? 'Фуксия' : c === 'gold' ? 'Золото' : 'Бирюза'}</span>
            <input
              type="color"
              value={data.colors[c]}
              onChange={(e) => setData({ ...data, colors: { ...data.colors, [c]: e.target.value } })}
              className="w-full h-10 rounded-lg border border-gold/30 bg-transparent"
            />
          </label>
        ))}
      </section>

      <section className="pearl-card tight">
        <p className="text-xs uppercase text-turquoise mb-3">Символ для каждого раздела</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {Object.entries(data.sectionSigils).map(([section, sigil]) => (
            <label key={section} className="flex items-center justify-between gap-3 text-sm">
              <span className="text-pearl/70">{SECTION_LABELS[section] || section}</span>
              <select
                className="input text-xs py-1.5 w-40"
                value={sigil}
                onChange={(e) => setData({ ...data, sectionSigils: { ...data.sectionSigils, [section]: e.target.value } })}
              >
                {SIGIL_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </section>

      <section className="pearl-card tight space-y-4">
        <p className="text-xs uppercase text-turquoise mb-1">Изображения (URL)</p>
        {(['phoenix', 'mandala', 'campsite', 'dove', 'introVideo'] as const).map((key) => (
          <label key={key} className="block">
            <span className="block text-xs text-pearl/60 mb-1.5">
              {key === 'phoenix'
                ? 'Изображение феникса'
                : key === 'mandala'
                ? 'Изображение мандалы'
                : key === 'campsite'
                ? 'Изображение палаточного лагеря'
                : key === 'dove'
                ? 'Изображение голубки'
                : 'Фоновое видео (intro)'}
            </span>
            <input
              className="input text-sm"
              placeholder="https://..."
              value={data.images[key]}
              onChange={(e) => setData({ ...data, images: { ...data.images, [key]: e.target.value } })}
            />
          </label>
        ))}
        <p className="text-xs text-pearl/40">
          Оставьте поле пустым — тогда будет использоваться встроенная векторная графика вместо загруженного
          изображения.
        </p>
      </section>
    </div>
  );
}
