import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Server, 
  Layers, 
  Code2, 
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Logo } from './Logo';

interface HeroSectionProps {
  onOpenOrderModal: () => void;
  onOpenDemo: (demoId: string) => void;
  onExploreCatalog: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenOrderModal,
  onOpenDemo,
  onExploreCatalog
}) => {
  return (
    <div className="relative overflow-hidden pt-12 pb-16 border-b border-slate-800">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-cyan-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Software House &amp; Cloud Web Application Services</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] text-balance">
              Portal Manajemen Usaha Pembuatan &amp; Langganan <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">Aplikasi Web</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl">
              <strong className="text-slate-200">apeka project</strong> menyediakan solusi aplikasi web terkelola untuk sekolah, perkantoran, dan instansi. Dilengkapi pelacakan progres proyek real-time, invoice otomatis, integrasi payment gateway lokal (QRIS &amp; VA), dan modul baru <strong>Sistem Manajemen Aset IT</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenOrderModal}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center gap-2.5 group"
              >
                <span>Ajukan Langganan Sekarang</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => onOpenDemo('aset_it')}
                className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-sm transition-all flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4 text-cyan-400" />
                <span>Uji Coba Demo Langsung</span>
              </button>
            </div>

            {/* Trust Markers Strip */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-slate-400 text-xs">
              <div>
                <div className="text-lg font-extrabold text-white font-mono">99.8%</div>
                <div className="text-[11px] text-slate-400">Jaminan SLA Uptime</div>
              </div>
              <div>
                <div className="text-lg font-extrabold text-cyan-400 font-mono">Real-time</div>
                <div className="text-[11px] text-slate-400">Gateway QRIS &amp; VA</div>
              </div>
              <div>
                <div className="text-lg font-extrabold text-white font-mono">Full SLA</div>
                <div className="text-[11px] text-slate-400">Garansi &amp; Maintenance</div>
              </div>
            </div>
          </div>

          {/* Right Hero Showcase Card (Interactive preview of Apeka ecosystem) */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Layanan Terpadu apeka
                    </h4>
                    <span className="text-[11px] text-slate-400">Siklus Hidup Pembuatan Aplikasi</span>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                  Aktif
                </span>
              </div>

              {/* Step Highlights */}
              <div className="mt-5 space-y-3.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 text-xs font-bold font-mono">
                    1
                  </div>
                  <div>
                    <div className="font-bold text-white">Katalog Pilihan &amp; Langganan Fleksibel</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      Pilihan paket bulanan, kuartalan (3 bulan), atau tahunan dengan diskon khusus pelanggan setia.
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 text-xs font-bold font-mono">
                    2
                  </div>
                  <div>
                    <div className="font-bold text-white">Transparansi Pelacakan Proyek</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      Pantau proses koding, staging environment, hingga domain resmi go-live.
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold font-mono">
                    3
                  </div>
                  <div>
                    <div className="font-bold text-white">Auto-Renewal &amp; Gateway Pembayaran Lokal</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      Bayar instan via QRIS/VA dan nikmati fitur perpanjang otomatis tanpa gangguan manual.
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={onExploreCatalog}
                className="w-full mt-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Jelajahi 6 Aplikasi Siap Pakai</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
