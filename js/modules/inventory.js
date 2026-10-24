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
        <td style="font-weight: 700; font-size: 0.75rem;">${p.icon || 'ITEM'}</td>
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
            Hapus
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
    if (!this.tableBodyEl) return;

    // Listener ganti stok langsung dari input
    this.tableBodyEl.addEventListener('change', (e) => {
      const stockInput = e.target.closest('.stock-input-mini');
      if (stockInput) {
        const prodId = stockInput.dataset.id;
        const newStock = Math.max(0, parseInt(stockInput.value, 10) || 0);

        const { products } = store.getState();
        const updated = products.map(p => p.id === prodId ? { ...p, stock: newStock } : p);
        store.setState({ products: updated });
        toast.show('Stok berhasil diperbarui', 'info');
      }
    });

    // Listener tombol hapus produk
    this.tableBodyEl.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('.btn-delete-product');
      if (deleteBtn) {
        const prodId = deleteBtn.dataset.id;
        const { products } = store.getState();
        const target = products.find(p => p.id === prodId);
        if (!target) return;

        if (confirm(`Yakin ingin menghapus produk "${target.name}"?`)) {
          const updated = products.filter(p => p.id !== prodId);
          store.setState({ products: updated });
          toast.show(`Produk "${target.name}" dihapus`, 'info');
          this.renderInventory();
        }
      }
    });
  }

  handleAddProduct(e) {
    e.preventDefault();
    const name = document.getElementById('inv-name').value.trim();
    const category = document.getElementById('inv-category').value;
    const price = Number(document.getElementById('inv-price').value) || 0;
    const stock = Number(document.getElementById('inv-stock').value) || 0;
    const barcode = document.getElementById('inv-barcode').value.trim() || `899${Date.now().toString().slice(-7)}`;
    const icon = document.getElementById('inv-icon').value.trim() || 'ITEM';

    if (!name || price <= 0) {
      toast.show('Mohon lengkapi nama dan harga produk yang valid', 'warning');
      return;
    }

    const { products } = store.getState();
    const newProduct = {
      id: `prod-${Date.now()}`,
      name,
      category,
      price,
      costPrice: price * 0.6,
      stock,
      barcode,
      icon,
      description: 'Produk ditambahkan manual dari kasir.'
    };

    store.setState({
      products: [newProduct, ...products]
    });

    sound.playSuccess();
    toast.show(`Produk "${name}" berhasil ditambahkan!`, 'success');
    this.formAddEl.reset();
    this.renderInventory();
  }
}

export const inventoryModule = new InventoryModule();
