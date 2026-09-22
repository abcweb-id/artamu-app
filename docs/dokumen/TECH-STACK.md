# Artamu, tumpukan teknologi

Dokumen ini mencatat teknologi yang dipakai aplikasi Artamu dan alasan di balik tiap pilihan. Simpan di repo sebagai `docs/TECH-STACK.md` dan perbarui setiap kali ada keputusan teknis yang berubah.

Status: rencana, sebelum rilis 0.9. September 2026.

## Di mana semua ini "disimpan"

Tidak ada satu tempat. Tiap jenis keputusan punya rumahnya sendiri di repo, dan dokumen ini hanya peta yang menunjuk ke sana.

| Yang dicari | Sumber kebenaran |
|---|---|
| Library apa saja dan versi berapa | `package.json` dan `package-lock.json` |
| Nama aplikasi, ikon, layar pembuka, izin, plugin native | `app.json` (atau `app.config.ts`) |
| Warna, font, radius, jarak | `tailwind.config.js`, atau `global.css` kalau memakai Tailwind v4 |
| Berkas font dan cara memuatnya | `assets/fonts/` dan `app/_layout.tsx` |
| Struktur tabel dan migrasi | `src/db/schema.ts` dan `src/db/migrations/` |
| Teks antarmuka | `src/i18n/id.json`, nanti `en.json` |
| Profil build dan kanal pembaruan | `eas.json` |
| Alasan di balik keputusan | `docs/TECH-STACK.md` (dokumen ini) dan `docs/keputusan/` |
| Aturan merek | Pedoman merek Artamu |
| Berkas logo dan ikon | `assets/brand/` |
| Urutan fitur per rilis | Peta rilis Artamu |

Aturan main: nomor versi tidak ditulis di dokumen ini, karena cepat basi. Kalau ingin tahu versi yang terpasang, lihat `package.json`.

## Ringkasan pilihan

| Lapisan | Pilihan | Catatan |
|---|---|---|
| Kerangka | Expo (React Native) dengan TypeScript | Arsitektur baru dan mesin Hermes, bawaan Expo |
| Navigasi | Expo Router | Berbasis berkas, mirip `pages/` di Nuxt |
| Gaya | NativeWind dengan Tailwind CSS | Lihat catatan versi di bawah |
| Font merek | Plus Jakarta Sans | Saldo, nominal, judul, logo teks |
| Font isi | Roboto bawaan Android | Tidak perlu dipasang |
| Ikon | Phosphor Icons | Terpasang lewat `src/components/ui/icon.tsx`. Punya bobot garis, isi, dan duotone |
| Database | SQLite lewat `expo-sqlite` | Lokal, tanpa server |
| State global | Zustand | Rasanya paling dekat dengan Pinia |
| Formulir | `react-hook-form` dengan `zod` | Validasi satu sumber |
| Daftar panjang | `SectionList`, pindah ke FlashList bila perlu | Judul tanggal menempel sudah bawaan |
| Lembar bawah | `@gorhom/bottom-sheet` | Sudah menangani keyboard |
| Animasi dan gestur | Reanimated dan Gesture Handler | Ikut terpasang bersama Expo Router |
| Grafik | `react-native-svg`, digambar sendiri | Grafiknya sederhana, tidak perlu library grafik |
| Build dan rilis | EAS Build dan EAS Update | Perbaikan kecil tanpa menunggu review toko |
| Cloud, rilis 2.0 | Supabase | Masuk dengan Google dan kode OTP email |

## Fondasi

**Expo dengan development build.** Expo Go cukup untuk minggu-minggu pertama. Begitu memakai modul native di luar Expo Go (widget, masuk dengan Google), pindah ke development build lewat EAS. Selalu pasang paket dengan `npx expo install`, bukan `npm install`, supaya versinya cocok dengan SDK yang dipakai.

**TypeScript** dengan mode ketat sejak awal. Tipe untuk baris database diturunkan dari skema, tidak ditulis dua kali.

**Expo Router** untuk navigasi: grup `(tabs)` untuk lima menu bawah, grup `(auth)` dan `(onboarding)` untuk alur tanpa bottom bar. Tombol tambah di tengah didaftarkan sebagai tab yang aksi tekannya dicegat untuk membuka lembar input.

## Gaya dan merek

**NativeWind.** Saat dokumen ini ditulis, NativeWind 5 (berbasis Tailwind 4) sedang dalam proses dipromosikan menjadi versi stabil, sementara NativeWind 4 (berbasis Tailwind 3.4) adalah versi yang selama ini dipakai di produksi. Aturannya saat memulai proyek: pakai apa pun yang sedang berlabel `latest` di npm, jangan versi pratinjau. Perbedaannya untuk kita hanya tempat token ditulis, `tailwind.config.js` di versi 4 atau `global.css` di versi 5. Nilai tokennya sama.

**Token warna**, contoh untuk `tailwind.config.js`:

```js
colors: {
  primary: '#0E6B53',
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
fontFamily: {
  display: ['PlusJakartaSans_700Bold'],
  'display-xb': ['PlusJakartaSans_800ExtraBold'],
  body: ['System'],
},
borderRadius: { chip: '8px', card: '20px', pill: '999px' },
```

Mode gelap memakai pasangan token yang sama dengan nilai berbeda. Jangan menulis kode heksa langsung di komponen.

**Font.** Plus Jakarta Sans dipasang lewat `@expo-google-fonts/plus-jakarta-sans` dan dimuat dengan `useFonts` di `app/_layout.tsx`, dengan layar pembuka ditahan sampai font siap. Bobot yang dibutuhkan hanya tiga: 600, 700, dan 800. Roboto tidak dipasang, karena itu font sistem Android. Pembagian pemakaiannya ada di pedoman merek: font merek untuk angka dan judul, font sistem untuk sisanya.

**Berkas merek.** Empat berkas resmi di `assets/brand/`: susunan vertikal (utama), horizontal, simbol saja, dan ikon aplikasi berlatar hijau sangat tua. Ditambah dua siluet satu warna, putih dan gelap. Semuanya masih PNG; versi vektor diminta dari perancang untuk ikon adaptif Android dan cetak besar.

**Ikon.** `phosphor-react-native`, dipakai lewat komponen `Icon` di `src/components/ui/icon.tsx`. Nama ikon mengikuti prototipe (`home`, `bolt`, `wallet`, dan seterusnya), gambarnya dari Phosphor. Setiap ikon diimpor dari `phosphor-react-native/src/icons/<Nama>`, bukan dari akar paket, supaya ribuan ikon lain tidak masuk bundle. Bobot bawaan `regular`; `fill` dan `duotone` tersedia lewat prop `weight`. Ketebalan garis 1,5 mengikuti bobot `regular` Phosphor, dan pedoman ikon sudah disesuaikan.

Ikon kategori disimpan di database sebagai nama ikon, bukan gambar. Nama itu jangan diubah setelah ada pengguna, karena tersimpan di kolom `icon` pada tabel `categories`.

**Bobot ikon.** Ikon antarmuka memakai `regular` (garis). Tab aktif di bottom bar memakai `bold` dan warna utama; tab lain tetap `regular`. Ikon kategori memakai `fill` agar tegas dari jauh; warnanya tetap mengikuti token, jadi mode gelap dan kategori buatan pengguna tetap jalan.

**Ikon berupa PNG berwarna ditolak.** Tidak bisa mengikuti mode gelap, butuh tiga ukuran berkas per ikon, dan warna kategori buatan pengguna tidak bisa diterapkan karena sudah terkunci di gambar. Untuk daftar transaksi yang panjang, ikon penuh warna juga bersaing dengan nominal, padahal itu yang perlu dibaca lebih dulu.

**Tanpa bayangan.** Kedalaman dibangun dari warna latar dan garis tepi. Satu-satunya pengecualian adalah tombol tambah di bottom bar.

## Data

**SQLite lewat `expo-sqlite`.** Boleh ditambah Drizzle ORM agar skema dan tipe berasal dari satu berkas dan migrasi dibuat otomatis. Ini pilihan kenyamanan, bukan keharusan.

Aturan skema yang berlaku untuk semua tabel:

- Kunci utama berupa UUID yang dibuat di ponsel, bukan angka berurutan.
- Kolom `created_at`, `updated_at`, dan `deleted_at`. Menghapus berarti mengisi `deleted_at`.
- Nominal disimpan sebagai bilangan bulat rupiah, tidak pernah pecahan.
- Rujukan memakai ID, tidak pernah nama. Ganti nama dompet cukup mengubah satu baris.
- Saldo tidak disimpan. Saldo adalah jumlah transaksi, termasuk transaksi saldo awal dan penyesuaian.
- Transfer adalah dua baris transaksi dengan `pair_id` yang sama.
- Kategori punya `parent_id` yang boleh kosong, untuk subkategori.
- Progres anggaran dan angka laporan selalu dihitung dengan query, tidak disimpan.

**Penyimpanan di luar database:**

| Isi | Tempat |
|---|---|
| Hash PIN, waktu berakhirnya kunci PIN, token sesi cloud | `expo-secure-store` |
| Bahasa, mode gelap, jam pengingat, dompet aktif, petunjuk yang sudah dilihat | Tabel `settings` di SQLite, supaya ikut tercadangkan |
| Foto struk | `expo-file-system`, di folder dokumen aplikasi |

**Cadangan.** Ekspor semua tabel dan `settings` ke satu berkas JSON yang memuat nomor versi skema. Dibagikan lewat `expo-sharing`, dipilih kembali lewat `expo-document-picker`.

## Fitur perangkat

| Kebutuhan | Paket |
|---|---|
| Sidik jari | `expo-local-authentication` |
| Pengingat dan notifikasi lokal | `expo-notifications` |
| Pemilih tanggal dan jam | `@react-native-community/datetimepicker` |
| Foto struk | `expo-image-picker` dan `expo-image-manipulator` untuk mengecilkan |
| Bahasa perangkat dan format angka | `expo-localization`, `i18next`, dan `Intl` |
| Nomor versi di layar Tentang | `expo-application` |
| Ajakan memberi nilai | `expo-store-review` |
| Pintasan ikon aplikasi | `expo-quick-actions` |
| Widget layar utama | `react-native-android-widget`, butuh development build |
| Getaran halus | `expo-haptics` |

Transaksi rutin tidak memakai tugas latar belakang sebagai andalan. Logikanya "kejar ketertinggalan saat aplikasi dibuka", dengan kunci unik jadwal dan periode agar tidak tercatat ganda.

## Rilis

- **EAS Build** untuk membuat berkas AAB, dengan tiga profil di `eas.json`: `development`, `preview`, dan `production`.
- **EAS Update** untuk perbaikan JavaScript tanpa menunggu review Play Store.
- **Play Console**: jalur uji internal untuk 0.9, lalu uji tertutup, lalu produksi.
- **Pelaporan crash**: Sentry, dengan data keuangan tidak pernah ikut terkirim.
- **Analitik**: keputusan terbuka. Peta rilis memakai ukuran seperti retensi hari ke-7, yang butuh pengukuran, sementara janji merek adalah tidak memakai data pengguna. Jalan tengahnya analitik anonim yang bisa dimatikan, hanya menghitung kejadian seperti "aplikasi dibuka" dan "transaksi dicatat", tanpa nominal dan tanpa isi catatan.

## Cloud, rilis 2.0

Supabase untuk autentikasi (Google dan kode OTP email) serta Postgres. Sinkronisasi memakai `updated_at` dengan aturan versi terbaru menang, dan lembar konflik hanya muncul kalau dua perangkat mengubah baris yang sama saat sama-sama luring. TanStack Query baru masuk di rilis ini, untuk panggilan ke server.

Rilis antara yang layak dipertimbangkan: cadangan otomatis ke folder aplikasi di Google Drive pengguna, yang memberi sebagian besar manfaat tanpa server.

## Struktur folder

```
app/                 rute Expo Router
  (onboarding)/
  (auth)/
  (tabs)/
  _layout.tsx        memuat font, tema, dan database
src/
  components/        komponen antarmuka bersama
  features/          transaksi, dompet, kategori, anggaran, dan lainnya
  db/                skema, migrasi, query
  stores/            Zustand
  i18n/              berkas terjemahan
  lib/               format rupiah, tanggal, UUID
  theme/             token yang dipakai di luar className
assets/
  fonts/  images/  icon/
docs/
  TECH-STACK.md
  keputusan/         satu berkas pendek per keputusan penting
```

## Catatan keputusan

Setiap keputusan yang sulit dibalik dicatat di `docs/keputusan/` sebagai berkas pendek: konteks, pilihan yang diambil, alternatif yang ditolak, dan akibatnya. Beberapa yang sudah diputuskan selama perancangan:

1. Expo dengan NativeWind, bukan Flutter, karena latar belakang Vue dan Tailwind membuat perpindahan ke React lebih murah daripada belajar Dart.
2. Lokal dulu, cloud opsional. Aplikasi harus berfungsi penuh tanpa akun.
3. Dompet terisolasi di tampilan, tapi satu tabel transaksi dengan `wallet_id`.
4. Bulan kalender sebagai periode. Kebutuhan periode gajian dijawab dengan laporan rentang tanggal.
5. Anggaran bersifat lintas dompet, berupa beberapa anggaran bernama dengan cakupan kategori.
6. Subkategori maksimal dua tingkat dan opsional.
7. Tekan tahan untuk aksi cepat, bukan geser, karena gestur kembali Android.
8. Atur ulang kata sandi dengan kode OTP email, bukan tautan.
9. Tanpa bayangan, ornamen maksimal dua bentuk per kartu.
10. Ikon memakai library pihak ketiga berformat SVG, bukan PNG berwarna dan bukan gambar buatan sendiri. Yang digambar sendiri hanya ilustrasi layar kosong dan onboarding, karena di situlah karakter merek terbentuk.
11. Gratis penuh tanpa iklan sampai jumlah pengguna stabil. Paywall tidak dirancang sekarang karena paywall tanpa pengguna hampir selalu meleset. Lihat bagian Monetisasi di bawah.
12. Garis ikon 1,5 mengikuti Phosphor `regular`. Tab aktif memakai `bold`, ikon kategori memakai `fill`, ikon lain `regular`.

## Monetisasi

**Keputusan sekarang: gratis penuh, tanpa iklan, tanpa fitur berbayar.** Fitur berbayar dipertimbangkan setelah aplikasi stabil dan jumlah pengguna cukup, dengan permintaan pengguna sebagai penentu utamanya, bukan tebakan di awal.

**Tidak ada persiapan teknis yang dibutuhkan sekarang.** Status berbayar nanti cukup satu kunci `plan` di tabel `settings` yang sudah ada, berisi `free` atau `pro`. Tanpa tabel baru dan tanpa migrasi.

**Janji yang harus dijaga.** Halaman produk dan syarat penggunaan menulis "semua fitur yang ada sekarang gratis", bukan "gratis selamanya", sehingga menambah fitur berbayar nanti tidak mengingkari apa pun. Syarat penggunaan juga menyebut fitur yang sudah gratis tidak akan dijadikan berbayar bagi pengguna yang sudah memakainya. Artinya: yang dijual nanti harus fitur **baru**, bukan fitur yang sudah ada lalu dikunci. Pengguna awal dan 12 penguji pertama sebaiknya diberi status berbayar seumur hidup.

**Yang tidak boleh dikunci, apa pun yang terjadi:** alur mencatat, jumlah transaksi, ekspor CSV, dan cadangan ke berkas. Mengunci data pengguna di aplikasi keuangan merusak kepercayaan dan bertentangan dengan janji merek.

### Kandidat fitur berbayar

Diurutkan dari yang paling masuk akal. Nilai sebuah kandidat diukur dari dua hal: apakah ia memakan biaya berjalan, dan apakah hanya dibutuhkan pengguna berat.

| Kandidat | Kenapa layak dijual | Biaya berjalan | Catatan |
|---|---|---|---|
| **Sinkron dan cadangan cloud** | Memakan biaya server tiap bulan, dan menjawab ketakutan nyata kehilangan data | Ada | Paling wajar dijadikan langganan. Sudah dirancang di rilis 2.0 |
| **Berbagi dompet dengan pasangan** | Dua orang mencatat satu dompet rumah tangga. Permintaan yang sangat umum di kategori ini | Ada, butuh cloud | Hanya mungkin setelah 2.0. Perlu aturan siapa boleh mengubah apa |
| **Dashboard web** | Layar lebar untuk laporan dan pengaturan anggaran, sementara mencatat tetap di ponsel | Ada, butuh cloud | Cocok dibangun dengan Nuxt di atas API yang sama |
| **Laporan lanjutan** | Ekspor PDF rapi, tren setahun penuh, bandingkan antar kategori dan antar periode | Tidak ada | Murah dibuat, hanya menarik bagi pengguna berat |
| **Anggaran dan dompet tanpa batas** | Pengguna biasa cukup dua sampai tiga, pengguna berat ingin lebih | Tidak ada | Hati-hati: kalau dibatasi setelah rilis, melanggar janji di atas. Batas hanya boleh untuk dompet atau anggaran yang bentuknya baru |
| **Kategori dan ikon kustom lanjutan** | Ikon dan warna di luar delapan pasangan bawaan | Tidak ada | Nilai jualnya lemah, jangan diandalkan |
| **Tema warna tambahan** | Kosmetik murni | Tidak ada | Nilai jualnya paling lemah, tapi murah dan sering dibeli pengguna setia |
| **Lampiran tanpa batas** | Foto struk dalam jumlah besar, dan nanti ikut tersinkron | Ada bila disinkronkan | Foto jauh lebih besar dari data transaksi |
| **Pengingat pintar** | Notifikasi berbasis pola, misalnya tagihan yang biasanya dibayar minggu ini | Tidak ada | Butuh data beberapa bulan agar berguna |

Pola yang terlihat: **fitur yang paling layak dijual hampir semuanya membutuhkan cloud.** Itu sekaligus alasan kuat menjadikan rilis 2.0 sebagai titik monetisasi, bukan sebelumnya.

### Bentuk harga yang dipertimbangkan

- Sekali bayar untuk fitur luring seperti laporan lanjutan dan tema, karena tidak menimbulkan biaya berjalan.
- Langganan hanya untuk yang memakai server: cloud, berbagi dompet, dashboard web.
- Jangan menjual cloud dengan skema sekali bayar. Biayanya berjalan terus, pendapatannya tidak.
- Google Play mendukung pembayaran lewat pulsa dan e-wallet, dan itu penting untuk konversi di Indonesia.

### Cara mengumpulkan sinyalnya

Menu "Usulkan fitur" di layar Bantuan adalah salurannya. Catat setiap permintaan di satu berkas, tandai bila permintaan yang sama muncul lagi, dan tinjau tiap beberapa bulan. Permintaan berulang untuk sinkron, berbagi dompet, atau ekspor laporan adalah sinyal bahwa waktunya sudah tiba. Permintaan untuk kategori baru atau warna tema berarti belum.

## Yang perlu dicek ulang saat proyek dimulai

- Versi NativeWind yang berlabel `latest`, dan pasangan Tailwind-nya.
- SDK Expo terbaru dan versi React Native yang dibawanya.
- Dukungan `react-native-android-widget` terhadap SDK tersebut.
- Nama paket dan lisensi Phosphor untuk React Native, serta ketersediaan tiap ikon kategori yang dibutuhkan.
- Cara Supabase menangani OTP email dan masuk dengan Google di Expo, karena bagian ini sering diperbarui.
