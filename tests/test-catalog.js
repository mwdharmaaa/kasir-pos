import { INITIAL_PRODUCTS } from '../js/data/sample-data.js';

export function runCatalogTests() {
  const results = [];

  function assert(testName, condition) {
    results.push({ name: testName, passed: Boolean(condition) });
  }

  const makananList = INITIAL_PRODUCTS.filter(p => p.category === 'makanan');
  assert('Filter kategori makanan menghasilkan lebih dari 0 produk', makananList.length > 0);

  const minumanList = INITIAL_PRODUCTS.filter(p => p.category === 'minuman');
  assert('Filter kategori minuman menghasilkan lebih dari 0 produk', minumanList.length > 0);

  const searchKopi = INITIAL_PRODUCTS.filter(p => p.name.toLowerCase().includes('kopi'));
  assert('Pencarian "kopi" menemukan produk kopi', searchKopi.length >= 1 && searchKopi[0].name.includes('Kopi'));

  const targetBarcode = '8991001001';
  const matchBarcode = INITIAL_PRODUCTS.find(p => p.barcode === targetBarcode);
  assert('Lookup barcode 8991001001 menemukan Kopi Susu', matchBarcode && matchBarcode.id === 'prod-001');

  return results;
}
