/** Token dari pedoman merek (docs/dokumen/TECH-STACK.md). Jangan menulis kode heksa langsung di komponen. */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        'on-primary': 'rgb(var(--color-on-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        canvas: 'rgb(var(--color-canvas) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        line: 'rgb(var(--color-line) / <alpha-value>)',
        // Latar tombol keypad PIN dan nominal.
        key: 'rgb(var(--color-key) / <alpha-value>)',
        'primary-soft': 'rgb(var(--color-primary-soft) / <alpha-value>)',
        'primary-ink': 'rgb(var(--color-primary-ink) / <alpha-value>)',
        income: 'rgb(var(--color-income) / <alpha-value>)',
        expense: 'rgb(var(--color-expense) / <alpha-value>)',
      },
      fontFamily: {
        display: ['PlusJakartaSans_700Bold'],
        'display-sb': ['PlusJakartaSans_600SemiBold'],
        'display-xb': ['PlusJakartaSans_800ExtraBold'],
        body: ['System'],
      },
      borderRadius: { chip: '8px', card: '20px', pill: '999px' },
    },
  },
  plugins: [],
};
