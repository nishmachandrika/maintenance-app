import React, { useState } from 'react';
import { 
  Building2, CreditCard, Plus, Phone, Mail, Zap, CheckCircle2, Lock, 
  ArrowLeft, ArrowRight, ShieldCheck, Landmark 
} from 'lucide-react';

export default function SuppliersTab({
  suppliers,
  generators,
  paymentRequests,
  currentUser,
  onOpenAddSupplier,
  onOpenCreatePayment
}) {
  const [selectedSupplierObj, setSelectedSupplierObj] = useState(null);
  const [selectedBankId, setSelectedBankId] = useState('');

  // Mask account number for non-admin supervisor users (Section 8)
  const formatAccountNumber = (accNo, isSupervisor) => {
    if (!accNo) return '';
    if (isSupervisor) {
      const last4 = accNo.slice(-4);
      return `XXXX XXXX ${last4}`;
    }
    return accNo;
  };

  // LEVEL 2: DETAILED VIEW FOR A CLICKED SUPPLIER
  if (selectedSupplierObj) {
    const isSupervisor = currentUser.role === 'supervisor';
    const assignedSite = currentUser.assignedSite;

    // Filter generators under this supplier
    const supGenerators = generators.filter(g => {
      if (isSupervisor && g.site !== assignedSite) return false;
      return g.supplierId === selectedSupplierObj.id || g.supplierName === selectedSupplierObj.name;
    });

    // Generator-wise calculation
    const genBreakdown = supGenerators.map(gen => {
      const start = new Date(gen.startingDate);
      const end = gen.status === 'CLOSED / RETURNED' && gen.closedDate ? new Date(gen.closedDate) : new Date();
      const calDays = Math.ceil(Math.max(0, end - start) / (1000 * 60 * 60 * 24));
      const workDays = Math.max(0, calDays - (gen.nonWorkingDays || 0));
      const amount = workDays * gen.costPerDay;
      return { gen, amount, workDays };
    });

    const totalSupplierCost = genBreakdown.reduce((sum, item) => sum + item.amount, 0);

    // Active selected bank account
    const activeBankId = selectedBankId || selectedSupplierObj.bankAccounts[0]?.id;
    const activeBank = selectedSupplierObj.bankAccounts.find(b => b.id === activeBankId) || selectedSupplierObj.bankAccounts[0];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Back Button & Header Bar */}
        <div className="filter-bar">
          <button className="btn btn-secondary btn-sm" onClick={() => setSelectedSupplierObj(null)}>
            <ArrowLeft size={16} /> Back to All Suppliers
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building2 size={20} className="text-cyan" />
            <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>{selectedSupplierObj.name} Details</span>
            <span className="badge badge-active">{supGenerators.length} Generators Covered</span>
          </div>

          <button 
            className="btn btn-primary btn-sm" 
            onClick={() => onOpenCreatePayment(selectedSupplierObj)}
            style={{ marginLeft: 'auto' }}
          >
            <CreditCard size={14} /> Create Payment Request
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          
          {/* Left Column: Supplier Contact & Linked Bank Accounts Selector */}
          <div className="table-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>{selectedSupplierObj.name}</h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Contact Person: <strong style={{ color: 'var(--text-main)' }}>{selectedSupplierObj.contactPerson}</strong>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Phone: {selectedSupplierObj.phone} | Email: {selectedSupplierObj.email}
              </div>
            </div>

            {/* MULTIPLE LINKED BANK ACCOUNTS SELECT DROPDOWN */}
            <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--accent-cyan)' }}>
                  Linked Bank Accounts Dropdown
                </div>
                <span className="badge badge-completed">{selectedSupplierObj.bankAccounts.length} Accounts Available</span>
              </div>

              <div className="form-group">
                <label className="form-label">Select Active Bank Account</label>
                <select 
                  className="form-select"
                  value={activeBankId}
                  onChange={(e) => setSelectedBankId(e.target.value)}
                  style={{ fontWeight: '700' }}
                >
                  {selectedSupplierObj.bankAccounts.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.bankName} - A/C: {formatAccountNumber(b.accountNumber, isSupervisor)} (IFSC: {b.ifscCode})
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Bank Account Details Card */}
              {activeBank && (
                <div style={{ background: 'var(--bg-card-solid)', border: '1px solid var(--border-highlight)', padding: '14px', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--accent-cyan)' }}>
                      <Landmark size={16} style={{ display: 'inline', marginRight: '6px' }} />
                      {activeBank.bankName}
                    </div>
                    <span className="badge badge-active">Active Choice</span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div>Account Number: <strong>{formatAccountNumber(activeBank.accountNumber, isSupervisor)}</strong></div>
                    <div>Account Holder: <strong>{activeBank.accountHolder}</strong></div>
                    <div>IFSC Code: <strong>{activeBank.ifscCode}</strong> | Branch: {activeBank.branch}</div>
                  </div>
                </div>
              )}

              {selectedSupplierObj.upiIds && selectedSupplierObj.upiIds.length > 0 && (
                <div style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)', background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '8px' }}>
                  Linked UPI Handle: <strong>{selectedSupplierObj.upiIds.join(', ')}</strong>
                </div>
              )}
            </div>

            <button 
              className="btn btn-primary"
              style={{ width: '100%', padding: '11px', fontWeight: '700' }}
              onClick={() => onOpenCreatePayment(selectedSupplierObj)}
            >
              <CreditCard size={16} /> Pay via Selected Account ({activeBank?.bankName})
            </button>
          </div>

          {/* Right Column: Multi-Generator Payable Breakdown Table (Section 13) */}
          <div className="table-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>Generator-Wise Payable Breakdown</h3>
              <span className="badge badge-completed">Section 13 Multi-Gen Payout</span>
            </div>

            <div className="table-container">
              <table className="custom-table" style={{ fontSize: '0.84rem' }}>
                <thead>
                  <tr>
                    <th>Generator ID</th>
                    <th>Generator Name</th>
                    <th>Site</th>
                    <th>Rate / Day</th>
                    <th>Work Days</th>
                    <th>Payable Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {genBreakdown.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '20px' }}>
                        No active generators assigned to this supplier.
                      </td>
                    </tr>
                  ) : (
                    genBreakdown.map((item) => (
                      <tr key={item.gen.id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                          {item.gen.id}
                        </td>
                        <td style={{ fontWeight: '700' }}>{item.gen.name}</td>
                        <td>{item.gen.site}</td>
                        <td>₹{item.gen.costPerDay.toLocaleString()}</td>
                        <td>{item.workDays} Days</td>
                        <td style={{ fontWeight: '800', color: 'var(--accent-emerald)' }}>
                          ₹{item.amount.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 'auto', background: 'var(--bg-input)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)' }}>Total Cumulative Supplier Payable</span>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-emerald)' }}>₹{totalSupplierCost.toLocaleString('en-IN')}</span>
            </div>
          </div>

        </div>

      </div>
    );
  }

  // LEVEL 1: HIGH-LEVEL CLEAN SUPPLIERS OVERVIEW GRID
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Building2 size={18} className="text-muted" />
          <span style={{ fontWeight: '700' }}>Supplier & Bank-Account Management</span>
        </div>

        {currentUser.role === 'admin' ? (
          <button className="btn btn-primary" onClick={onOpenAddSupplier} style={{ marginLeft: 'auto' }}>
            <Plus size={16} /> Add New Supplier
          </button>
        ) : (
          <div style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lock size={14} className="text-amber" />
            <span>Master Supplier Management (Admin Only)</span>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {suppliers.map((sup) => {
          const supGenerators = generators.filter(g => {
            if (currentUser.role === 'supervisor' && g.site !== currentUser.assignedSite) return false;
            return g.supplierId === sup.id || g.supplierName === sup.name;
          });

          const totalSupplierCost = supGenerators.reduce((sum, gen) => {
            const start = new Date(gen.startingDate);
            const end = gen.status === 'CLOSED / RETURNED' && gen.closedDate ? new Date(gen.closedDate) : new Date();
            const calDays = Math.ceil(Math.max(0, end - start) / (1000 * 60 * 60 * 24));
            const workDays = Math.max(0, calDays - (gen.nonWorkingDays || 0));
            return sum + (workDays * gen.costPerDay);
          }, 0);

          return (
            <div 
              key={sup.id} 
              className="table-card" 
              style={{ 
                padding: '16px', 
                display: 'grid', 
                gridTemplateColumns: 'minmax(110px, 130px) 1fr', 
                gap: '16px', 
                cursor: 'pointer', 
                transition: 'var(--transition-normal)',
                alignItems: 'stretch'
              }}
              onClick={() => setSelectedSupplierObj(sup)}
            >
              {/* LEFT SIDE: SUPPLIER IMAGE THUMBNAIL */}
              <div style={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundImage: `linear-gradient(180deg, rgba(11, 15, 25, 0.1) 0%, rgba(11, 15, 25, 0.75) 100%), url(${sup.image || '/supplier-abc.png'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '10px',
                border: '1px solid var(--border-color)'
              }}>
                <span className="badge badge-active" style={{ fontSize: '0.68rem', padding: '3px 8px', alignSelf: 'flex-start' }}>
                  {supGenerators.length} Gens
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-main)', fontSize: '0.7rem', fontWeight: '700', background: 'var(--bg-card-solid)', padding: '4px 6px', borderRadius: '6px' }}>
                  <Building2 size={12} style={{ color: 'var(--accent-cyan)' }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Supplier Partner</span>
                </div>
              </div>

              {/* RIGHT SIDE: SUPPLIER CONTENT DETAILS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)' }}>{sup.name}</h3>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Contact: <strong>{sup.contactPerson}</strong> | {sup.phone}
                    </div>
                  </div>
                  <span className="badge badge-active" style={{ fontSize: '0.68rem' }}>{supGenerators.length} GENERATORS</span>
                </div>

                {/* Summary Stats Strip */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', background: 'var(--bg-input)', padding: '10px 12px', borderRadius: '10px' }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>LINKED BANK ACCOUNTS</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--accent-cyan)', marginTop: '2px' }}>
                      {sup.bankAccounts.length} Multiple Accounts
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>TOTAL CUMULATIVE PAYABLE</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--accent-emerald)', marginTop: '2px' }}>
                      ₹{totalSupplierCost.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Accounts Available: {sup.bankAccounts.map(b => b.bankName).join(', ')}
                </div>

                {/* Action Button */}
                <button 
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '9px', fontSize: '0.84rem', fontWeight: '700' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSupplierObj(sup);
                  }}
                >
                  View Supplier Details & Bank Accounts <ArrowRight size={14} />
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
