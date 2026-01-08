/**
 * Project Module Types
 */

export interface Project {
  id: string;
  projectName: string;
  customerName?: string;
  status: "draft" | "quoted" | "approved" | "in_production" | "completed";
  targetShipDate?: Date;
  fulfillmentModel: "b2b_bulk" | "b2c_api";
  totalManufactureCost: number;
  totalAssemblyCost: number;
  totalProjectCost: number;
  sowGeneratedAt?: Date;
  sowPdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  projectKits: ProjectKit[];
}

export interface ProjectKit {
  id: string;
  kitId: string;
  quantity: number;
  manufactureCost: number;
  assemblyCost: number;
  extendedTotal: number;
  kit?: {
    id: string;
    name: string;
    description?: string;
    distributionModel: string;
    fulfillmentModel: string;
  };
}

export interface CreateProjectInput {
  projectName: string;
  customerName?: string;
  targetShipDate?: Date;
  fulfillmentModel: "b2b_bulk" | "b2c_api";
}

export interface AddKitToProjectInput {
  projectId: string;
  kitId: string;
  quantity: number;
}
