import React, { useState, useEffect } from 'react';
import { 
  Navbar 
} from './components/Navbar';
import { 
  HeroSection 
} from './components/HeroSection';
import { 
  ProductCatalog 
} from './components/ProductCatalog';
import { 
  ProjectTracker 
} from './components/ProjectTracker';
import { 
  InvoiceManagement 
} from './components/InvoiceManagement';
import { 
  AnalyticsDashboard 
} from './components/AnalyticsDashboard';
import { 
  ITAssetManagementDemo 
} from './components/demos/ITAssetManagementDemo';
import { 
  DemoViewerModal 
} from './components/DemoViewerModal';
import { 
  SubscriptionFormModal 
} from './components/SubscriptionFormModal';
import { 
  PaymentGatewayModal 
} from './components/PaymentGatewayModal';
import { 
  EmailReminderModal 
} from './components/EmailReminderModal';
import { 
  AuthModal 
} from './components/AuthModal';
import { 
  WebAppProduct, 
  BillingCycle, 
  SubscriptionItem, 
  Invoice, 
  ClientProject, 
  EmailReminder,
  ITAsset
} from './types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_PROJECTS, 
  INITIAL_SUBSCRIPTIONS, 
  INITIAL_INVOICES, 
  INITIAL_EMAIL_REMINDERS,
  INITIAL_IT_ASSETS
} from './data/mockData';
import { 
  auth,
  testConnection,
  AppUserProfile,
  logoutUser,
  initializeFirestoreData,
  subscribeToFirestore,
  saveSubscriptionToFirestore,
  saveInvoiceToFirestore,
  updateInvoicePaymentInFirestore,
  saveProjectToFirestore,
  saveITAssetToFirestore
} from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  Mail, 
  CheckCircle2, 
  ShieldCheck, 
  BellRing, 
  ArrowRight, 
  Sparkles, 
  Server,
  Cloud,
  Layers,
  User,
  LogOut,
  RefreshCw
} from 'lucide-react';
import { Logo } from './components/Logo';

export default function App() {
  // Products catalog
  const [products] = useState<WebAppProduct[]>(INITIAL_PRODUCTS);
  
  // App state synced with Firestore & LocalStorage
  const [projects, setProjects] = useState<ClientProject[]>(() => {
    const saved = localStorage.getItem('apeka_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>(() => {
    const saved = localStorage.getItem('apeka_subscriptions');
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTIONS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('apeka_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [reminders, setReminders] = useState<EmailReminder[]>(() => {
    const saved = localStorage.getItem('apeka_reminders');
    return saved ? JSON.parse(saved) : INITIAL_EMAIL_REMINDERS;
  });

  // User Auth State
  const [currentUser, setCurrentUser] = useState<AppUserProfile | null>(() => {
    const saved = localStorage.getItem('apeka_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Navigation & Role states
  const [currentTab, setCurrentTab] = useState<string>('katalog');
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const saved = localStorage.getItem('apeka_is_admin');
    return saved === 'true';
  });

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [selectedDemoId, setSelectedDemoId] = useState('aset_it');

  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderInitialProduct, setOrderInitialProduct] = useState<WebAppProduct | undefined>(undefined);
  const [orderInitialCycle, setOrderInitialCycle] = useState<BillingCycle>('quarterly');

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | null>(null);

  const [reminderModalOpen, setReminderModalOpen] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string } | null>(null);
  const [firestoreConnected, setFirestoreConnected] = useState<boolean | null>(null);

  const showToast = (title: string, desc: string) => {
    setToastMessage({ title, desc });
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Firebase initialization & Listeners
  useEffect(() => {
    // 1. Test Firestore connection on boot
    testConnection().then(ok => setFirestoreConnected(ok));

    // 2. Initialize Firestore data seed if cloud is empty
    initializeFirestoreData();

    // 3. Attach real-time onSnapshot listeners to Firestore
    const unsubscribeSync = subscribeToFirestore(
      (newSubs) => {
        if (newSubs && newSubs.length > 0) setSubscriptions(newSubs);
      },
      (newInvs) => {
        if (newInvs && newInvs.length > 0) setInvoices(newInvs);
      },
      (newPrjs) => {
        if (newPrjs && newPrjs.length > 0) setProjects(newPrjs);
      }
    );

    // 4. Firebase Auth listener
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const role = (firebaseUser.email === 'benisius.rb@gmail.com' || firebaseUser.email?.includes('admin')) ? 'admin' : 'client';
        const userProfile: AppUserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Pengguna',
          institution: 'Instansi / Pengguna',
          role: role,
          createdAt: new Date().toISOString()
        };
        setCurrentUser(userProfile);
        setIsAdmin(role === 'admin');
        localStorage.setItem('apeka_current_user', JSON.stringify(userProfile));
      } else {
        // If not signed in through Firebase Auth but has local demo session, keep if valid
      }
    });

    return () => {
      unsubscribeSync();
      unsubscribeAuth();
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('apeka_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('apeka_subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('apeka_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('apeka_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('apeka_is_admin', String(isAdmin));
  }, [isAdmin]);

  // Auth Handlers
  const handleAuthSuccess = (profile: AppUserProfile) => {
    setCurrentUser(profile);
    setIsAdmin(profile.role === 'admin');
    localStorage.setItem('apeka_current_user', JSON.stringify(profile));
    showToast(
      `Selamat datang, ${profile.displayName}!`,
      `Masuk sebagai ${profile.role === 'admin' ? 'Administrator' : 'Klien'} (${profile.email}).`
    );
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      // ignore
    }
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem('apeka_current_user');
    showToast('Berhasil Keluar', 'Sesi login telah diakhiri dengan aman.');
  };

  // Demo & Order Handlers
  const handleOpenDemo = (demoId: string) => {
    setSelectedDemoId(demoId);
    setDemoModalOpen(true);
  };

  const handleOpenOrder = (product?: WebAppProduct, cycle: BillingCycle = 'quarterly') => {
    setOrderInitialProduct(product || products[0]);
    setOrderInitialCycle(cycle);
    setOrderModalOpen(true);
  };

  const handleSubscriptionSubmitSuccess = async (
    newSub: SubscriptionItem, 
    newInv: Invoice, 
    newProj: ClientProject
  ) => {
    // Associate with logged-in user if available
    if (currentUser) {
      (newSub as any).userId = currentUser.uid;
      (newInv as any).userId = currentUser.uid;
    }

    // Local state
    setSubscriptions([newSub, ...subscriptions]);
    setInvoices([newInv, ...invoices]);
    setProjects([newProj, ...projects]);
    setOrderModalOpen(false);

    // Sync to Cloud Firestore
    saveSubscriptionToFirestore(newSub);
    saveInvoiceToFirestore(newInv);
    saveProjectToFirestore(newProj);

    showToast(
      'Pengajuan Berhasil Disimpan ke Cloud!',
      `Faktur ${newInv.invoiceNumber} diterbitkan dan tersinkronisasi dengan Firebase Firestore.`
    );

    // Prompt user to immediately pay the invoice
    setSelectedInvoiceForPayment(newInv);
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async (invoiceId: string, paymentMethod: string, referenceNo: string) => {
    const updatedInvoices = invoices.map(inv => {
      if (inv.id === invoiceId) {
        return {
          ...inv,
          status: 'paid' as const,
          paidDate: new Date().toLocaleString('id-ID'),
          paymentMethod,
          referenceNumber: referenceNo
        };
      }
      return inv;
    });

    setInvoices(updatedInvoices);

    // Update in Cloud Firestore
    updateInvoicePaymentInFirestore(invoiceId, paymentMethod, referenceNo);

    // Also update any matching subscription status
    const paidInv = invoices.find(i => i.id === invoiceId);
    if (paidInv) {
      const updatedSubs = subscriptions.map(sub => {
        if (sub.institutionName === paidInv.institutionName) {
          const updatedSub = {
            ...sub,
            status: 'active' as const,
            daysRemaining: sub.billingCycle === 'annual' ? 365 : sub.billingCycle === 'quarterly' ? 90 : 30
          };
          saveSubscriptionToFirestore(updatedSub);
          return updatedSub;
        }
        return sub;
      });
      setSubscriptions(updatedSubs);
    }

    setPaymentModalOpen(false);
    showToast(
      'Pembayaran Berhasil Diverifikasi!',
      `Transaksi ${referenceNo} telah lunas melalui ${paymentMethod}. Lisensi cloud aktif.`
    );
  };

  const handleSendManualReminder = (subId: string, type: 'D-7' | 'D-3' | 'D-1') => {
    const targetSub = subscriptions.find(s => s.id === subId);
    if (!targetSub) return;

    const newReminder: EmailReminder = {
      id: `rem-${Date.now()}`,
      subscriptionId: targetSub.id,
      clientName: targetSub.clientName,
      clientEmail: targetSub.clientEmail,
      productName: targetSub.productName,
      type: type,
      scheduledDate: new Date().toISOString().split('T')[0],
      sentDate: new Date().toLocaleString('id-ID'),
      status: 'Sent',
      subject: `[PENGINGAT RESMI] Masa Aktif ${targetSub.productName} Berakhir dalam ${type === 'D-7' ? '7 Hari' : type === 'D-3' ? '3 Hari' : '1 Hari'}`
    };

    setReminders([newReminder, ...reminders]);
    showToast(
      'Email Pengingat Berhasil Terkirim',
      `Notifikasi resmi telah dikirim ke ${targetSub.clientEmail}.`
    );
  };

  const handleToggleAutoRenew = (subId: string, currentVal: boolean) => {
    const updated = subscriptions.map(s => {
      if (s.id === subId) {
        const item = { ...s, autoRenew: !currentVal };
        saveSubscriptionToFirestore(item);
        return item;
      }
      return s;
    });
    setSubscriptions(updated);
    showToast(
      'Pengaturan Perpanjangan Otomatis Diperbarui',
      `Auto-renewal untuk ${subscriptions.find(s => s.id === subId)?.institutionName} sekarang ${!currentVal ? 'AKTIF' : 'NONAKTIF'}.`
    );
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Banner Notice: Minimalist, elegant strip */}
      <div className="bg-slate-950/80 border-b border-slate-800/60 px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="font-medium text-slate-200">apeka project</span>
            <span className="text-slate-600">·</span>
            <span className="hidden sm:inline text-slate-400">
              Web App Studio, Pelacakan Proyek, &amp; Cloud Database Terintegrasi
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Cloud Sync Status Indicator */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Cloud className="w-3.5 h-3.5 text-cyan-400" />
              <span>Firebase Cloud: <strong className="text-emerald-400">Tersinkron</strong></span>
            </div>

            <span className="text-slate-700 hidden sm:inline">|</span>

            <button
              onClick={() => setReminderModalOpen(true)}
              className="text-cyan-400 hover:text-cyan-300 font-medium text-[11px] flex items-center gap-1 transition-colors"
            >
              <BellRing className="w-3 h-3" />
              <span>Pengingat ({subscriptions.filter(s => s.daysRemaining <= 10).length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenOrderModal={() => handleOpenOrder()}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        user={currentUser}
        onLogout={handleLogout}
        isAdmin={isAdmin}
        onToggleAdmin={() => {
          setIsAdmin(!isAdmin);
          showToast(
            `Beralih ke ${!isAdmin ? 'Mode Admin Apeka' : 'Mode Portal Klien'}`,
            !isAdmin ? 'Akses penuh ke semua invoice, proyek klien, dan analitik bisnis.' : 'Tampilan disederhanakan untuk klien.'
          );
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Tab 1: Katalog & Hero (Landing Portal) */}
        {currentTab === 'katalog' && (
          <div>
            <HeroSection
              onOpenOrderModal={() => handleOpenOrder()}
              onOpenDemo={handleOpenDemo}
              onExploreCatalog={() => {
                document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <ProductCatalog
              products={products}
              onOpenDemo={handleOpenDemo}
              onOpenSubscriptionForm={(product, cycle) => handleOpenOrder(product, cycle)}
            />

            {/* Quick Demonstration Spotlight on IT Asset Management */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Fitur Baru Unggulan</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    Sistem Manajemen Aset IT (ITAM) - Siap Dicoba
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Lacak hardware laptop/server, masa berlaku garansi, jadwal perbaikan otomatis, dan sinkronisasi REST API antar departemen.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenDemo('aset_it')}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                  >
                    <span>Buka Mode Fullscreen Demo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Embedded Live Demo Box */}
              <ITAssetManagementDemo />
            </section>
          </div>
        )}

        {/* Tab 2: Pelacakan Proyek */}
        {currentTab === 'proyek' && (
          <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <ProjectTracker projects={projects} />
          </div>
        )}

        {/* Tab 3: Sistem Manajemen Aset IT (Dedicated Tab View) */}
        {currentTab === 'aset_it' && (
          <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Server className="w-5 h-5 text-cyan-400" />
                  <span>Sistem Manajemen Aset IT Enterprise</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Solusi terintegrasi untuk pelacakan hardware, jadwal servis berkala, peringatan garansi, dan sinkronisasi data API antar divisi.
                </p>
              </div>

              <button
                onClick={() => handleOpenOrder(products.find(p => p.id === 'manajemen_aset_it'), 'quarterly')}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                Langganan Aset IT (Rp 750rb / 3 Bln)
              </button>
            </div>

            <ITAssetManagementDemo />
          </div>
        )}

        {/* Tab 4: Invoice & Tagihan */}
        {currentTab === 'invoice' && (
          <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <InvoiceManagement
              invoices={invoices}
              onOpenPaymentGateway={(inv) => {
                setSelectedInvoiceForPayment(inv);
                setPaymentModalOpen(true);
              }}
              isAdmin={isAdmin}
            />
          </div>
        )}

        {/* Tab 5: Analitik Bisnis */}
        {currentTab === 'analitik' && (
          <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <AnalyticsDashboard
              invoices={invoices}
              subscriptions={subscriptions}
              projects={projects}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-10 px-4 sm:px-6 lg:px-8 mt-16 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Logo size="md" showSubtitle={true} />
            <p className="text-slate-400 text-xs leading-relaxed">
              Software house terpercaya untuk pembuatan &amp; kustomisasi aplikasi berbasis web sekolah, perkantoran, dan korporat.
            </p>
            <div className="text-[11px] text-slate-500">
              © 2026 apeka project · Terhubung ke Google Cloud Firestore
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Katalog Aplikasi</h4>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => { setCurrentTab('aset_it'); }} className="hover:text-cyan-400">Sistem Manajemen Aset IT</button></li>
              <li><button onClick={() => { handleOpenDemo('presensi'); }} className="hover:text-cyan-400">Presensi Guru &amp; Pegawai</button></li>
              <li><button onClick={() => { handleOpenDemo('keuangan'); }} className="hover:text-cyan-400">Keuangan &amp; SPP Sekolah</button></li>
              <li><button onClick={() => { handleOpenDemo('perpustakaan'); }} className="hover:text-cyan-400">Manajemen Perpustakaan</button></li>
              <li><button onClick={() => { handleOpenDemo('elearning'); }} className="hover:text-cyan-400">Platform E-Learning</button></li>
              <li><button onClick={() => { handleOpenDemo('inventaris'); }} className="hover:text-cyan-400">Inventarisasi Sekolah/Kantor</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Fitur Platform</h4>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => setCurrentTab('proyek')} className="hover:text-white">Pelacakan Progres Proyek</button></li>
              <li><button onClick={() => setCurrentTab('invoice')} className="hover:text-white">Sistem Invoice Otomatis</button></li>
              <li><button onClick={() => setReminderModalOpen(true)} className="hover:text-white">Perpanjang Otomatis (Auto-Renewal)</button></li>
              <li><button onClick={() => setReminderModalOpen(true)} className="hover:text-white">Email Pengingat Jatuh Tempo</button></li>
              <li><button onClick={() => setCurrentTab('analitik')} className="hover:text-white">Dashboard Analitik Bisnis</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Keamanan &amp; Akun</h4>
            {currentUser ? (
              <div className="space-y-2 text-slate-300">
                <div>Masuk sebagai: <strong>{currentUser.displayName}</strong></div>
                <div className="text-[11px] text-slate-500 font-mono">{currentUser.email}</div>
                <button
                  onClick={handleLogout}
                  className="mt-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded text-xs transition-colors"
                >
                  Keluar dari Akun
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-slate-400 text-xs">
                  Login atau buat akun baru untuk menyimpan pesanan aplikasi &amp; melacak progres proyek.
                </p>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold text-xs transition-colors"
                >
                  Masuk / Registrasi Akun
                </button>
              </div>
            )}
            <div className="mt-4 p-2.5 bg-slate-900 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>SLA Uptime 99.8% · Database Cloud Firestore</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Status & Quick Role Switch */}
      <div className="fixed bottom-4 left-4 z-40 bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 text-xs">
        <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-violet-400 animate-pulse' : 'bg-cyan-400'}`} />
        <span className="text-slate-300 font-medium">
          {isAdmin ? 'Mode: Admin Apeka' : 'Mode: Klien / Pengguna'}
        </span>
        <button
          onClick={() => setIsAdmin(!isAdmin)}
          className="text-cyan-400 hover:text-cyan-300 font-bold ml-1 underline text-[11px]"
        >
          Ganti
        </button>
      </div>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 border border-cyan-500/40 text-slate-100 p-4 rounded-2xl shadow-2xl flex items-start gap-3 max-w-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-white">{toastMessage.title}</div>
            <div className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{toastMessage.desc}</div>
          </div>
        </div>
      )}

      {/* Modals */}
      {authModalOpen && (
        <AuthModal
          onClose={() => setAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {demoModalOpen && (
        <DemoViewerModal
          initialDemoId={selectedDemoId}
          onClose={() => setDemoModalOpen(false)}
          onSelectForOrder={(prodId) => {
            const targetProd = products.find(p => p.id === prodId);
            handleOpenOrder(targetProd);
          }}
        />
      )}

      {orderModalOpen && (
        <SubscriptionFormModal
          initialProduct={orderInitialProduct}
          initialCycle={orderInitialCycle}
          products={products}
          onClose={() => setOrderModalOpen(false)}
          onSubmitSuccess={handleSubscriptionSubmitSuccess}
        />
      )}

      {paymentModalOpen && selectedInvoiceForPayment && (
        <PaymentGatewayModal
          invoice={selectedInvoiceForPayment}
          onClose={() => {
            setPaymentModalOpen(false);
            setSelectedInvoiceForPayment(null);
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {reminderModalOpen && (
        <EmailReminderModal
          reminders={reminders}
          subscriptions={subscriptions}
          onClose={() => setReminderModalOpen(false)}
          onSendManualReminder={handleSendManualReminder}
          onToggleAutoRenew={handleToggleAutoRenew}
        />
      )}
    </div>
  );
}
