import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/components
 * List all components
 */
export async function GET() {
  try {
    const components = await prisma.component.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(components);
  } catch (error) {
    console.error("Error fetching components:", error);
    return NextResponse.json(
      { error: "Failed to fetch components" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/components
 * Create a new component
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const component = await prisma.component.create({
      data: {
        name: body.name,
        sku: body.sku || null,
        category: body.category,
        defaultSourcingType: body.defaultSourcingType,
        unitCost: parseFloat(body.unitCost),
        moq: body.moq ? parseInt(body.moq) : null,
        leadTimeDays: body.leadTimeDays ? parseInt(body.leadTimeDays) : null,
        isAtRisk: body.isAtRisk || false,
        defaultVendor: body.defaultVendor || null,
        riskNotes: body.riskNotes || null,
      },
    });

    return NextResponse.json(component, { status: 201 });
  } catch (error) {
    console.error("Error creating component:", error);
    return NextResponse.json(
      { error: "Failed to create component" },
      { status: 500 }
    );
  }
}
