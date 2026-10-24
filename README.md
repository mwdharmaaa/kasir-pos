# kasir-pos

Aplikasi kasir (point of sale) berbasis web sederhana menggunakan HTML, CSS, dan JavaScript vanilla (tanpa framework / library luar).

## Fitur

- Katalog produk dan pencarian barcode
- Keranjang belanja, pengaturan kuantitas, diskon promo, dan PPN 11%
- Pembayaran tunai dengan hitung kembalian otomatis, QRIS, kartu debit, transfer
- Pratinjau dan cetak struk belanja (standar thermal printer 58mm/80mm) serta download struk .txt
- Tahan nota pesanan sementara (hold order)
- Riwayat transaksi dan pembatalan transaksi (void) dengan pengembalian stok
- Manajemen stok dan tambah produk baru
- Laporan omzet harian dan produk terlaris
- Mode gelap dan mode terang

## Shortcut Keyboard

- F2: Fokus ke kolom pencarian produk / barcode
- Enter: Tambah produk langsung saat scan barcode di kolom cari
- F4: Tahan nota pesanan (Hold)
- F8: Buka riwayat transaksi
- F9: Buka modal pembayaran
- Esc: Tutup modal pop-up aktif
- 1 - 4: Ganti metode pembayaran saat di modal bayar

## Cara Menjalankan

Cukup buka file index.html langsung di browser, atau gunakan server lokal:

```bash
python3 -m http.server 8000
```

Buka http://localhost:8000 pada browser.

## Struktur Folder

```text
kasir-pos/
├── index.html
├── test.html
├── css/
│   ├── base.css
│   ├── layout.css
│   ├── header.css
│   ├── catalog.css
│   ├── cart.css
│   ├── payment.css
│   ├── receipt.css
│   ├── modal.css
│   ├── history.css
│   ├── inventory.css
│   ├── analytics.css
│   ├── toast.css
│   ├── theme.css
│   ├── print.css
│   └── variables.css
├── js/
│   ├── app.js
│   ├── config.js
│   ├── data/
│   ├── modules/
│   ├── state/
│   ├── storage/
│   └── utils/
└── tests/
```

## Lisensi

MIT
