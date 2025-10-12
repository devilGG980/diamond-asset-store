import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline';

const Contact: React.FC = () => {
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
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gradient mb-4">Contact Us</h1>
          <p className="text-xl text-gray-400">
            Get in touch with the Video Forge team
          </p>
        </motion.div>

        {/* Contact Information */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <EnvelopeIcon className="h-6 w-6 text-blue-400 mt-1" />
                <div>
                  <h3 className="text-white font-semibold mb-1">Email Support</h3>
                  <a 
                    href="mailto:infomeryt0@gmail.com" 
                    className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  >
                    infomeryt0@gmail.com
                  </a>
                  <p className="text-gray-400 text-sm">For general inquiries and support</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <EnvelopeIcon className="h-6 w-6 text-green-400 mt-1" />
                <div>
                  <h3 className="text-white font-semibold mb-1">Business Inquiries</h3>
                  <a 
                    href="mailto:infomeryt0@gmail.com" 
                    className="text-green-400 hover:text-green-300 transition-colors font-medium"
                  >
                    infomeryt0@gmail.com
                  </a>
                  <p className="text-gray-400 text-sm">For partnerships and collaborations</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <ClockIcon className="h-6 w-6 text-purple-400 mt-1" />
                <div>
                  <h3 className="text-white font-semibold mb-1">Response Time</h3>
                  <p className="text-gray-300">24-48 hours</p>
                  <p className="text-gray-400 text-sm">We aim to respond within 2 business days</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="h-6 w-6 mt-1 text-red-500 text-xl flex items-center justify-center">
                  📺
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">YouTube Channel</h3>
                  <a 
                    href="https://www.youtube.com/@deviIxDeath" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm"
                  >
                    <span>📺</span>
                    <span>@deviIxDeath</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <p className="text-gray-400 text-sm mt-2">Follow for video editing tutorials and updates</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Quick Links</h2>
            <div className="space-y-4">
              <Link
                to="/about"
                className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <h3 className="text-white font-semibold mb-1">About Video Forge</h3>
                <p className="text-gray-400 text-sm">Learn more about our mission and values</p>
              </Link>
              <Link
                to="/privacy-policy"
                className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <h3 className="text-white font-semibold mb-1">Privacy Policy</h3>
                <p className="text-gray-400 text-sm">How we protect and handle your data</p>
              </Link>
              <Link
                to="/terms-of-service"
                className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <h3 className="text-white font-semibold mb-1">Terms of Service</h3>
                <p className="text-gray-400 text-sm">Platform rules and guidelines</p>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-white font-bold mb-2">How do I earn diamonds?</h3>
              <p className="text-gray-300 text-sm">
                You can earn diamonds by watching advertisements, participating in community activities, 
                or purchasing them directly through our platform.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-white font-bold mb-2">Can I use assets commercially?</h3>
              <p className="text-gray-300 text-sm">
                Yes! All purchased assets come with commercial usage rights. You can use them in 
                client projects, YouTube videos, and other commercial endeavors.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-white font-bold mb-2">What file formats do you support?</h3>
              <p className="text-gray-300 text-sm">
                We provide assets in industry-standard formats including MP4 for videos, MP3 for audio, 
                and various project files for popular editing software.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-white font-bold mb-2">Do you offer refunds?</h3>
              <p className="text-gray-300 text-sm">
                Due to the digital nature of our products, all sales are final. However, we review 
                refund requests on a case-by-case basis for technical issues.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;