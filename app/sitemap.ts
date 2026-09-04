import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://preobrazhenie-festival.ru';
  const paths = ['/', '/oferta', '/privacy', '/consent', '/refund', '/rules', '/safety', '/disclaimer'];
  return paths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.4
  }));
}
