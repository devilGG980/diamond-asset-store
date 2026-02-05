import React from 'react';
import PageSEO from '../components/SEO/PageSEO';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto p-4">
      <PageSEO
        title="Privacy Policy - EditorVault"
        description="Read our Privacy Policy regarding data collection and usage."
      />
      <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
        <h3 className="text-lg font-semibold text-white mt-4 mb-2">1.1 Information You Provide</h3>
        <p>
          When you interact with our platform, we may collect:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Name and email address</li>
          <li>Payment information (processed securely by third-party providers)</li>
          <li>Profile information and preferences</li>
          <li>Communications you send to us</li>
        </ul>

        <h3 className="text-lg font-semibold text-white mt-4 mb-2">1.2 Automatically Collected Information</h3>
        <p>When you use our service, we automatically collect:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>IP address and device information</li>
          <li>Browser type, version, and language settings</li>
          <li>Operating system and screen resolution</li>
          <li>Pages visited, time spent, and navigation patterns</li>
          <li>Referring website or source</li>
          <li>Clickstream data and interaction events</li>
        </ul>

        <h3 className="text-lg font-semibold text-white mt-4 mb-2">1.3 Cookies and Tracking Technologies</h3>
        <p>
          We use cookies, web beacons, pixels, and similar technologies to enhance your experience
          and analyze site usage. See our detailed Cookie Policy section below.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
        <p>We use collected information for the following purposes:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Service Delivery:</strong> To provide, maintain, and improve our platform and services</li>
          <li><strong>Transactions:</strong> To process purchases and send transaction confirmations</li>
          <li><strong>Communication:</strong> To send technical notices, updates, security alerts, and support messages</li>
          <li><strong>Customer Support:</strong> To respond to your inquiries, comments, and questions</li>
          <li><strong>Analytics:</strong> To analyze usage patterns, trends, and user behavior</li>
          <li><strong>Marketing:</strong> To send promotional materials (with your consent where required)</li>
          <li><strong>Security:</strong> To detect, prevent, and address technical issues and fraud</li>
          <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our terms</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">3. Information Sharing and Disclosure</h2>
        <p>
          We do not sell, trade, or rent your personal information to third parties. We may share your
          information only in the following limited circumstances:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>With Your Consent:</strong> When you explicitly authorize us to share information</li>
          <li><strong>Service Providers:</strong> With trusted third-party vendors who assist in operating our platform (e.g., hosting, analytics, payment processing)</li>
          <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation</li>
          <li><strong>Protection of Rights:</strong> To protect our rights, property, safety, or that of our users</li>
          <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or sale of assets</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">4. Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to collect and track information about your
          browsing behavior and to improve our service.
        </p>

        <h3 className="text-lg font-semibold text-white mt-4 mb-2">Types of Cookies We Use:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Essential Cookies:</strong> Required for basic site functionality and security</li>
          <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our site</li>
          <li><strong>Functional Cookies:</strong> Remember your preferences and personalize your experience</li>
          <li><strong>Advertising Cookies:</strong> Used by our advertising partners to deliver relevant ads</li>
        </ul>

        <h3 className="text-lg font-semibold text-white mt-4 mb-2">Cookie Management</h3>
        <p>
          You can manage your cookie preferences through your browser settings. Disabling cookies may
          impact your experience on our platform.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">6. Data Security</h2>
        <p>
          We implement industry-standard security measures to protect your personal information against
          unauthorized access, alteration, disclosure, or destruction. Our security practices include:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Encryption of data in transit using SSL/TLS protocols</li>
          <li>Secure password storage using industry-standard hashing algorithms</li>
          <li>Regular security audits and vulnerability assessments</li>
          <li>Access controls and secure data centers</li>
          <li>Employee training on data protection and privacy</li>
        </ul>
        <p className="mt-4">
          However, no method of transmission over the internet or electronic storage is 100% secure.
          While we strive to protect your information, we cannot guarantee absolute security.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">7. Data Retention</h2>
        <p>
          We retain your personal information only for as long as necessary to fulfill the purposes
          outlined in this Privacy Policy or as required by law.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">11. Third-Party Links and Services</h2>
        <p>
          Our website may contain links to third-party websites, services, or applications. We are not responsible
          for the privacy practices of these third parties. We encourage you to read the privacy policies of any
          third-party services you visit or use.
        </p>

        <h3 className="text-lg font-semibold text-white mt-4 mb-2">Third-Party Services We Use:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Google Analytics:</strong> For website analytics and reporting</li>
          <li><strong>Google AdSense:</strong> For advertising services</li>
          <li><strong>Payment Processors:</strong> For secure payment processing</li>
          <li><strong>CDN Providers:</strong> For content delivery and performance optimization</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">12. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices or
          applicable laws. We encourage you to review this page periodically for the latest information.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;


