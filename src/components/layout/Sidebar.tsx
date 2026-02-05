import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = React.memo(() => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adContainerRef.current && adContainerRef.current.childElementCount === 0) {
      const confScript = document.createElement('script');
      confScript.type = 'text/javascript';
      confScript.innerHTML = `
        atOptions = {
          'key' : '052edb383275b120a5a3e5af90668118',
          'format' : 'iframe',
          'height' : 250,
          'width' : 300,
          'params' : {}
        };
      `;
      adContainerRef.current.appendChild(confScript);

      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = 'https://www.highperformanceformat.com/052edb383275b120a5a3e5af90668118/invoke.js';
      adContainerRef.current.appendChild(invokeScript);
    }
  }, []);

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="hidden lg:block fixed right-0 top-16 w-80 bg-gray-900 border-l-2 border-yellow-400 h-[calc(100vh-4rem)] overflow-y-auto shadow-2xl z-[100]"
    >
      <div className="p-6 space-y-5">

        {/* Adsterra Banner Ad */}
        <div
          className="rounded-lg overflow-hidden bg-gray-800/30 flex justify-center items-center min-h-[250px]"
          ref={adContainerRef}
        >
          {/* Ad will be injected here */}
        </div>

        {/* Quick Navigation */}
        <div className="rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 p-4 space-y-2">
          <h3 className="text-sm font-bold text-white mb-3">🚀 Quick Access</h3>
          <Link to="/store" className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/50 hover:bg-gray-600 transition-all group">
            <span className="text-xl">🎨</span>
            <div className="flex-1">
              <p className="text-white font-medium group-hover:text-cyan-400">Browse Assets</p>
              <p className="text-xs text-gray-400">500+ items</p>
            </div>
          </Link>
          <Link to="/editor" className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/50 hover:bg-gray-600 transition-all group">
            <span className="text-xl">✏️</span>
            <div className="flex-1">
              <p className="text-white font-medium group-hover:text-cyan-400">Thumbnail Editor</p>
              <p className="text-xs text-gray-400">Design now</p>
            </div>
          </Link>
          <Link to="/blog" className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/50 hover:bg-gray-600 transition-all group">
            <span className="text-xl">📖</span>
            <div className="flex-1">
              <p className="text-white font-medium group-hover:text-cyan-400">Tutorials</p>
              <p className="text-xs text-gray-400">Learn tips</p>
            </div>
          </Link>
        </div>

        {/* Earn Section */}


        {/* Featured Links */}
        <div className="rounded-lg bg-gray-800/50 p-4 space-y-2">
          <h3 className="text-sm font-bold text-white mb-3">⭐ Popular</h3>
          <Link to="/store" className="text-sm text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-2 py-2">
            <span>→</span> Video Transitions
          </Link>
          <Link to="/store" className="text-sm text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-2 py-2">
            <span>→</span> YouTube Thumbnails
          </Link>
          <Link to="/store" className="text-sm text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-2 py-2">
            <span>→</span> Motion Graphics
          </Link>
        </div>

        {/* YouTube Subscribe */}
        <a
          href="https://www.youtube.com/@devilxdeath"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-lg bg-red-600 hover:bg-red-700 text-white p-4 text-center font-bold transition-colors shadow-lg"
        >
          <span className="text-xl">📺</span>
          <p className="mt-2">Subscribe @devilxdeath</p>
          <p className="text-xs mt-1 opacity-90">Follow for updates</p>
        </a>

        {/* Info */}
        <div className="rounded-lg bg-gray-800/50 p-3 text-center text-xs text-gray-400 space-y-1">
          <p><span className="text-cyan-400 font-bold">Free</span> video editing assets</p>
          <p>No signup required</p>
          <p className="text-gray-500 pt-2">Made with ❤️ for creators</p>
        </div>

      </div>
    </motion.div>
  );
});



export default Sidebar;
