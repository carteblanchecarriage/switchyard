import React, { memo } from 'react';
import { useOnScreen } from '../hooks/useViewport';
import { KeyboardProduct } from '../types/keyboard';

interface ProductCardProps {
  product: KeyboardProduct;
  onClick: (product: KeyboardProduct) => void;
}

/**
 * OptimizedProductCard - Memoized card with lazy image loading
 * Prevents unnecessary re-renders when parent updates
 * Uses IntersectionObserver for efficient image loading
 */
export const OptimizedProductCard = memo(function ProductCard({
  product,
  onClick,
}: ProductCardProps) {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });

  const displayPrice = product.price 
    ? `$${product.price}` 
    : 'Price not available';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(product);
    }
  };

  return (
    <article
      ref={ref}
      className="product-card"
      onClick={() => onClick(product)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${product.name} - ${displayPrice}`}
    >
      <div className="product-image" aria-label="Product image" role="img">
        {isVisible ? (
          <img
            src={product.image || '/placeholder-keyboard.png'}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-keyboard.png';
            }}
          />
        ) : (
          <div className="product-image-placeholder" />
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        {product.vendor && (
          <p className="product-vendor">{product.vendor}</p>
        )}
        <p className="product-price">{displayPrice}</p>
        
        {product.category && (
          <span className="product-category">{product.category}</span>
        )}
      </div>
    </article>
  );
});

export default OptimizedProductCard;
