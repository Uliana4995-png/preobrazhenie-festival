import { getTiming, getProgram, getOnline } from '@/lib/content';
import SacredSigil from '@/components/visuals/SacredSigil';

export const metadata = { title: 'Расписание — Форум-Фестиваль «Преображение»' };

export default async function SchedulePage() {
  const [timing, program, online] = await Promise.all([getTiming(), getProgram(), getOnline()]);

  return (
    <section className="relative py-24 sm:py-32">
      <SacredSigil type="mandala" size={420} className="absolute left-[2%] top-[8%] text-pearl fx-medium pointer-events-none z-[1]" />
      <div className="relative z-[3] mx-auto max-w-5xl px-5 sm:px-8">
        <p className="text-sm text-gold mb-2">Расписание</p>
        <h1 className="heading-loft text-3xl sm:text-5xl mb-3">Тайминг на двух площадках</h1>
        <p className="text-pearl/70 mb-10 max-w-2xl normal-case">
          Базовый тайминг очной программы в горах и онлайн-программы на платформе «{online.links.talantPlatform ? 'Талант' : 'Талант'}».
          Время каждого дня уточняется в разделе «Программа» на главной странице.
        </p>

        <div className="grid lg:grid-cols-2 gap-8 mb-14">
          <div className="pearl-card p-6">
            <p className="heading-loft text-lg mb-4">Очная площадка · горы Абхазии</p>
            <ul className="space-y-2">
              {timing.baseOffline.map((t) => (
                <li key={t.time} className="flex gap-4 text-sm py-2 border-b border-white/5">
                  <span className="text-gold w-28 shrink-0">{t.time}</span>
                  <span className="text-pearl/80">{t.title}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="pearl-card p-6">
            <p className="heading-loft text-lg mb-4">Онлайн-площадка · трансляция</p>
            <ul className="space-y-2">
              {timing.baseOnline.map((t) => (
                <li key={t.time} className="flex gap-4 text-sm py-2 border-b border-white/5">
                  <span className="text-gold w-28 shrink-0">{t.time}</span>
                  <span className="text-pearl/80">{t.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-sm text-gold mb-4">Даты фестиваля по дням</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {program.map((d) => (
            <div key={d.id} className="pearl-card tight">
              <p className="text-xs text-gold mb-1">{d.dateLabel}</p>
              <p className="text-sm font-semibold text-pearl">{d.title}</p>
            </div>
          ))}
        </div>

        <a href="/online" className="inline-block mt-10 px-6 py-3 rounded-full text-sm font-semibold" style={{ background: 'linear-gradient(90deg,#FF2BC2,#22E6D2)', color: '#120625' }}>
          Смотреть онлайн-трансляцию
        </a>
      </div>
    </section>
  );
}
