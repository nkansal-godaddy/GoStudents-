'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Benefit from '@/components/Benefit';
import { SuccessAlert, ErrorAlert } from '@/components/Alerts';

// Helper function to generate UUIDs
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

interface CatalogResponse {
  plans?: Array<{
    catalogInstanceKey: string;
    [key: string]: any;
  }>;
}

export default function OfferPage() {
  const [ssoAuth, setSsoAuth] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showAuthInput, setShowAuthInput] = useState(true);
  const [catalogInstanceKey, setCatalogInstanceKey] = useState<string | null>(null);

  const handleCatalogQuery = async () => {
    if (!ssoAuth.trim()) {
      setAlert({ type: 'error', message: 'Please enter your SSO authorization token.' });
      return;
    }

    setIsProcessing(true);
    setAlert(null);

    try {
      // Step 1: Query the catalog via proxy API (avoids CORS issues)
      console.log('Calling catalog API...');
      const catalogResponse = await fetch('/api/catalog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ssoAuth: ssoAuth,
          currency: "USD",
          marketId: "en-US",
          curatedOfferId: "airo-all-access-with-freetrial",
          term: {
            termType: "MONTH",
            numberOfTerms: 12
          }
        })
      });

      if (!catalogResponse.ok) {
        // Try to extract error details from response
        let errorMessage = `Catalog API failed with status: ${catalogResponse.status}`;
        try {
          const errorData = await catalogResponse.json();
          console.error('Catalog API error response:', errorData);
          if (errorData.message) {
            errorMessage = `Catalog API Error: ${errorData.message}`;
          } else if (errorData.error) {
            errorMessage = `Catalog API Error: ${errorData.error}`;
          } else if (errorData.errors) {
            errorMessage = `Catalog API Error: ${JSON.stringify(errorData.errors)}`;
          } else {
            errorMessage = `Catalog API Error (${catalogResponse.status}): ${JSON.stringify(errorData)}`;
          }
        } catch (parseError) {
          // If we can't parse the error response, try to get text
          try {
            const errorText = await catalogResponse.text();
            console.error('Catalog API error text:', errorText);
            if (errorText) {
              errorMessage = `Catalog API Error (${catalogResponse.status}): ${errorText}`;
            }
          } catch {
            // Use the default error message with status code
          }
        }
        setAlert({ type: 'error', message: errorMessage });
        setIsProcessing(false);
        return;
      }

      const catalogData: CatalogResponse = await catalogResponse.json();
      console.log('Catalog API response:', catalogData);
      
      // Extract catalogInstanceKey from first plan
      const firstPlan = catalogData.plans?.[0];
      if (!firstPlan || !firstPlan.catalogInstanceKey) {
        throw new Error('No catalog instance key found in response');
      }

      const extractedKey = firstPlan.catalogInstanceKey;
      setCatalogInstanceKey(extractedKey);
      setAlert({ type: 'success', message: 'Catalog queried successfully! Proceeding to order...' });

      // Step 2: Call orders shim API
      await handleOrderShim(extractedKey);

    } catch (error) {
      console.error('Catalog query error:', error);
      let errorMessage = 'Failed to query catalog. Please try again.';
      
      if (error instanceof Error) {
        // Check for common network errors
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage = 'Network error: Unable to connect to catalog service. Please check your internet connection.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Request timeout: The catalog service took too long to respond. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setAlert({ type: 'error', message: errorMessage });
      setIsProcessing(false);
    }
  };

  const handleOrderShim = async (catalogKey: string) => {
    try {
      // Generate required GUIDs
      const idempotentNewGUID = generateUUID();
      const keyNewGUID = generateUUID();

      console.log('Calling orders API...');
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ssoAuth: ssoAuth,
          idempotentId: idempotentNewGUID,
          currency: "USD",
          marketId: "en-US",
          items: [
            {
              key: keyNewGUID,
              item: {
                catalogInstanceKey: catalogKey,
                intent: "FREE_TRIAL_PURCHASE"
              }
            }
          ]
        })
      });

      if (orderResponse.status === 200) {
        setAlert({ type: 'success', message: 'Order created successfully! Redirecting to checkout...' });
        
        // Redirect to checkout after a brief delay
        setTimeout(() => {
          window.location.href = 'https://cart.test-godaddy.com/go/checkout';
        }, 2000);
      } else {
        // Try to get detailed error message from response
        let errorMessage = `Order API failed with status: ${orderResponse.status}`;
        try {
          const errorData = await orderResponse.json();
          console.error('Order API error response:', errorData);
          
          if (errorData.error) {
            errorMessage = `Order Error: ${errorData.error}`;
          } else if (errorData.message) {
            errorMessage = `Order Error: ${errorData.message}`;
          } else {
            errorMessage = `Order Error (${orderResponse.status}): ${JSON.stringify(errorData)}`;
          }
        } catch {
          // If we can't parse the error, use the default message
          console.error('Order API failed with status:', orderResponse.status);
        }
        
        throw new Error(errorMessage);
      }

    } catch (error) {
      console.error('Order shim error:', error);
      setAlert({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Failed to create order. Please try again.' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Benefits */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold text-gray-900">
                Your Exclusive Student Offer
              </h1>
              <p className="text-xl text-gray-600 mt-4">
                Complete your registration to claim your free student benefits.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-semibold text-gray-900">What's included:</h2>
              <div className="space-y-4">
                <Benefit
                  icon="🎁"
                  title="Free Trial Access"
                  description="Get started with Duda eStore Tier 0 with a full year trial"
                />
                <Benefit
                  icon="🌐"
                  title="Domain & Hosting"
                  description="Complete web presence for your student projects"
                />
                <Benefit
                  icon="🛠️"
                  title="Professional Tools"
                  description="Access to enterprise-grade website building tools"
                />
                <Benefit
                  icon="📚"
                  title="Learning Resources"
                  description="Tutorials and support to help you succeed"
                />
              </div>
            </motion.div>
          </div>

          {/* Right Column - Authorization Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Claim Your Offer
                </h2>
                <p className="text-sm text-gray-600">
                  Enter your authorization token to complete the registration process.
                </p>
              </div>

              {alert && (
                <div className="mb-6">
                  {alert.type === 'success' ? (
                    <SuccessAlert message={alert.message} onClose={() => setAlert(null)} />
                  ) : (
                    <ErrorAlert message={alert.message} onClose={() => setAlert(null)} />
                  )}
                </div>
              )}

              {showAuthInput && (
                <div>
                  <label htmlFor="ssoAuth" className="block text-sm font-medium text-gray-700 mb-2">
                    SSO Authorization Token
                  </label>
                  <textarea
                    id="ssoAuth"
                    value={ssoAuth}
                    onChange={(e) => setSsoAuth(e.target.value)}
                    placeholder="Enter your SSO JWT token..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm text-black"
                    disabled={isProcessing}
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    This token is required to authenticate your student account and provision your free services.
                  </p>
                </div>
              )}

              {catalogInstanceKey && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-sm text-green-800 font-medium">
                    ✓ Catalog Instance Key Retrieved
                  </p>
                  <p className="text-xs text-green-700 mt-1 font-mono break-all">
                    {catalogInstanceKey}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleCatalogQuery}
                  disabled={isProcessing || !ssoAuth.trim()}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isProcessing ? 'Processing...' : 'Claim Your Student Offer'}
                </button>

                <p className="text-xs text-center text-gray-500">
                  By claiming this offer, you agree to the terms and conditions of the student program.
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-6">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">
                  Need Help?
                </h3>
                <p className="text-xs text-blue-800">
                  If you don't have your authorization token, please contact your administrator or check your student email for instructions.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

