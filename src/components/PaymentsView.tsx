import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  RotateCcw, 
  Terminal, 
  X, 
  RefreshCw, 
  CreditCard,
  Building2,
  PlusCircle,
  Download,
  FileText,
  ShieldCheck,
  Check
} from 'lucide-react';
import { PaymentTransaction, GatewayStatus, PaymentNetwork } from '../types';

interface PaymentsViewProps {
  transactions: PaymentTransaction[];
  gateways: GatewayStatus[];
  onToggleGatewayMode: (key: string) => void;
  onRetryTransaction: (txId: string) => void;
  onRefundTransaction: (txId: string) => void;
  onNewTransaction?: (txData: { 
    clientName: string; 
    company: string; 
    amount: number; 
    paymentNetwork: PaymentNetwork 
  }) => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  transactions,
  gateways,
  onToggleGatewayMode,
  onRetryTransaction,
  onRefundTransaction,
  onNewTransaction
}) => {
  const [search, setSearch] = useState('');
  const [networkFilter, setNetworkFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSlip, setSelectedSlip] = useState<PaymentTransaction | null>(null);
  const [showSlipModal, setShowSlipModal] = useState(false);

  // New Subscription Payment State via JiniusPay
  const [payCompany, setPayCompany] = useState('');
  const [payClient, setPayClient] = useState('');
  const [payNetwork, setPayNetwork] = useState<PaymentNetwork>('Orange Money');
  const [payBillingPlan, setPayBillingPlan] = useState<'monthly' | 'yearly'>('monthly');

  const filteredTxs = transactions.filter(t => {
    const term = search.toLowerCase();
    const matchesSearch = (t.clientName || '').toLowerCase().includes(term) ||
                          (t.company || '').toLowerCase().includes(term) ||
                          (t.transactionId || '').toLowerCase().includes(term) ||
                          (t.slipReference || '').toLowerCase().includes(term);
    const matchesNetwork = networkFilter === 'all' || t.paymentNetwork === networkFilter;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesNetwork && matchesStatus;
  });

  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(val);
  };

  const handleCreateSlipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payCompany.trim()) return;

    const amount = payBillingPlan === 'monthly' ? 15000 : 150000;

    if (onNewTransaction) {
      onNewTransaction({
        clientName: payClient.trim() || payCompany.trim(),
        company: payCompany.trim(),
        amount,
        paymentNetwork: payNetwork
      });
    }

    setPayCompany('');
    setPayClient('');
    setShowSlipModal(false);
  };

  const exportCSV = () => {
    const headers = ['N° Bordereau GeniuSPay', 'Entreprise', 'Souscripteur', 'Objet', 'Réseau (Détail GeniuSPay)', 'Montant (FCFA)', 'Devise', 'Statut', 'Date & Heure', 'Réf. Bordereau'];
    const rows = filteredTxs.map(t => [
      t.transactionId,
      `"${t.company}"`,
      `"${t.clientName}"`,
      `"${t.purpose}"`,
      `"${t.paymentNetwork}"`,
      t.amount,
      t.currency,
      t.status,
      `"${t.timestamp}"`,
      `"${t.slipReference}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kontrol_bordereaux_geniuspay_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Total collected strictly for subscriptions
  const totalSubscriptionsCollected = transactions
    .filter(t => t.status === 'success')
    .reduce((acc, t) => acc + (t.amount || 15000), 0);

  return (
    <div className="space-y-4">
      {/* Information Header on GeniuSPay Aggregator */}
      <div className="card-kontrol p-4 bg-gradient-to-r from-white via-[#f6fafd] to-white border-l-4 border-l-[#50B0E0]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#50B0E0]" />
              <h1 className="text-base sm:text-lg font-bold text-[#003050]">
                Moyen de Paiement : GeniuSPay
              </h1>
              <span className="badge b-actif text-[10px] font-bold">
                Abonnements KONTROL (15 000 FCFA/mois)
              </span>
            </div>
            <p className="text-[12px] text-[#7a9ab0] mt-1">
              GeniuSPay est l'agrégateur de paiement émettant les bordereaux de règlement des abonnements ERP. 
              Les réseaux sous-jacents (Orange Money, MTN Mobile Money, Wave) constituent les détails de règlement de chaque compte.
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-[#7a9ab0] block font-mono">
              Total Abonnements Encaissés
            </span>
            <span className="text-[20px] font-black text-[#003050] font-mono">
              {formatFCFA(totalSubscriptionsCollected)}
            </span>
          </div>
        </div>
      </div>

      {/* GeniuSPay Payment Networks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {gateways.map((gw) => {
          const gwVol = transactions
            .filter(t => (t.paymentNetwork === gw.network || t.paymentNetwork === gw.name) && t.status === 'success')
            .reduce((acc, t) => acc + (t.amount || 15000), 0);

          return (
            <div key={gw.key} className="card-kontrol p-3.5 space-y-2 bg-gradient-to-br from-white to-[#F8FAFC]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#003050] text-[13px] flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${gw.status === 'operational' ? 'bg-[#1a7a45]' : 'bg-[#b35a00]'}`} />
                  {gw.network || gw.name}
                </span>
                <span className="badge b-standard text-[9.5px]">
                  GeniuSPay
                </span>
              </div>

              <div className="text-[11.5px] text-[#7a9ab0] space-y-1 font-mono">
                <div className="flex justify-between">
                  <span>Latence :</span>
                  <strong className="text-[#0d1f2d]">{gw.latencyMs} ms</strong>
                </div>
                <div className="flex justify-between">
                  <span>Abonnements réglés :</span>
                  <strong className="text-[#003050]">{formatFCFA(gwVol)}</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-[rgba(0,48,80,0.08)] flex items-center justify-between text-[10px] text-[#7a9ab0]">
                <span>Moyen : GeniuSPay</span>
                <span className="text-[#1a7a45] font-semibold">Opérationnel</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transactions Table Card */}
      <div className="card-kontrol">
        {/* Table Header */}
        <div className="card-hd flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 border-b border-[rgba(0,48,80,0.12)]">
          <div>
            <div className="card-title flex items-center gap-2 text-[14px] font-bold text-[#003050]">
              <FileText className="w-4 h-4 text-[#50B0E0]" />
              Bordereaux d'Encaissement des Abonnements
            </div>
            <div className="card-sub text-[11.5px] text-[#7a9ab0]">
              Historique des cotisations et licences STANDARD enregistrées via GeniuSPay ({transactions.length} bordereau(x))
            </div>
          </div>
          <div className="btns flex items-center gap-2 w-full sm:w-auto justify-end">
            <button onClick={exportCSV} className="btn btn-ol btn-sm">
              <Download className="w-3.5 h-3.5" />
              Exporter CSV
            </button>
            <button onClick={() => setShowSlipModal(true)} className="btn btn-or btn-sm font-bold">
              <PlusCircle className="w-3.5 h-3.5" />
              + Émettre un Bordereau GeniuSPay
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-2.5 border-b border-[rgba(0,48,80,0.12)] bg-[#F8FAFC]">
          <div className="filter-bar flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="fsrch flex-1 flex items-center gap-2 bg-[#FFFFFF] border border-[rgba(0,48,80,0.12)] rounded-[7px] px-2.5 py-1.5">
              <Search className="w-3.5 h-3.5 text-[#7a9ab0] shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par N° Bordereau, entreprise, référence GeniuSPay..."
                className="w-full bg-transparent border-none text-[12.5px] text-[#0d1f2d] outline-none"
              />
            </div>
            <select
              value={networkFilter}
              onChange={(e) => setNetworkFilter(e.target.value)}
              className="w-full sm:w-auto bg-[#FFFFFF] border border-[rgba(0,48,80,0.12)] rounded-[7px] px-2.5 py-1.5 text-[12px] text-[#0d1f2d] outline-none"
            >
              <option value="all">Tous les réseaux de paiement</option>
              <option value="Orange Money">Orange Money</option>
              <option value="MTN Mobile Money">MTN Mobile Money</option>
              <option value="Wave">Wave</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto bg-[#FFFFFF] border border-[rgba(0,48,80,0.12)] rounded-[7px] px-2.5 py-1.5 text-[12px] text-[#0d1f2d] outline-none"
            >
              <option value="all">Tous statuts</option>
              <option value="success">Validé</option>
              <option value="pending">En attente</option>
              <option value="failed">Échec</option>
              <option value="refunded">Remboursé</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="tbl-wrap overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#F0F0F0] border-b border-[rgba(0,48,80,0.12)] text-[10.5px] font-semibold uppercase tracking-wider text-[#7a9ab0] text-left">
                <th className="p-3 pl-4">N° Bordereau & Date</th>
                <th className="p-3">Entreprise & Souscripteur</th>
                <th className="p-3">Objet</th>
                <th className="p-3">Réseau (Détail GeniuSPay)</th>
                <th className="p-3">Montant Abonnement</th>
                <th className="p-3">Statut</th>
                <th className="p-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,48,80,0.12)]">
              {filteredTxs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#7a9ab0] text-[12.5px]">
                    Aucun bordereau d'abonnement enregistré.
                  </td>
                </tr>
              ) : (
                filteredTxs.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#f6fafd] transition-colors">
                    <td className="p-3 pl-4 font-mono">
                      <div className="font-bold text-[#003050] text-[12px]">{tx.transactionId}</div>
                      <div className="text-[10.5px] text-[#7a9ab0]">{tx.slipReference} • {tx.timestamp}</div>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-[#0d1f2d] flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#50B0E0]" />
                        <span>{tx.company}</span>
                      </div>
                      <div className="text-[11.5px] text-[#7a9ab0]">{tx.clientName}</div>
                    </td>

                    <td className="p-3">
                      <span className="badge b-standard text-[10.5px] font-medium">
                        {tx.purpose || 'Abonnement KONTROL Standard'}
                      </span>
                    </td>

                    <td className="p-3">
                      <span className="badge b-actif font-semibold text-[#003050]">
                        {tx.paymentNetwork}
                      </span>
                    </td>

                    <td className="p-3 font-mono font-black text-[#003050]">
                      {formatFCFA(tx.amount || 15000)}
                    </td>

                    <td className="p-3">
                      <span className={`badge ${
                        tx.status === 'success' ? 'b-actif' :
                        tx.status === 'pending' ? 'b-attente' :
                        tx.status === 'refunded' ? 'b-standard' : 'badge bg-[#fdf0ee] text-[#c0392b]'
                      }`}>
                        {tx.status === 'success' ? 'Validé' :
                         tx.status === 'pending' ? 'En attente' :
                         tx.status === 'refunded' ? 'Remboursé' : 'Échec'}
                      </span>
                    </td>

                    <td className="p-3 pr-4 text-right">
                      <div className="ra justify-end">
                        <button
                          onClick={() => setSelectedSlip(tx)}
                          className="rab edit"
                          title="Consulter le bordereau GeniuSPay"
                        >
                          <Terminal className="w-3.5 h-3.5" />
                        </button>

                        {tx.status === 'failed' && (
                          <button
                            onClick={() => onRetryTransaction(tx.id)}
                            className="btn btn-or btn-sm text-[11px]"
                          >
                            <RefreshCw className="w-3 h-3" /> Rejouer
                          </button>
                        )}

                        {tx.status === 'success' && (
                          <button
                            onClick={() => onRefundTransaction(tx.id)}
                            className="btn btn-ol btn-sm text-[11px]"
                            title="Annuler / Rembourser"
                          >
                            <RotateCcw className="w-3 h-3 text-[#c0392b]" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Émettre un bordereau d'abonnement GeniuSPay */}
      {showSlipModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreateSlipSubmit} className="card-kontrol max-w-md w-full p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[rgba(0,48,80,0.12)]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#50B0E0]" />
                <h3 className="text-[14px] font-bold text-[#003050]">
                  Émettre un Bordereau GeniuSPay
                </h3>
              </div>
              <button type="button" onClick={() => setShowSlipModal(false)} className="rab">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2.5 rounded-[6px] bg-[#f6fafd] border border-[rgba(80,176,224,0.3)] text-[11.5px] text-[#003050]">
              <strong>Moyen de Paiement :</strong> GeniuSPay (Abonnement KONTROL ERP Standard 15 000 FCFA).
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-bold text-[#003050] uppercase mb-1">
                  Entreprise Souscriptrice *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Société Agro Dakar SA"
                  value={payCompany}
                  onChange={(e) => setPayCompany(e.target.value)}
                  className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] p-2 text-[12.5px] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#003050] uppercase mb-1">
                  Nom du Représentant / Client
                </label>
                <input
                  type="text"
                  placeholder="Ex: Amadou Diallo"
                  value={payClient}
                  onChange={(e) => setPayClient(e.target.value)}
                  className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] p-2 text-[12.5px] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#003050] uppercase mb-1">
                    Réseau (Détail GeniuSPay)
                  </label>
                  <select
                    value={payNetwork}
                    onChange={(e) => setPayNetwork(e.target.value as PaymentNetwork)}
                    className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] p-2 text-[12px] outline-none font-bold"
                  >
                    <option value="Orange Money">Orange Money</option>
                    <option value="MTN Mobile Money">MTN Mobile Money</option>
                    <option value="Wave">Wave</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#003050] uppercase mb-1">
                    Cycle d'Abonnement
                  </label>
                  <select
                    value={payBillingPlan}
                    onChange={(e) => setPayBillingPlan(e.target.value as any)}
                    className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] p-2 text-[12px] outline-none font-bold"
                  >
                    <option value="monthly">Mensuel (15 000 FCFA)</option>
                    <option value="yearly">Annuel (150 000 FCFA)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[rgba(0,48,80,0.12)]">
              <button type="button" onClick={() => setShowSlipModal(false)} className="btn btn-ol btn-sm">
                Annuler
              </button>
              <button type="submit" className="btn btn-or btn-sm font-bold">
                Valider & Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Inspector Modal: Bordereau de Transaction GeniuSPay */}
      {selectedSlip && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="card-kontrol max-w-lg w-full p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[rgba(0,48,80,0.12)]">
              <div>
                <h3 className="text-[14px] font-bold text-[#003050]">
                  Bordereau de Règlement GeniuSPay
                </h3>
                <p className="text-[11.5px] font-mono text-[#7a9ab0]">
                  {selectedSlip.transactionId}
                </p>
              </div>
              <button onClick={() => setSelectedSlip(null)} className="rab">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-[12px]">
              <div className="p-3 bg-[#F8FAFC] rounded-md border border-[rgba(0,48,80,0.08)] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#7a9ab0]">Moyen de Paiement :</span>
                  <strong className="text-[#003050]">GeniuSPay</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7a9ab0]">Réseau de paiement (Détail) :</span>
                  <strong className="text-[#003050]">{selectedSlip.paymentNetwork}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7a9ab0]">Objet :</span>
                  <strong className="text-[#003050]">{selectedSlip.purpose}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7a9ab0]">Montant :</span>
                  <strong className="text-[#003050] font-mono text-[13px]">{formatFCFA(selectedSlip.amount)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7a9ab0]">Entreprise souscriptrice :</span>
                  <strong className="text-[#0d1f2d]">{selectedSlip.company}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7a9ab0]">Souscripteur :</span>
                  <strong className="text-[#0d1f2d]">{selectedSlip.clientName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7a9ab0]">Réf. Bordereau :</span>
                  <strong className="text-[#003050] font-mono">{selectedSlip.slipReference}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7a9ab0]">Date d'encaissement :</span>
                  <span className="font-mono text-[#0d1f2d]">{selectedSlip.timestamp}</span>
                </div>
              </div>

              <div>
                <span className="text-[10.5px] font-bold uppercase text-[#7a9ab0] block mb-1 font-mono">Détails Techniques du Bordereau</span>
                <pre className="bg-[#003050] text-[#50B0E0] p-2.5 rounded-md font-mono text-[11px] overflow-x-auto">
                  {JSON.stringify(selectedSlip, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button onClick={() => setSelectedSlip(null)} className="btn btn-dk btn-sm">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
