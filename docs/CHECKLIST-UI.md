# Artamu, checklist UI

Status setiap layar dibandingkan dengan prototipe (`docs/situs-internal/index.html`).
Diperbarui 22 September 2026.

Tiga kotak per layar:

- **Rute ada**: berkas layar sudah dibuat dan bisa dibuka, walau isinya masih placeholder.
- **Sesuai wireframe**: tampilan sudah sama dengan prototipe.
- **Terhubung database**: data dibaca dan ditulis ke SQLite, bukan data contoh.

## Ringkasan

| | Jumlah |
|---|---|
| Item di checklist | 36 (35 layar prototipe ditambah bottom bar) |
| Rute ada | 9 |
| Sesuai wireframe | 3 |
| Terhubung database | 0 |

Database belum punya tabel. Skema versi 1 masih di `docs/database/0001_init.sql` dan belum dipasang sebagai migrasi.

## Kerangka utama (dikerjakan duluan)

### 1. Layar pembuka
- [x] Rute ada: splash native di `app.json`, memakai `assets/brand/logo-vertical.png` (terang) dan `logo-vertical-on-dark.png` (gelap)
- [x] Sesuai wireframe: simbol, nama "ARTAMU", dan tagline di tengah latar `#F8FAF9`, lebar 180. Hanya terlihat di development build, tidak di Expo Go
- [ ] Terhubung database: tidak perlu

### 2. Pertama kali buka
- [x] Rute ada: `src/app/(onboarding)/selamat-datang.tsx`
- [x] Sesuai wireframe: simbol dan ARTAMU, judul, tiga poin fitur, tombol "Buat PIN dan mulai", dan "Pulihkan dari cadangan". Dicek berdampingan dengan prototipe di mode terang dan gelap
- [ ] Tombol "Buat PIN dan mulai" ke layar Isi nama panggilan (sementara langsung ke Beranda, karena layar itu belum dibuat)
- [ ] Tombol "Pulihkan dari cadangan" berfungsi (layar cadangan belum dibuat)
- [ ] Terhubung database: status onboarding masih di memori, hilang setiap aplikasi ditutup
- [x] Tombol berpindah ke Beranda (diuji dengan klik di browser)

### 3. Bottom bar
- [x] Rute ada: `src/app/(tabs)/_layout.tsx` dengan tab bar sendiri di `src/components/tab-bar.tsx`
- [x] Sesuai wireframe: tab aktif hijau dengan garis 28×3 di tepi atas, label 11 px, tombol ＋ 60×60 sudut 18 yang naik di atas bar dengan cincin dan bayangan. Dicek berdampingan dengan prototipe di mode terang dan gelap. Ikon tab aktif `bold` (prototipe memakai garis 2,2), tab lain `regular`
- [x] Perpindahan tab dan tombol ＋ membuka lembar input (diuji dengan klik di browser)
- [ ] Terhubung database: tidak perlu

### 4. Dashboard
- [x] Rute ada: `src/app/(tabs)/index.tsx`
- [ ] Sesuai wireframe: masih placeholder "Belum dibuat."
- [ ] Terhubung database

### 5. Daftar transaksi
- [x] Rute ada: `src/app/(tabs)/transaksi.tsx`
- [ ] Sesuai wireframe: masih placeholder "Belum dibuat."
- [ ] Terhubung database

### 6. Input transaksi
- [x] Rute ada: `src/components/input-sheet.tsx`, lembar bawah terbuka dari tombol ＋ (bug lembar tidak pernah muncul sudah diperbaiki)
- [ ] Menutup dengan geser ke bawah lalu membuka lagi (belum bisa diuji di browser)
- [ ] Sesuai wireframe: baru judul "Transaksi baru", belum ada keypad, kategori, dan tombol simpan
- [ ] Terhubung database

### 7. Pengaturan
- [x] Rute ada: `src/app/(tabs)/pengaturan.tsx`
- [ ] Sesuai wireframe: masih placeholder "Belum dibuat."
- [ ] Terhubung database

### 8. Akun dan profil
- [x] Rute ada: `src/app/(tabs)/akun.tsx`
- [ ] Sesuai wireframe: masih placeholder "Belum dibuat."
- [ ] Terhubung database

## Alur pertama kali buka

### 9. Isi nama panggilan
- [ ] Rute ada
- [ ] Sesuai wireframe
- [ ] Terhubung database

### 10. Dompet dan saldo awal
- [ ] Rute ada
- [ ] Sesuai wireframe
- [ ] Terhubung database

### 11. Izin notifikasi
- [ ] Rute ada
- [ ] Sesuai wireframe
- [ ] Terhubung database

### 12. Login PIN
- [x] Rute ada: `src/app/(auth)/kunci.tsx`, belum bisa dibuka karena kunci PIN belum aktif
- [ ] Sesuai wireframe: baru teks "Masukkan PIN", belum ada titik PIN dan keypad
- [ ] Terhubung database: hash PIN nanti di expo-secure-store, bukan SQLite

### 13. PIN terkunci
- [ ] Rute ada
- [ ] Sesuai wireframe
- [ ] Terhubung database

## Keadaan khusus

### 14. Memperbarui data
- [ ] Rute ada
- [ ] Sesuai wireframe
- [ ] Terhubung database

### 15. Penyimpanan penuh
- [ ] Rute ada
- [ ] Sesuai wireframe
- [ ] Terhubung database

## Transaksi

### 16. Notifikasi
- [ ] Rute ada
- [ ] Sesuai wireframe
- [ ] Terhubung database

### 17. Pencarian dan filter
- [ ] Rute ada
- [ ] Sesuai wireframe
- [ ] Terhubung database

### 18. Detail transaksi
- [ ] Rute ada
- [ ] Sesuai wireframe
- [ ] Terhubung database

### 19. Transaksi rutin
- [ ] Rute ada
- [ ] Sesuai wireframe
- [ ] Terhubung database

### 20. Hutang piutang
- [ ] Rute ada
- [ ] Sesuai wireframe
- [ ] Terhubung database

## Dompet, kategori, anggaran, laporan

### 21. Kelola dompet
- [ ] Rute ada
- [ ] Sesuai wireframe
- [ ] Terhubung database

### 22. Kelola kategori
- [ ] Rute ada
- [ ] Sesuai wireframe
- [ ] Terhubung database

### 23. Anggaran
- [ ] Rute ada
- [ ] Sesuai wireframe
- [ ] Terhubung database

### 24. Laporan
- [ ] Rute ada
- [ ] Sesuai wireframe
- [ ] Terhubung database

### 25. Cadangan dan pemulihan
- [ ] Rute ada
- [ ] Sesuai wireframe
- [ ] Terhubung database

## Akun cloud (rilis 2.0)

### 26. Masuk akun
- [ ] Rute ada
- [ ] Sesuai wireframe
- [ ] Terhubung database

### 27. Daftar akun
- [ ] Rute ada
- [ ] Sesuai wireframe
- [ ] Terhubung database

### 28. Lupa kata sandi
- [ ] Rute ada
- [ ] Sesuai wireframe
- [ ] Terhubung database

### 29. Kode verifikasi
- [ ] Rute ada
- [ ] Sesuai wireframe
- [ ] Terhubung database

### 30. Data di dua tempat
- [ ] Rute ada
- [ ] Sesuai wireframe
- [ ] Terhubung database

### 31. Akun cloud
- [ ] Rute ada
- [ ] Sesuai wireframe
- [ ] Terhubung database

## Lain-lain

### 32. Widget dan pintasan
- [ ] Rute ada
- [ ] Sesuai wireframe
- [ ] Terhubung database

### 33. Ajakan memberi nilai
- [ ] Rute ada
- [ ] Sesuai wireframe
- [ ] Terhubung database: tidak perlu

### 34. Kebijakan privasi
- [ ] Rute ada
- [ ] Sesuai wireframe
- [ ] Terhubung database: tidak perlu

### 35. Bantuan dan dukungan
- [ ] Rute ada
- [ ] Sesuai wireframe
- [ ] Terhubung database: tidak perlu

### 36. Tentang aplikasi
- [ ] Rute ada
- [ ] Sesuai wireframe
- [ ] Terhubung database: tidak perlu

## Di luar layar

- [x] Ikon aplikasi dan ikon adaptif Android dari logo Artamu
- [x] Berkas logo di `assets/brand/`, termasuk versi tulisan terang untuk latar gelap
- [x] Token warna terang dan gelap (`src/theme/tokens.ts`)
- [x] Font Plus Jakarta Sans
- [x] Komponen dasar di `src/components/ui/`: `Icon` (57 ikon, gambar dari Phosphor), `Button` (utama dan tautan), `IconBadge`, `ListRow`, `Card`, `ScreenTitle`, `SectionLabel`
- [x] `CategoryIcon`: lingkaran 40/48 px, ikon `fill` 55 persen, delapan pasangan warna kategori (`categoryColors` di `src/theme/tokens.ts`). Belum dipakai di layar mana pun
- [x] Judul tab browser di web: "{nama halaman} - ARTAMU" lewat prop `pageTitle` di `Screen` (`src/components/page-title.tsx`)
- [x] Token `on-primary` untuk teks di atas warna utama (putih di mode terang, gelap di mode gelap)
- [x] Ikon Phosphor (`phosphor-react-native`): 57 ikon prototipe dipetakan ke Phosphor di `src/components/ui/icon.tsx`, diimpor per ikon. Mendukung bobot thin, light, regular, bold, fill, dan duotone
- [ ] Skema database versi 1 dipasang sebagai migrasi
