import React from 'react';
import { ChevronRight, Bell, Home, Shield, User, Sun, Moon, Menu } from 'lucide-react';

export default function Header({ 
  activeModule, 
  activeTab, 
  currentUser,
  theme,
  setTheme,
  onMenuClick
}) {
  const getModuleLabel = () => {
    if (activeModule === 'generator-maintenance') return 'Generator Maintenance';
    if (activeModule === 'recharge-subscriptions') return 'Recharge Subscriptions';
    if (activeModule === 'user-management') return 'User Management';
    return 'Dashboard';
  };

  const getTabLabel = () => {
    if (!activeTab) return '';
    return activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  return (
    <header className="top-bar">
      {/* Left: Modern Breadcrumbs & Hamburger Menu */}
      <div className="top-bar-left">
        <button 
          className="mobile-menu-btn" 
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </button>

        <nav className="header-breadcrumbs">
          <div className="crumb-item">
            <Home size={14} className="crumb-icon" />
            <span className="hide-on-mobile">Main App</span>
          </div>

          <ChevronRight size={14} className="crumb-separator" />

          <div className={`crumb-item ${!activeTab ? 'active' : ''}`}>
            <span>{getModuleLabel()}</span>
          </div>

          {activeModule === 'generator-maintenance' && activeTab && (
            <>
              <ChevronRight size={14} className="crumb-separator" />
              <div className="crumb-badge">
                <span className="crumb-dot"></span>
                <span>{getTabLabel()}</span>
              </div>
            </>
          )}
        </nav>
      </div>

      {/* Right: Clean Profile Status & Notifications */}
      <div className="top-bar-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        
        {/* THEME TOGGLE ICON BUTTON BEFORE SYSTEM ADMIN */}
        <button 
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={theme === 'light' ? 'Switch to Present Dark Theme' : 'Switch to Light Theme'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '1px solid var(--border-accent)',
            background: theme === 'light' ? '#ffffff' : 'rgba(15, 23, 42, 0.8)',
            color: theme === 'light' ? '#d97706' : '#38bdf8',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        >
          {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* System Admin / User Profile Container */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: theme === 'light' ? '#ffffff' : 'rgba(15, 23, 42, 0.7)', padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
          <div className="user-avatar" style={{ background: currentUser.badgeColor || 'var(--primary-light)', width: '28px', height: '28px', fontSize: '0.75rem' }}>
            {currentUser.avatar}
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)' }}>{currentUser.name}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {currentUser.role === 'admin' ? 'System Administrator' : currentUser.role === 'supervisor' ? `Supervisor: ${currentUser.assignedSite}` : 'Finance Controller'}
            </div>
          </div>
        </div>

        {/* Notifications Icon Button */}
        <button className="header-icon-btn" title="System Notifications">
          <Bell size={16} />
          <span className="notification-dot"></span>
        </button>
      </div>
    </header>
  );
}

