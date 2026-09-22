# Artamu, paket berkas

Diperbarui 21 September 2026. Semua berkas berdiri sendiri, tidak ada proses build.

## situs-produk/   → untuk dipasang di artamu.id
Tiga halaman publik. Unggah folder ini ke Cloudflare Pages, Netlify, atau Vercel, lalu arahkan domain artamu.id ke sana.
- index.html    Halaman produk
- privasi.html  Kebijakan privasi (wajib tayang sebelum unggah pertama ke Play Console)
- syarat.html   Syarat penggunaan

Sebelum dipasang:
- Isi tautan Play Store yang masih "#"
- Lengkapi identitas pengelola di halaman privasi dan syarat
- Aktifkan alamat halo@artamu.id
- Buat gambar og.png 1200x630 untuk pratinjau saat tautan dibagikan
- Ganti tangkapan layar dengan hasil dari aplikasi sungguhan setelah rilis 0.9

## situs-internal/   → dokumen kerja, jangan dipublikasikan
Lima halaman, semuanya diberi tanda noindex. Taruh di subdomain terpisah seperti lab.artamu.id, sebaiknya dilindungi kata sandi.
- index.html          Prototipe aplikasi (wireframe interaktif)
- pedoman-merek.html  Pedoman merek
- pedoman-ikon.html   Pedoman ikon dan ilustrasi
- peta-rilis.html     Peta rilis 0.9 sampai 2.0
- checklist.html      Checklist 105 pekerjaan, centangnya tersimpan di peramban

## dokumen/   → salin ke docs/ di repo aplikasi
- TECH-STACK.md          Tumpukan teknologi, keputusan, dan rencana monetisasi
- DATABASE.md            Penjelasan skema, diagram relasi, aturan migrasi
- BRIEF-MEDIA-SOSIAL.md  24 draf postingan Threads untuk enam fase peluncuran

## database/   → salin ke src/db/migrations/
- 0001_init.sql  Skema SQLite versi 1, sudah diuji di SQLite 3.45

## logo/   → sudah dipindah ke assets/brand/, nama berkas diganti ke bahasa Inggris
- logo-vertical.png          Susunan utama: simbol, nama, tagline
- logo-vertical-on-dark.png  Susunan utama dengan tulisan terang, untuk latar gelap (dibuat dari logo-vertical.png)
- logo-horizontal.png        Kepala situs dan tanda tangan email
- logo-mark.png              Simbol saja, untuk avatar dan favicon
- logo-mark-white.png        Siluet putih untuk latar gelap
- logo-mark-dark.png         Siluet gelap untuk cetak hitam putih
- app-icon.png               Ikon aplikasi berlatar hijau sangat tua
Semuanya PNG. Untuk ikon adaptif Android dan cetak besar, minta versi vektor dari perancang logo.

## Langkah berikutnya
1. Daftar akun Google Play dan mulai kumpulkan 15 sampai 20 calon penguji
2. Pasang situs-produk/ di artamu.id
3. Mulai postingan fase 0 di Threads
4. Buat proyek Expo dan kerjakan kelompok Fondasi di checklist

## Catatan
Prototipe adalah tiruan berbasis web untuk memutuskan alur dan tampilan. Kodenya tidak dipakai ulang di aplikasi Expo. Yang dibawa adalah keputusannya: token warna, struktur layar, skema database, dan teks antarmuka.
