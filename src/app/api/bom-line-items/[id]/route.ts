import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT /api/bom-line-items/[id] - Update BOM line item
export async function PUT(
  request: NextRequest,
  segmentData: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await segmentData.params;
    const body = await request.json();

    const bomLineItem = await prisma.bomLineItem.update({
      where: { id },
      data: {
        unitsPerKit: body.unitsPerKit ? parseFloat(body.unitsPerKit) : undefined,
        bufferPercent: body.bufferPercent ? parseFloat(body.bufferPercent) : undefined,
        sourcingType: body.sourcingType,
        vendor: body.vendor,
        requiresReceiving: body.requiresReceiving,
        requiresQa: body.requiresQa,
        dependencyNotes: body.dependencyNotes,
        unitCostOverride: body.unitCostOverride ? parseFloat(body.unitCostOverride) : null,
        handlingSurcharge: body.handlingSurcharge ? parseFloat(body.handlingSurcharge) : undefined,
      },
      include: {
        component: true,
        kit: true,
      },
    });

    return NextResponse.json(bomLineItem);
  } catch (error) {
    console.error("Error updating BOM line item:", error);
    return NextResponse.json(
      { error: "Failed to update BOM line item" },
      { status: 500 }
    );
  }
}

// DELETE /api/bom-line-items/[id] - Remove component from kit BOM
export async function DELETE(
  request: NextRequest,
  segmentData: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await segmentData.params;
    await prisma.bomLineItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting BOM line item:", error);
    return NextResponse.json(
      { error: "Failed to delete BOM line item" },
      { status: 500 }
    );
  }
}
