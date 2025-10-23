'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';
// Email functionality moved to API route to avoid client-side nodemailer issues

const SCHOOLS = [
  { id: 'asu', name: 'Arizona State University', domain: 'asu.edu', logo: '🏛️' },
  { id: 'uofa', name: 'University of Arizona', domain: 'arizona.edu', logo: '🌵' },
  { id: 'nau', name: 'Northern Arizona University', domain: 'nau.edu', logo: '🏔️' },
  { id: 'isbat', name: 'ISBAT University', domain: 'isbatuniversity.ac.ug', logo: '🌍' },
  { id: 'other', name: 'Other University', domain: null, logo: '🎓' }
];

const BENEFITS = [
  {
    icon: '💻',
    title: 'Professional Tools',
    description: '6-month free access for students on industry-standard web development tools'
  },
  {
    icon: '🔒',
    title: 'Security & Hosting',
    description: 'Secure web hosting and SSL certificates for your projects'
  },
  {
    icon: '🤖',
    title: 'AI Business Tools',
    description: 'Get experience with cutting-edge AI tools to enhance your projects and build your portfolio'
  },
  {
    icon: '💼',
    title: 'Portfolio Ready',
    description: 'Perfect for assignments, capstone projects, and client work'
  }
];

const STATS = [
  { number: '50K+', label: 'Students Helped' },
  { number: '6 Months', label: 'Free for Your Semester' },
  { number: '$0', label: 'Upfront Cost' },
  { number: '24/7', label: 'Support' }
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
    
    // Just check it's a valid email format - no domain restrictions
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
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
      
      // Use hardcoded values for testing
      const customerId = 'f8dcecf0-4ea0-42eb-8805-7bd63eecbbc4';
      const shopperId = '9869029';
      const authIdp = 'eyJhbGciOiAiUlMyNTYiLCAia2lkIjogIkN3elhURmE4REEifQ.eyJhdXRoIjogImJhc2ljIiwgImZ0YyI6IDEsICJpYXQiOiAxNzYxMjQ4MjY5LCAianRpIjogImhiNmx1MEtUek9kRFNnUGRUSFh0U2ciLCAidHlwIjogImlkcCIsICJ2YXQiOiAxNzYxMjQ4MjY5LCAiZXhwIjogMTc2MTI0ODU2OSwgImZhY3RvcnMiOiB7ImtfcHciOiAxNzYxMjQ4MjY5fSwgInBlciI6IHRydWUsICJoYmkiOiAxNzYxMjQ4MjY5LCAic2hvcHBlcklkIjogIjY3NDc5OTgiLCAiY2lkIjogIjNkZWQzN2M1LWI1M2UtNGRhMS04YWMzLWNmY2NiNjIzNjdlNCIsICJwbGlkIjogIjEiLCAicGx0IjogMSwgInNoYXJkIjogIjAwMDAiLCAiaWRlbnRpdHkiOiAiNmFkMWIyNGUtMTFmOS0xMWVkLWIyZTAtZTYxZWM1MTgxMmU3In0.QCE1jKXv6FQXAkIbZmj6aidK065yYaObZ6K8RSBQ7TClmUvPbgEtQsEzv-ecicoFXSbjV-jd4QURF5jAi89JrzxgvNQyCWPvsghnf4PWo204IaOlSPMYGiHqmzfJYhpPeXBN29sBrvVOge-aIDBZ5RJBleuyPLKI8YrRq_Ywcljqj-3SRWDXxoTP5rHNCe39WWkrEvuRgbLmOeWNGIA7nrf43bRL6fcMoRQx9sUBjBVKSTl7eE2mqP0uKY8Adm7XAi7Go7YCH9G7_BWzHYJzBiQ4NQqKyGBJXa248Qfo7UomnybG2SnApLPyyAo1UFmViwZWUuKOWwAVRTDtdrX83g';
      
      console.log('Using hardcoded values:', { customerId, shopperId });
      
      // Set all required cookies
      document.cookie = `customer_id=${customerId}; path=/; max-age=${60 * 60 * 6}`;
      document.cookie = `shopper_id=${shopperId}; path=/; max-age=${60 * 60 * 6}`;
      document.cookie = `auth_idp=${authIdp}; path=/; max-age=${60 * 60 * 6}`;
      // Simple validation - no email sending here anymore
      console.log('✅ Students signup successful - proceeding to offer selection');
      
      // Update email and school_id (customer_id and shopper_id come from user cookies)
      document.cookie = `user_email=${email}; path=/; max-age=${60 * 60 * 6}`;
      document.cookie = `school_id=${schoolId}; path=/; max-age=${60 * 60 * 6}`;
      
      console.log('Cookies set successfully');
      
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#1BDBDB]/40 to-[#0FA5A5]/40 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#1BDBDB]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-[#0FA5A5]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-[#17C7C7]/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[
          { left: 42.5, top: 39.4, delay: 0 },
          { left: 14.3, top: 38.9, delay: 0.2 },
          { left: 56.6, top: 55.6, delay: 0.4 },
          { left: 84.3, top: 7.4, delay: 0.6 },
          { left: 53.1, top: 87.5, delay: 0.8 },
          { left: 33.1, top: 70.0, delay: 1.0 },
          { left: 65.2, top: 30.2, delay: 1.2 },
          { left: 5.3, top: 19.1, delay: 1.4 },
          { left: 77.6, top: 37.8, delay: 1.6 },
          { left: 24.0, top: 84.7, delay: 1.8 },
          { left: 16.5, top: 89.8, delay: 2.0 },
          { left: 80.1, top: 37.4, delay: 2.2 },
          { left: 18.2, top: 57.8, delay: 2.4 },
          { left: 26.9, top: 80.8, delay: 2.6 },
          { left: 7.9, top: 16.5, delay: 2.8 },
          { left: 59.7, top: 47.1, delay: 3.0 },
          { left: 5.1, top: 10.2, delay: 3.2 },
          { left: 64.8, top: 4.8, delay: 3.4 },
          { left: 35.1, top: 70.5, delay: 3.6 },
          { left: 5.2, top: 29.4, delay: 3.8 },
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
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
          
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            GoStudents
            <span className="block text-4xl md:text-5xl text-gray-200 font-light">
              by GoDaddy
            </span>
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto leading-relaxed"
          >
            Build your digital future with professional tools — from first assignment to first client.
            <span className="block text-lg text-gray-200 mt-2 max-w-2xl mx-auto">
              Get 6 months of premium web development tools completely free - Available exclusively through participating universities!
            </span>
          </motion.p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
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

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-bold text-white mb-8">
              What You&apos;ll Get
            </h2>
            
            {BENEFITS.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                className="flex items-start space-x-4 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-3xl">{benefit.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-200 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Sign-up Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Get Started Today
              </h2>
              <p className="text-gray-200">
                Join thousands of students building their digital future
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* School Selection */}
              <div>
                <label htmlFor="school" className="block text-sm font-medium text-white mb-3">
                  Select Your School
                </label>
                <select
                  id="school"
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:ring-2 focus:ring-[#1BDBDB] focus:border-[#1BDBDB] transition-all duration-300 backdrop-blur-sm"
                  required
                >
                  <option value="" className="text-gray-600">Choose your school...</option>
                  {SCHOOLS.map((school) => (
                    <option key={school.id} value={school.id} className="text-gray-800">
                      {school.logo} {school.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-4 bg-white/10 border rounded-xl text-white placeholder-gray-300 focus:ring-2 focus:ring-[#1BDBDB] focus:border-[#1BDBDB] transition-all duration-300 backdrop-blur-sm ${
                    error ? 'border-red-400' : 'border-white/20'
                  }`}
                  placeholder="your@email.com"
                  required
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-300"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting || !schoolId || !email}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-black text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center space-x-3 border border-gray-700 relative z-10"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-white">Signing up...</span>
                  </div>
                ) : (
                  <>
                    <span className="text-2xl text-white">🚀</span>
                    <span className="text-white">Get Your Free Tools</span>
                  </>
                )}
              </motion.button>
            </form>

            {/* Trust Indicators */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <div className="flex items-center justify-center space-x-6 text-gray-200 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-[#1BDBDB]">✓</span>
                  <span>No Credit Card Required</span>
                </div>
                       <div className="flex items-center space-x-2">
                         <span className="text-[#1BDBDB]">✓</span>
                         <span>Instant Access for Enrolled Students</span>
                       </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center mt-16"
        >
          <p className="text-gray-200 text-lg">
            Ready to build something amazing? Join the next generation of digital creators.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
