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
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 font-jakarta tracking-tight">
              Abonnements & Plans Tarifaires
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-[#0284C7] text-[10px] font-black uppercase tracking-wider">
              {subscriptions.length} Actifs
            </span>
          </div>
          <p className="text-[13px] font-medium text-slate-500 mt-1">
            Gestion des forfaits SaaS, renouvellements automatiques Mobile Money & notifications d'expiration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-[12px] font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>{subscriptions.filter(s => s.daysRemaining <= 7 && s.status !== 'suspendu').length} Expirent &lt; 7 jours</span>
          </div>
        </div>
      </div>

      {/* Plans Tariff Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-extrabold text-slate-900 font-jakarta">
            Grille des Offres KONTROL ERP
          </h2>
          <span className="text-[11px] font-medium text-slate-500">
            Cliquez sur un plan pour modifier ses tarifs & fonctionnalités
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`bg-white rounded-3xl border p-6 shadow-xs flex flex-col justify-between transition-all relative ${
                plan.isPopular ? 'border-[#0284C7] ring-2 ring-[#0284C7]/20' : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {plan.isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0284C7] text-white text-[9.5px] font-black uppercase px-3 py-0.5 rounded-full shadow-xs">
                  Offre la plus populaire
                </span>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-black text-slate-900">{plan.name}</h3>
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    {plan.subscriberCount} abonnés
                  </span>
                </div>

                <div className="text-2xl font-black text-slate-900 font-mono tracking-tight my-2">
                  {formatFCFA(plan.priceMonthly)} <span className="text-xs font-normal text-slate-500">/mois</span>
                </div>

                <p className="text-[12px] font-medium text-slate-500 mb-4 line-clamp-2">
                  {plan.description}
                </p>

                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    Inclus dans {plan.name} :
                  </div>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[12px] font-medium text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedPlanToEdit(plan)}
                className="mt-6 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-[12px] font-extrabold transition-colors flex items-center justify-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Editer le plan
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 font-jakarta">
              Suivi des Souscriptions en Cours
            </h2>
            <p className="text-[12px] font-medium text-slate-500">
              Renouvellements automatiques Mobile Money et alertes de statut.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10.5px] font-black uppercase text-slate-500 tracking-wider">
                <th className="p-4 pl-6">Abonné / Entreprise</th>
                <th className="p-4">Plan & Tarif</th>
                <th className="p-4">Échéance & Décompte</th>
                <th className="p-4">Renouvellement Auto</th>
                <th className="p-4">Statut</th>
                <th className="p-4 pr-6 text-right">Actions Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px] font-medium text-slate-800">
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="font-extrabold text-slate-900">{sub.userName}</div>
                    <div className="text-[11px] text-slate-500">{sub.company}</div>
                  </td>

                  <td className="p-4">
                    <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg text-[11px]">
                      {sub.planName}
                    </span>
                    <div className="text-[11px] font-mono font-extrabold text-slate-700 mt-0.5">
                      {formatFCFA(sub.price)} ({sub.billingCycle})
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="font-mono text-slate-800 font-bold">{sub.nextBillingDate}</div>
                    <div className={`text-[10.5px] font-bold ${
                      sub.daysRemaining <= 3 ? 'text-rose-600' :
                      sub.daysRemaining <= 7 ? 'text-amber-600' : 'text-slate-400'
                    }`}>
                      {sub.daysRemaining > 0 ? `${sub.daysRemaining} jours restants` : 'Expiré'}
                    </div>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => onUpdateSubscription({ ...sub, autoRenew: !sub.autoRenew })}
                      className={`px-3 py-1 rounded-xl text-[11px] font-black uppercase flex items-center gap-1.5 transition-all ${
                        sub.autoRenew 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      <RefreshCw className={`w-3 h-3 ${sub.autoRenew ? 'text-emerald-600' : 'text-slate-400'}`} />
                      {sub.autoRenew ? 'Activé' : 'Désactivé'}
                    </button>
                  </td>

                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      sub.status === 'actif' ? 'bg-emerald-100 text-emerald-800' :
                      sub.status === 'expire_bientot' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {sub.status === 'actif' ? 'Émeraude / Actif' :
                       sub.status === 'expire_bientot' ? 'Ambre / Expire bientôt' : 'Rose / Suspendu'}
                    </span>
                  </td>

                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onTriggerRenewalAlert(sub)}
                        className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-[11px] font-bold transition-colors flex items-center gap-1"
                        title="Envoyer une relance d'échéance par email"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Relancer
                      </button>

                      <button
                        onClick={() => setSelectedSubToChange(sub)}
                        className="px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-[#0284C7] rounded-xl text-[11px] font-bold transition-colors flex items-center gap-1"
                        title="Changer de plan (Upgrade / Downgrade)"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        Changer Plan
                      </button>

                      <button
                        onClick={() => handleManualRenew(sub)}
                        className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[11px] font-bold transition-colors"
                        title="Renouveler manuellement (+1 mois)"
                      >
                        +1 Mois
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
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-black text-slate-900 font-jakarta">
                Modifier le Plan {selectedPlanToEdit.name}
              </h3>
              <button onClick={() => setSelectedPlanToEdit(null)} className="p-2 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">Prix Mensuel (FCFA)</label>
                <input
                  type="number"
                  value={selectedPlanToEdit.priceMonthly}
                  onChange={(e) => setSelectedPlanToEdit({ ...selectedPlanToEdit, priceMonthly: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-[12.5px] font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={selectedPlanToEdit.description}
                  onChange={(e) => setSelectedPlanToEdit({ ...selectedPlanToEdit, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-[12.5px]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedPlanToEdit(null)}
                className="px-4 py-2 border border-slate-200 rounded-2xl text-[12px] font-bold"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  onUpdatePlan(selectedPlanToEdit);
                  setSelectedPlanToEdit(null);
                }}
                className="px-5 py-2 bg-[#0284C7] text-white rounded-2xl text-[12px] font-black"
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
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-black text-slate-900 font-jakarta">
                Changer de Plan pour {selectedSubToChange.userName}
              </h3>
              <button onClick={() => setSelectedSubToChange(null)} className="p-2 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[12.5px] text-slate-600">
              Plan actuel: <strong className="text-slate-900">{selectedSubToChange.planName}</strong> ({formatFCFA(selectedSubToChange.price)}/m).
            </p>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">Nouveau Plan Souhaité</label>
              <select
                value={newPlanTarget}
                onChange={(e) => setNewPlanTarget(e.target.value as PlanType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-[12.5px] font-extrabold"
              >
                {plans.map(p => (
                  <option key={p.id} value={p.name}>
                    {p.name} — {formatFCFA(p.priceMonthly)} / mois
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedSubToChange(null)}
                className="px-4 py-2 border border-slate-200 rounded-2xl text-[12px] font-bold"
              >
                Annuler
              </button>
              <button
                onClick={handlePlanChangeSubmit}
                className="px-5 py-2 bg-[#0284C7] text-white rounded-2xl text-[12px] font-black"
              >
                Appliquer la modification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
