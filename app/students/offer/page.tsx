'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthProvider';
import { CustomerInfo } from '@/components/CustomerInfo';

const CURATED_OFFERS = [
  {
    id: "hackathonGoStudentsWebDesign-webHostingEconomy-conversationsEssential",
    title: "Web Design Mastery",
    subtitle: "GIT 414 | Web Site Design and Internet/Web Technologies",
    icon: "🎨",
    gradient: "from-blue-500 to-purple-600",
    badge: "Free Access for the Semester",
    description: "Complete web design toolkit for students learning web development",
    price: "$0.00",
    originalPrice: "$299.00",
    benefits: [
      "WebHosting Economy plan (6 months free)",
      "Conversations Essentials for customer engagement", 
      "Professional web hosting infrastructure",
      "Customer communication tools",
      "Perfect for portfolio projects"
    ],
    tools: ["WebHosting", "Conversations", "SSL Certificate"]
  },
  {
    id: "hackathonGoStudentsWebsiteSecurity-mwpBasic-nortonSmallBusinessStandard", 
    title: "Website Security",
    subtitle: "CSE 466 | Computer Systems Security",
    icon: "🔒",
    gradient: "from-green-500 to-teal-600",
    badge: "Free Access for the Semester",
    description: "Essential security tools to help you learn the vulnerabilities of the internet",
    price: "$0.00",
    originalPrice: "$199.00",
    benefits: [
      "MWP Basic security features (6 months free)",
      "Norton Small Business Standard protection",
      "Website security monitoring",
      "Business data protection", 
      "Security best practices training"
    ],
    tools: ["MWP Basic", "Norton Security", "Monitoring"]
  },
  {
    id: "hackathonGoStudentsBusineesAi-wamCommerce-airoAllAccess",
    title: "AI Business Builder",
    subtitle: "CIS 404 | Programming for Analytics and AI in Business",
    icon: "🤖",
    gradient: "from-orange-500 to-red-600", 
    badge: "Free Access for the Semester",
    description: "AI-powered tools to jumpstart your career and creative projects",
    price: "$0.00",
    originalPrice: "$399.00",
    benefits: [
      "WAM Commerce e-commerce platform (6 months free)",
      "Airo Plus AI assistant tools",
      "Advanced e-commerce features",
      "AI-powered business automation",
      "Modern business technology stack"
    ],
    tools: ["WAM Commerce", "Airo Plus", "AI Automation"]
  }
];

const STATS = [
  { number: '50K+', label: 'Students Helped' },
  { number: '6 Months', label: 'Free for Your Semester' },
  { number: '$0', label: 'Upfront Cost' },
  { number: '24/7', label: 'Support' }
];

// Hardcoded values for API calls
const HARDCODED_CUSTOMER_ID = 'f8dcecf0-4ea0-42eb-8805-7bd63eecbbc4';
const HARDCODED_SHOPPER_ID = '9869029';
const HARDCODED_AUTH_IDP = 'eyJhbGciOiAiUlMyNTYiLCAia2lkIjogIkN3elhURmE4REEifQ.eyJhdXRoIjogImJhc2ljIiwgImZ0YyI6IDEsICJpYXQiOiAxNzYxMjQ4MjY5LCAianRpIjogImhiNmx1MEtUek9kRFNnUGRUSFh0U2ciLCAidHlwIjogImlkcCIsICJ2YXQiOiAxNzYxMjQ4MjY5LCAiZXhwIjogMTc2MTI0ODU2OSwgImZhY3RvcnMiOiB7ImtfcHciOiAxNzYxMjQ4MjY5fSwgInBlciI6IHRydWUsICJoYmkiOiAxNzYxMjQ4MjY5LCAic2hvcHBlcklkIjogIjY3NDc5OTgiLCAiY2lkIjogIjNkZWQzN2M1LWI1M2UtNGRhMS04YWMzLWNmY2NiNjIzNjdlNCIsICJwbGlkIjogIjEiLCAicGx0IjogMSwgInNoYXJkIjogIjAwMDAiLCAiaWRlbnRpdHkiOiAiNmFkMWIyNGUtMTFmOS0xMWVkLWIyZTAtZTYxZWM1MTgxMmU3In0.QCE1jKXv6FQXAkIbZmj6aidK065yYaObZ6K8RSBQ7TClmUvPbgEtQsEzv-ecicoFXSbjV-jd4QURF5jAi89JrzxgvNQyCWPvsghnf4PWo204IaOlSPMYGiHqmzfJYhpPeXBN29sBrvVOge-aIDBZ5RJBleuyPLKI8YrRq_Ywcljqj-3SRWDXxoTP5rHNCe39WWkrEvuRgbLmOeWNGIA7nrf43bRL6fcMoRQx9sUBjBVKSTl7eE2mqP0uKY8Adm7XAi7Go7YCH9G7_BWzHYJzBiQ4NQqKyGBJXa248Qfo7UomnybG2SnApLPyyAo1UFmViwZWUuKOWwAVRTDtdrX83g';

// Helper function to generate UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function OfferPage() {
  const searchParams = useSearchParams();
  const schoolId = searchParams.get('school') || '';
  const { customerId, shopperId, email, isAuthenticated } = useAuth();
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setIsProcessing(true);
    setError(null);
    
    try {
      console.log('=== Starting Order Creation Flow ===');
      console.log('Curated Offer ID:', offerId);

      // Step 1: Call Catalog API
      console.log('Step 1: Calling Catalog API...');
      const catalogResponse = await fetch('/api/catalog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currency: "USD",
          marketId: "en-US",
          curatedOfferId: offerId,
          term: {
            termType: "MONTH",
            numberOfTerms: 12
          }
        })
      });

      // Check: Only proceed if Catalog API returns 200 OK
      if (!catalogResponse.ok) {
        const errorData = await catalogResponse.json();
        throw new Error(errorData.error || `Catalog API failed with status: ${catalogResponse.status}`);
      }

      const catalogData = await catalogResponse.json();
      console.log('Catalog API response:', catalogData);

      const catalogInstanceKey = catalogData.plans?.[0]?.catalogInstanceKey;
      if (!catalogInstanceKey) {
        throw new Error('No catalog instance key found in response');
      }
      console.log('✓ Catalog API success, catalogInstanceKey:', catalogInstanceKey);

      // Generate basketId UUID (will be used for both Orders API and FulfillFree API)
      const basketId = generateUUID();
      console.log('Generated Basket ID:', basketId);

      // Step 2: Call Orders API
      console.log('Step 2: Calling Orders API...');
      const idempotentId = generateUUID();
      const itemKey = generateUUID();

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          basketId,
          idempotentId,
          currency: "USD",
          marketId: "en-US",
          items: [
            {
              key: itemKey,
              item: {
                catalogInstanceKey: catalogInstanceKey
              }
            }
          ]
        })
      });

      // Check: Only proceed if Orders API returns 200 OK
      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || `Orders API failed with status: ${orderResponse.status}`);
      }

      const orderData = await orderResponse.json();
      console.log('✓ Orders API success');

      // Step 3: Call FulfillFree API using the same basketId as orderId
      console.log('Step 3: Calling FulfillFree API...');
      const fulfillIdempotentId = generateUUID();

      const fulfillResponse = await fetch('/api/fulfillFree', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerId: HARDCODED_CUSTOMER_ID,
          orderId: basketId, // Using the same basketId as orderId
          idempotentId: fulfillIdempotentId
        })
      });

      // Check: Only redirect if FulfillFree API returns 200 OK
      if (!fulfillResponse.ok) {
        const errorData = await fulfillResponse.json();
        throw new Error(errorData.error || `FulfillFree API failed with status: ${fulfillResponse.status}`);
      }

      const fulfillData = await fulfillResponse.json();
      console.log('✓ FulfillFree API success');
      console.log('=== Order Completed Successfully ===');
      console.log('Basket ID / Order ID:', basketId);
      console.log('Customer ID:', HARDCODED_CUSTOMER_ID);

      // Show success toast and redirect
      setShowToast(true);
      

    } catch (err) {
      console.error('Error in order creation flow:', err);
      setError(err instanceof Error ? err.message : 'Failed to process order. Please try again.');
      setIsProcessing(false);
    }
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
    setTimeout(() => {
      window.location.href = 'https://account.test-godaddy.com/products';
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#1BDBDB]/40 to-[#0FA5A5]/40 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#1BDBDB]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-[#0FA5A5]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-[#17C7C7]/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[
          { left: 20, top: 20, delay: 0 },
          { left: 80, top: 30, delay: 0.5 },
          { left: 40, top: 70, delay: 1.0 },
          { left: 90, top: 80, delay: 1.5 },
          { left: 10, top: 60, delay: 2.0 },
        ].map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + (i % 2),
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-8"
          >
            <span className="text-4xl">🎓</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Student Offers
            <span className="block text-3xl md:text-4xl text-purple-200 font-light">
              Exclusive Free Access for the Semester
            </span>
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8"
          >
            Build your digital future with professional tools — from first assignment to first client.
          </motion.p>

          {/* User Info */}
          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="inline-flex items-center px-6 py-3 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full text-green-200 text-sm font-medium mb-4"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></span>
              Signed in as {email}
            </motion.div>
          )}


          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          >
            {STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-200 text-sm font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Not Signed In Banner */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl">⚠️</span>
              <p className="text-red-200 text-center font-medium">
                Please sign up to claim your free student offers
              </p>
            </div>
          </motion.div>
        )}

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl">❌</span>
              <p className="text-red-200 text-center font-medium">
                {error}
              </p>
            </div>
          </motion.div>
        )}

        {/* Offers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {CURATED_OFFERS.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
              className="group relative"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 h-full flex flex-col">
                {/* Offer Header */}
                <div className="text-center mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${offer.gradient} rounded-2xl mb-4 shadow-lg`}
                  >
                    <span className="text-3xl">{offer.icon}</span>
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {offer.title}
                  </h3>
                  <p className="text-blue-200 mb-4">
                    {offer.subtitle}
                  </p>
                  
                  <div className="inline-flex items-center px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-full text-green-200 text-sm font-medium">
                    {offer.badge}
                  </div>
                </div>

                {/* Pricing */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-3xl font-bold text-white">{offer.price}</span>
                    <span className="text-lg text-gray-400 line-through">{offer.originalPrice}</span>
                  </div>
                  <p className="text-sm text-blue-200">Save {offer.originalPrice}</p>
                </div>

                {/* Description */}
                <p className="text-blue-200 text-center mb-6 leading-relaxed">
                  {offer.description}
                </p>

                {/* Tools */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-white mb-3 text-center">Included Tools:</h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {offer.tools.map((tool, toolIndex) => (
                      <span
                        key={toolIndex}
                        className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-blue-200"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="mb-8 flex-grow">
                  <h4 className="text-sm font-semibold text-white mb-3">What's Included:</h4>
                  <ul className="space-y-2">
                    {offer.benefits.slice(0, 3).map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start text-sm text-blue-200">
                        <span className="text-green-400 mr-2 mt-0.5">✓</span>
                        {benefit}
                      </li>
                    ))}
                    {offer.benefits.length > 3 && (
                      <li className="text-xs text-blue-300">
                        +{offer.benefits.length - 3} more benefits
                      </li>
                    )}
                  </ul>
                </div>

                {/* Action Button */}
                <motion.button
                  onClick={() => handleSelectOffer(offer.id)}
                  disabled={!isAuthenticated || isProcessing}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg flex items-center justify-center space-x-3 border border-gray-700 relative z-10 ${
                    isAuthenticated && !isProcessing
                      ? `bg-gradient-to-r ${offer.gradient} text-white hover:shadow-xl hover:shadow-purple-500/25` 
                      : 'bg-black hover:bg-gray-800 text-white'
                  }`}
                >
                  {isProcessing && selectedOfferId === offer.id ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="text-white">Processing...</span>
                    </div>
                  ) : isAuthenticated ? (
                    <span className="text-white">Get Started</span>
                  ) : (
                    <span className="text-white">Sign In To Select</span>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="text-center"
        >
          <p className="text-blue-200 text-lg mb-4">
            Ready to ace your assignments? Select your course and start building with professional tools from GoDaddy.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-blue-300">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Instant Access</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Success Toast */}
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.8 }}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/20"
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🎉</span>
            <div>
              <div className="font-semibold">Offer Selected!</div>
              <div className="text-sm opacity-90">You're ready to start building</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
