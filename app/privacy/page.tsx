import { getLegal } from '@/lib/content';
import LegalPage from '@/components/LegalPage';

export const metadata = { title: 'Политика конфиденциальности — Форум-Фестиваль «Преображение»' };

export default async function PrivacyPage() {
  const legal = await getLegal();
  return (
    <LegalPage title="Политика конфиденциальности">
      <p>
        Настоящая Политика определяет порядок обработки персональных данных пользователей сайта
        Форума-Фестиваля «Преображение» оператором: {legal.organizer.dataOperator}.
      </p>
      <h2 className="font-display text-xl text-pearl mt-6">1. Какие данные мы собираем</h2>
      <p>
        Имя, фамилия, телефон, email, Telegram, город, а также сведения, указанные в формах регистрации,
        заявки спикера и заявки партнёра.
      </p>
      <h2 className="font-display text-xl text-pearl mt-6">2. Цели обработки</h2>
      <p>
        Организация участия в фестивале, связь с участниками, спикерами и партнёрами, обработка оплаты,
        информирование о программе.
      </p>
      <h2 className="font-display text-xl text-pearl mt-6">3. Передача данных третьим лицам</h2>
      <p>
        Данные могут передаваться платёжному провайдеру исключительно для целей обработки платежа.
        Данные не передаются третьим лицам в иных целях без согласия пользователя, за исключением случаев,
        предусмотренных законодательством РФ.
      </p>
      <h2 className="font-display text-xl text-pearl mt-6">4. Права пользователя</h2>
      <p>
        Пользователь вправе запросить уточнение, блокирование или удаление своих персональных данных,
        обратившись по адресу {legal.organizer.email}.
      </p>
      <p className="text-pearl/50 text-xs mt-8">Последнее обновление: {legal.lastUpdated}</p>
    </LegalPage>
  );
}
