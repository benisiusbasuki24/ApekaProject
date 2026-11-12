import React, { useState } from 'react';
import { X, CheckCircle, ShieldAlert, Sparkles, Building, User, Mail, Phone, Globe, Calendar, CreditCard } from 'lucide-react';
import { WebAppProduct, BillingCycle, SubscriptionItem, Invoice, ClientProject } from '../types';

interface SubscriptionFormModalProps {
  initialProduct?: WebAppProduct;
  initialCycle?: BillingCycle;
  products: WebAppProduct[];
  onClose: () => void;
  onSubmitSuccess: (newSub: SubscriptionItem, newInvoice: Invoice, newProject: ClientProject) => void;
}

export const SubscriptionFormModal: React.FC<SubscriptionFormModalProps> = ({
  initialProduct,
  initialCycle = 'quarterly',
  products,
  onClose,
  onSubmitSuccess
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialProduct?.id || products[0]?.id || ''
  );
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(initialCycle);
  const [autoRenew, setAutoRenew] = useState<boolean>(true);

  // Form fields
  const [formData, setFormData] = useState({
    institutionName: '',
    picName: '',
    email: '',
    phone: '',
    customDomain: '',
    specificRequirements: '',
    agreedToTerms: true
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  // Price calculations
  let basePrice = selectedProduct.baseQuarterlyPrice;
  let discount = 0;

  if (billingCycle === 'monthly') {
    basePrice = selectedProduct.monthlyPrice;
  } else if (billingCycle === 'annual') {
    basePrice = selectedProduct.annualPrice;
    discount = 350000; // Loyal customer bonus voucher
  }

  const subtotal = basePrice;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableAmount * 0.11); // 11% PPN
  const totalAmount = taxableAmount + tax;

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.institutionName.trim()) {
      errs.institutionName = 'Nama lembaga/perusahaan wajib diisi';
    } else if (formData.institutionName.trim().length < 3) {
      errs.institutionName = 'Nama lembaga minimal 3 karakter';
    }

    if (!formData.picName.trim()) {
      errs.picName = 'Nama PIC / penanggung jawab wajib diisi';
    } else if (formData.picName.trim().length < 3) {
      errs.picName = 'Nama PIC minimal 3 karakter';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Email resmi wajib diisi';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Format email tidak valid (contoh: admin@sekolah.sch.id)';
    }

    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,11}$/;
    if (!formData.phone.trim()) {
      errs.phone = 'Nomor WhatsApp wajib diisi';
    } else if (!phoneRegex.test(formData.phone.replace(/[\s-]/g, ''))) {
      errs.phone = 'Nomor WhatsApp Indonesia tidak valid (contoh: 081234567890)';
    }

    if (!formData.agreedToTerms) {
      errs.terms = 'Anda harus menyetujui syarat & ketentuan layanan apeka project';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const now = new Date();
      const startDate = now.toISOString().split('T')[0];
      
      const expiry = new Date();
      if (billingCycle === 'monthly') expiry.setMonth(expiry.getMonth() + 1);
      else if (billingCycle === 'quarterly') expiry.setMonth(expiry.getMonth() + 3);
      else expiry.setFullYear(expiry.getFullYear() + 1);
      const endDate = expiry.toISOString().split('T')[0];

      const subId = `sub-${Date.now().toString().slice(-5)}`;
      const invNum = `INV/APK/${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}/${Math.floor(100 + Math.random() * 900)}`;

      // 1. Create Subscription
      const newSub: SubscriptionItem = {
        id: subId,
        clientName: formData.picName,
        clientEmail: formData.email,
        clientPhone: formData.phone,
        institutionName: formData.institutionName,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        billingCycle: billingCycle,
        pricePaid: totalAmount,
        startDate: startDate,
        endDate: endDate,
        daysRemaining: billingCycle === 'annual' ? 365 : billingCycle === 'quarterly' ? 90 : 30,
        status: 'active',
        autoRenew: autoRenew,
        customDomain: formData.customDomain || `${formData.institutionName.toLowerCase().replace(/[^a-z0-9]/g, '')}.apeka.app`
      };

      // 2. Create Invoice
      const newInv: Invoice = {
        id: `inv-${Date.now()}`,
        invoiceNumber: invNum,
        clientName: formData.picName,
        clientEmail: formData.email,
        clientPhone: formData.phone,
        institutionName: formData.institutionName,
        productName: selectedProduct.name,
        billingCycle: billingCycle,
        issueDate: startDate,
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        subtotal: subtotal,
        discount: discount,
        tax: tax,
        totalAmount: totalAmount,
        status: 'pending',
        autoRenewTriggered: autoRenew
      };

      // 3. Create Project Tracker
      const newProj: ClientProject = {
        id: `prj-${Date.now().toString().slice(-4)}`,
        projectName: `Implementasi ${selectedProduct.name}`,
        clientName: formData.picName,
        institution: formData.institutionName,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        currentPhase: 'requirements',
        progressPercent: 20,
        startDate: startDate,
        targetGoLive: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        leadDeveloper: 'Tim Senior apeka project',
        stagingUrl: `https://${formData.institutionName.toLowerCase().replace(/[^a-z0-9]/g, '')}.apeka.preview`,
        customDomain: formData.customDomain || undefined,
        notes: formData.specificRequirements || 'Persiapan migrasi data awal & konfigurasi server.',
        milestones: [
          { id: 'm1', title: 'Analisis Kebutuhan & Verifikasi Data', description: 'Konfirmasi form pengajuan dan struktur pengguna', status: 'in_progress', targetDate: startDate },
          { id: 'm2', title: 'Setup UI/UX & Kustomisasi Identitas', description: 'Pemasangan logo dan konfigurasi hak akses', status: 'pending', targetDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0] },
          { id: 'm3', title: 'Integrasi Database & Fitur Spesifik', description: 'Pengujian performa dan konfigurasi API', status: 'pending', targetDate: new Date(Date.now() + 8 * 86400000).toISOString().split('T')[0] },
          { id: 'm4', title: 'Staging Server & Pengujian Klien', description: 'Simulasi akses oleh pengguna perwakilan', status: 'pending', targetDate: new Date(Date.now() + 11 * 86400000).toISOString().split('T')[0] },
          { id: 'm5', title: 'Go-Live Domain Resmi & Serah Terima', description: 'Penyerahan akun admin penuh & panduan manual', status: 'pending', targetDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0] }
        ],
        recentActivity: [
          { timestamp: 'Baru saja', description: 'Pengajuan langganan berhasil diverifikasi sistem' }
        ]
      };

      setIsSubmitting(false);
      onSubmitSuccess(newSub, newInv, newProj);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Form Pengajuan Langganan Aplikasi Web</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Lengkapi data institusi dengan benar untuk aktivasi instan &amp; integrasi kustom domain.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          {/* Product & Cycle Selection */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-200 block mb-1">Aplikasi Web yang Dipesan</label>
                <select
                  value={selectedProductId}
                  onChange={e => setSelectedProductId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.id === 'manajemen_aset_it' ? '⭐ (Aset IT)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-200 block mb-1">Siklus Pembayaran Langganan</label>
                <select
                  value={billingCycle}
                  onChange={e => setBillingCycle(e.target.value as BillingCycle)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
                >
                  <option value="quarterly">Per 3 Bulan (Standar Rekomendasi)</option>
                  <option value="monthly">Per Bulan (Fleksibel)</option>
                  <option value="annual">Per Tahun (Diskon Khusus Pelanggan Setia ~20%)</option>
                </select>
              </div>
            </div>

            {/* Auto-Renewal Feature Switch */}
            <div className="p-3 bg-cyan-950/20 border border-cyan-500/30 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <CreditCard className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-xs">Aktifkan Perpanjangan Otomatis (Auto-Renewal)</div>
                  <div className="text-[11px] text-slate-400">
                    Akses sistem tetap terjaga tanpa pemutusan mendadak; tagihan diterbitkan otomatis H-7 sebelum masa aktif berakhir.
                  </div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={autoRenew}
                  onChange={e => setAutoRenew(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>
          </div>

          {/* Institution & Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-200 flex items-center gap-1.5 mb-1">
                <Building className="w-3.5 h-3.5 text-cyan-400" />
                <span>Nama Sekolah / Lembaga / Perusahaan *</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: SMA Negeri 1 Harapan Bangsa"
                value={formData.institutionName}
                onChange={e => setFormData({ ...formData, institutionName: e.target.value })}
                className={`w-full bg-slate-950 border rounded-xl px-3 py-2 text-xs text-white focus:outline-none ${
                  errors.institutionName ? 'border-rose-500' : 'border-slate-800 focus:border-cyan-500'
                }`}
              />
              {errors.institutionName && <p className="text-[11px] text-rose-400 mt-1">{errors.institutionName}</p>}
            </div>

            <div>
              <label className="font-semibold text-slate-200 flex items-center gap-1.5 mb-1">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Nama Penanggung Jawab (PIC) *</span>
              </label>
              <input
                type="text"
                placeholder="Nama Lengkap &amp; Gelar"
                value={formData.picName}
                onChange={e => setFormData({ ...formData, picName: e.target.value })}
                className={`w-full bg-slate-950 border rounded-xl px-3 py-2 text-xs text-white focus:outline-none ${
                  errors.picName ? 'border-rose-500' : 'border-slate-800 focus:border-cyan-500'
                }`}
              />
              {errors.picName && <p className="text-[11px] text-rose-400 mt-1">{errors.picName}</p>}
            </div>

            <div>
              <label className="font-semibold text-slate-200 flex items-center gap-1.5 mb-1">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>Email Resmi Institusi *</span>
              </label>
              <input
                type="email"
                placeholder="admin@lembaga.sch.id"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className={`w-full bg-slate-950 border rounded-xl px-3 py-2 text-xs text-white focus:outline-none ${
                  errors.email ? 'border-rose-500' : 'border-slate-800 focus:border-cyan-500'
                }`}
              />
              {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="font-semibold text-slate-200 flex items-center gap-1.5 mb-1">
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <span>Nomor WhatsApp Aktif *</span>
              </label>
              <input
                type="text"
                placeholder="081234567890 (Untuk notifikasi invoice)"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full bg-slate-950 border rounded-xl px-3 py-2 text-xs text-white focus:outline-none ${
                  errors.phone ? 'border-rose-500' : 'border-slate-800 focus:border-cyan-500'
                }`}
              />
              {errors.phone && <p className="text-[11px] text-rose-400 mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Custom Domain & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-200 flex items-center gap-1.5 mb-1">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Rencana Custom Domain (Opsional)</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: presensi.sekolahku.sch.id"
                value={formData.customDomain}
                onChange={e => setFormData({ ...formData, customDomain: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Jika dikosongkan, akan otomatis menggunakan subdomain [nama-anda].apeka.app
              </p>
            </div>

            <div>
              <label className="font-semibold text-slate-200 block mb-1">
                Catatan Kebutuhan Khusus / Modifikasi
              </label>
              <input
                type="text"
                placeholder="Contoh: Mohon integrasikan dengan printer thermal Bluetooth"
                value={formData.specificRequirements}
                onChange={e => setFormData({ ...formData, specificRequirements: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Pricing Breakdown Summary */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-white mb-1">Rincian Perhitungan Tagihan:</div>
            <div className="flex justify-between text-slate-400">
              <span>Paket {selectedProduct.name} ({billingCycle === 'annual' ? '12 Bulan' : billingCycle === 'quarterly' ? '3 Bulan' : '1 Bulan'})</span>
              <span className="font-mono text-slate-200">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Diskon Khusus Pelanggan Setia (Voucher Tahunan)</span>
                <span className="font-mono">- Rp {discount.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400">
              <span>PPN 11% (Faktur Pajak Elektronik)</span>
              <span className="font-mono text-slate-200">Rp {tax.toLocaleString('id-ID')}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline font-bold">
              <span className="text-white text-sm">Total Pembayaran Pertama</span>
              <span className="text-cyan-400 text-base sm:text-lg font-mono">
                Rp {totalAmount.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Terms Agreement */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreedToTerms}
                onChange={e => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
              />
              <span className="text-[11px] text-slate-400">
                Saya menyetujui Ketentuan Layanan, SLA Uptime 99.8%, dan kebijakan privasi apeka project.
              </span>
            </label>
            {errors.terms && <p className="text-[11px] text-rose-400 mt-1">{errors.terms}</p>}
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memvalidasi &amp; Menerbitkan Invoice...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Kirim Pengajuan &amp; Lanjut Pembayaran</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
