'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';

const SCHOOLS = [
  { id: 'asu', name: 'Arizona State University', domain: 'asu.edu' },
  { id: 'uarizona', name: 'University of Arizona', domain: 'arizona.edu' },
  { id: 'nau', name: 'Northern Arizona University', domain: 'nau.edu' },
  { id: 'isbat', name: 'ISBAT University', domain: 'isbatuniversity.ac.ug' },
  { id: 'other', name: 'Other', domain: null }
];

export default function StudentsPage() {
  const { isAuthenticated, email: authEmail } = useAuth();
  const router = useRouter();
  const [schoolId, setSchoolId] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/students/offer');
    }
  }, [isAuthenticated, router]);

  const validateEmail = (email: string, schoolId: string): string | null => {
    if (!email) return 'Email is required';
    
    const selectedSchool = SCHOOLS.find(s => s.id === schoolId);
    if (!selectedSchool) return 'Please select a school';
    
    if (selectedSchool.id === 'other') {
      // For "Other", just check it's a valid email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
      }
    } else {
      // For specific schools, check domain
      const expectedDomain = selectedSchool.domain;
      if (!email.endsWith(`@${expectedDomain}`)) {
        return `Please enter a valid ${selectedSchool.name} email address (ending in @${expectedDomain})`;
      }
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const validationError = validateEmail(email, schoolId);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Starting sign-up process...', { email, schoolId });
      
      // Create a proper JWT-like token for demo purposes
      const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" }))
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
      const payload = Buffer.from(JSON.stringify({
        sub: '104222', // Mock customer ID
        shopperId: '9449896', // Mock shopper ID
        email: email,
        accountName: email,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 6), // 6 hours
        iat: Math.floor(Date.now() / 1000)
      }))
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
      const signature = 'mock-signature';
      const mockJWT = `${header}.${payload}.${signature}`;

      console.log('Generated JWT token:', mockJWT);

      // Set the mock JWT as auth_jomax cookie
      document.cookie = `auth_jomax=${mockJWT}; path=/; max-age=${60 * 60 * 6}`;
      
      console.log('Cookie set, redirecting...');
      
      // Wait a moment for the cookie to be set, then redirect
      setTimeout(() => {
        setIsSubmitting(false);
        window.location.href = `/students/offer?school=${schoolId}`;
      }, 100);
    } catch (err) {
      console.error('Sign-up error:', err);
      setError('Sign-up failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            GoStudents by GoDaddy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Building your digital future — from first assignment to first client.
          </p>
        </motion.div>

        {/* Sign-up Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Get Your Student Offers
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* School Selection */}
            <div>
              <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-2">
                Select Your School
              </label>
              <select
                id="school"
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                <option value="">Choose your school...</option>
                {SCHOOLS.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                School Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="student@school.edu"
                required
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !schoolId || !email}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Signing up...' : 'Sign up & view offers'}
            </button>
          </form>

          {/* Benefits */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">What you'll get:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                6-month free trials on professional tools
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Web hosting, security, and AI business tools
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Perfect for assignments and portfolio projects
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
