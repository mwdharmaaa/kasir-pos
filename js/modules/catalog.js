/**
 * @file catalog.js
 * @description Modul pengelola katalog: render filter kategori, kartu produk,
 * dan fitur pencarian teks / barcode scanner.
 */

import { store } from '../state/state.js';
import { formatRupiah } from '../utils/formatters.js';
import { sound } from '../utils/sound.js';
import { toast } from '../utils/toast.js';

class CatalogModule {
  constructor() {
    this.categoriesBarEl = null;
    this.productsGridEl = null;
    this.searchInputEl = null;
    this.clearSearchBtn = null;
  }

  init() {
    this.categoriesBarEl = document.getElementById('categories-bar');
    this.productsGridEl = document.getElementById('products-grid');
    this.searchInputEl = document.getElementById('search-input');
    this.clearSearchBtn = document.getElementById('btn-clear-search');

    this.renderCategories();
    this.renderProducts();
    this.setupListeners();

    // Subscribe ke perubahan state (misal saat stok berkurang atau filter berganti)
    store.subscribe((state) => {
      this.renderProducts(state);
    });
  }

  renderCategories() {
    if (!this.categoriesBarEl) return;
    const { categories, activeCategory } = store.getState();

    this.categoriesBarEl.innerHTML = categories.map(cat => `
      <button 
        class="category-pill ${cat.id === activeCategory ? 'active' : ''}" 
        data-category-id="${cat.id}"
      >
        <span>${cat.icon}</span>
        <span>${cat.name}</span>
      </button>
    `).join('');
  }

  renderProducts(state = store.getState()) {
    // Akan diimplementasikan lebih detail di commit berikutnya
  }

  setupListeners() {
    // Akan dihubungkan dengan event click kategori dan search input
  }
}

export const catalogModule = new CatalogModule();
