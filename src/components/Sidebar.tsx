import React, { useState } from 'react';
import { Logo } from './Logo';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Banknote, 
  FileCode, 
  Headphones, 
  ShieldAlert,
  Database,
  ChevronRight,
  ChevronDown,
  X,
  UserCheck,
  Building2
} from 'lucide-react';
import { UserRole } from '../types';

export type NavTab = 
  | 'dashboard' 
  | 'users' 
  | 'subscriptions' 
  | 'payments' 
  | 'templates' 
  | 'support' 
  | 'admin_team'
  | 'audit'
  | 'data_explorer';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pendingTicketsCount: number;
  expiringSubscriptionsCount: number;
  totalUsersCount: number;
  totalAdminUsersCount: number;
  mobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
  currentRole: UserRole;
  userName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingTicketsCount,
  expiringSubscriptionsCount,
  totalUsersCount,
  totalAdminUsersCount,
  mobileMenuOpen,
  onCloseMobileMenu,
  currentRole,
  userName
}) => {
  // Collapsible section states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    pilotage: true,
    gestion: true,
    templates: true,
    support: true,
    donnees: true
  });

  const toggleSection = (sectionKey: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    onCloseMobileMenu();
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return 'Super Administrateur';
      case 'financial_admin': return 'Admin Financier';
      case 'support_agent': return 'Agent Support';
      case 'content_manager': return 'Gestionnaire Modèles';
      default: return 'Administrateur';
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div 
        onClick={onCloseMobileMenu}
        aria-hidden="true"
        className={`fixed inset-0 bg-[#001424]/70 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-200 ease-in-out ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Solid Left Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 lg:static
        w-60 bg-[#002138] text-slate-300
        h-screen flex flex-col justify-between shrink-0 select-none
        border-r border-[#001726] shadow-xl lg:shadow-none
        transition-transform duration-200 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header with SVG Logo & App Title */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-white/10 shrink-0 bg-[#001b2e]">
          <div className="flex items-center gap-2.5">
            <Logo size={28} />
            <div className="flex flex-col">
              <span className="font-black text-[15px] tracking-tight text-white font-sans leading-tight">KONTROL</span>
              <span className="text-[9px] font-mono text-[#50B0E0] uppercase tracking-wider font-semibold">ERP Cloud</span>
            </div>
          </div>

          <button
            onClick={onCloseMobileMenu}
            className="lg:hidden p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Fermer le menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation list with Intelligent Sections */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-3 custom-scrollbar">
          
          {/* 1. SECTION: PILOTAGE */}
          <div className="space-y-1">
            <div className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase text-slate-400 font-mono flex items-center justify-between">
              <span>Pilotage</span>
            </div>

            <div className="space-y-0.5">
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[12.5px] font-medium transition-all ${
                  activeTab === 'dashboard' 
                    ? 'bg-[#3B96D2]/20 text-[#50B0E0] font-bold shadow-xs' 
                    : 'text-slate-300 hover:bg-white/8 hover:text-white'
                }`}
              >
                <LayoutDashboard className={`w-4 h-4 shrink-0 ${activeTab === 'dashboard' ? 'text-[#50B0E0]' : 'text-slate-400'}`} />
                <span>Tableau de bord</span>
              </button>
            </div>
          </div>

          {/* 2. SECTION: GESTION & CLIENTS */}
          <div className="space-y-1 pt-1.5 border-t border-white/5">
            <div className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase text-slate-400 font-mono">
              <span>Gestion & Finances</span>
            </div>

            <div className="space-y-0.5">
              <button
                onClick={() => handleNavClick('users')}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-[12.5px] font-medium transition-all ${
                  activeTab === 'users' 
                    ? 'bg-[#3B96D2]/20 text-[#50B0E0] font-bold shadow-xs' 
                    : 'text-slate-300 hover:bg-white/8 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className={`w-4 h-4 shrink-0 ${activeTab === 'users' ? 'text-[#50B0E0]' : 'text-slate-400'}`} />
                  <span>Entreprises / Clients</span>
                </div>
                {totalUsersCount > 0 && (
                  <span className="bg-white/10 text-white/90 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {totalUsersCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('subscriptions')}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-[12.5px] font-medium transition-all ${
                  activeTab === 'subscriptions' 
                    ? 'bg-[#3B96D2]/20 text-[#50B0E0] font-bold shadow-xs' 
                    : 'text-slate-300 hover:bg-white/8 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className={`w-4 h-4 shrink-0 ${activeTab === 'subscriptions' ? 'text-[#50B0E0]' : 'text-slate-400'}`} />
                  <span>Abonnements Standard</span>
                </div>
                {expiringSubscriptionsCount > 0 && (
                  <span className="bg-[#E06020] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {expiringSubscriptionsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('payments')}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-[12.5px] font-medium transition-all ${
                  activeTab === 'payments' 
                    ? 'bg-[#3B96D2]/20 text-[#50B0E0] font-bold shadow-xs' 
                    : 'text-slate-300 hover:bg-white/8 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Banknote className={`w-4 h-4 shrink-0 ${activeTab === 'payments' ? 'text-[#50B0E0]' : 'text-slate-400'}`} />
                  <span>Bordereaux GeniuSPay</span>
                </div>
                <span className="bg-[#3B96D2]/20 text-[#50B0E0] text-[9.5px] font-bold px-1.5 py-0.2 rounded">
                  Paiements
                </span>
              </button>
            </div>
          </div>

          {/* 3. SECTION: MODÈLES & DOCUMENTS */}
          <div className="space-y-1 pt-1.5 border-t border-white/5">
            <div className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase text-slate-400 font-mono">
              <span>Documents</span>
            </div>

            <div className="space-y-0.5">
              <button
                onClick={() => handleNavClick('templates')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[12.5px] font-medium transition-all ${
                  activeTab === 'templates' 
                    ? 'bg-[#3B96D2]/20 text-[#50B0E0] font-bold shadow-xs' 
                    : 'text-slate-300 hover:bg-white/8 hover:text-white'
                }`}
              >
                <FileCode className={`w-4 h-4 shrink-0 ${activeTab === 'templates' ? 'text-[#50B0E0]' : 'text-slate-400'}`} />
                <span>Modèles de Documents</span>
              </button>
            </div>
          </div>

          {/* 4. SECTION: SUPPORT & ÉQUIPE */}
          <div className="space-y-1 pt-1.5 border-t border-white/5">
            <div className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase text-slate-400 font-mono">
              <span>Support & Administration</span>
            </div>

            <div className="space-y-0.5">
              <button
                onClick={() => handleNavClick('support')}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-[12.5px] font-medium transition-all ${
                  activeTab === 'support' 
                    ? 'bg-[#3B96D2]/20 text-[#50B0E0] font-bold shadow-xs' 
                    : 'text-slate-300 hover:bg-white/8 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Headphones className={`w-4 h-4 shrink-0 ${activeTab === 'support' ? 'text-[#50B0E0]' : 'text-slate-400'}`} />
                  <span>Support Client</span>
                </div>
                {pendingTicketsCount > 0 && (
                  <span className="bg-[#E06020] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {pendingTicketsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('admin_team')}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-[12.5px] font-medium transition-all ${
                  activeTab === 'admin_team' 
                    ? 'bg-[#3B96D2]/20 text-[#50B0E0] font-bold shadow-xs' 
                    : 'text-slate-300 hover:bg-white/8 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className={`w-4 h-4 shrink-0 ${activeTab === 'admin_team' ? 'text-[#50B0E0]' : 'text-slate-400'}`} />
                  <span>Utilisateurs Admin</span>
                </div>
                <span className="bg-white/10 text-white/90 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {totalAdminUsersCount}
                </span>
              </button>

              <button
                onClick={() => handleNavClick('audit')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[12.5px] font-medium transition-all ${
                  activeTab === 'audit' 
                    ? 'bg-[#3B96D2]/20 text-[#50B0E0] font-bold shadow-xs' 
                    : 'text-slate-300 hover:bg-white/8 hover:text-white'
                }`}
              >
                <ShieldAlert className={`w-4 h-4 shrink-0 ${activeTab === 'audit' ? 'text-[#50B0E0]' : 'text-slate-400'}`} />
                <span>Journal d'Audit</span>
              </button>
            </div>
          </div>

          {/* 5. SECTION: DONNÉES & BASE */}
          <div className="space-y-1 pt-1.5 border-t border-white/5">
            <div className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase text-slate-400 font-mono">
              <span>Système</span>
            </div>

            <div className="space-y-0.5">
              <button
                onClick={() => handleNavClick('data_explorer')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[12.5px] font-medium transition-all ${
                  activeTab === 'data_explorer' 
                    ? 'bg-[#3B96D2]/20 text-[#50B0E0] font-bold shadow-xs' 
                    : 'text-slate-300 hover:bg-white/8 hover:text-white'
                }`}
              >
                <Database className={`w-4 h-4 shrink-0 ${activeTab === 'data_explorer' ? 'text-[#50B0E0]' : 'text-slate-400'}`} />
                <span>Explorateur Données</span>
              </button>
            </div>
          </div>
        </div>

        {/* Clean Docked Footer with Admin Identity */}
        <div className="p-3 border-t border-white/10 shrink-0 bg-[#001b2e]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#50B0E0] to-[#E06020] text-white font-bold text-[11px] flex items-center justify-center shrink-0 shadow-xs">
              {userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-bold text-white truncate leading-tight">{userName}</div>
              <div className="text-[10.5px] text-[#50B0E0] truncate font-medium">{getRoleLabel(currentRole)}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
