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
