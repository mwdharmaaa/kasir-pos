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
    if (!this.channelPanelEl) return;

    if (this.selectedMethod === 'cash') {
      this.renderCashPanel();
    } else if (this.selectedMethod === 'qris') {
      this.renderQRISPanel();
    } else {
      this.renderCardPanel();
    }
  }

  renderCashPanel() {
    this.cashReceived = this.currentTotal; // Default uang pas
    this.changeAmount = 0;

    this.channelPanelEl.innerHTML = `
      <div class="cash-input-group">
        <label for="cash-received-input" class="cash-label">Uang Tunai yang Diterima:</label>
        <input 
          type="text" 
          id="cash-received-input" 
          class="cash-received-input" 
          value="${this.cashReceived}" 
          autocomplete="off"
        >
      </div>

      <div class="quick-cash-chips" id="quick-cash-chips"></div>

      <div class="change-display-box" id="change-display-box">
        <span class="change-label">Uang Kembalian:</span>
        <span id="cash-change-amount" class="change-amount">Rp 0</span>
      </div>
    `;

    this.renderQuickCashChips();
    this.setupCashListeners();
    this.validatePayment();
  }

  setupCashListeners() {
    const input = document.getElementById('cash-received-input');
    if (input) {
      input.focus();
      input.select();
      input.addEventListener('input', (e) => {
        const parsed = parseRupiah(e.target.value);
        this.cashReceived = parsed;
        this.updateChangeCalculation();
      });
    }
  }

  updateChangeCalculation() {
    const changeEl = document.getElementById('cash-change-amount');
    const changeBox = document.getElementById('change-display-box');

    this.changeAmount = this.cashReceived - this.currentTotal;

    if (changeEl) {
      if (this.changeAmount < 0) {
        changeEl.textContent = `Kurang ${formatRupiah(Math.abs(this.changeAmount))}`;
        changeEl.classList.add('text-danger');
      } else {
        changeEl.textContent = formatRupiah(this.changeAmount);
        changeEl.classList.remove('text-danger');
      }
    }

    this.validatePayment();
  }

  validatePayment() {
    if (!this.btnSubmit) return;
    if (this.selectedMethod === 'cash') {
      this.btnSubmit.disabled = this.cashReceived < this.currentTotal;
    } else {
      this.btnSubmit.disabled = false;
    }
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

    if (this.btnSubmit) {
      this.btnSubmit.addEventListener('click', () => this.processCheckout());
    }
  }
}

export const paymentModule = new PaymentModule();

  renderQRISPanel() {
    this.channelPanelEl.innerHTML = `
      <div class="qris-panel-wrap">
        <div class="qris-qr-box">
          <div class="qris-fake-qr">
            <span style="font-size: 4rem;">🏁</span>
            <span style="font-size: 0.75rem; font-weight: bold; margin-top: 4px;">QRIS STANDAR NASIONAL</span>
          </div>
          <span class="qris-scan-hint">Scan kode QR di atas menggunakan aplikasi e-Wallet apa saja</span>
        </div>
        <div class="qris-status-box">
          <span>Menunggu Pembayaran...</span>
          <span class="qris-timer" id="qris-timer">04:59</span>
        </div>
      </div>
    `;
    this.validatePayment();
  }

  renderCardPanel() {
    const isDebit = this.selectedMethod === 'debit';
    this.channelPanelEl.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: var(--space-3); padding: var(--space-2) 0;">
        <div>
          <label class="cash-label">${isDebit ? 'Nomor Kartu (4 Digit Terakhir):' : 'Nomor Referensi Transfer / Bank:'}</label>
          <input 
            type="text" 
            id="card-ref-input" 
            placeholder="${isDebit ? 'Contoh: 4921' : 'Contoh: BCA - 982341'}"
            style="width: 100%; height: 44px;"
          >
        </div>
        <p style="font-size: var(--text-xs); color: var(--text-muted);">
          Pastikan bukti transaksi pembayaran EDC/Transfer sudah diverifikasi sebelum menyelesaikan.
        </p>
      </div>
    `;
    this.validatePayment();
  }

  /**
   * Menyelesaikan transaksi: mengurangi stok barang dan menyimpan riwayat
   */
  processCheckout() {
    const { cart, products, customer, discount, isTaxActive, transactions } = store.getState();
    if (cart.length === 0) return;

    // 1. Potong stok setiap produk yang dibeli
    const updatedProducts = products.map(p => {
      const inCart = cart.find(c => c.id === p.id);
      if (inCart) {
        return { ...p, stock: Math.max(0, p.stock - inCart.qty) };
      }
      return p;
    });

    // 2. Kalkulasi detail finansial
    const subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    const discAmount = discount.type === 'percentage' 
      ? Math.round(subtotal * (discount.value / 100))
      : Math.min(discount.value, subtotal);
    const taxable = Math.max(0, subtotal - discAmount);
    const taxAmount = isTaxActive ? Math.round(taxable * APP_CONFIG.financial.defaultTaxRate) : 0;
    const grandTotal = taxable + taxAmount;

    // 3. Bangun objek transaksi
    const transaction = {
      id: generateTransactionId(),
      date: new Date().toISOString(),
      customerName: customer.name || 'Pelanggan Umum',
      customerNote: customer.note || '',
      items: [...cart],
      subtotal,
      discountAmount: discAmount,
      discountLabel: discount.label || '',
      taxAmount,
      grandTotal,
      paymentMethod: this.selectedMethod,
      cashReceived: this.selectedMethod === 'cash' ? this.cashReceived : grandTotal,
      changeAmount: this.selectedMethod === 'cash' ? Math.max(0, this.changeAmount) : 0
    };

    // 4. Update State Store
    store.setState({
      products: updatedProducts,
      transactions: [transaction, ...transactions],
      cart: [], // Kosongkan keranjang
      discount: { type: 'percentage', value: 0, label: 'Tidak ada diskon', code: '' }
    });

    sound.playSuccess();
    toast.show(`Transaksi ${transaction.id} berhasil diselesaikan!`, 'success');

    this.closeModal();

    // Trigger event untuk menampilkan struk termal
    window.dispatchEvent(new CustomEvent('pos:show-receipt', { detail: { transaction } }));
  }
