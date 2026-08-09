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
  ChevronRight
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
      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={onCloseMobileMenu}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-40
        w-[240px] bg-[#003050] text-white/80
        h-screen flex flex-col justify-between shrink-0
        transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header with SVG Logo */}
        <div className="h-[56px] flex items-center px-[18px] border-b border-white/10 shrink-0 gap-[10px]">
          <div className="flex items-center gap-2.5">
            <Logo size={32} />
            <span className="font-extrabold text-[15px] tracking-tight text-white font-sans">KONTROL</span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-0.5">
          {/* Section: Pilotage */}
          <div className="text-[10px] font-semibold tracking-wider uppercase color-white/20 px-2.5 pt-2 pb-1 text-white/40">
            Pilotage
          </div>
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-[7px] text-[13px] transition-all cursor-pointer ${
              activeTab === 'dashboard' ? 'bg-[#50B0E0]/20 text-[#50B0E0] font-medium' : 'text-white/50 hover:bg-white/10 hover:text-white/90'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Dashboard</span>
          </button>

          {/* Section: Gestion */}
          <div className="text-[10px] font-semibold tracking-wider uppercase color-white/20 px-2.5 pt-3 pb-1 text-white/40">
            Gestion
          </div>
          <button
            onClick={() => handleNavClick('users')}
            className={`flex items-center justify-between px-3 py-2 rounded-[7px] text-[13px] transition-all cursor-pointer ${
              activeTab === 'users' ? 'bg-[#50B0E0]/20 text-[#50B0E0] font-medium' : 'text-white/50 hover:bg-white/10 hover:text-white/90'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 shrink-0" />
              <span>Utilisateurs</span>
            </div>
            {totalUsersCount > 0 && (
              <span className="bg-white/10 text-white/70 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {totalUsersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNavClick('subscriptions')}
            className={`flex items-center justify-between px-3 py-2 rounded-[7px] text-[13px] transition-all cursor-pointer ${
              activeTab === 'subscriptions' ? 'bg-[#50B0E0]/20 text-[#50B0E0] font-medium' : 'text-white/50 hover:bg-white/10 hover:text-white/90'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-4 h-4 shrink-0" />
              <span>Abonnements</span>
            </div>
            {expiringSubscriptionsCount > 0 && (
              <span className="bg-[#E06020] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {expiringSubscriptionsCount} exp.
              </span>
            )}
          </button>

          <button
            onClick={() => handleNavClick('payments')}
            className={`flex items-center justify-between px-3 py-2 rounded-[7px] text-[13px] transition-all cursor-pointer ${
              activeTab === 'payments' ? 'bg-[#50B0E0]/20 text-[#50B0E0] font-medium' : 'text-white/50 hover:bg-white/10 hover:text-white/90'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Banknote className="w-4 h-4 shrink-0" />
              <span>Paiements</span>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
              OM/MTN
            </span>
          </button>

          <button
            onClick={() => handleNavClick('templates')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-[7px] text-[13px] transition-all cursor-pointer ${
              activeTab === 'templates' ? 'bg-[#50B0E0]/20 text-[#50B0E0] font-medium' : 'text-white/50 hover:bg-white/10 hover:text-white/90'
            }`}
          >
            <FileCode className="w-4 h-4 shrink-0" />
            <span>Templates</span>
          </button>

          {/* Section: Support */}
          <div className="text-[10px] font-semibold tracking-wider uppercase color-white/20 px-2.5 pt-3 pb-1 text-white/40">
            Support
          </div>
          <button
            onClick={() => handleNavClick('support')}
            className={`flex items-center justify-between px-3 py-2 rounded-[7px] text-[13px] transition-all cursor-pointer ${
              activeTab === 'support' ? 'bg-[#50B0E0]/20 text-[#50B0E0] font-medium' : 'text-white/50 hover:bg-white/10 hover:text-white/90'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Headphones className="w-4 h-4 shrink-0" />
              <span>Tickets Support</span>
            </div>
            {pendingTicketsCount > 0 && (
              <span className="bg-[#E06020] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {pendingTicketsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNavClick('audit')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-[7px] text-[13px] transition-all cursor-pointer ${
              activeTab === 'audit' ? 'bg-[#50B0E0]/20 text-[#50B0E0] font-medium' : 'text-white/50 hover:bg-white/10 hover:text-white/90'
            }`}
          >
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Audit Trail</span>
          </button>
        </div>

        {/* User Card Foot */}
        <div className="p-2 border-t border-white/10 shrink-0">
          <div className="flex items-center gap-2.5 p-2 rounded-[8px] hover:bg-white/5 cursor-pointer transition-colors">
            <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-[#50B0E0] to-[#E06020] text-white font-bold text-[11px] flex items-center justify-center shrink-0">
              SA
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[12.5px] font-medium text-white truncate">Super Admin</div>
              <div className="text-[10.5px] text-white/35 truncate">Administrateur</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

