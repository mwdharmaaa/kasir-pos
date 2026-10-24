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
    this.modalEl = document.getElementById('modal-held-orders');
    this.listEl = document.getElementById('held-orders-list');
    this.setupListeners();

    store.subscribe(() => {
      this.renderHeldList();
    });
  }

  openModal() {
    if (!this.modalEl) return;
    this.renderHeldList();
    this.modalEl.style.display = 'flex';
  }

  closeModal() {
    if (this.modalEl) {
      this.modalEl.style.display = 'none';
    }
  }

  renderHeldList() {
    if (!this.listEl) return;
    const { heldOrders } = store.getState();

    if (heldOrders.length === 0) {
      this.listEl.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
          
          Tidak ada pesanan yang sedang ditahan.
        </div>
      `;
      return;
    }

    this.listEl.innerHTML = heldOrders.map(order => `
      <div class="held-order-card">
        <div>
          <div class="held-meta-title">#${order.id} - ${order.customerName}</div>
          <div class="held-meta-subtitle">${order.time} &bull; ${order.items.length} macam barang &bull; ${formatRupiah(order.totalAmount)}</div>
        </div>
        <div class="held-actions">
          <button class="cart-tool-btn btn-resume-hold" data-id="${order.id}">Lanjutkan</button>
          <button class="cart-tool-btn text-danger btn-delete-hold" data-id="${order.id}">Hapus</button>
        </div>
      </div>
    `).join('');
  }

  setupListeners() {
    if (this.btnHold) {
      this.btnHold.addEventListener('click', () => this.holdCurrentOrder());
    }

    if (this.listEl) {
      this.listEl.addEventListener('click', (e) => {
        const resumeBtn = e.target.closest('.btn-resume-hold');
        const deleteBtn = e.target.closest('.btn-delete-hold');
        if (resumeBtn) {
          this.resumeHeldOrder(resumeBtn.dataset.id);
          this.closeModal();
        } else if (deleteBtn) {
          this.deleteHeldOrder(deleteBtn.dataset.id);
        }
      });
    }

    if (this.modalEl) {
      const closeBtn = this.modalEl.querySelector('[data-close-modal]');
      if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal());
    }
  }

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
      cart: []
    });

    sound.playBeep();
    toast.show(`Pesanan #${orderId} berhasil ditahan sementara`, 'info');
  }

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

  deleteHeldOrder(holdId) {
    const { heldOrders } = store.getState();
    store.setState({
      heldOrders: heldOrders.filter(o => o.id !== holdId)
    });
    toast.show(`Pesanan #${holdId} dibatalkan`, 'info');
  }
}

export const holdModule = new HoldModule();
