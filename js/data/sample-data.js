/**
 * @file sample-data.js
 * @description Data awal katalog produk ritel & kuliner khas Indonesia.
 * Digunakan saat aplikasi pertama kali dijalankan.
 */

export const INITIAL_CATEGORIES = [
  { id: 'all', name: 'Semua Produk', icon: '' },
  { id: 'makanan', name: 'Makanan', icon: '' },
  { id: 'minuman', name: 'Minuman', icon: '' },
  { id: 'snack', name: 'Camilan & Snack', icon: '' },
  { id: 'sembako', name: 'Kebutuhan Harian', icon: '' }
];

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-001',
    name: 'Kopi Susu Gula Aren',
    category: 'minuman',
    price: 18000,
    costPrice: 9000,
    stock: 45,
    barcode: '8991001001',
    icon: 'MNM',
    description: 'Espresso robusta dengan susu segar dan gula aren asli.'
  },
  {
    id: 'prod-002',
    name: 'Es Teh Manis Jumbo',
    category: 'minuman',
    price: 6000,
    costPrice: 2000,
    stock: 80,
    barcode: '8991001002',
    icon: 'MNM',
    description: 'Teh melati seduh segar ukuran 22oz manis pas.'
  },
  {
    id: 'prod-003',
    name: 'Mie Goreng Spesial Telur',
    category: 'makanan',
    price: 15000,
    costPrice: 8000,
    stock: 30,
    barcode: '8991001003',
    icon: 'MKN',
    description: 'Mie goreng komplit dengan telur mata sapi dan sayuran.'
  },
  {
    id: 'prod-004',
    name: 'Nasi Goreng Ayam Suwir',
    category: 'makanan',
    price: 22000,
    costPrice: 11000,
    stock: 25,
    barcode: '8991001004',
    icon: 'MKN',
    description: 'Nasi goreng harum bumbu rempah dengan topping ayam dan kerupuk.'
  },
  {
    id: 'prod-005',
    name: 'Roti Bakar Coklat Keju',
    category: 'makanan',
    price: 16000,
    costPrice: 7500,
    stock: 18,
    barcode: '8991001005',
    icon: 'MKN',
    description: 'Roti tebal panggang lumer dengan meses coklat dan keju parut.'
  },
  {
    id: 'prod-006',
    name: 'Keripik Singkong Balado',
    category: 'snack',
    price: 8500,
    costPrice: 5000,
    stock: 40,
    barcode: '8991001006',
    icon: 'SNK',
    description: 'Keripik singkong renyah dengan balutan cabai balado pedas manis.'
  },
  {
    id: 'prod-007',
    name: 'Kacang Atom Renyah 150g',
    category: 'snack',
    price: 9500,
    costPrice: 6000,
    stock: 35,
    barcode: '8991001007',
    icon: 'SNK',
    description: 'Kacang salut tepung gurih cocok untuk teman santai.'
  },
  {
    id: 'prod-008',
    name: 'Air Mineral Botol 600ml',
    category: 'minuman',
    price: 4000,
    costPrice: 2200,
    stock: 120,
    barcode: '8991001008',
    icon: 'MNM',
    description: 'Air mineral pegunungan alami segar.'
  },
  {
    id: 'prod-009',
    name: 'Minyak Goreng Pouch 1L',
    category: 'sembako',
    price: 19500,
    costPrice: 16500,
    stock: 5, // Stok sedikit untuk tes status low-stock
    barcode: '8991001009',
    icon: 'SBK',
    description: 'Minyak goreng kelapa sawit murni kualitas premium.'
  },
  {
    id: 'prod-010',
    name: 'Gula Pasir Kristal 1kg',
    category: 'sembako',
    price: 17500,
    costPrice: 15000,
    stock: 0, // Stok habis untuk tes guard stok kosong
    barcode: '8991001010',
    icon: 'SBK',
    description: 'Gula tebu putih higienis manis alami.'
  },
  {
    id: 'prod-011',
    name: 'Beras Premium 5kg',
    category: 'sembako',
    price: 74000,
    costPrice: 65000,
    stock: 15,
    barcode: '8991001011',
    icon: '',
    description: 'Beras pandan wangi pulen, bersih dari kutu dan batu.'
  },
  {
    id: 'prod-012',
    name: 'Biskuit Coklat Krim',
    category: 'snack',
    price: 11000,
    costPrice: 7500,
    stock: 28,
    barcode: '8991001012',
    icon: 'SNK',
    description: 'Biskuit renyah sandwich krim coklat lezat.'
  }
];
