import React, { useState } from 'react';
import { Building2, Zap, MapPin, Plus, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

export default function AddGeneratorModal({
  onClose,
  suppliers,
  sites,
  generators,
  setGenerators,
  onOpenAddSupplier,
  historicalLogs,
  setHistoricalLogs
}) {
  const [step, setStep] = useState(1);

  // Form states
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');
  const [selectedBankAccount, setSelectedBankAccount] = useState('');
  
  const [genName, setGenName] = useState('');
  const [genModel, setGenModel] = useState('');
  const [genType, setGenType] = useState('Diesel Heavy Duty');
  const [startingDate, setStartingDate] = useState(new Date().toISOString().split('T')[0]);
  const [costPerDay, setCostPerDay] = useState('2500');
  const [fanSets, setFanSets] = useState('4');

  const [selectedSite, setSelectedSite] = useState(sites[0]?.name || 'Akividu');
  const [selectedSection, setSelectedSection] = useState(sites[0]?.sections[0]?.name || 'Section A');
  const [supervisor, setSupervisor] = useState(sites[0]?.sections[0]?.supervisor || 'Supervisor A (Ramesh Verma)');

  // Auto-generate Generator ID (GEN-XXXX)
  const autoGenId = `GEN-000${generators.length + 1}`;

  // Current selected supplier object
  const currentSupplier = suppliers.find(s => s.id === selectedSupplierId) || suppliers[0];

  // Handle site change to update sections
  const handleSiteChange = (siteName) => {
    setSelectedSite(siteName);
    const siteObj = sites.find(s => s.name === siteName);
    if (siteObj && siteObj.sections.length > 0) {
      setSelectedSection(siteObj.sections[0].name);
      setSupervisor(siteObj.sections[0].supervisor);
    }
  };

  const handleSectionChange = (sectionName) => {
    setSelectedSection(sectionName);
    const siteObj = sites.find(s => s.name === selectedSite);
    if (siteObj) {
      const secObj = siteObj.sections.find(sec => sec.name === sectionName);
      if (secObj) {
        setSupervisor(secObj.supervisor);
      }
    }
  };

  const handleSaveGenerator = () => {
    if (!genName.trim()) {
      alert('Please enter a Generator Name.');
      return;
    }

    const newGen = {
      id: autoGenId,
      name: genName,
      model: genModel || 'Standard 2026 Model',
      type: genType,
      supplierId: currentSupplier.id,
      supplierName: currentSupplier.name,
      site: selectedSite,
      section: selectedSection,
      supervisor: supervisor,
      startingDate: startingDate,
      costPerDay: parseFloat(costPerDay) || 2000,
      fanSets: parseInt(fanSets) || 4,
      status: 'ACTIVE',
      nonWorkingDays: 0,
      closedDate: null,
      closedRemarks: '',
      closingPhoto: null
    };

    setGenerators([newGen, ...generators]);

    if (setHistoricalLogs && historicalLogs) {
      const newHistoryLog = {
        id: `hist-gen-${Date.now()}`,
        date: startingDate,
        generatorId: autoGenId,
        generatorName: genName,
        supplier: currentSupplier.name,
        site: selectedSite,
        section: selectedSection,
        actionType: 'GENERATOR_CREATED',
        actionName: 'Generator Registered',
        costPerDay: parseFloat(costPerDay) || 2000,
        fanSets: parseInt(fanSets) || 4,
        model: genModel || 'Standard Model',
        type: genType,
        status: 'ACTIVE',
        inspector: supervisor,
        remarks: `New generator registered on ${startingDate} with ₹${costPerDay}/day cost.`
      };
      setHistoricalLogs([newHistoryLog, ...historicalLogs]);
    }

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '650px' }}>
        
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Add New Generator</h3>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Auto Generator ID: <strong style={{ color: 'var(--accent-cyan)' }}>{autoGenId}</strong>
            </div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>✕</button>
        </div>

        {/* Wizard Progress Indicator */}
        <div className="modal-body" style={{ paddingBottom: '0' }}>
          <div className="wizard-steps">
            <div className={`step-item ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>
              <div className="step-num">{step > 1 ? <CheckCircle2 size={14} /> : '1'}</div>
              <span>Step 1: Supplier</span>
            </div>
            <div style={{ flex: 1, height: '2px', background: 'var(--border-color)', margin: '0 8px' }} />
            <div className={`step-item ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>
              <div className="step-num">{step > 2 ? <CheckCircle2 size={14} /> : '2'}</div>
              <span>Step 2: Generator Info</span>
            </div>
            <div style={{ flex: 1, height: '2px', background: 'var(--border-color)', margin: '0 8px' }} />
            <div className={`step-item ${step === 3 ? 'active' : ''}`}>
              <div className="step-num">3</div>
              <span>Step 3: Assignment</span>
            </div>
          </div>
        </div>

        {/* Modal Body Wizard Form */}
        <div className="modal-body">
          
          {/* STEP 1: SUPPLIER & BANK ACCOUNT */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Select Existing Supplier</label>
                <select
                  className="form-select"
                  value={selectedSupplierId}
                  onChange={(e) => {
                    setSelectedSupplierId(e.target.value);
                    setSelectedBankAccount('');
                  }}
                >
                  {suppliers.map(sup => (
                    <option key={sup.id} value={sup.id}>{sup.name} ({sup.contactPerson})</option>
                  ))}
                </select>
              </div>

              {currentSupplier && (
                <div className="form-group">
                  <label className="form-label">Select Supplier Bank Account</label>
                  <select
                    className="form-select"
                    value={selectedBankAccount}
                    onChange={(e) => setSelectedBankAccount(e.target.value)}
                  >
                    <option value="">Default Main Account ({currentSupplier.bankAccounts[0]?.bankName})</option>
                    {currentSupplier.bankAccounts.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.bankName} - A/C: {b.accountNumber} (IFSC: {b.ifscCode})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--border-color)', padding: '14px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>Need to register a new vendor?</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Avoid creating duplicate suppliers</div>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={onOpenAddSupplier}>
                  <Plus size={14} /> Add New Supplier
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: GENERATOR INFORMATION */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Generator Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Field Diesel Gen 125kVA"
                  value={genName}
                  onChange={(e) => setGenName(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Generator Model</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Cummins C125D5"
                    value={genModel}
                    onChange={(e) => setGenModel(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Generator Type</label>
                  <select
                    className="form-select"
                    value={genType}
                    onChange={(e) => setGenType(e.target.value)}
                  >
                    <option value="Diesel Heavy Duty">Diesel Heavy Duty</option>
                    <option value="Silent Diesel">Silent Diesel</option>
                    <option value="Portable Silent">Portable Silent</option>
                    <option value="Heavy Duty Dual Engine">Heavy Duty Dual Engine</option>
                    <option value="Auxiliary Backup">Auxiliary Backup</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Starting Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={startingDate}
                    onChange={(e) => setStartingDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Cost Per Day (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="2500"
                    value={costPerDay}
                    onChange={(e) => setCostPerDay(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Fan Sets Installed</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="4"
                  value={fanSets}
                  onChange={(e) => setFanSets(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 3: ASSIGNMENT */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Assign to Site</label>
                <select
                  className="form-select"
                  value={selectedSite}
                  onChange={(e) => handleSiteChange(e.target.value)}
                >
                  {sites.map(site => (
                    <option key={site.id} value={site.name}>{site.name} Site</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Assign to Section</label>
                <select
                  className="form-select"
                  value={selectedSection}
                  onChange={(e) => handleSectionChange(e.target.value)}
                >
                  {sites.find(s => s.name === selectedSite)?.sections.map(sec => (
                    <option key={sec.id} value={sec.name}>{sec.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Supervisor</label>
                <input
                  type="text"
                  className="form-input"
                  value={supervisor}
                  readOnly
                  style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--text-muted)' }}
                />
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '14px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-emerald)' }}>
                  Hierarchy Assignment Summary
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', marginTop: '4px' }}>
                  This generator will automatically appear under <strong>{selectedSite} → {selectedSection}</strong>.
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="modal-footer">
          {step > 1 && (
            <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>
              <ChevronLeft size={16} /> Previous Step
            </button>
          )}

          {step < 3 ? (
            <button className="btn btn-primary" onClick={() => setStep(step + 1)}>
              Next Step <ChevronRight size={16} />
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleSaveGenerator}>
              <CheckCircle2 size={16} /> Save & Activate Generator
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
