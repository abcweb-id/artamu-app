/** Tanggal lokal dalam format YYYY-MM-DD, sesuai CHECK di skema. */
export function toDateString(d: Date = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function nowISO() {
  return new Date().toISOString();
}

/** "Hari ini", "Kemarin", atau "16 Sep" untuk tanggal YYYY-MM-DD. */
export function relativeDayLabel(
  date: string,
  today: string,
  labels: { today: string; yesterday: string },
  locale: string,
) {
  if (date === today) return labels.today;
  const d = new Date(`${date}T00:00:00`);
  const t = new Date(`${today}T00:00:00`);
  if (t.getTime() - d.getTime() === 86_400_000) return labels.yesterday;
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(d);
}

/** Nama bulan panjang dari tanggal YYYY-MM-DD, digeser sejumlah bulan: "Agustus". */
export function monthName(date: string, locale: string, offset = 0) {
  const d = new Date(`${date}T00:00:00`);
  d.setDate(1);
  d.setMonth(d.getMonth() + offset);
  return new Intl.DateTimeFormat(locale, { month: 'long' }).format(d);
}

/** Awal dan akhir bulan untuk tanggal YYYY-MM-DD, digeser sejumlah bulan. */
export function monthRange(date: string, offset = 0) {
  const d = new Date(`${date.slice(0, 7)}-01T00:00:00`);
  d.setMonth(d.getMonth() + offset);
  const first = toDateString(d);
  const days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  return { from: first, to: `${first.slice(0, 8)}${String(days).padStart(2, '0')}`, days };
}
