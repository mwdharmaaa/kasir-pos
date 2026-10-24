/**
 * @file config.js
 * @description Menyimpan konfigurasi bawaan dan pengaturan toko.
 * Modul ini menjadi acuan tunggal untuk parameter global seperti tarif pajak,
 * nama toko, dan metode pembayaran yang didukung.
 */

export const APP_CONFIG = {
  // Informasi Toko Default
  store: {
    name: 'Warung Berkah POS',
    tagline: 'Kebutuhan Harian & Kuliner Segar',
    address: 'Jl. Merdeka Raya No. 45, Jakarta Selatan',
    phone: '0812-3456-7890',
    receiptFooter: 'Terima Kasih Atas Kunjungan Anda! Barang yang sudah dibeli tidak dapat ditukar.',
    taxIdentificationNumber: 'NPWP: 01.234.567.8-901.000'
  },

  // Pengaturan Keuangan & Transaksi
  financial: {
    currency: 'IDR',
    currencySymbol: 'Rp',
    defaultTaxRate: 0.11, // PPN 11% sesuai regulasi Indonesia
    isTaxActiveByDefault: true,
    maxDiscountPercent: 50,
  },

  // Metode Pembayaran yang Didukung
  paymentMethods: [
    { id: 'cash', name: 'Tunai (Cash)', icon: '💵', shortcut: '1' },
    { id: 'qris', name: 'QRIS', icon: '📱', shortcut: '2' },
    { id: 'debit', name: 'Kartu Debit/Kredit', icon: '💳', shortcut: '3' },
    { id: 'transfer', name: 'Transfer Bank', icon: '🏦', shortcut: '4' }
  ],

  // Tombol Uang Pas Bawaan untuk Pembayaran Tunai
  quickCashPresets: [10000, 20000, 50000, 100000, 200000],

  // Kupon Promo Diskon Sederhana
  discountCoupons: {
    'HEMAT10': { type: 'percentage', value: 10, label: 'Diskon 10%' },
    'HEMAT20': { type: 'percentage', value: 20, label: 'Diskon 20%' },
    'BERKAH5K': { type: 'fixed', value: 5000, label: 'Potongan Rp 5.000' }
  },

  // Pengaturan Printer Thermal
  printer: {
    paperWidth: '58mm', // Pilihan: '58mm' atau '80mm'
    autoPrintReceipt: false,
    cutFeedLines: 3
  }
};
