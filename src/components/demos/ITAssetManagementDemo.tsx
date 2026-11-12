import React, { useState } from 'react';
import { 
  Laptop, 
  Server, 
  ShieldCheck, 
  AlertTriangle, 
  Wrench, 
  History, 
  Code2, 
  Plus, 
  Search, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Building2, 
  User, 
  QrCode, 
  BellRing,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { ITAsset, MaintenanceLog, AuditHistoryLog } from '../../types';
import { INITIAL_IT_ASSETS, INITIAL_MAINTENANCE_LOGS, INITIAL_AUDIT_LOGS } from '../../data/mockData';

export const ITAssetManagementDemo: React.FC = () => {
  const [assets, setAssets] = useState<ITAsset[]>(INITIAL_IT_ASSETS);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>(INITIAL_MAINTENANCE_LOGS);
  const [auditLogs, setAuditLogs] = useState<AuditHistoryLog[]>(INITIAL_AUDIT_LOGS);
  
  const [activeTab, setActiveTab] = useState<'inventory' | 'warranty' | 'maintenance' | 'audit' | 'api'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedAsset, setSelectedAsset] = useState<ITAsset | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showApiSyncToast, setShowApiSyncToast] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [qrModalAsset, setQrModalAsset] = useState<ITAsset | null>(null);

  // New asset form state
  const [newAsset, setNewAsset] = useState({
    name: '',
    category: 'Laptop' as ITAsset['category'],
    brandModel: '',
    serialNumber: '',
    specifications: '',
    location: '',
    department: 'Software Engineering',
    assignedUser: '',
    purchaseCost: 15000000,
    warrantyMonths: 36
  });

  // New maintenance schedule form state
  const [maintenanceForm, setMaintenanceForm] = useState({
    assetId: assets[0]?.id || '',
    type: 'Preventive' as MaintenanceLog['type'],
    scheduledDate: '2026-12-05',
    technician: 'PT Solusi Servis Mandiri',
    cost: 500000,
    notes: 'Pemeriksaan performa dan pembersihan internal rutin.'
  });

  // Calculate real-time stats
  const totalAssets = assets.length;
  const totalValue = assets.reduce((sum, a) => sum + a.purchaseCost, 0);
  const activeWarranties = assets.filter(a => a.warrantyStatus === 'active').length;
  const expiringWarranties = assets.filter(a => a.warrantyStatus === 'warning').length;
  const expiredWarranties = assets.filter(a => a.warrantyStatus === 'expired').length;
  const scheduledMaintenances = maintenanceLogs.filter(m => m.status === 'Scheduled').length;

  const filteredAssets = assets.filter(asset => {
    const matchSearch = 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.assetTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.assignedUser.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = categoryFilter === 'ALL' || asset.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.name || !newAsset.serialNumber) return;

    const purchaseDate = new Date().toISOString().split('T')[0];
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + Number(newAsset.warrantyMonths));
    const warrantyEndDate = expiry.toISOString().split('T')[0];

    const newTag = `APK-IT-00${assets.length + 1}`;
    const created: ITAsset = {
      id: `ast-${Date.now()}`,
      assetTag: newTag,
      name: newAsset.name,
      category: newAsset.category,
      brandModel: newAsset.brandModel || newAsset.name,
      serialNumber: newAsset.serialNumber,
      specifications: newAsset.specifications || 'Standard Enterprise Specification',
      location: newAsset.location || 'Headquarters Jakarta',
      department: newAsset.department,
      assignedUser: newAsset.assignedUser || 'Belum Diisi',
      purchaseDate: purchaseDate,
      purchaseCost: Number(newAsset.purchaseCost),
      warrantyEndDate: warrantyEndDate,
      warrantyStatus: 'active',
      status: 'active',
      nextScheduledMaintenance: '2026-12-30',
      qrCodeValue: `${newTag}-${newAsset.serialNumber}`
    };

    setAssets([created, ...assets]);
    
    // Add audit entry
    const newAudit: AuditHistoryLog = {
      id: `aud-${Date.now()}`,
      assetId: created.id,
      assetTag: created.assetTag,
      timestamp: new Date().toLocaleString('id-ID'),
      action: 'Registrasi Aset',
      performedBy: 'IT Asset Manager',
      details: `Aset ${created.name} (${created.serialNumber}) didaftarkan ke inventaris departemen ${created.department}.`
    };
    setAuditLogs([newAudit, ...auditLogs]);

    setShowAddModal(false);
    setNewAsset({
      name: '',
      category: 'Laptop',
      brandModel: '',
      serialNumber: '',
      specifications: '',
      location: '',
      department: 'Software Engineering',
      assignedUser: '',
      purchaseCost: 15000000,
      warrantyMonths: 36
    });
  };

  const handleScheduleMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAsset = assets.find(a => a.id === maintenanceForm.assetId);
    if (!targetAsset) return;

    const newLog: MaintenanceLog = {
      id: `mnt-${Date.now()}`,
      assetId: targetAsset.id,
      assetTag: targetAsset.assetTag,
      assetName: targetAsset.name,
      type: maintenanceForm.type,
      scheduledDate: maintenanceForm.scheduledDate,
      technician: maintenanceForm.technician,
      cost: Number(maintenanceForm.cost),
      status: 'Scheduled',
      notes: maintenanceForm.notes,
      userNotified: true
    };

    setMaintenanceLogs([newLog, ...maintenanceLogs]);
    
    // Audit log
    const audit: AuditHistoryLog = {
      id: `aud-${Date.now()}`,
      assetId: targetAsset.id,
      assetTag: targetAsset.assetTag,
      timestamp: new Date().toLocaleString('id-ID'),
      action: 'Servis & Perbaikan',
      performedBy: 'Lead Maintenance Engineer',
      details: `Jadwal pemeliharaan ${maintenanceForm.type} diagendakan pada ${maintenanceForm.scheduledDate}. Notifikasi otomatis dikirim ke ${targetAsset.assignedUser}.`
    };
    setAuditLogs([audit, ...auditLogs]);

    setShowMaintenanceModal(false);
  };

  const triggerApiSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setShowApiSyncToast(true);
      setTimeout(() => setShowApiSyncToast(false), 4000);
    }, 1200);
  };

  const exportCsv = () => {
    const headers = "Tag,Nama,Kategori,Serial,User,Departemen,Lokasi,Nilai_IDR,Status_Garansi\n";
    const rows = assets.map(a => 
      `"${a.assetTag}","${a.name}","${a.category}","${a.serialNumber}","${a.assignedUser}","${a.department}","${a.location}","${a.purchaseCost}","${a.warrantyStatus}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `laporan-aset-it-apeka-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-slate-200">
      {/* Top Header of the Embedded App */}
      <div className="border-b border-slate-800 bg-slate-950/70 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">Sistem Manajemen Aset IT Enterprise</h3>
              <span className="text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                Live Interactive Demo
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Pelacakan Hardware · Garansi Real-time · Pemeliharaan Berkala · Audit Trail · API Sync
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerApiSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Sinkronkan data dengan Departemen Finance & HR via API"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync API Dept'}</span>
          </button>

          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Aset</span>
          </button>
        </div>
      </div>

      {/* Real-time KPI Metric Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-800 bg-slate-900/90 border-b border-slate-800">
        <div className="p-4">
          <div className="text-xs text-slate-400 font-medium">Total Aset Terdaftar</div>
          <div className="text-2xl font-bold text-white tabular-nums mt-1">{totalAssets} <span className="text-xs font-normal text-slate-400">Unit</span></div>
          <div className="text-[11px] text-cyan-400 mt-0.5">100% Aktif Terinventarisasi</div>
        </div>

        <div className="p-4">
          <div className="text-xs text-slate-400 font-medium">Total Nilai Investasi IT</div>
          <div className="text-2xl font-bold text-white tabular-nums mt-1">
            Rp {(totalValue / 1000000).toFixed(1)} <span className="text-xs font-normal text-slate-400">Juta</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Depresiasi terkontrol</div>
        </div>

        <div className="p-4">
          <div className="text-xs text-slate-400 font-medium">Status Garansi Pabrik</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-bold text-emerald-400 tabular-nums">{activeWarranties} Aktif</span>
            <span className="text-slate-600">·</span>
            <span className="text-lg font-bold text-amber-400 tabular-nums">{expiringWarranties} Kritis</span>
          </div>
          <div className="text-[11px] text-amber-400/90 mt-0.5">{expiringWarranties} aset garansi &lt; 30 hari</div>
        </div>

        <div className="p-4">
          <div className="text-xs text-slate-400 font-medium">Jadwal Pemeliharaan</div>
          <div className="text-2xl font-bold text-white tabular-nums mt-1">{scheduledMaintenances} <span className="text-xs font-normal text-slate-400">Agenda</span></div>
          <div className="text-[11px] text-blue-400 mt-0.5">Notifikasi teknisi terkirim</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1 overflow-x-auto py-2">
          {[
            { id: 'inventory', label: 'Pelacakan Hardware', icon: Laptop, count: assets.length },
            { id: 'warranty', label: 'Masa Garansi & Klaim', icon: ShieldCheck, count: expiringWarranties + expiredWarranties },
            { id: 'maintenance', label: 'Pemeliharaan Berkala', icon: Wrench, count: maintenanceLogs.length },
            { id: 'audit', label: 'Audit Histori Mutasi', icon: History, count: auditLogs.length },
            { id: 'api', label: 'Integrasi API Dept', icon: Code2 }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  active 
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    active ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {activeTab === 'maintenance' && (
          <button
            onClick={() => setShowMaintenanceModal(true)}
            className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 py-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Jadwalkan Servis Baru</span>
          </button>
        )}
      </div>

      {/* Tab 1: Inventory Table */}
      {activeTab === 'inventory' && (
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari Tag, Serial, User, atau Model..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Kategori:</span>
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">Semua Kategori</option>
                <option value="Laptop">Laptop</option>
                <option value="Server">Server</option>
                <option value="Network">Network</option>
                <option value="Workstation">Workstation</option>
                <option value="Peripherals">Peripherals</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Tag &amp; Perangkat</th>
                  <th className="py-3 px-4">Spesifikasi &amp; Serial</th>
                  <th className="py-3 px-4">Pengguna &amp; Dept</th>
                  <th className="py-3 px-4">Lokasi Fisik</th>
                  <th className="py-3 px-4">Garansi</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredAssets.map(asset => (
                  <tr key={asset.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{asset.name}</div>
                      <div className="text-[11px] text-cyan-400 font-mono">{asset.assetTag}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-300 max-w-[220px] truncate" title={asset.specifications}>{asset.specifications}</div>
                      <div className="text-[11px] text-slate-500 font-mono">SN: {asset.serialNumber}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-200 font-medium flex items-center gap-1.5">
                        <User className="w-3 h-3 text-slate-500" />
                        <span>{asset.assignedUser}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">{asset.department}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-300 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-500" />
                        <span>{asset.location}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {asset.warrantyStatus === 'active' && (
                        <div className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Aktif s/d {asset.warrantyEndDate}</span>
                        </div>
                      )}
                      {asset.warrantyStatus === 'warning' && (
                        <div className="inline-flex items-center gap-1 text-amber-400 text-[11px] font-medium">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Habis {asset.warrantyEndDate}</span>
                        </div>
                      )}
                      {asset.warrantyStatus === 'expired' && (
                        <div className="inline-flex items-center gap-1 text-rose-400 text-[11px]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Habis Garansi</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        asset.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {asset.status === 'active' ? 'Operasional' : 'Maintenance'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setQrModalAsset(asset)}
                          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 rounded transition-colors"
                          title="Lihat QR Code Asset Tag"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedAsset(asset)}
                          className="px-2 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        >
                          Detail
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Warranty & Expiry Tracker */}
      {activeTab === 'warranty' && (
        <div className="p-6">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-amber-300">Peringatan Garansi Hardware Kritis</div>
              <p className="text-xs text-amber-200/80 mt-1 leading-relaxed">
                Sistem apeka IT Asset Management secara otomatis mengirimi tim IT peringatan H-60 dan H-30 hari sebelum garansi resmi server atau workstation habis agar perpanjangan garansi (Care Pack/SLA) dapat segera diproses tanpa celah risiko downtime.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assets.map(asset => {
              const isWarning = asset.warrantyStatus === 'warning';
              const isExpired = asset.warrantyStatus === 'expired';
              return (
                <div 
                  key={asset.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isWarning 
                      ? 'bg-amber-950/20 border-amber-500/40 shadow-lg shadow-amber-950/30' 
                      : isExpired 
                      ? 'bg-rose-950/20 border-rose-500/30' 
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-cyan-400">{asset.assetTag}</span>
                      <h4 className="font-bold text-white text-sm mt-0.5">{asset.name}</h4>
                      <p className="text-xs text-slate-400">{asset.brandModel}</p>
                    </div>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      isWarning ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                      isExpired ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {isWarning ? 'Garansi Kritis (<30 Hari)' : isExpired ? 'Garansi Berakhir' : 'Garansi Aktif'}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Tanggal Pembelian</span>
                      <span className="text-slate-300 font-mono">{asset.purchaseDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Jatuh Tempo Garansi</span>
                      <span className="text-slate-200 font-mono font-medium">{asset.warrantyEndDate}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-slate-400">
                      Penanggung Jawab: <span className="text-slate-200 font-medium">{asset.assignedUser}</span>
                    </div>
                    {isWarning && (
                      <button 
                        onClick={() => alert(`Pengajuan klaim atau perpanjangan SLA untuk aset ${asset.assetTag} dikirim ke vendor ${asset.brandModel}!`)}
                        className="text-xs font-semibold px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg transition-colors"
                      >
                        Klaim / Perpanjang SLA
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Maintenance & Repair Schedule */}
      {activeTab === 'maintenance' && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-white">Jadwal Pemeliharaan &amp; Riwayat Servis</h4>
              <p className="text-xs text-slate-400">Pemeliharaan preventif rutin mencegah kerusakan mendadak pada aset kritis.</p>
            </div>
            <button
              onClick={() => setShowMaintenanceModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Jadwalkan Servis</span>
            </button>
          </div>

          <div className="space-y-3">
            {maintenanceLogs.map(log => (
              <div key={log.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    log.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    log.status === 'In Progress' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  }`}>
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{log.assetName}</span>
                      <span className="text-xs font-mono text-cyan-400">({log.assetTag})</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {log.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{log.notes}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                      <span>Teknisi: <strong className="text-slate-300">{log.technician}</strong></span>
                      <span>·</span>
                      <span>Estimasi Biaya: <strong className="text-slate-300">Rp {log.cost.toLocaleString('id-ID')}</strong></span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-emerald-400">
                        <BellRing className="w-3 h-3" /> Notifikasi Pengguna Terkirim
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs text-slate-400">Jadwal Pelaksanaan</div>
                  <div className="text-sm font-semibold text-white font-mono">{log.scheduledDate}</div>
                  <span className={`inline-block mt-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    log.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300' :
                    log.status === 'In Progress' ? 'bg-amber-500/20 text-amber-300' :
                    'bg-blue-500/20 text-blue-300'
                  }`}>
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Audit Histori & Chain of Custody */}
      {activeTab === 'audit' && (
        <div className="p-6">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-white">Log Audit &amp; Histori Serah Terima (Chain of Custody)</h4>
            <p className="text-xs text-slate-400">Setiap mutasi perpindahan aset dan perubahan spesifikasi tercatat permanen untuk audit kepatuhan ISO/ITIL.</p>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {auditLogs.map((audit) => (
              <div key={audit.id} className="relative group">
                <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-cyan-500 border-2 border-slate-900 group-hover:scale-125 transition-transform" />
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{audit.action}</span>
                      <span className="text-xs font-mono text-cyan-400">[{audit.assetTag}]</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">{audit.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{audit.details}</p>
                  <div className="text-[10px] text-slate-500 mt-2">
                    Dicatat oleh: <span className="text-slate-400 font-medium">{audit.performedBy}</span>
                    {audit.departmentTo && (
                      <span className="ml-2 text-cyan-400">→ Mutasi ke: {audit.departmentTo}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: REST API Sync Simulator */}
      {activeTab === 'api' && (
        <div className="p-6">
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-sm font-bold text-white">Sinkronisasi Data Antar Departemen (REST API &amp; Webhook)</h4>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  Menghubungkan data aset IT secara real-time dengan sistem ERP Finance (untuk depresiasi aset &amp; pembukuan) serta sistem HRIS (untuk onboarding/offboarding karyawan).
                </p>
              </div>

              <button
                onClick={triggerApiSync}
                disabled={isSyncing}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-2 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Jalankan Manual Trigger Sync</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="space-y-3">
                <label className="text-xs font-medium text-slate-400 block">Endpoint Sinkronisasi Departemen</label>
                <div className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-cyan-300">
                  <span className="bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded text-[10px] font-bold">POST</span>
                  <span>https://api.apeka.io/v1/assets/sync</span>
                </div>

                <label className="text-xs font-medium text-slate-400 block mt-2">API Authorization Token</label>
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-400 flex items-center justify-between">
                  <span>apk_live_99a8b72c91823719028e...</span>
                  <button 
                    onClick={() => alert("Token API telah disalin ke clipboard!")}
                    className="text-cyan-400 hover:text-cyan-300 text-[11px]"
                  >
                    Salin
                  </button>
                </div>

                <div className="text-xs text-slate-400 space-y-1 pt-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sinkronisasi Departemen Finance: <strong className="text-slate-200">Tersambung (Last sync: 10m lalu)</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sinkronisasi Departemen HRIS: <strong className="text-slate-200">Tersambung (Last sync: 2 jam lalu)</strong></span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Payload JSON Response Preview</label>
                <pre className="p-3 bg-slate-900/90 border border-slate-800 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto max-h-48 leading-relaxed">
{JSON.stringify({
  status: "success",
  sync_timestamp: new Date().toISOString(),
  total_records: assets.length,
  departments_synced: ["Finance", "HRIS", "DevOps", "QA"],
  sample_synced_item: {
    tag: assets[0]?.assetTag,
    model: assets[0]?.name,
    user: assets[0]?.assignedUser,
    depreciation_status: "Active - Year 2/4"
  }
}, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Sync */}
      {showApiSyncToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-500/40 text-emerald-200 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-xs font-bold text-white">Sinkronisasi API Berhasil!</div>
            <div className="text-[11px] text-emerald-300/80">Seluruh data inventaris terupdate ke server Finance &amp; HR.</div>
          </div>
        </div>
      )}

      {/* Modal Add Asset */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="font-bold text-white text-base">Registrasi Perangkat Hardware Baru</h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddAsset} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Nama Perangkat / Model</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: ThinkPad E14 Gen 5"
                  value={newAsset.name}
                  onChange={e => setNewAsset({ ...newAsset, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Kategori</label>
                  <select
                    value={newAsset.category}
                    onChange={e => setNewAsset({ ...newAsset, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Laptop">Laptop</option>
                    <option value="Server">Server</option>
                    <option value="Network">Network</option>
                    <option value="Workstation">Workstation</option>
                    <option value="Peripherals">Peripherals</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Nomor Seri (Serial No.)</label>
                  <input
                    type="text"
                    required
                    placeholder="SN-XXXX-XXXX"
                    value={newAsset.serialNumber}
                    onChange={e => setNewAsset({ ...newAsset, serialNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Spesifikasi Detail Perangkat</label>
                <input
                  type="text"
                  placeholder="Contoh: Intel Core i7 13700H, 16GB RAM, 512GB SSD"
                  value={newAsset.specifications}
                  onChange={e => setNewAsset({ ...newAsset, specifications: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Departemen Pengguna</label>
                  <select
                    value={newAsset.department}
                    onChange={e => setNewAsset({ ...newAsset, department: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Infrastructure & DevOps">Infrastructure &amp; DevOps</option>
                    <option value="UI/UX Product Design">UI/UX Product Design</option>
                    <option value="Quality Assurance">Quality Assurance</option>
                    <option value="Finance & Accounting">Finance &amp; Accounting</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Penanggung Jawab (PIC)</label>
                  <input
                    type="text"
                    placeholder="Nama Karyawan"
                    value={newAsset.assignedUser}
                    onChange={e => setNewAsset({ ...newAsset, assignedUser: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Harga Beli (IDR)</label>
                  <input
                    type="number"
                    value={newAsset.purchaseCost}
                    onChange={e => setNewAsset({ ...newAsset, purchaseCost: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Durasi Garansi Pabrik</label>
                  <select
                    value={newAsset.warrantyMonths}
                    onChange={e => setNewAsset({ ...newAsset, warrantyMonths: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value={12}>12 Bulan (1 Tahun)</option>
                    <option value={24}>24 Bulan (2 Tahun)</option>
                    <option value={36}>36 Bulan (3 Tahun)</option>
                    <option value={60}>60 Bulan (5 Tahun)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Lokasi Fisik / Gedung</label>
                <input
                  type="text"
                  placeholder="Misal: Kantor Pusat Lt. 2 - Meja 14"
                  value={newAsset.location}
                  onChange={e => setNewAsset({ ...newAsset, location: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs rounded-lg text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white"
                >
                  Simpan &amp; Generate Barcode Tag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Maintenance */}
      {showMaintenanceModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="font-bold text-white text-base">Jadwalkan Servis / Pemeliharaan</h4>
              <button onClick={() => setShowMaintenanceModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleScheduleMaintenance} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Pilih Aset Perangkat</label>
                <select
                  value={maintenanceForm.assetId}
                  onChange={e => setMaintenanceForm({ ...maintenanceForm, assetId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {assets.map(a => (
                    <option key={a.id} value={a.id}>{a.assetTag} - {a.name} ({a.assignedUser})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Jenis Pemeliharaan</label>
                  <select
                    value={maintenanceForm.type}
                    onChange={e => setMaintenanceForm({ ...maintenanceForm, type: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Preventive">Preventive (Rutin)</option>
                    <option value="Corrective">Corrective (Perbaikan)</option>
                    <option value="Inspection">Inspeksi Teknis</option>
                    <option value="Upgrade">Upgrade Komponen</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Tanggal Jadwal</label>
                  <input
                    type="date"
                    required
                    value={maintenanceForm.scheduledDate}
                    onChange={e => setMaintenanceForm({ ...maintenanceForm, scheduledDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Penyedia Servis / Teknisi</label>
                <input
                  type="text"
                  value={maintenanceForm.technician}
                  onChange={e => setMaintenanceForm({ ...maintenanceForm, technician: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Catatan Tindakan Pemeliharaan</label>
                <textarea
                  rows={3}
                  value={maintenanceForm.notes}
                  onChange={e => setMaintenanceForm({ ...maintenanceForm, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMaintenanceModal(false)}
                  className="px-4 py-2 text-xs rounded-lg text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white"
                >
                  Konfirmasi &amp; Kirim Notifikasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Tag Simulator Modal */}
      {qrModalAsset && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-center text-slate-200 shadow-2xl">
            <h4 className="font-bold text-white text-base">Barcode &amp; QR Tag Inventaris</h4>
            <p className="text-xs text-slate-400 mt-1">{qrModalAsset.name}</p>

            <div className="my-5 p-4 bg-white rounded-xl inline-block shadow-inner">
              {/* Simulated QR Pattern */}
              <div className="w-36 h-36 bg-slate-950 p-2 flex flex-col justify-between rounded">
                <div className="flex justify-between">
                  <div className="w-9 h-9 border-4 border-white bg-slate-950" />
                  <div className="w-9 h-9 border-4 border-white bg-slate-950" />
                </div>
                <div className="text-[9px] font-mono font-bold text-white tracking-widest uppercase">
                  APEKA IT
                </div>
                <div className="flex justify-between items-end">
                  <div className="w-9 h-9 border-4 border-white bg-slate-950" />
                  <div className="text-[8px] text-cyan-400 font-mono">{qrModalAsset.assetTag}</div>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-300 font-mono font-bold">{qrModalAsset.assetTag}</div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">SN: {qrModalAsset.serialNumber}</div>
            <div className="text-[11px] text-slate-400 mt-1">{qrModalAsset.department} · {qrModalAsset.assignedUser}</div>

            <button
              onClick={() => setQrModalAsset(null)}
              className="mt-6 w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Tutup Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
