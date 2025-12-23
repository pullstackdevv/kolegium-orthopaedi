Tambahkan modul AFFILIATION (Penempatan User) ke sistem CMS Kolegium Orthopaedi
tanpa merusak struktur RBAC dan agenda yang sudah ada.

KONTEKS:
- Sistem menggunakan Laravel + MariaDB
- Sudah ada tabel: users, roles, permissions, agenda_events
- User memiliki role (RBAC)
- Setiap user memiliki penempatan (affiliation) seperti:
  - Kolegium
  - Residen (FK UI, FK UGM, dll)
  - Clinical Fellowship (RSUP, RSUD)
  - Subspesialis
  - Peer Group (IOSSA, INAMSOS, dll)

TUJUAN:
- Setiap user WAJIB memiliki minimal 1 affiliation
- Agenda/event terikat ke affiliation
- Admin hanya boleh mengelola data sesuai affiliation-nya

---

### 1. BUAT TABEL BARU

#### affiliations
Kolom:
- id (bigint, PK, auto increment)
- name (varchar)
- type (varchar) → kolegium | residen | clinical_fellowship | subspesialis | peer_group
- code (varchar, unique)
- created_at (timestamp)

#### user_affiliations
Kolom:
- id (bigint, PK)
- user_id (FK → users.id)
- affiliation_id (FK → affiliations.id)
- created_at (timestamp)

Constraint:
- UNIQUE(user_id, affiliation_id)
- ON DELETE CASCADE

---

### 2. UPDATE TABEL EXISTING

#### agenda_events
Tambahkan kolom:
- affiliation_id (FK → affiliations.id, nullable)

Gunakan kolom ini sebagai pemilik event / agenda.

---

### 3. RELASI MODEL (LARAVEL)

- User hasMany UserAffiliation
- User belongsToMany Affiliation
- Affiliation hasMany Users
- AgendaEvent belongsTo Affiliation
- Affiliation hasMany AgendaEvents

---

### 4. RULE & LOGIC

- Super Admin → bisa akses semua affiliation
- Admin Kolegium → hanya affiliation type = kolegium
- Admin Residen → hanya affiliation type = residen
- Admin CF → hanya affiliation type = clinical_fellowship
- Admin Peer Group → hanya affiliation type = peer_group

Query agenda WAJIB difilter berdasarkan affiliation user login.

---

### 5. DATA SEEDER (CONTOH)

Affiliations:
- Kolegium Orthopaedi dan Traumatologi (kolegium)
- FK Universitas Indonesia (residen)
- FK Universitas Gadjah Mada (residen)
- RSUP Dr. Sardjito (clinical_fellowship)
- IOSSA (peer_group)

---

### 6. OUTPUT YANG DIHARAPKAN

- Migration untuk affiliations & user_affiliations
- Migration alter agenda_events
- Model Eloquent lengkap
- Seeder affiliations
- Query aman berbasis affiliation
- Tidak menghapus atau merusak tabel lama
