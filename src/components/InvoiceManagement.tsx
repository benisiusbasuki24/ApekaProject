import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  Printer, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  CreditCard,
  Plus,
  X,
  ExternalLink
} from 'lucide-react';
import { Invoice } from '../types';

interface InvoiceManagementProps {
  invoices: Invoice[];
  onOpenPaymentGateway: (invoice: Invoice) => void;
  isAdmin?: boolean;
}

export const InvoiceManagement: React.FC<InvoiceManagementProps> = ({
  invoices,
  onOpenPaymentGateway,
  isAdmin = false
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid'>('all');
  const [search, setSearch] = useState('');
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<Invoice | null>(null);

  const filteredInvoices = invoices.filter(inv => {
    const matchFilter = filter === 'all' || inv.status === filter;
    const matchSearch = 
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(search.toLowerCase()) ||
      inv.institutionName.toLowerCase().includes(search.toLowerCase()) ||
      inv.productName.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header of Invoices */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span>Sistem Manajemen Invoice &amp; Penagihan Otomatis</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Faktur elektronik resmi dengan perhitungan PPN 11% dan verifikasi pembayaran otomatis.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          <div className="p-1 bg-slate-900 border border-slate-800 rounded-xl flex items-center">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filter === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua ({invoices.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filter === 'pending' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              Menunggu Bayar ({invoices.filter(i => i.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('paid')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filter === 'paid' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              Lunas ({invoices.filter(i => i.status === 'paid').length})
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Table Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nomor invoice, klien, atau instansi..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="text-xs text-slate-400 hidden sm:block">
            Menampilkan <strong className="text-slate-200">{filteredInvoices.length}</strong> faktur
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">No. Invoice &amp; Terbit</th>
                <th className="py-3.5 px-4">Institusi &amp; Klien</th>
                <th className="py-3.5 px-4">Aplikasi &amp; Siklus</th>
                <th className="py-3.5 px-4 text-right">Total Tagihan</th>
                <th className="py-3.5 px-4">Jatuh Tempo</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredInvoices.map(inv => {
                const isPaid = inv.status === 'paid';
                return (
                  <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-cyan-400">{inv.invoiceNumber}</div>
                      <div className="text-[11px] text-slate-500 font-mono">Terbit: {inv.issueDate}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{inv.institutionName}</div>
                      <div className="text-[11px] text-slate-400">{inv.clientName}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-200 font-medium">{inv.productName}</div>
                      <div className="text-[11px] text-cyan-300">
                        {inv.billingCycle === 'annual' ? 'Langganan Tahunan (Diskon Loyal)' : inv.billingCycle === 'quarterly' ? 'Langganan 3 Bulan' : 'Langganan Bulanan'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="font-mono font-extrabold text-white text-sm">
                        Rp {inv.totalAmount.toLocaleString('id-ID')}
                      </div>
                      <div className="text-[10px] text-slate-500">Termasuk PPN 11%</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {inv.dueDate}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isPaid
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}>
                        {isPaid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>{isPaid ? 'Lunas' : 'Menunggu Bayar'}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!isPaid && (
                          <button
                            onClick={() => onOpenPaymentGateway(inv)}
                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Bayar Sekarang</span>
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedInvoiceForPrint(inv)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1"
                          title="Lihat / Cetak Faktur Resmi"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Faktur</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Printable Preview Modal */}
      {selectedInvoiceForPrint && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl w-full max-w-2xl shadow-2xl p-6 sm:p-8 my-auto font-sans relative">
            <button
              onClick={() => setSelectedInvoiceForPrint(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Print Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-6">
              <div>
                <div className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <span>apeka</span>
                  <span className="text-cyan-600">project</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Software House &amp; Cloud Web Application Services<br />
                  Jl. Rasuna Cyber Tower Lt. 12, Jakarta Selatan<br />
                  Email: billing@apeka.app · WhatsApp: +62 811-2345-6789
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">FAKTUR ELEKTRONIK</span>
                <div className="text-sm font-mono font-bold text-slate-900 mt-1">
                  {selectedInvoiceForPrint.invoiceNumber}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Tanggal: {selectedInvoiceForPrint.issueDate}<br />
                  Jatuh Tempo: {selectedInvoiceForPrint.dueDate}
                </div>
              </div>
            </div>

            {/* Client Destination */}
            <div className="py-4 border-b border-slate-200 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">DITUJUKAN KEPADA:</span>
                <div className="font-bold text-slate-900 text-sm mt-0.5">{selectedInvoiceForPrint.institutionName}</div>
                <div className="text-slate-600">{selectedInvoiceForPrint.clientName}</div>
                <div className="text-slate-600">{selectedInvoiceForPrint.clientEmail}</div>
                <div className="text-slate-600">{selectedInvoiceForPrint.clientPhone}</div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">STATUS PEMBAYARAN:</span>
                <div className="mt-1">
                  {selectedInvoiceForPrint.status === 'paid' ? (
                    <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-full border border-emerald-300">
                      LUNAS (TERVERIFIKASI)
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 font-extrabold text-xs rounded-full border border-amber-300">
                      MENUNGGU PEMBAYARAN
                    </span>
                  )}
                </div>
                {selectedInvoiceForPrint.paymentMethod && (
                  <div className="text-[11px] text-slate-500 mt-1">
                    Metode: {selectedInvoiceForPrint.paymentMethod}
                  </div>
                )}
              </div>
            </div>

            {/* Line Items */}
            <div className="py-4 border-b border-slate-200">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                    <th className="py-2">Deskripsi Layanan</th>
                    <th className="py-2 text-center">Durasi</th>
                    <th className="py-2 text-right">Harga</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3">
                      <div className="font-bold text-slate-900">{selectedInvoiceForPrint.productName}</div>
                      <div className="text-slate-500 text-[11px]">
                        Lisensi Aplikasi Web, Hosting Server, Pemeliharaan Berkala &amp; Support SLA 99.8%
                      </div>
                    </td>
                    <td className="py-3 text-center capitalize text-slate-600">
                      {selectedInvoiceForPrint.billingCycle === 'annual' ? '12 Bulan' : selectedInvoiceForPrint.billingCycle === 'quarterly' ? '3 Bulan' : '1 Bulan'}
                    </td>
                    <td className="py-3 text-right font-mono text-slate-800 font-semibold">
                      Rp {selectedInvoiceForPrint.subtotal.toLocaleString('id-ID')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total calculation */}
            <div className="py-4 border-b border-slate-200 flex justify-end text-xs">
              <div className="w-64 space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono">Rp {selectedInvoiceForPrint.subtotal.toLocaleString('id-ID')}</span>
                </div>
                {selectedInvoiceForPrint.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Diskon Pelanggan Setia:</span>
                    <span className="font-mono">- Rp {selectedInvoiceForPrint.discount.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>PPN 11%:</span>
                  <span className="font-mono">Rp {selectedInvoiceForPrint.tax.toLocaleString('id-ID')}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-slate-900 text-sm">
                  <span>Total Tagihan:</span>
                  <span className="font-mono text-cyan-700">Rp {selectedInvoiceForPrint.totalAmount.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            {/* Stempel Lunas & Actions */}
            <div className="pt-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                {selectedInvoiceForPrint.status === 'paid' && (
                  <div className="border-2 border-emerald-600 text-emerald-700 font-black text-xs px-4 py-2 rounded-xl uppercase tracking-widest transform -rotate-3">
                    LUNAS · APEKA PROJECT<br />
                    <span className="text-[9px] font-normal">{selectedInvoiceForPrint.paidDate || 'VERIFIED PAYMENT'}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / Simpan PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
