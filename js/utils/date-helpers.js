const NAMA_HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export function formatIndonesianDate(dateObj = new Date()) {
  const hari = NAMA_HARI[dateObj.getDay()];
  const tanggal = dateObj.getDate();
  const bulan = NAMA_BULAN[dateObj.getMonth()];
  const tahun = dateObj.getFullYear();

  return `${hari}, ${tanggal} ${bulan} ${tahun}`;
}

export function formatTime24h(dateObj = new Date()) {
  const jam = String(dateObj.getHours()).padStart(2, '0');
  const menit = String(dateObj.getMinutes()).padStart(2, '0');
  const detik = String(dateObj.getSeconds()).padStart(2, '0');

  return `${jam}:${menit}:${detik}`;
}

export function generateTransactionId() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const random4 = Math.floor(1000 + Math.random() * 9000);

  return `TRX-${yyyy}${mm}${dd}-${random4}`;
}
