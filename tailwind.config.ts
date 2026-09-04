import type { Config } from 'tailwindcss';

/**
 * Design tokens вынесены сюда и в app/globals.css (CSS-переменные),
 * чтобы организатор мог централизованно менять цвета и эффекты —
 * либо здесь при пересборке, либо (интенсивность/включение эффектов)
 * через административную панель, см. content/appearance.json.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#120625',
        indigoDeep: '#1C1140',
        fuchsia: {
          DEFAULT: '#FF2BC2',
          soft: '#c94fc0'
        },
        turquoise: {
          DEFAULT: '#22E6D2',
          deep: '#169e91'
        },
        pearl: '#F8F4FF',
        pearlSoft: '#EADCF7',
        gold: '#FFD978',
        moss: '#486A50',
        crystalBlue: '#8EEBFF'
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif']
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-14px) translateX(6px)' }
        },
        twinkle: {
          '0%, 100%': { opacity: '0.25' },
          '50%': { opacity: '0.9' }
        },
        spinSlow: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' }
        },
        flicker: {
          '0%, 100%': { transform: 'scaleY(1) scaleX(1)', opacity: '1' },
          '50%': { transform: 'scaleY(1.1) scaleX(0.95)', opacity: '0.88' }
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        drift: 'drift 9s ease-in-out infinite',
        twinkle: 'twinkle 3.2s ease-in-out infinite',
        spinSlow: 'spinSlow 160s linear infinite',
        flicker: 'flicker 1.6s ease-in-out infinite',
        fadeUp: 'fadeUp 0.7s ease-out both'
      }
    }
  },
  plugins: []
};

export default config;
