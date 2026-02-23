import React from 'react';
import './ProductModal.css';
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-body">
          <div className="modal-image">
            {product.image ? (
              <img src={product.image} alt={product.name} />
            ) : (
              <div className="no-image">No Image Available</div>
            )}
          </div>
          
          <div className="modal-info">
            <span className="modal-vendor">{product.vendor}</span>
            <h2 className="modal-title">{product.name}</h2>
            
            <span className="modal-price">{formatPrice(product.price)}</span>
            
            <span className="modal-category">{product.category}</span>
            
            {product.description && (
              <p className="modal-description">{product.description}</p>
            )}
            
            <div className="modal-actions">
              <a 
                href={product.affiliateUrl || product.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="modal-buy-button"
              >
                Buy Now
              </a>
              <button onClick={onClose} className="modal-close-button">
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
