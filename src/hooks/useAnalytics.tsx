import { useCallback } from 'react';

// Extend Window interface for analytics functions
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    trackAffiliateClick?: (product: string, vendor: string, category: string, price: string) => void;
    trackProductView?: (product: string | object, vendor: string, category: string) => void;
    trackSearch?: (query: string, resultCount: number) => void;
    trackVendorFilter?: (vendor: string) => void;
  }
}

interface AnalyticsData {
  product?: string;
  vendor?: string;
  category?: string;
  price?: string;
  confidence?: number;
  timestamp?: string;
  exitPrice?: number | null;
  pnlPercent?: number;
  pnlUsd?: number;
  reason?: string;
}

interface TrackClickParams {
  product: string;
  vendor: string;
  category: string;
  price: string;
}

function hasNameProperty(obj: unknown): obj is { name: string } {
  return typeof obj === 'object' && obj !== null && 'name' in obj && typeof (obj as Record<string, unknown>).name === 'string';
}

export function useAnalytics() {
  const trackClick = useCallback(({ product, vendor, category, price }: TrackClickParams): void => {
    if (typeof window === 'undefined') return;

    const productName = hasNameProperty(product) ? product.name : String(product);

    if (window.gtag) {
      window.gtag('event', 'affiliate_click', {
        event_category: 'engagement',
        event_label: `${vendor} - ${productName}`,
        vendor,
        product_name: productName,
        product_category: category,
        price_range: price,
        value: parseFloat(price) || 0,
        currency: 'USD'
      });
    }

    if (window.trackAffiliateClick) {
      window.trackAffiliateClick(productName, vendor, category, price);
    }

    try {
      fetch('/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'click',
          product: productName,
          vendor,
          category,
          price
        })
      }).catch(() => {});
    } catch (e) {}
  }, []);

const trackView = useCallback((product: string | object, vendor: string, category: string): void => {
    if (typeof window === 'undefined') return;

    const productName = hasNameProperty(product) ? product.name : String(product);

    if (window.gtag) {
      window.gtag('event', 'product_view', {
        event_category: 'engagement',
        vendor: vendor,
        product_name: productName,
        product_category: category
      });
    }

    if (window.trackProductView) {
      window.trackProductView(product, vendor, category);
    }
  }, []);

  const trackSearch = useCallback((query: string, resultCount: number): void => {
    if (typeof window === 'undefined') return;

    if (window.gtag) {
      window.gtag('event', 'search', {
        event_category: 'engagement',
        search_term: query,
        result_count: resultCount
      });
    }

    if (window.trackSearch) {
      window.trackSearch(query, resultCount);
    }
  }, []);

  const trackVendorFilter = useCallback((vendor: string): void => {
    if (typeof window === 'undefined') return;

    if (window.gtag) {
      window.gtag('event', 'vendor_filter', {
        event_category: 'engagement',
        event_label: vendor,
        vendor: vendor
      });
    }

    if (window.trackVendorFilter) {
      window.trackVendorFilter(vendor);
    }
  }, []);

  const trackCategoryFilter = useCallback((category: string): void => {
    if (typeof window === 'undefined') return;

    if (window.gtag) {
      window.gtag('event', 'category_filter', {
        event_category: 'engagement',
        event_label: category,
        category: category
      });
    }
  }, []);

  const trackPageView = useCallback((page: string): void => {
    if (typeof window === 'undefined') return;

    if (window.gtag) {
      window.gtag('config', 'G-SWITCHYARD', {
        page_path: page
      });
    }
  }, []);

  return {
    trackClick,
    trackView,
    trackSearch,
    trackVendorFilter,
    trackCategoryFilter,
    trackPageView
  };
}

export default useAnalytics;
