'use client';

import { useAuth } from '@/context/AuthProvider';
import { useState, useEffect } from 'react';

export default function TestJWT() {
  const { customerId, shopperId, email, isAuthenticated } = useAuth();
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const response = await fetch('/api/user-info');
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }
    fetchUserInfo();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">JWT Decoding Test</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Auth Context State</h2>
          <div className="space-y-2">
            <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
            <p><strong>Customer ID:</strong> {customerId || 'Not available'}</p>
            <p><strong>Shopper ID:</strong> {shopperId || 'Not available'}</p>
            <p><strong>Email:</strong> {email || 'Not available'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API Response</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(userInfo, null, 2)}
          </pre>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
          <ol className="text-blue-800 text-sm space-y-1">
            <li>1. Open browser dev tools and go to Application/Storage → Cookies</li>
            <li>2. Add a cookie named "auth_jomax" with a valid JWT token</li>
            <li>3. Refresh this page to see the decoded information</li>
            <li>4. Check the console for logged JWT details</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
