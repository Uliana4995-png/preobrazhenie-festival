import { getLegal } from '@/lib/content';
import LegalPage from '@/components/LegalPage';

export const metadata = { title: 'Согласие на обработку персональных данных — Форум-Фестиваль «Преображение»' };

export default async function ConsentPage() {
  const legal = await getLegal();
  return (
    <LegalPage title="Согласие на обработку персональных данных">
      <p>
        Заполняя формы на сайте Форума-Фестиваля «Преображение», пользователь свободно, своей волей и в
        своём интересе даёт согласие {legal.organizer.dataOperator} на обработку своих персональных данных
        на условиях, изложенных ниже.
      </p>
      <h2 className="font-display text-xl text-pearl mt-6">1. Перечень данных</h2>
      <p>Фамилия, имя, контактный телефон, email, Telegram, город и иные данные, указанные в форме.</p>
      <h2 className="font-display text-xl text-pearl mt-6">2. Цель обработки</h2>
      <p>Организация участия в фестивале, связь с пользователем, обработка оплаты.</p>
      <h2 className="font-display text-xl text-pearl mt-6">3. Срок действия согласия</h2>
      <p>
        Согласие действует до момента его отзыва пользователем путём направления письменного заявления на
        адрес {legal.organizer.email}.
      </p>
      <p className="text-pearl/50 text-xs mt-8">Последнее обновление: {legal.lastUpdated}</p>
    </LegalPage>
  );
}
