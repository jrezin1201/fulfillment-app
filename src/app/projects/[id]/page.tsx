"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { calculateProjectPricing, type BomLineItem } from "@/lib/pricing";
import { SOWPreview } from "@/components/SOWPreview";

interface ProjectKit {
  id: string;
  kitId: string;
  kitName: string;
  quantity: number;
  manufactureCost: number;
  assemblyCost: number;
  extendedTotal: number;
  warnings?: string[];
}

interface Project {
  id: string;
  projectName: string;
  customerName?: string;
  status: string;
  targetShipDate?: string;
  fulfillmentModel: string;
  totalManufactureCost: number;
  totalAssemblyCost: number;
  totalProjectCost: number;
  createdAt: string;
  projectKits: ProjectKit[];
}

interface Kit {
  id: string;
  name: string;
  distributionModel: string;
  fulfillmentModel: string;
  bomLineItems?: BomLineItem[];
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [availableKits, setAvailableKits] = useState<Kit[]>([]);
  const [showAddKit, setShowAddKit] = useState(false);
  const [selectedKitId, setSelectedKitId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showSOWPreview, setShowSOWPreview] = useState(false);

  useEffect(() => {
    // Load project from localStorage
    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    const foundProject = projects.find((p: Project) => p.id === id);
    if (foundProject) {
      setProject(foundProject);
    }

    // Load available kits
    const kits = JSON.parse(localStorage.getItem("kits") || "[]");
    setAvailableKits(kits);
  }, [id]);

  const handleAddKit = () => {
    if (!project || !selectedKitId || !quantity) return;

    const kit = availableKits.find((k) => k.id === selectedKitId);
    if (!kit) return;

    // Calculate costs using the pricing engine
    const kitQuantity = parseInt(quantity);
    const pricing = calculateKitCosts(kit, kitQuantity);

    const newProjectKit: ProjectKit = {
      id: crypto.randomUUID(),
      kitId: kit.id,
      kitName: kit.name,
      quantity: kitQuantity,
      manufactureCost: pricing.manufactureCost,
      assemblyCost: pricing.assemblyCost,
      extendedTotal: pricing.extendedTotal,
      warnings: pricing.warnings,
    };

    // Recalculate project totals
    const allProjectKits = [...project.projectKits, newProjectKit];
    const totalManufacture = allProjectKits.reduce((sum, pk) => sum + pk.manufactureCost, 0);
    const totalAssembly = allProjectKits.reduce((sum, pk) => sum + pk.assemblyCost, 0);

    const updatedProject = {
      ...project,
      projectKits: allProjectKits,
      totalManufactureCost: totalManufacture,
      totalAssemblyCost: totalAssembly,
      totalProjectCost: totalManufacture + totalAssembly,
    };

    // Save to localStorage
    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    const updatedProjects = projects.map((p: Project) =>
      p.id === project.id ? updatedProject : p
    );
    localStorage.setItem("projects", JSON.stringify(updatedProjects));

    setProject(updatedProject);
    setShowAddKit(false);
    setSelectedKitId("");
    setQuantity("");
  };

  const calculateKitCosts = (kit: Kit, quantity: number) => {
    // If kit has no BOM, use default assembly cost only
    if (!kit.bomLineItems || kit.bomLineItems.length === 0) {
      return {
        manufactureCost: 0,
        assemblyCost: 15 * quantity, // $15 default assembly cost per kit
        extendedTotal: 15 * quantity,
        warnings: ["Kit has no BOM defined - cannot calculate component costs"],
      };
    }

    // Use pricing engine to calculate based on BOM
    const pricing = calculateProjectPricing(
      kit.bomLineItems as BomLineItem[],
      quantity,
      15 // $15 per kit assembly cost
    );

    return {
      manufactureCost: pricing.totalManufactureCost,
      assemblyCost: pricing.assemblyCost,
      extendedTotal: pricing.totalCost,
      warnings: pricing.warnings,
    };
  };

  const handleRemoveKit = (projectKitId: string) => {
    if (!project) return;

    const remainingKits = project.projectKits.filter((pk) => pk.id !== projectKitId);

    // Recalculate project totals
    const totalManufacture = remainingKits.reduce((sum, pk) => sum + pk.manufactureCost, 0);
    const totalAssembly = remainingKits.reduce((sum, pk) => sum + pk.assemblyCost, 0);

    const updatedProject = {
      ...project,
      projectKits: remainingKits,
      totalManufactureCost: totalManufacture,
      totalAssemblyCost: totalAssembly,
      totalProjectCost: totalManufacture + totalAssembly,
    };

    // Save to localStorage
    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    const updatedProjects = projects.map((p: Project) =>
      p.id === project.id ? updatedProject : p
    );
    localStorage.setItem("projects", JSON.stringify(updatedProjects));

    setProject(updatedProject);
  };

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading project...</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "quoted":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "in_production":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <Link
            href="/projects"
            className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-flex items-center"
          >
            ← Back to Projects
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">{project.projectName}</h1>
          <div className="mt-2 flex items-center space-x-3">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
              {project.status.replace("_", " ").toUpperCase()}
            </span>
            {project.customerName && (
              <span className="text-sm text-gray-500">Customer: {project.customerName}</span>
            )}
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Project Details</h3>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Fulfillment Model</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {project.fulfillmentModel === "b2b_bulk" ? "B2B Bulk" : "B2C API-Driven"}
              </dd>
            </div>
            {project.targetShipDate && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Target Ship Date</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(project.targetShipDate).toLocaleDateString()}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(project.createdAt).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Kits */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Kit Configuration</h3>
            <button
              onClick={() => setShowAddKit(!showAddKit)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              {showAddKit ? "Cancel" : "+ Add Kit"}
            </button>
          </div>

          {showAddKit && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Select Kit Type</label>
                  <select
                    value={selectedKitId}
                    onChange={(e) => setSelectedKitId(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Choose a kit...</option>
                    {availableKits.map((kit) => (
                      <option key={kit.id} value={kit.id}>
                        {kit.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="1000"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleAddKit}
                  disabled={!selectedKitId || !quantity}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Add to Project
                </button>
              </div>
            </div>
          )}

          {project.projectKits.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No kits added to this project yet.</p>
              <button
                onClick={() => setShowAddKit(true)}
                className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Add your first kit →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {project.projectKits.map((pk) => (
                <div key={pk.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{pk.kitName}</h4>
                    <p className="text-sm text-gray-500 mt-1">Quantity: {pk.quantity} kits</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Extended Total</p>
                      <p className="text-lg font-semibold text-gray-900">
                        ${pk.extendedTotal.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveKit(pk.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Warnings */}
      {project.projectKits.some((pk) => pk.warnings && pk.warnings.length > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-900 mb-2 flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Pricing Warnings & Notes
          </h3>
          <div className="space-y-3">
            {project.projectKits.map((pk) =>
              pk.warnings && pk.warnings.length > 0 ? (
                <div key={pk.id} className="ml-7">
                  <p className="text-sm font-medium text-yellow-800 mb-1">{pk.kitName} ({pk.quantity} kits):</p>
                  <ul className="list-disc ml-5 text-sm text-yellow-700 space-y-1">
                    {pk.warnings.map((warning, idx) => (
                      <li key={idx}>{warning}</li>
                    ))}
                  </ul>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* Pricing Summary */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing Summary</h3>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Manufacture & Source</dt>
              <dd className="text-sm font-medium text-gray-900">
                ${project.totalManufactureCost.toFixed(2)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Assembly & Fulfillment</dt>
              <dd className="text-sm font-medium text-gray-900">
                ${project.totalAssemblyCost.toFixed(2)}
              </dd>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200">
              <dt className="text-base font-medium text-gray-900">Total Project Cost</dt>
              <dd className="text-base font-bold text-gray-900">
                ${project.totalProjectCost.toFixed(2)}
              </dd>
            </div>
          </dl>

          {project.projectKits.length > 0 && (
            <div className="mt-4">
              <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {showBreakdown ? "− Hide" : "+ Show"} Detailed Cost Breakdown
              </button>
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={() => setShowSOWPreview(true)}
              disabled={project.projectKits.length === 0}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              📄 Generate SOW Document
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Cost Breakdown */}
      {showBreakdown && project.projectKits.length > 0 && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Cost Breakdown</h3>
            <div className="space-y-4">
              {project.projectKits.map((pk) => {
                const costPerKit = pk.quantity > 0 ? pk.extendedTotal / pk.quantity : 0;
                const manufactureCostPerKit = pk.quantity > 0 ? pk.manufactureCost / pk.quantity : 0;
                const assemblyCostPerKit = pk.quantity > 0 ? pk.assemblyCost / pk.quantity : 0;

                return (
                  <div key={pk.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-base font-semibold text-gray-900">{pk.kitName}</h4>
                        <p className="text-sm text-gray-500">Quantity: {pk.quantity} kits</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">${pk.extendedTotal.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">Extended Total</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center py-2 border-t border-gray-100">
                        <div>
                          <p className="font-medium text-gray-700">Manufacture & Source</p>
                          <p className="text-xs text-gray-500">
                            ${manufactureCostPerKit.toFixed(2)} per kit × {pk.quantity} kits
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">${pk.manufactureCost.toFixed(2)}</p>
                      </div>

                      <div className="flex justify-between items-center py-2 border-t border-gray-100">
                        <div>
                          <p className="font-medium text-gray-700">Assembly & Fulfillment</p>
                          <p className="text-xs text-gray-500">
                            ${assemblyCostPerKit.toFixed(2)} per kit × {pk.quantity} kits
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">${pk.assemblyCost.toFixed(2)}</p>
                      </div>

                      <div className="flex justify-between items-center py-2 border-t-2 border-gray-300 mt-2">
                        <div>
                          <p className="font-semibold text-gray-900">Cost Per Kit</p>
                          <p className="text-xs text-gray-500">Total cost divided by quantity</p>
                        </div>
                        <p className="text-lg font-bold text-blue-600">${costPerKit.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {project.projectKits.length > 1 && (
              <div className="mt-6 pt-4 border-t-2 border-gray-300">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-bold text-gray-900">Program Summary</p>
                    <p className="text-sm text-gray-500">
                      {project.projectKits.length} kit types • {project.projectKits.reduce((sum, pk) => sum + pk.quantity, 0)} total kits
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">${project.totalProjectCost.toFixed(2)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SOW Preview Modal */}
      {showSOWPreview && (
        <SOWPreview
          project={project}
          kits={availableKits}
          onClose={() => setShowSOWPreview(false)}
        />
      )}
    </div>
  );
}
