/**
 * @file storage.js
 * @description Wrapper aman untuk browser LocalStorage dengan penanganan error try-catch
 * dan otomatisasi serialisasi JSON.
 */

const STORAGE_PREFIX = 'kasir_pos_';

export const storage = {
  /**
   * Menyimpan data dengan aman ke localStorage
   * @param {string} key - Kunci penyimpanan
   * @param {any} value - Data yang akan disimpan (otomatis di-JSON.stringify)
   */
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

  /**
   * Mengambil data dari localStorage
   * @param {string} key - Kunci penyimpanan
   * @param {any} defaultValue - Nilai fallback jika data belum ada
   * @returns {any}
   */
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

  /**
   * Menghapus kunci tertentu
   * @param {string} key
   */
  remove(key) {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } catch (err) {
      console.error(`Gagal menghapus data [${key}]:`, err);
    }
  },

  /**
   * Membersihkan seluruh data aplikasi dari localStorage
   */
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
