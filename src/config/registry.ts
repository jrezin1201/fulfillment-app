/**
 * Module Registry
 *
 * Central registry of all modules for the "Sales Catalog" view.
 * Maps module IDs to their metadata (name, description, icon, category, route).
 */

import { type FeatureId } from "./site-config";

export interface ModuleMetadata {
  id: FeatureId;
  name: string;
  description: string;
  icon: string; // Emoji or icon name
  category: ModuleCategory;
  route: string;
  tags?: string[];
  isNew?: boolean;
  isPro?: boolean;
}

export type ModuleCategory =
  | "User Management"
  | "Manufacturing"
  | "Fulfillment"
  | "Business Tools";

export const moduleRegistry: Record<FeatureId, ModuleMetadata> = {
  auth: {
    id: "auth",
    name: "User & Security",
    description:
      "Complete authentication system with NextAuth.js, OAuth providers, session management, and role-based access control",
    icon: "🔐",
    category: "User Management",
    route: "/auth/signin",
    tags: ["authentication", "oauth", "security"],
  },

  projects: {
    id: "projects",
    name: "Projects & Quotes",
    description:
      "Create and manage quote/SOW projects. Select kit types, configure quantities, calculate pricing, and generate statements of work",
    icon: "📋",
    category: "Business Tools",
    route: "/projects",
    tags: ["quotes", "sow", "projects", "pricing"],
  },

  kits: {
    id: "kits",
    name: "Kit Management",
    description:
      "Define and manage kit types (Bulk Fit, DTC A1c, etc.). Configure distribution models, fulfillment settings, and bill of materials",
    icon: "📦",
    category: "Manufacturing",
    route: "/kits",
    tags: ["kits", "bom", "manufacturing"],
  },

  components: {
    id: "components",
    name: "Component Library",
    description:
      "Manage component inventory, sourcing, and pricing. Track lead times, MOQs, vendor information, and risk factors",
    icon: "🔧",
    category: "Manufacturing",
    route: "/components-library",
    tags: ["components", "inventory", "sourcing", "vendors"],
  },

  "sow-generator": {
    id: "sow-generator",
    name: "SOW Generator",
    description:
      "Generate professional statements of work from project data. Export to PDF with detailed BOMs, pricing breakdowns, and terms",
    icon: "📄",
    category: "Business Tools",
    route: "/projects",
    tags: ["sow", "documents", "pdf", "export"],
  },

  instructions: {
    id: "instructions",
    name: "Instructions & Docs",
    description:
      "Complete setup guide, how-to documentation, current architecture explanation, and API integration guide",
    icon: "📚",
    category: "Business Tools",
    route: "/instructions",
    tags: ["help", "documentation", "guide", "tutorial"],
  },
};

/**
 * Get all modules grouped by category
 */
export function getModulesByCategory(): Record<
  ModuleCategory,
  ModuleMetadata[]
> {
  const grouped: Record<ModuleCategory, ModuleMetadata[]> = {
    "User Management": [],
    Manufacturing: [],
    Fulfillment: [],
    "Business Tools": [],
  };

  Object.values(moduleRegistry).forEach((module) => {
    grouped[module.category].push(module);
  });

  return grouped;
}

/**
 * Get module by ID
 */
export function getModule(id: FeatureId): ModuleMetadata | undefined {
  return moduleRegistry[id];
}

/**
 * Get all modules as array
 */
export function getAllModules(): ModuleMetadata[] {
  return Object.values(moduleRegistry);
}

/**
 * Search modules by name, description, or tags
 */
export function searchModules(query: string): ModuleMetadata[] {
  const lowerQuery = query.toLowerCase();

  return getAllModules().filter((module) => {
    const matchesName = module.name.toLowerCase().includes(lowerQuery);
    const matchesDescription = module.description
      .toLowerCase()
      .includes(lowerQuery);
    const matchesTags = module.tags?.some((tag) =>
      tag.toLowerCase().includes(lowerQuery)
    );

    return matchesName || matchesDescription || matchesTags;
  });
}
