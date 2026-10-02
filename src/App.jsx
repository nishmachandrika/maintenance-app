import React, { useState, useEffect } from 'react';

// Data imports
import { 
  INITIAL_SITES, 
  INITIAL_USERS,
  INITIAL_SUPPLIERS, 
  INITIAL_GENERATORS, 
  INITIAL_TODAY_ACTIVITIES, 
  INITIAL_HISTORICAL_LOGS, 
  INITIAL_CHECKLISTS, 
  INITIAL_PAYMENT_REQUESTS 
} from './data/mockData';

// Layout & Core components
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import RechargeSubscriptionsView from './components/RechargeSubscriptionsView';
import UserManagementView from './components/UserManagementView';
import GeneratorMaintenanceModule from './components/GeneratorMaintenance/GeneratorMaintenanceModule';

// Modal components
import GeneratorDetailModal from './components/GeneratorMaintenance/GeneratorDetailModal';
import AddGeneratorModal from './components/GeneratorMaintenance/AddGeneratorModal';
import DailyUsageModal from './components/GeneratorMaintenance/DailyUsageModal';
import ChecklistModal from './components/GeneratorMaintenance/ChecklistModal';
import CloseGeneratorModal from './components/GeneratorMaintenance/CloseGeneratorModal';
import RequestReturnModal from './components/GeneratorMaintenance/RequestReturnModal';
import AddSupplierModal from './components/GeneratorMaintenance/AddSupplierModal';
import CreatePaymentModal from './components/GeneratorMaintenance/CreatePaymentModal';
import MachineProblemModal from './components/GeneratorMaintenance/MachineProblemModal';

export default function App() {
  // Login Session State
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentUser, setCurrentUser] = useState(INITIAL_USERS[0]); // Default Admin persona

  // Main Module Navigation (SINGLE SIDEBAR): 'dashboard' | 'generator-maintenance' | 'recharge-subscriptions' | 'user-management'
  const [activeModule, setActiveModule] = useState('generator-maintenance');

  // Generator Maintenance Module Horizontal Tabs: 'overview' | 'sites' | 'generators' | 'suppliers' | 'history' | 'payments' | 'reports'
  const [activeTab, setActiveTab] = useState('overview');

  // App Role & Filtering State
  const [userRole, setUserRole] = useState(INITIAL_USERS[0].role);
  const [selectedSiteFilter, setSelectedSiteFilter] = useState('ALL');

  // Master Data States
  const [users, setUsers] = useState(INITIAL_USERS);
  const [sites, setSites] = useState(INITIAL_SITES);
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [generators, setGenerators] = useState(INITIAL_GENERATORS);
  const [todayActivities, setTodayActivities] = useState(INITIAL_TODAY_ACTIVITIES);
  const [historicalLogs, setHistoricalLogs] = useState(INITIAL_HISTORICAL_LOGS);
  const [checklists, setChecklists] = useState(INITIAL_CHECKLISTS);
  const [paymentRequests, setPaymentRequests] = useState(INITIAL_PAYMENT_REQUESTS);

  // Theme state ('dark' / present vs 'light')
  const [theme, setTheme] = useState(() => localStorage.getItem('app_theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  // Modal triggers
  const [generatorForDetail, setGeneratorForDetail] = useState(null);
  const [showAddGeneratorModal, setShowAddGeneratorModal] = useState(false);
  const [generatorForDailyEntry, setGeneratorForDailyEntry] = useState(null);
  const [generatorForChecklist, setGeneratorForChecklist] = useState(null);
  const [generatorForClose, setGeneratorForClose] = useState(null);
  const [generatorForRequestReturn, setGeneratorForRequestReturn] = useState(null);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showCreatePaymentModal, setShowCreatePaymentModal] = useState(false);
  const [paymentInitialSupplier, setPaymentInitialSupplier] = useState(null);
  const [paymentInitialAmount, setPaymentInitialAmount] = useState('');
  const [generatorForMachineProblem, setGeneratorForMachineProblem] = useState(null);

  // Login Handler
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setUserRole(user.role);
    if (user.role === 'supervisor' && user.assignedSite) {
      setSelectedSiteFilter(user.assignedSite);
    } else {
      setSelectedSiteFilter('ALL');
    }
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Helper trigger handlers
  const handleOpenAddSupplier = () => {
    setShowAddSupplierModal(true);
  };

  const handleOpenAddGenerator = () => {
    setShowAddGeneratorModal(true);
  };

  const handleOpenGeneratorDetails = (gen) => {
    setGeneratorForDetail(gen);
  };

  const handleOpenDailyEntry = (gen) => {
    setGeneratorForDailyEntry(gen);
  };

  const handleOpenChecklist = (gen) => {
    setGeneratorForChecklist(gen);
  };

  const handleOpenCloseGenerator = (gen) => {
    setGeneratorForClose(gen);
  };

  const handleOpenRequestReturn = (gen) => {
    setGeneratorForRequestReturn(gen);
  };

  const handleOpenCreatePayment = (supplier = null, amount = '') => {
    setPaymentInitialSupplier(supplier);
    setPaymentInitialAmount(amount);
    setShowCreatePaymentModal(true);
  };

  const handleOpenMachineProblem = (gen) => {
    setGeneratorForMachineProblem(gen);
  };

  const handleSaveMachineProblem = (data, mode) => {
    let updatedGenerators = [...generators];
    const genIndex = updatedGenerators.findIndex(g => g.id === generatorForMachineProblem.id);
    if (genIndex === -1) return;

    let targetGen = { ...updatedGenerators[genIndex] };
    if (!targetGen.machineProblems) targetGen.machineProblems = [];

    if (mode === 'add') {
      targetGen.machineProblems = [...targetGen.machineProblems, data];
    } else if (mode === 'resolve') {
      targetGen.machineProblems = targetGen.machineProblems.map(p => 
        p.id === data.problemId ? { ...p, endDate: data.endDate } : p
      );
    }

    const calculateDays = (start, end) => {
      const sDate = new Date(start);
      const eDate = new Date(end);
      const utc1 = Date.UTC(sDate.getFullYear(), sDate.getMonth(), sDate.getDate());
      const utc2 = Date.UTC(eDate.getFullYear(), eDate.getMonth(), eDate.getDate());
      return Math.max(0, Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24)) + 1);
    };

    let totalNonWorking = 0;
    targetGen.machineProblems.forEach(p => {
      totalNonWorking += calculateDays(p.startDate, p.endDate || new Date().toISOString().split('T')[0]);
    });

    targetGen.nonWorkingDays = totalNonWorking;

    updatedGenerators[genIndex] = targetGen;
    setGenerators(updatedGenerators);
    setGeneratorForMachineProblem(null);
  };

  // If not logged in, render the login page
  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} users={users} />;
  }

  return (
    <div className="app-container">
      {/* SINGLE PRIMARY SIDEBAR (Only Major Modules) */}
      <Sidebar 
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        userRole={userRole}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* MAIN WRAPPER */}
      <div className="main-wrapper">
        <Header 
          activeModule={activeModule}
          activeTab={activeTab}
          userRole={userRole}
          setUserRole={setUserRole}
          selectedSiteFilter={selectedSiteFilter}
          setSelectedSiteFilter={setSelectedSiteFilter}
          sites={sites}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          theme={theme}
          setTheme={setTheme}
        />

        <main className="content-container">
          {activeModule === 'dashboard' && (
            <DashboardView
              generators={generators}
              paymentRequests={paymentRequests}
              setActiveModule={setActiveModule}
              setActiveTab={setActiveTab}
              currentUser={currentUser}
            />
          )}

          {activeModule === 'generator-maintenance' && (
            <GeneratorMaintenanceModule
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              userRole={userRole}
              currentUser={currentUser}
              selectedSiteFilter={selectedSiteFilter}
              sites={sites}
              setSites={setSites}
              suppliers={suppliers}
              setSuppliers={setSuppliers}
              generators={generators}
              setGenerators={setGenerators}
              todayActivities={todayActivities}
              setTodayActivities={setTodayActivities}
              historicalLogs={historicalLogs}
              setHistoricalLogs={setHistoricalLogs}
              checklists={checklists}
              setChecklists={setChecklists}
              paymentRequests={paymentRequests}
              setPaymentRequests={setPaymentRequests}
              onOpenAddGenerator={handleOpenAddGenerator}
              onOpenGeneratorDetails={handleOpenGeneratorDetails}
              onOpenDailyEntry={handleOpenDailyEntry}
              onOpenChecklist={handleOpenChecklist}
              onOpenCloseGenerator={handleOpenCloseGenerator}
              onOpenRequestReturn={handleOpenRequestReturn}
              onOpenAddSupplier={handleOpenAddSupplier}
              onOpenCreatePayment={handleOpenCreatePayment}
              onOpenMachineProblem={handleOpenMachineProblem}
            />
          )}

          {activeModule === 'recharge-subscriptions' && (
            <RechargeSubscriptionsView />
          )}

          {activeModule === 'user-management' && (
            <UserManagementView
              sites={sites}
              currentUser={currentUser}
              users={users}
              setUsers={setUsers}
            />
          )}
        </main>
      </div>

      {/* MODALS */}
      {generatorForDetail && (
        <GeneratorDetailModal
          generator={generatorForDetail}
          onClose={() => setGeneratorForDetail(null)}
          onOpenDailyEntry={handleOpenDailyEntry}
          onOpenChecklist={handleOpenChecklist}
          onOpenCloseGenerator={handleOpenCloseGenerator}
          todayActivities={todayActivities}
          historicalLogs={historicalLogs}
          generators={generators}
          setGenerators={setGenerators}
        />
      )}

      {showAddGeneratorModal && (
        <AddGeneratorModal
          onClose={() => setShowAddGeneratorModal(false)}
          suppliers={suppliers}
          sites={sites}
          generators={generators}
          setGenerators={setGenerators}
          onOpenAddSupplier={handleOpenAddSupplier}
          historicalLogs={historicalLogs}
          setHistoricalLogs={setHistoricalLogs}
        />
      )}

      {generatorForDailyEntry && (
        <DailyUsageModal
          generator={generatorForDailyEntry}
          onClose={() => setGeneratorForDailyEntry(null)}
          todayActivities={todayActivities}
          setTodayActivities={setTodayActivities}
          historicalLogs={historicalLogs}
          setHistoricalLogs={setHistoricalLogs}
        />
      )}

      {generatorForChecklist && (
        <ChecklistModal
          generator={generatorForChecklist}
          onClose={() => setGeneratorForChecklist(null)}
          checklists={checklists}
          setChecklists={setChecklists}
          currentUser={currentUser}
          historicalLogs={historicalLogs}
          setHistoricalLogs={setHistoricalLogs}
        />
      )}

      {generatorForClose && (
        <CloseGeneratorModal
          generator={generatorForClose}
          onClose={() => setGeneratorForClose(null)}
          generators={generators}
          setGenerators={setGenerators}
          historicalLogs={historicalLogs}
          setHistoricalLogs={setHistoricalLogs}
        />
      )}

      {generatorForRequestReturn && (
        <RequestReturnModal
          generator={generatorForRequestReturn}
          onClose={() => setGeneratorForRequestReturn(null)}
          generators={generators}
          setGenerators={setGenerators}
          historicalLogs={historicalLogs}
          setHistoricalLogs={setHistoricalLogs}
        />
      )}

      {showAddSupplierModal && (
        <AddSupplierModal
          onClose={() => setShowAddSupplierModal(false)}
          suppliers={suppliers}
          setSuppliers={setSuppliers}
          historicalLogs={historicalLogs}
          setHistoricalLogs={setHistoricalLogs}
        />
      )}

      {showCreatePaymentModal && (
        <CreatePaymentModal
          onClose={() => setShowCreatePaymentModal(false)}
          suppliers={suppliers}
          generators={generators}
          paymentRequests={paymentRequests}
          setPaymentRequests={setPaymentRequests}
          onOpenAddSupplier={handleOpenAddSupplier}
          initialSupplier={paymentInitialSupplier}
          initialAmount={paymentInitialAmount}
          historicalLogs={historicalLogs}
          setHistoricalLogs={setHistoricalLogs}
        />
      )}

      {generatorForMachineProblem && (
        <MachineProblemModal
          generator={generatorForMachineProblem}
          onClose={() => setGeneratorForMachineProblem(null)}
          onSave={handleSaveMachineProblem}
        />
      )}
    </div>
  );
}
