"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Component {
  id: string;
  name: string;
  sku?: string;
  defaultSourcingType: string;
  unitCost: number;
}

interface BomLineItem {
  id: string;
  componentId: string;
  componentName: string;
  componentSku?: string;
  unitsPerKit: number;
  bufferPercent: number;
  sourcingType: string;
  unitCost: number;
}

interface Kit {
  id: string;
  name: string;
  description?: string;
  distributionModel: string;
  fulfillmentModel: string;
  isActive: boolean;
  bomLineItems: BomLineItem[];
}

export default function KitDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [kit, setKit] = useState<Kit | null>(null);
  const [components, setComponents] = useState<Component[]>([]);
  const [showAddComponent, setShowAddComponent] = useState(false);
  const [formData, setFormData] = useState({
    componentId: "",
    unitsPerKit: "",
    bufferPercent: "2.0",
    sourcingType: "",
  });

  useEffect(() => {
    // Load kit from localStorage
    const kits = JSON.parse(localStorage.getItem("kits") || "[]");
    const foundKit = kits.find((k: Kit) => k.id === params.id);
    if (foundKit) {
      if (!foundKit.bomLineItems) {
        foundKit.bomLineItems = [];
      }
      setKit(foundKit);
    }

    // Load components
    const comps = JSON.parse(localStorage.getItem("components") || "[]");
    setComponents(comps);
  }, [params.id]);

  const handleAddComponent = () => {
    if (!kit || !formData.componentId || !formData.unitsPerKit) return;

    const component = components.find((c) => c.id === formData.componentId);
    if (!component) return;

    const newBomItem: BomLineItem = {
      id: Date.now().toString(),
      componentId: component.id,
      componentName: component.name,
      componentSku: component.sku,
      unitsPerKit: parseFloat(formData.unitsPerKit),
      bufferPercent: parseFloat(formData.bufferPercent),
      sourcingType: formData.sourcingType || component.defaultSourcingType,
      unitCost: component.unitCost,
    };

    const updatedKit = {
      ...kit,
      bomLineItems: [...kit.bomLineItems, newBomItem],
    };

    // Save to localStorage
    const kits = JSON.parse(localStorage.getItem("kits") || "[]");
    const updatedKits = kits.map((k: Kit) =>
      k.id === kit.id ? updatedKit : k
    );
    localStorage.setItem("kits", JSON.stringify(updatedKits));

    setKit(updatedKit);
    setShowAddComponent(false);
    setFormData({
      componentId: "",
      unitsPerKit: "",
      bufferPercent: "2.0",
      sourcingType: "",
    });
  };

  const handleRemoveComponent = (bomItemId: string) => {
    if (!kit) return;

    const updatedKit = {
      ...kit,
      bomLineItems: kit.bomLineItems.filter((item) => item.id !== bomItemId),
    };

    // Save to localStorage
    const kits = JSON.parse(localStorage.getItem("kits") || "[]");
    const updatedKits = kits.map((k: Kit) =>
      k.id === kit.id ? updatedKit : k
    );
    localStorage.setItem("kits", JSON.stringify(updatedKits));

    setKit(updatedKit);
  };

  if (!kit) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading kit...</p>
      </div>
    );
  }

  const totalComponents = kit.bomLineItems.length;
  const customerProvided = kit.bomLineItems.filter(
    (item) => item.sourcingType === "customer_provided"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/kits"
          className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center"
        >
          ← Back to Kits
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">{kit.name}</h1>
        {kit.description && (
          <p className="mt-2 text-gray-600">{kit.description}</p>
        )}
      </div>

      {/* Kit Info */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Kit Configuration</h3>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Distribution</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {kit.distributionModel === "bulk" ? "Bulk" : "Direct-to-Consumer"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Fulfillment</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {kit.fulfillmentModel === "b2b" ? "B2B Bulk" : "B2C API-Driven"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Total Components</dt>
              <dd className="mt-1 text-sm text-gray-900">{totalComponents}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Customer-Provided</dt>
              <dd className="mt-1 text-sm text-gray-900">{customerProvided}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* BOM Management */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Bill of Materials (BOM)</h3>
            <button
              onClick={() => setShowAddComponent(!showAddComponent)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              {showAddComponent ? "Cancel" : "+ Add Component"}
            </button>
          </div>

          {showAddComponent && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Component</label>
                  <select
                    value={formData.componentId}
                    onChange={(e) => {
                      const comp = components.find((c) => c.id === e.target.value);
                      setFormData({
                        ...formData,
                        componentId: e.target.value,
                        sourcingType: comp?.defaultSourcingType || "",
                      });
                    }}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select a component...</option>
                    {components.map((comp) => (
                      <option key={comp.id} value={comp.id}>
                        {comp.name} {comp.sku && `(${comp.sku})`} - ${comp.unitCost.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Units per Kit</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.unitsPerKit}
                    onChange={(e) => setFormData({ ...formData, unitsPerKit: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Buffer %</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.bufferPercent}
                    onChange={(e) => setFormData({ ...formData, bufferPercent: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">Scrap/overbuild percentage</p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Sourcing Type</label>
                  <select
                    value={formData.sourcingType}
                    onChange={(e) => setFormData({ ...formData, sourcingType: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="dot_sourced">Dot Sourced</option>
                    <option value="dot_manufactured">Dot Manufactured</option>
                    <option value="customer_provided">Customer Provided</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleAddComponent}
                  disabled={!formData.componentId || !formData.unitsPerKit}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Add to BOM
                </button>
              </div>
            </div>
          )}

          {kit.bomLineItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No components in BOM yet.</p>
              <button
                onClick={() => setShowAddComponent(true)}
                className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Add your first component →
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Component
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Units/Kit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Buffer %
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Sourcing
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Unit Cost
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {kit.bomLineItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.componentName}</div>
                        {item.componentSku && (
                          <div className="text-sm text-gray-500">{item.componentSku}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.unitsPerKit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.bufferPercent}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.sourcingType === "dot_sourced" && "Dot Sourced"}
                        {item.sourcingType === "dot_manufactured" && "Dot Manufactured"}
                        {item.sourcingType === "customer_provided" && (
                          <span className="text-orange-600 font-medium">Customer Provided</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${item.unitCost.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleRemoveComponent(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {components.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            No components available. <Link href="/components-library" className="font-medium underline">Add components</Link> to your library first.
          </p>
        </div>
      )}
    </div>
  );
}
