/**
 * @file receipt.js
 * @description Modul Struk Termal Kasir.
 * Menghasilkan struk belanja bergaya kertas printer thermal 58mm/80mm,
 * menangani pencetakan window.print(), dan pengunduhan struk dalam bentuk teks.
 */

import { APP_CONFIG } from '../config.js';
import { formatRupiah } from '../utils/formatters.js';
import { formatIndonesianDate, formatTime24h } from '../utils/date-helpers.js';

class ReceiptModule {
  constructor() {
    this.modalEl = null;
    this.paperEl = null;
    this.btnPrint = null;
    this.btnDownloadTxt = null;
    this.currentTransaction = null;
  }

  init() {
    this.modalEl = document.getElementById('modal-receipt');
    this.paperEl = document.getElementById('thermal-receipt-paper');
    this.btnPrint = document.getElementById('btn-print-receipt');
    this.btnDownloadTxt = document.getElementById('btn-download-receipt-txt');

    this.setupListeners();

    // Dengarkan event tampilkan struk
    window.addEventListener('pos:show-receipt', (e) => {
      this.showReceipt(e.detail.transaction);
    });
  }

  showReceipt(transaction) {
    if (!transaction) return;
    this.currentTransaction = transaction;

    this.renderReceipt(transaction);

    if (this.modalEl) {
      this.modalEl.style.display = 'flex';
    }
  }

  closeModal() {
    if (this.modalEl) {
      this.modalEl.style.display = 'none';
    }
  }

  renderReceipt(trx) {
    if (!this.paperEl) return;
    const { store } = APP_CONFIG;
    const dateObj = new Date(trx.date);

    this.paperEl.innerHTML = `
      <div class="receipt-header">
        <div class="receipt-store-title">${store.name}</div>
        <div class="receipt-store-address">${store.address}</div>
        <div class="receipt-store-phone">Telp: ${store.phone}</div>
        <div style="font-size: 0.65rem; margin-top: 2px;">${store.taxIdentificationNumber}</div>
      </div>

      <div class="receipt-meta-grid">
        <div>No. Trx : <b>${trx.id}</b></div>
        <div>Waktu   : ${formatIndonesianDate(dateObj)} ${formatTime24h(dateObj)}</div>
        <div>Kasir   : Kasir 01</div>
        <div>Pelanggan: ${trx.customerName} ${trx.customerNote ? `(${trx.customerNote})` : ''}</div>
      </div>

      <table class="receipt-table" id="receipt-items-table"></table>

      <div class="receipt-total-section" id="receipt-total-section"></div>

      <div class="receipt-footer">
        <div>${store.receiptFooter}</div>
        <div style="margin-top: 6px; letter-spacing: 2px;">*** LUNAS ***</div>
      </div>
    `;

    this.renderItemsAndTotals(trx);
  }

  renderItemsAndTotals(trx) {
    const tableEl = document.getElementById('receipt-items-table');
    const totalsEl = document.getElementById('receipt-total-section');

    if (tableEl) {
      tableEl.innerHTML = trx.items.map(item => `
        <tr>
          <td colspan="2" class="receipt-item-name">${item.name}</td>
        </tr>
        <tr>
          <td class="receipt-item-sub">${item.qty} x ${formatRupiah(item.price)}</td>
          <td align="right" class="receipt-item-sub">${formatRupiah(item.price * item.qty)}</td>
        </tr>
      `).join('');
    }

    if (totalsEl) {
      totalsEl.innerHTML = `
        <div class="receipt-total-row">
          <span>Subtotal:</span>
          <span>${formatRupiah(trx.subtotal)}</span>
        </div>
        ${trx.discountAmount > 0 ? `
          <div class="receipt-total-row">
            <span>Diskon:</span>
            <span>- ${formatRupiah(trx.discountAmount)}</span>
          </div>
        ` : ''}
        ${trx.taxAmount > 0 ? `
          <div class="receipt-total-row">
            <span>PPN (11%):</span>
            <span>${formatRupiah(trx.taxAmount)}</span>
          </div>
        ` : ''}
        <div class="receipt-total-row receipt-grand-row">
          <span>TOTAL:</span>
          <span>${formatRupiah(trx.grandTotal)}</span>
        </div>
        <div class="receipt-total-row">
          <span>Metode Bayar:</span>
          <span style="text-transform: uppercase;">${trx.paymentMethod}</span>
        </div>
        ${trx.paymentMethod === 'cash' ? `
          <div class="receipt-total-row">
            <span>Uang Diterima:</span>
            <span>${formatRupiah(trx.cashReceived)}</span>
          </div>
          <div class="receipt-total-row">
            <span>Kembalian:</span>
            <span>${formatRupiah(trx.changeAmount)}</span>
          </div>
        ` : ''}
      `;
    }
  }

  printReceipt() {
    window.print();
  }

  setupListeners() {
    if (this.btnPrint) {
      this.btnPrint.addEventListener('click', () => this.printReceipt());
    }
    if (this.modalEl) {
      const closeBtns = this.modalEl.querySelectorAll('[data-close-modal]');
      closeBtns.forEach(b => b.addEventListener('click', () => this.closeModal()));
    }
  }
}

export const receiptModule = new ReceiptModule();
