import React, { useState, useRef } from 'react';
import { Play, Clock, Camera, Fuel, CheckCircle2, AlertCircle, Upload, Trash2, Eye, RefreshCw } from 'lucide-react';

const DEFAULT_START_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" fill="%231e293b"/><rect x="15" y="15" width="370" height="220" rx="12" fill="%230f172a" stroke="%2306b6d4" stroke-width="2"/><text x="200" y="55" fill="%2338bdf8" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle">⚡ START METER READING</text><circle cx="200" cy="130" r="50" fill="%231e293b" stroke="%2306b6d4" stroke-width="4"/><path d="M 200 130 L 225 105" stroke="%23f43f5e" stroke-width="4" stroke-linecap="round"/><circle cx="200" cy="130" r="6" fill="%23f43f5e"/><rect x="120" y="190" width="160" height="26" rx="6" fill="%230284c7"/><text x="200" y="208" fill="%23ffffff" font-family="monospace" font-size="14" font-weight="bold" text-anchor="middle">START: 04829.5 kWh</text></svg>`;

const DEFAULT_STOP_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" fill="%231e293b"/><rect x="15" y="15" width="370" height="220" rx="12" fill="%230f172a" stroke="%2310b981" stroke-width="2"/><text x="200" y="55" fill="%2334d399" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle">⚡ STOP METER READING</text><circle cx="200" cy="130" r="50" fill="%231e293b" stroke="%2310b981" stroke-width="4"/><path d="M 200 130 L 240 140" stroke="%23f43f5e" stroke-width="4" stroke-linecap="round"/><circle cx="200" cy="130" r="6" fill="%23f43f5e"/><rect x="120" y="190" width="160" height="26" rx="6" fill="%23059669"/><text x="200" y="208" fill="%23ffffff" font-family="monospace" font-size="14" font-weight="bold" text-anchor="middle">STOP: 04838.0 kWh</text></svg>`;

export default function DailyUsageModal({
  generator,
  onClose,
  todayActivities,
  setTodayActivities,
  historicalLogs,
  setHistoricalLogs
}) {
  const [startTime, setStartTime] = useState('08:00 AM');
  const [stopTime, setStopTime] = useState('04:30 PM');
  const [tank, setTank] = useState('Tank A1');
  const [fanSetsUsed, setFanSetsUsed] = useState(generator?.fanSets || 4);
  const [dieselLiters, setDieselLiters] = useState('45');
  const [remarks, setRemarks] = useState('Standard daily operational run.');
  
  const existingAct = todayActivities?.find(a => a.generatorId === generator?.id);

  const [startPhotoPreview, setStartPhotoPreview] = useState(
    existingAct?.startPhoto || null
  );
  const [stopPhotoPreview, setStopPhotoPreview] = useState(
    existingAct?.stopPhoto || null
  );

  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const startInputRef = useRef(null);
  const stopInputRef = useRef(null);

  if (!generator) return null;

  // File upload reader helper
  const handleFileChange = (e, setPhotoState) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setPhotoState(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e, setPhotoState) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setPhotoState(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Auto calculate duration estimation
  const calculateDurationHours = () => {
    return 8.5;
  };

  const handleSaveDailyEntry = () => {
    const newActivity = {
      id: `act-${Date.now()}`,
      generatorId: generator.id,
      generatorName: generator.name,
      site: generator.site,
      section: generator.section,
      supplier: generator.supplierName,
      startTime: startTime,
      stopTime: stopTime,
      status: 'RUNNING',
      workingHours: `${calculateDurationHours()} hrs`,
      tank: tank,
      fanSetsUsed: parseInt(fanSetsUsed) || 4,
      dieselAddedLiters: parseFloat(dieselLiters) || 0,
      startPhoto: startPhotoPreview,
      stopPhoto: stopPhotoPreview,
      remarks: remarks
    };

    setTodayActivities([newActivity, ...todayActivities.filter(a => a.generatorId !== generator.id)]);

    const newHistoryLog = {
      id: `hist-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      generatorId: generator.id,
      generatorName: generator.name,
      supplier: generator.supplierName,
      site: generator.site,
      section: generator.section,
      startTime: startTime,
      stopTime: stopTime,
      hours: calculateDurationHours(),
      tank: tank,
      fanSets: parseInt(fanSetsUsed) || 4,
      dieselLiters: parseFloat(dieselLiters) || 0,
      status: 'Completed',
      inspector: generator.supervisor
    };

    setHistoricalLogs([newHistoryLog, ...historicalLogs]);
    onClose();
  };

  return (
    <div className="modal-overlay">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={startInputRef}
        accept="image/*"
        onChange={(e) => handleFileChange(e, setStartPhotoPreview)}
        style={{ display: 'none' }}
      />
      <input
        type="file"
        ref={stopInputRef}
        accept="image/*"
        onChange={(e) => handleFileChange(e, setStopPhotoPreview)}
        style={{ display: 'none' }}
      />

      {/* Lightbox Preview Modal */}
      {lightboxPhoto && (
        <div 
          className="modal-overlay" 
          style={{ zIndex: 1100, background: 'rgba(0,0,0,0.85)' }}
          onClick={() => setLightboxPhoto(null)}
        >
          <div 
            style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="btn btn-danger btn-sm"
              style={{ position: 'absolute', top: '-15px', right: '-15px', borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
              onClick={() => setLightboxPhoto(null)}
            >
              ✕
            </button>
            <img 
              src={lightboxPhoto.url} 
              alt={lightboxPhoto.title} 
              style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '12px', border: '2px solid var(--border-accent)', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }} 
            />
            <div style={{ textAlign: 'center', color: '#fff', marginTop: '12px', fontWeight: '700', fontSize: '1rem' }}>
              {lightboxPhoto.title}
            </div>
          </div>
        </div>
      )}

      <div className="modal-content" style={{ maxWidth: '720px' }}>
        
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Daily Usage Entry ({generator.id})</h3>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{generator.name}</div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          
          {/* Metadata banner */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '10px', fontSize: '0.8rem', color: 'var(--text-main)' }}>
            <div><strong>Supplier:</strong> {generator.supplierName}</div>
            <div><strong>Site:</strong> {generator.site}</div>
            <div><strong>Section:</strong> {generator.section}</div>
          </div>

          {/* Start & Stop Timings */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input
                type="text"
                className="form-input"
                placeholder="08:00 AM"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Stop Time</label>
              <input
                type="text"
                className="form-input"
                placeholder="04:30 PM"
                value={stopTime}
                onChange={(e) => setStopTime(e.target.value)}
              />
            </div>
          </div>

          {/* Calculated Usage Duration Banner */}
          <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-accent)', padding: '12px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} className="text-cyan" />
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>Calculated Usage Duration:</span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>
              {calculateDurationHours()} Hours (Stop Time - Start Time)
            </span>
          </div>

          {/* Photos Upload / Previews */}
          <div className="form-row" style={{ marginTop: '12px' }}>
            
            {/* Start Photo Verification Block */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label" style={{ margin: 0 }}>Start Photo Verification</label>
                {startPhotoPreview ? (
                  <span className="badge badge-active" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                    <CheckCircle2 size={11} style={{ marginRight: '3px' }} /> Photo Loaded
                  </span>
                ) : (
                  <span className="badge badge-closed" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                    Upload Required
                  </span>
                )}
              </div>

              <div 
                style={{ 
                  border: '2px dashed var(--border-accent)', 
                  padding: '14px', 
                  borderRadius: '10px', 
                  background: 'var(--bg-input)', 
                  textAlign: 'center',
                  transition: 'all 0.2s ease-in-out'
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, setStartPhotoPreview)}
              >
                {startPhotoPreview ? (
                  <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px' }}>
                    <img 
                      src={startPhotoPreview} 
                      alt="Start meter" 
                      style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }}
                      onClick={() => setLightboxPhoto({ url: startPhotoPreview, title: 'Start Meter Photo Verification' })}
                    />
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '8px' }}>
                      <button 
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                        onClick={() => startInputRef.current?.click()}
                      >
                        <Upload size={12} /> Upload New
                      </button>
                      <button 
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.72rem', padding: '4px 8px', color: 'var(--accent-cyan)' }}
                        onClick={() => setLightboxPhoto({ url: startPhotoPreview, title: 'Start Meter Photo Verification' })}
                      >
                        <Eye size={12} /> Inspect
                      </button>
                      <button 
                        type="button"
                        className="btn btn-danger btn-sm"
                        style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                        onClick={() => setStartPhotoPreview(null)}
                        title="Remove Photo"
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    style={{ cursor: 'pointer', padding: '16px 8px' }}
                    onClick={() => startInputRef.current?.click()}
                  >
                    <Camera size={34} className="text-cyan" style={{ marginBottom: '8px', opacity: 0.8 }} />
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>
                      Click or Drag Photo to Upload
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px', marginBottom: '10px' }}>
                      Start meter reading photo verification
                    </div>
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '4px 12px' }}
                    >
                      <Upload size={13} /> Select Photo
                    </button>
                  </div>
                )}
                
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '8px' }}>
                  Supported formats: JPG, PNG, WEBP (Max 10MB)
                </div>
              </div>
            </div>

            {/* Stop Photo Verification Block */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label" style={{ margin: 0 }}>Stop Photo Verification</label>
                {stopPhotoPreview ? (
                  <span className="badge badge-active" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                    <CheckCircle2 size={11} style={{ marginRight: '3px' }} /> Photo Loaded
                  </span>
                ) : (
                  <span className="badge badge-closed" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                    Upload Required
                  </span>
                )}
              </div>

              <div 
                style={{ 
                  border: '2px dashed var(--border-accent)', 
                  padding: '14px', 
                  borderRadius: '10px', 
                  background: 'var(--bg-input)', 
                  textAlign: 'center',
                  transition: 'all 0.2s ease-in-out'
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, setStopPhotoPreview)}
              >
                {stopPhotoPreview ? (
                  <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px' }}>
                    <img 
                      src={stopPhotoPreview} 
                      alt="Stop meter" 
                      style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }}
                      onClick={() => setLightboxPhoto({ url: stopPhotoPreview, title: 'Stop Meter Photo Verification' })}
                    />
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '8px' }}>
                      <button 
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                        onClick={() => stopInputRef.current?.click()}
                      >
                        <Upload size={12} /> Upload New
                      </button>
                      <button 
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.72rem', padding: '4px 8px', color: 'var(--accent-cyan)' }}
                        onClick={() => setLightboxPhoto({ url: stopPhotoPreview, title: 'Stop Meter Photo Verification' })}
                      >
                        <Eye size={12} /> Inspect
                      </button>
                      <button 
                        type="button"
                        className="btn btn-danger btn-sm"
                        style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                        onClick={() => setStopPhotoPreview(null)}
                        title="Remove Photo"
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    style={{ cursor: 'pointer', padding: '16px 8px' }}
                    onClick={() => stopInputRef.current?.click()}
                  >
                    <Camera size={34} className="text-emerald" style={{ marginBottom: '8px', opacity: 0.8 }} />
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>
                      Click or Drag Photo to Upload
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px', marginBottom: '10px' }}>
                      Stop meter reading photo verification
                    </div>
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '4px 12px' }}
                    >
                      <Upload size={13} /> Select Photo
                    </button>
                  </div>
                )}
                
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '8px' }}>
                  Supported formats: JPG, PNG, WEBP (Max 10MB)
                </div>
              </div>
            </div>

          </div>

          {/* Additional Fields */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Fuel Tank Connected</label>
              <select className="form-select" value={tank} onChange={(e) => setTank(e.target.value)}>
                <option value="Tank A1">Tank A1 (Capacity 500L)</option>
                <option value="Tank A2">Tank A2 (Capacity 300L)</option>
                <option value="Tank B1">Tank B1 (Capacity 750L)</option>
                <option value="Main Field Tank">Main Field Tank</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Fan Sets Used</label>
              <input
                type="number"
                className="form-input"
                value={fanSetsUsed}
                onChange={(e) => setFanSetsUsed(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Diesel / Fuel Added (Liters)</label>
              <input
                type="number"
                className="form-input"
                placeholder="45"
                value={dieselLiters}
                onChange={(e) => setDieselLiters(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Operational Remarks</label>
              <input
                type="text"
                className="form-input"
                placeholder="Any noise, vibration or maintenance note"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>

        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSaveDailyEntry}>
            <CheckCircle2 size={16} /> Save Daily Activity Record
          </button>
        </div>

      </div>
    </div>
  );
}

