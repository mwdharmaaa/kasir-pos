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
      if (e.key === 'F2') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }

      if (e.key === 'F4') {
        e.preventDefault();
        holdModule.holdCurrentOrder();
      }

      if (e.key === 'F8') {
        e.preventDefault();
        historyModule.openModal();
      }

      if (e.key === 'F9') {
        e.preventDefault();
        paymentModule.openPaymentModal();
      }

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
