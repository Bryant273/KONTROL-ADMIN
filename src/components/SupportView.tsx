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
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 font-jakarta tracking-tight">
              Support Client & Monitoring SLA
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black uppercase tracking-wider">
              Engagement SLA 1 heure
            </span>
          </div>
          <p className="text-[13px] font-medium text-slate-500 mt-1">
            Traitement des requêtes d'assistance, assignation d'experts et notes internes confidentielles.
          </p>
        </div>
      </div>

      {/* SLA Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-sky-50 text-[#0284C7] rounded-2xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase text-slate-400 font-mono">Temps Réponse Moyen</div>
            <div className="text-xl font-black text-slate-900 font-mono">18 minutes</div>
            <div className="text-[10.5px] text-emerald-600 font-bold">Conforme objectif &lt; 60 min</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase text-slate-400 font-mono">Taux de Résolution SLA</div>
            <div className="text-xl font-black text-slate-900 font-mono">98.4 %</div>
            <div className="text-[10.5px] text-slate-500 font-medium">124 tickets résolus ce mois</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase text-slate-400 font-mono">Dépassements SLA</div>
            <div className="text-xl font-black text-slate-900 font-mono">0 critique</div>
            <div className="text-[10.5px] text-slate-500 font-medium">File sous contrôle strict</div>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="N° ticket, client, sujet..."
            className="w-full bg-slate-50 text-[12.5px] font-medium border border-slate-200 rounded-2xl pl-9 pr-4 py-2 focus:outline-none focus:border-[#0284C7]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Priority filter */}
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-600">
            Priorité:
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-2.5 py-1.5 text-[12px] font-semibold focus:outline-none"
            >
              <option value="all">Toutes les priorités</option>
              <option value="urgent">Urgent (Rose)</option>
              <option value="high">Élevé (Ambre)</option>
              <option value="normal">Normal</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-600">
            Statut:
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-2.5 py-1.5 text-[12px] font-semibold focus:outline-none"
            >
              <option value="all">Tous les statuts</option>
              <option value="open">Ouvert</option>
              <option value="in_progress">En cours</option>
              <option value="resolved">Résolu</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10.5px] font-black uppercase text-slate-500 tracking-wider">
                <th className="p-4 pl-6">N° Ticket & Priorité</th>
                <th className="p-4">Sujet & Client</th>
                <th className="p-4">Assigné A</th>
                <th className="p-4">Décompte SLA</th>
                <th className="p-4">Statut</th>
                <th className="p-4 pr-6 text-right">Actions Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px] font-medium text-slate-800">
              {filteredTickets.map((tkt) => (
                <tr key={tkt.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Ticket Number & Priority */}
                  <td className="p-4 pl-6">
                    <div className="font-mono text-slate-900 font-extrabold text-[12px]">
                      {tkt.ticketNumber}
                    </div>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                      tkt.priority === 'urgent' ? 'bg-rose-500 text-white' :
                      tkt.priority === 'high' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {tkt.priority}
                    </span>
                  </td>

                  {/* Subject & Client */}
                  <td className="p-4">
                    <div className="font-extrabold text-slate-900 line-clamp-1">{tkt.subject}</div>
                    <div className="text-[11px] text-slate-500">{tkt.clientName} ({tkt.company})</div>
                  </td>

                  {/* Agent Assigned */}
                  <td className="p-4">
                    <div className="text-[12px] font-bold text-slate-800 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-[#0284C7]" />
                      {tkt.assignedTo}
                    </div>
                  </td>

                  {/* SLA Timer */}
                  <td className="p-4">
                    {tkt.status !== 'resolved' ? (
                      <div className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-xl text-[11px] font-mono font-extrabold inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        {tkt.slaMinutesRemaining} min
                      </div>
                    ) : (
                      <span className="text-slate-400 font-mono text-[11px]">SLA Archivé</span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      tkt.status === 'open' ? 'bg-amber-100 text-amber-800' :
                      tkt.status === 'in_progress' ? 'bg-sky-100 text-[#0284C7]' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {tkt.status === 'open' ? 'Ouvert' : tkt.status === 'in_progress' ? 'En Cours' : 'Résolu'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedTicket(tkt)}
                        className="px-3 py-1.5 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl text-[11px] font-bold transition-colors flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Répondre
                      </button>

                      {tkt.status !== 'resolved' && (
                        <button
                          onClick={() => handleResolveTicket(tkt)}
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-[11px] font-bold transition-colors flex items-center gap-1"
                          title="Marquer comme résolu"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
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
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black bg-slate-900 text-white px-2 py-0.5 rounded-full">
                    {selectedTicket.ticketNumber}
                  </span>
                  <h3 className="text-base font-black text-slate-900 font-jakarta line-clamp-1">
                    {selectedTicket.subject}
                  </h3>
                </div>
                <p className="text-[11.5px] text-slate-500 mt-0.5">
                  Client: {selectedTicket.clientName} ({selectedTicket.company}) • Assigné à: {selectedTicket.assignedTo}
                </p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="p-2 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation Messages */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {selectedTicket.messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`p-3.5 rounded-2xl border space-y-1 text-[12px] ${
                    msg.isInternalNote 
                      ? 'bg-amber-50/80 border-amber-200/80 text-amber-900' 
                      : msg.isAgent 
                      ? 'bg-sky-50/80 border-sky-200/80 text-slate-900 ml-4' 
                      : 'bg-slate-50 border-slate-200 text-slate-800 mr-4'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-[11px]">
                    <span className="flex items-center gap-1.5">
                      {msg.isInternalNote && <Lock className="w-3 h-3 text-amber-600" />}
                      {msg.sender}
                      {msg.isInternalNote && <span className="bg-amber-200 text-amber-800 text-[9px] px-1.5 py-0.2 rounded font-mono">NOTE INTERNE CONFIDENTIELLE</span>}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">{msg.timestamp}</span>
                  </div>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              ))}
            </div>

            {/* Reply Form */}
            <form onSubmit={handleSendReply} className="space-y-3 border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black uppercase text-slate-500 font-mono">
                  Rédiger une réponse support
                </label>
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isInternalNote}
                    onChange={(e) => setIsInternalNote(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500"
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
                className={`w-full text-[12.5px] p-3 rounded-2xl border focus:outline-none transition-colors ${
                  isInternalNote ? 'bg-amber-50/40 border-amber-300 focus:border-amber-500' : 'bg-slate-50 border-slate-200 focus:border-[#0284C7]'
                }`}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setReplyText("Bonjour, la passerelle Mobile Money est de nouveau pleinement fonctionnelle. Nous avons rejoué votre transaction avec succès.")}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10.5px] font-bold"
                  >
                    + Canned: Mobile Money OK
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTicket(null)}
                    className="px-4 py-2 border border-slate-200 text-slate-700 rounded-2xl text-[12px] font-bold"
                  >
                    Fermer
                  </button>
                  <button
                    type="submit"
                    className={`px-5 py-2 text-white rounded-2xl text-[12px] font-black shadow-xs flex items-center gap-1.5 ${
                      isInternalNote ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#0284C7] hover:bg-[#0369A1]'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isInternalNote ? 'Enregistrer Note' : 'Envoyer Réponses'}
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
