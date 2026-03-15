import React, { useState, useEffect, useCallback } from 'react';
import { KeyboardProduct } from '../types/keyboard';

interface BlogProductCardProps {
  productName: string;
  vendor?: string;
  description?: string;
  features?: string[];
  ctaText?: string;
}

// Cache for product data
let productsData: KeyboardProduct[] | null = null;
let dataLoading = false;
let dataCallbacks: ((products: KeyboardProduct[]) => void)[] = [];

async function loadProducts(): Promise<KeyboardProduct[]> {
  if (productsData) return productsData;
  if (dataLoading) {
    return new Promise((resolve) => {
      dataCallbacks.push(resolve);
    });
  }
  
  dataLoading = true;
  try {
    const response = await fetch('/data.json');
    const data = await response.json();
    productsData = data.allProducts || [];
    dataCallbacks.forEach(cb => cb(productsData || []));
    dataCallbacks = [];
    return productsData || [];
  } catch (error) {
    console.error('Failed to load product data:', error);
    return [];
  } finally {
    dataLoading = false;
  }
}

function findMatchingProduct(name: string, products: KeyboardProduct[]): KeyboardProduct | null {
  const term = name.toLowerCase();
  const words = term.split(/\s+/).filter(w => w.length > 2);
  
  // Try exact match first
  let match = products.find(p => 
    p.name?.toLowerCase() === term
  );
  if (match) return match;
  
  // Try contains match
  match = products.find(p =>
    p.name?.toLowerCase().includes(term)
  );
  if (match) return match;
  
  // Try word-by-word match (at least 2 words)
  const candidates = products.filter(p => {
    const nameLower = p.name?.toLowerCase() || '';
    const matchingWords = words.filter(w => nameLower.includes(w)).length;
    return matchingWords >= Math.min(2, words.length);
  });
  
  if (candidates.length > 0) {
    // Return the one with most matching words, preferring keyboards
    candidates.sort((a, b) => {
      const aMatch = words.filter(w => a.name?.toLowerCase().includes(w)).length;
      const bMatch = words.filter(w => b.name?.toLowerCase().includes(w)).length;
      const aIsKeyboard = a.category === 'keyboard' ? 1 : 0;
      const bIsKeyboard = b.category === 'keyboard' ? 1 : 0;
      return (bMatch + bIsKeyboard) - (aMatch + aIsKeyboard);
    });
    return candidates[0];
  }
  
  return null;
}

function getVendorLink(vendorName: string): string {
  const links: Record<string, string> = {
    keychron: 'https://keychron.com?ref=switchyard',
    epomaker: 'https://epomaker.com?sca_ref=10691179.cOO0hJ6jvi',
    novelkeys: 'https://novelkeys.com?ref=switchyard',
    kbdfans: 'https://kbdfans.com?ref=switchyard',
    drop: 'https://drop.com?referer=switchyard',
    glorious: 'https://www.pcgamingrace.com?ref=switchyard',
    cannonkeys: 'https://cannonkeys.com?ref=switchyard',
    divinikey: 'https://divinikey.com?ref=switchyard',
    boardsource: 'https://boardsource.xyz?ref=switchyard',
    qwerkywriter: 'https://qwerkywriter.com?sca_ref=10713146.AiDf5cQpby',
    amazon: 'https://www.amazon.com?tag=switchyard-20',
  };
  return links[vendorName.toLowerCase()] || '#';
}

/**
 * Blog Product Card Component
 * 
 * Displays a product card in blog posts. Matches to real product in data.json.
 * Shows modal with details if found, otherwise links to vendor.
 * 
 * Usage:
 * <BlogProductCard 
 *   productName="Keychron V1"
 *   description="Best 75% gasket mount"
 *   features={["Gasket mount", "QMK/VIA", "Wireless"]}
 * />
 */
export default function BlogProductCard({
  productName,
  vendor,
  description,
  features = [],
  ctaText = "Check Price"
}: BlogProductCardProps) {
  const [product, setProduct] = useState<KeyboardProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    let isMounted = true;
    
    async function findProduct() {
      const products = await loadProducts();
      if (!isMounted) return;
      
      const matched = findMatchingProduct(productName, products);
      setProduct(matched);
      setLoading(false);
    }
    
    findProduct();
    
    return () => { isMounted = false; };
  }, [productName]);
  
  const handleClick = useCallback(() => {
    if (product) {
      setShowModal(true);
    } else if (vendor) {
      window.open(getVendorLink(vendor), '_blank', 'noopener,noreferrer');
    }
  }, [product, vendor]);
  
  const handleBuyNow = useCallback(() => {
    let url = product?.affiliateUrl || product?.url;
    if (!url) return;
    // Append Amazon Associates tag if not already present
    if (url.includes('amazon.com') && !url.includes('tag=')) {
      url += (url.includes('?') ? '&' : '?') + 'tag=switchyard-20';
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [product]);
  
  const displayName = product?.name || productName;
  const displayVendor = product?.vendor || vendor;
  const image = product?.image;
  const price = product?.price;
  const featuresText = description || features.join(' • ');
  
  return (
    <>
      <div 
        className="product-card blog-product-card" 
        onClick={handleClick}
        role="button" 
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      >
        <div 
          className="product-card-image" 
          style={{ background: image ? `url(${image}) center/cover` : '#f0f0f0' }}
        >
          {!image && (
            <span className="no-image-text">{displayVendor || 'Product'}</span>
          )}
        </div>
        
        <div className="product-card-info">
          {displayVendor && (
            <span className="vendor-badge">{displayVendor}</span>
          )}
          
          <h4 className="product-name">{displayName}</h4>
          
          {price && <span className="price">{price}</span>}
          
          {featuresText && <p className="features-text">{featuresText}</p>}
          
          <button className="cta-button">
            {loading ? 'Loading...' : ctaText}
          </button>
        </div>
      </div>
      
      {showModal && product && (
        <div className="blog-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="blog-modal" onClick={e => e.stopPropagation()}>
            <button 
              className="modal-close" 
              onClick={() => setShowModal(false)}
              aria-label="Close modal"
            >
              ×
            </button>
            
            <div className="modal-grid">
              <div className="modal-image">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>
              
              <div className="modal-details">
                <span className="modal-vendor">{product.vendor}</span>
                <h3>{product.name}</h3>
                {product.price && <span className="modal-price">{product.price}</span>}
                {product.description && <p className="modal-description">{product.description}</p>}
                
                <button className="modal-buy-button" onClick={handleBuyNow}>
                  Buy Now
                </button>
                
                <button 
                  className="modal-close-btn"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}