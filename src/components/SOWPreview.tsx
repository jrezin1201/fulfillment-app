/**
 * Statement of Work (SOW) Preview Component
 *
 * Displays a formatted SOW document preview for projects
 */

"use client";

import { generateCustomerFurnishedClause, generateDotSourcingClause } from "@/lib/pricing";

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
  description?: string;
  bomLineItems?: any[];
}

interface SOWPreviewProps {
  project: Project;
  kits: Kit[];
  onClose: () => void;
}

export function SOWPreview({ project, kits, onClose }: SOWPreviewProps) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hasCustomerProvided = project.projectKits.some((pk) => {
    const kit = kits.find((k) => k.id === pk.kitId);
    return kit?.bomLineItems?.some((item: any) => item.sourcingType === "customer_provided");
  });

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto z-50">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Statement of Work Preview</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                🖨️ Print
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>

          {/* SOW Content */}
          <div className="px-6 py-8 space-y-8 max-h-[70vh] overflow-y-auto">
            {/* Title Section */}
            <div className="text-center border-b pb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Statement of Work</h1>
              <p className="text-lg text-gray-700">{project.projectName}</p>
              <p className="text-sm text-gray-500 mt-2">Prepared: {currentDate}</p>
              {project.customerName && (
                <p className="text-sm text-gray-500">Customer: {project.customerName}</p>
              )}
            </div>

            {/* Project Overview */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Project Overview</h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Project Name:</span>
                  <span className="text-gray-900">{project.projectName}</span>
                </div>
                {project.customerName && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Customer:</span>
                    <span className="text-gray-900">{project.customerName}</span>
                  </div>
                )}
                {project.targetShipDate && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Target Ship Date:</span>
                    <span className="text-gray-900">
                      {new Date(project.targetShipDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Fulfillment Model:</span>
                  <span className="text-gray-900">
                    {project.fulfillmentModel === "b2b_bulk" ? "B2B Bulk Shipment" : "B2C API-Driven"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Total Kits:</span>
                  <span className="text-gray-900">
                    {project.projectKits.reduce((sum, pk) => sum + pk.quantity, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Kit Configuration */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Kit Configuration</h2>
              <div className="space-y-4">
                {project.projectKits.map((pk) => {
                  const kit = kits.find((k) => k.id === pk.kitId);
                  return (
                    <div key={pk.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{pk.kitName}</h3>
                          {kit?.description && (
                            <p className="text-sm text-gray-600 mt-1">{kit.description}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Quantity</p>
                          <p className="text-xl font-bold text-gray-900">{pk.quantity.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* BOM Table */}
                      {kit?.bomLineItems && kit.bomLineItems.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Bill of Materials:</p>
                          <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 border-b">
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                  Component
                                </th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                                  Units/Kit
                                </th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                                  Sourcing
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {kit.bomLineItems.map((item: any, idx: number) => (
                                <tr key={idx}>
                                  <td className="px-3 py-2 text-gray-900">{item.componentName}</td>
                                  <td className="px-3 py-2 text-right text-gray-900">{item.unitsPerKit}</td>
                                  <td className="px-3 py-2 text-right text-gray-600">
                                    {item.sourcingType === "customer_provided"
                                      ? "Customer"
                                      : item.sourcingType === "dot_manufactured"
                                      ? "Dot Mfg"
                                      : "Dot Sourced"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pricing Summary */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Pricing Summary</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-300">
                    <tr>
                      <th className="text-left py-2 font-medium text-gray-700">Kit Type</th>
                      <th className="text-right py-2 font-medium text-gray-700">Quantity</th>
                      <th className="text-right py-2 font-medium text-gray-700">Manufacturing</th>
                      <th className="text-right py-2 font-medium text-gray-700">Assembly</th>
                      <th className="text-right py-2 font-medium text-gray-700">Extended Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {project.projectKits.map((pk) => (
                      <tr key={pk.id}>
                        <td className="py-2 text-gray-900">{pk.kitName}</td>
                        <td className="py-2 text-right text-gray-900">{pk.quantity.toLocaleString()}</td>
                        <td className="py-2 text-right text-gray-900">
                          ${pk.manufactureCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-2 text-right text-gray-900">
                          ${pk.assemblyCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-2 text-right font-semibold text-gray-900">
                          ${pk.extendedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t-2 border-gray-400">
                    <tr>
                      <td colSpan={2} className="py-3 font-bold text-gray-900">
                        Total Program Cost
                      </td>
                      <td className="py-3 text-right font-semibold text-gray-900">
                        ${project.totalManufactureCost.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-3 text-right font-semibold text-gray-900">
                        ${project.totalAssemblyCost.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-3 text-right text-lg font-bold text-blue-600">
                        ${project.totalProjectCost.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Sourcing Notes */}
            {hasCustomerProvided && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-yellow-900 mb-2">
                  Customer-Furnished Components
                </h3>
                <p className="text-sm text-yellow-800">
                  This project includes customer-provided components. Production timelines are dependent
                  on timely delivery of customer-furnished materials. Components must meet quality
                  specifications and be delivered in the specified packaging format.
                </p>
              </div>
            )}

            {/* Terms & Conditions */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Terms & Conditions</h2>
              <div className="text-sm text-gray-700 space-y-2">
                <p>
                  <strong>Payment Terms:</strong> Net 30 from date of invoice. Payment due upon completion
                  of work unless otherwise agreed upon in writing.
                </p>
                <p>
                  <strong>Lead Time:</strong> Standard lead time is 4-6 weeks from receipt of approved
                  purchase order and any customer-furnished materials.
                </p>
                <p>
                  <strong>Order Quantities:</strong> Final order quantities may exceed initial estimates to
                  account for buffer percentages, MOQs, and print efficiency optimization.
                </p>
                <p>
                  <strong>Changes:</strong> Any changes to the scope of work must be approved in writing and
                  may result in adjustments to pricing and timeline.
                </p>
              </div>
            </div>

            {/* Signature Block */}
            <div className="border-t pt-6 mt-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-4">Dot Representative:</p>
                  <div className="border-b border-gray-400 mb-2 pb-8"></div>
                  <p className="text-xs text-gray-500">Signature</p>
                  <div className="mt-4">
                    <div className="border-b border-gray-400 mb-2 pb-4"></div>
                    <p className="text-xs text-gray-500">Date</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-4">Customer Representative:</p>
                  <div className="border-b border-gray-400 mb-2 pb-8"></div>
                  <p className="text-xs text-gray-500">Signature</p>
                  <div className="mt-4">
                    <div className="border-b border-gray-400 mb-2 pb-4"></div>
                    <p className="text-xs text-gray-500">Date</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
