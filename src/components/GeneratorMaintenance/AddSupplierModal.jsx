import React, { useState } from 'react';
import { Building2, CreditCard, Plus, CheckCircle2 } from 'lucide-react';

export default function AddSupplierModal({
  onClose,
  suppliers,
  setSuppliers,
  historicalLogs,
  setHistoricalLogs
}) {
  const [supplierName, setSupplierName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Bank Account Fields
  const [bankName, setBankName] = useState('HDFC Bank');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [upiId, setUpiId] = useState('');

  const handleSaveSupplier = () => {
    if (!supplierName.trim()) {
      alert('Please enter a Supplier Name.');
      return;
    }

    // Check for duplicate supplier name
    const exists = suppliers.find(s => s.name.toLowerCase() === supplierName.trim().toLowerCase());
    if (exists) {
      alert(`Supplier "${supplierName}" already exists! Please select the existing supplier to add bank details.`);
      return;
    }

    const newSupplier = {
      id: `sup-${Date.now()}`,
      name: supplierName,
      contactPerson: contactPerson || 'Operations Contact',
      phone: phone || '+91 98000 00000',
      email: email || 'vendor@agency.com',
      bankAccounts: [
        {
          id: `bank-${Date.now()}`,
          bankName: bankName,
          accountNumber: accountNumber || '5010099882211',
          accountHolder: accountHolder || supplierName,
          ifscCode: ifscCode || 'HDFC0001234',
          branch: 'Main City Branch'
        }
      ],
      upiIds: upiId ? [upiId] : [`${supplierName.toLowerCase().replace(/\s+/g, '')}@upi`]
    };

    setSuppliers([newSupplier, ...suppliers]);

    if (setHistoricalLogs && historicalLogs) {
      const newHistoryLog = {
        id: `hist-sup-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        generatorId: 'SUPPLIER',
        generatorName: supplierName,
        supplier: supplierName,
        site: 'All Sites',
        section: 'General',
        actionType: 'SUPPLIER_ADDED',
        actionName: 'New Supplier Onboarded',
        contactPerson: contactPerson || 'Operations Contact',
        phone: phone || '+91 98000 00000',
        bankAccount: `${bankName} (${accountNumber || '5010099882211'})`,
        remarks: `Supplier ${supplierName} onboarded with contact ${contactPerson || 'N/A'}.`,
        status: 'ACTIVE',
        inspector: 'Admin'
      };
      setHistoricalLogs([newHistoryLog, ...historicalLogs]);
    }

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '620px' }}>
        
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Register New Supplier / Vendor</h3>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Supplier and bank account management</div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          
          {/* Supplier Basic Information */}
          <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--accent-cyan)' }}>
            1. Supplier Business Profile
          </div>

          <div className="form-group">
            <label className="form-label">Supplier Business Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Apex Power Generators Ltd"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Contact Person</label>
              <input
                type="text"
                className="form-input"
                placeholder="Manager Name"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="+91 98490 00000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="accounts@supplier.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Linked Bank Account */}
          <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--accent-emerald)', marginTop: '8px' }}>
            2. Linked Bank Account & UPI Details
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Bank Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="HDFC / SBI / ICICI"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Account Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="50100XXXXXXXX"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Account Holder Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Full Name as in Bank"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">IFSC Code</label>
              <input
                type="text"
                className="form-input"
                placeholder="HDFC0001234"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Supplier UPI ID (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="supplier@upi / mobile@paytm"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          </div>

        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSaveSupplier}>
            <CheckCircle2 size={16} /> Save Supplier Profile
          </button>
        </div>

      </div>
    </div>
  );
}
