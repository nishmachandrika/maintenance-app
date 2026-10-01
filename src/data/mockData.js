export const INITIAL_SITES = [
  {
    id: 'site-1',
    name: 'Akividu',
    location: 'West Godavari, AP',
    image: '/site-akividu.png',
    sections: [
      {
        id: 'sec-1-a',
        name: 'Section A',
        supervisor: 'Supervisor A (Ramesh Verma)',
        generators: ['GEN-0001', 'GEN-0002']
      },
      {
        id: 'sec-1-b',
        name: 'Section B',
        supervisor: 'Supervisor B (Suresh Kumar)',
        generators: ['GEN-0003']
      },
      {
        id: 'sec-1-c',
        name: 'Section C',
        supervisor: 'Supervisor C (Kalyan Ram)',
        generators: ['GEN-0004']
      }
    ]
  },
  {
    id: 'site-2',
    name: 'Bhimavaram',
    location: 'West Godavari, AP',
    image: '/site-bhimavaram.png',
    sections: [
      {
        id: 'sec-2-a',
        name: 'Section A',
        supervisor: 'Supervisor D (Venkat Rao)',
        generators: ['GEN-0005', 'GEN-0006']
      },
      {
        id: 'sec-2-b',
        name: 'Section B',
        supervisor: 'Supervisor E (Prasad N)',
        generators: ['GEN-0007']
      }
    ]
  },
  {
    id: 'site-3',
    name: 'Tanuku',
    location: 'West Godavari, AP',
    image: '/site-tanuku.png',
    sections: [
      {
        id: 'sec-3-a',
        name: 'Section Primary',
        supervisor: 'Supervisor F (Anil Kumar)',
        generators: ['GEN-0008']
      }
    ]
  }
];

export const INITIAL_USERS = [
  {
    id: 'usr-admin',
    name: 'System Admin',
    role: 'admin',
    title: 'Organization Administrator',
    email: 'admin@gmail.com',
    password: 'Admin@2026',
    assignedSite: null, // Organization wide
    avatar: 'AD',
    badgeColor: 'var(--primary-light)'
  },
  {
    id: 'usr-sup-akividu',
    name: 'Supervisor Ramesh Verma',
    role: 'supervisor',
    title: 'Akividu Site Supervisor',
    email: 'ramesh.verma@company.com',
    password: 'AkividuSuper#1',
    assignedSite: 'Akividu',
    assignedSection: 'Section A',
    avatar: 'SV',
    badgeColor: 'var(--accent-cyan)'
  },
  {
    id: 'usr-sup-bhimavaram',
    name: 'Supervisor Venkat Rao',
    role: 'supervisor',
    title: 'Bhimavaram Site Supervisor',
    email: 'venkat.rao@company.com',
    password: 'BhimavaramSuper#2',
    assignedSite: 'Bhimavaram',
    assignedSection: 'Section A',
    avatar: 'SV',
    badgeColor: 'var(--accent-amber)'
  },
  {
    id: 'usr-sup-tanuku',
    name: 'Supervisor Anil Kumar',
    role: 'supervisor',
    title: 'Tanuku Site Supervisor',
    email: 'anil.kumar@company.com',
    password: 'TanukuSuper#3',
    assignedSite: 'Tanuku',
    assignedSection: 'Section Primary',
    avatar: 'SV',
    badgeColor: 'var(--accent-purple)'
  },
  {
    id: 'usr-finance',
    name: 'Finance Controller',
    role: 'finance',
    title: 'Corporate Accounts & Finance',
    email: 'finance@company.com',
    password: 'FinanceSecure#99',
    assignedSite: null,
    avatar: 'FN',
    badgeColor: 'var(--accent-emerald)'
  }
];

export const INITIAL_SUPPLIERS = [
  {
    id: 'sup-1',
    name: 'ABC Generators Pvt Ltd',
    contactPerson: 'Rajesh Sharma',
    phone: '+91 98490 12345',
    email: 'contact@abcgenerators.com',
    image: '/supplier-abc.png',
    bankAccounts: [
      {
        id: 'bank-1',
        bankName: 'HDFC Bank',
        accountNumber: '50100239481234',
        accountHolder: 'ABC Generators Pvt Ltd',
        ifscCode: 'HDFC0001234',
        branch: 'Bhimavaram Main'
      },
      {
        id: 'bank-2',
        bankName: 'State Bank of India',
        accountNumber: '381920491823',
        accountHolder: 'ABC Generators Pvt Ltd',
        ifscCode: 'SBIN0004567',
        branch: 'Akividu Branch'
      }
    ],
    upiIds: ['abcgenerators@hdfcbank', '9849012345@paytm']
  },
  {
    id: 'sup-2',
    name: 'XYZ Power Tech Solutions',
    contactPerson: 'Mahesh Reddy',
    phone: '+91 94401 88990',
    email: 'info@xyzpower.in',
    image: '/supplier-xyz.png',
    bankAccounts: [
      {
        id: 'bank-3',
        bankName: 'ICICI Bank',
        accountNumber: '001205019876',
        accountHolder: 'XYZ Power Tech Solutions',
        ifscCode: 'ICIC0000012',
        branch: 'Eluru Road'
      }
    ],
    upiIds: ['xyzpower@icici']
  },
  {
    id: 'sup-3',
    name: 'Southern Energy Corp',
    contactPerson: 'Gopala Krishna',
    phone: '+91 98855 44321',
    email: 'accounts@southernenergy.co.in',
    image: '/supplier-southern.png',
    bankAccounts: [
      {
        id: 'bank-4',
        bankName: 'Axis Bank',
        accountNumber: '918020045678901',
        accountHolder: 'Southern Energy Corp',
        ifscCode: 'UTIB0000987',
        branch: 'Vijayawada Central'
      }
    ],
    upiIds: ['southernenergy@axisbank']
  }
];

export const INITIAL_GENERATORS = [
  {
    id: 'GEN-0001',
    name: 'Main Field Diesel Gen 125kVA',
    model: 'Cummins C125D5',
    type: 'Diesel Heavy Duty',
    supplierId: 'sup-1',
    supplierName: 'ABC Generators Pvt Ltd',
    site: 'Akividu',
    section: 'Section A',
    supervisor: 'Supervisor A (Ramesh Verma)',
    startingDate: '2026-09-01',
    costPerDay: 2500,
    fanSets: 4,
    status: 'ACTIVE',
    nonWorkingDays: 5,
    closedDate: null,
    closedRemarks: '',
    closingPhoto: null
  },
  {
    id: 'GEN-0002',
    name: 'Backup Silent Gen 62.5kVA',
    model: 'Kirloskar KG1-65WS',
    type: 'Silent Diesel',
    supplierId: 'sup-1',
    supplierName: 'ABC Generators Pvt Ltd',
    site: 'Akividu',
    section: 'Section A',
    supervisor: 'Supervisor A (Ramesh Verma)',
    startingDate: '2026-09-05',
    costPerDay: 1800,
    fanSets: 3,
    status: 'ACTIVE',
    nonWorkingDays: 2,
    closedDate: null,
    closedRemarks: '',
    closingPhoto: null
  },
  {
    id: 'GEN-0003',
    name: 'High Capacity Power Pack 250kVA',
    model: 'Mahindra Powerol 250',
    type: 'Heavy Duty Dual Engine',
    supplierId: 'sup-2',
    supplierName: 'XYZ Power Tech Solutions',
    site: 'Akividu',
    section: 'Section B',
    supervisor: 'Supervisor B (Suresh Kumar)',
    startingDate: '2026-09-10',
    costPerDay: 4000,
    fanSets: 6,
    status: 'ACTIVE',
    nonWorkingDays: 3,
    closedDate: null,
    closedRemarks: '',
    closingPhoto: null
  },
  {
    id: 'GEN-0004',
    name: 'Portable Canopy Generator 30kVA',
    model: 'Ashok Leyland AL30',
    type: 'Portable Silent',
    supplierId: 'sup-1',
    supplierName: 'ABC Generators Pvt Ltd',
    site: 'Akividu',
    section: 'Section C',
    supervisor: 'Supervisor C (Kalyan Ram)',
    startingDate: '2026-08-15',
    costPerDay: 1200,
    fanSets: 2,
    status: 'CLOSED / RETURNED',
    nonWorkingDays: 4,
    closedDate: '2026-09-25',
    closedRemarks: 'Project phase 1 completed. Unit returned to supplier premises after full inspection.',
    closingPhoto: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'GEN-0005',
    name: 'Bhimavaram Commercial Gen 160kVA',
    model: 'Perkins 1106A',
    type: 'Diesel Heavy Duty',
    supplierId: 'sup-3',
    supplierName: 'Southern Energy Corp',
    site: 'Bhimavaram',
    section: 'Section A',
    supervisor: 'Supervisor D (Venkat Rao)',
    startingDate: '2026-09-02',
    costPerDay: 3200,
    fanSets: 5,
    status: 'ACTIVE',
    nonWorkingDays: 1,
    closedDate: null,
    closedRemarks: '',
    closingPhoto: null
  },
  {
    id: 'GEN-0006',
    name: 'Secondary Auxiliary Gen 45kVA',
    model: 'Eicher EG45',
    type: 'Diesel Standard',
    supplierId: 'sup-2',
    supplierName: 'XYZ Power Tech Solutions',
    site: 'Bhimavaram',
    section: 'Section A',
    supervisor: 'Supervisor D (Venkat Rao)',
    startingDate: '2026-09-12',
    costPerDay: 1500,
    fanSets: 2,
    status: 'ACTIVE',
    nonWorkingDays: 0,
    closedDate: null,
    closedRemarks: '',
    closingPhoto: null
  },
  {
    id: 'GEN-0007',
    name: 'Bhimavaram South Genset 100kVA',
    model: 'TATA Green Power 100',
    type: 'Silent Diesel',
    supplierId: 'sup-3',
    supplierName: 'Southern Energy Corp',
    site: 'Bhimavaram',
    section: 'Section B',
    supervisor: 'Supervisor E (Prasad N)',
    startingDate: '2026-09-15',
    costPerDay: 2200,
    fanSets: 4,
    status: 'ACTIVE',
    nonWorkingDays: 2,
    closedDate: null,
    closedRemarks: '',
    closingPhoto: null
  },
  {
    id: 'GEN-0008',
    name: 'Tanuku Primary Genset 200kVA',
    model: 'Cummins QSB7',
    type: 'Diesel Heavy Duty',
    supplierId: 'sup-1',
    supplierName: 'ABC Generators Pvt Ltd',
    site: 'Tanuku',
    section: 'Section Primary',
    supervisor: 'Supervisor F (Anil Kumar)',
    startingDate: '2026-09-18',
    costPerDay: 3500,
    fanSets: 5,
    status: 'ACTIVE',
    nonWorkingDays: 1,
    closedDate: null,
    closedRemarks: '',
    closingPhoto: null
  }
];

export const INITIAL_TODAY_ACTIVITIES = [
  {
    id: 'act-101',
    generatorId: 'GEN-0001',
    generatorName: 'Main Field Diesel Gen 125kVA',
    site: 'Akividu',
    section: 'Section A',
    supplier: 'ABC Generators Pvt Ltd',
    startTime: '08:00 AM',
    stopTime: '04:30 PM',
    status: 'RUNNING',
    workingHours: '8.5 hrs',
    tank: 'Tank A1',
    fanSetsUsed: 4,
    dieselAddedLiters: 45,
    startPhoto: null,
    stopPhoto: null,
    remarks: 'Smooth operation under standard load.'
  },
  {
    id: 'act-102',
    generatorId: 'GEN-0002',
    generatorName: 'Backup Silent Gen 62.5kVA',
    site: 'Akividu',
    section: 'Section A',
    supplier: 'ABC Generators Pvt Ltd',
    startTime: '09:15 AM',
    stopTime: '05:00 PM',
    status: 'RUNNING',
    workingHours: '7.75 hrs',
    tank: 'Tank A2',
    fanSetsUsed: 3,
    dieselAddedLiters: 30,
    startPhoto: null,
    stopPhoto: null,
    remarks: 'Routine backup support.'
  },
  {
    id: 'act-103',
    generatorId: 'GEN-0003',
    generatorName: 'High Capacity Power Pack 250kVA',
    site: 'Akividu',
    section: 'Section B',
    supplier: 'XYZ Power Tech Solutions',
    startTime: '07:30 AM',
    stopTime: '03:45 PM',
    status: 'COMPLETED',
    workingHours: '8.25 hrs',
    tank: 'Tank B1',
    fanSetsUsed: 6,
    dieselAddedLiters: 90,
    startPhoto: null,
    stopPhoto: null,
    remarks: 'Pumping duty completed early.'
  },
  {
    id: 'act-104',
    generatorId: 'GEN-0005',
    generatorName: 'Bhimavaram Commercial Gen 160kVA',
    site: 'Bhimavaram',
    section: 'Section A',
    supplier: 'Southern Energy Corp',
    startTime: '--',
    stopTime: '--',
    status: 'UNDER MAINTENANCE',
    workingHours: '0 hrs',
    tank: 'Main Tank',
    fanSetsUsed: 0,
    dieselAddedLiters: 0,
    startPhoto: null,
    stopPhoto: null,
    remarks: 'Scheduled monthly oil filter & belt replacement.'
  },
  {
    id: 'act-105',
    generatorId: 'GEN-0007',
    generatorName: 'Bhimavaram South Genset 100kVA',
    site: 'Bhimavaram',
    section: 'Section B',
    supplier: 'Southern Energy Corp',
    startTime: '08:00 AM',
    stopTime: '05:30 PM',
    status: 'RUNNING',
    workingHours: '9.5 hrs',
    tank: 'Tank B2',
    fanSetsUsed: 4,
    dieselAddedLiters: 55,
    startPhoto: null,
    stopPhoto: null,
    remarks: 'High load evening run.'
  }
];

export const INITIAL_HISTORICAL_LOGS = [
  {
    id: 'hist-1',
    date: '2026-10-01',
    generatorId: 'GEN-0001',
    generatorName: 'Main Field Diesel Gen 125kVA',
    supplier: 'ABC Generators Pvt Ltd',
    site: 'Akividu',
    section: 'Section A',
    actionType: 'DAILY_USAGE',
    actionName: 'Daily Usage Entry',
    startTime: '08:00 AM',
    stopTime: '04:30 PM',
    hours: 8.5,
    tank: 'Tank A1',
    fanSets: 4,
    dieselLiters: 45,
    startPhoto: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80',
    stopPhoto: null,
    remarks: 'Smooth operation under standard load. Checked oil pressure.',
    status: 'Completed',
    inspector: 'Supervisor A'
  },
  {
    id: 'hist-chk-1',
    date: '2026-10-01',
    generatorId: 'GEN-0001',
    generatorName: 'Main Field Diesel Gen 125kVA',
    supplier: 'ABC Generators Pvt Ltd',
    site: 'Akividu',
    section: 'Section A',
    actionType: 'CHECKLIST_INSPECTION',
    actionName: 'Pre-Operational Checklist',
    inspector: 'Supervisor A (Ramesh Verma)',
    items: {
      engineCondition: true,
      oilLevel: true,
      coolantLevel: true,
      batteryCondition: true,
      dieselLevel: true,
      leakageCheck: true,
      fanBeltCondition: true,
      electricalConnections: true,
      generalMachineCondition: true,
      other: true
    },
    remarks: 'All parameters normal. Cleaned air filter.',
    status: 'Pass'
  },
  {
    id: 'hist-pay-1',
    date: '2026-09-30',
    generatorId: 'GEN-0001',
    generatorName: 'Main Field Diesel Gen 125kVA',
    supplier: 'ABC Generators Pvt Ltd',
    site: 'Akividu',
    section: 'Section A',
    actionType: 'PAYMENT_RECORDED',
    actionName: 'Payment Entry Created',
    amount: 62500,
    daysCount: 25,
    period: '2026-09-01 to 2026-09-25',
    paymentMode: 'Bank Transfer (HDFC)',
    txnRef: 'TXN-8849201',
    invoiceDoc: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=300&q=80',
    remarks: 'Approved monthly rental payout.',
    status: 'PAID',
    inspector: 'Finance Admin'
  },
  {
    id: 'hist-2',
    date: '2026-09-30',
    generatorId: 'GEN-0001',
    generatorName: 'Main Field Diesel Gen 125kVA',
    supplier: 'ABC Generators Pvt Ltd',
    site: 'Akividu',
    section: 'Section A',
    actionType: 'DAILY_USAGE',
    actionName: 'Daily Usage Entry',
    startTime: '08:30 AM',
    stopTime: '05:00 PM',
    hours: 8.5,
    tank: 'Tank A1',
    fanSets: 4,
    dieselLiters: 40,
    remarks: 'Standard daily operation.',
    status: 'Completed',
    inspector: 'Supervisor A'
  },
  {
    id: 'hist-close-1',
    date: '2026-09-29',
    generatorId: 'GEN-0004',
    generatorName: 'Decommissioned Unit 50kVA',
    supplier: 'Southern Energy Corp',
    site: 'Akividu',
    section: 'Section B',
    actionType: 'GENERATOR_CLOSED',
    actionName: 'Generator Closure & Physical Return',
    closingDate: '2026-09-29',
    finalWorkingDate: '2026-09-28',
    closingPhoto: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
    remarks: 'Generator returned to supplier after site section work completion.',
    status: 'CLOSED / RETURNED',
    inspector: 'Supervisor B'
  },
  {
    id: 'hist-3',
    date: '2026-09-29',
    generatorId: 'GEN-0001',
    generatorName: 'Main Field Diesel Gen 125kVA',
    supplier: 'ABC Generators Pvt Ltd',
    site: 'Akividu',
    section: 'Section A',
    actionType: 'DAILY_USAGE',
    actionName: 'Daily Usage Entry',
    startTime: '07:45 AM',
    stopTime: '03:30 PM',
    hours: 7.75,
    tank: 'Tank A1',
    fanSets: 4,
    dieselLiters: 38,
    remarks: 'Shift completed cleanly.',
    status: 'Completed',
    inspector: 'Supervisor A'
  },
  {
    id: 'hist-gen-1',
    date: '2026-09-15',
    generatorId: 'GEN-0005',
    generatorName: 'Bhimavaram Commercial Gen 160kVA',
    supplier: 'Southern Energy Corp',
    site: 'Bhimavaram',
    section: 'Section A',
    actionType: 'GENERATOR_CREATED',
    actionName: 'Generator Registered',
    costPerDay: 2800,
    fanSets: 5,
    model: 'CAT C7.1 Heavy Duty',
    type: 'Diesel Commercial',
    remarks: 'New commercial generator unit onboarded for Bhimavaram site.',
    status: 'ACTIVE',
    inspector: 'Admin User'
  }
];

export const INITIAL_CHECKLISTS = [
  {
    id: 'chk-201',
    date: '2026-10-01',
    generatorId: 'GEN-0001',
    generatorName: 'Main Field Diesel Gen 125kVA',
    site: 'Akividu',
    section: 'Section A',
    inspector: 'Supervisor A (Ramesh Verma)',
    items: {
      engineCondition: true,
      oilLevel: true,
      coolantLevel: true,
      batteryCondition: true,
      dieselLevel: true,
      leakageCheck: true,
      fanBeltCondition: true,
      electricalConnections: true,
      generalMachineCondition: true,
      other: true
    },
    remarks: 'All parameters normal. Cleaned air filter.',
    timestamp: '2026-10-01 07:45 AM'
  },
  {
    id: 'chk-202',
    date: '2026-10-01',
    generatorId: 'GEN-0003',
    generatorName: 'High Capacity Power Pack 250kVA',
    site: 'Akividu',
    section: 'Section B',
    inspector: 'Supervisor B (Suresh Kumar)',
    items: {
      engineCondition: true,
      oilLevel: true,
      coolantLevel: true,
      batteryCondition: true,
      dieselLevel: true,
      leakageCheck: true,
      fanBeltCondition: false,
      electricalConnections: true,
      generalMachineCondition: true,
      other: false
    },
    remarks: 'Fan belt loose - adjusted tension before starting.',
    timestamp: '2026-10-01 07:15 AM'
  }
];

export const INITIAL_PAYMENT_REQUESTS = [
  {
    id: 'PAY-001',
    supplierId: 'sup-1',
    supplierName: 'ABC Generators Pvt Ltd',
    site: 'Akividu',
    generators: [
      { id: 'GEN-0001', name: 'Main Field Diesel Gen 125kVA', amount: 62500, days: 25, rate: 2500 },
      { id: 'GEN-0002', name: 'Backup Silent Gen 62.5kVA', amount: 45000, days: 25, rate: 1800 }
    ],
    totalAmount: 107500,
    paymentType: 'Bank Transfer',
    bankAccount: 'HDFC Bank - 50100239481234 (IFSC: HDFC0001234)',
    upiId: '',
    status: 'Pending',
    requestDate: '2026-10-01',
    requestedBy: 'Supervisor A',
    remarks: 'September usage payment for 2 generators at Akividu'
  },
  {
    id: 'PAY-002',
    supplierId: 'sup-2',
    supplierName: 'XYZ Power Tech Solutions',
    site: 'Akividu',
    generators: [
      { id: 'GEN-0003', name: 'High Capacity Power Pack 250kVA', amount: 84000, days: 21, rate: 4000 }
    ],
    totalAmount: 84000,
    paymentType: 'UPI Transfer',
    bankAccount: '',
    upiId: 'xyzpower@icici',
    status: 'Approved',
    requestDate: '2026-09-28',
    requestedBy: 'Supervisor B',
    remarks: 'Advance partial payment'
  },
  {
    id: 'PAY-003',
    supplierId: 'sup-3',
    supplierName: 'Southern Energy Corp',
    site: 'Bhimavaram',
    generators: [
      { id: 'GEN-0005', name: 'Bhimavaram Commercial Gen 160kVA', amount: 89600, days: 28, rate: 3200 }
    ],
    totalAmount: 89600,
    paymentType: 'Bank Transfer',
    bankAccount: 'Axis Bank - 918020045678901 (IFSC: UTIB0000987)',
    upiId: '',
    status: 'Payment Processed',
    requestDate: '2026-09-20',
    requestedBy: 'Supervisor D',
    remarks: 'Fully cleared payment transaction TXN994812'
  }
];
