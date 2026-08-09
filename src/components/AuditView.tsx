import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Key, 
  Check, 
  XCircle, 
  Terminal, 
  Globe, 
  Smartphone, 
  LogOut, 
  ShieldCheck, 
  Search, 
  Filter,
  CheckCircle2,
  AlertTriangle,
  UserX
} from 'lucide-react';
import { AuditLog, ActiveSession, UserRole } from '../types';

interface AuditViewProps {
  auditLogs: AuditLog[];
  activeSessions: ActiveSession[];
  onRevokeSession: (sessionId: string) => void;
}

export const AuditView: React.FC<AuditViewProps> = ({
  auditLogs,
  activeSessions,
  onRevokeSession
}) => {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'audit' | 'sessions' | 'permissions'>('audit');

  // Role permissions matrix state
  const [permissions, setPermissions] = useState({
    super_admin: { usersCrud: true, viewFinancials: true, editTemplates: true, manageGateways: true, viewAuditLogs: true },
    financial_admin: { usersCrud: false, viewFinancials: true, editTemplates: false, manageGateways: true, viewAuditLogs: true },
    support_agent: { usersCrud: false, viewFinancials: false, editTemplates: false, manageGateways: false, viewAuditLogs: false },
    content_manager: { usersCrud: false, viewFinancials: false, editTemplates: true, manageGateways: false, viewAuditLogs: false },
  });

  const togglePermission = (role: keyof typeof permissions, permKey: keyof typeof permissions.super_admin) => {
    if (role === 'super_admin') return; // Protect Super admin
    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permKey]: !prev[role][permKey]
      }
    }));
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.actor.toLowerCase().includes(search.toLowerCase()) ||
                          log.action.toLowerCase().includes(search.toLowerCase()) ||
                          log.target.toLowerCase().includes(search.toLowerCase()) ||
                          log.ip.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 card-kontrol p-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[#003050]">
              Sécurité, Audit Trail & Sessions
            </h1>
            <span className="badge b-premium font-mono">
              AES-256
            </span>
          </div>
          <p className="text-[12px] text-[#7a9ab0] mt-0.5">
            Traçabilité immuable des actions d'administration, révocation de sessions et matrice de rôles.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-1 bg-[#F0F0F0] p-1 rounded-[8px] text-[12px]">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-[6px] font-bold transition-all ${
              activeTab === 'audit' ? 'bg-[#003050] text-white shadow-xs' : 'text-[#7a9ab0] hover:text-[#0d1f2d]'
            }`}
          >
            Audit Logs ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-3 py-1.5 rounded-[6px] font-bold transition-all ${
              activeTab === 'sessions' ? 'bg-[#003050] text-white shadow-xs' : 'text-[#7a9ab0] hover:text-[#0d1f2d]'
            }`}
          >
            Sessions ({activeSessions.length})
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`px-3 py-1.5 rounded-[6px] font-bold transition-all ${
              activeTab === 'permissions' ? 'bg-[#003050] text-white shadow-xs' : 'text-[#7a9ab0] hover:text-[#0d1f2d]'
            }`}
          >
            Matrice Rôles
          </button>
        </div>
      </div>

      {/* Tab 1: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="space-y-3">
          <div className="card-kontrol p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="fsrch flex-1 flex items-center gap-2 bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[7px] px-2.5 py-1.5">
              <Search className="w-3.5 h-3.5 text-[#7a9ab0] shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Acteur, action, cible, IP..."
                className="w-full bg-transparent border-none text-[13px] text-[#0d1f2d] outline-none"
              />
            </div>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full sm:w-auto bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[7px] px-2.5 py-1.5 text-[12.5px] text-[#0d1f2d] outline-none"
            >
              <option value="all">Toutes les sévérités</option>
              <option value="info">Info</option>
              <option value="warning">Avertissement</option>
              <option value="alert">Alerte Critique</option>
            </select>
          </div>

          <div className="tbl-card">
            <div className="tbl-wrap overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr className="bg-[#F0F0F0] border-b border-[rgba(0,48,80,0.12)] text-[10.5px] font-semibold uppercase tracking-wider text-[#7a9ab0]">
                    <th className="p-3 pl-4">Horodatage & IP</th>
                    <th className="p-3">Acteur Admin</th>
                    <th className="p-3">Action & Cible</th>
                    <th className="p-3">Signature Hash AES-256</th>
                    <th className="p-3 pr-4 text-right">Sévérité</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(0,48,80,0.12)] text-[#0d1f2d]">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#f6fafd] transition-colors">
                      <td className="p-3 pl-4 font-mono text-[11.5px] text-[#2d4a60]">
                        <div className="font-bold">{log.timestamp}</div>
                        <div className="text-[10.5px] text-[#7a9ab0]">IP: {log.ip}</div>
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-[#0d1f2d]">{log.actor}</div>
                        <span className="text-[10px] font-mono font-bold text-[#7a9ab0] uppercase">
                          {log.actorRole}
                        </span>
                      </td>

                      <td className="p-3">
                        <span className="font-mono font-bold text-[#003050] bg-[#F0F0F0] px-2 py-0.5 rounded text-[11px]">
                          {log.action}
                        </span>
                        <div className="text-[11.5px] text-[#7a9ab0] mt-0.5">
                          Target: {log.target}
                        </div>
                      </td>

                      <td className="p-3 font-mono text-[10.5px] text-[#7a9ab0] max-w-xs truncate">
                        {log.hashSignature}
                      </td>

                      <td className="p-3 pr-4 text-right">
                        <span className={`badge ${
                          log.severity === 'alert' ? 'badge bg-[#fdf0ee] text-[#c0392b]' :
                          log.severity === 'warning' ? 'b-attente' : 'b-standard'
                        }`}>
                          {log.severity.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Active Sessions */}
      {activeTab === 'sessions' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeSessions.map((sess) => (
            <div key={sess.id} className="card-kontrol p-4 space-y-3 relative">
              {sess.isCurrent && (
                <span className="absolute top-3 right-3 badge b-actif">
                  Session Actuelle
                </span>
              )}

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[8px] bg-[#003050] text-white flex items-center justify-center font-bold shrink-0">
                  <Globe className="w-4 h-4 text-[#50B0E0]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-[#0d1f2d] text-[13.5px] truncate">{sess.userName}</h3>
                  <div className="text-[11px] text-[#7a9ab0] truncate">{sess.userEmail}</div>
                </div>
              </div>

              <div className="space-y-1 bg-[#F0F0F0] p-2.5 rounded-[6px] border border-[rgba(0,48,80,0.12)] font-mono text-[11px]">
                <div className="flex justify-between text-[#7a9ab0]">
                  <span>Adresse IP:</span>
                  <strong className="text-[#0d1f2d]">{sess.ip}</strong>
                </div>
                <div className="flex justify-between text-[#7a9ab0]">
                  <span>Localisation:</span>
                  <span className="text-[#0d1f2d]">{sess.location}</span>
                </div>
                <div className="flex justify-between text-[#7a9ab0]">
                  <span>Navigateur:</span>
                  <span className="text-[#0d1f2d]">{sess.device}</span>
                </div>
                <div className="flex justify-between text-[#7a9ab0]">
                  <span>Dernière activité:</span>
                  <span className="text-[#1a7a45] font-bold">{sess.lastActive}</span>
                </div>
              </div>

              {!sess.isCurrent && (
                <button
                  onClick={() => onRevokeSession(sess.id)}
                  className="btn btn-ol w-full justify-center btn-sm text-[#c0392b] border-[#c0392b]/30 hover:bg-[#fdf0ee]"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Révoquer la Session
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Permissions Matrix */}
      {activeTab === 'permissions' && (
        <div className="tbl-card">
          <div className="card-hd p-3.5 border-b border-[rgba(0,48,80,0.12)]">
            <h2 className="card-title text-[14px] font-bold text-[#003050]">
              Matrice de Contrôle d'Accès basé sur les Rôles (RBAC)
            </h2>
            <p className="card-sub text-[11.5px] text-[#7a9ab0]">
              Définition des privilèges système attribués aux tokens JWT des administrateurs.
            </p>
          </div>

          <div className="tbl-wrap overflow-x-auto">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="bg-[#F0F0F0] border-b border-[rgba(0,48,80,0.12)] text-[10.5px] font-semibold uppercase tracking-wider text-[#7a9ab0]">
                  <th className="p-3 pl-4">Rôle Administrateur</th>
                  <th className="p-3 text-center">Gestion Clients / CRUD</th>
                  <th className="p-3 text-center">Rapports Financiers</th>
                  <th className="p-3 text-center">Édition Templates</th>
                  <th className="p-3 text-center">Config Gateways OM/MTN</th>
                  <th className="p-3 text-center">Audit Logs AES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(0,48,80,0.12)] text-[#0d1f2d]">
                {(Object.keys(permissions) as Array<keyof typeof permissions>).map((role) => (
                  <tr key={role} className="hover:bg-[#f6fafd]">
                    <td className="p-3 pl-4 font-bold text-[#003050] uppercase text-[11.5px]">
                      {String(role).replace('_', ' ')}
                    </td>

                    <td className="p-3 text-center">
                      <button 
                        onClick={() => togglePermission(role, 'usersCrud')}
                        className={`w-6 h-6 rounded inline-flex items-center justify-center ${permissions[role].usersCrud ? 'bg-[#1a7a45] text-white' : 'bg-[#e2e8f0] text-[#7a9ab0]'}`}
                      >
                        {permissions[role].usersCrud ? <Check className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      </button>
                    </td>

                    <td className="p-3 text-center">
                      <button 
                        onClick={() => togglePermission(role, 'viewFinancials')}
                        className={`w-6 h-6 rounded inline-flex items-center justify-center ${permissions[role].viewFinancials ? 'bg-[#1a7a45] text-white' : 'bg-[#e2e8f0] text-[#7a9ab0]'}`}
                      >
                        {permissions[role].viewFinancials ? <Check className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      </button>
                    </td>

                    <td className="p-3 text-center">
                      <button 
                        onClick={() => togglePermission(role, 'editTemplates')}
                        className={`w-6 h-6 rounded inline-flex items-center justify-center ${permissions[role].editTemplates ? 'bg-[#1a7a45] text-white' : 'bg-[#e2e8f0] text-[#7a9ab0]'}`}
                      >
                        {permissions[role].editTemplates ? <Check className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      </button>
                    </td>

                    <td className="p-3 text-center">
                      <button 
                        onClick={() => togglePermission(role, 'manageGateways')}
                        className={`w-6 h-6 rounded inline-flex items-center justify-center ${permissions[role].manageGateways ? 'bg-[#1a7a45] text-white' : 'bg-[#e2e8f0] text-[#7a9ab0]'}`}
                      >
                        {permissions[role].manageGateways ? <Check className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      </button>
                    </td>

                    <td className="p-3 text-center">
                      <button 
                        onClick={() => togglePermission(role, 'viewAuditLogs')}
                        className={`w-6 h-6 rounded inline-flex items-center justify-center ${permissions[role].viewAuditLogs ? 'bg-[#1a7a45] text-white' : 'bg-[#e2e8f0] text-[#7a9ab0]'}`}
                      >
                        {permissions[role].viewAuditLogs ? <Check className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
