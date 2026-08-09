import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  History, 
  X, 
  UserPlus, 
  Trash2,
  Pen
} from 'lucide-react';
import { UserClient, UserStatus, UserRole, PaymentMethod, PlanType } from '../types';

interface UsersViewProps {
  clients: UserClient[];
  onUpdateClient: (client: UserClient) => void;
  onAddClient: (newClient: Omit<UserClient, 'id' | 'createdAt' | 'lastLogin' | 'ip' | 'loginHistory'>) => void;
  onDeleteClient: (clientId: string) => void;
}

export const UsersView: React.FC<UsersViewProps> = ({
  clients,
  onUpdateClient,
  onAddClient,
  onDeleteClient
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [selectedClientForHistory, setSelectedClientForHistory] = useState<UserClient | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Client Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPlan, setNewPlan] = useState<PlanType>('Pro');
  const [newPaymentMethod, setNewPaymentMethod] = useState<PaymentMethod>('orange_money');

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.company.toLowerCase().includes(search.toLowerCase()) ||
                          c.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesPlan = planFilter === 'all' || c.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const toggleClientStatus = (client: UserClient) => {
    const nextStatus: UserStatus = client.status === 'active' ? 'suspended' : 'active';
    onUpdateClient({
      ...client,
      status: nextStatus
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !newCompany) return;

    onAddClient({
      name: newName,
      email: newEmail,
      company: newCompany,
      phone: newPhone || '+221 77 000 00 00',
      status: 'active',
      role: 'client_admin',
      plan: newPlan,
      paymentMethod: newPaymentMethod,
      mrr: newPlan === 'Starter' ? 75000 : newPlan === 'Pro' ? 180000 : newPlan === 'Enterprise' ? 450000 : 850000
    });

    // Reset Form
    setNewName('');
    setNewEmail('');
    setNewCompany('');
    setNewPhone('');
    setShowAddModal(false);
  };

  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-4">
      {/* Table Card */}
      <div className="tbl-card">
        {/* Header */}
        <div className="card-hd flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 border-b border-[rgba(0,48,80,0.12)]">
          <div>
            <div className="card-title flex items-center gap-2 text-[14px] font-bold text-[#003050]">
              <Users className="w-4 h-4 text-[#50B0E0]" />
              Utilisateurs & Clients
            </div>
            <div className="card-sub text-[11.5px] text-[#7a9ab0]">
              Comptes enregistrés sur la plateforme ({clients.length})
            </div>
          </div>
          <div className="btns flex items-center gap-2 w-full sm:w-auto justify-end">
            <button className="btn btn-ol btn-sm">
              Export CSV
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn btn-or btn-sm"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Ajouter
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-2.5 border-b border-[rgba(0,48,80,0.12)]">
          <div className="filter-bar flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="fsrch flex-1 flex items-center gap-2 bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[7px] px-2.5 py-1.5">
              <Search className="w-3.5 h-3.5 text-[#7a9ab0] shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un utilisateur…"
                className="w-full bg-transparent border-none text-[13px] text-[#0d1f2d] outline-none"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[7px] px-2.5 py-1.5 text-[12.5px] text-[#0d1f2d] outline-none"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="suspended">En attente / Suspendu</option>
            </select>
            <select 
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-full sm:w-auto bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[7px] px-2.5 py-1.5 text-[12.5px] text-[#0d1f2d] outline-none"
            >
              <option value="all">Tous les plans</option>
              <option value="Starter">Starter</option>
              <option value="Pro">Premium (Pro)</option>
              <option value="Enterprise">Standard / Enterprise</option>
            </select>
          </div>
        </div>

        {/* Table Wrap */}
        <div className="tbl-wrap overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#F0F0F0] border-b border-[rgba(0,48,80,0.12)] text-[10.5px] font-semibold uppercase tracking-wider text-[#7a9ab0] text-left">
                <th className="p-3 pl-4">Nom & Entreprise</th>
                <th className="p-3">Email & Contact</th>
                <th className="p-3">Statut</th>
                <th className="p-3">Abonnement</th>
                <th className="p-3">Paiement</th>
                <th className="p-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,48,80,0.12)]">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-[#f6fafd] transition-colors">
                  <td className="p-3 pl-4">
                    <div className="font-semibold text-[#0d1f2d]">{client.name}</div>
                    <div className="text-[11.5px] text-[#7a9ab0]">{client.company}</div>
                  </td>

                  <td className="p-3">
                    <div className="text-[12.5px] text-[#2d4a60]">{client.email}</div>
                    <div className="text-[10.5px] text-[#7a9ab0] font-mono">IP: {client.ip}</div>
                  </td>

                  <td className="p-3">
                    <span className={`badge ${
                      client.status === 'active' ? 'b-actif' : 'b-attente'
                    }`}>
                      {client.status === 'active' ? 'Actif' : 'Suspendu'}
                    </span>
                  </td>

                  <td className="p-3">
                    <span className={`badge ${
                      client.plan === 'Pro' ? 'b-premium' :
                      client.plan === 'Enterprise' ? 'b-standard' : 'b-trial'
                    }`}>
                      {client.plan} ({formatFCFA(client.mrr)})
                    </span>
                  </td>

                  <td className="p-3">
                    <span className="text-[11.5px] font-medium text-[#2d4a60]">
                      {client.paymentMethod === 'orange_money' ? 'Orange Money' :
                       client.paymentMethod === 'mtn_money' ? 'MTN MoMo' :
                       client.paymentMethod === 'stripe' ? 'Stripe CB' : 'PayPal'}
                    </span>
                  </td>

                  <td className="p-3 pr-4 text-right">
                    <div className="ra justify-end">
                      <button 
                        onClick={() => setSelectedClientForHistory(client)}
                        className="rab edit"
                        title="Logs & IP"
                      >
                        <History className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => toggleClientStatus(client)}
                        className="rab"
                        title={client.status === 'active' ? 'Suspendre' : 'Activer'}
                      >
                        {client.status === 'active' ? <XCircle className="w-3.5 h-3.5 text-[#b35a00]" /> : <CheckCircle2 className="w-3.5 h-3.5 text-[#1a7a45]" />}
                      </button>
                      <button 
                        onClick={() => onDeleteClient(client.id)}
                        className="rab del"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Foot */}
        <div className="tbl-foot flex items-center justify-between p-3 border-t border-[rgba(0,48,80,0.12)] text-[11.5px] text-[#7a9ab0]">
          <span>{filteredClients.length} utilisateurs affichés</span>
          <div className="flex gap-1">
            <button className="btn btn-ol btn-sm px-2">1</button>
          </div>
        </div>
      </div>

      {/* Login History Modal */}
      {selectedClientForHistory && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="card-kontrol max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[rgba(0,48,80,0.12)]">
              <div>
                <h3 className="text-[14px] font-bold text-[#003050]">
                  Historique IP - {selectedClientForHistory.name}
                </h3>
                <p className="text-[11.5px] text-[#7a9ab0]">
                  {selectedClientForHistory.company}
                </p>
              </div>
              <button onClick={() => setSelectedClientForHistory(null)} className="rab">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#003050] text-white rounded-[6px] p-3 font-mono text-[11px] space-y-2 max-h-64 overflow-y-auto">
              {selectedClientForHistory.loginHistory.map((lh, idx) => (
                <div key={idx} className="p-2 bg-white/10 rounded border border-white/10 flex justify-between">
                  <span>{lh.date} - IP: {lh.ip}</span>
                  <span className="text-[#50B0E0]">{lh.status}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-1">
              <button onClick={() => setSelectedClientForHistory(null)} className="btn btn-dk btn-sm">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreateSubmit} className="card-kontrol max-w-md w-full max-h-[90vh] overflow-y-auto p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[rgba(0,48,80,0.12)]">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#E06020]" />
                <h3 className="text-[14px] font-bold text-[#003050]">Nouveau Client</h3>
              </div>
              <button type="button" onClick={() => setShowAddModal(false)} className="rab">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-bold text-[#7a9ab0] uppercase mb-0.5">Nom</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] p-2 text-[12.5px]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#7a9ab0] uppercase mb-0.5">Email</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] p-2 text-[12.5px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#7a9ab0] uppercase mb-0.5">Entreprise</label>
                  <input
                    type="text"
                    required
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] p-2 text-[12.5px]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#7a9ab0] uppercase mb-0.5">Téléphone</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] p-2 text-[12.5px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#7a9ab0] uppercase mb-0.5">Plan</label>
                  <select
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value as PlanType)}
                    className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] p-2 text-[12.5px]"
                  >
                    <option value="Starter">Starter</option>
                    <option value="Pro">Pro</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#7a9ab0] uppercase mb-0.5">Paiement</label>
                  <select
                    value={newPaymentMethod}
                    onChange={(e) => setNewPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] p-2 text-[12.5px]"
                  >
                    <option value="orange_money">Orange Money</option>
                    <option value="mtn_money">MTN MoMo</option>
                    <option value="stripe">Stripe</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[rgba(0,48,80,0.12)]">
              <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-ol btn-sm">
                Annuler
              </button>
              <button type="submit" className="btn btn-or btn-sm">
                Créer Client
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

