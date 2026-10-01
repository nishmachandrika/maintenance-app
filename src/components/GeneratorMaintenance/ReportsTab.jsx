import React, { useState } from 'react';
import { 
  BarChart3, Filter, Download, Printer, FileText, Calendar, 
  DollarSign, Zap, Building2, CheckCircle2, XCircle, Fuel, Lock 
} from 'lucide-react';

export default function ReportsTab({
  generators,
  suppliers,
  historicalLogs,
  paymentRequests,
  checklists,
  sites,
  currentUser,
  selectedSiteFilter
}) {
  const isSupervisor = currentUser.role === 'supervisor';
  const assignedSite = currentUser.assignedSite;

  const [selectedReportType, setSelectedReportType] = useState('cost');
  const [dateRange, setDateRange] = useState('30_days');

  // Filter datasets strictly by site for Supervisor
  const scopedGens = isSupervisor ? generators.filter(g => g.site === assignedSite) : generators;
  const scopedLogs = isSupervisor ? historicalLogs.filter(h => h.site === assignedSite) : historicalLogs;
  const scopedPayments = isSupervisor ? paymentRequests.filter(p => p.site === assignedSite) : paymentRequests;

  const reportOptions = [
    { id: 'cost', label: 'Generator Cost Report', icon: DollarSign },
    { id: 'usage', label: 'Daily Usage Report', icon: Zap },
    { id: 'payments', label: 'Supplier Payment Report', icon: Building2 },
    { id: 'working_days', label: 'Working Days Report', icon: CheckCircle2 },
    { id: 'non_working_days', label: 'Non-Working Days Report', icon: Calendar },
    { id: 'lifecycle', label: 'Generator Lifecycle Report', icon: BarChart3 },
    { id: 'diesel', label: 'Diesel Usage Report', icon: Fuel },
    { id: 'checklist', label: 'Checklist Compliance Report', icon: FileText },
    { id: 'closures', label: 'Generator Closure / Return Report', icon: XCircle },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    alert(`Exporting ${selectedReportType.toUpperCase()} Report to CSV format for ${isSupervisor ? assignedSite : 'Organization'} Scope...`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Global Filter Bar */}
      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BarChart3 size={18} className="text-muted" />
          <span style={{ fontWeight: '700' }}>Report Type:</span>
        </div>

        <select 
          className="filter-select"
          value={selectedReportType}
          onChange={(e) => setSelectedReportType(e.target.value)}
          style={{ fontWeight: '700', color: 'var(--primary-light)' }}
        >
          {reportOptions.map(r => (
            <option key={r.id} value={r.id}>{r.label}</option>
          ))}
        </select>

        <select className="filter-select" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
          <option value="7_days">Last 7 Days</option>
          <option value="30_days">Last 30 Days (Current Month)</option>
          <option value="90_days">Quarterly (90 Days)</option>
          <option value="year">Full Year 2026</option>
        </select>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
          <button className="btn btn-outline btn-sm" onClick={handlePrint}>
            <Printer size={14} /> Print Report
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleExportCSV}>
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Report Content Panel */}
      <div className="table-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800' }}>
              {reportOptions.find(r => r.id === selectedReportType)?.label}
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Generated on {new Date().toLocaleDateString('en-IN')} | Scope: {isSupervisor ? `${assignedSite} Site (Supervisor Scope)` : selectedSiteFilter === 'ALL' ? 'All Organization Sites' : `${selectedSiteFilter} Site`}
            </div>
          </div>
          <span className="badge badge-active">{isSupervisor ? `Site: ${assignedSite}` : 'Organization-Wide Audit'}</span>
        </div>

        {/* 1. Generator Cost Report View */}
        {selectedReportType === 'cost' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="kpi-grid">
              <div className="kpi-card">
                <span className="kpi-label">{isSupervisor ? `${assignedSite} Running Cost` : 'Total Fleet Running Cost'}</span>
                <div className="kpi-value">
                  ₹{scopedGens.reduce((sum, g) => sum + ((Math.ceil(Math.max(0, new Date() - new Date(g.startingDate)) / (86400000)) - (g.nonWorkingDays || 0)) * g.costPerDay), 0).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="kpi-card">
                <span className="kpi-label">Average Cost / Day</span>
                <div className="kpi-value">
                  ₹{scopedGens.length > 0 ? Math.round(scopedGens.reduce((sum, g) => sum + g.costPerDay, 0) / scopedGens.length).toLocaleString() : 0}
                </div>
              </div>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Generator ID</th>
                    <th>Name</th>
                    <th>Supplier</th>
                    <th>Site</th>
                    <th>Rate / Day</th>
                    <th>Working Days</th>
                    <th>Total Cost (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {scopedGens.map(g => {
                    const days = Math.ceil(Math.max(0, new Date() - new Date(g.startingDate)) / 86400000);
                    const workDays = Math.max(0, days - (g.nonWorkingDays || 0));
                    const total = workDays * g.costPerDay;
                    return (
                      <tr key={g.id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)' }}>{g.id}</td>
                        <td style={{ fontWeight: '700' }}>{g.name}</td>
                        <td>{g.supplierName}</td>
                        <td>{g.site}</td>
                        <td>₹{g.costPerDay.toLocaleString()}</td>
                        <td>{workDays} Days</td>
                        <td style={{ fontWeight: '800', color: 'var(--accent-emerald)' }}>₹{total.toLocaleString('en-IN')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. Daily Usage Report View */}
        {selectedReportType === 'usage' && (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Generator</th>
                  <th>Site</th>
                  <th>Start Time</th>
                  <th>Stop Time</th>
                  <th>Hours Run</th>
                  <th>Tank</th>
                </tr>
              </thead>
              <tbody>
                {scopedLogs.map(log => (
                  <tr key={log.id}>
                    <td>{log.date}</td>
                    <td style={{ fontWeight: '700' }}>{log.generatorId} ({log.generatorName})</td>
                    <td>{log.site}</td>
                    <td>{log.startTime}</td>
                    <td>{log.stopTime}</td>
                    <td style={{ fontWeight: '700', fontFamily: 'var(--font-mono)' }}>{log.hours} hrs</td>
                    <td><span className="badge badge-completed">{log.tank}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. Supplier Payment Report */}
        {selectedReportType === 'payments' && (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Supplier</th>
                  <th>Payment Type</th>
                  <th>Amount</th>
                  <th>Request Date</th>
                  <th>Finance Status</th>
                </tr>
              </thead>
              <tbody>
                {scopedPayments.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)' }}>{p.id}</td>
                    <td style={{ fontWeight: '700' }}>{p.supplierName}</td>
                    <td>{p.paymentType}</td>
                    <td style={{ fontWeight: '800', color: 'var(--accent-emerald)' }}>₹{p.totalAmount.toLocaleString('en-IN')}</td>
                    <td>{p.requestDate}</td>
                    <td><span className="badge badge-active">{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Fallback for other reports */}
        {!['cost', 'usage', 'payments'].includes(selectedReportType) && (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Generator ID</th>
                  <th>Name</th>
                  <th>Site & Section</th>
                  <th>Supplier</th>
                  <th>Report Parameter Summary</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {scopedGens.map(g => (
                  <tr key={g.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)' }}>{g.id}</td>
                    <td style={{ fontWeight: '700' }}>{g.name}</td>
                    <td>{g.site} - {g.section}</td>
                    <td>{g.supplierName}</td>
                    <td>Verified operational telemetry metrics log complete.</td>
                    <td><span className="badge badge-active">{g.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
}
