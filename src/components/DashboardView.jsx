import React from 'react';
import { 
  Zap, Play, Wrench, Clock, CreditCard, TrendingUp, CheckCircle2, 
  MapPin, Calendar, User, Plus, ClipboardCheck, ArrowRight, ShieldCheck, 
  Activity, Layers, Droplets, BarChart2, ShieldAlert
} from 'lucide-react';

export default function DashboardView({ 
  generators, 
  paymentRequests, 
  setActiveModule, 
  setActiveTab, 
  currentUser 
}) {
  const isSupervisor = currentUser.role === 'supervisor';
  const assignedSite = currentUser.assignedSite;

  // Filter generators strictly by assigned site for Supervisor
  const filteredGens = isSupervisor
    ? generators.filter(g => g.site === assignedSite)
    : generators;

  // KPI Calculations
  const totalGenerators = filteredGens.length;
  const runningToday = filteredGens.filter(g => g.status === 'ACTIVE').length;
  const underMaintenance = filteredGens.filter(g => g.status === 'UNDER MAINTENANCE').length;

  const sitePayments = isSupervisor
    ? paymentRequests.filter(p => p.site === assignedSite)
    : paymentRequests;

  const pendingPayments = sitePayments.filter(p => p.status === 'Pending' || p.status === 'Finance Review');
  const pendingCount = pendingPayments.length;
  const pendingAmount = pendingPayments.reduce((acc, curr) => acc + curr.totalAmount, 0);

  // Today's Date String
  const currentDateStr = new Date().toLocaleDateString('en-IN', { 
    weekday: 'short', 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });

  // Mock 7-day usage chart data for generator operational hours & diesel
  const chartDays = [
    { day: 'Mon', hours: 28, diesel: 240 },
    { day: 'Tue', hours: 32, diesel: 280 },
    { day: 'Wed', hours: 35, diesel: 310 },
    { day: 'Thu', hours: 30, diesel: 260 },
    { day: 'Fri', hours: 38, diesel: 340 },
    { day: 'Sat', hours: 42, diesel: 390 },
    { day: 'Sun', hours: 34, diesel: 295 },
  ];

  const maxHours = 50;

  // Recent maintenance activity log preview
  const recentActivities = [
    { id: 'act-1', genId: 'GEN-0001', name: 'Main Field Diesel Gen 125kVA', site: 'Akividu', hours: '8.5 hrs', diesel: '45 L', inspector: 'Supervisor A (Ramesh)', status: 'COMPLETED', time: '08:30 AM' },
    { id: 'act-2', genId: 'GEN-0002', name: 'Backup Silent Gen 62.5kVA', site: 'Akividu', hours: '7.75 hrs', diesel: '30 L', inspector: 'Supervisor A (Ramesh)', status: 'RUNNING', time: '09:15 AM' },
    { id: 'act-3', genId: 'GEN-0003', name: 'High Capacity Power Pack 250kVA', site: 'Akividu', hours: '8.25 hrs', diesel: '90 L', inspector: 'Supervisor B (Suresh)', status: 'COMPLETED', time: '07:30 AM' },
    { id: 'act-4', genId: 'GEN-0005', name: 'Bhimavaram Commercial Gen 160kVA', site: 'Bhimavaram', hours: '0 hrs', diesel: '0 L', inspector: 'Supervisor D (Venkat)', status: 'UNDER MAINTENANCE', time: '10:00 AM' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. TOP WELCOME MESSAGE, DATE & USER PROFILE BANNER */}
      <div className="table-card" style={{ 
        padding: '24px 28px',
        background: 'var(--bg-card-solid)',
        border: '1px solid var(--border-highlight)',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Background Accent */}
        <div style={{
          position: 'absolute',
          right: '0',
          top: '0',
          bottom: '0',
          width: '45%',
          backgroundImage: `linear-gradient(90deg, var(--bg-card-solid) 0%, rgba(99, 102, 241, 0.08) 100%)`,
          opacity: 0.8,
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', zIndex: 2 }}>
          <div className="user-avatar" style={{ 
            background: currentUser.badgeColor || 'var(--primary-light)', 
            width: '54px', 
            height: '54px', 
            fontSize: '1.2rem',
            fontWeight: '800',
            boxShadow: 'var(--shadow-md)'
          }}>
            {currentUser.avatar}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>
                Welcome back, {currentUser.name}!
              </h1>
              <span className={`badge ${isSupervisor ? 'badge-completed' : 'badge-active'}`} style={{ fontSize: '0.75rem' }}>
                <ShieldCheck size={12} style={{ marginRight: '4px' }} />
                {isSupervisor ? `${assignedSite} Site Supervisor` : 'Organization Admin'}
              </span>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {isSupervisor 
                ? `Operational summary & daily telemetry for ${assignedSite} Site aqua generators.`
                : 'Enterprise executive overview of heavy generator fleet, maintenance logs, and payout pipelines.'}
            </p>
          </div>
        </div>

        {/* Date & Quick Action Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', zIndex: 2 }}>
          <div style={{
            background: 'var(--bg-input)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--border-color)',
            padding: '8px 16px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.84rem',
            fontWeight: '700',
            color: 'var(--accent-cyan)'
          }}>
            <Calendar size={16} />
            <span>{currentDateStr}</span>
          </div>

          <button 
            className="btn btn-primary"
            onClick={() => {
              setActiveModule('generator-maintenance');
              setActiveTab('overview');
            }}
            style={{ fontWeight: '700' }}
          >
            <Zap size={16} /> Maintenance Portal <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* 3 & 4. PRIMARY KPI CARDS (Reduced Height & Width) */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
        
        {/* KPI 1: Total Generators */}
        <div className="kpi-card" style={{ padding: '8px 10px', borderRadius: '10px', gap: '2px', minHeight: 'auto' }}>
          <div className="kpi-header" style={{ marginBottom: '0px' }}>
            <span className="kpi-label" style={{ fontSize: '0.68rem', fontWeight: '700' }}>Total Generators</span>
            <div className="kpi-icon-box kpi-icon-cyan" style={{ width: '24px', height: '24px', borderRadius: '6px' }}><Zap size={12} /></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <span className="kpi-value" style={{ fontSize: '1.25rem', fontWeight: '800', lineHeight: 1 }}>{totalGenerators}</span>
            <span className="badge badge-active" style={{ fontSize: '0.58rem', padding: '1px 5px', borderRadius: '4px' }}>
              <TrendingUp size={9} style={{ marginRight: '2px' }} /> Deployed
            </span>
          </div>
          <div className="kpi-subtext" style={{ fontSize: '0.65rem', marginTop: '1px', color: 'var(--text-dim)', lineHeight: 1.2 }}>
            {isSupervisor ? `Registered at ${assignedSite}` : 'Across 3 Aqua Sites'}
          </div>
        </div>

        {/* KPI 2: Running Today */}
        <div className="kpi-card" style={{ padding: '8px 10px', borderRadius: '10px', gap: '2px', minHeight: 'auto' }}>
          <div className="kpi-header" style={{ marginBottom: '0px' }}>
            <span className="kpi-label" style={{ fontSize: '0.68rem', fontWeight: '700' }}>Running Today</span>
            <div className="kpi-icon-box kpi-icon-emerald" style={{ width: '24px', height: '24px', borderRadius: '6px' }}><Play size={12} /></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <span className="kpi-value" style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-emerald)', lineHeight: 1 }}>{runningToday}</span>
            <span className="badge badge-completed" style={{ fontSize: '0.58rem', padding: '1px 5px', borderRadius: '4px' }}>100% Operational</span>
          </div>
          <div className="kpi-subtext" style={{ fontSize: '0.65rem', marginTop: '1px', color: 'var(--text-dim)', lineHeight: 1.2 }}>Active pumping & aeration</div>
        </div>

        {/* KPI 3: Under Maintenance */}
        <div className="kpi-card" style={{ padding: '8px 10px', borderRadius: '10px', gap: '2px', minHeight: 'auto' }}>
          <div className="kpi-header" style={{ marginBottom: '0px' }}>
            <span className="kpi-label" style={{ fontSize: '0.68rem', fontWeight: '700' }}>Under Maintenance</span>
            <div className="kpi-icon-box kpi-icon-amber" style={{ width: '24px', height: '24px', borderRadius: '6px' }}><Wrench size={12} /></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <span className="kpi-value" style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-amber)', lineHeight: 1 }}>{underMaintenance}</span>
            <span className="badge badge-paid" style={{ fontSize: '0.58rem', padding: '1px 5px', borderRadius: '4px', color: 'var(--accent-amber)', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
              Scheduled Service
            </span>
          </div>
          <div className="kpi-subtext" style={{ fontSize: '0.65rem', marginTop: '1px', color: 'var(--text-dim)', lineHeight: 1.2 }}>Oil filter & belt service</div>
        </div>

        {/* KPI 4: Pending Payments */}
        <div className="kpi-card" style={{ padding: '8px 10px', borderRadius: '10px', gap: '2px', minHeight: 'auto' }}>
          <div className="kpi-header" style={{ marginBottom: '0px' }}>
            <span className="kpi-label" style={{ fontSize: '0.68rem', fontWeight: '700' }}>Pending Payments</span>
            <div className="kpi-icon-box kpi-icon-rose" style={{ width: '24px', height: '24px', borderRadius: '6px' }}><CreditCard size={12} /></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <span className="kpi-value" style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-rose)', lineHeight: 1 }}>{pendingCount}</span>
            <span style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--accent-rose)', lineHeight: 1 }}>
              ₹{pendingAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="kpi-subtext" style={{ fontSize: '0.65rem', marginTop: '1px', color: 'var(--text-dim)', lineHeight: 1.2 }}>Awaiting Finance clearance</div>
        </div>

      </div>

      {/* 5 & 6. MIDDLE SECTION: GENERATOR ACTIVITY USAGE CHART + QUICK ACTIONS PANEL */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 2fr) minmax(300px, 1fr)', gap: '24px' }}>
        
        {/* 5. Generator Usage & Fuel Consumption Chart */}
        <div className="table-card" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="kpi-icon-box kpi-icon-cyan" style={{ width: '38px', height: '38px', borderRadius: '10px' }}>
                <BarChart2 size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)' }}>Generator Usage & Fuel Consumption Chart</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Daily operational run hours vs diesel fuel added (Past 7 Days)</p>
              </div>
            </div>
            <span className="badge badge-active">7-DAY TELEMETRY</span>
          </div>

          {/* SVG Chart Visualization */}
          <div style={{ background: 'var(--bg-input)', padding: '20px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '180px', gap: '14px', paddingBottom: '10px' }}>
              {chartDays.map((item, idx) => {
                const barHeight = Math.round((item.hours / maxHours) * 140);
                return (
                  <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                    <div 
                      style={{ 
                        width: '100%', 
                        maxWidth: '36px', 
                        height: `${barHeight}px`, 
                        background: 'linear-gradient(180deg, var(--accent-cyan) 0%, var(--primary) 100%)', 
                        borderRadius: '8px 8px 0 0', 
                        boxShadow: 'var(--shadow-sm)', 
                        transition: 'all 0.3s ease' 
                      }} 
                      title={`${item.hours} Hours Run (${item.diesel}L Diesel)`} 
                    />

                    <div style={{ fontSize: '0.76rem', fontWeight: '700', color: 'var(--text-muted)' }}>{item.day}</div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', paddingTop: '14px', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--accent-cyan)', display: 'inline-block' }}></span>
                <span>Operational Hours</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                <Droplets size={14} style={{ color: 'var(--accent-cyan)' }} />
                <span>Diesel Consumption (Avg 310 L/day)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Quick Actions Panel */}
        <div className="table-card" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
            <Zap size={20} className="text-cyan" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>Quick Actions</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              className="btn btn-primary"
              style={{ padding: '12px 16px', justifyContent: 'space-between', fontWeight: '700' }}
              onClick={() => {
                setActiveModule('generator-maintenance');
                setActiveTab('overview');
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Play size={16} />
                <span>Daily Usage Entry</span>
              </div>
              <ArrowRight size={16} />
            </button>

            <button 
              className="btn btn-secondary"
              style={{ padding: '12px 16px', justifyContent: 'space-between', fontWeight: '700' }}
              onClick={() => {
                setActiveModule('generator-maintenance');
                setActiveTab('overview');
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ClipboardCheck size={16} style={{ color: 'var(--accent-cyan)' }} />
                <span>Daily Inspection Checklist</span>
              </div>
              <ArrowRight size={16} />
            </button>

            {currentUser.role === 'admin' && (
              <button 
                className="btn btn-secondary"
                style={{ padding: '12px 16px', justifyContent: 'space-between', fontWeight: '700' }}
                onClick={() => {
                  setActiveModule('generator-maintenance');
                  setActiveTab('generators');
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Plus size={16} style={{ color: 'var(--accent-emerald)' }} />
                  <span>Add New Generator</span>
                </div>
                <ArrowRight size={16} />
              </button>
            )}

            <button 
              className="btn btn-secondary"
              style={{ padding: '12px 16px', justifyContent: 'space-between', fontWeight: '700' }}
              onClick={() => {
                setActiveModule('generator-maintenance');
                setActiveTab('payments');
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CreditCard size={16} style={{ color: 'var(--accent-amber)' }} />
                <span>Request Supplier Payment</span>
              </div>
              <ArrowRight size={16} />
            </button>

            <button 
              className="btn btn-secondary"
              style={{ padding: '12px 16px', justifyContent: 'space-between', fontWeight: '700' }}
              onClick={() => {
                setActiveModule('generator-maintenance');
                setActiveTab('sites');
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={16} style={{ color: 'var(--accent-cyan)' }} />
                <span>Explore Aqua Sites Hierarchy</span>
              </div>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>

      {/* 7 & 8. BOTTOM SECTION: SITE-WISE GENERATOR STATUS + RECENT MAINTENANCE ACTIVITY */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) minmax(420px, 1.4fr)', gap: '24px' }}>
        
        {/* 8. Site-Wise Generator Status */}
        <div className="table-card" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={18} className="text-cyan" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>Site-Wise Generator Status</h3>
            </div>
            <span className="badge badge-completed">3 Aqua Hubs</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Akividu Site */}
            <div style={{ background: 'var(--bg-input)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '0.92rem' }}>Akividu Site (West Godavari)</div>
                <span className="badge badge-active" style={{ fontSize: '0.7rem' }}>3 Active / 4 Total</span>
              </div>
              <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '75%', height: '100%', background: 'linear-gradient(90deg, var(--accent-emerald) 0%, var(--accent-cyan) 100%)', borderRadius: '4px' }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>3 Sections | Supervisors: Ramesh, Suresh, Kalyan</div>
            </div>

            {/* Bhimavaram Site */}
            <div style={{ background: 'var(--bg-input)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '0.92rem' }}>Bhimavaram Site (West Godavari)</div>
                <span className="badge badge-paid" style={{ fontSize: '0.7rem', color: 'var(--accent-amber)', borderColor: 'rgba(245,158,11,0.3)' }}>2 Active / 1 Maintenance</span>
              </div>
              <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '66%', height: '100%', background: 'linear-gradient(90deg, var(--accent-amber) 0%, var(--accent-cyan) 100%)', borderRadius: '4px' }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>2 Sections | Supervisors: Venkat Rao, Prasad</div>
            </div>

            {/* Tanuku Site */}
            <div style={{ background: 'var(--bg-input)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '0.92rem' }}>Tanuku Site (West Godavari)</div>
                <span className="badge badge-active" style={{ fontSize: '0.7rem' }}>1 Active / 1 Total</span>
              </div>
              <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, var(--accent-emerald) 0%, var(--accent-cyan) 100%)', borderRadius: '4px' }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>1 Section | Supervisor: Anil Kumar</div>
            </div>
          </div>
        </div>

        {/* 7. Recent Maintenance Activity */}
        <div className="table-card" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity size={18} className="text-cyan" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>Recent Maintenance Activity Log</h3>
            </div>
            <button 
              className="btn btn-outline btn-sm"
              onClick={() => {
                setActiveModule('generator-maintenance');
                setActiveTab('history');
              }}
            >
              View Full History <ArrowRight size={14} />
            </button>
          </div>

          <div className="table-container">
            <table className="custom-table" style={{ fontSize: '0.84rem' }}>
              <thead>
                <tr>
                  <th>Gen ID</th>
                  <th>Generator Name & Site</th>
                  <th>Run Hours</th>
                  <th>Diesel Added</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map((act) => (
                  <tr key={act.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                      {act.genId}
                    </td>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{act.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{act.site} Site</div>
                    </td>
                    <td style={{ fontWeight: '700' }}>{act.hours}</td>
                    <td style={{ color: 'var(--accent-cyan)', fontWeight: '700' }}>{act.diesel}</td>
                    <td>
                      <span className={`badge ${act.status === 'COMPLETED' ? 'badge-active' : act.status === 'RUNNING' ? 'badge-completed' : 'badge-paid'}`} style={{ fontSize: '0.68rem' }}>
                        {act.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
