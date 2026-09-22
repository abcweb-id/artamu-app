import { vars } from 'nativewind';

/**
 * Satu-satunya tempat nilai warna. Kelas Tailwind (bg-primary, text-muted, ...) membaca
 * variabel CSS yang dibuat dari sini, dan kode di luar className (tab bar, status bar)
 * mengimpor objek ini langsung.
 */
export const palette = {
  light: {
    primary: '#0E6B53',
    'on-primary': '#FFFFFF',
    secondary: '#2DB87D',
    accent: '#F6B93B',
    canvas: '#F8FAF9',
    surface: '#FFFFFF',
    text: '#1F2937',
    muted: '#64707F',
    line: '#E2E8E5',
    'primary-soft': '#DDF3E9',
    'primary-ink': '#0A4F3D',
    income: '#12805A',
    expense: '#C4554B',
  },
  dark: {
    primary: '#5FD0A0',
    // Putih di atas hijau muda terlalu pucat, jadi mode gelap memakai teks gelap.
    'on-primary': '#111216',
    secondary: '#2DB87D',
    accent: '#F6B93B',
    canvas: '#111216',
    surface: '#16171C',
    text: '#ECEDF2',
    muted: '#9A9CAB',
    line: '#26282F',
    'primary-soft': '#12382D',
    'primary-ink': '#5FD0A0',
    income: '#6FCF9F',
    expense: '#F0938A',
  },
} as const;

export type Scheme = keyof typeof palette;
export type ColorToken = keyof (typeof palette)['light'];

function hexToRgbChannels(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

export const themeVars = {
  light: vars(
    Object.fromEntries(
      Object.entries(palette.light).map(([k, v]) => [`--color-${k}`, hexToRgbChannels(v)]),
    ),
  ),
  dark: vars(
    Object.fromEntries(
      Object.entries(palette.dark).map(([k, v]) => [`--color-${k}`, hexToRgbChannels(v)]),
    ),
  ),
};

/**
 * Delapan pasangan warna kategori dari pedoman ikon: latar pastel dan warna ikon.
 * Merah tidak dipakai karena berarti pengeluaran. Pengguna hanya memilih dari daftar ini.
 */
export const categoryColors = {
  green: { bg: '#DDF3E9', fg: '#0A4F3D' },
  orange: { bg: '#FCE8D5', fg: '#B86B1F' },
  blue: { bg: '#DCEBFA', fg: '#2F6CA8' },
  purple: { bg: '#F3E1F0', fg: '#8C4A83' },
  yellow: { bg: '#FBF0CF', fg: '#94701A' },
  pink: { bg: '#FBE0E6', fg: '#A8456A' },
  indigo: { bg: '#E2E6F5', fg: '#4A568F' },
  neutral: { bg: '#ECE8E2', fg: '#6B675F' },
} as const;

export type CategoryColor = keyof typeof categoryColors;
