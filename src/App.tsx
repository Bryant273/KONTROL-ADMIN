import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { UsersView } from './components/UsersView';
import { SubscriptionsView } from './components/SubscriptionsView';
import { PaymentsView } from './components/PaymentsView';
import { TemplatesView } from './components/TemplatesView';
import { SupportView } from './components/SupportView';
import { AuditView } from './components/AuditView';
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
  UserRole 
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
  GATEWAYS_STATUS 
} from './mockData';

export default function App() {
  // Navigation & Role
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('super_admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // App Centralized State
  const [clients, setClients] = useState<UserClient[]>(INITIAL_CLIENTS);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);
  const [plans, setPlans] = useState<PlanDefinition[]>(INITIAL_PLANS);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(INITIAL_TRANSACTIONS);
  const [templates, setTemplates] = useState<TemplateItem[]>(INITIAL_TEMPLATES);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>(INITIAL_SESSIONS);
  const [gateways, setGateways] = useState<GatewayStatus[]>(GATEWAYS_STATUS);

  // Quick Client Creation Modal flag
  const [quickClientModalOpen, setQuickClientModalOpen] = useState(false);

  // Computed metrics
  const pendingTicketsCount = tickets.filter(t => t.priority === 'urgent' && t.status !== 'resolved').length;
  const expiringSubsCount = subscriptions.filter(s => s.daysRemaining <= 7 && s.status !== 'suspendu').length;

  // Handlers for Clients
  const handleAddClient = (newClientData: Omit<UserClient, 'id' | 'createdAt' | 'lastLogin' | 'ip' | 'loginHistory'>) => {
    const newId = `usr_${String(clients.length + 1).padStart(2, '0')}`;
    const newClientObj: UserClient = {
      ...newClientData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'A l\'instant',
      ip: '197.224.12.1',
      loginHistory: [
        {
          date: new Date().toISOString().replace('T', ' ').substring(0, 19),
          ip: '197.224.12.1',
          device: 'Chrome Admin Session',
          location: 'Dakar, SN',
          status: 'success'
        }
      ]
    };

    setClients([newClientObj, ...clients]);

    // Automatically create a subscription record
    const newSub: Subscription = {
      id: `sub_${Date.now().toString().slice(-3)}`,
      userId: newId,
      userName: newClientData.name,
      userEmail: newClientData.email,
      company: newClientData.company,
      planName: newClientData.plan,
      price: newClientData.mrr,
      billingCycle: 'mensuel',
      status: 'actif',
      startDate: new Date().toISOString().split('T')[0],
      nextBillingDate: new Date(Date.now() + 30*24*3600*1000).toISOString().split('T')[0],
      autoRenew: true,
      paymentChannel: newClientData.paymentMethod,
      daysRemaining: 30
    };
    setSubscriptions([newSub, ...subscriptions]);

    // Append Audit Log
    addAuditLog('CLIENT_CREATED', `${newClientData.name} (${newClientData.company})`, 'info');
  };

  const handleUpdateClient = (updatedClient: UserClient) => {
    setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
    addAuditLog('CLIENT_UPDATED', `${updatedClient.name} - Statut: ${updatedClient.status}`, 'warning');
  };

  const handleDeleteClient = (clientId: string) => {
    const target = clients.find(c => c.id === clientId);
    setClients(clients.filter(c => c.id !== clientId));
    if (target) {
      addAuditLog('CLIENT_DELETED', target.name, 'alert');
    }
  };

  // Handlers for Subscriptions
  const handleUpdateSubscription = (updatedSub: Subscription) => {
    setSubscriptions(subscriptions.map(s => s.id === updatedSub.id ? updatedSub : s));
    addAuditLog('SUBSCRIPTION_MODIFIED', `${updatedSub.company} -> ${updatedSub.planName}`, 'info');
  };

  const handleUpdatePlan = (updatedPlan: PlanDefinition) => {
    setPlans(plans.map(p => p.id === updatedPlan.id ? updatedPlan : p));
    addAuditLog('PLAN_PRICING_UPDATED', `${updatedPlan.name} -> ${updatedPlan.priceMonthly} FCFA`, 'warning');
  };

  const handleTriggerRenewalAlert = (sub: Subscription) => {
    addAuditLog('RENEWAL_ALERT_SENT', `Email relance envoyé à ${sub.userEmail}`, 'info');
  };

  // Handlers for Payments & Gateways
  const handleToggleGatewayMode = (key: string) => {
    setGateways(gateways.map(g => g.key === key ? { ...g, mode: g.mode === 'live' ? 'sandbox' : 'live' } : g));
    addAuditLog('GATEWAY_MODE_TOGGLE', `Gateway ${key} basculé`, 'warning');
  };

  const handleRetryTransaction = (txId: string) => {
    setTransactions(transactions.map(t => t.id === txId ? { ...t, status: 'success' } : t));
    addAuditLog('TRANSACTION_REPLAYED', `Tx ID: ${txId}`, 'info');
  };

  const handleRefundTransaction = (txId: string) => {
    setTransactions(transactions.map(t => t.id === txId ? { ...t, status: 'refunded' } : t));
    addAuditLog('TRANSACTION_REFUNDED', `Tx ID: ${txId}`, 'alert');
  };

  // Handlers for Templates
  const handleUpdateTemplate = (updatedTpl: TemplateItem) => {
    setTemplates(templates.map(t => t.id === updatedTpl.id ? updatedTpl : t));
    addAuditLog('TEMPLATE_VERSION_PUBLISHED', `${updatedTpl.title} (${updatedTpl.currentVersion})`, 'info');
  };

  // Handlers for Tickets
  const handleUpdateTicket = (updatedTkt: SupportTicket) => {
    setTickets(tickets.map(t => t.id === updatedTkt.id ? updatedTkt : t));
    addAuditLog('TICKET_STATE_CHANGED', `${updatedTkt.ticketNumber} -> ${updatedTkt.status}`, 'info');
  };

  // Handlers for Sessions
  const handleRevokeSession = (sessionId: string) => {
    setActiveSessions(activeSessions.filter(s => s.id !== sessionId));
    addAuditLog('ADMIN_SESSION_REVOKED', `Session ID: ${sessionId}`, 'alert');
  };

  // Audit Log helper
  const addAuditLog = (action: string, target: string, severity: 'info' | 'warning' | 'alert') => {
    const newLog: AuditLog = {
      id: `log_${Date.now().toString().slice(-3)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: currentRole === 'super_admin' ? 'admin.super@kontrol.io' : 'admin.session@kontrol.io',
      actorRole: currentRole,
      action,
      target,
      ip: '197.224.12.1',
      severity,
      hashSignature: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
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
      />

      {/* Main Content Area */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 gap-4 sm:gap-6">
        {/* Left Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          pendingTicketsCount={pendingTicketsCount}
          expiringSubscriptionsCount={expiringSubsCount}
          totalUsersCount={clients.length}
          mobileMenuOpen={mobileMenuOpen}
          onCloseMobileMenu={() => setMobileMenuOpen(false)}
        />

        {/* Dynamic View Router */}
        <main className={`flex-1 min-w-0 w-full overflow-hidden sm:overflow-visible transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-40 blur-[1px] pointer-events-none lg:opacity-100 lg:blur-none lg:pointer-events-auto' : 'opacity-100'
        }`}>
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
            />
          )}

          {activeTab === 'audit' && (
            <AuditView
              auditLogs={auditLogs}
              activeSessions={activeSessions}
              onRevokeSession={handleRevokeSession}
            />
          )}
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

      {/* Bottom Bar (Status/Audit) - Responsive Footer */}
      <footer className="bg-slate-50 border-t border-[rgba(0,48,80,0.12)] px-4 sm:px-8 py-2 sm:py-0 h-auto sm:h-8 flex flex-col sm:flex-row items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest shrink-0 font-mono gap-1 text-center sm:text-left">
        <div>Dernier audit : {new Date().toLocaleDateString('fr-FR')} — Chiffrement AES-256 Actif</div>
        <div className="flex items-center gap-2">
          <span>Serveur : Production-01</span>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </footer>
    </div>
  );
}
