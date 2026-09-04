'use client';

function toIcsDate(dateStr: string): string {
  return dateStr.replace(/-/g, '');
}

export default function AddToCalendarButton({
  date,
  title,
  description
}: {
  date: string;
  title: string;
  description: string;
}) {
  const handleClick = () => {
    const start = toIcsDate(date);
    // Событие на весь день; конец = начало следующего дня по спецификации iCalendar.
    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    const end = toIcsDate(endDate.toISOString().slice(0, 10));

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Preobrazhenie Festival//RU',
      'BEGIN:VEVENT',
      `UID:${date}-${Math.random().toString(36).slice(2)}@preobrazhenie-festival.ru`,
      `DTSTART;VALUE=DATE:${start}`,
      `DTEND;VALUE=DATE:${end}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `preobrazhenie-${date}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-xs px-3 py-1.5 rounded-full border border-gold/40 text-gold hover:bg-gold/10 transition-colors"
    >
      Добавить в календарь
    </button>
  );
}
