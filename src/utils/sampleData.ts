import { InventoryItem, DrillQuestion, PlaybookStep, DrillRecord } from '../types';

/**
 * 6-Month Realistic Bank Statement CSV (Synthetic demo data)
 * Contains exactly 9 recurring financial commitments + everyday noise
 */
export const SAMPLE_BANK_STATEMENT_CSV = `date,description,debit,credit,balance
2026-03-01,SALARY CREDIT TECH CORP PVT LTD,,145000,165400
2026-03-02,ACH/HDFCLIFE/99214482/MUMBAI,4850,,160550
2026-03-03,UPI/SWIGGY/ORDER38291/BLR,520,,160030
2026-03-05,NEFT/SBI-HOME-LOAN-EMI/SBIN0048291,42500,,117530
2026-03-07,UPI/ZERODHA-COIN-SIP-NIFTY50/AMC891,15000,,102530
2026-03-10,UPI/DMART-GROCERY-RETAIL/BLR,3840,,98690
2026-03-12,ACH/NETFLIX-INDIA-STREAMING/REC-SUB,649,,98041
2026-03-15,UPI/NIPPON-INDIA-MUTUAL-FUND-SIP/991,5000,,93041
2026-03-18,IMPS/APARTMENT-MAINT-RENT/FLAT402,28000,,65041
2026-03-21,POS/SHELL-PETROL-STATION/FUEL,3100,,61941
2026-03-25,UPI/UBER-INDIA-RIDE/KA01882,410,,61531
2026-03-28,ACH/ICICI-PRUDENTIAL-LIFE-QTR/99201,12000,,49531

2026-02-01,SALARY CREDIT TECH CORP PVT LTD,,145000,194531
2026-02-02,ACH/HDFCLIFE/99214482/MUMBAI,4850,,189681
2026-02-04,UPI/AMAZON-RETAIL/BOOKS-ELEC,2190,,187491
2026-02-05,NEFT/SBI-HOME-LOAN-EMI/SBIN0048291,42500,,144991
2026-02-07,UPI/ZERODHA-COIN-SIP-NIFTY50/AMC891,15000,,129991
2026-02-11,UPI/ZOMATO/FOOD-ORDER-BLR,680,,129311
2026-02-12,ACH/NETFLIX-INDIA-STREAMING/REC-SUB,649,,128662
2026-02-15,UPI/NIPPON-INDIA-MUTUAL-FUND-SIP/991,5000,,123662
2026-02-18,IMPS/APARTMENT-MAINT-RENT/FLAT402,28000,,95662
2026-02-22,UPI/STARBUCKS-COFFEE/KORAMANGALA,750,,94912
2026-02-26,POS/APOLLO-PHARMACY/MEDICINES,1240,,93672

2026-01-01,SALARY CREDIT TECH CORP PVT LTD,,145000,238672
2026-01-02,ACH/HDFCLIFE/99214482/MUMBAI,4850,,233822
2026-01-05,NEFT/SBI-HOME-LOAN-EMI/SBIN0048291,42500,,191322
2026-01-07,UPI/ZERODHA-COIN-SIP-NIFTY50/AMC891,15000,,176322
2026-01-09,ACH/STAR-HEALTH-ALLIED-INSURANCE-ANNUAL,18400,,157922
2026-01-12,ACH/NETFLIX-INDIA-STREAMING/REC-SUB,649,,157273
2026-01-14,ACH/AMAZON-PRIME-INDIA-ANNUAL-MEMBERSHIP,1499,,155774
2026-01-15,UPI/NIPPON-INDIA-MUTUAL-FUND-SIP/991,5000,,150774
2026-01-18,IMPS/APARTMENT-MAINT-RENT/FLAT402,28000,,122774
2026-01-22,UPI/NATURES-BASKET/ORGANIC-BLR,2410,,120364
2026-01-27,UPI/DOCTOR-CONSULTATION-CLINIC,800,,119564

2025-12-01,SALARY CREDIT TECH CORP PVT LTD,,145000,264564
2025-12-02,ACH/HDFCLIFE/99214482/MUMBAI,4850,,259714
2025-12-05,NEFT/SBI-HOME-LOAN-EMI/SBIN0048291,42500,,217214
2025-12-07,UPI/ZERODHA-COIN-SIP-NIFTY50/AMC891,15000,,202214
2025-12-12,ACH/NETFLIX-INDIA-STREAMING/REC-SUB,649,,201565
2025-12-15,UPI/NIPPON-INDIA-MUTUAL-FUND-SIP/991,5000,,196565
2025-12-18,IMPS/APARTMENT-MAINT-RENT/FLAT402,28000,,168565
2025-12-28,ACH/ICICI-PRUDENTIAL-LIFE-QTR/99201,12000,,156565

2025-11-01,SALARY CREDIT TECH CORP PVT LTD,,145000,301565
2025-11-02,ACH/HDFCLIFE/99214482/MUMBAI,4850,,296715
2025-11-05,NEFT/SBI-HOME-LOAN-EMI/SBIN0048291,42500,,254215
2025-11-07,UPI/ZERODHA-COIN-SIP-NIFTY50/AMC891,15000,,239215
2025-11-12,ACH/NETFLIX-INDIA-STREAMING/REC-SUB,649,,238566
2025-11-15,UPI/NIPPON-INDIA-MUTUAL-FUND-SIP/991,5000,,233566
2025-11-18,IMPS/APARTMENT-MAINT-RENT/FLAT402,28000,,205566

2025-10-01,SALARY CREDIT TECH CORP PVT LTD,,145000,350566
2025-10-02,ACH/HDFCLIFE/99214482/MUMBAI,4850,,345716
2025-10-05,NEFT/SBI-HOME-LOAN-EMI/SBIN0048291,42500,,303216
2025-10-07,UPI/ZERODHA-COIN-SIP-NIFTY50/AMC891,15000,,288216
2025-10-12,ACH/NETFLIX-INDIA-STREAMING/REC-SUB,649,,287567
2025-10-15,UPI/NIPPON-INDIA-MUTUAL-FUND-SIP/991,5000,,282567
2025-10-18,IMPS/APARTMENT-MAINT-RENT/FLAT402,28000,,254567
`;

/**
 * Pre-configured Discovered Items from the Demo Statement
 */
export const DEFAULT_DISCOVERED_ITEMS: InventoryItem[] = [
  {
    id: 'item-1',
    provider: 'HDFC Life Click 2 Protect',
    category: 'Insurance',
    amountApprox: 4850,
    frequency: 'Monthly',
    nomineeStatus: 'not_set', // 🔴 Risk Flag: No nominee set!
    nomineeName: '',
    documentLocation: 'Google Drive → Finance/Insurance → Policy_HDFC.pdf',
    source: 'discovered',
    confidence: 'High',
    accountOrPolicyNumber: 'POL-99214482',
    notes: 'Pure Term Insurance Cover: ₹1.5 Cr sum assured.',
    lastChargedDate: '2026-03-02',
  },
  {
    id: 'item-2',
    provider: 'Star Health & Allied Insurance',
    category: 'Insurance',
    amountApprox: 18400,
    frequency: 'Yearly',
    nomineeStatus: 'set',
    nomineeName: 'Priya Sharma (Spouse)',
    documentLocation: 'Physical Red File in Master Bedroom Drawer',
    source: 'discovered',
    confidence: 'High',
    accountOrPolicyNumber: 'SH-FAM-882190',
    notes: 'Family Floater Health Policy: ₹15 Lakhs cashless hospital coverage across network hospitals.',
    lastChargedDate: '2026-01-09',
  },
  {
    id: 'item-3',
    provider: 'ICICI Prudential Guaranteed Wealth',
    category: 'Insurance',
    amountApprox: 12000,
    frequency: 'Quarterly',
    nomineeStatus: 'set',
    nomineeName: 'Aarav Sharma (Son)',
    documentLocation: 'Google Drive → ICICI_Pru_Receipts',
    source: 'discovered',
    confidence: 'High',
    accountOrPolicyNumber: 'ICICI-9920194',
    notes: 'Endowment/Savings plan maturing in 2035.',
    lastChargedDate: '2026-03-28',
  },
  {
    id: 'item-4',
    provider: 'SBI Home Loan EMI',
    category: 'Loan / EMI',
    amountApprox: 42500,
    frequency: 'Monthly',
    nomineeStatus: 'not_set', // 🔴 Risk Flag: Co-borrower / Nominee verification needed
    nomineeName: '',
    documentLocation: 'Bank Locker B4 at SBI Indiranagar Branch',
    source: 'discovered',
    confidence: 'High',
    accountOrPolicyNumber: 'SBI-HL-308821094',
    notes: 'Outstanding principal balance: ~₹38.4 Lakhs. Loan Insurance active.',
    lastChargedDate: '2026-03-05',
  },
  {
    id: 'item-5',
    provider: 'Zerodha Coin (UTI Nifty 50 Index Fund)',
    category: 'Investment / SIP',
    amountApprox: 15000,
    frequency: 'Monthly',
    nomineeStatus: 'set',
    nomineeName: 'Priya Sharma (Spouse)',
    documentLocation: 'Zerodha Console → Nominee Registered Online',
    source: 'discovered',
    confidence: 'High',
    accountOrPolicyNumber: 'DMAT-12081600',
    notes: 'Long-term equity portfolio.',
    lastChargedDate: '2026-03-07',
  },
  {
    id: 'item-6',
    provider: 'Nippon India Small Cap Fund SIP',
    category: 'Investment / SIP',
    amountApprox: 5000,
    frequency: 'Monthly',
    nomineeStatus: 'unknown', // 🟡 Risk Flag: Status unknown
    nomineeName: '',
    documentLocation: 'CAMS Online Portal / Mutual Fund Central',
    source: 'discovered',
    confidence: 'High',
    accountOrPolicyNumber: 'FOLIO-48199201',
    notes: 'Check if minor son is added as secondary beneficiary.',
    lastChargedDate: '2026-03-15',
  },
  {
    id: 'item-7',
    provider: 'Netflix India Premium (4K)',
    category: 'Subscription',
    amountApprox: 649,
    frequency: 'Monthly',
    nomineeStatus: 'not_set',
    documentLocation: 'netflix.com/your-account',
    source: 'discovered',
    confidence: 'High',
    notes: 'Auto-debit from credit card. Cancel in emergency to prevent zombie billing.',
    lastChargedDate: '2026-03-12',
  },
  {
    id: 'item-8',
    provider: 'Amazon Prime India (Annual)',
    category: 'Subscription',
    amountApprox: 1499,
    frequency: 'Yearly',
    nomineeStatus: 'not_set',
    documentLocation: 'amazon.in/prime',
    source: 'discovered',
    confidence: 'High',
    notes: 'Linked to primary family shopping and cloud photos.',
    lastChargedDate: '2026-01-14',
  },
  {
    id: 'item-9',
    provider: 'Apartment Maintenance & Rent (Flat 402)',
    category: 'Rent / Utility',
    amountApprox: 28000,
    frequency: 'Monthly',
    nomineeStatus: 'set',
    nomineeName: 'Direct Landlord / Society Office',
    documentLocation: 'Physical Rental Agreement file in Living Room Bookshelf',
    source: 'discovered',
    confidence: 'High',
    notes: 'Rental agreement expires December 2026. Deposit of ₹1.5L held with owner.',
    lastChargedDate: '2026-03-18',
  }
];

/**
 * Generate Dynamic Fire Drill Questions from Actual Inventory
 */
export function generateFireDrillQuestions(items: InventoryItem[]): DrillQuestion[] {
  const questions: DrillQuestion[] = [];

  // Question 1: Health / Hospital Coverage
  const healthItem = items.find(
    (i) => i.category === 'Insurance' && (i.provider.toLowerCase().includes('health') || i.provider.toLowerCase().includes('star'))
  ) || items.find((i) => i.category === 'Insurance');

  if (healthItem) {
    const wrongOptions = [
      'HDFC ERGO Motor Policy',
      'Reliance Travel Shield',
      'No insurance exists for hospitalization',
    ];
    questions.push({
      id: 'q1-hospital-cover',
      prompt: 'In case of a medical emergency requiring hospitalization, which policy provides cashless health coverage?',
      options: [healthItem.provider, ...wrongOptions].sort(() => Math.random() - 0.5),
      correctOptionIndex: 0, // Will be resolved after sorting
      explanation: `${healthItem.provider} is active with ₹${healthItem.amountApprox.toLocaleString()} ${healthItem.frequency.toLowerCase()} payment. Document is at: ${healthItem.documentLocation}.`,
      relatedCategory: 'Insurance',
      relatedItemProvider: healthItem.provider,
    });
  }

  // Question 2: Missing Nominee Risk
  const unassignedNominee = items.find((i) => i.nomineeStatus === 'not_set' && (i.category === 'Insurance' || i.category === 'Loan / EMI' || i.category === 'Investment / SIP'));
  if (unassignedNominee) {
    const otherProviders = items
      .filter((i) => i.id !== unassignedNominee.id)
      .map((i) => i.provider)
      .slice(0, 3);

    questions.push({
      id: 'q2-missing-nominee',
      prompt: 'Which critical financial commitment currently has NO NOMINEE registered and poses high legal risk?',
      options: [unassignedNominee.provider, ...otherProviders].sort(() => Math.random() - 0.5),
      correctOptionIndex: 0,
      explanation: `Notice: ${unassignedNominee.provider} has no nominee registered. The family must submit a nominee declaration to avoid court succession delays.`,
      relatedCategory: unassignedNominee.category,
      relatedItemProvider: unassignedNominee.provider,
    });
  }

  // Question 3: Total Monthly EMI Burden
  const loanItems = items.filter((i) => i.category === 'Loan / EMI');
  const monthlyLoanTotal = loanItems.reduce((acc, curr) => acc + curr.amountApprox, 0);
  if (loanItems.length > 0) {
    const options = [
      `₹${monthlyLoanTotal.toLocaleString()}/month`,
      `₹${(monthlyLoanTotal + 15000).toLocaleString()}/month`,
      `₹${Math.max(10000, monthlyLoanTotal - 12000).toLocaleString()}/month`,
      'No loans or EMIs are active',
    ];
    questions.push({
      id: 'q3-monthly-emi',
      prompt: 'What is the total monthly loan & EMI obligation that must continue to be serviced?',
      options: options.sort(() => Math.random() - 0.5),
      correctOptionIndex: 0,
      explanation: `Active loans (${loanItems.map((l) => l.provider).join(', ')}) require ₹${monthlyLoanTotal.toLocaleString()} every month.`,
      relatedCategory: 'Loan / EMI',
      relatedItemProvider: loanItems[0].provider,
    });
  }

  // Question 4: Physical Document Location
  const physicalDocItem = items.find((i) => i.documentLocation.toLowerCase().includes('drawer') || i.documentLocation.toLowerCase().includes('locker') || i.documentLocation.toLowerCase().includes('file')) || items[0];
  if (physicalDocItem) {
    const fakeLocations = [
      'In a locked safe in the basement',
      'With the tax accountant in their office',
      'No physical documents exist',
    ];
    questions.push({
      id: 'q4-doc-location',
      prompt: `Where can your family find the original documents for ${physicalDocItem.provider}?`,
      options: [physicalDocItem.documentLocation, ...fakeLocations].sort(() => Math.random() - 0.5),
      correctOptionIndex: 0,
      explanation: `Documents for ${physicalDocItem.provider} are stored at: "${physicalDocItem.documentLocation}".`,
      relatedCategory: physicalDocItem.category,
      relatedItemProvider: physicalDocItem.provider,
    });
  }

  // Question 5: Nominee Name for Registered Account
  const registeredNomineeItem = items.find((i) => i.nomineeStatus === 'set' && i.nomineeName && i.nomineeName.length > 2);
  if (registeredNomineeItem) {
    const wrongNominees = ['Aarav Sharma (Son)', 'Priya Sharma (Spouse)', 'Vikram Sharma (Brother)', 'Not Registered'].filter(
      (n) => n !== registeredNomineeItem.nomineeName
    );

    questions.push({
      id: 'q5-nominee-name',
      prompt: `Who is officially designated as the nominee for ${registeredNomineeItem.provider}?`,
      options: [registeredNomineeItem.nomineeName!, ...wrongNominees.slice(0, 3)].sort(() => Math.random() - 0.5),
      correctOptionIndex: 0,
      explanation: `${registeredNomineeItem.nomineeName} is the registered nominee on record for ${registeredNomineeItem.provider}.`,
      relatedCategory: registeredNomineeItem.category,
      relatedItemProvider: registeredNomineeItem.provider,
    });
  }

  // Adjust correctOptionIndex after sorting
  return questions.map((q) => {
    let correctText = '';
    if (q.id === 'q1-hospital-cover') correctText = healthItem?.provider || '';
    else if (q.id === 'q2-missing-nominee') correctText = unassignedNominee?.provider || '';
    else if (q.id === 'q3-monthly-emi') correctText = `₹${monthlyLoanTotal.toLocaleString()}/month`;
    else if (q.id === 'q4-doc-location') correctText = physicalDocItem?.documentLocation || '';
    else if (q.id === 'q5-nominee-name') correctText = registeredNomineeItem?.nomineeName || '';

    const idx = q.options.indexOf(correctText);
    return {
      ...q,
      correctOptionIndex: idx >= 0 ? idx : 0,
    };
  });
}

/**
 * Calculate the 0-100 Readiness Score
 * Coverage (35 pts) + Risk Gap Resolution (35 pts) + Drill Score (30 pts)
 */
export function calculateReadinessScore(
  items: InventoryItem[],
  latestDrillPercent: number | null
): { coverageScore: number; riskScore: number; drillScore: number; total: number } {
  if (!items || items.length === 0) {
    return { coverageScore: 0, riskScore: 0, drillScore: 0, total: 0 };
  }

  // 1. Coverage Score (Max 35): Are the 4 pillars (Insurance, Loan, Investment, Rent/Living) covered?
  const hasInsurance = items.some((i) => i.category === 'Insurance');
  const hasLoan = items.some((i) => i.category === 'Loan / EMI');
  const hasInvestment = items.some((i) => i.category === 'Investment / SIP');
  const hasLiving = items.some((i) => i.category === 'Rent / Utility');

  let coverageScore = 15; // Baseline for having items
  if (hasInsurance) coverageScore += 6;
  if (hasLoan) coverageScore += 5;
  if (hasInvestment) coverageScore += 5;
  if (hasLiving) coverageScore += 4;
  coverageScore = Math.min(35, coverageScore);

  // 2. Risk Score (Max 35): Deductions for missing nominees and unknown document locations
  let riskScore = 35;
  const missingNominees = items.filter((i) => i.nomineeStatus === 'not_set' && (i.category === 'Insurance' || i.category === 'Loan / EMI' || i.category === 'Investment / SIP')).length;
  const missingDocs = items.filter((i) => !i.documentLocation || i.documentLocation.toLowerCase().includes('unknown') || i.documentLocation.trim() === '').length;

  riskScore -= missingNominees * 7;
  riskScore -= missingDocs * 5;
  riskScore = Math.max(8, Math.min(35, riskScore));

  // 3. Drill Score (Max 30): Based on timed rehearsal drill performance
  let drillScore = 15; // default if no drill taken yet
  if (latestDrillPercent !== null) {
    drillScore = Math.round((latestDrillPercent / 100) * 30);
  }

  const total = Math.min(100, Math.max(0, coverageScore + riskScore + drillScore));
  return { coverageScore, riskScore, drillScore, total };
}

/**
 * Historical Drill Progress mock
 */
export const SAMPLE_DRILL_HISTORY: DrillRecord[] = [
  {
    id: 'drill-1',
    timestamp: '2026-01-15 19:30',
    totalQuestions: 5,
    correctAnswers: 2,
    score: 40,
    durationSec: 68,
    accuracyPercent: 40,
  },
  {
    id: 'drill-2',
    timestamp: '2026-02-20 14:15',
    totalQuestions: 5,
    correctAnswers: 3,
    score: 60,
    durationSec: 49,
    accuracyPercent: 60,
  },
  {
    id: 'drill-3',
    timestamp: '2026-03-18 10:45',
    totalQuestions: 5,
    correctAnswers: 5,
    score: 100,
    durationSec: 32,
    accuracyPercent: 100,
  }
];

/**
 * Static Emergency Playbook Generator
 */
export function generatePlaybookSteps(items: InventoryItem[]): PlaybookStep[] {
  const steps: PlaybookStep[] = [];

  // NOW - First 24 Hours
  const healthItem = items.find((i) => i.category === 'Insurance' && (i.provider.toLowerCase().includes('health') || i.provider.toLowerCase().includes('star')));
  if (healthItem) {
    steps.push({
      id: 'pb-1',
      timeframe: 'NOW',
      urgency: 'urgent',
      title: `Notify ${healthItem.provider} for Cashless Pre-Authorization`,
      description: 'Call the hospital TPA desk immediately with policy number. Cashless approval must be requested within 24 hours of emergency admission.',
      targetProvider: healthItem.provider,
      category: 'Insurance',
      contactNotes: `Policy doc: ${healthItem.documentLocation}. Call customer helpline on health card.`,
      completed: false,
    });
  }

  const termLifeItem = items.find((i) => i.category === 'Insurance' && i.provider.toLowerCase().includes('life'));
  if (termLifeItem) {
    steps.push({
      id: 'pb-2',
      timeframe: 'NOW',
      urgency: 'urgent',
      title: `Locate ${termLifeItem.provider} Term Insurance Policy Document`,
      description: `Retrieve original policy contract from: "${termLifeItem.documentLocation}". Verify nominee details: ${termLifeItem.nomineeStatus === 'set' ? termLifeItem.nomineeName : '⚠️ Nominee not set - prepare identity proofs'}.`,
      targetProvider: termLifeItem.provider,
      category: 'Insurance',
      completed: false,
    });
  }

  steps.push({
    id: 'pb-3',
    timeframe: 'NOW',
    urgency: 'urgent',
    title: 'Secure Primary Banking Credentials & Phone SIM',
    description: 'Ensure the registered phone number remains active for OTPs. Do not let the carrier disconnect the mobile line.',
    targetProvider: 'Mobile Telecom / Bank Accounts',
    category: 'Other',
    completed: false,
  });

  // NEXT 7 DAYS
  const loanItem = items.find((i) => i.category === 'Loan / EMI');
  if (loanItem) {
    steps.push({
      id: 'pb-4',
      timeframe: 'NEXT_7_DAYS',
      urgency: 'next',
      title: `Inform ${loanItem.provider} Regarding Loan EMI Grace Period`,
      description: `Monthly payment of ₹${loanItem.amountApprox.toLocaleString()} is linked to bank auto-debit. Inquire about loan moratorium, insurance waivers, or restructuring.`,
      targetProvider: loanItem.provider,
      category: 'Loan / EMI',
      contactNotes: `Doc location: ${loanItem.documentLocation}. Account: ${loanItem.accountOrPolicyNumber || 'Ref statement'}.`,
      completed: false,
    });
  }

  const sipItems = items.filter((i) => i.category === 'Investment / SIP');
  if (sipItems.length > 0) {
    steps.push({
      id: 'pb-5',
      timeframe: 'NEXT_7_DAYS',
      urgency: 'next',
      title: `Pause Ongoing Mutual Fund SIPs (${sipItems.map((s) => s.provider).join(', ')})`,
      description: `Pause monthly outflows totaling ₹${sipItems.reduce((a, b) => a + b.amountApprox, 0).toLocaleString()} to preserve immediate household liquid cash reserves.`,
      targetProvider: 'Mutual Fund Portals (Zerodha / CAMS)',
      category: 'Investment / SIP',
      completed: false,
    });
  }

  const subscriptionItems = items.filter((i) => i.category === 'Subscription');
  if (subscriptionItems.length > 0) {
    steps.push({
      id: 'pb-6',
      timeframe: 'NEXT_7_DAYS',
      urgency: 'next',
      title: `Cancel Recurring Non-Essential Subscriptions (${subscriptionItems.map((s) => s.provider).join(', ')})`,
      description: 'Stop recurring auto-debit charges from streaming services and premium subscriptions to prevent silent credit card drainage.',
      targetProvider: 'Digital Subscriptions',
      category: 'Subscription',
      completed: false,
    });
  }

  // NEXT 30 DAYS
  steps.push({
    id: 'pb-7',
    timeframe: 'NEXT_30_DAYS',
    urgency: 'later',
    title: 'Initiate Legal Transmission of Demat & Investment Portfolios',
    description: 'Submit death certificate / power of attorney along with KYC transmission forms to CAMS and depository participants (CDSL/NSDL).',
    targetProvider: 'Demat & Mutual Fund Depository',
    category: 'Investment / SIP',
    completed: false,
  });

  steps.push({
    id: 'pb-8',
    timeframe: 'NEXT_30_DAYS',
    urgency: 'later',
    title: 'Submit Bank Account Nominee Claim Settlement Forms',
    description: 'Contact primary bank branch manager. Nominees are entitled to receive credit balance without probate or succession certificate.',
    targetProvider: 'Primary Bank Branches',
    category: 'Other',
    completed: false,
  });

  return steps;
}
