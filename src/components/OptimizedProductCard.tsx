import React, { memo } from 'react';
import { useOnScreen } from '../hooks/useViewport';
import { KeyboardProduct } from '../types/keyboard';

interface ProductCardProps {
  product: KeyboardProduct;
  onClick: (product: KeyboardProduct) => void;
}

const formatPrice = (price?: string) => {
  if (!price || price === 'N/A') return 'Check Price';
  return price.startsWith('$') ? price : `$${price}`;
};

export const OptimizedProductCard = memo(function OptimizedProductCard({
  product,
  onClick,
}: ProductCardProps) {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });

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
      aria-label={`View details for ${product.name} - ${formatPrice(product.price)}`}
    >
      <div className="product-image">
        {isVisible ? (
          <img
            src={product.image || '/placeholder-keyboard.png'}
            alt={`${product.name}${product.vendor ? ` - ${product.vendor}` : ''} mechanical keyboard`}
            loading="lazy"
            decoding="async"
            onError={e => {
              (e.target as HTMLImageElement).src = '/placeholder-keyboard.png';
            }}
          />
        ) : (
          <div className="product-image-placeholder" />
        )}
      </div>

      <div className="product-info">
        <div className="product-meta-row">
          {product.vendor && <span className="vendor">{product.vendor}</span>}
          {(product as any).size && <span className="size-badge">{(product as any).size}</span>}
        </div>
        <h3 className="name">{product.name}</h3>
        <span className="price">{formatPrice(product.price)}</span>
      </div>
    </article>
  );
});

export default OptimizedProductCard;
