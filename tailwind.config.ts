import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        forest: { DEFAULT: '#1B3A2D', light: '#2E6B52', dark: '#0F2318', ink: '#0D1F16' },
        gold: { DEFAULT: '#C9943A', light: '#E4B96B', pale: '#F5E6C8' },
        cream: { DEFAULT: '#F8F3EB', dark: '#EDE5D6', border: '#D9D0C0' },
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.07)',
        modal: '0 8px 40px rgba(0,0,0,0.18)',
        nav: '0 2px 20px rgba(0,0,0,0.18)',
      },
    },
  },
  plugins: [],
}

export default config
