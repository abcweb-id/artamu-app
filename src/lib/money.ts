const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

/** Nominal selalu bilangan bulat rupiah, tidak pernah pecahan. */
export function formatRupiah(amount: number) {
  return rupiah.format(amount);
}
