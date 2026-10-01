import React, { useState } from 'react';
import { 
  History, Clock, Calendar, Zap, Building2, MapPin, 
  CheckCircle2, XCircle, FileText, Camera, Fuel, DollarSign, 
  User, Eye, ShieldCheck, Download, AlertTriangle, ChevronRight, ClipboardCheck 
} from 'lucide-react';

export default function HistoryDetailModal({ log, onClose }) {
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  if (!log) return null;

  // Helper to determine action type badge color & label
  const getActionInfo = (log) => {
    const type = log.actionType || (
      log.items ? 'CHECKLIST_INSPECTION' :
      log.amount ? 'PAYMENT_RECORDED' :
      log.closedDate ? 'GENERATOR_CLOSED' :
      log.costPerDay ? 'GENERATOR_CREATED' :
      'DAILY_USAGE'
    );

    switch (type) {
      case 'CHECKLIST_INSPECTION':
        return { label: 'Pre-Operational Checklist', badgeClass: 'badge-completed', icon: ClipboardCheck, color: 'var(--accent-emerald)' };
      case 'GENERATOR_CLOSED':
        return { label: 'Generator Closure & Return', badgeClass: 'badge-closed', icon: XCircle, color: '#f87171' };
      case 'GENERATOR_CREATED':
        return { label: 'Generator Registered', badgeClass: 'badge-active', icon: Zap, color: 'var(--accent-cyan)' };
      case 'RETURN_REQUESTED':
        return { label: 'Return Requested', badgeClass: 'badge-amber', icon: AlertTriangle, color: 'var(--accent-amber)' };
      case 'PAYMENT_RECORDED':
        return { label: 'Payment Record Created', badgeClass: 'badge-active', icon: DollarSign, color: 'var(--primary-light)' };
      case 'SUPPLIER_ADDED':
        return { label: 'New Supplier Onboarded', badgeClass: 'badge-active', icon: Building2, color: 'var(--accent-violet)' };
      case 'DAILY_USAGE':
      default:
        return { label: 'Daily Usage Entry', badgeClass: 'badge-active', icon: Clock, color: 'var(--accent-cyan)' };
    }
  };

  const actionInfo = getActionInfo(log);
  const ActionIcon = actionInfo.icon;

  // Print/Export Single Activity Record PDF/Text
  const handlePrintExport = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      {/* Lightbox Photo Preview */}
      {lightboxPhoto && (
        <div 
          className="modal-overlay" 
          style={{ zIndex: 1200, background: 'rgba(0,0,0,0.88)' }}
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
              style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '12px', border: '2px solid var(--border-accent)', boxShadow: '0 20px 40px rgba(0,0,0,0.7)' }} 
            />
            <div style={{ textAlign: 'center', color: '#fff', marginTop: '12px', fontWeight: '700', fontSize: '1rem' }}>
              {lightboxPhoto.title}
            </div>
          </div>
        </div>
      )}

      <div className="modal-content" style={{ maxWidth: '750px' }}>
        
        {/* Header */}
        <div className="modal-header" style={{ borderBottomColor: 'var(--border-accent)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className={`badge ${actionInfo.badgeClass}`} style={{ fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <ActionIcon size={13} /> {actionInfo.label}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {log.id}
              </span>
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', marginTop: '6px', color: 'var(--text-main)' }}>
              Activity Record Details
            </h2>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Top Metadata Banner */}
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>DATE & TIME</div>
              <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--accent-cyan)', marginTop: '2px' }}>
                {log.date} {log.timestamp ? `(${log.timestamp})` : ''}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>GENERATOR</div>
              <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '2px' }}>
                {log.generatorId} - {log.generatorName}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>SITE & SECTION</div>
              <div style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-main)', marginTop: '2px' }}>
                {log.site} - {log.section}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>SUPPLIER</div>
              <div style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-main)', marginTop: '2px' }}>
                {log.supplier || 'N/A'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>INSPECTOR / OPERATOR</div>
              <div style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-main)', marginTop: '2px' }}>
                {log.inspector || 'Supervisor'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>ACTION STATUS</div>
              <div style={{ marginTop: '2px' }}>
                <span className="badge badge-active">{log.status || 'Completed'}</span>
              </div>
            </div>
          </div>

          {/* ACTION TYPE 1: DAILY USAGE ENTRY */}
          {(!log.actionType || log.actionType === 'DAILY_USAGE') && !log.items && !log.amount && !log.closedDate && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Timing & Duration strip */}
              <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-accent)', padding: '14px 18px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>OPERATIONAL RUN TIMINGS</div>
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>
                    Start: <span style={{ color: 'var(--accent-cyan)' }}>{log.startTime || '--'}</span> | Stop: <span style={{ color: 'var(--accent-emerald)' }}>{log.stopTime || '--'}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>TOTAL CALCULATED DURATION</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                    {log.hours || log.workingHours || '0'} Hours
                  </div>
                </div>
              </div>

              {/* Technical Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div style={{ background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>FUEL TANK CONNECTED</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '4px' }}>{log.tank || 'Tank A1'}</div>
                </div>

                <div style={{ background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>FAN SETS OPERATING</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '4px' }}>{log.fanSets || log.fanSetsUsed || 4} Sets</div>
                </div>

                <div style={{ background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>DIESEL / FUEL ADDED</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--accent-emerald)', marginTop: '4px' }}>{log.dieselLiters || log.dieselAddedLiters || 0} Liters</div>
                </div>
              </div>

              {/* Photos Block */}
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  Meter Verification Photos
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {/* Start Photo */}
                  <div style={{ border: '1px dashed var(--border-accent)', padding: '10px', borderRadius: '10px', background: 'var(--bg-input)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-cyan)', marginBottom: '6px' }}>
                      Start Meter Photo
                    </div>
                    {log.startPhoto ? (
                      <img 
                        src={log.startPhoto} 
                        alt="Start Meter Reading" 
                        style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }} 
                        onClick={() => setLightboxPhoto({ url: log.startPhoto, title: `${log.generatorId} Start Meter Reading` })}
                      />
                    ) : (
                      <div style={{ padding: '30px 10px', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
                        <Camera size={28} style={{ marginBottom: '6px', opacity: 0.5 }} />
                        <div>No start photo attached for this record</div>
                      </div>
                    )}
                  </div>

                  {/* Stop Photo */}
                  <div style={{ border: '1px dashed var(--border-accent)', padding: '10px', borderRadius: '10px', background: 'var(--bg-input)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-emerald)', marginBottom: '6px' }}>
                      Stop Meter Photo
                    </div>
                    {log.stopPhoto ? (
                      <img 
                        src={log.stopPhoto} 
                        alt="Stop Meter Reading" 
                        style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }} 
                        onClick={() => setLightboxPhoto({ url: log.stopPhoto, title: `${log.generatorId} Stop Meter Reading` })}
                      />
                    ) : (
                      <div style={{ padding: '30px 10px', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
                        <Camera size={28} style={{ marginBottom: '6px', opacity: 0.5 }} />
                        <div>No stop photo attached for this record</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ACTION TYPE 2: CHECKLIST INSPECTION */}
          {(log.actionType === 'CHECKLIST_INSPECTION' || log.items) && (
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>
                Pre-Operational Inspection Items Checklist
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', background: 'var(--bg-input)', padding: '14px', borderRadius: '10px' }}>
                {Object.entries(log.items || {}).map(([key, val]) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card-solid)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.8rem', textTransform: 'capitalize', color: 'var(--text-main)' }}>
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    {val ? (
                      <span className="badge badge-active" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                        <CheckCircle2 size={11} style={{ marginRight: '3px' }} /> Pass
                      </span>
                    ) : (
                      <span className="badge badge-closed" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                        <XCircle size={11} style={{ marginRight: '3px' }} /> Issue
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTION TYPE 3: GENERATOR CLOSURE */}
          {(log.actionType === 'GENERATOR_CLOSED' || log.closedDate) && (
            <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontWeight: '700', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <XCircle size={18} /> Permanent Generator Closure & Supplier Handover
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                <strong>Closing Date:</strong> {log.closingDate || log.date} | <strong>Final Working Date:</strong> {log.finalWorkingDate || log.date}
              </div>

              {log.closingPhoto && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px' }}>Handover Document / Return Receipt Photo:</div>
                  <img 
                    src={log.closingPhoto} 
                    alt="Handover Document" 
                    style={{ width: '140px', height: '90px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer', border: '1px solid var(--border-accent)' }} 
                    onClick={() => setLightboxPhoto({ url: log.closingPhoto, title: `${log.generatorId} Handover Document` })}
                  />
                </div>
              )}
            </div>
          )}

          {/* ACTION TYPE 4: PAYMENT RECORD */}
          {(log.actionType === 'PAYMENT_RECORDED' || log.amount) && (
            <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-highlight)', padding: '16px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-light)' }}>
                  PAYMENT RECORD DETAILS
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                  ₹{(parseFloat(log.amount) || 0).toLocaleString('en-IN')}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                <div><strong>Days Paid:</strong> {log.daysCount || log.hours || 'N/A'} Days</div>
                <div><strong>Billing Period:</strong> {log.period || log.date}</div>
                <div><strong>Payment Mode:</strong> {log.paymentMode || 'Bank Transfer'}</div>
                <div><strong>Txn Reference:</strong> {log.txnRef || 'TXN-994821'}</div>
              </div>

              {log.invoiceDoc && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px' }}>Uploaded Invoice Document:</div>
                  <img 
                    src={log.invoiceDoc} 
                    alt="Invoice Attachment" 
                    style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer' }} 
                    onClick={() => setLightboxPhoto({ url: log.invoiceDoc, title: 'Invoice Receipt Attachment' })}
                  />
                </div>
              )}
            </div>
          )}

          {/* ACTION TYPE 5: GENERATOR CREATED */}
          {log.actionType === 'GENERATOR_CREATED' && (
            <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-accent)', padding: '16px', borderRadius: '10px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontSize: '0.8rem', color: 'var(--text-main)' }}>
              <div><strong>Cost Per Day:</strong> ₹{log.costPerDay || 2000}</div>
              <div><strong>Fan Sets:</strong> {log.fanSets || 4}</div>
              <div><strong>Model:</strong> {log.model || 'Standard'}</div>
              <div><strong>Type:</strong> {log.type || 'Diesel'}</div>
              <div><strong>Onboarding Date:</strong> {log.date}</div>
            </div>
          )}

          {/* Remarks Section */}
          <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Operational Remarks & Inspector Notes
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontStyle: 'italic' }}>
              "{log.remarks || 'No specific remarks recorded for this activity.'}"
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={handlePrintExport}>
            <Download size={14} /> Print / Export Record
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}
