/**
 * @file analytics.js
 * @description Modul Laporan dan Analitik Keuangan.
 * Menghitung metrik performa toko: Omzet, Rata-rata Penjualan, Estimasi Margin Laba,
 * dan Top 5 Produk Terlaris.
 */

import { store } from '../state/state.js';
import { formatRupiah } from '../utils/formatters.js';

class AnalyticsModule {
  constructor() {
    this.modalEl = null;
  }

  init() {
    this.modalEl = document.getElementById('modal-analytics');
    this.setupListeners();
  }

  openModal() {
    if (!this.modalEl) return;
    this.calculateAndRenderMetrics();
    this.modalEl.style.display = 'flex';
  }

  closeModal() {
    if (this.modalEl) {
      this.modalEl.style.display = 'none';
    }
  }

  calculateAndRenderMetrics() {
    const { transactions } = store.getState();

    const totalOrders = transactions.length;
    const totalRevenue = transactions.reduce((sum, t) => sum + t.grandTotal, 0);
    const avgOrder = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // Estimasi Laba Kotor (Harga Jual - Harga Pokok Modal)
    let totalCost = 0;
    transactions.forEach(t => {
      t.items.forEach(item => {
        totalCost += (item.costPrice || item.price * 0.6) * item.qty;
      });
    });
    const grossProfit = Math.max(0, totalRevenue - totalCost);

    const revEl = document.getElementById('metric-total-revenue');
    const ordersEl = document.getElementById('metric-total-orders');
    const avgEl = document.getElementById('metric-avg-order');
    const profitEl = document.getElementById('metric-gross-profit');

    if (revEl) revEl.textContent = formatRupiah(totalRevenue);
    if (ordersEl) ordersEl.textContent = `${totalOrders} pesanan`;
    if (avgEl) avgEl.textContent = formatRupiah(avgOrder);
    if (profitEl) profitEl.textContent = formatRupiah(grossProfit);

    this.renderTopProducts(transactions);
  }

  renderTopProducts(transactions) {
    // Akan diimplementasikan untuk Top 5 produk
  }

  setupListeners() {
    const btnOpen = document.getElementById('btn-open-analytics');
    if (btnOpen) {
      btnOpen.addEventListener('click', () => this.openModal());
    }

    if (this.modalEl) {
      const closeBtns = this.modalEl.querySelectorAll('[data-close-modal]');
      closeBtns.forEach(b => b.addEventListener('click', () => this.closeModal()));
    }
  }
}

export const analyticsModule = new AnalyticsModule();
