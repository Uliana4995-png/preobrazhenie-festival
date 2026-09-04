'use client';

import { useEffect, useState } from 'react';

const FILES: { file: string; label: string }[] = [
  { file: 'site.json', label: 'Основные настройки сайта (название, даты, ссылки)' },
  { file: 'program.json', label: 'Программа по дням' },
  { file: 'timing.json', label: 'Базовый тайминг (очный/онлайн)' },
  { file: 'speakers.json', label: 'Спикеры и учёные' },
  { file: 'pricing.json', label: 'Стоимость и проживание — текст блока' },
  { file: 'packages.json', label: 'Пакеты участия и цены' },
  { file: 'faq.json', label: 'Частые вопросы' },
  { file: 'practices.json', label: 'Практики и мероприятия' },
  { file: 'center.json', label: 'Центр Преображения' },
  { file: 'online.json', label: 'Онлайн-трансляция' },
  { file: 'gallery.json', label: 'Галерея (фото, категории)' },
  { file: 'topic-pages.json', label: 'Тематические страницы (Космические смыслы, Баня, Музыка сфер и др.)' },
  { file: 'legal.json', label: 'Реквизиты организатора и юридические тексты' }
];

export default function ContentEditor() {
  const [selected, setSelected] = useState<string>(FILES[0]!.file);
  const [text, setText] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setError('');
    fetch(`/api/admin/content?file=${selected}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json.error) throw new Error(json.error);
        setText(JSON.stringify(json.data, null, 2));
        setStatus('idle');
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e.message);
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [selected]);

  const save = async () => {
    setStatus('saving');
    setError('');
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      setError('Некорректный JSON — проверьте синтаксис (запятые, кавычки, скобки).');
      setStatus('error');
      return;
    }
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: selected, data: parsed })
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

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-6">
      <div className="space-y-1">
        {FILES.map((f) => (
          <button
            key={f.file}
            onClick={() => setSelected(f.file)}
            className={`w-full text-left text-sm px-3 py-2.5 rounded-lg transition-colors ${
              selected === f.file ? 'bg-turquoise/15 text-turquoise' : 'text-pearl/70 hover:bg-white/5'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="pearl-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-pearl/60">
            Редактирование <span className="font-mono text-gold">{selected}</span>
          </p>
          <button
            onClick={save}
            disabled={status === 'saving' || status === 'loading'}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-fuchsia to-turquoise text-void text-sm font-semibold disabled:opacity-60"
          >
            {status === 'saving' ? 'Сохранение…' : status === 'saved' ? 'Сохранено ✓' : 'Сохранить'}
          </button>
        </div>

        {error && <p className="error mb-2">{error}</p>}

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          className="input font-mono text-xs min-h-[520px] leading-relaxed"
        />

        <p className="text-xs text-pearl/40 mt-3">
          Это прямой JSON-редактор содержимого сайта: измените значения и нажмите «Сохранить» — правки
          применятся сразу после обновления страницы. На хостинге с временной файловой системой (например,
          Vercel) изменения не сохранятся между развёртываниями — для продакшена подключите Supabase или
          Decap CMS, см. README, раздел «Как редактировать контент после публикации».
        </p>
      </div>
    </div>
  );
}
