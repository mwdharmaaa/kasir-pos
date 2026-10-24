import { formatRupiah, parseRupiah } from '../js/utils/formatters.js';
import { generateTransactionId } from '../js/utils/date-helpers.js';

export function runCoreTests() {
  const results = [];

  function assert(testName, condition) {
    results.push({ name: testName, passed: Boolean(condition) });
  }

  assert('formatRupiah 25000 -> "Rp 25.000"', formatRupiah(25000) === 'Rp 25.000');
  assert('formatRupiah 0 -> "Rp 0"', formatRupiah(0) === 'Rp 0');
  assert('formatRupiah tanpa simbol -> "25.000"', formatRupiah(25000, false) === '25.000');

  assert('parseRupiah "Rp 25.000" -> 25000', parseRupiah('Rp 25.000') === 25000);
  assert('parseRupiah "100.500" -> 100500', parseRupiah('100.500') === 100500);
  assert('parseRupiah "" -> 0', parseRupiah('') === 0);

  const trxId = generateTransactionId();
  assert('generateTransactionId dimulai dengan TRX-', trxId.startsWith('TRX-'));

  return results;
}
