import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import PageSEO from '../components/SEO/PageSEO';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen p-4">
      <PageSEO
        title="Terms of Service - EditorVault"
        description="Read our Terms of Service for using EditorVault video editing assets."
      />
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
          <p className="text-gray-400">Last updated: November 23, 2024</p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card prose prose-invert max-w-none"
        >
          <div className="text-gray-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using EditorVault, you accept and agree to be bound by the terms and provision of this agreement.
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Service Description</h2>
              <p>
                EditorVault is a digital marketplace that provides premium video editing assets including transitions, animations,
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
              <h2 className="text-2xl font-bold text-white mb-4">4. Asset Licensing</h2>
              <p>
                When you purchase assets from EditorVault, you receive a limited license to use the content. This license includes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Commercial and personal use rights</li>
                <li>Right to modify and edit the assets</li>
                <li>Right to use in unlimited projects</li>
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
              <h2 className="text-2xl font-bold text-white mb-4">5. User Conduct</h2>
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
              <h2 className="text-2xl font-bold text-white mb-4">6. Advertisement Policy</h2>
              <p>
                EditorVault displays third-party advertisements to support our free services. By using our platform, you acknowledge that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Advertisements are provided by third-party networks</li>
                <li>We are not responsible for the content or accuracy of ads</li>
                <li>Ad-blocking software may affect your user experience</li>
                <li>Revenue from ads helps keep our services free</li>
              </ul>
            </section>



            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Limitation of Liability</h2>
              <p>
                EditorVault and its affiliates shall not be liable for any direct, indirect, incidental, special, consequential,
                or punitive damages resulting from your use of our service, including but not limited to lost profits, data,
                or business interruption.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Modifications to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.
                Continued use of our service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Intellectual Property Rights</h2>
              <p>
                All content on EditorVault, including but not limited to text, graphics, logos, icons, images,
                audio clips, video clips, digital downloads, and software, is the property of EditorVault or
                its content suppliers and is protected by international copyright laws.
              </p>

              <h3 className="text-lg font-semibold text-white mt-4 mb-2">Our Intellectual Property</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Platform design, code, and functionality</li>
                <li>EditorVault branding, logos, and trademarks</li>
                <li>Original content created by our team</li>
                <li>Database structure and organization</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mt-4 mb-2">Asset Creator Rights</h3>
              <p>
                Assets available on our platform are provided by various creators who retain copyright ownership.
                Your license to use these assets is subject to the terms specified for each asset.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Prohibited Content and Activities</h2>
              <p>
                To maintain a safe and compliant platform, the following content and activities are strictly prohibited:
              </p>

              <h3 className="text-lg font-semibold text-white mt-4 mb-2">Prohibited Content Types:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Adult Content:</strong> Pornography, sexually explicit material, or content intended for adult audiences</li>
                <li><strong>Violence:</strong> Excessive violence, gore, or content promoting harm to individuals or animals</li>
                <li><strong>Hate Speech:</strong> Content promoting discrimination, racism, or hatred against any group</li>
                <li><strong>Illegal Activities:</strong> Content promoting illegal drugs, weapons, or criminal activity</li>
                <li><strong>Pirated Material:</strong> Copyrighted content without proper authorization or licensing</li>
                <li><strong>Malicious Software:</strong> Viruses, malware, or any harmful code</li>
                <li><strong>Deceptive Content:</strong> Misleading information, scams, or fraudulent material</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mt-4 mb-2">Prohibited Activities:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Attempting to hack, breach, or compromise our security</li>
                <li>Scraping or automated data collection without permission</li>
                <li>Impersonating others or creating fake accounts</li>
                <li>Spamming or sending unsolicited communications</li>
                <li>Circumventing access controls or payment systems</li>
              </ul>

              <p className="mt-4 text-yellow-400">
                <strong>Violation Consequences:</strong> Users who violate these terms may have their accounts
                suspended or terminated without refund, and may be reported to appropriate authorities.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Content Authenticity and Quality</h2>
              <p>
                We are committed to providing only original, high-quality content:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>No Scraped Content:</strong> All assets are original creations or properly licensed</li>
                <li><strong>No Spun Content:</strong> We do not use automated content generation or "spinning"</li>
                <li><strong>Quality Standards:</strong> All assets undergo quality review before publication</li>
                <li><strong>Proper Attribution:</strong> Credits are given where required by license agreements</li>
                <li><strong>Original Value:</strong> Each asset provides unique value to users</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">12. Disclaimer of Warranties</h2>
              <p>
                EDITORVAULT AND ITS SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
                EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Warranties of merchantability and fitness for a particular purpose</li>
                <li>Warranties regarding the accuracy, reliability, or completeness of content</li>
                <li>Warranties that the service will be uninterrupted, secure, or error-free</li>
                <li>Warranties regarding the compatibility of assets with specific software</li>
              </ul>
              <p className="mt-4">
                While we strive for quality and reliability, we cannot guarantee that all assets will meet your
                specific needs or work in all environments.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">13. Copyright Infringement Claims (DMCA)</h2>
              <p>
                We respect intellectual property rights. If you believe content on our platform infringes your
                copyright, please provide:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your contact information (name, address, email, phone)</li>
                <li>Description of the copyrighted work you claim has been infringed</li>
                <li>URL or location of the allegedly infringing content on our site</li>
                <li>A statement that you have a good faith belief the use is unauthorized</li>
                <li>A statement that your notice is accurate and you are authorized to act</li>
                <li>Your physical or electronic signature</li>
              </ul>
              <p className="mt-4">
                Send DMCA notices to: <strong>legal@editorvault.web.app</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">14. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless EditorVault, its affiliates, officers,
                directors, employees, and agents from any claims, liabilities, damages, losses, costs, or
                expenses (including reasonable attorneys' fees) arising from:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your use of our service</li>
                <li>Your violation of these Terms of Service</li>
                <li>Your violation of any third-party rights</li>
                <li>Your content or activities on our platform</li>
                <li>Your breach of applicable laws or regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">15. Dispute Resolution and Arbitration</h2>
              <p>
                For any disputes arising from these Terms or your use of our service:
              </p>

              <h3 className="text-lg font-semibold text-white mt-4 mb-2">Informal Resolution</h3>
              <p>
                Before pursuing formal dispute resolution, please contact us at legal@editorvault.web.app to
                attempt to resolve the issue informally.
              </p>

              <h3 className="text-lg font-semibold text-white mt-4 mb-2">Arbitration Agreement</h3>
              <p>
                If informal resolution fails, you agree that disputes will be resolved through binding arbitration
                rather than in court, except where prohibited by law. This means:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>No jury trials</li>
                <li>No class actions (individual arbitration only)</li>
                <li>Limited discovery procedures</li>
                <li>Arbitrator's decision is final and binding</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">16. Governing Law and Jurisdiction</h2>
              <p>
                These Terms of Service shall be governed by and construed in accordance with applicable laws,
                without regard to conflicts of law principles. Any legal action or proceeding shall be brought
                exclusively in courts of competent jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">17. Severability</h2>
              <p>
                If any provision of these Terms is found to be invalid, illegal, or unenforceable, that provision
                shall be modified to the minimum extent necessary to make it enforceable, or if that is not possible,
                it shall be severed from these Terms. The remaining provisions shall continue in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">18. Entire Agreement</h2>
              <p>
                These Terms of Service, together with our Privacy Policy and any other legal notices published
                on our platform, constitute the entire agreement between you and EditorVault concerning your
                use of our service and supersede all prior agreements and understandings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">19. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-800 p-6 rounded-lg mt-4 space-y-3">
                <p><strong className="text-white">Legal Inquiries:</strong> legal@editorvault.web.app</p>
                <p><strong className="text-white">General Support:</strong> support@editorvault.web.app</p>
                <p><strong className="text-white">Business Name:</strong> EditorVault</p>
                <p><strong className="text-white">Service Type:</strong> Digital Media Services</p>
                <p className="text-sm text-gray-400 pt-3 border-t border-gray-700">
                  We aim to respond to all inquiries within 5-7 business days. For urgent legal matters,
                  please mark your email as "URGENT - Legal Issue."
                </p>
              </div>
            </section>

            <section className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-6 rounded-lg border border-purple-700/30">
              <h2 className="text-2xl font-bold text-white mb-4">Important Reminders</h2>
              <ul className="space-y-2 text-sm">
                <li>✓ You must be 13 or older to use our service</li>
                <li>✓ Downloaded assets may be used commercially with proper license</li>
                <li>✓ Do not resell or redistribute original asset files</li>
                <li>✓ We reserve the right to modify features</li>
                <li>✓ By using our service, you accept all terms and conditions</li>
              </ul>
            </section>
          </div>
        </motion.div>

        {/* Helpful Links - SEO Internal Linking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 card text-center"
        >
          <h3 className="text-xl font-bold text-white mb-4">Related Pages</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/privacy-policy"
              className="px-6 py-2 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 rounded-lg text-white hover:from-purple-600/30 hover:to-cyan-600/30 transition-all"
            >
              Privacy Policy
            </Link>
            <Link
              to="/contact"
              className="px-6 py-2 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 rounded-lg text-white hover:from-purple-600/30 hover:to-cyan-600/30 transition-all"
            >
              Contact Us
            </Link>
            <Link
              to="/faq"
              className="px-6 py-2 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 rounded-lg text-white hover:from-purple-600/30 hover:to-cyan-600/30 transition-all"
            >
              FAQ
            </Link>
            <Link
              to="/"
              className="px-6 py-2 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 rounded-lg text-white hover:from-purple-600/30 hover:to-cyan-600/30 transition-all"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;

