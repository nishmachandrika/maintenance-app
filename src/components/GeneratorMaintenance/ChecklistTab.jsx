import React, { useState } from 'react';
import { ClipboardCheck, Calendar, Zap, CheckCircle2, User, Save, FileText, Lock } from 'lucide-react';

export default function ChecklistTab({
  generators,
  checklists,
  setChecklists,
  currentUser,
  selectedSiteFilter
}) {
  const isSupervisor = currentUser.role === 'supervisor';
  const assignedSite = currentUser.assignedSite;

  const activeGens = isSupervisor
    ? generators.filter(g => g.status === 'ACTIVE' && g.site === assignedSite)
    : (selectedSiteFilter === 'ALL'
        ? generators.filter(g => g.status === 'ACTIVE')
        : generators.filter(g => g.status === 'ACTIVE' && g.site === selectedSiteFilter));

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedGenId, setSelectedGenId] = useState(activeGens[0]?.id || 'GEN-0001');

  // Checklist items state
  const [items, setItems] = useState({
    engineCondition: true,
    oilLevel: true,
    coolantLevel: true,
    batteryCondition: true,
    dieselLevel: true,
    leakageCheck: true,
    fanBeltCondition: true,
    electricalConnections: true,
    generalMachineCondition: true,
    other: false
  });

  const [remarks, setRemarks] = useState('All routine inspection parameters checked and normal.');
  const [savedSuccessMsg, setSavedSuccessMsg] = useState('');

  const currentGen = generators.find(g => g.id === selectedGenId) || activeGens[0];

  const handleToggleItem = (key) => {
    setItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveChecklist = () => {
    const newChecklist = {
      id: `chk-${Date.now()}`,
      date: selectedDate,
      generatorId: currentGen?.id || selectedGenId,
      generatorName: currentGen?.name || 'Generator Unit',
      site: currentGen?.site || (isSupervisor ? assignedSite : 'Akividu'),
      section: currentGen?.section || 'Section A',
      inspector: currentUser.name,
      items: { ...items },
      remarks: remarks,
      timestamp: `${selectedDate} ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
    };

    setChecklists([newChecklist, ...checklists]);
    setSavedSuccessMsg(`Checklist for ${currentGen?.id} saved permanently!`);
    setTimeout(() => setSavedSuccessMsg(''), 4000);
  };

  const checklistFields = [
    { key: 'engineCondition', label: 'Engine condition' },
    { key: 'oilLevel', label: 'Oil level' },
    { key: 'coolantLevel', label: 'Coolant level' },
    { key: 'batteryCondition', label: 'Battery condition' },
    { key: 'dieselLevel', label: 'Diesel/Fuel level' },
    { key: 'leakageCheck', label: 'Leakage check' },
    { key: 'fanBeltCondition', label: 'Fan/Belt condition' },
    { key: 'electricalConnections', label: 'Electrical connections' },
    { key: 'generalMachineCondition', label: 'General machine condition' },
    { key: 'other', label: 'Other custom check' }
  ];

  // Scope saved checklist log list for Supervisor
  const filteredChecklists = isSupervisor
    ? checklists.filter(c => c.site === assignedSite)
    : checklists;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Selector Control Bar */}
      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={16} className="text-muted" />
          <span style={{ fontWeight: '700', fontSize: '0.88rem' }}>Date:</span>
          <input
            type="date"
            className="filter-select"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={16} className="text-muted" />
          <span style={{ fontWeight: '700', fontSize: '0.88rem' }}>Generator:</span>
          <select
            className="filter-select"
            value={selectedGenId}
            onChange={(e) => setSelectedGenId(e.target.value)}
          >
            {activeGens.map(gen => (
              <option key={gen.id} value={gen.id}>
                {gen.id} - {gen.name} ({gen.site})
              </option>
            ))}
          </select>
        </div>

        {savedSuccessMsg && (
          <div style={{ color: 'var(--accent-emerald)', fontWeight: '700', fontSize: '0.88rem', marginLeft: 'auto' }}>
            ✓ {savedSuccessMsg}
          </div>
        )}
      </div>

      {/* Checklist Card */}
      <div className="table-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Daily Generator Checklist</h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Assigned Inspector: <strong>{currentUser.name}</strong> | Site: {currentGen?.site} - {currentGen?.section}
            </div>
          </div>
          <span className="badge badge-active">Standard Inspection Protocol</span>
        </div>

        <div className="checklist-grid">
          {checklistFields.map((field) => (
            <div
              key={field.key}
              className="checklist-item-card"
              onClick={() => handleToggleItem(field.key)}
            >
              <input
                type="checkbox"
                className="checklist-checkbox"
                checked={items[field.key]}
                onChange={() => {}}
              />
              <span style={{ fontSize: '0.88rem', fontWeight: '600', color: items[field.key] ? 'var(--text-main)' : 'var(--text-dim)' }}>
                {field.label}
              </span>
            </div>
          ))}
        </div>

        <div className="form-group" style={{ marginTop: '20px' }}>
          <label className="form-label">Inspection Remarks & Notes</label>
          <textarea
            className="form-textarea"
            rows="3"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter any minor observations, oil top-ups, belt adjustments..."
          />
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" onClick={handleSaveChecklist}>
            <Save size={16} /> Save Checklist Permanently
          </button>
        </div>
      </div>

      {/* History of Completed Checklists */}
      <div className="table-card">
        <div className="table-header-bar">
          <span className="table-title">
            <ClipboardCheck size={18} className="text-muted" /> Completed Daily Inspection Logs
          </span>
          {isSupervisor && <span className="badge badge-completed">Filtered: {assignedSite} Site</span>}
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Date & Time</th>
                <th>Generator</th>
                <th>Site & Section</th>
                <th>Inspector</th>
                <th>Passed Items</th>
                <th>Remarks</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredChecklists.map((chk) => {
                const passedCount = Object.values(chk.items).filter(Boolean).length;
                const totalItems = Object.keys(chk.items).length;

                return (
                  <tr key={chk.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                      {chk.id}
                    </td>
                    <td>{chk.timestamp || chk.date}</td>
                    <td style={{ fontWeight: '700' }}>{chk.generatorId} ({chk.generatorName})</td>
                    <td>{chk.site} - {chk.section}</td>
                    <td>{chk.inspector}</td>
                    <td>
                      <span className="badge badge-active">
                        {passedCount} / {totalItems} Passed
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{chk.remarks}</td>
                    <td>
                      <span className="badge badge-completed">Verified</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
