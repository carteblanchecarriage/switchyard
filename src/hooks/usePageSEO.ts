import { useEffect } from 'react';

interface SEOConfig {
  title: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
}

const defaultConfig: SEOConfig = {
  title: 'Switchyard | Mechanical Keyboard Tracker',
  description: 'Track mechanical keyboard group buys, in-stock drops, and vendors. Find your perfect keyboard with Switchyard.',
  keywords: 'mechanical keyboards, keyboard tracker, group buys, keycaps, switches, keyboard vendors, custom keyboards',
  ogType: 'website',
  ogImage: 'https://carteblanchecarriage.github.io/switchyard/og-image.png'
};

export function usePageSEO(config: Partial<SEOConfig> = {}) {
  const { title, description, keywords, canonical, ogImage, ogType } = { ...defaultConfig, ...config };

  useEffect(() => {
    // Update title
    document.title = title;

    // Update or create meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description || defaultConfig.description!);

    // Update or create meta keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords);
    }

    // Update or create canonical link
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonical);
    }

    // Update Open Graph title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }

    // Update Open Graph description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', description || defaultConfig.description!);
    }

    // Update Open Graph type
    let ogTypeTag = document.querySelector('meta[property="og:type"]');
    if (ogTypeTag) {
      ogTypeTag.setAttribute('content', ogType || defaultConfig.ogType!);
    }

    // Update Open Graph image
    let ogImageTag = document.querySelector('meta[property="og:image"]');
    if (ogImageTag) {
      ogImageTag.setAttribute('content', ogImage || defaultConfig.ogImage!);
    }

    // Update Twitter title
    let twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', title);
    }

    // Update Twitter description
    let twitterDesc = document.querySelector('meta[property="twitter:description"]');
    if (twitterDesc) {
      twitterDesc.setAttribute('content', description || defaultConfig.description!);
    }

    // Update Twitter image
    let twitterImage = document.querySelector('meta[property="twitter:image"]');
    if (twitterImage) {
      twitterImage.setAttribute('content', ogImage || defaultConfig.ogImage!);
    }

    // Cleanup function to reset meta tags to defaults when component unmounts
    return () => {
      document.title = defaultConfig.title;
    };
  }, [title, description, keywords, canonical, ogImage, ogType]);
}

export default usePageSEO;
