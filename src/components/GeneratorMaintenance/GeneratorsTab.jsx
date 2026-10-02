import React, { useState } from 'react';
import { Search, Plus, Zap, Filter, Eye, Play, ClipboardCheck, XCircle, CheckCircle2, Building2, MapPin, ShieldAlert, Lock, AlertTriangle } from 'lucide-react';

export default function GeneratorsTab({
  generators,
  suppliers,
  sites,
  userRole,
  currentUser,
  selectedSiteFilter,
  onOpenAddGenerator,
  onOpenGeneratorDetails,
  onOpenDailyEntry,
  onOpenChecklist,
  onOpenCloseGenerator,
  onOpenRequestReturn,
  onOpenMachineProblem
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sectionFilter, setSectionFilter] = useState('ALL');

  // Filter logic with RBAC Site-Level Data Isolation
  const filteredGens = generators.filter(gen => {
    // Hide closed generators completely from this tab
    if (gen.status === 'CLOSED / RETURNED') return false;

    // Strict site isolation for Supervisor
    if (currentUser.role === 'supervisor' && gen.site !== currentUser.assignedSite) {
      return false;
    }

    // Filter by selected site if Admin
    if (selectedSiteFilter !== 'ALL' && gen.site !== selectedSiteFilter) return false;
    
    // Search matching
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      gen.id.toLowerCase().includes(searchLower) ||
      gen.name.toLowerCase().includes(searchLower) ||
      gen.supplierName.toLowerCase().includes(searchLower) ||
      gen.site.toLowerCase().includes(searchLower) ||
      gen.section.toLowerCase().includes(searchLower);

    if (!matchesSearch) return false;

    if (supplierFilter !== 'ALL' && gen.supplierId !== supplierFilter) return false;
    if (statusFilter !== 'ALL' && gen.status !== statusFilter) return false;
    if (sectionFilter !== 'ALL' && gen.section !== sectionFilter) return false;

    return true;
  });

  const calculateDays = (startingDate, status, closedDate, nonWorkingDays = 0) => {
    const start = new Date(startingDate);
    const end = status === 'CLOSED / RETURNED' && closedDate ? new Date(closedDate) : new Date();
    const diffTime = Math.max(0, end - start);
    const calendarDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const workingDays = Math.max(0, calendarDays - nonWorkingDays);
    return { calendarDays, workingDays };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Search & Filter Bar */}
      <div className="filter-bar">
        <div className="search-input-box">
          <Search size={16} className="text-muted" />
          <input
            type="text"
            placeholder="Search by Generator ID, Name, Supplier, Site..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select 
          className="filter-select"
          value={supplierFilter}
          onChange={(e) => setSupplierFilter(e.target.value)}
        >
          <option value="ALL">All Suppliers</option>
          {suppliers.map(sup => (
            <option key={sup.id} value={sup.id}>{sup.name}</option>
          ))}
        </select>

        <select 
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Active Statuses</option>
          <option value="ACTIVE">ACTIVE Only</option>
          <option value="STANDBY">STANDBY Only</option>
        </select>

        {currentUser.role === 'admin' ? (
          <button className="btn btn-primary" onClick={onOpenAddGenerator} style={{ marginLeft: 'auto' }}>
            <Plus size={16} /> Add Generator
          </button>
        ) : (
          <div style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lock size={14} className="text-amber" />
            <span>Add Generator (Admin Only)</span>
          </div>
        )}
      </div>

      {/* Generators Card Grid */}
      <div className="generators-grid">
        {filteredGens.length === 0 ? (
          <div className="table-card" style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}>
            <Zap size={32} style={{ color: 'var(--text-dim)', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>No Generators Found</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {currentUser.role === 'supervisor' ? `Showing generators strictly assigned to ${currentUser.assignedSite} Site.` : 'Try adjusting search or filter parameters.'}
            </p>
          </div>
        ) : (
          filteredGens.map((gen) => {
            const { calendarDays, workingDays } = calculateDays(gen.startingDate, gen.status, gen.closedDate, gen.nonWorkingDays);
            const currentCost = workingDays * gen.costPerDay;

            return (
              <div key={gen.id} className="generator-card">
                <div className="generator-card-header">
                  <div>
                    <div className="gen-code">{gen.id}</div>
                    <div className="gen-name">{gen.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{gen.type}</div>
                  </div>

                  <span className={`badge ${gen.status === 'ACTIVE' ? 'badge-active' : 'badge-closed'}`}>
                    {gen.status}
                  </span>
                </div>

                <div className="gen-info-grid">
                  <div className="info-item">
                    <span className="info-label">Supplier</span>
                    <span className="info-val">{gen.supplierName}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Site / Section</span>
                    <span className="info-val">{gen.site} - {gen.section}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Supervisor</span>
                    <span className="info-val">{gen.supervisor}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Started Date</span>
                    <span className="info-val">{gen.startingDate}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Calendar / Work Days</span>
                    <span className="info-val" style={{ color: 'var(--accent-cyan)' }}>
                      {calendarDays} Days ({workingDays} Work)
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Cost/Day & Total</span>
                    <span className="info-val" style={{ color: 'var(--accent-emerald)', fontWeight: '700' }}>
                      ₹{gen.costPerDay.toLocaleString()} / ₹{currentCost.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {gen.returnRequested && (
                  <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldAlert size={14} />
                    <span>Return Requested (Awaiting Admin Review)</span>
                  </div>
                )}

                {/* Actions row: View Details, Daily Entry, Checklist (AFTER Daily Entry), Close/Return */}
                <div className="gen-actions-row">
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => onOpenGeneratorDetails(gen)}
                  >
                    <Eye size={14} /> Details
                  </button>

                  {gen.status === 'ACTIVE' && (
                    <>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => onOpenDailyEntry(gen)}
                      >
                        <Play size={14} /> Daily Entry
                      </button>

                      {/* CHECKLIST BUTTON PLACED AFTER DAILY ENTRY BUTTON */}
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => onOpenChecklist(gen)}
                        style={{ color: 'var(--accent-cyan)', borderColor: 'var(--border-accent)' }}
                      >
                        <ClipboardCheck size={14} /> Checklist
                      </button>

                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => onOpenMachineProblem(gen)}
                        style={{ color: 'var(--accent-amber)', borderColor: 'var(--accent-amber)' }}
                      >
                        <AlertTriangle size={14} /> Machine Problem
                      </button>

                      {currentUser.role === 'admin' ? (
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => onOpenCloseGenerator(gen)}
                          title="Close / Return Generator (Admin Feature)"
                        >
                          <XCircle size={14} /> Close
                        </button>
                      ) : (
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => onOpenRequestReturn(gen)}
                          title="Request Generator Return for Admin Review"
                        >
                          <ShieldAlert size={14} /> Return
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
