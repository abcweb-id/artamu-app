import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export type NumberLocale = 'id-ID' | 'en-US';

/** Bahasa aplikasi ke format angka: id "1.850.000", en "1,850,000". */
export const numberLocale = (language: string): NumberLocale =>
  language === 'en' ? 'en-US' : 'id-ID';

const formatters: Partial<Record<NumberLocale, Intl.NumberFormat>> = {};
const formatter = (locale: NumberLocale) =>
  (formatters[locale] ??= new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }));

/** 1850000 -> "1.850.000". Nominal selalu bilangan bulat rupiah, tidak pernah pecahan. */
export function formatAmount(amount: number, locale: NumberLocale = 'id-ID') {
  return formatter(locale).format(amount);
}

/** "Rp 1.850.000" seperti di prototipe (spasi biasa setelah Rp). */
export function formatRp(amount: number, locale: NumberLocale = 'id-ID') {
  return `Rp ${formatAmount(amount, locale)}`;
}

/**
 * Pemformat nominal yang mengikuti bahasa aktif. Pakai ini di komponen, bukan formatRp
 * langsung: bahasa menjadi dependensi, jadi React Compiler menghitung ulang saat bahasa diganti.
 */
export function useMoneyFormat() {
  const { i18n } = useTranslation();
  const locale = numberLocale(i18n.language);
  return useMemo(
    () => ({
      locale,
      amount: (n: number) => formatAmount(n, locale),
      rp: (n: number) => formatRp(n, locale),
    }),
    [locale],
  );
}

/** Ambil angka dari teks isian: "1.850.000" atau "1,850,000" -> 1850000. Kosong -> 0. */
export function parseAmount(text: string) {
  const digits = text.replace(/\D/g, '');
  return digits ? Number(digits) : 0;
}
