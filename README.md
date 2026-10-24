# 🛒 Kasir POS - Web Point of Sale Modern

Aplikasi kasir web modern (*Point of Sale*) yang dirancang khusus dengan kode yang **sangat bersih, modular, dan terstruktur** untuk memudahkan belajar membaca alur kode (*code reading*) aplikasi web dunia nyata.

---

## 🎯 Mengapa Proyek Ini Sangat Cocok untuk Belajar Baca Kode?

1. **Zero External Dependencies / Pure Vanilla ES6+**:
   Tidak ada abstraksi framework rumit (React/Vue/Laravel). Kamu melihat langsung bagaimana JavaScript murni berinteraksi dengan DOM, menangani state, dan menghitung transaksi.
2. **Komentar Penjelasan Lengkap (Bahasa Indonesia)**:
   Setiap fungsi dilengkapi dokumentasi JSDoc (`@param`, `@returns`) dan penjelasan logika *step-by-step* di dalam tubuh fungsinya.
3. **Pemisahan Tanggung Jawab (*Separation of Concerns*)**:
   Tiap fitur dipisah menjadi file terpisah di folder `js/modules/` dan `css/`. Kamu bisa melacak alur data dengan mudah tanpa tersesat di ribuan baris kode.
4. **Alur Input-Proses-Output Nyata**:
   Mulai dari memilih produk, menghitung keranjang, kalkulasi PPN & diskon, pembayaran tunai/QRIS, cetak struk termal, hingga laporan analitik omzet harian.

---

## 📁 Struktur Folder Proyek

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
│   ├── utils/              # Fungsi pembantu (helper)
│   │   ├── formatters.js   # Format Rupiah (Rp) dan parsing angka
│   │   ├── date-helpers.js # Format tanggal dan jam lokal Indonesia
│   │   ├── sound.js        # Efek suara kasir via Web Audio API
│   │   └── toast.js        # Notifikasi visual non-intrusif
│   ├── storage/
│   │   └── storage.js      # Wrapper aman untuk browser localStorage
│   ├── data/
│   │   └── sample-data.js  # Data produk ritel awal (kategori, barcode, harga)
│   ├── state/
│   │   └── state.js        # Reactive central state (Cart, Catalog, Active Filters)
│   └── modules/            # Modul logika bisnis aplikasi
│       ├── header.js       # Jam live & statistik kilat
│       ├── theme.js        # Switcher tema Gelap / Terang
│       ├── catalog.js      # Render produk, filter kategori, pencarian
│       ├── cart.js         # Tambah, kuantitas, hapus, subtotal, diskon, PPN
│       ├── hold.js         # Fitur simpan/tahan nota pesanan (Hold Order)
│       ├── payment.js      # Kalkulator tunai, kembalian, simulasi QRIS
│       ├── receipt.js      # Generate struk belanja, print & download teks
│       ├── history.js      # Riwayat penjualan, cetak ulang, batalkan transaksi
│       ├── inventory.js    # Tambah, ubah, hapus produk & cek stok menipis
│       ├── analytics.js    # Perhitungan omzet harian & menu terlaris
│       ├── export-import.js# Ekspor transaksi ke CSV & backup JSON
│       ├── settings.js     # Modal edit profil toko & tarif pajak
│       └── shortcuts.js    # Tombol pintas keyboard kasir (F1 - F9, Esc)
├── tests/                  # Unit test suite mandiri
└── docs/                   # Panduan belajar mendalam
    ├── ALUR_KODE.md        # Panduan membaca alur kerja baris demi baris
    ├── DATA_FLOW.md        # Diagram alur mutasi data state
    ├── PANDUAN_KASIR.md    # Petunjuk operasional kasir
    └── KEYBOARD_SHORTCUTS.md# Daftar shortcut tombol cepat
```
