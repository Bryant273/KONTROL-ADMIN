import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  Search, 
  ChevronDown,
  Sparkles, 
  Menu, 
  X, 
  Settings, 
  Maximize, 
  Minimize, 
  User, 
  LogOut, 
  Check, 
  AlertTriangle, 
  Clock, 
  Shield, 
  ChevronRight
} from 'lucide-react';
import { UserRole, GatewayStatus } from '../types';
import { NavTab } from './Sidebar';

interface HeaderProps {
  activeTab: NavTab;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  gateways: GatewayStatus[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  unreadAlertsCount: number;
  onOpenAssistant: () => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  userName: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  currentRole,
  onRoleChange,
  gateways,
  searchQuery,
  onSearchChange,
  unreadAlertsCount,
  onOpenAssistant,
  mobileMenuOpen,
  onToggleMobileMenu,
  userName
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(unreadAlertsCount);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Alerte SLA Support',
      message: 'Ticket #TKT-1042 (Agro Dakar SA) en attente',
      time: 'Il y a 10 min',
      type: 'urgent',
      read: false
    },
    {
      id: 2,
      title: 'Bordereau GeniuSPay Reçu',
      message: 'Paiement Wave de 15 000 FCFA reçu pour Afric Distribution Bamako',
      time: 'Il y a 25 min',
      type: 'info',
      read: false
    },
    {
      id: 3,
      title: 'Renouvellement Forfait',
      message: 'Échéance dans 6 jours pour Sénégal BTP & Travaux',
      time: 'Il y a 1h',
      type: 'warning',
      read: false
    }
  ]);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setNotifMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllNotifsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const getTabBreadcrumb = (tab: NavTab) => {
    switch (tab) {
      case 'dashboard':
        return { section: 'Pilotage', page: 'Tableau de bord' };
      case 'users':
        return { section: 'Gestion & Clients', page: 'Entreprises / Clients' };
      case 'subscriptions':
        return { section: 'Gestion & Clients', page: 'Abonnements Standard' };
      case 'payments':
        return { section: 'Gestion & Finances', page: 'Bordereaux GeniuSPay' };
      case 'templates':
        return { section: 'Modèles & Documents', page: 'Modèles de Documents' };
      case 'support':
        return { section: 'Support & Équipe', page: 'Support Client' };
      case 'admin_team':
        return { section: 'Support & Équipe', page: 'Utilisateurs Admin' };
      case 'audit':
        return { section: 'Support & Équipe', page: 'Journal d\'Audit' };
      case 'data_explorer':
        return { section: 'Données & Tables', page: 'Explorateur de Données' };
      default:
        return { section: 'Pilotage', page: 'Tableau de bord' };
    }
  };

  const { section, page } = getTabBreadcrumb(activeTab);

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
      case 'super_admin': return 'Super Administrateur';
      case 'financial_admin': return 'Admin Financier';
      case 'support_agent': return 'Agent Support';
      case 'content_manager': return 'Gestionnaire Modèles';
      case 'client_admin': return 'Client Admin';
      default: return 'Administrateur';
    }
  };

  const initials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).replace(/^\w/, c => c.toUpperCase());

  return (
    <header className="h-14 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex justify-between items-center shrink-0 z-20 shadow-2xs">
      {/* Brand & Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleMobileMenu}
          className="lg:hidden p-1.5 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Dynamic Breadcrumb */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">{section}</span>
          <span className="text-slate-300">/</span>
          <span className="text-[13px] font-bold text-[#002845] truncate max-w-[160px] sm:max-w-none">{page}</span>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher une entreprise, facture, transaction, ticket..."
            className="w-full bg-[#F8FAFC] text-[12.5px] text-[#0F172A] placeholder-slate-400 border border-slate-200 rounded-md pl-8.5 pr-3 py-1.5 focus:outline-none focus:border-[#3B96D2] focus:bg-white focus:ring-2 focus:ring-[#3B96D2]/10 transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Date Display */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11.5px] text-slate-500 px-2.5 py-1 bg-slate-50 rounded-md border border-slate-200/80 font-medium">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>{currentDate}</span>
        </div>

        {/* Fullscreen Toggle Button */}
        <button
          onClick={toggleFullscreen}
          className="w-8 h-8 rounded-md border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all"
          title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
        >
          {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
        </button>

        {/* Interactive Notifications Popover */}
        <div className="relative" ref={notifMenuRef}>
          <button 
            onClick={() => setNotifMenuOpen(!notifMenuOpen)}
            className="relative w-8 h-8 rounded-md border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all"
            title="Notifications & Alertes"
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadCount > 0 && (
              <span className="absolute top-[5px] right-[5px] w-2 h-2 rounded-full bg-[#E06020] border-2 border-white" />
            )}
          </button>

          {notifMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-lg shadow-xl py-0 z-50 overflow-hidden">
              <div className="p-3 bg-[#002845] text-white flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#50B0E0]" />
                  <span className="text-[12.5px] font-bold">Notifications ({unreadCount})</span>
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllNotifsRead}
                    className="text-[11px] text-[#50B0E0] hover:underline font-medium"
                  >
                    Tout marquer comme lu
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => {
                      setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n));
                      setUnreadCount(prev => Math.max(0, prev - (item.read ? 0 : 1)));
                    }}
                    className={`p-3 text-left hover:bg-slate-50 transition-colors flex gap-2.5 ${
                      !item.read ? 'bg-[#3B96D2]/5' : ''
                    }`}
                  >
                    <div className="pt-0.5">
                      {item.type === 'urgent' && <AlertTriangle className="w-4 h-4 text-[#E06020] shrink-0" />}
                      {item.type === 'warning' && <Clock className="w-4 h-4 text-[#D97706] shrink-0" />}
                      {item.type === 'info' && <Sparkles className="w-4 h-4 text-[#3B96D2] shrink-0" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[12px] font-bold text-[#002845] truncate">{item.title}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{item.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 sm:pr-2.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3B96D2] to-[#E06020] text-white font-bold text-[10px] flex items-center justify-center shrink-0">
              {initials}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[12px] font-bold text-[#002845] leading-tight">{userName}</span>
              <span className="text-[9.5px] text-slate-400 leading-tight font-medium">{getRoleLabel(currentRole)}</span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-lg shadow-xl py-0 z-50 overflow-hidden">
              {/* Profile Card Top */}
              <div className="p-3 bg-[#002845] text-white space-y-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3B96D2] to-[#E06020] text-white font-bold text-xs flex items-center justify-center shrink-0 border border-white/20">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-bold text-white truncate">{userName}</div>
                    <div className="text-[11px] text-white/60 truncate">admin.super@kontrol.io</div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10.5px] text-[#50B0E0]">
                  <span className="font-semibold">{getRoleLabel(currentRole)}</span>
                  <span className="text-white/40">KONTROL Admin</span>
                </div>
              </div>

              {/* User Menu Items */}
              <div className="p-1.5 space-y-0.5 text-[12px]">
                {/* Role Switcher */}
                <div className="py-1">
                  <button
                    onClick={() => setShowRoleSelector(!showRoleSelector)}
                    className="w-full text-left px-2.5 py-1.5 rounded-md text-[#002845] hover:bg-slate-50 flex items-center justify-between font-bold"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-[#3B96D2]" />
                      <span>Basculer de Rôle</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showRoleSelector ? 'rotate-90' : ''}`} />
                  </button>

                  {showRoleSelector && (
                    <div className="ml-3 pl-2.5 border-l-2 border-[#3B96D2]/30 my-1 space-y-0.5">
                      {(['super_admin', 'financial_admin', 'support_agent', 'content_manager'] as UserRole[]).map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            onRoleChange(r);
                            setUserMenuOpen(false);
                          }}
                          className={`w-full text-left px-2 py-1 rounded text-[11.5px] flex items-center justify-between ${
                            currentRole === r ? 'bg-[#3B96D2]/15 text-[#002845] font-bold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                          }`}
                        >
                          <span>{getRoleLabel(r)}</span>
                          {currentRole === r && <Check className="w-3 h-3 text-[#3B96D2]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <button 
                    onClick={() => {
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-md text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-bold"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-600" />
                    <span>Fermer la Session</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
