import React, { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import Layout from '../components/Layout';
import SEOHead from '../components/SEOHead';
import ProductGrid from '../components/ProductGrid';
import ProductModal from '../components/ProductModal';
import Wizard, { WizardState } from '../components/Wizard';
import { useProductFilters } from '../hooks/useProductFilters';
import { KeyboardProduct } from '../types/keyboard';
import { sortByAffiliatePriority } from '../config';

type Product = KeyboardProduct & { type?: string; size?: string };

const CATEGORIES = ['all', 'keyboard', 'switches', 'keycaps', 'artisan', 'accessories'];

interface HomeProps {
  initialProducts: Product[];
}

export default function Home({ initialProducts }: HomeProps) {
  const [allProducts, setAllProducts] = useState<Product[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [wizardFilters, setWizardFilters] = useState<Product[] | null>(null);
  const [wizardSelections, setWizardSelections] = useState<WizardState | null>(null);

  // Client-side: fetch full dataset (initial props only contain first page for fast SSR)
  useEffect(() => {
    fetch('/data.json')
      .then(r => r.json())
      .then(data => {
        const full: Product[] = data.allProducts || data.items || [];
        setAllProducts(sortByAffiliatePriority(full));
      })
      .catch(() => {}); // silently fall back to initialProducts
  }, []);

  const {
    filteredProducts,
    displayedProducts,
    hasMore,
    activeCategory,
    searchQuery,
    sortBy,
    setSortBy,
    handleCategoryChange,
    handleSearchChange,
    clearSearch,
    loadMore,
  } = useProductFilters(allProducts, wizardFilters);

  const handleWizardFilter = (filtered: Product[], selections: WizardState) => {
    setWizardFilters(filtered);
    setWizardSelections(selections);
  };

  const getPageTitle = () => {
    if (searchQuery) return `"${searchQuery}" | Search Results - Switchyard`;
    if (activeCategory === 'all') return 'Switchyard | Browse In-Stock Mechanical Keyboards & Keycaps';
    return `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} | Switchyard`;
  };

  const getPageDescription = () => {
    if (searchQuery) return `Search results for "${searchQuery}" — ${filteredProducts.length} products found`;
    if (activeCategory === 'all') return `Browse ${initialProducts.length}+ in-stock mechanical keyboards, keycaps, switches, and accessories. Live inventory tracking from Drop, Keychron, NovelKeys, and more.`;
    return `Shop ${filteredProducts.length}+ ${activeCategory} keyboards and accessories. Track availability and compare prices. Updated daily.`;
  };

  return (
    <Layout>
      <SEOHead
        title={getPageTitle()}
        description={getPageDescription()}
        keywords={`mechanical keyboards, ${activeCategory}, keyboard tracker, group buys, keycaps, switches, Drop, Keychron, GMK`}
        canonical="/"
      />

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

      {/* Filters & Sort */}
      <div className="controls-row">
        <div className="filter-chips">
          {CATEGORIES.map(cat => (
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
            onChange={e => setSortBy(e.target.value)}
            className="sort-select"
            aria-label="Sort products"
          >
            <option value="affiliate">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="size-small">Size: Small to Large</option>
            <option value="size-large">Size: Large to Small</option>
            <option value="name-az">Name: A-Z</option>
            <option value="name-za">Name: Z-A</option>
          </select>
        </div>
      </div>

      <ProductGrid
        products={displayedProducts}
        hasMore={hasMore}
        onLoadMore={loadMore}
        onProductClick={p => setSelectedProduct(p as Product)}
      />

      {filteredProducts.length === 0 && (
        <div className="no-results">
          <p>No products found{searchQuery ? ` matching "${searchQuery}"` : ''}.</p>
          {searchQuery && <button onClick={clearSearch}>Clear Search</button>}
        </div>
      )}

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <Wizard
        products={allProducts}
        onFilterChange={handleWizardFilter}
        activeFilters={wizardSelections}
      />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    const products: Product[] = data.allProducts || data.items || [];
    const sorted = sortByAffiliatePriority(products);
    // Pass only first 48 for fast static render; client fetches full set via useEffect
    return {
      props: { initialProducts: sorted.slice(0, 48) },
    };
  } catch {
    return {
      props: { initialProducts: [] },
    };
  }
};
