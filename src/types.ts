export type BillingCycle = 'monthly' | 'quarterly' | 'annual';

export interface WebAppProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  baseQuarterlyPrice: number; // Base price for 3 months (in IDR)
  monthlyPrice: number;
  annualPrice: number; // with loyal discount applied
  features: string[];
  specs: string[];
  popular?: boolean;
  isNew?: boolean;
  demoId: string;
}

export interface SubscriptionItem {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  institutionName: string;
  productId: string;
  productName: string;
  billingCycle: BillingCycle;
  pricePaid: number;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  status: 'active' | 'expiring_soon' | 'expired';
  autoRenew: boolean;
  customDomain?: string;
  lastRenewalDate?: string;
}

export type ProjectPhaseId = 'requirements' | 'design' | 'development' | 'staging' | 'handover';

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending';
  targetDate: string;
  completedDate?: string;
}

export interface ClientProject {
  id: string;
  projectName: string;
  clientName: string;
  institution: string;
  productId: string;
  productName: string;
  currentPhase: ProjectPhaseId;
  progressPercent: number; // 0 - 100
  startDate: string;
  targetGoLive: string;
  leadDeveloper: string;
  stagingUrl?: string;
  customDomain?: string;
  milestones: ProjectMilestone[];
  notes?: string;
  recentActivity: {
    timestamp: string;
    description: string;
  }[];
}

export type InvoiceStatus = 'paid' | 'pending' | 'overdue';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  institutionName: string;
  productName: string;
  billingCycle: BillingCycle;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  subtotal: number;
  discount: number;
  tax: number; // 11% PPN
  totalAmount: number;
  status: InvoiceStatus;
  paymentMethod?: string;
  referenceNumber?: string;
  autoRenewTriggered?: boolean;
}

export type AssetStatus = 'active' | 'maintenance' | 'deprecated' | 'disposed';
export type WarrantyStatus = 'active' | 'warning' | 'expired' | 'claimed';

export interface ITAsset {
  id: string;
  assetTag: string; // e.g. APK-IT-001
  name: string;
  category: 'Laptop' | 'Server' | 'Network' | 'Workstation' | 'Peripherals' | 'Mobile';
  brandModel: string;
  serialNumber: string;
  specifications: string;
  location: string;
  department: string;
  assignedUser: string;
  purchaseDate: string;
  purchaseCost: number;
  warrantyEndDate: string;
  warrantyStatus: WarrantyStatus;
  status: AssetStatus;
  lastMaintenanceDate?: string;
  nextScheduledMaintenance: string;
  qrCodeValue: string;
}

export interface MaintenanceLog {
  id: string;
  assetId: string;
  assetTag: string;
  assetName: string;
  type: 'Preventive' | 'Corrective' | 'Inspection' | 'Upgrade';
  scheduledDate: string;
  completedDate?: string;
  technician: string;
  cost: number;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Pending Parts';
  notes: string;
  userNotified: boolean;
}

export interface AuditHistoryLog {
  id: string;
  assetId: string;
  assetTag: string;
  timestamp: string;
  action: 'Serah Terima' | 'Mutasi Departemen' | 'Servis & Perbaikan' | 'Update Garansi' | 'Registrasi Aset';
  performedBy: string;
  details: string;
  departmentTo?: string;
}

export interface EmailReminder {
  id: string;
  subscriptionId: string;
  clientName: string;
  clientEmail: string;
  productName: string;
  type: 'D-7' | 'D-3' | 'D-1' | 'EXPIRED';
  scheduledDate: string;
  sentDate?: string;
  status: 'Sent' | 'Scheduled' | 'Failed';
  subject: string;
}
