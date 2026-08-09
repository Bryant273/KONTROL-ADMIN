import React from 'react';
import { Logo } from './Logo';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Banknote, 
  FileCode, 
  Headphones, 
  ShieldAlert,
  ChevronRight,
  X
} from 'lucide-react';

export type NavTab = 
  | 'dashboard' 
  | 'users' 
  | 'subscriptions' 
  | 'payments' 
  | 'templates' 
  | 'support' 
  | 'audit';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pendingTicketsCount: number;
  expiringSubscriptionsCount: number;
  totalUsersCount: number;
  mobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingTicketsCount,
  expiringSubscriptionsCount,
  totalUsersCount,
  mobileMenuOpen,
  onCloseMobileMenu
}) => {
  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    onCloseMobileMenu();
  };

  return (
    <>
      {/* Mobile backdrop with smooth opacity transition */}
      <div 
        onClick={onCloseMobileMenu}
        aria-hidden="true"
        className={`fixed inset-0 bg-[#001a30]/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300 ease-in-out ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Sidebar container */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 lg:z-30
        w-[250px] sm:w-[230px] bg-[#003050] text-white/80
        h-screen flex flex-col justify-between shrink-0 overflow-hidden
        transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header with SVG Logo & Mobile Close Button */}
        <div className="h-[52px] flex items-center justify-between px-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <Logo size={28} />
            <span className="font-extrabold text-[15px] tracking-tight text-white font-sans">KONTROL</span>
          </div>

          <button
            onClick={onCloseMobileMenu}
            className="lg:hidden p-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Fermer le menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-2 py-1.5 flex flex-col gap-0.5 select-none">
          {/* Section: Pilotage */}
          <div className="text-[9.5px] font-bold tracking-wider uppercase px-2 pt-1 pb-0.5 text-white/40 font-mono">
            Pilotage
          </div>
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-[6px] text-[12.5px] transition-all cursor-pointer ${
              activeTab === 'dashboard' ? 'bg-[#50B0E0]/20 text-[#50B0E0] font-bold' : 'text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0 text-[#50B0E0]" />
            <span>Dashboard</span>
          </button>

          {/* Section: Gestion */}
          <div className="text-[9.5px] font-bold tracking-wider uppercase px-2 pt-2 pb-0.5 text-white/40 font-mono">
            Gestion
          </div>
          <button
            onClick={() => handleNavClick('users')}
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-[6px] text-[12.5px] transition-all cursor-pointer ${
              activeTab === 'users' ? 'bg-[#50B0E0]/20 text-[#50B0E0] font-bold' : 'text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 shrink-0 text-[#50B0E0]" />
              <span>Utilisateurs</span>
            </div>
            {totalUsersCount > 0 && (
              <span className="bg-white/10 text-white/80 text-[9.5px] font-bold px-1.5 py-0.2 rounded-full">
                {totalUsersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNavClick('subscriptions')}
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-[6px] text-[12.5px] transition-all cursor-pointer ${
              activeTab === 'subscriptions' ? 'bg-[#50B0E0]/20 text-[#50B0E0] font-bold' : 'text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-4 h-4 shrink-0 text-[#50B0E0]" />
              <span>Abonnements</span>
            </div>
            {expiringSubscriptionsCount > 0 && (
              <span className="bg-[#E06020] text-white text-[9.5px] font-bold px-1.5 py-0.2 rounded-full">
                {expiringSubscriptionsCount} exp.
              </span>
            )}
          </button>

          <button
            onClick={() => handleNavClick('payments')}
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-[6px] text-[12.5px] transition-all cursor-pointer ${
              activeTab === 'payments' ? 'bg-[#50B0E0]/20 text-[#50B0E0] font-bold' : 'text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Banknote className="w-4 h-4 shrink-0 text-[#50B0E0]" />
              <span>Paiements</span>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 text-[9.5px] font-bold px-1.5 py-0.2 rounded-full">
              OM/MTN
            </span>
          </button>

          <button
            onClick={() => handleNavClick('templates')}
            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-[6px] text-[12.5px] transition-all cursor-pointer ${
              activeTab === 'templates' ? 'bg-[#50B0E0]/20 text-[#50B0E0] font-bold' : 'text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <FileCode className="w-4 h-4 shrink-0 text-[#50B0E0]" />
            <span>Templates</span>
          </button>

          {/* Section: Support */}
          <div className="text-[9.5px] font-bold tracking-wider uppercase px-2 pt-2 pb-0.5 text-white/40 font-mono">
            Support
          </div>
          <button
            onClick={() => handleNavClick('support')}
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-[6px] text-[12.5px] transition-all cursor-pointer ${
              activeTab === 'support' ? 'bg-[#50B0E0]/20 text-[#50B0E0] font-bold' : 'text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Headphones className="w-4 h-4 shrink-0 text-[#50B0E0]" />
              <span>Tickets Support</span>
            </div>
            {pendingTicketsCount > 0 && (
              <span className="bg-[#E06020] text-white text-[9.5px] font-bold px-1.5 py-0.2 rounded-full">
                {pendingTicketsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNavClick('audit')}
            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-[6px] text-[12.5px] transition-all cursor-pointer ${
              activeTab === 'audit' ? 'bg-[#50B0E0]/20 text-[#50B0E0] font-bold' : 'text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4 shrink-0 text-[#50B0E0]" />
            <span>Audit Trail</span>
          </button>
        </div>

        {/* User Card Foot */}
        <div className="p-2 border-t border-white/10 shrink-0 bg-[#002540]">
          <div className="flex items-center gap-2.5 p-1.5 rounded-[6px] hover:bg-white/5 cursor-pointer transition-colors">
            <div className="w-[28px] h-[28px] rounded-full bg-gradient-to-br from-[#50B0E0] to-[#E06020] text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-xs">
              SA
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-bold text-white truncate leading-tight">Super Admin</div>
              <div className="text-[10px] text-white/50 truncate">admin@kontrol.ci</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

