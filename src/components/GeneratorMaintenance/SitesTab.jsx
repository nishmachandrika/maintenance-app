import React, { useState } from 'react';
import {
  MapPin, Layers, Zap, User, ArrowRight, ArrowLeft, Plus, Lock,
  CheckCircle2, Eye, Play, ClipboardCheck, ShieldAlert, XCircle, Trash2, Building, AlertTriangle
} from 'lucide-react';

export default function SitesTab({
  sites,
  setSites,
  generators,
  userRole,
  currentUser,
  selectedSiteFilter,
  onOpenGeneratorDetails,
  onOpenDailyEntry,
  onOpenChecklist,
  onOpenCloseGenerator,
  onOpenRequestReturn,
  onOpenAddGenerator,
  onOpenMachineProblem
}) {
  const isSupervisor = currentUser.role === 'supervisor';
  const assignedSite = currentUser.assignedSite;

  // Selected site for drilldown view (Level 2)
  const [selectedSiteObj, setSelectedSiteObj] = useState(null);

  // Add Site Modal state
  const [showAddSiteModal, setShowAddSiteModal] = useState(false);
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteLocation, setNewSiteLocation] = useState('');
  const [newSections, setNewSections] = useState([
    { id: 'sec-1', name: 'Section A', supervisor: 'Supervisor A (Ramesh Verma)' }
  ]);

  // Supervisor can ONLY see their assigned site (Section 5)
  const visibleSites = sites.filter(site => {
    if (isSupervisor) {
      return site.name === assignedSite;
    }
    if (selectedSiteFilter !== 'ALL' && site.name !== selectedSiteFilter) {
      return false;
    }
    return true;
  });

  // Calculate calendar & work days helper
  const calculateDays = (startingDate, status, closedDate, nonWorkingDays = 0) => {
    const start = new Date(startingDate);
    const end = status === 'CLOSED / RETURNED' && closedDate ? new Date(closedDate) : new Date();
    const diffTime = Math.max(0, end - start);
    const calendarDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const workingDays = Math.max(0, calendarDays - nonWorkingDays);
    return { calendarDays, workingDays };
  };

  // Add section handler inside Add Site modal
  const handleAddSection = () => {
    const nextChar = String.fromCharCode(65 + newSections.length); // B, C, D...
    setNewSections([
      ...newSections,
      {
        id: `sec-${Date.now()}-${newSections.length}`,
        name: `Section ${nextChar}`,
        supervisor: `Supervisor ${nextChar} (Site Incharge)`
      }
    ]);
  };

  // Remove section handler inside Add Site modal
  const handleRemoveSection = (index) => {
    if (newSections.length <= 1) return;
    setNewSections(newSections.filter((_, i) => i !== index));
  };

  // Change section detail handler
  const handleSectionChange = (index, field, value) => {
    const updated = [...newSections];
    updated[index][field] = value;
    setNewSections(updated);
  };

  // Submit Add Site Form
  const handleCreateSiteSubmit = (e) => {
    e.preventDefault();
    if (!newSiteName.trim() || !newSiteLocation.trim()) return;

    const newSite = {
      id: `site-${Date.now()}`,
      name: newSiteName.trim(),
      location: newSiteLocation.trim(),
      sections: newSections.map(s => ({
        id: s.id || `sec-${Math.random()}`,
        name: s.name.trim(),
        supervisor: s.supervisor.trim(),
        generators: []
      }))
    };

    if (setSites) {
      setSites([...sites, newSite]);
    }

    setShowAddSiteModal(false);
    setNewSiteName('');
    setNewSiteLocation('');
    setNewSections([{ id: 'sec-1', name: 'Section A', supervisor: 'Supervisor A (Ramesh Verma)' }]);
  };

  // LEVEL 2: DETAILED DRILLDOWN VIEW FOR A CLICKED SITE
  if (selectedSiteObj) {
    const siteGens = generators.filter(g => g.site === selectedSiteObj.name && g.status !== 'CLOSED / RETURNED');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Back Button & Banner Bar */}
        <div className="filter-bar">
          <button className="btn btn-secondary btn-sm" onClick={() => setSelectedSiteObj(null)}>
            <ArrowLeft size={16} /> Back to All Sites
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapPin size={20} className="text-cyan" />
            <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>{selectedSiteObj.name} Site Overview</span>
            <span className="badge badge-active">{siteGens.filter(g => g.status === 'ACTIVE').length} Active Generators</span>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
            {currentUser.role === 'admin' && (
              <>
                <button className="btn btn-primary btn-sm" onClick={() => setShowAddSiteModal(true)}>
                  <Plus size={14} /> Add Site
                </button>
                <button className="btn btn-outline btn-sm" onClick={onOpenAddGenerator}>
                  <Plus size={14} /> Add Generator to {selectedSiteObj.name}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Section-wise Generator Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {selectedSiteObj.sections.map((sec) => {
            const sectionGens = siteGens.filter(g => g.section === sec.name);

            return (
              <div key={sec.id} className="table-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="kpi-icon-box kpi-icon-indigo">
                      <Layers size={18} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>{sec.name}</h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                        Supervisor in Charge: <strong style={{ color: 'var(--text-main)' }}>{sec.supervisor}</strong>
                      </div>
                    </div>
                  </div>
                  <span className="badge badge-completed">{sectionGens.length} Generators</span>
                </div>

                {/* Section Generator Cards Grid */}
                <div className="generators-grid">
                  {sectionGens.length === 0 ? (
                    <div style={{ color: 'var(--text-dim)', fontStyle: 'italic', padding: '16px', gridColumn: '1 / -1' }}>
                      No generators assigned to {sec.name}.
                    </div>
                  ) : (
                    sectionGens.map((gen) => {
                      const { calendarDays, workingDays } = calculateDays(gen.startingDate, gen.status, gen.closedDate, gen.nonWorkingDays);
                      const currentCost = workingDays * gen.costPerDay;

                      return (
                        <div key={gen.id} className="generator-card">
                          <div className="generator-card-header">
                            <div>
                              <div className="gen-code" style={{ fontSize: '0.9rem', fontWeight: '800' }}>{gen.id}</div>
                              <div className="gen-name" style={{ fontSize: '1.05rem', fontWeight: '700' }}>{gen.name}</div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>{gen.type}</div>
                            </div>

                            <span className={`badge ${gen.status === 'ACTIVE' ? 'badge-active' : 'badge-closed'}`}>
                              {gen.status}
                            </span>
                          </div>

                          <div className="gen-info-grid">
                            <div className="info-item">
                              <span className="info-label">Supplier</span>
                              <span className="info-val" style={{ color: 'var(--text-main)', fontWeight: '700' }}>{gen.supplierName}</span>
                            </div>
                            <div className="info-item">
                              <span className="info-label">Started Date</span>
                              <span className="info-val" style={{ color: 'var(--text-main)', fontWeight: '600' }}>{gen.startingDate}</span>
                            </div>
                            <div className="info-item">
                              <span className="info-label">Calendar / Work Days</span>
                              <span className="info-val" style={{ color: 'var(--accent-cyan)', fontWeight: '700' }}>
                                {calendarDays} Days ({workingDays} Work)
                              </span>
                            </div>
                            <div className="info-item">
                              <span className="info-label">Cost/Day & Total</span>
                              <span className="info-val" style={{ color: 'var(--accent-emerald)', fontWeight: '800' }}>
                                ₹{gen.costPerDay.toLocaleString()} / ₹{currentCost.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>

                          {/* Action row inside site drilldown view */}
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
          })}
        </div>

        {/* ADD SITE MODAL */}
        {showAddSiteModal && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '560px' }}>
              <div className="modal-header">
                <h3 className="modal-title">Create New Organization Site</h3>
                <button className="btn btn-outline btn-sm" onClick={() => setShowAddSiteModal(false)}>✕</button>
              </div>
              <form onSubmit={handleCreateSiteSubmit}>
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Site Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Kakinada, Rajahmundry, Eluru"
                      value={newSiteName}
                      onChange={(e) => setNewSiteName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Location / District</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. East Godavari, AP"
                      value={newSiteLocation}
                      onChange={(e) => setNewSiteLocation(e.target.value)}
                      required
                    />
                  </div>

                  {/* Sections List Configuration */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="form-label" style={{ margin: 0 }}>Site Sections & Supervisors</label>
                      <button type="button" className="btn btn-outline btn-sm" onClick={handleAddSection}>
                        <Plus size={14} /> Add Section
                      </button>
                    </div>

                    {newSections.map((sec, idx) => (
                      <div key={sec.id || idx} style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '10px' }}>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Section Name"
                          value={sec.name}
                          onChange={(e) => handleSectionChange(idx, 'name', e.target.value)}
                          style={{ flex: 1 }}
                          required
                        />
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Supervisor Name"
                          value={sec.supervisor}
                          onChange={(e) => handleSectionChange(idx, 'supervisor', e.target.value)}
                          style={{ flex: 1.2 }}
                          required
                        />
                        {newSections.length > 1 && (
                          <button type="button" className="btn btn-outline btn-sm" onClick={() => handleRemoveSection(idx)} style={{ color: 'var(--accent-rose)', borderColor: 'rgba(244,63,94,0.3)' }}>
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddSiteModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">
                    <CheckCircle2 size={16} /> Create Site
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    );
  }

  // LEVEL 1: HIGH-LEVEL CLEAN SITES OVERVIEW GRID
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MapPin size={18} className="text-muted" />
          <span style={{ fontWeight: '700' }}>Physical Organization Hierarchy (Site → Section → Generator)</span>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span className={`badge ${isSupervisor ? 'badge-completed' : 'badge-active'}`} style={{ height: '36px', display: 'inline-flex', alignItems: 'center' }}>
            {isSupervisor ? (
              <>
                <Lock size={12} style={{ marginRight: '6px' }} /> Isolated: {assignedSite} Site Only
              </>
            ) : (
              'Admin Scope: Viewing All Organization Sites'
            )}
          </span>

          <button className="btn btn-primary btn-sm" onClick={() => setShowAddSiteModal(true)}>
            <Plus size={14} /> Add Site
          </button>

          {currentUser.role === 'admin' && (
            <button className="btn btn-outline btn-sm" onClick={onOpenAddGenerator}>
              <Plus size={14} /> Add Generator
            </button>
          )}
        </div>
      </div>

      <div className="site-cards-grid">
        {visibleSites.map((site) => {
          const siteGens = generators.filter(g => g.site === site.name && g.status !== 'CLOSED / RETURNED');
          const activeSiteGens = siteGens.filter(g => g.status === 'ACTIVE').length;
          const supervisorsList = site.sections.map(s => s.supervisor.split(' ')[0] + ' ' + s.supervisor.split(' ')[1]).join(', ');
          return (
            <div
              key={site.id}
              className="table-card site-card-split"
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(180px, 210px) 1fr',
                gap: '20px',
                padding: '16px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '18px',
                cursor: 'pointer',
                transition: 'var(--transition-normal)',
                alignItems: 'stretch'
              }}
              onClick={() => setSelectedSiteObj(site)}
            >
              {/* LEFT PART: SITE IMAGE BANNER */}
              <div style={{
                position: 'relative',
                borderRadius: '14px',
                overflow: 'hidden',
                minHeight: '210px',
                backgroundImage: `linear-gradient(180deg, rgba(11, 15, 25, 0.1) 0%, rgba(11, 15, 25, 0.75) 100%), url(${site.image || '/site-akividu.png'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '14px',
                border: '1px solid var(--border-color)'
              }}>
                <div>
                  <span className="badge badge-active" style={{ fontSize: '0.72rem', boxShadow: 'var(--shadow-sm)' }}>
                    {activeSiteGens} Active Gens
                  </span>
                </div>

                <div style={{
                  background: 'var(--bg-card-solid)',
                  backdropFilter: 'blur(8px)',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--text-main)',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  border: '1px solid var(--border-color)'
                }}>
                  <MapPin size={14} style={{ color: 'var(--accent-cyan)' }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{site.location}</span>
                </div>
              </div>

              {/* RIGHT PART: SITE CONTENT DETAILS */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)' }}>{site.name} Site</h3>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={13} style={{ color: 'var(--accent-cyan)' }} />
                      <span>{site.location}</span>
                    </div>
                  </div>

                  <span className="badge badge-completed" style={{ fontSize: '0.72rem' }}>
                    {site.sections.length} Sections
                  </span>
                </div>

                {/* Site Summary Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', background: 'var(--bg-input)', padding: '12px', borderRadius: '10px' }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>Total Gens</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>{siteGens.length}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>Sections</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--accent-cyan)', marginTop: '2px' }}>{site.sections.length}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>Active</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--accent-emerald)', marginTop: '2px' }}>{activeSiteGens}</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  Supervisors: <strong style={{ color: 'var(--text-main)' }}>{supervisorsList}</strong>
                </div>

                {/* Action Button to Open Site Generators */}
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '10px', fontSize: '0.88rem', fontWeight: '700' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSiteObj(site);
                  }}
                >
                  Explore Site Generators ({siteGens.length}) <ArrowRight size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD SITE MODAL */}
      {showAddSiteModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Create New Organization Site</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setShowAddSiteModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateSiteSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Site Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Kakinada, Rajahmundry, Eluru"
                    value={newSiteName}
                    onChange={(e) => setNewSiteName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Location / District</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. East Godavari, AP"
                    value={newSiteLocation}
                    onChange={(e) => setNewSiteLocation(e.target.value)}
                    required
                  />
                </div>

                {/* Sections List Configuration */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label" style={{ margin: 0 }}>Site Sections & Supervisors</label>
                    <button type="button" className="btn btn-outline btn-sm" onClick={handleAddSection}>
                      <Plus size={14} /> Add Section
                    </button>
                  </div>

                  {newSections.map((sec, idx) => (
                    <div key={sec.id || idx} style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'var(--bg-input)', padding: '10px', borderRadius: '10px' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Section Name"
                        value={sec.name}
                        onChange={(e) => handleSectionChange(idx, 'name', e.target.value)}
                        style={{ flex: 1 }}
                        required
                      />
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Supervisor Name"
                        value={sec.supervisor}
                        onChange={(e) => handleSectionChange(idx, 'supervisor', e.target.value)}
                        style={{ flex: 1.2 }}
                        required
                      />
                      {newSections.length > 1 && (
                        <button type="button" className="btn btn-outline btn-sm" onClick={() => handleRemoveSection(idx)} style={{ color: 'var(--accent-rose)', borderColor: 'rgba(244,63,94,0.3)' }}>
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddSiteModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={16} /> Create Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
