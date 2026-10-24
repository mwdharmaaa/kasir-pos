import { formatIndonesianDate, formatTime24h } from '../utils/date-helpers.js';
import { formatRupiah } from '../utils/formatters.js';
import { store } from '../state/state.js';
import { APP_CONFIG } from '../config.js';

class HeaderModule {
  constructor() {
    this.clockInterval = null;
  }

  init() {
    this.renderStoreInfo();
    this.startLiveClock();
    this.updateStats();

    store.subscribe((state) => {
      this.updateStats(state.transactions);
    });
  }

  renderStoreInfo() {
    const nameEl = document.getElementById('header-store-name');
    const taglineEl = document.getElementById('header-store-tagline');
    if (nameEl) nameEl.textContent = APP_CONFIG.store.name;
    if (taglineEl) taglineEl.textContent = APP_CONFIG.store.tagline;
  }

  startLiveClock() {
    const clockEl = document.getElementById('live-clock');
    const dateEl = document.getElementById('live-date');

    const tick = () => {
      const now = new Date();
      if (clockEl) clockEl.textContent = formatTime24h(now);
      if (dateEl) dateEl.textContent = formatIndonesianDate(now);
    };

    tick();
    this.clockInterval = setInterval(tick, 1000);
  }

  updateStats(transactions = store.getState().transactions) {
    const countEl = document.getElementById('stat-today-count');
    const revEl = document.getElementById('stat-today-revenue');

    if (!countEl || !revEl) return;

    const todayStr = new Date().toISOString().slice(0, 10);
    const todayTrx = transactions.filter(t => t.date && t.date.startsWith(todayStr));

    const totalRevenue = todayTrx.reduce((sum, t) => sum + (t.grandTotal || 0), 0);

    countEl.textContent = todayTrx.length;
    revEl.textContent = formatRupiah(totalRevenue);
  }
}

export const headerModule = new HeaderModule();

export function refreshHeaderStats() {
  headerModule.updateStats();
}
