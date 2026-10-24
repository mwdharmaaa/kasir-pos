export const APP_CONFIG = {
  store: {
    name: 'Warung Berkah POS',
    tagline: 'Kebutuhan Harian & Kuliner Segar',
    address: 'Jl. Merdeka Raya No. 45, Jakarta Selatan',
    phone: '0812-3456-7890',
    receiptFooter: 'Terima Kasih Atas Kunjungan Anda! Barang yang sudah dibeli tidak dapat ditukar.',
    taxIdentificationNumber: 'NPWP: 01.234.567.8-901.000'
  },

  financial: {
    currency: 'IDR',
    currencySymbol: 'Rp',
    defaultTaxRate: 0.11,
    isTaxActiveByDefault: true,
    maxDiscountPercent: 50,
  },

  paymentMethods: [
    { id: 'cash', name: 'Tunai (Cash)', icon: 'TUNAI', shortcut: '1' },
    { id: 'qris', name: 'QRIS', icon: 'QRIS', shortcut: '2' },
    { id: 'debit', name: 'Kartu Debit/Kredit', icon: 'KARTU', shortcut: '3' },
    { id: 'transfer', name: 'Transfer Bank', icon: 'BANK', shortcut: '4' }
  ],

  quickCashPresets: [10000, 20000, 50000, 100000, 200000],

  discountCoupons: {
    'HEMAT10': { type: 'percentage', value: 10, label: 'Diskon 10%' },
    'HEMAT20': { type: 'percentage', value: 20, label: 'Diskon 20%' },
    'BERKAH5K': { type: 'fixed', value: 5000, label: 'Potongan Rp 5.000' }
  },

  printer: {
    paperWidth: '58mm',
    autoPrintReceipt: false,
    cutFeedLines: 3
  }
};
