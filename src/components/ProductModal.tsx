import React from 'react';
import { KeyboardProduct } from '../types/keyboard';

interface ProductModalProps {
  product: KeyboardProduct | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  if (!product) return null;

  const formatPrice = (price?: string) => {
    if (!price || price === 'N/A') return 'Check Price';
    return price.startsWith('$') ? price : `$${price}`;
  };

  // Generate descriptive alt text for accessibility and SEO
  const getImageAltText = (): string => {
    const parts = [product.name];
    if (product.vendor) parts.push(product.vendor);
    if (product.category && product.category !== 'keyboard') parts.push(product.category);
    if (product.price && product.price !== 'N/A') parts.push(product.price);
    parts.push('mechanical keyboard');
    return parts.join(' - ');
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <button 
          className="modal-close" 
          onClick={onClose}
          aria-label="Close product details modal"
        >
          ×
        </button>
        
        <div className="modal-body">
          <div className="modal-image">
            {product.image ? (
              <img 
                src={product.image} 
                alt={getImageAltText()}
              />
            ) : (
              <div className="no-image" role="img" aria-label="No product image available">No Image Available</div>
            )}
          </div>
          
          <div className="modal-info">
            <span className="modal-vendor">{product.vendor}</span>
            <h2 id="modal-title" className="modal-title">{product.name}</h2>
            
            <span className="modal-price">{formatPrice(product.price)}</span>
            
            <span className="modal-category">{product.category}</span>
            
            {product.description && (
              <p className="modal-description">{product.description}</p>
            )}
            
            <div className="modal-actions">
              <a
                href={(() => {
                  let url = product.affiliateUrl || product.url;
                  if (url?.includes('amazon.com') && !url.includes('tag=')) {
                    url += (url.includes('?') ? '&' : '?') + 'tag=switchyard-20';
                  }
                  return url;
                })()}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-buy-button"
                aria-label={`Buy ${product.name} from ${product.vendor || 'vendor'}`}
              >
                Buy Now
              </a>
              <button 
                onClick={onClose} 
                className="modal-close-button"
                aria-label="Continue browsing products"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
