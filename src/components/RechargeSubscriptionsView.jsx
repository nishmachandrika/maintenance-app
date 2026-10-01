import React, { useState } from 'react';
import { CreditCard, Wifi, ShieldCheck, RefreshCw, CheckCircle2, AlertCircle, Plus, Search } from 'lucide-react';

export default function RechargeSubscriptionsView() {
  const [subscriptions, setSubscriptions] = useState([
    {
      id: 'SUB-901',
      serviceName: 'Jio IoT Telemetry Pack - Site Akividu',
      provider: 'Reliance Jio',
      simNumber: '899100029102931',
      plan: '10GB/Month Data Pack',
      monthlyFee: 499,
      expiryDate: '2026-10-15',
      status: 'ACTIVE',
      assignedAsset: 'GEN-0001 Telemetry Controller'
    },
    {
      id: 'SUB-902',
      serviceName: 'Airtel M2M SIM Pass - Site Bhimavaram',
      provider: 'Bharti Airtel',
      simNumber: '899100049201948',
      plan: 'Unlimited Sensor Sync 180 Days',
      monthlyFee: 799,
      expiryDate: '2026-11-01',
      status: 'ACTIVE',
      assignedAsset: 'GEN-0005 Remote Fuel Monitor'
    },
    {
      id: 'SUB-903',
      serviceName: 'BSNL Backup M2M Pass - Site Tanuku',
      provider: 'BSNL Enterprise',
      simNumber: '899100010293847',
      plan: 'Emergency Backup 2GB/Month',
      monthlyFee: 299,
      expiryDate: '2026-10-05',
      status: 'EXPIRING SOON',
      assignedAsset: 'GEN-0008 Control Panel'
    }
  ]);

  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);

  const handleRechargeSuccess = (subId) => {
    setSubscriptions(subscriptions.map(s => {
      if (s.id === subId) {
        return {
          ...s,
          expiryDate: '2026-11-30',
          status: 'ACTIVE'
        };
      }
      return s;
    }));
    setShowRechargeModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="module-header">
        <div className="module-title-row">
          <div>
            <h1 className="module-title">Recharge Subscriptions</h1>
            <p className="module-desc">Manage IoT SIM cards, remote telemetry connections, and data subscription passes</p>
          </div>
          <button className="btn btn-primary" onClick={() => { setSelectedSub(subscriptions[0]); setShowRechargeModal(true); }}>
            <Plus size={16} /> Add Subscription
          </button>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Active Data Passes</span>
            <div className="kpi-icon-box kpi-icon-cyan"><Wifi size={18} /></div>
          </div>
          <div className="kpi-value">{subscriptions.length}</div>
          <div className="kpi-subtext">Telemetry devices online</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Expiring Soon</span>
            <div className="kpi-icon-box kpi-icon-amber"><AlertCircle size={18} /></div>
          </div>
          <div className="kpi-value">
            {subscriptions.filter(s => s.status === 'EXPIRING SOON').length}
          </div>
          <div className="kpi-subtext">Requires recharge within 7 days</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Monthly Telecom Cost</span>
            <div className="kpi-icon-box kpi-icon-emerald"><CreditCard size={18} /></div>
          </div>
          <div className="kpi-value">
            ₹{subscriptions.reduce((acc, curr) => acc + curr.monthlyFee, 0).toLocaleString('en-IN')}
          </div>
          <div className="kpi-subtext">Recurring infrastructure expense</div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-header-bar">
          <span className="table-title">
            <CreditCard size={18} className="text-muted" /> Managed Telecom & Data Subscriptions
          </span>
        </div>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Subscription ID</th>
                <th>Service / Asset</th>
                <th>Telecom Provider</th>
                <th>SIM Card Number</th>
                <th>Plan Details</th>
                <th>Monthly Fee</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map(sub => (
                <tr key={sub.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                    {sub.id}
                  </td>
                  <td>
                    <div style={{ fontWeight: '700' }}>{sub.serviceName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{sub.assignedAsset}</div>
                  </td>
                  <td>{sub.provider}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{sub.simNumber}</td>
                  <td>{sub.plan}</td>
                  <td style={{ fontWeight: '700' }}>₹{sub.monthlyFee}</td>
                  <td style={{ fontWeight: '600' }}>{sub.expiryDate}</td>
                  <td>
                    <span className={`badge ${sub.status === 'ACTIVE' ? 'badge-active' : 'badge-pending'}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        setSelectedSub(sub);
                        setShowRechargeModal(true);
                      }}
                    >
                      <RefreshCw size={14} /> Quick Recharge
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showRechargeModal && selectedSub && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Recharge Telemetry Subscription ({selectedSub.id})</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setShowRechargeModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>{selectedSub.serviceName}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Provider: {selectedSub.provider} | SIM: {selectedSub.simNumber}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Select Recharge Plan</label>
                <select className="form-select">
                  <option>Standard 30-Day Plan - ₹{selectedSub.monthlyFee}</option>
                  <option>Quarterly Pass (90 Days) - ₹{selectedSub.monthlyFee * 3 - 100}</option>
                  <option>Annual Enterprise Plan - ₹{selectedSub.monthlyFee * 10}</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Payment Gateway / Account</label>
                <select className="form-select">
                  <option>Company Corporate Credit Card (Ending 8821)</option>
                  <option>HDFC Direct Bank Transfer</option>
                  <option>Corporate UPI ID</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowRechargeModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => handleRechargeSuccess(selectedSub.id)}>
                Confirm & Pay ₹{selectedSub.monthlyFee}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
