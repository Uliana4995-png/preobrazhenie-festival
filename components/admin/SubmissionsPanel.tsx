'use client';

import { useEffect, useState } from 'react';

const TABLES: { table: string; label: string }[] = [
  { table: 'registrations', label: 'Заявки на участие' },
  { table: 'speaker_applications', label: 'Заявки спикеров' },
  { table: 'partner_applications', label: 'Заявки партнёров' },
  { table: 'orders', label: 'Заказы и оплата' }
];

const STATUS_OPTIONS = ['новая', 'в работе', 'подтверждена', 'отклонена', 'оплачен', 'отменён'];

export default function SubmissionsPanel() {
  const [table, setTable] = useState<string>(TABLES[0]!.table);
  const [records, setRecords] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    fetch(`/api/admin/submissions?table=${table}`)
      .then((res) => res.json())
      .then((json) => setRecords(json.records || []))
      .finally(() => setLoading(false));
  };

  useEffect(load, [table]);

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/admin/submissions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table, id, status })
    });
    load();
  };

  const firstRecord = records[0];
  const columns = firstRecord ? Object.keys(firstRecord) : [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap gap-2">
          {TABLES.map((t) => (
            <button
              key={t.table}
              onClick={() => setTable(t.table)}
              className={`px-3.5 py-2 rounded-full text-xs sm:text-sm border ${
                table === t.table ? 'bg-turquoise/20 text-turquoise border-turquoise/40' : 'border-white/10 text-pearl/60'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <a
          href={`/api/admin/export?table=${table}`}
          className="text-sm px-4 py-2 rounded-full border border-gold/40 text-gold"
        >
          Экспорт в CSV
        </a>
      </div>

      <div className="pearl-card rounded-2xl overflow-x-auto">
        {loading ? (
          <p className="p-6 text-pearl/50 text-sm">Загрузка…</p>
        ) : records.length === 0 ? (
          <p className="p-6 text-pearl/50 text-sm">Заявок пока нет.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                {columns.map((c) => (
                  <th key={c} className="px-4 py-3 text-xs uppercase tracking-wide text-pearl/50 whitespace-nowrap">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="border-b border-white/5">
                  {columns.map((c) => (
                    <td key={c} className="px-4 py-3 whitespace-nowrap max-w-[220px] truncate align-top">
                      {c === 'status' ? (
                        <select
                          value={r.status}
                          onChange={(e) => updateStatus(r.id, e.target.value)}
                          className="input text-xs py-1"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      ) : (
                        String(r[c] ?? '')
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
