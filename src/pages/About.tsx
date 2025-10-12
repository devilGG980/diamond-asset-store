import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  SparklesIcon, 
  UserGroupIcon, 
  TrophyIcon,
  ShieldCheckIcon,
  CogIcon,
  HeartIcon,
  LightBulbIcon,
  GlobeAltIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const About: React.FC = () => {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-4xl sm:text-6xl mb-4 sm:mb-6"
              >
                🎬
              </motion.div>
              <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 sm:mb-6">
                <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                  Video Forge
                </span>
              </h1>
              <p className="text-lg sm:text-2xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed px-4">
                Empowering creators with <strong>free video editing assets</strong> and professional editing resources since 2024
              </p>
              <div className="flex justify-center mt-8">
                <div className="flex space-x-4">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Company Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative mb-16"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 rounded-3xl blur-xl"></div>
          <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 lg:p-12">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-8"
              >
                <HeartIcon className="h-10 w-10 text-white" />
              </motion.div>
              <h2 className="text-4xl font-extrabold text-white mb-6">
                Our <span className="text-gradient">Story</span>
              </h2>
              <div className="max-w-4xl mx-auto space-y-6">
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-xl text-gray-300 leading-relaxed p-6 bg-gray-800/30 rounded-xl border-l-4 border-purple-500"
                >
                  Video Forge was born from a simple yet powerful idea: <strong className="text-white">democratizing access to professional video editing assets.</strong> 
                  As content creators ourselves, we experienced firsthand the frustration of expensive, subscription-based asset libraries 
                  that were often out of reach for independent creators and small businesses.
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-xl text-gray-300 leading-relaxed p-6 bg-gray-800/30 rounded-xl border-l-4 border-pink-500"
                >
                  In 2024, we decided to change that narrative. Video Forge represents our commitment to <strong className="text-white">empowering every creator</strong> 
                  with high-quality, affordable assets through our innovative Diamond rewards system. We believe creativity shouldn't 
                  be limited by budget constraints.
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card mb-12"
        >
          <div className="text-center">
            <SparklesIcon className="h-16 w-16 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              To revolutionize the video editing industry by providing creators worldwide with premium, professional-grade assets 
              through an accessible, community-driven platform. We're building a future where quality content creation tools 
              are available to everyone, regardless of their financial situation.
            </p>
          </div>
        </motion.div>

        {/* What We Offer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-white mb-4">
              What We <span className="text-gradient">Offer</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Premium video editing assets designed to elevate your content
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "🎬",
                title: "Video Transitions",
                description: "Smooth, professional transitions to enhance your video editing workflow",
                gradient: "from-blue-500 to-cyan-500",
                delay: 0.1
              },
              {
                icon: "🎵",
                title: "Music Tracks",
                description: "Royalty-free music for all your creative projects and content needs",
                gradient: "from-green-500 to-emerald-500",
                delay: 0.2
              },
              {
                icon: "🎨",
                title: "Animations",
                description: "Dynamic animations and motion graphics to captivate your audience",
                gradient: "from-purple-500 to-pink-500",
                delay: 0.3
              },
              {
                icon: "🌆",
                title: "Backgrounds",
                description: "Stunning backgrounds and overlays for professional video production",
                gradient: "from-orange-500 to-red-500",
                delay: 0.4
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + item.delay, duration: 0.6 }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 text-center hover:border-gray-600/50 transition-all duration-300 hover:transform hover:scale-105">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${item.gradient} rounded-full mb-4 text-2xl`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technology & Innovation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">Technology & Innovation</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card text-center">
              <CogIcon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Modern Stack</h3>
              <p className="text-gray-300 text-sm">
                Built with React, TypeScript, and Firebase for optimal performance and reliability
              </p>
            </div>
            <div className="card text-center">
              <ShieldCheckIcon className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Secure Platform</h3>
              <p className="text-gray-300 text-sm">
                Enterprise-grade security with encrypted transactions and protected user data
              </p>
            </div>
            <div className="card text-center">
              <GlobeAltIcon className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Global CDN</h3>
              <p className="text-gray-300 text-sm">
                Lightning-fast downloads worldwide with our distributed content delivery network
              </p>
            </div>
          </div>
        </motion.div>

        {/* Diamond System */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="relative mb-16"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
          <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 lg:p-12">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0, rotate: 360 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.9, duration: 1, type: "spring", bounce: 0.4 }}
                className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mb-8 text-4xl animate-pulse"
              >
                💎
              </motion.div>
              <h2 className="text-4xl font-extrabold text-white mb-6">
                Diamond <span className="text-gradient">Rewards System</span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed mb-10 max-w-3xl mx-auto">
                Our unique Diamond currency system makes premium assets accessible to everyone. 
                Earn diamonds by watching advertisements, participating in our community, or 
                purchasing them directly. Use diamonds to unlock and download professional-grade assets.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Earn Diamonds",
                    description: "Watch short ads to earn diamonds for free",
                    icon: "📺",
                    gradient: "from-green-500 to-emerald-600"
                  },
                  {
                    title: "Unlock Assets",
                    description: "Use diamonds to purchase premium content",
                    icon: "🔓",
                    gradient: "from-blue-500 to-indigo-600"
                  },
                  {
                    title: "Download & Use",
                    description: "Download your assets and use them commercially",
                    icon: "🚀",
                    gradient: "from-purple-500 to-pink-600"
                  }
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 + index * 0.2 }}
                    className="group relative"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${step.gradient} rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                    <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-xl p-6 text-center hover:border-gray-500/50 transition-all duration-300 hover:transform hover:scale-105">
                      <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${step.gradient} rounded-full mb-4 text-xl`}>
                        {step.icon}
                      </div>
                      <h4 className="text-white font-bold mb-3 text-lg">{step.title}</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quality Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card mb-12"
        >
          <div className="text-center">
            <CheckCircleIcon className="h-16 w-16 text-green-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Quality Guarantee</h2>
            <div className="max-w-3xl mx-auto mb-8">
              <p className="text-gray-300 text-lg leading-relaxed">
                Every asset on Video Forge undergoes rigorous quality control. We test each file for 
                compatibility across major video editing software including Adobe Premiere Pro, After Effects, 
                Final Cut Pro, and DaVinci Resolve.
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-2xl mb-2">4K+</div>
                <p className="text-gray-300 text-sm">Ultra HD Quality</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-2xl mb-2">60fps</div>
                <p className="text-gray-300 text-sm">Smooth Playback</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-2xl mb-2">✓</div>
                <p className="text-gray-300 text-sm">Tested & Verified</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-2xl mb-2">📄</div>
                <p className="text-gray-300 text-sm">Commercial License</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">Platform Statistics</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card text-center">
              <UserGroupIcon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">Growing</div>
              <p className="text-gray-300">Active Users</p>
            </div>
            <div className="card text-center">
              <TrophyIcon className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">13+</div>
              <p className="text-gray-300">Premium Assets</p>
            </div>
            <div className="card text-center">
              <SparklesIcon className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <p className="text-gray-300">Support Available</p>
            </div>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="card mb-12"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Quality First</h3>
              <p className="text-gray-300">
                Every asset in our marketplace is carefully curated and tested to ensure it meets 
                professional standards and enhances your creative projects.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Accessibility</h3>
              <p className="text-gray-300">
                We believe premium content should be accessible to all creators, regardless of their budget. 
                Our Diamond system makes this possible.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Community Focused</h3>
              <p className="text-gray-300">
                We're building a community of creators who support each other's growth and success 
                through shared resources and collaboration.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Innovation</h3>
              <p className="text-gray-300">
                We continuously evolve our platform with new features, assets, and technologies 
                to serve our community better.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Future Vision */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="card mb-12"
        >
          <div className="text-center">
            <LightBulbIcon className="h-16 w-16 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Our Vision</h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                We envision a world where creativity knows no boundaries. Video Forge is just the beginning 
                of our journey to democratize content creation tools and build the largest community-driven 
                marketplace for digital creators.
              </p>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-6 rounded-lg">
                  <h4 className="text-white font-bold mb-3">🚀 Expanding Horizons</h4>
                  <p className="text-gray-200 text-sm">
                    We're working on AI-powered asset recommendations, collaborative tools, and 
                    support for emerging video formats including VR and AR content.
                  </p>
                </div>
                <div className="bg-gradient-to-r from-green-900 to-teal-900 p-6 rounded-lg">
                  <h4 className="text-white font-bold mb-3">🌍 Global Community</h4>
                  <p className="text-gray-200 text-sm">
                    Our goal is to build a vibrant ecosystem where creators can not only access 
                    premium assets but also contribute, collaborate, and earn from their own creations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="card text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Join Our Journey</h2>
          <p className="text-gray-300 mb-6">
            Be part of the Video Forge community! Whether you're a creator, have feedback, or want to collaborate, 
            we'd love to connect with you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="btn-primary"
            >
              Contact Us
            </Link>
            <Link
              to="/store"
              className="btn-secondary"
            >
              Explore Assets
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;