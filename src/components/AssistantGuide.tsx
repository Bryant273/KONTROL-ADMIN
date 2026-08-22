import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  CheckCircle2, 
  ArrowRight, 
  Bot, 
  HelpCircle, 
  Compass, 
  Zap, 
  CheckSquare, 
  Square,
  ChevronUp,
  ChevronDown,
  MessageSquareText
} from 'lucide-react';

interface AssistantGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: any) => void;
  urgentTicketsCount: number;
  expiringSubsCount: number;
}

export const AssistantGuide: React.FC<AssistantGuideProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  urgentTicketsCount,
  expiringSubsCount
}) => {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Contrôler les bordereaux de paiement GeniuSPay', completed: true, tab: 'payments' },
    { id: '2', title: `Traiter les ${urgentTicketsCount} tickets SLA urgents en attente`, completed: false, tab: 'support' },
    { id: '3', title: `Vérifier les ${expiringSubsCount} abonnements arrivant à échéance`, completed: false, tab: 'subscriptions' },
    { id: '4', title: 'Valider les variables du template Facture Standard v2.1', completed: false, tab: 'templates' },
  ]);

  const [customPrompt, setCustomPrompt] = useState('');
  const [assistantReply, setAssistantReply] = useState<string | null>(null);

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAskAssistant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt) return;

    if (customPrompt.toLowerCase().includes('ticket') || customPrompt.toLowerCase().includes('sla')) {
      setAssistantReply("J'ai identifié 1 ticket urgent en attente. Voulez-vous ouvrir le module Support pour répondre au client ?");
    } else if (customPrompt.toLowerCase().includes('mrr') || customPrompt.toLowerCase().includes('chiffre') || customPrompt.toLowerCase().includes('revenu')) {
      setAssistantReply("Tous les forfaits sont sur la formule STANDARD à 15 000 FCFA/mois via le moyen de paiement GeniuSPay (Orange Money, MTN, Wave).");
    } else {
      setAssistantReply(`Supervision KONTROL: Le moyen de paiement GeniuSPay et les abonnements sont opérationnels.`);
    }
    setCustomPrompt('');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xs z-40 transition-opacity"
      />

      {/* Solid Slide-over Panel on Right */}
      <div className="fixed inset-y-0 right-0 z-50 max-w-sm w-full bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="h-14 px-4 bg-[#002845] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#3B96D2]/20 text-[#50B0E0] flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-[13px] leading-tight">
                Supervision KONTROL
              </h3>
              <p className="text-[10px] text-slate-300">
                Pilotage & Vérifications Admin
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1 text-slate-300 hover:text-white rounded-md hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Checklist Progress Bar */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#002845]">
              <span>Checklist Opérationnelle</span>
              <span className="font-mono text-[#3B96D2]">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#3B96D2] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Interactive Tasks */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Tâches recommandées
            </div>
            {tasks.map((task) => (
              <div 
                key={task.id}
                className={`p-2.5 rounded-lg border flex items-center justify-between text-[11.5px] font-medium transition-colors ${
                  task.completed ? 'bg-slate-50 border-slate-100 text-slate-400 line-through' : 'bg-white border-slate-200 text-[#002845]'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <button onClick={() => toggleTask(task.id)} className="text-slate-400 hover:text-[#3B96D2]">
                    {task.completed ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Square className="w-4 h-4" />}
                  </button>
                  <span className="truncate">{task.title}</span>
                </div>
                <button
                  onClick={() => {
                    onNavigateTab(task.tab);
                    onClose();
                  }}
                  className="text-[#3B96D2] hover:underline text-[10.5px] font-bold shrink-0 ml-1.5"
                >
                  Ouvrir
                </button>
              </div>
            ))}
          </div>

          {/* Assistant Prompt Reply if any */}
          {assistantReply && (
            <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-lg text-[11.5px] text-[#002845] space-y-1">
              <div className="font-bold text-[#002845] flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-[#3B96D2]" /> Diagnostic Supervision
              </div>
              <p className="leading-relaxed text-slate-700">{assistantReply}</p>
            </div>
          )}
        </div>

        {/* Footer Question Box */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 shrink-0">
          <form onSubmit={handleAskAssistant} className="flex items-center gap-1.5">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Poser une question de contrôle..."
              className="w-full bg-white text-[12px] border border-slate-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#3B96D2]"
            />
            <button
              type="submit"
              className="btn btn-dk btn-sm py-1.5 px-2.5 shrink-0"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
