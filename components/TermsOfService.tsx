import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface TermsOfServiceProps {
  onBack: () => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({ onBack }) => {
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
            Terms of Service
          </h1>
          <p className="text-zinc-500 text-sm font-mono mb-8">Last Updated: January 2025</p>

          <div className="space-y-8 text-zinc-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing and using InkGenius Pro ("the Service"), you accept and agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">2. Description of Service</h2>
              <p className="mb-4">
                InkGenius Pro is an AI-powered platform that provides tattoo design generation, stencil creation, anatomy mapping, and cover-up analysis tools for professional tattoo artists and studios.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">3. User Accounts</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">3.1 Account Creation</h3>
                  <p className="mb-2">To use certain features of the Service, you must create an account. You agree to:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-zinc-400">
                    <li>Provide accurate, current, and complete information</li>
                    <li>Maintain and update your information to keep it accurate</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Accept responsibility for all activities under your account</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">3.2 Account Termination</h3>
                  <p>We reserve the right to suspend or terminate your account at any time for violation of these Terms or for any other reason we deem necessary.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">4. Acceptable Use</h2>
              <p className="mb-4">You agree not to:</p>
              <ul className="list-disc list-inside ml-4 space-y-2 text-zinc-400">
                <li>Use the Service for any illegal purpose or in violation of any laws</li>
                <li>Upload content that infringes on intellectual property rights</li>
                <li>Upload content that is offensive, harmful, or violates others' rights</li>
                <li>Attempt to reverse engineer, decompile, or hack the Service</li>
                <li>Use automated systems to access the Service without authorization</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Impersonate any person or entity</li>
                <li>Collect user information without consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">5. Intellectual Property</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">5.1 Service Ownership</h3>
                  <p>The Service, including all software, designs, text, graphics, and other content, is owned by InkGenius Pro and protected by copyright, trademark, and other intellectual property laws.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">5.2 User Content</h3>
                  <p className="mb-2">You retain ownership of content you upload to the Service. By uploading content, you grant us a license to:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-zinc-400">
                    <li>Use, process, and store your content to provide the Service</li>
                    <li>Create derivative works (e.g., generated designs) based on your content</li>
                    <li>Display your content within the Service</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">5.3 Generated Designs</h3>
                  <p>Designs generated by the Service are provided for your use. You are responsible for ensuring that generated designs do not infringe on third-party rights and comply with applicable laws.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">6. Payment and Billing</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">6.1 Subscription Plans</h3>
                  <p>The Service may offer subscription plans with different features and pricing. All fees are stated in the currency specified and are non-refundable unless otherwise stated.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">6.2 Payment Processing</h3>
                  <p>Payments are processed through secure third-party payment processors. You agree to provide accurate payment information and authorize us to charge your payment method.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">6.3 Refunds</h3>
                  <p>Refund policies are subject to the specific terms of your subscription plan. Contact support for refund requests.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">7. Service Availability</h2>
              <p className="mb-4">
                We strive to maintain high availability of the Service but do not guarantee uninterrupted access. The Service may be unavailable due to maintenance, updates, or unforeseen circumstances. We are not liable for any downtime.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">8. Disclaimers</h2>
              <p className="mb-4">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">9. Limitation of Liability</h2>
              <p className="mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, INKGENIUS PRO SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">10. Indemnification</h2>
              <p className="mb-4">
                You agree to indemnify and hold harmless InkGenius Pro, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the Service or violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">11. Professional Use Disclaimer</h2>
              <p className="mb-4">
                While our tools are designed to assist professional tattoo artists, you are solely responsible for:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2 text-zinc-400">
                <li>Ensuring designs comply with local regulations and health standards</li>
                <li>Obtaining proper client consent and documentation</li>
                <li>Verifying the suitability of designs for specific applications</li>
                <li>Maintaining professional standards and best practices</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">12. Modifications to Terms</h2>
              <p className="mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of material changes via email or through the Service. Continued use of the Service after changes constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">13. Termination</h2>
              <p className="mb-4">
                Either party may terminate access to the Service at any time. Upon termination, your right to use the Service will immediately cease. We may delete your account and data in accordance with our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">14. Governing Law</h2>
              <p className="mb-4">
                These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">15. Contact Information</h2>
              <p className="mb-4">
                For questions about these Terms of Service, please contact us at:
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
