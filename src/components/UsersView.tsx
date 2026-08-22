import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  X, 
  UserPlus, 
  Trash2,
  Pen,
  MapPin,
  Phone,
  Mail,
  Zap,
  CreditCard,
  Download,
  ShieldCheck
} from 'lucide-react';
import { UserClient, UserStatus, UserRole, PaymentMethod, PlanType } from '../types';

interface UsersViewProps {
  clients: UserClient[];
  onUpdateClient: (client: UserClient) => void;
  onAddClient: (newClient: Omit<UserClient, 'id' | 'createdAt' | 'lastLogin' | 'loginHistory'>) => void;
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
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState<UserClient | null>(null);

  // Form State
  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Sénégal');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('orange_money');

  // Filter clients
  const filteredClients = clients.filter(c => {
    const term = search.toLowerCase();
    const matchesSearch = (c.name || '').toLowerCase().includes(term) || 
                          (c.company || '').toLowerCase().includes(term) ||
                          (c.email || '').toLowerCase().includes(term) ||
                          (c.phone || '').toLowerCase().includes(term) ||
                          (c.country || '').toLowerCase().includes(term) ||
                          (c.address || '').toLowerCase().includes(term) ||
                          (c.id && c.id.toLowerCase().includes(term));
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesCountry = countryFilter === 'all' || (c.country || '').toLowerCase().includes(countryFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesCountry;
  });

  const toggleClientStatus = (client: UserClient) => {
    const nextStatus: UserStatus = client.status === 'active' ? 'suspended' : 'active';
    onUpdateClient({
      ...client,
      status: nextStatus,
      mrr: nextStatus === 'active' ? 15000 : 0
    });
  };

  const handleOpenAdd = () => {
    setCompany('');
    setName('');
    setEmail('');
    setPhone('');
    setCountry('Sénégal');
    setAddress('');
    setPaymentMethod('orange_money');
    setEditingClient(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (client: UserClient) => {
    setCompany(client.company || '');
    setName(client.name || '');
    setEmail(client.email || '');
    setPhone(client.phone || '');
    setCountry(client.country || 'Sénégal');
    setAddress(client.address || '');
    setPaymentMethod(client.paymentMethod || 'orange_money');
    setEditingClient(client);
    setShowAddModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim()) return;

    if (editingClient) {
      onUpdateClient({
        ...editingClient,
        company: company.trim(),
        name: name.trim() || company.trim(),
        email: email.trim(),
        phone: phone.trim(),
        country: country.trim(),
        address: address.trim(),
        paymentMethod,
        plan: 'STANDARD',
        mrr: editingClient.status === 'active' ? 15000 : 0
      });
    } else {
      onAddClient({
        company: company.trim(),
        name: name.trim() || company.trim(),
        email: email.trim(),
        phone: phone.trim(),
        country: country.trim(),
        address: address.trim(),
        status: 'active',
        role: 'client_admin',
        plan: 'STANDARD',
        paymentMethod,
        mrr: 15000
      });
    }

    setShowAddModal(false);
  };

  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(val);
  };

  const exportCSV = () => {
    const headers = ['ID', 'Entreprise', 'Contact', 'Email', 'Téléphone', 'Pays', 'Adresse', 'Statut', 'Plan', 'Tarif Mensuel', 'Passerelle'];
    const rows = filteredClients.map(c => [
      c.id,
      `"${c.company}"`,
      `"${c.name}"`,
      `"${c.email}"`,
      `"${c.phone}"`,
      `"${c.country}"`,
      `"${c.address}"`,
      c.status,
      c.plan,
      '15 000 FCFA',
      c.paymentMethod
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kontrol_entreprises_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Table Card */}
      <div className="card-kontrol">
        {/* Header */}
        <div className="card-hd flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 border-b border-[rgba(0,48,80,0.12)]">
          <div>
            <div className="card-title flex items-center gap-2 text-[14px] font-bold text-[#003050]">
              <Building2 className="w-4 h-4 text-[#50B0E0]" />
              Entreprises & Clients KONTROL
            </div>
            <div className="card-sub text-[11.5px] text-[#7a9ab0]">
              Base de données réelle Firestore ({clients.length} entreprises enregistrées)
            </div>
          </div>
          <div className="btns flex items-center gap-2 w-full sm:w-auto justify-end">
            <button onClick={exportCSV} className="btn btn-ol btn-sm">
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
            <button 
              onClick={handleOpenAdd}
              className="btn btn-or btn-sm font-bold"
            >
              <UserPlus className="w-3.5 h-3.5" />
              + Ajouter une entreprise
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
                placeholder="Rechercher par nom d'entreprise, email, téléphone, ville, pays ou ID..."
                className="w-full bg-transparent border-none text-[12.5px] text-[#0d1f2d] outline-none"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto bg-[#FFFFFF] border border-[rgba(0,48,80,0.12)] rounded-[7px] px-2.5 py-1.5 text-[12px] text-[#0d1f2d] outline-none"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="suspended">Suspendu / Inactif</option>
            </select>
            <select 
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full sm:w-auto bg-[#FFFFFF] border border-[rgba(0,48,80,0.12)] rounded-[7px] px-2.5 py-1.5 text-[12px] text-[#0d1f2d] outline-none"
            >
              <option value="all">Tous les pays</option>
              <option value="Sénégal">Sénégal</option>
              <option value="Côte d'Ivoire">Côte d'Ivoire</option>
              <option value="Cameroun">Cameroun</option>
              <option value="Mali">Mali</option>
              <option value="Gabon">Gabon</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="tbl-wrap overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#F0F0F0] border-b border-[rgba(0,48,80,0.12)] text-[10.5px] font-semibold uppercase tracking-wider text-[#7a9ab0] text-left">
                <th className="p-3 pl-4">Nom de l'Entreprise</th>
                <th className="p-3">Email & Contact</th>
                <th className="p-3">Pays & Adresse</th>
                <th className="p-3">Statut</th>
                <th className="p-3">Abonnement</th>
                <th className="p-3">Passerelle</th>
                <th className="p-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,48,80,0.12)]">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#7a9ab0] text-[13px]">
                    Aucune entreprise trouvée pour ces critères.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-[#f6fafd] transition-colors">
                    {/* Nom de l'entreprise */}
                    <td className="p-3 pl-4">
                      <div className="font-bold text-[#003050] flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#50B0E0]" />
                        <span>{client.company || 'Sans nom'}</span>
                      </div>
                      <div className="text-[11.5px] text-[#7a9ab0]">{client.name}</div>
                      <div className="text-[9.5px] font-mono text-[#7a9ab0]/70 truncate max-w-[120px]">
                        ID: {client.id}
                      </div>
                    </td>

                    {/* Email & Contact */}
                    <td className="p-3">
                      <div className="flex items-center gap-1.5 text-[12px] text-[#2d4a60]">
                        <Mail className="w-3 h-3 text-[#50B0E0] shrink-0" />
                        <span>{client.email || '—'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#7a9ab0] mt-0.5">
                        <Phone className="w-3 h-3 text-[#E06020] shrink-0" />
                        <span>{client.phone || '—'}</span>
                      </div>
                    </td>

                    {/* Pays & Adresse */}
                    <td className="p-3">
                      <div className="text-[12px] font-semibold text-[#0d1f2d]">
                        {client.country || 'Sénégal'}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-[#7a9ab0] mt-0.5 truncate max-w-[180px]">
                        <MapPin className="w-3 h-3 text-[#50B0E0] shrink-0" />
                        <span title={client.address}>{client.address || 'Siège social'}</span>
                      </div>
                    </td>

                    {/* Statut */}
                    <td className="p-3">
                      <span className={`badge ${
                        client.status === 'active' ? 'b-actif' : 'b-attente'
                      }`}>
                        {client.status === 'active' ? 'Actif' : 'Suspendu'}
                      </span>
                    </td>

                    {/* Type d'abonnement : STANDARD 15 000 FCFA */}
                    <td className="p-3">
                      <span className="badge b-premium font-bold">
                        STANDARD (15 000 FCFA/m)
                      </span>
                    </td>

                    {/* Passerelle GeniuSPay */}
                    <td className="p-3">
                      <div className="flex items-center gap-1 text-[11.5px] font-semibold text-[#003050]">
                        <Zap className="w-3 h-3 text-[#50B0E0]" />
                        <span>
                          {client.paymentMethod === 'orange_money' ? 'Orange Money (GeniuSPay)' :
                           client.paymentMethod === 'mtn_money' ? 'MTN MoMo (GeniuSPay)' :
                           client.paymentMethod === 'wave' ? 'Wave (GeniuSPay)' :
                           client.paymentMethod === 'card' ? 'Carte Bancaire (GeniuSPay)' : 'GeniuSPay'}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-3 pr-4 text-right">
                      <div className="ra justify-end">
                        <button 
                          onClick={() => handleOpenEdit(client)}
                          className="rab edit"
                          title="Modifier l'entreprise & coordonnées"
                        >
                          <Pen className="w-3.5 h-3.5" />
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
                          title="Supprimer de Firestore"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Foot */}
        <div className="tbl-foot flex items-center justify-between p-3 border-t border-[rgba(0,48,80,0.12)] text-[11.5px] text-[#7a9ab0] bg-[#F8FAFC]">
          <span>{filteredClients.length} entreprise(s) enregistrée(s)</span>
          <div className="flex items-center gap-1 font-mono text-[10px] text-[#003050]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Synchronisé en direct avec Firestore</span>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleFormSubmit} className="card-kontrol max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[rgba(0,48,80,0.12)]">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#50B0E0]" />
                <h3 className="text-[14px] font-bold text-[#003050]">
                  {editingClient ? 'Modifier les Coordonnées' : 'Enregistrer une Entreprise'}
                </h3>
              </div>
              <button type="button" onClick={() => setShowAddModal(false)} className="rab">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Nom de l'entreprise */}
              <div>
                <label className="block text-[11px] font-bold text-[#003050] uppercase mb-1">
                  Nom de l'Entreprise *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: SONATEL, Agro Dakar, Sahel Logistics..."
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] p-2 text-[12.5px] outline-none focus:border-[#50B0E0]"
                />
              </div>

              {/* Contact / Nom & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#003050] uppercase mb-1">
                    Nom du Contact
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Amadou Diallo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] p-2 text-[12.5px] outline-none focus:border-[#50B0E0]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#003050] uppercase mb-1">
                    Email de Contact *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="contact@entreprise.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] p-2 text-[12.5px] outline-none focus:border-[#50B0E0]"
                  />
                </div>
              </div>

              {/* Téléphone & Pays */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#003050] uppercase mb-1">
                    Numéro de Téléphone
                  </label>
                  <input
                    type="text"
                    placeholder="+221 77 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] p-2 text-[12.5px] outline-none focus:border-[#50B0E0]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#003050] uppercase mb-1">
                    Pays
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] p-2 text-[12.5px] outline-none focus:border-[#50B0E0]"
                  >
                    <option value="Sénégal">Sénégal</option>
                    <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                    <option value="Cameroun">Cameroun</option>
                    <option value="Mali">Mali</option>
                    <option value="Gabon">Gabon</option>
                    <option value="Guinée">Guinée</option>
                    <option value="Togo">Togo</option>
                    <option value="Bénin">Bénin</option>
                    <option value="Burkina Faso">Burkina Faso</option>
                    <option value="France">France</option>
                  </select>
                </div>
              </div>

              {/* Adresse Physique / Siège */}
              <div>
                <label className="block text-[11px] font-bold text-[#003050] uppercase mb-1">
                  Adresse / Siège Social
                </label>
                <input
                  type="text"
                  placeholder="Ex: 45 Avenue Hassan II, Plateau, Dakar"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] p-2 text-[12.5px] outline-none focus:border-[#50B0E0]"
                />
              </div>

              {/* Abonnement & Moyen de Paiement GeniuSPay */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#003050] uppercase mb-1">
                    Type d'abonnement
                  </label>
                  <div className="bg-white border border-[#50B0E0] rounded-[6px] p-2 text-[12px] font-bold text-[#003050] flex items-center justify-between">
                    <span>STANDARD</span>
                    <span className="text-[#50B0E0]">15 000 FCFA/m</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#003050] uppercase mb-1">
                    Moyen de Paiement
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] p-2 text-[12.5px] outline-none focus:border-[#50B0E0]"
                  >
                    <option value="orange_money">Orange Money (GeniuSPay)</option>
                    <option value="mtn_money">MTN Mobile Money (GeniuSPay)</option>
                    <option value="wave">Wave (GeniuSPay)</option>
                    <option value="card">Carte Bancaire (GeniuSPay)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[rgba(0,48,80,0.12)]">
              <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-ol btn-sm">
                Annuler
              </button>
              <button type="submit" className="btn btn-or btn-sm font-bold">
                {editingClient ? 'Enregistrer les modifications' : 'Créer dans Firestore'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
