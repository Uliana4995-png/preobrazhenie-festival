import { getLegal } from '@/lib/content';
import LegalPage from '@/components/LegalPage';

export const metadata = { title: 'Правила возврата — Форум-Фестиваль «Преображение»' };

export default async function RefundPage() {
  const legal = await getLegal();
  return (
    <LegalPage title="Правила возврата">
      <p>{legal.refundPolicySummary}</p>
      <h2 className="font-display text-xl text-pearl mt-6">Общие положения</h2>
      <p>
        Организатор рекомендует заполнить этот раздел точными условиями и сроками возврата средств при
        отказе участника от участия, включая случаи отмены фестиваля по независящим от Организатора
        причинам.
      </p>
      <p>
        По вопросам возврата обращайтесь по адресу {legal.organizer.email} или телефону{' '}
        {legal.organizer.phone}.
      </p>
      <p className="text-pearl/50 text-xs mt-8">Последнее обновление: {legal.lastUpdated}</p>
    </LegalPage>
  );
}
