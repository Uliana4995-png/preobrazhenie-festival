import SacredSigil from './SacredSigil';
import FernFrame from './FernFrame';

/**
 * Общая "рамка" раздела: ведущий сакральный символ за текстом +
 * природное обрамление сверху/снизу. Используется во всех крупных
 * разделах, чтобы визуальный язык был единым по всему сайту.
 */
export default function SectionBackdrop({
  sigil,
  sigilPosition = 'right'
}: {
  sigil: string;
  sigilPosition?: 'left' | 'right' | 'center';
}) {
  const posClass =
    sigilPosition === 'left'
      ? 'left-[2%] top-1/2 -translate-y-1/2'
      : sigilPosition === 'center'
      ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
      : 'right-[2%] top-1/2 -translate-y-1/2';

  return (
    <>
      <FernFrame position="top" />
      <FernFrame position="bottom" />
      <SacredSigil type={sigil} className={`absolute ${posClass} text-pearl fx-medium pointer-events-none z-[1]`} />
    </>
  );
}
