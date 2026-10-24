/**
 * @file cart.js
 * @description Modul pengelola keranjang belanja:
 * Menangani penambahan produk, pengaturan kuantitas, kalkulasi diskon & PPN,
 * serta penghitungan grand total.
 */

import { store } from '../state/state.js';
import { APP_CONFIG } from '../config.js';
import { formatRupiah } from '../utils/formatters.js';
import { sound } from '../utils/sound.js';
import { toast } from '../utils/toast.js';

class CartModule {
  constructor() {
    this.cartListEl = null;
    this.itemCountBadgeEl = null;
    this.subtotalEl = null;
    this.discountEl = null;
    this.taxEl = null;
    this.grandTotalEl = null;
    this.btnCheckout = null;
    this.btnCheckoutTotal = null;
    this.taxToggleEl = null;
    this.customerNameInput = null;
    this.customerTableInput = null;
  }

  init() {
    this.cartListEl = document.getElementById('cart-items-list');
    this.itemCountBadgeEl = document.getElementById('cart-item-count-badge');
    this.subtotalEl = document.getElementById('cart-subtotal');
    this.discountEl = document.getElementById('cart-discount');
    this.taxEl = document.getElementById('cart-tax');
    this.grandTotalEl = document.getElementById('cart-grand-total');
    this.btnCheckout = document.getElementById('btn-open-payment');
    this.btnCheckoutTotal = document.getElementById('btn-checkout-total');
    this.taxToggleEl = document.getElementById('tax-toggle');
    this.customerNameInput = document.getElementById('customer-name-input');
    this.customerTableInput = document.getElementById('customer-table-input');

    this.renderCart();
    this.setupListeners();

    // Dengarkan event add-to-cart dari modul katalog / scanner
    window.addEventListener('pos:add-to-cart', (e) => {
      this.addToCart(e.detail.productId);
    });

    // Subscribe ke perubahan state
    store.subscribe(() => {
      this.renderCart();
    });
  }

  /**
   * Menambahkan produk ke keranjang berdasarkan ID produk
   * @param {string} productId
   */
  /**
   * Memeriksa apakah penambahan kuantitas masih dalam batas stok gudang
   * @param {Object} product
   * @param {number} desiredQty
   * @returns {boolean}
   */
  canAddMoreStock(product, desiredQty) {
    return desiredQty <= product.stock;
  }

  addToCart(productId) {
    const { products, cart } = store.getState();
    const product = products.find(p => p.id === productId);

    if (!product) return;

    if (product.stock <= 0) {
      sound.playError();
      toast.show(`Stok produk "${product.name}" sudah habis!`, 'danger');
      return;
    }

    const existingIndex = cart.findIndex(item => item.id === productId);
    let updatedCart = [...cart];

    if (existingIndex > -1) {
      const currentQty = updatedCart[existingIndex].qty;
      if (currentQty + 1 > product.stock) {
        sound.playError();
        toast.show(`Maksimal stok tercapai untuk "${product.name}" (${product.stock})`, 'warning');
        return;
      }
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        qty: currentQty + 1
      };
    } else {
      updatedCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        costPrice: product.costPrice || product.price * 0.6,
        barcode: product.barcode,
        icon: product.icon,
        stock: product.stock,
        qty: 1
      });
    }

    sound.playBeep();
    store.setState({ cart: updatedCart });
  }

  renderCart() {
    if (!this.cartListEl) return;
    const { cart } = store.getState();

    // Hitung total kuantitas item
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    if (this.itemCountBadgeEl) {
      this.itemCountBadgeEl.textContent = `${totalItems} item`;
    }

    if (cart.length === 0) {
      this.cartListEl.innerHTML = `
        <div class="empty-cart-state">
          <span class="empty-cart-icon">🛒</span>
          <span class="empty-cart-text">Keranjang masih kosong</span>
          <span style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">
            Klik produk di sebelah kiri untuk menambah pesanan
          </span>
        </div>
      `;
      this.updateFinancialSummary();
      return;
    }

    this.cartListEl.innerHTML = cart.map(item => `
      <div class="cart-item-row" data-item-id="${item.id}">
        <div class="cart-item-info">
          <span class="cart-item-icon">${item.icon || '📦'}</span>
          <div class="cart-item-meta">
            <h4 class="cart-item-title">${item.name}</h4>
            <span class="cart-item-single-price">${formatRupiah(item.price)}</span>
          </div>
        </div>

        <div class="cart-item-actions">
          <div class="qty-stepper">
            <button class="btn-qty-decrease" data-id="${item.id}" title="Kurangi kuantitas">-</button>
            <span class="qty-display">${item.qty}</span>
            <button class="btn-qty-increase" data-id="${item.id}" title="Tambah kuantitas">+</button>
          </div>
          <span class="cart-item-subtotal">${formatRupiah(item.price * item.qty)}</span>
          <button class="btn-remove-item" data-id="${item.id}" title="Hapus item">&times;</button>
        </div>
      </div>
    `).join('');

    this.updateFinancialSummary();
  }

  /**
   * Menghitung subtotal dari seluruh baris barang belanjaan
   * @param {Array} cart
   * @returns {number}
   */
  calculateSubtotal(cart) {
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }

  updateFinancialSummary() {
    const { cart, discount, isTaxActive } = store.getState();
    const subtotal = this.calculateSubtotal(cart);

    if (this.subtotalEl) {
      this.subtotalEl.textContent = formatRupiah(subtotal);
    }

    // Perhitungan diskon, pajak, dan grand total akan disambung di commit berikutnya
    this.calculateAllTotals(subtotal, discount, isTaxActive);
  }

  /**
   * Menghitung nilai PPN berdasarkan subtotal bersih setelah diskon
   * @param {number} taxableAmount
   * @param {boolean} isTaxActive
   * @returns {number}
   */
  calculateTax(taxableAmount, isTaxActive) {
    if (!isTaxActive || taxableAmount <= 0) return 0;
    return Math.round(taxableAmount * APP_CONFIG.financial.defaultTaxRate);
  }

  /**
   * Menghitung potongan nominal dari diskon aktif
   * @param {number} subtotal
   * @param {Object} discount
   * @returns {number}
   */
  calculateDiscountAmount(subtotal, discount) {
    if (!discount || discount.value <= 0 || subtotal <= 0) return 0;

    if (discount.type === 'percentage') {
      return Math.round(subtotal * (discount.value / 100));
    }
    if (discount.type === 'fixed') {
      return Math.min(discount.value, subtotal);
    }
    return 0;
  }

  calculateAllTotals(subtotal, discount, isTaxActive) {
    const discountAmount = this.calculateDiscountAmount(subtotal, discount);
    const afterDiscount = Math.max(0, subtotal - discountAmount);
    const taxAmount = this.calculateTax(afterDiscount, isTaxActive);
    const grandTotal = afterDiscount + taxAmount;

    if (this.discountEl) {
      this.discountEl.textContent = discountAmount > 0 ? `- ${formatRupiah(discountAmount)}` : 'Rp 0';
    }
    if (this.taxEl) {
      this.taxEl.textContent = formatRupiah(taxAmount);
    }
    if (this.grandTotalEl) {
      this.grandTotalEl.textContent = formatRupiah(grandTotal);
    }
    if (this.btnCheckoutTotal) {
      this.btnCheckoutTotal.textContent = formatRupiah(grandTotal);
    }

    if (this.btnCheckout) {
      this.btnCheckout.disabled = grandTotal <= 0;
    }
  }

  setupListeners() {
    if (this.cartListEl) {
      this.cartListEl.addEventListener('click', (e) => {
        const incBtn = e.target.closest('.btn-qty-increase');
        const decBtn = e.target.closest('.btn-qty-decrease');
        const removeBtn = e.target.closest('.btn-remove-item');

        if (incBtn) {
          this.increaseQty(incBtn.dataset.id);
        } else if (decBtn) {
          this.decreaseQty(decBtn.dataset.id);
        } else if (removeBtn) {
          this.removeItem(removeBtn.dataset.id);
        }
      });
    }
  }

  increaseQty(productId) {
    const { cart, products } = store.getState();
    const product = products.find(p => p.id === productId);
    const item = cart.find(i => i.id === productId);

    if (!item || !product) return;

    if (item.qty + 1 > product.stock) {
      sound.playError();
      toast.show(`Stok maksimal untuk ${product.name} adalah ${product.stock}`, 'warning');
      return;
    }

    const updated = cart.map(i => i.id === productId ? { ...i, qty: i.qty + 1 } : i);
    sound.playBeep();
    store.setState({ cart: updated });
  }

  decreaseQty(productId) {
    const { cart } = store.getState();
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    if (item.qty - 1 <= 0) {
      this.removeItem(productId);
    } else {
      const updated = cart.map(i => i.id === productId ? { ...i, qty: i.qty - 1 } : i);
      sound.playBeep();
      store.setState({ cart: updated });
    }
  }

  removeItem(productId) {
    const { cart } = store.getState();
    const targetItem = cart.find(i => i.id === productId);
    if (!targetItem) return;

    const updated = cart.filter(i => i.id !== productId);
    store.setState({ cart: updated });
    toast.show(`"${targetItem.name}" dihapus dari keranjang`, 'info');
  }
}

export const cartModule = new CartModule();
