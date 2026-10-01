import React, { useState } from 'react';
import { 
  CreditCard, Building2, Calendar, DollarSign, CheckCircle2, 
  ArrowRight, ShieldCheck, Download, Lock, FileText, User, MapPin, Zap
} from 'lucide-react';

export default function PaymentDetailModal({ payment, onClose, onAdvanceStatus, currentUser }) {
  if (!payment) return null;

  const handlePrintVoucher = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '720px' }}>
        
        {/* Header */}
        <div className="modal-header" style={{ borderBottomColor: 'var(--border-highlight)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', color: 'var(--accent-cyan)', fontWeight: '700' }}>
                {payment.id}
              </span>
              <span className={`badge ${
                payment.status === 'Payment Processed' ? 'badge-paid' :
                payment.status === 'Approved' ? 'badge-approved' :
                payment.status === 'Finance Review' ? 'badge-review' : 'badge-pending'
              }`}>
                {payment.status}
              </span>
            </div>
            <h3 className="modal-title" style={{ marginTop: '4px' }}>
              Supplier Payout Transaction Record
            </h3>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Top Summary Banner */}
          <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-highlight)', padding: '16px 20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--primary-light)', textTransform: 'uppercase', fontWeight: '700' }}>
                TOTAL PAYOUT AMOUNT
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                ₹{(parseFloat(payment.totalAmount) || 0).toLocaleString('en-IN')}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>REQUEST DATE & INITIATOR</div>
              <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '2px' }}>
                {payment.requestDate} ({payment.requestedBy || 'Site Supervisor'})
              </div>
            </div>
          </div>

          {/* Supplier & Bank Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>
                <Building2 size={14} /> Supplier Information
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)' }}>{payment.supplierName}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Site Location: <strong style={{ color: 'var(--text-main)' }}>{payment.site || 'Akividu'}</strong>
              </div>
            </div>

            <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>
                <CreditCard size={14} /> Account / Payment Mode
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-main)' }}>{payment.paymentType}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                {payment.bankAccount || payment.upiId || 'Direct Payout'}
              </div>
            </div>
          </div>

          {/* Finance Integration Pipeline Tracker */}
          <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
              Finance Lifecycle Pipeline State
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <div className="pipeline-step done" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>1. Requested</div>
              <ArrowRight size={14} className="text-muted" />
              <div className={`pipeline-step ${payment.status !== 'Pending' ? 'done' : 'active'}`} style={{ fontSize: '0.75rem', padding: '6px 12px' }}>2. Finance Review</div>
              <ArrowRight size={14} className="text-muted" />
              <div className={`pipeline-step ${payment.status === 'Approved' || payment.status === 'Payment Processed' ? 'done' : ''}`} style={{ fontSize: '0.75rem', padding: '6px 12px' }}>3. Approved</div>
              <ArrowRight size={14} className="text-muted" />
              <div className={`pipeline-step ${payment.status === 'Payment Processed' ? 'done' : ''}`} style={{ fontSize: '0.75rem', padding: '6px 12px' }}>4. Payment Processed</div>
            </div>
          </div>

          {/* Linked Generator Breakdown */}
          <div>
            <h4 style={{ fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>
              Generator Rental Payout Breakdown
            </h4>

            <div className="table-container" style={{ maxHeight: '180px' }}>
              <table className="custom-table" style={{ fontSize: '0.82rem' }}>
                <thead>
                  <tr>
                    <th>Generator ID</th>
                    <th>Generator Name</th>
                    <th>Days Paid</th>
                    <th>Rate / Day</th>
                    <th style={{ textAlign: 'right' }}>Calculated Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {(!payment.generators || payment.generators.length === 0) ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-dim)' }}>
                        General Supplier Payout Pertaining to All Units
                      </td>
                    </tr>
                  ) : (
                    payment.generators.map(g => (
                      <tr key={g.id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)' }}>{g.id}</td>
                        <td>{g.name}</td>
                        <td>{g.days || 25} Days</td>
                        <td>₹{(g.rate || 2000).toLocaleString()}</td>
                        <td style={{ textAlign: 'right', fontWeight: '700', color: 'var(--accent-emerald)' }}>
                          ₹{(g.amount || 0).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Remarks Section */}
          <div style={{ background: 'var(--bg-input)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>REMARKS & AUDIT NOTE</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '4px' }}>
              "{payment.remarks || 'Standard monthly supplier usage transaction.'}"
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={handlePrintVoucher}>
            <Download size={14} /> Export Payment Voucher
          </button>
          
          {currentUser?.role !== 'supervisor' && onAdvanceStatus && (
            <button 
              className="btn btn-primary" 
              onClick={() => {
                onAdvanceStatus(payment.id);
                onClose();
              }}
            >
              Advance Finance Status →
            </button>
          )}

          <button className="btn btn-secondary" onClick={onClose}>
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}
