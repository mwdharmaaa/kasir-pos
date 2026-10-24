# Panduan Membaca Alur Kode Kasir POS

Dokumen ini ditulis untuk membantumu menelusuri bagaimana data dan aksi berjalan di dalam aplikasi ini dari awal sampai akhir.

---

## 1. Titik Awal: Aplikasi Dimuat (`App Bootstrap`)

Ketika file `index.html` dibuka di browser, inilah urutan file yang dieksekusi:

1. **`js/config.js`**: Menyiapkan konfigurasi default toko (nama toko, PPN 11%, format mata uang).
2. **`js/storage/storage.js`**: Mengecek apakah ada data di `localStorage`. Jika baru pertama kali dibuka, data dari `js/data/sample-data.js` akan disuntikkan secara otomatis.
3. **`js/state/state.js`**: Menginisialisasi objek `state` (penampung data keranjang, filter aktif, data produk aktif).
4. **`js/app.js`**: Memanggil fungsi `init()` yang menghubungkan semua modul:
   * Menyalakan jam digital di header (`headerModule.init()`).
   * Merender tombol kategori dan katalog produk (`catalogModule.init()`).
   * Merender keranjang belanja kosong (`cartModule.init()`).
   * Memasang pendengar keyboard shortcut (`shortcutsModule.init()`).

---

## 2. Alur Transaksi: Saat Tombol Produk Diklik

Mari kita telusuri baris per baris apa yang terjadi saat kasir mengklik sebuah produk:

```text
[Klik Kartu Produk]
       │
       ▼
1. Event Listener di `js/modules/catalog.js` mendeteksi klik pada `.product-card`.
2. Mengambil atribut data: `data-product-id`.
3. Memanggil fungsi `cartModule.addToCart(productId)`.
       │
       ▼
[Logika di `js/modules/cart.js`]
4. Mengecek stok produk: apakah stok masih ada (> 0)?
   - Jika habis: panggil `sound.playError()` dan tampilkan `toast.show('Stok Habis!', 'danger')`.
   - Jika ada: lanjutkan.
5. Mengecek apakah item sudah ada di dalam keranjang (`state.cart`):
   - Jika sudah ada: tambahkan jumlahnya (`item.qty += 1`).
   - Jika belum ada: buat objek item baru `{ ...product, qty: 1 }` dan masukkan ke array `state.cart`.
6. Bunyikan efek suara `sound.playBeep()` (umpan balik audio kasir).
7. Simpan state keranjang ke `localStorage`.
8. Panggil `cartModule.renderCart()` untuk memperbarui tampilan di layar.
       │
       ▼
[Kalkulasi Keuangan di `cartModule.renderCart()`]
9. Hitung Subtotal = jumlah dari semua (harga * kuantitas).
10. Hitung Diskon = persentase diskon atau kupon potongan.
11. Hitung PPN (11%) jika saklar pajak aktif.
12. Hitung Grand Total = (Subtotal - Diskon) + PPN.
13. Update angka di elemen HTML `#cart-subtotal`, `#cart-tax`, `#cart-grand-total`.
```

---

## 3. Alur Pembayaran: Dari Klik Bayar Hingga Cetak Struk

```text
[Klik Tombol Bayar (F9)]
       │
       ▼
1. `paymentModule.openPaymentModal()` menampilkan jendela pembayaran.
2. Kasir memilih metode pembayaran (Tunai / QRIS / Debit / Transfer).
3. Jika Tunai:
   - Kasir mengetik nominal atau menekan tombol cepat uang pas (misal: Rp 50.000 / Rp 100.000).
   - Fungsi `paymentModule.calculateChange()` otomatis menghitung:
     `Kembalian = Uang Diterima - Grand Total`.
4. Kasir klik "Selesaikan Transaksi":
   - Cek apakah uang cukup: jika kurang, cegah transaksi dan beritahu kasir.
   - Jika cukup: buat objek data transaksi lengkap dengan ID unik (`TRX-YYYYMMDD-XXXX`).
   - Kurangi stok barang di katalog (`inventoryModule.deductStock(state.cart)`).
   - Masukkan transaksi ke riwayat (`historyModule.recordTransaction(transaction)`).
   - Mainkan suara lonceng kasir `sound.playSuccess()`.
   - Buka modal Struk Termal (`receiptModule.showReceipt(transaction)`).
   - Kosongkan keranjang belanja untuk transaksi berikutnya.
```
