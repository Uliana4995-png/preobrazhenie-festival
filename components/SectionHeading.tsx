export default function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl mb-10">
      {eyebrow && <p className="text-sm text-gold mb-2">{eyebrow}</p>}
      <h2 className="heading-loft text-3xl sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-pearl/70">{description}</p>}
      <div className="rule-gold mt-6 w-24" />
    </div>
  );
}
