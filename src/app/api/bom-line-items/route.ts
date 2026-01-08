import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/bom-line-items - Add component to kit BOM
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const bomLineItem = await prisma.bomLineItem.create({
      data: {
        kitId: body.kitId,
        componentId: body.componentId,
        unitsPerKit: parseFloat(body.unitsPerKit),
        bufferPercent: body.bufferPercent ? parseFloat(body.bufferPercent) : 2.0,
        sourcingType: body.sourcingType,
        vendor: body.vendor,
        requiresReceiving: body.requiresReceiving || false,
        requiresQa: body.requiresQa || false,
        dependencyNotes: body.dependencyNotes,
        unitCostOverride: body.unitCostOverride ? parseFloat(body.unitCostOverride) : null,
        handlingSurcharge: body.handlingSurcharge ? parseFloat(body.handlingSurcharge) : 0,
      },
      include: {
        component: true,
        kit: true,
      },
    });

    return NextResponse.json(bomLineItem, { status: 201 });
  } catch (error) {
    console.error("Error creating BOM line item:", error);
    return NextResponse.json(
      { error: "Failed to create BOM line item" },
      { status: 500 }
    );
  }
}
