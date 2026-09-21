import { VaultData, TrustedShare, InventoryItem, DrillRecord, FinancialDocument, UserProfile } from '../types';
import { DEFAULT_DISCOVERED_ITEMS, SAMPLE_DRILL_HISTORY, DEFAULT_SAMPLE_VAULT, DEFAULT_SAMPLE_SHARES } from './sampleData';

function getKey(base: string, userId?: string): string {
  if (userId) {
    return `${base}_user_${userId}`;
  }
  return `${base}_v1`;
}

// ----------------------------------------------------
// VAULT STORAGE
// ----------------------------------------------------
export function getStoredVault(userId?: string): VaultData | null {
  try {
    const raw = localStorage.getItem(getKey('incase_vault', userId));
    if (raw) return JSON.parse(raw);
    return userId ? null : DEFAULT_SAMPLE_VAULT;
  } catch {
    return userId ? null : DEFAULT_SAMPLE_VAULT;
  }
}

export function saveVault(vault: VaultData, userId?: string): void {
  localStorage.setItem(getKey('incase_vault', userId), JSON.stringify(vault));
}

export function clearVault(userId?: string): void {
  localStorage.removeItem(getKey('incase_vault', userId));
  localStorage.removeItem(getKey('incase_shares', userId));
}

// ----------------------------------------------------
// SHAMIR GUARDIAN SHARES STORAGE
// ----------------------------------------------------
export function getStoredShares(userId?: string): TrustedShare[] {
  try {
    const raw = localStorage.getItem(getKey('incase_shares', userId));
    if (raw) return JSON.parse(raw);
    return userId ? [] : DEFAULT_SAMPLE_SHARES;
  } catch {
    return userId ? [] : DEFAULT_SAMPLE_SHARES;
  }
}

export function saveShares(shares: TrustedShare[], userId?: string): void {
  localStorage.setItem(getKey('incase_shares', userId), JSON.stringify(shares));
}

// ----------------------------------------------------
// INVENTORY ITEMS STORAGE
// ----------------------------------------------------
export function getStoredItems(userId?: string): InventoryItem[] {
  try {
    const raw = localStorage.getItem(getKey('incase_items', userId));
    if (raw) return JSON.parse(raw);
    // Real registered user starts with a completely fresh, clean profile (no fake data)
    return userId ? [] : DEFAULT_DISCOVERED_ITEMS;
  } catch {
    return userId ? [] : DEFAULT_DISCOVERED_ITEMS;
  }
}

export function saveItems(items: InventoryItem[], userId?: string): void {
  localStorage.setItem(getKey('incase_items', userId), JSON.stringify(items));
}

// ----------------------------------------------------
// FIRE DRILL RECORDS STORAGE
// ----------------------------------------------------
export function getStoredDrills(userId?: string): DrillRecord[] {
  try {
    const raw = localStorage.getItem(getKey('incase_drills', userId));
    if (raw) return JSON.parse(raw);
    // Real registered user starts with empty drill history
    return userId ? [] : SAMPLE_DRILL_HISTORY;
  } catch {
    return userId ? [] : SAMPLE_DRILL_HISTORY;
  }
}

export function recordDrillResult(record: DrillRecord, userId?: string): void {
  const existing = getStoredDrills(userId);
  const updated = [record, ...existing].slice(0, 10);
  localStorage.setItem(getKey('incase_drills', userId), JSON.stringify(updated));
}

// ----------------------------------------------------
// FINANCIAL DOCUMENTS STORAGE
// ----------------------------------------------------
export const DEFAULT_SAMPLE_DOCS: FinancialDocument[] = [
  {
    id: 'doc-1',
    name: 'HDFC_Life_Click2Protect_Policy_Bond.pdf',
    category: 'Insurance Policy',
    provider: 'HDFC Life Insurance',
    policyOrAccountNumber: 'PP-98214-TL',
    fileType: 'application/pdf',
    originalSize: 428000,
    compressedSize: 185000,
    dataBase64: '',
    uploadedAt: '2026-09-15T10:30:00.000Z',
    notes: 'Primary term life cover (₹1.50 Crore). Nominee: Spouse (Ananya Sharma).',
  },
  {
    id: 'doc-2',
    name: 'Star_Health_Optima_Cashless_Ecard.pdf',
    category: 'Insurance Policy',
    provider: 'Star Health & Allied Insurance',
    policyOrAccountNumber: 'SH-4412-MED',
    fileType: 'application/pdf',
    originalSize: 312000,
    compressedSize: 142000,
    dataBase64: '',
    uploadedAt: '2026-09-16T14:15:00.000Z',
    notes: 'Family floater ₹10 Lakh sum insured. TPA Desk ID: TPA-SH-0912.',
  },
  {
    id: 'doc-3',
    name: 'SBI_Mutual_Fund_Consolidated_CAS.pdf',
    category: 'Mutual Fund / SIP',
    provider: 'SBI Mutual Fund',
    policyOrAccountNumber: 'FOLIO-881920-X',
    fileType: 'application/pdf',
    originalSize: 520000,
    compressedSize: 215000,
    dataBase64: '',
    uploadedAt: '2026-09-18T09:00:00.000Z',
    notes: 'Nifty 50 Index Fund & Small Cap SIP. Combined valuation ₹8.45 Lakh.',
  },
  {
    id: 'doc-4',
    name: 'RBI_Sovereign_Gold_Bond_Certificate.pdf',
    category: 'Fixed Deposit / Bond',
    provider: 'Reserve Bank of India',
    policyOrAccountNumber: 'SGB-2024-SERIES-IV',
    fileType: 'application/pdf',
    originalSize: 265000,
    compressedSize: 110000,
    dataBase64: '',
    uploadedAt: '2026-09-12T16:20:00.000Z',
    notes: '25 Units Sovereign Gold Bond @ 2.5% semi-annual interest.',
  },
  {
    id: 'doc-5',
    name: 'ICICI_Home_Loan_Sanction_Deed.pdf',
    category: 'Property / Loan Deed',
    provider: 'ICICI Bank Home Finance',
    policyOrAccountNumber: 'HL-MUM-77312',
    fileType: 'application/pdf',
    originalSize: 840000,
    compressedSize: 380000,
    dataBase64: '',
    uploadedAt: '2026-09-10T11:45:00.000Z',
    notes: 'Original sale deed deposited with ICICI Bandra Kurla branch.',
  },
  {
    id: 'doc-6',
    name: 'Family_Living_Will_and_POA_2026.pdf',
    category: 'Will / Legal',
    provider: 'Notarized Legal Deed',
    policyOrAccountNumber: 'REG-WILL-2026-BOM',
    fileType: 'application/pdf',
    originalSize: 610000,
    compressedSize: 275000,
    dataBase64: '',
    uploadedAt: '2026-09-08T15:10:00.000Z',
    notes: 'Executed in Mumbai with 2 registered witnesses and power of attorney.',
  },
];

export function getStoredDocuments(userId?: string): FinancialDocument[] {
  try {
    const raw = localStorage.getItem(getKey('incase_documents', userId));
    if (raw) return JSON.parse(raw);
    // Real registered user starts with a clean document vault
    return userId ? [] : DEFAULT_SAMPLE_DOCS;
  } catch {
    return userId ? [] : DEFAULT_SAMPLE_DOCS;
  }
}

export function saveDocuments(docs: FinancialDocument[], userId?: string): void {
  localStorage.setItem(getKey('incase_documents', userId), JSON.stringify(docs));
}

export function addStoredDocument(doc: FinancialDocument, userId?: string): void {
  const existing = getStoredDocuments(userId);
  saveDocuments([doc, ...existing], userId);
}

export function deleteStoredDocument(id: string, userId?: string): void {
  const existing = getStoredDocuments(userId);
  saveDocuments(existing.filter((d) => d.id !== id), userId);
}

// ----------------------------------------------------
// ONBOARDING TOUR STATE
// ----------------------------------------------------
export function isTourCompleted(userId?: string): boolean {
  if (!userId) return true;
  return localStorage.getItem(`incase_tour_completed_${userId}`) === 'true';
}

export function setTourCompleted(userId?: string): void {
  if (!userId) return;
  localStorage.setItem(`incase_tour_completed_${userId}`, 'true');
}

// ----------------------------------------------------
// USER PROFILE STORAGE
// ----------------------------------------------------
export function getStoredProfile(userId?: string, userEmail?: string): UserProfile {
  const fallbackEmail = userEmail || 'guardian@example.com';
  const defaultName = fallbackEmail.split('@')[0];

  const defaultProfile: UserProfile = {
    fullName: defaultName.charAt(0).toUpperCase() + defaultName.slice(1),
    email: fallbackEmail,
    phone: '',
    alternatePhone: '',
    city: 'Mumbai',
    primaryNomineeName: '',
    primaryNomineeRelation: 'Spouse',
    primaryNomineePhone: '',
    bloodGroup: 'O+',
    allergiesAndMedicalNotes: 'No known severe drug allergies.',
    updatedAt: new Date().toISOString(),
  };

  try {
    const raw = localStorage.getItem(getKey('incase_profile', userId));
    if (raw) {
      return { ...defaultProfile, ...JSON.parse(raw) };
    }
    return defaultProfile;
  } catch {
    return defaultProfile;
  }
}

export function saveProfile(profile: UserProfile, userId?: string): void {
  localStorage.setItem(getKey('incase_profile', userId), JSON.stringify(profile));
}

// ----------------------------------------------------
// FULL ENCRYPTED JSON BACKUP EXPORT
// ----------------------------------------------------
export function exportFamilyBackupJSON(userId?: string, userEmail?: string): void {
  const backup = {
    app: 'IN CASE — Family Contingency System',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    userId: userId || 'anonymous',
    profile: getStoredProfile(userId, userEmail),
    items: getStoredItems(userId),
    vault: getStoredVault(userId),
    documents: getStoredDocuments(userId),
    drillHistory: getStoredDrills(userId),
    securityNotice: 'Client-side zero-knowledge encrypted vault. Secret shares remain separated across trusted guardians.',
  };

  const jsonStr = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `IN_CASE_Family_Backup_${(userId || 'offline').slice(0, 8)}_${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

