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
| Rute ada | 13 |
| Sesuai wireframe | 8 |
| Terhubung database | 0 |

Database belum punya tabel. Skema versi 1 masih di `docs/database/0001_init.sql` dan belum dipasang sebagai migrasi.

## Kerangka utama (dikerjakan duluan)

### 1. Layar pembuka
- [x] Rute ada: dua lapis. Splash native di `app.json` hanya simbol (`logo-mark.png`), karena Android 12+ memotong gambar menjadi ikon bulat kecil. Setelah itu `src/components/splash-overlay.tsx` menampilkan logo vertikal lengkap, lalu memudar
- [x] Sesuai wireframe: logo vertikal 186 px (simbol, ARTAMU, tagline) di tengah latar `#F8FAF9`, versi tulisan terang di mode gelap, tampil 1,2 detik lalu memudar. Dicek di browser; splash native hanya terlihat di development build, tidak di Expo Go
- [ ] Terhubung database: tidak perlu

### 2. Pertama kali buka
- [x] Rute ada: `src/app/(onboarding)/welcome.tsx`
- [x] Sesuai wireframe: simbol dan ARTAMU, judul, tiga poin fitur, tombol "Buat PIN dan mulai", dan "Pulihkan dari cadangan". Dicek berdampingan dengan prototipe di mode terang dan gelap
- [x] Tombol "Buat PIN dan mulai" ke layar Isi nama panggilan
- [ ] Tombol "Pulihkan dari cadangan" berfungsi (layar cadangan belum dibuat)
- [ ] Terhubung database: status onboarding masih di memori, hilang setiap aplikasi ditutup
- [x] Alur lengkap sampai Beranda diuji dengan klik di browser (id dan en, terang dan gelap)

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
- [x] Rute ada: `src/app/(tabs)/transactions.tsx`
- [ ] Sesuai wireframe: masih placeholder "Belum dibuat."
- [ ] Terhubung database

### 6. Input transaksi
- [x] Rute ada: `src/components/input-sheet.tsx`, lembar bawah terbuka dari tombol ＋ (bug lembar tidak pernah muncul sudah diperbaiki)
- [ ] Menutup dengan geser ke bawah lalu membuka lagi (belum bisa diuji di browser)
- [ ] Sesuai wireframe: baru judul "Transaksi baru", belum ada keypad, kategori, dan tombol simpan
- [ ] Terhubung database

### 7. Pengaturan
- [x] Rute ada: `src/app/(tabs)/settings.tsx`
- [ ] Sesuai wireframe: masih placeholder "Belum dibuat."
- [ ] Terhubung database

### 8. Akun dan profil
- [x] Rute ada: `src/app/(tabs)/account.tsx`
- [ ] Sesuai wireframe: masih placeholder "Belum dibuat."
- [ ] Terhubung database

## Alur pertama kali buka

### 9. Isi nama panggilan
- [x] Rute ada: `src/app/(onboarding)/nickname.tsx`
- [x] Sesuai wireframe: tombol kembali, lingkaran ikon, judul, kolom nama (maks 24 huruf), Lanjut buat PIN, Lewati
- [ ] Terhubung database: nama masih di memori (`src/stores/onboarding-store.ts`), nanti ke tabel settings

### 10. Dompet dan saldo awal
- [x] Rute ada: `src/app/(onboarding)/wallets.tsx`
- [x] Sesuai wireframe: Tunai, Bank, E-wallet dengan kotak centang (Tunai dan Bank terpilih dari awal), isian saldo berawalan Rp dan bertitik ribuan, pesan "Pilih minimal satu dompet", Langkah 2 dari 3
- [ ] Tombol "Tambah dompet lain" berfungsi (formulir dompet belum dibuat)
- [ ] Terhubung database: pilihan dan saldo masih di memori, nanti jadi baris wallets dan transaksi saldo awal

### 11. Izin notifikasi
- [x] Rute ada: `src/app/(onboarding)/notifications.tsx`
- [x] Sesuai wireframe: lingkaran lonceng, tiga poin, Izinkan notifikasi, Nanti saja. Keduanya lanjut ke Beranda
- [ ] Meminta izin sistem sungguhan (expo-notifications belum dipasang)
- [ ] Terhubung database: tidak perlu

### 12. Login PIN (dan Buat PIN, Ulangi PIN)
- [x] Rute ada: Buat PIN dan Ulangi PIN di `src/app/(onboarding)/create-pin.tsx`, Masukkan PIN di `src/app/(auth)/unlock.tsx`
- [x] Sesuai wireframe: titik PIN, keypad 72 px, tombol hapus; Masukkan PIN dengan logo, sidik jari, dan Lupa PIN. Beda yang disengaja: Buat PIN dan Ulangi PIN juga memakai logo (wireframe memakai ikon gembok)
- [x] PIN kedua berbeda: "PIN tidak sama. Ulangi dari awal."; PIN salah: "PIN salah. Sisa N percobaan."
- [x] Aplikasi ke latar belakang lalu dibuka lagi meminta PIN (diuji di browser; tolong cek di HP)
- [ ] Tombol sidik jari dan Lupa PIN berfungsi (belum dibuat)
- [ ] Terhubung database: PIN masih di memori, nanti hash-nya di expo-secure-store, bukan SQLite

### 13. PIN terkunci
- [x] Rute ada: bagian dari `src/app/(auth)/unlock.tsx`
- [x] Sesuai wireframe: lingkaran merah, hitung mundur 0.30 setelah 5 kali salah, keypad pudar dan tidak bisa ditekan
- [ ] Terhubung database: tidak perlu (waktu kunci nanti di expo-secure-store)

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
- [x] Terjemahan id dan en (`src/i18n/id.json`, `src/i18n/en.json`) dengan kunci huruf kapital, misalnya `t('PIN.LOGIN_TITLE')`. Kunci salah ketik atau terjemahan en yang terlewat gagal di typecheck. Bahasa mengikuti perangkat: Indonesia untuk id, selain itu en
- [ ] Pilihan bahasa di Pengaturan
- [x] Token `on-primary` untuk teks di atas warna utama (putih di mode terang, gelap di mode gelap)
- [x] Ikon Phosphor (`phosphor-react-native`): 57 ikon prototipe dipetakan ke Phosphor di `src/components/ui/icon.tsx`, diimpor per ikon. Mendukung bobot thin, light, regular, bold, fill, dan duotone
- [ ] Skema database versi 1 dipasang sebagai migrasi
