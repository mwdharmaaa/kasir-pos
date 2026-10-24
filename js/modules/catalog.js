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

  /**
   * Menentukan klasifikasi ketersediaan stok produk
   * @param {number} stock
   * @returns {'out'|'low'|'normal'}
   */
  getStockStatus(stock) {
    if (stock <= 0) return 'out';
    if (stock <= 5) return 'low';
    return 'normal';
  }

  renderProducts(state = store.getState()) {
    if (!this.productsGridEl) return;

    const { products, activeCategory, searchQuery } = state;

    // Filter berdasarkan kategori dan teks pencarian
    const filteredProducts = products.filter(product => {
      const matchCategory = activeCategory === 'all' || product.category === activeCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchName = product.name.toLowerCase().includes(query);
      const matchBarcode = product.barcode && product.barcode.includes(query);

      return matchCategory && (matchName || matchBarcode);
    });

    if (filteredProducts.length === 0) {
      this.productsGridEl.innerHTML = `
        <div class="empty-catalog-state">
          <span class="empty-icon">🔎</span>
          <p class="empty-title">Produk Tidak Ditemukan</p>
          <span class="empty-desc">Coba gunakan kata kunci lain atau pilih kategori lain.</span>
        </div>
      `;
      return;
    }

    this.productsGridEl.innerHTML = filteredProducts.map(p => {
      const isOutOfStock = p.stock <= 0;
      const isLowStock = p.stock > 0 && p.stock <= 5;

      return `
        <div 
          class="product-card ${isOutOfStock ? 'out-of-stock' : ''}" 
          data-product-id="${p.id}"
          tabindex="0"
          role="button"
          aria-label="${p.name}, harga ${formatRupiah(p.price)}"
        >
          <div class="product-icon-wrap">
            <span class="product-icon">${p.icon || '📦'}</span>
            <span class="stock-badge ${isOutOfStock ? 'badge-danger' : (isLowStock ? 'badge-warning' : 'badge-normal')}">
              ${isOutOfStock ? 'Habis' : `Stok: ${p.stock}`}
            </span>
          </div>
          <div class="product-body">
            <h3 class="product-name" title="${p.name}">${p.name}</h3>
            <span class="product-barcode">${p.barcode}</span>
            <div class="product-footer">
              <span class="product-price">${formatRupiah(p.price)}</span>
              <button 
                class="btn-add-product" 
                ${isOutOfStock ? 'disabled' : ''} 
                title="${isOutOfStock ? 'Stok habis' : 'Tambah ke keranjang'}"
              >
                +
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  setupListeners() {
    if (this.categoriesBarEl) {
      this.categoriesBarEl.addEventListener('click', (e) => {
        const btn = e.target.closest('.category-pill');
        if (!btn) return;

        const categoryId = btn.dataset.categoryId;
        this.selectCategory(categoryId);
      });
    }
  }

  selectCategory(categoryId) {
    store.setState({ activeCategory: categoryId });
    this.renderCategories();
  }
}

export const catalogModule = new CatalogModule();
