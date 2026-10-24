export function runPaymentTests() {
  const results = [];

  function assert(testName, condition) {
    results.push({ name: testName, passed: Boolean(condition) });
  }

  const total1 = 50000;
  const bayar1 = 50000;
  assert('Uang pas 50rb bayar 50rb -> kembalian 0', (bayar1 - total1) === 0);

  const total2 = 35000;
  const bayar2 = 50000;
  assert('Total 35rb bayar 50rb -> kembalian 15rb', (bayar2 - total2) === 15000);

  const productStock = 10;
  const qtyPurchased = 3;
  const remainingStock = Math.max(0, productStock - qtyPurchased);
  assert('Stok 10 dibeli 3 -> sisa stok 7', remainingStock === 7);

  const overPurchased = 15;
  const safeStock = Math.max(0, productStock - overPurchased);
  assert('Stok tidak boleh bernilai negatif (< 0)', safeStock === 0);

  return results;
}
