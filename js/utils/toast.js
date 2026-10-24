class ToastManager {
  constructor() {
    this.container = null;
  }

  _getContainer() {
    if (!this.container) {
      this.container = document.getElementById('toast-container');
    }
    return this.container;
  }

  show(message, type = 'info', duration = 3000) {
    const container = this._getContainer();
    if (!container) return;

    const icons = {
      success: '[OK]',
      danger: '[ERROR]',
      warning: '[PERHATIAN]',
      info: '[INFO]'
    };

    const toastElement = document.createElement('div');
    toastElement.className = `toast-item toast-${type}`;
    toastElement.setAttribute('role', 'alert');

    toastElement.innerHTML = `
      <span class="toast-icon">${icons[type] || '[INFO]'}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close" aria-label="Tutup notifikasi">&times;</button>
    `;

    const closeBtn = toastElement.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      this._dismiss(toastElement);
    });

    container.appendChild(toastElement);

    requestAnimationFrame(() => {
      toastElement.classList.add('toast-show');
    });

    if (duration > 0) {
      setTimeout(() => {
        this._dismiss(toastElement);
      }, duration);
    }
  }

  _dismiss(toastElement) {
    toastElement.classList.remove('toast-show');
    toastElement.classList.add('toast-hide');
    setTimeout(() => {
      if (toastElement.parentNode) {
        toastElement.parentNode.removeChild(toastElement);
      }
    }, 250);
  }
}

export const toast = new ToastManager();
