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
  canonicalUrl?: string; // Add canonical URL support
}

const PageSEO: React.FC<PageSEOProps> = ({
  title,
  description,
  keywords = [],
  pageType = 'website',
  imageUrl = 'https://editorvault.web.app/og-image.png',
  noIndex = false,
  structuredData,
  breadcrumbs = [],
  canonicalUrl
}) => {
  const fullTitle = title.includes('EditorVault')
    ? title
    : `${title} | EditorVault`;

  const currentUrl = window.location.href;

  // Generate canonical URL - remove trailing slash and query params for consistency
  const generateCanonicalUrl = () => {
    if (canonicalUrl) return canonicalUrl;
    const url = new URL(currentUrl);
    // Remove trailing slash
    let pathname = url.pathname;
    if (pathname.endsWith('/') && pathname.length > 1) {
      pathname = pathname.slice(0, -1);
    }
    return `${url.origin}${pathname}`;
  };

  const finalCanonicalUrl = generateCanonicalUrl();

  // Use only specific keywords to avoid stuffing
  const seoKeywords = keywords.length > 0 ? keywords.join(', ') : 'video editing assets, thumbnail maker, free overlays';

  useEffect(() => {
    // Update document head
    document.title = fullTitle;

    // Add/Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', finalCanonicalUrl);

    // Add preconnect for CDN and external resources (performance optimization)
    const addPreconnect = (href: string, crossorigin: boolean = false) => {
      let link = document.querySelector(`link[rel="preconnect"][href="${href}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'preconnect');
        link.setAttribute('href', href);
        if (crossorigin) link.setAttribute('crossorigin', 'anonymous');
        document.head.appendChild(link);
      }
    };

    addPreconnect('https://cdn.jsdelivr.net', true);
    addPreconnect('https://fonts.googleapis.com');
    addPreconnect('https://fonts.gstatic.com', true);

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

    // Open Graph (use canonical URL for consistency)
    updateMeta('og:type', pageType, true);
    updateMeta('og:url', finalCanonicalUrl, true);
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:image', imageUrl, true);
    updateMeta('og:image:width', '1200', true);
    updateMeta('og:image:height', '630', true);
    updateMeta('og:site_name', 'EditorVault', true);
    updateMeta('og:locale', 'en_US', true);

    // Article-specific OG tags (for better SEO on articles)
    if (pageType === 'article' && structuredData) {
      // If array, find the BlogPosting or Article
      const articleData = Array.isArray(structuredData)
        ? structuredData.find((d: any) => d['@type'] === 'BlogPosting' || d['@type'] === 'Article')
        : structuredData;

      if (articleData) {
        if (articleData.datePublished) {
          updateMeta('article:published_time', articleData.datePublished, true);
        }
        if (articleData.dateModified) {
          updateMeta('article:modified_time', articleData.dateModified, true);
        }
        if (articleData.author && articleData.author[0]) {
          updateMeta('article:author', articleData.author[0].name, true);
        }
        if (articleData.keywords) {
          // Split keywords and add as multiple article:tag
          const tags = articleData.keywords.split(',').map((t: string) => t.trim()).slice(0, 5);
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
      if (Array.isArray(structuredData)) {
        structuredData.forEach(data => addScript(data));
      } else {
        addScript(structuredData);
      }
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

    // 3. Organization Structured Data (global, appears on all pages)
    const organizationData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "EditorVault",
      "url": "https://editorvault.web.app",
      "logo": "https://editorvault.web.app/logo512.png",
      "sameAs": [
        "https://twitter.com/EditorVault",
        "https://www.facebook.com/EditorVault",
        "https://www.instagram.com/EditorVault"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "url": "https://editorvault.web.app/contact"
      }
    };
    addScript(organizationData);

    // 4. WebSite Structured Data with Search Action
    if (pageType === 'website') {
      const websiteData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "EditorVault",
        "url": "https://editorvault.web.app",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://editorvault.web.app/store?search={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      };
      addScript(websiteData);
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

