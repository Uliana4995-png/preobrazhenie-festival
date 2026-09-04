import type { Metadata } from 'next';
import { Unbounded, Manrope } from 'next/font/google';
import './globals.css';
import { getSiteConfig, getAppearance } from '@/lib/content';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import AnalyticsScripts from '@/components/AnalyticsScripts';
import CosmosBackground from '@/components/visuals/CosmosBackground';
import IntroSplash from '@/components/IntroSplash';

const displayFont = Unbounded({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-display',
  weight: ['500', '600', '700', '800']
});

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700', '800']
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://preobrazhenie-festival.ru';

  return {
    metadataBase: new URL(siteUrl),
    title: site.seo.title,
    description: site.seo.description,
    openGraph: {
      title: site.seo.title,
      description: site.seo.description,
      url: siteUrl,
      siteName: site.title,
      locale: 'ru_RU',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: site.seo.title,
      description: site.seo.description
    }
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [site, appearance] = await Promise.all([getSiteConfig(), getAppearance()]);

  return (
    <html lang="ru" className={`${displayFont.variable} ${manrope.variable}`} data-fx={appearance.effectsLevel}>
      <body className="font-body bg-void text-pearl antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-turquoise focus:text-void focus:px-4 focus:py-2 focus:rounded"
        >
          Перейти к содержимому
        </a>
        <CosmosBackground appearance={appearance} />
        {appearance.introSplash.enabled && <IntroSplash site={site} config={appearance.introSplash} />}
        <SiteHeader site={site} />
        <main id="main-content" className="snap-book">
          {children}
        </main>
        <SiteFooter site={site} />
        <AnalyticsScripts />
      </body>
    </html>
  );
}
