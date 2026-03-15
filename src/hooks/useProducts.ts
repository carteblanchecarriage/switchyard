import { useState, useEffect } from 'react';
import { KeyboardProduct } from '../types/keyboard';
import { sortByAffiliatePriority } from '../config';

export function useProducts() {
  const [products, setProducts] = useState<KeyboardProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cacheBuster = Date.now();
    fetch(`https://raw.githubusercontent.com/carteblanchecarriage/switchyard/master/public/data.json?v=${cacheBuster}`)
      .then(res => res.json())
      .then(data => {
        const allProducts: KeyboardProduct[] = data.allProducts || data.items || [];
        setProducts(sortByAffiliatePriority(allProducts));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading products:', err);
        setError('Failed to load products');
        setLoading(false);
      });
  }, []);

  return { products, loading, error };
}
