/**
 * Pricing Calculation Engine
 *
 * Handles the decision tree for kit fulfillment pricing:
 * 1. Is the component customer-provided?
 * 2. How many must be ordered? (with buffer)
 * 3. Lead time & risk adjustment
 */

export interface Component {
  id: string;
  name: string;
  defaultSourcingType: string;
  unitCost: number;
  moq?: number;
  leadTimeDays?: number;
  isAtRisk: boolean;
}

export interface BomLineItem {
  id: string;
  componentId: string;
  componentName: string;
  component?: Component;
  unitsPerKit: number;
  bufferPercent: number;
  sourcingType: string;
  unitCostOverride?: number;
  handlingSurcharge: number;
  requiresReceiving: boolean;
  requiresQa: boolean;
}

export interface PricingResult {
  componentCost: number;
  handlingCost: number;
  totalManufactureCost: number;
  assemblyCost: number;
  totalCost: number;
  orderQuantity: number;
  warnings: string[];
}

/**
 * Calculate order quantity with buffer
 */
export function calculateOrderQuantity(
  unitsPerKit: number,
  totalKits: number,
  bufferPercent: number = 2.0,
  moq?: number
): { quantity: number; warnings: string[] } {
  const warnings: string[] = [];

  // Base calculation: units per kit × total kits
  const baseQuantity = unitsPerKit * totalKits;

  // Add buffer for scrap, QA, future builds
  const buffer = baseQuantity * (bufferPercent / 100);
  let finalQuantity = Math.ceil(baseQuantity + buffer);

  // Check MOQ
  if (moq && finalQuantity < moq) {
    warnings.push(
      `Order quantity (${finalQuantity}) is below MOQ (${moq}). Recommended: ${moq} units.`
    );
    finalQuantity = moq;
  }

  // Optimize for print efficiency (round up to nearest 100 for large orders)
  if (finalQuantity > 1000) {
    const optimized = Math.ceil(finalQuantity / 100) * 100;
    if (optimized > finalQuantity) {
      warnings.push(
        `Rounding to ${optimized} units for print efficiency (saves setup costs)`
      );
      finalQuantity = optimized;
    }
  }

  return { quantity: finalQuantity, warnings };
}

/**
 * Calculate component costs based on sourcing type
 */
export function calculateComponentCost(
  bomLineItem: BomLineItem,
  totalKits: number
): {
  cost: number;
  handlingCost: number;
  orderQuantity: number;
  warnings: string[];
} {
  const { component, unitsPerKit, bufferPercent, sourcingType, unitCostOverride, handlingSurcharge } = bomLineItem;

  if (!component) {
    return { cost: 0, handlingCost: 0, orderQuantity: 0, warnings: ["Component not found"] };
  }

  // Step 1: Is the component customer-provided?
  if (sourcingType === "customer_provided") {
    // Exclude from "Manufacture & Source" costs
    // Include only receiving/inspection/kitting costs
    const orderQty = calculateOrderQuantity(unitsPerKit, totalKits, bufferPercent);

    const handlingCost = orderQty.quantity * handlingSurcharge;

    const warnings = [
      ...orderQty.warnings,
      "Customer-provided: Delivery date required",
      "Production timeline dependent on customer delivery",
    ];

    if (bomLineItem.requiresReceiving || bomLineItem.requiresQa) {
      warnings.push("Includes receiving/inspection/QA handling");
    }

    return {
      cost: 0, // No sourcing cost
      handlingCost,
      orderQuantity: orderQty.quantity,
      warnings,
    };
  }

  // Step 2: Component must be sourced by Dot
  const orderQty = calculateOrderQuantity(unitsPerKit, totalKits, bufferPercent, component.moq);

  // Use override price if provided, otherwise use default
  const unitPrice = unitCostOverride ?? component.unitCost;

  const componentCost = orderQty.quantity * unitPrice;
  const handlingCost = orderQty.quantity * handlingSurcharge;

  const warnings = [...orderQty.warnings];

  // Step 3: Lead time & risk adjustment
  if (component.isAtRisk) {
    warnings.push(`⚠️ AT-RISK COMPONENT: ${component.name}`);
  }

  if (component.leadTimeDays) {
    if (component.leadTimeDays > 14) {
      warnings.push(`Lead time: ${component.leadTimeDays} days (may impact schedule)`);
    }
  }

  if (sourcingType === "dot_sourced") {
    warnings.push("Dot-sourced: Standard lead time applies");
  } else if (sourcingType === "dot_manufactured") {
    warnings.push("Dot-manufactured: Internal production");
  }

  return {
    cost: componentCost,
    handlingCost,
    orderQuantity: orderQty.quantity,
    warnings,
  };
}

/**
 * Calculate total project pricing
 */
export function calculateProjectPricing(
  bomLineItems: BomLineItem[],
  totalKits: number,
  assemblyCostPerKit: number = 15.0 // Default assembly cost
): PricingResult {
  let totalManufactureCost = 0;
  let totalHandlingCost = 0;
  let totalOrderQuantity = 0;
  const allWarnings: string[] = [];

  // Calculate costs for each component
  for (const lineItem of bomLineItems) {
    const result = calculateComponentCost(lineItem, totalKits);
    totalManufactureCost += result.cost;
    totalHandlingCost += result.handlingCost;
    totalOrderQuantity += result.orderQuantity;
    allWarnings.push(...result.warnings);
  }

  // Assembly & Fulfillment costs
  const assemblyCost = totalKits * assemblyCostPerKit;

  // Total cost breakdown
  const totalCost = totalManufactureCost + totalHandlingCost + assemblyCost;

  return {
    componentCost: totalManufactureCost,
    handlingCost: totalHandlingCost,
    totalManufactureCost: totalManufactureCost + totalHandlingCost,
    assemblyCost,
    totalCost,
    orderQuantity: totalOrderQuantity,
    warnings: allWarnings,
  };
}

/**
 * Generate SOW clause for customer-furnished materials
 */
export function generateCustomerFurnishedClause(bomLineItems: BomLineItem[]): string | null {
  const customerProvided = bomLineItems.filter((item) => item.sourcingType === "customer_provided");

  if (customerProvided.length === 0) {
    return null;
  }

  const componentNames = customerProvided
    .map((item) => item.component?.name || "Unknown component")
    .join(", ");

  return `**Customer-Furnished Components**

The following components will be supplied by the customer and are excluded from sourcing costs: ${componentNames}.

Dot will receive, inspect, and kit these components as part of the assembly process. Production timelines are dependent on timely delivery of customer-furnished materials.

**Requirements:**
- Delivery date must be confirmed
- Packaging format must be specified
- Components must meet quality specifications

**Note:** Delays in customer-furnished materials may impact delivery schedule.`;
}

/**
 * Generate sourcing clause for Dot-sourced components
 */
export function generateDotSourcingClause(bomLineItems: BomLineItem[]): string | null {
  const dotSourced = bomLineItems.filter(
    (item) => item.sourcingType === "dot_sourced" || item.sourcingType === "dot_manufactured"
  );

  if (dotSourced.length === 0) {
    return null;
  }

  return `**Component Sourcing**

Dot will source and/or manufacture all components listed in the BOM. Order quantities may exceed initial build quantities to account for print efficiency, spoilage, and future program needs.`;
}
