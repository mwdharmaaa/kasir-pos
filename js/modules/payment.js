/**
 * @file payment.js
 * @description Modul Pemrosesan Pembayaran (Payment Gateway).
 * Menangani pemilihan kanal bayar, kalkulasi uang tunai & kembalian,
 * QRIS timer, serta finalisasi transaksi.
 */

import { store } from '../state/state.js';
import { APP_CONFIG } from '../config.js';
import { formatRupiah, parseRupiah } from '../utils/formatters.js';
import { sound } from '../utils/sound.js';
import { toast } from '../utils/toast.js';
import { generateTransactionId } from '../utils/date-helpers.js';

class PaymentModule {
  constructor() {
    this.modalEl = null;
    this.methodsGridEl = null;
    this.channelPanelEl = null;
    this.totalLabelEl = null;
    this.btnSubmit = null;

    this.selectedMethod = 'cash';
    this.cashReceived = 0;
    this.changeAmount = 0;
    this.currentTotal = 0;
  }

  init() {
    this.modalEl = document.getElementById('modal-payment');
    this.methodsGridEl = document.getElementById('payment-methods-grid');
    this.channelPanelEl = document.getElementById('payment-channel-panel');
    this.totalLabelEl = document.getElementById('pay-sum-total');
    this.btnSubmit = document.getElementById('btn-submit-payment');

    this.setupListeners();
  }

  openPaymentModal() {
    const { cart, discount, isTaxActive } = store.getState();
    if (cart.length === 0) return;

    // Hitung total akhir yang harus dibayar
    const subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    const discAmount = discount.type === 'percentage' 
      ? Math.round(subtotal * (discount.value / 100))
      : Math.min(discount.value, subtotal);
    const taxable = Math.max(0, subtotal - discAmount);
    const tax = isTaxActive ? Math.round(taxable * APP_CONFIG.financial.defaultTaxRate) : 0;
    this.currentTotal = taxable + tax;

    if (this.totalLabelEl) {
      this.totalLabelEl.textContent = formatRupiah(this.currentTotal);
    }

    this.renderMethodsGrid();
    this.switchMethod('cash');

    if (this.modalEl) {
      this.modalEl.style.display = 'flex';
    }
  }

  closeModal() {
    if (this.modalEl) {
      this.modalEl.style.display = 'none';
    }
  }

  renderMethodsGrid() {
    if (!this.methodsGridEl) return;
    this.methodsGridEl.innerHTML = APP_CONFIG.paymentMethods.map(m => `
      <button 
        class="pay-method-btn ${m.id === this.selectedMethod ? 'active' : ''}" 
        data-method-id="${m.id}"
      >
        <span class="pay-method-icon">${m.icon}</span>
        <span>${m.name}</span>
      </button>
    `).join('');
  }

  switchMethod(methodId) {
    this.selectedMethod = methodId;
    this.renderMethodsGrid();
    this.renderChannelPanel();
  }

  renderChannelPanel() {
    // Akan diimplementasikan untuk tiap mode (Tunai, QRIS, dll)
  }

  setupListeners() {
    const btnOpen = document.getElementById('btn-open-payment');
    if (btnOpen) {
      btnOpen.addEventListener('click', () => this.openPaymentModal());
    }

    if (this.methodsGridEl) {
      this.methodsGridEl.addEventListener('click', (e) => {
        const btn = e.target.closest('.pay-method-btn');
        if (btn) this.switchMethod(btn.dataset.methodId);
      });
    }

    if (this.modalEl) {
      const closeBtns = this.modalEl.querySelectorAll('[data-close-modal]');
      closeBtns.forEach(b => b.addEventListener('click', () => this.closeModal()));
    }
  }
}

export const paymentModule = new PaymentModule();
