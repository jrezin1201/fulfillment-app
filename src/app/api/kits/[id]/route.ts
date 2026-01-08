import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/kits/[id] - Get single kit with BOM
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const kit = await prisma.kit.findUnique({
      where: { id },
      include: {
        bomLineItems: {
          include: {
            component: true,
          },
        },
      },
    });

    if (!kit) {
      return NextResponse.json(
        { error: "Kit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(kit);
  } catch (error) {
    console.error("Error fetching kit:", error);
    return NextResponse.json(
      { error: "Failed to fetch kit" },
      { status: 500 }
    );
  }
}

// PUT /api/kits/[id] - Update kit
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const kit = await prisma.kit.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        distributionModel: body.distributionModel,
        fulfillmentModel: body.fulfillmentModel,
        isActive: body.isActive,
      },
    });

    return NextResponse.json(kit);
  } catch (error) {
    console.error("Error updating kit:", error);
    return NextResponse.json(
      { error: "Failed to update kit" },
      { status: 500 }
    );
  }
}

// DELETE /api/kits/[id] - Delete kit
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.kit.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting kit:", error);
    return NextResponse.json(
      { error: "Failed to delete kit" },
      { status: 500 }
    );
  }
}
