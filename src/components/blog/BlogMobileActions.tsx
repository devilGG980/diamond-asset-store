import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HeartIcon,
    ShareIcon,
    ArrowUpIcon,
    HomeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface BlogMobileActionsProps {
    title: string;
    url: string;
    onLike?: () => void;
    isLiked?: boolean;
}

const BlogMobileActions: React.FC<BlogMobileActionsProps> = ({
    title,
    url,
    onLike,
    isLiked = false
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show when scrolling up or at bottom, hide when scrolling down
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    url: url
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(url);
            toast.success('Link copied to clipboard!');
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe"
                >
                    <div className="bg-gray-900/80 backdrop-blur-lg border-t border-gray-800 px-6 py-3 pb-6 safe-area-bottom">
                        <div className="flex items-center justify-between gap-8 max-w-md mx-auto">

                            {/* Home Button */}
                            <Link to="/blog" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
                                <HomeIcon className="w-6 h-6" />
                                <span className="text-[10px] font-medium">Blog</span>
                            </Link>

                            {/* Like Button */}
                            <button
                                onClick={onLike}
                                className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors"
                                aria-label="Like post"
                            >
                                {isLiked ? (
                                    <HeartIconSolid className="w-6 h-6 text-red-500" />
                                ) : (
                                    <HeartIcon className="w-6 h-6" />
                                )}
                                <span className="text-[10px] font-medium">
                                    {isLiked ? 'Saved' : 'Save'}
                                </span>
                            </button>

                            {/* Share Button */}
                            <button
                                onClick={handleShare}
                                className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors"
                                aria-label="Share post"
                            >
                                <ShareIcon className="w-6 h-6" />
                                <span className="text-[10px] font-medium">Share</span>
                            </button>

                            {/* Top Button */}
                            <button
                                onClick={scrollToTop}
                                className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors"
                                aria-label="Scroll to top"
                            >
                                <ArrowUpIcon className="w-6 h-6" />
                                <span className="text-[10px] font-medium">Top</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BlogMobileActions;
