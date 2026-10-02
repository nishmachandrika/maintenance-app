import React, { useState } from 'react';
import { AlertTriangle, Calendar, X, FileText, CheckCircle } from 'lucide-react';

export default function MachineProblemModal({ generator, onClose, onSave }) {
  const [mode, setMode] = useState('add'); // 'add' or 'resolve'
  const [problemData, setProblemData] = useState({
    startDate: new Date().toISOString().split('T')[0],
    reason: '',
    remarks: ''
  });

  const [resolveData, setResolveData] = useState({
    problemId: '',
    endDate: new Date().toISOString().split('T')[0]
  });

  // Calculate non-working days for an ongoing problem up to a specific date
  const calculateDays = (start, end) => {
    const sDate = new Date(start);
    const eDate = new Date(end);
    const utc1 = Date.UTC(sDate.getFullYear(), sDate.getMonth(), sDate.getDate());
    const utc2 = Date.UTC(eDate.getFullYear(), eDate.getMonth(), eDate.getDate());
    return Math.max(0, Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24)) + 1);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!problemData.startDate || !problemData.reason) return;

    const newProblem = {
      id: `mp_${Date.now()}`,
      startDate: problemData.startDate,
      reason: problemData.reason,
      remarks: problemData.remarks,
      endDate: null // Ongoing
    };

    onSave(newProblem, 'add');
  };

  const handleSaveResolve = (e) => {
    e.preventDefault();
    if (!resolveData.problemId || !resolveData.endDate) return;
    onSave(resolveData, 'resolve');
  };

  const ongoingProblems = generator.machineProblems?.filter(p => !p.endDate) || [];
  const historicalProblems = generator.machineProblems?.filter(p => p.endDate) || [];

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)' }}>
            <AlertTriangle size={20} />
            <h2>Machine Problems: {generator.name}</h2>
          </div>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Tab Selection */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className={`btn ${mode === 'add' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setMode('add')}
            >
              Report New Problem
            </button>
            <button 
              className={`btn ${mode === 'resolve' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setMode('resolve')}
              disabled={ongoingProblems.length === 0}
            >
              Resolve Ongoing Problem ({ongoingProblems.length})
            </button>
          </div>

          {mode === 'add' && (
            <form onSubmit={handleSaveAdd} style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-input)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div className="form-group">
                <label className="form-label"><Calendar size={14} style={{display:'inline', marginRight:'4px'}}/> Problem Start Date *</label>
                <input 
                  type="date" 
                  className="form-input" 
                  required
                  value={problemData.startDate}
                  onChange={(e) => setProblemData({...problemData, startDate: e.target.value})}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label className="form-label"><AlertTriangle size={14} style={{display:'inline', marginRight:'4px'}}/> Problem Reason *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required
                  placeholder="e.g. Engine failure, Oil Leak..."
                  value={problemData.reason}
                  onChange={(e) => setProblemData({...problemData, reason: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label"><FileText size={14} style={{display:'inline', marginRight:'4px'}}/> Remarks</label>
                <textarea 
                  className="form-input" 
                  placeholder="Additional details..."
                  value={problemData.remarks}
                  onChange={(e) => setProblemData({...problemData, remarks: e.target.value})}
                  rows={3}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
                Save Machine Problem
              </button>
            </form>
          )}

          {mode === 'resolve' && (
            <form onSubmit={handleSaveResolve} style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(16, 185, 129, 0.05)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div className="form-group">
                <label className="form-label">Select Ongoing Problem *</label>
                <select 
                  className="form-select"
                  required
                  value={resolveData.problemId}
                  onChange={(e) => setResolveData({...resolveData, problemId: e.target.value})}
                >
                  <option value="">-- Select Problem --</option>
                  {ongoingProblems.map(p => (
                    <option key={p.id} value={p.id}>{p.reason} (Started: {p.startDate})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label"><CheckCircle size={14} style={{display:'inline', marginRight:'4px'}}/> Problem Resolved Date *</label>
                <input 
                  type="date" 
                  className="form-input" 
                  required
                  value={resolveData.endDate}
                  onChange={(e) => setResolveData({...resolveData, endDate: e.target.value})}
                  min={ongoingProblems.find(p => p.id === resolveData.problemId)?.startDate || ''}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <button type="submit" className="btn" style={{ marginTop: '8px', background: 'var(--accent-emerald)', color: 'white', fontWeight: 'bold' }}>
                Mark as Resolved
              </button>
            </form>
          )}

          <hr style={{ borderColor: 'var(--border-color)', margin: '10px 0' }} />

          {/* History */}
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '12px' }}>Problem History</h3>
            {(!generator.machineProblems || generator.machineProblems.length === 0) ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No machine problems logged for this generator.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {generator.machineProblems.map(p => (
                  <div key={p.id} style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ color: p.endDate ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>{p.reason}</strong>
                      <span className={`badge ${p.endDate ? 'badge-completed' : 'badge-pending'}`}>
                        {p.endDate ? 'Resolved' : 'Ongoing'}
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-dim)' }}>
                      Start: {p.startDate} {p.endDate && `| End: ${p.endDate}`}
                    </div>
                    {p.endDate && (
                      <div style={{ color: 'var(--accent-cyan)', marginTop: '4px', fontWeight: 'bold' }}>
                        Non-Working Days Logged: {calculateDays(p.startDate, p.endDate)} Days
                      </div>
                    )}
                    {p.remarks && <div style={{ marginTop: '4px', fontStyle: 'italic' }}>"{p.remarks}"</div>}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
