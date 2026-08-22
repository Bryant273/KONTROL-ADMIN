import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { UsersView } from './components/UsersView';
import { SubscriptionsView } from './components/SubscriptionsView';
import { PaymentsView } from './components/PaymentsView';
import { TemplatesView } from './components/TemplatesView';
import { SupportView } from './components/SupportView';
import { AdminUsersView } from './components/AdminUsersView';
import { AuditView } from './components/AuditView';
import { DataExplorerView } from './components/DataExplorerView';
import { AssistantGuide } from './components/AssistantGuide';

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
  UserRole,
  AdminUser
} from './types';

import { 
  INITIAL_CLIENTS, 
  INITIAL_SUBSCRIPTIONS, 
  INITIAL_PLANS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_TEMPLATES, 
  INITIAL_TICKETS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_SESSIONS, 
  GATEWAYS_STATUS,
  INITIAL_ADMIN_USERS
} from './mockData';

import {
  seedFirestoreDatabase,
  subscribeUsers,
  subscribeSubscriptions,
  subscribeTransactions,
  subscribeTickets,
  subscribeTemplates,
  subscribeAuditLogs,
  subscribeSessions,
  createFirestoreUser,
  updateFirestoreUser,
  deleteFirestoreUser,
  createFirestoreSubscription,
  updateFirestoreSubscription,
  updateFirestoreTransaction,
  createGeniuSPayTransaction,
  createFirestoreTicket,
  updateFirestoreTicket,
  updateFirestoreTemplate,
  logFirestoreAuditEvent,
  revokeFirestoreSession,
  STANDARD_PLAN,
  DEFAULT_GATEWAYS
} from './services/firebaseService';

export default function App() {
  // Navigation & Role
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('super_admin');
  const [currentUserName] = useState<string>('Amadou Diallo');
  const [searchQuery, setSearchQuery] = useState('');
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // App Centralized State (Synchronized with Firestore)
  const [clients, setClients] = useState<UserClient[]>(INITIAL_CLIENTS);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);
  const [plans, setPlans] = useState<PlanDefinition[]>([STANDARD_PLAN]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(INITIAL_TRANSACTIONS);
  const [templates, setTemplates] = useState<TemplateItem[]>(INITIAL_TEMPLATES);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>(INITIAL_SESSIONS);
  const [gateways, setGateways] = useState<GatewayStatus[]>(DEFAULT_GATEWAYS);

  // Real-time Firestore Connection Lifecycle
  useEffect(() => {
    let unsubs: (() => void)[] = [];

    async function initFirestore() {
      try {
        await seedFirestoreDatabase();

        const u1 = subscribeUsers((data) => {
          if (data && data.length > 0) setClients(data);
        });
        const u2 = subscribeSubscriptions((data) => {
          if (data && data.length > 0) setSubscriptions(data);
        });
        const u3 = subscribeTransactions((data) => {
          if (data && data.length > 0) setTransactions(data);
        });
        const u4 = subscribeTickets((data) => {
          if (data && data.length > 0) setTickets(data);
        });
        const u5 = subscribeTemplates((data) => {
          if (data && data.length > 0) {
            setTemplates(data);
          }
        });
        const u6 = subscribeAuditLogs((data) => {
          if (data && data.length > 0) setAuditLogs(data);
        });
        const u7 = subscribeSessions((data) => {
          if (data && data.length > 0) setActiveSessions(data);
        });

        unsubs = [u1, u2, u3, u4, u5, u6, u7];
      } catch (err) {
        console.error('Firebase initialization error:', err);
      }
    }

    initFirestore();

    return () => {
      unsubs.forEach(unsub => unsub && unsub());
    };
  }, []);

  // Computed metrics
  const pendingTicketsCount = tickets.filter(t => t.priority === 'urgent' && t.status !== 'resolved').length;
  const expiringSubsCount = subscriptions.filter(s => s.daysRemaining <= 7 && s.status !== 'suspendu').length;

  // Handlers for Clients (Writing to Firestore)
  const handleAddClient = async (newClientData: Omit<UserClient, 'id' | 'createdAt' | 'lastLogin' | 'loginHistory'>) => {
    const newId = `usr_${Date.now().toString().slice(-6)}`;
    const newClientObj: UserClient = {
      ...newClientData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'En ligne',
      plan: 'STANDARD',
      mrr: 15000,
      paymentMethod: newClientData.paymentMethod || 'orange_money'
    };

    try {
      await createFirestoreUser(newClientObj);
      setClients([newClientObj, ...clients]);

      // Automatically create a subscription record
      const newSub: Subscription = {
        id: `sub_${newId}`,
        userId: newId,
        userName: newClientData.name || newClientData.company,
        userEmail: newClientData.email,
        company: newClientData.company,
        planName: 'STANDARD',
        price: 15000,
        billingCycle: 'mensuel',
        status: 'actif',
        startDate: new Date().toISOString().split('T')[0],
        nextBillingDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
        autoRenew: true,
        paymentChannel: newClientData.paymentMethod || 'orange_money',
        daysRemaining: 30,
        country: newClientData.country,
        address: newClientData.address
      };
      await createFirestoreSubscription(newSub);
      setSubscriptions([newSub, ...subscriptions]);

      // Automatically create initial GeniuSPay subscription transaction slip
      await createGeniuSPayTransaction({
        clientName: newClientData.name || newClientData.company,
        company: newClientData.company,
        amount: 15000,
        paymentNetwork: newClientData.paymentMethod === 'orange_money' ? 'Orange Money' : newClientData.paymentMethod === 'mtn_money' ? 'MTN Mobile Money' : newClientData.paymentMethod === 'wave' ? 'Wave' : 'Orange Money',
        userId: newId
      });

      addAuditLog('CLIENT_CREATED', `${newClientData.company} (${newClientData.name}) - Forfait STANDARD 15 000 FCFA`, 'info');
    } catch (e) {
      console.error('Error adding client:', e);
      setClients([newClientObj, ...clients]);
    }
  };

  const handleUpdateClient = async (updatedClient: UserClient) => {
    try {
      await updateFirestoreUser(updatedClient.id, updatedClient);
      setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
      addAuditLog('CLIENT_UPDATED', `${updatedClient.company} - Statut: ${updatedClient.status}`, 'warning');
    } catch (e) {
      console.error('Error updating client in Firestore:', e);
      setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    const target = clients.find(c => c.id === clientId);
    try {
      await deleteFirestoreUser(clientId);
      setClients(clients.filter(c => c.id !== clientId));
      if (target) {
        addAuditLog('CLIENT_DELETED', target.company || target.name, 'alert');
      }
    } catch (e) {
      console.error('Error deleting client in Firestore:', e);
      setClients(clients.filter(c => c.id !== clientId));
    }
  };

  // Handlers for Subscriptions
  const handleUpdateSubscription = async (updatedSub: Subscription) => {
    try {
      await updateFirestoreSubscription(updatedSub.id, updatedSub);
      setSubscriptions(subscriptions.map(s => s.id === updatedSub.id ? updatedSub : s));
      addAuditLog('SUBSCRIPTION_MODIFIED', `${updatedSub.company} -> ${updatedSub.planName} (15 000 FCFA)`, 'info');
    } catch (e) {
      console.error('Error updating subscription:', e);
      setSubscriptions(subscriptions.map(s => s.id === updatedSub.id ? updatedSub : s));
    }
  };

  const handleUpdatePlan = (updatedPlan: PlanDefinition) => {
    setPlans(plans.map(p => p.id === updatedPlan.id ? updatedPlan : p));
    addAuditLog('PLAN_PRICING_UPDATED', `${updatedPlan.name} -> ${updatedPlan.priceMonthly} FCFA`, 'warning');
  };

  const handleTriggerRenewalAlert = (sub: Subscription) => {
    addAuditLog('RENEWAL_ALERT_SENT', `Relance GeniuSPay envoyée à ${sub.company} (${sub.userEmail})`, 'info');
  };

  // Handlers for Payments & Gateways
  const handleToggleGatewayMode = (key: string) => {
    setGateways(gateways.map(g => g.key === key ? { ...g, mode: g.mode === 'live' ? 'sandbox' : 'live' } : g));
    addAuditLog('GATEWAY_MODE_TOGGLE', `Passerelle ${key} basculée`, 'warning');
  };

  const handleNewGeniuSPayTransaction = async (txData: {
    clientName: string;
    company: string;
    amount: number;
    paymentNetwork: 'Orange Money' | 'MTN Mobile Money' | 'Wave' | 'Carte Bancaire';
  }) => {
    try {
      const createdTx = await createGeniuSPayTransaction({
        clientName: txData.clientName,
        company: txData.company,
        amount: txData.amount || 15000,
        paymentNetwork: txData.paymentNetwork
      });
      setTransactions([createdTx, ...transactions]);
      addAuditLog('TRANSACTION_CREATED', `${createdTx.transactionId} - ${txData.company} (${txData.amount} FCFA)`, 'info');
    } catch (e) {
      console.error('Error creating GeniuSPay transaction:', e);
    }
  };

  const handleRetryTransaction = async (txId: string) => {
    try {
      await updateFirestoreTransaction(txId, { status: 'success' });
      setTransactions(transactions.map(t => t.id === txId ? { ...t, status: 'success' } : t));
      addAuditLog('TRANSACTION_REPLAYED', `Tx ID: ${txId}`, 'info');
    } catch (e) {
      setTransactions(transactions.map(t => t.id === txId ? { ...t, status: 'success' } : t));
    }
  };

  const handleRefundTransaction = async (txId: string) => {
    try {
      await updateFirestoreTransaction(txId, { status: 'refunded' });
      setTransactions(transactions.map(t => t.id === txId ? { ...t, status: 'refunded' } : t));
      addAuditLog('TRANSACTION_REFUNDED', `Tx ID: ${txId}`, 'alert');
    } catch (e) {
      setTransactions(transactions.map(t => t.id === txId ? { ...t, status: 'refunded' } : t));
    }
  };

  // Handlers for Templates
  const handleUpdateTemplate = async (updatedTpl: TemplateItem) => {
    try {
      await updateFirestoreTemplate(updatedTpl.id, updatedTpl);
      setTemplates(templates.map(t => t.id === updatedTpl.id ? updatedTpl : t));
      addAuditLog('TEMPLATE_VERSION_PUBLISHED', `${updatedTpl.title} (${updatedTpl.currentVersion})`, 'info');
    } catch (e) {
      setTemplates(templates.map(t => t.id === updatedTpl.id ? updatedTpl : t));
    }
  };

  // Handlers for Tickets
  const handleAddTicket = async (newTkt: SupportTicket) => {
    try {
      await createFirestoreTicket(newTkt);
      setTickets([newTkt, ...tickets]);
      addAuditLog('TICKET_CREATED', `${newTkt.ticketNumber} - ${newTkt.company} (${newTkt.subject})`, 'info');
    } catch (e) {
      console.error('Error adding ticket:', e);
      setTickets([newTkt, ...tickets]);
    }
  };

  const handleUpdateTicket = async (updatedTkt: SupportTicket) => {
    try {
      await updateFirestoreTicket(updatedTkt.id, updatedTkt);
      setTickets(tickets.map(t => t.id === updatedTkt.id ? updatedTkt : t));
      addAuditLog('TICKET_STATE_CHANGED', `${updatedTkt.ticketNumber} -> ${updatedTkt.status}`, 'info');
    } catch (e) {
      setTickets(tickets.map(t => t.id === updatedTkt.id ? updatedTkt : t));
    }
  };

  // Handlers for Admin Users
  const handleAddAdminUser = (newAdmin: AdminUser) => {
    setAdminUsers([newAdmin, ...adminUsers]);
    addAuditLog('ADMIN_USER_CREATED', `${newAdmin.name} (${newAdmin.email}) - Rôle: ${newAdmin.role}`, 'info');
  };

  const handleUpdateAdminUser = (updatedAdmin: AdminUser) => {
    setAdminUsers(adminUsers.map(a => a.id === updatedAdmin.id ? updatedAdmin : a));
    addAuditLog('ADMIN_USER_UPDATED', `${updatedAdmin.name} - Statut: ${updatedAdmin.status}`, 'warning');
  };

  const handleDeleteAdminUser = (adminId: string) => {
    const target = adminUsers.find(a => a.id === adminId);
    setAdminUsers(adminUsers.filter(a => a.id !== adminId));
    if (target) {
      addAuditLog('ADMIN_USER_REVOKED', `${target.name} (${target.email})`, 'alert');
    }
  };

  // Handlers for Sessions
  const handleRevokeSession = async (sessionId: string) => {
    try {
      await revokeFirestoreSession(sessionId);
      setActiveSessions(activeSessions.filter(s => s.id !== sessionId));
      addAuditLog('ADMIN_SESSION_REVOKED', `Session ID: ${sessionId}`, 'alert');
    } catch (e) {
      setActiveSessions(activeSessions.filter(s => s.id !== sessionId));
    }
  };

  // Audit Log helper (writes to Firestore)
  const addAuditLog = async (action: string, target: string, severity: 'info' | 'warning' | 'alert') => {
    const newLog: AuditLog = {
      id: `log_${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: `${currentUserName} (${currentRole})`,
      actorRole: currentRole,
      action,
      target,
      ip: '197.224.12.1',
      severity,
      hashSignature: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`
    };
    try {
      await logFirestoreAuditEvent(newLog);
      setAuditLogs([newLog, ...auditLogs]);
    } catch (e) {
      setAuditLogs([newLog, ...auditLogs]);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F4F6F9] font-sans antialiased text-[#0F172A]">
      {/* Left Sidebar Navigation (Rock-solid, pinned full-height) */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        pendingTicketsCount={pendingTicketsCount}
        expiringSubscriptionsCount={expiringSubsCount}
        totalUsersCount={clients.length}
        totalAdminUsersCount={adminUsers.length}
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
        currentRole={currentRole}
        userName={currentUserName}
      />

      {/* Main Content Area (Column with Header + Scrollable Views) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          gateways={gateways}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          unreadAlertsCount={pendingTicketsCount + expiringSubsCount}
          onOpenAssistant={() => setAssistantOpen(true)}
          mobileMenuOpen={mobileMenuOpen}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          userName={currentUserName}
        />

        {/* Dynamic View Router inside bounded, stable scroll container */}
        <main className={`flex-1 overflow-y-auto bg-[#F4F6F9] p-3 sm:p-5 lg:p-6 transition-all duration-200 ${
          mobileMenuOpen ? 'opacity-40 blur-[1px] pointer-events-none lg:opacity-100 lg:blur-none lg:pointer-events-auto' : 'opacity-100'
        }`}>
          <div className="max-w-[1560px] mx-auto space-y-4">
            {activeTab === 'dashboard' && (
              <DashboardView
                clients={clients}
                subscriptions={subscriptions}
                transactions={transactions}
                tickets={tickets}
                gateways={gateways}
                onNavigateTab={setActiveTab}
                onOpenQuickClientModal={() => {
                  setActiveTab('users');
                }}
              />
            )}

            {activeTab === 'users' && (
              <UsersView
                clients={clients}
                onUpdateClient={handleUpdateClient}
                onAddClient={handleAddClient}
                onDeleteClient={handleDeleteClient}
              />
            )}

            {activeTab === 'subscriptions' && (
              <SubscriptionsView
                subscriptions={subscriptions}
                plans={plans}
                onUpdateSubscription={handleUpdateSubscription}
                onUpdatePlan={handleUpdatePlan}
                onTriggerRenewalAlert={handleTriggerRenewalAlert}
              />
            )}

            {activeTab === 'payments' && (
              <PaymentsView
                transactions={transactions}
                gateways={gateways}
                onToggleGatewayMode={handleToggleGatewayMode}
                onRetryTransaction={handleRetryTransaction}
                onRefundTransaction={handleRefundTransaction}
                onNewTransaction={handleNewGeniuSPayTransaction}
              />
            )}

            {activeTab === 'templates' && (
              <TemplatesView
                templates={templates}
                onUpdateTemplate={handleUpdateTemplate}
              />
            )}

            {activeTab === 'support' && (
              <SupportView
                tickets={tickets}
                onUpdateTicket={handleUpdateTicket}
                onAddTicket={handleAddTicket}
              />
            )}

            {activeTab === 'admin_team' && (
              <AdminUsersView
                adminUsers={adminUsers}
                onAddAdminUser={handleAddAdminUser}
                onUpdateAdminUser={handleUpdateAdminUser}
                onDeleteAdminUser={handleDeleteAdminUser}
                currentRole={currentRole}
              />
            )}

            {activeTab === 'audit' && (
              <AuditView
                auditLogs={auditLogs}
                activeSessions={activeSessions}
                onRevokeSession={handleRevokeSession}
              />
            )}

            {activeTab === 'data_explorer' && (
              <DataExplorerView
                clients={clients}
                subscriptions={subscriptions}
                transactions={transactions}
                templates={templates}
                tickets={tickets}
                adminUsers={adminUsers}
                auditLogs={auditLogs}
              />
            )}
          </div>
        </main>
      </div>

      {/* Interactive Floating Assistant Guide */}
      <AssistantGuide
        isOpen={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        onNavigateTab={setActiveTab}
        urgentTicketsCount={pendingTicketsCount}
        expiringSubsCount={expiringSubsCount}
      />
    </div>
  );
}
