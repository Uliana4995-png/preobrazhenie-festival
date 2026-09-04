import { getLegal, getSiteConfig } from '@/lib/content';
import LegalPage from '@/components/LegalPage';

export const metadata = { title: 'Публичная оферта — Форум-Фестиваль «Преображение»' };

export default async function OfertaPage() {
  const legal = await getLegal();
  const site = await getSiteConfig();

  return (
    <LegalPage title="Публичная оферта">
      <p>
        Настоящий документ является публичной офертой {legal.organizer.fullName} (далее — «Организатор») на
        участие в Форуме-Фестивале «{site.title.replace('Форум-Фестиваль ', '')}» и определяет условия
        участия, оплаты и оказания сопутствующих услуг.
      </p>
      <p>
        <strong>Важно.</strong> Этот раздел является шаблоном и должен быть заполнен и проверен
        Организатором (при необходимости — с участием юриста) до публикации сайта и включения приёма
        оплаты.
      </p>
      <h2 className="font-display text-xl text-pearl mt-6">1. Предмет оферты</h2>
      <p>
        Организатор предлагает любому дееспособному физическому или юридическому лицу принять участие в
        Форуме-Фестивале «Преображение», проводимом {site.dates.display} по адресу: {site.location.area},{' '}
        {site.location.place}, на условиях, изложенных в настоящей оферте и на страницах «Стоимость и
        проживание», «Пакеты участия», «Правила возврата».
      </p>
      <h2 className="font-display text-xl text-pearl mt-6">2. Порядок оформления участия</h2>
      <p>
        Акцептом оферты считается заполнение формы регистрации на сайте и/или осуществление оплаты
        выбранного пакета участия.
      </p>
      <h2 className="font-display text-xl text-pearl mt-6">3. Стоимость и порядок оплаты</h2>
      <p>
        Актуальная стоимость участия указана в разделах «Стоимость и проживание» и «Пакеты участия» сайта.
        Оплата производится через указанный на сайте платёжный сервис.
      </p>
      <h2 className="font-display text-xl text-pearl mt-6">4. Реквизиты Организатора</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Наименование: {legal.organizer.fullName}</li>
        <li>ИНН: {legal.organizer.inn}</li>
        <li>ОГРН/ОГРНИП: {legal.organizer.ogrn}</li>
        <li>Юридический адрес: {legal.organizer.legalAddress}</li>
        <li>Контактный email: {legal.organizer.email}</li>
        <li>Контактный телефон: {legal.organizer.phone}</li>
        <li>Платёжные реквизиты: {legal.organizer.bankDetails}</li>
      </ul>
      <p className="text-pearl/50 text-xs mt-8">Последнее обновление: {legal.lastUpdated}</p>
    </LegalPage>
  );
}
