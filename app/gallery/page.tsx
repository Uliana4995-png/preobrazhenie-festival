import { getGallery } from '@/lib/content';
import GalleryBook from '@/components/GalleryBook';
import SacredSigil from '@/components/visuals/SacredSigil';

export const metadata = { title: 'Галерея — Форум-Фестиваль «Преображение»' };

export default async function GalleryPage() {
  const images = await getGallery();

  return (
    <section className="relative py-24 sm:py-32">
      <SacredSigil type="dotcircle" size={380} className="absolute left-[3%] top-[8%] text-pearl fx-medium pointer-events-none z-[1]" />
      <div className="relative z-[3] mx-auto max-w-5xl px-5 sm:px-8">
        <p className="text-sm text-gold mb-2">Галерея</p>
        <h1 className="heading-loft text-3xl sm:text-5xl mb-3">Атмосфера фестиваля</h1>
        <p className="text-pearl/60 text-sm mb-10 max-w-xl">
          Реальные фотографии места и концептуальные визуализации отмечены отдельно. Изображения и порядок
          галереи редактируются организатором в административной панели.
        </p>
        <GalleryBook images={images} />
      </div>
    </section>
  );
}
