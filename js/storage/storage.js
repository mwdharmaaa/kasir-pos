const STORAGE_PREFIX = 'kasir_pos_';

export const storage = {
  
  set(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(STORAGE_PREFIX + key, serialized);
      return true;
    } catch (err) {
      console.error(`Gagal menyimpan data ke localStorage [${key}]:`, err);
      return false;
    }
  },

  get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      if (raw === null || raw === undefined) {
        return defaultValue;
      }
      return JSON.parse(raw);
    } catch (err) {
      console.error(`Gagal membaca data dari localStorage [${key}]:`, err);
      return defaultValue;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } catch (err) {
      console.error(`Gagal menghapus data [${key}]:`, err);
    }
  },

  clearAll() {
    try {
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(k);
        }
      });
    } catch (err) {
      console.error('Gagal membersihkan database localStorage:', err);
    }
  }
};
