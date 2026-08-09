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
    { id: '1', title: 'Contrôler le bon fonctionnement d\'Orange Money & MTN', completed: true, tab: 'payments' },
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
      setAssistantReply("J'ai identifié 1 ticket urgent en attente sur MTN Mobile Money. Voulez-vous ouvrir le module Support pour répondre au client ?");
    } else if (customPrompt.toLowerCase().includes('mrr') || customPrompt.toLowerCase().includes('chiffre') || customPrompt.toLowerCase().includes('revenu')) {
      setAssistantReply("Le MRR actuel est de 29.800.000 FCFA avec une croissance de +14.2% sur les 30 derniers jours. 84% des paiements sont traités via Orange Money et MTN MoMo.");
    } else {
      setAssistantReply(`Assistant KONTROL: J'ai analysé votre requête "${customPrompt}". Toutes les passerelles Mobile Money et la base PostgreSQL sont 100% opérationnelles.`);
    }
    setCustomPrompt('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white rounded-3xl border border-slate-200 p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom-5 duration-300">
      {/* Header with Spotlight SVG Assistant Icon */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          {/* Spotlight Avatar SVG */}
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0369A1] to-[#F97316] flex items-center justify-center text-white p-1 shadow-md shadow-orange-500/20">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 stroke-current stroke-2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
              <path d="M12 3v3M12 18v3M3 12h3M18 12h3" strokeDasharray="1 2" />
            </svg>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          <div>
            <h3 className="font-black text-slate-900 text-sm font-jakarta flex items-center gap-1.5">
              Assistant Guide KONTROL
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </h3>
            <p className="text-[10.5px] font-medium text-slate-500">
              Onboarding & Supervision guidée Admin
            </p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Checklist Progress Bar */}
      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
          <span>Progression Onboarding Admin</span>
          <span className="font-mono text-[#0284C7]">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-[#0284C7] to-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Interactive Tasks */}
      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        <div className="text-[10px] font-black uppercase text-slate-400 font-mono tracking-wider px-1 mb-1">
          Tâches administratives recommandées
        </div>
        {tasks.map((task) => (
          <div 
            key={task.id}
            className={`p-2.5 rounded-xl border flex items-center justify-between text-[11.5px] font-medium transition-colors ${
              task.completed ? 'bg-slate-50 border-slate-200 text-slate-400 line-through' : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <button onClick={() => toggleTask(task.id)} className="text-slate-500 hover:text-[#0284C7]">
                {task.completed ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Square className="w-4 h-4" />}
              </button>
              <span className="line-clamp-1">{task.title}</span>
            </div>
            <button
              onClick={() => {
                onNavigateTab(task.tab);
                onClose();
              }}
              className="text-[#0284C7] hover:underline text-[10.5px] font-bold shrink-0 ml-1"
            >
              Aller
            </button>
          </div>
        ))}
      </div>

      {/* Assistant Prompt Reply if any */}
      {assistantReply && (
        <div className="p-3 bg-sky-50 border border-sky-200 rounded-2xl text-[11.5px] text-slate-800 space-y-1">
          <div className="font-extrabold text-[#0284C7] flex items-center gap-1">
            <Bot className="w-3.5 h-3.5" /> Réponse Assistant KONTROL
          </div>
          <p className="leading-relaxed">{assistantReply}</p>
        </div>
      )}

      {/* Quick AI Query Box */}
      <form onSubmit={handleAskAssistant} className="flex items-center gap-2">
        <input
          type="text"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Poser une question à l'assistant..."
          className="w-full bg-slate-50 text-[11.5px] font-medium border border-slate-200 rounded-2xl px-3 py-2 focus:outline-none focus:border-[#0284C7]"
        />
        <button
          type="submit"
          className="p-2 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-2xl shadow-xs shrink-0"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
