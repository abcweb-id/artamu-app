# Artamu

Kelola hartamu dengan mudah. Aplikasi Expo (React Native) untuk Android.

```bash
npm install
npx expo start          # dev server
npm run typecheck
npm run lint
```

Struktur:

```
src/app/            rute Expo Router: (onboarding), (auth) kunci PIN, (tabs) lima menu bawah
src/components/     komponen bersama
src/features/       fitur: transaksi, dompet, kategori, anggaran, dan lainnya
src/db/             klien SQLite dan migrasi
src/stores/         Zustand
src/i18n/           teks antarmuka
src/lib/            format rupiah, tanggal, UUID
src/theme/          token warna terang dan gelap
docs/               dokumen perencanaan, prototipe, dan checklist UI (tidak dibundel)
```
