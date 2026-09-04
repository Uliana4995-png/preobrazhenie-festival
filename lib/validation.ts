import { z } from 'zod';

/**
 * Серверные схемы валидации для всех форм сайта.
 * Используются и на клиенте (react-hook-form + @hookform/resolvers/zod),
 * и повторно на сервере в API-маршрутах — так злоумышленник не может
 * обойти проверку, отправив запрос напрямую в API, минуя форму.
 */

export const registrationSchema = z.object({
  firstName: z.string().trim().min(1, 'Укажите имя').max(80),
  lastName: z.string().trim().min(1, 'Укажите фамилию').max(80),
  phone: z.string().trim().min(5, 'Укажите телефон').max(30),
  email: z.string().trim().email('Некорректный email').max(120),
  telegram: z.string().trim().max(80).optional().or(z.literal('')),
  city: z.string().trim().min(1, 'Укажите город и страну').max(120),
  dates: z.string().trim().min(1, 'Выберите даты участия').max(200),
  format: z.enum(['офлайн', 'онлайн']),
  participants: z.coerce.number().int().min(1).max(50),
  accommodation: z.enum(['без проживания', 'место в палатке', 'своя палатка']),
  meals: z.enum(['самостоятельно', 'общее меню']),
  transferNeeded: z.boolean().default(false),
  comment: z.string().trim().max(2000).optional().or(z.literal('')),
  agreeRules: z.literal(true, { errorMap: () => ({ message: 'Необходимо согласие с правилами' }) }),
  agreePersonalData: z.literal(true, {
    errorMap: () => ({ message: 'Необходимо согласие на обработку персональных данных' })
  }),
  agreeOffer: z.literal(true, { errorMap: () => ({ message: 'Необходимо согласие с публичной офертой' }) }),
  website: z.string().max(0).optional().or(z.literal('')) // honeypot anti-spam field, must stay empty
});
export type RegistrationInput = z.infer<typeof registrationSchema>;

export const speakerApplicationSchema = z.object({
  name: z.string().trim().min(1, 'Укажите имя').max(120),
  role: z.string().trim().min(1, 'Укажите должность').max(160),
  org: z.string().trim().max(160).optional().or(z.literal('')),
  topic: z.string().trim().min(1, 'Укажите тему выступления').max(200),
  description: z.string().trim().min(1, 'Добавьте краткое описание').max(2000),
  bio: z.string().trim().min(1, 'Добавьте биографию').max(3000),
  links: z.string().trim().max(500).optional().or(z.literal('')),
  format: z.enum(['офлайн', 'онлайн', 'на усмотрение организатора']),
  preferredDate: z.string().trim().max(40).optional().or(z.literal('')),
  techRequirements: z.string().trim().max(1000).optional().or(z.literal('')),
  email: z.string().trim().email('Некорректный email').max(120),
  phone: z.string().trim().min(5, 'Укажите телефон').max(30),
  agreePublish: z.literal(true, {
    errorMap: () => ({ message: 'Необходимо согласие на публикацию материалов' })
  }),
  website: z.string().max(0).optional().or(z.literal(''))
});
export type SpeakerApplicationInput = z.infer<typeof speakerApplicationSchema>;

export const partnerApplicationSchema = z.object({
  org: z.string().trim().min(1, 'Укажите организацию').max(160),
  representative: z.string().trim().min(1, 'Укажите представителя').max(120),
  email: z.string().trim().email('Некорректный email').max(120),
  phone: z.string().trim().min(5, 'Укажите телефон').max(30),
  siteUrl: z.string().trim().max(200).optional().or(z.literal('')),
  activity: z.string().trim().min(1, 'Укажите направление деятельности').max(300),
  cooperationFormat: z.string().trim().min(1, 'Укажите формат сотрудничества').max(300),
  contribution: z.string().trim().max(1000).optional().or(z.literal('')),
  expectedResult: z.string().trim().max(1000).optional().or(z.literal('')),
  presentationUrl: z.string().trim().max(300).optional().or(z.literal('')),
  comment: z.string().trim().max(2000).optional().or(z.literal('')),
  website: z.string().max(0).optional().or(z.literal(''))
});
export type PartnerApplicationInput = z.infer<typeof partnerApplicationSchema>;

export const paymentCreateSchema = z.object({
  packageId: z.string().min(1),
  amount: z.coerce.number().positive(),
  registrationId: z.string().min(1),
  description: z.string().min(1).max(200)
});
export type PaymentCreateInput = z.infer<typeof paymentCreateSchema>;
