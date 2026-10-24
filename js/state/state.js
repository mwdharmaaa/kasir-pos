/**
 * @file state.js
 * @description Centralized State Store untuk Kasir POS.
 * Mengelola seluruh data aktif dalam sesi (Cart, Products, Filters, Discounts)
 * dengan pola observer/listener sederhana.
 */

import { storage } from '../storage/storage.js';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../data/sample-data.js';
import { APP_CONFIG } from '../config.js';

class StateStore {
  constructor() {
    this.listeners = [];
    
    // Inisialisasi state dari localStorage atau default
    const savedProducts = storage.get('products');
    const savedTransactions = storage.get('transactions', []);
    const savedHeldOrders = storage.get('held_orders', []);

    this._state = {
      products: savedProducts && savedProducts.length ? savedProducts : [...INITIAL_PRODUCTS],
      categories: [...INITIAL_CATEGORIES],
      cart: [],
      activeCategory: 'all',
      searchQuery: '',
      discount: {
        type: 'percentage', // 'percentage' | 'fixed'
        value: 0,
        label: 'Tidak ada diskon',
        code: ''
      },
      isTaxActive: APP_CONFIG.financial.isTaxActiveByDefault,
      customer: {
        name: 'Pelanggan Umum',
        note: ''
      },
      heldOrders: savedHeldOrders,
      transactions: savedTransactions,
      activeModal: null
    };

    // Simpan ke storage jika baru pertama kali dibuat
    if (!savedProducts) {
      storage.set('products', this._state.products);
    }
  }

  /**
   * Mengambil snapshot state saat ini
   */
  getState() {
    return this._state;
  }

  /**
   * Mendaftarkan listener untuk merespons perubahan state
   * @param {Function} listener
   */
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Memperbarui sebagian properti state dan memberi tahu seluruh listener
   * @param {Object} partialState
   */
  setState(partialState) {
    this._state = {
      ...this._state,
      ...partialState
    };

    // Sinkronisasi otomatis ke storage untuk data persisten tertentu
    if ('products' in partialState) {
      storage.set('products', this._state.products);
    }
    if ('transactions' in partialState) {
      storage.set('transactions', this._state.transactions);
    }
    if ('heldOrders' in partialState) {
      storage.set('held_orders', this._state.heldOrders);
    }

    // Panggil semua subscriber
    this.listeners.forEach(fn => fn(this._state));
  }
}

export const store = new StateStore();
