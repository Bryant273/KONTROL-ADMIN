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
  Sparkles,
  Bot
} from 'lucide-react';
import { SupportTicket, TicketMessage } from '../types';

interface SupportViewProps {
  tickets: SupportTicket[];
  onUpdateTicket: (tkt: SupportTicket) => void;
}

export const SupportView: React.FC<SupportViewProps> = ({
  tickets,
  onUpdateTicket
}) => {
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  // Conversation reply state
  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.clientName.toLowerCase().includes(search.toLowerCase()) ||
                          t.company.toLowerCase().includes(search.toLowerCase()) ||
                          t.subject.toLowerCase().includes(search.toLowerCase()) ||
                          t.ticketNumber.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText || !selectedTicket) return;

    const newMsg: TicketMessage = {
      id: `msg_${Date.now()}`,
      sender: 'Agent Support Admin KONTROL',
      isAgent: true,
      content: replyText,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isInternalNote: isInternalNote
    };

    const updatedTkt: SupportTicket = {
      ...selectedTicket,
      status: 'in_progress',
      messages: [...selectedTicket.messages, newMsg]
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

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 card-kontrol p-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[#003050]">
              Support Client & Monitoring SLA
            </h1>
            <span className="badge bg-[#fdf0ee] text-[#c0392b]">
              Engagement SLA 1h
            </span>
          </div>
          <p className="text-[12px] text-[#7a9ab0] mt-0.5">
            Traitement des requêtes d'assistance, assignation d'experts et notes internes confidentielles.
          </p>
        </div>
      </div>

      {/* SLA Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="card-kontrol p-3.5 flex items-center gap-3">
          <div className="p-2.5 bg-[#50B0E0]/15 text-[#50B0E0] rounded-[8px]">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10.5px] font-semibold text-[#7a9ab0] uppercase">Temps Réponse Moyen</div>
            <div className="text-[18px] font-extrabold text-[#003050] font-mono">18 minutes</div>
            <div className="text-[10.5px] text-[#1a7a45] font-medium">Conforme objectif &lt; 60 min</div>
          </div>
        </div>

        <div className="card-kontrol p-3.5 flex items-center gap-3">
          <div className="p-2.5 bg-[#e8f7ef] text-[#1a7a45] rounded-[8px]">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10.5px] font-semibold text-[#7a9ab0] uppercase">Taux de Résolution SLA</div>
            <div className="text-[18px] font-extrabold text-[#003050] font-mono">98.4 %</div>
            <div className="text-[10.5px] text-[#7a9ab0]">124 tickets résolus ce mois</div>
          </div>
        </div>

        <div className="card-kontrol p-3.5 flex items-center gap-3">
          <div className="p-2.5 bg-[#fdf0ee] text-[#c0392b] rounded-[8px]">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10.5px] font-semibold text-[#7a9ab0] uppercase">Dépassements SLA</div>
            <div className="text-[18px] font-extrabold text-[#003050] font-mono">0 critique</div>
            <div className="text-[10.5px] text-[#7a9ab0]">File sous contrôle strict</div>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="card-kontrol p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <div className="fsrch flex-1 flex items-center gap-2 bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[7px] px-2.5 py-1.5">
          <Search className="w-3.5 h-3.5 text-[#7a9ab0] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="N° ticket, client, sujet..."
            className="w-full bg-transparent border-none text-[13px] text-[#0d1f2d] outline-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full sm:w-auto bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[7px] px-2.5 py-1.5 text-[12.5px] text-[#0d1f2d] outline-none"
          >
            <option value="all">Toutes les priorités</option>
            <option value="urgent">Urgent</option>
            <option value="high">Élevé</option>
            <option value="normal">Normal</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[7px] px-2.5 py-1.5 text-[12.5px] text-[#0d1f2d] outline-none"
          >
            <option value="all">Tous les statuts</option>
            <option value="open">Ouvert</option>
            <option value="in_progress">En cours</option>
            <option value="resolved">Résolu</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="tbl-card">
        <div className="tbl-wrap overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#F0F0F0] border-b border-[rgba(0,48,80,0.12)] text-[10.5px] font-semibold uppercase tracking-wider text-[#7a9ab0]">
                <th className="p-3 pl-4">N° Ticket & Priorité</th>
                <th className="p-3">Sujet & Client</th>
                <th className="p-3">Assigné A</th>
                <th className="p-3">Décompte SLA</th>
                <th className="p-3">Statut</th>
                <th className="p-3 pr-4 text-right">Actions Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,48,80,0.12)] text-[#0d1f2d]">
              {filteredTickets.map((tkt) => (
                <tr key={tkt.id} className="hover:bg-[#f6fafd] transition-colors">
                  {/* Ticket Number & Priority */}
                  <td className="p-3 pl-4">
                    <div className="font-mono text-[#003050] font-bold text-[12px]">
                      {tkt.ticketNumber}
                    </div>
                    <span className={`badge ${
                      tkt.priority === 'urgent' ? 'b-attente' : 'b-standard'
                    }`}>
                      {tkt.priority}
                    </span>
                  </td>

                  {/* Subject & Client */}
                  <td className="p-3">
                    <div className="font-semibold text-[#0d1f2d] line-clamp-1">{tkt.subject}</div>
                    <div className="text-[11px] text-[#7a9ab0]">{tkt.clientName} ({tkt.company})</div>
                  </td>

                  {/* Agent Assigned */}
                  <td className="p-3">
                    <div className="text-[12px] font-medium text-[#2d4a60] flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-[#50B0E0]" />
                      {tkt.assignedTo}
                    </div>
                  </td>

                  {/* SLA Timer */}
                  <td className="p-3">
                    {tkt.status !== 'resolved' ? (
                      <div className="badge b-attente font-mono">
                        <Clock className="w-3 h-3 text-[#b35a00]" />
                        {tkt.slaMinutesRemaining} min
                      </div>
                    ) : (
                      <span className="text-[#7a9ab0] font-mono text-[11px]">SLA Archivé</span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="p-3">
                    <span className={`badge ${
                      tkt.status === 'open' ? 'b-attente' :
                      tkt.status === 'in_progress' ? 'b-premium' : 'b-actif'
                    }`}>
                      {tkt.status === 'open' ? 'Ouvert' : tkt.status === 'in_progress' ? 'En Cours' : 'Résolu'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3 pr-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedTicket(tkt)}
                        className="btn btn-dk btn-sm py-1 px-2.5 text-[11px]"
                      >
                        <MessageSquare className="w-3 h-3 text-[#50B0E0]" />
                        Répondre
                      </button>

                      {tkt.status !== 'resolved' && (
                        <button
                          onClick={() => handleResolveTicket(tkt)}
                          className="btn btn-ok btn-sm py-1 px-2.5 text-[11px]"
                          title="Marquer comme résolu"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Résoudre
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reply & Thread Drawer Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="card-kontrol max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[rgba(0,48,80,0.12)] pb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-[#003050] text-white px-2 py-0.5 rounded">
                    {selectedTicket.ticketNumber}
                  </span>
                  <h3 className="text-[14px] font-bold text-[#003050] line-clamp-1">
                    {selectedTicket.subject}
                  </h3>
                </div>
                <p className="text-[11.5px] text-[#7a9ab0] mt-0.5">
                  Client: {selectedTicket.clientName} ({selectedTicket.company}) • Assigné à: {selectedTicket.assignedTo}
                </p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="rab">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation Messages */}
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {selectedTicket.messages.map((msg) => (
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
              ))}
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
                  <span>Note interne (masquée au client)</span>
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

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setReplyText("Bonjour, la passerelle Mobile Money est de nouveau pleinement fonctionnelle. Nous avons rejoué votre transaction avec succès.")}
                    className="btn btn-ol btn-sm py-1 px-2 text-[10.5px]"
                  >
                    + Canned: Mobile Money OK
                  </button>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTicket(null)}
                    className="btn btn-ol btn-sm"
                  >
                    Fermer
                  </button>
                  <button
                    type="submit"
                    className="btn btn-or btn-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isInternalNote ? 'Enregistrer Note' : 'Envoyer Réponse'}
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
