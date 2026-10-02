import React, { useState } from 'react';
import { CreditCard, Plus, Clock, CheckCircle2, ArrowRight, DollarSign, Building2, ShieldCheck, Lock, Search, Eye, Filter, Download } from 'lucide-react';
import PaymentDetailModal from './PaymentDetailModal';

export default function PaymentsTab({
  paymentRequests,
  setPaymentRequests,
  suppliers,
  generators,
  currentUser,
  onOpenCreatePayment
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedPaymentForDetail, setSelectedPaymentForDetail] = useState(null);

  // Filter logic with RBAC Site Isolation & Supplier / Status / Type Filters
  const filteredRequests = paymentRequests.filter(req => {
    // Supervisor Site Isolation
    if (currentUser.role === 'supervisor' && req.site && req.site !== currentUser.assignedSite) {
      return false;
    }

    const query = searchTerm.toLowerCase();
    const matchesQuery = 
      req.id.toLowerCase().includes(query) ||
      req.supplierName.toLowerCase().includes(query) ||
      (req.site && req.site.toLowerCase().includes(query)) ||
      (req.paymentType && req.paymentType.toLowerCase().includes(query)) ||
      (req.bankAccount && req.bankAccount.toLowerCase().includes(query)) ||
      (req.upiId && req.upiId.toLowerCase().includes(query));

    if (!matchesQuery) return false;

    if (supplierFilter !== 'ALL' && req.supplierId !== supplierFilter && req.supplierName !== supplierFilter) return false;
    if (statusFilter !== 'ALL' && req.status !== statusFilter) return false;
    if (typeFilter !== 'ALL' && req.paymentType !== typeFilter) return false;

    return true;
  });

  // Calculate Metrics
  const totalPayoutVolume = filteredRequests.reduce((sum, r) => sum + (parseFloat(r.totalAmount) || 0), 0);
  const processedVolume = filteredRequests.filter(r => r.status === 'Payment Processed' || r.status === 'Approved').reduce((sum, r) => sum + (parseFloat(r.totalAmount) || 0), 0);
  const pendingCount = filteredRequests.filter(r => r.status === 'Pending' || r.status === 'Finance Review').length;

  // Advance pipeline status (Admin or Finance role)
  const handleAdvanceStatus = (reqId) => {
    if (currentUser.role === 'supervisor') {
      alert('Permission Denied: Supervisors cannot alter Finance payment status. This status is updated by the Finance department.');
      return;
    }

    const updated = paymentRequests.map(req => {
      if (req.id === reqId) {
        let nextStatus = 'Finance Review';
        if (req.status === 'Pending') nextStatus = 'Finance Review';
        else if (req.status === 'Finance Review') nextStatus = 'Approved';
        else if (req.status === 'Approved') nextStatus = 'Payment Processed';
        else if (req.status === 'Payment Processed') nextStatus = 'Pending';
        return { ...req, status: nextStatus };
      }
      return req;
    });
    setPaymentRequests(updated);
  };

  const exportCSV = () => {
    const headers = ["Transaction ID", "Supplier Name", "Date", "Status", "Payment Mode", "Total Amount"];
    const rows = filteredRequests.map(r => [
      r.id, `"${r.supplierName}"`, r.date, r.status, r.paymentType, r.totalAmount
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `payment_requests_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Detail Modal */}
      {selectedPaymentForDetail && (
        <PaymentDetailModal
          payment={selectedPaymentForDetail}
          onClose={() => setSelectedPaymentForDetail(null)}
          onAdvanceStatus={handleAdvanceStatus}
          currentUser={currentUser}
        />
      )}

      {/* Header Bar */}
      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CreditCard size={20} className="text-cyan" />
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              Supplier Payments & Transaction Records
            </h2>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Master roster of all supplier payout requests, bank transfers, and finance pipeline status
            </div>
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => onOpenCreatePayment()} style={{ marginLeft: 'auto' }}>
          <Plus size={16} /> Create Payment Request
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>TOTAL TRANSACTIONS</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-cyan)', marginTop: '4px' }}>
            {filteredRequests.length} Transactions
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>TOTAL PAYOUT VOLUME</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
            ₹{totalPayoutVolume.toLocaleString('en-IN')}
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>APPROVED & PROCESSED</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-emerald)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
            ₹{processedVolume.toLocaleString('en-IN')}
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>PENDING FINANCE REVIEW</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-amber)', marginTop: '4px' }}>
            {pendingCount} Pending
          </div>
        </div>
      </div>

      {/* Finance Integration Pipeline Explanation Banner */}
      <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', padding: '16px 20px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ fontWeight: '700', fontSize: '0.88rem', color: 'var(--text-main)' }}>
            Finance Pipeline Integration Workflow
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Status updates link directly with Finance Payout Module
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div className="pipeline-step done" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>1. Requested (Supervisor/Site)</div>
          <ArrowRight size={14} className="text-muted" />
          <div className="pipeline-step active" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>2. Finance Review</div>
          <ArrowRight size={14} className="text-muted" />
          <div className="pipeline-step" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>3. Approved</div>
          <ArrowRight size={14} className="text-muted" />
          <div className="pipeline-step" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>4. Payment Processed</div>
        </div>
      </div>

      {/* Search & Multi-Filter Bar */}
      <div className="filter-bar">
        <div className="search-input-box">
          <Search size={16} className="text-muted" />
          <input
            type="text"
            placeholder="Search Supplier, Transaction ID, Generator, Account..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select className="filter-select" value={supplierFilter} onChange={(e) => setSupplierFilter(e.target.value)}>
          <option value="ALL">All Suppliers</option>
          {suppliers.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="ALL">All Finance Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Finance Review">Finance Review</option>
          <option value="Approved">Approved</option>
          <option value="Payment Processed">Payment Processed</option>
        </select>

        <select className="filter-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="ALL">All Payment Modes</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="UPI Transfer">UPI Transfer</option>
          <option value="Advance Cash">Advance Cash</option>
        </select>

        <button className="btn btn-secondary" onClick={exportCSV} style={{ marginLeft: 'auto' }}>
          <Download size={16} /> Download
        </button>
      </div>

      {/* Payment Requests Master Roster Table */}
      <div className="table-card">
        <div className="table-header-bar">
          <span className="table-title">
            <CreditCard size={18} className="text-muted" /> Master Supplier Transactions Roster ({filteredRequests.length} Transactions)
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>💡 Click any row to view full transaction voucher</span>
            {currentUser.role === 'supervisor' && (
              <span className="badge badge-completed">Filtered to {currentUser.assignedSite} Site</span>
            )}
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Txn ID</th>
                <th>Supplier Name</th>
                <th>Site & Generator(s)</th>
                <th>Mode & Account Details</th>
                <th>Total Payout</th>
                <th>Request Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '30px' }}>
                    No supplier payment transactions recorded for this filter scope.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr 
                    key={req.id}
                    onClick={() => setSelectedPaymentForDetail(req)}
                    style={{ cursor: 'pointer', transition: 'background 0.15s ease' }}
                    className="history-table-row"
                  >
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                      {req.id}
                    </td>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{req.supplierName}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{req.requestedBy || 'Site Manager'}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-amber)' }}>{req.site || 'Akividu'}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '2px' }}>
                        {req.generators && req.generators.map(g => (
                          <span key={g.id} className="badge badge-completed" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                            {g.id}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', fontSize: '0.82rem' }}>{req.paymentType}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                        {req.bankAccount ? `HDFC - XXXX XXXX ${req.bankAccount.slice(-4)}` : req.upiId || 'Direct Payout'}
                      </div>
                    </td>
                    <td style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                      ₹{(parseFloat(req.totalAmount) || 0).toLocaleString('en-IN')}
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>{req.requestDate}</td>
                    <td>
                      <span className={`badge ${
                        req.status === 'Payment Processed' ? 'badge-paid' :
                        req.status === 'Approved' ? 'badge-approved' :
                        req.status === 'Finance Review' ? 'badge-review' : 'badge-pending'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.72rem', padding: '3px 8px', color: 'var(--accent-cyan)' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPaymentForDetail(req);
                          }}
                        >
                          <Eye size={13} /> View
                        </button>
                        {currentUser.role !== 'supervisor' && (
                          <button
                            className="btn btn-outline btn-sm"
                            style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdvanceStatus(req.id);
                            }}
                            title="Advance status in Finance pipeline"
                          >
                            Advance →
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

