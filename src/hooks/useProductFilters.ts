import { useState, useEffect, useCallback } from 'react';
import { KeyboardProduct } from '../types/keyboard';
import { useDebounce } from './useDebounce';
import { getSizeValue } from '../utils/extractSize';
import { WizardState } from '../components/Wizard';

type Product = KeyboardProduct & { type?: string; size?: string };

const NON_KEYBOARD_KEYWORDS = [
  'puller', 'opener', 'plate', 'knob', 'storage box', 'single key',
  'mouse', 'cable', 'despak mat', 'dust cover', 'keychain', 'wood siding',
  'acoustic upgrade', 'travel pouch', 'bundle', 'reservation card',
  'wireless module', 'game console', 'lube kit', 'lubricant', 'wrist rest',
  'adaptor', 'product protection', 'mini display', 'shipping protection',
  'lowball', 'spring', 'stabilizer', 'case', 'carrying case', 'travel case',
  'sticker', 'switch puller', 'keycap puller', 'lubing station',
  'switch opener', 'spring', 'switch', 'plate', 'mod', 'foam', 'pad',
  'adapter', 'converter', 'pouch', 'case', 'cover', 'bag', 'coiled',
];

function filterByCategory(category: string, base: Product[]): Product[] {
  if (category === 'all') return base;

  if (category === 'keyboard') {
    return base.filter(p => {
      const cat = p.category || 'keyboard';
      const nameLower = p.name?.toLowerCase() || '';
      const descLower = p.description?.toLowerCase() || '';
      const isNonKeyboard = NON_KEYBOARD_KEYWORDS.some(kw =>
        nameLower.includes(kw) || descLower.includes(kw)
      );
      return cat === 'keyboard' && !isNonKeyboard;
    });
  }

  if (category === 'artisan') {
    return base.filter(p =>
      p.category === 'keycaps' && p.name?.toLowerCase().includes('artisan')
    );
  }

  if (category === 'accessories') {
    return base.filter(p => {
      const cat = p.category?.toLowerCase() || '';
      const name = p.name?.toLowerCase() || '';
      if (cat === 'accessories' || cat === 'case') return true;
      return (
        name.includes('case') || name.includes('carrying case') ||
        name.includes('travel case') || name.includes('keyboard bag') ||
        name.includes('cable') || name.includes('deskmat') ||
        name.includes('wrist rest') || name.includes('keycap puller') ||
        name.includes('switch puller') || name.includes('lube') ||
        name.includes('foam')
      );
    });
  }

  return base.filter(p => p.category === category);
}

function filterBySearch(query: string, base: Product[]): Product[] {
  if (!query.trim()) return base;
  const lower = query.toLowerCase().trim();
  return base.filter(p =>
    p.name?.toLowerCase().includes(lower) ||
    p.vendor?.toLowerCase().includes(lower) ||
    p.category?.toLowerCase().includes(lower) ||
    p.description?.toLowerCase().includes(lower) ||
    p.type?.toLowerCase().includes(lower)
  );
}

function sortProducts(toSort: Product[], sortBy: string): Product[] {
  const sorted = [...toSort];
  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => {
        const pA = parseFloat(a.price?.replace(/[^0-9.]/g, '') || '0');
        const pB = parseFloat(b.price?.replace(/[^0-9.]/g, '') || '0');
        return pA - pB;
      });
    case 'price-high':
      return sorted.sort((a, b) => {
        const pA = parseFloat(a.price?.replace(/[^0-9.]/g, '') || '0');
        const pB = parseFloat(b.price?.replace(/[^0-9.]/g, '') || '0');
        return pB - pA;
      });
    case 'size-small':
      return sorted.sort((a, b) => getSizeValue(a) - getSizeValue(b));
    case 'size-large':
      return sorted.sort((a, b) => getSizeValue(b) - getSizeValue(a));
    case 'name-az':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-za':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return sorted;
  }
}

function filterByPrice(priceFilter: string, base: Product[]): Product[] {
  if (priceFilter === 'all') return base;
  return base.filter(p => {
    const num = parseFloat(p.price?.replace(/[^0-9.]/g, '') || '0');
    if (!num) return true; // no price = include
    if (priceFilter === 'under100') return num < 100;
    if (priceFilter === '100to200') return num >= 100 && num <= 200;
    if (priceFilter === 'over200') return num > 200;
    return true;
  });
}

export function useProductFilters(products: Product[], wizardFilters: Product[] | null) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('affiliate');
  const [displayLimit, setDisplayLimit] = useState(12);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const debouncedQuery = useDebounce(searchQuery, 300);

  // Parse URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const search = params.get('search');
    const category = params.get('category');
    if (search) setSearchQuery(search);
    if (category) setActiveCategory(category);
  }, []);

  const applyFilters = useCallback(
    (category: string, query: string, price: string) => {
      const base = wizardFilters || products;
      let filtered = filterByCategory(category, base);
      filtered = filterByPrice(price, filtered);
      filtered = filterBySearch(query, filtered);
      setFilteredProducts(filtered);
      setDisplayLimit(12);
    },
    [products, wizardFilters]
  );

  useEffect(() => {
    applyFilters(activeCategory, debouncedQuery, priceFilter);
  }, [debouncedQuery, activeCategory, priceFilter, applyFilters]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    const url = new URL(window.location.href);
    if (query) url.searchParams.set('search', query);
    else url.searchParams.delete('search');
    window.history.replaceState({}, '', url.toString());
  };

  const clearSearch = () => setSearchQuery('');

  const loadMore = () => setDisplayLimit(prev => prev + 12);

  const displayedProducts = sortProducts(filteredProducts, sortBy).slice(0, displayLimit);
  const hasMore = filteredProducts.length > displayLimit;

  return {
    filteredProducts,
    displayedProducts,
    hasMore,
    activeCategory,
    priceFilter,
    setPriceFilter,
    searchQuery,
    sortBy,
    setSortBy,
    handleCategoryChange,
    handleSearchChange,
    clearSearch,
    loadMore,
  };
}

// Re-export WizardState so callers don't need two imports
export type { WizardState };
