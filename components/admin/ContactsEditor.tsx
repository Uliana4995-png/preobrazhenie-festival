'use client';

import { useEffect, useState } from 'react';

type Contacts = {
  phone: string;
  email: string;
  telegram: string;
  vk: string;
  address: string;
};

export default function ContactsEditor() {
  const [siteData, setSiteData] = useState<Record<string, unknown> | null>(null);
  const [contacts, setContacts] = useState<Contacts>({ phone: '', email: '', telegram: '', vk: '', address: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    setStatus('loading');
    fetch('/api/admin/content?file=site.json')
      .then((res) => res.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        setSiteData(json.data);
        const c = (json.data?.contacts ?? {}) as Partial<Contacts>;
        setContacts({
          phone: c.phone ?? '',
          email: c.email ?? '',
          telegram: c.telegram ?? '',
          vk: c.vk ?? '',
          address: c.address ?? ''
        });
        setStatus('idle');
      })
      .catch((e) => {
        setError(e.message);
        setStatus('error');
      });
  }, []);

  const save = async () => {
    if (!siteData) return;
    setStatus('saving');
    setError('');
    const updated = { ...siteData, contacts };
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: 'site.json', data: updated })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Не удалось сохранить');
      setSiteData(updated);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка сохранения');
      setStatus('error');
    }
  };

  const field = (key: keyof Contacts, label: string, placeholder: string) => (
    <div className="mb-4">
      <label className="block text-sm text-pearl/70 mb-1">{label}</label>
      <input
        type="text"
        value={contacts[key]}
        onChange={(e) => setContacts((c) => ({ ...c, [key]: e.target.value }))}
        placeholder={placeholder}
        className="input text-sm"
      />
    </div>
  );

  if (status === 'loading') return <p className="text-pearl/60 text-sm">Загрузка…</p>;

  return (
    <div className="pearl-card rounded-2xl p-5 max-w-xl">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-pearl/60">Контакты фестиваля</p>
        <button
          onClick={save}
          disabled={status === 'saving'}
          className="px-4 py-2 rounded-full bg-gradient-to-r from-fuchsia to-turquoise text-void text-sm font-semibold disabled:opacity-60"
        >
          {status === 'saving' ? 'Сохранение…' : status === 'saved' ? 'Сохранено ✓' : 'Сохранить'}
        </button>
      </div>

      {error && <p className="error mb-3">{error}</p>}

      {field('phone', 'Телефон', '+7 900 000-00-00')}
      {field('email', 'Электронная почта', 'info@preobrazhenie-festival.ru')}
      {field('telegram', 'Ссылка на Telegram', 'https://t.me/...')}
      {field('vk', 'Ссылка на VK', 'https://vk.com/...')}
      {field('address', 'Адрес / место проведения', 'Абхазия, посёлок Члоу...')}
    </div>
  );
}
