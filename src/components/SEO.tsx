import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  pathname?: string;
  image?: string;
  type?: 'website' | 'article';
}

export default function SEO({ 
  title, 
  description, 
  pathname = '', 
  image = 'https://switchyard.app/logo512.png',
  type = 'article'
}: SEOProps) {
  const siteUrl = 'https://switchyard.app';
  const canonical = `${siteUrl}${pathname}`;
  const fullTitle = title.includes('Switchyard') ? title : `${title} | Switchyard`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={type} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
