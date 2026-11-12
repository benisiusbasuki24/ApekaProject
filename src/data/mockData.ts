import { 
  WebAppProduct, 
  ClientProject, 
  SubscriptionItem, 
  Invoice, 
  ITAsset, 
  MaintenanceLog, 
  AuditHistoryLog, 
  EmailReminder 
} from '../types';

export const INITIAL_PRODUCTS: WebAppProduct[] = [
  {
    id: 'presensi_guru',
    name: 'Presensi Guru & Pegawai',
    category: 'Sistem Kepegawaian Sekolah',
    description: 'Aplikasi pencatatan absensi digital guru dan karyawan berbasis GPS geofencing & QR Code dinamis dengan rekapitulasi kehadiran real-time.',
    baseQuarterlyPrice: 600000,
    monthlyPrice: 220000,
    annualPrice: 2150000, // diskon pelanggan setia ~10% off
    popular: true,
    demoId: 'presensi',
    features: [
      'Validasi Geofencing GPS radius sekolah',
      'QR Code absensi anti-titip absen',
      'Pengajuan izin, sakit, dan cuti digital',
      'Rekapitulasi otomatis bulanan (Excel & PDF)',
      'Akses multi-role: Kepala Sekolah, Admin, Guru'
    ],
    specs: ['Responsive Web App (PWA)', 'Database Cloud Terenkripsi', 'Integrasi Notifikasi WhatsApp']
  },
  {
    id: 'manajemen_perpustakaan',
    name: 'Sistem Manajemen Perpustakaan',
    category: 'Otomasi Perpustakaan',
    description: 'Digitalisasi katalog buku, kartu anggota siswa digital, sirkulasi peminjaman/pengembalian otomatis, dan kalkulasi denda instan.',
    baseQuarterlyPrice: 600000,
    monthlyPrice: 220000,
    annualPrice: 2150000,
    demoId: 'perpustakaan',
    features: [
      'Katalog buku berstandar ISBN & DDC',
      'Barcode scanner via kamera browser',
      'Manajemen kartu anggota barcode siswa/guru',
      'Kalkulator denda keterlambatan otomatis',
      'Statistik buku terfavorit & peminjam teraktif'
    ],
    specs: ['Pencarian buku instan', 'Cetak label barcode & kartu', 'Backup data otomatis']
  },
  {
    id: 'elearning_sederhana',
    name: 'Platform E-Learning Sederhana',
    category: 'Pembelajaran Digital',
    description: 'Portal pembelajaran daring yang ringan, mudah digunakan oleh guru dan siswa tanpa perlu server berat atau pengaturan rumit.',
    baseQuarterlyPrice: 700000,
    monthlyPrice: 260000,
    annualPrice: 2500000,
    demoId: 'elearning',
    features: [
      'Manajemen materi PDF, slide, & video YouTube',
      'Tugas online dengan batas waktu & unggah berkas',
      'Kuis pilihan ganda dengan auto-grading skor',
      'Forum diskusi per mata pelajaran',
      'Dashboard kemajuan belajar siswa'
    ],
    specs: ['Ringan hemat kuota', 'Kompatibel di HP & Laptop', 'Export nilai rapor format Dapodik']
  },
  {
    id: 'inventarisasi',
    name: 'Inventarisasi Kantor / Sekolah',
    category: 'Manajemen Sarana Prasarana',
    description: 'Pelacakan aset fisik sarana prasarana, nomor inventaris BMN, mutasi antar ruangan, dan pemantauan kondisi barang rusak atau baik.',
    baseQuarterlyPrice: 700000,
    monthlyPrice: 260000,
    annualPrice: 2500000,
    demoId: 'inventaris',
    features: [
      'Penomoran registrasi otomatis kode aset',
      'Klasifikasi kondisi: Baik, Rusak Ringan, Rusak Berat',
      'Pemetaan penempatan barang per gedung/ruangan',
      'Riwayat mutasi dan pemindahan barang',
      'Laporan inventaris siap audit akreditasi'
    ],
    specs: ['QR Tag siap cetak', 'Filter bertingkat per ruangan', 'Export laporan BMN standar']
  },
  {
    id: 'keuangan_sekolah',
    name: 'Sistem Keuangan Sekolah',
    category: 'Administrasi Finansial',
    description: 'Pengelolaan tagihan SPP bulanan, pembayaran uang gedung/kegiatan, rekapitulasi buku kas umum, dan kwitansi pembayaran digital.',
    baseQuarterlyPrice: 800000,
    monthlyPrice: 300000,
    annualPrice: 2850000,
    popular: true,
    demoId: 'keuangan',
    features: [
      'Tagihan SPP otomatis setiap tanggal 1',
      'Cetak kwitansi pembayaran dengan stempel digital',
      'Buku Kas Masuk dan Kas Keluar sekolah',
      'Laporan tunggakan per kelas & broadcast WA',
      'Laporan realisasi anggaran operasional'
    ],
    specs: ['Audit trail pencatatan kas', 'Kwitansi thermal/A4', 'Multi kasir bendahara']
  },
  {
    id: 'manajemen_aset_it',
    name: 'Sistem Manajemen Aset IT',
    category: 'Enterprise IT Asset Management (ITAM)',
    description: 'Solusi pelacakan perangkat keras, siklus pemeliharaan berkala, pemantauan masa berlaku garansi, histori mutasi karyawan, serta integrasi API antar departemen.',
    baseQuarterlyPrice: 750000,
    monthlyPrice: 280000,
    annualPrice: 2680000, // diskon pelanggan setia hemat Rp 320.000
    isNew: true,
    popular: true,
    demoId: 'aset_it',
    features: [
      'Pelacakan Hardware (Laptop, Server, Router, PC) & Serial Number',
      'Countdown Status Garansi & Peringatan Otomatis Expired (<30 Hari)',
      'Jadwal Pemeliharaan Berkala & Notifikasi Servis Teknisi',
      'Audit Histori Penggunaan & Chain of Custody (Serah Terima Karyawan)',
      'Dashboard Real-Time Nilai Aset & Distribusi Status Operasional',
      'REST API Sync & Webhook untuk Sinkronisasi Antar Departemen'
    ],
    specs: ['Restful API Token Sync', 'QR Asset Tag Generator', 'Laporan Depresiasi & Servis']
  }
];

export const INITIAL_IT_ASSETS: ITAsset[] = [
  {
    id: 'ast-001',
    assetTag: 'APK-IT-001',
    name: 'ThinkPad T14s Gen 4',
    category: 'Laptop',
    brandModel: 'Lenovo ThinkPad T14s AMD Ryzen 7 PRO',
    serialNumber: 'PF-4X89L10',
    specifications: 'Ryzen 7 7840U, 32GB LPDDR5x, 1TB NVMe Gen4, 14" OLED',
    location: 'Lantai 2 - Ruang IT Dev',
    department: 'Software Engineering',
    assignedUser: 'Budi Santoso (Lead Dev)',
    purchaseDate: '2024-03-15',
    purchaseCost: 22500000,
    warrantyEndDate: '2027-03-15',
    warrantyStatus: 'active',
    status: 'active',
    lastMaintenanceDate: '2026-09-10',
    nextScheduledMaintenance: '2026-12-10',
    qrCodeValue: 'APK-IT-001-LENOVO-T14S'
  },
  {
    id: 'ast-002',
    assetTag: 'APK-IT-002',
    name: 'Dell PowerEdge R750 Server',
    category: 'Server',
    brandModel: 'Dell PowerEdge R750 2U Rack',
    serialNumber: 'DL-8829-SRV',
    specifications: 'Dual Xeon Silver 4314, 128GB ECC RAM, 4x 1.92TB SAS Enterprise SSD RAID 10',
    location: 'Server Room Data Center (Rack A3)',
    department: 'Infrastructure & DevOps',
    assignedUser: 'Rian Hidayat (SysAdmin)',
    purchaseDate: '2023-11-20',
    purchaseCost: 68000000,
    warrantyEndDate: '2026-11-20', // warning expiring soon
    warrantyStatus: 'warning',
    status: 'active',
    lastMaintenanceDate: '2026-10-01',
    nextScheduledMaintenance: '2026-11-25',
    qrCodeValue: 'APK-IT-002-DELL-R750'
  },
  {
    id: 'ast-003',
    assetTag: 'APK-IT-003',
    name: 'Cisco Catalyst 9200L 48-Port PoE+',
    category: 'Network',
    brandModel: 'Cisco C9200L-48P-4G',
    serialNumber: 'FOC24190ABC',
    specifications: '48 Port Gigabit PoE+ 740W, 4x 1G SFP Uplink, Layer 3 Routing',
    location: 'Distribution Rack Lantai 1',
    department: 'Infrastructure & DevOps',
    assignedUser: 'Rian Hidayat (SysAdmin)',
    purchaseDate: '2024-01-10',
    purchaseCost: 31000000,
    warrantyEndDate: '2027-01-10',
    warrantyStatus: 'active',
    status: 'active',
    lastMaintenanceDate: '2026-07-12',
    nextScheduledMaintenance: '2027-01-12',
    qrCodeValue: 'APK-IT-003-CISCO-9200L'
  },
  {
    id: 'ast-004',
    assetTag: 'APK-IT-004',
    name: 'MacBook Pro 16" M3 Pro',
    category: 'Laptop',
    brandModel: 'Apple MacBook Pro Space Black',
    serialNumber: 'C02G87XQMD6R',
    specifications: 'Apple M3 Pro 12-core CPU, 18-core GPU, 36GB RAM, 512GB SSD',
    location: 'Lantai 3 - Studio Desain',
    department: 'UI/UX Product Design',
    assignedUser: 'Siti Rahmawati (Product Designer)',
    purchaseDate: '2024-05-18',
    purchaseCost: 39999000,
    warrantyEndDate: '2025-05-18', // Garansi resmi habis
    warrantyStatus: 'expired',
    status: 'active',
    lastMaintenanceDate: '2026-08-14',
    nextScheduledMaintenance: '2026-11-30',
    qrCodeValue: 'APK-IT-004-APPLE-MBP16'
  },
  {
    id: 'ast-005',
    assetTag: 'APK-IT-005',
    name: 'HP Z2 Mini G9 Workstation',
    category: 'Workstation',
    brandModel: 'HP Z2 Mini G9 High Performance',
    serialNumber: 'HP-MINI-9011',
    specifications: 'Intel Core i9-13900K, NVIDIA RTX A2000 12GB, 64GB RAM, 2TB SSD',
    location: 'Lantai 2 - Lab QA Testing',
    department: 'Quality Assurance',
    assignedUser: 'Fajar Nugroho (QA Tester)',
    purchaseDate: '2024-08-20',
    purchaseCost: 34500000,
    warrantyEndDate: '2027-08-20',
    warrantyStatus: 'active',
    status: 'maintenance',
    lastMaintenanceDate: '2026-10-25',
    nextScheduledMaintenance: '2026-11-15',
    qrCodeValue: 'APK-IT-005-HP-Z2MINI'
  },
  {
    id: 'ast-006',
    assetTag: 'APK-IT-006',
    name: 'Dell UltraSharp 32" 4K Monitor',
    category: 'Peripherals',
    brandModel: 'Dell U3223QE IPS Black',
    serialNumber: 'CN-0N184G-74261',
    specifications: '32 Inch 4K UHD, 100% sRGB, 98% DCI-P3, USB-C 90W PD Hub',
    location: 'Lantai 3 - Studio Desain',
    department: 'UI/UX Product Design',
    assignedUser: 'Siti Rahmawati (Product Designer)',
    purchaseDate: '2024-05-20',
    purchaseCost: 14200000,
    warrantyEndDate: '2027-05-20',
    warrantyStatus: 'active',
    status: 'active',
    lastMaintenanceDate: '2026-06-01',
    nextScheduledMaintenance: '2026-12-01',
    qrCodeValue: 'APK-IT-006-DELL-U3223'
  }
];

export const INITIAL_MAINTENANCE_LOGS: MaintenanceLog[] = [
  {
    id: 'mnt-101',
    assetId: 'ast-002',
    assetTag: 'APK-IT-002',
    assetName: 'Dell PowerEdge R750 Server',
    type: 'Preventive',
    scheduledDate: '2026-11-25',
    technician: 'PT Dell Support Partner & Internal DevOps',
    cost: 1500000,
    status: 'Scheduled',
    notes: 'Pembersihan debu heatsink, update firmware BIOS v2.14, dan pengecekan kesehatan SMART SSD array.',
    userNotified: true
  },
  {
    id: 'mnt-102',
    assetId: 'ast-005',
    assetTag: 'APK-IT-005',
    assetName: 'HP Z2 Mini G9 Workstation',
    type: 'Corrective',
    scheduledDate: '2026-11-15',
    technician: 'Surya Teknik Mandiri',
    cost: 450000,
    status: 'In Progress',
    notes: 'Kipas pendingin GPU mengeluarkan bunyi desing abnormal. Penggantian fan module resmi HP.',
    userNotified: true
  },
  {
    id: 'mnt-103',
    assetId: 'ast-001',
    assetTag: 'APK-IT-001',
    assetName: 'ThinkPad T14s Gen 4',
    type: 'Preventive',
    scheduledDate: '2026-09-10',
    completedDate: '2026-09-10',
    technician: 'Tim IT Support Internal',
    cost: 0,
    status: 'Completed',
    notes: 'Pembersihan keyboard, pengecekan thermal paste, pembaruan kernel OS.',
    userNotified: true
  }
];

export const INITIAL_AUDIT_LOGS: AuditHistoryLog[] = [
  {
    id: 'aud-001',
    assetId: 'ast-001',
    assetTag: 'APK-IT-001',
    timestamp: '2026-09-10 14:30',
    action: 'Servis & Perbaikan',
    performedBy: 'IT Asset Admin',
    details: 'Pemeliharaan berkala semesteran dinyatakan lolos inspeksi dan siap digunakan.'
  },
  {
    id: 'aud-002',
    assetId: 'ast-005',
    assetTag: 'APK-IT-005',
    timestamp: '2026-11-02 09:15',
    action: 'Mutasi Departemen',
    performedBy: 'Head of IT Operation',
    details: 'Mutasi aset dari Departemen Software Engineering ke Quality Assurance untuk stress test.',
    departmentTo: 'Quality Assurance'
  },
  {
    id: 'aud-003',
    assetId: 'ast-004',
    assetTag: 'APK-IT-004',
    timestamp: '2024-05-18 10:00',
    action: 'Serah Terima',
    performedBy: 'HR & IT Ops',
    details: 'Serah terima laptop inventaris baru kepada Siti Rahmawati (Product Designer).'
  }
];

export const INITIAL_PROJECTS: ClientProject[] = [
  {
    id: 'prj-101',
    projectName: 'Implementasi Presensi Guru Digital',
    clientName: 'Drs. H. Mulyadi, M.Pd.',
    institution: 'SMA Negeri 1 Harapan Bangsa',
    productId: 'presensi_guru',
    productName: 'Presensi Guru & Pegawai',
    currentPhase: 'staging',
    progressPercent: 78,
    startDate: '2026-10-15',
    targetGoLive: '2026-11-20',
    leadDeveloper: 'Eko Prasetyo (apeka team)',
    stagingUrl: 'https://presensi-sman1harapan.apeka.preview',
    customDomain: 'presensi.sman1harapan.sch.id',
    notes: 'Geofencing radius 150 meter sekeliling pagar sekolah sudah dikalibrasi akurat.',
    milestones: [
      { id: 'm1', title: 'Analisis Kebutuhan & Data Guru', description: 'Impor 84 data guru dan pegawai dari Dapodik', status: 'completed', targetDate: '2026-10-20', completedDate: '2026-10-19' },
      { id: 'm2', title: 'Setup UI/UX & Master Data Lokasi', description: 'Konfigurasi titik koordinat GPS gerbang & aula', status: 'completed', targetDate: '2026-10-28', completedDate: '2026-10-27' },
      { id: 'm3', title: 'Fitur Izin & Rekap PDF/Excel', description: 'Pengembangan workflow persetujuan kepala sekolah', status: 'completed', targetDate: '2026-11-05', completedDate: '2026-11-04' },
      { id: 'm4', title: 'Staging Server & Uji Coba Lapangan', description: 'Trial absensi 15 guru piket selama 3 hari kerja', status: 'in_progress', targetDate: '2026-11-15' },
      { id: 'm5', title: 'Go-Live Domain Resmi & Pelatihan Admin', description: 'Sosialisasi pengoperasian dan serah terima akun kepala sekolah', status: 'pending', targetDate: '2026-11-20' }
    ],
    recentActivity: [
      { timestamp: '10 Nov 2026, 16:20', description: 'Sinkronisasi 84 akun guru ke database staging berhasil' },
      { timestamp: '08 Nov 2026, 11:45', description: 'Pengujian akurasi GPS geofencing radius 150m dinyatakan valid' },
      { timestamp: '04 Nov 2026, 14:10', description: 'Modul rekapitulasi keterlambatan otomatis selesai diuji' }
    ]
  },
  {
    id: 'prj-102',
    projectName: 'Sistem Manajemen Aset IT Enterprise',
    clientName: 'Bambang Sudirman, S.Kom.',
    institution: 'PT Solusi Tekno Nusantara',
    productId: 'manajemen_aset_it',
    productName: 'Sistem Manajemen Aset IT',
    currentPhase: 'development',
    progressPercent: 62,
    startDate: '2026-10-25',
    targetGoLive: '2026-12-05',
    leadDeveloper: 'Aris Wicaksono (apeka team)',
    stagingUrl: 'https://itam-solusitekno.apeka.preview',
    customDomain: 'asset.solusitekno.co.id',
    notes: 'Integrasi API webhook antar departemen Finance dan HR sedang disinkronkan.',
    milestones: [
      { id: 'm1', title: 'Data Gathering & Skema Aset Hardware', description: 'Inventarisasi 140 perangkat laptop, server, dan jaringan', status: 'completed', targetDate: '2026-10-31', completedDate: '2026-10-30' },
      { id: 'm2', title: 'Modul Garansi & Notifikasi Maintenance', description: 'Algoritma peringatan otomatis H-30 masa garansi habis', status: 'completed', targetDate: '2026-11-08', completedDate: '2026-11-07' },
      { id: 'm3', title: 'Integrasi REST API Antar Departemen', description: 'Endpoint sync aset ke ERP Finance & log serah terima HR', status: 'in_progress', targetDate: '2026-11-20' },
      { id: 'm4', title: 'Staging & Simulasi Barcode QR Scan', description: 'Pengecekan barcode via scanner optik dan kamera smartphone', status: 'pending', targetDate: '2026-11-28' },
      { id: 'm5', title: 'Go-Live & Dokumentasi API Lengkap', description: 'Serah terima kunci enkripsi dan pelatihan tim IT Helpdesk', status: 'pending', targetDate: '2026-12-05' }
    ],
    recentActivity: [
      { timestamp: '11 Nov 2026, 09:30', description: 'Endpoint `/api/v1/assets/sync` lolos pengujian beban 500 req/sec' },
      { timestamp: '07 Nov 2026, 15:40', description: 'Modul notifikasi email garansi dan servis berkala aktif' }
    ]
  },
  {
    id: 'prj-103',
    projectName: 'Platform E-Learning Interaktif',
    clientName: 'Hj. Nurul Aisyah, S.Pd.',
    institution: 'SMP Islam Terpadu Al-Hikmah',
    productId: 'elearning_sederhana',
    productName: 'Platform E-Learning Sederhana',
    currentPhase: 'design',
    progressPercent: 35,
    startDate: '2026-11-01',
    targetGoLive: '2026-12-15',
    leadDeveloper: 'Larasati Dewi (apeka team)',
    stagingUrl: 'https://elearning-alhikmah.apeka.preview',
    customDomain: 'belajar.smpitalhikmah.sch.id',
    milestones: [
      { id: 'm1', title: 'Penyusunan Struktur Kelas & Mapel', description: 'Penetapan 18 rombel kelas VII, VIII, IX', status: 'completed', targetDate: '2026-11-06', completedDate: '2026-11-05' },
      { id: 'm2', title: 'Desain Tampilan Ramah Siswa & Guru', description: 'Prototipe antarmuka mobile-friendly hemat kuota', status: 'in_progress', targetDate: '2026-11-18' },
      { id: 'm3', title: 'Pengembangan Modul Kuis & Ujian Online', description: 'Sistem bank soal acak dan timer pengerjaan', status: 'pending', targetDate: '2026-11-30' },
      { id: 'm4', title: 'Staging Server & Uji Coba Guru Mapel', description: 'Simulasi unggah materi dan penugasan', status: 'pending', targetDate: '2026-12-08' },
      { id: 'm5', title: 'Peluncuran & Migrasi Domain', description: 'Siap digunakan pada semester genap', status: 'pending', targetDate: '2026-12-15' }
    ],
    recentActivity: [
      { timestamp: '09 Nov 2026, 13:00', description: 'Revisi palet warna dan tipografi portal e-learning disetujui klien' }
    ]
  },
  {
    id: 'prj-104',
    projectName: 'Sistem Keuangan & Tagihan SPP',
    clientName: 'Ir. Hendra Gunawan',
    institution: 'Yayasan Bina Prestasi Mandiri',
    productId: 'keuangan_sekolah',
    productName: 'Sistem Manajemen Keuangan Sekolah',
    currentPhase: 'handover',
    progressPercent: 100,
    startDate: '2026-09-20',
    targetGoLive: '2026-11-01',
    leadDeveloper: 'Eko Prasetyo (apeka team)',
    stagingUrl: 'https://keuangan-binaprestasi.apeka.preview',
    customDomain: 'spp.binaprestasi.sch.id',
    milestones: [
      { id: 'm1', title: 'Analisis Pos Keuangan & Tarif SPP', description: 'Konfigurasi 4 jenjang tingkatan tarif', status: 'completed', targetDate: '2026-09-28', completedDate: '2026-09-27' },
      { id: 'm2', title: 'Sistem Kwitansi Digital & Stempel', description: 'Format cetak PDF dan generator nomor faktur', status: 'completed', targetDate: '2026-10-10', completedDate: '2026-10-09' },
      { id: 'm3', title: 'Integrasi Broadcast Pengingat WhatsApp', description: 'Pengiriman pesan tagihan otomatis ke wali murid', status: 'completed', targetDate: '2026-10-20', completedDate: '2026-10-19' },
      { id: 'm4', title: 'Pengujian Lapangan Tim Bendahara', description: 'Simulasi 300 transaksi pembayaran tanpa selisih', status: 'completed', targetDate: '2026-10-28', completedDate: '2026-10-27' },
      { id: 'm5', title: 'Serah Terima Kunci & Go-Live Penuh', description: 'Pelatihan 3 staf keuangan dan serah terima dokumen SLA', status: 'completed', targetDate: '2026-11-01', completedDate: '2026-11-01' }
    ],
    recentActivity: [
      { timestamp: '01 Nov 2026, 10:00', description: 'Proyek selesai 100% dan masuk masa garansi pemeliharaan berkala' }
    ]
  }
];

export const INITIAL_SUBSCRIPTIONS: SubscriptionItem[] = [
  {
    id: 'sub-001',
    clientName: 'Drs. H. Mulyadi, M.Pd.',
    clientEmail: 'mulyadi@sman1harapan.sch.id',
    clientPhone: '081234567890',
    institutionName: 'SMA Negeri 1 Harapan Bangsa',
    productId: 'presensi_guru',
    productName: 'Presensi Guru & Pegawai',
    billingCycle: 'quarterly',
    pricePaid: 600000,
    startDate: '2026-08-20',
    endDate: '2026-11-20',
    daysRemaining: 9, // Expiring soon! Trigger D-7 / D-3 reminder
    status: 'expiring_soon',
    autoRenew: true,
    customDomain: 'presensi.sman1harapan.sch.id',
    lastRenewalDate: '2026-08-20'
  },
  {
    id: 'sub-002',
    clientName: 'Bambang Sudirman, S.Kom.',
    clientEmail: 'bambang@solusitekno.co.id',
    clientPhone: '081398765432',
    institutionName: 'PT Solusi Tekno Nusantara',
    productId: 'manajemen_aset_it',
    productName: 'Sistem Manajemen Aset IT',
    billingCycle: 'annual',
    pricePaid: 2680000,
    startDate: '2026-06-01',
    endDate: '2027-06-01',
    daysRemaining: 202,
    status: 'active',
    autoRenew: true,
    customDomain: 'asset.solusitekno.co.id',
    lastRenewalDate: '2026-06-01'
  },
  {
    id: 'sub-003',
    clientName: 'Dra. Endang Lestari',
    clientEmail: 'perpustakaan@smkn2bogor.sch.id',
    clientPhone: '085711223344',
    institutionName: 'SMK Negeri 2 Bogor',
    productId: 'manajemen_perpustakaan',
    productName: 'Sistem Manajemen Perpustakaan',
    billingCycle: 'quarterly',
    pricePaid: 600000,
    startDate: '2026-08-15',
    endDate: '2026-11-15',
    daysRemaining: 4, // Expiring soon! D-3
    status: 'expiring_soon',
    autoRenew: false,
    customDomain: 'perpus.smkn2bogor.sch.id'
  },
  {
    id: 'sub-004',
    clientName: 'Ir. Hendra Gunawan',
    clientEmail: 'yayasan@binaprestasi.sch.id',
    clientPhone: '081122334455',
    institutionName: 'Yayasan Bina Prestasi Mandiri',
    productId: 'keuangan_sekolah',
    productName: 'Sistem Manajemen Keuangan Sekolah',
    billingCycle: 'annual',
    pricePaid: 2850000,
    startDate: '2026-11-01',
    endDate: '2027-11-01',
    daysRemaining: 355,
    status: 'active',
    autoRenew: true,
    customDomain: 'spp.binaprestasi.sch.id'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-2026-001',
    invoiceNumber: 'INV/APK/202611/001',
    clientName: 'Drs. H. Mulyadi, M.Pd.',
    clientEmail: 'mulyadi@sman1harapan.sch.id',
    clientPhone: '081234567890',
    institutionName: 'SMA Negeri 1 Harapan Bangsa',
    productName: 'Presensi Guru & Pegawai',
    billingCycle: 'quarterly',
    issueDate: '2026-11-10',
    dueDate: '2026-11-18',
    subtotal: 600000,
    discount: 0,
    tax: 66000, // 11% PPN
    totalAmount: 666000,
    status: 'pending',
    autoRenewTriggered: true
  },
  {
    id: 'inv-2026-002',
    invoiceNumber: 'INV/APK/202611/002',
    clientName: 'Dra. Endang Lestari',
    clientEmail: 'perpustakaan@smkn2bogor.sch.id',
    clientPhone: '085711223344',
    institutionName: 'SMK Negeri 2 Bogor',
    productName: 'Sistem Manajemen Perpustakaan',
    billingCycle: 'quarterly',
    issueDate: '2026-11-08',
    dueDate: '2026-11-15',
    subtotal: 600000,
    discount: 0,
    tax: 66000,
    totalAmount: 666000,
    status: 'pending'
  },
  {
    id: 'inv-2026-003',
    invoiceNumber: 'INV/APK/202610/089',
    clientName: 'Ir. Hendra Gunawan',
    clientEmail: 'yayasan@binaprestasi.sch.id',
    clientPhone: '081122334455',
    institutionName: 'Yayasan Bina Prestasi Mandiri',
    productName: 'Sistem Manajemen Keuangan Sekolah',
    billingCycle: 'annual',
    issueDate: '2026-10-25',
    dueDate: '2026-10-31',
    paidDate: '2026-10-29 11:22',
    subtotal: 3200000,
    discount: 350000, // diskon pelanggan setia
    tax: 313500,
    totalAmount: 3163500,
    status: 'paid',
    paymentMethod: 'QRIS Dinamis',
    referenceNumber: 'QRIS-882910398'
  },
  {
    id: 'inv-2026-004',
    invoiceNumber: 'INV/APK/202606/042',
    clientName: 'Bambang Sudirman, S.Kom.',
    clientEmail: 'bambang@solusitekno.co.id',
    clientPhone: '081398765432',
    institutionName: 'PT Solusi Tekno Nusantara',
    productName: 'Sistem Manajemen Aset IT',
    billingCycle: 'annual',
    issueDate: '2026-05-25',
    dueDate: '2026-05-31',
    paidDate: '2026-05-28 14:05',
    subtotal: 3000000,
    discount: 320000,
    tax: 294800,
    totalAmount: 2974800,
    status: 'paid',
    paymentMethod: 'Virtual Account BCA',
    referenceNumber: 'VA-BCA-8801928471'
  }
];

export const INITIAL_EMAIL_REMINDERS: EmailReminder[] = [
  {
    id: 'rem-001',
    subscriptionId: 'sub-001',
    clientName: 'Drs. H. Mulyadi, M.Pd.',
    clientEmail: 'mulyadi@sman1harapan.sch.id',
    productName: 'Presensi Guru & Pegawai',
    type: 'D-7',
    scheduledDate: '2026-11-13',
    sentDate: '2026-11-13 08:00',
    status: 'Sent',
    subject: '[PENGINGAT RESMI] Masa Aktif Layanan Presensi Guru Berakhir dalam 7 Hari'
  },
  {
    id: 'rem-002',
    subscriptionId: 'sub-003',
    clientName: 'Dra. Endang Lestari',
    clientEmail: 'perpustakaan@smkn2bogor.sch.id',
    productName: 'Sistem Manajemen Perpustakaan',
    type: 'D-3',
    scheduledDate: '2026-11-12',
    sentDate: '2026-11-12 08:00',
    status: 'Sent',
    subject: '[PENTING] Segera Perpanjang Langganan Perpustakaan Digital Anda (H-3)'
  },
  {
    id: 'rem-003',
    subscriptionId: 'sub-001',
    clientName: 'Drs. H. Mulyadi, M.Pd.',
    clientEmail: 'mulyadi@sman1harapan.sch.id',
    productName: 'Presensi Guru & Pegawai',
    type: 'D-3',
    scheduledDate: '2026-11-17',
    status: 'Scheduled',
    subject: '[NOTIFIKASI OTOMATIS] Tagihan Perpanjangan Otomatis Layanan apeka project'
  }
];
