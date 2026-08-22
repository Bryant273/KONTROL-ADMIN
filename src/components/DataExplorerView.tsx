import React, { useState } from 'react';
import { 
  Table, 
  Search, 
  Download, 
  Eye, 
  Layers, 
  FileText, 
  Users, 
  CreditCard, 
  Banknote, 
  Headphones, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  X,
  FileCode,
  Sparkles,
  Database,
  Filter
} from 'lucide-react';
import { 
  UserClient, 
  Subscription, 
  PaymentTransaction, 
  TemplateItem, 
  SupportTicket, 
  AuditLog, 
  AdminUser 
} from '../types';

interface DataExplorerViewProps {
  clients: UserClient[];
  subscriptions: Subscription[];
  transactions: PaymentTransaction[];
  templates: TemplateItem[];
  tickets: SupportTicket[];
  adminUsers: AdminUser[];
  auditLogs: AuditLog[];
}

type TableKey = 
  | 'clients' 
  | 'subscriptions' 
  | 'transactions' 
  | 'templates' 
  | 'tickets' 
  | 'adminUsers' 
  | 'auditLogs';

export const DataExplorerView: React.FC<DataExplorerViewProps> = ({
  clients,
  subscriptions,
  transactions,
  templates,
  tickets,
  adminUsers,
  auditLogs
}) => {
  const [activeTable, setActiveTable] = useState<TableKey>('clients');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  // Table Configuration & Metadata
  const tablesMeta: Record<TableKey, { title: string; count: number; icon: React.ReactNode; desc: string }> = {
    clients: {
      title: 'Entreprises & Clients ERP',
      count: clients.length,
      icon: <Users className="w-4 h-4 text-[#50B0E0]" />,
      desc: 'Données des entreprises clientes (Raison sociale, Email, Téléphone, Adresse, Statut).'
    },
    subscriptions: {
      title: 'Abonnements & Licences',
      count: subscriptions.length,
      icon: <CreditCard className="w-4 h-4 text-[#50B0E0]" />,
      desc: 'Suivi des forfaits STANDARD à 15 000 FCFA / mois et échéances de renouvellement.'
    },
    transactions: {
      title: 'Bordereaux GeniuSPay (Abonnements)',
      count: transactions.length,
      icon: <Banknote className="w-4 h-4 text-[#50B0E0]" />,
      desc: 'Bordereaux d\'encaissement émis par GeniuSPay (Orange Money, MTN, Wave, Carte).'
    },
    templates: {
      title: 'Modèles & Templates Entreprise',
      count: templates.length,
      icon: <FileCode className="w-4 h-4 text-[#50B0E0]" />,
      desc: 'Factures, Bons de commande, Bons de livraison, Fiches de paie, Contrats & Reçus.'
    },
    tickets: {
      title: 'Tickets de Support Client',
      count: tickets.length,
      icon: <Headphones className="w-4 h-4 text-[#50B0E0]" />,
      desc: 'Demandes d\'assistance et suivi des résolutions techniques.'
    },
    adminUsers: {
      title: 'Utilisateurs Administrateurs',
      count: adminUsers.length,
      icon: <ShieldCheck className="w-4 h-4 text-[#50B0E0]" />,
      desc: 'Comptes et droits d\'accès à cette interface d\'administration.'
    },
    auditLogs: {
      title: 'Journal d\'Audit & Sécurité',
      count: auditLogs.length,
      icon: <Clock className="w-4 h-4 text-[#50B0E0]" />,
      desc: 'Traçabilité immuable des événements et actions d\'administration.'
    }
  };

  // Get Active Dataset
  const getRawData = (): any[] => {
    switch (activeTable) {
      case 'clients': return clients;
      case 'subscriptions': return subscriptions;
      case 'transactions': return transactions;
      case 'templates': return templates;
      case 'tickets': return tickets;
      case 'adminUsers': return adminUsers;
      case 'auditLogs': return auditLogs;
    }
  };

  const rawData = getRawData();

  // Filter Data with Search
  const filteredData = rawData.filter((item) => {
    if (!searchQuery.trim()) return true;
    const matchStr = JSON.stringify(item).toLowerCase();
    return matchStr.includes(searchQuery.toLowerCase());
  });

  // Extract Column Headers dynamically
  const columns = rawData.length > 0 
    ? Object.keys(rawData[0]).filter(k => k !== 'content' && k !== 'versionHistory' && k !== 'messages' && k !== 'loginHistory' && k !== 'payload') 
    : [];

  // Export handlers
  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(filteredData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kontrol_table_${activeTable}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    if (filteredData.length === 0) return;
    const headers = columns.join(',');
    const rows = filteredData.map(row => 
      columns.map(col => {
        const val = row[col] !== undefined && row[col] !== null ? String(row[col]) : '';
        return `"${val.replace(/"/g, '""')}"`;
      }).join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kontrol_table_${activeTable}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 card-kontrol p-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[8px] bg-[#003050] text-[#50B0E0] flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-[#003050]">
                Explorateur de Données & Tables KONTROL
              </h1>
              <p className="text-[12px] text-[#7a9ab0]">
                Consultation sécurisée et navigation entre toutes les données de l'interface d'administration.
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="btn btn-ol btn-sm text-[11.5px] cursor-pointer"
            title="Exporter en JSON"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>
          <button
            onClick={handleExportCSV}
            className="btn btn-ol btn-sm text-[11.5px] cursor-pointer"
            title="Exporter en CSV"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Navigation Pills Between Tables */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-2 rounded-[8px] border border-[rgba(0,48,80,0.12)]">
        {(Object.keys(tablesMeta) as TableKey[]).map((tabKey) => {
          const meta = tablesMeta[tabKey];
          const isActive = activeTable === tabKey;
          return (
            <button
              key={tabKey}
              onClick={() => {
                setActiveTable(tabKey);
                setSearchQuery('');
                setSelectedRecord(null);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-[6px] text-[12px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#003050] text-white shadow-xs'
                  : 'text-[#7a9ab0] hover:text-[#003050] hover:bg-[#F0F0F0]'
              }`}
            >
              {meta.icon}
              <span>{meta.title}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                isActive ? 'bg-[#50B0E0] text-white' : 'bg-[#F0F0F0] text-[#003050]'
              }`}>
                {meta.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Header */}
      <div className="card-kontrol p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-[#003050]" />
          <span className="text-[13px] font-bold text-[#003050]">
            Table : <strong className="text-[#50B0E0]">{tablesMeta[activeTable].title}</strong>
          </span>
          <span className="text-[11.5px] text-[#7a9ab0]">
            ({filteredData.length} enregistrements affichés)
          </span>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7a9ab0]" />
          <input
            type="text"
            placeholder="Rechercher dans cette table..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F0F0F0] text-[12px] pl-9 pr-3 py-1.5 rounded-[6px] border border-[rgba(0,48,80,0.12)] focus:outline-none focus:border-[#50B0E0]"
          />
        </div>
      </div>

      {/* Table Data View */}
      <div className="card-kontrol overflow-hidden">
        <div className="overflow-x-auto max-h-[520px]">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-[#003050] text-white uppercase text-[10.5px] tracking-wider sticky top-0 font-semibold z-10">
              <tr>
                <th className="p-3">#</th>
                {columns.map((col, idx) => (
                  <th key={idx} className="p-3 font-mono">
                    {col}
                  </th>
                ))}
                <th className="p-3 text-right">Détail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,48,80,0.08)] bg-white">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 2} className="p-8 text-center text-[#7a9ab0]">
                    Aucune donnée correspondant aux critères de recherche dans cette table.
                  </td>
                </tr>
              ) : (
                filteredData.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-[#F0F0F0]/60 transition-colors">
                    <td className="p-3 text-[#7a9ab0] font-mono text-[11px]">
                      {rIdx + 1}
                    </td>

                    {columns.map((col, cIdx) => {
                      const val = row[col];
                      return (
                        <td key={cIdx} className="p-3 font-mono text-[#003050] max-w-xs truncate">
                          {val === null || val === undefined ? (
                            <span className="text-[#7a9ab0]/50 italic">vide</span>
                          ) : typeof val === 'object' ? (
                            <span className="text-[#50B0E0]">{JSON.stringify(val).substring(0, 30)}...</span>
                          ) : typeof val === 'boolean' ? (
                            val ? (
                              <span className="text-emerald-600 font-bold">VRAI</span>
                            ) : (
                              <span className="text-slate-400 font-bold">FAUX</span>
                            )
                          ) : (
                            String(val)
                          )}
                        </td>
                      );
                    })}

                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedRecord(row)}
                        className="btn btn-ol btn-sm py-1 px-2.5 text-[11px] cursor-pointer"
                        title="Examiner la fiche complète"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#50B0E0]" />
                        <span>Voir</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Inspector Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="card-kontrol max-w-2xl w-full max-h-[85vh] flex flex-col p-4 space-y-3 shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-[rgba(0,48,80,0.12)] pb-2.5">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#50B0E0]" />
                <h3 className="text-[14px] font-bold text-[#003050]">
                  Fiche Détaillée de l'Enregistrement ({tablesMeta[activeTable].title})
                </h3>
              </div>
              <button onClick={() => setSelectedRecord(null)} className="rab">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-[12.5px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(selectedRecord).map(([key, val], idx) => {
                  if (key === 'content' || key === 'versionHistory' || key === 'messages' || key === 'loginHistory') {
                    return null;
                  }
                  return (
                    <div key={idx} className="p-2.5 rounded-[6px] bg-[#F0F0F0] border border-[rgba(0,48,80,0.06)]">
                      <div className="text-[10.5px] uppercase font-bold text-[#7a9ab0] font-mono">{key}</div>
                      <div className="font-bold text-[#003050] text-[13px] mt-0.5 break-all">
                        {val === null || val === undefined ? 'N/A' : String(val)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Raw JSON viewer */}
              <div className="pt-2">
                <div className="text-[11px] font-bold uppercase text-[#7a9ab0] mb-1 font-mono">
                  Représentation JSON Brute
                </div>
                <pre className="p-3 bg-[#001f35] text-[#90d5ff] font-mono text-[11.5px] rounded-[6px] overflow-x-auto max-h-48">
                  {JSON.stringify(selectedRecord, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[rgba(0,48,80,0.12)]">
              <button
                onClick={() => setSelectedRecord(null)}
                className="btn btn-dk btn-sm text-[12px]"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
