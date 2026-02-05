import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogSummaries as blogPosts } from '../../data/blogSummaries';
import { AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  ShoppingBagIcon,
  InformationCircleIcon,
  PhoneIcon,
  BookOpenIcon,
  PencilSquareIcon,
  ChevronDownIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

const Navbar: React.FC = React.memo(() => {
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Store', path: '/store', icon: ShoppingBagIcon },
    { name: 'Editor', path: '/editor', icon: PencilSquareIcon },
    { name: 'Blog', path: '/blog', icon: BookOpenIcon },
    { name: 'FAQ', path: '/faq', icon: QuestionMarkCircleIcon },
    { name: 'About', path: '/about', icon: InformationCircleIcon },
    { name: 'Contact', path: '/contact', icon: PhoneIcon },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-[110] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            {/* Left: Logo */}
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-3 group">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center"
                >
                  {/* Animated gradient ring */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 opacity-80"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="absolute inset-[2px] bg-gray-900 rounded-2xl" />

                  {/* Logo icon */}
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 relative z-10" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Abstract 'EV/Vault' Monogram */}
                    <path d="M7 10 L25 10 L25 22 L7 22 Z" stroke="url(#logoGrad1)" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <path d="M7 16 L25 16" stroke="url(#logoGrad2)" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="16" cy="16" r="2" fill="url(#logoGrad1)" />
                    <defs>
                      <linearGradient id="logoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#A78BFA" />
                        <stop offset="100%" stopColor="#818CF8" />
                      </linearGradient>
                      <linearGradient id="logoGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06B6D4" />
                        <stop offset="100%" stopColor="#0EA5E9" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>
                <div className="block">
                  <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    EditorVault
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-400 -mt-1 hidden sm:block">Free Assets</div>
                </div>
              </Link>
            </div>

            {/* Center: Desktop Nav Links */}
            <div className="hidden md:flex flex-1 justify-center max-w-2xl mx-8">
              <div className="flex items-center gap-1 bg-gray-800/50 rounded-full p-1 border border-gray-700/50">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  const isBlog = item.name === 'Blog';

                  if (isBlog) {
                    return (
                      <div
                        key={item.path}
                        className="relative"
                        onMouseEnter={() => setActiveDropdown('blog')}
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        <Link
                          to={item.path}
                          className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${active
                            ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg'
                            : 'text-gray-300 hover:text-white hover:bg-gray-700/80'
                            }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="hidden lg:inline">{item.name}</span>
                          <ChevronDownIcon className="h-3 w-3 hidden lg:block" />
                        </Link>

                        <AnimatePresence>
                          {activeDropdown === 'blog' && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ duration: 0.2 }}
                              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[60vh] overflow-y-auto custom-scrollbar"
                            >
                              <div className="p-2 space-y-1">
                                {blogPosts.map((post) => (
                                  <Link
                                    key={post.id}
                                    to={`/blog/${post.id}`}
                                    className="block p-3 rounded-xl hover:bg-gray-800/50 transition-colors group"
                                  >
                                    <div className="text-sm font-medium text-gray-200 group-hover:text-white line-clamp-2 leading-snug">
                                      {post.title}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                      <span className="bg-gray-800 px-1.5 py-0.5 rounded text-[10px]">{post.category}</span>
                                      <span>• {post.readTime} min read</span>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      title={item.name}
                      className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${active
                        ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/80'
                        }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden lg:inline">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right: Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-gray-400 hover:text-white transition-colors relative group"
                aria-label="Open menu"
              >
                <div className="w-6 h-5 flex flex-col justify-between">
                  <span className="w-full h-0.5 bg-current rounded-full transition-all group-hover:bg-cyan-400"></span>
                  <span className="w-3/4 h-0.5 bg-current rounded-full ml-auto transition-all group-hover:w-full group-hover:bg-purple-400"></span>
                  <span className="w-full h-0.5 bg-current rounded-full transition-all group-hover:bg-cyan-400"></span>
                </div>
              </button>
            </div>

            {/* Empty space for desktop layout balance */}
            <div className="hidden md:block w-32" />
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[120] md:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 w-[280px] bg-gray-900 border-l border-gray-800 shadow-2xl z-[130] overflow-y-auto md:hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-white">Menu</h2>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Main Navigation */}
                  <div className="space-y-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive(item.path)
                          ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white border border-purple-500/30'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                          }`}
                      >
                        <item.icon className={`h-6 w-6 ${isActive(item.path) ? 'text-cyan-400' : 'text-gray-500'}`} />
                        <span className="font-medium">{item.name}</span>
                        {isActive(item.path) && (
                          <motion.div layoutId="activeDot" className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        )}
                      </Link>
                    ))}
                  </div>

                  <div className="w-full h-px bg-gray-800 my-4" />

                  {/* Blog Categories Shortcut */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Latest Guides</h3>
                    <div className="space-y-2">
                      {blogPosts.slice(0, 3).map(post => (
                        <Link
                          key={post.id}
                          to={`/blog/${post.id}`}
                          className="block p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
                        >
                          <div className="text-sm text-gray-200 line-clamp-1">{post.title}</div>
                          <div className="text-xs text-cyan-500 mt-1">{post.category}</div>
                        </Link>
                      ))}
                      <Link
                        to="/blog"
                        className="block w-full text-center py-2 text-xs text-gray-500 hover:text-white transition-colors"
                      >
                        View All Posts →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});

export default Navbar;
