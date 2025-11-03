import React, { useState, FormEvent } from 'react';

import { Link } from 'react-router-dom';


interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface FooterSection {
  title: string;
  links: { title: string; path: string; }[];
}

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const socialLinks: SocialLink[] = [
    { platform: 'Facebook', url: 'https://facebook.com/urbancoll', icon: 'fab fa-facebook' },
    { platform: 'Twitter', url: 'https://twitter.com/urbancoll', icon: 'fab fa-twitter' },
    { platform: 'Instagram', url: 'https://instagram.com/urbancoll', icon: 'fab fa-instagram' }
  ];

  const footerSections: FooterSection[] = [
    {
      title: 'Quick Links',
      links: [
        { title: 'About Us', path: '/about' },
        { title: 'Contact', path: '/contact' },
        { title: 'Become a Vendor', path: '/vendors' },
        { title: 'FAQ', path: '/faq' }
      ]
    },
    {
      title: 'Customer Service',
      links: [
        { title: 'Shipping Information', path: '/shipping' },
        { title: 'Returns Policy', path: '/returns' },
        { title: 'Privacy Policy', path: '/privacy' },
        { title: 'Terms & Conditions', path: '/terms' }
      ]
    }
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Implement newsletter subscription
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setMessage({ text: 'Successfully subscribed!', isError: false });
      setEmail('');
    } catch (error) {
      setMessage({ text: 'Failed to subscribe. Please try again.', isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">About UrbanColl</h3>
            <p className="mb-4">Nigerias marketplace for authentic local products and crafts.</p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={`Visit our ${social.platform} page`}
                >
                  <i className={`${social.icon} text-xl`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-white text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.path}
                      className="hover:text-white transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Section */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Newsletter</h3>
            <p className="mb-4">Subscribe for updates and exclusive offers!</p>
            <form onSubmit={handleSubmit} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
                disabled={isSubmitting}
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {message && (
              <p className={`mt-2 text-sm ${message.isError ? 'text-red-400' : 'text-green-400'}`}>
                {message.text}
              </p>
            )}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} UrbanColl Marketplace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;