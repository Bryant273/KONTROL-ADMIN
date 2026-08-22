import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  writeBatch,
  where
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  UserClient, 
  Subscription, 
  PlanDefinition, 
  PaymentTransaction, 
  TemplateItem, 
  SupportTicket, 
  AuditLog, 
  ActiveSession, 
  GatewayStatus,
  TicketMessage,
  PaymentNetwork
} from '../types';

// Standard constant plan
export const STANDARD_PLAN: PlanDefinition = {
  id: 'plan_standard',
  name: 'STANDARD',
  priceMonthly: 15000,
  priceYearly: 150000,
  description: 'Licence complète KONTROL ERP avec accès illimité aux modules, facturation, règlements via GeniuSPay et support.',
  features: [
    'ERP Gestion Commerciale & Facturation',
    'Moyen de paiement sécurisé via GeniuSPay (Orange Money / MTN MoMo / Wave)',
    'Gestion multi-utilisateurs & rôles RBAC',
    'Exports comptables normalisés OHADA',
    'Support client prioritaire & SLA garanti',
    'Sauvegardes automatiques en temps réel'
  ],
  subscriberCount: 0,
  isPopular: true
};

export const DEFAULT_GATEWAYS: GatewayStatus[] = [
  {
    name: 'Orange Money',
    network: 'Orange Money',
    key: 'orange_money',
    status: 'operational',
    mode: 'live',
    latencyMs: 180,
    volume24h: 30000,
    provider: 'GeniuSPay'
  },
  {
    name: 'MTN Mobile Money',
    network: 'MTN Mobile Money',
    key: 'mtn_money',
    status: 'operational',
    mode: 'live',
    latencyMs: 200,
    volume24h: 15000,
    provider: 'GeniuSPay'
  },
  {
    name: 'Wave',
    network: 'Wave',
    key: 'wave',
    status: 'operational',
    mode: 'live',
    latencyMs: 130,
    volume24h: 15000,
    provider: 'GeniuSPay'
  }
];

export const COLLECTIONS = {
  USERS: 'users',
  SUBSCRIPTIONS: 'subscriptions',
  TRANSACTIONS: 'transactions',
  TEMPLATES: 'templates',
  TICKETS: 'tickets',
  AUDIT_LOGS: 'auditLogs',
  SESSIONS: 'sessions',
  GATEWAYS: 'gateways'
};

export function safeFormatDate(raw: any, fallback?: string): string {
  const defaultFallback = fallback || new Date().toISOString().split('T')[0];
  if (!raw) return defaultFallback;
  if (typeof raw === 'string') {
    return raw.slice(0, 10);
  }
  if (typeof raw.toDate === 'function') {
    try {
      const d = raw.toDate();
      if (d instanceof Date && !isNaN(d.getTime())) return d.toISOString().split('T')[0];
    } catch {
      // ignore
    }
  }
  if (typeof raw.seconds === 'number' && !isNaN(raw.seconds)) {
    const d = new Date(raw.seconds * 1000);
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  }
  if (typeof raw._seconds === 'number' && !isNaN(raw._seconds)) {
    const d = new Date(raw._seconds * 1000);
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  }
  if (raw instanceof Date && !isNaN(raw.getTime())) {
    try {
      return raw.toISOString().split('T')[0];
    } catch {
      return defaultFallback;
    }
  }
  return defaultFallback;
}

export function safeFormatTimestamp(raw: any, fallback?: string): string {
  const defaultFallback = fallback || new Date().toISOString().replace('T', ' ').slice(0, 19);
  if (!raw) return defaultFallback;
  if (typeof raw === 'string') {
    return raw;
  }
  if (typeof raw.toDate === 'function') {
    try {
      const d = raw.toDate();
      if (d instanceof Date && !isNaN(d.getTime())) return d.toISOString().replace('T', ' ').slice(0, 19);
    } catch {
      // ignore
    }
  }
  if (typeof raw.seconds === 'number' && !isNaN(raw.seconds)) {
    const d = new Date(raw.seconds * 1000);
    if (!isNaN(d.getTime())) return d.toISOString().replace('T', ' ').slice(0, 19);
  }
  if (typeof raw._seconds === 'number' && !isNaN(raw._seconds)) {
    const d = new Date(raw._seconds * 1000);
    if (!isNaN(d.getTime())) return d.toISOString().replace('T', ' ').slice(0, 19);
  }
  if (raw instanceof Date && !isNaN(raw.getTime())) {
    try {
      return raw.toISOString().replace('T', ' ').slice(0, 19);
    } catch {
      return defaultFallback;
    }
  }
  return defaultFallback;
}

export function safeDateSort(dateStrA?: any, dateStrB?: any): number {
  const getTime = (val: any): number => {
    if (!val) return 0;
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    if (typeof val === 'string') {
      const clean = val.includes(' ') && !val.includes('T') ? val.replace(' ', 'T') : val;
      const parsed = new Date(clean).getTime();
      return isNaN(parsed) ? 0 : parsed;
    }
    if (typeof val.toDate === 'function') {
      try {
        const d = val.toDate();
        return d instanceof Date && !isNaN(d.getTime()) ? d.getTime() : 0;
      } catch {
        return 0;
      }
    }
    if (typeof val.seconds === 'number') return val.seconds * 1000;
    if (typeof val._seconds === 'number') return val._seconds * 1000;
    if (val instanceof Date) return isNaN(val.getTime()) ? 0 : val.getTime();
    return 0;
  };
  return getTime(dateStrB) - getTime(dateStrA);
}

/**
 * Helper to extract user/company fields from any Firestore schema
 */
export function mapFirestoreUserDoc(docId: string, data: Record<string, any>): UserClient {
  const company = data.company || 
                  data.companyName || 
                  data.nomEntreprise || 
                  data.entreprise || 
                  data.organisation || 
                  data.society || 
                  data.societe || 
                  data.businessName || 
                  data.name || 
                  'Entreprise KONTROL';

  const phone = data.phone || 
                data.contact || 
                data.telephone || 
                data.numTelephone || 
                data.tel || 
                data.mobile || 
                '—';

  // Resolve clean single country - Never use dual strings like "Sénégal / Côte d'Ivoire"
  let country = 'Sénégal';
  if (data.country && typeof data.country === 'string') {
    const c = data.country.trim();
    if (c.toLowerCase().includes('ivoire')) country = "Côte d'Ivoire";
    else if (c.toLowerCase().includes('mali')) country = 'Mali';
    else if (c.toLowerCase().includes('camer')) country = 'Cameroun';
    else if (c.toLowerCase().includes('senegal') || c.toLowerCase().includes('sénégal')) country = 'Sénégal';
    else if (c.toLowerCase().includes('guin')) country = 'Guinée';
    else if (c.toLowerCase().includes('burk')) country = 'Burkina Faso';
    else if (c.toLowerCase().includes('togo')) country = 'Togo';
    else if (c.toLowerCase().includes('benin') || c.toLowerCase().includes('bénin')) country = 'Bénin';
    else country = c;
  } else if (data.pays && typeof data.pays === 'string') {
    const p = data.pays.trim();
    if (p.toLowerCase().includes('ivoire')) country = "Côte d'Ivoire";
    else if (p.toLowerCase().includes('mali')) country = 'Mali';
    else country = p;
  } else {
    // deduce from address if available
    const addr = (data.address || data.adresse || data.ville || '').toLowerCase();
    if (addr.includes('abidjan') || addr.includes('yopougon') || addr.includes('cocody')) country = "Côte d'Ivoire";
    else if (addr.includes('bamako')) country = 'Mali';
    else if (addr.includes('douala') || addr.includes('yaounde')) country = 'Cameroun';
    else country = 'Sénégal';
  }

  const address = data.address || 
                  data.adresse || 
                  data.siege || 
                  data.location || 
                  data.localisation || 
                  data.city || 
                  data.ville || 
                  'Siège social';

  const name = data.name || 
               data.fullName || 
               data.nom || 
               data.prenom || 
               data.displayName || 
               data.username || 
               company;

  const email = data.email || 
                data.mail || 
                data.userEmail || 
                data.contactEmail || 
                '';

  let status: 'active' | 'suspended' | 'pending' = 'active';
  if (data.status) {
    const s = String(data.status).toLowerCase();
    if (s.includes('suspend') || s.includes('inact') || s.includes('block')) status = 'suspended';
    else if (s.includes('pend') || s.includes('attente') || s.includes('verif')) status = 'pending';
    else status = 'active';
  }

  let paymentMethod: 'orange_money' | 'mtn_money' | 'wave' | 'card' | 'genius_pay' = 'orange_money';
  if (data.paymentMethod) {
    const p = String(data.paymentMethod).toLowerCase();
    if (p.includes('orange')) paymentMethod = 'orange_money';
    else if (p.includes('mtn')) paymentMethod = 'mtn_money';
    else if (p.includes('wave')) paymentMethod = 'wave';
    else if (p.includes('card') || p.includes('cb')) paymentMethod = 'card';
    else paymentMethod = 'orange_money';
  }

  const mrr = status === 'active' ? 15000 : 0;

  return {
    id: docId,
    name,
    email,
    company,
    phone,
    country,
    address,
    avatar: data.avatar,
    status,
    role: data.role || 'client_admin',
    plan: 'STANDARD',
    paymentMethod,
    mrr,
    lastLogin: data.lastLogin || data.derniereConnexion || 'En ligne',
    createdAt: safeFormatDate(data.createdAt),
    geniusPayCustomerId: data.geniusPayCustomerId || data.geniusPayId || data.jiniusPayCustomerId || data.jiniusPayId
  };
}

/**
 * Helper to extract tickets
 */
export function mapFirestoreTicketDoc(docId: string, data: Record<string, any>): SupportTicket {
  return {
    id: docId,
    ticketNumber: data.ticketNumber || data.numeroTicket || `TKT-${docId.slice(-4).toUpperCase()}`,
    clientName: data.clientName || data.userName || data.nomClient || 'Client',
    company: data.company || data.companyName || data.entreprise || 'Entreprise',
    subject: data.subject || data.objet || data.titre || 'Demande d\'assistance KONTROL',
    category: data.category === 'jinius_pay' ? 'genius_pay' : (data.category || 'genius_pay'),
    priority: data.priority || 'normal',
    status: data.status || 'open',
    assignedTo: data.assignedTo || 'Support KONTROL',
    createdAt: safeFormatDate(data.createdAt),
    slaMinutesRemaining: typeof data.slaMinutesRemaining === 'number' ? data.slaMinutesRemaining : 120,
    messages: data.messages || []
  };
}

/**
 * Helper to extract transactions: Only subscription payments with GeniuSPay payment slips and network details
 */
export function mapFirestoreTransactionDoc(docId: string, data: Record<string, any>): PaymentTransaction {
  let paymentNetwork: PaymentNetwork = 'Orange Money';
  const rawNetwork = String(data.paymentNetwork || data.gateway || data.reseau || '').toLowerCase();
  if (rawNetwork.includes('orange')) paymentNetwork = 'Orange Money';
  else if (rawNetwork.includes('mtn')) paymentNetwork = 'MTN Mobile Money';
  else if (rawNetwork.includes('wave')) paymentNetwork = 'Wave';
  else if (rawNetwork.includes('card') || rawNetwork.includes('bancaire')) paymentNetwork = 'Carte Bancaire';
  else paymentNetwork = 'Orange Money';

  return {
    id: docId,
    transactionId: data.transactionId || data.reference || `GP_TX_${docId.slice(-5).toUpperCase()}`,
    purpose: 'Abonnement KONTROL Standard',
    planName: 'STANDARD',
    clientName: data.clientName || data.userName || data.nom || 'Client',
    company: data.company || data.companyName || data.entreprise || 'Entreprise',
    amount: Number(data.amount || data.montant || 15000),
    currency: 'XOF',
    aggregator: 'GeniuSPay',
    paymentNetwork,
    status: data.status || 'success',
    timestamp: safeFormatTimestamp(data.timestamp || data.date),
    slipReference: data.slipReference || data.gatewayRef || `GENIUSPAY_SLIP_${Date.now().toString().slice(-6)}`,
    payload: data.payload || {}
  };
}

// ======================== REALTIME SUBSCRIPTIONS ========================

export function subscribeUsers(callback: (users: UserClient[]) => void) {
  const q = collection(db, COLLECTIONS.USERS);
  return onSnapshot(q, (snapshot) => {
    const users: UserClient[] = [];
    snapshot.forEach((docSnap) => {
      users.push(mapFirestoreUserDoc(docSnap.id, docSnap.data()));
    });
    callback(users);
  }, (err) => {
    console.error('Firestore Users listener error:', err);
  });
}

export function subscribeSubscriptions(callback: (subscriptions: Subscription[]) => void) {
  const q = collection(db, COLLECTIONS.SUBSCRIPTIONS);
  return onSnapshot(q, (snapshot) => {
    const list: Subscription[] = [];
    snapshot.forEach((docSnap) => {
      const d = docSnap.data();
      list.push({
        id: docSnap.id,
        userId: d.userId || docSnap.id,
        userName: d.userName || d.name || 'Client',
        userEmail: d.userEmail || d.email || '',
        company: d.company || d.companyName || 'Entreprise',
        planName: 'STANDARD',
        price: Number(d.price || 15000),
        billingCycle: d.billingCycle || 'mensuel',
        status: d.status || 'actif',
        startDate: safeFormatDate(d.startDate),
        nextBillingDate: safeFormatDate(d.nextBillingDate, new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0]),
        autoRenew: d.autoRenew !== false,
        paymentChannel: d.paymentChannel === 'jinius_pay' ? 'orange_money' : (d.paymentChannel || 'orange_money'),
        daysRemaining: typeof d.daysRemaining === 'number' ? d.daysRemaining : 30,
        country: d.country || d.pays || 'Sénégal',
        address: d.address || d.adresse || 'Siège social',
        geniusPaySubId: d.geniusPaySubId || d.geniusPayId || d.jiniusPaySubId || d.jiniusPayId
      });
    });
    callback(list);
  }, (err) => {
    console.error('Firestore Subscriptions listener error:', err);
  });
}

export function subscribeTransactions(callback: (transactions: PaymentTransaction[]) => void) {
  const q = collection(db, COLLECTIONS.TRANSACTIONS);
  return onSnapshot(q, (snapshot) => {
    const list: PaymentTransaction[] = [];
    snapshot.forEach((docSnap) => {
      list.push(mapFirestoreTransactionDoc(docSnap.id, docSnap.data()));
    });
    // Sort recent first safely
    list.sort((a, b) => safeDateSort(a.timestamp, b.timestamp));
    callback(list);
  }, (err) => {
    console.error('Firestore Transactions listener error:', err);
  });
}

export function subscribeTickets(callback: (tickets: SupportTicket[]) => void) {
  const q = collection(db, COLLECTIONS.TICKETS);
  return onSnapshot(q, (snapshot) => {
    const list: SupportTicket[] = [];
    snapshot.forEach((docSnap) => {
      list.push(mapFirestoreTicketDoc(docSnap.id, docSnap.data()));
    });
    list.sort((a, b) => safeDateSort(a.createdAt, b.createdAt));
    callback(list);
  }, (err) => {
    console.error('Firestore Tickets listener error:', err);
  });
}

export function subscribeTemplates(callback: (templates: TemplateItem[]) => void) {
  const q = collection(db, COLLECTIONS.TEMPLATES);
  return onSnapshot(q, (snapshot) => {
    const list: TemplateItem[] = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() } as TemplateItem);
    });
    callback(list);
  }, (err) => {
    console.error('Firestore Templates listener error:', err);
  });
}

export function subscribeAuditLogs(callback: (logs: AuditLog[]) => void) {
  const q = collection(db, COLLECTIONS.AUDIT_LOGS);
  return onSnapshot(q, (snapshot) => {
    const list: AuditLog[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({ 
        id: docSnap.id, 
        ...data,
        timestamp: safeFormatTimestamp(data.timestamp || data.date)
      } as AuditLog);
    });
    list.sort((a, b) => safeDateSort(a.timestamp, b.timestamp));
    callback(list);
  }, (err) => {
    console.error('Firestore AuditLogs listener error:', err);
  });
}

export function subscribeSessions(callback: (sessions: ActiveSession[]) => void) {
  const q = collection(db, COLLECTIONS.SESSIONS);
  return onSnapshot(q, (snapshot) => {
    const list: ActiveSession[] = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() } as ActiveSession);
    });
    callback(list);
  }, (err) => {
    console.error('Firestore Sessions listener error:', err);
  });
}

// ======================== FIRESTORE CRUD OPERATIONS ========================

// 1. Users CRUD
export async function createFirestoreUser(user: Omit<UserClient, 'id'> | UserClient): Promise<string> {
  const id = 'id' in user && user.id ? user.id : `usr_${Date.now().toString().slice(-6)}`;
  const ref = doc(db, COLLECTIONS.USERS, id);
  await setDoc(ref, {
    ...user,
    id,
    plan: 'STANDARD',
    mrr: user.status === 'active' ? 15000 : 0,
    updatedAt: new Date().toISOString()
  });
  return id;
}

export async function updateFirestoreUser(userId: string, updates: Partial<UserClient>): Promise<void> {
  const ref = doc(db, COLLECTIONS.USERS, userId);
  const dataToUpdate: Record<string, any> = { ...updates, updatedAt: new Date().toISOString() };
  if (updates.status) {
    dataToUpdate.mrr = updates.status === 'active' ? 15000 : 0;
  }
  await updateDoc(ref, dataToUpdate);
}

export async function deleteFirestoreUser(userId: string): Promise<void> {
  const ref = doc(db, COLLECTIONS.USERS, userId);
  await deleteDoc(ref);
}

// 2. Subscriptions CRUD
export async function createFirestoreSubscription(sub: Subscription): Promise<void> {
  const ref = doc(db, COLLECTIONS.SUBSCRIPTIONS, sub.id);
  await setDoc(ref, {
    ...sub,
    planName: 'STANDARD',
    price: 15000
  });
}

export async function updateFirestoreSubscription(subId: string, updates: Partial<Subscription>): Promise<void> {
  const ref = doc(db, COLLECTIONS.SUBSCRIPTIONS, subId);
  await updateDoc(ref, updates);
}

// 3. Transactions & GeniuSPay Slip Integration (Exclusively Subscriptions)
export async function createGeniuSPayTransaction(params: {
  clientName: string;
  company: string;
  amount: number; // 15 000 ou 150 000 FCFA
  paymentNetwork: PaymentNetwork;
  userId?: string;
}): Promise<PaymentTransaction> {
  const txId = `GP_TX_${Date.now().toString().slice(-6)}`;
  const networkCode = params.paymentNetwork === 'Orange Money' ? 'OM' : params.paymentNetwork === 'MTN Mobile Money' ? 'MTN' : params.paymentNetwork === 'Wave' ? 'WAVE' : 'CB';
  const slipRef = `GENIUSPAY_SLIP_${networkCode}_${Date.now().toString().slice(-6)}`;

  const newTx: PaymentTransaction = {
    id: txId,
    transactionId: txId,
    purpose: 'Abonnement KONTROL Standard',
    planName: 'STANDARD',
    clientName: params.clientName,
    company: params.company,
    amount: params.amount || 15000,
    currency: 'XOF',
    aggregator: 'GeniuSPay',
    paymentNetwork: params.paymentNetwork,
    status: 'success',
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    slipReference: slipRef,
    payload: {
      aggregator: 'GeniuSPay',
      channel: params.paymentNetwork,
      subscriptionPurpose: 'Forfait STANDARD (15 000 FCFA/mois)',
      processedAt: new Date().toISOString()
    }
  };

  const ref = doc(db, COLLECTIONS.TRANSACTIONS, txId);
  await setDoc(ref, newTx);

  // If userId is provided, update or create subscription
  if (params.userId) {
    const subRef = doc(db, COLLECTIONS.SUBSCRIPTIONS, `sub_${params.userId}`);
    await setDoc(subRef, {
      id: `sub_${params.userId}`,
      userId: params.userId,
      userName: params.clientName,
      company: params.company,
      planName: 'STANDARD',
      price: 15000,
      billingCycle: 'mensuel',
      status: 'actif',
      startDate: new Date().toISOString().split('T')[0],
      nextBillingDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      autoRenew: true,
      paymentChannel: params.paymentNetwork === 'Orange Money' ? 'orange_money' : params.paymentNetwork === 'MTN Mobile Money' ? 'mtn_money' : params.paymentNetwork === 'Wave' ? 'wave' : 'card',
      daysRemaining: 30,
      geniusPaySubId: `GPSUB_${Date.now().toString().slice(-6)}`
    }, { merge: true });
  }

  return newTx;
}

export const createJiniusPayTransaction = createGeniuSPayTransaction;

export async function updateFirestoreTransaction(txId: string, updates: Partial<PaymentTransaction>): Promise<void> {
  const ref = doc(db, COLLECTIONS.TRANSACTIONS, txId);
  await updateDoc(ref, updates);
}

// 4. Tickets CRUD
export async function createFirestoreTicket(ticket: SupportTicket): Promise<void> {
  const ref = doc(db, COLLECTIONS.TICKETS, ticket.id);
  await setDoc(ref, ticket);
}

export async function updateFirestoreTicket(ticketId: string, updates: Partial<SupportTicket>): Promise<void> {
  const ref = doc(db, COLLECTIONS.TICKETS, ticketId);
  await updateDoc(ref, updates);
}

export async function addFirestoreTicketMessage(ticketId: string, currentTicket: SupportTicket, newMessage: TicketMessage): Promise<void> {
  const ref = doc(db, COLLECTIONS.TICKETS, ticketId);
  const updatedMessages = [...(currentTicket.messages || []), newMessage];
  await updateDoc(ref, {
    messages: updatedMessages
  });
}

// 5. Templates CRUD
export async function updateFirestoreTemplate(templateId: string, template: TemplateItem): Promise<void> {
  const ref = doc(db, COLLECTIONS.TEMPLATES, templateId);
  await setDoc(ref, template);
}

// 6. Audit Logs
export async function logFirestoreAuditEvent(log: AuditLog): Promise<void> {
  const ref = doc(db, COLLECTIONS.AUDIT_LOGS, log.id);
  await setDoc(ref, log);
}

// 7. Sessions
export async function revokeFirestoreSession(sessionId: string): Promise<void> {
  const ref = doc(db, COLLECTIONS.SESSIONS, sessionId);
  await deleteDoc(ref);
}

export function subscribeGateways(callback: (gateways: GatewayStatus[]) => void) {
  callback(DEFAULT_GATEWAYS);
  return () => {};
}

export async function seedFirestoreDatabase(): Promise<void> {
  try {
    const userSnapshot = await getDocs(collection(db, COLLECTIONS.USERS));
    console.log(`Firestore connected. Found ${userSnapshot.size} existing users.`);
  } catch (err) {
    console.error('Firestore check error:', err);
  }
}
