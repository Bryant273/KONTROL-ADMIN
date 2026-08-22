import React, { useState } from 'react';
import { 
  CreditCard, 
  Check, 
  AlertTriangle, 
  RefreshCw, 
  Zap, 
  TrendingUp, 
  Clock, 
  Edit2, 
  Send, 
  Calendar, 
  Building2,
  ShieldCheck,
  X,
  CheckCircle2,
  Mail,
  MapPin,
  Phone
} from 'lucide-react';
import { Subscription, PlanDefinition, PlanType, PaymentMethod } from '../types';

interface SubscriptionsViewProps {
  subscriptions: Subscription[];
  plans: PlanDefinition[];
  onUpdateSubscription: (sub: Subscription) => void;
  onUpdatePlan: (plan: PlanDefinition) => void;
  onTriggerRenewalAlert: (sub: Subscription) => void;
}

export const SubscriptionsView: React.FC<SubscriptionsViewProps> = ({
  subscriptions,
  plans,
  onUpdateSubscription,
  onUpdatePlan,
  onTriggerRenewalAlert
}) => {
  const [selectedSubForRenew, setSelectedSubForRenew] = useState<Subscription | null>(null);

  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(val);
  };

  const handleManualRenew = (sub: Subscription) => {
    // Extend next billing date by 1 month (30 days) safely
    let baseDate = new Date();
    if (sub.nextBillingDate) {
      const clean = sub.nextBillingDate.includes(' ') && !sub.nextBillingDate.includes('T')
        ? sub.nextBillingDate.replace(' ', 'T')
        : sub.nextBillingDate;
      const parsed = new Date(clean);
      if (!isNaN(parsed.getTime())) {
        baseDate = parsed;
      }
    }
    baseDate.setMonth(baseDate.getMonth() + 1);
    const newDateStr = !isNaN(baseDate.getTime())
      ? baseDate.toISOString().split('T')[0]
      : new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0];

    onUpdateSubscription({
      ...sub,
      status: 'actif',
      nextBillingDate: newDateStr,
      daysRemaining: 30
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 card-kontrol p-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[#003050]">
              Abonnements & Licences STANDARD KONTROL
            </h1>
            <span className="badge b-premium font-bold">
              15 000 FCFA / mois
            </span>
          </div>
          <p className="text-[12px] text-[#7a9ab0] mt-0.5">
            Gestion des licences d'entreprises • Règlement centralisé via GeniuSPay
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-[#fff3e8] border border-[rgba(224,96,32,0.2)] text-[#b35a00] rounded-[6px] text-[12px] font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#E06020]" />
            <span>{subscriptions.filter(s => s.daysRemaining <= 7 && s.status !== 'suspendu').length} Expirent &lt; 7 jours</span>
          </div>
        </div>
      </div>

      {/* Plan Card STANDARD */}
      <div className="card-kontrol p-4 bg-gradient-to-r from-white via-[#f6fafd] to-white border-[#50B0E0]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-[#003050] text-[#50B0E0] text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-[4px] font-mono">
                FORFAIT UNIQUE
              </span>
              <h2 className="text-[16px] font-extrabold text-[#003050]">
                Licence KONTROL STANDARD
              </h2>
            </div>
            <p className="text-[12px] text-[#7a9ab0]">
              Accès complet à l'ERP, comptabilité, gestion commerciale, modules factures et bordereaux d'encaissement via GeniuSPay.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[22px] font-black text-[#003050] font-mono tracking-tight">
                15 000 FCFA <span className="text-[12px] font-normal text-[#7a9ab0]">/mois</span>
              </div>
              <div className="text-[11px] text-[#50B0E0] font-semibold">
                Moyen de paiement GeniuSPay inclus
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-3 mt-3 border-t border-[rgba(0,48,80,0.08)]">
          <div className="flex items-center gap-2 text-[12px] text-[#2d4a60]">
            <CheckCircle2 className="w-4 h-4 text-[#1a7a45] shrink-0" />
            <span>Paiement GeniuSPay (Orange / MTN / Wave)</span>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-[#2d4a60]">
            <CheckCircle2 className="w-4 h-4 text-[#1a7a45] shrink-0" />
            <span>Facturation, Devis & Bons d'entreprise illimités</span>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-[#2d4a60]">
            <CheckCircle2 className="w-4 h-4 text-[#1a7a45] shrink-0" />
            <span>Support client prioritaire avec SLA garanti</span>
          </div>
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="card-kontrol">
        <div className="card-hd p-3.5 border-b border-[rgba(0,48,80,0.12)] flex items-center justify-between">
          <div>
            <h2 className="card-title text-[14px] font-bold text-[#003050]">
              Suivi des Licences d'Entreprises
            </h2>
            <p className="card-sub text-[11.5px] text-[#7a9ab0]">
              État des échéances et statut des renouvellements
            </p>
          </div>
          <div className="text-[12px] font-bold text-[#003050]">
            Total : {subscriptions.length} abonnement(s)
          </div>
        </div>

        <div className="tbl-wrap overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#F0F0F0] border-b border-[rgba(0,48,80,0.12)] text-[10.5px] font-semibold uppercase tracking-wider text-[#7a9ab0]">
                <th className="p-3 pl-4">Entreprise & Contact</th>
                <th className="p-3">Plan & Tarif</th>
                <th className="p-3">Prochaine Échéance</th>
                <th className="p-3">Renouvellement Auto</th>
                <th className="p-3">Statut</th>
                <th className="p-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,48,80,0.12)] text-[#0d1f2d]">
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#7a9ab0] text-[12.5px]">
                    Aucun abonnement enregistré dans la base de données.
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#f6fafd] transition-colors">
                    <td className="p-3 pl-4">
                      <div className="font-bold text-[#003050] flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#50B0E0]" />
                        <span>{sub.company || sub.userName}</span>
                      </div>
                      <div className="text-[11px] text-[#7a9ab0]">{sub.userEmail}</div>
                      {sub.address && (
                        <div className="text-[10px] text-[#7a9ab0]/80 mt-0.5 truncate max-w-xs">{sub.country ? `${sub.country} • ` : ''}{sub.address}</div>
                      )}
                    </td>

                    <td className="p-3">
                      <span className="badge b-standard font-bold">
                        STANDARD
                      </span>
                      <div className="text-[11px] font-mono font-bold text-[#2d4a60] mt-0.5">
                        15 000 FCFA / mois
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-mono text-[#003050] font-bold">{sub.nextBillingDate}</div>
                      <div className={`text-[10.5px] font-bold ${
                        sub.daysRemaining <= 3 ? 'text-[#c0392b]' :
                        sub.daysRemaining <= 7 ? 'text-[#b35a00]' : 'text-[#1a7a45]'
                      }`}>
                        {sub.daysRemaining > 0 ? `${sub.daysRemaining} jours restants` : 'Expiré'}
                      </div>
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => onUpdateSubscription({ ...sub, autoRenew: !sub.autoRenew })}
                        className={`badge cursor-pointer transition-all ${
                          sub.autoRenew 
                            ? 'b-actif' 
                            : 'b-inactif'
                        }`}
                      >
                        <RefreshCw className={`w-3 h-3 ${sub.autoRenew ? 'text-[#1a7a45]' : 'text-[#7a9ab0]'}`} />
                        {sub.autoRenew ? 'Activé (GeniuSPay)' : 'Manuel'}
                      </button>
                    </td>

                    <td className="p-3">
                      <span className={`badge ${
                        sub.status === 'actif' ? 'b-actif' :
                        sub.status === 'expire_bientot' ? 'b-attente' : 'badge bg-[#fdf0ee] text-[#c0392b]'
                      }`}>
                        {sub.status === 'actif' ? 'Actif' :
                         sub.status === 'expire_bientot' ? 'Expire bientôt' : 'Suspendu'}
                      </span>
                    </td>

                    <td className="p-3 pr-4 text-right">
                      <div className="flex flex-wrap items-center justify-end gap-1">
                        <button
                          onClick={() => onTriggerRenewalAlert(sub)}
                          className="btn btn-ol btn-sm py-1 px-2 text-[11px]"
                          title="Envoyer notification de relance"
                        >
                          <Send className="w-3 h-3 text-[#E06020]" />
                          Relancer
                        </button>

                        <button
                          onClick={() => handleManualRenew(sub)}
                          className="btn btn-dk btn-sm py-1 px-2.5 text-[11px]"
                          title="Prolonger l'abonnement (+1 mois)"
                        >
                          <Zap className="w-3 h-3 text-[#50B0E0]" />
                          Renouveler (+1M)
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
