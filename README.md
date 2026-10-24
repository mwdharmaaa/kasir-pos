# Kasir Pintar POS - Modern Web Point of Sale

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](#)
[![HTML5](https://img.shields.io/badge/HTML5-Semantic-E34F26?logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-Modern%20Grid-1572B6?logo=css3&logoColor=white)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Zero Dependency](https://img.shields.io/badge/Dependencies-Zero-brightgreen)](#)

Aplikasi kasir web modern (*Point of Sale*) buatan Indonesia yang dirancang khusus dengan kode yang **sangat bersih, modular, dan terdokumentasi rapi** untuk menjadi studi kasus terbaik dalam **belajar membaca alur kode (*code reading*)**.

---

## Fitur Unggulan

* **Super Ringan & Zero Build Tools:** Langsung buka `index.html` di browser tanpa perlu `npm install` atau bundler rumit.
* **Manajemen Katalog & Barcode:** Filter kategori interaktif, pencarian *real-time*, status stok menipis/habis, serta deteksi pemindai barcode (`Enter`).
* **Keranjang Belanja & Kalkulasi Otomatis:** Kuantitas stepper, proteksi stok gudang, perhitungan otomatis **Subtotal**, **Diskon Promo**, dan **PPN 11%**.
* **Multi Metode Pembayaran:**
  * **Tunai (Cash):** Tombol saran uang pas & kalkulator kembalian instan.
  * **QRIS Standar Nasional:** Tampilan QR interaktif dengan hitung mundur.
  * **Debit / Kredit & Transfer Bank**.
* **Struk Termal Asli & Cetak Langsung:** Pratinjau struk 58mm/80mm, integrasi `@media print` untuk printer thermal kasir, dan fitur unduh struk teks (`.txt`).
* **Fitur Tahan Nota (Hold Bill):** Tahan transaksi sementara saat pelanggan mengambil barang tambahan, lalu pulihkan kapan saja.
* **Riwayat Transaksi & Pembatalan (Void):** Lihat seluruh penjualan masa lalu, cetak ulang struk, atau batalkan transaksi dengan **pemulihan stok otomatis**.
* **Laporan & Analitik Keuangan:** Total omzet harian, jumlah transaksi, rata-rata belanja, estimasi laba kotor, dan Top 5 produk terlaris.
* **Kelola Stok Gudang (Inventory CRUD):** Tambah produk baru, ubah harga, dan sesuaikan stok barang langsung dari antarmuka kasir.
* **Ekspor & Pencadangan:** Ekspor transaksi ke spreadsheet `.csv` dan backup database lengkap ke `.json`.
* **Shortcut Keyboard Lengkap (F2, F4, F8, F9, Esc):** Kasir dapat melayani tanpa menyentuh mouse.
* **Umpan Balik Audio (Web Audio API):** Suara *beep* scan barang dan lonceng kasir saat checkout sukses tanpa file audio eksternal.
* **Mode Gelap (Dark Mode):** Desain modern ramah mata dengan peralihan mulus.

---

## Panduan Belajar Membaca Kode

Untuk kamu yang ingin mendalami bagaimana aplikasi web terstruktur rapi:

1. Baca [docs/ALUR_KODE.md](docs/ALUR_KODE.md): Penjelasan alur eksekusi baris demi baris dari klik produk hingga struk keluar.
2. Baca [docs/DATA_FLOW.md](docs/DATA_FLOW.md): Diagram siklus mutasi state dan penyimpanan `localStorage`.
3. Baca [docs/KEYBOARD_SHORTCUTS.md](docs/KEYBOARD_SHORTCUTS.md): Daftar tombol cepat kasir.
4. Buka file [test.html](test.html): Jalankan unit test otomatis untuk melihat bagaimana logika matematika diverifikasi.

---

## Struktur Folder Proyek

```text
kasir-pos/
├── index.html              # Antarmuka kasir utama (semantic HTML5)
├── test.html               # Halaman test runner otomatis untuk browser
├── css/                    # Modular styling per komponen
│   ├── variables.css       # Token warna, font, bayangan, border-radius
│   ├── base.css            # Reset CSS dan tipografi dasar
│   ├── layout.css          # Grid 2 kolom (Katalog kiri, Kasir kanan)
│   ├── header.css          # Top bar, jam digital, indikator status
│   ├── catalog.css         # Kartu produk, filter kategori, search bar
│   ├── cart.css            # Daftar keranjang, stepper kuantitas, ringkasan
│   ├── payment.css         # Modal pembayaran, tombol uang pas, QRIS
│   ├── receipt.css         # Desain struk termal standar 58mm/80mm
│   ├── modal.css           # Modal backdrop dan dialog pop-up
│   ├── history.css         # Tabel riwayat transaksi
│   ├── inventory.css       # Form kelola produk & stok
│   ├── analytics.css       # Kartu metrik omzet dan grafik penjualan
│   ├── toast.css           # Notifikasi pop-up dinamis
│   ├── theme.css           # Dukungan mode gelap (Dark Mode)
│   └── print.css           # @media print untuk printer kasir
├── js/
│   ├── config.js           # Konfigurasi toko, PPN, dan opsi pembayaran
│   ├── app.js              # Entry point aplikasi & event listeners
│   ├── utils/              # Fungsi pembantu (formatters, dates, sound, toast)
│   ├── storage/            # Wrapper aman untuk browser localStorage
│   ├── data/               # Data produk ritel awal
│   ├── state/              # Centralized reactive state store
│   └── modules/            # Modul logika bisnis aplikasi
├── tests/                  # Unit test suite mandiri
└── docs/                   # Panduan belajar mendalam
    ├── ALUR_KODE.md        # Panduan membaca alur kerja baris demi baris
    ├── DATA_FLOW.md        # Diagram alur mutasi data state
    ├── PANDUAN_KASIR.md    # Petunjuk operasional kasir
    └── KEYBOARD_SHORTCUTS.md# Daftar shortcut tombol cepat
```

---

## Cara Menjalankan

### Cara 1: Langsung di Browser
Klik dua kali file `index.html` di perangkat kamu atau buka melalui browser apa saja.

### Cara 2: Melalui Local Server (Opsional)
```bash
# Menggunakan Python bawaan:
python3 -m http.server 8000

# Buka di browser:
http://localhost:8000
```

---

## Lisensi
Dilisensikan di bawah lisensi MIT. Bebas digunakan untuk pembelajaran, portofolio, maupun pengembangan bisnis Anda.
