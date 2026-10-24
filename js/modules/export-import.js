/**
 * @file export-import.js
 * @description Modul Ekspor Data CSV dan Backup Database JSON.
 */

import { store } from '../state/state.js';
import { toast } from '../utils/toast.js';

class ExportImportModule {
  init() {
    const btnExportCsv = document.getElementById('btn-export-csv');
    if (btnExportCsv) {
      btnExportCsv.addEventListener('click', () => this.exportTransactionsCSV());
    }
  }

  /**
   * Mengekspor seluruh riwayat transaksi ke format file .csv spreadsheet
   */
  exportTransactionsCSV() {
    const { transactions } = store.getState();
    if (transactions.length === 0) {
      toast.show('Belum ada data transaksi untuk diekspor!', 'warning');
      return;
    }

    const headers = ['ID Transaksi', 'Tanggal', 'Nama Pelanggan', 'Metode Bayar', 'Subtotal', 'Diskon', 'PPN', 'Grand Total'];
    const rows = transactions.map(t => [
      t.id,
      new Date(t.date).toLocaleString('id-ID'),
      `"${t.customerName.replace(/"/g, '""')}"`,
      t.paymentMethod,
      t.subtotal,
      t.discountAmount,
      t.taxAmount,
      t.grandTotal
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-penjualan-pos-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.show('Laporan penjualan CSV berhasil diunduh!', 'success');
  }
}

export const exportImportModule = new ExportImportModule();
