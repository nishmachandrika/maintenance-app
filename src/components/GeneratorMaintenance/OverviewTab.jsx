import React from 'react';
import { Zap, CheckCircle2, Activity, Wrench, XCircle, Building2, Clock, CreditCard, Play, Eye, ClipboardCheck } from 'lucide-react';

export default function OverviewTab({
  generators,
  suppliers,
  paymentRequests,
  todayActivities,
  currentUser,
  selectedSiteFilter,
  onOpenGeneratorDetails,
  onOpenDailyEntry,
  onOpenChecklist
}) {
  const isSupervisor = currentUser.role === 'supervisor';
  const assignedSite = currentUser.assignedSite;

  const filteredGens = isSupervisor
    ? generators.filter(g => g.site === assignedSite)
    : (selectedSiteFilter === 'ALL' ? generators : generators.filter(g => g.site === selectedSiteFilter));

  const totalGens = filteredGens.length;
  const activeGens = filteredGens.filter(g => g.status === 'ACTIVE').length;
  const closedGens = filteredGens.filter(g => g.status === 'CLOSED / RETURNED').length;

  const filteredActivities = isSupervisor
    ? todayActivities.filter(a => a.site === assignedSite)
    : (selectedSiteFilter === 'ALL' ? todayActivities : todayActivities.filter(a => a.site === selectedSiteFilter));

  const runningToday = filteredActivities.filter(a => a.status === 'RUNNING').length;
  const maintenanceToday = filteredActivities.filter(a => a.status === 'UNDER MAINTENANCE').length;

  const totalSuppliers = suppliers.length;

  const pendingPaymentsList = (isSupervisor ? paymentRequests.filter(p => p.site === assignedSite) : paymentRequests)
    .filter(p => p.status === 'Pending' || p.status === 'Finance Review');

  const pendingCount = pendingPaymentsList.length;
  const totalPayable = pendingPaymentsList.reduce((sum, p) => sum + p.totalAmount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Section 4: KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">{isSupervisor ? 'Site Generators' : 'Total Generators'}</span>
            <div className="kpi-icon-box kpi-icon-indigo"><Zap size={18} /></div>
          </div>
          <div className="kpi-value">{totalGens}</div>
          <div className="kpi-subtext">{isSupervisor ? `Assigned to ${assignedSite}` : 'Registered across sites'}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Active Generators</span>
            <div className="kpi-icon-box kpi-icon-emerald"><CheckCircle2 size={18} /></div>
          </div>
          <div className="kpi-value">{activeGens}</div>
          <div className="kpi-subtext">Deployed & operational</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Running Today</span>
            <div className="kpi-icon-box kpi-icon-cyan"><Activity size={18} /></div>
          </div>
          <div className="kpi-value">{runningToday}</div>
          <div className="kpi-subtext">Active operational duty</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Under Maintenance</span>
            <div className="kpi-icon-box kpi-icon-amber"><Wrench size={18} /></div>
          </div>
          <div className="kpi-value">{maintenanceToday}</div>
          <div className="kpi-subtext">Scheduled service/repairs</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Closed / Returned</span>
            <div className="kpi-icon-box kpi-icon-rose"><XCircle size={18} /></div>
          </div>
          <div className="kpi-value">{closedGens}</div>
          <div className="kpi-subtext">Returned to suppliers</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Total Suppliers</span>
            <div className="kpi-icon-box kpi-icon-purple"><Building2 size={18} /></div>
          </div>
          <div className="kpi-value">{totalSuppliers}</div>
          <div className="kpi-subtext">Partner vendors & agencies</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Pending Payments</span>
            <div className="kpi-icon-box kpi-icon-amber"><Clock size={18} /></div>
          </div>
          <div className="kpi-value">{pendingCount}</div>
          <div className="kpi-subtext">Awaiting Finance clearance</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Total Payable Amount</span>
            <div className="kpi-icon-box kpi-icon-emerald"><CreditCard size={18} /></div>
          </div>
          <div className="kpi-value">₹{totalPayable.toLocaleString('en-IN')}</div>
          <div className="kpi-subtext">{isSupervisor ? `${assignedSite} pending payout` : 'Pending payout total'}</div>
        </div>
      </div>

      {/* Today's Generator Activity Table */}
      <div className="table-card">
        <div className="table-header-bar">
          <span className="table-title">
            <Activity size={18} className="text-muted" /> Today's Generator Activity
          </span>
          {isSupervisor && (
            <span className="badge badge-completed">Filtered: {assignedSite} Site Only</span>
          )}
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Generator ID</th>
                <th>Generator Name</th>
                <th>Site</th>
                <th>Section</th>
                <th>Supplier</th>
                <th>Start Time</th>
                <th>Stop Time</th>
                <th>Status</th>
                <th>Today's Working Hours</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '30px' }}>
                    No activity logs recorded for this site today.
                  </td>
                </tr>
              ) : (
                filteredActivities.map((act) => {
                  const targetGen = generators.find(g => g.id === act.generatorId);
                  return (
                    <tr key={act.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                        {act.generatorId}
                      </td>
                      <td style={{ fontWeight: '700' }}>{act.generatorName}</td>
                      <td>{act.site}</td>
                      <td><span className="badge badge-completed">{act.section}</span></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{act.supplier}</td>
                      <td>{act.startTime}</td>
                      <td>{act.stopTime}</td>
                      <td>
                        <span className={`badge ${
                          act.status === 'RUNNING' ? 'badge-running' : 
                          act.status === 'COMPLETED' ? 'badge-completed' : 'badge-maintenance'
                        }`}>
                          {act.status}
                        </span>
                      </td>
                      <td style={{ fontWeight: '700', fontFamily: 'var(--font-mono)' }}>{act.workingHours}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button 
                            className="btn btn-outline btn-sm"
                            title="View Details"
                            onClick={() => targetGen && onOpenGeneratorDetails(targetGen)}
                          >
                            <Eye size={14} /> Details
                          </button>
                          <button 
                            className="btn btn-secondary btn-sm"
                            title="Daily Entry"
                            onClick={() => targetGen && onOpenDailyEntry(targetGen)}
                          >
                            <Play size={14} /> Daily Entry
                          </button>
                          <button 
                            className="btn btn-outline btn-sm"
                            title="Checklist"
                            onClick={() => targetGen && onOpenChecklist(targetGen)}
                            style={{ color: 'var(--accent-cyan)', borderColor: 'var(--border-accent)' }}
                          >
                            <ClipboardCheck size={14} /> Checklist
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
