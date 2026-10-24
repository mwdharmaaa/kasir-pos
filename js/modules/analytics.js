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
    const container = document.getElementById('top-selling-products-list');
    if (!container) return;

    // Agregasi kuantitas terjual per nama produk
    const productSalesMap = {};
    transactions.forEach(t => {
      t.items.forEach(item => {
        productSalesMap[item.name] = (productSalesMap[item.name] || 0) + item.qty;
      });
    });

    const sortedProducts = Object.entries(productSalesMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    if (sortedProducts.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 1rem;">
          Belum ada data produk terjual.
        </div>
      `;
      return;
    }

    container.innerHTML = sortedProducts.map(([name, qty], idx) => `
      <div class="top-product-item">
        <div style="display: flex; align-items: center; gap: var(--space-2);">
          <span class="top-product-rank">#${idx + 1}</span>
          <span style="font-weight: 600;">${name}</span>
        </div>
        <span style="font-family: var(--font-mono); font-weight: 700; color: var(--color-primary-dark);">
          ${qty} terjual
        </span>
      </div>
    `).join('');
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
