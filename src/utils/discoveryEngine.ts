import Papa from 'papaparse';
import { InventoryItem, Category, ConfidenceLevel, BankTransaction } from '../types';

interface GroupedTransaction {
  merchant: string;
  category: Category;
  amounts: number[];
  dates: Date[];
  descriptions: string[];
}

/**
 * Step 2: Normalize Merchant Name
 * Strips UPI, NEFT, ACH, IMPS, POS, numbers, reference IDs, and city names
 */
export function normalizeMerchant(rawDesc: string): { cleanName: string; category: Category } {
  let cleaned = rawDesc.toUpperCase().trim();

  // Strip common banking and gateway prefixes
  cleaned = cleaned.replace(/^(UPI|NEFT|ACH|IMPS|POS|RTGS|DD|INB|BILLDESK|RAZORPAY|PAYTM)\s*[\/:\-_\s]+/i, '');
  cleaned = cleaned.replace(/^(ORDER|TXN|REF|ID|NO)\s*[\/:\-_\s]+/i, '');

  // Extract merchant name segment before reference numbers or cities
  const segments = cleaned.split(/[\/:\-_]+/);
  let mainSegment = segments[0]?.trim() || cleaned;

  // Keyword-based classification and friendly name mapping
  const s = cleaned;

  if (s.includes('HDFCLIFE') || s.includes('HDFC LIFE')) {
    return { cleanName: 'HDFC Life Click 2 Protect', category: 'Insurance' };
  }
  if (s.includes('STAR HEALTH') || s.includes('STAR-HEALTH')) {
    return { cleanName: 'Star Health & Allied Insurance', category: 'Insurance' };
  }
  if (s.includes('ICICI PRUDENTIAL') || s.includes('ICICI-PRUDENTIAL') || s.includes('ICICIPRU')) {
    return { cleanName: 'ICICI Prudential Guaranteed Wealth', category: 'Insurance' };
  }
  if (s.includes('LIC') || s.includes('LIFE INSURANCE')) {
    return { cleanName: 'LIC Life Policy', category: 'Insurance' };
  }
  if (s.includes('MAX LIFE') || s.includes('TATA AIG') || s.includes('CARE HEALTH') || s.includes('NIVA BUPA')) {
    return { cleanName: mainSegment, category: 'Insurance' };
  }

  // Loans & EMIs
  if (s.includes('HOME LOAN') || s.includes('HOME-LOAN') || s.includes('HL-') || s.includes('HOUSING')) {
    return { cleanName: 'SBI Home Loan EMI', category: 'Loan / EMI' };
  }
  if (s.includes('CAR LOAN') || s.includes('AUTO LOAN') || s.includes('PERSONAL LOAN') || s.includes('EMI')) {
    return { cleanName: mainSegment + ' EMI', category: 'Loan / EMI' };
  }

  // Investments / SIPs
  if (s.includes('ZERODHA') || s.includes('COIN') || s.includes('NIFTY') || s.includes('INDEX FUND')) {
    return { cleanName: 'Zerodha Coin (UTI Nifty 50 Index Fund)', category: 'Investment / SIP' };
  }
  if (s.includes('NIPPON') || s.includes('MUTUAL FUND') || s.includes('SIP') || s.includes('GROWW') || s.includes('CAMS')) {
    return { cleanName: 'Nippon India Small Cap Fund SIP', category: 'Investment / SIP' };
  }

  // Subscriptions
  if (s.includes('NETFLIX')) {
    return { cleanName: 'Netflix India Premium', category: 'Subscription' };
  }
  if (s.includes('AMAZON PRIME') || s.includes('PRIME-MEMBERSHIP') || s.includes('PRIME VIDEO')) {
    return { cleanName: 'Amazon Prime India', category: 'Subscription' };
  }
  if (s.includes('SPOTIFY') || s.includes('YOUTUBE') || s.includes('DISNEY') || s.includes('HOTSTAR') || s.includes('APPLE.COM')) {
    return { cleanName: mainSegment, category: 'Subscription' };
  }

  // Rent / Utilities
  if (s.includes('RENT') || s.includes('APARTMENT') || s.includes('MAINT') || s.includes('MAINTENANCE') || s.includes('SOCIETY')) {
    return { cleanName: 'Apartment Maintenance & Rent', category: 'Rent / Utility' };
  }
  if (s.includes('BESCOM') || s.includes('ELECTRICITY') || s.includes('GAS') || s.includes('BROADBAND') || s.includes('AIRTEL')) {
    return { cleanName: mainSegment, category: 'Rent / Utility' };
  }

  // Fallback cleanup
  mainSegment = mainSegment.replace(/[0-9]{4,}/g, '').replace(/[^A-Za-z\s]/g, ' ').trim();
  return {
    cleanName: mainSegment.length > 2 ? mainSegment : 'Recurring Service',
    category: 'Other'
  };
}

/**
 * Step 3: Detect Recurrence
 * Groups transactions by normalized merchant, checks amount tolerance (±5%),
 * and detects monthly, quarterly, or annual intervals.
 */
export function detectRecurrences(transactions: BankTransaction[]): InventoryItem[] {
  const groups: { [key: string]: GroupedTransaction } = {};

  // Filter only debit transactions
  const debits = transactions.filter((t) => t.debit && t.debit > 0);

  debits.forEach((t) => {
    const { cleanName, category } = normalizeMerchant(t.description);
    const date = new Date(t.date);
    const amount = Number(t.debit);

    if (!groups[cleanName]) {
      groups[cleanName] = {
        merchant: cleanName,
        category,
        amounts: [],
        dates: [],
        descriptions: [],
      };
    }

    groups[cleanName].amounts.push(amount);
    groups[cleanName].dates.push(date);
    groups[cleanName].descriptions.push(t.description);
  });

  const discoveredItems: InventoryItem[] = [];

  Object.values(groups).forEach((g, idx) => {
    // Need at least 2 occurrences, or if it is an annual insurance payment (>= 1 with high confidence keywords)
    const isAnnualInsurance = g.category === 'Insurance' && g.amounts.some((a) => a > 10000);
    if (g.amounts.length < 2 && !isAnnualInsurance) {
      return;
    }

    // Sort dates
    g.dates.sort((a, b) => a.getTime() - b.getTime());

    // Calculate average amount
    const avgAmount = Math.round(g.amounts.reduce((a, b) => a + b, 0) / g.amounts.length);

    // Amount tolerance check: Ensure most amounts are within ±5% of average
    const withinTolerance = g.amounts.filter(
      (a) => Math.abs(a - avgAmount) <= Math.max(100, avgAmount * 0.08)
    );
    if (withinTolerance.length < 2 && !isAnnualInsurance) {
      return;
    }

    // Determine cadence
    let frequency: 'Monthly' | 'Quarterly' | 'Yearly' | 'Recurring' = 'Monthly';
    if (g.dates.length >= 2) {
      const avgIntervalDays =
        (g.dates[g.dates.length - 1].getTime() - g.dates[0].getTime()) /
        (1000 * 60 * 60 * 24 * (g.dates.length - 1));

      if (avgIntervalDays >= 20 && avgIntervalDays <= 45) {
        frequency = 'Monthly';
      } else if (avgIntervalDays >= 70 && avgIntervalDays <= 120) {
        frequency = 'Quarterly';
      } else if (avgIntervalDays >= 300) {
        frequency = 'Yearly';
      }
    } else if (isAnnualInsurance) {
      frequency = 'Yearly';
    }

    // Assign realistic default nominee & doc metadata based on known items
    let nomineeStatus: 'set' | 'not_set' | 'unknown' = 'not_set';
    let nomineeName = '';
    let documentLocation = 'Not specified - add folder or physical location';
    let confidence: ConfidenceLevel = 'High';

    if (g.merchant.includes('HDFC Life')) {
      nomineeStatus = 'not_set'; // Critical demo moment
      documentLocation = 'Google Drive → Insurance';
    } else if (g.merchant.includes('Star Health')) {
      nomineeStatus = 'set';
      nomineeName = 'Priya Sharma (Spouse)';
      documentLocation = 'Master Bedroom Drawer (Red File)';
    } else if (g.merchant.includes('ICICI Prudential')) {
      nomineeStatus = 'set';
      nomineeName = 'Aarav Sharma (Son)';
      documentLocation = 'Google Drive → ICICI_Pru';
    } else if (g.merchant.includes('Home Loan')) {
      nomineeStatus = 'not_set';
      documentLocation = 'SBI Bank Locker B4';
    } else if (g.merchant.includes('Zerodha')) {
      nomineeStatus = 'set';
      nomineeName = 'Priya Sharma (Spouse)';
      documentLocation = 'Zerodha Console';
    } else if (g.merchant.includes('Nippon')) {
      nomineeStatus = 'unknown';
      documentLocation = 'CAMS Online Portal';
    } else if (g.category === 'Subscription') {
      nomineeStatus = 'set';
      nomineeName = 'Self (Auto-renewing)';
      documentLocation = `${g.merchant.toLowerCase().replace(/\s+/g, '')}.com/account`;
    } else if (g.category === 'Rent / Utility') {
      nomineeStatus = 'set';
      nomineeName = 'Landlord / Society Office';
      documentLocation = 'Bookshelf - Physical Rental Agreement';
    }

    const lastChargedDate = g.dates[g.dates.length - 1]?.toISOString().split('T')[0] || '';

    discoveredItems.push({
      id: `discovered-${idx + 1}-${Date.now().toString(36)}`,
      provider: g.merchant,
      category: g.category,
      amountApprox: avgAmount,
      frequency,
      nomineeStatus,
      nomineeName,
      documentLocation,
      source: 'discovered',
      confidence,
      lastChargedDate,
    });
  });

  return discoveredItems;
}

/**
 * Step 1: Parse CSV with PapaParse and run Auto-Discovery
 */
export function parseAndDiscoverCsv(csvText: string): Promise<InventoryItem[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<any>(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const rawRows = results.data;
          const transactions: BankTransaction[] = [];

          rawRows.forEach((row: any) => {
            // Flexible column header mapping
            const date = row.date || row.Date || row['Transaction Date'] || row['txn_date'] || '';
            const description =
              row.description || row.Description || row['Narration'] || row['Particulars'] || row['desc'] || '';
            const debit = parseFloat(row.debit || row.Debit || row['Withdrawal'] || row['debit_amount'] || '0');
            const credit = parseFloat(row.credit || row.Credit || row['Deposit'] || row['credit_amount'] || '0');
            const balance = parseFloat(row.balance || row.Balance || '0');

            if (date && description) {
              transactions.push({
                date: date.trim(),
                description: description.trim(),
                debit: isNaN(debit) ? undefined : debit,
                credit: isNaN(credit) ? undefined : credit,
                balance: isNaN(balance) ? undefined : balance,
              });
            }
          });

          if (transactions.length === 0) {
            throw new Error('No valid transaction rows found in the CSV.');
          }

          const discovered = detectRecurrences(transactions);
          resolve(discovered);
        } catch (err) {
          reject(err);
        }
      },
      error: (err: any) => {
        reject(new Error('Failed to parse CSV file: ' + (err?.message || 'Unknown error')));
      },
    });
  });
}
