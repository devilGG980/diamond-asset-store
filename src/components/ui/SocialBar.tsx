import React from 'react';
import { motion } from 'framer-motion';

interface SocialLink {
  name: string;
  url: string;
  icon: string;
  color: string;
  hoverColor: string;
}

interface SocialBarProps {
  position?: 'top' | 'bottom' | 'sidebar' | 'floating';
  orientation?: 'horizontal' | 'vertical';
  showLabels?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const SocialBar: React.FC<SocialBarProps> = ({
  position = 'bottom',
  orientation = 'horizontal',
  showLabels = false,
  size = 'medium'
}) => {

  // Social media links - Replace URLs with your actual social media accounts
  const socialLinks: SocialLink[] = [
    {
      name: 'YouTube',
      url: 'https://youtube.com/@thumbnailmakers',
      icon: '🎥',
      color: 'bg-red-600',
      hoverColor: 'hover:bg-red-700'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/thumbnailmakers',
      icon: '🐦',
      color: 'bg-blue-400',
      hoverColor: 'hover:bg-blue-500'
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/thumbnailmakers',
      icon: '📸',
      color: 'bg-pink-500',
      hoverColor: 'hover:bg-pink-600'
    },
    {
      name: 'Discord',
      url: 'https://discord.gg/thumbnailmakers',
      icon: '💬',
      color: 'bg-indigo-600',
      hoverColor: 'hover:bg-indigo-700'
    },
    {
      name: 'TikTok',
      url: 'https://tiktok.com/@thumbnailmakers',
      icon: '🎵',
      color: 'bg-black',
      hoverColor: 'hover:bg-gray-800'
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com/thumbnailmakers',
      icon: '👥',
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700'
    }
  ];

  // Size configurations
  const sizeConfig = {
    small: {
      container: orientation === 'horizontal' ? 'h-12' : 'w-12',
      button: 'w-8 h-8 text-sm',
      text: 'text-xs'
    },
    medium: {
      container: orientation === 'horizontal' ? 'h-16' : 'w-16',
      button: 'w-12 h-12 text-lg',
      text: 'text-sm'
    },
    large: {
      container: orientation === 'horizontal' ? 'h-20' : 'w-20',
      button: 'w-16 h-16 text-xl',
      text: 'text-base'
    }
  };

  // Position configurations
  const positionConfig = {
    top: 'top-0 left-0 right-0',
    bottom: 'bottom-0 left-0 right-0',
    sidebar: 'top-1/2 transform -translate-y-1/2 right-4',
    floating: 'bottom-4 right-4'
  };

  const config = sizeConfig[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: position === 'top' ? -50 : 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`fixed ${positionConfig[position]} z-40 ${position === 'floating' ? '' : 'bg-gray-900 bg-opacity-95 backdrop-blur-sm'
        } ${position === 'sidebar' || position === 'floating' ? '' : 'border-t border-gray-800'}`}
    >
      <div className={`flex ${orientation === 'horizontal'
          ? `${config.container} items-center justify-center space-x-2 px-4`
          : `${config.container} flex-col items-center justify-center space-y-2 py-4`
        }`}>

        {/* Follow Us Label */}
        {showLabels && orientation === 'horizontal' && (
          <span className={`${config.text} text-gray-300 font-medium mr-4`}>
            Follow Us:
          </span>
        )}

        {socialLinks.map((social, index) => (
          <motion.a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`${config.button} ${social.color} ${social.hoverColor} 
                       rounded-full flex items-center justify-center 
                       transition-all duration-200 shadow-lg 
                       hover:shadow-xl transform hover:-translate-y-1`}
            title={`Follow us on ${social.name}`}
          >
            <span>{social.icon}</span>
            {showLabels && orientation === 'vertical' && (
              <span className={`${config.text} text-white font-medium ml-2`}>
                {social.name}
              </span>
            )}
          </motion.a>
        ))}

        {/* Close Button for Floating */}
        {position === 'floating' && (
          <motion.button
            onClick={() => {
              // You can add hide functionality here
              console.log('Hide social bar');
            }}
            className="w-6 h-6 bg-gray-600 hover:bg-gray-700 rounded-full flex items-center justify-center ml-2"
            title="Hide social bar"
          >
            <span className="text-xs">✕</span>
          </motion.button>
        )}
      </div>

      {/* Visitor Count (Optional) */}
      {position === 'bottom' && (
        <div className="text-center py-2 border-t border-gray-800">
          <span className="text-xs text-gray-500">
            💎 Join 10,000+ creators earning diamonds! 💎
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default SocialBar;
