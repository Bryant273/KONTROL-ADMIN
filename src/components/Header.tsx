import React, { useState, useEffect, useRef } from 'react';
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
  Minimize,
  User,
  LogOut,
  Check,
  AlertTriangle,
  Clock,
  Shield,
  ExternalLink,
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
  onToggleMobileMenu
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
      message: 'Ticket #TK-9021 (SOCIETE AGRO) en attente depuis > 2h',
      time: 'Il y a 10 min',
      type: 'urgent',
      read: false
    },
    {
      id: 2,
      title: 'Paiement Mobile Money Échoué',
      message: 'Transaction Orange Money #TX-10903 refusée (Fonds insuffisants)',
      time: 'Il y a 25 min',
      type: 'warning',
      read: false
    },
    {
      id: 3,
      title: 'Nouvelle Souscription',
      message: 'SOCIETE IVOIRE AGRO a souscrit au Plan Pro Annuel',
      time: 'Il y a 1h',
      type: 'info',
      read: false
    },
    {
      id: 4,
      title: 'Audit de Sécurité',
      message: 'Tentative de connexion bloquée depuis IP 102.164.88.10',
      time: 'Il y a 3h',
      type: 'security',
      read: true
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
        return { section: 'Gestion', page: 'Utilisateurs & Clients' };
      case 'subscriptions':
        return { section: 'Gestion', page: 'Abonnements & Plans' };
      case 'payments':
        return { section: 'Gestion', page: 'Paiements & Transactions' };
      case 'templates':
        return { section: 'Gestion', page: 'Templates & Modèles' };
      case 'support':
        return { section: 'Support', page: 'Tickets & Assistance' };
      case 'audit':
        return { section: 'Sécurité', page: 'Audit Trail & Sessions' };
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

        {/* Dynamic Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[11px] text-[#7a9ab0] uppercase tracking-wider font-semibold">{section}</span>
          <span className="text-[11px] text-[#7a9ab0]">/</span>
          <span className="text-[13.5px] font-bold text-[#003050] truncate max-w-[150px] sm:max-w-none">{page}</span>
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
        <div className="hidden sm:block text-[11.5px] text-[#7a9ab0] px-2.5 py-1 bg-[#F0F0F0] rounded-[6px] border border-[rgba(0,48,80,0.12)] whitespace-nowrap font-medium">
          {currentDate}
        </div>

        {/* Fullscreen Toggle Button */}
        <button
          onClick={toggleFullscreen}
          className="w-8 h-8 rounded-[7px] border border-[rgba(0,48,80,0.12)] bg-white hover:bg-[#F0F0F0] flex items-center justify-center text-[#7a9ab0] hover:text-[#0d1f2d] transition-all cursor-pointer"
          title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>

        {/* Interactive Notifications Popover */}
        <div className="relative" ref={notifMenuRef}>
          <button 
            onClick={() => setNotifMenuOpen(!notifMenuOpen)}
            className="relative w-8 h-8 rounded-[7px] border border-[rgba(0,48,80,0.12)] bg-white hover:bg-[#F0F0F0] flex items-center justify-center text-[#7a9ab0] hover:text-[#0d1f2d] transition-all cursor-pointer"
            title="Notifications & Alertes SLA"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-[6px] right-[6px] w-[7px] h-[7px] rounded-full bg-[#E06020] border-[1.5px] border-white" />
            )}
          </button>

          {notifMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[rgba(0,48,80,0.12)] rounded-[8px] shadow-xl py-0 z-50 overflow-hidden">
              <div className="p-3 bg-[#003050] text-white flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#50B0E0]" />
                  <span className="text-[13px] font-bold">Notifications ({unreadCount})</span>
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllNotifsRead}
                    className="text-[11px] text-[#50B0E0] hover:underline cursor-pointer font-medium"
                  >
                    Tout marquer comme lu
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[rgba(0,48,80,0.08)]">
                {notifications.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => {
                      setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n));
                      setUnreadCount(prev => Math.max(0, prev - (item.read ? 0 : 1)));
                    }}
                    className={`p-3 text-left hover:bg-[#F0F0F0]/60 transition-colors cursor-pointer flex gap-2.5 ${
                      !item.read ? 'bg-[#50B0E0]/5' : ''
                    }`}
                  >
                    <div className="pt-0.5">
                      {item.type === 'urgent' && <AlertTriangle className="w-4 h-4 text-[#E06020] shrink-0" />}
                      {item.type === 'warning' && <Clock className="w-4 h-4 text-[#b35a00] shrink-0" />}
                      {item.type === 'info' && <Sparkles className="w-4 h-4 text-[#50B0E0] shrink-0" />}
                      {item.type === 'security' && <Shield className="w-4 h-4 text-[#1a7a45] shrink-0" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[12.5px] font-bold text-[#003050] truncate">{item.title}</span>
                        <span className="text-[10px] text-[#7a9ab0] shrink-0">{item.time}</span>
                      </div>
                      <p className="text-[11.5px] text-[#2d4a60] mt-0.5 leading-snug">{item.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2 bg-[#F0F0F0] text-center border-t border-[rgba(0,48,80,0.08)]">
                <span className="text-[11px] text-[#7a9ab0] font-medium">Système de notification en temps réel • KONTROL ERP</span>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1.5 sm:pr-3 rounded-[8px] border border-[rgba(0,48,80,0.12)] bg-white hover:bg-[#F0F0F0] transition-colors cursor-pointer shadow-2xs"
          >
            <div className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-[#50B0E0] to-[#E06020] text-white font-bold text-[10px] flex items-center justify-center shrink-0">
              SA
            </div>
            <span className="hidden sm:inline text-[13px] font-bold text-[#003050]">Super Admin</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#7a9ab0]" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-[rgba(0,48,80,0.12)] rounded-[8px] shadow-xl py-0 z-50 overflow-hidden">
              {/* Profile Card Top */}
              <div className="p-3 bg-[#003050] text-white space-y-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#50B0E0] to-[#E06020] text-white font-black text-sm flex items-center justify-center shrink-0 border-2 border-white/20">
                    SA
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13.5px] font-bold text-white truncate">Super Administrateur</div>
                    <div className="text-[11px] text-white/60 truncate">admin@kontrol.ci</div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] text-[#50B0E0]">
                  <span className="font-mono uppercase">Rôle: {getRoleLabel(currentRole)}</span>
                  <span className="badge b-premium text-[9px] py-0 px-1.5">AES-256</span>
                </div>
              </div>

              {/* User Menu Items */}
              <div className="p-1.5 space-y-0.5 text-[12.5px]">
                <button 
                  onClick={() => {
                    alert("Profil administrateur : Amadou Diallo (Super Admin KONTROL)");
                    setUserMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-[6px] text-[#0d1f2d] hover:bg-[#F0F0F0] flex items-center gap-2.5 cursor-pointer font-medium"
                >
                  <User className="w-4 h-4 text-[#50B0E0]" />
                  <span>Mon Profil Admin</span>
                </button>

                <button 
                  onClick={() => {
                    alert("Ouverture des paramètres système KONTROL ERP");
                    setUserMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-[6px] text-[#0d1f2d] hover:bg-[#F0F0F0] flex items-center gap-2.5 cursor-pointer font-medium"
                >
                  <Settings className="w-4 h-4 text-[#50B0E0]" />
                  <span>Paramètres Système ERP</span>
                </button>

                {/* Role Toggle Selector in User Menu */}
                <div className="pt-1 border-t border-[rgba(0,48,80,0.08)] my-1">
                  <button
                    onClick={() => setShowRoleSelector(!showRoleSelector)}
                    className="w-full text-left px-3 py-2 rounded-[6px] text-[#003050] hover:bg-[#F0F0F0] flex items-center justify-between cursor-pointer font-bold"
                  >
                    <div className="flex items-center gap-2.5">
                      <Shield className="w-4 h-4 text-[#E06020]" />
                      <span>Changer de Rôle</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showRoleSelector ? 'rotate-90' : ''}`} />
                  </button>

                  {showRoleSelector && (
                    <div className="ml-3 pl-3 border-l-2 border-[#50B0E0]/30 my-1 space-y-1">
                      {(['super_admin', 'financial_admin', 'support_agent', 'content_manager'] as UserRole[]).map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            onRoleChange(r);
                            setUserMenuOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-[4px] text-[12px] flex items-center justify-between cursor-pointer ${
                            currentRole === r ? 'bg-[#50B0E0]/20 text-[#003050] font-bold' : 'text-[#7a9ab0] hover:bg-[#F0F0F0] hover:text-[#0d1f2d]'
                          }`}
                        >
                          <span>{getRoleLabel(r)}</span>
                          {currentRole === r && <Check className="w-3.5 h-3.5 text-[#50B0E0]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-1 border-t border-[rgba(0,48,80,0.08)]">
                  <button 
                    onClick={() => {
                      alert("Session fermée avec succès !");
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-[6px] text-[#c0392b] hover:bg-[#fdf0ee] flex items-center gap-2.5 cursor-pointer font-bold"
                  >
                    <LogOut className="w-4 h-4 text-[#c0392b]" />
                    <span>Déconnexion</span>
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

