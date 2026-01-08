"use client";

import { useState, useEffect } from "react";

interface Component {
  id: string;
  name: string;
  sku?: string;
  category?: string;
  defaultSourcingType: string;
  defaultVendor?: string;
  unitCost: number;
  currency: string;
  moq?: number;
  leadTimeDays?: number;
  isAtRisk: boolean;
}

export default function ComponentsLibraryPage() {
  const [components, setComponents] = useState<Component[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    defaultSourcingType: "dot_sourced",
    defaultVendor: "",
    unitCost: "",
    moq: "",
    leadTimeDays: "",
    isAtRisk: false,
  });

  // Load components from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("components");
    if (saved) {
      setComponents(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newComponent: Component = {
      id: Date.now().toString(),
      name: formData.name,
      sku: formData.sku || undefined,
      category: formData.category || undefined,
      defaultSourcingType: formData.defaultSourcingType,
      defaultVendor: formData.defaultVendor || undefined,
      unitCost: parseFloat(formData.unitCost) || 0,
      currency: "USD",
      moq: formData.moq ? parseInt(formData.moq) : undefined,
      leadTimeDays: formData.leadTimeDays ? parseInt(formData.leadTimeDays) : undefined,
      isAtRisk: formData.isAtRisk,
    };

    const updatedComponents = [...components, newComponent];
    setComponents(updatedComponents);

    // Save to localStorage
    localStorage.setItem("components", JSON.stringify(updatedComponents));

    setShowForm(false);
    setFormData({
      name: "",
      sku: "",
      category: "",
      defaultSourcingType: "dot_sourced",
      defaultVendor: "",
      unitCost: "",
      moq: "",
      leadTimeDays: "",
      isAtRisk: false,
    });
  };

  const atRiskCount = components.filter((c) => c.isAtRisk).length;
  const vendorCount = new Set(components.map((c) => c.defaultVendor).filter(Boolean)).size;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Component Library</h1>
          <p className="mt-2 text-gray-600">
            Manage component inventory, sourcing, pricing, and vendor information
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {showForm ? "Cancel" : "+ New Component"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white shadow sm:rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Add New Component</h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Polymedco Blood Collection Tube"
              />
            </div>

            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                SKU
              </label>
              <input
                type="text"
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="SKU-12345"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Tubes, Labels, Packaging, etc."
              />
            </div>

            <div>
              <label htmlFor="defaultSourcingType" className="block text-sm font-medium text-gray-700">
                Sourcing Type *
              </label>
              <select
                id="defaultSourcingType"
                required
                value={formData.defaultSourcingType}
                onChange={(e) => setFormData({ ...formData, defaultSourcingType: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="dot_sourced">Dot Sourced</option>
                <option value="dot_manufactured">Dot Manufactured</option>
                <option value="customer_provided">Customer Provided</option>
              </select>
            </div>

            <div>
              <label htmlFor="defaultVendor" className="block text-sm font-medium text-gray-700">
                Vendor
              </label>
              <input
                type="text"
                id="defaultVendor"
                value={formData.defaultVendor}
                onChange={(e) => setFormData({ ...formData, defaultVendor: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Polymedco"
              />
            </div>

            <div>
              <label htmlFor="unitCost" className="block text-sm font-medium text-gray-700">
                Unit Cost ($) *
              </label>
              <input
                type="number"
                step="0.01"
                id="unitCost"
                required
                value={formData.unitCost}
                onChange={(e) => setFormData({ ...formData, unitCost: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="moq" className="block text-sm font-medium text-gray-700">
                MOQ (Minimum Order Quantity)
              </label>
              <input
                type="number"
                id="moq"
                value={formData.moq}
                onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="1000"
              />
            </div>

            <div>
              <label htmlFor="leadTimeDays" className="block text-sm font-medium text-gray-700">
                Lead Time (days)
              </label>
              <input
                type="number"
                id="leadTimeDays"
                value={formData.leadTimeDays}
                onChange={(e) => setFormData({ ...formData, leadTimeDays: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="14"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAtRisk"
              checked={formData.isAtRisk}
              onChange={(e) => setFormData({ ...formData, isAtRisk: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isAtRisk" className="ml-2 block text-sm text-gray-900">
              Mark as at-risk component
            </label>
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
              Add Component
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Components</dt>
                  <dd className="text-lg font-semibold text-gray-900">{components.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">At-Risk Components</dt>
                  <dd className="text-lg font-semibold text-gray-900">{atRiskCount}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Vendors</dt>
                  <dd className="text-lg font-semibold text-gray-900">{vendorCount}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {components.length === 0 ? (
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No components</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding components to your library.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  + New Component
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name / SKU
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sourcing
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Cost
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      MOQ / Lead Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {components.map((component) => (
                    <tr key={component.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{component.name}</div>
                        {component.sku && <div className="text-sm text-gray-500">{component.sku}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {component.category || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {component.defaultSourcingType === "dot_sourced" && "Dot Sourced"}
                          {component.defaultSourcingType === "dot_manufactured" && "Dot Manufactured"}
                          {component.defaultSourcingType === "customer_provided" && "Customer Provided"}
                        </div>
                        {component.defaultVendor && (
                          <div className="text-sm text-gray-500">{component.defaultVendor}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${component.unitCost.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {component.moq && <div>MOQ: {component.moq}</div>}
                        {component.leadTimeDays && <div>{component.leadTimeDays} days</div>}
                        {!component.moq && !component.leadTimeDays && "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {component.isAtRisk ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            At Risk
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Available
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Component Properties</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-semibold mb-2">Basic Information</h4>
            <ul className="space-y-1">
              <li>• Name, SKU, Category</li>
              <li>• Description</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Sourcing</h4>
            <ul className="space-y-1">
              <li>• Dot-sourced / Dot-manufactured / Customer-provided</li>
              <li>• Vendor information</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Pricing</h4>
            <ul className="space-y-1">
              <li>• Unit cost</li>
              <li>• Currency</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Inventory & Risk</h4>
            <ul className="space-y-1">
              <li>• MOQ (Minimum Order Quantity)</li>
              <li>• Lead time in days</li>
              <li>• Risk flags and notes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
