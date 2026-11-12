import React, { useState, useEffect } from 'react';
import { X, QrCode, CreditCard, Smartphone, Building, CheckCircle2, Copy, Clock, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import { Invoice } from '../types';

interface PaymentGatewayModalProps {
  invoice: Invoice;
  onClose: () => void;
  onPaymentSuccess: (invoiceId: string, paymentMethod: string, referenceNo: string) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  invoice,
  onClose,
  onPaymentSuccess
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'qris' | 'va' | 'ewallet'>('qris');
  const [selectedBank, setSelectedBank] = useState<'bca' | 'mandiri' | 'bri' | 'bni'>('bca');
  const [selectedEwallet, setSelectedEwallet] = useState<'gopay' | 'ovo' | 'dana' | 'shopeepay'>('gopay');
  
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes countdown
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const vaNumbers = {
    bca: '88019' + invoice.clientPhone.replace(/[^0-9]/g, '').slice(-8),
    mandiri: '89921' + invoice.clientPhone.replace(/[^0-9]/g, '').slice(-8),
    bri: '12840' + invoice.clientPhone.replace(/[^0-9]/g, '').slice(-8),
    bni: '98830' + invoice.clientPhone.replace(/[^0-9]/g, '').slice(-8)
  };

  const currentVa = vaNumbers[selectedBank];

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateSuccess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const methodName = 
        selectedMethod === 'qris' ? 'QRIS Dinamis (BI Standard)' :
        selectedMethod === 'va' ? `Virtual Account ${selectedBank.toUpperCase()}` :
        `E-Wallet ${selectedEwallet.toUpperCase()}`;
      
      const refNo = `TRX-APK-${Date.now().toString().slice(-8)}`;
      onPaymentSuccess(invoice.id, methodName, refNo);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto flex flex-col">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Gerbang Pembayaran Lokal (Payment Gateway)</h3>
                <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                  Instant Auto-Verify
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Faktur: <span className="font-mono text-cyan-400">{invoice.invoiceNumber}</span> · {invoice.productName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Invoice Amount & Timer */}
        <div className="px-6 py-3.5 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div>
            <span className="text-slate-400">Total Nominal Pembayaran:</span>
            <div className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-0.5">
              Rp {invoice.totalAmount.toLocaleString('id-ID')}
            </div>
          </div>

          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
            <Clock className="w-4 h-4 text-amber-400" />
            <div className="text-[11px] text-amber-300">
              Sisa Waktu Pembayaran: <strong className="font-mono text-xs">{formatTimer(timeLeft)}</strong>
            </div>
          </div>
        </div>

        {/* Payment Channels Tabs */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setSelectedMethod('qris')}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                selectedMethod === 'qris'
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-lg'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <QrCode className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-bold">QRIS Dinamis</span>
              <span className="text-[10px] text-slate-500">GoPay, OVO, Dana, BCA, dll</span>
            </button>

            <button
              onClick={() => setSelectedMethod('va')}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                selectedMethod === 'va'
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-lg'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Building className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-bold">Virtual Account</span>
              <span className="text-[10px] text-slate-500">BCA, Mandiri, BRI, BNI</span>
            </button>

            <button
              onClick={() => setSelectedMethod('ewallet')}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                selectedMethod === 'ewallet'
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-lg'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-bold">E-Wallet Direct</span>
              <span className="text-[10px] text-slate-500">GoPay / OVO / Shopee</span>
            </button>
          </div>

          {/* QRIS Channel Content */}
          {selectedMethod === 'qris' && (
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-center">
              <div className="inline-block p-4 bg-white rounded-2xl shadow-xl">
                {/* Simulated Stylized QR Code */}
                <div className="w-48 h-48 bg-slate-950 p-2 flex flex-col justify-between rounded-lg mx-auto">
                  <div className="flex justify-between">
                    <div className="w-12 h-12 border-4 border-white bg-slate-950 rounded flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded-sm" />
                    </div>
                    <div className="w-12 h-12 border-4 border-white bg-slate-950 rounded flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded-sm" />
                    </div>
                  </div>
                  <div className="text-[10px] font-mono font-black text-cyan-400 tracking-wider">
                    QRIS · APEKA PAY
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="w-12 h-12 border-4 border-white bg-slate-950 rounded flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded-sm" />
                    </div>
                    <div className="text-[9px] text-white font-mono font-bold">NMID: ID1029482910</div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-xs text-slate-300 font-semibold">
                  Pindai QR Code di atas menggunakan aplikasi m-Banking atau E-Wallet apa saja
                </div>
                <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                  Sistem Payment Gateway apeka project akan otomatis mendeteksi setoran dana secara real-time tanpa perlu unggah bukti transfer.
                </p>
              </div>
            </div>
          )}

          {/* VA Channel Content */}
          {selectedMethod === 'va' && (
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {(['bca', 'mandiri', 'bri', 'bni'] as const).map(bank => (
                  <button
                    key={bank}
                    onClick={() => setSelectedBank(bank)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                      selectedBank === bank
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    Bank {bank}
                  </button>
                ))}
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400">Nomor Virtual Account {selectedBank.toUpperCase()}:</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-lg font-mono font-bold text-cyan-400 tracking-wider">{currentVa}</span>
                  <button
                    onClick={() => handleCopy(currentVa)}
                    className="flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Tersalin!' : 'Salin'}</span>
                  </button>
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  Atas Nama: <strong className="text-slate-200">APEKA / {invoice.institutionName}</strong>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1">
                <div className="font-semibold text-slate-300">Panduan Pembayaran:</div>
                <p>1. Buka Mobile Banking atau ATM {selectedBank.toUpperCase()}.</p>
                <p>2. Pilih menu Transfer &gt; Virtual Account.</p>
                <p>3. Masukkan nomor VA di atas dan verifikasi total nominal persis Rp {invoice.totalAmount.toLocaleString('id-ID')}.</p>
              </div>
            </div>
          )}

          {/* E-Wallet Channel Content */}
          {selectedMethod === 'ewallet' && (
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'gopay', name: 'GoPay / GoJek' },
                  { id: 'ovo', name: 'OVO Cash' },
                  { id: 'dana', name: 'DANA Digital' },
                  { id: 'shopeepay', name: 'ShopeePay' }
                ].map(ew => (
                  <button
                    key={ew.id}
                    onClick={() => setSelectedEwallet(ew.id as any)}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition-colors ${
                      selectedEwallet === ew.id
                        ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {ew.name}
                  </button>
                ))}
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400">Nomor Ponsel Akun Terdaftar:</span>
                <div className="font-mono text-white font-semibold mt-0.5">{invoice.clientPhone}</div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Notifikasi push pembayaran instan akan diteruskan ke aplikasi {selectedEwallet.toUpperCase()} di ponsel Anda.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Simulation & Instant Verify */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Terkoneksi API Payment Gateway Bank Indonesia</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleSimulateSuccess}
              disabled={isProcessing}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memverifikasi Notifikasi Bank...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simulasikan Pembayaran Berhasil (Instant Webhook)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
