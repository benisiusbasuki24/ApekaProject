import React from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  CheckCircle, 
  ArrowUpRight, 
  ShieldCheck, 
  PieChart, 
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { Invoice, SubscriptionItem, ClientProject } from '../types';

interface AnalyticsDashboardProps {
  invoices: Invoice[];
  subscriptions: SubscriptionItem[];
  projects: ClientProject[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  invoices,
  subscriptions,
  projects
}) => {
  // Financial computations
  const totalPaidRevenue = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const pendingRevenue = invoices
    .filter(i => i.status === 'pending')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  // Approximate MRR from active subscriptions
  const mrr = subscriptions.reduce((sum, s) => {
    if (s.billingCycle === 'monthly') return sum + s.pricePaid;
    if (s.billingCycle === 'quarterly') return sum + (s.pricePaid / 3);
    if (s.billingCycle === 'annual') return sum + (s.pricePaid / 12);
    return sum;
  }, 0);

  const arr = mrr * 12;

  const totalClients = subscriptions.length;
  const activeProjectsCount = projects.filter(p => p.progressPercent < 100).length;
  const completedProjectsCount = projects.filter(p => p.progressPercent === 100).length;

  // Monthly trends mock data
  const monthlyTrends = [
    { month: 'Jun', revenue: 7800000, clients: 6 },
    { month: 'Jul', revenue: 9400000, clients: 8 },
    { month: 'Agu', revenue: 12200000, clients: 11 },
    { month: 'Sep', revenue: 15600000, clients: 14 },
    { month: 'Okt', revenue: 19800000, clients: 18 },
    { month: 'Nov', revenue: totalPaidRevenue > 0 ? totalPaidRevenue : 23500000, clients: totalClients + 15 }
  ];

  const maxRevenue = Math.max(...monthlyTrends.map(m => m.revenue));

  // Product revenue share
  const productShare = [
    { name: 'Sistem Manajemen Aset IT', share: 32, color: 'bg-cyan-400' },
    { name: 'Sistem Keuangan Sekolah', share: 24, color: 'bg-amber-400' },
    { name: 'Presensi Guru & Pegawai', share: 20, color: 'bg-emerald-400' },
    { name: 'Platform E-Learning', share: 14, color: 'bg-blue-400' },
    { name: 'Perpustakaan & Inventaris', share: 10, color: 'bg-violet-400' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <span>Dashboard Analitik Performa Bisnis SaaS apeka</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Metrik pertumbuhan pendapatan bulanan berulang (MRR), retensi klien, dan pipeline proyek.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Data Real-time Konsolidasi</span>
        </div>
      </div>

      {/* Top High-level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: MRR */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>MRR (Monthly Recurring)</span>
            <span className="text-emerald-400 font-bold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-2">
            Rp {(mrr / 1000000).toFixed(2)} <span className="text-xs font-normal text-slate-400">Juta</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            ARR Tahunan: <strong>Rp {(arr / 1000000).toFixed(1)} Juta</strong>
          </div>
        </div>

        {/* Metric 2: Total Revenue */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Pendapatan Terbayar</span>
            <span className="text-cyan-400 font-mono text-[11px]">PPN Terverifikasi</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono mt-2">
            Rp {(totalPaidRevenue / 1000000).toFixed(2)} <span className="text-xs font-normal text-slate-400">Juta</span>
          </div>
          <div className="text-[11px] text-amber-400 mt-1">
            Menunggu Bayar: Rp {(pendingRevenue / 1000000).toFixed(2)} Juta
          </div>
        </div>

        {/* Metric 3: Retention & Churn */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Tingkat Retensi Klien</span>
            <span className="text-emerald-400 font-mono text-[11px]">Sangat Sehat</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono mt-2">
            94.8%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Churn Rate: <strong>5.2%</strong> (Di bawah batas industri)
          </div>
        </div>

        {/* Metric 4: Proyek & Instansi */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Proyek Aktif Berjalan</span>
            <span className="text-cyan-400 font-mono text-[11px]">On-Schedule</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-2">
            {activeProjectsCount} <span className="text-xs font-normal text-slate-400">Instansi</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {completedProjectsCount} Proyek Sukses Serah Terima
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Tren Pendapatan &amp; Akuisisi 6 Bulan Terakhir</h3>
              <p className="text-xs text-slate-400">Pertumbuhan stabil didorong peluncuran Sistem Manajemen Aset IT.</p>
            </div>
            <div className="text-xs text-cyan-400 font-mono font-bold">
              Target Q4: 100% Tercapai
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-52 flex items-end justify-between gap-3 pt-6 border-b border-slate-800">
            {monthlyTrends.map((t, idx) => {
              const heightPercent = Math.round((t.revenue / maxRevenue) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] text-slate-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    {(t.revenue / 1000000).toFixed(1)}M
                  </div>
                  <div
                    className="w-full max-w-[42px] bg-gradient-to-t from-cyan-600 to-blue-500 rounded-t-lg transition-all duration-500 group-hover:brightness-125"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-xs font-mono font-medium text-slate-400 pt-1">
                    {t.month}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 mt-4">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-gradient-to-r from-cyan-600 to-blue-500" />
              <span>Pendapatan Langganan SaaS Bersih</span>
            </span>
            <span className="text-slate-300">
              Rata-rata Nilai Kontrak: <strong className="text-white">Rp 2.450.000 / Klien</strong>
            </span>
          </div>
        </div>

        {/* Product Revenue Share Breakdown */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight mb-1">
              Distribusi Pendapatan per Produk
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Kontribusi portofolio aplikasi terhadap omset.
            </p>

            <div className="space-y-4">
              {productShare.map((prod, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium truncate max-w-[180px]">{prod.name}</span>
                    <span className="font-mono font-bold text-white">{prod.share}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${prod.color} rounded-full`}
                      style={{ width: `${prod.share}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="text-[11px] leading-relaxed">
              Produk <strong className="text-cyan-400">Sistem Manajemen Aset IT</strong> mencatat pertumbuhan pemesanan tertinggi bulan ini.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
