import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { getAssetById } from '../data/assets';
import {
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  StarIcon,
  CalendarIcon,
  DocumentIcon,
  CheckCircleIcon,
  XCircleIcon,
  HeartIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import OptimizedVideo from '../components/ui/OptimizedVideo';
import { 
  hasActiveAssetAccess, 
  getRemainingDownloads, 
  recordDownload, 
  cleanExhaustedPurchases 
} from '../services/database';
// Using AuthContext purchaseAsset function instead of direct database calls

const AssetPreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, userProfile, purchaseAsset, getUserProfile } = useAuth();
  const [asset, setAsset] = useState(getAssetById(Number(id)));
  const [loading, setLoading] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [remainingDownloads, setRemainingDownloads] = useState<number>(0);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!asset) {
      navigate('/store');
      return;
    }

    // Check if user has active access to this asset
    if (currentUser && userProfile) {
      const hasAccess = hasActiveAssetAccess(userProfile, asset.id.toString());
      setPurchased(hasAccess);
      
      if (hasAccess) {
        const downloadsLeft = getRemainingDownloads(userProfile, asset.id.toString());
        setRemainingDownloads(downloadsLeft);
      } else {
        setRemainingDownloads(0);
      }
      
      // Clean exhausted purchases
      cleanExhaustedPurchases(currentUser.uid);
    }
  }, [asset, currentUser, userProfile, navigate]);
  

  const handlePurchase = async () => {
    if (!currentUser) {
      toast.error('Please sign in to purchase assets');
      navigate('/login');
      return;
    }

    if (!userProfile || !asset) return;

    if (userProfile.diamondBalance < asset.price) {
      toast.error('Insufficient diamonds! Watch ads or buy more diamonds.');
      return;
    }

    setLoading(true);
    
    try {
      // Use AuthContext purchaseAsset function
      await purchaseAsset(asset.id.toString(), asset.price);
      
      setPurchased(true);
      toast.success(`Successfully purchased ${asset.title}! 🎉`);
    } catch (error: any) {
      console.error('Purchase error:', error);
      toast.error(error.message || 'Failed to purchase asset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!currentUser || !asset) return;
    
    setDownloading(true);
    
    try {
      // Record the download
      await recordDownload(currentUser.uid, asset.id.toString());
      
      // Update remaining downloads
      const newRemainingDownloads = remainingDownloads - 1;
      setRemainingDownloads(newRemainingDownloads);
      
      // If no downloads left, remove purchased status
      if (newRemainingDownloads <= 0) {
        setPurchased(false);
      }
      
      // Start the actual download
      const link = document.createElement('a');
      link.href = asset.downloadUrl || '#';
      link.download = asset.title.replace(/\s+/g, '-').toLowerCase() || 'asset';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Download started! ${newRemainingDownloads} downloads remaining.`);
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error(error.message || 'Failed to download asset.');
    } finally {
      setDownloading(false);
    }
  };

  if (!asset) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back to Store</span>
        </motion.button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Asset Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <div className="card">
              {/* Asset Display */}
              <div className="bg-gray-800 rounded-lg p-6 text-center mb-6 relative overflow-hidden">
                {/* Video/Audio Preview - Optimized for Fast Loading */}
                {asset.previewVideo ? (
                  <div className="w-full max-w-2xl mx-auto relative">
                    {/* Loading Overlay - Non-blocking */}
                    {videoLoading && (
                      <div className="absolute top-4 left-4 bg-black bg-opacity-70 rounded-lg p-3 z-10">
                        <div className="flex items-center space-x-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="text-2xl"
                          >
                            🔄
                          </motion.div>
                          <p className="text-white text-sm">Loading...</p>
                        </div>
                      </div>
                    )}
                    
                    {asset.format === 'MP3 Audio' ? (
                      <div className="w-full bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 rounded-lg p-8 flex flex-col items-center justify-center" style={{ aspectRatio: '16/9' }}>
                        <motion.div
                          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className="text-8xl mb-6"
                        >
                          {asset.thumbnail}
                        </motion.div>
                        <audio 
                          src={asset.previewVideo}
                          controls
                          autoPlay
                          loop
                          className="w-full max-w-md"
                          style={{ 
                            filter: 'hue-rotate(280deg) saturate(1.5)',
                            borderRadius: '8px'
                          }}
                          onLoadStart={() => setVideoLoading(true)}
                          onLoadedData={() => setVideoLoading(false)}
                          onCanPlayThrough={() => setVideoLoading(false)}
                          onError={() => setVideoLoading(false)}
                        />
                      </div>
                    ) : (
                      <OptimizedVideo
                        src={asset.previewVideo}
                        className="w-full rounded-lg shadow-lg bg-gray-700"
                        controls
                        controlsList="nodownload nofullscreen noremoteplayback"
                        disablePictureInPicture
                        muted
                        playsInline
                        autoPlay
                        loop
                        preload="auto"
                        onLoadStart={() => {
                          console.log('Video load started');
                          setVideoLoading(true);
                        }}
                        onLoadedData={() => {
                          console.log('Video loaded');
                          setVideoLoading(false);
                        }}
                        onCanPlayThrough={() => {
                          console.log('Video ready to play');
                          setVideoLoading(false);
                        }}
                        onError={(e) => {
                          console.error('Video error:', e);
                          setVideoLoading(false);
                        }}
                        style={{
                          aspectRatio: '16/9',
                          objectFit: 'contain'
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-8xl mb-4"
                  >
                    {asset.thumbnail}
                  </motion.div>
                )}
                
                {/* Purchase Overlay - Bottom Banner Style */}
                {!purchased && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <div className="text-2xl">🔒</div>
                        <p className="text-white font-bold">Preview Only</p>
                      </div>
                      <p className="text-gray-300 text-sm">Purchase to unlock full access & downloads</p>
                    </div>
                  </div>
                )}

                {/* Featured Badge */}
                {asset.featured && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-yellow-500 text-black px-3 py-2 rounded-full text-sm font-bold flex items-center">
                      <StarIcon className="h-4 w-4 mr-1" />
                      Featured
                    </div>
                  </div>
                )}
              </div>

              {/* Asset Details */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full">
                    {asset.category}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <HeartIcon className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <ShareIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <h1 className="text-3xl font-bold text-white mb-4">{asset.title}</h1>
                
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {asset.description}
                </p>

                {/* Meta Information */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-3">
                  <ArrowDownTrayIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Downloads</p>
                    <p className="text-white font-medium">{asset.downloads.toLocaleString()}</p>
                  </div>
                </div>
                  
                  <div className="flex items-center space-x-3">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Released</p>
                      <p className="text-white font-medium">{asset.createdAt.toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <DocumentIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">File Size</p>
                      <p className="text-white font-medium">{asset.fileSize}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <DocumentIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Format</p>
                      <p className="text-white font-medium">{asset.format}</p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <p className="text-sm text-gray-400 mb-3">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {asset.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-700 transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Purchase Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="card sticky top-20">
              {/* Price */}
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-yellow-400 mb-2">
                  💎 {asset.price}
                </div>
                <p className="text-gray-400">Diamond Price</p>
              </div>

              {/* Purchase Status */}
              {purchased ? (
                <div className="text-center mb-6">
                  <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <p className="text-green-500 font-bold text-lg mb-2">Access Granted!</p>
                  {remainingDownloads > 0 ? (
                    <div className="bg-blue-900 border border-blue-600 rounded-lg p-3 mt-3">
                      <p className="text-blue-300 font-semibold mb-1">📍 Download Limit</p>
                      <p className="text-blue-200 text-sm mb-2">Downloads remaining:</p>
                      <p className="text-blue-100 font-bold text-xl">{remainingDownloads} / 2</p>
                      <p className="text-blue-300 text-xs mt-1">Use your downloads wisely!</p>
                    </div>
                  ) : (
                    <div className="bg-red-900 border border-red-600 rounded-lg p-3 mt-3">
                      <p className="text-red-300 font-semibold">❌ Downloads Exhausted</p>
                      <p className="text-red-200 text-sm">You have used all 2 downloads for this asset</p>
                    </div>
                  )}
                </div>
              ) : (
                currentUser && userProfile && (
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <span className="text-gray-400">Your Balance:</span>
                      <span className="text-yellow-400 font-bold">💎 {userProfile.diamondBalance}</span>
                    </div>
                    
                    {userProfile.diamondBalance >= asset.price ? (
                      <div className="flex items-center justify-center text-green-500">
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        <span>Sufficient funds</span>
                      </div>
                    ) : (
                      <div className="text-red-500">
                        <div className="flex items-center justify-center mb-2">
                          <XCircleIcon className="h-5 w-5 mr-2" />
                          <span>Insufficient diamonds</span>
                        </div>
                        <p className="text-sm">
                          Need {asset.price - userProfile.diamondBalance} more diamonds
                        </p>
                      </div>
                    )}
                  </div>
                )
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {currentUser ? (
                  purchased ? (
                    remainingDownloads > 0 ? (
                      <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {downloading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                            Downloading...
                          </>
                        ) : (
                          <>
                            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                            Download Now ({remainingDownloads} left)
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <button
                          disabled
                          className="w-full bg-gray-600 text-gray-300 px-4 py-3 rounded-lg cursor-not-allowed flex items-center justify-center"
                        >
                          <XCircleIcon className="h-5 w-5 mr-2" />
                          No Downloads Left
                        </button>
                        <button
                          onClick={handlePurchase}
                          disabled={loading || !userProfile || userProfile.diamondBalance < asset.price}
                          className="w-full btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                              Processing...
                            </>
                          ) : (
                            <>Purchase Again (2 more downloads)</>
                          )}
                        </button>
                      </div>
                    )
                  ) : (
                    <button
                      onClick={handlePurchase}
                      disabled={loading || !userProfile || userProfile.diamondBalance < asset.price}
                      className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>Purchase Now</>
                      )}
                    </button>
                  )
                ) : (
                  <Link to="/login" className="w-full btn-primary block text-center">
                    Sign in to Purchase
                  </Link>
                )}

                {!purchased && userProfile && userProfile.diamondBalance < asset.price && (
                  <div className="space-y-2">
                    <Link to="/ads" className="w-full btn-secondary block text-center">
                      Watch Ads to Earn Diamonds
                    </Link>
                    <button className="w-full btn-secondary" disabled>
                      Buy Diamonds (Coming Soon)
                    </button>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-gray-800">
                <div className="space-y-3 text-sm text-gray-400">
                  <div className="flex items-center justify-between">
                    <span>Instant Download</span>
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>2 Downloads Max</span>
                    <div className="flex items-center">
                      <span className="text-blue-500 mr-1">📍</span>
                      <span className="text-blue-400">Limited Use</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Commercial Use</span>
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>24/7 Support</span>
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AssetPreview;