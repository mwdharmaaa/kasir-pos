# 📖 Panduan Operasional Kasir (Manual Kasir POS)

Selamat datang di aplikasi Kasir POS Modern. Panduan ini menjelaskan tata cara transaksi sehari-hari bagi staf kasir.

---

## 1. Memulai Hari Kerja
1. Buka aplikasi di browser (cukup klik dua kali `index.html`).
2. Periksa jam dan tanggal di pojok kiri atas untuk memastikan sistem sinkron.
3. Cek stok produk di katalog (indikator merah berarti stok habis, kuning berarti menipis).

---

## 2. Melayani Transaksi Pelanggan
1. **Memilih Barang:**
   - Klik kartu produk di katalog, ATAU
   - Tekan `F2`, scan barcode fisik atau ketik nama produk, lalu tekan `Enter`.
2. **Mengubah Jumlah Barang:**
   - Gunakan tombol `+` atau `-` pada daftar keranjang di sebelah kanan.
3. **Menerapkan Diskon (Opsional):**
   - Klik tombol **Pilih Promo** di bagian kalkulasi untuk memilih diskon 5%, 10%, 20%, atau masukkan kode kupon (`HEMAT10` / `BERKAH5K`).
4. **Pajak PPN 11%:**
   - Saklar PPN aktif secara default. Matikan jika pelanggan berstatus bebas pajak.

---

## 3. Pembayaran & Cetak Struk
1. Tekan tombol **Bayar Pesanan (F9)**.
2. Pilih metode bayar:
   - **Tunai**: Masukkan uang pelanggan atau klik tombol cepat (misal Rp 50.000). Sistem otomatis menampilkan nominal kembalian.
   - **QRIS**: Tunjukkan kode QR di layar kepada pelanggan untuk dipindai via GoPay/OVO/BCA/Dana.
3. Klik **Selesaikan & Cetak Struk**.
4. Di jendela struk, klik **Cetak Struk** untuk mengirim perintah langsung ke printer termal, atau **Unduh Teks** untuk arsip digital.
