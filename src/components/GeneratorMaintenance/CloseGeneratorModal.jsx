import React, { useState, useRef } from 'react';
import { XCircle, Calendar, AlertTriangle, FileText, CheckCircle2, ShieldCheck, Upload } from 'lucide-react';

const DEFAULT_DOC_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%231e293b"/><rect x="10" y="10" width="280" height="180" rx="8" fill="%230f172a" stroke="%23f43f5e" stroke-width="2"/><text x="150" y="50" fill="%23f87171" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">HANDOVER RECEIPT</text><rect x="40" y="70" width="220" height="10" rx="4" fill="%23334155"/><rect x="40" y="95" width="180" height="10" rx="4" fill="%23334155"/><rect x="40" y="120" width="200" height="10" rx="4" fill="%23334155"/><rect x="40" y="145" width="100" height="24" rx="4" fill="%23e11d48"/><text x="90" y="161" fill="%23ffffff" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">VERIFIED</text></svg>`;

export default function CloseGeneratorModal({
  generator,
  onClose,
  generators,
  setGenerators,
  historicalLogs,
  setHistoricalLogs
}) {
  const [closingDate, setClosingDate] = useState(new Date().toISOString().split('T')[0]);
  const [finalWorkingDate, setFinalWorkingDate] = useState(new Date().toISOString().split('T')[0]);
  const [closingRemarks, setClosingRemarks] = useState('Project phase completed. Generator returned to supplier in good operational condition after inspection.');
  const [confirmedReturn, setConfirmedReturn] = useState(false);
  const [docPhotoPreview, setDocPhotoPreview] = useState('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80');
  const [fileName, setFileName] = useState('handover_receipt_gen_0001.pdf');

  const fileInputRef = useRef(null);

  if (!generator) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setDocPhotoPreview(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmClose = () => {
    if (!confirmedReturn) {
      alert('Please check the confirmation toggle confirming return of the physical asset.');
      return;
    }

    const updated = generators.map(g => {
      if (g.id === generator.id) {
        return {
          ...g,
          status: 'CLOSED / RETURNED',
          closedDate: closingDate,
          closedRemarks: closingRemarks,
          closingPhoto: docPhotoPreview
        };
      }
      return g;
    });

    setGenerators(updated);

    if (setHistoricalLogs && historicalLogs) {
      const newHistoryLog = {
        id: `hist-close-${Date.now()}`,
        date: closingDate,
        generatorId: generator.id,
        generatorName: generator.name,
        supplier: generator.supplierName,
        site: generator.site,
        section: generator.section,
        actionType: 'GENERATOR_CLOSED',
        actionName: 'Generator Closure & Physical Return',
        closingDate: closingDate,
        finalWorkingDate: finalWorkingDate,
        closingPhoto: docPhotoPreview,
        remarks: closingRemarks,
        status: 'CLOSED / RETURNED',
        inspector: generator.supervisor
      };
      setHistoricalLogs([newHistoryLog, ...historicalLogs]);
    }

    onClose();
  };

  return (
    <div className="modal-overlay">
      <input 
        type="file"
        ref={fileInputRef}
        accept="image/*,.pdf"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      <div className="modal-content" style={{ maxWidth: '620px' }}>
        
        <div className="modal-header" style={{ borderBottomColor: 'rgba(244, 63, 94, 0.3)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <XCircle size={18} className="text-rose" />
              <h3 className="modal-title">Close / Return Generator ({generator.id})</h3>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{generator.name}</div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          
          <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '14px', borderRadius: '10px', display: 'flex', gap: '10px' }}>
            <AlertTriangle size={20} style={{ color: '#f87171', flexShrink: 0 }} />
            <div style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>
              <strong>Important Lifecycle Rule:</strong> Closing this generator will mark it as 
              <strong style={{ color: '#f87171' }}> CLOSED / RETURNED</strong>. 
              It will disappear from active generator listings, but will 
              <strong> permanently remain accessible</strong> in History, Reports, and Payment records.
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Closing Date</label>
              <input
                type="date"
                className="form-input"
                value={closingDate}
                onChange={(e) => setClosingDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Final Working Date</label>
              <input
                type="date"
                className="form-input"
                value={finalWorkingDate}
                onChange={(e) => setFinalWorkingDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Closing & Handover Remarks</label>
            <textarea
              className="form-textarea"
              rows="3"
              value={closingRemarks}
              onChange={(e) => setClosingRemarks(e.target.value)}
              placeholder="Enter handover details, fuel state, supplier receipt number..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Handover Document / Inspection Photo</label>
            <div style={{ border: '1px dashed var(--border-color)', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img 
                  src={docPhotoPreview} 
                  alt="Handover doc" 
                  onError={() => setDocPhotoPreview(DEFAULT_DOC_SVG)}
                  style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} 
                />
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700' }}>{fileName}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Signed physical return receipt attached</div>
                </div>
              </div>

              <button 
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={14} /> Upload Doc
              </button>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setConfirmedReturn(!confirmedReturn)}>
            <input
              type="checkbox"
              className="checklist-checkbox"
              checked={confirmedReturn}
              onChange={(e) => setConfirmedReturn(e.target.checked)}
            />
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>
              I confirm physical return of this generator unit to {generator.supplierName}.
            </span>
          </div>

        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={handleConfirmClose}>
            <XCircle size={16} /> Confirm Generator Closure
          </button>
        </div>

      </div>
    </div>
  );
}

