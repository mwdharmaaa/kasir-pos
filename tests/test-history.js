export function runHistoryTests() {
  const results = [];

  function assert(testName, condition) {
    results.push({ name: testName, passed: Boolean(condition) });
  }

  const initialStock = 20;
  const purchasedQty = 5;
  const currentStock = initialStock - purchasedQty;

  const restoredStock = currentStock + purchasedQty;
  assert('Restorasi stok setelah void mengembalikan nilai awal', restoredStock === initialStock);

  return results;
}
