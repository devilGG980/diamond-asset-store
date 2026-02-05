import React, { useEffect } from 'react';

interface PageSEOProps {
  title: string;
  description: string;
  keywords?: string[];
  pageType?: 'website' | 'article' | 'product' | 'profile';
  imageUrl?: string;
  noIndex?: boolean;
  structuredData?: any;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

const PageSEO: React.FC<PageSEOProps> = ({
  title,
  description,
  keywords = [],
  pageType = 'website',
  imageUrl = 'https://editorvault.web.app/og-image.png',
  noIndex = false,
  structuredData,
  breadcrumbs = []
}) => {
  const fullTitle = title.includes('EditorVault')
    ? title
    : `${title} | EditorVault`;

  const currentUrl = window.location.href;

  // Use only specific keywords to avoid stuffing
  const seoKeywords = keywords.length > 0 ? keywords.join(', ') : 'video editing assets, thumbnail maker, free overlays';

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
    updateMeta('author', 'EditorVault');
    updateMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // Open Graph
    updateMeta('og:type', pageType, true);
    updateMeta('og:url', currentUrl, true);
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:image', imageUrl, true);
    updateMeta('og:site_name', 'EditorVault', true);
    updateMeta('og:locale', 'en_US', true);

    // Article-specific OG tags (for better SEO on articles)
    if (pageType === 'article' && structuredData) {
      if (structuredData.datePublished) {
        updateMeta('article:published_time', structuredData.datePublished, true);
      }
      if (structuredData.dateModified) {
        updateMeta('article:modified_time', structuredData.dateModified, true);
      }
      if (structuredData.author && structuredData.author[0]) {
        updateMeta('article:author', structuredData.author[0].name, true);
      }
      if (structuredData.keywords) {
        // Split keywords and add as multiple article:tag
        const tags = structuredData.keywords.split(',').map((t: string) => t.trim()).slice(0, 5);
        tags.forEach((tag: string, index: number) => {
          let meta = document.querySelector(`meta[property="article:tag"][data-index="${index}"]`);
          if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', 'article:tag');
            meta.setAttribute('data-index', index.toString());
            document.head.appendChild(meta);
          }
          meta.setAttribute('content', tag);
        });
      }
    }

    // Twitter Card
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', imageUrl);
    updateMeta('twitter:creator', '@EditorVault');

    // Handle Structured Data
    const scripts: HTMLScriptElement[] = [];

    // Helper to add script
    const addScript = (data: any) => {
      const script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.textContent = JSON.stringify(data, null, 2);
      document.head.appendChild(script);
      scripts.push(script);
    };

    // 1. Primary Structured Data (from prop)
    if (structuredData) {
      addScript(structuredData);
    }

    // 2. Breadcrumbs Structured Data (if breadcrumbs exist and not already in structuredData)
    if (breadcrumbs.length > 0) {
      const breadcrumbData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": crumb.name,
          "item": crumb.url.startsWith('http') ? crumb.url : `https://editorvault.web.app${crumb.url}`
        }))
      };

      // Avoid adding duplicate breadcrumbs if the main structuredData is ALREADY a BreadcrumbList
      // or if it's a CollectionPage which might contain breadcrumbs (we trust the user passed it correctly in that case, 
      // but if they didn't, we add it separately. Google allows multiple JSON-LD blocks).
      // To be safe, if we see 'breadcrumb' key in structuredData, we assume it's handled.
      const hasBreadcrumbInMain = structuredData && (structuredData['@type'] === 'BreadcrumbList' || structuredData['breadcrumb']);

      if (!hasBreadcrumbInMain) {
        addScript(breadcrumbData);
      }
    }

    return () => {
      // Cleanup all added scripts
      scripts.forEach(script => {
        if (script.parentNode) script.remove();
      });
      // Legacy cleanup (just in case)
      const oldScript = document.querySelector('script[type="application/ld+json"]');
      if (oldScript && !scripts.includes(oldScript as HTMLScriptElement)) {
        // modifying this behavior: We only remove what we added to avoid removing static ones if any
        // But since we are likely the only ones adding dynamic LD-JSON, we should be careful.
        // For now, only removing what we track in `scripts` array is safer.
      }
    };
  }, [fullTitle, description, seoKeywords, currentUrl, title, imageUrl, pageType, noIndex, structuredData, breadcrumbs]);

  return null;
};

export default PageSEO;

