import React, { useRef, useEffect, useState, useCallback } from 'react';

interface OptimizedVideoProps {
  src: string;
  poster?: string;
  className?: string;
  muted?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  controlsList?: string;
  disablePictureInPicture?: boolean;
  preload?: string;
  style?: React.CSSProperties;
  onLoadStart?: () => void;
  onCanPlay?: () => void;
  onLoadedData?: () => void;
  onCanPlayThrough?: () => void;
  onError?: (e: any) => void;
}

const OptimizedVideo: React.FC<OptimizedVideoProps> = ({
  src,
  poster,
  className = '',
  muted = true,
  autoPlay = false,
  loop = false,
  playsInline = true,
  controls = false,
  controlsList,
  disablePictureInPicture = false,
  preload = 'none',
  style,
  onLoadStart,
  onCanPlay,
  onLoadedData,
  onCanPlayThrough,
  onError
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const handleLoadStart = useCallback(() => {
    setHasLoaded(true);
    onLoadStart?.();
  }, [onLoadStart]);

  const handleCanPlay = useCallback(() => {
    onCanPlay?.();
  }, [onCanPlay]);

  const handleLoadedData = useCallback(() => {
    onLoadedData?.();
  }, [onLoadedData]);

  const handleCanPlayThrough = useCallback(() => {
    onCanPlayThrough?.();
  }, [onCanPlayThrough]);

  const handleError = useCallback((e: any) => {
    console.warn('Video failed to load:', src);
    onError?.(e);
  }, [src, onError]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsInView(true);
        }
      },
      { rootMargin: '100px' }
    );

    observer.observe(video);

    return () => {
      observer.unobserve(video);
    };
  }, [hasLoaded]);

  return (
    <video
      ref={videoRef}
      className={className}
      muted={muted}
      autoPlay={autoPlay && isInView}
      loop={loop}
      playsInline={playsInline}
      controls={controls}
      controlsList={controlsList}
      disablePictureInPicture={disablePictureInPicture}
      poster={poster}
      onLoadStart={handleLoadStart}
      onCanPlay={handleCanPlay}
      onLoadedData={handleLoadedData}
      onCanPlayThrough={handleCanPlayThrough}
      onError={handleError}
      preload={isInView ? (preload || 'metadata') : 'none'}
      style={style || {
        aspectRatio: '16/9',
        objectFit: 'contain',
      }}
    >
      {isInView && <source src={src} type="video/mp4" />}
      <div className="flex items-center justify-center h-full bg-gray-700 text-white">
        <div className="text-center">
          <div className="text-4xl mb-2">📹</div>
          <p>Video preview not available</p>
        </div>
      </div>
    </video>
  );
};

export default OptimizedVideo;
