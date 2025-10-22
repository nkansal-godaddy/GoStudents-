'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SCHOOLS, type School, type Curriculum } from '@/lib/schools';
import { passwordScore } from '@/lib/password';
import Benefit from '@/components/Benefit';
import { SuccessAlert, ErrorAlert } from '@/components/Alerts';
import { PasswordStrength } from '@/components/FormParts';

type Outcome = 'success' | 'error';
type Verifier = 'SheerID' | 'UNiDAYS' | 'Student Beans' | 'GitHub Education';

interface LogEntry {
  timestamp: string;
  type: 'payload' | 'result';
  content: string;
}

export default function GoStudentsTestPage() {
  const [selectedSchool, setSelectedSchool] = useState<School>(SCHOOLS[0]);
  const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum>(SCHOOLS[0].curricula[0]);
  const [emailLocal, setEmailLocal] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Test controls
  const [testMode, setTestMode] = useState(true);
  const [outcome, setOutcome] = useState<Outcome>('success');
  const [latency, setLatency] = useState(600);
  const [verifier, setVerifier] = useState<Verifier>('SheerID');
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const handleSchoolChange = (schoolId: string) => {
    const school = SCHOOLS.find(s => s.id === schoolId);
    if (school) {
      setSelectedSchool(school);
      setSelectedCurriculum(school.curricula[0]);
    }
  };

  const addLog = (type: 'payload' | 'result', content: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, type, content }]);
  };

  const clearLogs = () => {
    setLogs([]);
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

    const email = selectedSchool.id === 'other' 
      ? `${emailLocal}@${customDomain}`
      : `${emailLocal}@${selectedSchool.domain}`;

    const payload = {
      schoolId: selectedSchool.id,
      curriculumId: selectedCurriculum.id,
      email,
      password,
      verifier,
      source: 'test'
    };

    addLog('payload', JSON.stringify(payload, null, 2));

    try {
      if (testMode) {
        // Simulate latency
        await new Promise(resolve => setTimeout(resolve, latency));
        
        const result = outcome === 'success' 
          ? { status: 'ok', message: 'Account created! Verify your student email.' }
          : { status: 'error', message: 'Mock API: forced error' };
        
        addLog('result', JSON.stringify(result, null, 2));
        
        if (result.status === 'ok') {
          setAlert({ type: 'success', message: result.message });
          // Redirect to offer page after successful account creation
          setTimeout(() => {
            window.location.href = '/offer';
          }, 2000);
        } else {
          setAlert({ type: 'error', message: result.message });
        }
      } else {
        // Call real API
        const response = await fetch(`/api/signup?latency=${latency}&outcome=${outcome}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        addLog('result', JSON.stringify(data, null, 2));

        if (data.status === 'ok') {
          setAlert({ type: 'success', message: data.message });
          // Redirect to offer page after successful account creation
          setTimeout(() => {
            window.location.href = '/offer';
          }, 2000);
        } else {
          setAlert({ type: 'error', message: data.message });
        }
      }
    } catch {
      const errorResult = { status: 'error', message: 'Network error occurred' };
      addLog('result', JSON.stringify(errorResult, null, 2));
      setAlert({ type: 'error', message: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Benefits */}
          <div className="lg:col-span-1 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold text-gray-900">
                GoStudents Test Playground
              </h1>
              <p className="text-xl text-gray-600 mt-4">
                Test the signup flow with different scenarios and outcomes.
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
                  icon="🧪"
                  title="Test Controls"
                  description="Simulate different outcomes and latency scenarios"
                />
                <Benefit
                  icon="📊"
                  title="Live Logging"
                  description="See payloads and responses in real-time"
                />
                <Benefit
                  icon="⚡"
                  title="Mock API"
                  description="Test without backend dependencies"
                />
              </div>
            </motion.div>
          </div>

          {/* Middle Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-lg p-6">
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
            </div>
          </motion.div>

          {/* Right Column - Test Controls & Logs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Test Controls */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Controls</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={testMode}
                      onChange={(e) => setTestMode(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Test mode</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Outcome
                  </label>
                  <select
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value as Outcome)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="success">Success</option>
                    <option value="error">Error</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latency (ms)
                  </label>
                  <input
                    type="number"
                    value={latency}
                    onChange={(e) => setLatency(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verifier
                  </label>
                  <select
                    value={verifier}
                    onChange={(e) => setVerifier(e.target.value as Verifier)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="SheerID">SheerID</option>
                    <option value="UNiDAYS">UNiDAYS</option>
                    <option value="Student Beans">Student Beans</option>
                    <option value="GitHub Education">GitHub Education</option>
                  </select>
                </div>

                <button
                  onClick={clearLogs}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Clear Logs
                </button>
              </div>
            </div>

            {/* Outgoing Payload (when in test mode) */}
            {testMode && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Outgoing Payload (mock)</h3>
                <textarea
                  readOnly
                  value={JSON.stringify({
                    schoolId: selectedSchool.id,
                    curriculumId: selectedCurriculum.id,
                    email: selectedSchool.id === 'other' 
                      ? `${emailLocal}@${customDomain}`
                      : `${emailLocal}@${selectedSchool.domain}`,
                    password: '***',
                    verifier,
                    source: 'test'
                  }, null, 2)}
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono bg-gray-50"
                />
              </div>
            )}

            {/* Logs */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Console Logs</h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded-md h-64 overflow-y-auto font-mono text-sm">
                {logs.length === 0 ? (
                  <div className="text-gray-500">No logs yet...</div>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="mb-2">
                      <div className="text-gray-400 text-xs">[{log.timestamp}] {log.type.toUpperCase()}</div>
                      <pre className="whitespace-pre-wrap">{log.content}</pre>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
