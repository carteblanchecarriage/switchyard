import React, { useState, useEffect } from 'react';
import './App.css';

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

const categories = [
  { id: 'all', label: 'All Products' },
  { id: 'keyboard', label: 'Keyboards' },
  { id: 'switches', label: 'Switches' },
  { id: 'keycaps', label: 'Keycaps' },
  { id: 'artisan', label: 'Artisan' },
  { id: 'case', label: 'Cases' },
];

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayLimit, setDisplayLimit] = useState(12);

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
      setFilteredProducts(products.filter(p => p.category === category));
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
      <header className="header">
        <div className="logo">
          <h1>Switchyard</h1>
          <span>Mechanical Keyboard Tracker</span>
        </div>
        <nav className="nav">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={activeCategory === cat.id ? 'active' : ''}
              onClick={() => handleCategoryChange(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="main">
        <div className="stats">
          {filteredProducts.length} products
        </div>

        <div className="product-grid">
          {displayedProducts.map(product => (
            <div key={product.id} className="product-card">
              <a href={product.url} target="_blank" rel="noopener noreferrer">
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
              </a>
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
    </div>
  );
}

export default App;