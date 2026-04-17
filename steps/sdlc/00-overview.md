# Metodologi SDLC + Waterfall — Rutino

> Metodologi yang dipakai untuk skripsi "Rancang Bangun Aplikasi Web Rutino"

---

## Kenapa SDLC + Waterfall?

Judul skripsi mengandung kata **"Rancang Bangun"** → fokusnya adalah
*pembangunan sistem*, bukan membuktikan efektivitas ke user.

SDLC (Software Development Life Cycle) dengan model Waterfall adalah
pilihan paling konsisten untuk jenis skripsi ini karena:

- Dokumentasi terstruktur dan linear → mudah dipertanggungjawabkan
- Paling umum di skripsi Sistem Informasi → dosen familiar
- Tidak butuh data UAT yang kompleks → black-box testing sudah cukup
- Alur jelas: satu fase selesai baru lanjut ke fase berikutnya

---

## Gambaran Besar Waterfall

```
Fase 1 → Requirements Analysis
         ↓
Fase 2 → System Design
         ↓
Fase 3 → Implementation
         ↓
Fase 4 → Testing
         ↓
Fase 5 → Deployment
         ↓
Fase 6 → Maintenance (disebutkan, tidak wajib dieksekusi)
```

---

## Pemetaan ke Bab Skripsi

| Fase Waterfall       | Bab Skripsi                          |
|----------------------|--------------------------------------|
| Requirements Analysis | BAB III — Metodologi (sub-bab analisis kebutuhan) |
| System Design        | BAB III — Metodologi (sub-bab perancangan sistem) |
| Implementation       | BAB IV — Hasil & Pembahasan (implementasi) |
| Testing              | BAB IV — Hasil & Pembahasan (pengujian) |
| Deployment           | BAB IV — Hasil & Pembahasan (deployment) |
| Maintenance          | BAB V — Penutup (saran pengembangan) |

---

## File Detail Per Fase

```
steps/sdlc/
├── 00-overview.md          ← file ini
├── 01-requirements.md      ← Fase 1: Analisis Kebutuhan
├── 02-system-design.md     ← Fase 2: Perancangan Sistem
├── 03-implementation.md    ← Fase 3: Implementasi (Coding)
├── 04-testing.md           ← Fase 4: Pengujian
├── 05-deployment.md        ← Fase 5: Deployment
└── 06-maintenance.md       ← Fase 6: Maintenance
```
