import React, { useState, useEffect } from 'react';
import './App.css';
import Layout from './components/Layout';
import ProductModal from './components/ProductModal';
import Wizard from './components/Wizard';
import { usePageSEO } from './hooks/usePageSEO';
import { sortByAffiliatePriority } from './config';
import { KeyboardProduct } from './types/keyboard';

// Learn Pages
import Learn from './pages/learn';
import LearnBeginnersGuide from './pages/learn/BeginnersGuide';
import ArtisanGuide from './pages/learn/ArtisanGuide';
import FAQ from './pages/learn/FAQ';
import SwitchGuide from './pages/SwitchGuide';
import Glossary from './pages/Glossary';
import BestBudgetGuide from './pages/learn/BestBudgetGuide';
import BestGamingGuide from './pages/learn/BestGamingGuide';
import Best60PercentGuide from './pages/learn/Best60PercentGuide';
import BestProgrammingGuide from './pages/learn/BestProgrammingGuide';
import GroupBuysGuide from './pages/learn/GroupBuysGuide';
import LayoutSizesGuide from './pages/learn/LayoutSizesGuide';
import BestTKLGuide from './pages/learn/BestTKLGuide';
import Best75PercentGuide from './pages/learn/Best75PercentGuide';
import KeycapProfilesGuide from './pages/learn/KeycapProfilesGuide';

// Blog Posts
import HallEffectPost from './pages/blog/HallEffectPost';
import KeychronReviewPost from './pages/blog/KeychronReviewPost';
import CherryMX2APost from './pages/blog/CherryMX2APost';
import GroupBuysPost from './pages/blog/GroupBuysPost';
import GasketMountPost from './pages/blog/GasketMountPost';
import WirelessKeyboardsPost from './pages/blog/WirelessKeyboardsPost';
import HotswapVsSolderedPost from './pages/blog/HotswapVsSolderedPost';

// Extend KeyboardProduct with App-specific fields
type Product = KeyboardProduct & {
  type?: string;
  size?: string;
};

// Size value mapping for sorting (smaller number = smaller keyboard)
const SIZE_VALUES: Record<string, number> = {
  '40%': 40,
  '50%': 50,
  '60%': 60,
  '65%': 65,
  '70%': 70,
  '75%': 75,
  '80%': 80,
  'TKL': 80,
  '96%': 96,
  '1800': 96,
  '100%': 100,
  'Full': 100,
  'Numpad': 105,
  'Novelty': 150
};

// Extract size from product using multiple methods
const extractSize = (product: Product): string | null => {
  // Method 1: Check if size is already populated
  if (product.size && SIZE_VALUES[product.size]) {
    return product.size;
  }

  // Method 2: Pattern matching on name and description
  const text = (product.name + ' ' + (product.description || '')).toLowerCase();
  
  // Layout percentages (highest priority - explicit)
  const percentageMatch = text.match(/\b(40|50|60|65|70|75|80|96|100)%/);
  if (percentageMatch) {
    return percentageMatch[1] + '%';
  }
  
  // Named layouts
  if (text.includes('tkl') || text.includes('tenkeyless')) return 'TKL';
  if (text.includes('full-size') || text.includes('full size')) return 'Full';
  if (text.includes('numpad') && !text.includes('keyboard')) return 'Numpad';
  if (text.includes('1800') || text.includes('1800 layout')) return '96%';
  
  // Method 3: Vendor-specific pattern matching
  const vendor = product.vendor?.toLowerCase() || '';
  const name = product.name?.toLowerCase() || '';
  
  // Keychron patterns
  if (vendor === 'keychron') {
    const modelMatch = name.match(/\b(q|v|k|c|b)\d+/i);
    if (modelMatch) {
      const model = modelMatch[0].toUpperCase();
      if (model === 'Q1' || model === 'V1' || model === 'B1') return '75%';
      if (model === 'Q2' || model === 'V2' || model === 'K2') return '65%';
      if (model === 'Q3' || model === 'V3' || model === 'K3' || model === 'C1') return 'TKL';
      if (model === 'Q4' || model === 'K4') return '60%';
      if (model === 'Q5' || model === 'V5' || model === 'K5') return 'TKL';
      if (model === 'Q6' || model === 'V6' || model === 'K6') return 'Full';
      if (model === 'Q7' || model === 'V7' || model === 'K7') return 'Full';
      if (model === 'Q8' || model === 'V8' || model === 'K8') return 'TKL';
      if (model === 'Q9' || model === 'K9') return '40%';
      if (model === 'Q10' || model === 'V10' || model === 'K10' || model === 'K14' || model === 'K15') return 'Full';
    }
  }
  
  // Epomaker patterns
  if (vendor === 'epomaker') {
    const thMatch = name.match(/th(\d+)/i);
    if (thMatch) {
      const size = parseInt(thMatch[1]);
      if (size <= 70) return '65%';
      if (size <= 90) return 'TKL';
      if (size <= 100) return 'TKL';
      if (size <= 110) return 'Full';
      return '96%';
    }
    if (name.includes('g84')) return '75%';
    if (name.includes('rt100')) return 'Full';
    if (name.includes('he30')) return 'Numpad';
  }
  
  // Drop patterns
  if (vendor === 'drop') {
    if (name.includes('alt')) return '65%';
    if (name.includes('ctrl')) return 'TKL';
    if (name.includes('shift')) return '96%';
    if (name.includes('sense75')) return '75%';
    if (name.includes('preonic')) return '50%';
    if (name.includes('planck')) return '40%';
  }
  
  // KBDfans patterns
  if (vendor === 'kbdfans') {
    if (name.includes('60') || name.includes('d60') || name.includes('tofu60')) return '60%';
    if (name.includes('65') || name.includes('d65') || name.includes('tofu65') || name.includes('kbd67')) return '65%';
    if (name.includes('75') || name.includes('kbd75') || name.includes('d84')) return '75%';
    if (name.includes('8x') || name.includes('freebird') || name.includes('d100')) return 'TKL';
    if (name.includes('odin') || name.includes('bella') || name.includes('mountain') || name.includes('d108')) return 'Full';
  }
  
  // NovelKeys patterns
  if (vendor === 'novelkeys') {
    if (name.includes('nk65')) return '65%';
    if (name.includes('nk87')) return 'TKL';
    if (name.includes('hope')) return 'TKL';
    if (name.includes('nibble')) return '65%';
    if (name.includes('big switch')) return 'Novelty';
  }
  
  // Method 4: Generic model number patterns
  const genericMatch = name.match(/\b(th|ek|p|a|d)(\d{2,3})\b/i);
  if (genericMatch) {
    const size = parseInt(genericMatch[2]);
    if (size <= 65) return '65%';
    if (size <= 80) return 'TKL';
    if (size <= 100) return 'Full';
  }
  
  return null;
};

// Get numeric size value for sorting
const getSizeValue = (product: Product): number => {
  const size = extractSize(product);
  return size ? SIZE_VALUES[size] || 50 : 999; // Unknown sizes go to end
};

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayLimit, setDisplayLimit] = useState(12);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [wizardFilters, setWizardFilters] = useState<Product[] | null>(null);
  const [wizardSelections, setWizardSelections] = useState<{
    useCase: string | null;
    workspace: string | null;
    size: string | null;
    hotswap: string | null;
    budget: string | null;
  } | null>(null);
  const [sortBy, setSortBy] = useState<string>('affiliate');
  const [searchQuery, setSearchQuery] = useState('');

  // Parse URL query parameters on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    const categoryParam = urlParams.get('category');
    
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      // Re-parse query params on navigation
      const urlParams = new URLSearchParams(window.location.search);
      const searchParam = urlParams.get('search');
      const categoryParam = urlParams.get('category');
      if (searchParam !== null) setSearchQuery(searchParam);
      if (categoryParam) {
        setActiveCategory(categoryParam);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    // Skip data loading for learn pages
    if (currentPath.startsWith('/learn') || 
        currentPath === '/switch-guide' || 
        currentPath === '/glossary') {
      setLoading(false);
      return;
    }
    
    // Fetch from GitHub raw URL - decouples data updates from builds
    // Add cache-busting timestamp to ensure fresh data
    const cacheBuster = Date.now();
    fetch(`https://raw.githubusercontent.com/carteblanchecarriage/switchyard/master/public/data.json?v=${cacheBuster}`)
      .then(res => res.json())
      .then(data => {
        const allProducts: Product[] = data.allProducts || data.items || [];
        const sortedProducts = sortByAffiliatePriority(allProducts);
        setProducts(sortedProducts);
        
        // Get current URL params for initial filtering
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        const categoryParam = urlParams.get('category');
        
        let filtered = sortedProducts;
        
        // Apply category filter from URL inline (filterByCategory not yet defined)
        if (categoryParam && categoryParam !== 'all') {
          filtered = filtered.filter(p => p.category === categoryParam);
        }
        
        // Apply search filter from URL  
        if (searchParam) {
          const queryLower = searchParam.toLowerCase();
          filtered = filtered.filter((p: Product) =>
            p.name?.toLowerCase().includes(queryLower) ||
            p.vendor?.toLowerCase().includes(queryLower) ||
            p.description?.toLowerCase().includes(queryLower)
          );
        }
        
        setFilteredProducts(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading products:', err);
        setError('Failed to load products');
        setLoading(false);
      });
  }, [currentPath]);

  // URL params are now handled in the data loading useEffect above

  // SEO for main product grid - dynamic based on category and search
  const getPageTitle = () => {
    if (searchQuery) {
      return `"${searchQuery}" | Search Results - Switchyard`;
    }
    if (activeCategory === 'all') {
      return 'Switchyard | Browse 300+ In-Stock Mechanical Keyboards & Keycaps';
    }
    return `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Keyboards & Keycaps | Switchyard`;
  };

  const getPageDescription = () => {
    if (searchQuery) {
      return `Search results for "${searchQuery}" - ${filteredProducts.length} products found`;
    }
    if (activeCategory === 'all') {
      return 'Browse 300+ in-stock mechanical keyboards, keycaps, switches, and accessories. Live inventory tracking from Drop, Keychron, NovelKeys, and more.';
    }
    return `Shop ${filteredProducts.length}+ ${activeCategory} keyboards and accessories. Track availability and compare prices. Updated daily.`;
  };

  usePageSEO({
    title: getPageTitle(),
    description: getPageDescription(),
    keywords: `mechanical keyboards, ${activeCategory}, keyboard tracker, group buys, keycaps, switches, Drop, Keychron, GMK, ${searchQuery || ''}`
  });

  // Filter products by category
  const filterByCategory = (category: string, baseProducts: Product[]): Product[] => {
    if (category === 'all') {
      return baseProducts;
    } else if (category === 'keyboard') {
      // Keywords that indicate non-keyboard items to exclude
      const nonKeyboardKeywords = [
        'puller', 'opener', 'plate', 'knob', 'storage box', 'single key',
        'mouse', 'cable', 'despak mat', 'dust cover', 'keychain', 'wood siding',
        'acoustic upgrade', 'travel pouch', 'bundle', 'reservation card',
        'wireless module', 'game console', 'lube kit', 'lubricant', 'wrist rest',
        'adaptor', 'product protection', 'mini display', 'shipping protection',
        'lowball', 'spring', 'stabilizer', 'case', 'carrying case', 'travel case',
        'sticker', 'switch puller', 'keycap puller', 'lubing station',
        'switch opener', 'spring', 'switch', 'plate', 'mod', 'foam', 'pad',
        'adapter', 'converter', 'pouch', 'case', 'cover', 'bag', 'coiled'
      ];
      
      return baseProducts.filter(p => {
        const cat = p.category || 'keyboard';
        const nameLower = p.name?.toLowerCase() || '';
        const descLower = p.description?.toLowerCase() || '';
        
        // Exclude items with non-keyboard keywords
        const isNonKeyboard = nonKeyboardKeywords.some(kw => 
          nameLower.includes(kw) || descLower.includes(kw)
        );
        
        return cat === 'keyboard' && !isNonKeyboard;
      });
    } else if (category === 'artisan') {
      return baseProducts.filter(p => 
        p.category === 'keycaps' && 
        p.name?.toLowerCase().includes('artisan')
      );
    } else if (category === 'accessories') {
      return baseProducts.filter(p => {
        const cat = p.category?.toLowerCase() || '';
        const name = p.name?.toLowerCase() || '';
        
        // Include anything categorized as accessories or case
        if (cat === 'accessories' || cat === 'case') return true;
        
        // Include cases by keyword
        const isCase = name.includes('case') || 
                      name.includes('carrying case') || 
                      name.includes('travel case') ||
                      name.includes('keyboard bag');
        
        const isAccessory = name.includes('cable') || 
                           name.includes('deskmat') || 
                           name.includes('wrist rest') ||
                           name.includes('keycap puller') ||
                           name.includes('switch puller') ||
                           name.includes('lube') ||
                           name.includes('foam');
        return isCase || isAccessory;
      });
    } else {
      return baseProducts.filter(p => p.category === category);
    }
  };

  // Filter products by search query
  const filterBySearch = (query: string, productsToFilter: Product[]): Product[] => {
    if (!query || query.trim() === '') {
      return productsToFilter;
    }
    
    const lowerQuery = query.toLowerCase().trim();
    return productsToFilter.filter(p => {
      const nameMatch = p.name?.toLowerCase().includes(lowerQuery);
      const vendorMatch = p.vendor?.toLowerCase().includes(lowerQuery);
      const categoryMatch = p.category?.toLowerCase().includes(lowerQuery);
      const descMatch = p.description?.toLowerCase().includes(lowerQuery);
      const typeMatch = p.type?.toLowerCase().includes(lowerQuery);
      
      return nameMatch || vendorMatch || categoryMatch || descMatch || typeMatch;
    });
  };

  // Combined filter handler
  const applyFilters = (category: string, query: string) => {
    const baseProducts = wizardFilters || products;
    
    // First apply category filter
    let filtered = filterByCategory(category, baseProducts);
    
    // Then apply search filter
    filtered = filterBySearch(query, filtered);
    
    setFilteredProducts(filtered);
    setDisplayLimit(12);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    applyFilters(category, searchQuery);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(activeCategory, query);
    
    // Update URL without reloading page
    const url = new URL(window.location.href);
    if (query) {
      url.searchParams.set('search', query);
    } else {
      url.searchParams.delete('search');
    }
    window.history.replaceState({}, '', url.toString());
  };

  const clearSearch = () => {
    setSearchQuery('');
    applyFilters(activeCategory, '');
  };

  const handleWizardFilter = (filtered: Product[], selections: any) => {
    setWizardFilters(filtered);
    setWizardSelections(selections);
    applyFilters(activeCategory, searchQuery);
    setDisplayLimit(12);
  };

  const loadMore = () => {
    setDisplayLimit(prev => prev + 12);
  };

  // Sort products
  const sortProducts = (productsToSort: Product[]) => {
    const sorted = [...productsToSort];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => {
          const priceA = parseFloat(a.price?.replace(/[^0-9.]/g, '') || '0');
          const priceB = parseFloat(b.price?.replace(/[^0-9.]/g, '') || '0');
          return priceA - priceB;
        });
      case 'price-high':
        return sorted.sort((a, b) => {
          const priceA = parseFloat(a.price?.replace(/[^0-9.]/g, '') || '0');
          const priceB = parseFloat(b.price?.replace(/[^0-9.]/g, '') || '0');
          return priceB - priceA;
        });
      case 'size-small':
        return sorted.sort((a, b) => getSizeValue(a) - getSizeValue(b));
      case 'size-large':
        return sorted.sort((a, b) => getSizeValue(b) - getSizeValue(a));
      case 'name-az':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-za':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'affiliate':
      default:
        // Preserve affiliate priority order (already sorted by sortByAffiliatePriority)
        return sorted;
    }
  };

  const displayedProducts = sortProducts(filteredProducts).slice(0, displayLimit);
  const hasMore = filteredProducts.length > displayLimit;

  // Route to page components with proper SEO coverage
  if (currentPath === '/learn') {
    return <Learn />;
  }
  if (currentPath === '/learn/beginners-guide') {
    return <LearnBeginnersGuide />;
  }
  if (currentPath === '/learn/switch-guide') {
    return <SwitchGuide />;
  }
  if (currentPath === '/learn/glossary') {
    return <Glossary />;
  }
  if (currentPath === '/learn/artisan') {
    return <ArtisanGuide />;
  }
  if (currentPath === '/learn/faq') {
    return <FAQ />;
  }
  // Support legacy routes
  if (currentPath === '/switch-guide') {
    return <SwitchGuide />;
  }
  if (currentPath === '/beginners-guide') {
    return <LearnBeginnersGuide />;
  }
  if (currentPath === '/glossary') {
    return <Glossary />;
  }
  if (currentPath === '/artisan') {
    return <ArtisanGuide />;
  }
  if (currentPath === '/learn/artisan-guide') {
    return <ArtisanGuide />;
  }
  if (currentPath === '/faq') {
    return <FAQ />;
  }
  if (currentPath === '/learn/best-budget' || currentPath === '/best-budget') {
    return <BestBudgetGuide />;
  }
  if (currentPath === '/learn/best-gaming' || currentPath === '/best-gaming' || currentPath === '/gaming') {
    return <BestGamingGuide />;
  }
  if (currentPath === '/learn/best-60-percent' || currentPath === '/best-60-percent') {
    return <Best60PercentGuide />;
  }
  if (currentPath === '/learn/group-buys') {
    return <GroupBuysGuide />;
  }
  if (currentPath === '/learn/best-programming' || currentPath === '/best-programming') {
    return <BestProgrammingGuide />;
  }
  if (currentPath === '/learn/layout-sizes') {
    return <LayoutSizesGuide />;
  }
  if (currentPath === '/learn/best-tkl' || currentPath === '/best-tkl') {
    return <BestTKLGuide />;
  }
  if (currentPath === '/learn/best-75-percent') {
    return <Best75PercentGuide />;
  }
  if (currentPath === '/learn/keycap-profiles') {
    return <KeycapProfilesGuide />;
  }

  // Blog Routes
  if (currentPath === '/blog/hall-effect-keyboards-2026') {
    return <HallEffectPost />;
  }
  if (currentPath === '/blog/are-keychron-keyboards-worth-it') {
    return <KeychronReviewPost />;
  }
  if (currentPath === '/blog/cherry-mx2a-vs-original') {
    return <CherryMX2APost />;
  }
  if (currentPath === '/blog/what-are-group-buys') {
    return <GroupBuysPost />;
  }
  if (currentPath === '/blog/gasket-mount-keyboards-explained') {
    return <GasketMountPost />;
  }
  if (currentPath === '/blog/wireless-mechanical-keyboards-2026') {
    return <WirelessKeyboardsPost />;
  }
  if (currentPath === '/blog/hot-swap-vs-soldered-keyboards') {
    return <HotswapVsSolderedPost />;
  }
  if (currentPath === '/blog') {
    return <Learn />;
  }

  // Main app render
  if (loading && !currentPath.startsWith('/learn')) {
    return (
      <Layout>
        <div className="loading">Loading products...</div>
      </Layout>
    );
  }

  if (error && !currentPath.startsWith('/learn')) {
    return (
      <Layout>
        <div className="error">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="stats">
        {filteredProducts.length} products
        {searchQuery && ` (searching "${searchQuery}")`}
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <div className="search-wrapper">
          <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search keyboards, keycaps, switches, vendors..."
            value={searchQuery}
            onChange={handleSearchChange}
            aria-label="Search products"
          />
          {searchQuery && (
            <button className="search-clear" onClick={clearSearch} aria-label="Clear search">
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="controls-row">
        <div className="filter-chips">
          {['all', 'keyboard', 'switches', 'keycaps', 'artisan', 'accessories'].map(cat => (
            <button
              key={cat}
              className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
              aria-label={`Filter by ${cat}`}
            >
              {cat === 'all' ? 'All Products' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="sort-control">
          <label htmlFor="sort">Sort:</label>
          <select 
            id="sort" 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
            aria-label="Sort products"
          >
            <option value="affiliate">Featured (Affiliate Partners)</option>
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="size-small">Size: Small to Large</option>
            <option value="size-large">Size: Large to Small</option>
            <option value="name-az">Name: A-Z</option>
            <option value="name-za">Name: Z-A</option>
          </select>
        </div>
      </div>

      <div className="product-grid">
        {displayedProducts.map(product => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => setSelectedProduct(product)}
            role="button"
            tabIndex={0}
            aria-label={`View ${product.name} details`}
          >
            <div className="product-image">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={`${product.name} - ${product.vendor || product.category || 'Keyboard product'}`}
                  loading="lazy"
                />
              ) : (
                <div className="no-image">No Image Available</div>
              )}
            </div>
            <div className="product-info">
              <span className="vendor">{product.vendor}</span>
              <h3 className="name">{product.name}</h3>
              <span className="price">{product.price || 'Check Price'}</span>
              <span className="category">{product.category}</span>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="load-more">
          <button onClick={loadMore} aria-label={`Load more products (${filteredProducts.length - displayLimit} remaining)`}>
            Load More ({filteredProducts.length - displayLimit} remaining)
          </button>
        </div>
      )}

      {filteredProducts.length === 0 && !loading && (
        <div className="no-results">
          <p>No products found matching "{searchQuery}"</p>
          <button onClick={clearSearch}>Clear Search</button>
        </div>
      )}

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <Wizard
        products={products}
        onFilterChange={handleWizardFilter}
        activeFilters={wizardSelections}
      />
    </Layout>
  );
}
