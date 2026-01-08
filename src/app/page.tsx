/**
 * Homepage / Dashboard
 *
 * Entry point for the Dot Fulfillment app
 */

"use client";

import Link from "next/link";
import { useState } from "react";
import { moduleRegistry } from "@/config/registry";
import { seedSampleData, clearAllData } from "@/lib/sample-data";

export default function HomePage() {
  const modules = Object.values(moduleRegistry).filter((m) => m.id !== "auth");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleLoadSampleData = () => {
    seedSampleData();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    // Reload page to show updated data
    setTimeout(() => window.location.reload(), 500);
  };

  const handleClearData = () => {
    clearAllData();
    setShowClearConfirm(false);
    window.location.reload();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to Dot Fulfillment - Kit-based manufacturing and fulfillment management
        </p>
      </div>

      {/* Sample Data Loader */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-purple-900 flex items-center">
              <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Quick Start with Sample Data
            </h3>
            <p className="mt-2 text-purple-800">
              Load pre-configured components, kits, and projects to explore the app instantly.
            </p>
            <div className="mt-3 bg-white/50 rounded-lg p-3 text-sm text-purple-900">
              <p className="font-semibold mb-2">Includes:</p>
              <ul className="space-y-1 ml-4">
                <li>• <strong>10 Components</strong> - tubes, labels, packaging, cold chain, customer-provided</li>
                <li>• <strong>4 Kit Types</strong> - with complete BOMs (Bulk Fit, DTC Fit, DTC A1c, Bulk KED)</li>
                <li>• <strong>3 Example Projects</strong> - fully configured with pricing:</li>
              </ul>
              <div className="ml-8 mt-2 space-y-1 text-xs">
                <p>→ <strong>Acme Fitness</strong>: 10,000 kits, $213,750 (B2B Bulk)</p>
                <p>→ <strong>HealthTech</strong>: 3,000 kits, $70,500 (DTC with customer-provided items)</p>
                <p>→ <strong>FitLife National</strong>: 25,000 kits, $662,500 (Enterprise DTC)</p>
              </div>
            </div>
            <div className="mt-4 flex space-x-3">
              <button
                onClick={handleLoadSampleData}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
              >
                🚀 Load Sample Data
              </button>
              <button
                onClick={() => setShowClearConfirm(true)}
                className="inline-flex items-center px-4 py-2 border border-purple-300 text-sm font-medium rounded-md text-purple-700 bg-white hover:bg-purple-50"
              >
                🗑️ Clear All Data
              </button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-md">
            <p className="text-sm text-green-800 font-medium">
              ✅ Sample data loaded successfully! Refreshing page...
            </p>
          </div>
        )}

        {/* Clear Confirmation Modal */}
        {showClearConfirm && (
          <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded-md">
            <p className="text-sm text-red-800 font-medium mb-3">
              ⚠️ Are you sure you want to clear all data? This cannot be undone.
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleClearData}
                className="px-3 py-1 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded"
              >
                Yes, Clear All
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-lg font-semibold text-blue-900">
              New to Dot Fulfillment?
            </h3>
            <p className="mt-2 text-blue-800">
              Learn how to set up components, create kits, configure BOMs, and generate project quotes.
              Check out the comprehensive guide with step-by-step instructions.
            </p>
            <div className="mt-4">
              <Link
                href="/instructions"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                📚 View Instructions & Documentation
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Link
            key={module.id}
            href={module.route}
            className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all"
          >
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{module.icon}</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{module.name}</h3>
                <p className="text-sm text-gray-500">{module.category}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">{module.description}</p>
          </Link>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">Quick Start</h2>
        <ol className="list-decimal list-inside space-y-2 text-blue-800">
          <li>Add components to your library (tubes, labels, packaging, etc.)</li>
          <li>Create kit types and define their BOMs</li>
          <li>Start a new project to generate quotes and SOWs</li>
          <li>Configure sourcing and pricing for each component</li>
        </ol>
      </div>
    </div>
  );
}
