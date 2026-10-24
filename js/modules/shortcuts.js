/**
 * @file shortcuts.js
 * @description Modul Tombol Pintas Keyboard Kasir (Keyboard Shortcuts).
 * Mengoptimalkan kecepatan kasir saat melayani antrean:
 * - F2: Fokus ke kotak pencarian produk / barcode
 * - F4: Tahan nota pesanan (Hold Order)
 * - F8: Buka riwayat transaksi
 * - F9: Buka modal pembayaran
 * - Esc: Tutup modal pop-up yang sedang aktif
 */

import { paymentModule } from './payment.js';
import { holdModule } from './hold.js';
import { historyModule } from './history.js';

class ShortcutsModule {
  init() {
    const btnShortcuts = document.getElementById('btn-open-shortcuts');
    const modalShortcuts = document.getElementById('modal-shortcuts');

    if (btnShortcuts && modalShortcuts) {
      btnShortcuts.addEventListener('click', () => {
        modalShortcuts.style.display = 'flex';
      });

      const closeBtns = modalShortcuts.querySelectorAll('[data-close-modal]');
      closeBtns.forEach(b => b.addEventListener('click', () => {
        modalShortcuts.style.display = 'none';
      }));
    }

    window.addEventListener('keydown', (e) => {
      // 1. F2 -> Fokus pencarian produk
      if (e.key === 'F2') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }

      // 2. F4 -> Tahan Pesanan (Hold Bill)
      if (e.key === 'F4') {
        e.preventDefault();
        holdModule.holdCurrentOrder();
      }

      // 3. F8 -> Riwayat Transaksi
      if (e.key === 'F8') {
        e.preventDefault();
        historyModule.openModal();
      }

      // 4. F9 -> Buka Modal Bayar
      if (e.key === 'F9') {
        e.preventDefault();
        paymentModule.openPaymentModal();
      }

      // 5. Esc -> Tutup Modal yang sedang terbuka
      if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.pos-modal-backdrop');
        openModals.forEach(m => {
          if (m.style.display !== 'none') {
            m.style.display = 'none';
          }
        });
      }
    });
  }
}

export const shortcutsModule = new ShortcutsModule();
