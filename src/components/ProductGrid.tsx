import React from 'react';
import { OptimizedProductCard } from './OptimizedProductCard';
import { KeyboardProduct } from '../types/keyboard';

interface ProductGridProps {
  products: KeyboardProduct[];
  hasMore: boolean;
  onLoadMore: () => void;
  onProductClick: (product: KeyboardProduct) => void;
}

export default function ProductGrid({ products, hasMore, onLoadMore, onProductClick }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <h2>No products found</h2>
        <p>Try adjusting your filters to see more results.</p>
      </div>
    );
  }

  return (
    <div className="product-grid-container">
      <div className="product-grid">
        {products.map(product => (
          <OptimizedProductCard
            key={product.id}
            product={product}
            onClick={onProductClick}
          />
        ))}
      </div>

      {hasMore && (
        <div className="load-more">
          <button onClick={onLoadMore} className="load-more-button">
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
