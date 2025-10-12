import React, { useEffect } from 'react';

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

  useEffect(() => {
    // Update document head
    document.title = fullTitle;
    
    // Update meta tags
    const updateMeta = (name: string, content: string, isProperty = false) => {
      let meta = document.querySelector(`meta[${isProperty ? 'property' : 'name'}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMeta('description', description);
    updateMeta('keywords', seoKeywords);
    updateMeta('author', 'Video Forge');
    updateMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    
    // Open Graph
    updateMeta('og:type', pageType, true);
    updateMeta('og:url', currentUrl, true);
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:image', imageUrl, true);
    updateMeta('og:site_name', 'Video Forge', true);
    
    // Twitter Card
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', imageUrl);
    
    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);
    
    // Structured data
    if (structuredData) {
      let structuredDataScript = document.querySelector('script[type="application/ld+json"]');
      if (!structuredDataScript) {
        structuredDataScript = document.createElement('script');
        structuredDataScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(structuredDataScript);
      }
      structuredDataScript.textContent = JSON.stringify(structuredData, null, 2);
    }
  }, [fullTitle, description, seoKeywords, currentUrl, title, imageUrl, pageType, noIndex, structuredData]);

  return null;
};

export default PageSEO;