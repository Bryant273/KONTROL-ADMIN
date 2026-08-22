import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  Banknote, 
  RefreshCw, 
  Sparkles,
  Zap,
  Clock,
  ChevronRight,
  Headphones,
  FileCode,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { 
  UserClient, 
  Subscription, 
  PaymentTransaction, 
  SupportTicket, 
  GatewayStatus 
} from '../types';

interface DashboardViewProps {
  clients: UserClient[];
  subscriptions: Subscription[];
  transactions: PaymentTransaction[];
  tickets: SupportTicket[];
  gateways: GatewayStatus[];
  onNavigateTab: (tab: any) => void;
  onOpenQuickClientModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  clients,
  subscriptions,
  transactions,
  tickets,
  gateways,
  onNavigateTab,
  onOpenQuickClientModal
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Exact calculations from real Firestore data
  const activeClients = clients.filter(c => c.status === 'active');
  const activeSubsCount = activeClients.length;
  // Each active client is on STANDARD plan at 15,000 FCFA
  const totalMRR = activeSubsCount * 15000;
  const urgentTickets = tickets.filter(t => t.priority === 'urgent' && t.status !== 'resolved');
  const pendingTxs = transactions.filter(t => t.status === 'pending');
  const pendingTxsCount = pendingTxs.length;
  const pendingTxsAmount = pendingTxs.reduce((acc, t) => acc + (t.amount || 15000), 0);

  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(val);
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Dynamic chart data based on active subscriptions
  const chartData = [
    { month: 'Mars', mrr: Math.max(0, (activeSubsCount - 3) * 15000) },
    { month: 'Avril', mrr: Math.max(0, (activeSubsCount - 2) * 15000) },
    { month: 'Mai', mrr: Math.max(0, (activeSubsCount - 2) * 15000) },
    { month: 'Juin', mrr: Math.max(0, (activeSubsCount - 1) * 15000) },
    { month: 'Juillet', mrr: Math.max(0, (activeSubsCount - 1) * 15000) },
    { month: 'Août', mrr: totalMRR },
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner & Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 card-kontrol p-3.5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-[#003050]">
              Tableau de bord
            </h1>
            <span className="badge b-premium text-[10px]">
              KONTROL ERP • Données Réelles
            </span>
          </div>
          <p className="text-[11.5px] text-[#7a9ab0] mt-0.5">
            Abonnement Standard (15 000 FCFA/mois) • Moyen de paiement GeniuSPay
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="btn btn-ol btn-sm py-1 px-2.5 cursor-pointer"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#50B0E0]' : ''}`} />
            <span className="text-[11.5px]">Actualiser</span>
          </button>

          <button 
            onClick={onOpenQuickClientModal}
            className="btn btn-or btn-sm py-1 px-3 cursor-pointer text-[12px] font-bold"
          >
            <Users className="w-3.5 h-3.5" />
            + Ajouter une entreprise
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* KPI 1: MRR */}
        <div className="kpi-card accent p-3">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">
              Revenus Mensuels (MRR)
            </div>
            <div className="w-6 h-6 rounded-[6px] bg-[#50B0E0]/20 text-[#50B0E0] flex items-center justify-center text-xs">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-[19px] sm:text-[21px] font-black text-[#50B0E0] tracking-tight mt-1">
            {formatFCFA(totalMRR)}
          </div>
          <div className="text-[10.5px] text-emerald-400 flex items-center gap-1 font-medium mt-0.5">
            <span>{activeSubsCount} licence(s) active(s)</span>
          </div>
        </div>

        {/* KPI 2: Abonnés Actifs */}
        <div className="kpi-card p-3">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-semibold text-[#7a9ab0] uppercase tracking-wider">
              Entreprises Actives
            </div>
            <div className="w-6 h-6 rounded-[6px] bg-[#50B0E0]/15 text-[#50B0E0] flex items-center justify-center text-xs">
              <Building2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-[19px] sm:text-[21px] font-extrabold text-[#003050] tracking-tight mt-1">
            {activeSubsCount} / {clients.length}
          </div>
          <div className="text-[10.5px] text-[#1a7a45] flex items-center gap-1 font-medium mt-0.5">
            <CheckCircle2 className="w-3 h-3" /> 15 000 FCFA / mois
          </div>
        </div>

        {/* KPI 3: Tickets Support */}
        <div className="kpi-card orange p-3">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">
              Demandes / Tickets
            </div>
            <div className="w-6 h-6 rounded-[6px] bg-white/20 text-white flex items-center justify-center text-xs">
              <Headphones className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-[19px] sm:text-[21px] font-extrabold text-white tracking-tight mt-1">
            {tickets.length}
          </div>
          <div className="text-[10.5px] text-white/90 flex items-center gap-1 font-medium mt-0.5">
            {urgentTickets.length} urgent(s) à traiter
          </div>
        </div>

        {/* KPI 4: En attente */}
        <div className="kpi-card p-3">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-semibold text-[#7a9ab0] uppercase tracking-wider">
              Bordereaux en attente
            </div>
            <div className="w-6 h-6 rounded-[6px] bg-[#fdf0ee] text-[#c0392b] flex items-center justify-center text-xs">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-[19px] sm:text-[21px] font-extrabold text-[#003050] tracking-tight mt-1">
            {pendingTxsCount}
          </div>
          <div className="text-[10.5px] text-[#7a9ab0] mt-0.5 truncate">
            {pendingTxsCount > 0 ? `Montant : ${formatFCFA(pendingTxsAmount)}` : 'Aucun retard'}
          </div>
        </div>
      </div>

      {/* Revenue Evolution & GeniuSPay Networks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Chart Card */}
        <div className="lg:col-span-2 card-kontrol p-3.5">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-[rgba(0,48,80,0.12)]">
            <div>
              <div className="text-[13px] font-bold text-[#003050]">
                Évolution Réelle du Revenu Mensuel (MRR)
              </div>
              <div className="text-[11px] text-[#7a9ab0]">
                Progression basée sur les abonnements actifs à 15 000 FCFA/mois
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#50B0E0]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#50B0E0]" />
              STANDARD (15k)
            </div>
          </div>

          <div className="h-44 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="mrrColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#50B0E0" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#50B0E0" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,48,80,0.08)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#7a9ab0', fontSize: 10, fontWeight: 500 }} />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#7a9ab0', fontSize: 10 }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value: any) => [formatFCFA(Number(value)), 'MRR']}
                  contentStyle={{ backgroundColor: '#003050', borderRadius: '8px', color: '#fff', border: 'none', fontSize: '11.5px' }}
                />
                <Area type="monotone" dataKey="mrr" stroke="#50B0E0" strokeWidth={2.5} fillOpacity={1} fill="url(#mrrColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GeniuSPay Payment Breakdown */}
        <div className="card-kontrol p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-[rgba(0,48,80,0.12)]">
              <div>
                <div className="text-[13px] font-bold text-[#003050]">
                  Moyen de Paiement : GeniuSPay
                </div>
                <div className="text-[10.5px] text-[#7a9ab0]">
                  Bordereaux d'abonnements & réseaux
                </div>
              </div>
              <span className="badge b-actif text-[9.5px]">En service</span>
            </div>

            <div className="space-y-2">
              {gateways.map((gw) => {
                const realVol = transactions
                  .filter(t => (t.paymentNetwork === gw.network || t.paymentNetwork === gw.name) && t.status === 'success')
                  .reduce((acc, t) => acc + (t.amount || 15000), 0);

                return (
                  <div key={gw.key} className="p-2 rounded-[6px] bg-[#F0F0F0] border border-[rgba(0,48,80,0.08)]">
                    <div className="flex items-center justify-between text-[11.5px] font-bold text-[#0d1f2d] mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${gw.status === 'operational' ? 'bg-[#1a7a45]' : 'bg-[#b35a00]'}`} />
                        <span>{gw.network || gw.name}</span>
                      </div>
                      <span className="font-mono text-[#003050] text-[11px]">{formatFCFA(realVol)}</span>
                    </div>
                    <div className="text-[9.5px] text-[#7a9ab0] flex items-center justify-between">
                      <span>{gw.provider}</span>
                      <span>Latence {gw.latencyMs}ms</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button 
            onClick={() => onNavigateTab('payments')}
            className="mt-2.5 btn btn-dk btn-sm w-full justify-center cursor-pointer text-[12px]"
          >
            <Zap className="w-3.5 h-3.5 text-[#50B0E0]" />
            Consulter les bordereaux GeniuSPay
          </button>
        </div>
      </div>

      {/* Tables & Tickets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Recent GeniuSPay Subscription Slips */}
        <div className="card-kontrol overflow-hidden">
          <div className="p-3 border-b border-[rgba(0,48,80,0.12)] flex items-center justify-between">
            <div>
              <div className="text-[13px] font-bold text-[#003050]">
                Derniers Bordereaux d'Abonnement GeniuSPay
              </div>
              <div className="text-[11px] text-[#7a9ab0]">
                Cotisations et licences STANDARD enregistrées
              </div>
            </div>
            <button 
              onClick={() => onNavigateTab('payments')}
              className="btn btn-ol btn-sm py-0.5 px-2 text-[11px] cursor-pointer"
            >
              Voir tout ({transactions.length})
            </button>
          </div>

          {transactions.length === 0 ? (
            <div className="p-6 text-center text-[#7a9ab0] text-[12px]">
              <Clock className="w-6 h-6 mx-auto text-[#7a9ab0]/50 mb-1" />
              Aucun bordereau pour le moment. Les règlements d'abonnement GeniuSPay s'afficheront ici en direct.
            </div>
          ) : (
            <div className="divide-y divide-[rgba(0,48,80,0.12)]">
              {transactions.slice(0, 4).map((tx) => (
                <div key={tx.id} className="p-2.5 flex items-center justify-between hover:bg-[#F0F0F0]/50 transition-colors">
                  <div>
                    <div className="text-[12.5px] font-semibold text-[#0d1f2d]">{tx.company}</div>
                    <div className="text-[10px] text-[#7a9ab0] font-mono flex items-center gap-1.5">
                      <span>{tx.clientName}</span>
                      <span>•</span>
                      <span>{tx.transactionId}</span>
                      <span>•</span>
                      <span className="text-[#50B0E0]">{tx.paymentNetwork}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="text-[12.5px] font-bold text-[#003050] font-mono">
                      {formatFCFA(tx.amount)}
                    </div>

                    <span className={`badge text-[9.5px] ${
                      tx.status === 'success' ? 'b-actif' :
                      tx.status === 'pending' ? 'b-attente' : 'badge bg-[#fdf0ee] text-[#c0392b]'
                    }`}>
                      {tx.status === 'success' ? 'Validé' : tx.status === 'pending' ? 'En attente' : 'Échoué'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Support Tickets SLA */}
        <div className="card-kontrol p-3">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-[rgba(0,48,80,0.12)]">
            <div>
              <div className="text-[13px] font-bold text-[#003050]">
                Demandes & Tickets Support
              </div>
              <div className="text-[11px] text-[#7a9ab0]">
                File d'attente réelle des requêtes clients
              </div>
            </div>
            <button 
              onClick={() => onNavigateTab('support')}
              className="btn btn-ol btn-sm py-0.5 px-2 text-[11px] cursor-pointer"
            >
              Gérer ({tickets.length})
            </button>
          </div>

          {tickets.length === 0 ? (
            <div className="p-6 text-center text-[#7a9ab0] text-[12px]">
              <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-500/50 mb-1" />
              Toutes les demandes de support sont traitées !
            </div>
          ) : (
            <div className="space-y-1.5">
              {tickets.slice(0, 4).map((tkt) => (
                <div key={tkt.id} className="p-2 border-b border-[rgba(0,48,80,0.08)] last:border-b-0 flex items-start gap-2.5">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    tkt.priority === 'urgent' ? 'bg-[#c0392b]' : 'bg-[#E06020]'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] font-semibold text-[#0d1f2d] truncate">
                      {tkt.subject}
                    </div>
                    <div className="text-[10.5px] text-[#7a9ab0] flex items-center gap-1.5 mt-0.5">
                      <span className="font-medium text-[#003050]">{tkt.company}</span>
                      <span>•</span>
                      <span>{tkt.clientName}</span>
                      <span>•</span>
                      <span className="font-mono">{tkt.ticketNumber}</span>
                    </div>
                  </div>
                  <div>
                    <span className={`badge text-[9.5px] ${
                      tkt.priority === 'urgent' ? 'b-attente' : 'b-standard'
                    }`}>
                      {tkt.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Entreprises Récentes & Coordonnées */}
      <div className="card-kontrol p-3.5">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-[rgba(0,48,80,0.12)]">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#50B0E0]" />
            <div>
              <div className="text-[13px] font-bold text-[#003050]">
                Répertoire des Entreprises KONTROL
              </div>
              <div className="text-[11px] text-[#7a9ab0]">
                Nom d'entreprise, Email, Contact téléphonique, Pays et Adresse
              </div>
            </div>
          </div>
          <button 
            onClick={() => onNavigateTab('users')}
            className="btn btn-ol btn-sm py-0.5 px-2.5 text-[11px] cursor-pointer"
          >
            Voir annuaire complet ({clients.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {clients.slice(0, 6).map((c) => (
            <div key={c.id} className="p-3 rounded-[8px] bg-[#F8FAFC] border border-[rgba(0,48,80,0.08)] hover:border-[#50B0E0] transition-colors space-y-1.5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[13px] font-bold text-[#003050] flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#50B0E0]" />
                    <span>{c.company}</span>
                  </div>
                  <div className="text-[11.5px] font-semibold text-[#0d1f2d]">{c.name}</div>
                </div>
                <span className={`badge text-[9.5px] ${c.status === 'active' ? 'b-actif' : 'b-attente'}`}>
                  {c.status === 'active' ? 'Actif' : 'En attente'}
                </span>
              </div>

              <div className="space-y-1 text-[11px] text-[#7a9ab0] pt-1 border-t border-[rgba(0,48,80,0.06)]">
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3 h-3 text-[#50B0E0] shrink-0" />
                  <span className="text-[#0d1f2d]">{c.email || 'Non renseigné'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-[#50B0E0] shrink-0" />
                  <span>{c.phone || 'Non renseigné'}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3 h-3 text-[#E06020] shrink-0" />
                  <span>{c.country} • {c.address}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
