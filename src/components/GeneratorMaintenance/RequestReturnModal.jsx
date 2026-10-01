import React, { useState } from 'react';
import { XCircle, Calendar, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function RequestReturnModal({
  generator,
  onClose,
  generators,
  setGenerators,
  historicalLogs,
  setHistoricalLogs
}) {
  const [proposedDate, setProposedDate] = useState(new Date().toISOString().split('T')[0]);
  const [returnRemarks, setReturnRemarks] = useState('Site operational phase completed. Requesting return confirmation from Admin.');

  if (!generator) return null;

  const handleSubmitRequest = () => {
    const updated = generators.map(g => {
      if (g.id === generator.id) {
        return {
          ...g,
          returnRequested: true,
          returnRequestedDate: proposedDate,
          returnRequestedRemarks: returnRemarks
        };
      }
      return g;
    });

    setGenerators(updated);

    if (setHistoricalLogs && historicalLogs) {
      const newHistoryLog = {
        id: `hist-req-${Date.now()}`,
        date: proposedDate,
        generatorId: generator.id,
        generatorName: generator.name,
        supplier: generator.supplierName,
        site: generator.site,
        section: generator.section,
        actionType: 'RETURN_REQUESTED',
        actionName: 'Return Requested',
        remarks: returnRemarks,
        status: 'Awaiting Admin Review',
        inspector: generator.supervisor
      };
      setHistoricalLogs([newHistoryLog, ...historicalLogs]);
    }

    onClose();
    alert(`Generator return request for ${generator.id} submitted for Admin Review!`);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '580px' }}>
        
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={18} className="text-amber" />
              <h3 className="modal-title">Request Generator Return ({generator.id})</h3>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{generator.name} ({generator.site})</div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '14px', borderRadius: '10px', display: 'flex', gap: '10px' }}>
            <AlertCircle size={20} style={{ color: '#fbbf24', flexShrink: 0 }} />
            <div style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>
              <strong>Supervisor Workflow Control:</strong> Supervisors initiate a 
              <strong> Generator Return Request</strong>. System Admin will review and approve the final physical closure.
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Proposed Closing Date</label>
            <input
              type="date"
              className="form-input"
              value={proposedDate}
              onChange={(e) => setProposedDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Site Return Remarks & Operational State</label>
            <textarea
              className="form-textarea"
              rows="3"
              value={returnRemarks}
              onChange={(e) => setReturnRemarks(e.target.value)}
              placeholder="Enter site shutdown remarks, fuel level, meter reading..."
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmitRequest}>
            <CheckCircle2 size={16} /> Submit Return Request for Admin Review
          </button>
        </div>

      </div>
    </div>
  );
}
