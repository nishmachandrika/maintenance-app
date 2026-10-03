import React, { useState } from 'react';
import { Zap, ShieldCheck, Lock, Mail, ArrowRight, KeyRound, Building2 } from 'lucide-react';
import { INITIAL_USERS } from '../data/mockData';

export default function LoginPage({ onLoginSuccess, users = INITIAL_USERS }) {
  const userList = users && users.length > 0 ? users : INITIAL_USERS;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    const inputClean = email.trim().toLowerCase();
    // Match logged in user by email or ID or default to first user
    const matchedUser = userList.find(u => 
      u.email.toLowerCase() === inputClean || u.id.toLowerCase() === inputClean
    ) || userList[0];
    
    onLoginSuccess(matchedUser);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'radial-gradient(circle at 50% 10%, rgba(30, 41, 78, 0.6) 0%, rgba(11, 15, 25, 1) 70%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Glow Accents */}
      <div style={{
        position: 'absolute',
        top: '-150px',
        left: '-150px',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'rgba(79, 70, 229, 0.15)',
        filter: 'blur(100px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-150px',
        right: '-150px',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'rgba(6, 182, 212, 0.15)',
        filter: 'blur(100px)',
        pointerEvents: 'none'
      }} />

      {/* Main Container */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10,
      }} className="login-container">

        {/* RIGHT PANEL: Sign In Box with App Branding Heading at Top */}
        <div className="table-card" style={{
          padding: '36px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '24px',
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--border-highlight)',
          boxShadow: 'var(--shadow-lg)',
          borderRadius: '24px'
        }}>
          
          {/* APP HEADING BRANDING AT TOP OF SIGN IN SECTION */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
            <div className="brand-icon-box" style={{ width: '52px', height: '52px', borderRadius: '14px' }}>
              <Zap size={28} className="text-white" />
            </div>
            <div>
              <h1 className="brand-title" style={{ fontSize: '1.65rem' }}>
                MAINTENANCE APP
              </h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: '600' }}>
                Enterprise RBAC & Site Data Isolation
              </p>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-light)', fontSize: '0.82rem', fontWeight: '700', letterSpacing: '0.05em' }}>
              <ShieldCheck size={16} /> SECURE RBAC LOGIN
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '4px', color: 'var(--text-main)' }}>
              Sign In to Workspace
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Enter your corporate credentials below to log into your site workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="form-group">
              <label className="form-label">Corporate Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-dim)' }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '42px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@company.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary-light)', cursor: 'pointer' }}>Forgot password?</span>
              </div>
              <div style={{ position: 'relative' }}>
                <KeyRound size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-dim)' }} />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '42px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--primary)' }}
                />
                Remember login session
              </label>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '13px', fontSize: '0.95rem', fontWeight: '700', marginTop: '6px', justifyContent: 'center' }}>
              Sign In to Maintenance Portal <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ background: 'rgba(0,0,0,0.35)', padding: '12px 16px', borderRadius: '12px', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Lock size={16} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
            <div>
              <strong>Role Access Control Enforced:</strong> Site data isolation active for Supervisor logins.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
