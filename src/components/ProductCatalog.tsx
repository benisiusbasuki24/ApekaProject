import React, { useState } from 'react';
import { 
  Check, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  Server,
  Layers
} from 'lucide-react';
import { WebAppProduct, BillingCycle } from '../types';

interface ProductCatalogProps {
  products: WebAppProduct[];
  onOpenDemo: (demoId: string) => void;
  onOpenSubscriptionForm: (product: WebAppProduct, cycle: BillingCycle) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onOpenDemo,
  onOpenSubscriptionForm
}) => {
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>('quarterly');

  const getPriceDisplay = (product: WebAppProduct) => {
    if (selectedCycle === 'monthly') {
      return {
        amount: product.monthlyPrice,
        period: '/ bulan',
        subtitle: 'Fleksibel tanpa komitmen jangka panjang'
      };
    } else if (selectedCycle === 'annual') {
      return {
        amount: product.annualPrice,
        period: '/ tahun',
        subtitle: 'Diskon Loyalitas ~20% + Gratis Setup Domain',
        savings: 'Hemat hingga Rp 450.000'
      };
    } else {
      return {
        amount: product.baseQuarterlyPrice,
        period: '/ 3 bulan',
        subtitle: 'Paket standar paling populer untuk institusi'
      };
    }
  };

  return (
    <section id="katalog" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Katalog Resmi Aplikasi Web apeka project</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Solusi Aplikasi Web Siap Pakai &amp; Terkelola
        </h2>
        <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
          Pilih aplikasi web yang sesuai dengan kebutuhan operasional sekolah, kantor, atau perusahaan Anda. Nikmati kemudahan berlangganan dengan dukungan penuh, maintenance, dan garansi uptime.
        </p>

        {/* Billing Cycle Selector Tabs */}
        <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <button
            onClick={() => setSelectedCycle('monthly')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCycle === 'monthly'
                ? 'bg-slate-800 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bulanan (Monthly)
          </button>
          <button
            onClick={() => setSelectedCycle('quarterly')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all relative ${
              selectedCycle === 'quarterly'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            3 Bulan (Standar Default)
          </button>
          <button
            onClick={() => setSelectedCycle('annual')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedCycle === 'annual'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Tahunan (Annual)</span>
            <span className="text-[10px] bg-emerald-400 text-slate-950 font-extrabold px-1.5 py-0.2 rounded-full">
              Hemat 20%
            </span>
          </button>
        </div>
      </div>

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => {
          const pricing = getPriceDisplay(product);
          const isHighlight = product.id === 'manajemen_aset_it';

          return (
            <div
              key={product.id}
              className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 border ${
                isHighlight
                  ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-cyan-950/40 border-cyan-500/50 shadow-2xl shadow-cyan-950/30'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-xl'
              }`}
            >
              {/* Product Badges */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider font-mono">
                  {product.category}
                </span>
                <div className="flex items-center gap-1.5">
                  {product.isNew && (
                    <span className="text-[10px] bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-extrabold px-2 py-0.5 rounded-full uppercase">
                      Baru Dirilis
                    </span>
                  )}
                  {product.popular && (
                    <span className="text-[10px] bg-amber-400 text-slate-950 font-extrabold px-2 py-0.5 rounded-full uppercase">
                      Paling Diminati
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">{product.name}</h3>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed min-h-[48px]">
                  {product.description}
                </p>

                {/* Price Display */}
                <div className="mt-5 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-slate-400">Rp</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums tracking-tight">
                      {pricing.amount.toLocaleString('id-ID')}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{pricing.period}</span>
                  </div>
                  <div className="text-[11px] text-cyan-400/90 mt-1">{pricing.subtitle}</div>
                  {pricing.savings && (
                    <div className="text-[10px] text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      <span>{pricing.savings} untuk Pelanggan Setia!</span>
                    </div>
                  )}
                </div>

                {/* Feature Checklist */}
                <div className="mt-6 space-y-2.5">
                  <div className="text-xs font-semibold text-slate-200">Fitur Utama Unggulan:</div>
                  <ul className="space-y-2">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-5 border-t border-slate-800/80 flex flex-col gap-2.5">
                <button
                  onClick={() => onOpenDemo(product.demoId)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Coba Demo Interaktif (Gratis)</span>
                </button>

                <button
                  onClick={() => onOpenSubscriptionForm(product, selectedCycle)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg ${
                    isHighlight
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/20'
                      : 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-600/10'
                  }`}
                >
                  <span>Ajukan Langganan Sekarang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
