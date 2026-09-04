'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ContentEditor from './ContentEditor';
import SubmissionsPanel from './SubmissionsPanel';
import AppearanceEditor from './AppearanceEditor';

const TABS = ['Контент сайта', 'Внешний вид', 'Заявки и заказы'] as const;

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]>('Контент сайта');

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.refresh();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                tab === t ? 'bg-gradient-to-r from-fuchsia to-turquoise text-void font-semibold border-transparent' : 'border-gold/30 text-pearl/70'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <button onClick={logout} className="text-sm text-pearl/50 hover:text-fuchsia">
          Выйти
        </button>
      </div>

      {tab === 'Контент сайта' && <ContentEditor />}
      {tab === 'Внешний вид' && <AppearanceEditor />}
      {tab === 'Заявки и заказы' && <SubmissionsPanel />}
    </div>
  );
}
