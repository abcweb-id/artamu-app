const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

const grouped = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });

/** Nominal selalu bilangan bulat rupiah, tidak pernah pecahan. */
export function formatRupiah(amount: number) {
  return rupiah.format(amount);
}

/** 1850000 -> "1.850.000", untuk isian nominal tanpa awalan Rp. */
export function formatAmount(amount: number) {
  return grouped.format(amount);
}

/** Ambil angka dari teks isian: "1.850.000" -> 1850000. Kosong -> 0. */
export function parseAmount(text: string) {
  const digits = text.replace(/\D/g, '');
  return digits ? Number(digits) : 0;
}
