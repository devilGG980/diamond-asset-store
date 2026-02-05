import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';

const CookieConsent: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already accepted cookies
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            // Show banner after a small delay
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'true');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
                >
                    <div className="max-w-7xl mx-auto bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl p-6 md:flex items-center justify-between gap-6">
                        <div className="flex-1 mb-4 md:mb-0">
                            <h3 className="text-lg font-bold text-white mb-2">🍪 We value your privacy</h3>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic.
                                By clicking "Accept All", you consent to our use of cookies.
                                Read our <Link to="/privacy-policy" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2">Privacy Policy</Link>.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleAccept}
                                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/25 transition-all transform hover:scale-105"
                            >
                                Accept All
                            </button>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
                                aria-label="Close"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieConsent;
