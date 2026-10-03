import React from 'react';
import { LayoutDashboard, Zap, CreditCard, Users, LogOut, X } from 'lucide-react';

export default function Sidebar({ activeModule, setActiveModule, currentUser, onLogout, isOpen, setIsOpen }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'generator-maintenance', label: 'Generator Maintenance', icon: Zap },
    { id: 'recharge-subscriptions', label: 'Recharge Subscriptions', icon: CreditCard },
  ];

  // Include User Management for both Admin and Supervisors (for site credentials & password management)
  navItems.push({ 
    id: 'user-management', 
    label: currentUser.role === 'admin' ? 'User Management' : 'User Management (My Credentials)', 
    icon: Users 
  });

  return (
    <aside className={`main-sidebar ${isOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <div className="brand-icon-box">
            <Zap size={22} className="text-white" />
          </div>
          <div>
            <div className="brand-title">MAINTENANCE APP</div>
            <div className="brand-subtitle">Enterprise Operations</div>
          </div>
        </div>
        
        {/* Mobile Close Button */}
        <button 
          className="sidebar-close-btn" 
          onClick={() => setIsOpen(false)}
        >
          <X size={20} />
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Core Modules</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              className={`sidebar-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveModule(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="user-avatar" style={{ background: currentUser.badgeColor }}>
            {currentUser.avatar}
          </div>
          <div className="user-info" style={{ overflow: 'hidden' }}>
            <span className="user-name" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {currentUser.name}
            </span>
            <span className="user-role-badge">
              {currentUser.role === 'admin' ? 'Organization Admin' : 
               currentUser.role === 'supervisor' ? `Site: ${currentUser.assignedSite}` : 'Finance Controller'}
            </span>
          </div>
        </div>

        <button 
          className="btn btn-outline btn-sm logout-btn" 
          onClick={onLogout}
          style={{ width: '100%', padding: '6px 10px', fontSize: '0.78rem', justifyContent: 'center' }}
        >
          <LogOut size={14} /> Log Out Session
        </button>
      </div>
    </aside>
  );
}
