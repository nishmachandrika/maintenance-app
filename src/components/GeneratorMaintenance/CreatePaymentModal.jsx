import React, { useState } from 'react';
import { CreditCard, Building2, Plus, CheckCircle2, ArrowRight } from 'lucide-react';

export default function CreatePaymentModal({
  onClose,
  suppliers,
  generators,
  paymentRequests,
  setPaymentRequests,
  onOpenAddSupplier,
  initialSupplier,
  initialAmount,
  historicalLogs,
  setHistoricalLogs
}) {
  const [selectedSupplierId, setSelectedSupplierId] = useState(initialSupplier?.id || suppliers[0]?.id || '');
  const [paymentType, setPaymentType] = useState('Bank Transfer'); // Bank Transfer, UPI Transfer, Advance Cash

  // Bank fields
  const currentSupplier = suppliers.find(s => s.id === selectedSupplierId) || suppliers[0];
  const defaultBank = currentSupplier?.bankAccounts[0] || {};

  const [accountNumber, setAccountNumber] = useState(defaultBank.accountNumber || '');
  const [accountHolder, setAccountHolder] = useState(defaultBank.accountHolder || currentSupplier?.name || '');
  const [bankName, setBankName] = useState(defaultBank.bankName || 'HDFC Bank');
  const [ifscCode, setIfscCode] = useState(defaultBank.ifscCode || 'HDFC0001234');
  const [upiId, setUpiId] = useState(currentSupplier?.upiIds[0] || 'supplier@upi');

  const [amount, setAmount] = useState(initialAmount ? String(initialAmount) : '62500');
  const [remarks, setRemarks] = useState('Advance & monthly usage payout request');

  const handleSupplierChange = (supId) => {
    setSelectedSupplierId(supId);
    const sup = suppliers.find(s => s.id === supId);
    if (sup && sup.bankAccounts.length > 0) {
      setAccountNumber(sup.bankAccounts[0].accountNumber);
      setAccountHolder(sup.bankAccounts[0].accountHolder);
      setBankName(sup.bankAccounts[0].bankName);
      setIfscCode(sup.bankAccounts[0].ifscCode);
      if (sup.upiIds && sup.upiIds.length > 0) {
        setUpiId(sup.upiIds[0]);
      }
    }
  };

  const handleCreatePaymentRequest = () => {
    const supGens = generators.filter(g => g.supplierId === currentSupplier.id);
    const genList = supGens.length > 0
      ? supGens.map(g => ({ id: g.id, name: g.name, amount: parseFloat(amount) / supGens.length, days: 25, rate: g.costPerDay }))
      : [{ id: 'GEN-0001', name: 'Field Generator', amount: parseFloat(amount) || 50000, days: 25, rate: 2000 }];

    const newPayment = {
      id: `PAY-00${paymentRequests.length + 1}`,
      supplierId: currentSupplier.id,
      supplierName: currentSupplier.name,
      generators: genList,
      totalAmount: parseFloat(amount) || 50000,
      paymentType: paymentType,
      bankAccount: paymentType === 'Bank Transfer' ? `${bankName} - ${accountNumber} (IFSC: ${ifscCode})` : '',
      upiId: paymentType === 'UPI Transfer' ? upiId : '',
      status: 'Pending',
      requestDate: new Date().toISOString().split('T')[0],
      requestedBy: 'Site Maintenance Manager',
      remarks: remarks
    };

    setPaymentRequests([newPayment, ...paymentRequests]);

    if (setHistoricalLogs && historicalLogs) {
      const primaryGen = genList[0] || {};
      const newHistoryLog = {
        id: `hist-pay-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        generatorId: primaryGen.id || 'PAYMENT',
        generatorName: primaryGen.name || currentSupplier.name,
        supplier: currentSupplier.name,
        site: supGens[0]?.site || 'All Sites',
        section: supGens[0]?.section || 'General',
        actionType: 'PAYMENT_RECORDED',
        actionName: 'Payment Record Created',
        amount: parseFloat(amount) || 50000,
        daysCount: 25,
        period: 'Monthly Payout Cycle',
        paymentMode: paymentType,
        txnRef: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        remarks: remarks,
        status: 'PAID',
        inspector: 'Finance Manager'
      };
      setHistoricalLogs([newHistoryLog, ...historicalLogs]);
    }

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '650px' }}>
        
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Create Supplier Payment Request</h3>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Bank, UPI, or Advance Cash Payout (Sections 17-19)
            </div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          
          {/* Supplier Selection */}
          <div className="form-group">
            <label className="form-label">Select Supplier</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <select
                className="form-select"
                style={{ flex: 1 }}
                value={selectedSupplierId}
                onChange={(e) => handleSupplierChange(e.target.value)}
              >
                {suppliers.map(sup => (
                  <option key={sup.id} value={sup.id}>{sup.name}</option>
                ))}
              </select>
              <button className="btn btn-secondary btn-sm" onClick={onOpenAddSupplier}>
                + New Supplier
              </button>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="form-group">
            <label className="form-label">Payment Transfer Method</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <button
                type="button"
                className={`btn ${paymentType === 'Bank Transfer' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setPaymentType('Bank Transfer')}
              >
                Bank Transfer
              </button>
              <button
                type="button"
                className={`btn ${paymentType === 'UPI Transfer' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setPaymentType('UPI Transfer')}
              >
                UPI Transfer
              </button>
              <button
                type="button"
                className={`btn ${paymentType === 'Advance Cash' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setPaymentType('Advance Cash')}
              >
                Advance Cash
              </button>
            </div>
          </div>

          {/* Dynamic Form based on Payment Type */}
          {paymentType === 'Bank Transfer' && (
            <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>Bank Account Details</div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Account Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Account Holder Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Bank Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">IFSC Code</label>
                  <input
                    type="text"
                    className="form-input"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {paymentType === 'UPI Transfer' && (
            <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '10px' }}>
              <div className="form-group">
                <label className="form-label">Supplier UPI ID</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="supplier@hdfcbank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>
            </div>
          )}

          {paymentType === 'Advance Cash' && (
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '14px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-amber)' }}>Advance Cash Payment Request</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Cash voucher will be generated for petty cash clearance upon approval.
              </div>
            </div>
          )}

          {/* Amount & Remarks */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Payout Amount (₹)</label>
              <input
                type="number"
                className="form-input"
                placeholder="62500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Remarks</label>
              <input
                type="text"
                className="form-input"
                placeholder="Remarks for finance review"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>

        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleCreatePaymentRequest}>
            <CheckCircle2 size={16} /> Submit Payment Request
          </button>
        </div>

      </div>
    </div>
  );
}
