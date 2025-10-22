'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SCHOOLS, type School, type Curriculum } from '@/lib/schools';
import { passwordScore } from '@/lib/password';
import Benefit from '@/components/Benefit';
import { SuccessAlert, ErrorAlert } from '@/components/Alerts';
import { PasswordStrength } from '@/components/FormParts';

export default function GoStudentsPage() {
  const [selectedSchool, setSelectedSchool] = useState<School>(SCHOOLS[0]); // Default to ASU
  const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum>(SCHOOLS[0].curricula[0]);
  const [emailLocal, setEmailLocal] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSchoolChange = (schoolId: string) => {
    const school = SCHOOLS.find(s => s.id === schoolId);
    if (school) {
      setSelectedSchool(school);
      setSelectedCurriculum(school.curricula[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordScore(password) < 3) {
      setAlert({ type: 'error', message: 'Password must meet at least 3 requirements.' });
      return;
    }

    if (!termsAccepted) {
      setAlert({ type: 'error', message: 'You must accept the terms and conditions.' });
      return;
    }

    setIsSubmitting(true);
    setAlert(null);

    try {
      const email = selectedSchool.id === 'other' 
        ? `${emailLocal}@${customDomain}`
        : `${emailLocal}@${selectedSchool.domain}`;

      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolId: selectedSchool.id,
          curriculumId: selectedCurriculum.id,
          email,
          password,
          source: 'landing'
        })
      });

      const data = await response.json();

      if (data.status === 'ok') {
        setAlert({ type: 'success', message: data.message });
        // Redirect to offer page after successful account creation
        setTimeout(() => {
          window.location.href = '/offer';
        }, 2000);
      } else {
        setAlert({ type: 'error', message: data.message });
      }
    } catch {
      setAlert({ type: 'error', message: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
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
                GoStudents by GoDaddy
              </h1>
              <p className="text-xl text-gray-600 mt-4">
                Building your digital future, from first assignment to first client.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-semibold text-gray-900">What you get:</h2>
              <div className="space-y-4">
                <Benefit
                  icon="🌐"
                  title="Free Domain"
                  description="Get your own custom domain name to showcase your projects"
                />
                <Benefit
                  icon="🚀"
                  title="Hosting & Site Builder"
                  description="Build and host your portfolio with our easy-to-use tools"
                />
                <Benefit
                  icon="💼"
                  title="Convert to Business"
                  description="Transform your student projects into professional websites after graduation"
                />
              </div>
            </motion.div>
          </div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {alert && (
                <div className="mb-6">
                  {alert.type === 'success' ? (
                    <SuccessAlert message={alert.message} onClose={() => setAlert(null)} />
                  ) : (
                    <ErrorAlert message={alert.message} onClose={() => setAlert(null)} />
                  )}
                </div>
              )}

              {/* School Selection */}
              <div>
                <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-2">
                  Partner School
                </label>
                <select
                  id="school"
                  value={selectedSchool.id}
                  onChange={(e) => handleSchoolChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {SCHOOLS.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Curriculum Selection */}
              <div>
                <label htmlFor="curriculum" className="block text-sm font-medium text-gray-700 mb-2">
                  Curriculum
                </label>
                <select
                  id="curriculum"
                  value={selectedCurriculum.id}
                  onChange={(e) => {
                    const curriculum = selectedSchool.curricula.find(c => c.id === e.target.value);
                    if (curriculum) setSelectedCurriculum(curriculum);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {selectedSchool.curricula.map((curriculum) => (
                    <option key={curriculum.id} value={curriculum.id}>
                      {curriculum.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="email"
                    value={emailLocal}
                    onChange={(e) => setEmailLocal(e.target.value)}
                    placeholder="your.name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-r-md">
                    @{selectedSchool.id === 'other' ? 'your-school.edu' : selectedSchool.domain}
                  </span>
                </div>
                {selectedSchool.id === 'other' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      placeholder="your-school.edu"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <PasswordStrength password={password} />
              </div>

              {/* Terms */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    Terms and Conditions
                  </a>
                </label>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting || passwordScore(password) < 3 || !termsAccepted}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account (SSO)'}
                </button>
                <button
                  type="button"
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Continue with School SSO
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
