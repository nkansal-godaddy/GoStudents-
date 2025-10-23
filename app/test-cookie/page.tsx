'use client';

import { useState } from 'react';

export default function TestCookiePage() {
  const [cookieValue, setCookieValue] = useState('');
  const [result, setResult] = useState('');

  const setCookie = () => {
    if (!cookieValue.trim()) {
      setResult('Please enter a cookie value');
      return;
    }

    try {
      // Set the cookie
      document.cookie = `cust_idp=${cookieValue}; path=/; domain=localhost`;
      
      // Test if it was set
      const testCookie = document.cookie
        .split(';')
        .find(c => c.trim().startsWith('cust_idp='));
      
      if (testCookie) {
        setResult('✅ Cookie set successfully!');
        
        // Try to decode it
        try {
          const value = testCookie.split('=')[1];
          const parts = value.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            setResult(prev => prev + `\n\nDecoded payload:\n${JSON.stringify(payload, null, 2)}`);
          }
        } catch (decodeError) {
          setResult(prev => prev + `\n\n❌ Error decoding JWT: ${decodeError}`);
        }
      } else {
        setResult('❌ Cookie not found after setting');
      }
    } catch (error) {
      setResult(`❌ Error setting cookie: ${error}`);
    }
  };

  const clearCookies = () => {
    document.cookie = 'cust_idp=; path=/; domain=localhost; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'customer_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'shopper_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setResult('🧹 All cookies cleared');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Cookie Setting</h1>
        
        <div className="space-y-6">
          {/* Cookie Input */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Set cust_idp Cookie:</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Paste your cust_idp cookie value here:
                </label>
                <textarea
                  value={cookieValue}
                  onChange={(e) => setCookieValue(e.target.value)}
                  className="w-full h-32 bg-gray-700 text-white p-3 rounded border border-gray-600 font-mono text-sm"
                  placeholder="eyJhbGciOiAiUIMYN..."
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={setCookie}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-medium"
                >
                  Set Cookie
                </button>
                <button
                  onClick={clearCookies}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-medium"
                >
                  Clear All Cookies
                </button>
              </div>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Result:</h2>
              <pre className="bg-gray-700 p-3 rounded text-sm whitespace-pre-wrap">
                {result}
              </pre>
            </div>
          )}

          {/* Current Cookies */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Current Cookies:</h2>
            <pre className="bg-gray-700 p-3 rounded text-sm overflow-auto">
              {document.cookie || 'No cookies found'}
            </pre>
          </div>

          {/* Instructions */}
          <div className="bg-blue-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Instructions:</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Go to <a href="https://www.test-godaddy.com/" target="_blank" className="text-blue-300 underline">GoDaddy Test</a> and sign in</li>
              <li>Open Developer Tools (F12) → Application → Cookies → test-godaddy.com</li>
              <li>Find the <code className="bg-gray-700 px-1 rounded">cust_idp</code> cookie</li>
              <li>Copy the entire value (it should start with <code className="bg-gray-700 px-1 rounded">eyJ</code>)</li>
              <li>Paste it in the textarea above and click "Set Cookie"</li>
              <li>Go to <a href="/students" className="text-blue-300 underline">/students</a> to test</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
