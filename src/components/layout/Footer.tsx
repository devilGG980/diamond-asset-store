import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900/50 backdrop-blur-sm border-t border-gray-800 mt-16">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">EditorVault</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Free video editing assets and thumbnail maker  for content creators worldwide.
                        </p>
                        <div className="mt-4 flex space-x-3">
                            <a
                                href="https://twitter.com/videoforge"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                                aria-label="Twitter"
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </a>
                            <a
                                href="https://youtube.com/@deviIxDeath"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                                aria-label="YouTube"
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
                        <nav className="space-y-2">
                            <Link to="/" className="block text-gray-400 hover:text-white transition-colors text-sm">
                                Home
                            </Link>
                            <Link to="/store" className="block text-gray-400 hover:text-white transition-colors text-sm">
                                Store
                            </Link>
                            <Link to="/editor" className="block text-gray-400 hover:text-white transition-colors text-sm">
                                Thumbnail Maker
                            </Link>
                            <Link to="/faq" className="block text-gray-400 hover:text-white transition-colors text-sm">
                                FAQ
                            </Link>
                            <Link to="/about" className="block text-gray-400 hover:text-white transition-colors text-sm">
                                About Us
                            </Link>
                            <Link to="/contact" className="block text-gray-400 hover:text-white transition-colors text-sm">
                                Contact
                            </Link>
                        </nav>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Legal</h3>
                        <nav className="space-y-2">
                            <Link to="/privacy-policy" className="block text-gray-400 hover:text-white transition-colors text-sm">
                                Privacy Policy
                            </Link>
                            <Link to="/terms-of-service" className="block text-gray-400 hover:text-white transition-colors text-sm">
                                Terms of Service
                            </Link>
                            <a
                                href="https://www.google.com/settings/ads"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-gray-400 hover:text-white transition-colors text-sm"
                            >
                                Ad Choices
                            </a>
                        </nav>
                    </div>

                    {/* Popular Blog Posts - SEO Internal Linking */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Popular Guides</h3>
                        <nav className="space-y-2">
                            <Link to="/blog/how-to-change-video-thumbnail" className="block text-gray-400 hover:text-white transition-colors text-sm">
                                Change Video Thumbnails
                            </Link>
                            <Link to="/blog/video-editing-tips-2024" className="block text-gray-400 hover:text-white transition-colors text-sm">
                                Video Editing Tips
                            </Link>
                            <Link to="/blog/youtube-thumbnail-size" className="block text-gray-400 hover:text-white transition-colors text-sm">
                                YouTube Thumbnail Size
                            </Link>
                            <Link to="/blog/best-iphone-video-editing-apps" className="block text-gray-400 hover:text-white transition-colors text-sm">
                                iPhone Video Editing Apps
                            </Link>
                            <Link to="/blog/remote-video-editing-jobs" className="block text-gray-400 hover:text-white transition-colors text-sm">
                                Remote Editing Jobs
                            </Link>
                            <Link to="/blog" className="block text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-semibold">
                                View All Guides →
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-gray-400 text-sm">
                            © {currentYear} EditorVault. All rights reserved.
                        </p>
                        <div className="flex items-center space-x-6 text-sm">
                            <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                                Privacy
                            </Link>
                            <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
                                Terms
                            </Link>
                            <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                                Contact
                            </Link>
                        </div>
                    </div>
                    <p className="text-gray-500 text-xs mt-4 text-center md:text-left">
                        EditorVault is a digital marketplace providing video editing assets for creators.
                        Assets are provided for commercial and personal use under specified licenses.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
