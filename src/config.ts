import { KeyboardProduct } from './types/keyboard';

// Vendors with active affiliate programs (sorted by display priority)
export const AFFILIATE_VENDORS = [
  'Keychron',     // 8% commission, 405 products
  'Epomaker',     // 6% commission, 88 products
  'Qwerkywriter', // Unique products, 9 products
] as const;

// Vendor display order (affiliate vendors first - sorted by confirmed referral value)
export const VENDOR_SORT_ORDER: Record<string, number> = {
  'Keychron': 0,
  'Epomaker': 1,
  'Qwerkywriter': 2,
  'KBDfans': 10,
  'NovelKeys': 11,
  'Drop': 12,
  'CannonKeys': 100,
  'DiviniKey': 101,
  'Glorious': 102,
  'Boardsource': 103,
  'Kono.store': 104,
};

export const sortByAffiliatePriority = (products: KeyboardProduct[]): KeyboardProduct[] => {
  return [...products].sort((a, b) => {
    const aPriority = VENDOR_SORT_ORDER[a.vendor ?? ''] ?? 999;
    const bPriority = VENDOR_SORT_ORDER[b.vendor ?? ''] ?? 999;
    if (aPriority !== bPriority) return aPriority - bPriority;
    return a.name.localeCompare(b.name);
  });
};

export const getVendorPriority = (vendor: string): 'affiliate' | 'standard' => {
  return AFFILIATE_VENDORS.includes(vendor as (typeof AFFILIATE_VENDORS)[number])
    ? 'affiliate'
    : 'standard';
};
