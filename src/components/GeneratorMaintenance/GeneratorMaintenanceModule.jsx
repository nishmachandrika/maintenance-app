import React from 'react';
import { 
  LayoutDashboard, MapPin, Zap, Building2, 
  History, CreditCard, BarChart3, Plus, Lock 
} from 'lucide-react';

import OverviewTab from './OverviewTab';
import SitesTab from './SitesTab';
import GeneratorsTab from './GeneratorsTab';
import SuppliersTab from './SuppliersTab';
import HistoryTab from './HistoryTab';
import PaymentsTab from './PaymentsTab';
import ReportsTab from './ReportsTab';

export default function GeneratorMaintenanceModule({
  activeTab,
  setActiveTab,
  userRole,
  currentUser,
  selectedSiteFilter,
  sites,
  setSites,
  suppliers,
  setSuppliers,
  generators,
  setGenerators,
  todayActivities,
  setTodayActivities,
  historicalLogs,
  setHistoricalLogs,
  checklists,
  setChecklists,
  paymentRequests,
  setPaymentRequests,
  onOpenAddGenerator,
  onOpenGeneratorDetails,
  onOpenDailyEntry,
  onOpenChecklist,
  onOpenCloseGenerator,
  onOpenRequestReturn,
  onOpenAddSupplier,
  onOpenCreatePayment,
  onOpenMachineProblem
}) {

  // Top-Level Horizontal Tabs (Checklist removed from top module tabs as requested)
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'sites', label: 'Sites', icon: MapPin },
    { id: 'generators', label: 'Generators', icon: Zap },
    { id: 'suppliers', label: 'Suppliers', icon: Building2 },
    { id: 'history', label: 'History', icon: History },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Module Title Header */}
      <div className="module-header">
        <div className="module-title-row">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 className="module-title">Generator Maintenance</h1>
              {currentUser.role === 'supervisor' && (
                <span className="badge badge-completed" style={{ fontSize: '0.78rem' }}>
                  <Lock size={12} style={{ marginRight: '4px' }} /> Isolated: {currentUser.assignedSite} Site
                </span>
              )}
            </div>
            <p className="module-desc">
              {currentUser.role === 'supervisor'
                ? `Operational activities, daily entry and payments for ${currentUser.assignedSite} Site`
                : 'Manage generators, suppliers, daily operations and payments across all organization sites'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {currentUser.role === 'admin' ? (
              <>
                <button className="btn btn-secondary btn-sm" onClick={onOpenAddSupplier}>
                  + Supplier
                </button>
                <button className="btn btn-primary btn-sm" onClick={onOpenAddGenerator}>
                  <Plus size={16} /> Add Generator
                </button>
              </>
            ) : (
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Operational Mode Active
              </span>
            )}
          </div>
        </div>

        {/* TOP-LEVEL HORIZONTAL TABS INSIDE GENERATOR MAINTENANCE */}
        <nav className="horizontal-tabs-nav">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Render Selected Tab View */}
      <div className="tab-content-wrapper">
        {activeTab === 'overview' && (
          <OverviewTab
            generators={generators}
            suppliers={suppliers}
            paymentRequests={paymentRequests}
            todayActivities={todayActivities}
            currentUser={currentUser}
            selectedSiteFilter={selectedSiteFilter}
            onOpenGeneratorDetails={onOpenGeneratorDetails}
            onOpenDailyEntry={onOpenDailyEntry}
            onOpenChecklist={onOpenChecklist}
          />
        )}

        {activeTab === 'sites' && (
          <SitesTab
            sites={sites}
            setSites={setSites}
            generators={generators}
            userRole={userRole}
            currentUser={currentUser}
            selectedSiteFilter={selectedSiteFilter}
            onOpenGeneratorDetails={onOpenGeneratorDetails}
            onOpenDailyEntry={onOpenDailyEntry}
            onOpenChecklist={onOpenChecklist}
            onOpenCloseGenerator={onOpenCloseGenerator}
            onOpenRequestReturn={onOpenRequestReturn}
            onOpenAddGenerator={onOpenAddGenerator}
          />
        )}

        {activeTab === 'generators' && (
          <GeneratorsTab
            generators={generators}
            suppliers={suppliers}
            sites={sites}
            userRole={userRole}
            currentUser={currentUser}
            selectedSiteFilter={selectedSiteFilter}
            onOpenAddGenerator={onOpenAddGenerator}
            onOpenGeneratorDetails={onOpenGeneratorDetails}
            onOpenDailyEntry={onOpenDailyEntry}
            onOpenChecklist={onOpenChecklist}
            onOpenCloseGenerator={onOpenCloseGenerator}
            onOpenRequestReturn={onOpenRequestReturn}
            onOpenMachineProblem={onOpenMachineProblem}
          />
        )}

        {activeTab === 'suppliers' && (
          <SuppliersTab
            suppliers={suppliers}
            setSuppliers={setSuppliers}
            generators={generators}
            setGenerators={setGenerators}
            paymentRequests={paymentRequests}
            currentUser={currentUser}
            onOpenAddSupplier={onOpenAddSupplier}
            onOpenCreatePayment={onOpenCreatePayment}
          />
        )}

        {activeTab === 'history' && (
          <HistoryTab
            historicalLogs={historicalLogs}
            generators={generators}
            suppliers={suppliers}
            sites={sites}
            currentUser={currentUser}
            selectedSiteFilter={selectedSiteFilter}
          />
        )}

        {activeTab === 'payments' && (
          <PaymentsTab
            paymentRequests={paymentRequests}
            setPaymentRequests={setPaymentRequests}
            suppliers={suppliers}
            generators={generators}
            currentUser={currentUser}
            onOpenCreatePayment={onOpenCreatePayment}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsTab
            generators={generators}
            suppliers={suppliers}
            historicalLogs={historicalLogs}
            paymentRequests={paymentRequests}
            checklists={checklists}
            sites={sites}
            currentUser={currentUser}
            selectedSiteFilter={selectedSiteFilter}
          />
        )}
      </div>
    </div>
  );
}
