import { InventoryItem, DrillQuestion, PlaybookStep, DrillRecord, VaultData, TrustedShare } from '../types';

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

export const DEFAULT_SAMPLE_VAULT: VaultData = {
  ciphertext:
    "7dee5483a66a6d6197aa96cea5081168b79ed3d8b3c0872c9b927e12e247039ce01a5403d876460aad6d978235054c71a9633430684f8c8c96df7395d88a878773e01e4149d245cd36e3efa9d78c9c4108bbddb7bda3c361e38bca8f0395a41bf4727c3f4c284e01628d8398c8a3203b6d77b069d0f7862c739808ff268dfd3a1cf88e641bf86586278ee7c992634c6ca477a99ddc8d5d01c54000ad19597470bdbff474455e50a7a771d816039f088bae3fa46d12969baddf2c4034f96a9b29451a3beb2539f6b326c0b9c49b4cd50d00715300746046033fc06c7c636b89bbe6f945c2b5dc2dc74f5cbfd37bf0e7b066c76c608b7576cd91258c61fc85c0ed2f92510f3b5e24dd2209a79ae2f4cc9cef9a8b65b57a919d1e8e4bc70fdebb75a6e154717ba47728d88907a3ed5636bb04d1dbcecea1e664abbc0e844a9d99a2ea5027a55574295a0d7ed994afdffefda240c22384b7080605877c63e5f0717588a8f985f77fa3915dab8bda23f5cc1d10ebcf3e5368b61b5e805997f77e467d90a8382c3040ed36b6003c217d11883bd7f372afa495cb69341e17ae151adc1d68789980c6aa9de533265d15d83b8dc51dbcaa554720a466bd5cf2fdf3ccd858a323be37edea07af70c8c44ecb01a8e8210f1ab84a99610f933219833d25544e040046382987e2e5cb8856bece049c98b3bb5af36d421d9894e0e67717e4dac2cae7952f543cd8bbf6231f915c1fcc27ae55c8ae56555c1f237b3fe1cf9d8926d2f85945be8833bcef0ce43f112ffa271d7f74f1da420a75ec64684a0472a421c5a14c8ab65e96afb480433df4a8ee5b8711396e370839e38f7c1a17f9e7477eb9ddbd892766d09034d31bbfeeeb9c883027a9d36b04c5c84a45ea635557826afd7bc1b1a232836d48455ed6e7459be415bd84dee9778be5b8d24db9ed43bbdb884e9738ea4bc1604fa04f28fd8374a5ee045217505d19c802832411992331584d2c07f34df79e9c3a76ac8a1d1f5b094c4952209aa6e4038c4d4f01210e77e402c53e30c88fb25daa0c9e07473dd654973488710ce1212611e60e0de6ee82e0754a0c27a6bd877d806becaf730aa301397c353d16b9cfd673c2b4e0ab822b95df6bd03e8758013d5af20dbfeae4283378a16fa87f0bc409f2d490526b53f69e953f41d3f9631ed685a7c90f6611e023d9cc5f6a936ae940e1e44788fc2e7d03f12f9e8f24c8edd4169bc6a5b543d792912e1324f66d0c69a0cceb26be7f0d89bdeb0e1932d4255d996470d3091c51fef1370811021b5023143acdfe9c75fbc6ad0e75f6bf58db0553bdfb432d94255c01337b22722481af34e2b731c49f1a33919d22b3be3fd60b54b558c6afefbb7258aff3d7765f2bd248984f1cff525a23a1ed4a587a1cb826ad5672ec45888d2ffc00feda904e432e99d2c36db0f7877c409ab6bdea9aebdea6b077d097b670d4f7f9c1747d43c9e752702103a0d2d91a75e0e6a772b6d25bcdd85ee0f9a0da88a8827093ad1c6836843e853a66860435951401a2ea8d27aa8d01e48619e3432d4535ff074322bfff2f731cf0804aabbb2a3096910153c1f9b72fe0c39f51f2283f0bcd0e57f6d384e6ad05ab8f0b9de569b99bb207452424288f59069ce8918fe38341a1461e2890ea9ef9d679440b7a74e30bc58b442da7c6253772d2973db970f14328b8de479d4bf640205c5d8a2c2ed0c486685dd233095879707fffe6cc081836ca8d451d19e2648ce803b64228ddb8007955248f8290d20f06fe5182773ade8f725c6d0268da9af285ea688d93d5cdab5b8b78613bec0aaa8db78ae185f2efa7b5616eb092d4e9ae499038ce5ee53f306f1bbae566eddffdb60c2564b93b7c2dfae34b9bafc0fab70fe05ac9152f6e79efc718951e1c9e828dd613376805f3fd071c6fb0cf955ede2f30e11bf48de8b12bece67a93f2054c45a4e3c3c88f6fb49d04e53ba589039e5255cfdffbe91311faf53484d147d89d3c3dae42a7d7190c90db51dd21965663d3ed750e1af4b7c7b5e77e965d1c53ced1a564602f310c1abaa96fc212002dd5a060923dc88765f20e759feeb16904e99c96f20fdb86b725d96a6929fcb71df2406f68f396f5a222bd44dc724877aeee7b1283b418fd649e985fd533484338c53f7cbbc430141f9ccd6a52ea5814362851891bf1e858e6a2ece502deb1c4da4cc075abc24db504a224f19a80400957aea03b2ecb0a970ee6da8209f015edb7f068198b2227f46bd369ea08ed1ad6862a1d0ecb565bf30e74eac38484dc9b3273033f381bbcf963f21f3fb32b67f26cb9e63b18576842b42463b84e7d8ec41f3d620dd8b2e7dab7a278d4cab1f9ed75a0d6a7d07af17073e022a25a36df9be8d56b3df907ae6813a86be9f3cff7bff993a7231f7b9f148b04f4f3a1ebb1b4f12017742a6c0ed1ed64af5351955b582543f41ee1155982d9a6f4ecef4c5227ac718734727096ed8c484eaf76720c8828b34b9c6cd162dfd1810b8325b2fac0f48598cf77af9226ff1ab3a56d168dac65f52256ed73ad3f28715cc62ea65a1005c2ba758c6a70bbb485ee7ba6caf303542e257eec4c1ea48acfe5030106df936eb96a8b39d96e1c9e9dbcca0800533fdb38c3c257d485b46ca09d1003bbe80d5eaaec25436d020c93f69aa2f2c284e3194c38f535bb95d2c6a975aa0a592f9352b8a0694c9c451a61c78a19bde37658a2769a5cc05f8670f2f1faccb9cabc832b05f58cc0c071ac8ba09b8d48954c7938d40a3c158a877a57bf61ff30f93e427be63e8aebb1ca8e1c5ba1556e1ae32fb2378046ed2272286fcb0a444e523eb97d7b66c9e402f8ab8974f2bae2027904fbed48c0ff0cb9091a76aea89f36f27b7c40146aeae224375b066a7aa0b4ed16df3c830aef9dbc79ab2c1fbdbedac827aefc1c27ae4c8fd3b5cf9224a63009f49c472b990ee3c74cf87b673ac8eee6ec276b40f4ad6d5235f29d074ed1d8cc66f11faeed7119f89ee0e4122ea70376f32c7033d47a009ba2bf4d77b96476a2b53a5a011ba607fca0c13e2f93cbc8650e75d09f0693c90d4016dce7b594a8fc73a84144c364ba7ece30f367160b954ee21705008605808bf32b55abbeb50b6f90dfc5f7568109c2f5769040f7111bee0185fbbf56b3654e7f467d5f9d59c1e1437ae0c1eb8f000281aa43d65bd32efe5cc974c31027601a0427d4dca5a407a5003c787704219a347501dfcbf98ea148bd938776d8741b86a96c5ba27ca84d70973260b80202439f568377433498be0fe477f86c1fdbfaf6d85a5283deaa57f4049ee47f8d46fc14d59843da4f4d7d12fe75e4882cdd480078efdcdcff4e17f557e95a3db2a19b3dc45293409d5a2476f03c83e52cf046a8d30476751a6f68a03743b62d442ddf7dac295a6e766791347e8ce34a4eea13cd29727797155109801a34304b3c454c66ee63e824f971ecc49ce7240f90d0c13f83205c7111c0090328113f6df21e4f5251f8d7f84f8272b558c87d9afe9bb45ddde9d63c68bdb1f3492aabe1a91a2b98d7503c05f066c51441ad96d9eb0f1d834a3a4010cdce52a0d1fed0744e659a06d41156353837b08f75a8653ff65a342c391062b81cf7fdd28b69faa73a74dd7b0271751562b68d26e2044f0d4ce2db06920ebe107f85bdf708e169c21645fa1fe5dca2100d9f29f6929bc0593a571df32e53a20336339b6db45b6e587978f6002b0ed168f6e6ea81f6b7086b99300775d125f685e412aba4df351c6f87c30be04edb2fe3b49ad60f47ef7004b563db8e3638cbe01ed5ffd242b031bd70c8cc5e3e81776b06968e3dfbe0a4200f21caee67fd10097bc1a55734aff159d29f7b27d102d1ceb78bc4a3ff5814ce0c226d413ab89ef21c1219e7f9b009904bf6afae2e34173650fd7078b0250040842065c34d2bc40e125d325a69a9401451353fc0b08e949e4af84c0bdcf9d4b5ece2cd7e5afc821c8b88769736a9806c8f0fee3a35f9d80630b97dca81364c153a342f10fa4a79c3c9da5ced980c0ad6e3bd4d5f96fe147114094518df3097a7105119d99823ed4fe4847044cb90aec7528ccc816ceb0b4509b2866172c530cb0d225233f044e3366c211238165bb05f768f8c1e4e9dbb1f8d45bea9132c16966140026cbe348cf7bfd0bef30e2521b41624de27fc3a6efab7692eb451d13a2280f50836970cfeda5a8eebf95567f07c60c3fc2696967d56164a9679c723c459b8dfe3f82c8042c93c623ad4e5fea1d849b5e25925e77f6f5ab6980aa640ca5c9236b6e70818e25c0f7e96f8d7a98d30c6f81316ce89136e6191b35db3e62b42b78940c86ddde637298eed5708c55ff858ca8c9241a6a5bb7735580f89f9b591a53e36f77ea49b80e1b1e836782c315c13042800d987718bf2d2f80008770e9ee59f1060879fb31c134051a8a6f695c0cba8f84cb3a1c8ece54c460c0ba432a1697f9115b15babe1c15e749028659052e21765e5c5a2b03ed729a7fdc4c05e490c0aa7735321eccd8d55ae116d1da4d8b65e5229f8a76cb64f4b60a1ceded99998093807a72820e5de4938fef9b7451516d71b524a283f7f48a2410ece3c99411046b602cc775b73d91e0eb95ac4c7f8ab1f49febf751f8b3853d8579b0f60209b2671c3034070a722da4c979959b053458dade27f41380281e278a806dd31a4291ec1a8487e4ccde5db8d2d67f34bc1436b2b533f9e73a741ab9b4868a90840c91629a3f5165218a8624f3d07d297ac81881c24d99c584708d26f76d76c9f0c95f3c2d1123e37f3c31a8a09e54c1072da6d20c9a78c204cb40b4ffc44a8bd85fea28e042849d6a120939c33287556c1aeba7e8c65f3443d0c72eb70c1226e89545d7ca8299d1d190d300b95091ed447f64345efa70e80497d0f498dcbc2255384cec008e2a32c240ca57351ee53d62489e863ac5f062380975eb5157d41da3cc66b1f1f21d932bac359910b3144484171dc6813bdc7f4c1538690bba2142203816f0f4301a8bcdb210c44af45c7822db5772d7c630dfa4bdaefab0e9cbece6bb292fb6d8b0ec6facd1da263c1c0e30713fadcf6374a2e83e3567db8cf808d70af21de18519fa5b64f16664e231d9637b23a0acb64a505655a2bac893631576b95d121bc68d580761410b1b28108ea925fb73bec4b089d37b5fb3f311e9589c0a2e2",
  iv: "52ce35f9cc20e6d44aa7aa0e",
  createdAt: "2026-09-21T16:28:23.595Z",
  version: "1.0.0",
  itemCount: 9,
};

export const DEFAULT_SAMPLE_SHARES: TrustedShare[] = [
  {
    id: "share-1",
    shareIndex: 1,
    label: "Trusted Person A",
    recipientName: "Spouse (Priya)",
    shareData: "INCASE-SHARE-1-2-d1880bdad057acd95c816d1d363683bd52cacd5bbf9ec7120a4baab0745ff161",
    qrDataUrl: "",
    createdAt: "2026-09-21T16:28:23.673Z",
  },
  {
    id: "share-2",
    shareIndex: 2,
    label: "Trusted Person B",
    recipientName: "Brother (Vikram)",
    shareData: "INCASE-SHARE-2-2-51ff3bfa5eec50faed84552715ac529011461de1cd36bf11964f31b164f6350d",
    qrDataUrl: "",
    createdAt: "2026-09-21T16:28:23.686Z",
  },
  {
    id: "share-3",
    shareIndex: 3,
    label: "Trusted Person C",
    recipientName: "Family Attorney",
    shareData: "INCASE-SHARE-3-2-d8d22b13248504128287b431fdda1d8bd9cba47ee3a79710e2bab1479d918029",
    qrDataUrl: "",
    createdAt: "2026-09-21T16:28:23.703Z",
  },
];

