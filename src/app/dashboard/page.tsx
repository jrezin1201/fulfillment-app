import Link from "next/link";
import { moduleRegistry } from "@/config/registry";

export default function DashboardPage() {
  const modules = Object.values(moduleRegistry).filter((m) => m.id !== "auth");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to Dot Fulfillment - Kit-based manufacturing and fulfillment management
        </p>
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
