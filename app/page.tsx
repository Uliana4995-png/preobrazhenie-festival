import {
  getSiteConfig,
  getProgram,
  getTiming,
  getSpeakers,
  getPricing,
  getPackages,
  getFaq,
  getPractices,
  getCenter,
  getAppearance,
  getActiveTier
} from '@/lib/content';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Location from '@/components/Location';
import Mission from '@/components/Mission';
import ProgramTimeline from '@/components/ProgramTimeline';
import Speakers from '@/components/Speakers';
import Practices from '@/components/Practices';
import Center from '@/components/Center';
import CampfireSection from '@/components/CampfireSection';
import { Packages } from '@/components/Pricing';
import RegistrationForm from '@/components/RegistrationForm';
import SpeakerForm from '@/components/SpeakerForm';
import PartnerForm from '@/components/PartnerForm';
import Faq from '@/components/Faq';
import StructuredData from '@/components/StructuredData';

export default async function HomePage() {
  const [site, program, timing, speakers, pricing, packages, faq, practices, center, appearance] = await Promise.all([
    getSiteConfig(),
    getProgram(),
    getTiming(),
    getSpeakers(),
    getPricing(),
    getPackages(),
    getFaq(),
    getPractices(),
    getCenter(),
    getAppearance()
  ]);

  return (
    <>
      <StructuredData site={site} />
      <Hero site={site} appearance={appearance} />
      {site.sections.about && <About appearance={appearance} />}
      {site.sections.location && <Location site={site} appearance={appearance} />}
      {site.sections.mission && <Mission appearance={appearance} />}
      {site.sections.programTimeline && <ProgramTimeline days={program} timing={timing} appearance={appearance} />}
      {site.sections.speakers && <Speakers speakers={speakers} />}
      {site.sections.practices && <Practices items={practices} />}
      {site.sections.center && <Center center={center} appearance={appearance} />}
      <CampfireSection pricing={pricing} appearance={appearance} />
      {site.sections.packages && <Packages packages={packages} />}
      {site.sections.registration && (
        <RegistrationForm packages={packages} dayPrice={getActiveTier(pricing.tiers)?.price ?? pricing.tiers[0]?.price ?? 1777} />
      )}
      {site.sections.speakerForm && <SpeakerForm />}
      {site.sections.partnerForm && <PartnerForm />}
      {site.sections.faq && <Faq items={faq} appearance={appearance} />}
    </>
  );
}
