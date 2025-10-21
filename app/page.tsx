'use client';

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            GoStudents Demo
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            A production-quality Next.js application showcasing student onboarding flows
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <Link
            href="/gostudents"
            className="group bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <span className="text-2xl">🎓</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                Landing Page
              </h2>
              <p className="text-gray-600 mb-4">
                Production-ready student signup form with validation, password strength checking, and responsive design.
              </p>
              <div className="text-blue-600 font-medium group-hover:text-blue-700">
                View Landing Page →
              </div>
            </div>
          </Link>

          <Link
            href="/gostudents-test"
            className="group bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <span className="text-2xl">🧪</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                Test Playground
              </h2>
              <p className="text-gray-600 mb-4">
                Developer testing interface with mock API controls, latency simulation, and real-time logging.
              </p>
              <div className="text-green-600 font-medium group-hover:text-green-700">
                Open Test Playground →
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Tech Stack</h4>
                <ul className="space-y-1">
                  <li>• Next.js 14 (App Router)</li>
                  <li>• TypeScript</li>
                  <li>• TailwindCSS</li>
                  <li>• Framer Motion</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">UX Features</h4>
                <ul className="space-y-1">
                  <li>• Responsive Design</li>
                  <li>• Password Strength</li>
                  <li>• Form Validation</li>
                  <li>• Accessibility</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Testing</h4>
                <ul className="space-y-1">
                  <li>• Mock API Routes</li>
                  <li>• Latency Simulation</li>
                  <li>• Error Scenarios</li>
                  <li>• Real-time Logging</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}