import React, { useState, useEffect } from 'react';
import './App.css';
import Layout from './components/Layout';
import ProductModal from './components/ProductModal';
import Wizard from './components/Wizard';
import { usePageSEO } from './hooks/usePageSEO';

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
import Best75PercentGuide from './pages/learn/Best75PercentGuide';
import KeycapProfilesGuide from './pages/learn/KeycapProfilesGuide';

interface Product {
  id: string;
  name: string;
  url: string;
  affiliateUrl?: string;
  image?: string;
  price?: string;
  vendor?: string;
  category?: string;
  description?: string;
  scrapedAt?: string;
}

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
  const [sortBy, setSortBy] = useState<string>('newest');

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
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
    fetch('https://raw.githubusercontent.com/carteblanchecarriage/switchyard/master/public/data.json')
      .then(res => res.json())
      .then(data => {
        const allProducts: Product[] = data.allProducts || data.groupBuys || [];
        setProducts(allProducts);
        setFilteredProducts(allProducts);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading data:', err);
        setError('Failed to load products');
        setLoading(false);
      });
  }, [currentPath]);

  // SEO for main product grid
  usePageSEO({
    title: activeCategory === 'all' 
      ? 'Switchyard | Mechanical Keyboard Tracker'
      : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} | Switchyard`,
    description: `Browse ${filteredProducts.length}+ ${activeCategory === 'all' ? 'mechanical keyboards, keycaps, switches, and accessories' : activeCategory} from top vendors. Track group buys and find in-stock drops.`,
    keywords: `mechanical keyboards, ${activeCategory}, keyboard tracker, group buys, keycaps, switches`
  });

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    const baseProducts = wizardFilters || products;
    
    if (category === 'all') {
      // Show all products
      setFilteredProducts(baseProducts);
    } else if (category === 'keyboard') {
      // Keyboards: category === 'keyboard' OR category === 'accessories' (those are keyboards mislabeled)
      // Exclude carrying cases which are actual accessories
      setFilteredProducts(baseProducts.filter(p => {
        const cat = p.category || 'keyboard';
        const isCarryingCase = p.name?.toLowerCase().includes('carrying case') || 
                               p.name?.toLowerCase().includes('travel case');
        return (cat === 'keyboard' || cat === 'accessories') && !isCarryingCase;
      }));
    } else if (category === 'artisan') {
      // Artisan: keycaps with "artisan" in the name
      setFilteredProducts(baseProducts.filter(p => 
        p.category === 'keycaps' && 
        p.name?.toLowerCase().includes('artisan')
      ));
    } else if (category === 'accessories') {
      // Accessories: carrying cases, deskmats, cables, etc.
      setFilteredProducts(baseProducts.filter(p => {
        const name = p.name?.toLowerCase() || '';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
        const cat = p.category || '';
        // Carrying cases
        const isCarryingCase = name.includes('carrying case') || 
                               name.includes('travel case') ||
                               name.includes('keyboard bag');
        // Other accessories (if they exist)
        const isAccessory = name.includes('cable') || 
                           name.includes('deskmat') || 
                           name.includes('wrist rest') ||
                           name.includes('keycap puller') ||
                           name.includes('switch puller') ||
                           name.includes('lube') ||
                           name.includes('foam');
        return isCarryingCase || isAccessory;
      }));
    } else {
      // Other categories (switches, keycaps, case) - use exact match
      setFilteredProducts(baseProducts.filter(p => p.category === category));
    }
    setDisplayLimit(12);
  };

  const handleWizardFilter = (filtered: Product[]) => {
    setWizardFilters(filtered);
    setFilteredProducts(filtered);
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
      case 'name-az':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-za':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'newest':
      default:
        return sorted.sort((a, b) => {
          const dateA = a.scrapedAt ? new Date(a.scrapedAt).getTime() : 0;
          const dateB = b.scrapedAt ? new Date(b.scrapedAt).getTime() : 0;
          return dateB - dateA;
        });
    }
  };

  const displayedProducts = sortProducts(filteredProducts).slice(0, displayLimit);
  const hasMore = filteredProducts.length > displayLimit;

  // Route to page components
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
  if (currentPath === '/learn/best-gaming' || currentPath === '/gaming') {
    return <BestGamingGuide />;
  }
  if (currentPath === ('/learn/best-60-percent' || currentPath === '/best-60-percent')) {
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
  if (currentPath === '/learn/best-75-percent') {
    return <Best75PercentGuide />;
  }
  if (currentPath === '/learn/keycap-profiles') {
    return <KeycapProfilesGuide />;
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
      </div>

      <div className="controls-row">
        <div className="filter-chips">
          {['all', 'keyboard', 'switches', 'keycaps', 'artisan', 'case', 'accessories'].map(cat => (
            <button
              key={cat}
              className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
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
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
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
          >
            <div className="product-image">
              {product.image ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <div className="no-image">No Image</div>
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
          <button onClick={loadMore}>
            Load More ({filteredProducts.length - displayLimit} remaining)
          </button>
        </div>
      )}

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <Wizard
        products={products}
        onFilterChange={handleWizardFilter}
      />
    </Layout>
  );
}
