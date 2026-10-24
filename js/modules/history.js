/**
 * @file history.js
 * @description Modul Riwayat Transaksi.
 * Menampilkan daftar transaksi yang sudah selesai, memungkinkan cetak ulang struk,
 * pencarian data lama, dan pembatalan transaksi (*void*).
 */

import { store } from '../state/state.js';
import { formatRupiah } from '../utils/formatters.js';
import { formatTime24h } from '../utils/date-helpers.js';
import { toast } from '../utils/toast.js';

class HistoryModule {
  constructor() {
    this.modalEl = null;
    this.tableBodyEl = null;
    this.searchInputEl = null;
  }

  init() {
    this.modalEl = document.getElementById('modal-history');
    this.tableBodyEl = document.getElementById('history-table-body');
    this.searchInputEl = document.getElementById('history-search-input');

    this.setupListeners();

    store.subscribe(() => {
      if (this.modalEl && this.modalEl.style.display !== 'none') {
        this.renderHistory();
      }
    });
  }

  openModal() {
    if (!this.modalEl) return;
    this.renderHistory();
    this.modalEl.style.display = 'flex';
  }

  closeModal() {
    if (this.modalEl) {
      this.modalEl.style.display = 'none';
    }
  }

  renderHistory(query = '') {
    if (!this.tableBodyEl) return;
    const { transactions } = store.getState();

    // Filter pencarian dan urutkan transaksi terbaru di atas
    const filtered = transactions.filter(t => {
      const q = query.toLowerCase().trim();
      return t.id.toLowerCase().includes(q) || t.customerName.toLowerCase().includes(q);
    });

    if (filtered.length === 0) {
      this.tableBodyEl.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
            Belum ada riwayat transaksi yang tercatat.
          </td>
        </tr>
      `;
      return;
    }

    this.tableBodyEl.innerHTML = filtered.map(t => `
      <tr>
        <td class="trx-id-mono">${t.id}</td>
        <td>${new Date(t.date).toLocaleDateString('id-ID')} ${formatTime24h(new Date(t.date))}</td>
        <td>${t.customerName}</td>
        <td style="font-weight: 700;">${formatRupiah(t.grandTotal)}</td>
        <td>
          <span class="pay-badge ${t.paymentMethod === 'cash' ? 'pay-badge-cash' : 'pay-badge-qris'}">
            ${t.paymentMethod}
          </span>
        </td>
        <td>
          <button class="cart-tool-btn btn-reprint" data-id="${t.id}" title="Cetak Ulang Struk">🖨️ Struk</button>
          <button class="cart-tool-btn text-danger btn-void" data-id="${t.id}" title="Batalkan Transaksi">❌ Void</button>
        </td>
      </tr>
    `).join('');
  }

  setupListeners() {
    const btnOpen = document.getElementById('btn-open-history');
    if (btnOpen) {
      btnOpen.addEventListener('click', () => this.openModal());
    }

    if (this.searchInputEl) {
      this.searchInputEl.addEventListener('input', (e) => {
        this.renderHistory(e.target.value);
      });
    }

    if (this.modalEl) {
      const closeBtns = this.modalEl.querySelectorAll('[data-close-modal]');
      closeBtns.forEach(b => b.addEventListener('click', () => this.closeModal()));
    }
  }
}

export const historyModule = new HistoryModule();
