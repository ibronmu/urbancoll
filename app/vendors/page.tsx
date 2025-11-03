'use client';

import Header from '@/components/Header';

import { useState } from 'react';

const vendorBenefits = [
  {
    title: "Reach More Customers",
    description: "Access thousands of potential customers in Sokoto and beyond",
    icon: "👥"
  },
  {
    title: "Easy Setup",
    description: "Get your store up and running in minutes with our simple tools",
    icon: "⚡"
  },
  {
    title: "Secure Payments",
    description: "Receive payments securely through trusted payment gateways",
    icon: "💳"
  },
  {
    title: "Marketing Support",
    description: "We help promote your products to our growing customer base",
    icon: "📢"
  }
];

export default function VendorsPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle vendor application submission
    console.log('Vendor application:', formData);
    alert('Application submitted! We will contact you soon.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-secondary-600 py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Sell on UrbanColl
          </h1>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join Sokotos fastest growing marketplace and start selling to thousands of customers
          </p>
          <button 
            onClick={() => document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg"
          >
            Apply Now
          </button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Sell on UrbanColl?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {vendorBenefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="application" className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Vendor Application
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Name *
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type *
                </label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select business type</option>
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="food">Food & Snacks</option>
                  <option value="services">Services</option>
                  <option value="home">Home & Living</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="input-field"
                  placeholder="Tell us about your business and what you plan to sell..."
                  required
                />
              </div>
              
              <button type="submit" className="w-full btn-primary py-4">
                Submit Application
              </button>
              
              <p className="text-sm text-gray-600 text-center">
                
               Well review your application and get back to you within 2 business days
              </p>
            </form>
          </div>
        </div>
      </section>

      
    </div>
  );
}