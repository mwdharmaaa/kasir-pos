/**
 * @file app.js
 * @description Titik masuk utama aplikasi (Application Bootstrap).
 * Menginisialisasi dan menghubungkan seluruh modul kasir saat DOM siap.
 */

import { headerModule } from './modules/header.js';
import { themeModule } from './modules/theme.js';
import { catalogModule } from './modules/catalog.js';
import { cartModule } from './modules/cart.js';
import { holdModule } from './modules/hold.js';
import { paymentModule } from './modules/payment.js';
import { receiptModule } from './modules/receipt.js';
import { historyModule } from './modules/history.js';
import { inventoryModule } from './modules/inventory.js';
import { analyticsModule } from './modules/analytics.js';
import { settingsModule } from './modules/settings.js';
import { shortcutsModule } from './modules/shortcuts.js';
import { exportImportModule } from './modules/export-import.js';

class App {
  static init() {
    console.log('%c🛒 Kasir POS Modern Siap Digunakan', 'color: #10b981; font-weight: bold; font-size: 14px;');

    // Inisialisasi setiap modul
    themeModule.init();
    headerModule.init();
    catalogModule.init();
    cartModule.init();
    holdModule.init();
    paymentModule.init();
    receiptModule.init();
    historyModule.init();
    inventoryModule.init();
    analyticsModule.init();
    settingsModule.init();
    shortcutsModule.init();
    exportImportModule.init();
  }
}

// Jalankan ketika seluruh elemen DOM siap dimanipulasi
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}
