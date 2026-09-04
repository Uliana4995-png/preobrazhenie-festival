'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || 'Ошибка входа');
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-sm pearl-card rounded-2xl p-8 space-y-4">
      <label className="block">
        <span className="block text-sm text-pearl/70 mb-1.5">Пароль администратора</span>
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
      </label>
      {error && <p className="error">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-5 py-2.5 rounded-full bg-gradient-to-r from-fuchsia to-turquoise text-void font-semibold disabled:opacity-60"
      >
        {loading ? 'Проверка…' : 'Войти'}
      </button>
      <p className="text-xs text-pearl/40">
        Пароль задаётся переменной окружения ADMIN_PASSWORD. См. README для смены пароля и настройки более
        надёжной авторизации (Supabase Auth).
      </p>
    </form>
  );
}
