import React from 'react';
import { Logo } from './Logo';
import { ShieldCheck, User, LogOut, LogIn, ChevronDown } from 'lucide-react';
import { AppUserProfile } from '../firebase';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenOrderModal: () => void;
  onOpenAuthModal: () => void;
  user: AppUserProfile | null;
  onLogout: () => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onOpenOrderModal,
  onOpenAuthModal,
  user,
  onLogout,
  isAdmin,
  onToggleAdmin
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <div 
          onClick={() => onTabChange('katalog')} 
          className="cursor-pointer shrink-0"
        >
          <Logo size="md" showSubtitle={false} />
        </div>

        {/* Zone 2: Clean 4-5 Navigation Links (single line, whitespace-nowrap) */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-400">
          <button
            onClick={() => onTabChange('katalog')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'katalog' ? 'text-cyan-400' : 'hover:text-slate-200'
            }`}
          >
            Katalog Aplikasi
          </button>

          <button
            onClick={() => onTabChange('proyek')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'proyek' ? 'text-cyan-400' : 'hover:text-slate-200'
            }`}
          >
            Lacak Proyek
          </button>

          <button
            onClick={() => onTabChange('aset_it')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              currentTab === 'aset_it' ? 'text-cyan-400' : 'hover:text-slate-200'
            }`}
          >
            <span>Aset IT</span>
            <span className="text-[9px] bg-cyan-400 text-slate-950 font-black px-1.5 py-0.2 rounded">
              BARU
            </span>
          </button>

          <button
            onClick={() => onTabChange('invoice')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'invoice' ? 'text-cyan-400' : 'hover:text-slate-200'
            }`}
          >
            Invoice &amp; Tagihan
          </button>

          <button
            onClick={() => onTabChange('analitik')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'analitik' ? 'text-cyan-400' : 'hover:text-slate-200'
            }`}
          >
            Analitik Bisnis
          </button>

          {isAdmin && (
            <button
              onClick={() => onTabChange('superadmin')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 font-bold ${
                currentTab === 'superadmin' 
                  ? 'text-cyan-400 border-b-2 border-cyan-400 pb-0.5' 
                  : 'text-violet-400 hover:text-violet-300'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Superadmin</span>
              <span className="text-[9px] bg-violet-500/20 text-violet-300 font-black px-1.5 py-0.2 rounded">
                KONTROL
              </span>
            </button>
          )}
        </nav>

        {/* Zone 3: Actions + Auth Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center text-[11px]">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <div className="font-semibold text-white leading-tight truncate max-w-[110px]">
                  {user.displayName}
                </div>
                <div className="text-[10px] text-cyan-400 font-mono">
                  {user.role === 'admin' ? 'Admin' : 'Klien'}
                </div>
              </div>
              <button
                onClick={onLogout}
                className="p-1 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded transition-colors ml-1"
                title="Keluar / Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-cyan-400" />
              <span>Masuk / Daftar</span>
            </button>
          )}

          {/* Primary Action Button */}
          <button
            onClick={onOpenOrderModal}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl shadow-md shadow-cyan-500/20 transition-all whitespace-nowrap shrink-0"
          >
            Ajukan Langganan
          </button>
        </div>
      </div>
    </header>
  );
};

