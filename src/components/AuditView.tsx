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
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 font-jakarta tracking-tight">
              Sécurité, Audit Trail & Sessions
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-100 text-[10px] font-black uppercase font-mono tracking-wider">
              Chiffrement AES-256
            </span>
          </div>
          <p className="text-[13px] font-medium text-slate-500 mt-1">
            Traçabilité immuable des actions d'administration, révocation de sessions et matrice de rôles JWT.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl text-[12px] font-extrabold">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'audit' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Audit Logs ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'sessions' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sessions Actives ({activeSessions.length})
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'permissions' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Matrice de Rôles
          </button>
        </div>
      </div>

      {/* Tab 1: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Acteur, action, cible, IP..."
                className="w-full bg-slate-50 text-[12.5px] font-medium border border-slate-200 rounded-2xl pl-9 pr-4 py-2 focus:outline-none focus:border-[#0284C7]"
              />
            </div>

            <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-600">
              Sévérité:
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-2.5 py-1.5 text-[12px] font-semibold focus:outline-none"
              >
                <option value="all">Toutes</option>
                <option value="info">Info</option>
                <option value="warning">Avertissement</option>
                <option value="alert">Alerte Critique</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10.5px] font-black uppercase text-slate-500 tracking-wider">
                    <th className="p-4 pl-6">Horodatage & IP</th>
                    <th className="p-4">Acteur Admin</th>
                    <th className="p-4">Action & Cible</th>
                    <th className="p-4">Signature Hash AES-256</th>
                    <th className="p-4 pr-6 text-right">Sévérité</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[13px] font-medium text-slate-800">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 pl-6 font-mono text-[11.5px] text-slate-700">
                        <div className="font-bold">{log.timestamp}</div>
                        <div className="text-[10.5px] text-slate-400">IP: {log.ip}</div>
                      </td>

                      <td className="p-4">
                        <div className="font-extrabold text-slate-900">{log.actor}</div>
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                          {log.actorRole}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                          {log.action}
                        </span>
                        <div className="text-[11.5px] text-slate-600 mt-1 font-medium">
                          Target: {log.target}
                        </div>
                      </td>

                      <td className="p-4 font-mono text-[10.5px] text-slate-400 max-w-xs truncate">
                        {log.hashSignature}
                      </td>

                      <td className="p-4 pr-6 text-right">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          log.severity === 'alert' ? 'bg-rose-100 text-rose-800' :
                          log.severity === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeSessions.map((sess) => (
            <div key={sess.id} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3 relative">
              {sess.isCurrent && (
                <span className="absolute top-4 right-4 bg-emerald-500 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full">
                  Votre Session Actuelle
                </span>
              )}

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black">
                  <Globe className="w-5 h-5 text-[#0284C7]" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">{sess.userName}</h3>
                  <div className="text-[11px] text-slate-500 font-medium">{sess.userEmail}</div>
                </div>
              </div>

              <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-200/60 font-mono text-[11px]">
                <div className="flex justify-between text-slate-600">
                  <span>Adresse IP:</span>
                  <strong className="text-slate-900">{sess.ip}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Localisation:</span>
                  <span className="text-slate-900">{sess.location}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Navigateur:</span>
                  <span className="text-slate-900">{sess.device}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Dernière activité:</span>
                  <span className="text-emerald-600 font-bold">{sess.lastActive}</span>
                </div>
              </div>

              {!sess.isCurrent && (
                <button
                  onClick={() => onRevokeSession(sess.id)}
                  className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-2xl text-[12px] font-extrabold transition-colors flex items-center justify-center gap-1.5"
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
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 font-jakarta">
              Matrice de Contrôle d'Accès basé sur les Rôles (RBAC)
            </h2>
            <p className="text-[12px] font-medium text-slate-500">
              Définition des privilèges système attribués aux tokens JWT des administrateurs.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10.5px] font-black uppercase text-slate-500 tracking-wider">
                  <th className="p-4 pl-6">Rôle Administrateur</th>
                  <th className="p-4 text-center">Gestion Clients / CRUD</th>
                  <th className="p-4 text-center">Rapports Financiers</th>
                  <th className="p-4 text-center">Édition Templates</th>
                  <th className="p-4 text-center">Config Gateways OM/MTN</th>
                  <th className="p-4 text-center">Audit Logs AES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[13px] font-medium text-slate-800">
                {(Object.keys(permissions) as Array<keyof typeof permissions>).map((role) => (
                  <tr key={role} className="hover:bg-slate-50/80">
                    <td className="p-4 pl-6 font-bold text-slate-900 uppercase text-[11.5px]">
                      {String(role).replace('_', ' ')}
                    </td>

                    <td className="p-4 text-center">
                      <button 
                        onClick={() => togglePermission(role, 'usersCrud')}
                        className={`w-6 h-6 rounded-lg inline-flex items-center justify-center ${permissions[role].usersCrud ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}
                      >
                        {permissions[role].usersCrud ? <Check className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      </button>
                    </td>

                    <td className="p-4 text-center">
                      <button 
                        onClick={() => togglePermission(role, 'viewFinancials')}
                        className={`w-6 h-6 rounded-lg inline-flex items-center justify-center ${permissions[role].viewFinancials ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}
                      >
                        {permissions[role].viewFinancials ? <Check className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      </button>
                    </td>

                    <td className="p-4 text-center">
                      <button 
                        onClick={() => togglePermission(role, 'editTemplates')}
                        className={`w-6 h-6 rounded-lg inline-flex items-center justify-center ${permissions[role].editTemplates ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}
                      >
                        {permissions[role].editTemplates ? <Check className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      </button>
                    </td>

                    <td className="p-4 text-center">
                      <button 
                        onClick={() => togglePermission(role, 'manageGateways')}
                        className={`w-6 h-6 rounded-lg inline-flex items-center justify-center ${permissions[role].manageGateways ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}
                      >
                        {permissions[role].manageGateways ? <Check className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      </button>
                    </td>

                    <td className="p-4 text-center">
                      <button 
                        onClick={() => togglePermission(role, 'viewAuditLogs')}
                        className={`w-6 h-6 rounded-lg inline-flex items-center justify-center ${permissions[role].viewAuditLogs ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}
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
