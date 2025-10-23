'use client';

import { useAuth } from '@/context/AuthProvider';
import { getCustomerId, getShopperId } from '@/lib/cookies';

export function CustomerInfo() {
  const { customerId, shopperId, email, isAuthenticated } = useAuth();
  
  // Also get directly from cookies as backup
  const directCustomerId = getCustomerId();
  const directShopperId = getShopperId();
  
  // Check if IDs were retrieved from existing cookies
  const hasExistingCustomerId = !!directCustomerId;
  const hasExistingShopperId = !!directShopperId;
  
  // Check if we have the GoDaddy cust_idp cookie
  function getCookieValue(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }
  
  const custIdpCookie = getCookieValue('cust_idp');
  const hasCustIdpCookie = !!custIdpCookie;

  if (!isAuthenticated) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <p className="text-yellow-800 text-sm">
          ⚠️ Not authenticated - please sign up first
        </p>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
      <h3 className="text-green-800 font-semibold mb-2">✅ User Authenticated</h3>
      <div className="text-sm text-green-700 space-y-1">
        <div><strong>Email:</strong> {email}</div>
        <div><strong>Customer ID:</strong> <code className="bg-green-100 px-1 rounded">{customerId || directCustomerId}</code></div>
        <div><strong>Shopper ID:</strong> <code className="bg-green-100 px-1 rounded">{shopperId || directShopperId}</code></div>
        <div className="text-xs text-green-600 mt-2">
          <div className="space-y-1">
            <div>
              Customer ID: {hasExistingCustomerId ? (
                <span className="text-blue-600">✅ Retrieved from {hasCustIdpCookie ? 'cust_idp cookie' : 'user cookies'}</span>
              ) : (
                <span className="text-red-600">❌ Not found in cookies</span>
              )}
            </div>
            <div>
              Shopper ID: {hasExistingShopperId ? (
                <span className="text-blue-600">✅ Retrieved from {hasCustIdpCookie ? 'cust_idp cookie' : 'user cookies'}</span>
              ) : (
                <span className="text-red-600">❌ Not found in cookies</span>
              )}
            </div>
            {hasCustIdpCookie && (
              <div className="text-purple-600">
                🍪 GoDaddy cust_idp cookie detected
              </div>
            )}
          </div>
          <br />
          These IDs are retrieved from your GoDaddy authentication cookies
        </div>
      </div>
    </div>
  );
}
