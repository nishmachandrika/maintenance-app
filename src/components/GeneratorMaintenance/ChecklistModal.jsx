import React, { useState } from 'react';
import { ClipboardCheck, Calendar, Zap, CheckCircle2, Save, FileText, User, Plus, Trash2, X } from 'lucide-react';

export default function ChecklistModal({
  generator,
  onClose,
  checklists,
  setChecklists,
  currentUser,
  historicalLogs,
  setHistoricalLogs
}) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Dynamic Checklist items state
  const [items, setItems] = useState([
    { id: 'item-1', label: 'Engine condition', checked: true },
    { id: 'item-2', label: 'Oil level', checked: true },
    { id: 'item-3', label: 'Coolant level', checked: true },
    { id: 'item-4', label: 'Battery condition', checked: true },
    { id: 'item-5', label: 'Diesel/Fuel level', checked: true },
    { id: 'item-6', label: 'Leakage check', checked: true },
    { id: 'item-7', label: 'Fan/Belt condition', checked: true },
    { id: 'item-8', label: 'Electrical connections', checked: true },
    { id: 'item-9', label: 'General machine condition', checked: true }
  ]);

  const [newItemText, setNewItemText] = useState('');
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [remarks, setRemarks] = useState('All routine inspection parameters checked and normal.');
  const [savedSuccessMsg, setSavedSuccessMsg] = useState('');

  if (!generator) return null;

  const handleToggleItem = (id) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    const newItem = {
      id: `item-${Date.now()}`,
      label: newItemText.trim(),
      checked: true
    };
    setItems([...items, newItem]);
    setNewItemText('');
    setShowAddItemForm(false);
  };

  const handleRemoveItem = (id, e) => {
    e.stopPropagation(); // prevent toggling checkbox when clicking remove
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSaveChecklist = () => {
    const itemsMap = {};
    items.forEach(item => {
      itemsMap[item.label] = item.checked;
    });

    const newChecklist = {
      id: `chk-${Date.now()}`,
      date: selectedDate,
      generatorId: generator.id,
      generatorName: generator.name,
      site: generator.site,
      section: generator.section,
      inspector: currentUser.name,
      items: itemsMap,
      remarks: remarks,
      timestamp: `${selectedDate} ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
    };

    setChecklists([newChecklist, ...checklists]);

    if (setHistoricalLogs && historicalLogs) {
      const newHistoryLog = {
        id: `hist-chk-${Date.now()}`,
        date: selectedDate,
        generatorId: generator.id,
        generatorName: generator.name,
        supplier: generator.supplierName,
        site: generator.site,
        section: generator.section,
        actionType: 'CHECKLIST_INSPECTION',
        actionName: 'Pre-Operational Checklist',
        inspector: currentUser.name,
        items: itemsMap,
        remarks: remarks,
        status: Object.values(itemsMap).every(Boolean) ? 'Pass' : 'Needs Attention'
      };
      setHistoricalLogs([newHistoryLog, ...historicalLogs]);
    }

    setSavedSuccessMsg(`Checklist for ${generator.id} saved permanently!`);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '720px' }}>
        
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ClipboardCheck size={20} className="text-cyan" />
              <h3 className="modal-title">Daily Generator Checklist ({generator.id})</h3>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {generator.name} | Site: {generator.site} - {generator.section}
            </div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          
          {/* Top Bar: Date & Add Item Control */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-input)', border: '1px solid var(--border-color)', padding: '12px 16px', borderRadius: '10px', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <Calendar size={16} className="text-muted" />
              <span style={{ fontWeight: '700' }}>Inspection Date:</span>
              <input
                type="date"
                className="form-input"
                style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Inspector: <strong style={{ color: 'var(--text-main)' }}>{currentUser.name}</strong>
              </span>

              {/* + ADD ITEM BUTTON */}
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => setShowAddItemForm(!showAddItemForm)}
              >
                <Plus size={14} /> Add Item
              </button>
            </div>
          </div>

          {/* Add Item Form Bar */}
          {showAddItemForm && (
            <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--border-highlight)', padding: '14px', borderRadius: '10px', display: 'flex', gap: '10px', alignItems: 'center', animation: 'fadeIn 0.2s ease' }}>
              <input
                type="text"
                className="form-input"
                style={{ flex: 1 }}
                placeholder="Enter new checklist item parameter (e.g. Radiator Cap Check)..."
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                autoFocus
              />
              <button className="btn btn-primary btn-sm" onClick={handleAddItem}>
                <Plus size={14} /> Add Item
              </button>
              <button className="btn btn-outline btn-sm" onClick={() => setShowAddItemForm(false)}>
                Cancel
              </button>
            </div>
          )}

          {savedSuccessMsg && (
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '10px 14px', borderRadius: '8px', color: 'var(--accent-emerald)', fontWeight: '700', fontSize: '0.88rem' }}>
              ✓ {savedSuccessMsg}
            </div>
          )}

          {/* Checklist Items Grid with Remove Button */}
          <div className="checklist-grid">
            {items.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-dim)', padding: '20px' }}>
                No checklist items remaining. Click "+ Add Item" to add an inspection item.
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="checklist-item-card"
                  onClick={() => handleToggleItem(item.id)}
                  style={{ justifyContent: 'space-between' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, overflow: 'hidden' }}>
                    <input
                      type="checkbox"
                      className="checklist-checkbox"
                      checked={item.checked}
                      onChange={() => {}}
                    />
                    <span style={{ 
                      fontSize: '0.85rem', 
                      fontWeight: '600', 
                      color: item.checked ? 'var(--text-main)' : 'var(--text-dim)',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden'
                    }}>
                      {item.label}
                    </span>
                  </div>

                  {/* REMOVE BUTTON */}
                  <button
                    className="btn btn-danger btn-sm"
                    style={{ padding: '2px 6px', height: '26px', fontSize: '0.7rem' }}
                    onClick={(e) => handleRemoveItem(item.id, e)}
                    title="Remove this item"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Inspection Remarks & Notes</label>
            <textarea
              className="form-textarea"
              rows="3"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter any minor observations, oil top-ups, belt adjustments..."
            />
          </div>

        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSaveChecklist}>
            <Save size={16} /> Save Checklist Permanently
          </button>
        </div>

      </div>
    </div>
  );
}
