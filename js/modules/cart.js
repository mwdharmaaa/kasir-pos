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
    // Akan diimplementasikan baris demi baris di commit berikutnya
  }

  setupListeners() {
    // Akan dipasang listener aksi keranjang
  }
}

export const cartModule = new CartModule();
