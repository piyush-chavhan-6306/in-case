export type Category = 
  | 'Insurance'
  | 'Loan / EMI'
  | 'Investment / SIP'
  | 'Subscription'
  | 'Rent / Utility'
  | 'Other';

export type NomineeStatus = 'set' | 'not_set' | 'unknown';
export type DiscoverySource = 'discovered' | 'manual';
export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

export interface InventoryItem {
  id: string;
  provider: string;
  category: Category;
  amountApprox: number;
  frequency: 'Monthly' | 'Quarterly' | 'Yearly' | 'Recurring';
  nomineeStatus: NomineeStatus;
  nomineeName?: string;
  documentLocation: string;
  source: DiscoverySource;
  confidence: ConfidenceLevel;
  notes?: string;
  accountOrPolicyNumber?: string;
  lastChargedDate?: string;
  compressedDoc?: {
    name: string;
    type: string;
    originalSize: number;
    compressedSize: number;
    dataBase64: string;
    isCompressed: boolean;
    uploadedAt: string;
  };
}

export interface BankTransaction {
  date: string;
  description: string;
  debit?: number;
  credit?: number;
  balance?: number;
}

export interface VaultData {
  ciphertext: string;
  iv: string;
  createdAt: string;
  version: string;
  itemCount: number;
}

export interface TrustedShare {
  id: string;
  shareIndex: number;
  label: string; // "Trusted Person A", "Trusted Person B", "Trusted Person C"
  recipientName: string;
  shareData: string; // The hex secret share
  qrDataUrl?: string;
  createdAt: string;
}

export interface DrillQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  relatedCategory: Category;
  relatedItemProvider: string;
}

export interface DrillRecord {
  id: string;
  timestamp: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number; // 0-100
  durationSec: number;
  accuracyPercent: number;
}

export interface ReadinessScore {
  coverageScore: number; // 0 - 35 (representation of core categories)
  riskScore: number;     // 0 - 35 (penalties for missing nominees & docs)
  drillScore: number;    // 0 - 30 (performance in drill)
  total: number;         // 0 - 100
}

export type UrgencyLevel = 'urgent' | 'next' | 'later';

export interface PlaybookStep {
  id: string;
  timeframe: 'NOW' | 'NEXT_7_DAYS' | 'NEXT_30_DAYS';
  urgency: UrgencyLevel;
  title: string;
  description: string;
  targetProvider: string;
  category: Category;
  contactNotes?: string;
  completed: boolean;
}
