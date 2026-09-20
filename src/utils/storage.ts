import { VaultData, TrustedShare, InventoryItem, DrillRecord } from '../types';
import { DEFAULT_DISCOVERED_ITEMS, SAMPLE_DRILL_HISTORY } from './sampleData';

const VAULT_KEY = 'incase_vault_v1';
const SHARES_KEY = 'incase_shares_v1';
const ITEMS_KEY = 'incase_items_v1';
const DRILLS_KEY = 'incase_drills_v1';

export function getStoredVault(): VaultData | null {
  try {
    const raw = localStorage.getItem(VAULT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveVault(vault: VaultData): void {
  localStorage.setItem(VAULT_KEY, JSON.stringify(vault));
}

export function clearVault(): void {
  localStorage.removeItem(VAULT_KEY);
  localStorage.removeItem(SHARES_KEY);
}

export function getStoredShares(): TrustedShare[] {
  try {
    const raw = localStorage.getItem(SHARES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveShares(shares: TrustedShare[]): void {
  localStorage.setItem(SHARES_KEY, JSON.stringify(shares));
}

export function getStoredItems(): InventoryItem[] {
  try {
    const raw = localStorage.getItem(ITEMS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_DISCOVERED_ITEMS;
  } catch {
    return DEFAULT_DISCOVERED_ITEMS;
  }
}

export function saveItems(items: InventoryItem[]): void {
  localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
}

export function getStoredDrills(): DrillRecord[] {
  try {
    const raw = localStorage.getItem(DRILLS_KEY);
    return raw ? JSON.parse(raw) : SAMPLE_DRILL_HISTORY;
  } catch {
    return SAMPLE_DRILL_HISTORY;
  }
}

export function recordDrillResult(record: DrillRecord): void {
  const existing = getStoredDrills();
  const updated = [record, ...existing].slice(0, 10);
  localStorage.setItem(DRILLS_KEY, JSON.stringify(updated));
}
