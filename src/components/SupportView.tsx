import React, { useState } from 'react';
import { 
  Headphones, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  UserCheck, 
  Lock, 
  MessageSquare, 
  Filter, 
  Search, 
  X, 
  PlusCircle,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { SupportTicket, TicketMessage } from '../types';

interface SupportViewProps {
  tickets: SupportTicket[];
  onUpdateTicket: (tkt: SupportTicket) => void;
  onAddTicket?: (tkt: SupportTicket) => void;
}

export const SupportView: React.FC<SupportViewProps> = ({
  tickets,
  onUpdateTicket,
  onAddTicket
}) => {
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New ticket state
  const [newCompany, setNewCompany] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState<'facturation' | 'technique' | 'compte' | 'intégration' | 'genius_pay'>('genius_pay');
  const [newPriority, setNewPriority] = useState<'urgent' | 'high' | 'normal' | 'low'>('normal');
  const [newInitialMsg, setNewInitialMsg] = useState('');

  // Conversation reply state
  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);

  const filteredTickets = tickets.filter(t => {
    const term = search.toLowerCase();
    const matchesSearch = (t.clientName || '').toLowerCase().includes(term) ||
                          (t.company || '').toLowerCase().includes(term) ||
                          (t.subject || '').toLowerCase().includes(term) ||
                          (t.ticketNumber || '').toLowerCase().includes(term);
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newSubject.trim()) return;

    const tktId = `tkt_${Date.now()}`;
    const newTkt: SupportTicket = {
      id: tktId,
      ticketNumber: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: newClient.trim() || newCompany.trim(),
      company: newCompany.trim(),
      subject: newSubject.trim(),
      category: newCategory,
      priority: newPriority,
      status: 'open',
      assignedTo: 'Support KONTROL',
      createdAt: new Date().toISOString().split('T')[0],
      slaMinutesRemaining: newPriority === 'urgent' ? 30 : 120,
      messages: newInitialMsg.trim() ? [
        {
          id: `msg_${Date.now()}`,
          sender: newClient.trim() || newCompany.trim(),
          isAgent: false,
          content: newInitialMsg.trim(),
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
        }
      ] : []
    };

    if (onAddTicket) {
      onAddTicket(newTkt);
    } else {
      onUpdateTicket(newTkt);
    }

    setNewCompany('');
    setNewClient('');
    setNewSubject('');
    setNewInitialMsg('');
    setShowCreateModal(false);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText || !selectedTicket) return;

    const newMsg: TicketMessage = {
      id: `msg_${Date.now()}`,
      sender: 'Agent Support KONTROL',
      isAgent: true,
      content: replyText,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isInternalNote: isInternalNote
    };

    const updatedTkt: SupportTicket = {
      ...selectedTicket,
      status: 'in_progress',
      messages: [...(selectedTicket.messages || []), newMsg]
    };

    onUpdateTicket(updatedTkt);
    setSelectedTicket(updatedTkt);
    setReplyText('');
  };

  const handleResolveTicket = (ticket: SupportTicket) => {
    const updatedTkt: SupportTicket = {
      ...ticket,
      status: 'resolved',
      slaMinutesRemaining: 0
    };
    onUpdateTicket(updatedTkt);
    if (selectedTicket?.id === ticket.id) {
      setSelectedTicket(updatedTkt);
    }
  };

  const urgentCount = tickets.filter(t => t.priority === 'urgent' && t.status !== 'resolved').length;

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 card-kontrol p-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[#003050]">
              Tickets & Assistance Client KONTROL
            </h1>
            <span className="badge b-premium">
              {tickets.length} Demandes en cours
            </span>
          </div>
          <p className="text-[12px] text-[#7a9ab0] mt-0.5">
            Traitement des requêtes, passerelle GeniuSPay & suivi du support technique
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn btn-or btn-sm font-bold"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            + Ouvrir un ticket
          </button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="card-kontrol p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-[#F8FAFC]">
        <div className="fsrch flex-1 flex items-center gap-2 bg-[#FFFFFF] border border-[rgba(0,48,80,0.12)] rounded-[7px] px-2.5 py-1.5">
          <Search className="w-3.5 h-3.5 text-[#7a9ab0] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par N° ticket, entreprise, client ou sujet..."
            className="w-full bg-transparent border-none text-[12.5px] text-[#0d1f2d] outline-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full sm:w-auto bg-[#FFFFFF] border border-[rgba(0,48,80,0.12)] rounded-[7px] px-2.5 py-1.5 text-[12px] text-[#0d1f2d] outline-none"
          >
            <option value="all">Toutes les priorités</option>
            <option value="urgent">Urgent</option>
            <option value="high">Élevé</option>
            <option value="normal">Normal</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-[#FFFFFF] border border-[rgba(0,48,80,0.12)] rounded-[7px] px-2.5 py-1.5 text-[12px] text-[#0d1f2d] outline-none"
          >
            <option value="all">Tous les statuts</option>
            <option value="open">Ouvert</option>
            <option value="in_progress">En cours</option>
            <option value="resolved">Résolu</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="card-kontrol">
        <div className="tbl-wrap overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#F0F0F0] border-b border-[rgba(0,48,80,0.12)] text-[10.5px] font-semibold uppercase tracking-wider text-[#7a9ab0]">
                <th className="p-3 pl-4">N° Ticket & Priorité</th>
                <th className="p-3">Sujet & Entreprise</th>
                <th className="p-3">Assigné À</th>
                <th className="p-3">Statut</th>
                <th className="p-3 pr-4 text-right">Actions Support</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,48,80,0.12)] text-[#0d1f2d]">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#7a9ab0] text-[12.5px]">
                    Aucun ticket support enregistré pour le moment.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((tkt) => (
                  <tr key={tkt.id} className="hover:bg-[#f6fafd] transition-colors">
                    <td className="p-3 pl-4">
                      <div className="font-mono text-[#003050] font-bold text-[12px]">
                        {tkt.ticketNumber}
                      </div>
                      <span className={`badge text-[9.5px] ${
                        tkt.priority === 'urgent' ? 'b-attente' : 'b-standard'
                      }`}>
                        {tkt.priority}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="font-semibold text-[#0d1f2d] line-clamp-1">{tkt.subject}</div>
                      <div className="text-[11.5px] text-[#7a9ab0] flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3 h-3 text-[#50B0E0]" />
                        <span className="font-medium text-[#003050]">{tkt.company}</span>
                        <span>•</span>
                        <span>{tkt.clientName}</span>
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="text-[12px] font-medium text-[#2d4a60] flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-[#50B0E0]" />
                        {tkt.assignedTo || 'Support KONTROL'}
                      </div>
                    </td>

                    <td className="p-3">
                      <span className={`badge ${
                        tkt.status === 'open' ? 'b-attente' :
                        tkt.status === 'in_progress' ? 'b-premium' : 'b-actif'
                      }`}>
                        {tkt.status === 'open' ? 'Ouvert' : tkt.status === 'in_progress' ? 'En Cours' : 'Résolu'}
                      </span>
                    </td>

                    <td className="p-3 pr-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedTicket(tkt)}
                          className="btn btn-dk btn-sm py-1 px-2.5 text-[11px]"
                        >
                          <MessageSquare className="w-3 h-3 text-[#50B0E0]" />
                          Fil de discussion ({(tkt.messages || []).length})
                        </button>

                        {tkt.status !== 'resolved' && (
                          <button
                            onClick={() => handleResolveTicket(tkt)}
                            className="btn btn-ok btn-sm py-1 px-2 text-[11px]"
                            title="Marquer comme résolu"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            Résolu
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

      {/* Modal: Nouveau Ticket */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreateSubmit} className="card-kontrol max-w-md w-full p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[rgba(0,48,80,0.12)]">
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-[#50B0E0]" />
                <h3 className="text-[14px] font-bold text-[#003050]">Créer un Ticket Support</h3>
              </div>
              <button type="button" onClick={() => setShowCreateModal(false)} className="rab">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-bold text-[#003050] uppercase mb-1">
                  Nom de l'Entreprise *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Société Générale Sénégal"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] p-2 text-[12.5px] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#003050] uppercase mb-1">
                  Contact / Demandeur
                </label>
                <input
                  type="text"
                  placeholder="Ex: Mamadou Diop"
                  value={newClient}
                  onChange={(e) => setNewClient(e.target.value)}
                  className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] p-2 text-[12.5px] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#003050] uppercase mb-1">
                  Objet de la demande *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Demande de réconciliation Genius Pay..."
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] p-2 text-[12.5px] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#003050] uppercase mb-1">
                    Catégorie
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] p-2 text-[12px] outline-none"
                  >
                    <option value="jinius_pay">JiniusPay & Paiement</option>
                    <option value="facturation">Facturation</option>
                    <option value="technique">Technique ERP</option>
                    <option value="compte">Gestion de Compte</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#003050] uppercase mb-1">
                    Priorité
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] p-2 text-[12px] outline-none"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">Élevé</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#003050] uppercase mb-1">
                  Description du problème
                </label>
                <textarea
                  rows={2}
                  value={newInitialMsg}
                  onChange={(e) => setNewInitialMsg(e.target.value)}
                  placeholder="Détaillez le besoin..."
                  className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] p-2 text-[12.5px] outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[rgba(0,48,80,0.12)]">
              <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-ol btn-sm">
                Annuler
              </button>
              <button type="submit" className="btn btn-or btn-sm font-bold">
                Créer Ticket
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reply & Thread Drawer Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="card-kontrol max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[rgba(0,48,80,0.12)] pb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-[#003050] text-[#50B0E0] px-2 py-0.5 rounded">
                    {selectedTicket.ticketNumber}
                  </span>
                  <h3 className="text-[14px] font-bold text-[#003050] line-clamp-1">
                    {selectedTicket.subject}
                  </h3>
                </div>
                <p className="text-[11.5px] text-[#7a9ab0] mt-0.5">
                  Entreprise : <strong className="text-[#003050]">{selectedTicket.company}</strong> • Contact : {selectedTicket.clientName}
                </p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="rab">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation Messages */}
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {(selectedTicket.messages || []).length === 0 ? (
                <div className="p-4 text-center text-[#7a9ab0] text-[12px]">
                  Aucun message pour le moment. Envoyez une réponse ci-dessous.
                </div>
              ) : (
                selectedTicket.messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`p-3 rounded-[6px] border space-y-1 text-[12px] ${
                      msg.isInternalNote 
                        ? 'bg-[#fff3e8] border-[rgba(224,96,32,0.2)] text-[#b35a00]' 
                        : msg.isAgent 
                        ? 'bg-[#e8f7ef] border-[#1a7a45]/20 text-[#0d1f2d] ml-2' 
                        : 'bg-[#F0F0F0] border-[rgba(0,48,80,0.12)] text-[#0d1f2d] mr-2'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-[10.5px]">
                      <span className="flex items-center gap-1.5">
                        {msg.isInternalNote && <Lock className="w-3 h-3 text-[#E06020]" />}
                        {msg.sender}
                        {msg.isInternalNote && <span className="bg-[#E06020]/20 text-[#E06020] text-[9px] px-1.5 py-0.2 rounded font-mono">NOTE INTERNE CONFIDENTIELLE</span>}
                      </span>
                      <span className="text-[#7a9ab0] font-mono text-[10px]">{msg.timestamp}</span>
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Reply Form */}
            <form onSubmit={handleSendReply} className="space-y-2.5 border-t border-[rgba(0,48,80,0.12)] pt-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[10.5px] font-bold uppercase text-[#7a9ab0] font-mono">
                  Rédiger une réponse support
                </label>
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#E06020] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isInternalNote}
                    onChange={(e) => setIsInternalNote(e.target.checked)}
                    className="rounded text-[#E06020]"
                  />
                  <span>Note interne</span>
                </label>
              </div>

              <textarea
                rows={3}
                required
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={isInternalNote ? "Saisir une note technique visible uniquement par l'équipe KONTROL..." : "Saisir la réponse au client..."}
                className={`w-full text-[12.5px] p-2.5 rounded-[6px] border outline-none transition-colors ${
                  isInternalNote ? 'bg-[#fff3e8] border-[rgba(224,96,32,0.3)]' : 'bg-[#F0F0F0] border-[rgba(0,48,80,0.12)]'
                }`}
              />

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setReplyText("Bonjour, votre abonnement STANDARD à 15 000 FCFA via GeniuSPay a bien été validé et activé.")}
                  className="btn btn-ol btn-sm py-1 px-2 text-[10.5px]"
                >
                  + Canned: Abonnement GeniuSPay OK
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTicket(null)}
                    className="btn btn-ol btn-sm"
                  >
                    Fermer
                  </button>
                  <button
                    type="submit"
                    className="btn btn-or btn-sm font-bold"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Envoyer
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
