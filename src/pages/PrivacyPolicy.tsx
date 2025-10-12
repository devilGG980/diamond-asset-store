import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const PrivacyPolicy: React.FC = () => {
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
          <h1 className="text-4xl font-bold text-gradient mb-4">Privacy Policy</h1>
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
              <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
              <p>
                At Video Forge, we collect information you provide directly to us, such as when you create an account, 
                make a purchase, or contact us. This may include your name, email address, and payment information.
              </p>
              <p>
                We also automatically collect certain information when you use our service, including your IP address, 
                browser type, operating system, and usage data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Analyze usage patterns and trends</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Information Sharing</h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share your information 
                in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>With your consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
                <li>In connection with a business transaction</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to collect and track information and to improve our service. 
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
              <h3 className="text-lg font-semibold text-white mt-4 mb-2">Google AdSense</h3>
              <p>
                We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior 
                visits to this website or other websites. You can opt out of personalized advertising by visiting 
                <a href="https://www.google.com/settings/ads" className="text-blue-400 hover:text-blue-300"> Google's ad settings</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information against unauthorized access, 
                alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access and update your personal information</li>
                <li>Request deletion of your personal information</li>
                <li>Object to processing of your personal information</li>
                <li>Request portability of your personal information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Children's Privacy</h2>
              <p>
                Our service is not intended for children under 13. We do not knowingly collect personal information from 
                children under 13. If you are a parent or guardian and believe your child has provided us with personal 
                information, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new 
                privacy policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy, please contact us at:
              </p>
              <div className="bg-gray-800 p-4 rounded-lg mt-4">
                <p><strong>Email:</strong> privacy@videoforges.web.app</p>
                <p><strong>Address:</strong> Video Forge, Digital Media Services</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;