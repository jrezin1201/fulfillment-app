import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/components/[id] - Get single component
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const component = await prisma.component.findUnique({
      where: { id },
      include: {
        bomLineItems: {
          include: {
            kit: true,
          },
        },
      },
    });

    if (!component) {
      return NextResponse.json(
        { error: "Component not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(component);
  } catch (error) {
    console.error("Error fetching component:", error);
    return NextResponse.json(
      { error: "Failed to fetch component" },
      { status: 500 }
    );
  }
}

// PUT /api/components/[id] - Update component
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const component = await prisma.component.update({
      where: { id },
      data: {
        name: body.name,
        sku: body.sku,
        description: body.description,
        category: body.category,
        defaultSourcingType: body.defaultSourcingType,
        defaultVendor: body.defaultVendor,
        unitCost: body.unitCost ? parseFloat(body.unitCost) : undefined,
        currency: body.currency,
        moq: body.moq ? parseInt(body.moq) : null,
        leadTimeDays: body.leadTimeDays ? parseInt(body.leadTimeDays) : null,
        isAtRisk: body.isAtRisk,
        riskNotes: body.riskNotes,
      },
    });

    return NextResponse.json(component);
  } catch (error) {
    console.error("Error updating component:", error);
    return NextResponse.json(
      { error: "Failed to update component" },
      { status: 500 }
    );
  }
}

// DELETE /api/components/[id] - Delete component
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.component.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting component:", error);
    return NextResponse.json(
      { error: "Failed to delete component" },
      { status: 500 }
    );
  }
}
