import React, { useEffect } from 'react';

interface AssetSEOProps {
  title: string;
  description: string;
  category: string;
  price: number;
  imageUrl?: string;
  videoUrl?: string;
  downloadUrl?: string;
  assetId: string;
  tags?: string[];
  compatibility?: string[];
}

const AssetSEO: React.FC<AssetSEOProps> = ({
  title,
  description,
  category,
  price,
  imageUrl,
  videoUrl,
  downloadUrl,
  assetId,
  tags = [],
  compatibility = []
}) => {
  const pageTitle = `${title} - Free Video Editing Asset | EditorVault`;
  const pageDescription = `Download ${title} - professional ${category.toLowerCase()} for video editing. ${description} Compatible with Premiere Pro, After Effects, Final Cut Pro. Free editing asset for YouTube creators.`;
  const pageUrl = `https://editorvault.web.app/asset/${assetId}`;

  const schemaMarkup: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": title,
    "description": pageDescription,
    "category": `Video Editing ${category}`,
    "brand": {
      "@type": "Brand",
      "name": "EditorVault"
    },
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "EditorVault"
      }
    },
    "image": imageUrl || `https://editorvault.web.app/thumbnails/${title.toLowerCase().replace(/\s+/g, '-')}.png`,
    "url": pageUrl,
    "keywords": [
      "free video editing assets",
      "video editing resources",
      `free ${category.toLowerCase()}`,
      "YouTube editing assets",
      "content creator resources",
      ...tags,
      ...compatibility.map(c => `${c} assets`)
    ].join(', '),
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Cross-platform",
    "softwareRequirements": compatibility.length > 0 ? compatibility.join(', ') : "Video editing software"
  };

  // Add video schema if video preview exists
  if (videoUrl) {
    schemaMarkup.video = {
      "@type": "VideoObject",
      "name": `${title} Preview`,
      "description": `Preview of ${title} video editing asset`,
      "thumbnailUrl": imageUrl,
      "contentUrl": videoUrl
    };
  }

  useEffect(() => {
    // Update document head
    document.title = pageTitle;

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
    updateMeta('description', pageDescription);
    updateMeta('keywords', `free video editing assets, ${category.toLowerCase()} assets, video editing resources, ${title}, YouTube editing, ${tags.join(', ')}`);

    // Open Graph
    updateMeta('og:title', `${title} - Free Video Editing Asset`, true);
    updateMeta('og:description', pageDescription, true);
    updateMeta('og:image', imageUrl || `https://editorvault.web.app/thumbnails/${title.toLowerCase().replace(/\s+/g, '-')}.png`, true);
    updateMeta('og:url', pageUrl, true);
    updateMeta('og:type', 'product', true);

    // Twitter Card
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', `${title} - Free Video Editing Asset`);
    updateMeta('twitter:description', pageDescription);
    updateMeta('twitter:image', imageUrl || `https://editorvault.web.app/thumbnails/${title.toLowerCase().replace(/\s+/g, '-')}.png`);



    // Structured data
    let structuredData = document.querySelector('script[type="application/ld+json"]');
    if (!structuredData) {
      structuredData = document.createElement('script');
      structuredData.setAttribute('type', 'application/ld+json');
      document.head.appendChild(structuredData);
    }
    structuredData.textContent = JSON.stringify(schemaMarkup, null, 2);
  }, [pageTitle, pageDescription, pageUrl, title, category, tags, imageUrl, schemaMarkup]);

  return null;
};

export default AssetSEO;

