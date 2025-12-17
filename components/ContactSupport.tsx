import React, { useState } from 'react';
import { ArrowLeft, Mail, Send } from 'lucide-react';

interface ContactSupportProps {
  onBack: () => void;
}

export const ContactSupport: React.FC<ContactSupportProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      
      // Create mailto link with form data
      const mailtoLink = `mailto:digworldai@outlook.com?subject=${encodeURIComponent(formData.subject || 'Support Request')}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )}`;
      window.location.href = mailtoLink;
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-mono uppercase tracking-wider">Back to Home</span>
          </button>

          <div className="bg-[#0a0a0a] border border-zinc-900 p-8 md:p-12 rounded-sm text-center">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">Message Sent</h2>
            <p className="text-zinc-400 mb-6">
              Your message has been prepared. Your email client should open shortly. If it doesn't, please send your message directly to:
            </p>
            <a 
              href="mailto:digworldai@outlook.com" 
              className="text-premium font-mono text-lg hover:text-white transition-colors inline-block"
            >
              digworldai@outlook.com
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-mono uppercase tracking-wider">Back to Home</span>
        </button>

        <div className="bg-[#0a0a0a] border border-zinc-900 p-8 md:p-12 rounded-sm">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-premium">
            Contact Support
          </h1>
          <p className="text-zinc-500 text-sm font-mono mb-8">
            Have a question or need assistance? We're here to help.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-white uppercase tracking-wider mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-black border border-zinc-800 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors font-mono"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-white uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-black border border-zinc-800 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors font-mono"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-bold text-white uppercase tracking-wider mb-2">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full bg-black border border-zinc-800 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors font-mono"
              >
                <option value="">Select a subject</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Billing Question">Billing Question</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Bug Report">Bug Report</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Partnership">Partnership</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-bold text-white uppercase tracking-wider mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={8}
                className="w-full bg-black border border-zinc-800 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors font-mono resize-none"
                placeholder="Please describe your question or issue in detail..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-black hover:bg-zinc-200 transition-colors py-4 px-6 font-black uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-zinc-900">
            <p className="text-zinc-500 text-sm mb-2">Or contact us directly:</p>
            <a 
              href="mailto:digworldai@outlook.com" 
              className="text-premium font-mono hover:text-white transition-colors flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              digworldai@outlook.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
