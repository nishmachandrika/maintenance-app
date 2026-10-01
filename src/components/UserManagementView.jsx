import React, { useState } from 'react';
import { Users, Shield, MapPin, Plus, CheckCircle2, Edit2, Key, AlertCircle, Eye, EyeOff, Lock, UserPlus, Save, Check, RotateCcw, HelpCircle, RefreshCw, ShieldCheck } from 'lucide-react';

export default function UserManagementView({ sites, currentUser, users, setUsers }) {
  // Modal states for Admin
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  
  // Modal state for Supervisor Forgot Password
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const [editingUser, setEditingUser] = useState(null);
  const [selectedSite, setSelectedSite] = useState('Akividu');

  // Password visibility toggle per user ID map
  const [visiblePasswords, setVisiblePasswords] = useState({});

  // Password form state for Admin editing another user
  const [adminNewPassword, setAdminNewPassword] = useState('');
  const [showAdminNewPass, setShowAdminNewPass] = useState(false);

  // Supervisor self-service password state
  const [showSelfPass, setShowSelfPass] = useState(false);
  const [selfNewPassword, setSelfNewPassword] = useState('');
  const [selfConfirmPassword, setSelfConfirmPassword] = useState('');
  const [selfSuccessMsg, setSelfSuccessMsg] = useState('');

  // Forgot Password Modal State for Supervisor
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotVerificationCode, setForgotVerificationCode] = useState('');
  const [forgotNewPass, setForgotNewPass] = useState('');

  // Add User Form State
  const [newUser, setNewUser] = useState({
    id: `usr-sup-${Date.now().toString().slice(-4)}`,
    name: '',
    role: 'supervisor',
    title: 'Site Supervisor',
    email: '',
    password: '',
    assignedSite: sites[0]?.name || 'Akividu'
  });

  const togglePasswordVisibility = (userId) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  // Admin: Open Site Reassignment
  const handleOpenAssign = (user) => {
    setEditingUser(user);
    setSelectedSite(user.assignedSite || 'Akividu');
    setShowAssignModal(true);
  };

  // Admin: Save Site Reassignment
  const handleSaveAssignment = () => {
    const updated = users.map(u => {
      if (u.id === editingUser.id) {
        return {
          ...u,
          assignedSite: selectedSite,
          title: `${selectedSite} Site Supervisor`
        };
      }
      return u;
    });
    setUsers(updated);
    setShowAssignModal(false);
  };

  // Admin: Open Change Password Modal for any user
  const handleOpenChangePassword = (user) => {
    setEditingUser(user);
    setAdminNewPassword(user.password || '');
    setShowChangePasswordModal(true);
  };

  // Admin: Save updated password for user
  const handleSaveAdminPassword = (e) => {
    e.preventDefault();
    if (!adminNewPassword.trim()) return;

    const updated = users.map(u => {
      if (u.id === editingUser.id) {
        return {
          ...u,
          password: adminNewPassword.trim()
        };
      }
      return u;
    });
    setUsers(updated);
    setShowChangePasswordModal(false);
  };

  // Admin: Add New System User
  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) return;

    const created = {
      ...newUser,
      avatar: newUser.name.slice(0, 2).toUpperCase(),
      badgeColor: newUser.role === 'admin' ? 'var(--primary-light)' : newUser.role === 'supervisor' ? 'var(--accent-cyan)' : 'var(--accent-emerald)'
    };

    setUsers([...users, created]);
    setShowAddUserModal(false);
    setNewUser({
      id: `usr-sup-${Date.now().toString().slice(-4)}`,
      name: '',
      role: 'supervisor',
      title: 'Site Supervisor',
      email: '',
      password: '',
      assignedSite: sites[0]?.name || 'Akividu'
    });
  };

  // Supervisor: Save Own Password Change
  const handleSelfPasswordChange = (e) => {
    e.preventDefault();
    if (!selfNewPassword || selfNewPassword !== selfConfirmPassword) {
      alert('Passwords do not match or are empty!');
      return;
    }

    const updated = users.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          password: selfNewPassword
        };
      }
      return u;
    });
    setUsers(updated);
    setSelfSuccessMsg('Your password has been changed successfully!');
    setSelfNewPassword('');
    setSelfConfirmPassword('');
    setTimeout(() => setSelfSuccessMsg(''), 4000);
  };

  // Supervisor: Reset Password to Site Default
  const handleSupervisorResetPassword = () => {
    const myUserData = users.find(u => u.id === currentUser.id) || currentUser;
    const siteDefaultPass = `${myUserData.assignedSite || 'Site'}Super#2026`;

    const updated = users.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          password: siteDefaultPass
        };
      }
      return u;
    });
    setUsers(updated);
    setSelfSuccessMsg(`Password reset to site default (${siteDefaultPass})!`);
    setTimeout(() => setSelfSuccessMsg(''), 5000);
  };

  // Supervisor: Submit Forgot Password Recovery
  const handleSupervisorForgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (!forgotNewPass) return;

    const updated = users.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          password: forgotNewPass
        };
      }
      return u;
    });
    setUsers(updated);
    setShowForgotPasswordModal(false);
    setSelfSuccessMsg('Password recovered and reset successfully!');
    setForgotNewPass('');
    setForgotVerificationCode('');
    setTimeout(() => setSelfSuccessMsg(''), 5000);
  };

  // ---------------------------------------------------------------------------
  // SUPERVISOR / NON-ADMIN VIEW: Site Credentials, Reset Password & Forgot Password
  // ---------------------------------------------------------------------------
  if (currentUser.role !== 'admin') {
    const myUserData = users.find(u => u.id === currentUser.id) || currentUser;
    const isPassVisible = visiblePasswords[myUserData.id];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '960px', margin: '0 auto' }}>
        <div className="module-header">
          <div className="module-title-row">
            <div>
              <h1 className="module-title">User Management (My Site Credentials)</h1>
              <p className="module-desc">Manage your supervisor account ID, active password, password reset, and recovery options for {myUserData.assignedSite || 'assigned'} site</p>
            </div>
            <span className="badge badge-completed" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
              <Shield size={14} style={{ display: 'inline', marginRight: '6px' }} />
              SUPERVISOR ({myUserData.assignedSite || 'RESTRICTED SCOPE'})
            </span>
          </div>
        </div>

        {/* User Profile & Credentials Card */}
        <div className="table-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div className="user-avatar" style={{ background: myUserData.badgeColor || 'var(--accent-cyan)', width: '56px', height: '56px', fontSize: '1.2rem', fontWeight: '800' }}>
                {myUserData.avatar || 'SV'}
              </div>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)' }}>{myUserData.name}</h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{myUserData.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: '700', marginTop: '2px' }}>
                  <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Assigned Site: <strong>{myUserData.assignedSite ? `${myUserData.assignedSite} Site Scope` : 'General Scope'}</strong>
                </div>
              </div>
            </div>

            {/* Quick Action Pills */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-outline btn-sm" onClick={handleSupervisorResetPassword} title="Reset password to default site password">
                <RotateCcw size={14} /> Reset Password
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => { setForgotEmail(myUserData.email); setShowForgotPasswordModal(true); }}>
                <HelpCircle size={14} /> Forgot Password?
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {selfSuccessMsg && (
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', padding: '12px 16px', borderRadius: '10px', fontSize: '0.86rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={18} /> {selfSuccessMsg}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            
            {/* Left Box: Active Supervisor Credentials */}
            <div style={{ background: 'var(--bg-input)', padding: '22px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.02rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} className="text-cyan-400" /> Site Supervisor Credentials
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Supervisor User ID</label>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.98rem', fontWeight: '800', color: 'var(--accent-cyan)', background: 'var(--bg-card-solid)', padding: '10px 14px', borderRadius: '8px', marginTop: '4px', border: '1px solid var(--border-color)' }}>
                    {myUserData.id}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Corporate Email</label>
                  <div style={{ fontSize: '0.92rem', color: 'var(--text-main)', background: 'var(--bg-card-solid)', padding: '10px 14px', borderRadius: '8px', marginTop: '4px', border: '1px solid var(--border-color)' }}>
                    {myUserData.email}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assigned Site Scope</label>
                  <div style={{ fontSize: '0.9rem', color: 'var(--accent-amber)', fontWeight: '700', background: 'var(--bg-card-solid)', padding: '10px 14px', borderRadius: '8px', marginTop: '4px', border: '1px solid var(--border-color)' }}>
                    {myUserData.assignedSite} Site (Isolated Operations)
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Password</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <div style={{ 
                      flex: 1, 
                      fontFamily: isPassVisible ? 'var(--font-mono)' : 'sans-serif', 
                      fontSize: '0.98rem', 
                      fontWeight: '700', 
                      color: isPassVisible ? 'var(--accent-cyan)' : 'var(--text-muted)',
                      background: 'var(--bg-card-solid)', 
                      padding: '10px 14px', 
                      borderRadius: '8px',
                      letterSpacing: isPassVisible ? 'normal' : '2px',
                      border: '1px solid var(--border-color)'
                    }}>
                      {isPassVisible ? (myUserData.password || 'Not Set') : '••••••••••••'}
                    </div>
                    <button 
                      className="btn btn-outline btn-sm" 
                      onClick={() => togglePasswordVisibility(myUserData.id)}
                      title={isPassVisible ? "Hide Password" : "Show Password"}
                      style={{ padding: '10px 14px' }}
                    >
                      {isPassVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                      <span style={{ fontSize: '0.78rem', marginLeft: '4px' }}>{isPassVisible ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Box: Change Password Form */}
            <div style={{ background: 'var(--bg-input)', padding: '22px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.02rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={18} className="text-amber-400" /> Create / Change Password
              </h3>

              <form onSubmit={handleSelfPasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showSelfPass ? 'text' : 'password'}
                      className="form-input"
                      placeholder="Enter new password"
                      value={selfNewPassword}
                      onChange={(e) => setSelfNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowSelfPass(!showSelfPass)}
                      style={{ position: 'absolute', right: '12px', top: '10px', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                    >
                      {showSelfPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type={showSelfPass ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Re-enter new password"
                    value={selfConfirmPassword}
                    onChange={(e) => setSelfConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                  <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }}>
                    <Save size={16} /> Save New Password
                  </button>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={handleSupervisorResetPassword}>
                      <RotateCcw size={14} /> Quick Reset Password
                    </button>
                    <button type="button" className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { setForgotEmail(myUserData.email); setShowForgotPasswordModal(true); }}>
                      <HelpCircle size={14} /> Forgot Password?
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div style={{ marginTop: '24px', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '14px 18px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldCheck size={20} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <strong style={{ color: 'var(--text-main)' }}>Site Supervisor Access Isolation:</strong> You can view your credentials, create/change password, reset password, and recover your account for <strong>{myUserData.assignedSite} Site</strong>. Other users' credentials remain isolated.
            </div>
          </div>
        </div>

        {/* FORGOT PASSWORD RECOVERY MODAL FOR SUPERVISOR */}
        {showForgotPasswordModal && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '480px' }}>
              <div className="modal-header">
                <h3 className="modal-title">Forgot Password Recovery</h3>
                <button className="btn btn-outline btn-sm" onClick={() => setShowForgotPasswordModal(false)}>✕</button>
              </div>
              <form onSubmit={handleSupervisorForgotPasswordSubmit}>
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    Recover password for <strong>{myUserData.name}</strong> ({myUserData.assignedSite} Site Supervisor).
                  </div>

                  <div className="form-group">
                    <label className="form-label">Registered Corporate Email</label>
                    <input
                      type="email"
                      className="form-input"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Site Verification Code</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter verification code (e.g. 884920)"
                      value={forgotVerificationCode}
                      onChange={(e) => setForgotVerificationCode(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Set New Recovered Password</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Enter new recovered password"
                      value={forgotNewPass}
                      onChange={(e) => setForgotNewPass(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForgotPasswordModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">
                    <CheckCircle2 size={16} /> Reset & Recover Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // ADMIN VIEW: Full Organization Roster, Passwords Display, Edit & User Creation
  // ---------------------------------------------------------------------------
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="module-header">
        <div className="module-title-row">
          <div>
            <h1 className="module-title">User Management & Credentials Roster</h1>
            <p className="module-desc">Manage system accounts, view passwords, update user credentials, and assign site scopes (Admin Control)</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddUserModal(true)}>
            <UserPlus size={16} /> Add New System User
          </button>
        </div>
      </div>

      <div className="table-card">
        <div className="table-header-bar">
          <span className="table-title">
            <Users size={18} className="text-muted" /> Registered System Users & Passwords (Admin Access)
          </span>
          <span className="badge badge-active">{users.length} System Accounts Active</span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Full Name & Title</th>
                <th>Role</th>
                <th>Corporate Email</th>
                <th>Password (Admin View)</th>
                <th>Assigned Site Scope</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((usr) => {
                const isPassVisible = visiblePasswords[usr.id];
                return (
                  <tr key={usr.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '800', color: 'var(--accent-cyan)' }}>
                      {usr.id}
                    </td>
                    <td>
                      <div style={{ fontWeight: '700' }}>{usr.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{usr.title}</div>
                    </td>
                    <td>
                      <span className={`badge ${usr.role === 'admin' ? 'badge-active' : usr.role === 'supervisor' ? 'badge-completed' : 'badge-paid'}`}>
                        {usr.role.toUpperCase()}
                      </span>
                    </td>
                    <td>{usr.email}</td>
                    
                    {/* ADMIN PASSWORD VIEW WITH EYE TOGGLE & CHANGE BUTTON */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ 
                          fontFamily: isPassVisible ? 'var(--font-mono)' : 'sans-serif', 
                          fontWeight: '700',
                          fontSize: '0.85rem',
                          color: isPassVisible ? '#38bdf8' : 'var(--text-muted)',
                          background: 'rgba(0,0,0,0.3)',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          minWidth: '100px',
                          letterSpacing: isPassVisible ? 'normal' : '2px'
                        }}>
                          {isPassVisible ? (usr.password || 'No Pass') : '••••••••'}
                        </span>
                        <button 
                          className="btn btn-outline btn-sm" 
                          onClick={() => togglePasswordVisibility(usr.id)}
                          title={isPassVisible ? "Hide Password" : "Show Password"}
                          style={{ padding: '4px 8px' }}
                        >
                          {isPassVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </td>

                    <td>
                      {usr.assignedSite ? (
                        <span style={{ fontWeight: '700', color: 'var(--accent-amber)' }}>
                          <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
                          {usr.assignedSite} Site
                        </span>
                      ) : (
                        <span style={{ color: 'var(--accent-emerald)', fontWeight: '700' }}>
                          All Sites (Org Wide)
                        </span>
                      )}
                    </td>

                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button 
                          className="btn btn-outline btn-sm" 
                          onClick={() => handleOpenChangePassword(usr)}
                          title="Change Password"
                        >
                          <Key size={14} /> Password
                        </button>

                        {usr.role === 'supervisor' && (
                          <button 
                            className="btn btn-outline btn-sm" 
                            onClick={() => handleOpenAssign(usr)}
                            title="Reassign Site Scope"
                          >
                            <Edit2 size={14} /> Site
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Admin Change Password for Any User */}
      {showChangePasswordModal && editingUser && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Change Password for {editingUser.name}</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setShowChangePasswordModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveAdminPassword}>
              <div className="modal-body">
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  User ID: <strong style={{ color: 'var(--accent-cyan)' }}>{editingUser.id}</strong> | Email: <strong>{editingUser.email}</strong>
                </div>

                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showAdminNewPass ? 'text' : 'password'}
                      className="form-input"
                      value={adminNewPassword}
                      onChange={(e) => setAdminNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminNewPass(!showAdminNewPass)}
                      style={{ position: 'absolute', right: '12px', top: '10px', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                    >
                      {showAdminNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowChangePasswordModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} /> Update User Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Admin Add System User */}
      {showAddUserModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Create New System Account</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setShowAddUserModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateUser}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">User ID (System Handle)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newUser.id}
                    onChange={(e) => setNewUser({ ...newUser, id: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Supervisor Rajesh Kumar"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    <option value="supervisor">Supervisor (Site Specific)</option>
                    <option value="admin">Admin (Organization Wide)</option>
                    <option value="finance">Finance (Payments)</option>
                  </select>
                </div>

                {newUser.role === 'supervisor' && (
                  <div className="form-group">
                    <label className="form-label">Assigned Site Scope</label>
                    <select
                      className="form-select"
                      value={newUser.assignedSite}
                      onChange={(e) => setNewUser({ ...newUser, assignedSite: e.target.value })}
                    >
                      {sites.map(s => (
                        <option key={s.id} value={s.name}>{s.name} Site ({s.location})</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Corporate Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="user@company.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Initial Password</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Set initial password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddUserModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={16} /> Create User Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Reassign Site Scope */}
      {showAssignModal && editingUser && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Reassign Site Scope for {editingUser.name}</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setShowAssignModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Assign Site Scope</label>
                <select className="form-select" value={selectedSite} onChange={(e) => setSelectedSite(e.target.value)}>
                  {sites.map(s => (
                    <option key={s.id} value={s.name}>{s.name} Site ({s.location})</option>
                  ))}
                </select>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '14px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-emerald)' }}>Enforced Site Isolation</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', marginTop: '4px' }}>
                  {editingUser.name} will be strictly isolated to <strong>{selectedSite} Site</strong> data.
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAssignModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveAssignment}>
                <CheckCircle2 size={16} /> Save Site Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
