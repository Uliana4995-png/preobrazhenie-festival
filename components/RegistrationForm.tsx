'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema, type RegistrationInput } from '@/lib/validation';
import SectionHeading from './SectionHeading';
import type { Package } from '@/lib/content';

const TENT_PRICE = 1000;

export default function RegistrationForm({ packages, dayPrice }: { packages: Package[]; dayPrice: number }) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [serverError, setServerError] = useState('');
  const [days, setDays] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      format: 'офлайн',
      participants: 1,
      accommodation: 'место в палатке',
      meals: 'самостоятельно',
      transferNeeded: false
    }
  });

  const format = watch('format');
  const participants = Number(watch('participants')) || 1;
  const accommodation = watch('accommodation');

  const total = useMemo(() => {
    if (format === 'онлайн') return 0; // цена онлайн-участия задаётся организатором отдельно
    const participation = dayPrice * days * participants;
    const accommodationCost = accommodation === 'место в палатке' ? TENT_PRICE * participants : 0;
    return participation + accommodationCost;
  }, [format, days, participants, accommodation, dayPrice]);

  const onSubmit = async (data: RegistrationInput) => {
    setStatus('submitting');
    setServerError('');
    try {
      const res = await fetch('/api/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Не удалось отправить заявку');

      if (format === 'офлайн' && total > 0) {
        const paymentRes = await fetch('/api/payment/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            packageId: 'registration',
            amount: total,
            registrationId: json.id,
            description: `Участие в фестивале «Преображение», заявка ${json.id}`
          })
        });
        const paymentJson = await paymentRes.json();
        if (paymentRes.ok && paymentJson.confirmationUrl) {
          window.location.href = paymentJson.confirmationUrl;
          return;
        }
      }

      setStatus('idle');
      window.location.href = '/payment/success?free=1';
    } catch (e) {
      setStatus('error');
      setServerError(e instanceof Error ? e.message : 'Ошибка отправки формы');
    }
  };

  return (
    <section id="registration" className="snap-page relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHeading eyebrow="Заявка на участие" title="Регистрация" description="Заполните форму — расчёт стоимости появится автоматически." />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* honeypot */}
          <input type="text" className="hidden" tabIndex={-1} autoComplete="off" {...register('website')} />

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Имя" error={errors.firstName?.message}>
              <input className="input" {...register('firstName')} />
            </Field>
            <Field label="Фамилия" error={errors.lastName?.message}>
              <input className="input" {...register('lastName')} />
            </Field>
            <Field label="Телефон" error={errors.phone?.message}>
              <input className="input" type="tel" {...register('phone')} />
            </Field>
            <Field label="Электронная почта" error={errors.email?.message}>
              <input className="input" type="email" {...register('email')} />
            </Field>
            <Field label="Telegram" error={errors.telegram?.message}>
              <input className="input" placeholder="@username" {...register('telegram')} />
            </Field>
            <Field label="Город и страна" error={errors.city?.message}>
              <input className="input" {...register('city')} />
            </Field>
          </div>

          <Field label="Даты участия" error={errors.dates?.message}>
            <input className="input" placeholder="например, 20–24 сентября" {...register('dates')} />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Формат участия" error={errors.format?.message}>
              <select className="input" {...register('format')}>
                <option value="офлайн">Очно</option>
                <option value="онлайн">Онлайн</option>
              </select>
            </Field>
            <Field label="Количество участников" error={errors.participants?.message}>
              <input className="input" type="number" min={1} max={50} {...register('participants')} />
            </Field>
          </div>

          {format === 'офлайн' && (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Количество дней участия" error={undefined}>
                  <input
                    className="input"
                    type="number"
                    min={1}
                    max={10}
                    value={days}
                    onChange={(e) => setDays(Math.max(1, Number(e.target.value) || 1))}
                  />
                </Field>
                <Field label="Проживание" error={errors.accommodation?.message}>
                  <select className="input" {...register('accommodation')}>
                    <option value="без проживания">Без проживания</option>
                    <option value="место в палатке">Место в палатке организатора</option>
                    <option value="своя палатка">Своя палатка</option>
                  </select>
                </Field>
              </div>
              <Field label="Питание" error={errors.meals?.message}>
                <select className="input" {...register('meals')}>
                  <option value="самостоятельно">Самостоятельно</option>
                  <option value="общее меню">Общее меню (оплачивается отдельно)</option>
                </select>
              </Field>
              <label className="flex items-center gap-2 text-sm text-pearl/75">
                <input type="checkbox" className="checkbox" {...register('transferNeeded')} />
                Нужен трансфер
              </label>
            </>
          )}

          <Field label="Комментарий" error={errors.comment?.message}>
            <textarea className="input min-h-[100px]" {...register('comment')} />
          </Field>

          <div className="space-y-2 text-sm">
            <label className="flex items-start gap-2">
              <input type="checkbox" className="checkbox mt-0.5" {...register('agreeRules')} />
              <span>Согласен(на) с правилами участия</span>
            </label>
            {errors.agreeRules && <p className="error">{errors.agreeRules.message}</p>}

            <label className="flex items-start gap-2">
              <input type="checkbox" className="checkbox mt-0.5" {...register('agreePersonalData')} />
              <span>Согласен(на) на обработку персональных данных</span>
            </label>
            {errors.agreePersonalData && <p className="error">{errors.agreePersonalData.message}</p>}

            <label className="flex items-start gap-2">
              <input type="checkbox" className="checkbox mt-0.5" {...register('agreeOffer')} />
              <span>Согласен(на) с условиями публичной оферты</span>
            </label>
            {errors.agreeOffer && <p className="error">{errors.agreeOffer.message}</p>}
          </div>

          {format === 'офлайн' && (
            <div className="pearl-card rounded-xl p-5">
              <p className="text-sm text-pearl/60 mb-1">Итоговая сумма</p>
              <p className="text-3xl font-display text-gradient">{total.toLocaleString('ru-RU')} ₽</p>
              <p className="text-xs text-pearl/45 mt-1">
                Участие ({days} дн. × {participants} чел.) + проживание. Питание и проезд — отдельно.
              </p>
            </div>
          )}

          {serverError && <p className="error">{serverError}</p>}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-fuchsia to-turquoise text-void font-semibold disabled:opacity-60"
          >
            {status === 'submitting'
              ? 'Отправка…'
              : format === 'офлайн' && total > 0
              ? 'Перейти к оплате'
              : 'Отправить заявку'}
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm text-pearl/70 mb-1.5">{label}</span>
      {children}
      {error && <span className="error block mt-1">{error}</span>}
    </label>
  );
}
