import { getOnline, getSiteConfig, getProgram } from '@/lib/content';
import SacredSigil from '@/components/visuals/SacredSigil';
import { Radio, Video, MessageCircle, HeartHandshake, UserPlus } from 'lucide-react';

export const metadata = { title: 'Онлайн-трансляция — Форум-Фестиваль «Преображение»' };

const STATUS_LABEL: Record<string, string> = {
  'эфир идёт': 'ЭФИР ИДЁТ',
  'скоро начало': 'СКОРО НАЧАЛО',
  запись: 'ТРАНСЛЯЦИЯ БУДЕТ ДОСТУПНА ВО ВРЕМЯ ФЕСТИВАЛЯ'
};

export default async function OnlinePage() {
  const [online, site, program] = await Promise.all([getOnline(), getSiteConfig(), getProgram()]);
  const isLive = online.status === 'эфир идёт';
  const today = program[0];

  return (
    <section className="relative py-24 sm:py-32">
      <SacredSigil type="triquetra" size={420} className="absolute right-[2%] top-[6%] text-pearl fx-medium pointer-events-none z-[1]" />
      <div className="relative z-[3] mx-auto max-w-5xl px-5 sm:px-8">
        <p className="text-sm text-gold mb-2">Онлайн-трансляция</p>
        <h1 className="heading-loft text-3xl sm:text-5xl mb-8">Смотрите фестиваль из любой точки мира</h1>

        <div
          className="relative rounded-[36px] overflow-hidden aspect-video flex items-center justify-center mb-6"
          style={{
            border: '1px solid rgba(34,230,210,0.5)',
            boxShadow: '0 0 50px rgba(34,230,210,0.3), 0 0 90px rgba(255,43,194,0.18)',
            background: 'linear-gradient(160deg,#1c0e2e,#0a0413)'
          }}
        >
          <span
            className="absolute top-4 left-4 flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full"
            style={{ background: isLive ? 'rgba(255,43,194,0.9)' : 'rgba(255,217,120,0.9)', color: '#120625' }}
          >
            {isLive && <span className="w-1.5 h-1.5 rounded-full bg-void animate-twinkle" />}
            {online.status === 'запись' ? 'ЗАПИСЬ / ПОДКЛЮЧЕНИЕ СКОРО' : STATUS_LABEL[online.status] || online.status}
          </span>
          <p className="text-pearl/40 text-sm px-8 text-center">
            {isLive && online.links.videoUrl
              ? 'Плеер подключён организатором'
              : STATUS_LABEL[online.status] || 'Трансляция будет доступна во время фестиваля'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="pearl-card tight md:col-span-2">
            <p className="text-xs uppercase text-turquoise mb-2">Текущий эфир</p>
            <p className="font-semibold text-pearl">{online.currentShow.title || 'Тема будет объявлена организатором'}</p>
            {online.currentShow.speakerName && <p className="text-sm text-pearl/60 mt-1">{online.currentShow.speakerName}</p>}
            {online.currentShow.topic && <p className="text-sm text-pearl/70 mt-2">{online.currentShow.topic}</p>}
          </div>
          <div className="pearl-card tight">
            <p className="text-xs uppercase text-turquoise mb-2">Программа дня</p>
            {today ? (
              <>
                <p className="font-semibold text-pearl text-sm">{today.title}</p>
                <ul className="mt-2 space-y-1 text-xs text-pearl/60">
                  {today.online.slice(0, 4).map((o) => (
                    <li key={o}>— {o}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-sm text-pearl/50">Программа появится ближе к фестивалю</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          {online.links.talantPlatform && (
            <a href={online.links.talantPlatform} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2" style={{ background: 'linear-gradient(90deg,#FF2BC2,#22E6D2)', color: '#120625' }}>
              <Video size={16} /> Платформа «Талант»
            </a>
          )}
          {online.links.radioUrl && (
            <a href={online.links.radioUrl} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-full text-sm border border-gold/50 text-pearl flex items-center gap-2">
              <Radio size={16} /> Радиотрансляция
            </a>
          )}
          <a href="/#registration" className="px-5 py-2.5 rounded-full text-sm border border-turquoise/50 text-turquoise flex items-center gap-2">
            <UserPlus size={16} /> Стать участником
          </a>
          <a href={`mailto:${site.contacts.email}`} className="px-5 py-2.5 rounded-full text-sm border border-gold/50 text-pearl flex items-center gap-2">
            <MessageCircle size={16} /> Задать вопрос
          </a>
          <a href="/#registration" className="px-5 py-2.5 rounded-full text-sm border border-gold/50 text-pearl flex items-center gap-2">
            <HeartHandshake size={16} /> Поддержать проект
          </a>
        </div>

        {online.campStream?.enabled && (
          <div className="pearl-card p-6 mb-10">
            <div className="flex items-center justify-between mb-3">
              <p className="heading-loft text-lg">{online.campStream.title}</p>
              <span
                className="text-xs font-bold px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(255,217,120,0.9)', color: '#120625' }}
              >
                {online.campStream.status === 'эфир идёт' ? 'ЭФИР ИДЁТ' : 'ЗАПИСЬ БУДЕТ ДОСТУПНА ВО ВРЕМЯ ФЕСТИВАЛЯ'}
              </span>
            </div>
            <p className="text-sm text-pearl/70 normal-case mb-4">{online.campStream.description}</p>
            {online.campStream.recordingEnabled && (
              <p className="text-xs text-turquoise">Эфир сохраняется в архив после завершения трансляции.</p>
            )}
          </div>
        )}

        <div className="pearl-card tight">
          <p className="text-xs uppercase text-turquoise mb-3">Чат трансляции</p>
          {online.chatEmbedUrl ? (
            <iframe src={online.chatEmbedUrl} className="w-full h-64 border-0 rounded-xl" title="Чат трансляции" />
          ) : (
            <p className="text-sm text-pearl/50">
              Место подготовлено для подключения чата — ссылку добавит организатор в административной панели.
            </p>
          )}
        </div>

        {online.archive.length > 0 && (
          <div className="mt-10">
            <p className="text-xs uppercase text-turquoise mb-3">Архив прошедших эфиров</p>
            <ul className="space-y-2">
              {online.archive.map((a) => (
                <li key={a.title} className="pearl-card tight flex items-center justify-between">
                  <span className="text-sm text-pearl">{a.title}</span>
                  <a href={a.url} className="text-xs text-turquoise">
                    Смотреть запись
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
