import React, { useState } from 'react';
import { 
  Banknote, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  RotateCcw, 
  Eye, 
  Zap, 
  Terminal,
  X,
  RefreshCw,
  CreditCard
} from 'lucide-react';
import { PaymentTransaction, GatewayStatus } from '../types';

interface PaymentsViewProps {
  transactions: PaymentTransaction[];
  gateways: GatewayStatus[];
  onToggleGatewayMode: (key: string) => void;
  onRetryTransaction: (txId: string) => void;
  onRefundTransaction: (txId: string) => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  transactions,
  gateways,
  onToggleGatewayMode,
  onRetryTransaction,
  onRefundTransaction
}) => {
  const [search, setSearch] = useState('');
  const [gatewayFilter, setGatewayFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTxForPayload, setSelectedTxForPayload] = useState<PaymentTransaction | null>(null);

  const filteredTxs = transactions.filter(t => {
    const matchesSearch = t.clientName.toLowerCase().includes(search.toLowerCase()) ||
                          t.company.toLowerCase().includes(search.toLowerCase()) ||
                          t.transactionId.toLowerCase().includes(search.toLowerCase()) ||
                          t.gatewayRef.toLowerCase().includes(search.toLowerCase());
    const matchesGateway = gatewayFilter === 'all' || t.gateway === gatewayFilter;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesGateway && matchesStatus;
  });

  const formatFCFA = (val: number, currency: string) => {
    if (currency === 'EUR') {
      return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val);
    }
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-4">
      {/* Gateway Health Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {gateways.map((gw) => (
          <div key={gw.key} className="card-kontrol p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#003050] text-[13px] flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${gw.status === 'operational' ? 'bg-[#1a7a45]' : 'bg-[#b35a00]'}`} />
                {gw.name}
              </span>
              <button
                onClick={() => onToggleGatewayMode(gw.key)}
                className={`badge ${gw.mode === 'live' ? 'b-actif' : 'b-attente'}`}
              >
                {gw.mode.toUpperCase()}
              </button>
            </div>

            <div className="text-[11px] font-mono text-[#7a9ab0] space-y-0.5">
              <div className="flex justify-between">
                <span>Latence:</span>
                <strong className={gw.latencyMs > 1000 ? 'text-[#c0392b]' : 'text-[#0d1f2d]'}>{gw.latencyMs} ms</strong>
              </div>
              <div className="flex justify-between">
                <span>Volume 24h:</span>
                <strong className="text-[#003050]">{formatFCFA(gw.volume24h, 'XOF')}</strong>
              </div>
            </div>

            <div className="pt-2 border-t border-[rgba(0,48,80,0.12)] flex items-center justify-between text-[10.5px]">
              <span className="text-[#7a9ab0]">Statut : {gw.status === 'operational' ? 'Opérationnel' : 'Dégradé'}</span>
              <button 
                onClick={() => onToggleGatewayMode(gw.key)}
                className="text-[#50B0E0] font-semibold hover:underline"
              >
                Bascule
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="tbl-card">
        {/* Header */}
        <div className="card-hd flex items-center justify-between">
          <div>
            <div className="card-title flex items-center gap-2 text-[14px] font-bold text-[#003050]">
              <CreditCard className="w-4 h-4 text-[#50B0E0]" />
              Paiements & Transactions
            </div>
            <div className="card-sub text-[11.5px] text-[#7a9ab0]">
              Historique des flux financiers ({filteredTxs.length} opérations)
            </div>
          </div>
          <div className="btns">
            <button className="btn btn-ol btn-sm">
              Exporter CSV
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-2.5 border-b border-[rgba(0,48,80,0.12)]">
          <div className="filter-bar flex items-center gap-2">
            <div className="fsrch flex-1 flex items-center gap-2 bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[7px] px-2.5 py-1.5">
              <Search className="w-3.5 h-3.5 text-[#7a9ab0]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ID transaction, client, référence..."
                className="w-full bg-transparent border-none text-[13px] text-[#0d1f2d] outline-none"
              />
            </div>
            <select
              value={gatewayFilter}
              onChange={(e) => setGatewayFilter(e.target.value)}
              className="fsel"
            >
              <option value="all">Toutes passerelles</option>
              <option value="Orange Money">Orange Money</option>
              <option value="MTN Mobile Money">MTN Mobile Money</option>
              <option value="Stripe">Stripe</option>
              <option value="PayPal">PayPal</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="fsel"
            >
              <option value="all">Tous statuts</option>
              <option value="success">Succès</option>
              <option value="pending">En attente</option>
              <option value="failed">Échec</option>
              <option value="refunded">Remboursé</option>
            </select>
          </div>
        </div>

        {/* Table Wrap */}
        <div className="tbl-wrap overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#F0F0F0] border-b border-[rgba(0,48,80,0.12)] text-[10.5px] font-semibold uppercase tracking-wider text-[#7a9ab0] text-left">
                <th className="p-3 pl-4">ID & Ref</th>
                <th className="p-3">Client</th>
                <th className="p-3">Passerelle</th>
                <th className="p-3">Montant</th>
                <th className="p-3">Statut</th>
                <th className="p-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,48,80,0.12)]">
              {filteredTxs.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#f6fafd] transition-colors">
                  <td className="p-3 pl-4 font-mono">
                    <div className="font-bold text-[#0d1f2d] text-[12px]">{tx.transactionId}</div>
                    <div className="text-[10.5px] text-[#7a9ab0]">{tx.gatewayRef} • {tx.timestamp}</div>
                  </td>

                  <td className="p-3">
                    <div className="font-semibold text-[#0d1f2d]">{tx.clientName}</div>
                    <div className="text-[11.5px] text-[#7a9ab0]">{tx.company}</div>
                  </td>

                  <td className="p-3">
                    <span className="badge b-standard">
                      {tx.gateway}
                    </span>
                  </td>

                  <td className="p-3 font-mono font-bold text-[#003050]">
                    {formatFCFA(tx.amount, tx.currency)}
                  </td>

                  <td className="p-3">
                    <span className={`badge ${
                      tx.status === 'success' ? 'b-actif' :
                      tx.status === 'pending' ? 'b-attente' :
                      tx.status === 'refunded' ? 'b-standard' : 'badge bg-[#fdf0ee] text-[#c0392b]'
                    }`}>
                      {tx.status === 'success' ? 'Succès' :
                       tx.status === 'pending' ? 'En attente' :
                       tx.status === 'refunded' ? 'Remboursé' : 'Échec'}
                    </span>
                  </td>

                  <td className="p-3 pr-4 text-right">
                    <div className="ra justify-end">
                      <button
                        onClick={() => setSelectedTxForPayload(tx)}
                        className="rab edit"
                        title="Payload JSON"
                      >
                        <Terminal className="w-3.5 h-3.5" />
                      </button>

                      {tx.status === 'failed' && (
                        <button
                          onClick={() => onRetryTransaction(tx.id)}
                          className="btn btn-or btn-sm"
                        >
                          <RefreshCw className="w-3 h-3" /> Rejouer
                        </button>
                      )}

                      {tx.status === 'success' && (
                        <button
                          onClick={() => onRefundTransaction(tx.id)}
                          className="btn btn-ol btn-sm"
                        >
                          <RotateCcw className="w-3 h-3" /> Rembourser
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Foot */}
        <div className="tbl-foot flex items-center justify-between p-3 border-t border-[rgba(0,48,80,0.12)] text-[11.5px] text-[#7a9ab0]">
          <span>{filteredTxs.length} transactions affichées</span>
          <div className="flex gap-1">
            <button className="btn btn-ol btn-sm px-2">1</button>
          </div>
        </div>
      </div>

      {/* Raw Payload Inspector Modal */}
      {selectedTxForPayload && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="card-kontrol max-w-lg w-full p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[rgba(0,48,80,0.12)]">
              <div>
                <h3 className="text-[14px] font-bold text-[#003050]">
                  Payload & HMAC Signature
                </h3>
                <p className="text-[11.5px] font-mono text-[#7a9ab0]">
                  {selectedTxForPayload.transactionId} ({selectedTxForPayload.gateway})
                </p>
              </div>
              <button onClick={() => setSelectedTxForPayload(null)} className="rab">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 font-mono text-[11px]">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#7a9ab0] block mb-0.5">Signature SHA256</span>
                <div className="bg-[#F0F0F0] p-2 rounded text-[#0d1f2d] break-all border border-[rgba(0,48,80,0.12)]">
                  {selectedTxForPayload.hashSignature}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-[#7a9ab0] block mb-0.5">Payload JSON</span>
                <pre className="bg-[#003050] text-[#50B0E0] p-3 rounded-md overflow-x-auto">
                  {JSON.stringify(selectedTxForPayload.payload, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button onClick={() => setSelectedTxForPayload(null)} className="btn btn-dk btn-sm">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

