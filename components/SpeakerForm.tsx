'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { speakerApplicationSchema, type SpeakerApplicationInput } from '@/lib/validation';
import SectionHeading from './SectionHeading';

export default function SpeakerForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [applicationId, setApplicationId] = useState('');
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<SpeakerApplicationInput>({
    resolver: zodResolver(speakerApplicationSchema),
    defaultValues: { format: 'на усмотрение организатора' }
  });

  const onSubmit = async (data: SpeakerApplicationInput) => {
    setStatus('submitting');
    setServerError('');
    try {
      const res = await fetch('/api/speaker', {
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
        id="speaker-application"
        title="Заявка спикера"
        applicationId={applicationId}
        onReset={() => setStatus('idle')}
      />
    );
  }

  return (
    <section id="speakers-form" className="snap-page relative py-24 sm:py-32" style={{ background: "rgba(28,17,64,0.35)" }}>
      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        <SectionHeading eyebrow="Спикерам" title="Заявка спикера" description="Расскажите о себе и теме вашего выступления." />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <input type="text" className="hidden" tabIndex={-1} autoComplete="off" {...register('website')} />

          <Field label="Имя" error={errors.name?.message}><input className="input" {...register('name')} /></Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Должность" error={errors.role?.message}><input className="input" {...register('role')} /></Field>
            <Field label="Организация" error={errors.org?.message}><input className="input" {...register('org')} /></Field>
          </div>
          <Field label="Тема выступления" error={errors.topic?.message}><input className="input" {...register('topic')} /></Field>
          <Field label="Краткое описание выступления" error={errors.description?.message}>
            <textarea className="input min-h-[90px]" {...register('description')} />
          </Field>
          <Field label="Биография" error={errors.bio?.message}>
            <textarea className="input min-h-[110px]" {...register('bio')} />
          </Field>
          <Field label="Ссылки (сайт, соцсети, видео)" error={errors.links?.message}>
            <input className="input" {...register('links')} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Формат участия" error={errors.format?.message}>
              <select className="input" {...register('format')}>
                <option value="офлайн">Очно</option>
                <option value="онлайн">Онлайн</option>
                <option value="на усмотрение организатора">На усмотрение организатора</option>
              </select>
            </Field>
            <Field label="Желаемая дата" error={errors.preferredDate?.message}>
              <input className="input" placeholder="например, 22 сентября" {...register('preferredDate')} />
            </Field>
          </div>
          <Field label="Технические требования" error={errors.techRequirements?.message}>
            <textarea className="input min-h-[80px]" {...register('techRequirements')} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Электронная почта" error={errors.email?.message}><input className="input" type="email" {...register('email')} /></Field>
            <Field label="Телефон" error={errors.phone?.message}><input className="input" type="tel" {...register('phone')} /></Field>
          </div>

          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="checkbox mt-0.5" {...register('agreePublish')} />
            <span>Согласен(на) на публикацию материалов на сайте фестиваля</span>
          </label>
          {errors.agreePublish && <p className="error">{errors.agreePublish.message}</p>}

          {serverError && <p className="error">{serverError}</p>}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full px-6 py-3 rounded-full border border-turquoise text-turquoise font-semibold hover:bg-turquoise/10 transition-colors disabled:opacity-60"
          >
            {status === 'submitting' ? 'Отправка…' : 'Отправить заявку спикера'}
          </button>
        </form>
      </div>
    </section>
  );
}

export function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm text-pearl/70 mb-1.5">{label}</span>
      {children}
      {error && <span className="error block mt-1">{error}</span>}
    </label>
  );
}

export function SuccessState({
  id,
  title,
  applicationId,
  onReset
}: {
  id: string;
  title: string;
  applicationId: string;
  onReset: () => void;
}) {
  return (
    <section id={id} className="py-20 sm:py-28">
      <div className="mx-auto max-w-xl px-5 sm:px-8 text-center pearl-card rounded-2xl p-10">
        <p className="text-sm text-gold mb-2">{title}</p>
        <h3 className="font-display text-2xl mb-3">Заявка отправлена</h3>
        <p className="text-pearl/70 text-sm mb-1">Номер заявки:</p>
        <p className="font-mono text-turquoise break-all mb-6">{applicationId}</p>
        <p className="text-pearl/60 text-sm mb-6">Организатор свяжется с вами после рассмотрения заявки.</p>
        <button
          type="button"
          onClick={onReset}
          className="px-5 py-2.5 rounded-full border border-gold/40 text-pearl/80 text-sm"
        >
          Отправить ещё одну заявку
        </button>
      </div>
    </section>
  );
}
