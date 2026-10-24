import { storage } from '../storage/storage.js';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../data/sample-data.js';
import { APP_CONFIG } from '../config.js';

class StateStore {
  constructor() {
    this.listeners = [];
    
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
        type: 'percentage',
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

    if (!savedProducts) {
      storage.set('products', this._state.products);
    }
  }

  getState() {
    return this._state;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  setState(partialState) {
    this._state = {
      ...this._state,
      ...partialState
    };

    if ('products' in partialState) {
      storage.set('products', this._state.products);
    }
    if ('transactions' in partialState) {
      storage.set('transactions', this._state.transactions);
    }
    if ('heldOrders' in partialState) {
      storage.set('held_orders', this._state.heldOrders);
    }

    this.listeners.forEach(fn => fn(this._state));
  }
}

export const store = new StateStore();
