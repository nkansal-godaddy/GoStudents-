'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import PricingCard from '@/components/PricingCard';
import PlanToggle from '@/components/PlanToggle';

export default function WebsiteBuilderPage() {
  const router = useRouter();
  const [offerData, setOfferData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOfferData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/catalog/curated-offer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currency: 'USD',
            marketId: 'en-US',
            curatedOfferId: 'cpanel-set-1-economy-ssl-365-wss-xtra'
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch offer data');
        }
        
        const data = await response.json();
        setOfferData(data);
        console.log('Curated offer data loaded:', data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching offer data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOfferData();
  }, []);

  const getDiscountPrice = (data: any): string => {
    console.log('🔍 getDiscountPrice called with data:', data);
    
    try {
      console.log('📊 Extracting discount price from response...');
      console.log('   - Plans array exists:', !!data?.plans);
      console.log('   - Plans array length:', data?.plans?.length);
      
      const discountPriceCents = data?.plans?.[0]?.pricing?.rates?.discountPrice;
      console.log('   - Discount price (cents):', discountPriceCents);
      
      if (!discountPriceCents) {
        console.warn('⚠️ No discount price found, using fallback $9.99');
        return '$9.99';
      }
      
      // Convert from API units (1,000,000 = $1 - micro currency) to dollars AND divide by 12 for monthly price
      const annualPrice = (discountPriceCents / 1000000).toFixed(2);
      const priceInDollars = (discountPriceCents / 1000000 / 12).toFixed(2);
      console.log('   - Annual price in dollars:', annualPrice);
      console.log('   - Monthly price in dollars:', priceInDollars);
      console.log('✅ Final formatted price:', `$${priceInDollars}`);
      
      return `$${priceInDollars}`;
    } catch (error) {
      console.error('❌ Error extracting price:', error);
      console.error('   - Data received:', data);
      return '$9.99';
    }
  };

  const getCatalogInstanceKey = (data: any): string | null => {
    console.log('🔑 getCatalogInstanceKey called with data:', data);
    
    try {
      console.log('📊 Extracting catalogInstanceKey from response...');
      console.log('   - Plans array exists:', !!data?.plans);
      console.log('   - Plans array length:', data?.plans?.length);
      console.log('   - First plan exists:', !!data?.plans?.[0]);
      
      const catalogKey = data?.plans?.[0]?.catalogInstanceKey;
      console.log('   - CatalogInstanceKey value:', catalogKey);
      console.log('   - CatalogInstanceKey length:', catalogKey?.length);
      
      if (!catalogKey) {
        console.warn('⚠️ No catalogInstanceKey found in response');
        return null;
      }
      
      console.log('✅ CatalogInstanceKey extracted successfully');
      console.log('   - First 50 chars:', catalogKey.substring(0, 50));
      console.log('   - Last 50 chars:', catalogKey.substring(catalogKey.length - 50));
      
      return catalogKey;
    } catch (error) {
      console.error('❌ Error extracting catalogInstanceKey:', error);
      console.error('   - Data received:', data);
      return null;
    }
  };

  const PRICING_PLANS = [
  {
    name: 'Basic',
    price: isLoading ? 'Loading...' : getDiscountPrice(offerData),
    period: '/mo',
    savingsBadge: 'SAVE 54% WITH ANNUAL PLAN',
    isRecommended: false,
    catalogInstanceKey: getCatalogInstanceKey(offerData),
    websiteFeatures: [
      { text: '100s of templates and easy to use editing tools', hasTooltip: false },
      { text: 'Free custom domain', hasTooltip: true },
      { text: 'Free professional email', hasTooltip: true },
      { text: 'GoDaddy Airo™ AI', hasTooltip: false },
      { text: 'Advanced website analytics', hasTooltip: false },
    ],
    marketingFeatures: [
      { text: 'Free digital content creator', hasTooltip: false },
      { text: 'Basic marketing tools', hasTooltip: false },
      { text: '100 email marketing sends monthly', hasTooltip: false },
    ],
  },
  {
    name: 'Premium',
    price: '$14.99',
    period: '/mo',
    savingsBadge: 'SAVE 62% WITH ANNUAL PLAN',
    isRecommended: true,
    catalogInstanceKey: null,
    websiteFeatures: [
      { text: '100s of templates and easy to use editing tools', hasTooltip: false },
      { text: 'Free custom domain', hasTooltip: true },
      { text: 'Free professional email', hasTooltip: true },
      { text: 'GoDaddy Airo™ AI', hasTooltip: false },
      { text: 'Advanced website analytics', hasTooltip: false },
    ],
    marketingFeatures: [
      { text: 'Free digital content creator', hasTooltip: false },
      { text: 'Advanced marketing tools', hasTooltip: false },
      { text: '25,000 email marketing sends monthly', hasTooltip: false },
    ],
  },
  {
    name: 'Commerce',
    price: '$20.99',
    period: '/mo',
    savingsBadge: 'SAVE 53% WITH ANNUAL PLAN',
    isRecommended: false,
    catalogInstanceKey: null,
    websiteFeatures: [
      { text: '100s of templates and easy to use editing tools', hasTooltip: false },
      { text: 'Free custom domain', hasTooltip: true },
      { text: 'Free professional email', hasTooltip: true },
      { text: 'GoDaddy Airo™ AI', hasTooltip: false },
      { text: 'Advanced website analytics', hasTooltip: false },
    ],
    marketingFeatures: [
      { text: 'Free digital content creator', hasTooltip: false },
      { text: 'Advanced marketing tools', hasTooltip: false },
      { text: '100,000 email marketing sends monthly', hasTooltip: false },
    ],
  },
];

  const handleAddToCart = (planName: string, price: string, catalogKey?: string | null) => {
    console.log(`Add to Cart clicked:`, { 
      planName, 
      price, 
      catalogInstanceKey: catalogKey 
    });
    
    // Navigate to checkout/configure for Basic plan
    if (planName === 'Basic' && catalogKey) {
      // Store offer data in sessionStorage
      sessionStorage.setItem('checkoutOfferData', JSON.stringify(offerData));
      router.push('/checkout/configure');
    }
  };

  const handleStartFree = (planName: string) => {
    console.log(`Start for Free clicked:`, { planName });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            GoDaddy Website Builder
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            No credit card required
          </p>
        </div>

        <PlanToggle />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {PRICING_PLANS.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <PricingCard
                name={plan.name}
                price={plan.price}
                period={plan.period}
                savingsBadge={plan.savingsBadge}
                isRecommended={plan.isRecommended}
                websiteFeatures={plan.websiteFeatures}
                marketingFeatures={plan.marketingFeatures}
                onAddToCart={() => handleAddToCart(plan.name, plan.price, plan.catalogInstanceKey)}
                onStartFree={() => handleStartFree(plan.name)}
              />
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>All plans include 24/7 support and a 30-day money-back guarantee</p>
        </div>
      </motion.div>
    </div>
  );
}
