"use client";

import { useState } from "react";
import Link from "next/link";

type Tab = "setup" | "how-it-works" | "current" | "api-integration";

export default function InstructionsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("setup");

  const tabs = [
    { id: "setup" as Tab, label: "Setup Guide", icon: "🚀" },
    { id: "how-it-works" as Tab, label: "How It Works", icon: "⚙️" },
    { id: "current" as Tab, label: "Current Architecture", icon: "📦" },
    { id: "api-integration" as Tab, label: "API Integration", icon: "🔌" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Instructions & Documentation</h1>
        <p className="mt-2 text-gray-600">
          Complete guide to using and understanding the Dot Fulfillment app
        </p>
      </div>

      {/* High-Level Summary */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">What is Dot Fulfillment?</h2>
            <p className="text-blue-50 text-lg">
              A kit-based manufacturing and fulfillment management system designed for healthcare diagnostic companies
              that need to quote, source, assemble, and deliver multi-component test kits at scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center">
                <span className="mr-2">🎯</span>
                What It Does
              </h3>
              <ul className="space-y-1 text-blue-50">
                <li>• Manage component inventory with sourcing types and vendor info</li>
                <li>• Build Bills of Materials (BOMs) for multiple kit types</li>
                <li>• Generate project quotes with automatic pricing calculations</li>
                <li>• Calculate order quantities with MOQ optimization</li>
                <li>• Track customer-provided vs. Dot-sourced components</li>
                <li>• Produce SOW documents with detailed cost breakdowns</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center">
                <span className="mr-2">💡</span>
                The Problem It Solves
              </h3>
              <ul className="space-y-1 text-blue-50">
                <li>• <strong>Manual pricing:</strong> Automates complex decision trees for component sourcing</li>
                <li>• <strong>MOQ headaches:</strong> Calculates optimal order quantities with buffer percentages</li>
                <li>• <strong>Customer dependencies:</strong> Tracks which components require customer delivery</li>
                <li>• <strong>Quote generation:</strong> Instantly generates professional SOWs with pricing breakdowns</li>
                <li>• <strong>Multi-kit programs:</strong> Manages projects with multiple kit types and quantities</li>
              </ul>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-lg p-4 mt-6">
            <h3 className="font-semibold text-lg mb-2">Who It's For</h3>
            <p className="text-blue-50">
              <strong>Operations Teams</strong> who need to quickly quote new programs • <strong>Account Managers</strong> generating SOWs for customers •
              <strong>Manufacturing Teams</strong> tracking component sourcing and lead times • <strong>Finance Teams</strong> reviewing cost structures
            </p>
          </div>

          <div className="bg-yellow-400 text-yellow-900 rounded-lg p-4 mt-4">
            <p className="font-semibold">
              ⚡ Currently running in <strong>prototype mode</strong> with localStorage. All functionality works immediately—no setup required.
              API routes are ready for database migration when needed.
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
                ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white shadow sm:rounded-lg p-6">
        {activeTab === "setup" && <SetupGuide />}
        {activeTab === "how-it-works" && <HowItWorks />}
        {activeTab === "current" && <CurrentArchitecture />}
        {activeTab === "api-integration" && <ApiIntegration />}
      </div>
    </div>
  );
}

function SetupGuide() {
  return (
    <div className="prose max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">🚀 Setup Guide</h2>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-green-900 mb-2">✅ No Setup Required!</h3>
        <p className="text-green-800">
          The app works immediately with localStorage. No database, no configuration, no API keys needed.
        </p>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Quick Start (3 Minutes)</h3>

      <div className="space-y-6">
        <div className="border-l-4 border-blue-500 pl-4">
          <h4 className="font-semibold text-gray-900 mb-2">Step 1: Add Components</h4>
          <p className="text-gray-700 mb-2">
            Go to <Link href="/components-library" className="text-blue-600 hover:underline">Components Library</Link>
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li>Click "+ New Component"</li>
            <li>Fill in component details:</li>
            <ul className="list-circle ml-6 space-y-1">
              <li><strong>Name:</strong> "Polymedco Blood Collection Tube"</li>
              <li><strong>SKU:</strong> "POLY-001" (optional)</li>
              <li><strong>Category:</strong> "Tubes"</li>
              <li><strong>Sourcing Type:</strong> Dot Sourced / Dot Manufactured / Customer Provided</li>
              <li><strong>Unit Cost:</strong> $2.50</li>
              <li><strong>MOQ:</strong> 1000 (minimum order quantity)</li>
              <li><strong>Lead Time:</strong> 14 days</li>
            </ul>
            <li>Click "Add Component"</li>
          </ul>
          <div className="mt-3 p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600"><strong>Example:</strong> Add 5-10 components like tubes, labels, packaging, instructions, etc.</p>
          </div>
        </div>

        <div className="border-l-4 border-purple-500 pl-4">
          <h4 className="font-semibold text-gray-900 mb-2">Step 2: Create Kit Types</h4>
          <p className="text-gray-700 mb-2">
            Go to <Link href="/kits" className="text-blue-600 hover:underline">Kit Management</Link>
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li>Click "+ New Kit Type"</li>
            <li>Create a kit (e.g., "Bulk Fit", "DTC A1c")</li>
            <li>Set Distribution Model: Bulk or Direct-to-Consumer</li>
            <li>Set Fulfillment Model: B2B Bulk or B2C API-Driven</li>
            <li>Click "Create Kit Type"</li>
          </ul>
        </div>

        <div className="border-l-4 border-orange-500 pl-4">
          <h4 className="font-semibold text-gray-900 mb-2">Step 3: Build Bill of Materials (BOM)</h4>
          <p className="text-gray-700 mb-2">
            Click on any kit card to open the BOM editor
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li>Click "+ Add Component"</li>
            <li>Select component from dropdown</li>
            <li>Set units per kit (e.g., 1 tube per kit)</li>
            <li>Set buffer % (default 2% for scrap/QA)</li>
            <li>Choose sourcing type (can override component default)</li>
            <li>Click "Add to BOM"</li>
            <li>Repeat for all components in the kit</li>
          </ul>
        </div>

        <div className="border-l-4 border-green-500 pl-4">
          <h4 className="font-semibold text-gray-900 mb-2">Step 4: Create a Project/Quote</h4>
          <p className="text-gray-700 mb-2">
            Go to <Link href="/projects" className="text-blue-600 hover:underline">Projects</Link>
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li>Click "+ New Project"</li>
            <li>Enter project name: "Q1 2026 - Acme Corp"</li>
            <li>Add customer name (optional)</li>
            <li>Set target ship date</li>
            <li>Choose fulfillment model</li>
            <li>Click "Create Project"</li>
          </ul>
        </div>

        <div className="border-l-4 border-red-500 pl-4">
          <h4 className="font-semibold text-gray-900 mb-2">Step 5: Configure Project Kits</h4>
          <p className="text-gray-700 mb-2">
            On the project detail page
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li>Click "+ Add Kit"</li>
            <li>Select a kit type from dropdown</li>
            <li>Enter quantity (e.g., 3000 kits)</li>
            <li>Click "Add to Project"</li>
            <li>Add multiple kit types if needed</li>
            <li>View automatic pricing summary</li>
          </ul>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Pro Tips</h3>
        <ul className="list-disc ml-6 text-blue-800 space-y-2">
          <li><strong>Data Persists:</strong> All your data is saved to localStorage - it survives page reloads!</li>
          <li><strong>Customer-Provided Components:</strong> Mark components as "Customer Provided" to exclude them from sourcing costs</li>
          <li><strong>Buffer Percentage:</strong> Use 2-5% buffer to account for scrap, QA failures, and future builds</li>
          <li><strong>MOQ Optimization:</strong> The pricing engine will recommend larger quantities for print efficiency</li>
        </ul>
      </div>
    </div>
  );
}

function HowItWorks() {
  return (
    <div className="prose max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">⚙️ How It Works</h2>

      <p className="text-gray-700 mb-6">
        This app implements the complete decision tree for kit-based manufacturing and fulfillment,
        based on real-world SOW requirements.
      </p>

      <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">The Decision Tree</h3>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white mr-3">1</span>
              Is the Component Customer-Provided?
            </h4>
            <div className="ml-11 space-y-3">
              <div className="border-l-2 border-green-500 pl-4">
                <p className="font-medium text-green-900">✅ YES → Customer Provides</p>
                <ul className="list-disc ml-6 text-gray-700 space-y-1 mt-2">
                  <li><strong>Exclude</strong> from "Manufacture & Source" costs</li>
                  <li><strong>Include:</strong> Receiving, Inspection, QA, Kitting handling</li>
                  <li><strong>Flag dependency:</strong> "Production timeline dependent on customer delivery"</li>
                  <li><strong>Require:</strong> Delivery date, packaging format, quality specs</li>
                </ul>
              </div>
              <div className="border-l-2 border-blue-500 pl-4">
                <p className="font-medium text-blue-900">❌ NO → Dot Must Source</p>
                <p className="text-gray-700 mt-2">Component must be sourced or manufactured by Dot → Proceed to Step 2</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white mr-3">2</span>
              How Many Must Be Ordered?
            </h4>
            <div className="ml-11 space-y-3">
              <div className="bg-white border border-gray-300 rounded p-4">
                <p className="font-mono text-sm text-gray-900 mb-2">
                  <strong>Order Quantity =</strong>
                </p>
                <p className="font-mono text-sm text-gray-700 ml-4">
                  (Units per kit × Total kits) + Buffer %
                </p>
                <div className="mt-4 space-y-2 text-sm text-gray-700">
                  <p><strong>Example:</strong></p>
                  <ul className="list-disc ml-6">
                    <li>Kits needed: 3,000</li>
                    <li>Units per kit: 1 tube</li>
                    <li>Buffer: 2% (60 extra units for scrap/QA)</li>
                    <li><strong className="text-green-700">Base Order: 3,060 tubes</strong></li>
                  </ul>
                </div>
              </div>
              <div className="border-l-2 border-orange-500 pl-4">
                <p className="font-medium text-orange-900">MOQ Check</p>
                <p className="text-gray-700 mt-1">
                  If calculated quantity {'<'} MOQ → Recommend ordering MOQ amount
                </p>
              </div>
              <div className="border-l-2 border-purple-500 pl-4">
                <p className="font-medium text-purple-900">Print Efficiency Optimization</p>
                <p className="text-gray-700 mt-1">
                  For large orders (1000+), round to nearest 100 to save setup costs
                </p>
                <p className="text-sm text-gray-600 mt-1">Example: 3,060 → 3,100 (better print run)</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white mr-3">3</span>
              Lead Time & Risk Adjustment
            </h4>
            <div className="ml-11 space-y-3">
              <div className="border-l-2 border-blue-500 pl-4">
                <p className="font-medium text-blue-900">Dot-Sourced</p>
                <ul className="list-disc ml-6 text-gray-700 space-y-1 mt-2">
                  <li>Use standard lead time from component library</li>
                  <li>Flag "at-risk" components (long lead times, single vendor)</li>
                  <li>Add vendor name to SOW</li>
                </ul>
              </div>
              <div className="border-l-2 border-orange-500 pl-4">
                <p className="font-medium text-orange-900">Customer-Provided</p>
                <ul className="list-disc ml-6 text-gray-700 space-y-1 mt-2">
                  <li>Require delivery date in SOW</li>
                  <li>Add clause: "Delays may impact delivery schedule"</li>
                  <li>Include receiving/inspection timeline</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Pricing Structure</h3>

      <div className="space-y-4">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <h4 className="font-semibold text-blue-900">Manufacture & Source</h4>
          <p className="text-blue-800 mt-1">
            Component costs for Dot-sourced items only. Customer-provided components excluded.
          </p>
          <p className="font-mono text-sm text-blue-900 mt-2">
            = Σ (Order Quantity × Unit Cost)
          </p>
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 p-4">
          <h4 className="font-semibold text-green-900">Assembly & Fulfillment</h4>
          <p className="text-green-800 mt-1">
            Kitting, QA, packaging, shipping. Applies to all kits regardless of sourcing.
          </p>
          <p className="font-mono text-sm text-green-900 mt-2">
            = Kits × Assembly Cost per Kit (default $15/kit)
          </p>
        </div>

        <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
          <h4 className="font-semibold text-purple-900">Extended Kit Total</h4>
          <p className="text-purple-800 mt-1">
            Total cost per kit type including all components and assembly.
          </p>
          <p className="font-mono text-sm text-purple-900 mt-2">
            = (Manufacture + Assembly) per kit × Quantity
          </p>
        </div>

        <div className="bg-gray-900 text-white border-l-4 border-yellow-500 p-4">
          <h4 className="font-semibold">Total Program Cost</h4>
          <p className="mt-1">
            Sum of all kit types in the project.
          </p>
          <p className="font-mono text-sm mt-2">
            = Σ (Extended Kit Totals)
          </p>
        </div>
      </div>
    </div>
  );
}

function CurrentArchitecture() {
  return (
    <div className="prose max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">📦 Current Architecture</h2>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">⚡ Currently Using localStorage</h3>
        <p className="text-yellow-800">
          All data is stored in your browser's localStorage. No backend, no database, no API calls.
          This allows immediate testing and prototyping without any setup.
        </p>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Data Flow</h3>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-48 font-semibold text-gray-900">Components Page</div>
            <div className="flex-1">
              <div className="flex items-center">
                <span className="text-gray-500">→</span>
                <code className="mx-2 px-2 py-1 bg-white border rounded text-sm">useState</code>
                <span className="text-gray-500">→</span>
                <code className="mx-2 px-2 py-1 bg-white border rounded text-sm">localStorage.setItem()</code>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex-shrink-0 w-48 font-semibold text-gray-900">Kits Page</div>
            <div className="flex-1">
              <div className="flex items-center">
                <span className="text-gray-500">→</span>
                <code className="mx-2 px-2 py-1 bg-white border rounded text-sm">useState</code>
                <span className="text-gray-500">→</span>
                <code className="mx-2 px-2 py-1 bg-white border rounded text-sm">localStorage.setItem()</code>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex-shrink-0 w-48 font-semibold text-gray-900">Projects Page</div>
            <div className="flex-1">
              <div className="flex items-center">
                <span className="text-gray-500">→</span>
                <code className="mx-2 px-2 py-1 bg-white border rounded text-sm">useState</code>
                <span className="text-gray-500">→</span>
                <code className="mx-2 px-2 py-1 bg-white border rounded text-sm">localStorage.setItem()</code>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">localStorage Keys</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Key</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4"><code className="text-sm">components</code></td>
              <td className="px-6 py-4 text-sm text-gray-900">Array</td>
              <td className="px-6 py-4 text-sm text-gray-500">All component inventory data</td>
            </tr>
            <tr>
              <td className="px-6 py-4"><code className="text-sm">kits</code></td>
              <td className="px-6 py-4 text-sm text-gray-900">Array</td>
              <td className="px-6 py-4 text-sm text-gray-500">Kit types with embedded BOMs</td>
            </tr>
            <tr>
              <td className="px-6 py-4"><code className="text-sm">projects</code></td>
              <td className="px-6 py-4 text-sm text-gray-900">Array</td>
              <td className="px-6 py-4 text-sm text-gray-500">Projects with embedded kit configurations</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Advantages of Current Approach</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-green-200 bg-green-50 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-2">✅ Pros</h4>
          <ul className="list-disc ml-6 text-green-800 space-y-1">
            <li>Zero setup time</li>
            <li>No database costs</li>
            <li>No backend required</li>
            <li>Works offline</li>
            <li>Instant prototyping</li>
            <li>No API rate limits</li>
          </ul>
        </div>

        <div className="border border-red-200 bg-red-50 rounded-lg p-4">
          <h4 className="font-semibold text-red-900 mb-2">⚠️ Limitations</h4>
          <ul className="list-disc ml-6 text-red-800 space-y-1">
            <li>Data only in one browser</li>
            <li>No multi-user support</li>
            <li>No data backup</li>
            <li>~5MB storage limit</li>
            <li>Clearing cache = data loss</li>
            <li>No server-side validation</li>
          </ul>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Code Example</h3>

      <div className="bg-gray-900 text-white rounded-lg p-4 overflow-x-auto">
        <pre className="text-sm"><code>{`// Current implementation (Components page)
const [components, setComponents] = useState<Component[]>([]);

// Load from localStorage on mount
useEffect(() => {
  const saved = localStorage.getItem("components");
  if (saved) {
    setComponents(JSON.parse(saved));
  }
}, []);

// Save when adding new component
const handleSubmit = (newComponent) => {
  const updated = [...components, newComponent];
  setComponents(updated);

  // Save to localStorage
  localStorage.setItem("components", JSON.stringify(updated));
};`}</code></pre>
      </div>
    </div>
  );
}

function ApiIntegration() {
  return (
    <div className="prose max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">🔌 API Integration Guide</h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">📚 What's Already Built</h3>
        <p className="text-blue-800">
          All API routes are already created in <code>/src/app/api/</code>. You just need to connect the UI to them!
        </p>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Available API Endpoints</h3>

      <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 font-semibold text-gray-900">Components</div>
          <div className="p-4 space-y-2">
            <div className="flex items-center space-x-3">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">POST</span>
              <code className="text-sm">/api/components</code>
              <span className="text-sm text-gray-600">Create component</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">GET</span>
              <code className="text-sm">/api/components</code>
              <span className="text-sm text-gray-600">List all components</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">GET</span>
              <code className="text-sm">/api/components/[id]</code>
              <span className="text-sm text-gray-600">Get single component</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">PUT</span>
              <code className="text-sm">/api/components/[id]</code>
              <span className="text-sm text-gray-600">Update component</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">DELETE</span>
              <code className="text-sm">/api/components/[id]</code>
              <span className="text-sm text-gray-600">Delete component</span>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 font-semibold text-gray-900">Kits</div>
          <div className="p-4 space-y-2">
            <div className="flex items-center space-x-3">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">POST</span>
              <code className="text-sm">/api/kits</code>
              <span className="text-sm text-gray-600">Create kit</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">GET</span>
              <code className="text-sm">/api/kits</code>
              <span className="text-sm text-gray-600">List all kits with BOMs</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">PUT/DELETE</span>
              <code className="text-sm">/api/kits/[id]</code>
              <span className="text-sm text-gray-600">Update/delete kit</span>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 font-semibold text-gray-900">BOM Line Items</div>
          <div className="p-4 space-y-2">
            <div className="flex items-center space-x-3">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">POST</span>
              <code className="text-sm">/api/bom-line-items</code>
              <span className="text-sm text-gray-600">Add component to kit BOM</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">PUT/DELETE</span>
              <code className="text-sm">/api/bom-line-items/[id]</code>
              <span className="text-sm text-gray-600">Update/remove from BOM</span>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 font-semibold text-gray-900">Projects</div>
          <div className="p-4 space-y-2">
            <div className="flex items-center space-x-3">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">POST</span>
              <code className="text-sm">/api/projects</code>
              <span className="text-sm text-gray-600">Create project</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">GET</span>
              <code className="text-sm">/api/projects</code>
              <span className="text-sm text-gray-600">List all projects</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">POST</span>
              <code className="text-sm">/api/projects/[id]/kits</code>
              <span className="text-sm text-gray-600">Add kit to project</span>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Migration Steps</h3>

      <div className="space-y-6">
        <div className="border-l-4 border-blue-500 pl-4">
          <h4 className="font-semibold text-gray-900 mb-2">Step 1: Set Up Database</h4>
          <div className="bg-gray-900 text-white rounded p-4 text-sm">
            <pre><code>{`# Add to .env
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Run migrations
npx prisma migrate dev --name init
npx prisma generate`}</code></pre>
          </div>
        </div>

        <div className="border-l-4 border-purple-500 pl-4">
          <h4 className="font-semibold text-gray-900 mb-2">Step 2: Update Components Page</h4>
          <p className="text-gray-700 mb-3">Replace localStorage with API calls:</p>
          <div className="bg-gray-900 text-white rounded p-4 text-sm overflow-x-auto">
            <pre><code>{`// BEFORE (localStorage)
const [components, setComponents] = useState<Component[]>([]);

useEffect(() => {
  const saved = localStorage.getItem("components");
  if (saved) setComponents(JSON.parse(saved));
}, []);

const handleSubmit = (newComponent) => {
  const updated = [...components, newComponent];
  setComponents(updated);
  localStorage.setItem("components", JSON.stringify(updated));
};

// AFTER (API)
const [components, setComponents] = useState<Component[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchComponents() {
    const response = await fetch('/api/components');
    const data = await response.json();
    setComponents(data);
    setLoading(false);
  }
  fetchComponents();
}, []);

const handleSubmit = async (formData) => {
  const response = await fetch('/api/components', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  const newComponent = await response.json();
  setComponents([...components, newComponent]);
};`}</code></pre>
          </div>
        </div>

        <div className="border-l-4 border-green-500 pl-4">
          <h4 className="font-semibold text-gray-900 mb-2">Step 3: Add Loading States</h4>
          <div className="bg-gray-900 text-white rounded p-4 text-sm">
            <pre><code>{`if (loading) {
  return <div>Loading components...</div>;
}

if (error) {
  return <div>Error: {error.message}</div>;
}`}</code></pre>
          </div>
        </div>

        <div className="border-l-4 border-orange-500 pl-4">
          <h4 className="font-semibold text-gray-900 mb-2">Step 4: Repeat for Other Pages</h4>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li>Kits page → <code>/api/kits</code></li>
            <li>Kit detail (BOM) → <code>/api/bom-line-items</code></li>
            <li>Projects page → <code>/api/projects</code></li>
            <li>Project detail → <code>/api/projects/[id]/kits</code></li>
          </ul>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Benefits of API Integration</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-green-200 bg-green-50 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-2">✅ Advantages</h4>
          <ul className="list-disc ml-6 text-green-800 space-y-1">
            <li>Multi-user support</li>
            <li>Data persistence across devices</li>
            <li>Server-side validation</li>
            <li>Database backups</li>
            <li>Advanced queries</li>
            <li>Production-ready</li>
          </ul>
        </div>

        <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">📊 What You Get</h4>
          <ul className="list-disc ml-6 text-blue-800 space-y-1">
            <li>Real database relationships</li>
            <li>Transactional integrity</li>
            <li>Concurrent user access</li>
            <li>Audit trails</li>
            <li>Search & filtering</li>
            <li>Export capabilities</li>
          </ul>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
        <h4 className="font-semibold text-yellow-900 mb-2">💡 Recommended: Incremental Migration</h4>
        <p className="text-yellow-800">
          Migrate one page at a time. Test thoroughly. Keep localStorage as backup during transition.
          Start with Components, then Kits, then Projects.
        </p>
      </div>
    </div>
  );
}
