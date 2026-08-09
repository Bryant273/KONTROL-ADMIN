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
  ChevronRight,
  Sparkles,
  ShieldCheck,
  X
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
  const [selectedPlanToEdit, setSelectedPlanToEdit] = useState<PlanDefinition | null>(null);
  const [selectedSubToChange, setSelectedSubToChange] = useState<Subscription | null>(null);
  const [newPlanTarget, setNewPlanTarget] = useState<PlanType>('Enterprise');

  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(val);
  };

  const handleManualRenew = (sub: Subscription) => {
    // Extend next billing date by 1 month
    const currentDate = new Date(sub.nextBillingDate || '2026-08-15');
    currentDate.setMonth(currentDate.getMonth() + 1);
    const newDateStr = currentDate.toISOString().split('T')[0];

    onUpdateSubscription({
      ...sub,
      status: 'actif',
      nextBillingDate: newDateStr,
      daysRemaining: 30
    });
  };

  const handlePlanChangeSubmit = () => {
    if (!selectedSubToChange) return;
    const targetPlanObj = plans.find(p => p.name === newPlanTarget);
    const newPrice = targetPlanObj ? targetPlanObj.priceMonthly : selectedSubToChange.price;

    onUpdateSubscription({
      ...selectedSubToChange,
      planName: newPlanTarget,
      price: newPrice
    });
    setSelectedSubToChange(null);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 card-kontrol p-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[#003050]">
              Abonnements & Plans Tarifaires
            </h1>
            <span className="badge b-premium">
              {subscriptions.length} Actifs
            </span>
          </div>
          <p className="text-[12px] text-[#7a9ab0] mt-0.5">
            Gestion des forfaits SaaS, renouvellements automatiques Mobile Money & notifications d'expiration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-[#fff3e8] border border-[rgba(224,96,32,0.2)] text-[#b35a00] rounded-[6px] text-[12px] font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#E06020]" />
            <span>{subscriptions.filter(s => s.daysRemaining <= 7 && s.status !== 'suspendu').length} Expirent &lt; 7 jours</span>
          </div>
        </div>
      </div>

      {/* Plans Tariff Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[14px] font-bold text-[#003050]">
            Grille des Offres KONTROL ERP
          </h2>
          <span className="text-[11.5px] text-[#7a9ab0] hidden sm:inline">
            Cliquez sur un plan pour modifier ses tarifs & fonctionnalités
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`card-kontrol p-4 flex flex-col justify-between transition-all relative ${
                plan.isPopular ? 'border-[#50B0E0] ring-1 ring-[#50B0E0]/30' : ''
              }`}
            >
              {plan.isPopular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#50B0E0] text-white text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                  Populaire
                </span>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-[15px] font-extrabold text-[#003050]">{plan.name}</h3>
                  <span className="text-[10px] font-mono font-bold text-[#7a9ab0]">
                    {plan.subscriberCount} abonnés
                  </span>
                </div>

                <div className="text-[20px] font-black text-[#003050] font-mono tracking-tight my-1">
                  {formatFCFA(plan.priceMonthly)} <span className="text-[11px] font-normal text-[#7a9ab0]">/mois</span>
                </div>

                <p className="text-[11.5px] text-[#7a9ab0] mb-3 line-clamp-2">
                  {plan.description}
                </p>

                <div className="space-y-1.5 border-t border-[rgba(0,48,80,0.08)] pt-3">
                  <div className="text-[10px] font-bold uppercase text-[#7a9ab0] tracking-wider">
                    Inclus dans {plan.name} :
                  </div>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11.5px] text-[#2d4a60]">
                      <Check className="w-3.5 h-3.5 text-[#1a7a45] shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedPlanToEdit(plan)}
                className="mt-4 btn btn-ol w-full justify-center btn-sm"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Editer le plan
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="tbl-card">
        <div className="card-hd p-3.5 border-b border-[rgba(0,48,80,0.12)]">
          <h2 className="card-title text-[14px] font-bold text-[#003050]">
            Suivi des Souscriptions en Cours
          </h2>
          <p className="card-sub text-[11.5px] text-[#7a9ab0]">
            Renouvellements automatiques Mobile Money et alertes de statut.
          </p>
        </div>

        <div className="tbl-wrap overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#F0F0F0] border-b border-[rgba(0,48,80,0.12)] text-[10.5px] font-semibold uppercase tracking-wider text-[#7a9ab0]">
                <th className="p-3 pl-4">Abonné / Entreprise</th>
                <th className="p-3">Plan & Tarif</th>
                <th className="p-3">Échéance & Décompte</th>
                <th className="p-3">Renouvellement Auto</th>
                <th className="p-3">Statut</th>
                <th className="p-3 pr-4 text-right">Actions Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,48,80,0.12)] text-[#0d1f2d]">
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-[#f6fafd] transition-colors">
                  <td className="p-3 pl-4">
                    <div className="font-bold text-[#0d1f2d]">{sub.userName}</div>
                    <div className="text-[11px] text-[#7a9ab0]">{sub.company}</div>
                  </td>

                  <td className="p-3">
                    <span className="badge b-standard">
                      {sub.planName}
                    </span>
                    <div className="text-[11px] font-mono font-bold text-[#2d4a60] mt-0.5">
                      {formatFCFA(sub.price)} ({sub.billingCycle})
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="font-mono text-[#003050] font-bold">{sub.nextBillingDate}</div>
                    <div className={`text-[10.5px] font-bold ${
                      sub.daysRemaining <= 3 ? 'text-[#c0392b]' :
                      sub.daysRemaining <= 7 ? 'text-[#b35a00]' : 'text-[#7a9ab0]'
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
                      {sub.autoRenew ? 'Activé' : 'Désactivé'}
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
                        title="Envoyer une relance par email"
                      >
                        <Send className="w-3 h-3 text-[#E06020]" />
                        Relancer
                      </button>

                      <button
                        onClick={() => setSelectedSubToChange(sub)}
                        className="btn btn-ol btn-sm py-1 px-2 text-[11px]"
                        title="Changer de plan"
                      >
                        <Zap className="w-3 h-3 text-[#50B0E0]" />
                        Changer
                      </button>

                      <button
                        onClick={() => handleManualRenew(sub)}
                        className="btn btn-dk btn-sm py-1 px-2 text-[11px]"
                        title="Renouveler (+1 mois)"
                      >
                        +1M
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Plan Modal */}
      {selectedPlanToEdit && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="card-kontrol max-w-md w-full max-h-[90vh] overflow-y-auto p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[rgba(0,48,80,0.12)] pb-2">
              <h3 className="text-[14px] font-bold text-[#003050]">
                Modifier le Plan {selectedPlanToEdit.name}
              </h3>
              <button onClick={() => setSelectedPlanToEdit(null)} className="rab">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-bold text-[#7a9ab0] uppercase mb-0.5">Prix Mensuel (FCFA)</label>
                <input
                  type="number"
                  value={selectedPlanToEdit.priceMonthly}
                  onChange={(e) => setSelectedPlanToEdit({ ...selectedPlanToEdit, priceMonthly: Number(e.target.value) })}
                  className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] p-2 text-[12.5px] font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#7a9ab0] uppercase mb-0.5">Description</label>
                <textarea
                  rows={3}
                  value={selectedPlanToEdit.description}
                  onChange={(e) => setSelectedPlanToEdit({ ...selectedPlanToEdit, description: e.target.value })}
                  className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] p-2 text-[12.5px]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[rgba(0,48,80,0.12)]">
              <button
                onClick={() => setSelectedPlanToEdit(null)}
                className="btn btn-ol btn-sm"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  onUpdatePlan(selectedPlanToEdit);
                  setSelectedPlanToEdit(null);
                }}
                className="btn btn-or btn-sm"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade / Downgrade Plan Modal */}
      {selectedSubToChange && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="card-kontrol max-w-md w-full max-h-[90vh] overflow-y-auto p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[rgba(0,48,80,0.12)] pb-2">
              <h3 className="text-[14px] font-bold text-[#003050]">
                Changer de Plan pour {selectedSubToChange.userName}
              </h3>
              <button onClick={() => setSelectedSubToChange(null)} className="rab">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[12.5px] text-[#2d4a60]">
              Plan actuel: <strong className="text-[#003050]">{selectedSubToChange.planName}</strong> ({formatFCFA(selectedSubToChange.price)}/m).
            </p>

            <div>
              <label className="block text-[11px] font-bold text-[#7a9ab0] uppercase mb-0.5">Nouveau Plan Souhaité</label>
              <select
                value={newPlanTarget}
                onChange={(e) => setNewPlanTarget(e.target.value as PlanType)}
                className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] p-2 text-[12.5px] font-bold"
              >
                {plans.map(p => (
                  <option key={p.id} value={p.name}>
                    {p.name} — {formatFCFA(p.priceMonthly)} / mois
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[rgba(0,48,80,0.12)]">
              <button
                onClick={() => setSelectedSubToChange(null)}
                className="btn btn-ol btn-sm"
              >
                Annuler
              </button>
              <button
                onClick={handlePlanChangeSubmit}
                className="btn btn-or btn-sm"
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
