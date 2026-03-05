'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import TermSelector from '@/components/TermSelector';
import FreeTrialOption from '@/components/FreeTrialOption';
import EnhanceWebsiteToggle from '@/components/EnhanceWebsiteToggle';
import CheckoutSidebar from '@/components/CheckoutSidebar';

export default function CheckoutConfigurePage() {
  const router = useRouter();
  const [offerData, setOfferData] = useState<any>(null);

  // Receive offer data passed via navigation state
  useEffect(() => {
    // Retrieve offer data from sessionStorage
    const storedData = sessionStorage.getItem('checkoutOfferData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setOfferData(parsedData);
        console.log('Checkout Configure page loaded with offer data:', parsedData);
      } catch (error) {
        console.error('Error parsing offer data from sessionStorage:', error);
      }
    } else {
      console.log('No offer data found in sessionStorage');
    }
  }, []);

  const getMonthlyPrice = (data: any): string => {
    try {
      const discountPriceCents = data?.plans?.[0]?.pricing?.rates?.discountPrice;
      if (!discountPriceCents) {
        return '$XX.XX';
      }
      // Convert from API units (1,000,000 = $1 - micro currency) to dollars AND divide by 12 for monthly price
      const priceInDollars = (discountPriceCents / 1000000 / 12).toFixed(2);
      return `$${priceInDollars}`;
    } catch (error) {
      console.error('Error extracting monthly price:', error);
      return '$XX.XX';
    }
  };

  const getAnnualPrice = (data: any): string => {
    try {
      const discountPriceCents = data?.plans?.[0]?.pricing?.rates?.discountPrice;
      if (!discountPriceCents) {
        return '$XX.XX';
      }
      // Convert from API units (1,000,000 = $1 - micro currency) to dollars
      const priceInDollars = (discountPriceCents / 1000000).toFixed(2);
      return `$${priceInDollars}`;
    } catch (error) {
      console.error('Error extracting annual price:', error);
      return '$XX.XX';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-green-600 font-medium">✓ ADDED TO CART</span>
            <span className="text-gray-400">-</span>
            <span className="text-gray-900">GoDaddy Website Builder Basic</span>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-2"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Main Content - Left Column (2/3 width) */}
          <div className="lg:col-span-2">
            {/* Configure Your Plan Section */}
            <div className="mb-2">
              <h1 className="text-xl font-bold text-gray-900 mb-1">Configure your plan</h1>
            </div>

            <TermSelector 
              selectedTerm="12 months"
              monthlyPrice={getMonthlyPrice(offerData)}
              totalPrice={getAnnualPrice(offerData)}
            />

            {/* Included in this plan */}
            <section className="mb-2">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Included in this plan</h2>
              
              <FreeTrialOption 
                title="Microsoft 365 Email Essentials"
                description="Build your domain-based secure email. Includes 10 GB storage for each contact, plus mailboxes. Boost your brand and trust. Includes storage for main calendars, plus mailboxes."
                trialDuration="12 months free trial"
                features={[
                  { text: 'Best for domain-based secure email that helps build your brand and trust. Includes 10 GB storage for main contacts, plus mailboxes.' }
                ]}
                defaultSelected={true}
              />
              
              <FreeTrialOption 
                title="Norton Small Business Free Trial"
                description="Protect your site from online and offline threats. Helps secure business devices and critical data. Minimize exposure to online security risks, and keep your PCs performing at their best. Secure browser, browser password manager and VPN."
                trialDuration="1-month free trial. Auto-renews at end of trial. Cancel anytime."
                features={[]}
                defaultSelected={true}
                trialValue="$XX.XX"
              />
            </section>

            {/* Enhance your website */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Enhance your website</h2>
              
              <EnhanceWebsiteToggle 
                title="Create a privacy policy with Airo Plus™ Compliance"
                description="Businesses and websites should have a privacy policy. It shows you take protecting data seriously. Write yours with Airo Plus™ Compliance. Included with the purchase of Airo™ Plus."
                savingsBadge="SAVE 50%"
                monthlyPrice="$XX.XX"
                totalPrice="$XX.XX"
                isEnabled={false}
              />
            </section>
          </div>

          {/* Sidebar - Right Column (1/3 width) */}
          <div className="lg:col-span-1">
            <CheckoutSidebar />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
