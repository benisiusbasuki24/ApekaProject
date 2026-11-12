import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  RefreshCw, 
  ShieldCheck, 
  ExternalLink,
  Calendar,
  Sparkles
} from 'lucide-react';
import { EmailReminder, SubscriptionItem } from '../types';

interface EmailReminderModalProps {
  reminders: EmailReminder[];
  subscriptions: SubscriptionItem[];
  onClose: () => void;
  onSendManualReminder: (subId: string, type: 'D-7' | 'D-3' | 'D-1') => void;
  onToggleAutoRenew: (subId: string, currentVal: boolean) => void;
}

export const EmailReminderModal: React.FC<EmailReminderModalProps> = ({
  reminders,
  subscriptions,
  onClose,
  onSendManualReminder,
  onToggleAutoRenew
}) => {
  const [selectedSubId, setSelectedSubId] = useState<string>(subscriptions[0]?.id || '');
  const [reminderType, setReminderType] = useState<'D-7' | 'D-3' | 'D-1'>('D-3');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const selectedSub = subscriptions.find(s => s.id === selectedSubId) || subscriptions[0];

  const handleSend = () => {
    onSendManualReminder(selectedSub.id, reminderType);
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Sistem Notifikasi Email Pengingat &amp; Auto-Renewal</h3>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-bold">
                  SLA Monitoring
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Peringatan dini masa aktif berakhir (H-7, H-3, H-1) &amp; kontrol perpanjang otomatis tanpa jeda manual.
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

        {/* Content */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Subscriptions & Controls */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Status Langganan Klien &amp; Auto-Renewal Switch
              </h4>

              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {subscriptions.map(sub => {
                  const isExpiring = sub.daysRemaining <= 10;
                  return (
                    <div
                      key={sub.id}
                      onClick={() => setSelectedSubId(sub.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedSub?.id === sub.id
                          ? 'bg-slate-900 border-cyan-500/50 shadow-md'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-white text-xs">{sub.institutionName}</div>
                          <div className="text-[11px] text-cyan-400 font-medium">{sub.productName}</div>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                          isExpiring ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          Sisa {sub.daysRemaining} Hari
                        </span>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-mono">Expired: {sub.endDate}</span>

                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                          <span className="text-[10px] text-slate-400">Auto-Renewal:</span>
                          <button
                            onClick={() => onToggleAutoRenew(sub.id, sub.autoRenew)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                              sub.autoRenew
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {sub.autoRenew ? '✓ AKTIF' : 'NONAKTIF'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Broadcast Sender Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Simulasi Pengiriman Email Pengingat
              </h4>

              <div className="grid grid-cols-3 gap-2">
                {(['D-7', 'D-3', 'D-1'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setReminderType(type)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      reminderType === type
                        ? 'bg-cyan-500 text-slate-950 shadow-md'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Pengingat {type}
                  </button>
                ))}
              </div>

              <div className="text-xs text-slate-400">
                Kirim pesan notifikasi pengingat ke email resmi: <strong className="text-slate-200">{selectedSub?.clientEmail}</strong>
              </div>

              <button
                onClick={handleSend}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Notifikasi Email Sekarang</span>
              </button>

              {broadcastSent && (
                <div className="p-2.5 bg-emerald-950 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Email notifikasi pengingat berhasil dikirimkan ke server mail!</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Email HTML Template Preview */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
                <span className="font-semibold text-slate-200 uppercase tracking-wider text-[10px]">
                  Tampilan Template Email (Inbox Preview)
                </span>
                <span className="font-mono text-[11px] text-cyan-400">SMTP: apeka-mailer-v2</span>
              </div>

              {/* Rendered Email Preview Box */}
              <div className="mt-4 p-5 bg-white text-slate-900 rounded-2xl shadow-xl font-sans text-xs space-y-4">
                {/* Email Branding */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="font-black text-base tracking-tight text-slate-900">
                    <span>apeka</span>
                    <span className="text-cyan-600">project</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Notifikasi Resmi
                  </span>
                </div>

                <div>
                  <div className="text-slate-800 font-bold text-sm">
                    Kepada Yth. {selectedSub?.clientName},
                  </div>
                  <div className="text-slate-500 text-[11px]">{selectedSub?.institutionName}</div>
                </div>

                <p className="text-slate-600 leading-relaxed text-xs">
                  Kami menginformasikan bahwa masa aktif lisensi layanan <strong className="text-slate-900">{selectedSub?.productName}</strong> Anda akan segera berakhir dalam waktu <strong className="text-rose-600 font-mono">{reminderType === 'D-7' ? '7 Hari' : reminderType === 'D-3' ? '3 Hari' : '24 Jam'}</strong> ({selectedSub?.endDate}).
                </p>

                {/* Auto Renew Notification Box */}
                <div className={`p-3 rounded-xl border text-[11px] ${
                  selectedSub?.autoRenew
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}>
                  {selectedSub?.autoRenew ? (
                    <div>
                      <strong>Fitur Perpanjangan Otomatis (Auto-Renewal) Aktif:</strong> Akses aplikasi web Anda akan terus berjalan normal tanpa jeda. Tagihan baru sebesar Rp {selectedSub?.pricePaid.toLocaleString('id-ID')} telah diterbitkan.
                    </div>
                  ) : (
                    <div>
                      <strong>Perhatian:</strong> Fitur perpanjangan otomatis Anda saat ini <span className="underline font-bold">nonaktif</span>. Mohon lakukan perpanjangan manual sebelum jatuh tempo agar sistem tidak dibekukan.
                    </div>
                  )}
                </div>

                {/* Call to action inside email */}
                <div className="text-center pt-2">
                  <button
                    onClick={() => alert(`Membuka portal pembayaran apeka project untuk langganan ${selectedSub?.institutionName}`)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    Perpanjang Layanan Seketika (Instant Pay)
                  </button>
                  <p className="text-[10px] text-slate-400 mt-2">
                    Dukungan Teknis 24/7 apeka project: support@apeka.app
                  </p>
                </div>
              </div>
            </div>

            {/* Email Dispatch History Log */}
            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Riwayat Pengiriman Terakhir:
              </div>
              <div className="space-y-1.5 text-[11px]">
                {reminders.slice(0, 2).map(r => (
                  <div key={r.id} className="flex items-center justify-between text-slate-400">
                    <span className="truncate max-w-[200px] text-slate-300">{r.subject}</span>
                    <span className="font-mono text-cyan-400 text-[10px]">{r.sentDate || 'Terjadwal'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
