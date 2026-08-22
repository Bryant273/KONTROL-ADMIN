import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserPlus, 
  User, 
  Mail, 
  Phone, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Edit, 
  Trash2, 
  Search, 
  Key, 
  Lock, 
  UserCheck, 
  Building2,
  X,
  Clock,
  Sparkles
} from 'lucide-react';
import { AdminUser, UserRole } from '../types';

interface AdminUsersViewProps {
  adminUsers: AdminUser[];
  onAddAdminUser: (admin: AdminUser) => void;
  onUpdateAdminUser: (admin: AdminUser) => void;
  onDeleteAdminUser: (id: string) => void;
  currentRole: UserRole;
}

export const AdminUsersView: React.FC<AdminUsersViewProps> = ({
  adminUsers,
  onAddAdminUser,
  onUpdateAdminUser,
  onDeleteAdminUser,
  currentRole
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<AdminUser>>({
    name: '',
    email: '',
    role: 'support_agent',
    status: 'active',
    phone: '',
    department: 'Support',
    permissions: ['VIEW_CLIENTS', 'MANAGE_TICKETS']
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return <span className="badge b-premium">Super Admin</span>;
      case 'financial_admin':
        return <span className="badge b-standard">Admin Financier</span>;
      case 'support_agent':
        return <span className="badge b-trial">Agent Support</span>;
      case 'content_manager':
        return <span className="badge b-danger">Gestionnaire Modèles</span>;
      default:
        return <span className="badge b-trial">Admin</span>;
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return 'Super Administrateur (Accès Total)';
      case 'financial_admin': return 'Administrateur Financier & Genius Pay';
      case 'support_agent': return 'Agent Support & Tickets';
      case 'content_manager': return 'Gestionnaire Modèles & Documents';
      default: return role;
    }
  };

  const filteredAdmins = adminUsers.filter(adm => {
    const matchSearch = adm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        adm.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        adm.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === 'all' || adm.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleSaveAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingAdmin) {
      const updated: AdminUser = {
        ...editingAdmin,
        name: formData.name || editingAdmin.name,
        email: formData.email || editingAdmin.email,
        role: (formData.role as UserRole) || editingAdmin.role,
        status: (formData.status as 'active' | 'suspended') || editingAdmin.status,
        phone: formData.phone || editingAdmin.phone,
        department: (formData.department as any) || editingAdmin.department
      };
      onUpdateAdminUser(updated);
      setEditingAdmin(null);
    } else {
      const newAdmin: AdminUser = {
        id: `adm_${Date.now().toString().slice(-4)}`,
        name: formData.name,
        email: formData.email,
        role: (formData.role as UserRole) || 'support_agent',
        status: 'active',
        lastLogin: 'Jamais connecté',
        createdAt: new Date().toISOString().split('T')[0],
        phone: formData.phone || '',
        department: (formData.department as any) || 'Support',
        permissions: formData.role === 'super_admin' 
          ? ['ALL_ACCESS'] 
          : ['VIEW_CLIENTS', 'MANAGE_TICKETS']
      };
      onAddAdminUser(newAdmin);
      setShowAddModal(false);
    }

    setFormData({
      name: '',
      email: '',
      role: 'support_agent',
      status: 'active',
      phone: '',
      department: 'Support',
      permissions: ['VIEW_CLIENTS']
    });
  };

  const openEditModal = (adm: AdminUser) => {
    setEditingAdmin(adm);
    setFormData({
      name: adm.name,
      email: adm.email,
      role: adm.role,
      status: adm.status,
      phone: adm.phone,
      department: adm.department,
      permissions: adm.permissions
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 card-kontrol p-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[8px] bg-[#003050] text-[#50B0E0] flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-[#003050]">
                Gestion des Utilisateurs Administrateurs
              </h1>
              <p className="text-[12px] text-[#7a9ab0]">
                Comptes internes et gestion des accès à l'interface d'administration KONTROL.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingAdmin(null);
            setFormData({
              name: '',
              email: '',
              role: 'support_agent',
              status: 'active',
              phone: '',
              department: 'Support',
              permissions: ['VIEW_CLIENTS']
            });
            setShowAddModal(true);
          }}
          className="btn btn-or btn-sm text-[12px] font-bold cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Ajouter un Administrateur</span>
        </button>
      </div>

      {/* Filter and Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="card-kontrol p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#003050]/10 text-[#003050] flex items-center justify-center font-bold">
            {adminUsers.length}
          </div>
          <div>
            <div className="text-[11px] uppercase font-bold text-[#7a9ab0]">Total Équipe Admin</div>
            <div className="text-[14px] font-black text-[#003050]">Comptes Actifs</div>
          </div>
        </div>

        <div className="card-kontrol p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
            {adminUsers.filter(a => a.role === 'super_admin').length}
          </div>
          <div>
            <div className="text-[11px] uppercase font-bold text-[#7a9ab0]">Super Admins</div>
            <div className="text-[14px] font-black text-[#003050]">Accès Complet</div>
          </div>
        </div>

        <div className="card-kontrol p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#50B0E0]/10 text-[#50B0E0] flex items-center justify-center font-bold">
            {adminUsers.filter(a => a.role === 'financial_admin').length}
          </div>
          <div>
            <div className="text-[11px] uppercase font-bold text-[#7a9ab0]">Pôle Finance</div>
            <div className="text-[14px] font-black text-[#003050]">Genius Pay & Factures</div>
          </div>
        </div>

        <div className="card-kontrol p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#E06020]/10 text-[#E06020] flex items-center justify-center font-bold">
            {adminUsers.filter(a => a.role === 'support_agent' || a.role === 'content_manager').length}
          </div>
          <div>
            <div className="text-[11px] uppercase font-bold text-[#7a9ab0]">Support & Modèles</div>
            <div className="text-[14px] font-black text-[#003050]">Tickets & Templates</div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="card-kontrol p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7a9ab0]" />
          <input
            type="text"
            placeholder="Rechercher par nom, email, département..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F0F0F0] text-[12.5px] pl-9 pr-3 py-1.5 rounded-[6px] border border-[rgba(0,48,80,0.12)] focus:outline-none focus:border-[#50B0E0]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[11px] font-bold text-[#7a9ab0] uppercase">Filtrer par rôle :</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] px-2.5 py-1 text-[12px] font-bold text-[#003050] focus:outline-none"
          >
            <option value="all">Tous les rôles</option>
            <option value="super_admin">Super Admin</option>
            <option value="financial_admin">Admin Financier</option>
            <option value="support_agent">Agent Support</option>
            <option value="content_manager">Gestionnaire Modèles</option>
          </select>
        </div>
      </div>

      {/* Admin Users Table */}
      <div className="card-kontrol overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12.5px]">
            <thead className="bg-[#003050] text-white uppercase text-[10.5px] tracking-wider font-semibold">
              <tr>
                <th className="p-3">Administrateur</th>
                <th className="p-3">Département</th>
                <th className="p-3">Rôle Système</th>
                <th className="p-3">Statut Compte</th>
                <th className="p-3">Dernière Connexion</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,48,80,0.08)] bg-white">
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#7a9ab0]">
                    Aucun administrateur trouvé.
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((adm) => (
                  <tr key={adm.id} className="hover:bg-[#F0F0F0]/60 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#50B0E0] to-[#E06020] text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                          {adm.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-[#003050]">{adm.name}</div>
                          <div className="text-[11px] text-[#7a9ab0] flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-[#50B0E0]" />
                            <span>{adm.email}</span>
                            {adm.phone && (
                              <>
                                <span>•</span>
                                <span>{adm.phone}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="font-bold text-[#003050] text-[12px] bg-[#F0F0F0] px-2 py-0.5 rounded-[4px]">
                        {adm.department}
                      </span>
                    </td>

                    <td className="p-3">
                      {getRoleBadge(adm.role)}
                    </td>

                    <td className="p-3">
                      {adm.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11.5px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-bold text-[11.5px] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          Suspendu
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-[#7a9ab0] text-[11.5px]">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#7a9ab0]" />
                        <span>{adm.lastLogin}</span>
                      </div>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(adm)}
                          className="p-1.5 rounded-[6px] hover:bg-[#50B0E0]/10 text-[#003050] hover:text-[#50B0E0] transition-colors cursor-pointer"
                          title="Modifier l'administrateur"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {adm.id !== 'adm_01' && (
                          <button
                            onClick={() => {
                              if (confirm(`Confirmez-vous la révocation du compte administrateur de ${adm.name} ?`)) {
                                onDeleteAdminUser(adm.id);
                              }
                            }}
                            className="p-1.5 rounded-[6px] hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                            title="Supprimer l'accès"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Modal: Add or Edit Admin User */}
      {(showAddModal || editingAdmin) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="card-kontrol max-w-lg w-full p-5 space-y-4 shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-[rgba(0,48,80,0.12)] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#50B0E0]" />
                <h3 className="text-[15px] font-bold text-[#003050]">
                  {editingAdmin ? 'Modifier le Compte Administrateur' : 'Créer un Nouvel Administrateur'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingAdmin(null);
                }}
                className="rab"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdmin} className="space-y-3 text-[12.5px]">
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#7a9ab0] mb-1">
                  Nom Complet de l'Administrateur *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Amadou Diallo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] p-2 text-[#003050] font-bold focus:outline-none focus:border-[#50B0E0]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#7a9ab0] mb-1">
                    Adresse Email Professionnelle *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="admin@kontrol.io"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] p-2 text-[#003050] focus:outline-none focus:border-[#50B0E0]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#7a9ab0] mb-1">
                    Numéro de Téléphone
                  </label>
                  <input
                    type="tel"
                    placeholder="+221 77 000 00 00"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] p-2 text-[#003050] focus:outline-none focus:border-[#50B0E0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#7a9ab0] mb-1">
                    Département
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value as any })}
                    className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] p-2 text-[#003050] font-bold focus:outline-none"
                  >
                    <option value="Direction">Direction</option>
                    <option value="Finance">Finance & Facturation</option>
                    <option value="Support">Support Client</option>
                    <option value="Produit">Produit & Modèles</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#7a9ab0] mb-1">
                    Rôle & Privilèges Système *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] p-2 text-[#003050] font-bold focus:outline-none"
                  >
                    <option value="super_admin">Super Admin (Accès Total)</option>
                    <option value="financial_admin">Admin Financier (Genius Pay)</option>
                    <option value="support_agent">Agent Support (Tickets)</option>
                    <option value="content_manager">Gestionnaire Modèles</option>
                  </select>
                </div>
              </div>

              {editingAdmin && (
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#7a9ab0] mb-1">
                    Statut du Compte
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] p-2 text-[#003050] font-bold focus:outline-none"
                  >
                    <option value="active">Actif (Accès Autorisé)</option>
                    <option value="suspended">Suspendu (Accès Bloqué)</option>
                  </select>
                </div>
              )}

              <div className="pt-3 border-t border-[rgba(0,48,80,0.12)] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingAdmin(null);
                  }}
                  className="btn btn-ol btn-sm text-[12px]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-ok btn-sm text-[12px] font-bold"
                >
                  {editingAdmin ? 'Enregistrer les Modifications' : 'Créer l\'Accès Administrateur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
