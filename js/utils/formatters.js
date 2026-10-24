export function formatRupiah(amount, withSymbol = true) {
  const numericValue = Number(amount) || 0;
  
  const formattedNumber = new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0
  }).format(numericValue);

  return withSymbol ? `Rp ${formattedNumber}` : formattedNumber;
}

export function parseRupiah(formattedStr) {
  if (typeof formattedStr === 'number') return formattedStr;
  if (!formattedStr) return 0;
  
  const cleanStr = String(formattedStr).replace(/[^0-9-]/g, '');
  return parseInt(cleanStr, 10) || 0;
}

export function formatPercent(rate) {
  const percent = Math.round((Number(rate) || 0) * 100);
  return `${percent}%`;
}
