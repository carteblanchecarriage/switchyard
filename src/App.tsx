import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductModal from './components/ProductModal';
import Wizard from './components/Wizard';
import SwitchGuide from './pages/SwitchGuide';
import BeginnersGuide from './pages/BeginnersGuide';
import Glossary from './pages/Glossary';

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

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (currentPath === '/switch-guide') {
    return <SwitchGuide />;
  }
  if (currentPath === '/beginners-guide') {
    return <BeginnersGuide />;
  }
  if (currentPath === '/glossary') {
    return <Glossary />;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayLimit, setDisplayLimit] = useState(12);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
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
  }, []);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (category === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => 
        p.category === category ||
        (category === 'keyboard' && (!p.category || p.category === 'keyboard'))
      ));
    }
    setDisplayLimit(12);
  };

  const loadMore = () => {
    setDisplayLimit(prev => prev + 12);
  };

  const displayedProducts = filteredProducts.slice(0, displayLimit);
  const hasMore = filteredProducts.length > displayLimit;

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="App">
      <Header />
      <main className="main">
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
      </main>

      <Footer />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <Wizard
        products={filteredProducts}
        onFilterChange={setFilteredProducts}
      />
    </div>
  );
}
