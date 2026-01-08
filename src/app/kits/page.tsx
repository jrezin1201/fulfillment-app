"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Kit {
  id: string;
  name: string;
  description?: string;
  distributionModel: string;
  fulfillmentModel: string;
  isActive: boolean;
  bomCount: number;
}

export default function KitsPage() {
  const [kits, setKits] = useState<Kit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    distributionModel: "bulk",
    fulfillmentModel: "b2b",
  });

  // Load kits from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("kits");
    if (saved) {
      setKits(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newKit: Kit = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description || undefined,
      distributionModel: formData.distributionModel,
      fulfillmentModel: formData.fulfillmentModel,
      isActive: true,
      bomCount: 0,
    };

    const updatedKits = [...kits, newKit];
    setKits(updatedKits);

    // Save to localStorage
    localStorage.setItem("kits", JSON.stringify(updatedKits));

    setShowForm(false);
    setFormData({
      name: "",
      description: "",
      distributionModel: "bulk",
      fulfillmentModel: "b2b",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kit Management</h1>
          <p className="mt-2 text-gray-600">
            Define kit types and their bill of materials (BOM)
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {showForm ? "Cancel" : "+ New Kit Type"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white shadow sm:rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Create New Kit Type</h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Kit Name *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Bulk Fit, DTC A1c, etc."
              />
              <p className="mt-1 text-sm text-gray-500">
                Examples: Bulk Fit, Bulk KED, DTC Fit, DTC KED, DTC A1c
              </p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Describe this kit type..."
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="distributionModel" className="block text-sm font-medium text-gray-700">
                  Distribution Model *
                </label>
                <select
                  id="distributionModel"
                  required
                  value={formData.distributionModel}
                  onChange={(e) => setFormData({ ...formData, distributionModel: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="bulk">Bulk</option>
                  <option value="dtc">Direct-to-Consumer (DTC)</option>
                </select>
              </div>

              <div>
                <label htmlFor="fulfillmentModel" className="block text-sm font-medium text-gray-700">
                  Fulfillment Model *
                </label>
                <select
                  id="fulfillmentModel"
                  required
                  value={formData.fulfillmentModel}
                  onChange={(e) => setFormData({ ...formData, fulfillmentModel: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="b2b">B2B Bulk</option>
                  <option value="b2c">B2C API-Driven</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Create Kit Type
            </button>
          </div>
        </form>
      )}

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {kits.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No kit types</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first kit type.
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Examples: Bulk Fit, Bulk KED, DTC Fit, DTC KED, DTC A1c
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  + New Kit Type
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Kit Types ({kits.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {kits.map((kit) => (
                  <Link
                    key={kit.id}
                    href={`/kits/${kit.id}`}
                    className="block border border-gray-200 rounded-lg p-5 hover:border-blue-500 hover:shadow-md transition-all bg-white"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">{kit.name}</h4>
                        {kit.description && (
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{kit.description}</p>
                        )}
                      </div>
                      {kit.isActive ? (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-24">Distribution:</span>
                        <span className="font-medium text-gray-900">
                          {kit.distributionModel === "bulk" ? "Bulk" : "Direct-to-Consumer"}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-24">Fulfillment:</span>
                        <span className="font-medium text-gray-900">
                          {kit.fulfillmentModel === "b2b" ? "B2B Bulk" : "B2C API-Driven"}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-24">BOM Items:</span>
                        <span className="font-medium text-gray-900">{kit.bomCount}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <span className="text-sm text-blue-600 font-medium hover:text-blue-700">
                        Manage BOM →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Kit Configuration</h3>
        <p className="text-sm text-blue-800 mb-4">
          Each kit type should define:
        </p>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span><strong>Distribution Model:</strong> Bulk or Direct-to-Consumer (DTC)</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span><strong>Fulfillment Model:</strong> B2B Bulk or B2C API-Driven</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span><strong>Bill of Materials:</strong> Components and quantities per kit</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span><strong>Sourcing Decisions:</strong> Dot-sourced, Dot-manufactured, or Customer-provided</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
