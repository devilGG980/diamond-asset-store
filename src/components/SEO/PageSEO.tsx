import React from 'react';
import { Helmet } from 'react-helmet-async';

interface PageSEOProps {
  title: string;
  description: string;
  keywords?: string[];
  pageType?: 'website' | 'article' | 'product' | 'profile';
  imageUrl?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  structuredData?: any;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

const PageSEO: React.FC<PageSEOProps> = ({
  title,
  description,
  keywords = [],
  pageType = 'website',
  imageUrl = 'https://videoforges.web.app/og-image.jpg',
  canonicalUrl,
  noIndex = false,
  structuredData,
  breadcrumbs = []
}) => {
  const fullTitle = title.includes('Video Forge') ? title : `${title} | Video Forge - Free Video Editing Assets`;
  const currentUrl = canonicalUrl || `https://videoforges.web.app${window.location.pathname}`;
  
  // Enhanced keywords for better SEO
  const seoKeywords = [
    'free video editing assets',
    'video editing resources',
    'video transitions free',
    'video backgrounds free',
    'editing assets download',
    'YouTube video assets',
    'content creator resources',
    'premiere pro assets free',
    'after effects templates free',
    'video editing templates',
    'motion graphics free',
    'video effects free',
    'editing assets store',
    'professional video assets',
    'royalty free video assets',
    ...keywords
  ].join(', ');

  // Breadcrumb structured data
  const breadcrumbStructuredData = breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url.startsWith('http') ? crumb.url : `https://videoforges.web.app${crumb.url}`
    }))
  } : null;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="author" content="Video Forge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={pageType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Video Forge" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:creator" content="@VideoForge" />
      <meta name="twitter:site" content="@VideoForge" />
      
      {/* Additional SEO meta tags */}
      <meta name="theme-color" content="#6B46C1" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Language and region */}
      <meta name="language" content="English" />
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData, null, 2)}
        </script>
      )}
      
      {/* Breadcrumb structured data */}
      {breadcrumbStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbStructuredData, null, 2)}
        </script>
      )}
      
      {/* Preconnect for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
    </Helmet>
  );
};

export default PageSEO;