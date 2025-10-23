'use client';

import { useState, useEffect } from 'react';

export default function DebugCustIdpPage() {
  const [custIdpCookie, setCustIdpCookie] = useState<string | null>(null);
  const [decodedPayload, setDecodedPayload] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get cust_idp cookie
    function getCookieValue(name: string): string | null {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
      return null;
    }

    const cookie = getCookieValue('cust_idp');
    setCustIdpCookie(cookie);

    if (cookie) {
      try {
        // Decode JWT payload
        const parts = cookie.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          setDecodedPayload(payload);
        } else {
          setError('Invalid JWT format - should have 3 parts');
        }
      } catch (err) {
        setError(`Error decoding JWT: ${err}`);
      }
    } else {
      setError('cust_idp cookie not found');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug cust_idp Cookie</h1>
        
        <div className="space-y-6">
          {/* Raw Cookie */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Raw cust_idp Cookie:</h2>
            {custIdpCookie ? (
              <div className="bg-gray-700 p-3 rounded font-mono text-sm break-all">
                {custIdpCookie}
              </div>
            ) : (
              <div className="text-red-400">No cust_idp cookie found</div>
            )}
          </div>

          {/* Decoded Payload */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Decoded Payload:</h2>
            {error ? (
              <div className="text-red-400">{error}</div>
            ) : decodedPayload ? (
              <div className="bg-gray-700 p-3 rounded">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(decodedPayload, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="text-yellow-400">No payload to decode</div>
            )}
          </div>

          {/* Key Values */}
          {decodedPayload && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Key Values:</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Customer ID (cid):</strong>
                  <div className="bg-gray-700 p-2 rounded font-mono text-sm mt-1">
                    {decodedPayload.cid || 'Not found'}
                  </div>
                </div>
                <div>
                  <strong>Shopper ID:</strong>
                  <div className="bg-gray-700 p-2 rounded font-mono text-sm mt-1">
                    {decodedPayload.shopperId || 'Not found'}
                  </div>
                </div>
                <div>
                  <strong>Customer Type:</strong>
                  <div className="bg-gray-700 p-2 rounded font-mono text-sm mt-1">
                    {decodedPayload.ctype || 'Not found'}
                  </div>
                </div>
                <div>
                  <strong>Auth Type:</strong>
                  <div className="bg-gray-700 p-2 rounded font-mono text-sm mt-1">
                    {decodedPayload.auth || 'Not found'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-900 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Instructions:</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Sign in to <a href="https://www.test-godaddy.com/" target="_blank" className="text-blue-300 underline">GoDaddy Test</a></li>
              <li>Open browser developer tools (F12)</li>
              <li>Go to Application/Storage → Cookies → test-godaddy.com</li>
              <li>Copy the value of the <code className="bg-gray-700 px-1 rounded">cust_idp</code> cookie</li>
              <li>Set it in your local browser console:
                <div className="bg-gray-800 p-2 rounded mt-2 font-mono text-xs">
                  document.cookie = "cust_idp=YOUR_COPIED_VALUE; path=/; domain=localhost";
                </div>
              </li>
              <li>Refresh this page to see the decoded values</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
