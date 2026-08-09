export type UserStatus = 'active' | 'suspended' | 'pending';

export type UserRole = 
  | 'super_admin' 
  | 'financial_admin' 
  | 'support_agent' 
  | 'content_manager' 
  | 'client_admin';

export type PlanType = 'Starter' | 'Pro' | 'Enterprise' | 'Custom';

export type PaymentMethod = 'orange_money' | 'mtn_money' | 'stripe' | 'paypal';

export interface LoginSession {
  date: string;
  ip: string;
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
  avatar?: string;
  status: UserStatus;
  role: UserRole;
  plan: PlanType;
  paymentMethod: PaymentMethod;
  mrr: number;
  lastLogin: string;
  ip: string;
  createdAt: string;
  loginHistory: LoginSession[];
}

export interface Subscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  company: string;
  planName: PlanType;
  price: number;
  billingCycle: 'mensuel' | 'annuel';
  status: 'actif' | 'expire_bientot' | 'suspendu' | 'essai';
  startDate: string;
  nextBillingDate: string;
  autoRenew: boolean;
  paymentChannel: PaymentMethod;
  daysRemaining: number;
}

export interface PlanDefinition {
  id: string;
  name: PlanType;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  features: string[];
  subscriberCount: number;
  isPopular?: boolean;
}

export interface PaymentTransaction {
  id: string;
  transactionId: string;
  clientName: string;
  company: string;
  amount: number;
  currency: string;
  gateway: 'Orange Money' | 'MTN Mobile Money' | 'Stripe' | 'PayPal';
  status: 'success' | 'pending' | 'failed' | 'refunded';
  timestamp: string;
  gatewayRef: string;
  hashSignature: string;
  payload: Record<string, any>;
}

export interface TemplateVersion {
  version: string;
  modifiedAt: string;
  modifiedBy: string;
  content: string;
  comment: string;
}

export interface TemplateItem {
  id: string;
  title: string;
  category: 'factures' | 'contrats' | 'emails';
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
  category: 'facturation' | 'technique' | 'compte' | 'intégration';
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
  ip: string;
  severity: 'info' | 'warning' | 'alert';
  hashSignature: string;
}

export interface ActiveSession {
  id: string;
  userEmail: string;
  userName: string;
  ip: string;
  device: string;
  location: string;
  loginTime: string;
  lastActive: string;
  isCurrent?: boolean;
}

export interface GatewayStatus {
  name: 'Orange Money' | 'MTN Mobile Money' | 'Stripe' | 'PayPal';
  key: PaymentMethod;
  status: 'operational' | 'degraded' | 'maintenance';
  mode: 'live' | 'sandbox';
  latencyMs: number;
  volume24h: number;
}
