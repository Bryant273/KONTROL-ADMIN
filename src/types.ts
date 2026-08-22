export type UserStatus = 'active' | 'suspended' | 'pending';

export type UserRole = 
  | 'super_admin' 
  | 'financial_admin' 
  | 'support_agent' 
  | 'content_manager' 
  | 'client_admin';

export type PlanType = 'STANDARD';

export type PaymentMethod = 'orange_money' | 'mtn_money' | 'wave' | 'card' | 'genius_pay';

export interface LoginSession {
  date: string;
  device: string;
  location: string;
  status: 'success' | 'failed';
}

export interface UserClient {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  country: string;
  address: string;
  avatar?: string;
  status: UserStatus;
  role: UserRole;
  plan: PlanType;
  paymentMethod: PaymentMethod;
  mrr: number; // 15 000 FCFA
  lastLogin?: string;
  createdAt: string;
  loginHistory?: LoginSession[];
  geniusPayCustomerId?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'suspended';
  lastLogin: string;
  createdAt: string;
  avatar?: string;
  phone?: string;
  department: 'Direction' | 'Finance' | 'Support' | 'Produit';
  permissions: string[];
}

export interface Subscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  company: string;
  planName: PlanType;
  price: number; // 15 000 FCFA / mois
  billingCycle: 'mensuel' | 'annuel';
  status: 'actif' | 'expire_bientot' | 'suspendu' | 'essai';
  startDate: string;
  nextBillingDate: string;
  autoRenew: boolean;
  paymentChannel: PaymentMethod;
  daysRemaining: number;
  country?: string;
  address?: string;
  geniusPaySubId?: string;
}

export interface PlanDefinition {
  id: string;
  name: PlanType;
  priceMonthly: number; // 15 000 FCFA
  priceYearly: number;  // 150 000 FCFA
  description: string;
  features: string[];
  subscriberCount: number;
  isPopular?: boolean;
}

export type PaymentNetwork = 'Orange Money' | 'MTN Mobile Money' | 'Wave' | 'Carte Bancaire';

export interface PaymentTransaction {
  id: string;
  transactionId: string; // N° Bordereau GeniuSPay (ex: GP_TX_98412)
  purpose: string; // Exclusif: "Abonnement KONTROL Standard"
  planName: PlanType; // STANDARD
  clientName: string;
  company: string;
  amount: number; // 15 000 FCFA (mensuel) ou 150 000 FCFA (annuel)
  currency: string; // XOF (FCFA)
  aggregator: 'GeniuSPay'; // Moyen de Paiement / Agrégateur
  paymentNetwork: PaymentNetwork; // Réseau sous-jacent (détail du bordereau)
  status: 'success' | 'pending' | 'failed' | 'refunded';
  timestamp: string;
  slipReference: string; // Référence bordereau GeniuSPay
  payload?: Record<string, any>;
}

export interface TemplateVersion {
  version: string;
  modifiedAt: string;
  modifiedBy: string;
  content: string;
  comment: string;
}

export type TemplateCategory = 'factures' | 'bons' | 'fiches' | 'contrats' | 'recus';

export interface TemplateItem {
  id: string;
  title: string;
  category: TemplateCategory;
  docTypeLabel: string;
  currentVersion: string;
  lastModified: string;
  author: string;
  variables: string[];
  content: string;
  versionHistory: TemplateVersion[];
}

export interface TicketMessage {
  id: string;
  sender: string;
  isAgent: boolean;
  avatar?: string;
  content: string;
  timestamp: string;
  isInternalNote?: boolean;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  clientName: string;
  company: string;
  subject: string;
  category: 'facturation' | 'technique' | 'compte' | 'intégration' | 'genius_pay';
  priority: 'urgent' | 'high' | 'normal' | 'low';
  status: 'open' | 'in_progress' | 'waiting' | 'resolved';
  assignedTo: string;
  createdAt: string;
  slaMinutesRemaining: number;
  messages: TicketMessage[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  target: string;
  ip?: string;
  severity: 'info' | 'warning' | 'alert';
  hashSignature: string;
}

export interface ActiveSession {
  id: string;
  userEmail: string;
  userName: string;
  device: string;
  location: string;
  loginTime: string;
  lastActive: string;
  isCurrent?: boolean;
}

export interface GatewayStatus {
  name: string;
  network: PaymentNetwork;
  key: PaymentMethod;
  status: 'operational' | 'degraded' | 'maintenance';
  mode: 'live' | 'sandbox';
  latencyMs: number;
  volume24h: number;
  provider: string; // Ex: "Moyen de Paiement : GeniuSPay", "Réseau Orange Money via GeniuSPay"
}
