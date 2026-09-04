import type { SiteConfig } from '@/lib/content';

export default function StructuredData({ site }: { site: SiteConfig }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://preobrazhenie-festival.ru';

  const eventLd = {
    '@context': 'https://schema.org',
    '@type': 'Festival',
    name: site.title,
    startDate: site.dates.start,
    endDate: site.dates.end,
    eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: site.location.place,
      address: `${site.location.area}, ${site.location.region}`
    },
    description: site.seo.description,
    url: siteUrl
  };

  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.title,
    url: siteUrl,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: site.contacts.phone,
      email: site.contacts.email,
      contactType: 'customer service'
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
    </>
  );
}
