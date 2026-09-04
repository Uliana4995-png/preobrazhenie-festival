import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';

const CONTENT_DIR = path.join(process.cwd(), 'content');

/**
 * Универсальный загрузчик контента сайта.
 *
 * Все тексты, цены, программа и т.д. хранятся в /content/*.json.
 * Организатор может редактировать эти файлы напрямую (через GitHub
 * или через встроенную мини-админку /admin, см. app/api/admin/content),
 * не трогая код компонентов.
 *
 * Если в будущем подключается Supabase (см. README, раздел
 * "Подключение Supabase"), эту функцию можно заменить на запрос
 * к таблице `site_content` без изменения компонентов, которые её вызывают.
 */
export async function readContent<T>(fileName: string): Promise<T> {
  const filePath = path.join(CONTENT_DIR, fileName);
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

export async function writeContent<T>(fileName: string, data: T): Promise<void> {
  const filePath = path.join(CONTENT_DIR, fileName);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

export interface SiteConfig {
  year: number;
  dates: { start: string; end: string; display: string };
  title: string;
  slogan: string;
  subtitle: string;
  location: { region: string; area: string; place: string; mapEmbedUrl: string };
  cta: { participate: string; program: string; speaker: string };
  contacts: { phone: string; email: string; telegram: string; vk: string; address: string };
  streaming: { platformName: string; platformUrl: string; radioUrl: string; videoUrl: string };
  seo: { title: string; description: string; ogImage: string };
  sections: Record<string, boolean>;
}

export interface ProgramDay {
  id: string;
  date: string;
  dateLabel: string;
  title: string;
  theme: string;
  usesBaseTiming: boolean;
  morning: string[];
  day: string[];
  roundtable: string;
  online: string[];
  evening: string[];
  practicalInfo: string;
  calendarSummary: string;
}

export interface TimingItem {
  time: string;
  title: string;
}

export interface Speaker {
  id: string;
  name: string;
  photo: string;
  role: string;
  org: string;
  topic: string;
  description: string;
  day: string;
  format: string;
  status: 'подтверждён' | 'ожидается' | string;
  streamUrl: string;
  recordUrl: string;
}

export interface Package {
  id: string;
  title: string;
  price: number | null;
  priceLabel: string;
  unit: string;
  description: string;
  editableByOrganizer: boolean;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface LegalInfo {
  organizer: Record<string, string>;
  disclaimer: string;
  refundPolicySummary: string;
  lastUpdated: string;
}

export interface AppearanceConfig {
  effectsLevel: 'full' | 'optimized' | 'minimal';
  stars: boolean;
  milkyWay: boolean;
  glowIntensity: number;
  cardOpacity: number;
  mobileLiteMode: boolean;
  colors: { fuchsia: string; gold: string; turquoise: string };
  images: { phoenix: string; mandala: string; campsite: string; dove: string; introVideo: string };
  sectionSigils: Record<string, string>;
  introSplash: { enabled: boolean; skippable: boolean; rememberChoice: boolean };
}

export interface OnlineConfig {
  status: 'эфир идёт' | 'скоро начало' | 'запись' | string;
  currentShow: { title: string; topic: string; speakerName: string; speakerPhoto: string };
  nextEventAt: string;
  links: { talantPlatform: string; radioUrl: string; videoUrl: string };
  chatEmbedUrl: string;
  archive: { title: string; date: string; url: string }[];
  campStream: {
    enabled: boolean;
    title: string;
    description: string;
    status: string;
    videoUrl: string;
    recordingEnabled: boolean;
  };
}

export interface GalleryImage {
  id: string;
  caption: string;
  category: string;
  imageType: 'реальная фотография' | 'концептуальная визуализация' | string;
  url: string;
}

export interface TopicPage {
  slug: string;
  navLabel: string;
  title: string;
  subtitle: string;
  sigil: string;
  sections: { title: string; body: string }[];
  roundtables?: { title: string; description: string }[];
  itemsLabel?: string;
  items?: { title: string; subtitle?: string; description?: string; url?: string }[];
  imageUrl?: string;
  videoUrl?: string;
  note?: string;
}

export const getSiteConfig = () => readContent<SiteConfig>('site.json');
export const getProgram = () => readContent<ProgramDay[]>('program.json');
export const getTiming = () => readContent<{ baseOffline: TimingItem[]; baseOnline: TimingItem[] }>('timing.json');
export const getSpeakers = () => readContent<Speaker[]>('speakers.json');
export const getPricing = () =>
  readContent<{
    headline: string;
    originalPrice: number;
    tiers: { label: string; until: string; price: number }[];
    notes: string[];
    disclaimers: string[];
  }>('pricing.json');
export const getPackages = () => readContent<Package[]>('packages.json');
export const getFaq = () => readContent<FaqItem[]>('faq.json');
export const getLegal = () => readContent<LegalInfo>('legal.json');
export const getPractices = () => readContent<{ title: string; description: string }[]>('practices.json');
export const getCenter = () =>
  readContent<{
    title: string;
    intro: string;
    features: string[];
    researchDisclaimer: string;
    vision: string;
  }>('center.json');
export const getAppearance = () => readContent<AppearanceConfig>('appearance.json');
export const getOnline = () => readContent<OnlineConfig>('online.json');
export const getGallery = () => readContent<GalleryImage[]>('gallery.json');
export const getTopicPages = () => readContent<TopicPage[]>('topic-pages.json');

/** Текущий действующий тариф на сегодняшнюю дату (по списку tiers из pricing.json). */
export function getActiveTier(tiers: { label: string; until: string; price: number }[]) {
  const now = new Date();
  for (const tier of tiers) {
    if (now <= new Date(tier.until + 'T23:59:59')) return tier;
  }
  return tiers[tiers.length - 1] ?? null;
}
