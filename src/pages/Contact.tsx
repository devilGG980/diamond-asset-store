import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  ClockIcon,
  PhoneIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  CheckCircleIcon,
  UserCircleIcon,
  HeartIcon,
  GlobeAltIcon,
  BugAntIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import {
  FaYoutube
} from 'react-icons/fa';
import PageSEO from '../components/SEO/PageSEO';
import LeaderboardAd from '../components/ads/LeaderboardAd';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: ''
      });
    }, 3000);
  };

  const contactMethods = [
    {
      icon: EnvelopeIcon,
      title: 'Email Support',
      description: 'Get help with your account or technical issues',
      contact: 'infomeryt0@gmail.com',
      responseTime: 'Within 24 hours',
      bgColor: 'from-blue-600/20 to-cyan-500/20',
      borderColor: 'border-blue-500/30'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      contact: 'Available 9AM - 6PM EST',
      responseTime: 'Instant response',
      bgColor: 'from-green-600/20 to-emerald-500/20',
      borderColor: 'border-green-500/30'
    },
    {
      icon: UserCircleIcon,
      title: 'Community Support',
      description: 'Connect with other creators and get community help',
      contact: 'Join our Discord',
      responseTime: '24/7 community',
      bgColor: 'from-purple-600/20 to-pink-500/20',
      borderColor: 'border-purple-500/30'
    },
    {
      icon: MapPinIcon,
      title: 'Remote First',
      description: 'Global Digital Headquarters',
      contact: 'Operating Worldwide',
      responseTime: 'Mon-Fri 9AM-5PM EST',
      bgColor: 'from-orange-600/20 to-red-500/20',
      borderColor: 'border-orange-500/30'
    }
  ];

  const socialLinks = [
    { icon: FaYoutube, name: 'YouTube', url: 'https://www.youtube.com/@devilxdeath', color: 'hover:text-red-400', bgColor: 'bg-red-600' }
  ];

  const faqItems = [

    {
      icon: BugAntIcon,
      question: 'I found a bug, how do I report it?',
      answer: 'Please use our contact form and select "Bug Report" as the category. Include as much detail as possible about the issue, including screenshots if helpful.'
    },
    {
      icon: LightBulbIcon,
      question: 'Can I suggest new features?',
      answer: 'Absolutely! We love hearing from our community. Use the contact form with "Feature Request" category or join our Discord to discuss ideas with other users.'
    },
    {
      icon: HeartIcon,
      question: 'How can I support the project?',
      answer: 'You can support us by sharing our platform with other creators, providing feedback, contributing to our community, and using our affiliate links when available.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <PageSEO
        title="Contact Us - EditorVault Support"
        description="Get in touch with EditorVault. Support for creators, bug reports, and feature requests."
        keywords={['contact editorvault', 'support', 'customer service', 'bug report']}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact Us",
          "description": "Get in touch with EditorVault support.",
          "url": "https://editorvault.web.app/contact",
          "mainEntity": {
            "@type": "Organization",
            "name": "EditorVault",
            "email": "infomeryt0@gmail.com"
          }
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Contact', url: '/contact' }
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 mb-6">
            Get In Touch
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Have questions, feedback, or need support? We're here to help you succeed.
            Our team is passionate about helping creators achieve their goals.
          </p>
        </motion.div>

        {/* Contact Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className={`bg-gradient-to-br ${method.bgColor} backdrop-blur-lg border ${method.borderColor} rounded-2xl p-6 hover:scale-105 transition-all duration-300 group`}
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-white/10 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{method.title}</h3>
                </div>
                <p className="text-gray-300 mb-4 leading-relaxed">{method.description}</p>
                <div className="space-y-2">
                  <p className="text-cyan-400 font-medium">{method.contact}</p>
                  <p className="text-sm text-gray-400 flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {method.responseTime}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-8"
          >
            <div className="flex items-center mb-6">
              <EnvelopeIcon className="h-8 w-8 text-cyan-400 mr-3" />
              <h2 className="text-3xl font-bold text-white">Send us a Message</h2>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <CheckCircleIcon className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-gray-300">
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="asset">Asset Request</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="Brief description of your message"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${isSubmitting
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 shadow-lg hover:shadow-cyan-500/25'
                    }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Message...
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* FAQ and Social Links */}
          <div className="space-y-8">
            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-8"
            >
              <div className="flex items-center mb-6">
                <QuestionMarkCircleIcon className="h-8 w-8 text-yellow-400 mr-3" />
                <h2 className="text-3xl font-bold text-white">Frequently Asked</h2>
              </div>

              <div className="space-y-4">
                {faqItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      className="border border-gray-700/50 rounded-lg p-4 hover:border-yellow-500/30 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <Icon className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-white mb-2">{item.question}</h3>
                          <p className="text-gray-300 text-sm leading-relaxed">{item.answer}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-8"
            >
              <div className="flex items-center mb-6">
                <GlobeAltIcon className="h-8 w-8 text-green-400 mr-3" />
                <h2 className="text-3xl font-bold text-white">Connect With Us</h2>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                Join our growing community of creators! Get updates, share your work, and connect with fellow video editors.
              </p>

              <div className="w-full">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon as React.ComponentType<{ className?: string }>;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      className={`flex items-center justify-center space-x-3 p-4 ${social.bgColor} rounded-lg text-white hover:scale-105 transition-all duration-300 group w-full`}
                    >
                      <IconComponent className="h-6 w-6" />
                      <span className="font-semibold text-lg">{social.name}</span>
                    </motion.a>
                  );
                })}
              </div>

              <div className="mt-8 p-4 bg-green-600/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 font-medium text-sm">Community Status</span>
                </div>
                <p className="text-gray-300 text-sm">
                  <strong>1,247</strong> active creators • <strong>24/7</strong> community support • <strong>Growing daily</strong>
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Leaderboard Ad */}
        <LeaderboardAd className="mb-8" />

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center bg-gradient-to-r from-purple-600/10 to-cyan-500/10 border border-purple-500/20 rounded-2xl p-8 backdrop-blur-lg"
        >
          <span className="text-5xl mb-4 block">💬</span>
          <h3 className="text-3xl font-bold text-white mb-4">
            We Value Your Feedback
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
            Your input helps us improve EditorVault for everyone. Whether it's a bug report,
            feature suggestion, or just a friendly hello, we'd love to hear from you!
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <ClockIcon className="h-4 w-4" />
              <span>24h response time</span>
            </div>
            <div className="flex items-center space-x-1">
              <HeartIcon className="h-4 w-4" />
              <span>Made with love</span>
            </div>
            <div className="flex items-center space-x-1">
              <GlobeAltIcon className="h-4 w-4" />
              <span>Global community</span>
            </div>
          </div>
        </motion.div>

        {/* Helpful Links - SEO Internal Linking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 text-center bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-lg"
        >
          <h3 className="text-2xl font-bold text-white mb-6">Explore More</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/faq"
              className="px-6 py-3 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 rounded-lg text-white hover:from-purple-600/30 hover:to-cyan-600/30 transition-all font-semibold"
            >
              View FAQ
            </Link>
            <Link
              to="/blog"
              className="px-6 py-3 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 rounded-lg text-white hover:from-purple-600/30 hover:to-cyan-600/30 transition-all font-semibold"
            >
              Read Our Blog
            </Link>
            <Link
              to="/about"
              className="px-6 py-3 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 rounded-lg text-white hover:from-purple-600/30 hover:to-cyan-600/30 transition-all font-semibold"
            >
              About Us
            </Link>
            <Link
              to="/store"
              className="px-6 py-3 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 rounded-lg text-white hover:from-purple-600/30 hover:to-cyan-600/30 transition-all font-semibold"
            >
              Browse Assets
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
