import React from 'react';
import { Helmet } from 'react-helmet-async';

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
  const pageTitle = `${title} - Free Video Editing Asset | Video Forge`;
  const pageDescription = `Download ${title} - professional ${category.toLowerCase()} for video editing. ${description} Compatible with Premiere Pro, After Effects, Final Cut Pro. Free editing asset for YouTube creators.`;
  const pageUrl = `https://videoforges.web.app/asset/${assetId}`;
  
  const schemaMarkup: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": title,
    "description": pageDescription,
    "category": `Video Editing ${category}`,
    "brand": {
      "@type": "Brand",
      "name": "Video Forge"
    },
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "USD", 
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Video Forge"
      }
    },
    "image": imageUrl || `https://videoforges.web.app/thumbnails/${title.toLowerCase().replace(/\s+/g, '-')}.png`,
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

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={`free video editing assets, ${category.toLowerCase()} assets, video editing resources, ${title}, YouTube editing, ${tags.join(', ')}`} />
      <link rel="canonical" href={pageUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={`${title} - Free Video Editing Asset`} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={imageUrl || `https://videoforges.web.app/thumbnails/${title.toLowerCase().replace(/\s+/g, '-')}.png`} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content="product" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${title} - Free Video Editing Asset`} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={imageUrl || `https://videoforges.web.app/thumbnails/${title.toLowerCase().replace(/\s+/g, '-')}.png`} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schemaMarkup, null, 2)}
      </script>
    </Helmet>
  );
};

export default AssetSEO;