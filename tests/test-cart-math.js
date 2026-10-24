/**
 * @file test-cart-math.js
 * @description Unit test untuk memverifikasi kalkulasi keuangan keranjang (Subtotal, Diskon, Pajak PPN 11%).
 */

import { cartModule } from '../js/modules/cart.js';

export function runCartMathTests() {
  const results = [];

  function assert(testName, condition) {
    results.push({ name: testName, passed: Boolean(condition) });
  }

  const sampleCart = [
    { id: '1', price: 10000, qty: 2 }, // 20.000
    { id: '2', price: 15000, qty: 1 }, // 15.000
  ];

  // 1. Tes Subtotal
  const subtotal = cartModule.calculateSubtotal(sampleCart);
  assert('Subtotal 2x10rb + 1x15rb = 35.000', subtotal === 35000);

  // 2. Tes Diskon 10%
  const discount10 = { type: 'percentage', value: 10 };
  const diskonAmount = cartModule.calculateDiscountAmount(subtotal, discount10);
  assert('Diskon 10% dari 35.000 = 3.500', diskonAmount === 3500);

  // 3. Tes Diskon Tetap Rp 5.000
  const discountFixed = { type: 'fixed', value: 5000 };
  const diskonFixedAmount = cartModule.calculateDiscountAmount(subtotal, discountFixed);
  assert('Diskon tetap Rp 5.000 dari 35.000 = 5.000', diskonFixedAmount === 5000);

  // 4. Tes PPN 11% dari 30.000 (setelah diskon fixed 5rb)
  const afterDiscount = subtotal - diskonFixedAmount; // 30.000
  const tax = cartModule.calculateTax(afterDiscount, true);
  assert('PPN 11% dari 30.000 = 3.300', tax === 3300);

  // 5. Tes PPN non-aktif (harus 0)
  const taxOff = cartModule.calculateTax(afterDiscount, false);
  assert('PPN saat non-aktif = 0', taxOff === 0);

  return results;
}
