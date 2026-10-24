/**
 * @file inventory.js
 * @description Modul Manajemen Inventaris Produk & Stok Gudang.
 * Menangani penambahan produk baru, penyesuaian stok langsung, dan penghapusan item.
 */

import { store } from '../state/state.js';
import { formatRupiah } from '../utils/formatters.js';
import { toast } from '../utils/toast.js';
import { sound } from '../utils/sound.js';

class InventoryModule {
  constructor() {
    this.modalEl = null;
    this.tableBodyEl = null;
    this.formAddEl = null;
  }

  init() {
    this.modalEl = document.getElementById('modal-inventory');
    this.tableBodyEl = document.getElementById('inventory-table-body');
    this.formAddEl = document.getElementById('form-add-product');

    this.setupListeners();

    store.subscribe(() => {
      if (this.modalEl && this.modalEl.style.display !== 'none') {
        this.renderInventory();
      }
    });
  }

  openModal() {
    if (!this.modalEl) return;
    this.renderInventory();
    this.modalEl.style.display = 'flex';
  }

  closeModal() {
    if (this.modalEl) {
      this.modalEl.style.display = 'none';
    }
  }

  renderInventory() {
    if (!this.tableBodyEl) return;
    const { products } = store.getState();

    this.tableBodyEl.innerHTML = products.map(p => `
      <tr>
        <td style="font-size: 1.25rem;">${p.icon || '📦'}</td>
        <td style="font-weight: 600;">${p.name}</td>
        <td><span style="text-transform: capitalize;">${p.category}</span></td>
        <td>${formatRupiah(p.price)}</td>
        <td>
          <input 
            type="number" 
            class="stock-input-mini" 
            data-id="${p.id}" 
            value="${p.stock}" 
            min="0"
          >
        </td>
        <td>
          <button class="cart-tool-btn text-danger btn-delete-product" data-id="${p.id}" title="Hapus Produk">
            🗑️ Hapus
          </button>
        </td>
      </tr>
    `).join('');
  }

  setupListeners() {
    const btnOpen = document.getElementById('btn-open-inventory');
    if (btnOpen) {
      btnOpen.addEventListener('click', () => this.openModal());
    }

    if (this.modalEl) {
      const closeBtns = this.modalEl.querySelectorAll('[data-close-modal]');
      closeBtns.forEach(b => b.addEventListener('click', () => this.closeModal()));
    }

    if (this.formAddEl) {
      this.formAddEl.addEventListener('submit', (e) => this.handleAddProduct(e));
    }

    this.setupTableActions();
  }

  setupTableActions() {
    // Akan diisi listener edit stok dan hapus produk
  }

  handleAddProduct(e) {
    // Akan diisi logika tambah produk
  }
}

export const inventoryModule = new InventoryModule();
