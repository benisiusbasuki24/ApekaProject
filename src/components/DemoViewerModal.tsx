import React, { useState } from 'react';
import { X, Laptop, UserCheck, BookOpen, GraduationCap, DollarSign, Package } from 'lucide-react';
import { ITAssetManagementDemo } from './demos/ITAssetManagementDemo';
import { TeacherAttendanceDemo } from './demos/TeacherAttendanceDemo';
import { LibraryDemo } from './demos/LibraryDemo';
import { ElearningDemo } from './demos/ElearningDemo';
import { SchoolFinanceDemo } from './demos/SchoolFinanceDemo';
import { InventoryDemo } from './demos/InventoryDemo';

interface DemoViewerModalProps {
  initialDemoId?: string;
  onClose: () => void;
  onSelectForOrder?: (productId: string) => void;
}

export const DemoViewerModal: React.FC<DemoViewerModalProps> = ({
  initialDemoId = 'aset_it',
  onClose,
  onSelectForOrder
}) => {
  const [activeDemo, setActiveDemo] = useState<string>(initialDemoId);

  const demoTabs = [
    { id: 'aset_it', label: 'Manajemen Aset IT (Baru)', icon: Laptop, productId: 'manajemen_aset_it', badge: 'Highlight' },
    { id: 'presensi', label: 'Presensi Guru & Pegawai', icon: UserCheck, productId: 'presensi_guru' },
    { id: 'perpustakaan', label: 'Manajemen Perpustakaan', icon: BookOpen, productId: 'manajemen_perpustakaan' },
    { id: 'elearning', label: 'Platform E-Learning', icon: GraduationCap, productId: 'elearning_sederhana' },
    { id: 'keuangan', label: 'Keuangan & SPP Sekolah', icon: DollarSign, productId: 'keuangan_sekolah' },
    { id: 'inventaris', label: 'Inventarisasi Sekolah/Kantor', icon: Package, productId: 'inventarisasi' }
  ];

  const currentTab = demoTabs.find(t => t.id === activeDemo) || demoTabs[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-6xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top bar modal */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase font-bold tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full">
              Demo Lingkungan Nyata (Sandbox)
            </span>
            <div className="hidden sm:block text-slate-400 text-xs">
              Uji coba fitur lengkap sebelum berlangganan
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onSelectForOrder && (
              <button
                onClick={() => {
                  onSelectForOrder(currentTab.productId);
                  onClose();
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 transition-all"
              >
                Pesan Aplikasi Ini
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Demo Switcher Pills */}
        <div className="px-6 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap mr-1">Pilih Aplikasi Contoh:</span>
          {demoTabs.map(tab => {
            const Icon = tab.icon;
            const active = activeDemo === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveDemo(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  active 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[9px] bg-cyan-400 text-slate-950 font-bold px-1.5 py-0.2 rounded">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Embedded Interactive Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-950/50">
          {activeDemo === 'aset_it' && <ITAssetManagementDemo />}
          {activeDemo === 'presensi' && <TeacherAttendanceDemo />}
          {activeDemo === 'perpustakaan' && <LibraryDemo />}
          {activeDemo === 'elearning' && <ElearningDemo />}
          {activeDemo === 'keuangan' && <SchoolFinanceDemo />}
          {activeDemo === 'inventaris' && <InventoryDemo />}
        </div>
      </div>
    </div>
  );
};
