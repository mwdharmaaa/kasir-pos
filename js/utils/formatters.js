/**
 * @file formatters.js
 * @description Kumpulan fungsi pembantu untuk memformat angka mata uang Rupiah
 * dan membersihkan input angka dari pengguna.
 */

/**
 * Mengubah angka murni menjadi format string Rupiah standar Indonesia.
 * Contoh: 25000 -> "Rp 25.000"
 * 
 * @param {number|string} amount - Nilai angka yang akan diformat
 * @param {boolean} withSymbol - Apakah menyertakan teks "Rp " di depan (default: true)
 * @returns {string} String Rupiah terformat rapi
 */
export function formatRupiah(amount, withSymbol = true) {
  const numericValue = Number(amount) || 0;
  
  // Gunakan Internationalization API bawaan browser untuk akurasi tinggi
  const formattedNumber = new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0
  }).format(numericValue);

  return withSymbol ? `Rp ${formattedNumber}` : formattedNumber;
}

/**
 * Membersihkan format Rupiah atau string angka berkarakter menjadi tipe Number murni.
 * Contoh: "Rp 25.000" -> 25000
 * 
 * @param {string|number} formattedStr - String yang mengandung karakter non-angka
 * @returns {number} Nilai numerik murni
 */
export function parseRupiah(formattedStr) {
  if (typeof formattedStr === 'number') return formattedStr;
  if (!formattedStr) return 0;
  
  // Hapus semua karakter kecuali digit angka dan tanda minus
  const cleanStr = String(formattedStr).replace(/[^0-9-]/g, '');
  return parseInt(cleanStr, 10) || 0;
}

/**
 * Format persentase angka (misal: 0.11 -> "11%")
 * @param {number} rate - Angka desimal
 * @returns {string}
 */
export function formatPercent(rate) {
  const percent = Math.round((Number(rate) || 0) * 100);
  return `${percent}%`;
}
