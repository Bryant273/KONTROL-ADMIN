import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Bell, 
  Search, 
  Activity, 
  ChevronDown,
  Sparkles,
  Menu,
  X,
  Settings,
  Maximize,
  Minimize
} from 'lucide-react';
import { UserRole, GatewayStatus } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  gateways: GatewayStatus[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  unreadAlertsCount: number;
  onOpenAssistant: () => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  gateways,
  searchQuery,
  onSearchChange,
  unreadAlertsCount,
  onOpenAssistant,
  mobileMenuOpen,
  onToggleMobileMenu
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'financial_admin': return 'Admin Financier';
      case 'support_agent': return 'Agent Support';
      case 'content_manager': return 'Gestionnaire Modèles';
      case 'client_admin': return 'Client Admin';
    }
  };

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).replace(/^\w/, c => c.toUpperCase());

  return (
    <header className="h-[56px] bg-white border-b border-[rgba(0,48,80,0.12)] px-4 sm:px-6 flex justify-between items-center sticky top-0 z-30 shrink-0">
      {/* Brand & Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[11px] color-[#7a9ab0] uppercase tracking-wider font-semibold">Pilotage</span>
          <span className="text-[11px] text-[#7a9ab0]">/</span>
          <span className="text-[14px] font-bold text-[#003050]">Tableau de bord</span>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-sm mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7a9ab0]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher un utilisateur, client, ticket..."
            className="w-full bg-[#F0F0F0] text-[13px] text-[#0d1f2d] placeholder-[#7a9ab0] border border-[rgba(0,48,80,0.12)] rounded-md pl-9 pr-4 py-1.5 focus:outline-none focus:border-[#50B0E0] transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dynamic Date Badge */}
        <div className="hidden sm:block text-[11.5px] color-[#7a9ab0] px-2.5 py-1 bg-[#F0F0F0] rounded-[6px] border border-[rgba(0,48,80,0.12)] whitespace-nowrap font-medium">
          {currentDate}
        </div>

        {/* Fullscreen Toggle Button */}
        <button
          onClick={toggleFullscreen}
          className="w-8 h-8 rounded-[7px] border border-[rgba(0,48,80,0.12)] bg-white hover:bg-[#F0F0F0] flex items-center justify-center text-[#7a9ab0] hover:text-[#0d1f2d] transition-all"
          title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>

        {/* Notifications Icon */}
        <button 
          className="relative w-8 h-8 rounded-[7px] border border-[rgba(0,48,80,0.12)] bg-white hover:bg-[#F0F0F0] flex items-center justify-center text-[#7a9ab0] hover:text-[#0d1f2d] transition-all"
          title="Notifications & Alertes SLA"
        >
          <Bell className="w-4 h-4" />
          {unreadAlertsCount > 0 && (
            <span className="absolute top-[6px] right-[6px] w-[7px] h-[7px] rounded-full bg-[#E06020] border-[1.5px] border-white" />
          )}
        </button>

        {/* User Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 p-1.5 sm:pr-3 rounded-[8px] border border-[rgba(0,48,80,0.12)] hover:bg-[#F0F0F0] transition-colors"
          >
            <div className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-[#50B0E0] to-[#E06020] text-white font-bold text-[10px] flex items-center justify-center shrink-0">
              SA
            </div>
            <span className="hidden sm:inline text-[13px] font-medium text-[#0d1f2d]">{getRoleLabel(currentRole)}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#7a9ab0]" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[rgba(0,48,80,0.12)] rounded-[8px] shadow-lg py-2 z-50">
              <div className="px-3 py-1.5 border-b border-[rgba(0,48,80,0.08)] text-[10px] font-black uppercase text-[#7a9ab0] tracking-wider">
                Changer de rôle admin
              </div>
              {(['super_admin', 'financial_admin', 'support_agent', 'content_manager'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    onRoleChange(r);
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-[12px] font-medium hover:bg-[#F0F0F0] flex items-center justify-between ${
                    currentRole === r ? 'text-[#50B0E0] font-bold bg-[#e8f7ef]/30' : 'text-[#0d1f2d]'
                  }`}
                >
                  <span>{getRoleLabel(r)}</span>
                  {currentRole === r && <span className="w-2 h-2 rounded-full bg-[#50B0E0]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

