import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  placeholder?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  fallback = '🎬',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzM3NDE1MSIvPgo8L3N2Zz4=',
  width,
  height,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(priority); // Load immediately if priority
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img || priority) return; // Skip observer for priority images

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(img);
        }
      },
      { rootMargin: '50px' }
    );

    observer.observe(img);

    return () => observer.unobserve(img);
  }, [priority]);

  const handleLoad = () => {
    console.log('✅ Image loaded successfully:', src);
    setLoaded(true);
    setError(false);
  };

  const handleError = () => {
    console.log('❌ Image failed to load:', src);
    setError(true);
    setLoaded(false);
  };

  if (error) {
    console.log('🚨 Showing fallback due to error:', src);
    return (
      <div className={`flex items-center justify-center bg-gray-700 ${className}`}>
        <span className="text-4xl">{fallback}</span>
      </div>
    );
  }

  // If src is neither a path nor data URL, show fallback
  if (!src.startsWith('/') && !src.startsWith('data:') && !src.startsWith('http')) {
    console.log('🚨 Showing emoji fallback for non-URL:', src);
    return (
      <div className={`flex items-center justify-center bg-gray-700 ${className}`}>
        <span className="text-4xl">{src}</span>
      </div>
    );
  }

  console.log('🖼️ Attempting to load image:', src, 'inView:', inView);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      <img
        src={placeholder}
        alt=""
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
      
      {/* Actual image */}
      <img
        ref={imgRef}
        src={inView ? src : placeholder}
        alt={alt || 'Video editing asset'}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        width={width}
        height={height}
        sizes={sizes}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </div>
  );
};

export default OptimizedImage;