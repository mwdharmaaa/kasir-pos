import { APP_CONFIG } from '../config.js';
import { toast } from '../utils/toast.js';
import { exportImportModule } from './export-import.js';

class SettingsModule {
  constructor() {
    this.modalEl = null;
    this.formEl = null;
  }

  init() {
    this.modalEl = document.getElementById('modal-settings');
    this.formEl = document.getElementById('form-settings');

    this.setupListeners();
  }

  openModal() {
    if (!this.modalEl) return;
    this.populateCurrentSettings();
    this.modalEl.style.display = 'flex';
  }

  closeModal() {
    if (this.modalEl) {
      this.modalEl.style.display = 'none';
    }
  }

  populateCurrentSettings() {
    const { store } = APP_CONFIG;
    const nameInput = document.getElementById('setting-store-name');
    const addrInput = document.getElementById('setting-store-address');
    const phoneInput = document.getElementById('setting-store-phone');
    const footerInput = document.getElementById('setting-store-footer');

    if (nameInput) nameInput.value = store.name;
    if (addrInput) addrInput.value = store.address;
    if (phoneInput) phoneInput.value = store.phone;
    if (footerInput) footerInput.value = store.receiptFooter;
  }

  setupListeners() {
    const btnOpen = document.getElementById('btn-open-settings');
    if (btnOpen) {
      btnOpen.addEventListener('click', () => this.openModal());
    }

    if (this.modalEl) {
      const closeBtns = this.modalEl.querySelectorAll('[data-close-modal]');
      closeBtns.forEach(b => b.addEventListener('click', () => this.closeModal()));
    }

    const backupBtn = document.getElementById('btn-backup-json');
    if (backupBtn) {
      backupBtn.addEventListener('click', () => exportImportModule.exportFullBackupJSON());
    }

    if (this.formEl) {
      this.formEl.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('setting-store-name').value.trim();
        const addrInput = document.getElementById('setting-store-address').value.trim();
        const phoneInput = document.getElementById('setting-store-phone').value.trim();
        const footerInput = document.getElementById('setting-store-footer').value.trim();

        if (nameInput) {
          APP_CONFIG.store.name = nameInput;
          APP_CONFIG.store.address = addrInput;
          APP_CONFIG.store.phone = phoneInput;
          APP_CONFIG.store.receiptFooter = footerInput;

          const headerName = document.getElementById('header-store-name');
          if (headerName) headerName.textContent = nameInput;

          toast.show('Pengaturan toko berhasil diperbarui!', 'success');
          this.closeModal();
        }
      });
    }
  }
}

export const settingsModule = new SettingsModule();
