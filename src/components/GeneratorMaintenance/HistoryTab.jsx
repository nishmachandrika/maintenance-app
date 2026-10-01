import React, { useState } from 'react';
import { History, Search, Download, Filter, Eye, Clock, ClipboardCheck, XCircle, Zap, DollarSign, AlertTriangle, Building2 } from 'lucide-react';
import HistoryDetailModal from './HistoryDetailModal';

export default function HistoryTab({
  historicalLogs,
  generators,
  suppliers,
  sites,
  currentUser,
  selectedSiteFilter
}) {
  const isSupervisor = currentUser.role === 'supervisor';
  const assignedSite = currentUser.assignedSite;

  const [searchTerm, setSearchTerm] = useState('');
  const [genFilter, setGenFilter] = useState('ALL');
  const [supplierFilter, setSupplierFilter] = useState('ALL');
  const [actionTypeFilter, setActionTypeFilter] = useState('ALL');
  const [selectedLogForDetail, setSelectedLogForDetail] = useState(null);

  // Helper to determine action type display
  const getActionBadge = (log) => {
    const type = log.actionType || (
      log.items ? 'CHECKLIST_INSPECTION' :
      log.amount ? 'PAYMENT_RECORDED' :
      log.closedDate ? 'GENERATOR_CLOSED' :
      log.costPerDay ? 'GENERATOR_CREATED' :
      'DAILY_USAGE'
    );

    switch (type) {
      case 'CHECKLIST_INSPECTION':
        return <span className="badge badge-completed" style={{ fontSize: '0.72rem' }}><ClipboardCheck size={11} style={{ marginRight: '3px' }} /> Checklist</span>;
      case 'GENERATOR_CLOSED':
        return <span className="badge badge-closed" style={{ fontSize: '0.72rem' }}><XCircle size={11} style={{ marginRight: '3px' }} /> Generator Closed</span>;
      case 'GENERATOR_CREATED':
        return <span className="badge badge-active" style={{ fontSize: '0.72rem' }}><Zap size={11} style={{ marginRight: '3px' }} /> Onboarded</span>;
      case 'RETURN_REQUESTED':
        return <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}><AlertTriangle size={11} style={{ marginRight: '3px' }} /> Return Requested</span>;
      case 'PAYMENT_RECORDED':
        return <span className="badge badge-active" style={{ fontSize: '0.72rem', background: 'rgba(99,102,241,0.2)', color: 'var(--primary-light)' }}><DollarSign size={11} style={{ marginRight: '3px' }} /> Payment Log</span>;
      case 'SUPPLIER_ADDED':
        return <span className="badge badge-active" style={{ fontSize: '0.72rem', background: 'rgba(168,85,247,0.2)', color: 'var(--accent-violet)' }}><Building2 size={11} style={{ marginRight: '3px' }} /> Supplier Added</span>;
      case 'DAILY_USAGE':
      default:
        return <span className="badge badge-active" style={{ fontSize: '0.72rem' }}><Clock size={11} style={{ marginRight: '3px' }} /> Daily Usage</span>;
    }
  };

  // Filtered log items with site data isolation
  const filteredLogs = historicalLogs.filter(log => {
    if (isSupervisor && log.site !== assignedSite) return false;
    if (!isSupervisor && selectedSiteFilter !== 'ALL' && log.site !== selectedSiteFilter) return false;

    const query = searchTerm.toLowerCase();
    const matchesQuery = 
      log.generatorId.toLowerCase().includes(query) ||
      (log.generatorName && log.generatorName.toLowerCase().includes(query)) ||
      (log.site && log.site.toLowerCase().includes(query)) ||
      (log.section && log.section.toLowerCase().includes(query)) ||
      (log.supplier && log.supplier.toLowerCase().includes(query)) ||
      (log.actionName && log.actionName.toLowerCase().includes(query));

    if (!matchesQuery) return false;

    if (genFilter !== 'ALL' && log.generatorId !== genFilter) return false;
    if (supplierFilter !== 'ALL' && log.supplier !== supplierFilter) return false;

    if (actionTypeFilter !== 'ALL') {
      const type = log.actionType || (
        log.items ? 'CHECKLIST_INSPECTION' :
        log.amount ? 'PAYMENT_RECORDED' :
        log.closedDate ? 'GENERATOR_CLOSED' :
        log.costPerDay ? 'GENERATOR_CREATED' :
        'DAILY_USAGE'
      );
      if (type !== actionTypeFilter) return false;
    }

    return true;
  });

  const exportCSV = () => {
    const headers = ["Date", "Action Type", "Generator ID", "Generator Name", "Supplier", "Site", "Section", "Start Time", "Stop Time", "Hours", "Status"];
    const rows = filteredLogs.map(l => [
      l.date, l.actionName || l.actionType || "Daily Usage", l.generatorId, `"${l.generatorName || ''}"`, `"${l.supplier || ''}"`, l.site || '', l.section || '', l.startTime || '--', l.stopTime || '--', l.hours || l.workingHours || '0', l.status || 'Completed'
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `generator_history_activity_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const visibleGens = isSupervisor ? generators.filter(g => g.site === assignedSite) : generators;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Detail Modal */}
      {selectedLogForDetail && (
        <HistoryDetailModal
          log={selectedLogForDetail}
          onClose={() => setSelectedLogForDetail(null)}
        />
      )}

      {/* Search & Filter Bar */}
      <div className="filter-bar">
        <div className="search-input-box">
          <Search size={16} className="text-muted" />
          <input
            type="text"
            placeholder="Filter by Activity, Generator, Supplier, Site..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select className="filter-select" value={actionTypeFilter} onChange={(e) => setActionTypeFilter(e.target.value)}>
          <option value="ALL">All Action Types</option>
          <option value="DAILY_USAGE">Daily Usage Entry</option>
          <option value="CHECKLIST_INSPECTION">Checklist Inspection</option>
          <option value="GENERATOR_CLOSED">Generator Closure</option>
          <option value="GENERATOR_CREATED">Generator Registered</option>
          <option value="PAYMENT_RECORDED">Payment Records</option>
          <option value="RETURN_REQUESTED">Return Requests</option>
        </select>

        <select className="filter-select" value={genFilter} onChange={(e) => setGenFilter(e.target.value)}>
          <option value="ALL">All Generators</option>
          {visibleGens.map(g => (
            <option key={g.id} value={g.id}>{g.id} - {g.name}</option>
          ))}
        </select>

        <select className="filter-select" value={supplierFilter} onChange={(e) => setSupplierFilter(e.target.value)}>
          <option value="ALL">All Suppliers</option>
          {suppliers.map(s => (
            <option key={s.id} value={s.name}>{s.name}</option>
          ))}
        </select>

        <button className="btn btn-secondary" onClick={exportCSV} style={{ marginLeft: 'auto' }}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* History Log Table */}
      <div className="table-card">
        <div className="table-header-bar">
          <span className="table-title">
            <History size={18} className="text-muted" /> Historical Activity & Lifecycle Log ({filteredLogs.length} Records)
          </span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>💡 Click any row to view full activity details</span>
            {isSupervisor && <span className="badge badge-completed">Isolated: {assignedSite} Site</span>}
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Activity Event</th>
                <th>Generator</th>
                <th>Supplier</th>
                <th>Site / Section</th>
                <th>Key Details</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '30px' }}>
                    No historical activity logs matching filter parameters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr 
                    key={log.id}
                    onClick={() => setSelectedLogForDetail(log)}
                    style={{ cursor: 'pointer', transition: 'background 0.15s ease' }}
                    className="history-table-row"
                  >
                    <td style={{ fontWeight: '600', whiteSpace: 'nowrap' }}>{log.date}</td>
                    <td>
                      {getActionBadge(log)}
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-main)', marginTop: '2px', fontWeight: '600' }}>
                        {log.actionName || 'Daily Entry Log'}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                        {log.generatorId}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>{log.generatorName}</div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{log.supplier || '--'}</td>
                    <td style={{ fontSize: '0.82rem' }}>{log.site} - {log.section}</td>
                    <td style={{ fontSize: '0.82rem' }}>
                      {log.hours ? `${log.hours}h (${log.startTime || ''} - ${log.stopTime || ''})` :
                       log.amount ? `₹${(parseFloat(log.amount) || 0).toLocaleString()} Paid` :
                       log.items ? `${Object.values(log.items).filter(Boolean).length}/${Object.keys(log.items).length} Items Passed` :
                       log.costPerDay ? `₹${log.costPerDay}/day Cost` :
                       log.remarks ? log.remarks.substring(0, 30) + '...' : '--'}
                    </td>
                    <td>
                      <span className="badge badge-completed">{log.status || 'Completed'}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLogForDetail(log);
                        }}
                      >
                        <Eye size={13} /> View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

