'use client';

import { useEffect, useState } from 'react';
import type { SiteConfig } from '@/lib/content';
import { Menu, X } from 'lucide-react';

const NAV_ITEMS: { href: string; label: string }[] = [
  { href: '#top', label: 'Приглашение' },
  { href: '#about', label: 'О фестивале' },
  { href: '#program', label: 'Программа' },
  { href: '#speakers', label: 'Спикеры' },
  { href: '#campfire', label: 'Кемпинг' },
  { href: '#pricing', label: 'Стоимость' },
  { href: '#faq', label: 'Вопросы' }
];

export default function SiteHeader({ site }: { site: SiteConfig }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('#top');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const sections = NAV_ITEMS.map((n) => document.querySelector(n.href)).filter(Boolean) as Element[];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive('#' + entry.target.id);
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach((s) => obs.observe(s));

    return () => {
      window.removeEventListener('scroll', onScroll);
      obs.disconnect();
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        scrolled ? 'backdrop-blur border-b border-gold/25' : ''
      }`}
      style={{
        background: scrolled
          ? 'linear-gradient(120deg, rgba(248,244,255,0.08), rgba(28,17,64,0.75))'
          : 'transparent'
      }}
    >
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 flex items-center justify-between h-[72px] gap-4">
        <a href="#top" className="heading-loft text-base shrink-0" style={{ fontSize: 16 }}>
          ✦ Преображение
        </a>

        <nav className="hidden lg:flex items-center gap-2 flex-1 justify-center" aria-label="Основная навигация">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-semibold px-5 py-2.5 rounded-full transition-all"
                style={
                  isActive
                    ? {
                        background: 'linear-gradient(90deg,#FF2BC2,#22E6D2)',
                        color: '#120625',
                        boxShadow: '0 0 18px rgba(255,43,194,0.45)'
                      }
                    : {
                        background: 'linear-gradient(120deg, rgba(255,217,120,0.28), rgba(248,244,255,0.10))',
                        border: '1px solid rgba(255,217,120,0.35)',
                        color: 'var(--c-pearl)'
                      }
                }
              >
                {item.label}
              </a>
            );
          })}
          <a
            href="/explore"
            className="text-sm font-semibold px-5 py-2.5 rounded-full transition-all"
            style={{
              background: 'linear-gradient(120deg, rgba(255,217,120,0.28), rgba(248,244,255,0.10))',
              border: '1px solid rgba(255,217,120,0.35)',
              color: 'var(--c-pearl)'
            }}
          >
            Ещё разделы
          </a>
        </nav>

        <a
          href="#registration"
          className="hidden lg:inline-block text-sm px-5 py-2.5 rounded-full font-bold shrink-0"
          style={{ background: 'linear-gradient(90deg,#FF2BC2,#22E6D2)', color: '#120625' }}
        >
          {site.cta.participate}
        </a>

        <button
          type="button"
          className="lg:hidden text-pearl shrink-0"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="lg:hidden border-t border-gold/25 px-5 py-5 flex flex-col gap-2"
          style={{ background: 'rgba(18,6,37,0.97)' }}
          aria-label="Мобильная навигация"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-3.5 px-4 rounded-2xl text-pearl/90 text-base font-semibold"
              style={{ background: 'rgba(248,244,255,0.06)' }}
            >
              {item.label}
            </a>
          ))}
          <a
            href="/explore"
            onClick={() => setOpen(false)}
            className="py-3.5 px-4 rounded-2xl text-pearl/90 text-base font-semibold"
            style={{ background: 'rgba(248,244,255,0.06)' }}
          >
            Ещё разделы
          </a>
          <a
            href="#registration"
            onClick={() => setOpen(false)}
            className="mt-2 text-center px-4 py-3.5 rounded-full font-bold"
            style={{ background: 'linear-gradient(90deg,#FF2BC2,#22E6D2)', color: '#120625' }}
          >
            {site.cta.participate}
          </a>
        </nav>
      )}
    </header>
  );
}
