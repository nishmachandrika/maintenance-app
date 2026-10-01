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

      {/* Main Split 2-Column Card Container */}
      <div style={{
        width: '100%',
        maxWidth: '1080px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '28px',
        zIndex: 10,
        alignItems: 'stretch'
      }} className="login-grid-container">

        {/* LEFT PANEL: SIDE IMAGE HERO */}
        <div style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          minHeight: '540px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '32px',
          backgroundImage: `linear-gradient(180deg, rgba(11, 15, 25, 0.35) 0%, rgba(11, 15, 25, 0.9) 100%), url('/login-hero.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
        }}>
          {/* Top Brand Pill on Image */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              fontSize: '0.78rem',
              fontWeight: '700',
              color: '#38bdf8',
              letterSpacing: '0.05em'
            }}>
              <Zap size={14} className="text-amber-400" /> INDUSTRIAL POWER GRID
            </div>
          </div>

          {/* Middle Text Overlay */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '800',
              color: '#ffffff',
              lineHeight: '1.25',
              textShadow: '0 2px 10px rgba(0,0,0,0.8)'
            }}>
              Heavy Generator & Fleet Operations
            </h2>
            <p style={{
              fontSize: '0.88rem',
              color: '#cbd5e1',
              lineHeight: '1.55',
              textShadow: '0 1px 4px rgba(0,0,0,0.7)'
            }}>
              Enterprise monitoring system with multi-site isolation, daily checklists, supplier bank links, and automated payout pipelines.
            </p>
          </div>

          {/* Bottom Glassmorphism Telemetry Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(14px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '14px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ShieldCheck size={20} style={{ color: '#10b981' }} />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#f8fafc' }}>99.98% System Uptime</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>8 Heavy Generators Operational</div>
                </div>
              </div>
              <span className="badge badge-active" style={{ fontSize: '0.7rem' }}>ONLINE</span>
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(14px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '14px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Building2 size={20} style={{ color: '#38bdf8' }} />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#f8fafc' }}>Multi-Site RBAC Isolation</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Admin & Supervisor Scopes</div>
                </div>
              </div>
              <span className="badge badge-completed" style={{ fontSize: '0.7rem' }}>ENFORCED</span>
            </div>
          </div>
        </div>

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
              <h1 style={{ 
                fontSize: '1.65rem', 
                fontWeight: '800', 
                background: 'linear-gradient(135deg, #fff 0%, #cbd5e1 100%)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em'
              }}>
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
