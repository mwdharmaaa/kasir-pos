# Diagram Alur Data (State Management)

Aplikasi ini menggunakan pola **Centralized State** sederhana tanpa framework luar. Semua perubahan data mengalir satu arah (*Single Source of Truth*).

```text
       ┌────────────────────────┐
       │     User Interaction   │
       │ (Click / Input / Key)  │
       └───────────┬────────────┘
                   │ Memanggil Action
                   ▼
       ┌────────────────────────┐
       │   Business Logic Func  │
       │   (cart, payment, etc) │
       └───────────┬────────────┘
                   │ Memutasi Data
                   ▼
       ┌────────────────────────┐
       │      State Store       │ <─── Sinkronisasi otomatis ke
       │   (js/state/state.js)  │      Browser localStorage
       └───────────┬────────────┘
                   │ Memicu Render Ulang
                   ▼
       ┌────────────────────────┐
       │     DOM Update & UI    │
       │   (HTML Elements View) │
       └────────────────────────┘
```

## Struktur Objek State Utama

```javascript
const state = {
  // Daftar semua produk yang tersedia
  products: [],

  // Item yang sedang aktif di keranjang belanja
  cart: [],

  // Kategori yang sedang dipilih di filter ("all", "makanan", dll)
  activeCategory: 'all',

  // Kata kunci pencarian produk
  searchQuery: '',

  // Diskon yang sedang diterapkan
  discount: {
    type: 'percentage', // 'percentage' | 'fixed'
    value: 0,
    code: ''
  },

  // Pengaturan pajak PPN (11%)
  isTaxEnabled: true,

  // Data pelanggan opsional (nama & catatan meja)
  customer: {
    name: 'Pelanggan Umum',
    note: ''
  },

  // Daftar pesanan yang ditahan sementara (Hold Bills)
  heldOrders: [],

  // Riwayat semua transaksi yang berhasil
  transactions: []
};
```
