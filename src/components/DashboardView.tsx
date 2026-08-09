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
  FileCode
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
import { REVENUE_MONTHLY_DATA } from '../mockData';

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
  const [timeRange, setTimeRange] = useState<'8m' | '1y' | 'ytd'>('8m');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculations
  const totalMRR = subscriptions.reduce((acc, sub) => acc + (sub.status === 'actif' ? sub.price : 0), 0);
  const totalARR = totalMRR * 12;
  const activeSubsCount = subscriptions.filter(s => s.status === 'actif' || s.status === 'expire_bientot').length;
  const urgentTickets = tickets.filter(t => t.priority === 'urgent' && t.status !== 'resolved');
  const pendingTxsCount = transactions.filter(t => t.status === 'pending').length;

  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(val);
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div className="space-y-3.5">
      {/* Top Banner & Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 card-kontrol p-3.5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-[#003050]">
              Tableau de bord
            </h1>
            <span className="badge b-premium text-[10px]">
              KONTROL ERP Admin
            </span>
          </div>
          <p className="text-[11.5px] text-[#7a9ab0] mt-0.5">
            Supervision globale des revenus, utilisateurs, tickets et passerelles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-[#F0F0F0] p-1 rounded-[6px] border border-[rgba(0,48,80,0.12)] flex items-center text-[11.5px] font-medium">
            <button
              onClick={() => setTimeRange('8m')}
              className={`px-2 py-0.5 rounded-[4px] transition-all cursor-pointer ${timeRange === '8m' ? 'bg-white text-[#003050] font-bold shadow-xs' : 'text-[#7a9ab0] hover:text-[#0d1f2d]'}`}
            >
              8 Mois
            </button>
            <button
              onClick={() => setTimeRange('1y')}
              className={`px-2 py-0.5 rounded-[4px] transition-all cursor-pointer ${timeRange === '1y' ? 'bg-white text-[#003050] font-bold shadow-xs' : 'text-[#7a9ab0] hover:text-[#0d1f2d]'}`}
            >
              Année 2026
            </button>
          </div>

          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="btn btn-ol btn-sm py-1 px-2.5 cursor-pointer"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#50B0E0]' : ''}`} />
          </button>

          <button 
            onClick={onOpenQuickClientModal}
            className="btn btn-or btn-sm py-1 px-2.5 cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            + Ajouter
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* KPI 1: Accent Card (Dark) */}
        <div className="kpi-card accent p-3">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">
              Revenus (MRR)
            </div>
            <div className="w-6 h-6 rounded-[6px] bg-[#50B0E0]/20 text-[#50B0E0] flex items-center justify-center text-xs">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-[19px] sm:text-[21px] font-extrabold text-[#50B0E0] tracking-tight mt-1">
            {formatFCFA(totalMRR)}
          </div>
          <div className="text-[10.5px] text-emerald-400 flex items-center gap-1 font-medium mt-0.5">
            <ArrowUpRight className="w-3 h-3" /> +14.2% vs M-1
          </div>
        </div>

        {/* KPI 2: Abonnés Actifs */}
        <div className="kpi-card p-3">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-semibold text-[#7a9ab0] uppercase tracking-wider">
              Abonnés actifs
            </div>
            <div className="w-6 h-6 rounded-[6px] bg-[#50B0E0]/15 text-[#50B0E0] flex items-center justify-center text-xs">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-[19px] sm:text-[21px] font-extrabold text-[#003050] tracking-tight mt-1">
            {activeSubsCount}
          </div>
          <div className="text-[10.5px] text-[#1a7a45] flex items-center gap-1 font-medium mt-0.5">
            <ArrowUpRight className="w-3 h-3" /> +12 ce mois
          </div>
        </div>

        {/* KPI 3: Orange KPI Card */}
        <div className="kpi-card orange p-3">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">
              Tickets ouverts
            </div>
            <div className="w-6 h-6 rounded-[6px] bg-white/20 text-white flex items-center justify-center text-xs">
              <Headphones className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-[19px] sm:text-[21px] font-extrabold text-white tracking-tight mt-1">
            {tickets.length}
          </div>
          <div className="text-[10.5px] text-white/90 flex items-center gap-1 font-medium mt-0.5">
            {urgentTickets.length} urgents à traiter
          </div>
        </div>

        {/* KPI 4: Paiements en attente */}
        <div className="kpi-card p-3">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-semibold text-[#7a9ab0] uppercase tracking-wider">
              En attente
            </div>
            <div className="w-6 h-6 rounded-[6px] bg-[#fdf0ee] text-[#c0392b] flex items-center justify-center text-xs">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-[19px] sm:text-[21px] font-extrabold text-[#003050] tracking-tight mt-1">
            {pendingTxsCount}
          </div>
          <div className="text-[10.5px] text-[#7a9ab0] mt-0.5 truncate">
            Val. {formatFCFA(pendingTxsCount * 125000)}
          </div>
        </div>
      </div>

      {/* Revenue Evolution & Gateways */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Chart Card */}
        <div className="lg:col-span-2 card-kontrol p-3.5">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-[rgba(0,48,80,0.12)]">
            <div>
              <div className="text-[13px] font-bold text-[#003050]">
                Évolution du Revenu Mensuel (MRR)
              </div>
              <div className="text-[11px] text-[#7a9ab0]">
                Progression des souscriptions en FCFA (XOF)
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#50B0E0]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#50B0E0]" />
              MRR
            </div>
          </div>

          <div className="h-48 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_MONTHLY_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
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
                  tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
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

        {/* Gateways Breakdown */}
        <div className="card-kontrol p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-[rgba(0,48,80,0.12)]">
              <div className="text-[13px] font-bold text-[#003050]">
                Passerelles de Paiement
              </div>
              <span className="badge b-standard text-[10px]">Volume 24h</span>
            </div>

            <div className="space-y-2">
              {gateways.map((gw) => {
                const percent = Math.round((gw.volume24h / 79800000) * 100);
                return (
                  <div key={gw.key} className="p-2 rounded-[6px] bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)]">
                    <div className="flex items-center justify-between text-[11.5px] font-bold text-[#0d1f2d] mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${gw.status === 'operational' ? 'bg-[#1a7a45]' : 'bg-[#b35a00]'}`} />
                        <span>{gw.name}</span>
                      </div>
                      <span className="font-mono text-[#003050] text-[11px]">{formatFCFA(gw.volume24h)}</span>
                    </div>
                    <div className="w-full bg-[#FFFFFF] h-1.5 rounded-full overflow-hidden border border-[rgba(0,48,80,0.1)]">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          gw.key === 'orange_money' ? 'bg-[#E06020]' :
                          gw.key === 'mtn_money' ? 'bg-[#b35a00]' : 'bg-[#50B0E0]'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
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
            Gérer les passerelles
          </button>
        </div>
      </div>

      {/* Tables & Tickets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Recent Transactions */}
        <div className="card-kontrol overflow-hidden">
          <div className="p-3 border-b border-[rgba(0,48,80,0.12)] flex items-center justify-between">
            <div>
              <div className="text-[13px] font-bold text-[#003050]">
                Dernières Transactions
              </div>
              <div className="text-[11px] text-[#7a9ab0]">
                Opérations récentes enregistrées
              </div>
            </div>
            <button 
              onClick={() => onNavigateTab('payments')}
              className="btn btn-ol btn-sm py-0.5 px-2 text-[11px] cursor-pointer"
            >
              Voir tout
            </button>
          </div>

          <div className="divide-y divide-[rgba(0,48,80,0.12)]">
            {transactions.slice(0, 3).map((tx) => (
              <div key={tx.id} className="p-2.5 flex items-center justify-between hover:bg-[#F0F0F0]/50 transition-colors">
                <div>
                  <div className="text-[12.5px] font-semibold text-[#0d1f2d]">{tx.clientName}</div>
                  <div className="text-[10px] text-[#7a9ab0] font-mono">{tx.transactionId}</div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="text-[12.5px] font-bold text-[#003050] font-mono">
                    {formatFCFA(tx.amount)}
                  </div>

                  <span className={`badge text-[9.5px] ${
                    tx.status === 'success' ? 'b-actif' :
                    tx.status === 'pending' ? 'b-attente' : 'badge bg-[#fdf0ee] text-[#c0392b]'
                  }`}>
                    {tx.status === 'success' ? 'Succès' : tx.status === 'pending' ? 'Attente' : 'Échec'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Tickets SLA */}
        <div className="card-kontrol p-3">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-[rgba(0,48,80,0.12)]">
            <div>
              <div className="text-[13px] font-bold text-[#003050]">
                Tickets Support Récents
              </div>
              <div className="text-[11px] text-[#7a9ab0]">
                File d'attente SLA support
              </div>
            </div>
            <button 
              onClick={() => onNavigateTab('support')}
              className="btn btn-ol btn-sm py-0.5 px-2 text-[11px] cursor-pointer"
            >
              Voir tout
            </button>
          </div>

          <div className="space-y-1.5">
            {tickets.slice(0, 3).map((tkt) => (
              <div key={tkt.id} className="p-2 border-b border-[rgba(0,48,80,0.12)] last:border-b-0 flex items-start gap-2.5">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  tkt.priority === 'urgent' ? 'bg-[#c0392b]' : 'bg-[#E06020]'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-semibold text-[#0d1f2d] truncate">
                    {tkt.subject}
                  </div>
                  <div className="text-[10.5px] text-[#7a9ab0] flex items-center gap-1.5 mt-0.5">
                    <span>{tkt.clientName}</span>
                    <span>•</span>
                    <span>{tkt.ticketNumber}</span>
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
        </div>
      </div>

      {/* Actions Rapides */}
      <div className="card-kontrol p-3">
        <div className="text-[12.5px] font-bold text-[#003050] mb-2 pb-1.5 border-b border-[rgba(0,48,80,0.12)]">
          Actions rapides
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={onOpenQuickClientModal} className="btn btn-or btn-sm cursor-pointer">
            <Users className="w-3.5 h-3.5" /> Ajouter utilisateur
          </button>
          <button onClick={() => onNavigateTab('templates')} className="btn btn-dk btn-sm cursor-pointer">
            <FileCode className="w-3.5 h-3.5" /> Nouveau template
          </button>
          <button onClick={() => onNavigateTab('payments')} className="btn btn-ok btn-sm cursor-pointer">
            <CheckCircle2 className="w-3.5 h-3.5" /> Valider paiements
          </button>
          <button onClick={() => onNavigateTab('subscriptions')} className="btn btn-ol btn-sm cursor-pointer">
            Abonnements
          </button>
          <button onClick={() => onNavigateTab('payments')} className="btn btn-ol btn-sm cursor-pointer">
            Exporter données
          </button>
        </div>
      </div>
    </div>
  );
};

