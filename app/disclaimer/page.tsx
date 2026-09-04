import { getLegal } from '@/lib/content';
import LegalPage from '@/components/LegalPage';

export const metadata = { title: 'Медицинский и организационный дисклеймер — Форум-Фестиваль «Преображение»' };

export default async function DisclaimerPage() {
  const legal = await getLegal();
  return (
    <LegalPage title="Медицинский и организационный дисклеймер">
      <p className="pearl-card rounded-xl p-5">{legal.disclaimer}</p>
      <h2 className="font-display text-xl text-pearl mt-6">Философские и мировоззренческие темы</h2>
      <p>
        Программа фестиваля включает философские, духовные, космологические и мировоззренческие темы,
        обсуждаемые в формате диалога и обмена взглядами. Эти темы не представляются как научно доказанные
        факты.
      </p>
      <h2 className="font-display text-xl text-pearl mt-6">Отсутствие гарантий результата</h2>
      <p>
        Организатор не обещает и не гарантирует исцеления заболеваний, омоложения, финансового изобилия,
        создания пары или иных недоказанных результатов участия в практиках и мероприятиях фестиваля.
      </p>
      <h2 className="font-display text-xl text-pearl mt-6">Изменение программы</h2>
      <p>
        Организатор вправе вносить изменения в программу, в том числе по погодным условиям и соображениям
        безопасности.
      </p>
      <p className="text-pearl/50 text-xs mt-8">Последнее обновление: {legal.lastUpdated}</p>
    </LegalPage>
  );
}
