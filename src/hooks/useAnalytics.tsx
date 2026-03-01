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
  query?: string;
  resultCount?: number;
  page?: string;
  referrer?: string;
}

interface TrackClickParams {
  product: string | object;
  vendor: string;
  category: string;
  price: string;
}

// Worker endpoint configuration
// In production, set this via environment variable or config
const ANALYTICS_WORKER_URL = process.env.REACT_APP_ANALYTICS_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:3456' 
    : 'https://YOUR_WORKER_URL.workers.dev');

function hasNameProperty(obj: unknown): obj is { name: string } {
  return typeof obj === 'object' && obj !== null && 'name' in obj && typeof (obj as Record<string, unknown>).name === 'string';
}

/**
 * Send analytics event to Cloudflare Worker
 * Falls back silently on error (don't break user experience)
 */
async function sendToWorker(data: AnalyticsData & { type: string }) {
  try {
    const response = await fetch(`${ANALYTICS_WORKER_URL}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
        referrer: document.referrer
      })
    });
    
    if (!response.ok) {
      console.warn('Analytics worker error:', response.status);
    }
  } catch (e) {
    // Silent fail - don't break user experience for analytics
    if (process.env.NODE_ENV === 'development') {
      console.warn('Analytics error:', e);
    }
  }
}

export function useAnalytics() {
  const trackClick = useCallback(({ product, vendor, category, price }: TrackClickParams): void => {
    if (typeof window === 'undefined') return;

    const productName = hasNameProperty(product) ? product.name : String(product);

    // Google Analytics 4
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

    // Legacy callback (for backward compatibility)
    if (window.trackAffiliateClick) {
      window.trackAffiliateClick(productName, vendor, category, price);
    }

    // Cloudflare Worker
    sendToWorker({
      type: 'affiliate_click',
      product: productName,
      vendor,
      category,
      price
    });
  }, []);

  const trackView = useCallback((product: string | object, vendor: string, category: string, price?: string): void => {
    if (typeof window === 'undefined') return;

    const productName = hasNameProperty(product) ? product.name : String(product);

    if (window.gtag) {
      window.gtag('event', 'product_view', {
        event_category: 'engagement',
        vendor: vendor,
        product_name: productName,
        product_category: category,
        price_range: price,
        value: parseFloat(price || '0') || 0,
        currency: 'USD'
      });
    }

    if (window.trackProductView) {
      window.trackProductView(product, vendor, category);
    }

    // Cloudflare Worker
    sendToWorker({
      type: 'view',
      product: productName,
      vendor,
      category,
      price
    });
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

    // Cloudflare Worker
    sendToWorker({
      type: 'search',
      query,
      resultCount
    });
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

    // Cloudflare Worker
    sendToWorker({
      type: 'vendor_filter',
      vendor
    });
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

    // Cloudflare Worker
    sendToWorker({
      type: 'category_filter',
      category
    });
  }, []);

  const trackPageView = useCallback((page: string): void => {
    if (typeof window === 'undefined') return;

    if (window.gtag) {
      window.gtag('config', 'G-SWITCHYARD', {
        page_path: page
      });
    }

    // Cloudflare Worker - page view event
    sendToWorker({
      type: 'pageview',
      page
    });
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
