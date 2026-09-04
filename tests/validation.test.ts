import { describe, it, expect } from 'vitest';
import { registrationSchema, speakerApplicationSchema, partnerApplicationSchema } from '../lib/validation';

describe('registrationSchema', () => {
  const validBase = {
    firstName: 'Анна',
    lastName: 'Иванова',
    phone: '+79001234567',
    email: 'anna@example.com',
    telegram: '@anna',
    city: 'Москва, Россия',
    dates: '20-24 сентября',
    format: 'офлайн' as const,
    participants: 2,
    accommodation: 'место в палатке' as const,
    meals: 'самостоятельно' as const,
    transferNeeded: false,
    comment: '',
    agreeRules: true as const,
    agreePersonalData: true as const,
    agreeOffer: true as const,
    website: ''
  };

  it('accepts a valid registration', () => {
    const result = registrationSchema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it('rejects a registration missing required consent', () => {
    const result = registrationSchema.safeParse({ ...validBase, agreeRules: undefined });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = registrationSchema.safeParse({ ...validBase, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects when honeypot field is filled', () => {
    // Схема сама по себе не блокирует непустой honeypot (это делает API-роут),
    // но проверяем, что поле обязано быть максимум пустой строкой длины 0.
    const result = registrationSchema.safeParse({ ...validBase, website: 'bot-value' });
    expect(result.success).toBe(false);
  });
});

describe('speakerApplicationSchema', () => {
  it('requires publish consent', () => {
    const result = speakerApplicationSchema.safeParse({
      name: 'Иван Петров',
      role: 'Исследователь',
      org: '',
      topic: 'Сакральная геометрия',
      description: 'Краткое описание',
      bio: 'Биография спикера',
      links: '',
      format: 'офлайн',
      preferredDate: '',
      techRequirements: '',
      email: 'ivan@example.com',
      phone: '+79001112233',
      agreePublish: undefined,
      website: ''
    });
    expect(result.success).toBe(false);
  });
});

describe('partnerApplicationSchema', () => {
  it('accepts a minimal valid partner application', () => {
    const result = partnerApplicationSchema.safeParse({
      org: 'Экоцентр',
      representative: 'Мария Смирнова',
      email: 'maria@example.com',
      phone: '+79005556677',
      siteUrl: '',
      activity: 'Экологическое просвещение',
      cooperationFormat: 'Совместная мастерская',
      contribution: '',
      expectedResult: '',
      presentationUrl: '',
      comment: '',
      website: ''
    });
    expect(result.success).toBe(true);
  });
});
