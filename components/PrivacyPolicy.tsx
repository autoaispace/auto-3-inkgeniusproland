import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-black text-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-mono uppercase tracking-wider">Back to Home</span>
        </button>

        <div className="bg-[#0a0a0a] border border-zinc-900 p-8 md:p-12 rounded-sm">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-premium">
            Privacy Policy
          </h1>
          <p className="text-zinc-500 text-sm font-mono mb-8">Last Updated: January 2025</p>

          <div className="space-y-8 text-zinc-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">1. Introduction</h2>
              <p className="mb-4">
                InkGenius Pro ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our tattoo design generation platform and related services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">2. Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">2.1 Personal Information</h3>
                  <p className="mb-2">We may collect personal information that you provide directly to us, including:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-zinc-400">
                    <li>Email address</li>
                    <li>Name and contact information</li>
                    <li>Payment information (processed through secure third-party providers)</li>
                    <li>Account credentials</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">2.2 Usage Data</h3>
                  <p>We automatically collect information about how you interact with our services, including:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-zinc-400 mt-2">
                    <li>Design generation history and preferences</li>
                    <li>Device information and browser type</li>
                    <li>IP address and location data</li>
                    <li>Session duration and feature usage</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">2.3 Image Data</h3>
                  <p>When you upload images for design generation, stencil creation, or try-on features, we temporarily process and store these images to provide our services. Images are encrypted and stored securely.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">3. How We Use Your Information</h2>
              <p className="mb-4">We use the collected information for the following purposes:</p>
              <ul className="list-disc list-inside ml-4 space-y-2 text-zinc-400">
                <li>To provide, maintain, and improve our services</li>
                <li>To process transactions and send related information</li>
                <li>To send technical notices, updates, and support messages</li>
                <li>To respond to your comments, questions, and requests</li>
                <li>To monitor and analyze usage patterns and trends</li>
                <li>To detect, prevent, and address technical issues</li>
                <li>To personalize your experience and provide tailored content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">4. Data Sharing and Disclosure</h2>
              <p className="mb-4">We do not sell your personal information. We may share your information only in the following circumstances:</p>
              <ul className="list-disc list-inside ml-4 space-y-2 text-zinc-400">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations or respond to lawful requests</li>
                <li>To protect our rights, privacy, safety, or property</li>
                <li>With service providers who assist in operating our platform (under strict confidentiality agreements)</li>
                <li>In connection with a business transfer or merger</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">5. Data Security</h2>
              <p className="mb-4">
                We implement industry-standard security measures to protect your information, including encryption, secure servers, and access controls. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">6. Data Retention</h2>
              <p className="mb-4">
                We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">7. Your Rights</h2>
              <p className="mb-4">Depending on your location, you may have the following rights:</p>
              <ul className="list-disc list-inside ml-4 space-y-2 text-zinc-400">
                <li>Access and receive a copy of your personal data</li>
                <li>Rectify inaccurate or incomplete data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">8. Cookies and Tracking Technologies</h2>
              <p className="mb-4">
                We use cookies and similar tracking technologies to track activity on our platform and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">9. Third-Party Links</h2>
              <p className="mb-4">
                Our platform may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">10. Children's Privacy</h2>
              <p className="mb-4">
                Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">11. Changes to This Policy</h2>
              <p className="mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">12. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-premium font-mono">
                Email: <a href="mailto:digworldai@outlook.com" className="hover:text-white transition-colors">digworldai@outlook.com</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
