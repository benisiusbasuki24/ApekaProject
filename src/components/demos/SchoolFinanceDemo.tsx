import React, { useState } from 'react';
import { DollarSign, Receipt, CheckCircle, Printer, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export const SchoolFinanceDemo: React.FC = () => {
  const [invoices, setInvoices] = useState([
    { id: 'SPP-01', student: 'Rizky Pratama (Kelas XII RPL 1)', month: 'November 2026', amount: 350000, status: 'Belum Lunas' },
    { id: 'SPP-02', student: 'Anisa Maharani (Kelas XI TKJ 2)', month: 'November 2026', amount: 350000, status: 'Lunas' },
    { id: 'SPP-03', student: 'Farel Aditya (Kelas X RPL 2)', month: 'November 2026', amount: 350000, status: 'Belum Lunas' }
  ]);

  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);

  const handlePay = (id: string) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: 'Lunas' } : inv));
    const target = invoices.find(inv => inv.id === id);
    if (target) {
      setSelectedReceipt({
        ...target,
        status: 'Lunas',
        payDate: new Date().toLocaleDateString('id-ID'),
        receiptNo: `KWT/${Date.now().toString().slice(-6)}`
      });
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-slate-200">
      <div className="border-b border-slate-800 bg-slate-950/70 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Sistem Keuangan &amp; SPP Sekolah</h3>
              <span className="text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
                Demo Langsung
              </span>
            </div>
            <p className="text-xs text-slate-400">Tagihan SPP Otomatis · Kwitansi Digital Stempel Resmi · Kas Masuk/Keluar</p>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <ArrowDownRight className="w-4 h-4 text-emerald-400" />
                <span>Penerimaan Kas SPP Bulan Ini</span>
              </div>
              <div className="text-xl font-bold text-emerald-400 tabular-nums mt-1">Rp 48.650.000</div>
              <div className="text-[11px] text-slate-400 mt-0.5">139 dari 160 siswa lunas</div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <ArrowUpRight className="w-4 h-4 text-rose-400" />
                <span>Pengeluaran Operasional Sekolah</span>
              </div>
              <div className="text-xl font-bold text-white tabular-nums mt-1">Rp 21.400.000</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Gaji honorer, listrik, wifi, ATK</div>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Tagihan Siswa (Simulasi Kasir)</h4>
            <div className="space-y-2">
              {invoices.map(inv => (
                <div key={inv.id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">{inv.student}</span>
                    <div className="text-slate-400 text-[11px]">{inv.month} · Rp {inv.amount.toLocaleString('id-ID')}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inv.status === 'Lunas' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {inv.status}
                    </span>
                    {inv.status !== 'Lunas' ? (
                      <button
                        onClick={() => handlePay(inv.id)}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded text-[11px]"
                      >
                        Bayar Kasir
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedReceipt({ ...inv, payDate: '11/11/2026', receiptNo: 'KWT/889211' })}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] flex items-center gap-1"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Kwitansi</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kwitansi Digital Preview */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Kwitansi Digital Terverifikasi</h4>
          {selectedReceipt ? (
            <div className="p-4 bg-white text-slate-900 rounded-xl shadow-lg text-xs space-y-3 font-sans">
              <div className="border-b border-slate-200 pb-2 flex justify-between items-center">
                <div>
                  <div className="font-extrabold text-sm tracking-tight text-slate-900">SMK BINTANG MANDIRI</div>
                  <div className="text-[10px] text-slate-500">Bukti Pembayaran SPP Digital</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-500 font-bold">{selectedReceipt.receiptNo}</span>
                </div>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Siswa:</span>
                  <span className="font-semibold text-slate-800">{selectedReceipt.student}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Periode:</span>
                  <span className="text-slate-800">{selectedReceipt.month}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jumlah Bayar:</span>
                  <span className="font-bold text-slate-900">Rp {selectedReceipt.amount?.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-dashed border-slate-200 flex justify-between items-center">
                <div className="w-16 h-16 border border-emerald-600 rounded flex items-center justify-center p-1 text-center text-emerald-700 font-bold text-[9px] uppercase tracking-wider transform -rotate-6">
                  LUNAS<br/>TERVERIFIKASI
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-medium"
                >
                  Cetak PDF
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Klik tombol &quot;Kwitansi&quot; pada baris tagihan lunas untuk melihat cetak kwitansi resmi.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
