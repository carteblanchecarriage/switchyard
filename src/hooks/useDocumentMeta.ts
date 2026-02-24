import { useEffect } from 'react';

interface MetaOptions {
  title?: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  noIndex?: boolean;
}

export function useDocumentMeta(options: MetaOptions = {}) {
  const {
    title = 'Switchyard | Mechanical Keyboard Tracker',
    description = 'Track mechanical keyboard group buys, in-stock drops, and vendors. Find your perfect keyboard with Switchyard.',
    canonical,
    ogTitle,
    ogDescription,
    ogImage = 'https://switchyard.app/og-image.png',
    ogType = 'website',
    twitterCard = 'summary_large_image',
    noIndex = false
  } = options;

  useEffect(() => {
    // Update title
    document.title = title;

    // Update or create meta description
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    // Update canonical
    if (canonical) {
      let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.href = canonical;
    }

    // Open Graph
    const ogTitleTag = ensureMetaProperty('og:title');
    ogTitleTag.content = ogTitle || title;

    const ogDescTag = ensureMetaProperty('og:description');
    ogDescTag.content = ogDescription || description;

    const ogImageTag = ensureMetaProperty('og:image');
    ogImageTag.content = ogImage;

    const ogTypeTag = ensureMetaProperty('og:type');
    ogTypeTag.content = ogType;

    // Twitter
    const twitterCardTag = ensureMetaName('twitter:card');
    twitterCardTag.content = twitterCard;

    const twitterTitleTag = ensureMetaName('twitter:title');
    twitterTitleTag.content = ogTitle || title;

    const twitterDescTag = ensureMetaName('twitter:description');
    twitterDescTag.content = ogDescription || description;

    const twitterImageTag = ensureMetaName('twitter:image');
    twitterImageTag.content = ogImage;

    // Robots tag for noIndex
    if (noIndex) {
      let robotsTag = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
      if (!robotsTag) {
        robotsTag = document.createElement('meta');
        robotsTag.setAttribute('name', 'robots');
        document.head.appendChild(robotsTag);
      }
      robotsTag.content = 'noindex, nofollow';
    }

    return () => {
      // Optional cleanup - could remove dynamically added tags
      // Keeping them is generally fine for SPAs
    };
  }, [title, description, canonical, ogTitle, ogDescription, ogImage, ogType, twitterCard, noIndex]);
}

function ensureMetaProperty(property: string): HTMLMetaElement {
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  return meta;
}

function ensureMetaName(name: string): HTMLMetaElement {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }
  return meta;
}

export default useDocumentMeta;
