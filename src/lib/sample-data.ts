/**
 * Sample Data Seeding Utility
 *
 * Provides demo data for testing the Dot Fulfillment app
 * without manual data entry.
 */

export interface Component {
  id: string;
  name: string;
  sku?: string;
  category: string;
  defaultSourcingType: string;
  unitCost: number;
  moq?: number;
  leadTimeDays?: number;
  isAtRisk: boolean;
  vendorName?: string;
  notes?: string;
}

export interface BomLineItem {
  id: string;
  componentId: string;
  componentName: string;
  unitsPerKit: number;
  bufferPercent: number;
  sourcingType: string;
  unitCost: number;
  unitCostOverride?: number;
  handlingSurcharge: number;
  requiresReceiving: boolean;
  requiresQa: boolean;
}

export interface Kit {
  id: string;
  name: string;
  description?: string;
  distributionModel: string;
  fulfillmentModel: string;
  isActive: boolean;
  bomLineItems: BomLineItem[];
}

export interface Project {
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
  projectKits: any[];
}

/**
 * Generate sample components
 */
export function generateSampleComponents(): Component[] {
  return [
    {
      id: "comp-1",
      name: "Polymedco Blood Collection Tube",
      sku: "POLY-001",
      category: "Tubes",
      defaultSourcingType: "dot_sourced",
      unitCost: 2.50,
      moq: 1000,
      leadTimeDays: 14,
      isAtRisk: false,
      vendorName: "Polymedco",
      notes: "Standard EDTA tube, 3mL capacity",
    },
    {
      id: "comp-2",
      name: "Pre-Printed Barcode Label",
      sku: "LBL-002",
      category: "Labels",
      defaultSourcingType: "dot_manufactured",
      unitCost: 0.15,
      moq: 5000,
      leadTimeDays: 7,
      isAtRisk: false,
      vendorName: "Internal Print Shop",
      notes: "Thermal transfer, 2x1 inch",
    },
    {
      id: "comp-3",
      name: "Insulated Shipping Box",
      sku: "PKG-003",
      category: "Packaging",
      defaultSourcingType: "dot_sourced",
      unitCost: 3.75,
      moq: 500,
      leadTimeDays: 10,
      isAtRisk: false,
      vendorName: "Cold Chain Corp",
      notes: "Fits 1-2 tubes with gel pack",
    },
    {
      id: "comp-4",
      name: "Patient Instructions Card",
      sku: "DOC-004",
      category: "Documentation",
      defaultSourcingType: "dot_manufactured",
      unitCost: 0.25,
      moq: 1000,
      leadTimeDays: 5,
      isAtRisk: false,
      vendorName: "Internal Print Shop",
      notes: "Full-color, laminated",
    },
    {
      id: "comp-5",
      name: "Gel Ice Pack",
      sku: "COLD-005",
      category: "Cold Chain",
      defaultSourcingType: "dot_sourced",
      unitCost: 1.20,
      moq: 1000,
      leadTimeDays: 14,
      isAtRisk: true,
      vendorName: "ColdSource Inc",
      notes: "Reusable, non-toxic - VENDOR AT RISK",
    },
    {
      id: "comp-6",
      name: "Return Shipping Label",
      sku: "LBL-006",
      category: "Labels",
      defaultSourcingType: "dot_sourced",
      unitCost: 0.50,
      moq: 2000,
      leadTimeDays: 7,
      isAtRisk: false,
      vendorName: "FedEx",
      notes: "Pre-paid ground shipping",
    },
    {
      id: "comp-7",
      name: "Lancet Device",
      sku: "LANC-007",
      category: "Collection Devices",
      defaultSourcingType: "customer_provided",
      unitCost: 0.00,
      leadTimeDays: 0,
      isAtRisk: false,
      notes: "Customer-provided - no cost",
    },
    {
      id: "comp-8",
      name: "Alcohol Prep Pad",
      sku: "PREP-008",
      category: "Collection Supplies",
      defaultSourcingType: "dot_sourced",
      unitCost: 0.08,
      moq: 5000,
      leadTimeDays: 7,
      isAtRisk: false,
      vendorName: "MedSupply Co",
      notes: "Sterile, individually wrapped",
    },
    {
      id: "comp-9",
      name: "Biohazard Bag",
      sku: "BAG-009",
      category: "Packaging",
      defaultSourcingType: "dot_sourced",
      unitCost: 0.30,
      moq: 1000,
      leadTimeDays: 10,
      isAtRisk: false,
      vendorName: "MedPack Inc",
      notes: "6x9 inch, red print",
    },
    {
      id: "comp-10",
      name: "A1c Test Reagent Strip",
      sku: "REAG-010",
      category: "Test Materials",
      defaultSourcingType: "customer_provided",
      unitCost: 0.00,
      leadTimeDays: 0,
      isAtRisk: false,
      notes: "Customer-provided test strips",
    },
  ];
}

/**
 * Generate sample kits with BOMs
 */
export function generateSampleKits(components: Component[]): Kit[] {
  // Helper to create BOM line items
  const createBomItem = (
    componentId: string,
    unitsPerKit: number,
    bufferPercent: number = 2.0,
    handlingSurcharge: number = 0
  ): BomLineItem => {
    const component = components.find((c) => c.id === componentId)!;
    return {
      id: `bom-${componentId}-${Date.now()}`,
      componentId,
      componentName: component.name,
      unitsPerKit,
      bufferPercent,
      sourcingType: component.defaultSourcingType,
      unitCost: component.unitCost,
      handlingSurcharge,
      requiresReceiving: component.defaultSourcingType === "customer_provided",
      requiresQa: component.defaultSourcingType === "customer_provided",
    };
  };

  return [
    {
      id: "kit-1",
      name: "Bulk Fit Kit",
      description: "Bulk fulfillment kit for fitness testing program",
      distributionModel: "bulk",
      fulfillmentModel: "b2b_bulk",
      isActive: true,
      bomLineItems: [
        createBomItem("comp-1", 1, 2.0), // Blood tube
        createBomItem("comp-2", 1, 2.0), // Barcode label
        createBomItem("comp-4", 1, 2.0), // Instructions
        createBomItem("comp-8", 2, 3.0), // Alcohol pads (2 per kit)
        createBomItem("comp-9", 1, 2.0), // Biohazard bag
      ],
    },
    {
      id: "kit-2",
      name: "DTC Fit Kit",
      description: "Direct-to-consumer fitness testing with cold chain",
      distributionModel: "dtc",
      fulfillmentModel: "b2c_api",
      isActive: true,
      bomLineItems: [
        createBomItem("comp-1", 1, 2.0), // Blood tube
        createBomItem("comp-2", 1, 2.0), // Barcode label
        createBomItem("comp-3", 1, 2.0), // Insulated box
        createBomItem("comp-4", 1, 2.0), // Instructions
        createBomItem("comp-5", 1, 2.5), // Gel pack (AT-RISK)
        createBomItem("comp-6", 1, 2.0), // Return label
        createBomItem("comp-8", 2, 3.0), // Alcohol pads
        createBomItem("comp-9", 1, 2.0), // Biohazard bag
      ],
    },
    {
      id: "kit-3",
      name: "DTC A1c Kit",
      description: "Direct-to-consumer A1c testing kit with customer-provided reagents",
      distributionModel: "dtc",
      fulfillmentModel: "b2c_api",
      isActive: true,
      bomLineItems: [
        createBomItem("comp-1", 1, 2.0), // Blood tube
        createBomItem("comp-2", 1, 2.0), // Barcode label
        createBomItem("comp-3", 1, 2.0), // Insulated box
        createBomItem("comp-4", 1, 2.0), // Instructions
        createBomItem("comp-5", 1, 2.5), // Gel pack
        createBomItem("comp-6", 1, 2.0), // Return label
        createBomItem("comp-7", 1, 2.0, 0.50), // Lancet (customer-provided, $0.50 handling)
        createBomItem("comp-8", 2, 3.0), // Alcohol pads
        createBomItem("comp-9", 1, 2.0), // Biohazard bag
        createBomItem("comp-10", 1, 2.0, 0.75), // Test strips (customer-provided, $0.75 handling)
      ],
    },
    {
      id: "kit-4",
      name: "Bulk KED Kit",
      description: "Bulk kit for ketone testing program (simplified)",
      distributionModel: "bulk",
      fulfillmentModel: "b2b_bulk",
      isActive: true,
      bomLineItems: [
        createBomItem("comp-1", 1, 2.0), // Blood tube
        createBomItem("comp-2", 1, 2.0), // Barcode label
        createBomItem("comp-4", 1, 2.0), // Instructions
        createBomItem("comp-9", 1, 2.0), // Biohazard bag
      ],
    },
  ];
}

/**
 * Generate sample projects with populated kits and pricing
 */
export function generateSampleProjects(): Project[] {
  return [
    // Example 1: Large B2B Bulk Program
    {
      id: "proj-1",
      projectName: "Q1 2026 - Acme Fitness Corp (10,000 Kits)",
      customerName: "Acme Fitness Corporation",
      status: "quoted",
      targetShipDate: "2026-03-15",
      fulfillmentModel: "b2b_bulk",
      totalManufactureCost: 63750.00, // 5000*3.75 + 5000*9.00
      totalAssemblyCost: 150000.00,   // 10000*15
      totalProjectCost: 213750.00,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
      projectKits: [
        {
          id: "pk-1-1",
          kitId: "kit-1",
          kitName: "Bulk Fit Kit",
          quantity: 5000,
          manufactureCost: 18750.00, // ~$3.75/kit for components
          assemblyCost: 75000.00,    // $15/kit * 5000
          extendedTotal: 93750.00,
          warnings: [
            "Rounding to 5100 units for print efficiency (saves setup costs)",
            "Dot-sourced: Standard lead time applies",
          ],
        },
        {
          id: "pk-1-2",
          kitId: "kit-4",
          kitName: "Bulk KED Kit",
          quantity: 5000,
          manufactureCost: 45000.00, // ~$9.00/kit for components
          assemblyCost: 75000.00,    // $15/kit * 5000
          extendedTotal: 120000.00,
          warnings: [
            "Rounding to 5100 units for print efficiency (saves setup costs)",
          ],
        },
      ],
    },

    // Example 2: DTC Program with Customer-Provided Components
    {
      id: "proj-2",
      projectName: "DTC A1c Program - HealthTech Startup (3,000 Kits)",
      customerName: "HealthTech Innovations",
      status: "in_production",
      targetShipDate: "2026-02-01",
      fulfillmentModel: "b2c_api",
      totalManufactureCost: 25500.00,  // $8.50/kit * 3000
      totalAssemblyCost: 45000.00,     // $15/kit * 3000
      totalProjectCost: 70500.00,
      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days ago
      projectKits: [
        {
          id: "pk-2-1",
          kitId: "kit-3",
          kitName: "DTC A1c Kit",
          quantity: 3000,
          manufactureCost: 25500.00, // $8.50/kit (includes $1.25 handling for customer items)
          assemblyCost: 45000.00,    // $15/kit * 3000
          extendedTotal: 70500.00,
          warnings: [
            "Customer-provided: Delivery date required",
            "Production timeline dependent on customer delivery",
            "Includes receiving/inspection/QA handling",
            "Rounding to 3100 units for print efficiency (saves setup costs)",
            "⚠️ AT-RISK COMPONENT: Gel Ice Pack",
            "Lead time: 14 days (may impact schedule)",
          ],
        },
      ],
    },

    // Example 3: High-Volume DTC Cold Chain Program
    {
      id: "proj-3",
      projectName: "Enterprise DTC Fitness - National Rollout (25,000 Kits)",
      customerName: "FitLife National Wellness",
      status: "approved",
      targetShipDate: "2026-04-01",
      fulfillmentModel: "b2c_api",
      totalManufactureCost: 287500.00, // $11.50/kit * 25000
      totalAssemblyCost: 375000.00,    // $15/kit * 25000
      totalProjectCost: 662500.00,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      projectKits: [
        {
          id: "pk-3-1",
          kitId: "kit-2",
          kitName: "DTC Fit Kit",
          quantity: 25000,
          manufactureCost: 287500.00, // $11.50/kit for all components with cold chain
          assemblyCost: 375000.00,    // $15/kit * 25000
          extendedTotal: 662500.00,
          warnings: [
            "Rounding to 25100 units for print efficiency (saves setup costs)",
            "⚠️ AT-RISK COMPONENT: Gel Ice Pack",
            "Lead time: 14 days (may impact schedule)",
            "Dot-sourced: Standard lead time applies",
            "Order quantity (51020) is below MOQ (5000). Recommended: 5000 units.",
          ],
        },
      ],
    },
  ];
}

/**
 * Seed all sample data to localStorage
 */
export function seedSampleData(): {
  components: Component[];
  kits: Kit[];
  projects: Project[];
} {
  const components = generateSampleComponents();
  const kits = generateSampleKits(components);
  const projects = generateSampleProjects();

  localStorage.setItem("components", JSON.stringify(components));
  localStorage.setItem("kits", JSON.stringify(kits));
  localStorage.setItem("projects", JSON.stringify(projects));

  return { components, kits, projects };
}

/**
 * Clear all data from localStorage
 */
export function clearAllData(): void {
  localStorage.removeItem("components");
  localStorage.removeItem("kits");
  localStorage.removeItem("projects");
}

/**
 * Check if sample data exists
 */
export function hasSampleData(): boolean {
  const components = localStorage.getItem("components");
  const kits = localStorage.getItem("kits");
  const projects = localStorage.getItem("projects");

  return !!(components && kits && projects);
}
