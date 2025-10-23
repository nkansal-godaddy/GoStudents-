'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthProvider';

const CURATED_OFFERS = [
  {
    id: "hackathonGoStudentsWebDesign-webHostingEconomy-conversationsEssential",
    title: "Curriculum 1 — Web Design",
    subtitle: "Web Hosting Economy, Conversations Essentials",
    badge: "6-month CMAT Free Trial",
    description: "Complete web design toolkit for students learning web development",
    benefits: [
      "Web Hosting Economy plan (6 months free)",
      "Conversations Essentials for customer engagement",
      "Professional web hosting infrastructure",
      "Customer communication tools",
      "Perfect for portfolio projects"
    ]
  },
  {
    id: "hackathonGoStudentsWebsiteSecurity-mwpBasic-nortonSmallBusinessStandard",
    title: "Curriculum 2 — Website Security",
    subtitle: "MWP Basic, Norton",
    badge: "6-month CMAT Free Trial",
    description: "Essential security tools for protecting websites and business data",
    benefits: [
      "MWP Basic security features (6 months free)",
      "Norton Small Business Standard protection",
      "Website security monitoring",
      "Business data protection",
      "Security best practices training"
    ]
  },
  {
    id: "hackathonGoStudentsBusineesAi-wamCommerce-airoAllAccess",
    title: "Curriculum 3 — Building Businesses with AI",
    subtitle: "WAM Commerce, Airo Plus",
    badge: "6-month CMAT Free Trial",
    description: "AI-powered business tools for modern entrepreneurship",
    benefits: [
      "WAM Commerce e-commerce platform (6 months free)",
      "Airo Plus AI assistant tools",
      "Advanced e-commerce features",
      "AI-powered business automation",
      "Modern business technology stack"
    ]
  }
];

export default function OfferPage() {
  const searchParams = useSearchParams();
  const schoolId = searchParams.get('school') || '';
  const { customerId, shopperId, email, isAuthenticated } = useAuth();
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Log decoded details for verification
  useEffect(() => {
    if (isAuthenticated) {
      console.log('Decoded JWT details:', {
        customerId,
        shopperId,
        email,
        isAuthenticated
      });
    }
  }, [customerId, shopperId, email, isAuthenticated]);

  const handleSelectOffer = async (offerId: string) => {
    setSelectedOfferId(offerId);
    setShowToast(true);
    
    // Send curriculum-specific welcome email
    try {
      const response = await fetch('/api/curriculum-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerId,
          schoolId,
          email,
          customerId,
          shopperId
        })
      });

      const data = await response.json();
      
      if (data.status === 'ok') {
        console.log('✅ Curriculum-specific email sent successfully:', data.message);
      } else {
        console.error('❌ Email sending failed:', data.message);
      }
    } catch (error) {
      console.error('❌ Error sending curriculum email:', error);
    }
    
    // Hide toast after 3 seconds
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Student Curated Offers
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Exclusive 6-month free trials for ISBAT students
          </p>
          
          {/* User Info */}
          {isAuthenticated && (
            <div className="space-y-2">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                ✓ Signed in as {email}
              </div>
              <div className="text-center text-xs text-gray-600">
                Customer ID: {customerId} | Shopper ID: {shopperId}
              </div>
            </div>
          )}
        </div>

        {/* Not Signed In Banner */}
        {!isAuthenticated && (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-center">
              Sign up on the previous page to claim your free student offer.
            </p>
          </div>
        )}

        {/* Curated Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CURATED_OFFERS.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Offer Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {offer.title}
                  </h3>
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                    {offer.badge}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">
                  {offer.subtitle}
                </p>
                <p className="text-sm text-gray-700">
                  {offer.description}
                </p>
              </div>

              {/* Benefits */}
              <div className="p-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">What's Included:</h4>
                <ul className="space-y-2">
                  {offer.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-start text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => handleSelectOffer(offer.id)}
                  disabled={!isAuthenticated}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    isAuthenticated 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isAuthenticated ? 'Select' : 'Sign in to select'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Success Toast */}
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            ✓ Offer selected successfully!
          </motion.div>
        )}
      </div>
    </div>
  );
}
