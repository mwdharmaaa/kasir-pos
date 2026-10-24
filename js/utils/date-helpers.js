/**
 * @file date-helpers.js
 * @description Utilitas manipulasi tanggal dan waktu dalam format lokal Indonesia.
 */

const NAMA_HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

/**
 * Mengambil nama hari dan tanggal lengkap hari ini dalam Bahasa Indonesia.
 * Contoh: "Sabtu, 24 Oktober 2026"
 * 
 * @param {Date} [dateObj=new Date()]
 * @returns {string}
 */
export function formatIndonesianDate(dateObj = new Date()) {
  const hari = NAMA_HARI[dateObj.getDay()];
  const tanggal = dateObj.getDate();
  const bulan = NAMA_BULAN[dateObj.getMonth()];
  const tahun = dateObj.getFullYear();

  return `${hari}, ${tanggal} ${bulan} ${tahun}`;
}

/**
 * Mengambil jam, menit, dan detik dalam format 24 jam dengan zero-padding.
 * Contoh: "08:45:12"
 * 
 * @param {Date} [dateObj=new Date()]
 * @returns {string}
 */
export function formatTime24h(dateObj = new Date()) {
  const jam = String(dateObj.getHours()).padStart(2, '0');
  const menit = String(dateObj.getMinutes()).padStart(2, '0');
  const detik = String(dateObj.getSeconds()).padStart(2, '0');

  return `${jam}:${menit}:${detik}`;
}

/**
 * Membuat ID transaksi unik berbasis timestamp tanggal dan acak 4 digit.
 * Contoh: "TRX-20261024-8491"
 * 
 * @returns {string}
 */
export function generateTransactionId() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const random4 = Math.floor(1000 + Math.random() * 9000);

  return `TRX-${yyyy}${mm}${dd}-${random4}`;
}
