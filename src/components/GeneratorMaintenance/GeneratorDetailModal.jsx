import React, { useState } from 'react';
import { Zap, Calendar, DollarSign, Calculator, Play, XCircle, Clock, FileText, CheckCircle2, User, Building2, MapPin, ClipboardCheck } from 'lucide-react';

export default function GeneratorDetailModal({
  generator,
  onClose,
  onOpenDailyEntry,
  onOpenChecklist,
  onOpenCloseGenerator,
  todayActivities,
  historicalLogs
}) {
  const [expectedDays, setExpectedDays] = useState(15);

  if (!generator) return null;

  // Days Calculation
  const start = new Date(generator.startingDate);
  const end = generator.status === 'CLOSED / RETURNED' && generator.closedDate
    ? new Date(generator.closedDate)
    : new Date();

  const diffTime = Math.max(0, end - start);
  const calendarDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const nonWorkingDays = generator.nonWorkingDays || 0;
  const workingDays = Math.max(0, calendarDays - nonWorkingDays);
  const currentAmount = workingDays * generator.costPerDay;

  // Future Estimation
  const expectedAdditionalCost = (parseInt(expectedDays) || 0) * generator.costPerDay;

  // Filter logs for this generator
  const genLogs = historicalLogs.filter(h => h.generatorId === generator.id);

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '850px' }}>
        
        {/* Header Summary */}
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: 'var(--accent-cyan)', fontWeight: '700' }}>
                {generator.id}
              </span>
              <span className={`badge ${generator.status === 'ACTIVE' ? 'badge-active' : 'badge-closed'}`}>
                {generator.status}
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginTop: '4px' }}>{generator.name}</h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{generator.type} | Model: {generator.model}</div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">

          {/* Quick Info Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={16} className="text-muted" />
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Supplier</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>{generator.supplierName}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} className="text-muted" />
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Site & Section</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>{generator.site} - {generator.section}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} className="text-muted" />
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Supervisor</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>{generator.supervisor}</div>
              </div>
            </div>
          </div>

          {/* Auto-Calculated Financial & Usage Metrics */}
          <div>
            <h3 style={{ fontSize: '0.92rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px', letterSpacing: '0.05em' }}>
              Auto-Calculated Financial & Usage Metrics
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
              <div style={{ background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>STARTING DATE</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', marginTop: '4px', color: 'var(--text-main)' }}>{generator.startingDate}</div>
              </div>

              <div style={{ background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>CALENDAR DAYS</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-cyan)', marginTop: '2px' }}>{calendarDays}</div>
              </div>

              <div style={{ background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>NON-WORKING DAYS</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-amber)', marginTop: '2px' }}>{nonWorkingDays}</div>
              </div>

              <div style={{ background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>WORKING DAYS</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-emerald)', marginTop: '2px' }}>{workingDays}</div>
              </div>

              <div style={{ background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>COST PER DAY</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', marginTop: '4px', color: 'var(--text-main)' }}>₹{generator.costPerDay.toLocaleString()}</div>
              </div>

              <div style={{ background: 'var(--bg-card-solid)', border: '1px solid var(--border-highlight)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--primary-light)', fontWeight: '700' }}>PAYABLE AMOUNT</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>₹{currentAmount.toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>

          {/* Continued Usage Calculator */}
          {generator.status === 'ACTIVE' && (
            <div style={{ background: 'var(--bg-input)', border: '1px dashed var(--border-highlight)', padding: '16px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Calculator size={18} className="text-primary-light" />
                <span style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  Continued Usage Estimator (Future Usage Projection)
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Paying for a billing cycle does NOT close the generator. Enter expected future days to preview upcoming cost.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label className="form-label" style={{ margin: 0 }}>Expected Additional Days:</label>
                  <input
                    type="number"
                    min="1"
                    className="form-input"
                    style={{ width: '90px', padding: '6px 10px' }}
                    value={expectedDays}
                    onChange={(e) => setExpectedDays(e.target.value)}
                  />
                </div>

                <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--accent-emerald)' }}>
                  Cost Per Day: ₹{generator.costPerDay.toLocaleString()}
                </div>

                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#ffffff', background: 'var(--primary)', padding: '6px 14px', borderRadius: '8px' }}>
                  Expected Additional Amount: ₹{expectedAdditionalCost.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          )}

          {/* Generator Closure Details if Closed */}
          {generator.status === 'CLOSED / RETURNED' && (
            <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '16px', borderRadius: '12px' }}>
              <div style={{ fontWeight: '700', color: '#f87171', marginBottom: '4px' }}>Generator Closed & Returned</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-main)' }}>Closing Date: {generator.closedDate}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>Remarks: {generator.closedRemarks}</div>
            </div>
          )}

          {/* Activity Logs for this generator */}
          <div>
            <h3 style={{ fontSize: '0.92rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>
              Recent Logged Activities
            </h3>
            
            <div className="table-container" style={{ maxHeight: '180px' }}>
              <table className="custom-table" style={{ fontSize: '0.82rem' }}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Start</th>
                    <th>Stop</th>
                    <th>Hours</th>
                    <th>Tank</th>
                    <th>Fan Sets</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {genLogs.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-dim)' }}>
                        No past log records for this generator
                      </td>
                    </tr>
                  ) : (
                    genLogs.map(log => (
                      <tr key={log.id}>
                        <td>{log.date}</td>
                        <td>{log.startTime}</td>
                        <td>{log.stopTime}</td>
                        <td>{log.hours}h</td>
                        <td>{log.tank}</td>
                        <td>{log.fanSets}</td>
                        <td><span className="badge badge-completed">{log.status}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions: Daily Entry, Checklist (AFTER Daily Entry), Close */}
        <div className="modal-footer">
          {generator.status === 'ACTIVE' && (
            <>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  onClose();
                  onOpenDailyEntry(generator);
                }}
              >
                <Play size={16} /> Daily Usage Entry
              </button>

              {/* CHECKLIST BUTTON PLACED AFTER DAILY ENTRY BUTTON */}
              <button 
                className="btn btn-outline"
                onClick={() => {
                  onClose();
                  onOpenChecklist(generator);
                }}
                style={{ color: 'var(--accent-cyan)', borderColor: 'var(--border-accent)' }}
              >
                <ClipboardCheck size={16} /> Checklist
              </button>

              <button 
                className="btn btn-danger"
                onClick={() => {
                  onClose();
                  onOpenCloseGenerator(generator);
                }}
              >
                <XCircle size={16} /> Close / Return Generator
              </button>
            </>
          )}

          <button className="btn btn-outline" onClick={onClose}>
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}
