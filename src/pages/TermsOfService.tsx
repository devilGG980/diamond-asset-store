import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const TermsOfService: React.FC = () => {
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
          <h1 className="text-4xl font-bold text-gradient mb-4">Terms of Service</h1>
          <p className="text-gray-400">Last updated: October 1, 2024</p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card prose prose-invert max-w-none"
        >
          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Video Forge, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Service Description</h2>
              <p>
                Video Forge is a digital marketplace that provides premium video editing assets including transitions, animations, 
                music tracks, and backgrounds for content creators, video editors, and digital professionals.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
              <p>
                To access certain features of our service, you may be required to create an account. You are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Maintaining the confidentiality of your account information</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>Providing accurate and complete information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Diamond Currency System</h2>
              <p>
                Our platform uses a virtual currency system called "Diamonds" for purchasing assets. By using this system, you agree that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Diamonds have no real-world monetary value</li>
                <li>Diamonds cannot be exchanged for cash or other currencies</li>
                <li>Diamond balances are non-transferable between accounts</li>
                <li>We reserve the right to modify the Diamond system at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Asset Licensing</h2>
              <p>
                When you purchase assets from Video Forge, you receive a limited license to use the content. This license includes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Commercial and personal use rights</li>
                <li>Right to modify and edit the assets</li>
                <li>Right to use in unlimited projects</li>
                <li>Maximum of 2 downloads per purchase</li>
              </ul>
              <p className="mt-4">
                <strong>You may NOT:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Resell, redistribute, or share the original files</li>
                <li>Claim ownership of the original assets</li>
                <li>Use assets in illegal or harmful content</li>
                <li>Reverse engineer or extract components for redistribution</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. User Conduct</h2>
              <p>You agree not to use our service to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Upload or share malicious content</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on the rights of others</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the normal operation of our service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Advertisement Policy</h2>
              <p>
                Video Forge displays third-party advertisements to support our free services. By using our platform, you acknowledge that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Advertisements are provided by third-party networks</li>
                <li>We are not responsible for the content or accuracy of ads</li>
                <li>Ad-blocking software may affect your user experience</li>
                <li>Revenue from ads helps keep our services free</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Refund Policy</h2>
              <p>
                Due to the digital nature of our products, all sales are final. However, we may provide refunds in the following cases:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Technical issues preventing download</li>
                <li>Significant quality issues with the asset</li>
                <li>Duplicate purchases made within 24 hours</li>
              </ul>
              <p>
                Refund requests must be made within 7 days of purchase and will be reviewed on a case-by-case basis.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Limitation of Liability</h2>
              <p>
                Video Forge and its affiliates shall not be liable for any direct, indirect, incidental, special, consequential, 
                or punitive damages resulting from your use of our service, including but not limited to lost profits, data, 
                or business interruption.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Modifications to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. 
                Continued use of our service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-800 p-4 rounded-lg mt-4">
                <p><strong>Email:</strong> legal@videoforges.web.app</p>
                <p><strong>Address:</strong> Video Forge, Digital Media Services</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;