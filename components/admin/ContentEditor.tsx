'use client';

import { useEffect, useRef, useState } from 'react';

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

const LABELS: Record<string, string> = {
  year: 'Год',
  dates: 'Даты',
  start: 'Дата начала',
  end: 'Дата окончания',
  display: 'Текст для отображения',
  title: 'Заголовок',
  slogan: 'Слоган',
  subtitle: 'Подзаголовок',
  location: 'Место проведения',
  region: 'Регион',
  area: 'Район',
  place: 'Место',
  mapEmbedUrl: 'Ссылка на карту (embed)',
  cta: 'Кнопки призыва к действию',
  participate: 'Текст кнопки «Участвовать»',
  program: 'Текст кнопки «Программа»',
  speaker: 'Текст кнопки «Спикер»',
  contacts: 'Контакты',
  phone: 'Телефон',
  email: 'Email',
  telegram: 'Telegram',
  vk: 'VK',
  address: 'Адрес',
  streaming: 'Трансляция',
  platformName: 'Название платформы',
  platformUrl: 'Ссылка на платформу',
  radioUrl: 'Ссылка на радио',
  videoUrl: 'Ссылка на видео',
  campStream: 'Трансляция из лагеря',
  seo: 'SEO',
  description: 'Описание',
  id: 'Идентификатор',
  date: 'Дата',
  dateLabel: 'Дата (текст)',
  theme: 'Тема дня',
  usesBaseTiming: 'Использовать базовый тайминг',
  morning: 'Утро',
  day: 'День',
  evening: 'Вечер',
  night: 'Ночь',
  name: 'Имя',
  role: 'Роль',
  org: 'Организация',
  bio: 'Биография',
  imageUrl: 'Фото (ссылка)',
  photo: 'Фото (ссылка)',
  image: 'Фото (ссылка)',
  cover: 'Обложка (ссылка)',
  logo: 'Логотип (ссылка)',
  question: 'Вопрос',
  answer: 'Ответ',
  q: 'Вопрос',
  a: 'Ответ',
  text: 'Текст',
  label: 'Подпись',
  price: 'Цена',
  originalPrice: 'Старая цена (перечёркнутая)',
  tiers: 'Тарифные ступени',
  packageName: 'Название пакета',
  items: 'Пункты',
  category: 'Категория',
  slug: 'Ссылка (slug)',
  content: 'Содержимое'
};

function humanize(key: string): string {
  if (LABELS[key]) return LABELS[key];
  const spaced = key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/_/g, ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function isImageKey(key: string): boolean {
  return /image|photo|avatar|logo|cover|picture/i.test(key);
}

function emptyLike(sample: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(sample)) {
    const v = sample[key];
    if (typeof v === 'string') result[key] = '';
    else if (typeof v === 'number') result[key] = 0;
    else if (typeof v === 'boolean') result[key] = false;
    else if (Array.isArray(v)) result[key] = [];
    else if (v && typeof v === 'object') result[key] = emptyLike(v as Record<string, unknown>);
    else result[key] = '';
  }
  return result;
}

type UploadRequester = (setValue: (url: string) => void) => void;

function ObjectEditor({
  value,
  onChange,
  onUploadImage
}: {
  value: Record<string, unknown>;
  onChange: (v: Record<string, unknown>) => void;
  onUploadImage: UploadRequester;
}) {
  return (
    <div>
      {Object.keys(value).map((key) => (
        <FieldEditor
          key={key}
          keyName={key}
          value={value[key]}
          onChange={(v) => onChange({ ...value, [key]: v })}
          onUploadImage={onUploadImage}
        />
      ))}
    </div>
  );
}

function FieldEditor({
  keyName,
  value,
  onChange,
  onUploadImage
}: {
  keyName: string;
  value: unknown;
  onChange: (v: unknown) => void;
  onUploadImage: UploadRequester;
}) {
  const label = humanize(keyName);

  if (value === null || value === undefined) {
    return (
      <div className="mb-3">
        <label className="block text-sm text-pearl/70 mb-1">{label}</label>
        <input type="text" value="" onChange={(e) => onChange(e.target.value)} className="input text-sm" />
      </div>
    );
  }

  if (typeof value === 'string') {
    const isLong = value.length > 100 || value.includes('\n');
    const isImg = isImageKey(keyName);
    return (
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1 gap-2">
          <label className="block text-sm text-pearl/70">{label}</label>
          {isImg && (
            <button
              type="button"
              onClick={() => onUploadImage((url) => onChange(url))}
              className="text-xs px-2 py-1 rounded-full border border-gold/30 text-pearl/80 whitespace-nowrap"
            >
              📷 Загрузить фото
            </button>
          )}
        </div>
        {isImg && value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="max-h-28 rounded-lg mb-2 object-cover" />
        ) : null}
        {isLong ? (
          <textarea value={value} onChange={(e) => onChange(e.target.value)} className="input text-sm min-h-[100px]" />
        ) : (
          <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="input text-sm" />
        )}
      </div>
    );
  }

  if (typeof value === 'number') {
    return (
      <div className="mb-3">
        <label className="block text-sm text-pearl/70 mb-1">{label}</label>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
          className="input text-sm"
        />
      </div>
    );
  }

  if (typeof value === 'boolean') {
    return (
      <div className="mb-3 flex items-center gap-2">
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4" />
        <label className="text-sm text-pearl/70">{label}</label>
      </div>
    );
  }

  if (Array.isArray(value)) {
    const isObjectArray = value.length > 0 && typeof value[0] === 'object' && value[0] !== null;

    if (isObjectArray) {
      return (
        <div className="mb-4 border border-white/10 rounded-xl p-3">
          <p className="text-sm text-turquoise mb-2">{label}</p>
          {value.map((item, i) => (
            <div key={i} className="mb-3 border border-white/10 rounded-lg p-3 relative">
              <button
                type="button"
                onClick={() => {
                  const copy = [...value];
                  copy.splice(i, 1);
                  onChange(copy);
                }}
                className="absolute top-2 right-2 text-xs text-fuchsia/70 hover:text-fuchsia"
              >
                ✕ Удалить
              </button>
              <ObjectEditor
                value={item as Record<string, unknown>}
                onChange={(v) => {
                  const copy = [...value];
                  copy[i] = v;
                  onChange(copy);
                }}
                onUploadImage={onUploadImage}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const template = value.length > 0 ? emptyLike(value[0] as Record<string, unknown>) : {};
              onChange([...value, template]);
            }}
            className="text-sm px-3 py-1.5 rounded-full border border-turquoise/40 text-turquoise"
          >
            + Добавить
          </button>
        </div>
      );
    }

    const isNumberArray = value.length > 0 && typeof value[0] === 'number';
    return (
      <div className="mb-4 border border-white/10 rounded-xl p-3">
        <p className="text-sm text-turquoise mb-2">{label}</p>
        {value.map((item, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type={isNumberArray ? 'number' : 'text'}
              value={String(item)}
              onChange={(e) => {
                const copy = [...value];
                copy[i] = isNumberArray ? Number(e.target.value) : e.target.value;
                onChange(copy);
              }}
              className="input text-sm flex-1"
            />
            <button
              type="button"
              onClick={() => {
                const copy = [...value];
                copy.splice(i, 1);
                onChange(copy);
              }}
              className="text-xs px-2 text-fuchsia/70 hover:text-fuchsia"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...value, isNumberArray ? 0 : ''])}
          className="text-sm px-3 py-1.5 rounded-full border border-turquoise/40 text-turquoise"
        >
          + Добавить
        </button>
      </div>
    );
  }

  if (typeof value === 'object') {
    return (
      <div className="mb-4 border border-white/10 rounded-xl p-3">
        <p className="text-sm text-turquoise mb-2">{label}</p>
        <ObjectEditor value={value as Record<string, unknown>} onChange={onChange} onUploadImage={onUploadImage} />
      </div>
    );
  }

  return null;
}

function RootEditor({
  data,
  onChange,
  onUploadImage
}: {
  data: unknown;
  onChange: (v: unknown) => void;
  onUploadImage: UploadRequester;
}) {
  if (Array.isArray(data)) {
    return <FieldEditor keyName="Элементы" value={data} onChange={onChange} onUploadImage={onUploadImage} />;
  }
  if (data && typeof data === 'object') {
    return <ObjectEditor value={data as Record<string, unknown>} onChange={(v) => onChange(v)} onUploadImage={onUploadImage} />;
  }
  return <p className="text-pearl/60 text-sm">Этот раздел имеет простой формат — переключитесь в режим JSON.</p>;
}

export default function ContentEditor() {
  const [selected, setSelected] = useState<string>(FILES[0]!.file);
  const [data, setData] = useState<unknown>(null);
  const [jsonText, setJsonText] = useState('');
  const [mode, setMode] = useState<'form' | 'json'>('form');
  const [status, setStatus] = useState<'idle' | 'loading' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingSetterRef = useRef<((url: string) => void) | null>(null);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setError('');
    setMode('form');
    fetch(`/api/admin/content?file=${selected}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json.error) throw new Error(json.error);
        setData(json.data);
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

  const switchToJson = () => {
    setJsonText(JSON.stringify(data, null, 2));
    setMode('json');
  };

  const switchToForm = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setData(parsed);
      setError('');
      setMode('form');
    } catch {
      setError('Некорректный JSON — проверьте синтаксис, прежде чем переключаться обратно.');
    }
  };

  const save = async () => {
    setStatus('saving');
    setError('');

    let toSave = data;
    if (mode === 'json') {
      try {
        toSave = JSON.parse(jsonText);
      } catch {
        setError('Некорректный JSON — проверьте синтаксис.');
        setStatus('error');
        return;
      }
      setData(toSave);
    }

    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: selected, data: toSave })
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

  const requestUpload: UploadRequester = (setValue) => {
    pendingSetterRef.current = setValue;
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Не удалось загрузить фото');

      const url = json.url as string;

      if (mode === 'json' && !pendingSetterRef.current) {
        const textarea = textareaRef.current;
        if (textarea) {
          const start = textarea.selectionStart ?? jsonText.length;
          const end = textarea.selectionEnd ?? jsonText.length;
          const newText = jsonText.slice(0, start) + url + jsonText.slice(end);
          setJsonText(newText);
          requestAnimationFrame(() => {
            textarea.focus();
            textarea.selectionStart = textarea.selectionEnd = start + url.length;
          });
        } else {
          setJsonText((t) => t + url);
        }
      } else if (pendingSetterRef.current) {
        pendingSetterRef.current(url);
        pendingSetterRef.current = null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки фото');
    } finally {
      setUploading(false);
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
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <p className="text-sm text-pearl/60">
            Редактирование <span className="font-mono text-gold">{selected}</span>
          </p>
          <div className="flex gap-2 flex-wrap">
            {mode === 'json' && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 rounded-full border border-gold/30 text-pearl/80 text-sm disabled:opacity-60"
              >
                {uploading ? 'Загрузка фото…' : '📷 Загрузить фото'}
              </button>
            )}
            <button
              type="button"
              onClick={mode === 'form' ? switchToJson : switchToForm}
              className="px-4 py-2 rounded-full border border-gold/30 text-pearl/80 text-sm"
            >
              {mode === 'form' ? 'Режим JSON' : 'Обычный режим'}
            </button>
            <button
              type="button"
              onClick={save}
              disabled={status === 'saving' || status === 'loading'}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-fuchsia to-turquoise text-void text-sm font-semibold disabled:opacity-60"
            >
              {status === 'saving' ? 'Сохранение…' : status === 'saved' ? 'Сохранено ✓' : 'Сохранить'}
            </button>
          </div>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelected} className="hidden" />

        {error && <p className="error mb-2">{error}</p>}

        {status === 'loading' && <p className="text-pearl/60 text-sm">Загрузка…</p>}

        {status !== 'loading' && mode === 'form' && (
          <div className="max-h-[600px] overflow-y-auto pr-1">
            <RootEditor data={data} onChange={setData} onUploadImage={requestUpload} />
          </div>
        )}

        {status !== 'loading' && mode === 'json' && (
          <textarea
            ref={textareaRef}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            spellCheck={false}
            className="input font-mono text-xs min-h-[520px] leading-relaxed"
          />
        )}

        <p className="text-xs text-pearl/40 mt-3">
          {mode === 'form'
            ? 'Заполните нужные поля и нажмите «Сохранить». У полей с фото — своя кнопка загрузки.'
            : 'Режим для опытных — прямое редактирование кода.'}
        </p>
      </div>
    </div>
  );
}
