/**
 * @file hold.js
 * @description Modul Tahan Pesanan (Hold Bill / Pending Orders).
 * Memungkinkan kasir menahan pesanan saat ini (misal pelanggan mengambil barang tambahan)
 * dan melayani pelanggan lain terlebih dahulu.
 */

import { store } from '../state/state.js';
import { sound } from '../utils/sound.js';
import { toast } from '../utils/toast.js';
import { formatRupiah } from '../utils/formatters.js';
import { formatTime24h } from '../utils/date-helpers.js';

class HoldModule {
  constructor() {
    this.btnHold = null;
    this.modalEl = null;
  }

  init() {
    this.btnHold = document.getElementById('btn-hold-cart');
    this.setupListeners();
  }

  setupListeners() {
    if (this.btnHold) {
      this.btnHold.addEventListener('click', () => this.holdCurrentOrder());
    }
  }

  /**
   * Menahan pesanan saat ini dan menyimpannya ke daftar heldOrders
   */
  holdCurrentOrder() {
    const { cart, customer, heldOrders } = store.getState();
    if (cart.length === 0) {
      toast.show('Keranjang masih kosong, tidak ada yang bisa ditahan!', 'warning');
      return;
    }

    const orderId = `HOLD-${Date.now().toString().slice(-4)}`;
    const newHold = {
      id: orderId,
      time: formatTime24h(new Date()),
      customerName: customer.name || 'Pelanggan Umum',
      tableNote: customer.note || '',
      items: [...cart],
      totalAmount: cart.reduce((sum, item) => sum + item.price * item.qty, 0)
    };

    store.setState({
      heldOrders: [newHold, ...heldOrders],
      cart: [] // Kosongkan keranjang aktif
    });

    sound.playBeep();
    toast.show(`Pesanan #${orderId} berhasil ditahan sementara`, 'info');
  }

  /**
   * Mengembalikan pesanan yang ditahan ke keranjang aktif
   * @param {string} holdId
   */
  resumeHeldOrder(holdId) {
    const { heldOrders, cart } = store.getState();
    const orderToResume = heldOrders.find(o => o.id === holdId);
    if (!orderToResume) return;

    if (cart.length > 0) {
      if (!confirm('Keranjang aktif saat ini akan ditimpa dengan pesanan yang dipulihkan. Lanjutkan?')) {
        return;
      }
    }

    store.setState({
      cart: [...orderToResume.items],
      customer: {
        name: orderToResume.customerName,
        note: orderToResume.tableNote
      },
      heldOrders: heldOrders.filter(o => o.id !== holdId)
    });

    sound.playBeep();
    toast.show(`Pesanan #${holdId} dipulihkan ke keranjang`, 'success');
  }

  /**
   * Menghapus pesanan yang ditahan
   * @param {string} holdId
   */
  deleteHeldOrder(holdId) {
    const { heldOrders } = store.getState();
    store.setState({
      heldOrders: heldOrders.filter(o => o.id !== holdId)
    });
    toast.show(`Pesanan #${holdId} dibatalkan`, 'info');
  }
}

export const holdModule = new HoldModule();
