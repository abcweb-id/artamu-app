-- =====================================================================
-- ARTAMU, skema SQLite
-- Versi skema: 1  (PRAGMA user_version)
-- Mencakup semua fase peta rilis 0.9 sampai 2.0, supaya rilis berikutnya
-- menambah layar, bukan migrasi besar.
--
-- KONVENSI
--  * id            : UUID v4 berupa TEXT, dibuat di ponsel.
--  * nominal       : INTEGER rupiah, selalu positif. Arah ditentukan kolom type.
--  * tanggal       : TEXT 'YYYY-MM-DD' menurut zona waktu pengguna.
--  * cap waktu     : TEXT ISO 8601 UTC, contoh '2026-09-18T05:12:44.120Z'.
--  * created_at, updated_at diisi aplikasi pada setiap tulis.
--  * deleted_at    : hapus lunak. Baris tidak pernah benar-benar dihapus,
--                    supaya sinkronisasi cloud bisa menyebarkan penghapusan.
--  * synced_at     : NULL berarti belum terkirim ke cloud (dipakai mulai 2.0).
--  * Saldo, progres anggaran, dan angka laporan TIDAK disimpan. Semuanya
--    dihitung dari tabel transactions.
-- =====================================================================

PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

-- ---------------------------------------------------------------------
-- 1. PENGATURAN  (rilis 0.9)
--    Bahasa, mode gelap, jam pengingat, dompet aktif, petunjuk yang sudah
--    dilihat, nama panggilan. Disimpan di sini agar ikut tercadangkan.
--    PIN dan token sesi TIDAK di sini, melainkan di expo-secure-store.
-- ---------------------------------------------------------------------
CREATE TABLE settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,              -- JSON
  updated_at  TEXT NOT NULL
);

-- ---------------------------------------------------------------------
-- 2. DOMPET  (rilis 1.0, arsip di 1.4)
-- ---------------------------------------------------------------------
CREATE TABLE wallets (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  icon         TEXT NOT NULL DEFAULT 'wallet',
  sort_order   INTEGER NOT NULL DEFAULT 0,
  archived_at  TEXT,
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL,
  deleted_at   TEXT,
  synced_at    TEXT
);
-- Nama dompet aktif tidak boleh kembar (tanpa membedakan huruf besar kecil).
CREATE UNIQUE INDEX ux_wallets_name
  ON wallets (lower(name)) WHERE deleted_at IS NULL;

-- ---------------------------------------------------------------------
-- 3. KATEGORI  (utama di 1.0, sematan di 1.1, subkategori di 1.4)
--    parent_id NULL    = kategori utama
--    parent_id terisi  = subkategori, maksimal dua tingkat
--    system_key terisi = kategori sistem yang tidak tampil di pemilih:
--                        transfer, adjustment, debt, opening
-- ---------------------------------------------------------------------
CREATE TABLE categories (
  id           TEXT PRIMARY KEY,
  parent_id    TEXT REFERENCES categories(id),
  type         TEXT NOT NULL CHECK (type IN ('in','out','both')),
  name         TEXT NOT NULL,
  icon         TEXT,                      -- NULL pada sub = ikut induk
  color_bg     TEXT,                      -- NULL pada sub = ikut induk
  color_fg     TEXT,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  pinned_at    TEXT,                      -- sematan, maksimal 5 per type (aturan aplikasi)
  archived_at  TEXT,
  system_key   TEXT,
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL,
  deleted_at   TEXT,
  synced_at    TEXT
);
CREATE INDEX ix_categories_parent ON categories (parent_id);
CREATE UNIQUE INDEX ux_categories_system
  ON categories (system_key) WHERE system_key IS NOT NULL;
-- Nama sub tidak boleh kembar di dalam satu induk.
CREATE UNIQUE INDEX ux_categories_sub_name
  ON categories (parent_id, lower(name))
  WHERE parent_id IS NOT NULL AND deleted_at IS NULL;

-- Penjaga: subkategori hanya boleh dua tingkat dan harus sejenis dengan induknya.
CREATE TRIGGER trg_categories_depth_ins
BEFORE INSERT ON categories
WHEN NEW.parent_id IS NOT NULL
BEGIN
  SELECT RAISE(ABORT, 'Subkategori hanya boleh dua tingkat')
   WHERE (SELECT parent_id FROM categories WHERE id = NEW.parent_id) IS NOT NULL;
  SELECT RAISE(ABORT, 'Jenis subkategori harus sama dengan induknya')
   WHERE (SELECT type FROM categories WHERE id = NEW.parent_id) <> NEW.type;
END;
CREATE TRIGGER trg_categories_depth_upd
BEFORE UPDATE OF parent_id ON categories
WHEN NEW.parent_id IS NOT NULL
BEGIN
  SELECT RAISE(ABORT, 'Subkategori hanya boleh dua tingkat')
   WHERE (SELECT parent_id FROM categories WHERE id = NEW.parent_id) IS NOT NULL
      OR EXISTS (SELECT 1 FROM categories WHERE parent_id = NEW.id);
END;

-- ---------------------------------------------------------------------
-- 4. TRANSAKSI RUTIN  (rilis 1.2)
--    Pemasukan maupun pengeluaran. Tidak ada cron: saat aplikasi dibuka,
--    selama next_run_date <= hari ini, buat transaksinya lalu majukan sebulan.
-- ---------------------------------------------------------------------
CREATE TABLE recurring_rules (
  id             TEXT PRIMARY KEY,
  type           TEXT NOT NULL CHECK (type IN ('in','out')),
  name           TEXT NOT NULL,
  amount         INTEGER NOT NULL CHECK (amount > 0),
  wallet_id      TEXT NOT NULL REFERENCES wallets(id),
  category_id    TEXT NOT NULL REFERENCES categories(id),
  day_of_month   INTEGER NOT NULL CHECK (day_of_month BETWEEN 1 AND 28),
  repeat_count   INTEGER CHECK (repeat_count IS NULL OR repeat_count > 0), -- NULL = selamanya
  run_count      INTEGER NOT NULL DEFAULT 0,
  next_run_date  TEXT,                    -- NULL = sudah selesai
  is_active      INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0,1)),
  created_at     TEXT NOT NULL,
  updated_at     TEXT NOT NULL,
  deleted_at     TEXT,
  synced_at      TEXT
);
CREATE INDEX ix_recurring_due
  ON recurring_rules (next_run_date) WHERE is_active = 1 AND deleted_at IS NULL;

-- ---------------------------------------------------------------------
-- 5. TRANSAKSI  (rilis 0.9, inti aplikasi)
--    source            : manual | recurring | system
--    pair_id           : sama pada dua sisi satu transfer (1.1)
--    recurring_id      : asal transaksi rutin (1.2)
--    recurring_period  : 'YYYY-MM', bersama recurring_id menjamin tidak dobel
-- ---------------------------------------------------------------------
CREATE TABLE transactions (
  id                TEXT PRIMARY KEY,
  wallet_id         TEXT NOT NULL REFERENCES wallets(id),
  category_id       TEXT NOT NULL REFERENCES categories(id),
  type              TEXT NOT NULL CHECK (type IN ('in','out')),
  amount            INTEGER NOT NULL CHECK (amount > 0),
  note              TEXT NOT NULL DEFAULT '',
  date              TEXT NOT NULL CHECK (date GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'),
  source            TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual','recurring','system')),
  pair_id           TEXT,
  recurring_id      TEXT REFERENCES recurring_rules(id),
  recurring_period  TEXT,
  created_at        TEXT NOT NULL,
  updated_at        TEXT NOT NULL,
  deleted_at        TEXT,
  synced_at         TEXT,
  CHECK ((recurring_id IS NULL) = (recurring_period IS NULL))
);
-- Daftar per dompet per bulan, urut terbaru. Ini query paling sering.
CREATE INDEX ix_tx_wallet_date ON transactions (wallet_id, date DESC, created_at DESC)
  WHERE deleted_at IS NULL;
-- Laporan dan anggaran per kategori.
CREATE INDEX ix_tx_category_date ON transactions (category_id, date)
  WHERE deleted_at IS NULL;
CREATE INDEX ix_tx_pair ON transactions (pair_id) WHERE pair_id IS NOT NULL;
-- SENGAJA tanpa syarat deleted_at: transaksi rutin yang dihapus pengguna
-- tidak boleh dibuat ulang oleh logika kejar ketertinggalan.
CREATE UNIQUE INDEX ux_tx_recurring_period
  ON transactions (recurring_id, recurring_period) WHERE recurring_id IS NOT NULL;
-- Antrean sinkronisasi (2.0).
CREATE INDEX ix_tx_unsynced ON transactions (updated_at) WHERE synced_at IS NULL;

-- Penjaga: jenis transaksi harus cocok dengan jenis kategorinya.
CREATE TRIGGER trg_tx_category_type_ins
BEFORE INSERT ON transactions
BEGIN
  SELECT RAISE(ABORT, 'Jenis transaksi tidak cocok dengan kategori')
   WHERE (SELECT type FROM categories WHERE id = NEW.category_id) NOT IN (NEW.type, 'both');
END;
CREATE TRIGGER trg_tx_category_type_upd
BEFORE UPDATE OF category_id, type ON transactions
BEGIN
  SELECT RAISE(ABORT, 'Jenis transaksi tidak cocok dengan kategori')
   WHERE (SELECT type FROM categories WHERE id = NEW.category_id) NOT IN (NEW.type, 'both');
END;

-- ---------------------------------------------------------------------
-- 6. FOTO STRUK  (rilis 1.4)
--    Berkasnya di folder dokumen aplikasi, di sini hanya alamatnya.
-- ---------------------------------------------------------------------
CREATE TABLE attachments (
  id              TEXT PRIMARY KEY,
  transaction_id  TEXT NOT NULL REFERENCES transactions(id),
  file_path       TEXT NOT NULL,
  width           INTEGER,
  height          INTEGER,
  size_bytes      INTEGER,
  created_at      TEXT NOT NULL,
  updated_at      TEXT NOT NULL,
  deleted_at      TEXT,
  synced_at       TEXT
);
CREATE INDEX ix_attachments_tx ON attachments (transaction_id) WHERE deleted_at IS NULL;

-- ---------------------------------------------------------------------
-- 7. ANGGARAN  (rilis 1.5)
--    Lintas dompet. Cakupan ada di budget_categories:
--    tanpa baris = semua kategori. Memilih kategori utama mencakup semua sub-nya.
-- ---------------------------------------------------------------------
CREATE TABLE budgets (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  amount       INTEGER NOT NULL CHECK (amount > 0),
  period_type  TEXT NOT NULL CHECK (period_type IN ('monthly','once')),
  start_date   TEXT,                      -- hanya untuk 'once'
  end_date     TEXT,
  is_main      INTEGER NOT NULL DEFAULT 0 CHECK (is_main IN (0,1)),
  archived_at  TEXT,
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL,
  deleted_at   TEXT,
  synced_at    TEXT,
  CHECK (period_type = 'monthly' OR (start_date IS NOT NULL AND end_date IS NOT NULL AND start_date <= end_date)),
  CHECK (is_main = 0 OR period_type = 'monthly')
);
-- Hanya satu anggaran utama yang aktif.
CREATE UNIQUE INDEX ux_budgets_main
  ON budgets (is_main) WHERE is_main = 1 AND deleted_at IS NULL AND archived_at IS NULL;

CREATE TABLE budget_categories (
  id           TEXT PRIMARY KEY,
  budget_id    TEXT NOT NULL REFERENCES budgets(id),
  category_id  TEXT NOT NULL REFERENCES categories(id),
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL,
  deleted_at   TEXT,
  synced_at    TEXT
);
CREATE UNIQUE INDEX ux_budget_categories
  ON budget_categories (budget_id, category_id) WHERE deleted_at IS NULL;

-- ---------------------------------------------------------------------
-- 8. HUTANG PIUTANG  (rilis 1.6)
--    kind: debt = saya berhutang, receivable = saya meminjamkan.
--    Sisa = total_amount dikurangi jumlah debt_payments.
-- ---------------------------------------------------------------------
CREATE TABLE debts (
  id                   TEXT PRIMARY KEY,
  kind                 TEXT NOT NULL CHECK (kind IN ('debt','receivable')),
  person_name          TEXT NOT NULL,
  total_amount         INTEGER NOT NULL CHECK (total_amount > 0),
  due_date             TEXT,
  note                 TEXT NOT NULL DEFAULT '',
  origin_transaction_id TEXT REFERENCES transactions(id), -- bila "catat juga di dompet"
  settled_at           TEXT,
  created_at           TEXT NOT NULL,
  updated_at           TEXT NOT NULL,
  deleted_at           TEXT,
  synced_at            TEXT
);
CREATE INDEX ix_debts_open ON debts (kind, due_date)
  WHERE settled_at IS NULL AND deleted_at IS NULL;

CREATE TABLE debt_payments (
  id              TEXT PRIMARY KEY,
  debt_id         TEXT NOT NULL REFERENCES debts(id),
  amount          INTEGER NOT NULL CHECK (amount > 0),
  date            TEXT NOT NULL,
  transaction_id  TEXT REFERENCES transactions(id),
  created_at      TEXT NOT NULL,
  updated_at      TEXT NOT NULL,
  deleted_at      TEXT,
  synced_at       TEXT
);
CREATE INDEX ix_debt_payments_debt ON debt_payments (debt_id) WHERE deleted_at IS NULL;
CREATE INDEX ix_debt_payments_tx ON debt_payments (transaction_id) WHERE transaction_id IS NOT NULL;

-- ---------------------------------------------------------------------
-- 9. NOTIFIKASI DI DALAM APLIKASI  (rilis 1.2)
--    Hanya lokal, tidak ikut sinkron.
-- ---------------------------------------------------------------------
CREATE TABLE notifications (
  id            TEXT PRIMARY KEY,
  kind          TEXT NOT NULL CHECK (kind IN ('recurring_posted','debt_due','budget_80','budget_100','backup_reminder','info')),
  title         TEXT NOT NULL,
  body          TEXT NOT NULL DEFAULT '',
  target_route  TEXT,
  target_id     TEXT,
  read_at       TEXT,
  created_at    TEXT NOT NULL
);
CREATE INDEX ix_notifications_unread ON notifications (created_at DESC) WHERE read_at IS NULL;

-- =====================================================================
-- TAMPILAN BANTU
-- =====================================================================

-- Transaksi hidup dengan kategori utamanya (sub digulung ke induk).
CREATE VIEW v_transactions AS
SELECT t.*,
       COALESCE(c.parent_id, c.id)  AS main_category_id,
       c.system_key                 AS system_key,
       CASE WHEN t.type = 'in' THEN t.amount ELSE -t.amount END AS signed_amount
  FROM transactions t
  JOIN categories  c ON c.id = t.category_id
 WHERE t.deleted_at IS NULL;

-- Saldo tiap dompet. Saldo awal adalah transaksi berkategori sistem 'opening'.
CREATE VIEW v_wallet_balances AS
SELECT w.id AS wallet_id, w.name, w.archived_at,
       COALESCE(SUM(v.signed_amount), 0) AS balance
  FROM wallets w
  LEFT JOIN v_transactions v ON v.wallet_id = w.id
 WHERE w.deleted_at IS NULL
 GROUP BY w.id;

-- Sisa hutang piutang.
CREATE VIEW v_debt_status AS
SELECT d.*,
       d.total_amount - COALESCE((SELECT SUM(p.amount) FROM debt_payments p
                                   WHERE p.debt_id = d.id AND p.deleted_at IS NULL), 0) AS remaining
  FROM debts d
 WHERE d.deleted_at IS NULL;

-- =====================================================================
-- DATA AWAL
-- ID kategori bawaan dibuat tetap agar sama di semua ponsel, sehingga
-- penggabungan data di cloud tidak menghasilkan kategori kembar.
-- Dompet tidak diisi di sini: dibuat pengguna saat pertama kali buka.
-- =====================================================================

INSERT INTO categories (id, type, name, icon, color_bg, color_fg, sort_order, system_key, created_at, updated_at) VALUES
 ('00000000-0000-4000-8000-0000000000a1','both','Transfer antar dompet','swap'    ,'#E6E7EA','#4A4F5E',0,'transfer'  ,'2026-01-01T00:00:00.000Z','2026-01-01T00:00:00.000Z'),
 ('00000000-0000-4000-8000-0000000000a2','both','Penyesuaian saldo'    ,'settings','#E6E7EA','#4A4F5E',0,'adjustment','2026-01-01T00:00:00.000Z','2026-01-01T00:00:00.000Z'),
 ('00000000-0000-4000-8000-0000000000a3','both','Hutang piutang'       ,'swap'    ,'#E2E6F5','#4A568F',0,'debt'      ,'2026-01-01T00:00:00.000Z','2026-01-01T00:00:00.000Z'),
 ('00000000-0000-4000-8000-0000000000a4','in'  ,'Saldo awal'           ,'wallet'  ,'#E6E7EA','#4A4F5E',0,'opening'   ,'2026-01-01T00:00:00.000Z','2026-01-01T00:00:00.000Z');

INSERT INTO categories (id, type, name, icon, color_bg, color_fg, sort_order, created_at, updated_at) VALUES
 ('00000000-0000-4000-8000-000000000101','out','Makan'             ,'food'   ,'#FCE8D5','#B86B1F', 1,'2026-01-01T00:00:00.000Z','2026-01-01T00:00:00.000Z'),
 ('00000000-0000-4000-8000-000000000102','out','Transport'         ,'moto'   ,'#DCEBFA','#2F6CA8', 2,'2026-01-01T00:00:00.000Z','2026-01-01T00:00:00.000Z'),
 ('00000000-0000-4000-8000-000000000103','out','Belanja'           ,'bag'    ,'#F3E1F0','#8C4A83', 3,'2026-01-01T00:00:00.000Z','2026-01-01T00:00:00.000Z'),
 ('00000000-0000-4000-8000-000000000104','out','Tagihan'           ,'receipt','#FBF0CF','#94701A', 4,'2026-01-01T00:00:00.000Z','2026-01-01T00:00:00.000Z'),
 ('00000000-0000-4000-8000-000000000105','out','Kesehatan'         ,'plus'   ,'#FBE0E6','#A8456A', 5,'2026-01-01T00:00:00.000Z','2026-01-01T00:00:00.000Z'),
 ('00000000-0000-4000-8000-000000000106','out','Hiburan'           ,'music'  ,'#F3E1F0','#8C4A83', 6,'2026-01-01T00:00:00.000Z','2026-01-01T00:00:00.000Z'),
 ('00000000-0000-4000-8000-000000000107','out','Pendidikan'        ,'pencil' ,'#DCEBFA','#2F6CA8', 7,'2026-01-01T00:00:00.000Z','2026-01-01T00:00:00.000Z'),
 ('00000000-0000-4000-8000-000000000108','out','Sedekah'           ,'gift'   ,'#DDF2E6','#2A7D55', 8,'2026-01-01T00:00:00.000Z','2026-01-01T00:00:00.000Z'),
 ('00000000-0000-4000-8000-000000000109','out','Rumah tangga'      ,'home'   ,'#FBF0CF','#94701A', 9,'2026-01-01T00:00:00.000Z','2026-01-01T00:00:00.000Z'),
 ('00000000-0000-4000-8000-00000000010a','out','Pulsa dan internet','phone'  ,'#E2E6F5','#4A568F',10,'2026-01-01T00:00:00.000Z','2026-01-01T00:00:00.000Z'),
 ('00000000-0000-4000-8000-00000000010b','out','Lainnya'           ,'dots'   ,'#ECE8E2','#6B675F',99,'2026-01-01T00:00:00.000Z','2026-01-01T00:00:00.000Z'),
 ('00000000-0000-4000-8000-000000000201','in' ,'Gaji'              ,'wallet' ,'#DDF2E6','#2A7D55', 1,'2026-01-01T00:00:00.000Z','2026-01-01T00:00:00.000Z'),
 ('00000000-0000-4000-8000-000000000202','in' ,'Proyek lepas'      ,'cash'   ,'#DDF2E6','#2A7D55', 2,'2026-01-01T00:00:00.000Z','2026-01-01T00:00:00.000Z'),
 ('00000000-0000-4000-8000-000000000203','in' ,'Bonus dan THR'     ,'gift'   ,'#FBF0CF','#94701A', 3,'2026-01-01T00:00:00.000Z','2026-01-01T00:00:00.000Z'),
 ('00000000-0000-4000-8000-000000000204','in' ,'Hasil investasi'   ,'chart'  ,'#DCEBFA','#2F6CA8', 4,'2026-01-01T00:00:00.000Z','2026-01-01T00:00:00.000Z'),
 ('00000000-0000-4000-8000-000000000205','in' ,'Penjualan barang'  ,'tag'    ,'#F3E1F0','#8C4A83', 5,'2026-01-01T00:00:00.000Z','2026-01-01T00:00:00.000Z'),
 ('00000000-0000-4000-8000-000000000206','in' ,'Hadiah'            ,'gift'   ,'#FBE0E6','#A8456A', 6,'2026-01-01T00:00:00.000Z','2026-01-01T00:00:00.000Z'),
 ('00000000-0000-4000-8000-000000000207','in' ,'Lainnya'           ,'dots'   ,'#ECE8E2','#6B675F',99,'2026-01-01T00:00:00.000Z','2026-01-01T00:00:00.000Z');

INSERT INTO settings (key, value, updated_at) VALUES
 ('schema_note'    , '"Artamu skema versi 1"', '2026-01-01T00:00:00.000Z'),
 ('language'       , '"system"'              , '2026-01-01T00:00:00.000Z'),
 ('theme_mode'     , '"system"'              , '2026-01-01T00:00:00.000Z'),
 ('auto_lock'      , '60'                    , '2026-01-01T00:00:00.000Z'),
 ('daily_reminder' , '{"on":true,"h":20,"m":0}', '2026-01-01T00:00:00.000Z');

PRAGMA user_version = 1;

-- =====================================================================
-- CONTOH QUERY  (parameter ditulis :nama)
-- =====================================================================

-- A. Saldo satu dompet, untuk kartu dashboard
--    SELECT balance FROM v_wallet_balances WHERE wallet_id = :wallet;

-- B. Ringkasan bulan untuk satu dompet (kartu di menu Transaksi)
--    SELECT SUM(CASE WHEN type='in'  THEN amount ELSE 0 END) AS masuk,
--           SUM(CASE WHEN type='out' THEN amount ELSE 0 END) AS keluar
--      FROM v_transactions
--     WHERE wallet_id = :wallet AND date BETWEEN :awal AND :akhir;

-- C. Daftar transaksi sebulan, terbaru dulu
--    SELECT * FROM v_transactions
--     WHERE wallet_id = :wallet AND date BETWEEN :awal AND :akhir
--     ORDER BY date DESC, created_at DESC;

-- D. Laporan pengeluaran per kategori utama. Transfer, penyesuaian, dan
--    hutang (system_key terisi) tidak dihitung sebagai belanja.
--    SELECT main_category_id, SUM(amount) AS total
--      FROM v_transactions
--     WHERE wallet_id = :wallet AND type = 'out' AND system_key IS NULL
--       AND date BETWEEN :awal AND :akhir
--     GROUP BY main_category_id ORDER BY total DESC;

-- E. Lima kategori tersering 60 hari terakhir, untuk deretan cepat
--    SELECT main_category_id, COUNT(*) AS n
--      FROM v_transactions
--     WHERE type = :type AND system_key IS NULL AND date >= date('now','-60 days')
--     GROUP BY main_category_id ORDER BY n DESC LIMIT 5;

-- F. Terpakainya satu anggaran bulanan, lintas dompet.
--    Anggaran tanpa baris budget_categories berarti semua kategori.
--    SELECT COALESCE(SUM(v.amount),0) AS terpakai
--      FROM v_transactions v
--     WHERE v.type = 'out' AND v.system_key IS NULL
--       AND v.date BETWEEN :awal AND :akhir
--       AND ( NOT EXISTS (SELECT 1 FROM budget_categories bc
--                          WHERE bc.budget_id = :budget AND bc.deleted_at IS NULL)
--          OR EXISTS (SELECT 1 FROM budget_categories bc
--                      WHERE bc.budget_id = :budget AND bc.deleted_at IS NULL
--                        AND bc.category_id IN (v.category_id, v.main_category_id)) );

-- G. Transaksi rutin yang sudah jatuh tempo (dijalankan saat aplikasi dibuka)
--    SELECT * FROM recurring_rules
--     WHERE is_active = 1 AND deleted_at IS NULL
--       AND next_run_date IS NOT NULL AND next_run_date <= :hari_ini;
--    Untuk tiap baris, di dalam satu transaksi database:
--      INSERT OR IGNORE INTO transactions (..., recurring_id, recurring_period, source)
--        VALUES (..., :rule, substr(:next_run_date,1,7), 'recurring');
--      UPDATE recurring_rules SET run_count = run_count + 1,
--             next_run_date = CASE WHEN repeat_count IS NOT NULL AND run_count + 1 >= repeat_count
--                                  THEN NULL ELSE date(next_run_date,'+1 month') END
--       WHERE id = :rule;
--    Ulangi sampai next_run_date melewati hari ini.

-- H. Pencarian lintas bulan dalam satu dompet
--    SELECT v.* FROM v_transactions v JOIN categories c ON c.id = v.main_category_id
--     WHERE v.wallet_id = :wallet AND (v.note LIKE :q OR c.name LIKE :q)
--     ORDER BY v.date DESC LIMIT 200;

-- I. Saran kategori dari catatan
--    SELECT category_id FROM v_transactions
--     WHERE type = :type AND system_key IS NULL AND note LIKE :awalan || '%'
--     ORDER BY date DESC LIMIT 1;
