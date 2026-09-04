'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { partnerApplicationSchema, type PartnerApplicationInput } from '@/lib/validation';
import SectionHeading from './SectionHeading';
import { Field, SuccessState } from './SpeakerForm';

export default function PartnerForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [applicationId, setApplicationId] = useState('');
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<PartnerApplicationInput>({ resolver: zodResolver(partnerApplicationSchema) });

  const onSubmit = async (data: PartnerApplicationInput) => {
    setStatus('submitting');
    setServerError('');
    try {
      const res = await fetch('/api/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Не удалось отправить заявку');
      setApplicationId(json.id);
      setStatus('success');
      reset();
    } catch (e) {
      setStatus('error');
      setServerError(e instanceof Error ? e.message : 'Ошибка отправки формы');
    }
  };

  if (status === 'success') {
    return (
      <SuccessState
        id="partner-application"
        title="Заявка партнёра"
        applicationId={applicationId}
        onReset={() => setStatus('idle')}
      />
    );
  }

  return (
    <section id="partner-application" className="snap-page relative py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Партнёрам и организациям"
          title="Заявка партнёра"
          description="Расскажите о своей организации и предложении по сотрудничеству."
        />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <input type="text" className="hidden" tabIndex={-1} autoComplete="off" {...register('website')} />

          <Field label="Организация" error={errors.org?.message}><input className="input" {...register('org')} /></Field>
          <Field label="Представитель" error={errors.representative?.message}><input className="input" {...register('representative')} /></Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Электронная почта" error={errors.email?.message}><input className="input" type="email" {...register('email')} /></Field>
            <Field label="Телефон" error={errors.phone?.message}><input className="input" type="tel" {...register('phone')} /></Field>
          </div>
          <Field label="Сайт" error={errors.siteUrl?.message}><input className="input" {...register('siteUrl')} /></Field>
          <Field label="Направление деятельности" error={errors.activity?.message}>
            <textarea className="input min-h-[80px]" {...register('activity')} />
          </Field>
          <Field label="Формат сотрудничества" error={errors.cooperationFormat?.message}>
            <textarea className="input min-h-[80px]" {...register('cooperationFormat')} />
          </Field>
          <Field label="Ресурсы или вклад" error={errors.contribution?.message}>
            <textarea className="input min-h-[80px]" {...register('contribution')} />
          </Field>
          <Field label="Желаемый результат" error={errors.expectedResult?.message}>
            <textarea className="input min-h-[80px]" {...register('expectedResult')} />
          </Field>
          <Field label="Ссылка на презентацию или файл" error={errors.presentationUrl?.message}>
            <input className="input" {...register('presentationUrl')} />
          </Field>
          <Field label="Комментарий" error={errors.comment?.message}>
            <textarea className="input min-h-[80px]" {...register('comment')} />
          </Field>

          {serverError && <p className="error">{serverError}</p>}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full px-6 py-3 rounded-full border border-gold text-gold font-semibold hover:bg-gold/10 transition-colors disabled:opacity-60"
          >
            {status === 'submitting' ? 'Отправка…' : 'Отправить заявку партнёра'}
          </button>
        </form>
      </div>
    </section>
  );
}
