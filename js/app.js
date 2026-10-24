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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}
