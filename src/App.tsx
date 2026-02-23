import React, { useState, useEffect } from 'react';
import './App.css';
import Layout from './components/Layout';
import ProductModal from './components/ProductModal';
import Wizard from './components/Wizard';

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

interface Product {
  id: string;
  name: string;
  url: string;
  image?: string;
  price?: string;
  vendor?: string;
  category?: string;
  description?: string;
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
    
    fetch('/data.json')
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

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    const baseProducts = wizardFilters || products;
    if (category === 'all') {
      setFilteredProducts(baseProducts);
    } else {
      setFilteredProducts(baseProducts.filter(p => 
        p.category === category ||
        (category === 'keyboard' && (!p.category || p.category === 'keyboard'))
      ));
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

  const displayedProducts = filteredProducts.slice(0, displayLimit);
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

      <div className="filter-chips">
        {['all', 'keyboard', 'switches', 'keycaps', 'artisan', 'case'].map(cat => (
          <button
            key={cat}
            className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat === 'all' ? 'All Products' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
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
