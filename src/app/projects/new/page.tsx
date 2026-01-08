"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewProjectPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    projectName: "",
    customerName: "",
    targetShipDate: "",
    fulfillmentModel: "b2b_bulk" as "b2b_bulk" | "b2c_api",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create new project
    const newProject = {
      id: Date.now().toString(),
      projectName: formData.projectName,
      customerName: formData.customerName || undefined,
      status: "draft",
      targetShipDate: formData.targetShipDate || undefined,
      fulfillmentModel: formData.fulfillmentModel,
      totalManufactureCost: 0,
      totalAssemblyCost: 0,
      totalProjectCost: 0,
      createdAt: new Date().toISOString(),
      projectKits: [],
    };

    // Save to localStorage
    const existingProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    localStorage.setItem("projects", JSON.stringify([...existingProjects, newProject]));

    // Redirect to project detail page
    router.push(`/projects/${newProject.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/projects"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
            Project Name *
          </label>
          <input
            type="text"
            name="projectName"
            id="projectName"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Q1 2026 - Acme Corp Fulfillment"
            value={formData.projectName}
            onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
            Customer Name
          </label>
          <input
            type="text"
            name="customerName"
            id="customerName"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Acme Corporation"
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="targetShipDate" className="block text-sm font-medium text-gray-700">
            Target Ship Date
          </label>
          <input
            type="date"
            name="targetShipDate"
            id="targetShipDate"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={formData.targetShipDate}
            onChange={(e) => setFormData({ ...formData, targetShipDate: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="fulfillmentModel" className="block text-sm font-medium text-gray-700">
            Fulfillment Model *
          </label>
          <select
            id="fulfillmentModel"
            name="fulfillmentModel"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={formData.fulfillmentModel}
            onChange={(e) =>
              setFormData({ ...formData, fulfillmentModel: e.target.value as "b2b_bulk" | "b2c_api" })
            }
          >
            <option value="b2b_bulk">B2B Bulk Fulfillment</option>
            <option value="b2c_api">B2C API-Driven (Per-Kit Shipping)</option>
          </select>
          <p className="mt-2 text-sm text-gray-500">
            Select B2B for bulk shipments or B2C for individual kit fulfillment
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-yellow-800">Next Steps</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>After creating this project, you'll be able to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Add kit types to the project</li>
              <li>Configure quantities for each kit</li>
              <li>Review component sourcing decisions</li>
              <li>Calculate final pricing</li>
              <li>Generate the SOW document</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Link
            href="/projects"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Project
          </button>
        </div>
      </form>
    </div>
  );
}
