import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Plus, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Calendar, 
  User, 
  Building2, 
  Globe, 
  Phone, 
  Mail, 
  Edit, 
  Trash2, 
  Zap, 
  Send, 
  Filter, 
  ArrowUpRight, 
  Layers, 
  Lock, 
  Check, 
  X,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { SubscriptionItem, WebAppProduct, BillingCycle } from '../types';
import { 
  updateSubscriptionInFirestore, 
  deleteSubscriptionFromFirestore, 
  saveSubscriptionToFirestore 
} from '../firebase';

interface SuperadminPanelProps {
  subscriptions: SubscriptionItem[];
  products: WebAppProduct[];
  onShowToast: (title: string, desc: string) => void;
  onSendReminder: (subId: string, type: 'D-7' | 'D-3' | 'D-1') => void;
}

export const SuperadminPanel: React.FC<SuperadminPanelProps> = ({
  subscriptions,
  products,
  onShowToast,
  onSendReminder
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expiring_soon' | 'expired'>('all');
  const [productFilter, setProductFilter] = useState('ALL');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSub, setEditingSub] = useState<SubscriptionItem | null>(null);
  const [extendModalSub, setExtendModalSub] = useState<SubscriptionItem | null>(null);
  const [deleteConfirmSub, setDeleteConfirmSub] = useState<SubscriptionItem | null>(null);

  // Extend duration state
  const [extendDays, setExtendDays] = useState<number>(30);

  // Form State for Adding / Editing
  const [formSub, setFormSub] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    institutionName: '',
    productId: products[0]?.id || 'manajemen_aset_it',
    billingCycle: 'quarterly' as BillingCycle,
    customDomain: '',
    durationDays: 90,
    pricePaid: 750000,
    autoRenew: true
  });

  // Filter subscriptions
  const filteredSubs = subscriptions.filter(sub => {
    const matchStatus = statusFilter === 'all' || sub.status === statusFilter;
    const matchProduct = productFilter === 'ALL' || sub.productId === productFilter;
    const matchSearch = 
      sub.clientName.toLowerCase().includes(search.toLowerCase()) ||
      sub.institutionName.toLowerCase().includes(search.toLowerCase()) ||
      sub.productName.toLowerCase().includes(search.toLowerCase()) ||
      sub.clientEmail.toLowerCase().includes(search.toLowerCase()) ||
      (sub.customDomain && sub.customDomain.toLowerCase().includes(search.toLowerCase()));
    
    return matchStatus && matchProduct && matchSearch;
  });

  // KPI Calculations
  const totalSubscribers = subscriptions.length;
  const activeCount = subscriptions.filter(s => s.status === 'active').length;
  const expiringCount = subscriptions.filter(s => s.status === 'expiring_soon').length;
  const expiredCount = subscriptions.filter(s => s.status === 'expired').length;
  const totalContractValue = subscriptions.reduce((sum, s) => sum + s.pricePaid, 0);

  // Quick Action: Extend subscription duration in Firestore
  const handleExtendSubscription = async () => {
    if (!extendModalSub) return;

    const currentEnd = new Date(extendModalSub.endDate);
    const newEnd = new Date(currentEnd.getTime() + extendDays * 86400000);
    const newEndDateStr = newEnd.toISOString().split('T')[0];
    const newDaysRemaining = Math.max(1, extendModalSub.daysRemaining + extendDays);

    const updates: Partial<SubscriptionItem> = {
      endDate: newEndDateStr,
      daysRemaining: newDaysRemaining,
      status: 'active',
      lastRenewalDate: new Date().toISOString().split('T')[0]
    };

    await updateSubscriptionInFirestore(extendModalSub.id, updates);
    onShowToast(
      'Masa Aktif Berhasil Diperpanjang!',
      `Langganan ${extendModalSub.institutionName} ditambah ${extendDays} hari (Jatuh tempo: ${newEndDateStr}). Real-time tersinkron ke Firebase.`
    );
    setExtendModalSub(null);
  };

  // Quick Action: Toggle status (Active / Suspended)
  const handleToggleStatus = async (sub: SubscriptionItem) => {
    const newStatus: SubscriptionItem['status'] = 
      sub.status === 'active' ? 'expired' : 'active';
    
    const updates: Partial<SubscriptionItem> = {
      status: newStatus
    };

    await updateSubscriptionInFirestore(sub.id, updates);
    onShowToast(
      'Status Layanan Diperbarui',
      `Aplikasi ${sub.productName} milik ${sub.institutionName} kini ${newStatus === 'active' ? 'DIAKTIFKAN' : 'DIBEKUKAN / SUSPENDED'}.`
    );
  };

  // Quick Action: Toggle Auto-Renewal
  const handleToggleAutoRenew = async (sub: SubscriptionItem) => {
    const newVal = !sub.autoRenew;
    await updateSubscriptionInFirestore(sub.id, { autoRenew: newVal });
    onShowToast(
      'Auto-Renewal Diperbarui',
      `Perpanjangan otomatis untuk ${sub.institutionName} sekarang ${newVal ? 'AKTIF' : 'NONAKTIF'}.`
    );
  };

  // Quick Action: Delete subscription
  const handleDeleteSubscription = async () => {
    if (!deleteConfirmSub) return;
    await deleteSubscriptionFromFirestore(deleteConfirmSub.id);
    onShowToast(
      'Langganan Berhasil Dihapus',
      `Data langganan ${deleteConfirmSub.institutionName} telah dihapus dari Cloud Firestore.`
    );
    setDeleteConfirmSub(null);
  };

  // Create new subscription manually by superadmin
  const handleCreateSub = async (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find(p => p.id === formSub.productId) || products[0];
    const now = new Date();
    const startDate = now.toISOString().split('T')[0];
    const endDate = new Date(now.getTime() + formSub.durationDays * 86400000).toISOString().split('T')[0];

    const newSub: SubscriptionItem = {
      id: `sub-${Date.now().toString().slice(-6)}`,
      clientName: formSub.clientName,
      clientEmail: formSub.clientEmail,
      clientPhone: formSub.clientPhone,
      institutionName: formSub.institutionName,
      productId: prod.id,
      productName: prod.name,
      billingCycle: formSub.billingCycle,
      pricePaid: Number(formSub.pricePaid),
      startDate: startDate,
      endDate: endDate,
      daysRemaining: formSub.durationDays,
      status: 'active',
      autoRenew: formSub.autoRenew,
      customDomain: formSub.customDomain || `${formSub.institutionName.toLowerCase().replace(/[^a-z0-9]/g, '')}.apeka.app`
    };

    await saveSubscriptionToFirestore(newSub);
    onShowToast(
      'Pelanggan Berhasil Didaftarkan',
      `Aplikasi ${prod.name} untuk ${formSub.institutionName} telah dibuat di database cloud.`
    );
    setShowAddModal(false);
  };

  // Save edited subscription
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSub) return;

    await updateSubscriptionInFirestore(editingSub.id, editingSub);
    onShowToast(
      'Perubahan Berhasil Disimpan',
      `Detail langganan ${editingSub.institutionName} terupdate di Firebase.`
    );
    setEditingSub(null);
  };

  return (
    <div className="space-y-6">
      {/* Superadmin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Superadmin Control Center apeka project</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>Manajemen Pelanggan &amp; Seluruh Aplikasi Web Terdaftar</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Pusat kendali operasional superadmin untuk memantau nama aplikasi, nama pemilik, masa aktif, perpanjangan instan, serta integrasi real-time Google Cloud Firestore.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Firebase Firestore: <strong className="text-emerald-400">Live Synced</strong></span>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pelanggan Baru</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400">Total Pelanggan Terdaftar</div>
          <div className="text-2xl font-extrabold text-white font-mono mt-1">
            {totalSubscribers} <span className="text-xs font-normal text-slate-400">Instansi</span>
          </div>
          <div className="text-[11px] text-cyan-400 mt-0.5 font-medium">Semua aplikasi web terpusat</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400">Status Langganan Aktif</div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
            {activeCount} <span className="text-xs font-normal text-slate-400">Aktif</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Layanan berjalan normal</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400">Kritis Segera Berakhir (&lt; 10 Hari)</div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">
            {expiringCount} <span className="text-xs font-normal text-slate-400">Kritis</span>
          </div>
          <div className="text-[11px] text-amber-400/90 mt-0.5">Memerlukan follow-up perpanjangan</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400">Total Nilai Kontrak Langganan</div>
          <div className="text-2xl font-extrabold text-cyan-400 font-mono mt-1">
            Rp {(totalContractValue / 1000000).toFixed(1)} <span className="text-xs font-normal text-slate-400">Juta</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">{expiredCount} aplikasi nonaktif/expired</div>
        </div>
      </div>

      {/* Control Filters & Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama aplikasi, pemilik, sekolah/kantor, email, atau domain..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-medium"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="p-1 bg-slate-950 border border-slate-800 rounded-xl flex items-center text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                statusFilter === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua ({totalSubscribers})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                statusFilter === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              Aktif ({activeCount})
            </button>
            <button
              onClick={() => setStatusFilter('expiring_soon')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                statusFilter === 'expiring_soon' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              Kritis ({expiringCount})
            </button>
            <button
              onClick={() => setStatusFilter('expired')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                statusFilter === 'expired' ? 'bg-rose-500/20 text-rose-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              Expired ({expiredCount})
            </button>
          </div>

          {/* Product Filter */}
          <select
            value={productFilter}
            onChange={e => setProductFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Semua Jenis Aplikasi</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Customers & Applications Control Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-bold">
              <tr>
                <th className="py-4 px-5">Aplikasi Web &amp; Domain</th>
                <th className="py-4 px-5">Nama Pemilik &amp; Lembaga</th>
                <th className="py-4 px-5">Status &amp; Auto-Renew</th>
                <th className="py-4 px-5">Sisa Waktu Berlangganan</th>
                <th className="py-4 px-5">Paket &amp; Nilai</th>
                <th className="py-4 px-5 text-right">Kontrol Superadmin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSubs.length > 0 ? (
                filteredSubs.map(sub => {
                  const isExpiring = sub.daysRemaining <= 10 && sub.daysRemaining > 0;
                  const isExpired = sub.daysRemaining <= 0 || sub.status === 'expired';

                  return (
                    <tr key={sub.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* 1. Nama Aplikasi & Domain */}
                      <td className="py-4 px-5">
                        <div className="font-bold text-white text-sm flex items-center gap-1.5">
                          <span>{sub.productName}</span>
                          {sub.productId === 'manajemen_aset_it' && (
                            <span className="text-[9px] bg-cyan-400 text-slate-950 font-black px-1.5 py-0.2 rounded">
                              ITAM
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-cyan-400 font-mono mt-0.5 flex items-center gap-1">
                          <Globe className="w-3 h-3 text-slate-500" />
                          <span>{sub.customDomain || 'subdomain.apeka.app'}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {sub.id}</div>
                      </td>

                      {/* 2. Nama Pemilik & Lembaga */}
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-100 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{sub.clientName}</span>
                        </div>
                        <div className="text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                          <Building2 className="w-3 h-3 text-slate-500" />
                          <span>{sub.institutionName}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {sub.clientEmail}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {sub.clientPhone}
                          </span>
                        </div>
                      </td>

                      {/* 3. Status & Auto-Renew */}
                      <td className="py-4 px-5">
                        <div className="space-y-1.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isExpired
                              ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                              : isExpiring
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              isExpired ? 'bg-rose-400' : isExpiring ? 'bg-amber-400' : 'bg-emerald-400'
                            }`} />
                            <span>
                              {isExpired ? 'Kadaluarsa / Dibekukan' : isExpiring ? 'Kritis Segera Habis' : 'Aktif Beroperasi'}
                            </span>
                          </span>

                          <div className="flex items-center gap-2 text-[11px]">
                            <span className="text-slate-400 text-[10px]">Auto-Renew:</span>
                            <button
                              onClick={() => handleToggleAutoRenew(sub)}
                              className={`px-2 py-0.2 rounded text-[10px] font-bold transition-colors ${
                                sub.autoRenew 
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                                  : 'bg-slate-800 text-slate-400 hover:text-white'
                              }`}
                              title="Klik untuk ubah setelan perpanjangan otomatis pelanggan"
                            >
                              {sub.autoRenew ? '✓ AKTIF' : 'NONAKTIF'}
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* 4. Sisa Waktu Berlangganan */}
                      <td className="py-4 px-5">
                        <div className="font-mono text-sm font-extrabold text-white flex items-center gap-1.5">
                          <Clock className={`w-3.5 h-3.5 ${
                            isExpired ? 'text-rose-400' : isExpiring ? 'text-amber-400' : 'text-cyan-400'
                          }`} />
                          <span className={isExpired ? 'text-rose-400' : isExpiring ? 'text-amber-400' : 'text-emerald-400'}>
                            {isExpired ? '0 Hari (Expired)' : `${sub.daysRemaining} Hari Lagi`}
                          </span>
                        </div>

                        {/* Mini progress bar of duration */}
                        <div className="w-28 h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isExpired ? 'bg-rose-500' : isExpiring ? 'bg-amber-500' : 'bg-cyan-500'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(5, (sub.daysRemaining / (sub.billingCycle === 'annual' ? 365 : 90)) * 100))}%` }}
                          />
                        </div>

                        <div className="text-[10px] text-slate-500 font-mono mt-1">
                          Masa aktif s/d {sub.endDate}
                        </div>
                      </td>

                      {/* 5. Paket & Nilai */}
                      <td className="py-4 px-5">
                        <div className="font-mono font-extrabold text-slate-100">
                          Rp {sub.pricePaid.toLocaleString('id-ID')}
                        </div>
                        <div className="text-[11px] text-cyan-400 font-medium capitalize">
                          {sub.billingCycle === 'annual' ? 'Tahunan (~20% off)' : sub.billingCycle === 'quarterly' ? '3 Bulan (Kuartalan)' : 'Bulanan'}
                        </div>
                      </td>

                      {/* 6. Kontrol Superadmin Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Extend Duration */}
                          <button
                            onClick={() => {
                              setExtendModalSub(sub);
                              setExtendDays(30);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 font-semibold text-xs flex items-center gap-1 transition-colors"
                            title="Perpanjang Masa Aktif Langganan"
                          >
                            <Zap className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Perpanjang</span>
                          </button>

                          {/* Toggle Active / Suspend */}
                          <button
                            onClick={() => handleToggleStatus(sub)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              sub.status === 'active'
                                ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/20'
                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
                            }`}
                            title={sub.status === 'active' ? 'Bekukan / Suspend Layanan' : 'Aktifkan Kembali Layanan'}
                          >
                            <Lock className="w-3.5 h-3.5" />
                          </button>

                          {/* Send Notification Email */}
                          <button
                            onClick={() => onSendReminder(sub.id, sub.daysRemaining <= 3 ? 'D-3' : 'D-7')}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors"
                            title="Kirim Notifikasi Email Pengingat ke Pemilik"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Details */}
                          <button
                            onClick={() => setEditingSub(sub)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Edit Data Pelanggan"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteConfirmSub(sub)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Putus / Hapus Langganan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500 text-xs">
                    Tidak ditemukan data pelanggan yang cocok dengan pencarian atau filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Extend Subscription (+30, +90, +365 Days) */}
      {extendModalSub && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-base">Perpanjang Akses Langganan</h3>
              </div>
              <button onClick={() => setExtendModalSub(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
              <div>Lembaga: <strong className="text-white">{extendModalSub.institutionName}</strong></div>
              <div>Aplikasi: <strong className="text-cyan-400">{extendModalSub.productName}</strong></div>
              <div>Pemilik: <span className="text-slate-300">{extendModalSub.clientName}</span></div>
              <div>Masa Aktif Sekarang: <span className="font-mono text-slate-300">{extendModalSub.endDate} ({extendModalSub.daysRemaining} hari tersisa)</span></div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Pilih Durasi Tambahan Hari:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { days: 30, label: '+30 Hari (1 Bulan)' },
                  { days: 90, label: '+90 Hari (3 Bulan)' },
                  { days: 365, label: '+1 Tahun (365 Hari)' }
                ].map(opt => (
                  <button
                    key={opt.days}
                    type="button"
                    onClick={() => setExtendDays(opt.days)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      extendDays === opt.days
                        ? 'bg-cyan-500 text-slate-950 shadow-md'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setExtendModalSub(null)}
                className="px-4 py-2 text-xs rounded-xl text-slate-400 hover:text-white"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExtendSubscription}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20"
              >
                Konfirmasi Perpanjangan Cloud
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {deleteConfirmSub && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-3xl max-w-sm w-full p-6 text-slate-200 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="font-bold text-white text-base">Hapus Langganan Pelanggan?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Anda akan memutus dan menghapus akses aplikasi <strong>{deleteConfirmSub.productName}</strong> untuk <strong>{deleteConfirmSub.institutionName}</strong> dari database Firestore.
            </p>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmSub(null)}
                className="px-4 py-2 text-xs rounded-xl bg-slate-800 text-slate-300 hover:text-white font-medium"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteSubscription}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30"
              >
                Ya, Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Subscription */}
      {editingSub && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Edit Detail Pelanggan &amp; Aplikasi</h3>
              <button onClick={() => setEditingSub(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Nama Instansi / Sekolah / Kantor</label>
                <input
                  type="text"
                  required
                  value={editingSub.institutionName}
                  onChange={e => setEditingSub({ ...editingSub, institutionName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Nama Pemilik / PIC</label>
                  <input
                    type="text"
                    required
                    value={editingSub.clientName}
                    onChange={e => setEditingSub({ ...editingSub, clientName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">No. WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={editingSub.clientPhone}
                    onChange={e => setEditingSub({ ...editingSub, clientPhone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Email Resmi</label>
                <input
                  type="email"
                  required
                  value={editingSub.clientEmail}
                  onChange={e => setEditingSub({ ...editingSub, clientEmail: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Custom Domain</label>
                <input
                  type="text"
                  value={editingSub.customDomain || ''}
                  onChange={e => setEditingSub({ ...editingSub, customDomain: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Status Layanan</label>
                  <select
                    value={editingSub.status}
                    onChange={e => setEditingSub({ ...editingSub, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="active">Aktif</option>
                    <option value="expiring_soon">Segera Berakhir</option>
                    <option value="expired">Expired / Nonaktif</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Sisa Hari</label>
                  <input
                    type="number"
                    value={editingSub.daysRemaining}
                    onChange={e => setEditingSub({ ...editingSub, daysRemaining: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSub(null)}
                  className="px-4 py-2 text-xs rounded-xl text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New Subscription (Superadmin Direct Provisioning) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Registrasi Pelanggan Baru (Superadmin Direct)</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateSub} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Aplikasi Web yang Didaftarkan</label>
                <select
                  value={formSub.productId}
                  onChange={e => {
                    const p = products.find(x => x.id === e.target.value);
                    setFormSub({ 
                      ...formSub, 
                      productId: e.target.value,
                      pricePaid: p?.baseQuarterlyPrice || 750000 
                    });
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-semibold"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Nama Sekolah / Lembaga / Perusahaan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: SMA Negeri 3 Cibinong"
                  value={formSub.institutionName}
                  onChange={e => setFormSub({ ...formSub, institutionName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Nama Pemilik / PIC</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Lengkap"
                    value={formSub.clientName}
                    onChange={e => setFormSub({ ...formSub, clientName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">No. WhatsApp</label>
                  <input
                    type="text"
                    required
                    placeholder="081234567890"
                    value={formSub.clientPhone}
                    onChange={e => setFormSub({ ...formSub, clientPhone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Email Resmi</label>
                <input
                  type="email"
                  required
                  placeholder="admin@sekolah.sch.id"
                  value={formSub.clientEmail}
                  onChange={e => setFormSub({ ...formSub, clientEmail: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Durasi Langganan Awal</label>
                  <select
                    value={formSub.durationDays}
                    onChange={e => setFormSub({ ...formSub, durationDays: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value={30}>30 Hari (1 Bulan)</option>
                    <option value={90}>90 Hari (3 Bulan - Standar)</option>
                    <option value={365}>365 Hari (1 Tahun)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Nilai Tagihan (IDR)</label>
                  <input
                    type="number"
                    value={formSub.pricePaid}
                    onChange={e => setFormSub({ ...formSub, pricePaid: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Domain Custom (Opsional)</label>
                <input
                  type="text"
                  placeholder="presensi.sekolah.sch.id"
                  value={formSub.customDomain}
                  onChange={e => setFormSub({ ...formSub, customDomain: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs rounded-xl text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg"
                >
                  Simpan &amp; Terbitkan ke Firebase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
